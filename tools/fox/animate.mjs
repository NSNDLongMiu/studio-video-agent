// Render normalized PNG sequences without inventing in-between poses or changing source pixels.
// node tools/fox/animate.mjs --list
// node tools/fox/animate.mjs --id wave --duration 4 --out <video>/assets/cao-wave.mov
// node tools/fox/animate.mjs --id wave --bg 1b2a49 --out <video>/assets/cao-wave-preview.mp4
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

export const DEFAULT_MANIFEST = fileURLToPath(new URL('../../brand/cao/production-pack/manifest.json', import.meta.url));
const LOCAL_BIN = 'C:/Users/PC/AppData/Local/ffmpeg/ffmpeg-master-latest-win64-gpl/bin';

export function readAnimationPack(file = DEFAULT_MANIFEST) {
  const manifestPath = fs.realpathSync(path.resolve(file));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, ''));
  if (!Array.isArray(manifest.animations)) throw new Error('Manifest phải có animations[].');
  const ids = manifest.animations.map((a) => a.id);
  if (ids.some((id) => typeof id !== 'string' || !id) || new Set(ids).size !== ids.length) throw new Error('Manifest có ID animation trống hoặc trùng.');
  return {root: path.dirname(manifestPath), manifestPath, manifest};
}

function positive(value, label, fallback) {
  const n = Number(value ?? fallback);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`${label} phải là số dương.`);
  return n;
}

function contained(root, file) {
  const relative = path.relative(root, file);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

export function resolveAnimation(pack, id) {
  const animation = pack.manifest.animations.find((a) => a.id === id);
  if (!animation) throw new Error(`Không có animation: ${id}. Dùng --list để tra cứu.`);
  if (!Array.isArray(animation.frames) || animation.frames.length < 2) throw new Error('Animation cần ít nhất hai frame PNG đã chuẩn hoá.');
  const [width, height] = animation.canvas || [];
  if (![width, height].every((n) => Number.isSafeInteger(n) && n > 0 && n <= 8192)) throw new Error('canvas cần [width,height] nguyên dương, tối đa 8192.');
  if (typeof animation.loop !== 'boolean') throw new Error('Manifest cần loop:true/false rõ ràng.');
  const fps = positive(animation.fps, 'fps nguồn');
  if (fps > 60) throw new Error('fps nguồn tối đa 60.');
  const anchor = animation.anchor ?? [width / 2, height];
  if (!Array.isArray(anchor) || anchor.length !== 2 || !anchor.every(Number.isFinite) || anchor[0] < 0 || anchor[0] > width || anchor[1] <= 0 || anchor[1] > height) throw new Error('anchor cần [x,y] nằm trong canvas.');
  if (animation.frame_sha256 !== undefined && (!Array.isArray(animation.frame_sha256) || animation.frame_sha256.length !== animation.frames.length || animation.frame_sha256.some((hash) => typeof hash !== 'string' || !/^[a-f0-9]{64}$/.test(hash)))) throw new Error('frame_sha256 phải khớp số lượng frame và chứa SHA-256 hợp lệ.');
  const frames = animation.frames.map((relative, index) => {
    if (typeof relative !== 'string' || path.isAbsolute(relative)) throw new Error('Frame cần đường dẫn tương đối với manifest.');
    const filename = fs.realpathSync(path.resolve(pack.root, relative));
    if (!contained(pack.root, filename)) throw new Error('Đường dẫn frame vượt ra ngoài thư viện.');
    const png = fs.readFileSync(filename);
    if (png.length < 33 || png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' || png.readUInt32BE(16) !== width || png.readUInt32BE(20) !== height || ![4, 6].includes(png[25])) throw new Error(`Frame ${index + 1} không phải PNG alpha cùng canvas ${width}×${height}.`);
    const sha256 = createHash('sha256').update(png).digest('hex');
    if (animation.frame_sha256 && animation.frame_sha256[index] !== sha256) throw new Error(`SHA-256 frame ${index + 1} không khớp manifest.`);
    return {path: filename, sha256};
  });
  return {animation, frames, canvas: [width, height], anchor, sourceFps: fps, naturalDuration: frames.length / fps};
}

export function animationGeometry(sequence, opt = {}) {
  const [width, height] = String(opt.size ?? '1080x1920').split('x').map(Number);
  if (![width, height].every((n) => Number.isSafeInteger(n) && n > 0 && n <= 8192) || width % 2 || height % 2) throw new Error('--size cần kích thước chẵn, ví dụ 1080x1920, tối đa 8192.');
  const fps = positive(opt.fps, '--fps', 30);
  if (fps > 60) throw new Error('--fps tối đa 60.');
  const bottom = Number(opt.bottom ?? 420);
  if (!Number.isFinite(bottom) || bottom < 0 || bottom >= height) throw new Error('--bottom phải nằm trong khung hình.');
  const [cw, ch] = sequence.canvas;
  const [ax, ay] = sequence.anchor;
  const wantedHeight = positive(opt.height, '--height', Math.min(760, ch));
  const margin = Math.floor(width * 0.04);
  const scale = Math.min(wantedHeight / ch, (width - 2 * margin) / cw, (height - bottom) / ay, bottom === 0 && ch > ay ? 0 : (ch > ay ? bottom / (ch - ay) : Infinity), opt['allow-upscale'] ? Infinity : 1);
  if (!(scale > 0)) throw new Error('Canvas/anchor không vừa vùng khung hình đã chọn.');
  const drawWidth = Math.max(1, Math.floor(cw * scale));
  const drawHeight = Math.max(1, Math.floor(ch * scale));
  const anchorX = ax * drawWidth / cw;
  const anchorY = ay * drawHeight / ch;
  const pos = opt.pos ?? 'center';
  if (!['left', 'center', 'right'].includes(pos)) throw new Error('--pos cần left, center hoặc right.');
  const x = pos === 'left' ? margin : pos === 'right' ? width - margin - drawWidth : Math.floor(width / 2 - anchorX);
  const y = Math.floor(height - bottom - anchorY);
  if (x < 0 || y < 0 || x + drawWidth > width || y + drawHeight > height) throw new Error('Vị trí anchor làm canvas vượt khung; chọn size/height/pos phù hợp.');
  const repeat = opt.repeat ?? (sequence.animation.loop ? 'loop' : 'hold');
  if (!['loop', 'hold', 'once'].includes(repeat)) throw new Error('--repeat cần loop, hold hoặc once.');
  const requested = positive(opt.duration, '--duration', sequence.naturalDuration);
  if (requested > 3600) throw new Error('--duration tối đa 3600 giây.');
  const duration = repeat === 'once' ? Math.min(requested, sequence.naturalDuration) : requested;
  return {width, height, fps, duration, repeat, source_fps: sequence.sourceFps, source_duration: sequence.naturalDuration, drawWidth, drawHeight, x, y, ground: [x + anchorX, y + anchorY], upscaled: drawHeight > ch, interpolation: false};
}

function executable(opt, kind) {
  if (opt[kind]) return String(opt[kind]);
  if (process.env[kind.toUpperCase()]) return process.env[kind.toUpperCase()];
  if (kind === 'ffprobe' && opt.ffmpeg) {
    const sibling = path.join(path.dirname(String(opt.ffmpeg)), process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe');
    if (fs.existsSync(sibling)) return sibling;
  }
  const local = path.join(LOCAL_BIN, `${kind}.exe`);
  return fs.existsSync(local) ? local : kind;
}

function resolvedDestination(file) {
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

export function renderAnimation(pack, id, opt = {}) {
  const sequence = resolveAnimation(pack, id);
  if (sequence.animation.quality_status !== 'PASS' && !opt.review) throw new Error(`Animation ${id} chưa có quality_status PASS; chỉ dùng --review để tạo clip kiểm tra, không đưa vào thành phẩm.`);
  if (sequence.animation.quality_status === 'FAILED') throw new Error(`Animation ${id} đã FAILED; cần sửa frame trước khi dựng.`);
  if (!opt.out) throw new Error('Cần --out <file.mov> hoặc --bg <màu> --out <file.mp4>.');
  const g = animationGeometry(sequence, opt);
  const out = path.resolve(String(opt.out));
  const destination = resolvedDestination(out);
  if (contained(pack.root, destination)) {
    // Keep ready-to-use derivatives in the pack, but never allow source/manifest replacement.
    const relative = path.relative(pack.root, destination).split(path.sep)[0];
    if (!['clips', 'previews'].includes(relative)) throw new Error('Output trong thư viện chỉ được đặt tại clips/ hoặc previews/.');
  }
  if (sequence.frames.some((frame) => frame.path.toLowerCase() === destination.toLowerCase())) throw new Error('Output không được ghi đè frame nguồn.');
  const bg = opt.bg !== undefined;
  if (bg && !/^(?:0x|#)?[0-9a-fA-F]{6}$/.test(String(opt.bg))) throw new Error('--bg cần RGB, ví dụ 1b2a49.');
  if (path.extname(out).toLowerCase() !== (bg ? '.mp4' : '.mov')) throw new Error(bg ? 'Preview nền màu cần .mp4.' : 'Lớp alpha cần .mov.');
  if (fs.existsSync(out) && !opt.overwrite) throw new Error('Output đã tồn tại; dùng --overwrite để ghi đè.');
  fs.mkdirSync(path.dirname(out), {recursive: true});
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cao-animate-'));
  try {
    sequence.frames.forEach((frame, i) => fs.copyFileSync(frame.path, path.join(temp, `frame_${String(i).padStart(6, '0')}.png`)));
    const input = path.join(temp, 'frame_%06d.png');
    const color = bg ? `0x${String(opt.bg).replace(/^(?:#|0x)/, '')}` : 'black@0';
    const canvas = `color=c=${color}:s=${g.width}x${g.height}:r=${g.fps}:d=${g.duration},format=rgba`;
    const filter = `[0:v]format=rgba,scale=${g.drawWidth}:${g.drawHeight}:flags=lanczos,setsar=1,fps=${g.fps}[fg];[1:v][fg]overlay=x=${g.x}:y=${g.y}:format=auto:eof_action=repeat,format=${bg ? 'yuv420p' : 'argb'}[v]`;
    const result = spawnSync(executable(opt, 'ffmpeg'), [opt.overwrite ? '-y' : '-n', '-v', 'error', ...(g.repeat === 'loop' ? ['-loop', '1'] : []), '-framerate', String(sequence.sourceFps), '-start_number', '0', '-i', input, '-f', 'lavfi', '-i', canvas, '-filter_complex', filter, '-map', '[v]', '-an', '-t', String(g.duration), '-r', String(g.fps), ...(bg ? ['-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'] : ['-c:v', 'qtrle', '-pix_fmt', 'argb']), out], {encoding: 'utf8', maxBuffer: 8 * 1024 * 1024});
    if (result.error || result.status !== 0) throw new Error(`ffmpeg: ${result.error?.message || result.stderr}`);
    const measured = spawnSync(executable(opt, 'ffprobe'), ['-v', 'error', '-show_entries', 'format=duration:stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_frames', '-of', 'json', out], {encoding: 'utf8'});
    if (measured.error || measured.status !== 0) throw new Error(`ffprobe: ${measured.error?.message || measured.stderr}`);
    return {out, animation_id: id, source_frames: sequence.frames.length, source_sha256: sequence.frames.map((f) => f.sha256), quality_status: sequence.animation.quality_status, review_only: sequence.animation.quality_status !== 'PASS', geometry: g, measured: JSON.parse(measured.stdout)};
  } finally {
    fs.rmSync(temp, {recursive: true, force: true});
  }
}

function parseArgs(argv) {
  const flags = new Set(['list', 'help', 'overwrite', 'review', 'allow-upscale']);
  const values = new Set(['manifest', 'id', 'out', 'fps', 'duration', 'repeat', 'size', 'height', 'bottom', 'pos', 'bg', 'ffmpeg', 'ffprobe']);
  const opt = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) throw new Error(`Tuỳ chọn không hợp lệ: ${argv[i]}`);
    const key = argv[i].slice(2);
    if (flags.has(key)) opt[key] = true;
    else if (values.has(key)) {
      if (!argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(`Thiếu giá trị --${key}.`);
      opt[key] = argv[++i];
    } else throw new Error(`Tuỳ chọn không hợp lệ: ${argv[i]}`);
  }
  return opt;
}

export function run(argv) {
  const opt = parseArgs(argv);
  if (opt.help) return {usage: ['node tools/fox/animate.mjs --list', 'node tools/fox/animate.mjs --id <animation>', 'node tools/fox/animate.mjs --id <animation> --duration 4 --out <video>/assets/cao.mov', 'node tools/fox/animate.mjs --id <animation> --bg 1b2a49 --out <video>/assets/preview.mp4'], options: '--manifest --duration --repeat loop|hold|once --fps 30 --size 1080x1920 --height 760 --bottom 420 --pos center|left|right --allow-upscale --review --ffmpeg --ffprobe --overwrite', note: 'Giữ thứ tự frame, tốc độ nguồn và anchor; chỉ lặp/giữ ảnh, không tạo nội suy. REVIEW_REQUIRED chỉ xuất kiểm tra bằng --review.'};
  const pack = readAnimationPack(opt.manifest);
  if (opt.id) {
    if (opt.out) return renderAnimation(pack, opt.id, opt);
    const sequence = resolveAnimation(pack, opt.id);
    return {manifest: pack.manifestPath, animation: sequence.animation, source_frames: sequence.frames.length, natural_duration: sequence.naturalDuration};
  }
  if (opt.out) throw new Error('--out cần --id.');
  return {manifest: pack.manifestPath, count: pack.manifest.animations.length, animations: pack.manifest.animations.map(({id, label, frames, fps, loop, quality_status, canvas, anchor}) => ({id, label, frame_count: frames?.length, fps, loop, quality_status, canvas, anchor}))};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(run(process.argv.slice(2)), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
