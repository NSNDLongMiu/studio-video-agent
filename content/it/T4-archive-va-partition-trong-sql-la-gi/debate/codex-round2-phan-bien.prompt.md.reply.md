**Chấm bản Claude:** hook & giữ chân **7/10** · khớp brief **9/10** · khả thi **6/10** · an toàn/chính xác **6/10** · độc đáo **7/10**.

Bản này có ích lợi trước giây 5, câu hỏi mở trả đúng nhịp, nhưng còn ba điểm cần sửa:

- **Hook khẳng định quá mức, hình chưa khớp:** “máy lục cả năm năm” khiến người xem hiểu chưa partition thì phải quét toàn bộ; nhãn “ví dụ dựng” không sửa được suy luận ấy. Hình T1–T6 cũng chưa giải thích năm năm. Đổi thành **“Sếp đợi báo cáo, dữ liệu cũ vẫn đầy!”**, dùng sáu tháng minh hoạ xuyên suốt. Bìa “Lục cả năm?” hiện còn lệch với lời “năm năm”.

- **Điều kiện pruning và cảnh archive dễ dạy sai:** “lọc theo cột đã chia mới bỏ qua được” quá tuyệt đối; cần nói **“Điều kiện lọc phù hợp khóa chia → có thể bỏ qua phần không cần.”** DETACH chỉ tách partition khỏi bảng, không tự chuyển sang kho hay giải phóng dung lượng. Đặt ngay sau cảnh ổ đầy dễ tạo lời giải sai. Sửa bằng chuyển dữ liệu cũ sang kho **như một ví dụ cách archive**, bỏ DETACH/DROP khỏi tập nhập môn này. DROP cũng làm lệch trọng tâm sang xoá dữ liệu.

- **34 giây chứa quá nhiều việc:** riêng 17–28 giây phải giải thích DETACH, kho lưu, tìm lại, archive tuỳ hệ và DROP. Phương án rút phần điều kiện xuống ba giây sẽ hy sinh đoạn quan trọng nhất. Bỏ DROP, dùng thời gian đó cho thao tác **lấy lại một hoá đơn cụ thể**. Giới hạn ba nhóm chữ phải tính cả phụ đề, nhãn AI và nhãn dựng; hiện chưa có bố trí chứng minh chứa nổi. Cần chia nhịp rõ, giữ mỗi thay đổi đủ khoảng 1,5 giây; thay đổi vị trí/hình dạng, không chỉ đổi màu.

**Claude tốt hơn bản tôi:** thao tác đổi chip “tháng” sang “khách” cho người tắt tiếng thấy điều kiện pruning; cảnh khối cũ còn nguyên giải thích partition không nén/xoá tốt hơn.

**Bản tôi tốt hơn:** yêu cầu hoá đơn tạo hệ quả công sở cụ thể; lấy lại đúng mã chứng minh lợi ích archive rõ hơn biểu tượng kính lúp.

**Chốt: chọn bản lai, nền là bản Codex.**  
Lấy lưới một bảng và cảnh khối cũ còn nguyên của Claude.  
Giữ yêu cầu hoá đơn cùng hành động tìm lại của Codex; bỏ DETACH/DROP.  
Chốt hiển thị “Partition: chia phần” / “Archive: lưu trữ”; mời gõ “tra” để xem tiếp.