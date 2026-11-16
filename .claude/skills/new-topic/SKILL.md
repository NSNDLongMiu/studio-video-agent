---
name: new-topic
description: Giám đốc giao chủ đề mới cho một phòng ban; hệ thống tự chạy nền quy trình ý tưởng → kế hoạch (2 agent Claude tranh luận, Planner viết kế hoạch) qua hàng đợi, tự chuyển tài khoản khi hết limit và tự chờ hồi limit. Cú pháp "/new-topic <mã-phòng> | <chủ đề> | <yêu cầu thêm>".
argument-hint: "<mã-phòng> | <chủ đề> | <yêu cầu thêm> | số-tập=N | vòng=N | tự-sản-xuất | --live"
disable-model-invocation: true
---

Đối số: `$ARGUMENTS` — các phần ngăn bằng `|`. Phần 1 = mã phòng, phần 2 = chủ đề, phần 3 = yêu cầu thêm (tuỳ chọn). Tuỳ chọn: `số-tập=N` (mặc định 1), `vòng=N` (số vòng tranh luận, mặc định 2), `tự-sản-xuất` (xong kế hoạch thì Codex làm luôn, bỏ qua bước bạn duyệt kế hoạch), `--live` (chạy ngay trong phiên này thay vì nền).

1. Thiếu phòng hoặc chủ đề → hỏi lại đúng phần thiếu (gọi `studio_overview` để liệt kê các phòng đang mở). Không tự đoán phòng.
2. `submit_topic(dept, text, brief)` → ghi nhận `topic_id`. Báo ngắn: đã ghi chủ đề #id vào phòng nào.
3. **Mặc định (nền):** gọi `enqueue_job(kind="plan", topic_id, episodes, rounds, auto_produce)`. Báo cho giám đốc: việc #id đã xếp hàng, worker sẽ tự chạy; theo dõi ở dashboard http://localhost:4747 (khung "Hàng đợi việc nền"); xong kế hoạch sẽ có nút **Duyệt & sản xuất** (trừ khi chọn `tự-sản-xuất`). Nếu kết quả `worker.alive=false` và `started=false` thì nói rõ worker chưa chạy và cách bật (`npm run start --prefix studio`).
4. **Nếu có `--live`:** chạy ngay đúng quy trình của skill `make-plan` (gọi Skill `make-plan` với `<topic_id> <số-tập> <vòng>`) trong phiên này, không xếp hàng.
