// "Gói đăng một chạm" cho TikTok (giám đốc chốt 21/11/2026: chỉ TikTok; hệ thống KHÔNG đăng gì, giám đốc tự dán và bấm đăng — luật 9).
// Đọc final/publish.json của video và dựng sẵn khối giám đốc chỉ việc sao chép: nội dung ô mô tả, đường dẫn video và ảnh bìa, nhắc bật nhãn AI.
// Không gọi mạng, không dùng khoá, không tốn hạn mức AI.
import fs from 'node:fs';
import path from 'node:path';
import * as S from './db.mjs';

/** Luật 10 (CLAUDE.md): tên thật các nền tảng không được nói/viết trong video và bài đăng (tiêu đề, mô tả, hashtag). */
export const REAL_PLATFORM_WORDS = /(?<![\p{L}\p{N}])(facebook|youtube|zalo|tiktok|messenger|meta)(?![\p{L}\p{N}])/giu;
/** Giới hạn caption theo tài liệu API của TikTok (2200 đơn vị UTF-16). Giới hạn trong app chưa kiểm được (Trung tâm trợ giúp TikTok không đọc được). */
export const TIKTOK_CAPTION_MAX = 2200;

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));

/** Dựng gói đăng TikTok cho 1 video. Ném lỗi rõ ràng nếu chưa có publish.json hoặc không có khối tiktok. */
export function buildTikTokPack(videoId) {
  const v = S.getVideo(videoId);
  const root = path.resolve(S.ROOT, v.folder);
  const finalDir = path.join(root, 'final');
  const pubFile = path.join(finalDir, 'publish.json');
  if (!fs.existsSync(pubFile)) throw new S.StudioError(`${v.id} chưa có final/publish.json (Sản xuất chưa xuất thành phẩm)`);
  let pj;
  try {
    pj = readJson(pubFile);
  } catch (e) {
    throw new S.StudioError(`final/publish.json của ${v.id} không đọc được: ${e.message}`);
  }
  const t = pj.platforms?.tiktok;
  if (!t || typeof t !== 'object') throw new S.StudioError(`final/publish.json của ${v.id} không có khối "tiktok"`);

  const caption = String(t.caption ?? '').trim();
  const hashtags = Array.isArray(t.hashtags) ? t.hashtags.map((h) => String(h).trim()).filter(Boolean) : [];
  const missingTags = hashtags.filter((h) => !caption.toLowerCase().includes(h.toLowerCase()));
  // Hashtag đã nằm sẵn trong caption thì không chép lại; chưa có thì nối xuống cuối.
  const text = missingTags.length ? `${caption}\n\n${missingTags.join(' ')}` : caption;

  const mp4s = fs.existsSync(finalDir) ? fs.readdirSync(finalDir).filter((n) => /\.mp4$/i.test(n)) : [];
  const videoName = mp4s.find((n) => n.startsWith(`${v.id}_`)) || mp4s[0] || null;
  const coverName = pj.cover && fs.existsSync(path.join(finalDir, String(pj.cover))) ? String(pj.cover) : fs.existsSync(path.join(finalDir, 'thumbnail.jpg')) ? 'thumbnail.jpg' : null;
  const srtName = fs.existsSync(path.join(finalDir, 'captions.srt')) ? 'captions.srt' : null;
  const file = (name) => (name ? { name, path: path.join(finalDir, name), rel: S.sql.rel(path.join(finalDir, name)) } : null);

  const warnings = [];
  if (v.stage !== 'ready') warnings.push({ level: 'warn', text: `Video đang ở "${v.stage}", chưa phải "ready" (QC/giám đốc chưa duyệt).` });
  if (!text) warnings.push({ level: 'error', text: 'Khối tiktok không có caption.' });
  if (!videoName) warnings.push({ level: 'error', text: 'Không thấy file .mp4 trong final/.' });
  if (!coverName) warnings.push({ level: 'warn', text: 'Không thấy ảnh bìa (thumbnail.jpg) trong final/.' });
  const units = [...text].reduce((n, ch) => n + (ch.codePointAt(0) > 0xffff ? 2 : 1), 0);
  if (units > TIKTOK_CAPTION_MAX) warnings.push({ level: 'error', text: `Nội dung dài ${units} ký tự, vượt ${TIKTOK_CAPTION_MAX} (giới hạn theo API; giới hạn trong app chưa kiểm được).` });
  const names = [...new Set([...(`${t.title ?? ''}\n${text}`).matchAll(REAL_PLATFORM_WORDS)].map((m) => m[1].toLowerCase()))];
  if (names.length) warnings.push({ level: 'error', text: `Luật 10: còn tên thật nền tảng trong tiêu đề/mô tả/hashtag: ${names.join(', ')}. Dùng cách gọi thay thế (xem CLAUDE.md luật 10).` });
  const disclosure = String(pj.ai_disclosure ?? '').trim();
  if (disclosure && !text.includes(disclosure)) warnings.push({ level: 'warn', text: 'Câu khai báo AI của publish.json chưa nằm trong mô tả.' });
  if (pj.ai_generated_content === false) warnings.push({ level: 'warn', text: 'publish.json ghi ai_generated_content = false, kiểm lại nhãn AI.' });

  return {
    video_id: v.id,
    dept: v.dept,
    stage: v.stage,
    title: String(t.title ?? ''),
    text,
    hashtags,
    chars: units,
    duration_s: pj.duration_s ?? null,
    files: { video: file(videoName), cover: file(coverName), captions: file(srtName) },
    reminders: ['Bật công tắc "nội dung do AI tạo" của TikTok khi đăng (nhãn không đốt lên hình).', 'Đăng xong thì bấm "Đã đăng" (hoặc nói với thư ký) để đổi video sang published.'],
    warnings,
    ok: !warnings.some((w) => w.level === 'error'),
  };
}

/** Bản chữ cho dòng lệnh: `node studio/src/cli.mjs pack <video-id>`. */
export function formatPack(p) {
  const L = [`GÓI ĐĂNG TIKTOK — ${p.video_id} (${p.stage})${p.duration_s ? ` · ${p.duration_s} s` : ''} · ${p.chars} ký tự`, ''];
  for (const w of p.warnings) L.push(`${w.level === 'error' ? '✖' : '⚠'} ${w.text}`);
  if (p.warnings.length) L.push('');
  L.push('--- DÁN VÀO Ô MÔ TẢ ---', p.text, '--- HẾT ---', '');
  L.push(`Video: ${p.files.video?.path ?? '(không thấy)'}`, `Bìa:   ${p.files.cover?.path ?? '(không thấy)'}`);
  if (p.files.captions) L.push(`Phụ đề (nếu cần): ${p.files.captions.path}`);
  L.push('', ...p.reminders.map((r) => `• ${r}`));
  return L.join('\n');
}
