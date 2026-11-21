// Văn phòng 2D chỉ hiện BỘ CORE của đội (giám đốc duyệt 18/11/2026). Mỗi phiên Claude/Codex được nhận vai rồi
//  - phiên thuộc 1 vị trí core -> hiện, tên nhân vật = "<vị trí> · <ai làm>" (vd "Kịch bản · Codex cùng viết", "Kịch bản · Claude viết & chốt");
//  - phiên điều phối (/make-plan), agent phụ (tra cứu, gọi thử tài khoản…) -> đánh dấu "agent con" nên bị ẩn mặc định
//    (công tắc "agent con" sẵn có trên trang vẫn bật xem được);
//  - phiên không thuộc xưởng (giám đốc tự dùng tài khoản) -> giữ nguyên; riêng bản có chỗ ngồi cố định (seats) thì ẩn như agent con.
// VÒNG ĐỜI (giám đốc yêu cầu 18/11/2026): mỗi vị trí core chỉ có 1 nhân vật; agent phụ/agent con chỉ hiện khi đang làm
// (hoặc vừa xong GRACE giây để thấy "xong"), làm xong thì bị dọn khỏi sàn và vào ngăn "Đã gọi" (history) để xem lại.
// CHỖ NGỒI CỐ ĐỊNH (giám đốc yêu cầu 18/11/2026, thay cho "sàn chỉ có người đang làm"): bản chính của phòng luôn có đủ các vị trí core
// của đội; vị trí chưa có phiên nào thì hiện 1 nhân vật "rảnh" (xem SEATS_CORE/buildView), có việc thì nhân vật thật thay vào.
// Chỉ đọc file log Claude/Codex tự ghi; không sửa công cụ đã ghim. office-proxy.mjs áp lên dữ liệu trước khi tới trình duyệt.
import fs from 'node:fs';
import path from 'node:path';

export const CORE_LABELS = ['Ý tưởng', 'Kịch bản', 'Đạo diễn hình ảnh', 'Sản xuất', 'QC', 'Gỡ vướng', 'Tìm chủ đề'];

// agent con của Claude (Agent tool, đọc agentType trong *.meta.json) -> tên nhân vật; null = ẩn
const SUBAGENT_ROLE = {
  'ideator-a': 'Ý tưởng · Claude',
  'ideator-b': 'Ý tưởng · Claude chốt',
  planner: 'Kịch bản · Claude viết & chốt',
  'visual-director': 'Đạo diễn hình ảnh · Claude duyệt',
  'dept-head': 'Trưởng phòng',
  support: null, // phiên chính /qc hoặc /rescue đã hiện vị trí rồi
};
// phiên chính của worker (claude -p "<lệnh>"); null = ẩn (điều phối, không phải vị trí core)
const COMMAND_ROLE = [
  [/^\/make-plan\b/, null],
  [/^\/qc\b/, 'QC · Claude'],
  [/^\/rescue\b/, 'Gỡ vướng · Claude'],
  [/^\/scout-topics\b/, 'Tìm chủ đề · Claude'],
  [/^\/dept-review\b/, 'Trưởng phòng'],
];
// dòng đánh dấu [[STUDIO-ROLE:x]] mà xưởng chèn đầu prompt Codex (codex-ideate/codex-write/producer)
const CODEX_ROLE = { idea: 'Ý tưởng · Codex', script: 'Kịch bản · Codex cùng viết', storyboard: 'Đạo diễn hình ảnh · Codex làm', producer: 'Sản xuất · Codex' };

/** Hàm thuần. info: { agentType, firstPrompt, marker }. Trả { role, hide, label? } (role null + hide false = không thuộc xưởng, giữ nguyên).
 *  label = tên hiện trong ngăn "Đã gọi" cho agent bị ẩn. */
export function classify(s, info = {}) {
  const base = path.basename(String(s.cwd || ''));
  if (/^studio-probe-/.test(base)) return { role: null, hide: true, label: 'Gọi thử tài khoản' };
  if (s.agent === 'claude') {
    if (s.subagent) {
      if (info.agentType in SUBAGENT_ROLE) return SUBAGENT_ROLE[info.agentType] ? { role: SUBAGENT_ROLE[info.agentType], hide: false } : { role: null, hide: true, label: `Hỗ trợ (${info.agentType})` };
      return { role: null, hide: true, label: `Agent phụ · ${info.agentType || 'Claude'}` }; // Explore, general-purpose… = agent phụ
    }
    const p = String(info.firstPrompt || '').trim();
    for (const [re, role] of COMMAND_ROLE) if (re.test(p)) return role ? { role, hide: false } : { role: null, hide: true, label: 'Điều phối kế hoạch' };
    return { role: null, hide: false };
  }
  if (s.agent === 'codex') {
    // phiên con của Codex (vd "codex-auto-review" duyệt lệnh) không phải vị trí core, dù log của nó chép lại dòng đánh dấu của phiên mẹ
    if (s.parentId) return { role: null, hide: true, label: s.model === 'codex-auto-review' ? 'Codex tự duyệt lệnh' : 'Agent phụ · Codex' };
    if (CODEX_ROLE[info.marker]) return { role: CODEX_ROLE[info.marker], hide: false };
    if (/^codex-ideate-/.test(base)) return { role: CODEX_ROLE.idea, hide: false }; // phiên cũ chưa có dòng đánh dấu
    return { role: null, hide: false };
  }
  return { role: null, hide: false };
}

export function applyRole(s, r) {
  if (r.hide) return { ...s, subagent: true };
  if (!r.role) return s;
  return { ...s, subagent: false, project: r.role, title: r.role };
}

/** Tra cứu thông tin phiên từ file log (có cache; file log chỉ ghi thêm nên dòng đầu/meta không đổi). */
export function createLookup({ claudeDir, codexDir }) {
  const files = new Map(); // id -> { jsonl, meta } (claude) | rollout file (codex)
  let lastScan = 0;
  const memo = new Map();
  const ls = (d) => {
    try {
      return fs.readdirSync(d, { withFileTypes: true });
    } catch {
      return [];
    }
  };
  function scan() {
    if (Date.now() - lastScan < 3000) return;
    lastScan = Date.now();
    const proj = claudeDir ? path.join(claudeDir, 'projects') : null;
    if (proj)
      for (const p of ls(proj)) {
        if (!p.isDirectory()) continue;
        const pd = path.join(proj, p.name);
        for (const e of ls(pd)) {
          if (e.isFile() && e.name.endsWith('.jsonl')) files.set(`claude:${e.name.slice(0, -6)}`, { jsonl: path.join(pd, e.name) });
          else if (e.isDirectory())
            for (const s of ls(path.join(pd, e.name, 'subagents')))
              if (s.isFile() && s.name.endsWith('.meta.json')) files.set(`claude:${s.name.slice(0, -10)}`, { meta: path.join(pd, e.name, 'subagents', s.name) });
        }
      }
    const sess = codexDir ? path.join(codexDir, 'sessions') : null;
    const walk = (d, depth) => {
      for (const e of ls(d)) {
        const f = path.join(d, e.name);
        if (e.isDirectory() && depth < 4) walk(f, depth + 1);
        else if (e.isFile() && e.name.endsWith('.jsonl')) {
          const m = /([0-9a-f]{8}-[0-9a-f-]{27,})\.jsonl$/i.exec(e.name);
          if (m) files.set(`codex:${m[1]}`, f);
        }
      }
    };
    if (sess) walk(sess, 0);
  }
  const head = (file, bytes = 65536) => {
    try {
      const fd = fs.openSync(file, 'r');
      const buf = Buffer.alloc(bytes);
      const n = fs.readSync(fd, buf, 0, bytes, 0);
      fs.closeSync(fd);
      return buf.subarray(0, n).toString('utf8').split('\n');
    } catch {
      return [];
    }
  };
  function compute(s) {
    const key = `${s.agent}:${s.id}`;
    let f = files.get(key);
    if (!f) (scan(), (f = files.get(key)));
    if (!f) return null;
    if (s.agent === 'claude' && f.meta) {
      try {
        return { agentType: JSON.parse(fs.readFileSync(f.meta, 'utf8')).agentType };
      } catch {
        return null;
      }
    }
    if (s.agent === 'claude' && f.jsonl) {
      for (const line of head(f.jsonl)) {
        try {
          const d = JSON.parse(line);
          if (d.type !== 'user' || d.isSidechain) continue;
          const c = d.message?.content;
          const text = typeof c === 'string' ? c : Array.isArray(c) ? c.filter((x) => x.type === 'text').map((x) => x.text).join('\n') : '';
          if (text) return { firstPrompt: text };
        } catch {
          /* dòng dở dang */
        }
      }
      return null; // chưa có câu hỏi đầu -> thử lại lần sau
    }
    if (s.agent === 'codex') {
      const m = /\[\[STUDIO-ROLE:([a-z]+)\]\]/.exec(head(f, 262144).join('\n'));
      return { marker: m ? m[1] : '' };
    }
    return null;
  }
  return (s) => {
    const key = `${s.agent}:${s.id}`;
    if (memo.has(key)) return memo.get(key);
    const v = compute(s);
    // Codex chưa ghi xong prompt đầu (phiên mới < 2 phút) thì chưa nhớ kết quả rỗng, lần sau đọc lại.
    if (v && !(s.agent === 'codex' && !v.marker && Date.now() - (s.startedAt || 0) < 120_000)) memo.set(key, v);
    return v || {};
  };
}

// ---- Vòng đời: agent làm xong thì rời sàn, vào ngăn "Đã gọi" (chỗ ngồi cố định xem bên dưới) ----
export const GRACE_MS = Number(process.env.STUDIO_OFFICE_GRACE_MS) || 45_000; // sau khi xong còn hiện bấy nhiêu để thấy "✓ xong"
const ACTIVE = new Set(['thinking', 'tool', 'typing', 'waiting']);
const FINISHED = new Set(['done', 'idle', 'interrupted', 'error']);
const clean = (t, n) => {
  const x = String(t ?? '').replace(/\[\[STUDIO-ROLE:[a-z]+\]\]/g, '').replace(/\s+/g, ' ').trim();
  return x.length > n ? `${x.slice(0, n - 1)}…` : x;
};

function historyEntry(s, r) {
  return {
    key: s.key || `${s.agent}:${s.id}`,
    agent: s.agent,
    label: r.role || r.label || s.project || 'Agent phụ',
    role: r.role || null,
    sub: !!(s.subagent || s.parentId),
    model: s.model || '',
    status: s.status || '',
    startedAt: s.startedAt || null,
    endedAt: s.lastEventAt || null,
    task: clean(s.prompt, 220),
    result: clean(s.error || s.reply, 360),
  };
}

// ---- Chỗ ngồi cố định của đội (giám đốc yêu cầu 18/11/2026): luôn thấy đủ các vị trí core; rảnh thì ngồi chờ ----
// Công cụ gốc chỉ vẽ phiên có thật, nên vị trí đang rảnh được thêm 1 phiên "ảo" trạng thái idle (nhân vật đi lại/ngủ gật ở
// sàn, không ngồi bàn); vị trí có phiên thật (đang làm hoặc vừa xong) thì không thêm. `agent` chỉ chọn màu áo/biểu tượng:
// bên làm chính của vị trí (Đạo diễn/Sản xuất: Codex làm; Ý tưởng, Kịch bản, QC, Gỡ vướng, Tìm chủ đề: Claude; Kịch bản đổi 20/11/2026).
// `by` = tài khoản nào làm việc của vị trí đó (chỉ cần 1 trong danh sách được theo dõi là thấy được). Bản văn phòng của phòng
// chưa được cấp tài khoản đó thì KHÔNG thấy việc của vị trí → chỗ ngồi ghi "chưa theo dõi", không giả vờ "rảnh" (luật 7: nói thật).
export const SEATS_CORE = [
  { pos: 'Ý tưởng', agent: 'claude', by: ['claude', 'codex'] },
  { pos: 'Kịch bản', agent: 'claude', by: ['claude', 'codex'] },
  { pos: 'Đạo diễn hình ảnh', agent: 'codex', by: ['codex'] },
  { pos: 'Sản xuất', agent: 'codex', by: ['codex'] },
  { pos: 'QC', agent: 'claude', by: ['claude'] },
  { pos: 'Gỡ vướng', agent: 'claude', by: ['claude'] },
];
export const SCOUT_SEAT = { pos: 'Tìm chủ đề', agent: 'claude', by: ['claude'] };
const VENDOR = { claude: 'Claude', codex: 'Codex' };
/** Các chỗ ngồi của 1 phòng: 6 vị trí core, thêm Tìm chủ đề khi phòng bật tự tìm chủ đề.
 *  tracked = { claude, codex }: bản văn phòng này đang đọc tài khoản nào (không truyền = coi như đọc được cả hai). */
export function seatsFor({ scout = false, tracked = { claude: true, codex: true } } = {}) {
  return (scout ? [...SEATS_CORE, SCOUT_SEAT] : [...SEATS_CORE]).map((s) => ({ ...s, blind: !s.by.some((v) => tracked[v]) }));
}
/** Truyền qua dòng lệnh của lớp chuyển tiếp: "Ý tưởng:claude,QC:claude:x,…" (:x = chưa theo dõi; tên vị trí không chứa , hay :). */
export const encodeSeats = (seats) => seats.map((s) => `${s.pos}:${s.agent}${s.blind ? ':x' : ''}`).join(',');
export function decodeSeats(text) {
  return String(text || '')
    .split(',')
    .map((x) => x.split(':'))
    .filter(([pos, agent]) => pos && (agent === 'claude' || agent === 'codex'))
    .map(([pos, agent, blind]) => ({ pos: pos.trim(), agent, blind: blind === 'x' }));
}
function seatSession(seat, i, stamp) {
  const by = ([...SEATS_CORE, SCOUT_SEAT].find((x) => x.pos === seat.pos)?.by || [seat.agent]).map((v) => VENDOR[v]).join('/');
  const label = `${seat.pos} · ${seat.blind ? 'chưa theo dõi' : 'rảnh'}`;
  return {
    key: `studio-seat:${i}`,
    agent: seat.agent,
    id: `studio-seat-${i}`,
    sessionId: null,
    parentId: null,
    subagent: false,
    cwd: '',
    project: label,
    title: label,
    model: '',
    status: 'idle',
    stuck: 0,
    context: null,
    today: { turns: 0, tokens: 0 },
    activity: null,
    prompt: '',
    reply: seat.blind ? `Phòng chưa được cấp tài khoản ${by} nên Văn phòng không thấy việc của vị trí này — xem dashboard để biết đang làm hay rảnh.` : 'Rảnh — chưa được giao việc.',
    error: null,
    turnStartedAt: null,
    lastEventAt: stamp, // mới nhất => công cụ gốc xếp lên trước phiên khác khi giới hạn số người đi lại
    startedAt: stamp,
    source: 'magpie', // chỉ để công cụ gốc không hiện nút "copy lệnh resume" cho phiên không có thật
  };
}

/** Tách snapshot thành { sessions: còn hiện trên sàn, history: đã dọn }. Hàm thuần (now truyền vào để test).
 *  seats: các chỗ ngồi cố định (xem trên); vị trí chưa có phiên nào trên sàn được thêm 1 nhân vật "rảnh". */
export function buildView(snap, lookup, now = Date.now(), grace = GRACE_MS, seats = []) {
  // Có chỗ ngồi cố định = bản văn phòng chỉ dành cho đội: phiên ngoài xưởng (giám đốc tự dùng tài khoản của phòng, việc giao
  // Codex để sửa hệ thống…) bị ẩn khỏi sàn như agent con (công tắc "agent con" trên trang vẫn bật xem được), không vào ngăn "Đã gọi".
  const strict = seats.length > 0;
  const rows = (snap?.sessions || []).map((s) => {
    const r = classify(s, lookup(s));
    const main = !r.role && !r.hide && !s.subagent && !s.parentId;
    return { s, r, view: strict && main ? { ...s, subagent: true } : applyRole(s, r), main };
  });
  const visible = [];
  const dropped = [];
  const activeRoles = new Set(rows.filter((x) => x.r.role && ACTIVE.has(x.s.status)).map((x) => x.r.role));
  const keptFinished = new Set(); // mỗi vị trí chỉ giữ 1 phiên đã xong (mới nhất) khi chưa có phiên đang làm
  for (const x of rows.sort((a, b) => (b.s.lastEventAt || 0) - (a.s.lastEventAt || 0))) {
    if (x.main || !FINISHED.has(x.s.status)) {
      visible.push(x); // phiên chính của giám đốc luôn để công cụ gốc tự xử lý; phiên đang làm luôn hiện
      continue;
    }
    const fresh = now - (x.s.lastEventAt || 0) < grace;
    const slot = x.r.role && !activeRoles.has(x.r.role) && !keptFinished.has(x.r.role);
    if (fresh && (!x.r.role || slot)) {
      visible.push(x);
      if (x.r.role) keptFinished.add(x.r.role);
    } else dropped.push(x);
  }
  const order = new Map((snap?.sessions || []).map((s, i) => [s.key || `${s.agent}:${s.id}`, i]));
  visible.sort((a, b) => (order.get(a.s.key || `${a.s.agent}:${a.s.id}`) ?? 0) - (order.get(b.s.key || `${b.s.agent}:${b.s.id}`) ?? 0));
  const covered = new Set(visible.filter((x) => x.r.role).map((x) => x.r.role.split(' · ')[0]));
  const stamp = Math.ceil(now / 60_000) * 60_000; // đổi mỗi phút (không đổi từng giây) để không đẩy lại dữ liệu liên tục
  const idle = seats.map((st, i) => (covered.has(st.pos) ? null : seatSession(st, i, stamp))).filter(Boolean);
  return {
    sessions: [...visible.map((x) => x.view), ...idle],
    history: dropped.filter((x) => x.r.role || x.r.hide || x.s.subagent || x.s.parentId).map((x) => historyEntry(x.s, x.r)),
  };
}

export function transformSnapshot(snap, lookup, now = Date.now(), grace = GRACE_MS, seats = []) {
  if (!snap || !Array.isArray(snap.sessions)) return snap;
  const v = buildView(snap, lookup, now, grace, seats);
  return { ...snap, sessions: v.sessions, studioHidden: v.history.length };
}

export function historyOf(snap, lookup, now = Date.now(), grace = GRACE_MS) {
  if (!snap || !Array.isArray(snap.sessions)) return [];
  return buildView(snap, lookup, now, grace).history.slice(0, 150);
}
