import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseResetTime, classifyFailure, backoffMs } from '../src/limits.mjs';

const NOW = new Date('2026-11-16T08:00:00Z'); // 15:00 giờ Sài Gòn (UTC+7)
const iso = (d) => d && d.toISOString();

test('epoch sau dấu | (định dạng cũ của Claude)', () => {
  const epoch = Math.floor(NOW.getTime() / 1000) + 3600; // 1 giờ nữa
  assert.equal(iso(parseResetTime(`Claude AI usage limit reached|${epoch}`, NOW)), '2026-11-16T09:00:00.000Z');
});

test('tương đối: "try again in 3 days 4 hours 12 minutes" / giây', () => {
  assert.equal(iso(parseResetTime('You\'ve hit your usage limit. Try again in 3 days 4 hours 12 minutes.', NOW)), '2026-11-19T12:12:00.000Z');
  assert.equal(iso(parseResetTime('try again in 2 seconds', NOW)), '2026-11-16T08:00:02.000Z');
  assert.equal(iso(parseResetTime('retry after 90 minutes', NOW)), '2026-11-16T09:30:00.000Z');
});

test('Codex: ngày có tên tháng', () => {
  const t = new Date('2026-07-06T00:00:00');
  const d = parseResetTime("You've hit your usage limit. Upgrade to Plus to continue using Codex, or try again at Jul 7th, 2026 12:35 AM.", t);
  assert.equal(d.getFullYear(), 2026);
  assert.equal(d.getMonth(), 6);
  assert.equal(d.getDate(), 7);
  assert.equal(d.getHours(), 0);
  assert.equal(d.getMinutes(), 35);
  const e = parseResetTime("You've reached your usage limit. Upgrade your plan or add credits to continue, or try again after Aug 27, 00:08.", new Date('2026-08-20T10:00:00'));
  assert.equal(e.getMonth(), 7);
  assert.equal(e.getDate(), 27);
  assert.equal(e.getHours(), 0);
  assert.equal(e.getMinutes(), 8);
});

test('Claude: giờ kèm múi giờ IANA', () => {
  // 15:00 Sài Gòn đã là hiện tại (08:00Z) -> lần 15:00 kế tiếp là ngày mai = 2026-11-17T08:00Z
  assert.equal(iso(parseResetTime("You've hit your limit · resets 3pm (Asia/Ho_Chi_Minh)", NOW)), '2026-11-17T08:00:00.000Z');
  // "Asia/Saigon" là tên cũ (link) của Asia/Ho_Chi_Minh, Node vẫn hiểu
  assert.equal(iso(parseResetTime("resets 3pm (Asia/Saigon)", NOW)), '2026-11-17T08:00:00.000Z');
  // 16:00 Sài Gòn còn ở phía trước hôm nay = 09:00Z
  assert.equal(iso(parseResetTime('Your limit will reset at 4pm (Asia/Ho_Chi_Minh).', NOW)), '2026-11-16T09:00:00.000Z');
  // múi giờ khác: 3pm America/Santiago (CLT, UTC-3 vào tháng 11) = 18:00Z
  assert.equal(iso(parseResetTime('Your limit will reset at 3pm (America/Santiago).', NOW)), '2026-11-16T18:00:00.000Z');
  assert.equal(iso(parseResetTime('5-hour limit reached ∙ resets 3:45pm (UTC)', NOW)), '2026-11-16T15:45:00.000Z');
});

test('Claude: có thứ trong tuần', () => {
  const d = parseResetTime('Weekly limit reached · resets Mon 12:00am (UTC)', NOW); // 16/11/2026 là Thứ Hai
  assert.equal(iso(d), '2026-11-23T00:00:00.000Z');
});

test('giờ hồi phi lý hoặc không có => null', () => {
  assert.equal(parseResetTime('429 Too Many Requests', NOW), null);
  assert.equal(parseResetTime('resets in 999 days', NOW), null);
  assert.equal(parseResetTime('', NOW), null);
});

test('phân loại: limit / auth / other', () => {
  assert.equal(classifyFailure("You've hit your usage limit. try again in 2 hours", NOW).type, 'limit');
  assert.equal(iso(classifyFailure("You've hit your usage limit. try again in 2 hours", NOW).resetAt), '2026-11-16T10:00:00.000Z');
  assert.equal(classifyFailure('Error: 429 Too Many Requests', NOW).type, 'limit');
  assert.equal(classifyFailure('Credit balance is too low', NOW).type, 'limit');
  assert.equal(classifyFailure('Not logged in · Please run /login', NOW).type, 'auth');
  assert.equal(classifyFailure('API Error: 401 {"type":"authentication_error"}', NOW).type, 'auth');
  assert.equal(classifyFailure('Segmentation fault (core dumped)', NOW).type, 'other');
  assert.equal(classifyFailure('', NOW).type, 'other');
  // câu "usage limit" mạnh thắng dòng chứa 401 vô tình
  assert.equal(classifyFailure('request id 401abc\nYou have reached your usage limit', NOW).type, 'limit');
});

test('backoff tăng dần, tối đa 6 giờ', () => {
  assert.deepEqual([1, 2, 3, 4, 5, 9].map((n) => backoffMs(n) / 60000), [30, 60, 120, 240, 360, 360]);
});
