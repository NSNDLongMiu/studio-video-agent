# Review storyboard IT-T16-E01 — vòng 2

Vòng 1: Claude làm thay Codex (bản nháp). Vòng 2: Codex sửa. Người duyệt: Claude (visual-director). Không có Bash nên không chạy Ajv; kiểm bằng đọc file, không dựa vào lời báo của Codex.

## Kiểm từng điểm r1

| # | Điểm r1 | Kết quả | Bằng chứng trong file |
|---|---|---|---|
| 1 | Chữ > 45 từ/phút | Đạt | Đếm lại `semantic_plan.texts`: S01 8, S02 5, S03 1, S04 5, S05 6, S06 3, S07 4, S08 4, S09 4, S10 0, S11 4 = 44 từ / 60,10 s = 43,9 từ/phút. Cảnh có chữ 10/11 = 91% (≥ 80%). Kinetic ở 3,40 s, 24,30 s, 39,70 s: mỗi cảnh ≤ 1, không liền nhau, cách ≥ 15 s. |
| 2 | Tên nền không có trong thư viện | Đạt | `kind_params.stage.backdrop` chỉ dùng office/server/warning/neutral, khớp `tools/motion/backdrops.py`; chủ đề nền (office/database/incident/security) giữ ở `environment`; `renderer_reason` ghi đúng cách dựng. Nền: office 23,0 s = 38,3%, database 21,5 s = 35,8%; không quá 3 cảnh liền. |
| 3 | Cáo 20,1% | Đạt | Bỏ Cáo ở S03; còn S01 3,0 + S07 2,5 + S11 3,6 = 9,1 s = 15,1%. |
| 4 | S08 zoom mâu thuẫn | Đạt | Không còn `zoom`; `scene_type` object_interaction; camera static. |
| 5 | Nhãn đạo cụ ngoài thư viện | Đạt | `renderer_reason` nói rõ gate/phone/ledger/card chỉ là nhãn, Producer vẽ riêng, không gọi `render_scene_kind` nguyên bản. |

## Kiểm phát sinh
- Lời trong `voice_over` khớp `script.md` (đối chiếu S01–S11); `voice_direction` khớp bảng R24.
- Thời lượng: 5+4,5+5,2+6,65+9,5+5,35+5,5+5,1+5+3,5+4,8 = 60,10 s (chuẩn 45–75). Đuôi im 0,6 s. Mốc nhãn so với lời đã dịch +0,7 s từ S05, lệch ≤ 0,5 s (R16).
- Cỡ cảnh không quá 2 liền; mỗi cảnh một ý; hold_after_voice đủ (High 2,0 s); R4 không khoảng tĩnh > 2 s thiếu hold_reason.
- Camera chỉ khai ở S01 và S04, đều có mục đích và cách dựng; mọi cảnh khác static.
- Opening 5 s ba pha có lời hook; header xuyên suốt, slot xoay, y nội dung ≥ 420.

## Quyết định về chuỗi UI trong đạo cụ
Đếm vào trần 45 từ/phút nếu được vẽ thành chữ. Lý do: R22 do QC đo trên chữ vẽ thật theo `render-log`, nên chữ trên màn hình điện thoại cũng vào số đo; theo cách đếm này tổng là 47,9 (> 45). Thay vì nới trần, Claude sửa nhỏ để chữ vẽ thật cũng ≈ 44:
- S07: nút «Gửi» thành icon mũi tên gửi.
- S10: bỏ nhãn «Chưa xác nhận» trên màn hình, dùng màu vàng + đồng hồ cát (trạng thái đã nêu bằng chữ ở S01 và giữ nguyên khung); `text_groups` 0.
Đã đồng bộ `visual_concept`, `animation_timeline`, `props`, `kind_params.states`, `semantic_plan` và `visual_style_note`. Lưu ý Producer: không vẽ chữ nào ngoài `semantic_plan.texts`, tiêu đề opening và header.

## Lưu ý còn lại (không chặn)
- Chưa kiểm bằng mắt ở 360×640 vì chưa có bản dựng; QC kiểm lại sau dựng.
- Mốc giây là dự kiến theo script; Producer canh lại theo TTS.

KẾT LUẬN: DUYỆT SAU KHI CLAUDE SỬA NHỎ
