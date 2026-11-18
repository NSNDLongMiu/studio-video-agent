// Kiểm thử worker đầu-cuối với Claude/Codex giả: xoay tài khoản, chờ hồi limit rồi tự chạy tiếp,
// không có tài khoản thì chờ, Codex kẹt thì Claude gỡ rồi chạy lại.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-worker-'));
const stubDir = path.join(tmp, 'stub');
fs.mkdirSync(stubDir);
const stub = fileURLToPath(new URL('./helpers/provider-stub.mjs', import.meta.url));
Object.assign(process.env, {
  STUDIO_DB: path.join(tmp, 'db.sqlite'), STUDIO_CONTENT: path.join(tmp, 'content'), STUDIO_ACCOUNTS: path.join(tmp, 'accounts'),
  STUDIO_TICK_MS: '80', STUDIO_MIN_LIMIT_MS: '200', STUDIO_PARK_PAD_MS: '150', STUDIO_NOACC_POLL_MS: '300', STUDIO_NO_AUTOSTART: '1',
  CLAUDE_JS: stub, CODEX_JS: stub, STUB_DIR: stubDir,
});
const S = await import('../src/db.mjs');
const P = await import('../src/pool.mjs');
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
const acct = (ref) => P.listAccounts().find((a) => `${a.provider}/${a.label}` === ref);

let worker;
after(async () => {
  requestStop();
  await worker;
});

test('khởi tạo: phòng, chủ đề, tài khoản, worker', async () => {
  S.createDepartment({ name: 'Thể thao', slug: 'sport', daily_target: 2, initial_teams: 1 });
  const topic = S.submitTopic({ dept: 'sport', text: 'Chạy bộ đúng cách' }).topic_id;
  const a = S.assignTopic({ topic_id: topic, episodes: 1 });
  fs.writeFileSync(path.resolve(S.ROOT, a.topic_folder, 'plan.md'), '# plan có sẵn');
  // Visual Director (vai trò thứ 6, 17/11/2026) phải duyệt storyboard trước khi produce chạy được -
  // test giả lập việc đó đã xong để không phải dựng lại toàn bộ chuỗi plan trong các test worker này.
  const videoFolder = S.getVideo(a.videos[0]).folder;
  fs.mkdirSync(path.resolve(S.ROOT, videoFolder), { recursive: true });
  fs.writeFileSync(path.resolve(S.ROOT, videoFolder, 'storyboard.json'), JSON.stringify({ video_id: a.videos[0], status: 'APPROVED', scenes: [] }));
  globalThis.ctx = { topic, video: a.videos[0], team: a.team_id, folder: a.topic_folder };
  for (const [p, l, pr] of [['claude', 'a', 1], ['claude', 'b', 2], ['codex', 'x', 1], ['codex', 'y', 2]]) {
    P.addAccount({ provider: p, label: l, owner: `Người ${l}`, priority: pr, ready: true });
    mode(l, 'ok');
  }
  assert.equal(P.listAccounts().length, 4);
  assert.ok(fs.readFileSync(path.join(tmp, 'accounts', 'codex', 'x', 'config.toml'), 'utf8').includes('cli_auth_credentials_store = "file"'));
  P.setSetting('auto_produce', 'off'); // các test dưới tự điều khiển từng bước; mặc định thật là bật (xem auto-produce.test.mjs)
  worker = runWorker({ tickMs: 80 });
  await waitFor(() => P.workerState().alive, 'worker sống');
});

test('1) hết limit ở tài khoản a → tự chuyển sang b, việc vẫn xong', async () => {
  mode('a', 'limit');
  const { job_id } = P.enqueueJob({ kind: 'plan', topic_id: globalThis.ctx.topic });
  await waitFor(() => job(job_id).status === 'succeeded', 'plan xong');
  assert.deepEqual(calls().map((c) => c.split(' ').slice(0, 3).join(' ')), ['claude a limit', 'claude b ok']);
  assert.equal(acct('claude/a').status, 'limited');
  assert.match(acct('claude/a').last_limit_raw, /hit your limit/);
  assert.ok(acct('claude/a').limited_until, 'có giờ hồi limit');
  assert.equal(job(job_id).account_id, acct('claude/b').id);
  assert.ok(fs.existsSync(path.resolve(S.ROOT, globalThis.ctx.folder, 'plan.md')));
  assert.equal(S.getVideo(globalThis.ctx.video).stage, 'planning');
});

test('2) mọi tài khoản Claude đều hết limit → việc CHỜ, hồi limit thì TỰ CHẠY TIẾP', async () => {
  P.clearLimit('claude/a');
  P.clearLimit('claude/b');
  mode('a', 'limit');
  mode('b', 'limit');
  const { job_id } = P.enqueueJob({ kind: 'qc', video_id: globalThis.ctx.video });
  await waitFor(() => job(job_id).status === 'waiting_limit' && job(job_id).wait_reason === 'limit', 'việc chuyển sang chờ hồi limit');
  assert.ok(Date.parse(job(job_id).next_run_at) > Date.now(), 'có giờ chạy tiếp ở tương lai');
  assert.ok(P.poolOverview().attention.some((x) => x.kind === 'limit_wait'), 'dashboard có cảnh báo chờ limit');
  mode('a', 'ok'); // "limit đã hồi"
  await waitFor(() => job(job_id).status === 'succeeded', 'tự chạy tiếp sau khi hồi limit', 20000);
  assert.equal(S.getVideo(globalThis.ctx.video).stage, 'ready');
  assert.equal(job(job_id).account_id, acct('claude/a').id, 'chạy trên tài khoản vừa hồi');
});

test('3) không có tài khoản Codex nào → chờ; bật lại là tự chạy → chuỗi produce → QC', async () => {
  mode('b', 'ok');
  P.clearLimit('claude/a');
  P.clearLimit('claude/b');
  S.setVideoStage({ video_id: globalThis.ctx.video, stage: 'planning' });
  P.setAccountEnabled('codex/x', false);
  P.setAccountEnabled('codex/y', false);
  const { job_id } = P.enqueueJob({ kind: 'produce', video_id: globalThis.ctx.video });
  await waitFor(() => job(job_id).status === 'waiting_limit' && job(job_id).wait_reason === 'no_account', 'chờ vì không có tài khoản');
  assert.ok(P.poolOverview().attention.some((x) => x.kind === 'no_account'));
  const prod = S.overview().departments[0].teams[0].members.find((m) => m.role === 'producer');
  assert.equal(prod.status, 'blocked');
  assert.match(prod.task, /Chờ/);
  mode('x', 'auth'); // x đăng nhập hỏng → phải sang y
  P.setAccountEnabled('codex/x', true);
  P.setAccountEnabled('codex/y', true);
  await waitFor(() => job(job_id).status === 'succeeded', 'produce xong trên tài khoản còn dùng được');
  assert.equal(acct('codex/x').status, 'auth_error');
  assert.equal(job(job_id).account_id, acct('codex/y').id);
  // chuỗi tự động: produce → qc → ready
  const qc = await waitFor(() => P.listJobs({ kind: 'qc', video_id: globalThis.ctx.video }).find((j) => j.created_by === 'worker'), 'QC tự được xếp');
  await waitFor(() => job(qc.id).status === 'succeeded', 'QC tự chạy xong');
  assert.equal(S.getVideo(globalThis.ctx.video).stage, 'ready');
});

test('4) Codex kẹt (NEEDS_HELP) → Claude tự gỡ → tự chạy sản xuất lại → QC', async () => {
  mode('x', 'ok');
  P.clearLimit('codex/x');
  mode('y', 'help');
  mode('x', 'help'); // cả hai kẹt như nhau
  S.setVideoStage({ video_id: globalThis.ctx.video, stage: 'production' });
  const { job_id } = P.enqueueJob({ kind: 'produce', video_id: globalThis.ctx.video, force: true });
  await waitFor(() => job(job_id).status === 'failed', 'produce báo kẹt');
  assert.match(job(job_id).last_error, /thiếu nhạc/);
  const rescue = await waitFor(() => P.listJobs({ kind: 'rescue', video_id: globalThis.ctx.video })[0], 'rescue tự được xếp');
  // Claude gỡ xong → sản xuất lại; lúc này Codex "đã có nhạc"
  mode('x', 'ok');
  mode('y', 'ok');
  await waitFor(() => job(rescue.id).status === 'succeeded', 'rescue xong');
  await waitFor(() => P.listJobs({ kind: 'produce', video_id: globalThis.ctx.video }).filter((j) => j.status === 'succeeded').length >= 2, 'produce chạy lại thành công');
  await waitFor(() => S.getVideo(globalThis.ctx.video).stage === 'ready', 'QC lại đạt');
  assert.equal(S.getVideo(globalThis.ctx.video).needs_help, 0);
});

test('5) huỷ việc, chạy lại, chống trùng việc', async () => {
  P.setAccountEnabled('claude/a', false);
  P.setAccountEnabled('claude/b', false);
  const j1 = P.enqueueJob({ kind: 'dept_review', dept: 'sport' });
  assert.equal(P.enqueueJob({ kind: 'dept_review', dept: 'sport' }).deduped, true);
  await waitFor(() => job(j1.job_id).status === 'waiting_limit', 'chờ vì tắt hết tài khoản');
  assert.equal(P.cancelJob(j1.job_id).status, 'cancelled');
  assert.equal(P.retryJob(j1.job_id).status, 'queued');
  P.setAccountEnabled('claude/a', true);
  await waitFor(() => job(j1.job_id).status === 'succeeded', 'chạy sau khi bật tài khoản');
});

test('6) hết limit không đọc được giờ hồi → lùi dần, không quay vòng vô hạn', async () => {
  process.env.STUB_LIMIT_MSG = '429 Too Many Requests';
  mode('a', 'limit');
  mode('b', 'limit');
  P.setAccountEnabled('claude/b', true);
  P.clearLimit('claude/a');
  P.clearLimit('claude/b');
  const j = P.enqueueJob({ kind: 'dept_review', dept: 'sport' });
  await waitFor(() => job(j.job_id).status === 'waiting_limit', 'chờ');
  const n = calls().length;
  await sleep(600);
  assert.equal(calls().length, n, 'không gọi thêm trong lúc chờ (đã lùi 30 phút)');
  const until = Date.parse(acct('claude/a').limited_until);
  assert.ok(until - Date.now() > 20 * 60_000, 'lùi ~30 phút khi không rõ giờ hồi');
  delete process.env.STUB_LIMIT_MSG;
});

test('7) việc kế hoạch cần Codex viết mà Codex bận → tạm dừng CHỜ CODEX (không phạt tài khoản Claude), Codex rảnh thì chạy tiếp', async () => {
  delete process.env.STUB_LIMIT_MSG;
  process.env.STUDIO_CODEX_WAIT_MS = '60000';
  for (const l of ['a', 'b']) (P.clearLimit(`claude/${l}`), P.setAccountEnabled(`claude/${l}`, true));
  mode('a', 'codexwait');
  mode('b', 'codexwait');
  const t = S.submitTopic({ dept: 'sport', text: 'Giãn cơ sau khi chạy' }).topic_id;
  S.assignTopic({ topic_id: t, episodes: 1 });
  const { job_id } = P.enqueueJob({ kind: 'plan', topic_id: t });
  await waitFor(() => job(job_id).status === 'waiting_limit' && job(job_id).wait_reason === 'codex', 'chờ Codex');
  assert.match(job(job_id).last_error, /Codex đang sản xuất/);
  assert.equal(acct('claude/a').status, 'ready', 'tài khoản Claude không bị đánh dấu hết limit');
  assert.ok(P.poolOverview().attention.some((x) => x.kind === 'limit_wait' && x.provider === 'codex'), 'dashboard báo đang chờ Codex');
  mode('a', 'ok');
  mode('b', 'ok');
  P.wakeJobs('codex'); // vd Codex vừa đăng nhập lại / hồi limit / bấm "Kiểm tra lại"
  await waitFor(() => job(job_id).status === 'succeeded', 'chạy tiếp khi Codex rảnh');
  delete process.env.STUDIO_CODEX_WAIT_MS;
});

test('8) QC lỗi thiết kế: review + needs_help là phán quyết, không xếp produce/rescue', async () => {
  for (const label of ['a', 'b']) {
    P.clearLimit(`claude/${label}`);
    P.setAccountEnabled(`claude/${label}`, true);
    mode(label, 'qc-design');
  }
  const video = globalThis.ctx.video;
  S.setVideoStage({ video_id: video, stage: 'review' });
  const before = P.listJobs({ video_id: video }).map((j) => j.id);
  const { job_id } = P.enqueueJob({ kind: 'qc', video_id: video });
  await waitFor(() => job(job_id).status === 'succeeded', 'QC đã báo lỗi thiết kế');
  assert.equal(job(job_id).last_error, '');
  assert.equal(S.getVideo(video).stage, 'review');
  assert.equal(S.getVideo(video).needs_help, 1);
  assert.match(S.getVideo(video).help_reason, /^QC-THIẾT-KẾ:/);
  assert.deepEqual(P.listJobs({ video_id: video }).filter((j) => !before.includes(j.id)).map((j) => j.kind), ['qc']);
  const dashboard = S.overview();
  assert.ok(dashboard.attention.some((a) => a.kind === 'help' && a.dept === 'sport'));
  assert.ok(dashboard.departments.flatMap((d) => d.teams).flatMap((t) => t.videos).some((v) => v.id === video && v.stage === 'review' && v.needs_help));
});

test('9) QC chưa phán quyết: review không needs_help vẫn bị đánh lỗi', async () => {
  for (const label of ['a', 'b']) mode(label, 'qc-no-verdict');
  const video = globalThis.ctx.video;
  S.resolveEscalation({ video_id: video, note: 'Đã xử lý thiết kế trong test', by: 'test' });
  assert.equal(S.getVideo(video).stage, 'review');
  assert.equal(S.getVideo(video).needs_help, 0);
  const before = P.listJobs({ video_id: video }).map((j) => j.id);
  const { job_id } = P.enqueueJob({ kind: 'qc', video_id: video });
  await waitFor(() => job(job_id).status === 'needs_human', 'QC thiếu phán quyết vẫn lỗi');
  assert.match(job(job_id).last_error, /Claude chưa đưa ra phán quyết/);
  assert.deepEqual(P.listJobs({ video_id: video }).filter((j) => !before.includes(j.id)).map((j) => j.kind), ['qc']);
});
