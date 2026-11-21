# Ghi chú BONG-DA-T25-E01

## Kế hoạch (2026-11-21)
- Storyboard: Gemini (mô hình gemini-3.8-flash-high, MÔ HÌNH DỰ PHÒNG của ghế Gemini) làm thay Codex theo duyệt của giám đốc, lý do Codex bận sản xuất (BUSY); Claude review/duyệt. Vòng 1 `CẦN SỬA` (5 điểm, `review/storyboard-r1.md`), vòng 2 `DUYỆT` → `APPROVED` (`review/storyboard-r2.md`).
- Ảnh sinh (Bước 4b): không cần ảnh. Cả 9 cảnh là sơ đồ chính xác vẽ bằng Pillow và `tools/motion`; `assets/gen/approved.json` ghi `"images": []` kèm lý do.

## Lưu ý cho Sản xuất (không chặn)
- Nền N1 (sân nhìn từ trên) đang đúng trần 40% thời lượng: không thêm cảnh dùng N1.
- `tools/backgrounds/make_background.py` chỉ có nền "office"; nền sân và nền phòng xem vẽ bằng Pillow theo mô tả `environment` trong `storyboard.json`.
- Mốc lời trong `animation_timeline` là dự kiến: đo lại sau TTS rồi khớp mốc hình.

## Sản xuất và QC · 21/11/2026

- Thành phẩm trong `final/`: `BONG-DA-T25-E01_9x16.mp4`, `thumbnail.jpg`, `captions.srt`, `publish.json`. `qc-video` và `qc-publish` đều PASS, không có lỗi. FFprobe/QC đo 57,000 s, 1080×1920, 30 fps, H.264 yuv420p + AAC 48 kHz. Âm lượng tích hợp −14,77 LUFS, true peak −2,04 dBTP sau mã AAC. Giảm gain giao bản 0,55 dB để chừa đỉnh AAC. Không nhạc.
- Hồ sơ QC [Audio / Visual / Narrative](assets/_scratch/qc-auto/report.md) và [JSON](assets/_scratch/qc-auto/report.json) có 111 phát hiện, 81 cảnh báo, 0 lỗi. Đây là số đo để giao review. Giữ `machine_verdict.final_pass_allowed=false`. [QC video](assets/_scratch/qc-video.json) · [QC bài đăng](assets/_scratch/qc-publish.json).
- Dựng bằng Pillow + FFmpeg theo renderer đã duyệt, với sân, phòng xem, bản đồ cơ thể và mẫu áo bằng đồ họa hình khối. `assets/gen/approved.json` có danh sách rỗng. Dùng các pose gốc `brand/cao/poses/think.png`, `idea.png`, `thumbs_up.png`; đặt lớp PNG alpha và nhún nhẹ trong Pillow để bám bố cục, thay lớp MOV của `narrate.mjs`. Cảnh S05 dùng wipe lên trong 0,32 s đầu cảnh. Giữ `assets/_scratch/picture.mp4` và `assets/render-log.json` cho QC.
- R24 dùng `prosody.mjs plan`, `gen_vo.py --plan`, `prosody.mjs timeline`, `assemble.py` và `prosody_metrics.py`. Đặt mốc theo script trên thời lượng WAV thật, giảm tempo ở các dòng nhanh. Bản cuối đo 4,791 âm tiết/s trên stem giọng, 4,674 trên MP4; lệch onset tối đa 0,074 s tính từ cửa sổ có đệm. 14 cửa sổ giữ đệm 60 ms đầu và 140 ms cuối. `splice.py check` trả `[]`, 0/14 biên có cờ qua QC cuối.
- R25 chạy cue sheet và mixer bốn lớp. Giữ `assets/sound-cues.json`, `assets/audio/stems/`, `assets/audio/mix.wav` và `assets/audio/mix-report.json`. SFX/impact do bộ tổng hợp nội bộ tạo. Mixer có thể dời nhẹ cue ra khỏi lời. QC nhận onset stem nhưng thiếu liên kết cue-ID đến đối tượng trong nhật ký dựng; c009 hạ cờ có thêm cờ lệch onset. Xem bảng Audio QC và nghe kiểm tương quan cue với hình.
- Ba pha opening 0–3, 3–5, 5–7,8 s. Đổi hình đầu ở 0,1 s, cờ bật ở 1,2 s, câu hỏi vào 3,15 s, title từ 5 s. Header phủ 100% từ sau opening, 7 lần đổi ô, không có cờ đè theo QC. Thành phần nhãn chủ đề trong HeaderTrack dùng cỡ mặc định 42 px và dòng VIỆT VỊ 58 px. Ngưỡng 52 px của plan chưa đạt ở dòng nhãn chủ đề. Đã đọc thử trên khung 360×640.
- Đã mở khung 360×640 ở [đầu](assets/_scratch/qc-0.5.jpg), [mở chủ đề](assets/_scratch/qc-5.23.jpg), [đáy nách](assets/_scratch/qc-19.jpg), [chỏm vai](assets/_scratch/qc-35.9.jpg), [hai ví dụ](assets/_scratch/qc-38.2.jpg) và [kết](assets/_scratch/qc-55.7.jpg). Bìa dùng khung hình hook ở 1,85 s cùng chữ bìa duyệt và đã mở [180×320](assets/_scratch/cover-180.jpg). 21 cue SRT, tối đa 2 dòng và 27 ký tự/dòng, ASS 56 px trong dải dưới. Quét tên nền tảng trên SRT, storyboard, scenes và các khối đăng, không có kết quả. Kiểm theo [bản dựng không phụ đề](assets/_scratch/picture.mp4) để thấy quan hệ hình học của hai ví dụ.

### Đối chiếu Y1–Y8 và cờ QC

| Nhóm | Kết quả |
|---|---|
| Y1 · Chữ | Chữ lấy từ semantic_plan và header đã duyệt. QC tìm 93,3% sự kiện chữ đúng mốc; có chuyển động hiện chữ và nhãn đối chiếu cuối S07 chỉ có 0,95 s theo storyboard. Cụm “VỊ TRÍ VIỆT VỊ” là nhãn kết quả duyệt, trùng lời 09. Cờ thiếu 26 nhãn từ khóa giữ nguyên vì kịch bản minh họa các từ đó bằng vật thể và hạn chế chữ. Một số nhãn nối qua leader dài, phép đo bbox của QC vẫn gắn cờ khoảng cách. Cờ mép của vạch sân và các bbox chuyển động nằm trong bối cảnh minh họa; đọc ảnh ở các mốc báo cáo khi review. |
| Y2–Y3 · Cáo | Think ở S00 (3–6 s), idea và thumbs_up ở S10; khoảng 7,25 s, rộng 174–185 px, đáy ≤ 1285 px. Theo storyboard đã duyệt bỏ Cáo giữa bài ở S05 để dành chỗ cho mạng đường nối. |
| Y4 · Nền | Bốn bố cục theo cảnh; nền sân cùng tọa độ ở mở và quay lại. Có crop tiến ở S04/S07; wipe ngắn S04→S05. |
| Y5 · Mạch kể | Bóng vào lưới → cờ đỏ → hai phe và cờ vàng → quay lại cờ hạ, tay xám và chip xanh. Không cắt qua câu. S07 giữ chỏm vai nhô qua vạch trong lúc tay đã khép. Sức hút và độ rõ của mạch kể chờ người duyệt. |
| Y6 · Tốc độ | WAV giọng 4,791 âm tiết/s theo qc-measure. Tốc độ cảm nhận, nhấn ý và tự nhiên CHƯA KIỂM — giám đốc nghe. |
| Y7 · Nhịp | Giữ mốc cảnh và thời gian quan sát theo duyệt. Nhịp mở có 2,83 s trước lời giải để giữ title/tua tình huống; S04 có 3,618 s sau câu để tay duỗi xa, đường cam giữ mốc và chuyển wipe. Khoảng nghỉ lệch chỉ dẫn prosody còn ở các ranh giới theo bảng Audio. Đuôi 0,729 s đo ở −40 dB, hơn mặc định 0,029 s, giữ vai sáng và Cáo chốt đủ phần đệm/cảnh 57 s. |
| Y8 · Phát âm | Đã rà 14 dòng và `phonemes.py` mã 0. “Ai” ở câu hỏi là đại từ tiếng Việt, dùng từ điển riêng để tránh áp chữ viết tắt. Mẫu nghe bên dưới. |

Cờ ít chuyển động theo trung vị khối ở S03 (quét và tẩy tay, giữ kết quả), S04 (nhấn vai, cẳng tay duỗi, đốm cam), S06 (tay vươn rồi giữ vị trí chuyền), S07 (giữ chỏm vai sau push-in và chốt bằng hai ô), S08 (thêm áo dài và quét chung mốc nách). `qc-video` đo tĩnh dài nhất 1,8 s. Khe giữa các nhãn và các khoảng giữ dài vẫn cần xem theo diễn biến ở khung thật.

### Nghe kiểm

| Thuật ngữ | Chữ đưa TTS | Âm vị trong câu | Nguồn | Clip |
|---|---|---|---|---|
| Ai | Ai | ˈaːj | Từ điển riêng, tiếng Việt | [ai.wav](assets/voice/term-check/ai.wav) |
| nách | nách | nˈe-ɜc | Kịch bản | [nach.wav](assets/voice/term-check/nach.wav) |
| đáy nách | đáy nách | ɗˈaɜj nˈe-ɜc | Kịch bản | [day-nach.wav](assets/voice/term-check/day-nach.wav) |
| chỏm vai | chỏm vai | tʃˈɔ4m vˈaːj | Kịch bản | [chom-vai.wav](assets/voice/term-check/chom-vai.wav) |

## QC — lượt 1 (Claude, 21/11/2026)

Đo lại độc lập: `node tools/qc-measure.mjs ep01 --baseline docs/baseline/T5-qc-auto.json --frames "0.5,3.5,5.2,19,30,36,38,45,55.7"` → 112 phát hiện, 81 cảnh báo, 0 lỗi (`assets/_scratch/qc-auto/report.md`). Đã mở 4 board, 9 khung full-res, frame-open-mid, header-zones, textheavy-S08, nocaption-board, bìa 180×320 (≈ 17 ảnh). Gemini xem trước: vắng (bỏ qua, không cần thiết cho lượt này). Dọn `final/`: đúng 4 file, không phải dọn.

### Ba kết luận

- **KỸ THUẬT: ĐẠT.** 57,000 s, 1080×1920, 30 fps, H.264/AAC; mix −14,22 LUFS (qc-measure), MP4 −14,77 LUFS; true peak −1,82 dBTP; qc-video/qc-publish 0 lỗi; đuôi im 0,729 s (cảnh báo M-18, hơn 0,7 s mặc định 0,029 s, ghi lý do ở trên, chấp nhận); lệch lời–hình ≤ 0,074 s; R23 0/14 câu cờ biên; R3 0 cặp chữ giao nhau (khe nhỏ nhất 226 px); phụ đề 56 px dải dưới, 21 cue ≤ 27 ký tự/dòng.
- **TUÂN THỦ: ĐẠT, kèm 1 điểm lệch cỡ.** grep `facebook|youtube|zalo|tiktok` trên `captions.srt`, `scenes.json`, `storyboard.json`: trống; `publish.json` đủ 3 nền tảng + khai báo AI, không nêu năm/"luật mới 2026", không khẳng định độ chính xác VAR/việt vị bán tự động, không clip/ảnh/logo giải đấu; nguồn IFAB Luật 11 có trong `sources`. `approved.json` `images: []`, không ảnh sinh, không cần sổ ảnh; chỉ dùng pose Cáo của xưởng. Không thấy hình đồ ăn/đôi dép. Lệch: nhãn chủ đề header 42 px < 52 px của plan (QC-01).
- **TRẢI NGHIỆM: CHƯA KIỂM phần nghe; phần xem ĐẠT có cảnh báo nhịp.** Khung xem được rõ, mạch kể ví dụ bàn bị gạt → hai phe → đáy nách → hai ví dụ đối chiếu → áo cộc/áo dài → quay lại cú đầu → "nhìn vai, đừng nhìn tay" logic. Cảnh báo nhịp: tỉ lệ lặng 46,2% (chuẩn T5 34%), 5 cảnh trung vị 0 khối chuyển động.

### Bảng phát hiện (mốc, bằng chứng, mức)

| Mã | Nhóm | Mốc | Bằng chứng | Mức | Đề nghị |
|---|---|---|---|---|---|
| QC-01 | TUÂN THỦ · R21 | 3,9–53,8 s, mọi cảnh có header | `header-zones.png`, khung `frame-19.png`: dòng "BÓNG ĐÁ /" nhỏ (42 px theo ghi chú Sản xuất), dòng "VIỆT VỊ" 58 px; vị trí trong vùng an toàn, không che Cáo/phụ đề/sơ đồ (đã nhìn); qc-measure báo 0 đoạn sai cỡ | cảnh báo | Chấp nhận hoặc nâng nhãn lên ≥ 52 px nếu giám đốc muốn đúng plan; không chặn |
| QC-02 | TRẢI NGHIỆM · Y7/R4 | S04 17,3–20,95 s; S03/S06/S07/S08 | M-09 lặng 3,618 s; M-01..M-05 trung vị 0 khối; tĩnh dài nhất 1,8 s (M-06, 35,8–37,6 s); `scene-S0x.png`. Khung 19 s vẫn có push-in và đường cam giữ mốc, tức hình có đổi nhưng chậm | cảnh báo | Giám đốc nghe/xem nhịp thật; chưa thấy hình chết hoàn toàn |
| QC-03 | TRẢI NGHIỆM · R17/Y1 | S07 35,6–38,6 s | M-22/M-61: nhãn "VỊ TRÍ VIỆT VỊ" trùng 100% lời 09; `textheavy-S07.png`. Là nhãn kết quả, đã được duyệt | cảnh báo (chấp nhận) | Không sửa |
| QC-04 | TRẢI NGHIỆM · Y1 | S08 40 s | board-03 ô 40 s: nhãn "MÉP TAY ÁO" ở trạng thái mờ vào, chữ tối trên thẻ tối; khung 41,7 s đã đọc rõ (`textheavy-S08.png`) | thông tin | Chỉ là khung chuyển hiện; xem trên thiết bị thật |
| QC-05 | TRẢI NGHIỆM · R3 | S04 ~19 s; S07 ~36 s | `frame-19.png`: thẻ "ĐÁY NÁCH" chạm sát cổ/đầu hình người; `frame-36.png`: thẻ "VỊ TRÍ VIỆT VỊ" che một phần hông/đùi (không che chỏm vai) | thông tin | Chấp nhận; không đè chữ khác |
| M-24..M-53 | TUÂN THỦ · R22 | S00–S10 | 26 keyword (thân, chân, tay, vạch…) không có chữ vẽ thật; 4 keyword khai minh hoạ bằng hình; 100% cảnh có chữ, 35,8 từ/phút (dưới dải 20–45 không; nằm trong), kinetic 1,754/25 s | cảnh báo (loại trừ) | Các từ là bộ phận cơ thể/vật thể đã vẽ trực tiếp, nhãn hoá hết sẽ vượt Y1 (chữ thừa); thuật ngữ chính (ĐÁY NÁCH, VAI, CÁNH TAY, ĐƯỢC TÍNH, KHÔNG TÍNH, VỊ TRÍ VIỆT VỊ) đều có nhãn |
| M-54..M-60 | R22 | S04/S05/S06/S08/S09 | nhãn cách đích 42–299 px (có leader/đường nối nhìn thấy ở board) | cảnh báo (loại trừ) | Nhãn nối bằng leader, đọc được ở board-02/03 |
| M-62..M-92 | Y7 | nhiều biên | khoảng nghỉ thực tế dài hơn kế hoạch 0,03–1,83 s; chủ yếu để hình giữ sau lời | cảnh báo | CHƯA KIỂM — giám đốc nghe nhịp |
| M-93..M-102 | R25 | 9 cue | onset stem lệch ≤ 0,065 s nhưng QC thiếu liên kết cue-ID tới hình ("không gắn hình"); 0/9 | cảnh báo công cụ | Không phải lỗi dựng; nghe kiểm tương quan SFX–hình |
| M-103..M-110 | R3 | S00, S04, S06, S07, S09, S10 | bbox chạm mép: do vạch sân/khung sân/push-in, đã xem board và `scene-*.png`, không có chữ/Cáo tràn | cảnh báo (loại trừ) | — |
| M-111, M-112 | Y1 | S07 37,7 s; S00 1,2 s | nhãn "KHÔNG VIỆT VỊ" hiện 0,95 s (ngắn hơn 1,01 s); "VIỆT VỊ?" lệch cửa sổ lời mức câu | cảnh báo | Chấp nhận; xem ở bản chiếu thật |
| M-21 | Y6 | 0–57 s | 4,791 âm tiết/s trên giọng gốc (dải 4,6–4,8 đạt), 4,674 trên MP4; +24,9% so với chuẩn T5 (3,837, chuẩn đo trên MP4) | thông tin | CHƯA KIỂM — nghe |

### So với bản chuẩn T5 (cột Δ từ qc-measure)

| Chỉ số | T25 | T5 | Δ |
|---|---|---|---|
| Thời lượng (s) | 57 | 44,633 | +12,367 (trong 45–75 s) |
| Số cảnh / TB cảnh (s) | 9 / 6,33 | 18 / 2,48 | −9 / +3,85 |
| Lần cắt/10 s | 1,404 | 3,809 | −2,405 |
| Tĩnh (%) / dài nhất (s) | 44,1 / 1,8 | 30,8 / 1,2 | +13,3 / +0,6 |
| Tỉ lệ lặng | 0,462 | 0,34 | +0,122 |
| Từ chữ minh hoạ/phút | 38,9 | 79,3 | −40,4 |
| Phụ đề phủ (%) | 69,3 | 80,2 | −10,9 |
| LUFS tích hợp | −14,77 | −14,85 | +0,08 |
| Đuôi im (s) | 0,729 | 0,691 | +0,038 |

Cảnh dài (6,3 s TB) và ít cắt là chủ ý của dạng "một sơ đồ một ý" của video chuẩn 45–75 s; số cảnh ít không phải lỗi.

### D6/D7/D8 (nhóm Audio / Visual / Narrative)

- **Audio:** tốc độ 4,791 (đạt dải); lặng 46,2%, lặng dài nhất 3,618 s (S04, M-09), đuôi 0,729 s; biên 0/14 cờ nuốt chữ (đo); phát âm `phonemes.py` mã 0 (14 dòng, 0 lỗi, theo QC đo). Giọng tự nhiên, nuốt/kéo chữ, nhấn ý, độ êm SFX: **CHƯA KIỂM — giám đốc nghe**.
- **Visual:** opening riêng 7,8 s (0–3 hook, 3–5 mâu thuẫn, 5–7,8 title), Đạt R20; header phủ 100% sau opening, 7 lần đổi ô, 0 đè (R21 đo; QC-01 cỡ nhãn); chữ vẽ thật 100% cảnh; giữ sau lời nhỏ nhất 0,729 s (S10 cuối, S04 3,465 s); camera push-in S04/S07 hiệu 11,7 và 16,8/255, phục vụ nhấn chỏm vai và đáy nách (đã nhìn `camera-S04/S07`). Hình đúng kỹ thuật so với IFAB Luật 11 (đáy nách là mốc, vai tính, tay không): khớp, sơ đồ nhất quán giữa S04, S07, S08.
- **Narrative:** 0,702 khái niệm/10 s, 4,2/phút, thứ tự và ví dụ đạt qua đọc script + board; hiểu khi tắt tiếng (`nocaption-board.png`): hiểu được ý "tay không tính, vai tính" nhờ nhãn ĐƯỢC TÍNH/KHÔNG TÍNH, KHÔNG VIỆT VỊ/VỊ TRÍ VIỆT VỊ; kết có hành động ("nhìn vai, đừng nhìn tay"). Sức hút mở đầu và logic cảm nhận: CHƯA KIỂM.

### 5 câu hỏi người xem lạ

1. Trong 3 s đầu: **Đạt**. Hình cú tay vươn qua vạch + cờ đỏ, nhãn "VIỆT VỊ?" 1,2 s, phụ đề "Ví dụ: bàn bị gạt, vì cái tay này?" (frame-0.5, board-01).
2. Trước 5 s: **Đạt**. Bàn bị gạt, cờ hiệu, hai phe cãi ("Ai đúng?" 3,15 s), nhãn "TAY QUA VẠCH?" 5 s.
3. Mỗi cảnh một ý, tắt tiếng: **Đạt** theo `nocaption-board.png`, chờ người duyệt xác nhận.
4. Hình đổi ở 360×640, chữ không chép lời: **Đạt có cảnh báo** (QC-02, QC-03); mọi khoảng ≥ 1,5 s có đổi hình hoặc chip; tĩnh dài nhất 1,8 s.
5. Kết/bìa: **Đạt**. Kết giải quyết câu hỏi mở, đuôi 0,729 s; bìa là khung hook, "TAY QUA VẠCH?" đọc được ở 180×320 (`thumb-180x320.png`).

### Y1–Y8

| Nhóm | Kết luận |
|---|---|
| Y1 Chữ | Đạt (QC-03/04 là thông tin); không nhãn "AI tạo", không chữ thừa |
| Y2–Y3 Cáo | Đạt: Cáo ở S00 (think) và S10 (idea, thumbs_up), cỡ ~175–185 px, không che sơ đồ |
| Y4 Nền | Đạt: 4 bố cục theo cảnh, sân cùng tọa độ ở mở và quay lại |
| Y5 Mạch kể | Đạt phần xem; sức hút CHƯA KIỂM |
| Y6 Tốc độ | CHƯA KIỂM — giám đốc nghe (đo 4,791/4,674 âm tiết/s) |
| Y7 Nhịp | CHƯA KIỂM — giám đốc nghe (lặng 46,2%, 3,618 s, đuôi 0,729 s) |
| Y8 Phát âm | `phonemes.py` mã 0, 0 lỗi; nghe CHƯA KIỂM |

**Phán quyết lượt 1:** không có FAIL, không lỗi thiết kế. Giữ `review`, đánh cờ QC-CHỜ-NGHE.

**Bài học cho luật:** (1) QC cue SFX báo "không gắn hình" ở mọi cue vì Producer không ghi liên kết cue-ID vào `render-log.json`; nên thêm bước ghi liên kết này. (2) Cỡ nhãn chủ đề của header (42 px) lệch ngưỡng 52 px nhưng công cụ không bắt; nên đo riêng từng dòng header.

### needs_manual_review (QC bổ sung)

- Nghe toàn bộ: giọng, nuốt/kéo chữ, nhấn ý, nhịp nghỉ 1,4–3,6 s, SFX/impact **CHƯA KIỂM — giám đốc nghe**.
- Xem thiết bị thật: header nhỏ nhãn 42 px (QC-01), nhãn "MÉP TAY ÁO" khi mờ vào (QC-04), nhịp S04 (QC-02).

### needs_manual_review

- Âm sắc, độ tự nhiên, phát âm, nhấn ý, nhịp cảm nhận và độ êm của SFX/impact: **CHƯA KIỂM — giám đốc nghe**.
- Sức hút opening, logic mạch kể, dễ đọc trên thiết bị thật và khớp từng thành phần hình–lời: **CHƯA KIỂM** ở bước duyệt.

