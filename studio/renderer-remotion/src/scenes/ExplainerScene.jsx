import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {CameraController} from '../lib/CameraController';
import {ease} from '../lib/easing';
import {scaleIn} from '../lib/animations';
import {getPose} from '../assetManager';

/**
 * scene_type: explainer (gom process_animation / comparison_scene - so do khoi-noi-mui-ten).
 * data_visualization (bang/bieu do so lieu that) dung rieng DataVizScene.jsx, khong dung component nay.
 * props:
 *  - steps: [{label, color}] - cac khoi hien lan luot noi tiep bang mui ten (vd GOAL -> INPUT -> OUTPUT)
 *  - stepInterval / startFrame: nhip hien khoi
 *  - pose: ten dang Cao (assetManager) dung chi vao tung khoi
 *  - pointFrames: [frame,...] moc doi huong chi (khop so luong steps)
 *  - shots: cho CameraController
 */
export const ExplainerScene = ({steps = [], stepInterval = 25, startFrame = 10, pose, pointFrames = [], shots}) => {
	const frame = useCurrentFrame();
	if (pose) getPose(pose);
	const n = steps.length;
	const boxW = 280;
	const gap = 70;
	const totalW = n * boxW + (n - 1) * gap;
	const startX = (1080 - totalW) / 2;
	const y = 860;

	// Cao di chuyen mem giua cac moc pointFrames (xem lib/easing - thay cho interpolate tuyen tinh truoc day).
	const xOf = (idx) => startX + idx * (boxW + gap) + boxW / 2 - 220;
	const MOVE_DUR = 14;
	let caoXAnim = xOf(0);
	if (pointFrames.length) {
		const ts = [];
		const xs = [];
		pointFrames.forEach((f, i) => {
			if (i > 0) {
				ts.push(f);
				xs.push(xOf(i - 1));
			}
			ts.push(f + MOVE_DUR);
			xs.push(xOf(i));
		});
		caoXAnim = ease(frame, ts, xs, 'easeInOut');
	}

	// Sau khi het 3 khoi, 1 diem sang "chay" tu khoi dau sang khoi cuoi - mo phong thong tin di chuyen
	// giua cac buoc (thay vi chi 3 khoi tinh hien ra roi dung yen - day la gop y "lam ro luong xu ly").
	const allShownAt = startFrame + (n - 1) * stepInterval + 20;
	const flowDur = 70;
	const flowX = ease(frame, [allShownAt, allShownAt + flowDur], [xOf(0) + 220, xOf(n - 1) + 220], 'easeInOut');
	const flowActive = frame >= allShownAt && frame <= allShownAt + flowDur;
	const flowOpacity = ease(frame, [allShownAt, allShownAt + 10, allShownAt + flowDur - 10, allShownAt + flowDur], [0, 1, 1, 0], 'easeInOut');

	return (
		<AbsoluteFill style={{backgroundColor: '#161a26'}}>
			<CameraController shots={shots}>
				{steps.map((step, i) => {
					const appearAt = startFrame + i * stepInterval;
					const s = scaleIn(frame, {from: appearAt, duration: 14, intensity: 0.4});
					const x = startX + i * (boxW + gap);
					// diem sang di qua dung vi tri khoi nay -> khoi "nay len" nhe 1 lan, khong chi dung yen
					const passPulse = flowActive && Math.abs(flowX - (x + boxW / 2)) < 30 ? 1.08 : 1;
					const lineGrow = ease(frame, [appearAt - 10, appearAt + 4], [0, 1], 'easeOut'); // duong noi "ve ra" dan, khong hien thang
					return (
						<React.Fragment key={step.label}>
							{i > 0 ? <div style={{position: 'absolute', left: x - gap, top: y + 58, width: gap * lineGrow, height: 6, background: '#5a6275', opacity: s.opacity}} /> : null}
							<div
								style={{
									position: 'absolute',
									left: x,
									top: y,
									width: boxW,
									height: 120,
									borderRadius: 16,
									background: step.color || '#2F6FDE',
									opacity: s.opacity,
									transform: `scale(${s.scale * passPulse})`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: 'white',
									fontFamily: 'Segoe UI',
									fontWeight: 700,
									fontSize: 40,
									textAlign: 'center',
									padding: '0 16px',
								}}
							>
								{step.label}
							</div>
						</React.Fragment>
					);
				})}
				{flowActive ? (
					<div style={{position: 'absolute', left: flowX - 10, top: y + 48, width: 20, height: 20, borderRadius: '50%', background: '#ffe08a', opacity: flowOpacity, boxShadow: '0 0 16px 4px rgba(255,224,138,0.8)'}} />
				) : null}
				{pose ? <Img src={staticFile(`poses/${pose}.png`)} style={{position: 'absolute', left: caoXAnim, top: 1020, height: 520}} /> : null}
			</CameraController>
		</AbsoluteFill>
	);
};
