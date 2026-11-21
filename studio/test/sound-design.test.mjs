import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const config = json(join(root, 'tools/audio/sound-design.json'));
const rate = config.sample_rate;

function json(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), 'studio-audio-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function run(script, ...args) {
  const result = spawnSync('python', ['-X', 'utf8', join(root, 'tools/audio', script), ...args],
    { cwd: root, encoding: 'utf8' });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
}

function wavFixture(path, duration, starts, amplitude = 5100, transient = false) {
  const count = rate * duration;
  const wav = Buffer.alloc(44 + count * 2);
  wav.write('RIFF', 0);
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(rate, 24);
  wav.writeUInt32LE(rate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(count * 2, 40);
  for (const start of starts) {
    for (let index = 0; index < rate; index++) {
      const fade = Math.min(1, index / 1200, (rate - index - 1) / 1200);
      const value = Math.round(amplitude * fade * Math.sin(2 * Math.PI * 220 * index / rate));
      wav.writeInt16LE(value, 44 + (start * rate + index) * 2);
    }
  }
  if (transient) {
    for (const start of starts) {
      wav.writeInt16LE(29000, 44 + (start * rate + rate / 2) * 2);
    }
  }
  writeFileSync(path, wav);
}

function samples(path) {
  const wav = readFileSync(path);
  assert.equal(wav.toString('ascii', 0, 4), 'RIFF');
  assert.equal(wav.readUInt16LE(22), 1);
  assert.equal(wav.readUInt32LE(24), rate);
  assert.equal(wav.readUInt16LE(34), 16);
  assert.equal(wav.toString('ascii', 36, 40), 'data');
  return Array.from({ length: wav.readUInt32LE(40) / 2 }, (_, i) => wav.readInt16LE(44 + i * 2));
}

function hash(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function writeJson(path, value) {
  writeFileSync(path, JSON.stringify(value));
}

function cue(t, intent, duration_s) {
  return { t, intent, duration_s, intensity: 'medium', reason: 'Mốc kiểm thử' };
}

test('SFX đủ biến thể, đúng byte thư viện, peak an toàn và hai đầu về 0', t => {
  const dir = fixture(t);
  const a = join(dir, 'a');
  const b = join(dir, 'b');
  run('sfx_synth.py', '--out', a);
  run('sfx_synth.py', '--out', b);
  const { effects } = json(join(a, 'manifest.json'));
  const families = new Map();
  for (const effect of effects) {
    const file = effect.id + '.wav';
    const signal = samples(join(a, file));
    const peak = Math.max(...signal.map(Math.abs));
    assert.ok(peak > 0 && 20 * Math.log10(peak / 32768) <= -1);
    assert.equal(signal[0], 0);
    assert.equal(signal.at(-1), 0);
    assert.equal(hash(join(a, file)), hash(join(b, file)));
    assert.equal(hash(join(a, file)), hash(join(root, effect.file)));
    const hashes = families.get(effect.family) ?? new Set();
    hashes.add(hash(join(a, file)));
    families.set(effect.family, hashes);
  }
  assert.equal(families.size, 9);
  assert.ok([...families.values()].every(variants => variants.size >= 3));
});

test('Nhạc hai mood xác định, đúng thời lượng và không clip', t => {
  const dir = fixture(t);
  for (const mood of Object.keys(config.music_moods)) {
    const first = join(dir, mood + '.wav');
    const second = join(dir, mood + '-repeat.wav');
    for (const out of [first, second]) {
      run('music_synth.py', '--seed', 'studio-test', '--mood', mood, '--duration', '2.125', '--out', out);
    }
    const signal = samples(first);
    assert.equal(signal.length, rate * 2.125);
    assert.ok(signal.some(value => value !== 0));
    assert.ok(signal.every(value => Math.abs(value) < 32767));
    assert.equal(hash(first), hash(second));
    assert.equal(json(first.replace(/\.wav$/, '.json')).seed, 'studio-test');
  }
});

test('Cue áp mốc cảnh, ưu tiên, mật độ, biến thể, khoảng lặng và snap', t => {
  const dir = fixture(t);
  mkdirSync(join(dir, 'assets'));
  const effects = [
    cue(1, 'ui_appear', 0.1), cue(2, 'ui_appear'), cue(3, 'silence', 0.6), cue(3.2, 'alert'),
    cue(4, 'highlight', 0.1), cue(5, 'interaction'), cue(6, 'data_move'), cue(7, 'alert'),
    cue(8, 'transition'), cue(9, 'impact_hook'), cue(16, 'ui_appear'),
  ];
  writeJson(join(dir, 'storyboard.json'), { video_id: 'TEST', scenes: [
    { scene_id: 'S1', sound_cues: effects }, { scene_id: 'S2' },
  ] });
  writeJson(join(dir, 'assets/scenes.json'), [
    { id: 'S0', start: 0, end: 10 },
    { id: 'S1', start: 10, end: 35, voice: [{ start: 13.95, end: 14.125 }, { start: 14.9, end: 15.8 }] },
    { id: 'S2', start: 35, end: 60 },
  ]);
  writeJson(join(dir, 'assets/render-log.json'), { events: [
    { kind: 'component', scene: 'S1', start: 11.5, end: 11.9, cue: { intent: 'alert', weight: 'high' } },
    { kind: 'component', scene: 'S2', start: 40, end: 41, cue: { intent: 'highlight', weight: 'medium' } },
    { kind: 'component', scene: 'S2', start: 45, end: 46, cue: { intent: 'highlight', weight: 'low' } },
    { kind: 'component', scene: 'S2', start: 54, end: 55, cue: { intent: 'interaction', weight: 'high' } },
  ] });
  run('cuesheet.py', 'build', '--ep', dir);
  const sheet = json(join(dir, 'assets/sound-cues.json'));
  const pops = sheet.cues.filter(item => item.effect === 'ui_pop');
  assert.deepEqual(pops.map(item => item.t), [11, 26]);
  assert.notEqual(pops[0].variant, pops[1].variant);
  assert.equal(pops[0].source.kind, 'storyboard.sound_cues');
  assert.ok(sheet.cues.some(item => item.t === 54 && item.source.kind === 'render_log'));
  const snapped = sheet.cues.find(item => item.scene_id === 'S1' && item.intent === 'highlight');
  assert.equal(snapped.t, 14.125);
  assert.equal(snapped.mix.snapped, true);
  assert.equal(snapped.mix.voice_rel_db, null);
  assert.equal(sheet.cues.find(item => item.t === 15).mix.voice_rel_db, config.layers.sfx.under_voice_max_rel_db);
  assert.ok(sheet.cues.filter(item => item.layer === 'sfx').length <= config.layers.sfx.max_per_min);
  for (const reason of ['mật độ', 'lặp hiệu ứng', 'khoảng lặng']) {
    assert.ok(sheet.dropped.some(item => item.why.includes(reason)), reason);
  }
  assert.equal(sheet.silences[0].start, 13);
  assert.equal(sheet.layers.music.enabled, false);
  assert.ok(sheet.warnings.some(item => item.includes('voice-timeline')));
  assert.match(readFileSync(join(dir, 'assets/sound-cues.md'), 'utf8'), /00:11\.00/);
});

test('Cue sheet chịu được tập thiếu toàn bộ nguồn', t => {
  const dir = fixture(t);
  run('cuesheet.py', 'build', '--ep', dir);
  const sheet = json(join(dir, 'assets/sound-cues.json'));
  assert.deepEqual(sheet.cues, []);
  assert.equal(sheet.duration_s, 0);
  assert.equal(sheet.warnings.length, 5);
});

test('Mixer giữ nguyên biên giọng, đặt SFX theo mẫu, đo ducking và true peak', t => {
  const dir = fixture(t);
  const voice = join(dir, 'voice.wav');
  const duration = 12;
  const starts = [3, 7];
  const onset = 1 + 17 / rate;
  wavFixture(voice, duration, starts);
  mkdirSync(join(dir, 'assets'));
  writeJson(join(dir, 'storyboard.json'), { video_id: 'MIX-TEST', scenes: [
    { scene_id: 'S1', sound_cues: [cue(onset, 'interaction'), cue(3.4, 'impact_risk')] },
  ] });
  writeJson(join(dir, 'assets/scenes.json'), [
    { id: 'S1', start: 0, end: duration, role: 'body',
      voice: starts.map(start => ({ start: start - 0.05, end: start + 1.15 })) },
  ]);
  run('cuesheet.py', 'build', '--ep', dir);
  const output = join(dir, 'on');
  run('mix.py', '--ep', dir, '--voice', voice, '--music', 'on', '--out-dir', output);
  const report = json(join(output, 'mix-report.json'));
  const effects = samples(join(output, 'stems/sfx.wav'));
  const first = effects.findIndex(value => value !== 0);
  const library = samples(join(root, 'library/sfx/click_01.wav'));
  assert.ok(first >= Math.round(onset * rate));
  assert.ok(first - Math.round(onset * rate) <= Math.ceil(rate / 30));
  const cueGain = 10 ** (config.intents.interaction.gain_db_by_intensity.medium / 20);
  const libraryOnset = library.findIndex(value => Math.round(value * cueGain) !== 0);
  assert.equal(first - libraryOnset, Math.round(onset * rate));
  assert.ok(report.ducking.delta_db <= config.layers.music.duck_depth_db + 2, JSON.stringify(report.ducking));
  assert.ok(report.stems.voice.lufs >= config.layers.voice.target_lufs - 0.3);
  assert.ok(report.true_peak_headroom_db >= config.final.true_peak_margin_db / 2);
  assert.equal(report.clipped_samples, 0);
  assert.ok(!report.warnings.some(item => item.includes('R23')));
  const stem = samples(join(output, 'stems/voice.wav'));
  const source = samples(voice);
  assert.equal(stem.length, source.length);
  for (const start of starts) {
    const left = (start - 0.05) * rate;
    const right = (start + 1.15) * rate;
    const slice = (signal) => signal.slice(Math.round(left), Math.round(right));
    assert.ok(Math.abs(slice(stem).findIndex(Boolean) - slice(source).findIndex(Boolean)) <= 6);
    assert.ok(Math.abs(slice(stem).reverse().findIndex(Boolean) - slice(source).reverse().findIndex(Boolean)) <= 6);
  }
  const quieterVoice = join(dir, 'voice-quieter.wav');
  const quieterConfig = join(dir, 'config-quieter.json');
  wavFixture(quieterVoice, duration, starts, 5100 / Math.sqrt(10));
  const quieter = structuredClone(config);
  quieter.layers.voice.target_lufs -= 10;
  writeJson(quieterConfig, quieter);
  const quietOutput = join(dir, 'quiet-on');
  run('mix.py', '--ep', dir, '--voice', quieterVoice, '--music', 'on',
    '--config', quieterConfig, '--out-dir', quietOutput);
  const quietReport = json(join(quietOutput, 'mix-report.json'));
  assert.ok(Math.abs(report.voice.window_lufs - quietReport.voice.window_lufs - 10) <= 0.3);
  for (const measured of [report, quietReport]) {
    const music = measured.music;
    assert.equal(music.bed_target_rel_voice_db, config.layers.music.bed_rel_voice_db);
    assert.ok(Number.isFinite(music.bed_measured_rel_voice_db));
    assert.ok(Math.abs(music.bed_measured_rel_voice_db - music.bed_target_rel_voice_db) <= 2,
      JSON.stringify(music));
    assert.ok(Number.isFinite(music.in_voice_rel_voice_db));
    assert.ok(music.in_voice_rel_voice_db <= -config.layers.music.min_voice_margin_db, JSON.stringify(music));
    assert.ok(measured.true_peak_dbtp <= config.final.true_peak_dbtp);
    assert.equal(measured.clipped_samples, 0);
  }
  const off = join(dir, 'off');
  run('mix.py', '--ep', dir, '--voice', voice, '--out-dir', off);
  assert.ok(samples(join(off, 'stems/music.wav')).every(value => value === 0));
  for (const layer of ['voice', 'sfx', 'impact']) {
    assert.equal(hash(join(off, 'stems', layer + '.wav')), hash(join(output, 'stems', layer + '.wav')));
  }
  t.diagnostic(JSON.stringify({ voice_lufs: [report.voice.window_lufs, quietReport.voice.window_lufs],
    music: [report.music, quietReport.music], lufs: report.integrated_lufs, tp: report.true_peak_dbtp,
    clips: report.clipped_samples, duck_db: report.ducking.delta_db, placement_error_samples: first - libraryOnset - Math.round(onset * rate) }));
});

test('Limiter đưa giọng crest cao về LUFS đích, giữ biên và cho kết quả xác định', t => {
  const dir = fixture(t);
  const voice = join(dir, 'voice.wav');
  const starts = [1, 3];
  const duration = 5;
  const windows = starts.map(start => ({ start: start - 0.05, end: start + 1.15 }));
  wavFixture(voice, duration, starts, 5100, true);
  mkdirSync(join(dir, 'assets'));
  writeJson(join(dir, 'assets/scenes.json'), [
    { id: 'S1', start: 0, end: duration, role: 'body', voice: windows },
  ]);
  run('cuesheet.py', 'build', '--ep', dir);
  const source = samples(voice);
  const settings = config.layers.voice;
  const out = join(dir, 'first');
  const repeat = join(dir, 'repeat');
  for (const output of [out, repeat]) {
    run('mix.py', '--ep', dir, '--voice', voice, '--music', 'off', '--out-dir', output);
  }
  const report = json(join(out, 'mix-report.json'));
  const limiter = report.voice.limiter;
  assert.equal(report.true_peak_ceiling_dbtp, config.final.true_peak_dbtp);
  assert.ok(report.true_peak_headroom_db >= config.final.true_peak_margin_db / 2);
  assert.ok(report.true_peak_dbtp <= report.true_peak_ceiling_dbtp - config.final.true_peak_margin_db / 2);
  assert.equal(report.clipped_samples, 0);
  assert.ok(limiter.crest_before_db >= 18);
  assert.ok(limiter.crest_after_db < limiter.crest_before_db);
  assert.ok(limiter.max_gain_reduction_db > 0);
  assert.ok(limiter.max_gain_reduction_db <= settings.limiter.max_gain_reduction_db);
  assert.ok(limiter.limited_percent > 0 && limiter.limited_percent < 100);
  assert.ok(Math.abs(report.stems.voice.lufs - settings.target_lufs) <= settings.target_tolerance_lu,
    JSON.stringify(report.voice));
  assert.ok(report.stems.voice.peak_dbfs <= settings.limiter.ceiling_dbfs);
  assert.ok(!report.warnings.some(item => item.includes('R23')));
  for (const name of ['mix.wav', 'stems/voice.wav', 'mix-report.json']) {
    assert.equal(hash(join(out, name)), hash(join(repeat, name)), name);
  }
  const stem = samples(join(out, 'stems/voice.wav'));
  assert.equal(stem.length, source.length);
  for (const { start, end } of windows) {
    const slice = signal => signal.slice(Math.round(start * rate), Math.round(end * rate));
    for (const edge of [signal => signal.findIndex(Boolean), signal => signal.findLastIndex(Boolean)]) {
      assert.equal(edge(slice(stem)), edge(slice(source)));
    }
  }
  const capped = structuredClone(config);
  capped.layers.voice.limiter.max_gain_reduction_db = 1;
  const cappedConfig = join(dir, 'config-capped.json');
  const cappedOut = join(dir, 'capped');
  writeJson(cappedConfig, capped);
  run('mix.py', '--ep', dir, '--voice', voice, '--out-dir', cappedOut, '--config', cappedConfig);
  const cappedReport = json(join(cappedOut, 'mix-report.json'));
  assert.ok(cappedReport.voice.limiter.max_gain_reduction_db <= capped.layers.voice.limiter.max_gain_reduction_db);
  assert.ok(cappedReport.stems.voice.lufs < settings.target_lufs - settings.target_tolerance_lu);
  assert.ok(cappedReport.stems.voice.peak_dbfs <= settings.limiter.ceiling_dbfs);
  assert.ok(cappedReport.warnings.some(item => item.includes('Stem giọng') && item.includes('lệch mục tiêu')));
  t.diagnostic(JSON.stringify({ voice_lufs: report.stems.voice.lufs, limiter,
    headroom_db: report.true_peak_headroom_db, capped_lufs: cappedReport.stems.voice.lufs }));
});
