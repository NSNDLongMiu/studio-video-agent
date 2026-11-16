# Nguồn nguyên liệu được phép dùng (cập nhật khi cấu hình thêm)

Đây là **bản vẽ năng lực thật** của xưởng. Ideator/Planner chỉ được đề xuất những gì làm được với danh sách này; Producer chỉ được dùng những nguồn này.

## Đang có
| Loại | Có gì |
|---|---|
| Dựng hình | `ffmpeg`/`ffprobe` (libx264, drawtext, libass, xfade, zoompan, loudnorm) |
| Đồ hoạ | Nền màu/gradient, thẻ chữ, hoạt ảnh chữ (kinetic text) tạo bằng ffmpeg; phông Windows (Segoe UI, Arial, Tahoma, Bahnschrift) |
| **Linh vật dẫn truyện: Cáo văn phòng** | 46 dáng cả người (nền trong suốt) + công cụ dựng lớp dẫn truyện (đổi dáng, nhún theo tiếng/phụ đề) — xem `docs/mascot.md`. Không nhép miệng; sticker cao ~330px nên hơi mềm khi phóng. Dùng được ngay, không cần TTS |
| Nguyên liệu của giám đốc | Thư mục `library/images`, `library/footage`, `library/music` — **chỉ dùng file giám đốc đã đặt vào đây** |
| Script/tự động hoá | Node 24, Python 3.12 |

## CHƯA cấu hình (cần giám đốc quyết)
- **Giọng đọc (TTS):** chưa có. Nếu không có giọng, video dùng nhạc + phụ đề chữ.
- **Kho ảnh/clip stock:** chưa có API. Không tải ngẫu nhiên từ Internet.
- **Nhạc nền:** chưa có thư viện; đặt file nhạc **có giấy phép rõ ràng** vào `library/music/` (ghi nguồn/giấy phép vào `library/music/LICENSES.md`).
- **Ảnh/clip do AI tạo:** chưa có dịch vụ.
- **Đăng bài tự động:** chưa có; giám đốc tự đăng.

## Hệ quả cho ý tưởng lúc này
Phong cách khả thi: **Cáo văn phòng (linh vật cáo công sở) dẫn truyện** trên nền đồ hoạ/chữ động/infographic dọc, danh sách mẹo, so sánh, đếm ngược, hỏi–đáp, nhạc + phụ đề; hoặc dùng ảnh/clip do giám đốc cung cấp. Chưa làm được: người thật, cảnh quay thực tế, lồng tiếng tự nhiên (đến khi có TTS), nhân vật nhép miệng.
