Điểm theo thứ tự: **hook & giữ chân · khớp brief · khả thi · an toàn/chính xác · độc đáo**.

**1 · “Báo cáo tháng đọc cả năm năm” — 8 · 9 · 8 · 7 · 6**

Tình huống công sở rõ, ích lợi ở giây 4 và chuyển động có quan hệ với lời giải. Đây là concept Claude mạnh nhất.

- “Chỉ mở đúng một ngăn” quá tuyệt đối: phải có điều kiện lọc phù hợp với cách chia và hỗ trợ pruning. Sửa thành “có thể bỏ qua các phần không liên quan”; hình minh hoạ chọn đúng một tháng.
- Tia quét hết 60 ô dễ khiến người xem hiểu bảng chưa partition luôn phải đọc toàn bộ, bỏ qua khả năng dùng index. Nên chỉ minh hoạ cơ chế pruning trên bảng đã chia.
- Lưới 60 ô khó đọc ở 360×640. Dùng 6 khối tháng lớn, đặt chung khung **“Một bảng logic”**.
- Chốt “Partition: bỏ qua” mô tả một lợi ích, chưa định nghĩa partition. Đổi thành **“Partition: chia bảng · Archive: lưu giữ dữ liệu ít dùng”**. Kho khác là cách triển khai minh hoạ, không phải điều kiện bắt buộc của archive.

**2 · “DELETE chạy ba tiếng” — 8 · 7 · 8 · 5 · 8**

Hệ quả cụ thể, đối chiếu từng dòng với cả khối rất dễ nhìn. Nhưng concept đang nhập nhằng thao tác có thể gây mất dữ liệu.

- “Tháo ngăn” phải phân biệt **DETACH** với **DROP**: trong PostgreSQL, DETACH tách partition thành bảng riêng; DROP xoá partition. Không dùng chung một hình tháo khối cho cả hai.
- “Cất trước” nhưng phần giải thích lại “tháo rồi sao lưu” khiến thứ tự mâu thuẫn. Sửa thành: **“Cần giữ lại? Phải có phương án lưu và kiểm tra khả năng tra cứu trước khi xoá.”**
- Ích lợi đúng giây 5 chưa đạt yêu cầu *trước* giây 5; chuyển sang giây 4.
- Chủ đề định nghĩa hai khái niệm bị lấn bởi mẹo dọn log. Cần hiện rõ archive là cách quản lý dữ liệu, không phải lệnh SQL chung.

**3 · “Chia rồi mà vẫn chậm” — 8 · 7 · 8 · 5 · 7**

A/B tạo tương tác tốt, nhưng hai câu chốt dễ thành quy tắc sai.

- “Partition chỉ nhanh khi WHERE có khoá chia” quá mạnh. Sửa: **“Muốn pruning, điều kiện lọc phải phù hợp với khoá chia.”**
- B không lọc tháng chưa đủ kết luận “quét hết”: index và kế hoạch thực thi còn ảnh hưởng. Hiện **“Không loại được tháng chỉ từ điều kiện này”**.
- “Khoá chia = cột hay lọc” thiếu cân nhắc quản lý dữ liệu; archive lại chỉ được nhắc lướt.

**Nên đi tiếp:** bản lai **Codex 3 + tình huống mở của Claude 1**: cân bằng hai định nghĩa, cho thấy chia bảng chưa làm dữ liệu cũ biến mất, rồi trả câu hỏi kết hợp hai cách ở giây 19.