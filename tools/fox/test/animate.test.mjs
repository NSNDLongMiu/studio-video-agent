import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readAnimationPack, resolveAnimation, animationGeometry, renderAnimation, run} from '../animate.mjs';

const BIN = 'C:/Users/PC/AppData/Local/ffmpeg/ffmpeg-master-latest-win64-gpl/bin';
const ffmpeg = process.env.FFMPEG || path.join(BIN, 'ffmpeg.exe');
const ffprobe = process.env.FFPROBE || path.join(BIN, 'ffprobe.exe');
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');

function fixture(dir) {
  const root = path.join(dir, 'pack');
  fs.mkdirSync(root);
  const frames = [];
  for (const [i, color] of ['red', 'lime', 'blue'].entries()) {
    const name = `f${i}.png`;
    const made = spawnSync(ffmpeg, ['-v', 'error', '-f', 'lavfi', '-i', `color=c=${color}:s=8x8,format=rgba,pad=32:32:8:8:color=black@0`, '-frames:v', '1', path.join(root, name)], {encoding: 'utf8'});
    assert.equal(made.status, 0, made.error?.message || made.stderr);
    frames.push(name);
  }
  const animation = {id: 'wave', label: 'fixture', frames, fps: 4, loop: false, canvas: [32, 32], anchor: [16, 28], quality_status: 'PASS', frame_sha256: frames.map((f) => hash(path.join(root, f)))};
  const manifest = path.join(root, 'manifest.json');
  fs.writeFileSync(manifest, JSON.stringify({animations: [animation]}));
  return {root, manifest, animation};
}

test('animation metadata, path, alpha, hash and review gate keep wrong frames out', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cao-animate-guards-'));
  try {
    const {root, manifest, animation} = fixture(temp);
    const pack = readAnimationPack(manifest);
    assert.equal(run(['--manifest', manifest, '--list']).count, 1);
    assert.equal(resolveAnimation(pack, 'wave').naturalDuration, 0.75);
    assert.throws(() => resolveAnimation(pack, 'missing'), /Không có animation/);
    const options = {out: path.join(temp, 'out.mov'), ffmpeg, ffprobe};
    animation.quality_status = 'REVIEW_REQUIRED';
    pack.manifest.animations[0] = animation;
    assert.throws(() => renderAnimation(pack, 'wave', options), /quality_status PASS/);
    animation.quality_status = 'FAILED';
    assert.throws(() => renderAnimation(pack, 'wave', {...options, review: true}), /FAILED/);
    animation.quality_status = 'PASS';
    animation.fps = 0;
    assert.throws(() => resolveAnimation(pack, 'wave'), /fps nguồn/);
    animation.fps = 4;
    animation.frame_sha256[0] = '0'.repeat(64);
    assert.throws(() => resolveAnimation(pack, 'wave'), /SHA-256/);
    animation.frame_sha256[0] = hash(path.join(root, 'f0.png'));
    fs.copyFileSync(path.join(root, 'f0.png'), path.join(temp, 'outside.png'));
    animation.frames[0] = '../outside.png';
    assert.throws(() => resolveAnimation(pack, 'wave'), /vượt ra ngoài/);
    animation.frames[0] = 'f0.png';
    const seq = resolveAnimation(pack, 'wave');
    assert.equal(animationGeometry(seq, {size: '64x96', bottom: 16, height: 64}).drawHeight, 32, 'no implicit upscale');
    assert.equal(animationGeometry(seq, {size: '64x96', bottom: 16, height: 64, 'allow-upscale': true}).upscaled, true);
    assert.throws(() => animationGeometry(seq, {fps: 0}), /fps/);
    assert.throws(() => animationGeometry(seq, {size: '64x95'}), /size/);
    assert.throws(() => animationGeometry(seq, {repeat: 'invent'}), /repeat/);
    assert.throws(() => renderAnimation(pack, 'wave', {...options, out: path.join(root, 'bad.mov')}), /clips/);
  } finally { fs.rmSync(temp, {recursive: true, force: true}); }
});

test('real animation encode preserves alpha, source order, hold/loop timing and source files', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cao-animate-encode-'));
  try {
    const {root, manifest, animation} = fixture(temp);
    const initial = animation.frames.map((f) => hash(path.join(root, f)));
    const pack = readAnimationPack(manifest);
    const options = {ffmpeg, ffprobe, size: '64x96', bottom: 16, height: 32, fps: 8, duration: 1.25};
    const out = path.join(temp, 'hold.mov');
    const result = renderAnimation(pack, 'wave', {...options, out});
    assert.equal(result.geometry.repeat, 'hold');
    assert.equal(result.geometry.interpolation, false);
    assert.equal(result.measured.streams[0].codec_name, 'qtrle');
    assert.equal(result.measured.streams[0].pix_fmt, 'argb');
    assert.equal(Number(result.measured.format.duration), 1.25);
    function pixels(file) {
      const decoded = spawnSync(ffmpeg, ['-v', 'error', '-i', file, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'], {encoding: null, maxBuffer: 8 * 1024 * 1024});
      assert.equal(decoded.status, 0, decoded.stderr?.toString());
      return (frame, x, y) => [...decoded.stdout.subarray(((frame * 64 * 96) + y * 64 + x) * 4, ((frame * 64 * 96) + y * 64 + x) * 4 + 4)];
    }
    const pixel = pixels(out);
    assert.deepEqual(pixel(0, 0, 0), [0, 0, 0, 0]);
    assert.ok(pixel(0, 28, 64)[0] > 245, 'first source frame red');
    assert.ok(pixel(2, 28, 64)[1] > 245, 'second source frame lime');
    assert.ok(pixel(4, 28, 64)[2] > 245, 'third source frame blue');
    assert.ok(pixel(8, 28, 64)[2] > 245, 'one-shot holds last frame');
    const loopOut = path.join(temp, 'loop.mov');
    renderAnimation(pack, 'wave', {...options, repeat: 'loop', out: loopOut});
    assert.ok(pixels(loopOut)(8, 28, 64)[1] > 245, 'explicit loop restarts in source order');
    const once = renderAnimation(pack, 'wave', {...options, repeat: 'once', out: path.join(temp, 'once.mov')});
    assert.equal(Number(once.measured.format.duration), 0.75, 'once ends at natural duration');
    const previewOut = path.join(temp, 'preview.mp4');
    const preview = renderAnimation(pack, 'wave', {...options, out: previewOut, bg: '1b2a49'});
    assert.equal(preview.measured.streams[0].codec_name, 'h264');
    assert.equal(preview.measured.streams[0].pix_fmt, 'yuv420p');
    const mp4 = fs.readFileSync(previewOut);
    assert.ok(mp4.indexOf(Buffer.from('moov')) < mp4.indexOf(Buffer.from('mdat')));
    assert.deepEqual(animation.frames.map((f) => hash(path.join(root, f))), initial);
    assert.throws(() => renderAnimation(pack, 'wave', {...options, out}), /đã tồn tại/);
  } finally { fs.rmSync(temp, {recursive: true, force: true}); }
});
