import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../../tools/backgrounds/make_background.py', import.meta.url));
const themes = ['database', 'code', 'security', 'incident', 'office'];
const size = '270x480';
const pythonCommands = [['python'], ['py', '-3'], ['python3']];
const python = pythonCommands.find(([exe, ...args]) =>
  spawnSync(exe, [...args, '-c', 'from PIL import Image'], { encoding: 'utf8' }).status === 0);

function runPython(...args) {
  const [exe, ...prefix] = python;
  const result = spawnSync(exe, [...prefix, ...args], {
    encoding: 'utf8',
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
  });
  assert.ifError(result.error);
  return result;
}

function success(...args) {
  const result = runPython(...args);
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

const inspect = String.raw`
import itertools, json, sys
from pathlib import Path
from PIL import Image, ImageChops, ImageStat

folder = Path(sys.argv[1])
themes = sys.argv[2:]
flats = {theme: Image.open(folder / f"{theme}_1.png") for theme in themes}
stats = {}
for theme, image in flats.items():
    gray = image.convert("L")
    w, h = image.size
    top, bottom = round(h * 250 / 1920), round(h * 1500 / 1920)
    center = gray.crop((w // 3, top, w * 2 // 3, bottom))
    left = gray.crop((0, top, w // 4, bottom))
    right = gray.crop((w * 3 // 4, top, w, bottom))
    stats[theme] = {
        "mode": image.mode,
        "size": image.size,
        "spread": ImageStat.Stat(gray).stddev[0],
        "centerSpread": ImageStat.Stat(center).stddev[0],
        "edgeSpread": (ImageStat.Stat(left).stddev[0] + ImageStat.Stat(right).stddev[0]) / 2,
    }

distances = {
    f"{a}/{b}": sum(ImageStat.Stat(ImageChops.difference(flats[a], flats[b])).mean) / 3
    for a, b in itertools.combinations(themes, 2)
}

far, mid, near = frames = [
    Image.open(folder / f"database_1_{layer}.png") for layer in ("far", "mid", "near")
]
alpha = mid.getchannel("A")
w, h = mid.size
center_alpha = alpha.crop((w // 4, round(h * 250 / 1920), w * 3 // 4, round(h * 1500 / 1920)))
flat = Image.alpha_composite(Image.alpha_composite(far, mid), near).convert("RGB")
print(json.dumps({
    "stats": stats,
    "distances": distances,
    "layers": [[frame.mode, frame.size] for frame in frames],
    "farAlpha": far.getchannel("A").getextrema(),
    "midPeakAlpha": alpha.getextrema()[1],
    "clearFraction": sum(center_alpha.histogram()[:5]) / (center_alpha.width * center_alpha.height),
    "sameFlat": ImageChops.difference(flat, flats["database"]).getbbox() is None,
}))

for frame in [*flats.values(), *frames]:
    frame.close()
`;

test('Thư viện nền Pillow', {
  skip: !python && 'Không chạy được Python có Pillow (đã thử python, py -3 và python3).',
}, async (t) => {
  const out = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'studio-backgrounds-'));
  t.after(() => fs.rmSync(out, { recursive: true, force: true }));

  await t.test('Liệt kê đủ năm chủ đề và báo lỗi tham số bằng tiếng Việt', () => {
    const lines = success(cli, '--list-themes').split(/\r?\n/);
    assert.deepEqual(lines.map((line) => line.split(' — ')[0]), themes);
    assert.ok(lines.every((line) => line.split(' — ')[1]?.length > 0));
    for (const args of [
      ['--theme', 'unknown', '--out', out],
      ['--theme', 'code', '--out', out, '--size', '0x480'],
      ['--theme', 'code', '--out', out, '--accent', 'oops'],
      ['--theme', 'code', '--out', out, '--seed', 'oops'],
      ['--theme', 'office'],
    ]) {
      const result = runPython(cli, ...args);
      assert.equal(result.status, 2, result.stderr);
      assert.match(result.stderr, /Cách dùng:.*|Lỗi tham số/u);
    }
  });

  await t.test('Xuất ảnh RGB phân biệt được chủ đề và giữ vùng giữa dịu', () => {
    for (const theme of themes) {
      const names = success(cli, '--theme', theme, '--out', out, '--size', size,
        ...(theme === 'database' ? ['--layers'] : [])).split(/\r?\n/);
      const stem = path.join(out, `${theme}_1`);
      const expected = [`${stem}.png`];
      if (theme === 'database') {
        expected.push(...['far', 'mid', 'near'].map((layer) => `${stem}_${layer}.png`));
      }
      assert.deepEqual(names, expected);
      assert.ok(expected.every((file) => fs.statSync(file).isFile()));
    }
    const report = JSON.parse(success('-c', inspect, out, ...themes));
    for (const [theme, metrics] of Object.entries(report.stats)) {
      assert.equal(metrics.mode, 'RGB', theme);
      assert.deepEqual(metrics.size, [270, 480], theme);
      // Trên thang 0–255, σ > 5 loại nền phẳng hoặc chỉ có hạt nhiễu ±2.
      assert.ok(metrics.spread > 5, `${theme}: σ = ${metrics.spread}`);
      assert.ok(metrics.centerSpread < metrics.edgeSpread, `${theme}: giữa phải dịu hơn hai rìa`);
    }
    // Sai khác tuyệt đối trung bình > 3 mức/kênh cho mọi cặp, kể cả code và database.
    for (const [pair, distance] of Object.entries(report.distances)) {
      assert.ok(distance > 3, `${pair}: sai khác trung bình = ${distance}`);
    }
    assert.deepEqual(report.layers, Array.from({ length: 3 }, () => ['RGBA', [270, 480]]));
    assert.deepEqual(report.farAlpha, [255, 255]);
    assert.ok(report.midPeakAlpha > 128, 'lớp giữa phải có hình ở rìa');
    assert.ok(report.clearFraction > 0.8, 'ít nhất 80% vùng giữa có alpha < 5');
    assert.ok(report.sameFlat, 'ghép ba lớp phải khớp từng pixel');
  });

  await t.test('Giữ nguyên byte với cùng seed, đổi ảnh khi đổi seed hoặc màu nhấn', () => {
    const args = ['--theme', 'database', '--size', size, '--out', path.join(out, 'repeat')];
    const flat = fs.readFileSync(path.join(out, 'database_1.png'));
    assert.deepEqual(fs.readFileSync(success(cli, ...args, '--seed', '1')), flat);
    assert.notDeepEqual(fs.readFileSync(success(cli, ...args, '--seed', '2')), flat);
    assert.notDeepEqual(fs.readFileSync(success(cli, ...args, '--accent', '#A773DE')), flat);
  });
});
