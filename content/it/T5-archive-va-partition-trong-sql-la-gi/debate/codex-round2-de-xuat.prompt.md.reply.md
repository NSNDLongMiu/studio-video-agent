## Phản hồi Claude

- **Góp ý chung.** Nhận cả ba điểm. Trước giây 5 phải thấy đơn mới chưa lưu được. Bỏ lời mời chọn thao tác vì chính đơn đang chờ lưu đã tạo lý do xem tiếp. Đưa đáp án lên giây 27 để còn thời gian cho hai cảnh xác nhận và khoảng nghỉ.
- **Báo cáo còn quay.** Nhận phần trùng ý, thiếu hệ quả sớm và thiếu cảnh báo cáo hiện kết quả. Nếu dựng concept này, tôi sẽ cho thấy người phụ trách đang chờ số liệu để chốt tháng, rồi chuyển vòng tải thành bảng kết quả, không ghi thời gian chạy. Khi chia khay, giữ nguyên tổng lượng dữ liệu để tránh gợi ý rằng partition làm bảng nhỏ đi.
- **Đơn cũ đâu rồi?** Nhận cả ba điểm. Thay ô trống bằng dấu chỉ sang nơi lưu trữ khác để tránh hiểu nhầm đơn đã mất. Minh hoạ partition bằng các nhóm tháng vẫn nằm trong cùng một bảng. Cảnh tra đơn cũ phù hợp làm đoạn kết hơn là làm hook.
- **Chia xong, vẫn đầy?** Nhận góp ý về người chịu hậu quả, mốc trả lời và vạch dung lượng. Tôi đổi cảnh báo thành **“Kho chính đầy”** để khớp với cảnh đơn mới không lưu được. Vạch dung lượng chỉ xuất hiện trên kho chính.

## Bản cải tiến duy nhất — Chia rồi, sao vẫn đầy?

**Đối tượng** là người mới học SQL. **Thông điệp** là partition chia các dòng theo tháng trong cùng một bảng, còn archive là cách quản lý dữ liệu cũ để vẫn tra lại được.

| Nhịp | Hình và ý chính |
|---|---|
| **0–3s** | Cáo cạnh màn hình tạo đơn, vạch kho chính đỏ dù bảng vừa chia theo tháng. Hook trong 2 giây đầu: **“Chia rồi, vẫn đầy?”** |
| **3–15s** | Đến giây 4, đơn mới báo chưa lưu. Cắt sang cùng lượng dữ liệu được chia vào các ngăn tháng. Cáo xuất hiện lại khi giải thích vì sao vạch vẫn đỏ. |
| **15–39s** | **Giây 27 trả lời câu hỏi mở.** Partition chỉ chia nhóm, không nén hay xoá. Trong ví dụ này, chuyển đơn cũ đủ điều kiện sang nơi lưu khác, kiểm tra tra lại được rồi mới bỏ bản ở kho chính. Archive là cách quản lý dữ liệu cũ, không có một lệnh SQL chuẩn chung. Cảnh cuối có Cáo, đơn mới lưu thành công và đúng một đơn cũ hiện lên khi tra. |

Dựng **9:16, 1080×1920**, khoảng **39 giây**. Dùng dáng Cáo tĩnh có sẵn, đổi dáng bằng cắt, không nhép miệng, rộng 15–25% khung khi cùng minh hoạ. Giữ chữ tối thiểu, hiện nhãn **“Ví dụ dựng”** và **“AI”**. Giọng chậm, có khoảng nghỉ, chỉ thêm hiệu ứng nhẹ, không nhạc nền hay AI trả phí. Rủi ro là người xem tưởng sao chép đã giải phóng chỗ. Chỉ hạ vạch kho chính sau khi bản ở đó được bỏ. Chốt nhẹ bằng lời mời kể lần phải tra lại một đơn cũ.