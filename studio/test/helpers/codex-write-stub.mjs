// Codex giả cho codex-write.mjs (CODEX_JS trỏ tới file này). Hành vi theo STUB_CW_MODE:
//   write    — ghi đúng file đầu ra theo STUB_CW_FILE (đường dẫn tương đối với thư mục làm việc = cwd) rồi thoát 0
//   nowrite  — KHÔNG ghi gì, chỉ "than phiền môi trường chặn" rồi thoát 0 (đã xảy ra ở T17 ngày 20/11/2026)
//   stale    — không ghi gì mới nhưng file đầu ra đã có từ trước (cũ hơn lúc bắt đầu) => vẫn phải bị coi là không ghi
//   scribble — ghi đúng file đầu ra NHƯNG còn ghi 1 file ngay ngoài thư mục làm việc (../scribble.txt) => script phải ghi CẢNH BÁO
// STUB_CW_ARGS (tuỳ chọn): đường dẫn file để chép lại tham số dòng lệnh mà script đã truyền cho codex.
import fs from 'node:fs';
import path from 'node:path';

if (process.env.STUB_CW_ARGS) fs.writeFileSync(process.env.STUB_CW_ARGS, JSON.stringify(process.argv.slice(2)));
for await (const _ of process.stdin); // đọc hết prompt
const mode = process.env.STUB_CW_MODE || 'write';
if (mode === 'write' || mode === 'scribble') {
  const f = path.join(process.cwd(), process.env.STUB_CW_FILE);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, '# đã viết');
}
if (mode === 'scribble') fs.writeFileSync(path.join(process.cwd(), '..', 'scribble.txt'), 'ngoài thư mục chủ đề');
console.log(mode === 'nowrite' || mode === 'stale' ? 'Môi trường chặn đọc bản nháp nên mình chưa tạo file.' : 'Đã viết xong.');
