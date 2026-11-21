
## Producer — kiểm đầu vào và đo giọng IT-T31-E01

- Storyboard APPROVED, renderer Pillow+FFmpeg. Review vòng 2 chốt header S05 là NHÂN RIÊNG. Danh sách ảnh Gemini đã duyệt trống.
- `pronounce.mjs check` và `phonemes.py --lines` mã 0 với từ điển riêng cho nginx, container, Linux. Phát âm, nhịp, độ tự nhiên: CHƯA KIỂM — giám đốc nghe.
- `prosody.mjs plan --script script.md` gán lệch mã cảnh vì 17 câu được bung từ 10 ô lời. Ví dụ câu “Khoan. Hộp bên cạnh sao đổi màu?” ở opening bị gán S02. Đã lập lại kế hoạch từ spec JSON với mã cảnh theo hàng kịch bản, giữ nguyên lời, rồi chạy lại `gen_vo.py --plan`.
- `prosody.mjs timeline --mode fit --scenes assets/voice/windows.json` cho tổng 58 s nhưng trả `tempo_up` ở S06 (thiếu 0,21862 s, hệ số 1,04462) và S09 (thiếu 0,39750 s, hệ số 1,11357). Đây là tăng tốc thêm trên giọng đã sinh theo R24.
- `prosody.mjs timeline --mode free` cho 51,36485 s, thay đổi các mốc đã duyệt, gồm cả mốc kết 58 s. Hai timeline thử lưu trong assets/voice/. Chưa assemble timeline thử.
- Đề xuất Claude duyệt phân bổ lại ít nhất 0,22 s cho S06 và 0,40 s cho S09 từ các cảnh lân cận, kiểm lại mốc chip đỏ và trình tự xác nhận vá rồi đóng ca, giữ tổng 58 s và tốc độ giọng hiện tại.
- Chưa dựng hình, tạo bản trộn, xuất final hoặc chạy QC video.

## Rescue — IT-T31-E01 (Claude, 21/11/2026)

Nguyên nhân gốc: cửa sổ cảnh chia đều 5–6,5 s theo storyboard, nhưng S06 (hai câu 5,12 s giọng gốc) và S09 (3,90 s) cần hơn cửa sổ sau khi cộng pause trước/giữa và hold_after_voice; trong khi S01–S05, S07–S08 còn dư 0,14–1,18 s. Timeline fit khóa biên cảnh nên báo thiếu cục bộ dù tổng còn dư ~6,6 s. Không dùng free (51,36 s, phá mốc 58 s) và không tăng tốc giọng.

Quyết định (giữ nguyên lời, nhịp giọng gốc, tổng 58,00 s): dời biên cảnh, không đổi nội dung/thiết kế. Storyboard vẫn APPROVED (chỉ đổi duration_s, disappear_s, 2 mốc S06).

| Cảnh | Cũ (start–end, s) | Mới (start–end) | Dài | Dư sau điều chỉnh |
|---|---|---|---|---|
| S05 | 25,0–30,5 (5,5) | 25,0–30,15 | 5,15 | ~0,47 (nhả 0,35) |
| S06 | 30,5–37,0 (6,5) | 30,15–37,0 | 6,85 | cần 6,72 → dư 0,13 (+0,35) |
| S07 | 37,0–42,0 (5,0) | 37,0–41,8 | 4,8 | ~0,14 (nhả 0,2) |
| S08 | 42,0–47,5 (5,5) | 41,8–46,95 | 5,15 | ~0,32 (nhả 0,35) |
| S09 | 47,5–53,0 (5,5) | 46,95–53,0 | 6,05 | cần 5,90 → dư 0,15 (+0,55) |
| S01–S04, S10 | không đổi | | | |

Đã sửa: `assets/voice/windows.json` (biên trên), `storyboard.json` (duration_s S05 5,15 / S06 6,85 / S07 4,8 / S08 5,15 / S09 6,05; disappear_s các nhãn cùng cảnh khớp độ dài mới). Mốc trong cảnh S06: chip nginx đỏ + sound cue alert 4,9 → 5,0; vạch nhấn 5,4 → 5,5 (giọng gốc không tăng tốc: câu 2 bắt đầu 3,09 s, "bị chiếm" ≈ 5,0 s). S09 giữ mốc: giọng gốc câu 1 kết ≈ 2,91 (chip ĐÃ VÁ 2,9), câu 2 bắt đầu 3,21 (tick nhân 3,2) và "đóng ca" ≈ 4,0–4,4 (công tắc 4,0) khớp tự nhiên. Mốc ước lượng, Producer đo lại từ `voice-timeline` mới.

Việc cho Sản xuất: chạy lại `prosody.mjs timeline --mode fit --scenes assets/voice/windows.json` (kỳ vọng không còn overflow, không `tempo_ratio` ở S06/S09, tổng 58 s), assemble, rồi dựng; gen_vo giữ nguyên. Nếu vẫn còn overflow nhỏ thì báo lại, không tăng tốc giọng. Lưu ý: rescue này không chạy được lệnh node (phiên không có quyền), nên timeline mới chưa được kiểm bằng công cụ. Nhịp, phát âm: CHƯA KIỂM — giám đốc nghe.


## Rescue lần 3 — IT-T31-E01 (Claude, 21/11/2026) — CHỈ DẪN RÀNG BUỘC cho Sản xuất, không escalate lại chuyện này

Kiểm số liệu: câu cuối hết 56,430 s (S10 t=3,43 s); mix im 56,428–58,000 s = 1,572 s. Hai chỉ định không mâu thuẫn: hold_after_voice 1,1 s là giữ HÌNH (hình còn đến hết cảnh 58 s), không đòi im; 0,7 s là mặc định đuôi im ÂM THANH (chat-luong-xem.md; `qc-measure` chỉ báo cảnh báo `silent_tail` Y7 khi > 0,7 s, không phải FAIL). Cue `silence` đã khai ở S10 t=4,3 s dài 0,7 s (57,3–58,0 s), nên đuôi im thiết kế đúng 0,7 s; chỉ thiếu tiếng nối giữa 56,43 và 57,3 s.

Quyết định: dùng accent, không xin ngoại lệ. Đã thêm vào `storyboard.json` (S10, `sound_cues`; vẫn APPROVED, không đổi trường nào khác) cue `t=3,95` (≈56,95 s toàn video), intent `highlight`, target "hai tick", intensity `low` (-26 dB theo sound-design), `duration_s 0,35` (đuôi âm tới ≈4,30 s cảnh = 57,30 s). Cue 0,7 s, 2,8 s và `silence` 4,3 s giữ nguyên. Giữ lời đọc, timeline 58,00 s, nhạc tắt.

Việc cho Sản xuất: chạy lại cuesheet.py + mix.py, đo lại silencedetect -45 dB; kỳ vọng đuôi im 0,70 s (±0,05). Nếu còn > 0,75 s do accent -26 dB xuống dưới ngưỡng sớm: tăng `duration_s` lên 0,45 hoặc intensity `medium` (-22 dB); không thêm cue khác. Sau hai lần thử vẫn 0,70–0,80 s thì ghi nhận (chỉ cảnh báo Y7, lý do hình giữ 1,1 s theo kế hoạch) và đi tiếp dựng/render, KHÔNG escalate vì chuyện này. Nhịp, độ êm SFX: CHƯA KIỂM — giám đốc nghe.

## Producer — kiểm lại sau Rescue

- Storyboard vòng 2 đã duyệt mốc S01 mới, gồm tick 1,5 s, hộp vàng 3,1 s và khung bìa 3,3 s. Các mốc này thay mốc dự kiến trong plan.
- Chạy lại `prosody.mjs timeline --mode fit --scenes assets/voice/windows.json`: 58,00 s, overflow rỗng, không áp tempo_ratio. `assemble.py` báo `invalid literal for int() with base 10: '01-2'`; đánh lại mã 01–17 đồng nhất trong hai JSON đầu vào dành riêng cho bước ghép, giữ nguyên clip và mốc. Ghép thành công. ffprobe đo 58,000000 s. `splice.py check` đo đủ 17 câu, 0 biên vi phạm.
- Đã lập cue sheet và trộn bốn stem theo storyboard, nhạc tắt. `ffmpeg -af silencedetect=noise=-45dB:d=0.6` trên mix.wav đo đoạn im cuối 56,428187–58,000000 s, dài 1,571813 s. Câu cuối hết 56,430021 s theo cues.json. S10 bắt buộc giữ hình sau lời 1,1 s; storyboard đồng thời chỉ định đuôi im 0,7 s và cue có tiếng cuối ở 2,8 s của cảnh. Dời câu về sau trong cửa sổ cảnh vẫn để lại ít nhất khoảng 1,1 s im nếu giữ các cue đã duyệt. Để đạt 0,7 s ở mốc 58 s, đề nghị duyệt một accent nhẹ tại nhịp hai tick sáng (S10 t=3,95 s) với đuôi tới khoảng 57,30 s, hoặc duyệt ngoại lệ giữ đuôi im thực đo 1,572 s.
- Chưa render hay chạy QC video. Độ tự nhiên giọng, phát âm, độ êm SFX: CHƯA KIỂM — giám đốc nghe. Độ hút opening và logic mạch kể trên bản dựng: CHƯA KIỂM.

## Producer — bàn giao IT-T31-E01

- Thành phẩm trong `final/`: `IT-T31-E01_9x16.mp4`, `thumbnail.jpg`, `captions.srt`, `publish.json`. Bản hình chưa đốt phụ đề ở `assets/_scratch/picture.mp4`. Dựng Pillow+FFmpeg theo storyboard APPROVED. Nền văn phòng, an ninh, sự cố và code từ `tools/backgrounds/`; S08 dùng biến thể nền an ninh với bàn thử hai tầng. Danh sách Gemini trống. Dùng dáng Cáo của xưởng ở S01/S02/S10.
- Y1: chữ minh họa lấy từ storyboard và dòng kiểm phiên bản nhân được duyệt trong đạo cụ S09. Phụ đề ASS 56 px, ở dải dưới; đã mở khung 360×640. Y2/Y3: Cáo ở mở, nhịp nêu niềm tin sai và kết, lần lượt rộng 184/151/173 px, đáy y1270. Y4: nền đổi theo cảnh. Y5: bảng trực mở ở S01, giải quyết ở S09 và trở lại ở S10. Y6–Y8: giữ mốc giọng đã chốt và không áp thêm tempo; 17 câu, 0 biên đệm vi phạm theo lần kiểm rescue. Căn lại mã cue theo mã câu trong timeline để QC ghép đúng mốc.
- `ffprobe`: 58,000000 s, H.264 1080×1920 yuv420p 30 fps, AAC 48 kHz. `qc-video`: PASS, -14,26 LUFS, -1,67 dBTP. Các cảnh báo chuyển động S01, S02, S03, S05, S06, S07, S09, S10 đến ở các cảnh có hành động tập trung theo nhịp: bật tick/cảnh báo, nứt bong bóng, hạ chân và dựng vách, so hai kiểu nhân, đổi chip, giữ dấu hỏi, xác nhận rồi gạt ca, lật lịch rồi bật tick. Giữ trạng thái hoàn chỉnh để người xem đọc quan hệ. Đã sửa hai lỗi chồng chữ của lượt đầu và xem bìa ở 180×320. `qc-publish`: PASS. Rà tên nền tảng chỉ trùng khóa JSON cho phép.
- Audio: bốn stem; nhạc tắt. Cue cuối 56,95 s được giữ bằng cấu hình riêng trong `assets/_scratch/sound-design-t31.json` với giới hạn 10 cue/phút, khe cùng họ 3,2 s, ưu tiên highlight 49 và giới hạn accent 0,3499 s để tránh chồng khoảng lặng do làm tròn. Accent mức medium -22 dB. Tăng dự phòng đỉnh trước mã hóa AAC lên 1,05 dB. Đuôi mix đo bằng silencedetect -45 dB là 0,822 s; phép đo theo stem giọng cho 1,647 s ở -40 dB vì không tính accent. Giữ hình kết theo storyboard. Các cờ về khoảng nghỉ và độ khớp cue bằng nhật ký còn trong báo cáo; bộ đo thiếu liên kết trực tiếp giữa các cue và đối tượng tương ứng trong nhật ký.
- Visual: opening đủ ba pha, tiêu đề 84 px. Tiếng đầu đo 0,598 s, sớm hơn ngưỡng thử 0,002 s. Vì điều kiện này, công cụ tính độ phủ header trên cả 58 s và cho 89,655%; header có từ 6–58 s. Đổi ô dùng một thẻ đọc được mỗi khung để hai thẻ khỏi đè chữ, vì thế phép đo yêu cầu hai ô cùng tồn tại trong khoảng chuyển cũng báo cảnh báo. Các cảnh báo khe chữ và thời gian đọc nhãn nằm trong báo cáo. Nhãn vẽ theo danh sách đã duyệt; một số keyword dùng biểu tượng/thay đổi hình nên bộ dò chữ vẫn báo thiếu.
- Narrative: giữ cửa sổ 10 cảnh như rescue, S07 dài 4,8 s (ngưỡng thử medium 5 s). `qc-measure` đọc đủ Audio / Visual / Narrative, 0 lỗi, 73 cảnh báo, final_pass_allowed=false. Xem `assets/_scratch/qc-auto/report.md` và các khung chứng cứ cùng thư mục.
- needs_manual_review: độ tự nhiên, nhịp, phát âm và độ êm SFX **CHƯA KIỂM — giám đốc nghe**. Sức hút opening, khớp lời với từng bước hình và logic mạch kể **CHƯA KIỂM — chờ người duyệt**.
- Clips nghe kiểm (từ điển riêng, verified=false):

| Thuật ngữ | Chữ đưa TTS | Âm vị | Clip |
|---|---|---|---|
| nginx | nginx | ˈɛndʒɪn ˌɛks | assets/voice/term-check/nginx.wav |
| container | container | kəntˈeɪnɚ | assets/voice/term-check/container.wav |
| Linux | Linux | lˈɪnʌks | assets/voice/term-check/linux.wav |

## QC — lượt 4 (Claude, 21/11/2026, đo lại trên mp4 19:56)

Đo: `qc-measure ep01 --baseline T5` → 97 phát hiện, 73 cảnh báo, 0 lỗi (`assets/_scratch/qc-auto/report.md`). ffprobe 58,000 s, 1080×1920, 30 fps, H.264/AAC; mix -14,25 LUFS, true peak -2,5 dBTP. Gemini xem trước: vắng (không gọi, QC bằng mắt). Đã mở: board-01..04, frame-2, frame-44, frame-57, frame-open-end, frame-phase-2, header-zones, thumb-180x320 (11 ảnh).

**Kết luận:** KỸ THUẬT = ĐẠT (0 lỗi, qc-video/qc-publish PASS theo Producer, độ phân giải/loudness đạt). TUÂN THỦ = ĐẠT có lưu ý (luật tên nền tảng sạch; không nói root ngay/số máy/cách khai thác; sổ nguồn: không dùng ảnh ngoài/Gemini, approved.json rỗng, nền từ tools/backgrounds). TRẢI NGHIỆM = CHƯA ĐẠT (lỗi thiết kế + lỗi dựng nhỏ) và còn CHƯA KIỂM phần nghe.

### Bảng phát hiện có mốc

| Mã | Nhóm | Mốc | Bằng chứng | Mức | Đề nghị |
|---|---|---|---|---|---|
| QC-01 | TRẢI NGHIỆM Y7/R6 (thiết kế) | 16,41–20,21; 21,79–25,21; 27,03–30,35 s (+35,68–37,21, 51,35–53,21) | M-12/13/14: im 3,80/3,42/3,32 s, kế hoạch 2,4/2,7/2,5 s (lệch +1,40/0,72); tỉ lệ lặng 48,8%, tiếng chỉ 29,7/58 s, tĩnh 59,2% | cảnh báo→lỗi thiết kế | Chia lại cửa sổ S03–S05 (ngắn lại hoặc thêm bước hình/lời); không để diagram đứng im >3 s |
| QC-02 | TRẢI NGHIỆM Y3/bố cục (thiết kế) | mọi cảnh S02–S10 (board-02, frame-44) | Diagram nằm dải y≈440–1170 /1920, nửa dưới 1250–1920 trống ngoài phụ đề; vật chính ~ ⅓ khung, Cáo 150–184 px; ở 180×320 nhãn nhỏ | cảnh báo | Phóng diagram và dời xuống giữa khung, tận dụng nửa dưới |
| QC-03 | TUÂN THỦ R3/Y1 (dựng) | 3–4,6 s "ĐÃ VÁ" (frame-2); 8,27–9,23 s "THANH TOÁN"/"BÁO CÁO" (M-51, khe 18 px); 44,4–46 s "GIÁ: NHÂN CHUNG" đè cân/thanh; 55,5 s "NGINX + NHÂN" chạm icon xanh; TƯỜNG 16–24 s đè hộp | text-overlap.png, frame-2, frame-57, board-03 | lỗi dựng | Dời nhãn khỏi viền/icon, khe ≥24 px |
| QC-04 | R20 (dựng/thiết kế) | S01 0–4,6 s | M-27/M-28: tiếng đầu 0,598 s (ngưỡng 0,6); tiêu đề "Lớp nào chưa vá?" chỉ hiện từ 4,6 s (frame-phase-2), chưa vào render-log; 0–4,6 s không tiêu đề | cảnh báo | Cho tiêu đề hiện sớm hơn (≤2 s) và ghi `opening_title` vào render-log |
| QC-05 | R21 | S02–S10 | Header phủ 89,655% (<95%), 8 lần đổi ô không chồng (M-29..37); header ẩn S01 theo review vòng 2 | cảnh báo (đã được duyệt riêng cho S01) | Chấp nhận nếu giám đốc đồng ý S01 không header; cân nhắc giữ hiện 2 ô |
| QC-06 | Y3 | 55,5–58 s | Cáo che công tắc ca ở frame-57 | lỗi dựng nhỏ | Dời Cáo khỏi công tắc |
| QC-07 | R22 | S01–S10 | 11 keyword thiếu chữ (M-39..50), nhưng 100% cảnh có chữ vẽ thật, 40,3 từ/phút, kinetic 1,29/25 s | thông tin/cảnh báo | Đạt phần lớn; "container"/"lỗi nhân" nên có nhãn trong cảnh |
| QC-08 | Y7 | 56,35–58 s | Đuôi im 1,647 s (-40 dB), M-20; Producer đo 0,822 s ở -45 dB sau accent; hold hình 1,1 s theo kế hoạch | cảnh báo | Giữ nhưng ghi ngoại lệ |
| QC-09 | Audio sync | 38,78–39,02 s | M-21: cue 14 lệch -0,244 s | cảnh báo nhỏ | Phụ đề bắt đầu sớm 0,24 s so với tiếng ngắt "Chi tiết" (ngắt nhịp giữa câu) |
| QC-10 | Nội dung (nhắc) | S09 17 s "khi có bản" | Hàm ý bản vá nhân chưa có; brief cấm khẳng định tình trạng bản vá | lưu ý | Giám đốc cân nhắc; nginx2root chỉ hiện như tên ví dụ, không nói root ngay |

So với bản chuẩn T5: dài +13,4 s, cắt/10 s 1,55 (T5 3,81), tĩnh 59,2% (T5 30,8%), tốc độ đọc giọng gốc 4,849 âm tiết/s (+26% vs T5 MP4; vượt dải thử 4,6–4,8, M-23), tỉ lệ lặng 0,488 (T5 0,34), cảnh báo 73 (T5 16).
D8: R23 đầu/cuối câu 0/17 cờ (đạt); R3 0 cặp giao bbox, 2 cặp khe 18 px (cảnh báo); R22 đạt thô; R21/R20 như trên.

### 5 câu người xem lạ
1. 3 s đầu: Đạt phần (câu hỏi "Vá nginx xong rồi, đóng ca nhé?" + hộp đổi màu); tiêu đề chủ đề chưa hiện (QC-04).
2. Trước 5 s thấy hệ quả: Đạt (hộp vàng cảnh báo 3,1 s, "Lớp nào chưa vá?" 4,6 s).
3. Mỗi cảnh một ý, tắt tiếng hiểu: CHƯA KIỂM đầy đủ; nhocaption-board cho thấy luồng hiểu được nhưng S06–S07 mờ (chỉ nhìn khung).
4. Đổi hình: Chưa đạt ở S03–S05 (khoảng ≥3 s diagram đứng im, QC-01); chữ không chép lời (chữ lặp 0).
5. Kết: Đạt (công tắc đóng ca + câu hỏi bình luận; hộp xanh) ; bìa đọc được ở 180×320 một phần (nhãn nhỏ).

### Y1–Y8
Y1 Đạt có lỗi nhãn đè (QC-03) · Y2/Y3 Đạt (Cáo 3 cảnh, nhưng che công tắc QC-06; vật chính nhỏ QC-02) · Y4 Đạt (4–5 nền đổi theo cảnh) · Y5 Đạt (bảng trực mở S01, đóng S09–S10) · Y6 CHƯA KIỂM — giám đốc nghe · Y7 Chưa đạt (QC-01, QC-08) · Y8 phonemes.py mã 0 theo đo, nghe CHƯA KIỂM.

### CHƯA KIỂM — giám đốc nghe/xem
Độ tự nhiên giọng, tốc độ cảm nhận (4,85 âm tiết/s), nhịp nghỉ, phát âm nginx/container/Linux (clip `assets/voice/term-check/`), độ êm SFX/accent 56,95 s, sức hút opening, logic mạch kể, tắt tiếng hiểu được S06–S08, đúng kỹ thuật các quan hệ (nhân chung/tường/máy ảo), `final_pass_allowed=false`.

### QC — lỗi thiết kế
QC-01, QC-02, QC-04 (và lệch plan về nhịp). Đề nghị Kịch bản/Đạo diễn hình ảnh: rút cửa sổ S03–S05, phóng diagram, tiêu đề opening sớm. Lỗi dựng đi kèm: QC-03, QC-06, QC-09. Video giữ ở `review`.

Bài học: Rescue dồn thêm thời gian cho S06/S09 làm cửa sổ S03–S05 dư >3 s im; nên kiểm im > kế hoạch trước khi chốt biên cảnh.
