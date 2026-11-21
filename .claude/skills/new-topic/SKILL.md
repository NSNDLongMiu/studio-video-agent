---
name: new-topic
description: Giám đốc giao chủ đề mới cho một phòng ban; hệ thống tự chạy nền quy trình ý tưởng → kế hoạch (2 agent Claude tranh luận, Planner viết kế hoạch) qua hàng đợi, tự chuyển tài khoản khi hết limit và tự chờ hồi limit. Cú pháp "/new-topic <mã-phòng> | <chủ đề> | <yêu cầu thêm>".
argument-hint: "<mã-phòng> | <chủ đề> | <yêu cầu thêm> | số-tập=N | vòng=N | chỉ-kế-hoạch | --live"
disable-model-invocation: true
---

Đối số: `$ARGUMENTS` — các phần ngăn bằng `|`. Phần 1 = mã phòng, phần 2 = chủ đề, phần 3 = yêu cầu thêm (tuỳ chọn). Tuỳ chọn: `số-tập=N` (mặc định 1), `vòng=N` (số vòng tranh luận, mặc định 2, tối đa 4), `chỉ-kế-hoạch` (dừng ở kế hoạch để giám đốc đọc, không tự sản xuất; mặc định là TỰ sản xuất vì giám đốc không cần duyệt kế hoạch — chốt 18/11/2026), `--live` (chạy ngay trong phiên này thay vì nền).

**Độ dài mặc định:** chuẩn 45–75 s, mỗi video một câu hỏi (D1, giám đốc chốt 20/11/2026). Muốn định dạng giải thích sâu 150–190 s hoặc ngắn 15–45 s thì giám đốc ghi rõ ở phần "yêu cầu thêm"; không có ghi chú đó thì Ý tưởng và Kịch bản làm theo 45–75 s.

1. Thiếu phòng hoặc chủ đề → hỏi lại đúng phần thiếu (gọi `studio_overview` để liệt kê các phòng đang mở). Không tự đoán phòng.
2. `submit_topic(dept, text, brief)` → ghi nhận `topic_id`. Báo ngắn: đã ghi chủ đề #id vào phòng nào. **Chủ đề giám đốc yêu cầu không bị chặn bởi suất video/ngày** (suất chỉ giới hạn việc tự động; giám đốc chốt 18/11/2026): đội đã hết suất hôm nay vẫn nhận, và báo thêm "vượt suất theo yêu cầu của giám đốc" nếu kết quả giao có `over_capacity` > 0 — đừng hỏi lại hay xếp sang ngày khác.
3. **Mặc định (nền):** gọi `enqueue_job(kind="plan", topic_id, episodes, rounds)` — **chỉ thêm `auto_produce=false` khi giám đốc ghi `chỉ-kế-hoạch`**; không truyền thì theo cài đặt `auto_produce` (mặc định bật). Báo cho giám đốc: việc #id đã xếp hàng, worker sẽ tự chạy; theo dõi ở dashboard http://localhost:4747 (khung "Hàng đợi việc nền"); xong kế hoạch worker tự xếp sản xuất cho Codex (không cần bấm duyệt); chỉ khi `chỉ-kế-hoạch` mới có nút **Duyệt & sản xuất**. Nếu kết quả `worker.alive=false` và `started=false` thì nói rõ worker chưa chạy và cách bật (`npm run start --prefix studio`).
4. **Nếu có `--live`:** chạy ngay đúng quy trình của skill `make-plan` (gọi Skill `make-plan` với `<topic_id> <số-tập> <vòng>`) trong phiên này, không xếp hàng.
