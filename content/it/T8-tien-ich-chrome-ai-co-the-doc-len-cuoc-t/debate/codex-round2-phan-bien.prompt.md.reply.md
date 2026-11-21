## Vòng 2 — Phản biện “Tiện ích nào đang ngồi giữa chat?”

**Chọn “Đường đi của bản sao” làm khung dựng.** Giữ hai chi tiết mạnh nhất của Claude: cùng một dòng chat mẫu xuất hiện ở hai đầu, và sau khi gỡ tiện ích, bản đã gửi vẫn có thể nằm ở máy chủ bên ngoài.

| Tiêu chí | Claude | Codex | Bên mạnh hơn |
|---|---:|---:|---|
| Hook và giữ chân | 9 | 8 | **Claude.** Bảng khách hàng dựng mẫu cho người dùng chatbot thấy ngay dữ liệu nào có thể lộ. Bản sao tới máy chủ trước giây 5 làm hệ quả cụ thể. |
| Khớp chủ đề và brief | 7 | 9 | **Codex.** Cảnh giải thích 12–16s chứa đúng mốc trả lời ở giây 13. Claude hẹn giây 13 nhưng xếp hình giải thích từ giây 15. |
| Khả thi sản xuất | 7 | 9 | **Codex.** 10 cảnh đều 4 giây, dễ dựng bằng Pillow và ffmpeg. Hai luồng, bộ đếm và gói dữ liệu trong đoạn của Claude dễ tranh nhau sự chú ý. |
| An toàn | 8 | 7 | **Claude.** Cảnh sau khi gỡ cho thấy đúng giới hạn của thao tác. Lời giải thích vẫn cần phân biệt quyền đọc với hành vi sao chép. |
| Độc đáo | 9 | 8 | **Claude.** Đường gửi đã đứt mà bản sao vẫn ở đích là hình kết có sức nặng hơn. |

**Sửa điểm yếu chính của Claude.** Đưa hình giải đáp về 12–16s. Tại giây 13, cho bản sao tách trực tiếp từ khung chat qua biểu tượng tiện ích. Nếu giữ đường gửi tới chatbot, để đường đó chạy thẳng và làm mờ. Câu giải đáp: “Tiện ích có quyền đọc trang chat có thể thấy nội dung ở đó. Tiện ích có ý xấu có thể sao chép và gửi nội dung đi.” Chi tiết “khoảng 30 phút một lần” cần đối chiếu báo cáo gốc trước khi đưa vào.

**Bản lai chốt.** Giữ 10 cảnh × 4 giây và bốn bối cảnh của Codex. Mở bằng bảng khách hàng giả lập, rồi cho thấy cùng một dòng mẫu ở máy chủ từ giây 4. Giải đáp ở giây 13, sau đó minh họa kiểm tra nhà phát hành và quyền, rồi gỡ. Ở 28–32s, đường gửi mới ngắt, bản đã gửi vẫn hiện ở đích. Chốt: “Gỡ tiện ích để chặn lần gửi tiếp theo. Bản đã gửi có thể vẫn còn ở bên ngoài.” Cáo hỏi: “Bạn xem quyền hay nhà phát hành trước?”