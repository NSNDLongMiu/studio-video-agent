// Đổi chủ tài khoản: chỉ đổi nhãn "ghế của ai", ghi sự kiện, từ chối tên rỗng / tài khoản không có.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-owner-'));
Object.assign(process.env, {
  STUDIO_DB: path.join(tmp, 'db.sqlite'), STUDIO_CONTENT: path.join(tmp, 'content'), STUDIO_ACCOUNTS: path.join(tmp, 'accounts'), STUDIO_NO_AUTOSTART: '1',
});
const S = await import('../src/db.mjs');
const P = await import('../src/pool.mjs');
const owner = (ref) => P.listAccounts().find((a) => `${a.provider}/${a.label}` === ref).owner;

test('setAccountOwner đổi chủ, ghi sự kiện, không đụng trạng thái', () => {
  P.addAccount({ provider: 'claude', label: 'b', owner: 'Chưa rõ', ready: true });
  const before = P.listAccounts().find((a) => a.label === 'b');
  const r = P.setAccountOwner('claude/b', '  Giám đốc ');
  assert.equal(r.owner, 'Giám đốc');
  assert.equal(owner('claude/b'), 'Giám đốc');
  const after = P.listAccounts().find((a) => a.label === 'b');
  assert.equal(after.status, before.status);
  assert.equal(after.enabled, before.enabled);
  assert.ok(S.recentEvents(5).some((e) => /Đặt chủ tài khoản Claude .*\[ghế b\]/.test(e.message)));
});

test('setAccountOwner từ chối tên rỗng và tài khoản không tồn tại', () => {
  assert.throws(() => P.setAccountOwner('claude/b', '   '), /Cần nhập tên chủ tài khoản/);
  assert.equal(owner('claude/b'), 'Giám đốc');
  assert.throws(() => P.setAccountOwner('claude/khong-co', 'X'), /Không có tài khoản/);
});
