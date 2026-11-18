---
name: produce
description: Giao video cho Codex (Producer) làm chi tiết và dựng thành phẩm qua hàng đợi nền (tự chuyển tài khoản Codex khi hết limit, tự chờ hồi limit), sau đó Claude tự QC. Cú pháp "/produce <video-id> [video-id...]" (thêm --force để làm lại).
argument-hint: "<video-id> [video-id...] [--force]"
disable-model-invocation: true
---

Đối số: `$ARGUMENTS`.

1. Với **mỗi** video-id: gọi `enqueue_job(kind="produce", video_id, force)` (`force=true` nếu có `--force`). Việc được xếp hàng và **worker nền** tự lo: chọn tài khoản Codex còn dùng được, chuyển tài khoản khi hết limit, chờ hồi limit rồi chạy tiếp, ghi log vào `epNN/logs/`. Mỗi đội chỉ có 1 Producer nên video cùng đội chạy tuần tự, khác đội chạy song song.
2. Điều kiện (hệ thống tự kiểm, bạn chỉ cần báo): phải có `plan.md`; nếu thiếu → báo giám đốc chạy `/make-plan` trước. Chưa có tài khoản Codex nào dùng được → việc sẽ **chờ** và tự chạy khi giám đốc đăng nhập/thêm tài khoản (`codex login` / `accounts add codex …`).
3. Báo giám đốc: các việc #id đã xếp hàng; theo dõi tại dashboard http://localhost:4747 (khung "Hàng đợi việc nền" và "Tài khoản"). Nếu kết quả `worker.alive=false` và `started=false`, nói rõ worker chưa chạy và cách bật (`npm run start --prefix studio`).
4. **Không** đợi kết quả trong phiên này. Khi Codex làm xong, worker **tự xếp việc QC** (Claude); QC rớt vì lỗi dựng thì tự xếp sản xuất lại (dưới 10 lần/video), còn QC báo lỗi thiết kế (`QC-THIẾT-KẾ`) thì video giữ ở `review` chờ giám đốc quyết, không lặp sản xuất; Codex kẹt thì tự xếp việc gỡ vướng cho Claude (tối đa 4 lần/video). Chỉ khi vượt ngưỡng mới cần giám đốc (hiện ở "Cần giám đốc chú ý").
