# IT-T4-E01 — Báo cáo đang đợi, hóa đơn phải còn

Bản sửa, vòng 2 · 18/11/2026 · team_id: 4 · Kịch bản chờ Claude review, chưa duyệt sản xuất.

## Concept đã chốt và lý do

Theo **Phán quyết cuối** trong `debate.md`: bản lai **“Báo cáo đang đợi, hóa đơn phải còn”**. Một mạch truyện: sếp đợi báo cáo → partition một bảng thành sáu khối tháng → lọc tháng có thể bỏ phần không cần, lọc khách chưa loại được tháng → dữ liệu cũ vẫn nguyên → kế toán tìm hụt hóa đơn → tìm lại đúng hóa đơn trong kho lưu.

Partition trả lời việc chia một bảng logic thành các phần. archive trả lời việc cất dữ liệu cũ/ít dùng và giữ đường tra lại. Dùng chính khối T1 mang hóa đơn nối hai việc, tránh kể hai ví dụ rời nhau. T1 chuyển nơi lưu là minh họa khái niệm, không phải mô phỏng một lệnh SQL. Không đưa lệnh tách/xóa partition vào hình hoặc lời; không dùng dung lượng ổ đĩa hay số đo hiệu năng.

## Khán giả, giọng điệu, lời hứa series

- Người mới làm backend, phân tích dữ liệu hoặc vận hành báo cáo; từng chờ báo cáo, tìm hóa đơn nhưng chưa rõ hai thuật ngữ.
- Giọng công sở trẻ, ngắn, một ý mỗi câu. Xưng **“mình”**, gọi **“bạn”** theo `docs/mascot.md` (xưng mình hoặc Cáo); không câu chào, không chê người chưa biết SQL. Sếp/kế toán là silhouette, không có người thật.
- Lời hứa series: mỗi tình huống công sở giúp bạn hiểu một quan hệ dữ liệu bằng vật thể đổi rõ ràng, kèm giới hạn áp dụng; không hứa chia bảng sẽ luôn nhanh hơn.

## Các điểm bắt buộc và mốc dự kiến

| Điểm | Nội dung đã chọn |
|---|---|
| **Hook 0–2,2 s** | Lời chính xác: **“Sếp đợi báo cáo, bảng đơn hàng vẫn chạy!”** Tin nhắn sếp silhouette **“Vào họp rồi!”**, Cáo `surprised` bên laptop; phiến đơn hàng lớn có thanh tiến trình nhích chậm. Nhãn **“Tình huống dựng”**. Không khẳng định máy đang quét toàn bảng. |
| **Ích lợi đầu tiên, trước giây 5** | Phiến tách lưới 2 × 3 trong khung **“MỘT BẢNG”**; khoảng giây 3 chỉ T6 sáng. Lời chính xác, kết thúc chậm nhất 4,9 s: **“Chia bảng theo tháng, máy có thể bỏ qua phần không cần.”** |
| Điều kiện | Hai chip xuất hiện lần lượt **“tháng”** / **“khách”**; một khối xanh đối lập sáu khối vàng. Vàng nghĩa là chưa loại được tháng từ điều kiện này, không khẳng định quét mọi dòng. |
| Dữ liệu cũ | 10–13 s, khối cũ giữ nguyên kích thước và các hàng bên trong: chia bảng không tự xóa hay nén. |
| **Câu hỏi mở → trả ở giây 23,4** | Lúc 17,7 s hỏi **“Hóa đơn tháng đầu đi đâu?”** sau kết quả tìm trống cho **“HĐ 4721”**. Đúng 23,4 s: mở kho, T1 và đúng mã xuất hiện bên thẻ chỉ dẫn, Cáo tìm thấy. Không lộ vị trí kho trước đáp án. |
| Giới hạn archive | Lời **“Cất như vậy gọi là archive. Nó không phải lệnh SQL chuẩn, mỗi hệ mỗi cách.”** Đã đóng điểm kiểm nguồn theo review trong `ep01/script.md`: mỗi hệ mỗi cách có nguồn; ISO/IEC 9075 chưa đối chiếu trực tiếp, kết luận dựa trên tài liệu các hệ chính. |
| **Câu chốt hiển thị** | **“Partition: chia bảng”** / **“Archive: cất dữ liệu cũ”**. Viết hoa đầu nhãn theo nguyên văn chốt; trong lời/thân bài viết `archive`, không dùng toàn chữ hoa làm tên lệnh. |
| **Kêu gọi tự nhiên cuối, từ 29,95 s** | **“Bảng bạn chia theo cột nào? Chưa chia thì gõ 'chưa'.”** Chỉ ở lời/phụ đề, không thêm khối CTA chép lời trên hình. |

Mục tiêu **32,9 s** (khoảng 32–34 s), trần **40,0 s**, đuôi im ≤ 0,7 s. Mốc sẽ được duyệt lại sau đo TTS thật bởi Kịch bản/Đạo diễn hình ảnh; ích lợi vẫn xong trước giây 5. Tổng không kéo dài quá trần để nhồi nội dung.

## Bộ thoại dùng cho video

Thứ tự duy nhất cho Producer; lời/phụ đề chi tiết ở bảng cảnh `ep01/script.md`:

1. “Sếp đợi báo cáo, bảng đơn hàng vẫn chạy!”
2. “Chia bảng theo tháng, máy có thể bỏ qua phần không cần.”
3. “Lọc đúng cột đã chia thì mới bỏ qua được.”
4. “Chỉ lọc khách, chưa loại được tháng nào.”
5. “Partition không tự xoá, không tự nén dữ liệu cũ.”
6. “Tháng đầu ít dùng, mình cất đi.”
7. “Kế toán cần hóa đơn cũ, mình tìm ở bảng đang dùng.”
8. “Hóa đơn tháng đầu đi đâu?”
9. “Mình để thẻ chỉ dẫn cho phần đã chuyển.”
10. “Cất rồi, phải có đường tra lại.”
11. “Ở kho lưu! Hóa đơn vẫn còn.”
12. “Cất như vậy gọi là archive. Nó không phải lệnh SQL chuẩn, mỗi hệ mỗi cách.”
13. “Bảng bạn chia theo cột nào? Chưa chia thì gõ 'chưa'.”

Theo `docs/mascot.md`, bản lời xưng **mình**, gọi **bạn**; giữ cách xưng hô và câu hỏi bỏ “nhỉ” đã được review chấp nhận. Lời 5 gọi tên Partition, thêm “tự” để giới hạn đúng cơ chế; lời 7 cho kế toán một lý do; lời 12 gọi tên archive ngay sau hành động cất và tách thành hai ý. Câu điều kiện giữ nguyên phán quyết, chỉ nói về pruning trong ví dụ chia theo tháng, không phải điều kiện đủ để tăng tốc mọi truy vấn.

Lời 6 từ 13,0 s; lời 7 từ 14,8 s đến 17,6 s; câu hỏi từ 17,7 s đến 19,15 s. Khoảng hỏi → trả có lời 9 (19,3–21,45 s) và lời 10 (21,6–23,25 s), gắn với việc đặt thẻ và lần đường tra; không kéo dài hình để trì hoãn. Đáp ở 23,4 s; lời 12 từ 25,25 s; CTA 29,95–32,55 s; đuôi im dự kiến 0,35 s. Khung “MỘT BẢNG” vẫn hiện đúng 2,0–18,0 s. Tổng **12 cảnh / 13 lượt lời**.

Dự phòng duy nhất cho lời 2, Claude đã duyệt ở review vòng 2: **“Chia theo tháng, máy bỏ qua được phần không cần.”** Nếu TTS chuẩn đo được lời 2 bản đầy đủ kết thúc sau 4,9 s, dùng bản này (10 âm tiết), giữ hình chỉ T6 được chọn và điều kiện ở lời 3. Nếu vẫn không đạt, trả Kịch bản/Claude duyệt lại; không tăng tốc giọng. Chi tiết ước lượng, điều kiện kích hoạt và phát âm CHƯA KIỂM ở `ep01/script.md`.

## Phạm vi minh họa

T1–T6 là sáu tháng ví dụ, không phải sáu bảng độc lập. “HĐ 4721” là mã bịa cho tình huống dựng, không phải hóa đơn thật. Kho lưu và thẻ chỉ dẫn là ví dụ thiết kế lưu/tra, không phải tính năng tự có của mọi hệ. Không nêu storage engine MySQL trong thoại để tránh thêm khái niệm. Thumbnail lấy đúng tình huống hook, không lấy lưới sáu khối.
