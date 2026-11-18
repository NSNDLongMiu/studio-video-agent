# IT-T4-E01 — Nhật ký sản xuất

## Mốc theo giọng thật cần duyệt

Đã đọc brief, concept, plan, script, storyboard và review vòng 2. Storyboard `APPROVED` chỉ định Pillow + FFmpeg. Giữ mốc hình MỘT BẢNG từ frame 60 tới 539 và mở kho ở frame 702. Dáng `shrug` bắt đầu 27,95 s theo storyboard đã duyệt, thay mốc 26,1 s còn ghi trong script/plan.

Đã tạo và đo 13 lượt lời bằng VieNeu-TTS v3 Turbo cục bộ, Minh Đức, `temperature=0.65`, `atempo=1.08` một lần. Dùng `ffprobe` lấy thời lượng và `ffmpeg -af silencedetect=noise=-38dB:d=0.04` ước lượng phần có tiếng. Đây là phép đo ngưỡng âm lượng. Phát âm, độ tự nhiên và chất lượng MIX chưa được xác nhận bằng nghe.

- Lời 2 bản đầy đủ có tiếng 3,117 s, đặt đầu tiếng ở 2,200 s sẽ dứt 5,317 s. Bản rút gọn đã được duyệt sẵn có tiếng 2,582 s, dứt 4,782 s. Đề xuất dùng bản rút gọn và đồng bộ phụ đề.
- Hai lượt kiểm gồm bộ TTS gốc và ba lần tạo lại cùng cấu hình cho từng lời 6, 7, 11, 12, 13. Lời 12 ngắn nhất 4,989 s, dài hơn ô 25,25–29,95 s. Lời 13 ngắn nhất 2,819 s. Hai lời liền nhau tính từ 25,250 s sẽ dứt sớm nhất khoảng 33,058 s trước khi tính nghỉ giữa câu. Giữ nguyên mốc kết 32,900 s sẽ cắt lời ở các bản đã đo.
- Đề xuất giữ hình đã duyệt đến C10, giữ câu hỏi từ 17,700 s (trước frame 540 đúng 0,300 s) và lời trả từ 23,400 s. Giữ hai cách lưu cạnh nhau xuyên lời giới hạn. Giữ `shrug` 27,950 s, sau đoạn nghỉ trước vế “Nó không phải lệnh SQL chuẩn” (hết nghỉ tại 27,580 s theo ngưỡng). Kéo nhịp khép môi khe cuối C11 tới 30,350 s, sau đó chuyển C12 và `thumbs_up` tại mốc CTA 30,350 s, muộn 0,400 s. Giữ nguyên thứ tự và thời lượng tương đối của các chuyển động C12. Kết 33,300 s.
- Bản ghép giọng nháp được đo dài 33,300 s, khoảng lặng dài nhất 0,559 s (27,021–27,580), đuôi lặng 0,131 s (33,169–33,300). R8 yêu cầu Kịch bản/Đạo diễn hình ảnh duyệt mốc theo giọng thật. Khi dựng phụ đề, giữ “xoá” ở lời 5 và một cue lời 8 xuyên frame 540.

| Lời | Bắt đầu tiếng (s) | Hết tiếng (s) |
|---|---:|---:|
| 1 | 0,020 | 2,193 |
| 2 (rút gọn) | 2,200 | 4,782 |
| 3 | 5,000 | 7,483 |
| 4 | 7,600 | 9,663 |
| 5 | 10,000 | 12,833 |
| 6 | 13,000 | 14,629 |
| 7 | 14,750 | 17,632 |
| 8 | 17,700 | 18,890 |
| 9 | 19,080 | 21,379 |
| 10 | 21,510 | 23,210 |
| 11 | 23,400 | 25,183 |
| 12 | 25,250 | 30,239 |
| 13 | 30,350 | 33,169 |

## Tệp nháp và kiểm tra đã làm

- `assets/voice/` chứa WAV gốc và WAV đã qua atempo; `assets/_scratch/voice-alternates/` chứa các lượt đo lại. `assets/_scratch/voice-timings.json` và `assets/_scratch/voice-alternates/timings.json` ghi số đo từng bản. `assets/_scratch/vo-r8-draft.wav` là bản nghe đề xuất, chỉ có giọng; `assets/_scratch/r8-proposed-timeline.json` ghi mốc theo từng lượt.
- `assets/_scratch/hook-motion-draft.mp4` là bản thử hình hook 0–2 s. FFprobe báo 2,000 s, H.264 yuv420p, 1080×1920, 30 fps. Đã mở khung 0,5 và 1,7 s ở 360×640, cùng bìa nháp 1,7 s ở 180×320. Đọc được tin sếp và nhãn tình huống tại 180×320. Đạo cụ và nền do Producer vẽ bằng Pillow; Cáo từ PNG gốc `brand/cao/poses/`, chữ Segoe UI Semibold từ Windows. Không tải hình hoặc tiếng ngoài.
- `node tools/qc-publish.mjs assets/_scratch/publish.draft.json` báo `pass: true`, `fails: []`, `warns: []` cho metadata nháp theo script. Thời lượng, danh sách tài sản cuối và trạng thái QC sẽ điền sau khi có bản dựng.
- `final/` hiện trống. Chưa chạy QC cho MP4 cuối, chưa đo hộp chữ libass trên bản dựng, chưa kiểm frame 701/702, chưa kiểm mix hay nghe phát âm.

## Việc cần Kịch bản/Đạo diễn hình ảnh xử lý

Duyệt lại nhịp theo WAV nháp và các số đo ở trên, xác nhận các cue lệch khỏi mốc dự kiến, đồng thời xác nhận mốc mới của C11–C12. Producer chưa sửa script, plan hay storyboard.

**ĐÃ XỬ LÝ (18/11/2026):** xem mục "Hướng dẫn từ Claude — RESCUE" ngay dưới.

## Hướng dẫn từ Claude — RESCUE — mốc theo giọng thật (đã duyệt/đã chỉnh)

Claude (vai Hỗ trợ, chế độ RESCUE, 18/11/2026) duyệt mốc ở mức hướng dẫn cho Sản xuất. **Kết luận: DUYỆT đề xuất của Producer, giữ nguyên mọi con số của Producer; không đổi nội dung, lời, chữ, thứ tự cảnh.** Chỉ dời mốc thời gian của C11, C12 và kết video. Producer làm theo mục này khi chạy lại (đây cũng là mục "Hướng dẫn từ Claude" mà lệnh chạy lại yêu cầu đọc).

### 1. Nguyên nhân gốc

Đây là **nhịp thật lệch mốc dự kiến**, không phải lỗi dựng hay lỗi công cụ. Mốc trong `script.md`/`storyboard.json` (tổng 32,9 s) tính từ bảng ước lượng 4,6 âm tiết/s + nghỉ nội câu, `script.md` đã ghi rõ "không phải đo" và "mốc sẽ được duyệt lại sau đo TTS thật". Giọng thật (Minh Đức, `atempo` 1,08 một lần) cho: lời 2 đầy đủ dứt 5,317 s (ước 4,86 s, vượt 5,0 s); lời 12 ngắn nhất 4,989 s (ước 4,55 s, dài hơn ô 25,25–29,95 s tới 0,29 s, gồm một khoảng nghỉ 0,559 s giữa hai câu và đọc chữ cái "ét kiu eo"); lời 13 ngắn nhất 2,819 s (ước 2,60 s). Hai lời cuối nối tiếp nên dồn lệch về cuối: từ 25,250 s cần ít nhất tới 33,058 s trước khi tính nghỉ giữa hai lời. Không giải bằng cách tăng tốc hay chèn im; chỉ dời mốc cuối theo R8. Tổng mới 33,3 s vẫn trong 15–45 s và trần riêng 40 s.

### 2. Kiểm số đo của Producer (Claude tự tính lại)

- Tính lại từ `assets/_scratch/voice-timings.json` và `voice-alternates/timings.json`: mọi `start_s`/`end_s` trong `r8-proposed-timeline.json` = `start_s` + `active` của đúng lượt đã chọn. 13/13 lời khớp (sai số < 0,001 s). Lời 12: các lượt 4,989 / 5,285 / 5,098 / 5,332 s, ngắn nhất là bản gốc 4,989 s; lời 13: 2,874 / 3,283 / 2,819 / 3,168 s, ngắn nhất là `13-3` 2,819 s. Tổng tối thiểu 25,250 + 4,989 + 2,819 = 33,058 s: đúng như Producer ghi.
- Chạy lại ffprobe/silencedetect trên `assets/_scratch/vo-r8-draft.wav`: dài **33,300 s**; lặng dài nhất **0,559 s** (27,021–27,580, giữa hai câu của lời 12); đuôi **0,131 s** (33,169–33,300); không có khoảng lặng ≥ 0,8 s. Khớp số Producer báo.
- Bốn lượt chọn từ bản tạo lại (`06-4`, `07-2`, `11-4`, `13-3`) là lượt ngắn nhất trong các lượt **cùng cấu hình** (temperature 0,65, atempo 1,08 một lần), không tăng tốc thêm. Cặp lời 6–7 trong ô 13,0–17,7 s chỉ còn dư 0,19 s, nên buộc phải dùng lượt ngắn; đúng R8.
- Bản rút gọn lời 2 "Chia theo tháng, máy bỏ qua được phần không cần." là bản Claude đã duyệt trước (`review/script-r2.md`, mục Dự phòng của `script.md`); dứt 4,782 s ≤ 4,9 s. Giữ điều kiện bỏ qua nêu ở lời 3. `voice_over` của C02 trong `storyboard.json` giữ bản đầy đủ; bản thu và phụ đề dùng bản rút gọn.

### 3. Bảng mốc cuối cùng (giây toàn video)

| Lời | Lượt | Bắt đầu tiếng | Hết tiếng | Nghỉ trước | Ghi chú |
|---|---|---:|---:|---:|---|
| 1 | 01 | 0,020 | 2,193 | — | Hook; đổi bố cục ở frame 60 (2,000) trong lúc còn đọc nốt "chạy!" (dứt 2,193), như thiết kế gốc |
| 2 | 02-short | 2,200 | 4,782 | 0,007 | Ích lợi đầu tiên, dứt trước 5,0 s (bản rút gọn đã duyệt) |
| 3 | 03 | 5,000 | 7,483 | 0,218 | |
| 4 | 04 | 7,600 | 9,663 | 0,117 | |
| 5 | 05 | 10,000 | 12,833 | 0,337 | Phụ đề giữ "xoá" |
| 6 | 06-4 | 13,000 | 14,629 | 0,167 | |
| 7 | 07-2 | 14,750 | 17,632 | 0,121 | |
| 8 | 08 | 17,700 | 18,890 | 0,068 | Câu hỏi mở; frame 540 (18,000) cách đầu cue **0,300 s**, nằm trong cue |
| 9 | 09 | 19,080 | 21,379 | 0,190 | Vào sớm 0,22 s so với ranh giới C08 (19,3): thẻ đang lật, chấp nhận; ranh giới hình giữ 19,3 |
| 10 | 10 | 21,510 | 23,210 | 0,131 | Vào sớm 0,09 s so với ranh giới C09 (21,6); ranh giới hình giữ 21,6 |
| 11 | 11-4 | 23,400 | 25,183 | 0,190 | **Trả đáp án đúng 23,400 s = frame 702** |
| 12 | 12 | 25,250 | 30,239 | 0,067 | Câu 1 tới 27,021; nghỉ 0,559 s; câu 2 từ 27,580 |
| 13 | 13-3 | 30,350 | 33,169 | 0,111 | CTA; câu 1 tới 31,721; nghỉ 0,398 s; câu 2 từ 32,119 |
| — | — | — | **33,300 (kết)** | đuôi **0,131** | ≤ 0,7 s |

Ranh giới cảnh: C01 0–2,2 · C02 –5,0 · C03 –7,6 · C04 –10,0 · C05 –13,0 · C06 –17,7 · C07 –19,3 · C08 –21,6 · C09 –23,4 · C10 –25,25 · **C11 –30,35** · **C12 –33,3**. Tổng 33,3 s = 999 khung (30 fps). Mốc nửa khung dùng half-up trên trục tuyệt đối: 25,25 → khung 758; 29,15 → 875; 30,35 → 911; 30,95 → 929; 31,55 → 947.

Dáng Cáo: 0; 2,2; 5,0; 10,0; 13,0; 16,0; 18,0; 21,6; 23,8; **27,95 (`shrug`, không đổi)**; **30,35 (`thumbs_up`, trước 29,95)**. `shrug` nằm sau đầu vế "Nó không phải lệnh SQL chuẩn" (27,580) và cách `thumbs_up` 2,40 s (≥ 2,0 s). Giữ ba SFX tự tạo ở 0 / 15,7 / 23,4 s; click 15,7 s trùng tiếng lời 7 thì bỏ hoặc dời vào khoảng nghỉ 15,98–16,30 s (dưới giọng ≥ 12 dB, ghi vào notes).

Nhịp C11–C12 mới (chỉ dời mốc, nội dung từng nhịp nguyên văn storyboard): C11 25,25–26,4 ngăn mở · 26,4–27,55 khối tệp trượt ra (trùng khoảng nghỉ 0,559 s: hình đang đổi, đó là lý do giữ nghỉ này) · 27,55–27,95 hai hình tách · 27,95–28,7 ray · 28,7–29,15 giấy 100 px · **29,15–30,35** môi khe khép 70 px (kéo dài 0,4 s, trước 29,15–29,95). C12: thẻ Partition **30,35–30,95** · thẻ Archive **30,95–31,55** · cửa **31,55–32,6** nửa đầu · **32,6–33,3** nửa sau; hai thẻ đủ chữ từ 30,35 tới hết, `thumbs_up` giữ tới hết, không nhún. Cụm "mỗi hệ mỗi cách" nay rơi vào 29,52–30,24 s; hai cách lưu cạnh nhau suốt 27,55–30,35 s.

### 4. Thay đổi so với storyboard APPROVED

Chỉ dời mốc thời gian, `status` giữ **APPROVED**. Trong `storyboard.json` đã sửa **chỉ các trường/chuỗi thời gian**: `scene_id` C11 `25.25-29.95` → `25.25-30.35`, C12 `29.95-32.9` → `30.35-33.3`; `duration_s` C11 4,7 → 5,1 (C12 vẫn 2,95); giây trong `event`/`character_action`/`props` của C11 và C12 tương ứng; thêm khối `r8_timing_override` ở đầu file (tổng, ranh giới cảnh, mốc dáng, 13 cue). Các con số 32,9 s / 29,95 s / 987 khung / đuôi 0,35 s còn trong `visual_style_note` là mốc dự kiến cũ, **khối `r8_timing_override` thay thế chúng**. Không đổi lời, chữ hiển thị, thứ tự cảnh, vật/hình, bố cục, màu, SFX, `renderer`. Không sửa `script.md`/`plan.md`: mốc ở đó là dự kiến (shrug 27,95 theo storyboard APPROVED thay 26,1; tổng thực 33,3 s nằm trong khoảng 32–34 s và dưới trần 40 s).

### 5. Ràng buộc khi dựng (neo cứng) và độ lệch cho phép

Neo cứng, không dời: frame 60 / 540 / 702; cue 8 bắt đầu ≤ 17,80 s (frame 540 nằm trong cue); lời 11 bắt đầu 23,400 s ±0,05 (đáp án lộ đúng frame 702); lời 2 dứt ≤ 4,90 s; `thumbs_up` = đầu lời 13; `shrug` ≥ 27,580 s và ≤ `thumbs_up` − 2,0 s; không tăng tốc giọng (atempo 1,08 một lần); không lặng ≥ 0,8 s; đuôi im ≤ 0,7 s; tổng ≤ 40 s.
Cho phép khi ghép MP4 thật nghe dính: dời một lời ±0,08 s (không chồng tiếng, không chạm neo, không dời ranh giới cảnh) và ghi vào `notes.md`. Ba cặp cách nhau mỏng nhất cần để ý: 1→2 (0,007 s), 7→8 (0,068 s), 11→12 (0,067 s). Lời 2 chỉ được dời muộn tối đa 0,08 s (dứt ≤ 4,862 s). Kết được kéo tới tối đa 33,65 s (đuôi ≤ 0,48 s) nếu thấy cắt gắt, bằng cách cửa C12 chạy tiếp; không thêm im.
Phụ đề (`captions.srt` + ASS): theo đúng mốc tiếng ở bảng; cue 2 là bản rút gọn; lời 5 giữ "xoá"; cue 8 một cue 17,700–18,890 s, một dòng ghim như storyboard (xuyên frame 540, không tách), tắt trước 19,0 s để nhường cue 9 ở 19,080 s; cue 1 chuyển hộp chữ ở frame 60 cùng lúc đổi bố cục, không cắt chữ; lời 12 và 13 tách cue theo ranh giới câu tại các khoảng nghỉ (27,021/27,580 và 31,721/32,119), mỗi cue ≤ 2 dòng.
Hình: C11 27,95–30,35 chuyển động nhỏ (ray/giấy/môi khe) — dựng ray/môi khe dày ≥ 16 px, màu #60A5FA, chạy liên tục có ease (không dừng rồi giữ), để vẫn thấy ở 360×640; nhịp 29,15–30,35 không được hóa tĩnh.

### 6. Đối chiếu R1–R10 với mốc mới

| Mục | Kết quả |
|---|---|
| R1/R2 hook, ích lợi, câu hỏi, chốt | Hook từ 0,02 s; ích lợi lời 2 dứt 4,782 s (< 5,0 s); câu hỏi mở 17,700 s → trả đúng 23,400 s; câu chốt hiển thị (hai thẻ) + CTA lời 13 từ 30,35 tới 33,3 s. Đạt, không đổi. |
| R3/R4/R5 chữ, hình, một tiêu điểm | Không đổi chữ/hình/thứ tự; C11–C12 vẫn mỗi nhịp một tiêu điểm; ≤ 3 nhóm chữ. Đạt. |
| R8 nhịp theo giọng thật | Không tăng tốc thêm; lặng dài nhất 0,559 s < 0,8 s; đuôi 0,131 s ≤ 0,7 s; tổng 33,3 s trong 15–45 s. Đạt theo số đo; chưa nghe. |
| Chính xác kỹ thuật | Không đổi lời nên không đổi nội dung kỹ thuật; bản rút gọn lời 2 giữ điều kiện ở lời 3. Phát âm Partition/archive/SQL vẫn **CHƯA KIỂM**. |
| Nguồn/giấy phép | Không thêm nguồn mới. |

### 7. CHƯA KIỂM — việc của QC sau dựng

Chưa ai nghe giọng: phát âm "pa-ti-sần", "a-kai-v", "ét kiu eo"; độ tự nhiên của các lượt tạo lại ngắn nhất (06-4, 07-2, 11-4, 13-3); khoảng nghỉ giữa các lời rất mỏng (0,007–0,34 s) có nghe dính không; đuôi 0,131 s có cắt gắt không; độ lớn SFX. QC cũng cần nhìn thật C11 27,95–30,35 và C12 ở 360×640, bìa hook ở 180×320, frame 539/540 và 701/702. Số đo ở trên là đo ngưỡng âm lượng, không phải xác nhận bằng nghe.

Producer cần ghi lại trong `notes.md` khi dựng xong: (a) `shrug` 27,95 theo storyboard APPROVED thay 26,1 trong script/plan; (b) 18,000 − 17,700 = 0,300 s; (c) lời 2 dùng bản rút gọn 4,782 s; (d) `captions.srt` giữ "xoá"; (e) đo hộp chữ ASS bằng libass thật; (f) không có pixel C10 trước frame 702; (g) mọi lần dời ±0,08 s nếu có.

## Hướng dẫn từ Claude — RESCUE lần 2 (18/11/2026): Codex thoát mã 1 ở job 17

### 1. Nguyên nhân gốc
Không phải lỗi dựng. Job 17 chạy 3 lượt và **cả 3 lượt đều chết đúng một chỗ**: Codex mã hoá base64 file âm thanh (`assets/_scratch/render/audio-qc.mp3`, rồi `qc-audio.wav`) để đưa lại cho mô hình "nghe" thử phát âm. Mô hình trả về `400 invalid_request_error: "Audio input is not available."` (nhật ký `logs/job-17-produce.log`, ba khối `ERROR: {` ở lượt 1, 2, 3), Codex thoát mã 1 ("tokens used 92,462"). Mô hình của Codex ở máy này **không nhận âm thanh làm đầu vào**; thử lại chỉ lặp lỗi và tốn lượt sản xuất.

### 2. Tình trạng thành phẩm khi Codex chết (đọc từ nhật ký, Claude chưa tự chạy lại công cụ)
- Cả ba lượt đều chạy `node tools/qc-video.mjs … --min 15 --max 40` và ra cùng kết quả: `pass: true`, 33,3 s, h264 1080×1920 yuv420p, aac 48 kHz, 30 fps, lufs_i −14,35, lra 1,6, true peak −1,83 dBTP, `fails: []`, `warns: []`. Con số giống hệt giữa các lượt nên MP4 không bị dựng lại thành bản khác.
- Lượt 3 chạy `build_delivery.py publish` rồi `node tools/qc-publish.mjs final/publish.json`: `pass: true`, `fails: []`, `warns: []`. `final/` đủ 4 tệp: `IT-T4-E01_9x16.mp4`, `captions.srt` (15 cue, đúng mốc bảng RESCUE lần 1, giữ "xoá", cue 2 bản rút gọn), `thumbnail.jpg`, `publish.json` (nhãn AI có ở cả 3 nền tảng, nguồn PostgreSQL/MySQL/Oracle).
- Claude mở `thumbnail.jpg`: có tình huống dựng, nhãn "AI tạo", Cáo, bố cục trong vùng an toàn. Đánh giá nội dung/hook là việc của QC.
- Dòng "`final/` hiện trống" ở mục "Tệp nháp và kiểm tra đã làm" phía trên là **cũ** (trước khi dựng).
- Codex **chưa** làm: ghi mục (a)–(g) vào `notes.md`, `set_video_stage review`, báo `idle`. Rescue này đã đưa video sang `review` và gỡ cờ vướng để worker xếp QC; **không xếp sản xuất lại**, vì dựng lại chỉ lặp bước "nghe" rồi chết tiếp.

### 3. Nếu vẫn phải chạy `produce` lại (QC báo lỗi dựng)
- **Cấm** đưa âm thanh vào ngữ cảnh mô hình: không base64 file `.wav/.mp3/.aac`, không gắn âm thanh làm đầu vào, không "nghe thử". Phát âm "pa-ti-sần", "a-kai-v", "ét kiu eo" **không ai nghe được bằng công cụ hiện có** → để **CHƯA KIỂM**, ghi vào `notes.md`, không escalate vì việc này.
- Kiểm âm thanh chỉ bằng số đo: `ffprobe`, `silencedetect`, `loudnorm`, `node tools/qc-video.mjs`. Đây vẫn là phép đo ngưỡng âm lượng, không phải xác nhận bằng nghe.
- Chỉ dựng lại phần QC chỉ ra; không dựng lại từ đầu. Không đổi lời, chữ, mốc đã duyệt ở "RESCUE — mốc theo giọng thật" phía trên.

### 4. Việc QC cần làm (chưa ai kiểm bằng mắt/tai)
Xem MP4 thật: bìa hook ở 180×320, frame 539/540 và 701/702, C11 27,95–30,35 s và C12 ở 360×640, phụ đề không chồng vật. Phát âm và độ dính giữa các lời mỏng (0,007–0,34 s) vẫn **CHƯA KIỂM**; QC ghi đúng là chưa kiểm, không làm tròn thành đạt. Producer chưa ghi mục (a)–(g) nên QC tự đối chiếu từ MP4/`captions.srt`/`storyboard.json`: `shrug` 27,95 s; 18,000 − 17,700 = 0,300 s; lời 2 bản rút gọn dứt 4,782 s; "xoá" ở cue 5; hộp chữ ASS; không có pixel C10 trước frame 702.

## QC — lần chạy 18/11/2026: CHƯA HOÀN TẤT, KHÔNG CÓ PHÁN QUYẾT

Lý do: phiên QC này không có quyền chạy lệnh Bash (mọi lệnh bị từ chối tự động, không có người duyệt). Không chạy được `node tools/qc-video.mjs`, `node tools/qc-publish.mjs`, `ffmpeg` (trích khung, silencedetect). Không có số đo hoặc khung hình nào từ MP4 được tự kiểm trong lần này; các số trong mục RESCUE vẫn chỉ là số do Codex/RESCUE ghi, không phải số QC tự đo. Video giữ nguyên stage `review`; không đặt `ready`, không đặt `production`.

Đã đọc được (không cần Bash), kèm kết luận hẹp:
- `final/` đủ 4 tệp đúng quy ước (mp4, captions.srt, thumbnail.jpg, publish.json), không có tệp lạ.
- `thumbnail.jpg` (đã mở xem 1080×1920): khung hook có "Vào họp rồi!", "Tình huống dựng", "Đơn hàng", Cáo `surprised` cạnh laptop, nhãn "AI tạo"; không lưới nhiều nhãn. Chữ chính cao, nhiều khả năng đọc được ở 180×320 nhưng CHƯA thu nhỏ thật để xem.
- `captions.srt`: 15 cue, lời 2 là bản rút gọn dứt 4,782 s; "xoá" giữ ở cue 5; cue 8 17,700–18,890 s chứa mốc 18,000 s (cách đầu cue 0,300 s); cue 11 bắt đầu 23,400 s; cue 14 bắt đầu 30,350 s; cue cuối dứt 33,169 s. Chữ khớp `script.md`, trừ lời 2 rút gọn đã duyệt.
- `publish.json` có đủ tiêu đề/mô tả/hashtag cho TikTok, Facebook Reels, YouTube Shorts; `ai_generated_content=true`, câu khai báo AI có trong cả ba mô tả; `duration_s` 33,3. Chưa chạy qc-publish để xác nhận.
- Nội dung kỹ thuật (đọc chữ): partition không tự xoá/nén, archive là cách cất dữ liệu, "không phải lệnh SQL chuẩn, mỗi hệ mỗi cách", số/mã là ví dụ dựng (HĐ 4721 · ví dụ, Tình huống dựng): phù hợp brief ở mức chữ; chưa xem hình để kiểm trong video.

Việc còn lại cho lần QC có quyền Bash (chưa làm, không được coi là đạt): qc-video, qc-publish, trích khung 0,1/0,5/1,1/1,7 s, frame 59/60, 539/540, 701/702, C11 27,95–30,35 s, C12 30,35–33,3 s, bìa 180×320, ranh giới cảnh 360×640, hộp chữ phụ đề, nhãn AI trong video, silencedetect (khoảng lặng, đuôi), kiểm `shrug` 27,95 s, không pixel C10 trước frame 702, 5 câu hỏi người xem lạ, Ba trục KỸ THUẬT / TUÂN THỦ / TRẢI NGHIỆM.

CHƯA KIỂM (không nghe được, không đưa âm thanh vào mô hình): phát âm "pa-ti-sần", "a-kai-v", "ét kiu eo"; độ tự nhiên giọng; độ dính giữa các lời mỏng (0,007–0,34 s); độ lớn SFX; đuôi 0,131 s có cắt gắt không.

**Bổ sung cùng lần chạy (phiên QC chính):** `node tools/qc-video.mjs final/IT-T4-E01_9x16.mp4 --min 15 --max 40` chạy được và là số QC tự đo duy nhất của lần này: `pass: true`, `fails: []`, `warns: []`, 33,3 s, 2,4 MB, h264 1080×1920 yuv420p, aac 48 kHz, 30 fps, mean −13,6 dB, max −1,8 dB, −14,35 LUFS, LRA 1,6, true peak −1,83 dBTP. Lệnh gộp còn lại (qc-publish, silencedetect, trích khung bằng ffmpeg) bị từ chối tự động vì phiên nền không có người duyệt quyền, nên 0 khung từ MP4 được xem. Số đo máy đạt không phải phán quyết QC: ba trục KỸ THUẬT / TUÂN THỦ / TRẢI NGHIỆM và 5 câu hỏi người xem lạ vẫn chưa kết luận, video giữ `review`.

## QC — lần 1 (Claude, live) — 18/11/2026

Chạy trực tiếp trong phiên có người duyệt quyền (việc nền #19 không chạy được ffmpeg). Tự đo và tự mở khung từ MP4 thật; không đưa âm thanh vào mô hình. Khung trích để ở `assets/_scratch/qc1/` (không ở `final/`). Lưu ý công cụ: contact sheet dùng bộ lọc `fps` lệch thời điểm 0,3–0,6 s so với mốc đặt; mọi đối chiếu phụ đề/pose đều dùng khung đơn `-ss` (đã kiểm 26,75 / 27,3 / 27,45 / 27,7 / 30,2 / 30,4 s: phụ đề cháy khớp `captions.srt`).

### Số đo (tự chạy)
- `node tools/qc-video.mjs … --min 15 --max 40`: `pass: true`, `fails: []`, `warns: []`. 33,3 s, 2,4 MB, h264 1080×1920 yuv420p, 30 fps (999 khung), aac 48 kHz mono 152 kbps; mean −13,6 dB, max −1,8 dB, **−14,35 LUFS, LRA 1,6, true peak −1,83 dBTP** (mục tiêu ≈ −14 LUFS, ≤ −1,5 dBTP: đạt).
- `node tools/qc-publish.mjs final/publish.json`: `pass: true`, `fails: []`, `warns: []`. Đủ TikTok/Facebook Reels/YouTube Shorts; hashtag 4/4/5; câu khai báo AI có trong cả ba mô tả; nguồn PostgreSQL/MySQL/Oracle.
- `silencedetect` trên MP4 cuối: khoảng lặng dài nhất **0,550 s** (27,03–27,58 s, giữa hai câu lời 12; lúc đó khối tệp thứ hai đang trượt vào: hình đổi) < 0,8 s; **không có lặng ≥ 0,8 s**. Đuôi im **0,123–0,131 s** (33,177–33,300 s) ≤ 0,7 s. Biên tiếng khớp bảng RESCUE (lời 2 dứt 4,783 s; lời 5 dứt 12,835 s; lời 8 dứt 18,895 s; lời 12 dứt 27,027 s; lời 13 câu 2 từ 32,118 s).
- Đã mở xem thật **18 khung đơn nguyên cỡ** (0,5; 1,7; 2,1; 4,8; 8; 12; 17,9; frame 539; frame 540; 18,1; 23,3; frame 701; frame 702; 23,5; 28; 29,5; 31; 33,2 s) **+ 5 contact sheet 360×640** (10–13, 13–17, 18–23, 23–30, 30–33 s) **+ 3 montage** (đối chiếu phụ đề 26,75–30,4 s; C02 3,2–4,7 s; 8,7–9,8 s) **+ bìa 180×320**. Đo thay đổi hình bằng so khung 10 fps ở 360×640, vùng vật chính (y≈240–870).
- Mục (a)–(g) Producer chưa ghi, QC tự đối chiếu: (a) `read_paper` ở 27,7 s, `shrug` ở 28,0 s, `thumbs_up` ở 30,4 s (shrug 27,95 → thumbs_up 30,35 = 2,40 s) đúng storyboard APPROVED. (b) cue 8 = 17,700–18,890 s, frame 540 (18,000) cách đầu cue 0,300 s, phụ đề giữ nguyên vị trí khi đổi bố cục. (c) lời 2 bản rút gọn, dứt 4,782 s < 4,9 s. (d) `captions.srt` và phụ đề cháy ở 12 s đều giữ "xoá". (e) hộp phụ đề cháy: các dòng đã xem nằm trong x≈138–942 (trong 100–980), y 860–1090, không đè vật chính/đầu Cáo. (f) frame 701: chỉ có nhãn "Chuyển nơi lưu", cửa hé xám, KHÔNG có "Kho lưu", T1, "HĐ 4721"; frame 702 (23,4 s) mở vòng lộ "Kho lưu" + T1 + HĐ 4721, cue 11 bắt đầu 23,400 s. (g) không có lần dời ±0,08 s: các đầu cue = bảng RESCUE.

### 3 kết luận
**KỸ THUẬT: ĐẠT** (phần đo/xem được). Thông số, âm lượng, khoảng lặng, đuôi, mốc neo (frame 60/540/702), phụ đề đồng bộ, đủ dấu, vùng an toàn y∈[250,1500] (nhãn "Kho lưu"/"Chuyển nơi lưu" y≥250; thẻ kết y≥370; Cáo đáy ≤ 1500; nhãn "AI tạo" y 1430–1490) đều đạt. `final/` đúng 4 tệp, không file lạ. **CHƯA KIỂM — chờ giám đốc nghe:** phát âm "pa-ti-sần", "a-kai-v", "ét kiu eo"; độ tự nhiên các lượt tạo lại (06-4, 07-2, 11-4, 13-3); độ dính giữa các lời mỏng (1→2 cách 0,007 s; 7→8 0,068 s; 11→12 0,067 s); độ lớn ba hiệu ứng tự tạo (0 / 15,7 / 23,4 s; click 15,7 s có trùng tiếng lời 7 không); đuôi 0,13 s có cắt gắt không.

**TUÂN THỦ: ĐẠT.** Nhãn "AI tạo" có ở mọi khung đã mở; "Tình huống dựng" (hook) và "HĐ 4721 · ví dụ" (13–18 s) có; câu khai báo AI trong cả ba mô tả + `ai_generated_content=true`; không nhạc, không logo/watermark; không nguồn ngoài (nền/đạo cụ vẽ Pillow, Cáo từ `brand/cao/poses/` được miễn ghi `library/LICENSES.md`, giọng VieNeu-TTS cục bộ, hiệu ứng tổng hợp) nên không thiếu dòng sổ nguồn; khẳng định kỹ thuật ("partition không tự xoá/nén", "archive không phải lệnh SQL chuẩn, mỗi hệ mỗi cách") khớp phần nguồn đã duyệt, giới hạn "chưa đối chiếu ISO/IEC 9075" đã ghi ở script. Nit chính tả không chặn: "xoá" (lời 5) và "xóa/hóa" (metadata, hình) khác kiểu đặt dấu.

**TRẢI NGHIỆM: ĐẠT CÓ GHI CHÚ (không có lỗi chặn).** Hook tình huống + ích lợi trước giây 5 + câu hỏi mở 17,7 s → trả 23,4 s + câu chốt hiển thị + CTA đều có. Điểm yếu thật, chưa vi phạm ngưỡng nhưng sát: (1) 3,1–4,9 s (C02): chỉ có ba thanh trượt trong khay nhỏ ở góc T6 (≈45×30 px ở 360×640; đổi ≈130–290 px/0,5 s trên vùng chính 75.600 px); pose đổi không tính; (2) 10–13 s (C05): bó thẻ trượt ≈ 40 px ở 360×640, hình đổi nhỏ (0,6–4 nghìn px/0,5 s); (3) 27,6–28,6 s và 29,1–30,3 s (C11): gần như tĩnh (≈0,1–0,2% vùng chính, chỉ tick ray/môi khe; giấy trượt rõ ở 28,7–29,4 s); mỗi đoạn dưới 1,5 s nên chưa phạm R4; (4) 18,0–19,0 s: nền hành lang tương phản rất thấp so với nền video, vật chính là thẻ 72×64 px; (5) nhãn "Kho lưu" hiện cùng lúc lời "Ở kho lưu!" và chip "tháng"/"khách" trùng từ khoá lời (nhãn sơ đồ, không chép cả câu): chấp nhận; (6) khối tệp thứ hai 26,4–30,3 s không có nhãn trên hình (chỉ phụ đề nói "archive/mỗi hệ mỗi cách"): ai tắt cả tiếng lẫn phụ đề sẽ không hiểu đoạn này; (7) bìa và đồ hoạ 10 s đầu không nêu tên chủ đề (đúng thiết kế "không tagline"); "Partition" lần đầu ở phụ đề 10,0 s, "SQL" lần đầu ở phụ đề 27,6 s, tên khái niệm lần đầu lên đồ hoạ ở 30,35 s; (8) R5: vật chính cảnh kết (thẻ + biểu tượng) y 370–850 = 480 px (≈38% vùng an toàn) thấp hơn "≥ ~560 px"; plan ghi 250–850 (600 px) nên số đo thật thấp hơn plan; cụm 18–23,4 s tính cả nhãn là 600 px nhưng riêng panel/cửa là 520 px. Các điểm này ghi để giám đốc cân nhắc, không đủ để chặn ready và không phải lỗi sửa được bằng dựng lại.

### 5 câu hỏi người xem lạ
1. 3 giây đầu — **Đạt**: 0–2,2 s thấy tin "Vào họp rồi!" + phiến "Đơn hàng" tiến trình chậm + Cáo hoảng + phụ đề "Sếp đợi báo cáo, bảng đơn hàng vẫn chạy!"; biết vì sao cần quan tâm (báo cáo kẹt). Ghi chú: chưa thấy tên SQL/Partition trong 10 s đầu.
2. Ích lợi trước giây 5 — **Đạt**: lời 2 "Chia theo tháng, máy bỏ qua được phần không cần." dứt 4,782 s; hình lưới T1–T6, T6 xanh, năm khối xám.
3. Mỗi cảnh một ý; tắt tiếng hiểu phần chính — **Đạt, có điều kiện**: 12 cảnh mỗi cảnh một tiêu điểm (T6 chọn → nhánh vàng khách chưa loại → T1 ra/vào → T1 sang hành lang/tìm trống → thẻ chuyển → cửa → T1 + HĐ 4721 trong kho → hai cách lưu → hai thẻ kết); phần "archive không phải lệnh chuẩn" (26,4–30,3 s) chỉ hiểu nhờ phụ đề.
4. Hình đổi ở 360×640; chữ chép lời? — **Đạt, có điều kiện**: không khoảng ≥ 1,5 s nào hoàn toàn không đổi vùng vật chính (đoạn tĩnh nhất ≈ 1,0–1,4 s ở 3,5–4,9 / 27,6–28,6 / 29,1–30,3 s) nhưng các đoạn đó đổi rất nhỏ (xem ghi chú 1–3). Chữ trên hình không chép lời (hook, "Nhận rồi!", mã T, "Ví dụ", hai thẻ kết ≠ lời); trùng từ khoá nhẹ ở "tháng/khách/Kho lưu".
5. Kết + bìa — **Đạt**: hai thẻ "Partition: chia bảng" / "Archive: cất dữ liệu cũ" đủ chữ 30,35–33,3 s + CTA nhẹ "Bảng bạn chia theo cột nào? Chưa chia thì gõ 'chưa'."; đuôi im 0,13 s; `thumbnail.jpg` 1080×1920 là khung hook (tin sếp, "Tình huống dựng", "Đơn hàng", Cáo, "AI tạo"), mở 180×320 đọc được tin + nhãn tình huống. Đuôi 0,13 s có cắt gắt không: **CHƯA KIỂM** (cần nghe).

### Phán quyết: PASS các phần đã kiểm → `ready`
Không có lỗi FAIL, không có lỗi dựng sửa được, không có lỗi thiết kế vượt ngưỡng. Còn **CHƯA KIỂM**: toàn bộ phần nghe (phát âm, giọng, độ dính lời mỏng, SFX, đuôi). Giám đốc nghe trước khi đăng.

### Bài học cho luật
- R4: `main_change` chỉ ghi "ra/vào/đường nối" mà không có cỡ tối thiểu thì vẫn lọt các đoạn đổi ≈0,2–0,5% vùng chính ở 360×640 (C02, C05, C11); nên có ngưỡng đo (ví dụ ≥ ~60 px dịch chuyển hoặc ≥ ~3% vùng chính ở 360×640) thay vì chỉ "nhìn thấy".
- R5/plan: ghi hộp bao vật chính đo thật (không gồm khoảng trống/nhãn); cảnh kết thực tế 480 px so với 600 px trong plan.
- QC: không dùng contact sheet `fps` để khẳng định thời điểm phụ đề/pose (lệch tới 0,6 s); dùng khung đơn `-ss`.

