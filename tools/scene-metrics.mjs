import { loadRules } from './config/rules.mjs';
import qc from './qc-thresholds.json' with { type: 'json' };
export const PIPELINE = loadRules();
export { qc as QC_THRESHOLDS };
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const FRAME = { w: 108, h: 192, fps: 10 };
const BLOCK_SIZE = 12;

// Ngưỡng thử cho cảnh báo chuyển động và bố cục.
const ACTIVE_BLOCK_DIFF = 3.0;
const STATIC_LOCAL_DIFF = 2.0;
const MIN_STATIC_RUN_S = 1.0;
const WARN_STATIC_RUN_S = 2.0;
const WARN_HIGH_STATIC_RUN_S = 3.0;
const MIN_SCENE_DURATION_S = 1.5;
const MIN_ACTIVE_MEDIAN = 1;
const SIMILAR_LAYOUT_DIFF = 4.5;
const MIN_SIMILAR_PAIRS = 2;
export const LAYOUT_SAME_DIFF = 6.0;

// Ngưỡng thử theo hồ sơ và độ phức tạp.
const EXPLAINER_AFTER_S = 75;
const STANDARD_AFTER_S = 45;
export const PROFILES = {
  short: {
    min_duration_s: 15, max_duration_s: 45, max_scenes: 12, mean_scene_s: 3.5,
    theme_pct: 40, max_theme_run: 4, shot_run: 3, min_themes: 3, min_themes_from_s: 30,
  },
  // Định dạng chuẩn 45–75 s (giám đốc chốt 20/11/2026, D1): mục tiêu ≈ 60 s, ngưỡng thử.
  standard: {
    min_duration_s: 45, warn_duration_s: 70, max_duration_s: 75,
    max_scenes: (duration) => Math.floor(duration / 5), mean_scene_s: 5,
    theme_pct: 40, max_theme_run: 4, shot_run: 3, min_themes: 3, min_themes_from_s: 30,
  },
  explainer: {
    min_duration_s: 150, warn_duration_s: 180, max_duration_s: 190,
    max_scenes: (duration) => Math.floor(duration / 5), mean_scene_s: 5,
    theme_pct: 40, max_theme_run: 4, shot_run: 3, min_themes: 4, min_themes_from_s: 120,
  },
};
export const PACING = qc.information_pacing;

export function selectProfile(duration, max, explicit) {
  if (explicit) return explicit;
  if (duration > EXPLAINER_AFTER_S || max > EXPLAINER_AFTER_S) return 'explainer';
  if (duration > STANDARD_AFTER_S || max > STANDARD_AFTER_S) return 'standard';
  return 'short';
}

// Mọi hồ sơ trừ `short` đều bật kiểm tra D8/Visual-first/Information (opening, header, text_audit, information pace, mép giọng).
export function usesExtendedChecks(profile) {
  return profile !== 'short';
}

const sceneFieldChecks = {
  complexity: (value) => typeof value === 'string' && Object.hasOwn(PACING.complexity, value),
  concepts: (value) => Number.isInteger(value) && value >= 0,
  role: (value) => ['opening', 'hook', 'body', 'outro'].includes(value),
  header: (value) => value === null || typeof value === 'string' ||
    (auditRecord(value) && typeof value.text === 'string' && Boolean(value.text.trim()) &&
      HEADER_SLOTS.includes(value.slot)),
  voice: (value) => Array.isArray(value) && value.every((interval) =>
    Number.isFinite(interval?.start) && interval.start >= 0 && Number.isFinite(interval.end) && interval.end > interval.start),
};

export function validateSceneFields(scene) {
  const fields = {};
  const invalid = [];
  for (const [key, valid] of Object.entries(sceneFieldChecks)) {
    if (!Object.hasOwn(scene, key)) continue;
    const value = scene[key];
    if (!valid(value)) invalid.push(key);
    else if (key === 'header') fields[key] = auditRecord(value) ?
      { text: value.text.trim(), slot: value.slot } : value?.trim() ?? null;
    else if (key === 'voice') fields[key] = value.map(({ start, end }) => ({ start, end }));
    else fields[key] = value;
  }
  return { fields, invalid };
}

export function speechIntervals(silences, duration) {
  const intervals = [];
  let cursor = 0;
  for (const { start, end } of [...silences].sort((a, b) => a.start - b.start)) {
    if (start > cursor && cursor < duration) intervals.push({ start: cursor, end: Math.min(start, duration) });
    cursor = Math.max(cursor, end);
  }
  if (duration > cursor) intervals.push({ start: cursor, end: duration });
  return intervals;
}

export function sceneVoiceTiming({ start, end }, intervals) {
  const lastVoice = intervals.findLast((voice) => voice.start >= start && voice.start < end);
  const lastVoiceEnd = lastVoice?.end ?? null;
  return {
    last_voice_end: lastVoiceEnd,
    hold_after_voice_s: lastVoiceEnd == null ? null : end - lastVoiceEnd,
    cut_during_speech: intervals.some((voice) =>
      Math.max(voice.start, end - PACING.cut_margin_s) < end && Math.min(voice.end, end + PACING.cut_margin_s) > end),
  };
}

export function countSyllables(lines) {
  if (!Array.isArray(lines)) throw new Error('apply.json cần có danh sách câu.');
  return lines.reduce((total, line) => {
    const text = line?.text ?? line?.tts;
    if (typeof text !== 'string') throw new Error('Có dòng apply.json thiếu văn bản text/tts hợp lệ.');
    return total + (text.match(/[\p{L}\p{N}][\p{L}\p{N}\p{M}]*/gu)?.length ?? 0);
  }, 0);
}

// Ngưỡng thử cho Visual-first và lớp phụ đề.
export const TEXT_AUDIT_LIMITS = qc.text_audit;
export const D8_LIMITS = {
  ...qc.d8,
  opening: { ...PIPELINE.opening, ...qc.opening, title_px: PIPELINE.opening.title_px_min, safe_bbox: PIPELINE.frame.safe_bbox },
};
export const SUBTITLE_MIN_PX = 52;
export const SUBTITLE_MAX_PX = 64;
export const SUBTITLE_PREFERRED_MAX_PX = 60;
export const SUBTITLE_MAX_CHARS = 28;
export const CAPTION_BAND = [1250, 1500];
const CAPTION_REFERENCE_HEIGHT = 1920;

export function textWords(text) {
  return text.normalize('NFC').toLowerCase().replace(/\p{P}/gu, '').split(/\s+/u)
    .filter((word) => /[\p{L}\p{N}]/u.test(word));
}

export function longestCommonSubsequence(left, right) {
  const lengths = new Uint32Array(right.length + 1);
  for (const word of left) {
    let diagonal = 0;
    for (let j = 1; j <= right.length; j++) {
      const above = lengths[j];
      lengths[j] = word === right[j - 1] ? diagonal + 1 : Math.max(above, lengths[j - 1]);
      diagonal = above;
    }
  }
  return lengths[right.length];
}

export function intervalCoverage(intervals, duration) {
  if (!(duration > 0)) return null;
  let cursor = 0;
  let covered = 0;
  for (const { start, end } of [...intervals].sort((a, b) => a.start - b.start)) {
    const stop = Math.min(end, duration);
    if (stop <= cursor) continue;
    covered += Math.max(0, stop - Math.max(start, cursor));
    cursor = stop;
  }
  return 100 * covered / duration;
}

function simultaneousText(texts) {
  const changes = new Map();
  for (const { start, end, words } of texts) {
    for (const [at, sign] of [[start, 1], [end, -1]]) {
      const point = changes.get(at) ?? { words: 0, groups: 0 };
      point.words += sign * words;
      point.groups += sign;
      changes.set(at, point);
    }
  }
  const peaks = { words: { count: 0 }, groups: { count: 0 } };
  let words = 0;
  let groups = 0;
  const times = [...changes.keys()].sort((a, b) => a - b);
  for (const [index, at] of times.entries()) {
    const change = changes.get(at);
    words += change.words;
    groups += change.groups;
    if (words > peaks.words.count) peaks.words = { count: words, start: at, end: times[index + 1] };
    if (groups > peaks.groups.count) peaks.groups = { count: groups, start: at, end: times[index + 1] };
  }
  return peaks;
}

const auditRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const keywordForms = ['icon', 'illustration', 'animation', 'flow', 'connection', 'comparison', 'chart',
  'status', 'metaphor', 'text_only'];
const keywordTypes = ['concept', 'term', 'entity', 'relation', 'action', 'result'];
const textKinds = ['keyword', 'label', 'number', 'message'];
const sceneSecond = (value) => Number.isFinite(value) && value >= 0;
const HEADER_SLOTS = ['top', 'top_left', 'top_right', 'above_captions'];
const headerRoles = ['header_topic', 'header_title'];
const EPSILON = 1e-9;

function auditList(record, key, prefix, invalid, checks, required) {
  if (!Object.hasOwn(record, key)) return null;
  const list = record[key];
  if (!Array.isArray(list)) {
    invalid.push(prefix + key);
    return null;
  }
  if (!checks) return list;
  return list.filter((item, index) => {
    const fields = auditRecord(item) ? Object.entries(checks).filter(([field, check]) =>
      (Object.hasOwn(item, field) || field === required) && !check(item[field], item))
      .map(([field]) => '.' + field) : [''];
    invalid.push(...fields.map((suffix) => `${prefix}${key}[${index}]${suffix}`));
    return !fields.length;
  });
}

function readVisualFields(scene, invalid) {
  if (!scene) return { has_plan: false };
  const plan = auditRecord(scene.semantic_plan) ? scene.semantic_plan : null;
  if (!plan && Object.hasOwn(scene, 'semantic_plan')) invalid.push('semantic_plan');
  const string = (value) => typeof value === 'string';
  const beforeKeywords = invalid.length;
  const keywords = plan && auditList(plan, 'keywords', 'semantic_plan.', invalid, {
    term: string, type: (value) => keywordTypes.includes(value), form: (value) => keywordForms.includes(value),
    object: string, motion: string,
  }, 'form');
  const keywordsValid = invalid.length === beforeKeywords;
  if (plan) {
    auditList(plan, 'relations', 'semantic_plan.', invalid, { from: string, to: string, type: string });
    if (Object.hasOwn(plan, 'hold_s') && !sceneSecond(plan.hold_s)) invalid.push('semantic_plan.hold_s');
  }
  let texts = plan && auditList(plan, 'texts', 'semantic_plan.', invalid, {
    text: string, kind: (value) => textKinds.includes(value), attach_to: string,
    appear_s: sceneSecond, effect: string,
    disappear_s: (value, { appear_s }) => sceneSecond(value) && value > (sceneSecond(appear_s) ? appear_s : 0),
  }, 'text');
  const overlay = scene.text_overlay;
  const overlays = typeof overlay === 'string' ? [overlay] : overlay;
  if (Object.hasOwn(scene, 'text_overlay') && (!Array.isArray(overlays) || !overlays.every(string))) {
    invalid.push('text_overlay');
  }
  if (!texts && Array.isArray(overlays)) {
    texts = overlays.filter(string).flatMap((item) => item.split(/[\n;|]/u)).map((text) => ({ text }));
  }
  const props = auditList(scene, 'props', '', invalid);
  const events = auditList(scene, 'animation_timeline', '', invalid);
  return {
    texts, keywords, has_plan: Boolean(plan), keywords_valid: keywordsValid,
    sparse: (props?.length === 0 || !Object.hasOwn(scene, 'props')) &&
      (events ? events.length <= TEXT_AUDIT_LIMITS.weak_max_events : !Object.hasOwn(scene, 'animation_timeline')),
  };
}

function nearestVoice(words, voice) {
  if (!voice.length || words.length < TEXT_AUDIT_LIMITS.similarity_min_words) return null;
  let best = null;
  for (const { tokens, text, row, label } of voice) {
    const similarity = longestCommonSubsequence(words, tokens) / words.length;
    if (!best || similarity > best.similarity) best = { similarity, text, row, label };
    if (similarity === 1) break;
  }
  return best;
}

export function auditVisualText(declarations, timeline, voiceLines, duration) {
  const voice = voiceLines.map((line) => ({ ...line, tokens: textWords(line.text) })).filter(({ tokens }) => tokens.length);
  const timings = new Map(timeline.map(({ id, start, end }) => [id, { start, end }]));
  const byId = new Map(declarations.map((scene) => [scene.scene_id, scene]));
  const invalid_fields = [];
  const scenes = [];
  const intervals = [];
  let missingTextTiming = false;
  for (const id of new Set([...timings.keys(), ...byId.keys()])) {
    const invalid = [];
    const { texts, keywords, has_plan, keywords_valid, sparse } = readVisualFields(byId.get(id), invalid);
    if (invalid.length) invalid_fields.push({ id, fields: invalid });
    const { start = null, end = null } = timings.get(id) ?? {};
    const labels = (texts ?? []).map(({ text, kind, effect, appear_s, disappear_s }) => {
      const tokens = textWords(text);
      return {
        text: text.trim(), kind, words: tokens.length, kinetic: /kinetic/i.test(effect ?? ''), voice: nearestVoice(tokens, voice),
        start: start === null ? null : start + (appear_s ?? 0),
        end: start === null ? null : Math.min(end, duration ?? end, start + (disappear_s ?? end - start)),
      };
    }).filter(({ text }) => text);
    const placed = labels.filter((label) => label.start !== null && label.start < label.end);
    intervals.push(...placed);
    if (start === null && labels.length) missingTextTiming = true;
    const max_similarity = labels.reduce((max, { voice }) => voice ? Math.max(max ?? 0, voice.similarity) : max, null);
    const matches = labels.filter(({ voice }) => voice?.similarity >= TEXT_AUDIT_LIMITS.verbatim_similarity);
    const keyword_visual_count = keywords?.filter(({ form }) => form !== 'text_only').length ?? 0;
    const weak_reasons = [];
    if (has_plan && keywords_valid && !keyword_visual_count) {
      weak_reasons.push(keywords?.length ? 'mọi keyword đều có form text_only' : 'semantic_plan không có keyword');
    }
    if (sparse && max_similarity !== null && max_similarity >= TEXT_AUDIT_LIMITS.weak_similarity) {
      weak_reasons.push(`không có props, tối đa ${TEXT_AUDIT_LIMITS.weak_max_events} sự kiện và similarity ${format(max_similarity)}`);
    }
    scenes.push({
      id, start, end, has_plan, text_words: texts ? labels.reduce((sum, { words }) => sum + words, 0) : null,
      peaks: texts && start !== null ? simultaneousText(placed) : null, max_similarity, matches,
      kinetic: texts ? labels.filter(({ kinetic }) => kinetic).length : null, keyword_count: keywords?.length ?? 0,
      keyword_visual_count, keyword_visual_pct: keywords?.length ? 100 * keyword_visual_count / keywords.length : null, weak_reasons,
    });
  }
  const sum = (key) => scenes.reduce((total, scene) => total + (scene[key] ?? 0), 0);
  const hasTextData = scenes.some(({ text_words }) => text_words !== null);
  const text_words_total = hasTextData ? sum('text_words') : null;
  const keywordCount = sum('keyword_count');
  return {
    scenes, invalid_fields, missing_text_timing: missingTextTiming, text_words_total,
    text_words_per_min: hasTextData && duration > 0 ? 60 * text_words_total / duration : null,
    text_coverage_pct: hasTextData && !missingTextTiming ? intervalCoverage(intervals, duration) : null,
    max_similarity: scenes.reduce((max, scene) => scene.max_similarity === null ? max :
      Math.max(max ?? 0, scene.max_similarity), null),
    verbatim_texts: hasTextData && voice.length ? scenes.reduce((total, { matches }) => total + matches.filter(
      ({ kind, words }) => kind !== 'message' || words > TEXT_AUDIT_LIMITS.short_message_words).length, 0) : null,
    keyword_visual_pct: keywordCount ? 100 * sum('keyword_visual_count') / keywordCount : null,
    kinetic_per_min: hasTextData && duration > 0 ? 60 * sum('kinetic') / duration : null,
    weak_visual_scenes: scenes.filter(({ weak_reasons }) => weak_reasons.length).map(({ id }) => id),
  };
}

const dbfs = (meanSquare) => 10 * Math.log10(Math.max(1e-12, meanSquare));

function rmsDb(samples, start, end) {
  let sum = 0;
  for (let i = start; i < end; i++) sum += samples[i] ** 2;
  return dbfs(sum / (end - start));
}

export function analyzeVoiceEdges(samples, windows, limits = D8_LIMITS.voice_edges) {
  const { rate, frame_ms, edge_ms, edge_db, silence_db, speech_db, quiet_ms,
    rise_ms, fall_ms, jump_db, jump_window_ms } = limits;
  const step = Math.round(rate * frame_ms / 1000);
  const edgeSize = Math.round(rate * edge_ms / 1000);
  const quietFrames = Math.ceil(quiet_ms / frame_ms);
  const jumpFrames = Math.floor(jump_window_ms / frame_ms);
  const envelope = Array.from({ length: Math.ceil(samples.length / step) }, (_, i) =>
    rmsDb(samples, i * step, Math.min((i + 1) * step, samples.length)));
  const rmsAt = (i) => envelope[i] ?? -120;
  const timeAt = (i) => i * step / rate;
  const hasSilence = (first, last) => {
    for (let i = first; i < last; i++) if (rmsAt(i) > silence_db) return false;
    return true;
  };
  const firstSound = envelope.findIndex((level) => level > silence_db);
  const violations = [];
  const unmeasured = [];
  for (const [i, window] of windows.entries()) {
    const { start, end } = window;
    const a = Math.round(start * rate);
    // Cho phép sai số làm tròn một mẫu khi cửa sổ chạm cuối luồng.
    const b = Math.min(samples.length, Math.round(end * rate));
    if (a < 0 || end * rate > samples.length + 1 || b - a < 2 * edgeSize) {
      unmeasured.push({ i, ...window, reason: 'Cửa sổ quá ngắn hoặc vượt luồng tiếng.' });
      continue;
    }
    const first = Math.ceil(a / step);
    const last = Math.ceil(b / step) - 1;
    let head = first;
    let tail = last;
    while (head <= last && rmsAt(head) <= silence_db) head++;
    while (tail >= first && rmsAt(tail) <= silence_db) tail--;
    if (head > tail) {
      unmeasured.push({ i, ...window, reason: 'Cửa sổ không có khung tiếng trên ngưỡng lặng.' });
      continue;
    }
    let headStrong = head;
    let tailStrong = tail;
    while (headStrong <= tail && rmsAt(headStrong) < speech_db) headStrong++;
    while (tailStrong >= head && rmsAt(tailStrong) < speech_db) tailStrong--;
    const rise = headStrong <= tail && hasSilence(head - quietFrames, head) ?
      (headStrong - head) * frame_ms : null;
    const fall = tailStrong >= head && hasSilence(tail + 1, tail + 1 + quietFrames) ?
      (tail - tailStrong) * frame_ms : null;
    let jump = null;
    if (hasSilence(head - quietFrames, head)) {
      jump = 0;
      for (let k = head; k <= Math.min(tail, head + jumpFrames - 1); k++) {
        jump = Math.max(jump, Math.abs(rmsAt(k) - rmsAt(k - 1)));
      }
    }
    const headDb = rmsDb(samples, a, a + edgeSize);
    const tailDb = rmsDb(samples, b - edgeSize, b);
    const add = (edge, level_db, point, ramp_ms, jump_db, reasons) => {
      if (reasons.length) violations.push({ i, ...window, edge, level_db, time_s: point, ramp_ms, jump_db, reasons });
    };
    add('head', headDb, headDb > edge_db ? start : timeAt(head), rise, jump, [
      ...(headDb > edge_db ? ['level'] : []), ...(rise !== null && rise < rise_ms ? ['rise'] : []),
      ...(jump !== null && jump > jump_db ? ['jump'] : []),
    ]);
    add('tail', tailDb, tailDb > edge_db ? end : timeAt(tail + 1), fall, null, [
      ...(tailDb > edge_db ? ['level'] : []), ...(fall !== null && fall < fall_ms ? ['fall'] : []),
    ]);
  }
  const flagged = new Set(violations.map(({ i }) => i)).size;
  const measured = windows.length - unmeasured.length;
  return {
    first_sound_s: firstSound < 0 ? null : timeAt(firstSound), envelope,
    sentence_count: windows.length, measured_count: measured, flagged_count: flagged,
    head_violations: violations.filter(({ edge }) => edge === 'head').length,
    tail_violations: violations.filter(({ edge }) => edge === 'tail').length,
    violation_pct: measured ? 100 * flagged / measured : null, violations, unmeasured,
  };
}

const boxValid = (box) => Array.isArray(box) && box.length === 4 && box.every(Number.isFinite) &&
  box[0] < box[2] && box[1] < box[3];
const boxContains = (outer, inner, margin = 0) => inner[0] >= outer[0] - margin && inner[1] >= outer[1] - margin &&
  inner[2] <= outer[2] + margin && inner[3] <= outer[3] + margin;
const boxGap = (a, b) => Math.hypot(Math.max(0, a[0] - b[2], b[0] - a[2]), Math.max(0, a[1] - b[3], b[1] - a[3]));
const timeOverlap = (a, b) => Math.min(a.end, b.end) - Math.max(a.start, b.start) > EPSILON;
const normalizedText = (s) => s.normalize('NFC').toLowerCase().trim().replace(/\s+/gu, ' ');
const renderedLabelKey = ({ role, text, attach_to, id }) =>
  JSON.stringify([role, normalizedText(text), attach_to ?? null, id ?? null]);

export function validateRenderLog(log) {
  if (log?.version !== 1 || !Number.isFinite(log.fps) || log.fps <= 0 ||
    !Array.isArray(log.size) || log.size.length !== 2 || log.size[0] !== 1080 || log.size[1] !== 1920 ||
    !Array.isArray(log.events)) {
    throw new Error('Nhật ký dựng cần version 1, fps, size [1080,1920] và mảng events.');
  }
  for (const [i, item] of log.events.entries()) {
    const valid = auditRecord(item) && typeof item.scene === 'string' && item.scene.trim() &&
      sceneSecond(item.start) && Number.isFinite(item.end) && item.end > item.start &&
      (['opening', 'phase', 'camera'].includes(item.kind) || boxValid(item.bbox));
    const kindValid = valid && (
      item.kind === 'opening' ||
      (item.kind === 'phase' && PIPELINE.opening.phases.includes(item.phase)) ||
      (item.kind === 'camera' && boxValid(item.crop_from) && boxValid(item.crop_to) &&
        Number.isFinite(item.zoom_from) && Number.isFinite(item.zoom_to)) ||
      (item.kind === 'text' && typeof item.text === 'string' && typeof item.role === 'string' &&
        Number.isFinite(item.px) && item.px > 0 && (item.target_bbox == null || boxValid(item.target_bbox))) ||
      (item.kind === 'component' && typeof item.name === 'string') ||
      (item.kind === 'header' && HEADER_SLOTS.includes(item.slot))
    );
    if (!kindValid) throw new Error('Sự kiện nhật ký dựng không hợp lệ tại events[' + i + '].');
  }
  return log;
}

export function checkOpening(scenes, duration, firstSound, log, limits = D8_LIMITS.opening, voiced = false) {
  const openings = scenes?.filter(({ role }) => role === 'opening') ?? [];
  const scene = openings[0];
  const layout_ok = scenes?.length && Number.isFinite(duration) ? openings.length === 1 &&
    scene === scenes[0] && scene.start <= EPSILON && scene.end <= duration + EPSILON &&
    !scenes.slice(1).some((other) => timeOverlap(scene, other)) : null;
  const length = scene ? scene.end - scene.start : null;
  const duration_ok = length === null ? null : length + EPSILON >= limits.min_s && length <= limits.max_s + EPSILON;
  const voice_ok = !scene || firstSound === undefined ? null :
    voiced ? firstSound !== null && limits.voice_allowed &&
      firstSound - scene.start + EPSILON >= limits.voice_start_min_s &&
      firstSound - scene.start <= limits.voice_start_max_s + EPSILON :
      firstSound === null || firstSound + EPSILON >= scene.end - limits.early_voice_s;
  const titles = log && scene ? log.events.filter((event) => event.kind === 'text' &&
    event.role === 'opening_title' && event.text.trim() && event.scene === scene.id && timeOverlap(event, scene)) : null;
  const title_ok = titles?.length ? titles.every(({ px, bbox }) => px >= limits.title_px && boxContains(limits.safe_bbox, bbox)) :
    titles !== null ? false : null;
  const phases = log?.events.filter((event) => event.kind === 'phase' && event.scene === scene?.id)
    .sort((a, b) => a.start - b.start) ?? [];
  const phase_ok = phases.length < limits.phases.length ? null : phases.length === limits.phases.length &&
    phases.every((event, i) => event.phase === limits.phases[i] &&
      event.end - event.start + EPSILON >= limits.phase_min_s &&
      Math.abs(event.start - (phases[i - 1]?.end ?? scene.start)) <= 1 / log.fps &&
      (i < phases.length - 1 || Math.abs(scene.end - event.end) <= 1 / log.fps));
  const checks = [layout_ok, duration_ok, voice_ok, title_ok, phase_ok];
  return {
    layout_ok, duration_ok, voice_ok, title_ok, phase_ok, phases, voiced,
    target_ok: length === null ? null : length >= limits.target_s[0] && length <= limits.target_s[1], first_sound_s: firstSound ?? null, titles,
    separate_ok: [layout_ok, duration_ok, voice_ok].every((value) => value === true),
    ok: checks.includes(false) ? false : checks.every((value) => value === true) ? true : null,
  };
}

// Hợp nhất các khoảng kề nhau khi nhật ký chia một lần vẽ thành nhiều đoạn do bbox đổi.
function mergeEvents(events, key, keepParallel = false) {
  const tolerance = 0.001 + EPSILON;
  return [...Map.groupBy(events, key).values()].flatMap((group) => {
    const result = [];
    for (const event of group.sort((a, b) => a.start - b.start)) {
      const last = keepParallel ? result.findLast(({ end }) => Math.abs(end - event.start) <= tolerance) : result.at(-1);
      if (last && event.start <= last.end + tolerance) last.end = Math.max(last.end, event.end);
      else result.push({ ...event });
    }
    return result;
  }).sort((a, b) => a.start - b.start);
}

export function auditRenderedHeader(log, windows, from, duration, limits = D8_LIMITS.header) {
  const relevant = (event) => event.end > from && event.start < duration;
  const headers = log.events.filter((event) => event.kind === 'header' && relevant(event))
    .map((event) => ({ ...event, start: Math.max(from, event.start), end: Math.min(duration, event.end) }))
    .sort((a, b) => a.start - b.start);
  const objects = log.events.filter((event) => ['text', 'component'].includes(event.kind) && relevant(event))
    .sort((a, b) => a.start - b.start);
  const geometry_violations = [];
  const size_violations = [];
  const overlaps = [];
  const seenSize = new Set();
  const seenOverlaps = new Map();
  const frameArea = log.size[0] * log.size[1];
  let cursor = 0;
  let active = [];
  for (const header of headers) {
    const { start, end, scene, bbox, slot } = header;
    const width_px = bbox[2] - bbox[0];
    const height_px = bbox[3] - bbox[1];
    const area_pct = 100 * width_px * height_px / frameArea;
    if (area_pct > limits.area_pct || width_px > limits.width_px || height_px > limits.height_px) {
      geometry_violations.push({ start, end, scene, slot, bbox, width_px, height_px, area_pct });
    }
    while (cursor < objects.length && objects[cursor].start < end) active.push(objects[cursor++]);
    active = active.filter((object) => object.end > start + EPSILON);
    const live = active.filter((object) => timeOverlap(header, object));
    for (const role of headerRoles) {
      const min_px = role === 'header_title' ? limits.title_px : limits.topic_px;
      const labels = live.filter((item) => item.kind === 'text' && item.role === role &&
        item.text.trim() && boxContains(bbox, item.bbox, 2));
      const intervals = labels.map((item) => ({ start: Math.max(0, item.start - start), end: item.end - start }));
      if (intervalCoverage(intervals, end - start) < 100 - 1e-6) {
        size_violations.push({ start, end, scene, slot, role, min_px, px: null, bbox });
      }
      for (const label of labels.filter(({ px }) => px < min_px)) {
        if (seenSize.has(label)) continue;
        seenSize.add(label);
        size_violations.push({ start: label.start, end: label.end, scene: label.scene, slot, role, min_px,
          px: label.px, bbox: label.bbox });
      }
    }
    for (const item of live) {
      if (item.kind === 'text' && headerRoles.includes(item.role) &&
        headers.some((card) => timeOverlap(card, item) && boxContains(card.bbox, item.bbox, 2))) continue;
      const gap_px = boxGap(bbox, item.bbox);
      if (gap_px >= limits.gap_px) continue;
      const object = { kind: item.kind, name: item.name ?? item.text, id: item.id, scene: item.scene, bbox: item.bbox };
      const overlap = { start: Math.max(start, item.start), end: Math.min(end, item.end), scene, slot, bbox, object, gap_px };
      const key = JSON.stringify([scene, slot, object.kind, object.name, object.id, object.scene]);
      const last = seenOverlaps.get(key);
      if (last && overlap.start <= last.end + 0.001 + EPSILON) {
        last.end = Math.max(last.end, overlap.end);
        if (gap_px < last.gap_px) Object.assign(last, { bbox, object, gap_px, worst_s: overlap.start });
      } else {
        overlaps.push(overlap);
        seenOverlaps.set(key, overlap);
      }
    }
  }
  const runs = mergeEvents(headers, ({ slot }) => slot);
  const transitions = runs.slice(1).flatMap((item, i) => {
    const previous = runs[i];
    if (item.slot === previous.slot) return [];
    const transition_s = Math.max(0, Math.min(previous.end, item.end) - item.start);
    const frame = 1 / log.fps + 0.001;
    const boundary_s = windows.map(({ start }) => start).find((point) =>
      point >= item.start - frame && point <= previous.end + frame) ?? null;
    const ok = transition_s >= limits.transition_min_s - frame &&
      transition_s <= limits.transition_max_s + frame && (!windows.length || boundary_s !== null);
    return [{ start: item.start, end: item.start + transition_s, scene: item.scene, from_slot: previous.slot,
      to_slot: item.slot, transition_s, boundary_s, ok }];
  });
  return {
    coverage_pct: intervalCoverage(headers.map(({ start, end }) => ({ start: start - from, end: end - from })), duration - from),
    geometry_violations, size_violations, overlaps, transitions, slot_changes: transitions.length,
  };
}

function textTracks(events) {
  return [...Map.groupBy(events, renderedLabelKey).values()].flatMap((group) => {
    const tracks = [];
    for (const event of group.sort((a, b) => a.start - b.start)) {
      // Nhật ký làm tròn mốc đến µs. Các chữ giống nhau cùng hiện vẫn là hai đối tượng.
      const distance = ({ fragments }) => fragments.at(-1).bbox.reduce((sum, edge, i) => sum + Math.abs(edge - event.bbox[i]), 0);
      const track = tracks.filter(({ end }) => Math.abs(end - event.start) <= 1e-6 + EPSILON)
        .reduce((nearest, candidate) => !nearest || distance(candidate) < distance(nearest) ? candidate : nearest, null);
      if (track) {
        track.end = event.end;
        track.fragments.push(event);
      } else tracks.push({ start: event.start, end: event.end, fragments: [event] });
    }
    return tracks;
  });
}

const boxArea = ([x0, y0, x1, y1]) => Math.max(0, x1 - x0) * Math.max(0, y1 - y0);

function textPairRuns(left, right, limits) {
  const runs = [];
  let minGap = Infinity;
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    const a = left[i];
    const b = right[j];
    const start = Math.max(a.start, b.start);
    const end = Math.min(a.end, b.end);
    if (end - start > EPSILON) {
      const [x0, y0, x1, y1] = a.bbox;
      const [u0, v0, u1, v1] = b.bbox;
      const area = boxArea([Math.max(x0, u0), Math.max(y0, v0), Math.min(x1, u1), Math.min(y1, v1)]);
      const intersection_pct = 100 * area / Math.min(boxArea(a.bbox), boxArea(b.bbox));
      const gap_px = boxGap(a.bbox, b.bbox);
      minGap = Math.min(minGap, gap_px);
      if (gap_px < limits.gap_px) {
        const part = { start, end, boxes: [a.bbox, b.bbox], gap_px, intersection_pct };
        const overlaps = area > 0;
        const last = runs.at(-1);
        if (last?.overlaps === overlaps && start - last.end <= 1e-6 + EPSILON) {
          last.end = end;
          last.parts.push(part);
          last.gap_px = Math.min(last.gap_px, gap_px);
          last.intersection_pct = Math.max(last.intersection_pct, intersection_pct);
        } else runs.push({ start, end, overlaps, gap_px, intersection_pct, parts: [part] });
      }
    }
    if (a.end <= b.end) i++;
    if (b.end <= a.end) j++;
  }
  return { minGap, runs: runs.filter(({ start, end }) => end - start >= limits.min_s - 1e-6 - EPSILON) };
}

export function measureTextOverlap(log, duration, limits = D8_LIMITS.text_overlap) {
  const texts = log.events.filter(({ kind, role, text, start }) => kind === 'text' && role !== 'caption' &&
    !/^(header|opening)_/.test(role) && text.trim() && (duration == null || start < duration))
    .map((event) => ({ ...event, end: Math.min(duration ?? event.end, event.end) }));
  const overlaps = [];
  const close_pairs = [];
  let minGap = Infinity;
  for (const [scene, events] of Map.groupBy(texts, ({ scene }) => scene)) {
    const tracks = textTracks(events);
    for (const [index, left] of tracks.entries()) {
      for (const right of tracks.slice(index + 1)) {
        if (Math.min(left.end, right.end) - Math.max(left.start, right.start) < limits.min_s - 1e-6 - EPSILON) continue;
        const result = textPairRuns(left.fragments, right.fragments, limits);
        // Khe nhỏ nhất giữ cả các nhịp ngắn trong cặp cùng hiện đủ lâu.
        minGap = Math.min(minGap, result.minGap);
        const [worst] = result.runs.sort((a, b) => b.intersection_pct - a.intersection_pct || a.gap_px - b.gap_px);
        if (!worst) continue;
        const { start, end, gap_px, intersection_pct, parts } = worst;
        const midpoint = (start + end) / 2;
        const { boxes } = parts.find((part) => part.end > midpoint) ?? parts.at(-1);
        const pair = { scene, start, end, texts: [left.fragments[0].text, right.fragments[0].text], boxes, gap_px, intersection_pct };
        (worst.overlaps ? overlaps : close_pairs).push(pair);
      }
    }
  }
  return { overlaps, close_pairs, text_overlap_pairs: overlaps.length, text_min_gap_px: Number.isFinite(minGap) ? minGap : null };
}

const keywordWords = (text) => text.normalize('NFC').toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}\p{M}]*/gu) ?? [];
const namedKeywordTypes = ['entity', 'term', 'concept'];
const visualKeywordForms = ['animation', 'connection', 'comparison', 'flow', 'status', 'metaphor'];

function matchesKeyword(plan, event, components, limits) {
  const words = keywordWords(event.text);
  const termWords = keywordWords(plan.text);
  const phrase = (tokens) => ' ' + tokens.join(' ') + ' ';
  if (words.length && termWords.length &&
    (phrase(words).includes(phrase(termWords)) || phrase(termWords).includes(phrase(words)))) return true;
  const meaningful = [...new Set(termWords.filter((word) => [...word].length > 2))];
  if (meaningful.length && meaningful.filter((word) => words.includes(word)).length >=
    limits.keyword_shared_words * meaningful.length) return true;
  const object = normalizedText(plan.object ?? '');
  if (!object) return false;
  const isObject = (name) => typeof name === 'string' && normalizedText(name) === object;
  if (isObject(event.attach_to)) return true;
  return components.some((item) => (isObject(item.id) || isObject(item.name)) && timeOverlap(item, event) &&
    ((item.id && item.id === event.attach_to) || (event.target_bbox &&
      item.bbox.every((value, i) => Math.abs(value - event.target_bbox[i]) <= limits.target_bbox_tolerance_px))));
}

export function auditRenderedText(log, declarations, timing, voiceLines, duration, limits = D8_LIMITS.text) {
  const scenes = timing.length ? timing : declarations.map(({ scene_id: id }) => ({ id }));
  const sceneById = new Map(scenes.map((scene) => [scene.id, scene]));
  const planned = [];
  const keywords = [];
  const scenes_with_planned_text = [];
  for (const scene of declarations) {
    const id = scene.scene_id;
    const { texts, keywords: terms } = readVisualFields(scene, []);
    const semanticTexts = Array.isArray(scene.semantic_plan?.texts) ? (texts ?? []) : [];
    if (semanticTexts.some(({ text }) => text.trim())) scenes_with_planned_text.push(id);
    const window = sceneById.get(id);
    for (const { text, appear_s } of semanticTexts.filter(({ text }) => text.trim())) {
      const start = window?.start == null ? null : window.start + (appear_s ?? 0);
      planned.push({ scene: id, text, start, end: window?.end ?? null });
    }
    for (const { term, type, form, object } of terms ?? []) {
      const visual = ['action', 'relation'].includes(type) && visualKeywordForms.includes(form);
      if (term?.trim() && (visual || namedKeywordTypes.includes(type))) {
        keywords.push({ scene: id, text: term, type, form, object, visual,
          start: window?.start ?? null, end: window?.end ?? null });
      }
    }
  }
  const plannedIds = new Set(scenes_with_planned_text);
  const counts = {
    planned_scenes_with_text_pct: declarations.length ? 100 * scenes_with_planned_text.length / declarations.length : null,
    scenes_with_planned_text, planned_scene_count: declarations.length,
    planned_scenes_without_text: declarations.filter(({ scene_id }) => !plannedIds.has(scene_id))
      .map(({ scene_id: id }) => sceneById.get(id) ?? { id }),
  };
  if (!log) return counts;
  const fragments = log.events.filter((event) => event.kind === 'text' && textKinds.includes(event.role) &&
    event.text.trim() && (duration == null || event.start < duration));
  const key = ({ scene, role, text, attach_to }) => JSON.stringify([scene, role, normalizedText(text), attach_to ?? null]);
  const texts = mergeEvents(fragments, key, true).map((event) => ({ ...event, words: textWords(event.text).length,
    end: Math.min(duration ?? event.end, event.end) }));
  const byScene = Map.groupBy(texts, ({ scene }) => scene);
  const missing_text_scenes = scenes.filter(({ id }) => !byScene.has(id));
  const peaks = simultaneousText(texts);
  const kinetic = mergeEvents(fragments.filter(({ effect }) => effect === 'kinetic'), key, true);
  const kineticByScene = Map.groupBy(kinetic, ({ scene }) => scene);
  const intervals = kinetic.slice(1).map((current, i) => ({
    start: kinetic[i].start, end: current.start, scene: kinetic[i].scene, next_scene: current.scene,
    gap_s: current.start - kinetic[i].start,
  }));
  const sceneOrder = new Map(scenes.map(({ id }, index) => [id, index]));
  const kinetic_consecutive_scenes = intervals.filter(({ scene, next_scene }) =>
    Math.abs(sceneOrder.get(next_scene) - sceneOrder.get(scene)) === 1);
  const missing_planned_texts = [];
  let found = 0;
  const matched = new Set();
  for (const plan of planned.filter(({ start }) => start !== null).sort((a, b) => a.start - b.start)) {
    const normalized = normalizedText(plan.text);
    const match = (byScene.get(plan.scene) ?? []).find((event) => !matched.has(event) && normalizedText(event.text) === normalized &&
      Math.abs(event.start - plan.start) <= limits.appear_tolerance_s + EPSILON);
    if (match) {
      matched.add(match);
      found++;
    } else missing_planned_texts.push(plan);
  }
  const labels = fragments.filter(({ role }) => role === 'label');
  const unattached_labels = mergeEvents(labels.filter(({ bbox, target_bbox }) =>
    target_bbox && boxGap(bbox, target_bbox) > limits.attachment_gap_px).map((event) =>
    ({ ...event, gap_px: boxGap(event.bbox, event.target_bbox) })), key);
  const labels_without_target = mergeEvents(labels.filter(({ target_bbox }) => !target_bbox), key);
  const keywordEvidence = Map.groupBy(log.events.filter(({ kind, role, text }) => kind === 'component' ||
    (kind === 'text' && role !== 'caption' && !role.startsWith('header_') && text.trim())), ({ scene }) => scene);
  const keywords_without_text = keywords.filter((plan) => {
    const window = { start: plan.start ?? 0, end: Math.min(plan.end ?? Infinity, duration ?? Infinity) };
    const evidence = (keywordEvidence.get(plan.scene) ?? []).filter((event) => timeOverlap(event, window))
      .map((event) => ({ ...event, start: Math.max(window.start, event.start), end: Math.min(window.end, event.end) }));
    const components = evidence.filter(({ kind }) => kind === 'component');
    return !evidence.some((event) => event.kind === 'text' && matchesKeyword(plan, event, components, limits));
  });
  const voice = voiceLines.map((line) => ({ ...line, tokens: textWords(line.text) })).filter(({ tokens }) => tokens.length);
  const verbatim = texts.filter(({ role, words }) => role !== 'message' || words > TEXT_AUDIT_LIMITS.short_message_words)
    .flatMap((item) => {
      const match = nearestVoice(textWords(item.text), voice);
      return match?.similarity >= TEXT_AUDIT_LIMITS.verbatim_similarity ? [{ ...item, voice: match }] : [];
    });
  return {
    ...counts, words_per_min: duration > 0 ? 60 * texts.reduce((sum, { words }) => sum + words, 0) / duration : null,
    scenes_with_text_pct: scenes.length ? 100 * (scenes.length - missing_text_scenes.length) / scenes.length : null,
    missing_text_scenes, max_simultaneous_words: peaks.words.count, peak: peaks.words,
    kinetic_count: kinetic.length, kinetic_per_25s: duration > 0 ? 25 * kinetic.length / duration : null,
    kinetic_min_gap_s: intervals.length ? Math.min(...intervals.map(({ gap_s }) => gap_s)) : null,
    kinetic_consecutive_scenes, kinetic_close: intervals.filter(({ gap_s }) => gap_s < limits.kinetic_min_gap_s - EPSILON),
    kinetic_repeated: [...kineticByScene.values()].filter((items) => items.length > limits.kinetic_per_scene),
    planned_texts_found_pct: planned.length && planned.every(({ start }) => start !== null) ? 100 * found / planned.length : null,
    planned_texts_found: found, planned_texts_count: planned.length, missing_planned_texts,
    unattached_labels, labels_without_target, keywords_without_text, verbatim: voice.length ? verbatim : null,
  };
}

function assNumber(value) {
  return value?.trim() ? Number(value) : NaN;
}

function assTime(value) {
  if (!/^\d+:\d{2}:\d{2}(?:\.\d+)?$/.test(value ?? '')) return null;
  const [hours, minutes, seconds] = value.split(':').map(Number);
  return 3600 * hours + 60 * minutes + seconds;
}

export function parseCaptionStyles(contents) {
  let play_res_y = CAPTION_REFERENCE_HEIGHT;
  let section = '';
  let columns = [];
  const styles = new Map();
  const dialogues = [];
  for (const raw of contents.split(/\r?\n/u)) {
    const line = raw.trim();
    if (line.startsWith('[')) {
      section = line.toLowerCase();
      columns = [];
      continue;
    }
    const [, kind, value] = /^(playresy|format|style|dialogue):\s*(.*)$/i.exec(line) ?? [];
    const key = kind?.toLowerCase();
    if (section === '[script info]' && key === 'playresy') {
      if (assNumber(value) > 0 && Number.isFinite(assNumber(value))) play_res_y = assNumber(value);
      continue;
    }
    const styleSection = /^\[v4\+? styles\]$/.test(section);
    if (!styleSection && section !== '[events]') continue;
    if (key === 'format') {
      columns = value.toLowerCase().split(',').map((field) => field.trim());
      continue;
    }
    if (styleSection ? key !== 'style' : key !== 'dialogue') continue;
    const fields = value.split(',');
    // Cột Text cuối của Dialogue có thể chứa dấu phẩy.
    const values = Object.fromEntries(columns.map((column, index) =>
      [column, (column === 'text' && index === columns.length - 1 ? fields.slice(index).join(',') : fields[index])?.trim()]));
    if (styleSection && values.name) styles.set(values.name.toLowerCase(), values);
    if (!styleSection && values.style) dialogues.push(values);
  }
  const scale = CAPTION_REFERENCE_HEIGHT / play_res_y;
  const used = [];
  for (const [name, rows] of Map.groupBy(dialogues, ({ style }) => style.toLowerCase())) {
    const style = styles.get(name);
    const fontsize = assNumber(style?.fontsize);
    const alignment = assNumber(style?.alignment);
    const margin_v = assNumber(style?.marginv);
    const px = Number.isFinite(fontsize) && fontsize > 0 ? fontsize * scale : null;
    const placements = rows.map((row) => {
      const margin = assNumber(row.marginv) > 0 ? assNumber(row.marginv) : margin_v;
      const tags = [...(row.text ?? '').matchAll(/\{([^}]*)\}/gu)].map(([, tag]) => tag).join('');
      const align = Number(/\\an([1-9])(?!\d)/i.exec(tags)?.[1] ?? alignment);
      const position = /\\pos\(\s*-?[\d.]+\s*,\s*(-?[\d.]+)\s*\)/i.exec(tags);
      const bottom = [1, 2, 3].includes(align);
      const center = [4, 5, 6].includes(align);
      const top = [7, 8, 9].includes(align);
      const anchor = position ? Number(position[1]) : bottom ? play_res_y - margin : center ? play_res_y / 2 : margin;
      // Ước lượng tâm khối dòng theo cỡ chữ và các ngắt dòng khai báo.
      const lines = (row.text ?? '').replace(/\{[^}]*\}/gu, '').split(/\\[Nn]/u).length;
      const y = (anchor + (bottom ? -1 : top ? 1 : 0) * fontsize * lines / 2) * scale;
      const y_center = px !== null && (bottom || center || top) && Number.isFinite(y) ? y : null;
      return {
        start: assTime(row.start), end: assTime(row.end), alignment: align || null,
        margin_v: Number.isFinite(margin) ? margin : null, y_center,
        band_ok: y_center === null ? null : bottom && y_center >= CAPTION_BAND[0] && y_center <= CAPTION_BAND[1],
      };
    });
    const band_ok = placements.some(({ band_ok }) => band_ok === false) ? false :
      placements.every(({ band_ok }) => band_ok === true) ? true : null;
    used.push({
      name: style?.name ?? rows[0].style, fontsize: px === null ? null : fontsize, px,
      alignment: alignment || null, margin_v: Number.isFinite(margin_v) ? margin_v : null,
      band_ok, dialogue_count: rows.length, first: placements[0],
      outside: placements.find((item) => item.band_ok === false) ?? null,
    });
  }
  return { play_res_y, styles: used };
}

export function conceptWindows(scenes, duration) {
  const length = Math.min(PACING.window_s, duration);
  const lastStart = duration - length;
  const declared = scenes.filter(({ concepts }) => concepts > 0);
  const bounds = declared.flatMap(({ start, end }) => [start, end, start - length, end - length]);
  // Tổng thay đổi tuyến tính giữa hai mốc mà đầu hoặc cuối cửa sổ chạm biên cảnh.
  const points = [...new Set([0, lastStart, ...bounds.filter((at) => at > 0 && at < lastStart)])].sort((a, b) => a - b);
  const peaks = [];
  let peak = null;
  for (const start of points) {
    const end = start + length;
    const members = declared.filter((scene) => scene.start < end && scene.end > start);
    const concepts = members.reduce((sum, scene) => sum + scene.concepts *
      (Math.min(end, scene.end) - Math.max(start, scene.start)) / (scene.end - scene.start), 0);
    if (concepts - PACING.max_window_concepts > 1e-9) {
      if (!peak || concepts > peak.concepts) peak = { start, end, concepts, scene_ids: members.map(({ id }) => id) };
    } else if (peak) {
      peaks.push(peak);
      peak = null;
    }
  }
  if (peak) peaks.push(peak);
  return peaks;
}

function summarizeMotion(steps, fps, startFrame = 0, endFrame = steps.length, minRun = MIN_STATIC_RUN_S) {
  let staticSteps = 0;
  let longest = 0;
  let runSteps = 0;
  const staticRuns = [];
  for (let i = startFrame; i <= endFrame; i++) {
    if (i < endFrame && steps[i].local < STATIC_LOCAL_DIFF) {
      staticSteps++;
      runSteps++;
    } else if (runSteps) {
      longest = Math.max(longest, runSteps);
      const length = runSteps / fps;
      if (length >= minRun) staticRuns.push({ start_s: (i - runSteps) / fps, length_s: length });
      runSteps = 0;
    }
  }
  return {
    static_pct: endFrame > startFrame ? 100 * staticSteps / (endFrame - startFrame) : 0,
    longest_static_s: longest / fps,
    static_runs: staticRuns,
  };
}

export function analyzeFrames(buffer, { w, h, fps } = FRAME) {
  const frameSize = w * h;
  const blockArea = BLOCK_SIZE ** 2;
  const steps = [];
  for (let offset = frameSize; offset < buffer.length; offset += frameSize) {
    let local = 0;
    let active = 0;
    for (let y = 0; y < h; y += BLOCK_SIZE) {
      for (let x = 0; x < w; x += BLOCK_SIZE) {
        let sum = 0;
        for (let dy = 0; dy < BLOCK_SIZE; dy++) {
          const pixel = offset + (y + dy) * w + x;
          for (let dx = 0; dx < BLOCK_SIZE; dx++) {
            sum += Math.abs(buffer[pixel + dx] - buffer[pixel + dx - frameSize]);
          }
        }
        const diff = sum / blockArea;
        local = Math.max(local, diff);
        if (diff > ACTIVE_BLOCK_DIFF) active++;
      }
    }
    steps.push({ local, active });
  }
  const motion = summarizeMotion(steps, fps);
  return { steps, motion };
}

function median(values) {
  if (!values.length) return null;
  values.sort((a, b) => a - b);
  const middle = Math.floor(values.length / 2);
  return values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2;
}

function sceneWindows(scenes, frameCount, fps) {
  return scenes.map(({ start, end }) => {
    const first = Math.min(frameCount, Math.ceil(start * fps));
    const endExclusive = Math.min(frameCount, Math.ceil(end * fps));
    const midpoint = Math.round((start + end) / 2 * fps);
    const middle = first < endExclusive ? Math.max(first, Math.min(endExclusive - 1, midpoint)) : null;
    return { first, endExclusive, middle };
  });
}

function frameDiff(buffer, frameSize, from, to) {
  let sum = 0;
  for (let i = 0; i < frameSize; i++) {
    sum += Math.abs(buffer[from * frameSize + i] - buffer[to * frameSize + i]);
  }
  return sum / frameSize;
}

export function sceneStats(scenes) {
  const count = scenes.length;
  const lengths = scenes.map(({ start, end }) => end - start);
  const total = lengths.reduce((sum, length) => sum + length, 0);
  return {
    count, mean_s: count ? total / count : null,
    min_s: count ? Math.min(...lengths) : null, max_s: count ? Math.max(...lengths) : null,
    under_2s: scenes.filter(({ start, end }) => end < start + 2).length,
    cuts_per_10s: total ? 10 * (count - 1) / total : null,
  };
}

export function groupLayouts(buffer, scenes, { w, h, fps } = FRAME) {
  const frameSize = w * h;
  const groups = [];
  const representatives = [];
  let previous = -1;
  let run = 0;
  let longestRun = 0;
  const windows = sceneWindows(scenes, buffer.length / frameSize, fps);
  for (const [index, { middle }] of windows.entries()) {
    if (middle === null) {
      previous = -1;
      run = 0;
      continue;
    }
    const { id } = scenes[index];
    let group = representatives.findIndex((rep) => frameDiff(buffer, frameSize, rep, middle) < LAYOUT_SAME_DIFF);
    if (group === -1) {
      group = groups.length;
      representatives.push(middle);
      groups.push({ rep: id, scenes: [] });
    }
    groups[group].scenes.push(id);
    run = group === previous ? run + 1 : 1;
    longestRun = Math.max(longestRun, run);
    previous = group;
  }
  return { distinct: groups.length, groups, longest_run: longestRun };
}

export function analyzeScenes(buffer, steps, scenes, { w, h, fps } = FRAME) {
  const frameSize = w * h;
  const windows = sceneWindows(scenes, buffer.length / frameSize, fps);
  return scenes.map(({ id, start, end }, index) => {
    // Chỉ tính bước có cả hai khung trong khoảng [start, end) của cảnh.
    const { first, endExclusive, middle } = windows[index];
    const last = Math.max(first, endExclusive - 1);
    const sceneSteps = steps.slice(first, last);
    const { static_pct, longest_static_s } = summarizeMotion(steps, fps, first, last);
    let layoutDiff = null;
    const nextMiddle = windows[index + 1]?.middle ?? null;
    if (middle !== null && nextMiddle !== null) {
      layoutDiff = frameDiff(buffer, frameSize, middle, nextMiddle);
    }
    return {
      id, start, end,
      local_median: median(sceneSteps.map(({ local }) => local)),
      active_median: median(sceneSteps.map(({ active }) => active)),
      static_pct, longest_static_s,
      layout_diff_next: layoutDiff,
    };
  });
}

const formatNumber = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 });
const format = (number) => formatNumber.format(number);

function staticWarnings({ start_s, length_s }, complexScenes) {
  const end = start_s + length_s;
  const high = complexScenes.filter((scene) => scene.start < end && scene.end > start_s);
  const spans = [];
  let cursor = start_s;
  for (const scene of high) {
    const from = Math.max(cursor, scene.start);
    const to = Math.min(end, scene.end);
    if (to <= from) continue;
    if (from > cursor) spans.push({ start: cursor, end: from, limit: WARN_STATIC_RUN_S });
    spans.push({ start: from, end: to, limit: WARN_HIGH_STATIC_RUN_S, scene_ids: [scene.id] });
    cursor = to;
  }
  if (cursor < end) spans.push({ start: cursor, end, limit: WARN_STATIC_RUN_S });
  return spans.filter(({ start, end, limit }) => end - start - limit > 1e-9).map(({ start, end, limit, scene_ids }) => ({
    kind: 'static', start, end, ...(scene_ids && { scene_ids }),
    message: `Đoạn tĩnh ${format(start)}–${format(end)} s dài ${format(end - start)} s (R4: cần hold_reason trong storyboard)` +
      (scene_ids ? `. Ngưỡng thử cảnh high ${format(limit)} s.` : ''),
  }));
}

export function motionFindings(motion, scenes = [], timeline = []) {
  const findings = [];
  const high = timeline.filter(({ complexity }) => complexity === 'high').sort((a, b) => a.start - b.start);
  for (const run of motion.static_runs) findings.push(...staticWarnings(run, high));
  let similarPairs = 0;
  for (const [index, scene] of scenes.entries()) {
    const { id, start, end, local_median, active_median, layout_diff_next } = scene;
    if (end >= start + MIN_SCENE_DURATION_S && active_median !== null && active_median < MIN_ACTIVE_MEDIAN) {
      findings.push({ kind: 'low_motion', start, end, scene_ids: [id],
        message: `Cảnh ${id} (${format(start)}–${format(end)} s) ít chuyển động: trung vị ${format(active_median)} khối hoạt động, hiệu cục bộ ${format(local_median)}` });
    }
    if (layout_diff_next !== null && layout_diff_next < SIMILAR_LAYOUT_DIFF) {
      similarPairs++;
    } else {
      if (similarPairs >= MIN_SIMILAR_PAIRS) {
        const group = scenes.slice(index - similarPairs, index + 1);
        const ids = group.map(({ id }) => id).join(', ');
        const diffs = group.slice(0, -1).map(({ layout_diff_next }) => format(layout_diff_next)).join(' / ');
        const count = group.length === 3 ? 'Ba' : group.length;
        findings.push({ kind: 'similar_layout', start: group[0].start, end: scene.end,
          scene_ids: group.map(({ id }) => id),
          message: `${count} cảnh liền ${ids} có bố cục giống nhau (độ khác ${diffs})` });
      }
      similarPairs = 0;
    }
  }
  return findings;
}

export function motionWarnings(motion, scenes = [], timeline = []) {
  return motionFindings(motion, scenes, timeline).map(({ message }) => message);
}

export function measureVideo(file, scenesFile) {
  const warns = [];
  let scenes;
  if (scenesFile !== undefined) {
    try {
      const parsed = JSON.parse(fs.readFileSync(scenesFile, 'utf8').replace(/^\uFEFF/, ''));
      if (!Array.isArray(parsed) || !parsed.every((scene) =>
        typeof scene?.id === 'string' && scene.id.trim() && Number.isFinite(scene.start) &&
        Number.isFinite(scene.end) && scene.start >= 0 && scene.end > scene.start)) {
        throw new Error('Danh sách cảnh không hợp lệ');
      }
      scenes = parsed;
    } catch {
      warns.push('Không đọc được tệp cảnh --scenes hoặc danh sách cảnh không hợp lệ.');
    }
  }

  const { w, h, fps } = FRAME;
  const decoded = spawnSync('ffmpeg', [
    '-v', 'error', '-i', file, '-vf', `fps=${fps},scale=${w}:${h}:flags=area,format=gray`, '-f', 'rawvideo', '-',
  ], { maxBuffer: 64 * 1024 * 1024, windowsHide: true });
  if (decoded.status !== 0 || !decoded.stdout?.length || decoded.stdout.length % (w * h) !== 0) {
    warns.push('Không đo được chuyển động: FFmpeg không giải mã được khung hình.');
    return { info: {}, warns };
  }

  const { steps, motion } = analyzeFrames(decoded.stdout);
  const opening = scenes?.find(({ role }) => role === 'opening');
  const firstChange = steps.findIndex(({ local }) => local >= STATIC_LOCAL_DIFF);
  const openingWindows = [];
  const spacing = qc.opening.motion_window_s;
  if (opening) for (let start = opening.start; start < opening.end - EPSILON; start += spacing) {
    const end = Math.min(start + spacing, opening.end);
    const sampled = steps.slice(Math.max(0, Math.ceil(start * fps) - 1), Math.max(0, Math.ceil(end * fps) - 1));
    if (sampled.length) openingWindows.push({ start, end, changed: sampled.some(({ local }) => local >= STATIC_LOCAL_DIFF) });
  }
  const info = { motion: { ...motion, first_change_s: firstChange < 0 ? null : (firstChange + 1) / fps,
    opening_windows: openingWindows, grid: `${w / BLOCK_SIZE}x${h / BLOCK_SIZE} khối ${BLOCK_SIZE}px, bước ${format(1 / fps)} s` } };
  if (motion.longest_static_s > 0 && !motion.static_runs.length) {
    const shortRuns = summarizeMotion(steps, fps, 0, steps.length, 0).static_runs;
    info.longest_static = shortRuns.find(({ length_s }) => length_s === motion.longest_static_s);
  }
  if (scenes) {
    info.scenes = analyzeScenes(decoded.stdout, steps, scenes);
    info.scene_stats = sceneStats(scenes);
    info.layouts = groupLayouts(decoded.stdout, scenes);
  }
  warns.push(...motionWarnings(motion, info.scenes, scenes));
  return { info, warns };
}


const pending = (reason) => ({ status: 'CHƯA KIỂM', reason });
const done = (data) => ({ status: 'đã đo', ...data });
const warning = 'cảnh báo';
const errorLevel = 'lỗi';
const finding = (kind, level, message, at = {}) => ({
  kind, level, message, start: at.start, end: at.end, scene_ids: at.scene ? [at.scene] : at.scene_ids,
});
const distance = (a, b) => Math.abs(a - b);

export function auditVisual(log, scenes, declarations, lines, plan, opening, motion, duration) {
  const findings = [];
  const add = (...args) => findings.push(finding(...args));
  const { safe_bbox: safe, width, height } = PIPELINE.frame;
  const frame = [0, 0, width, height];
  const limits = qc.visual;
  const events = log?.events ?? [];
  const cameras = events.filter(({ kind }) => kind === 'camera');
  const byScene = Map.groupBy(events, ({ scene }) => scene);
  const declaration = new Map(declarations.map((item) => [item.scene_id, item]));
  const rows = scenes.map((scene) => {
    const declared = declaration.get(scene.id);
    const actual = byScene.get(scene.id) ?? [];
    return { ...scene, archetype: actual[0]?.layout?.archetype ?? null,
      kind: declared?.scene_kind ?? declared?.scene_type ?? null, repeats: declared?.quality_check?.repeats_previous_kind };
  });
  const visualKeys = new Set();
  for (const event of events) {
    const { kind, bbox, role } = event;
    const exempt = limits.safe_exempt_roles.includes(role) || limits.safe_exempt_roles.includes(event.name);
    const reportOnce = (code, level, message) => {
      const key = JSON.stringify([code, event.scene, event.id ?? event.name ?? event.text ?? role]);
      if (visualKeys.has(key)) return;
      visualKeys.add(key);
      add(code, level, message, event);
    };
    if (bbox && !boxContains(frame, bbox)) {
      reportOnce('frame_overflow', kind === 'text' || !timeBoxIntersects(frame, bbox) ? errorLevel : warning,
        'BBox nằm ngoài khung hình.');
    } else if (bbox && (!boxContains(frame, bbox, -EPSILON) ||
      (['text', 'component'].includes(kind) && !exempt && !boxContains(safe, bbox, -EPSILON)))) {
      if (!exempt || kind === 'text')
        reportOnce('safe_area', warning, 'BBox chạm mép hoặc nằm ngoài vùng an toàn.');
    }
    if (kind !== 'camera') continue;
    const target = event.target_bbox;
    if ([event.zoom_from, event.zoom_to].some((zoom) => zoom > PIPELINE.camera.max_zoom + EPSILON) ||
      [event.crop_from, event.crop_to].some((crop) => !boxContains(frame, crop))) {
      reportOnce('camera_bounds', errorLevel, 'Crop hoặc zoom camera vượt giới hạn.');
    }
    if (!event.reason?.trim()) reportOnce('camera_reason', warning, 'Chuyển động camera thiếu lý do.');
    if (boxValid(target) && [event.crop_from, event.crop_to].some((crop) => {
      const sx = width / (crop[2] - crop[0]);
      const sy = height / (crop[3] - crop[1]);
      return !boxContains(safe, target.map((p, i) => (p - crop[i % 2]) * (i % 2 ? sy : sx)));
    })) reportOnce('camera_target_safe', warning, 'Mục tiêu camera rời vùng an toàn.');
  }
  const labels = mergeEvents(events.filter(({ kind, role, text }) => kind === 'text' && text.trim() &&
    !limits.safe_exempt_roles.includes(role)), (event) => JSON.stringify([event.scene, renderedLabelKey(event)]));
  for (const event of labels) {
    const minimum = limits.read_base_s + textWords(event.text).length * limits.read_s_per_word;
    if (event.end - event.start < minimum) add('label_read_time', warning,
      'Nhãn “' + event.text + '” hiện ngắn hơn ' + minimum.toFixed(2) + ' s.', event);
  }
  const labelSync = [];
  const textByLine = new Map((plan?.lines ?? []).map((line) => [line.line_id, line.text]));
  for (const event of labels) {
    const semantic = declaration.get(event.scene)?.semantic_plan?.texts ?? [];
    const words = textWords(event.text).join(' ');
    if (!words || !semantic.some((item) => typeof item.text === 'string' && textWords(item.text).join(' ') === words)) continue;
    const candidates = lines.filter((line) => line.scene_id === event.scene &&
      (' ' + textWords(line.text || textByLine.get(line.line_id) || '').join(' ') + ' ').includes(' ' + words + ' '));
    const ok = candidates.length ? candidates.some(({ start, end }) =>
      event.start >= start - limits.sync_before_s && event.start <= end + limits.sync_after_s) : null;
    labelSync.push({ scene: event.scene, text: event.text, start: event.start, ok });
    if (ok === false) add('label_voice_sync', warning, 'Nhãn “' + event.text + '” lệch cửa sổ lời ở mức câu.', event);
  }
  const sequences = [];
  for (const [i, row] of rows.entries()) {
    const previous = rows[i - 1];
    const tail = sequences.at(-1);
    if (row.archetype && tail?.archetype === row.archetype) {
      tail.end = row.end;
      tail.scene_ids.push(row.id);
    } else sequences.push({ archetype: row.archetype, start: row.start, end: row.end, scene_ids: [row.id] });
    if (row.kind && previous?.kind && typeof row.repeats === 'boolean' && row.repeats !== (row.kind === previous.kind))
      add('kind_declaration', warning, 'Khai báo lặp loại cảnh khác chuỗi loại cảnh thực tế.', { ...row, scene: row.id });
    if (row.kind && row.archetype && previous?.archetype && typeof row.repeats === 'boolean' &&
      row.repeats !== (row.archetype === previous.archetype) && row.repeats === (row.kind === previous.kind))
      add('layout_declaration', 'thông tin', 'Khai báo lặp loại cảnh khác chuỗi bố cục đã dựng.', { ...row, scene: row.id });
  }
  for (const run of sequences) {
    if (run.archetype && run.scene_ids.length >= limits.repeat_count)
      add('layout_run', warning, 'Bố cục ' + run.archetype + ' xuất hiện liên tiếp.', run);
  }
  for (const [key, group] of Map.groupBy(rows.filter(({ archetype }) => archetype), ({ archetype }) => archetype)) {
    if (group.length / rows.length > limits.archetype_share)
      add('layout_share', warning, 'Bố cục ' + key + ' chiếm quá nhiều cảnh.', { scene_ids: group.map(({ id }) => id) });
  }
  for (const [key, group] of Map.groupBy(rows.filter(({ kind }) => kind), ({ kind }) => kind)) {
    if (group.reduce((n, row) => n + row.end - row.start, 0) / duration > limits.kind_duration_share)
      add('kind_share', warning, 'Loại cảnh ' + key + ' chiếm quá nhiều thời lượng.', { scene_ids: group.map(({ id }) => id) });
  }
  const hasLayout = rows.some(({ archetype }) => archetype);
  const moving = cameras.filter(({ zoom_from, zoom_to, crop_from, crop_to }) =>
    zoom_from !== zoom_to || crop_from.some((point, i) => point !== crop_to[i]));
  const missing = [
    !log && 'Thiếu render-log.json.',
    log && !events.some(({ bbox }) => bbox) && 'Thiếu bbox đã dựng.',
    log && !cameras.length && 'Thiếu sự kiện camera.',
    cameras.some(({ target_bbox }) => !boxValid(target_bbox)) && 'Thiếu bbox mục tiêu để kiểm vùng an toàn sau zoom.',
    !hasLayout && 'Thiếu layout.archetype.',
    !declarations.length && 'Thiếu cảnh trong storyboard.json.',
    !scenes.length && 'Thiếu timeline cảnh.',
    opening.phase_ok === null && 'Thiếu pha opening đã dựng.',
    !motion && 'Thiếu số đo chuyển động opening.',
    !plan && !lines.some(({ text }) => text?.trim()) && 'Thiếu văn bản câu từ prosody-plan.json hoặc cues.json.',
    !lines.length && 'Thiếu cửa sổ thoại ghép với văn bản.',
  ].filter(Boolean);
  return { ...(missing.length ? pending(missing.join(' ')) : done({})), findings, missing, label_sync: labelSync,
    word_sync: pending('Thiếu dấu thời gian từng từ. Phép đối chiếu hiện có ở mức câu.'),
    sequence: rows.map(({ id, archetype, kind }) => ({ id, archetype, kind })),
    camera_scene_ratio: cameras.length && scenes.length ?
      new Set(moving.map(({ scene }) => scene).filter((id) => rows.some((row) => row.id === id))).size / scenes.length : null };
}

function timeBoxIntersects(a, b) {
  return a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
}

export function auditNarrative(scenes, declarations, lines, plan, opening, firstChange, duration) {
  const last = scenes.at(-1);
  const planLines = plan?.lines ?? [];
  const conflict = opening.phases.find(({ phase }) => phase === 'conflict');
  const cuts = scenes.slice(1).filter(({ start }) => lines.some((line) => line.start < start && start < line.end));
  const concepts = scenes.filter(({ concepts }) => Number.isFinite(concepts));
  const problemKinds = new Set(['problem_cause_consequence']);
  const problemRoles = new Set(['problem', 'setup', 'intro']);
  const leadIn = scenes.find(({ id, role }) => problemRoles.has(role) || (role !== 'opening' && role !== 'hook' &&
    (declarations.some(({ scene_id, scene_kind }) => scene_id === id && problemKinds.has(scene_kind)) ||
     planLines.some(({ scene_id, intent }) => scene_id === id && ['question', 'warning'].includes(intent)))));
  const lastVoice = last ? lines.filter(({ scene_id }) => scene_id === last.id).at(-1) : null;
  const requiredHold = declarations.find(({ scene_id }) => scene_id === last?.id)?.hold_after_voice_s ??
    PACING.complexity[last?.complexity]?.min_hold_s;
  return {
    ...pending('Cần người duyệt đánh giá sức hút, logic, chuyển ý và kết luận.'),
    findings: [], first_voice_s: opening.first_sound_s, first_voice_source: opening.voice_source ?? null,
    first_change_s: firstChange,
    conflict_s: conflict?.start ?? null, conflict_before_limit: conflict ? conflict.start <= qc.narrative.conflict_by_s : null,
    roles: scenes.map(({ id, role }) => ({ id, role: role ?? null })),
    lead_in_scene: leadIn?.id ?? null, cuts_during_voice: lines.length ? cuts.map(({ start }) => start) : null,
    concepts_per_10s: concepts.length && duration ?
      concepts.reduce((n, scene) => n + scene.concepts, 0) * qc.narrative.concept_window_s / duration : null,
    final_conclusion: last && plan ? planLines.some(({ scene_id, intent }) => scene_id === last.id && intent === 'conclusion') : null,
    final_hold_s: lastVoice ? last.end - lastVoice.end : null,
    final_hold_ok: lastVoice && Number.isFinite(requiredHold) ? last.end - lastVoice.end >= requiredHold : null,
  };
}

const powerDb = (power) => power > 0 ? 10 * Math.log10(power) : null;

export function pcmEvidence(samples, rate) {
  const floor = 32768 * 10 ** (qc.audio.signal_floor_db / 20);
  const active = [];
  const clipped = [];
  const bins = [];
  let maximum = 0;
  let start = null;
  let count = 0;
  const step = Math.max(1, Math.round(rate * qc.audio.energy_window_s));
  for (let i = 0; i < samples.length; i += step) {
    let power = 0;
    const countBefore = count;
    const end = Math.min(i + step, samples.length);
    for (let j = i; j < end; j++) {
      const sample = samples[j];
      const magnitude = Math.abs(sample);
      maximum = Math.max(maximum, magnitude);
      power += sample * sample;
      if (sample === 32767 || sample === -32768) count++;
      if (magnitude >= floor) start ??= j;
    }
    if (count > countBefore) clipped.push({ start: i / rate, end: end / rate });
    const rms = power / (end - i) / 32768 ** 2;
    bins.push({ start: i / rate, end: end / rate, power: rms });
    if (start !== null && rms < (floor / 32768) ** 2) {
      if (start < i) active.push({ start: start / rate, end: i / rate });
      start = null;
    }
  }
  if (start !== null) active.push({ start: start / rate, end: samples.length / rate });
  // Toạ độ bằng chứng được gộp theo cửa sổ năng lượng, số mẫu clip vẫn đếm chính xác.
  const regions = mergeEvents(clipped, () => 'clip');
  return { clipped_samples: count, clip_regions: regions, active, bins, duration_s: samples.length / rate,
    peak_dbfs: powerDb((maximum / 32768) ** 2), window_s: step / rate };
}

function windowPower(stem, windows) {
  if (!stem) return null;
  let duration = 0;
  let sum = 0;
  for (const window of windows) {
    for (let i = Math.max(0, Math.floor(window.start / stem.window_s)); i < stem.bins.length; i++) {
      const bin = stem.bins[i];
      if (bin.start >= window.end) break;
      const overlap = Math.min(bin.end, window.end) - Math.max(bin.start, window.start);
      if (overlap <= 0) continue;
      duration += overlap;
      sum += overlap * bin.power;
    }
  }
  return duration ? sum / duration : null;
}

function relativeDb(layer, voice, windows) {
  const reference = windowPower(voice, windows);
  return reference > 0 ? powerDb(windowPower(layer, windows) / reference) : null;
}

function pauseStats(gaps, edges) {
  const values = gaps.map(({ length }) => length).sort((a, b) => a - b);
  const n = values.length;
  const mean = n ? values.reduce((sum, value) => sum + value, 0) / n : null;
  const histogram = edges.map((min, i) => ({ min, max: edges[i + 1] ?? null,
    count: values.filter((value) => value >= min && (edges[i + 1] == null || value < edges[i + 1])).length }));
  return { n, min: values[0] ?? null, median: n ? median(values) : null, max: values.at(-1) ?? null,
    stdev: n ? Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / n) : null, histogram };
}

export function auditAudio({ pcm, sheet, plan, lines, log, voice, design, prosody, fps, mixReport, scenes = [], cues: voiceCues = [] }) {
  const findings = [];
  const add = (...args) => findings.push(finding(...args));
  const limits = qc.audio;
  const missing = [];
  const windows = voice?.voiced_intervals;
  const pauses = voice ? pauseStats(voice.silences, prosody.metrics?.pause_histogram_edges_s ?? limits.pause_histogram_edges_s) : null;
  const planById = new Map((plan?.lines ?? []).map((line) => [line.line_id, line]));
  const planned = [];
  const deviations = [];
  const sorted = [...lines].sort((a, b) => a.start - b.start);
  const cueById = new Map(voiceCues.map((cue) => [cue.line_id, cue]));
  const boundary = (t, side) => windows?.find((w) => Math.abs(w[side] - t) <= limits.pause_tolerance_s)?.[side];
  const candidates = sorted.map((line, i) => [sorted[i - 1], line])
    .concat(sorted.length ? [[sorted.at(-1), null]] : []);
  const overlaps = [];
  for (const [source, entries] of [['voice-timeline.json', sorted], ['cues.json', voiceCues]]) {
    let latest = null;
    for (const line of [...entries].sort((a, b) => a.start - b.start)) {
      if (latest && timeOverlap(latest, line)) {
        const overlap = { start: line.start, end: Math.min(latest.end, line.end), scene: line.scene_id, source };
        overlaps.push(overlap);
        add('voice_overlap', errorLevel, 'Hai cửa sổ lời giao nhau trong ' + source + '.', overlap);
      }
      if (!latest || line.end > latest.end) latest = line;
    }
  }
  for (const [previous, next] of candidates) {
    const left = planById.get(previous?.line_id);
    const right = planById.get(next?.line_id);
    if (!left && !right) continue;

    const expected = Math.max(left?.pause_after_s ?? 0, right?.pause_before_s ?? 0);
    const from = previous?.end ?? 0;
    const to = next?.start ?? pcm.voice?.duration_s;
    if (expected > 0 && Number.isFinite(to) && to >= from)
      planned.push({ start: from - limits.pause_tolerance_s, end: from + expected + limits.pause_tolerance_s });
    const actualFrom = previous ? boundary(cueById.get(previous.line_id)?.end ?? from, 'end') : 0;
    const actualTo = next ? boundary(cueById.get(next.line_id)?.start ?? to, 'start') : pcm.voice?.duration_s;
    const actual = Number.isFinite(actualFrom) && Number.isFinite(actualTo) ? Math.max(0, actualTo - actualFrom) : null;
    const intentRanges = [
      left && { intent: left.intent, side: 'after', range: left.pause_limits?.after ?? prosody.intents[left.intent]?.pause_after_range_s },
      right && { intent: right.intent, side: 'before', range: right.pause_limits?.before ?? prosody.intents[right.intent]?.pause_before_range_s },
    ].filter((entry) => entry?.range);
    const delta = actual === null ? null : actual - expected;
    const result = { previous: previous?.line_id ?? null, next: next?.line_id ?? null, expected_s: expected,
      actual_s: actual, delta_s: delta, intent_ranges: intentRanges.map((entry) => ({
        ...entry, ok: actual === null ? null : actual >= entry.range[0] - limits.pause_tolerance_s &&
          actual <= entry.range[1] + limits.pause_tolerance_s,
      })) };
    deviations.push(result);
    if (delta !== null && distance(actual, expected) > limits.pause_tolerance_s)
      add('pause_plan_deviation', warning, 'Khoảng nghỉ lệch kế hoạch ' + delta.toFixed(2) + ' s.',
        { start: actualFrom, end: actualTo });
    if (result.intent_ranges.some(({ ok }) => ok === false))
      add('pause_intent_range', 'thông tin', 'Khoảng nghỉ chung nằm ngoài khoảng tham chiếu của ít nhất một ý định.',
        { start: actualFrom, end: actualTo });
  }
  if (!voice) missing.push('Thiếu số đo khoảng nghỉ trên stem giọng.');
  if (!sheet) missing.push('Thiếu sound-cues.json.');
  if (!lines.length || !plan) missing.push('Thiếu voice-timeline.json hoặc prosody-plan.json để đối chiếu khoảng nghỉ.');
  if (deviations.some(({ actual_s }) => actual_s === null)) missing.push('Có biên kế hoạch chưa ghép được với tiếng đo trên stem.');
  if (!mixReport) missing.push('Thiếu mix-report.json để đối chiếu.');
  if (!log) missing.push('Thiếu render-log.json để đối chiếu cue.');
  if (pauses?.n >= limits.flat_pause_min_n && pauses.stdev <= limits.flat_pause_stdev_s)
    add('pause_low_variation', 'thông tin', 'Độ lệch chuẩn khoảng nghỉ thấp trên ' + pauses.n + ' khoảng đo.');
  for (const gap of voice?.silences ?? []) {
    const head = gap.start <= EPSILON;
    const tail = gap.end + EPSILON >= pcm.voice?.duration_s;
    if (head && gap.length > limits.head_s) add('audio_head_silence', warning, 'Khoảng lặng đầu vượt ngưỡng.', gap);
    if (tail && gap.length > limits.tail_s) add('audio_tail_silence', warning, 'Khoảng lặng cuối vượt ngưỡng.', gap);
    if (head || tail || !sheet || !plan || !lines.length || gap.length < limits.unplanned_silence_s) continue;
    if (intervalCoverage([...(sheet.silences ?? []), ...planned].map(({ start, end }) => ({
      start: start - gap.start, end: end - gap.start,
    })), gap.length) * gap.length / 100 < gap.length - limits.pause_tolerance_s)
      add('unplanned_silence', warning, 'Khoảng lặng dài ngoài kế hoạch.', gap);
  }
  const layers = {};
  for (const name of ['mix', 'voice', 'music', 'sfx', 'impact']) {
    const entry = pcm[name];
    if (!entry) {
      if (!(name === 'music' && sheet?.layers?.music?.enabled === false)) missing.push('Thiếu số đo PCM ' + name + '.');
      continue;
    }
    const { bins, active, ...stats } = entry;
    layers[name] = stats;
    if (entry.clipped_samples) {
      const span = { start: entry.clip_regions[0].start, end: entry.clip_regions.at(-1).end };
      add('pcm_clipping', errorLevel, name + ' có ' + entry.clipped_samples + ' mẫu chạm 0 dBFS.', span);
    }
  }
  const mixLufs = pcm.mix?.lufs;
  if (Number.isFinite(mixLufs) && (mixLufs < qc.final_audio.lufs_min || mixLufs > qc.final_audio.lufs_max))
    add('mix_lufs', warning, 'LUFS mix ngoài khoảng mục tiêu.');
  if (pcm.mix && !Number.isFinite(mixLufs)) missing.push('Thiếu LUFS mix.');
  const truePeak = pcm.mix?.true_peak_dbtp;
  if (Number.isFinite(truePeak) && truePeak > qc.final_audio.true_peak_max_dbtp)
    add('mix_true_peak', errorLevel, 'True peak mix vượt ngưỡng.');
  if (pcm.mix && !Number.isFinite(truePeak)) missing.push('Thiếu phép đo true peak mix.');
  const settings = design.layers;
  const target = sheet?.layers?.voice?.target_lufs ?? settings.voice.target_lufs;
  if (Number.isFinite(pcm.voice?.lufs) && distance(pcm.voice.lufs, target) > limits.voice_lufs_tolerance)
    add('voice_lufs', warning, 'LUFS stem giọng lệch mục tiêu.');
  if (pcm.voice && !Number.isFinite(pcm.voice.lufs)) missing.push('Thiếu LUFS stem giọng.');
  const music = pcm.music;
  const enabled = sheet?.layers?.music?.enabled;
  let ducking = null;
  if (enabled === false && music?.peak_dbfs !== null && music)
    add('music_should_be_silent', warning, 'Cue sheet tắt nhạc nhưng stem nhạc có mẫu khác 0.');
  if (music && windows?.length) {
    const outside = speechIntervals(windows, music.duration_s);
    const insideDb = powerDb(windowPower(music, windows));
    const outsideDb = powerDb(windowPower(music, outside));
    ducking = { music_in_voice_db: insideDb, music_outside_voice_db: outsideDb,
      delta_db: insideDb === null || outsideDb === null ? null : outsideDb - insideDb };
    for (const window of windows) {
      const rel = relativeDb(music, pcm.voice, [window]);
      if (rel !== null && rel > -settings.music.min_voice_margin_db)
        add('music_voice_margin', warning, 'Nhạc trong cửa sổ lời vượt mức tương đối cho phép.', window);
    }
  }
  if (enabled === true && music) {
    if (!windows?.length) missing.push('Thiếu cửa sổ tiếng giọng để kiểm trần nhạc nền.');
    const end = music.duration_s;
    const width = Math.min(settings.music.fade_out_s, end);
    const first = powerDb(windowPower(music, [{ start: end - width, end: end - width * (1 - limits.fade_tail_fraction) }]));
    const final = powerDb(windowPower(music, [{ start: end - width * limits.fade_tail_fraction, end }]));
    if (first === null) {
      missing.push('Đầu cửa sổ fade-out đã lặng, thiếu tín hiệu để đo độ giảm mức cuối nhạc.');
    } else if (final !== null && first - final < limits.fade_min_drop_db) {
      add('music_fade_out', warning, 'Độ giảm mức cuối stem nhạc thấp hơn ngưỡng.', { start: end - width, end });
    }
    if (ducking) Object.assign(ducking, { fade_start_db: first, fade_end_db: final });
  }

  for (const layer of ['sfx', 'impact']) {
    if (!pcm[layer] || !windows) continue;
    for (const active of pcm[layer].active) {
      const intersections = windows.filter((window) => timeOverlap(window, active))
        .map((window) => ({ start: Math.max(window.start, active.start), end: Math.min(window.end, active.end) }));
      const rel = relativeDb(pcm[layer], pcm.voice, intersections);
      if (rel !== null && rel > settings.sfx.under_voice_max_rel_db)
        add('effect_voice_overlap', warning, layer + ' vượt mức tương đối khi đang có lời.', active);
    }
  }
  const cues = [...(sheet?.cues ?? [])].sort((a, b) => a.t - b.t);
  const sfxCount = cues.filter(({ layer }) => layer === 'sfx').length;
  const densityCap = sheet?.layers?.sfx?.max_per_min;
  if (Number.isFinite(sheet?.duration_s) && Number.isFinite(densityCap) &&
    sfxCount > Math.floor(sheet.duration_s * densityCap / design.derive.density_window_s)) {
    add('sfx_total_density', warning, 'Tổng SFX vượt mật độ của cue sheet theo thời lượng video.');
  }
  const lastEffect = new Map();
  const cueEvents = log?.events.filter(({ cue }) => cue?.intent) ?? [];
  const cueRows = [];
  const recent = [];
  let impacts = 0;
  for (const cue of cues) {
    const at = { start: cue.t, end: cue.t + (cue.dur_s ?? 0), scene: cue.scene_id };
    const anchor = pcm[cue.layer]?.active.filter(({ start }) => distance(start, cue.t) <= limits.onset_window_s)
      .sort((a, b) => distance(a.start, cue.t) - distance(b.start, cue.t))[0];
    const onset_delta_s = anchor ? anchor.start - cue.t : null;
    const onset_ok = pcm[cue.layer] && fps > 0 ?
      onset_delta_s !== null && Math.abs(onset_delta_s) <= limits.onset_tol_frames / fps + EPSILON : null;
    if (onset_ok === false) add('cue_onset', warning, 'Onset stem lệch cue ' + cue.id + ' hơn dung sai hoặc thiếu tín hiệu gần cue.', at);
    const ref = cue.source?.kind === 'render_log' && /^events#(\d+)$/.exec(cue.source.ref);
    const indicated = ref ? log?.events[Number(ref[1]) - 1] : null;
    const exact = indicated?.scene === cue.scene_id && indicated?.cue?.intent === cue.intent ? indicated : null;
    const related = exact ?? cueEvents.filter((event) => event.scene === cue.scene_id && event.cue.intent === cue.intent &&
      (cue.source?.kind === 'render_log' || distance(event.start, cue.t) <= limits.cue_sync_tol_s))
      .sort((a, b) => distance(a.start, cue.t) - distance(b.start, cue.t))[0];
    const visual_delta_s = related ? related.start - cue.t : null;
    const sceneCut = cue.source?.kind === 'scene_cut' && cue.intent === 'transition' ?
      scenes.find(({ id }) => id === cue.scene_id) : null;
    const visualDelta = visual_delta_s ?? (sceneCut ? sceneCut.start - cue.t : null);
    const visual_ok = log || sceneCut ? visualDelta !== null && Math.abs(visualDelta) <= limits.cue_sync_tol_s : null;
    if (visual_ok === false) add(related || sceneCut ? 'cue_visual_sync' : 'cue_unattached', warning,
      related || sceneCut ? 'Cue ' + cue.id + ' lệch mốc sự kiện hình liên quan.' : 'Cue ' + cue.id + ' có tiếng không gắn hình.', at);
    cueRows.push({ id: cue.id, layer: cue.layer, t: cue.t, onset_delta_s, onset_ok, visual_delta_s: visualDelta, visual_ok });
    if (cue.layer === 'impact') {
      if (++impacts > sheet.layers?.impact?.max_per_video)
        add('impact_density', warning, 'Số impact vượt giới hạn của cue sheet.', at);
    } else if (cue.layer === 'sfx') {
      recent.push(cue.t);
      while (cue.t - recent[0] >= design.derive.density_window_s) recent.shift();
      if (recent.length > sheet.layers?.sfx?.max_per_min)
        add('sfx_density', warning, 'Mật độ SFX vượt giới hạn của cue sheet.', at);
    }
    if (lastEffect.has(cue.effect) && cue.t - lastEffect.get(cue.effect) < sheet.layers?.sfx?.min_gap_same_effect_s)
      add('cue_repeat', warning, 'Hiệu ứng lặp sớm hơn giới hạn của cue sheet.', at);
    lastEffect.set(cue.effect, cue.t);
  }
  const comparable = cueRows.filter(({ onset_ok, visual_ok }) => onset_ok !== null && visual_ok !== null);
  const passed = comparable.filter(({ onset_ok, visual_ok }) => onset_ok && visual_ok).length;
  return { ...(missing.length ? pending(missing.join(' ')) : done({})), missing, findings, layers, pauses,
    pause_deviations: deviations, voice_overlaps: overlaps, ducking, cue_rows: cueRows,
    cue_pass_ratio: comparable.length ? passed / comparable.length : null, cue_pass_count: passed,
    cue_comparable_count: comparable.length, cue_total_count: cueRows.length,
    mix_report: mixReport ?? null };
}
