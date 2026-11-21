# Kế hoạch bộ video · IT-T8

**Phạm vi một tập.** Một khái niệm là quyền đọc dữ liệu trang có thể bao gồm nội dung khung chat. Một sự cố là bản sao hồ sơ khách hàng mẫu của Cáo đi qua tiện ích có ý xấu sang máy chủ lạ. Hai đường ở cảnh 05 là đối chứng trong cùng cơ chế.

| Mã video | Tên tập | Thời lượng mục tiêu | Thông điệp chính |
|---|---|---:|---|
| IT-T8-E01 (`ep01`) | Đường đi của bản sao | 41,90 s dự kiến · 10 cảnh | Kiểm nhà phát hành và quyền trước khi cài. Gỡ tiện ích đã bỏ dùng và giữ dữ liệu nhạy cảm ngoài khung chat. |

## Hình ảnh, giọng đọc và phụ đề

Khung 9:16. Giao diện giả lập bằng hình khối bo góc, nét gọn, ánh sáng dịu, đồ hoạ 2D đặt cạnh Cáo cam công sở quen thuộc. Dựng Pillow + FFmpeg với năm bố cục thật sự khác nhau. Lớp xa tạo ánh sáng, lớp giữa đặt đạo cụ, lớp gần giữ chiều sâu ở rìa. Cắt chuyển bối cảnh theo hành động. Camera cố định trong cảnh theo mặc định, cỡ khung đổi bằng cắt có chủ đích. Cảnh 04 phóng riêng thẻ quyền để biến nó thành lớp quét trên tab chat.

| Vai trò màu | Màu | Cách dùng |
|---|---|---|
| Nền chung và bề mặt | `#202B3D` · `#EEF2F6` | Ánh sáng nền và thẻ giao diện, theo tỉ lệ sáng/tối của từng bối cảnh. |
| Chữ UI | `#142033` · `#F8FAFC` | Chữ tối trên thẻ sáng, chữ sáng trên nền tối. |
| Đúng / luồng thông thường / thao tác phòng ngừa | `#60D4AB` | Tuyến đến chatbot ở độ sáng thấp hơn tuyến đang xét. Khi giữ dữ liệu ngoài chat, mép khay ngoài khung chat sáng xanh. |
| Sai / rò rỉ / bị từ chối | `#F26B78` | Nhánh ra máy chủ, mép khe nhận và vạch cấm. Khi gỡ, nhánh gãy và chuyển sang xám. |
| Đang xét / quyền đang được rà | `#F4D276` | Tấm quét quyền, vòng lấy nét vào mục người dùng cần đọc, bộ đếm đợt gửi. |
| Nhấn / nhận diện cùng hồ sơ | `#FF9A45` | Cùng một góc cam trên bản gốc, bản sao và bản nằm ở đích. Cam luôn nhận diện hồ sơ. |
| Đã ngắt / nền phụ | `#8393A8` | Đường gửi đã gãy và các vật thể ngoài tiêu điểm. |

| Nền · tổng theo khung hình | Hồi, cảnh và hai trạng thái nếu quay lại | Lớp xa / giữa / gần và chuyển động |
|---|---|---|
| A · `office` · 13,25 s (31,6%) | Storytelling 01, Solution 09–10. Mở trung cảnh bên bàn, kết từ toàn xuống trung. Trở lại bàn với hồ sơ nằm ngoài chat và hai mục cần rà. | Ánh cửa sổ, mặt bàn và màn hình chat, mép bàn/lớp Cáo. Hồ sơ tách ở mở rồi bị giữ ngoài cửa sổ ở kết. |
| E · `incident` · 7,96 s (19,0%) | Problem 02, Solution 08. Cận khe nhận lúc đang nhận, cận nghiêng lúc đường vào đã ngắt và bản cũ còn trong khay. | Tường phòng máy, khối máy chủ/khe và khay, đường gửi ở tiền cảnh. Thẻ vào khay, sau đó khay vẫn giữ đúng thẻ góc cam khi đường gãy. |
| B · `security` · 8,26 s (19,7%) | Problem 03 → Explanation 04. Toàn cửa hàng giả lập, cận hộp quyền đè lên tab chat. Hai cảnh liền là một lần vào nền B. | Ánh sáng sau cửa sổ trình duyệt, hai thẻ tiện ích/hộp quyền, con trỏ và lớp quét. Thẻ được chọn mở hộp quyền, rồi lớp quét chạm tab. |
| C · `code` · 8,69 s (20,7%) | Explanation 05–06. Toàn sơ đồ đối chứng rồi trung cảnh bộ đếm và khay đợt gửi. | Lưới kỹ thuật mờ, hai tuyến và bộ đếm, các thẻ đi qua khay. Dùng màn hình luồng trình duyệt vì sự việc diễn ra ở tab và tiện ích. |
| D · `security` · 3,74 s (8,9%) | Solution 07. Toàn màn hình quản lý nhìn chính diện, riêng bố cục với B. | Sáng viền cửa sổ, bảng chi tiết chuyển sang danh sách đã cài, khung nét và nút gỡ. Dùng seed khác B, bố trí danh sách dọc. |

- **Cỡ và vùng an toàn.** Chữ Segoe UI Semibold/Bold. Phụ đề trắng `#F8FAFC`, 64 px trở lên, viền `#142033` 4–5 px, tối đa 2 dòng và 24 ký tự/dòng. Giữ nguyên văn và dấu, chia cue ở ranh giới cụm nghĩa. Nhãn UI ≥ 56 px, từ khóa nếu dùng ≤ 3 từ và ≥ 72 px, tối đa 3 nhóm chữ đồng thời ngoài phụ đề. Chữ và chi tiết quan trọng nằm trong y≈250–1500, cách hai lề ≥ 90 px. Phụ đề thường ở y≈1300–1495. Cảnh có Cáo dùng y≈255–425 để chữ nằm trên đầu Cáo và tách khỏi đạo cụ.
- **Cỡ vật chính.** Chiều cao cụm hành động mục tiêu 560–700 px trong vùng an toàn. Với cửa hàng, hộp quyền, sơ đồ và máy chủ, đo cả cụm liên quan trong cùng hành động. Cảnh 10 ưu tiên tư thế Cáo cao khoảng 470 px để giữ giới hạn 1,5× ảnh nguồn. Đo thêm cụm Cáo và hai thẻ trước cửa sổ cài, mục tiêu ≥ 560 px.
- **Định hướng và bìa.** Dấu góc cam và trạng thái đường gửi dẫn mắt qua các hồi. Chọn bỏ chip chương vì hai đường ở đoạn giải thích đã mang đủ thông tin định hướng và mỗi nhịp có một tiêu điểm. Bìa lấy khung hook khoảng 1,8 s, với Cáo và hai mảnh hồ sơ cùng góc cam tách rõ ở 180×320.
- **Âm thanh.** Minh Đức giọng Bắc, giọng đọc và hiệu ứng tự tạo rất nhẹ. Dùng `atempo` 1,03 cho [dẫn], 0,97 cho [kỹ thuật]. Hiệu ứng ngắn ở các lần tách, nhận và ngắt. Đuôi im 0,50 s. Đo lại TTS và khoảng nghỉ, gồm cả nghỉ đã có trong audio, rồi chuyển mốc sản xuất cho Kịch bản và Đạo diễn hình ảnh duyệt.

## Bản đồ Cáo

Vị trí tính từ góc trái trên của khung. Kích thước là chiều rộng nhìn thấy và phải đo lại sau ghép alpha. Dùng đúng ảnh pose tĩnh, giữ khuôn mặt nguyên. Hành động do đạo cụ hoặc con trỏ thực hiện theo ánh nhìn/cử chỉ của Cáo.

| Cảnh | Khoảng hiện dự kiến | Dáng, cỡ, vị trí và hành vi |
|---|---|---|
| 01 | 0,00–4,00 s | Có · `surprised`, rộng 216 px (20%), góc trái x≈105, y≈930. Cáo nhìn hồ sơ dịch vào chat và phản ứng khi bản sao bật ra phía trên bên phải. |
| 02–03 | — | Ẩn · dành khung cho máy chủ và cửa hàng. Con trỏ ở 03 đại diện thao tác cài của Cáo trong hồi tưởng. |
| 04 | 12,14–16,29 s | Có · `point_right`, rộng 216 px (20%), x≈100, y≈850. Đặt đầu ngón hướng đúng dòng quyền bên phải. Tấm quét và đường rẽ nằm bên phải, ngoài hộp bao Cáo. |
| 05–09 | — | Ẩn · dành khung cho hai tuyến, bộ đếm, thao tác gỡ, bản cũ ở đích và các thẻ dữ liệu nhạy cảm. |
| 10 | 35,93–41,90 s | Có · `thumbs_up`, rộng khoảng 302 px, cao khoảng 471 px (≈1,45× pose nguồn 209×326), x≈100, y≈710. Cáo hướng về cửa sổ cài và hai mục kiểm bên phải khi hỏi người xem. |

Tổng hiện dự kiến 14,12 s (33,7%). Ba dáng cách nhau hơn 2 s. Chuyển động có ý nghĩa đến từ hồ sơ, lớp quyền và các mục kiểm.

## Nguyên liệu cần

| Nguyên liệu | Nguồn được phép theo `docs/asset-sources.md` |
|---|---|
| Ba ảnh pose tĩnh | `brand/cao/poses/` · `surprised.png`, `point_right.png`, `thumbs_up.png`. |
| Nền A/B/C/D/E | Bộ tạo nền `tools/backgrounds/` của xưởng với `office`, `security`, `code`, `security`, `incident`. |
| Cửa hàng, chat, hộp quyền, sơ đồ, máy chủ, hồ sơ, cửa sổ quản lý | Hình khối, đường nét và thẻ tự vẽ bằng Pillow, ghép FFmpeg. Giao diện, biểu tượng và dữ liệu dùng hình minh hoạ chung do xưởng tự tạo. |
| Chữ và giọng | Segoe UI trên Windows. VieNeu-TTS cục bộ, Minh Đức theo `docs/voice.md`. Hiệu ứng do xưởng tự tạo bằng FFmpeg. |

**Cần giám đốc cung cấp.** Chưa thiếu nguyên liệu. Phần giọng và phát âm cần giám đốc nghe duyệt sau TTS.

## Ngân sách thời lượng

Đơn vị là âm tiết ước lượng. Cơ sở 4,0 âm tiết/s nhân hệ số Y6. Mỗi lần đọc “chat” được tính 2 âm tiết gồm 1 âm tiết cộng thêm. Nhóm theo lời của từng đoạn. Lời 02 bắt đầu ở cảnh 01 và vắt qua cú cắt 4,00 s. Nghỉ tính một lần tại ranh giới. Tổng dùng giá trị gốc trước khi làm tròn.

| Tập / đoạn lời | Nhãn | Âm tiết | Âm tiết/s | Đọc (s) | Nghỉ Y7 (s) | Đuôi (s) | Tổng (s) |
|---|---|---:|---:|---:|---:|---:|---:|
| E01 · 01–02 | [dẫn] | 17 | 4,12 | 4,126 | 1,40 | 0 | 5,526 |
| E01 · 03 | [dẫn] | 7 | 4,12 | 1,699 | 0,80 | 0 | 2,499 |
| E01 · 04–05 | [dẫn] | 12 | 4,12 | 2,913 | 1,20 | 0 | 4,113 |
| E01 · 06 | [kỹ thuật] | 13 | 3,88 | 3,351 | 0,80 | 0 | 4,151 |
| E01 · 07 | [kỹ thuật] | 9 | 3,88 | 2,320 | 0,80 | 0 | 3,120 |
| E01 · 08–09 | [kỹ thuật] | 16 | 3,88 | 4,124 | 1,45 | 0 | 5,574 |
| E01 · 10–11 | [dẫn] | 11 | 4,12 | 2,670 | 1,07 | 0 | 3,740 |
| E01 · 12–13 | [kỹ thuật] | 11 | 3,88 | 2,835 | 1,10 | 0 | 3,935 |
| E01 · 14 | [dẫn] | 10 | 4,12 | 2,427 | 0,85 | 0 | 3,277 |
| E01 · 15–17 | [dẫn] | 18 | 4,12 | 4,369 | 1,10 | 0,50 | 5,969 |
| **IT-T8-E01** | **Hai nhịp** | **124** | — | **30,833** | **10,57** | **0,50** | **41,903** |

## Tiêu chí nghiệm thu

- Thành phẩm dài 15–45 s. Kế hoạch ≤ 42 s, 10 cảnh trung bình 4,19 s/cảnh. MP4 9:16 1080×1920, 30 fps, H.264 yuv420p + AAC, faststart, ≤ 250 MB, khoảng −14 LUFS, đỉnh ≤ −1,5 dBTP.
- Hook hiện bằng lời và hình trong 2 s, máy chủ nhận hồ sơ trước 5 s, nhánh sao chép qua tiện ích hiện ở mốc mục tiêu 13 s. Kiểm dấu góc cam ở các lần đổi trạng thái trong 01, 02, 04, 06 và 08. Cảnh 08 cho thấy đường gửi gãy và bản cũ còn ở đích.
- Năm bối cảnh, mỗi nền xuất hiện tối đa hai lần, nhiều nhất hai cảnh liên tiếp và khoảng 32% thời lượng. Luân phiên toàn–trung–cận, mỗi khoảng 1,5 s thấy vật thể hay quan hệ đổi ở 360×640. Ghi lý do nếu có đoạn tĩnh hơn 2 s. Kiểm cỡ Cáo, vùng an toàn và vùng chồng lớp.
- Có `captions.srt` và phụ đề đốt cứng theo cột lời và quy tắc chữ. `thumbnail.jpg` lấy khung hook và kiểm ở 180×320. Chữ kỹ thuật khớp nguyên văn cột “Chữ trên màn hình” của kịch bản.
- Có `publish.json` đủ TikTok, Facebook Reels, YouTube Shorts, `ai_generated_content: true`, `ai_disclosure` ở cuối mỗi mô tả, “(ví dụ dựng)” đi cùng tình huống trong caption. Bật công tắc khai báo AI khi đăng.
- Producer ghi mốc thật vào `assets/scenes.json`, chạy `tools/qc-measure.mjs`, `qc-video` và `qc-publish`. Rà công cụ phát âm trên cột “Lời đọc”, kiểm âm vị và chuẩn bị clip nghe từng thuật ngữ cho giám đốc.

## Rủi ro & dự phòng

| Rủi ro | Dự phòng |
|---|---|
| Nhìn nhầm thao tác gửi bình thường làm hồ sơ lộ | Đặt hồ sơ trong vùng nội dung đã hiện, giữ bản gốc ở đó. Dùng đủ cú quét và chỗ rẽ qua biểu tượng tiện ích ở giây 13, sau đó đối chiếu hai đường ở 05. |
| Cảnh quyền hoặc đợt gửi dày chữ | Giữ nguyên văn dòng quyền thành một nhóm. Ở 06, làm hiện bộ đếm trước, đưa hai thẻ dữ liệu vào khay theo nhịp kế tiếp. |
| Người xem tưởng gỡ xong là lấy lại được hồ sơ | Giữ đúng bản góc cam trong khay máy chủ sau khi đường gửi gãy. |
| TTS khiến mốc trượt hoặc video quá 45 s | Đo từng câu, ưu tiên ghim điểm nhận ở 4 s và điểm rẽ ở 13 s. Nếu vượt trần, gửi Kịch bản rút câu phụ dẫn vào số liệu hoặc gộp lời mô tả đợt gửi. Giữ hệ số đọc và bộ câu thoại Cáo đã chốt. |
