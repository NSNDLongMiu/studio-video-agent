## 1. Lỗi kỹ thuật và rủi ro chính xác

- **S04 · L06.** “Không có” bỏ âm, còn rung phụ thuộc cài đặt và chế độ. Apple 118444 nêu StandBy tắt rung báo thức. Thêm điều kiện bật rung, giữ ví dụ của Cáo ở trạng thái đó. [Apple Support](https://support.apple.com/en-vn/118444)
- **S09 · L13 và nguồn 5.** Hình công tắc tắt dễ khiến người xem nghĩ app tải về đều cần cấp quyền thủ công. Giới hạn cảnh vào app dùng quyền hẹn chính xác có thể cấp thủ công. App báo thức/lịch đủ điều kiện khai `USE_EXACT_ALARM` được cấp quyền đó khi cài. [Android Developers](https://developer.android.com/about/versions/14/changes/schedule-exact-alarms)
- **S03 · L04 và mô tả TikTok.** L04 xác định đúng nguyên nhân trong ví dụ của Cáo. Mô tả gọi đó là thủ phạm “thường” gặp [CẦN KIỂM NGUỒN]. Bỏ chữ “thường”; Apple hướng dẫn kiểm Âm báo khi máy chỉ rung. [Apple Support](https://support.apple.com/en-vn/118444)
- **S07 · L09–L10.** Apple xác nhận iOS 27 cho tách mức âm lượng **Báo thức và Hẹn giờ** khi tắt tùy chọn dùng chung mức nhạc chuông. Gắn cả biểu tượng báo thức và hẹn giờ vào thanh mới. Tên mục tiếng Việt trên máy [CẦN KIỂM NGUỒN]. [Hướng dẫn iPhone](https://support.apple.com/guide/iphone/change-sounds-and-vibrations-iph07c867f28/27/ios/27)

## 2. Bản viết lại lời đọc cho các đoạn [kỹ thuật]

- **L06 · 10,28 s · 10 âm tiết.** **Chọn Không có, báo thức chỉ rung nếu bật rung.**  
  Lý do — Nói rõ điều kiện tạo ra hiện tượng trong cảnh.
- **L12 · 34,24 s · 13 âm tiết.** **Không làm phiền có thể làm im chuông nếu bạn chặn báo thức.**  
  Lý do — Chỉ vào tùy chọn cho phép báo thức trong chế độ. [Google Clock Help](https://support.google.com/clock/answer/2840926)
- **L13 · 38,65 s · 12 âm tiết.** **Nếu app cần quyền, bạn xem Báo thức và lời nhắc.**  
  Lý do — Giới hạn bước kiểm vào app có yêu cầu quyền.

`voice_direction` đề xuất cho storyboard theo `line_id` và nhịp kịch bản. Tốc độ là hệ số atempo, nghỉ trước/sau tính bằng giây.

| line_id | Ý định · cảm xúc | Cụm nhấn | Tốc độ | Nghỉ trước/sau | Ngữ điệu | Chuyển ý |
|---|---|---|---|---|---|---|
| L06 | Giải thích · bình tĩnh | nếu bật rung | 1,08 | 0,50 / 1,40 | hạ cuối | từ cài đặt L05 sang kết quả |
| L12 | Lưu ý · nhẹ | chặn báo thức | 1,07 | 0,50 / 1,24 | hạ cuối | từ thanh âm lượng sang chế độ |
| L13 | Chỉ chỗ kiểm · thân thiện | nếu app cần quyền | 1,10 | 0,15 / 2,06 | lên nhẹ ở điều kiện, hạ cuối | từ chế độ sang quyền, rồi thử chuông |

## 3. Bằng chứng hình (R11) còn thiếu

- **S04 → S10–S11.** Hai nhánh sơ đồ nêu kết quả, còn lượt thử cuối đổi cả âm báo lẫn âm lượng. Cho cùng một báo thức chạm giờ hai lượt, giữ nguyên thanh âm lượng và bật rung ở cả hai. Chỉ đổi Âm báo từ “Không có” sang một tiếng chuông. Lượt đầu hiện vạch rung, lượt sau thêm sóng loa.
- **S08 · L12.** Biểu tượng trăng mới cho thấy chế độ bật. Giữ trăng sáng, bật lại quyền cho phép báo thức trong chế độ và cho sóng loa xuất hiện. Khớp hình với mốc L12 ở 34,24 s.

