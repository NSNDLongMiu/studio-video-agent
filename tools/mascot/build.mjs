// Xuất toàn bộ tài sản linh vật Chíp vào brand/mascot/:   node tools/mascot/build.mjs
//   chip.svg, chip.png        bản gốc (đứng nghỉ, vui) — nền trong suốt
//   poses/<tư-thế>.png        10 tư thế tay      (900×1040, nền trong suốt)
//   expressions/<biểu-cảm>.png 9 biểu cảm        (900×1040, nền trong suốt)
//   character-sheet.png       tờ đặc tả nhân vật cho cả team
//   manifest.json             danh sách file + kích thước
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as C from './character.mjs';
import { svgToPng } from './render.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const OUT = process.env.MASCOT_OUT || path.resolve(here, '..', '..', 'brand', 'mascot');
const W = C.VIEWBOX.w;
const H = C.VIEWBOX.h;

export const VI = {
  arms: { rest: 'Đứng nghỉ', wave: 'Vẫy tay chào', present: 'Giới thiệu', point_right: 'Chỉ sang phải', point_up: 'Lưu ý!', hips: 'Chống nạnh', cheer: 'Ăn mừng', shrug: 'Nhún vai', thumbs_up: 'Giơ ngón cái', think: 'Suy nghĩ' },
  expr: { neutral: 'Bình thường', happy: 'Vui', excited: 'Háo hức', surprised: 'Ngạc nhiên', thinking: 'Đang nghĩ', oops: 'Ối!', determined: 'Quyết tâm', wink: 'Nháy mắt', sleepy: 'Buồn ngủ' },
  mouth: { M0: 'Ngậm', M1: 'Hé', M2: 'Mở vừa', M3: 'Mở to', M4: 'Chữ O' },
};
const BASE_EXPR_FOR_POSE = { think: 'thinking', cheer: 'excited' };

const inner = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
let uidN = 0;
const place = (opts, x, y, w, vb) => {
  const svg = C.mascotSVG({ ...opts, uid: `u${uidN++}` });
  const v = vb || `${C.VIEWBOX.x} ${C.VIEWBOX.y} ${W} ${H}`;
  const h = vb ? w : Math.round((w * H) / W);
  return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${v}" overflow="hidden">${inner(svg)}</svg>`;
};
const text = (t, x, y, size, { weight = 400, fill = '#1B2340', anchor = 'start' } = {}) => `<text x="${x}" y="${y}" font-family="Segoe UI" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${t}</text>`;

export function sheetSVG() {
  const SW = 2200;
  const SH = 1580;
  let b = `<rect width="${SW}" height="${SH}" fill="#F7F3EA"/><rect x="40" y="40" width="660" height="1500" rx="36" fill="#fff"/><rect x="740" y="40" width="1420" height="1500" rx="36" fill="#fff"/>`;
  // tiêu đề + nhân vật chính
  b += text('Chíp', 80, 165, 130, { weight: 700 }) + text('Linh vật dẫn truyện · kênh video ngắn', 84, 248, 30, { fill: '#5B6486' });
  b += place({ expr: 'happy', arms: 'wave' }, 60, 262, 620);
  // miệng (khớp tiếng)
  b += text('Hình miệng khi nói (khớp theo tiếng)', 80, 1010, 24, { weight: 600 });
  Object.keys(VI.mouth).forEach((m, i) => {
    const x = 76 + i * 122;
    b += `<rect x="${x}" y="1030" width="112" height="112" rx="18" fill="#FFF0C8"/>` + place({ expr: 'neutral', mouth: m }, x, 1030, 112, '330 560 140 140') + text(VI.mouth[m], x + 56, 1166, 18, { anchor: 'middle', fill: '#5B6486' });
  });
  // bảng màu
  b += text('Bảng màu', 80, 1220, 24, { weight: 600 });
  const sw = [['Viền', C.PALETTE.outline], ['Thân', C.PALETTE.body], ['Bóng thân', C.PALETTE.bodyShade], ['Bụng', C.PALETTE.belly], ['Chân/chỏm lông', C.PALETTE.tuft], ['Tai nghe', C.PALETTE.headset], ['Tai nghe tối', C.PALETTE.headsetDark], ['Má', C.PALETTE.cheek]];
  sw.forEach(([n, c], i) => {
    const x = 80 + (i % 2) * 300;
    const y = 1245 + Math.floor(i / 2) * 66;
    b += `<rect x="${x}" y="${y}" width="52" height="52" rx="12" fill="${c}" stroke="#1B2340" stroke-opacity=".25" stroke-width="2"/>` + text(n, x + 66, y + 24, 20) + text(c.toUpperCase(), x + 66, y + 46, 18, { fill: '#5B6486' });
  });
  // tư thế
  b += text('Tư thế tay và chân', 780, 100, 30, { weight: 700 });
  const cw = 270;
  const ch = Math.round((cw * H) / W);
  Object.keys(VI.arms).forEach((a, i) => {
    const x = 780 + (i % 5) * 274;
    const y = 120 + Math.floor(i / 5) * (ch + 44);
    b += place({ arms: a, expr: BASE_EXPR_FOR_POSE[a] || 'happy', mouth: 'grin' }, x, y, cw) + text(VI.arms[a], x + cw / 2, y + ch + 26, 22, { anchor: 'middle' });
  });
  // biểu cảm (cắt phần mặt)
  const ey = 120 + 2 * (ch + 44) + 30;
  b += text('Biểu cảm', 780, ey, 30, { weight: 700 });
  Object.keys(VI.expr).forEach((e, i) => {
    const x = 780 + (i % 5) * 274;
    const y = ey + 22 + Math.floor(i / 5) * 306;
    b += `<rect x="${x}" y="${y}" width="250" height="250" rx="22" fill="#FFF0C8"/>` + place({ expr: e, arms: 'rest' }, x, y, 250, '110 150 580 580') + text(VI.expr[e], x + 125, y + 278, 22, { anchor: 'middle' });
  });
  b += text('Nguồn thiết kế duy nhất: tools/mascot/character.mjs · PNG nền trong suốt 900×1040 · đặt linh vật cách đáy khung hình ≥ 420px (vùng an toàn)', 780, 1522, 20, { fill: '#5B6486' });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SW}" height="${SH}" viewBox="0 0 ${SW} ${SH}">${b}</svg>`;
}

export function build() {
  for (const d of ['poses', 'expressions']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
  const files = [];
  const save = (rel, buf) => {
    fs.writeFileSync(path.join(OUT, rel), buf);
    files.push({ file: rel, bytes: buf.length });
  };
  const master = C.mascotSVG({ expr: 'happy', arms: 'rest' });
  save('chip.svg', Buffer.from(master));
  save('chip.png', svgToPng(master, { width: W }));
  for (const a of Object.keys(C.ARM_POSES)) save(`poses/${a}.png`, svgToPng(C.mascotSVG({ arms: a, expr: BASE_EXPR_FOR_POSE[a] || 'happy' }), { width: W }));
  for (const e of Object.keys(C.EXPRESSIONS)) save(`expressions/${e}.png`, svgToPng(C.mascotSVG({ expr: e, arms: 'rest' }), { width: W }));
  save('character-sheet.png', svgToPng(sheetSVG(), { width: 2200 }));
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({ name: 'Chíp', image_size: [W, H], files, arms: Object.keys(C.ARM_POSES), expressions: Object.keys(C.EXPRESSIONS), mouths: C.MOUTHS, legs: Object.keys(C.LEG_POSES) }, null, 2));
  return files;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = build();
  console.log(`Đã xuất ${files.length} file vào ${path.relative(process.cwd(), OUT) || OUT}`);
}
