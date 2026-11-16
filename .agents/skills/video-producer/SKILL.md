---
name: video-producer
description: Quy trình dựng 1 video dọc 9:16 (TikTok/Facebook Reels/YouTube Shorts) bằng ffmpeg trên Windows theo plan.md/script.md của đội - nguyên liệu, dựng, phụ đề tiếng Việt, chuẩn hoá âm thanh, thumbnail, publish.json, QC. Dùng khi được giao 1 video_id trong xưởng video.
---

# Quy trình Producer

Các công thức ffmpeg **đã chạy thử trên máy này** nằm trong `references/ffmpeg-recipes.md` — dùng chúng làm gốc, đừng đoán cú pháp. Đặc biệt phụ đề (libass) có bẫy đơn vị.

## Các bước (báo `report_status` ở mỗi bước lớn)
1. **Đọc & kiểm tra đầu vào** — brief, concept, plan, script. Liệt kê nguyên liệu cần; so với `docs/asset-sources.md` và `library/`. Thiếu → `escalate`, dừng.
2. **Chuẩn bị nguyên liệu** vào `<video>/assets/` (đồ hoạ nền, thẻ chữ, ảnh từ `library/`, nhạc từ `library/music/`). Ghi nguồn từng file vào `notes.md`.
3. **Dựng theo `script.md`**: đúng thứ tự cảnh, đúng từng chữ, đúng thời lượng (±0,5s mỗi cảnh, tổng ±1s). Dựng thành các đoạn nhỏ rồi ghép giúp debug dễ hơn một lệnh khổng lồ. Hook phải hiện trong **2 giây đầu**.
3b. **Cáo văn phòng dẫn truyện** (mặc định mọi video, trừ khi `plan.md` ghi khác): đọc `docs/mascot.md`; từ cột **Cáo** của `script.md` viết `timeline.json` (mốc giây → tên dáng trong `brand/cao/catalog.png`), tạo lớp Cáo bằng `tools/fox/narrate.mjs` rồi ghép theo công thức §8 trong `references/ffmpeg-recipes.md`. Tên dáng không tồn tại thì công cụ báo lỗi kèm danh sách. Không tự vẽ lại hay sửa `assets/mascot/`; **Cáo không nhép miệng** (chỉ đổi dáng và nhún theo tiếng).
4. **Phụ đề**: viết `captions.srt` từ script (mỗi dòng ≤ 42 ký tự, ≤ 2 dòng, 1–3s/dòng), đốt cứng bằng `subtitles` (xem bẫy đơn vị trong recipes; **có Cáo thì đặt phụ đề phía TRÊN đầu Cáo**, `MarginV=190`). Chữ trong vùng an toàn (xem `docs/platform-specs.md`).
5. **Âm thanh**: trộn lời/nhạc/SFX, nhạc nền nhỏ hơn lời ~12–15 dB, `loudnorm=I=-14:TP=-1.5:LRA=11`. Video **phải có luồng audio**.
6. **Xuất** `final/<video_id>_9x16.mp4` (thông số trong recipes), `thumbnail.jpg` (khung hình đẹp nhất, có chữ nếu plan yêu cầu), `captions.srt`.
7. **`publish.json`** theo schema ở `references/publish-schema.md`. **Luôn `ai_generated_content: true`** và có `ai_disclosure`, chép câu đó vào cuối mô tả của cả 3 nền tảng (giám đốc đã chốt luôn gắn nhãn AI). Chạy `node tools/qc-publish.mjs <video>/final/publish.json`: phải **pass** (công cụ báo rớt nếu thiếu nhãn AI hoặc thiếu câu khai báo ở bất kỳ nền tảng nào).
8. **QC thật**: `node tools/qc-video.mjs final/<video_id>_9x16.mp4 --min <tối thiểu> --max <tối đa theo plan>`; trích ≥ 3 khung hình (0,5s / giữa / gần cuối) bằng ffmpeg và **mở ảnh xem**: chữ không cắt, đủ dấu tiếng Việt, phụ đề thấy rõ. Sửa tới khi pass.
9. **Kết thúc**: dán kết quả QC + danh sách file vào `notes.md`; `set_video_stage(video_id, "review")`; `report_status(... "idle")`; dòng cuối `DONE`. Kẹt thì theo quy trình `NEEDS_HELP` trong `AGENTS.md`.

## Mẹo tránh lỗi hay gặp
- Chữ có dấu nháy `'`, `:`, `%` trong `drawtext` → ghi vào file UTF-8 rồi dùng `textfile=`.
- Đường dẫn ổ đĩa trong filter: `C\:/Windows/Fonts/segoeuib.ttf` (thoát dấu `:`); chạy lệnh từ chính thư mục chứa file `.srt` và dùng tên tương đối cho `subtitles=`.
- Luôn `-pix_fmt yuv420p`, luôn thêm `-movflags +faststart`; nếu nguồn có kích thước lẻ dùng `scale=...:force_original_aspect_ratio` rồi `pad`.
- Không tin vào "lệnh chạy không lỗi" — phụ đề có thể không hiện mà ffmpeg vẫn không báo lỗi. Luôn nhìn khung hình thật.
