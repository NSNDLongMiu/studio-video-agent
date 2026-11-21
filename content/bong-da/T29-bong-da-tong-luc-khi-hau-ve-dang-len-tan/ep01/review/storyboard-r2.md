# Review storyboard BONG-DA-T29-E01 · vòng 2

Gemini làm thay Codex (giám đốc duyệt 21/11/2026); mô hình dự phòng gemini-3.8-flash-high, bản sửa lần 1. Người duyệt: Claude (visual-director), độc lập với tác giả. Đã tự mở file kiểm, không dựa lời tự báo. Chưa chạy Ajv (không có Bash); enum đối chiếu tay với `studio/schema/storyboard.schema.json` (movement push_in/pull_out/pan_right, scene_kind, opening style `incident` đều có).

## Kiểm bốn điểm tác giả báo
1. **R12 nền: ĐẠT một phần.** Phân bổ đúng: N1 = S01, S02, S05, S09 (21,6 s, 37,4%); N2 = S03, S04, S07 (17,0 s, 29,5%); N3 = S06, S08 (13,3 s, 23,1%); N4 = S10 (5,8 s, 10,1%). Không nền nào quá 2 cảnh liền, không 3 cảnh liền cùng cỡ cảnh (wide, wide, medium, close, medium, wide, close, wide, wide, medium). Nhưng `environment` của N3 không nhất quán: S06 ghi "nền than tối #141E28", S08 ghi "mặt sân xanh phẳng" (và plan.md định nghĩa N3 = sân N1 ở thế đang tấn công). N2 (#101B2E) và N3 (#141E28) gần như cùng màu. Cần thống nhất định nghĩa N3 (điểm 1 dưới).
2. **Chữ trong `kind_params`: ĐẠT.** Nhãn vẽ ra đều nằm trong cột chữ script (`Ô TRỐNG`, `AI LẤP Ô TRỐNG?`, `TIỀN VỆ`, `Ô THỨ HAI`, `CÙNG LAO RA`, `KHÔNG AI LẤP`, `GẦN BÓNG`, `GẦN Ô`, `ĐÃ LẤP`); các nhãn mô tả nội bộ đều ghi rõ "không vẽ chữ"; hết mã cảnh. Chữ không chép lời.
3. **Camera có mục đích và cách dựng: CHƯA ĐẠT hoàn toàn.** S02, S05, S08 đều nêu mục đích và cách dựng, nhưng S02 và S05 có chi tiết không dựng được đúng như khai (điểm 2, 3).
4. **S06 `process_animation`: ĐẠT.**

## Hồi quy
- 10 cảnh, line_id 01–16 khớp; lời đọc nguyên văn script (Lời 10 đúng "Lấp ô: gần ô, đừng gần bóng.").
- Thời lượng 3,3 + 4,3 + 5 + 6 + 8 + 6,4 + 6 + 6,9 + 6 + 5,8 = 57,7 s; opening S01–S02 = 7,6 s, ba pha khớp mốc.
- Chữ trên hình khớp script; `TRONG PHA NÀY` có ở S03; mỗi lúc một ô sáng mạnh (S05 ghi rõ).
- Cáo: S02 3,0 + S07 2,2 + S10 2,4 = 7,6 s ≈ 13%; dáng surprised/idea/thumbs_up có thật; đứng nói 1/10 cảnh.
- Trường bắt buộc, header_slot đổi ô, sound_cues có reason, renderer `pillow-ffmpeg` + lý do: đủ. Brief và luật tên nền tảng: sạch (không logo, tên đội/người, đồng hồ đếm, tên nền tảng).
- Lưu ý không chặn: số từ chữ minh hoạ ≈ 45 từ/57,7 s ≈ 47 từ/phút nếu tính cả nhãn lặp (S02 `Ô TRỐNG`, S04/S10 nhãn tên); không lặp thì dưới 45. Giữ nguyên.

## Bảng chấm
| Tiêu chí | Kết quả |
|---|---|
| 1 Show don't tell, visual-first | Đạt |
| 2 Đa dạng, R12 | Đạt có điều kiện (điểm 1) |
| 3 Khớp kịch bản, nhịp | Đạt |
| 4 Dựng được | Chưa đạt (điểm 2, 3) |
| 5 Schema | Đạt (chưa chạy Ajv, enum đối chiếu tay) |
| D8 | (a)(b)(c) đạt; (d) đạt sau điểm 1 |

## Điểm còn phải sửa
1. **N3 thiếu nhất quán (S06, S08, `visual_style_note`):** chọn một định nghĩa N3 thật khác N2 về bối cảnh/bố cục, không chỉ đổi mã màu. Gợi ý: N3 = cùng sân cỏ nhưng dùng cả hai cảnh với nền than/xanh tối tách hẳn N2 navy (đổi sắc N2 sang navy xanh lam rõ hơn, N3 xanh rêu tối), hoặc đổi S06 `environment` cho khớp S08 "thế sân xanh". Ghi nền theo cảnh vào `visual_style_note` kèm màu cụ thể của N2/N3.
2. **S05 pan_right không dựng được như khai:** ở zoom ≤ 1,1× khung crop rộng ≈ 982 px, biên dịch tối đa ≈ 98 px, nhưng khai dịch 120 px. Sửa: dịch ≤ 90 px, hoặc nâng zoom lên ≥ 1,15× (vẫn ≤ 1,3×); cập nhật `visual_concept`, `animation_timeline` t=3.21 và `environment` cho khớp.
3. **S02 push_in có thể cắt Cáo/tiêu đề:** push_in 1,15× hướng về ô đỏ (x=915) khiến cửa sổ crop bị chặn ở biên phải, cắt mép trái khung (Cáo ở x≈90–260). Sửa: ghi điểm neo zoom (vd neo ≈ giữa khung, x ≤ 70) hoặc dời Cáo vào trong x ≥ 160; nêu rõ phụ đề và tiêu đề `AI LẤP Ô TRỐNG?` (y≈260–380) vẫn nằm trong vùng an toàn sau crop; phụ đề vẽ sau zoompan, không bị phóng.

KẾT LUẬN: CẦN SỬA

Trạng thái `storyboard.json`: giữ `DRAFT` (chưa APPROVED). Còn một lượt sửa nhỏ (ba điểm trên, đều là chỉnh mô tả/số trong JSON).
