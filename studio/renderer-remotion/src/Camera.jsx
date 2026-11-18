import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';

/**
 * Camera gia lap bang CSS transform that (khong phai zoom pixel nhu ffmpeg zoompan) - da kiem trong POC.
 * keyframes: [{t, scale, originX, originY}] - t tinh bang khung hinh (frame), noi suy tuyen tinh giua cac moc.
 * Neu chi co 1 moc hoac khong truyen gi -> dung yen (tinh = khong lang phi chuyen dong khi khong co ly do).
 */
export function Camera({keyframes, children}) {
	const frame = useCurrentFrame();
	if (!keyframes || keyframes.length < 2) {
		return <div style={{position: 'absolute', inset: 0}}>{children}</div>;
	}
	const ts = keyframes.map((k) => k.t);
	const scales = keyframes.map((k) => k.scale ?? 1);
	const scale = interpolate(frame, ts, scales, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	// transform-origin co dinh theo moc gan nhat <= frame hien tai (camera "nhay" muc tieu moi lan doi canh, khong keo origin lien tuc)
	let origin = keyframes[0];
	for (const k of keyframes) if (k.t <= frame) origin = k;
	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				transformOrigin: `${origin.originX ?? 540}px ${origin.originY ?? 960}px`,
				transform: `scale(${scale})`,
			}}
		>
			{children}
		</div>
	);
}
