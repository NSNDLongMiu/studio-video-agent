import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  analyzeVoiceEdges, auditAudio, auditVisual, auditNarrative, pcmEvidence, PIPELINE, QC_THRESHOLDS, auditRenderedHeader, auditRenderedText, auditVisualText, CAPTION_BAND, checkOpening,
  conceptWindows, countSyllables, D8_LIMITS, intervalCoverage, LAYOUT_SAME_DIFF,
  measureTextOverlap, motionFindings, PACING, parseCaptionStyles, PROFILES, sceneStats, sceneVoiceTiming, selectProfile,
  speechIntervals, SUBTITLE_MAX_CHARS, SUBTITLE_MAX_PX, SUBTITLE_MIN_PX, SUBTITLE_PREFERRED_MAX_PX,
  TEXT_AUDIT_LIMITS, textWords, usesExtendedChecks, validateRenderLog, validateSceneFields,
} from './scene-metrics.mjs';

const TOOLS = path.dirname(fileURLToPath(import.meta.url));
const THRESHOLD_VERSION = QC_THRESHOLDS.version;
const SOUND_DESIGN = JSON.parse(fs.readFileSync(new URL('./audio/sound-design.json', import.meta.url), 'utf8'));
const PROSODY = JSON.parse(fs.readFileSync(new URL('./voice/prosody.json', import.meta.url), 'utf8'));
// Ngưỡng thử cho các phép đo độc lập với hồ sơ.
const LIMITS = {
  ...QC_THRESHOLDS.measure,
  cue_chars: SUBTITLE_MAX_CHARS, caption_min_px: SUBTITLE_MIN_PX, caption_max_px: SUBTITLE_MAX_PX,
  caption_band: CAPTION_BAND, layout_diff: LAYOUT_SAME_DIFF, opening_min_s: PIPELINE.opening.min_s,
  opening_max_s: PIPELINE.opening.max_s,
};
const FRAME = { width: 360, height: 640 };
const BOARD = { cols: 4, rows: 2 };
// Giới hạn số mốc trong một biểu thức select để tránh tràn bộ phân tích của FFmpeg.
const SAMPLE_BATCH_SIZE = 64;
const HEADER_GRID = { cols: 4, limit: 12, hidden: 3, height: 420, width_px: 216, height_px: 84 };
const UNAVAILABLE = 'không đo được';
const UNCHECKED = 'CHƯA KIỂM';
const OK = 'đã đo';
const INFO = 'thông tin';
const WARN = 'cảnh báo';
const ERROR = 'lỗi';
const VISUAL_FIRST = 'Visual-first';
const number = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 3 });
const fmt = (value) => Number.isFinite(value) ? number.format(value) :
  typeof value === 'boolean' ? (value ? 'Đạt' : 'Có lỗi') : '—';
const seconds = (start, end) => end == null || end === start ? `${fmt(start)} s` : `${fmt(start)}–${fmt(end)} s`;
const readText = (file) => fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
const readJson = (file) => JSON.parse(readText(file));
const withinError = (value, limit) => value - limit > 1e-9;
const measured = (data) => ({ status: OK, ...data });
const unavailable = (reason, data) => ({ status: UNAVAILABLE, reason, ...data });
const unchecked = (reason, data) => ({ status: UNCHECKED, reason, ...data });

function attempt(action) {
  try {
    return action();
  } catch (error) {
    return unavailable(error.message);
  }
}

function run(command, args, options) {
  return spawnSync(command, args, {
    shell: false, windowsHide: true, encoding: 'utf8', maxBuffer: 128 * 1024 * 1024, ...options,
  });
}

function diagnostic(result) {
  return result.error?.message || result.stderr?.toString().trim().split(/\r?\n/).slice(-2).join(' ') ||
    `mã thoát ${result.status ?? 'không có'}`;
}

function checked(command, args, options) {
  const result = run(command, args, options);
  if (result.status !== 0) throw new Error(`${command}: ${diagnostic(result)}`);
  return result;
}

function runQc(script, args) {
  const result = run(process.execPath, [path.join(TOOLS, script), ...args]);
  if (![0, 1].includes(result.status) || !result.stdout.trim()) {
    throw new Error(`${script}: ${diagnostic(result)}`);
  }
  return measured({ exit_code: result.status, result: JSON.parse(result.stdout) });
}

function probeMedia(file) {
  const args = ['-v', 'error', '-of', 'json', '-show_format', '-show_streams', file];
  const { format, streams } = JSON.parse(checked('ffprobe', args).stdout);
  const video = streams.find(({ codec_type }) => codec_type === 'video');
  const audio = streams.find(({ codec_type }) => codec_type === 'audio');
  const [n, d] = (video?.avg_frame_rate ?? '').split('/').map(Number);
  const duration = Number(format.duration);
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('ffprobe không trả thời lượng hợp lệ.');
  const containerStart = Number(format.start_time ?? 0);
  const audioEnd = audio?.duration == null ? duration : Number(audio.start_time ?? containerStart) - containerStart + Number(audio.duration);
  return measured({
    duration_s: duration, size_bytes: Number(format.size), container_start_s: containerStart, format_name: format.format_name,
    fps: d ? n / d : null, width: video?.width ?? null, height: video?.height ?? null,
    video_codec: video?.codec_name ?? null, pixel_format: video?.pix_fmt ?? null,
    audio_codec: audio?.codec_name ?? null, audio_channels: audio?.channels ?? null,
    audio_sample_rate: audio ? Number(audio.sample_rate) : null, audio_end_s: audio ? Math.min(duration, audioEnd) : null,
  });
}

function readTimeline(episode) {
  const direct = path.join(episode, 'assets', 'scenes.json');
  const fallback = path.join(episode, 'assets', '_scratch', 'timeline.json');
  const fromDirect = fs.existsSync(direct);
  const source = fromDirect ? direct : fallback;
  if (!fs.existsSync(source)) return unavailable('Thiếu assets/scenes.json và assets/_scratch/timeline.json.');
  const data = readJson(source);
  const rows = fromDirect ? data : data?.rows;
  if (!Array.isArray(rows) || !rows.length || !rows.every((scene) =>
    typeof scene?.id === 'string' && scene.id.trim() && Number.isFinite(scene.start) &&
    Number.isFinite(scene.end) && scene.start >= 0 && scene.end > scene.start) ||
    new Set(rows.map(({ id }) => id)).size !== rows.length) {
    return unavailable('Danh sách cảnh phải có mã duy nhất và mốc start/end hợp lệ.', { source });
  }
  const invalid_fields = [];
  const scenes = rows.map((scene) => {
    const { id, start, end } = scene;
    const { fields, invalid } = fromDirect ? validateSceneFields(scene) : { fields: {}, invalid: [] };
    if (invalid.length) invalid_fields.push({ id, start, end, fields: invalid });
    return { id, start, end, ...fields };
  }).sort((a, b) => a.start - b.start);
  const useDirect = fromDirect && rows.every(({ id }, index) => scenes[index].id === id);
  const has_metadata = scenes.some((scene) => Object.keys(scene).length > 3);
  return measured({ source, scenes, normalized: !useDirect, invalid_fields, has_metadata });
}

function measureSilence(file, audioEnd, videoEnd) {
  if (!Number.isFinite(audioEnd)) throw new Error('ffprobe không tìm thấy mốc kết thúc luồng âm thanh.');
  const { stderr } = checked('ffmpeg', [
    '-hide_banner', '-nostats', '-i', file, '-map', '0:a:0', '-vn',
    '-af', `silencedetect=noise=${LIMITS.silence_db}dB:d=${LIMITS.silence_min_s}`, '-f', 'null', '-',
  ]);
  const silences = [];
  let start = null;
  for (const [, type, value] of stderr.matchAll(/silence_(start|end):\s*(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)/gi)) {
    if (type === 'start') start = Math.max(0, Number(value));
    else if (start !== null) {
      const end = Math.min(Number(value), videoEnd);
      if (end > start) silences.push({ start, end, length: end - start });
      start = null;
    }
  }
  if (start !== null && start <= audioEnd) silences.push({ start, end: audioEnd, length: audioEnd - start });
  const last = silences.at(-1);
  let tail = null;
  if (last && last.end >= audioEnd - 0.0001) {
    tail = last;
    tail.end = videoEnd;
    tail.length = tail.end - tail.start;
  } else if (withinError(videoEnd, audioEnd)) {
    tail = { start: audioEnd, end: videoEnd, length: videoEnd - audioEnd };
    if (tail.length >= LIMITS.silence_min_s) silences.push(tail);
  }
  const voiced_intervals = speechIntervals(silences, videoEnd);
  const voiced_s = voiced_intervals.reduce((sum, { start, end }) => sum + end - start, 0);
  const pause_ratio = Math.max(0, 1 - voiced_s / videoEnd);
  const longest_pause = silences.reduce((best, gap) => !best || gap.length > best.length ? gap : best, null);
  return measured({
    silences, long_pauses: silences.filter(({ length }) => !withinError(LIMITS.long_pause_s, length)),
    tail_s: tail?.length ?? 0, tail, audio_end_s: audioEnd, voiced_intervals, voiced_s, pause_ratio, longest_pause,
  });
}

function readVoiceEdges(file, probe, timeline, stem, lineWindows) {
  const source = stem ?? 'MP4';
  if (source === 'MP4' && !probe.audio_codec) throw new Error('Thiếu luồng âm thanh trong MP4.');
  const { rate } = D8_LIMITS.voice_edges;
  const { stdout } = checked('ffmpeg', [
    '-v', 'error', '-i', source === 'MP4' ? file : source, '-map', '0:a:0', '-vn', '-ac', '1',
    '-af', 'aresample=' + rate + ':async=1:first_pts=0', '-f', 'f32le', '-',
  ], { encoding: 'buffer' });
  if (!stdout.length) throw new Error('FFmpeg không trả mẫu âm thanh.');
  const samples = new Float32Array(stdout.buffer, stdout.byteOffset, stdout.byteLength / 4);
  const windows = (timeline.scenes ?? []).flatMap(({ id, voice }) => (voice ?? []).map((window) => ({ ...window, scene: id })))
    .sort((a, b) => a.start - b.start);
  const { envelope, ...stats } = analyzeVoiceEdges(samples, windows.length ? windows : lineWindows.map((line) => ({ ...line, scene: line.scene_id })));
  const { sentence_count, measured_count, flagged_count, violation_pct } = stats;
  const fail = violation_pct !== null && violation_pct >= D8_LIMITS.voice_edges.fail_pct;
  const voice_edges = measured_count === sentence_count && sentence_count ?
    measured({ source, ...stats, ok: flagged_count === 0, technical_fail: fail }) :
    unchecked(sentence_count ? 'Có cửa sổ lời chưa đo được.' : 'Thiếu cửa sổ voice[] trong assets/scenes.json.',
      { source, ...stats, ok: flagged_count ? false : null, technical_fail: fail });
  return { voice_edges, envelope };
}

const EDGE_PLOT = String.raw`
import json, sys
from PIL import Image, ImageDraw, ImageFont

plots = json.load(sys.stdin)
image = Image.new("RGB", (900, 184 * ((len(plots) + 1) // 2)), "#101820")
draw = ImageDraw.Draw(image)
for font_name in ("arial.ttf", "DejaVuSans.ttf"):
    try:
        font = ImageFont.truetype(font_name, 12)
        edge_names = {"head": "Đầu câu", "tail": "Cuối câu"}
        break
    except OSError:
        pass
else:
    font = ImageFont.load_default()
    edge_names = {"head": "Head", "tail": "Tail"}
for i, plot in enumerate(plots):
    x, y = 450 * (i % 2) + 44, 184 * (i // 2) + 28
    width, height = 384, 120
    def level(db):
        return y + height * (-max(-120, min(0, db))) / 120
    for db in (0, -40, -55, -60, -120):
        draw.line((x, level(db), x + width, level(db)), fill="#394858")
        if db != -55:
            draw.text((x - 40, level(db) - 5), str(db), fill="#bdd0e0")
    draw.line((x + width / 2, y, x + width / 2, y + height), fill="#ffad65")
    points = [(x + width * j / (len(plot["levels"]) - 1), level(db)) for j, db in enumerate(plot["levels"])]
    draw.line(points, fill="#6de0ee", width=2)
    edge = edge_names[plot["edge"]]
    draw.text((x, y - 19), "dBFS | #%d | %s | %.3f s" % (plot["i"] + 1, edge, plot["time_s"]), fill="#ffffff", font=font)
    for offset, label in ((0, "-60 ms"), (width / 2 - 12, "0 ms"), (width - 40, "+60 ms")):
        draw.text((x + offset, y + height + 5), label, fill="#bdd0e0")
image.save(sys.argv[1])
`;

function captureVoiceEdges(out, edges, envelope) {
  if (!edges.violations.length) return null;
  const { edge_db, frame_ms, rise_ms, fall_ms, jump_db, plot_ms, plot_limit } = D8_LIMITS.voice_edges;
  const score = (item) => Math.max(item.level_db - edge_db, (item.jump_db ?? 0) - jump_db,
    item.ramp_ms === null ? 0 : (item.edge === 'head' ? rise_ms : fall_ms) - item.ramp_ms);
  const radius = plot_ms / 2 / frame_ms;
  const plots = [...edges.violations].sort((a, b) => score(b) - score(a)).slice(0, plot_limit).map((item) => {
    const center = Math.round(1000 * item.time_s / frame_ms);
    const levels = Array.from({ length: 2 * radius + 1 }, (_, i) => envelope[center - radius + i] ?? -120);
    return { i: item.i, time_s: item.time_s, edge: item.edge, levels };
  });
  const file = 'voice-edges.png';
  return { kind: 'voice_edges', file, points: plots.map(({ i, edge, time_s }) => ({ i, edge, time_s })),
    start: Math.max(0, Math.min(...plots.map(({ time_s }) => time_s)) - plot_ms / 2000),
    end: Math.max(...plots.map(({ time_s }) => time_s)) + plot_ms / 2000,
    ...attempt(() => {
      checked('python', ['-c', EDGE_PLOT, path.join(out, file)], { input: JSON.stringify(plots) });
      return measured({});
    }) };
}

function readRenderEvidence(episode) {
  const file = path.join(episode, 'assets', 'render-log.json');
  if (!fs.existsSync(file)) return { reason: 'thiếu nhật ký dựng' };
  try {
    return { log: validateRenderLog(readJson(file)) };
  } catch (error) {
    return { reason: 'nhật ký dựng không hợp lệ. ' + error.message };
  }
}

function measureSourceVoice(episode, explicit, videoDuration) {
  const root = path.join(episode, 'assets', 'voice');
  const candidates = [path.join(episode, 'assets', 'audio', 'stems', 'voice.wav'), ...(explicit ? [explicit] : [])];
  if (!explicit && fs.existsSync(root)) {
    const versions = fs.readdirSync(root, { withFileTypes: true }).filter((item) => item.isDirectory())
      .map(({ name }) => name).sort();
    candidates.push(...versions.map((name) => path.join(root, name, 'compact', 'voice.wav')),
      path.join(root, 'voice-final.wav'), path.join(root, 'voice.wav'));
  }
  const rejected = [];
  const { duration_tolerance_s } = D8_LIMITS.speech_pace_voice;
  for (const source of candidates) {
    if (!fs.existsSync(source) && source !== explicit) continue;
    const result = attempt(() => {
      if (!fs.statSync(source).isFile() || path.extname(source).toLowerCase() !== '.wav') throw new Error('Cần tệp WAV.');
      if (!Number.isFinite(videoDuration)) throw new Error('Thiếu thời lượng MP4 để đối chiếu.');
      const { audio_end_s, duration_s, format_name } = probeMedia(source);
      if (format_name !== 'wav' || !Number.isFinite(audio_end_s)) throw new Error('Không tìm thấy luồng âm thanh WAV.');
      if (withinError(Math.abs(duration_s - videoDuration), duration_tolerance_s)) {
        throw new Error(`Thời lượng WAV ${fmt(duration_s)} s lệch MP4 ${fmt(videoDuration)} s quá ${duration_tolerance_s} s.`);
      }
      const silence = measureSilence(source, audio_end_s, duration_s);
      const { voiced_s } = silence;
      if (!(voiced_s > 0)) throw new Error('WAV thiếu thời lượng có tiếng theo silencedetect.');
      return measured({ ...silence, source, duration_s, rejected });
    });
    if (result.status === OK) return result;
    rejected.push({ source, reason: result.reason });
  }
  return unchecked(rejected.length ? 'Không có WAV phù hợp với video.' : 'Thiếu WAV giọng gốc.', { rejected });
}

function measureSpeechPace(episode, audio, voice) {
  const source = path.join(episode, 'assets', 'voice', 'apply.json');
  if (!fs.existsSync(source)) return unavailable('Thiếu assets/voice/apply.json.', { source });
  if (!(audio.voiced_s > 0) && !(voice.voiced_s > 0)) return unavailable('Thiếu thời lượng có tiếng theo silencedetect.', { source });
  const syllables = countSyllables(readJson(source));
  if (!syllables) return unavailable('apply.json không có cụm chữ hoặc số để đếm.', { source });
  return measured({ source, syllables, speech_pace_syll_s: audio.voiced_s > 0 ? syllables / audio.voiced_s : null,
    speech_pace_voice_syll_s: voice.voiced_s > 0 ? syllables / voice.voiced_s : null });
}

function measureInformation(timeline, audio, duration) {
  if (timeline.status !== OK) return unavailable(timeline.reason);
  const scenes = timeline.scenes.map(({ id, start, end, complexity, concepts }) => ({
    id, start, end, duration_s: end - start, complexity: complexity ?? null, concepts: concepts ?? null,
    ...(audio.status === OK ? sceneVoiceTiming({ start, end }, audio.voiced_intervals) :
      { last_voice_end: null, hold_after_voice_s: null, cut_during_speech: null }),
  }));
  const complexity = Object.fromEntries(Object.keys(PACING.complexity).map((level) => {
    const group = scenes.filter((scene) => scene.complexity === level);
    const holds = group.map(({ hold_after_voice_s }) => hold_after_voice_s).filter(Number.isFinite);
    return [level, {
      count: group.length,
      mean_scene_s: group.length ? group.reduce((sum, scene) => sum + scene.duration_s, 0) / group.length : null,
      min_hold_after_voice_s: holds.length ? Math.min(...holds) : null,
    }];
  }));
  const declared = scenes.filter(({ concepts }) => concepts !== null);
  const concepts = declared.length ? declared.reduce((sum, scene) => sum + scene.concepts, 0) : null;
  return measured({
    scenes, complexity, concepts, concepts_per_min: concepts !== null && duration > 0 ? 60 * concepts / duration : null,
    concept_windows: duration > 0 ? conceptWindows(declared, duration) : [],
    missing_scene_ids: scenes.filter((scene) => scene.complexity === null || scene.concepts === null).map(({ id }) => id),
  });
}

function measureVoiceSync(timeline, audio) {
  if (timeline.status !== OK) return unavailable(timeline.reason);
  const declared = timeline.scenes.flatMap(({ id, voice }) => (voice ?? []).map((interval) => ({ id, ...interval })));
  if (!declared.length) return unavailable('Chưa khai báo khoảng voice trong assets/scenes.json.');
  if (!audio.voiced_intervals?.length) return unavailable('Silencedetect không trả mốc bắt đầu tiếng.');
  const matches = declared.map(({ id, start, end }) => {
    const best = audio.voiced_intervals.reduce((nearest, voice) =>
      Math.abs(voice.start - start) < Math.abs(nearest.start - start) ? voice : nearest);
    const offset = best.start - start;
    return { id, start, end, actual_start_s: best.start, offset_s: offset, warning: withinError(Math.abs(offset), LIMITS.voice_sync_s) };
  });
  const offsets = matches.map(({ offset_s }) => Math.abs(offset_s));
  return measured({ matches, max_offset_s: Math.max(...offsets), mean_offset_s: offsets.reduce((sum, offset) => sum + offset, 0) / offsets.length });
}

const SRT_TIME = '(\\d{2,}:\\d{2}:\\d{2}[,.]\\d{3})';
const SRT_RANGE = new RegExp(`^\\s*${SRT_TIME}\\s*-->\\s*${SRT_TIME}(?:\\s.*)?$`);
function srtSeconds(stamp) {
  const [h, m, s, ms] = stamp.split(/[:,.]/).map(Number);
  return h * 3600 + m * 60 + s + ms / 1000;
}

function alignCues(cues, audio) {
  if (audio.status !== OK) return unavailable('Thiếu phép đo khoảng lặng để khớp mốc bắt đầu tiếng.');
  const pauses = audio.silences.filter((gap) => gap !== audio.tail && !withinError(LIMITS.sentence_pause_s, gap.length));
  const matches = [];
  const used = new Set();
  for (const [index, cue] of cues.entries()) {
    const previous = cues[index - 1];
    const sentenceBoundary = /[.!?…][»”"'\])]*$/.test(previous?.lines.at(-1)?.trim() ?? '');
    const candidates = pauses.filter((pause) => {
      if (used.has(pause) || pause.start > cue.start) return false;
      if (!previous) return pause.start === 0;
      if (pause.end >= previous.end) return true;
      // Cue gối nhau vẫn có thể bắt đầu câu mới sau khi tiếng đã vào.
      // Với cue nối cùng câu, bỏ khoảng lặng đã kết thúc trong cue trước.
      return sentenceBoundary && pause.end > (previous.start + cue.start) / 2;
    });
    const gap = candidates.reduce((best, candidate) =>
      !best || Math.abs(candidate.end - cue.start) < Math.abs(best.end - cue.start) ? candidate : best, null);
    if (!gap) continue;
    used.add(gap);
    const offset = cue.start - gap.end;
    matches.push({
      cue: cue.number, start: cue.start, end: cue.end, speech_start_s: gap.end, offset_s: offset,
      silence_start_s: gap.start, silence_length_s: gap.length,
      warning: withinError(Math.abs(offset), LIMITS.sync_s),
    });
  }
  return measured({ matches });
}

function readCaptions(file, audio) {
  if (!fs.existsSync(file)) return unavailable('Thiếu final/captions.srt.');
  const content = readText(file).replace(/\r\n?/g, '\n').trim();
  if (!content) return unavailable('final/captions.srt không có cue.');
  const cues = content.split(/\n[ \t]*\n+/).map((block, index) => {
    const rows = block.split('\n');
    const hasNumber = /^\d+$/.test(rows[0].trim());
    const match = SRT_RANGE.exec(rows[hasNumber ? 1 : 0] ?? '');
    if (!match) throw new Error(`Cue thứ ${index + 1} trong captions.srt có mốc không hợp lệ.`);
    const start = srtSeconds(match[1]);
    const end = srtSeconds(match[2]);
    if (end <= start) throw new Error(`Cue thứ ${index + 1} trong captions.srt có mốc kết thúc không hợp lệ.`);
    const lines = rows.slice(hasNumber ? 2 : 1);
    return {
      number: hasNumber ? Number(rows[0]) : index + 1, start, end, duration_s: end - start, lines,
      line_chars: lines.map((line) => [...line.replace(/<[^>]*>/g, '').normalize('NFC')].length),
    };
  }).sort((a, b) => a.start - b.start);
  return measured({
    source: file, cue_count: cues.length, max_lines: Math.max(...cues.map(({ lines }) => lines.length)),
    max_chars: Math.max(0, ...cues.flatMap(({ line_chars }) => line_chars)), cues, sync: alignCues(cues, audio),
  });
}

function readAss(episode) {
  const files = ['final/captions.ass', 'assets/_scratch/captions.ass'];
  const inEpisode = files.find((file) => fs.existsSync(path.join(episode, file)));
  if (!inEpisode) return unavailable('Thiếu captions.ass ở final/ và assets/_scratch/.');
  const source = path.join(episode, inEpisode);
  const data = parseCaptionStyles(readText(source));
  const style = data.styles.filter(({ px }) => px !== null)
    .reduce((largest, item) => !largest || item.px > largest.px ? item : largest, null);
  if (!style) return unavailable('ASS không có style được dùng trong Dialogue với Fontsize hợp lệ.', { source, ...data });
  const bands = data.styles.map(({ band_ok }) => band_ok);
  return measured({
    source, ...data, style: style.name, fontsize: style.fontsize, caption_px: style.px,
    caption_band_ok: bands.includes(false) ? false : bands.every((ok) => ok === true) ? true : null,
  });
}

function readAuditVoice(episode) {
  const source = path.join(episode, 'assets', 'voice', 'apply.json');
  if (!fs.existsSync(source)) return unavailable('Thiếu assets/voice/apply.json.');
  const rows = readJson(source);
  if (!Array.isArray(rows)) return unavailable('apply.json phải là mảng các dòng lời.', { invalid: ['apply.json'] });
  const invalid = [];
  const lines = rows.flatMap((line, index) => {
    // Một số tập cũ chỉ khai tts. Trường này không phải lời nguyên văn.
    if (typeof line?.text === 'string') return [line];
    if (line?.text !== undefined || typeof line?.tts !== 'string') invalid.push(`apply.json[${index}].text`);
    return [];
  }).filter(({ text }) => textWords(text).length);
  return lines.length ? measured({ source, lines, invalid }) :
    unavailable('apply.json không có dòng text nguyên văn để so sánh.', { source, invalid });
}

function measureTextAudit(declarations, storyboard, timeline, voice, subtitles, duration) {
  const audit = auditVisualText(declarations, timeline.scenes ?? [], voice.lines ?? [], duration);
  const cues = subtitles.srt.cues;
  const caption_words_total = cues?.reduce((sum, { lines }) => sum +
    lines.reduce((words, line) => words + textWords(line.replace(/<[^>]*>/g, '')).length, 0), 0) ?? null;
  const result = {
    ...audit, voice: voice.status === OK ? measured({ source: voice.source }) : unavailable(voice.reason),
    invalid_voice_fields: voice.invalid ?? [],
    caption_words_total, caption_coverage_pct: cues ? intervalCoverage(cues, duration) : null,
    caption_to_label_ratio: audit.text_words_total > 0 && caption_words_total !== null ?
      caption_words_total / audit.text_words_total : null,
    caption_px: subtitles.ass.caption_px ?? null, caption_band_ok: subtitles.ass.caption_band_ok ?? null,
  };
  if (storyboard.status !== OK) return unavailable(storyboard.reason, result);
  if (audit.text_words_total === null && audit.keyword_visual_pct === null &&
    !audit.scenes.some(({ has_plan }) => has_plan)) {
    return unavailable('Storyboard không khai chữ minh hoạ hoặc semantic_plan.', result);
  }
  return measured(result);
}

function consecutiveRuns(scenes, field) {
  const runs = [];
  let current = null;
  for (const { id, start, end, [field]: value } of scenes) {
    if (!value) {
      current = null;
      continue;
    }
    if (current?.value !== value) {
      current = { value, start, end, first_id: id, last_id: id, scene_ids: [], count: 0 };
      runs.push(current);
    }
    current.scene_ids.push(id);
    current.last_id = id;
    current.end = end;
    current.count++;
  }
  return runs;
}

const longest = (runs) => runs.reduce((best, run) => !best || run.count > best.count ? run : best, null);


// Chủ đề nền của cảnh: ưu tiên từ khoá nền chuẩn (Y4: database, code, security, incident, office) xuất hiện sớm nhất trong chuỗi `environment`;
// storyboard viết kiểu "database. Xa: …" hoặc "A · office, ấm, …" đều ra đúng chủ đề. Không có từ khoá thì dùng đoạn trước dấu chấm đầu tiên.
const KNOWN_THEMES = ['database', 'code', 'security', 'incident', 'office'];
function environmentTheme(environment) {
  if (typeof environment !== 'string') return null;
  const text = environment.toLowerCase();
  const found = KNOWN_THEMES.map((theme) => ({ theme, at: text.search(new RegExp(`(?<![\p{L}\p{N}])${theme}(?![\p{L}\p{N}])`, 'u')) }))
    .filter(({ at }) => at >= 0).sort((a, b) => a.at - b.at)[0];
  return found?.theme ?? (environment.split('.')[0].trim() || null);
}

function readStoryboard(episode, timeline) {
  const source = path.join(episode, 'storyboard.json');
  if (!fs.existsSync(source)) return unavailable('Thiếu storyboard.json.');
  const { scenes, opening } = readJson(source);
  if (!Array.isArray(scenes) || !scenes.length) return unavailable('storyboard.json thiếu danh sách cảnh.', { source });
  const declarations = scenes.map((scene) => ({
    id: scene?.scene_id, theme: environmentTheme(scene?.environment),
    shot: scene?.camera?.shot || null, movement: scene?.camera?.movement || null, scene_type: scene?.scene_type || null,
  }));
  const byId = new Map(declarations.map((scene) => [scene.id, scene]));
  if (byId.size !== scenes.length || declarations.some(({ id }) => typeof id !== 'string' || !id.trim())) {
    return unavailable('storyboard.json có mã cảnh thiếu hoặc trùng.', { source });
  }
  const rows = timeline.scenes ?? [];
  const timed = rows.map((scene) => ({ ...byId.get(scene.id), ...scene }));
  const duration = timed.reduce((sum, { start, end }) => sum + end - start, 0);
  const grouped = Map.groupBy(timed.filter(({ theme }) => theme), ({ theme }) => theme);
  const themes = [...grouped].map(([theme, group]) => {
    const length = group.reduce((sum, { start, end }) => sum + end - start, 0);
    return { theme, duration_s: length, pct: 100 * length / duration, count: group.length, scene_ids: group.map(({ id }) => id) };
  }).sort((a, b) => b.duration_s - a.duration_s);
  const themeRuns = consecutiveRuns(timed, 'theme');
  const shotRuns = consecutiveRuns(timed, 'shot');
  const timings = new Map(rows.map(({ id, start, end }) => [id, { start, end }]));
  const cameras = declarations.filter(({ movement }) => movement && movement !== 'static').map(({ id, movement }) =>
    ({ id, movement, ...(timings.get(id) ?? { start: null, end: null }) }));
  return measured({
    source, declarations, cameras, themes, timeline_duration_s: duration || null, theme_runs: themeRuns, shot_runs: shotRuns,
    visual_scenes: scenes, opening,
    distinct_shots: duration ? new Set(shotRuns.map(({ value }) => value)).size : null,
    longest_theme_run: longest(themeRuns), longest_shot_run: longest(shotRuns),
    unmatched_scene_ids: timed.filter(({ id }) => !byId.has(id)).map(({ id }) => id),
  });
}

function measurePronunciation(episode) {
  const dir = path.join(episode, 'assets', 'voice');
  const source = path.join(dir, 'apply.json');
  if (!fs.existsSync(source)) return unavailable('Thiếu assets/voice/apply.json.');
  const extra = path.join(dir, 'pronunciation.local.json');
  const args = [path.join(TOOLS, 'voice', 'phonemes.py'), '--lines', source, '--json'];
  if (fs.existsSync(extra)) args.push('--extra', extra);
  const commands = [['python', []], ['py', ['-3']]];
  const reasons = [];
  let exitCode = null;
  for (const [command, prefix] of commands) {
    const result = run(command, [...prefix, '-B', ...args]);
    if ([0, 1].includes(result.status) && result.stdout.trim()) {
      const data = JSON.parse(result.stdout);
      if (!Array.isArray(data.lines)) throw new Error('phonemes.py không trả danh sách dòng kiểm.');
      const errors = data.lines.flatMap(({ row, label, terms }) =>
        terms.filter(({ ok }) => !ok).map((term) => ({ row, label, ...term })));
      return measured({ source, exit_code: result.status, line_count: data.lines.length, errors });
    }
    if (result.status !== null) exitCode = result.status;
    reasons.push(`${command}: ${diagnostic(result)}`);
  }
  return unavailable(`Không chạy được phép kiểm Python/VieNeu. ${reasons.join(' / ')}`, { source, exit_code: exitCode });
}

function frameTimes(file, containerStart) {
  // Với MP4 xuất bản, PTS của các gói hình cho phép chọn khung theo thứ tự trình chiếu, kể cả khi có B-frame.
  const { stdout } = checked('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0', '-show_packets', '-show_entries', 'packet=pts_time,flags',
    '-of', 'json', file,
  ]);
  const times = JSON.parse(stdout).packets.filter(({ flags }) => !flags?.includes('D')).map(({ pts_time }) =>
    Math.round((Number(pts_time) - containerStart) * 1e6));
  const ordered = [...new Set(times.filter((time) => Number.isFinite(time) && time >= 0))].sort((a, b) => a - b);
  if (!ordered.length) throw new Error('ffprobe không trả mốc PTS của khung hình.');
  return ordered;
}

function atOrAfter(times, seconds) {
  const target = Math.round(seconds * 1e6);
  let lo = 0;
  let hi = times.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (times[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

const selectFrames = (times) => `select='${times.map((time) =>
  `between(t,${(time - 1) / 1e6},${(time + 1) / 1e6})`).join('+')}'`;

function captureSampleBatch(file, times) {
  const { width, height } = FRAME;
  const bytes = width * height * 3;
  const { stdout } = checked('ffmpeg', [
    '-v', 'error', '-i', file, '-map', '0:v:0', '-an', '-sn',
    '-vf', `${selectFrames(times)},scale=${width}:${height}:flags=area,format=rgb24`,
    '-fps_mode', 'passthrough', '-frames:v', String(times.length), '-threads', '1', '-f', 'rawvideo', '-',
  ], { encoding: 'buffer', maxBuffer: bytes * times.length + 1024 * 1024 });
  if (stdout.length !== bytes * times.length) {
    throw new Error(`FFmpeg trả ${stdout.length / bytes}/${times.length} khung theo mốc PTS.`);
  }
  return times.map((time, index) => [time, stdout.subarray(index * bytes, (index + 1) * bytes)]);
}

function captureSamples(file, points) {
  const times = [...new Set(points)].sort((a, b) => a - b);
  const samples = new Map();
  for (let index = 0; index < times.length; index += SAMPLE_BATCH_SIZE) {
    for (const [time, rgb] of captureSampleBatch(file, times.slice(index, index + SAMPLE_BATCH_SIZE))) {
      samples.set(time, rgb);
    }
  }
  return samples;
}

function saveGrid(file, samples, cols, rows) {
  const { width, height } = FRAME;
  const tileStride = width * 3;
  const stride = tileStride * cols;
  const buffer = Buffer.alloc(stride * height * rows);
  for (const [index, sample] of samples.entries()) {
    const col = index % cols;
    const row = Math.floor(index / cols);
    for (let y = 0; y < height; y++) {
      const to = (row * height + y) * stride + col * tileStride;
      sample.copy(buffer, to, y * tileStride, (y + 1) * tileStride);
    }
  }
  checked('ffmpeg', [
    '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${width * cols}x${height * rows}`,
    '-i', '-', '-frames:v', '1', '-threads', '1', '-update', '1', file,
  ], { input: buffer });
}

function meanDifference(first, last) {
  let sum = 0;
  for (let i = 0; i < first.length; i++) sum += Math.abs(first[i] - last[i]);
  return sum / first.length;
}

function imageName(prefix, id) {
  return `${prefix}-${encodeURIComponent(id)}.png`;
}

function captureSceneEvidence(file, out, video, times, motionAlerts, scenes, cameras, textAudit) {
  const boards = [];
  for (let time = 0; time < video.duration_s; time += LIMITS.board_step_s) {
    const frame = times[atOrAfter(times, time)] ?? times.at(-1);
    const index = boards.length % (BOARD.cols * BOARD.rows);
    boards.push({ row: 1 + Math.floor(index / BOARD.cols), col: 1 + index % BOARD.cols, time_s: time, frame_s: frame / 1e6 });
  }
  const warned = new Set(motionAlerts.flatMap(({ scene_ids }) => scene_ids ?? []));
  const targets = cameras.map((camera) => {
    if (camera.start === null) return { ...camera, ...unavailable('Không có mốc cảnh trong timeline.') };
    const first = atOrAfter(times, camera.start);
    const last = atOrAfter(times, camera.end) - 1;
    if (first > last) return { ...camera, ...unavailable('Không có khung nằm trong khoảng cảnh.') };
    return { ...camera, ...measured({ first_s: times[first] / 1e6, last_s: times[last] / 1e6 }) };
  });
  const candidates = targets.filter(({ status }) => status === OK)
    .map(({ id }) => ({ id, kind: 'camera', priority: warned.has(id) ? 0 : 2 }));
  candidates.push(...scenes.filter(({ id }) => warned.has(id)).map(({ id }) => ({ id, kind: 'scene', priority: 1 })));
  candidates.sort((a, b) => a.priority - b.priority);
  const selected = candidates.slice(0, LIMITS.scene_image_limit);
  const textTargets = (textAudit.scenes ?? []).filter(({ start, text_words, weak_reasons }) =>
    start !== null && (text_words > 0 || weak_reasons.length))
    .sort((a, b) => Number(Boolean(b.matches.length || b.weak_reasons.length)) -
      Number(Boolean(a.matches.length || a.weak_reasons.length)) ||
      (b.peaks?.words.count ?? 0) - (a.peaks?.words.count ?? 0) || (b.text_words ?? 0) - (a.text_words ?? 0))
    .slice(0, TEXT_AUDIT_LIMITS.image_limit).map(({ id }) => ({ id, kind: 'textheavy' }));
  const middleTargets = [...selected.filter(({ kind }) => kind === 'scene'), ...textTargets];
  const mids = new Map();
  for (const { id, start, end } of scenes) {
    if (!middleTargets.some((item) => item.id === id)) continue;
    const mid = atOrAfter(times, (start + end) / 2);
    const frame = Math.min(mid, atOrAfter(times, end) - 1);
    if (frame >= atOrAfter(times, start)) mids.set(id, times[frame]);
  }
  const integerTime = (s) => Math.round(s * 1e6);
  const sample = captureSamples(file, [
    ...boards.map(({ frame_s }) => integerTime(frame_s)), ...mids.values(),
    ...targets.filter(({ status }) => status === OK).flatMap(({ first_s, last_s }) => [integerTime(first_s), integerTime(last_s)]),
  ]);
  const get = (s) => sample.get(integerTime(s));
  const images = [];
  const write = (image, buffers, cols, rows) => {
    images.push({ ...image, ...attempt(() => {
      saveGrid(path.join(out, image.file), buffers, cols, rows);
      return measured({});
    }) });
  };
  const pageSize = BOARD.cols * BOARD.rows;
  for (let i = 0; i < boards.length; i += pageSize) {
    const tiles = boards.slice(i, i + pageSize);
    const name = `board-${String(1 + i / pageSize).padStart(2, '0')}.png`;
    write({ kind: 'board', file: name, start: tiles[0].time_s, end: tiles.at(-1).time_s, tiles },
      tiles.map(({ frame_s }) => get(frame_s)), BOARD.cols, BOARD.rows);
  }
  for (const camera of targets) {
    if (camera.status !== OK) continue;
    const first = get(camera.first_s);
    const last = get(camera.last_s);
    camera.mean_diff = meanDifference(first, last);
    if (selected.some(({ kind, id }) => kind === 'camera' && id === camera.id)) {
      write({ kind: 'camera', file: imageName('camera', camera.id), scene_id: camera.id,
        start: camera.first_s, end: camera.last_s }, [first, last], 2, 1);
    }
  }
  for (const { id, kind } of middleTargets) {
    if (!mids.has(id)) continue;
    const frame = mids.get(id);
    write({ kind, file: imageName(kind, id), scene_id: id, start: frame / 1e6, end: frame / 1e6 }, [sample.get(frame)], 1, 1);
  }
  return measured({ images, cameras: targets, omitted_scene_images: candidates.length - selected.length });
}

function captureNoCaptionBoard(episode, out) {
  const source = path.join(episode, 'assets', '_scratch', 'picture.mp4');
  if (!fs.existsSync(source)) return unavailable('thiếu picture.mp4');
  const video = probeMedia(source);
  const times = frameTimes(source, video.container_start_s);
  const count = BOARD.cols * BOARD.rows;
  const points = Array.from({ length: count }, (_, index) => {
    const target = (index + 0.5) * video.duration_s / count;
    return times[atOrAfter(times, target)] ?? times.at(-1);
  });
  const samples = captureSamples(source, points);
  saveGrid(path.join(out, 'nocaption-board.png'), points.map((time) => samples.get(time)), BOARD.cols, BOARD.rows);
  const tiles = points.map((time, index) => ({
    row: 1 + Math.floor(index / BOARD.cols), col: 1 + index % BOARD.cols, frame_s: time / 1e6,
  }));
  return measured({ source, start: tiles[0].frame_s, end: tiles.at(-1).frame_s, tiles });
}

function captureThumbnail(file, out) {
  const name = 'thumb-180x320.png';
  if (!fs.existsSync(file)) return unavailable('Thiếu final/thumbnail.jpg.', { file: name });
  checked('ffmpeg', ['-v', 'error', '-y', '-i', file, '-vf', 'scale=180:320:flags=area',
    '-frames:v', '1', '-threads', '1', '-update', '1', path.join(out, name)]);
  return measured({ kind: 'thumbnail', file: name });
}

function captureFrame(file, out, time, duration, name = `frame-${time}.png`) {
  if (duration != null && time >= duration) return unavailable('Mốc nằm ngoài thời lượng video.', { time_s: time, file: name });
  const { stdout } = checked('ffmpeg', ['-v', 'error', '-ss', String(time), '-i', file, '-map', '0:v:0', '-frames:v', '1',
    '-threads', '1', '-f', 'image2pipe', '-c:v', 'png', '-'], { encoding: 'buffer' });
  if (!stdout.length) return unavailable('FFmpeg không tìm thấy khung ở mốc yêu cầu.', { time_s: time, file: name });
  fs.writeFileSync(path.join(out, name), stdout);
  return measured({ kind: 'frame', file: name, time_s: time, start: time, end: time });
}

function openingEvidence(file, out, video, frames, timeline) {
  const scenes = (timeline.scenes ?? []).filter(({ role }) => role === 'opening')
    .map(({ id, start, end }) => ({ id, start, end, duration_s: end - start }));
  const opening = scenes[0];
  const stamps = opening ? [opening.start, (opening.start + opening.end) / 2, opening.end] : [0.2, 1, 2.5];
  const images = ['start', 'mid', 'end'].map((part, index) => {
    const time = stamps[index];
    const name = `frame-open-${part}.png`;
    const capture = attempt(() => {
      if (frames.status !== OK) return unavailable(frames.reason);
      const { times } = frames;
      let point = atOrAfter(times, time);
      if (opening) {
        point = Math.min(point, atOrAfter(times, opening.end) - 1);
        if (point < atOrAfter(times, opening.start)) return unavailable('Không có khung nằm trong cảnh opening.');
      }
      if (times[point] == null) return unavailable('Không có khung ở mốc yêu cầu.');
      const frame_s = times[point] / 1e6;
      // Lùi vài µs để làm tròn khi seek không làm mất khung đã chọn.
      const image = captureFrame(file, out, Math.max(0, frame_s - 0.000005), video.duration_s, name);
      return { status: image.status, reason: image.reason, frame_s };
    });
    const at = capture.frame_s ?? time;
    return { ...capture, kind: 'opening', file: name, scene_id: opening?.id, time_s: time, start: at, end: at };
  });
  return { ...(images.some(({ status }) => status === OK) ? measured({}) : unavailable('Không chụp được khung opening.')),
    scenes, images, fallback: !opening };
}

function saveHeaderGrid(file, out, times, scenes) {
  const mids = scenes.flatMap(({ id, start, end, header }) => {
    const time = (start + end) / 2;
    const point = Math.min(atOrAfter(times, time), atOrAfter(times, end) - 1);
    return point < atOrAfter(times, start) ? [] : [{ scene_id: id, header: header || null, time_s: time, pts: times[point] }];
  });
  const visible = mids.filter(({ header }) => header);
  const hidden = mids.filter(({ header }) => !header);
  const visibleCount = HEADER_GRID.limit - Math.min(hidden.length, HEADER_GRID.hidden);
  const selected = visible.slice(0, visibleCount);
  selected.push(...hidden.slice(0, HEADER_GRID.limit - selected.length));
  const ordered = [...new Map(selected.sort((a, b) => a.pts - b.pts).map((tile) => [tile.pts, tile])).values()];
  if (!ordered.length) return unavailable('Không có khung giữa cảnh để ghép vùng header.');
  const { cols, height, width_px, height_px } = HEADER_GRID;
  const rows = Math.ceil(ordered.length / cols);
  const filter = [
    selectFrames(ordered.map(({ pts }) => pts)),
    `crop=iw:trunc(ih*${height}/1920/2)*2:0:0`, `scale=${width_px}:${height_px}:flags=area`,
    `tile=${cols}x${rows}:nb_frames=${ordered.length}`,
  ].join(',');
  const { stdout } = checked('ffmpeg', [
    '-v', 'error', '-i', file, '-map', '0:v:0', '-an', '-sn', '-vf', filter, '-frames:v', '1',
    '-threads', '1', '-f', 'image2pipe', '-c:v', 'png', '-',
  ], { encoding: 'buffer' });
  if (!stdout.length) return unavailable('FFmpeg không trả ảnh vùng header.');
  fs.writeFileSync(path.join(out, 'header-zones.png'), stdout);
  const tiles = ordered.map(({ pts, ...tile }, index) => ({
    ...tile, row: 1 + Math.floor(index / cols), col: 1 + index % cols, frame_s: pts / 1e6,
  }));
  return measured({ tiles, start: tiles[0].frame_s, end: tiles.at(-1).frame_s });
}

function captureTextOverlap(video, out, frames, { overlaps, close_pairs }, [width, height]) {
  const pairs = [...overlaps].sort((a, b) => b.intersection_pct - a.intersection_pct)
    .concat([...close_pairs].sort((a, b) => a.gap_px - b.gap_px)).slice(0, D8_LIMITS.text_overlap.image_limit);
  if (!pairs.length) return null;
  const file = 'text-overlap.png';
  return { kind: 'text_overlap', file, ...attempt(() => {
    if (frames.status !== OK) return unavailable(frames.reason);
    const { times } = frames;
    const crops = [];
    const tiles = [];
    const cols = 2;
    for (const { scene, start, end, texts, boxes } of pairs) {
      const mid = (start + end) / 2;
      const point = Math.min(atOrAfter(times, mid), atOrAfter(times, end) - 1);
      if (point < atOrAfter(times, start) || times[point] == null) continue;
      const frame_s = times[point] / 1e6;
      const pad = 32;
      const x = Math.max(0, Math.floor(Math.min(...boxes.map((bbox) => bbox[0])) - pad));
      const y = Math.max(0, Math.floor(Math.min(...boxes.map((bbox) => bbox[1])) - pad));
      const right = Math.min(width, Math.ceil(Math.max(...boxes.map((bbox) => bbox[2])) + pad));
      const bottom = Math.min(height, Math.ceil(Math.max(...boxes.map((bbox) => bbox[3])) + pad));
      if (right <= x || bottom <= y) continue;
      const filter = `crop=iw*${right - x}/${width}:ih*${bottom - y}/${height}:iw*${x}/${width}:ih*${y}/${height}:exact=1,` +
        'scale=504:236:force_original_aspect_ratio=decrease:flags=area,setsar=1,pad=540:270:(ow-iw)/2:(oh-ih)/2:color=0x101820';
      const { stdout } = checked('ffmpeg', ['-v', 'error', '-ss', String(Math.max(0, frame_s - 0.000005)),
        '-i', video, '-map', '0:v:0', '-vf', filter, '-frames:v', '1', '-threads', '1', '-f', 'image2pipe', '-c:v', 'png', '-'],
        { encoding: 'buffer' });
      if (!stdout.length) continue;
      tiles.push({ scene_id: scene, start, end, texts, frame_s, row: 1 + Math.floor(crops.length / cols), col: 1 + crops.length % cols });
      crops.push(stdout);
    }
    if (!tiles.length) return unavailable('Không tìm được khung và vùng cắt cho các cặp chữ.');
    const tile = `tile=${cols}x${Math.ceil(tiles.length / cols)}:nb_frames=${tiles.length}:color=0x101820`;
    const { stdout } = checked('ffmpeg', ['-v', 'error', '-f', 'image2pipe', '-c:v', 'png', '-i', '-', '-vf', tile,
      '-frames:v', '1', '-threads', '1', '-f', 'image2pipe', '-c:v', 'png', '-'],
      { input: Buffer.concat(crops), encoding: 'buffer' });
    if (!stdout.length) return unavailable('FFmpeg không trả ảnh các cặp chữ.');
    fs.writeFileSync(path.join(out, file), stdout);
    return measured({ tiles, start: Math.min(...tiles.map(({ frame_s }) => frame_s)), end: Math.max(...tiles.map(({ frame_s }) => frame_s)) });
  }) };
}

function measureHeader(file, out, frames, timeline, duration) {
  const scenes = timeline.scenes ?? [];
  const visible = scenes.filter(({ header }) => header);
  let duration_s = 0;
  let cursor = 0;
  for (const { start, end } of visible) {
    const to = Math.min(end, duration);
    duration_s += Math.max(0, to - Math.max(start, cursor));
    cursor = Math.max(cursor, to);
  }
  const stats = duration > 0 && timeline.status === OK ?
    measured({ duration_s, pct: 100 * duration_s / duration, scene_ids: visible.map(({ id }) => id) }) :
    unavailable(timeline.reason ?? 'Thiếu thời lượng video.');
  const image = { kind: 'header', file: 'header-zones.png', ...attempt(() => frames.status === OK ?
    saveHeaderGrid(file, out, frames.times, scenes) : unavailable(frames.reason)) };
  return { ...stats, image };
}

function measureD8Header(evidence, timeline, opening, duration) {
  const from = opening.separate_ok ? opening.scenes[0].end : 0;
  const scenes = timeline.scenes ?? [];
  const scope = { start: from, end: duration };
  if (!(duration > from)) return unchecked('Thiếu thời lượng sau opening.', { scope, coverage_pct: null });
  if (evidence.log) {
    return measured({ source: 'render-log', scope, ...auditRenderedHeader(evidence.log, scenes, from, duration) });
  }
  const coverage_pct = scenes.length ? intervalCoverage(scenes.filter(({ header, end }) => header && end > from)
    .map(({ start, end }) => ({ start: Math.max(0, start - from), end: end - from })), duration - from) : null;
  return unchecked(evidence.reason, { source: scenes.length ? 'scenes.json' : null, scope, coverage_pct });
}

function d8Location({ scene, start, end }) {
  return { scene_ids: scene ? [scene] : undefined, start, end };
}

function addVoiceEdgeFindings(add, edges) {
  if (edges.status !== OK) add('voice_edges_unchecked', 'R23', INFO, 'CHƯA KIỂM — ' + edges.reason);
  if (!edges.flagged_count) return;
  const level = edges.technical_fail ? ERROR : WARN;
  const axis = { axis: 'KỸ THUẬT' };
  const reasons = {
    level: 'RMS biên trên −55 dBFS', rise: 'tăng trong chưa đầy một khung 2 ms (cắt cứng)', fall: 'giảm dưới 20 ms', jump: 'bước nhảy trên 30 dB',
  };
  add('voice_edges_rate', 'R23', level, 'Có ' + edges.flagged_count + '/' + edges.measured_count +
    ' câu bị cờ (' + fmt(edges.violation_pct) + '%), gồm ' + edges.head_violations + ' đầu câu và ' +
    edges.tail_violations + ' cuối câu. Ngưỡng lỗi kỹ thuật ' + D8_LIMITS.voice_edges.fail_pct + '%.', axis);
  for (const edge of edges.violations) {
    const label = edge.edge === 'head' ? 'Đầu câu' : 'Cuối câu';
    add('voice_edge', 'R23', level, label + ' ' + (edge.i + 1) + ' tại ' + seconds(edge.time_s) +
      ', cửa sổ ' + seconds(edge.start, edge.end) + ', RMS ' + fmt(edge.level_db) + ' dBFS, thời gian ' +
      (edge.edge === 'head' ? 'tăng ' : 'giảm ') + fmt(edge.ramp_ms) + ' ms' +
      (edge.jump_db === null ? '' : ', bước nhảy ' + fmt(edge.jump_db) + ' dB') + '. ' +
      edge.reasons.map((reason) => reasons[reason]).join(' · ') + '.',
      { ...d8Location(edge), ...axis, voice_index: edge.i, voice_edge: edge.edge });
  }
}

function addD8VisualFindings(add, opening, header, text) {
  const scene = opening.scenes?.[0];
  const where = scene ? sceneLocation(scene) : { start: 0, end: D8_LIMITS.opening.max_s };
  if (opening.layout_ok === false) {
    add('opening_not_separate', 'R20', WARN, 'Cần một cảnh role opening riêng, đứng đầu video.', where);
  } else if (opening.layout_ok === null) {
    add('opening_scene_unchecked', 'R20', INFO, 'CHƯA KIỂM — thiếu timeline cảnh hợp lệ.', where);
  }
  if (opening.duration_ok === false) {
    add('opening_length', 'R20', ERROR, 'Opening dài ' + fmt(scene?.duration_s) +
      ' s, ngoài khoảng ' + PIPELINE.opening.min_s + '–' + PIPELINE.opening.max_s + ' s.', where);
  }
  if (opening.voice_ok === false) {
    add('opening_voice_early', 'R20', WARN, 'Tiếng đầu ở ' + seconds(opening.first_sound_s) +
      (opening.voiced ? '. Cửa sổ lời opening hợp lệ là ' + seconds(PIPELINE.opening.voice_start_min_s,
        PIPELINE.opening.voice_start_max_s) + ' tính từ đầu cảnh.' : '. Cần giữ opening im đến gần hết cảnh.'), where);
  } else if (scene && opening.voice_ok === null) {
    add('opening_voice_unchecked', 'R20', INFO, 'CHƯA KIỂM — thiếu phép đo tiếng đầu từ nguồn giọng phù hợp.', where);
  }
  if (opening.d8_status === UNCHECKED) {
    add('opening_title_unchecked', 'R20', INFO, 'Tiêu đề opening CHƯA KIỂM — ' + opening.reason_d8, where);
  } else if (opening.title_ok === false) {
    const bad = (opening.titles ?? []).map(({ text, px, bbox }) => text + ' (' + px + ' px, ' + bbox.join(', ') + ')');
    add('opening_title', 'R20', WARN, 'Cần tiêu đề ít nhất ' + PIPELINE.opening.title_px_min + ' px trong vùng an toàn ' +
      PIPELINE.frame.safe_bbox.join(', ') + '. ' +
      (bad.length ? bad.join(' · ') : 'Thiếu chữ opening_title trong nhật ký dựng.'), where);
  }

  const { coverage_pct, scope } = header;
  if (coverage_pct !== null && coverage_pct < D8_LIMITS.header.coverage_pct) {
    add('header_coverage', 'R21', WARN, 'Lỗi thiết kế. Header phủ ' + fmt(coverage_pct) + '% sau opening theo ' +
      header.source + '. Ngưỡng thử ' + D8_LIMITS.header.coverage_pct + '%.', { ...scope, classification: 'thiết kế' });
  }
  if (header.render_status !== OK) {
    add('header_render_unchecked', 'R21', INFO, 'Cỡ chữ, ô chuyển và đè nội dung CHƯA KIỂM — ' + header.render_reason, scope);
  }
  for (const item of header.geometry_violations ?? []) {
    add('header_geometry', 'R21', WARN, 'Header ô ' + item.slot + ' chiếm ' + fmt(item.area_pct) + '% khung, ' +
      fmt(item.width_px) + ' × ' + fmt(item.height_px) + ' px. Ngưỡng 9%, 972 × 200 px.', d8Location(item));
  }
  for (const item of header.size_violations ?? []) {
    add('header_font', 'R21', WARN, item.role + ' ở ' + item.slot + (item.px === null ?
      ' thiếu chữ trong bbox hoặc mốc hiện.' : ' cỡ ' + fmt(item.px) + ' px, cần ít nhất ' + item.min_px + ' px.'), d8Location(item));
  }
  for (const item of header.transitions ?? []) {
    if (!item.ok) add('header_slot_transition', 'R21', WARN, 'Đổi ô ' + item.from_slot + ' → ' + item.to_slot +
      ' có ' + fmt(item.transition_s) + ' s cùng hiện giữa hai ô. Kiểm đoạn chuyển 0,3–0,5 s tại ranh giới cảnh. ' +
      'Nhật ký chưa cho biết độ mờ khi chỉ một ô hiện.', d8Location(item));
  }
  for (const item of header.overlaps ?? []) {
    add('header_overlap', 'R21', ERROR, 'Header ' + item.slot + ' [' + item.bbox.join(', ') + '] với «' +
      item.object.name + '» [' + item.object.bbox.join(', ') + '] cách ' + fmt(item.gap_px) + ' px. Cần ít nhất 24 px.',
      d8Location(item));
  }

  const limits = D8_LIMITS.text;
  const coverage = text.scenes_with_text_pct ?? text.planned_scenes_with_text_pct;
  if (coverage !== null && coverage < limits.scenes_with_text_pct) {
    const gaps = text.missing_text_scenes ?? text.planned_scenes_without_text;
    add('render_text_scene_coverage', 'R22', WARN, 'Thiếu keyword. Có chữ minh hoạ ở ' + fmt(coverage) +
      '% cảnh theo ' + text.source + ', ngưỡng thử ' + limits.scenes_with_text_pct + '%.',
      gaps.length ? { start: gaps[0].start, end: gaps.at(-1).end, scene_ids: gaps.map(({ id }) => id) } : {});
  }
  if (text.status !== OK) {
    add('render_text_unchecked', 'R22', INFO, 'Chữ vẽ thật CHƯA KIỂM — ' + text.reason);
    return;
  }
  if (text.words_per_min !== null && (text.words_per_min < limits.min_words_per_min || text.words_per_min > limits.max_words_per_min)) {
    add('render_text_density', 'R22', WARN, 'Đo ' + fmt(text.words_per_min) + ' từ chữ minh hoạ/phút, khoảng thử 20–45.');
  }
  if (text.max_simultaneous_words > limits.simultaneous_words) {
    add('render_text_simultaneous', 'R22', WARN, text.max_simultaneous_words + ' từ chữ minh hoạ hiện đồng thời. Ngưỡng 8.',
      { start: text.peak.start, end: text.peak.end });
  }
  if (text.kinetic_per_25s !== null && text.kinetic_per_25s < limits.kinetic_per_25s) {
    add('render_text_kinetic_rate', 'R22', WARN, 'Đo ' + fmt(text.kinetic_per_25s) + ' lần kinetic/25 s, cần ít nhất 1.');
  }
  for (const items of text.kinetic_repeated) {
    const first = items[0];
    add('render_text_kinetic_repeat', 'R22', WARN, items.length + ' lần kinetic trong cảnh ' + first.scene +
      ', ngưỡng 1/cảnh.', d8Location({ ...first, end: items.at(-1).end }));
  }
  for (const item of text.kinetic_consecutive_scenes) {
    add('render_text_kinetic_consecutive', 'R22', WARN, 'Hai cảnh liền nhau cùng có kinetic.',
      { ...d8Location(item), scene_ids: [item.scene, item.next_scene] });
  }
  for (const item of text.kinetic_close) {
    add('render_text_kinetic_gap', 'R22', WARN, 'Hai lần kinetic cách ' + fmt(item.gap_s) + ' s, ngưỡng 6 s.',
      { ...d8Location(item), scene_ids: [...new Set([item.scene, item.next_scene])] });
  }
  if (text.planned_texts_found_pct !== null && text.planned_texts_found_pct < limits.planned_texts_found_pct) {
    add('render_text_plan_coverage', 'R22', WARN, 'Tìm thấy ' + text.planned_texts_found + '/' + text.planned_texts_count +
      ' mục chữ đúng mốc (±0,5 s). Ngưỡng thử 80%.');
    for (const item of text.missing_planned_texts) {
      add('render_text_planned_missing', 'R22', WARN, 'Thiếu chữ «' + item.text + '» ở mốc ' + seconds(item.start) + '.', d8Location(item));
    }
  }
  for (const item of text.keywords_without_text) {
    if (item.visual) {
      add('render_text_keyword_visual', 'R22', INFO, 'Keyword «' + item.text + '» thiếu chữ. Storyboard khai minh hoạ ' +
        item.form + ' cho hành động hoặc quan hệ.', d8Location(item));
    } else add('render_text_keyword_missing', 'R22', WARN, 'Keyword «' + item.text + '» thiếu chữ vẽ thật.', d8Location(item));
  }
  for (const item of text.unattached_labels) {
    add('render_text_label_gap', 'R22', WARN, 'Nhãn «' + item.text + '» cách đối tượng ' + fmt(item.gap_px) + ' px, ngưỡng 40 px.',
      d8Location(item));
  }
  for (const item of text.labels_without_target) {
    add('render_text_label_target', 'R22', WARN, 'Nhãn «' + item.text + '» thiếu bbox đối tượng.', d8Location(item));
  }
  for (const item of text.verbatim ?? []) {
    add('render_text_verbatim', 'R22', WARN, 'Chữ «' + item.text + '» giống lời «' + item.voice.text + '» ' +
      fmt(item.voice.similarity * 100) + '%.', d8Location(item));
  }
}

function addTextOverlapFindings(add, audit) {
  if (audit.status !== OK) {
    add('text_overlap_unchecked', 'R3', INFO, 'CHƯA KIỂM — ' + audit.reason);
    return;
  }
  for (const item of [...audit.overlaps, ...audit.close_pairs]) {
    const [first, second] = item.texts;
    const overlap = item.intersection_pct > 0;
    const details = overlap ? 'phần giao chiếm ' + fmt(item.intersection_pct) + '% bbox chữ nhỏ hơn' :
      'khe ' + fmt(item.gap_px) + ' px, cần ít nhất ' + D8_LIMITS.text_overlap.gap_px + ' px';
    add(overlap ? 'text_overlap' : 'text_gap', 'R3', overlap ? ERROR : WARN,
      '«' + first + '» và «' + second + '» cùng hiện ở cảnh ' + item.scene + ' tại ' + seconds(item.start, item.end) +
      ', ' + details + '.', { ...d8Location(item), texts: item.texts });
  }
}

const sceneLocation = ({ id, start, end }) => ({ start, end, scene_ids: [id] });

function addInformationFindings(add, information, timeline, profile) {
  const missing = information.missing_scene_ids ?? [];
  if (usesExtendedChecks(profile) && missing.length) {
    add('information_missing', 'Information Pacing', WARN,
      `Thiếu khai báo complexity/concepts cho ${missing.length} cảnh trong assets/scenes.json. Information QC phải làm thủ công.`,
      { scene_ids: missing });
  } else if (usesExtendedChecks(profile) && timeline.status !== OK) {
    add('information_missing', 'Information Pacing', WARN,
      `Thiếu danh sách cảnh để đối chiếu complexity/concepts. Information QC phải làm thủ công. ${timeline.reason}`);
  }
  for (const scene of information.scenes ?? []) {
    const { id, end, duration_s, complexity, concepts, hold_after_voice_s, last_voice_end } = scene;
    const limit = PACING.complexity[complexity];
    if (limit && withinError(limit.min_scene_s, duration_s)) {
      add('complexity_duration', 'Information Pacing', WARN,
        `Cảnh ${id} (${complexity}) dài ${fmt(duration_s)} s, dưới ngưỡng thử ${fmt(limit.min_scene_s)} s.`, sceneLocation(scene));
    }
    if (limit && Number.isFinite(hold_after_voice_s) && withinError(limit.min_hold_s, hold_after_voice_s)) {
      add('hold_after_voice', 'Information Pacing', WARN,
        `Cảnh ${id} (${complexity}) giữ ${fmt(hold_after_voice_s)} s sau lời, dưới ngưỡng thử ${fmt(limit.min_hold_s)} s. Tiếng hết tại ${fmt(last_voice_end)} s.`,
        sceneLocation(scene));
    }
    if (withinError(duration_s, limit?.max_scene_s)) {
      add('complexity_long_scene', 'Information Pacing', WARN,
        `Cảnh ${id} (${complexity}) dài ${fmt(duration_s)} s, vượt ngưỡng thử ${fmt(limit.max_scene_s)} s. Tách cảnh hoặc ghi tiến trình bên trong.`, sceneLocation(scene));
    }
    if (concepts > limit?.max_concepts) {
      add('scene_concepts', 'Information Pacing', WARN,
        `Cảnh ${id} (${complexity}) khai ${concepts} khái niệm mới, vượt ngưỡng thử ${limit.max_concepts}.`, sceneLocation(scene));
    }
    if (scene.cut_during_speech) {
      add('cut_during_speech', 'Information Pacing', INFO,
        `Tiếng chạy qua cú cắt tại ${fmt(end)} s theo silencedetect, đối chiếu cửa sổ ±${fmt(PACING.cut_margin_s)} s.`,
        { start: end, end, scene_ids: [id] });
    }
  }
  for (const { start, end, concepts, scene_ids } of information.concept_windows ?? []) {
    add('concept_window', 'Information Pacing', WARN,
      `Quá nhiều khái niệm mới trong thời gian ngắn. Cửa sổ ${fmt(end - start)} s có ${fmt(concepts)} khái niệm phân bổ theo thời lượng cảnh, ngưỡng thử ${PACING.max_window_concepts}.`,
      { start, end, scene_ids });
  }
}

function addVisualFindings(add, { opening, header, sync, timeline, profile }, extended) {
  if (!opening.scenes?.length && usesExtendedChecks(profile)) {
    add('opening_missing', 'Visual', WARN, 'Chưa khai báo opening trong assets/scenes.json.', { start: 0, end: 2.5 });
  }
  for (const scene of opening.scenes ?? []) {
    if (withinError(LIMITS.opening_min_s, scene.duration_s) || withinError(scene.duration_s, LIMITS.opening_max_s)) {
      add('opening_duration', 'Visual', WARN, `Opening ${scene.id} dài ${fmt(scene.duration_s)} s, ngưỡng thử ${LIMITS.opening_min_s}–${LIMITS.opening_max_s} s.`,
        sceneLocation(scene));
    }
  }
  if (!header.scene_ids?.length && usesExtendedChecks(profile)) {
    add('header_missing', 'Visual', WARN, 'Chưa có cảnh khai báo header hiện trong assets/scenes.json.');
  }
  for (const item of sync.matches ?? []) {
    if (item.warning) add('voice_sync', 'Visual', WARN,
      `Cảnh ${item.id} khai tiếng vào tại ${fmt(item.start)} s, silencedetect đo ${fmt(item.actual_start_s)} s, lệch ${fmt(item.offset_s)} s. Ngưỡng thử ${fmt(LIMITS.voice_sync_s)} s.`,
      { start: Math.min(item.start, item.actual_start_s), end: Math.max(item.start, item.actual_start_s), scene_ids: [item.id] });
  }
  if (!extended) return;
  for (const scene of timeline.scenes ?? []) {
    const duration = scene.end - scene.start;
    if (withinError(duration, LIMITS.scene_max_s) || (scene.role !== 'opening' && withinError(LIMITS.scene_min_s, duration))) {
      add('unusual_scene_duration', 'Visual', WARN,
        `Cảnh ${scene.id} dài ${fmt(duration)} s, ngưỡng thử ${fmt(LIMITS.scene_min_s)}–${LIMITS.scene_max_s} s.`, sceneLocation(scene));
    }
  }
}

function addCaptionFindings(add, ass) {
  for (const style of ass.styles ?? []) {
    const where = ({ start, end }) => start !== null && end > start ? { start, end } : {};
    if (style.px !== null && (style.px < SUBTITLE_MIN_PX || style.px > SUBTITLE_MAX_PX)) {
      add('caption_fontsize', 'Y1', WARN,
        `Style ${style.name} trong ${path.basename(ass.source)} có cỡ ${fmt(style.px)} px (Fontsize ${fmt(style.fontsize)}, PlayResY ${ass.play_res_y}). Ngưỡng thử ${SUBTITLE_MIN_PX}–${SUBTITLE_MAX_PX} px.`,
        where(style.first));
    }
    if (style.outside) {
      const { alignment, margin_v, y_center } = style.outside;
      add('caption_band', 'Y1', WARN,
        `Phụ đề không nằm ở dải dưới (đang là visual chính?) Style ${style.name}, Alignment ${fmt(alignment)}, MarginV ${fmt(margin_v)}, tâm y ≈ ${fmt(y_center)} px. Ngưỡng thử y = ${CAPTION_BAND.join('–')} px và Alignment 1, 2 hoặc 3.`,
        where(style.outside));
    }
  }
}

function addTextAuditFindings(add, audit, profile) {
  const limits = TEXT_AUDIT_LIMITS;
  const scenes = audit.scenes ?? [];
  const invalid = audit.invalid_fields ?? [];
  const invalidVoice = audit.invalid_voice_fields ?? [];
  if (invalid.length || invalidVoice.length) {
    const entries = invalid.map(({ id, fields }) => `${id} (${fields.join(', ')})`);
    add('invalid_text_audit_fields', VISUAL_FIRST, WARN,
      `Bỏ qua trường sai kiểu hoặc giá trị trong dữ liệu Visual-first. ${[...entries, ...invalidVoice].join(' · ')}.`,
      { scene_ids: invalid.map(({ id }) => id) });
  }
  const missing = scenes.filter(({ has_plan }) => !has_plan).map(({ id }) => id);
  if (usesExtendedChecks(profile) && missing.length) {
    add('semantic_plan_missing', VISUAL_FIRST, WARN,
      `Thiếu semantic_plan cho ${missing.length} cảnh — Visual-first QC phải làm thủ công.`, { scene_ids: missing });
  }
  for (const scene of scenes) {
    const where = { scene_ids: [scene.id], ...(scene.start !== null && { start: scene.start, end: scene.end }) };
    for (const { text, kind, words, voice, start, end } of scene.matches) {
      const shortMessage = kind === 'message' && words <= limits.short_message_words;
      add('verbatim_text', VISUAL_FIRST, shortMessage ? INFO : WARN,
        `Cảnh ${scene.id} có chữ lặp nguyên văn lời thoại «${text}». Dòng lời gần nhất${voice.label ? ` (${voice.label})` : ''} «${voice.text}», similarity ${fmt(voice.similarity)} (ngưỡng thử ${fmt(limits.verbatim_similarity)}).` +
        (shortMessage ? ' Thông điệp chốt ngắn.' : ''), start !== null && end > start ? { ...where, start, end } : where);
    }
    for (const [key, kind, message, limit] of [
      ['words', 'simultaneous_text_words', 'quá nhiều chữ cùng lúc', limits.simultaneous_words],
      ['groups', 'simultaneous_text_groups', 'quá nhiều nhóm chữ cùng lúc', limits.simultaneous_groups],
    ]) {
      const peak = scene.peaks?.[key];
      if (peak?.count > limit) {
        add(kind, VISUAL_FIRST, WARN,
          `Cảnh ${scene.id} ${message} (${peak.count} ${key === 'words' ? 'từ' : 'nhóm'}, ngưỡng thử ${limit}).`,
          { ...where, start: peak.start, end: peak.end });
      }
    }
    if (scene.kinetic > limits.kinetic_per_scene) {
      add('kinetic_scene', VISUAL_FIRST, WARN,
        `Cảnh ${scene.id} lạm dụng hiệu ứng chữ (${scene.kinetic} kinetic, ngưỡng thử ${limits.kinetic_per_scene} mỗi cảnh).`, where);
    }
    if (scene.weak_reasons.length) {
      add('weak_visual', VISUAL_FIRST, WARN,
        `Cảnh ${scene.id} cần kiểm lại phương án visual. Lý do gồm ${scene.weak_reasons.join(' và ')}.`, where);
    }
  }
  if (audit.kinetic_per_min > limits.kinetic_per_min) {
    add('kinetic_rate', VISUAL_FIRST, WARN,
      `Lạm dụng hiệu ứng chữ (${fmt(audit.kinetic_per_min)} kinetic/phút, ngưỡng thử ${limits.kinetic_per_min}).`,
      { scene_ids: scenes.filter(({ kinetic }) => kinetic > 0).map(({ id }) => id) });
  }
  if (Number.isFinite(audit.caption_coverage_pct)) {
    const ratio = audit.caption_to_label_ratio;
    add('caption_layer', VISUAL_FIRST, INFO,
      `Phụ đề SRT phủ ${fmt(audit.caption_coverage_pct)}% thời lượng với ${audit.caption_words_total} từ.` +
      (ratio === null ? '' : ` Tỉ lệ từ phụ đề / từ chữ minh hoạ là ${fmt(ratio)}.`));
  }
}

function collectFindings(report, motionAlerts, paceChange) {
  const { technical, audio, subtitles, storyboard, pronunciation, motion, compliance, evidence, timeline,
    profile, thresholds, information_pace } = report;
  const duration = technical.ffprobe.duration_s ?? technical.qc_video.result?.info?.duration_s ?? null;
  const extended = usesExtendedChecks(profile) || timeline.has_metadata;
  const findings = [];
  const add = (kind, group, level, message, location = {}) => {
    findings.push({ code: `M-${String(findings.length + 1).padStart(2, '0')}`, kind, group, level, message,
      start: 0, end: duration, ...location });
  };
  const videoQc = technical.qc_video.result;
  const profileLimits = PROFILES[profile];
  const overProfile = usesExtendedChecks(profile) && duration > profileLimits.max_duration_s;
  for (const message of videoQc?.fails ?? []) {
    if (overProfile && thresholds.max_duration_s === profileLimits.max_duration_s && message.startsWith('Dài ') && message.includes(' > tối đa ')) continue;
    add('video_qc', 'KỸ THUẬT', ERROR, message);
  }
  const motionMessages = new Set(motionAlerts.map(({ message }) => message));
  for (const message of videoQc?.warns ?? []) {
    if (!motionMessages.has(message)) add('video_qc', 'KỸ THUẬT', WARN, message);
  }
  for (const { kind, message, ...location } of motionAlerts) {
    add(kind, kind === 'similar_layout' ? 'R12' : 'R4', WARN, message, location);
  }
  const staticRun = motion.longest_static;
  if (staticRun) {
    const end = staticRun.start_s + staticRun.length_s;
    if (!motionAlerts.some(({ kind, start }) => kind === 'static' && start === staticRun.start_s)) {
      add('longest_static', 'R4', INFO, `Đoạn tĩnh dài nhất ${fmt(staticRun.length_s)} s theo mẫu chuyển động 10 Hz.`,
        { start: staticRun.start_s, end });
    }
  }
  const stats = motion.scene_stats;
  const scenes = timeline.scenes ?? [];
  if (stats) {
    const location = { start: scenes[0].start, end: Math.max(...scenes.map(({ end }) => end)) };
    if (Number.isFinite(thresholds.max_scenes) && stats.count > thresholds.max_scenes) {
      add('scene_count', 'R12', WARN, `${stats.count} cảnh trên timeline, ngưỡng thử ${thresholds.max_scenes} cảnh.`, location);
    }
    if (stats.mean_s < thresholds.mean_scene_s) {
      add('scene_mean', 'R12', WARN,
        `Trung bình ${fmt(stats.mean_s)} s/cảnh trên ${stats.count} cảnh, ngưỡng thử ${fmt(thresholds.mean_scene_s)} s.`, location);
    }
    if (duration >= LIMITS.long_video_s && motion.layouts && motion.layouts.distinct < LIMITS.min_layouts) {
      add('layout_count', 'R12', WARN, `${motion.layouts.distinct} nhóm trên ${stats.count} cảnh, đại diện ${motion.layouts.groups.map(({ rep }) => rep).join(', ') || 'chưa có'}, ngưỡng thử ${LIMITS.min_layouts} nhóm với video ≥ ${LIMITS.long_video_s} s.`, location);
    }
  }
  for (const gap of audio.long_pauses ?? []) {
    const location = { start: gap.start, end: gap.end };
    if (withinError(gap.length, LIMITS.pause_warn_s)) {
      add('long_pause', 'Y7', extended ? WARN : INFO,
        `Khoảng im dài: kiểm hình đang đổi. Im dưới ${LIMITS.silence_db} dB trong ${fmt(gap.length)} s, ngưỡng thử ${LIMITS.pause_warn_s} s.`, location);
    } else {
      add('long_pause', 'Y7', INFO, `Im dưới ${LIMITS.silence_db} dB trong ${fmt(gap.length)} s. Đối chiếu hình trong khoảng này.`, location);
    }
  }
  if (withinError(audio.tail_s, LIMITS.tail_s)) {
    add('silent_tail', 'Y7', WARN, `Đuôi im ${fmt(audio.tail_s)} s, ngưỡng ${fmt(LIMITS.tail_s)} s.`,
      { start: audio.tail.start, end: audio.tail.end });
  }
  for (const cue of subtitles.srt.cues ?? []) {
    const location = { start: cue.start, end: cue.end, cue_number: cue.number };
    const text = `«${cue.lines.join(' / ')}»`;
    if (cue.lines.length > LIMITS.cue_lines) {
      add('cue_lines', 'Y1', WARN, `Cue ${cue.number} có ${cue.lines.length} dòng, ngưỡng ${LIMITS.cue_lines}. ${text}`, location);
    }
    for (const [index, chars] of cue.line_chars.entries()) {
      if (chars > LIMITS.cue_chars) {
        add('cue_chars', 'Y1', WARN, `Cue ${cue.number}, dòng ${index + 1} có ${chars} ký tự, ngưỡng ${LIMITS.cue_chars}. «${cue.lines[index]}»`, location);
      }
    }
    if (withinError(LIMITS.cue_min_s, cue.duration_s)) {
      add('cue_duration', 'Y1', WARN, `Cue ${cue.number} dài ${fmt(cue.duration_s)} s, ngưỡng ${fmt(LIMITS.cue_min_s)} s. ${text}`, location);
    }
  }
  for (const match of subtitles.srt.sync?.matches ?? []) {
    if (match.warning) {
      add('cue_sync', 'Y7', WARN, `Cue ${match.cue} bắt đầu tại ${fmt(match.start)} s, tiếng tại ${fmt(match.speech_start_s)} s sau ${fmt(match.silence_length_s)} s lặng, lệch ${fmt(match.offset_s)} s.`,
        { start: Math.min(match.start, match.speech_start_s), end: Math.max(match.start, match.speech_start_s), cue_number: match.cue });
    }
  }
  addCaptionFindings(add, subtitles.ass);
  const sceneById = new Map(scenes.map((scene) => [scene.id, scene]));
  for (const theme of storyboard.themes ?? []) {
    if (!withinError(theme.pct, thresholds.theme_pct)) continue;
    const members = theme.scene_ids.map((id) => sceneById.get(id));
    add('theme_share', 'R12', WARN, `Nền ${theme.theme} chiếm ${fmt(theme.duration_s)} / ${fmt(storyboard.timeline_duration_s)} s (${fmt(theme.pct)}%, ${theme.count} cảnh), ngưỡng thử ${thresholds.theme_pct}%.`,
      { start: members[0].start, end: members.at(-1).end, scene_ids: theme.scene_ids });
  }
  for (const run of storyboard.theme_runs ?? []) {
    if (run.count > thresholds.max_theme_run) {
      add('theme_run', 'R12', WARN, `Nền ${run.value} lặp ${run.count} cảnh liền, ngưỡng thử ${thresholds.max_theme_run} cảnh.`,
        { start: run.start, end: run.end, scene_ids: run.scene_ids });
    }
  }
  for (const run of storyboard.shot_runs ?? []) {
    if (run.count >= thresholds.shot_run) {
      add('shot_run', 'R12', WARN, `Cỡ ${run.value} lặp ${run.count} cảnh liền, ngưỡng thử từ ${thresholds.shot_run} cảnh.`,
        { start: run.start, end: run.end, scene_ids: run.scene_ids });
    }
  }
  if (storyboard.timeline_duration_s && duration >= thresholds.min_themes_from_s && storyboard.themes.length < thresholds.min_themes) {
    add('theme_count', 'R12', WARN, `${storyboard.themes.length} chủ đề nền (${storyboard.themes.map(({ theme }) => theme).join(', ') || 'thiếu khai báo'}), ngưỡng thử ${thresholds.min_themes} chủ đề với video ≥ ${thresholds.min_themes_from_s} s.`);
  }
  for (const camera of storyboard.cameras ?? []) {
    if (camera.status !== OK) continue;
    add('camera_difference', 'R12', INFO,
      `Storyboard khai ${camera.movement}. Hiệu RGB trung bình ${fmt(camera.mean_diff)}/255 giữa khung ${fmt(camera.first_s)} s và ${fmt(camera.last_s)} s.`,
      { start: camera.first_s, end: camera.last_s, scene_ids: [camera.id] });
  }
  for (const message of compliance.result?.fails ?? []) add('publish_qc', 'TUÂN THỦ', ERROR, `publish.json · ${message}`);
  for (const message of compliance.result?.warns ?? []) add('publish_qc', 'TUÂN THỦ', WARN, `publish.json · ${message}`);
  for (const item of pronunciation.errors ?? []) {
    const scene = scenes.find(({ id }) => id === item.label) ?? scenes[Number(item.row) - 1];
    const location = scene ? { start: scene.start, end: scene.end, scene_ids: [scene.id] } : {};
    add('phoneme', 'Y8', ERROR, `apply.json dòng ${item.row ?? '—'} (${item.label || 'không có nhãn'}), «${item.term}» → ${item.ipa}. ${item.detail}`, location);
  }

  if (usesExtendedChecks(profile) && duration !== null) {
    const limits = profileLimits;
    if (duration < limits.min_duration_s) add(`${profile}_short_duration`, 'KỸ THUẬT', WARN,
      `Thời lượng ${fmt(duration)} s ngắn hơn khoảng chấp nhận, cần lý do trong plan.md. Ngưỡng thử ${limits.min_duration_s} s.`);
    if (profile === 'explainer') {
      if (duration > limits.warn_duration_s) add('shorts_duration', 'KỸ THUẬT', WARN,
        `Thời lượng ${fmt(duration)} s vượt 3 phút: không còn là YouTube Shorts.`);
    } else if (duration > limits.warn_duration_s && !overProfile) {
      add(`${profile}_near_cap_duration`, 'KỸ THUẬT', WARN,
        `Thời lượng ${fmt(duration)} s gần trần ${limits.max_duration_s} s của hồ sơ ${profile}. Ngưỡng cảnh báo thử ${limits.warn_duration_s} s.`);
    }
    if (overProfile) add(`${profile}_long_duration`, 'KỸ THUẬT', ERROR,
      `Thời lượng ${fmt(duration)} s vượt trần thử ${limits.max_duration_s} s của hồ sơ ${profile}.`);
  }
  if (timeline.invalid_fields?.length) {
    const entries = timeline.invalid_fields.map(({ id, fields }) => `${id} (${fields.join(', ')})`);
    add('invalid_scene_fields', 'Timeline', WARN,
      `Bỏ qua trường sai kiểu hoặc giá trị trong assets/scenes.json. ${entries.join(' · ')}.`,
      { scene_ids: timeline.invalid_fields.map(({ id }) => id) });
  }
  const hasVoicePace = Number.isFinite(audio.speech_pace_voice_syll_s);
  const pace = audio.speech_pace_voice_syll_s ?? audio.speech_pace_syll_s;
  const paceSource = hasVoicePace ? 'WAV giọng gốc' : 'MP4';
  const voiced = hasVoicePace ? audio.voiced_s_voice : audio.voiced_s;
  const minPace = hasVoicePace ? D8_LIMITS.speech_pace_voice.min_syll_s : LIMITS.speech_min_syll_s;
  const maxPace = hasVoicePace ? D8_LIMITS.speech_pace_voice.max_syll_s : LIMITS.speech_max_syll_s;
  if (Number.isFinite(pace) && (pace < minPace || pace > maxPace)) {
    add('speech_pace', 'Audio', extended ? WARN : INFO,
      `Tốc độ đọc trên ${paceSource} ${fmt(pace)} âm tiết/s (${audio.speech.syllables} cụm chữ hoặc số trong apply.json / ${fmt(voiced)} s có tiếng), ngưỡng thử ${fmt(minPace)}–${fmt(maxPace)} âm tiết/s.`);
  }
  if (paceChange) {
    const { relative, before, baselineSource } = paceChange;
    add('speech_pace_baseline', 'Audio', INFO,
      `Tốc độ đọc ${relative >= 0 ? '+' : ''}${fmt(relative)}% so với bản chuẩn (${fmt(pace)} trên ${paceSource}, ${fmt(before)} trên ${baselineSource}, âm tiết/s).`);
  }
  addInformationFindings(add, information_pace, timeline, profile);
  addVisualFindings(add, report, extended);
  addTextAuditFindings(add, report.text_audit, profile);
  if (usesExtendedChecks(profile) || report.opening.scenes?.length || report.header.render_status === OK) {
    addD8VisualFindings(add, report.opening, report.header, report.text_audit.render);
  }
  if (usesExtendedChecks(profile) || report.voice_edges.sentence_count) addVoiceEdgeFindings(add, report.voice_edges);
  addTextOverlapFindings(add, report.text_overlap);

  for (const [group, result] of Object.entries(report.groups)) {
    for (const { kind, level, message, start, end, scene_ids } of result.findings) {
      add(kind, group, level, message, { start: start ?? 0, end: end ?? duration, scene_ids: scene_ids ?? [] });
    }
  }
  const images = evidence.images.filter(({ status }) => status === OK);
  const boards = images.filter(({ kind }) => kind === 'board');
  for (const finding of findings) {
    if (finding.kind === 'text_overlap' || finding.kind === 'text_gap') {
      const crop = images.find(({ kind }) => kind === 'text_overlap');
      if (crop?.tiles.some((tile) => finding.scene_ids.includes(tile.scene_id) && tile.start === finding.start &&
        tile.end === finding.end && tile.texts === finding.texts)) {
        finding.images = [crop.file];
        continue;
      }
    }
    if (finding.group === 'R23') {
      const plot = images.find(({ kind }) => kind === 'voice_edges');
      finding.images = plot && (finding.kind === 'voice_edges_rate' ||
        plot.points.some(({ i, edge }) => i === finding.voice_index && edge === finding.voice_edge)) ? [plot.file] : [];
      continue;
    }
    const textEvidence = finding.group === VISUAL_FIRST || finding.group === 'R22' || finding.group === 'R3' ?
      images.filter(({ scene_id, kind }) => kind === 'textheavy' && finding.scene_ids?.includes(scene_id)) : [];
    if (textEvidence.length) {
      finding.images = textEvidence.map(({ file }) => file);
      continue;
    }
    const match = images.filter(({ scene_id, kind }) =>
      (kind === 'opening' && (finding.kind === 'opening_missing' || finding.group === 'R20')) ||
      (kind === 'header' && (finding.kind === 'header_missing' || finding.group === 'R21')) ||
      (finding.scene_ids?.includes(scene_id) && (finding.kind === 'camera_difference' ? kind === 'camera' :
        kind === 'scene' || (kind === 'opening' && finding.kind === 'opening_duration'))));
    if (match.length) finding.images = match.map(({ file }) => file);
    else {
      const end = finding.end ?? finding.start;
      const covered = boards.filter(({ tiles }) => tiles.some(({ frame_s }) => frame_s >= finding.start && frame_s <= end));
      const t = (finding.start + end) / 2;
      const nearby = boards.find((board) => t <= board.end + LIMITS.board_step_s / 2) ?? boards.at(-1);
      finding.images = covered.length ? covered.map(({ file }) => file) : nearby ? [nearby.file] : [];
    }
  }
  return findings;
}

const TEXT_METRICS = [
  ['verbatim_texts', 'Chữ lặp lời'], ['text_words_per_min', 'Từ chữ minh hoạ/phút'],
  ['text_coverage_pct', 'Thời lượng có chữ minh hoạ (%)'], ['keyword_visual_pct', 'Keyword có hình (%)'],
  ['caption_coverage_pct', 'Thời lượng có phụ đề (%)'], ['caption_px', 'Cỡ phụ đề lớn nhất (px)'],
];
const METRICS = [
  ['duration_s', 'Thời lượng (s)'], ['scene_count', 'Số cảnh'], ['mean_scene_s', 'Trung bình cảnh (s)'],
  ['scenes_under_2s', 'Cảnh dưới 2 s'], ['cuts_per_10s', 'Lần cắt / 10 s'], ['static_pct', 'Tĩnh (%)'],
  ['longest_static_s', 'Đoạn tĩnh dài nhất (s)'], ['layout_count', 'Nhóm bố cục'],
  ['max_theme_pct', 'Tỉ lệ chủ đề lớn nhất (%)'], ['longest_theme_run', 'Chuỗi cùng chủ đề (cảnh)'],
  ['warning_count', 'Số cảnh báo'], ['lufs_i', 'Âm lượng tích hợp (LUFS)'], ['tail_s', 'Đuôi im (s)'],
  ...TEXT_METRICS,
  ['speech_pace_syll_s', 'Tốc độ đọc trên MP4 (âm tiết/s)'], ['voiced_s', 'Thời lượng có tiếng trên MP4 (s)'],
  ['speech_pace_voice_syll_s', 'Tốc độ đọc trên WAV giọng gốc (âm tiết/s)'], ['voiced_s_voice', 'Thời lượng có tiếng trên WAV (s)'],
  ['pause_ratio', 'Tỉ lệ lặng (0–1)'], ['concepts_per_min', 'Khái niệm mới/phút'],
  ['header_pct', 'Thời lượng có header (%)'], ['voice_sync_max_s', 'Lệch lời–hình lớn nhất (s)'],
  ['voice_sync_mean_s', 'Lệch lời–hình trung bình (s)'],
  ['header_coverage_pct', 'Header sau opening (%)'], ['opening_ok', 'Opening riêng đạt D8'],
  ['voice_edge_violation_pct', 'Câu có cờ đầu hoặc cuối (%)'], ['scenes_with_text_pct', 'Cảnh có chữ vẽ thật (%)'],
  ['kinetic_per_25s', 'Kinetic vẽ thật / 25 s'], ['planned_texts_found_pct', 'Chữ kế hoạch xuất hiện đúng mốc (%)'],
  ['text_overlap_pairs', 'Cặp chữ giao bbox'], ['text_min_gap_px', 'Khe chữ nhỏ nhất (px)'],
  ['mix_clipped_samples', 'Mẫu clip của mix'], ['cue_pass_ratio', 'Tỉ lệ cue đạt hai mốc'],
  ['camera_scene_ratio', 'Tỉ lệ cảnh có camera chuyển động'], ['first_change_s', 'Đổi hình đầu (s)'],
  ['concepts_per_10s', 'Khái niệm / 10 s'], ['cuts_during_voice', 'Số lần cắt trong câu'],
  ...Object.keys(PACING.complexity).flatMap((level) => [
    [`${level}_scene_count`, `Số cảnh ${level}`],
    [`${level}_mean_scene_s`, `Thời lượng trung bình cảnh ${level} (s)`],
    [`${level}_min_hold_after_voice_s`, `Giữ sau lời nhỏ nhất (cảnh ${level}, s)`],
  ]),
];

function pacingMetrics({ audio, information_pace: information, header, sync }) {
  const metrics = {
    speech_pace_syll_s: audio?.speech_pace_syll_s, voiced_s: audio?.voiced_s_mp4 ?? audio?.voiced_s, pause_ratio: audio?.pause_ratio,
    speech_pace_voice_syll_s: audio?.speech_pace_voice_syll_s, voiced_s_voice: audio?.voiced_s_voice,
    concepts_per_min: information?.concepts_per_min, header_pct: header?.pct,
    voice_sync_max_s: sync?.max_offset_s, voice_sync_mean_s: sync?.mean_offset_s,
  };
  for (const [level, stats] of Object.entries(information?.complexity ?? {})) {
    metrics[`${level}_scene_count`] = stats.count;
    metrics[`${level}_mean_scene_s`] = stats.mean_scene_s;
    metrics[`${level}_min_hold_after_voice_s`] = stats.min_hold_after_voice_s;
  }
  return Object.fromEntries(Object.entries(metrics).map(([key, value]) => [key, value ?? null]));
}

function textMetrics({ text_audit }) {
  return Object.fromEntries(TEXT_METRICS.map(([key]) => [key, text_audit?.[key] ?? null]));
}

function d8Metrics({ opening, header, voice_edges, text_audit, text_overlap }) {
  const render = text_audit?.render;
  return {
    header_coverage_pct: header?.coverage_pct ?? null, opening_ok: opening?.ok ?? null,
    voice_edge_violation_pct: voice_edges?.violation_pct ?? null,
    scenes_with_text_pct: render?.scenes_with_text_pct ?? null, kinetic_per_25s: render?.kinetic_per_25s ?? null,
    planned_texts_found_pct: render?.planned_texts_found_pct ?? null,
    text_overlap_pairs: text_overlap?.text_overlap_pairs ?? null, text_min_gap_px: text_overlap?.text_min_gap_px ?? null,
  };
}

function summarize(report) {
  const { technical, motion, storyboard, audio, subtitles, findings, groups } = report;
  return {
    duration_s: technical.ffprobe.duration_s ?? null, scene_count: motion.scene_stats?.count ?? null,
    mean_scene_s: motion.scene_stats?.mean_s ?? null, scenes_under_2s: motion.scene_stats?.under_2s ?? null,
    cuts_per_10s: motion.scene_stats?.cuts_per_10s ?? null, static_pct: motion.result?.static_pct ?? null,
    longest_static_s: motion.result?.longest_static_s ?? null, layout_count: motion.layouts?.distinct ?? null,
    max_theme_pct: storyboard.themes?.[0]?.pct ?? null, longest_theme_run: storyboard.longest_theme_run?.count ?? null,
    warning_count: findings.filter(({ level }) => level === WARN).length,
    lufs_i: technical.qc_video.result?.info?.lufs_i ?? null, tail_s: audio.tail_s ?? null,
    mix_clipped_samples: groups.audio.layers.mix?.clipped_samples ?? null,
    cue_pass_ratio: groups.audio.cue_pass_ratio, camera_scene_ratio: groups.visual.camera_scene_ratio,
    first_change_s: groups.narrative.first_change_s, concepts_per_10s: groups.narrative.concepts_per_10s,
    cuts_during_voice: groups.narrative.cuts_during_voice?.length ?? null,
    caption_fontsize: subtitles.ass.fontsize ?? null, ...pacingMetrics(report), ...textMetrics(report), ...d8Metrics(report),
  };
}

function readBaseline(file) {
  if (!file) return null;
  return attempt(() => {
    const baseline = readJson(file);
    if (!baseline.metrics || !baseline.threshold_version) return unavailable('Tệp chuẩn thiếu metrics hoặc threshold_version.', { source: file });
    const { video, threshold_version } = baseline;
    return measured({ source: file, video, threshold_version,
      metrics: { ...pacingMetrics(baseline), ...textMetrics(baseline), ...d8Metrics(baseline), ...baseline.metrics } });
  });
}

function compareBaseline(baseline, current, paceChange) {
  if (baseline?.status !== OK) return baseline;
  const { metrics, ...data } = baseline;
  const rows = METRICS.map(([key, label]) => {
    const legacyPace = key === 'speech_pace_voice_syll_s' && paceChange?.key === key && paceChange.baselineSource === 'MP4';
    const value = legacyPace ? paceChange.before : metrics[key];
    const before = Number.isFinite(value) || typeof value === 'boolean' ? value : null;
    const after = current[key] ?? null;
    const delta = before !== null && after !== null ? after - before : null;
    return { key, label: legacyPace ? label + ' · bản chuẩn lấy từ MP4' : label,
      current: after, baseline: before, delta, direction: delta > 0 ? '↑' : delta < 0 ? '↓' : null };
  });
  return { ...data, rows, speech_pace_change_pct: paceChange?.relative ?? null };
}

function manualChecks(duration) {
  const checks = [
    ['voice_natural', 'Giọng tự nhiên, không kéo chữ hoặc nuốt chữ', 'Nghe lời đọc và đối chiếu các khoảng lặng trong mục Audio.'],
    ['pronunciation', 'Phát âm thuật ngữ', 'Nghe các thuật ngữ, đối chiếu apply.json và mục Phát âm Y8.'],
    ['emphasis', 'Nhấn mạnh đúng ý', 'Nghe lời tại các câu chốt, đối chiếu script.md.'],
    ['header_safe_zone', 'Header trong vùng an toàn và không che Cáo, phụ đề hoặc sơ đồ', 'Đối chiếu các ô header-zones.png với khung đầy đủ và video.'],
    ['diagram_reveal', 'Sơ đồ hiện từng bước đúng lúc lời nhắc', 'Xem video tại các mốc trong bảng đồng bộ lời–hình.'],
    ['diagram_hold', 'Sơ đồ phức tạp giữ đủ lâu để quan sát', 'Xem các cảnh và đối chiếu cột Giữ sau lời trong Information Pacing.'],
    ['example', 'Có ví dụ cụ thể cho phần khó', 'Đối chiếu ví dụ trong script.md với hình trên video.'],
    ['explanation_order', 'Thứ tự giải thích logic', 'Xem video theo thứ tự cảnh và đối chiếu script.md.'],
    ['theory_only', 'Xác định đoạn đọc lý thuyết thiếu minh hoạ', 'So lời với sự kiện hình ở từng đoạn giải thích.'],
    ['camera_purpose', 'Chuyển động camera phục vụ nội dung', 'Xem video và đối chiếu các cặp khung camera hoặc storyboard.json.'],
    ['visual_illustration', 'Hình có thật sự minh hoạ nội dung không', 'Đối chiếu lời giải thích với hình trong từng cảnh.'],
    ['visual_keywords', 'Keyword được chọn có đúng trọng tâm không', 'Đối chiếu keyword trong storyboard.json với ý chính của cảnh.'],
    ['visual_accuracy', 'Đối tượng và quan hệ có chính xác về kỹ thuật không', 'Kiểm tra đối tượng và quan hệ thể hiện trong cảnh.'],
    ['visual_without_captions', 'Có hiểu được ý chính qua hình ảnh khi không đọc phụ đề không', 'Xem nocaption-board.png và bản picture.mp4 khi tắt tiếng.'],
    ['visual_animation', 'Animation có phục vụ việc giải thích không', 'Đối chiếu từng chuyển động với bước đang được giải thích.'],
    ['visual_observation_time', 'Có đủ thời gian quan sát từng bước không', 'Xem thời điểm xuất hiện và khoảng giữ của từng trạng thái.'],
    ['visual_text_attachment', 'Chữ có gắn trực tiếp vào đối tượng đang minh hoạ không', 'Đối chiếu vị trí chữ với đối tượng và trường attach_to.'],
    ['visual_text_effect', 'Hiệu ứng chữ có gây mất tập trung không', 'Xem các cảnh có kinetic và hiệu ứng chữ khác.'],
    ['voice_edge_listen', 'Phát âm, độ tự nhiên, nuốt chữ đầu/cuối câu', 'CHƯA KIỂM — giám đốc nghe.'],
    ['header_phone_readability', 'Header đủ lớn trên điện thoại', 'Mở video ở kích thước điện thoại và đọc hai dòng header.'],
    ['named_terms_without_audio', 'Thuật ngữ gọi tên có nhãn nhận ra được khi tắt tiếng', 'Xem bản picture.mp4, đối chiếu tên thuật ngữ trong storyboard.'],
  ];
  return checks.map(([key, label, evidence]) => ({ key, label, status: 'CHƯA KIỂM', start: 0, end: duration ?? null, evidence }));
}

function markdown(report) {
  const { video, measured_at, threshold_version, technical, timeline, motion, audio, subtitles, profile,
    storyboard, compliance, pronunciation, evidence, findings, metrics, baseline, information_pace, opening, header, sync,
    text_audit, text_overlap, voice_edges, manual_checks } = report;
  const lines = [`# QC đo độc lập · ${video.id} · Hồ sơ ${profile}`, '', `Video \`${video.file}\``, '',
    `Đo lúc ${measured_at} (UTC) · Ngưỡng ${threshold_version}`];
  const section = (title) => lines.push('', `## ${title}`, '');
  const clean = (value) => String(value ?? '—').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
  const row = (...fields) => lines.push(`| ${fields.map(clean).join(' | ')} |`);
  const table = (...headers) => { row(...headers); row(...headers.map(() => '---')); };
  const link = (file) => `[${file}](${encodeURIComponent(file)})`;
  const missing = (value) => lines.push(`Không đo được. ${value.reason}`);
  const at = (value) => value.start == null ? '—' : seconds(value.start, value.end);
  const source = (value) => lines.push(`Nguồn \`${value}\`.`);

  section('Cần xem thủ công (không tự PASS)');
  table('Mục', 'Câu hỏi', 'Vì sao cần xem', 'Bằng chứng');
  for (const item of report.needs_manual_review) {
    row(item.id, item.question, item.why_not_auto, item.evidence.map((file) =>
      evidence.images.some((image) => image.file === file && image.status === OK) ? link(file) : file).join(' · '));
  }
  const { audio: audioQC, visual: visualQC, narrative } = report.groups;
  section('Audio QC');
  lines.push(audioQC.status + (audioQC.reason ? ' — ' + audioQC.reason : ''), '');
  table('Lớp', 'LUFS', 'Peak dBFS', 'True peak dBTP', 'Mẫu clip');
  for (const [name, layer] of Object.entries(audioQC.layers))
    row(name, fmt(layer.lufs), fmt(layer.peak_dbfs), fmt(layer.true_peak_dbtp), layer.clipped_samples);
  lines.push('', 'Cue đạt cả onset và mốc hình ' + fmt(audioQC.cue_pass_ratio == null ? null : 100 * audioQC.cue_pass_ratio) + '% (' + audioQC.cue_pass_count +
    '/' + audioQC.cue_comparable_count + ' cue đo được, tổng ' + audioQC.cue_total_count + ').',
    'Chênh lệch mức nhạc ngoài lời và trong lời ' + fmt(audioQC.ducking?.delta_db) + ' dB.');
  if (audioQC.pauses) {
    const { n, min, median, max, stdev, histogram } = audioQC.pauses;
    lines.push('', 'Khoảng nghỉ n=' + n + ', min ' + fmt(min) + ' s, trung vị ' + fmt(median) +
      ' s, max ' + fmt(max) + ' s, độ lệch chuẩn ' + fmt(stdev) + ' s.', '');
    table('Từ (s)', 'Đến (s)', 'Số khoảng');
    for (const bin of histogram) row(fmt(bin.min), fmt(bin.max), bin.count);
  }
  if (audioQC.pause_deviations.length) {
    lines.push('');
    table('Biên câu', 'Kế hoạch (s)', 'Đo được (s)', 'Chênh (s)', 'Ý định ngoài khoảng');
    for (const gap of audioQC.pause_deviations) row((gap.previous ?? 'đầu') + ' → ' + (gap.next ?? 'cuối'),
      fmt(gap.expected_s), fmt(gap.actual_s), fmt(gap.delta_s),
      gap.intent_ranges.filter(({ ok }) => ok === false).map(({ intent, side }) => intent + ' · ' + side).join(', '));
  }
  if (audioQC.cue_rows.length) {
    lines.push('');
    table('Cue', 'Mốc (s)', 'Lệch onset (s)', 'Lệch hình (s)');
    for (const cue of audioQC.cue_rows) row(cue.id, fmt(cue.t), fmt(cue.onset_delta_s), fmt(cue.visual_delta_s));
  }
  section('Visual QC');
  lines.push(visualQC.status + (visualQC.reason ? ' — ' + visualQC.reason : ''), visualQC.word_sync.reason, '',
    'Tỉ lệ cảnh có camera ' + fmt(visualQC.camera_scene_ratio == null ? null : 100 * visualQC.camera_scene_ratio) + '%.', '');
  table('Cảnh', 'Bố cục dựng', 'Loại cảnh');
  for (const scene of visualQC.sequence) row(scene.id, scene.archetype, scene.kind);
  if (visualQC.label_sync.length) {
    lines.push('');
    table('Cảnh', 'Nhãn', 'Xuất hiện (s)', 'Đồng bộ mức câu');
    for (const label of visualQC.label_sync) row(label.scene, label.text, fmt(label.start), label.ok === null ? UNCHECKED : fmt(label.ok));
  }
  section('Narrative QC');
  table('Dữ kiện', 'Số đo');
  row('Lời đầu / đổi hình đầu', fmt(narrative.first_voice_s) + ' s / ' + fmt(narrative.first_change_s) + ' s');
  if (narrative.first_voice_source) row('Nguồn mốc âm đầu', narrative.first_voice_source === 'MP4' ?
    'MP4 · mốc âm đầu có thể gồm nhạc hoặc SFX' : narrative.first_voice_source);
  row('Pha mâu thuẫn', narrative.conflict_s === null ? UNCHECKED : fmt(narrative.conflict_s) + ' s · ' +
    (narrative.conflict_before_limit ? 'trong mốc tham chiếu' : 'sau mốc tham chiếu'));
  row('Vai trò cảnh', narrative.roles.map(({ id, role }) => id + ' ' + (role ?? '—')).join(' → '));
  row('Cảnh dẫn vào vấn đề', narrative.lead_in_scene);
  row('Mốc cắt khi đang có lời (s)', narrative.cuts_during_voice?.map(fmt).join(', '));
  row('Khái niệm / 10 s', fmt(narrative.concepts_per_10s));
  row('Ý định kết luận', narrative.final_conclusion === null ? UNCHECKED : (narrative.final_conclusion ? 'có' : 'vắng'));
  row('Giữ sau lời kết', narrative.final_hold_s === null ? UNCHECKED : fmt(narrative.final_hold_s) + ' s');

  section('Chỉ số chính');
  const comparisons = baseline?.status === OK ? baseline.rows : null;
  if (comparisons) {
    lines.push(`Bản chuẩn ${baseline.video?.id ?? '—'} · Ngưỡng ${baseline.threshold_version} · \`${baseline.source}\``, '');
    table('Chỉ số', 'Video này', 'Bản chuẩn', 'Δ');
    for (const { label, current, baseline: before, delta, direction } of comparisons) {
      row(label, fmt(current), fmt(before), `${direction ? `${direction} ` : ''}${delta > 0 ? '+' : ''}${fmt(delta)}`);
    }
  } else {
    if (baseline) { missing(baseline); lines.push(''); }
    table('Chỉ số', 'Số đo');
    for (const [key, label] of METRICS) row(label, fmt(metrics[key]));
  }
  const probe = technical.ffprobe;
  if (probe.status === OK) {
    lines.push('', `FFprobe ghi ${fmt(probe.width)} × ${fmt(probe.height)}, ${fmt(probe.fps)} fps, ${probe.video_codec ?? '—'}/${probe.pixel_format ?? '—'} và ${probe.audio_codec ?? '—'}, ${fmt(probe.size_bytes)} byte.`);
  }
  if (motion.scene_stats) {
    lines.push('', `Cảnh ngắn nhất ${fmt(motion.scene_stats.min_s)} s, dài nhất ${fmt(motion.scene_stats.max_s)} s. Tần suất cắt = (số cảnh − 1) / tổng thời lượng cảnh × 10.`);
  }
  if (motion.layouts) {
    lines.push('', `Nhóm bố cục dùng khung giữa cảnh, ghép vào nhóm đại diện đầu tiên có hiệu sáng trung bình < ${fmt(LAYOUT_SAME_DIFF)}/255. Chuỗi cùng nhóm dài nhất ${motion.layouts.longest_run} cảnh.`);
  }
  if (motion.longest_static) {
    const { start_s, length_s } = motion.longest_static;
    lines.push('', `Đoạn tĩnh dài nhất tại ${seconds(start_s, start_s + length_s)}.`);
  }

  section('Phát hiện');
  table('Mã', 'Nhóm', 'Mốc', 'Bằng chứng', 'Mức');
  for (const item of findings) {
    const location = [at(item), ...(item.scene_ids ?? [])].join(' · ');
    row(item.code, item.group, location, [item.message, ...item.images.map(link)].join(' '), item.level);
  }
  if (!findings.length) row('—', '—', '—', 'Chưa ghi nhận phát hiện trong các bước đo được.', '—');

  section('Từng cảnh và bối cảnh R12');
  if (timeline.status === OK) {
    source(timeline.source);
    lines.push('');
    table('Cảnh', 'Mốc', 'Cỡ cảnh', 'Chuyển động khai báo', 'Chủ đề', 'Loại cảnh',
      'Trung vị khối hoạt động', 'Tĩnh (%)', 'Hiệu bố cục với cảnh kế', 'Nhóm bố cục', 'Cờ');
    for (const scene of report.scenes) {
      row(scene.id, at(scene), scene.shot, scene.movement, scene.theme, scene.scene_type, fmt(scene.active_median),
        fmt(scene.static_pct), fmt(scene.layout_diff_next), scene.layout_group, scene.flags.join(', ') || '—');
    }
  } else missing(timeline);
  if (storyboard.status === OK && storyboard.timeline_duration_s) {
    lines.push('', `Tỉ lệ nền trên ${fmt(storyboard.timeline_duration_s)} s của timeline.`, '');
    table('Chủ đề', 'Cảnh', 'Thời lượng (s)', 'Tỉ lệ (%)', 'Mã cảnh');
    for (const theme of storyboard.themes) row(theme.theme, theme.count, fmt(theme.duration_s), fmt(theme.pct), theme.scene_ids.join(', '));
    const describeRun = (run) => run ? `${run.value}, ${run.count} cảnh, ${run.first_id}–${run.last_id} (${at(run)})` : '—';
    lines.push('', `Chuỗi cùng chủ đề dài nhất · ${describeRun(storyboard.longest_theme_run)}.`,
      `Có ${storyboard.distinct_shots} cỡ cảnh. Chuỗi cùng cỡ dài nhất · ${describeRun(storyboard.longest_shot_run)}.`);
    if (storyboard.unmatched_scene_ids.length) {
      lines.push('', `Cảnh trên timeline thiếu mã tương ứng trong storyboard · ${storyboard.unmatched_scene_ids.join(', ')}.`);
    }
  }
  if (storyboard.cameras?.length) {
    lines.push('', 'Camera có khai chuyển động. Hiệu đo là trung bình trị tuyệt đối trên ba kênh RGB của hai khung 360×640.', '');
    table('Cảnh', 'Khai báo', 'Mốc cảnh', 'Mốc hai khung', 'Hiệu (0–255)', 'Ảnh hoặc lý do');
    for (const camera of storyboard.cameras) {
      const image = evidence.images.find(({ kind, scene_id, status }) => kind === 'camera' && scene_id === camera.id && status === OK);
      row(camera.id, camera.movement, at(camera), camera.status === OK ? seconds(camera.first_s, camera.last_s) : '—',
        fmt(camera.mean_diff), image ? link(image.file) : camera.reason || 'Không có ảnh trong lượt đo.');
    }
  }

  section('Audio');
  if (audio.speech.status === OK) {
    lines.push(`Tốc độ đọc trên WAV giọng gốc **${fmt(audio.speech_pace_voice_syll_s)} âm tiết/s** (${fmt(audio.voiced_s_voice)} s có tiếng) · trên MP4 **${fmt(audio.speech_pace_syll_s)} âm tiết/s** (${fmt(audio.voiced_s)} s có tiếng). Cùng đếm ${audio.speech.syllables} cụm chữ hoặc số trong apply.json.`);
    source(audio.speech.source);
  } else missing(audio.speech);
  if (audio.voice.status === OK) {
    source(audio.voice.source);
    const target = D8_LIMITS.speech_pace_voice;
    lines.push(`Dải thử trên giọng gốc ${fmt(target.min_syll_s)}–${fmt(target.max_syll_s)} âm tiết/s. Hiệu ứng và chuẩn hoá có thể kéo thêm thời gian trên ngưỡng tiếng trong MP4.`);
  } else lines.push(UNCHECKED + ' — tốc độ trên giọng gốc. ' + audio.voice.reason);
  for (const { source: file, reason } of audio.voice.rejected ?? []) lines.push('Bỏ qua `' + file + '`. ' + reason);
  if (audio.status === OK) {
    lines.push(`FFmpeg dùng ngưỡng ${LIMITS.silence_db} dB trong ít nhất ${fmt(LIMITS.silence_min_s)} s. Có tiếng ${fmt(audio.voiced_s)} s, tỉ lệ lặng ${fmt(100 * audio.pause_ratio)}%, đuôi im ${fmt(audio.tail_s)} s.`);
    if (audio.longest_pause) lines.push(`Khoảng lặng dài nhất ${fmt(audio.longest_pause.length)} s tại ${at(audio.longest_pause)}.`);
    lines.push('');
    table('Mốc', 'Dài (s)', 'Đối chiếu');
    for (const gap of audio.silences) row(at(gap), fmt(gap.length),
      [gap === audio.tail ? 'Đuôi' : '', audio.long_pauses.includes(gap) ? 'Đối chiếu chuyển động hình' : ''].filter(Boolean).join(' · ') || '—');
  } else missing(audio);

  section('Information Pacing');
  if (information_pace.status === OK) {
    source(timeline.source);
    lines.push('', `Khái niệm mới đã khai báo mỗi phút · ${fmt(information_pace.concepts_per_min)}. Thời gian giữ sau lời tính từ đoạn tiếng cuối bắt đầu trong cảnh theo silencedetect.`, '');
    table('Cảnh', 'Mốc', 'Độ phức tạp', 'Dài (s)', 'Tiếng hết (s)', 'Giữ sau lời (s)', 'Khái niệm mới', 'Cờ');
    const flags = Map.groupBy(findings.filter(({ group }) => group === 'Information Pacing')
      .flatMap(({ code, scene_ids }) => (scene_ids ?? []).map((id) => ({ id, code }))), ({ id }) => id);
    for (const scene of information_pace.scenes) {
      row(scene.id, at(scene), scene.complexity, fmt(scene.duration_s), fmt(scene.last_voice_end),
        fmt(scene.hold_after_voice_s), fmt(scene.concepts), flags.get(scene.id)?.map(({ code }) => code).join(', '));
    }
  } else missing(information_pace);

  section('Visual (opening/header/đồng bộ)');
  if (opening.scenes?.length) {
    for (const scene of opening.scenes) lines.push(`Opening ${scene.id} tại ${at(scene)}, dài ${fmt(scene.duration_s)} s.`);
  } else lines.push('Chưa khai báo opening. Mốc khung tham chiếu 0,2 s, 1 s và 2,5 s.');
  lines.push(...opening.images.map((image) => `- ${image.status === OK ? link(image.file) : image.file} · ${at(image)}${image.reason ? ` · ${image.reason}` : ''}`), '');
  if (header.status === OK) lines.push(`Header được khai tại ${fmt(header.duration_s)} s (${fmt(header.pct)}%) của video.`);
  else missing(header);
  if (header.image.status === OK) {
    lines.push(`Các ô trong ${link(header.image.file)} lấy dải trên từ y = 0 đến y = 420 ở khung chuẩn 1080×1920.`, '');
    table('Ô (hàng.cột)', 'Cảnh', 'Mốc khung', 'Header khai báo');
    for (const tile of header.image.tiles) row(`${tile.row}.${tile.col}`, tile.scene_id, seconds(tile.frame_s),
      tile.header?.text ?? tile.header ?? 'Ẩn');
  } else missing(header.image);
  lines.push('');
  if (sync.status === OK) {
    lines.push(`Độ lệch tuyệt đối lớn nhất ${fmt(sync.max_offset_s)} s, trung bình ${fmt(sync.mean_offset_s)} s. Δ = mốc tiếng đo được − mốc khai báo.`, '');
    table('Cảnh', 'Khoảng voice khai báo', 'Tiếng bắt đầu (s)', 'Δ (s)', 'Cờ');
    for (const item of sync.matches) row(item.id, at(item), fmt(item.actual_start_s), fmt(item.offset_s), item.warning ? 'Cảnh báo' : '—');
  } else missing(sync);

  section('D8 · Opening, header, chữ vẽ thật và đầu/cuối câu');
  table('Luật', 'Nguồn', 'Số đo hoặc trạng thái');
  row('R20 Opening riêng', ['scenes.json', 'MP4', opening.source_d8].filter(Boolean).join(', '), [
    'Cảnh riêng ' + (opening.separate_ok ? 'đạt' : opening.layout_ok === null ? UNCHECKED : 'chưa đạt'),
    Number.isFinite(opening.first_sound_s) ? 'tiếng đầu ' + seconds(opening.first_sound_s) : 'mốc tiếng đầu —',
    opening.d8_status === UNCHECKED ? 'tiêu đề ' + UNCHECKED + ' — ' + opening.reason_d8 :
      'tiêu đề ' + fmt(opening.title_ok),
  ].join(' · '));
  row('R21 Header', header.source, [
    header.coverage_pct == null ? 'độ phủ chưa đo được' : 'phủ ' + fmt(header.coverage_pct) + '% sau opening',
    header.render_status === OK ?
      (header.slot_changes + ' lần đổi ô · ' + header.geometry_violations.length + ' đoạn sai kích thước thẻ · ' +
      header.size_violations.length + ' đoạn thiếu chữ đúng cỡ · ' + header.overlaps.length + ' đoạn đè hoặc thiếu khe') :
      ('đè nội dung ' + UNCHECKED + ' — ' + header.render_reason),
    header.image.status === OK ? link(header.image.file) : null,
  ].filter(Boolean).join(' · '));
  const render = text_audit.render;
  const planned = render.planned_scenes_with_text_pct;
  row('R3 Khe giữa chữ', 'render-log', text_overlap.status === OK ?
    text_overlap.text_overlap_pairs + ' cặp giao bbox · ' + text_overlap.close_pairs.length + ' cặp dưới ngưỡng khe · ' +
    'khe nhỏ nhất ' + fmt(text_overlap.text_min_gap_px) + ' px' : UNCHECKED + ' — ' + text_overlap.reason);
  row('R22 Chữ minh hoạ', render.source, [
    planned === null ? null : 'kế hoạch ' + render.scenes_with_planned_text.length + '/' + render.planned_scene_count +
      ' cảnh có chữ (' + fmt(planned) + '%)',
    render.status === OK ? (fmt(render.scenes_with_text_pct) + '% cảnh có chữ vẽ thật · ' +
      fmt(render.words_per_min) + ' từ/phút · tối đa ' + render.max_simultaneous_words + ' từ đồng thời · ' +
      render.kinetic_count + ' kinetic (' + fmt(render.kinetic_per_25s) + '/25 s), khe ngắn nhất ' +
      fmt(render.kinetic_min_gap_s) + ' s · tìm thấy ' + fmt(render.planned_texts_found_pct) + '% chữ đúng mốc · ' +
      render.keywords_without_text.filter(({ visual }) => !visual).length + ' keyword thiếu chữ cần nhãn · ' +
      render.keywords_without_text.filter(({ visual }) => visual).length + ' keyword minh hoạ bằng hình theo storyboard · ' +
      render.unattached_labels.length + ' nhãn xa đích · ' +
      render.labels_without_target.length + ' nhãn thiếu đích · ' + fmt(render.verbatim?.length) + ' mục giống lời') :
      UNCHECKED + ' — ' + render.reason,
  ].filter(Boolean).join(' · '));
  row('R23 Đầu/cuối câu', voice_edges.source, [
    voice_edges.measured_count ? voice_edges.flagged_count + '/' + voice_edges.measured_count + ' câu có cờ (' +
      fmt(voice_edges.violation_pct) + '%), ' + voice_edges.head_violations + ' đầu và ' + voice_edges.tail_violations + ' cuối' : null,
    voice_edges.technical_fail ? 'FAIL KỸ THUẬT' : null,
    voice_edges.status !== OK ? UNCHECKED + ' — ' + voice_edges.reason : null,
    voice_edges.image ? (voice_edges.image.status === OK ? link(voice_edges.image.file) :
      'Ảnh không tạo được. ' + voice_edges.image.reason) : null,
  ].filter(Boolean).join(' · '));

  section('Visual-first: chữ và hình');
  if (text_audit.status === OK) {
    lines.push(`Có ${fmt(text_audit.text_words_total)} từ minh hoạ, ${fmt(text_audit.kinetic_per_min)} kinetic/phút và similarity cao nhất ${fmt(text_audit.max_similarity)}.`);
    if (text_audit.keyword_visual_pct === null) lines.push('Không đo được tỉ lệ keyword có hình vì thiếu keyword đã khai báo hợp lệ.');
    if (text_audit.missing_text_timing) lines.push('Không đo được thời lượng có chữ vì một số cảnh thiếu mốc timeline.');
    if (text_audit.voice?.status === OK) source(text_audit.voice.source);
    else if (text_audit.voice) missing(text_audit.voice);
  } else missing(text_audit);
  if (text_audit.scenes?.length) {
    lines.push('');
    table('Cảnh', 'Mốc', 'Số từ chữ', 'Từ / nhóm đồng thời (đỉnh)', 'Similarity cao nhất', 'Keyword có hình (%)', 'Kinetic', 'Cờ');
    const flags = Map.groupBy(findings.filter(({ group }) => group === VISUAL_FIRST)
      .flatMap(({ code, scene_ids }) => (scene_ids ?? []).map((id) => ({ id, code }))), ({ id }) => id);
    for (const scene of text_audit.scenes) {
      row(scene.id, at(scene), fmt(scene.text_words), scene.peaks ? `${scene.peaks.words.count} / ${scene.peaks.groups.count}` : '—',
        fmt(scene.max_similarity), fmt(scene.keyword_visual_pct), fmt(scene.kinetic), flags.get(scene.id)?.map(({ code }) => code).join(', '));
    }
  }
  lines.push('', `Phụ đề riêng (accessibility) · Phủ ${fmt(text_audit.caption_coverage_pct)}% thời lượng · ${fmt(text_audit.caption_words_total)} từ · Tỉ lệ từ phụ đề / từ chữ minh hoạ ${fmt(text_audit.caption_to_label_ratio)} · Dải dưới ${text_audit.caption_band_ok == null ? 'không đo được' : text_audit.caption_band_ok ? 'đạt' : 'có cảnh báo'}.`);
  if (evidence.nocaption_board.status === OK) lines.push(`Xem ${link(evidence.nocaption_board.file)} để kiểm khả năng hiểu qua hình.`);
  else lines.push(`Ảnh ghép hình chưa đốt phụ đề · ${UNAVAILABLE}: ${evidence.nocaption_board.reason}.`);

  section('Phụ đề và đồng bộ');
  if (subtitles.srt.status === OK) {
    const { cue_count, max_lines, max_chars, sync } = subtitles.srt;
    lines.push(`${cue_count} cue, tối đa ${max_lines} dòng/cue và ${max_chars} ký tự/dòng.`, '');
    if (sync.status === OK) {
      lines.push(`Khớp ${sync.matches.length} cue đầu câu với mốc hết khoảng lặng ≥ ${fmt(LIMITS.sentence_pause_s)} s. Δ = mốc cue − mốc tiếng.`, '');
      table('Cue', 'Mốc cue', 'Khoảng lặng trước cue', 'Bắt đầu tiếng (s)', 'Δ (s)', 'Cờ');
      for (const item of sync.matches) row(item.cue, at(item), seconds(item.silence_start_s, item.speech_start_s),
        fmt(item.speech_start_s), fmt(item.offset_s), item.warning ? 'Cảnh báo' : '—');
    } else missing(sync);
  } else missing(subtitles.srt);
  lines.push('');
  if (subtitles.ass.status === OK) {
    lines.push(`Cỡ chữ và tâm khối dòng được quy về khung cao 1920 px từ PlayResY ${subtitles.ass.play_res_y}. Ngưỡng thử ${SUBTITLE_MIN_PX}–${SUBTITLE_MAX_PX} px, tối ưu ${SUBTITLE_MIN_PX}–${SUBTITLE_PREFERRED_MAX_PX} px.`, '');
    table('Style trong Dialogue', 'Fontsize', 'Cỡ quy đổi (px)', 'Alignment', 'MarginV', 'Tâm y mẫu (px)', 'Dải dưới');
    for (const style of subtitles.ass.styles) {
      row(style.name, fmt(style.fontsize), fmt(style.px), fmt(style.alignment), fmt(style.margin_v),
        fmt((style.outside ?? style.first).y_center), style.band_ok === null ? 'Không đo được' : style.band_ok ? 'Đạt' : 'Cảnh báo');
    }
    source(subtitles.ass.source);
  } else missing(subtitles.ass);

  section('Phát âm Y8');
  if (pronunciation.status === OK) {
    lines.push(`phonemes.py thoát mã ${pronunciation.exit_code}, kiểm ${pronunciation.line_count} dòng, ${pronunciation.errors.length} mục lỗi.`);
    source(pronunciation.source);
    if (pronunciation.errors.length) {
      lines.push('');
      table('Dòng', 'Nhãn', 'Thuật ngữ', 'Đưa vào TTS', 'Âm vị', 'Chi tiết');
      for (const item of pronunciation.errors) row(item.row, item.label, item.term, item.tts, item.ipa, item.detail);
    }
  } else missing(pronunciation);

  section('Ảnh bằng chứng');
  table('Ảnh', 'Mốc', 'Ô lưới hoặc chi tiết');
  for (const image of evidence.images) {
    if (image.status !== OK) row(image.file, at(image), image.reason);
    else if (image.kind === 'text_overlap') {
      row(link(image.file), at(image), image.tiles.map(({ row: r, col, scene_id, frame_s, texts }) =>
        `${r}.${col} = ${scene_id} ${seconds(frame_s)} · «${texts.join('» / «')}»`).join(' · '));
    } else if (image.kind === 'board' || image.kind === 'nocaption_board') {
      const tileText = image.tiles.map(({ row: r, col, time_s, frame_s }) =>
        `${r}.${col} = ${fmt(time_s ?? frame_s)} s${time_s != null && time_s !== frame_s ? ` (khung ${fmt(frame_s)} s)` : ''}`).join(' · ');
      row(link(image.file), at(image), tileText);
    } else row(link(image.file), at(image), image.scene_id ?? (image.kind === 'thumbnail' ? 'Bìa 180×320' : 'Khung gốc'));
  }
  if (evidence.omitted_scene_images) {
    lines.push('', `${evidence.omitted_scene_images} ảnh cảnh vượt giới hạn ${LIMITS.scene_image_limit} ảnh. Bảng camera vẫn ghi số đo các cặp khung đã đọc.`);
  }
  lines.push('', `Dữ liệu ffprobe và JSON gốc từ qc-video, qc-publish nằm trong ${link('report.json')}.`);
  section('Các bước không đo được');
  const steps = [
    ['FFprobe', probe], ['qc-video', technical.qc_video], ['Timeline', timeline], ['Chuyển động', motion],
    ['Khoảng lặng', audio], ['SRT', subtitles.srt], ['Đồng bộ', subtitles.srt.sync], ['ASS', subtitles.ass],
    ['Storyboard', storyboard], ['Tuân thủ', compliance], ['Âm vị', pronunciation], ['Lấy mẫu ảnh', evidence.samples],
    ['Chữ và hình', text_audit], ['Lời nguyên văn để so chữ', text_audit.voice], ['Ảnh hình chưa đốt phụ đề', evidence.nocaption_board],
  ];
  const failed = steps.filter(([, value]) => value?.status === UNAVAILABLE);
  for (const [label, value] of failed) lines.push(`- ${label} · ${value.reason}`);
  if (!failed.length) lines.push('Các bước trên đã trả số đo.');
  section('Kiểm thủ công bắt buộc');
  table('Nội dung', 'Mốc', 'Bằng chứng cần xem', 'Trạng thái');
  for (const item of manual_checks) row(item.label, at(item), item.evidence, item.status);
  lines.push('');
  return lines.join('\n');
}

function locateVideo(episode) {
  if (!episode || !fs.statSync(episode, { throwIfNoEntry: false })?.isDirectory()) return null;
  const final = path.join(episode, 'final');
  if (!fs.statSync(final, { throwIfNoEntry: false })?.isDirectory()) return null;
  const files = fs.readdirSync(final, { withFileTypes: true })
    .filter((item) => item.isFile() && /_9x16\.mp4$/i.test(item.name)).map(({ name }) => name).sort();
  return files.length ? { id: files[0].replace(/_9x16\.mp4$/i, ''), file: path.join(final, files[0]), final } : null;
}

function parseArgs([episode, ...args]) {
  const options = { frames: [] };
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];
    if (args[i] !== `--${key}` || !['min', 'max', 'profile', 'frames', 'baseline', 'out', 'voice'].includes(key) || !value || value.startsWith('--')) {
      throw new Error(`Đối số thiếu hoặc không hợp lệ: ${args[i]}.`);
    }
    if (['min', 'max'].includes(key)) options[key] = Number(value);
    else if (key === 'profile') {
      if (!Object.hasOwn(PROFILES, value)) throw new Error('--profile cần short, standard hoặc explainer.');
      options.profile = value;
    }
    else if (key === 'frames') {
      const parts = value.split(',').map((part) => part.trim());
      if (parts.some((part) => !part || !Number.isFinite(Number(part)) || Number(part) < 0)) {
        throw new Error('--frames cần danh sách mốc giây không âm, cách nhau bằng dấu phẩy.');
      }
      options.frames = [...new Set(parts.map(Number))];
    } else options[key] = path.resolve(value);
  }
  if ([options.min, options.max].some((limit) => limit !== undefined && (!Number.isFinite(limit) || limit < 0)) || options.max < options.min) {
    throw new Error('Cần 0 ≤ --min ≤ --max.');
  }
  return { episode: episode && path.resolve(episode), ...options };
}

function technicalQc(file, timeline, out, min, max) {
  const args = [file, '--min', String(min), '--max', String(max)];
  if (timeline.status !== OK) return runQc('qc-video.mjs', args);
  if (!timeline.normalized) return runQc('qc-video.mjs', [...args, '--scenes', timeline.source]);
  const temporary = path.join(out, `.scenes-qc-${process.pid}.json`);
  fs.writeFileSync(temporary, JSON.stringify(timeline.scenes), { flag: 'wx' });
  try {
    return runQc('qc-video.mjs', [...args, '--scenes', temporary]);
  } finally {
    fs.unlinkSync(temporary);
  }
}

function applyExplainerMin(qc, usesDefault, min) {
  if (!usesDefault || !qc.result?.fails) return qc;
  // Giữ kết quả gốc của qc-video. Mốc dưới mặc định của explainer là cảnh báo trong báo cáo H3.
  const fails = qc.result.fails.filter((message) => !(message.startsWith('Dài ') && message.endsWith(` < tối thiểu ${min}s`)));
  if (fails.length === qc.result.fails.length) return qc;
  return { ...qc, raw_result: qc.result, raw_exit_code: qc.exit_code, exit_code: fails.length ? 1 : 0,
    result: { ...qc.result, fails, pass: !fails.length } };
}

function optionalJson(file, validate, problems) {
  try {
    const data = readJson(file);
    if (!validate(data)) throw new Error('Sai định dạng nguồn QC.');
    return data;
  } catch (error) {
    if (error.code !== 'ENOENT') problems.push(path.basename(file) + ' — ' + error.message);
    return null;
  }
}

function measurePcm(file) {
  const source = probeMedia(file);
  const { rate } = D8_LIMITS.voice_edges;
  if (source.format_name !== 'wav' || source.audio_codec !== 'pcm_s16le' ||
    source.audio_channels !== 1 || source.audio_sample_rate !== rate) {
    throw new Error('Đếm mẫu clip cần WAV PCM s16 mono ' + rate + ' Hz, đúng định dạng của bộ trộn.');
  }
  const { stdout } = checked('ffmpeg', ['-v', 'error', '-i', file, '-map', '0:a:0',
    '-c:a', 'copy', '-f', 's16le', '-'], { encoding: 'buffer' });
  if (!stdout.length) throw new Error('Không có mẫu PCM.');
  const pcm = pcmEvidence(new Int16Array(stdout.buffer, stdout.byteOffset, stdout.length / 2), rate);
  const { stderr } = checked('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af',
    'loudnorm=print_format=json', '-f', 'null', '-']);
  const stats = JSON.parse(stderr.match(/\{[^{}]*"input_i"[^{}]*\}/s)?.[0] ?? '{}');
  const finite = (value) => value != null && Number.isFinite(Number(value)) ? Number(value) : null;
  return { ...pcm, source: file, duration_s: source.duration_s ?? pcm.duration_s,
    lufs: finite(stats.input_i), true_peak_dbtp: finite(stats.input_tp) };
}

function validWindow(window) {
  return Number.isFinite(window?.start) && window.start >= 0 && Number.isFinite(window.end) && window.end > window.start;
}

function readAudioInputs(episode) {
  const assets = path.join(episode, 'assets');
  const root = path.join(assets, 'audio');
  const stem = path.join(root, 'stems', 'voice.wav');
  const problems = [];
  const files = Object.fromEntries(['mix', 'voice', 'music', 'sfx', 'impact'].map((layer) =>
    [layer, path.join(root, ...(layer === 'mix' ? [] : ['stems']), layer + '.wav')]));
  const pcm = {};
  for (const [layer, file] of Object.entries(files)) {
    if (!fs.existsSync(file)) continue;
    const result = attempt(() => measurePcm(file));
    if (result.status === UNAVAILABLE) problems.push(path.basename(file) + ' — ' + result.reason);
    else pcm[layer] = result;
  }
  const sheet = optionalJson(path.join(assets, 'sound-cues.json'), (data) =>
    Array.isArray(data?.cues) && data.cues.every((cue) => Number.isFinite(cue?.t) && cue.t >= 0 &&
      ['sfx', 'impact'].includes(cue.layer) && typeof cue.intent === 'string') &&
    data.layers && Array.isArray(data.silences) && data.silences.every(validWindow), problems);
  const plan = optionalJson(path.join(assets, 'voice', 'prosody-plan.json'), (data) =>
    Array.isArray(data?.lines) && data.lines.every((line) => typeof line?.line_id === 'string'), problems);
  const voiceTimeline = optionalJson(path.join(assets, 'voice', 'voice-timeline.json'), (data) =>
    Array.isArray(data?.lines) && data.lines.every(validWindow), problems);
  const cues = optionalJson(path.join(assets, 'voice', 'cues.json'), (data) =>
    Array.isArray(data) && data.every(validWindow), problems)?.map(({ line, scene, ...cue }) =>
    ({ ...cue, line_id: String(line).padStart(2, '0'), scene_id: scene })) ?? [];
  const mixReport = optionalJson(path.join(root, 'mix-report.json'), (data) => data?.stems, problems);
  return { pcm, sheet, plan, lines: voiceTimeline?.lines ?? [], cues, mixReport, stem, problems };
}

function reviewItems(report, phaseImages, endImage) {
  const { audio, visual, narrative } = report.groups;
  const fixed = report.manual_checks.map(({ key, label, evidence }) => ({
    id: key, group: /voice|pronunciation|emphasis/.test(key) ? 'audio' :
      key === 'explanation_order' ? 'narrative' : 'visual',
    question: label + '?', why_not_auto: 'Cần người duyệt đối chiếu hình hoặc nghe trực tiếp.',
    evidence: [evidence], proxies: {},
  }));
  const opening = [...report.opening.images, ...phaseImages].filter(({ status }) => status === OK).map(({ file }) => file);
  const cues = narrative.cuts_during_voice ?? [];
  const end = endImage?.status === OK ? [endImage.file] : [seconds(report.scenes?.at(-1)?.start ?? report.technical.ffprobe.duration_s)];
  return [...fixed,
    { id: 'audio_listen', group: 'audio', question: 'Nhịp nghỉ, nhấn ý, phát âm và tương quan bốn lớp khi nghe có phù hợp không?',
      why_not_auto: 'CHƯA KIỂM — giám đốc nghe.', evidence: ['Video thành phẩm và bảng Audio QC'],
      proxies: { pauses: audio.pauses, ducking: audio.ducking } },
    { id: 'visual_word_sync', group: 'visual', question: 'Nhãn có hiện cùng từ khóa được nhắc không?',
      why_not_auto: 'Chỉ có cửa sổ thời gian ở mức câu.', evidence: ['Bảng Visual QC và các cảnh có nhãn'],
      proxies: { measured_sentence_matches: visual.label_sync.filter(({ ok }) => ok !== null).length } },
    { id: 'opening_hook', group: 'narrative', question: 'Opening có làm rõ mâu thuẫn và tạo lý do xem tiếp không?',
      why_not_auto: 'Mốc đổi hình và pha chỉ mô tả thời gian.', evidence: opening.length ? opening : ['0 s và các mốc opening'],
      proxies: { first_change_s: narrative.first_change_s, conflict_s: narrative.conflict_s, first_voice_s: narrative.first_voice_s } },
    { id: 'narrative_transitions', group: 'narrative', question: 'Trình tự giải thích có logic và chỗ chuyển ý có dễ theo dõi không?',
      why_not_auto: 'Mốc cắt và vai trò cảnh chưa biểu đạt được quan hệ giữa các ý.',
      evidence: cues.length ? cues.map((time) => seconds(time)) : ['Chuỗi vai trò cảnh và các ranh giới cảnh'],
      proxies: { roles: narrative.roles, cuts_during_voice: cues, lead_in_scene: narrative.lead_in_scene } },
    { id: 'narrative_conclusion', group: 'narrative', question: 'Kết luận có rõ và giúp người xem áp dụng được không?',
      why_not_auto: 'Ý định giọng và thời gian giữ chỉ là dữ kiện quan sát.', evidence: end,
      proxies: { conclusion: narrative.final_conclusion, hold_s: narrative.final_hold_s } },
    ...Object.entries({ audio, visual }).filter(([, result]) => result.missing.length).map(([group, result]) => ({
      id: group + '_missing_evidence', group, question: 'Có thể bổ sung nguồn để đối chiếu các phép đo còn thiếu không?',
      why_not_auto: result.reason, evidence: result.missing, proxies: {},
    })),
  ];
}

function measure(episode, out, video, options) {
  const measuredAt = new Date().toISOString();
  const { file, final } = video;
  const timeline = attempt(() => readTimeline(episode));
  const audioInputs = readAudioInputs(episode);
  const probe = attempt(() => probeMedia(file));
  const profile = selectProfile(probe.duration_s, options.max, options.profile);
  const { max_scenes, ...profileLimits } = PROFILES[profile];
  const min = options.min ?? profileLimits.min_duration_s;
  const max = options.max ?? profileLimits.max_duration_s;
  // Mốc dưới mặc định của standard/explainer chỉ là cảnh báo, kể cả khi người gọi chọn trần thấp hơn.
  const softMin = usesExtendedChecks(profile) && options.min == null;
  if (max < min && !softMin) throw new Error('Cần 0 ≤ --min ≤ --max.');
  const thresholds = {
    ...LIMITS, ...profileLimits, min_duration_s: min, max_duration_s: max,
    max_scenes: typeof max_scenes === 'function' ? (probe.duration_s ? max_scenes(probe.duration_s) : null) : max_scenes,
    information_pacing: PACING, text_audit: TEXT_AUDIT_LIMITS, d8: D8_LIMITS,
    version: THRESHOLD_VERSION, final_audio: QC_THRESHOLDS.final_audio, audio: QC_THRESHOLDS.audio,
    frame: PIPELINE.frame, camera: PIPELINE.camera, visual: QC_THRESHOLDS.visual, narrative: QC_THRESHOLDS.narrative,
    sound_design: { version: SOUND_DESIGN.version, layers: SOUND_DESIGN.layers, density_window_s: SOUND_DESIGN.derive.density_window_s },
    prosody: { version: PROSODY.version, intents: PROSODY.intents, histogram_edges_s: PROSODY.metrics.pause_histogram_edges_s },
  };
  const technical = {
    ffprobe: probe,
    qc_video: attempt(() => applyExplainerMin(technicalQc(file, timeline, out, min, max), softMin, min)),
  };
  const info = technical.qc_video.result?.info;
  const stats = info?.scene_stats ?? (timeline.scenes ? sceneStats(timeline.scenes) : null);
  const motion = {
    ...(info?.motion ? measured({ result: info.motion }) : unavailable('qc-video không trả số đo chuyển động.')),
    scene_stats: stats, layouts: info?.layouts ?? null,
    longest_static: info?.motion?.static_runs.find(({ length_s }) => length_s === info.motion.longest_static_s)
      ?? info?.longest_static ?? null,
  };
  const motionAlerts = info?.motion ? motionFindings(info.motion, info.scenes, timeline.scenes) : [];
  const sourceVoice = attempt(() => measureSourceVoice(episode, options.voice, probe.duration_s ?? info?.duration_s));
  const measuredStem = sourceVoice.source === audioInputs.stem && sourceVoice.status === OK ? sourceVoice : null;
  const muxAudio = attempt(() => measureSilence(file, technical.ffprobe.audio_end_s, technical.ffprobe.duration_s));
  const audio = { ...(measuredStem ?? muxAudio), source: measuredStem?.source ?? 'MP4',
    voiced_s_mp4: muxAudio.voiced_s ?? null };
  const voiceResult = attempt(() => readVoiceEdges(file, probe, timeline, measuredStem?.source, audioInputs.lines));
  const voice_edges = voiceResult.voice_edges ?? unchecked(voiceResult.reason, { source: 'MP4', ok: null, technical_fail: false });
  voice_edges.image = voiceResult.envelope ? captureVoiceEdges(out, voice_edges, voiceResult.envelope) : null;
  const videoPass = technical.qc_video.result?.pass;
  technical.pass = voice_edges.technical_fail || videoPass === false ? false :
    videoPass === true && voice_edges.status === OK ? true : null;
  audio.voice = sourceVoice;
  audio.speech = attempt(() => measureSpeechPace(episode, muxAudio, audio.voice));
  audio.speech_pace_syll_s = audio.speech.speech_pace_syll_s ?? null;
  audio.speech_pace_voice_syll_s = audio.speech.speech_pace_voice_syll_s ?? null;
  audio.voiced_s_voice = audio.voice.voiced_s ?? null;
  audio.voiced_s ??= null;
  audio.pause_ratio ??= null;
  const information_pace = attempt(() => measureInformation(timeline, audio, probe.duration_s));
  const sync = attempt(() => measureVoiceSync(timeline, audio));
  const subtitles = {
    srt: attempt(() => readCaptions(path.join(final, 'captions.srt'), audio)),
    ass: attempt(() => readAss(episode)),
  };
  const { visual_scenes = [], ...storyboard } = attempt(() => readStoryboard(episode, timeline));
  const auditVoice = attempt(() => readAuditVoice(episode));
  const duration = probe.duration_s ?? info?.duration_s ?? null;
  const renderEvidence = readRenderEvidence(episode);
  const text_overlap = renderEvidence.log ? measured(measureTextOverlap(renderEvidence.log, duration)) : unchecked(renderEvidence.reason);
  const text_audit = attempt(() => measureTextAudit(visual_scenes, storyboard, timeline, auditVoice, subtitles, duration));
  const rendered = auditRenderedText(renderEvidence.log, visual_scenes, timeline.scenes ?? [], auditVoice.lines ?? [], duration);
  text_audit.render = renderEvidence.log ? measured({ source: 'render-log', ...rendered }) :
    unchecked(renderEvidence.reason, { source: 'storyboard', scenes_with_text_pct: null, ...rendered });
  const publish = path.join(final, 'publish.json');
  const compliance = attempt(() => fs.existsSync(publish) ?
    runQc('qc-publish.mjs', [publish]) : unavailable('Thiếu final/publish.json.'));
  const pronunciation = attempt(() => measurePronunciation(episode));
  const framePoints = attempt(() => probe.status === OK && probe.width ?
    measured({ times: frameTimes(file, probe.container_start_s) }) : unavailable('Thiếu luồng hình hoặc thời lượng để chụp khung.'));
  const textOverlapImage = renderEvidence.log ? captureTextOverlap(file, out, framePoints, text_overlap, renderEvidence.log.size) : null;
  const samples = attempt(() => framePoints.status === OK ?
    captureSceneEvidence(file, out, probe, framePoints.times, motionAlerts, timeline.scenes ?? [],
      storyboard.cameras ?? [], text_audit) : framePoints);
  if (storyboard.cameras) {
    storyboard.cameras = samples.cameras ?? storyboard.cameras.map((camera) => ({ ...camera, ...unavailable(samples.reason) }));
  }
  const thumbnail = { kind: 'thumbnail', file: 'thumb-180x320.png',
    ...attempt(() => captureThumbnail(path.join(final, 'thumbnail.jpg'), out)) };
  const frames = options.frames.map((time) => ({
    kind: 'frame', file: `frame-${time}.png`, time_s: time, start: time, end: time,
    ...attempt(() => captureFrame(file, out, time, technical.ffprobe.duration_s)),
  }));
  const opening = { scenes: [], images: [], ...attempt(() => openingEvidence(file, out, probe, framePoints, timeline)),
    ...checkOpening(timeline.scenes, duration, storyboard.opening?.voice === true && !measuredStem ? undefined :
      voiceResult.voice_edges?.first_sound_s, renderEvidence.log, D8_LIMITS.opening, storyboard.opening?.voice === true),
    d8_status: renderEvidence.log ? OK : UNCHECKED, source_d8: renderEvidence.log ? 'render-log' : null,
    reason_d8: renderEvidence.reason };
  opening.phase_status = opening.phase_ok === null ? UNCHECKED : OK;
  opening.voice_source = opening.first_sound_s !== null ? voice_edges.source : null;
  const captureAt = (time, name) => attempt(() => captureFrame(file, out, time, duration, name));
  const phaseImages = opening.phases.map(({ start, phase }, index) => captureAt(start, 'frame-phase-' + index + '-' + phase + '.png'));
  const endScene = timeline.scenes?.at(-1);
  const endImage = endScene ? captureAt((endScene.start + endScene.end) / 2, 'frame-conclusion.png') : null;
  const sceneWindows = (timeline.scenes ?? []).flatMap((scene) =>
    (scene.voice ?? []).map((window) => ({ ...window, scene_id: scene.id })));
  const speechWindows = audioInputs.cues.length ? audioInputs.cues : audioInputs.lines;
  const lineWindows = speechWindows.length ? speechWindows : sceneWindows;
  const audioAudit = auditAudio({ ...audioInputs, log: renderEvidence.log, voice: measuredStem,
    design: SOUND_DESIGN, prosody: PROSODY, scenes: timeline.scenes ?? [], fps: probe.fps ?? renderEvidence.log?.fps });
  if (audioInputs.problems.length) {
    audioAudit.missing.push(...audioInputs.problems);
    audioAudit.status = UNCHECKED;
    audioAudit.reason = audioAudit.missing.join(' ');
  }
  audioAudit.voice_edges = voice_edges;
  if (voice_edges.status !== OK) {
    audioAudit.missing.push(voice_edges.reason);
    audioAudit.status = UNCHECKED;
    audioAudit.reason = audioAudit.missing.join(' ');
  }
  const groups = {
    audio: audioAudit,
    visual: auditVisual(renderEvidence.log, timeline.scenes ?? [], visual_scenes, speechWindows, audioInputs.plan, opening, info?.motion, duration),
    narrative: auditNarrative(timeline.scenes ?? [], visual_scenes, lineWindows, audioInputs.plan, opening,
      info?.motion?.first_change_s ?? null, duration),
  };
  if (opening.scenes.length) {
    const scope = { start: opening.scenes[0].start, end: opening.scenes[0].end, scene_ids: [opening.scenes[0].id] };
    const flag = (kind, level, message) => groups.visual.findings.push({ kind, level, message, ...scope });
    if (opening.phase_ok === false) flag('opening_phases', ERROR, 'Các pha opening sai thứ tự, thời lượng hoặc ranh giới.');
    if (opening.phase_ok === null) flag('opening_phases_missing', INFO, 'CHƯA KIỂM — thiếu pha opening trong render-log.');
    if (opening.target_ok === false && opening.duration_ok) flag('opening_target_duration', INFO,
      'Opening ngoài khoảng mục tiêu ' + PIPELINE.opening.target_s.join('–') + ' s.');
    const windows = info?.motion?.opening_windows;
    opening.motion_ok = windows?.length ? windows.every(({ changed }) => changed) : null;
    if (opening.motion_ok === false) for (const window of windows.filter(({ changed }) => !changed)) {
      groups.visual.findings.push({ kind: 'opening_motion', level: WARN,
        message: 'Opening thiếu thay đổi hình trong cửa sổ ' + seconds(window.start, window.end) + '.',
        ...scope, start: window.start, end: window.end });
    }
    if (opening.motion_ok === false && opening.phase_ok !== null) opening.ok = false;
    if (opening.motion_ok === null && opening.ok === true) opening.ok = null;
    if (opening.voiced) {
      const isOpeningWindow = (item) => item.start < scope.end && item.end > scope.start;
      const openingVoiceWindows = (timeline.scenes ?? []).flatMap(({ voice }) => voice ?? []);
      const windows = openingVoiceWindows.length ? openingVoiceWindows : audioInputs.lines;
      const hasWindow = windows.some(isOpeningWindow);
      const hasViolation = voice_edges.violations?.some(isOpeningWindow);
      opening.voice_edges_ok = !measuredStem || !hasWindow ? null : hasViolation ? false :
        voice_edges.unmeasured?.some(isOpeningWindow) || !voice_edges.measured_count ? null : true;
      if (opening.voice_edges_ok === false) {
        flag('opening_voice_edges', ERROR, 'Mép lời opening có dấu hiệu cắt theo phép đo R23.');
        opening.ok = false;
      } else if (opening.voice_edges_ok === null && opening.ok === true) opening.ok = null;
    }
    if (opening.motion_ok === null || opening.voice_ok === null || opening.voice_edges_ok === null) {
      const missing = groups.visual.missing;
      if (opening.motion_ok === null && !missing.some((item) => item.includes('chuyển động opening')))
        missing.push('Thiếu mẫu chuyển động trong cửa sổ opening.');
      if (opening.voice_ok === null) missing.push('Thiếu phép đo mốc lời đầu của opening.');
      if (opening.voice_edges_ok === null) missing.push('Thiếu phép đo mép lời R23 trong opening.');
      groups.visual.status = UNCHECKED;
      groups.visual.reason = missing.join(' ');
    }
  }
  const { status: render_status, reason: render_reason, ...headerAudit } = measureD8Header(renderEvidence, timeline, opening, duration);
  const header = { image: unavailable('Không có ảnh vùng header.'),
    ...attempt(() => measureHeader(file, out, framePoints, timeline, probe.duration_s)), render_status, render_reason, ...headerAudit };
  const nocaption_board = { kind: 'nocaption_board', file: 'nocaption-board.png',
    ...attempt(() => captureNoCaptionBoard(episode, out)) };
  const evidence = {
    samples: samples.status === OK ? measured({}) : samples,
    images: [...(samples.images ?? []), thumbnail, ...frames, ...opening.images, ...phaseImages, ...(endImage ? [endImage] : []),
      { kind: 'header', file: 'header-zones.png', ...header.image }, nocaption_board,
      ...[voice_edges.image, textOverlapImage].filter(Boolean)],
    nocaption_board,
    omitted_scene_images: samples.omitted_scene_images ?? null,
  };
  const standard = readBaseline(options.baseline);
  const paceKey = audio.speech_pace_voice_syll_s === null ? 'speech_pace_syll_s' : 'speech_pace_voice_syll_s';
  const baselineVoice = paceKey === 'speech_pace_voice_syll_s' && standard?.metrics?.speech_pace_voice_syll_s > 0;
  const before = standard?.metrics?.[baselineVoice ? 'speech_pace_voice_syll_s' : 'speech_pace_syll_s'];
  const paceChange = Number.isFinite(before) && before > 0 && Number.isFinite(audio[paceKey]) ?
    { key: paceKey, before, baselineSource: baselineVoice ? 'WAV giọng gốc' : 'MP4', relative: 100 * (audio[paceKey] / before - 1) } : null;
  const report = {
    threshold_version: THRESHOLD_VERSION, measured_at: measuredAt, video: { id: video.id, file }, profile, thresholds,
    technical, timeline, motion, audio, subtitles, storyboard, compliance, pronunciation, evidence, groups,
    information_pace, opening, header, sync, text_audit, text_overlap, voice_edges, manual_checks: manualChecks(probe.duration_s),
  };
  report.findings = collectFindings(report, motionAlerts, paceChange);
  const layoutById = new Map((info?.layouts?.groups ?? []).flatMap(({ rep, scenes }) => scenes.map((id) => [id, rep])));
  const motionById = new Map((info?.scenes ?? []).map((scene) => [scene.id, scene]));
  const declared = new Map((storyboard.declarations ?? []).map((scene) => [scene.id, scene]));
  report.scenes = (timeline.scenes ?? []).map((scene) => ({
    ...scene, shot: null, movement: null, theme: null, scene_type: null,
    active_median: null, local_median: null, static_pct: null, longest_static_s: null, layout_diff_next: null,
    ...declared.get(scene.id), ...motionById.get(scene.id), layout_group: layoutById.get(scene.id) ?? null,
    flags: report.findings.filter((item) => item.level === WARN &&
      (item.scene_ids?.includes(scene.id) || (item.kind === 'static' && item.start < scene.end && item.end > scene.start)))
      .map(({ code }) => code),
  }));
  const qcImages = new Map();
  for (const item of report.findings) {
    if (!['visual', 'audio'].includes(item.group) || item.level === INFO ||
      !Number.isFinite(item.start) || item.end - item.start >= duration) continue;
    const time = item.start;
    if (!qcImages.has(time) && qcImages.size < LIMITS.scene_image_limit) {
      const image = captureAt(time, 'frame-qc-' + item.code + '.png');
      qcImages.set(time, image);
      if (image.status === OK) evidence.images.push(image);
    }
    const image = qcImages.get(time);
    if (image?.status === OK) item.images = [...new Set([image.file, ...(item.images ?? [])])];
  }
  report.needs_manual_review = reviewItems(report, phaseImages, endImage);
  const errors = report.findings.filter(({ level }) => level === ERROR).length;
  const warnings = report.findings.filter(({ level }) => level === WARN).length;
  report.machine_verdict = {
    measurable_pass: errors || technical.pass === false ? false :
      technical.pass === true && Object.values(groups).filter((group) => group !== groups.narrative)
        .every(({ status }) => status === OK) ? true : null,
    errors, warnings, final_pass_allowed: report.needs_manual_review.length === 0 && !errors && technical.pass === true,
  };
  report.metrics = summarize(report);
  report.baseline = compareBaseline(standard, report.metrics, paceChange);
  return report;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const { episode } = options;
  const video = locateVideo(episode);
  if (!video) {
    process.exitCode = 2;
    console.log('Không tìm thấy thư mục tập hoặc video final/*_9x16.mp4.');
    return;
  }
  const out = options.out ?? path.join(episode, 'assets', '_scratch', 'qc-auto');
  fs.mkdirSync(out, { recursive: true });
  const report = measure(episode, out, video, options);
  const md = path.join(out, 'report.md');
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(md, markdown(report));
  const errors = report.findings.filter(({ level }) => level === ERROR).length;
  console.log(`Đã đo ${video.id} · ${report.findings.length} phát hiện · ${report.metrics.warning_count} cảnh báo · ${errors} lỗi · ${md}`);
}

try {
  main();
} catch (error) {
  process.exitCode = 2;
  console.log(`Không lập được báo cáo QC. ${error.message.replace(/\r?\n/g, ' ')}`);
}
