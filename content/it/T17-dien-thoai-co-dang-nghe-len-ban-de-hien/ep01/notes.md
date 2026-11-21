# IT-T17-E01 — ghi chú

- Storyboard: Claude làm thay Codex theo duyệt của giám đốc (21/11/2026), lý do Codex lỗi sandbox chỉ-đọc, không ghi được file (xem `review/codex-storyboard-r1.prompt.md.reply.md`). `visual-director` (agent khác tác giả) duyệt vòng 1: DUYỆT SAU KHI CLAUDE SỬA NHỎ (`review/storyboard-r1.md`).
- Chưa chạy kiểm schema bằng công cụ (`studio/test/storyboard-schema.test.mjs`) sau các sửa nhỏ của vòng review: việc nền không có quyền chạy lệnh đó. Bản nháp trước sửa đã báo `SCHEMA OK`; các sửa sau đó chỉ được đối chiếu bằng mắt. Producer/QC nên chạy validator trước khi dựng.
- Lệch nhỏ: bảng cảnh trong `script.md` vẫn ghi S06 = 8,00 s, S07 = 5,00 s; storyboard là 8,25 s / 4,75 s (tổng 67,6 s không đổi). Storyboard là chuẩn dựng.
- Bước 4b: không cần ảnh Gemini sinh (`assets/gen/approved.json`, `images: []`).

## Producer — bản giao review

- Bản dựng dùng storyboard APPROVED và Pillow + FFmpeg. Ajv xác thực trực tiếp storyboard trả SCHEMA OK. Bộ test schema đạt 29/29. Opening gộp S01–S02 dài 6,90 s. Header bắt đầu ở S03 và trượt 0,38 s giữa các ô theo review đã duyệt. Header là lớp riêng trên nền chuyển cảnh. S06/S07 dài 8,25/4,75 s theo storyboard; trạng thái hoàn chỉnh của S07 giữ khoảng 1,54 s theo WAV thực.
- Đồ hoạ điện thoại, bảng tin, giày, micro, lưới Android, slide và nền phẳng do Producer dựng bằng Pillow và thư viện motion của xưởng. Danh sách ảnh Gemini duyệt rỗng. Cáo dùng đúng pose có sẵn trong brand/cao/poses, đặt trực tiếp trên khung Pillow để ghép các hành động vào/ra và giữ Cáo ngoài crop của opening. Các chuyển động đồ hoạ được giản lược ở cấp đạo cụ, gồm slide S09 trượt và nảy trên mặt chiếu, và tiêu đề S01 cắt sang tấm riêng. Các cảnh vẫn giữ loại, bối cảnh và chuỗi hành động chính theo storyboard.
- Giữ nguyên 19 lời. Bộ dò từ điển bắt nhầm “Ai” ở L17 thành “AI”; spec TTS riêng giữ đúng “Ai”. Từ điển riêng dùng chính tả gốc của micro, clip, Android. Kiểm âm vị đạt, R23 đo 19 cửa sổ sau ghép với 0 biên vi phạm. Thực hiện đọc từng câu với VieNeu-TTS v3 Turbo, giọng Bắc Hải Đăng. Sau bản thử hạ hệ số atempo TTS 8% và căn nghỉ theo mốc hình. Khi ráp nghe kiểm kỹ thuật không tăng tempo để lấp thời lượng.
- Nhạc nền tắt. Cue sheet tại assets/sound-cues.json và .md. Bốn stem và mix-report.json trong assets/audio. Dùng SFX tự tổng hợp CC0 của xưởng. Khi mux giảm 0,65 dB để chừa biên cho AAC. Nhịp nghỉ giữa cảnh có hình giữ hoặc đổi trạng thái (tấm tiêu đề, đường chấm tới quảng cáo, ngăn còn dấu vết, hồ sơ đầy, hộp bằng chứng trống, menu đóng).
- Tệp giao gồm IT-T17-E01_9x16.mp4, thumbnail.jpg, captions.srt và publish.json. Thumbnail lấy ở 4,95 s trên hình chưa đốt phụ đề, đã mở ở 180×320. Mở các khung thành phẩm 360×640 ở opening, giữa và cuối. Đối chiếu hình quanh các chuyển cảnh, kiểm lại các nhịp trượt header sau sửa. Phụ đề ASS 56 px, tối đa hai dòng và 28 ký tự/dòng. Giữ bản hình chưa đốt phụ đề trong assets/_scratch/picture.mp4.
- Y1 dùng chữ đã duyệt; tên mục S10 trùng lời vì là nhãn giao diện đã được duyệt. Y2/Y3 Cáo vào ở opening, S06, S11, các nhịp giữa/kết rộng 160–180 px. Y4 đổi giữa năm bối cảnh. Y5 quay lại bàn ăn và quảng cáo giày với ba dấu hỏi. Y6 tốc độ WAV đo được 4,49 âm tiết/s (xấp xỉ theo đếm chữ/số, dưới ngưỡng thử 4,6–4,8). Y7 đuôi im đã chỉnh còn khoảng 0,63 s và có hình giữ ở đoạn kết. Y8 đã kiểm từ điển và âm vị, phát âm thật chờ nghe.
- S06 và S08 có trung vị hoạt động 0 khối do các nhịp giữ hồ sơ và lưới thử. Các chuyển động theo nội dung vẫn gồm chấm bay, con trỏ, sóng lấp lưới và vạch quét. Chỉ báo này cần xem cùng đoạn giữ và không có đoạn tĩnh trên 2 s theo mẫu 10 Hz. Cờ đổi ô header kiểm hai ô cùng hiện; bản dựng chỉ có một ô trượt để tránh chữ chồng. S07 4,75 s theo bản duyệt, thấp hơn mốc thử 5 s của cảnh medium. S08 đếm tới nhãn 17.000+; công cụ đối chiếu chưa khớp mốc ổn định của số với mốc bắt đầu đếm. Mốc cue ở S08/S09 còn cờ onset và cần người duyệt đối chiếu hiệu ứng. Báo cáo Visual còn thiếu bằng chứng tự động về bbox mục tiêu sau zoom và archetype bố cục.

### Nghe kiểm thuật ngữ

| Thuật ngữ | Chữ đưa TTS | Âm vị | Clip | Nguồn |
|---|---|---|---|---|
| micro | micro | mˈaɪkɹoʊ | assets/voice/term-check/micro.wav | riêng |
| clip | clip | klˈɪp | assets/voice/term-check/clip.wav | riêng |
| Android | Android | ˈændɹɔɪd | assets/voice/term-check/android.wav | riêng |

### needs_manual_review

- **Audio — CHƯA KIỂM — giám đốc nghe.** Kiểm phát âm, độ tự nhiên, tốc độ cảm nhận, ngữ điệu, khoảng nghỉ, độ êm và tương quan SFX/impact với giọng.
- **Visual — CHƯA KIỂM.** Người duyệt đối chiếu nhãn đúng từ được nhắc, vùng an toàn khi camera đẩy và khả năng theo dõi ở tốc độ phát thật.
- **Narrative — CHƯA KIỂM.** Người duyệt xem sức hút của ba pha opening, logic các bước giải thích, chuyển ý và câu chốt.

### Kết quả máy
- qc-video PASS, 67.6 s, h264 1080x1920 yuv420p, 30 fps, aac 48000Hz, -14.82 LUFS-I, -1.84 dBTP, đoạn tĩnh dài nhất 1.5 s.
- qc-publish PASS, 0 lỗi, 0 cảnh báo.
- qc-measure standard, 0 lỗi, 34 cảnh báo, opening = True, phủ header sau opening 100%, đoạn cắt trong khi có tiếng 0, final_pass_allowed = False.
- Báo cáo đầy đủ và khung bằng chứng của bản giao trong assets/_scratch/qc-auto/. Kết quả kỹ thuật JSON tại assets/_scratch/qc-video.json.

#### Cảnh báo của bản giao

- M-01 · Cảnh S06 (22,7–30,95 s) ít chuyển động: trung vị 0 khối hoạt động, hiệu cục bộ 1,85
- M-02 · Cảnh S08 (35,7–45,7 s) ít chuyển động: trung vị 0 khối hoạt động, hiệu cục bộ 0,85
- M-21 · Tốc độ đọc trên WAV giọng gốc 4,49 âm tiết/s (186 cụm chữ hoặc số trong apply.json / 41,427 s có tiếng), ngưỡng thử 4,6–4,8 âm tiết/s.
- M-22 · Cảnh S07 (medium) dài 4,75 s, dưới ngưỡng thử 5 s.
- M-23 · Cảnh S10 có chữ lặp nguyên văn lời thoại «TÙY CHỌN QUẢNG CÁO». Dòng lời gần nhất (Lời 16 · 54,35 s) «Mở phần tùy chọn quảng cáo, xem mình bị gán sở thích gì.», similarity 1 (ngưỡng thử 0,6).
- M-25 · Đổi ô top_left → top_right có 0 s cùng hiện giữa hai ô. Kiểm đoạn chuyển 0,3–0,5 s tại ranh giới cảnh. Nhật ký chưa cho biết độ mờ khi chỉ một ô hiện.
- M-26 · Đổi ô top_right → top_left có 0 s cùng hiện giữa hai ô. Kiểm đoạn chuyển 0,3–0,5 s tại ranh giới cảnh. Nhật ký chưa cho biết độ mờ khi chỉ một ô hiện.
- M-27 · Đổi ô top_left → top_right có 0 s cùng hiện giữa hai ô. Kiểm đoạn chuyển 0,3–0,5 s tại ranh giới cảnh. Nhật ký chưa cho biết độ mờ khi chỉ một ô hiện.
- M-28 · Đổi ô top_right → top_left có 0 s cùng hiện giữa hai ô. Kiểm đoạn chuyển 0,3–0,5 s tại ranh giới cảnh. Nhật ký chưa cho biết độ mờ khi chỉ một ô hiện.
- M-29 · Đổi ô top_left → top_right có 0 s cùng hiện giữa hai ô. Kiểm đoạn chuyển 0,3–0,5 s tại ranh giới cảnh. Nhật ký chưa cho biết độ mờ khi chỉ một ô hiện.
- M-30 · Đổi ô top_right → top_left có 0 s cùng hiện giữa hai ô. Kiểm đoạn chuyển 0,3–0,5 s tại ranh giới cảnh. Nhật ký chưa cho biết độ mờ khi chỉ một ô hiện.
- M-31 · Đổi ô top_left → top_right có 0 s cùng hiện giữa hai ô. Kiểm đoạn chuyển 0,3–0,5 s tại ranh giới cảnh. Nhật ký chưa cho biết độ mờ khi chỉ một ô hiện.
- M-32 · Chữ «TÙY CHỌN QUẢNG CÁO» giống lời «Mở phần tùy chọn quảng cáo, xem mình bị gán sở thích gì.» 100%.
- M-35 · Khoảng nghỉ lệch kế hoạch 0.76 s.
- M-38 · Khoảng nghỉ lệch kế hoạch 0.67 s.
- M-40 · Khoảng nghỉ lệch kế hoạch 0.72 s.
- M-43 · Khoảng nghỉ lệch kế hoạch 1.13 s.
- M-45 · Khoảng nghỉ lệch kế hoạch -0.18 s.
- M-47 · Khoảng nghỉ lệch kế hoạch 0.41 s.
- M-49 · Khoảng nghỉ lệch kế hoạch 0.26 s.
- M-52 · Khoảng nghỉ lệch kế hoạch 0.28 s.
- M-55 · Khoảng nghỉ lệch kế hoạch 0.53 s.
- M-57 · Khoảng nghỉ lệch kế hoạch 0.53 s.
- M-61 · Khoảng lặng dài ngoài kế hoạch.
- M-62 · Khoảng lặng dài ngoài kế hoạch.
- M-63 · Khoảng lặng dài ngoài kế hoạch.
- M-64 · Khoảng lặng dài ngoài kế hoạch.
- M-65 · Khoảng lặng dài ngoài kế hoạch.
- M-66 · Khoảng lặng dài ngoài kế hoạch.
- M-67 · Onset stem lệch cue c008 hơn dung sai hoặc thiếu tín hiệu gần cue.
- M-68 · Cue c009 có tiếng không gắn hình.
- M-69 · Onset stem lệch cue c010 hơn dung sai hoặc thiếu tín hiệu gần cue.
- M-70 · BBox chạm mép hoặc nằm ngoài vùng an toàn.
- M-71 · Nhãn “NGHE LÉN?” hiện ngắn hơn 0.79 s.

## QC — lượt 1 (Claude, 21/11/2026)

Gemini xem trước: không chạy (tuỳ chọn; ghi "Gemini vắng"). Claude tự mở khung: board-01/03/04, thumb-180x320, header-zones, frame-5/55/66, frame-qc-M-124, frame-open-*; đối chiếu script.md, storyboard APPROVED, publish.json, approved.json (images rỗng; không ảnh Gemini; đồ hoạ Pillow + Cáo brand + SFX CC0 xưởng, không hình ngoài). `final/` chỉ có 4 tệp chuẩn, không cần dọn.

### Số đo độc lập (`qc-measure`, standard, baseline T5; số của QC)
67,6 s · 1080×1920 · 30 fps · -14,82 LUFS · 0 lỗi / 34 cảnh báo · opening 6,9 s đạt D8 · header sau opening 100% · R23 0/19 câu cờ · 0 cặp chữ giao bbox · 100% cảnh có chữ vẽ thật · 28,4 từ/phút · kinetic 1,48/25 s · đuôi im 0,631 s · tốc độ 4,49 âm tiết/s giọng gốc (dưới dải thử 4,6–4,8) · cue đạt hai mốc 8/11.

### Kết luận ba trục
- **KỸ THUẬT: ĐẠT.** Thông số chuẩn, loudness ổn, đuôi 0,63 s ≤ 0,7 s, cắt trong lúc có tiếng 0, lệch lời–hình ≤ 0,08 s. Cảnh báo còn lại là đèn, không phải lỗi dựng.
- **TUÂN THỦ: ĐẠT.** publish.json có ai_generated_content=true + câu khai báo ở 3 nền tảng; không đốt nhãn AI lên hình (khung 1, 3, 5, 55, 66). Không khẳng định tuyệt đối "có/không nghe lén" (L04 "Chưa có bằng chứng", L13 giới hạn Android 2018); không gắn hãng vào cáo buộc (slide 2024 chỉ "bản chào bán"). "Ví dụ dựng" nằm ở mô tả đăng, không ở hình/lời hook (QC-09). Mục [CẦN KIỂM NGUỒN] (tên mục "Tùy chọn quảng cáo", Meta Pixel) còn cho giám đốc.
- **TRẢI NGHIỆM: hình/bố cục ĐẠT; phần nghe CHƯA KIỂM — giám đốc nghe.**

### 5 câu hỏi người xem lạ
1. Đạt: 0–3 s có tiêu đề "ĐÔI GIÀY CHƯA TỪNG TÌM", Cáo giật mình, quảng cáo giày (frame-open-*, frame-5).
2. Đạt: 3,0 s "Mình chưa tìm nó", 4,3 s "Điện thoại nghe lén à?" + nhãn NGHE LÉN? + micro đỏ (frame-5.png).
3. Đạt (nocaption-board): S08 lưới micro tắt, S09 slide + hộp trống hiểu được khi tắt tiếng.
4. Đạt, có lưu ý: cảnh đổi rõ ở 360×640; tĩnh dài nhất 1,5 s (46,4–47,9 s, S09) có giữ-sau-lời; S06/S08 trung vị 0 khối nhưng có chấm/vạch quét; chữ không chép lời trừ S10 (QC-03).
5. Đạt: S11 quay lại bàn ăn/điện thoại, ba nhánh "?" + "Bạn từng gặp cú trùng nào?"; đuôi 0,63 s; bìa 180×320 đọc được "NGHE LÉN?" (thumb-180x320.png).

### Bảng Y1–Y8
| Nhóm | Kết luận | Bằng chứng |
|---|---|---|
| Y1 chữ theo kịch bản | Đạt | Chỉ nhãn/số liệu/chữ chốt; không nhãn AI/"Ví dụ dựng" trên hình; S10 xem QC-03 |
| Y2 số cảnh có Cáo | Đạt | Cáo ở S01, S06, S11 (3/10 cảnh) |
| Y3 cỡ Cáo | Đạt | S01 lớn, S11 ≈ 180 px (frame-66.png) |
| Y4 nền theo ngữ cảnh | Đạt | 5 bối cảnh: bàn ăn, màn hình điện thoại, nền dữ liệu, bàn nghiên cứu, phòng họp |
| Y5 mạch kể | Đạt | Tình huống mở S01–S02 → trả lời S03 → kết quay bàn ăn S11 |
| Y6 tốc độ | CHƯA KIỂM — giám đốc nghe | 4,49 âm tiết/s (M-21) |
| Y7 nhịp nghỉ | CHƯA KIỂM — giám đốc nghe | 25 khoảng nghỉ, max 2,43 s (57,0–59,5 s, giữ hình S10); đuôi 0,631 s; vài nghỉ lệch kế hoạch tới +1,13 s |
| Y8 phát âm | CHƯA KIỂM — giám đốc nghe | Bảng âm vị micro/clip/Android có; chưa nghe |

### Bảng phát hiện QC
| Mã | Nhóm | Mốc | Bằng chứng | Mức | Đề nghị |
|---|---|---|---|---|---|
| QC-01 | TRẢI NGHIỆM/Y7 (M-36/39/41/44/46/48/56/58, M-62..67) | 5,29–7,06; 12,39–14,05; 21,13–22,85; 28,89–31,11; 52,83–54,36; 57,03–59,46 s | Lặng 1,5–2,4 s, lệch kế hoạch 0,53–1,13 s; hình có giữ/đổi trạng thái (frame-qc-M-*) | cảnh báo, đối chiếu: không đứng im | Giám đốc nghe xem có hụt hơi |
| QC-02 | TRẢI NGHIỆM/Y6 (M-21) | cả video | 4,49 < 4,6 âm tiết/s | cảnh báo, CHƯA KIỂM | Nghe; không tăng tempo chỉ để đạt số |
| QC-03 | TUÂN THỦ/R22 (M-24, M-33) | S10 54,97–58,4 s | Nhãn = lời 100%; khung 55 s nhãn mờ đè hàng menu, menu che một phần thẻ giày (frame-55.png) | cảnh báo, chấp nhận (nhãn giao diện đã duyệt, mờ chỉ lúc vào cảnh) | Nếu làm lại: rút "TÙY CHỌN" hoặc dời nhãn dưới menu |
| QC-04 | KỸ THUẬT/R21 (M-26..32) | 17,5; 22,7; 30,93; 35,7; 45,7; 54,2; 59,3 s | Đổi ô 0 s cùng hiện; header-zones.png: ô trong vùng an toàn, không đè Cáo/phụ đề | cảnh báo, loại trừ (một ô trượt 0,38 s, đã duyệt) | Không |
| QC-05 | KỸ THUẬT/R4 (M-01, M-02) | S06 22,7–30,95 s; S08 35,7–45,7 s | Trung vị 0 khối; tĩnh 54,9% / 51,5% (scene-S06/S08) | cảnh báo, loại trừ có điều kiện (chấm bay, vạch quét) | Giám đốc xem tốc độ thật |
| QC-06 | KỸ THUẬT/audio (M-68..70) | 40,73; 43,3; 51,3 s | Cue c008/c009/c010 lệch onset hoặc không gắn hình; 8/11 cue đạt | cảnh báo, CHƯA KIỂM | Nghe SFX S08/S09 |
| QC-07 | KỸ THUẬT/R3 (M-71, M-72) | 62,37 s; 4,67–5,43 s | BBox chạm mép 0,03 s; nhãn NGHE LÉN? 0,77 s < 0,79 s | cảnh báo nhỏ, loại trừ | Không |
| QC-08 | TRẢI NGHIỆM | 0–6,9 s | Silhouette "bạn" tối trên nền nâu, tương phản thấp; giày bong bóng nhỏ (frame-5.png) | thông tin | Nếu làm lại: sáng hơn |
| QC-09 | TUÂN THỦ | hook S01 | "Vừa nhắc đôi giày, quảng cáo đã hiện!" như sự việc thật; "ví dụ dựng" chỉ ở mô tả đăng | thông tin | Giám đốc cân nhắc thêm "ví dụ" vào lời hook |

### So với bản chuẩn T5 (Δ)
Thời lượng 67,6 vs 44,6 (+22,97 s) · số cảnh 10 vs 18 · cắt/10 s 1,33 vs 3,81 · tĩnh 35,4% vs 30,8% · LUFS -14,82 vs -14,85 · đuôi im 0,631 vs 0,691 · từ chữ/phút 28,4 vs 79,3 · tốc độ MP4 4,417 vs 3,837 · cảnh báo 34 vs 16. Nhịp cắt chậm vì video giải thích dài hơn, mỗi cảnh một ý (R13).

### needs_manual_review
- Audio — **CHƯA KIỂM — giám đốc nghe**: độ tự nhiên giọng, tốc độ cảm nhận, nhịp nghỉ, phát âm (Y6–Y8), độ êm SFX.
- Visual — CHƯA KIỂM: sức hút opening, vùng an toàn khi push_in S01/S09, theo dõi ở tốc độ thật (công cụ thiếu bbox sau zoom, layout.archetype).
- Narrative — CHƯA KIỂM: logic bước giải thích, câu chốt.
- `machine_verdict.final_pass_allowed = false`; không thay người duyệt.

### Phán quyết
Không lỗi FAIL, không lỗi thiết kế. Không đặt `ready` vì còn mục CHƯA KIỂM (nghe). Giữ `review` chờ giám đốc nghe/duyệt. Không escalate.
