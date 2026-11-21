# Review storyboard IT-T19-E01 · vòng 1 (Claude, Đạo diễn hình ảnh)

Đối chiếu: storyboard.json (8 cảnh S00, S03–S09, 56,75 s), script.md đã DUYỆT, schema, component Remotion, mascot.md, chat-luong-xem.md.

| # | Tiêu chí | Kết quả | Ghi chú |
|---|---|---|---|
| 1 | Show don't tell, visual-first | Đạt | Mọi cảnh có minh hoạ thật; semantic_plan đủ (keywords→form/object/motion, relations, texts có mốc và đối tượng gắn). Chữ khớp cột "Chữ trên màn hình" của script (đã đối chiếu từng mốc: S00, S03–S09 đúng). Không logo Meta/Messenger, không người thật (Mít, chị Lan là silhouette), không cảnh ghép hồ sơ từng mảnh (S04 dùng hai hồ sơ đã tồn tại), không nhãn "Ví dụ dựng"/AI trên hình. Kinetic ở S00, S04, S07 (≤ 1/cảnh, không liền nhau) |
| 2 | Đa dạng, nhịp | Chưa đạt (sửa nhỏ) | Bối cảnh/chủ đề: office, incident, database, database, incident, security, security, office: ≤ 4 liền, mỗi chủ đề ≤ 40%, có cảnh theme `database` (code-like). Cỡ cảnh xen kẽ tốt. Lỗi: giữ sau lời S04 và S03 dưới chuẩn R13 (mục 1–2 bên dưới); S06 có khoảng 2,1 s không đổi gì (mục 3) |
| 3 | Khớp kịch bản | Đạt | Mạch tình huống → vấn đề → giải thích → xử lý → trả về bàn quán đúng Y5. Tổng 56,75 s trong 45–75 s. Cáo ≈ 11,4 s (≈ 20%): theo bản đồ Cáo đã duyệt ở script, dưới trần 25% của CLAUDE.md, trên ngưỡng thử R12 ≈ 15%: chấp nhận vì là mở/kết, không che sơ đồ; phải ghi vào notes.md |
| 4 | Dựng được | Đạt | `renderer: pillow-ffmpeg` kèm lý do cụ thể, phù hợp (hai điện thoại phối silhouette, thẻ hồ sơ và nối có điều kiện không có trong UiSimulation/Explainer/DataViz; nền tối cố định không đáp ứng Y4). Dáng Cáo `surprised`, `think`, `stop`, `thumbs_up` đều có trong `poses/`. Crop 1,1–1,15× trong giới hạn, có mục đích nêu rõ |
| 5 | Schema + D8 | Đạt (kiểm enum) | Enum keyword type/form, scene_kind, sound_cue (kể cả `silence` có `duration_s`), opening style/phase đều hợp lệ; có `main_change`, `text_groups`, `complexity`, `hold_after_voice_s`, `quality_check`. Opening 8 s ba pha có voice_line; header xuyên suốt, không hidden_scenes, mỗi cảnh sau opening có `header_slot`; ≥ 80% cảnh có texts (100%); mật độ chữ minh hoạ ≈ 38/phút (không tính thoại UI và tiêu đề) |

## Góc nhìn cần sửa (đánh số, chỉ rõ cảnh)

1. **S04 (High)**: `hold_after_voice_s` 1,77 s < chuẩn High ≥ 2,0–3,0 s (R13). Nâng ≥ 2,0 s (duration ≈ 8,75 s), cập nhật `hold_s`, `pause_after_s` dòng 07, mốc timeline cuối.
2. **S03 (Medium)**: giữ 0,98 s < 1,0 s. Nâng ≥ 1,0 s (duration ≈ 7,3 s); cập nhật `hold_s`, `pause_after_s` dòng 05.
3. **S06**: không có đổi hình trong 1,55 → 3,65 s (2,1 s, > 1,5 s, R4) và không có `hold_reason`. Thêm một đổi thật ở khoảng 2,7–2,8 s (ví dụ ảnh/tên thẻ dưới ngay sau tích vàng thứ nhất sáng thêm vòng và Mít gật lần hai) bám lời 10 "ảnh và tên quen" bắt đầu ≈ 2,76 s. Đồng thời **xoá câu dán nhầm từ S05** ở timeline 1,85 ("Nút Mít nổi lên; Cáo stop vào rìa rồi rời ở 3,78 s"): S06 không có Cáo (character_action rỗng, script ghi "Không") và không có nút Mít.
4. **S09**: header ở `top_right` trong khi vòng nút chuyển (đồng xu) cũng ở góc phải (xem script, quy ước đồ hoạ). Khai vị trí vòng xu dưới header ≥ 35 px như S07, hoặc đổi header_slot.
5. **S05**: Cáo `stop` ghi 2,85–3,78 s, script ghi 25,60–27,53 tức 1,85–3,78 s tương đối. Căn lại theo lời "kẻ gian có thể nhắn" (≈ 1,85 s) hoặc ghi lý do chênh; cập nhật tổng thời gian Cáo (storyboard.md nêu 11,38 s, cộng thực tế kiểm lại) và ghi vào notes.md rằng Cáo ≈ 20% là theo bản đồ đã duyệt.
6. Ghi chú không chặn: script đặt kinetic cho S03 (`HỒ SƠ KHÁC`) và S07; storyboard đặt ở S04 và S07 (tránh liền với kinetic của opening). Chấp nhận nếu S03 vẫn có cú lật thẻ làm điểm nhấn thay cho kinetic.

Không có điểm nào cần trả về Kịch bản.

KẾT LUẬN: CẦN SỬA
