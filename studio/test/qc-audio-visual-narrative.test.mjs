import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  analyzeVoiceEdges, auditAudio, auditNarrative, auditVisual, checkOpening,
  D8_LIMITS, pcmEvidence, PIPELINE, validateRenderLog,
} from '../../tools/scene-metrics.mjs';
import design from '../../tools/audio/sound-design.json' with { type: 'json' };
import prosody from '../../tools/voice/prosody.json' with { type: 'json' };

const rate = 48000;
const log = (events) => validateRenderLog({ version: 1, fps: 30, size: [1080, 1920], events });
const has = (result, kind) => result.findings.some((item) => item.kind === kind);
const tone = (segments, duration = 5) => {
  const samples = new Int16Array(duration * rate);
  for (const [start, end, amplitude] of segments) {
    for (let i = Math.round(start * rate); i < Math.round(end * rate); i++)
      samples[i] = Math.round(amplitude * Math.cos(i * 2 * Math.PI * 400 / rate));
  }
  return samples;
};
const signal = (segments, lufs = -16, peak = -2) =>
  ({ ...pcmEvidence(tone(segments), rate), lufs, true_peak_dbtp: peak });

const windows = [{ start: 0.6, end: 1.2 }, { start: 3.4, end: 4.6 }];
const gap = { start: 1.2, end: 3.4, length: 2.2 };
const lines = windows.map((window, i) => ({ ...window, line_id: '0' + (i + 1), scene_id: 'S01' }));
const cue = { id: 'c001', t: 0.8, scene_id: 'S01', layer: 'sfx', intent: 'ui_appear',
  effect: 'ui_pop', dur_s: 0.15, source: { kind: 'render_log', ref: 'events#1' } };
const anchor = { kind: 'component', name: 'cửa sổ', scene: 'S01', bbox: [100, 260, 300, 360],
  start: 0.8, end: 2, cue: { intent: 'ui_appear', weight: 'high' } };
const input = () => ({
  pcm: { mix: signal([[0, 5, 7000]], -14), voice: signal([[0.6, 1.2, 8000], [3.4, 4.6, 8000]]),
    music: signal([[0, 0.6, 1000], [0.6, 1.2, 100], [1.2, 3.4, 1000], [3.4, 4.1, 100], [4.1, 4.55, 20]]),
    sfx: signal([[0.8, 0.95, 200]]), impact: signal([]) },
  sheet: { layers: { ...design.layers, music: { enabled: true } }, silences: [gap], cues: [cue] },
  voice: { voiced_intervals: windows, silences: [gap] },
  plan: { lines: [{ ...lines[0], intent: 'explanation', pause_before_s: 0.6 },
    { ...lines[1], intent: 'question', pause_before_s: 2.2, pause_after_s: 0.4 }] },
  lines, log: log([anchor]), design, prosody, fps: 30, mixReport: { stems: {} },
});

test('Audio QC đo clip, khoảng nghỉ ngoài kế hoạch và ducking từ mẫu', () => {
  const fixture = input();
  let result = auditAudio(fixture);
  for (const kind of ['pcm_clipping', 'unplanned_silence', 'pause_plan_deviation', 'music_voice_margin', 'music_fade_out'])
    assert.equal(has(result, kind), false, kind);
  assert.ok(result.ducking.delta_db > 15);
  assert.equal(result.pauses.histogram.reduce((n, bin) => n + bin.count, 0), 1);

  fixture.pcm.mix = signal([[0, 5, 32767]], -14, -0.5);
  fixture.pcm.music = signal([[0, 5, 8000]]);
  fixture.sheet.silences = [];
  fixture.plan.lines[1].pause_before_s = 0.4;
  result = auditAudio(fixture);
  for (const kind of ['pcm_clipping', 'mix_true_peak', 'unplanned_silence', 'pause_plan_deviation',
    'music_voice_margin', 'music_fade_out']) assert.ok(has(result, kind), kind);
  assert.ok(result.layers.mix.clipped_samples > 0);
});

test('Audio QC kiểm onset trong một khung, neo hình, trùng lời và mật độ', () => {
  const fixture = input();
  assert.equal(auditAudio(fixture).cue_pass_ratio, 1);
  fixture.log = log([{ ...anchor, start: 1.05 }, anchor]);
  assert.equal(auditAudio(fixture).cue_rows[0].visual_ok, false);
  assert.ok(has(auditAudio(fixture), 'cue_visual_sync'));
  fixture.pcm.sfx = signal([[0.86, 1, 5000]]);
  fixture.log = log([]);
  fixture.lines = [lines[0], { ...lines[1], start: 1.1 }];
  fixture.sheet.layers = { ...fixture.sheet.layers, sfx: { min_gap_same_effect_s: 12, max_per_min: 1 } };
  fixture.sheet.cues = [cue, { ...cue, id: 'c002', t: 3 }];
  fixture.sheet.duration_s = 5;
  const result = auditAudio(fixture);
  for (const kind of ['cue_onset', 'cue_unattached', 'voice_overlap', 'effect_voice_overlap', 'sfx_density', 'sfx_total_density', 'cue_repeat'])
    assert.ok(has(result, kind), kind);
  assert.ok(result.cue_rows[0].onset_delta_s > 1 / 30);
  assert.equal(result.cue_pass_ratio, 0);
});

const title = { kind: 'text', role: 'opening_title', scene: 'S01', start: 0.1, end: 2.9,
  px: 84, bbox: [200, 500, 850, 650], text: 'Tiêu đề' };
const phases = (duration) => PIPELINE.opening.phases.map((phase, i) => ({
  kind: 'phase', scene: 'S01', phase, start: duration * i / 3, end: duration * (i + 1) / 3,
}));
const openingScene = (end) => ({ id: 'S01', role: 'opening', start: 0, end });

test('Opening 3 s vẫn hợp lệ, 5 s trong mục tiêu, 9 s vượt trần và thiếu pha là chưa kiểm', () => {
  for (const end of [3, 5, 9]) {
    const result = checkOpening([openingScene(end)], end, 0.8, log([title, ...phases(end)]), D8_LIMITS.opening, true);
    assert.equal(result.ok, end <= 8);
    assert.equal(result.target_ok, end === 5);
    assert.equal(result.phase_ok, true);
    assert.equal(result.voice_ok, true);
  }
  assert.equal(checkOpening([openingScene(3)], 5, 3, log([title])).ok, null);
  assert.equal(checkOpening([openingScene(3)], 5, 3, log([title, ...phases(3).slice(0, 2)])).phase_ok, null);
  assert.equal(checkOpening([openingScene(3)], 5, 0.2, log([title]), D8_LIMITS.opening, true).voice_ok, false);
  const samples = Float32Array.from(tone([[0.8, 1.6, 9000]]), (value, i) => {
    const time = i / rate;
    const ramp = Math.min(1, 10 ** Math.min((time - 0.91) * 35, (1.49 - time) * 18));
    return value * ramp / 32768;
  });
  assert.equal(analyzeVoiceEdges(samples, [{ start: 0.65, end: 1.8 }]).flagged_count, 0);
  assert.ok(analyzeVoiceEdges(samples, [{ start: 1, end: 1.8 }]).violations.some(({ edge }) => edge === 'head'));
});

test('Visual QC kiểm bbox, camera, thời gian đọc và bố cục từ sự kiện', () => {
  const scenes = [openingScene(3), { id: 'S02', start: 3, end: 6 }, { id: 'S03', start: 6, end: 9 }];
  const camera = { kind: 'camera', scene: 'S01', start: 0.2, end: 1, zoom_from: 1, zoom_to: 1.2,
    crop_from: [0, 0, 1080, 1920], crop_to: [90, 160, 990, 1760], reason: 'Theo đối tượng' };
  const label = { ...title, role: 'label', text: 'Nhãn kỹ thuật' };
  const layout = (archetype) => ({ layout: { archetype, occupancy: [100, 300, 900, 1200] } });
  const events = scenes.map(({ id, start, end }, i) => ({ ...label, ...layout('bố cục ' + i), scene: id, start, end }));
  const run = (items) => auditVisual(log(items), scenes, [], [], null, { phase_ok: null }, {}, 9);
  let result = run([...events, camera]);
  assert.equal(result.camera_scene_ratio, 1 / 3);
  for (const kind of ['safe_area', 'frame_overflow', 'camera_bounds', 'label_read_time', 'layout_run'])
    assert.equal(has(result, kind), false, kind);

  result = run([
    ...events.map((event, i) => ({ ...event, ...layout('lặp'),
      bbox: i === 0 ? [10, 300, 900, 1200] : [-10, 300, 900, 1200], end: event.start + 0.1 })),
    { ...camera, zoom_to: 1.4, crop_to: [-5, 100, 1000, 1800], reason: '' },
  ]);
  for (const kind of ['safe_area', 'frame_overflow', 'camera_bounds', 'camera_reason', 'label_read_time', 'layout_run', 'layout_share'])
    assert.ok(has(result, kind), kind);
  assert.equal(result.findings.find(({ kind }) => kind === 'frame_overflow').level, 'lỗi');
});

test('Narrative QC xuất dữ kiện và luôn cần người duyệt', () => {
  const scenes = [openingScene(5), { id: 'S02', role: 'hook', start: 5, end: 7 },
    { id: 'S03', role: 'body', start: 7, end: 9, concepts: 2 },
    { id: 'S04', role: 'outro', start: 9, end: 11, complexity: 'low' }];
  const voice = [{ scene_id: 'S03', start: 6.8, end: 8.8 }, { scene_id: 'S04', start: 9.2, end: 10 }];
  const plan = { lines: [{ scene_id: 'S04', intent: 'conclusion' }] };
  const opening = { phases: phases(5), first_sound_s: 0.8 };
  const result = auditNarrative(scenes, [{ scene_id: 'S03', scene_kind: 'problem_cause_consequence' }], voice, plan, opening, 0.1, 11);
  assert.equal(result.status, 'CHƯA KIỂM');
  assert.equal(result.lead_in_scene, 'S03');
  assert.deepEqual(result.cuts_during_voice, [7]);
  assert.equal(result.final_conclusion, true);
  assert.equal(result.final_hold_ok, true);
  assert.equal(result.conflict_before_limit, true);
});

const repo = fileURLToPath(new URL('../..', import.meta.url));
const ffmpegAvailable = spawnSync('ffmpeg', ['-version'], { windowsHide: true }).status === 0;
test('CLI ưu tiên stem giọng khi MP4 đã có tiếng từ đầu và đếm clip từ WAV', { skip: !ffmpegAvailable }, (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'qc-t4-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const folder of ['final', 'assets/audio/stems']) fs.mkdirSync(path.join(root, folder), { recursive: true });
  const ffmpeg = (...args) => {
    const result = spawnSync('ffmpeg', ['-v', 'error', ...args], { encoding: 'utf8', windowsHide: true });
    assert.equal(result.status, 0, result.stderr);
  };
  ffmpeg('-f', 'lavfi', '-i', 'color=c=black:s=360x640:r=30:d=3', '-f', 'lavfi', '-i',
    'sine=frequency=440:duration=3', '-c:v', 'libx264', '-preset', 'ultrafast', '-c:a', 'aac',
    path.join(root, 'final', 'T4-TEST_9x16.mp4'));
  const voice = path.join(root, 'assets/audio/stems/voice.wav');
  ffmpeg('-f', 'lavfi', '-i', "aevalsrc='if(between(t,0.8,2),0.3*cos(2*PI*400*t),0)':s=48000:d=3",
    '-c:a', 'pcm_s16le', voice);
  ffmpeg('-f', 'lavfi', '-i', 'aevalsrc=1:s=48000:d=3', '-c:a', 'pcm_s16le', path.join(root, 'assets/audio/mix.wav'));
  const write = (file, value) => fs.writeFileSync(path.join(root, file), JSON.stringify(value));
  write('assets/scenes.json', [{ ...openingScene(3), voice: [{ start: 0.65, end: 2.2 }] }]);
  write('storyboard.json', { opening: { voice: true }, scenes: [{ scene_id: 'S01' }] });
  write('assets/render-log.json', log([title, ...phases(3)]));
  const out = path.join(root, 'reports');
  const run = spawnSync(process.execPath, ['tools/qc-measure.mjs', root, '--out', out], { cwd: repo, encoding: 'utf8', windowsHide: true });
  assert.equal(run.status, 0, run.stderr);
  const result = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
  assert.equal(result.voice_edges.source, voice);
  assert.ok(Math.abs(result.opening.first_sound_s - 0.8) < 0.01);
  assert.equal(result.opening.voice_ok, true);
  assert.equal(result.opening.motion_ok, false);
  assert.equal(result.groups.audio.layers.mix.clipped_samples, 144000);
  assert.equal(result.groups.audio.status, 'CHƯA KIỂM');
  assert.equal(result.machine_verdict.final_pass_allowed, false);
  assert.ok(result.needs_manual_review.length > 21);
});
