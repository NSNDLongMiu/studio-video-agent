// Kho tài khoản (Claude / Codex / Gemini) + hàng đợi việc + trạng thái worker.
// Nguyên tắc: tài khoản được KHAI BÁO rõ (ai sở hữu), khoá/token KHÔNG nằm trong DB.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as S from './db.mjs';
import { backoffMs, classifyFailure } from './limits.mjs';
import { agyHome, agyExePath, parseAgyEmail } from './agy.mjs';

const { get, all, run, tx, now } = S.sql;
const fail = (m) => {
  throw new S.StudioError(m);
};
const here = path.dirname(fileURLToPath(import.meta.url));

// Gemini (agy) không có hàng đợi việc riêng: Claude điều phối và gọi nó qua studio/src/gemini-run.mjs (như codex-write.mjs của Codex).
export const PROVIDERS = ['claude', 'codex', 'gemini'];
export const PROVIDER_NAME = { claude: 'Claude', codex: 'Codex', gemini: 'Gemini' };
export const ACCOUNTS_DIR = process.env.STUDIO_ACCOUNTS || path.join(S.ROOT, 'studio', 'accounts');
export const ACTIVE_JOB = ['queued', 'running', 'waiting_limit'];
export const JOB_KINDS = {
  plan: { provider: 'claude', label: 'Ý tưởng → kế hoạch' },
  qc: { provider: 'claude', label: 'QC' },
  rescue: { provider: 'claude', label: 'Gỡ vướng' },
  dept_review: { provider: 'claude', label: 'Rà soát phòng' },
  scout: { provider: 'claude', label: 'Tìm chủ đề' },
  produce: { provider: 'codex', label: 'Sản xuất' },
};

// ---------- email đăng nhập (để giám đốc biết ghế nào gắn với tài khoản thật nào) ----------
// Đọc từ file đăng nhập mà Claude/Codex tự ghi (không gọi mạng, không tốn hạn mức); cache theo mtime nên rẻ.
//  - Claude: <thư mục ghế>/.claude.json (ghế mặc định: ~/.claude.json) → oauthAccount.emailAddress
//  - Codex:  <thư mục ghế hoặc ~/.codex>/auth.json → tokens.id_token (JWT) → email
const emailCache = new Map();
function cachedRead(file, parse) {
  try {
    const m = fs.statSync(file).mtimeMs;
    const c = emailCache.get(file);
    if (c && c.m === m) return c.v;
    let v = null;
    try {
      v = parse(fs.readFileSync(file, 'utf8')) || null;
    } catch {
      v = null;
    }
    emailCache.set(file, { m, v });
    return v;
  } catch {
    return null;
  }
}
let lastAgyEmail = null; // log của agy có thể bị xoay vòng; nhớ email đã thấy để bảng không đột ngột trống
export function accountEmail(a) {
  if (a.kind === 'api_key') return null;
  if (a.provider === 'gemini') {
    const e = cachedRead(path.join(agyHome(), 'cli.log'), parseAgyEmail);
    if (e) lastAgyEmail = e;
    return e || lastAgyEmail;
  }
  if (a.provider === 'claude') return cachedRead(a.home ? path.join(a.home, '.claude.json') : path.join(os.homedir(), '.claude.json'), (t) => JSON.parse(t).oauthAccount?.emailAddress);
  return cachedRead(path.join(a.home || path.join(os.homedir(), '.codex'), 'auth.json'), (t) => {
    const part = JSON.parse(t).tokens?.id_token?.split('.')[1];
    return part ? JSON.parse(Buffer.from(part, 'base64url').toString('utf8')).email : null;
  });
}
/** Tên cho người đọc: "Claude <email> [ghế b]". Nhãn ghế chỉ để phân biệt 2 ghế cùng email. */
export const accountPerson = (a) => `${PROVIDER_NAME[a.provider] || a.provider} ${accountEmail(a) || '(chưa đăng nhập)'} [ghế ${a.label}]`;

// ---------- cài đặt ----------
const DEFAULTS = { paid_fallback: 'off', concurrency_claude: '1', concurrency_codex: '1', concurrency_gemini: '1', autostart_worker: 'on', auto_produce: 'on', max_rescues_per_video: '4', max_produce_per_video: '9', scout_slots: '08:00,13:00', scout_per_run: '5', max_pending_topics: '15' };
export const getSetting = (key, def) => get('SELECT value FROM settings WHERE key=?', key)?.value ?? def ?? DEFAULTS[key];
export function setSetting(key, value) {
  if (!(key in DEFAULTS)) fail(`Cài đặt không hợp lệ: ${key}. Hợp lệ: ${Object.keys(DEFAULTS).join(', ')}`);
  value = String(value);
  if (key === 'paid_fallback' || key === 'autostart_worker' || key === 'auto_produce') if (!['on', 'off'].includes(value)) fail(`${key} chỉ nhận on/off`);
  if (/^(concurrency_|max_)/.test(key) && !/^\d{1,2}$/.test(value)) fail(`${key} phải là số nguyên nhỏ`);
  if (key === 'scout_slots' && !(/^([01]\d|2[0-3]):[0-5]\d(,([01]\d|2[0-3]):[0-5]\d)*$/.test(value) && value.split(',').length <= 6)) fail('scout_slots là các giờ HH:MM cách nhau bằng dấu phẩy, tối đa 6 giờ (vd 08:00,13:00)');
  if (key === 'scout_per_run' && !(/^\d{1,2}$/.test(value) && Number(value) >= 1 && Number(value) <= 10)) fail('scout_per_run phải từ 1 đến 10');
  run('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', key, value);
  S.logEvent({ actor: 'director', kind: 'setting', message: `Cài đặt ${key} = ${value}` });
  return { key, value };
}
export const allSettings = () => Object.fromEntries(Object.keys(DEFAULTS).map((k) => [k, getSetting(k)]));

// ---------- tài khoản ----------
const HOME_PS = { claude: 'CLAUDE_CONFIG_DIR', codex: 'CODEX_HOME' };
export function loginCommand(a) {
  // agy không có biến đổi thư mục đăng nhập: chạy thẳng, chọn "1. Google OAuth", đăng nhập bằng trình duyệt rồi dán mã.
  if (a.provider === 'gemini') return `& "${agyExePath()}"   # chọn 1. Google OAuth, đăng nhập đúng tài khoản Google AI Pro`;
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
    if (provider === 'gemini') {
      if (kind === 'api_key') fail('Gemini chỉ nhận đăng nhập gói Google AI Pro; khoá API Gemini tính phí theo lượt nên bị cấm (CLAUDE.md luật 8)');
      if (get("SELECT 1 FROM accounts WHERE provider='gemini'")) fail('agy chỉ giữ MỘT đăng nhập trên máy này nên kho chỉ có 1 ghế gemini');
      useDefault = true; // không có thư mục đăng nhập riêng cho từng ghế
    }
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
  if (String(ref).includes('@')) {
    // Gọi bằng email: "anh@x.vn" hoặc "claude/anh@x.vn" (nhiều ghế cùng email thì phải dùng nhãn ghế/id)
    const [pp, em] = /^(claude|codex|gemini)\//.test(String(ref)) ? String(ref).split(/\/(.*)/s) : [null, String(ref)];
    const hits = all('SELECT * FROM accounts WHERE (? IS NULL OR provider=?)', pp, pp).filter((a) => (accountEmail(a) || '').toLowerCase() === em.toLowerCase());
    if (hits.length === 1) return hits[0];
    fail(hits.length ? `Email "${em}" đang đăng nhập ở ${hits.length} ghế (${hits.map((a) => `${a.provider}/${a.label}`).join(', ')}) — dùng <provider>/<nhãn ghế> hoặc id` : `Không có ghế nào đăng nhập bằng "${em}"`);
  }
  const [p, l] = String(ref).includes('/') ? String(ref).split('/') : [null, String(ref)];
  const rows = all('SELECT * FROM accounts WHERE label=? AND (? IS NULL OR provider=?)', l, p, p);
  if (rows.length === 1) return rows[0];
  fail(rows.length ? `"${ref}" trùng nhiều tài khoản — dùng dạng <provider>/<label> hoặc id` : `Không có tài khoản "${ref}"`);
}

export function reviveAccounts() {
  const due = all("SELECT id,provider,label FROM accounts WHERE status='limited' AND limited_until IS NOT NULL AND limited_until<=?", now());
  for (const a of due) {
    run("UPDATE accounts SET status='ready', limited_until=NULL WHERE id=?", a.id);
    S.logEvent({ actor: 'system', kind: 'account', message: `Tài khoản ${accountPerson(a)} đã hồi limit — sẵn sàng chạy lại` });
  }
  return due.length;
}

const todayRuns = (a) => (a.runs_day === S.today() ? a.runs_today : 0);
const capped = (a) => a.max_runs_per_day != null && todayRuns(a) >= a.max_runs_per_day;

/** Phòng của từng tài khoản (một tài khoản có thể cấp cho NHIỀU phòng — giám đốc chốt 21/11/2026): Map id → ['it', 'bong-da']. */
const deptMap = () => {
  const m = new Map();
  for (const r of all('SELECT account_id, dept FROM account_depts ORDER BY dept')) m.set(r.account_id, [...(m.get(r.account_id) || []), r.dept]);
  return m;
};
export function listAccounts() {
  reviveAccounts();
  const dm = deptMap();
  return all('SELECT * FROM accounts ORDER BY provider, priority, id').map((a) => ({
    id: a.id, provider: a.provider, label: a.label, email: accountEmail(a), person: accountPerson(a), owner: a.owner, depts: dm.get(a.id) || [], dept: dm.get(a.id)?.[0] || null, kind: a.kind, home: a.home, secret_file: a.secret_file, priority: a.priority,
    enabled: !!a.enabled, status: !a.enabled ? 'disabled' : a.status, limited_until: a.limited_until, last_limit_raw: a.last_limit_raw, last_error: a.last_error,
    limit_hits: a.limit_hits, runs: a.runs, runs_today: todayRuns(a), max_runs_per_day: a.max_runs_per_day, capped: capped(a), last_used_at: a.last_used_at, last_success_at: a.last_success_at,
    login: loginCommand(a),
  }));
}

/** Chọn tài khoản để chạy: gói (subscription) trước, ưu tiên số nhỏ, rồi cái vừa chạy thành công gần nhất ("dính" cho tới khi hết limit). */
/** Luật cấp tài khoản theo phòng (giám đốc chốt 18/11/2026):
 *  - phòng đã được cấp ≥1 tài khoản <provider> (kể cả đang tắt/hết limit) → việc của phòng CHỈ chạy bằng tài khoản của phòng;
 *  - phòng chưa được cấp (hoặc việc không thuộc phòng nào) → chỉ dùng tài khoản dùng chung (chưa cấp cho ai);
 *  - tài khoản đã cấp cho phòng này không bao giờ bị phòng khác mượn;
 *  - (21/11/2026) MỘT tài khoản được cấp cho NHIỀU phòng: tính là của mỗi phòng đó, các phòng được cấp cùng dùng chung hạn mức của nó. */
export function eligibleFor(rows, provider, dept) {
  const dm = deptMap();
  const has = (a, d) => (dm.get(a.id) || []).includes(d);
  const own = dept && all('SELECT id FROM accounts WHERE provider=?', provider).some((a) => has(a, dept));
  return rows.filter((a) => (own ? has(a, dept) : !(dm.get(a.id) || []).length));
}

export function pickAccount(provider, { allowPaid = getSetting('paid_fallback') === 'on', dept = null } = {}) {
  reviveAccounts();
  const rows = eligibleFor(all("SELECT * FROM accounts WHERE provider=? AND enabled=1 AND status='ready'", provider), provider, dept).filter((a) => (a.kind === 'subscription' || allowPaid) && !capped(a));
  rows.sort((a, b) => (a.kind === 'subscription' ? 0 : 1) - (b.kind === 'subscription' ? 0 : 1) || a.priority - b.priority || String(b.last_success_at || '').localeCompare(String(a.last_success_at || '')) || a.id - b.id);
  return rows[0] || null;
}

/** Khi nào sớm nhất có tài khoản dùng được? null = không có cách nào tự hồi (cần người đăng nhập/bật lại). */
export function nextAvailableAt(provider, { allowPaid = getSetting('paid_fallback') === 'on', dept = null } = {}) {
  reviveAccounts();
  const rows = eligibleFor(all('SELECT * FROM accounts WHERE provider=? AND enabled=1', provider), provider, dept).filter((a) => a.kind === 'subscription' || allowPaid);
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
  S.logEvent({ actor: 'system', kind: 'account', message: `Tài khoản ${accountPerson(a)} HẾT LIMIT — ${until ? 'hồi lúc' : 'chưa rõ giờ hồi, thử lại lúc'} ${when.toLocaleString('vi-VN')}${raw ? ` · "${String(raw).slice(0, 140)}"` : ''}` });
  return when;
}
export function markAuthError(id, msg) {
  const a = get('SELECT provider,label FROM accounts WHERE id=?', id);
  run("UPDATE accounts SET status='auth_error', last_error=? WHERE id=?", String(msg).slice(0, 400), id);
  S.logEvent({ actor: 'system', kind: 'account', message: `Tài khoản ${accountPerson(a)} LỖI ĐĂNG NHẬP — cần đăng nhập lại (${String(msg).slice(0, 120)})` });
}
/** Đổi tên chủ tài khoản (chỉ là nhãn khai báo "ghế của ai"; không đụng tới đăng nhập). Chỉ theo lệnh giám đốc. */
export function setAccountOwner(ref, owner, by = 'director') {
  const a = resolveAccount(ref);
  const name = String(owner || '').trim();
  if (!name) fail('Cần nhập tên chủ tài khoản');
  run('UPDATE accounts SET owner=? WHERE id=?', name, a.id);
  S.logEvent({ actor: by, kind: 'account', message: `Đặt chủ tài khoản ${accountPerson(a)}: "${a.owner || '(chưa có)'}" → "${name}"` });
  return { id: a.id, owner: name };
}
/** Đọc yêu cầu cấp phòng: "it,bong-da" (đặt đúng danh sách này), "+bong-da" / "-it" (thêm/bớt từ danh sách hiện tại), "none"/rỗng/null (trả về dùng chung). Nhận cả mảng. */
export function parseDeptSpec(spec, current = []) {
  // Cả chuỗi lẫn mảng đối số dòng lệnh đều tách theo dấu phẩy/chấm phẩy/khoảng trắng (CLI truyền ["it,bong-da"]).
  const tokens = (Array.isArray(spec) ? spec : [spec ?? '']).flatMap((t) => String(t).split(/[\s,;]+/)).map((t) => t.trim()).filter(Boolean);
  if (!tokens.length || (tokens.length === 1 && tokens[0].toLowerCase() === 'none')) return [];
  if (tokens.some((t) => t.toLowerCase() === 'none')) fail('"none" không đi cùng mã phòng khác');
  const incremental = tokens.some((t) => /^[+-]/.test(t));
  if (incremental && tokens.some((t) => !/^[+-]/.test(t))) fail('Không trộn "+phòng"/"-phòng" với danh sách đặt đúng: dùng một trong hai kiểu');
  const set = new Set(incremental ? current : []);
  for (const t of tokens) {
    if (t.startsWith('-')) set.delete(t.slice(1));
    else set.add(t.replace(/^\+/, ''));
  }
  return [...set].sort();
}
/** Cấp tài khoản cho một hoặc NHIỀU phòng (giám đốc chốt 21/11/2026; "none" → trả về dùng chung). Chỉ theo lệnh giám đốc. */
export function assignAccount(ref, spec, by = 'director') {
  const a = resolveAccount(ref);
  const before = all('SELECT dept FROM account_depts WHERE account_id=? ORDER BY dept', a.id).map((r) => r.dept);
  const depts = parseDeptSpec(spec, before);
  for (const slug of depts) if (!get('SELECT 1 FROM departments WHERE slug=?', slug)) fail(`Không có phòng "${slug}"`);
  tx(() => {
    run('DELETE FROM account_depts WHERE account_id=?', a.id);
    for (const slug of depts) run('INSERT INTO account_depts(account_id, dept) VALUES(?,?)', a.id, slug);
    run('UPDATE accounts SET dept=? WHERE id=?', depts[0] || null, a.id); // bản sao cho mã cũ đọc cột dept
  });
  S.logEvent({ actor: by, dept: depts[0] || null, kind: 'account', message: depts.length ? `Cấp tài khoản ${a.provider}/${a.label} cho phòng ${depts.map((d) => `"${d}"`).join(', ')} (${depts.length > 1 ? 'các phòng này cùng dùng chung hạn mức của nó' : 'chỉ phòng này dùng'}, có Văn phòng 2D theo phòng)` : `Trả tài khoản ${a.provider}/${a.label} về dùng chung (không theo dõi trên Văn phòng 2D)` });
  wakeJobs(a.provider);
  return { id: a.id, account: `${a.provider}/${a.label}`, person: accountPerson(a), depts, dept: depts[0] || null, before };
}

export function setAccountEnabled(ref, enabled) {
  const a = resolveAccount(ref);
  run('UPDATE accounts SET enabled=? WHERE id=?', enabled ? 1 : 0, a.id);
  S.logEvent({ actor: 'director', kind: 'account', message: `${enabled ? 'Bật' : 'Tắt'} tài khoản ${accountPerson(a)}` });
  if (enabled) wakeJobs(a.provider);
  return { id: a.id, enabled };
}
export function clearLimit(ref) {
  const a = resolveAccount(ref);
  run("UPDATE accounts SET status='ready', limited_until=NULL, consecutive_limits=0, last_error='' WHERE id=?", a.id);
  S.logEvent({ actor: 'director', kind: 'account', message: `Đánh dấu tài khoản ${accountPerson(a)} đã hồi limit / đăng nhập lại (thủ công)` });
  wakeJobs(a.provider);
  return { id: a.id, status: 'ready' };
}
export function removeAccount(ref) {
  const a = resolveAccount(ref);
  if (get("SELECT 1 FROM jobs WHERE account_id=? AND status='running'", a.id)) fail('Tài khoản đang chạy việc — chờ xong hoặc huỷ việc trước');
  run('UPDATE jobs SET account_id=NULL WHERE account_id=?', a.id);
  run('DELETE FROM account_depts WHERE account_id=?', a.id);
  run('DELETE FROM accounts WHERE id=?', a.id);
  S.logEvent({ actor: 'director', kind: 'account', message: `Gỡ tài khoản ${accountPerson(a)} khỏi kho${a.home ? ` (thư mục đăng nhập còn nguyên: ${a.home})` : ''}` });
  return { removed: a.id, home: a.home };
}

// ---------- hàng đợi việc ----------
const PLANNING_LOCK = (k, v) => `${k}:${v}`;
export function enqueueJob({ kind, topic_id, video_id, dept, team_id, episodes, rounds, force = false, auto_produce, slot, by = 'director' }) {
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
      payload = { episodes: Number(episodes) || 1, rounds: Math.min(4, Number(rounds) || 2), auto_produce: auto_produce == null ? getSetting('auto_produce') === 'on' : !!auto_produce };
    } else if (kind === 'scout') {
      const team = get("SELECT t.*, d.auto_topics, d.status dstatus FROM teams t JOIN departments d ON d.slug=t.dept WHERE t.id=?", Number(team_id));
      if (!team || team.status !== 'active') fail(`Không có đội #${team_id} đang hoạt động`);
      if (team.dstatus !== 'active') fail(`Phòng "${team.dept}" đang đóng`);
      if (!team.auto_topics) fail(`Phòng "${team.dept}" đang TẮT tự tìm chủ đề`);
      d = team.dept;
      title = `Tìm chủ đề cho ${team.name}${slot ? ` (${slot.label})` : ''}`;
      lock = PLANNING_LOCK(`team${team.id}`, 'scout');
      // slot = khung giờ của phòng (xem scoutDueSlots): key để không chạy lặp, per_run = số đề xuất cần có ở lượt này.
      payload = { team_id: team.id, ...(slot ? { slot_key: slot.key, slot: slot.label, per_run: slot.per_run } : {}) };
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
    const [col, val] = kind === 'plan' ? ['topic_id', t] : kind === 'dept_review' ? ['dept', d] : kind === 'scout' ? ['lock_key', lock] : ['video_id', v];
    const dup = get(`SELECT id,status FROM jobs WHERE kind=? AND ${col}=? AND status IN ('queued','running','waiting_limit')`, kind, val);
    if (dup) return { job_id: dup.id, deduped: true, status: dup.status };
    const r = run('INSERT INTO jobs(kind,provider,title,dept,topic_id,video_id,payload,lock_key,next_run_at,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', kind, def.provider, title, d, t, v, JSON.stringify(payload), lock, now(), by, now(), now());
    const id = Number(r.lastInsertRowid);
    S.logEvent({ actor: by, dept: d, video_id: v, kind: 'job', message: `Xếp hàng việc #${id}: ${title}` });
    return { job_id: id, deduped: false, status: 'queued' };
  });
}

/** Giám đốc DUYỆT chủ đề do phòng đề xuất: chủ đề thành việc làm, giao NGAY cho đội đang rảnh nhất (lần lượt, xem S.pickTeamForTopic) và xếp việc kế hoạch. */
export function approveTopic({ topic_id, note = '', by = 'director' }) {
  const tp = get('SELECT * FROM topics WHERE id=?', Number(topic_id));
  if (!tp) fail(`Không có chủ đề #${topic_id}`);
  if (tp.status === 'proposed' && !S.pickTeamForTopic(tp.dept)) fail(`Phòng "${tp.dept}" chưa có đội nào đang hoạt động — chưa duyệt chủ đề #${tp.id} (cần thêm đội trước)`);
  const r = S.decideTopic({ topic_id, approve: true, note, by });
  const a = S.assignTopic({ topic_id: r.topic_id, by });
  const job = enqueueJob({ kind: 'plan', topic_id: r.topic_id, by });
  return { ...r, team_id: a.team_id, team: a.team, videos: a.videos, over_capacity: a.over_capacity, job };
}

const parseJob = (j) => (j ? { ...j, payload: JSON.parse(j.payload || '{}'), cancel_requested: !!j.cancel_requested } : j);
// ---------- tìm chủ đề theo giờ của phòng (giám đốc chốt 21/11/2026) ----------
// Mỗi phòng BẬT tự tìm chủ đề được xếp 1 việc "Tìm chủ đề" ở mỗi khung giờ (mặc định 08:00 và 13:00 giờ máy), mỗi lượt ~5 đề xuất gửi lên "Chủ đề chờ duyệt".
// Quy trình nhiều AI (Claude điều phối/chốt, Gemini tìm, Codex đề xuất độc lập + phản biện) nằm ở .claude/skills/scout-topics/SKILL.md.
export const SCOUT_SLOT_GRACE_H = 5; // khung giờ còn hiệu lực 5 giờ kể từ giờ bắt đầu (máy bật muộn vẫn chạy bù, qua hạn thì bỏ)
export const scoutSlots = () => [...new Set(String(getSetting('scout_slots')).split(',').map((s) => s.trim()).filter((s) => /^([01]\d|2[0-3]):[0-5]\d$/.test(s)))].sort();
export const scoutPerRun = () => Math.min(10, Math.max(1, Number(getSetting('scout_per_run')) || 5));
const localDay = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
/** Khung giờ ĐẾN HẠN của 1 phòng lúc `now`: đã qua giờ bắt đầu, chưa quá hạn 5 giờ, chưa có việc cho khung đó (mọi trạng thái trừ đã huỷ), và chưa có sẵn
 *  ≥ per_run đề xuất của đội tạo từ lúc khung bắt đầu (trường hợp thư ký làm tay lượt đó). Chỉ trả khung MUỘN nhất để không chạy dồn hai lượt. */
export function scoutDueSlots(dept, now = new Date()) {
  const perRun = scoutPerRun();
  const room = Math.max(0, S.maxPendingTopics() - S.pendingTopics(dept));
  const due = [];
  for (const hhmm of scoutSlots()) {
    const [h, m] = hhmm.split(':').map(Number);
    const start = new Date(now);
    start.setHours(h, m, 0, 0);
    if (now < start || now - start >= SCOUT_SLOT_GRACE_H * 3_600_000) continue;
    const key = `${localDay(now)}T${hhmm}`;
    if (get("SELECT 1 FROM jobs WHERE kind='scout' AND dept=? AND status!='cancelled' AND json_extract(payload,'$.slot_key')=?", dept, key)) continue;
    if (get("SELECT COUNT(*) c FROM topics WHERE dept=? AND source='agent' AND created_at>=?", dept, start.toISOString()).c >= perRun) continue;
    due.push({ key, label: hhmm, per_run: Math.min(perRun, room) });
  }
  return due.slice(-1);
}
/** Worker gọi mỗi vòng. Phòng TẮT tự tìm chủ đề → không bao giờ xếp. Hết chỗ chờ duyệt (trần `max_pending_topics`) → bỏ lượt này. */
export function autoScout({ now = new Date() } = {}) {
  const out = [];
  for (const d of all("SELECT slug FROM departments WHERE status='active' AND auto_topics=1")) {
    const [slot] = scoutDueSlots(d.slug, now);
    if (!slot || slot.per_run < 1) continue;
    const team = S.pickScoutTeam(d.slug);
    if (!team) continue;
    out.push(enqueueJob({ kind: 'scout', team_id: team.id, slot, by: 'system' }));
  }
  return out;
}
/** Chạy lượt tìm chủ đề NGAY cho 1 phòng (giám đốc/thư ký gọi tay: `cli scout <phòng>`), không phụ thuộc khung giờ. */
export function enqueueScoutNow(dept, { by = 'director' } = {}) {
  const d = get("SELECT * FROM departments WHERE slug=? AND status='active'", dept);
  if (!d) fail(`Không có phòng đang mở "${dept}"`);
  if (!d.auto_topics) fail(`Phòng "${d.name}" đang TẮT tự tìm chủ đề`);
  const team = S.pickScoutTeam(dept);
  if (!team) fail(`Phòng "${d.name}" chưa có đội nào`);
  const room = Math.max(0, S.maxPendingTopics() - S.pendingTopics(dept));
  if (room < 1) fail(`Phòng "${d.name}" đã đủ ${S.maxPendingTopics()} đề xuất chờ duyệt — duyệt hoặc từ chối bớt rồi chạy lại`);
  return enqueueJob({ kind: 'scout', team_id: team.id, slot: { key: `manual-${Date.now()}`, label: 'chạy tay', per_run: Math.min(scoutPerRun(), room) }, by });
}

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
  run("UPDATE jobs SET status='queued', wait_reason='', next_run_at=?, updated_at=? WHERE status='waiting_limit' AND (provider=? OR (?='codex' AND wait_reason='codex'))", now(), now(), provider, provider);
}

// ---------- giám đốc duyệt cho AI khác làm thay (giám đốc yêu cầu 21/11/2026) ----------
// Luật 6 cấm Claude viết thay Codex ở Đạo diễn hình ảnh (việc dừng chờ Codex). Khi Codex hỏng/hết limit lâu thì giám đốc có thể
// DUYỆT từng việc cho AI khác làm thay; mặc định không có ngoại lệ nào, và việc nền không tự duyệt cho chính nó.
// Chỉ xây những ca đã kiểm được; ca khác từ chối rõ ràng (không hứa suông).
// `by` = AI mặc định/đầu tiên được đề nghị; `options` = mọi AI giám đốc được chọn. Gemini làm thay (21/11/2026): Gemini VIẾT storyboard (gemini-run.mjs storyboard), Claude review và duyệt.
export const TAKEOVER_SUPPORTED = { plan: { for: 'codex', by: 'claude', options: ['claude', 'gemini'] } };
/** Số lần liên tiếp việc kế hoạch dừng chờ Codex mà Codex vẫn "dùng được" (nên hồi giờ không có) thì thôi tự chạy lại:
 *  mỗi lần chạy lại là một phiên Claude đọc lại cả thư mục chủ đề rồi lại hỏng cùng chỗ (đã đốt hạn mức Claude 20–21/11/2026). */
export const codexWaitMax = () => Number(process.env.STUDIO_CODEX_WAIT_MAX ?? 3);
/** Việc có thể được duyệt cho AI khác làm thay không, và cho ai? (cho dashboard/tổng quan; không đổi trạng thái) */
export function takeoverOffer(job) {
  const sup = TAKEOVER_SUPPORTED[job.kind];
  if (!sup || job.payload?.takeover) return null;
  const stuckOnCodex = (job.status === 'waiting_limit' && job.wait_reason === 'codex') || (job.status === 'needs_human' && String(job.last_error || '').startsWith('CODEX-KẸT'));
  return stuckOnCodex ? sup : null;
}
/** GIÁM ĐỐC duyệt: AI `by` làm thay AI đang bị kẹt ở việc #job_id; việc được xếp chạy lại ngay, đánh dấu để mọi lần chạy sau đều làm thay. */
export function approveTakeover({ job_id, by = 'claude', note = '', actor = 'director' }) {
  const j = getJob(job_id);
  if (!j) fail(`Không có việc #${job_id}`);
  const sup = TAKEOVER_SUPPORTED[j.kind];
  if (!sup) fail(`Chưa có cách cho AI khác làm thay việc loại "${j.kind}" (việc #${j.id}). Hiện chỉ hỗ trợ: Claude hoặc Gemini làm thay Codex ở việc kế hoạch ("plan": storyboard, đồng viết kịch bản). Sản xuất thay Codex cần cho Claude nền quyền chạy lệnh rộng hơn (ffmpeg, python, remotion) — chưa được duyệt; muốn thì nhờ Claude làm trực tiếp trong phiên làm việc.`);
  const who = String(by).toLowerCase();
  if (!sup.options.includes(who)) fail(`Chưa hỗ trợ ${by} làm thay: ở việc "${j.kind}" chỉ ${sup.options.join(' hoặc ')} làm thay ${sup.for} (Codex làm thay Claude cần quyền duyệt/chốt mà luật dành cho Claude).`);
  if (!['waiting_limit', 'needs_human', 'failed', 'cancelled', 'queued'].includes(j.status)) fail(`Việc #${j.id} đang ${j.status} — chờ nó dừng (hoặc huỷ) rồi duyệt.`);
  // Việc plan luôn do một phiên Claude điều phối. Đang chờ CLAUDE (hết limit/chưa có tài khoản):
  //  - Claude làm thay Codex: không được (chính Claude đang hết);
  //  - Gemini làm thay Codex: ghi duyệt ngay nhưng GIỮ trạng thái chờ — hồi limit Claude là việc chạy tiếp theo đường làm thay (Gemini vẫn cần một phiên Claude điều phối và review).
  const waitingClaude = j.status === 'waiting_limit' && j.wait_reason !== 'codex';
  if (waitingClaude && who === 'claude') fail(`Việc #${j.id} đang chờ CLAUDE (${j.wait_reason === 'no_account' ? 'chưa có tài khoản' : 'hết limit'}), không phải chờ Codex — Claude không làm thay Codex được khi chính Claude đang hết. Chọn Gemini làm thay (Claude chỉ cần review) hoặc chờ Claude hồi limit.`);
  const takeover = { by: who, for: sup.for, approved_by: 'director', approved_at: now(), note: String(note || '').slice(0, 300) };
  const payload = { ...j.payload, takeover };
  delete payload.codex_waits;
  if (waitingClaude) setJob(j.id, { payload: JSON.stringify(payload) });
  else setJob(j.id, { payload: JSON.stringify(payload), status: 'queued', wait_reason: '', attempts: 0, next_run_at: now(), last_error: '', finished_at: null, cancel_requested: false });
  S.logEvent({ actor, dept: j.dept, video_id: j.video_id, kind: 'job', message: `GIÁM ĐỐC DUYỆT: ${PROVIDER_NAME[who]} làm thay ${PROVIDER_NAME[sup.for]} ở việc #${j.id} (${j.title})${waitingClaude ? ' — việc đang chờ Claude hồi limit, sẽ chạy theo đường làm thay khi Claude sẵn sàng' : ''}${takeover.note ? ` — ${takeover.note}` : ''}` });
  return { job_id: j.id, status: waitingClaude ? 'waiting_limit' : 'queued', takeover };
}
/** Thu hồi cho việc #job_id (vd Codex đã chạy lại được): các lần chạy sau lại để Codex làm. */
export function revokeTakeover(job_id, actor = 'director') {
  const j = getJob(job_id);
  if (!j) fail(`Không có việc #${job_id}`);
  if (!j.payload.takeover) fail(`Việc #${j.id} không có duyệt thay thế nào để thu hồi`);
  const payload = { ...j.payload };
  delete payload.takeover;
  setJob(j.id, { payload: JSON.stringify(payload) });
  S.logEvent({ actor, dept: j.dept, video_id: j.video_id, kind: 'job', message: `Thu hồi duyệt thay thế ở việc #${j.id}: các lần chạy sau để Codex làm lại` });
  return { job_id: j.id, takeover: null };
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

// ---------- cân bằng tải (giám đốc chốt 20/11/2026: ba agent cơ bản cân bằng, Claude làm trưởng nhóm) ----------
// Đo bằng SỐ PHÚT CHẠY THẬT (giờ bắt đầu → kết thúc), vì sổ chưa có token theo từng bên: đây chỉ là thước thô, không phải mức dùng hạn mức gói.
// Mỗi bên nên chiếm ≈ 1/3; ngoài khoảng 20–45% là lệch. Claude chỉ tính phần TỰ làm: việc nền của Claude (plan/qc/scout) có chứa thời gian
// chờ Codex/Gemini chạy bên trong, nên trừ thời gian các lượt gọi đó (agent_calls cùng job_id) ra khỏi số phút của Claude.
export const LOAD_BAND = { min: 0.2, max: 0.45, min_total_minutes: 5 };
export function loadReport({ days = 7, nowMs = Date.now() } = {}) {
  const since = new Date(nowMs - days * 86_400_000).toISOString();
  const until = new Date(nowMs).toISOString();
  const per = Object.fromEntries(PROVIDERS.map((p) => [p, { jobs: 0, calls: 0, minutes: 0, limits: 0, failed: 0 }]));
  const nested = new Map(); // job_id -> ms Codex/Gemini chạy bên trong việc của Claude
  for (const c of all('SELECT provider,job_id,ms,outcome FROM agent_calls WHERE started_at>=? AND started_at<=?', since, until)) {
    const o = per[c.provider];
    if (!o) continue;
    o.calls++;
    o.minutes += c.ms / 60_000;
    if (c.outcome !== 'ok' && c.outcome !== 'limit') o.failed++;
    if (c.job_id) nested.set(c.job_id, (nested.get(c.job_id) || 0) + c.ms);
  }
  for (const j of all('SELECT id,provider,status,started_at,finished_at FROM jobs WHERE started_at>=? AND started_at<=? AND finished_at IS NOT NULL', since, until)) {
    const o = per[j.provider];
    const gross = Date.parse(j.finished_at) - Date.parse(j.started_at);
    if (!o || !(gross >= 0)) continue;
    o.jobs++;
    o.minutes += Math.max(0, gross - (nested.get(j.id) || 0)) / 60_000;
    if (j.status === 'failed') o.failed++;
  }
  for (const e of all("SELECT message FROM events WHERE kind='account' AND ts>=? AND ts<=? AND message LIKE 'Tài khoản % HẾT LIMIT%'", since, until)) {
    const m = /^Tài khoản (Claude|Codex|Gemini) /.exec(e.message);
    if (m) per[m[1].toLowerCase()].limits++;
  }
  const total = PROVIDERS.reduce((s, p) => s + per[p].minutes, 0);
  const providers = {};
  for (const p of PROVIDERS) providers[p] = { ...per[p], minutes: Math.round(per[p].minutes * 10) / 10, share_pct: total > 0 ? Math.round((per[p].minutes / total) * 1000) / 10 : 0 };
  let status = 'balanced';
  const notes = [];
  if (total < LOAD_BAND.min_total_minutes) {
    status = 'no_data';
    notes.push(`Mới ${Math.round(total * 10) / 10} phút trong ${days} ngày — chưa đủ số liệu để nói cân bằng hay lệch.`);
  } else {
    for (const p of PROVIDERS) {
      const sh = per[p].minutes / total;
      if (sh > LOAD_BAND.max) (status = 'skewed'), notes.push(`${PROVIDER_NAME[p]} ${providers[p].share_pct}% > ${LOAD_BAND.max * 100}%`);
      else if (sh < LOAD_BAND.min) (status = 'skewed'), notes.push(`${PROVIDER_NAME[p]} ${providers[p].share_pct}% < ${LOAD_BAND.min * 100}%`);
    }
  }
  return { days, since, total_minutes: Math.round(total * 10) / 10, providers, status, notes, caveat: 'Đo bằng số phút chạy thật (chưa có token theo từng bên); Claude chỉ tính phần tự làm, đã trừ thời gian chờ Codex/Gemini bên trong việc nền.' };
}

/** Dựng lại sổ lượt gọi (agent_calls) từ log cũ trong studio/data/logs, cho giai đoạn trước khi có sổ (không ghi trùng, chạy lại được).
 *  Tên log `codex-write-<mode>-<ms>.log` / `codex-ideate-<vai>-<ms>.log` / `gemini-run-<mode>-<ms>.log`: `<ms>` là giờ bắt đầu, giờ sửa cuối của file là giờ kết thúc.
 *  Mã việc lấy từ file `.meta.json` đi kèm; không có thì suy ra từ việc nền của Claude đang chạy đúng lúc đó. */
export function backfillCalls({ dir = path.join(path.dirname(S.DB_PATH), 'logs') } = {}) {
  let names = [];
  try {
    names = fs.readdirSync(dir).filter((f) => /^(codex-write|codex-ideate|gemini-run)-[a-z0-9-]+?-\d{12,}\.log$/.test(f));
  } catch {
    return { scanned: 0, added: 0, skipped: 0 };
  }
  const claudeJobs = all("SELECT id,started_at,finished_at FROM jobs WHERE provider='claude' AND started_at IS NOT NULL AND finished_at IS NOT NULL");
  let added = 0;
  let skipped = 0;
  for (const f of names) {
    const [, kind, mode, ts] = /^(codex-write|codex-ideate|gemini-run)-([a-z0-9-]+?)-(\d{12,})\.log$/.exec(f);
    const file = path.join(dir, f);
    const startMs = Number(ts);
    const endMs = fs.statSync(file).mtimeMs;
    const provider = kind === 'gemini-run' ? 'gemini' : 'codex';
    const callMode = kind === 'codex-write' ? `write-${mode}` : kind === 'codex-ideate' ? `ideate-${mode}` : mode;
    if (!(endMs >= startMs) || endMs - startMs > 6 * 3_600_000 || get('SELECT 1 FROM agent_calls WHERE provider=? AND mode=? AND started_at=?', provider, callMode, new Date(startMs).toISOString())) {
      skipped++;
      continue;
    }
    let meta = {};
    try {
      meta = JSON.parse(fs.readFileSync(`${file}.meta.json`, 'utf8'));
    } catch {
      /* log cũ chưa có sidecar */
    }
    const tail = fs.readFileSync(file, 'utf8').slice(-2500);
    const exit = [...tail.matchAll(/\[thoát mã (-?\d+)(, QUÁ GIỜ)?\]/g)].pop();
    const outcome = !exit ? 'fail' : exit[2] ? 'timeout' : exit[1] === '0' ? 'ok' : { limit: 'limit', auth: 'auth' }[classifyFailure(tail).type] || 'fail';
    const jobId = Number(meta.job_id) || claudeJobs.find((j) => Date.parse(j.started_at) <= startMs && startMs <= Date.parse(j.finished_at))?.id || null;
    S.recordCall({ provider, mode: callMode, dept: meta.dept || null, job_id: jobId, started_ms: startMs, ended_ms: endMs, outcome });
    added++;
  }
  return { scanned: names.length, added, skipped };
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

  if (active.length && !worker.alive) attention.push({ kind: 'worker', handler: 'director', message: `Có ${active.length} việc đang chờ nhưng WORKER KHÔNG CHẠY — bật bằng "npm run start --prefix studio"` });
  for (const p of PROVIDERS) {
    const w = waiting.filter((j) => j.provider === p);
    if (!w.length) continue;
    const noAcc = w.filter((j) => j.wait_reason === 'no_account');
    const lim = w.filter((j) => j.wait_reason !== 'no_account' && j.wait_reason !== 'codex');
    if (noAcc.length) attention.push({ kind: 'no_account', handler: 'director', provider: p, message: `${noAcc.length} việc ${p} đang chờ vì KHÔNG có tài khoản ${p} dùng được — thêm/đăng nhập/bật tài khoản (bảng "Tài khoản")` });
    if (lim.length) {
      const until = lim.map((j) => j.next_run_at).sort()[0];
      attention.push({ kind: 'limit_wait', handler: 'claude', provider: p, until, message: `${lim.length} việc ${p} đang chờ hồi limit (tất cả tài khoản ${p} đều hết) — tự chạy tiếp, không cần làm gì` });
    }
  }
  const codexWait = waiting.filter((j) => j.wait_reason === 'codex');
  if (codexWait.length) attention.push({ kind: 'limit_wait', handler: 'claude', provider: 'codex', until: codexWait.map((j) => j.next_run_at).sort()[0], message: `${codexWait.length} việc kế hoạch đang chờ Codex (viết kịch bản/storyboard) vì Codex của phòng bận hoặc hết limit` });
  // Mỗi việc kẹt ở Codex: cho giám đốc duyệt AI khác làm thay (nút "Cho Claude làm thay" / `cli takeover <id> claude` / công cụ approve_takeover).
  for (const j of jobs) {
    const offer = takeoverOffer(j);
    if (offer) attention.push({ kind: 'takeover_offer', handler: 'director', job_id: j.id, dept: j.dept, for: offer.for, by: offer.by, options: offer.options, message: `Việc #${j.id} "${j.title}" đang kẹt ở ${PROVIDER_NAME[offer.for]}${j.last_error ? ` (${j.last_error.slice(0, 160)})` : ''} — bạn có thể duyệt cho ${offer.options.map((o) => PROVIDER_NAME[o]).join(' hoặc ')} làm thay` });
  }
  for (const j of jobs.filter((x) => x.status === 'needs_human' && !takeoverOffer(x))) {
    // Việc gỡ vướng vừa hỏng mà video còn trong quyền Claude tự gỡ (còn lượt, đúng giai đoạn): worker tự xếp lượt gỡ vướng kế tiếp, không cần người.
    const v = j.kind === 'rescue' && j.video_id ? S.getVideo(j.video_id) : null;
    if (v && S.rescueState(v).auto) attention.push({ kind: 'job_human', handler: 'claude', job_id: j.id, message: `Việc #${j.id} "${j.title}" chưa gỡ xong — Claude tự thử lại (đã gỡ ${get("SELECT COUNT(*) c FROM jobs WHERE kind='rescue' AND video_id=?", v.id).c}/${getSetting('max_rescues_per_video')} lần)` });
    else attention.push({ kind: 'job_human', handler: 'director', job_id: j.id, message: `Việc #${j.id} "${j.title}" cần người xử lý: ${j.last_error}` });
  }
  for (const a of accounts.filter((x) => x.enabled && x.status === 'auth_error')) attention.push({ kind: 'auth', handler: 'director', account_id: a.id, provider: a.provider, message: `Tài khoản ${accountPerson(a)} lỗi đăng nhập — chạy: ${a.login}` });

  // Kế hoạch đã xong, chờ giám đốc duyệt để sản xuất (không có việc produce đang chờ/chạy).
  const planning = all("SELECT v.id, v.dept, v.title, t.folder FROM videos v JOIN topics t ON t.id=v.topic_id WHERE v.stage='planning'");
  for (const v of planning) {
    if (!v.folder || !fs.existsSync(path.resolve(S.ROOT, v.folder, 'plan.md'))) continue;
    if (get("SELECT 1 FROM jobs WHERE kind='produce' AND video_id=? AND status IN ('queued','running','waiting_limit')", v.id)) continue;
    attention.push({ kind: 'approve_produce', handler: 'director', video_id: v.id, dept: v.dept, message: `Kế hoạch ${v.id} đã sẵn sàng — chờ bạn duyệt để Codex sản xuất` });
  }

  const sum = (p) => ({ total: accounts.filter((a) => a.provider === p).length, ready: accounts.filter((a) => a.provider === p && a.enabled && a.status === 'ready' && !a.capped).length, limited: accounts.filter((a) => a.provider === p && a.status === 'limited').length });
  return {
    accounts, jobs, worker, settings: allSettings(), attention, load: loadReport(), load_24h: loadReport({ days: 1 }),
    summary: { claude: sum('claude'), codex: sum('codex'), gemini: sum('gemini'), jobs_running: jobs.filter((j) => j.status === 'running').length, jobs_waiting: waiting.length, jobs_queued: jobs.filter((j) => j.status === 'queued').length, jobs_human: jobs.filter((j) => j.status === 'needs_human').length },
  };
}
