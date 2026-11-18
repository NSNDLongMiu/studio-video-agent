// Bộ core (giám đốc duyệt 18/11/2026) + tự tìm chủ đề (bật/tắt, đội đề xuất, giám đốc duyệt).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-core-'));
Object.assign(process.env, { STUDIO_DB: path.join(tmp, 'db.sqlite'), STUDIO_CONTENT: path.join(tmp, 'content'), STUDIO_ACCOUNTS: path.join(tmp, 'accounts'), STUDIO_NO_AUTOSTART: '1' });
const S = await import('../src/db.mjs');
const P = await import('../src/pool.mjs');
const R = await import('../src/office-roles.mjs');

const CORE = ['idea', 'script', 'visual', 'producer', 'qc', 'rescue', 'scout'];

test('mỗi đội có đúng bộ core; vai cũ tự quy về vị trí core và ghi rõ ai làm', () => {
  const { teams } = S.createDepartment({ slug: 'it', name: 'IT', description: 'Mẹo tin học văn phòng, AI cho dân văn phòng', daily_target: 2, initial_teams: 1, by: 'test' });
  const team = teams[0];
  const o = S.overview();
  const members = o.departments[0].teams[0].members;
  assert.deepEqual(members.map((m) => m.role), CORE);
  assert.ok(members.every((m) => m.duty), 'vị trí nào cũng có công việc cụ thể');
  assert.equal(o.departments[0].members_total, 6, 'Tìm chủ đề không tính vào 6 vị trí thường trực');

  S.reportStatus({ team_id: team.id ?? team, role: 'ideator_c', status: 'working', task: 'phản biện vòng 2', by: 'test' });
  const idea = S.overview().departments[0].teams[0].members.find((m) => m.role === 'idea');
  assert.equal(idea.status, 'working');
  assert.equal(idea.task, 'Codex: phản biện vòng 2');
  S.reportStatus({ team_id: team.id ?? team, role: 'visual_director', status: 'working', task: 'review bản 1', by: 'test' });
  assert.equal(S.overview().departments[0].teams[0].members.find((m) => m.role === 'visual').task, 'Claude duyệt: review bản 1');
  assert.throws(() => S.reportStatus({ team_id: team.id ?? team, role: 'ke-toan', status: 'idle', by: 'test' }), /không có vai/);
});

test('tự tìm chủ đề TẮT (mặc định): đội không được đề xuất, worker không xếp việc tìm', () => {
  const teamId = S.overview().departments[0].teams[0].id;
  assert.equal(S.overview().departments[0].auto_topics, false);
  assert.throws(() => S.proposeTopic({ team_id: teamId, text: 'Chủ đề A', reason: 'vì…', by: 'test' }), /TẮT tự tìm chủ đề/);
  assert.deepEqual(P.autoScout(), []);
  assert.throws(() => P.enqueueJob({ kind: 'scout', team_id: teamId }), /TẮT tự tìm chủ đề/);
});

test('BẬT: đội đề xuất (kèm lý do), chờ giám đốc duyệt; duyệt mới thành chủ đề để làm', () => {
  const teamId = S.overview().departments[0].teams[0].id;
  S.setAutoTopics({ dept: 'it', on: true, by: 'test' });
  const jobs = P.autoScout();
  assert.equal(jobs.length, 1, 'mỗi đội 1 việc tìm chủ đề');
  assert.deepEqual(P.autoScout(), [], 'không xếp trùng trong ngày');

  assert.throws(() => S.proposeTopic({ team_id: teamId, text: 'Thiếu lý do', reason: ' ', by: 'test' }), /Thiếu lý do/);
  const a = S.proposeTopic({ team_id: teamId, text: '3 lỗi Excel làm sai báo cáo cuối tháng', reason: 'Mùa chốt sổ; nguồn: https://example.com', by: 'test' });
  assert.equal(a.status, 'proposed');
  assert.throws(() => S.proposeTopic({ team_id: teamId, text: '3 lỗi excel làm sai báo cáo cuối tháng', reason: 'x', by: 'test' }), /trùng/);
  S.proposeTopic({ team_id: teamId, text: 'Dùng AI tóm tắt biên bản họp', reason: 'Câu hỏi phổ biến; nguồn: https://example.com', by: 'test' });
  assert.throws(() => S.proposeTopic({ team_id: teamId, text: 'Chủ đề thứ ba', reason: 'x', by: 'test' }), /đủ chủ đề/, 'không vượt số suất trống (đội 2 suất)');

  const o = S.overview();
  const att = o.attention.filter((x) => x.kind === 'topic_proposal');
  assert.equal(att.length, 2, 'hiện ở "Cần giám đốc chú ý"');
  assert.equal(o.totals.topics_open, 0, 'đề xuất chưa duyệt không tính là chủ đề để làm');

  assert.equal(S.decideTopic({ topic_id: a.topic_id, approve: true, by: 'test' }).status, 'open');
  assert.throws(() => S.decideTopic({ topic_id: a.topic_id, approve: false, by: 'test' }), /không ở trạng thái chờ duyệt/);
  const job = P.enqueueJob({ kind: 'plan', topic_id: a.topic_id, by: 'test' });
  assert.equal(job.status, 'queued');
  S.decideTopic({ topic_id: att[1].topic_id, approve: false, note: 'không hợp kênh', by: 'test' });
  assert.equal(S.listTopics({ dept: 'it', status: 'rejected' }).length, 1);

  S.setAutoTopics({ dept: 'it', on: false, by: 'test' });
  assert.throws(() => S.proposeTopic({ team_id: teamId, text: 'Sau khi tắt', reason: 'x', by: 'test' }), /TẮT/);
});

test('Văn phòng 2D: chỉ hiện vị trí core, tên = vị trí · ai làm; điều phối và agent phụ bị ẩn', () => {
  const c = (s, info) => R.applyRole(s, R.classify(s, info));
  const sub = { agent: 'claude', id: 'agent-1', subagent: true, project: 'Agent-Video-Studio', title: 'x' };
  assert.equal(c(sub, { agentType: 'planner' }).project, 'Kịch bản · Claude duyệt');
  assert.equal(c(sub, { agentType: 'planner' }).subagent, false, 'agent con thuộc core được hiện');
  assert.equal(c(sub, { agentType: 'ideator-b' }).project, 'Ý tưởng · Claude chốt');
  assert.equal(c(sub, { agentType: 'Explore' }).subagent, true, 'agent phụ bị ẩn');
  const top = { agent: 'claude', id: 's1', subagent: false, project: 'Agent-Video-Studio' };
  assert.equal(c(top, { firstPrompt: '/make-plan 3 1 2' }).subagent, true, 'phiên điều phối không phải vị trí core → ẩn');
  assert.equal(c(top, { firstPrompt: '/qc IT-T3-E01' }).project, 'QC · Claude');
  assert.equal(c(top, { firstPrompt: '/scout-topics 4' }).project, 'Tìm chủ đề · Claude');
  assert.equal(c(top, { firstPrompt: 'giám đốc tự hỏi gì đó' }).project, 'Agent-Video-Studio', 'phiên ngoài xưởng giữ nguyên');
  const cx = { agent: 'codex', id: 'c1', subagent: false, cwd: 'D:/x/content/it/T3' };
  assert.equal(c(cx, { marker: 'script' }).project, 'Kịch bản · Codex viết');
  assert.equal(c(cx, { marker: 'storyboard' }).project, 'Đạo diễn hình ảnh · Codex làm');
  assert.equal(c(cx, { marker: 'producer' }).project, 'Sản xuất · Codex');
  assert.equal(c({ ...cx, cwd: 'C:/Temp/codex-ideate-ab12' }, { marker: '' }).project, 'Ý tưởng · Codex');
  assert.equal(c({ ...cx, cwd: 'C:/Temp/studio-probe-1' }, {}).subagent, true);
  const snap = R.transformSnapshot({ now: 1, sessions: [sub, top] }, () => ({ agentType: 'visual-director', firstPrompt: '/rescue IT-T1-E01' }));
  assert.deepEqual(snap.sessions.map((x) => x.project), ['Đạo diễn hình ảnh · Claude duyệt', 'Gỡ vướng · Claude']);
});

test('Văn phòng 2D vòng đời: mỗi vị trí 1 nhân vật; xong thì dọn khỏi sàn và vào ngăn "Đã gọi"', () => {
  const NOW = 2_000_000_000_000;
  const MIN = 60_000;
  const info = {};
  const lookup = (s) => info[s.id] || {};
  const cx = (id, over = {}, marker = 'script') => {
    info[id] = { marker };
    return { key: `codex:${id}`, agent: 'codex', id, subagent: false, parentId: null, cwd: 'D:/x/content/it/T3', project: 'x', model: 'gpt', status: 'done', startedAt: NOW - 30 * MIN, lastEventAt: NOW - 10 * MIN, prompt: `[[STUDIO-ROLE:${marker}]] viết kịch bản`, reply: 'xong', ...over };
  };
  const keys = (v) => v.sessions.map((s) => s.id).sort();
  const hist = (v) => v.history.map((h) => h.key).sort();

  // 1) xong đã lâu -> dọn hết; vừa xong (trong GRACE) -> còn hiện để thấy "xong"
  let v = R.buildView({ sessions: [cx('old1'), cx('old2'), cx('fresh', { lastEventAt: NOW - 10_000 }, 'storyboard')] }, lookup, NOW, 45_000);
  assert.deepEqual(keys(v), ['fresh']);
  assert.deepEqual(hist(v), ['codex:old1', 'codex:old2']);
  assert.equal(v.history[0].label, 'Kịch bản · Codex viết');
  assert.ok(!v.history[0].task.includes('STUDIO-ROLE'), 'bỏ dòng đánh dấu khỏi nội dung xem lại');

  // 2) một vị trí chỉ 1 nhân vật: đã có phiên đang làm thì phiên cũ đã xong (dù mới xong) vào ngăn ngay
  v = R.buildView({ sessions: [cx('run', { status: 'typing', lastEventAt: NOW - 1000 }), cx('justdone', { lastEventAt: NOW - 5000 })] }, lookup, NOW, 45_000);
  assert.deepEqual(keys(v), ['run']);
  assert.deepEqual(hist(v), ['codex:justdone']);
  //    hai phiên cùng vị trí vừa xong -> chỉ giữ phiên mới nhất
  v = R.buildView({ sessions: [cx('a', { lastEventAt: NOW - 20_000 }), cx('b', { lastEventAt: NOW - 5_000 })] }, lookup, NOW, 45_000);
  assert.deepEqual(keys(v), ['b']);
  assert.deepEqual(hist(v), ['codex:a']);

  // 3) phiên con của Codex (tự duyệt lệnh) và agent phụ của Claude: ẩn, xong thì vào ngăn với tên dễ hiểu
  const child = cx('rev', { parentId: 'run', model: 'codex-auto-review' }, 'producer');
  info.ex = { agentType: 'Explore' };
  const explore = (status, ago) => ({ key: 'claude:ex', agent: 'claude', id: 'ex', subagent: true, parentId: 'm', cwd: 'D:/x', project: 'x', model: 'm', status, startedAt: NOW - 30 * MIN, lastEventAt: NOW - ago, prompt: 'tìm file', reply: 'thấy rồi' });
  v = R.buildView({ sessions: [child, explore('done', 5 * MIN)] }, lookup, NOW, 45_000);
  assert.deepEqual(keys(v), []);
  assert.deepEqual(v.history.map((h) => h.label).sort(), ['Agent phụ · Explore', 'Codex tự duyệt lệnh']);
  v = R.buildView({ sessions: [explore('tool', 1000)] }, lookup, NOW, 45_000);
  assert.equal(v.sessions[0].subagent, true, 'đang làm thì còn trên sàn nhưng ở nhóm agent con');
  assert.equal(v.history.length, 0);

  // 4) phiên chính của giám đốc (ngoài xưởng) không bị đụng tới, không vào ngăn
  const own = { key: 'claude:own', agent: 'claude', id: 'own', subagent: false, parentId: null, cwd: 'D:/x', project: 'Agent Video Studio', status: 'done', lastEventAt: NOW - 600 * MIN };
  info.own = { firstPrompt: 'giám đốc hỏi gì đó' };
  v = R.buildView({ sessions: [own] }, lookup, NOW, 45_000);
  assert.deepEqual(keys(v), ['own']);
  assert.equal(v.history.length, 0);

  // 5) transformSnapshot báo số agent đã dọn; historyOf trả danh sách xem lại
  const snap = { now: NOW, sessions: [cx('o1'), cx('r1', { status: 'tool', lastEventAt: NOW - 500 })] };
  const t = R.transformSnapshot(snap, lookup, NOW, 45_000);
  assert.equal(t.studioHidden, 1);
  assert.equal(R.historyOf(snap, lookup, NOW, 45_000).length, 1);
});

test('Văn phòng 2D chỗ ngồi cố định: đủ 6 vị trí core, rảnh thì ngồi chờ, có việc thì nhân vật thật thay vào', () => {
  const NOW = 2_000_000_000_000;
  const MIN = 60_000;
  const seats = R.seatsFor();
  assert.deepEqual(seats.map((s) => s.pos), ['Ý tưởng', 'Kịch bản', 'Đạo diễn hình ảnh', 'Sản xuất', 'QC', 'Gỡ vướng']);
  assert.equal(R.seatsFor({ scout: true }).at(-1).pos, 'Tìm chủ đề', 'phòng bật tự tìm chủ đề thì có thêm chỗ Tìm chủ đề');
  const wire = (xs) => xs.map(({ pos, agent, blind }) => ({ pos, agent, blind }));
  const onlyCodex = R.seatsFor({ scout: true, tracked: { claude: false, codex: true } });
  assert.deepEqual(R.decodeSeats(R.encodeSeats(onlyCodex)), wire(onlyCodex), 'truyền qua dòng lệnh không mất dữ liệu');
  assert.deepEqual(onlyCodex.filter((s) => s.blind).map((s) => s.pos), ['QC', 'Gỡ vướng', 'Tìm chủ đề'], 'chỉ đọc Codex: vị trí của Claude không theo dõi được (Ý tưởng vẫn thấy giọng Codex)');
  assert.deepEqual(R.decodeSeats('a:b,,Sản xuất:codex'), [{ pos: 'Sản xuất', agent: 'codex', blind: false }], 'bỏ phần sai định dạng');

  // 0) vị trí không theo dõi được: ghi "chưa theo dõi", không giả vờ "rảnh"
  let v = R.buildView({ sessions: [] }, () => ({}), NOW, 45_000, R.decodeSeats('QC:claude:x,Sản xuất:codex'));
  assert.deepEqual(v.sessions.map((s) => s.project), ['QC · chưa theo dõi', 'Sản xuất · rảnh']);
  assert.match(v.sessions[0].reply, /chưa được cấp tài khoản Claude/);

  // 1) sàn trống: đủ 6 nhân vật rảnh (idle, không phải agent con, không tính vào "đã dọn")
  v = R.buildView({ sessions: [] }, () => ({}), NOW, 45_000, seats);
  assert.equal(v.sessions.length, 6);
  assert.ok(v.sessions.every((s) => s.status === 'idle' && !s.subagent && s.key.startsWith('studio-seat:')));
  assert.deepEqual(v.sessions.map((s) => s.project), ['Ý tưởng · rảnh', 'Kịch bản · rảnh', 'Đạo diễn hình ảnh · rảnh', 'Sản xuất · rảnh', 'QC · rảnh', 'Gỡ vướng · rảnh']);
  assert.equal(v.history.length, 0);
  assert.equal(R.buildView({ sessions: [] }, () => ({}), NOW, 45_000).sessions.length, 0, 'không truyền chỗ ngồi = như trước (chỉ phiên có thật)');

  // 2) vị trí có phiên thật (đang làm, hoặc vừa xong) thì không thêm nhân vật rảnh cho vị trí đó; vị trí khác vẫn rảnh
  const info = { w: { marker: 'producer' }, f: { marker: 'script' }, q: { firstPrompt: '/qc IT-T1-E01' } };
  const mk = (id, agent, over = {}) => ({ key: `${agent}:${id}`, agent, id, subagent: false, parentId: null, cwd: 'D:/x', project: 'x', model: 'm', status: 'typing', startedAt: NOW - 5 * MIN, lastEventAt: NOW - 1000, prompt: 'p', reply: '', ...over });
  v = R.buildView({ sessions: [mk('w', 'codex'), mk('f', 'codex', { status: 'done', lastEventAt: NOW - 10_000 }), mk('q', 'claude')] }, (s) => info[s.id] || {}, NOW, 45_000, seats);
  assert.deepEqual(v.sessions.filter((s) => s.status === 'idle').map((s) => s.project), ['Ý tưởng · rảnh', 'Đạo diễn hình ảnh · rảnh', 'Gỡ vướng · rảnh']);
  assert.equal(v.sessions.length, 6, 'Sản xuất, Kịch bản (vừa xong), QC là phiên thật; 3 vị trí còn lại rảnh');

  // 3) xong đã quá GRACE -> phiên vào ngăn "Đã gọi", vị trí đó quay lại nhân vật rảnh (không trống)
  v = R.buildView({ sessions: [mk('f', 'codex', { status: 'done', lastEventAt: NOW - 10 * MIN })] }, (s) => info[s.id] || {}, NOW, 45_000, seats);
  assert.equal(v.history.length, 1);
  assert.ok(v.sessions.some((s) => s.project === 'Kịch bản · rảnh'));

  // 4) phiên ngoài xưởng (giám đốc tự dùng / việc giao Codex sửa hệ thống) không che vị trí nào và bị ẩn như agent con
  //    (không vào ngăn "Đã gọi"); không có chỗ ngồi thì giữ nguyên như trước. Nhân vật rảnh xếp lên trước khi công cụ gốc giới hạn số người đi lại.
  const own = { key: 'claude:own', agent: 'claude', id: 'own', subagent: false, parentId: null, cwd: 'D:/x', project: 'Agent Video Studio', status: 'done', lastEventAt: NOW - 60 * MIN };
  const working = { ...own, key: 'codex:job', agent: 'codex', id: 'job', status: 'thinking', lastEventAt: NOW - 1000 };
  v = R.buildView({ sessions: [own, working] }, () => ({ firstPrompt: 'hỏi gì đó' }), NOW, 45_000, seats);
  assert.equal(v.sessions.length, 8, 'phiên ngoài xưởng vẫn nằm trong dữ liệu (để công tắc "agent con" xem được)');
  assert.deepEqual(v.sessions.filter((s) => !s.key.startsWith('studio-seat:')).map((s) => s.subagent), [true, true], 'nhưng đánh dấu agent con => bị ẩn mặc định, kể cả khi đang làm');
  assert.equal(v.sessions.filter((s) => !s.subagent).length, 6, 'sàn chỉ còn đúng 6 nhân vật của đội');
  assert.equal(v.history.length, 0);
  assert.ok(v.sessions.filter((s) => s.status === 'idle').every((s) => s.lastEventAt >= NOW));
  v = R.buildView({ sessions: [own] }, () => ({ firstPrompt: 'hỏi gì đó' }), NOW, 45_000);
  assert.equal(v.sessions[0].subagent, false, 'bản không có chỗ ngồi: giữ nguyên phiên ngoài xưởng');

  // 5) transformSnapshot truyền chỗ ngồi; dữ liệu ổn định trong 1 phút (không đẩy lại từng giây)
  const t1 = R.transformSnapshot({ now: NOW, sessions: [] }, () => ({}), NOW, 45_000, seats);
  const t2 = R.transformSnapshot({ now: NOW, sessions: [] }, () => ({}), NOW + 20_000, 45_000, seats);
  assert.equal(t1.sessions.length, 6);
  assert.equal(JSON.stringify(t1.sessions), JSON.stringify(t2.sessions));
});
