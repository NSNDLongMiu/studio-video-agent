// agy giả cho test (STUDIO_AGY_JS trỏ tới file này). Hành vi theo STUB_AGY_MODE: ok | noimage | limit | auth
// Ghi dòng lệnh và biến môi trường quan trọng vào <STUB_DIR>/agy-calls.jsonl để test kiểm "không dùng đường trả phí".
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = process.argv.slice(2);
const mode = process.env.STUB_AGY_MODE || 'ok';
const files = [];
(function walk(d, rel) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) walk(path.join(d, e.name), r);
    else files.push(r);
  }
})(process.cwd(), '');
fs.appendFileSync(path.join(process.env.STUB_DIR, 'agy-calls.jsonl'), `${JSON.stringify({ args, cwd: process.cwd(), files, env_key: process.env.GEMINI_API_KEY ?? 'unset', env_adc: process.env.AGY_ADC_AUTH ?? 'unset' })}\n`);
// Giả lập agy "ghi lung tung" trong thư mục làm việc (như Claude Opus đã làm khi thử thật): file này phải bị bỏ cùng thư mục tạm.
if (process.env.STUB_AGY_SCRIBBLE) fs.writeFileSync(path.join(process.cwd(), 'agy-tu-ghi.txt'), 'x');

// STUB_AGY_LIMIT_MODELS="a,b": chỉ các mô hình này báo hết hạn mức (kiểm dự phòng); mô hình khác chạy bình thường.
const model = args[args.indexOf('--model') + 1];
const limitedModels = (process.env.STUB_AGY_LIMIT_MODELS || '').split(',').filter(Boolean);
if (mode === 'limit' || limitedModels.includes(model)) {
  if (mode !== 'limit') console.error('Third-party quota reached. Please switch to Gemini models or upgrade your subscription to continue.');
  console.error('Error: RESOURCE_EXHAUSTED — you have reached your weekly quota. Try again in 3 hours.'); // 3 giờ để trạng thái "hết limit" không phụ thuộc đồng hồ test
  process.exit(1);
}
if (mode === 'auth') {
  console.error('authentication required');
  process.exit(1);
}

const id = crypto.randomUUID();
if (mode !== 'noimage') {
  const dir = path.join(process.env.STUDIO_AGY_HOME, 'brain', id);
  fs.mkdirSync(dir, { recursive: true });
  // PNG giả 1080×1920 (chỉ cần chữ ký + IHDR để đọc kích thước)
  const png = Buffer.alloc(40);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13]).copy(png, 0);
  png.write('IHDR', 12, 'ascii');
  png.writeUInt32BE(1080, 16);
  png.writeUInt32BE(1920, 20);
  fs.writeFileSync(path.join(dir, 'nen_van_phong_1795178202752.png'), png);
  fs.writeFileSync(path.join(dir, 'ghi-chu.txt'), 'không phải ảnh');
}
console.log(JSON.stringify({ conversation_id: id, status: 'SUCCESS', response: `Xong (${mode}).`, duration_seconds: 0.1, num_turns: 1, usage: { total_tokens: 1 } }));
