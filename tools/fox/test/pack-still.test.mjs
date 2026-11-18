import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readPack, resolveFrame, stillGeometry, exportStill, run} from '../pack-still.mjs';

const LOCAL_BIN = 'C:/Users/PC/AppData/Local/ffmpeg/ffmpeg-master-latest-win64-gpl/bin';
const BUNDLED_BIN = path.resolve(import.meta.dirname, '../../../studio/renderer-remotion/node_modules/@remotion/compositor-win32-x64-msvc');
const executable = (name) => process.env[name.toUpperCase()] || [LOCAL_BIN, BUNDLED_BIN].map((dir) => path.join(dir, `${name}.exe`)).find((file) => fs.existsSync(file)) || name;

test('native foreground cap, explicit upscale and invalid alpha geometry', () => {
  const frame = {width: 100, height: 120, has_alpha: true, alpha_bbox: [10, 20, 90, 100]};
  const native = stillGeometry(frame, {height: 760});
  assert.equal(native.drawHeight, 80);
  assert.equal(native.drawWidth, 80);
  assert.equal(native.height_capped_to_native, true);
  assert.equal(native.y, 1420);
  assert.equal(stillGeometry(frame, {height: 760, 'allow-upscale': true}).drawHeight, 760);
  assert.throws(() => stillGeometry({...frame, alpha_bbox: null}), /alpha_bbox/);
  assert.throws(() => stillGeometry({...frame, alpha_bbox: [0, 0, 101, 100]}), /alpha_bbox/);
  assert.throws(() => stillGeometry({...frame, has_alpha: false}), /alpha/);
  assert.throws(() => stillGeometry(frame, {size: '1080x1921'}), /kích thước chẵn/);
  assert.throws(() => stillGeometry(frame, {height: 'NaN'}), /số dương/);
  assert.throws(() => stillGeometry(frame, {bottom: 1920}), /bottom/);
});

test('manifest IDs and relative paths prevent wrong asset selection', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cao-pack-index-'));
  try {
    const root = path.join(temp, 'pack');
    fs.mkdirSync(root);
    const manifestFile = path.join(root, 'manifest.json');
    const source = path.join(root, 'frame.png');
    fs.writeFileSync(source, 'fixture');
    fs.writeFileSync(path.join(temp, 'outside.png'), 'outside');
    fs.writeFileSync(manifestFile, JSON.stringify({frames: [{id: 'safe', path: 'frame.png', group_id: '01'}, {id: 'outside', path: '../outside.png'}]}));
    const pack = readPack(manifestFile);
    assert.equal(resolveFrame(pack, 'safe').imagePath, fs.realpathSync(source));
    assert.throws(() => resolveFrame(pack, 'outside'), /vượt ra ngoài/);
    assert.throws(() => resolveFrame(pack, 'missing'), /Không có asset/);
    assert.equal(run(['--manifest', manifestFile, '--list', '--group', '01']).count, 1);
    assert.throws(() => run(['--manifest', manifestFile, '--out', 'file.mov']), /cần --id/);
    fs.writeFileSync(manifestFile, JSON.stringify({frames: [{id: 'same'}, {id: 'same'}]}));
    assert.throws(() => readPack(manifestFile), /trùng/);
  } finally {
    fs.rmSync(temp, {recursive: true, force: true});
  }
});

test('real still exports preserve source, alpha, native size and MP4 technical properties', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cao-pack-render-'));
  try {
    const root = path.join(temp, 'pack');
    fs.mkdirSync(root);
    const source = path.join(root, 'frame.png');
    const generated = spawnSync(executable('ffmpeg'), ['-v', 'error', '-f', 'lavfi', '-i', 'color=c=red:s=16x16,format=rgba,pad=32:32:8:8:color=black@0', '-frames:v', '1', source], {encoding: 'utf8'});
    assert.equal(generated.status, 0, generated.error?.message || generated.stderr);
    const hash = () => createHash('sha256').update(fs.readFileSync(source)).digest('hex');
    const initialHash = hash();
    const manifestFile = path.join(root, 'manifest.json');
    fs.writeFileSync(manifestFile, JSON.stringify({frames: [{id: 'test', path: 'frame.png', group_id: '01', width: 32, height: 32, has_alpha: true, alpha_bbox: [8, 8, 24, 24], quality_flags: ['review_required']}]}));
    const pack = readPack(manifestFile);
    const options = {'ack-review': true, ffmpeg: executable('ffmpeg'), ffprobe: executable('ffprobe'), duration: 1, size: '64x96', bottom: 16, height: 40, fps: 24, out: path.join(temp, 'layer.mov')};
    assert.throws(() => exportStill(pack, 'test', {...options, 'ack-review': false}), /ack-review/);
    assert.throws(() => exportStill(pack, 'test', {...options, out: path.join(root, 'bad.mov')}), /bộ ảnh nguồn/);
    pack.manifest.frames[0].sha256 = '0'.repeat(64);
    assert.throws(() => exportStill(pack, 'test', options), /SHA-256/);
    pack.manifest.frames[0].sha256 = initialHash;
    assert.equal(fs.existsSync(options.out), false);
    const rendered = exportStill(pack, 'test', options);
    assert.equal(rendered.source_sha256, initialHash);
    assert.equal(rendered.production_approved, false);
    assert.equal(rendered.animation_verified, false);
    assert.deepEqual(rendered.quality_flags, ['review_required']);
    assert.equal(rendered.geometry.drawHeight, 16);
    assert.equal(rendered.measured.streams[0].codec_name, 'qtrle');
    assert.equal(rendered.measured.streams[0].pix_fmt, 'argb');
    assert.equal(rendered.measured.streams[0].r_frame_rate, '24/1');
    assert.equal(Number(rendered.measured.format.duration), 1);
    const decoded = spawnSync(executable('ffmpeg'), ['-v', 'error', '-i', options.out, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'], {encoding: null});
    assert.equal(decoded.status, 0);
    const pixel = (x, y) => [...decoded.stdout.subarray((y * 64 + x) * 4, (y * 64 + x) * 4 + 4)];
    assert.equal(pixel(0, 0)[3], 0, 'canvas must remain transparent');
    assert.equal(pixel(32, 72)[3], 255, 'selected image must remain opaque');
    assert.ok(pixel(32, 72)[0] > 240, 'selected image is red');
    assert.throws(() => exportStill(pack, 'test', options), /đã tồn tại/);
    const previewPath = path.join(temp, 'preview.mp4');
    const preview = exportStill(pack, 'test', {...options, bg: '1b2a49', out: previewPath});
    assert.equal(preview.measured.streams[0].codec_name, 'h264');
    assert.equal(preview.measured.streams[0].pix_fmt, 'yuv420p');
    assert.equal(preview.measured.streams[0].width, 64);
    assert.equal(preview.measured.streams[0].height, 96);
    const container = fs.readFileSync(previewPath);
    assert.ok(container.indexOf(Buffer.from('moov')) < container.indexOf(Buffer.from('mdat')), 'MP4 faststart');
    assert.equal(hash(), initialHash, 'source pixels must not change');
  } finally {
    fs.rmSync(temp, {recursive: true, force: true});
  }
});
