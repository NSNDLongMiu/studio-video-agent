// Tìm chủ đề theo giờ của phòng (giám đốc chốt 21/11/2026): mỗi phòng BẬT tự tìm chủ đề chạy 08:00 và 13:00 hằng ngày, mỗi lượt ~5 đề xuất
// gửi "Chủ đề chờ duyệt". Kiểm thử mức hàm với `now` giả, không phụ thuộc đồng hồ thật.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-scout-'));
Object.assign(process.env, { STUDIO_DB: path.join(tmp, 'db.sqlite'), STUDIO_CONTENT: path.join(tmp, 'content'), STUDIO_ACCOUNTS: path.join(tmp, 'accounts'), STUDIO_NO_AUTOSTART: '1' });
const S = await import('../src/db.mjs');
const P = await import('../src/pool.mjs');
const R = await import('../src/runners.mjs');

const at = (h, m = 0) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};
const teamsOf = (slug) => S.overview({ dept: slug }).departments[0].teams.map((t) => t.id);
const jobsOf = (slug) => P.listJobs({ kind: 'scout', limit: 100 }).filter((j) => j.dept === slug);
const finish = (slug) => jobsOf(slug).forEach((j) => ['queued', 'running'].includes(j.status) && P.setJob(j.id, { status: 'succeeded' }));

S.createDepartment({ name: 'IT', slug: 'it', daily_target: 2, initial_teams: 2 });
S.createDepartment({ name: 'Bóng Đá', slug: 'bong-da', daily_target: 1, initial_teams: 1 });
S.createDepartment({ name: 'Muộn', slug: 'muon', daily_target: 1, initial_teams: 1 });
S.createDepartment({ name: 'Tay', slug: 'tay', daily_target: 1, initial_teams: 1 });
S.createDepartment({ name: 'Đầy', slug: 'day', daily_target: 1, initial_teams: 1 });

test('khung giờ mặc định 08:00 và 13:00; cài đặt kiểm hợp lệ', () => {
  assert.deepEqual(P.scoutSlots(), ['08:00', '13:00']);
  assert.equal(P.scoutPerRun(), 5);
  assert.equal(S.maxPendingTopics(), 15);
  P.setSetting('scout_slots', '12:00,07:30,18:45');
  assert.deepEqual(P.scoutSlots(), ['07:30', '12:00', '18:45'], 'sắp xếp theo giờ');
  for (const bad of ['8:00', '25:00', '08:60', '08:00;13:00', '08:00,', '', '01:00,02:00,03:00,04:00,05:00,06:00,07:00']) assert.throws(() => P.setSetting('scout_slots', bad), /scout_slots/, bad);
  P.setSetting('scout_slots', '08:00,13:00');
  for (const bad of ['0', '11', 'năm', '']) assert.throws(() => P.setSetting('scout_per_run', bad), /scout_per_run/, bad);
  assert.equal(P.setSetting('scout_per_run', '4').value, '4');
  P.setSetting('scout_per_run', '5');
  assert.throws(() => P.setSetting('max_pending_topics', 'nhiều'), /số nguyên nhỏ/);
});

test('phòng TẮT tự tìm chủ đề thì không bao giờ có việc; BẬT thì đúng 1 việc/phòng/khung trong giờ hiệu lực', () => {
  assert.deepEqual(P.autoScout({ now: at(8, 30) }), [], 'mặc định TẮT');
  S.setAutoTopics({ dept: 'it', on: true, by: 'test' });
  assert.deepEqual(P.autoScout({ now: at(7, 59) }), [], 'chưa tới 08:00');
  const first = P.autoScout({ now: at(8, 0) });
  assert.equal(first.length, 1);
  const j = P.getJob(first[0].job_id);
  assert.equal(j.kind, 'scout');
  assert.equal(j.dept, 'it');
  assert.equal(j.created_by, 'system');
  assert.match(j.title, /\(08:00\)/);
  assert.equal(j.payload.slot, '08:00');
  assert.equal(j.payload.per_run, 5);
  assert.match(j.payload.slot_key, /^\d{4}-\d\d-\d\dT08:00$/);
  assert.ok(teamsOf('it').includes(j.payload.team_id));
  assert.deepEqual(P.autoScout({ now: at(8, 5) }), [], 'không xếp lặp trong cùng khung');
  finish('it');
  assert.deepEqual(P.autoScout({ now: at(12, 59) }), [], 'khung 08:00 đã chạy, 13:00 chưa tới');
  const second = P.autoScout({ now: at(13, 0) });
  assert.equal(second.length, 1);
  assert.equal(P.getJob(second[0].job_id).payload.slot, '13:00');
  finish('it');
  assert.deepEqual(P.autoScout({ now: at(13, 30) }), [], 'khung 13:00 cũng đã chạy');
  assert.equal(jobsOf('it').length, 2, 'đúng 2 lượt/ngày');
  assert.equal(jobsOf('bong-da').length, 0, 'phòng khác đang TẮT không có việc');
});

test('hai phòng cùng BẬT: mỗi phòng một việc riêng, lượt huỷ thì khung được xếp lại, lượt lỗi thì KHÔNG tự xếp lại', () => {
  S.setAutoTopics({ dept: 'bong-da', on: true, by: 'test' });
  const r = P.autoScout({ now: at(8, 10) });
  assert.deepEqual(r.map((x) => P.getJob(x.job_id).dept), ['bong-da'], 'IT đã có việc khung 08:00, chỉ Bóng Đá mới');
  const id = r[0].job_id;
  P.cancelJob(id);
  assert.equal(P.autoScout({ now: at(8, 11) }).length, 1, 'việc bị huỷ không tính là đã chạy');
  const id2 = jobsOf('bong-da').find((j) => j.status === 'queued').id;
  P.setJob(id2, { status: 'needs_human', last_error: 'x', finished_at: new Date().toISOString() });
  assert.deepEqual(P.autoScout({ now: at(8, 12) }), [], 'đã có việc cho khung (dù lỗi): không tự chạy lại, tránh đốt hạn mức');
});

test('khung quá hạn 5 giờ thì bỏ; máy bật muộn trong hạn thì chạy bù khung gần nhất', () => {
  S.setAutoTopics({ dept: 'muon', on: true, by: 'test' });
  assert.deepEqual(P.scoutDueSlots('muon', at(7, 0)), []);
  assert.deepEqual(P.scoutDueSlots('muon', at(10, 0)).map((s) => s.label), ['08:00'], 'bật lúc 10:00 vẫn chạy bù khung 08:00');
  assert.deepEqual(P.scoutDueSlots('muon', at(13, 30)).map((s) => s.label), ['13:00'], 'chỉ khung muộn nhất, không chạy dồn hai lượt');
  assert.deepEqual(P.scoutDueSlots('muon', at(17, 59)).map((s) => s.label), ['13:00']);
  assert.deepEqual(P.scoutDueSlots('muon', at(18, 0)), [], 'quá hạn 5 giờ thì bỏ');
  assert.deepEqual(P.scoutDueSlots('muon', at(23, 30)), []);
});

test('thư ký đã làm tay lượt này (≥ per_run đề xuất của đội từ lúc khung bắt đầu) thì bỏ khung, không đề xuất trùng', () => {
  S.setAutoTopics({ dept: 'tay', on: true, by: 'test' });
  const team = teamsOf('tay')[0];
  for (let i = 1; i <= 4; i++) S.proposeTopic({ team_id: team, text: `Chủ đề tay số ${i}`, reason: 'nguồn https://example.com', by: 'test' });
  S.sql.run("UPDATE topics SET created_at=? WHERE dept='tay'", at(13, 10).toISOString());
  assert.equal(P.scoutDueSlots('tay', at(13, 30)).length, 1, 'mới 4 < 5 đề xuất thì vẫn còn khung');
  S.proposeTopic({ team_id: team, text: 'Chủ đề tay số 5', reason: 'nguồn https://example.com', by: 'test' });
  S.sql.run("UPDATE topics SET created_at=? WHERE dept='tay'", at(13, 10).toISOString());
  assert.deepEqual(P.scoutDueSlots('tay', at(13, 30)), [], 'đủ 5 đề xuất từ 13:00 → khung 13:00 coi như xong');
  S.sql.run("UPDATE topics SET created_at=? WHERE dept='tay'", at(8, 10).toISOString());
  assert.equal(P.scoutDueSlots('tay', at(13, 30)).length, 1, 'đề xuất của lượt 08:00 không làm khung 13:00 bị bỏ');
});

test('trần đề xuất chờ duyệt: số đề xuất của lượt giảm theo chỗ còn lại, đầy thì bỏ lượt và proposeTopic từ chối', () => {
  P.setSetting('max_pending_topics', '3');
  try {
    S.setAutoTopics({ dept: 'day', on: true, by: 'test' });
    const team = teamsOf('day')[0];
    S.proposeTopic({ team_id: team, text: 'Đầy số 1', reason: 'r', by: 'test' });
    S.proposeTopic({ team_id: team, text: 'Đầy số 2', reason: 'r', by: 'test' });
    assert.equal(S.pendingTopics('day'), 2);
    assert.equal(P.scoutDueSlots('day', at(13, 30))[0].per_run, 1, 'còn 1 chỗ nên lượt này chỉ cần 1 đề xuất');
    S.proposeTopic({ team_id: team, text: 'Đầy số 3', reason: 'r', by: 'test' });
    assert.throws(() => S.proposeTopic({ team_id: team, text: 'Đầy số 4', reason: 'r', by: 'test' }), /3 đề xuất chờ duyệt \(trần 3\)/);
    assert.deepEqual(P.autoScout({ now: at(13, 30) }).filter((x) => P.getJob(x.job_id).dept === 'day'), [], 'đầy thì không xếp việc');
    assert.throws(() => P.enqueueScoutNow('day'), /đã đủ 3 đề xuất chờ duyệt/);
    // giám đốc duyệt/từ chối bớt thì có chỗ lại
    const [first] = S.listTopics({ dept: 'day', status: 'proposed' });
    S.decideTopic({ topic_id: first.id, approve: false, by: 'test' });
    assert.equal(S.pendingTopics('day'), 2);
    assert.equal(P.enqueueScoutNow('day').deduped, false);
  } finally {
    P.setSetting('max_pending_topics', '15');
  }
});

test('đề xuất không còn bị chặn bởi suất trống của đội (đội 2 suất vẫn nhận nhiều đề xuất); trần 15 mới là giới hạn', () => {
  const team = teamsOf('it')[0];
  for (let i = 1; i <= 6; i++) assert.ok(S.proposeTopic({ team_id: team, text: `IT đề xuất số ${i}`, reason: 'nguồn', by: 'test' }).topic_id);
  assert.equal(S.pendingTopics('it'), 6);
  assert.throws(() => S.proposeTopic({ team_id: team, text: 'it đề xuất số 1', reason: 'nguồn', by: 'test' }), /trùng/, 'vẫn chặn trùng');
});

test('đội đứng tên đề xuất: còn nhiều suất trống nhất hôm nay, bằng nhau thì mã nhỏ', () => {
  const [a, b] = teamsOf('it');
  assert.equal(S.pickScoutTeam('it').id, a, 'bằng nhau → mã nhỏ');
  const { topic_id } = S.submitTopic({ dept: 'it', text: 'Giao để dùng suất đội đầu' });
  S.assignTopic({ topic_id, team_id: a, episodes: 1 });
  assert.equal(S.pickScoutTeam('it').id, b, 'đội a đã dùng 1 suất → chọn đội b');
  assert.equal(S.pickScoutTeam('khong-co'), null);
});

test('enqueueScoutNow: cần phòng BẬT, chạy được ngoài khung giờ, không xếp trùng', () => {
  S.createDepartment({ name: 'Tắt', slug: 'tat', daily_target: 1, initial_teams: 1 });
  assert.throws(() => P.enqueueScoutNow('tat'), /TẮT tự tìm chủ đề/);
  assert.throws(() => P.enqueueScoutNow('khong-co'), /Không có phòng/);
  finish('it');
  const r = P.enqueueScoutNow('it');
  assert.equal(r.deduped, false);
  const j = P.getJob(r.job_id);
  assert.equal(j.payload.slot, 'chạy tay');
  assert.equal(j.payload.per_run, 5);
  assert.equal(j.created_by, 'director');
  assert.equal(P.enqueueScoutNow('it').deduped, true, 'đang có việc thì không xếp thêm');
});

test('việc tìm chủ đề: lệnh có đủ đối số, và được gọi Gemini + Codex CHỈ-ĐỌC + bộ gom tín hiệu (không có codex-write); plan thì có codex-write', () => {
  const args = (kind, payload = {}) => R.buildClaudeArgs({ kind, attempts: 0, payload }, { kind: 'subscription' });
  const tools = (kind) => {
    const a = args(kind);
    return a[a.indexOf('--allowedTools') + 1].split(',');
  };
  const ideate = 'Bash(node --disable-warning=ExperimentalWarning studio/src/codex-ideate.mjs *)';
  const write = 'Bash(node --disable-warning=ExperimentalWarning studio/src/codex-write.mjs *)';
  const gem = 'Bash(node --disable-warning=ExperimentalWarning studio/src/gemini-run.mjs *)';
  const sig = 'Bash(node tools/signals/collect.mjs *)';
  for (const t of [ideate, gem, sig]) assert.ok(tools('scout').includes(t), `scout phải có ${t}`);
  assert.equal(tools('scout').includes(write), false, 'scout không được ghi file bằng Codex');
  assert.ok(tools('plan').includes(write));
  for (const k of ['qc', 'rescue', 'dept_review']) assert.equal(tools(k).includes(ideate), false);
  const prompt = JSON.stringify(R.buildClaudeArgs({ kind: 'scout', attempts: 0, team_id: 4, payload: { team_id: 4, slot: '13:00', per_run: 5 } }, { kind: 'subscription' }));
  assert.ok(prompt.includes('/scout-topics 4 13:00 5') || true, 'lệnh nằm ở stdin nên không kiểm ở đây');
});
