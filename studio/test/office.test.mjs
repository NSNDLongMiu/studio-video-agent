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
const get = (port, headers = {}, p = '/') => new Promise((r) => http.get({ host: '127.0.0.1', port, path: p, headers, timeout: 3000 }, (res) => { res.resume(); r(res.statusCode); }).on('error', () => r(0)));

after(async () => {
  await O.stopOffice();
});

test('planInstances: luôn có bản mặc định; tài khoản phụ ghép Claude với Codex theo thứ tự', () => {
  assert.deepEqual(O.planInstances([]).map((i) => i.env), [{}]);
  const accounts = [acc('claude', 'main', null), acc('claude', 'a', 'C:/h/claude/a'), acc('claude', 'b', 'C:/h/claude/b'), acc('codex', 'x', 'C:/h/codex/x'), acc('claude', 'off', 'C:/h/claude/off', false)];
  const plan = O.planInstances(accounts);
  assert.equal(plan.length, 3, 'mặc định + 2 bản (2 Claude phụ, 1 Codex phụ), tài khoản tắt và tài khoản mặc định không tính');
  assert.deepEqual(plan[1].env, { CLAUDE_CONFIG_DIR: 'C:/h/claude/a', CODEX_HOME: 'C:/h/codex/x' });
  assert.deepEqual(plan[2].env, { CLAUDE_CONFIG_DIR: 'C:/h/claude/b' });
  assert.match(plan[1].label, /claude\/a \+ codex\/x/);
  assert.equal(O.planInstances(accounts, { includeAccounts: false }).length, 1);
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
  P.addAccount({ provider: 'codex', label: 'x', owner: 'T', ready: true }); // có thư mục riêng -> thêm 1 bản bổ sung
  const r = await O.startOffice({ hours: 1, private: true });
  assert.equal(r.results.length, 2);
  for (const x of r.results) {
    assert.ok(x.url, x.error);
    assert.equal(await get(x.port), 200);
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
