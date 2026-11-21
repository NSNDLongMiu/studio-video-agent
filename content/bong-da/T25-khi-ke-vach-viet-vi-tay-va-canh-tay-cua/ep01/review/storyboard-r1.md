# Review storyboard BONG-DA-T25-E01 · vòng 1 (Claude, Đạo diễn hình ảnh)

Đối chiếu: `storyboard.json` (DRAFT), `script.md` (DUYỆT), `storyboard.schema.json`, `tools/config/pipeline-rules.json`, `tools/motion/*`, `docs/chat-luong-xem.md`, `docs/mascot.md`.

## Bảng chấm

| # | Tiêu chí | Kết quả | Ghi chú |
|---|---|---|---|
| 1 | Show, don't tell / visual-first | Đạt | Cảnh nào cũng có hình thật (tay qua vạch, mặt nạ xám lên đáy nách, chip đổi màu, cờ đỏ→vàng→hạ). Chữ chỉ nhấn: 36 từ/57 s ≈ 38 từ/phút (trong 20–45). Mọi thuật ngữ được gọi tên có nhãn gắn đối tượng. Kinetic: S00, S04, S07, S10, mỗi cảnh ≤ 1, không hai cảnh liền, ≥ 1/25 s ở cảnh trọng tâm. Không số đo, không nhãn «ví dụ dựng/AI» trên hình. |
| 2 | Đa dạng / nhịp | Chưa đạt (nhẹ) | S07, S08, S09 liền nhau cùng `scene_kind: before_after` (3 cảnh liền, vượt "tối đa 2"). Shot size không vi phạm (medium, close_up, medium, close_up, extreme_close_up, medium, wide, medium). 9 cảnh, 6,3 s/cảnh, S04 High 8 s giữ 2,67 s. Nền: N1 = 22,8/57 = 40,0% (sát trần, đạt), N2 29%, tối đa 3 cảnh liền cùng chủ đề (S03–S05). Cáo xem tiêu chí 3. |
| 3 | Khớp kịch bản | Chưa đạt | (a) Lời mở vào ở 0,20 s, trái `pipeline-rules.json` (`opening.voice_start_min_s` = 0,6). (b) Cáo 10,9 s = 19,1% > ngưỡng D8(d) ≲ 15% (đạt ngưỡng Y2 25% nhưng D8(d) là điều kiện APPROVED). Mốc từng cảnh khớp script, tổng đúng 57,0 s, đuôi S10 0,62 s ≤ 0,7. Mạch Y5 đủ: tình huống, vấn đề, giải thích, sai lầm, xử lý, callback cờ hạ ở S09. Cờ/thẻ đổi trạng thái đúng bảng quy ước. |
| 4 | Dựng được | Đạt | `renderer: pillow-ffmpeg` kèm lý do cụ thể. Crop/zoom khai (S04 1→1,12×, S07 1→1,15×) ≤ 1,3×, có mục đích (nhấn nách, nhấn chỏm vai), dựng bằng crop/zoompan phẳng. `tools/motion` có `opening.py` (style `incident` có trong `openings.json`), `header.py`, `kinetic.py`. Pose `think`/`point_right`/`idea`/`thumbs_up` có trong `docs/mascot.md`. Cỡ Cáo 170–185 px (15,7–17%) đạt Y3. |
| 5 | Schema + D8 | Chưa đạt (nhẹ) | Enum và trường bắt buộc đều hợp lệ (scene_kind, scene_type, camera, transition, keywords.type, opening.style/phase, header.slots). Thiếu `hold_reason` ở S04 (tĩnh 5,33→8,00 s = 2,67 s > 2 s). Header: không `hidden_scenes`, S03–S10 đều có `header_slot` xoay TL/T/TR và không đè bố cục khai. Opening 7,8 s (≤ 8) ba pha, có `voice_line`. 100% cảnh có `semantic_plan.texts`. |

Luật chủ đề: không người/đội/giải thật, không logo, không năm, không công nghệ đo, không số đo; không có tên bốn nền tảng trong storyboard (đã grep bằng mắt trên toàn JSON). Đạt.

## Góp ý cần sửa (đánh số)

1. **S00, `voice_direction` L01/L02 (bắt buộc).** Đưa lời mở về ≥ 0,6 s: L01 `pause_before_s` 0,6 (thay 0,2), `pause_after_s` 0,15 (thay 0,55); L02 giữ `pause_before_s` 0,15 để L02 vẫn bắt đầu ≈ 3,15 s, nhờ đó mọi mốc `animation_timeline` của S00 (1,2 / 3,15 / 4,28 / 5,0) và tổng 7,8 s không đổi. Cờ đỏ 1,2 s sẽ rơi đúng vào "bàn bị gạt" (~1,22 s), tốt hơn bản cũ. Ghi trong `phases[0]` hoặc `animation` rằng lời vào ở 0,6 s. `script.md` ghi 0,20 s là mốc dự kiến; người điều phối cần đồng bộ bảng "Mốc lời" của script (S01: Lời 01 từ 0,60) sau vòng này, hoặc Producer đo lại sau TTS.
2. **Cáo ≲ 15% (bắt buộc, D8(d)).** Bỏ Cáo ở S05: `character_action` = "" và xoá phần Cáo khỏi `environment` (dời gôn/hình người ra chiếm cân bằng, vẫn giữ vật chính ≥ 560 px). Còn Cáo ở S00 (3,0 s) và S10 (4,25 s) = 7,25 s ≈ 12,7%, vẫn đủ mở, kết và một nhịp chuyển ý ở S10. Cập nhật `plan.md` Bản đồ Cáo ở mục tương ứng (người điều phối/Kịch bản làm nếu cần).
3. **S09 đổi `scene_kind` (bắt buộc).** Tránh ba cảnh liền `before_after`. Đề xuất `problem_cause_consequence` (cùng khung với S00 nên là callback đúng nghĩa): `problem` = {label "", object "bóng trong lưới"}, `cause` = {label "", object "thẻ tay chuyển xám, đầu thân chân xanh sau vạch"}, `consequence` = {label "KHÔNG VIỆT VỊ", object "cờ hạ, chip xanh dương"}. Giữ nguyên `scene_type`, timeline, chữ. Sau đó đặt `repeats_previous_kind` của S08 và S09 theo đúng giá trị mới (S09 = false).
4. **S04 thêm `hold_reason`.** Ví dụ: "Giữ sơ đồ hoàn chỉnh 2,67 s (High): đáy nách, vai xanh, tay xám duỗi xa để so sánh trước khi sang cách nhớ; đốm sáng chạy dọc đường cam giữ mắt." 
5. **S07 (khuyến nghị).** Nhãn `KHÔNG VIỆT VỊ` ở ô trên chỉ hiện 0,8 s (6,6–7,4) ở cỡ ô thu nhỏ, khó đọc ở 360×640. Cho khung hai ô dọc vào sớm 0,15 s (≈ 6,45) và nhãn hiện 6,45–7,4 (≥ 0,95 s), `hold_after_voice_s` 1,0 vẫn đủ. Không bắt buộc nếu Codex chứng minh đọc được.

Không cần làm gì thêm với: `renderer` (đạt), opening 7,8 s, header, chữ kinetic, mốc S03–S10.

KẾT LUẬN: CẦN SỬA
