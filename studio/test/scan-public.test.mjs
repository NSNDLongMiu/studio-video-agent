// Lệnh quét trước khi commit/push (quy tắc sửa hệ thống số 5, giám đốc duyệt 18/11/2026).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const tool = fileURLToPath(new URL('../../tools/scan-public.mjs', import.meta.url));
const mkRepo = () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'scan-public-'));
  spawnSync('git', ['init', '-q', d]);
  return d;
};
const put = (d, rel, text) => {
  fs.mkdirSync(path.dirname(path.join(d, rel)), { recursive: true });
  fs.writeFileSync(path.join(d, rel), text);
};
const scan = (d, ...extra) => spawnSync(process.execPath, [tool, '--root', d, ...extra], { encoding: 'utf8' });
const fakeEmail = ['nguyen.van.a', 'gmail.com'].join('@'); // ghép lúc chạy để chính tệp test này không bị quét báo

test('repo sạch: mã 0', () => {
  const d = mkRepo();
  put(d, 'README.md', 'Xin chào, đây là tài liệu không có gì nhạy cảm. Liên hệ: <email>');
  const r = scan(d);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /SẠCH/);
});

test('email thật: mã 1 và không in nguyên email', () => {
  const d = mkRepo();
  put(d, 'docs/a.md', `Liên hệ: ${fakeEmail}`);
  const r = scan(d);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /docs\/a\.md:1 — email/);
  assert.ok(!r.stdout.includes(fakeEmail), 'không được in nguyên email');
});

test('email mẫu trong danh sách cho phép: mã 0', () => {
  const d = mkRepo();
  put(d, 'test.md', 'ví dụ a@b.vn và ai@example.com');
  assert.equal(scan(d).status, 0);
});

test('khoá kiểu sk-: mã 1 và không lộ khoá', () => {
  const d = mkRepo();
  const key = `sk-${'A1b2'.repeat(10)}`;
  put(d, 'src/x.mjs', `const k = "${key}";`);
  const r = scan(d);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /khoá kiểu sk-/);
  assert.ok(!r.stdout.includes(key), 'không được in nguyên khoá');
});

test('tệp nhạy cảm sắp vào git: mã 1', () => {
  const d = mkRepo();
  put(d, 'studio/accounts/claude/b/.credentials.json', '{}');
  const r = scan(d);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /tệp nhạy cảm/);
});

test('tệp bị .gitignore bỏ qua thì không quét', () => {
  const d = mkRepo();
  put(d, '.gitignore', 'bi-mat/\n');
  put(d, 'bi-mat/ghi-chu.txt', `email: ${fakeEmail}`);
  assert.equal(scan(d).status, 0);
});

test('--staged chỉ quét tệp đã git add', () => {
  const d = mkRepo();
  put(d, 'sach.md', 'không có gì');
  put(d, 'ban.md', `email: ${fakeEmail}`);
  spawnSync('git', ['-C', d, 'add', 'sach.md']);
  assert.equal(scan(d, '--staged').status, 0);
  spawnSync('git', ['-C', d, 'add', 'ban.md']);
  assert.equal(scan(d, '--staged').status, 1);
});
