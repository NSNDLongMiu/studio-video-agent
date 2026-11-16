# Plan — T1 "Cáo đi phỏng vấn: vị trí IT thời AI"

Người đọc: **Codex (producer)**. Đọc kèm `concept.md` (nhân vật, quy tắc sự thật, 10 mẫu cảnh M0–M9) và `epNN/script.md` (từng câu thoại, timecode). Tài liệu chuẩn: `docs/mascot.md`, `docs/asset-sources.md`, `docs/platform-specs.md`, `docs/voice.md`, `.agents/skills/video-producer/references/ffmpeg-recipes.md` (§8 ghép Cáo).

## 1. Bảng tập
| Mã video | Tên tập | Mục tiêu bản dài | Thông điệp chính |
|---|---|---|---|
| IT-T1-E01 | Code AI viết sai. Lỗi của ai? | 4:00–4:10 (chấp nhận 3:45–4:15) | "AI viết nhanh; người đọc lại, giữ bí mật, và chịu trách nhiệm cho thứ mình duyệt." |
| IT-T1-E02 | Khi AI làm được nhiều việc, công ty cần mình làm gì? | 4:00–4:10 (chấp nhận 3:45–4:15) | "AI không phải để sợ, cũng không phải để thờ. Việc cần hiểu, cần chọn, cần kiểm chứng vẫn là của người." |

Mỗi tập xuất 3 bản (xem mục 4): `full` (bản dài), `p1` (nửa 1), `p2` (nửa 2).

## 2. Phong cách hình ảnh
Khung **1080×1920**, 30 fps. Tất cả chữ dùng phông Windows có sẵn (Segoe UI / Bahnschrift / Arial / Tahoma). Phải kiểm phông có đủ dấu tiếng Việt trước khi dựng (render thử một câu "Đáp ổn: ưu, ơ, ằ, ẵ, ỵ").

| Vai trò | Màu hex |
|---|---|
| Nền chính (navy, trùng `--bg 0x1b2a49` của narrate) | `#1B2A49` |
| Nền thẻ/khung | `#24365C` |
| Cam (Cáo, nhấn mạnh) | `#F28C28` |
| Xanh Chị Phỏng vấn | `#2F6FDE` |
| Chữ chính | `#FFFFFF` |
| Chữ phụ | `#C9D3E8` |
| Đáp dở / lỗi | `#E5484D` |
| Đáp ổn / chắc chắn | `#2EB67D` |
| Tuỳ công ty (cảnh báo nhẹ) | `#FFD166` |
| Vạch che (M5) | `#0B0F1A` |

Nền động nhẹ: gradient `#1B2A49` -> `#16213B` trôi chậm (không nhấp nháy), tuỳ chọn thêm lưới chấm mờ 6% opacity. Cấm nền chớp.

| Phần tử | Phông | Cỡ | Ghi chú |
|---|---|---|---|
| Hook / chữ lớn M1, M9 | Bahnschrift Bold (hoặc Segoe UI Black) | 104–120 px | tối đa 3 dòng, căn giữa, bóng nhẹ |
| Chữ trong bong bóng chat (M2/M3) | Segoe UI Semibold | 46 px | tối đa 4 dòng mỗi bong bóng; chiều rộng bong bóng ≤ 800px |
| Tên người nói trên bong bóng | Segoe UI Bold | 30 px | màu theo vai |
| Tem "Đáp dở/Đáp ổn" | Bahnschrift Bold | 44 px | tem bo tròn, nền đỏ/xanh |
| Thẻ hai cột (M6) tiêu đề cột | Bahnschrift Bold | 50 px | |
| Thẻ hai cột — dòng | Segoe UI Semibold | 42 px | tối đa 4 dòng/cột |
| Ghi chú miễn trừ M6 | Segoe UI | 30 px, màu `#C9D3E8` | luôn ở đáy thẻ |
| Phụ đề đốt cứng (lời Cáo dẫn, mọi lời nằm ngoài bong bóng) | Segoe UI Bold | 54 px, viền đen 4px, trắng | tối đa 2 dòng, ~28 ký tự/dòng |
| Huy hiệu hư cấu | Segoe UI Semibold | 30 px | nền `#24365C` 85%, viền cam 2px |
| Thanh chương ("Câu 2/6") | Bahnschrift | 34 px | góc trái, dưới huy hiệu |

### Bố cục an toàn (theo `docs/platform-specs.md`)
- Mọi chữ quan trọng nằm trong **y ∈ [250, 1500]**, lề trái/phải **≥ 90 px**. Dải bên phải (nút thích/bình luận) để trống ở y > ~1000, x > ~930.
- **Huy hiệu hư cấu cố định:** góc trái-trên, x=90, y=260, rộng ≤ 760 px, văn bản **"Tình huống minh hoạ · không phải tuyển dụng thật"**. Không che phụ đề, không nằm sát mép phải. Hiện **suốt video** (kể cả thẻ cuối).
- **Thanh chương:** x=90, y=345 ("Câu 1/6" … "Câu 6/6"; thẻ mở/chốt không có thanh).
- **Vùng nội dung** (M2–M7): y ∈ [430, 950].
- **Vùng Cáo:** 
  - **Cáo nhỏ** (mặc định ở M2–M7): cao **440 px**, đáy ở y=1500 (cách đáy khung 420px), đặt **dưới-trái** (x≈90–400) để chừa góc phải; phụ đề ngay phía trên đầu Cáo, khối chữ ở y ≈ 960–1050.
  - **Cáo to** (ở M0, M1, M8, M9): cao **760 px**, dưới-giữa, đáy y=1500 (đầu ở y≈740); phụ đề ở y ≈ 620–720. Nội dung chữ lớn nằm y ∈ [330, 640].
  - Khi Cáo đổi nhỏ <-> to: **cắt thẳng** (đã là "cắt" vì đổi dáng), không cần chuyển động mượt.
- Cáo có mặt ≥ 60% thời lượng (đang ở M2–M7 là Cáo nhỏ nên đạt).
- Trong M2/M3, **bong bóng chat chính là phụ đề của câu đó** (không đốt phụ đề thứ hai). `captions.srt` vẫn chứa toàn bộ lời.

## 3. Phong cách âm thanh
- **Giọng — đã chốt 17/11/2026, cả 2 đều giọng Bắc** (giám đốc đã bỏ yêu cầu giọng Nam ban đầu): VieNeu-TTS v3 Turbo, CPU (xem `docs/voice.md`). **Chị Phỏng vấn = Quỳnh Anh** (Nữ · Bắc), **Cáo (ứng viên và dẫn) = Minh Đức** (Nam · Bắc). Cả 2 cùng tham số: `temperature=0.65`, hậu kỳ `ffmpeg atempo=1.08` (+8% tốc độ, giữ nguyên cao độ). Đủ điều kiện để Codex bắt đầu sản xuất.
- **Nhạc nền:** `library/music/` hiện trống. **Có nhạc giám đốc cung cấp (kèm `library/music/LICENSES.md`)** thì dùng nhạc nhẹ, nhịp chậm, -26 LUFS dưới giọng (ducking 8–10 dB khi có giọng). **Không có nhạc** thì dựng **không nhạc nền** (chỉ giọng + SFX); không tải nhạc ngoài.
- **SFX tự tạo bằng ffmpeg** (aevalsrc/sine, không cần thư viện ngoài): "tách" (M1 chữ rơi, ~1 kHz click 40ms), "ting" (tem Đáp ổn, hai nốt 880/1320 Hz), "bụp" (tem Đáp dở, 220 Hz thấp), "vút" (chuyển M8). Âm lượng SFX thấp hơn giọng ≥ 12 dB.
- **Loudness:** toàn bản ~ −14 LUFS, đỉnh ≤ −1,5 dBTP (loudnorm 2 lượt).
- **Nhịp thoại:** nghỉ 0,25–0,4s giữa hai câu cùng người; 0,4–0,6s khi đổi người nói; nghỉ 0,6s sau mỗi tem Đáp dở/Đáp ổn để người xem đọc.

## 4. Quy tắc phụ đề, và 3 bản xuất cho mỗi tập
### 4.1 Phụ đề
- `final/captions.srt` (toàn bản dài) và `final/captions_p1.srt`, `final/captions_p2.srt` (đã dịch mốc về 0). Chữ phụ đề **y hệt cột "Lời đọc/phụ đề"** trong script, không rút gọn.
- Bản video: phụ đề **đốt cứng** theo mục 2 (lời Cáo dẫn); lời trong khung chat hiện trong bong bóng.
- Mỗi dòng phụ đề ≤ 2 dòng chữ, ≤ ~28 ký tự/dòng; ngắt dòng theo cụm nghĩa.

### 4.2 Điểm cắt nửa ~2 phút (điều kiện 7 của B)
| Tập | Cắt tại | Nửa 1 (`p1`) | Nửa 2 (`p2`) |
|---|---|---|---|
| E01 | **Giữa chương 2 và chương 3** (~2:00). Chương 2 kết thúc bằng thẻ ghi chú M7 | Chương 0 + 1 + 2 + **thẻ kết nửa 1 (3s)** ≈ 2:00–2:05 | **Intro p2 (4s)** + Chương 3 + 4 + 5 ≈ 2:10–2:15 |
| E02 | **Giữa chương 2 và chương 3** (~2:00) | Chương 0 + 1 + 2 + thẻ kết nửa 1 ≈ 2:00–2:05 | Intro p2 (4s) + Chương 3 + 4 + 5 ≈ 2:10–2:20 |

Mỗi nửa **đứng được một mình**:
- `p1`: đã có thẻ mở hư cấu (M0) và hook sẵn ở đầu. Thẻ kết nửa 1 (M0 phiên bản cuối): nhãn hư cấu + `ai_disclosure` + dòng "Còn phần 2: …" (tên chương 3). **Không** hứa nội dung chưa có.
- `p2`: có **intro riêng 4 giây** (script ghi rõ, hook mới + huy hiệu bật + thẻ "Nhân vật và công ty trong video là hư cấu."), rồi vào thẳng chương 3. Trong `full`, intro p2 **bị bỏ** (chương 3 mở bằng thẻ câu M1 làm hook).
- Mọi nửa đều có huy hiệu hư cấu suốt bản và thẻ nhãn cuối.

### 4.3 Phương án nếu trần Reels là 90 giây (CHƯA KIỂM CHỨNG)
Nếu giám đốc xác nhận Facebook Reels <= 90s: Codex dựng thêm **rút gọn từng nửa còn <= 90s** theo danh sách "cắt được" trong script (mỗi chương có dòng đánh dấu `[CẮT-90]` có thể bỏ mà vẫn hiểu). Chỉ làm khi giám đốc yêu cầu; **không phải phạm vi mặc định**.

## 5. Quy trình dựng cho Codex (theo thứ tự)
Thư mục làm việc mỗi tập: `content/it/T1-phong-van-it-trong-thoi-dai-ai/epNN/{assets, final, logs, notes.md}`. Ghi `notes.md` tiến độ/quyết định kỹ thuật.

1. **Đọc** `script.md` tập đó. Tạo `assets/lines.json`: mỗi dòng thoại có `id`, `speaker` (`chi` | `cao_uv` | `cao_dan`), `text_sub` (đúng chữ cột phụ đề), `text_tts` (áp **bảng cách đọc** đầu `script.md`; số viết thành chữ), `template`, `pose`.
2. **TTS:** gọi VieNeu cho từng dòng (gói `pip install vieneu`, chạy CPU; xem `docs/voice.md`). `chi` = Quỳnh Anh, `cao_*` = Minh Đức, cả 2 dùng `temperature=0.65`. Sau khi lưu mỗi `.wav`, chạy thêm `ffmpeg -filter:a atempo=1.08` (+8% tốc độ) rồi mới lưu `assets/vo/<id>.wav`. **Nghe thử cách đọc** các từ trong bảng cách đọc (Claude không nghe được -> ghi `notes.md` rằng giám đốc cần nghe lại mẫu `assets/vo/_check.wav`, ghép mọi từ khó). Có từ đọc sai -> đổi `text_tts` (không đổi phụ đề).
3. **Timeline thật:** đo mỗi wav bằng `ffprobe`, cộng nghỉ theo mục 3, ra mốc bắt đầu/kết thúc mỗi dòng. **Timecode trong script là mục tiêu; mốc thật theo audio.** Tổng lệch ≤ ±15s so mục tiêu thì chấp nhận; lệch hơn -> báo trong `notes.md` rồi ưu tiên bỏ các dòng `[CẮT-90]` (nếu quá dài) hoặc thêm khoảng nghỉ/hiệu ứng (nếu quá ngắn). Mốc chương là chỗ ghép chuẩn.
4. **Sinh `captions.srt`** từ timeline (trước khi dựng hình).
5. **Dựng 10 mẫu cảnh (M0–M9) một lần**, rồi sinh đoạn cho từng dòng/chương: ffmpeg (drawtext, libass, overlay) hoặc render PNG bằng thư viện **đã có sẵn** trên máy (không tải gói/phông/ảnh từ ngoài). Nguyên tắc: **cứ ≤ 8 giây phải đổi một thứ nhìn thấy** (bong bóng mới, tem, dòng mới, đổi dáng Cáo, đổi mẫu).
6. **Lớp Cáo:** `node tools/fox/narrate.mjs --audio <vo_full.wav> --timeline timeline.json --out assets/cao_small.mov --height 440 --bottom 420 --pos left`, và lần nữa với `--height 760 --pos center` ra `assets/cao_big.mov`. Ghép chọn lớp theo cột "Cáo (cỡ)" trong script. Timeline dáng tạo từ cột **Cáo** (đúng tên dáng; xem `brand/cao/poses/`). **Mỗi lần đổi dáng cách nhau ≥ 2 giây** (script đã tuân thủ; đừng thêm đổi dáng tự động của narrate: truyền `--poses` cố định bằng dáng đã chọn). Nhún theo độ lớn tiếng giữ nguyên (đồng bộ theo âm lượng, **không** gọi là "nhép miệng").
7. **Ghép:** nền -> mẫu cảnh -> Cáo -> phụ đề đốt cứng -> huy hiệu hư cấu -> thanh chương. Trộn: giọng + SFX (+ nhạc nếu có). `loudnorm`.
8. **Xuất 3 bản** (`final/IT-T1-Ennn_full.mp4`, `_p1.mp4`, `_p2.mp4`): MP4, H.264 `yuv420p` + AAC, `-movflags +faststart`, 1080×1920, 30 fps. Kèm `captions*.srt`, ảnh bìa gợi ý `final/cover.png` (khung 1080×1920 có tên tập, Cáo `think`).
9. **`final/publish.json`** mỗi tập, đúng 3 nền tảng (`tiktok`, `facebook_reels`, `youtube_shorts`), mỗi nền tảng có `title` (TikTok/Reels có thể rỗng theo spec), `description`, `hashtags`, `recommended_variant` (xem mục 6), và `ai_disclosure`. **Mô tả kết thúc bằng câu khai báo AI.** Tiêu đề/mô tả/hashtag đề xuất đã có cuối `script.md`.
10. **Tự QC trước khi báo xong** theo mục 7; ghi kết quả vào `notes.md`.

## 6. Khuyến nghị khi đăng (giám đốc tự đăng; chưa kiểm chứng trần thời lượng)
| Nền tảng | Mặc định đề xuất | Dự phòng |
|---|---|---|
| TikTok | Bản `full` (~4 phút) | `p1` + `p2` đăng 2 lần |
| YouTube | `full` như video thường (hoặc `p1`/`p2` làm Shorts nếu trần Shorts đủ) | — |
| Facebook | `p1` và `p2` (~2 phút) | rút <= 90s (mục 4.3) nếu trần Reels là 90s |
Lịch đăng 2 tập: chờ giám đốc quyết (mục "Cần giám đốc cung cấp"). **Mặc định giả định: đăng E01 trước, E02 cách 1 ngày**, nên giữ teaser ở cuối E01.

## 7. Tiêu chí nghiệm thu (đo được)
QC chấm từng mục; **rớt mục nào ghi rõ mục đó, không làm tròn.**

| # | Tiêu chí | Cách đo |
|---|---|---|
| 1 | Độ phân giải 1080×1920, 9:16, 30 fps, H.264 yuv420p + AAC, faststart | `ffprobe` |
| 2 | Thời lượng: `full` trong [3:45, 4:15]; `p1`, `p2` mỗi bản trong [1:45, 2:30] | `ffprobe` |
| 3 | Dung lượng mỗi file ≤ 250 MB | kích thước file |
| 4 | Loudness −14 LUFS ±1; đỉnh ≤ −1,5 dBTP; luôn có luồng audio | `ffmpeg loudnorm` / `ebur128` |
| 5 | **Hook trong 2 giây đầu:** khung 0–2s có chữ hook lớn + Cáo `wave` + đã có âm thanh giọng (kể cả `p2`: intro 4s có hook) | xem khung giây 0, 1, 2 |
| 6 | Có `captions.srt` (+ `_p1`, `_p2`), mốc khớp lời, chữ y hệt script | so sánh với script |
| 7 | Phụ đề/chữ quan trọng trong y ∈ [250, 1500], lề ≥ 90 px; không bị huy hiệu che | trích khung mỗi chương |
| 8 | **Huy hiệu hư cấu hiện suốt** mọi bản; có thẻ mở (M0) và thẻ cuối (M0) | trích khung đầu/giữa/cuối |
| 9 | Thẻ cuối có `ai_disclosure`; `publish.json` có đủ 3 nền tảng; **mô tả kết thúc bằng câu khai báo AI** | đọc file |
| 10 | Mỗi chương có ≥ 1 khoảnh khắc thị giác mang nội dung theo bảng chương trong script; cứ ≤ 8s đổi một thứ | xem video |
| 11 | Mỗi lần đổi dáng Cáo cách ≥ 2s; dùng đúng tên dáng; Cáo có mặt ≥ 60% thời lượng | timeline.json |
| 12 | Mọi thẻ hai cột "Khá chắc chắn / Tuỳ công ty" có ghi chú: *"Nhận định chung, không phải tư vấn pháp lý hay chính sách công ty bạn."*; có ở cả hai tập | trích khung |
| 13 | Không có: số liệu, tên công ty, chữ "bắt buộc phải" cho điều tuỳ công ty; chữ "pháp lý" chỉ ở câu miễn trừ | tìm chữ trong script/khung |
| 14 | Tập 2 trả lời trực tiếp câu mở của tập 1 trong chương 0–2 (ghi rõ ở script) | đọc script/video |
| 15 | Mỗi tập đứng một mình: E02 có thẻ tóm tắt 5 giây ở chương 0 | xem khung |
| 16 | Không dùng nhạc/hình/phông tải ngoài; nhạc (nếu có) có dòng trong `LICENSES.md` | đối chiếu |

## 8. Nguyên liệu cần
Chỉ lấy từ `docs/asset-sources.md`:
| Thứ | Nguồn | Trạng thái |
|---|---|---|
| Dáng Cáo (46) | `brand/cao/poses/*.png`, tra tên ở `brand/cao/catalog.png` | Có |
| Công cụ lớp Cáo | `node tools/fox/narrate.mjs` | Có |
| Đồ hoạ, khung chat, thẻ chữ, code giả, SFX | tự tạo bằng ffmpeg (+ thư viện máy đã có) | Có |
| Phông | Segoe UI, Bahnschrift, Arial, Tahoma (Windows) | Có |
| **Giọng TTS** | VieNeu-TTS v3 Turbo (CPU) | **Có công cụ, chưa chốt giọng** -> mục 10 |
| **Nhạc nền** | `library/music/` (đang trống) | **Thiếu** -> mục 10 (tuỳ chọn) |
| Ảnh/clip stock, người thật, AI-gen hình | — | Không dùng, không cần |

## 9. Rủi ro và phương án dự phòng
| Rủi ro | Dự phòng |
|---|---|
| Chưa chốt giọng VieNeu / giọng đọc sai dấu, sai từ mượn | **Chưa có giọng chính thức -> Codex dừng ở bước 2, ghi `blocked` trong `notes.md` và báo giám đốc** (khuyến nghị của cả A và B: không bắt đầu sản xuất khi chưa chốt). Không tự chọn giọng thay giám đốc. Từ đọc sai: sửa `text_tts` theo bảng cách đọc |
| TTS không chạy được trên máy (CPU/ONNX lỗi) | Báo `escalate`. Nếu giám đốc đồng ý, làm bản chỉ phụ đề + SFX (nhịp đọc ước lượng 3,5 từ/giây); chất lượng kém hơn, không đưa lên `ready` mà không hỏi |
| 4 phút không nhép miệng gây đơn điệu | Đã có: đổi dáng mỗi 2–4s, ≤ 8s đổi một thứ nhìn thấy, mỗi chương có khoảnh khắc thị giác (tem, code giả, vạch che, hai cột, đứng dậy). Nếu thử thấy tụt giữ chân -> rút còn 3 phút (cắt dòng `[CẮT-90]`) |
| Sticker Cáo mềm khi phóng 760px | Dùng Cáo to chỉ ở M0/M1/M8/M9 (ngắn); phần còn lại Cáo nhỏ 440 px |
| Phông thiếu dấu/mất glyph | Kiểm render thử; đổi Segoe UI -> Arial/Tahoma |
| Huy hiệu bị thanh UI nền tảng che | Đặt góc trái-trên (đã chọn); QC trích khung |
| Trần thời lượng nền tảng khác giả định | Đã dựng 3 bản; thêm bản rút 90s nếu cần (mục 4.3) |
| Chữ trong khung quá dài, tràn | Cắt dòng theo giới hạn mục 2; không thu nhỏ chữ dưới 42 px |
| Ghi nhớ: Cáo không nhép miệng | Tuyệt đối không dựng cảnh cận mặt Cáo "nói" |
| Không có nhạc | Dựng không nhạc |

## 10. Cần giám đốc cung cấp / quyết
1. ~~Giọng TTS cụ thể~~ — **đã chốt 17/11/2026:** Quỳnh Anh (Chị Phỏng vấn) + Minh Đức (Cáo), cả hai giọng Bắc, `temperature=0.65` + tăng tốc 8%. Đủ điều kiện sản xuất.
2. ~~Dựng mấy bản mỗi tập~~ — **đã chốt:** giám đốc đồng ý dựng đủ 3 bản/tập (dài ~4 phút + 2 nửa ~2 phút) như đề xuất.
3. **Lịch đăng 2 tập:** cách nhau một ngày hay cùng lúc? (Mặc định giả định cách một ngày, giữ teaser. Cùng lúc hoặc gộp -> bỏ dòng `[TEASER]` ở cuối E01.)
4. **Chấp nhận 4 phút/tập** (ngoại lệ 15–45s) hay hạ xuống 3 phút nếu dữ liệu giữ chân kém. Mặc định: giữ 4 phút.
5. **Nhạc nền** (tuỳ chọn): file có giấy phép rõ ràng vào `library/music/` + `LICENSES.md`. Không có thì dựng không nhạc.
6. ~~Bộ câu cửa miệng + nhãn "Chị Phỏng vấn"~~ — **đã chốt:** giữ Bộ A cho video này (chính sách mới cho phép đổi/trộn bộ theo từng video), giữ nguyên nhãn "Chị Phỏng vấn" (dùng giọng nữ Quỳnh Anh thay vì đổi tên).
7. Nhắc lại từ `docs/mascot.md`: ảnh Cáo chưa rõ do công cụ AI nào tạo, cần kiểm điều khoản thương mại trước khi đăng.

## 11. Giả định đã ghi (an toàn)
- Giả định: người phỏng vấn "Chị Phỏng vấn" là nữ (giọng nữ miền Bắc) nếu có; không có hình người, chỉ khung chat.
- Giả định: giám đốc đăng E01 trước, E02 cách một ngày -> câu mở "tập sau" ở E01 giữ (theo điều kiện 8 của B; tập 2 trả lời ngay).
- Giả định: các trần thời lượng ở `concept.md` mục 8 là **chưa kiểm chứng**.
- Không tra thêm web vì kịch bản **không dùng số liệu hay sự kiện cần nguồn** (toàn nguyên tắc định tính); các tuyên bố nền tảng chỉ có ở mục 8 `concept.md` với nhãn chưa kiểm chứng.
