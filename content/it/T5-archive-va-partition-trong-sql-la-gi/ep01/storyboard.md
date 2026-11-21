# Storyboard IT-T5-E01 — Chia rồi, vẫn đầy?

**DRAFT · 18 nhịp trong 7 đoạn · 41,96 s · 1080×1920, 30 fps · Talking-head 0%.** Mỗi dòng khớp một lời đọc trong `script.md`. Thời gian trong bảng tính từ đầu tập.

| Cảnh | Giây | `scene_type` | Đổi hình chính | Cáo | Nhóm chữ |
|---|---:|---|---|---|---:|
| S01-L01 | 0,00–1,91 | `ui_simulation` | Thẻ mới bật khỏi khe trước giây 2. Lấy bìa ở 1,55 s. | `surprised` | 2 |
| S01-L02 | 1,91–3,46 | `ui_simulation` | Đơn nằm trong ô chờ, ray đứt ngay tại khe lỗi. | `surprised` | 2 |
| S01-L03 | 3,46–5,17 | `cinematic_close_up` | Lần theo ray từ khe bị chặn lên đúng vạch của kho nhận đơn. | `surprised` đến 4,37 s | 2 |
| S02-L04 | 5,17–7,90 | `process_animation` | Mở hàng đơn và gài các ô lịch thành một cột trong bảng. | — | 0 |
| S02-L05 | 7,90–10,64 | `object_interaction` | Ô ngày tạo dẫn sang ba tab lịch, thẻ vẫn ở dải nguồn. | — | 1 |
| S02-L06 | 10,64–13,04 | `process_animation` | Ba lượt thẻ đi vào đúng khay theo dấu lịch, giữ nguyên chín thẻ. | — | 3 |
| S02-L07 | 13,04–16,17 | `object_interaction` | Khoanh một phân vùng, rồi gài cả ba vào thanh bảng chung. | — | 1 |
| S02-L08 | 16,17–17,77 | `comparison_scene` | Đối chiếu chín dòng với chín viền rỗng theo dấu nhận dạng. | — | 0 |
| S03-L09 | 17,77–20,77 | `comparison_scene` | So cạnh thẻ trước và sau, thu dải viền, theo ray về vạch đỏ. | `point_up` | 0 |
| S03-L10 | 20,77–22,48 | `cinematic_close_up` | Trở lại đúng vạch đỏ lúc mở, mở đường nhìn sang thẻ lọc. | `point_up` | 1 |
| S04-L11 | 22,48–26,49 | `process_animation` | Bộ lọc rẽ đúng khay tròn, hai khay ngoài kỳ còn nguyên. | — | 1 |
| S05-L12 | 26,49–29,76 | `process_animation` | Tách hai vỏ kho, bắc ray chép sang nơi lưu riêng. | — | 3 |
| S05-L13 | 29,76–31,37 | `process_animation` | Bản sao sang kho lưu, khay gốc và vạch đỏ giữ nguyên. | — | 2 |
| S05-L14 | 31,37–32,74 | `object_interaction` | Tra ra đúng thẻ cũ, đối chiếu đủ ba cặp rồi mới đánh ✓. | — | 2 |
| S06-L15 | 32,74–35,57 | `cinematic_close_up` | Khoá kẹp khớp bảng trước khi nhả khay. | — | 1 |
| S06-L16 | 35,57–37,82 | `process_animation` | Tách khay, bỏ bản nguồn, rồi mới hạ vạch. Kho lưu giữ đủ bản sao. | — | 3 |
| S07-L17 | 37,82–39,66 | `ui_simulation` | Đơn mới ghi được. Cửa kho lưu bắt đầu trả thẻ cũ. | `thumbs_up` | 2 |
| S07-L18 | 39,66–41,96 | `object_interaction` | Tra lại đúng thẻ đã kiểm; thẻ cài vào ô trong đuôi im 0,70 s. | `thumbs_up` | 0 |

## Mốc nối cho Producer

- Vạch đỏ gắn kho chính từ hook. Lỗi ghi xuất hiện ở 1,38 s, ray chỉ vào chân vạch từ 3,75 s, rồi về lại đúng vạch ở 20,77 s. Câu trả lời kết thúc ở 21,68 s. Bìa lấy quanh 1,55 s, kiểm thẻ bật và dấu × ở 180×320.
- Ba khay là một bảng. Từ 22,48 s, truy vấn chọn khay tròn và vẫn để thấy hai khay ngoài kỳ. Ở đoạn lưu, thấy nguồn và bản sao cùng tồn tại trước khi đối chiếu đủ ba cặp. Khay đã tách còn trong kho chính tại 36,60 s. Bản nguồn rời kho khoảng 37,30 s, vạch hạ từ 37,50 s, rồi đơn sọc mới đi lại đúng ray cũ và được ghi.
- Dùng Pillow+FFmpeg khi bản được Claude duyệt. `UiSimulationScene` gõ chữ và hiện banner, `ExplainerScene` hiện chuỗi ô nối trên nền cố định, `CharacterScene` và `QASequenceScene` thiếu đạo cụ động của cảnh cận, và `object_interaction` chưa có composition. Các lớp phẳng tự dựng giữ được ray, khe ghi, thẻ, vỏ kho và nền theo cảnh.
- Cáo xuất hiện 13,22 s qua ba đoạn, theo dáng trong kịch bản. `text_groups` là cực đại ngoài phụ đề. Các mốc hình đang dự kiến theo ngân sách kịch bản. Đo TTS trước khi khoá hình, sau đó so khung thật ở 360×640 và kiểm đuôi im 0,70 s.
