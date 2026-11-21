import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-test-'));
process.env.STUDIO_DB = path.join(tmp, 'db.sqlite');
process.env.STUDIO_CONTENT = path.join(tmp, 'content');
const S = await import('../src/db.mjs');
const { formatOverview } = await import('../src/format.mjs');

const dept = (o, slug) => o.departments.find((d) => d.slug === slug);

test('kịch bản: Thể thao tăng lên 4 video/ngày -> trưởng phòng đề xuất -> giám đốc duyệt', () => {
  S.createDepartment({ name: 'Thể thao', slug: 'sport', daily_target: 2, initial_teams: 1 });
  S.createDepartment({ name: 'IT', slug: 'it', daily_target: 1, initial_teams: 1 });
  let o = S.overview();
  assert.equal(dept(o, 'sport').capacity, 2);
  assert.equal(o.totals.members, 12); // 2 đội x 6 người biên chế (ideator_a/b/c/d, planner, producer; support trực không tính)

  const r = S.setDailyTarget({ slug: 'sport', target: 4 });
  assert.equal(r.gap_videos, 2);
  assert.equal(r.needs_head_review, true);
  o = S.overview();
  assert.equal(dept(o, 'sport').suggested_new_teams, 1);
  assert.ok(o.attention.some((a) => a.kind === 'capacity'));

  const p = S.proposeChange({ dept: 'sport', type: 'add_team', count: 1, reason: 'Chỉ tiêu 4/ngày, 1 đội chỉ làm được 2.', by: 'head:sport' });
  assert.equal(S.proposeChange({ dept: 'sport', type: 'add_team', count: 1, reason: 'Chỉ tiêu 4/ngày, 1 đội chỉ làm được 2.' }).proposal_id, p.proposal_id, 'đề xuất trùng không tạo mới');
  assert.equal(S.overview().totals.pending_proposals, 1);
  assert.equal(dept(S.overview(), 'sport').teams.length, 1, 'chưa duyệt thì chưa có đội mới');

  const d = S.decideProposal({ id: p.proposal_id, approve: true });
  assert.equal(d.applied.new_teams.length, 1);
  o = S.overview();
  assert.equal(dept(o, 'sport').teams.length, 2);
  assert.equal(dept(o, 'sport').capacity, 4);
  assert.equal(dept(o, 'sport').gap_videos, 0);
  assert.equal(o.totals.pending_proposals, 0);
  assert.throws(() => S.decideProposal({ id: p.proposal_id, approve: true }), /đã được xử lý/);
});

test('giao chủ đề giám đốc vượt suất/ngày, báo cáo trạng thái, vướng & hỗ trợ', () => {
  const t1 = S.submitTopic({ dept: 'sport', text: '3 sai lầm khi chạy bộ' }).topic_id;
  const a = S.assignTopic({ topic_id: t1, episodes: 2 });
  assert.equal(a.videos.length, 2);
  assert.equal(a.over_capacity, 0);
  assert.match(a.videos[0], /^SPORT-T\d+-E01$/);
  assert.ok(fs.existsSync(path.resolve(S.ROOT, a.topic_folder, 'brief.md')));
  const t2 = S.submitTopic({ dept: 'sport', text: 'Highlight cuối tuần' }).topic_id;
  const b = S.assignTopic({ topic_id: t2, episodes: 2 });
  assert.notEqual(a.team_id, b.team_id, 'tự chọn đội còn suất');
  assert.doesNotMatch(formatOverview(S.overview()), /VƯỢT SUẤT/);
  const t3 = S.submitTopic({ dept: 'sport', text: 'Quá tải' }).topic_id;
  const c = S.assignTopic({ topic_id: t3, episodes: 1 });
  assert.equal(c.videos.length, 1);
  assert.equal(c.over_capacity, 1);
  const [event] = S.recentEvents(1);
  assert.equal(event.kind, 'assign');
  assert.ok(event.message.includes(`VƯỢT SUẤT 1 video (3/2 ngày ${c.planned_for}) theo yêu cầu của giám đốc`));
  const formatted = formatOverview(S.overview());
  assert.match(formatted, /hôm nay 3\/2 suất · VƯỢT SUẤT theo yêu cầu giám đốc/);
  assert.match(formatted, /hôm nay 2\/2 suất\n/);

  const future = S.assignTopic({ topic_id: t3, episodes: 1, planned_for: '2099-01-01' });
  assert.equal(future.planned_for, '2099-01-01');
  assert.equal(future.over_capacity, 0);

  S.reportStatus({ team_id: a.team_id, role: 'producer', status: 'working', task: 'Dựng tập 1', video_id: a.videos[0] });
  S.reportStatus({ team_id: a.team_id, role: 'planner', status: 'working', task: 'Viết kịch bản', video_id: a.videos[1] });
  let o = S.overview();
  assert.equal(dept(o, 'sport').members_working, 2);
  assert.throws(() => S.reportStatus({ team_id: a.team_id, role: 'producer', status: 'working', video_id: b.videos[0] }), /không thuộc đội/);
  assert.throws(() => S.reportStatus({ team_id: a.team_id, role: 'boss', status: 'working' }), /không có vai/);

  S.escalate({ video_id: a.videos[0], reason: 'ffmpeg lỗi font tiếng Việt' });
  o = S.overview();
  assert.equal(o.totals.members_blocked, 1);
  assert.ok(o.attention.some((x) => x.kind === 'help'));
  S.resolveEscalation({ video_id: a.videos[0], note: 'đã đổi font' });
  assert.equal(S.overview().totals.members_blocked, 0);

  S.setVideoStage({ video_id: a.videos[0], stage: 'ready' });
  const m = dept(S.overview(), 'sport').teams.flatMap((t) => t.members).find((x) => x.role === 'producer' && x.video_id);
  assert.equal(m, undefined, 'video xong thì người làm trở về rảnh');
  assert.equal(dept(S.overview(), 'sport').done_today, 1);
  assert.ok(formatOverview(S.overview()).includes('Thể thao'));
});

test('chặn: đóng phòng khi còn video, giải thể đội đang bận, tự duyệt không có đường tắt', () => {
  assert.throws(() => S.closeDepartment({ slug: 'sport' }), /còn \d+ video đang làm/);
  const busy = S.overview().departments.find((d) => d.slug === 'sport').teams[0].id;
  const p = S.proposeChange({ dept: 'sport', type: 'remove_team', team_id: busy, reason: 'Thử giải thể đội đang bận.' });
  assert.throws(() => S.decideProposal({ id: p.proposal_id, approve: true }), /chưa thể giải thể/);
  assert.equal(S.listProposals({ status: 'pending' }).length, 1, 'lỗi thì đề xuất vẫn chờ (rollback)');
  S.decideProposal({ id: p.proposal_id, approve: false, note: 'Đang bận' });
  assert.throws(() => S.proposeChange({ dept: 'sport', type: 'add_team', reason: 'ngắn' }), /lý do/i);
});

test('đóng/mở phòng do giám đốc quyết định', () => {
  const r = S.closeDepartment({ slug: 'it' });
  assert.equal(r.status, 'closed');
  let o = S.overview();
  assert.equal(o.totals.departments_active, 1);
  assert.equal(o.totals.departments_closed, 1);
  assert.throws(() => S.submitTopic({ dept: 'it', text: 'x' }), /đóng/);
  S.reopenDepartment({ slug: 'it', initial_teams: 1 });
  o = S.overview();
  assert.equal(dept(o, 'it').teams.length, 1);
  const f = S.closeDepartment({ slug: 'sport', force: true });
  assert.ok(f.cancelled_videos.length > 0);
});

test('xoá sạch phòng: chặn khi đang mở, xoá hết dữ liệu khi đã đóng', () => {
  const t = S.submitTopic({ dept: 'it', text: 'Chủ đề thử để xoá' }).topic_id;
  assert.throws(() => S.purgeDepartment({ slug: 'it' }), /đang mở/);
  S.closeDepartment({ slug: 'it', force: true });
  const r = S.purgeDepartment({ slug: 'it' });
  assert.equal(r.deleted.topics, 1);
  assert.equal(S.listTopics({ dept: 'it' }).length, 0);
  assert.equal(S.overview().departments.some((d) => d.slug === 'it'), false);
  assert.throws(() => S.purgeDepartment({ slug: 'it' }), /Không có phòng/);
  void t;
});

test('đề xuất cần giám đốc duyệt mới giao được, suất vẫn giới hạn việc tìm chủ đề', () => {
  const slug = 'scout';
  S.createDepartment({ slug, name: 'Tìm chủ đề', daily_target: 2, initial_teams: 1 });
  S.setAutoTopics({ dept: slug, on: true });
  const [{ id: team_id }] = dept(S.overview(), slug).teams;
  const approved = S.proposeTopic({ team_id, text: 'Mẹo tổng hợp báo cáo', reason: 'Mùa chốt sổ' });
  const rejected = S.proposeTopic({ team_id, text: 'Lưu trữ báo cáo cũ', reason: 'Dọn cuối năm' });
  assert.throws(() => S.assignTopic({ topic_id: approved.topic_id, team_id }), /đang chờ giám đốc duyệt/);
  S.decideTopic({ topic_id: rejected.topic_id, approve: false });
  assert.throws(() => S.assignTopic({ topic_id: rejected.topic_id, team_id }), /đã bị từ chối/);

  const { topic_id } = S.submitTopic({ dept: slug, text: 'Kế hoạch tổng kết' });
  assert.equal(S.assignTopic({ topic_id, team_id }).over_capacity, 0);
  assert.equal(S.assignTopic({ topic_id, team_id, episodes: 2 }).over_capacity, 1);
  S.decideTopic({ topic_id: approved.topic_id, approve: true });
  const assignment = S.assignTopic({ topic_id: approved.topic_id, team_id });
  assert.equal(assignment.videos.length, 1);
  assert.equal(assignment.over_capacity, 1);
  assert.ok(S.proposeTopic({ team_id, text: 'Lịch làm việc năm mới', reason: 'Chuẩn bị đầu năm' }).topic_id, 'đề xuất không còn bị chặn bởi suất trống (giám đốc 21/11/2026); trần là max_pending_topics');
});

test('nhật ký giữ ghi chú vượt suất khi nội dung giao chủ đề dài', () => {
  const slug = 'tonghop';
  S.createDepartment({ slug, name: 'Tổng hợp '.repeat(120), daily_target: 2, initial_teams: 1 });
  const { topic_id } = S.submitTopic({ dept: slug, text: 'Tổng hợp cuối năm' });
  const assignment = S.assignTopic({ topic_id, episodes: 3 });
  const [event] = S.recentEvents(1);
  assert.equal(event.kind, 'assign');
  assert.ok(event.message.endsWith(` — VƯỢT SUẤT 1 video (3/2 ngày ${assignment.planned_for}) theo yêu cầu của giám đốc`));
});

test('seedDemo dùng được trên DB sạch', async () => {
  process.env.STUDIO_DB = path.join(tmp, 'demo.sqlite');
  // db.mjs đọc đường dẫn lúc import; kiểm tra bằng tiến trình riêng
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync(process.execPath, ['--disable-warning=ExperimentalWarning', '-e', `import('${new URL('../src/db.mjs', import.meta.url).href}').then(S=>{S.seedDemo();const o=S.overview();console.log(JSON.stringify([o.totals.departments_active,o.totals.teams,o.totals.pending_proposals]))})`], { env: { ...process.env, STUDIO_DB: path.join(tmp, 'demo.sqlite'), STUDIO_CONTENT: path.join(tmp, 'demo-content') }, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim(), '[2,3,1]');
});
