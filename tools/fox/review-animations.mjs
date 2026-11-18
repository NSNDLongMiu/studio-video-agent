// Reproducible encode/decode review artifacts. Never changes manifest quality status.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {readAnimationPack, resolveAnimation, renderAnimation} from './animate.mjs';

const LOCAL_BIN = 'C:/Users/PC/AppData/Local/ffmpeg/ffmpeg-master-latest-win64-gpl/bin';

export function reviewAnimation(pack, id, opt = {}) {
  const sequence = resolveAnimation(pack, id);
  const a = sequence.animation;
  const exe = opt.ffmpeg || process.env.FFMPEG || (fs.existsSync(path.join(LOCAL_BIN, 'ffmpeg.exe')) ? path.join(LOCAL_BIN, 'ffmpeg.exe') : 'ffmpeg');
  const command = (args, binary = false) => {
    const result = spawnSync(exe, ['-y', '-v', 'error', ...args], {encoding: binary ? null : 'utf8', maxBuffer: 32 * 1024 * 1024});
    if (result.error || result.status !== 0) throw new Error(result.error?.message || String(result.stderr));
    return result.stdout;
  };
  fs.mkdirSync(path.join(pack.root, 'qc'), {recursive: true});
  const record = {id, source_frame_sha256: sequence.frames.map((f) => f.sha256), frames: sequence.frames.length, status_at_review: a.quality_status, previews: [], visual_review: 'PENDING'};
  const rows = [];
  for (const [name, color] of [['dark', '1b2a49'], ['light', 'f1f3f5']]) {
    const out = path.join(pack.root, 'previews', `${id}${name === 'light' ? '-light' : ''}.mp4`);
    const result = renderAnimation(pack, id, {...opt, out, bg: color, review: true, duration: Math.max(2, sequence.naturalDuration), overwrite: true});
    record.previews.push(result);
    const pictures = [];
    for (const [i, time] of [0, .25, .5, .75].entries()) {
      const picture = path.join(pack.root, 'qc', `${id}-${name}-${i}.png`);
      command(['-ss', String(time), '-i', out, '-vf', `crop=${result.geometry.drawWidth}:${result.geometry.drawHeight}:${result.geometry.x}:${result.geometry.y}`, '-frames:v', '1', picture]);
      pictures.push(picture);
    }
    const strip = path.join(pack.root, 'qc', `${id}-${name}-strip.png`);
    command([...pictures.flatMap((p) => ['-i', p]), '-filter_complex', 'hstack=inputs=4', '-frames:v', '1', strip]);
    rows.push(strip);
    if (name === 'dark') {
      const frames = [];
      for (let i = 0; i < sequence.frames.length; i++) {
        const picture = path.join(pack.root, 'qc', `${id}-all-${i}.png`);
        command(['-ss', String(i / sequence.sourceFps), '-i', out, '-vf', `crop=${result.geometry.drawWidth}:${result.geometry.drawHeight}:${result.geometry.x}:${result.geometry.y}`, '-frames:v', '1', picture]);
        frames.push(picture);
      }
      const g = result.geometry;
      const layout = frames.map((_, i) => `${(i % 4) * g.drawWidth}_${Math.floor(i / 4) * g.drawHeight}`).join('|');
      record.all_frame_montage = `qc/${id}-all-review.png`;
      command([...frames.flatMap((p) => ['-i', p]), '-filter_complex', `xstack=inputs=${frames.length}:layout=${layout}`, '-frames:v', '1', path.join(pack.root, record.all_frame_montage)]);
    }
  }
  record.montage = `qc/${id}-review.png`;
  command([...rows.flatMap((p) => ['-i', p]), '-filter_complex', 'vstack=inputs=2', '-frames:v', '1', path.join(pack.root, record.montage)]);
  const pixels = sequence.frames.map((f) => command(['-i', f.path, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'], true));
  const expectedBytes = sequence.canvas[0] * sequence.canvas[1] * 4;
  if (pixels.some((frame) => frame.length !== expectedBytes)) throw new Error('Decoded source byte count differs from normalized canvas.');
  function change(first, second, rect = [0, 0, ...sequence.canvas]) {
    let total = 0, changed = 0, visible = 0;
    const [x0, y0, x1, y1] = rect;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      const i = (y * sequence.canvas[0] + x) * 4;
      const a0 = first[i + 3], a1 = second[i + 3];
      if (a0 < 32 && a1 < 32) continue;
      visible++;
      let maximum = Math.abs(a0 - a1), sum = maximum;
      for (let c = 0; c < 3; c++) {
        const d = Math.abs(first[i + c] * a0 / 255 - second[i + c] * a1 / 255);
        sum += d; maximum = Math.max(maximum, d);
      }
      total += sum / 4;
      if (maximum > 8) changed++;
    }
    return {visible_union_pixels: visible, changed_visible_pixels: changed, changed_visible_fraction: Number((changed / Math.max(1, visible)).toFixed(6)), mean_premultiplied_channel_difference: Number((total / Math.max(1, visible)).toFixed(6))};
  }
  record.motion_metrics = {
    unique_source_pngs: new Set(sequence.frames.map((f) => f.sha256)).size,
    unique_decoded_rgba_frames: new Set(pixels.map((p) => createHash('sha256').update(p).digest('hex'))).size,
    adjacent: pixels.slice(1).map((frame, i) => change(pixels[i], frame)),
    last_to_first: change(pixels.at(-1), pixels[0]),
    explanation: 'Visible support alpha>=32; RGB differences are premultiplied by alpha. Pixel variation alone does not prove correct motion; inspect actual composites.',
  };
  return record;
}

export function reviewPack(opt = {}) {
  const pack = readAnimationPack(opt.manifest);
  const reportFile = path.join(pack.root, 'qc', 'animation-review.json');
  const report = fs.existsSync(reportFile) ? JSON.parse(fs.readFileSync(reportFile, 'utf8')) : {review_samples_seconds: [0, .25, .5, .75], dark_top_light_bottom: true, animations: []};
  const ids = opt.ids || pack.manifest.animations.map((a) => a.id);
  for (const id of ids) {
    const record = reviewAnimation(pack, id, opt);
    const index = report.animations.findIndex((a) => a.id === id);
    if (index >= 0) report.animations[index] = record;
    else report.animations.push(record);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
    console.log(`${id}: actual previews and ordered source-frame montage ready`);
  }
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const opt = {ids: []};
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--id') opt.ids.push(process.argv[++i]);
    else if (process.argv[i] === '--manifest') opt.manifest = process.argv[++i];
    else throw new Error(`Unknown option: ${process.argv[i]}`);
  }
  if (opt.ids.length === 0) delete opt.ids;
  reviewPack(opt);
}
