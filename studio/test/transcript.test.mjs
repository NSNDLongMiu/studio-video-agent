// Kiểm thử đọc log và dữ liệu popup bằng DB tạm, không khởi động dashboard hay worker.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tmpRoot = fs.realpathSync(os.tmpdir());
const tmp = fs.mkdtempSync(path.join(tmpRoot, 'studio-transcript-'));
const logs = path.join(tmp, 'logs');
const content = path.join(tmp, 'content');
Object.assign(process.env, {
  STUDIO_DB: path.join(tmp, 'db.sqlite'),
  STUDIO_CONTENT: content,
  STUDIO_ACCOUNTS: path.join(tmp, 'accounts'),
  STUDIO_NO_AUTOSTART: '1',
});
const S = await import('../src/db.mjs');
const P = await import('../src/pool.mjs');
const { jobLogFile, writeLogMeta } = await import('../src/runners.mjs');
const { parseCodexLog, parseClaudeStream, isAllowedLogPath, readTail, memberActivity } = await import('../src/transcript.mjs');
after(() => {
  S.closeDb();
  assert.equal(path.dirname(fs.realpathSync(tmp)), tmpRoot);
  fs.rmSync(tmp, { recursive: true, force: true });
});

const codexSample = fs.readFileSync(new URL('./fixtures/codex-log-sample.log', import.meta.url), 'utf8');
const claudeSample = fs.readFileSync(new URL('./fixtures/claude-stream-sample.ndjson', import.meta.url), 'utf8');
const legacyNote = 'Log cũ của Claude chỉ có kết quả cuối (chạy trước khi bật stream-json)';
const startTime = '2026-11-18T05:34:58.428Z';
const attempt = (label) => `===== ${startTime} · ${label} =====`;
const codexReply = (text) => `codex\n${text}\n`;
const ndjson = (...records) => records.map((row) => JSON.stringify(row)).join('\n');
const reply = (text, parent_tool_use_id = null) => ({
  type: 'assistant', parent_tool_use_id, message: { content: [{ type: 'text', text }] },
});

function assignment(dept, teamCount = 1) {
  S.createDepartment({ name: dept, slug: dept, initial_teams: teamCount });
  return S.sql.all('SELECT id FROM teams WHERE dept=? ORDER BY id', dept).map(({ id }) => {
    const { topic_id } = S.submitTopic({ dept, text: `Chủ đề của đội ${id}` });
    const topic = S.assignTopic({ topic_id, team_id: id });
    return { ...topic, video: topic.videos[0], dept };
  });
}

function activity(topic, role) {
  const member = S.sql.get('SELECT id FROM members WHERE team_id=? AND role=?', topic.team_id, role);
  return memberActivity(member.id);
}

function writeLog(file, text, mtimeMs) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, 'utf8');
  if (mtimeMs !== undefined) fs.utimesSync(file, mtimeMs / 1000, mtimeMs / 1000);
  return file;
}

function enqueue(kind, targets, text, { status = 'succeeded', mtimeMs } = {}) {
  const { job_id } = P.enqueueJob({ kind, ...targets });
  const log = jobLogFile(P.getJob(job_id));
  if (text !== undefined) writeLog(log, text, mtimeMs);
  S.sql.run('UPDATE jobs SET status=?,started_at=? WHERE id=?', status, startTime, job_id);
  return { id: job_id, log };
}

test('Codex đọc fixture và gộp mỗi cặp MCP, mỗi lệnh và câu trả lời cuối', () => {
  const messages = parseCodexLog(codexSample);
  assert.equal(messages[0].who, 'prompt');
  assert.match(messages[0].text, /^\[\[STUDIO-ROLE:producer\]\]/);
  assert.equal(messages[0].text.length, 300);
  assert.ok(messages[0].detail);
  assert.ok(messages.some((message) => message.agent === 'Codex'));
  const commands = messages.filter((message) => message.text.startsWith('Chạy lệnh:'));
  assert.deepEqual(commands.map(({ ok }) => ok), [true, true, false]);
  assert.match(commands[0].text, /^Chạy lệnh: "Get-Content/);
  assert.match(commands[2].detail, /MODULE_TYPELESS_PACKAGE_JSON/);
  assert.equal(messages.filter((message) => message.text === 'MCP studio/report_status').length, 3);
  assert.equal(messages.filter((message) => message.text === 'MCP studio/escalate').length, 1);
  assert.ok(messages.some((message) => message.who === 'system' && message.text === 'Tổng token: 75,120'));
  assert.equal(messages.filter((message) => message.text.includes('NEEDS_HELP:')).length, 1);
  assert.deepEqual(messages.at(-1), { who: 'system', text: 'Kết thúc: thoát mã 0' });
});

test('Codex chỉ đọc lượt cuối, khớp dấu hiệu nguyên dòng và cắt đúng giới hạn', () => {
  const messages = parseCodexLog([
    attempt('lượt cũ'), 'codex', 'Câu cũ', '=====', 'user', 'x'.repeat(1900),
    'codex', 'user trong câu', 'exec ', 'codex khác',
    'exec', `-Command ${'l'.repeat(230)}`, ' exited 7 in 1ms:', 'd'.repeat(1600),
    'exec', 'lệnh chưa chạy', 'succeeded nhưng thiếu trạng thái hợp lệ',
    'tokens used', '12', 'Câu cuối khác', '[thoát mã 7, QUÁ GIỜ]',
  ].join('\r\n'));
  assert.deepEqual(messages.map(({ who }) => who), ['prompt', 'agent', 'tool', 'system', 'agent', 'system']);
  assert.equal(messages[0].text, 'x'.repeat(300));
  assert.equal(messages[0].detail, 'x'.repeat(1499) + '…');
  assert.equal(messages[1].text, 'user trong câu\nexec \ncodex khác');
  assert.equal(messages[2].text, 'Chạy lệnh: ' + 'l'.repeat(188) + '…');
  assert.equal(messages[2].detail, 'd'.repeat(1499) + '…');
  assert.equal(messages[2].ok, false);
  assert.equal(messages.at(-2).text, 'Câu cuối khác');
  assert.equal(messages.at(-1).text, 'Kết thúc: thoát mã 7');
  assert.deepEqual(parseCodexLog(`codex\nCâu cũ\n=====\n${'z'.repeat(600)}`), [{ who: 'system', text: 'z'.repeat(500) }]);
  assert.doesNotThrow(() => parseCodexLog(null));
});

test('Claude đọc fixture có Agent, kết quả công cụ, agent phụ và hai dòng kết thúc', () => {
  const { messages, legacy, subagents } = parseClaudeStream(`không phải JSON\n${claudeSample}\n{chưa ghi xong`);
  assert.equal(legacy, false);
  assert.equal(subagents.length, 1);
  const [{ parent_id, subagent_type }] = subagents;
  assert.equal(subagent_type, 'general-purpose');
  assert.ok(parent_id);
  const tool = messages.find((message) => message.who === 'tool');
  assert.match(tool.text, /^Gọi Agent: general-purpose: Reply with exactly/);
  assert.equal(JSON.parse(tool.detail).subagent_type, subagent_type);
  assert.ok(messages.some((message) => message.text === 'Kết quả Agent' && message.detail));
  assert.deepEqual(messages.find((message) => message.text === 'hi'), { who: 'agent', agent: 'general-purpose', parent_id, text: 'hi' });
  assert.deepEqual(messages.filter((message) => message.who === 'system').map(({ text, error }) => [text, error]), [
    ["Kết thúc: I've started the agent and I'm waiting for its result before replying.", false],
    ['Kết thúc: done', false],
  ]);
});

test('Claude đọc JSON cũ và giữ kết quả lỗi trong luồng có nhiều lượt chạy', () => {
  const old = { messages: [{ who: 'agent', agent: 'Claude', text: 'đã xong' }], legacy: true, subagents: [] };
  assert.deepEqual(parseClaudeStream('{"result":"đã xong"}'), old);
  const oldObject = JSON.stringify({ type: 'result', result: 'đã xong' }, null, 2);
  assert.deepEqual(parseClaudeStream(`${attempt('Claude cũ')}\n${oldObject}\n[thoát mã 0]`), old);
  assert.deepEqual(parseClaudeStream('rác\n{'), { messages: [], legacy: false, subagents: [] });

  const first = ndjson({ type: 'result', result: 'lượt một', is_error: false });
  const second = ndjson(
    reply('Agent phụ đang chạy', 'agent-phu'),
    { type: 'system', subtype: 'task_started', tool_use_id: 'agent-phu', subagent_type: 'planner' },
    { type: 'assistant', message: { content: [{ type: 'thinking', thinking: 'ẩn' }] } },
    { type: 'rate_limit_event' },
    { type: 'result', errors: ['lỗi từ Claude'], is_error: true },
  );
  assert.deepEqual(parseClaudeStream(`${attempt('lượt một')}\n${first}\n[thoát mã 0]\n${attempt('lượt hai')}\n${second}`), {
    messages: [
      { who: 'system', text: 'Kết thúc: lượt một', error: false },
      { who: 'agent', agent: 'planner', parent_id: 'agent-phu', text: 'Agent phụ đang chạy' },
      { who: 'system', text: 'Kết thúc: lỗi từ Claude', error: true },
    ],
    legacy: false,
    subagents: [{ parent_id: 'agent-phu', subagent_type: 'planner' }],
  });
});

test('QC trả đúng thông tin vị trí, sự kiện, việc và log của đội', () => {
  const [topic, other] = assignment('qc-test', 2);
  const { id } = enqueue('qc', { video_id: topic.video }, claudeSample, { status: 'running' });
  enqueue('qc', { video_id: other.video }, ndjson(reply('Log đội khác')));
  S.reportStatus({ team_id: topic.team_id, role: 'qc', status: 'working', video_id: topic.video, task: 'Đang kiểm' });
  S.escalate({ video_id: topic.video, reason: 'Cần kiểm âm lượng' });
  S.logEvent({ team_id: other.team_id, kind: 'status', message: 'QC: của đội khác' });
  S.logEvent({ team_id: topic.team_id, video_id: topic.video, message: 'Vai khác: đang kiểm' });

  const result = activity(topic, 'qc');
  assert.deepEqual(Object.keys(result), ['generated_at', 'member', 'events', 'jobs', 'transcripts', 'note']);
  assert.ok(Number.isFinite(Date.parse(result.generated_at)));
  assert.deepEqual(result.member, {
    id: result.member.id, role: 'qc', label: 'QC', engine: 'claude', status: 'working', task: 'Đang kiểm',
    video_id: topic.video, team_id: topic.team_id, team_name: topic.team, dept: topic.dept, dept_name: topic.dept,
    minutes_since_update: 0, duty: S.ROSTER.find(({ role }) => role === 'qc').duty,
  });
  assert.deepEqual(result.events.map(({ kind }) => kind), ['job', 'status', 'escalate']);
  assert.deepEqual(Object.keys(result.events[0]), ['id', 'ts', 'actor', 'kind', 'message']);
  assert.ok(result.events.every((event, index) => !index || event.id > result.events[index - 1].id));
  assert.deepEqual(result.jobs, [{
    id, kind: 'qc', status: 'running', title: P.getJob(id).title, provider: 'claude',
    started_at: startTime, finished_at: null, attempts: 0, last_error: '', summary: '',
  }]);
  assert.equal(result.note, null);
  const [log] = result.transcripts;
  assert.equal(result.transcripts.length, 1);
  assert.deepEqual(log, {
    id: `job-${id}`, source: 'claude-job', title: P.getJob(id).title, started_at: startTime, updated_at: log.updated_at,
    running: true, truncated: false, legacy: false, note: null, messages: parseClaudeStream(claudeSample).messages,
  });
  assert.ok(Number.isFinite(Date.parse(log.updated_at)));
  assert.throws(() => memberActivity(999_999), (error) => error instanceof S.StudioError && error.message === 'Không tìm thấy vị trí');
});

test('Sản xuất dùng log Codex, ưu tiên việc đang chạy và giới hạn sự kiện, việc, transcript', () => {
  const [topic] = assignment('producer-test');
  const time = Date.now() - 60_000;
  const running = enqueue('produce', { video_id: topic.video }, codexSample, { status: 'running', mtimeMs: time });
  const completed = [];
  // Xếp các việc đã xong trước, để cơ chế chống trùng xử lý đúng việc đang chạy.
  S.sql.run("UPDATE jobs SET status='succeeded' WHERE id=?", running.id);
  for (let index = 0; index < 10; index++) {
    completed.push(enqueue('produce', { video_id: topic.video }, codexReply(`Lượt ${index}`), { mtimeMs: time + (index + 1) * 1000 }));
  }
  S.sql.run("UPDATE jobs SET status='running' WHERE id=?", running.id);
  S.reportStatus({ team_id: topic.team_id, role: 'producer', status: 'working', video_id: topic.video });
  for (let index = 0; index < 62; index++) S.logEvent({ team_id: topic.team_id, message: `Sản xuất: sự kiện ${index}` });

  const result = activity(topic, 'producer');
  assert.deepEqual(result.events.map(({ message }) => message), Array.from({ length: 60 }, (_, i) => `Sản xuất: sự kiện ${i + 2}`));
  assert.deepEqual(result.jobs.map(({ id }) => id), [...completed].reverse().map(({ id }) => id));
  assert.deepEqual(result.transcripts.map(({ id, running, source }) => [id, running, source]), [
    [`job-${running.id}`, true, 'codex-job'],
    [`job-${completed.at(-1).id}`, false, 'codex-job'],
    [`job-${completed.at(-2).id}`, false, 'codex-job'],
  ]);
  assert.deepEqual(result.transcripts[0].messages, parseCodexLog(codexSample));
});

test('Kế hoạch tách agent theo vai và nối log Codex qua sidecar hoặc tên thư mục', () => {
  const [topic, other] = assignment('plan-test', 2);
  const roles = ['planner', 'visual-director', 'ideator-a', 'ideator-b'];
  const lines = ndjson(reply('Điều phối'), ...roles.flatMap((role) => [
    { type: 'system', subtype: 'task_started', tool_use_id: role, subagent_type: role },
    reply(`Tin từ ${role}`, role),
  ]));
  const now = Date.now();
  const plan = enqueue('plan', { topic_id: topic.topic_id }, lines, { mtimeMs: now - 200_000 });
  const foreign = enqueue('plan', { topic_id: other.topic_id }, ndjson(reply('Điều phối đội khác')));
  const folder = path.basename(topic.topic_folder);
  const outside = (name, text, age) => writeLog(path.join(logs, name), text, now - age);
  const script = outside('codex-write-script-vong-hai.log', codexReply('Kịch bản qua sidecar'), 10_000);
  assert.equal(writeLogMeta(script, { v: 1, source: 'codex-write', role: 'script', topic_id: topic.topic_id, started_at: startTime }), true);
  const visual = outside('codex-write-storyboard-123.log', codexReply('Storyboard qua mã việc') + '[thoát mã 0]', 12_000);
  assert.equal(writeLogMeta(visual, { v: 1, source: 'codex-write', role: 'visual', job_id: plan.id }), true);
  outside('codex-ideate-vong-cu.log', `Đọc content\\${topic.dept}\\${folder}\\brief.md\n${codexReply('Ý tưởng từ log cũ')}`, 110_000);
  outside('codex-write-script-sai-thu-muc.log', `Đọc content/${topic.dept}/${folder}-khac/brief.md\n${codexReply('Không được hiện')}`, 5_000);
  const wrongTeam = outside('codex-write-script-sai-doi.log', `content/${topic.dept}/${folder}/brief.md\n${codexReply('Sai đội')}`, 4_000);
  assert.equal(writeLogMeta(wrongTeam, { role: 'script', topic_id: other.topic_id, job_id: foreign.id }), true);
  const wrongRole = outside('codex-write-script-sai-vai.log', `content/${topic.dept}/${folder}/brief.md\n${codexReply('Sai vai')}`, 3_000);
  assert.equal(writeLogMeta(wrongRole, { role: 'scout', topic_id: topic.topic_id }), true);

  const scriptResult = activity(topic, 'script');
  assert.deepEqual(scriptResult.jobs.map(({ id }) => id), [plan.id]);
  assert.deepEqual(scriptResult.transcripts.map(({ source, running, messages }) => [source, running, messages[0].text]), [
    ['codex-write', true, 'Kịch bản qua sidecar'], ['claude-job', false, 'Tin từ planner'], ['claude-job', false, 'Điều phối'],
  ]);
  assert.equal(scriptResult.transcripts[0].started_at, startTime);
  assert.equal(scriptResult.transcripts.at(-1).title, 'Phiên điều phối (make-plan)');
  assert.ok(scriptResult.transcripts.at(-1).messages.every((message) => !Object.hasOwn(message, 'parent_id')));
  assert.deepEqual(activity(topic, 'visual').transcripts.map(({ source, running, messages }) => [source, running, messages[0].text]), [
    ['codex-write', false, 'Storyboard qua mã việc'], ['claude-job', false, 'Tin từ visual-director'], ['claude-job', false, 'Điều phối'],
  ]);
  assert.deepEqual(activity(topic, 'idea').transcripts.map(({ source, running, messages }) => [source, running, messages[0].text]), [
    ['codex-ideate', false, 'Ý tưởng từ log cũ'], ['claude-job', false, 'Tin từ ideator-a'],
    ['claude-job', false, 'Tin từ ideator-b'], ['claude-job', false, 'Điều phối'],
  ]);
  assert.equal(activity(other, 'script').transcripts.some(({ id }) => id === 'codex-write-script-vong-hai'), false);
});

test('Phiên điều phối đang chạy được chọn trước các log riêng mới hơn', () => {
  const [topic] = assignment('plan-order');
  const now = Date.now();
  const plan = enqueue('plan', { topic_id: topic.topic_id }, ndjson(reply('Điều phối đang chạy')), {
    status: 'running', mtimeMs: now - 120_000,
  });
  for (let index = 1; index <= 4; index++) {
    const file = writeLog(path.join(logs, `codex-write-script-thu-tu-${index}.log`), codexReply(`Bản ${index}`), now - 100_000 - 1000 * index);
    assert.equal(writeLogMeta(file, { role: 'script', topic_id: topic.topic_id }), true);
  }
  assert.deepEqual(activity(topic, 'script').transcripts.map(({ id }) => id), [
    `job-${plan.id}:make-plan`, 'codex-write-script-thu-tu-1', 'codex-write-script-thu-tu-2', 'codex-write-script-thu-tu-3',
  ]);
});

test('Kịch bản giữ log Codex và ưu tiên log có luồng tin trong sáu log việc gần nhất', () => {
  const [topic] = assignment('plan-legacy');
  const time = Date.now() - 300_000;
  const targets = { topic_id: topic.topic_id };
  enqueue('plan', targets, ndjson(reply('Log việc thứ bảy')), { mtimeMs: time });
  const streamed = enqueue('plan', targets, ndjson(reply('Điều phối có luồng tin')), { mtimeMs: time + 1000 });
  const legacy = [];
  for (let index = 2; index <= 6; index++) {
    legacy.push(enqueue('plan', targets, JSON.stringify({ result: `Điều phối cũ ${index}` }), { mtimeMs: time + index * 1000 }));
  }
  for (const index of [4, 5]) {
    const file = writeLog(path.join(logs, `codex-write-script-moi-${index}.log`), codexReply(`Bản ${index}`), time + index * 1000);
    assert.equal(writeLogMeta(file, { role: 'script', topic_id: topic.topic_id }), true);
  }

  const { transcripts } = activity(topic, 'script');
  assert.deepEqual(transcripts.map(({ id, source, legacy }) => [id, source, legacy]), [
    ['codex-write-script-moi-5', 'codex-write', false],
    ['codex-write-script-moi-4', 'codex-write', false],
    [`job-${streamed.id}:make-plan`, 'claude-job', false],
    [`job-${legacy.at(-1).id}:make-plan`, 'claude-job', true],
    [`job-${legacy.at(-2).id}:make-plan`, 'claude-job', true],
  ]);
});

test('Phiên điều phối cũ đang chạy đứng trước các log đã xong', () => {
  const [topic] = assignment('plan-running-legacy');
  const time = Date.now() - 300_000;
  const targets = { topic_id: topic.topic_id };
  const completed = enqueue('plan', targets, ndjson(reply('Điều phối đã xong')), { mtimeMs: time + 1000 });
  const running = enqueue('plan', targets, '{"result":"Điều phối cũ đang chạy"}', { status: 'running', mtimeMs: time });
  const file = writeLog(path.join(logs, 'codex-write-script-da-xong.log'), codexReply('Kịch bản đã xong'), time + 2000);
  assert.equal(writeLogMeta(file, { role: 'script', topic_id: topic.topic_id }), true);

  assert.deepEqual(activity(topic, 'script').transcripts.map(({ id, running, legacy }) => [id, running, legacy]), [
    [`job-${running.id}:make-plan`, true, true],
    ['codex-write-script-da-xong', false, false],
    [`job-${completed.id}:make-plan`, false, false],
  ]);
});

test('Scout lọc team_id trong payload và vai chỉ dùng Claude có ghi chú phù hợp', () => {
  const [topic, other, broken] = assignment('scout-test', 3);
  S.setAutoTopics({ dept: topic.dept, on: true });
  const { id } = enqueue('scout', { team_id: topic.team_id }, '{"result":"Gợi ý cũ"}');
  enqueue('scout', { team_id: other.team_id }, ndjson(reply('Đội khác')));
  const bad = enqueue('scout', { team_id: broken.team_id }, ndjson(reply('Không rõ đội')));
  S.sql.run('UPDATE jobs SET payload=? WHERE id=?', '{hỏng', bad.id);
  const result = activity(topic, 'scout');
  assert.deepEqual(result.jobs.map((job) => job.id), [id]);
  assert.equal(result.transcripts.length, 1);
  assert.equal(result.transcripts[0].legacy, true);
  assert.equal(result.transcripts[0].note, legacyNote);
  assert.equal(result.note, legacyNote);

  const rescue = enqueue('rescue', { video_id: topic.video });
  const outside = writeLog(path.join(tmp, 'rescue.log'), ndjson(reply('Ngoài thư mục')));
  S.sql.run('UPDATE jobs SET log_file=? WHERE id=?', outside, rescue.id);
  const noLog = activity(topic, 'rescue');
  assert.deepEqual(noLog.jobs.map((job) => job.id), [rescue.id]);
  assert.deepEqual(noLog.transcripts, []);
  assert.equal(noLog.note, 'Chưa có log cho vị trí này');
});

test('Đường dẫn log chỉ cho phép file thường trong hai thư mục, kể cả khi có liên kết', () => {
  const allowed = writeLog(path.join(logs, 'allowed.log'), 'Log trong kho');
  const inContent = writeLog(path.join(content, 'allowed.log'), 'Log trong nội dung');
  const neighbor = writeLog(path.join(tmp, 'logs-khac', 'outside.log'), 'Ngoài kho');
  const traversal = `${logs}${path.sep}..${path.sep}logs-khac${path.sep}outside.log`;
  const link = path.join(logs, 'lien-ket-ra-ngoai');
  fs.symlinkSync(path.dirname(neighbor), link, process.platform === 'win32' ? 'junction' : 'dir');
  try {
    for (const file of [allowed, inContent]) assert.equal(isAllowedLogPath(file), true);
    for (const file of [neighbor, traversal, logs, path.join(link, 'outside.log'), path.join(logs, 'missing.log')]) {
      assert.equal(isAllowedLogPath(file), false, file);
      assert.equal(readTail(file), null, file);
    }
  } finally {
    fs.unlinkSync(link);
  }
});

test('readTail bỏ dòng bị cắt, giữ dòng nguyên và giới hạn log mặc định ở 512 KiB', () => {
  const [topic] = assignment('tail-test');
  const long = 'ả'.repeat(270_000);
  const stream = Array.from({ length: 210 }, (_, index) => JSON.stringify(reply(`Tin ${index}`))).join('\n');
  const { log } = enqueue('qc', { video_id: topic.video }, `${long}\n${stream}`);
  assert.ok(fs.statSync(log).size > 512 * 1024);
  assert.deepEqual(readTail(log), { text: stream, truncated: true, mtimeMs: fs.statSync(log).mtimeMs });
  const exact = writeLog(path.join(logs, 'tail-exact.log'), 'Dòng đầu\r\nDòng cuối\r\n');
  assert.equal(readTail(exact, Buffer.byteLength('Dòng cuối\r\n')).text, 'Dòng cuối\r\n');
  assert.equal(readTail(exact, Buffer.byteLength('Dòng cuối\r\n') + 2).text, 'Dòng cuối\r\n');

  const [entry] = activity(topic, 'qc').transcripts;
  const messages = parseClaudeStream(stream).messages;
  assert.equal(entry.truncated, true);
  assert.equal(messages.length, 200);
  assert.equal(messages[0].text, 'Tin 10');
  assert.equal(messages.at(-1).text, 'Tin 209');
  assert.deepEqual(entry.messages, messages);

  const small = Array.from({ length: 201 }, (_, index) => codexReply(`Tin Codex ${index}`)).join('');
  enqueue('produce', { video_id: topic.video }, small);
  const [codex] = activity(topic, 'producer').transcripts;
  assert.equal(codex.truncated, true);
  assert.equal(codex.messages.length, 200);
  assert.equal(codex.messages[0].text, 'Tin Codex 1');
  assert.equal(codex.messages.at(-1).text, 'Tin Codex 200');
});
