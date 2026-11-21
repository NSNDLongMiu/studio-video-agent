# Ghi chú IT-T19-E01

- Cáo ≈ 20% thời lượng (11,38 s / 57,05 s) là theo bản đồ Cáo đã duyệt ở script (mở/kết, không che sơ đồ).
- Storyboard: Codex làm, `visual-director` duyệt APPROVED ở vòng 2 (r1 CẦN SỬA 5 điểm nhịp giữ/đổi hình/vị trí header, đã sửa đủ).
- Bước 4b ảnh sinh: Gemini vắng (NO_ACCOUNT, thử lại 1 lần, 21/11/2026) → không có ảnh AI (`assets/gen/approved.json` `images: []`). Nền quán cà phê cho S00, đầu S07, S09 dựng bằng Pillow/`tools/backgrounds` theo brief ở `review/gemini-images-S00-r1.prompt.md` (bàn trống, không đồ ăn/đồ uống, không chữ/logo/người).

## Rescue lần 4 (Claude, job 93, 21/11/2026) — THAY mọi hướng dẫn S05 cũ mâu thuẫn (kể cả dòng "S05 chữ (đã chốt)" bên dưới và mốc 3,85–4,75 s)

Nguyên nhân gốc: mốc cũ cho bong bóng "Chị Lan nhờ tao nhắn mày" chỉ 0,90 s (3,85–4,75 s) nên không thể thoả QC-05 (≥ 1,9 s). Đây là lỗi dựng/thời gian, không phải thiết kế: cảnh, nội dung, số nhóm chữ, vị trí giữ nguyên. Claude Rescue chỉnh mốc thời gian, không đổi thiết kế (đã sửa `storyboard.json` S05 `semantic_plan.texts` + `animation_timeline`, vẫn APPROVED).

Mốc mới S05 (tính từ đầu cảnh; cộng 23,75 s ra giờ toàn video; "người quen mình" nói 3,78–4,71 s cảnh):
- `BẠN BÈ`: 0,25–3,55 s.
- `NẾU CÔNG KHAI`: 0,25–5,80 s (không đổi).
- `Chị Lan nhờ tao nhắn mày`: 3,55–5,45 s (1,90 s; hiện sớm 0,23 s so với lời "người quen mình", lúc Cáo đã rời rìa ở 3,78 s; sự kiện hình + tiếng báo tin dời về 3,55 s).
- `ok`: 5,00–5,80 s (0,80 s; nằm trong khoảng giữ 1,09 s sau lời).
- Số nhóm chữ đồng thời tối đa 3 (NẾU CÔNG KHAI + tin + ok, chỉ chồng 0,45 s ở 5,00–5,45 s; từ lúc 3,55 s BẠN BÈ đã tắt). Ở lúc chồng, đặt "ok" ở bong bóng hồi đáp phía Mít, tin đỏ ở phía thẻ khác, cả hai KHÔNG che đầu/avatar của Cáo hay thẻ thật; giữ khe với phụ đề ≥ 24 px.
- Tin đỏ thu thành icon ở 5,45 s. Cột "Chữ trên màn hình" S05 trong script.md: Producer dựng theo storyboard (mốc giây toàn video = +23,75: BẠN BÈ 24,00–27,30; tin 27,30–29,20; ok 28,75–29,55).
- SFX báo tin dời 3,55 s cảnh (27,30 s). Căn lại theo `voice-timeline` thật nếu giọng đã co giãn, giữ chênh lệch tương đối trên.
- Các yêu cầu QC khác (QC-01..04, 06) giữ nguyên như mục "QC — cần sửa".


- **S05 chữ (đã chốt):** xác nhận hiển thị tuần tự của storyboard APPROVED vòng 2 (semantic_plan.texts: BẠN BÈ 0,25–3,85 s; NẾU CÔNG KHAI 0,25–5,8 s; "Chị Lan nhờ tao nhắn mày" 3,85–4,75 s; "ok" 4,75–5,8 s, tính từ đầu cảnh = +23,75 s). Tối đa 3 nhóm chữ đồng thời (ở 3,85 s BẠN BÈ tắt đúng lúc tin nhắn hiện). Đã sửa cột "Chữ trên màn hình" S05 trong script.md cho khớp: BẠN BÈ 24,00–27,60; NẾU CÔNG KHAI 24,00–29,55; tin chị Lan 27,60–28,50; ok 28,50–29,55. Storyboard giữ nguyên APPROVED, không sửa. Producer theo storyboard.
- **Lỗi "ai" → "eigh eye" (nguyên nhân gốc):** `tools/voice/pronunciation.json` có mục chung `AI` (kind letters, tts "eigh eye"); `pronounce.mjs` so khớp không phân biệt hoa/thường (cờ `giu`, hàm `key`), nên đại từ tiếng Việt "ai" ở lời 03, 04, 15 bị thay. Đây là hạn chế của công cụ chung (không có cờ phân biệt hoa/thường hay ngoại lệ theo ngữ cảnh). **Đề xuất giám đốc (không tự sửa tools/):** thêm tuỳ chọn khớp phân biệt hoa/thường cho mục chữ viết tắt, hoặc đổi mục chung thành "A.I."/bí danh riêng.
- **Cách xử lý trong phạm vi video:** đã tạo `assets/voice/pronunciation.local.json` (mục riêng ghi đè mục chung): `AI` → tts "ai" (kind word, lang vi, verified false), thêm `hack`, `chat` (giữ chữ gốc). Producer: luôn chạy `pronounce.mjs check/apply --extra` với tệp này; xác nhận `apply --json` cho lời 03 "Không ai hack mình…", 04 "…từ ai?", 15 "…gọi ai trước?" giữ nguyên "ai" và `hack`/`chat` không bị đổi, rồi `phonemes.py --lines … --extra` mã 0 trước khi sinh giọng. Rescue không chạy được lệnh này (bị chặn quyền), nên CHƯA xác nhận bằng chạy thật. Tiêu đề trên hình "AI NHẮN THAY BẠN?" là chữ hiển thị, không đưa vào TTS. Không `init-extra` nữa (tệp đã có, thư mục `assets/voice` đã tạo). Chạy lại `/produce IT-T19-E01 --force`. CHƯA KIỂM — giám đốc nghe lời 03, 04, 15.

## Rescue lần 3 (Claude, 21/11/2026): chốt S00/S01, neo lời 02/03, S09 và đuôi

**Nguyên nhân gốc:** script dự kiến lời 01 dài 3,09 s (0,60–3,69) nhưng giọng thật chỉ 2,18 s (0,60–2,78). Mọi mốc sau lời 01 trong S00 và đuôi S09 (lời 15 dứt sớm 1,14 s) trượt theo; không phải lỗi thiết kế hay lỗi công cụ. Storyboard S00 gộp S01+S02 của script (cú cắt 3,70 s trong cùng cảnh 0–8 s).

**Claude duyệt: chỉnh mốc thời gian, không đổi thiết kế, storyboard giữ APPROVED.** Storyboard APPROVED là chuẩn hình.
1. **S01 chữ tin vay:** `Cho tao vay 5 triệu nha` 0,10–**2,30** s (script đã sửa cho khớp storyboard; từ 2,30 s là bong bóng hỏi của Mít 2,30–3,60 s).
2. **Neo giọng S00 (tuyệt đối từ đầu video, dung sai ±0,05 s):** lời 01 0,60–2,78 · nghỉ 1,07 s (câu hỏi treo của Mít, trong khoảng 0,7–1,2 s Y7) · **lời 02 bắt đầu 3,85 s** (ngay sau cú cắt 3,70) → dứt 4,73 · nghỉ 0,73 s (tiêu đề hiện 5,00 s, người xem đọc 0,46 s trước lời) · **lời 03 bắt đầu 5,46 s** → dứt 6,89 · giữ 1,11 s đến hết cảnh 8,00 s (tick xanh 7,20 s, sound cue không đổi) · lời 04 vẫn 8,15 s. Đã ghi vào `voice_direction` của S00 (pause_after 01 = 1,07; 02 = 0,73/1,07; 03 = 0,73/1,11) và `hold_after_voice_s`/`hold_s` S00 = 1,11.
3. **Neo S09 (cảnh bắt đầu 50,85 s theo fit):** lời 14 51,00–52,63 · nghỉ 1,20 s (ý quan trọng, đồng xu tắt ở 2,45 s trong cảnh = 53,30 s nằm trong khoảng nghỉ) · lời 15 53,83–55,85 · **đuôi 0,65 s** (≤ 0,7) · hết cảnh 56,50 s. Storyboard S09: `duration_s` 6,2 → **5,65**; `hold_after_voice_s`/`hold_s` 0,65; chữ `GỌI XÁC MINH` tắt 5,00 s (trước 5,65), event "chữ chốt rời" t=5,00, sound cue `silence` t=5,00 dài 0,65; `voice_direction` 14 pause_after 1,20, 15 pause_before 1,20 / pause_after 0,65. Các mốc hình còn lại của S09 (0,45; 0,75; 1,45; 2,45; 3,55; 4,70) giữ nguyên.
4. **Tổng thời lượng mục tiêu: 56,50 s** (trong 45–75 s và 55–62 s). `assets/voice/fit-scenes.json` đã sửa S00 hold 1,11 và S09 end 56,5 / hold 0,65; các cảnh S03–S08 giữ nguyên cửa sổ (đã 0 lỗi, tổng giữ khớp).
5. **Mốc lời 05–13:** dùng thời điểm lời thật của fit (lời 05 10,76; 07 17,63; 08 24,20; …) — lệch ≤ ~0,45 s so với dự kiến script; Producer dịch sự kiện hình gắn lời theo đúng độ lệch (R16/R8: hình hiện cùng hoặc ≤ 0,5 s sau lời nhắc). Không cần hỏi lại.

**Việc cho Codex (`/produce IT-T19-E01 --force`), không cần hỏi thêm:**
- Giữ 15 WAV đã sinh (line-cache), KHÔNG sinh lại giọng. Chạy lại `prosody.mjs plan` từ storyboard đã sửa (hoặc đặt override pause như mục 2–3) rồi `prosody.mjs timeline --mode fit --scenes assets/voice/fit-scenes.json`; xác nhận bằng số đo: lời 02 = 3,85 ± 0,05; lời 03 = 5,46 ± 0,05; lời 15 dứt 55,85 ± 0,05; tổng = 56,50 ± 0,05; đuôi im ≤ 0,7. Nếu công cụ ép pause khác (khoảng pause theo ý định rules), tự đặt trực tiếp mốc bắt đầu trong `voice-fit-timeline.json` đúng các số trên rồi `assemble.py` và `splice.py check` (kỳ vọng 15 cửa sổ, 0 vi phạm). Không tăng tốc giọng để bù.
- Sau đó mix, dựng, `qc-measure`; `needs_manual_review` giữ CHƯA KIỂM (phát âm, tốc độ cảm nhận, nghỉ treo 1,07 s ở S00 có tự nhiên không, sức hút opening — giám đốc nghe).

## Sản xuất — vướng trước khi dựng

- S05: đối chiếu cột “Chữ trên màn hình” trong script.md với semantic_plan.texts của storyboard APPROVED. Kịch bản giữ “BẠN BÈ”, “NẾU CÔNG KHAI”, tin nhắn nhắc chị Lan và “ok” đồng thời từ 28,50 đến 29,55 s. Storyboard ẩn “BẠN BÈ” ở 3,85 s tính từ đầu S05 và thay tin nhắn nhắc chị Lan bằng “ok” ở 4,75 s. Nếu theo kịch bản, đoạn cuối có bốn nhóm chữ ngoài header/phụ đề, vượt trần ba nhóm. Đề nghị Claude xác nhận mốc storyboard vòng 2 và cập nhật cột chữ S05 để hai đầu vào thống nhất.
- Chạy node tools/voice/pronounce.mjs check với cột “Lời đọc”. Kết quả gắn mục tiếng Anh AI vào ba chữ “ai” tiếng Việt, còn hack và chat báo thiếu mục. Chạy tiếp apply --json và xác nhận đầu ra sai ở lời 03, 04, 15: “Không eigh eye hack mình…”, “…từ eigh eye?”, “…gọi eigh eye trước?”. Biểu thức so khớp từ điển dùng cờ i. Phương án trong phạm vi video: dùng bản đầu vào TTS hoặc từ điển riêng cho lượt xử lý tiếng Việt và xác nhận “ai” giữ nguyên ở cả ba câu qua apply và phonemes trước khi sinh giọng.
- Thử init-extra để chuẩn bị mục hack và chat. Công cụ trả ENOENT: no such file or directory vì assets/voice chưa tồn tại. Có thể tạo thư mục này khi tiếp tục. Chưa sinh giọng, chưa dựng và chưa chạy QC. CHƯA KIỂM — giám đốc nghe.

## Producer — kiểm đầu vào và ghép thử giọng

- Đã xác nhận S05 theo bản Claude sửa. S00 còn lệch: dòng S01 của script giữ tin “Cho tao vay 5 triệu nha” từ 0,10 đến 3,70 s. `semantic_plan.texts` và `animation_timeline` của storyboard S00 tắt chữ này ở 2,30 s, đổi sang bong bóng hỏi của Mít và chỉ giữ dấu vết tin bằng hình. Đề xuất Visual Director giữ chuyển động đã duyệt và Script cập nhật mốc chữ thành 0,10–2,30 s. Nền quán theo brief đã duyệt, danh sách ảnh Gemini trống.
- `pronounce.mjs check --extra ... --ignore vay,gian,danh,khai,quen,sao,ngay`: 0 mục lạ. `apply --json` giữ đúng “ai” ở lời 03, 04, 15. `phonemes.py --lines ... --extra ...`: mã 0. Đã sinh 15 câu giọng Hải Đăng bằng `prosody.mjs plan` và `gen_vo.py --plan`. Giữ đệm gốc 60 ms đầu, 140 ms sau.
- Hai lần thử timeline với cùng WAV: `prosody.mjs timeline --mode free` cho 44,70169 s (dưới 45 s chuẩn và 55–62 s mục tiêu); `--mode fit --scenes assets/voice/fit-scenes.json` cho 57,050 s theo ffprobe, không tăng tốc thêm, nhưng lời 02 bắt đầu 2,98494 s trước cú cắt 3,70 s, lời 03 bắt đầu 4,31048 s trước pha topic reveal tại 5,00 s, lời 15 dứt 55,34679 s và dư đuôi 1,70321 s (trần 0,7 s). Đề xuất neo lời 02 ở 3,85 s, lời 03 ở 5,46 s, và chốt lại nhịp hai câu kết/hold S09 theo giọng thật, ưu tiên giữ mốc đồng xu tắt; nhờ Script/Visual Director xác nhận timeline và đồng bộ mốc hình theo R8.
- `assemble.py` đã ghép bản thử `assets/voice/voice-fit.wav`. `splice.py check --windows assets/voice/voice-fit-windows.json` đo 15 cửa sổ câu, 0 vi phạm; `fit-metrics.json` cũng báo 15 cửa sổ, 0 vi phạm. Bản ghép thử chưa dùng để mux.
- Nghe kiểm: ai → ai (ˈaːj, riêng, tiếng Việt) `assets/voice/term-check/ai.wav`; hack → hack (hˈæk, riêng) `assets/voice/term-check/hack.wav`; phở bò → phở bò (fˈəː4 bˈɔ2, chung) `assets/voice/term-check/pho-bo.wav`; chat → chat (tʃˈæt, riêng) `assets/voice/term-check/chat.wav`. Phát âm, tốc độ cảm nhận, độ tự nhiên của giọng và độ êm âm thanh: CHƯA KIỂM — giám đốc nghe. Sức hút opening và logic mạch kể: CHƯA KIỂM.
- Dừng trước render để đồng bộ hai đầu vào. Chưa trộn âm, xuất thành phẩm hoặc chạy QC video.

## Producer — kiểm lại giọng sau Rescue lần 3

- Dùng lại 15 clip cache. `prosody.mjs plan` và `timeline --mode fit` báo S00 thiếu 0,00187 s. Ghép thử theo mốc đã duyệt với lời 03 vào ở 5,455 s (trong ±0,05 s), lời 02 vào 3,850 s và lời 15 dứt 55,847 s theo cue PCM. `assemble.py` xuất `assets/voice/voice-resume.wav`. `ffprobe`: 56,500 s. `splice.py check` đo 15 cửa sổ và trả `[]` (0 vi phạm).
- Đo tốc độ theo cách đếm của QC trên WAV trước trộn: 158 cụm chữ hoặc số, 28,772 s có tiếng, 5,49 âm tiết/s. Plan nhắm khoảng 4,6–4,8. `ffmpeg silencedetect=noise=-40dB:d=0.12` đo đuôi 0,704542 s (cue dự kiến 0,653 s). Khoảng nghỉ dài nhất giữa lời 07 và 08 là 4,158 s.
- Phương án thứ hai: thử FFmpeg `atempo=0.85` chỉ trên phần thân S03–S08, giữ nguyên giọng opening và kết. Phép thử trước khi xếp lại khoảng nghỉ đo 4,86 âm tiết/s và kéo bản thử đến 64,034 s, làm lệch mốc tuyệt đối đoạn kết. Đề nghị duyệt giảm tốc theo từng câu, rút ngắn khoảng nghỉ dài ở thân và xác nhận lại mốc S00/S09 theo giọng đo được, hoặc xác nhận dùng tốc độ WAV hiện tại với mốc đã duyệt.
- Dừng trước trộn và dựng để chốt tốc độ. Chưa có thành phẩm và chưa chạy QC video. Phát âm, tốc độ cảm nhận, độ tự nhiên của giọng và âm thanh: CHƯA KIỂM — giám đốc nghe. Sức hút opening và logic mạch kể: CHƯA KIỂM.

## Rescue 4 (Claude, 21/11/2026): QUYẾT ĐỊNH tốc độ giọng — hạ về 4,75 âm tiết/s, không giữ 5,49

**Phân xử.** (1) 4,6–4,8 là chuẩn cứng của xưởng, không riêng plan: `docs/chat-luong-xem.md` (Speech Pace) định nghĩa nó chính là số đo `qc-measure` (`speech_pace_syll_s` = âm tiết ÷ giây CÓ TIẾNG, bỏ khoảng lặng ≥ 0,12 s). T8 = 4,19 (+10–15% → 4,6–4,8); trần hệ số 1,20 (4,19 × 1,20 = 5,03). 5,49 = T8 × 1,31, vượt trần: không giữ được. (2) Cách đo của Codex (158 âm tiết / 28,772 s có tiếng) cùng cách đo với chuẩn, so trực tiếp được; plan.md dòng 43 cũng ghi "4,6–4,8 âm tiết/s có tiếng". Số 4,3 trong bảng ngân sách là cách tính khác (theo thời lượng đọc từng câu, gồm nghỉ trong câu), chỉ để dự kiến thời lượng, không phải mục tiêu đo. (3) Docs đã dự liệu ca này: giọng Hải Đăng nhanh, phải hạ atempo, không hạ chuẩn. Thử atempo 0.85 chỉ ở thân là sai hướng (opening/kết vẫn 5,49).

**Nguyên nhân gốc:** giọng Hải Đăng sinh 5,49 âm tiết/s; Rescue 3 chốt mốc theo giọng thô chưa hạ tốc. Không phải lỗi công cụ.

**Quyết định (Codex làm theo ngay):** áp `atempo=0.865` ĐỒNG ĐỀU cho cả 15 clip (5,49 × 0,865 = 4,75; trong sàn 0,85 / trần 1,20), không chỉ thân. Không sinh lại giọng; dùng `line-cache` làm nguồn, xuất bản chậm sang thư mục mới (vd `assets/voice/line-cache-slow/`), không ghi đè bản gốc.
1. Mỗi WAV cache: `ffmpeg -i in.wav -filter:a atempo=0.865 out.wav`; giữ đệm 60 ms đầu / 140 ms cuối.
2. Độ dài mới mỗi lời = cũ ÷ 0,865 (tổng có tiếng 28,772 → ≈ 33,26 s, +4,49 s).
3. **S00 giữ nguyên 0–8,00 s và mốc cắt 3,70 / tiêu đề 5,00 / tick 7,20:** lời 01 vào 0,60 (≈ 2,53 s, dứt ≈ 3,13, nghỉ ≈ 0,72, trong 0,7–1,2); lời 02 vào 3,85 (≈ 1,01, dứt ≈ 4,86); lời 03 vào 5,455 (≈ 1,65, dứt ≈ 7,11); hold đến 8,00 ≈ 0,89 s (đổi `hold_after_voice_s` S00 1,11 → ≈ 0,89). Dùng số đo thật, dung sai ±0,05 s.
4. **S03–S09:** giữ pause_before/pause_after và hold_after_voice hiện có; mỗi cảnh DÀI THÊM đúng phần thời lượng lời tăng của nó (cảnh sau bắt đầu = hết cảnh trước); lời 04 vẫn vào 8,15. Tổng dự kiến ≈ 56,50 + 4,49 − 0,68 (S00 hấp thụ) ≈ **60,3 s** (trong 45–75 s và mục tiêu 55–62 s). Cập nhật `fit-scenes.json`, `duration_s` S03–S09 trong storyboard.json và mốc hình gắn lời (dịch theo độ lệch của lời; R16: hình cùng hoặc ≤ 0,5 s sau lời). Chỉ đổi số thời gian như Rescue 3, thiết kế/APPROVED giữ nguyên. Nếu tổng > 62 s có thể trừ tối đa 0,5 s ở hold S04 (2,02 → ≥ 1,5); khoảng ≈ 4,07 s giữa lời 07 và 08 là giữ-sau-lời cho sơ đồ, không rút quá mức.
5. **Đuôi S09:** lời 15 dứt tại (tổng − 0,60). Đặt đuôi im 0,60 s (không phải 0,65) vì silencedetect −40 dB đo cộng đệm ≈ +0,05 s; mục tiêu đo ≤ 0,70 s. Nghỉ 1,20 s giữa lời 14 và 15, `sound_cue silence`, chữ `GỌI XÁC MINH` tắt, đồng xu tắt: giữ quan hệ tương đối với lời.
6. Kiểm: `assemble.py` → `splice.py check` (15 cửa sổ, 0 vi phạm); đo lại âm tiết/s trên WAV trước trộn = 4,6–4,8 (4,80–4,85 thì chấp nhận và ghi số, không hạ dưới sàn 0,85); `ffprobe` tổng 59,5–62,0 s. Rồi trộn, dựng, `qc-measure ep01 --baseline docs/baseline/T5-qc-auto.json`; QC báo cả số MP4 và số giọng gốc (`speech_pace_voice_syll_s`).
7. Không hỏi lại. Nghe tốc độ cảm nhận, độ méo sau atempo, phát âm: CHƯA KIỂM — giám đốc nghe.

Không cần giám đốc quyết (không mâu thuẫn chuẩn). Chạy lại `/produce IT-T19-E01 --force`.

## Producer — Thành phẩm giao review

- Bốn tệp giao gồm `final/IT-T19-E01_9x16.mp4`, `final/thumbnail.jpg`, `final/captions.srt` và `final/publish.json`. Bản sạch chữ phụ đề ở `assets/_scratch/picture.mp4`. Báo cáo Audio, Visual và Narrative ở `assets/_scratch/qc-auto/report.md` và `report.json`.
- Hình nền quán S00, đầu S07 và S09 dựng bằng Pillow theo brief đã duyệt. Các cảnh còn lại dùng nền kính, lưới hoặc bề mặt sáng và đồ họa giao diện trung tính. Danh sách Gemini trống. Nguồn hình Cáo là `brand/cao/poses/`. Mã dựng ghép trực tiếp các dáng sprite theo lớp và mốc cảnh để đặt Cáo sau mặt bàn, trên lớp minh họa hoặc ở rìa. Ảnh đại diện trên thẻ dùng cùng một sprite để đối chiếu hai hồ sơ. Hiệu ứng âm thanh dùng tài sản tổng hợp CC0, nhạc tắt.
- Dùng lại 15 clip giọng Hải Đăng, áp `atempo=0.865` và ghép từ timeline mới theo Rescue 4. Mốc PCM lời 02 = 3,850 s, lời 03 = 5,455 s, lời 15 kết thúc 60,130 s. Bản giọng dài 60,730 s. `splice.py check`, `prosody_metrics.py` và QC trên stem đều kiểm 15 cửa sổ, 0 vi phạm biên. Khoảng đệm theo clip là 60 ms trước và 140 ms sau. Đuôi lặng WAV −40 dB là 0,679 s. Đuôi đo trên MP4 là 0,635 s. Tốc độ 4,631 âm tiết/s trên stem và 4,495 trên MP4. Bản trộn giữ bốn stem tại `assets/audio/stems/`. Khi mã hóa AAC giảm 0,90 dB để giữ true peak dưới trần.
- `qc-video` PASS, 0 lỗi. 60,750 s, H.264 yuv420p 1080×1920, 24 fps, AAC 48 kHz, −15,10 LUFS và −1,76 dBTP. Đổi hình đầu tại 0,10 s. Đoạn tĩnh dài nhất 1,6 s. Cảnh báo ít chuyển động ở S05 và S08. S05 giữ vòng để đọc điều kiện và lần lượt theo tia nhìn, tin đến, hồi đáp. S08 giữ các hồ sơ cố định để người xem thấy chuông, cờ và phạm vi mắt thay đổi theo từng bước. `qc-publish` PASS, 0 lỗi và 0 cảnh báo. Kiểm tên nền tảng trong SRT, storyboard, timeline và các khối đăng không có kết quả cấm.
- `qc-measure` ghi 0 lỗi, 65 cảnh báo. Opening 8 s đạt kiểm tra mốc, đủ ba pha và đọc được tiêu đề theo phép đo. Header đo phủ 100% sau opening, 0 giao cắt. Công cụ vẫn gắn cờ năm lần đổi vị trí vì đo thời gian hai thẻ cùng hiện, trong khi bản dựng trượt một thẻ giữa hai vị trí. Đã mở ảnh bìa 180×320, khung đầu, giữa và cuối 360×640 và các cặp khung camera S00/S04/S07. Các cờ vùng an toàn của một số khung chuyển, độ gần và thời gian đọc nhãn vẫn nằm trong báo cáo để đối chiếu khi xem.
- Cảnh báo âm thanh chủ yếu là nhịp nghỉ lệch mốc kịch bản cũ sau khi kéo giọng và giữ các sơ đồ đã hoàn chỉnh. Khoảng nghỉ dài nhất nằm giữa lời 07 và 08, đi cùng vệt nhìn chạy tới ảnh/tên và đổi sang vòng bạn bè. Khoảng nghỉ dài cuối S08 đi cùng thay đổi phạm vi mắt và đưa các biểu tượng về hàng. Cue chính đã đặt theo mốc hình thực; nhật ký dựng này không khai liên kết cue với từng đối tượng nên công cụ gắn cờ. Cue tích xanh opening còn cờ onset được đo. Cue lặp và tương quan cảm nhận chờ nghe.
- Cảnh báo nhãn phần lớn đến từ mốc storyboard gốc so với bản co giãn theo giọng, hoặc từ các đối tượng storyboard chỉ định dùng icon thay cho chữ riêng. S05 giữ câu chat và chip điều kiện đúng thứ tự, phép đếm tự động báo đỉnh 9 từ. Báo cáo tính 2 lần kinetic ngoài tiêu đề opening. Bản dựng giữ hiệu ứng ở các nhãn đã duyệt, không thêm nhãn vào các biểu tượng. S01/S02 được dựng thành S00 với cú cắt nội cảnh tại 3,70 s.

### Đối chiếu Y1–Y8

| Mục | Bằng chứng hoặc phần chờ duyệt |
|---|---|
| Y1 | Chữ hình từ storyboard và kịch bản, lớp ASS riêng 56 px, mỗi phụ đề tối đa 2 dòng và 28 ký tự mỗi dòng. Đã kiểm dấu và khả năng đọc ở các khung chọn. |
| Y2 | Cáo diễn ở opening, S05 và S09. Hình Cáo trong hồ sơ chỉ đóng vai ảnh đại diện. |
| Y3 | Cáo mở dùng 350 px, hai nhịp kèm minh họa dùng 160 và 180 px. Khung kiểm cuối giữ khe với phụ đề. |
| Y4 | Nền quán, kính điện thoại, dữ liệu và giao diện gọi đổi theo bối cảnh. Các cặp khung camera được lưu trong QC. |
| Y5 | Từ ngón tay gần nút chuyển ở opening đến đổi kênh xác minh và đồng xu tắt ở kết. |
| Y6 | Stem đo 4,631 âm tiết/s. Tốc độ và độ tự nhiên cảm nhận CHƯA KIỂM — giám đốc nghe. |
| Y7 | Đã đo các khoảng nghỉ và đuôi. Nhịp treo câu hỏi, các khoảng giữ sơ đồ dài và độ êm hiệu ứng CHƯA KIỂM — giám đốc nghe. |
| Y8 | Từ điển riêng giữ đúng «ai» tiếng Việt, «hack» và «chat». Clip nghe kiểm nằm ở `assets/voice/term-check/`, gồm `ai.wav`, `hack.wav`, `chat.wav`, `pho-bo.wav`. Phát âm CHƯA KIỂM — giám đốc nghe. |

### needs_manual_review

| Hạng mục | Trạng thái |
|---|---|
| Phát âm, nhấn ý, tốc độ, giọng tự nhiên và độ méo sau giảm tốc | CHƯA KIỂM — giám đốc nghe |
| Độ êm của SFX/impact và nhịp nghỉ khi nghe | CHƯA KIỂM — giám đốc nghe |
| Sức hút opening, đồng bộ theo từng từ và logic mạch kể | CHƯA KIỂM |

## QC (Claude, 21/11/2026)

Công cụ: `node tools/qc-measure.mjs ep01 --baseline docs/baseline/T5-qc-auto.json` (hồ sơ standard; 94 phát hiện, 65 cảnh báo, 0 lỗi; `qc-video` nằm trong qc-measure, 0 lỗi). Báo cáo: `assets/_scratch/qc-auto/report.md`. Gemini xem trước: Gemini vắng (lệnh `gemini-run.mjs look` bị từ chối quyền trong phiên nền; ghế Gemini cũng NO_ACCOUNT từ bước tạo ảnh). Khung tự xem: board-01..04, thumb-180x320, header-zones, cộng 4 khung full-res riêng (6,05 / 29,6 / 42,8 / 48,3 s; `qc-f-*.png`).

### Kết luận ba trục

| Trục | Kết luận | Bằng chứng |
|---|---|---|
| KỸ THUẬT | Đạt phần đo, CÒN lỗi dựng nhỏ | 60,75 s, 1080×1920, 24 fps, h264/aac; mix -14,2 LUFS (qc-measure Audio) / -15,10 LUFS tích hợp MP4, true peak -1,81 dBTP; đuôi im 0,635 s; 4,631 âm tiết/s trên WAV giọng gốc (4,495 trên MP4, +20,7% so với T5 3,837); R23 0/15 câu cờ; header 100% sau opening, 0 cặp chữ giao bbox. SFX rất nhỏ (-43,8 LUFS, đỉnh -28 dBFS), 9/9 cue không gắn hình. |
| TUÂN THỦ | Đạt | Luật 10: grep `facebook|youtube|zalo|tiktok` trên `captions.srt`, `scenes.json`, `storyboard.json`, `publish.json` = 0 kết quả (chỉ `script.md` nội bộ/URL nguồn); hashtag `#phobo`; không ảnh Gemini (`approved.json` rỗng, đã khai lý do), không dòng LICENSES cần thêm (Cáo từ `brand/`, nền Pillow); `final/` đúng 4 tệp; storyboard APPROVED; ví dụ dựng ghi ở publish.json, không đốt lên hình; không hướng dẫn làm giả; không thấy đồ ăn/đôi dép/người thật/logo trong các khung đã xem. |
| TRẢI NGHIỆM | Chưa đạt (lỗi dựng chữ/đồng bộ) + nhiều mục CHƯA KIỂM | Xem bảng lỗi. |

### Bảng lỗi và cảnh báo

| Mã | Nhóm | Mốc | Bằng chứng | Mức | Đề nghị |
|---|---|---|---|---|---|
| QC-01 | TRẢI NGHIỆM · R3/Y1 | S08 · 48,0–49,9 s | `qc-f-48.3.png`: nhãn «BÁO BẠN BÈ» chồng lên chuông và ba avatar, chữ «BẠN» bị che một phần (M-93: hiện chỉ 0,71 s) | LỖI dựng | Đặt nhãn ra khỏi cụm chuông/avatar (dưới thẻ hoặc cạnh chuông), giữ ≥ 1,0 s |
| QC-02 | TRẢI NGHIỆM · R3/Y1 | S07 · 41,5–47 s | `qc-f-42.8.png`: «SỐ ĐÃ LƯU» đè lên avatar Cáo, mép dưới thẻ và bàn tay; không gắn gọn vào mục danh bạ | LỖI dựng | Dời nhãn xuống dưới/trên thẻ, cách đối tượng ≥ 24 px, không che avatar |
| QC-03 | KỸ THUẬT · R3 (vùng an toàn) | S00 · 5,9–6,3 s (M-86..89) | `qc-f-6.05.png`: thẻ «TÀI KHOẢN THẬT» nằm nửa ngoài mép trái, chữ bị cắt thành «OẢN THẬT», nhãn trên sàn bàn (M-48 cách đối tượng 141 px) | LỖI dựng | Cho thẻ trượt vào nhanh hơn/vào hẳn trong khung trước khi hiện nhãn, nhãn gắn sát thẻ |
| QC-04 | TRẢI NGHIỆM · R16/R22 | S03 · 8,42 s so với lời 11,07 s | M-94 + `board-01.png` ô 10 s: nhãn «HỒ SƠ KHÁC» và thẻ dưới hiện khi lời mới hỏi «từ ai?»; lộ đáp án sớm ~2,7 s (M-29: thiếu chữ ở mốc 11,4 s kế hoạch) | LỖI dựng | Dời nhãn và thẻ dưới về ≥ 11,07 s theo lời 05 |
| QC-05 | TRẢI NGHIỆM · Y1/R3 | S05 · 28,5–30 s (M-17, M-25, M-92) | `qc-f-29.6.png`: bong bóng «Chị Lan nhờ tao nhắn mày» che đầu Cáo ở thẻ thật; 9 từ cùng lúc (ngưỡng 8); hiện 1,5 s | CẢNH BÁO nặng | Dời bong bóng sang vị trí không che avatar, kéo dài ≥ 1,9 s |
| QC-06 | KỸ THUẬT · âm thanh | cả video (M-75..85) | SFX -43,78 LUFS, đỉnh -27,99 dBFS; impact đỉnh -26 dBFS; 0/9 cue đạt hai mốc | CẢNH BÁO | Nâng mức SFX để nghe được, khai liên kết cue↔đối tượng trong render-log |
| M-26/M-27 | R22 | cả video | kinetic 0,823/25 s (<1); chữ đúng mốc 78,9% (<80%) | cảnh báo | Sửa theo QC-04; thêm một kinetic ở thân |
| M-24 | R22 | cả video | 54,3 từ/phút (khoảng thử 20–45) | cảnh báo | Chấp nhận nếu rút chữ không làm mất keyword; ưu tiên rút nhãn trùng |
| M-06, M-11, M-69..74 | Y7 | 21,4–25,6 s (4,12 s) và 51,1–54,7 s (3,65 s); thêm 4 khoảng 2,1–2,9 s | silencedetect; nghỉ đo gấp 1,3–2,1× kế hoạch (vd 07→08 kế hoạch 2,02, đo 4,117); tỉ lệ lặng 43,8% (T5: 34%) | cảnh báo | Nghe có lê thê không (CHƯA KIỂM). Hình đang đổi (S04 lock/mắt, S08 chuông/cờ/khoá) nên chưa thấy hình chết; cân nhắc rút 4,1 s xuống ≤ 3 s |
| M-01, M-02 | R4 | S05 25,4–31,7 s; S08 47,0–54,6 s | trung vị 0 khối hoạt động; tĩnh 49% / 55% | cảnh báo (đã xem) | Hình vẫn đổi theo bước nhưng sơ đồ gần như đứng; thêm chuyển động nhẹ nếu sửa QC-01/05 |
| M-19..23 | R21 | S04, S06, S07, S08, S09 | 0 s cùng hiện giữa hai ô; render-log R21: 0 đoạn đè, header phủ 100% sau opening | loại trừ | Header trượt một thẻ; ở `header-zones.png`, `board-*` header nhất quán, không che Cáo/phụ đề |
| M-13..15 | R12 | S00, S04, S07 | hiệu RGB 12,9 / 14,6 / 47,5 (camera-*.png) | đạt | camera có chuyển động thật, phục vụ opening/pan qua lưới/đẩy vào danh bạ |
| M-03..05, 07..10, 12 | Y7 | các khoảng im 0,8–2,9 s | hình đổi trong khoảng | thông tin | — |
| M-33,35,36,37,44,46 | R22 | S00/S03/S04/S07/S09 | keyword minh hoạ bằng hình theo storyboard (status/connection/comparison/flow) | thông tin (loại trừ) | — |
| M-28, M-31, M-32, M-34, M-38..43, M-45, M-47 | R22 | nhiều cảnh | keyword thiếu chữ vẽ thật; M-28 là dương tính giả (khung 6,05 s có «AI NHẮN THAY BẠN?») | cảnh báo | Chỉ bổ sung nhãn cho keyword gọi tên chính nếu rảnh; không bắt buộc |

### So với bản chuẩn T5 (Δ lấy từ qc-measure)

| Chỉ số | Video | T5 | Δ |
|---|---|---|---|
| Thời lượng (s) | 60,75 | 44,63 | +16,12 |
| Số cảnh / trung bình cảnh (s) | 8 / 7,59 | 18 / 2,48 | -10 / +5,11 |
| Lần cắt / 10 s | 1,153 | 3,809 | -2,656 |
| Tĩnh (%) | 33,77 | 30,79 | +2,99 |
| Đoạn tĩnh dài nhất (s) | 1,6 | 1,2 | +0,4 |
| Âm tiết/s trên MP4 | 4,495 | 3,837 | +0,658 |
| Tỉ lệ lặng | 0,438 | 0,34 | +0,098 |
| Đuôi im (s) | 0,635 | 0,691 | -0,056 |
| Số cảnh báo | 65 | 16 | +49 |

### 5 câu hỏi người xem lạ

| # | Kết quả | Mốc / bằng chứng |
|---|---|---|
| 1 | Đạt | 0–3 s: Mít cầm điện thoại có tin «Cho tao vay 5 triệu nha», Cáo ngạc nhiên (`frame-open-*`, thumb); lời 0,6 s «bạn thân ngồi cạnh mình mà nhận tin mình vay năm triệu» |
| 2 | Đạt | 3,86–5,0 s: «Mình chưa nhắn gì!» rồi tiêu đề «AI NHẮN THAY BẠN?» 5,0 s |
| 3 | Đạt một phần; CHƯA KIỂM tắt tiếng | Mỗi cảnh một ý (1 khái niệm/cảnh, 1,15 khái niệm/10 s); `nocaption-board.png` hiểu được chuỗi thẻ thật/giả, nhưng QC-01/02/05 làm vài nhãn khó đọc |
| 4 | Chưa đạt nhẹ | Nhãn dính hình (QC-01/02/05) và nhãn lộ sớm (QC-04); tĩnh dài nhất 1,6 s (42,7–44,3 s) có lý do; không khoảng ≥ 1,5 s hình đứng hoàn toàn |
| 5 | Đạt; bìa Đạt | Kết S09 «Chốt nhé: đổi kênh trước khi đổi tiền» + câu hỏi mời; đuôi 0,635 s ≤ 0,7; bìa 180×320 đọc được tin vay và Cáo (thumb-180x320.png) |

### Bảng Y1–Y8

| Nhóm | Kết quả | Bằng chứng |
|---|---|---|
| Y1 chữ không thừa | Chưa đạt | QC-01, QC-02, QC-05; không nhãn «AI tạo» trên hình |
| Y2 cảnh có Cáo | Đạt (CHƯA KIỂM số cảnh theo kịch bản) | Cáo ở S00, S05, S07 (rìa), S09; avatar trên thẻ chỉ là ảnh đại diện |
| Y3 cỡ Cáo | Đạt | Cáo mở ~350 px, các nhịp sau 160–180 px (`board-*`) |
| Y4 nền theo ngữ cảnh | Đạt | quán ấm (S00/S09) → kính tối → lưới dữ liệu → nền sáng danh bạ (`board-01..04`) |
| Y5 tình huống mở / kết đóng | Đạt | S00 tin vay đỏ → S09 gọi xác minh, mời trả lời |
| Y6 tốc độ | CHƯA KIỂM — giám đốc nghe | 4,631 trên WAV (trong 4,6–4,8), +20,7% so T5 trên MP4; độ méo sau atempo 0,865 chưa nghe |
| Y7 nhịp nghỉ | CHƯA KIỂM — giám đốc nghe | 23 khoảng nghỉ, trung vị 0,69 s, max 4,12 s; 6 khoảng lặng dài ngoài kế hoạch (M-69..74) |
| Y8 phát âm | CHƯA KIỂM — giám đốc nghe | `phonemes.py` mã 0, 15 dòng, 0 lỗi; ai/hack/chat/phở bò chưa nghe (clip `assets/voice/term-check/`) |

### D8 (R20–R23) tóm tắt

R20 opening 8 s đạt (tiêu đề 5,0 s). R21 header phủ 100% sau opening, cỡ ≥ 52 px, 0 đè. R3 0 cặp giao bbox, khe nhỏ nhất 197 px (nhưng nhãn chồng icon, xem QC-01/02: bbox của icon không nằm trong phép đo). R22: 100% cảnh có chữ; kinetic và đúng mốc chưa đạt (M-26/27). R23 0/15 câu cờ; tai nghe CHƯA KIỂM.

### needs_manual_review (trạng thái)

| Hạng mục | Trạng thái |
|---|---|
| Giọng tự nhiên, độ méo sau atempo 0,865, tốc độ cảm nhận | CHƯA KIỂM — giám đốc nghe |
| Nhịp nghỉ (đặc biệt 21,4–25,6 s và 51,1–54,7 s) | CHƯA KIỂM — giám đốc nghe |
| Phát âm ai / hack / chat / phở bò | CHƯA KIỂM — giám đốc nghe |
| Độ êm và độ nghe được của SFX | CHƯA KIỂM — giám đốc nghe |
| Sức hút opening, logic mạch kể, đồng bộ nhãn–từ | CHƯA KIỂM |
| Header đọc được trên điện thoại | CHƯA KIỂM (quan sát 360×640: đọc được) |
| Hiểu qua hình khi tắt tiếng (hình có minh hoạ đúng) | CHƯA KIỂM đầy đủ; xem sơ bộ ở `nocaption-board.png` |
| `final_pass_allowed` của máy | không thay người duyệt |

### QC — cần sửa (lỗi dựng, trả về production)

1. QC-01 S08 nhãn «BÁO BẠN BÈ» không chồng chuông/avatar, hiện ≥ 1,0 s.
2. QC-02 S07 nhãn «SỐ ĐÃ LƯU» không đè avatar/thẻ/tay.
3. QC-03 S00 5,9–6,3 s: thẻ «TÀI KHOẢN THẬT» không cắt ngoài mép, nhãn gắn sát thẻ.
4. QC-04 S03 dời «HỒ SƠ KHÁC» và thẻ dưới về ≥ 11,07 s.
5. QC-05 S05 bong bóng chat không che Cáo, ≥ 1,9 s.
6. QC-06 nâng SFX để nghe được; khai cue↔hình trong render-log.
7. Giữ nguyên thiết kế/APPROVED; không đổi lời, giọng, thời lượng. Cân nhắc rút khoảng im 4,1 s (21,4–25,6 s) và 3,65 s (51,1–54,7 s) về ≤ 3 s nếu không phá giữ-sau-lời.

### Bài học cho luật

- Phép đo bbox chữ chưa tính icon/đối tượng: nhãn đè chuông/avatar lọt qua `text_overlap` (0 cặp). Nên thêm kiểm chữ–đối tượng vào qc-measure.

## Producer — đối chiếu yêu cầu QC với storyboard

- QC-05 yêu cầu bong bóng “Chị Lan nhờ tao nhắn mày” hiện ít nhất 1,9 s. Storyboard APPROVED S05 và mốc đã chốt trong Rescue chỉ cho bong bóng hiện 3,85–4,75 s tính từ đầu cảnh (0,90 s), sau đó “ok” hiện từ 4,75 s. Kéo dài riêng bong bóng sẽ phá thứ tự hiển thị đã duyệt. Đề nghị Visual Director duyệt lại mốc xuất hiện sớm hơn hoặc dời lời đáp “ok”, đồng thời giữ giới hạn nhóm chữ và khoảng trống quanh Cáo.
- Đã chạy lại qc-video (--min 45 --max 75 --scenes assets/scenes.json): PASS kỹ thuật, 60,75 s, H.264 1080×1920 24 fps, AAC 48 kHz, −15,1 LUFS, −1,76 dBTP, cảnh báo ít chuyển động S05/S08. qc-publish PASS, 0 lỗi, 0 cảnh báo. Các yêu cầu sửa QC vẫn mở. Phần cảm nhận âm thanh CHƯA KIỂM — giám đốc nghe.

## Producer — bản sửa sau QC và Rescue lần 4

- QC-01: S08 đặt «BÁO BẠN BÈ» dưới cụm chuông/avatar, hiện 47,833–48,875 s (1,042 s). QC-02: S07 đặt «SỐ ĐÃ LƯU» dưới thẻ danh bạ, tách khỏi ảnh đại diện và tay. QC-03: S00 đưa thẻ thật vào trọn khung trước khi hiện nhãn ở 6,083 s, gắn nhãn ngay dưới thẻ. QC-04: S03 cho thẻ dưới và «HỒ SƠ KHÁC» xuất hiện ở 11,083 s. QC-05: S05 đặt tin đỏ và hồi đáp ở hai bong bóng riêng, ngoài vùng hai ảnh đại diện. Tin đỏ hiện 28,542–30,458 s (46 khung, 1,917 s). Hồi đáp vào 30,000 s rồi tin đỏ thu thành biểu tượng. Đã mở khung trước và sau các mốc sửa ở 360×640, ba khung có phụ đề và bìa 180×320.
- QC-06: nâng gain cue 7 dB trước giới hạn dưới giọng của mixer. SFX đo −37,07 LUFS / −21,00 dBFS, impact −29,67 LUFS / −19,00 dBFS. Cả 9/9 cue trong bản trộn đạt mốc onset và mốc hình. Đã ghi đối tượng gắn cue trong `assets/render-log.json`. Giữ bốn stem; nhạc tắt. Kiểm R23 trên stem giọng theo 15 cửa sổ trả 0 vi phạm. Giữ lời, giọng, timeline cảnh và thời lượng bản đã duyệt.
- `qc-video --min 45 --max 75 --scenes assets/scenes.json` PASS, 0 lỗi. MP4 dài 60,75 s, H.264 yuv420p 1080×1920, 24 fps, AAC 48 kHz, −15,10 LUFS, −1,77 dBTP. Đuôi im 0,635 s; đoạn tĩnh hình dài nhất 1,60 s. `qc-publish` PASS, 0 lỗi và 0 cảnh báo. Kiểm tên nền tảng trên phụ đề, storyboard, timeline và các khối đăng cho 0 kết quả. `final/` có đúng bốn tệp.
- `qc-measure` với baseline T5 ghi 0 lỗi, 46 cảnh báo. Báo cáo Audio / Visual / Narrative tại `assets/_scratch/qc-revision/qc-auto/report.md` và `report.json`. Opening đủ ba pha, 8 s. Các cảnh báo chuyển động S05/S08 vẫn còn do giữ vòng/thẻ để đọc, trong khi bong bóng, chuông và cờ đổi theo bước. Hai khoảng nghỉ 4,117 s và 3,649 s được giữ để hoàn thành chuyển hình S04/S08 và giữ timeline giọng. S05 có 0,458 s cùng hiện chip điều kiện, tin đỏ và hồi đáp theo Rescue; phép đếm từ vẫn cảnh báo mật độ. Các cảnh báo kinetic, nhãn minh họa bằng biểu tượng, vị trí header chuyển giữa cảnh và độ gần nhãn được giữ trong báo cáo để người duyệt đối chiếu.
- `needs_manual_review` — phát âm, độ tự nhiên, tốc độ cảm nhận, nhịp nghỉ và độ êm của SFX/impact: **CHƯA KIỂM — giám đốc nghe**. Sức hút opening, logic mạch kể, đọc header trên điện thoại và đồng bộ chi tiết lời–hình: **CHƯA KIỂM**.

## QC lần 2 (Claude, 21/11/2026)

Công cụ: `node tools/qc-measure.mjs ep01 --baseline docs/baseline/T5-qc-auto.json --frames "5.9,6.1,6.4,11.2,12,20,25,30"` (hồ sơ standard): 75 phát hiện, 46 cảnh báo, **0 lỗi** (qc-video nằm trong qc-measure). Báo cáo `assets/_scratch/qc-auto/report.md`. Gemini xem trước: Gemini vắng (lượt `look` trước bị từ chối quyền ở phiên nền; ghế NO_ACCOUNT; không chờ). Khung đã xem: 15 (frame-5.9/6.1/6.4/11.2/12/20/25/30 từ qc-measure; thêm `q2-10.5`, `q2-29.2`, `q2-42.8`, `q2-48.3`; `thumb-180x320`; `board-*`, `header-zones`, `frame-open-*` xem ở lượt 1 vẫn khớp). Số đo: 60,75 s, 1080×1920, 24 fps, h264/aac; mix -14,2 LUFS, tích hợp MP4 -15,1 LUFS, true peak -1,81 dBTP; đuôi im 0,635 s; 4,631 âm tiết/s trên WAV giọng gốc (4,452 trên MP4; +20,7% so T5); R23 0/15 câu cờ; cặp chữ giao bbox 0, khe nhỏ nhất 89 px; header 100% sau opening; cue 9/9 đạt onset + mốc hình; SFX -37,07 LUFS / -21,0 dBFS, impact -29,67 LUFS / -19,0 dBFS.

### Kết luận ba trục

| Trục | Kết luận | Bằng chứng |
|---|---|---|
| KỸ THUẬT | Đạt phần đo | 0 lỗi; thông số video đúng; cue↔hình 9/9; R23 0%; LUFS/dBTP trong chuẩn. Còn cảnh báo M-69..74 bbox chạm mép (S00 0,8–1,1 s và 5,9–8 s, S03 11,08 s, S05 28,54 s): đã xem `frame-6.1`, `q2-29.2`: thẻ nằm trọn trong khung, nhãn «TÀI KHOẢN THẬT» sát mép trái ~78 px, chấp nhận. |
| TUÂN THỦ | Đạt | grep `facebook|youtube|zalo|tiktok` trên `captions.srt`, `scenes.json`, `storyboard.json`, `publish.json` (kể cả tiêu đề, mô tả, hashtag) = 0 kết quả; chỉ còn khoá nền tảng và URL ở mục `sources` (ngoại lệ được phép); hashtag `#phobo`; tiêu đề/mô tả dùng «phở bò»; ví dụ dựng ghi ở mô tả ("Đây là ví dụ dựng"); không hướng dẫn tạo tài khoản giả, không tên nút/menu chưa kiểm trên hình; khung không có đồ ăn, đôi dép, người thật, logo; không ảnh Gemini (`approved.json` rỗng, không dòng LICENSES mới); `final/` đúng 4 tệp; AI khai ở `publish.json`. |
| TRẢI NGHIỆM | Đạt phần xem được; còn CHƯA KIỂM phần nghe | QC-01..05 đã sửa (xem bảng); không lỗi chữ đè đối tượng/cắt mép mới ở khung đã xem. Mục nghe và cảm nhận chờ giám đốc. |

### Trạng thái QC-01..06

| Mã | Mốc | Bằng chứng khung | Kết quả |
|---|---|---|---|
| QC-01 | S08 47,8–48,9 s | `q2-48.3.png`: «BÁO BẠN BÈ» nằm dưới cụm chuông/ba avatar (đỉnh nhãn ~y 900, đáy chuông ~y 885), không che chuông, avatar hay thẻ; hiện 1,042 s (≥ 1,0 s) | ĐÃ SỬA |
| QC-02 | S07 41,5–47 s | `q2-42.8.png`: «SỐ ĐÃ LƯU» dưới thẻ danh bạ (thẻ đáy y 1078, nhãn y 1100–1160), cách avatar Cáo và tay, không che | ĐÃ SỬA |
| QC-03 | S00 5,9–6,3 s | `frame-6.1.png`: thẻ «TÀI KHOẢN THẬT» trọn trong khung (x 80–553), nhãn ngay dưới thẻ; 5,9 s thẻ đang trượt vào chưa có nhãn | ĐÃ SỬA |
| QC-04 | S03 | `q2-10.5.png` chưa có «HỒ SƠ KHÁC»/thẻ dưới; `frame-11.2.png` hiện cùng lời «Một hồ sơ khác» (nhãn hiện 11,083 s, khớp lời 11,07 s; Δ 0,072 s) | ĐÃ SỬA |
| QC-05 | S05 28,5–30,5 s | `q2-29.2.png`: bong bóng «Chị Lan nhờ tao nhắn mày» không còn che đầu Cáo (Cáo x 440–570, bong bóng từ x 595), hiện 28,542–30,458 s = 1,917 s (≥ 1,9 s); `frame-30.png`: thêm «ok» và chip, 10 từ cùng lúc (M-17/M-25 cảnh báo, giữ, xem dưới). Bong bóng còn phủ mép phải thẻ giả, không che nội dung | ĐÃ SỬA (còn cảnh báo mật độ) |
| QC-06 | cả video | SFX -43,78 → -37,07 LUFS (đỉnh -28 → -21 dBFS), impact đỉnh -26 → -19 dBFS; cue 0/9 → 9/9 đạt hai mốc | ĐÃ SỬA phần số đo; nghe được/êm tai: CHƯA KIỂM — giám đốc nghe (SFX vẫn rất nhỏ so với giọng) |

### Cảnh báo giữ lại (đã xem, không trả sản xuất)

| Mã | Nhóm | Mốc | Bằng chứng | Mức | Đề nghị |
|---|---|---|---|---|---|
| M-17, M-25 | R22/Y1 | S05 30,0–30,46 s | 10 từ cùng lúc (ngưỡng 8) trong 0,458 s chuyển tiếp; `frame-30.png` vẫn đọc được | cảnh báo, chấp nhận | Thuần mật độ ở khoảnh khắc chuyển; không trả dựng |
| M-24, M-26 | R22 | cả video | 54,3 từ/phút (khoảng thử 20–45); kinetic 0,823/25 s (< 1) | cảnh báo, chấp nhận | Số thử, storyboard APPROVED; ghi cho luật |
| M-06, M-11, M-63..68 | Y7 | 21,4–25,6 s (4,12 s); 51,1–54,7 s (3,65 s); thêm 4 khoảng 2,1–2,9 s | silencedetect; hình đổi trong khoảng (S04 khoá/mắt, S08 chuông/cờ); tỉ lệ lặng 43,8% (T5 34%) | cảnh báo | CHƯA KIỂM — giám đốc nghe có lê thê không |
| M-01, M-02 | R4 | S05, S08 | trung vị 0 khối hoạt động; hình đổi theo bước (`scene-S05`, `scene-S08`) | cảnh báo, đã xem | Sơ đồ giữ để đọc, có đổi trạng thái |
| M-19..23 | R21 | S04, S06..S09 | 0 s cùng hiện giữa hai ô; render-log 0 đoạn đè, header 100% | loại trừ | Header trượt theo thẻ, không che Cáo/phụ đề |
| M-27..42 | R22 | nhiều cảnh | 10 keyword thiếu chữ vẽ thật, 6 minh hoạ bằng hình theo storyboard; 89,5% chữ đúng mốc | cảnh báo | Không bắt buộc; chữ gọi tên chính đã có |
| M-43..62 | audio | nhiều biên câu | nghỉ lệch kế hoạch 0,2–2,1 s | cảnh báo | Nằm chung CHƯA KIỂM Y7 |
| M-75 | R22 | S00 2,3–3,6 s | nhãn «Sao mày vừa vay tao 5 triệu?» hiện 1,29 s (< 1,89 s) | cảnh báo nhẹ | Thuần thẩm mỹ, storyboard đã duyệt; không trả dựng |
| M-13..15 | R12 | S00, S04, S07 | hiệu RGB 12,7 / 14,6 / 47,5 | đạt | camera có chuyển động thật |

### Audio / Visual / Narrative (D6, D8)

- Audio: tốc độ 4,631 âm tiết/s trên WAV (trong dải 4,6–4,8), +20,7% so T5 trên MP4; lặng 43,8%, đuôi 0,635 s ≤ 0,7; R23 0/15 câu cờ (tai nghe CHƯA KIỂM); phonemes.py mã 0 (lượt 1); nghe giọng/phát âm/nhịp CHƯA KIỂM — giám đốc nghe.
- Visual: opening 8 s ba pha, tiêu đề 5,0 s (R20 Đạt); header 100% sau opening, ≥ 52 px (R21 Đạt, đọc điện thoại CHƯA KIỂM, 360×640 thấy được); R3 0 cặp giao bbox; hình khớp lời lệch lớn nhất 0,072 s; giữ sau lời nhỏ nhất 0,635 s (S09, cảnh outro) còn lại ≥ 0,96 s.
- Narrative: 1,15 khái niệm/10 s, 1 khái niệm/cảnh, thứ tự: tin vay → hồ sơ giả → công khai → bạn thân tin → gọi lại → báo cáo → chốt (logic theo script/storyboard); có ví dụ dựng (Chị Lan, 5 triệu); CHƯA KIỂM logic chuyển ý và sức hút opening khi xem liên tục.

### 5 câu hỏi người xem lạ

| # | Kết quả | Bằng chứng |
|---|---|---|
| 1 | Đạt | 0–3 s: tin «Cho tao vay 5 triệu nha», Cáo ngạc nhiên, lời 0,6 s (`thumb`, `frame-open-*`) |
| 2 | Đạt | 3,86–5,0 s «Mình chưa nhắn gì!» rồi tiêu đề «AI NHẮN THAY BẠN?» |
| 3 | Đạt; tắt tiếng CHƯA KIỂM | mỗi cảnh một ý; `nocaption-board.png` đọc được chuỗi thẻ thật/giả |
| 4 | Đạt | nhãn dính hình đã sửa; tĩnh dài nhất 1,6 s (42,7–44,3 s) hình vẫn đổi chip; không khoảng ≥ 1,5 s hình chết hoàn toàn |
| 5 | Đạt; bìa Đạt | kết «đổi kênh trước khi đổi tiền» + câu hỏi mời; đuôi 0,635 s; thumb 180×320 đọc được tin vay và Cáo |

### Y1–Y8

| Nhóm | Kết quả | Bằng chứng |
|---|---|---|
| Y1 | Đạt | không nhãn «AI tạo», không chữ thừa; M-17 mật độ S05 là cảnh báo chấp nhận |
| Y2 | Đạt | Cáo ở S00, S05, S07, S09; avatar trên thẻ là ảnh đại diện |
| Y3 | Đạt | Cáo mở ~350 px, các nhịp sau 140–180 px |
| Y4 | Đạt | quán ấm → kính tối → lưới dữ liệu → nền sáng danh bạ |
| Y5 | Đạt | tin vay (S00) → gọi xác minh (S09), mời trả lời |
| Y6 | CHƯA KIỂM — giám đốc nghe | 4,631 trên WAV; độ méo sau atempo chưa nghe |
| Y7 | CHƯA KIỂM — giám đốc nghe | 23 khoảng nghỉ, trung vị 0,69 s, max 4,12 s; 6 lặng dài ngoài kế hoạch |
| Y8 | CHƯA KIỂM — giám đốc nghe | phonemes.py mã 0; ai/hack/chat/phở bò chưa nghe (clip `assets/voice/term-check/`) |

### needs_manual_review

| Hạng mục | Trạng thái |
|---|---|
| Giọng tự nhiên, độ méo sau atempo, tốc độ cảm nhận | CHƯA KIỂM — giám đốc nghe |
| Nhịp nghỉ (21,4–25,6 s và 51,1–54,7 s) | CHƯA KIỂM — giám đốc nghe |
| Phát âm ai / hack / chat / phở bò | CHƯA KIỂM — giám đốc nghe |
| Độ nghe được và êm tai SFX/impact (QC-06) | CHƯA KIỂM — giám đốc nghe |
| Sức hút opening, logic mạch kể, đồng bộ nhãn–từ, hiểu khi tắt tiếng, header trên điện thoại | CHƯA KIỂM |

Phán quyết lượt 2: kỹ thuật và tuân thủ đạt, QC-01..05 sửa thật, không lỗi dựng mới → giữ `review`, đánh cờ `QC-CHỜ-NGHE`. Số lần sản xuất đã 6, không trả production vì cảnh báo mật độ/thẩm mỹ.

Ghi thêm (Claude QC tự xem lại `assets/_scratch/qc-auto/frame-30.png`): ở 30,0 s bong bóng đỏ «Chị Lan nhờ tao nhắn mày» che nửa phải thẻ tài khoản giả bên dưới (không che Cáo), đường chỉ vàng cắt qua mép bong bóng. Lỗi chỉ kéo dài khoảng 0,46 s lúc chuyển sang «ok». Không trả production vì lỗi này; giám đốc xem khi duyệt và quyết có sửa không.

### Bài học cho luật

- Phép đo bbox chữ vẫn chưa tính icon/đối tượng (lặp lại từ lượt 1); nên thêm kiểm chữ–đối tượng vào qc-measure.

