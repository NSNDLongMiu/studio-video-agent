Bản nháp do Gemini (mô hình gemini-3.8-flash-high) viết thay Codex (giám đốc duyệt, 2026-11-21). Chỉ Claude (visual-director) review và đặt APPROVED.

# Storyboard BONG-DA-T25-E01 · Bàn bị gạt vì cái tay? (DRAFT vòng 2)

- **video_id**: BONG-DA-T25-E01 (ep01) · Phòng Bóng Đá · Đội 1 (team_id 6)
- **Status**: DRAFT (chờ Claude review & duyệt)
- **Renderer**: `pillow-ffmpeg` (vẽ khối/mặt nạ Pillow, tools/motion, FFmpeg ghép)
- **Tổng thời lượng**: 57,0 s (khớp 100% script.md) · 9 cảnh (S00 opening 7,8 s + S03–S10)
- **Tỉ lệ có Cáo**: 7,25 s / 57,0 s ≈ 12,7% (đạt D8(d) ≲ 15%, Y2 < 25%) · Cáo chỉ xuất hiện ở S00 (3,00 s) và S10 (4,25 s)
- **Header**: `BÓNG ĐÁ / VIỆT VỊ` xuyên suốt từ S03 đến S10 (xoay ô top_left, top, top_right; không ẩn)

## Bảng tóm tắt cảnh (1 dòng / cảnh)

| Cảnh | Thời lượng | scene_type · scene_kind | Bối cảnh (environment) | Đổi chính (main_change) | Chữ trên màn hình | Cáo |
|---|---|---|---|---|---|---|
| S00 | 7,8 s (0,0–7,8) | `environment_scene` · `problem_cause_consequence` | N1 (sân trên cao) 0–3 s → N3 (phòng xem) 3–7,8 s | Cờ giơ bên bóng vào lưới; cắt sang màn hình giữa 2 phe giơ icon trái nghĩa | `VIỆT VỊ?` (1,2–3,0 s, kinetic), `TAY QUA VẠCH?` (5,0–7,8 s) | `think` (3,15–6,15 s, 170 px) |
| S03 | 5,0 s (7,8–12,8) | `process_animation` · `step_by_step` | N2 (bản đồ cơ thể navy) | Xanh lần lượt khóa đầu, thân, chân; xám quét từ bàn tay lên dừng đúng đáy nách | Header `top_left`, `ĐƯỢC TÍNH` (1,25–5,0 s), `KHÔNG TÍNH` (2,6–5,0 s) | Không |
| S04 | 8,0 s (12,8–20,8) | `cinematic_close_up` · `detail_focus` | N2 (cận nửa thân, zoom 1,12×) | Từ góc nách, đường cam quét ngang, vai sáng xanh; cánh tay duỗi dài vẫn giữ xám | Header `top`, `ĐÁY NÁCH` (0,3–8,0 s, kinetic), `VAI` (1,9–3,4 s), `CÁNH TAY` (3,4–8,0 s) | Không |
| S05 | 3,8 s (20,8–24,6) | `metaphor_animation` · `data_flow` | N2 (gôn trái, hình người 600 px phải cân đối) | Bóng chạm lưới, nhánh tỏa tới đầu, vai, thân, chân xanh; bỏ qua nhánh tay xám | Header `top_right`, `CÁCH NHỚ` (0,2–3,8 s) | Không (bỏ Cáo theo review r1) |
| S06 | 6,6 s (24,6–31,2) | `object_interaction` · `animated_diagram` | N1 (sân trên cao, cận tiền đạo và vạch) | Tay vươn xa qua vạch; vòng đoán rút; phần thân xanh sau vạch, tay xám bị gạch | Header `top_left`, `KHÔNG VIỆT VỊ` (4,0–6,6 s, chip xanh dương) | Không |
| S07 | 7,4 s (31,2–38,6) | `comparison_scene` · `before_after` | N1 (cận vai zoom 1,15× → 2 ô dọc từ 6,45 s) | Tay ép sát thân; chỏm vai nhô qua vạch nhận chip đỏ; đối chiếu 2 ô dọc cuối cảnh | Header `top`, `VỊ TRÍ VIỆT VỊ` (4,4–7,4 s, kinetic), `KHÔNG VIỆT VỊ` (6,45–7,4 s) | Không |
| S08 | 6,2 s (38,6–44,8) | `comparison_scene` · `before_after` | N4 (sáng ngà, 2 mannequin áo cộc và áo dài) | Gấu tay 2 áo lệch mức; một đường cam ngang quét chung qua cả 2 đáy nách cùng mức | Header `top_right`, `MÉP TAY ÁO` (1,4–6,2 s), `ĐÁY NÁCH` (3,9–6,2 s) | Không |
| S09 | 5,8 s (44,8–50,6) | `environment_scene` · `problem_cause_consequence` | N1 (quay lại tọa độ toàn cảnh S00) | Tua về lúc chuyền; thẻ tay về xám, đầu thân chân xanh sau vạch; cờ hạ, chip xanh | Header `top_left`, `KHÔNG VIỆT VỊ` (4,4–5,8 s, chip xanh dương) | Không |
| S10 | 6,4 s (50,6–57,0) | `object_interaction` · `detail_focus` | N3 (phòng xem, hình người giữa, 2 khán giả) | Lấy nét vai rồi tay; vạch cyan bị gạch chéo mờ; vai giữ sáng, tay nhạt dần | Header `top`, `VAI HAY TAY?` (2,4–6,4 s, kinetic chữ chốt) | `idea` (0,15–2,40 s) & `thumbs_up` (4,40–6,40 s) |

## Thay đổi vòng 2 (sửa theo review r1 của Claude)

1. **S00 — Mốc vào lời hook ≥ 0,6 s:** Cập nhật `voice_direction` L01 (`pause_before_s: 0.6`, `pause_after_s: 0.15`), L02 (`pause_before_s: 0.15`) để lời mở vào đúng 0,60 s (tuân thủ `pipeline-rules.json`), L02 giữ mốc bắt đầu ≈ 3,15 s. Cờ đỏ bật ở 1,20 s khớp đúng từ "bàn bị gạt". Toàn bộ timeline S00 và tổng thời lượng 7,8 s giữ nguyên; ghi rõ mốc lời vào 0,60 s trong `phases[0]` và `animation_timeline`.
2. **S05 — Bỏ Cáo để đạt ngưỡng Cáo ≲ 15% (D8(d)):** Xoá Cáo khỏi S05 (`character_action: ""` và dọn Cáo khỏi `environment`, bố cục lại gôn và hình người cân đối). Tổng thời lượng Cáo giảm còn 7,25 s / 57,0 s ≈ 12,7% (chỉ còn ở S00 và S10).
3. **S09 — Đổi `scene_kind` tránh 3 cảnh liền `before_after`:** Đổi S09 sang `problem_cause_consequence` với `kind_params` gồm `problem` (bóng trong lưới), `cause` (thẻ tay chuyển xám, đầu thân chân xanh sau vạch), `consequence` (cờ hạ, chip xanh dương). Đặt lại `repeats_previous_kind: false` ở S09.
4. **S04 — Bổ sung `hold_reason`:** Thêm lý do giữ tĩnh 2,67 s (> 2 s, mức High): "Giữ sơ đồ hoàn chỉnh 2,67 s (High): đáy nách, vai xanh, tay xám duỗi xa để so sánh trước khi sang cách nhớ; đốm sáng chạy dọc đường cam giữ mắt."
5. **S07 — Cải thiện hiển thị nhãn so sánh:** Cho khung 2 ô dọc vào sớm từ 6,45 s và nhãn `KHÔNG VIỆT VỊ` ở ô trên hiện từ 6,45–7,4 s (hiện 0,95 s ≥ 0,95 s) giúp người xem đọc rõ ở 360×640; giữ nguyên `hold_after_voice_s: 1.0`.
