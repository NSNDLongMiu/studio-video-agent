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

**Lượt này: VÒNG 1 — bản storyboard đầu tiên.** Không có file review storyboard trước.

- `team_id`: 4 (IT · Đội 3) · phòng `it` · chủ đề #4 **"Archive và Partition trong SQL là gì?"** · video **IT-T4-E01** · thư mục `ep01`.
- Thư mục gốc dự án (tuyệt đối): `D:\Agent Video Studio`
- Thư mục chủ đề (thư mục làm việc, được GHI): `D:\Agent Video Studio\content\it\T4-archive-va-partition-trong-sql-la-gi`
- Thư mục tập (nơi đặt đầu ra): `D:\Agent Video Studio\content\it\T4-archive-va-partition-trong-sql-la-gi\ep01` → ghi `storyboard.json` và `storyboard.md` ở đây.
- File cần ĐỌC (tuyệt đối):
  - `D:\Agent Video Studio\content\it\T4-archive-va-partition-trong-sql-la-gi\concept.md`
  - `D:\Agent Video Studio\content\it\T4-archive-va-partition-trong-sql-la-gi\plan.md` (bố cục theo đoạn, bảng nghĩa màu, kích thước Cáo, `renderer`/`renderer_reason`)
  - `D:\Agent Video Studio\content\it\T4-archive-va-partition-trong-sql-la-gi\ep01\script.md` (**12 cảnh, 13 lượt lời, 32,9 s — nguồn sự thật**; bảng ước lượng TTS; mốc sẽ duyệt lại sau đo TTS thật)
  - `D:\Agent Video Studio\content\it\T4-archive-va-partition-trong-sql-la-gi\review\script-r2.md` (mục 4 "Ghi chú … chuyển cho Đạo diễn hình ảnh/Producer" a–f — **bắt buộc xử lý trong storyboard**)
  - `D:\Agent Video Studio\studio\schema\storyboard.schema.json`
  - `D:\Agent Video Studio\studio\renderer-remotion\src\scenes\` (đọc từng file `*.jsx` để đối chiếu component thật; plan đã quyết `pillow-ffmpeg` vì ExplainerScene chỉ vẽ chuỗi khối nối mũi tên — hãy kiểm lại và ghi `renderer_reason` theo khả năng thật của từng scene, nêu rõ cảnh nào cần vẽ tay bằng Pillow)
  - `D:\Agent Video Studio\docs\mascot.md`, `D:\Agent Video Studio\docs\chat-luong-xem.md`
  - `D:\Agent Video Studio\.agents\skills\video-producer\references\ffmpeg-recipes.md`
- **CẤM đọc/dùng** thư mục `D:\Agent Video Studio\content\it\T3-archive-va-partition-trong-sql-la-gi\` (bản cũ).
- Quy ước riêng của video này (đã nằm trong script/plan, nhắc lại để không sót):
  - Giữ **12 cảnh khớp `scene_id` với script.md** (đặt `scene_id` theo mốc/tên cảnh của script, vd "C01-0.0-2.2"); `voice_over` copy đúng từng chữ từ bảng lời; `duration_s` khớp mốc (tổng 32,9 s).
  - `text_overlay` chỉ chứa chữ đồ hoạ đúng từng chữ như cột "Chữ trên màn hình" của script (không chép lời đọc); `text_groups` ≤ 3 ở mọi cảnh; không thêm CTA đồ hoạ.
  - Khung "MỘT BẢNG" hiện đúng 2,0–18,0 s; không lộ nhãn "Kho lưu"/mã hoá đơn trong kho trước 23,4 s (trả câu hỏi đúng 23,4 s).
  - Cáo hiện suốt; dáng và hướng chỉ theo script (đích ở bên phải/trái Cáo ghi rõ); đổi dáng cách nhau ≥ 2,0 s; chỉ dùng tên dáng có thật trong `docs/mascot.md`; tỉ lệ talking-head ≤ 0,3 (Cáo luôn gắn với vật/thẻ/đường chuyển đang đổi).
  - Xử lý ghi chú review a–f: (a) T6 sáng không muộn hơn ~3,1 s; (b) thẻ chốt ở lại hết thời lượng nếu TTS ngắn hơn ước lượng; (c) hình "hai cách lưu cạnh nhau" trùng cụm lời "mỗi hệ mỗi cách", `shrug` rơi vào đoạn này; (d) dùng đường dẫn/mũi tên trong hình nối mắt từ tay Cáo lên vật cao hơn đầu Cáo; (e) ranh giới bố cục 18,0 s bám cue lời 8, ghi cách xử lý lệch; (f) `captions.srt` giữ chữ "xoá" như lời 5.
  - Hook/ví dụ dựng: nhãn "Tình huống dựng", ô tìm "HĐ 4721 · ví dụ"; sếp/kế toán chỉ silhouette; không logo, không cú pháp SQL, không nhãn DETACH/DROP.
  - Bìa: khung hook 1,7 s theo plan (đọc được ở 180×320); ghi `thumbnail` vào `visual_style_note` (hoặc mục tương ứng trong `storyboard.md`) nếu schema không có trường riêng — không thêm trường ngoài schema.
- Mỗi cảnh điền đủ trường bắt buộc mới: `main_change`, `text_groups`, `hold_reason` (chỉ khi tĩnh > 2 s), `quality_check.text_repeats_voiceover`, `quality_check.change_visible_at_360`; cấp storyboard `renderer` + `renderer_reason`. `status` phải là `"DRAFT"` (chỉ Claude đặt `APPROVED`).
