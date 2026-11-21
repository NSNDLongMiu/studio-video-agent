// codex-write.mjs: Codex thoát mã 0 mà không ghi file đầu ra thì phải báo mã 8 (không được ghi "đã viết xong"), và sổ tải ghi no_output.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-cw-'));
Object.assign(process.env, {
  STUDIO_DB: path.join(tmp, 'db.sqlite'), STUDIO_CONTENT: path.join(tmp, 'content'), STUDIO_ACCOUNTS: path.join(tmp, 'accounts'), STUDIO_NO_AUTOSTART: '1',
});
const here = path.dirname(fileURLToPath(import.meta.url));
const stub = path.join(here, 'helpers', 'codex-write-stub.mjs');
const script = path.join(here, '..', 'src', 'codex-write.mjs');
const S = await import('../src/db.mjs');
const P = await import('../src/pool.mjs');
const CW = await import('../src/codex-write.mjs');

P.addAccount({ provider: 'codex', label: 'x', owner: 'Test', ready: true });
const topic = path.join(tmp, 'content', 'it', 'T1-thu');
fs.mkdirSync(path.join(topic, 'review'), { recursive: true });
const promptFile = path.join(topic, 'review', 'codex-script-r1.prompt.md');
fs.writeFileSync(promptFile, 'viết kịch bản');
const run = (mode, { stubMode, file }) => spawnSync(process.execPath, ['--disable-warning=ExperimentalWarning', script, mode, promptFile, topic], { encoding: 'utf8', env: { ...process.env, CODEX_JS: stub, STUB_CW_MODE: stubMode, STUB_CW_FILE: file || '' } });
const lastCall = () => ({ ...S.sql.get('SELECT provider,mode,outcome FROM agent_calls ORDER BY id DESC LIMIT 1') });

test('producedFiles/EXPECTED: chỉ nhận file mới sửa, bỏ .reply.md, bỏ assets, nhận đúng tên đầu ra', () => {
  const d = fs.mkdtempSync(path.join(tmp, 'pf-'));
  fs.mkdirSync(path.join(d, 'review'), { recursive: true });
  fs.mkdirSync(path.join(d, 'assets'), { recursive: true });
  fs.mkdirSync(path.join(d, 'ep01'), { recursive: true });
  const old = new Date(Date.now() - 3_600_000);
  fs.writeFileSync(path.join(d, 'review', 'script-codex-r1.md'), 'cũ');
  fs.utimesSync(path.join(d, 'review', 'script-codex-r1.md'), old, old);
  fs.writeFileSync(path.join(d, 'review', 'script-codex-r2.md'), 'mới');
  fs.writeFileSync(path.join(d, 'review', 'x.prompt.md.reply.md'), 'phản hồi của chính script');
  fs.writeFileSync(path.join(d, 'assets', 'script-codex-r9.md'), 'trong assets, bỏ');
  fs.writeFileSync(path.join(d, 'ep01', 'storyboard.json'), '{}');
  const got = CW.producedFiles(d, Date.now() - 60_000).sort();
  assert.deepEqual(got, ['ep01/storyboard.json', 'review/script-codex-r2.md']);
  assert.ok(CW.EXPECTED.script.test('review/script-codex-r2.md'));
  assert.ok(!CW.EXPECTED.script.test('review/script-r2.md'), 'bản chốt của Claude không phải đầu ra của Codex');
  assert.ok(!CW.EXPECTED.script.test('review/script-codex-r2.md.reply.md'));
  assert.ok(CW.EXPECTED.storyboard.test('ep01/storyboard.json'));
  assert.ok(!CW.EXPECTED.storyboard.test('ep01/storyboard.md'));
});

test('Codex ghi đúng file đầu ra → mã 0, ghi sổ ok', () => {
  const r = run('script', { stubMode: 'write', file: 'review/script-codex-r1.md' });
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(lastCall(), { provider: 'codex', mode: 'write-script', outcome: 'ok' });
});

test('Codex thoát mã 0 mà KHÔNG ghi file → mã 8 KHONG_RA_FILE, sổ ghi no_output, nhật ký không nói "đã viết xong"', () => {
  fs.rmSync(path.join(topic, 'review', 'script-codex-r1.md'), { force: true });
  const r = run('script', { stubMode: 'nowrite' });
  assert.equal(r.status, 8, r.stderr);
  assert.match(r.stderr, /KHONG_RA_FILE/);
  assert.match(r.stderr, /Môi trường chặn đọc/, 'đưa lời Codex vào lỗi để Claude biết vì sao');
  assert.deepEqual(lastCall(), { provider: 'codex', mode: 'write-script', outcome: 'no_output' });
  const newest = S.recentEvents(1)[0].message; // sự kiện của CHÍNH lượt này (các lượt trước đã có dòng 'đã viết xong' hợp lệ)
  assert.match(newest, /KHÔNG ghi file đầu ra/);
  assert.doesNotMatch(newest, /đã viết xong/, 'không báo thành công giả');
});

test('file đầu ra cũ đã có từ trước nhưng Codex không sửa → vẫn mã 8 (không bị lừa bởi file cũ)', () => {
  const f = path.join(topic, 'review', 'script-codex-r1.md');
  fs.writeFileSync(f, 'bản cũ');
  const old = new Date(Date.now() - 3_600_000);
  fs.utimesSync(f, old, old);
  const r = run('script', { stubMode: 'stale' });
  assert.equal(r.status, 8, r.stderr);
});

test('Codex 0.171: dùng --approve-for-me, KHÔNG dùng --sandbox (workspace-write bị hạ thành chỉ-đọc ở chế độ nền)', () => {
  const argsFile = path.join(tmp, 'argv.json');
  const r = spawnSync(process.execPath, ['--disable-warning=ExperimentalWarning', script, 'script', promptFile, topic], { encoding: 'utf8', env: { ...process.env, CODEX_JS: stub, STUB_CW_MODE: 'write', STUB_CW_FILE: 'review/script-codex-r1.md', STUB_CW_ARGS: argsFile } });
  assert.equal(r.status, 0, r.stderr);
  const argv = JSON.parse(fs.readFileSync(argsFile, 'utf8'));
  assert.ok(argv.includes('--approve-for-me'), argv.join(' '));
  assert.ok(!argv.includes('--sandbox'), 'cờ --sandbox bị Codex 0.171 hạ âm thầm xuống chỉ-đọc');
  assert.equal(argv[argv.indexOf('--cd') + 1], topic, 'vẫn --cd vào thư mục chủ đề');
});

test('Codex ghi ra NGOÀI thư mục chủ đề → vẫn xong nhưng nhật ký có CẢNH BÁO (kiểm nông)', () => {
  const r = run('script', { stubMode: 'scribble', file: 'review/script-codex-r1.md' });
  assert.equal(r.status, 0, r.stderr);
  const warn = S.recentEvents(5).map((e) => e.message).find((m) => /CẢNH BÁO/.test(m));
  assert.ok(warn, 'phải có cảnh báo');
  assert.match(warn, /scribble\.txt/);
  fs.rmSync(path.join(path.dirname(topic), 'scribble.txt'), { force: true });
  assert.ok(!CW.outsideWrites(topic, Date.now()).some((f) => /scribble/.test(f)), 'đã xoá file thì không còn bị báo');
});

test('storyboard: đòi storyboard.json mới ghi; ghi đúng thì mã 0', () => {
  assert.equal(run('storyboard', { stubMode: 'nowrite' }).status, 8);
  const ok = run('storyboard', { stubMode: 'write', file: 'ep01/storyboard.json' });
  assert.equal(ok.status, 0, ok.stderr);
});
