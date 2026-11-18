# Review Storyboard — vòng 1 (N = 1) — IT-T3-E01 "Archive và Partition trong SQL là gì?"

- Người review: Claude (`visual-director`, vị trí Đạo diễn hình ảnh). Người làm: Codex.
- Đã đọc toàn văn: `ep01/storyboard.json`, `storyboard.md`, `script.md` (đã duyệt), `concept.md`, `plan.md`, `review/script-r2.md`, "Phán quyết cuối" trong `debate.md`, `studio/schema/storyboard.schema.json`, `docs/mascot.md`, `ffmpeg-recipes.md`. Xem trực tiếp ảnh `think`, `point_right`, `clipboard`; Glob xác nhận cả 7 file dáng Cáo tồn tại. Không có công cụ kiểm schema trong phiên này nên kiểm tay từng trường bắt buộc và enum.

## Bảng chấm

| # | Tiêu chí | Kết quả | Ghi chú chính |
|---|---|---|---|
| 1 | SHOW, DON'T TELL | **Đạt** (cảnh 2, 7 mức vừa) | 8/8 cảnh có sơ đồ trạng thái thật (đường chia, một ô sáng, mười hai ô sáng, thẻ trượt, bộ đếm, mũi tên, chạy lại). Cảnh 3, 4, 5, 6, 8 mạnh. Cảnh 2 chỉ là đường chia dày lên (khá nhẹ). Cảnh 7 vốn là cảnh chip chữ trên sơ đồ giữ nguyên theo kịch bản đã duyệt, không phải lỗi storyboard. |
| 2 | Đa dạng | **Đạt** | Cỡ cảnh wide/medium/medium/wide/medium/wide/medium/wide, không quá 2 liên tiếp. `character_acting` 0%, talking-head 0%. Transition theo nội dung (wiperight chỉ mở hộp bên phải). Thành thật: khác biệt camera chỉ 2-8% nên đa dạng thật đến từ trạng thái sơ đồ, chấp nhận vì `plan.md` chọn một sơ đồ liên tục. |
| 3 | Khớp kịch bản | **Đạt** | Lời 8/8 cảnh khớp từng chữ với `script.md`. 3+6+5+4+6+4+4+7 = 39 s, 90+180+150+120+180+120+120+210 = 1170 frame. Mọi `t` cục bộ nằm trong khung cảnh, đổi toàn cục đúng 5.8 / 20.5 / 26 / 30 / 33 / 35 / 37. Chữ nhãn đúng danh sách, mọi nhãn ≤ 4 từ. Sáu lần đổi dáng 3/9/14/18/28/32, không đổi tại 24. |
| 4 | Dựng được | **Đạt có điều kiện** (đã xử lý ở mục sửa nhỏ) | Chỉ dùng 7 dáng có thật, ảnh nguồn cao khoảng 330-345 px nên thu xuống 300 px không phải upscale. overlay `eval=frame`, `zoompan` một ảnh/cảnh `d` đúng số khung, camera chỉ là crop/scale ảnh phẳng, đều trong khả năng engine và tự ghi "recipes mục 9 chưa xác minh". Hình học đã kiểm: ô gốc 147.5x100, tâm T11 (468.75,870) đúng, khe 690-730 đúng, scale 1.02 neo (540,920) cho mép 91-989 đúng. Có vài chỗ mơ hồ hoặc không thực hiện được, đã sửa ở S1-S6 dưới đây. |
| 5 | Đúng schema | **Đạt** | Đủ `video_id`, `status`, `scenes`; mỗi cảnh đủ 15 trường bắt buộc; `scene_type` (process_animation / data_visualization), `camera.shot`/`movement`, `transition` (match_cut / cut / wiperight) đều thuộc enum; `props` và `sound_effects` là mảng chuỗi; `animation_timeline` có `t` số và `event`; `quality_check` đủ 3 boolean. |

## Kiểm các điểm điều phối yêu cầu

1. **Khớp script từng cảnh:** đạt, chi tiết ở tiêu chí 3. Không đổi chữ, không thêm chữ ngoài `text_overlay`.
2. **Kỹ thuật SQL trong hình:** cảnh 4 cả 12 ô sáng #38BDF8 viền 6 px, không ô nào mờ, không quét từng ô. Cảnh 3 pruning chỉ khi chip "Lọc đúng cột chia" (cột tháng); cảnh 4 là cột trạng thái, khác cột chia. Không SQL giả, không đồng hồ/tỷ lệ/benchmark, không chữ "dọn" hay "luôn/sẽ nhanh hơn" (grep: chỉ còn "tra cứu dễ" trong câu phủ định "không hứa tra cứu dễ"). "Vẫn giữ lại" ở cảnh 6 và 8; "Không phải lệnh SQL chuẩn" ở cảnh 7; hộp là nơi logic, không vẽ máy chủ. Đạt.
3. **Từng cảnh trả lời 5 câu (thấy gì / Cáo / vật chuyển động / tắt tiếng / khác cảnh trước):** cảnh 1 bảng + hai nhánh có nhãn, Cáo `think`, mũi tên tăng sáng, hiểu được hai lựa chọn; cảnh 2 đường chia đậm + khung "Một bảng logic"; cảnh 3 chỉ T11 sáng; cảnh 4 cả bảng sáng; cảnh 5 ba thẻ vàng trượt sang hộp; cảnh 6 hai bộ đếm 9/3 và hai khung sáng; cảnh 7 mũi tên quản lý + chip; cảnh 8 chạy lại. Tất cả có câu trả lời cụ thể; tắt tiếng vẫn hiểu phần chính nhờ nhãn đã duyệt. Cáo luôn ở góc, đứng yên, đổi dáng bằng cut, không hứa tay chạm ô.
4. **Khả thi engine:** xem tiêu chí 4. Vùng an toàn: chữ x=90-990, y=250-1500; phụ đề y=1000-1140 cách đáy sơ đồ (920 hoặc 960) từ 40 px; nhãn AI x=730-980,y=1460-1500; Cáo x=90-360,y=1190-1490. Đạt.
5. **Cảnh 6 (G10) đã đủ để dựng:** đạt. Header 520-584, hàng đếm 588-652 (khoảng cách 4 px, hàng cao 64 px cho chữ 48 px), bảng và hộp dịch đúng 40 px trong 0.5 s (620-920 thành 660-960), header không dịch, đáy 960, thẻ đích y=710/810/910, T4-T12 dịch cùng, ba chỗ trống T1-T3 không mã không bóng, bộ đếm hiện sau khi dịch xong (0.6 s) nên không chồng. Giữ hình học ở cảnh 7-8.
6. **Cảnh 8 (G8) đã đủ để dựng:** đạt, làm rất rõ. Dấu replay (cung tròn có đầu mũi tên, không chữ, không kim) 32.0-33.0 s; 0.2 s đầu còn giữ kết quả cũ rồi CUT toàn lớp sơ đồ về 12 thẻ + hộp rỗng; cấm tween đường bay ngược và crossfade; sau đó mới nhấn đường chia, T1-T3 trượt, kết 9/3 trước giây 37, giữ hình tới frame 1170. Dấu replay nhỏ (bán kính 22 px) nhưng không thể to hơn nhiều trong hàng đếm 64 px; ý "chạy lại" còn được cú cắt và chip "Hai việc khác nhau" gánh, chấp nhận.
7. **`quality_check` Codex tự chấm:** trung thực. `character_acting` và talking-head 0 là đúng vì hình chính là sơ đồ; `scene_type` theo hình chính (process_animation cho cảnh có vật chuyển động, data_visualization cho cảnh sáng/mờ và đếm) hợp lý; Cáo nhỏ 100% thời lượng khai thật, không giấu. Chỉ nới tay nhẹ ở cảnh 7 (`repeats_previous_layout: false`): bố cục gần cảnh 6, nhưng có thêm mũi tên, chip và dịch cỡ nên không phải "giống hệt", và đây là 2 cảnh liên tiếp, chưa vi phạm luật 3 cảnh.

## Điểm đã tự sửa nhỏ trong `storyboard.json` (chỉ mô tả, không đổi mốc/lời/chữ/số cảnh/tổng thời lượng)

- **S1 — Cảnh 3, nét dẫn từ chip "Tháng 11" xuống T11 không vẽ được:** T11 nằm hàng cuối, mọi đường đi từ chip (y=404-480) đều cắt hàng nhãn y=520-584 (Đơn hàng / Một bảng logic / Minh hoạ) hoặc đè mã T3/T7. Đã thay bằng liên kết bằng màu: chip "Tháng 11" viền #38BDF8, T11 nhận viền xanh 4 px làm dấu ngay lúc chip hiện (0.4 s), rồi nâng 8 px và mờ 11 ô khác ở 1.4 s như cũ. Sửa 4 chỗ cảnh 3 (visual_concept, environment, props, timeline 0.4) và 2 chỗ cảnh 4 nhắc "nét dẫn T11" (đổi thành "viền riêng T11").
- **S2 — Cảnh 5, trạng thái đường chia chưa nói rõ:** đường chia 4x3 đang xanh dày từ cảnh 2-4, nếu giữ sang cảnh 5-7 thì cảnh 8 "chia theo tháng" không còn là bước thêm vào, và hiểu nhầm Archive phải đi sau Partition (trái điều đã chốt "dùng độc lập"). Đã ghi rõ ở cảnh 5 (t=0): đường chia trở về nét mảnh 2 px #94A3B8, giữ qua cảnh 6-7, chỉ xanh dày lại ở cảnh 8.
- **S3 — Màu chữ mã ô:** chữ #F8FAFC trên thẻ vàng #FBBF24 gần như không đọc được (tương phản khoảng 1.6:1). Đã thêm vào `visual_style_note`: mã chữ trên nền vàng/xanh sáng dùng #101827; trên #64748B hoặc navy dùng #F8FAFC.
- **S4 — Cảnh 1, nhãn đè đầu mũi tên:** hộp nhãn x=730/760 chạm đầu mũi tên (760,660)/(760,860) và "Chuyển dữ" có thể vượt x=990. Đã sửa: mép trái chữ x≥775 (cách mũi tên ≥12 px), ưu tiên ngắt "Chuyển / dữ liệu cũ" thay cho "Chuyển dữ / liệu cũ" (khỏi tách cụm từ), đo bbox bằng PIL; nếu vượt 990 thì rút đầu mũi tên dưới về (745,860), không thu chữ.
- **S5 — Cảnh 7, mũi tên quá nhỏ để "show":** mũi tên 30 px nét 4 px đầu 8 px trong khe 40 px gần như vô hình trên điện thoại. Đã tăng nét 6 px, đầu 14 px (694 → 726, y=810) và thêm nhịp sáng viền lần lượt bảng chính (0.4-0.7) rồi hộp (0.7-1.0) để thấy chiều "quản lý"; cùng ngôn ngữ cảnh 6, không thẻ nào chạy.
- **S6 — Cảnh 6, đường đi nét dẫn:** thêm một câu nói rõ lộ trình (Lưu trữ 3 đi ngang trong hàng đếm y≈620 rồi gấp xuống mép trên hộp tại (855,660), không cắt header). Chỉ làm rõ, không đổi thiết kế.

## Ghi chú cho Producer (không bắt buộc)

1. Cách ổn nhất để giữ chữ 48 px khi camera phóng 1.02-1.08: vẽ từng frame bằng Pillow với hình học đã nhân scale còn font cố định, rồi ghép ffmpeg; tránh tự scale ảnh cả lớp chữ. Nếu push-in 2% (cảnh 5, 7) tốn công hơn lợi ích thì bỏ và ghi vào `notes.md`; không ai nhìn thấy khác biệt.
2. Xem khung thử bắt buộc tại: 0.0, 3.1, 9.5, 11.5, 14.2, 18.3, 21.5, 24.7, 28.5, 31.0, 32.1, 32.5, 35.5, 38.9 giây. Kiểm riêng: thẻ vàng mã đọc được, hàng nhãn/đếm không cắt dấu, đầu mũi tên cảnh 1 không chạm chữ, thẻ trượt qua khe không bị nhân đôi.
3. `transition` "wiperight" (cảnh 4 sang 5) và "match_cut" là phép đổi lớp trong chính thời lượng cảnh, tuyệt đối không dùng `xfade` chồng hai clip (làm hụt 39 s).
4. Cảnh 2 là cảnh mềm nhất về minh hoạ: nếu còn dư thời gian dựng, vẽ đường chia theo nét "kéo qua" (một lần, đồng thời, không đếm tuần tự) để thấy hành động chia rõ hơn là chỉ đổi độ dày.
5. Ranh giới đo giọng (dự phòng hook 2,2 s và mốc 9 s → 10 s) vẫn theo `script.md`; nếu mốc 9 dời, dời cả hai sự kiện đổi dáng, T11 và hai chip tương ứng ở cảnh 3.

Không có lỗi ở lời thoại; không cần trả về Kịch bản.

KẾT LUẬN: DUYỆT SAU KHI CLAUDE SỬA NHỎ
