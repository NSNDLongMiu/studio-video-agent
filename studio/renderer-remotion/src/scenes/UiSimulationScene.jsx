import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {CameraController} from '../lib/CameraController';
import {DeveloperWorkspace} from '../environments/DeveloperWorkspace';
import {ease} from '../lib/easing';
import {typewriter, slideIn, fadeIn, shake} from '../lib/animations';
import {getPose} from '../assetManager';

/**
 * scene_type: ui_simulation - mo phong IDE/terminal/man hinh phan mem.
 * Dung lai Developer Workspace environment + Camera Controller + Animation Presets (khong tu viet
 * interpolate rieng trong scene nay nua - dung "component tai su dung" theo yeu cau Master Prompt muc III/V/VI).
 * props:
 *  - codeLines: string[] - cac dong code (hieu ung go bang preset typewriter)
 *  - typeFrom/typeTo: frame bat dau/ket thuc go chu
 *  - errorText / successText: chu canh bao (do hoac xanh la, dung 1 trong 2)
 *  - bannerFrom: frame banner bat dau truot vao (preset slideIn)
 *  - reactPoseFrom: frame doi Cao sang dang phan ung
 *  - basePose / reactPose: ten dang (assetManager)
 *  - shots: [{atFrame, shot, focusX, focusY, movement, durationIn}] cho CameraController
 *  - textOverlay: {text, from, to} chu nhan manh rieng
 */
export const UiSimulationScene = ({
	codeLines = [],
	typeFrom = 10,
	typeTo = 40,
	errorText = null,
	successText = null,
	bannerFrom = 90,
	reactPoseFrom = 108,
	basePose,
	reactPose,
	shots,
	textOverlay,
}) => {
	const frame = useCurrentFrame();
	if (basePose) getPose(basePose);
	if (reactPose) getPose(reactPose);

	const fullCodeText = codeLines.join('\n');
	const typedLen = Math.round(ease(frame, [typeFrom, typeTo], [0, fullCodeText.length], 'linear'));
	const typedText = fullCodeText.slice(0, typedLen);

	const banner = errorText ? {text: errorText, color: '#c23b3b'} : successText ? {text: successText, color: '#2fae6b'} : null;
	const slide = banner ? slideIn(frame, {from: bannerFrom, duration: 20, direction: 'up', intensity: 70, easing: 'easeOutBack'}) : null;
	const reactOpacity = reactPose ? fadeIn(frame, {from: reactPoseFrom, duration: 14}) : 0;
	const shakeX = banner ? shake(frame, {from: bannerFrom - 10, duration: 10, intensity: 4}) : 0;

	return (
		<AbsoluteFill style={{backgroundColor: '#13161f'}}>
			<CameraController shots={shots}>
				<DeveloperWorkspace
					monitorShakeX={shakeX}
					monitorContent={
						<div style={{position: 'relative', width: '100%', height: '100%'}}>
							<div style={{fontFamily: 'Consolas, monospace', fontSize: 30, color: '#7CFFA0', lineHeight: '42px', whiteSpace: 'pre-wrap'}}>{typedText}</div>
							{banner ? (
								<div
									style={{
										position: 'absolute',
										left: 0,
										bottom: 40,
										transform: `translateY(${slide.y}px)`,
										opacity: slide.opacity,
										width: 536,
										padding: '18px 22px',
										background: banner.color,
										borderRadius: 10,
										fontFamily: 'Segoe UI',
										fontWeight: 700,
										color: 'white',
										fontSize: 26,
									}}
								>
									{banner.text}
								</div>
							) : null}
						</div>
					}
				/>
				{basePose ? <Img src={staticFile(`poses/${basePose}.png`)} style={{position: 'absolute', left: 760, top: 980, height: 560, opacity: 1 - reactOpacity}} /> : null}
				{reactPose ? <Img src={staticFile(`poses/${reactPose}.png`)} style={{position: 'absolute', left: 760, top: 980, height: 560, opacity: reactOpacity}} /> : null}
				{textOverlay ? (
					<div
						style={{
							position: 'absolute',
							left: 60,
							right: 60,
							top: 200,
							opacity: ease(frame, [textOverlay.from, textOverlay.from + 8, textOverlay.to - 8, textOverlay.to], [0, 1, 1, 0], 'easeInOut'),
							fontFamily: 'Segoe UI',
							fontWeight: 700,
							fontSize: 60,
							color: 'white',
							textAlign: 'center',
						}}
					>
						{textOverlay.text}
					</div>
				) : null}
			</CameraController>
		</AbsoluteFill>
	);
};
