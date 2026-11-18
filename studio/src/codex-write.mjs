// Gọi Codex VIẾT file cho 2 vị trí core (giám đốc duyệt 18/11/2026):
//   script     — Kịch bản: concept.md, plan.md, epNN/script.md
//   storyboard — Đạo diễn hình ảnh: epNN/storyboard.json (+ storyboard.md)
// Claude (phiên điều phối /make-plan) review, góp ý và DUYỆT CUỐI; Codex chỉ là người viết.
//
// Ràng buộc an toàn (giống lý do của codex-ideate.mjs — pattern Bash cố định, không cấp "codex exec*"):
//  - chỉ ghi được trong <thư-mục-làm-việc>, và thư mục đó PHẢI nằm trong content/ (sandbox workspace-write, --cd vào đó);
//  - không nạp AGENTS.md (vai Producer) — tắt bằng project_doc_max_bytes=0, vai do prompt quyết;
//  - dùng tài khoản Codex của phòng (STUDIO_DEPT do worker truyền), nhường việc "produce" đang chạy.
// Dùng: node studio/src/codex-write.mjs <script|storyboard> <file-prompt> <thư-mục-làm-việc>
// Mã thoát: 0 xong · 2 BUSY · 3 NO_ACCOUNT · 4 quá giờ · 5 LIMIT · 6 AUTH_ERROR · 7 FAILED · 1 sai cú pháp
import fs from 'node:fs';
import path from 'node:path';
import * as S from './db.mjs';
import * as P from './pool.mjs';
import { findCodex, accountEnv, execProcess, writeLogMeta } from './runners.mjs';
import { classifyFailure } from './limits.mjs';

const MIN = 60_000;
const ROLES = { script: 'Kịch bản', storyboard: 'Đạo diễn hình ảnh' };
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
  const args = [...cx.pre, 'exec', '--cd', dir, '--sandbox', 'workspace-write', '--skip-git-repo-check', '-c', 'project_doc_max_bytes=0', '-'];
  const res = await execProcess({ cmd: cx.cmd, args, env: accountEnv('codex', account), cwd: dir, input: prompt, logFile, limitMs: 20 * MIN, shell: cx.shell, label: `codex-write ${mode} · tài khoản ${account.label}` });

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
  P.markSuccess(account.id);
  const reply = res.out.trim();
  fs.writeFileSync(`${promptPath}.reply.md`, reply);
  S.logEvent({ actor: `codex/${mode}`, dept: process.env.STUDIO_DEPT || null, kind: 'job', message: `${ROLES[mode]}: Codex (tài khoản ${account.label}) đã viết xong 1 bản trong ${path.relative(S.ROOT, dir)}` });
  process.stdout.write(reply);
}

main().catch((e) => die(1, `FAILED: ${e.message || e}`));
