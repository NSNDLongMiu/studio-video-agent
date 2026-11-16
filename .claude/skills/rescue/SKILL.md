---
name: rescue
description: Claude ra hỗ trợ khi Codex làm 1 video bị kẹt/vướng (video có cảnh báo trên dashboard). Worker nền tự xếp việc này khi Codex kẹt; giám đốc cũng gọi tay được. Cú pháp "/rescue <video-id>".
argument-hint: "<video-id> [--live]"
disable-model-invocation: true
---

Đối số: `$ARGUMENTS` = `video_id` (kèm `--live` nếu muốn chạy ngay trong phiên này; nếu bạn đang được gọi bởi worker nền thì cứ làm trực tiếp theo các bước dưới, không xếp hàng nữa, không đặt câu hỏi).

- Khi giám đốc gõ tay **không có `--live`** và bạn đang ở phiên tương tác: gọi `enqueue_job(kind="rescue", video_id)` rồi báo đã xếp hàng; kết thúc.
- Ngược lại làm các bước sau:

1. `get_video(video_id)` → `team_id`, `needs_help`, `help_reason`, thư mục. Nếu không vướng, nói rõ và kết thúc.
2. Gọi subagent `support` chế độ **RESCUE** với `team_id`, `video_id`, `help_reason`. (Nó tự đọc `notes.md`, log, plan.)
3. Khi nó xong:
   - Đã sửa kế hoạch/hướng dẫn hoặc đã tự xử lý xong phần khó → `resolve_escalation` đã được gọi; worker sẽ tự xếp sản xuất lại/QC.
   - Cần giám đốc cung cấp thứ gì (nhạc, tài khoản, nguồn hình) → nêu rõ, **không** gỡ cờ vướng, không bịa.
4. Báo nguyên nhân gốc, đã làm gì, và việc tiếp theo (ngắn).
