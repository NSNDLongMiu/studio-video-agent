import React from 'react';

/**
 * Environment tai su dung: "Office Environment" - van phong co chieu sau that + 1 diem nhan sang de
 * mat nguoi xem don vao nhan vat (vong sua lan 2: ban dau bi che la "toi, trong, giong khoi chu nhat").
 * props:
 *  - props: string[] - dao cu bat/tat: 'window','plant','shelf','frame'
 *  - tint: mau anh sang chu dao - CO THE truyen gia tri da noi suy theo frame (vd doi mood giua 2 vai)
 *  - spotlightX: tam sang chinh (dat trung vi tri nhan vat dang dung) - tao diem nhan, khong de moi thu bang nhau
 *  - floorY: vi tri bat dau san
 */
const DEFAULT_PROPS = ['window', 'plant', 'shelf', 'frame'];

export function OfficeEnvironment({props = DEFAULT_PROPS, tint = '#1b2030', spotlightX = 400, floorY = 1520}) {
	const has = (p) => props.includes(p);
	return (
		<>
			{/* BACKGROUND: tuong + 1 vung sang tam (spotlight) sau lung nhan vat - tao diem nhan ro rang
			    thay vi anh sang deu tat ca (ly do chinh bi che la "phang, giong khoi chu nhat"). */}
			<div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${tint} 0%, #0d0f1a 100%)`}} />
			<div
				style={{
					position: 'absolute',
					left: spotlightX - 420,
					top: -100,
					width: 840,
					height: 1400,
					background: 'radial-gradient(ellipse at center, rgba(255,214,158,0.14) 0%, rgba(255,214,158,0) 65%)',
				}}
			/>

			{has('window') ? (
				<div style={{position: 'absolute', left: 700, top: 160, width: 280, height: 360}}>
					<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(140,175,230,0.3), rgba(140,175,230,0.08))', border: '10px solid #2a2f45'}} />
					{/* thanh ngang/doc chia o cua so - khong cai nay thi chi la 1 khoi chu nhat mo, dung nhu gop y */}
					<div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 8, background: '#2a2f45'}} />
					<div style={{position: 'absolute', top: '50%', left: 0, right: 0, height: 8, background: '#2a2f45'}} />
					<div style={{position: 'absolute', left: -10, bottom: -18, width: 300, height: 18, background: '#232842', borderRadius: 2}} />
				</div>
			) : null}

			{has('frame') ? (
				<div style={{position: 'absolute', left: 60, top: 220, width: 150, height: 190, background: '#1c2135', border: '6px solid #343c58', borderRadius: 4, opacity: 0.9}}>
					<div style={{position: 'absolute', inset: 14, background: 'linear-gradient(135deg,#2c3550,#1c2135)'}} />
				</div>
			) : null}

			{/* MIDGROUND: do noi that - lam mo/giam do tuong phan de luon dung sau nhan vat ve thi giac */}
			{has('shelf') ? (
				<div style={{position: 'absolute', left: 40, top: 520, width: 160, height: 380, background: '#1f2538', borderRadius: 6, opacity: 0.65}}>
					{[0, 1, 2].map((i) => (
						<div key={i} style={{position: 'absolute', left: 12, top: 18 + i * 122, width: 136, height: 98, background: '#262d46', borderRadius: 4}} />
					))}
				</div>
			) : null}
			{has('plant') ? (
				<div style={{position: 'absolute', left: 920, top: 1180, width: 130, height: 200, opacity: 0.75}}>
					<div style={{position: 'absolute', bottom: 0, left: 28, width: 74, height: 80, background: '#4a3a28', borderRadius: '8px 8px 4px 4px'}} />
					<div style={{position: 'absolute', bottom: 62, left: 8, width: 114, height: 112, background: '#35623f', borderRadius: '50% 50% 40% 40%'}} />
				</div>
			) : null}

			{/* San co chut phan chieu nhe (gradient doi chieu) thay vi 1 mau phang tuyet doi */}
			<div style={{position: 'absolute', left: 0, right: 0, top: floorY, bottom: 0, background: 'linear-gradient(180deg, #1a1f30 0%, #12151f 100%)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: floorY - 10, height: 20, background: 'linear-gradient(rgba(0,0,0,0.3), transparent)'}} />
			{/* bong do mem duoi chan, tam voi spotlight */}
			<div style={{position: 'absolute', left: spotlightX - 160, top: floorY - 6, width: 320, height: 26, background: 'rgba(0,0,0,0.35)', borderRadius: '50%', filter: 'blur(6px)'}} />

			<div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 220px 60px rgba(0,0,0,0.4)', pointerEvents: 'none'}} />
		</>
	);
}

export const OFFICE_ENVIRONMENT_MARKS = {
	characterPosA: {x: 140, y: 880, height: 600}, // vai trai (vd "Quan ly")
	characterPosB: {x: 640, y: 880, height: 600}, // vai phai (vd "nguoi nhan")
	cameraFocus: {x: 540, y: 1100},
};
