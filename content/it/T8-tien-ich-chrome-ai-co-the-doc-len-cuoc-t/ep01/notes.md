# IT-T8-E01 · Đường đi của bản sao

## Hướng dẫn từ Claude (19/11/2026) — LÀM TRƯỚC

Việc sản xuất #29 bị **huỷ lúc 11:02** khi Producer đang đọc báo cáo `assets/_scratch/qc-auto/report.md` (không có lỗi kỹ thuật). Bản dựng **đã có và qua `qc-video`**: `final/IT-T8-E01_9x16.mp4` (41,9 s, 1080×1920, −14,4 LUFS), `final/captions.srt`, `final/publish.json`, `final/thumbnail.jpg`, `assets/scenes.json`, `assets/voice/*` (kèm `term-check/`). **Chưa có `notes.md` đầy đủ và video còn ở `production`.** Việc còn lại, làm đúng thứ tự, **không dựng lại hình/giọng nếu không phát hiện lỗi thật**:

1. Chạy lại `node tools/qc-measure.mjs <thư mục ep01> --min 15 --max 45 --baseline docs/baseline/T5-qc-auto.json` (công cụ vừa sửa cách nhận chủ đề nền: nay phải ra 4 chủ đề office/security/code/incident). Đọc `report.md`, mở ảnh bằng chứng, và nêu từng cảnh báo còn lại.
2. Tự kiểm bằng mắt ở 360×640: **không còn nhãn «AI tạo»/«Ví dụ dựng» hay chữ/hình thừa**; chữ trên hình chỉ lấy từ cột “Chữ trên màn hình”; phụ đề ≥ 64 px (thử), ≤ 2 dòng; hook trong 2 s đầu; bìa là khung hook, đọc được ở 180×320.
3. R12/camera: storyboard chỉ khai **một** cảnh có chuyển động camera (cảnh 08, `push_in`). Nói rõ trong `notes.md` cảnh 08 đã dựng chuyển động thật chưa và bằng cách nào (so khung đầu/cuối), hoặc đã dựng thế nào nếu không có.
4. R11: ghi bảng “khẳng định chính → sự kiện hình chứng minh → mốc giây” cho mọi khẳng định chính của kịch bản.
5. Y8: `python tools/voice/phonemes.py --lines assets/voice/apply.json --extra assets/voice/pronunciation.local.json` phải mã 0; ghi âm vị từng thuật ngữ vào bảng “Mẫu nghe thuật ngữ” (clip ở `assets/voice/term-check/`). Phát âm, tốc độ, nhịp nghỉ: **CHƯA KIỂM — giám đốc nghe**. Không đưa audio vào mô hình.
6. Viết `notes.md` đủ mục như bản T5: Thành phẩm · Thời lượng và nhịp · Nguyên liệu · Kỹ thuật · Tuân thủ · Trải nghiệm xem (đủ Y1–Y8, R11, R12) · Mẫu nghe thuật ngữ. **Giữ nguyên mục này** (“Hướng dẫn từ Claude”); chỉ thêm các mục khác bên dưới.
7. Xong: `set_video_stage(video_id, "review")`, `report_status(... "idle")`, dòng cuối `DONE`. Đừng chạy lại các bước tốn thời gian nếu không cần.

## Thành phẩm

- [IT-T8-E01_9x16.mp4](final/IT-T8-E01_9x16.mp4) — 41,900 giây.
- [thumbnail.jpg](final/thumbnail.jpg) — khung hook khoảng 1,80 giây.
- [captions.srt](final/captions.srt) — 20 cue khớp đủ 17 câu của cột lời đọc.
- [publish.json](final/publish.json) — nội dung đăng cho TikTok, Facebook Reels và YouTube Shorts.

Trong lần kiểm lại, Producer dựng lại riêng cảnh 04 để tách thẻ sao và bóng khỏi dòng quyền. Khoảng hở giữa thẻ sao, bản gốc và biểu tượng tiện ích thấy được ở 14,30 giây. Cú tách vẫn bắt đầu ở khung 390 (13,00 giây). Ghép lại phụ đề từ ASS hiện có, sao chép trực tiếp luồng AAC và xác nhận SHA-256 của luồng AAC khớp bản trước. [Khung so trước và sau mốc 13 giây](assets/_scratch/qc-auto/hook-and-permission.jpg)

## Thời lượng và nhịp

Bản đo 41,900 giây, so với kế hoạch 41,903 giây. Có 31,811 giây clip giọng đã xử lý và 10,089 giây đệm sau câu, gồm 0,500 giây đệm cuối. Phép đo trên bản MP4 ở ngưỡng −40 dB cho đuôi im 0,536 giây do tính thêm phần cuối câu dưới ngưỡng. Bản dựng có 10 cảnh, trung bình 4,19 giây, ngắn nhất 3,00 giây và dài nhất 6,267 giây. [Báo cáo khoảng lặng](assets/_scratch/qc-auto/report.md)

| Cảnh | Mốc thật (giây) | Chủ đề và bố cục |
| --- | --- | --- |
| 01 | 0,000–4,000 | A · Văn phòng nhìn ngang bàn |
| 02 | 4,000–8,033 | E · Máy chủ, cận thẳng khe nhận |
| 03 | 8,033–12,133 | B · Cửa hàng tiện ích, toàn |
| 04 | 12,133–16,033 | B · Hộp quyền và tab chat, cận |
| 05 | 16,033–19,033 | C · Sơ đồ đối chứng, toàn |
| 06 | 19,033–24,500 | C · Bộ đếm và khay gom, trung |
| 07 | 24,500–28,500 | D · Màn hình quản lý, toàn |
| 08 | 28,500–32,400 | E · Máy chủ, cận nghiêng và tiến máy |
| 09 | 32,400–35,633 | A · Văn phòng nhìn từ trên |
| 10 | 35,633–41,900 | A · Văn phòng nhìn ngang bàn, thẻ kiểm tra bên phải |

Mốc cảnh và lời sau TTS được lưu để Kịch bản và Đạo diễn hình ảnh đối chiếu ở bước review. Câu hỏi bắt đầu ở 3,08 giây và vắt qua cú cắt ở 4,00 giây. Mốc mở câu và mốc hết khoảng lặng gần nhất lệch tối đa 0,149 giây trong 19 cue công cụ ghép được. [Mốc cảnh](assets/scenes.json) · [Mốc từng lời](assets/voice/timeline.json) · [Đo từng clip giọng](assets/voice/measurements.json)

## Nguyên liệu

| Nguyên liệu | Nguồn dùng |
| --- | --- |
| Ba dáng Cáo | `brand/cao/poses/surprised.png`, `point_right.png`, `thumbs_up.png` từ bộ pose của xưởng. |
| Bối cảnh | Nền ba lớp từ `tools/backgrounds/make_background.py`. Seed 8 cho `office`, `incident`, `security`, `code`. Cảnh 07 dùng `security` seed 17 với bố cục quản lý riêng. [Nền đã tạo](assets/_scratch/backgrounds/) |
| Giao diện, sơ đồ, hồ sơ và máy chủ | Đồ họa 2D bằng Pillow. Hồ sơ dùng chân dung hình khối, góc cam và vạch trừu tượng. [Mã dựng hình](assets/_scratch/visuals.py) |
| Chữ, giọng và hiệu ứng | Segoe UI Semibold/Bold trên Windows. VieNeu-TTS cục bộ, giọng Minh Đức theo plan của tập. Ba hiệu ứng tự tổng hợp khi tách, nhận và ngắt. [Giọng đã ghép](assets/voice/narration.wav) · [Hiệu ứng](assets/sound/) |

## Kỹ thuật

- `ffprobe` đo 1.080×1.920, 30 fps, H.264 `yuv420p`, AAC mono 48.000 Hz và 4.227.216 byte. Kiểm cấu trúc MP4 thấy `moov` trước `mdat`, đạt faststart.
- `qc-video --min 15 --max 45 --scenes assets/scenes.json` trả `pass: true`, `fails: []`, `warns: []`. Âm lượng tích hợp −14,4 LUFS, đỉnh −1,74 dBTP, LRA 1,6 LU. [JSON QC video](assets/_scratch/qc-video.json)
- `qc-publish` trả `pass: true`, `fails: []`, `warns: []`. [JSON QC nội dung đăng](assets/_scratch/qc-publish.json)
- `qc-measure --min 15 --max 45 --baseline docs/baseline/T5-qc-auto.json` trả 5 phát hiện thông tin, 0 cảnh báo, 0 lỗi. So với T5, tỷ lệ tĩnh 22,727% so với 30,787%, cắt 2,148 so với 3,809 lần mỗi 10 giây, chuỗi cùng nền dài nhất 2 so với 6 cảnh. [Báo cáo và bằng chứng](assets/_scratch/qc-auto/report.md)

## Tuân thủ

- Storyboard `APPROVED` chỉ định Pillow + FFmpeg. Giao diện, hồ sơ và máy chủ là minh họa của xưởng. Âm thanh gồm giọng đọc và ba hiệu ứng tự tạo. Thư mục `final/` có đúng bốn tệp giao.
- Cả ba mô tả gắn “(ví dụ dựng)” với tình huống của Cáo và kết bằng đúng câu `ai_disclosure`. `ai_generated_content` là `true`. Công tắc khai báo AI được bật ở bước đăng.
- Phần dẫn báo cáo dùng quy mô cài ở mức “hàng trăm nghìn”, hai tiện ích, một huy hiệu và chu kỳ khoảng 30 phút kèm địa chỉ trang. Tình huống của Cáo minh họa quyền đọc trang và dữ liệu có thể còn ở đích sau khi gỡ. [Báo cáo gốc OX Security](https://www.ox.security/blog/malicious-chrome-extensions-steal-chatgpt-deepseek-conversations/) · [Hướng dẫn quản lý tiện ích Chrome](https://support.google.com/chrome_webstore/answer/2664769)

## Trải nghiệm xem

| Nhóm | Kết quả tự kiểm và bằng chứng |
| --- | --- |
| Y1 · Chữ và phụ đề | Đã xem khung 0,50 / 20,95 / 40,80 giây và các cụm hành động ở 360×640. Phụ đề đốt cứng Segoe UI Bold, cỡ ASS 70 tại PlayRes 1080×1920, viền 5 px, tối đa 2 dòng và 24 ký tự/dòng. Chữ đúng dấu và tách khỏi đạo cụ ở các khung đã kiểm. Nhãn UI cỡ 56 px, các mục nhấn cỡ 72 px, tối đa 2 nhóm chữ UI hiện đồng thời. Cảnh 03 theo `text_overlay` của storyboard đã duyệt, gồm “Trợ lý AI” và “Featured”. Kịch bản còn liệt kê “Miễn phí”. Hai nhãn “AI tạo” và “Ví dụ dựng” chỉ thuộc phần khai báo hoặc mô tả đăng. [Cửa hàng tiện ích và khay](assets/_scratch/qc-auto/store-and-safe-tray.jpg) · [Bằng chứng QC](assets/_scratch/qc-auto/report.md) |
| Y2 · Bản đồ Cáo | Dáng `surprised` ở 0,000–4,000 giây, `point_right` ở 12,133–16,033 giây, `thumbs_up` ở 35,633–41,900 giây. Tổng 14,167 giây (33,8%). Cảnh giải thích hai luồng và các đợt gửi dành toàn khung cho minh họa. |
| Y3 · Cỡ và vai trò Cáo | Hộp alpha của 01 và 04 rộng 216 px (20% khung), tại x105/y930 và x100/y850. Cảnh 10 rộng 302 px, cao 471 px tại x100/y710, khoảng 1,45× ảnh nguồn 209×326. Hồ sơ, vùng quyền và hai thẻ kiểm tra hoạt động bên phải Cáo. Chữ đặt ở phía trên trong các cảnh có Cáo. [Cảnh 01 và 04](assets/_scratch/qc-auto/hook-and-permission.jpg) · [Cảnh 10](assets/_scratch/qc-auto/close-and-quiet.jpg) |
| Y4 · Nền theo nội dung | Năm bối cảnh theo plan, gồm bốn chủ đề công cụ nhận ra. B và D cùng họ `security` nhưng khác seed và cách dàn cảnh. Office chiếm 13,5 giây (32,22%), security 12 giây (28,64%), code 8,467 giây (20,21%), incident 7,933 giây (18,93%). Nền, vật chính và lớp gần có sắc độ tách nhau. [Khung các bối cảnh](assets/_scratch/qc-auto/report.md) |
| Y5 · Mở, giải thích và kết | Bản sao tách thấy rõ ở 1,80 giây. Máy chủ nhận từ 4,00 giây. Hộp quyền chạm hồ sơ và bản sao xuất hiện ở tiện ích từ 13,00 giây. Cảnh 09–10 đưa hồ sơ trở lại văn phòng, đặt ở khay ngoài ô chat và mở hai mục kiểm trước khi cài. Câu hỏi cuối bắt đầu ở 37,519 giây. [Hook và câu trả lời](assets/_scratch/qc-auto/hook-and-permission.jpg) · [Câu chốt](assets/_scratch/qc-auto/close-and-quiet.jpg) |
| Y6 · Tốc độ | 11 câu dẫn ở `atempo=1.03`, tổng 19,306 giây. 6 câu kỹ thuật ở `atempo=0.97`, tổng 12,505 giây. **CHƯA KIỂM — giám đốc nghe** độ tự nhiên và tốc độ cảm nhận. [Số đo từng câu](assets/voice/measurements.json) |
| Y7 · Nhịp nghỉ | Đối chiếu ba khoảng lặng từ 0,8 giây trở lên ở bảng dưới. Cuối câu hỏi ở cảnh 10, khoảng lặng đo 0,748 giây đi với hai thẻ đang mở. Đuôi im 0,536 giây. **CHƯA KIỂM — giám đốc nghe** nhịp nghỉ. [Báo cáo khoảng lặng](assets/_scratch/qc-auto/report.md) |
| Y8 · Phát âm | `pronounce.mjs check` và `phonemes.py --lines … --extra …` đều mã 0. Kiểm 17 câu, hai lần “chat” cho cùng âm vị. `verified:false` ở mục từ điển riêng. **CHƯA KIỂM — giám đốc nghe** phát âm thật. [Văn bản TTS](assets/voice/apply.json) · [Từ điển riêng](assets/voice/pronunciation.local.json) |

### Nhịp lặng, độ tĩnh và bìa

| Phát hiện | Đối chiếu bằng mắt |
| --- | --- |
| M-01 · 22,600–23,600 giây | Giữ hai thẻ cạnh nhau trong 1,00 giây để đọc “Nội dung chat” và “Địa chỉ trang” trước khi chúng rời khay. `qc-video` cũng đo 1,00 giây quanh 35,60 giây, khi giữ khay xanh ở cú cắt 09→10 rồi mở thẻ quyền. Không có đoạn tĩnh quá 2 giây. [Khung đối chiếu](assets/_scratch/qc-auto/close-and-quiet.jpg) |
| M-02 · 4,699–5,516 giây · 0,817 giây | Ô nhắc lại bản gốc rút về bên trái, trả tiêu điểm cho bản sao đang đi vào khay máy chủ. [Khung đối chiếu](assets/_scratch/qc-auto/three-pauses.jpg) |
| M-03 · 7,060–8,045 giây · 0,985 giây | Môi khay trượt lên quanh thẻ đã nhận, rồi cắt sang hàng đầu tiên trong cửa hàng ở 8,033 giây. [Khung đối chiếu](assets/_scratch/qc-auto/three-pauses.jpg) |
| M-04 · 15,209–16,063 giây · 0,855 giây | Lớp quét vàng và nhãn quyền thu lại, giữ góc cam cạnh nhánh đỏ trước khi mở sơ đồ hai tuyến ở 16,033 giây. [Khung đối chiếu](assets/_scratch/qc-auto/three-pauses.jpg) |

R7 · Đã mở bìa ở 180×320. Nhận ra Cáo và hai thẻ cùng góc cam, một thẻ còn trong vùng nội dung và một thẻ đã tách lên trên. [Bìa thu nhỏ](assets/_scratch/qc-auto/thumb-180x320.png)

### R11 · Khẳng định và bằng chứng hình

| Khẳng định chính | Sự kiện thấy trên hình | Mốc trên bản xuất (giây) |
| --- | --- | --- |
| Dữ liệu trong chat có thể bị sao chép ra ngoài. | Bản gốc vào ô chat, bản sao cùng góc cam tách ra và được máy chủ nhận. Ô nhỏ giữ dấu vết bản gốc ở đầu cảnh 02 trong khi bản sao dịch vào khay. | 0,35–1,80 và 4,00–5,50 |
| Vụ được báo cáo có hai tiện ích giả làm trợ lý, một bản có huy hiệu. | Hai hàng cài xuất hiện lần lượt. Con trỏ chọn hàng duy nhất có Featured. Con số cài là ngữ cảnh từ báo cáo trong lời dẫn, còn các thẻ xám ở máy chủ biểu thị khay nhận. | 5,49–7,09 và 8,03–10,40 |
| Quyền đọc mọi trang có thể bao gồm nội dung chat. | Mặt thẻ quyền mở thành lớp vàng, quét qua các trang và chạm hồ sơ. Tiện ích đổi màu và hiện thẻ sao, bản gốc vẫn ở tab. | 12,13–14,30, bắt đầu tách ở 13,00 |
| Tiện ích có ý xấu có thể gửi bản sao theo một nhánh riêng. | Xung xanh tới chatbot. Bản sao rẽ ở biểu tượng tiện ích trên nhánh đỏ và đi vào khay gom. Hai chuyển động có đích riêng. | 16,07–18,43 |
| Báo cáo ghi đợt gửi khoảng 30 phút, có cả địa chỉ trang. | Cung vàng giảm, hồ sơ và thẻ địa chỉ vào hai hộc rồi đi qua một đường ra. Vòng đếm trở lại vạch đầu. | 19,04–24,36 |
| Có thể kiểm nhà phát hành, kiểm quyền và gỡ tiện ích không dùng. | Con trỏ mở từng hàng thông tin, chuyển sang mục đã cài rồi chọn “Gỡ”. Hàng biến mất, những hàng bên dưới trượt lên. | 25,00–28,23 |
| Lượt gửi tiếp dừng, bản cũ có thể còn ngoài máy người dùng. | Đường đỏ gãy và chuyển xám. Chấm vàng dừng rồi tan. Khay mở để lộ bản cũ còn góc cam. | 28,50–31,90 |
| Giữ thông tin nhạy cảm ngoài chat và kiểm trước khi cài. | Ở cùng bàn như cảnh mở, ba thẻ chạm mép chat rồi đổi hướng vào khay xanh. Hai mục kiểm mở rồi thu lại, nút cài vẫn đang chờ. | 32,60–35,53 và 36,90–41,65 |

[Hook và hộp quyền](assets/_scratch/qc-auto/hook-and-permission.jpg) · [Hai tuyến và đợt gửi](assets/_scratch/qc-auto/two-routes-and-batch.jpg) · [Gỡ và kiểm lại](assets/_scratch/qc-auto/prevent-and-recheck.jpg) · [Cửa hàng và khay ngoài](assets/_scratch/qc-auto/store-and-safe-tray.jpg) · [Cảnh kết](assets/_scratch/qc-auto/close-and-quiet.jpg)

### R12 · Bố cục và chuyển động camera

Cảnh 08 là cảnh duy nhất khai camera chuyển động. Đã dựng cú tiến máy thật bằng FFmpeg `zoompan` trên khung Pillow 2.160×3.840, lấy neo (570, 935) theo hệ 1080×1920. Hệ số lên từ 1,00× đến 1,12× theo smoothstep khoảng 30,77–31,97 giây, giữ đến cú cắt. Khung 28,500 và 32,367 giây cho thấy thân máy chủ lớn lên quanh khay, đường gửi đã xám và hồ sơ cũ lộ trên khay. Hiệu RGB toàn khung đo 12,824/255, gồm cả thay đổi của khay và các lớp hình. Phụ đề ghép sau camera. [Hai khung camera](assets/_scratch/qc-auto/camera-08.png)

Chín cảnh còn lại giữ camera tĩnh và diễn hoạt đạo cụ theo storyboard. Ba cỡ cảnh toàn, trung, cận luân phiên. Công cụ đo thấy 10 nhóm bố cục, chuỗi cùng nhóm dài nhất một cảnh, trung vị khối hoạt động của mọi cảnh từ 1 đến 10. Chuỗi cùng chủ đề dài nhất hai cảnh. [Bảng từng cảnh](assets/_scratch/qc-auto/report.md)

## Mẫu nghe thuật ngữ

| Thuật ngữ | Chữ đưa vào TTS | Âm vị từ công cụ | Nguồn | Clip |
| --- | --- | --- | --- | --- |
| Chat / chat | `chat` | `tʃˈæt` ở cả hai ngữ cảnh | Từ điển riêng, `verified:false` | [Từ riêng, 0,263 giây](assets/voice/term-check/chat.wav) · [Lời 02, 1,635 giây](assets/voice/term-check/chat-loi-02.wav) · [Lời 06, 3,109 giây](assets/voice/term-check/chat-loi-06.wav) |

`sao` và `huy` là hai từ tiếng Việt được bỏ qua khi quét. Các nhãn tiếng Anh chỉ xuất hiện trên hình không đưa vào TTS. **CHƯA KIỂM — giám đốc nghe** độ tự nhiên, tốc độ, nhịp và phát âm thực tế.

## QC — lượt 1 (Claude, 19/11/2026)

QC đo độc lập bằng một lệnh đơn `node tools/qc-measure.mjs … --min 15 --max 45 --baseline docs/baseline/T5-qc-auto.json --out assets/_scratch/qc-lan-1 --frames "0.5,1.8,3.5,5.0,9.5,13.0,14.3,20.5,23.3,26.5,30.0,34.0,36.5,38.5,41.5"` (không ghi đè `qc-auto/` của Producer), kèm khung full-res và bảng khung 3–4 Hz do QC tự chiết bằng `ffmpeg`. Số đo dưới đây là của QC; chỉ đối chiếu với ghi chép Producer sau khi đo. Toàn bộ ảnh/log ở `assets/_scratch/qc-lan-1/`: [report.md](assets/_scratch/qc-lan-1/report.md) · [board-01](assets/_scratch/qc-lan-1/board-01.png) · [board-02](assets/_scratch/qc-lan-1/board-02.png) · [board-03](assets/_scratch/qc-lan-1/board-03.png) · [camera-08](assets/_scratch/qc-lan-1/camera-08.png) · [thumb-180x320](assets/_scratch/qc-lan-1/thumb-180x320.png).

### Ba kết luận

| Trục | Kết luận | Bằng chứng chính |
| --- | --- | --- |
| KỸ THUẬT | **ĐẠT** | ffprobe 1080×1920, 30 fps, H.264/yuv420p, AAC, 41,9 s (15–45). `qc-video` `pass:true`, `fails:[]`, `warns:[]`. −14,4 LUFS, −1,74 dBTP. Đuôi im 0,536 s (≤ 0,7). Đoạn tĩnh dài nhất 1,0 s (22,6–23,6 s). `qc-measure` 5 phát hiện thông tin, 0 cảnh báo, 0 lỗi. Phụ đề: 20 cue, ≤ 2 dòng, ≤ 24 ký tự/dòng, ASS cỡ 70 (≥ 64), lệch cue–tiếng −0,012…−0,149 s. |
| TUÂN THỦ | **ĐẠT** | Không hình/clip ngoài: Cáo từ `brand/cao/poses`, nền sinh bằng `make_background.py`, hình Pillow, VieNeu cục bộ, hiệu ứng tự tổng hợp, nên không cần dòng ở `library/LICENSES.md` (ghi chú đầu tệp). `publish.json` đủ 3 nền tảng (tiêu đề, mô tả, 3 hashtag), `ai_generated_content:true`, `ai_disclosure` ở cuối mô tả, “(ví dụ dựng)” nằm ở caption/mô tả cả 3 nền tảng, không nhãn trên hình. `final/` đúng 4 tệp (không phải dọn). `thumbnail.jpg` 1080×1920. Độ chính xác: QC đọc lại bài OX Security ngày 19/11/2026, xác nhận hai tiện ích, tổng khoảng 900 nghìn lượt cài (600 nghìn + 300 nghìn), một bản có huy hiệu Featured, gửi nội dung chat và địa chỉ các tab về máy chủ ngoài mỗi 30 phút, khuyến nghị gỡ ngay. Video chỉ nói “hàng trăm nghìn người”, không nêu tên hãng, không hướng dẫn tấn công. |
| TRẢI NGHIỆM | **CHƯA ĐẠT một phần (R3, chữ tràn/dính viền, sửa được khi dựng lại)**; các nhóm còn lại đạt; nghe giọng CHƯA KIỂM | QC-01 (“≈ 30 phút” tràn vòng, 19,03–21,3 s) và QC-02 (nhãn “Chatbot” dính viền thẻ, 16,03–19,03 s). Hook, bản đồ Cáo, nền theo ngữ cảnh, camera cảnh 08, R11 đều đạt. Y6–Y8 phần nghe **CHƯA KIỂM — giám đốc nghe**. |

**Phán quyết: FAIL — lỗi dựng sửa được.** Không có lỗi thiết kế (hook, kể chuyện, bản đồ Cáo, R11/R12 đạt), nên không dùng nhánh `QC-THIẾT-KẾ`. Video về `production`, chỉ sửa cục bộ hai nhãn (xem “QC — cần sửa”).

### Bảng phát hiện (mọi lỗi, cảnh báo, phát hiện bằng mắt)

| Mã | Nhóm | Mốc | Bằng chứng (số đo + ảnh/log) | Mức | Đề nghị |
| --- | --- | --- | --- | --- | --- |
| QC-01 | TRẢI NGHIỆM · R3 (chữ tràn/dính viền) | Cảnh 06, 19,03–~21,3 s (≈ 2,25 s; 9/9 mẫu 4 Hz) | Chữ “≈ 30 phút” cỡ ~72 px rộng ≈ 330 px (x 378–706) đặt trong vòng đồng hồ ngoài Ø ≈ 336 px (x 372–708): dấu “≈” chạm viền ngoài bên trái, chữ “t” đè lên cung vàng và viền ngoài bên phải. Đây là con số chính của cảnh. Ảnh: `assets/_scratch/qc-lan-1/frame-20.5.png`, `assets/_scratch/qc-lan-1/sheet-scene06.png` | **LỖI DỰNG (FAIL)** | Cho chữ nằm trọn trong vòng trong (lề ≥ 16 px): vd “≈ 30” cỡ 72 px trong vòng, “phút” dòng dưới cỡ ≥ 56 px, hoặc phóng vòng lên Ø ≥ 420 px. Chỉ đổi lớp nhãn của cảnh 06 |
| QC-02 | TRẢI NGHIỆM · R3 (dính viền) | Cảnh 05, 16,03–19,03 (cả 3 s) | Chữ “Chatbot” x 778–982 trong thẻ x 777–985: lề ≤ 3 px mỗi bên, không có đệm. Ảnh: `assets/_scratch/qc-lan-1/f-18.0.png` | Lỗi dựng nhẹ (kèm sửa cùng QC-01) | Nới thẻ chatbot thêm ≥ 24 px mỗi bên hoặc thu cỡ chữ, giữ ≥ 56 px |
| QC-03 | TRẢI NGHIỆM · Y1/R3 | Cảnh 07, ≈ 27,4–27,6 s | Con trỏ và vòng nhấp phủ giữa chữ “Gỡ” (dấu ngã bị che). Thoáng qua ≈ 0,2–0,4 s, là động tác nhấp. Ảnh: `assets/_scratch/qc-lan-1/f-27.5.png` | Ghi nhận (không chặn) | Nếu dựng lại thì dời đầu con trỏ xuống mép nút |
| QC-04 | TRẢI NGHIỆM · R3 | Cảnh 05, ≈ 17,4 s | Thẻ bản sao đi ngang che đuôi chữ “Tiện ích” trong ≈ 0,25–0,5 s (ô 7 của `sheet-scene05.png`) | Ghi nhận | Dời quỹ đạo thẻ cách nhãn ≥ 16 px nếu dựng lại |
| QC-05 | TUÂN THỦ · Y1 (đối chiếu script) | Cảnh 03, 8,03–12,13 | Cột “Chữ trên màn hình” liệt kê “Trợ lý AI”, “Miễn phí”, “Featured”; 12 mẫu 3 Hz chỉ thấy “Trợ lý AI” và “Featured”. Không vi phạm (chữ trên hình ⊂ cột), nhưng mất lý do “miễn phí” của lời mời cài. `assets/_scratch/qc-lan-1/sheet-scene03.png` | Ghi nhận (không chặn) | Kịch bản/Đạo diễn hình ảnh quyết giữ hay bỏ “Miễn phí” khỏi cột |
| QC-06 | TRẢI NGHIỆM · Y7 | 27,978–28,531 (0,553 s, 07→08), 31,863–32,428 (0,565 s, 08→09), 35,05–35,66 (0,61 s, 09→10); ngoài ra 11,424–12,164 (0,739 s) và 23,749–24,526 (0,777 s) | Dải tham khảo cho chuyển nội dung là 0,8–1,5 s. Các nghỉ trên ngắn hơn 0,06–0,25 s. Tổng 41,9 s còn dư ≈ 3,1 s so với trần 45 s. Cả 5 cú cắt lớn trùng cuối khoảng nghỉ nên chuyển cảnh có nhịp. `assets/_scratch/qc-lan-1/report.md` (bảng khoảng lặng) | Ghi nhận; **CHƯA KIỂM — giám đốc nghe** | Giám đốc nghe nhịp rồi quyết định kéo thêm nghỉ nếu thấy gấp |
| QC-07 | TRẢI NGHIỆM · R4/Y7 | Cảnh 05, 18,265–19,063 (0,80 s) | Hình giữ nguyên sau khi bản sao vào khay (ô 9–12 của `sheet-scene05.png` giống nhau). < 1,5 s nên không chạm R4 | Ghi nhận | Không cần sửa |
| QC-08 | TRẢI NGHIỆM · R11 | Cảnh 02, 5,5–7,1 | “Hàng trăm nghìn người cài” chỉ có chồng thẻ xám trong khay, không có hình thể hiện quy mô. Là bối cảnh chứ không phải cơ chế kỹ thuật; nguồn xác nhận (≈ 900 nghìn); lời chỉ nói “hàng trăm nghìn” | Chấp nhận | Không cần sửa |
| QC-09 | TRẢI NGHIỆM · R11 | Cảnh 09, 32,4–35,6 | Script nói thẻ chạm mép ô chat rồi đổi hướng, có vạch đỏ gạch quỹ đạo. Khung 33,2 / 34,0 / 35,2 s cho thấy thẻ đi thẳng vào khay ngoài, không chạm mép chat, không thấy vạch đỏ. Kết quả vẫn thấy rõ (ba thẻ trong khay, chat trống). `f-33.2.png`, `frame-34.png`, `f-35.2.png` | Ghi nhận | Không cần sửa |
| QC-10 | TRẢI NGHIỆM · R3 | 3,5 s → 4,0 s (cue 2) | Phụ đề “Chat lọt ra bằng cách nào?” nhảy từ trên (y ≈ 330, cảnh có Cáo) xuống dưới (y ≈ 1420) giữa câu ở cú cắt 01→02. Phần còn lại hiện ≈ 0,7 s. `frame-3.5.png`, ô 1.3 của `board-01.png` | Ghi nhận | Không cần sửa |
| M-01 | R4 | 22,6–23,6 s | Đoạn tĩnh 1,0 s. Hai thẻ “Nội dung chat”/“Địa chỉ trang” được giữ để đọc (`frame-23.3.png`) | Thông tin, **loại trừ** | Có lý do, < 1,5 s |
| M-02 | Y7 | 4,699–5,516 s (0,817 s) | Ô nhắc lại bản gốc rút về, bản sao trượt vào khay (`frame-5.png`, `board-01.png`) | Thông tin, **loại trừ** | Có đổi hình |
| M-03 | Y7 | 7,06–8,045 s (0,985 s) | Môi khay trượt lên và cửa khay khép, rồi cắt sang cửa hàng ở 8,033 s (`board-01.png`) | Thông tin, **loại trừ** | Nghỉ đúng dải 0,8–1,5 s |
| M-04 | Y7 | 15,209–16,063 s (0,855 s) | Lớp quét vàng và nhãn quyền thu lại trước khi cắt sang sơ đồ 16,033 s (`board-02.png`) | Thông tin, **loại trừ** | Đúng dải |
| M-05 | R12 | Cảnh 08, 28,5–32,367 s | Khai push_in. Hiệu RGB 12,824/255. QC đo thân máy chủ trên `camera-08.png`: rộng ≈ 205 → 228 px, cao ≈ 248 → 278 px (≈ 1,11×, khớp 1,12× của Producer), kèm khay mở lộ bản cũ. Chuyển động có thật và phục vụ ý “bản cũ vẫn nằm trong khay”, vừa phải (≤ 1,3×) | Thông tin, **loại trừ** | Đạt |

### So với bản chuẩn T5 (`docs/baseline/T5-qc-auto.json`, cột Δ lấy từ `qc-lan-1/report.md`)

| Chỉ số | T8-E01 | T5 | Δ | Nhận xét |
| --- | --- | --- | --- | --- |
| Thời lượng (s) | 41,9 | 44,633 | −2,733 | còn dư 3,1 s so với trần |
| Số cảnh | 10 | 18 | −8 | đạt mục tiêu ≤ 12 |
| Trung bình cảnh (s) | 4,19 | 2,48 | +1,71 | đạt mục tiêu ≥ 3,5 |
| Cảnh dưới 2 s | 0 | 8 | −8 | cảnh ngắn nhất 3,0 s |
| Lần cắt / 10 s | 2,148 | 3,809 | −1,661 | |
| Tĩnh (%) | 22,727 | 30,787 | −8,059 | |
| Đoạn tĩnh dài nhất (s) | 1,0 | 1,2 | −0,2 | |
| Nhóm bố cục khác nhau | 10 | 11 | −1 | chuỗi cùng nhóm dài nhất 1 cảnh (T5: 3) |
| Chủ đề nền lớn nhất (%) | 32,22 (office) | 74,809 (database) | −42,59 | đạt ≤ 40% |
| Chuỗi cùng chủ đề (cảnh) | 2 (security 03–04) | 6 | −4 | đạt ≤ 4 |
| Cỡ cảnh khác nhau | 3 (toàn/trung/cận) | 4 | −1 | không 3 cảnh liền cùng cỡ |
| Cảnh khai camera ≠ static | 1 (08), dựng thật ≈ 1,11× | 8 (dựng 0) | −7 khai báo, +1 dựng thật | khai báo khớp bản dựng |
| Cảnh báo công cụ | 0 | 18 | −18 | |
| Âm lượng (LUFS) / đuôi im (s) | −14,4 / 0,536 | −14,85 / 0,691 | +0,45 / −0,155 | |
| Phụ đề | ASS 70 px, ≤ 24 ký tự/dòng, ≤ 2 dòng | 56 px, 6 cue > 24 ký tự | +14 px | đạt mức thử ≥ 64 |
| Lỗi chữ tràn/dính viền | 2 (QC-01, QC-02) | — | | **phần còn phải sửa** |

### Bảng Y1–Y8

| Nhóm | Kết quả | Mốc và bằng chứng |
| --- | --- | --- |
| Y1 · Chữ trên hình | **Đạt** (kèm QC-01/02/03/05 ở trên) | Xem khung ở 0,0 / 0,5 / 1,8 / 3,5 / 5 / 9,5 / 13 / 14,3 / 18 / 20,5 / 21,8 / 23,3 / 26,5 / 27,5 / 30 / 33,2 / 34 / 35,2 / 36,5 / 38,5 / 41,5 s cùng `board-01..03`: không có nhãn «AI tạo»/«Ví dụ dựng», không logo/watermark, không chữ thừa. Chữ vẽ trên hình đều thuộc cột script: “Trợ lý AI”, “Featured” (cảnh 03), “Đọc và thay đổi dữ liệu trên mọi trang” (04), “Chatbot”, “Tiện ích” (05), “≈ 30 phút”, “Nội dung chat”, “Địa chỉ trang” (06), “Nhà phát hành”, “Quyền”, “Gỡ” (07). Cảnh 01, 02, 08, 09, 10 không chữ ngoài phụ đề. Dòng quyền ở cảnh 04 là giao diện minh hoạ, diễn đạt lại, không phải nguyên văn Chrome. Khai báo AI ở `publish.json`. |
| Y2 · Bản đồ Cáo | **Đạt** | Cáo ở mở (01, 0–4 s `surprised`), giữa (04, 12,133–16,033 s `point_right`, chỉ vào dòng quyền), kết (10, 35,633–41,9 s `thumbs_up`). Tổng 14,17 s ≈ 33,8% (ngưỡng thử ≤ 40%). Cảnh 02, 03, 05–09 không Cáo (xem khung). |
| Y3 · Cỡ Cáo | **Đạt** | Đo trên khung 1080 px: cảnh 01 x ≈ 105–322 (≈ 217 px, 20%); cảnh 04 x ≈ 100–318 (≈ 218 px, 20%), đứng cạnh minh hoạ, chừa trọn khung; cảnh 10 x ≈ 100–400 (≈ 300 px, 28%, ≈ 1,45× nguồn 209 px), là nhân vật chính ở kết. `frame-0.5.png`, `frame-13.png`, `frame-36.5.png` |
| Y4 · Nền theo ngữ cảnh | **Đạt** | 4 chủ đề: office 13,5 s (32,22%; 01, 09, 10), security 12 s (28,64%; 03, 04, 07), code 8,467 s (20,21%; 05, 06), incident 7,933 s (18,93%; 02, 08). Đổi thật theo nội dung: bàn làm việc ba góc (ngang, từ trên nghiêng, trung kèm Cáo), máy chủ cận, cửa hàng tiện ích, hộp quyền, sơ đồ, đồng hồ + khay, màn hình quản lý. Bảng màu nhất quán (cam = bản sao, đỏ = đường rò, xanh = bình thường, vàng = nhấn). |
| Y5 · Kể chuyện | **Đạt** | 0,0 s: “Hồ sơ khách vừa dán, bản sao đã ra ngoài.” kèm hình hồ sơ trong chat; 1,15–1,8 s bản sao tách (`frame-1.8.png`). 4,0–5,5 s máy chủ nhận bản sao. 12,1–14,3 s cơ chế: quyền quét tab chat, bản sao sinh ở biểu tượng tiện ích (trả câu hỏi ở 13,0 s). 24,5–28,5 s cách xử lý. 32,4–41,9 s quay lại đúng bàn và ô chat của mở. |
| Y6 · Tốc độ | Nhãn **đạt**, nghe **CHƯA KIỂM — giám đốc nghe** | Nhãn tempo ở `assets/voice/measurements.json` khớp script: 11 câu [dẫn] 1,03, 6 câu [kỹ thuật] 0,97. QC đo tốc độ âm tiết từ khoảng lặng: [dẫn] ≈ 3,8–4,3, [kỹ thuật] ≈ 3,9–4,0 âm tiết/s, chênh nhỏ vì nội dung câu khác nhau. Không suy thành “đoạn kỹ thuật nghe chậm hơn”. Hình giữ ≥ 3,0 s mỗi cảnh. |
| Y7 · Khoảng nghỉ | Số đo **đạt**, nghe **CHƯA KIỂM — giám đốc nghe** | Câu hỏi cuối nghỉ 0,748 s (39,498–40,246) với hai thẻ đang mở; nghỉ chuyển cảnh 0,74–0,99 s ở 7,06–8,045, 11,424–12,164, 15,209–16,063, 18,265–19,063, 23,749–24,526 trùng cú cắt hoặc chuyển động; ba chỗ chuyển ngắn 0,55–0,61 s (QC-06). Đuôi im 0,536 s. |
| Y8 · Phát âm | Văn bản **đạt**, nghe **CHƯA KIỂM — giám đốc nghe** | `python tools/voice/phonemes.py --lines assets/voice/apply.json --extra assets/voice/pronunciation.local.json` do QC chạy lại: mã 0, 17 dòng, “chat” → `tʃˈæt` ở lời 02 và lời 06 (không âm Việt, không đổi theo ngữ cảnh), dòng cuối “ĐẠT”. Clip `assets/voice/term-check/` có đủ `chat.wav`, `chat-loi-02.wav`, `chat-loi-06.wav`, `chat_raw.wav`. Phát âm thật chờ giám đốc nghe. |

### 5 câu hỏi người xem lạ

| # | Kết quả | Mốc và bằng chứng |
| --- | --- | --- |
| 1 | **Đạt** | Khung đầu 0,0 s đã có hồ sơ trong ô chat, Cáo hoảng, phụ đề “Hồ sơ khách vừa dán, bản sao đã ra ngoài.” Bản sao tách khỏi chat từ ≈ 1,15 s (`f-0.0.png`, `frame-1.8.png`). |
| 2 | **Đạt** | 3,08–4,7 s câu hỏi “Chat lọt ra bằng cách nào?”; 4,0–5,5 s máy chủ lạ nhận và giữ bản sao (`frame-5.png`). Hệ quả thấy ở hồ sơ khách (nạn nhân là dữ liệu khách hàng), trước giây 5. |
| 3 | **Đạt** (kèm QC-08) | Mỗi cảnh một ý (10 cảnh). Tắt tiếng vẫn theo được đường đi của bản sao: chat → máy chủ (01–02), quyền → bản sao (04), hai tuyến (05), đồng hồ + đợt gửi (06), gỡ (07), bản cũ còn (08). Từng khẳng định chính có sự kiện hình, xem bảng R11 của Producer trên đây, QC đối chiếu từng mốc trên khung. |
| 4 | **Đạt** (kèm QC-01/02) | Hình đổi nhìn ra ở 360×640 (board-01..03); tool đo 10 nhóm bố cục khác nhau, chuỗi cùng nhóm dài nhất 1 cảnh, không cảnh dưới 3,0 s, đoạn tĩnh dài nhất 1,0 s. Chữ trên hình là nhãn UI, không chép lời đọc (trừ dòng quyền ở cảnh 04 vốn là nội dung giao diện). Hai nhãn bị tràn/dính viền xem QC-01/02. |
| 5 | **Đạt** | Kết quay lại đúng bàn và ô chat: ba thẻ nằm trong khay ngoài, chat trống (32,4–35,6 s); hai mục kiểm mở trước nút cài (38,5 s). Câu hỏi “Bạn xem quyền hay nhà phát hành trước?” rồi “Bình luận cho Cáo nhé.” (kêu gọi tự nhiên). Đuôi im 0,536 s ≤ 0,7. Bìa lấy khung hook ≈ 1,8 s, không chữ; ở 180×320 vẫn nhận ra Cáo và hai thẻ cùng góc cam, một thẻ đã tách lên trên (`thumb-180x320.png`). |

### R11 · R12 (QC đối chiếu)

- **R11:** QC xem từng mốc của bảng R11 Producer trên khung: copy rời chat (1,15–1,8 s) và máy chủ nhận (4,0–5,5 s); hai thẻ cửa hàng, huy hiệu duy nhất, con trỏ chọn đúng thẻ (8,03–11,7 s); quyền quét tab chat rồi bản sao sinh ở biểu tượng (13,0–14,3 s); hai tuyến xanh/đỏ có đích riêng (16,03–18,3 s); đồng hồ giảm rồi đợt gửi có nội dung chat + địa chỉ trang (19,03–24,5 s); hàng gỡ biến mất, hàng dưới trượt lên (27–28 s); đường đỏ xám đi, khay mở lộ bản cũ (28,5–32,4 s); ba thẻ vào khay xanh (32,4–35,6 s). Đều có sự kiện hình. Chỗ yếu: QC-08 (quy mô) và QC-09 (không thấy thẻ bị chặn tại mép chat). Trạng thái sự cố đổi ≥ 3 lần: bản sao trong chat → rời chat → trong máy chủ → đợt gửi lặp → đầu gãy/bản cũ còn.
- **R12:** 5 bối cảnh/khung bố cục, 4 chủ đề nền, chuỗi cùng chủ đề dài nhất 2 cảnh, không 3 cảnh liền cùng cỡ cảnh. Camera: chỉ cảnh 08 khai push_in và đã dựng thật (≈ 1,11× trong 30,77–31,97 s, mượt, hướng vào khay có bản cũ). Chín cảnh còn lại camera tĩnh, chuyển động nằm ở đạo cụ, nhất quán với khai báo; không có cú cắt thừa để qua chỉ số. Vật chính cao 675–845 px trong y ≈ 450–1330 (đạt R5 ≥ 560 px).

### Phần công cụ không đo được

- **Nghe giọng, tốc độ cảm nhận, nhịp nghỉ, phát âm “chat” (Y6–Y8): CHƯA KIỂM — giám đốc nghe.** QC không đưa âm thanh vào mô hình. Chỉ có số đo và văn bản.
- Độ dễ đọc trên điện thoại thật: QC xem ở 360×640 và 180×320; giám đốc nghiệm thu trên điện thoại (phụ đề 70 px, nhãn 56 px).
- Chuyển động có phục vụ nội dung: QC kết luận bằng mắt cho cảnh 08 (có) và các đạo cụ ở cảnh 01, 02, 04, 05, 06, 07 (có).
- Đúng nội dung: đã đối chiếu OX Security (xem trục TUÂN THỦ); QC không mở lại các bản tin thứ cấp và trang trợ giúp Chrome ở lượt này.

### QC — cần sửa (lượt 1)

Chỉ sửa **cục bộ** phần hình, giữ nguyên giọng, mốc cảnh và `final/captions.srt`, ghép lại bằng luồng AAC hiện có như lần dựng lại cảnh 04 (SHA-256 luồng AAC phải khớp bản trước), rồi chạy lại `qc-measure` và xem lại khung.

1. **QC-01, cảnh 06, 19,03–~21,3 s:** chữ “≈ 30 phút” phải nằm trọn trong vòng đồng hồ, không đè cung vàng/viền ngoài (lề ≥ 16 px; chữ khoá ≥ 72 px cho “30”, “phút” ≥ 56 px nếu tách dòng).
2. **QC-02, cảnh 05, 16,03–19,03 s:** nới thẻ “Chatbot” để chữ có lề ≥ 24 px mỗi bên (chữ ≥ 56 px).
3. Tuỳ chọn khi đã dựng lại: QC-03 (dời đầu con trỏ khỏi chữ “Gỡ” ở ≈ 27,5 s) và QC-04 (thẻ bản sao không che chữ “Tiện ích” ở ≈ 17,4 s). Không chặn.

Không sửa: hook, kịch bản, storyboard, nền, giọng. Các mục QC-05…QC-10 chỉ ghi nhận.

### Bài học cho luật

- Công cụ `qc-measure` đo chuyển động/bố cục nhưng không đo hộp bao chữ so với vật chứa, nên chữ tràn vòng và nhãn dính viền (QC-01, QC-02) chỉ lộ khi xem khung full-res. Đề nghị Producer tự kiểm lề chữ trong mọi vật chứa (≥ 16 px) trước khi xuất và QC luôn xem khung full-res ở các cảnh có số/nhãn trong vòng tròn hoặc thẻ.

## Producer · Sửa sau QC lượt 1 (19/11/2026)

Dựng lại ba cảnh 05–07 bằng Pillow và FFmpeg từ storyboard đã duyệt. Ghép phụ đề cứng từ ASS hiện có và sao chép trực tiếp luồng AAC. Đối chiếu SHA-256 cho thấy AAC khớp bản trước (`adb80762e49f3f5ac7560022a54404d04eea559973e75d5b8cd6c394e3119997`). Hash của `captions.srt`, ASS, timeline cảnh, storyboard, bìa và `publish.json` đều khớp bản trước.

| Mục QC | Sửa và kiểm trên thành phẩm | Bằng chứng |
| --- | --- | --- |
| QC-01 · cảnh 06 | Tách “≈ 30 phút” thành hai dòng cùng cụm. “≈ 30” dùng Segoe UI Bold 72 px, “phút” 56 px. Đo trên khung 20,50 s được khoảng hở theo bán kính ít nhất 36 px đến vạch chia và 42 px đến mép trong cung. | [20,50 s](assets/_scratch/producer-qc-lan-2/final-clock.png) · [21,30 s](assets/_scratch/producer-qc-lan-2/final-clock-end.png) |
| QC-02 · cảnh 05 | Mở rộng thẻ “Chatbot” từ 208 lên 260 px, canh giữa nhãn 56 px. Đo trên khung 16,60 s được 28 px bên trái và 27 px bên phải tính đến mép trong viền. | [16,60 s](assets/_scratch/producer-qc-lan-2/final-chatbot.png) · [số đo](assets/_scratch/producer-qc-lan-2/glyph-measurements.json) |
| QC-03 · cảnh 07 | Đưa đầu con trỏ và vòng nhấp xuống góc phải dưới nút. Chữ “Gỡ” và dấu ngã đọc rõ khi nhấp. | [27,47 s](assets/_scratch/producer-qc-lan-2/final-remove.png) |
| QC-04 · cảnh 05 | Cho thẻ đi ngang qua phía trên nhãn “Tiện ích”, sau đó rẽ xuống khay. Thẻ góc cam vẫn đi đúng nhánh đỏ, xung xanh đi riêng tới Chatbot. | [17,43 s](assets/_scratch/producer-qc-lan-2/final-copy.png) · [18,30 s](assets/_scratch/producer-qc-lan-2/final-tray.png) |

### Kết quả kiểm bản sửa

- `qc-video` **pass**, `fails: []`, `warns: []`. FFprobe ghi 41,900 s, 1.257 khung, 1080×1920, 30 fps, H.264/yuv420p, AAC mono 48 kHz, 4.209.776 byte. Hộp MP4 `moov` đứng trước `mdat`. Âm lượng −14,4 LUFS, đỉnh −1,74 dBTP, đuôi im 0,536 s. [JSON](assets/_scratch/producer-qc-lan-2/qc-video-final.json)
- `qc-measure` ghi 5 phát hiện thông tin, 0 cảnh báo, 0 lỗi. 10 cảnh, trung bình 4,19 s, cảnh ngắn nhất 3 s, đoạn tĩnh dài nhất 1,0 s ở 22,6–23,6 s để đọc hai nhãn. Ba khoảng nghỉ từ 0,817 đến 0,985 s đi với thẻ vào khay, khay khép hoặc lớp quét rút trước cảnh kế. Cảnh 08 vẫn có cú tiến máy vào khay đang mở (hiệu RGB 12,824/255 giữa hai khung đo). So với T5, tỷ lệ tĩnh giảm từ 30,787% xuống 22,727% và số cảnh dưới 2 s giảm từ 8 xuống 0. [Báo cáo và đối chiếu T5](assets/_scratch/producer-qc-lan-2/qc-measure/report.md)
- `qc-publish` **pass**, không có lỗi hay cảnh báo. Thư mục `final/` có đúng [video](final/IT-T8-E01_9x16.mp4), [bìa](final/thumbnail.jpg), [phụ đề](final/captions.srt) và [nội dung đăng](final/publish.json).

### Rà Y1–Y8 trên bản sửa

| Nhóm | Kết quả |
| --- | --- |
| Y1 · Chữ | Đã mở khung 360×640 ở đầu, giữa, gần cuối và khung gốc ở các mốc sửa. Các nhãn điều chỉnh lấy nguyên văn từ kịch bản, phụ đề đủ dấu, 20 cue, tối đa 2 dòng và 24 ký tự/dòng, ASS 70 px. [Khung 360×640](assets/_scratch/producer-qc-lan-2/final-360.jpg) |
| Y2 · Bản đồ Cáo | Cáo ở cảnh 01, 04, 10, tổng khoảng 14,17 s (33,8%). |
| Y3 · Cỡ Cáo | Mở và giữa rộng khoảng 20% khung. Cảnh kết Cáo làm chính, rộng khoảng 300 px (1,45× nguồn). |
| Y4 · Nền | Bốn chủ đề nền qua năm bối cảnh. Chủ đề lớn nhất 32,22% và chuỗi cùng chủ đề dài nhất 2 cảnh. |
| Y5 · Kể chuyện | Khung 0,50 s cho thấy hồ sơ trong chat, đến 1,80 s bản sao đã tách. Kết trở lại bàn cũ với dữ liệu trong khay ngoài chat. Đã mở [bìa 180×320](assets/_scratch/producer-qc-lan-2/thumb-180x320.png), thấy hai thẻ cùng góc cam và Cáo. |
| Y6 · Tốc độ | `atempo` 1,03 cho [dẫn] và 0,97 cho [kỹ thuật] theo bản giọng đã đo. Tốc độ cảm nhận **CHƯA KIỂM — chờ giám đốc nghe**. |
| Y7 · Nhịp | Số đo khoảng lặng và từng mốc chuyển có trong báo cáo. Đuôi im 0,536 s. Nhịp cảm nhận **CHƯA KIỂM — chờ giám đốc nghe**. |
| Y8 · Phát âm | `pronounce check` mã 0, không có thuật ngữ lạ. `phonemes.py` mã 0, “chat” đọc `tʃˈæt` ở cả hai ngữ cảnh theo kiểm tra văn bản. Giọng và phát âm thật **CHƯA KIỂM — chờ giám đốc nghe**. [Clip nghe kiểm](assets/voice/term-check/chat.wav) |

## QC — lượt 2 (Claude, 19/11/2026): CHƯA CHẠY ĐƯỢC

Phiên QC nền bị từ chối quyền chạy lệnh (`node tools/qc-measure.mjs …`, `ffmpeg`), cả ở subagent `support` lẫn phiên chính, vì không có ai duyệt quyền. QC chưa đo, chưa xem khung bản dựng 11:52, chưa xác nhận QC-01…QC-04. Chưa có phán quyết, video giữ `review`. Lần chạy sau: bắt đầu từ bước đo độc lập vào `assets/_scratch/qc-lan-2/`.

## QC — lượt 2 (Claude, 19/11/2026)

Mục này thay thế mục “CHƯA CHẠY ĐƯỢC” ngay trên (giữ nguyên làm lịch sử). QC đo độc lập bằng một lệnh đơn `node tools/qc-measure.mjs … --min 15 --max 45 --baseline docs/baseline/T5-qc-auto.json --out assets/_scratch/qc-lan-2 --frames "0.5,1.8,3.5,5.0,9.5,13.0,14.3,16.6,17.4,18.0,20.5,21.8,23.3,26.5,27.5,30.0,34.0,36.5,38.5,41.5"` trên bản `final/IT-T8-E01_9x16.mp4` sau “Sửa sau QC lượt 1” (4.209.776 byte, 1.257 khung). Số đo dưới đây là của QC; ngoài công cụ QC còn tự đo lề chữ bằng pixel (PIL, lọc ngưỡng sáng) trên khung full-res và chiết thêm bảng khung bằng `ffmpeg`. Toàn bộ ảnh/log ở `assets/_scratch/qc-lan-2/`: [report.md](assets/_scratch/qc-lan-2/report.md) · [board-01](assets/_scratch/qc-lan-2/board-01.png) · [board-02](assets/_scratch/qc-lan-2/board-02.png) · [board-03](assets/_scratch/qc-lan-2/board-03.png) · [camera-08](assets/_scratch/qc-lan-2/camera-08.png) · [thumb-180x320](assets/_scratch/qc-lan-2/thumb-180x320.png) · [sheet-scene05](assets/_scratch/qc-lan-2/sheet-scene05.png) · [sheet-scene06](assets/_scratch/qc-lan-2/sheet-scene06.png) · [sheet-remove-click](assets/_scratch/qc-lan-2/sheet-remove-click.png) · [seams-04-08](assets/_scratch/qc-lan-2/seams-04-08.png).

### Ba kết luận

| Trục | Kết luận | Bằng chứng chính |
| --- | --- | --- |
| KỸ THUẬT | **ĐẠT** | ffprobe 1080×1920, 30 fps, H.264, video 41,900 s/1.257 khung, AAC 41,900 s, 4.209.776 byte. `qc-video` `pass:true`, `fails:[]`, `warns:[]`; `qc-publish` `pass:true`. −14,4 LUFS. Đuôi im 0,536 s (≤ 0,7). Đoạn tĩnh dài nhất 1,0 s (22,6–23,6 s). `qc-measure` 5 phát hiện thông tin, 0 cảnh báo, 0 lỗi. Phụ đề 20 cue, ≤ 2 dòng, ≤ 24 ký tự/dòng, ASS cỡ 70, lệch cue–tiếng −0,012…−0,149 s. Bốn mối cắt 04→05, 05→06, 06→07, 07→08 sạch, không nháy/trùng khung (`seams-04-08.png`). `final/` đúng 4 tệp (không phải dọn). |
| TUÂN THỦ | **ĐẠT** | Không đổi so với lượt 1: nguồn hình/tiếng tự tạo hoặc kho xưởng (không cần dòng ở `library/LICENSES.md`); `publish.json` đủ 3 nền tảng (tiêu đề, mô tả, 3 hashtag), `ai_generated_content:true`, `ai_disclosure` cuối mô tả, “(ví dụ dựng)” ở mô tả; không nhãn trên hình; `thumbnail.jpg` và `captions.srt` có mặt. Không nêu tên hãng, không số liệu vượt nguồn (“hàng trăm nghìn”). |
| TRẢI NGHIỆM | **ĐẠT phần đã kiểm**; nghe giọng/tốc độ/nhịp/phát âm **CHƯA KIỂM — giám đốc nghe** | QC-01, QC-02 (lỗi chặn của lượt 1) đã hết, đo bằng pixel; QC-03, QC-04 cũng hết. Không phát hiện lỗi mới. Hook, bản đồ Cáo, nền theo ngữ cảnh, R11, R12 đạt như lượt 1. |

**Phán quyết: PASS.** Hết lỗi chặn; phần CHƯA KIỂM (nghe) chờ giám đốc, không chặn `ready` vì là phần QC không đo/nghe được.

### Kiểm lỗi lượt 1 đã sửa (đo bằng pixel trên khung full-res 1080×1920)

| Mã | Mốc | Lượt 1 | Lượt 2 (QC đo) | Kết luận |
| --- | --- | --- | --- | --- |
| QC-01 · R3, chữ tràn vòng | Cảnh 06, 19,03–~21,4 s | “≈ 30 phút” một dòng rộng ≈ 330 px trong vòng Ø ≈ 336 px, chạm viền | Hai dòng “≈ 30” (cỡ 72) và “phút” (cỡ 56). Hộp bao chữ trắng trên khung 20,5 s: x 470–613, y 584–699 (rộng 143 px, cao 115 px), bán kính xa nhất từ tâm (540, 640) = 84,8 px. Mép trong vòng ở bên trái x = 420, bán kính 120 px, nên lề ≈ 35 px; vòng ngoài x 371–709. 7 khung 3 Hz của `sheet-scene06.png` (19,03–21,4 s): chữ nằm trọn trong vòng ở cả 7. [frame-20.5](assets/_scratch/qc-lan-2/frame-20.5.png) · [sheet-scene06](assets/_scratch/qc-lan-2/sheet-scene06.png) | **ĐÃ SỬA** (lề ≥ 16 px) |
| QC-02 · R3, dính viền | Cảnh 05, 16,03–19,03 s | Chữ “Chatbot” x 778–982 trong thẻ 777–985, lề ≤ 3 px | Chữ x 759–958, mép trong thẻ x 731–985, nên lề 28 px trái, 27 px phải (cần ≥ 24); số đo giống nhau ở 16,6 s và 18,0 s. [frame-16.6](assets/_scratch/qc-lan-2/frame-16.6.png) · [frame-18](assets/_scratch/qc-lan-2/frame-18.png) | **ĐÃ SỬA** |
| QC-03 · Y1/R3, con trỏ che “Gỡ” | Cảnh 07, ≈ 27,4–27,6 s | Vòng nhấp phủ giữa chữ “Gỡ” | Đầu con trỏ và vòng nhấp ở góc phải dưới nút; 6 khung 8 Hz (27,2–27,95 s) cho thấy chữ “Gỡ” và dấu ngã không bị che ở mọi khung. [sheet-remove-click](assets/_scratch/qc-lan-2/sheet-remove-click.png) · [frame-27.5](assets/_scratch/qc-lan-2/frame-27.5.png) | **ĐÃ SỬA** |
| QC-04 · R3, thẻ che nhãn | Cảnh 05, ≈ 17,4 s | Thẻ bản sao che đuôi chữ “Tiện ích” 0,25–0,5 s | Thẻ đi trên nhãn: đáy thẻ y ≈ 958, nhãn y ≈ 1015–1068 (ước tính từ ảnh, cách ≈ 55 px); 12 khung 4 Hz (16,03–19,03 s) không khung nào thẻ chạm chữ. [frame-17.4](assets/_scratch/qc-lan-2/frame-17.4.png) · [sheet-scene05](assets/_scratch/qc-lan-2/sheet-scene05.png) | **ĐÃ SỬA** |

Kiểm thêm lề chữ ở cảnh 06 sau khi dựng lại (ước tính từ khung 23,3 s): “Nội dung chat” x ≈ 152–513 trong thẻ x ≈ 130–533 (lề ≈ 20–22 px), “Địa chỉ trang” x ≈ 587–910 trong thẻ x ≈ 550–948 (lề ≥ 37 px), đều ≥ 16 px nên đạt.

### Kiểm hồi quy (có lỗi mới không?)

- 12 khung của lượt 1 và lượt 2 ở cùng mốc 0,5 / 1,8 / 3,5 / 5,0 / 9,5 / 13,0 / 14,3 / 30,0 / 34,0 / 36,5 / 38,5 / 41,5 s **giống hệt từng điểm ảnh** (hiệu 0/255). Cảnh 01–04 và 08–10 không đổi, đúng ghi chép “chỉ dựng lại 05–07”. Khung 20,5 s đổi (nhãn mới); 23,3 s hiệu trung bình 0,123/255 (tối đa 56) và 26,5 s hiệu 0,007/255 do dựng lại cảnh 06–07; mắt xem cả hai khung không thấy khác ngoài đúng chỗ sửa.
- Bảng khoảng lặng và độ lệch cue–tiếng của lượt 2 trùng từng mốc với lượt 1 (kể cả 4,699–5,516 s, 7,06–8,045 s, 15,209–16,063 s, đuôi im 41,364–41,9 s), −14,4 LUFS không đổi: âm thanh không bị động tới.
- Xem 20 khung full-res + 3 bảng khung 360×640 + 2 bảng khung 3–4 Hz: không nhãn «AI tạo»/«Ví dụ dựng», không logo/watermark, không chữ ngoài cột “Chữ trên màn hình”, hook trong 2 s đầu (0,0 s đã có hồ sơ trong chat và phụ đề, bản sao tách từ ≈ 1,15 s). Phụ đề không bị chữ UI chồng. Bìa 180×320 vẫn nhận ra Cáo và hai thẻ cùng góc cam, một thẻ đã tách lên trên.

### Bảng phát hiện (mọi lỗi, cảnh báo, phát hiện bằng mắt)

| Mã | Nhóm | Mốc | Bằng chứng (số đo + ảnh/log) | Mức | Đề nghị |
| --- | --- | --- | --- | --- | --- |
| QC-01 | TRẢI NGHIỆM · R3 | Cảnh 06, 19,03–~21,4 s | Lề chữ ≈ 35 px trong vòng (bảng trên) | **Đã sửa** | Không |
| QC-02 | TRẢI NGHIỆM · R3 | Cảnh 05, 16,03–19,03 s | Lề 28/27 px trong thẻ | **Đã sửa** | Không |
| QC-03 | TRẢI NGHIỆM · Y1/R3 | Cảnh 07, ≈ 27,4–27,6 s | 6 khung 8 Hz, “Gỡ” không bị che | **Đã sửa** | Không |
| QC-04 | TRẢI NGHIỆM · R3 | Cảnh 05, ≈ 17,4 s | Thẻ cách nhãn ≈ 55 px | **Đã sửa** | Không |
| QC-05 | TUÂN THỦ · Y1 (đối chiếu script) | Cảnh 03, 8,03–12,13 s | Không đổi: cột script có “Trợ lý AI”, “Miễn phí”, “Featured”; khung 9,5 s chỉ có “Trợ lý AI” và “Featured”. Chữ trên hình ⊂ cột nên không vi phạm. [frame-9.5](assets/_scratch/qc-lan-2/frame-9.5.png) | Ghi nhận, không chặn | Kịch bản/Đạo diễn hình ảnh quyết giữ hay bỏ “Miễn phí” khỏi cột |
| QC-06 | TRẢI NGHIỆM · Y7 | 27,978–28,531 s (0,553), 31,863–32,428 s (0,565), 35,05–35,66 s (0,61) | Ba nghỉ chuyển cảnh ngắn hơn dải tham khảo 0,8–1,5 s khoảng 0,19–0,25 s; còn dư ≈ 3,1 s so với trần 45 s. Cả ba trùng cú cắt. `report.md` bảng khoảng lặng | Ghi nhận; **CHƯA KIỂM — giám đốc nghe** | Giám đốc nghe, quyết kéo thêm nghỉ nếu thấy gấp |
| QC-07 | TRẢI NGHIỆM · R4/Y7 | Cảnh 05, 18,265–19,063 s | Hình giữ nguyên 0,80 s sau khi bản sao vào khay (ô 9–12 của `sheet-scene05.png` giống nhau), < 1,5 s | Ghi nhận | Không |
| QC-08 | TRẢI NGHIỆM · R11 | Cảnh 02, 5,5–7,1 s | “Hàng trăm nghìn người cài” chỉ là chồng thẻ xám, không hình quy mô; là bối cảnh, nguồn ≈ 900 nghìn | Chấp nhận | Không |
| QC-09 | TRẢI NGHIỆM · R11 | Cảnh 09, 32,4–35,6 s | Script nói thẻ chạm mép chat rồi đổi hướng; khung 34 s cho thấy thẻ vào thẳng khay, kết quả (chat trống, ba thẻ trong khay) vẫn rõ. Không đổi so với lượt 1 | Ghi nhận | Không |
| QC-10 | TRẢI NGHIỆM · R3 | 3,5 → 4,0 s (cue 2) | Phụ đề đổi từ trên (y ≈ 330, cảnh có Cáo) xuống dưới ở cú cắt 01→02, khung 3,5 s. Không đổi | Ghi nhận | Không |
| QC-11 (mới, bằng mắt) | TRẢI NGHIỆM · R3 | Cảnh 04, 13,0–14,3 s | Hộp quyền “Đọc và thay đổi dữ liệu trên mọi trang” x 342–980, rộng hơn khung trình duyệt phía sau (x 346–980) 4 px bên trái. Chữ trong hộp lề ≈ 26 px trái, ≈ 30 px phải. Là hộp phủ có chủ ý, đọc rõ. Cảnh 04 không đổi so với lượt 1. [frame-13](assets/_scratch/qc-lan-2/frame-13.png) | Ghi nhận, không chặn | Không cần sửa |
| M-01 | R4 | 22,6–23,6 s | Đoạn tĩnh 1,0 s: hai thẻ “Nội dung chat”/“Địa chỉ trang” giữ để đọc (`frame-23.3.png`) | Thông tin, **loại trừ** | Có lý do, < 1,5 s |
| M-02 | Y7 | 4,699–5,516 s (0,817) | Ô nhắc lại bản gốc rút về, bản sao trượt vào khay (`frame-5.png`, `board-01.png`) | Thông tin, **loại trừ** | Có đổi hình |
| M-03 | Y7 | 7,06–8,045 s (0,985) | Môi khay trượt lên rồi cắt sang cửa hàng ở 8,033 s (`board-01.png`) | Thông tin, **loại trừ** | Đúng dải 0,8–1,5 s |
| M-04 | Y7 | 15,209–16,063 s (0,855) | Lớp quét vàng và nhãn quyền thu lại trước khi cắt sang sơ đồ ở 16,033 s (`board-02.png`, `seams-04-08.png`) | Thông tin, **loại trừ** | Đúng dải |
| M-05 | R12 | Cảnh 08, 28,5–32,367 s | Khai push_in; hiệu RGB 12,824/255 giữa hai khung (giống lượt 1); khung 30,0 s giống hệt lượt 1 nên cảnh 08 không đổi. Thân máy chủ lớn ≈ 1,11× (205→228 px rộng, đo lượt 1 trên `camera-08.png`), mượt, phục vụ ý “bản cũ còn trong khay” | Thông tin, **loại trừ** | Đạt |

### So với T5 và so với lượt 1 (Δ lấy từ `qc-lan-2/report.md`)

| Chỉ số | Lượt 2 | Lượt 1 | Δ lượt 2−1 | T5 | Δ so với T5 |
| --- | --- | --- | --- | --- | --- |
| Thời lượng (s) | 41,9 | 41,9 | 0 | 44,633 | −2,733 |
| Số cảnh | 10 | 10 | 0 | 18 | −8 |
| Trung bình cảnh (s) | 4,19 | 4,19 | 0 | 2,48 | +1,71 |
| Cảnh dưới 2 s | 0 | 0 | 0 | 8 | −8 |
| Lần cắt / 10 s | 2,148 | 2,148 | 0 | 3,809 | −1,661 |
| Tĩnh (%) | 22,727 | 22,727 | 0 | 30,787 | −8,059 |
| Đoạn tĩnh dài nhất (s) | 1,0 | 1,0 | 0 | 1,2 | −0,2 |
| Nhóm bố cục khác nhau | 10 | 10 | 0 | 11 | −1 |
| Chủ đề nền lớn nhất (%) | 32,22 (office) | 32,22 | 0 | 74,809 | −42,59 |
| Chuỗi cùng chủ đề (cảnh) | 2 | 2 | 0 | 6 | −4 |
| Cảnh báo công cụ | 0 | 0 | 0 | 18 | −18 |
| Âm lượng (LUFS) | −14,4 | −14,4 | 0 | −14,85 | +0,45 |
| Đuôi im (s) | 0,536 | 0,536 | 0 | 0,691 | −0,155 |
| Cỡ phụ đề ASS (px) | 70 | 70 | 0 | 56 | +14 |
| Kích thước tệp (byte) | 4.209.776 | 4.227.216 | −17.440 | — | — |
| Lỗi chữ tràn/dính viền | 0 | 2 (QC-01, QC-02) | −2 | — | — |

### Bảng Y1–Y8

| Nhóm | Kết quả | Mốc và bằng chứng |
| --- | --- | --- |
| Y1 · Chữ trên hình | **Đạt** | 20 khung full-res + board 01–03 + sheet 05/06/07. Không «AI tạo»/«Ví dụ dựng», không logo/watermark, không chữ thừa. Chữ vẽ thuộc cột script: “Trợ lý AI”, “Featured” (03), “Đọc và thay đổi dữ liệu trên mọi trang” (04), “Chatbot”, “Tiện ích” (05), “≈ 30 phút”, “Nội dung chat”, “Địa chỉ trang” (06), “Nhà phát hành”, “Quyền”, “Gỡ” (07). Cảnh 01, 02, 08, 09, 10 không chữ ngoài phụ đề. Phụ đề cỡ 70, ≤ 2 dòng. Hết tràn/dính viền (QC-01/02) và hết che chữ (QC-03/04). |
| Y2 · Bản đồ Cáo | **Đạt** | Không đổi: Cáo ở 01 (0–4 s), 04 (12,133–16,033 s), 10 (35,633–41,9 s). Tổng 14,17 s ≈ 33,8% (ngưỡng thử ≤ 40%). Khung 0,5 / 13,0 / 36,5 s giống hệt lượt 1. |
| Y3 · Cỡ Cáo | **Đạt** | Số đo lượt 1 giữ nguyên vì khung 0,5 / 13,0 / 36,5 s giống hệt: 01 ≈ 217 px (20%), 04 ≈ 218 px (20%), 10 ≈ 300 px (28%, ≈ 1,45× nguồn 209 px). |
| Y4 · Nền theo ngữ cảnh | **Đạt** | 4 chủ đề: office 13,5 s (32,22%; 01, 09, 10), security 12 s (28,64%; 03, 04, 07), code 8,467 s (20,21%; 05, 06), incident 7,933 s (18,93%; 02, 08). Chuỗi cùng chủ đề dài nhất 2 cảnh (03–04). Một nền ≤ 40%, ≤ 4 cảnh liền. |
| Y5 · Kể chuyện | **Đạt** | 0,0 s hồ sơ trong chat + phụ đề; 1,15–1,8 s bản sao tách; 4,0–5,5 s máy chủ nhận; 12,1–14,3 s cơ chế quyền; 16,03–19,03 s hai tuyến; 19,03–24,5 s đợt gửi 30 phút; 24,5–28,5 s gỡ; 28,5–32,4 s bản cũ còn; 32,4–41,9 s quay lại đúng bàn và ô chat, hai mục kiểm trước nút cài, câu hỏi cuối rồi “Bình luận cho Cáo nhé.”. |
| Y6 · Tốc độ | Nhãn **đạt**, nghe **CHƯA KIỂM — giám đốc nghe** | Âm thanh không đổi so với lượt 1: `atempo` 1,03 cho 11 câu [dẫn], 0,97 cho 6 câu [kỹ thuật] (`assets/voice/measurements.json`). Mỗi cảnh ≥ 3,0 s. Không suy số đo thành “đã nghe”. |
| Y7 · Khoảng nghỉ | Số đo **đạt**, nghe **CHƯA KIỂM — giám đốc nghe** | Câu hỏi cuối nghỉ 0,748 s (39,498–40,246) với hai thẻ đang mở; nghỉ chuyển cảnh 0,74–0,99 s ở 7,06–8,045, 11,424–12,164, 15,209–16,063, 18,265–19,063, 23,749–24,526; ba nghỉ ngắn 0,55–0,61 s (QC-06). Đuôi im 0,536 s (≤ 0,7). |
| Y8 · Phát âm | Văn bản **đạt**, nghe **CHƯA KIỂM — giám đốc nghe** | `phonemes.py` do `qc-measure` chạy: mã 0, 17 dòng, 0 mục lỗi (`report.md`, mục “Phát âm Y8”). “chat” → `tʃˈæt` (lượt 1 đã đối chiếu clip `assets/voice/term-check/`); không đổi vì lời không đổi. Phát âm thật chờ giám đốc nghe. |

### 5 câu hỏi người xem lạ

| # | Kết quả | Mốc và bằng chứng |
| --- | --- | --- |
| 1 | **Đạt** | Khung 0,0–0,5 s: hồ sơ trong ô chat, Cáo hoảng, phụ đề “Hồ sơ khách vừa dán, bản sao đã ra ngoài.”; bản sao tách từ ≈ 1,15 s (`frame-0.5.png`, `frame-1.8.png`). |
| 2 | **Đạt** | 3,08–4,7 s câu hỏi “Chat lọt ra bằng cách nào?”; 4,0–5,5 s máy chủ lạ nhận bản sao (`frame-5.png`). Hệ quả (hồ sơ khách ra ngoài) có trước giây 5. |
| 3 | **Đạt** (kèm QC-05, QC-08) | 10 cảnh một ý. Tắt tiếng vẫn theo được đường đi của bản sao: chat → máy chủ (01–02), quyền → bản sao (04), hai tuyến (05), đồng hồ + đợt gửi (06), gỡ (07), bản cũ còn (08), ba thẻ vào khay (09). |
| 4 | **Đạt** (kèm QC-06/07) | Hình đổi nhìn ra ở 360×640 (board-01..03); 10 nhóm bố cục khác nhau, không cảnh dưới 3,0 s, đoạn tĩnh dài nhất 1,0 s có lý do. Chữ trên hình là nhãn UI, không chép lời đọc (trừ dòng quyền ở 04, vốn là nội dung giao diện). Hết chữ tràn/dính viền. |
| 5 | **Đạt** | Kết quay lại đúng bàn và ô chat: ba thẻ trong khay ngoài, chat trống (32,4–35,6 s); câu hỏi “Bạn xem quyền hay nhà phát hành trước?” rồi “Bình luận cho Cáo nhé.”. Đuôi im 0,536 s ≤ 0,7. Bìa là khung hook ≈ 1,8 s, ở 180×320 vẫn nhận ra Cáo và hai thẻ (`thumb-180x320.png`). |

### R11 · R12

- **R11:** cảnh 05 (16,03–19,03 s) và 06 (19,03–24,5 s), hai cảnh vừa dựng lại, vẫn có sự kiện hình cho từng khẳng định: xung xanh tới Chatbot song song với bản sao rẽ ở biểu tượng tiện ích theo nhánh đỏ vào khay (`sheet-scene05.png`); vòng cung vàng giảm, hồ sơ và thẻ địa chỉ vào hai hộc rồi rời khay theo một đường ra (`sheet-scene06.png`). Các cảnh khác không đổi so với lượt 1 nên bảng R11 lượt 1 còn đúng. Chỗ yếu còn lại: QC-08 (quy mô) và QC-09 (thẻ không chạm mép chat), đều đã ghi nhận.
- **R12:** 4 chủ đề nền, 10 nhóm bố cục, chuỗi cùng chủ đề dài nhất 2 cảnh, 3 cỡ cảnh, không 3 cảnh liền cùng cỡ. Camera: chỉ cảnh 08 khai push_in, đã dựng thật (≈ 1,11×, mượt, hướng vào khay có bản cũ); chín cảnh còn lại camera tĩnh, chuyển động nằm ở đạo cụ, khớp khai báo; không có cú cắt thừa để qua chỉ số.

### Phần công cụ không đo được — CHƯA KIỂM, chờ giám đốc

- **Nghe giọng, tốc độ cảm nhận, nhịp nghỉ, phát âm “chat” (Y6–Y8).** QC không đưa âm thanh vào mô hình; chỉ có số đo và văn bản.
- Độ dễ đọc trên điện thoại thật và độ mượt của cú tiến máy ở cảnh 08 khi phát (QC xem khung tĩnh, không xem chuyển động liên tục).
- Đúng nội dung: lượt 1 đã đối chiếu báo cáo OX Security; lượt 2 không mở lại nguồn vì lời và số liệu không đổi.

### Bài học cho luật

- `qc-measure` chưa đo lề hộp bao chữ trong vật chứa; lượt này QC đo tay bằng PIL (lọc ngưỡng sáng) trên khung full-res để xác nhận QC-01/02. Đề nghị cân nhắc thêm công cụ/tuỳ chọn đo lề chữ (≥ 16 px) để Producer tự kiểm trước khi xuất.
