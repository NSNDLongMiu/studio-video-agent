# Chuẩn đầu ra & lưu ý nền tảng

> Số liệu nền tảng thay đổi thường xuyên. Đây là **chuẩn làm việc an toàn** của xưởng; trước khi đăng hàng loạt, giám đốc nên kiểm lại chính sách hiện hành của từng nền tảng.

## Chuẩn kỹ thuật chung (1 file dùng cho cả 3 nền tảng)
- **Tỉ lệ 9:16, 1080×1920**, MP4, H.264 (yuv420p) + AAC, 24–60 fps (khuyến nghị 30), `faststart`.
- **Thời lượng mặc định 15–45 giây** (không vượt 60s trừ khi brief/giám đốc nói khác). Hook trong 2 giây đầu.
- Âm lượng ~ −14 LUFS, đỉnh ≤ −1,5 dBTP. Luôn có luồng audio.
- Dung lượng ≤ 250 MB (xưởng tự giới hạn; QC sẽ báo).
- Có `captions.srt` (đa số người xem tắt tiếng) và bản phụ đề đốt cứng nếu plan yêu cầu.

## Vùng an toàn (tránh bị giao diện nền tảng che)
Giao diện (tên tài khoản, mô tả, nút thích/bình luận) chiếm **khoảng 20–25% phía dưới** và một dải bên phải. Quy tắc xưởng:
- Chữ/phụ đề quan trọng nằm trong y ∈ [~250, ~1500] px, cách lề trái/phải ≥ 90 px.
- Phụ đề đặt cách đáy ≥ 420 px (công thức `MarginV=63` trong `ffmpeg-recipes.md`).

## Khác biệt đáng nhớ khi đăng (giám đốc tự đăng ở giai đoạn này)
| | TikTok | Facebook Reels | YouTube Shorts |
|---|---|---|---|
| Tiêu đề | không có (dùng caption) | không có (dùng mô tả) | **có**, ≤ 100 ký tự |
| Hashtag | 3–5, đặt cuối caption | 3–5 | `#Shorts` trong mô tả + vài tag |
| Ảnh bìa | chọn khi đăng | chọn khi đăng | chọn khi đăng |
| Gắn nhãn AI | **Luôn gắn** (giám đốc đã chốt): bật tuỳ chọn khai báo nội dung AI/tổng hợp của nền tảng + câu `ai_disclosure` ở cuối mô tả | như trái | như trái |

## Nội dung nên tránh (rủi ro bị gỡ/giới hạn)
Nhạc/hình/clip có bản quyền chưa được cấp phép; tuyên bố y tế/tài chính gây hiểu lầm; thông tin chưa kiểm chứng trình bày như sự thật; nội dung bạo lực/nhạy cảm; spam hashtag.
