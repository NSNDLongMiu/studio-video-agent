---
name: qc
description: QC thành phẩm của 1 video do Codex làm theo 3 trục KỸ THUẬT / TUÂN THỦ / TRẢI NGHIỆM (qc-video, xem khung hình thật, 5 câu hỏi người xem lạ và rà đủ Y1–Y8 theo docs/chat-luong-xem.md), rồi cho "ready", đưa về sản xuất kèm danh sách sửa (lỗi dựng), hoặc giữ ở "review" và escalate "QC-THIẾT-KẾ" cho giám đốc (lỗi thiết kế). Cú pháp "/qc <video-id>". Worker nền gọi lệnh này sau mỗi lần Codex xong.
argument-hint: "<video-id>"
disable-model-invocation: true
---

Đối số: `$ARGUMENTS` = `video_id`. (Có thể chạy nền, không có người trả lời — không đặt câu hỏi.)

1. `get_video(video_id)` → `team_id`, thư mục, giai đoạn, danh sách file.
2. Nếu **không có file `.mp4`** trong `final/` → `set_video_stage(video_id, "production", note="QC: chưa có thành phẩm")`, ghi lý do vào `notes.md`, báo và kết thúc.
3. Gọi subagent `support` ở chế độ **QC** với `team_id`, `video_id`, thư mục video. Nó chạy `node tools/qc-video.mjs`, trích và **xem khung hình thật** (kể cả so khung trước/sau ở 360×640 và bìa ở 180×320), đối chiếu `plan.md`/`script.md`, ghi **3 kết luận riêng** (KỸ THUẬT / TUÂN THỦ / TRẢI NGHIỆM) kèm 5 câu hỏi người xem lạ và bảng QC 8 nhóm của `docs/chat-luong-xem.md`. Trong TRẢI NGHIỆM ghi kết luận Đạt/Chưa đạt/CHƯA KIỂM và bằng chứng từng nhóm Y1–Y8, rồi:
   - đạt → `set_video_stage` `ready`;
   - **lỗi dựng sửa được** → `production` kèm danh sách sửa trong `notes.md` (worker tự xếp sản xuất lại);
   - **lỗi thiết kế** (storyboard đã APPROVED nhưng video vẫn kém: hook thiếu tình huống/ích lợi, chữ chép lời, vật chính nhỏ…) → **không** `ready`, **không** `production`; ghi "QC — lỗi thiết kế" trong `notes.md`, `escalate(video_id, "QC-THIẾT-KẾ: …")`, để video ở `review` cho giám đốc quyết (chấp nhận → `ready`, hoặc làm lại). Đường tự động trả về Đạo diễn hình ảnh chưa được xây.
4. Báo kết quả bằng **số đo thật** (kết quả `qc-video`, số khung đã xem), không "làm tròn" lỗi thành đạt; nói rõ phần **CHƯA KIỂM** (tốc độ cảm nhận, nhịp nghỉ và phát âm Y6–Y8 chờ giám đốc nghe; agent kiểm văn bản và số đo). Nếu `support` chưa đưa ra phán quyết (video vẫn `review` **và không có cờ vướng `QC-THIẾT-KẾ`**) thì nói rõ để worker đánh dấu cần người.
