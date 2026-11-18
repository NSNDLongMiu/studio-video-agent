// Asset Manager — danh mục 46 dáng Cáo trong brand/cao/poses/, phân loại theo đúng 5 mục giám đốc yêu cầu
// (khong co dao cu / co dao cu tich hop / loai dao cu / hanh dong-bieu cam phu hop / gioi han khi dung).
// Nguon su that: brand/cao/catalog.png (xem bang anh) + tung file PNG trong brand/cao/poses/.
// Visual Director doc file nay (khong doc ten dang bang doan) truoc khi chon dang cho 1 canh.

export const PROP_KINDS = {
	NONE: 'khong_dao_cu',
	DESK_SETUP: 'ban_lam_viec_tich_hop', // ca ban + ghe + laptop + do trang tri da ve san trong anh
	PRESENT_BOARD: 'bang_thuyet_trinh_tich_hop', // bang flip-chart + bieu do co san
	CHAIR_ONLY: 'ghe_rieng', // chi co ghe, khong co ban/laptop
	HANDHELD_LAPTOP: 'laptop_cam_tay',
	HANDHELD_CLIPBOARD: 'kep_tai_lieu_cam_tay',
	HANDHELD_PAPER: 'giay_to_cam_tay',
	HANDHELD_MIC: 'mic_cam_tay',
};

// Goc nhin/huong nhin: giong nhau cho ca 46 dang (da xem brand/cao/catalog.png, cung 1 goc may dung khi
// chup/tao bo sticker) - khong phai doan, la quan sat that tren bang anh.
export const VIEWING_ANGLE = 'ba_phan_tu_trai'; // three-quarter, hoi nghieng trai
export const FACING_DIRECTION = 've_phia_camera';

const GROUP_SCENE_TYPES = {
	NONE: ['character_acting', 'cinematic_close_up', 'metaphor_animation', 'comparison_scene'],
	DESK_SETUP: ['ui_simulation', 'character_acting'],
	PRESENT_BOARD: ['process_animation', 'character_acting'],
	CHAIR_ONLY: ['character_acting'],
	HANDHELD_LAPTOP: ['character_acting', 'object_interaction'],
	HANDHELD_CLIPBOARD: ['character_acting', 'object_interaction'],
	HANDHELD_PAPER: ['character_acting', 'object_interaction'],
	HANDHELD_MIC: ['character_acting', 'object_interaction'],
};

/**
 * limits: ghi giong nhau cho ca nhom (xem GROUP_LIMITS) de khoi lap lai; tra ve khi query.
 */
const GROUP_LIMITS = {
	[PROP_KINDS.DESK_SETUP]: 'Ban/ghe/laptop da ve san trong anh, goc may co dinh (nhin hoi tu trai). KHONG ve them ban/man hinh rieng de de len tren — se chong hinh nhu da gap o POC. Moi video chi dung 1 trong cac dang nay (desk_typing/_2, desk_headset, desk_video) de khoi lo 2 kieu ban khac nhau trong cung video; neu can man hinh hien thi code/loi rieng, dat man hinh o VI TRI KHAC (vd phia tren) thay vi chong len laptop co san.',
	[PROP_KINDS.PRESENT_BOARD]: 'Bieu do tren bang la duong xu huong tang chung chung, co dinh, KHONG doi duoc so lieu. Chi dung khi loi dan la "xu huong tang" chung; so lieu cu the phai lam rieng (scene_type data_visualization), khong dung dang nay.',
	[PROP_KINDS.CHAIR_ONLY]: 'Goc nhin/tu the ngoi co dinh theo dung goc may trong anh goc; doi goc camera cua canh thi dang se lech, chi dung voi goc may truc dien/hoi nghieng giong ban mau.',
	[PROP_KINDS.HANDHELD_LAPTOP]: 'La "dung cam laptop", KHONG PHAI ngoi lam viec — dung cho canh Cao dang di/dung thuyet trinh voi laptop, khong dung thay cho desk_typing khi can canh "ngoi ban lam viec".',
	[PROP_KINDS.HANDHELD_CLIPBOARD]: 'Hop voi canh bao cao/ghi chu nhanh; kep giay la hinh chung chung, khong doc duoc chu that tren do (dung lam dao cu, khong dung lam man hinh hien thi noi dung).',
	[PROP_KINDS.HANDHELD_PAPER]: 'Giong clipboard — hinh chung chung, khong the hien thi noi dung chu that len to giay nay.',
	[PROP_KINDS.HANDHELD_MIC]: 'Dung cho canh phong van/MC/thong bao; khong hop voi boi canh van phong yen tinh (lech tong).',
	[PROP_KINDS.NONE]: 'An toan nhat — ghep duoc len BAT KY nen/boi canh nao Visual Director tu ve (CSS/SVG) ma khong lo chong dao cu. Uu tien nhom nay khi thiet ke canh moi.',
};

const EXPRESSION_OVERRIDES = {
	surprised: 'ngac_nhien',
	think: 'tram_tu', think_2: 'tram_tu', think_3: 'tram_tu',
	sleep: 'buon_ngu',
	bow: 'ay_nay', bow_2: 'ay_nay',
	shrug: 'phan_van',
	stop: 'nghiem_tuc',
};
const INTEGRATED_PROPS_EXTRA = {
	desk_typing: ['ban', 'ghe', 'laptop', 'cay_canh', 'sach'],
	desk_typing_2: ['ban', 'ghe', 'laptop', 'coc_nuoc'],
	desk_headset: ['ban', 'ghe', 'laptop', 'tai_nghe'],
	desk_video: ['ban', 'ghe', 'laptop_goi_video'],
	board_chart: ['bang_flip_chart', 'gay_chi', 'bieu_do_tang'],
	board_chart_2: ['bang_flip_chart', 'gay_chi', 'bieu_do_tang'],
	cheer_seated: ['ghe'],
	sleep: ['ghe'],
	laptop_hold: ['laptop'], laptop_hold_2: ['laptop'], laptop_typing: ['laptop'],
	clipboard: ['kep_tai_lieu'], clipboard_2: ['kep_tai_lieu'],
	read_paper: ['to_giay'],
	mic: ['mic_cam_tay'],
};
function keyOf(kind) {
	return Object.keys(PROP_KINDS).find((k) => PROP_KINDS[k] === kind);
}

function p(id, prop_kind, action, suitable_for) {
	const groupKey = keyOf(prop_kind);
	return {
		id,
		name: id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
		prop_kind,
		action,
		expression: EXPRESSION_OVERRIDES[id] || 'vui_ve_than_thien',
		has_integrated_props: prop_kind !== PROP_KINDS.NONE,
		integrated_props: INTEGRATED_PROPS_EXTRA[id] || [],
		viewing_angle: VIEWING_ANGLE,
		facing_direction: FACING_DIRECTION,
		usable_scene_types: GROUP_SCENE_TYPES[groupKey] || ['character_acting'],
		suitable_for,
		limits: GROUP_LIMITS[prop_kind],
	};
}

// id = ten file (khong co .png) trong brand/cao/poses/
export const POSES = [
	// ---- Khong dao cu (an toan nhat, ghep len nen tuy y) ----
	...['arms_crossed', 'arms_crossed_2', 'arms_crossed_3'].map((id) => p(id, PROP_KINDS.NONE, 'khoanh tay nghe/can nhac', 'lang nghe, hoai nghi nhe, cho doi')),
	...['bow', 'bow_2'].map((id) => p(id, PROP_KINDS.NONE, 'cui dau xin loi', 'nhan sai, xin loi, khiem ton')),
	...['cheer', 'cheer_jump'].map((id) => p(id, PROP_KINDS.NONE, 'an mung', 'ket qua tot, thanh cong, vui mung')),
	...['idea', 'idea_2', 'idea_3'].map((id) => p(id, PROP_KINDS.NONE, 'loe sang y tuong', 'phat hien ra meo hay/giai phap')),
	...['point_down', 'point_left', 'point_right'].map((id) => p(id, PROP_KINDS.NONE, 'chi tay 1 huong', 'huong su chu y nguoi xem toi 1 vat/chu cu the o huong do - dung thay cho dung yen chi tay chung chung')),
	...['point_up', 'point_up_2', 'point_up_3'].map((id) => p(id, PROP_KINDS.NONE, 'chi len tren / nhan manh', 'chot y, nhan manh 1 diem quan trong')),
	...['present_hand', 'present_open', 'present_open_2'].map((id) => p(id, PROP_KINDS.NONE, 'gioi thieu/trinh bay', 'mo dau, gioi thieu noi dung sap toi')),
	...['think', 'think_2', 'think_3'].map((id) => p(id, PROP_KINDS.NONE, 'suy nghi (tay cham cam)', 'dat cau hoi, dan dat, can nhac')),
	...['thumbs_up', 'thumbs_up_2'].map((id) => p(id, PROP_KINDS.NONE, 'dong y/tot', 'xac nhan dung, ket qua on')),
	...['wave', 'wave_2'].map((id) => p(id, PROP_KINDS.NONE, 'vay tay chao', 'mo dau video, chao hoi')),
	p('love', PROP_KINDS.NONE, 'the hien yeu thich', 'ket thuc tich cuc, keu goi theo doi'),
	p('shrug', PROP_KINDS.NONE, 'nhun vai', 'khong chac chan, tuy truong hop'),
	p('stop', PROP_KINDS.NONE, 'gio tay dung lai', 'canh bao, ngan lai truoc sai lam'),
	p('surprised', PROP_KINDS.NONE, 'ngac nhien (tay len mat)', 'phan ung bat ngo, phat hien loi/so lieu la'),
	p('welcome', PROP_KINDS.NONE, 'dang tay chao mung', 'mo dau than thien, chao don'),

	// ---- Co dao cu tich hop: ban lam viec ----
	p('desk_typing', PROP_KINDS.DESK_SETUP, 'ngoi go phim tai ban (co cay canh, sach)', 'dang lam viec/code binh thuong'),
	p('desk_typing_2', PROP_KINDS.DESK_SETUP, 'ngoi go phim tai ban (co coc nuoc)', 'bien the desk_typing - KHONG dung chung video voi desk_typing (2 kieu ban khac nhau)'),
	p('desk_headset', PROP_KINDS.DESK_SETUP, 'ngoi deo tai nghe, dang noi', 'canh cham soc khach hang/goi dien/hop online'),
	p('desk_video', PROP_KINDS.DESK_SETUP, 'ngoi truoc laptop dang goi video', 'hop video, phong van truc tuyen'),

	// ---- Co dao cu tich hop: bang thuyet trinh ----
	p('board_chart', PROP_KINDS.PRESENT_BOARD, 'chi vao bang bieu do (gay chi)', 'trinh bay xu huong tang chung chung'),
	p('board_chart_2', PROP_KINDS.PRESENT_BOARD, 'chi vao bang bieu do (bien the)', 'nhu board_chart'),

	// ---- Ghe rieng (khong ban) ----
	p('cheer_seated', PROP_KINDS.CHAIR_ONLY, 'ngoi ghe an mung', 'ket qua tot trong boi canh van phong, khong can thay ban'),
	p('sleep', PROP_KINDS.CHAIR_ONLY, 'ngoi ghe ngu gat/thu gian', 'met moi, cuoi ngay, thu gian qua da'),

	// ---- Laptop cam tay ----
	p('laptop_hold', PROP_KINDS.HANDHELD_LAPTOP, 'be laptop bang 1 tay, dung', 'mang/trinh bay laptop, dang di chuyen'),
	p('laptop_hold_2', PROP_KINDS.HANDHELD_LAPTOP, 'be laptop bien the', 'nhu laptop_hold'),
	p('laptop_typing', PROP_KINDS.HANDHELD_LAPTOP, 'be laptop vua go phim, dung', 'lam viec di dong, khong phai ngoi ban'),

	// ---- Kep tai lieu / giay / mic cam tay ----
	p('clipboard', PROP_KINDS.HANDHELD_CLIPBOARD, 'cam kep tai lieu', 'ghi chu nhanh, bao cao, checklist'),
	p('clipboard_2', PROP_KINDS.HANDHELD_CLIPBOARD, 'cam kep tai lieu bien the', 'nhu clipboard'),
	p('read_paper', PROP_KINDS.HANDHELD_PAPER, 'cam giay doc', 'doc thong bao, trich dan van ban'),
	p('mic', PROP_KINDS.HANDHELD_MIC, 'cam mic', 'phong van, MC, thong bao quan trong'),
];

export const FACES = ['face_angry', 'face_content', 'face_cry', 'face_gasp', 'face_happy', 'face_laugh', 'face_neutral', 'face_sad', 'face_surprised', 'face_worried'];
// Gioi han faces: chi dung cho scene_type cinematic_close_up (can mat/dau, khong co than); khong tron chung
// 1 canh voi pose toan than (2 quy uoc crop/ty le khac nhau, dat canh nhau se lech).

export const MOUTHS_NOT_USABLE_YET = true; // xem docs/mascot.md "Gioi han da biet" - 12 hinh mieng chua ghep duoc len dau tung dang.

export function getPose(id) {
	const found = POSES.find((x) => x.id === id);
	if (!found) throw new Error(`Khong co dang "${id}" trong Asset Manager. Dang co: ${POSES.map((x) => x.id).join(', ')}`);
	return found;
}

/** Danh sach dang an toan (khong dao cu) - Visual Director nen uu tien khi thiet ke canh moi, tu nen tu ve. */
export const safePoses = () => POSES.filter((x) => x.prop_kind === PROP_KINDS.NONE).map((x) => x.id);

/** Kiem tra 2 dang co xung dot dao cu khong (vd dung desk_typing va desk_typing_2 trong cung 1 video). */
export function checkDeskConflict(poseIds) {
	const deskPoses = poseIds.filter((id) => getPose(id).prop_kind === PROP_KINDS.DESK_SETUP);
	const distinct = [...new Set(deskPoses)];
	if (distinct.length > 1) return `Dung ${distinct.length} kieu ban lam viec tich hop khac nhau trong cung video (${distinct.join(', ')}) - se trong nhu nhieu van phong khac nhau. Chon 1 kieu duy nhat.`;
	return null;
}
