import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CameraController} from '../lib/CameraController';
import {ease} from '../lib/easing';
import {fadeIn} from '../lib/animations';

/**
 * scene_type: data_visualization - bang/bieu do thong ke that (khac ExplainerScene: do la so do quy
 * trinh dang khoi-noi-mui-ten, cai nay la SO LIEU co gia tri/don vi). Khong ve Cao (dung gop y giam
 * doc 18/11/2026 lan 2: "dang dua thong tin thi khong can Cao" - de so lieu tu noi len).
 * props:
 *  - title: tieu de bang/bieu do (vd "Ty le dung AI khi code")
 *  - bars: [{label, value, max, unit, color}] - 1 hang = 1 thanh ngang, dai theo value/max
 *  - startFrame / barInterval: nhip hien tung thanh (so le, khong hien cung luc)
 *  - caption: ghi chu nguon so lieu (hien nho duoi cung) - de trong neu khong co
 *  - shots: CameraController
 */
export const DataVizScene = ({title = '', bars = [], startFrame = 10, barInterval = 20, caption = '', shots}) => {
	const frame = useCurrentFrame();
	const chartLeft = 90;
	const chartWidth = 900;
	const rowH = 150;
	const topY = 460;

	return (
		<AbsoluteFill style={{backgroundColor: '#161a26'}}>
			<CameraController shots={shots}>
				{title ? (
					<div style={{position: 'absolute', left: 60, right: 60, top: 220, opacity: fadeIn(frame, {from: 0, duration: 16}), fontFamily: 'Segoe UI', fontWeight: 800, fontSize: 52, color: 'white', textAlign: 'center', lineHeight: '62px'}}>
						{title}
					</div>
				) : null}

				{bars.map((bar, i) => {
					const appearAt = startFrame + i * barInterval;
					const growDur = 22;
					const pct = ease(frame, [appearAt, appearAt + growDur], [0, Math.min(1, bar.value / (bar.max || 100))], 'easeOut');
					const shown = ease(frame, [appearAt, appearAt + 10], [0, (bar.value ?? 0)], 'linear');
					const opacity = fadeIn(frame, {from: appearAt, duration: 10});
					const y = topY + i * rowH;
					const color = bar.color || '#2F6FDE';
					return (
						<React.Fragment key={bar.label}>
							<div style={{position: 'absolute', left: chartLeft, top: y, opacity, fontFamily: 'Segoe UI', fontWeight: 700, fontSize: 30, color: 'white'}}>{bar.label}</div>
							<div style={{position: 'absolute', left: chartLeft, top: y + 48, width: chartWidth, height: 54, borderRadius: 12, background: '#232a3d', opacity}}>
								<div style={{position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct * 100}%`, borderRadius: 12, background: color}} />
							</div>
							<div style={{position: 'absolute', left: chartLeft + chartWidth - 170, top: y + 56, width: 170, textAlign: 'right', opacity, fontFamily: 'Segoe UI', fontWeight: 800, fontSize: 36, color: 'white'}}>
								{Math.round(shown)}
								{bar.unit || ''}
							</div>
						</React.Fragment>
					);
				})}

				{caption ? (
					<div style={{position: 'absolute', left: 60, right: 60, bottom: 110, opacity: fadeIn(frame, {from: startFrame + bars.length * barInterval, duration: 14}), fontFamily: 'Segoe UI', fontSize: 22, color: '#8a93ad', textAlign: 'center'}}>
						{caption}
					</div>
				) : null}
			</CameraController>
		</AbsoluteFill>
	);
};
