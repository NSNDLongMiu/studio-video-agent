import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const src = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const definitions = src.slice(0, src.lastIndexOf('\nrefresh(true);'));
const renderers = () => vm.runInNewContext(`${definitions}
  ({ teamHtml, roleMemberHtml, roleMsgHtml, roleChipsHtml, roleBannerNote, roleChatHtml, roleEventsHtml, roleJobsHtml, jobsSlice, jobsHtml, jobsView, JOB_SIZES })`);

const payload = '<img src=x onerror=alert(1)>';
const escaped = '&lt;img src=x onerror=alert(1)&gt;';
const when = '2026-11-18T01:02:03Z';

test('script dashboard biên dịch được mà không cần chạy', () => {
  assert.doesNotThrow(() => new vm.Script(src));
});

test('dòng vị trí mở dialog bên ngoài danh sách đội và có liên kết sâu', () => {
  const { teamHtml } = renderers();
  assert.match(html, /id="depts"><\/section>[\s\S]*<dialog id="dRole"/);
  assert.match(src, /\/api\/members\//);
  assert.match(src, /function openRole\(/);
  assert.match(src, /#role=/);

  const team = { members:[{ id:42, label:'Sản xuất', role:'producer', status:'working', duty:payload }], videos:[] };
  const row = teamHtml(team, {});
  assert.match(row, /class="m click" role="button" tabindex="0"/);
  assert.match(row, /data-role-id="42" onclick="openRole\(/);
  assert.match(row, /onkeydown="[^"]*'Enter'[^"]*' '/);
  assert.ok(row.includes(`title="${escaped}"`));
});

test('mỗi dòng vị trí có chip xem chat và mỗi đội có lời gợi ý', () => {
  const { teamHtml } = renderers();
  const members = [
    { id:42, label:'Sản xuất', role:'producer', status:'working' },
    { id:43, label:'Kiểm tra', role:'qc', status:'idle' },
  ];
  const output = teamHtml({ members, videos:[] }, {});
  assert.match(output, /<\/h4>\s*<div class="team-hint">💬 Bấm vào từng vị trí để xem agent đang chat và làm gì<\/div>/);
  assert.equal([...output.matchAll(/<span class="role-open" aria-hidden="true">💬 xem chat<\/span>/g)].length, members.length);
  for (const { id } of members) {
    assert.ok(output.includes(`data-role-id="${id}" onclick="openRole(this.dataset.roleId)"`));
  }
});

test('ghi chú chung chỉ hiện khi chưa chọn cuộc chat hoặc đang xem log cũ', () => {
  const { roleBannerNote, roleChatHtml } = renderers();
  const note = 'Log cũ của Claude chỉ có kết quả cuối';
  const activity = { note };
  const legacy = { legacy:true, note };
  assert.equal(roleBannerNote(activity, null), note);
  assert.equal(roleBannerNote(activity, legacy), note);
  assert.equal(roleBannerNote(activity, { legacy:false }), '');
  assert.equal(roleBannerNote(activity, {}), '');
  assert.equal(roleBannerNote({ note:null }, legacy), '');
  assert.equal(roleBannerNote(null, null), '');
  assert.ok(!roleChatHtml(legacy, new Set(), roleBannerNote(activity, legacy)).includes(note));
});

test('nội dung API được thoát HTML trong tiêu đề, tin nhắn và thông tin vị trí', () => {
  const { roleMemberHtml, roleMsgHtml, roleChipsHtml, roleChatHtml, roleEventsHtml, roleJobsHtml } = renderers();
  const openKeys = new Set(['msg:log:0', 'job:42', 'duty']);
  const prompt = { who:'prompt', text:payload, detail:payload };
  const transcript = { id:'log', title:payload, updated_at:when, note:payload, truncated:true, messages:[prompt] };
  const results = [
    roleMemberHtml({ team_name:payload, dept_name:payload, duty:payload, task:payload, video_id:payload, role:'producer', status:'working', engine:'codex' }, openKeys),
    roleMsgHtml({ who:'agent', agent:payload, text:payload }, 'msg:agent:0', openKeys, 'codex-job'),
    roleChipsHtml([transcript, { ...transcript, id:'old', legacy:true }]),
    roleChatHtml(transcript, openKeys),
    roleEventsHtml([{ ts:when, kind:'escalate', message:payload }]),
    roleJobsHtml([{ id:42, title:payload, last_error:payload, summary:payload }], openKeys),
  ];
  for (const output of results) {
    assert.ok(output.includes(escaped));
    assert.ok(!output.includes(payload));
  }
  assert.match(results[3], /data-role-key="msg:log:0" open/);
  assert.ok(results[3].includes(`role-detail">${escaped}</pre>`));
  assert.match(results[5], /data-role-key="job:42" open/);
});

test('lỗi công cụ và escalate được đánh dấu, hoạt động mới nhất đứng đầu', () => {
  const { roleMsgHtml, roleEventsHtml } = renderers();
  const tool = roleMsgHtml({ who:'tool', text:'Lệnh lỗi', detail:payload, ok:false }, 'msg:log:1', new Set(), 'codex-job');
  assert.match(tool, /<details class="role-log role-msg-bad" data-role-key="msg:log:1"><summary>✖ Lệnh lỗi<\/summary>/);
  assert.ok(tool.includes(escaped));
  assert.ok(!tool.includes(payload));

  const events = [{ ts:when, message:'Tin cũ' }, { ts:when, kind:'escalate', message:'Tin mới' }];
  const output = roleEventsHtml(events);
  assert.match(output, /role-event role-msg-bad/);
  assert.match(output, /\d{2}:\d{2}:\d{2} \d{2}\/\d{2}/);
  assert.ok(output.indexOf('Tin mới') < output.indexOf('Tin cũ'));
  assert.equal(events[0].message, 'Tin cũ');
});

test('chat, hoạt động và việc nền có trạng thái rỗng', () => {
  const { roleChipsHtml, roleChatHtml, roleEventsHtml, roleJobsHtml } = renderers();
  assert.equal(roleChipsHtml([]), '');
  assert.match(roleChatHtml(null, new Set()), /Chưa có cuộc chat/);
  assert.match(roleChatHtml({ messages:[] }, new Set()), /chưa có tin nhắn/);
  assert.match(roleEventsHtml([]), /Chưa có hoạt động/);
  assert.match(roleJobsHtml([], new Set()), /Chưa có việc nền/);
});

const makeJobs = (n, status = 'succeeded') => Array.from({ length: n }, (_, i) => ({ id: n - i, kind: 'qc', status, title: `Việc ${n - i}`, last_error: '', attempts: 0 }));

test('hàng đợi việc nền: mặc định 10 việc/trang, khung cao cố định có phân trang', () => {
  const { jobsSlice, jobsHtml, jobsView, JOB_SIZES } = renderers();
  assert.equal(jobsView.size, 10);
  assert.deepEqual(Array.from(JOB_SIZES), [10, 20, 50]);
  assert.match(html, /\.joblist\{height:\d+px;overflow:auto/);

  const jobs = makeJobs(25);
  const first = jobsSlice(jobs, { page: 1, size: 10 });
  assert.equal(first.items.length, 10);
  assert.deepEqual([first.page, first.pages, first.total, first.first, first.last], [1, 3, 25, 1, 10]);
  const last = jobsSlice(jobs, { page: 3, size: 10 });
  assert.equal(last.items.length, 5);
  assert.deepEqual([last.first, last.last], [21, 25]);
  assert.equal(last.items[0].id, 5);

  const out = jobsHtml(jobs, { page: 1, size: 10 });
  assert.equal([...out.matchAll(/class="row"/g)].length, 10);
  assert.match(out, /1–10 \/ 25 việc/);
  assert.match(out, /Trang 1\/3/);
  assert.match(out, /onclick="jobsGo\(-1\)" disabled/);
  assert.doesNotMatch(out, /onclick="jobsGo\(1\)" disabled/);
  assert.match(out, /aria-pressed="true" onclick="jobsSize\(10\)"/);
});

test('hàng đợi việc nền: trang quá giới hạn được kẹp lại, đổi cỡ trang, rỗng và thoát HTML', () => {
  const { jobsSlice, jobsHtml } = renderers();
  const jobs = makeJobs(25);
  assert.equal(jobsSlice(jobs, { page: 99, size: 10 }).page, 3);
  assert.equal(jobsSlice(jobs, { page: -4, size: 10 }).page, 1);
  assert.equal(jobsSlice(jobs, { page: 2, size: 50 }).page, 1);

  const view = { page: 7, size: 20 };
  const out = jobsHtml(jobs, view);
  assert.equal(view.page, 2);
  assert.equal([...out.matchAll(/class="row"/g)].length, 5);
  assert.match(out, /onclick="jobsGo\(1\)" disabled/);

  const empty = jobsHtml([], { page: 1, size: 10 });
  assert.match(empty, /Trống\./);
  assert.match(empty, /0–0 \/ 0 việc/);
  assert.match(empty, /Trang 1\/1/);

  const bad = jobsHtml([{ id: 1, kind: 'qc', status: 'failed', title: payload, last_error: payload }], { page: 1, size: 10 });
  assert.ok(bad.includes(escaped));
  assert.ok(!bad.includes(payload));
});

test('hàng đợi việc nền: việc đang hoạt động được đếm và có nút huỷ / chạy lại đúng trạng thái', () => {
  const { jobsHtml } = renderers();
  const jobs = [...makeJobs(1, 'running'), ...makeJobs(1, 'failed').map((j) => ({ ...j, id: 90 })), ...makeJobs(1, 'succeeded').map((j) => ({ ...j, id: 91 }))];
  jobs[0].id = 89;
  const out = jobsHtml(jobs, { page: 1, size: 10 });
  assert.match(out, /1 đang hoạt động/);
  assert.match(out, /jobs?\(89,'cancel'\)/);
  assert.match(out, /job\(90,'retry'\)/);
  assert.doesNotMatch(out, /job\(91,/);
});

test('làm mới không gửi chồng, giữ nội dung khi mất mạng và dừng khi gặp 404', async () => {
  const view = { id:'42', request:null, timer:7, key:'' };
  const elements = { dRole:{open:true}, roleWarning:{textContent:'', hidden:true}, roleBody:{textContent:'Nội dung cũ'} };
  const draws = [], cleared = [], calls = [];
  const response = (generated_at, text = 'Đang dựng') => ({ok:true, json:async () => ({ generated_at, text })});
  const { promise, resolve } = Promise.withResolvers();
  const replies = [() => promise, () => response(2), () => { throw new Error('mất mạng'); },
    () => response(3), () => ({status:404, ok:false})];
  const poll = vm.runInNewContext(`${definitions}
    roleView = view;
    renderRole = draw;
    () => refreshRole(view)`, {
    view, AbortController, document:{getElementById:(id) => elements[id]},
    clearInterval:(id) => cleared.push(id), draw:() => draws.push(view.activity.text),
    fetch:async (path) => { calls.push(path); return replies.shift()(); },
  });

  const first = poll();
  await poll();
  assert.deepEqual(calls, ['/api/members/42/activity']);
  resolve(response(1));
  await first;
  await poll();
  assert.deepEqual(draws, ['Đang dựng']);
  await poll();
  assert.match(elements.roleWarning.textContent, /Mất kết nối/);
  assert.equal(elements.roleBody.textContent, 'Nội dung cũ');
  await poll();
  assert.equal(elements.roleWarning.hidden, true);
  await poll();
  assert.match(elements.roleWarning.textContent, /Vị trí này không còn nữa/);
  assert.deepEqual(cleared, [7]);
  await poll();
  assert.equal(calls.length, 5);
});

test('"Cần giám đốc chú ý" tách ba khung: chủ đề chờ duyệt riêng, việc Claude tự xử lý gấp gọn, còn lại là của giám đốc (21/11/2026)', () => {
  const { attnSplit } = vm.runInNewContext(`${definitions}
({ attnSplit })`);
  const att = [
    { kind: 'topic_proposal', handler: 'director', topic_id: 7, message: 'Đội 3 đề xuất chủ đề #7' },
    { kind: 'qc_listen', handler: 'director', video_id: 'IT-T16-E01', message: 'IT-T16-E01 chờ bạn nghe' },
    { kind: 'qc_design', handler: 'director', video_id: 'IT-T17-E01', message: 'IT-T17-E01 lỗi thiết kế' },
    { kind: 'limit_wait', handler: 'claude', provider: 'claude', until: when, message: '1 việc claude chờ hồi limit' },
    { kind: 'help', handler: 'claude', dept: 'it', message: '1 video đang vướng — Claude tự gỡ' },
    { kind: 'takeover_offer', handler: 'director', job_id: 5, by: 'claude', for: 'codex', message: 'Việc #5 kẹt ở Codex' },
    { kind: 'capacity', message: 'thiếu năng lực (không có handler = của giám đốc)' },
  ];
  const sp = attnSplit(att);
  assert.equal(sp.topics.length, 1);
  assert.match(sp.topics[0], /decideTopic\(7,'approve'\)/);
  assert.match(sp.topics[0], /decideTopic\(7,'reject'\)/);
  assert.equal(sp.auto.length, 2);
  assert.ok(sp.auto.every((h) => !/decideTopic|acceptVideo/.test(h)), 'khung tự xử lý không có nút quyết định');
  assert.equal(sp.mine.length, 4);
  assert.ok(!sp.mine.join('').includes('đề xuất chủ đề'), 'chủ đề không lẫn vào khung chú ý');
  assert.match(sp.mine[0], /acceptVideo\('IT-T16-E01'\)/, 'QC chờ nghe có nút duyệt ready');
  assert.match(sp.mine[0], /Đã nghe\/xem — duyệt ready/);
  assert.match(sp.mine[1], /Chấp nhận — duyệt ready/);
  assert.match(sp.mine[2], /Cho Claude làm thay/);
  assert.match(sp.auto[0], /recheck\(3,this\)/, 'nút kiểm tra lại dùng chỉ số của danh sách gốc');
  assert.equal(JSON.stringify(attnSplit([])), JSON.stringify({ mine: [], topics: [], auto: [] }));
  // khung mới có trong trang, và trang không còn một khung "Cần giám đốc chú ý" chứa cả chủ đề
  assert.match(html, /id="topicq"/);
  assert.match(html, /id="autoq"/);
  assert.match(html, /Chủ đề chờ duyệt \(\$\{sp\.topics\.length\}\)/);
});

test('khung "Sẵn sàng đăng" và gói đăng TikTok: có nút sao chép, thoát HTML, không đăng giúp (21/11/2026)', () => {
  const { readyHtml, packHtml } = vm.runInNewContext(`${definitions}
({ readyHtml, packHtml })`);
  assert.equal(readyHtml([]), '');
  const list = readyHtml([{ id: 'IT-T18-E01', title: payload }]);
  assert.match(list, /Sẵn sàng đăng \(1\)/);
  assert.match(list, /openPack\('IT-T18-E01'\)/);
  assert.match(list, /markPublished\('IT-T18-E01'\)/);
  assert.match(list, /bạn tự đăng, hệ thống không đăng giúp/);
  assert.ok(list.includes(escaped) && !list.includes(payload));
  const html1 = packHtml({
    video_id: 'IT-T18-E01', stage: 'ready', duration_s: 62.8, chars: 120, text: `Mô tả ${payload}`,
    files: { video: { path: 'D:/x/' + payload + '.mp4' }, cover: null },
    warnings: [{ level: 'error', text: payload }, { level: 'warn', text: 'cảnh báo nhẹ' }], reminders: ['Bật công tắc AI'],
  });
  assert.ok(html1.includes(escaped) && !html1.includes(payload), 'mọi nội dung động đều được thoát');
  assert.match(html1, /copyBlock\('pkText',this\)/);
  assert.match(html1, /copyBlock\('pkVideo',this\)/);
  assert.doesNotMatch(html1, /copyBlock\('pkCover'/, 'không có bìa thì không có nút sao chép bìa');
  assert.match(html1, /pkwarn error/);
  assert.match(html1, /openFolder\('IT-T18-E01'\)/);
  assert.match(html, /id="readyq"/);
  assert.match(html, /id="dPack"/);
  assert.match(src, /\/pack\/tiktok/);
});
