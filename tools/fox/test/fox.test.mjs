import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { listPoses, assertPoses, planFrames, transformFor, frameSVG, narrate, DEFAULT_CYCLE } from '../narrate.mjs';
import { svgToPng } from '../../mascot/render.mjs';

const FPS = 30;
const talk = (n, quietHead = 0) => Array.from({ length: n }, (_, i) => (i < quietHead ? 0 : 0.06 + 0.2 * Math.abs(Math.sin(i / 4))));

test('thư viện dáng: đủ các dáng mặc định + dáng chào/nghỉ, tên không trùng', () => {
  const have = listPoses();
  assert.ok(have.length >= 40, `chỉ có ${have.length} dáng`);
  assert.equal(new Set(have).size, have.length);
  for (const p of [...DEFAULT_CYCLE, 'wave', 'arms_crossed']) assert.ok(have.includes(p), `thiếu dáng ${p}`);
  const manifest = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../../../brand/cao/manifest.json'), 'utf8'));
  assert.deepEqual(Object.keys(manifest.poses).sort(), have, 'manifest khớp thư mục poses');
  for (const m of Object.values(manifest.poses)) assert.ok(m.size[1] >= 250, 'sticker quá nhỏ');
});

test('assertPoses báo rõ dáng không tồn tại và gợi ý danh sách', () => {
  assert.doesNotThrow(() => assertPoses(['wave', 'think']));
  assert.throws(() => assertPoses(['wave', 'khong-co']), /Không có dáng: khong-co.*catalog\.png/s);
});

test('planFrames: mốc timeline được tôn trọng, đổi dáng thì age về 0', () => {
  const tl = [{ t: 0, pose: 'wave' }, { t: 2, pose: 'think' }, { t: 4, pose: 'idea' }];
  const f = planFrames(talk(180), FPS, { timeline: tl });
  assert.equal(f[0].pose, 'wave');
  assert.equal(f[59].pose, 'wave');
  assert.equal(f[60].pose, 'think');
  assert.equal(f[60].age, 0);
  assert.equal(f[65].age, 5);
  assert.equal(f[120].pose, 'idea');
  assert.equal(planFrames(talk(60), FPS, { timeline: [{ t: 1, pose: 'think' }] })[0].pose, 'think', 'trước mốc đầu dùng dáng đầu tiên');
});

test('planFrames: --intro vẫy tay đầu clip, rồi tự đổi dáng theo vòng; dáng cố định thì giữ nguyên', () => {
  const f = planFrames(talk(450), FPS, { intro: true });
  assert.ok(f.slice(0, 45).every((s) => s.pose === 'wave'));
  const used = new Set(f.map((s) => s.pose));
  assert.ok(used.size >= 4, `chỉ dùng ${[...used]}`);
  assert.ok(f.every((s) => s.age >= 0));
  assert.ok(planFrames(talk(120), FPS, { pose: 'think' }).every((s) => s.pose === 'think'));
  assert.deepEqual(planFrames(talk(200), FPS, { intro: true }), planFrames(talk(200), FPS, { intro: true }), 'tất định');
});

test('transformFor: nảy khi mới đổi dáng, nhún theo tiếng, ổn định khi im lặng', () => {
  const quiet = transformFor({ age: 99, lvl: 0 }, FPS, 0);
  const loud = transformFor({ age: 99, lvl: 1 }, FPS, 0);
  assert.ok(loud.sy > quiet.sy, 'nói to thì cao hơn');
  assert.ok(loud.sx < quiet.sx, 'và hẹp hơn (nhún)');
  const pop0 = transformFor({ age: 0, lvl: 0 }, FPS, 0);
  assert.ok(pop0.sx < 0.95, 'khung đầu nhỏ hơn rồi nảy lên');
  const peak = Math.max(...[0, 1, 2, 3, 4, 5].map((a) => transformFor({ age: a, lvl: 0 }, FPS, 0).sx));
  assert.ok(peak >= 0.99 && peak <= 1.08, `đỉnh nảy hợp lý (${peak})`);
});

test('frameSVG vẽ ra PNG có điểm ảnh; dáng ngồi bàn không có bóng dưới chân', () => {
  const svg = frameSVG('think', transformFor({ age: 99, lvl: 0.5 }, FPS, 3), 400);
  assert.match(svg, /<ellipse/);
  assert.ok(svgToPng(svg, { width: 520 }).length > 5000);
  assert.doesNotMatch(frameSVG('desk_typing', { sx: 1, sy: 1, rot: 0 }, 400), /<ellipse/);
});

test('dựng thật 2 giây từ phụ đề: ra .mov có kênh trong suốt, đúng thời lượng', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fox-test-'));
  try {
    fs.writeFileSync(path.join(dir, 'c.srt'), '1\n00:00:00,200 --> 00:00:01,800\nXin chào các bạn\n');
    const out = path.join(dir, 'layer.mov');
    const r = narrate({ srt: path.join(dir, 'c.srt'), out, duration: '2', intro: true, height: '300' });
    assert.equal(r.source, 'srt');
    assert.ok(fs.statSync(out).size > 1000);
    assert.ok(r.poses_used.includes('wave'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
