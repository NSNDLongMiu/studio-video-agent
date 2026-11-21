# Review storyboard BONG-DA-T25-E01 · vòng 2 (Claude, Đạo diễn hình ảnh)

Gemini làm thay Codex (giám đốc duyệt 21/11/2026). Mô hình đã dùng: gemini-3.8-flash-high (dự phòng). Claude kiểm độc lập, không tin lời tự báo; so từng trường với bản vòng 1 (`_gemini-truoc/storyboard-20261121120732.json`), `script.md`, `storyboard.schema.json`, `pipeline-rules.json`.

## 1. Năm điểm sửa của r1

| # | Điểm | Kết quả |
|---|---|---|
| 1 | S00 L01 pause_before 0,6 / pause_after 0,15 | Đạt. L01 0,6/0,15; L02 giữ 0,15/1,0 nên L02 vẫn ≈ 3,15 s; mốc timeline 1,2/3,15/4,28/5,0 và tổng 7,8 s không đổi. `animation` và `phases[0].visual` ghi lời vào ở 0,6 s. Khớp `voice_start_min_s` = 0,6; script.md đã đồng bộ. |
| 2 | S05 bỏ Cáo | Đạt. `character_action` = "", `environment` ghi "không có Cáo", không còn point_right ở trường nào. Cáo còn S00 3,0 s + S10 4,25 s = 7,25 s = 12,7% (< 15%). |
| 3 | S09 đổi kind | Đạt. `problem_cause_consequence`, kind_params đúng như đề xuất, đúng schema (problem/cause/consequence). `repeats_previous_kind`: S08 = true (liền S07 before_after), S09 = false. |
| 4 | S04 hold_reason | Đạt. Có, mô tả đúng đoạn tĩnh 5,33–8,00 s. |
| 5 | S07 khung vào 6,45 s | Đạt. Timeline 6,45 (cách mốc 5,5 là 0,95 s); `texts` nhãn KHÔNG VIỆT VỊ 6,45–7,4; environment ghi 6,45. |

## 2. So bản vòng 1: không đổi ngoài ý muốn

Đối chiếu từng cảnh: chỉ khác ở S00 (pause, animation, phases[0].visual), S04 (+hold_reason), S05 (environment, character_action), S07 (environment, timeline, texts), S09 (kind_params, repeats_previous_kind). Cảnh, thời lượng, `voice_over`, enum, `voice_direction` các cảnh khác, S03/S06/S08/S10: giữ nguyên.

## 3. Khớp script.md

Chữ `voice_over` 9 cảnh khớp lời 01–14 từng chữ, line_id đủ 01–14. Thời lượng 7,8 + 5 + 8 + 3,8 + 6,6 + 7,4 + 6,2 + 5,8 + 6,4 = 57,0 s, khớp bảng ngân sách. Đuôi S10 0,62 s ≤ 0,7.

## 4. Schema và dựng được

`scene_kind` thuộc enum; `kind_params` đúng yêu cầu của before_after, problem_cause_consequence, step_by_step; `hold_reason`, `main_change`, `text_groups`, `quality_check` đủ. `renderer: pillow-ffmpeg` kèm `renderer_reason` cụ thể (component Remotion thiếu mặt nạ tay theo nách, nền ngà, sân trên cao); crop/zoom S04 1,12×, S07 1,15× (≤ 1,3×) có mục đích. Pose Cáo think/idea/thumbs_up có thật.

## 5. Chấm tiêu chí, Y, R, D7/D8

| Mục | Kết quả |
|---|---|
| 1 Show, don't tell | Đạt. Mọi cảnh có minh hoạ thật, chữ chỉ nhấn (≈ 38 từ/phút), nhãn gắn đối tượng, không số đo/nhãn thừa. |
| 2 Đa dạng | Đạt. kind liền kề đổi (S07 before_after, S08 before_after là 2 cảnh liền, ≤ 2); không ba cảnh liền cùng kind; shot size không lặp 3 lần; 9 cảnh, 6,3 s/cảnh; S04 High 8 s giữ 2,67 s; nền N1 = 40,0% (đúng trần, ≤ 4 cảnh liền). |
| 3 Khớp kịch bản | Đạt. Mạch Y5 đủ, callback cờ hạ ở S09, nghỉ Y7 gắn hình đổi. |
| 4 Dựng được | Đạt (mục 4 trên). |
| 5 / D8 | Đạt. Opening 7,8 s ≤ 8, ba pha, có lời hook từ 0,6 s; header xuyên suốt, không hidden_scenes, `header_slot` xoay TL/T/TR; 100% cảnh có `semantic_plan.texts`; kinetic S00, S04, S07, S10, ≤ 1/cảnh, không hai cảnh liền; Cáo 12,7%; sound_cues có reason, silence có duration_s; voice_direction đủ theo line_id. |

Luật chủ đề: không người/đội/giải thật, logo, năm, số đo, công nghệ đo; grep không có tên bốn nền tảng (luật cứng 10).

Lưu ý cho Sản xuất (không chặn): mốc lời đo lại sau TTS; N1 sát trần 40% nên không thêm cảnh N1.

KẾT LUẬN: DUYỆT
