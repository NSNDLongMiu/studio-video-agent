
## Rescue — quyết định (Claude, 21/11/2026)

Nguyên nhân gốc: storyboard APPROVED (bản 2) lệch plan ở 4 điểm mà không ghi chênh lệch. Đã đồng bộ (storyboard.json status vẫn APPROVED; chi tiết ở storyboard.md mục "Claude rescue sửa"):
1. **Cáo S11: giữ.** Thêm pose `idea` ≈170 px, x≈100, đáy y=1290, ngoài mặt đồng hồ, cục bộ 0,40–2,80 s (character_action, props, animation_timeline, semantic_plan.keywords). Tổng Cáo 11,0/62,8 s = 17,5% (Y2–Y3 đạt). Lý do: plan/script nêu rõ và lời "Đừng đoán, thử đi" cần người dẫn.
2. **S02 surprised:** chấp nhận bản storyboard (sleep 0–2, surprised 2,0–3,2 s, Cáo rời ở cú cắt hông máy 3,20 s). Chênh lệch với plan (đến 5,6 s) được chấp nhận để nhường diện tích cho nút gạt.
3. **Ranh giới S07/S11:** bảng cảnh storyboard (S07 24,0–32,5; S11 50,5–55,0; tổng 62,8 s) là chuẩn dựng. Mốc lời trong script/plan chỉ là ước lượng; Producer đo lại sau TTS, neo hình vào lời, báo nếu vượt 72 s (gộp S10–S11/bỏ S09). Pose idea căn lại theo mốc lời 16.
4. **Hook:** luật hiện hành `voice_start_min_s`=0,6 (`tools/config/pipeline-rules.json`). Đổi L01 `pause_before_s` 0,10→0,60 và `pause_after_s` 0,55→0,20 (L02 vẫn kết thúc trước 3,2 s). Tiêu đề chữ vẫn bật ở 0,10 s (chữ, không phải lời); hệ quả ô họp hiện 2,05 s < 5 s.
Không kiểm được schema bằng lệnh (Bash bị từ chối); các sửa chỉ thêm trường chuỗi/mảng có sẵn, giá trị số hợp lệ. Việc Producer: `/produce IT-T18-E01 --force`; pronounce.mjs còn unknown (rung, danh, iPhone, iOS, twenty, seven, Android, app) cần khai vào `tools/voice/pronunciation.json` hoặc để Producer xử lý theo Y8.

## Rescue — quyết định chốt (Claude, 21/11/2026, lần chốt dứt điểm chữ trên hình)

**Nguồn sự thật duy nhất: `storyboard.json` APPROVED** (visual-director đã duyệt, status giữ nguyên APPROVED, không sửa JSON). Lý do theo Y1/R22: chữ chỉ là keyword/nhãn UI gắn đối tượng, không chép lời; storyboard đã ở 42 từ/phút-ngoài-tiêu đề ≈ 40,1 từ/phút (trần R22 = 45), thêm `& CẢNH BÁO` (+1–2 từ) và `TUỲ MÁY · TUỲ APP` (+3 từ) sẽ dồn sát/vượt trần và làm chật cột tím S07/S09. Tên đầy đủ "Nhạc chuông và Cảnh báo" đã nằm ở lời đọc; giới hạn "tuỳ app" đã có hình (viền vàng, công tắc tắt, chấm "?") và nhãn `TUỲ MÁY` ở S08 liền trước. Script.md, plan.md, storyboard.md đã sửa khớp.

| Cảnh | Chữ chính xác hiện trên hình | Vị trí |
|---|---|---|
| S07 | `CHUÔNG` (một dòng) · `iOS 27: TÁCH ĐƯỢC` (vàng) | `CHUÔNG` gắn đầu thanh gốc, từ 26,30 s; `iOS 27: TÁCH ĐƯỢC` gắn thanh thứ hai sau khi tách, từ 27,90 s; header `BÁO THỨC / ÂM BÁO` ô trái trên. Không có chữ `CẢNH BÁO` trên hình. |
| S09 | `BÁO THỨC VÀ LỜI NHẮC` (nhãn UI mục quyền) | Gắn hàng mục có công tắc, từ ≈ 40,20 s; công tắc tắt + viền vàng + chấm "?" thay nhãn điều kiện. Không có chữ `TUỲ MÁY · TUỲ APP`. Header ô trái trên. |

Rà các cảnh khác: lệch còn lại duy nhất là nhãn `IPHONE` ở S02 trong script (storyboard chỉ có `IM LẶNG ≠ TẮT`): chốt theo storyboard, đã xoá `IPHONE` khỏi script. S01, S03–S06, S08, S10–S12 khớp (`ÂM BÁO`, `KHÔNG CÓ`, `CÓ ÂM`, `CHỈ RUNG`, `VIDEO`, `BÁO THỨC`, `ANDROID`, `TUỲ MÁY`, `KHÔNG LÀM PHIỀN`, `ÂM LƯỢNG`, `+1 PHÚT`, `THỬ ĐI, ĐỪNG ĐOÁN`). Ghi chú: mốc giây trong bảng chữ của script chỉ là ước lượng; Producer neo theo TTS và bảng cảnh storyboard.

Lời đọc không đổi nên 18 dòng VieNeu đã sinh (timeline free 51,30 s) giữ nguyên.

**Sản xuất dựng đúng theo mục này; không escalate lại vì khác biệt chữ S07/S09.**

## Producer — vướng duyệt đầu vào

Storyboard JSON APPROVED bỏ pose idea ở S11 (character_action trống, props/timeline không có Cáo, storyboard.md chỉ tính S00/S05/S12), trong khi plan và script yêu cầu Cáo chỉ đồng hồ 50,00–52,40 s. Storyboard còn đổi ranh giới S07/S11 và rút pose surprised khỏi S02 so với plan. Hook 0,10 s cũng xung đột ngưỡng R26 0,60 s được chính storyboard.md ghi cần chốt với Claude. Đề nghị Visual Director và Claude đồng bộ bản duyệt: nếu giữ Cáo S11, thêm pose idea nhìn đồng hồ, rộng ~170 px, đáy ≤1290, đặt ngoài mặt đồng hồ; chốt lại mốc theo timeline dựng và xác nhận mốc hook.

Đã đối chiếu plan.md, script.md, storyboard.json và storyboard.md. Đo tổng duration_s trong JSON được 62,80 s. approved.json có images rỗng và cho phép dùng nền có sẵn. Chạy node tools/voice/pronounce.mjs check trên cột Lời đọc. Mã thoát 1, mục unknown gồm rung, danh, iPhone, iOS, twenty, seven, Android, app. Chưa sinh giọng hoặc dựng. Chưa có kết quả QC.


## Producer — cần chốt chữ trên hình S07 và S09

- S07: cột “Chữ trên màn hình” trong script.md ghi `CHUÔNG & CẢNH BÁO`. storyboard.json chỉ khai `CHUÔNG`. storyboard.md mô tả việc rút nhãn nhưng mục Rescue chưa chốt ngoại lệ cho Y1. Đề nghị đồng bộ hai tệp theo một nhãn đã chốt. Có thể bố trí nhãn đầy đủ trên hai dòng ngay trên thanh gốc để giữ cỡ chữ.
- S09: plan.md (mục rủi ro quyền Android) và script.md yêu cầu nhãn `TUỲ MÁY · TUỲ APP` bên công tắc. storyboard.json chỉ khai `BÁO THỨC VÀ LỜI NHẮC`. Đề nghị thêm nhãn vàng cạnh công tắc, hoặc cập nhật plan/script nếu Claude duyệt cách diễn đạt bằng hình đã ghi trong storyboard.md.

Đã đối chiếu trực tiếp plan.md, cột chữ của script.md, semantic_plan.texts của storyboard.json, storyboard.md và quyết định Rescue ở trên. Đã kiểm âm vị (mã 0) và sinh đủ 18 dòng VieNeu. Đo từ generation.json: phần lời 36,53 s, đệm khai báo 60 ms trước và 140 ms sau mỗi dòng. Timeline free dài 51,30 s; đây là số đo sơ bộ, cần căn theo ba pha opening và các khoảng giữ khi chốt timeline sản xuất. Phát âm, nhịp và độ tự nhiên CHƯA KIỂM — giám đốc nghe. Chưa dựng, chưa có thành phẩm hoặc kết quả QC video.


## Producer — bản dựng IT-T18-E01

- Dùng storyboard APPROVED và Pillow+FFmpeg ở 1080×1920, 30 fps. Cảnh mở giữ ba pha 0–3,20 / 3,20–5,60 / 5,60–8,00 s. Bản hình trước phụ đề ở `assets/_scratch/picture.mp4`. Hình phòng ngủ tối và ban mai, giao diện, sơ đồ và lớp phủ vẽ bằng Pillow. Chữ dùng text engine của xưởng. Pose sleep, surprised, shrug, idea và thumbs_up lấy từ `brand/cao/poses`. `assets/gen/approved.json` khai danh sách rỗng.
- Dùng lại 18 dòng VieNeu đã sinh theo prosody plan. `pronounce check` và kiểm âm vị đều đạt. Ghép bằng `assemble.py` theo `assets/voice/production-timeline.json`. `splice.py check` trên track 62,80 s trả `[]` (0 vi phạm). Cửa sổ đề xuất chừa 60 ms trước, 140 ms sau từng câu. Dịch ranh giới S08–S09 từ 39,50 tới 39,70 s để giữ đệm và nhịp Android. Đuôi theo mốc lời khoảng 0,88 s, dùng cho nhịp chốt/bong bóng và tắt hình đã duyệt ở S12.
- Trộn bằng cue sheet và `mix.py`, giữ bốn stem, nhạc tắt. Báo cáo mixer đo −14,2 LUFS và −1,75 dBTP. Cuesheet áp giới hạn mật độ nên chỉ giữ tiếng chuông tổng hợp ở S11 cho nhịp thử. S12 nối tiếp bằng cung loa ở điện thoại và hình phòng ban mai.
- Y1 chữ dựng từ semantic plan và phụ đề một lớp riêng. Y2/Y3 Cáo ở opening, S05, S11 và S12, khoảng 11 giây trên 62,8 giây. Y4 nền theo phòng ngủ, giao diện sáng, lưới navy và bảng tím. Y5 trả lại điện thoại và lịch họp ở S12, đổi trạng thái loa. Y6/Y7 xem số đo `assets/voice/metrics.json` và cửa sổ lời. Y8 xem bảng âm vị và clip mẫu dưới đây.

| Thuật ngữ | TTS | Âm vị kiểm | Clip trong assets/voice/term-check | Nguồn |
|---|---|---|---|---|
| iPhone | iPhone | ˈaɪ fˈoʊn | iphone.wav | riêng |
| iOS | eye oh ess | ˈaɪ ˈoʊ ˈɛs | ios.wav | riêng |
| twenty seven | twenty seven | twˈɛnti sˈɛvən | twenty-seven.wav | riêng |
| Android | Android | ˈændɹɔɪd | android.wav | riêng |
| app | app | ˈæp | app.wav | riêng |

### needs_manual_review

- Độ tự nhiên, nhịp cảm nhận và phát âm giọng: **CHƯA KIỂM — giám đốc nghe**.
- Độ êm của SFX và chuyển âm: **CHƯA KIỂM — giám đốc nghe**.
- Sức hút opening và logic mạch kể: **CHƯA KIỂM**.

### QC kỹ thuật

- `ffprobe`: 62,800 s · 1080×1920 · 30 fps · H.264 yuv420p + AAC 48 kHz.
- `qc-video`: PASS, 0 lỗi. MP4 đo −14,93 LUFS, −1,90 dBTP sau khi hạ mức ở lần mã hóa AAC thêm 0,65 dB. Hai cảnh báo chuyển động: S09 giữ bảng quyền để đọc quan hệ giữa công tắc và loa, S12 giữ khung trả bài và lời mời phản hồi. Đoạn tĩnh dài nhất 1,50 s, tỷ lệ tĩnh 22,81%. Lần xuất đầu đã thử mux sớm khi FFmpeg còn ghi bản hình và báo `moov atom not found`. Xuất lại sau khi FFmpeg đóng tệp thành công.
- `qc-publish`: PASS, 0 lỗi và 0 cảnh báo. Kiểm tên nền tảng trong nội dung đăng, SRT, scenes.json và storyboard: 0 khớp.
- Mở khung đầu, giữa, cuối ở 360×640 và bìa hook ở 180×320. Đọc được chữ đủ dấu, bìa lấy ở 1,60 s. SRT có 22 cue, tối đa 2 dòng và 28 ký tự/dòng.
- Gói giao trong `final/`: `IT-T18-E01_9x16.mp4`, `thumbnail.jpg`, `captions.srt`, `publish.json`.

### Đối chiếu phát hiện Audio / Visual / Narrative

- Giữ các khoảng đọc hình theo storyboard. Hai khoảng nghỉ dài nhất là sau lời cuộn chọn nhầm ở S05 (điểm chọn chuyển về màn chỉnh, luồng dừng tại hàng đỏ) và sau lời so mức âm ở S06 (hai cột giữ mức khác nhau, cung loa tiếp tục). Các cờ lệch pause dùng mốc kế hoạch giọng; bản dựng dùng các mốc production và giữ các điểm đổi hình.
- Cuesheet bỏ đuôi chuông S12 vì lặp cùng họ hiệu ứng trong khoảng cách tối thiểu, và bỏ các nhịp phụ vì mật độ. Một số cue kế hoạch không có dấu neo trên từng đối tượng trong render log. Mixer đo onset từ stem; độ êm và độ khớp cảm nhận vẫn cần nghe trực tiếp.
- Header một dòng chủ đề theo storyboard APPROVED. Công cụ có thể yêu cầu cả trường title của mẫu header chung. Từ khoá được gắn theo storyboard bằng vị trí cạnh thẻ, thanh trượt và biểu tượng; nhật ký vẽ tay chưa có bbox đích riêng cho từng nhãn. Các icon phi văn bản cần đối chiếu với bản hình để xem quan hệ có rõ hay không.
- Lệch đầu/cuối câu ở mức nhãn từ khoá cần đối chiếu bằng mắt và tai. Phép đo thời gian dựa trên cửa sổ câu; hiệu ứng highlight trên từ khoá và chuyển động đồng hồ là bằng chứng hình. Báo cáo độc lập và ảnh đối chiếu nằm ở `assets/_scratch/qc-auto/`.

- `qc-measure` bản giao: 0 lỗi, 151 cảnh báo, `final_pass_allowed: false` cho đến khi có duyệt thủ công. Opening đạt bốn phép đo bố cục/pha, thời lượng, lời và tiêu đề. Đo biên giọng 0/18 có cờ. Các nhóm cảnh báo còn lại tập trung vào mẫu header yêu cầu dòng thứ hai (72), độ lệch khoảng nghỉ so với prosody plan (17), nhãn chưa có bbox đích riêng (14) và từ khoá biểu đạt bằng hình/nhãn chưa được máy ghép (12). Các cờ còn lại gồm đổi ô header, bằng chứng cue, nhịp nói/giữ, tỷ lệ kinetic và độ trùng từ giữa nhãn với lời. Bảng phát hiện theo mốc và ảnh đối chứng nằm trong `assets/_scratch/qc-auto/report.md`.
- Đã sửa mã vẽ và tái render để các bản ghi pha, chữ và header mới khớp khung hình. Khung 4,40 s và 7,25 s của MP4 giao đã được mở lại để kiểm tra chữ và biểu tượng. Cảnh báo đuôi im đo khoảng 0,93 s, giữ theo nhịp chốt S12 đã nêu trên.

## QC — Claude (21/11/2026)

Đo độc lập: `node tools/qc-measure.mjs ep01 --baseline docs/baseline/T5-qc-auto.json` (hồ sơ standard) → 202 phát hiện, 151 cảnh báo, **0 lỗi** (`qc-video` nằm trong lệnh này). Báo cáo + ảnh: `assets/_scratch/qc-auto/report.md`. Gemini xem trước: **Gemini vắng** (không chạy lượt này; QC xem khung bằng mắt). Đã xem: 4 board (32 khung 2 s), header-zones, thumb-180x320, khung 30 s và 43 s full-res, camera/scene/textheavy theo danh sách.

### Kết luận ba trục
- **KỸ THUẬT: ĐẠT có lỗi dựng nhỏ.** 1080×1920, 30 fps, h264/yuv420p + aac, 62,8 s (trong 45–75), mix −14,27 LUFS / −1,75 dBTP (MP4 −14,93 LUFS), 0 mẫu clip, nhạc tắt, đuôi im 0,931 s (> 0,7 s, ngoại lệ do Producer ghi nhịp chốt S12). Biên giọng 0/18 câu có cờ cắt cụt. Lỗi dựng: QC-01, QC-02 (chữ/icon chồng, chữ tràn khung).
- **TUÂN THỦ: ĐẠT.** Luật 10: grep `facebook|youtube|zalo|tiktok` trên `captions.srt`, `assets/scenes.json`, `storyboard.json` = 0 khớp; khối đăng trong `publish.json` không có tên thật (chỉ khoá nền tảng); không thấy hình đồ ăn/dép trong 32 khung. `publish.json` đủ 3 nền tảng (title/mô tả/hashtag), `ai_generated_content: true` + câu khai báo AI, không nhãn AI đốt lên hình. `captions.srt`, `thumbnail.jpg` có mặt; `final/` đúng 4 tệp. Nguồn: `assets/gen/approved.json` images rỗng, không ảnh Gemini/ngoài trong video (pose Cáo + hình Pillow của xưởng). Khẳng định "iOS 27: TÁCH ĐƯỢC" **có nguồn xác thực**: Apple iPhone User Guide iOS 27 (support.apple.com/guide/iphone/change-sounds-and-vibrations-iph07c867f28/27/ios/27), script.md mục nguồn 2 và 6 (9to5Mac 08/06/2026), plan.md hàng rủi ro "iOS 27 chưa phải máy nào cũng có", Claude đã tự mở nguồn ở review/script-r1.md; liệt kê trong `publish.json.sources`. Lời không đổ lỗi hãng; Android hedge "Tuỳ máy… nếu chưa cho phép"; không khẳng định lỗi phiên bản. Lưu ý nhỏ: chữ trên hình chỉ nói "iOS 27: TÁCH ĐƯỢC", điều kiện "tuỳ phiên bản" chỉ ở màu vàng/lời (chấp nhận theo chốt Rescue).
- **TRẢI NGHIỆM: CHƯA KẾT (nhiều mục CHƯA KIỂM — giám đốc nghe/duyệt)**; thiên về đạt ở hook và mạch kể, có hai mối lo nhịp (QC-05, QC-06).

### Bảng phát hiện của QC (mốc, bằng chứng)
| Mã | Nhóm | Mốc | Bằng chứng | Mức | Đề nghị |
|---|---|---|---|---|---|
| QC-01 | KỸ THUẬT · R3/Y1 | S07 ≈ 28–32,4 s (đo ở 30 s) | Biểu tượng đồng hồ + đồng hồ cát nằm chồng lên chữ «iOS» trong nhãn vàng «iOS 27: TÁCH ĐƯỢC»; cung sóng loa cắt viền khung vàng. `claude-30.png`, `board-02.png` (khung 5–8), `board-03.png` khung 1; công cụ không bắt (text_overlap = 0, chỉ cặp chữ-chữ) | LỖI DỰNG | Dời cụm icon xuống/trái khỏi dòng nhãn (hoặc đặt nhãn cao hơn), giữ khe ≥ 24 px; thu sóng loa vào trong khung |
| QC-02 | KỸ THUẬT · R3 | S09 ≈ 41,4–44,5 s (đo ở 43 s) | Nhãn «BÁO THỨC VÀ LỜI NHẮC» rộng đúng bằng ô (x 207–865 so với viền 205–863), chữ «C» chạm viền, chấm vàng đè lên «C». `claude-43.png`, `textheavy-S09.png`, `board-03.png` khung 6–7 | LỖI DỰNG | Thu cỡ chữ hoặc nới ô, chừa lề ≥ 24 px mỗi bên, dời chấm |
| QC-03 | KỸ THUẬT · R3 (nhẹ) | S08 ≈ 36,2–39,4 s | Nhãn «KHÔNG LÀM PHIỀN» đè lên mép dưới thân máy (board-03 khung 4) | cảnh báo | Đặt nhãn hẳn trong hoặc hẳn ngoài viền máy |
| QC-04 | TRẢI NGHIỆM · R5/Y1 | S12 57,9–62,7 s | Khung chữ chốt «THỬ ĐI, ĐỪNG ĐOÁN» che đỉnh điện thoại và một phần cửa sổ (`board-04.png` khung 6–8); vẫn đọc được ở 360×640 | cảnh báo | Chấp nhận được; nên chừa khe giữa khung chữ và máy |
| QC-05 | TRẢI NGHIỆM · Y7/R4 | 16,29–19,37 s và 21,03–24,17 s | Lặng 3,08 s và 3,15 s (M-06, M-07; kế hoạch 0,6 và 0,4 s, lệch +2,48 và +2,75 s); 29,67–32,61 s lặng 2,94 s; tỉ lệ lặng 46,6% (baseline T5 34%), có tiếng 33,5 s trên 62,8 s. Hình có chuyển động ở S05/S06 nên không "đứng", nhưng 3 s không tiếng giữa video 63 s dễ cảm giác hụt hơi | cảnh báo | Giám đốc nghe và quyết; nếu chậm: rút khoảng nghỉ L07→L08, L08→L09 về ≈ 1,2–1,5 s rồi bù bằng giữ hình |
| QC-06 | TRẢI NGHIỆM · Y6 | toàn video | Tốc độ đọc trên WAV giọng gốc 4,922 âm tiết/s, trên dải thử 4,6–4,8 (M-27, vượt 2,5%); trên MP4 4,815; +28,3% so với T5 (kỳ vọng +10–15%). Số đo, chưa nghe | cảnh báo | CHƯA KIỂM — giám đốc nghe |
| QC-07 | Y1 (SRT) | 9,88–12,6 s; 24,17–26,61 s | Cue 6/7 và 10/11 tách mảnh "rung." / "báo." một từ | thông tin | Gộp lại ngắt dòng trong một cue |
| QC-08 | R22 | toàn video | Kinetic 0,796/25 s (cần ≥ 1; M-114); 43,9 từ chữ minh hoạ/phút (trong 20–45); keyword có hình 100%; cảnh có chữ vẽ thật 100%; header phủ 100% | cảnh báo | Thêm một hiệu ứng kinetic có chủ ý nếu sửa dựng |

### Cảnh báo đã loại trừ (có lý do)
- M-35…M-106 (72 cảnh báo R21 "header_title thiếu chữ trong bbox"): header vẽ là một dòng «BÁO THỨC / ÂM BÁO» theo storyboard APPROVED, đo coverage 100%, cỡ chữ đọc rõ; mở `header-zones.png` + 8 ô của board: header ở vùng an toàn trên, không che Cáo/phụ đề/sơ đồ. Cảnh báo là do mẫu header yêu cầu dòng thứ hai (đã ghi ở Producer). Không phải lỗi hiển thị.
- M-107…M-113 (đổi ô header): board cho thấy đổi trái/phải tại ranh giới cảnh, không thấy hai header cùng hiện; độ mờ chuyển CHƯA KIỂM bằng nhìn động.
- M-115…M-149 (keyword/nhãn "thiếu chữ", "thiếu bbox"): phần lớn là biểu đạt bằng hình/icon (storyboard khai connection/flow/animation); thiếu bbox là hạn chế của render-log; keyword «Cáo» do Cáo hiện hình. Nhãn thuật ngữ gọi tên đã có chữ ở S04/S06/S07/S08/S09/S10.
- M-32/M-33/M-150 (chữ lặp lời): «ĐÚNG GIỜ, CHỈ RUNG» là câu hook ngắn có chủ ý (thông tin); «BÁO THỨC VÀ LỜI NHẮC» là tên mục UI thật, không chép cả câu (chấp nhận, cảnh báo thấp).
- M-18 (cue 2 dài 0,744 s so với ngưỡng 0,8): "Họp bắt đầu rồi!" là câu giật mình ngắn có chủ ý.
- M-151…M-185 (lệch nghỉ so với prosody plan): lệch do Producer neo hình theo TTS (ghi trong notes); trừ QC-05 giữ lại để người nghe quyết.
- M-195…M-200 (cue SFX không gắn hình): 6/9 cue onset đạt (sai số ≤ 0,02 s), cue chỉ là tiếng nền; độ êm CHƯA KIỂM.
- M-01, M-02, M-29…M-31 (cảnh ít chuyển động / giữ sau lời): S09 (72% tĩnh) và S12 (65% tĩnh) giữ để đọc quan hệ công tắc–loa và khung trả bài; đoạn tĩnh dài nhất 1,5 s (< 2 s); S11 dài 4,5 s, S09 4,8 s (dưới ngưỡng thử 5 s) nhưng mỗi cảnh một ý đơn giản. M-29 (S00 giữ sau lời 0,524 s) nhẹ.
- M-04, M-05, M-08…M-16 (khoảng lặng 0,8–2,4 s): có chuyển động hình khớp board; không loại QC-05.

### So với bản chuẩn T5 (--baseline)
| Chỉ số | T18 | T5 | Δ |
|---|---|---|---|
| Thời lượng (s) | 62,8 | 44,633 | +18,167 (khác chuẩn 45–75, hợp lệ) |
| Số cảnh / TB cảnh (s) | 10 / 6,28 | 18 / 2,48 | −8 / +3,8 |
| Lần cắt / 10 s | 1,433 | 3,809 | −2,376 |
| Tĩnh (%) / đoạn tĩnh dài nhất | 22,6 / 1,5 s | 30,8 / 1,2 s | −8,1 / +0,3 |
| LUFS tích hợp | −14,93 | −14,85 | −0,08 |
| Tốc độ đọc MP4 (âm tiết/s) | 4,815 | 3,837 | +0,979 |
| Tỉ lệ lặng | 0,466 | 0,34 | +0,126 |
| Từ chữ minh hoạ/phút | 43,9 | 79,3 | −35,4 |
| Phụ đề phủ (%) | 58,2 | 80,2 | −22,0 |
| Số cảnh báo | 151 | 16 | +135 (đa số mẫu header/bbox, đã loại trừ ở trên) |

### Rà D6/D7/D8
- **Audio (D6):** tốc độ 4,922/4,815 (QC-06); lặng 46,6%, lặng dài (QC-05); `phonemes.py` đạt mã 0 theo Producer (iPhone/iOS/twenty seven/Android/app có clip trong `assets/voice/term-check`); kéo/nuốt chữ, phát âm, tự nhiên: **CHƯA KIỂM — giám đốc nghe.** Biên câu 0/18 cờ (đo máy), tai nghe CHƯA KIỂM.
- **Visual (D6/D7):** opening riêng đạt (đổi hình 0,1 s, lời vào 0,604 s, pha mâu thuẫn 3,2 s; ba pha 0–3,2/3,2–5,6/5,6–8,0, ảnh `frame-open-*`, `frame-phase-*`); header 100% (QC-03 không liên quan); hình khớp lời: lệch lời–hình lớn nhất 0,071 s; nhãn «CÓ ÂM» S04 10,3 s bị cờ đồng bộ mức câu (M-201) — nhãn ra giữa câu L06, chấp nhận vì sơ đồ hiện đúng nhánh, cần xem động; camera S07/S08/S09 hiệu 6,7–8,4/255 (rất nhẹ, R12 đối chiếu `camera-S07/S08/S09.png`: gần như tĩnh, chuyển động chỉ để hợp lệ chỉ số, không gây hại). Bố cục S07/S09/S10: nửa dưới khung trống để chừa phụ đề, không sai nhưng thưa.
- **Narrative (D6):** 1,59 khái niệm/10 s (9,55/phút) — vừa; mạch hook → thủ phạm "Không có" → ví dụ lỡ tay → âm lượng → iPhone/Android → quyền app → kiểm 10 giây → thử 1 phút → trả hook rất logic; có ví dụ cho phần khó (S05, S11). "Đọc lý thuyết không minh hoạ": không thấy đoạn nào. Logic mạch kể và sức hút opening: **CHƯA KIỂM** (cần người duyệt).
- **D8 R20–R23:** (a) giọng nuốt chữ: 0/18 câu cờ (≤ 10%), tai CHƯA KIỂM; (b) opening đạt; (c) header coverage 100% sau opening, 0 đè; (d0) `text_overlap` công cụ = 0, khe nhỏ nhất 70 px — **nhưng QC-01/QC-02 là chồng/tràn nhìn thấy bằng mắt mà công cụ không bắt** (icon-chữ, chữ-viền); (d) keyword thật: 100% cảnh có chữ vẽ, 43,9 từ/phút, kinetic 0,796/25 s thấp hơn ngưỡng 1 (QC-08).

### 5 câu hỏi người xem lạ
1. 3 s đầu: **Đạt** — «ĐÚNG GIỜ, CHỈ RUNG» + «Đúng giờ, mà chỉ rung?» ở 0,1–3,2 s (`frame-open-start`, `thumb-180x320`).
2. Trước giây 5, thấy hệ quả: **Đạt** — «Họp bắt đầu rồi!» 2,05 s kèm Cáo giật mình, ô họp; hệ quả hiện 2,05 s (< 5 s, đã ghi chấp nhận ở Rescue).
3. Mỗi cảnh một ý, tắt tiếng hiểu: **Đạt phần chính, CHƯA KIỂM đầy đủ** — `nocaption-board.png`/board cho thấy chuỗi hình giải thích được (nút gạt → âm báo → hai nhánh có/không âm → thanh trượt); cần người duyệt tắt tiếng xem.
4. Hình đổi nhìn ra ở 360×640, không chép lời: **Đạt có lưu ý** — 10 cảnh, mỗi cảnh đổi trạng thái bên trong; cảnh ngắn nhất 4,5 s, tĩnh dài nhất 1,5 s (< 2 s); chữ là nhãn, không chép câu (trừ M-33 nhãn UI). Lưu ý QC-01/QC-02.
5. Kết giải quyết, có kêu gọi: **Đạt** — S12 trả đúng phòng/điện thoại S01, loa xanh, «Gõ cho Cáo biết nhé!» (58,2–61,9 s); đuôi im 0,931 s > 0,7 (ngoại lệ Producer ghi); bìa = khung hook ở 1,6 s, đọc được ở 180×320 (`thumb-180x320.png`).

### Y1–Y8
| Mục | Kết luận | Bằng chứng |
|---|---|---|
| Y1 chữ theo kịch bản, không chữ/hình thừa | **Chưa đạt (nhẹ)** | QC-01, QC-02, QC-03; không nhãn «AI tạo»/«Ví dụ dựng» trên hình |
| Y2 Cáo ≤ giới hạn cảnh | Đạt | Cáo ở S00, S05, S11, S12 (≈ 11,0 s = 17,5% thời lượng) |
| Y3 cỡ Cáo | Đạt | 160–180 px theo plan (xem board-01/02/04) |
| Y4 nền theo ngữ cảnh | Đạt | phòng ngủ đêm/ban mai, UI sáng, lưới navy, bảng tím |
| Y5 mạch kể, tình huống mở, kết giải quyết | Đạt (logic CHƯA KIỂM người duyệt) | `frame-conclusion.png`, board-04 |
| Y6 nhịp/tốc độ | CHƯA KIỂM — giám đốc nghe | QC-06 số đo 4,922/4,815 |
| Y7 nghỉ có chủ đích | CHƯA KIỂM — giám đốc nghe | QC-05; lặng dài 3,1 s ×2; đuôi 0,931 s |
| Y8 phát âm | CHƯA KIỂM — giám đốc nghe | `pronounce`/`phonemes` mã 0 theo Producer; bảng term-check; chưa nghe |

### Mục CHƯA KIỂM (chờ người duyệt)
Độ tự nhiên giọng, nhấn nhá, phát âm iPhone/iOS/twenty seven/Android/app, nhịp nghỉ và tốc độ cảm nhận, độ êm SFX/chuyển âm, sức hút opening, logic mạch kể, chuyển động camera có ý nghĩa (R12), thời điểm nhãn «CÓ ÂM» S04, hiệu ứng đổi ô header khi xem động, hiểu khi tắt tiếng, đồng bộ nhãn–từ khoá (không có dấu thời gian từng từ), bbox vùng an toàn sau zoom.

### QC — cần sửa (lỗi dựng, sửa được; không phải lỗi thiết kế)
1. QC-01 — S07: tách icon đồng hồ/đồng hồ cát khỏi chữ «iOS 27: TÁCH ĐƯỢC», thu sóng loa vào trong khung.
2. QC-02 — S09: nhãn «BÁO THỨC VÀ LỜI NHẮC» không chạm viền, chừa lề ≥ 24 px, dời chấm vàng khỏi chữ.
3. QC-03 — S08: nhãn «KHÔNG LÀM PHIỀN» không nằm trên mép viền máy.
4. Gợi ý (không chặn): QC-07 gộp cue SRT mảnh; QC-08 thêm một kinetic để ≥ 1/25 s; QC-04 chừa khe khung chữ S12.
Sau sửa, giữ nguyên lời/giọng đã sinh (không cần sinh lại TTS), chạy lại `qc-measure`, mở lại khung 30 s, 43 s, 38 s.

### Bài học cho luật
- `text_overlap` của qc-measure chỉ bắt chữ-với-chữ; icon chồng chữ và chữ tràn viền ô UI (QC-01, QC-02) lọt: cần kiểm bằng mắt, đề nghị bổ sung đo icon/viền khi sửa công cụ.

## Producer — sửa bố cục sau QC (21/11/2026)

- QC-01 / S07: cặp icon đi vòng bên phải nhãn «iOS 27: TÁCH ĐƯỢC» rồi trượt vào thanh mới bên dưới. Hai cung loa nằm trong ô vàng. Đã mở khung 29,10 s lúc chuyển và 30,00 s khi thanh tách xong ở 360×640.
- QC-02 / S09: nới ô quyền, giữ chữ 56 px. Bbox chữ theo text engine x=206–866, viền ô x=175–898, lề danh nghĩa 31–32 px trước camera. Chấm vàng xuống ngang công tắc và loa. Đã mở lại 43,00 s.
- QC-03 / S08: đưa «KHÔNG LÀM PHIỀN» vào trong thân máy. Đã mở lại 38,00 s. Các gợi ý QC-04/QC-07/QC-08 vẫn để ở mức gợi ý của QC. Lời, mốc, giọng, mix, phụ đề, bìa và metadata dùng bản đã dựng.

### Kiểm bản giao

- ffprobe: 62,800 s, 1080×1920, H.264 yuv420p, 30 fps, AAC 48 kHz. qc-video PASS, 0 lỗi, −14,93 LUFS và −1,90 dBTP. Đoạn tĩnh dài nhất 1,50 s, tỷ lệ tĩnh 23,13%. Hai cảnh báo chuyển động vẫn là S09 (giữ tương quan quyền–công tắc–loa) và S12 (giữ khung trả lời và lời mời phản hồi). Xem assets/_scratch/qc-video-revision.json.
- qc-publish PASS, 0 lỗi và 0 cảnh báo. Kiểm từ cấm trong SRT, scenes.json, storyboard và nội dung các khối đăng trả 0 khớp. Bìa hook đã mở ở 180×320. final/ có đúng IT-T18-E01_9x16.mp4, captions.srt, thumbnail.jpg và publish.json.
- qc-measure: 202 phát hiện, 151 cảnh báo, 0 lỗi, final_pass_allowed=false. Báo cáo đủ ba trục tại assets/_scratch/qc-revision/report.md. Visual: đã xem ba bố cục sửa và pha đang chuyển của S07. Các cờ về mẫu header/bbox và kinetic tiếp tục được ghi theo mục QC trước. Audio: giữ bốn stem đã trộn, 4,922 âm tiết/s trên WAV giọng, 4,815 trên MP4, khoảng nghỉ dài và đuôi im áp dụng lý do đã ghi ở bản trước. Narrative: chuỗi hình và mốc lời giữ theo storyboard APPROVED, kết vẫn quay lại điện thoại mở bài với trạng thái loa xanh.

### needs_manual_review

- Phát âm, độ tự nhiên của giọng, nhịp cảm nhận, độ êm SFX và chuyển âm: **CHƯA KIỂM — giám đốc nghe**.
- Sức hút opening, logic mạch kể và mức dễ hiểu khi tắt tiếng: **CHƯA KIỂM**.

## QC vòng 2 — Claude (21/11/2026)

Đo độc lập lại bằng một lệnh `node tools/qc-measure.mjs ep01 --baseline docs/baseline/T5-qc-auto.json --frames "0.5,3,29.1,30,38,43,60"` (số của QC, không lấy của Producer): 202 phát hiện, 151 cảnh báo, **0 lỗi**, `qc-video` 0 fails, `final_pass_allowed` = false (đúng: còn mục thủ công). 62,8 s, 1080×1920, 30 fps, mix −14,27 LUFS / −1,75 dBTP, MP4 −14,93 LUFS, 0 mẫu clip, nhạc tắt. Gemini vắng (không chạy). Đã xem 15 khung full-res: 0,5; 3 (qua báo cáo); 29,1; 30; 38; 43; 60 s, `frame-conclusion` (58,9 s), `frame-qc-M-174` (42,3 s), `thumb-180x320`, `header-zones`, và bộ ảnh opening trong báo cáo.

### Kết luận ba trục
- **KỸ THUẬT: ĐẠT.** Ba lỗi dựng vòng 1 đã hết trên bản final mới (xem bảng). Còn một chi tiết động nhỏ (QC-01, 29,1 s) và một khe sát (QC-09), đều mức cảnh báo, không chặn.
- **TUÂN THỦ: ĐẠT.** Luật 10: grep `facebook|youtube|zalo|tiktok` (không phân biệt hoa thường) trên `final/captions.srt`, `assets/scenes.json`, `storyboard.json`, `final/publish.json` = 0 khớp. Không thấy hình đồ ăn/dép trong các khung đã xem. `final/` đúng 4 tệp (mp4, srt, jpg, json). Không ảnh Gemini/ngoài trong video (approved.json rỗng), nguồn iOS 27 như vòng 1. Nghe lời có nhắc nền tảng: không có nhắc, nên không phát sinh.
- **TRẢI NGHIỆM: CHƯA KẾT** — thiên về đạt ở hook, mạch kể, kết; Y6–Y8 và cảm nhận nghe/xem động chờ giám đốc.

### Trạng thái mã QC (bản final mới)
| Mã | Trạng thái | Bằng chứng (khung đã mở) |
|---|---|---|
| QC-01 S07 icon chồng chữ «iOS 27: TÁCH ĐƯỢC» | **ĐÃ SỬA** (còn lưu ý động) | `frame-30.png`: icon đồng hồ/đồng hồ cát ở y≈1000, nằm trong ô vàng, cách chữ nhãn (y≈885) ≈ 90 px, hai cung loa trong khung. `frame-29.1.png` (lúc chuyển): hai icon đang trượt, cắt qua viền phải ô vàng (x≈840–940, viền x=876) nhưng không đè chữ. Cảnh báo nhẹ: 1–2 khung icon chạm viền khi di chuyển, cần xem động |
| QC-02 S09 nhãn chạm viền + chấm đè chữ | **ĐÃ SỬA** | `frame-43.png`, `frame-qc-M-174.png`: chữ x 207–865, viền ô x 160–912, lề ≈ 42–47 px mỗi bên; chấm vàng nằm ở y≈948 cạnh công tắc/loa, cách chữ (y≈845) ≈ 100 px |
| QC-03 S08 «KHÔNG LÀM PHIỀN» đè mép máy | **ĐÃ SỬA** | `frame-38.png`: nhãn x 360–880, y 1135–1180, nằm trong thân máy (viền trong ≈ 908/1200); còn cách icon đồng hồ ≈ 15 px (sát nhưng không chồng) |
| QC-04 S12 khung chữ che đỉnh máy | giữ cảnh báo | `frame-60.png`: khung «THỬ ĐI, ĐỪNG ĐOÁN» vẫn phủ đỉnh điện thoại/cửa sổ, đọc rõ ở 360×640; chấp nhận |
| QC-05 lặng dài 3,08/3,15/2,94 s | không đổi | M-06, M-07, M-09; CHƯA KIỂM — giám đốc nghe |
| QC-06 tốc độ 4,922/4,815 âm tiết/s | không đổi | M-27, +28,3% so T5; CHƯA KIỂM — giám đốc nghe |
| QC-07 SRT cue mảnh | không đổi (gợi ý) | cue 6/7, 10/11 |
| QC-08 kinetic 0,796/25 s | không đổi (gợi ý) | M-114; vẫn dưới ngưỡng 1; 43,9 từ/phút, 100% cảnh có chữ vẽ |
| QC-09 (mới, nhẹ) header sát khung tiêu đề | cảnh báo | `frame-0.5.png` (0,5 s), `frame-60.png` (60 s): đáy header y≈349, đỉnh khung tiêu đề y≈350, khe ≈ 0–1 px (R3 chuẩn khe ≥ 24 px). Không chồng chữ, đọc được; `text_overlap` = 0 vì header không tính. Đề nghị Producer/Đạo diễn: dời khung tiêu đề xuống ≥ 24 px nếu có lượt sửa sau |

### Rà D6/D7/D8 (chênh lệch so vòng 1)
Số đo không đổi (kể cả R23: 0/18 câu cờ, R3: 0 cặp giao, khe nhỏ nhất 70 px, header phủ 100%). 72 cảnh báo R21 «thiếu chữ đúng cỡ» (M-35…M-106) vẫn do công cụ; header «BÁO THỨC / ÂM BÁO» đọc rõ ở 360×640 và 180×320 (`thumb-180x320`), nằm vùng an toàn trên, không che Cáo/phụ đề/sơ đồ ở các khung đã xem; cỡ ≥ 52 px chưa được công cụ xác nhận nên giữ **CHƯA KIỂM** (header_phone_readability). Opening đạt (đổi hình 0,1 s, lời 0,604 s). Narrative: 1,59 khái niệm/10 s, mạch logic; chuyển động camera S07/S08/S09 hiệu 6,6–8,4/255 gần tĩnh (không hại).

### 5 câu hỏi người xem lạ (vòng 2)
1 Đạt (0,5 s: «ĐÚNG GIỜ, CHỈ RUNG», Cáo ngủ, loa gạch). 2 Đạt (hệ quả «Họp bắt đầu rồi!» 2,05 s). 3 Đạt phần chính, tắt tiếng CHƯA KIỂM. 4 Đạt có lưu ý (QC-01 động, QC-09). 5 Đạt (kết 58,9–62,8 s quay về điện thoại loa xanh, CTA «Gõ cho Cáo biết nhé»; đuôi im 0,931 s > 0,7 s ngoại lệ Producer; bìa đọc được ở 180×320).

### Y1–Y8 (vòng 2)
| Mục | Kết luận | Bằng chứng |
|---|---|---|
| Y1 | **Đạt (còn cảnh báo nhẹ)** | QC-01/02/03 đã hết; còn QC-09 và chi tiết động 29,1 s; không nhãn «AI tạo» |
| Y2, Y3, Y4, Y5 | Đạt | như vòng 1; Y5 logic CHƯA KIỂM người duyệt |
| Y6 | CHƯA KIỂM — giám đốc nghe | 4,922/4,815 âm tiết/s |
| Y7 | CHƯA KIỂM — giám đốc nghe | lặng dài ≈ 3 s ×3, đuôi 0,931 s |
| Y8 | CHƯA KIỂM — giám đốc nghe | `phonemes.py` mã 0, 18 dòng, 0 lỗi (QC đo lại); chưa nghe |

### Phán quyết vòng 2
Không còn lỗi dựng FAIL, không có lỗi thiết kế mới. **Giữ `review`, không đặt `ready`**: còn mục thủ công chờ giám đốc. 

### CHƯA KIỂM (chờ giám đốc)
Nghe giọng (tự nhiên, nuốt chữ, phát âm iPhone/iOS/twenty seven/Android/app), tốc độ cảm nhận (QC-06), nhịp lặng (QC-05), độ êm SFX, sức hút opening, logic mạch kể, xem động S07 ở 29,1 s (icon chạm viền ô), hiệu ứng đổi ô header, cỡ header ≥ 52 px trên điện thoại, hiểu khi tắt tiếng, đồng bộ nhãn–từ khoá, bbox vùng an toàn sau zoom, `captions.ass` không có nên không đo được lớp phụ đề.
