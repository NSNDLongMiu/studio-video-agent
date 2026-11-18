// Goi Codex o che do CHI-DOC de gop y tuong/phan bien trong buoc "plan" (tranh luan 4 ben: 2 Claude +
// 2 Codex, xem .claude/skills/make-plan/SKILL.md Buoc 2). KHONG dung cho san xuat (viec do van la
// runCodexProduce voi --approve-for-me rieng).
//
// Day la script Node HEP, co dinh co, de phien Claude dang dieu phoi tranh luan goi qua Bash voi 1
// pattern allow CO DINH (vd "Bash(node ... codex-ideate.mjs *)"). Cap quyen Bash(codex exec*) thang
// cho phien do la khong an toan: he thong cap quyen cua Claude Code khop THEO TIEN TO chuoi lenh (da
// xac nhan qua QC_TOOLS hien co: "Bash(node tools/qc-video.mjs *)"), khong hieu co - "Bash(codex exec*)"
// se khop ca "codex exec --approve-for-me ..." (quyen ghi file cap san xuat) - lo hong ro rang.
//
// Dung: node studio/src/codex-ideate.mjs <ideator-c|ideator-d> <duong-dan-file-prompt>
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as S from './db.mjs';
import * as P from './pool.mjs';
import { findCodex, accountEnv, execProcess, writeLogMeta } from './runners.mjs';
import { classifyFailure } from './limits.mjs';

const MIN = 60_000;

async function main() {
  const [role, promptFile] = process.argv.slice(2);
  // 'codex' = giọng Codex trong vị trí Ý tưởng (vừa đề xuất vừa phản biện); ideator-c/d giữ để tương thích.
  if (!['codex', 'ideator-c', 'ideator-d'].includes(role) || !promptFile) {
    console.error('Dung: node studio/src/codex-ideate.mjs <codex|ideator-c|ideator-d> <duong-dan-file-prompt>');
    process.exit(1);
  }
  const promptPath = path.resolve(promptFile);
  if (!fs.existsSync(promptPath)) {
    console.error(`KHONG_THAY_FILE: ${promptPath}`);
    process.exit(1);
  }
  const prompt = `[[STUDIO-ROLE:idea]]
${fs.readFileSync(promptPath, 'utf8')}`; // dòng đánh dấu cho Văn phòng 2D

  // Tranh gianh 1 tai khoan Codex duy nhat (codex/main) voi 1 viec "produce" dang chay that su (viec do
  // dung --approve-for-me, quan trong hon 1 luot gop y) - chua kiem chung 2 tien trinh codex exec cung
  // dung chung 1 CODEX_HOME co an toan khong, nen bo qua luot nay thay vi mao hiem.
  if (S.sql.get("SELECT 1 FROM jobs WHERE kind='produce' AND status='running'")) {
    console.error('BUSY: co viec san xuat (produce) dang chay, bo qua luot gop y Codex nay.');
    process.exit(2);
  }

  const account = P.pickAccount('codex', { dept: process.env.STUDIO_DEPT || null }); // worker truyền phòng của việc plan
  if (!account) {
    console.error('NO_ACCOUNT: khong co tai khoan Codex nao san sang.');
    process.exit(3);
  }
  P.markUsed(account.id);

  // Chay o thu muc scratch tam, KHONG o goc du an: neu --cd goc du an, Codex se tu nap AGENTS.md
  // ("Claude lo y tuong, Codex dung thanh pham") - tu mau thuan voi chinh viec dang nho no lam. Giong
  // probeAccount() da lam. Vi vay prompt phai TU DAY DU (dan brief/debate truoc do vao thang prompt),
  // khong dua vao Codex tu doc file du an trong luot nay.
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-ideate-'));
  const logFile = path.join(path.dirname(S.DB_PATH), 'logs', `codex-ideate-${role}-${Date.now()}.log`);
  writeLogMeta(logFile, {
    v: 1,
    source: 'codex-ideate',
    mode: role,
    role: 'idea',
    job_id: Number(process.env.STUDIO_JOB_ID) || null,
    topic_id: Number(process.env.STUDIO_TOPIC_ID) || null,
    dept: process.env.STUDIO_DEPT || null,
    prompt_file: promptPath,
    workdir: null,
    started_at: new Date().toISOString(),
  });
  const cx = findCodex();
  const args = [...cx.pre, 'exec', '--cd', scratch, '--sandbox', 'read-only', '--skip-git-repo-check', '-'];
  const res = await execProcess({
    cmd: cx.cmd,
    args,
    env: accountEnv('codex', account),
    cwd: scratch,
    input: prompt,
    logFile,
    limitMs: 5 * MIN,
    shell: cx.shell,
    label: `codex-ideate ${role} · tài khoản ${account.label}`,
  });

  if (res.timedOut) {
    console.error(`FAILED: Codex quá 5 phút nên bị dừng (${role}).`);
    process.exit(4);
  }
  if (res.code !== 0) {
    const c = classifyFailure([res.err, res.out.slice(-2000)].join('\n'));
    if (c.type === 'limit') {
      P.markLimited(account.id, { until: c.resetAt, raw: c.raw });
      console.error(`LIMIT: ${c.raw}`);
      process.exit(5);
    }
    if (c.type === 'auth') {
      P.markAuthError(account.id, c.raw);
      console.error(`AUTH_ERROR: ${c.raw}`);
      process.exit(6);
    }
    console.error(`FAILED: codex thoát mã ${res.code}: ${c.raw}`);
    process.exit(7);
  }

  P.markSuccess(account.id);
  const reply = res.out.trim();
  fs.writeFileSync(`${promptPath}.reply.md`, reply);
  S.logEvent({ actor: role, kind: 'account', message: `${role} (Codex, tài khoản ${account.label}) đã góp ý trong 1 vòng tranh luận.` });
  process.stdout.write(reply);
}

main().catch((e) => {
  console.error(`FAILED: ${e.message || e}`);
  process.exit(1);
});
