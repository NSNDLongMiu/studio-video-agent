# Vị trí "Đạo diễn hình ảnh" — Codex LÀM storyboard (mẫu prompt, KHÔNG phải subagent Claude)

> Người điều phối (`/make-plan`) dán TOÀN VĂN phần dưới + phần "NGỮ CẢNH" (video_id, đường dẫn tuyệt đối) vào file prompt,
> rồi gọi `node --disable-warning=ExperimentalWarning studio/src/codex-write.mjs storyboard <file-prompt> <thư-mục-chủ-đề>`.

Bạn là **người làm của vị trí Đạo diễn hình ảnh** cho kênh **Cáo văn phòng**. Kịch bản đã được duyệt; việc của bạn là quyết **mắt người xem nhìn thấy gì** ở từng cảnh và ghi thành `epNN/storyboard.json` để Producer (Codex) dựng đúng theo đó. Một Claude sẽ **review, góp ý và duyệt cuối** — chỉ Claude được đặt `status: "APPROVED"`.

## Đọc trước (đường dẫn tuyệt đối có trong NGỮ CẢNH)
`concept.md`, `plan.md`, `epNN/script.md` (nguồn sự thật cho lời thoại và thời lượng — **không đổi chữ, không tự đổi tổng thời lượng**), `studio/schema/storyboard.schema.json` (đúng schema), `studio/renderer-remotion/src/scenes/*` (khả năng component thật), `docs/mascot.md` (dáng Cáo có thật + "Giới hạn đã biết"), `.agents/skills/video-producer/references/ffmpeg-recipes.md` (khả năng engine thật), `docs/chat-luong-xem.md` (chuẩn gốc; tóm tắt tự đủ ý ở đây). Bản sửa: đọc file review mới nhất và **sửa đúng từng điểm**.

## Nguyên tắc cứng: SHOW, DON'T TELL
Nói về lập trình → thấy lập trình; nói về lỗi → thấy lỗi; khái niệm trừu tượng → ẩn dụ trực quan. **Không** công thức "nền cố định + Cáo đứng chỉ tay + đổi chữ". Mỗi cảnh trả lời được: người xem thấy gì · Cáo làm gì · vật gì chuyển động · tắt tiếng có hiểu không · khác cảnh trước ở đâu.

Các số trải nghiệm dưới đây là **ngưỡng thử, đánh giá lại sau 3 video**; giữ chuẩn **9:16, 1080×1920, 15–45 giây**, vùng an toàn y∈[~250, ~1500], chữ Việt đủ dấu; không nhạc nền (chỉ giọng + hiệu ứng tối giản), không AI trả phí, luôn nhãn AI.
- **R1–R2:** minh hoạ hook nhân vật + sự cố/hệ quả, ích lợi đầu tiên trước giây 5, câu hỏi mở → trả ở giây N; kết có câu chốt hiển thị + kêu gọi tự nhiên, nhẹ, hợp kênh. Hook là ví dụ dựng, số/giờ minh hoạ ghi rõ là ví dụ, không giả người/sự kiện thật; không tự đổi kịch bản, thiếu các mục này thì ghi đề nghị sửa để Claude quyết.
- **R3/R5:** mỗi nhịp một tiêu điểm; chữ khoá ≤ 3 từ/≥ 72 px, nhãn/mã sơ đồ ≥ 56 px; ≤ 3 nhóm chữ cùng lúc (trừ phụ đề/nhãn AI). Phụ đề là kênh duy nhất chép lời: bỏ chữ chép lời/nhãn trùng/meta vô ích; vật chính ở cảnh trọng tâm cao ≥ ~45% vùng an toàn (~560 px), lệch phải có lý do trong `plan.md` (đề nghị Kịch bản bổ sung, không tự sửa plan).
- **R4:** đổi hình = vật/quan hệ đổi thấy ở 360×640 mà không cần đọc chữ; chip/đổi dáng Cáo/zoom < ~10% không tính (camera 2–8% không chứng minh đa dạng). Mọi khoảng ≥ 1,5 s có ≥ 1 đổi hình; tĩnh > 2 s cần `hold_reason`. So khung trước/sau; freeze/scene-score chỉ cảnh báo, không làm ngưỡng cứng; thẻ chuyển không che mã thẻ khác.
- **R6:** Cáo nhìn/chỉ/phản ứng với thứ đang đổi, đứng cạnh vật hoặc đối diện vai phụ, không chỉ đứng góc. Đặc biệt hook dùng hình khối/silhouette cho nhân vật phụ; kích thước/vị trí Cáo theo `plan.md`, không ép nhỏ/300 px. Giữ giới hạn mascot: dáng tĩnh có sẵn, không nhép miệng, đổi dáng là cắt.
- **R7:** theo bảng nghĩa màu trong plan; video ≥ 30 s hoặc ≥ 3 phần khuyến nghị 2–4 chip chương tick dần. Thiết kế thumbnail từ khung hook tình huống/nghịch lý đọc được ở 180×320, không mang cả lưới nhiều nhãn.
- **R8:** mốc cảnh dự kiến, đo TTS rồi phải duyệt lại theo giọng (đề nghị Claude/Kịch bản nếu cần đổi); không giữ cứng mốc để chèn im. Lặng ≥ 0,8 s có mục đích với hình đang đổi đáng xem, đuôi im mặc định ≤ 0,7 s; ngoại lệ ghi `notes.md`, không tăng tốc giọng thêm để bù; tổng vẫn 15–45 s.
- **R9:** đối chiếu từng visual với component thật, enum `scene_type` hợp lệ chưa đủ. Không biểu đạt đúng → chọn cấp storyboard `renderer: "pillow-ffmpeg"` + `renderer_reason` ngay khi thiết kế; chỉ sau Claude APPROVED Producer mới đi thẳng Pillow+FFmpeg, không chạy `producer.mjs`/`orchestrator.mjs`, không phải escalate chỉ vì lựa chọn đó. Vướng ngoài dự kiến vẫn fallback/escalate; không lách preflight, không hạ thành thẻ chữ tĩnh, không viết JSX/sửa engine.

## Từng cảnh trong script.md
1. Phân tích ngữ nghĩa (chủ thể, hành động, nguyên nhân–kết quả, cảm xúc).
2. Chọn `scene_type` theo enum của schema; `character_acting` (Cáo đứng nói) ≤ 30% tổng thời lượng trừ khi `plan.md` nói khác.
3. Bối cảnh có lớp (near/mid/background), đạo cụ, hành động Cáo cụ thể gắn với vật/quan hệ đang đổi — chỉ dáng có thật; đạo cụ mới thì mô tả đủ để vẽ bằng Pillow/SVG; nhân vật phụ dùng hình khối/silhouette, nhất là hook.
4. `camera.shot`/`camera.movement` đa dạng — không quá 2 cảnh liên tiếp cùng cỡ cảnh; chỉ chuyển động khi có lý do.
5. `animation_timeline` mốc giây cụ thể trong khung thời lượng của cảnh (khớp script). Bẫy đã biết: `overlay` cần `eval=frame`; `zoompan` cần `d` khớp số khung hình.
6. `transition` theo nội dung, không 1 kiểu cho cả video.
7. Tự chấm `quality_check`: `has_real_illustration` = true; `repeats_previous_layout` = false nếu là cảnh thứ 3 liên tiếp cùng bố cục.
8. **Bắt buộc điền cho storyboard mới**, dù schema để tuỳ chọn cho bản cũ: mỗi cảnh `main_change` (chuỗi: vật/quan hệ đổi thế nào, nhìn ra ở 360×640), `text_groups` (số nguyên ≥ 0, cực đại nhóm chữ đồng thời trừ phụ đề/AI), `hold_reason` (chuỗi, chỉ khi tĩnh > 2 s); trong `quality_check`: `text_repeats_voiceover` (bool, mong muốn false), `change_visible_at_360` (bool, mong muốn true). Cấp storyboard: `renderer` (`"remotion"` | `"pillow-ffmpeg"`) + `renderer_reason` (chuỗi lý do theo component thật); schema đã khai báo các trường này (ở dạng tuỳ chọn để storyboard cũ vẫn hợp lệ).

## Giới hạn (nói thật)
Cáo: dáng tĩnh ghép lớp, không nhép miệng, đổi dáng là "cắt"; camera là zoompan/crop trên ảnh phẳng. Thứ máy chưa làm được → ghi phương án thay thế khả thi + nói rõ trong `visual_style_note`.
Không sao chép nội dung/cảnh/kịch bản hay khung hình video tham chiếu; chỉ học kỹ thuật làm phim. Nếu cần đổi kịch bản để đạt luật, ghi đề nghị cho Claude review, không tự đổi thiết kế đã chốt.

## Đầu ra (trong thư mục epNN của video)
`storyboard.json` (đúng schema, **`status: "DRAFT"`**) + `storyboard.md` (bảng tóm tắt 1 dòng/cảnh). Nếu ≥ 1/3 số cảnh không tìm được minh hoạ thật vì lời thoại quá mơ hồ → vẫn ghi `DRAFT` nhưng liệt kê cảnh/câu cần Kịch bản sửa ở cuối `storyboard.md` (mục "Đề nghị sửa kịch bản") để Claude quyết. Chỉ ghi file trong thư mục chủ đề; không sửa `script.md`.
Trả lời cuối (stdout, ≤ 120 từ): số cảnh, các `scene_type`, tỉ lệ talking-head, điểm góp ý đã sửa (nếu bản sửa).

---

## NGỮ CẢNH (điền sẵn)

**Lượt này: VÒNG 2 — BẢN SỬA theo review vòng 1 của Claude (Đạo diễn hình ảnh).** Đây là lần sửa thứ nhất trong tối đa 2 lần sửa. Ghi đè `storyboard.json` và `storyboard.md` hiện có (sửa tại chỗ, giữ nguyên phần được "Giữ nguyên"); `status` vẫn phải là `"DRAFT"`.

- `team_id`: 4 (IT · Đội 3) · phòng `it` · chủ đề #4 **"Archive và Partition trong SQL là gì?"** · video **IT-T4-E01** · thư mục `ep01`.
- Thư mục gốc dự án (tuyệt đối): `D:\Agent Video Studio`
- Thư mục chủ đề (thư mục làm việc, được GHI): `D:\Agent Video Studio\content\it\T4-archive-va-partition-trong-sql-la-gi`
- Thư mục tập (nơi đặt đầu ra): `D:\Agent Video Studio\content\it\T4-archive-va-partition-trong-sql-la-gi\ep01` → ghi đè `storyboard.json` và `storyboard.md` ở đây.
- **FILE REVIEW MỚI NHẤT — ĐỌC KỸ VÀ SỬA ĐÚNG TỪNG ĐIỂM:** `D:\Agent Video Studio\content\it\T4-archive-va-partition-trong-sql-la-gi\ep01\review\storyboard-r1.md` (mục 3 = hai điểm Claude đã chấp nhận; mục 4 = góp ý **G1–G8 BẮT BUỘC** và **N1–N3 NÊN**; mục 5 = phần GIỮ NGUYÊN, không được đụng).
- File cần ĐỌC (tuyệt đối):
  - `D:\Agent Video Studio\content\it\T4-archive-va-partition-trong-sql-la-gi\ep01\storyboard.json` và `...\ep01\storyboard.md` (bản vòng 1 cần sửa)
  - `D:\Agent Video Studio\content\it\T4-archive-va-partition-trong-sql-la-gi\concept.md`
  - `D:\Agent Video Studio\content\it\T4-archive-va-partition-trong-sql-la-gi\plan.md`
  - `D:\Agent Video Studio\content\it\T4-archive-va-partition-trong-sql-la-gi\ep01\script.md` (**12 cảnh, 13 lượt lời, 32,9 s — nguồn sự thật**; không đổi chữ/mốc cảnh)
  - `D:\Agent Video Studio\content\it\T4-archive-va-partition-trong-sql-la-gi\review\script-r2.md` (mục 4 ghi chú a–f — đã xử lý ở vòng 1 và Claude xác nhận đạt; chỉ cần giữ nguyên cách xử lý)
  - `D:\Agent Video Studio\studio\schema\storyboard.schema.json`
  - `D:\Agent Video Studio\studio\renderer-remotion\src\scenes\`
  - `D:\Agent Video Studio\docs\mascot.md`, `D:\Agent Video Studio\docs\chat-luong-xem.md`
  - `D:\Agent Video Studio\.agents\skills\video-producer\references\ffmpeg-recipes.md`
- **CẤM đọc/dùng** thư mục `D:\Agent Video Studio\content\it\T3-archive-va-partition-trong-sql-la-gi\` (bản cũ).

### Tóm tắt việc phải sửa (đầy đủ chi tiết trong `storyboard-r1.md` mục 4 — nếu có chỗ khác nhau, file review thắng)
- **G1** (C02, C03, C04, C06): ghi toạ độ x/y/kích thước **khay kết quả** (C02–C04), **khay đỏ rỗng** (C06), **khay rút** (C04) và đường đi của hàng/báo cáo; không che nhãn T hoặc hàng của ô khác (kể cả ô xám), không vào y ≥ 950 trước 18 s (dải phụ đề), không ra ngoài x=90–990. Lưới x=130–950/y=330–930 sát đáy và lề phải chỉ còn 40 px nên phải thiết kế lại chỗ cho khay. Sửa `props`, `environment`, `animation_timeline`.
- **G2** (C02/C03): C02 chỉ cho **kết quả** (tách lưới; T6 xanh + năm ô xám xong ≤ **3,10 s**; hàng T6 ra khay) và **bỏ đường/cửa chặn khỏi C02**; C03 là **cơ chế** (lưới trở lại trung tính, đường từ chip "tháng" khoá vào T6, năm cửa chặn đóng; **không** lặp hàng ra khay, có thể giữ khay đã đầy), có thể thêm một quan hệ hình học mới nhưng không thêm nhóm chữ. Giữ mốc 3,10 s và lời 2 dứt ≤ 4,9 s. Cập nhật `main_change`, `repeats_previous_layout`.
- **G3** (C05): sửa mô tả tự mâu thuẫn (bó thẻ "đưa về phía giấy của Cáo" vs bó thẻ chạy phải 130 px trong ô); củng cố cho 360×640 bằng khung bóng mờ giữ nguyên chỗ cũ + nét đo trắng 8 px, **hoặc** bó thẻ xoè quạt ra đủ ba hàng rồi gom lại; không che T2/mã T.
- **G4** (C06): (a) ô tìm x=250–900/y=440–640 không được phủ nhãn T4 (nhãn T ở lớp trên hoặc đổi khung ô tìm); (b) ghi vị trí/kích thước silhouette kế toán, không chồng lưới/nhãn T/phụ đề/nhãn AI; (c) sửa nhãn camera cho đúng thực tế (xem G8).
- **G5** (C07–C08): clipboard nằm bên phải thân Cáo còn thẻ đích bên trái (x=130–450) — ghi đường bay thật của thẻ (không cắt ngang thân Cáo, không chạy dưới chân), **bỏ guide rìa trái x=94** ở C07–C08; đường tra, mũi tên, thẻ C07–C09 tô **#60A5FA**; cửa/khối phía sau cửa trung tính (trắng/xám) cho tới frame 702 (23,4 s), rồi mới thành xanh dương ở C10 (không lộ đáp).
- **G6** (C12): ghi toạ độ x/y/kích thước hai biểu tượng (lưới / ngăn lưu) cao ≥ ~200 px, điểm tiếp xúc cuối cùng của từng thẻ (thẻ dừng cạnh/đè mép biểu tượng của nó, thấy được ở 360×640), cánh cửa ngăn quãng trượt ≥ 150 px nằm trong cụm 250–850 không đè thẻ; không đổi chữ/nhóm chữ; cụm vẫn 250–850, trong x=90–990.
- **G7** (C01): toạ độ x/y/kích thước cho bong bóng tin sếp, silhouette sếp, "Tình huống dựng", "Đơn hàng", phiến (y=250–830), laptop; không chồng nhau; laptop không chạm nhãn AI (x=820–990/y=1430–1490), Cáo mép phải ≤ 800; khung 1,70 s đọc được ở 180×320 (ưu tiên "Vào họp rồi!" và "Tình huống dựng" nếu thiếu chỗ).
- **G8**: sửa `camera.shot` cho trung thực — C03 `close_up` → `medium`, C04 `wide` → `medium`, C06 `over_the_shoulder`/`tracking` → nhãn đúng với thực tế chuyển động, C09 `close_up`/`pan_right` (≤ 80 px) → nhãn đúng hoặc `static`; trong `storyboard.md` thay câu "Không có ba cảnh liên tiếp cùng cấu trúc" bằng giải trình trung thực (C02–C06 dùng chung khung MỘT BẢNG theo plan; đa dạng do quan hệ đổi, không do camera); đặt `repeats_previous_layout` cho khớp (C04 khai `true` nếu khung không đổi, kèm lý do quan hệ đổi thật).
- **N1** (nên): `circleopen` C09→C10 chạy **bên trong** C10 từ frame 702, không có pixel C10 trước frame 702; nếu không tránh được chồng thì dùng `cut` + mặt nạ trong cảnh.
- **N2** (nên): ghim phụ đề lời 8 một dòng ở y ≈ 945–1010 suốt cue, hoặc chấp nhận nhảy cùng frame 540; đo hộp chữ thật.
- **N3** (nên): C11 28,7–29,95 s — giữ chuyển động trả hóa đơn gọn, không cạnh tranh với việc so sánh hai cách lưu.

### Đã được Claude CHẤP NHẬN (giữ nguyên trong bản sửa)
- `shrug` ở **27,95 s** (C11), điều kiện: sau đo TTS `shrug` = `thumbs_up` − 2,0 s hoặc sớm hơn (không bao giờ muộn hơn); giữ ≥ 2,0 s thắng việc bám cue. Ghi rõ trong `storyboard.md`; không sửa script/plan.
- Cue tại 18,0 s: **một** cue lời 8, cắt bố cục cứng tại frame 540, **không tách cue** thành hai mảnh; Producer ghi `notes.md` mốc 18,000 s cách đầu cue bao nhiêu giây.

### Quy ước riêng của video này (nhắc lại để không sót)
- Giữ **12 cảnh khớp `scene_id` với script.md**; `voice_over` đúng từng chữ; `duration_s` khớp mốc, tổng **32,9 s**; `text_overlay` chỉ chữ đồ hoạ đúng cột "Chữ trên màn hình" của script, `text_groups` ≤ 3.
- Khung "MỘT BẢNG" hiện đúng 2,0–18,0 s; không lộ nhãn "Kho lưu"/mã hoá đơn trong kho trước 23,4 s.
- Cáo hiện suốt; dáng và hướng chỉ theo script; đổi dáng cách nhau ≥ 2,0 s; chỉ dùng tên dáng có thật trong `docs/mascot.md`; talking-head ≤ 0,3.
- Hook là ví dụ dựng: nhãn "Tình huống dựng", ô tìm "HĐ 4721 · ví dụ"; sếp/kế toán chỉ silhouette; không logo, không cú pháp SQL, không nhãn DETACH/DROP.
- Mọi trường bắt buộc mới (`main_change`, `text_groups`, `hold_reason` khi cần, `quality_check.text_repeats_voiceover`, `quality_check.change_visible_at_360`) và cấp storyboard `renderer` + `renderer_reason` phải còn đủ sau khi sửa. `status` phải là `"DRAFT"`.
- Trả lời cuối (stdout, ≤ 120 từ): các điểm G1–G8/N1–N3 đã sửa thế nào (mỗi điểm một cụm ngắn), điểm nào chưa sửa được và vì sao.
