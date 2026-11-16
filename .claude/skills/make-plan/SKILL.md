---
name: make-plan
description: Chạy quy trình ý tưởng → kế hoạch cho 1 chủ đề đã giao - giao cho đội, 2 agent Claude (ideator-a, ideator-b) tranh luận, planner chốt concept và viết kế hoạch/kịch bản cho Codex. Cú pháp "/make-plan <topic-id> [số-tập] [vòng]". Worker nền cũng gọi lệnh này.
argument-hint: "<topic-id> [số-tập=1] [vòng=2]"
disable-model-invocation: true
---

Đối số: `$ARGUMENTS` = `<topic_id> [số tập, mặc định 1] [số vòng tranh luận, mặc định 2, tối đa 4]`.

> **Chạy nền (không có người trả lời):** không đặt câu hỏi cho giám đốc. Gặp chỗ lẽ ra phải hỏi → chọn phương án an toàn nhất, ghi rõ giả định vào `plan.md`, hoặc dừng và nêu cần gì ở kết quả cuối.
> **Chạy lại sau khi bị ngắt (hết limit/lỗi):** làm Bước 0 để TIẾP TỤC từ chỗ dở, không làm lại phần đã xong.

## Bước 0 — Kiểm tra tiến độ có sẵn (idempotent)
`list_topics` lấy chủ đề; nếu đã `assigned`, đọc thư mục chủ đề (`list_videos`/`get_video`) xem đã có gì:
- Có `plan.md` + `concept.md` + `epNN/script.md` → **đã xong**: chỉ chắc video ở `planning`, báo kết quả, kết thúc.
- Có `concept.md` mà thiếu `plan.md`/`script.md` → nhảy tới **Bước 3** (Planner).
- Có `debate.md` → đọc số vòng đã xong, **tiếp tục** từ vòng kế tiếp (chỉ chạy các vòng còn thiếu) rồi Bước 3.
- Chưa có gì → làm từ Bước 1. Không giao đội lần 2 (không tạo thêm video trùng).

## Bước 1 — Giao đội
1. `assign_topic(topic_id, episodes)` (bỏ qua nếu chủ đề đã giao). Nếu **bị từ chối vì hết suất/chưa có đội**: dừng, báo đúng lý do, gọi subagent `dept-head` (prompt: mã phòng + "rà năng lực và đề xuất nếu cần") để tạo đề xuất chờ duyệt. **Không** lách bằng đội/ngày khác khi giám đốc chưa đồng ý.
2. Ghi lại: `team_id`, `team`, `topic_folder`, `videos[]`. Đọc `<topic_folder>/brief.md`.
3. `set_video_stage(<mỗi video>, "ideation")` (nếu chưa qua giai đoạn này).

## Bước 2 — Tranh luận ý tưởng (2 agent Claude)
Subagent không nói chuyện trực tiếp với nhau: **bạn là người chuyển lời** và ghi toàn bộ vào `<topic_folder>/debate.md` (tiêu đề từng vòng + nguyên văn từng bên). Mỗi lượt gọi bằng Agent tool; **luôn truyền trong prompt**: `team_id`, `topic`, `brief`, `topic_folder`, số vòng hiện tại/tổng, và toàn bộ lập luận bên kia ở lượt trước.

- Vòng 1: `ideator-a` (3 concept) → `ideator-b` (chấm điểm, phản biện, phương án thay thế, chọn 1).
- Vòng 2..N: `ideator-a` (đáp lại + bản cải tiến) → `ideator-b` (phản biện lại + phán quyết). Vòng cuối B phải nêu **điểm bất đồng còn lại**.
- Nếu 2 bên đã đồng thuận sớm, được kết thúc sớm (ghi lý do vào `debate.md`).
Sau mỗi vòng, tóm tắt 2 dòng (không đổ nguyên văn).

## Bước 3 — Lên kế hoạch
Gọi `planner` với: `team_id`, `topic_folder`, danh sách `videos`, đường dẫn `brief.md` + `debate.md`. Yêu cầu tạo `concept.md`, `plan.md`, `epNN/script.md`. Sau đó `set_video_stage(<mỗi video>, "planning")`.

## Bước 4 — Dọn trạng thái & báo cáo
- `report_status(team_id, role=ideator_a|ideator_b|planner, status="idle")` cho ai còn "working".
- Báo (ngắn): concept được chọn + lý do, điểm bất đồng nếu có, các tập/thời lượng, mục **"Cần giám đốc cung cấp"** trong `plan.md` (nếu có), đường dẫn `plan.md`.
- Kết thúc bằng: "Duyệt kế hoạch thì bấm **Duyệt & sản xuất** trên dashboard hoặc `/produce <video-id…>`." **Không tự chạy produce.**
