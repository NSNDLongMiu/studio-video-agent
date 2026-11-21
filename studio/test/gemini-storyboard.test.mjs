// Gemini viết storyboard THAY Codex, Claude duyệt (giám đốc duyệt từng việc, 21/11/2026):
// chế độ `gemini-run.mjs storyboard` (kiểm JSON/schema, ép DRAFT, không ghi đè APPROVED, sao lưu), duyệt thay thế bằng Gemini ở hàng đợi,
// lời dặn và đối số cho phiên Claude điều phối. Chạy gemini-run.mjs thật với agy giả (xem helpers/agy-stub.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-gemsb-'));
const agyHome = path.join(tmp, 'agy-home');
fs.mkdirSync(agyHome, { recursive: true });
Object.assign(process.env, {
  STUDIO_DB: path.join(tmp, 'db.sqlite'), STUDIO_CONTENT: path.join(tmp, 'content'), STUDIO_ACCOUNTS: path.join(tmp, 'accounts'), STUDIO_NO_AUTOSTART: '1',
  STUDIO_AGY_HOME: agyHome, STUB_DIR: tmp,
});
const here = path.dirname(fileURLToPath(import.meta.url));
const stub = path.join(here, 'helpers', 'agy-stub.mjs');
const runScript = path.join(here, '..', 'src', 'gemini-run.mjs');
const S = await import('../src/db.mjs');
const P = await import('../src/pool.mjs');
const R = await import('../src/runners.mjs');
const SB = await import('../src/storyboard-takeover.mjs');

P.addAccount({ provider: 'gemini', label: 'main', owner: 'Giám đốc' });
const topic = path.join(tmp, 'content', 'it', 'T1-thu');
const ep = path.join(topic, 'ep01');
fs.mkdirSync(path.join(ep, 'review'), { recursive: true });
fs.writeFileSync(path.join(topic, 'concept.md'), '# concept');
fs.writeFileSync(path.join(topic, 'plan.md'), '# plan');
fs.writeFileSync(path.join(ep, 'script.md'), '# script\nTách dữ liệu theo nhóm.');
const promptFile = path.join(ep, 'review', 'gemini-storyboard-r1.prompt.md');
fs.writeFileSync(promptFile, '## NGỮ CẢNH\nvideo TEST-T1-E01, vòng 1');
const calls = () => (fs.existsSync(path.join(tmp, 'agy-calls.jsonl')) ? fs.readFileSync(path.join(tmp, 'agy-calls.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l)) : []);
const run = (stubMode, { dir = ep, extra = {} } = {}) => spawnSync(process.execPath, ['--disable-warning=ExperimentalWarning', runScript, 'storyboard', promptFile, dir], { encoding: 'utf8', env: { ...process.env, STUDIO_AGY_JS: stub, STUB_AGY_MODE: stubMode, ...extra } });
const board = () => JSON.parse(fs.readFileSync(path.join(ep, 'storyboard.json'), 'utf8'));
const invalid = path.join(ep, 'review', 'gemini-storyboard-invalid.json');

test('storyboard: Gemini ghi bản nháp → kiểm schema, ÉP status DRAFT (dù Gemini đặt APPROVED), đánh dấu tác giả, đủ đầu vào trong thư mục tạm', () => {
  const r = run('sb-ok');
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /STORYBOARD ĐÃ GHI \(1 cảnh, tổng 3 s\)/);
  assert.match(r.stdout, /đã ép về DRAFT/);
  assert.equal(board().status, 'DRAFT', 'chỉ Claude được đặt APPROVED');
  const md = fs.readFileSync(path.join(ep, 'storyboard.md'), 'utf8');
  assert.match(md.split('\n')[0], /^Bản nháp do Gemini .*viết thay Codex \(giám đốc duyệt, \d{4}-\d{2}-\d{2}\)\. Chỉ Claude \(visual-director\) review và đặt APPROVED\./);
  assert.match(md, /Thẻ vào khay/, 'giữ bảng tóm tắt của Gemini');
  const c = calls().pop();
  for (const f of ['HUONG-DAN-STORYBOARD.md', 'tham-chieu/storyboard.schema.json', 'tham-chieu/mascot.md', 'ep/script.md', 'chu-de/plan.md', 'chu-de/concept.md']) assert.ok(c.files.includes(f), `thiếu đầu vào ${f} trong thư mục tạm`);
  assert.ok(c.files.some((f) => f.startsWith('tham-chieu/scenes/')), 'có component thật để Gemini đối chiếu');
  assert.match(path.resolve(c.cwd), /[\\/]\.local[\\/]gemini-work[\\/]/, 'agy không chạy trong thư mục dự án');
  assert.equal(fs.existsSync(c.cwd), false, 'thư mục tạm đã được dọn');
  const prompt = c.args[c.args.indexOf('-p') + 1];
  assert.match(prompt, /NHIỆM VỤ — Đạo diễn hình ảnh, bạn \(Gemini\) làm THAY Codex/);
  assert.match(prompt, /KHÔNG bao giờ "APPROVED"/);
  assert.match(prompt, /## NGỮ CẢNH\nvideo TEST-T1-E01, vòng 1/, 'lời của người điều phối được giữ');
  assert.equal(c.args.includes('--dangerously-skip-permissions'), false);
  assert.ok(c.args.includes('--sandbox'));
  assert.equal(JSON.parse(c.args[c.args.indexOf('--settings') + 1]).useG1Credits, false, 'luật 8: không dùng credit trả phí');
});

test('storyboard: chạy lại bản sửa → bản cũ được sao lưu, đầu vào có review mới nhất và bản hiện có', () => {
  fs.writeFileSync(path.join(ep, 'review', 'storyboard-r1.md'), 'CẦN SỬA: cảnh 1 thiếu main_change');
  fs.writeFileSync(path.join(ep, 'review', 'storyboard-r2.md'), 'CẦN SỬA vòng 2');
  const r = run('sb-ok');
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /Bản cũ sao lưu ở .*review\/_gemini-truoc\/storyboard-\d{14}\.json/);
  assert.equal(fs.readdirSync(path.join(ep, 'review', '_gemini-truoc')).length, 1);
  const c = calls().pop();
  assert.ok(c.files.includes('ep/storyboard-hien-tai.json'));
  assert.ok(c.files.includes('ep/review-moi-nhat.md'));
  const prompt = c.args[c.args.indexOf('-p') + 1];
  assert.match(prompt, /ĐÂY LÀ BẢN SỬA vòng 3/, 'đã có review r2 nên đây là vòng sửa kế tiếp');
  assert.equal(SB.latestReview(ep).round, 2);
});

test('storyboard: JSON hỏng / sai schema / sai video_id → mã 9, KHÔNG ghi đè storyboard hiện có, lưu bản lỗi + danh sách lỗi; thành công thì dọn bản lỗi', () => {
  const before = fs.readFileSync(path.join(ep, 'storyboard.json'), 'utf8');
  let r = run('sb-badjson');
  assert.equal(r.status, 9);
  assert.match(r.stderr, /SAI_JSON/);
  assert.ok(fs.existsSync(invalid), 'bản lỗi được lưu để chạy lại');
  r = run('sb-badschema');
  assert.equal(r.status, 9);
  assert.match(r.stderr, /SAI_SCHEMA: storyboard\.json vi phạm schema \(\d+ lỗi\)/);
  assert.match(r.stderr, /- \/scenes\/0 must have required property/, 'in danh sách lỗi để dán vào lần chạy lại');
  assert.equal(fs.readFileSync(path.join(ep, 'storyboard.json'), 'utf8'), before, 'storyboard hiện có không bị đụng');
  // lần chạy lại: bản lỗi được đưa vào thư mục tạm và lời nhiệm vụ nói rõ
  r = run('sb-ok');
  assert.equal(r.status, 0, r.stderr);
  const c = calls().pop();
  assert.ok(c.files.includes('ep/ban-nhap-loi.json'));
  assert.match(c.args[c.args.indexOf('-p') + 1], /Lần trước bản nháp SAI schema\/JSON/);
  assert.equal(fs.existsSync(invalid), false, 'thành công thì dọn bản lỗi');
  r = run('sb-otherid');
  assert.equal(r.status, 9);
  assert.match(r.stderr, /SAI_VIDEO: video_id trong bản nháp là "KHAC-T9-E01", đúng phải là "TEST-T1-E01"/);
  fs.rmSync(invalid, { force: true });
});

test('storyboard: không ghi file mà vẫn có khối ```json trong câu trả lời thì nhận; không có gì thì mã 8 (KHONG_RA_FILE)', () => {
  let r = run('sb-reply');
  assert.equal(r.status, 0, r.stderr);
  assert.equal(board().status, 'DRAFT');
  r = run('sb-nofile');
  assert.equal(r.status, 8);
  assert.match(r.stderr, /KHONG_RA_FILE/);
});

test('storyboard: từ chối ngay (không tốn lượt agy) khi đã APPROVED, thư mục không phải epNN, hoặc chưa có kịch bản', () => {
  const approved = { ...board(), status: 'APPROVED' };
  fs.writeFileSync(path.join(ep, 'storyboard.json'), JSON.stringify(approved));
  const n = calls().length;
  let r = run('sb-ok');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /TU_CHOI: storyboard đã APPROVED/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(ep, 'storyboard.json'), 'utf8')).status, 'APPROVED', 'không đụng bản đã duyệt');
  r = run('sb-ok', { dir: topic });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /thư mục epNN/);
  const ep2 = path.join(topic, 'ep02');
  fs.mkdirSync(ep2);
  r = run('sb-ok', { dir: ep2 });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /chưa có kịch bản/);
  assert.equal(calls().length, n, 'cả ba trường hợp đều không gọi agy');
  assert.throws(() => SB.finalizeStoryboard({ epDir: ep, board: approved }), /đã APPROVED/, 'lớp bảo vệ thứ hai ở bước ghi');
  fs.writeFileSync(path.join(ep, 'storyboard.json'), JSON.stringify({ ...approved, status: 'DRAFT' }));
});

test('duyệt thay thế bằng Gemini: dashboard đề nghị cả hai AI, ghi payload by=gemini, chạy lại ngay; đang chờ CLAUDE hết limit thì ghi duyệt nhưng GIỮ trạng thái chờ', () => {
  S.createDepartment({ name: 'Thể thao', slug: 'sport', daily_target: 2, initial_teams: 1 });
  P.addAccount({ provider: 'claude', label: 'a', owner: 'Người A', priority: 1, ready: true });
  const topicId = S.submitTopic({ dept: 'sport', text: 'Việt vị' }).topic_id;
  S.assignTopic({ topic_id: topicId, episodes: 1 });
  const { job_id } = P.enqueueJob({ kind: 'plan', topic_id: topicId });
  P.setJob(job_id, { status: 'waiting_limit', wait_reason: 'codex', last_error: 'Chờ Codex: BUSY 2 lần' });
  const offer = P.poolOverview().attention.find((x) => x.kind === 'takeover_offer' && x.job_id === job_id);
  assert.deepEqual(offer.options, ['claude', 'gemini']);
  assert.equal(offer.by, 'claude');
  assert.match(offer.message, /Claude hoặc Gemini làm thay/);
  // Codex đang chờ: duyệt Gemini → xếp chạy lại ngay
  let r = P.approveTakeover({ job_id, by: 'gemini', note: 'Codex bận sản xuất' });
  assert.equal(r.status, 'queued');
  assert.equal(r.takeover.by, 'gemini');
  assert.equal(r.takeover.for, 'codex');
  assert.equal(P.getJob(job_id).payload.takeover.by, 'gemini');
  assert.ok(S.recentEvents(10).some((e) => /GIÁM ĐỐC DUYỆT: Gemini làm thay Codex ở việc #\d+/.test(e.message)));
  assert.ok(!P.poolOverview().attention.some((x) => x.kind === 'takeover_offer' && x.job_id === job_id), 'đã duyệt thì hết đề nghị');
  // đang chờ CLAUDE hồi limit: Claude làm thay bị từ chối, Gemini làm thay được ghi nhận nhưng việc vẫn chờ
  P.setJob(job_id, { status: 'waiting_limit', wait_reason: 'limit', payload: JSON.stringify({ episodes: 1, rounds: 2, codex_waits: 1 }) });
  assert.throws(() => P.approveTakeover({ job_id, by: 'claude' }), /đang chờ CLAUDE.*Chọn Gemini làm thay/);
  r = P.approveTakeover({ job_id, by: 'gemini' });
  assert.equal(r.status, 'waiting_limit');
  const j = P.getJob(job_id);
  assert.equal(j.status, 'waiting_limit', 'vẫn chờ Claude hồi limit');
  assert.equal(j.wait_reason, 'limit');
  assert.equal(j.payload.takeover.by, 'gemini');
  assert.equal(j.payload.codex_waits, undefined);
  assert.throws(() => P.approveTakeover({ job_id, by: 'codex' }), /chỉ claude hoặc gemini làm thay codex/);
  assert.equal(P.revokeTakeover(job_id).takeover, null);
});

test('phiên Claude điều phối: đối số thay-codex=gemini và lời dặn riêng (Claude chỉ review, không tự viết thay, TAKEOVER_WAIT khi Gemini cũng không làm được)', () => {
  const sys = (j) => { const a = R.buildClaudeArgs(j, { kind: 'subscription' }); return a[a.indexOf('--append-system-prompt') + 1]; };
  const base = { kind: 'plan', attempts: 0, resumed: false, topic_id: 7, payload: { takeover: { by: 'gemini', for: 'codex', approved_at: '2026-11-21T10:00:00Z', note: 'Codex bận' } } };
  const text = sys(base);
  assert.match(text, /GIÁM ĐỐC ĐÃ DUYỆT \(2026-11-21\): Gemini làm THAY Codex/);
  assert.match(text, /Claude \(bạn\) chỉ điều phối, review và duyệt/);
  assert.match(text, /gemini-run\.mjs storyboard/);
  assert.match(text, /CHỈ visual-director \(Claude\) đặt APPROVED, không bao giờ Gemini/);
  assert.match(text, /KHÔNG tự viết storyboard thay/);
  assert.match(text, /TAKEOVER_WAIT: <lý do ngắn>/);
  assert.match(text, /Ghi chú của giám đốc: Codex bận/);
  assert.doesNotMatch(text, /Claude làm THAY Codex/);
  const claude = sys({ ...base, payload: { takeover: { by: 'claude', for: 'codex', approved_at: '2026-11-21T10:00:00Z' } } });
  assert.match(claude, /Claude làm THAY Codex/);
  assert.doesNotMatch(claude, /Gemini làm THAY/);
});
