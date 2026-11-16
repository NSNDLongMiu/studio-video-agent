---
name: qc
description: QC thành phẩm của 1 video do Codex làm - kiểm số đo (qc-video), xem khung hình thật, đối chiếu kế hoạch, rồi cho "ready" hoặc đưa về sản xuất kèm danh sách sửa. Cú pháp "/qc <video-id>". Worker nền gọi lệnh này sau mỗi lần Codex xong.
argument-hint: "<video-id>"
disable-model-invocation: true
---

Đối số: `$ARGUMENTS` = `video_id`. (Có thể chạy nền, không có người trả lời — không đặt câu hỏi.)

1. `get_video(video_id)` → `team_id`, thư mục, giai đoạn, danh sách file.
2. Nếu **không có file `.mp4`** trong `final/` → `set_video_stage(video_id, "production", note="QC: chưa có thành phẩm")`, ghi lý do vào `notes.md`, báo và kết thúc.
3. Gọi subagent `support` ở chế độ **QC** với `team_id`, `video_id`, thư mục video. Nó chạy `node tools/qc-video.mjs`, trích và **xem khung hình thật**, đối chiếu `plan.md`/`script.md`, rồi tự `set_video_stage` thành `ready` (đạt) hoặc `production` (rớt, kèm danh sách sửa trong `notes.md`).
4. Báo kết quả bằng **số đo thật** (kết quả `qc-video`, số khung đã xem), không "làm tròn" lỗi thành đạt. Nếu `support` chưa đưa ra phán quyết (video vẫn `review`) thì nói rõ để worker đánh dấu cần người.
