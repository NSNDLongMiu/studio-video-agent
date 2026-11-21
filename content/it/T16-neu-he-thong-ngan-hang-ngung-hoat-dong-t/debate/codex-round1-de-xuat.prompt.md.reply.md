## Vòng 1 — Đề xuất độc lập

**Trọng tâm** — Trong 24 giờ giả định, dân văn phòng Việt Nam sẽ vướng gì khi thanh toán? Thông điệp chung là phạm vi gián đoạn phụ thuộc vào khâu gặp lỗi và khả năng dự phòng.

### 1. QR đứng hình ở quầy cơm

- **Hook ≤2s** — Cáo đưa điện thoại lên mã QR ở quầy. “Có tiền, sao chưa trả được?”
- **Nhịp** — 0–3s: thấy quầy → quét → hiện “Chưa xác nhận”, suất cơm còn chờ. 3–15s: gói yêu cầu đi qua mạng rồi dừng ở khối xử lý trung tâm. Giây 45: chốt rằng nếu khối này gián đoạn suốt 24 giờ, các kênh phụ thuộc vào nó có thể bị gián đoạn. Mời chọn khâu bị nghẽn.
- **Giữ chân và chiều sâu** — Suất cơm đang chờ tạo hệ quả ngay. QR khởi tạo yêu cầu, hệ thống phía sau xử lý. Sai lầm là coi quét xong như đã trả.
- **Dựng** — Nền `office`, icon QR, FlowDiagram `blocked`.
- **Rủi ro** — Sơ đồ dễ gợi ý mọi QR, ATM và chuyển khoản đều chung một đường xử lý. Gắn nhãn “Luồng minh họa”. [BIS về thanh toán bán lẻ](https://www.bis.org/cpmi/publ/d40.pdf)

### 2. Bấm gửi lần nữa?

- **Hook ≤2s** — Cáo chia tiền cơm, tay chực bấm lại. “Bên kia chưa nhận. Gửi lại?”
- **Nhịp** — 0–3s: bấm gửi → màn hình chờ → đồng nghiệp vẫn đợi. 3–15s: đặt trạng thái trên app cạnh bản ghi giao dịch, đánh dấu “Chưa xác định”. Giây 46: chốt kiểm tra lịch sử và thông báo chính thức trước khi gửi lại. Mời chọn thao tác đầu tiên.
- **Giữ chân và chiều sâu** — Một nút bấm tạo lựa chọn thật. Mất phản hồi khiến người gửi chưa biết hệ thống đã ghi nhận đến đâu. Gửi lại ngay có thể tạo lệnh thứ hai.
- **Dựng** — Nền `database`, hai card, cursor.
- **Rủi ro** — Chưa đủ dữ kiện để khẳng định lệnh đầu đã được ghi hay giao dịch sẽ tự hoàn. [BIS về các bước xử lý thanh toán](https://www.bis.org/cpmi/publ/d40.pdf)

### 3. Đường dự phòng có chạy?

- **Hook ≤2s** — Cáo đứng trước ATM giả lập, màn hình báo gián đoạn. “Có máy dự phòng, sao vẫn chờ?”
- **Nhịp** — 0–3s: chọn rút → báo gián đoạn → chưa nhận tiền. 3–15s: hiện hai tuyến, một ví dụ cùng phụ thuộc mạng đang lỗi. Giây 48: chốt tuyến dự phòng chỉ giúp khi các phụ thuộc cần thiết hoạt động. Mời chọn điểm lỗi chung.
- **Giữ chân và chiều sâu** — Người xem đoán tuyến nào chạy. Sai lầm là đếm máy mà bỏ qua mạng và dữ liệu dùng chung.
- **Dựng** — Nền `incident`, FlowDiagram hai nhánh, đèn trạng thái.
- **Rủi ro** — Chưa đủ dữ kiện để khẳng định dịch vụ nào hồi phục trong 24 giờ. [Basel về khả năng phục hồi](https://www.bis.org/committees/bcbs/basel-consolidated-guidelines/module/orr/20)

**Dựng chung** — 9:16, 1080×1920, 50–55 giây. Nhãn “Giả định” và “AI”, TTS Việt, không nhạc. Cáo PNG tĩnh mở/giữa/kết, rộng 10–18% khi cùng minh họa, cắt khi đổi dáng. Áp dụng bản tóm tắt chuẩn trong brief vì chưa đọc được tài liệu gốc.