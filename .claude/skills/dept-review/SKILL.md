---
name: dept-review
description: Yêu cầu trưởng phòng rà soát năng lực so với chỉ tiêu video/ngày và ĐỀ XUẤT tăng/giảm đội. Dùng sau khi giám đốc đổi chỉ tiêu (vd "phòng thể thao lên 4 video/ngày") hoặc khi dashboard báo thiếu năng lực. Cú pháp "/dept-review <mã-phòng>". Worker nền cũng gọi lệnh này.
argument-hint: "<mã-phòng>"
disable-model-invocation: true
---

Đối số: `$ARGUMENTS` = mã phòng (nếu trống, gọi `studio_overview` và chạy cho từng phòng đang thiếu năng lực hoặc có `review_requested`). Có thể chạy nền (không có người trả lời).

1. Gọi subagent `dept-head` với prompt: mã phòng + "Rà soát năng lực và đề xuất nhân sự nếu cần, theo quy trình của bạn".
2. `list_proposals(status="pending", dept)` để hiển thị đề xuất vừa tạo: loại, số đội, **lý do kèm số liệu**, tác động (năng lực sau khi duyệt vs chỉ tiêu).
3. Báo giám đốc: đề xuất chờ duyệt. Giám đốc bấm Duyệt/Từ chối trên dashboard, hoặc nói "duyệt #N" / "từ chối #N vì …" trong phiên tương tác.
4. **Chỉ khi giám đốc nói rõ trong tin nhắn hiện tại** mới gọi `approve_proposal` / `reject_proposal` (có hỏi xác nhận). Chạy nền thì **không bao giờ** có các công cụ này. Không tự duyệt vì "hợp lý".
