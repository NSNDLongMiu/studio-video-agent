// Giám đốc chốt 18/11/2026: không cần duyệt kế hoạch (xong kế hoạch tự sản xuất), gỡ vướng tối đa 4 lần, sản xuất dưới 10 lần.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-autoprod-'));
Object.assign(process.env, {
  STUDIO_DB: path.join(tmp, 'db.sqlite'), STUDIO_CONTENT: path.join(tmp, 'content'), STUDIO_ACCOUNTS: path.join(tmp, 'accounts'), STUDIO_NO_AUTOSTART: '1',
});
const S = await import('../src/db.mjs');
const P = await import('../src/pool.mjs');

S.createDepartment({ name: 'Thử', slug: 'thu', daily_target: 2, initial_teams: 1 });
let n = 0;
const planPayload = (extra = {}) => {
  const topic_id = S.submitTopic({ dept: 'thu', text: `chủ đề thử ${++n}` }).topic_id; // mỗi chủ đề 1 khoá kế hoạch riêng
  return P.getJob(P.enqueueJob({ kind: 'plan', topic_id, ...extra }).job_id).payload;
};

test('mặc định: kế hoạch xong tự sản xuất (không cần giám đốc duyệt kế hoạch)', () => {
  assert.equal(P.getSetting('auto_produce'), 'on');
  assert.equal(planPayload().auto_produce, true);
});

test('ghi đè từng lần bằng auto_produce true/false', () => {
  assert.equal(planPayload({ auto_produce: false }).auto_produce, false);
  assert.equal(planPayload({ auto_produce: true }).auto_produce, true);
});

test('tắt cài đặt auto_produce thì mặc định quay về chờ giám đốc duyệt', () => {
  P.setSetting('auto_produce', 'off');
  assert.equal(planPayload().auto_produce, false);
  assert.equal(planPayload({ auto_produce: true }).auto_produce, true);
  P.setSetting('auto_produce', 'on');
  assert.equal(planPayload().auto_produce, true);
  assert.throws(() => P.setSetting('auto_produce', 'maybe'), /chỉ nhận on\/off/);
});

test('giới hạn thử lại mặc định: gỡ vướng 4 lần, sản xuất dưới 10 lần (tối đa 9)', () => {
  assert.equal(P.getSetting('max_rescues_per_video'), '4');
  assert.equal(P.getSetting('max_produce_per_video'), '9');
});

test('số vòng tranh luận: mặc định 2, trần 4', () => {
  assert.equal(planPayload().rounds, 2);
  assert.equal(planPayload({ rounds: 4 }).rounds, 4);
  assert.equal(planPayload({ rounds: 9 }).rounds, 4);
});
