import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ease} from './easing';
import {SHOT_SCALE} from './shotPresets';

export {SHOT_SCALE};

/**
 * Camera Controller dung chung cho moi scene - doc du lieu tu storyboard (shots[]), KHONG hardcode
 * rieng tung video. Moi phan tu shots: {atFrame, shot (SHOT_SCALE key hoac so tuy y), focusX, focusY,
 * movement ('cut'|'push_in'|'pull_out'|'pan'|'tracking'|'hold'), durationIn (so khung de vao vi tri moi), purpose}.
 * `purpose` chi de ghi chu/debug (vd "nhan manh loi") - khong anh huong render, nhung bat buoc khai bao
 * de nhac Visual Director "moi chuyen dong camera phai co ly do" (muc V cua Master Prompt).
 */
export function CameraController({shots = [], children}) {
	const frame = useCurrentFrame();
	if (!shots.length) return <div style={{position: 'absolute', inset: 0}}>{children}</div>;

	const resolved = shots.map((s) => ({...s, scale: typeof s.shot === 'number' ? s.shot : SHOT_SCALE[s.shot] ?? 1, focusX: s.focusX ?? 540, focusY: s.focusY ?? 960}));

	// Tim shot hien tai (shot cuoi cung co atFrame <= frame) va shot truoc do de noi suy tu do sang dich.
	let idx = 0;
	for (let i = 0; i < resolved.length; i++) if (resolved[i].atFrame <= frame) idx = i;
	const cur = resolved[idx];
	const prev = idx > 0 ? resolved[idx - 1] : cur;
	const dIn = cur.durationIn ?? 20;

	let scale, originX, originY;
	if (cur.movement === 'cut' || idx === 0) {
		scale = cur.scale;
		originX = cur.focusX;
		originY = cur.focusY;
	} else {
		scale = ease(frame, [cur.atFrame, cur.atFrame + dIn], [prev.scale, cur.scale], 'easeInOut');
		originX = ease(frame, [cur.atFrame, cur.atFrame + dIn], [prev.focusX, cur.focusX], 'easeInOut');
		originY = ease(frame, [cur.atFrame, cur.atFrame + dIn], [prev.focusY, cur.focusY], 'easeInOut');
	}

	return (
		<div style={{position: 'absolute', inset: 0, transformOrigin: `${originX}px ${originY}px`, transform: `scale(${scale})`}}>
			{children}
		</div>
	);
}
