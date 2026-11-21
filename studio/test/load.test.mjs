// Bảng cân bằng tải ba agent (giám đốc chốt 20/11/2026): số phút chạy thật theo từng bên, Claude chỉ tính phần tự làm.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-load-'));
Object.assign(process.env, {
  STUDIO_DB: path.join(tmp, 'db.sqlite'), STUDIO_CONTENT: path.join(tmp, 'content'), STUDIO_ACCOUNTS: path.join(tmp, 'accounts'), STUDIO_NO_AUTOSTART: '1',
});
const S = await import('../src/db.mjs');
const P = await import('../src/pool.mjs');
const R = await import('../src/runners.mjs');
const { run, now } = S.sql;

const NOW = Date.parse('2026-11-20T12:00:00Z');
const ago = (min) => new Date(NOW - min * 60_000).toISOString();
let seq = 0;
const addJob = (provider, kind, startMinAgo, minutes, status = 'succeeded') =>
  Number(run('INSERT INTO jobs(kind,provider,title,status,next_run_at,started_at,finished_at,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)', kind, provider, `việc ${++seq}`, status, now(), ago(startMinAgo), ago(startMinAgo - minutes), now(), now()).lastInsertRowid);
const addCall = (provider, mode, startMinAgo, minutes, { job_id = null, outcome = 'ok' } = {}) => S.recordCall({ provider, mode, job_id, started_ms: NOW - startMinAgo * 60_000, ended_ms: NOW - (startMinAgo - minutes) * 60_000, outcome });

test('chưa đủ số liệu thì nói chưa đủ, không bịa cân bằng hay lệch', () => {
  const r = P.loadReport({ nowMs: NOW });
  assert.equal(r.status, 'no_data');
  assert.equal(r.total_minutes, 0);
  for (const p of P.PROVIDERS) assert.equal(r.providers[p].share_pct, 0);
});

test('Claude chỉ tính phần tự làm: trừ thời gian Codex/Gemini chạy bên trong việc nền của Claude', () => {
  // việc plan của Claude kéo dài 60 phút, trong đó Codex làm 20 phút và Gemini làm 10 phút
  const plan = addJob('claude', 'plan', 120, 60);
  addCall('codex', 'write-storyboard', 100, 20, { job_id: plan });
  addCall('gemini', 'images', 70, 10, { job_id: plan });
  const r = P.loadReport({ nowMs: NOW });
  assert.equal(r.providers.claude.minutes, 30, 'Claude: 60 − 20 − 10');
  assert.equal(r.providers.codex.minutes, 20);
  assert.equal(r.providers.gemini.minutes, 10);
  assert.equal(r.providers.claude.jobs, 1);
  assert.equal(r.providers.codex.calls, 1);
  assert.equal(r.providers.gemini.calls, 1);
  assert.equal(r.total_minutes, 60, 'tổng không đếm trùng thời gian chờ');
  assert.equal(r.providers.claude.share_pct, 50);
  assert.equal(r.status, 'skewed', 'Claude 50% > 45%');
  assert.match(r.notes.join(' '), /Claude 50%/);
});

test('việc sản xuất của Codex tính nguyên, và trừ không bao giờ ra số âm', () => {
  addJob('codex', 'produce', 300, 25);
  // lượt gọi dài hơn cả việc bao nó (lệch đồng hồ) không được làm phút của Claude âm
  const short = addJob('claude', 'qc', 200, 3);
  addCall('gemini', 'look', 199, 8, { job_id: short });
  const r = P.loadReport({ nowMs: NOW });
  assert.ok(r.providers.claude.minutes >= 30 - 0.001, `Claude không âm: ${r.providers.claude.minutes}`);
  assert.equal(r.providers.codex.minutes, 20 + 25);
});

test('chỉ tính đúng cửa sổ ngày: việc cũ hơn cửa sổ không được đếm', () => {
  addJob('claude', 'rescue', 3000, 15); // ≈ 2 ngày trước, ngoài cửa sổ 1 ngày
  const narrow = P.loadReport({ nowMs: NOW, days: 1 });
  const wide = P.loadReport({ nowMs: NOW, days: 30 });
  assert.equal(Math.round((wide.providers.claude.minutes - narrow.providers.claude.minutes) * 10) / 10, 15, 'cửa sổ rộng thấy thêm đúng 15 phút');
  assert.equal(wide.providers.claude.jobs - narrow.providers.claude.jobs, 1);
});

test('cân bằng khi mỗi bên trong 20–45%; việc sau thời điểm đo không bị đếm', () => {
  // bộ số riêng cách đây 200 ngày: mỗi bên 30 phút
  const far = 200 * 24 * 60;
  addJob('claude', 'qc', far + 60, 30);
  addJob('codex', 'produce', far + 60, 30);
  addCall('gemini', 'images', far + 60, 30);
  const atThen = NOW - far * 60_000;
  const bal = P.loadReport({ nowMs: atThen, days: 1 });
  assert.equal(bal.status, 'balanced', JSON.stringify(bal.providers));
  for (const p of P.PROVIDERS) assert.equal(bal.providers[p].share_pct, 33.3);
  assert.equal(bal.total_minutes, 90, 'các việc xảy ra sau thời điểm đo (đều mới hơn) không lọt vào');
});

test('đếm số lần hết limit theo từng bên từ nhật ký sự kiện', () => {
  const ts = new Date(NOW - 60_000).toISOString();
  for (const who of ['Claude', 'Codex', 'Codex', 'Gemini']) {
    run('INSERT INTO events(ts,actor,kind,message) VALUES(?,?,?,?)', ts, 'system', 'account', `Tài khoản ${who} a@b.c [ghế main] HẾT LIMIT — chưa rõ giờ hồi`);
  }
  run('INSERT INTO events(ts,actor,kind,message) VALUES(?,?,?,?)', ts, 'system', 'account', 'Tài khoản Codex a@b.c [ghế main] đã hồi limit — sẵn sàng chạy lại');
  const r = P.loadReport({ nowMs: NOW });
  assert.deepEqual([r.providers.claude.limits, r.providers.codex.limits, r.providers.gemini.limits], [1, 2, 1]);
});

test('callOutcome phân loại lượt gọi: ok, hết giờ, hết limit, lỗi đăng nhập, lỗi khác', () => {
  assert.equal(R.callOutcome({ code: 0, out: '', err: '', timedOut: false }), 'ok');
  assert.equal(R.callOutcome({ code: 0, out: '', err: '', timedOut: true }), 'timeout');
  assert.equal(R.callOutcome({ code: 1, out: '', err: 'You hit your usage limit, try again in 3 hours', timedOut: false }), 'limit');
  assert.equal(R.callOutcome({ code: 1, out: '', err: 'authentication required', timedOut: false }), 'auth');
  assert.equal(R.callOutcome({ code: 1, out: '', err: 'lỗi lạ', timedOut: false }), 'fail');
  assert.equal(R.callOutcome({ code: 0, out: '', err: '', timedOut: false }, { ok: false }), 'fail', 'thoát 0 nhưng công cụ báo không thành công');
});

test('lượt gọi lỗi được tính vào cột lỗi, nhưng hết limit không bị đếm hai lần', () => {
  const before = P.loadReport({ nowMs: NOW }).providers.gemini.failed;
  addCall('gemini', 'facts', 30, 1, { outcome: 'fail' });
  addCall('gemini', 'facts', 20, 1, { outcome: 'limit' });
  addCall('gemini', 'images', 10, 1, { outcome: 'no_image' });
  const g = P.loadReport({ nowMs: NOW }).providers.gemini;
  assert.equal(g.failed, before + 2, 'fail và no_image tính là lỗi; limit chỉ đếm qua sự kiện hết limit');
});

test('backfillCalls dựng lại lượt gọi từ log cũ: giờ, kết quả, suy ra việc nền chứa nó, chạy lại không ghi trùng', () => {
  const dir = path.join(tmp, 'old-logs');
  fs.mkdirSync(dir, { recursive: true });
  const T = Date.parse('2026-06-01T08:00:00Z'); // xa mọi dữ liệu của các test khác
  const mk = (name, text, startMs, minutes, meta) => {
    const f = path.join(dir, `${name}-${startMs}.log`);
    fs.writeFileSync(f, text);
    const end = new Date(startMs + minutes * 60_000);
    fs.utimesSync(f, end, end);
    if (meta) fs.writeFileSync(`${f}.meta.json`, JSON.stringify(meta));
  };
  // việc plan của Claude bao quanh 3 lượt gọi (09:00–10:30 giờ của test)
  const planStart = T;
  const plan = Number(run('INSERT INTO jobs(kind,provider,title,status,next_run_at,started_at,finished_at,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)', 'plan', 'claude', 'plan cũ', 'succeeded', now(), new Date(planStart).toISOString(), new Date(planStart + 100 * 60_000).toISOString(), now(), now()).lastInsertRowid);
  mk('codex-write-script', 'xong\n[thoát mã 0]\n', T + 5 * 60_000, 20, { job_id: plan, dept: 'it' }); // có sidecar
  mk('codex-ideate-codex', 'Error: You hit your usage limit, try again in 3 hours\n[thoát mã 1]\n', T + 30 * 60_000, 2); // không sidecar: suy ra từ giờ
  mk('gemini-run-images', 'treo\n[thoát mã -1, QUÁ GIỜ]\n', T + 40 * 60_000, 30);
  mk('codex-write-storyboard', 'không có dòng thoát', T + 500 * 60_000, 3); // log dở: coi là lỗi, không có việc nền bao
  const first = P.backfillCalls({ dir });
  assert.deepEqual([first.scanned, first.added], [4, 4]);
  assert.deepEqual(P.backfillCalls({ dir }), { scanned: 4, added: 0, skipped: 4 }, 'chạy lại không ghi trùng');
  const rows = S.sql.all("SELECT provider,mode,job_id,ms,outcome,dept FROM agent_calls WHERE started_at>='2026-06-01' AND started_at<'2026-06-02' ORDER BY started_at");
  assert.deepEqual(rows.map((r) => [r.provider, r.mode, r.outcome]), [['codex', 'write-script', 'ok'], ['codex', 'ideate-codex', 'limit'], ['gemini', 'images', 'timeout'], ['codex', 'write-storyboard', 'fail']]);
  assert.deepEqual(rows.map((r) => r.job_id), [plan, plan, plan, null], 'sidecar thắng, thiếu thì suy ra từ việc Claude đang chạy đúng lúc');
  assert.equal(rows[0].ms, 20 * 60_000);
  assert.equal(rows[0].dept, 'it');
  // Claude trong cửa sổ đó: 100 phút trừ 20 + 2 + 30 = 48 phút tự làm
  const r = P.loadReport({ nowMs: T + 200 * 60_000, days: 1 });
  assert.equal(r.providers.claude.minutes, 48);
  assert.equal(P.backfillCalls({ dir: path.join(tmp, 'khong-co-thu-muc') }).scanned, 0, 'thiếu thư mục log thì không lỗi');
});

test('poolOverview mang theo bảng tải cho dashboard', () => {
  const o = P.poolOverview();
  assert.ok(o.load && o.load.providers.gemini && typeof o.load.status === 'string');
});

test('poolOverview mang cả bảng 7 ngày (load) lẫn 24h (load_24h)', () => {
  const o = P.poolOverview();
  assert.equal(o.load.days, 7);
  assert.ok(o.load_24h && o.load_24h.days === 1 && o.load_24h.providers.codex && typeof o.load_24h.status === 'string');
});

test('cửa sổ 24h không thấy việc cách đây 4 ngày, cửa sổ 7 ngày thì thấy', () => {
  addJob('codex', 'produce', 4 * 24 * 60, 10);
  const day = P.loadReport({ nowMs: NOW, days: 1 });
  const week = P.loadReport({ nowMs: NOW, days: 7 });
  assert.equal(Math.round((week.providers.codex.minutes - day.providers.codex.minutes) * 10) / 10, 10, 'cửa sổ 7 ngày hơn đúng 10 phút');
  assert.equal(week.providers.codex.jobs - day.providers.codex.jobs, 1);
});
