// CLI của xưởng:  node studio/src/cli.mjs <lệnh>   (hoặc npm run <lệnh> --prefix studio)
//   status [phòng]                         tổng quan: ai đang làm gì, tài khoản, hàng đợi
//   start                                  dashboard + worker nền trong 1 tiến trình (khuyên dùng)
//   worker | worker stop                   chỉ worker / dừng worker đang chạy
//   dashboard                              chỉ dashboard (http://localhost:4747)
//   accounts list|add|login|check|enable|disable|unlimit|remove|init
//   dept create <mã-phòng> --name "Tên" [--target N] [--teams N]   mở phòng ban mới
//   dept purge <mã-phòng> [--force]        xoá sạch phòng đã đóng + chủ đề/video/job/đề xuất liên quan (không hoàn tác)
//   topic submit <mã-phòng> "<chủ đề>" [--brief "..."]            ghi chủ đề cho phòng (-> dùng topic-id ở "enqueue plan")
//   jobs [list] | jobs cancel <id> | jobs retry <id> | jobs log <id>
//   takeover <job-id> <claude|gemini|off> [--note "..."]   GIÁM ĐỐC duyệt cho AI khác làm thay việc đang kẹt ở AI bị limit/hỏng (hiện: Claude hoặc Gemini thay Codex ở việc plan; Gemini viết storyboard, Claude duyệt); off = thu hồi
//   enqueue plan <topic-id> [--episodes N] [--rounds N] [--auto-produce | --no-auto-produce]   (không ghi cờ → theo cài đặt auto_produce, mặc định bật)
//   enqueue produce|qc|rescue <video-id> [--force]   |   enqueue dept_review <phòng>
//   produce <video-id…>                    = enqueue produce
//   approve <id> | reject <id>             duyệt/từ chối đề xuất nhân sự
//   scout <mã-phòng>                       chạy NGAY lượt tìm chủ đề của phòng (~5 đề xuất, gửi "Chủ đề chờ duyệt"); tự động thì chạy 08:00 và 13:00 hằng ngày khi phòng BẬT tự tìm chủ đề (cài đặt scout_slots, scout_per_run, max_pending_topics)
//   pack <video-id> [--json]               GÓI ĐĂNG TIKTOK: nội dung dán vào ô mô tả, đường dẫn video/bìa, nhắc nhãn AI (không đăng gì; giám đốc tự đăng, luật 9)
//   settings [khoá giá-trị]                cài đặt (vd paid_fallback on)
//   accounts assign <provider/nhãn | email> <mã-phòng[,mã-phòng…]|+mã|-mã|none>   cấp tài khoản cho MỘT HOẶC NHIỀU phòng (danh sách = đặt đúng; +mã/-mã = thêm/bớt; none = trả về dùng chung)
//   office [stop|status] [--private] [--hours N] [--no-open]   Văn phòng 2D (whatsmyagentdoing) — mỗi phòng 1 bản
//   seed-demo                              dữ liệu mẫu (chỉ khi DB trống)
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as S from './db.mjs';
import * as P from './pool.mjs';
import * as R from './runners.mjs';
import { findAgy } from './agy.mjs';
import { runWorker, requestStop } from './worker.mjs';
import { formatOverview, formatPool } from './format.mjs';
import * as O from './office.mjs';
import { buildTikTokPack, formatPack } from './publish-pack.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const [cmd, ...rest] = process.argv.slice(2);
const BOOL = new Set(['--force', '--auto-produce', '--no-auto-produce', '--default', '--probe', '--json', '--private', '--no-open', '--default-only']);
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
      say(accs.length ? formatPool({ accounts: accs, jobs: [], worker: P.workerState(), summary: {}, attention: [] }, { only: 'accounts' }) : 'Chưa có tài khoản nào. Thêm: node studio/src/cli.mjs accounts add <claude|codex|gemini> <nhãn> --owner "Tên"  (hoặc: accounts init)');
      break;
    }
    case 'add': {
      const [, provider, label] = args;
      const r = P.addAccount({ provider, label, owner: flags.owner || '', kind: flags['api-key'] || flags['secret-file'] ? 'api_key' : 'subscription', useDefault: !!flags.default, secret_file: flags['secret-file'] || null, priority: flags.priority ? Number(flags.priority) : 100, max_runs_per_day: flags['max-runs-per-day'] ? Number(flags['max-runs-per-day']) : null });
      say(`✔ Đã thêm ${provider}/${label} (id ${r.id}).`);
      if (provider === 'gemini') say('  Gemini (agy) dùng đăng nhập mặc định của máy, không có bước đăng nhập riêng. Kiểm: node studio/src/cli.mjs accounts check gemini/' + label + ' --probe');
      else if (!flags.default) say(`  Bước tiếp theo — đăng nhập tài khoản này (mở trình duyệt, đăng nhập đúng tài khoản của ${flags.owner || 'người dùng nó'}):\n    node studio/src/cli.mjs accounts login ${provider}/${label}\n  (hoặc tự chạy: ${r.login})`);
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
      const cx = a.provider === 'claude' ? R.findClaude() : a.provider === 'gemini' ? findAgy() : R.findCodex();
      // agy không có lệnh login riêng: mở agy, chọn "1. Google OAuth", đăng nhập bằng trình duyệt rồi dán mã.
      const loginArgs = a.provider === 'claude' ? ['auth', 'login'] : a.provider === 'gemini' ? [] : ['login'];
      say(`Mở đăng nhập cho ${a.provider}/${a.label}${a.owner ? ` (của ${a.owner})` : ''} — hãy đăng nhập ĐÚNG tài khoản của người này trong trình duyệt…`);
      await new Promise((res) => spawn(cx.cmd, [...cx.pre, ...loginArgs], { stdio: 'inherit', env: R.accountEnv(a.provider, a), shell: cx.shell }).on('close', res));
      const st = R.checkAuth(a);
      say(st.loggedIn ? `✔ Đã đăng nhập: ${st.detail}` : `✖ Chưa đăng nhập (${st.detail})`);
      if (st.loggedIn) P.clearLimit(a.id);
      break;
    }
    case 'assign': {
      if (!ref || !args[2]) throw new S.StudioError('Cú pháp: accounts assign <provider/nhãn | email> <mã-phòng[,mã-phòng…]|+mã|-mã|none>');
      const r = P.assignAccount(ref, args.slice(2));
      say(r.depts.length ? `✔ ${r.person} → phòng ${r.depts.join(', ')}: ${r.depts.length > 1 ? 'các phòng này cùng dùng chung hạn mức của nó' : 'chỉ việc của phòng này dùng'}; có Văn phòng 2D theo phòng (bật lại: npm run office --prefix studio).` : `✔ ${r.person} → dùng chung (không theo dõi trên Văn phòng 2D).`);
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
    case 'owner':
      say(JSON.stringify(P.setAccountOwner(ref, args.slice(2).join(' '))));
      break;
    case 'remove': {
      const r = P.removeAccount(ref);
      say(`Đã gỡ khỏi kho.${r.home ? ` Thư mục đăng nhập vẫn còn (xoá tay nếu muốn): ${r.home}` : ''}`);
      break;
    }
    default:
      say('accounts: list | add <claude|codex|gemini> <nhãn> [--owner Tên] [--default] [--secret-file path] [--priority N] [--max-runs-per-day N] | login <tk> | check [tk] [--probe] | enable|disable|unlimit|remove <tk> | owner <tk> <tên chủ> | init');
  }
}

function enqueue(kind, target) {
  const o = { kind, by: 'director', force: !!flags.force };
  if (kind === 'plan') Object.assign(o, { topic_id: Number(target), episodes: flags.episodes, rounds: flags.rounds, auto_produce: flags['no-auto-produce'] ? false : flags['auto-produce'] ? true : undefined });
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
    case 'load': {
      // Cân bằng tải ba agent (số phút chạy thật): node studio/src/cli.mjs load [--days N] [--backfill]
      // Không có --days: in cả bảng 7 ngày (thước theo dõi) và bảng 24h (chỉ tham khảo, một ngày rất nhiễu); có --days N: chỉ một bảng N ngày.
      if (flags.backfill) {
        const b = P.backfillCalls();
        say(`Dựng lại sổ lượt gọi từ log cũ: quét ${b.scanned} log, thêm ${b.added}, bỏ qua ${b.skipped} (đã có hoặc không hợp lệ).`);
      }
      const printLoad = (r, label) => {
        say(`Cân bằng tải ${label} gần nhất (số phút chạy thật; mỗi bên nên ≈ 1/3, chấp nhận ${P.LOAD_BAND.min * 100}–${P.LOAD_BAND.max * 100}%):`);
        for (const p of P.PROVIDERS) {
          const x = r.providers[p];
          say(`  ${P.PROVIDER_NAME[p].padEnd(7)} ${String(x.share_pct).padStart(5)}%  ${String(x.minutes).padStart(7)} phút · ${x.jobs} việc nền + ${x.calls} lượt gọi · hết limit ${x.limits} lần · lỗi ${x.failed}`);
        }
        say(`  → ${r.status === 'balanced' ? 'CÂN BẰNG' : r.status === 'skewed' ? 'LỆCH: ' + r.notes.join('; ') : r.notes.join(' ')}`);
        say(`  (${r.caveat})`);
      };
      const days = Number(flags.days);
      if (days) printLoad(P.loadReport({ days }), `${days} ngày`);
      else {
        printLoad(P.loadReport({ days: 7 }), '7 ngày');
        say('');
        printLoad(P.loadReport({ days: 1 }), '24h');
        say('  (24h chỉ để tham khảo: một ngày rất nhiễu; số 7 ngày mới là thước theo dõi.)');
      }
      break;
    }
    case 'approve':
    case 'reject':
      say(JSON.stringify(S.decideProposal({ id: Number(args[0]), approve: cmd === 'approve', by: 'director', note: args.slice(1).join(' ') }), null, 2));
      break;
    case 'accounts':
      await accountsCmd();
      break;
    case 'dept': {
      if (args[0] === 'purge') {
        const r = S.purgeDepartment({ slug: args[1], force: !!flags.force, by: 'director' });
        say(`✔ Đã xoá sạch phòng "${r.dept}" (${r.deleted.topics} chủ đề, ${r.deleted.videos} video, ${r.deleted.jobs} việc, ${r.deleted.proposals} đề xuất).`);
        break;
      }
      if (args[0] !== 'create') throw new S.StudioError('Cú pháp: dept create <mã-phòng> --name "Tên" [--target N] [--teams N]  |  dept purge <mã-phòng> [--force]');
      const r = S.createDepartment({ slug: args[1], name: flags.name, daily_target: flags.target, initial_teams: flags.teams, by: 'director' });
      say(`✔ Đã mở phòng "${r.dept}" (${r.teams.length} đội).`);
      break;
    }
    case 'topic': {
      if (args[0] !== 'submit') throw new S.StudioError('Cú pháp: topic submit <mã-phòng> "<chủ đề>" [--brief "..."]');
      const r = S.submitTopic({ dept: args[1], text: args.slice(2).join(' '), brief: flags.brief || '', by: 'director' });
      say(`✔ Đã ghi chủ đề #${r.topic_id} vào phòng "${r.dept}".`);
      break;
    }
    case 'enqueue':
      enqueue(args[0], args[1]);
      break;
    case 'scout': {
      if (!args[0]) throw new S.StudioError('Cú pháp: scout <mã-phòng>');
      const r = P.enqueueScoutNow(args[0]);
      say(r.deduped ? `· Phòng "${args[0]}" đã có việc tìm chủ đề #${r.job_id} (${r.status}) — không xếp thêm.` : `✔ Đã xếp việc tìm chủ đề #${r.job_id} cho phòng "${args[0]}"; worker tự chạy, đề xuất hiện ở "Chủ đề chờ duyệt".`);
      break;
    }
    case 'pack': {
      if (!args[0]) throw new S.StudioError('Cú pháp: pack <video-id> [--json]');
      const pack = buildTikTokPack(args[0]);
      say(flags.json ? JSON.stringify(pack, null, 2) : formatPack(pack));
      break;
    }
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
    case 'takeover': {
      const id = Number(args[0]);
      const by = String(args[1] || '').toLowerCase();
      if (!id || !by) throw new S.StudioError('Cú pháp: takeover <job-id> <claude|gemini|off> [--note "lý do"]');
      const r = by === 'off' ? P.revokeTakeover(id) : P.approveTakeover({ job_id: id, by, note: flags.note || '' });
      say(JSON.stringify(r, null, 2));
      if (r.status === 'waiting_limit') say('Đã ghi duyệt. Việc vẫn đang chờ CLAUDE hồi limit (phiên điều phối vẫn cần Claude), tới giờ hồi sẽ tự chạy theo đường làm thay.');
      else say('Việc đã được xếp chạy lại. Worker đang chạy sẽ nhận ngay; chưa bật thì: npm run start --prefix studio');
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
        if (!st.installed) {
          say(`Chưa cài. Chạy: ${O.installHint()}`);
          break;
        }
        say(`Văn phòng 2D (${st.version}) — mỗi phòng ban 1 bản, chỉ đọc tài khoản đã cấp cho phòng đó:`);
        if (!st.directory.length) say('  (chưa có tài khoản nào được cấp cho phòng ban — cấp bằng: accounts assign <provider/nhãn> <mã-phòng>)');
        for (const d of st.directory) {
          const r = st.running.find((x) => x.name === d.name);
          say(`  ${d.name.padEnd(12)} ${r ? `cổng ${r.port}  ${r.url}` : '(chưa bật)'}  ${d.label.split(': ').slice(1).join(': ')}`);
        }
        for (const r of st.running.filter((x) => !st.directory.some((d) => d.name === x.name))) say(`  ⚠ cổng ${r.port}: bản thừa (${r.name}) — bật lại "npm run office" sẽ tự tắt`);
        say('Phòng đang mở:');
        if (!st.departments.length) say('  (không có phòng nào đang mở)');
        for (const d of st.departments) say(`  ${d.name} [${d.slug}]: ${d.office.length ? d.office.join(', ') : 'chưa được cấp tài khoản riêng → dùng tài khoản dùng chung, không theo dõi'}${d.running_jobs ? ` · ${d.running_jobs} việc đang chạy` : ''}`);
        break;
      }
      const r = await O.startOffice({ private: !!flags.private, hours: flags.hours ? Number(flags.hours) : 24, open: !flags['no-open'] });
      for (const x of r.results) say(x.url ? `${x.started ? '▶' : '·'} ${x.name.padEnd(14)} cổng ${x.port}  ${x.url}  ${x.label.split(': ').slice(1).join(': ')}${x.started ? '' : ' (đã chạy sẵn)'}` : `✖ ${x.name}: ${x.error}`);
      if (!r.results.length) say('Chưa có tài khoản nào được cấp cho phòng ban nên không có gì để theo dõi. Cấp bằng: node studio/src/cli.mjs accounts assign <provider/nhãn> <mã-phòng>');
      else say('Mỗi bản = 1 phòng ban (chỉ đọc tài khoản đã cấp cho phòng). Tài khoản dùng chung không được theo dõi.');
      say('Dừng bằng: npm run office --prefix studio -- stop');
      if (r.private) say('Chế độ --private: ẩn nội dung trò chuyện, chỉ hiện trạng thái.');
      break;
    }
    case 'seed-demo':
      S.seedDemo();
      say('Đã nạp dữ liệu mẫu (Thể thao 2 đội, IT 1 đội). Chạy: npm run start --prefix studio');
      break;
    default:
      say('Lệnh: status | start | worker [stop] | dashboard | accounts … | jobs … | enqueue … | produce <video-id> | pack <video-id> | scout <phòng> | approve <id> | reject <id> | settings | seed-demo');
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
