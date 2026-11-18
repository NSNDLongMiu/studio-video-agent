// Lõi dữ liệu của "Xưởng video": phòng ban -> đội -> thành viên (agent) -> video.
// Mọi tiến trình (MCP của Claude, MCP của Codex, dashboard, CLI) dùng chung 1 file SQLite
// nên trạng thái luôn nhất quán và "giám đốc" nhìn thấy theo thời gian thực.
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(here, '..', '..');
export const CONTENT_DIR = process.env.STUDIO_CONTENT || path.join(ROOT, 'content');
export const DB_PATH = process.env.STUDIO_DB || path.join(ROOT, 'studio', 'data', 'studio.db');

export const DEFAULT_TEAM_CAPACITY = 2; // video/ngày của 1 đội mới
export const STALE_MINUTES = 30; // "đang làm" mà không cập nhật quá lâu => nghi treo

// Biên chế chuẩn của 1 đội. "on_call" = trực hỗ trợ, chỉ tính là đang làm khi được gọi ra.
/** BỘ CORE của mỗi đội (giám đốc duyệt 18/11/2026). Dashboard/Văn phòng 2D chỉ hiện các vị trí này.
 *  'scout' (Tìm chủ đề) chỉ hiện/hoạt động khi phòng bật tự tìm chủ đề (departments.auto_topics). */
export const ROSTER = [
  { role: 'idea', label: 'Ý tưởng', engine: 'claude', on_call: 0, duty: 'Claude và Codex phản biện ý tưởng để Claude chốt concept mở bằng tình huống gợi tò mò theo Storytelling–Problem–Explanation–Solution.' },
  { role: 'script', label: 'Kịch bản', engine: 'codex', on_call: 0, duty: 'Codex viết concept, plan và script có tình huống mở, kết quay lại vấn đề, bảng thuật ngữ và ngân sách thời lượng để Claude review và duyệt.' },
  { role: 'visual', label: 'Đạo diễn hình ảnh', engine: 'codex', on_call: 0, duty: 'Codex viết storyboard với nền theo ngữ cảnh, chữ lấy từ kịch bản và Cáo cỡ nhỏ chỉ ở mở, giữa và kết để Claude duyệt APPROVED.' },
  { role: 'producer', label: 'Sản xuất', engine: 'codex', on_call: 0, duty: 'Codex dựng video, dùng từ điển để chuẩn hoá phát âm và chốt tốc độ cùng khoảng nghỉ trước khi tổng hợp giọng, nếu kẹt thì escalate.' },
  { role: 'qc', label: 'QC', engine: 'claude', on_call: 0, duty: 'Claude kiểm ba trục kỹ thuật, tuân thủ và trải nghiệm cùng tám nhóm yêu cầu của giám đốc, chuyển ready nếu đạt, gửi sản xuất lại nếu lỗi dựng hoặc báo giám đốc và giữ review nếu lỗi thiết kế.' },
  { role: 'rescue', label: 'Gỡ vướng', engine: 'claude', on_call: 0, duty: 'Claude chẩn đoán và gỡ khi Sản xuất kẹt (tối đa 4 lần/video), vượt ngưỡng báo giám đốc' },
  { role: 'scout', label: 'Tìm chủ đề', engine: 'claude', on_call: 1, duty: 'Chỉ khi phòng bật tự tìm chủ đề: tìm chủ đề trong chủ đề chung của phòng, kèm nguồn + lý do, ĐỀ XUẤT chờ giám đốc duyệt' },
];
/** Tên vai cũ (agent/skill cũ còn gọi) → vị trí core tương ứng. */
export const ROLE_ALIAS = { ideator_a: 'idea', ideator_b: 'idea', ideator_c: 'idea', ideator_d: 'idea', planner: 'script', visual_director: 'visual', support: 'qc' };
export const ALL_ROLES = [...ROSTER.map((r) => r.role), ...Object.keys(ROLE_ALIAS)];
export const coreRole = (role) => ROLE_ALIAS[role] || role;
export const STAGES = ['ideation', 'planning', 'production', 'review', 'ready', 'published', 'rejected'];
export const ACTIVE_STAGES = ['ideation', 'planning', 'production', 'review'];
export const DONE_STAGES = ['ready', 'published'];
export const MEMBER_STATUS = ['idle', 'working', 'blocked', 'offline'];
export const PROPOSAL_TYPES = ['add_team', 'remove_team'];

export class StudioError extends Error {}
const fail = (msg) => {
  throw new StudioError(msg);
};

const SCHEMA = `
CREATE TABLE IF NOT EXISTS departments(
  slug TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
  daily_target INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'active',
  review_requested INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, closed_at TEXT);
CREATE TABLE IF NOT EXISTS teams(
  id INTEGER PRIMARY KEY AUTOINCREMENT, dept TEXT NOT NULL REFERENCES departments(slug),
  name TEXT NOT NULL, capacity_per_day INTEGER NOT NULL DEFAULT 2, status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL, disbanded_at TEXT);
CREATE TABLE IF NOT EXISTS members(
  id INTEGER PRIMARY KEY AUTOINCREMENT, team_id INTEGER NOT NULL REFERENCES teams(id),
  role TEXT NOT NULL, label TEXT NOT NULL, engine TEXT NOT NULL, on_call INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'idle', task TEXT NOT NULL DEFAULT '', video_id TEXT,
  updated_at TEXT NOT NULL, UNIQUE(team_id, role));
CREATE TABLE IF NOT EXISTS topics(
  id INTEGER PRIMARY KEY AUTOINCREMENT, dept TEXT NOT NULL REFERENCES departments(slug),
  text TEXT NOT NULL, brief TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'open',
  team_id INTEGER, folder TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS videos(
  id TEXT PRIMARY KEY, dept TEXT NOT NULL, team_id INTEGER NOT NULL, topic_id INTEGER NOT NULL,
  episode INTEGER NOT NULL, title TEXT NOT NULL, stage TEXT NOT NULL DEFAULT 'ideation',
  needs_help INTEGER NOT NULL DEFAULT 0, help_reason TEXT NOT NULL DEFAULT '',
  planned_for TEXT NOT NULL, folder TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  finished_at TEXT);
CREATE TABLE IF NOT EXISTS proposals(
  id INTEGER PRIMARY KEY AUTOINCREMENT, dept TEXT NOT NULL, type TEXT NOT NULL, payload TEXT NOT NULL,
  reason TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', proposed_by TEXT NOT NULL,
  decided_by TEXT, decision_note TEXT, created_at TEXT NOT NULL, decided_at TEXT);
CREATE TABLE IF NOT EXISTS events(
  id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT NOT NULL, actor TEXT NOT NULL, dept TEXT,
  team_id INTEGER, video_id TEXT, kind TEXT NOT NULL, message TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS accounts(
  id INTEGER PRIMARY KEY AUTOINCREMENT, provider TEXT NOT NULL, label TEXT NOT NULL, owner TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL DEFAULT 'subscription', home TEXT, secret_file TEXT, priority INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'ready', enabled INTEGER NOT NULL DEFAULT 1, limited_until TEXT,
  last_limit_raw TEXT NOT NULL DEFAULT '', last_error TEXT NOT NULL DEFAULT '',
  consecutive_limits INTEGER NOT NULL DEFAULT 0, limit_hits INTEGER NOT NULL DEFAULT 0,
  runs INTEGER NOT NULL DEFAULT 0, runs_today INTEGER NOT NULL DEFAULT 0, runs_day TEXT, max_runs_per_day INTEGER,
  last_used_at TEXT, last_success_at TEXT, created_at TEXT NOT NULL, UNIQUE(provider, label));
CREATE TABLE IF NOT EXISTS jobs(
  id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL, provider TEXT NOT NULL, title TEXT NOT NULL,
  dept TEXT, topic_id INTEGER, video_id TEXT, payload TEXT NOT NULL DEFAULT '{}', lock_key TEXT,
  status TEXT NOT NULL DEFAULT 'queued', wait_reason TEXT NOT NULL DEFAULT '', attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3, account_id INTEGER, next_run_at TEXT NOT NULL, started_at TEXT, finished_at TEXT,
  last_error TEXT NOT NULL DEFAULT '', log_file TEXT NOT NULL DEFAULT '', summary TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL DEFAULT 'director', cancel_requested INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status, next_run_at);
CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS worker(
  id INTEGER PRIMARY KEY CHECK(id=1), pid INTEGER, started_at TEXT, heartbeat_at TEXT, tick_ms INTEGER,
  stop_requested INTEGER NOT NULL DEFAULT 0, running INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS idx_videos_team_day ON videos(team_id, planned_for);
CREATE INDEX IF NOT EXISTS idx_events_id ON events(id DESC);
`;

let _db;
function db() {
  if (_db) return _db;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  _db = new DatabaseSync(DB_PATH);
  _db.exec('PRAGMA busy_timeout=8000;');
  _db.exec('PRAGMA journal_mode=WAL;');
  _db.exec('PRAGMA foreign_keys=ON;');
  _db.exec(SCHEMA);
  // Cột thêm sau (CREATE TABLE IF NOT EXISTS không tự thêm cột cho DB cũ): tài khoản được cấp cho phòng nào.
  const addCol = (table, col, def) => {
    if (!_db.prepare(`PRAGMA table_info(${table})`).all().some((c) => c.name === col)) _db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`);
  };
  addCol('accounts', 'dept', 'TEXT');
  addCol('departments', 'auto_topics', 'INTEGER NOT NULL DEFAULT 0'); // tự tìm chủ đề (mặc định TẮT: chỉ giám đốc đưa chủ đề)
  addCol('topics', 'source', "TEXT NOT NULL DEFAULT 'director'"); // director | agent (đội tự tìm, phải được giám đốc duyệt)
  addCol('topics', 'reason', "TEXT NOT NULL DEFAULT ''"); // lý do + nguồn khi đội đề xuất
  // Bộ core thay cho vai cũ: bỏ dòng thành viên của vai không còn trong ROSTER (chỉ là trạng thái hiển thị).
  _db.prepare(`DELETE FROM members WHERE role NOT IN (${ROSTER.map(() => '?').join(',')})`).run(...ROSTER.map((r) => r.role));
  const fixLabel = _db.prepare('UPDATE members SET label=?, engine=?, on_call=? WHERE role=? AND (label!=? OR engine!=? OR on_call!=?)');
  for (const r of ROSTER) fixLabel.run(r.label, r.engine, r.on_call, r.role, r.label, r.engine, r.on_call);
  // File nay khong co migration ALTER TABLE (toan CREATE TABLE IF NOT EXISTS) - khi ROSTER doi (vd them
  // ideator_c/d), doi da lap truoc do se thieu dong members tuong ung. Bu: chen dong con thieu cho MOI
  // doi dang co moi lan mo db - idempotent nho UNIQUE(team_id,role) + INSERT OR IGNORE.
  const nowIso = new Date().toISOString();
  const teamIds = _db.prepare('SELECT id FROM teams').all().map((t) => t.id);
  const insertMember = _db.prepare('INSERT OR IGNORE INTO members(team_id,role,label,engine,on_call,status,task,updated_at) VALUES(?,?,?,?,?,?,?,?)');
  for (const teamId of teamIds) for (const m of ROSTER) insertMember.run(teamId, m.role, m.label, m.engine, m.on_call, 'idle', '', nowIso);
  return _db;
}
const get = (sql, ...p) => db().prepare(sql).get(...p);
const all = (sql, ...p) => db().prepare(sql).all(...p);
const run = (sql, ...p) => db().prepare(sql).run(...p);

let depth = 0;
function tx(fn) {
  if (depth > 0) return fn();
  const d = db();
  d.exec('BEGIN IMMEDIATE');
  depth++;
  try {
    const r = fn();
    d.exec('COMMIT');
    return r;
  } catch (e) {
    try {
      d.exec('ROLLBACK');
    } catch {
      /* đã rollback */
    }
    throw e;
  } finally {
    depth--;
  }
}

// ---------- tiện ích ----------
const pad = (n) => String(n).padStart(2, '0');
export const today = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const now = () => new Date().toISOString();
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

export function slugify(s, max = 24) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
    .replace(/-+$/g, '');
}
function int(v, min, max, label) {
  const n = Number(v);
  if (!Number.isInteger(n) || n < min || n > max) fail(`${label} phải là số nguyên từ ${min} đến ${max} (nhận được: ${v})`);
  return n;
}
function mustDept(slug, { active = false } = {}) {
  const d = get('SELECT * FROM departments WHERE slug=?', slug);
  if (!d) {
    const names = all('SELECT slug FROM departments').map((x) => x.slug).join(', ') || '(chưa có phòng nào)';
    fail(`Không có phòng "${slug}". Các phòng hiện có: ${names}`);
  }
  if (active && d.status !== 'active') fail(`Phòng "${slug}" đang đóng`);
  return d;
}
function mustTeam(id) {
  const t = get('SELECT * FROM teams WHERE id=?', Number(id));
  if (!t) fail(`Không có đội #${id}`);
  return t;
}
function mustVideo(id) {
  const v = get('SELECT * FROM videos WHERE id=?', id);
  if (!v) fail(`Không có video "${id}"`);
  return v;
}
export function logEvent({ actor = 'system', dept = null, team_id = null, video_id = null, kind = 'note', message }) {
  if (!message) fail('Thiếu nội dung sự kiện');
  run('INSERT INTO events(ts,actor,dept,team_id,video_id,kind,message) VALUES(?,?,?,?,?,?,?)', now(), actor, dept, team_id, video_id, kind, String(message).slice(0, 1000));
}

// ---------- phòng ban ----------
export function createDepartment({ slug, name, description = '', daily_target = 0, initial_teams = 1, by = 'director' }) {
  return tx(() => {
    if (!name) fail('Thiếu tên phòng ban');
    slug = slugify(slug || name);
    if (!/^[a-z0-9][a-z0-9-]{1,23}$/.test(slug)) fail(`Mã phòng "${slug}" không hợp lệ (2-24 ký tự a-z, 0-9, gạch ngang)`);
    if (get('SELECT 1 FROM departments WHERE slug=?', slug)) fail(`Phòng "${slug}" đã tồn tại`);
    const target = int(daily_target, 0, 100, 'Chỉ tiêu video/ngày');
    const n = int(initial_teams, 0, 10, 'Số đội ban đầu');
    run('INSERT INTO departments(slug,name,description,daily_target,created_at) VALUES(?,?,?,?,?)', slug, name, description, target, now());
    const dept = mustDept(slug);
    logEvent({ actor: by, dept: slug, kind: 'dept', message: `Mở phòng "${name}" (chỉ tiêu ${target} video/ngày, ${n} đội)` });
    const teams = [];
    for (let i = 0; i < n; i++) teams.push(addTeam(dept, { by }));
    fs.mkdirSync(path.join(CONTENT_DIR, slug), { recursive: true });
    return { dept: slug, teams };
  });
}

export function closeDepartment({ slug, force = false, by = 'director' }) {
  return tx(() => {
    const d = mustDept(slug);
    if (d.status === 'closed') fail(`Phòng "${slug}" đã đóng rồi`);
    const active = all(`SELECT id FROM videos WHERE dept=? AND stage IN (${ACTIVE_STAGES.map(() => '?').join(',')})`, slug, ...ACTIVE_STAGES);
    if (active.length && !force) fail(`Phòng "${slug}" còn ${active.length} video đang làm (${active.map((v) => v.id).join(', ')}). Hoàn tất trước hoặc đóng cưỡng bức (force).`);
    for (const v of active) {
      run("UPDATE videos SET stage='rejected', updated_at=? WHERE id=?", now(), v.id);
      logEvent({ actor: by, dept: slug, video_id: v.id, kind: 'video', message: 'Huỷ vì đóng phòng' });
    }
    run("UPDATE teams SET status='disbanded', disbanded_at=? WHERE dept=? AND status='active'", now(), slug);
    run("UPDATE members SET status='offline', task='', video_id=NULL, updated_at=? WHERE team_id IN (SELECT id FROM teams WHERE dept=?)", now(), slug);
    run("UPDATE proposals SET status='rejected', decided_by=?, decision_note='Phòng đã đóng', decided_at=? WHERE dept=? AND status='pending'", by, now(), slug);
    run("UPDATE departments SET status='closed', closed_at=?, review_requested=0 WHERE slug=?", now(), slug);
    logEvent({ actor: by, dept: slug, kind: 'dept', message: `Đóng phòng "${d.name}"${active.length ? ` (huỷ ${active.length} video đang làm)` : ''}` });
    return { dept: slug, status: 'closed', cancelled_videos: active.map((v) => v.id) };
  });
}

export function purgeDepartment({ slug, force = false, by = 'director' }) {
  return tx(() => {
    const d = mustDept(slug);
    if (d.status !== 'closed' && !force) fail(`Phòng "${slug}" đang mở — đóng phòng (close_department) trước, hoặc purge --force.`);
    const counts = {
      topics: get('SELECT COUNT(*) n FROM topics WHERE dept=?', slug).n,
      videos: get('SELECT COUNT(*) n FROM videos WHERE dept=?', slug).n,
      jobs: get('SELECT COUNT(*) n FROM jobs WHERE dept=?', slug).n,
      proposals: get('SELECT COUNT(*) n FROM proposals WHERE dept=?', slug).n,
    };
    for (const t of all('SELECT id FROM teams WHERE dept=?', slug)) run('DELETE FROM members WHERE team_id=?', t.id);
    run('DELETE FROM jobs WHERE dept=?', slug);
    run('DELETE FROM videos WHERE dept=?', slug);
    run('DELETE FROM proposals WHERE dept=?', slug);
    run('DELETE FROM topics WHERE dept=?', slug);
    run('DELETE FROM events WHERE dept=?', slug);
    run('DELETE FROM teams WHERE dept=?', slug);
    run('DELETE FROM departments WHERE slug=?', slug);
    logEvent({ actor: by, kind: 'dept', message: `Xoá sạch phòng "${d.name}" (${counts.topics} chủ đề, ${counts.videos} video, ${counts.jobs} việc, ${counts.proposals} đề xuất)` });
    return { dept: slug, deleted: counts };
  });
}

export function reopenDepartment({ slug, initial_teams = 1, by = 'director' }) {
  return tx(() => {
    const d = mustDept(slug);
    if (d.status === 'active') fail(`Phòng "${slug}" đang mở`);
    const n = int(initial_teams, 0, 10, 'Số đội ban đầu');
    run("UPDATE departments SET status='active', closed_at=NULL WHERE slug=?", slug);
    logEvent({ actor: by, dept: slug, kind: 'dept', message: `Mở lại phòng "${d.name}" với ${n} đội` });
    const teams = [];
    for (let i = 0; i < n; i++) teams.push(addTeam(mustDept(slug), { by }));
    return { dept: slug, status: 'active', teams };
  });
}

export function setDailyTarget({ slug, target, by = 'director' }) {
  return tx(() => {
    const d = mustDept(slug, { active: true });
    const t = int(target, 0, 100, 'Chỉ tiêu video/ngày');
    const cap = capacityOf(slug);
    const review = t > cap ? 1 : 0;
    run('UPDATE departments SET daily_target=?, review_requested=? WHERE slug=?', t, review, slug);
    logEvent({ actor: by, dept: slug, kind: 'target', message: `Chỉ tiêu phòng "${d.name}": ${d.daily_target} → ${t} video/ngày (năng lực hiện tại ${cap})` });
    return { dept: slug, daily_target: t, capacity: cap, gap_videos: Math.max(0, t - cap), needs_head_review: !!review };
  });
}

const capacityOf = (slug) => get("SELECT COALESCE(SUM(capacity_per_day),0) c FROM teams WHERE dept=? AND status='active'", slug).c;

// ---------- đội ----------
function addTeam(dept, { capacity = DEFAULT_TEAM_CAPACITY, by = 'system' } = {}) {
  const n = get('SELECT COUNT(*) c FROM teams WHERE dept=?', dept.slug).c + 1;
  const name = `${dept.name} · Đội ${n}`;
  const r = run('INSERT INTO teams(dept,name,capacity_per_day,created_at) VALUES(?,?,?,?)', dept.slug, name, capacity, now());
  const id = Number(r.lastInsertRowid);
  for (const m of ROSTER) {
    run('INSERT INTO members(team_id,role,label,engine,on_call,status,updated_at) VALUES(?,?,?,?,?,?,?)', id, m.role, m.label, m.engine, m.on_call, 'idle', now());
  }
  logEvent({ actor: by, dept: dept.slug, team_id: id, kind: 'team', message: `Lập "${name}" (${ROSTER.filter((m) => !m.on_call).length} người + 1 trực hỗ trợ, ${capacity} video/ngày)` });
  return id;
}

function disbandTeam(id, by) {
  const t = mustTeam(id);
  if (t.status !== 'active') fail(`Đội #${id} đã giải thể`);
  const busy = all(`SELECT id FROM videos WHERE team_id=? AND stage IN (${ACTIVE_STAGES.map(() => '?').join(',')})`, id, ...ACTIVE_STAGES);
  if (busy.length) fail(`Đội #${id} còn ${busy.length} video đang làm (${busy.map((v) => v.id).join(', ')}) — chưa thể giải thể`);
  run("UPDATE teams SET status='disbanded', disbanded_at=? WHERE id=?", now(), id);
  run("UPDATE members SET status='offline', task='', video_id=NULL, updated_at=? WHERE team_id=?", now(), id);
  logEvent({ actor: by, dept: t.dept, team_id: id, kind: 'team', message: `Giải thể "${t.name}"` });
}

// ---------- đề xuất (trưởng phòng) & phê duyệt (giám đốc) ----------
export function proposeChange({ dept, type, count = 1, team_id, reason, by }) {
  return tx(() => {
    const d = mustDept(dept, { active: true });
    if (!PROPOSAL_TYPES.includes(type)) fail(`Loại đề xuất phải là: ${PROPOSAL_TYPES.join(' | ')}`);
    if (!reason || String(reason).trim().length < 10) fail('Cần nêu lý do cụ thể (≥ 10 ký tự) để giám đốc cân nhắc');
    let payload;
    if (type === 'add_team') payload = { count: int(count, 1, 5, 'Số đội xin thêm') };
    else {
      const t = mustTeam(team_id);
      if (t.dept !== dept || t.status !== 'active') fail(`Đội #${team_id} không thuộc phòng "${dept}" hoặc đã giải thể`);
      payload = { team_id: t.id };
    }
    const json = JSON.stringify(payload);
    const dup = get("SELECT id FROM proposals WHERE dept=? AND type=? AND payload=? AND status='pending'", dept, type, json);
    if (dup) return { proposal_id: dup.id, status: 'pending', note: 'Đã có đề xuất giống hệt đang chờ duyệt' };
    const r = run('INSERT INTO proposals(dept,type,payload,reason,proposed_by,created_at) VALUES(?,?,?,?,?,?)', dept, type, json, String(reason).trim(), by || `head:${dept}`, now());
    const id = Number(r.lastInsertRowid);
    run('UPDATE departments SET review_requested=0 WHERE slug=?', dept);
    const what = type === 'add_team' ? `xin thêm ${payload.count} đội` : `xin giải thể đội #${payload.team_id}`;
    logEvent({ actor: by || `head:${dept}`, dept, kind: 'proposal', message: `Đề xuất #${id}: ${what}. Lý do: ${reason}` });
    return { proposal_id: id, status: 'pending', summary: `Phòng "${d.name}" ${what}` };
  });
}

export function decideProposal({ id, approve, by = 'director', note = '' }) {
  return tx(() => {
    const p = get('SELECT * FROM proposals WHERE id=?', Number(id));
    if (!p) fail(`Không có đề xuất #${id}`);
    if (p.status !== 'pending') fail(`Đề xuất #${id} đã được xử lý (${p.status})`);
    const payload = JSON.parse(p.payload);
    let applied = null;
    if (approve) {
      const d = mustDept(p.dept, { active: true });
      if (p.type === 'add_team') {
        applied = { new_teams: Array.from({ length: payload.count }, () => addTeam(d, { by })) };
      } else {
        disbandTeam(payload.team_id, by);
        applied = { disbanded_team: payload.team_id };
      }
    }
    run('UPDATE proposals SET status=?, decided_by=?, decision_note=?, decided_at=? WHERE id=?', approve ? 'approved' : 'rejected', by, note, now(), p.id);
    logEvent({ actor: by, dept: p.dept, kind: 'proposal', message: `${approve ? 'DUYỆT' : 'TỪ CHỐI'} đề xuất #${p.id}${note ? ` — ${note}` : ''}` });
    return { proposal_id: p.id, status: approve ? 'approved' : 'rejected', applied };
  });
}

export function listProposals({ status, dept } = {}) {
  const w = [];
  const p = [];
  if (status) (w.push('status=?'), p.push(status));
  if (dept) (w.push('dept=?'), p.push(dept));
  return all(`SELECT * FROM proposals ${w.length ? 'WHERE ' + w.join(' AND ') : ''} ORDER BY id DESC LIMIT 50`, ...p).map((x) => ({ ...x, payload: JSON.parse(x.payload) }));
}

// ---------- chủ đề & video ----------
export function submitTopic({ dept, text, brief = '', by = 'director' }) {
  return tx(() => {
    const d = mustDept(dept, { active: true });
    if (!text || !String(text).trim()) fail('Thiếu nội dung chủ đề');
    const r = run('INSERT INTO topics(dept,text,brief,created_at) VALUES(?,?,?,?)', dept, String(text).trim(), brief, now());
    const id = Number(r.lastInsertRowid);
    logEvent({ actor: by, dept, kind: 'topic', message: `Chủ đề #${id} cho phòng "${d.name}": ${String(text).trim().slice(0, 120)}` });
    return { topic_id: id, dept };
  });
}

export function listTopics({ dept, status } = {}) {
  const w = [];
  const p = [];
  if (dept) (w.push('dept=?'), p.push(dept));
  if (status) (w.push('status=?'), p.push(status));
  return all(`SELECT * FROM topics ${w.length ? 'WHERE ' + w.join(' AND ') : ''} ORDER BY id DESC LIMIT 100`, ...p);
}

// ---------- tự tìm chủ đề (giám đốc chốt 18/11/2026) ----------
// TẮT (mặc định): chỉ giám đốc đưa chủ đề; không có chủ đề thì đội không làm gì.
// BẬT: vị trí "Tìm chủ đề" của từng đội tìm chủ đề TRONG chủ đề chung của phòng (mô tả phòng) và ĐỀ XUẤT;
//      đề xuất chỉ thành chủ đề để làm sau khi giám đốc DUYỆT (approveTopic).
export function setAutoTopics({ dept, on, by = 'director' }) {
  return tx(() => {
    const d = mustDept(dept);
    run('UPDATE departments SET auto_topics=? WHERE slug=?', on ? 1 : 0, d.slug);
    logEvent({ actor: by, dept: d.slug, kind: 'topic', message: `${on ? 'BẬT' : 'TẮT'} tự tìm chủ đề cho phòng "${d.name}"${on ? ' — đội đề xuất, giám đốc duyệt mới làm' : ' — chỉ giám đốc đưa chủ đề'}` });
    return { dept: d.slug, auto_topics: !!on };
  });
}

/** Số chủ đề đội còn được đề xuất thêm: suất trống hôm nay − chủ đề đã có chờ đội này (đề xuất chưa duyệt + đã duyệt chưa làm). */
export function scoutRoom(team_id) {
  const t = mustTeam(team_id);
  const free = t.capacity_per_day - usedOn(t.id, today());
  const pending = get("SELECT COUNT(*) c FROM topics WHERE team_id=? AND status IN ('proposed','open')", t.id).c;
  return Math.max(0, free - pending);
}

export function proposeTopic({ team_id, text, brief = '', reason = '', by = 'agent' }) {
  return tx(() => {
    const t = mustTeam(team_id);
    if (t.status !== 'active') fail(`Đội #${team_id} đã giải thể`);
    const d = mustDept(t.dept, { active: true });
    if (!d.auto_topics) fail(`Phòng "${d.name}" đang TẮT tự tìm chủ đề — chỉ giám đốc đưa chủ đề`);
    const clean = String(text || '').trim();
    if (!clean) fail('Thiếu nội dung chủ đề');
    if (!String(reason).trim()) fail('Thiếu lý do/nguồn — giám đốc cần biết vì sao nên làm chủ đề này');
    if (get('SELECT 1 FROM topics WHERE dept=? AND lower(text)=lower(?)', d.slug, clean)) fail('Chủ đề này đã có trong phòng (trùng)');
    if (scoutRoom(t.id) <= 0) fail(`${t.name} đã đủ chủ đề cho số suất còn trống hôm nay — chờ giám đốc duyệt/đội làm bớt`);
    const r = run("INSERT INTO topics(dept,text,brief,status,team_id,source,reason,created_at) VALUES(?,?,?,'proposed',?,'agent',?,?)", d.slug, clean, brief, t.id, String(reason).trim(), now());
    const id = Number(r.lastInsertRowid);
    logEvent({ actor: by, dept: d.slug, team_id: t.id, kind: 'topic', message: `${t.name} ĐỀ XUẤT chủ đề #${id} (chờ giám đốc duyệt): ${clean.slice(0, 120)}` });
    return { topic_id: id, status: 'proposed', team_id: t.id };
  });
}

export function decideTopic({ topic_id, approve, note = '', by = 'director' }) {
  return tx(() => {
    const tp = get('SELECT * FROM topics WHERE id=?', Number(topic_id));
    if (!tp) fail(`Không có chủ đề #${topic_id}`);
    if (tp.status !== 'proposed') fail(`Chủ đề #${tp.id} không ở trạng thái chờ duyệt (đang: ${tp.status})`);
    run('UPDATE topics SET status=? WHERE id=?', approve ? 'open' : 'rejected', tp.id);
    logEvent({ actor: by, dept: tp.dept, team_id: tp.team_id, kind: 'topic', message: `${approve ? 'DUYỆT' : 'TỪ CHỐI'} chủ đề #${tp.id} do đội đề xuất: ${tp.text.slice(0, 100)}${note ? ` — ${note}` : ''}` });
    return { topic_id: tp.id, status: approve ? 'open' : 'rejected', dept: tp.dept };
  });
}

const usedOn = (team_id, date) => get("SELECT COUNT(*) c FROM videos WHERE team_id=? AND planned_for=? AND stage!='rejected'", team_id, date).c;

export function assignTopic({ topic_id, team_id, episodes = 1, planned_for, by = 'head' }) {
  return tx(() => {
    const topic = get('SELECT * FROM topics WHERE id=?', Number(topic_id));
    if (!topic) fail(`Không có chủ đề #${topic_id}`);
    const dept = mustDept(topic.dept, { active: true });
    const n = int(episodes, 1, 20, 'Số tập');
    const date = planned_for || today();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail('planned_for phải dạng YYYY-MM-DD');

    let team;
    if (team_id) team = mustTeam(team_id);
    else if (topic.team_id && mustTeam(topic.team_id).status === 'active') team = mustTeam(topic.team_id);
    else {
      const cands = all("SELECT * FROM teams WHERE dept=? AND status='active'", topic.dept)
        .map((t) => ({ t, free: t.capacity_per_day - usedOn(t.id, date) }))
        .sort((a, b) => b.free - a.free);
      if (!cands.length) fail(`Phòng "${topic.dept}" chưa có đội nào đang hoạt động — trưởng phòng cần đề xuất thêm đội (propose_change) để giám đốc duyệt`);
      team = cands[0].t;
    }
    if (team.dept !== topic.dept || team.status !== 'active') fail(`Đội #${team.id} không thuộc phòng "${topic.dept}" hoặc đã giải thể`);
    const free = team.capacity_per_day - usedOn(team.id, date);
    if (n > free) fail(`${team.name} chỉ còn ${Math.max(free, 0)}/${team.capacity_per_day} suất video ngày ${date}, không nhận nổi ${n} tập. Giảm số tập, đổi ngày, chọn đội khác hoặc đề xuất thêm đội.`);

    const folderAbs = topic.folder ? path.resolve(ROOT, topic.folder) : path.join(CONTENT_DIR, topic.dept, `T${topic.id}-${slugify(topic.text, 40) || 'chu-de'}`);
    fs.mkdirSync(folderAbs, { recursive: true });
    const briefPath = path.join(folderAbs, 'brief.md');
    if (!fs.existsSync(briefPath)) fs.writeFileSync(briefPath, `# Chủ đề #${topic.id} — ${dept.name}\n\n**Chủ đề:** ${topic.text}\n\n**Ghi chú của giám đốc:** ${topic.brief || '(không có)'}\n\n**Đội phụ trách:** ${team.name} (đội #${team.id})\n`, 'utf8');

    const last = get('SELECT COALESCE(MAX(episode),0) m FROM videos WHERE topic_id=?', topic.id).m;
    const videos = [];
    for (let i = 1; i <= n; i++) {
      const ep = last + i;
      const id = `${topic.dept.toUpperCase()}-T${topic.id}-E${pad(ep)}`;
      const epDir = path.join(folderAbs, `ep${pad(ep)}`);
      fs.mkdirSync(path.join(epDir, 'assets'), { recursive: true });
      fs.mkdirSync(path.join(epDir, 'final'), { recursive: true });
      run('INSERT INTO videos(id,dept,team_id,topic_id,episode,title,planned_for,folder,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)', id, topic.dept, team.id, topic.id, ep, `${topic.text} — tập ${ep}`, date, rel(epDir), now(), now());
      videos.push(id);
    }
    run("UPDATE topics SET status='assigned', team_id=?, folder=? WHERE id=?", team.id, rel(folderAbs), topic.id);
    logEvent({ actor: by, dept: topic.dept, team_id: team.id, kind: 'assign', message: `Giao chủ đề #${topic.id} cho ${team.name}: ${n} video (${videos.join(', ')}) ngày ${date}` });
    return { topic_id: topic.id, team_id: team.id, team: team.name, topic_folder: rel(folderAbs), videos, planned_for: date };
  });
}

export function setVideoStage({ video_id, stage, note = '', by = 'agent' }) {
  return tx(() => {
    const v = mustVideo(video_id);
    if (!STAGES.includes(stage)) fail(`Giai đoạn phải là: ${STAGES.join(' | ')}`);
    const fin = ['ready', 'published', 'rejected'].includes(stage);
    run('UPDATE videos SET stage=?, updated_at=?, finished_at=? WHERE id=?', stage, now(), fin ? now() : null, v.id);
    if (fin) {
      run("UPDATE videos SET needs_help=0, help_reason='' WHERE id=?", v.id);
      run("UPDATE members SET status='idle', task='', video_id=NULL, updated_at=? WHERE video_id=?", now(), v.id);
    }
    logEvent({ actor: by, dept: v.dept, team_id: v.team_id, video_id: v.id, kind: 'stage', message: `${v.id}: ${v.stage} → ${stage}${note ? ` — ${note}` : ''}` });
    return { video_id: v.id, from: v.stage, to: stage };
  });
}

export function getVideo(video_id) {
  const v = mustVideo(video_id);
  const abs = path.resolve(ROOT, v.folder);
  const files = [];
  const walk = (dir, depthLeft) => {
    if (!fs.existsSync(dir) || depthLeft < 0) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p, depthLeft - 1);
      else files.push(rel(p));
    }
  };
  walk(abs, 2);
  const topic = get('SELECT * FROM topics WHERE id=?', v.topic_id);
  const team = get('SELECT id,name,dept FROM teams WHERE id=?', v.team_id);
  return { ...v, team, topic: topic && { id: topic.id, text: topic.text, brief: topic.brief, folder: topic.folder }, files };
}

export function listVideos({ dept, stage, team_id, active_only = false, limit = 100 } = {}) {
  const w = [];
  const p = [];
  if (dept) (w.push('dept=?'), p.push(dept));
  if (stage) (w.push('stage=?'), p.push(stage));
  if (team_id) (w.push('team_id=?'), p.push(Number(team_id)));
  if (active_only) w.push(`stage IN (${ACTIVE_STAGES.map((s) => `'${s}'`).join(',')})`);
  return all(`SELECT id,dept,team_id,topic_id,episode,title,stage,needs_help,help_reason,planned_for,folder,updated_at FROM videos ${w.length ? 'WHERE ' + w.join(' AND ') : ''} ORDER BY created_at DESC LIMIT ?`, ...p, limit);
}

// ---------- trạng thái nhân sự ----------
const ALIAS_WHO = { ideator_a: 'Claude', ideator_b: 'Claude chốt', ideator_c: 'Codex', ideator_d: 'Codex', planner: 'Claude duyệt', visual_director: 'Claude duyệt' };
export function reportStatus({ team_id, role, status, task = '', video_id = null, by }) {
  // Vai cũ → vị trí core; ghi rõ ai trong vị trí đó đang làm (vd "Codex: phản biện vòng 2").
  if (ALIAS_WHO[role] && task && !String(task).startsWith(ALIAS_WHO[role])) task = `${ALIAS_WHO[role]}: ${task}`;
  role = coreRole(role);
  return tx(() => {
    const t = mustTeam(team_id);
    if (t.status !== 'active') fail(`Đội #${team_id} đã giải thể`);
    if (!MEMBER_STATUS.includes(status)) fail(`Trạng thái phải là: ${MEMBER_STATUS.join(' | ')}`);
    const m = get('SELECT * FROM members WHERE team_id=? AND role=?', t.id, role);
    if (!m) fail(`Đội #${team_id} không có vai "${role}". Các vai: ${ROSTER.map((r) => r.role).join(', ')}`);
    if (video_id) {
      const v = mustVideo(video_id);
      if (v.team_id !== t.id) fail(`Video ${video_id} không thuộc đội #${team_id}`);
    }
    const nextTask = status === 'idle' || status === 'offline' ? '' : String(task).slice(0, 300);
    const nextVideo = status === 'idle' || status === 'offline' ? null : video_id || m.video_id;
    const changed = m.status !== status || m.task !== nextTask;
    run('UPDATE members SET status=?, task=?, video_id=?, updated_at=? WHERE id=?', status, nextTask, nextVideo, now(), m.id);
    if (changed) logEvent({ actor: by || `${t.id}/${role}`, dept: t.dept, team_id: t.id, video_id: nextVideo || video_id, kind: 'status', message: `${m.label}: ${status}${nextTask ? ` — ${nextTask}` : ''}` });
    return { team_id: t.id, role, status, task: nextTask };
  });
}

export function escalate({ video_id, reason, role = 'producer', by }) {
  role = coreRole(role);
  return tx(() => {
    const v = mustVideo(video_id);
    if (!reason) fail('Cần nêu lý do/vướng mắc để Claude hỗ trợ');
    run('UPDATE videos SET needs_help=1, help_reason=?, updated_at=? WHERE id=?', String(reason).slice(0, 600), now(), v.id);
    run("UPDATE members SET status='blocked', task=?, video_id=?, updated_at=? WHERE team_id=? AND role=?", `Vướng: ${String(reason).slice(0, 200)}`, v.id, now(), v.team_id, role);
    logEvent({ actor: by || `${v.team_id}/${role}`, dept: v.dept, team_id: v.team_id, video_id: v.id, kind: 'escalate', message: `${v.id} cần Claude hỗ trợ: ${reason}` });
    return { video_id: v.id, needs_help: true };
  });
}

export function resolveEscalation({ video_id, note = '', by = 'support' }) {
  return tx(() => {
    const v = mustVideo(video_id);
    run("UPDATE videos SET needs_help=0, help_reason='', updated_at=? WHERE id=?", now(), v.id);
    run("UPDATE members SET status='idle', task='', video_id=NULL, updated_at=? WHERE team_id=? AND video_id=? AND status='blocked'", now(), v.team_id, v.id);
    logEvent({ actor: by, dept: v.dept, team_id: v.team_id, video_id: v.id, kind: 'escalate', message: `${v.id} đã gỡ vướng${note ? `: ${note}` : ''}` });
    return { video_id: v.id, needs_help: false };
  });
}

export const recentEvents = (limit = 40) => all('SELECT * FROM events ORDER BY id DESC LIMIT ?', limit);

/** Tài khoản (claude/codex) đang hoặc nhiều khả năng sẽ chạy việc của 1 phòng — để dashboard trỏ đúng tab Văn phòng 2D.
 *  Việc đang 'running' thì lấy đúng account_id đã dùng; không thì đoán bằng tài khoản ưu tiên cao nhất còn dùng được
 *  (ước lượng đơn giản, không tính capped/giờ hồi như pool.pickAccount — chỉ để gợi ý link, không ảnh hưởng vận hành). */
function officeAccountHint(dept, provider) {
  const running = get("SELECT account_id aid FROM jobs WHERE dept=? AND provider=? AND status='running' ORDER BY id DESC LIMIT 1", dept, provider);
  // Cùng luật với pool.eligibleFor: phòng đã được cấp tài khoản → chỉ tài khoản của phòng; chưa → tài khoản dùng chung.
  const own = get('SELECT 1 FROM accounts WHERE provider=? AND dept=?', provider, dept);
  const row = running?.aid
    ? get('SELECT provider,label,home,dept FROM accounts WHERE id=?', running.aid)
    : get(`SELECT provider,label,home,dept FROM accounts WHERE provider=? AND enabled=1 AND status='ready' AND ${own ? 'dept=?' : 'dept IS NULL'} ORDER BY priority,id LIMIT 1`, provider, ...(own ? [dept] : []));
  return row ? { provider: row.provider, label: row.label, is_default: !row.home, dept: row.dept || null, live: !!running?.aid } : null;
}

// ---------- tổng quan cho dashboard / Claude ----------
export function overview({ dept: only } = {}) {
  const day = today();
  const depts = all('SELECT * FROM departments ORDER BY status ASC, created_at ASC').filter((d) => !only || d.slug === only);
  const totals = { departments_active: 0, departments_closed: 0, teams: 0, members: 0, members_working: 0, members_blocked: 0, members_stale: 0, videos_active: 0, videos_planned_today: 0, videos_done_today: 0, target_today: 0, capacity_today: 0, topics_open: 0, pending_proposals: 0, needs_help: 0 };
  const attention = [];
  const out = depts.map((d) => {
    const teams = d.status === 'active' ? all("SELECT * FROM teams WHERE dept=? AND status='active' ORDER BY id", d.slug) : [];
    const capacity = teams.reduce((s, t) => s + t.capacity_per_day, 0);
    const gap = Math.max(0, d.daily_target - capacity);
    const planned = get("SELECT COUNT(*) c FROM videos WHERE dept=? AND planned_for=? AND stage!='rejected'", d.slug, day).c;
    const done = get(`SELECT COUNT(*) c FROM videos WHERE dept=? AND planned_for=? AND stage IN ('ready','published')`, d.slug, day).c;
    const pend = all("SELECT * FROM proposals WHERE dept=? AND status='pending' ORDER BY id", d.slug).map((x) => ({ ...x, payload: JSON.parse(x.payload) }));
    const teamsOut = teams.map((t) => {
      const ORDER = ROSTER.map((r) => r.role);
      const members = all('SELECT * FROM members WHERE team_id=?', t.id).sort((a, b) => ORDER.indexOf(a.role) - ORDER.indexOf(b.role)).map((m) => {
        const mins = Math.round((Date.now() - Date.parse(m.updated_at)) / 60000);
        const stale = m.status === 'working' && mins >= STALE_MINUTES;
        return { id: m.id, role: m.role, label: m.label, duty: ROSTER.find((r) => r.role === m.role)?.duty || '', engine: m.engine, on_call: !!m.on_call, status: m.status, task: m.task, video_id: m.video_id, minutes_since_update: mins, stale };
      });
      const videos = all(`SELECT id,episode,title,stage,needs_help,help_reason,planned_for FROM videos WHERE team_id=? AND (stage IN (${ACTIVE_STAGES.map((s) => `'${s}'`).join(',')}) OR planned_for=?) ORDER BY id`, t.id, day);
      return { id: t.id, name: t.name, capacity_per_day: t.capacity_per_day, used_today: usedOn(t.id, day), members, videos };
    });
    const core = teamsOut.flatMap((t) => t.members.filter((m) => !m.on_call));
    const dMembers = teamsOut.flatMap((t) => t.members);
    const working = dMembers.filter((m) => m.status === 'working').length;
    const blocked = dMembers.filter((m) => m.status === 'blocked').length;
    const stale = dMembers.filter((m) => m.stale).length;
    const active = get(`SELECT COUNT(*) c FROM videos WHERE dept=? AND stage IN (${ACTIVE_STAGES.map((s) => `'${s}'`).join(',')})`, d.slug).c;
    const help = get('SELECT COUNT(*) c FROM videos WHERE dept=? AND needs_help=1', d.slug).c;
    const open = get("SELECT COUNT(*) c FROM topics WHERE dept=? AND status='open'", d.slug).c;
    const proposedTopics = d.status === 'active' ? all("SELECT t.id,t.text,t.reason,t.team_id,tm.name team_name FROM topics t LEFT JOIN teams tm ON tm.id=t.team_id WHERE t.dept=? AND t.status='proposed' ORDER BY t.id", d.slug) : [];
    const surplus = d.status === 'active' ? Math.max(0, Math.floor((capacity - d.daily_target) / DEFAULT_TEAM_CAPACITY)) : 0;

    if (d.status === 'active') {
      totals.departments_active++;
      totals.teams += teams.length;
      totals.members += core.length;
      totals.members_working += working;
      totals.members_blocked += blocked;
      totals.members_stale += stale;
      totals.videos_active += active;
      totals.videos_planned_today += planned;
      totals.videos_done_today += done;
      totals.target_today += d.daily_target;
      totals.capacity_today += capacity;
      totals.topics_open += open;
      totals.pending_proposals += pend.length;
      totals.needs_help += help;
      if (gap > 0 && !pend.length) attention.push({ kind: 'capacity', dept: d.slug, message: `Phòng "${d.name}" thiếu năng lực ${gap} video/ngày (chỉ tiêu ${d.daily_target}, năng lực ${capacity})${d.review_requested ? ' — đang chờ trưởng phòng đề xuất' : ''}` });
      if (help) attention.push({ kind: 'help', dept: d.slug, message: `${help} video của "${d.name}" đang vướng, cần Claude hỗ trợ` });
      if (stale) attention.push({ kind: 'stale', dept: d.slug, message: `${stale} thành viên của "${d.name}" báo "đang làm" nhưng im lặng > ${STALE_MINUTES} phút` });
    } else totals.departments_closed++;
    for (const tp of proposedTopics) attention.push({ kind: 'topic_proposal', dept: d.slug, topic_id: tp.id, message: `${tp.team_name || 'Đội'} (${d.name}) đề xuất chủ đề #${tp.id}: "${tp.text}" — ${tp.reason.slice(0, 200)}` });
    for (const p of pend) attention.push({ kind: 'proposal', dept: d.slug, proposal_id: p.id, message: `Chờ duyệt #${p.id} (${d.name}): ${p.type === 'add_team' ? `thêm ${p.payload.count} đội` : `giải thể đội #${p.payload.team_id}`} — ${p.reason}` });

    return {
      slug: d.slug, name: d.name, description: d.description, status: d.status, daily_target: d.daily_target, review_requested: !!d.review_requested, auto_topics: !!d.auto_topics, topics_proposed: proposedTopics.length,
      capacity, gap_videos: gap, suggested_new_teams: Math.ceil(gap / DEFAULT_TEAM_CAPACITY), surplus_teams: surplus,
      planned_today: planned, done_today: done, active_videos: active, needs_help: help, topics_open: open,
      members_total: core.length, members_working: working, members_blocked: blocked,
      teams: teamsOut, pending_proposals: pend,
      office: d.status === 'active' ? { claude: officeAccountHint(d.slug, 'claude'), codex: officeAccountHint(d.slug, 'codex') } : null,
    };
  });
  return { generated_at: now(), today: day, totals, attention, departments: out, events: recentEvents(30) };
}

// ---------- dữ liệu mẫu (đúng ví dụ: Thể thao 2 đội/4 video, IT 1 đội/1 video) ----------
export function seedDemo() {
  return tx(() => {
    if (get('SELECT COUNT(*) c FROM departments').c) fail('Đã có dữ liệu — không nạp demo để tránh ghi đè. Xoá studio/data/studio.db nếu muốn làm lại.');
    createDepartment({ slug: 'sport', name: 'Thể thao', description: 'Tin nóng, highlight, mẹo luyện tập', daily_target: 4, initial_teams: 2, by: 'demo' });
    createDepartment({ slug: 'it', name: 'IT', description: 'Công nghệ, AI, mẹo phần mềm', daily_target: 1, initial_teams: 1, by: 'demo' });
    const t1 = submitTopic({ dept: 'sport', text: '3 sai lầm khi chạy bộ khiến bạn chấn thương', by: 'demo' }).topic_id;
    const t2 = submitTopic({ dept: 'sport', text: 'Bóng đá: pha xử lý kinh điển tuần qua', by: 'demo' }).topic_id;
    const t3 = submitTopic({ dept: 'it', text: '5 phím tắt Windows ít người biết', by: 'demo' }).topic_id;
    submitTopic({ dept: 'it', text: 'AI viết code: dùng sao cho đỡ lỗi', by: 'demo' });
    const a = assignTopic({ topic_id: t1, episodes: 2, by: 'demo' });
    const b = assignTopic({ topic_id: t2, episodes: 2, by: 'demo' });
    const c = assignTopic({ topic_id: t3, episodes: 1, by: 'demo' });
    setVideoStage({ video_id: a.videos[0], stage: 'production', by: 'demo' });
    setVideoStage({ video_id: a.videos[1], stage: 'planning', by: 'demo' });
    setVideoStage({ video_id: b.videos[0], stage: 'ideation', by: 'demo' });
    setVideoStage({ video_id: c.videos[0], stage: 'review', by: 'demo' });
    reportStatus({ team_id: a.team_id, role: 'producer', status: 'working', task: 'Dựng video tập 1 bằng ffmpeg', video_id: a.videos[0], by: 'demo' });
    reportStatus({ team_id: a.team_id, role: 'script', status: 'working', task: 'Codex: viết kịch bản tập 2', video_id: a.videos[1], by: 'demo' });
    reportStatus({ team_id: b.team_id, role: 'idea', status: 'working', task: 'Claude: đưa ý tưởng vòng 1', video_id: b.videos[0], by: 'demo' });
    reportStatus({ team_id: c.team_id, role: 'qc', status: 'working', task: 'QC video trước khi duyệt', video_id: c.videos[0], by: 'demo' });
    setDailyTarget({ slug: 'sport', target: 6, by: 'demo' });
    proposeChange({ dept: 'sport', type: 'add_team', count: 1, reason: 'Chỉ tiêu tăng lên 6 video/ngày nhưng 2 đội chỉ làm được 4; cần thêm 1 đội.', by: 'head:sport' });
    return { ok: true };
  });
}

// Cho các module khác (pool, worker) dùng chung kết nối & giao dịch.
export const sql = { get, all, run, tx, now, rel };

export function closeDb() {
  if (_db) {
    _db.close();
    _db = undefined;
  }
}
