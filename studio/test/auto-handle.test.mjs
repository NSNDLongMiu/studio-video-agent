// Giám đốc chốt 21/11/2026: "Cần giám đốc chú ý" chỉ còn việc của giám đốc; chủ đề chờ duyệt ở khung riêng;
// việc còn lại để Claude tự xử lý (tự gỡ vướng, tự đánh cờ QC chờ nghe, dọn thành viên treo).
// Kiểm thử mức hàm, KHÔNG chạy worker thật (tránh tranh chấp với vòng tick).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-auto-'));
Object.assign(process.env, { STUDIO_DB: path.join(tmp, 'db.sqlite'), STUDIO_CONTENT: path.join(tmp, 'content'), STUDIO_ACCOUNTS: path.join(tmp, 'accounts'), STUDIO_NO_AUTOSTART: '1' });
const S = await import('../src/db.mjs');
const P = await import('../src/pool.mjs');
const W = await import('../src/worker.mjs');
const { formatOverview } = await import('../src/format.mjs');

S.createDepartment({ name: 'Thể thao', slug: 'sport', daily_target: 2, initial_teams: 1 });
const topic = S.submitTopic({ dept: 'sport', text: 'Chạy bộ đúng cách' }).topic_id;
const a = S.assignTopic({ topic_id: topic, episodes: 4 });
const [v1, v2, v3, v4] = a.videos;
const rescueJobs = (v) => P.listJobs({ video_id: v, kind: 'rescue', limit: 50 });
const att = () => S.overview().attention;

test('helpOwner: QC-CHỜ-NGHE và QC-THIẾT-KẾ là của giám đốc, còn lại của Claude', () => {
  assert.equal(S.helpOwner('QC-CHỜ-NGHE: cần nghe'), 'director');
  assert.equal(S.helpOwner('QC-THIẾT-KẾ: hook thiếu tình huống'), 'director');
  assert.equal(S.helpOwner('ffmpeg lỗi font'), 'claude');
  assert.equal(S.helpOwner(''), 'claude');
});

test('rescueState: chỉ tự gỡ khi lý do không thuộc giám đốc, đang ở sản xuất và còn lượt', () => {
  const base = { id: v1, needs_help: 1, stage: 'production', help_reason: 'ffmpeg lỗi font' };
  assert.equal(S.rescueState(base).auto, true);
  assert.equal(S.rescueState({ ...base, needs_help: 0 }).auto, false);
  assert.equal(S.rescueState({ ...base, help_reason: 'QC-CHỜ-NGHE: x' }).why, 'director');
  assert.match(S.rescueState({ ...base, stage: 'review' }).why, /chỉ tự gỡ vướng ở sản xuất/);
});

test('qcWaitsForListening: nhận kết luận chờ nghe, không nhận QC bị chặn hay không có gì', () => {
  assert.equal(W.qcWaitsForListening('Không thấy lỗi dựng. Phần nghe Y6–Y8 phải chờ anh/chị nghe, nên video vẫn ở review.'), true);
  assert.equal(W.qcWaitsForListening('Giữ review; Audio CHƯA KIỂM — giám đốc nghe.'), true);
  assert.equal(W.qcWaitsForListening("I couldn't QC this video; the command was refused. CHƯA KIỂM"), false, 'QC bị chặn vẫn cần người');
  assert.equal(W.qcWaitsForListening('Lệnh đo bị chặn quyền nên chưa xem được; chờ giám đốc nghe'), false);
  assert.equal(W.qcWaitsForListening('OK /qc IT-T1-E01'), false);
  assert.equal(W.qcWaitsForListening(''), false);
});

test('tự gỡ vướng: chỉ video vướng ở SẢN XUẤT, lý do không thuộc giám đốc, không có việc nào đang chờ/chạy; có trần số lần', () => {
  for (const v of [v1, v2]) S.setVideoStage({ video_id: v, stage: 'production', by: 'test' });
  S.setVideoStage({ video_id: v3, stage: 'review', by: 'test' });
  S.setVideoStage({ video_id: v4, stage: 'review', by: 'test' });
  S.escalate({ video_id: v1, reason: 'ffmpeg lỗi font tiếng Việt', role: 'producer', by: 'test' });
  S.escalate({ video_id: v2, reason: 'QC-CHỜ-NGHE: chờ giám đốc nghe giọng', role: 'qc', by: 'test' });
  S.escalate({ video_id: v3, reason: 'QC chạy không xong', role: 'qc', by: 'test' });
  S.escalate({ video_id: v4, reason: 'QC-THIẾT-KẾ: hook thiếu tình huống', role: 'qc', by: 'test' });

  assert.equal(W.autoRescue(), 1, 'chỉ v1 được tự gỡ');
  assert.equal(rescueJobs(v1).length, 1);
  assert.equal(rescueJobs(v1)[0].created_by, 'worker');
  for (const v of [v2, v3, v4]) assert.equal(rescueJobs(v).length, 0, `${v} không được tự gỡ`);
  assert.equal(W.autoRescue(), 0, 'đã có việc gỡ vướng đang chờ thì không xếp thêm');

  // Gỡ xong mà vẫn vướng: xếp lượt kế, cho tới trần (mặc định 4)
  const max = Number(P.getSetting('max_rescues_per_video'));
  for (let n = 1; n < max; n++) {
    P.setJob(rescueJobs(v1)[0].id, { status: 'needs_human', finished_at: new Date().toISOString(), last_error: 'Claude chưa gỡ được' });
    assert.equal(W.autoRescue(), 1, `lượt gỡ thứ ${n + 1}`);
  }
  P.setJob(rescueJobs(v1)[0].id, { status: 'needs_human', finished_at: new Date().toISOString(), last_error: 'Claude chưa gỡ được' });
  assert.equal(rescueJobs(v1).length, max);
  assert.equal(W.autoRescue(), 0, 'hết lượt gỡ thì thôi, để giám đốc');
});

test('"Cần giám đốc chú ý": mỗi cờ đúng người; vượt lượt tự gỡ mới đẩy sang giám đốc', () => {
  const o = att();
  const of = (kind, v) => o.filter((x) => x.kind === kind && x.video_id === v);
  assert.equal(of('qc_listen', v2)[0]?.handler, 'director');
  assert.match(of('qc_listen', v2)[0].message, /chờ bạn nghe\/xem rồi duyệt "ready": chờ giám đốc nghe giọng/);
  assert.equal(of('qc_design', v4)[0]?.handler, 'director');
  const h3 = of('help', v3)[0];
  assert.equal(h3?.handler, 'director', 'vướng ở review mà Claude không tự gỡ → giám đốc');
  assert.match(h3.message, /Claude không tự gỡ được/);
  const h1 = of('help', v1)[0];
  assert.equal(h1?.handler, 'director', 'v1 đã dùng hết lượt tự gỡ');
  assert.match(h1.message, /đã gỡ vướng \d+\/\d+ lần/);
  assert.ok(!o.some((x) => x.kind === 'help' && x.handler === 'claude'), 'không còn video nào Claude đang tự gỡ');
});

test('video còn lượt tự gỡ → mục "help" của Claude (không đòi giám đốc), việc gỡ hỏng thì Claude tự thử lại', () => {
  S.resolveEscalation({ video_id: v1, note: 'test dọn', by: 'test' });
  P.cancelJob(rescueJobs(v1)[0].id);
  for (const j of rescueJobs(v1)) if (j.status === 'needs_human') P.cancelJob(j.id);
  // v1 đã đủ trần số lần → xoá lịch sử gỡ vướng cũ bằng video mới để thử nhánh còn lượt
  const t2 = S.submitTopic({ dept: 'sport', text: 'Kéo giãn sau chạy' }).topic_id;
  const [w1] = S.assignTopic({ topic_id: t2, episodes: 1 }).videos;
  S.setVideoStage({ video_id: w1, stage: 'production', by: 'test' });
  S.escalate({ video_id: w1, reason: 'Codex kẹt dựng cảnh 3', role: 'producer', by: 'test' });
  const o = att();
  const mine = o.filter((x) => x.handler === 'claude' && x.kind === 'help');
  assert.equal(mine.length, 1);
  assert.match(mine[0].message, /Claude tự gỡ/);
  assert.ok(!o.some((x) => x.kind === 'help' && x.handler === 'director' && x.video_id === w1));
  // một việc gỡ vướng vừa hỏng (needs_human) khi video còn lượt → hiện ở khung Claude tự xử lý
  const { job_id } = P.enqueueJob({ kind: 'rescue', video_id: w1, by: 'worker' });
  P.setJob(job_id, { status: 'needs_human', finished_at: new Date().toISOString(), last_error: 'Claude chưa gỡ được vướng' });
  const jh = P.poolOverview().attention.find((x) => x.kind === 'job_human' && x.job_id === job_id);
  assert.equal(jh?.handler, 'claude');
  assert.match(jh.message, /Claude tự thử lại/);
  S.resolveEscalation({ video_id: w1, note: 'test dọn', by: 'test' });
  P.cancelJob(job_id);
});

test('chủ đề chờ duyệt: có handler giám đốc để dashboard đưa sang khung riêng, và định dạng chữ có mục riêng', () => {
  const it = S.createDepartment({ name: 'IT', slug: 'it', daily_target: 2, initial_teams: 1 });
  const itTeam = S.overview({ dept: 'it' }).departments[0].teams[0].id;
  S.setAutoTopics({ dept: 'it', on: true, by: 'test' });
  assert.ok(it);
  S.proposeTopic({ team_id: itTeam, text: '3 lỗi Excel làm sai báo cáo', reason: 'Mùa chốt sổ; nguồn: https://example.com', by: 'test' });
  const o = S.overview();
  const tp = o.attention.find((x) => x.kind === 'topic_proposal');
  assert.equal(tp?.handler, 'director');
  const text = formatOverview(o, P.poolOverview());
  const iTopics = text.indexOf('CHỦ ĐỀ CHỜ GIÁM ĐỐC DUYỆT');
  const iMine = text.indexOf('CẦN GIÁM ĐỐC CHÚ Ý');
  assert.ok(iTopics > 0 && iMine > 0 && iMine < iTopics, 'hai khung tách nhau');
  const mineBlock = text.slice(iMine, iTopics);
  assert.ok(!mineBlock.includes('đề xuất chủ đề'), 'chủ đề không nằm trong "Cần giám đốc chú ý"');
  assert.ok(text.slice(iTopics).includes('3 lỗi Excel làm sai báo cáo'));
});

test('dọn thành viên treo: chỉ khi phòng không còn việc nền; còn việc nền thì giữ nguyên và không báo "im lặng"', () => {
  const team = a.team_id;
  S.reportStatus({ team_id: team, role: 'producer', status: 'working', task: 'Dựng tập 1', video_id: v1, by: 'test' });
  const old = new Date(Date.now() - 90 * 60_000).toISOString();
  S.sql.run("UPDATE members SET updated_at=? WHERE team_id=? AND role='producer'", old, team);
  const member = () => S.overview().departments.find((d) => d.slug === 'sport').teams.flatMap((t) => t.members).find((m) => m.role === 'producer');

  const { job_id } = P.enqueueJob({ kind: 'dept_review', dept: 'sport', by: 'test' });
  assert.equal(S.sweepStaleMembers(), 0, 'phòng còn việc nền thì không dọn');
  assert.equal(member().status, 'working');
  assert.ok(!att().some((x) => x.kind === 'stale'), 'việc dài im lặng không phải treo');

  P.cancelJob(job_id);
  assert.ok(att().some((x) => x.kind === 'stale' && x.handler === 'claude'), 'hết việc nền mà vẫn "đang làm" → treo, Claude tự xử lý');
  assert.equal(S.sweepStaleMembers(), 1);
  assert.equal(member().status, 'idle');
  assert.ok(!att().some((x) => x.kind === 'stale'));
  assert.ok(S.recentEvents(10).some((e) => /tự đặt về rảnh/.test(e.message)));
  assert.equal(S.sweepStaleMembers(), 0);
});
