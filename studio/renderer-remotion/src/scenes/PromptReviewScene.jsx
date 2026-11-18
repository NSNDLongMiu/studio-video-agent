import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {CameraController} from '../lib/CameraController';
import {ease} from '../lib/easing';
import {slideIn} from '../lib/animations';
import {getPose} from '../assetManager';

const HAND = {x: 300, y: 1090}; // vi tri tay Cao (uoc luong tren dang chi tay) - goc cho duong noi toi tung tag

/** Duong noi tu tay Cao toi 1 tag - "ve ra" dan theo % thay vi hien nguyen ngay (tao lien he thi giac that). */
function ConnectorLine({to, progress}) {
	const dx = to.x - HAND.x;
	const dy = to.y - HAND.y;
	const len = Math.sqrt(dx * dx + dy * dy) * progress;
	const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
	if (progress <= 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: HAND.x,
				top: HAND.y,
				width: len,
				height: 3,
				background: 'rgba(214,80,80,0.75)',
				transformOrigin: '0 0',
				transform: `rotate(${angle}deg)`,
			}}
		/>
	);
}

/**
 * scene_type: metaphor_animation - "xem lai yeu cau mo ho". Vong sua lan 2: rut ngan khoang trong giua
 * the yeu cau va cac tag, THEM duong noi tu Cao toi tung tag (lien he thi giac), camera dan tam nhin tu
 * the yeu cau sang tung tag thay vi chi push_in trang tri.
 * props: promptText, missingTags: [{text,x,y,from}] (<=3), basePose/reactPose/reactPoseFrom, shots
 */
export const PromptReviewScene = ({promptText = '', missingTags = [], basePose, reactPose, reactPoseFrom = 70, shots}) => {
	const frame = useCurrentFrame();
	if (basePose) getPose(basePose);
	if (reactPose) getPose(reactPose);
	const card = slideIn(frame, {from: 0, duration: 16, direction: 'up', intensity: 40, easing: 'easeOut'});
	const reactOpacity = reactPose ? ease(frame, [reactPoseFrom, reactPoseFrom + 14], [0, 1], 'easeOut') : 0;

	const blobs = [
		{x: 120, y: 260, s: 340, c: '#223055', drift: 6},
		{x: 760, y: 1460, s: 420, c: '#2a1f3d', drift: -8},
	];

	return (
		<AbsoluteFill style={{backgroundColor: '#14182a'}}>
			<CameraController shots={shots}>
				{blobs.map((b, i) => {
					const dy = Math.sin((frame / 90) * Math.PI * 2) * b.drift;
					return <div key={i} style={{position: 'absolute', left: b.x, top: b.y + dy, width: b.s, height: b.s, borderRadius: '50%', background: b.c, filter: 'blur(2px)', opacity: 0.6}} />;
				})}

				<div style={{position: 'absolute', left: 140, right: 140, top: 420 - card.y, opacity: card.opacity, background: '#1f2538', border: '2px solid #333c58', borderRadius: 24, padding: '30px 36px', boxShadow: '0 20px 50px rgba(0,0,0,0.35)'}}>
					<div style={{fontFamily: 'Segoe UI', fontWeight: 700, fontSize: 24, color: '#7a85a8', marginBottom: 12}}>YEU CAU</div>
					<div style={{fontFamily: 'Segoe UI', fontWeight: 700, fontSize: 40, color: 'white', lineHeight: '52px'}}>{promptText}</div>
				</div>

				{missingTags.map((tag) => {
					const lineProgress = ease(frame, [tag.from - 10, tag.from + 2], [0, 1], 'easeOut');
					const anim = slideIn(frame, {from: tag.from, duration: 12, direction: 'left', intensity: 40, easing: 'easeOutBack'});
					return (
						<React.Fragment key={tag.text}>
							<ConnectorLine to={{x: tag.x + 20, y: tag.y + 20}} progress={lineProgress} />
							<div
								style={{
									position: 'absolute',
									left: tag.x - anim.x,
									top: tag.y,
									opacity: anim.opacity,
									background: '#c23b3b',
									color: 'white',
									fontFamily: 'Segoe UI',
									fontWeight: 700,
									fontSize: 26,
									padding: '12px 20px',
									borderRadius: 10,
								}}
							>
								{tag.text}
							</div>
						</React.Fragment>
					);
				})}

				{basePose ? <Img src={staticFile(`poses/${basePose}.png`)} style={{position: 'absolute', left: 90, top: 1020, height: 520, opacity: 1 - reactOpacity}} /> : null}
				{reactPose ? <Img src={staticFile(`poses/${reactPose}.png`)} style={{position: 'absolute', left: 90, top: 1020, height: 520, opacity: reactOpacity}} /> : null}
			</CameraController>
		</AbsoluteFill>
	);
};
