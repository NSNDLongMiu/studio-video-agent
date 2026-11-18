import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {CameraController} from '../lib/CameraController';
import {ease} from '../lib/easing';
import {fadeIn} from '../lib/animations';
import {getPose} from '../assetManager';

/**
 * scene_type: character_acting (dung chung cho 1 CHUONG kich ban that: hook/doi thoai/ghi chu/code).
 * Sua theo gop y giam doc 18/11/2026 (2 lan): "giam tham gia cua Cao, chi cho vao khi can minh hoa".
 * Lan 2 (sau Demo02): siet tiep - Cao CHI xuat hien o beat 'hook' (luc dan truyen/mo canh). Cac beat
 * 'dialogue'/'code'/'note' la luc DANG DUA THONG TIN (doi thoai/code/ghi chu) -> KHONG ve Cao, chi
 * con the ten + bong thoai/code de thong tin tu noi len, khong can hinh Cao di kem.
 * props:
 *  - beats: [{t, type, ...}] - moc giay(frame) va noi dung tung nhip:
 *    - hook: {text, caoPose, caoSize:'big'}
 *    - badge: {text} (the hu cau o giua roi thu nho goc trai tren - don gian hoa: luon hien nho goc)
 *    - dialogue: {speaker:'CHI'|'CAO_UV', name, bubble, side:'left'|'right', stamp?:{text,color}} (khong can caoPose nua)
 *    - note: {title, lines:[string]}
 *    - code: {codeLines, stamp?:{text,color}}
 *  - shots: CameraController (khuyen nghi: it hoac khong chuyen dong - giam doc che "chuyen dong di qua xa")
 */
const COLORS = {CHI: '#2F6FDE', CAO_UV: '#F28C28'};

export const QASequenceScene = ({beats = [], shots}) => {
	const frame = useCurrentFrame();
	let active = null;
	let activeIdx = -1;
	beats.forEach((b, i) => {
		if (b.t <= frame) {
			active = b;
			activeIdx = i;
		}
	});
	if (!active) return <AbsoluteFill style={{backgroundColor: '#161a26'}} />;
	const next = beats[activeIdx + 1];
	const localFrame = frame - active.t;
	const fadeOutStart = next ? next.t - active.t - 10 : 999999;

	if (active.caoPose) getPose(active.caoPose);

	const opacity = fadeIn(frame, {from: active.t, duration: 10});
	const exitOpacity = localFrame > fadeOutStart ? Math.max(0, 1 - (localFrame - fadeOutStart) / 10) : 1;
	const contentOpacity = Math.min(opacity, exitOpacity);

	return (
		<AbsoluteFill style={{backgroundColor: '#161a26'}}>
			<CameraController shots={shots}>
				{/* huy hieu hu cau - hien nho goc trai tren SUOT video, khong chiem cho chinh (dung 1 lan, khong lap lai moi beat) */}
				<div style={{position: 'absolute', left: 36, top: 36, background: 'transparent', border: '2px solid #F28C28', borderRadius: 10, padding: '8px 14px', opacity: fadeIn(frame, {from: 0, duration: 15})}}>
					<span style={{fontFamily: 'Segoe UI', fontWeight: 700, fontSize: 18, color: '#F28C28'}}>Tinh huong minh hoa</span>
				</div>

				{active.type === 'hook' ? (
					<>
						<div style={{position: 'absolute', left: 60, right: 60, top: 320, opacity: contentOpacity, fontFamily: 'Segoe UI', fontWeight: 800, fontSize: 72, color: 'white', textAlign: 'center', lineHeight: '84px'}}>
							{active.text}
						</div>
						<Img src={staticFile(`poses/${active.caoPose}.png`)} style={{position: 'absolute', left: 360, top: 900, height: 700, opacity: contentOpacity}} />
					</>
				) : null}

				{active.type === 'note' ? (
					<div style={{position: 'absolute', left: 120, right: 120, top: 500, opacity: contentOpacity, background: '#1f2538', border: '2px solid #333c58', borderRadius: 20, padding: '28px 32px'}}>
						<div style={{fontFamily: 'Segoe UI', fontWeight: 700, fontSize: 24, color: '#F28C28', marginBottom: 14}}>GHI CHU NHANH</div>
						{active.lines.map((l, i) => (
							<div key={i} style={{fontFamily: 'Segoe UI', fontWeight: 700, fontSize: 34, color: 'white', marginBottom: 8, opacity: fadeIn(frame, {from: active.t + i * 15, duration: 10})}}>
								{l}
							</div>
						))}
					</div>
				) : null}

				{active.type === 'dialogue' || active.type === 'code' ? (
					<>
						{active.type === 'code' ? (
							<>
								<div style={{position: 'absolute', left: 140, top: 380, width: 800, height: 300, background: '#0d1016', borderRadius: 16, border: '8px solid #22262f', padding: 24, opacity: contentOpacity}}>
									<div style={{fontFamily: 'Segoe UI', fontSize: 18, color: '#7a85a8', marginBottom: 8}}>Code minh hoa</div>
									{active.codeLines.map((l, i) => (
										<div key={i} style={{fontFamily: 'Consolas, monospace', fontSize: 24, color: '#7CFFA0', lineHeight: '32px'}}>{l}</div>
									))}
								</div>
								{active.bubble ? (
									<div style={{position: 'absolute', left: 140, top: 700, width: 800, opacity: contentOpacity, background: '#1f2538', border: `3px solid ${COLORS[active.speaker] || '#F28C28'}`, borderRadius: 16, padding: '20px 26px'}}>
										<div style={{fontFamily: 'Segoe UI', fontWeight: 700, fontSize: 28, color: 'white', lineHeight: '38px'}}>{active.bubble}</div>
									</div>
								) : null}
							</>
						) : (
							<div
								style={{
									position: 'absolute',
									left: active.side === 'right' ? 420 : 100,
									top: 560,
									width: 560,
									opacity: contentOpacity,
									background: '#1f2538',
									border: `3px solid ${COLORS[active.speaker]}`,
									borderRadius: 20,
									padding: '26px 30px',
								}}
							>
								<div style={{fontFamily: 'Segoe UI', fontWeight: 700, fontSize: 20, color: COLORS[active.speaker], marginBottom: 10}}>{active.name}</div>
								<div style={{fontFamily: 'Segoe UI', fontWeight: 700, fontSize: 32, color: 'white', lineHeight: '42px'}}>{active.bubble}</div>
							</div>
						)}
						{/* Khong ve Cao o day nua: 'dialogue'/'code' la luc dang dua thong tin, Cao chi can luc 'hook' (xem comment dau file). */}
						{active.stamp ? (
							<div
								style={{
									position: 'absolute',
									left: active.type === 'code' ? 140 : active.side === 'right' ? 420 : 100,
									top: active.type === 'code' ? (active.bubble ? 920 : 700) : 740,
									background: active.stamp.color,
									color: 'white',
									fontFamily: 'Segoe UI',
									fontWeight: 700,
									fontSize: 22,
									padding: '10px 18px',
									borderRadius: 10,
									opacity: fadeIn(frame, {from: (active.stamp.from ?? active.t + 20), duration: 10}) * contentOpacity,
								}}
							>
								{active.stamp.text}
							</div>
						) : null}
					</>
				) : null}
			</CameraController>
		</AbsoluteFill>
	);
};
