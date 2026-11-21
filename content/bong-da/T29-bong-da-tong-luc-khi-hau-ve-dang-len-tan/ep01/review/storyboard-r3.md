# Review storyboard BONG-DA-T29-E01 · vòng 3 (cuối)

Gemini làm thay Codex (giám đốc duyệt 21/11/2026); mô hình dự phòng gemini-3.8-flash-high, bản sửa lần 2. Người duyệt: Claude (visual-director), độc lập với tác giả. Đã tự mở storyboard.json và script.md kiểm, không dựa lời tự báo. Enum đối chiếu tay với `studio/schema/storyboard.schema.json` (push_in/pull_out/pan_right có; gemini-run đã báo Ajv hợp lệ).

## Kiểm ba điểm tác giả báo sửa
1. **N3 thống nhất: ĐẠT.** `visual_style_note`, S06 và S08 cùng định nghĩa: xanh rêu tối #152A1E, vạch 3 hành lang mờ; khác N2 navy lam #0E1E36 và N1 #183827. Phân bổ R12: N1 = S01, S02, S05, S09 (21,6 s, 37,4%); N2 = S03, S04, S07 (17,0 s, 29,5%); N3 = S06, S08 (13,3 s, 23,1%); N4 = S10 (10,1%). Trình tự N1 N1 N2 N2 N1 N3 N2 N3 N1 N4: không nền nào quá 2 cảnh liền.
2. **S05 pan_right: ĐẠT.** Zoom 1,15× (biên dịch tối đa ≈ 141 px), khai dịch 80 px: dựng được bằng crop; mục đích (bám tiền vệ giữa trượt bù ô) nêu rõ; `visual_concept`, `environment`, `animation_timeline` t=3,21 nhất quán.
3. **S02 push_in: ĐẠT có một chỉnh nhỏ.** Neo x≈600, Cáo dời vào x≈165 (sau zoom cách mép ≈ 100 px), tiêu đề y≈260–380 trong vùng an toàn, phụ đề vẽ sau zoompan. Phát hiện thêm: Cáo mới ở x≈165–335 đè lên chấm trung vệ trái (315, 1095) của S01. Claude tự sửa (xem dưới).

## Hồi quy
- 10 cảnh, line_id 01–16; lời đọc từng cảnh nguyên văn script (Lời 10 đúng "Lấp ô: gần ô, đừng gần bóng.").
- Thời lượng 3,3 + 4,3 + 5 + 6 + 8 + 6,4 + 6 + 6,9 + 6 + 5,8 = 57,7 s; mỗi cảnh timeline + hold khớp duration; opening S01–S02 = 7,6 s, ba pha khớp mốc; đuôi im S10 0,6 s ≤ 0,7.
- Chữ trên hình khớp cột script; `TRONG PHA NÀY` có ở S03; mỗi lúc một ô sáng mạnh; kinetic ở S02, S04, S07, S10 (không hai cảnh liền, ≤ 1/cảnh).
- Header: không hidden_scenes, ô đổi mỗi cảnh liền kề (S03 top_left, S04 top, S05 top_right, S06 top_left, S07 top, S08 top_right, S09 top_left, S10 top); S06 = process_animation; camera S08 pull_out 1,2× → 1,0× có mục đích và cách dựng.
- Cáo: S02 3,0 + S07 2,2 + S10 2,4 = 7,6 s ≈ 13%; ba dáng có thật; đứng nói 1/10.
- Chữ minh hoạ ≈ 45 từ nếu tính cả nhãn lặp (≈ 47 từ/phút), ≈ 39 từ nếu không lặp: giữ nguyên, ghi nhận không chặn.
- renderer `pillow-ffmpeg` + lý do đúng component thật. Brief: không logo, người thật, tên đội. Luật tên nền tảng: grep sạch.

## Bảng chấm
| Tiêu chí | Kết quả |
|---|---|
| 1 Show don't tell, visual-first | Đạt |
| 2 Đa dạng, R12, R13 | Đạt |
| 3 Khớp kịch bản, nhịp | Đạt |
| 4 Dựng được | Đạt |
| 5 Schema, trường bắt buộc | Đạt |
| D8 (a)–(d) | Đạt |

## Claude đã tự sửa (nhỏ, trong JSON)
- S02 `environment`: thêm câu quy định chấm trung vệ trái (315, 1095) vẽ mờ 40% khi Cáo đứng đè lên ô đó, để một tiêu điểm duy nhất là ô đỏ. Không đổi gì khác.

## Ghi chú cho Sản xuất
Đo lại mốc sau TTS; ngoài S02 (Cáo/trung vệ) kiểm S10 Cáo không che sa bàn thu nhỏ ở 360×640.

KẾT LUẬN: DUYỆT SAU KHI CLAUDE SỬA NHỎ
