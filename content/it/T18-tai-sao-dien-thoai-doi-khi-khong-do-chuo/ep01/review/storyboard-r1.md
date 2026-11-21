# Review storyboard IT-T18-E01, vòng 1 (Claude, 21/11/2026)

Đối chiếu: `script.md` bản đã chốt (tổng ≈ 63,5 s), `storyboard.json` DRAFT (10 cảnh, 62,8 s, 1884 khung ở 30 fps, `pillow-ffmpeg`). Không chạy được Ajv (agent duyệt không có Bash); đã đối chiếu thủ công từng trường với `storyboard.schema.json` (enum scene_type, scene_kind, camera, transition, sound intent, voice_direction, text kind, header slot, kind_params) và không thấy lỗi schema. Producer/QC nên chạy lại `npm test --prefix studio` như thường lệ.

## Bảng chấm

| # | Tiêu chí | Kết quả | Ghi chú |
|---|---|---|---|
| 1 | Show, don't tell / Visual-first | Đạt, kèm góp ý | Mọi cảnh có minh hoạ thật (điện thoại, công tắc, chạc hai nhánh, thanh trượt, tile app). Mỗi cảnh có `semantic_plan` đủ keywords, relations, texts, hold_s. Không có nhãn "AI tạo"/"Ví dụ dựng". Vật chính 560–740 px. Chữ tách khỏi lời, gắn đối tượng. Góp ý 5 (chấm chương). |
| 2 | Đa dạng, nhịp, R12/R13 | Chưa đạt (S07) | 10 cảnh, trung bình 6,3 s/cảnh. Không có cảnh nào quá 2 liền cùng kind. S06–S08 liền nhau đều là thanh trượt nhưng khác cỡ (wide/medium/pov) và bố cục: chấp nhận, ghi cảnh báo. R4 ở 360×640 đạt: không khoảng nào > 1,6 s mà không đổi vật. Lỗi: S07 `complexity: high` nhưng `hold_after_voice_s` 1,5 s (< 2) và cảnh 7,5 s (< 8 s). |
| 3 | Khớp kịch bản | Đạt | Lời trong `voice_over` và `voice_direction` khớp từng chữ với script đã chốt (L01–L18). Mốc S00 khớp S01–S03 (Họp 2,05; công tắc 3,4; cyan 4,0; Không có 6,9; giữ 0,44). Tổng 62,8 s so với 63,5 s của script chỉ chênh S04 (6,0 so với 6,2) và S08 (7,0 so với 7,35): Producer tính lại sau TTS, không chặn. Đuôi im 0,6 s. |
| 4 | Dựng được | Đạt | `renderer_reason` giải thích đúng vì sao component Remotion không đủ (UiSimulation vẽ IDE, Explainer xếp hàng, DataViz là thanh số liệu). Mọi crop/pan ≤ 1,15× và có mục đích, đều làm được bằng `tools.motion.sequence.camera`/`zoompan`. Pose `sleep`, `surprised`, `shrug`, `idea`, `thumbs_up` đều có trong `brand/cao/poses`. Cáo không nhép miệng, ngón tay là silhouette độc lập. |
| 5 | Schema và trường bắt buộc | Đạt | Đủ `main_change`, `text_groups`, `quality_check.*`, `renderer`, `renderer_reason`, `complexity`, `main_idea`, `concepts`, `hold_after_voice_s`, `opening`, `header`. Không có đoạn tĩnh > 2 s nên không cần `hold_reason`. |
| 5b | D8 (R20–R23) | Chưa đạt (c) và (d) | (a) opening 8 s, ba pha, có lời hook: đạt. (b) header không `hidden_scenes`, S04–S12 đều có `header_slot` xen trái/phải: đạt. (c) 10/10 cảnh có texts, kinetic 3 lần (S00, S05, S07) cách nhau xa, ≤ 1/cảnh: đạt; nhưng tính từ/phút vượt trần (xem 2). (d) Cáo 21,3% vượt ≲ 15% (xem 3). |

## Cần sửa (vòng 1, theo thứ tự ưu tiên)

1. **S07 (High):** `hold_after_voice_s` phải ≥ 2,0 (đề nghị 2,5) và cảnh nên 8,5 s (R13, tiêu chí cảnh High 8–12 s ở chuẩn 45–75 s). Lùi `animation_timeline` giữ trạng thái hai thanh cuối cảnh. Có thể lấy lại 1 s từ S11 (hold 2,79 s sau lời dư) hoặc chấp nhận tổng ≈ 63,8 s (vẫn trong 45–75 s). Nếu muốn giữ 7,5 s thì hạ `complexity` về `medium` kèm lý do trong `main_idea`; không được để High mà giữ 1,5 s.
2. **Từ chữ trên hình/phút (R22: 20–45):** đếm từ `semantic_plan.texts`: ≈ 49 từ không kể tiêu đề, ≈ 53 kể cả tiêu đề, trên 62,8 s tức ≈ 47–51 từ/phút. Cắt xuống ≤ 42 từ không kể tiêu đề. Đề nghị: S09 giữ một nhãn (`BÁO THỨC VÀ LỜI NHẮC`, hoặc `TUỲ APP` gắn công tắc, không cả hai: bớt 4–5 từ); S07 `CHUÔNG & CẢNH BÁO` rút còn `CHUÔNG + BÁO THỨC` hoặc bỏ dấu `&` (không cắt `iOS 27: TÁCH ĐƯỢC`); S00 cân nhắc bỏ `IPHONE` nếu `IM LẶNG ≠ TẮT` đã gắn rãnh gạt (ghi lý do nếu giữ vì script yêu cầu nhãn nền tảng).
3. **Cáo ≲ 15% (D8d, R12):** hiện 13,4 s ÷ 62,8 s = 21,3% (S00 0–5,6; S05 2,4; S11 2,4; S12 3,0). Đề nghị: (a) Cáo rời ở 3,2 s của S00 vì cú cắt hông máy 1,14× không có chỗ cho Cáo và `character_action` đang tự mâu thuẫn ("xoay hướng mặt" mà mascot không xoay được; S03 chính diện cũng không có Cáo): tiết kiệm 2,4 s; (b) bỏ Cáo `idea` ở S11 (chỉ chỉ vào đồng hồ, không đổi nghĩa hình): tiết kiệm 2,4 s. Kết quả 8,6 s ≈ 13,7%: vẫn có Cáo ở mở, một nhịp chuyển ý (S05) và kết. Cập nhật `character_action`, `props`, `semantic_plan` (keyword "Cáo" của S00 chỉ còn sleep → surprised trong 3,2 s đầu), `talking_head_ratio` giữ 0 và ghi lại tỉ lệ vào `visual_style_note`. Nếu Codex muốn giữ S11 thì phải bỏ S05 và giải thích; planner đã ghi plan ≲ 25%, nhưng D8(d) áp trần 15% nên storyboard phải theo.
4. **Bảng chủ đề nền (D8d, R12):** thêm vào `visual_style_note` một dòng bảng chủ đề nền theo cảnh với tỉ lệ: phòng ngủ tối/sáng (S00, S12 ≈ 25%), lưới navy (S04, S06 ≈ 17,5%), tím đậm (S07–S09 ≈ 31%, ba cảnh liền, ≤ 4 nên đạt), xám sáng giao diện (S05, S10, S11 ≈ 27%). Xác nhận mỗi chủ đề ≤ 40%, ≤ 4 cảnh liền. Chủ đề này (cài đặt điện thoại) không phải phần mềm/CSDL nên không bắt buộc cảnh theme `code`.
5. **Bốn chấm chương không chữ ở header (visual_style_note):** là hình không có trong script/plan, và không có nghĩa người xem đọc được; Y1 yêu cầu không hình thừa. Bỏ, hoặc nêu lý do nhận diện được tiến độ (nếu muốn giữ phải có trong plan). Header chỉ cần dòng `BÁO THỨC / ÂM BÁO`.

## Góp ý nhỏ (không chặn, sửa cùng đợt nếu tiện)
- S04: cửa đỏ nhánh dưới chưa có nhãn nhưng lời nói "Chọn Không có": nên gắn lại nhãn `KHÔNG CÓ` đỏ vào cửa (2 từ) nếu còn dư ngân sách chữ sau mục 2; nếu không, ghi trong `main_change` rằng nhãn đã có ở S00.
- S08: `visual_concept` ghi mốc tuyệt đối "35,1 s"; nên đổi thành mốc trong cảnh (3,6 s) để khỏi lệch khi Producer tính lại sau TTS.
- S06–S08: ba cảnh liền đều là thanh trượt. Giữ vì mỗi cảnh một ý khác nhau (video, iOS, Android), nhưng đảm bảo khác khung dựng rõ ở 360×640 (chiều thanh ngang/dọc, màu nền navy/tím).
- S05: Cáo `shrug` 160 px = 14,8% chiều rộng, sát ngưỡng Y3 15–25%: nâng lên ≥ 165 px.

KẾT LUẬN: CẦN SỬA
