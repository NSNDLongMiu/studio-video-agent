# Storyboard DRAFT · IT-T19-E01

57,05 s · 8 cảnh · 1080×1920 · Pillow–FFmpeg · talking-head 0%. S00 gộp hai nhịp mở S01–S02 của kịch bản. Lời 01–15 theo kịch bản đã duyệt. Tổng tăng 0,30 s do kéo dài khoảng giữ sau lời ở S03 và S04.

| Cảnh | Khoảng (s) | Nền | Loại cảnh | Đổi hình chính |
|---|---|---|---|---|
| S00 | 0.00–8.00 | Quán cà phê | `object_interaction` | Ngón tay tiến sát đồng xu rồi rút lại. Thẻ đăng nhập xuất hiện cạnh máy Mít vẫn còn tin vay. |
| S03 | 8.00–15.30 | Điện thoại và chat | `ui_simulation` | Đường nguồn bật khỏi thẻ trên và gắn vào thẻ dưới; hai cầu nối đối chiếu ảnh và tên. |
| S04 | 15.30–24.05 | Sơ đồ dữ liệu | `comparison_scene` | Tầm nhìn của khách đi qua vùng ảnh/tên trong khi khóa đứng nguyên, sau đó hai hồ sơ đã tồn tại hiện cùng ảnh/tên. |
| S05 | 24.05–29.85 | Sơ đồ dữ liệu | `data_visualization` | Vòng bạn bè mở; Cáo ra dấu dừng ở 1,85 s theo lời 08. Phong bì tới Mít rồi có hồi đáp. |
| S06 | 29.85–36.05 | Điện thoại và chat | `comparison_scene` | Sau tích vàng thứ nhất, vòng sáng ôm ảnh và tên thẻ dưới ở 2,76 s, Mít gật lần hai. Tích thứ hai rơi và hai thẻ cùng sáng. |
| S07 | 36.05–43.85 | Quán → danh bạ | `process_animation` | Ngón bỏ nút chuyển sang mục gọi; chat xám, cuộc gọi nối và đồng xu tắt. |
| S08 | 43.85–50.85 | Bảng hành động sáng | `process_animation` | Chuông đến cụm bạn, cờ gắn vào thẻ khác, nhóm mắt người lạ thu lại trên thẻ thật. |
| S09 | 50.85–57.05 | Quán cà phê | `object_interaction` | Mũi tên rời ô chat qua ô gọi, đồng xu tắt tại chỗ, vòng xu cách mép dưới header ít nhất 35 px. |

## Kiểm thiết kế

- R12 theo thời lượng. Quán cà phê 16,75 s (29,4%), điện thoại/chat 13,50 s (23,7%), sơ đồ dữ liệu 14,55 s (25,5%), danh bạ/bảng hành động 12,25 s (21,5%). Hai cảnh liền là chuỗi dài nhất dùng cùng nền. S07 chia 2,55 s quán và 5,25 s danh bạ.
- Cáo hiện 11,38 s (19,9%) theo bản đồ đã duyệt, trên ngưỡng thử R12 ≈15%. S00 5,70 s, S05 1,93 s, S09 3,75 s. Producer ghi tỷ lệ và lý do này vào `notes.md` khi dựng. S07 dùng ảnh đại diện trong thẻ gọi để diễn đạt phủ nhận. Cảnh mở 3,70 s đổi cỡ, mốc 3,90 s cắt dáng; hình mở và kết dùng cùng phía đặt điện thoại.
- Đổi hình dự kiến đọc được ở 360×640. Thumbnail thử ở 180×320 từ S00 khoảng 2,95 s. Chọn khung có Mít, Cáo, ngón và nút đỏ cùng lúc. Text engine vẽ tiêu đề một lần trong S00. Dải phụ đề riêng và giữ đuôi im 0,56 s. SFX nhẹ, nhạc tắt.
- Tám cảnh có chữ minh họa; 100% mục trong bản đồ ngữ nghĩa có hình. Đếm token theo khoảng trắng, 59 token nếu tính cả lời trên đạo cụ và tiêu đề (≈62/phút); 36 token nhãn/chữ gắn hình nếu loại phần thoại UI và tiêu đề (≈38/phút). Trần 8 từ áp cho lớp chữ minh họa từng nhịp, header là khối riêng. Tên Cáo trên thẻ là tên hiển thị đã duyệt. Kinetic ở S00, S04 và S07. S03 dùng cú lật nguyên thẻ làm điểm nhấn.
- S00 luân phiên hai bong bóng thay cho chồng chữ từ 2,30 s. S05 thay nhãn BẠN BÈ bằng tin nhắc chị Lan, rồi thay chữ tin bằng hồi đáp, giữ điều kiện vàng. Header giữ chủ đề được duyệt; trường title dùng lại tiêu đề đã duyệt theo yêu cầu schema nội dung và cần Claude xác nhận việc lặp dưới header vì cột chữ ở S03–S09 chỉ liệt kê dòng chủ đề.
- Giữ sau lời 05 của S03 là 1,03 s và sau lời 07 của S04 là 2,02 s. S04 có vệt tầm nhìn ở 7,75 s trong lúc giữ sơ đồ hoàn chỉnh. S00 giữ 0,15 s theo nhịp mở đã duyệt. Kiểm lại các mốc sau khi đo TTS. L07 chỉ đạo giọng nhấn “Nếu” từ lời đã duyệt. L13 giữ hai cụm nhấn trong schema, theo nhịp hạ giọng ở việc cuối. Phát âm, nhịp giọng và hình ở kích thước thu nhỏ cần kiểm trên bản dựng.
