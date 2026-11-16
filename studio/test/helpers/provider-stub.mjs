// Claude/Codex giả cho test: hành vi theo file <STUB_DIR>/<nhãn-tài-khoản>.mode (ok | limit | auth | help)
import fs from 'node:fs';
import path from 'node:path';
const args = process.argv.slice(2);
const isClaude = args.includes('-p');
const label = path.basename(process.env.CLAUDE_CONFIG_DIR || process.env.CODEX_HOME || 'default');
const mode = fs.readFileSync(path.join(process.env.STUB_DIR, `${label}.mode`), 'utf8').trim();
let prompt = '';
for await (const c of process.stdin) prompt += c;
fs.appendFileSync(path.join(process.env.STUB_DIR, 'calls.log'), `${isClaude ? 'claude' : 'codex'} ${label} ${mode} ${prompt.split('\n')[0].slice(0, 60)}\n`);
const S = await import(new URL('../../src/db.mjs', import.meta.url).href);
const out = (o) => console.log(JSON.stringify({ type: 'result', subtype: 'success', is_error: false, session_id: 's', total_cost_usd: 0.01, num_turns: 1, ...o }));

if (isClaude) {
  if (mode === 'limit') {
    out({ is_error: true, api_error_status: 429, result: process.env.STUB_LIMIT_MSG || "You've hit your limit · try again in 2 seconds" });
    process.exit(1);
  }
  if (mode === 'auth') {
    out({ is_error: true, result: 'Not logged in · Please run /login' });
    process.exit(1);
  }
  const m = /^\/(make-plan|qc|rescue|dept-review)\s*(\S*)/.exec(prompt.trim());
  if (m?.[1] === 'make-plan') {
    const t = S.sql.get('SELECT folder FROM topics WHERE id=?', Number(m[2]));
    fs.writeFileSync(path.resolve(S.ROOT, t.folder, 'concept.md'), '# concept');
    fs.writeFileSync(path.resolve(S.ROOT, t.folder, 'plan.md'), '# plan');
    for (const v of S.sql.all("SELECT id FROM videos WHERE topic_id=? AND stage='ideation'", Number(m[2]))) S.setVideoStage({ video_id: v.id, stage: 'planning', by: 'stub' });
  }
  if (m?.[1] === 'qc') S.setVideoStage({ video_id: m[2], stage: 'ready', by: 'stub' });
  if (m?.[1] === 'rescue') S.resolveEscalation({ video_id: m[2], note: 'stub đã gỡ', by: 'stub' });
  out({ result: `OK ${prompt.trim()}` });
} else {
  const lastMsg = args[args.indexOf('-o') + 1];
  if (mode === 'limit') {
    console.error(process.env.STUB_LIMIT_MSG || "You've hit your usage limit. Upgrade to Plus to continue using Codex, or try again in 2 seconds.");
    process.exit(1);
  }
  if (mode === 'auth') {
    console.error('Not logged in');
    process.exit(1);
  }
  const folder = /Thư mục làm việc của video: (\S+)/.exec(prompt)[1];
  if (mode === 'help') {
    fs.writeFileSync(lastMsg, 'Thiếu nhạc nền.\nNEEDS_HELP: thiếu nhạc nền trong library/music');
    process.exit(0);
  }
  const dir = path.resolve(S.ROOT, folder, 'final');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'video_9x16.mp4'), 'fake');
  fs.writeFileSync(lastMsg, 'Đã dựng xong\nDONE');
}
