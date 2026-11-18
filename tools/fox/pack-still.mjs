// Tra cứu / xuất MỘT ảnh tĩnh từ bộ Cáo Mít nhập khẩu; không suy diễn chuyển động.
// Không thay thế 46 pose hiện tại và không cấp duyệt sản xuất cho asset.
// node tools/fox/pack-still.mjs --list --group 04
// node tools/fox/pack-still.mjs --id cao_mit_05_005 --ack-review --out <video>/assets/cao-still.mov
// node tools/fox/pack-still.mjs --id cao_mit_05_005 --ack-review --bg 1b2a49 --out <video>/assets/cao-preview.mp4
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

export const DEFAULT_MANIFEST = fileURLToPath(new URL('../../brand/cao/animation-pack/manifest.json', import.meta.url));
const DEFAULT_FFMPEG = 'C:/Users/PC/AppData/Local/ffmpeg/ffmpeg-master-latest-win64-gpl/bin/ffmpeg.exe';
const DEFAULT_FFPROBE = 'C:/Users/PC/AppData/Local/ffmpeg/ffmpeg-master-latest-win64-gpl/bin/ffprobe.exe';

export function readPack(file = DEFAULT_MANIFEST) {
  const manifestPath = fs.realpathSync(path.resolve(file));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, ''));
  if (!Array.isArray(manifest.frames)) throw new Error('Manifest phải có frames[].');
  const ids = manifest.frames.map((f) => f.id);
  if (ids.some((id) => typeof id !== 'string' || !id) || new Set(ids).size !== ids.length) throw new Error('Manifest có ID trống hoặc trùng.');
  return {manifestPath, root: path.dirname(manifestPath), manifest};
}

export function resolveFrame(pack, id) {
  const frame = pack.manifest.frames.find((f) => f.id === id);
  if (!frame) throw new Error(`Không có asset: ${id}. Dùng --list để tra cứu.`);
  if (typeof frame.path !== 'string' || path.isAbsolute(frame.path)) throw new Error('Đường dẫn asset phải tương đối với manifest.');
  const imagePath = fs.realpathSync(path.resolve(pack.root, frame.path));
  const relative = path.relative(pack.root, imagePath);
  if (relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) throw new Error('Đường dẫn asset vượt ra ngoài thư mục bộ ảnh.');
  return {frame, imagePath};
}

function positive(value, name, fallback) {
  const n = Number(value ?? fallback);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`${name} phải là số dương.`);
  return n;
}

export function stillGeometry(frame, opt = {}) {
  if (![frame.width, frame.height].every((n) => Number.isSafeInteger(n) && n > 0)) throw new Error('Kích thước ảnh trong manifest không hợp lệ.');
  const [width, height] = String(opt.size ?? '1080x1920').split('x').map(Number);
  if (![width, height].every((n) => Number.isSafeInteger(n) && n > 0 && n <= 8192) || width % 2 || height % 2) throw new Error('--size cần dạng 1080x1920 với kích thước chẵn, tối đa 8192.');
  const duration = positive(opt.duration, '--duration', 2);
  if (duration > 3600) throw new Error('--duration tối đa 3600 giây.');
  const fps = positive(opt.fps, '--fps', 30);
  if (fps > 60) throw new Error('--fps tối đa 60.');
  const bottom = Number(opt.bottom ?? 420);
  if (!Number.isFinite(bottom) || bottom < 0 || bottom >= height) throw new Error('--bottom phải nằm trong khung hình.');
  if (!frame.has_alpha) throw new Error('Asset không có alpha; không xuất lớp trong suốt từ ảnh này.');
  const bbox = frame.alpha_bbox;
  if (!Array.isArray(bbox) || bbox.length !== 4 || !bbox.every(Number.isSafeInteger)) throw new Error('alpha_bbox trống hoặc không hợp lệ.');
  const [x0, y0, x1, y1] = bbox;
  if (x0 < 0 || y0 < 0 || x1 <= x0 || y1 <= y0 || x1 > frame.width || y1 > frame.height) throw new Error('alpha_bbox vượt kích thước ảnh.');
  const nativeWidth = x1 - x0;
  const nativeHeight = y1 - y0;
  const wantedHeight = positive(opt.height, '--height', nativeHeight);
  const margin = Math.floor(width * 0.04);
  const scale = Math.min(wantedHeight / nativeHeight, (width - 2 * margin) / nativeWidth, (height - bottom) / nativeHeight, opt['allow-upscale'] ? Infinity : 1);
  const drawWidth = Math.max(1, Math.floor(nativeWidth * scale));
  const drawHeight = Math.max(1, Math.floor(nativeHeight * scale));
  const pos = opt.pos ?? 'center';
  if (!['left', 'center', 'right'].includes(pos)) throw new Error('--pos cần left, center hoặc right.');
  const x = pos === 'left' ? margin : pos === 'right' ? width - margin - drawWidth : Math.floor((width - drawWidth) / 2);
  const y = Math.floor(height - bottom - drawHeight);
  return {width, height, fps, duration, crop: {x: x0, y: y0, width: nativeWidth, height: nativeHeight}, drawWidth, drawHeight, x, y, upscaled: drawHeight > nativeHeight, height_capped_to_native: !opt['allow-upscale'] && wantedHeight > nativeHeight};
}

function executable(opt, kind) {
  if (opt[kind]) return String(opt[kind]);
  if (process.env[kind.toUpperCase()]) return process.env[kind.toUpperCase()];
  if (kind === 'ffprobe' && opt.ffmpeg) {
    const sibling = path.join(path.dirname(String(opt.ffmpeg)), process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe');
    if (fs.existsSync(sibling)) return sibling;
  }
  const fallback = kind === 'ffmpeg' ? DEFAULT_FFMPEG : DEFAULT_FFPROBE;
  if (fs.existsSync(fallback)) return fallback;
  const bundled = fileURLToPath(new URL(`../../studio/renderer-remotion/node_modules/@remotion/compositor-win32-x64-msvc/${kind}.exe`, import.meta.url));
  return fs.existsSync(bundled) ? bundled : kind;
}

function resolvedDestination(file) {
  // Follow existing junctions/symlinks before checking that output is outside the pack.
  let parent = file;
  const suffix = [];
  while (!fs.existsSync(parent)) {
    suffix.unshift(path.basename(parent));
    const next = path.dirname(parent);
    if (next === parent) throw new Error('Không xác định được thư mục output.');
    parent = next;
  }
  return path.join(fs.realpathSync(parent), ...suffix);
}

export function exportStill(pack, id, opt) {
  if (!opt['ack-review']) throw new Error('Asset cần xem lại crop/nền/chất lượng. Kiểm tra catalog rồi dùng --ack-review để xuất ảnh tĩnh đã chọn; cờ này không cấp duyệt sản xuất.');
  const {frame, imagePath} = resolveFrame(pack, id);
  const geometry = stillGeometry(frame, opt);
  const source = fs.readFileSync(imagePath);
  if (source.length < 26 || source.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' || source.readUInt32BE(16) !== frame.width || source.readUInt32BE(20) !== frame.height) throw new Error('PNG không hợp lệ hoặc kích thước không khớp manifest.');
  const sourceSha256 = createHash('sha256').update(source).digest('hex');
  if (frame.sha256 && frame.sha256 !== sourceSha256) throw new Error('SHA-256 ảnh không khớp manifest; dừng để giữ đúng nguồn gốc asset.');
  const out = path.resolve(String(opt.out));
  const inputRoot = fs.realpathSync(pack.root);
  const outRelative = path.relative(inputRoot, resolvedDestination(out));
  if (outRelative !== '..' && !outRelative.startsWith(`..${path.sep}`) && !path.isAbsolute(outRelative)) throw new Error('Không ghi output vào bộ ảnh nguồn. Chọn thư mục assets/ của video.');
  const bg = opt.bg !== undefined;
  if (bg && !/^(?:0x|#)?[0-9a-fA-F]{6}$/.test(String(opt.bg))) throw new Error('--bg cần màu RGB, ví dụ 1b2a49.');
  if (path.extname(out).toLowerCase() !== (bg ? '.mp4' : '.mov')) throw new Error(bg ? 'Preview nền màu cần --out .mp4.' : 'Lớp trong suốt cần --out .mov.');
  if (fs.existsSync(out) && !opt.overwrite) throw new Error('Output đã tồn tại; dùng --overwrite nếu muốn ghi đè.');
  const g = geometry;
  const color = bg ? String(opt.bg).replace(/^#/, '0x').replace(/^(?!0x)/, '0x') : 'black@0';
  const canvas = `color=c=${color}:s=${g.width}x${g.height}:r=${g.fps}:d=${g.duration},format=rgba`;
  const filter = `[0:v]format=rgba,crop=${g.crop.width}:${g.crop.height}:${g.crop.x}:${g.crop.y},scale=${g.drawWidth}:${g.drawHeight}:flags=lanczos[fg];[1:v][fg]overlay=x=${g.x}:y=${g.y}:format=auto,format=${bg ? 'yuv420p' : 'argb'}[v]`;
  fs.mkdirSync(path.dirname(out), {recursive: true});
  const result = spawnSync(executable(opt, 'ffmpeg'), [opt.overwrite ? '-y' : '-n', '-v', 'error', '-loop', '1', '-framerate', String(g.fps), '-i', imagePath, '-f', 'lavfi', '-i', canvas, '-filter_complex', filter, '-map', '[v]', '-an', '-t', String(g.duration), '-r', String(g.fps), ...(bg ? ['-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'] : ['-c:v', 'qtrle', '-pix_fmt', 'argb']), out], {encoding: 'utf8', maxBuffer: 4 * 1024 * 1024});
  if (result.error || result.status !== 0) {
    const hint = /Unknown encoder/.test(result.stderr || '') ? ' Bản FFmpeg đang chọn thiếu encoder cần thiết; truyền --ffmpeg <bản FFmpeg đầy đủ> (bản kèm Remotion có thể không có qtrle).' : '';
    throw new Error(`ffmpeg: ${result.error?.message || result.stderr}${hint}`);
  }
  const probe = spawnSync(executable(opt, 'ffprobe'), ['-v', 'error', '-show_entries', 'format=duration:stream=codec_name,width,height,pix_fmt,r_frame_rate', '-of', 'json', out], {encoding: 'utf8'});
  if (probe.error || probe.status !== 0) throw new Error(`Đã xuất clip nhưng ffprobe thất bại: ${probe.error?.message || probe.stderr}`);
  return {out, asset_id: id, source_sha256: sourceSha256, mode: 'still_image', animation_verified: false, production_approved: false, quality_flags: frame.quality_flags || [], geometry, measured: JSON.parse(probe.stdout), warning: 'Ảnh tĩnh gốc; không nhép miệng, không suy diễn chuyển động. Cần QC hình thật theo từng cảnh.'};
}

function parseArgs(argv) {
  const opt = {};
  const booleans = new Set(['list', 'help', 'allow-upscale', 'overwrite', 'ack-review']);
  const values = new Set(['manifest', 'group', 'id', 'out', 'duration', 'height', 'bottom', 'pos', 'size', 'fps', 'bg', 'ffmpeg', 'ffprobe']);
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i].replace(/^--/, '');
    if (!argv[i].startsWith('--') || (!booleans.has(key) && !values.has(key))) throw new Error(`Tuỳ chọn không hợp lệ: ${argv[i]}`);
    if (booleans.has(key)) opt[key] = true;
    else {
      if (!argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(`Thiếu giá trị --${key}.`);
      opt[key] = argv[++i];
    }
  }
  return opt;
}

export function run(argv) {
  const opt = parseArgs(argv);
  if (opt.help) return {usage: ['node tools/fox/pack-still.mjs --list [--group 05]', 'node tools/fox/pack-still.mjs --id cao_mit_05_005', 'node tools/fox/pack-still.mjs --id cao_mit_05_005 --ack-review --out <video>/assets/cao-still.mov', 'node tools/fox/pack-still.mjs --id cao_mit_05_005 --ack-review --bg 1b2a49 --out <video>/assets/cao-preview.mp4'], options: '--manifest --duration 2 --height <px> --bottom 420 --pos center|left|right --size 1080x1920 --fps 30 --allow-upscale --ffmpeg <exe> --ffprobe <exe> --overwrite', note: 'Chỉ ảnh tĩnh; mặc định không phóng vượt độ cao vùng alpha. --ack-review xác nhận đã xem ảnh, không cấp duyệt sản xuất.'};
  const pack = readPack(opt.manifest);
  if (opt.id) {
    if (opt.out) return exportStill(pack, opt.id, opt);
    return {...resolveFrame(pack, opt.id), production_approved: false, animation_verified: false};
  }
  if (opt.out) throw new Error('--out cần --id.');
  const frames = pack.manifest.frames.filter((f) => !opt.group || f.group_id === opt.group);
  if (opt.group && frames.length === 0) throw new Error(`Không có nhóm: ${opt.group}.`);
  return {manifest: pack.manifestPath, count: frames.length, animation_verified: false, production_approved: false, groups: pack.manifest.groups || [], frames: frames.map(({id, path: image, group_id, width, height, quality_flags}) => ({id, path: image, group_id, width, height, quality_flags}))};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    console.log(JSON.stringify(run(process.argv.slice(2)), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
