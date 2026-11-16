// Dashboard của giám đốc: xem trực tiếp ai đang làm gì + duyệt đề xuất + mở/đóng phòng.
// Chỉ lắng nghe 127.0.0.1 (không ra mạng). Mọi thao tác ghi đều là quyết định của giám đốc.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as S from './db.mjs';
import * as P from './pool.mjs';
import * as O from './office.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.STUDIO_PORT || 4747);
const HOST = '127.0.0.1';
const INDEX = path.join(here, '..', 'public', 'index.html');
const CHECKLIST = path.join(here, '..', '..', 'docs', 'CHECKLIST.md');

// Checklist của team: đọc/đánh dấu các dòng "- [ ]" trong docs/CHECKLIST.md
function readChecklist() {
  if (!fs.existsSync(CHECKLIST)) return [];
  let section = '';
  const out = [];
  fs.readFileSync(CHECKLIST, 'utf8').split(/\r?\n/).forEach((line, i) => {
    const h = /^#{2,3}\s+(.*)/.exec(line);
    if (h) section = h[1];
    const m = /^(\s*)- \[( |x|X)\]\s+(.*)/.exec(line);
    if (m) out.push({ line: i, section, done: m[2] !== ' ', text: m[3] });
  });
  return out;
}
function toggleChecklist(line) {
  const text = fs.readFileSync(CHECKLIST, 'utf8');
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);
  const m = /^(\s*- \[)( |x|X)(\]\s.*)/.exec(lines[line] ?? '');
  if (!m) throw new S.StudioError('Dòng checklist không hợp lệ');
  lines[line] = `${m[1]}${m[2] === ' ' ? 'x' : ' '}${m[3]}`;
  fs.writeFileSync(CHECKLIST, lines.join(eol));
  return readChecklist();
}
function fullOverview() {
  const o = S.overview();
  const pool = P.poolOverview();
  return { ...o, attention: [...pool.attention, ...o.attention], pool };
}

const send = (res, code, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > 100_000) {
        reject(new S.StudioError('Dữ liệu quá lớn'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {});
      } catch {
        reject(new S.StudioError('JSON không hợp lệ'));
      }
    });
    req.on('error', reject);
  });
}

// Chặn DNS-rebinding / CSRF: Host phải là localhost; POST phải là JSON và (nếu có Origin) cùng nguồn.
function guard(req) {
  const host = (req.headers.host || '').toLowerCase();
  if (host !== `localhost:${PORT}` && host !== `127.0.0.1:${PORT}`) throw new S.StudioError('Host không hợp lệ');
  if (req.method === 'POST') {
    if (!String(req.headers['content-type'] || '').startsWith('application/json')) throw new S.StudioError('Cần Content-Type: application/json');
    const origin = req.headers.origin;
    if (origin && origin !== `http://${host}`) throw new S.StudioError('Origin không hợp lệ');
  }
}

async function route(req, res) {
  guard(req);
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = url.pathname;
  if (req.method === 'GET' && (p === '/' || p === '/index.html')) return send(res, 200, fs.readFileSync(INDEX), 'text/html; charset=utf-8');
  if (req.method === 'GET' && p === '/api/overview') return send(res, 200, fullOverview());
  if (req.method === 'GET' && p === '/api/checklist') return send(res, 200, readChecklist());
  if (req.method === 'GET' && p === '/api/health') return send(res, 200, { ok: true });
  if (req.method !== 'POST') return send(res, 404, { error: 'Không tìm thấy' });

  const body = await readJson(req);
  let m;
  if ((m = p.match(/^\/api\/proposals\/(\d+)\/(approve|reject)$/))) return send(res, 200, S.decideProposal({ id: Number(m[1]), approve: m[2] === 'approve', by: 'director', note: body.note || '' }));
  if (p === '/api/departments') return send(res, 200, S.createDepartment({ ...body, by: 'director' }));
  if ((m = p.match(/^\/api\/departments\/([a-z0-9-]+)\/(target|close|reopen)$/))) {
    if (m[2] === 'target') return send(res, 200, S.setDailyTarget({ slug: m[1], target: body.target, by: 'director' }));
    if (m[2] === 'close') return send(res, 200, S.closeDepartment({ slug: m[1], force: !!body.force, by: 'director' }));
    return send(res, 200, S.reopenDepartment({ slug: m[1], initial_teams: body.initial_teams ?? 1, by: 'director' }));
  }
  if (p === '/api/topics') return send(res, 200, S.submitTopic({ ...body, by: 'director' }));
  if (p === '/api/accounts') return send(res, 200, P.addAccount({ provider: body.provider, label: body.label, owner: body.owner || '', kind: body.kind || 'subscription', useDefault: !!body.useDefault, secret_file: body.secret_file || null, by: 'director' }));
  if ((m = p.match(/^\/api\/accounts\/(\d+)\/(enable|disable|unlimit|remove)$/))) {
    const id = Number(m[1]);
    if (m[2] === 'unlimit') return send(res, 200, P.clearLimit(id));
    if (m[2] === 'remove') return send(res, 200, P.removeAccount(id));
    return send(res, 200, P.setAccountEnabled(id, m[2] === 'enable'));
  }
  if ((m = p.match(/^\/api\/jobs\/(\d+)\/(cancel|retry)$/))) return send(res, 200, m[2] === 'cancel' ? P.cancelJob(Number(m[1])) : P.retryJob(Number(m[1])));
  if ((m = p.match(/^\/api\/videos\/([A-Za-z0-9-]+)\/produce$/))) return send(res, 200, { ...P.enqueueJob({ kind: 'produce', video_id: m[1], by: 'director' }), worker: P.ensureWorker() });
  if (p === '/api/settings') return send(res, 200, P.setSetting(body.key, body.value));
  if (p === '/api/worker/start') return send(res, 200, P.ensureWorker());
  if (p === '/api/office/start') return send(res, 200, await O.startOffice({ private: !!body.private, open: false }));
  if (p === '/api/checklist/toggle') return send(res, 200, toggleChecklist(Number(body.line)));
  return send(res, 404, { error: 'Không tìm thấy' });
}

const server = http.createServer((req, res) => {
  route(req, res).catch((e) => {
    const known = e instanceof S.StudioError;
    send(res, known ? 400 : 500, { error: known ? e.message : `Lỗi nội bộ: ${e.message}` });
  });
});
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') console.error(`Cổng ${PORT} đang được dùng — có thể dashboard đã chạy sẵn: http://localhost:${PORT}`);
  else console.error(e);
  process.exit(1);
});
server.listen(PORT, HOST, () => console.log(`Dashboard giám đốc: http://localhost:${PORT}   (DB: ${S.DB_PATH})`));
