**Bản sửa vòng 2 do Codex làm trên bản nháp Claude viết thay. Trạng thái `DRAFT`, chờ Claude duyệt.**

# Storyboard IT-T16-E01 · Ngân hàng ngừng 24 giờ: có tiền sao chưa trả được?

11 cảnh · 60,10 s · renderer `pillow-ffmpeg` · talking-head 0% · Cáo 9,1 s (15,1%). Lời đọc bám nguyên văn `script.md`; nhãn minh hoạ rút theo review vòng 1. Thời lượng theo "Cập nhật bản chốt vòng 1" của script (S04 6,65 s, mọi cảnh từ S05 dịch +0,7 s); bảng gốc của script là 59,40 s. Mọi mốc giây là mốc dự kiến theo lời, Producer canh lại theo TTS.

## Bảng cảnh

| Cảnh | Mốc toàn video (s) | Dài (s) | `scene_type` / `scene_kind` | Hình chính (SHOW) | Cáo | Header | Camera → chuyển |
|---|---|---:|---|---|---|---|---|
| S01 opening | 0,00–5,00 | 5,00 | object_interaction / ui_simulation | Quầy cơm: điện thoại quét ô QR, vòng quay rồi đổi vàng «Chưa xác nhận», khay cơm hiện đồng hồ cát; quầy mờ, tiêu đề bật | `think` 0,0–3,0 s | không (opening) | wide, push_in 1,00→1,10 → wipeleft |
| S02 | 5,00–9,50 | 4,50 | process_animation / animated_diagram | Ba cổng QR/App/ATM xanh lần lượt khép và đỏ, đồng hồ 24 giờ chạy, hàng người dồn trước cổng QR (khung bìa) | không | top | wide, static → cut |
| S03 | 9,50–14,70 | 5,20 | object_interaction / detail_focus | Điện thoại báo lỗi, cuốn sổ đứng yên rồi sáng; ba mũi tên từ ba cổng chạm sổ, dấu hỏi vàng | không | top_right | medium, static → fade |
| S04 | 14,70–21,35 | 6,65 | data_visualization / data_flow | Dòng chấm xanh từ cụm cổng chia vào ba khối lõi vô danh, số đếm 0→32, vòng ngày quay | không | top_right | wide, push_in 1,00→1,15 (5,0–6,65 s) → match_cut |
| S05 | 21,35–30,85 | 9,50 | process_animation / animated_diagram | Sơ đồ dọc: ba kênh sáng, gói hỏi vào lõi, bút ghi sổ, gói đáp quay ra, kênh vàng→xanh | không | top_right | medium, static → match_cut |
| S06 | 30,85–36,20 | 5,35 | comparison_scene / before_after | Lõi xám, ba kênh đỏ; hai ô «Ghi sai» (hai thanh lệch, đỏ) và «Dừng» (giữ nguyên, dấu kiểm) | không | top_right | wide, static → slideup |
| S07 | 36,20–41,70 | 5,50 | ui_simulation / step_by_step | Con trỏ treo trên nút Gửi; sổ từ một dòng xanh thành hai dòng, dòng 2 nét đứt đỏ | `stop` 0,0–2,5 s | top_left | medium, static → match_cut |
| S08 | 41,70–46,80 | 5,10 | object_interaction / detail_focus | Dòng lịch sử sáng xanh nối vào dòng sổ; hộp thông báo có khiên nối cùng dòng; vòng lấy nét | không | top_right | medium, static → fade |
| S09 | 46,80–51,80 | 5,00 | process_animation / animated_diagram | Khối chính và dự phòng; đường chung đứt đỏ, cả hai khối xám | không | top_left | wide, static → wiperight |
| S10 | 51,80–55,30 | 3,50 | object_interaction / ui_simulation | Về đúng khung S01: điện thoại hiện «Chưa xác nhận» tĩnh trong màn hình, con trỏ rời Gửi chạm tab lịch sử, Gửi mờ | không | top_right | wide, static → cut |
| S11 | 55,30–60,10 | 4,80 | comparison_scene / character_explanation | Hai thẻ lựa chọn «Bấm lại» / «Lịch sử» sáng lần lượt; đuôi im 0,6 s | `thumbs_up` 1,2–4,8 s | top_left | medium, static → fade |

Mạch: S01–S02 tình huống và hệ quả · S03–S04 câu hỏi mở được trả và quy mô · S05–S06 cơ chế và hệ quả · S07 sai lầm · S08–S09 xử lý và giới hạn · S10–S11 trả hook và mời bình luận.

## Tự kiểm (số đo từ chính `storyboard.json`, bằng `tools/scene-metrics.mjs` và đếm tay)

| Mục | Kết quả |
|---|---|
| Schema | `SCHEMA OK` (validator Ajv, vòng 2), `status: DRAFT` |
| Tổng thời lượng, số cảnh | 60,10 s (trong 45–75 s), 11 cảnh ≲ 60,1 ÷ 5; TB 5,46 s; không cảnh nào dưới 3 s |
| R13 | Cảnh High S05 9,50 s (≥ 8); Medium S04/S06/S07/S09 ≥ 5,00 s; Low ≥ 3,5 s. Giữ sau lời: S05 2,0 · S06 1,0 · S04 1,03 · S07 1,03 · S09 1,14 · các Low 0,6–2,35 (đủ ngưỡng) |
| Khái niệm mới | ≤ 1/cảnh; tối đa 2 trong 10 s |
| Lời đọc | 15 dòng khớp từng chữ cột «Lời đọc/phụ đề» của script (kiểm bằng mã); `voice_direction` L01–L15 theo bảng R24 |
| Chữ minh hoạ | 19 chuỗi khác nhau (23 lần hiện) trong `semantic_plan.texts`. S07 có chữ «Gửi» trên nút và S10 có «Chưa xác nhận» trong màn hình điện thoại. |
| Chữ cùng lúc | 10/11 cảnh có nhãn minh hoạ. S10 giữ chữ trạng thái trong UI. S04 rút nhãn nguồn còn «NAPAS 2025». |
| Mật độ chữ (R22) | **43,9 từ/phút** theo cách đếm của review (44 từ trong `semantic_plan.texts` trên 60,10 s). Cộng cả hai chuỗi UI vừa tách là 47,9 từ/phút. |
| Kinetic (R22) | 3 lần gồm S01 3,40 s (tiêu đề), S05 24,30 s («Hệ thống lõi») và S07 39,70 s («Lệnh 2»). Khe giữa các lần là 20,9 và 15,4 s. |
| Keyword có hình | 100% không `text_only` (45 keyword, 9 dạng hình khác nhau) |
| Cáo (Y2–Y3, R6) | 9,1 s ≈ 15,1%. Có mặt ở S01, S07, S11 với dáng tĩnh rộng 160–180 px và đáy ≤ 1290. |
| R12 nền | office 23,0 s (38,3%) · database 21,5 s (35,8%) · incident 10,5 s (17,5%) · security 5,1 s (8,5%); chuỗi liền dài nhất 3; không nền nào > 40% |
| Cỡ cảnh | wide, wide, medium, wide, medium, wide, medium, medium, wide, wide, medium: không quá 2 liền; `scene_kind` không lặp liền |
| Header (R21) | cảnh nào sau opening cũng có `header_slot` (top / top_right / top_left); không `hidden_scenes`; nội dung chính y≥420 để chừa vùng header y≈250–390 |
| Opening (R20, R26) | 5,00 s, có lời hook (lời 01 vào ở 0,60 s), kiểu `question`, ba pha 0,0–1,6–3,4–5,0 s, mỗi pha ≥ 0,25 s |
| R4 | Mọi khoảng giữa hai sự kiện trong `animation_timeline` ≤ 1,5 s; chỉ S05 có đoạn giữ 2,03 s, đã ghi `hold_reason` (điểm sáng chạy lại) |
| Âm thanh (R25) | `sound_cues` có `reason` từng cue; 6 cue `silence` có `duration_s`; đuôi im S11 0,6 s (≤ 0,7) |

## Thành phần phải vẽ riêng (R9)

Thư viện `tools/motion/` có `window`, `card`, `icon` (user, clock, check, cross, warning, shield, lock, server, database…), `status_indicator`, `badge`, `cursor`, `flow`, `charts.counter`, `kinetic`, `header`, `sticker`, nền dự phòng office/server/warning/neutral. Nền ngữ cảnh office/database/incident/security lấy từ `tools/backgrounds/make_background.py` làm lớp ảnh dưới đồ họa. **Chưa có** và phải tự vẽ bằng Pillow trong `assets/_scratch/visual.py`: điện thoại và các trạng thái màn hình, ô QR hình học, quầy cơm/khay cơm/hơi nóng/đồng hồ cát, ví, hình khối người và thu ngân, ba cổng trượt có đèn, vòng đồng hồ 24 giờ có kim, cuốn sổ ghi số dư (mở, dòng kẻ, bút), khối lõi có sổ, hộp thông báo có khiên, khối chính/dự phòng với đường chung, thẻ lựa chọn có icon. `render_scene_kind` của thư viện chỉ hiểu `app` = dialog/browser/terminal/ide và đạo cụ browser/server/document/packet; vì vậy `scene_kind` ở các cảnh có điện thoại/sổ/cổng là nhãn dàn dựng và Producer không được gọi nguyên `app: "phone"` (sẽ lỗi). Các giá trị `object` là `gate`, `phone`, `ledger`, `card` trong `kind_params` dùng để mô tả đạo cụ tự vẽ, cần dựng bằng mã của tập. Rủi ro lớn nhất của bản này là khối lượng đạo cụ vẽ riêng (S01/S10, S02, S03, S05, S07, S08).

## Chỗ khác với script/plan hoặc phải đoán (nói thật)

1. **Thời lượng 60,10 s thay vì 59,40 s:** theo "Cập nhật bản chốt vòng 1" của script và `review/script-r1.md` (S04 6,65 s, S05+ dịch +0,7 s). Mốc nội cảnh của S04 dịch theo lời 05 dài thêm (số đếm vào ở 3,40 s thay vì 2,70 s); S09 hiện «Điểm chung» ở 1,90 s thay vì 1,40 s vì lời 13 dài thêm ≈ 0,7 s.
2. **Hai nhãn hiện muộn hơn script để không đi trước lời (R16):** «Ghi sai» ở 3,70 s thay vì 2,95 s (lời «ghi sai» ở ≈ 3,65 s); «Sổ» ở 3,80 s thay vì 2,60 s (lời «cuốn sổ» ở ≈ 3,9 s).
3. **«32 triệu / ngày» dùng `fade` + bộ đếm, không kinetic** (script ghi «kinetic nhẹ»): S04 liền S05, mà S05 «Hệ thống lõi» đã kinetic và R22 cấm hai cảnh liền. Ngoài kinetic của script ở S05 và tiêu đề S01, giữ kinetic S07 «Lệnh 2». S10 dùng trạng thái tĩnh trong điện thoại.
4. **Opening không có nhãn chủ đề riêng; header một dòng, không `title`:** script chỉ liệt kê tiêu đề opening và dòng header. Nếu cần nhãn chủ đề opening thì dùng đúng chuỗi header; nếu `HeaderSpec` đòi `title` thì để rỗng, đừng thêm chữ.
5. **Pha `topic_reveal` kết thúc ở 5,00 s** (script ghi 4,95 s) để ba pha liền nhau và phủ hết opening.
6. **S10 hiện «Chưa xác nhận» trong màn hình điện thoại** bằng chữ tĩnh từ 56 px, chia hai dòng nếu cần. S07 giữ «Gửi» trên nút trong UI.
7. **S06 dùng thanh màu thay cho "số":** script ghi «hai số không khớp»; ở đây là hai thanh số dư lệch nhau, không chữ số (Y1).
8. **S04 «ba khối lõi xếp ngang» và «cổng phía trái»:** diễn giải là cụm cổng thu nhỏ ở trên trái, ba khối xếp ngang ở dưới; chấm chảy từ trên xuống.
9. **Ánh xạ `voice_direction` sang enum của schema** (ví dụ «Bối rối, hơi gấp» → `concerned`, `brisk`; «Khẩn, ngắn» → `alert`) là cách diễn giải của người viết; `pause_after_s` của L13 là 1,14 s (không phải 1,84 s) vì lời 13 dài thêm.
10. **S02 nền `office`** theo bảng nền của plan (S01–S03 cùng `office`), dù script không nêu nền cho S02.
11. **S08 dòng Lệnh 2** đổi từ đỏ (S07) sang vàng nét đứt (chưa xác nhận) để khỏi gợi ý đã có kết quả.

## Điểm đối chiếu cho Claude

- **Keyword chưa có nhãn:** «có tiền» (ví nhỏ ở S01) được lời gọi tên nhưng script không có chữ; giữ vì Y1 (không chữ thừa). Tương tự «báo lỗi» (dấu lỗi ở S03) được khai `result`.
- Cả 11 cảnh đều có minh hoạ cụ thể.

## Chưa kiểm

Chưa có bản dựng nên chưa xem được ở 360×640 (đọc được chữ, vật chính ≥ 560 px, đổi hình nhìn ra), chưa đo bbox thật (`HeaderTrack`, `find_overlaps`), mốc lời chỉ là dự kiến theo script (chưa TTS), phát âm QR/ATM/NAPAS/«hai không hai lăm» chờ giám đốc nghe. Các cụm bố cục (toạ độ trong `environment`) là hướng dẫn gần đúng, Producer đo và chỉnh khi dựng.
