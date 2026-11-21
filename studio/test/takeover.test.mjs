// Giám đốc duyệt cho AI khác làm thay việc của AI bị kẹt (21/11/2026): Claude làm thay Codex ở việc kế hoạch.
// Phủ: từ chối đúng chỗ, ngưỡng dừng vòng lặp chờ Codex, chạy lại với "thay-codex", thu hồi, đề nghị ở "Cần chú ý".
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-takeover-'));
const stubDir = path.join(tmp, 'stub');
fs.mkdirSync(stubDir);
const stub = fileURLToPath(new URL('./helpers/provider-stub.mjs', import.meta.url));
Object.assign(process.env, {
  STUDIO_DB: path.join(tmp, 'db.sqlite'), STUDIO_CONTENT: path.join(tmp, 'content'), STUDIO_ACCOUNTS: path.join(tmp, 'accounts'),
  STUDIO_TICK_MS: '80', STUDIO_MIN_LIMIT_MS: '200', STUDIO_PARK_PAD_MS: '150', STUDIO_NOACC_POLL_MS: '300', STUDIO_NO_AUTOSTART: '1',
  STUDIO_CODEX_WAIT_MS: '150', STUDIO_CODEX_WAIT_MAX: '2', CLAUDE_JS: stub, CODEX_JS: stub, STUB_DIR: stubDir,
});
const S = await import('../src/db.mjs');
const P = await import('../src/pool.mjs');
const R = await import('../src/runners.mjs');
const { runWorker, requestStop } = await import('../src/worker.mjs');

const mode = (label, m) => fs.writeFileSync(path.join(stubDir, `${label}.mode`), m);
const calls = () => (fs.existsSync(path.join(stubDir, 'calls.log')) ? fs.readFileSync(path.join(stubDir, 'calls.log'), 'utf8').trim().split('\n') : []);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitFor(fn, what, ms = 15000) {
  const t0 = Date.now();
  for (;;) {
    const v = fn();
    if (v) return v;
    if (Date.now() - t0 > ms) assert.fail(`Quá hạn chờ: ${what}\n${calls().join('\n')}\nSự kiện:\n${S.recentEvents(12).map((e) => e.message).join('\n')}`);
    await sleep(60);
  }
}
const job = (id) => P.getJob(id);
const newTopic = (text) => {
  const t = S.submitTopic({ dept: 'sport', text }).topic_id;
  S.assignTopic({ topic_id: t, episodes: 1 });
  return t;
};

let worker;
after(async () => {
  requestStop();
  await worker;
});

test('khởi tạo: phòng, tài khoản, worker', async () => {
  S.createDepartment({ name: 'Thể thao', slug: 'sport', daily_target: 2, initial_teams: 1 });
  for (const [p, l] of [['claude', 'a'], ['codex', 'x']]) {
    P.addAccount({ provider: p, label: l, owner: `Người ${l}`, priority: 1, ready: true });
    mode(l, 'ok');
  }
  mode('a', 'codexwait');
  worker = runWorker({ tickMs: 80 });
  await waitFor(() => P.workerState().alive, 'worker sống');
});

test('1) Codex "dùng được" mà vẫn kẹt liên tiếp → dừng vòng lặp (CODEX-KẸT), hiện đề nghị duyệt thay thế, không phải job_human', async () => {
  const { job_id } = P.enqueueJob({ kind: 'plan', topic_id: newTopic('Chạy bộ đúng cách') });
  await waitFor(() => job(job_id).status === 'needs_human', 'dừng sau 2 lần kẹt Codex');
  assert.match(job(job_id).last_error, /^CODEX-KẸT: .*takeover \d+ claude/);
  assert.equal(job(job_id).payload.codex_waits, 2);
  assert.equal(calls().filter((c) => c.startsWith('claude a')).length, 2, 'đúng 2 phiên Claude rồi thôi (không đốt hạn mức)');
  const att = P.poolOverview().attention;
  const offer = att.find((x) => x.kind === 'takeover_offer' && x.job_id === job_id);
  assert.ok(offer, 'có đề nghị duyệt thay thế');
  assert.deepEqual([offer.for, offer.by], ['codex', 'claude']);
  assert.ok(!att.some((x) => x.kind === 'job_human' && x.job_id === job_id), 'không báo trùng thành "cần người xử lý"');
  globalThis.stuck = job_id;
});

test('2) duyệt → việc xếp chạy lại, prompt có "thay-codex", chạy xong; dấu duyệt nằm trong payload; hết đề nghị', async () => {
  const id = globalThis.stuck;
  const before = calls().length;
  const r = P.approveTakeover({ job_id: id, by: 'claude', note: 'Codex lỗi sandbox' });
  assert.equal(r.status, 'queued');
  assert.equal(r.takeover.by, 'claude');
  assert.equal(r.takeover.for, 'codex');
  assert.equal(job(id).payload.codex_waits, undefined, 'xoá bộ đếm kẹt');
  assert.ok(S.recentEvents(10).some((e) => /GIÁM ĐỐC DUYỆT: Claude làm thay Codex ở việc #\d+/.test(e.message)));
  await waitFor(() => job(id).status === 'succeeded', 'chạy xong khi Claude làm thay');
  assert.match(calls().slice(before).join('\n'), /\/make-plan \d+ 1 2 thay-codex/);
  assert.equal(job(id).payload.takeover.note, 'Codex lỗi sandbox');
  assert.ok(!P.poolOverview().attention.some((x) => x.kind === 'takeover_offer' && x.job_id === id));
});

test('3) buildClaudeArgs: lời dặn thay thế chỉ có khi đã duyệt, và chỉ cho việc plan', () => {
  const sys = (j) => { const a = R.buildClaudeArgs(j, { kind: 'subscription' }); return a[a.indexOf('--append-system-prompt') + 1]; };
  const base = { kind: 'plan', attempts: 0, resumed: false, payload: {} };
  assert.doesNotMatch(sys(base), /GIÁM ĐỐC ĐÃ DUYỆT/);
  const withT = sys({ ...base, payload: { takeover: { by: 'claude', for: 'codex', approved_at: '2026-11-21T01:00:00Z', note: 'thử' } } });
  assert.match(withT, /GIÁM ĐỐC ĐÃ DUYỆT \(2026-11-21\): Claude làm THAY Codex/);
  assert.match(withT, /KHÔNG kết thúc bằng CODEX_WAIT/);
  assert.match(withT, /Ghi chú của giám đốc: thử/);
  assert.doesNotMatch(sys({ ...base, kind: 'qc', payload: { takeover: { by: 'claude', for: 'codex' } } }), /GIÁM ĐỐC ĐÃ DUYỆT/);
});

test('4) từ chối đúng chỗ: loại việc chưa hỗ trợ, AI không hỗ trợ, đang chạy, đang chờ chính Claude', async () => {
  const video = S.sql.get('SELECT id FROM videos LIMIT 1').id;
  fs.mkdirSync(path.resolve(S.ROOT, S.getVideo(video).folder), { recursive: true });
  fs.writeFileSync(path.resolve(S.ROOT, S.getVideo(video).folder, 'storyboard.json'), JSON.stringify({ video_id: video, status: 'APPROVED', scenes: [] }));
  const produce = P.enqueueJob({ kind: 'produce', video_id: video }).job_id;
  assert.throws(() => P.approveTakeover({ job_id: produce }), /Chưa có cách cho AI khác làm thay việc loại "produce"/);
  assert.throws(() => P.approveTakeover({ job_id: 99999 }), /Không có việc #99999/);
  mode('a', 'ok');
  const t = newTopic('Giãn cơ');
  const plan = P.enqueueJob({ kind: 'plan', topic_id: t }).job_id;
  assert.throws(() => P.approveTakeover({ job_id: plan, by: 'codex' }), /Chưa hỗ trợ codex làm thay/);
  await waitFor(() => job(plan).status === 'succeeded', 'plan xong');
  assert.throws(() => P.approveTakeover({ job_id: plan }), /đang succeeded/);
  P.setJob(plan, { status: 'waiting_limit', wait_reason: 'limit' });
  assert.throws(() => P.approveTakeover({ job_id: plan }), /đang chờ CLAUDE/);
  P.setJob(plan, { status: 'succeeded', wait_reason: '' });
});

test('5) việc đã duyệt mà vẫn kết thúc bằng CODEX_WAIT → needs_human (không rơi lại vòng lặp chờ Codex); thu hồi được', async () => {
  mode('a', 'codexwait-ignore');
  const t = newTopic('Khởi động trước khi chạy');
  const id = P.enqueueJob({ kind: 'plan', topic_id: t }).job_id;
  await waitFor(() => job(id).status === 'needs_human', 'kẹt lần đầu');
  P.approveTakeover({ job_id: id });
  await waitFor(() => job(id).status === 'needs_human' && /Đã duyệt Claude làm thay Codex nhưng việc vẫn kết thúc bằng CODEX_WAIT/.test(job(id).last_error), 'phòng thủ chặn CODEX_WAIT');
  const r = P.revokeTakeover(id);
  assert.equal(r.takeover, null);
  assert.equal(job(id).payload.takeover, undefined);
  assert.throws(() => P.revokeTakeover(id), /không có duyệt thay thế/);
});

test('6) duyệt Gemini làm thay: prompt có "thay-codex=gemini", chạy xong, payload ghi by=gemini', async () => {
  mode('a', 'codexwait');
  const t = newTopic('Bài tập cổ vai');
  const id = P.enqueueJob({ kind: 'plan', topic_id: t }).job_id;
  await waitFor(() => job(id).status === 'needs_human', 'kẹt Codex');
  const before = calls().length;
  const r = P.approveTakeover({ job_id: id, by: 'gemini', note: 'Codex bận sản xuất' });
  assert.equal(r.takeover.by, 'gemini');
  await waitFor(() => job(id).status === 'succeeded', 'chạy xong khi Gemini làm thay');
  assert.match(calls().slice(before).join('\n'), /\/make-plan \d+ 1 2 thay-codex=gemini/);
  assert.equal(job(id).payload.takeover.by, 'gemini');
});

test('7) đã duyệt Gemini mà Gemini cũng không làm được (TAKEOVER_WAIT) → needs_human nói rõ, không rơi lại vòng chờ Codex, không tự đổi sang Claude', async () => {
  mode('a', 'codexwait');
  const t = newTopic('Giãn cơ cổ chân');
  const id = P.enqueueJob({ kind: 'plan', topic_id: t }).job_id;
  await waitFor(() => job(id).status === 'needs_human', 'kẹt Codex');
  mode('a', 'takeoverwait');
  P.approveTakeover({ job_id: id, by: 'gemini' });
  await waitFor(() => job(id).status === 'needs_human' && /Đã duyệt Gemini làm thay Codex nhưng Gemini cũng không làm được: Gemini BUSY/.test(job(id).last_error), 'dừng chờ giám đốc quyết');
  assert.equal(job(id).payload.takeover.by, 'gemini', 'vẫn giữ duyệt Gemini, không tự đổi AI');
  const offer = P.poolOverview().attention.find((x) => x.job_id === id);
  assert.ok(offer, 'hiện ở "Cần giám đốc chú ý" để quyết');
  mode('a', 'ok');
});
