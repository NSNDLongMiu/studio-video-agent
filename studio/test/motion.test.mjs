import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const motion = path.join(root, 'tools', 'motion');
const env = { ...process.env, PYTHONIOENCODING: 'utf-8' };
const python = [['python'], ['py', '-3'], ['python3']].find(([exe, ...args]) =>
  spawnSync(exe, [...args, '-B', '-c', 'import sys; from PIL import Image; assert sys.version_info >= (3, 10)'],
    { env }).status === 0);
const hasVideoTools = ['ffmpeg', 'ffprobe'].every((exe) => spawnSync(exe, ['-version']).status === 0);

function success(exe, args, childEnv = env) {
  const result = spawnSync(exe, args, { cwd: root, env: childEnv, encoding: 'utf8', timeout: 90_000 });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim();
}

function runPython(out, ...args) {
  const [exe, ...prefix] = python;
  return success(exe, [...prefix, '-B', ...args], { ...env, MOTION_TEST_OUT: out });
}

test('Thư viện motion graphics Pillow', {
  skip: !python && 'Cần Python 3.10+ có Pillow.',
}, async (t) => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'motion-test-'));
  t.after(() => {
    // Chỉ dọn đúng thư mục tạm vừa tạo.
    assert.equal(path.dirname(fs.realpathSync(out)), fs.realpathSync(os.tmpdir()));
    fs.rmSync(out, { recursive: true, force: true });
  });
  const check = (name) => runPython(out, '-m', 'unittest', 'tools.motion.tests.checks.MotionChecks.' + name);
  const cases = [
    ['Import đủ module, giữ kích thước và dùng được palette khác', 'test_modules'],
    ['Văn bản tiếng Việt dài vừa hộp nhỏ, cả nét viền và dấu', 'test_text'],
    ['Nhãn né vật cản và cách viền ít nhất 24 px', 'test_label'],
    ['ASS chia dòng và trang, giữ vị trí/cỡ và đọc SRT', 'test_ass'],
    ['Nút/cạnh hiện đúng mốc và luồng request dày lên', 'test_flow'],
    ['Kinetic có hạn mức, opening và header giữ vùng an toàn', 'test_kinetic_and_opening'],
    ['Biểu đồ tiến dần, camera di chuyển và timeline JSON dùng giờ toàn video', 'test_sequence_and_charts'],
  ];
  for (const [label, method] of cases) {
    await t.test(label, () => { check(method); });
  }

  const videoRequired = { skip: !hasVideoTools && 'Cần FFmpeg và FFprobe.' };
  for (const [label, method] of [
    ['Nhật ký ghi bbox toàn khung, gộp các khung kề và giữ nguyên pixel', 'test_render_log'],
    ['Header đúng kích thước, chọn ô, giữ khe và hòa hai ô khi sang cảnh', 'test_header_track'],
    ['Opening riêng, chữ đủ cỡ và metadata có ô header', 'test_opening_plate'],
  ]) {
    await t.test(label, () => {
      runPython(out, '-m', 'unittest', 'tools.motion.tests.d8_checks.D8Checks.' + method);
    });
  }
  await t.test('Libass giữ đủ hai dòng thực trong CAPTION_BAND', videoRequired,
    () => { check('test_caption_pixels'); });

  await t.test('Demo xuất H.264 đúng 1080×1920, 30 fps, 6 giây và ba khung', videoRequired, (demoTest) => {
    const dir = path.join(out, 'demo');
    const stats = JSON.parse(runPython(out, path.join(motion, 'examples', 'demo_overload.py'), '--out', dir));
    demoTest.diagnostic('Dựng ' + stats.seconds + ' s. Pillow TB ' + stats.frame_mean_ms
      + ' ms/khung, đỉnh ' + stats.frame_max_ms + ' ms.');
    assert.equal(stats.frames, 180);
    assert.ok(stats.frame_mean_ms < 150, 'Pillow TB ' + stats.frame_mean_ms + ' ms/khung');
    const video = path.join(dir, 'demo_overload.mp4');
    const { streams: [stream] } = JSON.parse(success('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height,r_frame_rate,duration,codec_name,pix_fmt,nb_frames', '-of', 'json', video]));
    assert.equal(stream.codec_name, 'h264');
    assert.equal(stream.pix_fmt, 'yuv420p');
    assert.equal(stream.width, 1080);
    assert.equal(stream.height, 1920);
    assert.equal(stream.r_frame_rate, '30/1');
    assert.equal(Number(stream.nb_frames), 180);
    assert.ok(Math.abs(Number(stream.duration) - 6) <= .1, stream.duration);
    assert.deepEqual(fs.readdirSync(dir).sort(), ['demo_overload.mp4', 'frame_01.png', 'frame_02.png', 'frame_03.png']);
    check('test_demo_pixels');
  });

  await t.test('Demo D8 có đủ opening và header, giữ 24 px tới nội dung', videoRequired, () => {
    const dir = path.join(out, 'd8');
    runPython(out, path.join(motion, 'examples', 'demo_header_opening.py'), '--out', dir);
    const { fps, size, events } = JSON.parse(fs.readFileSync(path.join(dir, 'render-log.json'), 'utf8'));
    const headers = events.filter((event) => event.kind === 'header');
    const opening = events.filter((event) => event.kind === 'opening');
    assert.deepEqual(opening.map(({ scene, start, end }) => ({ scene, start, end })), [
      { scene: 'S01', start: 0, end: 2.4 },
    ]);
    assert.deepEqual(new Set(headers.map((event) => event.slot)), new Set(['top_left', 'above_captions', 'top_right']));
    assert.ok(events.some((event) => event.kind === 'component' && event.role === 'mascot'));
    let framesWithHeader = 0;
    for (let i = 72; i < 270; i++) {
      if (headers.some(({ start, end }) => start <= (i + .5) / fps && end > (i + .5) / fps)) framesWithHeader++;
    }
    assert.ok(framesWithHeader / (270 - 72) >= .95);
    const content = events.filter(({ kind, role }) => kind === 'component' ||
      (kind === 'text' && !role.startsWith('header_')));
    for (const event of headers) {
      for (const item of content) {
        if (item.start >= event.end || item.end <= event.start) continue;
        const [x, y, r, b] = event.bbox;
        const [left, top, right, bottom] = item.bbox;
        assert.ok(left - r >= 24 || x - right >= 24 || top - b >= 24 || y - bottom >= 24,
          `${event.scene}/${event.slot} sát ${item.name || item.text}`);
      }
    }
    const video = path.join(dir, 'demo_header_opening.mp4');
    const { streams: [stream] } = JSON.parse(success('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height,r_frame_rate,nb_frames,codec_name', '-of', 'json', video]));
    assert.deepEqual(size, [1080, 1920]);
    assert.deepEqual(stream, { codec_name: 'h264', width: 1080, height: 1920, r_frame_rate: '30/1', nb_frames: '270' });
    assert.deepEqual(fs.readdirSync(dir).sort(), ['demo_header_opening.mp4', 'frame_01.png', 'frame_02.png',
      'frame_03.png', 'frame_04.png', 'render-log.json']);
  });
});

test('Opening nhiều pha và các mẫu cảnh động C5', {
  skip: !python && 'Cần Python 3.10+ có Pillow.',
}, async (t) => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'motion-t3-test-'));
  t.after(() => {
    assert.equal(path.dirname(fs.realpathSync(out)), fs.realpathSync(os.tmpdir()));
    fs.rmSync(out, { recursive: true, force: true });
  });
  const cases = ['selection_and_match', 'scene_kinds', 'camera_log_and_layout',
    'cue_first_visible_frame_and_legacy_fields', 'rich_scene_overlaps', 'opening_question', 'opening_hypothetical',
    'opening_warning', 'opening_incident', 'opening_surprise'];
  for (const name of cases) {
    await t.test(name, (subtest) => {
      const stats = runPython(out, '-X', 'utf8', '-m', 'unittest',
        'tools.motion.tests.visual_checks.VisualChecks.test_' + name);
      if (stats) subtest.diagnostic(stats);
    });
  }
});
