// Kiểm final/publish.json trước khi coi video là xong:  node tools/qc-publish.mjs <publish.json>
// Luật cứng (giám đốc đã chốt): MỌI video gắn nhãn AI => ai_generated_content=true, có ai_disclosure,
// và câu khai báo đó nằm trong mô tả/caption của CẢ 3 nền tảng. Thoát mã 0 = đạt, 1 = lỗi.
import fs from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Cú pháp: node tools/qc-publish.mjs <publish.json>');
  process.exit(2);
}
const fails = [];
const warns = [];
let d;
try {
  d = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (e) {
  console.log(JSON.stringify({ file, pass: false, fails: [`Không đọc được JSON: ${e.message}`], warns }));
  process.exit(1);
}

if (d.ai_generated_content !== true) fails.push('ai_generated_content phải là true (luôn gắn nhãn AI)');
const disc = typeof d.ai_disclosure === 'string' ? d.ai_disclosure.trim() : '';
if (!disc) fails.push('Thiếu ai_disclosure (câu khai báo nội dung AI)');

const p = d.platforms || {};
const fields = { tiktok: 'caption', facebook_reels: 'description', youtube_shorts: 'description' };
for (const [name, key] of Object.entries(fields)) {
  const text = p[name]?.[key];
  if (typeof text !== 'string' || !text.trim()) fails.push(`Thiếu platforms.${name}.${key}`);
  else if (disc && !text.includes(disc)) fails.push(`platforms.${name}.${key} chưa chứa câu ai_disclosure`);
}
const title = p.youtube_shorts?.title;
if (typeof title !== 'string' || !title.trim()) fails.push('Thiếu platforms.youtube_shorts.title');
else if (title.length > 100) fails.push(`Tiêu đề YouTube dài ${title.length} ký tự (> 100)`);
for (const [name, v] of Object.entries(p)) {
  const tags = v.hashtags;
  if (Array.isArray(tags)) {
    if (tags.length > 5) warns.push(`${name}: ${tags.length} hashtag (> 5, dễ bị coi là spam)`);
    for (const t of tags) if (!/^#\S+$/.test(t)) fails.push(`${name}: hashtag không hợp lệ: ${t}`);
  }
}
if (!Array.isArray(d.sources) || !d.sources.length) warns.push('sources trống: mọi sự kiện/số liệu cần có nguồn');
if (d.qc && d.qc.pass !== true) warns.push('qc.pass chưa phải true');

const pass = fails.length === 0;
console.log(JSON.stringify({ file, pass, fails, warns }, null, 2));
process.exit(pass ? 0 : 1);
