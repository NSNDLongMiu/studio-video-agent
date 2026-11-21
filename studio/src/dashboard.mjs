// Dashboard của giám đốc: xem trực tiếp ai đang làm gì + duyệt đề xuất + mở/đóng phòng.
// Chỉ lắng nghe 127.0.0.1 (không ra mạng). Mọi thao tác ghi đều là quyết định của giám đốc.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as S from './db.mjs';
import * as P from './pool.mjs';
import * as O from './office.mjs';
import * as R from './runners.mjs';
import { memberActivity } from './transcript.mjs';
import { buildTikTokPack } from './publish-pack.mjs';
import { spawn } from 'node:child_process';

// ---------- nút "Kiểm tra lại" ở khung "Cần giám đốc chú ý" ----------
/** Kiểm lại 1 tài khoản ngay: đăng nhập thật (claude auth status / codex login status) và, nếu probe, gọi thử 1 câu cực ngắn
 *  (tốn rất ít hạn mức) để biết đã hồi limit chưa. Cập nhật trạng thái trong kho → worker tự chạy tiếp việc đang chờ. */
async function recheckAccount(a, { probe = false } = {}) {
  const st = R.checkAuth(a);
  if (!st.loggedIn) {
    P.markAuthError(a.id, st.detail);
    return `✖ ${a.person}: chưa đăng nhập — ${a.login}`;
  }
  if (a.status === 'auth_error') P.clearLimit(a.id);
  if (!probe || a.status !== 'limited') return `✔ ${a.person}: đã đăng nhập${a.status === 'auth_error' ? ' — đã đánh dấu sẵn sàng, việc đang chờ sẽ tự chạy' : ''}`;
  const pr = await R.probeAccount(a);
  if (pr.ok) {
    P.clearLimit(a.id);
    P.markSuccess(a.id);
    return `✔ ${a.person}: đã hồi limit — việc đang chờ sẽ tự chạy`;
  }
  if (pr.type === 'limit') return `⏳ ${a.person}: vẫn hết limit, hồi lúc ${P.markLimited(a.id, { until: pr.resetAt, raw: pr.raw }).toLocaleString('vi-VN')}`;
  return `✖ ${a.person}: gọi thử thất bại — ${String(pr.raw || '').slice(0, 160)}`;
}

/** Kiểm lại theo loại mục; mục chỉ là số liệu (thiếu năng lực, im lặng, cần hỗ trợ, đề xuất…) thì tính lại ngay khi tải lại. */
async function recheckAttention(item = {}) {
  const accounts = P.listAccounts().filter((a) => a.enabled);
  const lines = [];
  if (item.kind === 'auth') {
    const a = accounts.find((x) => x.id === Number(item.account_id));
    if (!a) return { lines: ['Tài khoản không còn trong kho hoặc đã tắt'] };
    lines.push(await recheckAccount(a));
  } else if (item.kind === 'no_account' || item.kind === 'limit_wait') {
    const list = accounts.filter((a) => a.provider === item.provider && a.status !== 'ready');
    for (const a of list) lines.push(await recheckAccount(a, { probe: true }));
    if (!list.length) lines.push(`Mọi tài khoản ${item.provider} đang bật đều sẵn sàng`);
    P.wakeJobs(item.provider);
  } else if (item.kind === 'worker') {
    const w = P.ensureWorker();
    lines.push(w.alive || w.started ? '✔ Worker đang chạy' : '✖ Chưa bật được worker — chạy: npm run start --prefix studio');
  } else lines.push('Đã tính lại số liệu');
  S.logEvent({ actor: 'director', kind: 'recheck', message: `Kiểm tra lại "${item.kind || 'tất cả'}": ${lines.join(' · ').slice(0, 300)}` });
  return { lines };
}

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
  return { ...o, attention: [...pool.attention, ...o.attention], pool, office: O.officeDirectory(), ready_videos: S.readyVideos() };
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
  const packReq = req.method === 'GET' && p.match(/^\/api\/videos\/([A-Za-z0-9-]+)\/pack\/tiktok$/);
  if (packReq) return send(res, 200, buildTikTokPack(packReq[1])); // chỉ đọc: dựng gói đăng, không đăng gì
  const activity = req.method === 'GET' && p.match(/^\/api\/members\/(\d+)\/activity$/);
  if (activity) {
    try {
      return send(res, 200, memberActivity(Number(activity[1])));
    } catch (e) {
      if (e instanceof S.StudioError && e.message === 'Không tìm thấy vị trí') return send(res, 404, { error: e.message });
      throw e;
    }
  }
  if (req.method !== 'POST') return send(res, 404, { error: 'Không tìm thấy' });

  const body = await readJson(req);
  let m;
  if ((m = p.match(/^\/api\/proposals\/(\d+)\/(approve|reject)$/))) return send(res, 200, S.decideProposal({ id: Number(m[1]), approve: m[2] === 'approve', by: 'director', note: body.note || '' }));
  if (p === '/api/departments') return send(res, 200, S.createDepartment({ ...body, by: 'director' }));
  if ((m = p.match(/^\/api\/departments\/([a-z0-9-]+)\/auto-topics$/))) return send(res, 200, S.setAutoTopics({ dept: m[1], on: !!body.on, by: 'director' }));
  if ((m = p.match(/^\/api\/topics\/(\d+)\/(approve|reject)$/))) {
    // Duyệt = giao NGAY cho đội đang rảnh nhất (lần lượt, ưu tiên đội chưa có việc) và xếp việc kế hoạch (Ý tưởng → Kịch bản → Đạo diễn hình ảnh); từ chối thì chỉ đổi trạng thái.
    if (m[2] === 'approve') return send(res, 200, { ...P.approveTopic({ topic_id: Number(m[1]), note: body.note || '', by: 'director' }), worker: P.ensureWorker() });
    return send(res, 200, S.decideTopic({ topic_id: Number(m[1]), approve: false, note: body.note || '', by: 'director' }));
  }
  if ((m = p.match(/^\/api\/departments\/([a-z0-9-]+)\/(target|close|reopen)$/))) {
    if (m[2] === 'target') return send(res, 200, S.setDailyTarget({ slug: m[1], target: body.target, by: 'director' }));
    if (m[2] === 'close') return send(res, 200, S.closeDepartment({ slug: m[1], force: !!body.force, by: 'director' }));
    return send(res, 200, S.reopenDepartment({ slug: m[1], initial_teams: body.initial_teams ?? 1, by: 'director' }));
  }
  if (p === '/api/topics') return send(res, 200, S.submitTopic({ ...body, by: 'director' }));
  if (p === '/api/accounts') return send(res, 200, P.addAccount({ provider: body.provider, label: body.label, owner: body.owner || '', kind: body.kind || 'subscription', useDefault: !!body.useDefault, secret_file: body.secret_file || null, by: 'director' }));
  if ((m = p.match(/^\/api\/accounts\/(\d+)\/assign$/))) return send(res, 200, P.assignAccount(Number(m[1]), body.depts ?? body.dept ?? null));
  if ((m = p.match(/^\/api\/accounts\/(\d+)\/(enable|disable|unlimit|remove)$/))) {
    const id = Number(m[1]);
    if (m[2] === 'unlimit') return send(res, 200, P.clearLimit(id));
    if (m[2] === 'remove') return send(res, 200, P.removeAccount(id));
    return send(res, 200, P.setAccountEnabled(id, m[2] === 'enable'));
  }
  if ((m = p.match(/^\/api\/jobs\/(\d+)\/(cancel|retry)$/))) return send(res, 200, m[2] === 'cancel' ? P.cancelJob(Number(m[1])) : P.retryJob(Number(m[1])));
  if ((m = p.match(/^\/api\/jobs\/(\d+)\/takeover$/))) return send(res, 200, { ...(body.by === 'off' ? P.revokeTakeover(Number(m[1])) : P.approveTakeover({ job_id: Number(m[1]), by: body.by || 'claude', note: body.note || '' })), worker: P.ensureWorker() });
  if ((m = p.match(/^\/api\/videos\/([A-Za-z0-9-]+)\/published$/))) {
    // Giám đốc ĐÃ TỰ ĐĂNG video lên nền tảng (luật 9) và báo lại bằng nút này → published. Hệ thống không đăng bài.
    const v = S.getVideo(m[1]);
    if (v.stage !== 'ready') throw new S.StudioError(`${v.id} đang ở "${v.stage}", chỉ video "ready" mới đổi sang published được`);
    return send(res, 200, S.setVideoStage({ video_id: v.id, stage: 'published', note: 'giám đốc đã tự đăng (bấm trên dashboard)', by: 'director' }));
  }
  if ((m = p.match(/^\/api\/videos\/([A-Za-z0-9-]+)\/open-folder$/))) {
    // Mở thư mục final/ của video trong Explorer (chỉ Windows, chỉ thư mục final của chính video này) để kéo file vào trang tải lên của TikTok.
    const pack = buildTikTokPack(m[1]);
    const target = pack.files.video?.path || pack.files.cover?.path;
    if (!target) throw new S.StudioError(`${pack.video_id} chưa có file nào trong final/`);
    if (process.platform !== 'win32') throw new S.StudioError('Nút mở thư mục chỉ chạy trên Windows; dùng đường dẫn đã hiện');
    spawn('explorer.exe', [`/select,${target}`], { detached: true, stdio: 'ignore', windowsHide: false }).unref();
    return send(res, 200, { opened: path.dirname(target) });
  }
  if ((m = p.match(/^\/api\/videos\/([A-Za-z0-9-]+)\/accept$/))) {
    // Giám đốc đã nghe/xem xong video QC giữ ở "review" (QC-CHỜ-NGHE hoặc chấp nhận lỗi thiết kế) → sẵn sàng đăng. Chỉ giám đốc bấm; không đăng bài (luật 9).
    const v = S.getVideo(m[1]);
    if (v.stage !== 'review') throw new S.StudioError(`${v.id} đang ở "${v.stage}", chỉ video đang ở "review" mới duyệt sang sẵn sàng đăng được`);
    return send(res, 200, S.setVideoStage({ video_id: v.id, stage: 'ready', note: 'giám đốc đã nghe/xem và duyệt (bấm trên dashboard)', by: 'director' }));
  }
  if ((m = p.match(/^\/api\/videos\/([A-Za-z0-9-]+)\/produce$/))) return send(res, 200, { ...P.enqueueJob({ kind: 'produce', video_id: m[1], by: 'director' }), worker: P.ensureWorker() });
  if (p === '/api/settings') return send(res, 200, P.setSetting(body.key, body.value));
  if (p === '/api/worker/start') return send(res, 200, P.ensureWorker());
  if (p === '/api/attention/recheck') {
    if (body.all) {
      const items = fullOverview().attention;
      const seen = new Set();
      const lines = [];
      for (const it of items) {
        const key = `${it.kind}|${it.account_id || ''}|${it.provider || ''}`; // gộp mục trùng (vd no_account + auth cùng tài khoản)
        if (seen.has(key)) continue;
        seen.add(key);
        if (['auth', 'no_account', 'limit_wait', 'worker'].includes(it.kind)) lines.push(...(await recheckAttention(it)).lines);
      }
      return send(res, 200, { lines: lines.length ? lines : ['Đã tính lại số liệu'] });
    }
    return send(res, 200, await recheckAttention(body));
  }
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
