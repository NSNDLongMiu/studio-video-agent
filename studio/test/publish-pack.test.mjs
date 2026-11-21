// Gói đăng một chạm cho TikTok (giám đốc chốt 21/11/2026): dựng khối dán sẵn từ final/publish.json, KHÔNG đăng gì (luật 9).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-pack-'));
Object.assign(process.env, { STUDIO_DB: path.join(tmp, 'db.sqlite'), STUDIO_CONTENT: path.join(tmp, 'content'), STUDIO_ACCOUNTS: path.join(tmp, 'accounts'), STUDIO_NO_AUTOSTART: '1' });
const S = await import('../src/db.mjs');
const { buildTikTokPack, formatPack, REAL_PLATFORM_WORDS, TIKTOK_CAPTION_MAX } = await import('../src/publish-pack.mjs');

S.createDepartment({ name: 'IT', slug: 'it', daily_target: 2, initial_teams: 1 });
const topic = S.submitTopic({ dept: 'it', text: 'Thử gói đăng' }).topic_id;
const [v1, v2, v3, v4] = S.assignTopic({ topic_id: topic, episodes: 4 }).videos;

function finalDir(v) {
  const dir = path.resolve(S.ROOT, S.getVideo(v).folder, 'final');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
function writeFinal(v, publish, { mp4 = true, cover = true } = {}) {
  const dir = finalDir(v);
  if (publish) fs.writeFileSync(path.join(dir, 'publish.json'), typeof publish === 'string' ? publish : JSON.stringify(publish));
  if (mp4) fs.writeFileSync(path.join(dir, `${v}_9x16.mp4`), 'mp4-gia');
  if (cover) fs.writeFileSync(path.join(dir, 'thumbnail.jpg'), 'jpg-gia');
  fs.writeFileSync(path.join(dir, 'captions.srt'), '1\n00:00:00,000 --> 00:00:01,000\nxin chào\n');
}
const AI = 'Video có dùng hình ảnh và giọng đọc do AI tạo.';
const base = (over = {}) => ({
  video_id: 'x', duration_s: 62.8, cover: 'thumbnail.jpg', ai_generated_content: true, ai_disclosure: AI,
  platforms: { tiktok: { title: 'Báo thức mà chỉ rung?', caption: `Mở chính báo thức để kiểm mục Âm báo.\n\n${AI}`, hashtags: ['#baothuc', '#caovanphong'] } },
  ...over,
});

test('dựng khối dán: caption + hashtag cuối, đủ đường dẫn file, không cảnh báo khi mọi thứ ổn', () => {
  S.setVideoStage({ video_id: v1, stage: 'ready', by: 'test' });
  writeFinal(v1, base());
  const p = buildTikTokPack(v1);
  assert.equal(p.ok, true);
  assert.deepEqual(p.warnings, []);
  assert.equal(p.text, `Mở chính báo thức để kiểm mục Âm báo.\n\n${AI}\n\n#baothuc #caovanphong`);
  assert.equal(p.title, 'Báo thức mà chỉ rung?');
  assert.equal(p.duration_s, 62.8);
  assert.match(p.files.video.path, new RegExp(`${v1}_9x16\\.mp4$`));
  assert.match(p.files.cover.path, /thumbnail\.jpg$/);
  assert.match(p.files.captions.path, /captions\.srt$/);
  assert.ok(fs.existsSync(p.files.video.path));
  assert.ok(p.reminders.some((r) => /nội dung do AI tạo/.test(r)));
  const text = formatPack(p);
  assert.match(text, /--- DÁN VÀO Ô MÔ TẢ ---\nMở chính báo thức/);
  assert.match(text, /--- HẾT ---/);
  assert.ok(text.includes(p.files.video.path));
});

test('hashtag đã nằm sẵn trong caption thì không chép lại', () => {
  writeFinal(v2, base({ platforms: { tiktok: { caption: `Nội dung. #baothuc #caovanphong\n${AI}`, hashtags: ['#BaoThuc', '#caovanphong'] } } }));
  const p = buildTikTokPack(v2);
  assert.equal(p.text.match(/#baothuc/gi).length, 1);
  assert.equal(p.text.match(/#caovanphong/gi).length, 1);
  assert.ok(!p.text.endsWith('\n\n'));
});

test('luật 10: còn tên thật nền tảng trong tiêu đề/mô tả/hashtag thì báo lỗi; từ chứa chữ đó hoặc cách gọi thay thế thì không', () => {
  writeFinal(v3, base({ platforms: { tiktok: { title: 'Facebook bị giả mạo?', caption: `Xem trên YouTube và Zalo, đăng TikTok.\n${AI}`, hashtags: ['#facebook'] } } }));
  const bad = buildTikTokPack(v3);
  assert.equal(bad.ok, false);
  const w = bad.warnings.find((x) => /Luật 10/.test(x.text));
  assert.equal(w.level, 'error');
  for (const name of ['facebook', 'youtube', 'zalo', 'tiktok']) assert.ok(w.text.includes(name), name);
  // cách gọi thay thế + từ có chứa "meta"/"zalo" nằm trong từ khác không bị bắt
  writeFinal(v3, base({ platforms: { tiktok: { title: 'Ai nhắn thay bạn trên phở bò?', caption: `Xem ytb, nhắn qua zép lào, đăng tóp tóp. Metadata và Zalopay không phải tên nền tảng.\n${AI}`, hashtags: ['#phobo', '#ytb'] } } }));
  const ok = buildTikTokPack(v3);
  assert.equal(ok.warnings.some((x) => /Luật 10/.test(x.text)), false);
  assert.deepEqual([...'Meta-data, meta; (Meta)'.matchAll(REAL_PLATFORM_WORDS)].map((m) => m[1].toLowerCase()), ['meta', 'meta', 'meta']);
});

test('cảnh báo: vượt 2200 ký tự, thiếu mp4/bìa, thiếu câu khai báo AI, chưa ready, ai_generated_content=false', () => {
  writeFinal(v4, base({ ai_generated_content: false, platforms: { tiktok: { caption: 'x'.repeat(TIKTOK_CAPTION_MAX + 1), hashtags: [] } } }), { mp4: false, cover: false });
  const p = buildTikTokPack(v4); // v4 còn ở ideation
  assert.equal(p.ok, false);
  const t = p.warnings.map((x) => x.text).join('\n');
  assert.match(t, /chưa phải "ready"/);
  assert.match(t, /vượt 2200/);
  assert.match(t, /Không thấy file \.mp4/);
  assert.match(t, /Không thấy ảnh bìa/);
  assert.match(t, /khai báo AI.*chưa nằm trong mô tả/);
  assert.match(t, /ai_generated_content = false/);
  assert.equal(p.files.video, null);
  assert.equal(p.files.cover, null);
  // emoji ngoài BMP tính 2 đơn vị UTF-16
  writeFinal(v4, base({ platforms: { tiktok: { caption: `${'😀'.repeat(1100)} ${AI}`, hashtags: [] } } }));
  assert.match(buildTikTokPack(v4).warnings.map((x) => x.text).join('\n'), /vượt 2200/);
});

test('thiếu publish.json hoặc khối tiktok thì ném lỗi rõ ràng, không dựng gói rỗng', () => {
  const dir = finalDir(v4);
  fs.rmSync(path.join(dir, 'publish.json'), { force: true });
  assert.throws(() => buildTikTokPack(v4), /chưa có final\/publish\.json/);
  fs.writeFileSync(path.join(dir, 'publish.json'), '{ hỏng');
  assert.throws(() => buildTikTokPack(v4), /không đọc được/);
  fs.writeFileSync(path.join(dir, 'publish.json'), JSON.stringify({ platforms: { youtube_shorts: {} } }));
  assert.throws(() => buildTikTokPack(v4), /không có khối "tiktok"/);
  assert.throws(() => buildTikTokPack('KHONG-CO-E01'), /Không có video/);
});

test('readyVideos: chỉ video đã ready, và chuyển published thì rời danh sách', () => {
  assert.deepEqual(S.readyVideos().map((v) => v.id), [v1]);
  S.setVideoStage({ video_id: v2, stage: 'ready', by: 'test' });
  assert.deepEqual(S.readyVideos().map((v) => v.id).sort(), [v1, v2].sort());
  S.setVideoStage({ video_id: v1, stage: 'published', by: 'test' });
  assert.deepEqual(S.readyVideos().map((v) => v.id), [v2]);
});
