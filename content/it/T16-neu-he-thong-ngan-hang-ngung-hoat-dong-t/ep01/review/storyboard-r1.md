# Review storyboard IT-T16-E01 — vòng 1

Người duyệt: Claude (visual-director, review độc lập tác giả). **Bản nháp do Claude làm thay Codex** theo lệnh giám đốc 21/11/2026 (Codex lỗi sandbox chỉ-đọc). Không hạ chuẩn vì làm thay.
Cách kiểm: đọc schema, đọc từng cảnh, đối chiếu `tools/motion/*.py`, `tools/backgrounds/make_background.py`, `tools/config/pipeline-rules.json`, `docs/chat-luong-xem.md`. Không có Bash nên không chạy Ajv; kiểm schema bằng đọc.

## Bảng chấm

| # | Tiêu chí | Kết quả | Ghi chú |
|---|---|---|---|
| 1 | Show, don't tell / visual-first | Đạt | Cả 11 cảnh có minh hoạ thật, semantic_plan đủ, keyword có hình ≥ 70%. Vật nhận diện cuốn sổ xuyên suốt, S10 trả đúng khung S01. |
| 2 | Đa dạng, R11–R13 | Đạt | Cỡ cảnh không quá 2 liền; nền ≤ 3 cảnh liền, không chủ đề quá 40%; hold_after_voice đủ; sơ đồ S05 dựng từng bước. |
| 3 | Khớp kịch bản | Đạt (có lưu ý Cáo) | Đủ mạch Y5, 60,10 s, đuôi 0,6 s. Cáo 12,1 s = 20,1% (plan duyệt ≤ 25%) nhưng D8(d) đặt ≲ 15%: xem góp ý 3. |
| 4 | Dựng được | **Chưa đạt** | Tên nền không có trong `tools/motion/backdrops.py`; xem góp ý 2. |
| 5 | Schema | Đạt | Mọi trường required có; enum hợp lệ (voice_direction, sound_cues, transition, scene_kind, before_after/step_by_step); `authored_by` không vi phạm vì schema gốc không có `additionalProperties:false` (giữ, nhưng Producer không được đọc nó làm điều kiện). |
| 5b | D8 | **Chưa đạt** | (a) opening 5 s, ba pha, lời hook 0,6 s: Đạt. (b) header mọi cảnh sau opening, không `hidden_scenes`, slot hợp lý: Đạt. (c) **số từ chữ minh hoạ vượt 45/phút**: xem góp ý 1. (d) chủ đề nền Đạt; Cáo xem góp ý 3. |

## Góp ý (vòng 2 sửa)

1. **D8(c) lượng chữ: 56 từ/phút, trần 45.** Đếm từ `semantic_plan.texts`: S01 8, S02 5, S03 4, S04 8, S05 6, S06 3, S07 5, S08 4, S09 4, S10 3, S11 6 = 56 từ trong ~60 s (tính cả trừ tiêu đề opening vẫn 51). Cắt ≥ 11–12 từ mà vẫn giữ nhãn gắn đối tượng cho thuật ngữ được gọi tên:
   - S04: «NAPAS 2025 · liên ngân hàng» thành «NAPAS 2025» (−3); phạm vi «liên ngân hàng» để lời nói (lời 05 đã nói) hoặc ghép vào nhãn số «32 triệu / ngày» không thêm từ.
   - S10: bỏ nhãn «Chưa xác nhận» (−3), trạng thái đã hiện trên màn hình điện thoại như UI (chữ trong hình vẽ điện thoại, không phải nhãn thêm); đồng thời bỏ kinetic ở S10, giữ kinetic S01, S05, S07 (cách nhau 15–20 s, vẫn ≥ 1/25 s ở cảnh trọng tâm).
   - S11: «Kiểm tra lịch sử» thành «Lịch sử» (−2), «Bấm lại» giữ.
   - S07: bỏ nhãn «Gửi» (−1, nút đã là UI).
   - S03: «Sổ ghi số dư» thành «Sổ» hoặc «Số dư» (−2 đến −3).
   Tổng −11 đến −12, còn ≈ 44–45. Cập nhật `text_overlay`, `text_groups`, `animation_timeline`, `sound_cues`, phần tính chữ trong `visual_style_note` tương ứng.
2. **Renderer: tên nền sai so với thư viện thật.** `tools/motion/backdrops.py` chỉ có `office`, `server`, `warning`, `neutral`. Storyboard dùng `incident` (S07, S09) và `security` (S08) trong `kind_params.stage.backdrop` và `renderer_reason` còn liệt kê «backdrops (office, database, incident, security)» như thể thuộc thư viện: sai, và `_plate()` sẽ KeyError. Sửa một trong hai cách, ghi rõ ở `renderer_reason`: (a) `kind_params.stage.backdrop` dùng tên hợp lệ (S07, S09 `warning`; S08 `neutral` hoặc `server`), còn nền theo ngữ cảnh `database/incident/security/office` lấy từ `tools/backgrounds/make_background.py` làm lớp nền ảnh dưới đồ hoạ; (b) hoặc nêu rõ Producer dùng `make_background.py` cho nền cả video, không gọi `backdrop()` của tools/motion. Giữ nguyên tên chủ đề trong `environment` (đúng Y4). Sửa luôn S01/S02/S03/S10/S11 (`office` hợp lệ) và S04–S06 (`server` hợp lệ) để thống nhất.
3. **Cáo 20,1% so với D8(d) ≲ 15%.** Plan cho ≤ 25% nên chấp nhận được, nhưng gần như bằng chứng nhỏ nhất là S03 (present_hand 3,0 s) không bắt buộc: nên bỏ Cáo ở S03 (cuốn sổ và ba mũi tên đã đủ; còn 9,1 s ≈ 15,1%) hoặc rút S01 `think` còn 2,4 s và S07 `stop` còn 2,0 s. Chọn một và ghi lại tổng.
4. **S08 mâu thuẫn zoom.** `kind_params.zoom: 1.2` và `scene_type: cinematic_close_up` nhưng `camera.movement: static` và environment nói «vòng lấy nét thay camera zoom». Bỏ `zoom` hoặc khai chuyển động thật (crop ≤ 1,3×, mục đích: nhấn chỗ hai đường nối hội tụ) và cách dựng; thống nhất `scene_type` (nên `object_interaction` nếu không zoom).
5. **Đạo cụ ngoài thư viện (ghi nhận, không phải lỗi).** `gate`, `phone`, `ledger`, `card` không có trong `components.py`/`scene_kinds.py`. `renderer_reason` đã thừa nhận Producer vẽ riêng ở `assets/_scratch/visual.py`: chấp nhận, nhưng thêm vào `renderer_reason` một câu: các `object` này trong `kind_params` chỉ là nhãn mô tả, Producer không được gọi `render_scene_kind` nguyên bản với chúng.

Các điểm đã kiểm Đạt, không cần sửa: opening ba pha (visual_hook, conflict, topic_reveal) và `voice_line`; header «BANKING / HỆ THỐNG LÕI» với slot xoay không đè; `voice_direction` khớp bảng R24 của script; `sound_cues` có `reason`, cue `silence` có `duration_s`; hold_after_voice Low/Medium/High đủ; R4 không có khoảng tĩnh > 2 s thiếu `hold_reason`; số NAPAS có nhãn nguồn, không logo/tên ngân hàng.

KẾT LUẬN: CẦN SỬA
