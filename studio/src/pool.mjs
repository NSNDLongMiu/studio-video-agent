// Kho tài khoản (Claude / Codex) + hàng đợi việc + trạng thái worker.
// Nguyên tắc: tài khoản được KHAI BÁO rõ (ai sở hữu), khoá/token KHÔNG nằm trong DB.
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as S from './db.mjs';
import { backoffMs } from './limits.mjs';

const { get, all, run, tx, now } = S.sql;
const fail = (m) => {
  throw new S.StudioError(m);
};
const here = path.dirname(fileURLToPath(import.meta.url));

export const PROVIDERS = ['claude', 'codex'];
export const ACCOUNTS_DIR = process.env.STUDIO_ACCOUNTS || path.join(S.ROOT, 'studio', 'accounts');
export const ACTIVE_JOB = ['queued', 'running', 'waiting_limit'];
export const JOB_KINDS = {
  plan: { provider: 'claude', label: 'Ý tưởng → kế hoạch' },
  qc: { provider: 'claude', label: 'QC' },
  rescue: { provider: 'claude', label: 'Gỡ vướng' },
  dept_review: { provider: 'claude', label: 'Rà soát phòng' },
  produce: { provider: 'codex', label: 'Sản xuất' },
};

// ---------- cài đặt ----------
const DEFAULTS = { paid_fallback: 'off', concurrency_claude: '1', concurrency_codex: '1', autostart_worker: 'on', max_rescues_per_video: '2', max_produce_per_video: '4' };
export const getSetting = (key, def) => get('SELECT value FROM settings WHERE key=?', key)?.value ?? def ?? DEFAULTS[key];
export function setSetting(key, value) {
  if (!(key in DEFAULTS)) fail(`Cài đặt không hợp lệ: ${key}. Hợp lệ: ${Object.keys(DEFAULTS).join(', ')}`);
  value = String(value);
  if (key === 'paid_fallback' || key === 'autostart_worker') if (!['on', 'off'].includes(value)) fail(`${key} chỉ nhận on/off`);
  if (/^(concurrency_|max_)/.test(key) && !/^\d{1,2}$/.test(value)) fail(`${key} phải là số nguyên nhỏ`);
  run('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', key, value);
  S.logEvent({ actor: 'director', kind: 'setting', message: `Cài đặt ${key} = ${value}` });
  return { key, value };
}
export const allSettings = () => Object.fromEntries(Object.keys(DEFAULTS).map((k) => [k, getSetting(k)]));

// ---------- tài khoản ----------
const HOME_PS = { claude: 'CLAUDE_CONFIG_DIR', codex: 'CODEX_HOME' };
export function loginCommand(a) {
  const bin = a.provider === 'claude' ? 'claude auth login' : a.kind === 'api_key' ? `Get-Content "<file-chứa-key>" | codex login --with-api-key` : 'codex login';
  if (a.kind === 'api_key' && a.provider === 'claude') return `(không cần đăng nhập — key đọc từ file: ${a.secret_file || '<chưa đặt>'})`;
  return a.home ? `$env:${HOME_PS[a.provider]}='${a.home}'; ${bin}` : bin;
}

/** Thư mục chứa token đăng nhập: gỡ quyền kế thừa, chỉ tài khoản Windows hiện tại được truy cập (ổ E: thường cho mọi người dùng cùng đọc). */
let locked = false;
export function lockDownAccountsDir() {
  if (locked) return;
  locked = true;
  fs.mkdirSync(ACCOUNTS_DIR, { recursive: true });
  if (process.platform !== 'win32' || !process.env.USERNAME) return;
  const r = spawnSync('icacls', [ACCOUNTS_DIR, '/inheritance:r', '/grant:r', `${process.env.USERNAME}:(OI)(CI)F`], { windowsHide: true, encoding: 'utf8' });
  if (r.status !== 0) S.logEvent({ actor: 'system', kind: 'account', message: `Không siết được quyền thư mục tài khoản (${(r.stderr || r.stdout || '').trim().slice(0, 120)}) — hãy tự kiểm tra quyền của ${ACCOUNTS_DIR}` });
}

export function addAccount({ provider, label, owner = '', kind = 'subscription', useDefault = false, secret_file = null, priority = 100, max_runs_per_day = null, ready = false, by = 'director' }) {
  return tx(() => {
    if (!PROVIDERS.includes(provider)) fail(`provider phải là: ${PROVIDERS.join(' | ')}`);
    if (!/^[a-z0-9][a-z0-9-]{0,30}$/.test(label || '')) fail('label chỉ gồm a-z, 0-9, gạch ngang (tối đa 31 ký tự)');
    if (!['subscription', 'api_key'].includes(kind)) fail('kind phải là subscription | api_key');
    if (get('SELECT 1 FROM accounts WHERE provider=? AND label=?', provider, label)) fail(`Tài khoản ${provider}/${label} đã tồn tại`);
    if (provider === 'claude' && kind === 'api_key' && !secret_file) fail('Tài khoản Claude kiểu api_key cần --secret-file <đường-dẫn file chứa key>');
    if (useDefault && kind === 'api_key') fail('Tài khoản mặc định chỉ dành cho đăng nhập gói (subscription)');
    let home = null;
    if (!useDefault) {
      home = path.join(ACCOUNTS_DIR, provider, label);
      lockDownAccountsDir();
      fs.mkdirSync(home, { recursive: true });
      if (provider === 'codex') {
        const cfg = path.join(home, 'config.toml');
        if (!fs.existsSync(cfg)) fs.writeFileSync(cfg, '# Tài khoản Codex riêng — token nằm trong auth.json của thư mục này (không dùng kho khoá hệ điều hành)\ncli_auth_credentials_store = "file"\n', 'utf8');
      }
    }
    // Tài khoản mới (chưa đăng nhập) bắt đầu ở "lỗi đăng nhập" để worker không phí lượt gọi; `accounts login`/`check` sẽ gỡ khi đã đăng nhập.
    const needLogin = !(ready || useDefault || kind === 'api_key');
    const r = run('INSERT INTO accounts(provider,label,owner,kind,home,secret_file,priority,max_runs_per_day,status,last_error,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)', provider, label, owner, kind, home, secret_file, priority, max_runs_per_day, needLogin ? 'auth_error' : 'ready', needLogin ? 'Chưa đăng nhập' : '', now());
    const id = Number(r.lastInsertRowid);
    S.logEvent({ actor: by, kind: 'account', message: `Thêm tài khoản ${provider}/${label}${owner ? ` (của ${owner})` : ''} — ${kind}${useDefault ? ', dùng đăng nhập mặc định của máy' : ''}` });
    return { id, home, login: loginCommand({ provider, kind, home, secret_file }) };
  });
}

export function resolveAccount(ref) {
  const byId = /^\d+$/.test(String(ref)) ? get('SELECT * FROM accounts WHERE id=?', Number(ref)) : null;
  if (byId) return byId;
  const [p, l] = String(ref).includes('/') ? String(ref).split('/') : [null, String(ref)];
  const rows = all('SELECT * FROM accounts WHERE label=? AND (? IS NULL OR provider=?)', l, p, p);
  if (rows.length === 1) return rows[0];
  fail(rows.length ? `"${ref}" trùng nhiều tài khoản — dùng dạng <provider>/<label> hoặc id` : `Không có tài khoản "${ref}"`);
}

export function reviveAccounts() {
  const due = all("SELECT id,provider,label FROM accounts WHERE status='limited' AND limited_until IS NOT NULL AND limited_until<=?", now());
  for (const a of due) {
    run("UPDATE accounts SET status='ready', limited_until=NULL WHERE id=?", a.id);
    S.logEvent({ actor: 'system', kind: 'account', message: `Tài khoản ${a.provider}/${a.label} đã hồi limit — sẵn sàng chạy lại` });
  }
  return due.length;
}

const todayRuns = (a) => (a.runs_day === S.today() ? a.runs_today : 0);
const capped = (a) => a.max_runs_per_day != null && todayRuns(a) >= a.max_runs_per_day;

export function listAccounts() {
  reviveAccounts();
  return all('SELECT * FROM accounts ORDER BY provider, priority, id').map((a) => ({
    id: a.id, provider: a.provider, label: a.label, owner: a.owner, kind: a.kind, home: a.home, secret_file: a.secret_file, priority: a.priority,
    enabled: !!a.enabled, status: !a.enabled ? 'disabled' : a.status, limited_until: a.limited_until, last_limit_raw: a.last_limit_raw, last_error: a.last_error,
    limit_hits: a.limit_hits, runs: a.runs, runs_today: todayRuns(a), max_runs_per_day: a.max_runs_per_day, capped: capped(a), last_used_at: a.last_used_at, last_success_at: a.last_success_at,
    login: loginCommand(a),
  }));
}

/** Chọn tài khoản để chạy: gói (subscription) trước, ưu tiên số nhỏ, rồi cái vừa chạy thành công gần nhất ("dính" cho tới khi hết limit). */
export function pickAccount(provider, { allowPaid = getSetting('paid_fallback') === 'on' } = {}) {
  reviveAccounts();
  const rows = all("SELECT * FROM accounts WHERE provider=? AND enabled=1 AND status='ready'", provider).filter((a) => (a.kind === 'subscription' || allowPaid) && !capped(a));
  rows.sort((a, b) => (a.kind === 'subscription' ? 0 : 1) - (b.kind === 'subscription' ? 0 : 1) || a.priority - b.priority || String(b.last_success_at || '').localeCompare(String(a.last_success_at || '')) || a.id - b.id);
  return rows[0] || null;
}

/** Khi nào sớm nhất có tài khoản dùng được? null = không có cách nào tự hồi (cần người đăng nhập/bật lại). */
export function nextAvailableAt(provider, { allowPaid = getSetting('paid_fallback') === 'on' } = {}) {
  reviveAccounts();
  const rows = all('SELECT * FROM accounts WHERE provider=? AND enabled=1', provider).filter((a) => a.kind === 'subscription' || allowPaid);
  const times = [];
  for (const a of rows) {
    if (a.status === 'limited' && a.limited_until) times.push(Date.parse(a.limited_until));
    else if (a.status === 'ready' && capped(a)) {
      const d = new Date();
      d.setHours(24, 0, 5, 0);
      times.push(d.getTime());
    }
  }
  return times.length ? new Date(Math.min(...times)) : null;
}

export function markUsed(id) {
  const a = get('SELECT runs_day,runs_today FROM accounts WHERE id=?', id);
  const same = a.runs_day === S.today();
  run('UPDATE accounts SET runs=runs+1, runs_today=?, runs_day=?, last_used_at=? WHERE id=?', same ? a.runs_today + 1 : 1, S.today(), now(), id);
}
export function markSuccess(id) {
  run("UPDATE accounts SET status='ready', limited_until=NULL, consecutive_limits=0, last_error='', last_success_at=? WHERE id=?", now(), id);
}
export function markLimited(id, { until = null, raw = '' } = {}) {
  const a = get('SELECT * FROM accounts WHERE id=?', id);
  const n = a.consecutive_limits + 1;
  let t = until ? until.getTime() : Date.now() + backoffMs(n);
  if (until && n >= 3) t = Math.max(t, Date.now() + backoffMs(n)); // hết limit mà thử lại vẫn hết: không tin giờ hồi
  const when = new Date(Math.max(t, Date.now() + Number(process.env.STUDIO_MIN_LIMIT_MS ?? 5000)));
  run("UPDATE accounts SET status='limited', limited_until=?, consecutive_limits=?, limit_hits=limit_hits+1, last_limit_raw=? WHERE id=?", when.toISOString(), n, String(raw).slice(0, 400), id);
  S.logEvent({ actor: 'system', kind: 'account', message: `Tài khoản ${a.provider}/${a.label} HẾT LIMIT — ${until ? 'hồi lúc' : 'chưa rõ giờ hồi, thử lại lúc'} ${when.toLocaleString('vi-VN')}${raw ? ` · "${String(raw).slice(0, 140)}"` : ''}` });
  return when;
}
export function markAuthError(id, msg) {
  const a = get('SELECT provider,label FROM accounts WHERE id=?', id);
  run("UPDATE accounts SET status='auth_error', last_error=? WHERE id=?", String(msg).slice(0, 400), id);
  S.logEvent({ actor: 'system', kind: 'account', message: `Tài khoản ${a.provider}/${a.label} LỖI ĐĂNG NHẬP — cần đăng nhập lại (${String(msg).slice(0, 120)})` });
}
export function setAccountEnabled(ref, enabled) {
  const a = resolveAccount(ref);
  run('UPDATE accounts SET enabled=? WHERE id=?', enabled ? 1 : 0, a.id);
  S.logEvent({ actor: 'director', kind: 'account', message: `${enabled ? 'Bật' : 'Tắt'} tài khoản ${a.provider}/${a.label}` });
  if (enabled) wakeJobs(a.provider);
  return { id: a.id, enabled };
}
export function clearLimit(ref) {
  const a = resolveAccount(ref);
  run("UPDATE accounts SET status='ready', limited_until=NULL, consecutive_limits=0, last_error='' WHERE id=?", a.id);
  S.logEvent({ actor: 'director', kind: 'account', message: `Đánh dấu tài khoản ${a.provider}/${a.label} đã hồi limit / đăng nhập lại (thủ công)` });
  wakeJobs(a.provider);
  return { id: a.id, status: 'ready' };
}
export function removeAccount(ref) {
  const a = resolveAccount(ref);
  if (get("SELECT 1 FROM jobs WHERE account_id=? AND status='running'", a.id)) fail('Tài khoản đang chạy việc — chờ xong hoặc huỷ việc trước');
  run('UPDATE jobs SET account_id=NULL WHERE account_id=?', a.id);
  run('DELETE FROM accounts WHERE id=?', a.id);
  S.logEvent({ actor: 'director', kind: 'account', message: `Gỡ tài khoản ${a.provider}/${a.label} khỏi kho${a.home ? ` (thư mục đăng nhập còn nguyên: ${a.home})` : ''}` });
  return { removed: a.id, home: a.home };
}

// ---------- hàng đợi việc ----------
const PLANNING_LOCK = (k, v) => `${k}:${v}`;
export function enqueueJob({ kind, topic_id, video_id, dept, episodes, rounds, force = false, auto_produce = false, by = 'director' }) {
  return tx(() => {
    const def = JOB_KINDS[kind];
    if (!def) fail(`kind phải là: ${Object.keys(JOB_KINDS).join(' | ')}`);
    let title;
    let lock;
    let payload = {};
    let d = dept || null;
    let t = null;
    let v = null;
    if (kind === 'plan') {
      const topic = get('SELECT * FROM topics WHERE id=?', Number(topic_id));
      if (!topic) fail(`Không có chủ đề #${topic_id}`);
      const dp = get('SELECT status FROM departments WHERE slug=?', topic.dept);
      if (dp.status !== 'active') fail(`Phòng "${topic.dept}" đang đóng`);
      t = topic.id;
      d = topic.dept;
      title = `Ý tưởng → kế hoạch: ${topic.text.slice(0, 70)}`;
      lock = PLANNING_LOCK('topic', t);
      payload = { episodes: Number(episodes) || 1, rounds: Math.min(4, Number(rounds) || 2), auto_produce: !!auto_produce };
    } else if (kind === 'dept_review') {
      if (!get('SELECT 1 FROM departments WHERE slug=?', dept)) fail(`Không có phòng "${dept}"`);
      title = `Rà soát năng lực phòng ${dept}`;
      lock = PLANNING_LOCK('dept', dept);
    } else {
      const vid = S.getVideo(video_id); // ném lỗi nếu không có
      v = vid.id;
      d = vid.dept;
      t = vid.topic_id;
      title = `${def.label} ${vid.id}`;
      lock = kind === 'produce' ? PLANNING_LOCK(`team${vid.team_id}`, 'producer') : PLANNING_LOCK('video', vid.id);
      payload = kind === 'produce' ? { force: !!force } : {};
    }
    // Chống trùng: cùng loại việc + cùng đối tượng đang chờ/chạy thì không xếp thêm.
    const [col, val] = kind === 'plan' ? ['topic_id', t] : kind === 'dept_review' ? ['dept', d] : ['video_id', v];
    const dup = get(`SELECT id,status FROM jobs WHERE kind=? AND ${col}=? AND status IN ('queued','running','waiting_limit')`, kind, val);
    if (dup) return { job_id: dup.id, deduped: true, status: dup.status };
    const r = run('INSERT INTO jobs(kind,provider,title,dept,topic_id,video_id,payload,lock_key,next_run_at,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', kind, def.provider, title, d, t, v, JSON.stringify(payload), lock, now(), by, now(), now());
    const id = Number(r.lastInsertRowid);
    S.logEvent({ actor: by, dept: d, video_id: v, kind: 'job', message: `Xếp hàng việc #${id}: ${title}` });
    return { job_id: id, deduped: false, status: 'queued' };
  });
}

const parseJob = (j) => (j ? { ...j, payload: JSON.parse(j.payload || '{}'), cancel_requested: !!j.cancel_requested } : j);
export const getJob = (id) => parseJob(get('SELECT * FROM jobs WHERE id=?', Number(id)));
export function listJobs({ status, kind, video_id, limit = 60 } = {}) {
  const w = [];
  const p = [];
  if (status) (w.push('status=?'), p.push(status));
  if (kind) (w.push('kind=?'), p.push(kind));
  if (video_id) (w.push('video_id=?'), p.push(video_id));
  return all(`SELECT * FROM jobs ${w.length ? 'WHERE ' + w.join(' AND ') : ''} ORDER BY (status IN ('running','waiting_limit','queued','needs_human')) DESC, id DESC LIMIT ?`, ...p, limit).map(parseJob);
}
export function setJob(id, fields) {
  const keys = Object.keys(fields);
  run(`UPDATE jobs SET ${keys.map((k) => `${k}=?`).join(',')}, updated_at=? WHERE id=?`, ...keys.map((k) => (typeof fields[k] === 'boolean' ? Number(fields[k]) : fields[k])), now(), id);
}
export function cancelJob(id, by = 'director') {
  const j = getJob(id);
  if (!j) fail(`Không có việc #${id}`);
  if (j.status === 'running') {
    setJob(j.id, { cancel_requested: true });
    S.logEvent({ actor: by, dept: j.dept, video_id: j.video_id, kind: 'job', message: `Yêu cầu huỷ việc #${j.id} đang chạy` });
    return { job_id: j.id, status: 'cancelling' };
  }
  if (!['queued', 'waiting_limit', 'needs_human', 'failed'].includes(j.status)) fail(`Việc #${id} đã ${j.status}`);
  setJob(j.id, { status: 'cancelled', finished_at: now(), wait_reason: '' });
  S.logEvent({ actor: by, dept: j.dept, video_id: j.video_id, kind: 'job', message: `Huỷ việc #${j.id}: ${j.title}` });
  return { job_id: j.id, status: 'cancelled' };
}
export function retryJob(id, by = 'director') {
  const j = getJob(id);
  if (!j) fail(`Không có việc #${id}`);
  if (!['failed', 'needs_human', 'cancelled'].includes(j.status)) fail(`Việc #${id} đang ${j.status} — không cần chạy lại`);
  setJob(j.id, { status: 'queued', attempts: 0, next_run_at: now(), last_error: '', wait_reason: '', finished_at: null, cancel_requested: false });
  S.logEvent({ actor: by, dept: j.dept, video_id: j.video_id, kind: 'job', message: `Chạy lại việc #${j.id}: ${j.title}` });
  return { job_id: j.id, status: 'queued' };
}
/** Có tài khoản mới/được bật/được gỡ limit => cho các việc đang chờ chạy ngay. */
export function wakeJobs(provider) {
  run("UPDATE jobs SET status='queued', wait_reason='', next_run_at=?, updated_at=? WHERE status='waiting_limit' AND provider=?", now(), now(), provider);
}

// ---------- worker ----------
export function workerState() {
  const w = get('SELECT * FROM worker WHERE id=1');
  if (!w) return { alive: false, pid: null };
  const age = Date.now() - Date.parse(w.heartbeat_at || 0);
  let pidOk = true;
  try {
    process.kill(w.pid, 0);
  } catch (e) {
    pidOk = e.code === 'EPERM';
  }
  return { alive: age < Math.max(15_000, 3 * (w.tick_ms || 5000)) && pidOk, pid: w.pid, heartbeat_at: w.heartbeat_at, started_at: w.started_at, running: w.running, stop_requested: !!w.stop_requested, age_ms: age };
}
export function ensureWorker() {
  if (workerState().alive) return { started: false, alive: true };
  if (getSetting('autostart_worker') !== 'on' || process.env.STUDIO_NO_AUTOSTART === '1') return { started: false, alive: false, note: 'autostart tắt — chạy "npm run start --prefix studio" hoặc "npm run worker --prefix studio"' };
  const child = spawn(process.execPath, ['--disable-warning=ExperimentalWarning', path.join(here, 'cli.mjs'), 'worker'], { detached: true, stdio: 'ignore', windowsHide: true, cwd: S.ROOT, env: process.env });
  child.unref();
  S.logEvent({ actor: 'system', kind: 'worker', message: `Tự khởi động worker nền (pid ${child.pid})` });
  return { started: true, pid: child.pid };
}

// ---------- tổng quan ----------
export function poolOverview() {
  reviveAccounts();
  const accounts = listAccounts();
  const jobs = listJobs({ limit: 40 });
  const worker = workerState();
  const attention = [];
  const active = jobs.filter((j) => ACTIVE_JOB.includes(j.status));
  const waiting = jobs.filter((j) => j.status === 'waiting_limit');

  if (active.length && !worker.alive) attention.push({ kind: 'worker', message: `Có ${active.length} việc đang chờ nhưng WORKER KHÔNG CHẠY — bật bằng "npm run start --prefix studio"` });
  for (const p of PROVIDERS) {
    const w = waiting.filter((j) => j.provider === p);
    if (!w.length) continue;
    const noAcc = w.filter((j) => j.wait_reason === 'no_account');
    const lim = w.filter((j) => j.wait_reason !== 'no_account');
    if (noAcc.length) attention.push({ kind: 'no_account', provider: p, message: `${noAcc.length} việc ${p} đang chờ vì KHÔNG có tài khoản ${p} dùng được — thêm/đăng nhập/bật tài khoản (bảng "Tài khoản")` });
    if (lim.length) {
      const until = lim.map((j) => j.next_run_at).sort()[0];
      attention.push({ kind: 'limit_wait', provider: p, until, message: `${lim.length} việc ${p} đang chờ hồi limit (tất cả tài khoản ${p} đều hết)` });
    }
  }
  for (const j of jobs.filter((x) => x.status === 'needs_human')) attention.push({ kind: 'job_human', job_id: j.id, message: `Việc #${j.id} "${j.title}" cần người xử lý: ${j.last_error}` });
  for (const a of accounts.filter((x) => x.enabled && x.status === 'auth_error')) attention.push({ kind: 'auth', message: `Tài khoản ${a.provider}/${a.label} lỗi đăng nhập — chạy: ${a.login}` });

  // Kế hoạch đã xong, chờ giám đốc duyệt để sản xuất (không có việc produce đang chờ/chạy).
  const planning = all("SELECT v.id, v.dept, v.title, t.folder FROM videos v JOIN topics t ON t.id=v.topic_id WHERE v.stage='planning'");
  for (const v of planning) {
    if (!v.folder || !fs.existsSync(path.resolve(S.ROOT, v.folder, 'plan.md'))) continue;
    if (get("SELECT 1 FROM jobs WHERE kind='produce' AND video_id=? AND status IN ('queued','running','waiting_limit')", v.id)) continue;
    attention.push({ kind: 'approve_produce', video_id: v.id, dept: v.dept, message: `Kế hoạch ${v.id} đã sẵn sàng — chờ bạn duyệt để Codex sản xuất` });
  }

  const sum = (p) => ({ total: accounts.filter((a) => a.provider === p).length, ready: accounts.filter((a) => a.provider === p && a.enabled && a.status === 'ready' && !a.capped).length, limited: accounts.filter((a) => a.provider === p && a.status === 'limited').length });
  return {
    accounts, jobs, worker, settings: allSettings(), attention,
    summary: { claude: sum('claude'), codex: sum('codex'), jobs_running: jobs.filter((j) => j.status === 'running').length, jobs_waiting: waiting.length, jobs_queued: jobs.filter((j) => j.status === 'queued').length, jobs_human: jobs.filter((j) => j.status === 'needs_human').length },
  };
}
