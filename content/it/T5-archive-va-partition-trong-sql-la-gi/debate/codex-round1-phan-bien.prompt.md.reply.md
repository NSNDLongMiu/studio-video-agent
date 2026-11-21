## Vòng 1 — Phản biện 3 concept của Claude

**Chọn concept 1.** Với người mới học SQL hoặc làm báo cáo, cảnh chờ số liệu tháng này làm rõ vấn đề ngay. Thông điệp cần đọng lại: partition chia một bảng theo khóa, ví dụ ngày đặt hàng. Archive là cách giữ dữ liệu ít dùng để tra lại khi cần, không có lệnh SQL chuẩn chung.

| Concept | Hook & giữ chân | Khớp brief | Khả thi | An toàn | Độc đáo |
|---|---:|---:|---:|---:|---:|
| 1. Báo cáo tháng chạy chậm | 8 | 9 | 9 | 8 | 7 |
| 2. Tủ hồ sơ công ty | 6 | 7 | 10 | 9 | 5 |
| 3. Xóa dữ liệu cũ | 9 | 7 | 7 | 6 | 8 |

**1. Báo cáo tháng chạy chậm.** Lời mở quá dài cho hai giây, còn cảnh chạy nhanh ở cuối dễ thành lời hứa hiệu năng. Mở bằng Cáo trước màn hình xoay, giọng “Báo cáo chưa ra!”, gắn nhãn “Ví dụ dựng”. Trước giây 5, cho thấy sếp đang chờ số liệu tháng này. Khoảng giây 10, bộ lọc ngày chỉ làm sáng khay tháng cần đọc. Đến giây 32, chạy lại cùng bộ lọc và chốt “Lọc theo tháng, PostgreSQL có thể bỏ qua các khay ngoài kỳ. Đơn cũ vẫn tra được trong kho lưu trữ.” Giữ nguyên kích thước các khay khi chia để tránh gợi ý nén hoặc xóa. [PostgreSQL — Partition pruning](https://www.postgresql.org/docs/current/ddl-partitioning.html#DDL-PARTITION-PRUNING)

**2. Tủ hồ sơ công ty.** “Database có bị vậy không?” quá rộng, còn câu kết chưa tìm được tờ hồ sơ đã mở. Cho Cáo mở ngăn trống, nói “Thiếu đơn cũ!”. Trước giây 5, cho thấy khách đang đợi đối soát. Chuyển ngay sang bảng đơn hàng chia theo năm, rồi minh họa đơn ít dùng được chuyển sang kho. Giây 30, tìm lại đúng đơn và chốt “Đơn cũ còn trong kho, tra lại được.”

**3. Xóa dữ liệu cũ.** Sự cố có sức kéo, nhưng cảnh hệ thống hồi phục ngay sau `DETACH` gợi một cách chữa treo máy. Đổi hook thành “Báo cáo bị kẹt!” và cho thấy tác vụ dọn dữ liệu đang chạy. Giây 12, minh họa công việc phải xử lý theo từng dòng. Giây 34, trả lời bằng phương án cho lần dọn sau: nếu bảng đã chia theo tháng, PostgreSQL có thể tách phần cũ thành bảng riêng để đem đi lưu trữ. Thao tác tách vẫn cần khóa. [PostgreSQL — Bảo trì partition](https://www.postgresql.org/docs/current/ddl-partitioning.html#DDL-PARTITIONING-MAINTENANCE)

**Bản dựng chọn:** Concept 1, khoảng 36–40 giây. Dùng Pillow/ffmpeg, 9:16 ở 1080×1920, ít chữ, giọng chậm có khoảng nghỉ, hiệu ứng nhẹ, không nhạc nền. Cáo tĩnh ở mở/giữa/kết, chiếm 15–25% bề ngang khi đứng cạnh sơ đồ. Gắn nhãn AI. Cuối mời chọn nhẹ “Tra đơn cũ ở đâu: bảng chính hay kho?”

Tôi chấm theo phần chuẩn tóm tắt trong brief. Workspace không có `docs/chat-luong-xem.md`.