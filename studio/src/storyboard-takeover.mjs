// Gemini viết storyboard THAY Codex (giám đốc duyệt từng việc, 21/11/2026; xem pool.approveTakeover và make-plan "Giám đốc duyệt thay thế").
// Phần dùng chung cho `gemini-run.mjs storyboard`. Gemini (agy) KHÔNG chạy trong thư mục dự án mà trong thư mục tạm dùng một lần, nên:
//  - prepareStoryboardInputs chép vào thư mục tạm đúng các file cần đọc (kịch bản, kế hoạch, schema, tài liệu, component thật);
//  - Gemini ghi storyboard.json + storyboard.md vào thư mục tạm; loadCandidate lấy ra, validate kiểm JSON + schema bằng Ajv của renderer-remotion;
//  - finalizeStoryboard ép status = "DRAFT" (CHỈ Claude/visual-director được đặt APPROVED), sao lưu bản cũ, ghi vào epNN và đánh dấu tác giả.
// Không bao giờ ghi đè storyboard đã APPROVED.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import * as S from './db.mjs';

const MAX_TOTAL_BYTES = 2 * 1024 * 1024;

/** [nguồn tương đối từ gốc dự án, đích trong thư mục tạm] */
export const REFERENCE_FILES = [
  ['.claude/skills/make-plan/codex-storyboard.md', 'HUONG-DAN-STORYBOARD.md'],
  ['studio/schema/storyboard.schema.json', 'tham-chieu/storyboard.schema.json'],
  ['docs/mascot.md', 'tham-chieu/mascot.md'],
  ['docs/motion-components.md', 'tham-chieu/motion-components.md'],
  ['docs/chat-luong-xem.md', 'tham-chieu/chat-luong-xem.md'],
  ['.agents/skills/video-producer/references/ffmpeg-recipes.md', 'tham-chieu/ffmpeg-recipes.md'],
];

const copy = (from, to, budget) => {
  let size = 0;
  try {
    size = fs.statSync(from).size;
  } catch {
    return false;
  }
  if (budget.left < size) return false;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  budget.left -= size;
  return true;
};

/** Vòng sửa mới nhất mà visual-director đã review: review/storyboard-r<N>.md (N lớn nhất). */
export function latestReview(epDir) {
  let best = null;
  try {
    for (const n of fs.readdirSync(path.join(epDir, 'review'))) {
      const m = /^storyboard-r(\d+)\.md$/.exec(n);
      if (m && (!best || Number(m[1]) > best.round)) best = { round: Number(m[1]), file: path.join(epDir, 'review', n) };
    }
  } catch {
    /* chưa có review */
  }
  return best;
}

/** Chép đầu vào vào thư mục tạm `scratch`. Trả về danh sách file đã chép (đường dẫn tương đối trong scratch) và file bắt buộc còn thiếu. */
export function prepareStoryboardInputs({ epDir, scratch, root = S.ROOT }) {
  const topic = path.dirname(epDir);
  const budget = { left: MAX_TOTAL_BYTES };
  const copied = [];
  const put = (from, rel) => {
    if (copy(from, path.join(scratch, rel), budget)) copied.push(rel);
  };
  for (const [src, dst] of REFERENCE_FILES) put(path.join(root, src), dst);
  const scenes = path.join(root, 'studio', 'renderer-remotion', 'src', 'scenes');
  try {
    for (const n of fs.readdirSync(scenes).sort()) if (/\.(jsx?|mjs|tsx?)$/.test(n)) put(path.join(scenes, n), `tham-chieu/scenes/${n}`);
  } catch {
    /* thiếu component thì Gemini chỉ dùng enum trong schema; visual-director vẫn kiểm */
  }
  for (const n of ['brief.md', 'concept.md', 'plan.md']) put(path.join(topic, n), `chu-de/${n}`);
  put(path.join(epDir, 'script.md'), 'ep/script.md');
  put(path.join(epDir, 'storyboard.json'), 'ep/storyboard-hien-tai.json');
  const rv = latestReview(epDir);
  if (rv) put(rv.file, 'ep/review-moi-nhat.md');
  put(path.join(epDir, 'review', 'gemini-storyboard-invalid.json'), 'ep/ban-nhap-loi.json');
  const missing = ['ep/script.md', 'chu-de/plan.md'].filter((r) => !copied.includes(r));
  return { copied, missing, review_round: rv?.round ?? null };
}

/** Video của thư mục epNN (theo sổ), hoặc video_id đang ghi trong storyboard hiện có; null nếu không biết. */
export function videoIdForDir(epDir) {
  try {
    const row = S.sql.all('SELECT id, folder FROM videos').find((v) => v.folder && path.resolve(S.ROOT, v.folder).toLowerCase() === path.resolve(epDir).toLowerCase());
    if (row) return row.id;
  } catch {
    /* chưa có sổ: thử đọc storyboard */
  }
  try {
    return JSON.parse(fs.readFileSync(path.join(epDir, 'storyboard.json'), 'utf8')).video_id || null;
  } catch {
    return null;
  }
}

let validatorCache;
function schemaValidator(root = S.ROOT) {
  if (validatorCache !== undefined) return validatorCache;
  try {
    const require = createRequire(path.join(root, 'studio', 'renderer-remotion', 'package.json'));
    const Ajv = require('ajv');
    const schema = JSON.parse(fs.readFileSync(path.join(root, 'studio', 'schema', 'storyboard.schema.json'), 'utf8'));
    validatorCache = new Ajv({ allErrors: true, strict: false }).compile(schema);
  } catch {
    validatorCache = null;
  }
  return validatorCache;
}
/** Lỗi schema dạng chữ (rỗng = hợp lệ). Không có Ajv (renderer-remotion chưa cài) thì trả null — người gọi phải nói rõ là CHƯA KIỂM schema. */
export function schemaErrors(board) {
  const v = schemaValidator();
  if (!v) return null;
  if (v(board)) return [];
  return v.errors.map((e) => `${e.instancePath || '/'} ${e.message}${e.params && e.params.additionalProperty ? ` (${e.params.additionalProperty})` : ''}`);
}

/** Lấy bản nháp Gemini đã ghi: ưu tiên file storyboard.json trong thư mục tạm; không có thì tìm khối ```json trong câu trả lời. */
export function loadCandidate(scratch, reply = '') {
  const file = path.join(scratch, 'storyboard.json');
  let text = null;
  let source = null;
  if (fs.existsSync(file)) {
    text = fs.readFileSync(file, 'utf8');
    source = 'file';
  } else {
    for (const m of String(reply).matchAll(/```(?:json)?\s*\n([\s\S]*?)```/g)) {
      if (/"scenes"\s*:/.test(m[1])) {
        text = m[1];
        source = 'reply';
        break;
      }
    }
  }
  if (text == null) return { ok: false, reason: 'no_file' };
  try {
    return { ok: true, board: JSON.parse(text.replace(/^﻿/, '')), source, md: fs.existsSync(path.join(scratch, 'storyboard.md')) ? fs.readFileSync(path.join(scratch, 'storyboard.md'), 'utf8') : '' };
  } catch (e) {
    return { ok: false, reason: 'bad_json', detail: String(e.message).slice(0, 200), text };
  }
}

const oneLine = (v, n = 90) => String(v ?? '').replace(/\s+/g, ' ').replace(/\|/g, '/').slice(0, n);
/** Bảng tóm tắt 1 dòng/cảnh khi Gemini không viết storyboard.md. */
export function summaryTable(board) {
  const rows = (board.scenes || []).map((s) => `| ${oneLine(s.scene_id, 12)} | ${oneLine(s.scene_type, 24)} | ${s.duration_s ?? ''} | ${oneLine(s.main_idea || s.narrative_purpose)} | ${oneLine(s.visual_concept, 110)} |`);
  return ['| Cảnh | scene_type | giây | Ý chính | Hình |', '|---|---|---|---|---|', ...rows].join('\n');
}

/** Ghi bản nháp vào epDir: ép DRAFT, sao lưu bản cũ, đánh dấu tác giả. Ném lỗi nếu storyboard hiện có đã APPROVED. */
export function finalizeStoryboard({ epDir, board, md = '', model = '', now = new Date() }) {
  const target = path.join(epDir, 'storyboard.json');
  let backup = null;
  if (fs.existsSync(target)) {
    let cur = null;
    try {
      cur = JSON.parse(fs.readFileSync(target, 'utf8'));
    } catch {
      /* bản cũ hỏng: vẫn sao lưu */
    }
    if (cur?.status === 'APPROVED') throw new Error('TU_CHOI: storyboard hiện có đã APPROVED, không ghi đè (chỉ Claude đổi trạng thái).');
    const stamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
    backup = path.join(epDir, 'review', '_gemini-truoc', `storyboard-${stamp}.json`);
    fs.mkdirSync(path.dirname(backup), { recursive: true });
    fs.copyFileSync(target, backup);
  }
  const forced = board.status !== 'DRAFT';
  const out = { ...board, status: 'DRAFT' };
  fs.writeFileSync(target, `${JSON.stringify(out, null, 2)}\n`);
  const day = now.toISOString().slice(0, 10);
  const head = `Bản nháp do Gemini${model ? ` (mô hình ${model})` : ''} viết thay Codex (giám đốc duyệt, ${day}). Chỉ Claude (visual-director) review và đặt APPROVED.`;
  const body = String(md || '').trim() || summaryTable(out);
  fs.writeFileSync(path.join(epDir, 'storyboard.md'), `${head}\n\n${body}\n`);
  const total = (out.scenes || []).reduce((a, s) => a + (Number(s.duration_s) || 0), 0);
  return { scenes: (out.scenes || []).length, total_s: Math.round(total * 10) / 10, forced_draft: forced, backup: backup && path.relative(S.ROOT, backup).split(path.sep).join('/') };
}

/** Lời nhiệm vụ ghép TRƯỚC phần NGỮ CẢNH do người điều phối viết (giữ ngắn vì lời nhắc đi qua dòng lệnh Windows). */
export function storyboardTask({ videoId, ep, reviewRound, hasCurrent, hasInvalid }) {
  return [
    `NHIỆM VỤ — Đạo diễn hình ảnh, bạn (Gemini) làm THAY Codex theo duyệt của giám đốc. Viết storyboard cho video ${videoId || '(mã video trong NGỮ CẢNH)'} (${ep}).`,
    'Trong thư mục làm việc hiện tại có sẵn: HUONG-DAN-STORYBOARD.md (HƯỚNG DẪN ĐẦY ĐỦ, đọc trước và làm đúng; các đường dẫn nó nhắc đã được chép vào đây theo bảng dưới), chu-de/ (brief.md, concept.md, plan.md), ep/script.md (nguồn sự thật cho lời thoại và thời lượng), tham-chieu/ (storyboard.schema.json, mascot.md, motion-components.md, chat-luong-xem.md, ffmpeg-recipes.md, scenes/ = component thật).',
    'Bảng đổi đường dẫn: studio/schema/storyboard.schema.json → tham-chieu/storyboard.schema.json · docs/X.md → tham-chieu/X.md · studio/renderer-remotion/src/scenes/ → tham-chieu/scenes/ · concept.md, plan.md → chu-de/ · epNN/script.md → ep/script.md.',
    'ĐẦU RA: GHI đúng hai file vào thư mục làm việc hiện tại: `storyboard.json` (JSON hợp lệ theo schema, không chú thích, không dấu phẩy thừa) và `storyboard.md` (bảng tóm tắt 1 dòng/cảnh). Không ghi file nào khác. Đặt `status` là "DRAFT" — KHÔNG bao giờ "APPROVED" (chỉ Claude duyệt). Không đổi chữ lời đọc và không đổi tổng thời lượng của script.md. Viết gọn, không lặp mô tả dài dòng để file không quá lớn.',
    hasCurrent && reviewRound ? `ĐÂY LÀ BẢN SỬA vòng ${reviewRound + 1}: ep/storyboard-hien-tai.json là bản hiện có, ep/review-moi-nhat.md là góp ý của Claude. Sửa ĐÚNG từng điểm góp ý, giữ nguyên phần không bị góp ý, ghi lại toàn bộ file storyboard.json đã sửa.` : '',
    hasInvalid ? 'Lần trước bản nháp SAI schema/JSON: ep/ban-nhap-loi.json là bản lỗi, danh sách lỗi nằm trong NGỮ CẢNH bên dưới. Sửa hết lỗi và ghi lại toàn bộ storyboard.json.' : '',
    'Trả lời cuối ≤ 120 từ: số cảnh, các scene_type, tỉ lệ cảnh có Cáo, điểm góp ý đã sửa (nếu bản sửa), chỗ chưa chắc.',
  ].filter(Boolean).join('\n');
}
