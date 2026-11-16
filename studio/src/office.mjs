// "Văn phòng 2D": khởi động whatsmyagentdoing (tools/whatsmyagentdoing, ghim v0.8.1) để xem mọi agent như đang ngồi trong văn phòng.
// - Chạy thẳng `node bin/cli.js` (KHÔNG qua skill /myoffice) => không tốn token, không sửa cấu hình Claude/Codex (chỉ đọc log).
// - Mỗi bản chỉ đọc 1 thư mục Claude + 1 thư mục Codex, nên tài khoản phụ (thư mục riêng) được ghép thành các bản bổ sung.
// - Tắt kiểm tra cập nhật (WMAD_NO_UPDATE_CHECK=1): không gọi mạng; cập nhật là việc thủ công, có kiểm tra (docs/office.md).
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import * as S from './db.mjs';
import * as P from './pool.mjs';

export const PINNED = { tag: 'v0.8.1', commit: 'c69bf2bc98cf96a63d146070e9bbc83b507bf0bf', repo: 'https://github.com/Charonyuu/whatsmyagentdoing' };
export const OFFICE_DIR = process.env.STUDIO_OFFICE_DIR || path.join(S.ROOT, 'tools', 'whatsmyagentdoing');
const CLI = () => path.join(OFFICE_DIR, 'bin', 'cli.js');
export const basePort = () => Number(process.env.STUDIO_OFFICE_PORT || 4545);
/** quality=mid là chế độ 2D; ghim trong URL để trình duyệt không nhớ nhầm sang 3D. */
export const officeUrl = (port) => `http://localhost:${port}/?view=office&quality=mid`;
export const installed = () => fs.existsSync(CLI());
export const installHint = () => `git clone --depth 1 --branch ${PINNED.tag} ${PINNED.repo} tools/whatsmyagentdoing`;

/** Hàm thuần: bản mặc định + (nếu có) các bản cho tài khoản có thư mục riêng, ghép Claude với Codex theo thứ tự. */
export function planInstances(accounts, { includeAccounts = true } = {}) {
  const out = [{ label: 'mặc định (đăng nhập của máy)', env: {} }];
  if (!includeAccounts) return out;
  const custom = (p) => accounts.filter((a) => a.provider === p && a.enabled && a.home);
  const cl = custom('claude');
  const cx = custom('codex');
  for (let i = 0; i < Math.max(cl.length, cx.length); i++) {
    const env = {};
    const names = [];
    if (cl[i]) (env.CLAUDE_CONFIG_DIR = cl[i].home), names.push(`claude/${cl[i].label}`);
    if (cx[i]) (env.CODEX_HOME = cx[i].home), names.push(`codex/${cx[i].label}`);
    out.push({ label: names.join(' + '), env });
  }
  return out;
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

export async function startOffice({ private: priv = false, hours = 24, includeAccounts = true, open = false } = {}) {
  if (!installed()) throw new S.StudioError(`Chưa cài Văn phòng 2D. Chạy: ${installHint()}`);
  let accounts = [];
  try {
    accounts = P.listAccounts();
  } catch {
    /* chưa có DB/tài khoản thì chỉ chạy bản mặc định */
  }
  const plan = planInstances(accounts, { includeAccounts });
  const logDir = path.join(path.dirname(S.DB_PATH), 'logs');
  fs.mkdirSync(logDir, { recursive: true });
  const results = [];
  for (let i = 0; i < plan.length; i++) {
    const want = basePort() + i;
    const inst = plan[i];
    if (await ping(want)) {
      results.push({ label: inst.label, port: want, url: officeUrl(want), started: false });
      continue;
    }
    const logFile = path.join(logDir, `office-${want}.log`);
    const fd = fs.openSync(logFile, 'a');
    const env = { ...process.env, WMAD_NO_UPDATE_CHECK: '1' };
    delete env.CLAUDE_CONFIG_DIR; // bản mặc định phải đọc ~/.claude, không thừa kế biến của phiên đang chạy
    delete env.CODEX_HOME;
    Object.assign(env, inst.env);
    const args = [CLI(), '--no-open', '--port', String(want), '--hours', String(hours), ...(priv ? ['--private'] : [])];
    const child = spawn(process.execPath, args, { detached: true, stdio: ['ignore', fd, fd], windowsHide: true, cwd: OFFICE_DIR, env });
    child.unref();
    fs.closeSync(fd);
    // Cổng có thể bị chiếm: whatsmyagentdoing tự dời sang cổng kế tiếp và in ra dòng "→ http://localhost:<cổng>".
    let port = want;
    let up = false;
    for (let t = 0; t < 24 && !up; t++) {
      await sleep(250);
      up = await ping(want);
      if (!up) {
        const m = /→ http:\/\/localhost:(\d+)/.exec(fs.readFileSync(logFile, 'utf8').split('\n').slice(-12).join('\n'));
        if (m && (await ping(Number(m[1])))) {
          port = Number(m[1]);
          up = true;
        }
      }
    }
    if (!up) results.push({ label: inst.label, port: want, url: null, started: false, error: `không lên được — xem ${logFile}` });
    else results.push({ label: inst.label, port, url: officeUrl(port), started: true, pid: child.pid });
  }
  S.logEvent({ actor: 'system', kind: 'office', message: `Văn phòng 2D: ${results.filter((r) => r.url).length}/${results.length} bản đang chạy` });
  const first = results.find((r) => r.url);
  if (open && first) openBrowser(first.url);
  return { results, private: priv };
}

export async function stopOffice() {
  if (!installed()) return { stopped: 'chưa cài' };
  const r = spawnSync(process.execPath, [CLI(), '--stop', '--port', String(basePort())], { encoding: 'utf8', env: { ...process.env, WMAD_NO_UPDATE_CHECK: '1' }, cwd: OFFICE_DIR, windowsHide: true });
  return { stopped: (r.stdout || '').trim() };
}

export async function officeStatus() {
  const ports = [];
  for (let p = basePort(); p <= basePort() + 10; p++) if (await ping(p)) ports.push({ port: p, url: officeUrl(p) });
  return { installed: installed(), version: PINNED.tag, running: ports };
}
