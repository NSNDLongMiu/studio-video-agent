// Easing dung chung - thay cho noi suy tuyen tinh (bug POC lan truoc bi che la "may moc").
// Boc lai Easing co san cua Remotion + ham spring, dat ten de Visual Director/Producer chon bang chu,
// khong phai tu nho cong thuc Bezier.
import {Easing, interpolate, spring} from 'remotion';

export const EASINGS = {
	linear: Easing.linear,
	easeIn: Easing.in(Easing.cubic),
	easeOut: Easing.out(Easing.cubic),
	easeInOut: Easing.inOut(Easing.cubic),
	easeOutBack: Easing.out(Easing.back(1.6)), // "nay nhe qua diem dich" - hop voi vat the bay vao
};

/** interpolate co easing, thay the hau het cho goi interpolate() tron trong cac scene cu. */
export function ease(frame, range, output, easingName = 'easeInOut', opts = {}) {
	return interpolate(frame, range, output, {
		easing: EASINGS[easingName] || EASINGS.easeInOut,
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		...opts,
	});
}

/** Spring that (khong phai gia lap) - dung cho vat the "nay vao" cam giac co luc, vd the canh bao/nhan. */
export function easeSpring(frame, {fps = 30, from = 0, to = 1, delay = 0, config} = {}) {
	return spring({frame: frame - delay, fps, from, to, config: {damping: 14, mass: 0.6, stiffness: 120, ...config}});
}
