# Cùng dữ liệu, hai việc khác nhau

**Bản đầu — Claude đã duyệt (xem `review/script-r2.md`).** Đội IT · Đội 3 · team_id 4. Một tập: **IT-T3-E01**, thư mục `ep01`, mục tiêu **39 giây**. Ràng buộc lấy từ mục “Phán quyết cuối” trong `debate.md`.

## Concept và lý do chọn

Một sơ đồ bảng dữ liệu biến đổi xuyên suốt: Partition chia thành nhiều phần trong cùng một bảng logic; Archive chuyển dữ liệu cũ, ít dùng khỏi bảng chính sang nơi lưu riêng và vẫn giữ lại. Hai việc có thể dùng chung. Hai vế đều có định nghĩa, hình chứng minh và giới hạn.

Hook gọi cả hai thao tác ngay đầu, giữ câu hỏi đến đoạn kết. Cách hỏi này không dựa vào một hiểu lầm được gán cho số đông. Sơ đồ sáng/mờ cho thấy phạm vi có thể phải đọc, không biểu diễn tốc độ. Archive có đoạn riêng, tránh thành chú thích cuối bài. Mười hai ô là ví dụ tự tạo, không phải số liệu thực tế.

## Khán giả, giọng điệu và lời hứa series

- Người mới học SQL, thực tập sinh và người làm báo cáo cần phân biệt hai khái niệm trước khi tìm hiểu cách triển khai.
- Giọng trẻ trung, rõ ràng, câu ngắn một ý; xưng “mình”, gọi “bạn”. Một giọng nam miền Bắc **Minh Đức**, không nhân vật phụ.
- Lời hứa của series: mỗi tập giúp bạn phân biệt một vấn đề IT bằng hình cụ thể, kèm điều kiện áp dụng; không hứa hiệu năng khi chưa có phép đo.

## Hook đã chọn

**Lời và chữ tại giây 0: “Bảng lớn: chia ra hay chuyển bớt?”** Chữ **“SQL”** xuất hiện đồng thời. Hai nhánh mang nhãn “Chia ra” và “Chuyển dữ liệu cũ”. Dáng Cáo: `think`.

Đo lời hook sau xử lý giọng: mục tiêu kết thúc trước giây 2. Nếu vượt 2,2 giây, dùng đúng dự phòng đã duyệt: **“Bảng lớn: chia hay chuyển?”**; chữ trên hình giữ nguyên câu đầy đủ. Nếu nằm trong khoảng 2–2,2 giây, tạo lại nhịp đọc để đạt mục tiêu hai giây. Không thêm câu chào.

## Bộ câu thoại Cáo dùng trong video

Đã tách câu dài của bộ thoại chốt, thêm nghĩa dễ hiểu và chuẩn hoá “Vẫn giữ lại”. Nội dung dưới đây khớp `ep01/script.md`; số ở lời đọc viết bằng chữ.

1. “Bảng lớn: chia ra hay chuyển bớt?”
2. “Chia ra gọi là Partition, tức phân vùng.”
3. “Là chia bảng thành nhiều phần.”
4. “Vẫn chung một tên bảng, dữ liệu vẫn đủ.”
5. “Sếp cần tháng mười một?”
6. “Lọc đúng cột chia.”
7. “Máy có thể bỏ qua phần khác.”
8. “Lọc cột khác, có thể vẫn đọc nhiều phần.”
9. “Chuyển bớt gọi là Archive, tức lưu trữ.”
10. “Dữ liệu cũ, ít dùng sang nơi riêng.”
11. “Vẫn giữ lại.”
12. “Nơi lưu tuỳ hệ thống.”
13. “Archive là cách quản lý.”
14. “Không phải lệnh SQL chuẩn.”
15. “Mình chốt: hai việc khác nhau.”
16. “Bạn có thể dùng chung.”
17. “Chia theo tháng, lưu trữ tháng cũ.”

## Tám nhịp đã chốt

`0–3` Hook → `3–9` Partition → `9–14` lọc cột chia → `14–18` lọc cột khác → `18–24` Archive → `24–28` dữ liệu vẫn còn → `28–32` cách quản lý → `32–39` kết hợp.

Giữ đúng giới hạn của phán quyết: không quiz, không ẩn dụ tủ hồ sơ, không giọng nữ, không nhạc nền, không logo hãng, không câu lệnh SQL minh hoạ, không chip index, không đồng hồ hay tỷ lệ tốc độ. Các chi tiết nâng cao về kích thước bảng, số phân vùng và MySQL ARCHIVE chỉ nằm trong bình luận ghim ở cuối kịch bản.
