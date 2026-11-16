// Worker nền: lấy việc từ hàng đợi, chọn tài khoản, chạy, và tự xử lý khi hết limit:
//   hết limit  -> đánh dấu tài khoản, chuyển sang tài khoản khác (nếu còn)
//   hết sạch   -> việc chuyển "chờ hồi limit" tới giờ hồi sớm nhất rồi tự chạy tiếp
// Trạng thái nằm hết trong SQLite nên tắt/mở lại máy hay worker vẫn tiếp tục đúng chỗ.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import * as S from './db.mjs';
import * as P from './pool.mjs';
import { runJob } from './runners.mjs';

const { get, all, run, now } = S.sql;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function killTree(child) {
  try {
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    else child.kill('SIGKILL');
  } catch {
    /* đã thoát */
  }
}
const stamp = () => new Date().toLocaleTimeString('vi-VN');
const say = (m) => console.log(`[${stamp()}] ${m}`);
const countJobs = (kind, video_id) => get('SELECT COUNT(*) c FROM jobs WHERE kind=? AND video_id=?', kind, video_id).c;

// ---------- kiểm tra kết quả sau khi Claude chạy xong ----------
function verify(job) {
  if (job.kind === 'plan') {
    const t = get('SELECT folder FROM topics WHERE id=?', job.topic_id);
    if (!t?.folder) return 'Claude kết thúc nhưng chủ đề chưa được giao cho đội nào (không thấy thư mục chủ đề)';
    const miss = ['concept.md', 'plan.md'].filter((f) => !fs.existsSync(path.resolve(S.ROOT, t.folder, f)));
    if (miss.length) return `Claude kết thúc nhưng thiếu ${miss.join(', ')} trong ${t.folder}. Ghi chú của Claude: ${job.__summary || '(trống)'}`;
  }
  if (job.kind === 'qc') {
    const v = S.getVideo(job.video_id);
    if (v.stage === 'review') return `QC kết thúc nhưng ${v.id} vẫn ở "review" — Claude chưa đưa ra phán quyết. Ghi chú: ${job.__summary || '(trống)'}`;
  }
  if (job.kind === 'rescue') {
    const v = S.getVideo(job.video_id);
    if (v.needs_help) return `Claude chưa gỡ được vướng của ${v.id}: ${job.__summary || v.help_reason}`;
  }
  return null;
}

// ---------- chuỗi tự động ----------
function afterSuccess(job) {
  const maxProduce = Number(P.getSetting('max_produce_per_video'));
  if (job.kind === 'plan' && job.payload.auto_produce) {
    for (const v of all("SELECT id FROM videos WHERE topic_id=? AND stage='planning'", job.topic_id)) P.enqueueJob({ kind: 'produce', video_id: v.id, by: 'worker' });
  }
  if (job.kind === 'produce') P.enqueueJob({ kind: 'qc', video_id: job.video_id, by: 'worker' });
  if (job.kind === 'qc') {
    const v = S.getVideo(job.video_id);
    if (v.stage === 'production') {
      if (countJobs('produce', v.id) < maxProduce) {
        P.enqueueJob({ kind: 'produce', video_id: v.id, force: true, by: 'worker' });
        say(`QC rớt ${v.id} → xếp sản xuất lại`);
      } else S.logEvent({ actor: 'worker', dept: v.dept, video_id: v.id, kind: 'job', message: `${v.id} QC rớt nhiều lần (đã sản xuất ${maxProduce} lần) — cần giám đốc xem` });
    }
  }
  if (job.kind === 'rescue') {
    const v = S.getVideo(job.video_id);
    if (['production', 'planning'].includes(v.stage) && countJobs('produce', v.id) < maxProduce) P.enqueueJob({ kind: 'produce', video_id: v.id, force: true, by: 'worker' });
    else if (v.stage === 'review') P.enqueueJob({ kind: 'qc', video_id: v.id, by: 'worker' });
  }
}

/** Codex kẹt/hỏng hết số lần thử: đặt cờ vướng và nhờ Claude gỡ (có giới hạn số lần). */
function produceStuck(job, reason) {
  const v = S.getVideo(job.video_id);
  if (!v.needs_help) S.escalate({ video_id: v.id, reason, role: 'producer', by: 'worker' });
  const maxRescue = Number(P.getSetting('max_rescues_per_video'));
  if (countJobs('rescue', v.id) < maxRescue) {
    P.enqueueJob({ kind: 'rescue', video_id: v.id, by: 'worker' });
    return 'failed'; // đã có việc rescue đảm nhận
  }
  return 'needs_human';
}

// ---------- worker ----------
export async function runWorker({ tickMs = Number(process.env.STUDIO_TICK_MS || 5000), handleSignals = false } = {}) {
  const ws = P.workerState();
  if (ws.alive && ws.pid !== process.pid) throw new S.StudioError(`Worker đã đang chạy (pid ${ws.pid}).`);
  run('INSERT OR REPLACE INTO worker(id,pid,started_at,heartbeat_at,tick_ms,stop_requested,running) VALUES(1,?,?,?,?,0,0)', process.pid, now(), now(), tickMs);
  for (const j of all("SELECT id FROM jobs WHERE status='running'")) P.setJob(j.id, { status: 'queued', next_run_at: now() }); // worker trước bị tắt giữa chừng
  S.logEvent({ actor: 'system', kind: 'worker', message: `Worker khởi động (pid ${process.pid})` });
  say(`Worker chạy (pid ${process.pid}), kiểm tra hàng đợi mỗi ${tickMs / 1000}s. Ctrl+C để dừng.`);

  const running = new Map(); // jobId -> {job, child, promise}
  let stopping = false;
  const stop = () => {
    stopping = true;
  };
  if (handleSignals) {
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
  }

  const providerBusy = (p) => [...running.values()].filter((r) => r.job.provider === p).length;
  const nextRunnable = (provider) => {
    const locked = new Set([...running.values()].map((r) => r.job.lock_key));
    return all("SELECT * FROM jobs WHERE provider=? AND status='queued' AND next_run_at<=? ORDER BY id", provider, now()).find((j) => !locked.has(j.lock_key));
  };

  function park(job) {
    const next = P.nextAvailableAt(job.provider);
    const reason = next ? 'limit' : 'no_account';
    const at = next ? new Date(next.getTime() + Number(process.env.STUDIO_PARK_PAD_MS ?? 3000)) : new Date(Date.now() + Number(process.env.STUDIO_NOACC_POLL_MS ?? 60_000));
    const news = job.wait_reason !== reason;
    P.setJob(job.id, { status: 'waiting_limit', wait_reason: reason, next_run_at: at.toISOString() });
    if (news) {
      const msg = next ? `Việc #${job.id} (${job.title}) CHỜ: mọi tài khoản ${job.provider} đang hết limit — tự chạy tiếp lúc ${next.toLocaleString('vi-VN')}` : `Việc #${job.id} (${job.title}) CHỜ: chưa có tài khoản ${job.provider} nào dùng được (thêm/đăng nhập/bật tài khoản là tự chạy tiếp)`;
      S.logEvent({ actor: 'system', dept: job.dept, video_id: job.video_id, kind: 'job', message: msg });
      say(msg);
    }
    if (job.kind === 'produce' && job.video_id) {
      try {
        const v = S.getVideo(job.video_id);
        S.reportStatus({ team_id: v.team_id, role: 'producer', status: 'blocked', task: `⏳ Chờ ${next ? 'hồi limit' : 'tài khoản Codex'} — việc #${job.id}`, video_id: v.id, by: 'worker' });
      } catch {
        /* đội đã giải thể */
      }
    }
  }

  function settle(job, account, res) {
    const fresh = P.getJob(job.id);
    const common = { log_file: res.logFile || '', summary: res.summary || '' };
    if (stopping) {
      P.setJob(job.id, { status: 'queued', next_run_at: now() });
      return;
    }
    if (fresh.cancel_requested) {
      P.setJob(job.id, { status: 'cancelled', finished_at: now(), cancel_requested: false, ...common });
      S.logEvent({ actor: 'worker', dept: job.dept, video_id: job.video_id, kind: 'job', message: `Việc #${job.id} đã huỷ theo yêu cầu` });
      return;
    }
    const ev = (m) => {
      S.logEvent({ actor: 'worker', dept: job.dept, video_id: job.video_id, kind: 'job', message: m });
      say(m);
    };
    switch (res.outcome) {
      case 'success': {
        const problem = verify({ ...job, __summary: res.summary });
        P.markSuccess(account.id);
        if (problem) {
          P.setJob(job.id, { status: 'needs_human', finished_at: now(), last_error: problem, ...common });
          ev(`Việc #${job.id} chạy xong nhưng chưa đạt: ${problem}`);
        } else {
          P.setJob(job.id, { status: 'succeeded', finished_at: now(), last_error: '', ...common });
          ev(`Việc #${job.id} XONG (${job.title}) bằng tài khoản ${account.provider}/${account.label}`);
          afterSuccess(fresh);
        }
        break;
      }
      case 'limit': {
        const when = P.markLimited(account.id, { until: res.resetAt, raw: res.raw });
        P.setJob(job.id, { status: 'queued', next_run_at: now(), last_error: `Hết limit ${account.provider}/${account.label} (hồi ${when.toLocaleString('vi-VN')}) — thử tài khoản khác/chờ`, ...common });
        ev(`Việc #${job.id}: tài khoản ${account.provider}/${account.label} hết limit → chuyển tài khoản khác hoặc chờ`);
        break;
      }
      case 'auth': {
        P.markAuthError(account.id, res.reason);
        P.setJob(job.id, { status: 'queued', next_run_at: now(), last_error: `Tài khoản ${account.provider}/${account.label} lỗi đăng nhập`, ...common });
        ev(`Việc #${job.id}: tài khoản ${account.provider}/${account.label} lỗi đăng nhập → thử tài khoản khác`);
        break;
      }
      case 'needs_help': {
        P.markSuccess(account.id);
        const st = job.kind === 'produce' ? produceStuck(fresh, res.reason) : 'needs_human';
        P.setJob(job.id, { status: st, finished_at: now(), last_error: res.reason, ...common });
        ev(`Việc #${job.id} KẸT: ${res.reason}${st === 'failed' ? ' → đã nhờ Claude gỡ vướng' : ' → cần giám đốc'}`);
        break;
      }
      case 'needs_human': {
        P.setJob(job.id, { status: 'needs_human', finished_at: now(), last_error: res.reason, ...common });
        ev(`Việc #${job.id} cần người xử lý: ${res.reason}`);
        break;
      }
      default: {
        const attempts = fresh.attempts + 1;
        if (attempts >= fresh.max_attempts) {
          const st = job.kind === 'produce' ? produceStuck(fresh, res.reason) : 'needs_human';
          P.setJob(job.id, { status: st, attempts, finished_at: now(), last_error: res.reason, ...common });
          ev(`Việc #${job.id} THẤT BẠI sau ${attempts} lần: ${res.reason}${st === 'failed' ? ' → đã nhờ Claude gỡ vướng' : ''}`);
        } else {
          P.setJob(job.id, { status: 'queued', attempts, next_run_at: new Date(Date.now() + 2 * 60_000 * attempts).toISOString(), last_error: res.reason, ...common });
          ev(`Việc #${job.id} lỗi (lần ${attempts}/${fresh.max_attempts}): ${res.reason} — thử lại sau ${2 * attempts} phút`);
        }
      }
    }
  }

  function start(job, account) {
    const resumed = !!job.started_at;
    P.markUsed(account.id);
    P.setJob(job.id, { status: 'running', account_id: account.id, started_at: job.started_at || now(), wait_reason: '', cancel_requested: false, last_error: '' });
    const entry = { job, child: null };
    say(`▶ Việc #${job.id} [${job.kind}] ${job.title} · tài khoản ${account.provider}/${account.label}${resumed ? ' (chạy tiếp)' : ''}`);
    S.logEvent({ actor: 'worker', dept: job.dept, video_id: job.video_id, kind: 'job', message: `Bắt đầu việc #${job.id}: ${job.title} · tài khoản ${account.provider}/${account.label}${resumed ? ' (chạy tiếp)' : ''}` });
    entry.promise = (async () => {
      let res;
      try {
        res = await runJob({ ...job, payload: JSON.parse(job.payload || '{}'), resumed }, account, { onChild: (c) => (entry.child = c) });
      } catch (e) {
        res = { outcome: 'failed', reason: e.message };
      }
      try {
        settle({ ...job, payload: JSON.parse(job.payload || '{}') }, account, res);
      } catch (e) {
        console.error('[worker] lỗi khi ghi kết quả:', e);
      }
    })().finally(() => running.delete(job.id));
    running.set(job.id, entry);
  }

  async function tick() {
    run('UPDATE worker SET heartbeat_at=?, running=?, tick_ms=? WHERE id=1', now(), running.size, tickMs);
    if (get('SELECT stop_requested s FROM worker WHERE id=1')?.s) return stop();
    P.reviveAccounts();
    run("UPDATE jobs SET status='queued', updated_at=? WHERE status='waiting_limit' AND next_run_at<=?", now(), now());
    for (const [id, r] of running) {
      if (get('SELECT cancel_requested c FROM jobs WHERE id=?', id)?.c && r.child) {
        killTree(r.child);
      }
    }
    for (const provider of P.PROVIDERS) {
      const slots = Number(P.getSetting(`concurrency_${provider}`)) || 1;
      while (providerBusy(provider) < slots) {
        const job = nextRunnable(provider);
        if (!job) break;
        const account = P.pickAccount(provider);
        if (!account) park(job);
        else start(job, account);
      }
    }
  }

  while (!stopping) {
    try {
      await tick();
    } catch (e) {
      console.error('[worker] lỗi vòng lặp:', e);
    }
    if (stopping) break;
    await sleep(tickMs);
  }
  say('Đang dừng worker…');
  for (const r of running.values()) {
    if (r.child) killTree(r.child);
  }
  await Promise.allSettled([...running.values()].map((r) => r.promise));
  run('UPDATE worker SET pid=NULL, heartbeat_at=?, running=0, stop_requested=0 WHERE id=1', new Date(0).toISOString());
  S.logEvent({ actor: 'system', kind: 'worker', message: 'Worker đã dừng' });
  say('Worker đã dừng.');
}

export function requestStop() {
  run('UPDATE worker SET stop_requested=1 WHERE id=1');
}
