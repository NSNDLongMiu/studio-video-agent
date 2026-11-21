// QC tự động cho video dọc: node tools/qc-video.mjs <file.mp4> [--min 8] [--max 60] [--scenes <tệp.json>] [--no-motion]
// Kiểm: 9:16, ≥1080x1920, H.264/yuv420p, AAC có tiếng, fps 24-60, thời lượng, dung lượng.
// Thoát mã 0 = đạt, 1 = có lỗi (FAIL). Cảnh báo (WARN) không làm rớt.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { measureVideo } from './scene-metrics.mjs';
import qc from './qc-thresholds.json' with { type: 'json' };

const loudness = qc.final_audio;

const args = process.argv.slice(2);
const scenesIndex = args.indexOf('--scenes');
const file = args.find((arg, i) => !arg.startsWith('--') && args[i - 1] !== '--scenes');
const num = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 ? Number(args[i + 1]) : def;
};
if (!file) {
  console.error('Cú pháp: node tools/qc-video.mjs <file.mp4> [--min 8] [--max 60] [--scenes <tệp.json>] [--no-motion]');
  process.exit(2);
}
const MIN = num('--min', 8);
const MAX = num('--max', 60);
const fails = [];
const warns = [];
const info = {};

if (!fs.existsSync(file)) {
  console.log(JSON.stringify({ file, pass: false, fails: ['Không thấy file'] }));
  process.exit(1);
}
const probe = spawnSync('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', file], { encoding: 'utf8' });
if (probe.status !== 0) {
  console.log(JSON.stringify({ file, pass: false, fails: [`ffprobe lỗi: ${probe.stderr || probe.error?.message}`] }));
  process.exit(1);
}
const j = JSON.parse(probe.stdout);
const v = j.streams.find((s) => s.codec_type === 'video');
const a = j.streams.find((s) => s.codec_type === 'audio');
const dur = Number(j.format.duration);
const size = Number(j.format.size);
Object.assign(info, { duration_s: +dur.toFixed(2), size_mb: +(size / 1048576).toFixed(1), video: v && `${v.codec_name} ${v.width}x${v.height} ${v.pix_fmt}`, audio: a && `${a.codec_name} ${a.sample_rate}Hz` });

if (!v) fails.push('Không có luồng video');
else {
  if (Math.abs(v.width / v.height - 9 / 16) > 0.01) fails.push(`Tỉ lệ ${v.width}x${v.height} không phải 9:16`);
  if (v.width < 1080 || v.height < 1920) warns.push(`Độ phân giải ${v.width}x${v.height} thấp hơn chuẩn 1080x1920`);
  if (v.codec_name !== 'h264') fails.push(`Codec video là ${v.codec_name}, cần h264`);
  if (v.pix_fmt !== 'yuv420p') fails.push(`pix_fmt là ${v.pix_fmt}, cần yuv420p (nhiều nền tảng lỗi nếu khác)`);
  const [n, d] = String(v.avg_frame_rate).split('/').map(Number);
  const fps = d ? n / d : 0;
  info.fps = +fps.toFixed(2);
  if (fps < 24 || fps > 60.5) fails.push(`FPS ${fps.toFixed(1)} ngoài khoảng 24-60`);
}
if (!a) fails.push('Không có luồng âm thanh (cần có luồng giọng đọc hoặc bản trộn âm thanh)');
else {
  if (a.codec_name !== 'aac') fails.push(`Codec audio là ${a.codec_name}, cần aac`);
  const vd = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-vn', '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  const mean = /mean_volume:\s*(-?[\d.]+) dB/.exec(vd.stderr || '')?.[1];
  const max = /max_volume:\s*(-?[\d.]+) dB/.exec(vd.stderr || '')?.[1];
  if (mean !== undefined) {
    info.mean_volume_db = Number(mean);
    info.max_volume_db = Number(max);
    if (Number(max) < -45) fails.push(`Âm thanh gần như im lặng (max ${max} dB)`);
    else if (Number(mean) < -30) warns.push(`Âm lượng thấp (mean ${mean} dB) — nên chuẩn hoá về ~ -14 LUFS`);
    if (Number(max) > -0.1) warns.push(`Âm thanh chạm trần (max ${max} dB) — nguy cơ vỡ tiếng`);
  }
  // Chỉ lấy số đo đầu vào; âm thanh chuẩn hoá của loudnorm bị bỏ ở null output.
  const ln = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-vn', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' });
  const report = /\{\s*"input_i"[\s\S]*?\}/.exec(ln.stderr || '')?.[0];
  if (report) {
    try {
      const measured = JSON.parse(report);
      for (const [key, field] of [['lufs_i', 'input_i'], ['lra', 'input_lra'], ['true_peak_dbtp', 'input_tp']]) {
        const value = measured[field];
        if (value !== undefined && value !== null && String(value).trim() !== '' && Number.isFinite(Number(value))) info[key] = Number(value);
      }
    } catch {
      // Không có số đo hợp lệ thì giữ các kiểm tra hiện có.
    }
  }
  if (info.lufs_i < loudness.lufs_min || info.lufs_i > loudness.lufs_max) warns.push(`Loudness ${info.lufs_i} LUFS ngoài khoảng ${loudness.lufs_min}…${loudness.lufs_max} — nên chuẩn hoá về ~ ${loudness.target_lufs} LUFS`);
  if (info.true_peak_dbtp > 0) fails.push(`True peak ${info.true_peak_dbtp} dBTP > 0 dBTP — vỡ tiếng`);
  else if (info.true_peak_dbtp > loudness.true_peak_max_dbtp) warns.push(`True peak ${info.true_peak_dbtp} dBTP > ${loudness.true_peak_max_dbtp} dBTP`);
}
if (dur < MIN) fails.push(`Dài ${dur.toFixed(1)}s < tối thiểu ${MIN}s`);
if (dur > MAX) fails.push(`Dài ${dur.toFixed(1)}s > tối đa ${MAX}s`);
if (size > 250 * 1048576) fails.push(`Nặng ${info.size_mb}MB (> 250MB)`);

if (!args.includes('--no-motion')) {
  let scenesFile;
  if (scenesIndex >= 0) {
    const arg = args[scenesIndex + 1] ?? '';
    scenesFile = arg.startsWith('--') ? '' : arg;
  }
  const measured = measureVideo(file, scenesFile);
  Object.assign(info, measured.info);
  warns.push(...measured.warns);
}

const pass = fails.length === 0;
console.log(JSON.stringify({ file, pass, info, fails, warns }, null, 2));
process.exit(pass ? 0 : 1);
