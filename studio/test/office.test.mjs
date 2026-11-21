import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawnSync } from 'node:child_process';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-office-'));
Object.assign(process.env, { STUDIO_DB: path.join(tmp, 'db.sqlite'), STUDIO_CONTENT: path.join(tmp, 'content'), STUDIO_ACCOUNTS: path.join(tmp, 'accounts'), STUDIO_OFFICE_PORT: '4581' });
const O = await import('../src/office.mjs');
const P = await import('../src/pool.mjs');

const acc = (provider, label, home, enabled = true) => ({ provider, label, home, enabled });
const getBody = (port, p = '/') => new Promise((r) => http.get({ host: '127.0.0.1', port, path: p, headers: { host: 'localhost' }, timeout: 3000 }, (res) => { let b = ''; res.setEncoding('utf8'); res.on('data', (c) => (b += c)); res.on('end', () => r(b)); }).on('error', () => r('')));
const get = (port, headers = {}, p = '/') => new Promise((r) => http.get({ host: '127.0.0.1', port, path: p, headers, timeout: 3000 }, (res) => { res.resume(); r(res.statusCode); }).on('error', () => r(0)));

after(async () => {
  await O.stopOffice();
});

const DEF = { defaultDirs: { claude: 'C:/u/.claude', codex: 'C:/u/.codex' }, emptyDirs: { claude: 'E:/claude', codex: 'E:/codex' } };
const DEPTS = [{ slug: 'it', name: 'IT', status: 'active' }, { slug: 'sport', name: 'Thể thao', status: 'active' }];

test('planInstances: mỗi phòng 1 bản, chỉ tài khoản đã cấp cho phòng; tài khoản dùng chung không được theo dõi', () => {
  assert.deepEqual(O.planInstances([], DEPTS, DEF), []);
  const accounts = [
    acc('claude', 'main', null), // dùng chung -> không theo dõi
    acc('claude', 'b', 'C:/h/claude/b'), // dùng chung -> không theo dõi
    { ...acc('claude', 'dev.longvu', 'C:/h/claude/dev.longvu'), dept: 'it' },
    { ...acc('codex', 'main', null), dept: 'it' }, // đăng nhập mặc định của máy -> trỏ rõ ~/.codex
    { ...acc('claude', 's1', 'C:/h/claude/s1'), dept: 'sport' },
    { ...acc('claude', 's2', 'C:/h/claude/s2'), dept: 'sport' },
    { ...acc('claude', 'off', 'C:/h/claude/off', false), dept: 'it' }, // đang tắt -> không tính
  ];
  const plan = O.planInstances(accounts, DEPTS, DEF);
  assert.deepEqual(plan.map((i) => i.name), ['VP-it', 'VP-sport', 'VP-sport-2']);
  assert.deepEqual(plan[0].accounts, ['claude/dev.longvu', 'codex/main']);
  assert.deepEqual(plan[0].env, { CLAUDE_CONFIG_DIR: 'C:/h/claude/dev.longvu', CODEX_HOME: 'C:/u/.codex' });
  assert.deepEqual(plan[1].env, { CLAUDE_CONFIG_DIR: 'C:/h/claude/s1', CODEX_HOME: 'E:/codex' }, 'thiếu Codex -> thư mục rỗng, không lộ phiên ngoài phòng');
  assert.match(plan[0].label, /phòng IT: Claude \(chưa đăng nhập\) \[ghế dev\.longvu\] \+ Codex \(chưa đăng nhập\) \[ghế main\]/);
  assert.equal(plan[0].title, 'Phòng IT');
  assert.match(O.planInstances([{ ...acc('claude', 'x', 'C:/h/x'), dept: 'it', email: 'a@b.vn' }], DEPTS, DEF)[0].label, /Claude a@b\.vn \[ghế x\]/, 'email đăng nhập là tên chính');
  const dir = O.officeDirectory(accounts, DEPTS);
  assert.deepEqual(dir.map((d) => d.name), ['VP-it', 'VP-sport', 'VP-sport-2']);
  assert.ok(dir.every((d) => d.port >= 4581 && d.url.includes(`:${d.port}/`)));
});

test('planInstances: chỗ ngồi cố định chỉ có ở bản chính của phòng đang mở; Tìm chủ đề chỉ khi phòng bật tự tìm', () => {
  const accounts = [
    { ...acc('claude', 'a', 'C:/h/a'), dept: 'it' },
    { ...acc('claude', 'b', 'C:/h/b'), dept: 'it' },
    { ...acc('codex', 'm', null), dept: 'it' },
    { ...acc('claude', 's', 'C:/h/s'), dept: 'sport' },
    { ...acc('claude', 'z', 'C:/h/z'), dept: 'zz' },
  ];
  const depts = [{ slug: 'it', name: 'IT', status: 'active', auto_topics: 0 }, { slug: 'sport', name: 'Thể thao', status: 'active', auto_topics: 1 }, { slug: 'zz', name: 'Đã đóng', status: 'closed', auto_topics: 0 }];
  const plan = O.planInstances(accounts, depts, DEF);
  assert.deepEqual(plan.map((i) => i.name), ['VP-it', 'VP-it-2', 'VP-sport', 'VP-zz']);
  assert.equal(plan[0].seats, 'Ý tưởng:claude,Kịch bản:claude,Đạo diễn hình ảnh:codex,Sản xuất:codex,QC:claude,Gỡ vướng:claude', '6 vị trí core, tắt tự tìm chủ đề thì không có Tìm chủ đề');
  assert.equal(plan[1].seats, '', 'bản phụ chỉ hiện phiên có thật');
  assert.ok(plan[2].seats.endsWith(',Tìm chủ đề:claude'), 'phòng bật tự tìm chủ đề -> thêm chỗ Tìm chủ đề');
  assert.equal(plan[2].seats, 'Ý tưởng:claude,Kịch bản:claude,Đạo diễn hình ảnh:codex:x,Sản xuất:codex:x,QC:claude,Gỡ vướng:claude,Tìm chủ đề:claude', 'phòng chưa được cấp Codex -> vị trí của Codex ghi "chưa theo dõi" (:x), không giả vờ rảnh');
  const claudeOnlyIdea = O.planInstances([{ ...acc('codex', 'm', null), dept: 'it' }], depts, DEF)[0].seats;
  assert.equal(claudeOnlyIdea, 'Ý tưởng:claude,Kịch bản:claude,Đạo diễn hình ảnh:codex,Sản xuất:codex,QC:claude:x,Gỡ vướng:claude:x', 'chỉ có Codex: Ý tưởng vẫn thấy được (giọng Codex), QC/Gỡ vướng không');
  assert.equal(plan[3].seats, '', 'phòng đã đóng không có chỗ ngồi');
});

test('cấp tài khoản theo phòng: việc của phòng chỉ dùng tài khoản của phòng, phòng khác không mượn được', async () => {
  const S = await import('../src/db.mjs');
  S.createDepartment({ slug: 'ofx', name: 'Phòng thử', daily_target: 1, initial_teams: 1, by: 'test' });
  S.createDepartment({ slug: 'ofy', name: 'Phòng khác', daily_target: 1, initial_teams: 1, by: 'test' });
  const shared = P.addAccount({ provider: 'claude', label: 'chung', ready: true, by: 'test' });
  const own = P.addAccount({ provider: 'claude', label: 'rieng', ready: true, by: 'test' });
  assert.throws(() => P.assignAccount(own.id, 'khong-co'), /Không có phòng/);
  P.assignAccount(own.id, 'ofx');
  assert.equal(P.pickAccount('claude', { dept: 'ofx' }).id, own.id, 'phòng có tài khoản riêng -> dùng tài khoản riêng');
  assert.equal(P.pickAccount('claude', { dept: 'ofy' }).id, shared.id, 'phòng chưa cấp -> dùng chung, không mượn của phòng khác');
  assert.equal(P.pickAccount('claude').id, shared.id);
  P.setAccountEnabled(own.id, false);
  assert.equal(P.pickAccount('claude', { dept: 'ofx' }), null, 'tài khoản riêng tắt -> chờ, không lấn sang tài khoản dùng chung');
  P.setAccountEnabled(own.id, true);

  const accounts = P.listAccounts();
  const dir = O.officeDirectory(accounts);
  assert.deepEqual(dir.filter((d) => d.dept === 'ofx').map((d) => d.name), ['VP-ofx']);
  assert.ok(!dir.some((d) => d.accounts.includes('claude/chung')), 'tài khoản dùng chung không được theo dõi');
  const row = () => O.departmentsByInstance(dir, accounts).find((d) => d.slug === 'ofx');
  assert.deepEqual(row().office, ['VP-ofx']);
  assert.deepEqual(row().instances, []);
  S.sql.run("INSERT INTO jobs(kind,provider,dept,status,account_id,title,next_run_at,created_at,updated_at) VALUES('plan','claude','ofx','running',?,'t',?,?,?)", own.id, new Date().toISOString(), new Date().toISOString(), new Date().toISOString());
  assert.deepEqual(row().instances, ['VP-ofx']);
  S.sql.run("UPDATE jobs SET status='succeeded' WHERE dept='ofx'");
  P.assignAccount(own.id, 'none');
  P.removeAccount(own.id);
  P.removeAccount(shared.id);
});

test('URL ghim chế độ 2D (quality=mid)', () => {
  assert.equal(O.officeUrl(4545), 'http://localhost:4545/?view=office&quality=mid');
});

test('biến môi trường đổi đúng thư mục mà whatsmyagentdoing đọc (tài khoản phụ thấy được)', { skip: !O.installed() && 'chưa cài tools/whatsmyagentdoing' }, () => {
  const cli = path.join(O.OFFICE_DIR, 'bin', 'cli.js');
  const claudeHome = path.join(tmp, 'acct', 'claude', 'a');
  const codexHome = path.join(tmp, 'acct', 'codex', 'x');
  const r = spawnSync(process.execPath, [cli, '--help'], { encoding: 'utf8', env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome, CODEX_HOME: codexHome, WMAD_NO_UPDATE_CHECK: '1' } });
  assert.ok(r.stdout.includes(path.join(claudeHome, 'projects')), 'đọc projects của tài khoản Claude phụ');
  assert.ok(r.stdout.includes(path.join(codexHome, 'sessions')), 'đọc sessions của tài khoản Codex phụ');
});

test('khởi động thật: lên trên cổng riêng, chỉ nghe localhost, từ chối Host lạ, chạy lại không nhân đôi, dừng được', { skip: !O.installed() && 'chưa cài tools/whatsmyagentdoing' }, async () => {
  const S = await import('../src/db.mjs');
  S.createDepartment({ slug: 'ofz', name: 'Phòng chạy thật', daily_target: 1, initial_teams: 1, by: 'test' });
  for (const l of ['x', 'y']) P.assignAccount(P.addAccount({ provider: 'codex', label: l, owner: 'T', ready: true }).id, 'ofz'); // 2 Codex -> VP-ofz, VP-ofz-2
  P.addAccount({ provider: 'claude', label: 'khong-cap', owner: 'T', ready: true }); // dùng chung -> không có bản
  const r = await O.startOffice({ hours: 1, private: true });
  assert.deepEqual(r.results.map((x) => x.name), ['VP-ofz', 'VP-ofz-2']);
  assert.equal(r.results.length, 2);
  for (const x of r.results) {
    assert.ok(x.url, x.error);
    assert.equal(await get(x.port), 200);
    const html = await getBody(x.port, '/');
    assert.match(html, /Phòng Phòng chạy thật · /, 'tiêu đề tab có tên phòng');
    assert.ok(html.includes(`🏢 Phòng Phòng chạy thật · ${x.name}`), 'dải tiêu đề có tên phòng + tên bản');
    assert.equal(await get(x.internal), 200, 'bản gốc chạy ở cổng nội bộ');
    assert.equal(await get(x.port, { Host: 'evil.com' }), 403, 'Host lạ bị từ chối');
  }
  assert.ok(r.results.every((x) => x.started));
  const again = await O.startOffice({ hours: 1, private: true });
  assert.ok(again.results.every((x) => !x.started && x.url), 'đã chạy sẵn thì không mở thêm');
  const st = await O.officeStatus();
  assert.equal(st.running.length, 2);
  await O.stopOffice();
  await new Promise((r2) => setTimeout(r2, 800));
  assert.equal((await O.officeStatus()).running.length, 0, 'đã dừng hết');
});
