## Vòng 1 — Phản biện

| Concept | Hook & giữ chân | Khớp brief | Khả thi | An toàn | Độc đáo |
|---|---:|---:|---:|---:|---:|
| A — Hai bản mô tả | 9 | 9 | 9 | 8 | 8 |
| B — Nhân viên mới đọc nội quy | 7 | 6 | 8 | 7 | 8 |
| C — Ba lớp kiểm tra bị bỏ sót | 6 | 8 | 9 | 9 | 7 |

**A — Hai bản mô tả.** Phép cộng ra đúng trong khi dữ liệu có thể bị gửi đi là hệ quả gần nhất với người xem. Nhãn “đã xác minh” dễ khiến họ hiểu nhầm về phạm vi kiểm duyệt. Dùng UiSimulationScene cho thấy hai góc nhìn của **cùng một mô tả**. Trước giây 5, hiện kết quả `5` cạnh trạng thái mô phỏng “có lượt gửi ra ngoài”. Khoảng giây 20, giải thích AI đã đọc mô tả khi nạp danh sách công cụ, kể cả khi chưa gọi plugin đó. Dựng ba lần đổi trạng thái gồm mô tả được nạp, tệp được truy cập và lượt gửi được ghi nhận. Ở giây 165, chiếu lại cảnh trước/sau khi thu hẹp quyền và trả lời “Khoá đi đâu?” bằng nhật ký mô phỏng.

**B — Nhân viên mới đọc nội quy.** Đến giây 50 mới sang plugin thì ẩn dụ chiếm quá nhiều thời lượng. Câu “AI không phân biệt mô tả với mệnh lệnh” cũng quá tuyệt đối. Giữ tờ hướng dẫn trong vài giây, cho thấy hồ sơ lương đã bị sao chép trước giây 5, rồi cắt từ CharacterScene sang UiSimulationScene trước giây 10. Giải thích AI *có thể* làm theo chỉ dẫn trong mô tả nếu có quyền phù hợp. Đến giây 165, trả lời “Ai thấy dòng đó?” bằng đối chiếu phần giao diện hiển thị với mô tả AI nhận.

**C — Ba lớp kiểm tra bị bỏ sót.** Ba ô “OK” tạo câu đố nhưng chưa cho thấy người xem có thể mất gì. Đưa dấu hiệu truy cập tệp vào trước giây 5 và bật mí plugin thứ hai ở giây 12. Dùng PromptReviewScene dựng từng bước đối chiếu mô tả, giữ hình hoàn chỉnh 2–3 giây. Đến giây 165, trả lời “Vì sao ô OK vẫn lọt?” bằng cảnh so mô tả đã duyệt với mô tả đang nạp.

**Chọn A, mượn cách đối chiếu từng bước của C.** Giữ một sự cố trong khoảng 180 giây. Dành phần cuối cho ba thao tác người mới có thể nhớ được — duyệt và quét mô tả đầy đủ, cấp quyền tối thiểu, đối chiếu lại mô tả khi nạp. Câu mời cuối có thể là “Bạn sẽ kiểm tra mục nào trước, mô tả hay quyền?”