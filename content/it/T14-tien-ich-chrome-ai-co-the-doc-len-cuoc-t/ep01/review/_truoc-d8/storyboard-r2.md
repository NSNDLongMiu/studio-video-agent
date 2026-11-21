# Review storyboard IT-T14-E01 — vòng 2

Điểm sửa của vòng 1 (S15–S19 năm cảnh liền cùng nền code):
- S18 nay là `security #151D34`; chuỗi nền: S1–S4 office (4), S5 security, S6 office, S7–S9 security (3), S10–S11 code, S12–S14 incident (3), S15–S17 code (3), S18 security, S19 code, S20 office, S21 incident, S22–S23 security, S24–S27 office (4). Dài nhất 4 cảnh liền (R12 đạt), không còn 5 cảnh liền.
- `environment` S18 đủ lớp xa (nền chàm, đường mạng mờ), giữa (ray bàn thử, tab phụ xám), gần (nút, cung chờ, con trỏ), ánh sáng trái trên, bố cục giữ tâm tab và vị trí nút cho match cut sang S19 (Y4 đạt).
- Hình, chữ, mốc S18 giữ nguyên; `visual_style_note` đã ghi lý do đổi nền.

Kiểm không phát sinh lỗi mới:
- Tổng `duration_s` của 27 cảnh = 179,65 s (trong 150–190 s), trung bình ≈ 6,7 s/cảnh.
- `renderer: pillow-ffmpeg` có `renderer_reason`; cảnh khai camera/crop (S01, S03, S05, S17) có mục đích và cách dựng, ≤ 1,15×.
- Các trường bắt buộc (main_change, text_groups, quality_check, complexity, main_idea, concepts, hold_after_voice_s, opening, header) đủ.

| Tiêu chí | Kết quả |
|---|---|
| 1. Show don't tell / visual-first | Đạt |
| 2. Đa dạng, nền, R12–R14 | Đạt (lỗi vòng 1 đã xử lý) |
| 3. Khớp kịch bản | Đạt |
| 4. Dựng được | Đạt |
| 5. Đúng schema | Đạt |

Ghi chú nhỏ (không chặn): chuyển nền S17→S18→S19 đổi tông ngắn; Producer giữ trục tab/nút đúng như khai để match cut không giật.

KẾT LUẬN: DUYỆT
