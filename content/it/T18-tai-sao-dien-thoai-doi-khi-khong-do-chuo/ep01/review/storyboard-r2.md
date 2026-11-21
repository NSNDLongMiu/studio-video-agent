# Review storyboard IT-T18-E01, vòng 2 (Claude, 21/11/2026)

Đối chiếu trực tiếp `storyboard.json` (10 cảnh, 62,8 s, 1884 khung ở 30 fps, `pillow-ffmpeg`), `script.md` đã chốt, `storyboard.schema.json`. Không chạy được Ajv (không có Bash); đối chiếu thủ công trường/enum (label/object chỉ cần string, `hidden_scenes` không dùng): không thấy lỗi. Producer/QC chạy `npm test --prefix studio`.

## Kiểm lại 5 điểm vòng 1 (đã đọc trong file)

| # | Điểm | Kết quả |
|---|---|---|
| 1 | S07 High | Đạt: 8,5 s, `hold_after_voice_s` 2,5, timeline giữ hai chốt từ 6,0 đến 8,15 s. S11 còn 4,5 s, hold 1,79 s, vẫn hợp lệ. Tổng 62,8 s không đổi. |
| 2 | Chữ minh hoạ | Đạt: đếm `texts` được 42 từ ngoài tiêu đề (46 kể tiêu đề), ≈ 40–44 từ/phút (R22: 20–45). 10/10 cảnh có texts; kinetic S00, S05, S07 (≤ 1/cảnh, không liền nhau, ≥ 1/25 s). |
| 3 | Cáo ≲ 15% | Đạt: S00 0–3,2 s, S05 2,4 s, S12 3,0 s = 8,6 s = 13,7%. `character_action`, props, keyword "Cáo" của S00 đã khớp (rời hình ở 3,2 s); S11 không còn Cáo. |
| 4 | Bảng chủ đề nền | Đạt: tổng 13,4 + 11,0 + 20,5 + 17,9 = 62,8 s; mỗi chủ đề ≤ 32,6%; chuỗi dài nhất 3 cảnh (S07–S09). Lưu ý nhỏ: bảng trong `visual_style_note` thiếu dòng phân cách markdown, không ảnh hưởng dựng. |
| 5 | Chấm chương header | Đạt: đã bỏ, header chỉ vẽ dòng chủ đề; `header_slot` xen phải/trái S04–S12, không đè Cáo hay sơ đồ. |

Góp ý nhỏ r1: S04 ghi rõ cửa đỏ tái dùng nhãn KHÔNG CÓ ở S00 (chấp nhận); S08 mốc "3,60 s tính từ đầu cảnh" (đạt); S05 Cáo 165 px (đạt); S06–S08 khác khung/cỡ (wide đứng navy, medium ngang tím, pov dọc có pan).

## Kiểm lỗi mới
- Lời `voice_over` và `voice_direction` L01–L18 khớp từng chữ với script; mốc S00 (Họp 2,05; công tắc 3,4; cyan 4,0; Không có 6,9; giữ 0,44) và S11 (một phút 2,1 s; hold 1,79 s) khớp. Chênh S04 6,0/6,2 và S08 7,0/7,35 so với ngân sách: Producer chỉnh sau TTS, không chặn.
- Có opening 8 s ba pha có lời hook, header xuyên suốt, không `hidden_scenes`. Đuôi im 0,6 s. Mọi crop/pan ≤ 1,15× có mục đích; `renderer_reason` nêu rõ vì sao Remotion không đủ. Pose sleep/surprised/shrug/thumbs_up có thật.
- Không phát sinh vi phạm R4/R11/R13/R16 nào.

KẾT LUẬN: DUYỆT

## Ghi chú của người điều phối (sau duyệt)
- Kiểm schema bằng Ajv (`studio/test/storyboard-schema.test.mjs`) **CHƯA CHẠY**: việc nền không có quyền chạy lệnh test (bị từ chối tự động). Chỉ có đối chiếu thủ công của `visual-director`. Producer/QC chạy `npm test --prefix studio` trước khi dựng.
- Bước 4b (ảnh sinh): `visual-director` chọn S00 và S12 (brief ở `gemini-images-S00-r1.prompt.md`). **Gemini vắng: LIMIT rồi NO_ACCOUNT** (thử 2 lần). Không có ảnh sinh; `assets/gen/approved.json` ghi `"images": []` kèm lý do. Sản xuất dùng nền `tools/backgrounds/make_background.py`.
