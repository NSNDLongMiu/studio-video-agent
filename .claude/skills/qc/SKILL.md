---
name: qc
description: QC thành phẩm của 1 video do Codex làm theo 3 trục KỸ THUẬT / TUÂN THỦ / TRẢI NGHIỆM (qc-video, xem khung hình thật, 5 câu hỏi người xem lạ và rà đủ Y1–Y8 theo docs/chat-luong-xem.md), rồi cho "ready", đưa về sản xuất kèm danh sách sửa (lỗi dựng), hoặc giữ ở "review" và escalate "QC-THIẾT-KẾ" cho giám đốc (lỗi thiết kế). Cú pháp "/qc <video-id>". Worker nền gọi lệnh này sau mỗi lần Codex xong.
argument-hint: "<video-id>"
disable-model-invocation: true
---

Đối số: `$ARGUMENTS` = `video_id`. (Có thể chạy nền, không có người trả lời — không đặt câu hỏi.)

1. `get_video(video_id)` → `team_id`, thư mục, giai đoạn, danh sách file.
2. Nếu **không có file `.mp4`** trong `final/` → `set_video_stage(video_id, "production", note="QC: chưa có thành phẩm")`, ghi lý do vào `notes.md`, báo và kết thúc.
3. Gọi subagent `support` ở chế độ **QC** với `team_id`, `video_id`, thư mục video. Nó chạy `node tools/qc-measure.mjs <epNN> --baseline <báo cáo chuẩn: docs/baseline/T8-qc-auto.json nếu video > 75 s, ngược lại T5-qc-auto.json>` (một lệnh đơn, đo độc lập, ghi báo cáo có mốc giây + ảnh bằng chứng), đọc báo cáo, nhờ **Gemini xem trước** tối đa 8 khung đáng chú ý qua `gemini-run.mjs look` (chỉ là danh sách nên xem kỹ; vắng thì bỏ qua, không chờ), **xem khung hình thật** (kể cả so khung trước/sau ở 360×640 và bìa ở 180×320), đối chiếu `plan.md`/`script.md`, ghi **3 kết luận riêng** (KỸ THUẬT / TUÂN THỦ / TRẢI NGHIỆM; mọi hồ sơ rà Audio / Visual / Narrative theo mục D6 và **D8 (R20–R23: giọng nuốt chữ, opening riêng, header xuyên suốt, chữ keyword thật; đo bằng `qc-measure`)** của `docs/chat-luong-xem.md`, mục công cụ không xác nhận được ghi CHƯA KIỂM) kèm 5 câu hỏi người xem lạ và bảng QC 8 nhóm của `docs/chat-luong-xem.md`. Trong TRẢI NGHIỆM ghi kết luận Đạt/Chưa đạt/CHƯA KIỂM và bằng chứng từng nhóm Y1–Y8, rồi:
   - đạt và người duyệt đã xác nhận các mục cần kiểm thủ công → `set_video_stage` `ready`; còn mục CHƯA KIỂM thì giữ `review` và **bắt buộc `escalate` tiền tố `QC-CHỜ-NGHE:`** kèm danh sách mục cần nghe/xem (21/11/2026; QC quên thì worker tự đánh từ lời kết luận);
   - **lỗi dựng sửa được** → `production` kèm danh sách sửa trong `notes.md` (worker tự xếp sản xuất lại);
   - **lỗi thiết kế** (storyboard đã APPROVED nhưng video vẫn kém: hook thiếu tình huống/ích lợi, chữ chép lời, vật chính nhỏ…) → **không** `ready`, **không** `production`; ghi "QC — lỗi thiết kế" trong `notes.md`, `escalate(video_id, "QC-THIẾT-KẾ: …")`, để video ở `review` cho giám đốc quyết (chấp nhận → `ready`, hoặc làm lại). Đường tự động trả về Đạo diễn hình ảnh chưa được xây.
4. Báo kết quả bằng **số đo thật** (kết quả `qc-video`, số khung đã xem), không "làm tròn" lỗi thành đạt; nói rõ phần **CHƯA KIỂM** (tốc độ cảm nhận, nhịp nghỉ và phát âm Y6–Y8 chờ giám đốc nghe; agent kiểm văn bản và số đo). Nếu `support` chưa đưa ra phán quyết (video vẫn `review` **và không có cờ vướng `QC-THIẾT-KẾ`**) thì nói rõ để worker đánh dấu cần người.

Đọc ba nhóm Audio / Visual / Narrative từ `node tools/qc-measure.mjs <epNN>`. Ghi độ tự nhiên của giọng, độ êm tai của nhạc/SFX, sức hút opening và logic mạch kể vào `needs_manual_review` với trạng thái **CHƯA KIỂM** khi người duyệt chưa xác nhận. Phần nghe ghi **CHƯA KIỂM — giám đốc nghe**. `machine_verdict.final_pass_allowed` không cấp PASS thay người duyệt.

## Luật chung: tên nền tảng (giám đốc chốt 21/11/2026 — CLAUDE.md luật 10)
Mọi video và bài đăng, trên mọi nền tảng: KHÔNG nói, KHÔNG viết tên thật của bốn nền tảng sau; dùng đúng cách gọi này ở lời đọc, phụ đề, chữ trên hình, tiêu đề, mô tả, hashtag, ảnh bìa.

| Nền tảng | Đọc thành tiếng | Viết |
|---|---|---|
| Facebook | phở bò | phở bò |
| YouTube | y tê bê | ytb |
| Zalo | dép lào | zép lào |
| TikTok | tóp tóp | tóp tóp |

Kịch bản ghi dạng *viết*; Sản xuất đưa dạng *đọc* vào TTS (`tools/voice/pronunciation.json`). Viết đúng như cột "Viết" (không viết hoa, không kèm tên thật trong ngoặc); hashtag = dạng viết bỏ dấu và bỏ khoảng trắng (`#phobo`, `#ytb`, `#zeplao`, `#toptop`). Đây là tên gọi thay thế, KHÔNG phải nghĩa đen: cấm hình, cảnh và chơi chữ về đồ ăn hay đôi dép vì tên này. Ngoại lệ người xem không thấy: khoá nền tảng trong `publish.json` (`tiktok`, `youtube_shorts`, `facebook_reels`), `notes.md`, mục nguồn và URL; không chép URL hay tên có chữ nền tảng thật vào mô tả đăng.

**QC kiểm luật tên nền tảng:** `grep -i -E "facebook|youtube|zalo|tiktok"` trên `final/captions.srt`, `assets/scenes.json`, `storyboard.json` và các khối đăng trong `final/publish.json` phải trống (bỏ qua khoá nền tảng và URL nguồn); nghe lời có nhắc nền tảng đọc đúng cách gọi (chưa nghe được thì ghi CHƯA KIỂM); mở khung hình kiểm không có hình đồ ăn hay đôi dép.
