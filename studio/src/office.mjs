// "Văn phòng 2D": khởi động whatsmyagentdoing (tools/whatsmyagentdoing, ghim v0.8.1) để xem mọi agent như đang ngồi trong văn phòng.
// - Chạy thẳng `node bin/cli.js` (KHÔNG qua skill /myoffice) => không tốn token, không sửa cấu hình Claude/Codex (chỉ đọc log).
// - Mỗi bản chỉ đọc 1 thư mục Claude + 1 thư mục Codex, nên tài khoản phụ (thư mục riêng) được ghép thành các bản bổ sung.
// - Tắt kiểm tra cập nhật (WMAD_NO_UPDATE_CHECK=1): không gọi mạng; cập nhật là việc thủ công, có kiểm tra (docs/office.md).
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawn } from 'node:child_process';
import * as S from './db.mjs';
import * as P from './pool.mjs';
import { encodeSeats, seatsFor } from './office-roles.mjs';

export const PINNED = { tag: 'v0.8.1', commit: 'c69bf2bc98cf96a63d146070e9bbc83b507bf0bf', repo: 'https://github.com/Charonyuu/whatsmyagentdoing' };
export const OFFICE_DIR = process.env.STUDIO_OFFICE_DIR || path.join(S.ROOT, 'tools', 'whatsmyagentdoing');
const CLI = () => path.join(OFFICE_DIR, 'bin', 'cli.js');
export const basePort = () => Number(process.env.STUDIO_OFFICE_PORT || 4545);
/** quality=mid là chế độ 2D; ghim trong URL để trình duyệt không nhớ nhầm sang 3D. */
export const officeUrl = (port) => `http://localhost:${port}/?view=office&quality=mid`;
export const installed = () => fs.existsSync(CLI());
export const installHint = () => `git clone --depth 1 --branch ${PINNED.tag} ${PINNED.repo} tools/whatsmyagentdoing`;

const DEFAULT_DIRS = () => ({ claude: path.join(os.homedir(), '.claude'), codex: path.join(os.homedir(), '.codex') });
const EMPTY_DIRS = () => {
  const base = path.join(path.dirname(S.DB_PATH), 'office-empty');
  const d = { claude: path.join(base, 'claude'), codex: path.join(base, 'codex') };
  for (const x of Object.values(d)) fs.mkdirSync(x, { recursive: true });
  return d;
};
const acctKey = (a) => `${a.provider}/${a.label}`;
/** Hiển thị cho người: email đăng nhập là chính, nhãn ghế chỉ để phân biệt. */
export const acctPerson = (a) => `${a.provider === 'claude' ? 'Claude' : 'Codex'} ${a.email || '(chưa đăng nhập)'} [ghế ${a.label}]`;
const slugify = (x) => String(x).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'x';

/** Hàm thuần: MỖI PHÒNG BAN 1 BẢN văn phòng, chỉ đọc đúng các tài khoản đã cấp cho phòng đó (giám đốc chốt 18/11/2026).
 *  Tài khoản chưa cấp cho phòng nào (dùng chung) KHÔNG được theo dõi. Phòng có >1 tài khoản Claude (hoặc Codex) thì
 *  thêm bản VP-<phòng>-2, -3… (mỗi bản chỉ đọc được 1 thư mục Claude + 1 thư mục Codex; ghép theo thứ tự).
 *  Bản thiếu Claude hoặc Codex trỏ vào thư mục rỗng, để không lộ phiên của tài khoản ngoài phòng (vd đăng nhập mặc định của máy).
 *  Tên (VP-it, VP-sport…) cố định theo phòng; cổng chỉ là chỗ đang mở. */
export function planInstances(accounts, departments = [], { defaultDirs = DEFAULT_DIRS(), emptyDirs = EMPTY_DIRS() } = {}) {
  const out = [];
  const dsOf = (a) => a.depts ?? (a.dept ? [a.dept] : []); // một tài khoản có thể thuộc nhiều phòng (21/11/2026)
  const on = accounts.filter((a) => a.enabled && dsOf(a).length);
  const slugs = [...new Set(on.flatMap(dsOf))].sort();
  for (const slug of slugs) {
    const d = departments.find((x) => x.slug === slug);
    const deptName = d?.name || slug;
    const cl = on.filter((a) => dsOf(a).includes(slug) && a.provider === 'claude');
    const cx = on.filter((a) => dsOf(a).includes(slug) && a.provider === 'codex');
    for (let i = 0; i < Math.max(cl.length, cx.length); i++) {
      const pair = [cl[i], cx[i]].filter(Boolean);
      const accts = pair.map(acctKey);
      const people = pair.map(acctPerson);
      const env = {
        CLAUDE_CONFIG_DIR: cl[i] ? cl[i].home || defaultDirs.claude : emptyDirs.claude,
        CODEX_HOME: cx[i] ? cx[i].home || defaultDirs.codex : emptyDirs.codex,
      };
      const name = `VP-${slugify(slug)}${i ? `-${i + 1}` : ''}`;
      // Chỗ ngồi cố định (giám đốc yêu cầu 18/11/2026): bản chính của phòng (đang mở) luôn hiện đủ các vị trí core của đội,
      // rảnh thì ngồi chờ; thêm "Tìm chủ đề" khi phòng bật tự tìm chủ đề. Vị trí mà phòng chưa được cấp tài khoản tương ứng
      // thì ghi "chưa theo dõi" (không giả vờ rảnh). Bản phụ (-2…) chỉ hiện phiên có thật.
      const seats = i === 0 && d?.status !== 'closed' ? encodeSeats(seatsFor({ scout: !!d?.auto_topics, tracked: { claude: !!cl[i], codex: !!cx[i] } })) : '';
      out.push({ name, dept: slug, dept_name: deptName, dept_closed: d?.status === 'closed', title: `Phòng ${deptName}`, label: `${name} — phòng ${deptName}${d?.status === 'closed' ? ' (đã đóng)' : ''}: ${people.join(' + ')}`, accounts: accts, people, env, seats });
    }
  }
  return out;
}

/** Sổ "tên bản → cổng đang mở", ghi mỗi lần bật để status/dashboard biết cổng nào là bản nào. */
const registryFile = () => path.join(path.dirname(S.DB_PATH), 'logs', 'office-instances.json');
function readRegistry() {
  try {
    return JSON.parse(fs.readFileSync(registryFile(), 'utf8'));
  } catch {
    return [];
  }
}
function safeDepartments() {
  try {
    return S.sql.all('SELECT slug,name,status,auto_topics FROM departments');
  } catch {
    return [];
  }
}
function safeAccounts() {
  try {
    return P.listAccounts();
  } catch {
    return [];
  }
}

/** Danh bạ (đồng bộ, không ping): từng bản theo tên + cổng (theo sổ lần bật gần nhất, không có thì là cổng dự kiến). */
export function officeDirectory(accounts = safeAccounts(), departments = safeDepartments()) {
  const reg = readRegistry();
  return planInstances(accounts, departments, { emptyDirs: { claude: '', codex: '' } }).map((inst, i) => {
    const r = reg.find((x) => x.name === inst.name);
    const port = r?.port ?? basePort() + i;
    return { name: inst.name, dept: inst.dept, dept_name: inst.dept_name, label: inst.label, accounts: inst.accounts, people: inst.people, port, url: officeUrl(port), port_known: !!r };
  });
}

/** Phòng ban nào đang có việc chạy ở bản văn phòng nào (theo tài khoản worker đang dùng cho việc đó). */
export function departmentsByInstance(directory, accounts = safeAccounts()) {
  const byId = new Map(accounts.map((a) => [a.id, acctKey(a)]));
  const depts = S.sql.all("SELECT slug,name FROM departments WHERE status='active' ORDER BY created_at");
  const running = S.sql.all("SELECT id,kind,dept,account_id FROM jobs WHERE status='running' AND account_id IS NOT NULL");
  return depts.map((d) => {
    const jobs = running.filter((j) => j.dept === d.slug);
    const where = [...new Set(jobs.map((j) => directory.find((x) => x.accounts.includes(byId.get(j.account_id)))?.name).filter(Boolean))];
    return { slug: d.slug, name: d.name, running_jobs: jobs.length, office: directory.filter((x) => x.dept === d.slug).map((x) => x.name), instances: where };
  });
}

export function ping(port, ms = 800) {
  return new Promise((resolve) => {
    const req = http.get({ host: '127.0.0.1', port, path: '/api/ping', timeout: ms }, (res) => {
      let b = '';
      res.on('data', (c) => (b += c));
      res.on('end', () => resolve(b.includes('whatsmyagentdoing')));
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function openBrowser(url) {
  try {
    const [cmd, args] = process.platform === 'win32' ? ['rundll32', ['url.dll,FileProtocolHandler', url]] : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
    spawn(cmd, args, { stdio: 'ignore', detached: true }).on('error', () => {}).unref();
  } catch {
    /* không mở được trình duyệt thì thôi, URL vẫn được in ra */
  }
}

/** Bản gốc (whatsmyagentdoing) chạy ở cổng nội bộ = cổng công khai + 100; cổng công khai là lớp chuyển tiếp
 *  office-proxy.mjs, chèn tên phòng vào tiêu đề tab + dải tiêu đề trên trang (không sửa mã công cụ đã ghim). */
export const INTERNAL_OFFSET = 100;
const PROXY = path.join(path.dirname(fileURLToPath(import.meta.url)), 'office-proxy.mjs');
// Tăng khi đổi cách lớp chuyển tiếp hiển thị (vd nhận vai bộ core) để lần bật sau tự thay bản cũ.
const PROXY_VERSION = 5; // 4: chỗ ngồi cố định cho các vị trí core (--seats); 5: bản có chỗ ngồi ẩn phiên ngoài xưởng
const sig = (x) => `${x.name}|${(x.accounts || []).join(',')}|${x.label}|${x.seats || ''}|v${x.v}`;

async function waitDown(port) {
  for (let t = 0; t < 12 && (await ping(port, 300)); t++) await sleep(200);
  await sleep(250);
}

async function waitUp(port, logFile) {
  for (let t = 0; t < 24; t++) {
    await sleep(250);
    if (await ping(port)) return port;
    // Cổng có thể bị chiếm: whatsmyagentdoing tự dời sang cổng kế tiếp và in ra dòng "→ http://localhost:<cổng>".
    const m = logFile && /→ http:\/\/localhost:(\d+)/.exec(fs.readFileSync(logFile, 'utf8').split('\n').slice(-12).join('\n'));
    if (m && (await ping(Number(m[1])))) return Number(m[1]);
  }
  return null;
}

function spawnLogged(args, { env, cwd, logFile }) {
  const fd = fs.openSync(logFile, 'a');
  const child = spawn(process.execPath, args, { detached: true, stdio: ['ignore', fd, fd], windowsHide: true, cwd, env });
  child.unref();
  fs.closeSync(fd);
  return child;
}

export async function startOffice({ private: priv = false, hours = 24, open = false } = {}) {
  if (!installed()) throw new S.StudioError(`Chưa cài Văn phòng 2D. Chạy: ${installHint()}`);
  const plan = planInstances(safeAccounts(), safeDepartments());
  const info = (inst) => ({ name: inst.name, dept: inst.dept, dept_name: inst.dept_name, title: inst.title, label: inst.label, accounts: inst.accounts, people: inst.people, seats: inst.seats || '' });
  // Tắt các bản đang chạy mà không còn đúng kế hoạch (bản cũ theo tài khoản, tài khoản vừa trả về dùng chung, đổi email/tên phòng…),
  // để cổng không bị bản cũ chiếm và tài khoản không cấp cho phòng nào thì không còn bị theo dõi.
  const reg = readRegistry();
  const kept = new Set();
  for (let p = basePort(); p <= basePort() + 10; p++) {
    if (!(await ping(p))) continue;
    const r = reg.find((x) => x.port === p);
    if (r && r.internal && plan.findIndex((x) => sig({ ...x, v: PROXY_VERSION }) === sig({ ...r, v: r.v ?? 1 })) === p - basePort()) kept.add(r.internal);
    else (await shutdownAt(p), await waitDown(p));
  }
  for (let p = basePort() + INTERNAL_OFFSET; p <= basePort() + INTERNAL_OFFSET + 10; p++) if (!kept.has(p) && (await ping(p))) (await shutdownAt(p), await waitDown(p));

  const logDir = path.join(path.dirname(S.DB_PATH), 'logs');
  fs.mkdirSync(logDir, { recursive: true });
  const results = [];
  for (let i = 0; i < plan.length; i++) {
    const pub = basePort() + i;
    const inst = plan[i];
    const old = reg.find((x) => x.port === pub);
    if (old && kept.has(old.internal) && (await ping(pub))) {
      results.push({ ...info(inst), port: pub, internal: old.internal, url: officeUrl(pub), started: false });
      continue;
    }
    // 1) bản gốc ở cổng nội bộ
    const wantInt = pub + INTERNAL_OFFSET;
    const intLog = path.join(logDir, `office-${wantInt}.log`);
    const env = { ...process.env, WMAD_NO_UPDATE_CHECK: '1', ...inst.env }; // luôn đặt cả 2 thư mục, không thừa kế biến của phiên đang chạy
    spawnLogged([CLI(), '--no-open', '--port', String(wantInt), '--hours', String(hours), ...(priv ? ['--private'] : [])], { env, cwd: OFFICE_DIR, logFile: intLog });
    const internal = await waitUp(wantInt, intLog);
    if (!internal) {
      results.push({ ...info(inst), port: pub, url: null, started: false, error: `không lên được — xem ${intLog}` });
      continue;
    }
    // 2) lớp chuyển tiếp có tên phòng ở cổng công khai
    const pxLog = path.join(logDir, `office-${pub}.log`);
    const px = spawnLogged([PROXY, '--port', String(pub), '--target', String(internal), '--title', inst.title, '--name', inst.name, '--accounts', inst.people.join(' + '), '--claude-dir', inst.env.CLAUDE_CONFIG_DIR, '--codex-dir', inst.env.CODEX_HOME, ...(inst.seats ? ['--seats', inst.seats] : [])], { env: process.env, cwd: path.dirname(PROXY), logFile: pxLog });
    if (!(await waitUp(pub))) {
      await shutdownAt(internal);
      results.push({ ...info(inst), port: pub, url: null, started: false, error: `cổng ${pub} bị chiếm hoặc lớp chuyển tiếp lỗi — xem ${pxLog}` });
      continue;
    }
    results.push({ ...info(inst), port: pub, internal, url: officeUrl(pub), started: true, pid: px.pid });
  }
  try {
    fs.writeFileSync(registryFile(), JSON.stringify(results.filter((r) => r.url).map(({ name, label, accounts: ac, seats, port, internal }) => ({ name, label, accounts: ac, seats, port, internal, v: PROXY_VERSION })), null, 2));
  } catch {
    /* không ghi được sổ thì status vẫn dò cổng được, chỉ thiếu tên */
  }
  S.logEvent({ actor: 'system', kind: 'office', message: `Văn phòng 2D: ${results.filter((r) => r.url).map((r) => `${r.name} :${r.port}`).join(', ') || 'không bản nào'} (${results.filter((r) => r.url).length}/${results.length} bản chạy)` });
  if (!plan.length) S.logEvent({ actor: 'system', kind: 'office', message: 'Văn phòng 2D: chưa có tài khoản nào được cấp cho phòng ban — không có bản nào để theo dõi' });
  const first = results.find((r) => r.url);
  if (open && first) openBrowser(first.url);
  return { results, private: priv };
}

function shutdownAt(port) {
  return new Promise((resolve) => {
    const req = http.request({ host: '127.0.0.1', port, path: '/api/shutdown', method: 'POST', timeout: 1500, headers: { 'x-whatsmyagentdoing': 'stop' } }, (res) => {
      res.resume();
      setTimeout(() => resolve(res.statusCode === 200), 300);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

export async function stopOffice() {
  if (!installed()) return { stopped: 'chưa cài' };
  const stopped = [];
  for (const base of [basePort(), basePort() + INTERNAL_OFFSET])
    for (let p = base; p <= base + 10; p++) if ((await ping(p, 400)) && (await shutdownAt(p))) stopped.push(p);
  return { stopped: stopped.length ? `Đã dừng cổng ${stopped.join(', ')}` : 'Không có bản nào đang chạy.' };
}

export async function officeStatus() {
  const directory = officeDirectory();
  const reg = readRegistry();
  const running = [];
  for (let p = basePort(); p <= basePort() + 10; p++) {
    if (!(await ping(p))) continue;
    const r = reg.find((x) => x.port === p);
    const d = r && directory.find((x) => x.name === r.name);
    running.push({ port: p, url: officeUrl(p), name: r?.name || '(không rõ — bật lại bằng npm run office)', label: d?.label || r?.label || '', accounts: d?.accounts || r?.accounts || [] });
  }
  return { installed: installed(), version: PINNED.tag, running, directory, departments: departmentsByInstance(directory) };
}
