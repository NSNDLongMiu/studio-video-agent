# Review storyboard IT-T14-E01 — vòng 1 (D8)

Số liệu Claude tự tính lại từ `storyboard.json`.

| Mục | Kết quả |
|---|---|
| Số cảnh / thời lượng | 28 cảnh (S00–S27), tổng 180,65 s (150–190 s đạt; QC sẽ cảnh báo vượt 180 s 0,65 s, chấp nhận). TB 6,45 s/cảnh. Cảnh High 10,15–10,25 s có diễn tiến bên trong. |
| D8a Opening | Đạt. S00 1 s, không lời, riêng, title + animation, hook ở S01. |
| D8b Header | Đạt. Không có `hidden_scenes`; 27/27 cảnh sau opening có `header_slot`, kèm khe tránh vật/Cáo/phụ đề. |
| D8c Chữ minh hoạ | Đạt. 26/28 cảnh có `texts` (92,9%; S00 và S03 không, hợp lý). 135 từ / 3,01 phút ≈ 44,8 từ/phút (sát trần 45, không thêm nữa). Kinetic 11 lần, ≤ 1/cảnh, không hai cảnh liền, cách nhau 10,6–23,5 s. Nhãn gắn bbox, có mốc hiện/ẩn. |
| D8d R12 | Đạt. 4 chủ đề: office ~29%, security 29,4%, code ~25%, incident ~18,5%; dài nhất 4 cảnh liền (S01–S04, S24–S27); có cảnh `code`. Không 3 cảnh liền cùng cỡ cảnh; scene_type liền nhau ≤ 2. |
| Cáo | 24,35 s = 13,5% (≲ 15%), talking-head 0%; dáng có thật; không che sơ đồ. |
| Show don't tell, R17–R18 | Đạt. Mọi cảnh có minh hoạ thật, `semantic_plan` đủ, nhãn là chữ nhấn. |
| Dựng được | Đạt. `renderer: pillow-ffmpeg` + lý do; camera ≤ 1,15× nêu mục đích và cách dựng (S01, S03, S05, S17). |
| Schema | Đạt. Trường bắt buộc đủ. |

## Quyết các đề nghị Codex
1. **Nhãn bổ sung**: DUYỆT. Mỗi nhãn là cụm có trong lời, trong cột/bản đồ ngữ nghĩa của script (Khách hàng, Bình luận, Dữ liệu mẫu có trong lời; Mọi trang/Trang đã chọn theo cột chữ S16–S17). Không chép nguyên câu thoại. Codex cập nhật cột chữ của `script.md` là việc của kịch bản, không chặn dựng; Producer lấy nhãn từ `semantic_plan.texts`.
2. **Vị trí phụ đề**: giữ phía dưới (y≈1340–1500), Cáo ở trên dải này.
3. **Câu hỏi mở 8,95 s** và **tổng 180,65 s**: chấp nhận (opening 1 s là bắt buộc của D8; không tăng tốc giọng để bù). Sau đo TTS, nếu có thể, Producer rút đuôi im để tổng ≤ 180 s.

## Góp ý nhỏ (không chặn)
- Ô header: S02–S04 liên tiếp cùng `top_right`, S15–S17 cùng `top_left`. Producer có thể đổi ô khi đo bbox thật.
- Mật độ chữ 44,8 từ/phút sát trần; không thêm nhãn mới.

KẾT LUẬN: DUYỆT
