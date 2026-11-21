# Review storyboard IT-T17-E01, vòng 1

Bản nháp do **Claude làm thay Codex** (giám đốc duyệt 21/11/2026; Codex lỗi sandbox chỉ-đọc). Người duyệt là agent Claude khác tác giả, duyệt độc lập. Đã đọc toàn bộ cảnh S01–S08 trong JSON, các cảnh S09–S11 xem qua mốc, hold, chuyển, header, cùng `storyboard.md`, `script.md`, `pipeline-rules.json`, `scene-metrics.mjs`.

## Bảng chấm

| Tiêu chí | Kết quả | Ghi chú |
|---|---|---|
| 1. Show, don't tell / visual-first | Đạt | 10/10 cảnh có minh hoạ thật, `semantic_plan` đủ, mỗi keyword có hình, chữ chỉ nhấn (≤ 6 từ cùng lúc), kinetic 4 lần cách nhau ≥ 18 s, không hai cảnh liền. Không nhãn AI/ví dụ dựng. |
| 2. Đa dạng, R12, R13, R4 | Đạt (sau sửa) | 5 nền, chuỗi liền tối đa 3 cảnh, nền lớn nhất 30,9%, Cáo ≈ 15%, không 3 cảnh liền cùng cỡ cảnh. Còn theo dõi: nền "màn hình điện thoại" S03–S05 liền 3 cảnh (≤ 4, đạt). Chủ đề phần mềm/CSDL: video này không cần cảnh theme code (chủ đề quảng cáo/bảo mật, không phải phần mềm/CSDL). |
| 3. Khớp kịch bản | Đạt | Mạch tình huống, vấn đề, giải thích, xử lý đúng Y5; mũi tên nguồn đổi 5 trạng thái, trả đúng điện thoại và thẻ giày S01 ở S07/S11. Đuôi S11 0,57 s ≤ 0,7. |
| 4. Dựng được | Đạt có điều kiện | `renderer: pillow-ffmpeg` có lý do cụ thể, đã đối chiếu: Remotion scenes không có điện thoại/micro/bàn ăn/phòng họp, nền tối cố định không đáp ứng Y4. Camera chỉ S01 và S09 (≤ 1,25×) có mục đích và cách dựng. Rủi ro tiến độ: nhiều đạo cụ Producer phải tự vẽ bằng Pillow (đã khai rõ). |
| 5. Schema | Đạt | Đủ `main_change`, `text_groups`, `hold_reason`, `quality_check`, `renderer`, `renderer_reason`, `complexity`, `main_idea`, `concepts`, `hold_after_voice_s`, `opening`, `header`. Trường thêm `authored_by`, `kind_params.drawn_by` hợp lệ (schema không cấm). Storyboard.md ghi SCHEMA OK; các sửa của tôi chỉ đổi giá trị số/chuỗi và thêm một phần tử `texts` cùng dạng, không đổi cấu trúc. |
| 5b. D8 | Đạt | Opening 6,9 s (trong 1–8, mục tiêu 5–8), ba pha, có lời hook; header S03–S11 có `header_slot` xen kẽ, không `hidden_scenes`; 10/10 cảnh có texts; thuật ngữ được gọi tên đều có nhãn (sau khi thêm NHÀ BÁN); ~26,6–28 từ/phút (20–45); kinetic ≤ 1/cảnh; Cáo ≈ 15%. |

## Quyết định từng điểm tác giả nêu

1. **Lời 01 vào 0,15 s < 0,6 s**: SỬA (tôi sửa trực tiếp). Lời 01 dời sang 0,65–2,51 s, `pause_before_s` 0,65, `pause_after_s` 0,49 (lời 02 vẫn 3,00 s, tổng không đổi). Dịch theo: bong bóng 0,88 s, thẻ quảng cáo 1,75 s (vẫn trong 2 s đầu, vẫn thấy ở 360×640), camera đẩy bắt đầu 1,75 s, thẻ nảy 2,55 s, `sound_cue` 1,8 s; `style_params.voice[0]` = [0,65; 2,51]. Script.md không cần đổi (Producer căn lại theo TTS).
2. **S06 giữ 1,77 s < 2,0 s (High)**: SỬA. `hold_after_voice_s` 2,0, `duration_s` 8,25, `hold_s` 2,0; bù từ S07: `duration_s` 4,75, `hold_after_voice_s` 1,58 (≥ 1,0 Medium), `texts.disappear_s` 4,7. Tổng 67,6 s không đổi.
3. **Cửa sổ khái niệm 10 s = 2,17**: SỬA. S05 `concepts` 0, vì "bộ đếm" là một cách ghi dấu vết, cùng khái niệm "dấu vết" mà S04 vừa nêu; tác giả đã đề nghị, tôi chấp nhận kèm lý do. Cửa sổ 12,7–22,7 s còn ≈ 1,2.
4. **Opening gộp S01+S02**: CHẤP NHẬN. `checkOpening` và `cuesheet.py` đòi một cảnh opening; tổng thời lượng và lời không đổi. Lưu ý cho Producer: mã cảnh bắt đầu S01, S03 (không có S02), giữ nguyên, không đánh số lại.
5. **Nhãn NHÀ BÁN (S07)**: THÊM nhãn `NHÀ BÁN` (kind label, gắn bảng chọn nhóm, 0,45–4,7 s); `text_groups` S07 = 2, ≤ 3 và ≤ 8 từ. Đây là chữ thêm so với cột chữ gốc của script, nhưng cần để thoả R22 (thuật ngữ gọi tên phải có nhãn gắn đối tượng).
6. **S10 TÙY CHỌN QUẢNG CÁO trùng lời**: GIỮ. Đây là tên mục UI có thật, gắn mục trên menu; chỉ là cảnh báo `qc-measure`, không phải lỗi.
7. **Tiêu đề opening dời sang pha cuối, header chỉ từ S03, micro đỏ thay vàng, mốc nhãn dịch ≤ 0,8 s, Cáo ≈ 15%**: CHẤP NHẬN. Micro viền đỏ theo script. Cáo 14,9% nằm trong khoảng cho phép.

## Điểm còn lại cho QC/Producer (không chặn)

- Bố cục, kích thước ≥ 560 px, y ≥ 408 chưa đo trên bản dựng; QC đo trên chữ vẽ thật.
- Chuyển cảnh `circleopen`/`match_cut` đã khai; nếu ffmpeg xfade không hợp thì thay `fade` và ghi `notes.md`.
- Nội dung "Nguồn cần kiểm" (Meta Pixel, tên mục Tùy chọn quảng cáo) thuộc script, giám đốc đối chiếu.

## Các sửa nhỏ đã làm trực tiếp trong `storyboard.json`
status DRAFT → APPROVED; opening voice [0,65; 2,51]; mốc S01 (bong bóng 0,88; thẻ 1,75; camera; nảy 2,55; sound cue 1,8; văn bản mô tả liên quan); `voice_direction` L01 nghỉ 0,65/0,49; S05 `concepts` 0; S06 hold 2,0 / duration 8,25; S07 hold 1,58 / duration 4,75 / thêm nhãn NHÀ BÁN / `text_groups` 2.

## Bổ sung: đọc kỹ S09–S11 và kiểm JSON

Claude làm thay Codex (storyboard); người duyệt bổ sung là agent Claude, không phải tác giả. Đã đọc toàn bộ JSON (2371 dòng), script.md, schema.

**S09 (phòng họp, 8,5 s, medium).** Đạt. Lời 14/15 khớp mốc script (lời 14 0,15–4,57; lời 15 4,97–7,53; hold 0,97 ≈ 1,0 ≥ 1,0 Medium theo mức đo thực). Nhãn NGHE CHỦ ĐỘNG (3,95 s, sau lời ≈ 3,6 s, ≤ 0,5 s) và LỜI CHÀO BÁN (5,6 s) đều có trong cột chữ của script, gắn đối tượng; "2024" chỉ nói bằng lời, không vẽ số (đúng Y1). R11: hộp bằng chứng trống, nét nối vươn ra rồi rụt lại cho thấy "lời hứa ≠ bằng chứng". Camera push_in 1,00→1,08× khai mục đích (nhấn hộp trống) và cách dựng; mức nhỏ, chỉ nhấn, không tính vào chỉ số R4. Khoảng giữa các sự kiện ≤ 1,14 s. Header top_right xen kẽ S08 top_left. Nền phòng họp khác nền S08 và S10.

**S10 (màn hình cài đặt, 5,1 s).** Đạt. Lời 16 0,15–3,17, hold 1,93 s gồm giữ thẻ chạy bộ 1,0 s và khép menu 0,9 s (có chuyển động, hợp lý). Nhãn TÙY CHỌN QUẢNG CÁO nằm trong cột chữ của script (trùng lời, chỉ là tên mục UI, đã chấp nhận ở trên). Thẻ chạy bộ cyan nối lại S06, thấy được kết quả giải pháp. `drawn_by` nêu rõ Producer tự vẽ vì mẫu không có settings_menu.

**S11 (bàn ăn, 8,3 s).** Đạt. Mốc lời 17/18/19 (0,15 / 2,74 / 6,33) khớp script; đuôi 0,57 s ≤ 0,7 s, có `silence` kèm `duration_s`; nhãn TRÙNG ≠ BẰNG CHỨNG 3,0 s khớp script (62,30); kinetic đúng 1/cảnh, không liền cảnh có kinetic khác (S08 kinetic cách xa). Mũi tên nguồn ba nhánh hỏi trả đúng điện thoại/thẻ giày S01 (trạng thái hook 5/5). Cáo bow 0,2–1,8 và thumbs_up 6,3–8,3 (tổng 3,6 s), không che ba nhánh hay bong bóng; tổng Cáo toàn video 10,1 s ≈ 14,9% (≲ 15%, hẹp hơn bản đồ Cáo nhưng đã giải thích).

**Schema.** Đối chiếu bằng mắt từng enum của `storyboard.schema.json`: `type`, `form`, `kind`, `effect` (chuỗi tự do), `scene_type`, `scene_kind`, `camera`, `transition`, `intent`/`emotion`/`pace`/`intonation`, `sound_cues.intent` (`silence` có `duration_s`), `header.slots`, `header_slot`, `opening.style`/`phases` đều hợp lệ; các trường bắt buộc của cảnh đủ ở cả 10 cảnh. Chưa chạy được công cụ kiểm schema (agent không có Bash); đề nghị người điều phối chạy `studio/test/storyboard-schema.test.mjs` hoặc validator khi tiện.

**Kiểm JSON quanh chỗ lượt trước sửa.** S01 (style_params.voice, mốc 0,88/1,75/2,55, sound_cue 1,8, voice_direction L01 0,65/0,49), S05 (`concepts: 0`), S06 (`hold_after_voice_s` 2, `duration_s` 8,25, `hold_s` 2), S07 (`duration_s` 4,75, hold 1,58, hai phần tử `texts` có dấu phẩy, `text_groups` 2): ngoặc, dấu phẩy, kiểu số đều đúng. Tổng thời lượng 6,9+7,0+3,6+5,2+8,25+4,75+10,0+8,5+5,1+8,3 = 67,6 s; mốc nối liền 6,9 / 13,9 / 17,5 / 22,7 / 30,95 / 35,7 / 45,7 / 54,2 / 59,3 / 67,6, không lệch; `opening.duration_s` 6,9 = `S01.duration_s`; ba pha liền nhau (0–2,9–5,45–6,9). Lưu ý: bảng bảng-cảnh của script vẫn ghi S06 8,00 s/S07 5,00 s (nguồn dự kiến); storyboard là bản chạy và Producer căn lại theo TTS, tổng không đổi.

**Y1 (script ↔ storyboard).** Đã thêm `NHÀ BÁN` vào cột "Chữ trên màn hình" của cảnh S07 và vào bản đồ ngữ nghĩa S07 trong `ep01/script.md` (không đổi lời đọc).

**Không phát hiện lỗi lớn; không sửa thêm trong storyboard.json.** `status` giữ `APPROVED`.

KẾT LUẬN: DUYỆT SAU KHI CLAUDE SỬA NHỎ
