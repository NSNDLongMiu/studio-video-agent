// Hai thay đổi giám đốc chốt 21/11/2026:
//  (1) tài khoản cấp được cho NHIỀU phòng;
//  (2) đề xuất chủ đề là của CHUNG PHÒNG; khi duyệt giao lần lượt cho các đội, ưu tiên đội chưa có việc.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-multi-'));
const dbFile = path.join(tmp, 'db.sqlite');
Object.assign(process.env, { STUDIO_DB: dbFile, STUDIO_CONTENT: path.join(tmp, 'content'), STUDIO_ACCOUNTS: path.join(tmp, 'accounts'), STUDIO_NO_AUTOSTART: '1' });
const S = await import('../src/db.mjs');
const P = await import('../src/pool.mjs');
const O = await import('../src/office.mjs');
const F = await import('../src/format.mjs');
const here = path.dirname(fileURLToPath(import.meta.url));

S.createDepartment({ name: 'IT', slug: 'it', daily_target: 2, initial_teams: 3 });
S.createDepartment({ name: 'Bóng Đá', slug: 'bong-da', daily_target: 1, initial_teams: 1 });
S.createDepartment({ name: 'Khác', slug: 'khac', daily_target: 1, initial_teams: 1 });
for (const [l, pr] of [['a', 1], ['b', 2], ['c', 3], ['s', 4]]) P.addAccount({ provider: 'claude', label: l, owner: `Chủ ${l}`, priority: pr, ready: true });
const acc = (l) => P.listAccounts().find((a) => a.provider === 'claude' && a.label === l);
const usable = (dept) => P.eligibleFor(P.listAccounts().filter((a) => a.provider === 'claude'), 'claude', dept).map((a) => a.label).sort();

test('parseDeptSpec: danh sách đặt đúng, +/- thêm bớt, none trả về dùng chung, từ chối kiểu trộn', () => {
  assert.deepEqual(P.parseDeptSpec('it,bong-da'), ['bong-da', 'it']);
  assert.deepEqual(P.parseDeptSpec(['it', 'bong-da', 'it']), ['bong-da', 'it'], 'bỏ trùng');
  assert.deepEqual(P.parseDeptSpec(['it,bong-da']), ['bong-da', 'it'], 'dòng lệnh truyền mảng một phần tử có dấu phẩy (accounts assign <tk> it,bong-da)');
  assert.deepEqual(P.parseDeptSpec(['+bong-da,-it'], ['it']), ['bong-da'], 'tách dấu phẩy cả ở kiểu thêm/bớt');
  assert.deepEqual(P.parseDeptSpec('it bong-da'), ['bong-da', 'it'], 'cho phép cách bằng dấu cách');
  for (const none of ['none', 'NONE', '', null, undefined, [], '  ']) assert.deepEqual(P.parseDeptSpec(none, ['it']), [], String(none));
  assert.deepEqual(P.parseDeptSpec('+bong-da', ['it']), ['bong-da', 'it']);
  assert.deepEqual(P.parseDeptSpec(['-it'], ['bong-da', 'it']), ['bong-da']);
  assert.deepEqual(P.parseDeptSpec('+a,-b', ['b']), ['a']);
  assert.throws(() => P.parseDeptSpec('+it,bong-da'), /Không trộn/);
  assert.throws(() => P.parseDeptSpec('none,it'), /none/);
});

test('cấp một tài khoản cho NHIỀU phòng: các phòng được cấp cùng dùng; phòng khác không mượn; phòng chưa được cấp chỉ dùng tài khoản dùng chung', () => {
  assert.deepEqual(usable('it'), ['a', 'b', 'c', 's'], 'chưa cấp cho ai: mọi tài khoản là dùng chung');
  const r1 = P.assignAccount('claude/a', 'it');
  assert.deepEqual(r1.depts, ['it']);
  P.assignAccount('claude/b', 'it');
  const r = P.assignAccount('claude/c', 'it,bong-da');
  assert.deepEqual(r.depts, ['bong-da', 'it']);
  assert.equal(r.dept, 'bong-da', 'dept = bản sao phòng đầu (tương thích)');
  assert.deepEqual(acc('c').depts, ['bong-da', 'it']);
  assert.deepEqual(usable('it'), ['a', 'b', 'c'], 'IT dùng a, b và c; không lấy ghế dùng chung s');
  assert.deepEqual(usable('bong-da'), ['c'], 'Bóng Đá chỉ dùng c (đã được cấp), không mượn a/b của IT');
  assert.deepEqual(usable('khac'), ['s'], 'phòng chưa được cấp chỉ dùng tài khoản dùng chung');
  assert.deepEqual(usable(null), ['s'], 'việc không thuộc phòng nào cũng vậy');
  assert.equal(P.pickAccount('claude', { dept: 'bong-da' }).label, 'c');
  assert.equal(P.pickAccount('claude', { dept: 'it' }).label, 'a', 'IT chọn theo ưu tiên trong số được cấp');
  P.markLimited(acc('c').id, { until: new Date(Date.now() + 3_600_000), raw: 'hết limit thử' });
  assert.equal(P.pickAccount('claude', { dept: 'bong-da' }), null, 'c hết limit thì Bóng Đá chờ, không mượn ghế của IT');
  assert.ok(P.nextAvailableAt('claude', { dept: 'bong-da' }), 'có giờ hồi để chờ');
  assert.equal(P.pickAccount('claude', { dept: 'it' }).label, 'a', 'IT vẫn có a');
  P.clearLimit('claude/c');
  const legacy = S.sql.get('SELECT dept FROM accounts WHERE id=?', acc('c').id).dept;
  assert.equal(legacy, 'bong-da', 'cột dept cũ giữ bản sao của phòng đầu');
});

test('thêm bớt từng phòng bằng +/-; phòng không có thì từ chối và không đổi gì; none trả về dùng chung; gỡ tài khoản dọn bảng liên kết', () => {
  assert.deepEqual(P.assignAccount('claude/c', '-it').depts, ['bong-da']);
  assert.deepEqual(usable('it'), ['a', 'b']);
  assert.deepEqual(P.assignAccount('claude/c', '+it').depts, ['bong-da', 'it']);
  assert.throws(() => P.assignAccount('claude/c', 'khong-co'), /Không có phòng "khong-co"/);
  assert.deepEqual(acc('c').depts, ['bong-da', 'it'], 'lỗi thì giữ nguyên');
  assert.deepEqual(P.assignAccount('claude/c', 'none').depts, []);
  assert.equal(S.sql.get('SELECT dept FROM accounts WHERE id=?', acc('c').id).dept, null);
  assert.ok(usable('khac').includes('c'), 'dùng chung trở lại');
  P.assignAccount('claude/s', 'khac,it');
  const id = acc('s').id;
  assert.equal(S.sql.get('SELECT COUNT(*) c FROM account_depts WHERE account_id=?', id).c, 2);
  P.removeAccount('claude/s');
  assert.equal(S.sql.get('SELECT COUNT(*) c FROM account_depts WHERE account_id=?', id).c, 0, 'gỡ tài khoản thì dọn liên kết phòng');
  P.assignAccount('claude/c', 'it,bong-da');
});

test('DB cũ có cột dept đơn: mở bằng mã mới thì tự chuyển sang bảng nhiều phòng (một lần), tài khoản vẫn đúng phòng', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-legacy-'));
  const f = path.join(dir, 'db.sqlite');
  const env = { ...process.env, STUDIO_DB: f, STUDIO_CONTENT: path.join(dir, 'content'), STUDIO_ACCOUNTS: path.join(dir, 'accounts'), STUDIO_NO_AUTOSTART: '1' };
  const script = (body) => spawnSync(process.execPath, ['--disable-warning=ExperimentalWarning', '--input-type=module', '-e', `import * as S from ${JSON.stringify(new URL('../src/db.mjs', import.meta.url).href)}; import * as P from ${JSON.stringify(new URL('../src/pool.mjs', import.meta.url).href)}; ${body}`], { env, encoding: 'utf8' });
  let r = script("S.createDepartment({name:'IT',slug:'it',daily_target:1,initial_teams:1}); P.addAccount({provider:'claude',label:'x',ready:true}); console.log('ok')");
  assert.equal(r.status, 0, r.stderr);
  const raw = new DatabaseSync(f); // đưa DB về dạng cũ: chỉ có cột dept, chưa có dữ liệu bảng mới
  raw.exec("DROP TABLE account_depts; UPDATE accounts SET dept='it'");
  raw.close();
  r = script("console.log(JSON.stringify(P.listAccounts().map((a) => [a.label, a.depts, a.dept])))");
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(JSON.parse(r.stdout.trim().split('\n').pop()), [['x', ['it'], 'it']]);
  r = script("P.assignAccount('claude/x', 'none'); console.log(JSON.stringify(P.listAccounts()[0].depts))");
  assert.deepEqual(JSON.parse(r.stdout.trim().split('\n').pop()), []);
  r = script("console.log(JSON.stringify(P.listAccounts()[0].depts))");
  assert.deepEqual(JSON.parse(r.stdout.trim().split('\n').pop()), [], 'lần mở sau không chuyển lại (đã trả về dùng chung)');
});

test('Văn phòng 2D và bản chữ: tài khoản cấp cho hai phòng xuất hiện ở CẢ HAI phòng; dữ liệu cũ chỉ có dept vẫn chạy', () => {
  const DEF = { defaultDirs: { claude: 'C:/u/.claude', codex: 'C:/u/.codex' }, emptyDirs: { claude: 'E:/claude', codex: 'E:/codex' } };
  const depts = [{ slug: 'it', name: 'IT' }, { slug: 'bong-da', name: 'Bóng Đá' }];
  const mk = (label, over) => ({ provider: 'claude', label, enabled: true, home: `C:/h/${label}`, email: null, ...over });
  const plan = O.planInstances([mk('c', { depts: ['bong-da', 'it'] }), mk('a', { depts: ['it'] }), mk('old', { dept: 'bong-da' })], depts, DEF);
  assert.deepEqual(plan.map((i) => [i.name, i.accounts]), [['VP-bong-da', ['claude/c']], ['VP-bong-da-2', ['claude/old']], ['VP-it', ['claude/c']], ['VP-it-2', ['claude/a']]]);
  assert.ok(plan.every((i) => i.accounts.length === 1));
  const text = F.formatPool({ accounts: P.listAccounts(), jobs: [], worker: { alive: true }, summary: {}, attention: [] }, { only: 'accounts' });
  assert.match(text, /anh|Claude/);
  assert.match(text, /→ phòng bong-da, it/, 'bản chữ liệt kê đủ các phòng của tài khoản');
});

test('đề xuất là của CHUNG PHÒNG: không gắn đội nào; thông điệp ghi "Phòng …"; dùng được cả team_id (chỉ xác định phòng) lẫn dept', () => {
  S.setAutoTopics({ dept: 'it', on: true, by: 'test' });
  S.setAutoTopics({ dept: 'khac', on: true, by: 'test' });
  const t0 = S.overview({ dept: 'it' }).departments[0].teams[0].id;
  const a = S.proposeTopic({ team_id: t0, text: 'Đề xuất qua team_id', reason: 'r', by: 'test' });
  const b = S.proposeTopic({ dept: 'it', text: 'Đề xuất qua dept', reason: 'r', by: 'test' });
  assert.equal(a.team_id, null);
  assert.equal(a.dept, 'it');
  for (const id of [a.topic_id, b.topic_id]) assert.equal(S.sql.get('SELECT team_id FROM topics WHERE id=?', id).team_id, null);
  assert.throws(() => S.proposeTopic({ text: 'Thiếu cả đội lẫn phòng', reason: 'r' }), /Cần team_id hoặc dept/);
  const msg = S.overview().attention.find((x) => x.kind === 'topic_proposal' && x.topic_id === a.topic_id).message;
  assert.match(msg, /^Phòng "IT" đề xuất chủ đề #\d+/);
  assert.ok(S.recentEvents(20).some((e) => /Phòng "IT" ĐỀ XUẤT chủ đề/.test(e.message)));
});

test('pickTeamForTopic: ưu tiên đội chưa có việc, xoay vòng (đội được giao lâu nhất trước), video chờ giám đốc nghe hay đã ready thì đội coi như rảnh', () => {
  const ids = S.overview({ dept: 'it' }).departments[0].teams.map((t) => t.id);
  assert.equal(ids.length, 3);
  const propose = (n) => S.proposeTopic({ dept: 'it', text: `Chủ đề xoay vòng ${n}`, reason: 'r', by: 'test' }).topic_id;
  const t = [1, 2, 3, 4].map(propose);
  assert.equal(S.pickTeamForTopic('it').id, ids[0], 'chưa đội nào có việc → mã nhỏ');
  const picks = [];
  for (const id of t.slice(0, 3)) {
    const r = P.approveTopic({ topic_id: id, by: 'test' });
    picks.push(r.team_id);
    assert.equal(r.job.status, 'queued');
    assert.equal(P.getJob(r.job.job_id).kind, 'plan');
    assert.equal(S.sql.get('SELECT status FROM topics WHERE id=?', id).status, 'assigned');
    assert.equal(r.videos.length, 1);
  }
  assert.deepEqual(picks, ids, 'ba duyệt liên tiếp đi lần lượt vào ba đội');
  // đội thứ hai làm xong phần của nó (video chờ nghe ở review) → rảnh, được ưu tiên dù đội 1 và 3 còn bận
  const v2 = S.sql.get('SELECT id FROM videos WHERE team_id=?', ids[1]).id;
  S.setVideoStage({ video_id: v2, stage: 'review', by: 'test' });
  assert.equal(S.pickTeamForTopic('it').id, ids[1]);
  const r4 = P.approveTopic({ topic_id: t[3], by: 'test' });
  assert.equal(r4.team_id, ids[1], 'đội rảnh nhận chủ đề kế tiếp');
  // tất cả cùng bận như nhau → đội được giao lâu nhất đi trước
  S.setVideoStage({ video_id: S.sql.get('SELECT id FROM videos WHERE topic_id=?', t[3]).id, stage: 'ready', by: 'test' });
  S.setVideoStage({ video_id: v2, stage: 'ready', by: 'test' });
  for (const v of S.sql.all('SELECT id FROM videos WHERE team_id=?', ids[0])) S.setVideoStage({ video_id: v.id, stage: 'ready', by: 'test' });
  for (const v of S.sql.all('SELECT id FROM videos WHERE team_id=?', ids[2])) S.setVideoStage({ video_id: v.id, stage: 'ready', by: 'test' });
  assert.equal(S.pickTeamForTopic('it').id, ids[0], 'cả ba rảnh như nhau → đội được giao video lâu nhất (đội 1)');
  assert.equal(S.pickTeamForTopic('khong-co'), null);
});

test('chủ đề đã giao mà thêm tập thì giữ đội đã nhận; chỉ định đội rõ ràng vẫn được; suất ngày không chặn việc giám đốc duyệt', () => {
  const id = S.proposeTopic({ dept: 'khac', text: 'Chủ đề thêm tập', reason: 'r', by: 'test' }).topic_id;
  const r = P.approveTopic({ topic_id: id, by: 'test' });
  const again = S.assignTopic({ topic_id: id, episodes: 1, by: 'test' });
  assert.equal(again.team_id, r.team_id);
  const [, , t3] = S.overview({ dept: 'it' }).departments[0].teams.map((t) => t.id);
  const direct = S.submitTopic({ dept: 'it', text: 'Giám đốc chỉ định đội 3' }).topic_id;
  assert.equal(S.assignTopic({ topic_id: direct, team_id: t3, by: 'test' }).team_id, t3);
  const more = S.proposeTopic({ dept: 'khac', text: 'Chủ đề vượt suất', reason: 'r', by: 'test' }).topic_id;
  const over = P.approveTopic({ topic_id: more, by: 'test' });
  assert.ok(over.over_capacity >= 0);
  assert.equal(over.job.status, 'queued', 'vượt suất vẫn duyệt và xếp việc (luật 4)');
});

test('duyệt khi phòng chưa có đội nào thì từ chối rõ ràng và chủ đề vẫn ở trạng thái chờ duyệt', () => {
  S.createDepartment({ name: 'Rỗng', slug: 'rong', daily_target: 1, initial_teams: 0 });
  S.setAutoTopics({ dept: 'rong', on: true, by: 'test' });
  const id = S.proposeTopic({ dept: 'rong', text: 'Chủ đề phòng chưa có đội', reason: 'r', by: 'test' }).topic_id;
  assert.throws(() => P.approveTopic({ topic_id: id, by: 'test' }), /chưa có đội nào đang hoạt động — chưa duyệt chủ đề/);
  assert.equal(S.sql.get('SELECT status FROM topics WHERE id=?', id).status, 'proposed');
  assert.throws(() => P.approveTopic({ topic_id: 999999, by: 'test' }), /Không có chủ đề/);
  assert.throws(() => P.approveTopic({ topic_id: id + 0.5, by: 'test' }), /.*/);
});

test('giao diện và lệnh: dashboard lọc tài khoản theo danh sách phòng, hộp thoại cấp nhận nhiều phòng; CLI nhận danh sách', () => {
  const html = fs.readFileSync(path.join(here, '..', 'public', 'index.html'), 'utf8');
  assert.match(html, /\(a\.depts \|\| \[\]\)\.includes\(d\.slug\)/);
  assert.match(html, /NHIỀU mã phòng cách nhau bằng dấu phẩy/);
  const cli = fs.readFileSync(path.join(here, '..', 'src', 'cli.mjs'), 'utf8');
  assert.match(cli, /P\.assignAccount\(ref, args\.slice\(2\)\)/);
  const dash = fs.readFileSync(path.join(here, '..', 'src', 'dashboard.mjs'), 'utf8');
  assert.match(dash, /P\.approveTopic\(\{ topic_id: Number\(m\[1\]\)/, 'dashboard duyệt chủ đề qua approveTopic (giao ngay cho đội rảnh)');
  const mcp = fs.readFileSync(path.join(here, '..', 'src', 'mcp.mjs'), 'utf8');
  assert.match(mcp, /P\.approveTopic\(/);
});
