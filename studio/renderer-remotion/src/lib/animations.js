// Animation Preset Library - moi preset la 1 ham thuan (frame, config) -> gia tri/style, KHONG phai
// component rieng. Producer/scene component chi goi ham, khong phai viet lai cong thuc interpolate moi lan.
// Config chung cho moi preset: {from, duration, delay=0, easing, direction, intensity, fps=30}.
import {ease, easeSpring} from './easing';

const start = (c) => (c.delay || 0) + (c.from ?? 0);

export function fadeIn(frame, c) {
	const s = start(c);
	return ease(frame, [s, s + c.duration], [0, 1], c.easing || 'easeOut');
}

export function fadeOut(frame, c) {
	const s = start(c);
	return ease(frame, [s, s + c.duration], [1, 0], c.easing || 'easeIn');
}

/** direction: 'up'|'down'|'left'|'right'. intensity = so px di chuyen. Tra ve {x,y,opacity}. */
export function slideIn(frame, c) {
	const s = start(c);
	const dist = c.intensity ?? 60;
	const [dx, dy] = {up: [0, dist], down: [0, -dist], left: [dist, 0], right: [-dist, 0]}[c.direction || 'up'];
	const t = ease(frame, [s, s + c.duration], [0, 1], c.easing || 'easeOut');
	return {x: dx * (1 - t), y: dy * (1 - t), opacity: t};
}

export function scaleIn(frame, c) {
	const s = start(c);
	const from = c.intensity ?? 0.4;
	return {scale: ease(frame, [s, s + c.duration], [from, 1], c.easing || 'easeOutBack'), opacity: ease(frame, [s, s + c.duration * 0.6], [0, 1], 'easeOut')};
}

/** Nay vao that bang vat ly (spring), khong phai easing gia lap - dung cho vat the can cam giac "co luc". */
export function springIn(frame, c) {
	return easeSpring(frame, {fps: c.fps || 30, delay: start(c)});
}

/** stagger: tra ve mang delay cho N phan tu, moi phan tu cach nhau `gap` khung hinh, de truyen vao preset khac. */
export function stagger(count, gap = 8, baseDelay = 0) {
	return Array.from({length: count}, (_, i) => baseDelay + i * gap);
}

/** Go chu tang dan - thay cho script Pillow rieng da dung o buoc audit; day la ban dung chung trong Remotion. */
export function typewriter(frame, c, text) {
	const s = start(c);
	const n = ease(frame, [s, s + c.duration], [0, text.length], 'linear');
	return text.slice(0, Math.max(0, Math.round(n)));
}

/** highlight: nhap nhay/sang len tai 1 thoi diem (vd dong code bi loi) - tra ve opacity 0..1..0. */
export function highlight(frame, c) {
	const s = start(c);
	const d = c.duration || 20;
	return ease(frame, [s, s + d * 0.3, s + d * 0.7, s + d], [0, 1, 1, 0], 'easeInOut');
}

/** reveal: dung voi clip-path hoac width de "vat ra" dan 1 vung noi dung (vd 1 dong trong bang so sanh). */
export function reveal(frame, c) {
	const s = start(c);
	return ease(frame, [s, s + c.duration], [0, 100], c.easing || 'easeOut'); // % - dung lam clip-path inset hoac width
}

/** shake: rung nhe trong khoang thoi gian ngan - dung khi "chay code"/"loi" sap xuat hien, KHONG dung lien tuc ca canh. */
export function shake(frame, c) {
	const s = start(c);
	const d = c.duration || 10;
	if (frame < s || frame > s + d) return 0;
	const intensity = c.intensity ?? 4;
	return Math.sin((frame - s) * 3) * intensity * (1 - (frame - s) / d);
}

/** bounce: nay nhe khi 1 vat/nhan vat moi xuat hien hoac doi trang thai - dung easeOutBack tren scale. */
export function bounce(frame, c) {
	const s = start(c);
	return ease(frame, [s, s + (c.duration || 12)], [c.intensity ?? 0.6, 1], 'easeOutBack');
}

/** objectEntrance/objectExit: gop fade+slide+scale thanh 1 preset "vat the bay vao/ra" dung 1 dong. */
export function objectEntrance(frame, c) {
	const sl = slideIn(frame, c);
	const sc = scaleIn(frame, c);
	return {...sl, scale: sc.scale};
}
/** Doi mau anh sang/nen theo thoi gian (vd doi mood giua 2 vai) - {from:'#rrggbb', to:'#rrggbb', atFrame, duration}. */
export function interpolateColor(frame, {from, to, atFrame = 0, duration = 20}) {
	const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
	const [r1, g1, b1] = hex(from);
	const [r2, g2, b2] = hex(to);
	const t = ease(frame, [atFrame, atFrame + duration], [0, 1], 'easeInOut');
	const mix = (a, b) => Math.round(a + (b - a) * t);
	const h = (n) => n.toString(16).padStart(2, '0');
	return `#${h(mix(r1, r2))}${h(mix(g1, g2))}${h(mix(b1, b2))}`;
}

export function objectExit(frame, c) {
	const s = start(c);
	const t = ease(frame, [s, s + (c.duration || 14)], [0, 1], 'easeIn');
	return {opacity: 1 - t, scale: 1 - 0.3 * t};
}
