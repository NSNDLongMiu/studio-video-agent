Bản nháp do Claude viết thay Codex (giám đốc ra lệnh 21/11/2026; Codex lỗi sandbox chỉ-đọc). `status: DRAFT`: chưa duyệt, chỉ Claude (vị trí Đạo diễn hình ảnh) được đặt `APPROVED` sau khi review. Chưa dựng thử khung nào; mọi số đo dưới đây tính từ `storyboard.json`, không phải từ bản dựng.

# IT-T17-E01 · Đôi giày chưa từng tìm · storyboard vòng 1

- Chuẩn 45–75 s: **67,6 s**, đúng ngân sách `script.md`. **10 cảnh** (S01 là opening gộp S01+S02 của script; xem mục "Chỗ phải đoán"), trung bình 6,76 s/cảnh, ngắn nhất 3,6 s (S04).
- Renderer: `pillow-ffmpeg` (lý do chi tiết ở `renderer_reason`). Header `BẢO MẬT / QUẢNG CÁO` từ S03 đến S11; trong opening là nhãn chủ đề của tấm tiêu đề.
- Cáo 10,1 s ≈ 14,9% (S01 0–4,7 s · S06 2,6–4,4 s · S11 0,2–1,8 s và 6,3–8,3 s), `talking_head_ratio` 0.

## Bảng cảnh (1 dòng/cảnh)

| Cảnh | Giờ (s) | Loại (`scene_type` / `scene_kind`) | Hình chính và thứ đổi (nhìn ra ở 360×640) | Chữ trên hình (kinetic = K) | Cáo | Header | Camera | Chuyển |
|---|---|---|---|---|---|---|---|---|
| S01 opening (= S01+S02) | 0,00–6,90 | object_interaction / before_after | Bàn ăn nhìn từ trên: bong bóng giày tan giữa không khí, điện thoại không nối gì mà sáng và hiện thẻ quảng cáo giày; cận: thanh tìm trống, micro viền đỏ + mũi tên nguồn; tấm tiêu đề cuối | NGHE LÉN? (K, 4,65–5,45); tiêu đề ĐÔI GIÀY CHƯA TỪNG TÌM + nhãn chủ đề (5,45–6,90) | surprised 0–2,9 → think 2,9–4,7 (≈ 1,5× nguồn) | không (opening) | wide, push_in 1,00→1,25× | cut |
| S03 | 6,90–13,90 | process_animation / animated_diagram | Hai làn từ điện thoại: micro → quảng cáo đứt giữa chừng, khay bằng chứng trống; chuỗi chấm cyan vòng qua micro tới thẻ quảng cáo, micro mờ | MICRO (1,2–6,6) | không | top_left | medium, static | circleopen |
| S04 | 13,90–17,50 | ui_simulation / data_flow | Màn hình điện thoại cận: xem clip và thích trang, mỗi việc rơi một chấm cyan vào ngăn "dấu vết" | DẤU VẾT (0,7–3,5) | không | top_left | close_up, static | match_cut (ngăn đứng nguyên) |
| S05 | 17,50–22,70 | ui_simulation / step_by_step | Trang cửa hàng thể thao: mảnh bộ đếm nhả chấm thứ ba vào ngăn; trang đóng thành khung ma, ba chấm còn | BỘ ĐẾM (1,45–5,1) | không | top_right | medium, static | fade |
| S06 | 22,70–30,70 | process_animation / animated_diagram | Nền dữ liệu: ngăn ba chấm trượt vào, từng chấm bay vào thẻ hồ sơ (cao ≈ 570 px), thẻ "chạy bộ" viền vàng, thanh tìm trống cạnh hồ sơ, mũi tên nguồn cyan | HỒ SƠ (K, 2,3–7,9) · CHẠY BỘ (3,2–7,9) | point_right 2,6–4,4 (≈ 160 px) | top_left | wide, static | wipeleft |
| S07 | 30,70–35,70 | process_animation / data_flow | Bảng chọn nhà bán: con trỏ bấm ô nhóm, thẻ quảng cáo bay sang điện thoại (đúng vị trí S01), viền vàng nét đứt, mũi tên nguồn nối nhóm | NHÓM (0,95–4,9) | không | top_right | medium, static | slideup |
| S08 | 35,70–45,70 | data_visualization / before_after | Bàn nghiên cứu: lưới 36 ứng dụng Android, vạch quét, micro đều tắt, khung xanh lá; vùng ngoài khung xám có dấu hỏi | NORTHEASTERN 2018 (0,5–9,9) · 17.000+ (3,0–9,9) · CHỈ ANDROID (K, 7,6–9,9) | không | top_left | wide, static | wiperight |
| S09 | 45,70–54,20 | object_interaction / detail_focus | Phòng họp: slide chào bán có tai-micro, dấu đóng vàng hạ xuống, hộp bằng chứng kỹ thuật trống, nét nối vươn ra rồi rụt lại | NGHE CHỦ ĐỘNG (3,95–8,4) · LỜI CHÀO BÁN (5,6–8,4) | không | top_right | medium, push_in 1,00→1,08× | fade |
| S10 | 54,20–59,30 | ui_simulation / ui_simulation | Màn hình cài đặt: bấm ba chấm trên thẻ quảng cáo → menu → danh sách sở thích, thẻ "chạy bộ" sáng cyan (khớp S06) | TÙY CHỌN QUẢNG CÁO (0,75–4,2) | không | top_left | close_up, static | cut |
| S11 | 59,30–67,60 | metaphor_animation / animated_diagram | Bàn ăn như S01: thẻ giày sáng giữa hàng thẻ mờ, thẻ mờ tan, mũi tên nguồn chia ba nhánh dấu hỏi nhấp nháy, bong bóng rỗng mời trả lời | TRÙNG ≠ BẰNG CHỨNG (K, 3,0–8,2) | bow 0,2–1,8 · thumbs_up 6,3–8,3 (≈ 170–180 px) | top_right | wide, static | cut |

Mốc giây trong JSON (`animation_timeline`, `semantic_plan.texts`, `sound_cues`) tính từ đầu từng cảnh; mốc lời ước tính theo 0,2326 s/âm tiết trong khung lời của script. Producer căn lại theo đo TTS.

## Đối chiếu luật (tự kiểm trên JSON)

| Luật | Kết quả |
|---|---|
| D1 thời lượng, R13 số cảnh | 67,6 s; 10 cảnh ≤ 67,6/5; cảnh < 3 s: không có (opening 6,9 s) |
| R13 thời lượng tối thiểu theo độ phức tạp (3/5/8 s) | đạt cả 10 cảnh |
| R13 giữ sau lời (0,5/1,0/2,0 s) | đạt trừ **S06 (High): 1,77 s < 2,0 s** (số của script); S08 0,98 s và S09 0,97 s theo mốc lời ước tính, sai số ±0,03 s |
| R13 cửa sổ 10 s ≤ 2 khái niệm mới | **không đạt nhẹ**: 12,7–22,7 s = 2,17 (S03, S04, S05 mỗi cảnh 1 khái niệm theo script) |
| R4 mọi khoảng ≥ 1,5 s có ≥ 1 mốc đổi hình | khoảng lớn nhất giữa hai mốc 1,30 s (S05); không cảnh nào cần `hold_reason` > 2 s; tĩnh thật chỉ ở opening trước 0,38 s |
| R6/Y2/Y3 Cáo | 14,9%; mở/giữa/kết; cỡ giữa/kết 160–180 px = 14,8–16,7% khung; đáy ≤ y 1290; dáng đổi cách ≥ 2 s |
| R12 nền | 5 nền: Bàn ăn 22,5% · Màn hình điện thoại 30,9% · Nền dữ liệu 19,2% · Bàn nghiên cứu 14,8% · Phòng họp 12,6%; chuỗi liền dài nhất 3 cảnh (S03–S05); không nền nào > 40% |
| R12 cỡ cảnh/camera | wide/medium/close_up không hai cảnh liền cùng cỡ; camera chỉ S01 và S09 (có lý do, zoom ≤ 1,25×) |
| R14/R20 opening | một cảnh `S01`, 6,9 s, ba pha 2,90 / 2,55 / 1,45 s, có lời hook, tiêu đề do text engine vẽ hiện 1,45 s |
| R21 header | S03–S11 đều có `header_slot` (top_left/top_right luân phiên); nội dung bắt đầu y ≥ 408 để chừa ô; không `hidden_scenes` |
| R22/R17 chữ minh hoạ | 30 từ = 26,6 từ/phút (20–45 ✓); 10/10 cảnh có chữ (opening có NGHE LÉN?); ≤ 8 từ cùng lúc (tối đa 6, S09); tối đa 3 nhóm (chỉ S08); kinetic 4 lần (S01 4,65 s · S06 25,0 s · S08 43,3 s · S11 62,3 s): cách nhau ≥ 18 s, không hai cảnh liền, khoảng ≤ 20,4 s; keyword có hình 100% |
| Y1 | mọi chữ trên hình đều có trong cột chữ của script (16/16 mục kể cả tiêu đề và header); không nhãn AI/ví dụ dựng; `text_overlay` không chép lời |
| R11 bằng chứng hình | hook: bong bóng tan, không dây (S01); mũi tên nguồn đổi 5 trạng thái: đỏ (S01) → vàng nét đứt (S03) → cyan (S06) → vàng nét đứt nối nhóm (S07) → ba nhánh dấu hỏi (S11), trả đúng điện thoại và thẻ giày của S01; trước/sau và đúng/sai: S03, S08, S11 |
| R24/R25 | `voice_direction` đủ 19 dòng (cụm nhấn kiểm là nguyên văn lời); 27 `sound_cues`, 2 khoảng lặng có `duration_s` (S03 0,5 s, S11 0,55 s); nhạc tắt |
| Schema | `SCHEMA OK` (validator Ajv của renderer-remotion) |

## Giới hạn và điều CHƯA KIỂM (nói thật)

- **Chưa dựng, chưa xem khung nào**: tọa độ bố cục (bbox, y ≥ 408, đáy Cáo 1290, vật chính ≥ 560 px) là ước lượng thiết kế; chưa đo trên chữ vẽ thật. Đọc được ở 360×640, 180×320, khe ≥ 24 px giữa nhãn và vật, Cáo 1,5× nguồn có mềm không: CHƯA KIỂM, QC đo sau dựng.
- **Component thật**: thư viện `tools/motion` không có điện thoại, micro, kính lúp, đôi giày, tai, con dấu, dấu hỏi, lưới ứng dụng, slide, bàn ăn, phòng họp, silhouette; Producer phải tự vẽ bằng Pillow (khối lượng vẽ lớn, nên coi là rủi ro tiến độ). `render_scene_kind` và `opening_sequence` của thư viện không dùng nguyên bản được cho video này; `scene_kind`/`kind_params` chỉ khai cách tổ chức và mốc giây, nhãn trong đó là tên nội bộ không vẽ lên hình. Chi tiết ở `renderer_reason`.
- **Cáo là sticker tĩnh**: không quay đầu, không nhép miệng; "nhìn thẻ" thể hiện bằng vị trí và nhịp nảy. Phóng 1,5× ở opening làm hơi mềm (đã ghi ở `docs/mascot.md`).
- Phát âm, nhịp nghỉ, âm thanh: CHƯA KIỂM — giám đốc nghe. Các ô `quality_check` là tự chấm khi thiết kế.
- `qc-measure` có thể cảnh báo: `keywords_without_text` cho "nhà bán" (S07), `label_read_time` nếu TTS lệch, và 1 "chữ lặp lời" ở S10 (xem đề nghị 8).

## Chỗ phải đoán (thiếu thông tin hoặc luật mâu thuẫn)

1. **Opening gộp thành một cảnh `S01` (6,9 s)** thay vì giữ S01 và S02 riêng: `scene-metrics.checkOpening` đòi đúng một cảnh `role: opening` ở đầu và `cuesheet.py` lấy `opening.scene_id` làm cảnh opening; script ghi `role: opening` cho cả hai cảnh. Tổng thời lượng không đổi. Nếu Claude muốn giữ 11 cảnh như script thì Producer phải tự gộp S01+S02 khi dựng opening (`opening.scene_id`/`duration_s` đang mô tả đúng khối 6,9 s này).
2. **Tiêu đề opening dời** từ 0,10–2,85 s (cột chữ của script) sang pha cuối 5,45–6,90 s: opening dựng theo thứ tự hook → conflict → topic_reveal, tiêu đề đè lên hook sẽ che hình hook; 1,45 s đúng bằng thời gian đọc tối thiểu 0,35 + 0,22×5 từ. Không đổi chữ.
3. **Cáo ngắn hơn bản đồ Cáo của plan** (14,9% so với 21%) vì mẫu review của visual-director đặt Cáo ≲ 15% (R12) trong khi Y2 chỉ đòi ≲ 25%; cửa sổ Cáo mới nằm gọn trong các cửa sổ của plan (S02 chỉ đến 4,7 s thay vì 6,9 s; S06 1,8 s; S11 1,6 s và 2,0 s).
4. **Mốc xuất hiện của nhãn** dịch tối đa 0,8 s so với cột chữ của script để đi cùng hoặc sau từ được nhắc (theo ước tính âm tiết): MICRO 8,10 s (script 7,30), CHẠY BỘ 25,90 (25,60), NHÓM 31,65 (31,10), 17.000+ 38,70 (38,30), NGHE CHỦ ĐỘNG 49,65 (49,20), LỜI CHÀO BÁN 51,30 (50,70), NGHE LÉN? 4,65 (4,50); NGHE LÉN? tắt lúc 5,45 s thay vì 6,85 s để nhường tấm tiêu đề.
5. **S04**: nút thích sáng ở thẻ trang thể thao (lúc "thích trang"), không ở clip như script, để hình đi cùng lời.
6. **S09**: biểu tượng lịch không chữ thay cho "năm hiện" (cột chữ của script không có 2024).
7. Bìa (R7) lấy khung ≈ 4,8 s với micro viền đỏ (script); `plan.md` ghi micro vàng. Bảng nền % trong `plan.md` lệch số tính lại (Bàn ăn 22,5%, màn hình điện thoại 30,9%).
8. Tọa độ, kích thước và tên vật là do tôi chọn; `kind_params` có thêm khoá tự do `drawn_by` (schema cho phép `kind_params` là object tự do) và cấp storyboard có `authored_by` (schema không cấm trường thêm).

## Đề nghị sửa kịch bản / ngân sách (cho Claude quyết; không tự đổi script)

Không có cảnh nào thiếu minh hoạ thật vì lời mơ hồ (0/10 cảnh), nên không cần trả về Kịch bản bắt buộc. Các điểm lệch luật sau nằm ở số liệu của script:

1. **Lời 01 vào ở 0,15 s < 0,6 s** (`opening.voice_start_min_s` trong `tools/config/pipeline-rules.json`): `checkOpening.voice_ok` sẽ rớt. Sửa không đổi tổng: dời lời 01 sang 0,65–2,51 s và rút khoảng nghỉ sau lời 01 từ 1,0 s còn 0,49 s (lời 02 vẫn vào 3,00 s). Hình dịch theo: bong bóng 0,88 s, thẻ quảng cáo 1,75 s (vẫn trong 2 s đầu).
2. **S06 (High) giữ 1,77 s < 2,0 s**: bù 0,25 s từ giữ của S07 (1,83 → 1,58 s, vẫn ≥ 1,0) hoặc S10 (1,9 → 1,65 s); tổng không đổi.
3. **Cửa sổ khái niệm 12,7–22,7 s = 2,17 > 2**: có thể khai `concepts` S05 = 0 vì "bộ đếm" là cách một dấu vết được ghi (cùng khái niệm với S04).
4. **S07 "nhà bán"** được gọi tên mà cột chữ không có nhãn: đề nghị thêm nhãn NHÀ BÁN (2 từ) gắn bảng chọn, hoặc chấp nhận cảnh báo.
5. **S10 nhãn TÙY CHỌN QUẢNG CÁO (4 từ) trùng nguyên cụm lời 16**: `qc-measure` sẽ tính 1 chữ lặp lời; đề nghị rút còn "TÙY CHỌN" hoặc chấp nhận.
6. Header trong script ở S01–S02 (0–6,9 s): thay bằng nhãn chủ đề của tấm tiêu đề (xem đề nghị "chỗ phải đoán" 1–2); nếu giám đốc muốn header hiện suốt cả opening thì cần đổi luật hoặc cột chữ.
