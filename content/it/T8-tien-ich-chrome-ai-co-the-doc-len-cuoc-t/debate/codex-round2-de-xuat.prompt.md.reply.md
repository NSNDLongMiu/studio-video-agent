### Phản biện Vòng 2

- **C1.** Nhận câu “Ai vừa lấy bản sao?” dễ khiến người xem quy chụp mọi tiện ích AI, và giây 29 quá muộn để giải thích. Câu “Chat này còn là của mình không?” lại dễ lái sang chuyện sở hữu. Tôi dùng “Chat lọt ra bằng cách nào?” và trả ở giây 13. Điều kiện cần giải thích là tiện ích có quyền đọc dữ liệu trên trang chat. Quyền “mọi trang” là một cách cấp quyền rộng. Mốc khoảng 30 phút minh họa một đợt gửi theo ghi nhận của các nhà nghiên cứu.
- **C2.** “Chat cũng bị đọc?” có thể mở đúng nỗi lo, nhưng nếu hình chỉ cho thấy hộp quyền thì người xem dễ hiểu cấp quyền là đã bị lấy dữ liệu. Tôi cho thấy hành vi gửi trước giây 5, rồi giải thích quyền ở giây 13. Huy hiệu chỉ xuất hiện trên một trong hai thẻ tiện ích.
- **C3.** Nhận cả hai điểm về stakes và thời lượng xử lý. Mẩu hồ sơ khách hàng làm hệ quả cụ thể ngay khi bản sao ra ngoài. Kể xuôi bằng mẩu hồ sơ có góc màu xuyên suốt và bắt đầu xử lý ở giây 20.

### Bản cải tiến · Đường đi của bản sao

Cho người làm văn phòng dùng chatbot. Kiểm nhà phát hành và quyền trước khi cài. Giữ dữ liệu nhạy cảm ngoài chat.

| Giây | Bối cảnh và diễn biến |
|---|---|
| 0–4 | **Chat.** 0–2s, Cáo dán hồ sơ khách hàng mẫu. Câu mở “Chat lọt ra bằng cách nào?” Bản sao bật khỏi ô chat. |
| 4–8 | **Máy chủ.** Giây 4, máy chủ bên ngoài nhận bản sao có cùng góc màu. |
| 8–12 | **Cửa hàng.** Hai thẻ tiện ích giả danh trợ lý AI. Một thẻ hiện huy hiệu “Featured”. |
| 12–16 | **Chat.** Cáo cạnh hộp quyền. Giây 13 trả lời câu mở bằng hình quyền đọc phủ lên tab chat, rồi tiện ích sao chép nội dung. |
| 16–20 | **Máy chủ.** Một đợt gửi gồm nội dung chat và địa chỉ tab đang mở, khoảng 30 phút một lần theo các nhà nghiên cứu. |
| 20–24 | **Cửa hàng.** Rà nhà phát hành và danh sách quyền trước khi cài. |
| 24–28 | **Quản lý tiện ích.** Gỡ tiện ích không dùng. |
| 28–32 | **Máy chủ.** Đường gửi ngắt. Bản đã gửi vẫn có thể còn ở đích. |
| 32–36 | **Chat.** Giữ mật khẩu, khóa truy cập và dữ liệu khách hàng ngoài ô chat. |
| 36–40 | **Chat.** Cáo chốt “Kiểm quyền trước khi cài.” Mời bình luận “Bạn xem quyền hay nhà phát hành trước?” |

10 cảnh, trung bình 4 giây, nền dài nhất 16/40 giây. Sự cố đổi ba lần qua hình: bản sao tách khỏi chat, máy chủ nhận, đường gửi ngắt. Dựng nền bằng Pillow + ffmpeg, 9:16, 1080×1920. Cáo tĩnh ở cảnh 1, 4, 10, rộng khoảng 20% khung. Chỉ dùng giọng và hiệu ứng nhẹ. Ghi nhãn AI và chú thích ví dụ dựng ở phần đăng.