// Nhận diện "hết limit / lỗi đăng nhập" từ đầu ra của claude / codex và đọc giờ hồi limit.
// LƯU Ý: cả hai hãng KHÔNG công bố định dạng chính thức của thông báo này. Các mẫu dưới đây lấy từ
// báo cáo của người dùng; vì vậy bộ phân tích chịu lỗi: không đọc được giờ hồi -> trả null và hệ thống
// lùi dần (backoff) rồi thử lại. Nguyên văn thông báo luôn được lưu để chỉnh lại mẫu khi gặp mẫu mới.

const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
const DAYS = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

// ---------- múi giờ ----------
function validTz(tz) {
  if (!tz) return undefined;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return tz;
  } catch {
    return undefined;
  }
}
function partsIn(ms, tz) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'short' });
  const p = Object.fromEntries(f.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return { y: +p.year, mo: +p.month - 1, d: +p.day, h: +p.hour % 24, mi: +p.minute, s: +p.second, wd: DAYS[p.weekday.slice(0, 3).toLowerCase()] };
}
function localParts(ms) {
  const d = new Date(ms);
  return { y: d.getFullYear(), mo: d.getMonth(), d: d.getDate(), h: d.getHours(), mi: d.getMinutes(), s: d.getSeconds(), wd: d.getDay() };
}
const nowParts = (ms, tz) => (tz ? partsIn(ms, tz) : localParts(ms));

// Giờ "treo tường" (y,mo,d,h,mi) trong múi tz -> thời điểm UTC. Không có tz => giờ máy.
function wallToDate(y, mo, d, h, mi, tz) {
  if (!tz) return new Date(y, mo, d, h, mi, 0, 0);
  const guess = Date.UTC(y, mo, d, h, mi, 0);
  const off = (t) => {
    const p = partsIn(t, tz);
    return Date.UTC(p.y, p.mo, p.d, p.h, p.mi, p.s) - Math.floor(t / 1000) * 1000;
  };
  let t = guess - off(guess);
  t = guess - off(t);
  return new Date(t);
}

// ---------- đọc giờ hồi limit ----------
function hour24(h, ampm) {
  h = Number(h);
  if (!ampm) return h;
  ampm = ampm.toLowerCase();
  if (ampm === 'pm' && h < 12) return h + 12;
  if (ampm === 'am' && h === 12) return 0;
  return h;
}

export function parseResetTime(text, now = new Date()) {
  const t = String(text || '');
  const nowMs = now.getTime();
  let found = null;

  // 1) epoch giây sau dấu | (định dạng cũ của Claude: "limit reached|1760000000")
  let m = /\|\s*(\d{10})\b/.exec(t);
  if (m) found = new Date(Number(m[1]) * 1000);

  // 2) tương đối: "try again in 3 days 4 hours 12 minutes", "in 2 seconds"
  if (!found) {
    // `(?![a-z])` thay cho `\b` sau đơn vị để đọc được dạng viết liền "4h8m57s" (agy/Gemini: "Resets in 4h8m57s"); "3 more" vẫn không bị nhầm là 3 phút.
    m = /\b(?:in|after)\s+((?:\d+(?:\.\d+)?\s*(?:days?|d|hours?|hrs?|h|minutes?|mins?|m|seconds?|secs?|s)(?![a-z])[\s,]*(?:and\s+)?)+)/i.exec(t);
    if (m) {
      let ms = 0;
      for (const u of m[1].matchAll(/(\d+(?:\.\d+)?)\s*(days?|d|hours?|hrs?|h|minutes?|mins?|m|seconds?|secs?|s)(?![a-z])/gi)) {
        const n = Number(u[1]);
        const k = u[2].toLowerCase()[0];
        ms += n * (k === 'd' ? DAY : k === 'h' ? HOUR : k === 'm' ? MIN : 1000);
      }
      if (ms > 0) found = new Date(nowMs + ms);
    }
  }

  // 3) ngày có tên tháng: "at Jul 7th, 2026 12:35 AM" / "after Aug 27, 00:08"
  if (!found) {
    m = /\b(?:at|after|until|on)\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?,?\s+(?:at\s+)?(\d{1,2}):(\d{2})\s*(am|pm)?/i.exec(t);
    if (m) {
      const tz = validTz(/\(([A-Za-z_]+\/[A-Za-z_+\-0-9/]+|UTC|GMT)\)/.exec(t)?.[1]);
      const mo = MONTHS[m[1].toLowerCase()];
      const h = hour24(m[4], m[6]);
      const yNow = nowParts(nowMs, tz).y;
      let d = wallToDate(m[3] ? Number(m[3]) : yNow, mo, Number(m[2]), h, Number(m[5]), tz);
      if (!m[3] && d.getTime() < nowMs - DAY) d = wallToDate(yNow + 1, mo, Number(m[2]), h, Number(m[5]), tz);
      found = d;
    }
  }

  // 4) chỉ có giờ: "resets 3pm (Asia/Saigon)", "reset at 3:45pm", "resets Mon 12:00am"
  if (!found) {
    m = /\b(?:resets?(?:\s+at)?|until)\s+(?:(sun|mon|tue|wed|thu|fri|sat)[a-z]*\.?,?\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?(?:\s*\(([A-Za-z_]+\/[A-Za-z_+\-0-9/]+|UTC|GMT)\))?/i.exec(t);
    if (m && (m[4] || m[3] || m[1])) {
      const tz = validTz(m[5]);
      const h = hour24(m[2], m[4]);
      const mi = m[3] ? Number(m[3]) : 0;
      const p = nowParts(nowMs, tz);
      if (h <= 23 && mi <= 59) {
        for (let add = 0; add <= 7; add++) {
          const base = wallToDate(p.y, p.mo, p.d + add, h, mi, tz);
          const wd = nowParts(base.getTime() + 2 * HOUR, tz).wd;
          if (m[1] && wd !== DAYS[m[1].toLowerCase().slice(0, 3)] && nowParts(base.getTime(), tz).wd !== DAYS[m[1].toLowerCase().slice(0, 3)]) continue;
          if (base.getTime() > nowMs) {
            found = base;
            break;
          }
        }
      }
    }
  }

  if (!found || Number.isNaN(found.getTime())) return null;
  // Phi lý (quá khứ xa hoặc > 14 ngày) => coi như không đọc được.
  if (found.getTime() < nowMs - MIN || found.getTime() > nowMs + 14 * DAY) return null;
  return found;
}

// ---------- phân loại lỗi ----------
const LIMIT_PATTERNS = [
  /(?:usage|session|weekly|daily|monthly|5[- ]?hour|rate|message|opus|sonnet)\s+limits?\s+(?:has\s+been\s+|was\s+|is\s+)?(?:reached|exceeded|hit)/i,
  /(?:hit|reached|exceeded)\s+(?:your|the)\s+(?:[\w-]+\s+){0,3}limit/i,
  /limit\s+(?:will\s+)?resets?/i,
  /usage limit/i,
  /rate[_ -]?limit/i,
  /too many requests/i,
  /\b429\b/,
  /quota\s+(?:exceeded|exhausted|reached)/i,
  /insufficient[_ ]quota/i,
  /credit balance is too low/i,
  /out of (?:extra )?usage/i,
  /try again (?:at|after|in|later)/i,
  // agy (Gemini, gói Google AI Pro): định dạng thông báo chưa được công bố; mẫu theo thông báo gRPC/Google thường gặp.
  // Gặp mẫu mới thì nguyên văn đã nằm ở khung Tài khoản để bổ sung vào đây.
  /RESOURCE_EXHAUSTED/,
  /(?:weekly|5[- ]?hour) (?:quota|limit)/i,
  /(?:quota|credits?) (?:has |have |is |are )?(?:been )?(?:exhausted|depleted|used up)/i,
];
const AUTH_PATTERNS = [
  /not logged in/i,
  /please (?:run\s+)?\/?(?:login|log in|sign in)/i,
  /(?:log|sign) in again/i,
  /authentication[_ ]?(?:failed|error)/i,
  /invalid (?:api[- ]key|x-api-key|authentication|credentials)/i,
  /(?:oauth )?token (?:has )?(?:expired|been revoked)/i,
  /session expired/i,
  /\b401\b|unauthori[sz]ed/i,
  /could not (?:find|load|read) (?:your )?credentials/i,
  /refresh token/i,
  /authentication required/i, // agy chạy nền khi chưa đăng nhập
];
const STRONG_LIMIT = LIMIT_PATTERNS.slice(0, 5);

function excerpt(lines, i) {
  return lines.slice(i, i + 2).join(' ').replace(/\s+/g, ' ').trim().slice(0, 300);
}

/** Trả về {type:'limit'|'auth'|'other', resetAt:Date|null, raw}. Chỉ nên gọi trên đầu ra của lần chạy THẤT BẠI. */
export function classifyFailure(text, now = new Date()) {
  const lines = String(text || '').split(/\r?\n/).filter((l) => l.trim());
  const tail = lines.slice(-60);
  const li = tail.findIndex((l) => LIMIT_PATTERNS.some((re) => re.test(l)));
  const ai = tail.findIndex((l) => AUTH_PATTERNS.some((re) => re.test(l)));
  const strong = tail.some((l) => STRONG_LIMIT.some((re) => re.test(l)));
  if (li >= 0 && (ai < 0 || strong)) {
    const raw = excerpt(tail, li);
    return { type: 'limit', resetAt: parseResetTime(tail.slice(li).join(' '), now) || parseResetTime(tail.join(' '), now), raw };
  }
  if (ai >= 0) return { type: 'auth', resetAt: null, raw: excerpt(tail, ai) };
  return { type: 'other', resetAt: null, raw: tail.slice(-3).join(' ').slice(0, 300) };
}

/** Lùi dần khi không đọc được giờ hồi: 30p, 1h, 2h, 4h, tối đa 6h. */
export const backoffMs = (consecutive) => Math.min(6 * HOUR, 30 * MIN * 2 ** Math.max(0, consecutive - 1));
