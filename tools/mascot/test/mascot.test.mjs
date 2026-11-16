import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../character.mjs';
import { svgToPng } from '../render.mjs';
import { sheetSVG } from '../build.mjs';
import { rmsFromPcm, parseSrt, envelopeFromCues, planFrames } from '../narrate.mjs';

const FPS = 30;

test('mọi tư thế tay / chân / biểu cảm / hình miệng đều vẽ được ra PNG', () => {
  for (const arms of Object.keys(C.ARM_POSES)) assert.ok(svgToPng(C.mascotSVG({ arms }), { width: 160 }).length > 500, arms);
  for (const legs of Object.keys(C.LEG_POSES)) assert.ok(svgToPng(C.mascotSVG({ legs }), { width: 160 }).length > 500, legs);
  for (const expr of Object.keys(C.EXPRESSIONS)) assert.ok(svgToPng(C.mascotSVG({ expr }), { width: 160 }).length > 500, expr);
  for (const mouth of C.MOUTHS) assert.ok(svgToPng(C.mascotSVG({ mouth }), { width: 160 }).length > 500, mouth);
  assert.ok(svgToPng(C.mascotSVG({ arms: 'wave', wave: 1, tilt: 1, dy: 6, headset: false }), { width: 160 }).length > 500);
  assert.throws(() => C.mascotSVG({ arms: 'khong-co' }), /Tư thế tay/);
});

test('nền trong suốt: góc ảnh không có điểm ảnh đặc', () => {
  // PNG RGBA: kiểm tra qua resvg render raw bằng cách vẽ lên nền đỏ và so với không nền
  const a = svgToPng(C.mascotSVG({}), { width: 200 });
  const b = svgToPng(C.mascotSVG({}), { width: 200, background: '#ff0000' });
  assert.notDeepEqual(a, b, 'có nền thì khác không nền → ảnh gốc trong suốt');
});

test('tờ đặc tả ghép nhiều nhân vật không trùng id', () => {
  const svg = sheetSVG();
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, 'id bị trùng');
  assert.ok(svgToPng(svg, { width: 800 }).length > 5000);
});

test('rmsFromPcm: im lặng / to / im lặng', () => {
  const rate = 16000;
  const s = new Int16Array(rate * 3);
  for (let i = rate; i < 2 * rate; i++) s[i] = Math.round(Math.sin(i / 8) * 16000);
  const r = rmsFromPcm(s, rate, FPS);
  assert.ok(r[10] < 0.001 && r[80] < 0.001);
  assert.ok(r[45] > 0.3 && r[45] < 0.6);
});

test('parseSrt + envelopeFromCues: có tiếng trong dòng, im lặng giữa các dòng, tất định', () => {
  const cues = parseSrt('1\n00:00:00,500 --> 00:00:02,000\nXin chào các bạn\n\n2\n00:00:03,000 --> 00:00:04,500\nHẹn gặp lại\n');
  assert.equal(cues.length, 2);
  assert.deepEqual([cues[0].start, cues[0].end, cues[1].start], [0.5, 2, 3]);
  assert.equal(cues[1].text, 'Hẹn gặp lại');
  const { duration, rms } = envelopeFromCues(cues, FPS);
  assert.ok(Math.abs(duration - 5.1) < 0.01);
  assert.ok(rms.slice(20, 55).some((v) => v > 0.1));
  assert.ok(rms.slice(62, 88).every((v) => v === 0), 'khoảng lặng giữa 2 dòng');
  assert.deepEqual(envelopeFromCues(cues, FPS).rms, rms, 'cùng seed → cùng kết quả');
});

test('planFrames: im lặng thì ngậm miệng; có tiếng thì miệng đổi hình, không nhấp nháy 1 khung', () => {
  const quiet = planFrames(new Array(90).fill(0), FPS);
  assert.ok(quiet.every((s) => s.mouth === 'M0'));
  const talk = [];
  for (let i = 0; i < 300; i++) talk.push(i < 30 || (i >= 150 && i < 180) ? 0 : 0.05 + 0.2 * Math.abs(Math.sin(i / 3)));
  const plan = planFrames(talk, FPS, { seed: 3 });
  const used = new Set(plan.map((s) => s.mouth));
  assert.ok(used.has('M0') && used.size >= 3, `chỉ dùng ${[...used]}`);
  for (let i = 1; i < plan.length - 1; i++) {
    const m = plan[i].mouth;
    const iso = m !== plan[i - 1].mouth && m !== plan[i + 1].mouth && m !== 'M0' && plan[i - 1].mouth !== 'M0' && plan[i + 1].mouth !== 'M0';
    assert.ok(!iso, `khung ${i} nhấp nháy`);
  }
  assert.ok(plan.slice(0, 25).every((s) => s.mouth === 'M0'), 'ngậm miệng lúc im lặng đầu clip');
});

test('planFrames: chớp mắt, cử chỉ, tư thế cố định, chào ở đầu', () => {
  const talk = Array.from({ length: 450 }, (_, i) => 0.06 + 0.2 * Math.abs(Math.sin(i / 4)));
  const a = planFrames(talk, FPS, { seed: 5, intro: true });
  assert.ok(a.slice(0, 40).every((s) => s.arms === 'wave'), 'vẫy tay chào ở đầu');
  assert.ok(new Set(a.map((s) => s.arms)).size >= 3, 'đổi cử chỉ theo thời gian');
  const blinks = a.filter((s) => s.eyes === 'closed').length;
  assert.ok(blinks >= 8 && blinks <= 80, `chớp mắt ${blinks} khung`);
  let run = 0;
  for (const s of a) {
    run = s.eyes === 'closed' ? run + 1 : 0;
    assert.ok(run <= 4, 'mỗi lần chớp tối đa 4 khung');
  }
  assert.ok(planFrames(talk, FPS, { gestures: 'point_up' }).every((s) => s.arms === 'point_up'));
  assert.ok(planFrames(talk, FPS, { gestures: 'none' }).every((s) => s.arms === 'rest'));
  assert.ok(planFrames(talk, FPS, { expr: 'happy' }).every((s) => s.eyes === undefined), 'mắt cười không chớp');
  assert.deepEqual(planFrames(talk, FPS, { seed: 5 }), planFrames(talk, FPS, { seed: 5 }), 'tất định theo seed');
});
