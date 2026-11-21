# Nhật ký sản xuất IT-T14-E01

## Producer — vướng nhịp đọc Y6

Plan nghiệm thu **4,6–4,8 âm tiết/giây có tiếng** theo cùng cách đo với T8. T8 lưu **4,18491** trong `docs/baseline/T8-qc-auto.json`. Với 517 cụm chữ hoặc số theo `countSyllables` của QC, giọng tập này cần khoảng **107,71–112,39 giây có tiếng**. Số 536 trong script là dự trù có cộng âm tiết cho thuật ngữ, còn QC đếm 517 từ `assets/voice/apply.json`.

| Phép thử với giọng Hải Đăng | Thời lượng | Giây có tiếng | Âm tiết/s có tiếng | Đuôi im |
|---|---:|---:|---:|---:|
| Lượt đầu, theo cảnh, nhiệt độ 0,65 và `atempo` dẫn 1,15 / kỹ thuật 1,10 | 27 clip rời | 89,773 | 5,759 | — |
| Sinh lại theo cảnh ở nhiệt độ 0,40, giữ hệ số 1,15 / 1,10 | 27 clip rời | 90,863 | 5,690 | — |
| Giữ người đọc Hải Đăng, thử sinh lại từ đặc trưng người nói ở 0,65, giữ hệ số 1,15 / 1,10 | 27 clip rời | 90,454 | 5,716 | — |
| Chọn clip nằm trong ngân sách từng cảnh, gồm cả phương án thử tách câu ở các cảnh khó. Ghép và chuẩn hóa `loudnorm=I=-14:TP=-1.5:LRA=11`, hệ số 1,15 / 1,10 | 179,667 s | 97,398 | 5,308 | 0,600 s |
| Từ các tệp raw của cùng bộ, áp một lần ở đầu thấp của dải Y6, 1,13 / 1,07, và đo lại sau chuẩn hóa | 179,667 s | 99,794 | **5,181** | 0,605 s |

- Bản thử tại đầu thấp của dải nhanh hơn T8 **23,79%**. So với ngân sách, lượt đầu còn có S03 dài 3,421 s cho cảnh 2,10 s, và S27 chỉ 0,636 s cho hai câu. Hai clip sinh lại theo cảnh dài lần lượt 1,190 s và 3,766 s trước khi cắt im ở mép. Các số đo này dùng để loại đoạn bất thường. Độ đầy đủ, nhịp và phát âm thực tế **CHƯA KIỂM — giám đốc nghe**.
- Lệnh chuẩn lần đầu là `python -B studio/renderer-remotion/scripts/gen_vo.py <ep01>/assets/voice/spec.json`. Các lần thử tiếp theo dùng `assets/_scratch/retry_voice.py` với `grouped-calmer --temperature 0.40`, `phrases --temperature 0.50 --split`, và `same-speaker --temperature 0.65 --speaker-only`. Đo từng clip bằng `node <ep01>/assets/_scratch/measure_voice.mjs [tên-lượt]`. Ghép và đo lại bằng `python -B <ep01>/assets/_scratch/preflight_mix.py`, rồi thêm `--lower-bound`. Cả hai bản dùng `silencedetect=noise=-40dB:d=0.12`. Số đo và chi tiết chọn clip ở `assets/_scratch/voice-preflight-cuts.json`, `voice-preflight-lower-bound-cuts.json` và các nhật ký `*-silence.log`.
- Đề nghị Claude chốt hệ số ngoại lệ theo tốc độ đo của giọng Hải Đăng trên máy này. Khoảng thăm dò từ số đo là dẫn **1,03** và kỹ thuật **0,97**. Đây là ước tính cần thử với tệp raw, kiểm lại tốc độ, các mốc 7,95 / 60 / 78 / 135 / 168 s, thời gian giữ hình và giới hạn 180 s trước khi dựng tiếp.

## Producer — phần đã chuẩn bị

- Storyboard APPROVED có 27 cảnh, chỉ định Pillow+FFmpeg. Vị trí phụ đề y≈1340–1500 được chốt ở `review/codex-storyboard-r2.prompt.md` dòng 46. Kịch bản và storyboard tiếp tục là nguồn cho lời, chữ, chuyển động và vị trí Cáo.
- Bộ nền office, security, code và incident lấy từ `tools/backgrounds/make_background.py --layers --seed 14`. Đạo cụ đồ họa vẽ bằng Pillow và `tools/motion`. Cáo dùng dáng nội bộ từ `brand/cao/poses`. Mã dựng thử và 82 khung 360×640 của 27 cảnh nằm trong `assets/_scratch/`. Đã mở các khung S01, S02, S11, S16, S19, S21 và bìa thử 180×320. Đã render thử S01–S03. `ffprobe` xác nhận S02 thử là H.264, yuv420p, 1080×1920, 30 fps, 3,333 s ở biên khung. Khung bìa thử ở 4,02 s toàn tập thể hiện bảng gốc, đường biên và bản đang tới khe.
- `node tools/qc-publish.mjs <ep01>/assets/_scratch/publish-draft.json` trả `pass: true`, `fails: []`, `warns: []` cho bản nháp metadata. Nội dung có câu khai báo AI cuối mô tả cả ba nền tảng. Đã đối chiếu phạm vi sự cố và cách kiểm quyền. [OX Security](https://www.ox.security/blog/malicious-chrome-extensions-steal-chatgpt-deepseek-conversations/) · [Trợ giúp Chrome](https://support.google.com/chrome_webstore/answer/2664769?hl=en) · [Chrome for Developers](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab)
- Y1–Y5 có bằng chứng ở khung dựng thử. Hộp alpha của mọi dáng, chuyển động liên tục của bản ghép, phụ đề đốt, âm lượng AAC và các tiêu chí QC bản xuất **CHƯA KIỂM**. Y6 vướng như trên. Y7 đã đo đuôi im bản tiếng thử, còn đồng bộ với hình chờ chốt tiếng. Y8 đã chạy `pronounce.mjs check` và `phonemes.py --lines`, đều mã 0, 61 câu. `final/` đang trống. Chờ khóa tiếng để xuất bốn tệp, chạy `qc-video` và `qc-measure` trên MP4 và chuyển review.

### Mẫu thuật ngữ — CHƯA KIỂM — giám đốc nghe

| Thuật ngữ | Chữ đưa TTS | Âm vị | Clip | Nguồn từ điển |
|---|---|---|---|---|
| chat | chat | tʃˈæt | `assets/voice/term-check/chat.wav` | riêng |
| AI | eigh eye | ˈeɪ ˈaɪ | `assets/voice/term-check/ai.wav` | chung |
| Featured | Featured | fˈiːtʃɚd | `assets/voice/term-check/featured.wav` | riêng |
| tab | tab | tˈæb | `assets/voice/term-check/tab.wav` | riêng |
| IT | eye tee | ˈaɪ tˈiː | `assets/voice/term-check/it.wav` | riêng |

## Producer — đối chiếu lại sau khi duyệt storyboard D8

- Storyboard APPROVED có 28 cảnh S00–S27, Pillow+FFmpeg, tổng danh định 180,65 s. Review D8 chấp nhận mốc câu hỏi 8,95 s và tổng danh định 180,65 s, đồng thời yêu cầu thử giữ bản chung ≤ 180 s nếu làm được sau khi đo TTS. Các khung và clip dựng thử ghi ở trên thuộc bản trước D8.
- Vướng Y6 vẫn còn. Các lần chạy gen_vo.py, retry_voice.py và preflight_mix.py ghi ở trên cho thấy ngay bản ghép ở hệ số thấp nhất cho phép (dẫn 1,13, kỹ thuật 1,07) vẫn đạt 5,181 âm tiết/s có tiếng, so với dải nghiệm thu 4,6–4,8. Số đo này thuộc bản tiếng thử, chưa phải kết quả QC bản D8.
- Đề nghị Claude chốt hệ số ngoại lệ theo đầu ra Hải Đăng hoặc chuyển Kịch bản chỉnh ngân sách lời và giữ hình. Nếu duyệt thử hệ số 1,03 / 0,97, cần sinh theo từng câu hoặc tách bằng splice.py split, kiểm splice.py check theo R23 rồi đo lại tốc độ, mốc hình và đuôi. Chưa có bản xuất hay kết quả QC video cho D8.

## Hướng dẫn từ Claude (Gỡ vướng, 19/11/2026)

**Nguyên nhân gốc:** không phải lỗi thước đo. Thước 4,6–4,8 âm tiết/s có tiếng cùng đơn vị với T8 (4,185; `docs/audit-T8.md`: +10–15% so T8). Nhưng hệ số 1,15/1,09 (`SPEED_CLASSES` trong gen_vo.py) và "1,13/1,07 thấp nhất" là mặc định hiệu chỉnh cho giọng VieNeu chậm của T8/T9 (đo 4,25–4,6 ở atempo 1,0). Giọng Hải Đăng nhanh hơn: 5,181 / ~1,12 ≈ 4,62 âm tiết/s ở atempo 1,0, nên nhân thêm 1,13 là vượt dải. Phạm vi atempo của công cụ là 0,8–1,2 (`TEMPO_MIN/MAX`), 1,03/0,97 hợp lệ. Tổng lời ~100 s trên 180 s timeline là đúng thiết kế quan sát (Information Pacing), không phải lỗi.

**Quyết định (ngoại lệ được duyệt):** dẫn (`dan`) tempo **1,03**, kỹ thuật (`ky_thuat`) **0,97**, đặt qua `tempo` theo dòng/spec. Ước tính 5,181 x 1,03/1,13 ≈ 4,72 âm tiết/s (trong dải). Lý do: bám tốc độ cảm nhận, giọng gần 1,0 ít méo hơn, không đổi kịch bản.

**Việc cho Sản xuất:**
1. Sinh lại/áp từ raw với 1,03/0,97, theo từng câu hoặc `splice.py split`; chạy `splice.py check` (R23) và `phonemes.py`.
2. Đo lại bằng `qc-measure`: speech_pace trong 4,6–4,8 (4,8–4,9 chấp nhận có ghi chú; trên 4,9 hạ tempo dẫn xuống 1,00). Ghi cả pace voice gốc.
3. Lời dài thêm ~8–10 s: rút nghỉ Y7 (không dưới mức có chủ đích), kiểm từng cảnh vừa ngân sách; giữ tổng ≤ 180,65 s danh định (ưu tiên ≤ 180 s), đuôi im ≤ 0,7 s, mốc 8,95/60/78/135/168 s và giữ-sau-lời.
4. Nếu một cảnh không đủ chỗ cho lời thì đó là lỗi ngân sách kịch bản: escalate lại, không tăng tốc để bù.
5. Nghe tốc độ/phát âm vẫn CHƯA KIỂM — giám đốc nghe.

## Hướng dẫn từ Claude (Gỡ vướng lần 3, 19/11/2026) — THAY THẾ mục mốc ở trên

**Nguyên nhân gốc:** hướng dẫn trước lấy mốc 60/78/135/168 từ script.md/plan.md (thời gian chưa có S00). Storyboard APPROVED chèn opening S00 1,00 s nên mọi cue S01–S27 dịch +1,00 s; storyboard.json tự ghi "L21 bắt đầu 61,00 s", "L26 đúng 79,00 s", "L45 đúng 136,00 s toàn tập". Hai nguồn khác hệ quy chiếu, không mâu thuẫn nội dung.

**Bộ mốc DUY NHẤT (hệ toàn tập, có S00): 8,95 / 61 / 79 / 136 / 169 s.** Bản này thay hết "8,95/60/78/135/168" ở mục trước. 78 và 168 chỉ là mốc hệ script (không S00); không dùng. Kiểm: 79 nằm trong S13 (vào 78,90); 169 nằm trong S26 (vào 169,00); 136 trong S21 (L45); 61 là L21. Câu hỏi 8,95 giữ nguyên. Không đổi ranh giới cảnh, không đổi APPROVED.

**Việc cho Sản xuất:** dùng bộ giọng đã sinh (dẫn 1,03 / kỹ thuật 0,97, `splice.py check` = []). Đặt L21/L26/L45 và cảnh S26 đúng 61/79/136/169 trên timeline xuất; cue giữ hình theo storyboard (đã +1 s), không sửa. Pace: sau loudnorm đo 4,878 âm tiết/s (trong 4,8–4,9, chấp nhận có ghi chú); ghi cả pace voice gốc 5,073 vào notes. Tổng ≤ 180,65 s, đuôi im ≤ 0,7 s. Chạy qc-measure trên MP4. Nghe tốc độ/phát âm: CHƯA KIỂM, giám đốc nghe.

## Producer — tiền kiểm giọng và mốc D8

- Đã đối chiếu 61 câu nguyên văn trong apply.json với voice_over của storyboard. Chạy lại pronounce.mjs check cùng từ điển tập và bỏ qua từ tiếng Việt không dấu (sao,danh,huy,truy,xin,gom,dung,ngay,bao), kết quả unknown rỗng; phonemes.py --lines thoát mã 0.
- Đã sinh từng câu bằng gen_vo.py với assets/voice/d8/spec.json và ghép bản tiền kiểm bằng prepare_clip của splice.py, giữ đệm trước 60 ms, sau 140 ms. splice.py check --wav <bản tiền kiểm> --windows <cửa sổ clip> --json trả [] cho cả hai bản. Bản đo R23 có khoảng đệm kiểm giữa các clip, chưa phải timeline xuất.
- Với 517 cụm chữ hoặc số, FFmpeg silencedetect=noise=-40dB:d=0.12 đo bản dẫn 1,03 / kỹ thuật 0,97 có 101,920 s tiếng trước và 105,985 s tiếng sau loudnorm (5,073 và 4,878 âm tiết/s). Đã thử dẫn 1,00 từ raw theo hướng dẫn, kỹ thuật giữ 0,97: 102,882 s trước và 106,930 s sau loudnorm (5,025 và 4,835 âm tiết/s). Tệp pace-preflight*.wav và cửa sổ JSON ở assets/voice/d8/. Chưa đo trên MP4. Nhịp và phát âm: CHƯA KIỂM — giám đốc nghe.
- Storyboard D8 ghi dịch toàn bộ cue S01–S27 thêm 1,00 s sau opening, nên các mốc nội dung 60/78/135/168 của plan thành 61/79/136/169. Hướng dẫn gỡ vướng yêu cầu giữ 60/78/135/168, trong đó 78 và 168 đứng trước khi S13 (78,90) và S26 (169,00) bắt đầu. Cần Claude xác nhận ưu tiên bộ mốc D8 hoặc duyệt dịch ranh giới cảnh và cập nhật cue giữ hình. Câu hỏi 8,95 đã được duyệt ở cả hai tài liệu. Đề nghị dùng bản giọng chuẩn hóa trước SFX để kiểm pace, hoặc chốt hiệu chỉnh khác nếu mức nghiệm thu áp dụng cho WAV chưa chuẩn hóa.
- Thành phẩm chưa xuất. Chưa có số đo QC trên MP4.


## Producer — thành phẩm D8 và tự kiểm

Bốn tệp giao ở `final/`: `IT-T14-E01_9x16.mp4`, `thumbnail.jpg`, `captions.srt`, `publish.json`.
FFprobe: **180.633333 s**, 1080×1920, 30 fps, H.264/yuv420p + AAC, 12,876,853 byte. Atom moov đứng trước mdat (faststart).
Bản chính vượt mục tiêu bản chung 180 s **0.633 s** và nằm trong giới hạn 180,65 s ở review D8. Giữ đoạn kết đã duyệt và đuôi sau lời. Cờ thời lượng Shorts vẫn hiện; cần bản ≤ 180 s nếu dùng giới hạn đó khi đăng.

- **QC kỹ thuật:** `qc-video --min 150 --max 180.65 --scenes assets/scenes.json` trả `pass: true`, `fails: []`, 3 cảnh báo. Loudness -15.78 LUFS, đỉnh thật -1.62 dBTP.
- **QC metadata:** `qc-publish` pass, 0 lỗi, 0 cảnh báo. Câu khai báo AI ở cuối mô tả cả ba nền tảng.
- **QC đo nâng cao:** `qc-measure` có 0 lỗi và 46 cảnh báo. Báo cáo gốc: `assets/_scratch/qc-d8/report.md`; JSON: `assets/_scratch/qc-d8/report.json`, `assets/_scratch/qc-video-d8.json`.
- **Y1, R17, R22:** Dùng nhãn từ `semantic_plan.texts` đã duyệt D8, font chữ Pillow/Segoe UI và kinetic ở cảnh có chỉ định. Phụ đề ASS 56 px, tối đa hai dòng × 28 ký tự, phụ đề rời giữ cùng nội dung. Mở khung 360×640 ở 0,50 / 65,80 / 90 / 123 / 179,50 s để kiểm dấu và vùng chữ. Bản hình sạch `assets/_scratch/picture.mp4`; bìa ở 4,98 s hệ toàn tập mở ở 180×320, thấy bảng gốc và bản sao qua biên.
- **Y2–Y3:** Cáo dùng bảy dáng/bố trí theo bản đồ cảnh S01, S02, S09, S19, S22, S26, S27, rộng 160–180 px khi cạnh đồ họa, mép đáy 1260–1290 px. BBox sticker ghi theo ảnh alpha thực tế.
- **Y4–Y5:** Nền nội bộ theo môi trường storyboard và dữ liệu mẫu; nguồn nền, đạo cụ và Cáo ghi ở trên. Rà hai khung trước/sau của 28 cảnh ở `assets/_scratch/visual-d8-1.jpg` đến `visual-d8-4.jpg` (bảng trích trước chỉnh S13 12 px). Bản gốc và bản sao ở hook dùng chung dấu ba ô; S26 quay lại cùng tab và khe đích. S16–S19 giữ cùng bài thử phạm vi; S21 để hai trạng thái sau gỡ cạnh nhau. Lớp động có hiệu ứng ngắn tổng hợp theo storyboard, chỉ có lời và hiệu ứng; sổ dựng ở `assets/render-log.json`.
- **Y6–Y7:** Giữ 61 câu Hải Đăng, tempo ngoại lệ 1,03/0,97. Đo WAV giọng trước chuẩn hóa 5,076 âm tiết/s, WAV giọng riêng sau chuẩn hóa 4.878, MP4 4.885 (517 cụm / 105.840 s có tiếng). Dải 4,8–4,9 đã được Claude chấp nhận có ghi chú. Đuôi im 0.606 s, tỷ lệ im 41.41%. Mốc đặt lời 8,95 / 61 / 79 / 136 s, vào S26 đúng 169 s. Khoảng im S12→S13 dùng cho đồng hồ reset và đầu nhận giữ gói, sau đó chuyển sang ổ tiện ích.
- **Y8, R23:** `pronounce.mjs check` từ điển riêng không còn thuật ngữ thiếu; `phonemes.py --lines` mã 0. `splice.py check` trên WAV ráp giọng trả `[]` với cửa sổ đệm của cả 61 câu. Các câu giữ dữ liệu TTS riêng, không cắt vào âm lời. Cờ AAC nếu có liệt kê bên dưới. Phát âm, tốc độ cảm nhận, chuyển động và căn từng âm tiết với từng nhãn **CHƯA KIỂM — giám đốc nghe/xem**.
- **R20–R21:** Opening 1,00 s, dùng opening_plate với tín hiệu âm thanh mềm, lời bắt đầu ở hook. Header dùng HeaderTrack trong 27 cảnh tiếp theo. Hai chỗ chỉ fade ô mới là nhánh tránh vùng vật thể/ranh giới của HeaderTrack; fade chồng được đo theo khung, báo cáo giữ cờ nếu công cụ không gắn được ranh giới. Các lỗi khe thực sửa bằng hiệu chỉnh vùng hình S10, S11, S13, S16, S17, S22, S23.

### Cảnh báo còn lại trên bản giao

- S07 có lật hai thẻ và mở lưới tải cục bộ. S18 giữ trạng thái chờ trước khi viền tab và con trỏ đi vào. S21 duy trì hai trạng thái để người xem so; chuyển động nằm trên đoạn tuyến, khe và vệt sáng. Đây là lý do trung vị khối thấp ở ba cảnh.
- Cờ R22 thiếu chữ cho từ khóa minh họa bằng vật thể được ghi theo checklist có kỳ vọng chữ rộng hơn danh sách nhãn D8. Producer giữ đúng danh sách đã duyệt. Cờ khe nhãn–vật dựa trên hộp neo; một số nhãn đặt ngoài vật để giữ hình và dễ đọc, nhất là nhãn hai cột của S21. Chi tiết từng nhãn trong báo cáo.
- Ngưỡng 3 giây đánh cờ S00/S01/S03 vì opening và nhịp hook đã duyệt ngắn. Cờ pace, Shorts và khoảng im dài được giải thích ở trên. Cờ biên câu cần đối chiếu bằng tai; kiểm WAV đạt và báo cáo phân biệt cờ với lỗi kỹ thuật.

- M-01 R4 · Cảnh S07 (29,3–37 s) ít chuyển động: trung vị 0 khối hoạt động, hiệu cục bộ 2,91
- M-02 R4 · Cảnh S18 (112–120 s) ít chuyển động: trung vị 0 khối hoạt động, hiệu cục bộ 1,16
- M-03 R4 · Cảnh S21 (133–143,25 s) ít chuyển động: trung vị 0 khối hoạt động, hiệu cục bộ 2,37
- M-24 Y7 · Khoảng im dài: kiểm hình đang đổi. Im dưới -40 dB trong 3,009 s, ngưỡng thử 3 s.
- M-51 KỸ THUẬT · Thời lượng 180,633 s vượt 3 phút: không còn là YouTube Shorts.
- M-52 Audio · Tốc độ đọc trên WAV giọng gốc 4,878 âm tiết/s (517 cụm chữ hoặc số trong apply.json / 105,986 s có tiếng), ngưỡng thử 4,6–4,8 âm tiết/s.
- M-53 Information Pacing · Cảnh S00 (low) dài 1 s, dưới ngưỡng thử 3 s.
- M-54 Information Pacing · Cảnh S01 (low) dài 2 s, dưới ngưỡng thử 3 s.
- M-55 Information Pacing · Cảnh S03 (low) dài 2,1 s, dưới ngưỡng thử 3 s.
- M-57 R21 · Đổi ô top_right → top_left có 0 s cùng hiện giữa hai ô. Kiểm đoạn chuyển 0,3–0,5 s tại ranh giới cảnh. Nhật ký chưa cho biết độ mờ khi chỉ một ô hiện.
- M-58 R21 · Đổi ô top_left → top có 0 s cùng hiện giữa hai ô. Kiểm đoạn chuyển 0,3–0,5 s tại ranh giới cảnh. Nhật ký chưa cho biết độ mờ khi chỉ một ô hiện.
- M-59 R21 · Đổi ô top → top_right có 0,367 s cùng hiện giữa hai ô. Kiểm đoạn chuyển 0,3–0,5 s tại ranh giới cảnh. Nhật ký chưa cho biết độ mờ khi chỉ một ô hiện.
- M-60 R22 · Keyword «Cửa sổ và bong bóng chat» thiếu chữ vẽ thật.
- M-63 R22 · Keyword «Máy chủ ngoài» thiếu chữ vẽ thật.
- M-64 R22 · Keyword «Bảng giá mẫu» thiếu chữ vẽ thật.
- M-66 R22 · Keyword «Nguồn đọc» thiếu chữ vẽ thật.
- M-67 R22 · Keyword «Thu hồi bản đã tới» thiếu chữ vẽ thật.
- M-68 R22 · Keyword «Bảng giá» thiếu chữ vẽ thật.
- M-70 R22 · Keyword «Tính nhạy cảm» thiếu chữ vẽ thật.
- M-71 R22 · Keyword «Dữ liệu trên trang» thiếu chữ vẽ thật.
- M-72 R22 · Keyword «Đợt gửi dự kiến» thiếu chữ vẽ thật.
- M-73 R22 · Keyword «Gói đã nhận» thiếu chữ vẽ thật.
- M-74 R22 · Keyword «Trang đang mở» thiếu chữ vẽ thật.
- M-75 R22 · Keyword «Cùng tiện ích» thiếu chữ vẽ thật.
- M-76 R22 · Keyword «Tab chat» thiếu chữ vẽ thật.
- M-80 R22 · Keyword «Lưu giữ» thiếu chữ vẽ thật.
- M-83 R22 · Nhãn «Bản sao» cách đối tượng 82,969 px, ngưỡng 40 px.
- M-84 R22 · Nhãn «Trợ lý AI» cách đối tượng 69 px, ngưỡng 40 px.
- M-85 R22 · Nhãn «Quyền truy cập» cách đối tượng 43 px, ngưỡng 40 px.
- M-86 R22 · Nhãn «Đợt gửi» cách đối tượng 102 px, ngưỡng 40 px.
- M-87 R22 · Nhãn «Máy chủ ngoài» cách đối tượng 51 px, ngưỡng 40 px.
- M-88 R22 · Nhãn «Phạm vi đọc» cách đối tượng 82 px, ngưỡng 40 px.
- M-89 R22 · Nhãn «Cấp tạm» cách đối tượng 329 px, ngưỡng 40 px.
- M-90 R22 · Nhãn «Giá nội bộ» cách đối tượng 107 px, ngưỡng 40 px.
- M-91 R22 · Nhãn «Quyền đọc» cách đối tượng 106 px, ngưỡng 40 px.
- M-92 R22 · Nhãn «Nhà phát hành» cách đối tượng 81 px, ngưỡng 40 px.
- M-93 R22 · Nhãn «Gửi mới» cách đối tượng 70 px, ngưỡng 40 px.
- M-94 R22 · Nhãn «Bản cũ» cách đối tượng 230 px, ngưỡng 40 px.
- M-95 R22 · Nhãn «Xác nhận» cách đối tượng 72 px, ngưỡng 40 px.
- M-96 R22 · Nhãn «Mật khẩu» cách đối tượng 87 px, ngưỡng 40 px.
- M-97 R22 · Nhãn «Khóa» cách đối tượng 41 px, ngưỡng 40 px.
- M-98 R22 · Nhãn «Khách hàng» cách đối tượng 96 px, ngưỡng 40 px.
- M-99 R22 · Nhãn «IT» cách đối tượng 48 px, ngưỡng 40 px.
- M-100 R22 · Nhãn «Quyền truy cập» cách đối tượng 48 px, ngưỡng 40 px.
- M-101 R23 · Có 1/61 câu bị cờ (1,639%), gồm 1 đầu câu và 0 cuối câu. Ngưỡng lỗi kỹ thuật 10%.
- M-102 R23 · Đầu câu 61 tại 178,67 s, cửa sổ 178,61–180,19 s, RMS -120 dBFS, thời gian tăng 0 ms, bước nhảy 21,336 dB. tăng trong chưa đầy một khung 2 ms (cắt cứng).

## QC — lượt 1 (bản D8, MP4 180,633 s) — PASS có cảnh báo
Đo độc lập: `qc-measure ... --baseline docs/baseline/T8-qc-auto.json` → 102 phát hiện, 45 cảnh báo, **0 lỗi**; `assets/_scratch/qc-auto/report.md`. Đã mở 12 `board-*` (96 khung 360×640), `scene-S21`, `textheavy-S12`, `thumb-180x320`, `frame-open-mid`, `header-zones`, `hdr-58.png` (khung thêm quanh 58,5 s). `final/` đúng 4 tệp; `publish.json` đủ 3 nền tảng + khai báo AI; `captions.srt` 68 cue; `thumbnail.jpg` có. Sổ nguồn: nền/đạo cụ/Cáo nội bộ, không nguồn ngoài (LICENSES.md dòng 4).

### Ba kết luận
- **KỸ THUẬT: ĐẠT.** 1080×1920, 30 fps, h264/yuv420p + aac; 180,633 s (trong 150–190; >180 s cảnh báo Shorts, M-51); LUFS -15,78; đuôi im 0,606 s; 0 lỗi qc-video; lệch lời–hình ≤0,072 s; cue phụ đề lệch ≤0,012 s.
- **TUÂN THỦ: ĐẠT.** Không nhãn «AI tạo» đốt vào hình; khai báo AI ở publish.json; không logo lạ, không nhạc; nguồn nội bộ.
- **TRẢI NGHIỆM: ĐẠT CÓ CẢNH BÁO; phần tai CHƯA KIỂM.** Yếu ở R22 (nhãn keyword) và cắt cứng đầu câu cuối.

### Bảng phát hiện
| Mã | Nhóm | Mốc | Bằng chứng | Mức | Đề nghị |
|---|---|---|---|---|---|
| M-51 | KỸ THUẬT/Shorts | 0–180,633 s | vượt 180 s 0,633 s | cảnh báo | Đăng Shorts: cắt ≥0,64 s hoặc đăng video thường; giám đốc quyết. |
| M-01/02/03 | R4 | S07 29,3–37; S18 112–120; S21 133–143,25 | trung vị khối 0; scene-S07/S18/S21 có lật thẻ, tải lưới, so sánh 2 trạng thái | đã loại trừ | Hình đổi theo ý, không tĩnh vô nghĩa. |
| M-24 | Y7 | 75,996–79,005 s | lặng 3,009 s S12→S13 | đã loại trừ | Producer dùng cho đồng hồ reset (textheavy-S12 vòng ≈30 phút). Nghe nhịp CHƯA KIỂM. |
| M-53/54/55 | Pacing | S00 1 s, S01 2 s, S03 2,1 s | dưới 3 s | đã loại trừ | Opening/hook đã duyệt ngắn. |
| M-57/58/59 | R21 | 58,5; 133; 143,3 s | hdr-58.png: ô cũ mất, ô mới fade-in ~0,3 s, không đè | đã loại trừ | Chấp nhận. |
| M-60,63,64,66,67,68,70–76,80 | R22 | S00,S02,S03,S04,S06,S10,S13–S16,S21 | 14 keyword không có chữ vẽ thật | cảnh báo | Bản sau: thêm nhãn cho keyword chính (Máy chủ ngoài, Bảng giá, Gói đã nhận, Nguồn đọc…). 92,9% cảnh có chữ, 44,51 từ/phút (sát trần 45), kinetic 1,52/25 s đạt. |
| M-83..M-100 | R22 khe nhãn–vật | nhiều cảnh | 0 cặp giao bbox, khe nhỏ nhất 44 px; 18 nhãn xa đích (vd «Cấp tạm» 329 px S18) | cảnh báo | Mắt: board-11 (S26) «Gửi mới»/«Bản cũ» sát mép vật; board-03 (~44 s) «Quyền đọc» lấn mép chồng tab. Nhẹ, đọc được. |
| M-101/102 | R23 | 178,61–180,19 s | 1/61 câu cờ (1,639% < 10%), -120 dBFS rồi bật cứng | cảnh báo | Nghe đầu câu 61: CHƯA KIỂM; nếu click thì sinh lại bằng splice.py. |
| M-52 | Y6 | cả video | 4,885 âm tiết/s MP4 (+16,7% T8); Producer: giọng gốc 4,878 | thông tin | Ngoài dải 4,6–4,8, trong 4,8–4,9 đã chấp nhận ở Gỡ vướng; WAV gốc qc-measure không đo được. |
| M-47..50 | R12 | S01,S03,S05,S17 | hiệu RGB 7,77/4,45/8,73/7,32 khớp push_in/pan/pull_out | thông tin | camera-*.png: chuyển động thật. |

### So bản chuẩn T8 (Δ)
Lần cắt/10 s 1,495 vs 2,148 (↓0,65); tĩnh 31,5% vs 22,7% (↑8,8); đoạn tĩnh dài nhất 1,8 s (112,8–114,6 s, S18, có con trỏ/viền động); chữ lặp lời 0 vs 0; từ chữ/phút 44,5 vs 41,5; pace 4,885 vs 4,185 (+16,7%); lặng 41,4% vs 30,4%; khoảng ≥1,5 s đều có đổi hình.

### Audio / Visual / Information QC (D6, D8)
- Audio: pace trên; đuôi 0,606 s Đạt; lặng dài nhất 3,009 s (M-24); phonemes.py mã 0, 61 dòng, 0 lỗi; nuốt/kéo chữ, phát âm, nhấn nhịp **CHƯA KIỂM — giám đốc nghe**.
- Visual: opening S00 1 s riêng, tiêu đề «AI ĐỌC ĐƯỢC CHAT CỦA BẠN?» (frame-open-mid), lời bắt đầu 1,208 s — Đạt R20. Header phủ 99,4% (100% sau opening), 12 lần đổi ô, 0 đè, không che Cáo/sơ đồ (header-zones.png) — Đạt R21; ~14 px ở 360×640, đọc được. R3 `text_overlap` 0 cặp, khe 44 px — Đạt.
- Information: 2,325 khái niệm/phút; giữ-sau-lời nhỏ nhất low 0,62 s (S27 cuối), medium 1,19 s, high 2,65 s (S21); thứ tự logic (hook → bản sao → quyền → gỡ/đợt gửi → kiểm quyền → quay lại hook S26); có ví dụ (bảng giá dữ liệu mẫu, đồng hồ 30 phút, S21 so sánh). Không thấy đoạn chỉ đọc lý thuyết trong 96 khung đã mở; xem video liên tục: CHƯA KIỂM.

### 5 câu hỏi người xem lạ
1. 0–3 s: ĐẠT — tiêu đề opening + «Mình dán bảng giá» ở 1,2 s.
2. Trước 5 s: ĐẠT — «Bản sao» ra máy chủ (S02, 3,4–6,3 s); câu hỏi chốt 8,95 s.
3. Mỗi cảnh một ý, tắt tiếng: ĐẠT một phần — luồng chính hiểu qua hình+nhãn; keyword thiếu nhãn làm ý mờ; tắt tiếng thật CHƯA KIỂM.
4. Hình đổi ở 360×640, chữ không chép lời: ĐẠT — chữ lặp lời 0; tĩnh tối đa 1,8 s.
5. Kết/bìa: ĐẠT — S26 quay lại tab của hook, CTA «Kể mình nghe ở phần bình luận nhé» (board-12); bìa 180×320 đọc được; đuôi im 0,606 s.

### Bảng Y1–Y8
| Y | Kết quả | Bằng chứng |
|---|---|---|
| Y1 | Đạt | không nhãn «AI tạo»/«Ví dụ dựng» trên khung đã xem |
| Y2–Y3 | Đạt | Cáo ở S01,S02,S09,S19,S22,S26,S27, ~160–180 px |
| Y4 | Đạt | 4 nền theo chủ đề; chuỗi cùng chủ đề dài nhất 4 cảnh (S01–S04) |
| Y5 | Đạt | tình huống mở → kết đóng S26–S27 |
| Y6 | Đạt có ghi chú (số) / tai CHƯA KIỂM | 4,885 âm tiết/s |
| Y7 | Đạt (số đo) / tai CHƯA KIỂM | 1 khoảng lặng 3,009 s có lý do hình; đuôi 0,606 s |
| Y8 | Đạt văn bản/timeline; tai CHƯA KIỂM | phonemes.py mã 0, pronounce check rỗng |

### CHƯA KIỂM
Nghe: nuốt/kéo chữ, phát âm AI/chat/Featured/tab/IT, nhấn nhịp, click câu 61 (178,67 s), tốc độ cảm nhận. Xem: video liên tục, tắt tiếng thật, header trên điện thoại. Công cụ không đo: tốc độ WAV giọng gốc, captions.ass (cỡ/vị trí phụ đề).

### Bài học cho luật
- Hệ số tempo mặc định (1,15/1,09) chỉ hợp giọng VieNeu; ghi riêng cho giọng khác.
- R22: nên tách "keyword minh hoạ bằng hình theo storyboard" khỏi lỗi thiếu nhãn để bớt nhiễu cảnh báo.
