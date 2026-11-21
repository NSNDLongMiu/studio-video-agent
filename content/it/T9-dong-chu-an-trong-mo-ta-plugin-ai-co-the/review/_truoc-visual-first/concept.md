# Concept · IT-T9-E01 · Một phép cộng, một file ra ngoài

Theo **Phán quyết cuối** trong `debate.md`. Một nhân viên nhờ trợ lý AI cộng hai số. Màn hình trả đúng tổng trong khi nhật ký mô phỏng ghi một file nội bộ đã ra ngoài. Cùng một sự cố cho thấy hai điều: giao diện có thể chỉ hiện một phần mô tả, và mô tả lúc được duyệt có thể khác mô tả được nạp về sau. Bộ đếm của riêng plugin cộng vẫn bằng không khi mô tả đã đến AI. Khi phát lại với quyền tối thiểu, file dừng ở vạch dù dòng ẩn vẫn nằm nguyên trong mô tả.

**Lý do chọn.** Phép cộng quen thuộc cho người xem một điểm đối chiếu rất rõ: số năm xác nhận phép tính, còn nhật ký cho biết chuyện gì xảy ra với file. Hai lần xem cùng một công cụ làm lộ sự khác nhau giữa bản nhìn thấy, bản AI đọc và bản đã được duyệt.

**Khán giả.** Dân văn phòng và lập trình viên mới dùng plugin AI. Cáo xưng “mình”, gọi “bạn”, nói từng ý ngắn và chỉ vào đúng thứ người xem cần theo dõi. **Lời hứa của series.** Mỗi tập lần theo một tình huống công sở đến cơ chế kỹ thuật, rồi chỉ ra việc người xem có thể tự kiểm.

| Nhịp | Nội dung đã chốt |
|---|---|
| Opening · 0,00–1,50 s | “Dòng ẩn trong mô tả plugin AI” trên bàn máy tính động. |
| Hook · từ 1,50 s | “Tổng đúng. File đã gửi.” Yêu cầu `2 + 3`, kết quả `5` và nhật ký cùng hiện trong 2 s đầu. File vào ô ngoài khoảng 3,20 s; lời dẫn xác nhận đây là ví dụ dựng. |
| Ích lợi đầu tiên · trước 5 s | “Xem nhật ký.” Nhật ký nằm cạnh kết quả và cho người xem việc có thể kiểm ngay. Khoảng 12 s, hứa ba bước kiểm dễ nhớ trước khi cài. |
| Câu hỏi mở · khoảng 8 s | “Máy chỉ được nhờ cộng. Vậy ai ra lệnh gửi file?” |
| Trả phần đầu · khoảng 60 s | Rọi vào khối che ngay dưới mép hiển thị, trong phần mô tả đầy đủ mà AI có thể đọc. |
| Trả đủ · khoảng 170–171 s | Trở lại màn hình hook, khoanh đúng hàng đã chỉ ở giây 60. Phát lại có quyền và thiếu quyền cho thấy khay ngoài nhận file hoặc file dừng ở vạch. Chốt “Quyền chỉ giảm thiệt hại, không sửa mô tả.” |
| Kêu gọi · cuối tập | “Bạn kiểm mô tả hay quyền trước?” rồi mời kể và nhắc “Lưu lại kẻo quên nha!” |

Thông điệp là **kết quả đúng chưa chứng minh plugin sạch; hãy duyệt mô tả mà AI đọc**. AI có thể làm theo chỉ dẫn lẫn trong mô tả, nhất là khi có quyền phù hợp. Thứ tự kiểm là duyệt và quét mô tả đầy đủ → ghim phiên bản và so mô tả mỗi phiên → cấp quyền tối thiểu.

## Bộ câu thoại Cáo

| Nhịp | Dáng có sẵn | Thoại |
|---|---|---|
| Hook | `think` | “Tổng đúng. File đã gửi.” / “Máy chỉ được nhờ cộng. Vậy ai ra lệnh gửi file?” |
| Chuyển sang cơ chế | `surprised` | “Khoan! Phần bạn thấy chưa phải phần AI đọc.” |
| Nhận ra sai lầm | `bow` | “Ối, ai cũng từng gặp. Cáo xin lỗi trước nhé!” |
| Chuyển sang giải pháp | `idea` | “Mẹo nhỏ cho dân văn phòng nè!” |
| Kết | `thumbs_up` | “Quyền chỉ giảm thiệt hại, không sửa mô tả.” / “Bạn kiểm mô tả hay quyền trước?” / “Lưu lại kẻo quên nha!” |
