import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const tool = fileURLToPath(new URL('../../tools/qc-measure.mjs', import.meta.url));
const options = { windowsHide: true, encoding: 'utf8' };
const available = ['ffmpeg', 'ffprobe'].every((command) => spawnSync(command, ['-version'], options).status === 0);
const skip = !available && 'thiếu ffmpeg hoặc ffprobe trong PATH';
const json = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(file, JSON.stringify(value));

function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-qc-measure-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function ffmpeg(args) {
  const result = spawnSync('ffmpeg', ['-v', 'error', '-y', ...args], options);
  assert.equal(result.status, 0, result.stderr || result.error?.message);
}

function writeAss(file, fontsize, alignment, margin) {
  fs.writeFileSync(file, [
    '[V4+ Styles]', 'Format: Name, Fontname, Fontsize, Alignment, MarginV',
    'Style: Default,Arial,68,5,0', `Style: Caption,Arial,${fontsize},${alignment},${margin}`,
    '[Events]', 'Format: Layer, Start, End, Style, Text',
    'Dialogue: 0,0:00:00.00,0:00:02.25,Caption,Đầu câu.', '',
  ].join('\n'));
}

function makeEpisode(root) {
  const episode = path.join(root, 'tập thử', 'ep01');
  const final = path.join(episode, 'final');
  const assets = path.join(episode, 'assets');
  const scratch = path.join(assets, '_scratch');
  fs.mkdirSync(final, { recursive: true });
  fs.mkdirSync(scratch, { recursive: true });
  const video = path.join(final, 'TEST-E01_9x16.mp4');
  ffmpeg([
    '-f', 'lavfi', '-i', 'color=c=red:s=360x640:r=24:d=2',
    '-f', 'lavfi', '-i', 'testsrc2=s=360x640:r=24:d=2',
    '-f', 'lavfi', '-i', 'color=c=blue:s=360x640:r=24:d=2',
    '-f', 'lavfi', '-i', 'sine=frequency=1000:sample_rate=48000:duration=6',
    '-filter_complex', '[0:v][1:v][2:v]concat=n=3:v=1:a=0,scale=1080:1920[v]',
    '-map', '[v]', '-map', '3:a', '-af', "volume='if(between(t,1.1,1.99)+gte(t,5.15),0,2.25)':eval=frame",
    '-c:v', 'libx264', '-threads', '3', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', video,
  ]);
  ffmpeg(['-i', video, '-vf', 'scale=360:640', '-frames:v', '1', '-threads', '1', path.join(final, 'thumbnail.jpg')]);
  const scenes = [
    { id: 'S01', start: 0, end: 2 }, { id: 'S02', start: 2, end: 4 }, { id: 'S03', start: 4, end: 6 },
  ];
  writeJson(path.join(assets, 'scenes.json'), scenes);
  writeJson(path.join(episode, 'storyboard.json'), {
    scenes: scenes.map(({ id }, index) => ({
      scene_id: id, scene_type: 'object_interaction', environment: `database. Kho số ${index + 1}.`,
      camera: { shot: 'wide', movement: index === 1 ? 'push_in' : 'static' },
    })),
  });
  fs.writeFileSync(path.join(final, 'captions.srt'), [
    '1\r\n00:00:00,000 --> 00:00:02,250\r\nĐầu câu.',
    '2\r\n00:00:02,250 --> 00:00:02,900\r\nMột dòng có hơn hai mươi bốn ký tự\r\nDòng hai\r\nDòng ba',
    '3\r\n00:00:04,000 --> 00:00:05,000\r\nCâu kết.',
  ].join('\r\n\r\n') + '\r\n');
  writeAss(path.join(scratch, 'captions.ass'), 56, 2, 420);
  const disclosure = 'Video có nội dung do AI tạo.';
  writeJson(path.join(final, 'publish.json'), {
    ai_generated_content: true, ai_disclosure: disclosure, sources: ['Kịch bản thử'],
    platforms: {
      tiktok: { caption: disclosure }, facebook_reels: { description: disclosure },
      youtube_shorts: { title: 'Video kiểm thử', description: disclosure },
    },
  });
  return { episode, final, assets, scratch, scenes, out: path.join(scratch, 'qc-auto') };
}

function run(episode, args = [], env = process.env) {
  return spawnSync(process.execPath, [tool, episode, ...args], { ...options, env });
}

function readReport(result, out) {
  assert.equal(result.status, 0, result.stderr || result.error?.message || result.stdout);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout.trim().split(/\r?\n/).length, 1);
  assert.ok(result.stdout.includes(path.join(out, 'report.md')), result.stdout);
  return json(path.join(out, 'report.json'));
}

function entries(root, excluded) {
  const list = [];
  for (const item of fs.readdirSync(root, { withFileTypes: true })) {
    const child = path.join(root, item.name);
    if (child === excluded) continue;
    list.push(child);
    if (item.isDirectory()) list.push(...entries(child, excluded));
  }
  return list.sort();
}

function pngSize(file) {
  const header = fs.readFileSync(file);
  assert.equal(header.subarray(1, 4).toString(), 'PNG');
  return [header.readUInt32BE(16), header.readUInt32BE(20)];
}

test('qc-measure: đo video thật, ghi ảnh có mốc và so sánh với báo cáo chuẩn', { skip }, (t) => {
  const root = tempDir(t);
  const fixture = makeEpisode(root);
  const before = entries(root);
  const report = readReport(run(fixture.episode, ['--min', '5', '--max', '7', '--frames', '1, 4.5']), fixture.out);
  assert.deepEqual(entries(root, fixture.out), before);
  assert.deepEqual(fs.readdirSync(fixture.out).sort(), [
    'board-01.png', 'camera-S02.png', 'frame-1.png', 'frame-4.5.png', 'frame-conclusion.png', 'frame-open-end.png', 'frame-open-mid.png',
    'frame-open-start.png', 'header-zones.png', 'report.json', 'report.md', 'scene-S01.png', 'scene-S03.png', 'thumb-180x320.png',
  ]);
  for (const key of ['threshold_version', 'measured_at', 'video', 'thresholds', 'timeline', 'technical', 'audio',
    'subtitles', 'motion', 'storyboard', 'compliance', 'pronunciation', 'evidence', 'findings', 'scenes', 'metrics', 'baseline']) {
    assert.ok(Object.hasOwn(report, key), key);
  }
  assert.equal(report.technical.qc_video.result.pass, true);
  assert.equal(report.compliance.result.pass, true);
  assert.equal(report.technical.ffprobe.fps, 24);
  assert.equal(report.motion.layouts.distinct, 3);
  assert.equal(report.audio.long_pauses.length, 2);
  assert.ok(report.audio.tail_s > 0.7);
  assert.equal(report.profile, 'short');
  assert.equal(report.audio.speech.status, 'không đo được');
  assert.equal(report.metrics.concepts_per_min, null);
  assert.equal(report.sync.status, 'không đo được');
  assert.deepEqual(report.opening.images.map(({ time_s }) => time_s), [0.2, 1, 2.5]);
  // Ngưỡng mới chấp nhận 56 px ở dải dưới. Dòng trên 28 ký tự vẫn bị cảnh báo.
  assert.deepEqual(report.findings.filter(({ level }) => level === 'cảnh báo').map(({ kind }) => kind), [
    'low_motion', 'low_motion', 'scene_mean', 'silent_tail', 'cue_lines', 'cue_chars', 'cue_duration', 'cue_sync',
    'theme_share', 'shot_run', 'kind_share',
  ]);
  assert.equal(report.subtitles.ass.style, 'Caption');
  assert.equal(report.metrics.caption_fontsize, 56);
  assert.equal(report.text_audit.caption_px, 56);
  assert.equal(report.text_audit.caption_band_ok, true);
  assert.equal(report.text_audit.text_words_total, null);
  assert.equal(report.text_audit.verbatim_texts, null);
  assert.equal(report.evidence.nocaption_board.status, 'không đo được');
  assert.match(fs.readFileSync(path.join(fixture.out, 'report.md'), 'utf8'), /không đo được: thiếu picture\.mp4/);
  assert.equal(report.storyboard.themes[0].theme, 'database');
  assert.equal(report.storyboard.themes[0].pct, 100);
  assert.equal(report.storyboard.longest_shot_run.count, 3);
  const cue = report.findings.find(({ kind }) => kind === 'cue_lines');
  assert.deepEqual([cue.cue_number, cue.start, cue.end], [2, 2.25, 2.9]);
  assert.match(cue.message, /3 dòng.*Dòng ba/);
  assert.ok(cue.images.includes('board-01.png'));
  for (const kind of ['cue_chars', 'cue_duration', 'cue_sync', 'shot_run', 'silent_tail']) {
    assert.ok(report.findings.some((finding) => finding.kind === kind), kind);
  }
  const synced = report.subtitles.srt.sync.matches.find(({ cue }) => cue === 2);
  assert.ok(synced.offset_s > 0.15 && synced.offset_s < 0.3);
  const camera = report.storyboard.cameras[0];
  assert.equal(camera.id, 'S02');
  assert.equal(camera.first_s, 2);
  assert.ok(camera.last_s > 3.9 && camera.last_s < 4);
  assert.ok(camera.mean_diff > 0 && camera.mean_diff <= 255);
  assert.deepEqual(pngSize(path.join(fixture.out, 'camera-S02.png')), [720, 640]);
  assert.deepEqual(pngSize(path.join(fixture.out, 'board-01.png')), [1440, 1280]);
  assert.deepEqual(pngSize(path.join(fixture.out, 'thumb-180x320.png')), [180, 320]);
  assert.deepEqual(pngSize(path.join(fixture.out, 'frame-4.5.png')), [1080, 1920]);
  assert.deepEqual(report.evidence.images[0].tiles.map(({ row, col, time_s }) => [row, col, time_s]),
    [[1, 1, 0], [1, 2, 2], [1, 3, 4]]);

  writeJson(path.join(fixture.assets, 'scenes.json'), fixture.scenes.slice(0, 2));
  const compareOut = path.join(root, 'báo cáo so sánh');
  const beforeCompare = entries(root);
  const compare = readReport(run(fixture.episode, ['--min', '5', '--max', '7', '--out', compareOut,
    '--baseline', path.join(fixture.out, 'report.json')]), compareOut);
  assert.deepEqual(entries(root, compareOut), beforeCompare);
  const count = compare.baseline.rows.find(({ key }) => key === 'scene_count');
  assert.deepEqual([count.current, count.baseline, count.delta, count.direction], [2, 3, -1, '↓']);
  assert.match(fs.readFileSync(path.join(compareOut, 'report.md'), 'utf8'), /\| Số cảnh \| 2 \| 3 \| ↓ -1 \|/);
});

test('qc-measure: dùng timeline dự phòng và vẫn hoàn tất khi thiếu đầu vào', { skip }, (t) => {
  const root = tempDir(t);
  const fixture = makeEpisode(root);
  fs.unlinkSync(path.join(fixture.assets, 'scenes.json'));
  fs.unlinkSync(path.join(fixture.episode, 'storyboard.json'));
  fs.unlinkSync(path.join(fixture.final, 'captions.srt'));
  writeJson(path.join(fixture.scratch, 'timeline.json'), { rows: fixture.scenes });
  const before = entries(root);

  const report = readReport(run(fixture.episode), fixture.out);
  assert.deepEqual(entries(root, fixture.out), before);
  assert.equal(report.motion.scene_stats.count, 3);
  assert.equal(report.technical.qc_video.result.pass, false);
  assert.equal(report.technical.qc_video.exit_code, 1);
  assert.equal(report.technical.qc_video.result.info.scenes.length, 3);
  assert.equal(report.storyboard.status, 'không đo được');
  assert.equal(report.subtitles.srt.status, 'không đo được');
  assert.equal(report.subtitles.ass.fontsize, 56);
  assert.equal(report.pronunciation.status, 'không đo được');
  assert.ok(!fs.readdirSync(fixture.out).some((name) => name.endsWith('.json') && name !== 'report.json'));

  fs.mkdirSync(path.join(fixture.assets, 'voice'));
  writeJson(path.join(fixture.assets, 'voice', 'apply.json'), []);
  const emptyPath = path.join(root, 'PATH rỗng');
  fs.mkdirSync(emptyPath);
  const env = Object.fromEntries(Object.entries(process.env).filter(([name]) => name.toUpperCase() !== 'PATH'));
  const noPythonOut = path.join(root, 'báo cáo thiếu Python');
  const withoutPython = readReport(run(fixture.episode, ['--out', noPythonOut], { ...env, PATH: emptyPath }), noPythonOut);
  assert.equal(withoutPython.pronunciation.status, 'không đo được');
  assert.match(withoutPython.pronunciation.reason, /Python\/VieNeu.*ENOENT/);
  assert.equal(withoutPython.pronunciation.exit_code, null);
  assert.equal(withoutPython.compliance.result.pass, true);
});

test('qc-measure: trả mã 2 khi thiếu thư mục tập hoặc MP4', (t) => {
  const root = tempDir(t);
  const missing = path.join(root, 'không có');
  for (const episode of [missing, root]) {
    const result = run(episode);
    assert.equal(result.status, 2);
    assert.match(result.stdout, /Không tìm thấy thư mục tập hoặc video/);
    assert.equal(result.stderr, '');
  }
  assert.deepEqual(fs.readdirSync(root), []);
});

test('qc-measure: nhận chủ đề nền theo từ khoá dù storyboard viết "A · office, …" hay "database. …"', { skip }, (t) => {
  const root = tempDir(t);
  const fixture = makeEpisode(root);
  const environments = ['A · office, ấm, nhìn chếch ngang bàn', 'B · security, toàn cửa sổ cửa hàng', 'database. Xa: ánh xanh dịu'];
  writeJson(path.join(fixture.episode, 'storyboard.json'), {
    scenes: fixture.scenes.map(({ id }, index) => ({
      scene_id: id, scene_type: 'object_interaction', environment: environments[index], camera: { shot: 'wide', movement: 'static' },
    })),
  });
  const report = readReport(run(fixture.episode, ['--min', '5', '--max', '7']), fixture.out);
  assert.deepEqual(report.storyboard.themes.map(({ theme }) => theme).sort(), ['database', 'office', 'security']);
});

test('qc-measure: tự chọn explainer theo --max và gộp phần khai báo còn thiếu', { skip }, (t) => {
  const fixture = makeEpisode(tempDir(t));
  const report = readReport(run(fixture.episode, ['--max', '100']), fixture.out);
  assert.equal(report.profile, 'explainer');
  assert.equal(report.thresholds.max_duration_s, 100);
  assert.equal(report.technical.qc_video.result.pass, true);
  for (const kind of ['opening_missing', 'header_missing', 'information_missing', 'semantic_plan_missing']) {
    assert.equal(report.findings.filter((item) => item.kind === kind && item.level === 'cảnh báo').length, 1, kind);
  }
  const missing = report.findings.find(({ kind }) => kind === 'information_missing');
  assert.deepEqual(missing.scene_ids, ['S01', 'S02', 'S03']);
});

test('qc-measure: explainer đo tiếng, nhịp kiến thức, opening, header và đồng bộ trên video thử', { skip }, (t) => {
  const root = tempDir(t);
  const episode = path.join(root, 'ep01');
  const final = path.join(episode, 'final');
  const assets = path.join(episode, 'assets');
  const out = path.join(root, 'báo cáo explainer');
  fs.mkdirSync(final, { recursive: true });
  fs.mkdirSync(path.join(assets, 'voice'), { recursive: true });
  ffmpeg([
    '-f', 'lavfi', '-i', 'testsrc2=s=360x640:r=24:d=12',
    '-f', 'lavfi', '-i', "aevalsrc='if(between(t,0,1)+between(t,2,3)+between(t,6.5,11.75),0.3*sin(2*PI*440*t),0)':s=48000:d=12",
    '-vf', 'scale=1080:1920', '-c:v', 'libx264', '-threads', '3', '-preset', 'ultrafast',
    '-pix_fmt', 'yuv420p', '-c:a', 'aac', path.join(final, 'TEST-LONG_9x16.mp4'),
  ]);
  writeJson(path.join(assets, 'scenes.json'), [
    { id: 'Mở', start: 0, end: 3.5, role: 'opening', complexity: 'low', concepts: 1, header: null, voice: [{ start: 0, end: 1 }] },
    { id: 'Cơ chế', start: 3.5, end: 11.5, role: 'body', complexity: 'high', concepts: 2,
      header: 'Cơ chế', voice: [{ start: 6.1, end: 11.5 }] },
    { id: 'Kết', start: 11.5, end: 12, role: 'outro', complexity: 'low', concepts: 0, header: '' },
  ]);
  writeJson(path.join(assets, 'voice', 'apply.json'), [
    { text: 'Giải thích kỹ về cơ-chế này.', tts: 'không dùng trường này' },
    { tts: 'Thử với số 2 lần!' },
  ]);
  const baselineFile = path.join(root, 'baseline.json');
  writeJson(baselineFile, { threshold_version: 'H2', metrics: { scene_count: 3 }, audio: { speech_pace_syll_s: 2, pause_ratio: 0.25 } });
  const before = entries(root);
  const report = readReport(run(episode, ['--profile', 'explainer', '--baseline', baselineFile, '--out', out]), out);
  assert.deepEqual(entries(root, out), before);
  assert.equal(report.profile, 'explainer');
  assert.equal(report.thresholds.min_duration_s, 150);
  assert.equal(report.thresholds.max_duration_s, 190);
  assert.equal(report.thresholds.max_scenes, 2);
  assert.equal(report.technical.qc_video.raw_result.pass, false);
  assert.equal(report.technical.qc_video.result.pass, true);
  assert.equal(report.technical.pass, false);
  assert.equal(report.voice_edges.technical_fail, true);
  assert.ok(report.findings.some(({ group, level, axis }) => group === 'R23' && level === 'lỗi' && axis === 'KỸ THUẬT'));
  assert.equal(report.opening.ok, false);
  assert.equal(report.opening.first_sound_s, 0);
  assert.equal(report.opening.voice_ok, false);
  assert.equal(report.header.render_status, 'CHƯA KIỂM');
  assert.equal(report.text_audit.render.status, 'CHƯA KIỂM');
  const warning = (kind) => {
    const found = report.findings.find((item) => item.kind === kind && item.level === 'cảnh báo');
    assert.ok(found, kind);
    return found;
  };
  assert.equal(report.opening.duration_ok, true);
  assert.deepEqual(report.findings.find(({ kind }) => kind === 'opening_target_duration').scene_ids, ['Mở']);
  assert.deepEqual(warning('hold_after_voice').scene_ids, ['Cơ chế']);
  assert.deepEqual(warning('voice_sync').scene_ids, ['Cơ chế']);
  const pause = warning('long_pause');
  assert.ok(Math.abs(pause.start - 3) < 0.03 && Math.abs(pause.end - 6.5) < 0.03);
  for (const kind of ['speech_pace', 'scene_concepts', 'concept_window', 'unusual_scene_duration', 'explainer_short_duration']) warning(kind);
  const high = report.information_pace.scenes[1];
  assert.ok(Math.abs(high.hold_after_voice_s - (-0.25)) < 0.03);
  assert.equal(high.cut_during_speech, true);
  assert.equal(report.information_pace.complexity.high.min_hold_after_voice_s, high.hold_after_voice_s);
  assert.equal(report.information_pace.concepts_per_min, 15);
  assert.equal(report.audio.speech.syllables, 12);
  assert.ok(Math.abs(report.audio.voiced_s - 7.25) < 0.06);
  assert.ok(Math.abs(report.audio.pause_ratio - 4.75 / 12) < 0.005);
  assert.ok(Math.abs(report.audio.speech_pace_syll_s - 12 / 7.25) < 0.02);
  assert.equal(report.sync.matches[0].actual_start_s, 0);
  assert.ok(Math.abs(report.sync.max_offset_s - 0.4) < 0.03);
  assert.ok(Math.abs(report.sync.mean_offset_s - 0.2) < 0.015);
  assert.equal(report.header.duration_s, 8);
  assert.ok(Math.abs(report.header.pct - 100 * 8 / 12) < 1e-9);
  assert.deepEqual(report.header.image.tiles.map(({ scene_id, header }) => [scene_id, header]),
    [['Mở', null], ['Cơ chế', 'Cơ chế'], ['Kết', null]]);
  assert.deepEqual(pngSize(path.join(out, 'header-zones.png')), [864, 84]);
  for (const image of report.opening.images) {
    assert.equal(image.status, 'đã đo');
    assert.ok(image.frame_s >= 0 && image.frame_s < 3.5);
    assert.deepEqual(pngSize(path.join(out, image.file)), [1080, 1920]);
  }
  assert.ok(report.opening.images[2].frame_s > 3.4);
  assert.deepEqual(report.manual_checks.map(({ key }) => key), [
    'voice_natural', 'pronunciation', 'emphasis', 'header_safe_zone', 'diagram_reveal',
    'diagram_hold', 'example', 'explanation_order', 'theory_only', 'camera_purpose',
    'visual_illustration', 'visual_keywords', 'visual_accuracy', 'visual_without_captions',
    'visual_animation', 'visual_observation_time', 'visual_text_attachment', 'visual_text_effect',
    'voice_edge_listen', 'header_phone_readability', 'named_terms_without_audio',
  ]);
  assert.ok(report.manual_checks.every(({ status }) => status === 'CHƯA KIỂM'));
  const comparison = new Map(report.baseline.rows.map((row) => [row.key, row]));
  assert.equal(comparison.get('speech_pace_syll_s').baseline, 2);
  assert.equal(comparison.get('pause_ratio').baseline, 0.25);
  assert.equal(comparison.get('high_min_hold_after_voice_s').baseline, null);
  assert.ok(report.findings.some(({ kind, level }) => kind === 'speech_pace_baseline' && level === 'thông tin'));
  const md = fs.readFileSync(path.join(out, 'report.md'), 'utf8');
  assert.match(md, /^# .*Hồ sơ explainer/);
  assert.match(md, /## Audio\n[\s\S]+## Information Pacing\n[\s\S]+## Visual \(opening\/header\/đồng bộ\)\n[\s\S]+## Kiểm thủ công bắt buộc\n/);
  assert.match(md, /1\.2 \| Cơ chế/);
  assert.match(md, /đè nội dung CHƯA KIỂM — thiếu nhật ký dựng/);
  assert.match(md, /## D8 .* đầu\/cuối câu/);
});

test('qc-measure: hồ sơ standard (45–75 s) bật kiểm tra D8 như explainer và áp mốc thời lượng riêng', { skip }, (t) => {
  const root = tempDir(t);
  const episode = path.join(root, 'ep01');
  const final = path.join(episode, 'final');
  const assets = path.join(episode, 'assets');
  const out = path.join(root, 'báo cáo standard');
  const outExplainer = path.join(root, 'báo cáo explainer');
  fs.mkdirSync(final, { recursive: true });
  fs.mkdirSync(assets, { recursive: true });
  ffmpeg([
    '-f', 'lavfi', '-i', 'testsrc2=s=360x640:r=24:d=12',
    '-f', 'lavfi', '-i', "aevalsrc='if(between(t,0,1)+between(t,2,3)+between(t,6.5,11.75),0.3*sin(2*PI*440*t),0)':s=48000:d=12",
    '-vf', 'scale=1080:1920', '-c:v', 'libx264', '-threads', '3', '-preset', 'ultrafast',
    '-pix_fmt', 'yuv420p', '-c:a', 'aac', path.join(final, 'TEST-STD_9x16.mp4'),
  ]);
  writeJson(path.join(assets, 'scenes.json'), [
    { id: 'Mở', start: 0, end: 3.5, role: 'opening', complexity: 'low', concepts: 1, header: null, voice: [{ start: 0, end: 1 }] },
    { id: 'Cơ chế', start: 3.5, end: 11.5, role: 'body', complexity: 'high', concepts: 2,
      header: 'Cơ chế', voice: [{ start: 6.1, end: 11.5 }] },
    { id: 'Kết', start: 11.5, end: 12, role: 'outro', complexity: 'low', concepts: 0, header: '' },
  ]);
  const standard = readReport(run(episode, ['--profile', 'standard', '--out', out]), out);
  assert.equal(standard.profile, 'standard');
  assert.deepEqual([standard.thresholds.min_duration_s, standard.thresholds.warn_duration_s, standard.thresholds.max_duration_s], [45, 70, 75]);
  assert.equal(standard.thresholds.max_scenes, 2);
  assert.equal(standard.threshold_version, 'M-2026-11-20');
  // Mốc dưới mặc định chỉ là cảnh báo mềm, không làm hỏng kiểm tra kỹ thuật.
  assert.equal(standard.technical.qc_video.raw_result.pass, false);
  assert.equal(standard.technical.qc_video.result.pass, true);
  const short = standard.findings.find(({ kind }) => kind === 'standard_short_duration');
  assert.equal(short.level, 'cảnh báo');
  assert.match(short.message, /Ngưỡng thử 45 s/);
  // Các kiểm tra D8 chạy như explainer: cùng tập phát hiện, chỉ khác mã thời lượng.
  const explainer = readReport(run(episode, ['--profile', 'explainer', '--out', outExplainer]), outExplainer);
  const kinds = (report) => new Set(report.findings.map(({ kind }) => kind.replace(/^(standard|explainer)_/, '')));
  assert.deepEqual([...kinds(standard)].sort(), [...kinds(explainer)].sort());
  assert.equal(standard.opening.duration_ok, true);
  assert.ok(standard.findings.some(({ kind, level }) => kind === 'opening_target_duration' && level === 'thông tin'));
  for (const kind of ['hold_after_voice', 'voice_sync', 'long_pause']) {
    assert.ok(standard.findings.some((item) => item.kind === kind && item.level === 'cảnh báo'), kind);
  }
  assert.match(fs.readFileSync(path.join(out, 'report.md'), 'utf8'), /^# .*Hồ sơ standard/);
});

test('qc-measure: hồ sơ standard cảnh báo gần trần 70 s, lỗi trên 75 s và video > 75 s tự chọn explainer', { skip }, (t) => {
  const root = tempDir(t);
  const make = (name, seconds) => {
    const episode = path.join(root, name);
    fs.mkdirSync(path.join(episode, 'final'), { recursive: true });
    ffmpeg([
      '-f', 'lavfi', '-i', `color=c=gray:s=360x640:r=2:d=${seconds}`,
      '-f', 'lavfi', '-i', `anullsrc=r=48000:cl=mono`, '-t', String(seconds),
      '-vf', 'scale=1080:1920', '-c:v', 'libx264', '-threads', '3', '-preset', 'ultrafast',
      '-pix_fmt', 'yuv420p', '-c:a', 'aac', path.join(episode, 'final', `${name}_9x16.mp4`),
    ]);
    return episode;
  };
  const near = make('gần-trần', 71);
  const outNear = path.join(root, 'báo cáo gần trần');
  const nearReport = readReport(run(near, ['--out', outNear]), outNear);
  assert.equal(nearReport.profile, 'standard');
  assert.ok(nearReport.findings.some(({ kind, level }) => kind === 'standard_near_cap_duration' && level === 'cảnh báo'));
  assert.ok(!nearReport.findings.some(({ kind }) => kind === 'standard_long_duration' || kind === 'standard_short_duration'));

  const over = make('quá-trần', 76);
  const outAuto = path.join(root, 'báo cáo tự chọn');
  const auto = readReport(run(over, ['--out', outAuto]), outAuto);
  assert.equal(auto.profile, 'explainer');
  assert.ok(auto.findings.some(({ kind }) => kind === 'explainer_short_duration'));
  const outForced = path.join(root, 'báo cáo ép standard');
  const forced = readReport(run(over, ['--profile', 'standard', '--out', outForced]), outForced);
  assert.equal(forced.profile, 'standard');
  const long = forced.findings.find(({ kind }) => kind === 'standard_long_duration');
  assert.equal(long.level, 'lỗi');
  assert.match(long.message, /vượt trần thử 75 s của hồ sơ standard/);
  assert.ok(!forced.findings.some(({ kind }) => kind === 'standard_near_cap_duration'));
  // Lỗi "Dài > tối đa" của qc-video không bị báo trùng với mã standard_long_duration.
  assert.ok(!forced.findings.some(({ kind, message }) => kind === 'video_qc' && message.startsWith('Dài ') && message.includes(' > tối đa ')));
});

test('qc-measure: --profile không hợp lệ báo lỗi nêu đủ ba giá trị', { skip }, (t) => {
  const root = tempDir(t);
  const fixture = makeEpisode(root);
  const result = run(fixture.episode, ['--profile', 'dài', '--out', fixture.out]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}${result.stdout}`, /short, standard hoặc explainer/);
});

test('qc-measure: gộp trường sai kiểu thành một cảnh báo và giữ các trường hợp lệ', { skip }, (t) => {
  const root = tempDir(t);
  const fixture = makeEpisode(root);
  writeJson(path.join(fixture.assets, 'scenes.json'), [
    { ...fixture.scenes[0], complexity: 'wide', concepts: -3, role: 1 },
    { ...fixture.scenes[1], header: true, voice: [null], concepts: 0 },
    fixture.scenes[2],
  ]);
  const report = readReport(run(fixture.episode, ['--min', '5', '--max', '7']), fixture.out);
  assert.deepEqual(report.timeline.scenes, [fixture.scenes[0], { ...fixture.scenes[1], concepts: 0 }, fixture.scenes[2]]);
  const invalid = report.findings.filter(({ kind }) => kind === 'invalid_scene_fields');
  assert.equal(invalid.length, 1);
  assert.equal(invalid[0].level, 'cảnh báo');
  assert.deepEqual(invalid[0].scene_ids, ['S01', 'S02']);
  assert.match(invalid[0].message, /S01 \(complexity, concepts, role\).*S02 \(header, voice\)/);
  assert.ok(!report.findings.some(({ kind }) => kind === 'information_missing'));
});

test('qc-measure: đo Visual-first, lớp phụ đề và ảnh từ bản hình sạch', { skip }, (t) => {
  const root = tempDir(t);
  const fixture = makeEpisode(root);
  const storyboardFile = path.join(fixture.episode, 'storyboard.json');
  const storyboard = json(storyboardFile);
  const exact = 'Dữ liệu được chuyển qua cổng khi điều kiện đã hợp lệ';
  const message = 'Một phần đi qua';
  Object.assign(storyboard.scenes[0], {
    text_overlay: 'Nhãn cũ này không được đếm', props: [], animation_timeline: [],
    semantic_plan: {
      keywords: [{ term: 'Cổng', type: 'entity', form: 'text_only' }],
      texts: [
        { text: exact, kind: 'label', appear_s: 0.25, disappear_s: 0.75, effect: 'kinetic' },
        { text: 'Vào', kind: 'label', appear_s: 0.75, disappear_s: 1, effect: 'pop + kinetic' },
        { text: 'Ra', kind: 'label', appear_s: 0.75, disappear_s: 1 },
        { text: 'Cổng', kind: 'label', appear_s: 0.75, disappear_s: 1 },
        { text: 'Đích', kind: 'label', appear_s: 0.75, disappear_s: 1 },
      ],
    },
  });
  Object.assign(storyboard.scenes[1], {
    props: ['Ống'],
    semantic_plan: {
      keywords: [{ term: 'Ống', type: 'entity', form: 'illustration' }],
      texts: [{ text: message, kind: 'message', appear_s: 1 }],
    },
  });
  Object.assign(storyboard.scenes[2], {
    props: ['Van'], semantic_plan: {
      keywords: [{ term: 'Van', type: 'entity', form: 'icon' }],
      texts: [{ text: 'Hạng mục', kind: 'label' }],
    },
  });
  writeJson(storyboardFile, storyboard);
  fs.mkdirSync(path.join(fixture.assets, 'voice'));
  writeJson(path.join(fixture.assets, 'voice', 'apply.json'), [
    { row: 1, label: 'Lời đầu', text: exact + '.', tts: 'Không dùng để so' },
    { row: 2, label: 'Lời sau', text: message + '.' },
  ]);
  const assFile = path.join(fixture.final, 'captions.ass');
  writeAss(assFile, 70, 5, 0);
  fs.writeFileSync(path.join(fixture.final, 'captions.srt'), [
    '1\n00:00:00,000 --> 00:00:02,500\n<m>Bốn từ ở đây.</m>',
    '2\n00:00:02,000 --> 00:00:03,000\nDòng hai',
    '3\n00:00:05,000 --> 00:00:07,000\nĐủ đúng hai mươi tám kí tự!!',
  ].join('\n\n'));
  ffmpeg(['-f', 'lavfi', '-i', 'color=c=green:s=360x640:r=24:d=6', '-c:v', 'libx264',
    '-threads', '1', path.join(fixture.scratch, 'picture.mp4')]);
  const baselineFile = path.join(root, 'qc-h3.json');
  writeJson(baselineFile, { threshold_version: 'H3', metrics: { caption_fontsize: 64 } });
  const out = path.join(root, 'báo cáo visual');
  const before = entries(root);
  const report = readReport(run(fixture.episode, ['--min', '5', '--max', '7', '--out', out, '--baseline', baselineFile]), out);
  assert.deepEqual(entries(root, out), before);
  assert.equal(report.technical.qc_video.result.pass, true);
  const audit = report.text_audit;
  assert.equal(audit.status, 'đã đo');
  assert.equal(audit.verbatim_texts, 1);
  assert.equal(audit.max_similarity, 1);
  assert.equal(audit.text_words_total, 22);
  assert.equal(audit.text_words_per_min, 220);
  assert.equal(audit.kinetic_per_min, 20);
  assert.equal(audit.text_coverage_pct, 62.5);
  assert.equal(audit.keyword_visual_pct, 200 / 3);
  assert.equal(audit.caption_words_total, 13);
  assert.equal(audit.caption_coverage_pct, 400 / 6);
  assert.equal(audit.caption_to_label_ratio, 13 / 22);
  assert.equal(audit.caption_px, 70);
  assert.equal(audit.caption_band_ok, false);
  assert.deepEqual(audit.weak_visual_scenes, ['S01']);
  const warnings = report.findings.filter(({ level }) => level === 'cảnh báo');
  for (const kind of ['verbatim_text', 'weak_visual', 'simultaneous_text_words', 'simultaneous_text_groups',
    'kinetic_scene', 'kinetic_rate', 'caption_fontsize', 'caption_band']) {
    assert.ok(warnings.some((item) => item.kind === kind && /^M-\d+$/.test(item.code)), kind);
  }
  const verbatim = warnings.find(({ kind }) => kind === 'verbatim_text');
  assert.deepEqual([verbatim.start, verbatim.end, verbatim.scene_ids], [0.25, 0.75, ['S01']]);
  assert.match(verbatim.message, /Lời đầu.*similarity 1/);
  assert.ok(verbatim.images.includes('textheavy-S01.png'));
  assert.ok(report.findings.some(({ kind, level, scene_ids }) =>
    kind === 'verbatim_text' && level === 'thông tin' && scene_ids[0] === 'S02'));
  assert.equal(report.subtitles.srt.max_chars, 28);
  assert.ok(!warnings.some(({ kind }) => kind === 'cue_chars'));
  assert.equal(report.evidence.nocaption_board.source, path.join(fixture.scratch, 'picture.mp4'));
  assert.equal(report.evidence.nocaption_board.tiles.length, 8);
  assert.deepEqual(pngSize(path.join(out, 'textheavy-S01.png')), [360, 640]);
  const board = path.join(out, 'nocaption-board.png');
  assert.deepEqual(pngSize(board), [1440, 1280]);
  const pixel = spawnSync('ffmpeg', ['-v', 'error', '-i', board, '-vf', 'scale=1:1,format=rgb24',
    '-frames:v', '1', '-threads', '1', '-f', 'rawvideo', '-'], { ...options, encoding: 'buffer' });
  assert.equal(pixel.status, 0, pixel.stderr?.toString());
  const [red, green, blue] = pixel.stdout;
  assert.ok(green > 100 && red < 5 && blue < 5, 'Ảnh ghép phải lấy hình xanh từ picture.mp4');
  for (const key of ['verbatim_texts', 'text_words_per_min', 'text_coverage_pct', 'keyword_visual_pct',
    'caption_coverage_pct', 'caption_px']) {
    const row = report.baseline.rows.find((item) => item.key === key);
    assert.deepEqual([row.current, row.baseline, row.delta], [audit[key], null, null], key);
  }
  const md = fs.readFileSync(path.join(out, 'report.md'), 'utf8');
  assert.match(md, /## Visual-first: chữ và hình\n[\s\S]+\| S01 \|.*12 \/ 4.*\n[\s\S]+Phụ đề riêng/);
  assert.match(md, /\| Cỡ phụ đề lớn nhất \(px\) \| 70 \| — \| — \|/);

  storyboard.scenes[0].semantic_plan.texts.push(null, { text: 42 }, { text: 'Sai', appear_s: '1' },
    { text: 'Ngược mốc', appear_s: 1, disappear_s: 0.5 });
  storyboard.scenes[1].semantic_plan = 'Thiếu đối tượng';
  storyboard.scenes[2].props = false;
  writeJson(storyboardFile, storyboard);
  fs.unlinkSync(assFile); // Lấy ASS 56 px ở dải dưới từ assets/_scratch.
  const followupOut = path.join(root, 'báo cáo dữ liệu sai');
  const followup = readReport(run(fixture.episode, ['--min', '5', '--max', '7', '--out', followupOut]), followupOut);
  const invalid = followup.findings.filter(({ kind }) => kind === 'invalid_text_audit_fields');
  assert.equal(invalid.length, 1);
  assert.deepEqual(invalid[0].scene_ids, ['S01', 'S02', 'S03']);
  assert.match(invalid[0].message, /semantic_plan\.texts\[5\].*S02 \(semantic_plan\).*S03 \(props\)/);
  assert.match(invalid[0].message, /semantic_plan\.texts\[8\]\.disappear_s/);
  assert.equal(followup.text_audit.verbatim_texts, 1);
  assert.equal(followup.text_audit.caption_px, 56);
  assert.equal(followup.text_audit.caption_band_ok, true);
  assert.ok(!followup.findings.some(({ kind }) => ['caption_fontsize', 'caption_band'].includes(kind)));
});

test('qc-measure: lấy đủ mẫu ảnh khi FFmpeg cần hơn một lô mốc khung', { skip }, (t) => {
  const fixture = makeEpisode(tempDir(t));
  // Mỗi cảnh có ít nhất hai khung riêng. Tổng số mốc vượt giới hạn của một biểu thức select.
  const scenes = Array.from({ length: 55 }, (_, index) => ({
    id: `S${index + 1}`, start: 6 * index / 55, end: 6 * (index + 1) / 55,
  }));
  writeJson(path.join(fixture.assets, 'scenes.json'), scenes);
  writeJson(path.join(fixture.episode, 'storyboard.json'), {
    scenes: scenes.map(({ id }) => ({
      scene_id: id, camera: { shot: 'wide', movement: 'push_in' }, text_overlay: 'Nhãn mẫu',
    })),
  });
  const report = readReport(run(fixture.episode, ['--min', '5', '--max', '7']), fixture.out);
  assert.equal(report.evidence.samples.status, 'đã đo');
  assert.equal(report.storyboard.cameras.filter(({ status }) => status === 'đã đo').length, 55);
  assert.equal(report.evidence.images.filter(({ kind, status }) => kind === 'textheavy' && status === 'đã đo').length, 8);
});

test('qc-measure D8: đọc tiếng thật và kiểm opening, header, chữ theo nhật ký', { skip }, (t) => {
  const root = tempDir(t);
  const fixture = makeEpisode(root);
  const video = path.join(fixture.final, 'TEST-E01_9x16.mp4');
  ffmpeg([
    '-f', 'lavfi', '-i', 'testsrc2=s=1080x1920:r=24:d=6',
    '-f', 'lavfi', '-i',
    "aevalsrc='0.2*sin(2*PI*440*t)*min(1,pow(10,min((t-2.45)*50,(4.65-t)*20)))':s=48000:d=6",
    '-c:v', 'libx264', '-threads', '3', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', video,
  ]);
  const sceneFile = path.join(fixture.assets, 'scenes.json');
  const planned = fixture.scenes.map((scene, i) => ({
    ...scene, role: ['opening', 'hook', 'body'][i],
    header: i ? { text: 'Chủ đề thử', slot: i === 1 ? 'top_left' : 'top_right' } : null,
    voice: i === 1 ? [{ start: 2.1, end: 5 }] : [],
  }));
  writeJson(sceneFile, planned);
  writeJson(path.join(fixture.episode, 'storyboard.json'), {
    scenes: planned.map(({ id }, i) => ({
      scene_id: id,
      semantic_plan: {
        texts: i ? [{ text: i === 1 ? 'Máy chủ' : 'Bộ đệm', appear_s: 0.4 }] : [],
        keywords: i === 2 ? [{ term: 'Bộ đệm', type: 'term', form: 'icon' }] : [],
      },
    })),
  });
  const logFile = path.join(fixture.assets, 'render-log.json');
  const title = { kind: 'text', role: 'opening_title', scene: 'S01', text: 'Tập đo thử', px: 84,
    bbox: [200, 500, 850, 650], start: 0.1, end: 2 };
  const headerEvents = (scene, start, end, slot, bbox, px = 52) => {
    const [x, y] = bbox;
    return [
      { kind: 'header', scene, start, end, slot, bbox },
      { kind: 'text', role: 'header_title', scene, start, end, text: 'Tiêu đề', px, bbox: [x + 20, y + 65, x + 250, y + 130] },
      { kind: 'text', role: 'header_topic', scene, start, end, text: 'CHỦ ĐỀ', px: 40, bbox: [x + 20, y + 15, x + 210, y + 60] },
    ];
  };
  const label = { kind: 'text', role: 'label', scene: 'S02', text: 'Máy   CHỦ', px: 56, effect: 'kinetic',
    bbox: [120, 520, 440, 580], target_bbox: [120, 590, 480, 800], start: 2.4, end: 3.8 };
  const writeLog = (events) => writeJson(logFile, { version: 1, fps: 24, size: [1080, 1920], events });
  const phases = ['visual_hook', 'conflict', 'topic_reveal'].map((phase, i) => ({
    kind: 'phase', scene: 'S01', phase, start: i * 2 / 3, end: (i + 1) * 2 / 3,
  }));
  writeLog([
    ...phases,
    title,
    ...headerEvents('S02', 2, 4.4, 'top_left', [90, 150, 570, 310]),
    ...headerEvents('S03', 4, 6, 'top_right', [580, 150, 990, 310]),
    label,
    { ...label, role: 'keyword', effect: 'none', text: 'Bộ đệm', scene: 'S03', start: 4.4, end: 5.8 },
  ]);
  const args = ['--min', '5', '--max', '7'];
  const pass = readReport(run(fixture.episode, args), fixture.out);
  assert.equal(pass.technical.pass, true);
  assert.equal(pass.voice_edges.flagged_count, 0);
  assert.equal(pass.voice_edges.measured_count, 1);
  assert.ok(pass.opening.first_sound_s > 2.3);
  assert.equal(pass.opening.ok, true);
  assert.equal(pass.opening.phase_ok, true);
  assert.ok(pass.evidence.images.some(({ file, status }) => file.includes('frame-phase-1') && status === 'đã đo'));
  assert.equal(pass.machine_verdict.final_pass_allowed, false);
  assert.ok(pass.needs_manual_review.some(({ id }) => id === 'opening_hook'));
  assert.equal(pass.header.coverage_pct, 100);
  assert.equal(pass.header.slot_changes, 1);
  assert.ok(pass.header.transitions.every(({ ok }) => ok));
  assert.deepEqual(pass.header.overlaps, []);
  assert.deepEqual(pass.header.size_violations, []);
  assert.equal(pass.text_audit.render.planned_texts_found_pct, 100);

  writeLog([
    { ...title, px: 75 },
    ...headerEvents('S02', 2, 4, 'top_left', [60, 140, 1010, 360], 48),
    { kind: 'component', name: 'panel', id: 'diagram', scene: 'S02', start: 2.5, end: 3.2, bbox: [150, 345, 600, 900] },
    { ...label, target_bbox: null },
    { ...label, role: 'keyword', text: 'Điểm chờ', scene: 'S03', start: 4.4, end: 5.8 },
  ]);
  const out = path.join(root, 'kiểm D8');
  const flagged = readReport(run(fixture.episode, [...args, '--out', out,
    '--baseline', path.join(fixture.out, 'report.json')]), out);
  assert.equal(flagged.opening.title_ok, false);
  assert.equal(flagged.header.coverage_pct, 50);
  assert.equal(flagged.text_audit.render.planned_texts_found_pct, 50);
  assert.equal(flagged.text_audit.render.labels_without_target.length, 1);
  assert.deepEqual(flagged.text_audit.render.keywords_without_text.map(({ text }) => text), ['Bộ đệm']);
  assert.deepEqual(flagged.header.overlaps.map(({ object, start, end }) => [object.id, start, end]), [['diagram', 2.5, 3.2]]);
  for (const kind of ['opening_title', 'header_coverage', 'header_geometry', 'header_font', 'header_overlap',
    'render_text_scene_coverage', 'render_text_kinetic_consecutive', 'render_text_keyword_missing', 'render_text_label_target',
    'render_text_plan_coverage']) {
    assert.ok(flagged.findings.some((item) => item.kind === kind), kind);
  }
  const coverage = flagged.baseline.rows.find(({ key }) => key === 'header_coverage_pct');
  assert.deepEqual([coverage.current, coverage.baseline, coverage.delta], [50, 100, -50]);
  const opening = flagged.baseline.rows.find(({ key }) => key === 'opening_ok');
  assert.deepEqual([opening.current, opening.baseline, opening.delta], [false, true, -1]);

  delete planned[0].role;
  writeJson(sceneFile, planned);
  fs.unlinkSync(logFile);
  const noEvidence = path.join(root, 'thiếu nhật ký');
  const missing = readReport(run(fixture.episode, [...args, '--profile', 'explainer', '--out', noEvidence]), noEvidence);
  assert.equal(missing.opening.layout_ok, false);
  assert.equal(missing.opening.ok, false);
  assert.equal(missing.header.render_status, 'CHƯA KIỂM');
  assert.equal(missing.groups.audio.status, 'CHƯA KIỂM');
  assert.equal(missing.groups.visual.status, 'CHƯA KIỂM');
  assert.equal(missing.text_audit.render.status, 'CHƯA KIỂM');
  assert.equal(missing.text_overlap.status, 'CHƯA KIỂM');
  assert.equal(missing.metrics.text_overlap_pairs, null);
  assert.ok(missing.findings.some(({ kind, message }) => kind === 'text_overlap_unchecked' &&
    message === 'CHƯA KIỂM — thiếu nhật ký dựng'));
  assert.equal(missing.metrics.scenes_with_text_pct, null);
  assert.match(fs.readFileSync(path.join(noEvidence, 'report.md'), 'utf8'), /CHƯA KIỂM — thiếu nhật ký dựng/);
});

test('qc-measure D8: đối chiếu T9 bản đầu khi còn dữ liệu lịch sử', { skip }, (t) => {
  const current = fileURLToPath(new URL('../../content/it/T9-dong-chu-an-trong-mo-ta-plugin-ai-co-the/ep01/', import.meta.url));
  const filename = 'IT-T9-E01_9x16.mp4';
  const archivedVideo = path.join(current, 'assets', '_scratch', '_v1', filename);
  const archivedStory = path.join(current, 'review', '_truoc-d8', 'storyboard-v1.json');
  const archivedReport = fileURLToPath(new URL('../../docs/baseline/T9v1-qc-auto.json', import.meta.url));
  const hasArchive = [archivedVideo, archivedStory, archivedReport].every((file) => fs.existsSync(file));
  const timeline = path.join(current, 'assets', 'scenes.json');
  const currentIsOriginal = fs.existsSync(path.join(current, 'final', filename)) && fs.existsSync(timeline) &&
    !fs.existsSync(path.join(current, 'assets', 'render-log.json'));
  if (!hasArchive && !currentIsOriginal) return t.skip('thiếu dữ liệu T9 bản đầu');
  const scenes = hasArchive ? json(archivedReport).timeline.scenes : json(timeline);
  if (scenes.length !== 27 || scenes[0]?.voice?.[0]?.start !== 0) return t.skip('timeline T9 đã đổi phiên bản');
  const root = tempDir(t);
  const out = path.join(root, 'qc');
  const episode = hasArchive ? path.join(root, 'ep01') : current;
  if (hasArchive) {
    fs.mkdirSync(path.join(episode, 'final'), { recursive: true });
    fs.mkdirSync(path.join(episode, 'assets'), { recursive: true });
    fs.copyFileSync(archivedVideo, path.join(episode, 'final', filename));
    fs.copyFileSync(archivedStory, path.join(episode, 'storyboard.json'));
    writeJson(path.join(episode, 'assets', 'scenes.json'), scenes);
  }
  const report = readReport(run(episode, ['--out', out]), out);
  assert.equal(report.voice_edges.sentence_count, 67);
  assert.equal(report.voice_edges.flagged_count, 67);
  assert.equal(report.technical.pass, false);
  assert.equal(report.opening.ok, false);
  assert.ok(report.opening.first_sound_s <= 0.02);
  assert.ok(Math.abs(report.header.coverage_pct - 10.7) < 0.1);
  assert.equal(report.header.source, 'scenes.json');
  assert.equal(report.text_audit.render.status, 'CHƯA KIỂM');
  assert.ok(report.findings.some(({ kind }) => kind === 'render_text_scene_coverage'));
  if (report.voice_edges.image?.status === 'đã đo') {
    assert.equal(report.voice_edges.image.points.length, 6);
    assert.deepEqual(pngSize(path.join(out, 'voice-edges.png')), [900, 552]);
  } else assert.ok(report.voice_edges.image?.reason);
});

test('qc-measure: báo lỗi nhãn đè trong 4 s, ưu tiên WAV hợp lệ và hạ keyword hành động thành thông tin', { skip }, (t) => {
  const root = tempDir(t);
  const { episode, assets, out } = makeEpisode(root);
  const voice = path.join(assets, 'voice');
  const compact = path.join(voice, 'v2', 'compact', 'voice.wav');
  const tooShort = path.join(voice, 'v1', 'compact', 'voice.wav');
  const explicit = path.join(voice, 'voice.wav');
  for (const candidate of [compact, tooShort, explicit]) fs.mkdirSync(path.dirname(candidate), { recursive: true });
  const wav = (out, duration, voiced) => ffmpeg(['-f', 'lavfi', '-i',
    `aevalsrc='if(lt(t,${voiced}),0.3*sin(2*PI*440*t),0)':s=48000:d=${duration}`, '-c:a', 'pcm_s16le', out]);
  wav(compact, 6, 2.6);
  wav(tooShort, 4.9, 2.6);
  wav(explicit, 7, 3);
  writeJson(path.join(voice, 'apply.json'), [{ text: 'Một hai ba bốn năm sáu bảy tám chín mười mười một.' }]);
  writeJson(path.join(assets, 'scenes.json'), [{ id: 'S16', start: 0, end: 5.5 }, { id: 'S17', start: 5.5, end: 6 }]);
  writeJson(path.join(episode, 'storyboard.json'), { scenes: [{ scene_id: 'S16', semantic_plan: { keywords: [
    { term: 'nhật ký hoạt động', type: 'term', form: 'illustration' },
    { term: 'trượt sang phải', type: 'action', form: 'animation' },
    { term: 'cobalt', type: 'term', form: 'icon' },
  ] } }] });
  const text = (text, bbox, start = 1, end = 5) => ({ kind: 'text', role: 'label', scene: 'S16', px: 64, text, bbox, start, end });
  writeJson(path.join(assets, 'render-log.json'), { version: 1, fps: 24, size: [1080, 1920], events: [
    text('Bản lưu', [200, 400, 420, 464]), text('Bản đang nạp', [310, 400, 710, 464]),
    text('Nhật ký', [740, 400, 910, 464]), text('Gần nhãn', [930, 400, 1070, 464]),
  ] });
  const baseline = path.join(root, 'baseline.json');
  writeJson(baseline, { threshold_version: 'L', metrics: { speech_pace_syll_s: 4.19 } });
  const report = readReport(run(episode, ['--min', '5', '--max', '7', '--profile', 'explainer', '--baseline', baseline]), out);
  const { audio, findings, metrics } = report;
  assert.equal(audio.voice.source, compact);
  assert.deepEqual(audio.voice.rejected.map(({ source }) => source), [tooShort]);
  assert.match(audio.voice.rejected[0].reason, /lệch MP4/);
  assert.ok(Math.abs(audio.voiced_s_voice - 2.6) < 0.01);
  assert.ok(Math.abs(audio.speech_pace_voice_syll_s - 12 / 2.6) < 0.01);
  assert.ok(audio.speech_pace_syll_s < 3.6);
  assert.ok(!findings.some(({ kind }) => kind === 'speech_pace'));
  assert.ok(Math.abs(report.baseline.speech_pace_change_pct - 100 * (12 / 2.6 / 4.19 - 1)) < 0.1);
  assert.equal(report.baseline.rows.find(({ key }) => key === 'speech_pace_voice_syll_s').baseline, 4.19);
  assert.equal(metrics.text_overlap_pairs, 1);
  assert.equal(metrics.text_min_gap_px, 0);
  const overlap = findings.find(({ kind }) => kind === 'text_overlap');
  assert.deepEqual([overlap.group, overlap.level, overlap.start, overlap.end, overlap.scene_ids], ['R3', 'lỗi', 1, 5, ['S16']]);
  assert.deepEqual(overlap.images, ['text-overlap.png']);
  assert.match(overlap.message, /Bản lưu.*Bản đang nạp.*50%/);
  const gap = findings.find(({ kind }) => kind === 'text_gap');
  assert.equal(gap.level, 'cảnh báo');
  assert.match(gap.message, /khe 20 px/);
  assert.deepEqual(pngSize(path.join(out, 'text-overlap.png')), [1080, 270]);
  assert.deepEqual(report.evidence.images.find(({ kind }) => kind === 'text_overlap').tiles.map(({ frame_s }) => frame_s), [3, 3]);
  const keywords = findings.filter(({ kind }) => kind.startsWith('render_text_keyword_'));
  assert.deepEqual(keywords.map(({ kind, level }) => [kind, level]), [
    ['render_text_keyword_visual', 'thông tin'], ['render_text_keyword_missing', 'cảnh báo'],
  ]);
  assert.match(keywords[1].message, /cobalt/);
  const md = fs.readFileSync(path.join(out, 'report.md'), 'utf8');
  assert.match(md, /Tốc độ đọc trên WAV giọng gốc .* trên MP4/);
  assert.match(md, /Bỏ qua .*WAV .* lệch MP4/);

  const explicitOut = path.join(root, 'giọng chỉ định');
  const override = readReport(run(episode, ['--voice', explicit, '--min', '5', '--max', '7', '--out', explicitOut,
    '--baseline', path.join(out, 'report.json')]), explicitOut);
  assert.equal(override.audio.voice.source, explicit);
  assert.ok(Math.abs(override.audio.speech_pace_voice_syll_s - 4) < 0.01);
  assert.match(override.findings.find(({ kind }) => kind === 'speech_pace').message, /WAV giọng gốc.*4,6–4,8/);
  assert.equal(override.baseline.rows.find(({ key }) => key === 'speech_pace_voice_syll_s').baseline, audio.speech_pace_voice_syll_s);
  assert.deepEqual(override.baseline.rows.filter(({ key }) => ['text_overlap_pairs', 'text_min_gap_px'].includes(key))
    .map(({ baseline, current, delta }) => [baseline, current, delta]), [[1, 1, 0], [0, 0, 0]]);
});
