# Ghi chú IT-T16-E01

- Storyboard: vòng 1 Claude làm thay Codex theo lệnh của giám đốc (21/11/2026), lý do Codex lỗi sandbox chỉ-đọc, không ghi được file (`review/codex-storyboard-r1.prompt.md.reply.md`); vòng 2 Codex sửa theo `review/storyboard-r1.md`; `visual-director` duyệt `APPROVED` sau khi sửa nhỏ (`review/storyboard-r2.md`).
- Ảnh sinh (Bước 4b): Gemini vắng (NO_ACCOUNT, thử 2 lần). Không có ảnh AI; S01/S10/S11 dùng nền `office` của `tools/backgrounds/make_background.py` + đạo cụ tự vẽ. Brief để dùng lại nếu muốn sinh sau: `review/gemini-images-S01-r1.prompt.md`.
- Schema storyboard: Codex báo Ajv OK ở vòng 2; sau sửa nhỏ của `visual-director` chưa chạy lại Ajv (việc plan không có quyền chạy lệnh kiểm), Producer nên kiểm lại khi dựng.

## Producer · tiền kỳ và vướng mắc header

- Storyboard APPROVED qua Ajv (`true`, `errors: null`). Renderer duyệt Pillow + FFmpeg. Danh sách ảnh Gemini rỗng. Đã tạo bốn nền office, database, incident, security bằng `tools/backgrounds/make_background.py --layers` trong `assets/_scratch/bg/`.
- Header S02–S11 theo storyboard phải giữ nguyên «BANKING / HỆ THỐNG LÕI» một dòng, 56 px, không có title riêng, đổi ô trái/phải qua HeaderTrack. Thử `choose_slot('top_right', (), spec=HeaderSpec(text, ''))`, rồi thử riêng ô rộng nhất bằng `choose_slot('top', (), order=('top',), spec=HeaderSpec(text, ''))`. Cả hai trả `ValueError: Không có ô nào đủ chỗ cho tiêu đề và nhãn chủ đề`. `tools/motion/header.py` gọi `_fit_lines` cho title và từ chối chuỗi rỗng. Đo qua `tools.motion.text.measure`: 681×63 px ở Segoe UI Semibold 56 px và 633×59 px ở 52 px. Ô trái/phải rộng 620 px trước lề.
- Phương án xin Visual Director duyệt: thẻ một dòng riêng bằng text engine Pillow trong mã của tập, rộng khoảng 740 px, neo trái/phải theo các cảnh đã duyệt, nội suy 0,4 s và kiểm khe 24 px với bbox thật. Giữ nguyên câu chữ, cỡ 56 px và ghi sự kiện header thực vẽ vào RenderLog. Phương án khác là cập nhật thành phần HeaderTrack để hỗ trợ thẻ một dòng và các ô rộng hơn.
- Giọng Hải Đăng đã ráp thành `assets/voice/voice-track.wav`. Dùng kế hoạch prosody điều chỉnh để mỗi câu gọi TTS một lần. Cả 15 câu có đệm đầu 60 ms, cuối 140 ms theo generation. Splice kiểm từng clip và prosody_metrics kiểm bản ráp: 0 biên vi phạm. WAV 59,500 s theo ffprobe, hook vào 0,600 s, đuôi 0,630 s theo timeline. Kéo dài cửa sổ S10 khoảng 0,067 s để giữ 1,13 s sau lời và rút S11 theo câu TTS thực, không tăng tốc thêm. Chờ chốt đồng bộ chữ/hình theo mốc giọng thật.
- Kiểm từ điển và âm vị đều thoát mã 0. Độ tự nhiên, nhịp, tốc độ cảm nhận và phát âm: **CHƯA KIỂM — giám đốc nghe**. Các tiêu chí cảm nhận về SFX, sức hút opening và logic mạch kể: **CHƯA KIỂM**.
- Bản dựng, cue sheet theo hình, bản trộn và QC thành phẩm đang chờ xử lý header.

## Hướng dẫn từ Claude (gỡ vướng, 21/11/2026) — Claude gỡ vướng

Nguyên nhân gốc: `tools/motion/header.py` (`HeaderSpec(topic, title)`, `_fit_lines`) bắt buộc 2 hàng topic + title không rỗng và ô trái/phải chỉ 620 px; storyboard khai header một dòng không title, 56 px, nên không vừa component. Không phải lỗi dữ liệu hay giọng. Không đổi thiết kế đã duyệt: giữ câu chữ «BANKING / HỆ THỐNG LÕI», 56 px, các ô S02–S11.

Cách làm (Codex, trong mã riêng của tập, KHÔNG sửa `tools/motion/header.py`):
1. **Chính, được duyệt:** thẻ một dòng bằng Pillow qua `tools.motion.text` (draw_text/measure), cỡ 56 px, bbox thật ≈ 681 px chữ + inset 22×2 ≈ 725–740 px, cao ≈ 63+24. Nền/viền giống `header_card` (palette ink/edge, bo 20). Ô: top_right và top_left neo mép SAFE tương ứng với chiều rộng thật (cho phép vượt 620 px vì thẻ này rộng 740 px; vẫn ≤ 9% khung = 186 624 px², thẻ ≈ 740×87 ≈ 64 000 px²). S02 dùng "top" căn giữa. Nội dung chính bắt đầu y ≥ 420 nên không đè.
2. Đổi ô giữa các cảnh: mờ ra/vào 0,4 s như HeaderTrack; kiểm khe ≥ 24 px với bbox Cáo, vật, phụ đề (dải dưới) bằng bbox thật; ghi từng sự kiện vào `assets/render-log.json` dạng `header` (slot, bbox, topic = toàn chuỗi, title = "") để `qc-measure` đo coverage ≥ 95%, cỡ ≥ 52 px, 0 đè.
3. **Dự phòng nếu bbox thật chạm nội dung:** dùng `HeaderSpec("BANKING", "HỆ THỐNG LÕI")` với `scale≈1.4` (hai hàng, mỗi hàng ≥ 52 px, vừa ô 620 px) — chỉ thay đổi ngắt hàng, chữ giữ nguyên; ghi lý do vào notes.md.
Không rút gọn chuỗi, không hạ dưới 52 px (D8/R21). Sau khi dựng chạy lại Ajv storyboard và kiểm tiếp phần giọng/đồng bộ như ghi ở mục Producer. Tiếp tục từ trạng thái đã có: giọng `assets/voice/voice-track.wav` và các nền `_scratch/bg/` giữ nguyên, không tạo lại.

| Thuật ngữ | Chữ đưa TTS | Âm vị đo | Clip nghe kiểm | Nguồn |
|---|---|---|---|---|
| NAPAS | Napas | nˈɑːpəz | assets/voice/term-check/napas.wav | riêng |
| QR | cue are | kjˈuː ɑːɹ | assets/voice/term-check/qr.wav | riêng |
| app | app | ˈæp | assets/voice/term-check/app.wav | riêng |
| ATM | ay tee em | ˈaj tˈiː ˈɛm | assets/voice/term-check/atm.wav | riêng |

## Producer · bàn giao bản dựng IT-T16-E01

- Tệp giao trong `final/`: `IT-T16-E01_9x16.mp4`, `thumbnail.jpg`, `captions.srt`, `publish.json`. Bìa lấy S02 ở 8,30 s, đã mở bản 180×320. Kiểm các khung thành phẩm 360×640 ở 0,50 / 2,20 / 29,40 / 45,90 / 58,40 s.
- Dựng 11 cảnh bằng Pillow + FFmpeg theo JSON APPROVED. Ajv hợp lệ. Dùng nền office / database / incident / security đã có từ tools/backgrounds; các đạo cụ là hình vẽ trong `assets/_scratch/visual.py`. Cáo dùng pose think, stop và thumbs_up từ brand/cao/poses, ghép trực tiếp theo tọa độ cảnh. Header một dòng 56 px dùng text engine và trượt 0,4 s giữa các vị trí theo hướng dẫn gỡ vướng; nhật ký đo độ phủ 100% sau opening. Hai thao tác S07 và S10 dùng biểu tượng theo JSON đã duyệt. Bản hình sạch phụ đề tại `assets/_scratch/picture.mp4`. Timeline và sự kiện tại `assets/scenes.json` và `assets/render-log.json`.
- Giữ WAV Hải Đăng đã ráp theo prosody và các cửa sổ R23 của lượt tiền kỳ. Chạy lại Pronounce và Phonemes đều trả mã 0. Đối chiếu bản ráp, qc-measure đo 0 vi phạm biên. Hook vào 0,60 s, đuôi 0,63 s theo cue và 0,682 s theo ngưỡng -40 dB. Tốc độ đo theo phần có tiếng là 5,43 âm tiết/s, cao hơn ngưỡng thử 4,6–4,8; giữ giọng đã ráp theo hướng dẫn Claude. Khoảng nghỉ lớn nhất 3,818 s ở chuyển S05 → S06, dùng để quan sát sơ đồ hoàn chỉnh, luồng hỏi/đáp lặp và chuyển sang trạng thái lõi im. Các khoảng nghỉ liên cảnh còn lại bao gồm phần giữ hình và chuyển cảnh; báo cáo có bảng chênh lệch từng mốc.
- Cue sheet trong `assets/`, bốn stem và mix-report trong `assets/audio/`. Nhạc tắt; mixer giữ 10 cue, loại 22 cue theo bộ lọc mật độ/khoảng lặng. PCM -14,2 LUFS và -1,80 dBTP, không có mẫu clip. Bản AAC đầu lên -0,95 dBTP; hạ 0,7 dB khi mã hóa lại từ mix.wav. Kết quả MP4 -14,94 LUFS, -1,65 dBTP.
- `ffprobe`: 59,500 s, 1080×1920, 30 fps, H.264 yuv420p + AAC 48 kHz. `qc-video` trả `pass: true`, 0 lỗi, 5 cảnh báo ít chuyển động. Tĩnh dài nhất 1,2 s. S03 giữ sổ đứng yên trong lúc điện thoại lỗi rồi mũi tên lần lượt nối vào sổ. S06 dừng gói hỏi, ba cổng đỏ và giữ hai thanh đối chiếu. S08 giữ hai vật chính để nhìn đường lịch sử và thông báo nối vào cùng dòng. S09 thu chuyển động vào đường chung đứt và hai khối tắt. S10 giữ góc quầy để thấy con trỏ chuyển từ nút gửi sang lịch sử. `qc-publish` trả `pass: true`, 0 lỗi và 0 cảnh báo.
- `qc-measure` standard: 200 phát hiện, 169 cảnh báo, 0 lỗi. Bản đầy đủ ở `assets/_scratch/qc/report.md` và `report.json`. Opening đủ ba pha, tiêu đề và mốc lời đạt phép đo; cảnh báo cửa sổ 4–5 s là khoảng giữ tiêu đề để đọc. Các cảnh báo header chủ yếu là phép đo mặc định đòi trường chữ thứ hai và hai ô cùng hiện, trong khi thẻ một dòng trượt giữa hai ô theo phương án đã duyệt. Các cảnh báo mật độ chữ tính các số trung gian của bộ đếm S04 thành các chuỗi riêng; S02 và S05 hiện đồng thời nhãn ba kênh và số giờ hoặc nhãn lõi đúng storyboard. Ba hiệu ứng chữ ở S01/S05/S07; máy tính được 0,84 lần/25 s do bộ nhận diện gộp/đếm hiệu ứng khác với timeline. Keyword «có tiền» có biểu tượng ví, theo thiết kế không thêm chữ. Một số mốc nhãn đọc ngắn do phép đo dùng đoạn bbox tách rời khi chuyển động; xem bảng chữ thật để đối chiếu. Những cờ vùng an toàn và khe nhãn còn lại cần đối chiếu trực quan trên khung thực. Cue sheet đo được onset nhưng còn thiếu liên kết ID đối tượng để máy xác nhận một số mốc hình. S07→S08 giữ bố cục để so trạng thái của cùng điện thoại và sổ.
- Y1 đã đối chiếu chữ và dấu tại các khung kiểm; Y2/Y3 đã kiểm ba lần xuất hiện Cáo với bề rộng 160–180 px; Y4 dùng bốn bối cảnh theo nội dung; Y5 quầy cơm quay lại ở S10; Y6/Y7 đã đo tốc độ, khoảng nghỉ và đuôi; Y8 đối chiếu từ điển và âm vị. Đánh giá nhịp lời–hình ở cấp từng từ **CHƯA KIỂM**.
- `needs_manual_review`: độ tự nhiên, tốc độ cảm nhận, ngữ điệu, phát âm và độ êm tai của hiệu ứng **CHƯA KIỂM — giám đốc nghe**. Sức hút opening, logic mạch kể, khả năng đọc các sơ đồ và đồng bộ theo từ **CHƯA KIỂM**. Các kết quả máy dùng làm bằng chứng cho lượt review.

## QC — 21/11/2026 — lượt 1

Đo: `node tools/qc-measure.mjs ep01 --baseline docs/baseline/T5-qc-auto.json` (standard): 201 phát hiện · 169 cảnh báo · 0 lỗi. Mix -14,24 LUFS / -1,8 dBTP, MP4 -14,94 LUFS; 59,5 s; 1080x1920 30 fps. Gemini xem trước: Gemini vắng (NO_ACCOUNT), bỏ qua. Đã xem 14 ảnh (board-01..04, nocaption-board, header-zones, thumb-180x320, frame-conclusion, frame-s04-15.5 full-res, khung đối chiếu). `final/` đủ 4 tệp, không cần dọn. Sổ nguồn: không hình ngoài/AI (nền Pillow + đạo cụ tự vẽ + Cáo nội bộ), không cần dòng LICENSES.

### Phân loại 169 cảnh báo (tự kiểm, không tin tóm tắt Producer)
- M-25..M-104 (80 R21 "header thiếu chữ trong bbox") + M-105..M-110 (0 s cùng hiện hai ô): xem `header-zones.png` và board: header một dòng "BANKING / HỆ THỐNG LÕI" 56 px có mặt ở S02–S11, không đè Cáo/vật/phụ đề, y≈260–350. Phép đo đòi title thứ hai; LOẠI TRỪ, chỉ còn chuyển ô trượt 0,4 s cần giám đốc nhìn thật. Header S01 ẩn theo thiết kế.
- M-165..M-196 (32 "nhãn hiện ngắn"): là số đếm 0→31 triệu ở S04, không phải nhãn thật; LOẠI TRỪ.
- M-01..M-05 (R4 ít chuyển động S03/S06/S08/S09/S10): có sự kiện hình rời (mũi tên, ô so sánh, đường nối) nên chấp nhận; chuyển động cảm nhận CHƯA KIỂM.
- M-148..M-158 (cue SFX "không gắn hình"): thiếu liên kết ID đối tượng; onset lệch ≤ 0,065 s; không phải lỗi dựng; êm tai CHƯA KIỂM.
- M-159..M-164 (bbox chạm mép S01, S10): chưa thấy chữ tràn ở board/scene; CHƯA KIỂM bbox.
- M-200 split_compare liên tiếp S06–S09: thật, cảnh báo nhỏ.

### Lỗi cần sửa
| Mã | Nhóm | Mốc | Bằng chứng | Mức | Đề nghị |
|---|---|---|---|---|---|
| QC-01 | TRẢI NGHIỆM Y6/R24 · M-19, M-20 | 0–59,5 s | 5,43 âm tiết/s trên WAV giọng gốc (5,247 trên MP4), ngưỡng 4,6–4,8, +41,5% so bản chuẩn (kỳ vọng +10–15%); kế hoạch 4,25–4,40 (41,25 s đọc), thực 32,41 s có tiếng; lặng 45,5% | LỖI DỰNG | Sinh lại giọng theo `prosody` đúng tốc độ kế hoạch (atempo [dẫn] 1,15 / [kỹ thuật] 1,10, không tăng thêm), canh lại mốc cảnh; tổng dự kiến ≈ 62–66 s, trong 45–75 s |
| QC-02 | TRẢI NGHIỆM Y7 · M-11, M-141..M-147 | 27,157–30,975 s (S05→S06); thêm 7,16–9,63, 18,88–21,5, 34,73–36,32, 40,17–41,8, 44,8–46,9, 49,75–51,9 | Nghỉ 3,818 s (ngưỡng 3 s), lệch kế hoạch 3,37 s; 7 khoảng lặng dài ngoài kế hoạch; lời nhanh rồi lặng lâu | LỖI DỰNG | Sửa cùng QC-01, đưa nghỉ về kế hoạch (S05 giữ ≈ 2,0 s thay 3,7 s) |
| QC-03 | KỸ THUẬT R3 · M-118..M-120 | 14,97–19,6 s S04 (`assets/_scratch/qc-auto/frame-s04-15.5.png`) | Nhãn "NAPAS 2025" đè lên icon kênh thứ ba (chữ N chồng khung icon, x≈335/1080, y≈527); text_overlap báo 0 vì icon không phải chữ | LỖI DỰNG | Dời nhãn, khe ≥ 24 px với icon |
| QC-04 | TUÂN THỦ plan/R22 · M-115..M-117 | 51,8–55,4 s S10 | Script/storyboard khai nhãn "Chưa xác nhận" gắn điện thoại ở S10 nhưng render-log S10 = 0 từ chữ; board-04 ô 52/54 s không nhãn | LỖI DỰNG nhỏ | Thêm nhãn 51,30–54,55 s |
| QC-05 | TRẢI NGHIỆM Y3 | 55,8–59,5 s S11 (frame-conclusion.png) | Cáo 175 px chồng góc dưới thẻ "Bấm lại" | Cảnh báo | Dời Cáo ra ngoài thẻ |
| QC-06 | TUÂN THỦ nội dung | publish.json facebook_reels.description | "mọi kênh phải hỏi một hệ thống lõi" trái với lời đọc đã làm mềm thành "thường" (stand-in) | Cảnh báo | Sửa "mọi" → "thường" |

### So bản chuẩn T5 (Δ, tham khảo; T5 là bản 18 cảnh)
Thời lượng 59,5 vs 44,63 (+14,87) · cảnh 11 vs 18 · TB cảnh 5,41 vs 2,48 s · cắt/10 s 1,68 vs 3,81 · tĩnh 33,3% vs 30,8% · đuôi im 0,682 vs 0,691 s · tốc độ đọc 5,43 vs 3,84 (+41,5%) · lặng 0,455 vs 0,34 · chữ minh hoạ 44,4 vs 79,3 từ/phút · phụ đề phủ 59,1% vs 80,2% · header 91,6% (100% sau opening) · cảnh báo 169 vs 16.

### Ba kết luận
- **KỸ THUẬT: CHƯA ĐẠT.** Đạt: ffprobe (1080x1920, 30 fps, h264/aac, 59,5 s), -14,94 LUFS, qc-video 0 lỗi, R23 0/15 câu cờ biên, phụ đề 56 px dải dưới 21 cue ≤ 2 dòng, phonemes 0 lỗi. Chưa đạt: QC-03, QC-04, QC-01.
- **TUÂN THỦ: ĐẠT CÓ ĐIỀU KIỆN.** Không tên ngân hàng thật, không số liệu gây hoảng loạn (NAPAS ghi "liên ngân hàng", bình quân năm 2025; lời 02 nêu "mình dựng thử"); AI khai ở publish.json (`ai_generated_content: true`, câu khai báo cuối mô tả), không đốt nhãn lên hình; không hình ngoài/AI; `final/` đúng 4 tệp. Cần sửa QC-06.
- **TRẢI NGHIỆM: CHƯA ĐẠT** do QC-01/02. Hình/mạch kể tốt: hook tình huống rõ, mỗi cảnh một ý, kết giải quyết vấn đề mở.

### 5 câu hỏi người xem lạ
1. 3 s đầu: ĐẠT (câu hỏi 0,6 s, "Chưa xác nhận" 1,9 s, tiêu đề 3,4 s).
2. Trước giây 5: ĐẠT một phần (hệ quả ba cổng đỏ + đồng hồ ở 5,0–7,3 s, tiêu đề 3,4 s đã nêu chủ đề).
3. Mỗi cảnh một ý, tắt tiếng: ĐẠT một phần (nocaption-board hiểu S02, S05, S07, S09; S06 ở 33,5 s hai ô trống, nhãn chưa hiện). Bản picture.mp4 thật: CHƯA KIỂM.
4. Hình đổi nhìn ra ở 360×640: ĐẠT; M-06 tĩnh 1,2 s (3,7–4,9 s) là giữ tiêu đề, hợp lệ; 0 chữ lặp lời (M-21 là tiêu đề opening). Bìa 180×320 đọc được (S02 QR/App/ATM/24 giờ) nhưng không có tiêu đề hook: cảnh báo nhỏ.
5. Kết: ĐẠT (S10 trả quầy cơm, S11 mời bình luận; đuôi im 0,682 s ≤ 0,7 s).

### Bảng Y1–Y8
| Nhóm | Kết luận | Bằng chứng |
|---|---|---|
| Y1 | ĐẠT (cảnh báo S02/S05 4 nhóm chữ, M-22/M-23) | Không nhãn "AI tạo"/"Ví dụ dựng" trên hình; nhãn gắn đối tượng, ≤ 6 từ đồng thời |
| Y2 | ĐẠT | Cáo ở S01 (0–3 s), S03, S07, S11; không ở S10 |
| Y3 | ĐẠT cảnh báo nhỏ | 160–180 px đúng thiết kế; S11 chồng thẻ (QC-05) |
| Y4 | ĐẠT | office / database / incident / security; quầy cơm quay lại S10 |
| Y5 | ĐẠT | tình huống mở S01 → hệ quả → cơ chế → xử lý → kết |
| Y6 | CHƯA ĐẠT | QC-01 5,43 âm tiết/s; nghe cảm nhận CHƯA KIỂM |
| Y7 | CHƯA ĐẠT | QC-02 max 3,818 s; đuôi 0,682 s đạt |
| Y8 | ĐẠT văn bản; nghe CHƯA KIỂM | `phonemes.py` mã 0, 15 dòng, 0 lỗi; clip term-check có; cách đọc QR/ATM/NAPAS cần nghe |

D8: (a) R23 0/15 câu cờ; tốc độ vượt dải; (b) opening 5 s ba pha, tiêu đề đạt, M-201 là giữ tiêu đề 4–5 s (hợp lý); (c) header phủ 100% sau opening, 56 px, 0 đè; (d0) 0 cặp chữ giao, khe min 72 px, nhưng nhãn đè icon (QC-03); (d) 90,9% cảnh có chữ thật, 136 từ/phút (kể cả số đếm, M-111), kinetic 0,84/25 s (< 1, M-112); "có tiền" không có chữ (M-113).

### needs_manual_review (CHƯA KIỂM)
Giọng tự nhiên/nuốt chữ, tốc độ cảm nhận, nhịp nghỉ, phát âm (QR/app/ATM/NAPAS), êm tai SFX: CHƯA KIỂM — giám đốc nghe. Sức hút opening, logic mạch kể, thời gian quan sát sơ đồ, chuyển ô header, chuyển động camera (S01/S04 push_in), bản picture.mp4 tắt tiếng: CHƯA KIỂM.

### Phán quyết lượt 1: FAIL — lỗi dựng sửa được → production
Sửa: QC-01, QC-02 (sinh lại giọng theo tốc độ kế hoạch, canh mốc, mix và dựng lại), QC-03, QC-04, QC-05, QC-06; sau sửa chạy lại qc-measure (kỳ vọng ≤ ~4,8 trên giọng gốc, nghỉ dài nhất ≤ 3 s). Lỗi thiết kế: không.

Bài học cho luật: (1) R21 của qc-measure báo hàng chục cảnh báo khi header một dòng không title, nên hỗ trợ cấu hình header một dòng; (2) text_overlap không bắt chữ đè icon/đối tượng.


## Producer · xử lý QC lượt 1

- QC-01/02: `pronounce.mjs check` và `phonemes.py --lines` đều mã 0. Đã chạy lại `prosody.mjs plan`, sinh 15 câu qua `gen_vo.py --plan` theo hệ số script 1,15 (dẫn) và 1,10 (kỹ thuật), 12 cache miss và 3 cache hit. `splice.py check` trả 0 vi phạm trên 15 clip, đệm đầu/cuối 60/140 ms. `prosody.mjs timeline --mode fit` và `assemble.py` đã tạo ứng viên trong assets/voice/qc2-*. Bản giọng thử 55,567 s. Đo WAV qua silencedetect ở −40 dB: khoảng im dài nhất giảm từ 3,286 xuống 2,886 s sau khi rút 0,4 s cửa sổ S05; đã rút thêm 0,3 s đuôi S11. Mốc này mới được thử trên WAV. Dù đã dùng đúng hệ số script, tốc độ theo proxy của prosody_metrics vẫn khoảng 5,86 âm tiết/s, vượt mục tiêu QC khoảng 4,8. Đề nghị Claude chốt giảm hệ số tempo hoặc chọn lại cách sinh giọng, rồi đo lại trước khi canh hình, lập cue sheet và trộn.
- QC-03 và QC-05: đã dời nhãn NAPAS sang phải và rút chiều cao hai thẻ S11 để tách Cáo khỏi thẻ. Đã mở preview-04.jpg và preview-11.jpg ở 360×640, thấy khe giữa các đối tượng. Sửa ở mã dựng trong assets/_scratch/visual.py, chưa xuất vào MP4.
- QC-04: đối chiếu bảng script với storyboard S10 APPROVED. Script và QC yêu cầu nhãn “Chưa xác nhận”, nhưng visual_concept, environment và animation_timeline của storyboard ghi icon đồng hồ cát, không chữ. text_overlay rỗng và semantic_plan.texts rỗng. Đề nghị Visual Director thêm mục chữ gắn điện thoại cùng mốc cục bộ vào storyboard và duyệt lại, hoặc QC chấp nhận phương án icon đã duyệt.
- QC-06: sửa câu Facebook thành “các kênh thường phải hỏi một hệ thống lõi” trong publish.json và mã đóng gói. qc-publish pass, 0 lỗi và 0 cảnh báo.
- (Xem mục "Rescue lần 3" ở cuối tệp để biết hướng dẫn mới.)
- MP4 hiện có là bản QC lượt 1. Chưa mux ứng viên hoặc giao review. needs_manual_review: phát âm, tốc độ cảm nhận, độ tự nhiên của giọng và độ êm SFX **CHƯA KIỂM — giám đốc nghe**. Sức hút opening và logic mạch kể của ứng viên **CHƯA KIỂM**.

## Rescue lần 3 (21/11/2026) — Claude gỡ vướng

**QC-04 (Claude duyệt bổ sung trong rescue, storyboard giữ APPROVED):** `script.md` (S01 và dòng S10 «“Chưa xác nhận” · 51,30–54,55 s · gắn màn hình điện thoại · trả đúng trạng thái hook») gọi tên nhãn này như trạng thái được trả lại ở kết (Y5; D8: thuật ngữ được gọi tên phải hiện nhãn; Y1: chữ có trong kịch bản). Storyboard S10 để icon không chữ là Codex bỏ sót so với script, không phải quyết định thiết kế. Đã sửa `storyboard.json` S10: `text_overlay` = "Chưa xác nhận", `text_groups` = 1, `semantic_plan.texts` thêm label gắn màn hình điện thoại 0,20–3,45 s cục bộ (= 51,30–54,55 s toàn video, fade), `kind_params.states` (t=0,2) `label` = "Chưa xác nhận". Producer: dựng đúng nhãn này và chạy lại Ajv.

**QC-01 (tốc độ):** nguồn chuẩn là `docs/chat-luong-xem.md` D4/Y6: `speech_pace_syll_s` của `qc-measure` (có tiếng, bỏ lặng ≥ 0,12 s) mục tiêu ≈ **4,6–4,8**, báo trên số giọng gốc; `atempo` chỉ là phương tiện; tài liệu ghi rõ giọng Hải Đăng đọc nhanh nên phải hạ về ≈ 0,90–0,95. Lượt trước dùng 1,15/1,10 (hệ số giọng T8) nên ra 5,43. "Proxy 5,86" của `prosody_metrics` là thước khác, KHÔNG dùng làm tiêu chí; chỉ `qc-measure` (`speech_pace_voice_syll_s`) là thước. Tỉ lệ cần 4,7/5,43 = 0,87. Đã sửa dòng tốc độ trong `script.md` (không sửa 15 ô bảng cũ; dòng ghi đè nói rõ).
Chỉ định cho Producer:
1. Sinh lại 15 câu bằng `gen_vo.py --plan` với atempo **[dẫn] = 1,00, [kỹ thuật] = 0,95** (dải 0,85–1,20). `splice.py check` phải 0 vi phạm biên (đệm 60/140 ms).
2. Đo bằng `qc-measure`, chấp nhận **4,5–4,9** trên giọng gốc. Nếu > 4,9: chỉnh một lần, hạ 0,05 cả hai nhóm (0,95/0,90); nếu < 4,5 thì tăng 0,05. Tối đa 2 vòng chỉnh, sau đó giữ kết quả gần dải nhất, ghi số đo, không lặp thêm. Đổi tempo cả bản, không tăng tốc riêng chỗ nào.
3. Thời lượng dự kiến ≈ 64–67 s (có tiếng 32,4 s → ≈ 37,5 s), trong 45–75 s; nếu > 70 s thì rút khoảng giữ, không tăng tốc. Lập lại timeline `fit` và canh lại mốc cảnh, nhãn, cue theo clip mới, không dùng mốc cũ.

**QC-02 (nghỉ dài):** nghỉ có chủ đích giữa hai câu ≤ 3,0 s và phải có sự kiện hình. Tỉ lệ lặng 45,5% chủ yếu do giọng nhanh nên cửa sổ cảnh (lập theo kế hoạch chậm) dư khoảng trống; hạ tempo sẽ tự kéo lặng xuống. Sau khi sinh lại: (a) cửa sổ cảnh = câu thực + `hold_after_voice_s` của storyboard (S10 1,13 s), không thêm đệm; (b) S05→S06 giữ ≤ 2,0 s cho quan sát sơ đồ (nay 3,8 s), nếu vẫn > 3,0 s thì cắt hold đầu S06; (c) các khoảng lặng 2–2,5 s còn lại (7,16–9,63, 18,88–21,5, 34,73–36,32, 40,17–41,8, 44,8–46,9, 49,75–51,9 theo bản cũ) chỉ chấp nhận khi là hold sau lời theo storyboard và có sự kiện hình; khoảng > 2,5 s không có sự kiện thì rút cửa sổ. Đích: lặng dài nhất ≤ 3,0 s, tỉ lệ lặng ≤ ~35%, đuôi im ≤ 0,7 s.

**Còn lại cho lượt produce:** QC-03, QC-05, QC-06 đã sửa trong `_scratch/visual.py` và `publish.json`, cần xuất vào MP4 mới; dựng lại, mix, `qc-measure --baseline docs/baseline/T5-qc-auto.json`; `pronounce.mjs check` + `phonemes.py` mã 0. Phần nghe vẫn CHƯA KIỂM — giám đốc nghe.


## Producer · bản dựng sau Rescue lần 3

- QC-01: sinh lại 15 câu bằng `gen_vo.py --plan`. Lượt 1,00/0,95 đo trên WAV ráp khoảng 5,10 âm tiết/s theo cùng ngưỡng lặng, nên áp dụng một vòng chỉnh xuống 0,95/0,90 cho dẫn/kỹ thuật. Bản cuối `qc-measure` đo 4,711 âm tiết/s trên stem giọng và 4,645 trên MP4. Timeline fit không ép tăng tempo. `splice.py check` trả 0 lỗi trên 15 cửa sổ ở WAV ráp, đệm 60/140 ms. Trên stem đã xử lý, QC gắn cờ bước nhảy 33,16 dB ở đầu lời 09, S06, dưới ngưỡng lỗi kỹ thuật theo tỷ lệ câu (1/15). Chờ giám đốc nghe đầu câu này.
- QC-02: bản cuối khoảng lặng dài nhất 2,573 s, đuôi 0,663 s, tỷ lệ lặng 35,74%. Khoảng dài nhất đi cùng pha lộ tiêu đề rồi sang ba cổng. S05→S06 khoảng 2,21 s tính cả đầu cảnh sau, phần giữ riêng S05 khoảng 2,09 s với gói dữ liệu còn chạy. Opening 5,10 s gồm ba pha đã duyệt, lời vào 0,60 s. Giữ tiêu đề qua giây 4–5 để người xem đọc, vì vậy phép đo thay đổi hình gắn cờ ở đoạn này.
- QC-03/04/05: đã xuất hình mới với khe giữa NAPAS 2025 và icon S04, nhãn “Chưa xác nhận” trên điện thoại S10, Cáo tách mép thẻ ở S11. Ajv xác thực storyboard thành công. Khôi phục dáng present_hand của S03 từ brand/cao theo bản đồ đã duyệt. Dùng lại nền office/database/incident/security từ tools/backgrounds, danh sách ảnh Gemini đã duyệt rỗng.
- QC-06: Facebook dùng “các kênh thường phải hỏi một hệ thống lõi”. `qc-publish` đạt, 0 lỗi và 0 cảnh báo. Thư mục final có MP4, thumbnail.jpg, captions.srt và publish.json.
- Âm thanh: cue sheet dùng mốc cảnh mới, co mốc cue theo cùng tỷ lệ với hoạt cảnh và giữ mốc cục bộ S01/S10. Lưu bốn stem và mix-report.json trong assets/audio. Nhạc tắt. PCM mix −14,26 LUFS, −1,76 dBTP, 0 mẫu clip. Giảm 0,95 dB khi mã hóa AAC để bù đỉnh tái tạo. MP4 đo −15,21 LUFS, −1,60 dBTP.
- `ffprobe` đo 58,133333 s, H.264 yuv420p 1080×1920 30 fps, AAC mono 48 kHz. `qc-video` chạy với --min 45 --max 75 và assets/scenes.json, đạt, 0 lỗi. Bốn cảnh ít chuyển động ở trung vị có sự kiện hình rời: S06 mở hai ô so sánh, S08 dòng khớp và thông báo, S09 đường chung đứt, S10 con trỏ chuyển từ Gửi sang lịch sử. Các đoạn giữ dùng để đọc sơ đồ hoặc nhận ra trạng thái.
- `qc-measure --baseline docs/baseline/T5-qc-auto.json` đo Audio / Visual / Narrative, 0 lỗi và 158 cảnh báo. Xem assets/_scratch/qc-rescue/report.md. Các nhóm còn cờ gồm header một dòng bị kiểm như mẫu hai dòng (phủ 100% sau opening, 0 cặp chồng), nhóm nhãn ở S02/S05 theo storyboard, 1 biên câu, và liên kết cue với sự kiện hình chưa đủ ID để QC tự xác nhận. Công cụ đo onset cho 10 cue nhưng thiếu mốc hình liên kết. Hai hiệu ứng kinetic tương đương 0,86/25 s; giữ thiết kế duyệt. S09 ngắn hơn ngưỡng thử 5 s khoảng 0,13 s theo cửa sổ câu thực và thời gian giữ đã duyệt.
- Y1: kiểm khung MP4 360×640 ở opening, sơ đồ, quầy cơm và kết. Tiếng Việt đủ dấu ở các khung đã kiểm, phụ đề tách lớp 56 px, tối đa hai dòng và 28 ký tự mỗi dòng. Y2–Y3: Cáo ở S01/S03/S07/S11, khung cuối không chạm thẻ. Y4: bối cảnh đổi theo thiết kế. Y5: S10 trả lại quầy cơm và trạng thái chờ của hook; S11 mời bình luận. Y6–Y7: số đo ở trên. Y8: pronounce check không có mục lạ; phonemes 15 dòng, mã 0. Bảng nghe kiểm và clip QR, app, ATM, NAPAS ở mục Producer trước và assets/voice/term-check. Bìa S02 tại 8,3 s đã mở ở 180×320.
- needs_manual_review: độ tự nhiên của giọng, tốc độ cảm nhận, nhấn nghỉ, phát âm, đầu lời 09 và độ êm SFX **CHƯA KIỂM — giám đốc nghe**. Sức hút opening, logic mạch kể, đồng bộ theo từng từ và chuyển động cảm nhận **CHƯA KIỂM**.


## QC — 21/11/2026 — lượt 2

Đo: `node tools/qc-measure.mjs ep01 --baseline docs/baseline/T5-qc-auto.json --frames "0.5,3,8,20,32,40,52,56"` (standard): 188 phát hiện · 158 cảnh báo · 0 lỗi (qc-video 0 lỗi, qc-publish 0 lỗi). Gemini xem trước: Gemini vắng (lệnh `gemini-run.mjs look` bị chặn quyền trong phiên nền, không chờ), QC như thường. Đã xem 9 ảnh: board-01, board-02, board-04, frame-56 (full-res), thumb-180x320, voice-edges (và khung board S01/S04/S10/S11); header-zones/nocaption-board/textheavy chưa mở lại, đối chiếu qua board. `final/` đúng 4 tệp (mp4, captions.srt, publish.json, thumbnail.jpg). Sổ nguồn: không hình ngoài/AI, không cần dòng LICENSES.

### Số đo chính
ffprobe 1080x1920, 30 fps, h264/yuv420p + aac mono 48 kHz, 58,133 s (45–75 s đạt). Mix -14,26 LUFS / -1,76 dBTP, 0 mẫu clip; MP4 -15,21 LUFS, -1,60 dBTP. Tốc độ đọc 4,711 âm tiết/s trên WAV giọng gốc (đạt dải 4,6–4,8 và 4,5–4,9 của rescue), 4,645 trên MP4. Lặng dài nhất 2,573 s (2,679–5,252 s, ≤ 3,0), tỉ lệ lặng 35,74% (rescue ≤ ~35%, vượt 0,74 điểm: cảnh báo nhẹ), đuôi im 0,663 s (≤ 0,7). R23 1/15 câu cờ (6,67% < 10%). Header phủ 100% sau opening, 56 px, 0 đè; 0 cặp chữ giao, khe chữ nhỏ nhất 72 px. Phụ đề 56 px dải dưới, 21 cue ≤ 2 dòng. phonemes 15 dòng 0 lỗi.

### Trạng thái QC-01..06 (kiểm trong MP4 mới)
| Mã | Kết quả | Bằng chứng |
|---|---|---|
| QC-01 tốc độ | ĐÃ SỬA | 4,711 (voice) / 4,645 (MP4) so với 5,43 lượt 1; trong dải D4 4,6–4,8. Cảm nhận khi nghe: CHƯA KIỂM |
| QC-02 nghỉ | ĐÃ SỬA (còn cảnh báo) | Lặng dài nhất 3,818 → 2,573 s; ba khoảng ≥ 2 s: 2,573 (opening giữ tiêu đề), 2,039 (7,62–9,659 S02→S03), 2,213 (27,013–29,226 S05→S06, lệch kế hoạch 1,76 s: M-123/M-134, S05 giữ 2,087 s, gói dữ liệu còn chạy, board-02 ô 28 s). Tỉ lệ lặng 35,74% sát ngưỡng |
| QC-03 NAPAS/icon | ĐÃ SỬA | board-02 ô 16/18/20 s: nhãn "NAPAS 2025" bên phải ba icon, khe ≈ 24 px ở 360 (≈ 72 px ở 1080); render-log khe nhỏ nhất 72 px, 0 cặp giao |
| QC-04 nhãn S10 | ĐÃ SỬA | Nhãn "Chưa xác nhận" gắn điện thoại S10, xuất hiện 49,9 s (render-log), thấy ở board-04 ô 50/52 s |
| QC-05 Cáo S11 | ĐÃ SỬA | frame-56.png full-res: Cáo (y≈1020–1290) nằm dưới hai thẻ "Bấm lại/Lịch sử" (thẻ hết y≈990), không chạm |
| QC-06 publish | ĐÃ SỬA | publish.json dòng 25 "các kênh thường phải hỏi"; qc-publish 0 lỗi |

### Phân loại 158 cảnh báo (tự kiểm)
- M-24..M-99 (76 R21 "header thiếu chữ trong bbox") + M-100..M-105 (6 lần đổi ô 0 s cùng hiện): header một dòng "BANKING / HỆ THỐNG LÕI" có mặt ở mọi board S02–S11, không đè Cáo/vật/phụ đề; phép đo đòi mẫu hai dòng. LOẠI TRỪ (như lượt 1). Chuyển ô trượt: CHƯA KIỂM.
- M-152..M-183 (32 "nhãn hiện ngắn" = số đếm 0→31 triệu S04): không phải nhãn thật, LOẠI TRỪ.
- M-01..M-04 (R4 S06/S08/S09/S10 ít chuyển động): có sự kiện hình rời (hai ô so sánh, dòng khớp, đường chung đứt, con trỏ). Chấp nhận; chuyển động cảm nhận CHƯA KIỂM.
- M-135..M-145 (cue "không gắn hình"; onset lệch ≤ 0,065 s, M-137 c003 lệch hơn dung sai): thiếu ID liên kết, không phải lỗi dựng; êm tai CHƯA KIỂM.
- M-146..M-151 (bbox chạm mép S01/S05/S10): chưa thấy chữ tràn ở board; bbox CHƯA KIỂM.
- M-115..M-134 (nghỉ lệch kế hoạch 0,17–0,22 s; riêng M-123 1,76 s): lệch nhỏ do cửa sổ cảnh = lời thực; M-123 xem dòng QC-02.
- M-19 (S09 4,867 s < 5 s, medium, giữ sau lời 1,216 s): thiếu 0,13 s, chấp nhận. M-21/M-22 (S02/S05 4 nhóm chữ, nhãn gắn đối tượng): chấp nhận.
- M-106 (142 từ/phút, ngoài 20–45, do số đếm và nhãn ngắn; similarity 0 trừ M-20 là tiêu đề), M-107 (kinetic 0,86/25 s < 1), M-108 (keyword "có tiền" không chữ, S01 dùng hình): cảnh báo thiết kế nhẹ, giám đốc quyết.
- M-110..M-112 (nhãn cách đích 42–69 px, ngưỡng 40): đọc được ở board; chấp nhận.
- M-113/M-114 (R23): 1/15 câu cờ; đầu lời 09 tại 31,742 s bước nhảy 33,16 dB. voice-edges.png: đường bao đi từ -120 dBFS lên ≈ -50 dB trong ≈ 25 ms rồi lên ≈ -35 dB, tăng dần, không vách đứng; nghe CHƯA KIỂM — giám đốc nghe.
- M-187 split_compare liên tiếp S06–S09: thiết kế duyệt, cảnh báo.
- M-188 (opening thiếu đổi hình 4–5 s): giữ thẻ tiêu đề để đọc (công cụ ghi "Opening riêng đạt D8: Có lỗi"); hợp lệ có chủ đích, giám đốc xem.

### Bảng lỗi lượt 2
Không có lỗi dựng cần sửa, không có lỗi thiết kế mới. Cảnh báo cho giám đốc: tỉ lệ lặng 35,74% (vượt mốc rescue ~35% 0,74 điểm); nghỉ S05→S06 2,2 s lệch kế hoạch 1,76 s (≤ 3,0 s và có sự kiện hình); bìa 180×320 là khung S02, đọc được nhưng không có tiêu đề hook.

### Ba kết luận
- **KỸ THUẬT: ĐẠT (máy đo).** 0 lỗi qc-video, qc-publish, qc-measure; 58,13 s, LUFS/dBTP, tốc độ 4,711, đuôi 0,663 s; QC-03/04/05 xác nhận bằng mắt. Phần nghe CHƯA KIỂM.
- **TUÂN THỦ: ĐẠT.** Không hình ngoài/AI, không nhãn AI trên hình, AI khai ở publish.json, publish đủ 3 nền tảng (qc-publish 0 lỗi), captions.srt + thumbnail.jpg có, `final/` đúng 4 tệp.
- **TRẢI NGHIỆM: ĐẠT phần đo/xem; CHƯA KIỂM phần nghe.** Hook tình huống, mỗi cảnh một ý, kết giải quyết vấn đề; tốc độ, nghỉ, đuôi trong ngưỡng.

### 5 câu hỏi người xem lạ
1. 3 s đầu: ĐẠT (câu hỏi 0,6 s, "Chưa xác nhận" 1,9 s, tiêu đề 3,4 s).
2. Trước 5 s: ĐẠT (tiêu đề 3,4 s; hệ quả ba cổng đỏ + đồng hồ từ 5,1 s, sát mốc).
3. Mỗi cảnh một ý, tắt tiếng: ĐẠT một phần theo board; picture.mp4 tắt tiếng CHƯA KIỂM.
4. Hình đổi ở 360×640: ĐẠT; tĩnh dài nhất 1,2 s (3,7–4,9 s giữ tiêu đề); chữ lặp lời 0.
5. Kết: ĐẠT (S10 trả "Chưa xác nhận" + quầy cơm, S11 mời bình luận, đuôi 0,663 s); bìa đọc được ở 180×320.

### Bảng Y1–Y8
| Nhóm | Kết luận | Bằng chứng |
|---|---|---|
| Y1 | ĐẠT | Không nhãn "AI tạo"/"Ví dụ dựng"; M-21/M-22 cảnh báo nhỏ |
| Y2 | ĐẠT | Cáo ở S01, S03, S07, S11 |
| Y3 | ĐẠT | S11 Cáo tách thẻ (frame-56) |
| Y4 | ĐẠT | office/database/incident/security; quầy cơm quay lại S10 |
| Y5 | ĐẠT | tình huống mở → hệ quả → cơ chế → xử lý → kết |
| Y6 | ĐẠT theo số đo; nghe CHƯA KIỂM | 4,711 âm tiết/s |
| Y7 | ĐẠT theo số đo; nghe CHƯA KIỂM | max 2,573 s; đuôi 0,663 s; lặng 35,74% sát ngưỡng |
| Y8 | ĐẠT văn bản; nghe CHƯA KIỂM | phonemes 15 dòng, 0 lỗi; cách đọc QR/ATM/NAPAS cần nghe |

### D8 (R20–R23)
(a) R23 1/15 (6,67% < 10%), tốc độ 4,711 voice, tai nghe CHƯA KIỂM; (b) opening 5,1 s ba pha, lời 0,6 s, tiêu đề 3,4 s, giữ qua 5 s (M-188 hợp lệ); (c) header 100% sau opening, 56 px, 0 đè; chuyển ô CHƯA KIỂM; (d0) 0 cặp giao, khe min 72 px; (d) 100% cảnh có chữ thật, 142 từ/phút, kinetic 0,86/25 s, "có tiền" thay bằng hình: cảnh báo thiết kế, giám đốc quyết.

### needs_manual_review (CHƯA KIỂM — giám đốc nghe/xem)
Giọng tự nhiên/nuốt chữ (kể cả đầu lời 09 tại 31,74 s), tốc độ cảm nhận, nhịp nghỉ (2,57/2,21/2,04 s), phát âm QR/app/ATM/NAPAS, nhấn ý, êm tai SFX, sức hút opening (thẻ tiêu đề 3,4–5,1 s), chuyển ô header, chuyển động camera S01/S04, picture.mp4 tắt tiếng, logic mạch kể.

### Phán quyết lượt 2: kỹ thuật/tuân thủ đạt; giữ `review`, chờ giám đốc nghe/xem rồi duyệt ready (`QC-CHỜ-NGHE`). Không lỗi dựng, không lỗi thiết kế.
Bài học cho luật: qc-measure nên coi header một dòng là hợp lệ (R21 vẫn báo 82 cảnh báo giả) và không coi số đếm S04 là nhãn.
