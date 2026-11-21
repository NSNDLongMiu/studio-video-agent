# Review storyboard IT-T9-E01 · vòng 2

Số liệu tự tính từ storyboard.json (không dùng số tự báo của Codex).

| Mục | Kết quả |
|---|---|
| 1. Show don't tell, semantic_plan | Đạt. 28/28 cảnh có minh hoạ thật, `semantic_plan` đủ; không nhãn «AI tạo»/«Ví dụ dựng» trên hình (cụm "ví dụ dựng" chỉ nằm trong lời và metadata theo script đã duyệt). |
| 2. Đa dạng, Information Pacing | Đạt. Hold sau lời: Medium ≥ 1,0 s, High 2,4–2,6 s. Cảnh High S11/S16 16 s có diễn tiến bên trong. |
| 3. Khớp kịch bản | Đạt. 179,68 s = script; S00 2,40 s chưa có lời; Cáo 7 cảnh, 23,46 s = 13,1%, không talking-head. |
| 4. Dựng được | Đạt. `renderer: pillow-ffmpeg` kèm `renderer_reason` đối chiếu từng nhóm cảnh; crop/zoom ≤ 1,18× từ nguồn 1,25× đúng giới hạn R12. |
| 5. Schema, trường bắt buộc | Đạt (main_change, text_groups, complexity, concepts, hold_after_voice_s, opening, header đủ). |
| D8a opening | Đạt. S00 2,40 s, `voice:false`, tiêu đề 86 px 2 dòng, hook ở S01. |
| D8b header | Đạt. Không `hidden_scenes`; 27/27 cảnh có `header_slot` (top_left/top_right/above_captions) đổi theo bố cục; S11, S16 dùng above_captions vì không có Cáo. |
| D8c chữ minh hoạ | Đạt. 28/28 cảnh có texts (≥ 80%); ≈ 131 từ / 2,99 phút ≈ 43,8 từ/phút (trong 20–45, sát trần, producer không thêm chữ); mọi thuật ngữ (plugin, mô tả công cụ, dòng ẩn, tool poisoning, rug pull, ghim phiên bản, quyền tối thiểu, bản lưu / bản đang nạp) đều có nhãn gắn đối tượng. Kinetic 10 lần: 2,64 / 24,09 / 37,81 / 55,24 / 79,22 / 103,94 / 124,60 / 144,56 / 154,71 / 169,94 s: khoảng 18 s/lần (≥ 1/25 s), không hai cảnh liền, cách nhau ≥ 10 s, ≤ 1/cảnh. |
| D8d R12 | Đạt. office 4 cảnh liền (S00–S03), security 4 liền (S15–S18), incident 3, code 3; mỗi chủ đề 22–27% (≤ 40%). |

## Chốt vấn đề Codex nêu: dải phụ đề và Cáo
Giữ nguyên: Cáo đáy y=1290, phụ đề dải y≈1340–1500, nằm dưới Cáo. Không đưa phụ đề lên trên đầu Cáo. Producer giữ nội dung chính không vượt y≈1316 để còn khe với phụ đề.

## Lưu ý cho Producer (không chặn duyệt)
1. Đo TTS rồi canh lại appear_s: nhãn thuật ngữ phải ≤ 0,5 s sau lời gọi tên (tool poisoning S13, rug pull S18, ghim phiên bản S23).
2. S26 (Cáo 6 s) và S27 cùng dáng thumbs_up liền nhau; nên đổi một trong hai dáng có sẵn nếu dựng thấy lặp.
3. Tải chữ 43,8 từ/phút sát trần: không thêm chữ ngoài semantic_plan.texts.

KẾT LUẬN: DUYỆT
