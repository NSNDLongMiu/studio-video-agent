// Producer (Giai doan 2): lop that su goi tu pipeline san xuat, boc quanh orchestrator.mjs them:
// validate storyboard (ajv, dung schema that o studio/schema/storyboard.schema.json), kiem asset/pose/
// xung dot dao cu/camera an toan TRUOC khi render, log rieng tung canh, cho render lai 1 canh le, ghep
// VO+phu de, va tra ve 1 bao cao co cau truc (khong chi console.log). Day la cau noi Visual Director ->
// Remotion; pipeline Pillow+FFmpeg cu (studio/src/runners.mjs) GIU NGUYEN, khong dung lenh nao o day.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import Ajv from 'ajv';
import {SCENE_TO_COMPOSITION, stitch, run as runCmd, probeDuration} from './orchestrator.mjs';
import {getPose, checkDeskConflict} from './assetManager.js';
import {SHOT_SCALE} from './lib/shotPresets.js';

const HERE = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ROOT = path.dirname(path.dirname(HERE)); // D:\Agent Video Studio
const FFMPEG = 'C:/Users/PC/AppData/Local/ffmpeg/ffmpeg-master-latest-win64-gpl/bin/ffmpeg';
const SCHEMA_PATH = path.join(ROOT, 'studio', 'schema', 'storyboard.schema.json');

// ---------- 1) Validate storyboard dung schema that (khong tu viet lai luat validate) ----------
export function validateStoryboard(board) {
	const ajv = new Ajv({allErrors: true, strict: false});
	const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
	const validateFn = ajv.compile(schema);
	const valid = validateFn(board);
	return {valid, errors: valid ? [] : validateFn.errors.map((e) => `${e.instancePath || '(goc)'} ${e.message}`)};
}

// ---------- 2) Kiem truoc khi render: scene_type ho tro, pose ton tai, xung dot dao cu, camera an toan ----------
// Khung an toan uoc luong (1080x1920): noi dung quan trong khong duoc vuot qua bien khi camera scale len.
// Day la kiem heuristic (hinh hoc don gian), KHONG thay the viec tu mo khung hinh xem that - van phai lam
// o buoc QC sau khi render (xem muc "Visual Pass" trong bao cao).
function checkSceneSafety(scene) {
	const issues = [];
	const compId = SCENE_TO_COMPOSITION[scene.scene_type];
	if (!compId) {
		issues.push(`scene_type "${scene.scene_type}" chua co component/renderer ho tro - can Visual Director doi scene_type hoac bao thieu component moi, KHONG tu bien thanh the chu tinh.`);
		return issues; // khong kiem tiep neu khong biet render bang gi
	}
	const props = scene.component_props || {};
	// pose ton tai?
	const poseIds = [];
	if (props.basePose) poseIds.push(props.basePose);
	if (props.reactPose) poseIds.push(props.reactPose);
	if (Array.isArray(props.poses)) poseIds.push(...props.poses.map((p) => p.id));
	if (props.pose) poseIds.push(props.pose);
	for (const id of poseIds) {
		try {
			getPose(id);
		} catch (e) {
			issues.push(`pose "${id}" khong ton tai trong assetManager: ${e.message}`);
		}
	}
	const deskWarn = checkDeskConflict(poseIds);
	if (deskWarn) issues.push(deskWarn);
	// camera an toan: shot scale lon + nhan vat o gan bien thi co nguy co cat hinh (uoc luong tho).
	const shots = props.shots || [];
	for (const s of shots) {
		const scale = typeof s.shot === 'number' ? s.shot : SHOT_SCALE[s.shot] ?? 1;
		if (scale > 1.5 && props.pos && (props.pos.x > 650 || props.pos.x < -50)) {
			issues.push(`canh "${scene.scene_id}": camera scale ${scale} tai focus (${s.focusX},${s.focusY}) voi nhan vat o pos.x=${props.pos.x} - nguy co cat hinh nhan vat sat bien, kiem lai bang khung hinh truoc khi coi la dat.`);
		}
	}
	// timing hop le?
	if (!(props.durationInFrames > 0)) issues.push(`canh "${scene.scene_id}" thieu durationInFrames hop le.`);
	return issues;
}

export function preflightCheck(board) {
	const schemaCheck = validateStoryboard(board);
	const sceneIssues = {};
	for (const scene of board.scenes || []) {
		const issues = checkSceneSafety(scene);
		if (issues.length) sceneIssues[scene.scene_id] = issues;
	}
	return {schemaCheck, sceneIssues, ok: schemaCheck.valid && Object.keys(sceneIssues).length === 0};
}

// outDir = <video>/final, danh rieng cho 4 thanh pham cuoi (xem AGENTS.md). Canh render trung gian
// (.mp4 tung canh, .props.json, full_silent.mp4) va log tung canh KHONG duoc lan vao day - dua ra
// workDir/logDir ben ngoai de final/ luon sach.
export function scratchDirsFor(outDir) {
	const videoDir = path.dirname(outDir);
	return {workDir: path.join(videoDir, 'assets', '_scratch', 'render'), logDir: path.join(videoDir, 'logs', 'scenes')};
}

// ---------- 3) Render co log rieng tung canh + cho render lai 1 canh le ----------
export function renderVideo({storyboardPath, outDir, onlyScene, voWav, captionsSrt, force} = {}) {
	const t0 = Date.now();
	const board = JSON.parse(fs.readFileSync(storyboardPath, 'utf8'));
	if (board.status !== 'APPROVED') return {technical_pass: false, error: `storyboard.json dang "${board.status}", chua APPROVED.`};
	const pre = preflightCheck(board);
	if (!pre.ok) return {technical_pass: false, preflight: pre, error: 'Khong qua kiem tra truoc khi render (xem preflight).'};

	fs.mkdirSync(outDir, {recursive: true});
	const {workDir, logDir} = scratchDirsFor(outDir);
	fs.mkdirSync(workDir, {recursive: true});
	fs.mkdirSync(logDir, {recursive: true});

	const sceneReports = [];
	const clipPaths = [];
	for (const scene of board.scenes) {
		if (onlyScene && scene.scene_id !== onlyScene) {
			// scene khong can render lai: dung file da co san (neu co), khong render lai toan bo video.
			const existing = path.join(workDir, `${scene.scene_id}.mp4`);
			if (fs.existsSync(existing)) {
				clipPaths.push({path: existing, transition: scene.transition || 'cut'});
				sceneReports.push({scene_id: scene.scene_id, status: 'reused', ms: 0});
				continue;
			}
		}
		const t1 = Date.now();
		const out = path.join(workDir, `${scene.scene_id}.mp4`);
		const logFile = path.join(logDir, `${scene.scene_id}.log`);
		if (!force && fs.existsSync(out) && !onlyScene) {
			clipPaths.push({path: out, transition: scene.transition || 'cut'});
			sceneReports.push({scene_id: scene.scene_id, status: 'reused', ms: 0});
			continue;
		}
		try {
			const compId = SCENE_TO_COMPOSITION[scene.scene_type];
			const propsFile = path.join(workDir, `${scene.scene_id}.props.json`);
			fs.writeFileSync(propsFile, JSON.stringify(scene.component_props || {}));
			const log = runCmd('npx', ['remotion', 'render', 'src/index.js', compId, out, '--props', propsFile]);
			fs.writeFileSync(logFile, log || '(khong co output)');
			clipPaths.push({path: out, transition: scene.transition || 'cut'});
			sceneReports.push({scene_id: scene.scene_id, status: 'rendered', ms: Date.now() - t1});
		} catch (e) {
			fs.writeFileSync(logFile, String(e.message || e));
			sceneReports.push({scene_id: scene.scene_id, status: 'failed', error: String(e.message || e).slice(0, 500), ms: Date.now() - t1});
		}
	}

	const failed = sceneReports.filter((s) => s.status === 'failed');
	if (failed.length) {
		return {technical_pass: false, video_id: board.video_id, scenes: sceneReports, error: `${failed.length} canh loi, xem logs/`, logDir, total_ms: Date.now() - t0};
	}

	const silentPath = path.join(workDir, 'full_silent.mp4');
	stitch(clipPaths, silentPath);

	const finalPath = path.join(outDir, `${board.video_id}_9x16.mp4`);
	const muxReport = muxAudioCaptions(silentPath, finalPath, {voWav, captionsSrt, outDir});

	const stat = fs.existsSync(finalPath) ? fs.statSync(finalPath) : null;
	return {
		technical_pass: !!stat,
		video_id: board.video_id,
		scenes: sceneReports,
		final_path: finalPath,
		size_mb: stat ? +(stat.size / 1048576).toFixed(2) : null,
		duration_s: stat ? probeDuration(finalPath) : null,
		audio: muxReport,
		total_ms: Date.now() - t0,
	};
}

// ---------- 4) Ghep VO + phu de (hoac anullsrc neu chua co giong doc - khong de video cam) ----------
function muxAudioCaptions(silentVideo, outPath, {voWav, captionsSrt, outDir}) {
	const dur = probeDuration(silentVideo);
	const args = ['-y', '-v', 'error', '-i', silentVideo];
	let af = 'loudnorm=I=-14:TP=-1.5:LRA=11';
	if (voWav && fs.existsSync(voWav)) {
		args.push('-i', voWav);
	} else {
		args.push('-f', 'lavfi', '-i', `anullsrc=r=48000:cl=stereo`);
	}
	let vf = null;
	if (captionsSrt && fs.existsSync(captionsSrt)) {
		vf = `subtitles=${path.basename(captionsSrt)}:force_style='FontName=Segoe UI,Bold=1,FontSize=9,Outline=1,Shadow=0,Alignment=2,MarginV=100,MarginL=14,MarginR=14'`;
	}
	const filterParts = [];
	if (vf) filterParts.push(`[0:v]${vf}[v]`);
	args.push('-map', vf ? '[v]' : '0:v', '-map', '1:a', '-af', af, '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-t', String(dur), '-movflags', '+faststart');
	if (filterParts.length) args.splice(args.indexOf('-map'), 0, '-filter_complex', filterParts.join(';'));
	args.push(outPath);
	// Chay trong outDir vi libass can duong dan tuong doi toi .srt (bay da biet, ghi trong ffmpeg-recipes.md).
	const r = spawnSync(FFMPEG, args, {cwd: outDir, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8'});
	return {ok: r.status === 0, has_voice: !!(voWav && fs.existsSync(voWav)), has_captions: !!vf, stderr: r.status === 0 ? null : r.stderr?.slice(-800)};
}

if (process.argv[1] && process.argv[1].endsWith('producer.mjs')) {
	const [storyboardPath, outDir, ...rest] = process.argv.slice(2);
	const onlyScene = rest.find((a) => a.startsWith('--scene='))?.split('=')[1];
	const voWav = rest.find((a) => a.startsWith('--vo='))?.split('=')[1];
	const captionsSrt = rest.find((a) => a.startsWith('--srt='))?.split('=')[1];
	const force = rest.includes('--force');
	if (!storyboardPath || !outDir) {
		console.error('Dung: node src/producer.mjs <storyboard.json> <thu_muc_xuat> [--scene=<id>] [--vo=<file.wav>] [--srt=<file.srt>] [--force]');
		process.exit(2);
	}
	const report = renderVideo({storyboardPath, outDir, onlyScene, voWav, captionsSrt, force});
	console.log(JSON.stringify(report, null, 2));
	process.exit(report.technical_pass ? 0 : 1);
}
