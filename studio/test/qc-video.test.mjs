import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const tool = fileURLToPath(new URL('../../tools/qc-video.mjs', import.meta.url));
const available = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8', windowsHide: true }).status === 0;

for (const [name, gain, expected] of [
  ['âm nhỏ chỉ cảnh báo', 1, 'quiet'],
  ['âm đạt khoảng LUFS', 2.25, 'target'],
  ['true peak trên -1.5 nhưng không quá 0 chỉ cảnh báo', 7, 'peak-warn'],
  ['true peak trên 0 bị FAIL', 16, 'clip'],
]) {
  test(`qc-video: đo clip thật 1080×1920, ${name}`, { skip: !available && 'thiếu ffmpeg trong PATH' }, (t) => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-qc-video-'));
    t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
    const file = path.join(tmp, 'sine.mp4');
    const made = spawnSync('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-f', 'lavfi', '-i', 'color=c=black:s=1080x1920:r=24',
      '-f', 'lavfi', '-i', 'sine=frequency=1000:sample_rate=48000',
      '-t', '2.5', '-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p',
      '-af', `volume=${gain}`, '-c:a', 'aac', '-movflags', '+faststart', file,
    ], { encoding: 'utf8', windowsHide: true });
    assert.equal(made.status, 0, made.stderr || made.error?.message);
    const result = spawnSync(process.execPath, [tool, file, '--min', '2', '--max', '3'], { encoding: 'utf8', windowsHide: true });
    assert.ok([0, 1].includes(result.status), result.stderr || result.error?.message);
    const qc = JSON.parse(result.stdout);
    for (const key of ['lufs_i', 'lra', 'true_peak_dbtp', 'mean_volume_db', 'max_volume_db']) {
      assert.equal(typeof qc.info[key], 'number', `${key}: ${result.stdout}`);
      assert.ok(Number.isFinite(qc.info[key]));
    }
    assert.equal(qc.info.video, 'h264 1080x1920 yuv420p');
    if (expected === 'clip') {
      assert.ok(qc.info.true_peak_dbtp > 0, result.stdout);
      assert.equal(result.status, 1);
      assert.equal(qc.pass, false);
      assert.ok(qc.fails.some((s) => /True peak/.test(s)));
    } else {
      assert.equal(result.status, 0, result.stdout);
      assert.equal(qc.pass, true);
      assert.deepEqual(qc.fails, []);
      if (expected === 'quiet') {
        assert.ok(qc.info.lufs_i < -16, result.stdout);
        assert.ok(qc.warns.some((s) => /LUFS/.test(s)));
      } else if (expected === 'target') {
        assert.ok(qc.info.lufs_i >= -16 && qc.info.lufs_i <= -12, result.stdout);
        assert.ok(!qc.warns.some((s) => /Loudness|True peak/.test(s)));
      } else {
        assert.ok(qc.info.true_peak_dbtp > -1.5 && qc.info.true_peak_dbtp <= 0, result.stdout);
        assert.ok(qc.warns.some((s) => /True peak/.test(s)));
        assert.ok(qc.info.lufs_i > -12, result.stdout);
        assert.ok(qc.warns.some((s) => /LUFS/.test(s)));
      }
    }
  });
}

test('qc-video: thiếu đối số vẫn trả mã cú pháp 2', () => {
  const result = spawnSync(process.execPath, [tool], { encoding: 'utf8', windowsHide: true });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /\[--scenes <tệp\.json>\].*\[--no-motion\]/);
});

test('qc-video: đo đoạn tĩnh, đọc tệp cảnh và hỗ trợ tắt phép đo', { skip: !available && 'thiếu ffmpeg trong PATH' }, (t) => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-qc-motion-'));
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
  const file = path.join(tmp, 'motion.mp4');
  const made = spawnSync('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-f', 'lavfi', '-i', 'color=c=black:s=360x640:r=24:d=3',
    '-f', 'lavfi', '-i', 'testsrc2=s=360x640:r=24:d=1',
    '-f', 'lavfi', '-i', 'sine=frequency=1000:sample_rate=48000',
    '-filter_complex', '[0:v][1:v]concat=n=2:v=1:a=0[v]', '-map', '[v]', '-map', '2:a',
    '-t', '4', '-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p',
    '-af', 'volume=2.25', '-c:a', 'aac', '-movflags', '+faststart', file,
  ], { encoding: 'utf8', windowsHide: true });
  assert.equal(made.status, 0, made.stderr || made.error?.message);

  const run = (...options) => {
    const result = spawnSync(process.execPath, [tool, file, '--min', '3', '--max', '5', ...options], { encoding: 'utf8', windowsHide: true });
    assert.equal(result.status, 0, result.stderr || result.error?.message || result.stdout);
    const qc = JSON.parse(result.stdout);
    assert.equal(qc.pass, true);
    assert.deepEqual(qc.fails, []);
    return qc;
  };

  const baseline = run('--no-motion');
  assert.ok(!Object.hasOwn(baseline.info, 'motion'));
  assert.ok(!Object.hasOwn(baseline.info, 'scenes'));
  const qc = run();
  assert.deepEqual(qc.info, {
    ...baseline.info,
    motion: { static_pct: 100 * 29 / 39, longest_static_s: 2.9, static_runs: [{ start_s: 0, length_s: 2.9 }], first_change_s: 3, opening_windows: [], grid: '9x16 khối 12px, bước 0,1 s' },
  });
  assert.deepEqual(qc.warns.slice(0, baseline.warns.length), baseline.warns);
  assert.ok(qc.warns.some((msg) => /Đoạn tĩnh 0–2,9 s .*hold_reason/.test(msg)));

  const scenesFile = path.join(tmp, 'cảnh mẫu.json');
  fs.writeFileSync(scenesFile, '\uFEFF' + JSON.stringify([{ id: 'S01', start: 0, end: 3 }, { id: 'S02', start: 3, end: 4 }]));
  const perScene = run('--scenes', scenesFile);
  assert.deepEqual(perScene.info.scenes.map(({ id }) => id), ['S01', 'S02']);
  assert.equal(perScene.info.scenes[0].active_median, 0);
  assert.ok(perScene.warns.some((msg) => /Cảnh S01 .*ít chuyển động/.test(msg)));

  const malformedFile = path.join(tmp, 'sai cú pháp.json');
  fs.writeFileSync(malformedFile, '[{');
  fs.writeFileSync(scenesFile, JSON.stringify([{ id: 'S01', start: 3, end: 0 }]));
  for (const options of [['--scenes'], ['--scenes', path.join(tmp, 'không có.json')], ['--scenes', scenesFile], ['--scenes', malformedFile]]) {
    const invalid = run(...options);
    assert.deepEqual(invalid.info, qc.info);
    assert.deepEqual(invalid.warns.filter((msg) => /tệp cảnh --scenes/.test(msg)).length, 1);
    assert.deepEqual(invalid.warns.filter((msg) => !/tệp cảnh --scenes/.test(msg)), qc.warns);
  }
  assert.deepEqual(run('--scenes', scenesFile, '--no-motion'), baseline);
});

test('qc-video: FFmpeg không giải mã được khung hình chỉ thêm một cảnh báo', { skip: !available && 'thiếu ffmpeg trong PATH' }, (t) => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-qc-motion-'));
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
  const file = path.join(tmp, 'audio.m4a');
  const made = spawnSync('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-f', 'lavfi', '-i', 'sine=frequency=1000:sample_rate=48000:duration=1.2',
    '-af', 'volume=2.25', '-c:a', 'aac', file,
  ], { encoding: 'utf8', windowsHide: true });
  assert.equal(made.status, 0, made.stderr || made.error?.message);

  const args = [tool, file, '--min', '1'];
  const baseline = spawnSync(process.execPath, [...args, '--no-motion'], { encoding: 'utf8', windowsHide: true });
  const result = spawnSync(process.execPath, args, { encoding: 'utf8', windowsHide: true });
  assert.equal(baseline.status, 1, baseline.stderr || baseline.error?.message);
  assert.equal(result.status, baseline.status, result.stderr || result.error?.message);
  const before = JSON.parse(baseline.stdout);
  assert.deepEqual(before.fails, ['Không có luồng video']);
  assert.deepEqual(JSON.parse(result.stdout), {
    ...before,
    warns: [...before.warns, 'Không đo được chuyển động: FFmpeg không giải mã được khung hình.'],
  });
});
