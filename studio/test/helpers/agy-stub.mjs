// agy giả cho test (STUDIO_AGY_JS trỏ tới file này). Hành vi theo STUB_AGY_MODE: ok | noimage | limit | auth
// Chế độ storyboard (gemini-run.mjs storyboard): sb-ok (ghi storyboard.json hợp lệ nhưng cố tình đặt APPROVED + storyboard.md) | sb-otherid (video_id khác)
//   | sb-badjson | sb-badschema | sb-nofile | sb-reply (không ghi file, trả khối ```json trong câu trả lời).
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

// ---- storyboard (Gemini viết thay Codex) ----
const sbBoard = (videoId) => ({
  video_id: videoId, status: 'APPROVED', scenes: [{
    scene_id: '1', narrative_purpose: 'Thấy kết quả phân loại', visual_concept: 'Thẻ chuyển vào hai khay',
    scene_type: 'process_animation', environment: 'Bàn làm việc', character_action: 'không xuất hiện',
    props: ['thẻ', 'hai khay'], camera: { shot: 'wide', movement: 'static' },
    animation_timeline: [{ t: 0, event: 'Thẻ trượt vào khay' }], voice_over: 'Tách dữ liệu theo nhóm.',
    text_overlay: '', sound_effects: [], transition: 'cut', duration_s: 3,
    quality_check: { has_real_illustration: true, repeats_previous_layout: false, silent_comprehensible: true },
  }],
});
let response = `Xong (${mode}).`;
if (mode.startsWith('sb-')) {
  const w = (n, t) => fs.writeFileSync(path.join(process.cwd(), n), t);
  const vid = mode === 'sb-otherid' ? 'KHAC-T9-E01' : 'TEST-T1-E01';
  if (mode === 'sb-ok' || mode === 'sb-otherid') {
    w('storyboard.json', JSON.stringify(sbBoard(vid)));
    if (mode === 'sb-ok') w('storyboard.md', '| Cảnh | Hình |\n|---|---|\n| 1 | Thẻ vào khay |');
  } else if (mode === 'sb-badjson') w('storyboard.json', '{"video_id": "TEST-T1-E01", "scenes": [');
  else if (mode === 'sb-badschema') w('storyboard.json', JSON.stringify({ video_id: 'TEST-T1-E01', status: 'DRAFT', scenes: [{ scene_id: '1' }] }));
  else if (mode === 'sb-reply') response = `Đây là bản nháp:\n\`\`\`json\n${JSON.stringify(sbBoard(vid), null, 2)}\n\`\`\`\nXong.`;
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
console.log(JSON.stringify({ conversation_id: id, status: 'SUCCESS', response, duration_seconds: 0.1, num_turns: 1, usage: { total_tokens: 1 } }));
