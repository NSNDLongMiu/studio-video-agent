// Cho Chíp "nói" theo file giọng đọc: khớp miệng theo độ lớn tiếng, chớp mắt, nhún nhảy, cử chỉ tay.
//
//   node tools/mascot/narrate.mjs --audio vo.wav --out chip-narrator.mov            # lớp nền trong suốt (ghép vào video chính)
//   node tools/mascot/narrate.mjs --audio vo.wav --bg 0x1b2a49 --out demo.mp4       # ghép luôn lên nền màu/ảnh, ra mp4 1080x1920
//   node tools/mascot/narrate.mjs --srt captions.srt --out chip-narrator.mov        # CHƯA có giọng đọc: miệng nhép theo thời gian phụ đề
//
// Tuỳ chọn: --expr neutral|happy|…  --gestures auto|none|<tên tư thế>  --intro (vẫy tay chào ở đầu)
//           --height 760 (chiều cao Chíp trên khung 1920)  --bottom 420 (cách đáy)  --pos center|left|right
//           --fps 30  --size 1080x1920  --seed 7
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as C from './character.mjs';
import { svgToPng } from './render.mjs';

const mulberry32 = (a) => () => {
  a |= 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// ---------- phân tích tiếng ----------
export function rmsFromPcm(samples, rate, fps) {
  const hop = Math.round(rate / fps);
  const win = hop * 2;
  const out = [];
  for (let i = 0; i * hop < samples.length; i++) {
    const a = Math.max(0, i * hop - Math.round(hop / 2));
    const b = Math.min(samples.length, a + win);
    let s = 0;
    for (let j = a; j < b; j++) s += samples[j] * samples[j];
    out.push(Math.sqrt(s / Math.max(1, b - a)) / 32768);
  }
  return out;
}

export function analyzeAudio(file, fps) {
  const dur = Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' }).stdout);
  if (!(dur > 0)) throw new Error(`Không đọc được thời lượng của ${file} (ffprobe lỗi?)`);
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], { maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new Error(`ffmpeg không giải mã được ${file}: ${r.stderr}`);
  const buf = r.stdout;
  const samples = new Int16Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 2));
  const rms = rmsFromPcm(samples, 16000, fps);
  const frames = Math.max(1, Math.round(dur * fps));
  while (rms.length < frames) rms.push(0);
  return { duration: dur, rms: rms.slice(0, frames) };
}

// ---------- không có giọng đọc: nhép miệng theo phụ đề ----------
const tc = (h, m, sec, ms) => Number(h) * 3600 + Number(m) * 60 + Number(sec) + Number(ms) / 1000;
export function parseSrt(text) {
  const cues = [];
  const re = /(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)[^\n]*\n([\s\S]*?)(?=\n\s*\n|\s*$)/g;
  for (const m of text.replace(/\r/g, '').matchAll(re)) cues.push({ start: tc(m[1], m[2], m[3], m[4]), end: tc(m[5], m[6], m[7], m[8]), text: m[9].replace(/\n/g, ' ').trim() });
  return cues;
}
/** Đường bao "tiếng nói giả": trong mỗi dòng phụ đề miệng nhép theo nhịp âm tiết (nhanh/chậm theo số chữ trên giây), giữa các dòng là im lặng. */
export function envelopeFromCues(cues, fps, { duration, seed = 7 } = {}) {
  const rnd = mulberry32(seed);
  const total = duration || (cues.length ? cues[cues.length - 1].end + 0.6 : 1);
  const n = Math.max(1, Math.round(total * fps));
  const env = new Array(n).fill(0);
  for (const c of cues) {
    const dur = Math.max(0.2, c.end - c.start);
    const rate = Math.min(6.5, Math.max(2.5, c.text.replace(/\s+/g, '').length / dur / 3.2)); // âm tiết/giây
    const phase = rnd() * Math.PI * 2;
    for (let i = Math.floor(c.start * fps); i < Math.min(n, Math.ceil(c.end * fps)); i++) {
      const t = i / fps - c.start;
      const edge = Math.min(1, t / 0.12, (dur - t) / 0.12); // vào/ra mềm ở đầu–cuối dòng
      const syll = Math.abs(Math.sin(Math.PI * rate * t + phase)) ** 0.7;
      const wobble = 0.65 + 0.35 * rnd();
      env[i] = Math.max(0, 0.04 + 0.2 * syll * wobble * Math.max(0, edge)); // thang RMS giả ~0..0.24
    }
  }
  return { duration: total, rms: env };
}

// ---------- kế hoạch từng khung hình (hàm thuần, có test) ----------
const GESTURES = ['present', 'point_up', 'hips', 'shrug', 'thumbs_up', 'point_right', 'rest'];

export function planFrames(rms, fps, o = {}) {
  const rnd = mulberry32(o.seed ?? 7);
  const sorted = [...rms].sort((a, b) => a - b);
  const pct = (p) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))] || 0;
  const ref = Math.max(0.02, pct(0.92)); // mức "to" của giọng
  const floor = Math.max(0.006, ref * 0.1);
  const lvl = rms.map((v) => (v < floor ? 0 : Math.min(1.3, v / ref)));

  // 1) hình miệng theo mức tiếng + xen kẽ chữ O cho đỡ máy móc
  let mouths = lvl.map((l) => (l === 0 || l < 0.1 ? 'M0' : l < 0.3 ? 'M1' : l < 0.62 ? 'M2' : 'M3'));
  let run = 0;
  mouths = mouths.map((m) => {
    if (m === 'M0') {
      run = 0;
      return m;
    }
    run++;
    return m === 'M2' && run % 4 === 3 ? 'M4' : m;
  });
  // 2) giữ mỗi hình miệng tối thiểu 2 khung (tránh nhấp nháy), trừ khi về im lặng
  for (let i = 1; i < mouths.length - 1; i++) if (mouths[i] !== mouths[i - 1] && mouths[i] !== mouths[i + 1] && mouths[i] !== 'M0' && mouths[i - 1] !== 'M0') mouths[i] = mouths[i - 1];

  // 3) chớp mắt ngẫu nhiên 2.2–4.5s, 4 khung
  const blink = new Array(rms.length).fill(false);
  for (let t = Math.round((1 + rnd() * 1.5) * fps); t < rms.length; t += Math.round((2.2 + rnd() * 2.3) * fps)) for (let k = 0; k < 4 && t + k < blink.length; k++) blink[t + k] = true;

  // 4) nhấn mạnh: tiếng rất to => nhướng mày 6 khung
  const brow = new Array(rms.length).fill(false);
  for (let i = 0; i < lvl.length; i++) if (lvl[i] > 1.0 && !brow[i]) for (let k = 0; k < 6 && i + k < brow.length; k++) brow[i + k] = true;

  // 5) cử chỉ tay: đổi tư thế mỗi 2.4–3.8s khi đang nói
  const arms = new Array(rms.length).fill('rest');
  const fixed = o.gestures && o.gestures !== 'auto' && o.gestures !== 'none' ? o.gestures : null;
  let gi = 0;
  let next = Math.round(1.2 * fps);
  let cur = 'rest';
  const introEnd = o.intro ? Math.round(1.6 * fps) : 0;
  for (let i = 0; i < arms.length; i++) {
    if (fixed) cur = fixed;
    else if (o.gestures === 'none') cur = 'rest';
    else if (i < introEnd) cur = 'wave';
    else if (i >= next) {
      const talking = lvl.slice(Math.max(0, i - 6), i + 1).some((l) => l > 0);
      if (talking) cur = GESTURES[gi++ % GESTURES.length];
      else cur = 'rest';
      next = i + Math.round((2.4 + rnd() * 1.4) * fps);
    }
    arms[i] = cur;
  }

  // 6) nhún nhẹ theo nhịp thở/nói + nghiêng người rất nhẹ
  return rms.map((_, i) => {
    const t = i / fps;
    const talk = lvl[i] > 0 ? 1 : 0.4;
    const dy = Math.round((Math.sin(t * Math.PI * 2 * 1.8) * 6 * talk + (lvl[i] > 1 ? 6 : 0)) / 3) * 3;
    const sway = Math.sin(t * Math.PI * 2 * 0.5);
    return {
      arms: arms[i],
      wave: arms[i] === 'wave' ? Math.floor(i / 6) % 2 : 0,
      expr: o.expr || 'neutral',
      mouth: mouths[i],
      eyes: blink[i] && !['happy', 'wink', 'sleepy'].includes(o.expr || 'neutral') ? 'closed' : undefined,
      brows: brow[i] ? 'raised' : undefined,
      dy,
      tilt: sway > 0.6 ? 1 : sway < -0.6 ? -1 : 0,
    };
  });
}

// ---------- dựng ----------
const keyOf = (s) => JSON.stringify([s.arms, s.wave, s.expr, s.mouth, s.eyes, s.brows, s.dy, s.tilt]);

export function renderStates(states, dir, widthPx) {
  const cache = new Map();
  for (const s of states) {
    const k = keyOf(s);
    if (cache.has(k)) continue;
    const file = path.join(dir, `s${cache.size}.png`);
    fs.writeFileSync(file, svgToPng(C.mascotSVG({ ...s, shadow: true }), { width: widthPx }));
    cache.set(k, file);
  }
  return cache;
}

export function writeConcat(states, cache, fps, listFile) {
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
  lines.push(`file '${last.replace(/\\/g, '/')}'`); // khung cuối cần lặp lại để giữ đủ thời lượng
  fs.writeFileSync(listFile, lines.join('\n'));
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
  const charW = Math.round((charH * C.VIEWBOX.w) / C.VIEWBOX.h);
  const hasAudio = !!opt.audio;
  if (hasAudio && !fs.existsSync(opt.audio)) throw new Error(`Không thấy file âm thanh: ${opt.audio}`);
  if (!hasAudio && !(opt.srt && fs.existsSync(opt.srt))) throw new Error('Cần --audio <giọng đọc wav/mp3/m4a…> hoặc --srt <phụ đề> (chưa có giọng đọc thì dùng --srt)');
  const { duration, rms } = hasAudio ? analyzeAudio(opt.audio, fps) : envelopeFromCues(parseSrt(fs.readFileSync(opt.srt, 'utf8')), fps, { duration: opt.duration ? Number(opt.duration) : undefined, seed: Number(opt.seed ?? 7) });
  const states = planFrames(rms, fps, { expr: opt.expr, gestures: opt.gestures, intro: !!opt.intro, seed: Number(opt.seed ?? 7) });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chip-narrate-'));
  try {
    const cache = renderStates(states, tmp, charW);
    const list = path.join(tmp, 'frames.ffconcat');
    writeConcat(states, cache, fps, list);
    const out = path.resolve(opt.out || (opt.bg ? 'chip-demo.mp4' : 'chip-narrator.mov'));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    let args;
    if (opt.bg) {
      const isColor = /^(0x|#)?[0-9a-fA-F]{6}$/.test(String(opt.bg)) || /^[a-z]+$/i.test(String(opt.bg));
      const bgIn = isColor ? ['-f', 'lavfi', '-i', `color=c=${String(opt.bg).replace('#', '0x')}:s=${W}x${H}:r=${fps}:d=${duration.toFixed(3)}`] : ['-loop', '1', '-framerate', String(fps), '-t', duration.toFixed(3), '-i', opt.bg];
      const px = opt.pos === 'left' ? 'W*0.06' : opt.pos === 'right' ? 'W-w-W*0.06' : '(W-w)/2';
      const py = `H-h-${Number(opt.bottom ?? 420)}`;
      args = ['-y', '-v', 'error', ...bgIn, '-f', 'concat', '-safe', '0', '-i', list, ...(hasAudio ? ['-i', opt.audio] : []), '-filter_complex', `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setsar=1,fps=${fps}[bg];[1:v]fps=${fps},format=rgba[m];[bg][m]overlay=x=${px}:y=${py}:format=auto,format=yuv420p[v]`, '-map', '[v]', ...(hasAudio ? ['-map', '2:a', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000'] : ['-an']), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-t', duration.toFixed(3), out];
    } else {
      args = ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, ...(hasAudio ? ['-i', opt.audio] : []), '-vf', `fps=${fps},format=argb`, '-c:v', 'qtrle', ...(hasAudio ? ['-c:a', 'pcm_s16le'] : ['-an']), '-t', duration.toFixed(3), out];
    }
    const r = spawnSync('ffmpeg', args, { encoding: 'utf8' });
    if (r.status !== 0) throw new Error(`ffmpeg lỗi: ${r.stderr}`);
    return { out, duration, source: hasAudio ? 'audio' : 'srt', frames: states.length, unique_poses: cache.size, size: [W, H], character_px: [charW, charH] };
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
