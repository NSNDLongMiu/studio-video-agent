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

// ---------- QC kết luận "giữ review chờ giám đốc nghe" nhưng không tự escalate (giám đốc chốt 21/11/2026: việc còn lại Claude tự xử lý) ----------
// Kết luận hợp lệ của QC khi chỉ còn mục CHƯA KIỂM (giọng/nhịp/phát âm cần người nghe) là giữ `review` và đánh cờ QC-CHỜ-NGHE. Nếu QC quên đánh cờ,
// worker đánh thay từ chính lời kết luận của QC thay vì đẩy việc sang "cần người". QC bị chặn/không chạy được thì KHÔNG phải ca này (vẫn cần người).
const QC_BLOCKED = /couldn'?t|could not|không (thể|chạy được|xem được)|bị (chặn|từ chối)|chặn quyền|permission|refused|denied/i;
const QC_LISTEN = /chờ[^.\n]{0,80}nghe|phải (chờ|nghe)|giám đốc nghe|người (nghe|duyệt)|CHƯA KIỂM/i;
export const qcWaitsForListening = (summary) => {
  const t = String(summary || '');
  return QC_LISTEN.test(t) && !QC_BLOCKED.test(t);
};

/** Video vướng ở sản xuất mà không ai đang xử lý → tự xếp việc gỡ vướng cho Claude (tối đa max_rescues_per_video lần/video; quá số lần thì để giám đốc).
 *  Cờ QC-CHỜ-NGHE/QC-THIẾT-KẾ là việc của giám đốc nên không bao giờ tự gỡ. Trả về số việc đã xếp. */
export function autoRescue() {
  let n = 0;
  for (const v of all("SELECT id,dept,stage,needs_help,help_reason FROM videos WHERE needs_help=1 AND stage='production'")) {
    if (!S.rescueState(v).auto) continue;
    if (get("SELECT 1 FROM jobs WHERE video_id=? AND kind IN ('rescue','produce','qc') AND status IN ('queued','running','waiting_limit')", v.id)) continue;
    const r = P.enqueueJob({ kind: 'rescue', video_id: v.id, by: 'worker' });
    if (r.deduped) continue;
    n++;
    S.logEvent({ actor: 'worker', dept: v.dept, video_id: v.id, kind: 'job', message: `${v.id} đang vướng → tự xếp việc gỡ vướng #${r.job_id} cho Claude (lần ${countJobs('rescue', v.id)}/${P.getSetting('max_rescues_per_video')})` });
  }
  return n;
}

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
    if (v.stage === 'review' && !v.needs_help) return `QC kết thúc nhưng ${v.id} vẫn ở "review" — Claude chưa đưa ra phán quyết. Ghi chú: ${job.__summary || '(trống)'}`;
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

  /** Vị trí của đội mà việc nền này đại diện (để thẻ đội trên dashboard hiện đúng "đang chờ", không để trống hay "đang làm" cũ). */
  function jobMembers(job) {
    let teamId = null;
    let roles = [];
    if (job.kind === 'plan') {
      teamId = get('SELECT team_id t FROM videos WHERE topic_id=? ORDER BY id LIMIT 1', job.topic_id)?.t;
      roles = ['idea', 'script', 'visual'];
    } else if ((job.kind === 'qc' || job.kind === 'rescue') && job.video_id) {
      teamId = S.getVideo(job.video_id).team_id;
      roles = [job.kind];
    } else if (job.kind === 'scout') {
      teamId = JSON.parse(job.payload || '{}').team_id;
      roles = ['scout'];
    }
    if (!teamId) return [];
    return all(`SELECT team_id,role,status,video_id FROM members WHERE team_id=? AND role IN (${roles.map(() => '?').join(',')}) ORDER BY updated_at DESC, id DESC`, teamId, ...roles);
  }
  const WAIT_MARK = '⏳ Chờ';
  /** Việc Claude bị hoãn vì hết limit/không có tài khoản: đánh dấu `blocked` các vị trí đang làm dở (không có vị trí nào đang làm thì lấy vị trí vừa hoạt động gần nhất = chỗ việc dừng). */
  function markWaiting(job, next) {
    try {
      const ms = jobMembers(job);
      const targets = ms.some((m) => m.status === 'working') ? ms.filter((m) => m.status === 'working') : ms.slice(0, 1);
      const why = next ? `hồi limit ${job.provider === 'claude' ? 'Claude' : job.provider} lúc ${next.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : `tài khoản ${job.provider}`;
      for (const m of targets) {
        const task = `${WAIT_MARK} ${why} — việc #${job.id}`;
        const cur = get('SELECT status,task FROM members WHERE team_id=? AND role=?', m.team_id, m.role);
        if (cur?.status === 'blocked' && cur.task === task) continue; // đã đánh dấu đúng, khỏi ghi lại (tránh spam nhật ký)
        S.reportStatus({ team_id: m.team_id, role: m.role, status: 'blocked', task, video_id: m.video_id || job.video_id || null, by: 'worker' });
      }
    } catch {
      /* đội đã giải thể hoặc video không còn */
    }
  }
  /** Việc chạy lại: gỡ dấu chờ do chính worker đặt (để vị trí không kẹt "vướng" khi lần chạy tiếp không đụng tới nó). */
  function clearWaiting(job) {
    try {
      for (const m of jobMembers(job)) {
        const row = get('SELECT status,task FROM members WHERE team_id=? AND role=?', m.team_id, m.role);
        if (row?.status === 'blocked' && String(row.task).startsWith(WAIT_MARK)) S.reportStatus({ team_id: m.team_id, role: m.role, status: 'idle', task: '', by: 'worker' });
      }
    } catch {
      /* bỏ qua */
    }
  }

  function park(job) {
    const next = P.nextAvailableAt(job.provider, { dept: job.dept });
    const reason = next ? 'limit' : 'no_account';
    const at = next ? new Date(next.getTime() + Number(process.env.STUDIO_PARK_PAD_MS ?? 3000)) : new Date(Date.now() + Number(process.env.STUDIO_NOACC_POLL_MS ?? 60_000));
    const news = job.wait_reason !== reason;
    P.setJob(job.id, { status: 'waiting_limit', wait_reason: reason, next_run_at: at.toISOString() });
    if (news) {
      const msg = next ? `Việc #${job.id} (${job.title}) CHỜ: mọi tài khoản ${job.provider}${job.dept ? ` dùng được cho phòng ${job.dept}` : ' dùng chung'} đang hết limit — tự chạy tiếp lúc ${next.toLocaleString('vi-VN')}` : `Việc #${job.id} (${job.title}) CHỜ: chưa có tài khoản ${job.provider}${job.dept ? ` dùng được cho phòng ${job.dept}` : ' dùng chung'} nào dùng được (cấp/thêm/đăng nhập/bật tài khoản là tự chạy tiếp)`;
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
    } else markWaiting(job, next); // việc của Claude: kế hoạch, QC, gỡ vướng, tìm chủ đề (idempotent)
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
        let problem = verify({ ...job, __summary: res.summary });
        P.markSuccess(account.id);
        let heldAuto = false;
        if (problem && job.kind === 'qc' && qcWaitsForListening(res.summary)) {
          const v = S.getVideo(job.video_id);
          if (v.stage === 'review' && !v.needs_help) {
            S.escalate({ video_id: v.id, role: 'qc', reason: `QC-CHỜ-NGHE: ${String(res.summary || '').replace(/\s+/g, ' ').trim().slice(0, 420)}`, by: 'worker' });
            problem = null;
            heldAuto = true;
          }
        }
        if (problem) {
          P.setJob(job.id, { status: 'needs_human', finished_at: now(), last_error: problem, ...common });
          ev(`Việc #${job.id} chạy xong nhưng chưa đạt: ${problem}`);
        } else {
          P.setJob(job.id, { status: 'succeeded', finished_at: now(), last_error: '', ...common });
          ev(`Việc #${job.id} XONG (${job.title}) bằng tài khoản ${account.provider}/${account.label}${heldAuto ? ' — QC giữ review chờ giám đốc nghe, worker đã tự đánh cờ QC-CHỜ-NGHE' : ''}`);
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
      case 'wait_codex': {
        // Việc kế hoạch cần Codex (viết kịch bản/storyboard) nhưng Codex của phòng đang bận/hết limit: không phải lỗi
        // của tài khoản Claude — tạm dừng, chạy lại (tiếp từ chỗ dở) khi Codex rảnh.
        P.markSuccess(account.id);
        const next = P.nextAvailableAt('codex', { dept: job.dept });
        const known = !!next && next.getTime() > Date.now(); // biết giờ Codex hồi → chờ đúng giờ đó, không phải vòng lặp mù
        // Codex "dùng được" mà vẫn không làm được (không có giờ hồi để chờ): mỗi lần chạy lại tốn 1 phiên Claude để hỏng lại đúng chỗ cũ.
        // Quá ngưỡng thì dừng hẳn và đưa giám đốc quyết (duyệt Claude làm thay, hoặc sửa Codex).
        const waits = known ? Number(fresh.payload.codex_waits || 0) : Number(fresh.payload.codex_waits || 0) + 1;
        if (!known && waits >= P.codexWaitMax()) {
          P.setJob(job.id, { status: 'needs_human', finished_at: now(), payload: JSON.stringify({ ...fresh.payload, codex_waits: waits }), last_error: `CODEX-KẸT: Codex dùng được nhưng không làm được ${waits} lần liên tiếp (${res.reason}) — đã dừng tự chạy lại để khỏi đốt hạn mức Claude. Giám đốc: duyệt cho Claude làm thay (cli takeover ${job.id} claude) hoặc sửa Codex rồi chạy lại`, ...common });
          ev(`Việc #${job.id} DỪNG: Codex kẹt ${waits} lần liên tiếp (${res.reason}) → chờ giám đốc duyệt cho Claude làm thay`);
          break;
        }
        const at = known ? new Date(next.getTime() + 3000) : new Date(Date.now() + Number(process.env.STUDIO_CODEX_WAIT_MS ?? 10 * 60_000));
        P.setJob(job.id, { status: 'waiting_limit', wait_reason: 'codex', next_run_at: at.toISOString(), payload: JSON.stringify({ ...fresh.payload, codex_waits: waits }), last_error: `Chờ Codex: ${res.reason}`, ...common });
        ev(`Việc #${job.id} tạm dừng chờ Codex (${res.reason}) — tự chạy tiếp lúc ${at.toLocaleString('vi-VN')}${known ? '' : ` (lần ${waits}/${P.codexWaitMax()} liên tiếp)`}`);
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
    if (job.provider === 'claude') clearWaiting(job);
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
    try {
      P.autoScout();
    } catch (e) {
      console.error('[worker] tự tìm chủ đề:', e.message);
    }
    // Việc còn lại để Claude tự xử lý (giám đốc chốt 21/11/2026): video vướng ở sản xuất → tự xếp gỡ vướng; thành viên treo "đang làm" khi phòng hết việc → về rảnh.
    try {
      autoRescue();
    } catch (e) {
      console.error('[worker] tự gỡ vướng:', e.message);
    }
    try {
      S.sweepStaleMembers();
    } catch (e) {
      console.error('[worker] dọn thành viên treo:', e.message);
    }
    run("UPDATE jobs SET status='queued', updated_at=? WHERE status='waiting_limit' AND next_run_at<=?", now(), now());
    // Việc Claude đang chờ hồi limit/tài khoản: giữ dấu "⏳ Chờ" trên thẻ đội (cũng đúng sau khi worker khởi động lại, khi việc đã chờ từ trước).
    for (const j of all("SELECT * FROM jobs WHERE status='waiting_limit' AND provider='claude' AND wait_reason IN ('limit','no_account') AND kind IN ('plan','qc','rescue','scout')")) {
      markWaiting(j, j.wait_reason === 'limit' ? new Date(j.next_run_at) : null);
    }
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
        const account = P.pickAccount(provider, { dept: job.dept });
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
