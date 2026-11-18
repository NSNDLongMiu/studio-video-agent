// Create a silent Vietnamese review reel from the official portrait previews.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {readAnimationPack} from './animate.mjs';

export function showcaseProduction(opt = {}) {
  const pack = readAnimationPack(opt.manifest);
  const animations = pack.manifest.animations;
  if (!animations.length || animations.some((a) => a.quality_status !== 'PASS')) throw new Error('Showcase cần tất cả animation đã PASS.');
  if (animations.some((a) => typeof a.label !== 'string' || /[?\uFFFD]/.test(a.label))) throw new Error('Nhãn hành động có lỗi mã hoá; cần sửa UTF-8 trước khi dựng.');
  const local = 'C:/Users/PC/AppData/Local/ffmpeg/ffmpeg-master-latest-win64-gpl/bin';
  const ffmpeg = opt.ffmpeg || process.env.FFMPEG || (fs.existsSync(path.join(local, 'ffmpeg.exe')) ? path.join(local, 'ffmpeg.exe') : 'ffmpeg');
  const ffprobe = opt.ffprobe || process.env.FFPROBE || (fs.existsSync(path.join(local, 'ffprobe.exe')) ? path.join(local, 'ffprobe.exe') : 'ffprobe');
  const out = path.resolve(opt.out || path.join(pack.root, 'showcase.mp4'));
  const inputs = animations.map((a) => path.join(pack.root, 'previews', `${a.id}.mp4`));
  if (inputs.some((p) => !fs.existsSync(p))) throw new Error('Thiếu preview chính thức; xuất đủ clip trước khi dựng showcase.');
  if (inputs.some((p) => path.resolve(p).toLowerCase() === out.toLowerCase())) throw new Error('Showcase không được ghi đè preview nguồn.');
  if (fs.existsSync(out) && !opt.overwrite) throw new Error('Showcase đã có; dùng --overwrite nếu cần cập nhật.');
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cao-showcase-'));
  const escape = (s) => s.replaceAll('\\', '/').replaceAll(':', '\\:').replaceAll("'", "'\\''");
  const font = escape('C:/Windows/Fonts/segoeui.ttf');
  const bold = escape('C:/Windows/Fonts/segoeuib.ttf');
  function execute(args, binary = ffmpeg) {
    const result = spawnSync(binary, ['-v', 'error', ...args], {encoding: 'utf8', maxBuffer: 4 * 1024 * 1024});
    if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stderr);
    return result.stdout;
  }
  try {
    const segments = [];
    for (const [i, a] of animations.entries()) {
      const lines = [
        ['CÁO VĂN PHÒNG', 46, 260, 'white', bold],
        [`${String(i + 1).padStart(2, '0')} / ${animations.length} · ${a.label}`, 56, 380, '0xffc57c', bold],
        [`${a.frames.length} frame · nguồn ${a.fps} fps · bản xem 30 fps`, 32, 510, '0xc8d7ec', font],
        ['Kích thước gốc · lớp nền trong suốt', 30, 580, '0xc8d7ec', font],
        ['Hình Cáo tạo bằng AI · không nhép miệng', 30, 650, '0xc8d7ec', font],
      ];
      const filters = lines.map(([text, size, y, color, face], line) => {
        const file = path.join(temp, `text-${i}-${line}.txt`);
        fs.writeFileSync(file, text, 'utf8');
        return `drawtext=fontfile='${face}':textfile='${escape(file)}':expansion=none:fontsize=${size}:fontcolor=${color}:x=(w-tw)/2:y=${y}`;
      });
      const segment = path.join(temp, `segment-${String(i).padStart(2, '0')}.mp4`);
      execute(['-y', '-i', inputs[i], '-vf', filters.join(','), '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', segment]);
      segments.push(segment);
    }
    const list = path.join(temp, 'segments.ffconcat');
    fs.writeFileSync(list, 'ffconcat version 1.0\n' + segments.map((p) => `file '${p.replaceAll('\\', '/').replaceAll("'", "'\\''")}'`).join('\n') + '\n', 'utf8');
    fs.mkdirSync(path.dirname(out), {recursive: true});
    execute([opt.overwrite ? '-y' : '-n', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-an', '-movflags', '+faststart', out]);
    const measured = JSON.parse(execute(['-show_entries', 'format=duration:stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_frames', '-of', 'json', out], ffprobe));
    const report = {out, animations: animations.map(({id, label, fps, frames}) => ({id, label, source_fps: fps, source_frames: frames.length})), sound: false, measured};
    fs.writeFileSync(path.join(pack.root, 'qc', 'showcase-measurements.json'), JSON.stringify(report, null, 2) + '\n');
    return report;
  } finally {
    fs.rmSync(temp, {recursive: true, force: true});
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const opt = {};
  for (let i = 2; i < process.argv.length; i++) {
    const key = process.argv[i];
    if (key === '--overwrite') opt.overwrite = true;
    else if (['--manifest', '--out', '--ffmpeg', '--ffprobe'].includes(key)) opt[key.slice(2)] = process.argv[++i];
    else throw new Error(`Unknown option: ${key}`);
  }
  try { console.log(JSON.stringify(showcaseProduction(opt), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
