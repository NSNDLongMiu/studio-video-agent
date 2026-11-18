import React from 'react';

/**
 * Environment tai su dung: "Developer Workspace" - ban lam viec + man hinh. Rut ra tu UiSimulationScene
 * (truoc day viet thang trong tung scene, gio tach rieng de dung lai cho bat ky video nao can boi canh nay).
 * props:
 *  - monitorContent: node - noi dung ben trong man hinh (code, terminal, chat...) do scene component truyen vao
 *  - deskColor/wallTopColor/wallBottomColor: tuy chinh mau (giu nhat quan phong cach nhung cho doi theo video)
 *  - monitorShakeX: so px lech ngang (dung voi lib/animations.shake) khi can rung man hinh
 */
export function DeveloperWorkspace({monitorContent, deskColor = '#3d2a1d', wallTopColor = '#1b2030', wallBottomColor = '#262b3a', monitorShakeX = 0}) {
	return (
		<>
			{/* background: tuong */}
			<div style={{position: 'absolute', inset: 0, background: `linear-gradient(${wallTopColor} 0%, ${wallTopColor} 62%, ${wallBottomColor} 62%, ${wallBottomColor} 100%)`}} />
			{/* midground: ban + man hinh */}
			<div style={{position: 'absolute', left: 120, top: 1180, width: 840, height: 480, background: deskColor, borderRadius: 18}} />
			<div style={{position: 'absolute', left: 120, top: 1180, width: 840, height: 26, background: '#58402c', borderRadius: '18px 18px 0 0'}} />
			<div style={{position: 'absolute', left: 280, top: 640, width: 620, height: 470, background: '#0d1016', borderRadius: 16, border: '10px solid #22262f', transform: `translateX(${monitorShakeX}px)`, overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: 28, top: 28, right: 28, bottom: 28}}>{monitorContent}</div>
			</div>
			<div style={{position: 'absolute', left: 560, top: 1110, width: 60, height: 90, background: '#22262f'}} />
		</>
	);
}

/** Vi tri dat nhan vat mac dinh cho environment nay (ben phai man hinh) + tieu cu camera goi y cho CameraController. */
export const DEVELOPER_WORKSPACE_MARKS = {
	characterPos: {x: 760, y: 980, height: 560},
	cameraFocus: {x: 590, y: 880},
};
