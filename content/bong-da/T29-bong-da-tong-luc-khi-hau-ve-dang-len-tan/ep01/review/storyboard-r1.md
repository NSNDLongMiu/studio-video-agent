# Review storyboard BONG-DA-T29-E01 · vòng 1

Gemini làm thay Codex (giám đốc duyệt 21/11/2026); mô hình dự phòng gemini-3.8-flash-high, chạy r1b, schema báo hợp lệ. Người duyệt: Claude (visual-director), độc lập với tác giả.

## Đối chiếu script (kiểm từng cảnh)
- 10 cảnh S01–S10, line_id 01–16 khớp. Lời đọc không đổi chữ nào (Lời 10 đúng "Lấp ô: gần ô, đừng gần bóng.").
- Thời lượng: 3,3 + 4,3 + 5 + 6 + 8 + 6,4 + 6 + 6,9 + 6 + 5,8 = 57,7 s, khớp script; opening 7,6 s.
- Chữ trên hình (`text_overlay`, `semantic_plan.texts`) khớp cột "Chữ trên màn hình"; `TRONG PHA NÀY` có ở S03; mỗi lúc một ô sáng mạnh (S05 ghi rõ).
- Enum (emotion, intent, pace, intonation, header slot, opening style) đều nằm trong schema. Đủ main_change, text_groups, complexity, main_idea, concepts, hold_after_voice_s, semantic_plan, header_slot, sound_cues có reason, voice_direction, renderer + renderer_reason, captions.
- Cáo: S02 3,0 s + S07 2,2 s + S10 2,4 s ≈ 7,6 s ≈ 13% (đạt ≲ 15%); dáng surprised/idea/thumbs_up có thật.
- Renderer `pillow-ffmpeg`: hợp lý (sa bàn động, ô đổi màu, ba sợi, mũi tên Remotion không dựng được); `tools/motion/` có thật.
- Brief: không ảnh cầu thủ/áo/logo/tên đội/tên người, không đồng hồ đếm, không nói phát minh, không tên nền tảng. Đạt.

## Bảng chấm
| Tiêu chí | Kết quả |
|---|---|
| 1 Show don't tell, visual-first | CHƯA ĐẠT do chữ thừa trong `kind_params` (điểm 2) |
| 2 Đa dạng, R12 | CHƯA ĐẠT: nền N1 ≈ 57% (điểm 1) |
| 3 Khớp kịch bản, nhịp | Đạt |
| 4 Dựng được | CHƯA ĐẠT một phần: camera khai không nêu mục đích/cách dựng (điểm 3) |
| 5 Schema, trường bắt buộc | Đạt |
| D8 | (a),(b),(c) đạt; (d) chưa đạt (điểm 1) |

## Điểm cần sửa
1. **R12 nền (D8-d):** N1 ở S01, S02, S03, S05, S06, S09 = 3,3 + 4,3 + 5 + 8 + 6,4 + 6 = 33 s ≈ 57% (> 40%), và S01–S03 là ba cảnh liền cùng N1. Mô tả N1/N2/N3/N4 thực chất cùng một sân nhìn từ trên, chỉ khác zoom. Sửa: tách bối cảnh/khung bố cục thật sự khác nhau (nền, bố cục sa bàn, cỡ khung) sao cho mỗi nền ≤ 40% và ≤ 4 cảnh liền. Gợi ý: chuyển S03 sang nền N2 (cận hơn, tối) hoặc N5 mới; chuyển S06 sang N3-biến thể hoặc N2 như plan đã dự phòng; N1 còn S01, S02, S05, S09 (≈ 21,6 s ≈ 37%). Giữ N2 tổng ≤ 40% (S03 + S04 + S07 = 17 s = 29%). Ghi bảng nền theo cảnh vào `environment` từng cảnh và `renderer_reason` hoặc `visual_style_note`.
2. **Chữ thừa trong `kind_params`:** nhãn không có trong cột "Chữ trên màn hình" của script, nếu renderer vẽ ra thì thành chữ thừa/chép lời (Y1, R17–R18): S02 (`Ô TRỐNG HỞ`, `BÓNG MẤT`, `MŨI TÊN TÍM LAO VÀO`), S03 steps (`TIỀN VỆ CÁNH GẦN NHẤT`, `LÙI XUỐNG LẤP Ô`), S05 steps (`Ô THỨ HAI HỞ ĐỎ`, `TIỀN VỆ GIỮA TRƯỢT SANG BÙ`), S06 (`Ô LẠI HỞ`, `CÙNG LAO RA HOẶC TƯỞNG NGƯỜI KIA LẤP`, `ĐỐI PHƯƠNG TẤN CÔNG`), S07 (`GẦN BÓNG PHẢI VÒNG`, `GẦN Ô LÙI THẲNG`), S09 (`S01 Ô ĐỎ BỊ ĐE DOẠ`, `S09 Ô XANH ĐÃ LẤP`, lộ mã cảnh). Sửa: đổi `label` thành đúng chữ có trong `texts` của cảnh đó (vd S06 `CÙNG LAO RA`, `KHÔNG AI LẤP`; S07 `GẦN BÓNG`, `GẦN Ô`; S09 `ĐÃ LẤP`) hoặc ghi `label` là mô tả nội bộ không vẽ (thêm ghi chú rõ trong `kind_params`/`visual_concept`), và S02/S03/S05/S09 bỏ nhãn không thuộc cột chữ.
3. **Camera có mục đích (R12):** S02 `push_in`, S05 `pan_right`, S08 `pull_out` chưa nêu nhấn vật/quan hệ nào và cách dựng. Ghi vào `animation_timeline` hoặc `visual_concept`: mục đích (vd S02 push_in về ô đỏ khi mũi tên tới; S05 pan_right theo tiền vệ giữa sang ô hai; S08 pull_out để lộ dải sau bóng), cách dựng (`zoompan`/`crop` ≤ 1,3×). Nếu không có mục đích rõ thì đổi `static`.
4. **S06:** `scene_type: comparison_scene` không khớp nội dung (không so sánh đối xứng). Đổi `process_animation` cho đúng với `problem_cause_consequence`, hoặc giải thích.
5. (Nhỏ) S02 `animation_timeline` t=0 ghi "lời đọc vào lúc 0.15 s (3.45 s tổng)", nhất quán; không sửa. Giữ nguyên các mốc còn lại.

KẾT LUẬN: CẦN SỬA

Trạng thái `storyboard.json`: giữ `DRAFT` (chưa APPROVED).
