// Linh vật "Chíp" — vẽ bằng SVG theo từng bộ phận. ĐÂY LÀ NGUỒN DUY NHẤT của thiết kế:
// mọi PNG (tư thế, biểu cảm, khung hình khi nói) đều sinh ra từ hàm mascotSVG() dưới đây.
// Hệ toạ độ: viewBox -50 60 900 1040 (rộng hơn thân để tay vươn ra không bị cắt), nhân vật đứng giữa (x=400), chân chạm đất ở y≈1045.

export const PALETTE = {
  outline: '#1B2340', // viền & nét mặt (xanh navy đậm, không dùng đen thuần)
  body: '#FFB62E', // thân vàng hổ phách
  bodyShade: '#E58F00',
  belly: '#FFF0C8',
  tuft: '#F29A1F', // chỏm lông
  cheek: '#FF7F7F',
  headset: '#19C2C2', // tai nghe — dấu hiệu "người dẫn truyện"
  headsetDark: '#0E8A8A',
  glove: '#FFFFFF',
  shoe: '#FFFFFF',
  mouthIn: '#4A1B2C',
  tongue: '#FF8FA0',
};
const P = PALETTE;
const O = P.outline;
export const VIEWBOX = { x: -50, y: 60, w: 900, h: 1040 };

const BODY = 'M400,250 C540,250 630,420 630,600 C630,760 540,860 400,860 C260,860 170,760 170,600 C170,420 260,250 400,250 Z';
const SHOULDER = { L: [225, 632], R: [575, 632] };

// ---- tư thế tay: ctrl = điểm uốn (khuỷu), hand = vị trí bàn tay. L/R theo góc nhìn của người xem.
export const ARM_POSES = {
  rest: { L: { ctrl: [125, 725], hand: [116, 806] }, R: { ctrl: [675, 725], hand: [684, 806] } },
  wave: { L: { ctrl: [125, 725], hand: [116, 806] }, R: { ctrl: [742, 560], hand: [704, 392], wave: 24 } },
  present: { L: { ctrl: [120, 650], hand: [70, 548] }, R: { ctrl: [680, 650], hand: [730, 548] } },
  point_right: { L: { ctrl: [125, 725], hand: [116, 806] }, R: { ctrl: [705, 612], hand: [772, 586], kind: 'point', dir: 0 } },
  point_up: { L: { ctrl: [125, 725], hand: [116, 806] }, R: { ctrl: [704, 520], hand: [690, 372], kind: 'point', dir: -90 } },
  hips: { L: { ctrl: [128, 700], hand: [208, 800] }, R: { ctrl: [672, 700], hand: [592, 800] } },
  cheer: { L: { ctrl: [112, 470], hand: [150, 290] }, R: { ctrl: [688, 470], hand: [650, 290] } },
  shrug: { L: { ctrl: [88, 745], hand: [112, 566] }, R: { ctrl: [712, 745], hand: [688, 566] } },
  thumbs_up: { L: { ctrl: [125, 725], hand: [116, 806] }, R: { ctrl: [712, 660], hand: [716, 528], kind: 'thumb' } },
  think: { L: { ctrl: [125, 725], hand: [116, 806] }, R: { ctrl: [700, 440], hand: [530, 292] } },
};

export const LEG_POSES = {
  stand: { L: { hip: [335, 850], knee: [331, 925], foot: [328, 985] }, R: { hip: [465, 850], knee: [469, 925], foot: [472, 985] }, shadow: 1 },
  step: { L: { hip: [335, 850], knee: [331, 925], foot: [328, 985] }, R: { hip: [465, 850], knee: [535, 905], foot: [548, 950] }, shadow: 0.9 },
  jump: { L: { hip: [335, 850], knee: [292, 915], foot: [330, 950] }, R: { hip: [465, 850], knee: [508, 915], foot: [470, 950] }, shadow: 0.6, rise: 46 },
};

export const MOUTHS = ['M0', 'M1', 'M2', 'M3', 'M4', 'grin', 'sad', 'flat']; // M0..M4: dùng khi khớp miệng theo tiếng

export const EXPRESSIONS = {
  neutral: { eyes: 'open', brows: 'neutral', mouth: 'M0' },
  happy: { eyes: 'happy', brows: 'raised', mouth: 'grin' },
  excited: { eyes: 'wide', brows: 'raised', mouth: 'grin' },
  surprised: { eyes: 'wide', brows: 'raised', mouth: 'M4' },
  thinking: { eyes: 'open', brows: 'skeptical', mouth: 'flat', look: [0.8, -0.9] },
  oops: { eyes: 'open', brows: 'sad', mouth: 'sad' },
  determined: { eyes: 'open', brows: 'down', mouth: 'M0' },
  wink: { eyes: 'wink', brows: 'neutral', mouth: 'grin' },
  sleepy: { eyes: 'half', brows: 'neutral', mouth: 'flat' },
};

const f = (n) => Math.round(n * 10) / 10;
const stroke = (c, w) => `stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

// ---------- tay ----------
function armPath(side, a) {
  const [sx, sy] = SHOULDER[side];
  return `M${sx},${sy} Q${a.ctrl[0]},${a.ctrl[1]} ${a.hand[0]},${a.hand[1]}`;
}
function armSVG(side, a) {
  const d = armPath(side, a);
  return `<path d="${d}" fill="none" ${stroke(O, 58)}/><path d="${d}" fill="none" ${stroke(P.body, 42)}/>`;
}
function handSVG(side, a) {
  const [x, y] = a.hand;
  const s = side === 'L' ? 1 : -1; // ngón cái hướng về phía thân
  const g = (inner) => `<g transform="translate(${f(x)},${f(y)})">${inner}</g>`;
  const glove = `<circle r="37" fill="${P.glove}" ${stroke(O, 8)}/>`;
  if (a.kind === 'point') {
    return g(`<g transform="rotate(${a.dir})"><rect x="6" y="-13" width="64" height="26" rx="13" fill="${P.glove}" ${stroke(O, 8)}/></g>${glove}<g transform="rotate(${a.dir})"><circle cx="2" cy="0" r="30" fill="${P.glove}"/></g>`);
  }
  if (a.kind === 'thumb') {
    return g(`<rect x="-15" y="-74" width="30" height="58" rx="15" fill="${P.glove}" ${stroke(O, 8)}/>${glove}<circle cx="0" cy="-18" r="24" fill="${P.glove}"/>`);
  }
  return g(`<ellipse cx="${s * 30}" cy="-20" rx="14" ry="21" transform="rotate(${s * 28} ${s * 30} -20)" fill="${P.glove}" ${stroke(O, 8)}/>${glove}<circle cx="${s * 12}" cy="-12" r="22" fill="${P.glove}"/>`);
}

// ---------- chân ----------
function legSVG(side, l) {
  const d = `M${l.hip[0]},${l.hip[1]} Q${l.knee[0]},${l.knee[1]} ${l.foot[0]},${l.foot[1]}`;
  const s = side === 'L' ? -1 : 1;
  const cx = l.foot[0] + s * 16;
  const cy = l.foot[1] + 26;
  return `<path d="${d}" fill="none" ${stroke(O, 62)}/><path d="${d}" fill="none" ${stroke(P.tuft, 46)}/>
  <g transform="translate(${cx},${cy}) rotate(${s * 6})"><ellipse rx="70" ry="36" fill="${P.shoe}" ${stroke(O, 8)}/>
  <path d="M${-44},-6 Q0,-34 44,-6" fill="none" ${stroke(P.headset, 10)}/><path d="M-62,18 Q0,36 62,18" fill="none" ${stroke(O, 7)} opacity=".55"/></g>`;
}

// ---------- mặt ----------
const EYE_C = { L: [335, 470], R: [465, 470] };
function eyeSVG(side, kind, look, u = '') {
  const [cx, cy] = EYE_C[side];
  const arch = (up) => (up ? `<path d="M${cx - 50},${cy + 22} Q${cx},${cy - 50} ${cx + 50},${cy + 22}" fill="none" ${stroke(O, 13)}/>` : `<path d="M${cx - 50},${cy + 8} Q${cx},${cy + 48} ${cx + 50},${cy + 8}" fill="none" ${stroke(O, 12)}/>`);
  if (kind === 'happy') return arch(true);
  if (kind === 'closed') return arch(false);
  if (kind === 'wink') return side === 'R' ? arch(true) : eyeSVG(side, 'open', look, u);
  const wide = kind === 'wide';
  const rx = wide ? 64 : 58;
  const ry = wide ? 82 : 72;
  const pr = wide ? 22 : 30;
  const lx = Math.max(-1, Math.min(1, look[0])) * (rx - pr - 8);
  const ly = Math.max(-1, Math.min(1, look[1])) * (ry - pr - 8);
  const px = cx + lx;
  const py = cy + 6 + ly;
  let svg = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" ${stroke(O, 8)}/>
  <circle cx="${f(px)}" cy="${f(py)}" r="${pr}" fill="${O}"/><circle cx="${f(px - pr * 0.32)}" cy="${f(py - pr * 0.36)}" r="${f(pr * 0.34)}" fill="#fff"/><circle cx="${f(px + pr * 0.38)}" cy="${f(py + pr * 0.4)}" r="${f(pr * 0.16)}" fill="#fff"/>`;
  if (kind === 'half') {
    svg += `<clipPath id="lid${side}${u}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath><g clip-path="url(#lid${side}${u})"><rect x="${cx - rx - 4}" y="${cy - ry - 4}" width="${2 * rx + 8}" height="${ry + 6}" fill="${P.body}"/><path d="M${cx - rx - 4},${cy + 2} L${cx + rx + 4},${cy + 2}" ${stroke(O, 9)}/></g>`;
  }
  return svg;
}
function browSVG(kind) {
  const b = (d) => `<path d="${d}" fill="none" ${stroke(O, 13)}/>`;
  const L = { neutral: 'M288,392 Q335,372 382,388', raised: 'M286,362 Q335,336 384,358', down: 'M288,372 L382,404', sad: 'M288,404 Q335,386 382,370' };
  const R = { neutral: 'M418,388 Q465,372 512,392', raised: 'M416,358 Q465,336 514,362', down: 'M418,404 L512,372', sad: 'M418,370 Q465,386 512,404' };
  if (kind === 'none') return '';
  if (kind === 'skeptical') return b(L.raised) + b(R.down);
  return b(L[kind] || L.neutral) + b(R[kind] || R.neutral);
}
function mouthSVG(kind, u = '') {
  const inner = `fill="${P.mouthIn}" ${stroke(O, 8)}`;
  const teeth = (d) => `<path d="${d}" fill="#fff"/>`;
  switch (kind) {
    case 'M1':
      return `<ellipse cx="400" cy="624" rx="28" ry="16" ${inner}/>`;
    case 'M2':
      return `<ellipse cx="400" cy="630" rx="40" ry="30" ${inner}/><ellipse cx="400" cy="648" rx="22" ry="9" fill="${P.tongue}"/>`;
    case 'M3':
    case 'grin': {
      const w = kind === 'grin' ? 64 : 56;
      const d = `M${400 - w},598 Q400,${kind === 'grin' ? 610 : 588} ${400 + w},598 Q${400 + w - 8},688 400,692 Q${400 - w + 8},688 ${400 - w},598 Z`;
      return `<clipPath id="mc${u}"><path d="${d}"/></clipPath><path d="${d}" ${inner}/><g clip-path="url(#mc${u})">${teeth(`M${400 - w},590 L${400 + w},590 L${400 + w - 4},${kind === 'grin' ? 624 : 616} Q400,${kind === 'grin' ? 632 : 622} ${400 - w + 4},${kind === 'grin' ? 624 : 616} Z`)}<ellipse cx="400" cy="682" rx="32" ry="16" fill="${P.tongue}"/></g><path d="${d}" fill="none" ${stroke(O, 8)}/>`;
    }
    case 'M4':
      return `<ellipse cx="400" cy="626" rx="22" ry="27" ${inner}/><ellipse cx="400" cy="640" rx="12" ry="7" fill="${P.tongue}"/>`;
    case 'sad':
      return `<path d="M358,644 Q400,610 442,644" fill="none" ${stroke(O, 10)}/>`;
    case 'flat':
      return `<path d="M366,628 L434,628" fill="none" ${stroke(O, 10)}/>`;
    default: // M0
      return `<path d="M352,606 Q400,648 448,606" fill="none" ${stroke(O, 10)}/>`;
  }
}

// ---------- tai nghe ----------
function headsetSVG() {
  const band = 'M204,486 C196,330 300,284 400,284 C500,284 604,330 596,486';
  const cup = (x) => `<rect x="${x}" y="428" width="50" height="116" rx="25" fill="${P.headset}" ${stroke(O, 8)}/><rect x="${x + 11}" y="452" width="28" height="68" rx="14" fill="${P.headsetDark}"/>`;
  return `<path d="${band}" fill="none" ${stroke(O, 34)}/><path d="${band}" fill="none" ${stroke(P.headset, 18)}/>${cup(166)}${cup(584)}
  <path d="M606,544 Q612,640 546,660" fill="none" ${stroke(O, 12)}/><ellipse cx="530" cy="662" rx="25" ry="17" fill="#2B3350" ${stroke(O, 8)}/><ellipse cx="526" cy="660" rx="10" ry="6" fill="${P.headset}"/>`;
}

// ---------- chỏm lông ----------
function tuftSVG() {
  // lá tròn: gốc (0,0) -> đỉnh (0,-h), rộng w
  const leaf = (rot, h, w) => `<g transform="translate(400,278) rotate(${rot})"><path d="M0,0 C${-w},${-h * 0.25} ${-w * 0.95},${-h * 0.85} 0,${-h} C${w * 0.95},${-h * 0.85} ${w},${-h * 0.25} 0,0 Z" fill="${P.tuft}" ${stroke(O, 8)}/></g>`;
  return leaf(-38, 86, 30) + leaf(38, 86, 30) + leaf(0, 112, 34);
}

/**
 * @param {object} o
 *  expr    tên trong EXPRESSIONS (mặc định 'neutral'); eyes/brows/mouth/look ghi đè từng phần
 *  arms    tên trong ARM_POSES hoặc {L,R}; legs: stand|step|jump
 *  wave    0|1 — nhịp vẫy tay (chỉ khi arms='wave')
 *  tilt    độ nghiêng thân (độ, quanh chân); dy: nhấc lên (px, dùng cho nhún nhảy)
 *  size    chiều rộng ảnh xuất ra (px); bg: màu nền (mặc định trong suốt); uid: hậu tố id khi ghép nhiều nhân vật vào 1 SVG
 */
export function mascotSVG(o = {}) {
  const e = EXPRESSIONS[o.expr || 'neutral'];
  const eyes = o.eyes || e.eyes;
  const brows = o.brows || e.brows;
  const mouth = o.mouth || e.mouth;
  const look = o.look || e.look || [0, 0];
  let arms = typeof o.arms === 'object' ? o.arms : ARM_POSES[o.arms || 'rest'];
  if (!arms) throw new Error(`Tư thế tay không có: ${o.arms}`);
  if (o.arms === 'wave' && o.wave) arms = { ...arms, R: { ...arms.R, hand: [arms.R.hand[0] - arms.R.wave, arms.R.hand[1] + 14], ctrl: [arms.R.ctrl[0] - 12, arms.R.ctrl[1]] } };
  const legs = LEG_POSES[o.legs || 'stand'];
  if (!legs) throw new Error(`Tư thế chân không có: ${o.legs}`);
  const rise = (legs.rise || 0) + (o.dy || 0);
  const W = o.size || VIEWBOX.w;
  const H = Math.round((W * VIEWBOX.h) / VIEWBOX.w);
  const u = o.uid || '';
  const bodyClip = `<clipPath id="bodyClip${u}"><path d="${BODY}"/></clipPath>`;
  const shade = `<mask id="crescent${u}"><rect x="0" y="0" width="800" height="1200" fill="#fff"/><path d="${BODY}" transform="translate(-26,-18)" fill="#000"/></mask>`;
  const characterBits = `
  <g class="tuft">${tuftSVG()}</g>
  <g class="legs">${legSVG('L', legs.L)}${legSVG('R', legs.R)}</g>
  <g class="arms">${armSVG('L', arms.L)}${armSVG('R', arms.R)}</g>
  <path d="${BODY}" fill="${P.body}" ${stroke(O, 10)}/>
  <g clip-path="url(#bodyClip${u})"><ellipse cx="400" cy="705" rx="152" ry="172" fill="${P.belly}"/><rect x="0" y="0" width="800" height="1200" fill="${P.bodyShade}" opacity=".5" mask="url(#crescent${u})"/><ellipse cx="214" cy="560" rx="11" ry="62" transform="rotate(8 214 560)" fill="#fff" opacity=".38"/><g transform="translate(400,790)"><rect x="-44" y="-34" width="88" height="68" rx="22" fill="${P.headset}" ${stroke(O, 8)}/><path d="M-12,-17 L-12,17 L22,0 Z" fill="#fff" ${stroke('#fff', 6)}/></g></g>
  <path d="${BODY}" fill="none" ${stroke(O, 10)}/>
  <circle cx="258" cy="578" r="27" fill="${P.cheek}" opacity=".6"/><circle cx="542" cy="578" r="27" fill="${P.cheek}" opacity=".6"/>
  ${eyeSVG('L', eyes, look, u)}${eyeSVG('R', eyes, look, u)}${browSVG(brows)}${mouthSVG(mouth, u)}
  ${o.headset === false ? '' : headsetSVG()}
  <g class="hands">${handSVG('L', arms.L)}${handSVG('R', arms.R)}</g>`;
  const tilt = o.tilt ? `rotate(${o.tilt} 400 1040)` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}">
${o.bg ? `<rect x="-50" y="0" width="900" height="1200" fill="${o.bg}"/>` : ''}<defs>${bodyClip}${shade}</defs>
${o.shadow === false ? '' : `<ellipse cx="400" cy="1046" rx="${f(200 * legs.shadow)}" ry="${f(24 * legs.shadow)}" fill="#000" opacity=".2"/>`}
<g transform="translate(0,${-rise}) ${tilt}">${characterBits}</g></svg>`;
}
