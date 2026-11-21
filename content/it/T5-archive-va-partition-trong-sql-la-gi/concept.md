# IT-T5-E01 — Chia rồi, vẫn đầy?

**Concept đã chốt.** Một màn hình tạo đơn báo lỗi dù bảng đơn đã chia theo tháng. Nghịch lý «chia rồi, sao vẫn đầy?» của Codex dẫn vào Partition để tổ chức các dòng trong một bảng và Archive để giữ dữ liệu cũ ở nơi lưu khác. Theo *Phán quyết cuối* trong `debate.md`, lợi ích truy vấn và trình tự sao chép → tra kiểm → bỏ bản ở kho chính giữ theo đề xuất của Claude. Sự cố ghi đơn cho người xem thấy ngay vì sao hiểu nhầm này có hậu quả.

**Khán giả và giọng điệu.** Người mới học SQL, người làm báo cáo hoặc xử lý đơn hàng. Cáo nói như đồng nghiệp đang chỉ cho bạn xem lỗi trên màn hình, xưng «mình», gọi «bạn», mỗi câu một ý. Mở thẳng vào sự cố. Một giọng Bắc Minh Đức kể xuyên suốt.

**Lời hứa của series.** Mỗi tập dùng một tình huống công việc để giúp bạn nhận ra nguyên nhân và nhớ cách xử lý. Tập này giúp bạn phân biệt chia bảng để truy vấn có thể bỏ qua phần không liên quan với lưu trữ dữ liệu cũ để giải phóng chỗ ở kho chính trong tình huống minh hoạ.

| Mốc | Trải nghiệm của người xem |
|---|---|
| 0,00–2,00 s · Hook | «Chia rồi, vẫn đầy?» Cáo cạnh màn hình tạo đơn. Bảng vừa chia theo tháng, vạch «Kho chính» đỏ, thẻ đơn bật ngược khi gặp dấu lỗi trước giây 2. |
| Trước giây 5 · Ích lợi đầu tiên | Nhìn đúng vạch «Kho chính» để nhận ra việc chia bảng chưa xử lý chỗ đang đầy trong ví dụ. Lời xác nhận đơn mới chưa lưu xong ở 3,06 s, vạch được nối trực tiếp với đường ghi đơn trước 4,37 s. |
| Khoảng giây 22 · Trả câu hỏi mở «Chia bảng rồi sao kho vẫn đầy?» | Cáo nói «Chia khay thì không nén, không xoá.» Các dòng vẫn nguyên số lượng và kích thước. Máy quay trở về đúng vạch đỏ ở 20,77 s, lời xác nhận «Vạch kho vẫn đỏ.» kết thúc ở 21,68 s. |
| 22,48–26,49 s · Lợi ích kỹ thuật đầu tiên | Một lượt truy vấn lọc theo tháng đi vào khay cần đọc. Phần ngoài kỳ có thể được bỏ qua và các khay vẫn ở nguyên chỗ. |
| 26,49–41,96 s · Giải quyết sự cố | Sao chép đơn cũ sang nơi lưu trữ khác, tra lại và đối chiếu đủ bản sao, rồi mới bỏ bản ở kho chính. Chia sẵn theo tháng giúp tách nguyên phần cũ, có lưu ý về khoá bảng khi tách. Vạch chỉ hạ sau khi phần cũ đã được bỏ khỏi kho chính. Màn hình lưu được đơn mới và trả về đúng đơn cũ từ kho lưu. Cáo hỏi «Bạn từng tra đơn cũ ở đâu?» |

## Bộ câu thoại Cáo đã chốt

- Mở — «Chia rồi, vẫn đầy?»
- Giữa — «Chia khay thì không nén, không xoá.»
- Kết — «Cất kho, kiểm xong mới xoá. Đơn cũ vẫn tra được.» Câu đầu vào ở nhịp cuối của quy trình, câu sau đi cùng hình tra lại đơn ở cảnh kết.

Đơn hàng và trạng thái kho là tình huống dựng (ghi “ví dụ dựng” ở caption khi đăng, không đốt nhãn lên hình). Kho lưu trong ví dụ là một nơi lưu trữ khác, tách khỏi kho chính. Archive là quy trình quản lý dữ liệu cũ. Cách thực hiện tuỳ hệ quản trị.
