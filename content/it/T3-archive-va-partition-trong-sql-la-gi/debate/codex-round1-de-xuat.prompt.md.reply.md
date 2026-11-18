### 1. **Tủ hồ sơ của Cáo** · 30 giây
- **Hook:** “Chia ngăn hay chuyển kho?”
- **Nhịp:** **0–3s:** Cáo đứng giữa tủ nhiều ngăn và kho riêng. **3–15s:** Partition chia bảng theo tháng; nhiều ngăn nhưng vẫn một bảng logic. Archive chuyển dữ liệu cũ, ít dùng khỏi bảng chính sang nơi lưu riêng. **Kết:** Archive vẫn giữ dữ liệu để tra cứu. Hai cách có thể kết hợp; partition không bảo đảm luôn nhanh.
- **Vì sao giữ chân:** Hai thao tác trực quan giải đáp hook; từng nhóm hồ sơ đổi vị trí ngay khi được giải thích.
- **Cách làm với công cụ hiện có:** Node/Python vẽ tủ, ngăn và kho phẳng; ffmpeg chuyển động hàng dữ liệu. Cáo chỉ bảng, không nhép miệng; giọng Bắc, phụ đề.
- **Rủi ro thừa nhận:** “Kho riêng” dễ bị hiểu là ngoài cơ sở dữ liệu. Gắn rõ: “Có thể là bảng lưu trữ cùng CSDL”.

### 2. **Một yêu cầu, dữ liệu đi đâu?** · 35 giây
- **Hook:** “Tìm tháng này, quét tất cả?”
- **Nhịp:** **0–3s:** Yêu cầu báo cáo gặp bảng nhiều tháng. **3–15s:** Minh hoạ partition theo tháng: truy vấn phù hợp chỉ quét phần liên quan. Giải thích “partition pruning” là bỏ qua phần không cần đọc. **Kết:** Đối chiếu archive: hàng cũ chuyển khỏi bảng chính sang bảng lưu trữ. Chốt partition vẫn một bảng logic; khả năng bỏ qua phân vùng tuỳ truy vấn và hệ quản trị.
- **Vì sao giữ chân:** Người xem theo đường quét sáng màu, chờ biết phần nào được đọc.
- **Cách làm với công cụ hiện có:** Sơ đồ tự vẽ bằng mã; ffmpeg tô sáng ô, zoom và phụ đề. Cáo cầm bảng; giọng Bắc.
- **Rủi ro thừa nhận:** Hoạt ảnh dễ ngụ ý tăng tốc chắc chắn. Không dùng đồng hồ hay tỷ lệ tốc độ; ghi “minh hoạ phạm vi quét”.

### 3. **Task này chọn gì?** · 35 giây
- **Hook:** “Archive hay partition? Chọn thử!”
- **Nhịp:** **0–3s:** Hai thẻ lựa chọn xuất hiện. **3–15s:** Hai tình huống: chia bảng theo tháng nhưng giữ một bảng logic → partition; chuyển hồ sơ cũ khỏi bảng chính, vẫn giữ tra cứu → archive. **Kết:** Tình huống thứ ba chọn cả hai: phân vùng theo tháng rồi lưu trữ tháng cũ. Chốt archive là cách quản lý dữ liệu, không phải lệnh SQL chuẩn.
- **Vì sao giữ chân:** Mỗi tình huống chừa một nhịp đoán trước khi lật đáp án; câu cuối phá kỳ vọng chỉ được chọn một.
- **Cách làm với công cụ hiện có:** Thẻ chữ ffmpeg, hàng dữ liệu tự vẽ; Cáo suy nghĩ rồi gật đầu. Giọng Bắc, phụ đề, không nhạc.
- **Rủi ro thừa nhận:** Trắc nghiệm dễ thành học thuộc. Mỗi đáp án kèm sơ đồ trước–sau, nhấn mạnh dữ liệu còn trong bảng chính hay đã chuyển sang nơi lưu riêng.