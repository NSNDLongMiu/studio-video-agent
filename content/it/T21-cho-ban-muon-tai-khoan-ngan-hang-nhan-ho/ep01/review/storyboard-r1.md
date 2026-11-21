# Review storyboard IT-T21-E01 · vòng 1 · Claude

Đã tự đối chiếu `storyboard.json` (8 cảnh, tổng 56,17 s khớp 8+8+7,4+5,9+5+7,2+6+8,67), `script.md`, `pipeline-rules.json`, `qc-thresholds.json`, poses Cáo (think/surprised/stop/thumbs_up có thật). Không dùng lời Codex để kết luận.

## Bảng chấm

| # | Tiêu chí | Kết quả | Ghi chú |
|---|---|---|---|
| 1 | Show, don't tell / visual-first | Đạt | Mọi cảnh có minh hoạ thật, semantic_plan đủ, hệ quả luôn "có thể" (viền đỏ nét đứt), mức phạt chỉ nối với mũi tên "cho mượn" (S05), không tên ngân hàng/Điều 291/án tù, không hình đồ ăn hay đôi dép. Chữ quá dày, xem mục 5b-c. |
| 2 | Đa dạng, nhịp | Đạt có sửa | Không 3 cảnh liền cùng cỡ/bố cục; ≥ 3 bối cảnh; kinetic không hai cảnh liền. Khoảng giữ Medium của S04 (0,97) và S07 (0,77) thấp hơn 1,0 s (R13); S03 High giữ 1,89 s < 2 s. |
| 3 | Khớp kịch bản | Đạt có sửa | Mạch Y5 đủ, mốc lời khớp script. Lỗi: lời opening vào 0,30 s, luật chỉ cho 0,6–3,0 s. |
| 4 | Dựng được | Đạt | pillow-ffmpeg có `renderer_reason` rõ; mọi chuyển động camera khai đều ≤ 1,16×, có mục đích, kỹ thuật crop/zoompan sẵn có. Pose Cáo có thật, Cáo ≤ 1,5× nguồn. |
| 5 | Schema | Đạt | Đủ trường bắt buộc, enum hợp lệ (style hypothetical, scene_kind, kind_params before/after/steps). |
| 5b | D8 | CHƯA ĐẠT 2 mục | (a) opening 8 s ba pha nhưng voice vào 0,30 s < 0,6 s. (b) header hợp lệ, không `hidden_scenes`, slot đổi ô, không đè. (c) mật độ chữ minh hoạ: khoảng 60 từ / 56,17 s ≈ 64 từ/phút (đo trên `semantic_plan.texts`) vượt khoảng 20–45 (qc-thresholds); kinetic 4 lần (S00, S03, S05, S09), ≤ 1/cảnh, đạt. (d) nền: bàn ấm 29,7% theo environment nhưng `stage: office` ở S00+S08+S09 = 22,67 s = 40,4% > 40%; Cáo 22,2% (≤ 25% theo Y2 đạt, mục tiêu thử 15% chưa đạt). |

## Danh sách sửa (Codex làm vòng 2)

1. **Lời opening (bắt buộc).** `voice_direction` L01 `pause_before_s` 0,30 đổi thành 0,60 (luật `voice_start_min_s` = 0,6; `checkOpening.voice_ok` sẽ rớt nếu để 0,30). Ép nghỉ trong L01 còn 0,10 s và L02 `pause_before_s` ≈ 0,10, giữ `pause_after_s` L02 ≈ 0,9 để cả opening vẫn đủ 8 s. Dời theo: cắt nội bộ ≈ 4,10 s, dáng surprised, thẻ trượt/sound_cues, `hold_after_voice_s` S00, mốc lời trong storyboard.md. Hình tin nhắn vẫn bật ở 0,10 s (trước lời) giữ nguyên.
2. **Khoảng giữ (R13).** S03 `hold_after_voice_s` ≥ 2,0 (kéo S03 +0,11 s); S04 ≥ 1,0 (+0,03 s); S07 ≥ 1,0 (+0,23 s, cảnh thành ≈ 7,43 s). Cập nhật `duration_s`, `hold_s` và mọi mốc phía sau; tổng ≈ 56,5 s vẫn trong 45–75 s.
3. **Giảm chữ minh hoạ về ≤ ~50 từ (≈ 53/phút) hoặc ghi lý do.** Bỏ: `YÊU CẦU GIẢI TRÌNH` ở S04 (đã gọi tên ở S00, thẻ giống hệt, hình tự đọc), `DƯỚI 10 TÀI KHOẢN` ở S05, `CÓ THỂ BỊ PHẠT` ở S06 (chip vàng nét đứt đã nói đủ; để chip không chữ), `TIN NHẮN` ở S08 (biểu tượng khung chat đã rõ). Giữ nhãn gắn đối tượng ở S03, kinetic ở S03/S05. Cập nhật `text_groups` và `quality_check`.
4. **Chủ đề nền.** Đặt `kind_params.stage` của S08 sang tên riêng (ví dụ `solution`, đúng với environment N4 sáng nhẹ) để office (S00+S09) còn ≈ 29,7% (nền thật đã đúng, chỉ lệch nhãn).
5. **Khuyến nghị (không chặn):** hạ tỉ lệ Cáo bằng cách cắt `thumbs_up` S09 còn khoảng 5,16–7,3 s (hết nghỉ hạt tiền, Cáo rời trước bong bóng rỗng nở), mục tiêu ≤ 20%; tiêu đề `TÊN AI TRÊN GIAO DỊCH?` dễ bị đọc là "AI" trí tuệ nhân tạo trên kênh IT, nên viết `TÊN NGƯỜI NÀO TRÊN GIAO DỊCH?` hoặc cho biết lý do giữ.
6. Cập nhật `storyboard.md` đồng bộ mốc mới.

## Ảnh nền (chế độ ẢNH-BRIEF, làm sau APPROVED)
Chưa có ảnh nào ở `ep01/assets/gen/`. Dự kiến chọn S00 (nền bàn ấm N1, dùng lại cho S09), không chọn cảnh có sơ đồ.

KẾT LUẬN: CẦN SỬA
