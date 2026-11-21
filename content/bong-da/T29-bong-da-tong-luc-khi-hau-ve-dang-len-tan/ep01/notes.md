# BONG-DA-T29-E01 — ghi chú

## Kế hoạch (21/11/2026)
- Storyboard: Gemini (mô hình gemini-3.8-flash-high, MÔ HÌNH DỰ PHÒNG vì claude-opus-4-6-thinking hết hạn mức) làm thay Codex theo duyệt của giám đốc (21/11/2026), lý do: Codex không làm được bước storyboard ở việc này (chi tiết lỗi của Codex ở nhật ký việc plan); Claude review/duyệt.
- Lượt Gemini: r1 bị script từ chối (SAI_SCHEMA, 5 lỗi enum) → r1b hợp lệ → review r1 CẦN SỬA (4 điểm) → r2 → review r2 CẦN SỬA (3 điểm) → r3 → review r3 "DUYỆT SAU KHI CLAUDE SỬA NHỎ", `APPROVED` do `visual-director` đặt.
- Claude tự sửa nhỏ khi duyệt: `environment` của S02 thêm quy định chấm trung vệ trái (315, 1095) vẽ mờ 40% vì Cáo đè lên chấm đó.
- Ảnh sinh (4b): không cần ảnh; `assets/gen/approved.json` ghi `"images": []` kèm lý do (sa bàn Pillow toạ độ chính xác, nền N1–N4 dựng được bằng `make_background.py`).
- Renderer: `pillow-ffmpeg`.

## Việc Sản xuất cần lưu ý (từ review r3, không chặn)
- Chữ minh hoạ ≈ 47 từ/phút nếu tính cả nhãn lặp (≈ 39 nếu không lặp), sát trần 45.
- Đo lại mốc nghỉ/đồng bộ sau TTS thật.
- Kiểm Cáo ở S10 không che sa bàn thu nhỏ ở 360×640.
- Schema: `gemini-run` kiểm Ajv hợp lệ ở cả ba lượt ghi; sau lần sửa tay cuối của `visual-director` (thêm một câu vào chuỗi `environment` S02 và đổi `status`) chưa chạy lại Ajv.
 
## Producer — kiểm giọng và mốc dựng
- Storyboard APPROVED chỉ định Pillow + FFmpeg. Danh sách ảnh sinh đã duyệt trống.
- Từ điển chung nhận đại từ tiếng Việt “ai” thành chữ viết tắt “AI”. Dùng bản sao riêng của tập `assets/voice/pronunciation.video.json` bỏ mục trùng và các ứng viên tiếng Việt pha/sai/lao/kia. `pronounce check` trả found/unknown rỗng. `phonemes.py --lines` đạt, không có thuật ngữ cần clip riêng.
- Đã chạy `prosody.mjs plan`, `gen_vo.py --plan`, `prosody.mjs timeline --mode free`, `splice.py check` (16 câu, 0 vi phạm), `assemble.py`, `prosody_metrics.py`. Đệm nguồn 60 ms trước / 140 ms sau. Giọng Hải Đăng theo mặc định của xưởng. `ffprobe` trên voice-track.wav: 47,686083 s.
- Đã sinh đủ 16 dòng, kiểm R23 0 lỗi; cần Visual Director/Claude duyệt lại mốc sau TTS theo script/R8 trước khi dựng. Timeline free 47,686 s (L02 bắt đầu 2,708 s, lấn S01 đã duyệt đến 3,30 s nếu giữ hình). Timeline fit 57,70 s không tăng tốc thêm, nhưng L02 dứt 5,132 s trước reveal 5,24 s vốn phải vào cùng 'Ai lấp?', L10 vào 35,671 s còn nhịp Cáo/GẦN Ô nhấp của L10 là 36,55 s (lệch 0,879 s > 0,5 s); L16 dứt 55,860 s, cách cuối 57,70 s 1,840 s. Đề nghị giữ các hành động, góc máy, chữ và ba pha đã duyệt; cập nhật mốc reveal/nhịp L10 theo cue giọng, rồi chốt điểm cắt/hold S10 và ngoại lệ đuôi im nếu cần. Bằng chứng assets/voice/{voice-timeline,fit-proposal,metrics}.json.
- CHƯA KIỂM — giám đốc nghe: phát âm, tốc độ cảm nhận, nhịp và độ tự nhiên. Cue sheet, trộn âm và QC thành phẩm chờ mốc dựng được duyệt. Chưa có bản dựng để chấm sức hút opening, độ êm SFX hoặc mạch kể trên hình.

## Rescue — duyệt mốc sau TTS (Claude, 21/11/2026)
Nguyên nhân: không phải lỗi thiết kế/kỹ thuật; storyboard viết mốc trước TTS, giọng thật lệch vài mốc. Claude duyệt thay Visual Director chỉ việc căn mốc; GIỮ NGUYÊN hành động, góc máy, chữ, ba pha opening, status APPROVED. Dùng timeline **fit 57,70 s** làm gốc (không dùng free 47,69 s; không tăng tốc giọng).
- S02 reveal tiêu đề "AI LẤP Ô TRỐNG?": cảnh 1,94 (5,24 s) → 1,40 (4,85 s); mũi tên chạm ô 1,60→1,25; nghỉ câu hỏi 2,41→1,83; hold 3,41→2,83. Căn cứ: L02 dứt 5,132 s, "Ai lấp?" là cuối câu nên tiêu đề phải vào trước khi dứt.
- S07 nhịp L10: Cáo vào 3,55→2,67 (35,67 s = L10 vào); GẦN Ô nhấp 3,40 (36,40 s, theo từ "gần ô", lệch ≤0,5 s); B tới ô 3,0→2,2; nghỉ 0,4 s 3,15→2,27 (35,27–35,67); L10 dứt 4,47 (37,47 s).
- S10: L16 vào 2,52 (54,42 s), dứt 3,96 (55,86 s); S10 dài 5,8→4,66 s; tổng 57,70→**56,56 s**; đuôi im/giữ hình **0,70 s** (đúng chuẩn ≤0,7, không cần ngoại lệ; cắt 1,14 s hold thừa, không đổi lời); chữ NHÌN Ô TRƯỚC disappear 4,66.
- L02 bắt đầu 3,45 s nằm trong cửa sổ S02 (3,3–7,6): không lấn S01. Cửa sổ S01–S09 giữ nguyên; `assets/voice/approved-scene-windows.json` S10 end 57,7→56,56, hold 0,8→0,7. Đã sửa `storyboard.json` (S02, S07, S10; chỉ số mốc/ghi chú).
- Codex cần làm: dựng theo fit timeline (L01 0,6 … L16 54,417–55,86), tổng 56,56 s, đuôi im 0,70 s; cue sheet `cuesheet.py` theo mốc mới; nếu `voice-timeline` fit còn ghi 57,70 thì sinh lại với S10 end 56,56. Kiểm Cáo S10 không che sa bàn thu nhỏ ở 360×640.
- CHƯA KIỂM — giám đốc nghe: phát âm, nhịp, độ tự nhiên. Mốc "gần ô" 36,40 s ước theo vị trí từ trong câu, chưa có alignment từng từ: QC mở khung quanh 36,4 s xác nhận.

## Producer — kiểm tra lại sau Rescue

- Đã chạy lại `prosody.mjs timeline --mode fit` với cửa sổ 56,56 s. `assemble.py` báo “Timeline có cảnh thiếu chỗ. Cần xử lý overflow trước khi ghép.” S10 báo thiếu 0,70021 s. Dùng lại các mốc câu trong fit-proposal đã duyệt và chỉ cắt phần lặng cuối. Lần ghép đầu báo “Dòng 16 lấn thời gian giữ hình cảnh S10.” vì mốc cuối lời có độ chính xác hơn hai chữ số thập phân. Dùng `assets/voice/assembly-windows.json` giữ 0,69979 s và chạy lại `assemble.py` và `prosody_metrics.py` thành công. `ffprobe` đo 56,560000 s, L16 có tiếng từ 54,416792 đến 55,860208 s. Không đổi tốc độ hoặc đệm nguồn.
- S02: header opening phases vẫn chia conflict/topic_reveal tại 5,24 s; semantic_plan cũng hiện tiêu đề tại 1,94 s trong cảnh (5,24 s toàn tập). Animation timeline và sound cue dùng 1,40 s (4,70 s toàn tập), trong khi mô tả timeline và Rescue ghi 4,85 s. Đề nghị chốt 4,85 s toàn tập theo mô tả Rescue, tức 1,55 s trong S02, rồi đồng bộ ba pha, chữ và cue.
- S07: dòng đường thẳng cam ghi vẽ 34,90–35,60 s, nhưng B đã tới ô và đổi xanh ở 35,20 s. Đề nghị giữ B đến 35,20 s theo cue đã duyệt, kết thúc nét cam cùng lúc (hoặc chốt rõ hiệu ứng vẽ tiếp có chủ ý).
## Rescue lần 3 — chốt hai mốc (Claude Gỡ vướng chỉnh mốc, không đổi thiết kế; 21/11/2026)
Nguyên nhân gốc: lần rescue trước chỉ sửa animation_timeline/sound_cues S02 (1,40) mà bỏ sót opening.phases và semantic_plan (5,24/1,94); S07 dòng nét cam ghi 34,90–35,60 lệch với B tới ô 35,20 (S07 bắt đầu 33,00 s).
- S02: chốt reveal tiêu đề **4,85 s toàn tập = 1,55 s cảnh** (trước khi L02 dứt 5,132 s). Đã sửa trong storyboard.json: opening.phases conflict 3,3–4,85 và topic_reveal 4,85–7,6; semantic_plan text "AI LẤP Ô TRỐNG?" appear_s 1,94→1,55; animation_timeline reveal 1,40→1,55; sound_cue impact_reveal 1,40→1,55. Giữ nguyên: mũi tên chạm ô 1,25, nghỉ câu hỏi 1,83 (=L02 dứt), hold 0,89.
- S07: nét cam từ B tới ô vẽ **1,75–2,20 s cảnh (34,75–35,20 s tổng)** và hoàn tất đúng lúc B tới ô, ô xanh, SFX; không vẽ tiếp sau 35,20 s. Ghi chú sửa trong animation_timeline t=1,75.
- Lệnh cho Sản xuất: dựng theo mốc trên; ba pha opening chuyển tại 4,85 s; cue sheet reveal ở 4,85 s; nét cam S07 kết thúc 35,20 s; fit timeline 56,56 s giữ nguyên (giọng đã ghép, không dựng lại giọng). status vẫn APPROVED.

(Cũ) Chờ chốt hai mốc hình trước khi dựng, lập cue sheet, trộn âm và QC. CHƯA KIỂM — giám đốc nghe: phát âm, nhịp, độ tự nhiên, độ êm SFX. Sức hút opening và mạch kể trên hình CHƯA KIỂM.


## Producer — bản giao QC

- Thành phẩm trong `final/`: `BONG-DA-T29-E01_9x16.mp4`, `thumbnail.jpg`, `captions.srt`, `publish.json`. Đã chạy `qc-video` với ngưỡng 45–75 s và timeline 10 cảnh: pass. FFprobe 56,566667 s. H.264 1080×1920 yuv420p, 30 fps, AAC 48 kHz, faststart. Đo bản MP4: −15,01 LUFS-I, −1,69 dBTP, LRA 4,9 LU. `qc-publish`: pass, 0 lỗi, 0 cảnh báo. Rà tên nền tảng trong phụ đề, storyboard, timeline và các khối đăng: sạch.
- Nguồn hình: sa bàn tự vẽ Pillow theo storyboard, nền phẳng và gradient theo từng thế bóng. Danh sách ảnh sinh đã duyệt trống. Dùng PNG dáng surprised, idea, thumbs_up của `brand/cao/poses/` và diễn hoạt nhẹ bằng Pillow. Đã xem khung 360×640 tại 0,8 / 4,95 / 28,2 / 36,4 / 54,9 s và bìa 180×320. Ở S07 đã dời chấm trung vệ trái khỏi Cáo và giới hạn sa bàn phía trên phụ đề. Ở S10 Cáo nằm cạnh sa bàn thu nhỏ. Phụ đề ASS 56 px từ SRT, tối đa hai dòng 28 ký tự, đốt sau khi dựng hình. Giữ `assets/_scratch/picture.mp4`.
- Opening 7,60 s qua S01–S02: visual hook 0–3,30 s, conflict 3,30–4,85 s, topic reveal 4,85–7,60 s. B chạm ô và nét cam kết thúc ở 35,20 s. Cue sheet `assets/sound-cues.json`, bản mix, bốn stem và báo cáo trong `assets/audio/`. Nhạc tắt. Bản PCM trộn −14,1 LUFS-I, −1,81 dBTP, 0 mẫu clip. Hạ 0,8 dB khi mux để đỉnh true peak của AAC nằm dưới −1,5 dBTP. Hai cue c004 và c009 cần nghe đối chiếu onset. Cue lấy từ storyboard, cảnh báo gắn sự kiện do nhật ký đồ họa vẽ tay chưa đánh dấu liên kết cue–đối tượng.
- Audio QC: 16/16 biên câu đo được, 0 vi phạm đầu/cuối. Giữ WAV giọng 56,560000 s và mốc đã được Rescue duyệt. QC ở ngưỡng −40 dB đo đuôi im 0,765 s, trong khi khoảng từ cuối clip lời đến cuối timeline là 0,699792 s. Giữ điểm cắt 56,56 s đã duyệt. Hai khoảng im trên 3 s: 23,318–26,753 s giữ hai ô đã lấp, trung vệ chỉnh cự ly rồi cắt sang sai lầm; 49,011–52,053 s giữ ô xanh, làm mờ mũi tên rồi cắt sang sa bàn kết. Các chênh lệch nghỉ so với kế hoạch gốc và tốc độ proxy 5,245 âm tiết/s cần đối chiếu khi nghe; nhịp TTS giữ theo timeline fit đã duyệt.
- Visual QC: S01 ít chuyển động vì giữ toàn cảnh và chớp ô; S03 giữ kết quả ô xanh sau đường lùi; S04 hiện và giữ hai đường so sánh; S05 giữ kết quả bù hai ô, có pan và chỉnh cự ly; S08 pull-out để lộ dải sau bóng rồi giữ cấu trúc. Đoạn tĩnh dài nhất 1,4 s. Header hiện từ S03 và trượt 0,4 s ở ranh giới, công cụ tìm hai ô cùng hiện nên báo 7 cảnh báo. Công cụ lấy S01 làm opening riêng nên báo thiếu tiêu đề, thiếu phủ header và lệch 0,002 s ở lời mở; tiêu đề hiện ở S02 theo thiết kế opening hai cảnh. Các keyword cảnh báo được biểu đạt bằng hành động, ô màu và nhãn đã duyệt. Nhật ký chữ có tên đối tượng nhưng thiếu bbox tham chiếu cho một số nhãn. Ba cờ vùng an toàn ở S03/S07/S10 còn để QC xem cùng khung thật.
- Narrative QC: sa bàn quay về góc mở ở S09 và mũi tên bị chặn ở ô đã có người. Cửa sổ 3,30–13,30 s đo 2,117 khái niệm so với ngưỡng thử 2 do chuyển từ hook sang giải thích và nguyên tắc. Giữ thứ tự storyboard.
- Y1: rà chữ theo semantic plan, chính tả và phụ đề riêng. Y2–Y3: Cáo đầu/giữa/kết, rộng khoảng 16–17% khung và đứng trên dải phụ đề. Y4: nền đổi theo thế bóng và khung camera. Y5: S09 trả đúng tình huống mở. Y6–Y8: kiểm biên câu, đo nhịp và rà từ điển; phần cảm nhận để giám đốc duyệt.
- `qc-measure`: hồ sơ standard, 107 phát hiện, 73 cảnh báo, 0 lỗi. Báo cáo chi tiết cả ba nhóm và ảnh bằng chứng ở `assets/_scratch/qc-final/report.md`; JSON kỹ thuật ở `assets/_scratch/qc-video.json`. `machine_verdict.final_pass_allowed` chờ các mục duyệt thủ công.
- needs_manual_review: **CHƯA KIỂM — giám đốc nghe** độ tự nhiên, phát âm, tốc độ cảm nhận, nhấn câu, độ êm SFX và tương quan với giọng. **CHƯA KIỂM** sức hút opening, mạch kể, độ dễ hiểu khi xem không phụ đề và đồng bộ ở mức từng từ.

## QC — 21/11/2026 (lượt 1, Claude; job sau 125)

Đo độc lập: `node tools/qc-measure.mjs ... --baseline docs/baseline/T5-qc-auto.json` → 108 phát hiện, 73 cảnh báo, 0 lỗi; báo cáo `assets/_scratch/qc-auto/report.md`. MP4 1080×1920, 30 fps, 56,567 s, mix −14,21 LUFS (MP4 −15,01), true peak −1,81 dBTP, đuôi im 0,765 s. Gemini xem trước: 8 ảnh, báo 5 nghi ngờ (S03 chữ cắt, S04 NHIỆM VỤ sát ô, S07 GẦN Ô tương phản kém, S10 nhãn gạch, mở đầu trống chữ), Claude mở khung xác nhận 4/5 (S03, S04 chỉ chạm sát ô nhưng không che chấm, S07, mở đầu; S10 là gạch chủ ý). Tự xem: board-01..04, scene-S03/S04, textheavy-S07/S10, frame-open-start, thumb-180x320 (10 khung).

### Ba kết luận
- **KỸ THUẬT: CHƯA ĐẠT (lỗi dựng nhỏ + nhịp).** Định dạng, LUFS, true peak, clip 0, phụ đề 56 px dải dưới, phát âm `phonemes.py` mã 0 đều đạt. Chưa đạt: chữ `TRONG PHA NÀY` bị cắt mép trái (QC-01), nhịp đọc quá nhanh trên khung cảnh cố định kéo 7 khoảng lặng 2,1–3,4 s (QC-02), nhãn `GẦN Ô` thiếu nền (QC-03).
- **TUÂN THỦ: ĐẠT có điều kiện.** Luật 10: grep `facebook|youtube|zalo|tiktok` trên `captions.srt`, `scenes.json`, `storyboard.json`, `publish.json` = trống; không hình đồ ăn/đôi dép; không ảnh cầu thủ/áo đấu/logo; không khẳng định ai phát minh, không nói đội nào "đang đá tổng lực" (đã đọc `script.md`). `assets/gen/approved.json` rỗng `images: []` khớp việc không dùng ảnh AI (`gen/` không có ảnh), nên không cần dòng sổ ảnh sinh; Cáo dùng dáng có sẵn của xưởng. `publish.json` đủ 3 nền tảng, có khai báo AI; `captions.srt`, `thumbnail.jpg` có mặt; `final/` đúng 4 tệp. Chưa mở lại `library/LICENSES.md` vì không có ảnh ngoài/AI trong video. Ghi nhận: hashtag trong `publish.json` (`#bongda #bongdatongluc #chienthuatbongda`) khác dòng gợi ý trong `script.md` (có `#caovanphong`), không phải lỗi luật.
- **TRẢI NGHIỆM: CHƯA ĐẠT ở opening/header + CHƯA KIỂM phần nghe.** Lý do ở bảng dưới (QC-04, QC-05, QC-06).

### Bảng phát hiện (cảnh/giây, số đo, tệp)
| Mã | Nhóm | Mốc | Bằng chứng | Mức | Đề nghị |
|---|---|---|---|---|---|
| QC-01 | KỸ THUẬT · R3/R5 (M-104) | S03 7,77–12,6 s (10,1 s) | `scene-S03.png`: chữ `TRONG PHA NÀY` bắt đầu tại x=0, mất nét chữ T; Gemini cũng báo CẮT | FAIL dựng | Dịch nhãn vào trong vùng an toàn ≥ 90 px hoặc giảm cỡ/đổi neo; kiểm lại ở 360×640 |
| QC-02 | KỸ THUẬT · Y6–Y7 (M-20, M-63…M-91) | cả video | Tốc độ 5,245 âm tiết/s trên giọng gốc (dải thử 4,6–4,8; script dự kiến 4,3); tỉ lệ lặng 48,4%; 7 khoảng lặng ≥ 2 s: 5,09–7,75 (2,66), 10,41–12,75 (2,35), 16,18–18,76 (2,58), 23,32–26,75 (3,44), 31,05–33,15 (2,10), 43,95–46,06 (2,10), 49,01–52,05 (3,04); lệch kế hoạch 0,8–1,7 s; M-11/M-15 vượt 3 s; `board-02.png` | FAIL/cảnh báo dựng | Sinh lại giọng chậm hơn (≈ 4,6–4,8 âm tiết/s, không tăng tốc) và/hoặc rút giữ-sau-lời S03–S05, S09 xuống còn ≤ 1,5–2 s có chuyển động ở các khoảng lặng; mốc cảnh phải dịch theo; giữ ≥ 45 s |
| QC-03 | KỸ THUẬT · R3/Y1 | S07 34,75–39 s (36 s) | `textheavy-S07.png`: `GẦN Ô` màu be không hộp nền, đè viền ô xanh và chạm đường cam; khác `GẦN BÓNG` (có hộp) | cảnh báo dựng | Dùng cùng kiểu hộp nền tối và đặt nhãn ngoài viền ô |
| QC-04 | TRẢI NGHIỆM · R20 (M-24..M-26, M-107, M-108) | 0–3,3 s (S01) | `frame-open-start.png`: khung đầu chỉ có sơ đồ, không chữ, không header; tiếng vào 0,598 s; tiêu đề `AI LẤP Ô TRỐNG?` chỉ hiện ở 4,87 s (`board-01.png` ô 1.4); `render-log` thiếu `opening_title`/pha | Chưa đạt (thiết kế) | Mốc cảnh: hiện tiêu đề hoặc hook chữ trong 0–3 s, tách rõ cảnh opening; ghi pha opening và tiêu đề vào render-log |
| QC-05 | TRẢI NGHIỆM · R21 (M-27..M-34) | 0–7,6 s và 7 lần đổi ô | Header phủ 86,565% sau opening (ngưỡng thử 95%); ẩn ở S01–S02; 7 lần đổi ô (top_left→top→top_right) với 0 s cùng hiện; chữ header `BÓNG ĐÁ /TỔNG LỰC` thiếu khoảng trắng trước dấu `/` so với `script.md` (`BÓNG ĐÁ / TỔNG LỰC`) | Chưa đạt (thiết kế, tool ghi "Lỗi thiết kế") | Cho header hiện từ đầu hoặc giám đốc chấp nhận ngoại lệ opening; sửa khoảng trắng; xem lại việc nhảy ô mỗi cảnh |
| QC-06 | TRẢI NGHIỆM · Y2–Y3, R22 | S02, S07, S10 | Cáo ~16–17% khung, 3/10 cảnh (đạt Y2–Y3); `NHIỆM VỤ` ở S04 chạm sát ô xanh (`scene-S04.png`); S10 `HẬU VỆ`/`TIỀN VỆ` gạch chéo, chữ mờ khó đọc ở 360×640 (`textheavy-S10.png`) | Cảnh báo nhẹ | Cân nhắc nâng tương phản nhãn bị gạch hoặc để ngắn hơn |
| M-01..M-05 | R4 | S01, S03, S04, S05, S08 | Trung vị 0 khối hoạt động; đoạn tĩnh dài nhất 1,4 s (23,7–25,1 s); `scene-S0x.png` | Cảnh báo, giữ | Có sự kiện hình theo script (ô nhấp, vẽ đường); gắn với QC-02: rút giữ sẽ giảm tĩnh |
| M-17..M-19 | R12 | S02 push_in, S05 pan_right, S08 pull_out | Hiệu RGB 6,46 / 5,61 / 9,61 trên 255, `camera-*.png` | Thông tin, giữ | Chuyển động có phục vụ (S08 pull_out lộ dải sau bóng); phần "có ý nghĩa" CHƯA KIỂM bằng mắt trên video chạy |
| M-22 | Information Pacing | 3,3–13,3 s | 2,117 khái niệm/10 s (ngưỡng thử 2) | Cảnh báo nhẹ, giữ | Chênh 0,117; sau QC-02 giữ nguyên |
| M-35..M-62 | R22 | S01–S10 | Khoảng 21 mục "thiếu bbox đối tượng"/keyword biểu đạt bằng hình theo storyboard; 100% cảnh có chữ vẽ thật; 43,5 từ/phút; kinetic 1,326/25 s; keyword có hình 90,9% | Đã loại trừ phần lớn: lỗi nhật ký (thiếu bbox), không phải lỗi hình; riêng M-36/40/42/44/48 là keyword không có chữ, chấp nhận vì có hình tương ứng | Producer bổ sung bbox đích vào render-log |
| M-92..M-103 | audio | c001–c010 | 0/10 cue đạt cả onset và mốc hình; c004 và c009 lệch onset (c009 0,16 s) | Cảnh báo, CHƯA KIỂM bằng tai | Nghe đối chiếu; bổ sung liên kết cue–đối tượng trong render-log |

Cảnh báo đã loại trừ: M-06 (đoạn tĩnh 1,4 s có sự kiện hình), M-21/M-23 (thông tin), M-64/66/68… (thông tin kèm cảnh báo QC-02), M-105/M-106 (bbox chạm mép 0,13 s/0,1 s ở S07 35,7 s và S10 54,43 s: mở khung thấy Cáo/sóng nằm trong vùng an toàn, giữ).

### So với bản chuẩn T5 (Δ lấy từ `--baseline`)
Thời lượng 56,567 s (+11,93 s); 10 cảnh (−8), trung bình cảnh 5,66 s (+3,18), 0 cảnh < 2 s; cắt/10 s 1,59 (−2,22); tĩnh 27,4% (−3,35); cảnh báo 73 (+57); LUFS −15,01 (−0,16); đuôi im 0,765 s (+0,074); tốc độ đọc MP4 5,087 (+1,25), WAV 5,245 (+1,41); tỉ lệ lặng 0,484 (+0,144); header 86,6% (+86,6); chữ lặp lời 0; từ chữ minh hoạ/phút 47,7 (−31,6); phụ đề phủ 57,5% (−22,7); cỡ phụ đề 56 px (0).

### 5 câu hỏi người xem lạ
1. 3 giây đầu: **Chưa đạt** — lời "Hậu vệ lên tận đây. Ai giữ nhà?" có hook nhưng hình 0–3,3 s không chữ nào nói chủ đề; tên chủ đề (tổng lực) chỉ ở header từ 7,6 s (`frame-open-start.png`).
2. Hệ quả trước giây 5: **Đạt** — ô đỏ chớp từ 0 s và mũi tên tím lao vào ô lúc 3,95 s (`board-01.png`).
3. Mỗi cảnh một ý, tắt tiếng hiểu: **Đạt có điều kiện** — `nocaption-board.png`: ô đỏ→xanh, đường cam, nhãn HẬU VỆ/TIỀN VỆ/NHIỆM VỤ/ĐÃ LẤP đủ theo dõi; CHƯA KIỂM bằng bản tắt tiếng chạy thật.
4. Hình đổi nhìn ra được ở 360×640: **Đạt một phần** — 10 cảnh đổi nền/zoom/trạng thái ô, chữ không chép lời (0 chữ lặp); nhưng khoảng 2–3,4 s lặng ở 7 chỗ hình giữ gần tĩnh (QC-02).
5. Kết và bìa: **Đạt** — S09 trả đúng pha mở, S10 có kêu gọi "tôi lấp!"; đuôi im 0,765 s hơn mặc định 0,7 s nhưng đã được Rescue duyệt điểm cắt 56,56 s (chênh do ngưỡng −40 dB); bìa `thumb-180x320.png` đọc được tiêu đề và nhãn.

### Bảng 8 nhóm Y1–Y8 và D8
- Y1 chữ/hình thừa: Đạt có điều kiện — không nhãn "AI tạo"/"ví dụ dựng" trên hình (đã xem 10 khung); lỗi chữ: QC-01, spacing header.
- Y2–Y3 Cáo: Đạt — S02, S07, S10, ~16–17% khung.
- Y4 nền theo ngữ cảnh: Đạt — N1–N4 đổi theo thế bóng (`board-01..04`).
- Y5 mạch kể: Đạt — mở ô hở, trả lời S03 (≈ 11 s), sai lầm S06–S07, kết S09–S10.
- Y6 tốc độ: Chưa đạt theo số đo (5,245 vs 4,6–4,8) — tai CHƯA KIỂM — giám đốc nghe.
- Y7 nhịp nghỉ: Chưa đạt theo số đo (QC-02) — nhịp cảm nhận CHƯA KIỂM — giám đốc nghe.
- Y8 phát âm: `phonemes.py` mã 0, 16 dòng, 0 lỗi; cách đọc "bóng đá tổng lực", "tiền vệ cánh", "đá phủi" CHƯA KIỂM — giám đốc nghe.
- D8: R20 Chưa đạt (QC-04); R21 Chưa đạt (QC-05, 86,6% < 95%); R3 đạt (0 cặp giao, khe nhỏ nhất 108 px); R22 Đạt (100% cảnh có chữ vẽ thật, 43,5 từ/phút, kinetic 1,326/25 s; liệt kê `keywords_without_text` ở M-36/40/42/44/48); R23 Đạt (0/16 câu cờ, 0%) — tai CHƯA KIỂM.

### CHƯA KIỂM — giám đốc nghe/xem
Độ tự nhiên, phát âm ba cụm khó, tốc độ cảm nhận (số đo 5,245 âm tiết/s), nhịp nghỉ Y6–Y8 và 7 khoảng lặng > 2 s, độ êm SFX và onset c004/c009, sức hút opening, chuyển động camera có ý nghĩa (S02/S05/S08), hiểu video khi tắt tiếng (bản chạy thật), header đủ lớn trên điện thoại.

### QC — cần sửa (lỗi dựng) và QC — lỗi thiết kế
- **Lỗi dựng:** QC-01 (S03 chữ cắt mép), QC-02 (sinh lại giọng chậm hơn hoặc rút giữ-sau-lời, mốc dịch theo), QC-03 (nhãn `GẦN Ô`), spacing header `ĐÁ / TỔNG`, bổ sung bbox/opening_title/liên kết cue vào render-log.
- **QC-THIẾT-KẾ:** opening 0–3 s không có chữ/chủ đề và tiêu đề đến lúc 4,87 s (R20, QC-04); header ẩn 0–7,6 s và đổi ô mỗi cảnh làm phủ 86,6% < 95% (R21, QC-05). Đề nghị Đạo diễn hình ảnh/Kịch bản: chủ đề hiện bằng chữ trong 0–3 s hoặc giám đốc xác nhận ngoại lệ opening hai cảnh; chốt header liên tục.

Phán quyết: giữ `review`, đồng thời có lỗi dựng và lỗi thiết kế; giám đốc quyết chấp nhận hay làm lại. Không ready.

### Bài học cho luật
- Script ước tốc độ 4,3 âm tiết/s nhưng giọng thật 5,2: mọi cảnh có "giữ sau lời" cố định biến thành lặng dài; nên đo giọng thật rồi mới chốt cửa sổ cảnh (hoặc ép TTS về 4,6–4,8) trước khi dựng.
- Opening hai cảnh không header mâu thuẫn R21 (≥ 95%); luật nên nói rõ opening được phép ẩn header hay không.
