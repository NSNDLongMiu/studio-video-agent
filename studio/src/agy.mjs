// Antigravity CLI (`agy`) = công cụ dòng lệnh Gemini cho gói Google AI Pro/Ultra (giám đốc thêm 20/11/2026).
// Gemini CLI cũ (`gemini`, npm @google/gemini-cli) đã NGỪNG nhận gói cá nhân và AI Pro từ 18/06/2026, nên KHÔNG dùng.
//  - agy chỉ giữ MỘT đăng nhập cho mỗi người dùng Windows (token ở Windows Credential Manager, tài liệu không có biến đổi
//    thư mục đăng nhập) => kho tài khoản chỉ có tối đa 1 ghế gemini và nó luôn dùng đăng nhập mặc định của máy.
//  - Luật 8 (không dịch vụ trả phí): mọi lượt gọi đều ép "useG1Credits": false (không tự tiêu credit trả phí) và bị gỡ hết
//    biến môi trường dẫn tới đường API khoá/ADC, vì các đường đó tính phí theo lượt.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/** Thư mục dữ liệu của agy (log, brain/<conversation_id>/ chứa ảnh nó sinh ra). Đổi bằng STUDIO_AGY_HOME khi kiểm thử. */
export const agyHome = () => process.env.STUDIO_AGY_HOME || path.join(os.homedir(), '.gemini', 'antigravity-cli');

/** {cmd, pre, shell} để spawn agy. STUDIO_AGY_JS (kiểm thử) chạy 1 file .js bằng node; mặc định tìm agy.exe do trình cài đặt đặt. */
export function findAgy() {
  if (process.env.STUDIO_AGY_JS) return { cmd: process.execPath, pre: [process.env.STUDIO_AGY_JS], shell: false };
  const dirs = [process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'agy', 'bin'), ...(process.env.PATH || '').split(path.delimiter)].filter(Boolean);
  for (const d of dirs) {
    const exe = path.join(d, process.platform === 'win32' ? 'agy.exe' : 'agy');
    if (fs.existsSync(exe)) return { cmd: exe, pre: [], shell: false };
  }
  return { cmd: 'agy', pre: [], shell: true };
}
export const agyExePath = () => {
  const a = findAgy();
  return a.pre.length ? a.pre[0] : a.cmd;
};

/** Mô hình mặc định của ghế agy: **Claude Opus 4.6 (Thinking)** (giám đốc chọn 20/11/2026; `agy models` liệt kê mô hình này cùng Gemini 3.8 Flash và GPT-OSS,
 *  đều nằm trong hạn mức gói Google AI Pro, không phải API riêng). Mã `claude-opus-4-6-thinking` lấy đúng từ `agy models`. Đổi bằng STUDIO_GEMINI_MODEL
 *  (vd `gemini-3.8-flash-medium`). Lưu ý: ghế này vẫn tên "Gemini" (ghế agy) nhưng mô hình mặc định là họ Claude, nên giọng Ý tưởng của nó kém độc lập hơn Gemini thật.
 *  Hết hạn mức mô hình mặc định thì tự chạy bằng mô hình dự phòng bên dưới (21/11/2026). */
export const AGY_DEFAULT_MODEL = 'claude-opus-4-6-thinking';
export const AGY_MODEL = () => process.env.STUDIO_GEMINI_MODEL || AGY_DEFAULT_MODEL;
/** Mô hình DỰ PHÒNG (giám đốc chốt 21/11/2026): mô hình mặc định hết hạn mức thì cùng lượt đó chạy lại bằng **Gemini 3.8 Flash (High)** (`gemini-3.8-flash-high`,
 *  mã lấy đúng từ `agy models`, cùng gói Google AI Pro, không tính phí riêng). Hạn mức của Claude Opus 4.6 trong agy tách khỏi hạn mức mô hình Gemini ("Third-party quota reached.
 *  Please switch to Gemini models"), nên Opus hết thì ghế vẫn chạy được bằng Flash. Đổi bằng STUDIO_GEMINI_FALLBACK_MODEL; đặt `none` để tắt dự phòng. */
export const AGY_FALLBACK_DEFAULT_MODEL = 'gemini-3.8-flash-high';
export const AGY_FALLBACK_MODEL = () => {
  const m = String(process.env.STUDIO_GEMINI_FALLBACK_MODEL ?? '').trim();
  return m.toLowerCase() === 'none' ? null : m || AGY_FALLBACK_DEFAULT_MODEL;
};
/** Danh sách mô hình thử theo thứ tự: mặc định trước, dự phòng sau (bỏ dự phòng nếu trùng hoặc tắt). */
export const AGY_MODEL_CHAIN = () => {
  const first = AGY_MODEL();
  const fb = AGY_FALLBACK_MODEL();
  return fb && fb !== first ? [first, fb] : [first];
};
/** Ép tắt tiêu credit trả phí cho riêng lượt chạy (không ghi vào settings.json của máy). */
export const AGY_SETTINGS = JSON.stringify({ useG1Credits: false });

/** Biến môi trường gỡ khỏi tiến trình con: toàn bộ là đường đi bằng khoá API / ADC / Vertex (tính phí theo lượt). */
export const AGY_DROP_ENV = ['GEMINI_API_KEY', 'GOOGLE_API_KEY', 'GOOGLE_GEMINI_BASE_URL', 'GOOGLE_GENAI_USE_VERTEXAI', 'GOOGLE_APPLICATION_CREDENTIALS', 'GOOGLE_CLOUD_PROJECT', 'GOOGLE_CLOUD_LOCATION', 'AGY_ADC_AUTH', 'NANOBANANA_API_KEY', 'NANOBANANA_GEMINI_API_KEY'];

/** Email đăng nhập đọc từ dòng "authenticated successfully as <email>" trong cli.log (agy không có lệnh in email). */
export function parseAgyEmail(text) {
  let last = null;
  for (const m of String(text || '').matchAll(/authenticated successfully as ([^\s,;]+@[^\s,;]+)/g)) last = m[1];
  return last;
}

/** Các thư mục agy "tin cậy" (settings.json → trustedWorkspaces). Thử thật 20/11/2026: nếu thư mục làm việc nằm trong vùng này thì agy ghi tự do
 *  cả bên ngoài thư mục làm việc (tạo file mới và ghi đè file có sẵn đều thành công, dù có `--sandbox`); nằm ngoài vùng này thì agy chỉ ghi được TRONG thư mục làm việc. */
export function trustedWorkspaces() {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(agyHome(), 'settings.json'), 'utf8'));
    return Array.isArray(j.trustedWorkspaces) ? j.trustedWorkspaces.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}
/** Trả về thư mục gốc trong `roots` chứa `dir` (so không phân biệt hoa thường, tính cả chính nó), hoặc null. */
export function insideAny(dir, roots) {
  const d = path.resolve(dir).toLowerCase() + path.sep;
  return roots.find((r) => {
    const x = path.resolve(r).toLowerCase();
    return d.startsWith(x.endsWith(path.sep) ? x : x + path.sep);
  }) || null;
}

/** Đã có dòng xác nhận đăng nhập trong log của agy chưa (kiểm miễn phí, không gọi mô hình). */
export function accountHasAgyLogin() {
  try {
    return !!parseAgyEmail(fs.readFileSync(path.join(agyHome(), 'cli.log'), 'utf8'));
  } catch {
    return false;
  }
}

/** Ảnh agy sinh ra nằm ở brain/<conversation_id>/ (không ghi vào thư mục làm việc). Trả về các file ảnh theo thứ tự thời gian. */
export function conversationImages(conversationId) {
  if (!/^[0-9a-f-]{8,64}$/i.test(String(conversationId || ''))) return [];
  const dir = path.join(agyHome(), 'brain', conversationId);
  let names = [];
  try {
    names = fs.readdirSync(dir);
  } catch {
    return [];
  }
  return names
    .filter((n) => /\.(png|jpe?g|webp)$/i.test(n))
    .map((n) => ({ file: path.join(dir, n), name: n, mtime: fs.statSync(path.join(dir, n)).mtimeMs }))
    .sort((a, b) => a.mtime - b.mtime || a.name.localeCompare(b.name));
}

/** Kích thước ảnh (PNG, JPEG) đọc từ phần đầu file, để QC thấy ngay ảnh vuông 1:1 hay dọc 9:16 mà không phải mở ảnh. null nếu không đọc được. */
export function imageSize(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47 && buf.toString('ascii', 12, 16) === 'IHDR') return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1];
      if (marker === 0xff) {
        i++;
        continue;
      }
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        i += 2;
        continue;
      }
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      i += 2 + len;
    }
  }
  return null;
}

/** Đọc đầu ra JSON của `agy -p --output-format json` (có thể lẫn dòng cảnh báo). */
export function parseAgyJson(out) {
  const t = String(out || '').trim();
  try {
    return JSON.parse(t);
  } catch {
    /* thử từng dòng từ cuối */
  }
  for (const line of t.split(/\r?\n/).reverse()) {
    if (!line.trimStart().startsWith('{')) continue;
    try {
      const o = JSON.parse(line);
      if (o && typeof o === 'object' && 'status' in o) return o;
    } catch {
      /* dòng khác */
    }
  }
  return null;
}
