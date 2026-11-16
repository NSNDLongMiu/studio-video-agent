// CLI của xưởng:  node studio/src/cli.mjs <lệnh>   (hoặc npm run <lệnh> --prefix studio)
//   status [phòng]                         tổng quan: ai đang làm gì, tài khoản, hàng đợi
//   start                                  dashboard + worker nền trong 1 tiến trình (khuyên dùng)
//   worker | worker stop                   chỉ worker / dừng worker đang chạy
//   dashboard                              chỉ dashboard (http://localhost:4747)
//   accounts list|add|login|check|enable|disable|unlimit|remove|init
//   jobs [list] | jobs cancel <id> | jobs retry <id> | jobs log <id>
//   enqueue plan <topic-id> [--episodes N] [--rounds N] [--auto-produce]
//   enqueue produce|qc|rescue <video-id> [--force]   |   enqueue dept_review <phòng>
//   produce <video-id…>                    = enqueue produce
//   approve <id> | reject <id>             duyệt/từ chối đề xuất nhân sự
//   settings [khoá giá-trị]                cài đặt (vd paid_fallback on)
//   office [stop|status] [--private] [--hours N] [--default-only] [--no-open]   Văn phòng 2D (whatsmyagentdoing)
//   seed-demo                              dữ liệu mẫu (chỉ khi DB trống)
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as S from './db.mjs';
import * as P from './pool.mjs';
import * as R from './runners.mjs';
import { runWorker, requestStop } from './worker.mjs';
import { formatOverview, formatPool } from './format.mjs';
import * as O from './office.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const [cmd, ...rest] = process.argv.slice(2);
const BOOL = new Set(['--force', '--auto-produce', '--default', '--probe', '--private', '--no-open', '--default-only']);
const flags = {};
const args = [];
for (let i = 0; i < rest.length; i++) {
  const a = rest[i];
  if (a.startsWith('--')) {
    if (BOOL.has(a)) flags[a.slice(2)] = true;
    else flags[a.slice(2)] = rest[++i];
  } else args.push(a);
}
const say = (...m) => console.log(...m);

async function accountsCmd() {
  const sub = args[0] || 'list';
  const ref = args[1];
  switch (sub) {
    case 'list': {
      const accs = P.listAccounts();
      say(accs.length ? formatPool({ accounts: accs, jobs: [], worker: P.workerState(), summary: {}, attention: [] }, { only: 'accounts' }) : 'Chưa có tài khoản nào. Thêm: node studio/src/cli.mjs accounts add <claude|codex> <nhãn> --owner "Tên"  (hoặc: accounts init)');
      break;
    }
    case 'add': {
      const [, provider, label] = args;
      const r = P.addAccount({ provider, label, owner: flags.owner || '', kind: flags['api-key'] || flags['secret-file'] ? 'api_key' : 'subscription', useDefault: !!flags.default, secret_file: flags['secret-file'] || null, priority: flags.priority ? Number(flags.priority) : 100, max_runs_per_day: flags['max-runs-per-day'] ? Number(flags['max-runs-per-day']) : null });
      say(`✔ Đã thêm ${provider}/${label} (id ${r.id}).`);
      if (!flags.default) say(`  Bước tiếp theo — đăng nhập tài khoản này (mở trình duyệt, đăng nhập đúng tài khoản của ${flags.owner || 'người dùng nó'}):\n    node studio/src/cli.mjs accounts login ${provider}/${label}\n  (hoặc tự chạy: ${r.login})`);
      break;
    }
    case 'init': {
      for (const provider of P.PROVIDERS) {
        if (P.listAccounts().some((a) => a.provider === provider && !a.home)) {
          say(`· ${provider}: đã có tài khoản dùng đăng nhập mặc định`);
          continue;
        }
        const st = R.checkAuth({ provider, home: null, kind: 'subscription' });
        if (!st.loggedIn) {
          say(`· ${provider}: máy này chưa đăng nhập mặc định (${st.detail}) — bỏ qua. Thêm tài khoản bằng "accounts add".`);
          continue;
        }
        P.addAccount({ provider, label: 'main', owner: flags.owner || '', useDefault: true });
        say(`✔ ${provider}/main = đăng nhập mặc định của máy (${st.detail})`);
      }
      break;
    }
    case 'login': {
      const a = P.resolveAccount(ref);
      if (a.kind === 'api_key') throw new S.StudioError('Tài khoản kiểu api_key không cần đăng nhập bằng trình duyệt');
      const cx = a.provider === 'claude' ? R.findClaude() : R.findCodex();
      const loginArgs = a.provider === 'claude' ? ['auth', 'login'] : ['login'];
      say(`Mở đăng nhập cho ${a.provider}/${a.label}${a.owner ? ` (của ${a.owner})` : ''} — hãy đăng nhập ĐÚNG tài khoản của người này trong trình duyệt…`);
      await new Promise((res) => spawn(cx.cmd, [...cx.pre, ...loginArgs], { stdio: 'inherit', env: R.accountEnv(a.provider, a), shell: cx.shell }).on('close', res));
      const st = R.checkAuth(a);
      say(st.loggedIn ? `✔ Đã đăng nhập: ${st.detail}` : `✖ Chưa đăng nhập (${st.detail})`);
      if (st.loggedIn) P.clearLimit(a.id);
      break;
    }
    case 'check': {
      const list = ref ? [P.resolveAccount(ref)] : P.listAccounts().filter((a) => a.enabled);
      for (const a of list) {
        const st = R.checkAuth(a);
        if (!st.loggedIn) {
          P.markAuthError(a.id, st.detail);
          say(`✖ ${a.provider}/${a.label}: CHƯA đăng nhập — ${a.login}`);
          continue;
        }
        if (a.status === 'auth_error') P.clearLimit(a.id);
        let line = `✔ ${a.provider}/${a.label}: đã đăng nhập (${st.detail})`;
        if (flags.probe) {
          const pr = await R.probeAccount(a);
          if (pr.ok) {
            P.markSuccess(a.id);
            line += ` · thử gọi thật: OK${pr.cost ? ` ($${pr.cost.toFixed(3)})` : ''}`;
          } else if (pr.type === 'limit') {
            const when = P.markLimited(a.id, { until: pr.resetAt, raw: pr.raw });
            line += ` · HẾT LIMIT đến ${when.toLocaleString('vi-VN')} — "${pr.raw}"`;
          } else line += ` · thử gọi thật THẤT BẠI: ${pr.raw}`;
        }
        say(line);
      }
      break;
    }
    case 'enable':
    case 'disable':
      say(JSON.stringify(P.setAccountEnabled(ref, sub === 'enable')));
      break;
    case 'unlimit':
      say(JSON.stringify(P.clearLimit(ref)));
      break;
    case 'remove': {
      const r = P.removeAccount(ref);
      say(`Đã gỡ khỏi kho.${r.home ? ` Thư mục đăng nhập vẫn còn (xoá tay nếu muốn): ${r.home}` : ''}`);
      break;
    }
    default:
      say('accounts: list | add <claude|codex> <nhãn> [--owner Tên] [--default] [--secret-file path] [--priority N] [--max-runs-per-day N] | login <tk> | check [tk] [--probe] | enable|disable|unlimit|remove <tk> | init');
  }
}

function enqueue(kind, target) {
  const o = { kind, by: 'director', force: !!flags.force };
  if (kind === 'plan') Object.assign(o, { topic_id: Number(target), episodes: flags.episodes, rounds: flags.rounds, auto_produce: !!flags['auto-produce'] });
  else if (kind === 'dept_review') o.dept = target;
  else o.video_id = target;
  const r = P.enqueueJob(o);
  say(r.deduped ? `· Đã có việc #${r.job_id} (${r.status}) cho mục này — không xếp thêm.` : `✔ Đã xếp hàng việc #${r.job_id} (${kind}).`);
  const w = P.ensureWorker();
  say(w.started ? `  Worker nền vừa được bật (pid ${w.pid}).` : w.alive ? '  Worker đang chạy — sẽ tự xử lý.' : `  ⚠ Worker chưa chạy: ${w.note || 'chạy "npm run start --prefix studio"'}`);
  say('  Theo dõi: dashboard http://localhost:4747 hoặc "node studio/src/cli.mjs jobs".');
}

async function main() {
  switch (cmd) {
    case 'status':
      say(formatOverview(S.overview({ dept: args[0] }), P.poolOverview()));
      break;
    case 'approve':
    case 'reject':
      say(JSON.stringify(S.decideProposal({ id: Number(args[0]), approve: cmd === 'approve', by: 'director', note: args.slice(1).join(' ') }), null, 2));
      break;
    case 'accounts':
      await accountsCmd();
      break;
    case 'enqueue':
      enqueue(args[0], args[1]);
      break;
    case 'produce':
      for (const v of args) enqueue('produce', v);
      if (!args.length) throw new S.StudioError('Cú pháp: produce <video-id…> [--force]');
      break;
    case 'jobs': {
      const sub = args[0] || 'list';
      if (sub === 'cancel') say(JSON.stringify(P.cancelJob(Number(args[1]))));
      else if (sub === 'retry') say(JSON.stringify(P.retryJob(Number(args[1]))));
      else if (sub === 'log') {
        const j = P.getJob(Number(args[1]));
        const f = j?.log_file;
        say(f && fs.existsSync(f) ? fs.readFileSync(f, 'utf8').slice(-6000) : `Chưa có log cho việc #${args[1]}`);
      } else say(formatPool({ ...P.poolOverview() }, { only: 'jobs' }));
      break;
    }
    case 'settings':
      say(args.length >= 2 ? JSON.stringify(P.setSetting(args[0], args[1])) : JSON.stringify(P.allSettings(), null, 2));
      break;
    case 'worker':
      if (args[0] === 'stop') {
        requestStop();
        say('Đã yêu cầu worker dừng (nó dừng ở vòng kiểm tra kế tiếp, việc đang chạy được đưa về hàng đợi).');
      } else await runWorker({ handleSignals: true });
      return;
    case 'start': {
      await import('./dashboard.mjs'); // bật dashboard cùng tiến trình
      await runWorker({ handleSignals: true });
      process.exit(0);
      return;
    }
    case 'dashboard': {
      const child = spawn(process.execPath, ['--disable-warning=ExperimentalWarning', path.join(here, 'dashboard.mjs')], { stdio: 'inherit' });
      setTimeout(() => spawn('cmd', ['/c', 'start', '', `http://localhost:${process.env.STUDIO_PORT || 4747}`], { stdio: 'ignore', detached: true }).unref(), 800);
      child.on('close', (c) => process.exit(c ?? 0));
      return;
    }
    case 'office': {
      if (args[0] === 'stop') {
        say((await O.stopOffice()).stopped || 'Đã yêu cầu dừng.');
        break;
      }
      if (args[0] === 'status') {
        const st = await O.officeStatus();
        say(st.installed ? `Văn phòng 2D (${st.version}): ${st.running.length ? st.running.map((r) => r.url).join('  ') : 'đang tắt'}` : `Chưa cài. Chạy: ${O.installHint()}`);
        break;
      }
      const r = await O.startOffice({ private: !!flags.private, hours: flags.hours ? Number(flags.hours) : 24, includeAccounts: !flags['default-only'], open: !flags['no-open'] });
      for (const x of r.results) say(x.url ? `${x.started ? '▶' : '·'} ${x.label}: ${x.url}${x.started ? '' : ' (đã chạy sẵn)'}` : `✖ ${x.label}: ${x.error}`);
      say(r.results.length > 1 ? `Mỗi bản chỉ thấy 1 cặp thư mục Claude/Codex; ${r.results.length - 1} bản bổ sung dành cho tài khoản phụ.` : 'Dừng bằng: npm run office --prefix studio -- stop');
      if (r.private) say('Chế độ --private: ẩn nội dung trò chuyện, chỉ hiện trạng thái.');
      break;
    }
    case 'seed-demo':
      S.seedDemo();
      say('Đã nạp dữ liệu mẫu (Thể thao 2 đội, IT 1 đội). Chạy: npm run start --prefix studio');
      break;
    default:
      say('Lệnh: status | start | worker [stop] | dashboard | accounts … | jobs … | enqueue … | produce <video-id> | approve <id> | reject <id> | settings | seed-demo');
  }
}

main()
  .then(() => {
    if (!['dashboard', 'start', 'worker'].includes(cmd) || args[0] === 'stop') S.closeDb();
  })
  .catch((e) => {
    console.error(e instanceof S.StudioError ? `✖ ${e.message}` : e);
    process.exit(1);
  });
