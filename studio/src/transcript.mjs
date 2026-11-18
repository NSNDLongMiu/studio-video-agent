// Đọc hoạt động của từng vị trí trên dashboard từ sự kiện, hàng đợi và log cục bộ.
import fs from 'node:fs';
import path from 'node:path';
import * as S from './db.mjs';
import { jobLogFile } from './runners.mjs';

const LOG_DIR = path.join(path.dirname(S.DB_PATH), 'logs');
const TAIL_BYTES = 512 * 1024;
const HEAD_BYTES = 64 * 1024;
const MAX_MESSAGES = 200;
const LEGACY_NOTE = 'Log cũ của Claude chỉ có kết quả cuối (chạy trước khi bật stream-json)';
const EXIT_LINE = /^\[thoát mã (-?\d+|null)(?:, [^\]]*)?\]$/;

function clip(value, max) {
  const text = String(value ?? '');
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/[\uD800-\uDBFF]$/, '') + '…';
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function latestAttempt(text) {
  let start = 0;
  let started_at = null;
  for (const header of text.matchAll(/^=====[ \t]*(?:(\S+)[ \t]+·[ \t]+.*?[ \t]+=====)?[ \t]*\r?$/gm)) {
    start = header.index + header[0].length;
    started_at = Number.isFinite(Date.parse(header[1])) ? header[1] : null;
  }
  return { text: text.slice(start), started_at };
}

function codexMessages(text) {
  const messages = [];
  const pendingMcp = new Map();
  let block = null;
  let lines = [];
  let lastReply = '';

  function flush() {
    const body = lines.join('\n').trim();
    if (block === 'user' && body) {
      const prompt = { who: 'prompt', text: body.slice(0, 300) };
      if (body.length > 300) prompt.detail = clip(body.slice(300), 1500);
      messages.push(prompt);
    } else if (block === 'codex' && body) {
      lastReply = body;
      messages.push({ who: 'agent', agent: 'Codex', text: clip(body, 4000) });
    } else if (block === 'exec' && lines[0]) {
      const [command, status = '', ...output] = lines;
      const result = status.match(/^\s*(succeeded|exited\s+-?\d+|failed)\b/);
      const short = command.replace(/^.*?\s-Command\s+/i, '').trim();
      const detail = (result ? output : lines.slice(1)).join('\n').trimEnd();
      messages.push({
        who: 'tool', text: `Chạy lệnh: ${clip(short, 200)}`,
        detail: clip(detail, 1500), ok: result?.[1] === 'succeeded',
      });
    } else if (block === 'tokens used') {
      const [tokens, ...reply] = lines;
      if (tokens?.trim()) messages.push({ who: 'system', text: clip(`Tổng token: ${tokens.trim()}`, 4000) });
      const finalReply = reply.join('\n').trim();
      if (finalReply && finalReply !== lastReply) {
        messages.push({ who: 'agent', agent: 'Codex', text: clip(finalReply, 4000) });
      }
    }
    block = null;
    lines = [];
  }

  // Dấu hiệu khớp nguyên dòng. Nếu thân khối chứa đúng một dòng như "exec", nó cũng mở khối mới.
  for (const line of text.split(/\r?\n/)) {
    const exit = line.match(EXIT_LINE);
    if (exit) {
      flush();
      messages.push({ who: 'system', text: `Kết thúc: thoát mã ${exit[1]}` });
    } else if (block === 'tokens used') {
      // Sau số token, mọi dòng còn lại là bản in câu trả lời cuối.
      lines.push(line);
    } else if (line === 'user' || line === 'codex' || line === 'exec' || line === 'tokens used') {
      flush();
      block = line;
    } else {
      const mcp = line.match(/^mcp: (\S+\/\S+) (started|\(completed\))$/);
      if (mcp) {
        flush();
        const [, name, phase] = mcp;
        const pending = pendingMcp.get(name) || 0;
        if (phase === 'started' || !pending) messages.push({ who: 'tool', text: clip(`MCP ${name}`, 4000) });
        if (phase === 'started') pendingMcp.set(name, pending + 1);
        else if (pending > 1) pendingMcp.set(name, pending - 1);
        else pendingMcp.delete(name);
      } else if (block) {
        lines.push(line);
      }
    }
  }
  flush();
  return messages.length ? messages : [{ who: 'system', text: text.slice(-500) }];
}

export function parseCodexLog(text) {
  return codexMessages(latestAttempt(text).text).slice(-MAX_MESSAGES);
}

function toolSummary(name, input) {
  if (name === 'Bash') return input.command || '';
  if (['Read', 'Write', 'Edit'].includes(name)) return input.file_path || '';
  if (name === 'Grep' || name === 'Glob') return input.pattern || '';
  if (name === 'Agent' || name === 'Task') {
    return [input.subagent_type, clip(input.prompt, 300)].filter(Boolean).join(': ');
  }
  return Object.keys(input).join(', ');
}

function toolResultText(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.filter((block) => block?.type === 'text').map((block) => block.text).join('\n');
}

function claudeStream(text, allowLegacy = true) {
  const records = text.split(/\r?\n/).map(parseJson).filter((row) => row && typeof row === 'object');
  if (allowLegacy && records.length <= 1) {
    const old = records[0] || parseJson(text.trim());
    if (old && (!old.type || old.type === 'result') && typeof old.result === 'string') {
      return { messages: [{ who: 'agent', agent: 'Claude', text: clip(old.result, 4000) }], legacy: true, subagents: [] };
    }
  }
  const tools = new Map();
  const agents = new Map();
  const messages = [];
  const blocks = (row) => Array.isArray(row.message?.content) ? row.message.content : [];

  // Lập bảng trước để vẫn gắn đúng tên khi thông tin đến sau tin nhắn của agent phụ.
  for (const row of records) {
    if (row.type !== 'assistant') continue;
    for (const block of blocks(row)) {
      if (block?.type !== 'tool_use' || !block.id) continue;
      tools.set(block.id, block.name);
      if (['Agent', 'Task'].includes(block.name) && block.input?.subagent_type) {
        agents.set(block.id, block.input.subagent_type);
      }
    }
  }
  for (const row of records) {
    if (row.parent_tool_use_id && row.subagent_type && !agents.has(row.parent_tool_use_id)) {
      agents.set(row.parent_tool_use_id, row.subagent_type);
    }
    if (row.type === 'system' && row.subtype === 'task_started' && row.tool_use_id && row.subagent_type) {
      agents.set(row.tool_use_id, row.subagent_type);
    }
  }
  for (const row of records) {
    const parent_id = row.parent_tool_use_id;
    const agent = agents.get(parent_id) || 'Claude';
    const parent = parent_id == null ? {} : { parent_id, agent };
    if (row.type === 'assistant') {
      for (const block of blocks(row)) {
        if (block?.type === 'text' && typeof block.text === 'string') {
          messages.push({ who: 'agent', agent, text: clip(block.text, 4000), ...parent });
        } else if (block?.type === 'tool_use') {
          const name = block.name || 'công cụ';
          const input = block.input ?? {};
          const summary = toolSummary(name, input);
          const text = `Gọi ${name}${summary ? `: ${summary}` : ''}`;
          messages.push({ who: 'tool', text: clip(text, 4000), detail: clip(JSON.stringify(input), 1500), ...parent });
        }
      }
    } else if (row.type === 'user') {
      for (const block of blocks(row)) {
        if (block?.type !== 'tool_result') continue;
        const name = tools.get(block.tool_use_id) || 'công cụ';
        messages.push({ who: 'tool', text: clip(`Kết quả ${name}`, 4000), detail: clip(toolResultText(block.content), 1500), ...parent });
      }
    } else if (row.type === 'result') {
      messages.push({ who: 'system', text: `Kết thúc: ${clip(row.result, 500)}`, error: !!row.is_error, ...parent });
    }
  }
  return { messages, legacy: false, subagents: [...agents].map(([parent_id, subagent_type]) => ({ parent_id, subagent_type })) };
}

export function parseClaudeStream(text) {
  const parsed = claudeStream(latestAttempt(text).text);
  return { ...parsed, messages: parsed.messages.slice(-MAX_MESSAGES) };
}

function allowedLogPath(file) {
  try {
    const resolved = fs.realpathSync(file);
    const inside = [LOG_DIR, S.CONTENT_DIR].some((root) => {
      const relative = path.relative(root, resolved);
      return relative && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
    });
    return inside && fs.statSync(resolved).isFile() ? resolved : null;
  } catch {
    return null;
  }
}

export function isAllowedLogPath(file) {
  return allowedLogPath(file) !== null;
}

function withLogFile(file, read) {
  const resolved = allowedLogPath(file);
  if (!resolved) return null;
  let fd;
  try {
    fd = fs.openSync(resolved, fs.constants.O_RDONLY | fs.constants.O_NONBLOCK | (fs.constants.O_NOFOLLOW || 0));
    const stat = fs.fstatSync(fd);
    return stat.isFile() ? read(fd, stat) : null;
  } catch {
    return null;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

export function readTail(file, maxBytes = TAIL_BYTES) {
  return withLogFile(file, (fd, stat) => {
    const count = Math.min(stat.size, TAIL_BYTES, Math.max(0, Math.floor(maxBytes)));
    const start = stat.size - count;
    const buffer = Buffer.alloc(count);
    const size = fs.readSync(fd, buffer, 0, count, start);
    let first = 0;
    if (start && size) {
      // Kiểm tra một byte liền trước cửa sổ để giữ dòng đầu nếu nó bắt đầu đúng tại mép cắt.
      const previous = Buffer.alloc(1);
      fs.readSync(fd, previous, 0, 1, start - 1);
      if (previous[0] !== 10) {
        const newline = buffer.subarray(0, size).indexOf(10);
        first = newline < 0 ? size : newline + 1;
      }
    }
    return { text: buffer.toString('utf8', first, size), truncated: start > 0, mtimeMs: stat.mtimeMs };
  });
}

function readHead(file) {
  return withLogFile(file, (fd, stat) => {
    const buffer = Buffer.alloc(Math.min(stat.size, HEAD_BYTES));
    return buffer.toString('utf8', 0, fs.readSync(fd, buffer, 0, buffer.length, 0));
  });
}

const JOB_KIND = { idea: 'plan', script: 'plan', visual: 'plan', producer: 'produce', qc: 'qc', rescue: 'rescue', scout: 'scout' };
const AGENT_ROLE = { planner: 'script', 'visual-director': 'visual', 'ideator-a': 'idea', 'ideator-b': 'idea' };
const CODEX_FILENAME = /^(codex-write)-(script|storyboard)-(\d+)\.log$|^(codex-ideate)-(codex|ideator-c|ideator-d)-(\d+)\.log$/;
const newestFirst = (a, b) => Number(b.running) - Number(a.running) || Date.parse(b.updated_at) - Date.parse(a.updated_at);

function memberJobs(member) {
  const kind = JOB_KIND[member.role];
  if (kind === 'scout') {
    return S.sql.all("SELECT * FROM jobs WHERE kind='scout' ORDER BY id DESC")
      .filter((job) => parseJson(job.payload)?.team_id === member.team_id);
  }
  if (kind === 'plan') {
    return S.sql.all("SELECT * FROM jobs WHERE kind='plan' AND topic_id IN (SELECT id FROM topics WHERE team_id=?) ORDER BY id DESC", member.team_id);
  }
  return S.sql.all('SELECT * FROM jobs WHERE kind=? AND video_id IN (SELECT id FROM videos WHERE team_id=?) ORDER BY id DESC', kind, member.team_id);
}

function transcript(info, tail, messages, legacy = false) {
  return {
    ...info,
    updated_at: new Date(tail.mtimeMs).toISOString(),
    truncated: tail.truncated || messages.length > MAX_MESSAGES,
    legacy,
    note: legacy ? LEGACY_NOTE : null,
    messages: messages.slice(-MAX_MESSAGES),
  };
}

function jobTranscripts(jobs, role) {
  const entries = [];
  const coordinators = [];
  const candidates = [];
  for (const job of jobs) {
    try {
      const file = allowedLogPath(job.status !== 'running' && job.log_file ? path.resolve(S.ROOT, job.log_file) : jobLogFile(job));
      if (file) candidates.push({ job, file, mtimeMs: fs.statSync(file).mtimeMs, running: job.status === 'running' });
    } catch {
      // Việc có thể chưa tạo log hoặc file đã bị dọn.
    }
  }
  candidates.sort((a, b) => Number(b.running) - Number(a.running) || b.mtimeMs - a.mtimeMs);
  for (const { job, file, running } of candidates) {
    try {
      const tail = readTail(file);
      if (!tail) continue;
      const attempt = latestAttempt(tail.text);
      if (!attempt.text.trim()) continue;
      const info = {
        id: `job-${job.id}`, title: job.title, running,
        started_at: attempt.started_at || job.started_at,
        source: role === 'producer' ? 'codex-job' : 'claude-job',
      };
      if (role === 'producer') {
        entries.push(transcript(info, tail, codexMessages(attempt.text)));
      } else {
        const { messages, legacy, subagents } = claudeStream(attempt.text, !tail.truncated || !!attempt.started_at);
        if (!messages.length) continue;
        if (job.kind !== 'plan') {
          entries.push(transcript(info, tail, messages, legacy));
        } else {
          // Tách theo agent trước khi giới hạn số tin để các vai không cắt mất tin của nhau.
          for (const { parent_id, subagent_type } of subagents) {
            if (AGENT_ROLE[subagent_type] !== role) continue;
            const group = messages.filter((message) => message.parent_id === parent_id);
            if (group.length) entries.push(transcript({ ...info, id: `${info.id}:${parent_id}`, title: `Claude · ${subagent_type}` }, tail, group));
          }
          const root = messages.filter((message) => message.parent_id == null);
          if (root.length) coordinators.push(transcript({ ...info, id: `${info.id}:make-plan`, title: 'Phiên điều phối (make-plan)' }, tail, root, legacy));
        }
      }
      if (entries.length >= 3) break;
    } catch {
      // Log đang ghi dở hoặc đã biến mất: vẫn trả hoạt động từ DB.
    }
  }
  return { entries, coordinators };
}

function matchingCodexLog(file, role, fileRole, topicIds, topicFolders) {
  const sidecar = `${file}.meta.json`;
  try {
    fs.lstatSync(sidecar);
  } catch (error) {
    if (error.code !== 'ENOENT' || fileRole !== role) return null;
    const head = readHead(file);
    return head?.split(/[^\p{L}\p{N}_-]+/u).some((part) => topicFolders.has(part)) ? {} : null;
  }
  const data = readTail(sidecar, HEAD_BYTES);
  const meta = data && !data.truncated ? parseJson(data.text) : null;
  if (meta?.role !== role) return null;
  if (topicIds.has(meta.topic_id)) return meta;
  if (typeof meta.job_id !== 'number') return null;
  const job = S.sql.get('SELECT topic_id FROM jobs WHERE id=?', meta.job_id);
  return topicIds.has(job?.topic_id) ? meta : null;
}

function codexTranscripts(member, now) {
  const topics = S.sql.all('SELECT id,folder FROM topics WHERE team_id=?', member.team_id);
  if (!topics.length) return [];
  const topicIds = new Set(topics.map((topic) => topic.id));
  // Cả hai dấu phân cách thư mục đều kết thúc một từ khi dò tên chủ đề trong log cũ.
  const topicFolders = new Set(topics.filter((topic) => topic.folder).map((topic) => path.posix.basename(topic.folder.replaceAll('\\', '/'))));
  let names;
  try {
    names = fs.readdirSync(LOG_DIR);
  } catch {
    return [];
  }
  const candidates = [];
  for (const name of names) {
    if (!/^codex-.*\.log$/.test(name)) continue;
    const file = path.join(LOG_DIR, name);
    try {
      const resolved = allowedLogPath(file);
      if (resolved) candidates.push({ name, file, mtimeMs: fs.statSync(resolved).mtimeMs });
    } catch {
      // Log có thể biến mất trong lúc liệt kê.
    }
  }
  candidates.sort((a, b) => b.mtimeMs - a.mtimeMs || b.name.localeCompare(a.name));
  const entries = [];
  for (const { name, file } of candidates.slice(0, 40)) {
    try {
      const format = name.match(CODEX_FILENAME);
      if (!format) continue;
      const source = format[1] || format[4];
      const mode = format[2] || format[5];
      const fileRole = source === 'codex-ideate' ? 'idea' : mode === 'storyboard' ? 'visual' : 'script';
      const meta = matchingCodexLog(file, member.role, fileRole, topicIds, topicFolders);
      if (!meta) continue;
      const tail = readTail(file);
      if (!tail) continue;
      const attempt = latestAttempt(tail.text);
      if (!attempt.text.trim()) continue;
      const started = Date.parse(meta.started_at);
      const filenameTime = new Date(Number(format[3] || format[6]));
      entries.push(transcript({
        id: name.slice(0, -4), source, title: `Codex · ${mode}`,
        started_at: Number.isFinite(started) ? new Date(started).toISOString()
          : attempt.started_at || (Number.isFinite(+filenameTime) ? filenameTime.toISOString() : null),
        running: now - tail.mtimeMs < 90_000 && !/^\[thoát mã/m.test(attempt.text),
      }, tail, codexMessages(attempt.text)));
    } catch {
      // Sidecar hoặc log hỏng không làm mất sự kiện và việc của vị trí.
    }
  }
  return entries;
}

export function memberActivity(memberId) {
  const row = S.sql.get(`
    SELECT m.id,m.role,m.label,m.engine,m.status,m.task,m.video_id,m.updated_at,
           t.id AS team_id,t.name AS team_name,d.slug AS dept,d.name AS dept_name
    FROM members m JOIN teams t ON t.id=m.team_id JOIN departments d ON d.slug=t.dept
    WHERE m.id=?`, memberId);
  if (!row) throw new S.StudioError('Không tìm thấy vị trí');
  const now = Date.now();
  const { updated_at, ...member } = row;
  member.minutes_since_update = Math.round((now - Date.parse(updated_at)) / 60_000);
  member.duty = S.ROSTER.find(({ role }) => role === member.role)?.duty || '';
  const prefix = `${member.label}:`;
  const events = S.sql.all(`
    SELECT id,ts,actor,kind,message FROM events
    WHERE (team_id=? AND substr(message,1,length(?))=?) OR (video_id=? AND kind IN ('escalate','job'))
    ORDER BY id DESC LIMIT 60`, member.team_id, prefix, prefix, member.video_id).reverse();
  const jobs = memberJobs(member);
  const { entries, coordinators } = jobTranscripts(jobs, member.role);
  if (JOB_KIND[member.role] === 'plan') entries.push(...codexTranscripts(member, now));
  const transcripts = entries.sort(newestFirst).slice(0, 3);
  transcripts.push(...coordinators.sort(newestFirst).slice(0, 3 - transcripts.length));
  transcripts.sort(newestFirst);
  const onlyClaude = ['qc', 'rescue', 'scout'].includes(member.role);
  const note = transcripts.some((item) => item.legacy) ? LEGACY_NOTE
    : onlyClaude && !transcripts.length ? 'Chưa có log cho vị trí này' : null;
  return {
    generated_at: new Date(now).toISOString(),
    member, events,
    jobs: jobs.slice(0, 10).map(({ id, kind, status, title, provider, started_at, finished_at, attempts, last_error, summary }) => ({
      id, kind, status, title, provider, started_at, finished_at, attempts, last_error, summary,
    })),
    transcripts, note,
  };
}
