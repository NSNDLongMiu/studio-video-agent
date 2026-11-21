import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
export const rules = read(new URL('./prosody.json', import.meta.url));
const clamp = (value, [min, max]) => Math.max(min, Math.min(max, value));
const position = ([min, max], fraction) => min + (max - min) * fraction;
const round = value => Number(value.toFixed(rules.pause_model.precision_s));
const fold = value => value.normalize('NFC').toLocaleLowerCase('vi');
const words = value => fold(value).match(/[\p{L}\p{M}\p{N}]+/gu)?.join(' ') ?? '';
const contains = (value, phrase) => (' ' + words(value) + ' ').includes(' ' + words(phrase) + ' ');
const prefix = (value, phrase) => (words(value) + ' ').startsWith(words(phrase) + ' ');


function pronounce(args) {
  const cli = fileURLToPath(new URL('./pronounce.mjs', import.meta.url));
  const result = spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
  if (result.error || result.status !== 0) throw new Error(result.error?.message ?? result.stderr.trim());
  return result.stdout;
}

export function scriptInput(file) {
  const extra = path.join(path.dirname(file), 'assets', 'voice', 'pronunciation.local.json');
  const extraArgs = fs.existsSync(extra) ? ['--extra', extra] : [];
  if (path.extname(file) === '.json') {
    const spec = read(file);
    return spec.lines.map(line => ({
      ...line, tts: line.tts ?? line.text_tts ?? pronounce(['apply', '--text=' + line.text,
        ...(spec.pronunciation_extra ? ['--extra', spec.pronunciation_extra] : extraArgs)]),
    }));
  }
  const column = name => JSON.parse(pronounce(['apply', '--file', file, '--column', name, '--json', ...extraArgs]));
  let sceneRecords;
  try { sceneRecords = column('Thời gian'); } catch (error) {
    if (!error.message.includes('Không tìm thấy cột Markdown')) throw error;
    sceneRecords = column('Cảnh');
  }
  const scenes = new Map(sceneRecords.map(({ row, text }) => [row, text.match(/\bS\d+\b/i)?.[0]]));
  let speedRecords;
  try { speedRecords = column('Nhãn tốc độ'); } catch (error) {
    if (!error.message.includes('Không tìm thấy cột Markdown')) throw error;
    speedRecords = [];
  }
  const speeds = new Map(speedRecords.map(({ row, text }) =>
    [row, fold(text).includes('kỹ thuật') ? 'ky_thuat' : 'dan']));
  return column('Lời đọc').map(line => ({ ...line, scene_id: scenes.get(line.row), speed_class: speeds.get(line.row) }));
}

function matches(rule, text, index, count) {
  return rule.position === 'last' ? index === count - 1 :
    rule.position === 'first' ? index < rule.line_count :
    rule.prefixes ? rule.prefixes.some(term => prefix(text, term)) :
    rule.terms ? rule.terms.some(term => contains(text, term)) :
    rule.pattern ? new RegExp(rule.pattern, 'u').test(text) : true;
}

function emphasisFor(line, scene, override, dictionary) {
  const config = rules.emphasis;
  const sources = {
    'semantic_plan.keywords': (scene?.semantic_plan?.keywords ?? []).map(item => item.term ?? item),
    pronunciation: dictionary,
    numbers: line.text.match(new RegExp(config.number_pattern, 'gu')) ?? [],
  };
  const requested = override ?? rules.emphasis_sources.flatMap(key => sources[key] ?? []);
  const selected = [...new Map(requested.filter(phrase => phrase && contains(line.text, phrase))
    .map(phrase => [fold(phrase), phrase])).values()].slice(0, config.max_per_line);
  const addChunk = (text, role = 'normal') => ({
    text, role, pause_before_s: role === 'emphasis' ? position(config.micro_pause_range_s, config.micro_pause_position) : 0,
    tempo: role === 'emphasis' ? round(clamp(line.tempo * config.local_tempo_factor, [rules.tempo.min, rules.tempo.max])) : line.tempo,
  });
  const tts = line.tts;
  const starts = selected.flatMap(phrase => {
    const index = fold(tts).indexOf(fold(phrase));
    if (index < config.min_chunk_chars || !/\s/u.test(tts[index - 1])) return [];
    const rest = tts.slice(index + phrase.length).trim();
    return rest.length >= config.min_chunk_chars && !/^\p{L}/u.test(tts[index + phrase.length] ?? '') ? [index] : [];
  });
  const boundaries = [...new Set([0, ...Array.from(tts.matchAll(new RegExp(config.clause_break_pattern, 'gu')),
    match => match.index + match[0].length), ...starts, tts.length])].sort((a, b) => a - b);
  const clauses = boundaries.slice(1).map((end, index) => tts.slice(boundaries[index], end));
  const marked = new Set();
  const emphasis = selected.map(phrase => {
    const index = clauses.findIndex(clause => contains(clause, phrase));
    const prefixText = clauses.slice(0, index).join('').trim();
    const offset = fold(tts).indexOf(fold(phrase));
    const following = offset < 0 ? '' : tts.slice(offset + phrase.length).trim();
    const realized = index > 0 && prefixText.length >= config.min_chunk_chars &&
      clauses[index].trim().length >= config.min_chunk_chars && following.length >= config.min_chunk_chars;
    if (realized) marked.add(index);
    return { phrase, realized, how: realized ? 'micro_pause+local_tempo' : null,
      reason_if_not: realized ? null : 'Thiếu ranh giới mệnh đề an toàn, cụm sát mép hoặc đoạn TTS quá ngắn.' };
  });
  const chunks = [];
  let normal = '';
  for (const [index, clause] of clauses.entries()) {
    if (!marked.has(index)) {
      normal += clause;
      continue;
    }
    if (normal.trim()) chunks.push(addChunk(normal.trim()));
    normal = '';
    chunks.push(addChunk(clause.trim(), 'emphasis'));
  }
  if (normal.trim()) chunks.push(addChunk(normal.trim()));
  if (chunks.some(chunk => chunk.text.length < config.min_chunk_chars)) {
    for (const item of emphasis.filter(item => item.realized)) {
      Object.assign(item, { realized: false, how: null, reason_if_not: 'Có đoạn nằm giữa hai cụm quá ngắn.' });
    }
    return { emphasis, chunks: [addChunk(tts)] };
  }
  return { emphasis, chunks };
}

export function stats(values) {
  if (!values.length) return { n: 0, min: 0, median: 0, max: 0, stdev: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = sorted.reduce((sum, value) => sum + value, 0) / n;
  return { n, min: sorted[0], median: round((sorted[Math.floor((n - 1) / 2)] + sorted[Math.floor(n / 2)]) / 2),
    max: sorted[n - 1], stdev: round(Math.sqrt(sorted.reduce((sum, value) => sum + (value - mean) ** 2, 0) / n)) };
}

export function planLines(input, storyboard = {}, local = []) {
  const sceneList = storyboard.scenes ?? [];
  const scenes = new Map(sceneList.map(scene => [scene.scene_id ?? scene.id, scene]));
  const directions = new Map(sceneList.flatMap(scene => (scene.voice_direction ?? []).map(item =>
    [item.line_id, { ...item, scene_id: scene.scene_id ?? scene.id }])));
  const localById = new Map(local.map(item => [item.line_id, item]));
  const dictionary = read(new URL('./pronunciation.json', import.meta.url)).entries.flatMap(
    ({ term, aliases = [] }) => [term, ...aliases]);
  const p = rules.pause_model;
  const byIntent = {};
  const seen = new Set();
  const lines = input.map((item, index) => {
    const line_id = String(item.line_id ?? item.id ?? item.label?.match(/^\s*Lời\s+(\d+)/iu)?.[1] ?? index + 1).padStart(2, '0');
    if (seen.has(line_id)) throw new Error('Trùng mã dòng ' + line_id);
    seen.add(line_id);
    const common = directions.get(line_id);
    const own = localById.get(line_id);
    const direction = { ...item, ...common, ...own,
      transition: { ...item.transition, ...common?.transition, ...own?.transition } };
    const scene_id = direction.scene_id ?? 'S' + String(item.row ?? index + 1).padStart(2, '0');
    const scene = scenes.get(scene_id);
    const rule = rules.inference.intents.find(candidate => matches(candidate, item.text, index, input.length));
    const intent = direction.intent ?? rule.intent;
    const defaults = rules.intents[intent];
    if (!defaults) throw new Error('Intent không hợp lệ ở dòng ' + line_id);
    const pace = direction.pace ?? defaults.pace;
    const paceFactor = rules.tempo.pace_factors[pace];
    if (paceFactor === undefined) throw new Error('Pace không hợp lệ ở dòng ' + line_id);
    const base = rules.tempo.speed_classes[item.speed_class] ?? rules.tempo.base;
    const tempo = round(clamp(base * defaults.tempo_factor * paceFactor, [rules.tempo.min, rules.tempo.max]));
    const source = Object.fromEntries(['intent', 'emotion', 'emphasis', 'pace', 'intonation']
      .map(key => [key, direction[key] === undefined ? 'rule:' + (key === 'emphasis' ? 'emphasis-sources' : direction.intent ?? rule.id) : 'override']));
    const line = { line_id, scene_id, text: item.text, tts: item.tts ?? item.text, intent,
      emotion: direction.emotion ?? defaults.emotion, pace, tempo, temperature: defaults.temperature,
      intonation: direction.intonation ?? defaults.intonation, intonation_status: 'advisory',
      transition: { ...direction.transition }, source };
    Object.assign(line, emphasisFor(line, scene, direction.emphasis, dictionary));
    byIntent[intent] = (byIntent[intent] ?? 0) + 1;
    return line;
  });
  const overrides = lines.map((line, index) => ({ ...input[index], ...directions.get(line.line_id), ...localById.get(line.line_id) }));
  for (const [index, line] of lines.entries()) {
    const prev = lines[index - 1];
    const scene = scenes.get(line.scene_id);
    const major = rules.inference.major_scene_transition;
    const role = scene?.role ?? (storyboard.opening?.scene_id === line.scene_id ? 'opening' : scene?.scene_kind);
    const from = line.transition.from_prev ?? prev?.transition.to_next ??
      rules.inference.transitions.find(rule => matches(rule, line.text))?.id ??
      (prev && prev.scene_id !== line.scene_id && major.scene_kinds.includes(role) ? major.id : rules.inference.default_transition);
    line.transition.from_prev = from;
    if (prev) prev.transition.to_next ??= from;
  }
  if (lines.length) lines.at(-1).transition.to_next ??= rules.inference.default_transition;

  for (const [index, line] of lines.entries()) {
    const prev = lines[index - 1];
    const next = lines[index + 1];
    const defaults = rules.intents[line.intent];
    const scene = scenes.get(line.scene_id);
    const info = p.information;
    const weight = Math.min(info.cap_s, Math.max(0, words(line.text).split(' ').length - info.words_free) * info.word_s +
      (line.text.match(new RegExp(rules.emphasis.number_pattern, 'gu'))?.length ?? 0) * info.number_s +
      (scene?.semantic_plan?.keywords ?? []).filter(item => contains(line.text, item.term ?? item)).length * info.concept_s);
    const pairTransition = next?.transition.from_prev ?? line.transition.to_next;
    const transition = p.transition_s[pairTransition];
    if (transition === undefined) throw new Error('Quan hệ chuyển ý không hợp lệ ở dòng ' + line.line_id);
    const boundary = next && next.scene_id !== line.scene_id ? p.scene_boundary_s : 0;
    const after = p.weights.after * position(defaults.pause_after_range_s, p.range_position.after);
    const nextBefore = next ? p.weights.before * position(rules.intents[next.intent].pause_before_range_s, p.range_position.before) : 0;
    const total = after + nextBefore + transition + boundary + weight;
    const currentOverride = overrides[index];
    const beforeRange = defaults.pause_before_range_s;
    const afterRange = defaults.pause_after_range_s;
    const before = currentOverride.pause_before_s ?? (prev ?
      clamp((prev.pause_after_s + position(beforeRange, p.range_position.before)) * p.weights.before, beforeRange) :
      position(beforeRange, p.opening_share));
    const afterPause = currentOverride.pause_after_s ?? (next ?
      clamp(total, afterRange) : Math.min(p.ending_cap_s, position(afterRange, p.range_position.after)));
    for (const value of [before, afterPause]) {
      if (!Number.isFinite(value) || value < 0) throw new Error('Khoảng nghỉ không hợp lệ ở dòng ' + line.line_id);
    }
    line.pause_before_s = round(before);
    line.pause_after_s = round(afterPause);
    line.pause_limits = {
      before: currentOverride.pause_before_s === undefined ? beforeRange : [before, before],
      after: currentOverride.pause_after_s === undefined ? afterRange : [afterPause, afterPause],
    };
    line.source.pause = currentOverride.pause_before_s !== undefined || currentOverride.pause_after_s !== undefined ?
      'override' : 'rule:semantic-pause';
    line.pause_reason = [
      'Trước ' + line.intent + ' = ' + line.pause_before_s + ' s' +
        (currentOverride.pause_before_s !== undefined ? ' (ghi đè)' : ''),
      'sau ' + line.intent + ' +' + round(after), 'trước ' + (next?.intent ?? 'hết lời') + ' +' + round(nextBefore),
      pairTransition + ' +' + transition, 'ranh giới cảnh +' + boundary, 'mật độ thông tin +' + round(weight),
      'kết quả sau kẹp ' + line.pause_after_s + ' s' + (currentOverride.pause_after_s !== undefined ? ' (ghi đè)' : ''),
    ].join(' · ');
  }
  return { version: 1, rules_version: rules.version, engine: rules.engine, lines,
    summary: { pause_s: stats(lines.slice(1).map((line, index) => round(gapAfter(lines[index], line)))), by_intent: byIntent } };
}


export function gapAfter(left, right) {
  return Math.max(left?.pause_after_s ?? 0, right?.pause_before_s ?? 0);
}

export function buildTimeline(plan, measured, scenes = [], mode = 'free') {
  if (!['free', 'fit'].includes(mode)) throw new Error('Chế độ timeline cần là free hoặc fit.');
  const durationRows = measured.lines ?? measured.durations ?? measured.speech_s ?? measured;
  const durationMap = new Map(Array.isArray(durationRows)
    ? durationRows.map((value, index) => [value?.line_id ?? plan.lines[index]?.line_id, value])
    : Object.entries(durationRows));
  const lines = [];
  const overflow = [];
  const speech = line => {
    const record = durationMap.get(line.line_id);
    const value = record?.speech_s ?? record?.duration_s ?? record;
    if (!Number.isFinite(value) || value <= 0) throw new Error('Thiếu thời lượng lời dòng ' + line.line_id);
    return value;
  };
  let cursor = 0;
  function place(group, start, gaps, durations, tempoRatio = 1, tempoLimit = tempoRatio) {
    let onset = start + gaps[0];
    for (const [index, line] of group.entries()) {
      const end = onset + durations[index];
      lines.push({ line_id: line.line_id, scene_id: line.scene_id, start: round(onset), end: round(end),
        speech_s: round(durations[index]), pause_before_s: round(gaps[index]), pause_after_s: round(gaps[index + 1]),
        ...(tempoRatio === 1 ? {} : { tempo_ratio: tempoRatio, tempo_ratio_max: tempoLimit }) });
      onset = end + gaps[index + 1];
    }
    return onset;
  }
  function intervals(group) {
    return Array.from({ length: group.length + 1 }, (_, index) => {
      const left = group[index - 1];
      const right = group[index];
      const limits = (line, key) => line ? line.pause_limits?.[key] ??
        rules.intents[line.intent]?.['pause_' + key + '_range_s'] ??
        Array(2).fill(line['pause_' + key + '_s'] ?? 0) : [0, 0];
      const a = limits(left, 'after');
      const b = limits(right, 'before');
      const padding = ((left ? rules.audio.tail_ms : 0) + (right ? rules.audio.lead_ms : 0)) / 1000;
      return { min: Math.max(padding, a[0], b[0]), max: Math.max(padding, a[1], b[1]),
        target: Math.max(padding, gapAfter(left, right)) };
    });
  }
  const sum = values => values.reduce((total, value) => total + value, 0);
  if (mode === 'free') {
    if (plan.lines.length) cursor = place(plan.lines, 0, intervals(plan.lines).map(gap => gap.target), plan.lines.map(speech));
  } else {
    const ids = new Set();
    for (const scene of scenes) {
      if (ids.has(scene.id) || !Number.isFinite(scene.start) || !Number.isFinite(scene.end) ||
        scene.start < cursor || scene.end <= scene.start) throw new Error('Cửa sổ cảnh không hợp lệ: ' + scene.id);
      ids.add(scene.id);
      cursor = scene.end;
      const group = plan.lines.filter(line => line.scene_id === scene.id);
      if (!group.length) continue;
      const hold = scene.hold_after_voice_s ?? 0;
      if (!Number.isFinite(hold) || hold < 0) throw new Error('Thời gian giữ hình không hợp lệ: ' + scene.id);
      const ranges = intervals(group);
      const tail = ranges.at(-1);
      for (const key of ['min', 'max', 'target']) tail[key] = Math.max(hold, tail[key]);
      const minimum = ranges.map(gap => gap.min);
      const target = ranges.map(gap => gap.target);
      const maximum = ranges.map(gap => gap.max);
      let durations = group.map(speech);
      let budget = scene.end - scene.start - sum(durations);
      let ratio = 1;
      let limit = 1;
      const need = sum(minimum) - budget;
      if (need > rules.fit.epsilon_s) {
        const available = scene.end - scene.start - sum(minimum);
        limit = Math.min(...group.map(line => {
          const record = durationMap.get(line.line_id);
          const base = record?.tempo ?? line.tempo ?? rules.tempo.base;
          const chunks = record?.chunks ?? (record?.tempo === undefined ? line.chunks : []) ?? [];
          const fastest = Math.max(base, ...chunks.map(chunk => chunk.tempo ?? base));
          return rules.fit.max_tempo / fastest;
        }));
        if (available <= 0 || sum(durations) / available > limit) {
          overflow.push({ scene_id: scene.id, need_s: round(need), action: 'error' });
          continue;
        }
        ratio = sum(durations) / available;
        durations = durations.map(value => value / ratio);
        budget = sum(minimum);
        overflow.push({ scene_id: scene.id, need_s: round(need), action: 'tempo_up' });
      } else if (sum(target) - budget > rules.fit.epsilon_s) {
        overflow.push({ scene_id: scene.id, need_s: round(sum(target) - budget), action: 'shrink_pause' });
      }
      const [low, high] = budget < sum(target) ? [minimum, target] : [target, maximum];
      const span = sum(high) - sum(low);
      const fraction = span > 0 ? clamp((budget - sum(low)) / span, [0, 1]) : 0;
      place(group, scene.start, low.map((value, index) => position([value, high[index]], fraction)), durations, ratio, limit);
    }
    const missing = plan.lines.find(line => !ids.has(line.scene_id));
    if (missing) throw new Error('Thiếu cửa sổ cảnh ' + missing.scene_id);
  }
  return { version: 1, mode, total_s: round(cursor), lines, overflow };
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    if (!args[index].startsWith('--') || !args[index + 1]) throw new Error('Tuỳ chọn cần có giá trị.');
    options[args[index].slice(2)] = args[index + 1];
  }
  let value;
  switch (command) {
    case 'capabilities':
      value = rules.engine;
      break;
    case 'plan': {
      const script = options.script;
      if (!script) throw new Error('Cần --script.');
      const conventionalLocal = path.join(path.dirname(script), 'assets', 'voice', 'prosody.local.json');
      const localPath = options.local ?? (fs.existsSync(conventionalLocal) ? conventionalLocal : null);
      const local = localPath ? read(localPath) : [];
      value = planLines(scriptInput(script), options.storyboard ? read(options.storyboard) : {},
        local.voice_direction ?? local);
      break;
    }
    case 'explain': {
      const line = read(options.plan).lines.find(line => line.line_id === options.line);
      if (!line) throw new Error('Không tìm thấy dòng ' + options.line);
      value = line;
      break;
    }
    case 'timeline':
      if (!options.out) throw new Error('Cần --out.');
      value = buildTimeline(read(options.plan), read(options.durations), options.scenes ? read(options.scenes) : [], options.mode);
      break;
    default:
      throw new Error('Chọn capabilities, plan, explain hoặc timeline.');
  }
  const json = JSON.stringify(value, null, 2) + '\n';
  if (options.out) fs.writeFileSync(options.out, json, 'utf8');
  else process.stdout.write(json);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error('Lỗi lập kế hoạch giọng đọc. ' + error.message);
    process.exitCode = 1;
  }
}

