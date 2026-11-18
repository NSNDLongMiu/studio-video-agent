import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-claude-stream-'));
after(() => fs.rmSync(tmp, { recursive: true, force: true }));
Object.assign(process.env, {
  STUDIO_DB: path.join(tmp, 'db.sqlite'),
  STUDIO_CONTENT: path.join(tmp, 'content'),
  STUDIO_ACCOUNTS: path.join(tmp, 'accounts'),
  STUDIO_NO_AUTOSTART: '1',
});
const { buildClaudeArgs, claudeJobEnv, parseClaudeJson, writeLogMeta } = await import('../src/runners.mjs');
const { classifyFailure } = await import('../src/limits.mjs');
const sample = fs.readFileSync(new URL('./fixtures/claude-stream-sample.ndjson', import.meta.url), 'utf8');

test('Claude stream-json: lấy result cuối trong mẫu thực có hai result', () => {
  assert.equal(parseClaudeJson(sample).result, 'done');
});

test('Claude JSON cũ: đọc cả object nhiều dòng và bỏ qua cảnh báo trước object một dòng', () => {
  const result = { type: 'result', result: 'OK', is_error: false, total_cost_usd: 0.01 };
  assert.deepEqual(parseClaudeJson(JSON.stringify(result, null, 2)), result);
  assert.deepEqual(parseClaudeJson(`Cảnh báo khởi động\n${JSON.stringify(result)}`), result);
});

test('Claude stream-json: chịu đầu bị cắt, cảnh báo giữa luồng và sự kiện sau result', () => {
  const stream = [
    '"type":"assistant"}',
    '{"type":"result","result":"lượt trước"}',
    'Cảnh báo giữa luồng',
    '  {"type":"result","result":"lượt cuối"}',
    '{"type":"system"}',
  ].join('\r\n');
  assert.equal(parseClaudeJson(stream).result, 'lượt cuối');
});

test('Claude stream-json: giữ kết quả lỗi để phân loại hết limit hoặc lỗi đăng nhập', () => {
  for (const [type, result] of [
    ['limit', "You've hit your limit · try again in 2 seconds"],
    ['auth', 'Not logged in · Please run /login'],
  ]) {
    const error = { type: 'result', is_error: true, result };
    const stream = `{"type":"system"}\n${JSON.stringify(error)}\n`;
    const parsed = parseClaudeJson(stream);
    assert.deepEqual(parsed, error);
    assert.equal(classifyFailure(parsed.result).type, type);
  }
});

test('Claude JSON: dự phòng bằng dòng JSON cuối hợp lệ, trả null khi đầu vào rác', () => {
  assert.deepEqual(parseClaudeJson('cảnh báo\n{"thứ_tự":1}\n{"thứ_tự":2}\n{lỗi'), { thứ_tự: 2 });
  assert.equal(parseClaudeJson('dữ liệu rác\n{lỗi'), null);
});

test('việc Claude nền dùng --output-format stream-json và --verbose', () => {
  const args = buildClaudeArgs({ kind: 'plan', attempts: 0 }, { kind: 'subscription' });
  assert.deepEqual(args.filter((arg) => arg === '--output-format'), ['--output-format']);
  assert.equal(args[args.indexOf('--output-format') + 1], 'stream-json');
  assert.ok(args.includes('--verbose'));
});

test('môi trường Claude truyền phòng, mã việc và mã chủ đề khi có', () => {
  const account = { kind: 'subscription' };
  const env = claudeJobEnv({ id: 42, topic_id: 7, dept: 'it' }, account);
  assert.equal(env.STUDIO_DEPT, 'it');
  assert.equal(env.STUDIO_JOB_ID, '42');
  assert.equal(env.STUDIO_TOPIC_ID, '7');

  const withoutTopic = claudeJobEnv({ id: 43, topic_id: null }, account);
  assert.equal(withoutTopic.STUDIO_JOB_ID, '43');
  assert.equal(Object.hasOwn(withoutTopic, 'STUDIO_TOPIC_ID'), false);
});

test('writeLogMeta tạo thư mục và ghi đúng JSON thụt 2 dấu cách cạnh log', () => {
  const logFile = path.join(tmp, 'logs', 'nested', 'codex-write-script.log');
  const meta = { v: 1, source: 'codex-write', role: 'script', job_id: 42, topic_id: 7 };
  assert.equal(writeLogMeta(logFile, meta), true);
  assert.equal(fs.readFileSync(`${logFile}.meta.json`, 'utf8'), JSON.stringify(meta, null, 2));
});

test('writeLogMeta trả false khi đường dẫn cha là file', () => {
  const parentFile = path.join(tmp, 'parent-file');
  fs.writeFileSync(parentFile, '');
  assert.equal(writeLogMeta(path.join(parentFile, 'codex-ideate.log'), { v: 1 }), false);
});
