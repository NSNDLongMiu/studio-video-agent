// Hiển thị tổng quan dạng văn bản (cho terminal và cho Claude/Codex đọc nhanh).
const ICON = { working: '●', idle: '○', blocked: '✖', offline: '·' };
const STATUS_VI = { working: 'đang làm', idle: 'rảnh', blocked: 'VƯỚNG', offline: 'nghỉ' };
const STAGE_VI = { ideation: 'ý tưởng', planning: 'kế hoạch', production: 'sản xuất', review: 'duyệt/QC', ready: 'sẵn sàng đăng', published: 'đã đăng', rejected: 'huỷ' };
const JOB_VI = { queued: 'xếp hàng', running: 'ĐANG CHẠY', waiting_limit: 'CHỜ', succeeded: 'xong', failed: 'thất bại', needs_human: 'CẦN NGƯỜI', cancelled: 'đã huỷ' };
export { STAGE_VI, STATUS_VI, JOB_VI };

const when = (iso) => (iso ? new Date(iso).toLocaleString('vi-VN') : '?');
const left = (iso) => {
  const ms = Date.parse(iso) - Date.now();
  if (!(ms > 0)) return 'sắp xong';
  const m = Math.round(ms / 60000);
  return m >= 1440 ? `${Math.floor(m / 1440)} ngày ${Math.floor((m % 1440) / 60)}g` : m >= 60 ? `${Math.floor(m / 60)}g ${m % 60}p` : `${m}p`;
};

/** Tài khoản + hàng đợi + worker. only: 'accounts' | 'jobs' để in riêng 1 phần. */
export function formatPool(pool, { only } = {}) {
  const L = [];
  if (only !== 'jobs') {
    L.push('TÀI KHOẢN');
    if (!pool.accounts.length) L.push('  (chưa có — thêm bằng: node studio/src/cli.mjs accounts add <claude|codex> <nhãn> --owner "Tên")');
    for (const a of pool.accounts) {
      const st = a.status === 'ready' ? (a.capped ? 'đủ số lượt/ngày' : 'sẵn sàng') : a.status === 'limited' ? `HẾT LIMIT — hồi ${when(a.limited_until)} (còn ${left(a.limited_until)})` : a.status === 'auth_error' ? 'LỖI ĐĂNG NHẬP' : 'tắt';
      L.push(`  ${a.status === 'ready' ? '●' : a.status === 'limited' ? '⏳' : a.status === 'disabled' ? '·' : '✖'} ${a.person}${a.owner ? ` (chủ: ${a.owner})` : ''} ${a.dept ? `→ phòng ${a.dept}` : '(dùng chung)'} [${a.kind === 'api_key' ? 'API trả phí' : 'gói'}] ${st} · hôm nay ${a.runs_today} lượt${a.last_limit_raw && a.status === 'limited' ? ` · "${a.last_limit_raw.slice(0, 90)}"` : ''}`);
    }
  }
  if (only === 'accounts') return L.join('\n');
  if (only !== 'jobs') {
    const w = pool.worker;
    L.push('', `WORKER: ${w.alive ? `đang chạy (pid ${w.pid}, ${w.running} việc)` : '⚠ KHÔNG CHẠY — bật bằng "npm run start --prefix studio"'}`);
  }
  L.push('', 'HÀNG ĐỢI VIỆC');
  if (!pool.jobs.length) L.push('  (trống)');
  for (const j of pool.jobs) {
    const extra = j.status === 'waiting_limit' ? (j.wait_reason === 'no_account' ? ` — chưa có tài khoản ${j.provider} dùng được` : ` — chờ hồi limit, tự chạy lại ${when(j.next_run_at)} (còn ${left(j.next_run_at)})`) : j.last_error && !['succeeded'].includes(j.status) ? ` — ${j.last_error.slice(0, 120)}` : '';
    L.push(`  #${j.id} [${j.kind}] ${JOB_VI[j.status]} · ${j.title}${j.attempts ? ` · lần thử ${j.attempts}` : ''}${extra}`);
  }
  return L.join('\n');
}

const deptAccounts = (pool, slug) => {
  const xs = (pool.accounts || []).filter((a) => a.dept === slug);
  return xs.length ? xs.map((a) => `${a.person}${a.status === 'ready' || (a.status === 'auth_error' && !a.email) ? '' : ` (${a.status === 'auth_error' ? 'lỗi đăng nhập' : a.status === 'limited' ? 'hết limit' : 'tắt'})`}`).join(' + ') : 'chưa cấp — dùng tài khoản dùng chung, không theo dõi trên Văn phòng 2D';
};

export function formatOverview(o, pool) {
  const t = o.totals;
  const L = [];
  L.push(`XƯỞNG VIDEO — ${o.today} · ${t.departments_active} phòng · ${t.teams} đội · ${t.members} người (${t.members_working} đang làm, ${t.members_blocked} vướng)`);
  L.push(`Hôm nay: ${t.videos_done_today}/${t.videos_planned_today} video xong · chỉ tiêu ${t.target_today} · năng lực ${t.capacity_today} · ${t.videos_active} video đang làm · ${t.topics_open} chủ đề chưa giao`);
  const attention = [...o.attention, ...(pool?.attention || [])];
  if (attention.length) {
    L.push('', 'CẦN GIÁM ĐỐC CHÚ Ý:');
    for (const a of attention) L.push(`  ! ${a.message}${a.until ? ` (tự chạy tiếp ${when(a.until)}, còn ${left(a.until)})` : ''}`);
  }
  for (const d of o.departments) {
    L.push('');
    if (d.status === 'closed') {
      L.push(`■ ${d.name} [${d.slug}] — ĐÃ ĐÓNG`);
      if (pool) L.push(`  Tài khoản được cấp: ${deptAccounts(pool, d.slug)}`);
      continue;
    }
    const flag = d.gap_videos > 0 ? `THIẾU ${d.gap_videos}` : d.surplus_teams > 0 ? `dư ${d.surplus_teams} đội` : 'đủ';
    L.push(`■ ${d.name} [${d.slug}] — chỉ tiêu ${d.daily_target}/ngày · ${d.teams.length} đội · năng lực ${d.capacity} (${flag}) · hôm nay ${d.done_today}/${d.planned_today} xong · ${d.members_working}/${d.members_total} người đang làm`);
    if (pool) L.push(`  Tài khoản được cấp: ${deptAccounts(pool, d.slug)}`);
    L.push(`  Chủ đề chung: ${d.description || '(chưa ghi mô tả phòng)'} · Tự tìm chủ đề: ${d.auto_topics ? `BẬT (đội đề xuất, giám đốc duyệt)${d.topics_proposed ? ` — ${d.topics_proposed} chủ đề chờ duyệt` : ''}` : 'TẮT (chỉ giám đốc đưa chủ đề)'}`);
    if (!d.teams.length) L.push('    (chưa có đội nào)');
    for (const tm of d.teams) {
      L.push(`  ▸ #${tm.id} ${tm.name} — hôm nay ${tm.used_today}/${tm.capacity_per_day} suất`);
      for (const m of tm.members) {
        if (m.role === 'scout' && !d.auto_topics && m.status === 'idle') continue; // chỉ hiện khi phòng bật tự tìm chủ đề
        const age = m.status === 'working' ? ` (${m.minutes_since_update}p trước${m.stale ? ' ⚠ im lặng' : ''})` : '';
        L.push(`      ${ICON[m.status]} ${m.label} [${m.engine}] ${STATUS_VI[m.status]}${m.task ? `: ${m.task}` : ''}${m.video_id ? ` {${m.video_id}}` : ''}${age}`);
      }
      for (const v of tm.videos) L.push(`      ▫ ${v.id} — ${STAGE_VI[v.stage]}${v.needs_help ? ' 🆘 ' + v.help_reason : ''}`);
    }
    for (const p of d.pending_proposals) L.push(`  ⏳ Đề xuất #${p.id}: ${p.type === 'add_team' ? `thêm ${p.payload.count} đội` : `giải thể đội #${p.payload.team_id}`} — ${p.reason}`);
  }
  if (pool) L.push('', formatPool(pool));
  return L.join('\n');
}
