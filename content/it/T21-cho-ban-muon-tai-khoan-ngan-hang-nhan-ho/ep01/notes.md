## Nhật ký Producer

## Producer — đo giọng trước khi dựng

- Storyboard APPROVED chỉ định Pillow + FFmpeg. `assets/gen/approved.json` có danh sách ảnh rỗng. Nền dự kiến lấy từ công cụ nội bộ và đồ họa Pillow theo storyboard.
- VieNeu 3.8.4 đã sinh 14 dòng, kiểm âm vị mã 0 trên `assets/voice/apply.json`. Bộ từ điển chung nhận nhầm đại từ “Ai/ai” ở L09/L12 thành “AI”. Đã giữ nguyên đại từ trong bản TTS riêng của tập, sinh lại L09 và giữ L12 tiếng Việt. Các từ sao, quan, mang, phong là từ tiếng Việt trong ngữ cảnh. Không có thuật ngữ tiếng Anh để tạo clip mẫu.
- `prosody.mjs timeline --mode free` — 45,65244 s, L02 vào 3,05508 s và dứt 4,98973 s. Mốc L02 duyệt khoảng 3,93 s. Nghỉ 0,10 s giữa L01 và L02 trong storyboard mâu thuẫn với tổng đệm R23 tối thiểu 0,16 s; đệm VieNeu thực tế là 0,06 s đầu và 0,14 s cuối.
- `prosody.mjs timeline --mode fit` theo cửa sổ 8 cảnh, sau đó `assemble.py` — ffprobe đo 56,540000 s; L02 vẫn 3,05508 s. L14 dứt theo timeline ở 54,21267 s. `ffmpeg silencedetect=n=-45dB:d=0.5` đo đuôi im từ 54,1635 đến 56,54 s, dài 2,3765 s, so với 0,60 s đã duyệt. `splice.py check` trả `[]` (0 vi phạm biên câu). Bản thử là `assets/voice/voice-fit-preview.wav`; timeline và mốc thử nằm cùng thư mục.
- Đề nghị Visual Director duyệt lại các mốc S00 theo lời thực đo, giữ ba pha và hook, rồi dời L14 và bong bóng kết để kết lời khoảng 55,94 s hoặc rút S09 và dời các sự kiện cuối tương ứng.
## Hướng dẫn từ Claude (rescue, 21/11/2026)

**Nguyên nhân gốc:** storyboard APPROVED được viết khi chưa có TTS, giả định giọng chậm hơn VieNeu thực đo (~1 s mỗi cảnh; tổng lời 28 s). Hệ quả: L02 vào 3,055 s thay vì 3,93 s; nghỉ L01→L02 khai 0,10 s trái đệm R23 tối thiểu 0,16 s (pipeline thực dùng 0,20 s); cửa sổ cảnh quá dài nên `fit` chỉ đặt lời ở đầu cảnh và dồn khoảng lặng vào cuối (lặng 2–3 s giữa các cảnh; đuôi im 2,38 s thay vì 0,60 s). Không phải lỗi thiết kế: chỉ lệch mốc, nên giữ APPROVED, lời đọc, ba pha opening và hook.

**Đã đổi (storyboard.json, storyboard.md, assets/voice/approved-windows.json):**
- S00 (vẫn 8,00 s): L02 3,93→3,06 s; nghỉ nối 0,10→0,20 s (voice_direction L01 pause_after, L02 pause_before); cắt nội bộ 4,10→3,25 s; Cáo surprised 4,20→3,35 s; nhãn TIỀN NHÀ tắt 4,10→3,25 s. Tiêu đề 5,10 s và pha giữ nguyên.
- Cửa sổ cảnh = cuối lời + giữ-sau-lời đã duyệt: S03 8,11→6,97; S04 7,43→6,48; S05 5,90→4,63; S06 5,00→4,58; S07 7,43→5,89; S08 6,00→5,32; S09 8,67→6,94. Tổng 56,54→48,81 s (trong 45–75 s).
- Sự kiện dời theo: S05 sáng đầu phải 4,25→3,75, chín ô 4,87→4,10; S07 bong bóng 1,00/1,85/2,70→0,90/1,55/2,15, biên chia (trước L10 thực 2,83) 3,70→2,75, hạt 4,00→3,00, rọi ô tên 5,20→4,20, hạt rời 6,43→5,30 (nhãn THỰC TẾ 3,70→2,75); S09 Cáo rời 6,75→6,20, bong bóng rỗng 6,77→6,25 (nở ngay cuối L14), ba chấm 7,45→6,50, đuôi im 8,07→6,34 (lời dứt) rồi 0,60 s tới 6,94. Mọi `disappear_s` bằng cũ-hết-cảnh nay bằng độ dài mới.
- Dự kiến sau khi dựng lại: L14 dứt ≈48,21 s, đuôi im 0,60 s.

**Sản xuất làm gì:** (1) giữ giọng đã sinh (`assets/voice/line-cache`, không sinh lại); (2) chạy lại `prosody.mjs timeline --mode fit` với cửa sổ mới trong `assets/voice/approved-windows.json` (đã ghi sẵn; cửa sổ là cuối lời + hold, nên timeline mới sẽ cho L02 = 3,055 s, tổng ≈48,81 s), rồi `assemble.py`; (3) đo `silencedetect` đuôi ≈0,60 s, `splice.py check` = `[]`; (4) dựng hình theo `animation_timeline` mới; (5) không dùng `voice-fit-preview.wav`/`fit-timeline.json` cũ (56,54 s) làm nguồn. Nếu `prosody.mjs` không nhận file windows mà tự đọc `duration_s` từ storyboard thì dùng `duration_s` mới trong storyboard.json (đã khớp). Lưu ý: các khoảng lặng giữa lời trong cảnh (vd 1,0–2,0 s giữ-sau-lời) là nghỉ có chủ đích để xem sơ đồ, QC sẽ kiểm Y6–Y7; nếu cảnh báo lặng dài thì ghi lý do, đừng tăng tốc giọng.
- Ghi chú: `assets/_scratch/retime-rescue.mjs` là script thử không chạy được trong phiên này (bị chặn quyền); mọi chỉnh sửa đã làm tay, có thể xoá file đó.

- Phát âm, độ tự nhiên của giọng và độ êm SFX: CHƯA KIỂM — giám đốc nghe. Sức hút opening và logic mạch kể: CHƯA KIỂM. Chưa trộn theo cue sheet, dựng thành phẩm hoặc chạy QC video vì chưa chốt mốc đồng bộ.

## Producer — ghép giọng theo mốc rescue và vướng ở S04

- Đã giữ 14 clip VieNeu trong line-cache. `prosody.mjs timeline --mode fit` dùng `assets/voice/approved-windows.json`. Lần ghép đầu bằng `assemble.py --scenes approved-windows.json` báo nguyên văn: `Lỗi ghép giọng. Dòng 14 lấn thời gian giữ hình cảnh S09.`
- Đã ghép lại qua `approved-timeline-unaltered-speed.json`: dời các câu thuộc cửa sổ cần bù sớm 12 ms, dùng tốc độ clip gốc. `ffprobe`: 48,810000 s; L02 vào 3,043 s, L14 dứt theo cue ở 48,199 s. `silencedetect=n=-45dB:d=0.5`: 48,149437–48,810000 s (0,660562 s). `splice.py check` trả `[]` cho 14 cửa sổ có đệm. Prosody metrics ở `assets/voice/approved-metrics.json`.
- `cuesheet.py build` và `mix.py` tạo `assets/sound-cues.json`, `assets/audio/mix.wav`, bốn stem và báo cáo trộn. Nhạc tắt; bản trộn tạm −14,2 LUFS, −1,74 dBTP khi đo QC, 0 mẫu clipping. Cue sheet giữ 8 cue, bỏ 12 theo quy tắc trộn. Tạo lại cue sheet sau khi có nhật ký hình. Phụ đề nháp gồm 20 mục ở `assets/_scratch/captions.srt`, mốc tách trong từng câu ước tính theo số từ.
- S04: plan.md yêu cầu khoá đỏ nét đứt luôn kèm CÓ THỂ; script.md giữ CÓ THỂ PHONG TOẢ tới cuối cảnh và yêu cầu YÊU CẦU GIẢI TRÌNH trên thẻ. Storyboard APPROVED cho CÓ THỂ PHONG TOẢ tắt ở 5,20 s trong cảnh 6,48 s khi khoá còn hiện và không khai chữ trên thẻ giải trình. Đã đối chiếu plan, cột Chữ trên màn hình và semantic_plan/animation_timeline. Đề nghị Visual Director giữ nhãn trên khoá đến 6,48 s và xác nhận cách thể hiện thẻ giải trình theo script, kiểm vùng an toàn. Giọng đã ghép theo các cửa sổ mới, 48,81 s.
- `node tools/qc-measure.mjs` trả “Không tìm thấy thư mục tập hoặc video final/*_9x16.mp4.” Chưa có thành phẩm để đo ba nhóm Audio / Visual / Narrative hoặc chạy qc-video.
- needs_manual_review: phát âm, nhịp và độ tự nhiên của giọng, độ êm SFX — CHƯA KIỂM — giám đốc nghe. Sức hút opening và logic mạch kể — CHƯA KIỂM.

## Hướng dẫn từ Claude (rescue lần 2, 21/11/2026) — S04

**Nguyên nhân gốc:** không phải mốc lệch do dời cửa sổ. Hai chỗ storyboard APPROVED khác script.md đã chốt: (1) `CÓ THỂ PHONG TOẢ` khai tắt 5,20 s (mốc từ thời lượng cũ 7,43 s) trong khi khoá đỏ nét đứt còn hiện đến hết cảnh; lần dời cảnh 7,43→6,48 s không dời mốc tắt này nên nhãn tắt sớm 1,28 s; (2) review vòng 2 "bỏ bốn nhãn" để không quá ba cụm chữ cùng lúc, trong đó bỏ `YÊU CẦU GIẢI TRÌNH` ở S04, nhưng script.md (cột Chữ trên màn hình) vẫn yêu cầu. Lần gỡ trước (job 100/102) chỉ dời thời lượng cảnh và sự kiện, chưa đối chiếu cột chữ, nên chưa dứt.

**Claude (Gỡ vướng) chỉnh S04 theo script.md đã chốt** (storyboard.json + storyboard.md; giữ APPROVED; sửa tay tối thiểu, CHƯA chạy được kiểm schema vì phiên không có quyền chạy lệnh):
- `CÓ THỂ PHONG TOẢ` (gắn ổ khoá nét đứt): disappear_s 5,20 → 6,48 (hết cảnh). Khoá đỏ nét đứt không bao giờ hiện thiếu chữ CÓ THỂ.
- Thêm `YÊU CẦU GIẢI TRÌNH` (label, gắn thẻ giải trình, effect none): 4,57–6,48 s (lúc thẻ trượt lên cạnh thẻ tài khoản, ô tên Cáo).
- `CƠ QUAN` giữ 1,10–3,35 s (script ghi đến hết cảnh, nhưng giữ như storyboard để không quá ba cụm chữ cùng lúc tính cả header): 3,35–4,57 s có header + CÓ THỂ PHONG TOẢ; 4,57–6,48 s có header + CÓ THỂ PHONG TOẢ + YÊU CẦU GIẢI TRÌNH. text_groups 2 → 3.

**CHỐT LẠI của Claude điều phối (21/11/2026, ghi đè hai gạch đầu dòng "Thêm `YÊU CẦU GIẢI TRÌNH`" và "text_groups 2 → 3" ở trên):** nhãn `YÊU CẦU GIẢI TRÌNH` ở S04 đã được GỠ lại khỏi `storyboard.json`; S04 chỉ còn hai nhãn `CƠ QUAN` (1,10–3,35 s) và `CÓ THỂ PHONG TOẢ` (3,35–6,48 s), text_groups = 2. Lý do: review storyboard r1 (mục 3) và r2 đã chủ ý bỏ nhãn này để giảm chữ (thẻ giống hệt thẻ ở S00, đã gọi tên ở S00, hình tự đọc; mật độ chữ đang vượt ngưỡng thử), và chỉ vai Đạo diễn hình ảnh mới đảo quyết định đó. Thẻ giải trình ở S04 dựng đúng hình thẻ của S00 (cùng đạo cụ, ô tên Cáo, dấu hỏi nối tới ô tên), không chữ nhãn.

**Luật áp dụng cho CẢ video, để Sản xuất không phải escalate lại:** khi cột "Chữ trên màn hình" của `script.md` có nhãn mà `storyboard.json` APPROVED không khai, thì **theo storyboard, không thêm chữ**. Bốn nhãn bị bỏ có chủ ý ở review r2: `YÊU CẦU GIẢI TRÌNH` (S04), `DƯỚI 10 TÀI KHOẢN` (S05), `CÓ THỂ BỊ PHẠT` (S06), `TIN NHẮN` (S08); ý của chúng thể hiện bằng hình (thẻ, chuỗi chín ô, chip vàng nét đứt không chữ, biểu tượng khung chat). Đây không phải lý do vướng. Ràng buộc an toàn duy nhất không được nới: khoá/vòng đỏ nét đứt luôn kèm chữ `CÓ THỂ` suốt thời gian nó hiện.

**Sản xuất làm gì:** dựng S04 theo `semantic_plan.texts` hiện tại (hai nhãn). Nhãn gắn cạnh đối tượng (khoá, thẻ giải trình), trong vùng an toàn, không đè header (ô trên giữa), phụ đề (dải dưới) hay Cáo; hai nhãn không giao nhau (khe ≥ 24 px, kiểm `text_overlap`). Không thêm chữ nào ngoài các nhãn của cảnh (Y1). Không ghép lại giọng (48,81 s đã khớp). Chạy lại kiểm schema storyboard trước khi dựng.

**Kiểm cảnh khác (chỉ đọc `texts` so với thời lượng cảnh mới):** S03, S05, S06, S07, S08, S09 không có nhãn tắt trước hết cảnh ngoài ý đồ (nhãn đối tượng NGƯỜI BỊ HẠI, NGƯỜI NHỜ, 1 LẦN, TIỀN NHÀ có đổi trạng thái theo thiết kế). Còn một chênh chưa sửa vì cần Visual Director: script.md S08 có nhãn `TIN NHẮN` (42,70–44,10 s) nhưng storyboard đã bỏ theo review r2; nếu vướng thì giữ storyboard (không thêm chữ), QC xét. Cảnh báo cho QC: mật độ chữ ≈ 43 từ nhãn / 48,81 s ≈ 53 từ/phút so với ngưỡng thử 20–45 (phần lớn từ tin nhắn giả lập 13 từ và tiêu đề hook); không chặn dựng.



## Producer — đối chiếu Y2 trước khi dựng

- Đã kiểm `storyboard.json` bằng Ajv với `studio/schema/storyboard.schema.json`: hợp lệ, APPROVED, chỉ định Pillow + FFmpeg. Đã rà mốc `character_action` và `animation_timeline` cả tám cảnh. S04 giữ CÓ THỂ PHONG TOẢ từ 3,35 đến 6,48 s theo rescue.
- `ffprobe -v error -show_entries format=duration -of default=nw=1 assets/audio/mix.wav` cho `duration=48.810000`. Dùng các clip và timeline đã ghép nếu nhịp rescue được giữ.
- Vướng Y2: `AGENTS.md` và `docs/chat-luong-xem.md` yêu cầu Cáo dẫn truyện ở mở, nhịp chuyển ý giữa và kết. Bảng Y2–Y3 của plan ghi S03–S08 không có Cáo. Storyboard chỉ có dáng acting ở S00 và S09. Đã xét phương án tính avatar/ô tên ở S03–S04 hoặc S07: đó là chi tiết nhận diện chủ tài khoản trên chứng từ, không có hành động dẫn chuyển ý theo Y2/R6.
- Đề nghị Visual Director chốt nhịp Cáo khoảng 1 giây ở ranh S07 → S08, nhìn hoặc chỉ vào thao tác lưu bằng chứng, rộng 108–194 px và ngoài vùng điện thoại, sơ đồ và phụ đề. Có thể giữ tổng 48,81 s và giọng đã ghép. Nếu vai trò avatar được chấp thuận cho Y2, cần xác nhận cách nghiệm thu cho tập này.
- Chưa xuất bốn tệp final và chưa chạy QC trên MP4. needs_manual_review: phát âm, nhịp và độ tự nhiên của giọng, độ êm SFX — CHƯA KIỂM — giám đốc nghe. Sức hút opening và logic mạch kể — CHƯA KIỂM.

## Hướng dẫn từ Claude (rescue lần 4, 21/11/2026) — Y2, QUYẾT ĐỊNH CUỐI

**Nguyên nhân gốc:** `docs/chat-luong-xem.md` dòng 9 (Y2): "Bắt buộc có Cáo ở ba nhóm phân cảnh: mở…, giữa **chỉ ở vài nhịp chuyển ý**…, kết…"; cùng dòng cho phép "Ẩn Cáo trong cảnh giải thích chuyên sâu". Plan/storyboard đặt S03–S08 không Cáo (viện câu thứ hai), nên nhóm "giữa" trống; Codex đọc câu thứ nhất đúng. Hai câu chuẩn có thể dung hoà bằng một nhịp ngắn, nên không cần giám đốc quyết. Avatar/ô tên trên thẻ KHÔNG tính là Cáo cho Y2 (đồng ý với Codex).

**Claude (vai Đạo diễn hình ảnh) quyết, đã sửa:** `storyboard.json` S08 `character_action` (chỉ chuỗi này; giữ APPROVED, giọng, mốc, thời lượng 48,81 s): Cáo `think` 1,0 s ở S08 0,15–1,15 s, rộng 120 px (trong 108–194 px, Y3), x≈16–136 bên trái điện thoại (x≈150–650), đáy ≤ y 1290, ngoài header (top_right), phụ đề và sơ đồ; rời trước khi ghim bay vào (1,2 s). Cáo tổng ≈ 11,68 s / 48,81 s ≈ 23,9% (≤ 25% ngưỡng thử). Đã cập nhật storyboard.md và bản đồ Cáo trong plan.md. Không sửa script.md.

**Sản xuất làm gì:** dựng Cáo `think` đúng mốc trên, không thêm Cáo ở cảnh khác, rồi tiếp tục dựng; không escalate Y2 nữa. Nếu hộp Cáo chạm điện thoại ở bản dựng thì thu về 108 px và dịch trái, không đổi mốc. Không sinh lại giọng. QC kiểm Cáo ≤ 25% và Y3 trên bản dựng.
- Hạn chế: phiên rescue không chạy được lệnh Ajv; sửa chỉ là một chuỗi `character_action` nên schema không đổi, nhưng Sản xuất vẫn chạy lại kiểm schema trước khi dựng.

## Producer — bản xuất để duyệt

- Nguồn hình: nền nội bộ office, database, incident, security từ `tools/backgrounds/make_background.py`; biến thể xanh bạc hà cho S08 và đồ họa/mô phỏng UI dựng bằng Pillow. Danh sách ảnh Gemini duyệt rỗng. Cáo lấy từ `brand/cao/poses/`, đổi dáng bằng cắt, không nhép. Avatar trên thẻ/phiếu là đạo cụ nhận diện chủ tài khoản. Cáo dẫn ở opening, nhịp S08 0,15–1,15 s và kết, tổng xấp xỉ 11,17 s (22,9%); S08 rộng 120 px, hai dáng kết rộng 160/180 px.
- Giữ 14 clip giọng đã ráp và các cửa sổ rescue. `splice.py check` của lần ráp trả `[]`; đuôi im ở stem đã đo 0,661 s. Tạo lại cue sheet cùng bốn stem từ timeline dựng, nhạc tắt. Hạ 0,8 dB ở khâu mux để bù đỉnh phát sinh khi mã hoá AAC.
- Opening có ba pha 0–2,50 / 2,50–5,10 / 5,10–8,00 s. Tiêu đề 94 px, hiện từ 5,10 s. Giữ đúng hai nhãn S04 theo rescue, giữ khoá đỏ nét đứt cùng CÓ THỂ PHONG TOẢ, dành các nhãn bị lược cho minh họa bằng hình. Bìa lấy ở 2,85 s và đã mở bản 180×320. Phụ đề 20 mục, tối đa hai dòng và 28 ký tự/dòng; mốc ngắt nội câu ước lượng theo cụm từ, chưa nghe kiểm.
- Đã mở khung video 360×640 ở opening, S04, S05, S07, S08 và kết để rà bố cục, dấu tiếng Việt, phụ đề và các trạng thái chính. Các khung còn lưu trong `assets/_scratch`. Y1 áp lời và nhãn theo script/storyboard; Y2–Y3 theo bản đồ Cáo rescue; Y4 dùng nền theo nhóm cảnh; Y5 mở tình huống và quay lại cùng bối cảnh ở kết; Y6–Y8 có số đo timeline, nghỉ, mép câu và kiểm âm vị ở các mục trước, phần cảm nhận chờ người nghe.
- `qc-video`: PASS, 48.81 s, h264 1080x1920 yuv420p, 30 fps, aac 48000Hz, -15.1 LUFS, -2.21 dBTP, LRA 3.3 LU.
- `qc-measure` (Audio / Visual / Narrative): 90 phát hiện, 64 cảnh báo, 0 lỗi. Opening: ba pha đạt phép đo, tiêu đề đạt phép đo, biên câu đạt phép đo. Xem `assets/_scratch/qc-auto/report.md` và dữ liệu JSON cùng thư mục.
  - Cảnh S00 (0–8 s) ít chuyển động: trung vị 0 khối hoạt động, hiệu cục bộ 1,97. Các nhịp giữ tiêu đề, bắt sáng ô tên và giữ thẻ dùng chuyển động cục bộ.
  - Cảnh S04 (14,97–21,45 s) ít chuyển động: trung vị 0 khối hoạt động, hiệu cục bộ 2,61. Cảnh đổi bằng văn bản trượt, ổ khoá và thẻ giải trình; đoạn giữ minh hoạ theo storyboard.
- Ngưỡng thử và giới hạn phép đo của `qc-measure`: ngắt nghỉ dùng ngưỡng −40 dB nên số đo có thể dài hơn cửa sổ đệm. Opening 4,89–8,14 s dành cho tiêu đề, thẻ nảy/vệt sáng và chuyển sang S03; S03 giữ phiếu khi hạt tiền đi tiếp; S06 giữ hai ô vừa nhập khay; S08 giữ chứng từ và hai nhánh hỏi. Nhịp và thời lượng các cảnh này lấy từ cửa sổ rescue. Mốc tiếng opening sớm hơn 0,60 s khoảng 14 ms, giữ bản giọng đã duyệt. Mật độ chữ gồm cả tin nhắn UI giả lập. Vật/ý đã được duyệt biểu đạt bằng icon (văn bản, silhouette cá nhân, ngộ nhận S07, giao dịch lạ, cơ quan, thẻ riêng) giữ nguyên dạng hình. Các cảnh báo vùng an toàn cần đối chiếu khung thực: có đạo cụ trượt từ mép và Cáo S08 được duyệt ở x≈16.
- Header hiện ở mọi cảnh sau opening; chuyển ô 0,4 s bằng fade qua một thẻ tại mỗi thời điểm. S09 fade ô mới ngay lúc cắt để tránh ô tài khoản bên phải. Máy có thể gắn cờ thiếu thời gian hai ô cùng hiện. Cue được chọn theo storyboard; cảnh báo liên kết/onset trong báo cáo cần đối chiếu khi nghe cùng hình. Giữ máy cục bộ ở các nhịp đọc sơ đồ và các cảnh đã duyệt máy tĩnh.
- needs_manual_review: phát âm, nhịp cảm nhận, độ tự nhiên giọng và độ êm SFX — **CHƯA KIỂM — giám đốc nghe**. Sức hút opening và logic mạch kể — **CHƯA KIỂM**.
- Tệp giao: `final/IT-T21-E01_9x16.mp4`, `final/thumbnail.jpg`, `final/captions.srt`, `final/publish.json`. `qc-publish` chạy trên metadata cuối và khai báo AI có ở cả ba mô tả.

Nhóm cờ từ phép đo: complexity_duration (3), concept_window (1), cue_onset (1), cue_unattached (8), header_coverage (1), header_slot_transition (6), long_pause (1), low_motion (2), opening_voice_early (1), pause_plan_deviation (8), render_text_density (1), render_text_keyword_missing (8), render_text_simultaneous (1), safe_area (16), simultaneous_text_words (1), speech_pace (1), unplanned_silence (4).

## QC — lượt 1 (21/11/2026, Claude QC)

**Phán quyết: FAIL lỗi dựng sửa được → `production`.** Số đo độc lập (`qc-measure --baseline T5`, chạy 2 lần; ảnh ở `assets/_scratch/qc-auto/`): 91 phát hiện, 64 cảnh báo, 0 lỗi; `qc-video` pass, `fails` = []. MP4 48,81 s, h264 1080×1920 yuv420p 30 fps, aac 48 kHz, 5,36 MB; −15,1 LUFS, true peak −2,21 dBTP, LRA 3,3 LU; mix.wav −14,29 LUFS/−1,74 dBTP, 0 mẫu clip; đuôi im 0,676 s (≤ 0,7 đạt). Đã tự xem 23 khung (board-01..03, nocaption-board, thumb-180x320, thumbnail.jpg full, frame-open-end, frame 2,85/5,5/37,2/42,3 s, frame-conclusion, scene-S04, textheavy-S06/S08, header-zones, textheavy khác qua board). Gemini xem trước: **Gemini vắng** (lệnh `gemini-run.mjs look` bị chặn quyền trong phiên nền, không chạy; không chờ).

### Ba kết luận
- **KỸ THUẬT: Đạt có lỗi dựng nhỏ.** Định dạng/loudness/đuôi đạt; **bìa `thumbnail.jpg` mất dấu** (QC-01) và vài chỗ chữ/đạo cụ đè nhau (QC-02..04).
- **TUÂN THỦ: Đạt.** Luật tên nền tảng: grep trống trên captions.srt, scenes.json, storyboard.json, publish.json (ngoài khoá nền tảng/URL). Khai báo AI ở `publish.json` (`ai_generated_content: true` + câu khai báo ở cả 3 mô tả); không đốt nhãn AI lên hình. Nội dung: mọi hệ quả ở dạng "có thể"; không "Điều 291", không án tù, không vụ cụ thể, không đồng phạm/vô can, không rửa tiền, không tên ngân hàng, không mức 40–100 triệu; mức 100–150 triệu chỉ đứng cạnh hành vi "cho mượn" (cá nhân). Nguồn ảnh: `assets/gen/approved.json` rỗng, video không dùng ảnh Gemini; đồ hoạ Pillow, nền `tools/backgrounds`, dáng Cáo `brand/cao` (không cần dòng ở LICENSES.md theo ghi chú dòng 4); không hình đồ ăn/đôi dép. `final/` đúng 4 tệp. Lưu ý nguồn (không chặn): Điều 30 NĐ 340/2025 mới đối chiếu qua báo, chưa soi văn bản gốc (đã nêu ở script.md mục CẦN KIỂM NGUỒN) — giám đốc tự đối chiếu trước khi đăng.
- **TRẢI NGHIỆM: Chưa đạt ở Y1 (mật độ chữ) và hai điểm bố cục; phần nghe CHƯA KIỂM.**

### Bảng phát hiện của QC (mã QC-xx = nhìn bằng mắt; giữ mã M-xx của công cụ)
| Mã | Nhóm | Mốc | Bằng chứng | Mức | Đề nghị |
|---|---|---|---|---|---|
| QC-01 | KỸ THUẬT/R3,R7 | bìa `final/thumbnail.jpg` | Mở full-res: nhãn lịch ghi **"TIEN NHA"** mất toàn bộ dấu và bị khung điện thoại cắt chữ "À" sát mép; khung video cùng chỗ (frame-2.85.png) có "TIỀN NHÀ" đủ dấu. Tiêu đề bìa "MỘT LẦN THÔI?" che nửa chip tài khoản | **FAIL (lỗi dựng)** | Dựng lại bìa: đủ dấu, nhãn lịch không bị điện thoại cắt, tiêu đề không che chip; kiểm lại ở 180×320 |
| QC-02 | KỸ THUẬT/R3 | 5,10–8,00 s · S00 | frame-open-end.png (7,967 s): hộp tiêu đề "TÊN AI TRÊN GIAO DỊCH?" đè nửa dưới chip tài khoản (góc trên phải) và mép trên điện thoại; xuống dòng xấu "GIAO / DỊCH?" | Lỗi dựng (vừa) | Thu hộp tiêu đề về 1 dòng hoặc ngắt "TÊN AI / TRÊN GIAO DỊCH?", dời lên khỏi chip và điện thoại, hoặc ẩn chip khi tiêu đề hiện |
| QC-03 | KỸ THUẬT/R3 | 50,4 s→hết · S09 (tính theo cảnh: ≈ 44,8–48,8 s) | frame-conclusion.png (45,34 s): chữ chốt "KHÔNG CHO MƯỢN" (≥72 px) chồng lên mép trên điện thoại và lấn góc lịch (chữ đi qua notch) | Lỗi dựng (nhẹ–vừa) | Dời chữ chốt lên cao hơn (y≈390–620 theo script, hiện đang sát y≈510 với điện thoại bắt đầu y≈525) hoặc hạ điện thoại; chữ phải nằm trong vùng trống |
| QC-04 | KỸ THUẬT/R3 | 39,2–41,87 s · S08 | textheavy-S08.png/nocaption-board 2.3: nhãn "NGÂN HÀNG" tràn ra ngoài khung bo bên phải (x≈ 345/360 ≈ 96% rộng khung, ngoài panel x≈334) | Lỗi dựng (nhẹ), khớp M-90 safe_area | Thu nhãn vào trong panel hoặc xuống dòng/đổi cỡ để cách mép ≥ 64 px |
| QC-05 | KỸ THUẬT/R3 | 27,0–27,5 s · S06 | nocaption-board 2.1 (27,47 s): nhãn "1 TÀI KHOẢN" lệch ra mép trái khung (≈ 24 px từ mép) khi ô đang trượt vào; trạng thái dừng nằm trong ô. Khớp M-78..88 (đạo cụ trượt từ mép, ≈ 0,7 s) | Cảnh báo (thoáng qua) | Cho nhãn vào cùng ô thay vì theo ô từ mép; nếu giữ thì ghi lý do |
| M-04/M-49/M-63 | TRẢI NGHIỆM/Y7,R4 | 4,89–8,14 s · S00 | Im > −40 dB 3,25 s (ngưỡng thử 3 s); kế hoạch 0,9 s (lệch +2,35 s). Hình 5,1–8,0 s chỉ có hộp tiêu đề đứng, S00 trung vị 0 khối hoạt động, tĩnh 50,6% (M-01). frame 5,5 s ≈ 7,97 s | Cảnh báo (cảm nhận) | Có lý do thiết kế (câu hỏi treo, viền nét đứt chạy), nhưng dài gấp ~3 kế hoạch sau khi rescue giữ S00 = 8 s; **CHƯA KIỂM — giám đốc nghe/xem** có thấy chùng không. Nếu chùng: rút opening còn ≈ 6–6,5 s (cần sửa storyboard, việc của Đạo diễn hình ảnh) |
| M-05..10, M-51..66 | Y7 | 12,89–15,11 · 20,38–21,59 · 24,99–26,22 · 29,23–30,80 · 35,49–36,69 · 40,43–42,01 s | Khoảng lặng 1,2–2,2 s, lệch kế hoạch +0,20–0,22 s; là giữ-sau-lời (Information Pacing: giữ 1,07–2,08 s theo cảnh) để quan sát sơ đồ; hình vẫn có hạt/nhịp chạy | Đã loại trừ khỏi lỗi: có chủ đích; nghe CHƯA KIỂM | Giữ; không tăng tốc giọng |
| M-16/M-17 | Y6 | 0–48,81 s | Tốc độ đọc 5,416 âm tiết/s trên giọng gốc (5,335 trên MP4) so dải thử 4,6–4,8 và T5 3,837 (+41%): **nhanh hơn dải** | Cảnh báo | Tốc độ cảm nhận **CHƯA KIỂM — giám đốc nghe**; nếu quá nhanh cần chỉnh giọng/rút lời, không bù bằng nén nghỉ |
| M-18..21 | Y5/Information Pacing | S03 6,97 s (high, dưới 8 s); S05 4,63 s, S06 4,58 s (medium, dưới 5 s); cửa sổ 20,66–30,66 s có 2,12 khái niệm (ngưỡng 2) | Số đo ở `report.md` mục Information Pacing; giữ-sau-lời S03 2,08 s đạt, S09 0,676 s | Cảnh báo | Chấp nhận: lời đã chốt; khái niệm đều dựng thành hình; nhưng mạch S04→S06 dày. Giám đốc xem |
| M-22/M-33/M-34/M-24 | Y1,R22 | 0,1–2,5 s · S00; toàn video | 59,0 từ chữ minh hoạ/phút (khoảng thử 20–45; T5 79,3); 10 từ đồng thời ở S00 (ngưỡng 8); phụ đề 169 từ vs 53 chữ minh hoạ (3,19×); chữ lặp lời = 0 (S04 "CÓ THỂ PHONG TOẢ" similarity 1, thông điệp chốt ngắn, M-23) | Cảnh báo (Y1) | Giảm 1–2 nhãn ở S00 (đã bỏ 4 nhãn ở r2; còn tin nhắn UI giả lập 6 từ + TIỀN NHÀ + YÊU CẦU GIẢI TRÌNH); không thêm chữ |
| M-25/M-26 | R20,R21 | 0–8 s; toàn video | Tiếng đầu 0,586 s so cửa sổ hợp lệ ≥ 0,6 s (sớm **14 ms**) ⇒ công cụ coi S00 chưa là opening riêng ⇒ header phủ 83,59% (ngưỡng 95%). Header thực sự ẩn trong opening theo thiết kế (S00 0–8 s, 16,4%) | Cảnh báo (công cụ; lệch 14 ms) | Nếu rẻ: lùi giọng vào ≥ 0,60 s (đệm đầu thêm ≥ 15 ms, không sinh lại giọng) rồi đo lại để D8 R20/R21 hết cờ; nếu không, giám đốc quyết chấp nhận |
| M-27..32 | R21 | 15,2 / 21,67 / 26,3 / 30,87 / 36,77 / 41,87 s | Đổi ô header có 0 s cùng hiện (tại ranh cảnh); Producer ghi fade 0,4 s qua một thẻ; header-zones.png: header ≥ 52 px, không đè Cáo/phụ đề, S08/S09 ở góc khác chip tài khoản | Đã loại trừ phần lớn (đã xem khung 37,2 s/42,3 s: không đè); độ mờ khi chuyển CHƯA KIỂM |  |
| M-35..46 | R22 | S00,S04,S05,S07,S08,S09 | 8 keyword thiếu chữ vẽ thật (cá nhân, bạn thân, một lần, chuyển đi là xong, giao dịch lạ, cơ quan chức năng, tài khoản của bạn, văn bản) và 4 keyword minh hoạ bằng hình theo storyboard; 100% cảnh có chữ vẽ thật, kinetic 1,54/25 s (đạt ≥ 1/25 s), 94,7% chữ đúng mốc | Cảnh báo / thông tin | Các thuật ngữ được gọi tên (CƠ QUAN, NGHI LIÊN QUAN, CHO MƯỢN, 100–150 TRIỆU, SAO KÊ, NGÂN HÀNG…) đều có nhãn; thiếu chủ yếu là từ thường diễn đạt bằng icon. Mục "keyword đúng trọng tâm" giám đốc xem |
| QC-06 | TRẢI NGHIỆM/Y1 | S08 ≈ 36,7–42 s | Nhãn `TIN NHẮN` trong script.md không có ở storyboard; theo luật rescue lần 2 (theo storyboard, không thêm chữ). Biểu tượng khung chat + tích xanh vẫn hiện (textheavy-S08.png) | Chấp nhận | Giữ storyboard |
| QC-07 | Y2,Y3 | S00 0–6,1 s; S08 36,7–37,7 s; S09 | Cáo: S00 `think`→`surprised`, ≈ lớn (frame-2.85); S08 `think` 120 px, x≈16 sát mép trái khung (frame-37.2: sticker nhỏ, ≈ 6% chiều cao, chạm mép panel); S09 `stop`/`thumbs_up` (frame-42.3, conclusion). Tổng Cáo ≈ 11,17 s ≈ 22,9% (số của Producer theo storyboard; **QC chưa đếm từng khung**) ≤ 25% | Đạt có điều kiện | Nhịp S08 rất nhỏ, gần mép; chấp nhận theo quyết định rescue lần 4 |
| M-67..75 | Audio | các mốc c001–c008 | Cue "không gắn hình" (8 cue; onset lệch ≤ 0,07 s); SFX −42,7 LUFS, impact −40,4 LUFS (rất nhỏ so với voice −16,4) | Cảnh báo | Độ êm/độ nghe thấy SFX **CHƯA KIỂM — giám đốc nghe**; cue chưa liên kết sự kiện hình thì ghi nhận |

### Bảng so với bản chuẩn T5 (Δ lấy từ qc-measure)
Thời lượng 48,81 vs 44,63 (+4,18); cảnh 8 vs 18 (−10); TB cảnh 6,10 vs 2,48 s; cảnh < 2 s 0 vs 8; cắt/10 s 1,43 vs 3,81; tĩnh 34,7% vs 30,8% (đoạn tĩnh dài nhất 1,2 = 1,2); số cảnh báo 64 vs 16 (+48); LUFS −15,1 vs −14,85 (−0,25); đuôi im 0,676 vs 0,691; chữ lặp lời 0 = 0; từ chữ/phút 65,2 (bảng) / 59,0 (render) vs 79,3; keyword có hình 100%; phụ đề 71,4% vs 80,2%, cỡ 56 = 56 px; tốc độ đọc MP4 5,335 vs 3,837 (+1,50); tỉ lệ lặng 0,361 vs 0,340; header 83,6% vs 0.

### D8 (R20–R23)
- R20 opening: 0–8 s, ba pha 0/2,5/5,1 s, tiêu đề hiện 5,1 s, mâu thuẫn ở 2,5 s (trong mốc); lệch **14 ms** ở mốc tiếng đầu (0,586 < 0,6) → công cụ báo "Có lỗi"; ảnh frame-open-start/mid/end đã xem; sức hút opening **CHƯA KIỂM**.
- R21 header: cỡ ≥ 52 px đạt, 0 đoạn sai cỡ/đè; phủ 83,59% sau opening (xem M-25/26); 6 lần đổi ô.
- R3 nhãn đè nhãn: 0 cặp bbox giao, khe nhỏ nhất 70 px (đạt); các chỗ đè nhãn–đạo cụ ở QC-02/03/04 không nằm trong số đo này.
- R22: 100% cảnh có chữ, 59,0 từ/phút (> 45), kinetic đạt, tối đa 10 từ đồng thời (> 8), thuật ngữ gọi tên có nhãn.
- R23: 0/14 câu cờ đầu/cuối (0%), splice check `[]` — số đo đạt; nghe CHƯA KIỂM.
- Y8: `phonemes.py` mã 0, 14 dòng, 0 lỗi; không thuật ngữ tiếng Anh; Producer đã giữ "Ai/ai" đại từ.

### 5 câu hỏi người xem lạ
1. 3 giây đầu nói được bài về gì: **Đạt** (0–3 s: tin nhắn "Cho tao mượn tài khoản nhận hộ nha" + "TIỀN NHÀ" + "YÊU CẦU GIẢI TRÌNH" frame-2.85).
2. Trước giây 5 thấy hệ quả: **Đạt** (thẻ giải trình đỏ nét đứt hiện 2,5 s).
3. Mỗi cảnh một ý, tắt tiếng hiểu phần chính: **Đạt có điều kiện** (nocaption-board hiểu S03–S08; S06 "1 TÀI KHOẢN/1 LẦN" cần lời) — CHƯA KIỂM bản picture.mp4.
4. Hình đổi nhìn ra ở 360×640, chữ không chép lời: **Đạt có cảnh báo** (similarity cao nhất 1 chỉ ở nhãn chốt ngắn; khoảng im 3,25 s ở 4,9–8,1 s hình gần như tĩnh, đoạn tĩnh dài nhất đo 1,2 s).
5. Kết giải quyết/kêu gọi, đuôi ≤ 0,7 s, bìa đọc được ở 180×320: **Chưa đạt ở bìa** (QC-01 mất dấu "TIEN NHA", tiêu đề che chip); kết "Bạn sẽ nhắn lại thế nào?" và đuôi 0,676 s đạt.

### Y1–Y8
| Nhóm | Kết luận | Bằng chứng |
|---|---|---|
| Y1 chữ/hình thừa | **Chưa đạt (cảnh báo ngưỡng)** | 59 từ/phút > 45; 10 từ đồng thời S00; không nhãn AI/"Ví dụ dựng" trên khung; chữ thừa: không |
| Y2 Cáo ở ba nhóm | **Đạt có điều kiện** | S00, S08 1 s, S09; avatar trên thẻ không tính; QC-07 |
| Y3 cỡ/số cảnh Cáo | **Đạt có điều kiện** | ≈ 22,9% theo Producer (chưa đếm khung); S08 120 px; S00 lớn |
| Y4 nền theo ngữ cảnh | **Đạt** | office S00/S09, database S03, incident S04, security S05/S06/S08, N3 S07 (board-01..03) |
| Y5 tình huống mở/kết | **Đạt** | mở tin nhắn nhờ nhận hộ, kết quay về cùng bàn + câu hỏi mời |
| Y6 giảm nhịp | **CHƯA KIỂM — giám đốc nghe** | 5,42 âm tiết/s (> dải thử 4,6–4,8) |
| Y7 nghỉ có chủ đích | **CHƯA KIỂM — giám đốc nghe** | 22 khoảng nghỉ, max 3,25 s (4,9–8,1 s), 6 khoảng giữ-sau-lời 1,2–2,2 s |
| Y8 phát âm | **Đạt phần văn bản; nghe CHƯA KIỂM** | phonemes mã 0; "giải trình", "phong toả", "sao kê" cần nghe |

### needs_manual_review — CHƯA KIỂM — giám đốc nghe/xem (chưa ai xác nhận; `final_pass_allowed` không thay người duyệt)
Độ tự nhiên giọng, nuốt/kéo chữ đầu/cuối câu (0–48,81 s); phát âm "giải trình" 5,5 s/20,4 s, "phong toả" 18,5 s, "sao kê" 37,9–39 s; tốc độ cảm nhận 5,4 âm tiết/s; nhịp nghỉ 4,9–8,1 s và các khoảng giữ 12,9–15,1/20,4–21,6/25,0–26,2/29,2–30,8/35,5–36,7/40,4–42,0 s; độ êm SFX/impact; sức hút opening 0–8 s; logic mạch kể S03→S06; bản picture.mp4 tắt tiếng; độ mờ khi đổi ô header; Cáo ≤ 25% đếm khung.

### QC — cần sửa (lỗi dựng, gửi Sản xuất)
1. **QC-01** dựng lại `final/thumbnail.jpg`: "TIỀN NHÀ" đủ dấu, không bị điện thoại cắt, tiêu đề bìa không che chip; mở lại ở 180×320.
2. **QC-02** S00 5,10–8,00 s: hộp "TÊN AI TRÊN GIAO DỊCH?" không đè chip và mép điện thoại, ngắt dòng "TÊN AI / TRÊN GIAO DỊCH?".
3. **QC-03** S09: "KHÔNG CHO MƯỢN" không chạm điện thoại/lịch (đặt trong vùng trống y≈390–620 như script).
4. **QC-04** S08: nhãn "NGÂN HÀNG" nằm hẳn trong panel, cách mép khung ≥ 64 px.
5. **QC-05** (nên sửa) S06: nhãn "1 TÀI KHOẢN" không lệch ra mép khi ô trượt vào.
6. (nên sửa nếu rẻ) mốc tiếng đầu ≥ 0,60 s (hiện 0,586 s), rồi chạy lại `qc-measure` để xác nhận R20/R21.
Không sinh lại giọng; không đổi thời lượng 48,81 s. Sau khi sửa: QC lại và, nếu sạch, đánh `QC-CHỜ-NGHE` cho mục nghe/xem ở trên.

### Bài học cho luật
- Bìa dựng riêng từ cảnh dễ mất dấu tiếng Việt dù video đủ dấu: QC nên mở thumbnail.jpg full-res (ngoài 180×320) và kiểm chữ có dấu.

## Producer — sửa theo QC lượt 1

- QC-01. Bìa lấy từ khung hook 2,85 s và dùng nhãn “TIỀN NHÀ” đã vẽ trong cảnh. Tiêu đề bìa nằm bên trái chip tài khoản. Đã mở bản 1080×1920 và 180×320 để kiểm dấu và khoảng cách.
- QC-02. Opening ngắt “TÊN AI / TRÊN GIAO DỊCH?” đúng hai dòng và ẩn chip khi tiêu đề xuất hiện. Đã kiểm khung 5,60 và 7,96 s ở 360×640. Ba pha vẫn theo mốc 0 / 2,50 / 5,10 / 8,00 s.
- QC-03. Dời chữ chốt 72 px vào khoảng trống dưới header và hạ mép trên điện thoại. Phép đo cuối hết lỗi khe header 17 px. Đã mở khung 45,34 s sau lần chỉnh cuối.
- QC-04 và QC-05. Nhãn “NGÂN HÀNG” xuống hai dòng trong panel. Nhãn “1 TÀI KHOẢN” neo trong ô đích khi thẻ vào, kiểm ở 40,50 và 27,47 s.
- Dùng lại 14 clip VieNeu, mix bốn lớp và phụ đề của bản đã duyệt. Đã đối chiếu luồng AAC bằng SHA-256. Giữ mốc tiếng mở 0,586 s, sớm hơn ngưỡng đo 14 ms, theo phương án giữ giọng và nhịp đã duyệt. Phép đo biên câu opening đạt.
- qc-publish PASS. So luật tên nền tảng chỉ thấy ba khóa kỹ thuật trong publish.json.
- qc-measure Audio / Visual / Narrative đối chiếu T5. Xem `assets/_scratch/qc-revised/report.md`. Cảnh báo ít chuyển động ở S00/S04 ứng với nhịp đọc tiêu đề, thẻ và khóa nét đứt. Các cảnh báo nhịp, cue, header, nhãn và vùng an toàn còn lại được giữ trong báo cáo, cùng giải trình của lượt 1 phía trên.
- Nguồn bổ sung cho nhóm duyệt. Cổng Thông tin Chính phủ đăng Nghị định 340/2025/NĐ-CP, hiệu lực 09/02/2026. Bản tóm tắt của Công an Lâm Đồng xác nhận điểm a khoản 5 Điều 30 có mức 100–150 triệu cho nhóm hành vi gồm cho mượn từ 1 đến dưới 10 tài khoản thanh toán khi chưa đến mức truy cứu trách nhiệm hình sự. https://vanban.chinhphu.vn/?classid=1&docid=216349&pageid=27160&typegroupid=4 và https://congan.lamdong.gov.vn/canh-bao-nguy-co-bi-xu-phat-nang-khi-cho-muon-cho-thue-tai-khoan-ngan-hang-vi-dien-tu-N11012.aspx
- needs_manual_review. Phát âm, nhịp cảm nhận, độ tự nhiên của giọng và SFX — **CHƯA KIỂM — giám đốc nghe**. Sức hút opening và logic mạch kể — **CHƯA KIỂM**.
- Bốn tệp giao trong final/ gồm IT-T21-E01_9x16.mp4, thumbnail.jpg, captions.srt và publish.json.

- qc-video PASS. 48.81 s, h264 1080x1920 yuv420p, 30 fps, aac 48000Hz, -15.1 LUFS, -2.21 dBTP, LRA 3.3 LU. qc-measure ghi 90 phát hiện, 63 cảnh báo, 0 lỗi.

## QC — lượt 2 (21/11/2026, Claude QC)

**Phán quyết: các lỗi dựng lượt 1 đã sửa thật; không còn lỗi FAIL. Giữ `review`, đánh `QC-CHỜ-NGHE`.** Đo độc lập lại (`qc-measure --baseline T5`, thêm `--frames 27.47,27.0,40.5,37.2`): 90 phát hiện, 63 cảnh báo, 0 lỗi. MP4 48,81 s, 1080×1920, 30 fps, h264/aac 48 kHz, -15,1 LUFS, -2,21 dBTP (qc-video pass); mix.wav -14,29 LUFS/-1,74 dBTP, 0 clip; đuôi im 0,676 s (≤ 0,7). Số lần produce đã chạy: 5 (job 98, 101, 103, 108, 113), dưới trần 10. Gemini vắng (không chạy `look`, không chờ). Đã tự xem 13 khung mới (thumbnail full-res và 180×320, frame-open-end, frame-conclusion, textheavy-S08, nocaption-board, frame-27.47, frame-40.5…).

### Kiểm từng mục lượt 1
| Mã | Kết quả | Bằng chứng |
|---|---|---|
| QC-01 bìa | Đã sửa | thumbnail.jpg full-res: "TIỀN NHÀ" đủ dấu, không cắt "À" (cách mép điện thoại ≈ 5 px, sát nhưng không chạm); "MỘT LẦN THÔI?" nằm trái chip, không che; 180×320 đọc được |
| QC-02 | Đã sửa | frame-open-end: "TÊN AI / TRÊN GIAO DỊCH?" hai dòng, chip ẩn, đáy hộp y≈490 < mép điện thoại y≈520 |
| QC-03 | Đã sửa | frame-conclusion: "KHÔNG CHO MƯỢN" y≈480, cách mép điện thoại (y≈540) ≈ 25 px |
| QC-04 | Đã sửa | frame-40.5 / textheavy-S08: "NGÂN HÀNG" hai dòng trong panel |
| QC-05 | Đã sửa phần lớn | frame-27.47: nhãn "1 TÀI KHOẢN" trong ô đích; chip đang trượt chạm viền trái ô (thoáng qua), chấp nhận |
| mốc tiếng đầu ≥ 0,60 s | Chưa sửa (có chủ ý) | 0,586 s, sớm 14 ms: M-25/M-26 còn cờ (header 83,589% < 95%; opening 8 s ẩn header theo thiết kế). Giám đốc quyết chấp nhận |

### Ba kết luận
- **KỸ THUẬT: Đạt.** Định dạng, loudness, đuôi im, bìa, đè nhãn lượt 1 đã hết; còn cờ lệch 14 ms (M-25/26) và cue chưa gắn hình (M-67..75, onset lệch ≤ 0,07 s), không phải FAIL.
- **TUÂN THỦ: Đạt.** Luật 10: grep `facebook|youtube|zalo|tiktok` trên captions.srt, scenes.json, storyboard.json trống; publish.json chỉ ra 3 khoá nền tảng. Không hình đồ ăn/đôi dép. `ai_generated_content: true` + câu khai báo ở 3 mô tả, không nhãn AI trên hình. `final/` đúng 4 tệp. `approved.json` rỗng, không dùng ảnh Gemini. Nội dung: 100–150 triệu gắn "cho mượn 1 đến dưới 10 tài khoản" (NĐ 340/2025), hệ quả ở dạng "có thể", không Điều 291, không án tù, không vụ cụ thể, không đồng phạm/vô can. Lưu ý (không chặn): giám đốc đối chiếu văn bản gốc Điều 30 NĐ 340/2025 trước khi đăng.
- **TRẢI NGHIỆM: Đạt có điều kiện; phần nghe/cảm nhận CHƯA KIỂM.**

### 5 câu hỏi người xem lạ
1 Đạt (0–3 s tin nhắn nhờ nhận hộ + TIỀN NHÀ). 2 Đạt (thẻ YÊU CẦU GIẢI TRÌNH đỏ nét đứt trước 5 s). 3 Đạt có điều kiện (nocaption-board hiểu S03–S08; picture.mp4 CHƯA KIỂM). 4 Đạt có cảnh báo (S00 4,89–8,14 s im 3,25 s, hình gần tĩnh, S00 tĩnh 50,6%). 5 Đạt: bìa sạch dấu, đọc được ở 180×320; kết quay về bàn + câu hỏi; đuôi 0,676 s.

### Y1–Y8
Y1 Đạt có cảnh báo (59 từ/phút > 45, 10 từ đồng thời S00; không chữ thừa/nhãn AI); Y2 Đạt có điều kiện (S00, S08 1 s, S09); Y3 Đạt có điều kiện (Cáo ≈ 22,9% theo Producer, QC chưa đếm khung); Y4 Đạt; Y5 Đạt; Y6 CHƯA KIỂM — giám đốc nghe (5,42 âm tiết/s > dải thử 4,6–4,8); Y7 CHƯA KIỂM — giám đốc nghe (22 nghỉ, max 3,25 s ở 4,9–8,1 s; 6 giữ-sau-lời 1,2–2,2 s đã loại trừ vì có chủ đích); Y8 Đạt phần văn bản (phonemes mã 0), nghe CHƯA KIỂM.

### D8
R20 opening 0–8 s ba pha 0/2,5/5,1, lệch 14 ms; R21 header ≥ 52 px, 0 đè, 6 lần đổi ô, phủ 83,589%; R3 nhãn đè nhãn 0 cặp; R22 100% cảnh có chữ, 59 từ/phút (> 45), kinetic đạt; R23 0/14 câu cờ biên, splice `[]`, nghe CHƯA KIỂM.

### needs_manual_review — CHƯA KIỂM — giám đốc nghe/xem
Độ tự nhiên giọng, nuốt/kéo chữ; phát âm "giải trình" (5,5 s/20,4 s), "phong toả" (18,5 s), "sao kê" (37,9–39 s); tốc độ cảm nhận 5,4 âm tiết/s; nhịp nghỉ 4,9–8,1 s và các giữ-sau-lời; độ êm SFX/impact (SFX -42,7 LUFS rất nhỏ); sức hút opening; logic mạch kể S03→S06; picture.mp4 tắt tiếng; độ mờ khi đổi ô header; Cáo ≤ 25% đếm khung; chấp nhận lệch 14 ms (M-25/26).
