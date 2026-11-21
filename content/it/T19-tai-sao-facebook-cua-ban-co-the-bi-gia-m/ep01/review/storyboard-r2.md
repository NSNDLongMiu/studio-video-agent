# Review storyboard IT-T19-E01 · vòng 2 (Claude, Đạo diễn hình ảnh)

Đối chiếu storyboard.json (8 cảnh, 57,05 s) với script.md đã DUYỆT và review r1.

## Điểm r1 đã sửa thật
| # | Nội dung | Kết quả |
|---|---|---|
| 1 | S04 giữ sau lời ≥ 2,0 s | Đạt: duration 8,75, hold_after_voice_s 2,02, hold_s và pause_after_s dòng 07 = 2,02, timeline giữ đến 8,75 |
| 2 | S03 giữ ≥ 1,0 s | Đạt: duration 7,3, hold 1,03, pause_after_s dòng 05 = 1,03 |
| 3 | S06 đổi hình 1,55–3,65 s, bỏ câu dán nhầm | Đạt: vòng vàng bao ảnh+tên ở 2,76, Mít gật lần hai; không còn câu Cáo/nút Mít của S05 |
| 4 | S09 header vs vòng xu | Đạt: environment khai mép trên vòng cách mép dưới header ≥ 35 px |
| 5 | S05 Cáo stop căn lời | Đạt: 1,85–3,78 s. Cáo tổng 5,7 + 1,93 + 3,75 = 11,38 s / 57,05 = 19,9% |

## Kiểm lời "Phở Bò"
script.md (quyết định giám đốc 21/11/2026) dùng "Phở Bò" ở lời 04: "Vậy tin vay tiền trên Phở Bò từ ai?". Storyboard S03 voice_over khớp đúng từng chữ; không còn "Facebook"/Messenger/Meta trong storyboard.json. Chữ lời các cảnh khác khớp script. Không phải lệch, không cần sửa.

## 5 tiêu chí
1. Show don't tell, visual-first: Đạt (giữ như r1, không thêm nhãn thừa, không logo, kinetic S00/S04/S07).
2. Đa dạng, nhịp: Đạt (hold R13 đủ, S06 có đổi hình đều; chủ đề nền office/incident/database/database/incident/security/security/office).
3. Khớp kịch bản: Đạt, 57,05 s trong 45–75 s; Cáo ≈ 20% là theo bản đồ Cáo đã duyệt (mở/kết, không che sơ đồ).
4. Dựng được: Đạt (pillow-ffmpeg có lý do; dáng Cáo có thật; crop ≤ 1,15×).
5. Schema + D8: Đạt (trường bắt buộc, opening ba pha, header, đếm chữ).

Ghi chú không chặn: S06 `text_groups` 2 trong khi chỉ một text khai báo (đếm cả nhãn của thẻ); Producer đo lại sau TTS.

KẾT LUẬN: DUYỆT
