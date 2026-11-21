// Chạy 1 việc bằng đúng tài khoản được chọn: claude -p (ý tưởng/kế hoạch/QC/gỡ vướng) hoặc codex exec (sản xuất).
// Mỗi tài khoản = 1 thư mục đăng nhập riêng (CLAUDE_CONFIG_DIR / CODEX_HOME); môi trường con được làm sạch để
// biến môi trường của phiên khác (token, API key, cờ lồng nhau) không đè lên tài khoản đã chọn.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as S from './db.mjs';
import { classifyFailure } from './limits.mjs';
import { findAgy, accountHasAgyLogin, AGY_DROP_ENV, AGY_MODEL_CHAIN, AGY_SETTINGS, parseAgyJson } from './agy.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const MIN = 60_000;
// Video giải thích sâu 150–190 s (giám đốc 19/11/2026) tốn ≈ 4× thời gian video 42 s (T8: plan 32 phút, dựng ≈ 50 phút): nâng giới hạn plan/produce/qc/rescue.
const timeoutMs = (kind) => Number(process.env.STUDIO_JOB_TIMEOUT_MIN || { plan: 180, qc: 45, rescue: 90, dept_review: 15, produce: 300 }[kind] || 60) * MIN;

// ---------- tìm CLI ----------
export function findClaude() {
  if (process.env.CLAUDE_JS) return { cmd: process.execPath, pre: [process.env.CLAUDE_JS], shell: false };
  // npm cài "claude" trên Windows chỉ tạo shim claude.cmd/claude.ps1 (không có file "claude" trần chạy được) ->
  // shell:false không tìm ra lệnh. shell:true thì tìm ra shim, nhưng khi đường dẫn dự án có khoảng trắng (vd
  // "D:\Agent Video Studio\...mcp-agent.json"), việc ghép lại dòng lệnh qua shell làm các phần tử args bị cắt sai
  // chỗ dấu cách -> lỗi "MCP config file not found". Giống findCodex(), trỏ thẳng tới claude.exe thật (gói npm
  // của Claude Code ship sẵn file .exe, không phải .js) để chạy shell:false, args giữ nguyên từng phần tử.
  for (const dir of (process.env.PATH || '').split(path.delimiter)) {
    const exe = path.join(dir, 'node_modules', '@anthropic-ai', 'claude-code', 'bin', 'claude.exe');
    if (dir && fs.existsSync(exe)) return { cmd: exe, pre: [], shell: false };
  }
  return { cmd: 'claude', pre: [], shell: true };
}
export function findCodex() {
  if (process.env.CODEX_JS) return { cmd: process.execPath, pre: [process.env.CODEX_JS], shell: false };
  for (const dir of (process.env.PATH || '').split(path.delimiter)) {
    const js = path.join(dir, 'node_modules', '@openai', 'codex', 'bin', 'codex.js');
    if (dir && fs.existsSync(js)) return { cmd: process.execPath, pre: [js], shell: false };
  }
  return { cmd: 'codex', pre: [], shell: true };
}

// ---------- môi trường theo tài khoản ----------
const DROP = new Set(['CLAUDECODE', 'CLAUDE_CODE_ENTRYPOINT', 'CLAUDE_CODE_OAUTH_TOKEN', 'CLAUDE_CONFIG_DIR', 'ANTHROPIC_API_KEY', 'ANTHROPIC_AUTH_TOKEN', 'CODEX_HOME', 'CODEX_API_KEY', 'CODEX_ACCESS_TOKEN', 'OPENAI_API_KEY']);
export function accountEnv(provider, account) {
  const env = {};
  for (const [k, v] of Object.entries(process.env)) if (!DROP.has(k) && !k.startsWith('CLAUDE_CODE_USE_')) env[k] = v;
  if (provider === 'claude') {
    if (account.home) env.CLAUDE_CONFIG_DIR = account.home;
    if (account.kind === 'api_key') {
      if (!account.secret_file || !fs.existsSync(account.secret_file)) throw new S.StudioError(`Không đọc được file key của tài khoản ${account.label}: ${account.secret_file || '(chưa đặt)'}`);
      env.ANTHROPIC_API_KEY = fs.readFileSync(account.secret_file, 'utf8').trim();
    }
  } else if (provider === 'gemini') {
    // agy: không có thư mục đăng nhập riêng; chỉ gỡ mọi đường khoá API/ADC (tính phí theo lượt, luật 8).
    for (const k of AGY_DROP_ENV) delete env[k];
  } else if (account.home) env.CODEX_HOME = account.home;
  return env;
}

// ---------- chạy tiến trình ----------
function killTree(child) {
  try {
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    else child.kill('SIGKILL');
  } catch {
    /* đã thoát */
  }
}
export function execProcess({ cmd, args, env, cwd, input, logFile, limitMs, onChild, shell = false, label }) {
  return new Promise((resolve) => {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    const log = fs.createWriteStream(logFile, { flags: 'a' });
    log.write(`\n===== ${new Date().toISOString()} · ${label} =====\n`);
    let out = '';
    let err = '';
    const cap = (s, d) => (s + d).slice(-200_000);
    let timedOut = false;
    let child;
    try {
      child = spawn(cmd, args, { cwd, env, shell, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
    } catch (e) {
      log.end(`[spawn lỗi] ${e.message}\n`);
      return resolve({ code: -1, out: '', err: e.message, timedOut: false });
    }
    onChild?.(child);
    child.stdin.on('error', () => {});
    child.stdin.end(input ?? '');
    child.stdout.on('data', (d) => ((out = cap(out, d)), log.write(d)));
    child.stderr.on('data', (d) => ((err = cap(err, d)), log.write(d)));
    const timer = setTimeout(() => {
      timedOut = true;
      killTree(child);
    }, limitMs);
    child.on('error', (e) => {
      log.write(`\n[spawn lỗi] ${e.message}\n`);
      err += e.message;
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      log.end(`\n[thoát mã ${code}${timedOut ? ', QUÁ GIỜ' : ''}]\n`);
      resolve({ code: code ?? -1, out, err, timedOut });
    });
  });
}

export const jobLogFile = (job) => {
  const base = job.video_id ? path.resolve(S.ROOT, S.getVideo(job.video_id).folder, 'logs') : path.join(path.dirname(S.DB_PATH), 'logs');
  return path.join(base, `job-${job.id}-${job.kind}.log`);
};

export function writeLogMeta(logFile, meta) {
  try {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    fs.writeFileSync(`${logFile}.meta.json`, JSON.stringify(meta, null, 2), 'utf8');
    return true;
  } catch {
    // Vẫn chạy việc chính nếu không ghi được thông tin định danh log.
    return false;
  }
}

/** Kết quả 1 lượt gọi Codex/Gemini để ghi sổ tải (agent_calls): ok | timeout | limit | auth | fail. `ok` = lượt thành công theo từng công cụ; `extra` = chữ bổ sung để phân loại lỗi. */
export function callOutcome(res, { ok = res.code === 0, extra = '' } = {}) {
  if (res.timedOut) return 'timeout';
  if (res.code === 0 && ok) return 'ok';
  const t = classifyFailure([extra, res.err, res.out.slice(-2000)].filter(Boolean).join('\n')).type;
  return t === 'limit' ? 'limit' : t === 'auth' ? 'auth' : 'fail';
}

// ---------- Claude (claude -p) ----------
const BASE_TOOLS = ['Read', 'Glob', 'Grep', 'Write', 'Edit', 'WebSearch', 'WebFetch', 'Agent', 'mcp__studio'];
const QC_TOOLS = ['Bash(node tools/qc-measure.mjs *)', 'Bash(node tools/qc-video.mjs *)', 'Bash(ffprobe *)', 'Bash(ffmpeg *)'];
// Chi cho viec "plan": goi 2 "giong" Codex (ideator-c/d) gop y trong tranh luan 4 ben (18/11/2026).
// Pattern CO DINH, khong phai "Bash(codex exec*)" - xem chu thich dau file codex-ideate.mjs ly do.
// + codex-write.mjs: Codex làm storyboard và CÙNG VIẾT kịch bản (ghi file, chỉ trong thư mục chủ đề) để Claude review/chốt (giám đốc chốt 18/11/2026; kịch bản do Claude viết từ 20/11/2026).
const CODEX_IDEATE_TOOLS = ['Bash(node --disable-warning=ExperimentalWarning studio/src/codex-ideate.mjs *)', 'Bash(node --disable-warning=ExperimentalWarning studio/src/codex-write.mjs *)'];
// Gemini (agy) cũng chỉ được gọi qua 1 mẫu lệnh cố định: gemini-run.mjs <ideate|facts|images|look|scout> <file-prompt> <thư-mục-trong-content>.
// Claude điều phối và chốt; Gemini chỉ sinh ảnh/nhận xét/kiểm chứng, kết quả vào file riêng để Claude kiểm (giám đốc chốt 20/11/2026).
const GEMINI_TOOLS = ['Bash(node --disable-warning=ExperimentalWarning studio/src/gemini-run.mjs *)'];
// Tìm chủ đề theo giờ (21/11/2026): Codex chỉ được gọi ở chế độ CHỈ-ĐỌC (codex-ideate.mjs) để đề xuất độc lập và phản biện, không có codex-write.mjs.
const CODEX_SCOUT_TOOLS = [CODEX_IDEATE_TOOLS[0]];
// Gói tín hiệu nhu cầu (giám đốc yêu cầu 21/11/2026): MỘT mẫu lệnh cố định, chỉ gom nguồn công khai miễn phí và ghi vào .local/signals/ (xem tools/signals/collect.mjs).
const SIGNALS_TOOLS = ['Bash(node tools/signals/collect.mjs *)'];
const DENY = ['Edit(.claude/**)', 'Edit(studio/**)', 'Edit(.codex/**)', 'Edit(.agents/**)', 'Edit(tools/**)', 'Edit(CLAUDE.md)', 'Edit(AGENTS.md)', 'Edit(.mcp.json)'];
const SKILL_PROMPT = {
  plan: (j) => `/make-plan ${j.topic_id} ${j.payload.episodes || 1} ${j.payload.rounds || 2}${j.payload.takeover?.for === 'codex' ? ' thay-codex' : ''}`,
  qc: (j) => `/qc ${j.video_id}`,
  rescue: (j) => `/rescue ${j.video_id}`,
  dept_review: (j) => `/dept-review ${j.dept}`,
  scout: (j) => `/scout-topics ${j.payload.team_id} ${j.payload.slot || 'chạy-tay'} ${j.payload.per_run || 5}`,
};
// takeover = payload.takeover của việc (giám đốc đã duyệt cho Claude làm thay Codex, xem pool.approveTakeover).
const SYS = (retry, takeover) =>
  `Bạn đang chạy NỀN theo hàng đợi của xưởng video, không có người trả lời câu hỏi. Đừng hỏi lại: nếu thiếu thông tin mà giám đốc phải quyết, hãy dừng và nêu rõ cần gì ở kết quả cuối. Chỉ có công cụ vai "agent" (không có quyền duyệt/mở-đóng phòng). Tuân thủ CLAUDE.md.${retry ? ' ĐÂY LÀ LẦN CHẠY LẠI (lần trước bị ngắt do hết limit hoặc lỗi): kiểm tra file đã có trong thư mục chủ đề/video (debate.md, concept.md, plan.md, script.md, notes.md, final/) và TIẾP TỤC từ chỗ dở, không làm lại phần đã xong, không tạo trùng.' : ''}${takeover ? ` GIÁM ĐỐC ĐÃ DUYỆT (${String(takeover.approved_at || '').slice(0, 10)}): Claude làm THAY Codex trong việc này vì Codex không làm được. Ở mọi bước cần Codex (storyboard, đồng viết kịch bản): KHÔNG kết thúc bằng CODEX_WAIT và KHÔNG gọi codex-write.mjs / codex-ideate.mjs; làm theo mục "Giám đốc duyệt thay thế" trong skill make-plan và ghi rõ "Claude làm thay Codex (giám đốc duyệt)" ở file đầu ra. Quyền duyệt không đổi: người đặt APPROVED phải khác agent đã viết storyboard.${takeover.note ? ` Ghi chú của giám đốc: ${takeover.note}` : ''}` : ''}`;

function writeMcpConfig() {
  const dir = path.dirname(S.DB_PATH); // cạnh file DB đang dùng
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'mcp-agent.json');
  const env = { STUDIO_ROLE: 'agent' };
  for (const k of ['STUDIO_DB', 'STUDIO_CONTENT', 'STUDIO_ACCOUNTS']) if (process.env[k]) env[k] = process.env[k];
  fs.writeFileSync(file, JSON.stringify({ mcpServers: { studio: { command: 'node', args: ['--disable-warning=ExperimentalWarning', path.join(here, 'mcp.mjs').split(path.sep).join('/')], env } } }, null, 2));
  return file;
}

export function parseClaudeJson(out) {
  const t = out.trim();
  try {
    return JSON.parse(t);
  } catch {
    /* luồng NDJSON có thể lẫn cảnh báo hoặc bị cắt ở đầu */
  }
  let fallback = null;
  for (const line of t.split(/\r?\n/).reverse()) {
    if (!line.trimStart().startsWith('{')) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'result') return obj;
      if (fallback === null && line.startsWith('{')) fallback = obj;
    } catch {
      /* thử dòng khác */
    }
  }
  return fallback;
}

/** Bộ tham số `claude -p` cho 1 việc (xuất ra để kiểm thử đúng bộ cờ mà worker dùng). */
export function buildClaudeArgs(job, account) {
  const tools = [...BASE_TOOLS, ...(job.kind === 'qc' || job.kind === 'rescue' ? QC_TOOLS : []), ...(job.kind === 'plan' ? CODEX_IDEATE_TOOLS : job.kind === 'scout' ? CODEX_SCOUT_TOOLS : []), ...(['plan', 'qc', 'scout'].includes(job.kind) ? GEMINI_TOOLS : []), ...(['plan', 'scout'].includes(job.kind) ? SIGNALS_TOOLS : [])];
  // --no-session-persistence: việc nền không bao giờ --resume/--continue (worker tiếp tục bằng cách đọc lại
  // file trong content/, xem SYS() ở trên), nên tắt lưu phiên để không chất đống trong panel "agent" của
  // VSCode extension — giám đốc không xoá được các mục đó, theo dõi tiến độ thật đã có dashboard/office riêng.
  // stream-json + --verbose ghi toàn bộ hội thoại vào log để dashboard hiển thị trong popup.
  const args = ['-p', '--no-session-persistence', '--output-format', 'stream-json', '--verbose', '--strict-mcp-config', '--mcp-config', writeMcpConfig(), '--allowedTools', tools.join(','), '--disallowedTools', DENY.join(','), '--permission-prompts', 'none', '--append-system-prompt', SYS(job.attempts > 0 || job.resumed, job.kind === 'plan' ? job.payload?.takeover : null)];
  if (process.env.STUDIO_CLAUDE_MODEL) args.push('--model', process.env.STUDIO_CLAUDE_MODEL);
  if (account.kind === 'api_key') args.push('--max-budget-usd', process.env.STUDIO_API_BUDGET_USD || '5');
  return args;
}

export function claudeJobEnv(job, account) {
  const env = accountEnv('claude', account);
  if (job.dept) env.STUDIO_DEPT = job.dept;
  env.STUDIO_JOB_ID = String(job.id);
  if (job.topic_id != null) env.STUDIO_TOPIC_ID = String(job.topic_id);
  else delete env.STUDIO_TOPIC_ID;
  return env;
}

export async function runClaudeJob(job, account, { onChild } = {}) {
  const prompt = SKILL_PROMPT[job.kind]?.(job);
  if (!prompt) throw new S.StudioError(`Loại việc ${job.kind} không chạy bằng Claude`);
  const logFile = jobLogFile(job);
  const cx = findClaude();
  const args = [...cx.pre, ...buildClaudeArgs(job, account)];
  const res = await execProcess({ cmd: cx.cmd, args, env: claudeJobEnv(job, account), cwd: S.ROOT, input: prompt, logFile, limitMs: timeoutMs(job.kind), onChild, shell: cx.shell, label: `claude ${prompt} · tài khoản ${account.label}` });
  const obj = parseClaudeJson(res.out);
  const resultText = [obj?.result, obj?.api_error_status ? `api_error_status=${obj.api_error_status}` : '', res.err, obj ? '' : res.out.slice(-1500)].filter(Boolean).join('\n');
  const base = { logFile, cost: obj?.total_cost_usd ?? null, summary: String(obj?.result ?? '').slice(0, 400) };
  if (res.timedOut) return { ...base, outcome: 'failed', reason: `Quá ${timeoutMs(job.kind) / MIN} phút nên bị dừng` };
  if (res.code === 0 && obj && !obj.is_error) {
    const wait = /^CODEX_WAIT:\s*(.+)$/m.exec(String(obj.result || ''));
    // Đã duyệt Claude làm thay Codex mà vẫn đòi chờ Codex = làm sai chỉ dẫn; không cho vòng lặp chờ Codex, đưa giám đốc xem.
    if (wait && job.payload.takeover) return { ...base, outcome: 'needs_human', reason: `Đã duyệt Claude làm thay Codex nhưng việc vẫn kết thúc bằng CODEX_WAIT: ${wait[1].trim().slice(0, 160)}` };
    if (wait) return { ...base, outcome: 'wait_codex', reason: wait[1].trim().slice(0, 200) };
    return { ...base, outcome: 'success' };
  }
  const c = classifyFailure(resultText);
  if (c.type === 'limit') return { ...base, outcome: 'limit', resetAt: c.resetAt, raw: c.raw, reason: c.raw };
  if (c.type === 'auth') return { ...base, outcome: 'auth', raw: c.raw, reason: c.raw };
  return { ...base, outcome: 'failed', reason: (obj?.subtype && obj.subtype !== 'success' ? `${obj.subtype}: ` : '') + (c.raw || `claude thoát mã ${res.code}`) };
}

// ---------- Codex (codex exec) ----------
const toml = (v) => JSON.stringify(v);
function codexMcpOverrides() {
  const mcp = path.join(here, 'mcp.mjs').split(path.sep).join('/');
  const envT = ['STUDIO_DB', 'STUDIO_CONTENT', 'STUDIO_ACCOUNTS'].filter((k) => process.env[k]).map((k) => `${k}=${toml(process.env[k])}`);
  return ['-c', `mcp_servers.studio.command=${toml('node')}`, '-c', `mcp_servers.studio.args=${toml(['--disable-warning=ExperimentalWarning', mcp])}`, '-c', `mcp_servers.studio.env={STUDIO_ROLE="agent"${envT.length ? ',' + envT.join(',') : ''}}`, '-c', 'mcp_servers.studio.startup_timeout_sec=30'];
}

function producerPrompt(v, team, topic, retry) {
  const tf = topic.folder;
  return `[[STUDIO-ROLE:producer]]
Bạn là PRODUCER (Codex) của "${team.name}" (team_id=${team.id}), phòng "${v.dept}".
Nhiệm vụ: sản xuất xong video ${v.id} — "${v.title}".

ĐỌC TRƯỚC (theo thứ tự): AGENTS.md → ${tf}/brief.md → ${tf}/concept.md → ${tf}/plan.md → ${v.folder}/script.md (nếu có) → ${v.folder}/storyboard.json (BẮT BUỘC — nguồn sự thật cho hình ảnh từng cảnh, do Visual Director viết; schema ở studio/schema/storyboard.schema.json) → skill $video-producer.
Thư mục làm việc của video: ${v.folder}  (assets/ cho nguyên liệu, final/ cho thành phẩm, notes.md cho nhật ký).
${retry ? `\nĐÂY LÀ LẦN CHẠY LẠI (lần trước bị ngắt do hết limit hoặc lỗi). Đọc ${v.folder}/notes.md và xem ${v.folder}/assets, final để TIẾP TỤC từ chỗ dở; không làm lại phần đã xong. Nếu notes.md có mục "Hướng dẫn từ Claude" thì làm theo.\n` : ''}
Dùng prosody.mjs plan, gen_vo.py --plan, timeline và assemble.py theo tools/voice/README.md; giữ đệm giọng R23. Lập cue sheet, trộn bốn lớp bằng mix.py theo tools/audio/README.md.
Dựng opening ba pha theo storyboard, có thể có lời hook; đo Audio / Visual / Narrative bằng qc-measure và ghi CHƯA KIỂM cho tiêu chí cảm nhận.
QUY TRÌNH BẮT BUỘC với MCP "studio":
1. Ngay khi bắt đầu: report_status(team_id=${team.id}, role="producer", status="working", task="<đang làm gì>", video_id="${v.id}"). Cập nhật lại mỗi khi chuyển bước lớn.
2. Làm đúng plan.md và storyboard.json. Mỗi cảnh dựng theo đúng scene_type/camera/environment/animation_timeline đã ghi trong storyboard.json — không tự quay lại công thức "nền cố định + Cáo đứng chỉ tay + đổi chữ" khi storyboard đã ghi khác. 1 cảnh không dựng được đúng như storyboard bằng công cụ hiện có → escalate kèm phương án thay thế cụ thể, không âm thầm hạ thành thẻ chữ tĩnh. Không tự đổi concept/kịch bản; nếu thấy plan/storyboard sai hoặc thiếu → escalate để Claude xử lý.
3. Thành phẩm đặt trong ${v.folder}/final/: <id>_9x16.mp4 (1080x1920, H.264+AAC), thumbnail.jpg, captions.srt, publish.json (tiêu đề/mô tả/hashtag cho TikTok, Facebook Reels, YouTube Shorts). Tự kiểm tra bằng node tools/qc-video.mjs trước khi báo xong.
4. Nếu KẸT sau khi đã thử hợp lý (lỗi công cụ lặp lại, thiếu nguyên liệu, plan mâu thuẫn): gọi escalate(video_id="${v.id}", reason="<vướng gì, đã thử gì>"), ghi chi tiết vào ${v.folder}/notes.md, rồi kết thúc với dòng cuối cùng: NEEDS_HELP: <lý do ngắn>.
5. Khi XONG: set_video_stage(video_id="${v.id}", stage="review", note="<tóm tắt>"), report_status(... status="idle"), và dòng cuối cùng: DONE.
Không đụng vào thư mục/video của đội khác. Không sửa studio/ hay cấu hình.`;
}

export async function runCodexProduce(job, account, { onChild } = {}) {
  const v = S.getVideo(job.video_id);
  const team = v.team;
  const topic = v.topic;
  const planPath = path.resolve(S.ROOT, topic.folder, 'plan.md');
  if (!fs.existsSync(planPath)) return { outcome: 'needs_human', reason: `Chưa có kế hoạch (${topic.folder}/plan.md) — chạy ý tưởng → kế hoạch trước` };
  // Visual Director (vai trò thứ 6, 17/11/2026) phải duyệt storyboard trước khi Producer được dựng —
  // không cho Codex tự quyết hình ảnh khi chưa có hoặc chưa duyệt storyboard.json.
  const storyboardPath = path.resolve(S.ROOT, v.folder, 'storyboard.json');
  if (!fs.existsSync(storyboardPath)) return { outcome: 'needs_human', reason: `Chưa có ${v.folder}/storyboard.json — chạy Visual Director (trong việc plan) trước khi sản xuất` };
  const storyboard = JSON.parse(fs.readFileSync(storyboardPath, 'utf8'));
  if (storyboard.status !== 'APPROVED') return { outcome: 'needs_human', reason: `${v.folder}/storyboard.json chưa ở trạng thái APPROVED (đang "${storyboard.status}") — Visual Director cần duyệt xong trước khi sản xuất` };
  if (['ready', 'published', 'rejected'].includes(v.stage) && !job.payload.force) return { outcome: 'needs_human', reason: `Video đã ở giai đoạn "${v.stage}" — chạy lại với force nếu muốn làm lại` };

  const logFile = jobLogFile(job);
  const lastMsg = logFile.replace(/\.log$/, `.last-${job.attempts}.md`);
  if (v.needs_help) S.resolveEscalation({ video_id: v.id, note: 'chạy lại sản xuất', by: 'worker' });
  if (v.stage !== 'production') S.setVideoStage({ video_id: v.id, stage: 'production', note: `Codex bắt đầu (tài khoản ${account.label})`, by: 'worker' });
  S.reportStatus({ team_id: team.id, role: 'producer', status: 'working', task: `Codex đang sản xuất ${v.id}`, video_id: v.id, by: 'worker' });

  const cx = findCodex();
  // '--sandbox workspace-write' một mình không đủ ở chế độ nền (approval mặc định 'never' âm thầm hạ
  // xuống chỉ-đọc, chặn cả ghi file lẫn MCP studio — đã kiểm thật, không phải đoán). '--approve-for-me'
  // là cờ chính thức của Codex cho đúng tình huống này: không có ai duyệt theo thời gian thực, Codex tự
  // duyệt nhưng vẫn giới hạn trong sandbox workspace-write (không ra ngoài thư mục dự án, không có mạng).
  // Giám đốc đã xác nhận bật (17/11/2026). Không dùng chung được với '--sandbox' (hai cờ loại trừ nhau).
  const args = [...cx.pre, 'exec', '--cd', S.ROOT, '--approve-for-me', '--skip-git-repo-check', ...(process.env.STUDIO_CODEX_MODEL ? ['-m', process.env.STUDIO_CODEX_MODEL] : []), ...codexMcpOverrides(), '-o', lastMsg, '-'];
  const res = await execProcess({ cmd: cx.cmd, args, env: { ...accountEnv('codex', account), STUDIO_ROLE: 'agent', STUDIO_TEAM_ID: String(team.id), STUDIO_VIDEO_ID: v.id }, cwd: S.ROOT, input: producerPrompt(v, team, topic, job.attempts > 0 || job.resumed), logFile, limitMs: timeoutMs('produce'), onChild, shell: cx.shell, label: `codex exec ${v.id} · tài khoản ${account.label}` });

  const last = fs.existsSync(lastMsg) ? fs.readFileSync(lastMsg, 'utf8').trim() : '';
  const base = { logFile, summary: last.slice(-300) };
  const idle = () => S.reportStatus({ team_id: team.id, role: 'producer', status: 'idle', by: 'worker' });
  if (res.timedOut) return { ...base, outcome: 'failed', reason: `Codex quá ${timeoutMs('produce') / MIN} phút nên bị dừng` };
  if (res.code !== 0) {
    const c = classifyFailure([res.err, res.out.slice(-3000), last].join('\n'));
    if (c.type === 'limit') return { ...base, outcome: 'limit', resetAt: c.resetAt, raw: c.raw, reason: c.raw };
    if (c.type === 'auth') return { ...base, outcome: 'auth', raw: c.raw, reason: c.raw };
    return { ...base, outcome: 'failed', reason: `Codex thoát mã ${res.code}: ${c.raw}` };
  }
  const needs = /NEEDS_HELP:\s*(.+)/.exec(last)?.[1];
  if (needs) return { ...base, outcome: 'needs_help', reason: needs };
  const cur = S.getVideo(v.id);
  if (cur.needs_help) return { ...base, outcome: 'needs_help', reason: cur.help_reason || 'Codex đã yêu cầu hỗ trợ' };
  const finalDir = path.resolve(S.ROOT, v.folder, 'final');
  const hasMp4 = fs.existsSync(finalDir) && fs.readdirSync(finalDir).some((f) => f.toLowerCase().endsWith('.mp4'));
  if (!hasMp4) return { ...base, outcome: 'failed', reason: 'Codex báo xong nhưng không thấy file .mp4 trong final/' };
  if (cur.stage === 'production') S.setVideoStage({ video_id: v.id, stage: 'review', note: 'Codex hoàn tất, chờ QC', by: 'worker' });
  idle();
  return { ...base, outcome: 'success' };
}

export function runJob(job, account, opts) {
  return job.provider === 'codex' ? runCodexProduce(job, account, opts) : runClaudeJob(job, account, opts);
}

// ---------- kiểm tra tài khoản ----------
export function checkAuth(account) {
  const env = accountEnv(account.provider, account);
  if (account.provider === 'claude') {
    if (account.kind === 'api_key') return { loggedIn: !!(account.secret_file && fs.existsSync(account.secret_file)), detail: 'API key (file)' };
    const cx = findClaude();
    const r = spawnSync(cx.cmd, [...cx.pre, 'auth', 'status', '--json'], { env, encoding: 'utf8', windowsHide: true, timeout: 30_000, shell: cx.shell });
    try {
      const j = JSON.parse(r.stdout);
      return { loggedIn: !!j.loggedIn, detail: j.loggedIn ? `${j.authMethod}${j.loginExpiresAt ? `, hạn đăng nhập ${j.loginExpiresAt}` : ''}` : 'chưa đăng nhập', expires: j.loginExpiresAt };
    } catch {
      return { loggedIn: false, detail: (r.stderr || r.stdout || 'không đọc được trạng thái').slice(0, 200) };
    }
  }
  if (account.provider === 'gemini') {
    // agy không có lệnh "đã đăng nhập chưa" miễn phí: dựa vào dòng "authenticated successfully" trong log của nó (không tốn hạn mức).
    // Việc gọi thử thật là `accounts check --probe`.
    const ok = accountHasAgyLogin();
    return { loggedIn: ok, detail: ok ? 'đã đăng nhập Google (theo log của agy)' : 'chưa đăng nhập — chạy agy và chọn 1. Google OAuth' };
  }
  const cx = findCodex();
  const r = spawnSync(cx.cmd, [...cx.pre, 'login', 'status'], { env, encoding: 'utf8', windowsHide: true, timeout: 30_000, shell: cx.shell });
  const t = `${r.stdout}\n${r.stderr}`;
  const loggedIn = /logged in/i.test(t) && !/not logged in/i.test(t);
  return { loggedIn, detail: (t.split(/\r?\n/).find((l) => /logged in/i.test(l)) || 'chưa đăng nhập').trim().slice(0, 160) };
}

/** Gọi thử 1 câu cực ngắn để chắc tài khoản chạy được từ đầu đến cuối (tốn rất ít hạn mức). */
export async function probeAccount(account) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-probe-'));
  const logFile = path.join(tmp, 'probe.log');
  let res;
  if (account.provider === 'claude') {
    const cx = findClaude();
    fs.writeFileSync(path.join(tmp, 'empty.json'), '{"mcpServers":{}}');
    res = await execProcess({ cmd: cx.cmd, args: [...cx.pre, '-p', '--no-session-persistence', '--output-format', 'json', '--strict-mcp-config', '--mcp-config', path.join(tmp, 'empty.json'), '--max-turns', '1'], env: accountEnv('claude', account), cwd: tmp, input: 'Reply with exactly: OK', logFile, limitMs: 3 * MIN, shell: cx.shell, label: 'probe' });
    const obj = parseClaudeJson(res.out);
    if (res.code === 0 && obj && !obj.is_error) return { ok: true, detail: String(obj.result).slice(0, 60), cost: obj.total_cost_usd };
    return { ok: false, ...classifyFailure([obj?.result, res.err, res.out.slice(-800)].filter(Boolean).join('\n')) };
  }
  if (account.provider === 'gemini') {
    const ag = findAgy();
    // Mô hình mặc định hết hạn mức thì thử mô hình dự phòng (giám đốc chốt 21/11/2026): ghế vẫn dùng được thì báo "chạy được".
    const chain = AGY_MODEL_CHAIN();
    let fail = null;
    for (let i = 0; i < chain.length; i++) {
      res = await execProcess({ cmd: ag.cmd, args: [...ag.pre, '-p', 'Reply with exactly: OK', '--output-format', 'json', '--sandbox', '--settings', AGY_SETTINGS, '--model', chain[i], '--print-timeout', '120s'], env: accountEnv('gemini', account), cwd: tmp, logFile, limitMs: 3 * MIN, shell: ag.shell, label: 'probe' });
      const obj = parseAgyJson(res.out);
      if (res.code === 0 && obj?.status === 'SUCCESS') return { ok: true, detail: `${i ? `${chain[i]}: ` : ''}${String(obj.response || '').trim()}`.slice(0, 80) };
      fail = { ok: false, ...classifyFailure([obj?.response, obj?.error, res.err, res.out.slice(-800)].filter(Boolean).join('\n')) };
      if (fail.type !== 'limit') break;
    }
    return fail;
  }
  const cx = findCodex();
  res = await execProcess({ cmd: cx.cmd, args: [...cx.pre, 'exec', '--cd', tmp, '--sandbox', 'read-only', '--skip-git-repo-check', '-'], env: accountEnv('codex', account), cwd: tmp, input: 'Reply with exactly: OK', logFile, limitMs: 3 * MIN, shell: cx.shell, label: 'probe' });
  if (res.code === 0) return { ok: true, detail: res.out.trim().slice(-60) };
  return { ok: false, ...classifyFailure(`${res.err}\n${res.out.slice(-800)}`) };
}
