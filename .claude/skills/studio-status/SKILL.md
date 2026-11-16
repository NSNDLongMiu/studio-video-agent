---
name: studio-status
description: Xem tổng quan xưởng video - phòng ban nào, mấy đội, bao nhiêu người đang làm gì, tiến độ hôm nay, việc đang chờ giám đốc duyệt. Dùng khi giám đốc hỏi tình hình, ai đang làm gì, đội/phòng nào đang làm bao nhiêu video.
argument-hint: "[mã-phòng]"
---

1. Gọi MCP `studio_overview` (truyền `dept=$ARGUMENTS` nếu giám đốc nêu phòng cụ thể).
2. Trình bày lại **ngắn gọn, đúng số liệu**, theo thứ tự: (a) mục **"cần giám đốc chú ý"** trước (đề xuất chờ duyệt, video vướng, thiếu năng lực, thành viên im lặng quá lâu); (b) mỗi phòng 1-2 dòng: chỉ tiêu · số đội · người đang làm/tổng · video hôm nay xong/kế hoạch; (c) chỉ liệt kê chi tiết đội/người khi giám đốc hỏi sâu.
3. Nhắc: dashboard trực tiếp ở http://localhost:4747 (chạy bằng `npm run dashboard --prefix studio` nếu chưa mở).
4. Nếu có đề xuất chờ duyệt, hỏi giám đốc muốn duyệt/từ chối — **không tự quyết**.
