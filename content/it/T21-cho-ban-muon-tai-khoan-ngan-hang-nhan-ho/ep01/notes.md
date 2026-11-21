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
