import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {CameraController} from '../lib/CameraController';
import {OfficeEnvironment} from '../environments/OfficeEnvironment';
import {ease} from '../lib/easing';
import {slideIn, scaleIn, interpolateColor} from '../lib/animations';
import {getPose, PROP_KINDS} from '../assetManager';

/**
 * scene_type: character_acting - Cao dien xuat/tuong tac. Dung lai Office Environment (co chieu sau
 * that: background/midground/foreground) thay vi mau phang - day la cho da bi bao cao la "nen trong"
 * o vong QC truoc, gio sua bang component tai su dung chu khong ve rieng cho video nay.
 * props:
 *  - poses: [{t, id}] cross-fade giua cac dang theo moc giay(frame)
 *  - envProps: string[] truyen thang cho OfficeEnvironment (vd ['window','plant'])
 *  - textOverlay / roleLabels / noteCard: nhu truoc
 *  - shots: cho CameraController
 *  - pos: {x,y,height}
 *  - lightShift: {from, to, atFrame, duration} - doi mau anh sang moi truong khi chuyen vai/mood (vd
 *    am hon luc tu tin, lanh hon luc boi roi) - lam ro "dien bien" bang anh sang chu khong chi doi dang
 */
export const CharacterScene = ({poses = [], envProps, textOverlay, shots, pos = {x: 460, y: 760, height: 700}, roleLabels = [], noteCard, lightShift}) => {
	const frame = useCurrentFrame();
	const sorted = [...poses].sort((a, b) => a.t - b.t);
	for (const {id} of sorted) getPose(id); // nem loi som neu ten dang sai, khong de Producer doan nham

	const tint = lightShift ? interpolateColor(frame, lightShift) : undefined;

	return (
		<AbsoluteFill style={{backgroundColor: '#10131f'}}>
			<CameraController shots={shots}>
				<OfficeEnvironment props={envProps} tint={tint} spotlightX={pos.x + pos.height * 0.2} />
				{sorted.map(({t, id}, i) => {
					const next = sorted[i + 1];
					const opacity = next ? 1 - ease(frame, [next.t, next.t + 10], [0, 1], 'easeIn') : 1;
					if (frame < t - 1) return null;
					return <Img key={id + t} src={staticFile(`poses/${id}.png`)} style={{position: 'absolute', left: pos.x, top: pos.y, height: pos.height, opacity}} />;
				})}
				{(() => {
					let active = null;
					let activeIdx = -1;
					roleLabels.forEach((r, i) => {
						if (r.t <= frame) {
							active = r;
							activeIdx = i;
						}
					});
					if (!active) return null;
					const pop = scaleIn(frame, {from: active.t, duration: 10, intensity: 0.5});
					return (
						<div
							style={{
								position: 'absolute',
								left: pos.x - 20,
								top: pos.y - 70,
								background: activeIdx % 2 === 0 ? '#F28C28' : '#2F6FDE',
								color: 'white',
								fontFamily: 'Segoe UI',
								fontWeight: 700,
								fontSize: 30,
								padding: '8px 20px',
								borderRadius: 10,
								opacity: pop.opacity,
								transform: `scale(${pop.scale})`,
							}}
						>
							{active.text}
						</div>
					);
				})()}
				{noteCard
					? (() => {
							const s = slideIn(frame, {from: noteCard.from, duration: 12, direction: 'down', intensity: 30, easing: 'easeOut'});
							return (
								<div
									style={{
										position: 'absolute',
										left: noteCard.x,
										top: noteCard.y,
										opacity: s.opacity,
										transform: `translateY(${-s.y}px) rotate(-3deg)`,
										background: '#fdf6e3',
										color: '#2a2a2a',
										fontFamily: 'Segoe UI',
										fontWeight: 700,
										fontSize: 34,
										padding: '22px 28px',
										borderRadius: 6,
										boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
									}}
								>
									{noteCard.text}
								</div>
							);
					  })()
					: null}
				{textOverlay ? (
					<div
						style={{
							position: 'absolute',
							left: 60,
							right: 60,
							top: 300,
							opacity: ease(frame, [textOverlay.from, textOverlay.from + 8, textOverlay.to - 8, textOverlay.to], [0, 1, 1, 0], 'easeInOut'),
							fontFamily: 'Segoe UI',
							fontWeight: 700,
							fontSize: 64,
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

export const warnIfDeskConflict = (poses) => {
	const ids = poses.map((p) => p.id);
	const desk = ids.filter((id) => getPose(id).prop_kind === PROP_KINDS.DESK_SETUP);
	return [...new Set(desk)].length > 1;
};
