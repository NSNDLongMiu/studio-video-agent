# IT-T9-E01 · Nhật ký sản xuất

## QC — lượt 6 (mới nhất, đọc đầu tiên)

Đo: `qc-measure --baseline docs/baseline/T8-qc-auto.json` → 0 lỗi, 29 cảnh báo (cùng nhóm lượt 5). Ảnh: `assets/_scratch/qc-auto/`. Đã mở 12 khung: `frame-38.27/38.33/38.4` (S09, chỗ QC-15), `frame-156.4` (S23, QC-16), `frame-177`, `frame-open-end`, `thumb-180x320`, `header-zones`, thêm 2/20/100 s.

**QC-15 đã sửa:** ở 38,27/38,33/38,40 s «Xem trước» nằm trên tấm, «Bản AI đọc» nằm dưới tấm, khe > 300 px, không chồng. `text_overlap` 0 cặp giao, khe nhỏ nhất 26 px. QC-16 (S23, 156,4 s): hai nhãn tách rõ, đọc được.

**KỸ THUẬT — ĐẠT:** 179,267 s, 1080×1920, 30 fps, H.264/AAC, −14,72 LUFS, đuôi im 0,586 s; 4 tệp trong `final/`; 28 cảnh, ngắn nhất 2,267 s, tĩnh dài nhất 1,2 s (58,7–59,9 s, giữ sơ đồ); lệch lời–hình ≤ 0,092 s; cue–tiếng ≤ 0,022 s (73/73); R12 9 cảnh camera hiệu RGB 9,1–17,3/255 (M-28–M-36); R23 0/73 câu cờ.
**TUÂN THỦ — ĐẠT:** R20 opening riêng 0–2,4 s có tiêu đề; R21 header 100% sau opening, ≥ 52 px, 0 đè; R3 0 cặp giao; R22 96,429% cảnh có chữ vẽ thật, 43,176 từ/phút, kinetic 1,395/25 s; phụ đề 56 px dải dưới; `phonemes.py` mã 0; không nhãn «AI tạo»; sổ nguồn đã đối chiếu lượt 3.
**TRẢI NGHIỆM — ĐẠT phần đo/nhìn, nghe CHƯA KIỂM:** tốc độ +12,68% so với T8 (WAV 4,716 âm tiết/s trong dải 4,6–4,8; MP4 4,479); lặng 31,6%, dài nhất 2,554 s (72,753–75,307 s, S12, hình đang chuyển động); giữ-sau-lời nhỏ nhất 0,556/1,04/2,069 s (low/medium/high).

Audio/Visual/Information (D6, D8): Audio đạt phần đo; Visual đạt (opening, header, đồng bộ, M-43–M-53 không giật ở ranh S04/S05, S08/S09); Information 3,347 khái niệm/phút, thứ tự logic.

**5 câu hỏi:** 1 Đạt (0–2,4 s hook 2+3=5/File, bìa 180×320 đọc được); 2 Đạt (hệ quả S01–S03 trước 5 s); 3 Đạt phần đo, tắt tiếng hiểu một phần, S10–S13 cần phụ đề; 4 Đạt (tĩnh ≤ 1,2 s, hết nhãn chồng); 5 Đạt (S27 kêu gọi, đuôi 0,586 s).

| Nhóm | Kết luận | Bằng chứng |
|---|---|---|
| Y1 | Đạt | khung 38,27–38,4 s hết chồng; 0 cặp giao |
| Y2 | Đạt | 13,28% (lượt 3) |
| Y3 | Đạt | Cáo đúng cỡ ở frame-38.x, frame-177 |
| Y4 | Đạt | security/code/office/incident, chuỗi dài nhất 4 cảnh |
| Y5 | Đạt | dẫn lượt 3 |
| Y6 | Đạt phần đo; CHƯA KIỂM nghe | M-37 |
| Y7 | Đạt phần đo; CHƯA KIỂM nghe | M-02–M-27 |
| Y8 | Đạt văn bản; CHƯA KIỂM nghe | phonemes.py mã 0 |

Cảnh báo đã loại trừ: M-38/39/40 (S00–S01 ngắn, hook cố ý); M-41/M-83 (nhãn thuật ngữ 3 từ); M-43–M-53 (đổi ô 0 s cùng hiện, không giật); M-56–M-82 (keyword minh hoạ bằng hình theo storyboard); QC-16 (tuỳ chọn).

**PHÁN QUYẾT lượt 6: PASS → ready.** CHƯA KIỂM (giám đốc): nghe giọng/tốc độ cảm nhận/nhịp nghỉ/phát âm 5 thuật ngữ, độ mượt header, độ dày S10–S13 trên điện thoại.
Bài học: lỗi R3 chớp vài khung dễ lọt bảng 2 s; giữ `text_overlap` làm nguồn chính và xem khung mốc.

## Producer · Cần duyệt lại thời lượng theo giọng Hải Đăng

Storyboard JSON ở trạng thái `APPROVED` và chỉ định Pillow + FFmpeg. Đã đối chiếu 27 cảnh, 67 câu và bản đồ Cáo. Nguồn dự kiến gồm đồ họa hình học tự dựng, nền theo ngữ cảnh từ `tools/backgrounds/`, các dáng Cáo `think`, `surprised`, `bow`, `idea`, `thumbs_up` có sẵn trong `brand/cao/poses/` và giọng Hải Đăng từ VieNeu chạy cục bộ. Giai đoạn dựng hình, xuất phụ đề và QC video đang chờ mốc được duyệt.

### Đối chiếu ngân sách và kết quả thử

Kế hoạch nghiệm thu ghi **170–174 s**, lấy **172,00 s** làm mốc. Ngân sách gồm 119,17 s đọc, 52,68 s nghỉ Y7 và 0,15 s đuôi. Mục tiêu tốc độ là **4,6–4,8 âm tiết/s có tiếng**. Chuẩn T8 đo 4,185 theo `docs/baseline/T8-qc-auto.json`.

| Lần thử | Thiết lập | Đo được |
|---|---|---|
| Cụm theo cảnh | Hải Đăng, VieNeu cục bộ, `temperature=0.65`, `atempo` 1,15 dẫn / 1,09 kỹ thuật | 27 clip dài 105,495 s, có tiếng 88,107 s theo silencedetect −40 dB / 0,12 s. 491 cụm chữ theo cách đếm của QC, 5,573 âm tiết/s. |
| Cùng đầu ra TTS, chọn đầu thấp của dải đã duyệt | `atempo` 1,13 dẫn / 1,07 kỹ thuật, áp một lần vào từng clip gốc | 107,395 s, có tiếng 89,743 s, 5,471 âm tiết/s. |
| Ghép thử để nghe và kiểm số đo | Đầu thấp của dải, 31,21 s giữ sau lời, 0,15 s đuôi và các khoảng nghỉ nội tại từ TTS. Chuẩn hóa thử với loudnorm. | `ffprobe`: 138,755 s, PCM s16le 48 kHz mono. `silencedetect`: có tiếng 91,422 s, im 34,11%, 5,371 âm tiết/s (+28,3% so với T8). Đo lại `loudnorm`: −15,60 LUFS, −1,48 dBTP, LRA 3,30. Chuẩn hóa âm thanh thành phẩm còn chờ. |
| Sinh riêng từng câu ở sáu cảnh then chốt | Cùng giọng, mức `atempo` thấp, cộng toàn bộ đệm và nhịp giữ của kịch bản vào tổng clip | S01 2,016 / 2,00 s, S11 14,938 / 16,00 s, S12 8,771 / 10,00 s, S16 14,679 / 16,00 s, S26 5,961 / 6,50 s, S27 3,670 / 4,00 s. Các tổng thử này còn tính cả nghỉ sẵn trong clip riêng. |

Nếu lấy 91,422 s có tiếng và tính đủ 52,68 s nghỉ đã duyệt cùng đuôi 0,15 s đúng một lần, ước tính **144,25 s**, thiếu khoảng **25,75 s** ngay ở cận dưới 170 s. Bản ghép 138,755 s giữ các khoảng nghỉ sẵn trong TTS. Mốc 144,25 s là phép đối chiếu ngân sách, còn các cửa sổ lời–hình cần được duyệt lại trên giọng thật. Thêm 25,75 s để khớp cận dưới sẽ thay đổi đáng kể khoảng nghỉ và mốc hình của storyboard.

**Chuyển Kịch bản và Đạo diễn hình ảnh duyệt** tốc độ trên bản nghe thử và tính lại mốc theo cụm lời thực tế. Nếu giữ tiêu chí 170–174 s, đề nghị bổ sung phần giải thích có minh họa, đồng thời đo lại tốc độ giọng. Nếu chọn bản ngắn hơn trong dải D1, cần chốt lại mục tiêu tập và thêm thời gian quan sát có nội dung khi cần. Ưu tiên giữ hook hai giây, bằng chứng hàng khuất S11, trạng thái 0 của riêng plugin S12, nhịp so hai bản S16, đối chứng S25 và quay lại câu hỏi S26.

### Bằng chứng và nghe kiểm

- `assets/voice/apply.json` và `assets/voice/phonemes.json` lưu 67 câu. `pronounce.mjs check` trả mã 0 với bốn mục riêng, các ứng viên giả tiếng Việt đã bỏ qua. Theo kịch bản, L07 và L44 giữ nguyên chữ “ai” thường trong TTS. `phonemes.py --lines` trả mã 0.
- `assets/voice/measure-atempo.json`, `assets/voice/measure-atempo-lower.json`, `assets/voice/timing-check/summary.json` và `assets/voice/timing-check/selected-scenes.json` ghi số đo từng phương án.
- `assets/voice/timing-check/timing-check-normalized.wav` là bản nghe thử 27 cụm giọng. Có thể chạy lại kịch bản thử trong `assets/_scratch/` từ gốc xưởng bằng Python.
- Phát âm thực tế, tốc độ cảm nhận, ngữ điệu và nhịp **CHƯA KIỂM — giám đốc nghe**. Mọi mục từ điển vẫn `verified:false`.

| Thuật ngữ | Văn bản TTS | Âm vị | Nguồn từ điển | Clip trong `assets/voice/term-check/` |
|---|---|---|---|---|
| AI | eigh eye | ˈeɪ ˈaɪ | Chung | `ai.wav` |
| file | file | fˈaɪl | Riêng | `file.wav` |
| plugin | plugin | plˈʌɡɪn | Riêng | `plugin.wav` |
| tool poisoning | tool poisoning | tˈuːl pˈɔɪzənɪŋ | Riêng | `tool-poisoning.wav` |
| rug pull | rug pull | ɹˈʌɡ pˈʊl | Riêng | `rug-pull.wav` |

## Hướng dẫn từ Claude (Rescue, 19/11/2026)

**Gốc rễ.** Không thiếu nội dung. (1) Cận 170–174 s chỉ là ước lượng từ 4,31 âm tiết/s trong script; chuẩn nghiệm thu là D1 150–190 s. (2) Giọng Hải Đăng VieNeu vốn đọc nhanh: ở atempo 1,13/1,07 đã đo 5,37 âm tiết/s (+28% so T8, vượt dải +10–15% = 4,6–4,8). Dải atempo 1,13–1,18 trong brief hiệu chuẩn theo giọng T8, không áp được cho giọng này. Sửa đúng là giảm atempo, không thêm nội dung.

**Việc Sản xuất làm (giữ storyboard APPROVED và 27 cảnh):**
1. Sinh lại 27 cụm với atempo thấp hơn đến khi `qc-measure` đo 4,6–4,8 âm tiết/s có tiếng (ước tính atempo ≈ 0,95–1,00 dẫn / 0,92–0,97 kỹ thuật; chỉnh theo số đo, hoặc giảm tốc độ sinh của VieNeu thay vì atempo<1). Ghi atempo thực dùng vào notes.
2. Với 491 cụm chữ, phần có tiếng ≈ 102–107 s; cộng 52,68 s nghỉ Y7 và đuôi ≤ 0,7 s → **≈ 155–160 s, đạt D1**. Nghiệm thu 150–190 s (đã sửa plan.md), không cần đạt 170 s.
3. Tính lại từng cảnh: thời lượng cảnh = max(giây đọc thật + nghỉ, tối thiểu theo độ phức tạp + giữ sau lời). Mốc dòng ẩn (S11) và trả lời (S26) dời theo clip thật; thứ tự, nội dung cảnh giữ nguyên.
4. Nếu sau bước 1 tổng < 150 s: kéo dài thời gian quan sát ở cảnh High (S11, S12, S16, S25, S26) bằng giữ-sau-lời, không thêm câu/khái niệm. Nếu thật sự cần nội dung mới thì escalate lại.
5. Phát âm/tốc độ cảm nhận vẫn CHƯA KIỂM, giám đốc nghe.

## Producer · Bản dựng giao QC

Dựng đủ 27 cảnh và 67 lời theo storyboard `APPROVED` bằng Pillow + FFmpeg. Căn lại mốc hình theo giọng Hải Đăng theo hướng dẫn Rescue. Giữ bốn đầu ra trong `final/`: `IT-T9-E01_9x16.mp4`, `thumbnail.jpg`, `captions.srt`, `publish.json`. `assets/_scratch/picture.mp4` là bản hình trước khi ghép phụ đề.

Nguồn sử dụng gồm nền theo ngữ cảnh vẽ bằng `tools/backgrounds/make_background.py`, đồ họa hình học dựng bằng Pillow và các thành phần `tools/motion/`, năm dáng PNG có sẵn trong `brand/cao/poses/` và giọng Hải Đăng từ VieNeu cục bộ. Lớp Cáo ghép ở tọa độ màn hình sau crop theo chỉ định PNG tĩnh của storyboard. Năm âm chạm tự tạo tại mốc đáp khay, vào cữ, chạm chốt và thu thẻ.

### Số đo trên tệp giao

| Phép kiểm | Kết quả |
|---|---|
| `ffprobe` và kiểm thứ tự hộp MP4 | 162,067 s · 1080×1920 · H.264 yuv420p · 30 fps · AAC mono 48 kHz · 13,9 MiB · `moov` trước `mdat` |
| `qc-video --min 150 --max 190 --scenes assets/scenes.json` | PASS · không có lỗi · 3 cảnh báo chuyển động · bản đo lưu ở `assets/_scratch/qc-video.json` |
| `qc-publish` | PASS · không có lỗi hoặc cảnh báo · khai báo AI cuối nội dung đăng của cả ba nền tảng |
| `qc-measure` hồ sơ `explainer` | 0 lỗi · 11 cảnh báo · [Báo cáo và ảnh bằng chứng](assets/_scratch/qc-auto/report.md) |
| Âm thanh AAC trên tệp giao | −15,0 LUFS, −1,68 dBTP, LRA 3,0. Có tiếng 104,91 s ở ngưỡng −40 dB / 0,12 s, nghỉ 35,27%, đuôi im 0,690 s |
| Phụ đề | 67 cue, tối đa 2 dòng × 28 ký tự, ASS Segoe UI 56 px. Độ lệch lớn nhất của mốc bắt đầu lời khai báo so với tiếng đo được là 0,061 s |

### Đối chiếu Y1–Y8

| Mục | Dựng và bằng chứng |
|---|---|
| Y1 · Chữ trên hình | Dùng nhãn từ `semantic_plan` và cột chữ của kịch bản. Tiêu đề S01 vào ở 0,10 s, header ở S09–S10 và S20. Đối chiếu ảnh 360×640 ở S01, S12 và S16. Hai nhãn S16 có tai riêng và đủ chỗ cho dấu duyệt. Báo cáo đo 0 nhãn chép nguyên câu thoại. Kiểm lớp chữ trong ảnh không phụ đề và khung bản chính. |
| Y2 · Nhịp Cáo | Có ở S01, S03, S09, S17, S20, S26–S27, tổng 33,67 s (20,77%). Các cảnh kỹ thuật chính S11, S12, S16 và S25 dành chỗ cho minh họa. |
| Y3 · Kích thước Cáo | Rộng 146–160 px (13,5–14,8% chiều ngang), đáy y=1280–1290. Đã xem khung đầu, giữa và kết ở 360×640, bao gồm vị trí so với phụ đề và vật được chỉ. |
| Y4 · Bối cảnh | Tám bố cục A–H trên bốn chủ đề nền. Ảnh camera đầu/cuối của tám cảnh chuyển động nằm trong `qc-auto/`. Dùng nguồn có dư độ phân giải và biên ngang cho các cú lia. |
| Y5 · Mạch kể | S01 cho thấy phép cộng và đường file trong 2 giây đầu; file tới khay ở 2,62 s. S11 bắt đầu lộ hàng che ở 49,74 s; S12 hiện số 0 vào 65,50 s; S16 bóc góc để so hai hàng từ 96,90 s; S25 dừng file ở 150,82 s; S26 khoanh lại hàng che từ 152,59 s rồi giữ cùng khay rỗng. Bìa lấy ở 3,03 s từ S02 và đã xem 180×320. |
| Y6 · Tốc độ | Dùng atempo 0,935 cho dẫn và 0,897 cho kỹ thuật theo phép hiệu chỉnh trên giọng thật. Đo 4,68 âm tiết/s có tiếng so với 4,185 ở T8 (+11,83%). Tốc độ cảm nhận và ngữ điệu **CHƯA KIỂM — giám đốc nghe**. |
| Y7 · Khoảng nghỉ | Ghi khoảng lời và giữ hình ở `assets/scenes.json`. Ba cảnh High giữ ít nhất 2,307 s sau lời theo phép đo. Ở S11, S12 và S16, dùng vệt rà chuyển điểm nhìn trong khi giữ kết quả vừa trình bày. Chi tiết mốc nghỉ trong báo cáo. Nhịp cảm nhận **CHƯA KIỂM — giám đốc nghe**. |
| Y8 · Thuật ngữ | Đã chạy lại `pronounce.mjs check` và `phonemes.py --lines`, cả hai mã 0. Giữ nguyên chữ “ai” thường ở L07 và L44. Bảng năm clip nghe kiểm ở mục trên vẫn áp dụng. Phát âm thật và độ tự nhiên **CHƯA KIỂM — giám đốc nghe**. |

### Các cảnh báo còn lại

- S11, S13, S24 có trung vị 0 khối hoạt động. S11 giữ trục để đối chiếu cùng hàng, với tấm đầy đủ được kéo xuống, hàng đỏ mở và vệt rà chạy qua thước. S13 giữ chung đường cộng và nhánh có điều kiện trong khung để lần về đúng tấm. S24 giữ tuyến cộng mở trong lúc hai chốt hạ theo lời. Các chuyển động tập trung vào đoạn đang giải thích. Đoạn tĩnh dài nhất 1,4 s theo mẫu 10 Hz.
- S11 có 3,055 s dưới −40 dB từ 56,138 đến 59,193 s. Đoạn giữ theo storyboard là 2,97 s. Vệt rà đi từ dấu cộng qua mép cắt và xuống hàng khoanh; phần lẻ còn lại nằm ở đầu tiếng của cảnh sau theo ngưỡng đo.
- Hai cue ngắn là “Tổng đúng.” và “Khoan!”. Chúng dài lần lượt 0,611 s và 0,508 s. Tách câu đầu để giữ thứ tự lộ kết quả và sự kiện gửi. Tách “Khoan!” theo nhịp gọi chú ý trước câu kế.
- Chủ đề nền `code` có 5 cảnh liên tiếp trong hai bối cảnh D và E. Chủ đề `security` chiếm 45,48%, gồm 11 cảnh liên tiếp với bàn lưu/đối chiếu F, bàn kiểm G và sơ đồ ranh giới H. Các mốc này theo storyboard.
- S01 dài 2,00 s theo ngoại lệ opening đã duyệt. Công cụ đếm 10 từ/ký hiệu khi tiêu đề, phép tính và kết quả cùng hiện. Khung tách thành hai nhóm đọc, một tiêu đề và một cụm phép tính.

So với T8, thời lượng từ 41,90 lên 162,07 s, lần cắt mỗi 10 s từ 2,15 xuống 1,60, mật độ chữ minh họa từ 41,53 xuống 14,07 từ/phút. Tỷ lệ thời lượng có phụ đề từ 75,92% xuống 72,16%. `qc-measure` đo 25 nhóm bố cục trong 27 cảnh. Đánh giá vị trí nhấn theo từng từ dựa trên storyboard và kiểm khung, chưa có xác nhận bằng tai.

## QC (Claude, 19/11/2026) — CHƯA CÓ PHÁN QUYẾT

QC bị chặn, không phải video rớt. Lệnh đo độc lập `node tools/qc-measure.mjs <ep01> --baseline docs/baseline/T8-qc-auto.json` bị từ chối vì cần duyệt quyền, mà phiên nền không có người duyệt. Log của phiên ghi: "Ignoring 9 permissions.allow entries from .claude/settings.json: this workspace has not been trusted". Chưa xem khung hình nào. Không dùng báo cáo `assets/_scratch/qc-auto/` do Producer tạo để kết luận vì đó không phải phép đo độc lập. Toàn bộ KỸ THUẬT / TUÂN THỦ / TRẢI NGHIỆM và Y1–Y8 **CHƯA KIỂM**. Video giữ `review`. Cần giám đốc tin cậy workspace cho tài khoản Claude chạy nền, rồi xếp lại `/qc IT-T9-E01`.

## QC — lượt 1 (Claude, chạy trực tiếp trong phiên thư ký, 19/11/2026)

Đo độc lập bằng `node tools/qc-measure.mjs <ep01> --baseline docs/baseline/T8-qc-auto.json` (hồ sơ `explainer`, không truyền --min/--max) → **0 lỗi · 11 cảnh báo · 47 phát hiện**. Báo cáo + ảnh bằng chứng: `assets/_scratch/qc-lan1/report.md` (+ `board-01..11`, `camera-S*`, `scene-S11/S13/S24`, `textheavy-*`, `header-zones`, `nocaption-board`, `thumb-180x320`, `frame-open-*`); khung/ảnh ghép QC tự thêm: `frame-2.5/57.5/66/70/146/150.5/153.png`, `sheet-S11/S13/S24.png` (1 khung/1–2 s), `f38/f90/f98.png`. Đã xem: 11 bảng lưới 2 s/khung (phủ cả 27 cảnh), 18 khung full-res, 3 ảnh ghép, bìa 180×320. **Chưa xem hết từng khung chuyển cảnh; chưa nghe âm thanh.** Thư mục `final/` có đúng 4 thành phẩm (mp4, srt, publish.json, thumbnail.jpg), không cần dọn.

### Phán quyết lượt 1: **KHÔNG ready, giữ `review` — QC-THIẾT-KẾ (R12/Y4 và R14), chờ giám đốc quyết.** Không có lỗi dựng sửa được bằng sản xuất lại.

| Trục | Kết luận | Bằng chứng chính |
|---|---|---|
| KỸ THUẬT | **ĐẠT** | 1080×1920, 30 fps, h264/yuv420p, AAC 48 kHz, 162,067 s (trong 150–190 s; ≤ 180 s nên đủ điều kiện Shorts). `qc-video` pass, 0 fail. −15,0 LUFS, −1,68 dBTP, LRA 3,0. Đuôi im 0,69 s (≤ 0,7). Lệch lời–hình khai báo so với tiếng đo: tối đa 0,06 s, trung bình 0,009 s (≤ 0,25). Phụ đề 67 cue, tối đa 2 dòng × 28 ký tự, khớp tiếng ≤ 0,06 s. `qc-publish` pass (3 nền tảng đủ tiêu đề/mô tả/hashtag + khai báo AI). |
| TUÂN THỦ | **ĐẠT CÓ 2 ĐIỂM CHƯA ĐẠT NGƯỠNG THỬ** (QC-01 R12/Y4; QC-02 R14) | Y1 đạt; nguồn: chỉ đồ hoạ Pillow/FFmpeg tự dựng, nền `tools/backgrounds`, 5 dáng Cáo của giám đốc, giọng VieNeu cục bộ, 5 âm chạm tự tạo → không có hình/clip ngoài hay hình AI nên không cần dòng mới ở `library/LICENSES.md`; không logo lạ, không nhãn «AI tạo»/«Ví dụ dựng» trên khung; khai báo AI ở `publish.json` ✓. R12: nền `security` 45,5% / 11 cảnh liền. R14: header 10,7% thời lượng. |
| TRẢI NGHIỆM | **ĐẠT PHẦN ĐO/XEM; CÓ LƯU Ý; PHẦN NGHE = CHƯA KIỂM** | Hook, mạch kể, kết, Visual-first đạt (chi tiết dưới). Y4 chưa đạt (cùng QC-01). Y6–Y8 mới kiểm văn bản/số đo. |

### Bảng phát hiện (mọi lỗi/cảnh báo; M-xx của công cụ, QC-xx của QC bằng mắt)

| Mã | Nhóm | Mốc | Bằng chứng | Mức | Đề nghị |
|---|---|---|---|---|---|
| QC-01 (= M-33, M-35) | TUÂN THỦ · R12/Y4 | S15–S25 · 78,57–152,27 s | `security` 73,7/162,07 s = **45,5%** (ngưỡng ≤ 40%), **11 cảnh liền** (ngưỡng ≤ 4); T8 là 32,2%/2 cảnh. Mắt: `board-06..10.png` cùng nền xanh-tím có chấm mạng + mặt bàn nghiêng ở S15–S23; S24–S25 cùng nền, chỉ đổi bố cục tấm/cổng. `plan.md` (bảng nền) tách F/G/H để ghi "mỗi nền < 25%" nhưng cả ba cùng chủ đề `security` (F 42 s + G 23 s + H 10 s = 75 s ≈ 43,6% của 172 s). Bố cục có đổi (25 nhóm bố cục, 4 cỡ cảnh) nên đây không phải "một cảnh xuyên suốt", nhưng nền/không khí giống nhau suốt hơn 1 phút. | **Chưa đạt ngưỡng thử — lỗi thiết kế** (storyboard APPROVED; `qc-measure` đèn cảnh báo) | Đạo diễn hình ảnh đổi `environment` của ít nhất G (S20–S23) và/hoặc H (S24–S25) sang chủ đề khác (incident/office/database) để chuỗi `security` ≤ 4 cảnh và tổng ≤ 40%; chỉ dựng lại hình (giọng/mốc giữ nguyên). |
| QC-02 | TUÂN THỦ · R14/D3 | cả video | Header chỉ ở S09–S10 (35,47–44,2 s) và S20 (128,7–133,5 s) = 17,3 s = **10,7%** (R14: "phần lớn thời lượng trừ cảnh cần tối đa minh hoạ"). `plan.md` mục Opening/Header ghi chủ ý ẩn ở S11–S19, S21–S27. Header có mặt thì đạt: cỡ ≈ 62 px, x=105, y≈265–315 (trong vùng an toàn ≥ 250), không che Cáo/phụ đề/sơ đồ (`f38.png`, `header-zones.png`). | **Chưa đạt ngưỡng thử — lỗi thiết kế** (nhẹ hơn QC-01) | Đạo diễn hình ảnh thêm header (hoặc chip chương) ở các cảnh còn chỗ trống phía trên (đã thấy khoảng trống y≈250–420 px ở S11–S16: `frame-57.5`, `frame-66`, `frame-70`, `f98`; S26–S27 thì cửa sổ nền đã lên tới y≈245 nên không còn chỗ) hoặc giám đốc chấp nhận mức hiện tại. |
| M-34 | TUÂN THỦ · R12 | S09–S13 · 31,67–74,13 s | Nền `code` 5 cảnh liền (ngưỡng 4), 26,2% thời lượng. Mắt: S09–S11 là khung giao diện chia đôi, S12–S13 là sơ đồ dọc dạng nút trợ lý (`board-03/04/05`). | Cảnh báo nhẹ — gộp xử lý cùng QC-01 | Đổi một cảnh trong chuỗi (vd S13) sang chủ đề khác nếu làm lại. |
| M-01, M-02, M-03 | TRẢI NGHIỆM · R4 | S11 44,2–59,13 s · S13 68,17–74,13 s · S24 143,3–148,7 s | Trung vị 0 khối hoạt động, tĩnh 49,7% / 59,3% / 49,1%. Ảnh ghép `sheet-S11/S13/S24.png`: S11 đổi trạng thái mỗi ~2 s (hàng đỏ lộ → khoanh → cặp ô → đường nối → vệt rà); S13 đổi mỗi 1 s (khoá hạ, nhánh đứt dài ra, hàng đỏ hiện, đường nối kéo về); S24 đổi mỗi 1 s (nét xanh, chốt khoá lần lượt hạ). Đoạn tĩnh dài nhất toàn video 1,4 s (102,5–103,9 s) < 1,5 s. | **Loại trừ** — cảnh giữ có tiến trình, không phải cảnh chết; số đo thấp vì chuyển động là nét mảnh | — |
| M-13 | TRẢI NGHIỆM · Y7 | 56,14–59,19 s (S11) | Im 3,055 s (ngưỡng 3 s). `board-04.png` ô 56 s/58 s và `sheet-S11.png`: hình vẫn đổi (đường nối từ dấu cộng + vệt rà quanh hàng đỏ). Giữ-sau-lời S11 = 2,996 s đúng D2 (cảnh High 2–3 s). | **Loại trừ** — nghỉ có chủ đích, hình đang đổi | Giám đốc nghe nhịp. |
| M-05…M-12, M-14…M-30 | TRẢI NGHIỆM · Y7 | 26 khoảng lặng 0,81–3,06 s | Đều trùng ranh giới ý/cảnh hoặc nhịp giữ sơ đồ; đối chiếu `board-01..10`. 3 khoảng ≥ 2 s (56,14 · 65,86 · 99,94 s) đều nằm ở cảnh High với hình còn chuyển (vệt rà/tia nối/dải đối chiếu). | Thông tin — loại trừ | — |
| M-31, M-32 | TRẢI NGHIỆM · Y1 | 0–0,61 s «Tổng đúng.» · 31,67–32,18 s «Khoan!» | Cue < 0,8 s nhưng khớp tiếng (Δ ≤ 0,003 s); câu thật sự ngắn (`board-01`, `board-03`). | **Loại trừ** | — |
| M-45 | TRẢI NGHIỆM · R13 | S01 0–2 s | Cảnh Low 2 s < 3 s. Opening/hook được ngoại lệ (D1 "cảnh dưới 3 s chỉ ở opening/hook"); giữ-sau-lời 0,695 s ≥ 0,5. | **Loại trừ** | — |
| M-46 | TRẢI NGHIỆM · R17 | S01 1 s | 10 từ/ký hiệu cùng lúc (ngưỡng 8): tiêu đề 5 từ + «2 + 3» + «5». Là 3 nhóm (≤ 3), cỡ lớn, đọc được ở 360×640 (`frame-open-mid.png`, `board-01`). Lưu ý nhỏ: đáy khung tiêu đề (y≈470) sát hộp «2 + 3» (y≈473). | **Loại trừ có điều kiện** (opening) | Nếu làm lại: nới 15–20 px giữa tiêu đề và hộp phép tính. |
| M-36…M-43 | TRẢI NGHIỆM · R12 camera | S01, S02, S05, S06, S09, S17, S22, S26 | Hiệu RGB 8,4–16,5/255 giữa hai khung. Xem `camera-S09/S17/S26.png`: S09 pan_left lộ khung dài bên phải; S17 pan_right lộ hàng đỏ; S26 push_in lộ cả bản đầy đủ + cổng. Chuyển động phục vụ nội dung (lộ vật/quan hệ), không phải để đạt chỉ số. | Thông tin — **đạt** | — |
| M-04, M-44, M-47 | — | — | Thông tin: đoạn tĩnh 1,4 s; tốc độ đọc 4,68 âm tiết/s (+11,83%); phụ đề phủ 72,2%. | Thông tin | — |
| QC-03 | TRẢI NGHIỆM · R11/R19 | S13 · 68,2–74,1 s (L32) | Khẳng định "AI có thể làm theo dòng ẩn" chỉ có hình nhánh nét đứt + cổng khoá (`frame-70.png`, `sheet-S13.png`); file không chạy trong cảnh này. Sự kiện hình trực tiếp nối dòng đỏ → gửi file chỉ xuất hiện ở S26 (≈152–158 s, `frame-153.png`, `camera-S26.png`). Có S14 (nhật ký + khay ngoài) làm hệ quả. | Lưu ý (chứng minh một phần) | Nếu làm lại: cho file chạy theo nhánh đỏ trong S13 (không hướng dẫn tấn công, chỉ minh hoạ). |
| QC-04 | TRẢI NGHIỆM · R13 Information QC | 36,8–49,4 s (S10–S11) và 59–74 s (S12–S13) | `concepts` khai S10 = 0, S11 = 0 nhưng lời giới thiệu cùng lúc: plugin≡công cụ, mô tả công cụ, ứng dụng đưa mô tả, giao diện chỉ hiện phần đầu; 59–74 s: nạp công cụ, bộ đếm lượt gọi, "AI làm theo/quyền", tool poisoning. Đọc `script.md` bảng ngữ nghĩa + xem `board-03/04/05`. Công cụ chỉ cộng số khai nên không bắt được. | Lưu ý, **thủ công/CHƯA KIỂM** (cần giám đốc xem trên điện thoại xem có quá dày không) | Khai `concepts` đúng thực tế; nếu giám đốc thấy dày, thêm 1–2 s giữ ở S10 hoặc tách S13. |
| QC-05 | TRẢI NGHIỆM · Y2/Y3 | S09 ≈ 34–36 s | Cáo (≈ 148 px) che ≈ 80 px mép dưới tấm dài (`camera-S09.png`, khung phải); phần che chỉ là vạch mô tả, không che nội dung chính. | Thấp | Dịch Cáo ra ngoài mép tấm nếu làm lại. |
| QC-06 | TRẢI NGHIỆM · R3 | 2,5 s (S02) · 66 s (S12) | Nhãn «Bên ngoài» rộng hơn viên thuốc của nó (chữ x≈722–993 so với viền 733–985, `frame-2.5.png`); nhãn «Lượt gọi plugin» chạm viền trên của khung đếm (`frame-66.png`). | Thấp (thẩm mỹ) | Nới nền nhãn/khoảng cách nếu làm lại. |
| QC-07 | TRẢI NGHIỆM · R7 | thumbnail.jpg | Bìa lấy S02 3,03 s: «2 + 3», «5», file trong khay «Bên ngoài» đọc được ở 180×320 (`thumb-180x320.png`) nhưng không có tiêu đề/chủ đề nên không tự nói "plugin AI". | Thấp (gợi ý) | Cân nhắc bìa từ khung opening (có tiêu đề). |
| QC-08 | TRẢI NGHIỆM · R19 | S11 ≈ 54–56 s (L28) | Cặp ô trống/ô xám là ẩn dụ "ký tự không hiển thị", không nhãn; tắt tiếng khó hiểu (`frame-57.5.png`). Chỉ chiếm ~2 s. | Thấp | — |
| QC-09 | TUÂN THỦ · R8 | `script.md`/`plan.md` | Tài liệu vẫn ghi 172 s, "dòng ẩn ≈ 55 s", "trả lời ≈ 162,5 s"; bản dựng 162,07 s, lời "Dòng ẩn nằm dưới mép này" ở 49,45 s, "Dòng ẩn này đã dẫn…" ở 152,27 s. Chưa thấy bước Kịch bản/Đạo diễn duyệt lại mốc theo giọng thật. | Thấp (đồng bộ tài liệu, không ảnh hưởng thành phẩm) | Kịch bản/Đạo diễn cập nhật mốc. |
| QC-10 | AUDIO · Y6 | toàn video | Rescue/Producer dùng `atempo` 0,935 (dẫn) / 0,897 (kỹ thuật) tức giãn giọng ≈ 7–10% để về 4,68 âm tiết/s (giọng Hải Đăng thô nhanh +28% so T8). Giãn < 1 có thể gây vang/méo. Không có số đo cho việc này. | **CHƯA KIỂM — giám đốc nghe** | — |

### So với bản chuẩn T8 (`qc-measure --baseline`)

| Chỉ số | T9 | T8 | Δ |
|---|---|---|---|
| Thời lượng | 162,07 s | 41,9 s | +120,2 (trong 150–190; thấp hơn mục tiêu ≈ 180 s khoảng 18 s) |
| Số cảnh · TB/cảnh · cảnh < 2 s | 27 · 6,00 s · 0 | 10 · 4,19 s · 0 | +17 · +1,81 s |
| Lần cắt / 10 s | 1,60 | 2,15 | −0,54 |
| Tĩnh · đoạn tĩnh dài nhất | 34,9% · 1,4 s | 22,7% · 1,0 s | +12,1 · +0,4 |
| Nhóm bố cục · chuỗi cùng chủ đề dài nhất | 25 · 11 cảnh | 10 · 2 cảnh | +15 · +9 (**xấu đi**) |
| Chủ đề nền lớn nhất | 45,5% (security) | 32,2% | +13,3 (**xấu đi**) |
| Chữ minh hoạ/phút · % thời lượng có chữ · chữ lặp lời | 14,07 · 27,7% · 0 | 41,53 · 48,8% · 0 | −27,5 · −21,1 · 0 (**tốt lên**) |
| Phụ đề: cỡ · % phủ | 56 px · 72,2% | 70 px · 75,9% | −14 px · −3,8 |
| Tốc độ đọc (âm tiết/s có tiếng) | 4,68 | 4,185 | +11,83% (đúng mục tiêu 4,6–4,8) |
| Tỉ lệ lặng · thời lượng có tiếng | 35,3% · 104,9 s | 30,4% · 29,2 s | +4,8 điểm |
| Giữ sau lời nhỏ nhất (Low/Medium/High) | 0,534 / 1,008 / 2,307 s | — | đạt ≥ 0,5 / 1,0 / 2,0 |
| Header · opening | 10,7% · có (0,10–2,0 s) | 0 · không | mới |
| −LUFS · đuôi im | −15,0 · 0,69 s | −14,4 · 0,536 s | −0,6 · +0,15 |
| Cảnh báo công cụ | 11 | 4 | +7 |

### 5 câu hỏi người xem lạ

1. **Đạt.** 0,10–2,0 s: tiêu đề «Dòng ẩn trong mô tả plugin AI» + «2 + 3 = 5» + file rời khung (`frame-open-mid/end.png`); lời «Tổng đúng. File đã gửi.». (Lý do quan tâm ở dạng hình/hệ quả, chưa nói rõ "file nội bộ" — mức nghiêm trọng rõ ở 17 s.)
2. **Đạt.** 2,5 s file nằm trong khay «Bên ngoài» (`frame-2.5.png`); 3,07–4,15 s mở nhật ký; 7,45 s câu hỏi «Vậy ai ra lệnh gửi file?».
3. **Đạt một phần.** Tắt tiếng + che phụ đề (`nocaption-board.png`): hiểu được "bản đầy đủ có hàng đỏ dưới mép", "bản đổi sau duyệt", "chặn quyền thì file dừng ở vạch" (S11, S16, S25). Khó hiểu nếu không có lời: nối "AI làm theo dòng ẩn → gửi file" (QC-03), cặp ô vuông (QC-08).
4. **Đạt.** Mọi khoảng liên tục không đổi ≤ 1,4 s (< 1,5 s); camera lộ vật có chủ đích; 0 chữ lặp lời (similarity cao nhất 0,429 < 0,6); bố cục đổi theo cảnh. Riêng nền xem QC-01.
5. **Đạt.** S26 (152,27–158,3 s) trở lại đúng màn hình hook, khoanh hàng đỏ, «Quyền chỉ giảm thiệt hại, không sửa mô tả»; S27 hỏi «Bạn kiểm mô tả hay quyền trước?» + «Lưu lại kẻo quên nha!» (CTA tự nhiên); đuôi im 0,69 s; bìa đọc được ở 180×320 (xem QC-07).

### TRẢI NGHIỆM — Y1–Y8

| Nhóm | Kết luận | Bằng chứng |
|---|---|---|
| Y1 | Đạt | Chỉ chữ có trong cột "Chữ trên màn hình": tiêu đề, «Bên ngoài», header, «Lượt gọi plugin», «0», «5», «Bản lưu», «Đang nạp», «BA BƯỚC KIỂM»; 0 chữ lặp lời; không «AI tạo»/«Ví dụ dựng» trên mọi khung đã xem; khai báo AI ở `publish.json`. |
| Y2 | Đạt | Cáo S01, S03, S09, S17, S20, S26, S27 = 33,67 s = 20,8% (≤ 25%); mở (S01, S03) / giữa (S09, S17, S20) / kết (S26–S27); vắng ở các cảnh giải thích S11–S16, S21–S25. |
| Y3 | Đạt (lưu ý QC-05) | Cáo ≈ 146–160 px (13,5–14,8% chiều ngang); đáy y≈1285; không che nội dung chính. |
| Y4 | **Chưa đạt** | QC-01 (nền `security` 45,5%, 11 cảnh liền). Phần nhất quán phong cách (bảng màu, nghĩa màu xanh/đỏ/vàng/lục, kiểu vẽ) đạt. |
| Y5 | Đạt | Tình huống → vấn đề → cơ chế → ví dụ rug pull → giải pháp → quay về hook; đối chiếu `script.md` bảng cảnh. |
| Y6 | Đạt phần đo; **CHƯA KIỂM nghe** | 4,68 âm tiết/s (+11,83%); [kỹ thuật] giãn nhiều hơn [dẫn] (0,897 vs 0,935). Độ tự nhiên, tốc độ cảm nhận, méo do `atempo` < 1: giám đốc nghe. |
| Y7 | Đạt phần đo; **CHƯA KIỂM nghe** | 26 khoảng lặng ≥ 0,8 s trùng ranh giới ý/cảnh, hình còn chuyển; lặng dài nhất 3,06 s (S11) có chủ đích. |
| Y8 | Đạt phần văn bản; **CHƯA KIỂM nghe** | `phonemes.py` mã 0, 67 dòng, 0 lỗi; từ điển riêng 4 mục `verified:false`; 5 clip `assets/voice/term-check/{ai,file,plugin,tool-poisoning,rug-pull}.wav`. |

### Audio / Visual / Information / Visual-first (D6–D7)

- **Audio:** tốc độ đo được đạt; tỉ lệ lặng 35,3% (T8 30,4%); đuôi 0,69 s ≤ 0,7; kéo/nuốt chữ, phát âm thật, nhấn nhá **CHƯA KIỂM — giám đốc nghe**.
- **Visual:** opening đạt (0,10–2,0 s, có tiêu đề, `frame-open-*`); header trong vùng an toàn, không che Cáo/phụ đề/sơ đồ nhưng chỉ 10,7% (QC-02); giữ-sau-lời đạt; không cảnh tĩnh vô nghĩa (M-01..03 loại trừ); hình khớp lời: lệch ≤ 0,06 s, các khung ở 49,8 s (hàng đỏ bắt đầu lộ cùng «Dòng ẩn»), 52,5 s, 150,5 s khớp lời.
- **Information:** ví dụ cụ thể có (file góc khuyết, tờ giấy gập, bản lưu vs bản đang nạp); thứ tự logic đạt; không đoạn chỉ đọc lý thuyết; nhịp thông tin 36,8–49,4 s và 59–74 s có thể dày (QC-04, CHƯA KIỂM).
- **Visual-first (R17–R19):** 38 từ chữ minh hoạ (14,07/phút), tối đa 1 kinetic (S01); keyword có hình 100% (tool); hình minh hoạ thật ở cả 27 cảnh (xem bảng lưới 2 s); keyword đúng trọng tâm; đối tượng/quan hệ khớp bảng "Đối chiếu dữ kiện và nguồn" của script (MCP, OWASP) — không thấy sai kỹ thuật; hạn chế QC-03, QC-08. "Đủ thời gian quan sát" mới đo (giữ-sau-lời) — cảm nhận trên điện thoại **CHƯA KIỂM**.

### Không đo/kiểm được

Nghe giọng và tốc độ cảm nhận, méo `atempo`, phát âm 5 thuật ngữ, ngữ điệu; độ dễ đọc trên điện thoại thật; xác nhận từng khung chuyển cảnh (chỉ xem lưới 2 s + 18 khung).

## QC — lỗi thiết kế (lượt 1, giữ `review`, đã `escalate` QC-THIẾT-KẾ)

1. **R12/Y4 (QC-01):** `security` 45,5% / 11 cảnh liền S15–S25 (78,57–152,27 s). Đề nghị Đạo diễn hình ảnh đổi nền G (S20–S23) và/hoặc H (S24–S25) sang chủ đề khác; giữ nguyên giọng, mốc, nội dung.
2. **R14 (QC-02):** header 10,7%. Đề nghị thêm header/chip chương ở cảnh còn chỗ trống phía trên, hoặc giám đốc chấp nhận.
3. Kèm (không chặn): QC-03 (S13 chưa cho thấy file chạy theo nhánh đỏ), QC-04 (khai `concepts` thấp hơn thực tế), M-34 (`code` 5 cảnh liền).
**Quyết định chờ giám đốc:** (a) chấp nhận → `ready` sau khi nghe kiểm Y6–Y8 (đặc biệt `atempo` < 1); hoặc (b) làm lại phần hình theo mục 1–2 (chỉ dựng lại hình, giọng/mốc giữ).

## Bài học cho luật (đề xuất, QC không tự sửa `docs/`)

- R12 đo theo chủ đề nền: nên ghi rõ trong luật rằng chia một chủ đề thành nhiều mã nền (F/G/H cùng `security`) không làm giảm tỉ lệ khi `qc-measure` tính theo chủ đề.
- `concepts` trong storyboard là số tự khai; `qc-measure` chưa đối chiếu với thuật ngữ mới thật trong lời (S10 khai 0 nhưng giới thiệu 3–4 thuật ngữ). Cần cách đếm độc lập hoặc QC thủ công.
- R14 "phần lớn thời lượng" chưa có số; nên chốt ngưỡng (vd ≥ 50%) để Đạo diễn hình ảnh và QC dùng chung.

## LƯỢT SẢN XUẤT 2 — LÀM LẠI THEO D8 (thư ký, 19/11/2026 tối) — ĐỌC TRƯỚC NHẤT

Giám đốc trả bản dựng đầu (162,07 s) vì 4 lỗi: (1) giọng mất chữ đầu câu, (2) không có phần giới thiệu, (3) không có header xuyên suốt, (4) không thấy yêu cầu Visual-first (nhãn keyword + nhấn chữ động). Số đo bản đầu: `docs/baseline/T9v1-qc-auto.json` (67/67 câu bị cờ biên, header 10,7%, 14 từ chữ/phút). Đối chiếu: `docs/audit-T9.md`; luật: `docs/chat-luong-xem.md` D8 (R20–R23). `script.md` và `storyboard.json` đã được duyệt lại (S00 opening 2,4 s, 27 cảnh có `header_slot`, 179,68 s). **Các việc dưới đây thay cho cách làm của lượt 1; mã tạm lượt 1 trong `assets/_scratch/` (render_story.py, align_voice.py, mix_voice.py, generate_voice.py) chỉ để tham khảo, KHÔNG chạy lại.**

1. **Sinh lại giọng từ đầu** (không dùng lại `assets/voice/voice-aligned.wav`, `raw/`, `retimed/` của lượt 1; chuyển chúng vào `assets/_scratch/_v1/`). Mỗi câu một lần suy diễn (hoặc tách từ tệp nhiều câu CHỈ bằng `python tools/voice/splice.py split`). **Cấm** cắt theo `silencedetect −40 dB`/`silence_end` và cấm fade-in/out đè lên phần có tiếng — đó là nguyên nhân khả dĩ của lỗi "mất chữ đầu" (bản đầu cắt sát tiếng, 59/67 câu mở đầu ở mức âm cao). Giữ ≥ 40 ms lặng trước, ≥ 120 ms sau mỗi câu; ghép xong chạy `python tools/voice/splice.py check`, rồi `node tools/qc-measure.mjs` (`voice_edges`) — 0 câu cờ, hoặc ghi lý do từng câu. Tốc độ đo trên đoạn có tiếng 4,6–4,8 âm tiết/s (Hải Đăng đọc nhanh: atempo ≈ 0,90–0,95 hay hơn 1 tuỳ đo thật; `atempo` là phương tiện, số đo mới là tiêu chí). Không đạt tai người = CHƯA KIỂM, ghi rõ.
2. **Opening riêng S00 (2,4 s, không lời)** bằng `tools/motion/header.py::opening_plate` trước lời hook; tiếng đầu tiên sau opening. Thumbnail lấy khung hook (S01), kiểm ở 180×320.
3. **Header xuyên suốt** bằng `HeaderSpec` + `HeaderTrack` với bbox THẬT của sơ đồ/nhãn/Cáo/phụ đề từng cảnh, `header_slot` theo storyboard, đổi ô ở ranh giới cảnh; không ẩn cảnh nào sau opening; khe ≥ 24 px; chữ ≥ 52 px (chủ đề ≥ 40 px).
4. **Chữ keyword thật:** vẽ đủ `semantic_plan.texts` của từng cảnh — nhãn gắn đối tượng (`text.attach_label`), kinetic đúng 10 chỗ storyboard khai; nhãn thuật ngữ hiện ≤ 0,5 s sau lời gọi tên; không thêm chữ ngoài `texts` (tải chữ sát trần 45 từ/phút); phụ đề vẫn là lớp riêng 52–60 px, đốt SAU khi dựng `assets/_scratch/picture.mp4` (bản không phụ đề giữ cho QC).
5. **Nhật ký dựng:** dựng bằng `tools/motion/` với `RenderLog` rồi ghi `assets/render-log.json` và `assets/scenes.json` (`voice[]` là cửa sổ clip GỒM phần đệm). Phần vẽ tay ngoài thư viện phải tự ghi sự kiện tương đương hoặc ghi rõ "không có nhật ký" ở đây.
6. **Nền & Cáo:** theo `environment` của storyboard (≤ 4 cảnh liền cùng chủ đề, mỗi chủ đề ≤ 27%); Cáo nhỏ, 7 cảnh ≈ 13% (S26/S27 đổi một trong hai dáng nếu thấy lặp). Không nhãn «AI tạo»/«Ví dụ dựng» trên hình; khai AI ở `publish.json`.
7. **Thời lượng:** storyboard 179,68 s sát trần Shorts 180 s. Nếu đo TTS làm vượt 180 s: rút khoảng nghỉ Y7 ở S11/S16 trước (mỗi cảnh nghỉ 6+ s), KHÔNG tăng tốc giọng; thấy phải đổi mốc lớn thì báo (`escalate`).
8. **Trước khi giao QC:** tự chạy `node tools/qc-measure.mjs content/it/T9-dong-chu-an-trong-mo-ta-plugin-ai-co-the/ep01 --baseline docs/baseline/T8-qc-auto.json` (không dùng `--min/--max`), sửa hoặc ghi lý do mọi cờ D8 (R20–R23). Không sửa `tools/`: thấy thiếu thì ghi đề nghị vào mục này.
9. `final/` chỉ giữ thành phẩm cuối của lượt 2 (ghi đè `IT-T9-E01_9x16.mp4`, `captions.srt`, `publish.json`, `thumbnail.jpg`); bản lượt 1 giữ ở `assets/_scratch/_v1/` để so.

## Producer · Lượt 2 · Giọng đã chuẩn bị, chờ chốt thiết kế

Storyboard APPROVED chỉ định Pillow + FFmpeg. Đã đối chiếu 28 cảnh với cột chữ trên màn hình và rà lại các mốc theo 73 câu mới. `ffprobe` xác nhận video đang có trong `final/` là bản lượt 1 dài 162,067 s. Chưa dựng, xuất hay chạy QC trên MP4 lượt 2.

### Hai điểm thiết kế cần chốt

1. **S13.** Cột chữ ở `script.md:26` và nhịp kinetic ở `plan.md:91` ghi **Quyền thực thi**. `storyboard.json:1888` và `storyboard.json:1955` ghi **Quyền phù hợp**. Đề nghị Đạo diễn hình ảnh dùng **Quyền thực thi** cho nhãn gắn cổng và đồng bộ các tham chiếu trong S13. L33 vẫn đọc câu đã duyệt.
2. **Phụ đề khi có Cáo.** `storyboard.json:31` ghi rõ cần Claude chốt. Dải phụ đề y=1340–1500 nằm dưới đáy Cáo ở y=1280–1290, trong khi AGENTS.md yêu cầu phụ đề nằm phía trên đầu Cáo. Đề nghị giữ dải dưới theo D8 và vị trí Cáo theo storyboard, với hộp chữ cách Cáo ít nhất 50 px theo phương dọc. Phương án còn lại cần duyệt lại bố cục các cảnh có Cáo.

### Kết quả đo và mốc đề nghị duyệt

`pronounce.mjs check` trả mã 0 sau khi bỏ qua chín từ tiếng Việt không dấu. Đã chỉnh hai trường hợp “ai” thường ở L07 và L48 trong tệp đưa TTS theo ghi chú của kịch bản. `phonemes.py --lines assets/voice/v2/readings.json --extra assets/voice/pronunciation.local.json` trả mã 0. Sinh 73 WAV độc lập bằng Hải Đăng VieNeu cục bộ ở temperature 0,65. Tệp gốc ở `assets/voice/v2/raw/`, các bản đệm ở `assets/voice/v2/takes/`. Giữ ≥70 ms đầu và ≥150 ms cuối, không fade vào tiếng. Đối chiếu PCM sau atempo cho thấy bước bỏ lặng dư giữ đủ mẫu trên ngưỡng RMS −65 dBFS.

| Lần đo | atempo dẫn / kỹ thuật | Tốc độ theo cách đếm của QC | Tổng timeline có opening | Đuôi im ở −40 dB |
|---|---|---|---|---|
| Hiệu chỉnh ban đầu | 0,935 / 0,897 | 4,531 âm tiết/s | 189,900 s | 0,783 s |
| Đạt tốc độ yêu cầu, giữ các khoảng nghỉ | 0,975 / 0,935 | 4,716 âm tiết/s | 184,500 s | 0,794 s |
| Phương án rút nghỉ | 0,975 / 0,935 | 4,716 âm tiết/s | **179,267 s** | **0,661 s** |

Ở phương án 179,267 s, S11 và S16 giữ sơ đồ 2,0 s sau lời và giảm nghỉ giữa câu còn 0,40 s. S11 dài 14,000 s, lệch −2,000 s, và S16 dài 13,867 s, lệch −2,133 s so với storyboard. S19 có 10,767 s ở cả hai phương án đạt tốc độ, lệch +0,967 s. Đề nghị Kịch bản và Đạo diễn hình ảnh duyệt lại mốc chữ và động tác ở ba cảnh này trước khi dựng. Đầu tiếng đo được ở 2,478 s. Cách đếm của QC là 549 cụm chữ hoặc số, với 116,419 s có tiếng theo `silencedetect=n=-40dB:d=0.12`.

Lệnh `python tools/voice/splice.py check --wav <ep01>/assets/voice/v2/compact/voice.wav --windows <ep01>/assets/voice/v2/compact/windows.json` trả **73 câu, 0 biên vi phạm**. Hai phương án và số đo ở `assets/voice/v2/candidate/` và `assets/voice/v2/compact/`. Dựng nền ba lớp 1350×2400 bằng `tools/backgrounds/make_background.py` ở `assets/_scratch/backgrounds-v2/` cho E (`incident_31`), G (`office_41`), I (`security_59`) và J (`code_61`).

| Thuật ngữ | Văn bản TTS và âm vị | Nguồn | Clip nghe kiểm trong `assets/voice/v2/term-check/` |
|---|---|---|---|
| file | file · fˈaɪl | Riêng | `file.wav` |
| AI | eigh eye · ˈeɪ ˈaɪ | Chung | `ai.wav` |
| plugin | plugin · plˈʌɡɪn | Riêng | `plugin.wav` |
| tool poisoning | tool poisoning · tˈuːl pˈɔɪzənɪŋ | Riêng | `tool-poisoning.wav` |
| rug pull | rug pull · ɹˈʌɡ pˈʊl | Riêng | `rug-pull.wav` |

Phát âm thực, độ tự nhiên, tốc độ cảm nhận và nhịp nghỉ **CHƯA KIỂM — giám đốc nghe**.

## Rescue — quyết định (Claude, 19/11/2026, lượt 2 D8)

**Gốc rễ.** Không lỗi kỹ thuật. Ba điểm là quyết định thiết kế Producer không tự đổi được; Producer đã chuẩn bị đúng (73 câu, phonemes và `splice.py check` mã 0).

1. **S13 nhãn: dùng «Quyền thực thi».** `script.md` (cột chữ dòng 26, bản đồ dòng 81) và `plan.md:91` là nguồn sự thật. Đã sửa `storyboard.json` S13 cho khớp (`text_overlay`, keyword `term`, hai `relations`, `semantic_plan.texts[0].text`). Lời L33 giữ nguyên «quyền phù hợp» (nhãn là khái niệm gắn cổng, lời là câu nói tự nhiên). Chỉ đổi nhãn, không đổi mốc.
2. **Phụ đề: giữ dải dưới y≈1340–1500, 56 px, tối đa 2 dòng.** Lý do: D8/R17 coi phụ đề là lớp accessibility riêng ở dải dưới; dải nằm trong vùng an toàn y∈[250,1500]; không đè Cáo (đáy y≈1290, cách ≥ 50 px), không đè header (ô trên). Câu «phụ đề phía trên đầu Cáo» (AGENTS.md, mục Cáo) viết cho cảnh Cáo làm chính; dời phụ đề lên trên Cáo sẽ chui vào vùng sơ đồ y≈250–1320 và đè nội dung chính, trái R21. Đã ghi vào `visual_style_note`. Không cần giám đốc quyết; nếu giám đốc muốn thống nhất chữ luật thì sửa AGENTS.md ở phiên chính.
3. **Thời lượng: chọn phương án rút nghỉ 179,267 s** (atempo 0,975 dẫn / 0,935 kỹ thuật, 4,716 âm tiết/s, +12,7% so T8 4,185, trong dải +10–15%; đuôi im 0,661 s ≤ 0,7; ≤ 180 s Shorts, trong 150–190 s). Không tăng tốc để bù, không hạ chuẩn. Phương án 184,5 s bị loại vì vượt trần Shorts 180 s.

### Hướng dẫn cho Codex dựng lại
- Dùng bản `assets/voice/v2/compact/` (voice.wav + windows.json). Không sinh lại giọng.
- S11 14,000 s và S16 13,867 s (ngắn hơn storyboard 2,0/2,13 s): giữ sơ đồ ≥ 2,0 s sau lời cuối, nghỉ giữa câu 0,40 s (Y7 vẫn có nghỉ chủ đích). S19 10,767 s (+0,967 s): kéo dài giữ cuối cảnh, không thêm nội dung.
- Canh lại mọi mốc chữ/động tác trong S11, S16, S19 và các mốc kinetic từ S13 trở đi theo cửa sổ lời THẬT (0–0,5 s sau lời gọi tên, R22); giữ 10 nhịp kinetic, mỗi cảnh ≤ 1, khoảng cách ≥ 8 s. Không thêm chữ ngoài `semantic_plan.texts`.
- Chuyển cảnh gói trong thời lượng cảnh; tổng timeline có opening 179,267 s; chạy `qc-measure` (không `--min/--max`) trước khi giao QC.
- Tai nghe/độ tự nhiên: CHƯA KIỂM — giám đốc nghe.

## Producer · Thành phẩm lượt 2 D8

Đã dựng lại 28 cảnh từ storyboard APPROVED bằng Pillow, `tools/motion` và FFmpeg. Dùng nguyên bản giọng compact 73 câu đã được Rescue chốt, sau đó cân âm và ghép sáu hiệu ứng ngắn tự tạo theo kịch bản. Mốc hình theo cửa sổ thực của câu. S11 dài 14,000 s, S16 dài 13,867 s, S19 dài 10,767 s theo quyết định Rescue. Phụ đề 56 px nằm ở dải dưới như đã duyệt. S13 dùng nhãn «Quyền thực thi».

### Tệp giao

- `final/IT-T9-E01_9x16.mp4` · MP4 dài **179,267 s**, 5.378 khung, 9:16, 1080×1920, H.264 yuv420p 30 fps, AAC mono 48 kHz, 18.237.508 byte. Đã đối chiếu `ffprobe` và thứ tự hộp MP4 để xác nhận faststart.
- `final/thumbnail.jpg` · khung hook gần 4,633 s, thấy số 5, vạch và file trong khay. Đã mở [bản 180×320](assets/_scratch/d8/cover-180.png).
- `final/captions.srt` · đủ 73 câu nguyên văn, tối đa hai dòng và 28 ký tự mỗi dòng. ASS kiểm hợp lệ. Một số câu ngắn ở hook hiện dưới một giây để bám tiếng.
- `final/publish.json` · tiêu đề, mô tả và hashtag cho ba nền tảng. `ai_generated_content: true` và câu khai báo cuối từng mô tả.

Nguồn dùng trong hình là nền A/B/C/D/F/H ở `assets/_scratch/backgrounds/`, nền E/G/I/J ở `assets/_scratch/backgrounds-v2/` và năm dáng Cáo có sẵn trong `brand/cao/poses/`. Đạo cụ và chuyển động hình học do xưởng dựng trong `assets/_scratch/render_d8.py`. Giọng Hải Đăng VieNeu cục bộ lấy từ `assets/voice/v2/compact/voice.wav`. Phần ghép và hiệu ứng tự tạo nằm trong `assets/_scratch/assemble_d8.py`. Lưu bản hình chưa phụ đề ở `assets/_scratch/picture.mp4`, bản lượt 1 ở `assets/_scratch/_v1/`.

### Kết quả đo trên bản giao

| Phép kiểm | Số đo |
|---|---|
| `qc-video --min 150 --max 180 --scenes assets/scenes.json` | **PASS**, 0 lỗi, 0 cảnh báo, −14,72 LUFS, đỉnh −1,85 dBTP. |
| `qc-publish` | **PASS**, 0 lỗi, 0 cảnh báo. |
| `qc-measure --baseline docs/baseline/T8-qc-auto.json` | Hồ sơ explainer, 0 lỗi, 37 cảnh báo có đối chiếu bên dưới. Thời gian giữ hình nhỏ nhất sau lời theo Low / Medium / High là 0,556 / 1,040 / 2,069 s. Lệch biên lời lớn nhất 0,092 s. |
| R20 | Opening riêng 2,400 s. Tiếng lời đầu được xác nhận ở 2,468 s. Tiêu đề 86 px trong vùng an toàn. |
| R21 | Header hiện 100% sau opening. 14 lần đổi ô, 0 lỗi cỡ chữ, kích thước thẻ hoặc khe với đối tượng. |
| R22 | Đối chiếu với timeline sau khi retime, đủ **61/61** mục chữ duyệt, sai lệch hiện chữ tối đa 0,033 s. 43,176 từ minh họa/phút bỏ phần nhận diện opening, tối đa 6 từ đồng thời ở các cảnh nội dung. 10 nhịp kinetic, khoảng cách 10,533–24,933 s. 0 nhãn xa đích hoặc thiếu đích. |
| R23 | `splice.py check` trên giọng compact, bản trộn và âm thanh giải mã từ MP4 đều đo 73 câu, 0 biên vi phạm. Báo cáo `voice_edges` của MP4 có **0/73** câu bị cờ. |

Bằng chứng gồm [báo cáo QC và các khung kiểm](assets/_scratch/d8/qc/report.md), [số đo QC MP4](assets/_scratch/d8/qc-video-final.json), [QC metadata](assets/_scratch/d8/qc-publish-final.json), [timeline](assets/scenes.json) và [nhật ký dựng](assets/render-log.json). Đã mở khung thật ở 360×640 ở opening, hook/log, giữa và gần cuối, cùng các nhịp đối chiếu S11, S16, S25 trên bản hình riêng. Đã xem khung giữa lúc header trượt ở S19.

### Đối chiếu các cờ thử của qc-measure

| Cờ | Đối chiếu |
|---|---|
| M-38–M-39 | S00 và S01 dài 2,400 và 2,267 s là ngoại lệ opening/hook đã duyệt trong plan. |
| M-40 | 10 từ nhận diện của S00 gồm hai dòng tiêu đề và nhãn chủ đề đã duyệt. Sau opening, tổng tối đa 6 từ minh họa hiện cùng lúc theo nhật ký. |
| M-41, M-75 | «Mô tả công cụ» là nhãn ba từ đã duyệt gắn ngay dải minh họa S10. Phép so cụm từ đánh dấu 75% do ba từ đều có trong L22. |
| M-43–M-53 | S04/S05/S08/S09/S14/S19/S20/S26 trượt một thẻ trong 0,4 s. S17/S23/S24 cho thẻ ở ô mới hiện tăng dần từ 70% lên 100% trong 0,4 s để chừa tấm hoặc dải chip. Bộ đo suy ra thời gian đổi ô từ lúc hai ô cùng hiện nên báo 0 s với các chuyển động một thẻ. S11/S12/S16 có hai ô hòa trong khoảng chuyển. |
| M-54–M-74 | S00 có cả tiêu đề và nhãn chủ đề, được ghi ở vai trò opening riêng. Ở các cảnh còn lại, từ khóa mô tả ý như «mép cắt», «phần khuất» và «đối chứng quyền gửi» được vẽ thành vật hoặc quan hệ, hoặc mang nhãn rút gọn đúng `semantic_plan.texts`. Phép đo so từng `keywords[].term` với chữ thật nên báo các từ khóa dùng hình. Tỉ lệ 86,885% của công cụ còn dùng mốc storyboard trước retime và bỏ cặp chữ ở opening. Đối chiếu trực tiếp với `scenes.json` sau retime cho đủ 61/61 mục. |

### Y1–Y8

| Nhóm | Kiểm tra |
|---|---|
| Y1 | Chữ và mốc theo storyboard/kịch bản, phụ đề riêng. Đã mở khung thật để kiểm dấu và lề. Khai báo AI trong metadata. |
| Y2 | Cáo ở S01/S03, S09/S17/S20 và S26/S27. Tổng 23,80 s, tương ứng 13,28%. |
| Y3 | Bbox thực rộng 146–160 px. Dáng theo kịch bản, chừa dải phụ đề ở dưới. |
| Y4 | Bốn chủ đề office, incident, code và security từ nền ba lớp có sẵn. Chủ đề nhiều nhất 26,76% thời lượng, nhiều nhất bốn cảnh liên tiếp. Đã đối chiếu các cảnh có pan/push/pull/tracking bằng cặp khung thật. |
| Y5 | Hook thấy phép cộng và file ra ngoài. Log dẫn đến hai khung mô tả, bản đổi sau duyệt và ba cách kiểm. S26 quay lại đúng màn hình hook, nhánh gửi và lượt bị chặn. |
| Y6 | Giữ atempo dẫn 0,975 và kỹ thuật 0,935 của phương án đã duyệt. Bản giọng compact đo 4,716 âm tiết/s. Trên bản trộn AAC, `qc-measure` đếm 122,57 s trên ngưỡng −40 dB và cho 4,479 âm tiết/s (+7,0% so T8), thấp hơn mục tiêu 4,6–4,8. Chuẩn hóa làm phần âm nhỏ vượt ngưỡng ở thêm khoảng 6,16 s. Mốc câu và tốc độ phát của nguồn giữ nguyên. Tốc độ cảm nhận và độ tự nhiên **CHƯA KIỂM — giám đốc nghe**. |
| Y7 | Khoảng nghỉ theo timeline compact. Đuôi im đo 0,586 s. Đoạn hình tĩnh dài nhất 1,2 s ở phép lấy mẫu 10 Hz. Phần giữ sau lời ở các cảnh High có dải rà, đường nối hoặc chuyển cữ. Nhịp và mức hiệu ứng **CHƯA KIỂM — giám đốc nghe**. |
| Y8 | `phonemes.py` mã 0, kiểm 73 dòng, 0 lỗi. Clip nghe kiểm cho AI, file, plugin, tool poisoning, rug pull ở `assets/voice/term-check/`. Phát âm thực **CHƯA KIỂM — giám đốc nghe**. |

## QC — lượt 2 (Claude, bản D8 179,267 s, 19/11/2026)

Đo độc lập: `node tools/qc-measure.mjs <ep01> --baseline docs/baseline/T8-qc-auto.json` (hồ sơ explainer) → **0 lỗi · 37 cảnh báo · 75 phát hiện**; báo cáo `assets/_scratch/qc-auto/report.md`. Đã xem: 12 bảng `board-*` (2 s/khung, phủ 28 cảnh), `header-zones`, `frame-open-mid`, `thumb-180x320`, `nocaption-board`, `textheavy-S11`, 3 khung full-res QC tự lấy (`qc-f66`, `qc-f105`, `qc-f177`) + 1 cắt `qc-f107crop`. Tổng 20 ảnh/khung đã mở. (Các `frame-*.png` lẻ cũ trong thư mục là của lượt 1, không dùng.) `final/` đúng 4 thành phẩm. Chưa nghe âm thanh.

### Phán quyết lượt 2: **FAIL — lỗi dựng sửa được (1 lỗi, nhỏ) → `production`.** Không có lỗi thiết kế mới; hai lỗi thiết kế lượt 1 (nền 45,5%, header 10,7%) đã hết (nền lớn nhất 26,76%, chuỗi tối đa 4 cảnh; header 98,66%/100% sau opening).

| Trục | Kết luận | Bằng chứng chính |
|---|---|---|
| KỸ THUẬT | **ĐẠT** | 1080×1920, 30 fps, h264/yuv420p, AAC, 179,267 s (≤ 180 s Shorts, trong 150–190), −14,72 LUFS, đuôi im 0,586 s ≤ 0,7; lệch lời–hình tối đa 0,092 s (TB 0,075); phụ đề 73 cue ≤ 2 dòng × 28 ký tự, lệch cue–tiếng ≤ 0,022 s; R23 `voice_edges` 0/73 câu cờ; `qc-publish` pass. |
| TUÂN THỦ | **ĐẠT** (R3 ghi ở TRẢI NGHIỆM) | Nguồn: đồ hoạ Pillow/FFmpeg + nền `tools/backgrounds` + 5 dáng Cáo + giọng VieNeu cục bộ → không hình ngoài/AI nên không cần dòng `LICENSES.md` mới; không logo lạ, không nhãn «AI tạo» trên hình; khai AI ở `publish.json`. R12: security 26,76% / chuỗi 4 (≤ 40%/≤ 4). R20 opening 2,4 s riêng, tiếng đầu 2,468 s. R21 header phủ 100% sau opening, 14 lần đổi ô, 0 lỗi cỡ/khe, chữ ≥ 52 px (`header-zones.png`). |
| TRẢI NGHIỆM | **CHƯA ĐẠT 1 điểm dựng (QC-11); phần nghe CHƯA KIỂM** | QC-11 nhãn bị che ở S16. Còn lại đạt phần đo/xem. |

### Bảng phát hiện

| Mã | Nhóm | Mốc | Bằng chứng | Mức | Đề nghị |
|---|---|---|---|---|---|
| **QC-11** | TRẢI NGHIỆM · R3/Y1 (chữ chồng, đủ dấu) | S16 · ≈ 105,5–110 s (cảnh 99,1–112,967 s) | `board-07.png` ô 106/108 s và `qc-f107crop.png`: nhãn «Bản lưu» bị nhãn «Bản đang nạp» đè, chỉ còn «Bản lu» (mất «ưu»), hai khung nhãn chạm nhau; ở 105 s (`qc-f105.png`) hai nhãn sát không khe. Cảnh High, thời điểm đang so hai bản. | **FAIL (lỗi dựng, nhẹ)** | Sản xuất: tách vị trí hai nhãn khi hai tấm chồng (đổi nhãn «Bản lưu» sang mép trái-trên của tấm trái hoặc dời «Bản đang nạp» sang phải ≥ 24 px khe), dựng lại S16 và chạy lại `qc-measure`; không đổi giọng/mốc. |
| QC-12 | TRẢI NGHIỆM · R3 | S27 · ≈ 177 s | `qc-f177.png`: nhãn «Mô tả» đè lên vạch đầu tấm mô tả (sát chữ của vạch đầu), nhãn «Quyền» vừa khít khung. | Thấp (thẩm mỹ) | Nâng nhãn «Mô tả» ≥ 12 px khỏi vạch nếu dựng lại S16 thì sửa luôn. |
| M-37 | Audio · Y6 | cả video | Tốc độ đọc **4,479** âm tiết/s (+7,03% so T8 4,185) < dải mục tiêu 4,6–4,8 (+10–15%). Producer ghi bản giọng compact 4,716; QC đo trên MP4: có tiếng 122,575 s so với 116,419 s ở compact (chuẩn hoá/hiệu ứng kéo thêm ≈ 6,2 s lên trên −40 dB). | Cảnh báo — **không chặn** (số đo nhạy với chuẩn hoá/hiệu ứng; nâng thêm sẽ vượt 180 s) | Giám đốc nghe tốc độ cảm nhận. |
| M-38, M-39 | Information Pacing · R13 | S00 2,4 s · S01 2,267 s | Cảnh Low < 3 s; ngoại lệ opening/hook đã duyệt (plan); giữ-sau-lời S01 0,594 s ≥ 0,5. | Loại trừ | — |
| M-40, M-54, M-55 | R17/R22 | S00 · 0,12–2,4 s | 10 từ cùng lúc (tiêu đề 6 + nhãn chủ đề 4); xem `frame-open-mid.png`: 2 khối chữ lớn (nhãn chủ đề ≈ 40 px, tiêu đề ≈ 86 px), đọc được ở 360×640. Công cụ báo thiếu chữ vẽ thật vì opening đã có chữ nhưng khớp literal khác. | Loại trừ (opening) | — |
| M-41, M-75 | R19/R22 | S10 · 43,9–47,5 s | Nhãn «Mô tả công cụ» 3 từ (similarity 0,75 với L22). Là nhãn thuật ngữ gắn dải minh hoạ (R22), không phải câu chép lời. | Loại trừ có điều kiện | — |
| M-43…M-53 | R21 | S04, S05, S08, S09, S14, S17, S19, S20, S23, S24, S26 | Đổi ô header: nhật ký không ghi độ mờ khi chỉ một ô hiện. `header-zones.png` (12 ô) và các bảng `board-*` quanh mốc đổi cảnh không thấy hai header cùng lúc hay header đè đối tượng; Producer ghi trượt 0,4 s. Chưa xem từng khung chuyển cảnh. | Loại trừ có điều kiện; **chuyển ô mượt CHƯA KIỂM** | Giám đốc xem trên điện thoại. |
| M-56…M-74 | R22 | 19 mục keyword ở S02–S26 | 21 keyword không khớp literal chữ vẽ; QC xem `board-*`: phần lớn đã có nhãn rút gọn đúng đối tượng («Nhật ký», «Bên ngoài», «Ký tự ẩn», «Bản đầy đủ», «Bản lưu», «Bản đang nạp», «Hàng đã đổi», «Quyền thực thi», «Bộ quét», «Chặn quyền gửi»); keyword như «mép cắt», «dấu duyệt», «khung xem trước» được vẽ thành vật/quan hệ. 96,4% cảnh có chữ vẽ thật (≥ 80%), 43,18 từ/phút (20–45), tối đa 6 từ đồng thời, 10 kinetic (1,395/25 s), khe ≥ 10,5 s, 0 nhãn xa/thiếu đích. | Loại trừ có điều kiện (số đo đạt, tên gọi bằng nhãn rút gọn) | — |
| M-01, M-02…M-27 | R4/Y7 | tĩnh 58,7–59,9 s (1,2 s); 26 khoảng lặng 0,82–2,55 s | Tĩnh < 1,5 s; lặng trùng ranh giới câu/cảnh, 3 khoảng ≥ 2 s ở S11/S12/S16 (High) với hình còn chuyển (`board-04/05/07`). | Loại trừ | Giám đốc nghe nhịp. |
| M-28…M-36 | R12 camera | S00, S01, S02, S05, S06, S09, S17, S22, S26 | Hiệu RGB 9,1–17,3/255; `camera-S09/S17/S26` lộ vật/quan hệ phục vụ nội dung. | Đạt | — |
| M-42 | Visual-first | cả video | Phụ đề 74,0% thời lượng, 549 từ; chữ minh hoạ 139 từ; 56 px dải dưới (y≈1467), 0 chữ lặp lời đáng kể ngoài M-41. | Thông tin | — |

### Bảng so với T8 (`qc-measure --baseline`)

| Chỉ số | T9 v2 | T8 | Δ |
|---|---|---|---|
| Thời lượng | 179,267 s | 41,9 s | +137,4 (trong 150–190; sát trần Shorts) |
| Cảnh · TB/cảnh | 28 · 6,40 s | 10 · 4,19 s | +18 · +2,21 |
| Lần cắt/10 s | 1,506 | 2,148 | −0,64 |
| Tĩnh · đoạn tĩnh dài nhất | 28,3% · 1,2 s | 22,7% · 1,0 s | +5,6 · +0,2 |
| Nhóm bố cục · chuỗi cùng chủ đề dài nhất | 27 · 4 | 10 · 2 | +17 · +2 |
| Chủ đề nền lớn nhất | 26,76% | 32,22% | −5,46 (tốt lên; lượt 1: 45,5%) |
| Chữ minh hoạ/phút · % thời lượng có chữ | 46,52 · 74,66% | 41,53 · 48,85% | +5,0 · +25,8 |
| Phụ đề: cỡ · % phủ | 56 px · 74,0% | 70 px · 75,9% | −14 px · −1,9 |
| Tốc độ đọc (âm tiết/s) | 4,479 | 4,185 | +7,03% (dưới mục tiêu +10–15%) |
| Tỉ lệ lặng · thời lượng có tiếng | 31,6% · 122,6 s | 30,4% · 29,2 s | +1,2 điểm |
| Giữ sau lời nhỏ nhất Low/Medium/High | 0,556 / 1,040 / 2,069 s | — | đạt ≥ 0,5/1,0/2,0 |
| Header · opening · câu cờ biên | 98,66% · Đạt · 0% | 0 · không · — | mới |
| −LUFS · đuôi im | −14,72 · 0,586 s | −14,4 · 0,536 s | −0,32 · +0,05 |
| Cảnh báo công cụ | 37 | 4 | +33 (hầu hết thông tin/loại trừ, xem bảng trên) |

### D8 (R20–R23)

- **R23 giọng:** `voice_edges` trên MP4: 0/73 câu cờ (ngưỡng 10%); `splice.py check` 0 biên vi phạm theo Producer. Tai nghe còn nuốt chữ hay không: **CHƯA KIỂM — giám đốc nghe**.
- **R20 opening:** S00 0–2,4 s riêng, không lời, tiêu đề 86 px; hook S01 bắt đầu 2,4 s; tiếng đầu 2,468 s. Đạt.
- **R21 header:** coverage 98,66% (100% sau opening), 14 lần đổi ô, 0 lỗi cỡ/khe/đè; chữ ≈ 52–62 px; không che Cáo/phụ đề/sơ đồ trên các ô `header-zones.png` và 12 bảng. Ô `above_captions` (S11) sát nhãn phụ nhưng không đè. Đạt (chuyển ô mượt CHƯA KIỂM).
- **R22 chữ keyword:** xem dòng M-56…M-74; `render-log.json` có mặt nên đã đo trên chữ vẽ thật. Đạt có điều kiện.

### 5 câu hỏi người xem lạ

1. **Đạt.** 0–2,4 s opening «Dòng ẩn trong mô tả plugin AI» (`frame-open-mid.png`) rồi «2 + 3 = 5», file ra «Bên ngoài» (S01, `board-01`).
2. **Đạt.** 4,7–9 s nhật ký có «Gửi file»/«Bên ngoài»; câu hỏi «ai ra lệnh gửi file?» ở S02–S03.
3. **Đạt một phần.** `nocaption-board.png`: tắt tiếng hiểu hai bản (đầy đủ vs xem trước), hàng đỏ, chặn quyền gửi; khó hiểu nếu thiếu lời ở chuỗi «nạp công cụ → AI làm theo» (S13) và cặp ô trống «ký tự ẩn» (S11, `board-04`).
4. **Đạt.** Mọi khoảng liên tục không đổi ≤ 1,2 s (< 1,5 s); camera lộ vật; chữ không chép lời (trừ M-41 là nhãn thuật ngữ). Điểm trừ: QC-11 nhãn bị che.
5. **Đạt.** S26–S27 (169,6–179,3 s) quay lại màn hình hook, «Bạn kiểm mô tả hay quyền trước?» (`qc-f177.png`), CTA tự nhiên; đuôi im 0,586 s; bìa `thumb-180x320.png` có «2 + 3», «5», file, Cáo, header, đọc được.

### Y1–Y8

| Nhóm | Kết luận | Bằng chứng |
|---|---|---|
| Y1 | **Chưa đạt (nhẹ)** | QC-11: «Bản lưu» bị cắt còn «Bản lu» ở S16 (≈ 105,5–110 s) = thiếu dấu/chữ. Còn lại chữ đúng cột kịch bản, 0 «AI tạo»/«Ví dụ dựng», khai AI ở `publish.json`. |
| Y2 | Đạt | Cáo S01/S03, S09/S17/S20, S26/S27 = 23,8 s = 13,28% (≤ 25%), mở/giữa/kết. |
| Y3 | Đạt | Cáo ≈ 146–160 px (≈ 14% ngang), đáy y≈1280–1290; không che nội dung chính (`board-01/09/11`, `qc-f177`); lưu ý nhỏ S27 Cáo sát mép tấm. |
| Y4 | Đạt | 4 chủ đề: security 26,76%, code 25,36%, office 25,34%, incident 22,54%; chuỗi tối đa 4 cảnh; nền theo ngữ cảnh. |
| Y5 | Đạt | Tình huống (S01–S03) → vấn đề → cơ chế (S08–S13) → rug pull (S15–S18) → ba bước kiểm → quay về hook. |
| Y6 | Đạt phần đo (cảnh báo M-37) · **CHƯA KIỂM nghe** | 4,479 âm tiết/s đo trên MP4 (+7,0%); bản compact Producer đo 4,716. Tốc độ cảm nhận, méo `atempo` 0,935–0,975: giám đốc nghe. |
| Y7 | Đạt phần đo · **CHƯA KIỂM nghe** | 26 khoảng lặng trùng ranh giới, hình còn chuyển; giữ-sau-lời đạt; đuôi 0,586 s. |
| Y8 | Đạt phần văn bản · **CHƯA KIỂM nghe** | `phonemes.py` mã 0 (73 dòng, 0 lỗi theo `qc-measure`); 5 clip `assets/voice/term-check/`; từ điển riêng `verified:false`. |

### Audio / Visual / Information (D6)

- **Audio:** tốc độ M-37; lặng 31,6%; lặng dài nhất 2,554 s (72,753–75,307 s, S12 High, hình còn chuyển); đuôi 0,586 s; kéo/nuốt chữ, phát âm, nhấn nhá **CHƯA KIỂM**.
- **Visual:** opening, header đạt; giữ-sau-lời đạt; không cảnh tĩnh vô nghĩa; hình khớp lời: lệch ≤ 0,092 s, `board-04` hàng đỏ lộ đúng «Dòng ẩn» (≈ 50 s). Hạn chế: QC-11.
- **Information:** khái niệm khai 3,35/phút, ≤ 1/cảnh; QC lượt 1 cảnh báo S10–S13 dày (khai 0–1 nhưng giới thiệu nhiều thuật ngữ): vẫn **CHƯA KIỂM** trên điện thoại. Ví dụ có (file 5, bản lưu vs bản nạp, rug pull); không đoạn chỉ đọc lý thuyết.

### Không đo/kiểm được (CHƯA KIỂM)

Nghe giọng (nuốt/kéo chữ, nhấn, phát âm 5 thuật ngữ, méo atempo), tốc độ/nhịp cảm nhận, độ mượt đổi ô header từng khung, độ dày thông tin S10–S13 trên điện thoại thật, từng khung chuyển cảnh.

## QC — cần sửa (lượt 2)

1. **QC-11 (bắt buộc):** S16, ≈ 105,5–110 s: nhãn «Bản lưu» bị «Bản đang nạp» che còn «Bản lu». Tách vị trí hai nhãn (khe ≥ 24 px, không đè chữ), dựng lại S16, chạy lại `qc-measure` và đối chiếu khung 106/108 s. Không đổi giọng, mốc, nội dung.
2. QC-12 (tuỳ chọn): S27 nhãn «Mô tả» sát vạch đầu tấm.
3. Giữ nguyên mọi thứ khác (giọng compact, header, opening, nền, 28 cảnh). Không sinh lại giọng.

## Bài học cho luật (đề xuất, không tự sửa docs)

- R3 cần kiểm riêng "nhãn đè nhãn" khi hai tấm chồng nhau (cảnh so sánh): `render-log` có bbox nhãn nên `qc-measure` nên đo giao nhau nhãn–nhãn; hiện chỉ có giao header/đối tượng.
- `qc-measure` đếm tốc độ trên MP4 đã chuẩn hoá/trộn hiệu ứng, thấp hơn số trên giọng gốc ≈ 0,24 âm tiết/s: nên đo trên `voice.wav` (hoặc trừ đoạn hiệu ứng) để so với dải +10–15%.

## Producer · Sửa QC-11 và QC-12

- **S16 · QC-11.** Dời «Bản lưu» về mép trái của tấm lưu và giữ «Bản đang nạp» ở phía phải khi hai tấm chồng. Kiểm 163 khung có cả hai nhãn. Khe nhỏ nhất giữa hai khung nhãn là 35 px ở 1080×1920, đạt yêu cầu ≥ 24 px. Chữ đủ dấu và đọc được ở 360×640. [106 s](assets/_scratch/d8/qc-repair/final-106.png) · [108 s](assets/_scratch/d8/qc-repair/final-108.png)
- **S27 · QC-12.** Đưa «Mô tả» lên trên tấm, cách mép trên của tấm 15 px. Đã kiểm trên MP4 có phụ đề. [177 s](assets/_scratch/d8/qc-repair/final-177.png)
- Dựng lại hai cảnh bằng `render_d8.py`, ghép hình và đốt lớp ASS đã duyệt. Toàn bộ gói AAC và dấu thời gian khung trên MP4 trùng với bản QC lượt 2. Bản hình riêng và nhật ký dựng đã cập nhật. Đối chiếu gói H.264 trên bản hình riêng xác nhận thay đổi chỉ ở S16 và S27. [Đối chiếu hình](assets/_scratch/d8/qc-repair/geometry-and-picture.json) · [Đối chiếu MP4](assets/_scratch/d8/qc-repair/export-verification.json)
- Đã mở khung MP4 ở opening, giữa và gần cuối ở 360×640, cùng bìa hook ở 180×320. `final/` có đúng bốn tệp `IT-T9-E01_9x16.mp4`, `thumbnail.jpg`, `captions.srt` và `publish.json`. MP4 dài 179,267 s, 5.378 khung, 1080×1920, H.264 yuv420p 30 fps, AAC mono 48 kHz, faststart. [Bìa 180×320](assets/_scratch/d8/qc-repair/thumbnail-180.png)

| Phép kiểm | Kết quả trên bản sửa |
|---|---|
| `qc-video --min 150 --max 180 --scenes assets/scenes.json` | **PASS**, 0 lỗi, 0 cảnh báo. −14,72 LUFS, đỉnh −1,85 dBTP, đoạn hình tĩnh dài nhất 1,2 s. [Số đo](assets/_scratch/d8/qc-repair/qc-video.json) |
| `qc-publish` | **PASS**, 0 lỗi, 0 cảnh báo. [Số đo](assets/_scratch/d8/qc-repair/qc-publish.json) |
| `qc-measure --baseline docs/baseline/T8-qc-auto.json` | 0 lỗi. Cả 37 cảnh báo trùng báo cáo lượt 2 và có đối chiếu ở trên. Header phủ 100% sau opening, 0 chồng lấn được công cụ ghi nhận. Biên giọng 0/73 câu bị cờ, đuôi im 0,586 s. [Báo cáo](assets/_scratch/d8/qc-repair/qc-measure/report.md) |

Tốc độ đo trên MP4 là 4,479 âm tiết/s. Tốc độ cảm nhận, nhịp và phát âm **CHƯA KIỂM — giám đốc nghe**.

## QC — lượt 3 (Claude, 19/11/2026, bản sửa QC-11/QC-12) — PASS → ready

Đo độc lập: `node tools/qc-measure.mjs <ep01> --baseline docs/baseline/T8-qc-auto.json` (explainer) → **0 lỗi · 37 cảnh báo · 75 phát hiện** (trùng lượt 2, không phát sinh mã mới). Lệnh thứ hai thêm `--frames "105.5,106,107,108,109.5,177,60,15"`. Đã mở lượt này: `frame-105.5/106/108/177` (full-res), `frame-open-mid`, `thumb-180x320`, `board-07`. Phần không đổi dựa trên 20 ảnh/khung đã xem ở lượt 2. `final/` đúng 4 thành phẩm. Số job produce = 5 (38, 40, 45, 47, 49) < 10. Chưa nghe âm thanh.

### Kiểm lại lỗi lượt 2
- **QC-11 đã sửa.** `frame-105.5/106/108`: «Bản lưu» ở mép trái-trên tấm trái (x≈135–395), «Bản đang nạp» ở phải (x≈432–868), khe ≈ 37 px, đủ dấu «ưu», không đè. `board-07` ô 104–110 s cùng kết quả.
- **QC-12 đã sửa.** `frame-177`: «Mô tả» nằm trên tấm (y≈402–475), cách mép trên tấm ≈ 15 px, không đè vạch; «Quyền» vừa khung.
- Số đo khác giữ nguyên: 179,267 s (≤ 180), −14,72 LUFS, đuôi im 0,586 s, lệch lời–hình ≤ 0,092 s, 73 cue ≤ 2 dòng × 28 ký tự, `voice_edges` 0/73 cờ, header 100% sau opening, nền lớn nhất 26,76% / chuỗi 4 cảnh, Cáo 13,28%, 4,479 âm tiết/s (+7,03% so T8; M-37 cảnh báo không chặn).

| Trục | Kết luận | Bằng chứng |
|---|---|---|
| KỸ THUẬT | **ĐẠT** | 1080×1920, 30 fps, h264/yuv420p, AAC; 179,267 s; −14,72 LUFS; đuôi 0,586 s; R23 0/73; `qc-publish` pass. |
| TUÂN THỦ | **ĐẠT** | Nguồn tự dựng (Pillow/FFmpeg, nền `tools/backgrounds`, 5 dáng Cáo, VieNeu cục bộ) → không cần dòng `LICENSES.md` mới; không logo lạ/nhãn «AI tạo»; khai AI ở `publish.json`; R12 26,76%/4 cảnh; R20 opening 2,4 s, tiếng đầu 2,468 s; R21 header 100%; R22 96,4% cảnh có chữ thật, 43,18 từ/phút, 10 kinetic. |
| TRẢI NGHIỆM | **ĐẠT phần đo/xem; phần nghe CHƯA KIỂM** | Y1–Y5 đạt; Y6–Y8 mới kiểm văn bản/số đo. |

Cảnh báo đã loại trừ (lý do như bảng lượt 2): M-01…M-27 lặng/tĩnh < 1,5 s có hình đổi; M-28…M-36 camera lộ vật; M-38/39 ngoại lệ opening/hook; M-40/54/55 opening; M-41/75 nhãn thuật ngữ «Mô tả công cụ»; M-43…M-53 đổi ô header 0,4 s (**mượt CHƯA KIỂM**); M-56…M-74 keyword vẽ thành vật/nhãn rút gọn, số đo R22 đạt.

### 5 câu hỏi người xem lạ
1. Đạt — 0–2,4 s opening «Dòng ẩn trong mô tả plugin AI» (`frame-open-mid`), rồi «2 + 3 = 5», file ra «Bên ngoài».
2. Đạt — 4,7–9 s nhật ký «Gửi file», câu hỏi «ai ra lệnh gửi file?».
3. Đạt một phần — tắt tiếng hiểu hai bản/hàng đỏ/chặn quyền; khó nếu thiếu lời ở S13 và cặp ô «ký tự ẩn» (S11).
4. Đạt — khoảng không đổi dài nhất 1,2 s; chữ không chép lời (trừ M-41 nhãn thuật ngữ).
5. Đạt — S26–S27 quay lại màn hình hook, «Bạn kiểm mô tả hay quyền trước?», đuôi im 0,586 s; bìa 180×320 đọc được hook (số 5, file) nhưng tiêu đề «Dòng ẩn» nhỏ (lưu ý thấp, không chặn).

### Y1–Y8
Y1 Đạt (S16 đủ dấu sau sửa) · Y2 Đạt (13,28%) · Y3 Đạt · Y4 Đạt · Y5 Đạt · Y6 Đạt phần đo, **CHƯA KIỂM nghe** · Y7 Đạt phần đo, **CHƯA KIỂM nghe** · Y8 Đạt phần văn bản (`phonemes.py` mã 0, 73 dòng, 0 lỗi), **CHƯA KIỂM nghe**.

### Audio / Visual / Information (D6) và D8
- Audio: 4,479 âm tiết/s (dưới dải +10–15%, M-37 không chặn; compact 4,716), lặng 31,6%, lặng dài nhất 2,554 s (72,753–75,307 s, S12 High, hình còn chuyển). Nuốt/kéo chữ, phát âm, nhấn nhá, méo atempo 0,935–0,975: **CHƯA KIỂM — giám đốc nghe**.
- Visual: opening, header, giữ-sau-lời (0,556/1,040/2,069 s) đạt; hình khớp lời ≤ 0,092 s.
- Information: ví dụ có, thứ tự logic đạt; độ dày S10–S13 trên điện thoại **CHƯA KIỂM**.
- D8: R20–R23 đạt theo số đo; tai nghe R23 và độ mượt đổi ô R21 CHƯA KIỂM.

### CHƯA KIỂM (chờ giám đốc)
Nghe giọng/phát âm 5 thuật ngữ/nhịp nghỉ/tốc độ cảm nhận; đổi ô header từng khung; độ dày thông tin S10–S13 trên điện thoại; từng khung chuyển cảnh.

**Phán quyết lượt 3: PASS → `ready`.** Không còn lỗi FAIL nào đã biết.

## QC — lượt 4 (thư ký, 19/11/2026 tối, công cụ `qc-measure` mới có `text_overlap`) — FAIL (lỗi dựng nhẹ) → `production`

Sau khi QC lượt 3 cho `ready`, `qc-measure` bản mới (việc M: đo nhãn đè nhãn) báo **1 lỗi + 1 cảnh báo mà QC lượt 2–3 đều bỏ sót** (QC xem bảng khung 2 s/khung và chỉ mở lại S16, không mở S04). Thư ký đã tự mở khung trên MP4 cuối (17,9 / 18,3 / 18,7 s) và xác nhận lỗi là thật:

| Mã | Mốc | Bằng chứng | Mức | Sửa |
|---|---|---|---|---|
| **QC-13** | S04 · 17,7–18,833 s | Nhãn «Công cụ» che 79% nhãn «3 bước» (ở khung chỉ còn chữ «c» ló ra sau «Công cụ»). `qc-measure` M-84, `text-overlap.png`. | **LỖI (dựng, nhẹ)** | Tách vị trí hai nhãn, khe ≥ 24 px, cả hai đọc đủ dấu; không đổi mốc hiện/biến mất, không đổi giọng/nội dung. |
| QC-14 | S23 · 156,333–156,7 s | «Ghim phiên bản» và «Bản sắp nạp» khe 17 px (< 24 px), chỉ 0,37 s. M-85. | Cảnh báo | Sửa luôn nếu dựng lại S23 chỉ để dời nhãn, không thì ghi lý do. |

**Cho Sản xuất (lượt 3):** chỉ dựng lại cảnh S04 (và S23 nếu cần); GIỮ nguyên giọng compact, header, opening, nền, 28 cảnh, mốc. Sau khi sửa chạy `node tools/qc-measure.mjs <ep01> --baseline docs/baseline/T8-qc-auto.json` — **0 lỗi `text_overlap`** (R3), cả khe nhỏ nhất ≥ 24 px (hoặc ghi lý do từng cặp còn lại); mở khung MP4 ở S04 (17,9 / 18,3 / 18,7 s) đối chiếu. `final/` giữ đúng 4 thành phẩm.

**Bài học (ghi nhận):** QC lượt 2–3 đạt vì chỉ dựa 2 s/khung; luật R3 cần kiểm nhãn đè nhãn bằng số đo (nay đã có `text_overlap`), không chỉ bằng mắt.


## Producer · Sửa QC-13 và QC-14

- **S04 · QC-13.** Dời «3 bước» lên, giữ «Công cụ» cạnh thẻ dấu cộng. Khe chữ nhỏ nhất 56 px. Đã mở khung MP4 ở [17,9 s](assets/_scratch/d8/qc-repair-4/at-17.9.png), [18,3 s](assets/_scratch/d8/qc-repair-4/at-18.3.png) và [18,7 s](assets/_scratch/d8/qc-repair-4/at-18.7.png) ở 360×640. Hai nhãn đọc đủ chữ và dấu.
- **S23 · QC-14.** Dời «Bản sắp nạp» xuống 22 px trên tấm. Khe chữ nhỏ nhất 38,1 px. Đã mở [khung 156,5 s](assets/_scratch/d8/qc-repair-4/at-156.5.png) ở 360×640. Cả hai cảnh đều đạt khe ≥ 24 px.
- Chỉ kết xuất lại S04/S23 theo mốc cũ. So gói H.264 của bản hình riêng xác nhận cả 168 khung thay đổi đều thuộc hai cảnh này. Toàn bộ gói AAC và mốc hiển thị của 5.378 khung trùng bản trước. Giữ phụ đề, bìa, thông tin đăng và 28 cảnh. [Đối chiếu](assets/_scratch/d8/qc-repair-4/verification.json)
- **S09 · ghi nhận ngoài phạm vi lượt sửa.** «Xem trước» và «Bản AI đọc» đè nhau trong khoảng 38,267–38,433 s khi hai tấm trượt qua nhau. Đã mở [khung 38,33 s](assets/_scratch/d8/qc-repair-4/at-38.33.png). Đây là lý do khe nhỏ nhất toàn video vẫn là 0 px. Khoảng 0,167 s nằm dưới ngưỡng phát hiện 0,2 s của `text_overlap`. Giữ nguyên S09 theo phạm vi giao ở QC lượt 4.

| Kiểm tra | Kết quả |
|---|---|
| `qc-video --min 150 --max 180 --scenes assets/scenes.json` | PASS, 0 lỗi, 0 cảnh báo. 179,267 s, 1080×1920, H.264 yuv420p 30 fps, AAC 48 kHz, −14,72 LUFS. [Số đo](assets/_scratch/d8/qc-repair-4/qc-video.json) |
| `qc-publish` | PASS, 0 lỗi, 0 cảnh báo. [Số đo](assets/_scratch/d8/qc-repair-4/qc-publish.json) |
| `qc-measure --baseline docs/baseline/T8-qc-auto.json` | 0 lỗi, 0 cặp chồng chữ hoặc khe dưới 24 px kéo dài đủ 0,2 s. 29 cảnh báo còn lại thuộc các nhóm đã ghi ở QC lượt 2–3 về nhịp opening/hook, chữ opening, nhãn «Mô tả công cụ», chuyển ô header và keyword rút gọn. Header phủ 100% sau opening, 0/73 câu bị cờ biên giọng, đuôi im 0,586 s. [Báo cáo](assets/_scratch/d8/qc-repair-4/qc-measure/report.md) |

`final/` có đúng bốn thành phẩm. Tốc độ cảm nhận, nhịp và phát âm **CHƯA KIỂM — giám đốc nghe**.

## QC — lượt 5 (Claude, 19/11/2026)

Đo độc lập bằng một lệnh `qc-measure … --baseline docs/baseline/T8-qc-auto.json --frames …` (hai lần, thêm khung 38,1–38,5 / 156,6–157,5 s). Báo cáo: `assets/_scratch/qc-auto/report.md`. Đã mở 15 ảnh (S04 ×3, S09 ×7, S23 ×3 gồm 156,4/156,5/156,7, bìa 180×320, board-05, opening giữa) cộng bảng board trước đó. `final/` đúng 4 thành phẩm (mp4, captions.srt, publish.json, thumbnail.jpg), không cần dọn.

### Ba kết luận
- **KỸ THUẬT: Đạt phần đo.** 1080×1920, 30 fps, h264/yuv420p + aac, 179,267 s (trong 150–190), −14,72 LUFS, đuôi im 0,586 s (≤ 0,7), 0 lỗi, 29 cảnh báo (cùng nhóm lượt 4: M-38–M-83), `text_overlap` tool: 0 cặp giao ≥ 0,2 s. Lệch lời–hình max 0,092 s. 0/73 câu cờ biên giọng.
- **TUÂN THỦ: Đạt phần đo**, trừ R3 ở S09 (xem QC-15): đang vi phạm "nhãn đè nhãn" dù dưới ngưỡng tool. Sổ nguồn/publish không đổi so với lượt 2–3 (Producer chỉ dựng lại S04/S23, AAC và 5.378 khung mốc trùng bản cũ, xem `d8/qc-repair-4/verification.json`).
- **TRẢI NGHIỆM: Chưa đạt ở S09 38,27–38,43 s** (chữ «Xem trước» bị tấm «Bản AI đọc» che mất nửa); phần còn lại Đạt phần đo, nghe **CHƯA KIỂM**.

### Kết luận từng điểm lượt 4 → 5
| Mã | Mốc | Bằng chứng | Kết luận |
|---|---|---|---|
| QC-13 S04 | 17,9 / 18,3 / 18,7 s | `frame-17.9/18.3/18.7.png`: «3 bước» y 640–698, «Công cụ» y 735–807, khe dọc ≈ 37 px, không giao, cả hai đọc đủ dấu; thẻ dấu cộng không bị che. | **ĐÃ SỬA, Đạt** |
| QC-14 S23 | 156,4 / 156,5 / 156,7 s | «Ghim phiên bản» đáy y 483; «Bản sắp nạp» đỉnh 500 (156,4) → 505 (156,5) → 512 (156,7): khe 17 → 22 → 29 px, không giao. | **Đạt (không đè)**; khe < 24 px chỉ ~0,1–0,15 s đầu lúc nhãn trượt vào, cảnh báo nhẹ, không chặn |
| QC-15 S09 | 38,267–38,433 s | `frame-38.27/38.33/38.4.png`: nhãn «Bản AI đọc» đè «Xem trước»: 38,27 chồng ≈ 22 px đáy chữ; 38,33 «Xe[m trước]» chỉ còn «Xe»; 38,4 chữ «Xem trước» bị cắt nửa trên. 38,2 và 38,43 sạch (khe ≈ 0 và > 0). ~5 khung (≈ 0,17 s). | **LỖI DỰNG (R3/Y1), nhẹ, thấy rõ khi mở khung** |

QC-15 ghi rõ: Producer đã nêu đúng nhưng cho "ngoài phạm vi". Chuẩn R3 (và lượt 4 của chính giám đốc/thư ký) coi mọi cặp nhãn giao nhau là lỗi dựng; ngưỡng 0,2 s của tool chỉ là đèn cảnh báo (tool báo khe nhỏ nhất 0 px cũng chính là điểm này). Chữ keyword trọng tâm («Xem trước», thuật ngữ gọi tên) bị che đúng lúc tấm trượt, nên không loại trừ theo kiểu "chuyển động thoáng qua".

### Cần sửa (QC — cần sửa)
1. **S09 (35,833–41,9 s):** dời nhãn «Bản AI đọc» (hoặc «Xem trước») sao cho khe ≥ 24 px ở mọi khung của quãng 38,0–38,6 s, kể cả lúc tấm thứ hai trượt (ví dụ đặt nhãn «Bản AI đọc» theo tấm nhưng neo dưới «Xem trước» ≥ 24 px, hoặc trượt tấm trước rồi mới hiện nhãn). Không đổi giọng, mốc hiện, header, nội dung.
2. Tuỳ chọn (cảnh báo): S23 156,33–156,5 s giữ khe ≥ 24 px lúc nhãn trượt vào.
3. Sau khi sửa: `qc-measure` 0 lỗi; mở khung MP4 S09 ở 38,1 / 38,2 / 38,27 / 38,33 / 38,4 / 38,5 s xác nhận không giao; hạ ngưỡng kiểm bằng cách tự trích ≥ 3 khung dày trong lúc trượt. Chỉ dựng lại S09; giữ nguyên các cảnh khác, AAC, mốc 5.378 khung.

### D6 và D8 (số đo lượt 5)
- **Audio:** 4,479 âm tiết/s trên MP4, 4,716 trên giọng gốc (+12,684% so với T8, đạt dải 4,6–4,8 gốc), lặng 31,6%, lặng dài nhất 2,554 s (72,753–75,307 s, S12 high, hình còn chuyển), M-02–M-27 chỉ thông tin. Nghe nuốt/kéo chữ, phát âm, nhịp nghỉ cảm nhận: **CHƯA KIỂM — giám đốc nghe**.
- **Visual:** opening riêng 0–2,4 s đạt (ảnh `frame-open-*`, tiêu đề «Dòng ẩn trong mô tả plugin AI» đọc được ở 180×320, bìa là khung hook); header phủ 98,661% (100% sau opening), 14 lần đổi ô, 0 sai cỡ, 0 đè, `header-zones.png` đã mở; giữ-sau-lời nhỏ nhất 0,556 / 1,04 / 2,069 s (low/medium/high). M-43–M-53 (đổi ô 0 s cùng hiện) chỉ cảnh báo, đã xem ranh giới S04/S05, S08/S09 không thấy giật.
- **Information:** 3,347 khái niệm mới/phút, thứ tự logic, có ví dụ; độ dày S10–S13 trên điện thoại **CHƯA KIỂM**.
- **D8:** R20 Đạt; R21 Đạt (coverage 100% sau opening, ≥ 52 px); R22 96,429% cảnh có chữ vẽ thật, 43,176 từ/phút, kinetic 1,395/25 s, 13 keyword thiếu chữ (M-56–M-82, hầu hết đã minh hoạ bằng hình; dẫn lại lý do lượt 3), M-41/M-83 «Mô tả công cụ» giống lời 75% giữ nguyên là cảnh báo đã loại trừ lượt 3; R23 0/73 câu cờ, tai nghe CHƯA KIỂM; **R3 Chưa đạt tại S09 (QC-15)**.

### 5 câu hỏi người xem lạ
1. Đạt: 0–2,4 s tiêu đề + hook hình «2+3=5 / File» ở bìa; 2. Đạt (hệ quả hiển thị ở S01–S03, trước 5 s); 3. Đạt phần đo (mỗi cảnh một ý, board `nocaption-board.png`); tắt tiếng hiểu ý chính **một phần**, cần thêm phụ đề với S10–S13; 4. Đạt trừ S09 38,27–38,43 s (chữ che nhau); cảnh tĩnh dài nhất 1,2 s (58,7–59,9 s, có lý do: giữ sơ đồ); 5. Đạt (kết S27 có kêu gọi, đuôi 0,586 s); bìa đọc được ở 180×320.

### Y1–Y8
| Nhóm | Kết luận | Bằng chứng |
|---|---|---|
| Y1 chữ/hình thừa | **Chưa đạt (S09)** | QC-15; còn lại không thấy nhãn «AI tạo»/chữ thừa trên 15 khung đã mở |
| Y2 cảnh có Cáo | Đạt | 13,28% (lượt 3) |
| Y3 cỡ Cáo | Đạt | S09 Cáo ≈ 150×250 px đúng cỡ; dẫn lượt 3 |
| Y4 nền theo ngữ cảnh | Đạt | `scenes.json`: security/code/office/incident, chuỗi cùng chủ đề dài nhất 4 cảnh S00–S03 |
| Y5 mạch kể | Đạt | dẫn lượt 3 |
| Y6 tốc độ | Đạt phần đo (4,479/4,716); **CHƯA KIỂM nghe** | M-37 |
| Y7 nhịp nghỉ | Đạt phần đo (lặng 31,6%, dài nhất 2,554 s có chuyển động); **CHƯA KIỂM nghe** | M-02–M-27 |
| Y8 phát âm | Đạt phần văn bản (`phonemes.py` mã 0, lượt 3); **CHƯA KIỂM nghe** | notes lượt 3 |

### Bảng phát hiện mới lượt 5
| Mã | Nhóm | Mốc | Bằng chứng | Mức | Đề nghị |
|---|---|---|---|---|---|
| QC-15 | TUÂN THỦ R3 / TRẢI NGHIỆM Y1 | S09 · 38,267–38,433 s | `frame-38.27/38.33/38.4.png`, nhãn chồng ~5 khung, khe nhỏ nhất toàn video 0 px | **LỖI dựng (nhẹ)** | Sửa S09 như mục "Cần sửa" 1 |
| QC-16 | KỸ THUẬT R3 | S23 · 156,33–156,5 s | khe 17 → 22 px (`frame-156.4/156.5.png`) | Cảnh báo | Tuỳ chọn |
| M-43–M-53 | R21 | ranh giới cảnh | 0 s cùng hiện giữa hai ô | Cảnh báo, đã loại trừ (không giật ở khung mở) | — |
| M-38–M-40 | Info/Visual | S00/S01 | cảnh 2,4/2,267 s < 3 s, S00 10 từ chữ | Cảnh báo, đã loại trừ (opening/hook cố ý) | — |
| M-41, M-83 | R17 | S10 44–47,77 s | «Mô tả công cụ» ≈ lời 75% | Cảnh báo, giữ (nhãn thuật ngữ, 3 từ) | — |
| M-56–M-82 | R22 | nhiều cảnh | keyword thiếu chữ vẽ thật | Cảnh báo, đã loại trừ theo lượt 3 (hình minh hoạ đúng ý) | — |
| M-01–M-37 | R4/Y7/R12/Audio | — | thông tin | Thông tin | — |

### Phần công cụ không đo / CHƯA KIỂM
Nghe giọng, phát âm 5 thuật ngữ, nhịp nghỉ cảm nhận, tốc độ cảm nhận; độ mượt đổi ô header; độ dày S10–S13 trên điện thoại; từng khung chuyển cảnh; nhãn đè trong các chuyển động < 0,2 s ở cảnh khác (đã soát S04/S09/S23 bằng mắt, board 2 s/khung không đủ dày).

**Phán quyết lượt 5: FAIL (lỗi dựng nhẹ, sửa được) → `production`.** QC-13 và QC-14 đã được xử lý; còn đúng một lỗi dựng QC-15 (S09). Số lần produce 6/10, còn lượt.

**Bài học cho luật (đề nghị, không tự sửa docs):** `text_overlap` nên hạ ngưỡng xuống 0,1 s (hoặc ≥ 3 khung) và báo khe 0 px trong mục cảnh báo thay vì ẩn; Producer không tự loại trừ lỗi R3 "ngoài phạm vi" khi đã thấy.

## Producer · Sửa QC-15 ở S09

- Dời nhãn «Xem trước» lên phía trên tấm tương ứng. Nhật ký dựng giữ nguyên thời điểm xuất hiện của cả hai nhãn. Đã trích 19 khung liên tiếp ở 360×640 từ 38,0–38,6 s và mở kiểm tại 38,1 / 38,2 / 38,27 / 38,33 / 38,4 / 38,5 s. Hai nhãn đọc được trong lúc tấm trượt. [Khung 38,33 s](assets/_scratch/d8/qc-repair-5/qc-measure/frame-38.33.png)
- Chỉ dựng lại S09. Đối chiếu bản hình trước khi đốt phụ đề cho thấy cả 143 khung thay đổi đều thuộc S09. Khi xuất lại MP4, sao chép nguyên 8.405 gói AAC và giữ mốc hiển thị của 5.378 khung. S23 giữ theo kết luận QC lượt 5 về cảnh báo tuỳ chọn QC-16. [Đối chiếu](assets/_scratch/d8/qc-repair-5/verification.json)
- `qc-video` và `qc-publish` đều PASS, 0 lỗi, 0 cảnh báo. 179,267 s, 1080×1920, H.264 yuv420p 30 fps, AAC 48 kHz, −14,72 LUFS, đuôi im 0,586 s.
- `qc-measure` có 0 lỗi và 29 cảnh báo thuộc các nhóm đã ghi ở QC lượt 5. R3 ghi 0 cặp giao nhau, 0 cặp dưới ngưỡng theo phép đo và khe nhỏ nhất ghi nhận 26 px. [Báo cáo](assets/_scratch/d8/qc-repair-5/qc-measure/report.md)
- `final/` có bốn tệp IT-T9-E01_9x16.mp4, thumbnail.jpg, captions.srt và publish.json. Tốc độ cảm nhận, nhịp và phát âm **CHƯA KIỂM — giám đốc nghe**.
