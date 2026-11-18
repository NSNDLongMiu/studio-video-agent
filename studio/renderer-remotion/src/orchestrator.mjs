// Cau noi Storyboard (Visual Director) -> Remotion: doc 1 file storyboard don gian (mang scene),
// map tung scene theo scene_type sang dung Composition Remotion, render tung canh, roi FFmpeg noi lai
// theo dung "transition" cua tung canh. Day la lop "Producer" moi, thay cho Python+Pillow+ffconcat cu
// (van giu nguyen, chua xoa - theo dung Quyet dinh 10: khong pha pipeline cu truoc khi pipeline moi qua kiem thu).
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// LUU Y: .pathname cua URL van con ma hoa %20 cho dau cach - phai dung fileURLToPath (giai ma dung),
// khong tu viet regex thay the nhu lan dau (lam cwd thanh duong dan khong ton tai -> spawnSync ENOENT).
// orchestrator.mjs nam trong src/, nhung cac lenh (npx remotion render src/index.js ...) phai chay tu
// THU MUC GOC du an (renderer-remotion/) - len 1 cap tu src/.
const HERE = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const FFMPEG = 'C:/Users/PC/AppData/Local/ffmpeg/ffmpeg-master-latest-win64-gpl/bin/ffmpeg';

export const SCENE_TO_COMPOSITION = {
	// character_acting -> DemoQA (QASequenceScene, 18/11/2026): doi tu DemoCharacter sau gop y giam doc
	// "Cao tham gia qua nhieu/chuyen dong qua da" - QASequenceScene tu quyet Cao to (dan truyen) hay
	// nho/dung yen (luc 2 nhan vat doi thoai), dung theo dung kich ban that, khong tu bay them chuyen dong.
	character_acting: 'DemoQA',
	ui_simulation: 'DemoUi',
	comparison_scene: 'DemoExplainer',
	process_animation: 'DemoExplainer',
	data_visualization: 'DemoDataViz', // bang/bieu do so lieu that (DataVizScene, 18/11/2026) - khac ExplainerScene (so do quy trinh), khong ve Cao.
	cinematic_close_up: 'DemoCharacter',
	metaphor_animation: 'DemoPrompt', // "xem lai yeu cau mo ho" - the/card noi, khac visual voi ui_simulation (IDE/terminal)
};

// npx tren Windows la .cmd (can shell:true), nhung shell:true lam hong arg co dau cach (duong dan du an
// co dau cach) - dung dung giong findClaude/findCodex trong runners.mjs: goi thang node + duong dan .js that.
const REMOTION_CLI = path.join(HERE, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');
export function run(cmd, args) {
	const useRemotionCli = cmd === 'npx' && args[0] === 'remotion';
	const realCmd = useRemotionCli ? process.execPath : cmd;
	const realArgs = useRemotionCli ? [REMOTION_CLI, ...args.slice(1)] : args;
	const r = spawnSync(realCmd, realArgs, {cwd: HERE, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8'});
	if (r.status !== 0) throw new Error(`Lenh loi (${cmd}): ${r.stderr || r.stdout || r.error?.message}`);
	return r.stdout;
}

export function renderStoryboard(storyboardPath, outDir) {
	const board = JSON.parse(fs.readFileSync(storyboardPath, 'utf8'));
	if (board.status !== 'APPROVED') throw new Error(`storyboard.json chua APPROVED (dang "${board.status}") - khong duoc render.`);
	fs.mkdirSync(outDir, {recursive: true});
	const clipPaths = [];
	for (const scene of board.scenes) {
		const compId = SCENE_TO_COMPOSITION[scene.scene_type];
		if (!compId) {
			console.log(`BO QUA canh ${scene.scene_id}: scene_type "${scene.scene_type}" chua co Composition tuong ung - escalate, khong tu bien thanh the chu tinh.`);
			continue;
		}
		const propsFile = path.join(outDir, `${scene.scene_id}.props.json`);
		fs.writeFileSync(propsFile, JSON.stringify(scene.component_props || {}));
		const out = path.join(outDir, `${scene.scene_id}.mp4`);
		console.log(`RENDER canh ${scene.scene_id} (${scene.scene_type} -> ${compId})...`);
		run('npx', ['remotion', 'render', 'src/index.js', compId, out, '--props', propsFile]);
		clipPaths.push({path: out, transition: scene.transition || 'cut'});
	}
	return stitch(clipPaths, path.join(outDir, 'full.mp4'));
}

const XFADE_TYPES = new Set(['fade', 'wipeleft', 'wiperight', 'wipeup', 'wipedown', 'slideup', 'slidedown', 'circleopen']);
const XFADE_DUR = 0.4; // giay

export function probeDuration(file) {
	const r = spawnSync('C:/Users/PC/AppData/Local/ffmpeg/ffmpeg-master-latest-win64-gpl/bin/ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], {encoding: 'utf8'});
	return parseFloat(r.stdout);
}

/**
 * Ghep tung cap theo dung "transition" cua canh TRUOC no khai bao trong storyboard: 'cut'/'match_cut' ->
 * noi cung (concat, khong lam gia mot "match cut" that - chi la cat thuong, se bao ro trong bao cao);
 * cac ten con lai (fade/wipeleft/...) -> xfade that bang ffmpeg, da kiem ky thuat nay o buoc audit truoc.
 */
export function stitch(clips, outPath) {
	if (clips.length === 0) throw new Error('Khong co canh nao render duoc.');
	if (clips.length === 1) {
		fs.copyFileSync(clips[0].path, outPath);
		return outPath;
	}
	let acc = clips[0].path;
	for (let i = 1; i < clips.length; i++) {
		const prevTransition = clips[i - 1].transition;
		const next = clips[i].path;
		const tmpOut = outPath.replace(/\.mp4$/, `.step${i}.mp4`);
		if (XFADE_TYPES.has(prevTransition)) {
			const accDur = probeDuration(acc);
			const offset = Math.max(0, accDur - XFADE_DUR);
			// Timebase cua clip Remotion goc (1/90000) khac timebase sau khi da qua 1 lan encode libx264
			// (1/15360) - xfade can 2 input CUNG timebase. Chuan hoa bang fps=30,settb=AVTB truoc khi xfade.
			run(FFMPEG, ['-y', '-v', 'error', '-i', acc, '-i', next, '-filter_complex', `[0:v]fps=30,settb=AVTB[v0];[1:v]fps=30,settb=AVTB[v1];[v0][v1]xfade=transition=${prevTransition}:duration=${XFADE_DUR}:offset=${offset.toFixed(3)},format=yuv420p[v]`, '-map', '[v]', tmpOut]);
		} else {
			const listFile = outPath.replace(/\.mp4$/, `.step${i}.ffconcat`);
			fs.writeFileSync(listFile, ['ffconcat version 1.0', `file '${path.resolve(acc).split(path.sep).join('/')}'`, `file '${path.resolve(next).split(path.sep).join('/')}'`].join('\n'));
			run(FFMPEG, ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', tmpOut]);
		}
		acc = tmpOut;
	}
	fs.copyFileSync(acc, outPath);
	return outPath;
}

if (process.argv[1] && process.argv[1].endsWith('orchestrator.mjs')) {
	const [storyboardPath, outDir] = process.argv.slice(2);
	if (!storyboardPath || !outDir) {
		console.error('Dung: node src/orchestrator.mjs <storyboard.json> <thu_muc_xuat>');
		process.exit(2);
	}
	console.log('XONG:', renderStoryboard(storyboardPath, outDir));
}
