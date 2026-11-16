// Cho "Cáo văn phòng" dẫn truyện: đổi dáng theo mốc thời gian, nhún theo độ lớn tiếng, hiện dáng mới có hiệu ứng nảy.
// Dùng sticker trong brand/cao/poses (xem brand/cao/catalog.png). KHÔNG khớp miệng (xem docs/mascot.md).
//
//   node tools/fox/narrate.mjs --audio vo.wav --timeline timeline.json --out assets/cao.mov
//   node tools/fox/narrate.mjs --srt captions.srt --intro --out assets/cao.mov        # chưa có giọng đọc
//   node tools/fox/narrate.mjs --audio vo.wav --pose think --bg 0x1b2a49 --out thu.mp4  # 1 dáng cố định + ghép lên nền để xem thử
//
// timeline.json: [{"t":0,"pose":"wave"},{"t":3.2,"pose":"think"},{"t":7,"pose":"thumbs_up"}]  (t = giây)
// Tuỳ chọn: --poses a,b,c (vòng dáng tự động) --intro (vẫy tay 1,6s đầu) --height 760 --bottom 420 --pos center|left|right --fps 30 --size 1080x1920 --duration <giây> (khi chỉ có --srt)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { analyzeAudio, parseSrt, envelopeFromCues } from '../mascot/narrate.mjs';
import { svgToPng } from '../mascot/render.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const POSES_DIR = process.env.CAO_POSES || path.resolve(here, '..', '..', 'brand', 'cao', 'poses');
export const DEFAULT_CYCLE = ['present_open', 'point_up', 'idea', 'point_right', 'shrug', 'thumbs_up', 'welcome', 'think'];
const REF_H = 330; // chiều cao sticker trung vị: giữ cỡ cáo nhất quán giữa các dáng
const POP_FRAMES = 6;

export const listPoses = () => fs.readdirSync(POSES_DIR).filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4)).sort();

export function assertPoses(names) {
  const have = new Set(listPoses());
  const bad = [...new Set(names)].filter((n) => !have.has(n));
  if (bad.length) throw new Error(`Không có dáng: ${bad.join(', ')}. Xem brand/cao/catalog.png. Dáng hiện có: ${[...have].join(', ')}`);
}

/** Hàm thuần: mỗi khung -> {pose, age (khung kể từ lúc đổi dáng), lvl (độ lớn tiếng 0..1.3)}. */
export function planFrames(rms, fps, o = {}) {
  const sorted = [...rms].sort((a, b) => a - b);
  const ref = Math.max(0.02, sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.92))] || 0);
  const floor = Math.max(0.006, ref * 0.1);
  const raw = rms.map((v) => (v < floor ? 0 : Math.min(1.3, v / ref)));
  const lvl = raw.map((_, i) => (raw[Math.max(0, i - 1)] + raw[i] + raw[Math.min(raw.length - 1, i + 1)]) / 3); // làm mượt 3 khung
  const timeline = o.timeline ? [...o.timeline].sort((a, b) => a.t - b.t) : null;
  const cycle = o.cycle && o.cycle.length ? o.cycle : DEFAULT_CYCLE;
  const introEnd = o.intro ? Math.round(1.6 * fps) : 0;
  const every = Math.round((o.every ?? 3.2) * fps);
  let ci = 0;
  let cur = o.pose || (timeline ? timeline[0].pose : 'arms_crossed');
  let changed = 0;
  let nextChange = Math.max(introEnd, every);
  const out = [];
  for (let i = 0; i < rms.length; i++) {
    const t = i / fps;
    let want = cur;
    if (timeline) {
      want = timeline[0].pose;
      for (const e of timeline) if (e.t <= t + 1e-6) want = e.pose;
    } else if (o.pose) want = o.pose;
    else if (i < introEnd) want = 'wave';
    else if (i >= nextChange) {
      const talking = lvl.slice(Math.max(0, i - 8), i + 1).some((l) => l > 0);
      want = talking ? cycle[ci++ % cycle.length] : 'arms_crossed';
      nextChange = i + every;
    }
    if (want !== cur || i === 0) {
      cur = want;
      changed = i;
    }
    out.push({ pose: cur, age: i - changed, lvl: lvl[i] });
  }
  return out;
}

const easeOutBack = (x) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

/** Biến đổi từng khung (đã lượng tử hoá để dùng lại ảnh): nhún theo tiếng, thở nhẹ, nảy khi đổi dáng. */
export function transformFor(s, fps, i) {
  const t = i / fps;
  const talk = Math.min(1, s.lvl);
  const pop = s.age < POP_FRAMES ? 0.85 + 0.15 * easeOutBack((s.age + 1) / POP_FRAMES) : 1;
  const breathe = 1 + 0.006 * Math.sin(t * Math.PI * 2 * 0.6);
  const sy = (1 + 0.035 * talk) * breathe * pop;
  const sx = (1 - 0.02 * talk) * pop;
  const rot = Math.sin(t * Math.PI * 2 * 0.4) * 0.8;
  return { sx: Math.round(sx * 100) / 100, sy: Math.round(sy * 100) / 100, rot: Math.round(rot * 2.5) / 2.5 };
}

const uriCache = new Map();
function pngInfo(pose) {
  if (!uriCache.has(pose)) {
    const buf = fs.readFileSync(path.join(POSES_DIR, `${pose}.png`));
    uriCache.set(pose, { uri: `data:image/png;base64,${buf.toString('base64')}`, w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) });
  }
  return uriCache.get(pose);
}

export function frameSVG(pose, tf, charH) {
  const k = charH / REF_H;
  const { uri, w, h } = pngInfo(pose);
  const W = Math.ceil(charH * 1.3);
  const H = Math.ceil(charH * 1.12);
  const dw = w * k;
  const dh = h * k;
  const shadow = /^(desk_|sleep)/.test(pose) ? '' : `<ellipse cx="${W / 2}" cy="${H - 8}" rx="${Math.round(dw * 0.34)}" ry="${Math.round(charH * 0.022)}" fill="#000" opacity=".22"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${shadow}<g transform="translate(${W / 2},${H - 8}) rotate(${tf.rot}) scale(${tf.sx},${tf.sy})"><image href="${uri}" x="${-dw / 2}" y="${-dh}" width="${dw}" height="${dh}"/></g></svg>`;
}

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const k = argv[i].slice(2);
    o[k] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return o;
}

export function narrate(opt) {
  const fps = Number(opt.fps || 30);
  const [W, H] = String(opt.size || '1080x1920').split('x').map(Number);
  const charH = Number(opt.height || 760);
  const hasAudio = !!opt.audio;
  if (hasAudio && !fs.existsSync(opt.audio)) throw new Error(`Không thấy file âm thanh: ${opt.audio}`);
  if (!hasAudio && !(opt.srt && fs.existsSync(opt.srt))) throw new Error('Cần --audio <giọng đọc> hoặc --srt <phụ đề>');
  const timeline = opt.timeline ? JSON.parse(fs.readFileSync(opt.timeline, 'utf8')) : null;
  const cycle = opt.poses ? String(opt.poses).split(',') : null;
  assertPoses([...(timeline || []).map((e) => e.pose), ...(cycle || []), ...(opt.pose ? [opt.pose] : []), 'wave', 'arms_crossed', ...DEFAULT_CYCLE]);
  const { duration, rms } = hasAudio ? analyzeAudio(opt.audio, fps) : envelopeFromCues(parseSrt(fs.readFileSync(opt.srt, 'utf8')), fps, { duration: opt.duration ? Number(opt.duration) : undefined });
  const frames = planFrames(rms, fps, { timeline, cycle, intro: !!opt.intro, pose: opt.pose });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cao-narrate-'));
  try {
    const cache = new Map();
    const states = frames.map((s, i) => ({ pose: s.pose, tf: transformFor(s, fps, i) }));
    for (const s of states) {
      const key = `${s.pose}|${s.tf.sx}|${s.tf.sy}|${s.tf.rot}`;
      if (cache.has(key)) continue;
      const file = path.join(tmp, `f${cache.size}.png`);
      const svg = frameSVG(s.pose, s.tf, charH);
      fs.writeFileSync(file, svgToPng(svg, { width: Math.ceil(charH * 1.3) }));
      cache.set(key, file);
      s.key = key;
    }
    const keyOf = (s) => `${s.pose}|${s.tf.sx}|${s.tf.sy}|${s.tf.rot}`;
    const lines = ['ffconcat version 1.0'];
    let i = 0;
    let last = null;
    while (i < states.length) {
      let j = i;
      const k = keyOf(states[i]);
      while (j < states.length && keyOf(states[j]) === k) j++;
      last = cache.get(k);
      lines.push(`file '${last.replace(/\\/g, '/')}'`, `duration ${((j - i) / fps).toFixed(5)}`);
      i = j;
    }
    lines.push(`file '${last.replace(/\\/g, '/')}'`);
    const list = path.join(tmp, 'frames.ffconcat');
    fs.writeFileSync(list, lines.join('\n'));
    const out = path.resolve(opt.out || (opt.bg ? 'cao-demo.mp4' : 'cao-narrator.mov'));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    let args;
    if (opt.bg) {
      const isColor = /^(0x|#)?[0-9a-fA-F]{6}$/.test(String(opt.bg));
      const bgIn = isColor ? ['-f', 'lavfi', '-i', `color=c=${String(opt.bg).replace('#', '0x')}:s=${W}x${H}:r=${fps}:d=${duration.toFixed(3)}`] : ['-loop', '1', '-framerate', String(fps), '-t', duration.toFixed(3), '-i', opt.bg];
      const px = opt.pos === 'left' ? 'W*0.04' : opt.pos === 'right' ? 'W-w-W*0.04' : '(W-w)/2';
      args = ['-y', '-v', 'error', ...bgIn, '-f', 'concat', '-safe', '0', '-i', list, ...(hasAudio ? ['-i', opt.audio] : []), '-filter_complex', `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1,fps=${fps}[bg];[1:v]fps=${fps},format=rgba[m];[bg][m]overlay=x=${px}:y=H-h-${Number(opt.bottom ?? 420)}:format=auto,format=yuv420p[v]`, '-map', '[v]', ...(hasAudio ? ['-map', '2:a', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000'] : ['-an']), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-t', duration.toFixed(3), out];
    } else {
      args = ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, ...(hasAudio ? ['-i', opt.audio] : []), '-vf', `fps=${fps},format=argb`, '-c:v', 'qtrle', ...(hasAudio ? ['-c:a', 'pcm_s16le'] : ['-an']), '-t', duration.toFixed(3), out];
    }
    const r = spawnSync('ffmpeg', args, { encoding: 'utf8' });
    if (r.status !== 0) throw new Error(`ffmpeg lỗi: ${r.stderr}`);
    return { out, duration, source: hasAudio ? 'audio' : 'srt', frames: frames.length, unique_frames: cache.size, poses_used: [...new Set(frames.map((f) => f.pose))] };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    console.log(JSON.stringify(narrate(parseArgs(process.argv.slice(2))), null, 2));
  } catch (e) {
    console.error(`✖ ${e.message}`);
    process.exit(1);
  }
}
