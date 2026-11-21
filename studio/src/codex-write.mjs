// Gọi Codex VIẾT file cho 2 vị trí core (giám đốc duyệt 18/11/2026):
//   script     — Kịch bản (từ 20/11/2026 Claude viết concept.md, plan.md, script.md; Codex CÙNG VIẾT: review/script-codex-rN.md)
//   storyboard — Đạo diễn hình ảnh: epNN/storyboard.json (+ storyboard.md)
// Claude (phiên điều phối /make-plan) review, góp ý và DUYỆT/CHỐT CUỐI.
//
// Ràng buộc an toàn (giống lý do của codex-ideate.mjs — pattern Bash cố định, không cấp "codex exec*"):
//  - thư mục làm việc PHẢI nằm trong content/ (--cd vào đó); Codex được dặn chỉ ghi trong đó, và script KIỂM SAU lượt chạy
//    (xem outsideWrites): ghi ra ngoài thì ghi nhật ký CẢNH BÁO. Từ Codex 0.171 (đã đo 21/11/2026) KHÔNG còn ép bằng sandbox
//    được nữa: '--sandbox workspace-write' bị hạ âm thầm xuống chỉ-đọc ở chế độ nền (không ghi, không cả đọc file được), còn
//    '--approve-for-me' (cờ Producer đã dùng từ 17/11/2026) thì ghi được nhưng cũng ghi được ra ngoài thư mục --cd. Đã thử
//    '--trust': không đổi gì. Lỗi cũ: 20+ lượt gọi 20–21/11/2026 đều "báo xong" mà không ghi file (nay bị bắt bằng KHONG_RA_FILE);
//  - không nạp AGENTS.md (vai Producer) — tắt bằng project_doc_max_bytes=0, vai do prompt quyết;
//  - dùng tài khoản Codex của phòng (STUDIO_DEPT do worker truyền), nhường việc "produce" đang chạy.
// Dùng: node studio/src/codex-write.mjs <script|storyboard> <file-prompt> <thư-mục-làm-việc>
// Mã thoát: 0 xong · 2 BUSY · 3 NO_ACCOUNT · 4 quá giờ · 5 LIMIT · 6 AUTH_ERROR · 7 FAILED · 8 KHÔNG GHI FILE ĐẦU RA · 1 sai cú pháp
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as S from './db.mjs';
import * as P from './pool.mjs';
import { findCodex, accountEnv, execProcess, writeLogMeta, callOutcome } from './runners.mjs';
import { classifyFailure } from './limits.mjs';

const MIN = 60_000;
const ROLES = { script: 'Kịch bản', storyboard: 'Đạo diễn hình ảnh' };
/** File đầu ra mà mỗi chế độ PHẢI tạo/sửa (đường dẫn tương đối, dấu /). */
export const EXPECTED = { script: /(^|\/)review\/script-codex-r\d+\.md$/, storyboard: /(^|\/)storyboard\.json$/ };
/** Các file trong `dir` (tối đa 4 cấp) có giờ sửa ≥ `sinceMs` (trừ 2 s sai lệch đồng hồ), bỏ file `.reply.md` do chính script này ghi. */
export function producedFiles(dir, sinceMs, depth = 0, rel = '') {
  let out = [];
  let names = [];
  try {
    names = fs.readdirSync(path.join(dir, rel), { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of names) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (depth < 4 && e.name !== 'assets' && e.name !== 'node_modules') out = out.concat(producedFiles(dir, sinceMs, depth + 1, r));
    } else if (!r.endsWith('.reply.md') && fs.statSync(path.join(dir, r)).mtimeMs >= sinceMs - 2000) out.push(r);
  }
  return out;
}
/** Kiểm NÔNG file mới ghi ngay NGOÀI `dir`: các file nằm trực tiếp trong thư mục cha của `dir` (phòng), content/ và gốc dự án.
 *  Không quét thư mục chủ đề khác vì các việc plan chạy song song ghi vào đó hợp lệ (quét sâu sẽ báo nhầm). Bắt được lỗi hay gặp
 *  (đường dẫn tương đối sai kiểu `../x`), không chặn được ý đồ cố tình. */
export function outsideWrites(dir, sinceMs) {
  const roots = [...new Set([path.dirname(path.resolve(dir)), path.resolve(S.CONTENT_DIR), path.resolve(S.ROOT)])];
  const out = [];
  for (const root of roots) {
    let names = [];
    try {
      names = fs.readdirSync(root, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of names) {
      const p = path.join(root, e.name);
      if (e.isFile() && fs.statSync(p).mtimeMs >= sinceMs - 2000) out.push(path.relative(S.ROOT, p).split(path.sep).join('/'));
    }
  }
  return out;
}
const die = (code, msg) => {
  console.error(msg);
  process.exit(code);
};

async function main() {
  const [mode, promptFile, workdir] = process.argv.slice(2);
  if (!ROLES[mode] || !promptFile || !workdir) die(1, 'Dùng: node studio/src/codex-write.mjs <script|storyboard> <file-prompt> <thư-mục-làm-việc>');
  const promptPath = path.resolve(promptFile);
  if (!fs.existsSync(promptPath)) die(1, `KHONG_THAY_FILE: ${promptPath}`);
  const dir = path.resolve(workdir);
  const content = path.resolve(S.CONTENT_DIR);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) die(1, `KHONG_THAY_THU_MUC: ${dir}`);
  if (!(dir + path.sep).startsWith(content + path.sep)) die(1, `TU_CHOI: thư mục làm việc phải nằm trong ${content}`);

  if (S.sql.get("SELECT 1 FROM jobs WHERE kind='produce' AND status='running'")) die(2, 'BUSY: Codex đang sản xuất video khác, chưa viết được lúc này.');
  const account = P.pickAccount('codex', { dept: process.env.STUDIO_DEPT || null });
  if (!account) die(3, 'NO_ACCOUNT: không có tài khoản Codex nào của phòng đang dùng được.');
  P.markUsed(account.id);

  // Dòng đánh dấu để Văn phòng 2D nhận đúng vị trí core của phiên Codex này.
  const prompt = `[[STUDIO-ROLE:${mode}]]\n${fs.readFileSync(promptPath, 'utf8')}`;
  const logFile = path.join(path.dirname(S.DB_PATH), 'logs', `codex-write-${mode}-${Date.now()}.log`);
  writeLogMeta(logFile, {
    v: 1,
    source: 'codex-write',
    mode,
    role: mode === 'script' ? 'script' : 'visual',
    job_id: Number(process.env.STUDIO_JOB_ID) || null,
    topic_id: Number(process.env.STUDIO_TOPIC_ID) || null,
    dept: process.env.STUDIO_DEPT || null,
    prompt_file: promptPath,
    workdir: dir,
    started_at: new Date().toISOString(),
  });
  const cx = findCodex();
  const args = [...cx.pre, 'exec', '--cd', dir, '--approve-for-me', '--skip-git-repo-check', '-c', 'project_doc_max_bytes=0', '-'];
  const t0 = Date.now();
  const res = await execProcess({ cmd: cx.cmd, args, env: accountEnv('codex', account), cwd: dir, input: prompt, logFile, limitMs: 45 * MIN, shell: cx.shell, label: `codex-write ${mode} · tài khoản ${account.label}` });
  // Codex có thể thoát mã 0 mà KHÔNG ghi file (đã thấy T17, 20/11/2026: "môi trường chặn đọc… chưa tạo review/script-codex-r1.md").
  // Đòi đúng file đầu ra mới (sửa sau lúc bắt đầu); thiếu thì báo mã 8 để Claude coi như Codex vắng thay vì ghi "đã viết xong".
  const wrote = res.code === 0 && !res.timedOut && producedFiles(dir, t0).some((f) => EXPECTED[mode].test(f));
  S.recordCall({ provider: 'codex', mode: `write-${mode}`, dept: process.env.STUDIO_DEPT || null, job_id: Number(process.env.STUDIO_JOB_ID) || null, started_ms: t0, outcome: res.code === 0 && !res.timedOut && !wrote ? 'no_output' : callOutcome(res) });

  if (res.timedOut) die(4, `FAILED: Codex quá 20 phút nên bị dừng (${mode}).`);
  if (res.code !== 0) {
    const c = classifyFailure([res.err, res.out.slice(-2000)].join('\n'));
    if (c.type === 'limit') {
      P.markLimited(account.id, { until: c.resetAt, raw: c.raw });
      die(5, `LIMIT: ${c.raw}`);
    }
    if (c.type === 'auth') {
      P.markAuthError(account.id, c.raw);
      die(6, `AUTH_ERROR: ${c.raw}`);
    }
    die(7, `FAILED: codex thoát mã ${res.code}: ${c.raw}`);
  }
  const reply = res.out.trim();
  fs.writeFileSync(`${promptPath}.reply.md`, reply);
  const stray = outsideWrites(dir, t0);
  if (stray.length) S.logEvent({ actor: `codex/${mode}`, dept: process.env.STUDIO_DEPT || null, kind: 'job', message: `CẢNH BÁO ${ROLES[mode]}: Codex ghi ${stray.length} file NGOÀI thư mục chủ đề (${stray.slice(0, 5).join(', ')}) — Claude kiểm và hoàn lại nếu sai` });
  if (!wrote) {
    S.logEvent({ actor: `codex/${mode}`, dept: process.env.STUDIO_DEPT || null, kind: 'job', message: `${ROLES[mode]}: Codex (tài khoản ${account.label}) trả lời nhưng KHÔNG ghi file đầu ra nào trong ${path.relative(S.ROOT, dir)}` });
    die(8, `KHONG_RA_FILE: Codex thoát mã 0 nhưng không ghi file đầu ra (${mode}). Câu trả lời của Codex: ${reply.slice(0, 600)}`);
  }
  P.markSuccess(account.id);
  S.logEvent({ actor: `codex/${mode}`, dept: process.env.STUDIO_DEPT || null, kind: 'job', message: `${ROLES[mode]}: Codex (tài khoản ${account.label}) đã viết xong 1 bản trong ${path.relative(S.ROOT, dir)}` });
  process.stdout.write(reply);
}

// Chỉ chạy khi gọi trực tiếp (kiểm thử import các hàm mà không kích hoạt main).
if (process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase()) {
  main().catch((e) => die(1, `FAILED: ${e.message || e}`));
}
