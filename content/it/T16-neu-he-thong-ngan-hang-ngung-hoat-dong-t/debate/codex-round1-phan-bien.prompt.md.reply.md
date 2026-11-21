## Phản biện vòng 1 · IT-T16-E01

**Trọng tâm** là một ngày gián đoạn thanh toán nhìn từ dân văn phòng Việt Nam. Thông điệp cần làm rõ là báo lỗi thanh toán chưa cho biết số dư hay trạng thái cuối của giao dịch.

**Thứ tự điểm /10** — Hook & giữ chân · Khớp brief · Khả thi · An toàn · Độc đáo.

### Claude

1. **Một cuốn sổ, mọi cánh cửa — 8 · 9 · 9 · 6 · 7.** QR lỗi ở quán gần người xem, nhưng mô tả mọi kênh cùng phụ thuộc một sổ cái dễ biến sơ đồ minh họa thành khẳng định chung. Mở bằng Cáo chưa trả được tiền cà phê, cho thấy hệ quả trước giây 5. Khoảng giây 12, dùng FlowDiagram cho thấy yêu cầu thanh toán trong tình huống này chưa nhận được xác nhận. Bỏ đoạn ACID và lời bảo đảm dữ liệu còn nguyên.

2. **24 giờ, từng giờ một — 7 · 8 · 9 · 6 · 7.** Các mốc lương, hóa đơn và khôi phục tạo cảm giác có lịch sự cố cố định. Giữ một khoản thanh toán xuyên suốt, trả lời ý nghĩa của báo lỗi ở giây 12, rồi dùng “trưa” và “cuối ngày” làm ví dụ về hệ quả. Để trạng thái khôi phục mở.

3. **Vì sao ngân hàng có hai bản sao? — 6 · 7 · 9 · 8 · 8.** Hook “máy chủ chết” thiếu hệ quả với người xem, còn chuỗi nguyên nhân dễ loãng. Mở bằng QR vẫn lỗi khi đã chuyển sang hệ thống dự phòng. Dùng FlowDiagram chỉ một đường mạng dùng chung trong mô hình giả định.

### Gemini

1. **32 triệu giao dịch/ngày biến mất — 8 · 6 · 8 · 4 · 7.** NAPAS công bố bình quân hơn 32 triệu giao dịch/ngày qua hệ thống của mình trong năm 2025. Counter về 0 và chữ “biến mất” dễ khiến người xem hiểu có sự cố toàn quốc hoặc mất dữ liệu. Bỏ counter, theo một giao dịch QR chưa được xác nhận tại một ngân hàng giả định. [NAPAS](https://napas.com.vn/napas-to-chuc-thanh-cong-hoi-nghi-to-chuc-thanh-vien-nam-2025-182251124111300617.htm)

2. **Hai bộ não — 6 · 6 · 8 · 5 · 9.** Hai số dư 10 triệu và 0 đồng biến xung đột kỹ thuật thành hình ảnh mất tiền. Dùng hai cửa sổ cùng báo “đang xử lý” một yêu cầu. Giữ một ý là hệ thống cần xác định bên nào được quyền ghi.

3. **803 giờ sập — 6 · 4 · 8 · 6 · 6.** Ít nhất 803 giờ là tổng thời gian gián đoạn cộng dồn của chín tổ chức ở Anh. Con số ấy không xác lập nguyên nhân do mainframe hay bản cập nhật. Bỏ phần quy kết và mở bằng một khoản thanh toán bị kẹt trong ngày giả định. [Ủy ban Ngân khố Quốc hội Anh](https://committees.parliament.uk/committee/158/treasury-committee/news/205611/more-than-one-months-worth-of-it-failures-at-major-)

**Chọn “Một cuốn sổ, mọi cánh cửa”**, đưa tình huống quầy cơm của Codex vào phần mở. Một khoản thanh toán bị kẹt đủ tạo hệ quả trước giây 5, giải thích ở giây 12 và dẫn tới câu chốt “Kiểm tra trạng thái trước khi thử lại.”