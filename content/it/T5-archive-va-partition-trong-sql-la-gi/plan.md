# Kế hoạch bộ video — Chủ đề IT #5

## Tập

| Mã video | Tên tập | Thời lượng mục tiêu | Thông điệp chính |
|---|---|---:|---|
| IT-T5-E01 | Chia rồi, vẫn đầy? | 38–42 s · ngân sách 41,96 s · trần 45 s | Partition gom dòng theo một cột trong một bảng và có thể giúp truy vấn bỏ qua phần ngoài kỳ. Archive giữ đơn cũ ở nơi lưu khác. Trong ví dụ, kho chính có chỗ cho đơn mới sau khi bản cũ đã được kiểm và bỏ khỏi kho chính. |

## Hình ảnh

- Khung dọc 1080×1920, 30 fps. Giao diện minh hoạ và sơ đồ có cạnh bo, mặt trước gần trực diện, viền rõ, phối sáng xanh dịu từ trên trái. Giữ cùng hình thẻ đơn, khay, vạch kho và góc nhìn khi nối qua các nền.
- Nền **office** ở hook, chuyển sang **incident** khi thẻ bị bật lại, rồi **database** khi đi từ vạch vào bảng. Đoạn kết nối về đúng bố cục giao diện mở trên nền **office**. Với mỗi nền, lớp xa tạo ánh sáng và chiều sâu, lớp giữa dùng silhouette bàn làm việc / bảng báo lỗi trừu tượng / dãy máy chủ, lớp gần là viền tối nhẹ. Dịch lớp xa ít hơn lớp giữa và lớp gần. Giữ lớp giữa trống ở tâm khung. Dùng công cụ nền ba lớp của xưởng, đổi nền bằng nối hình theo chính vật đang chuyển động.
- Hệ đạo cụ nhất quán: một bảng mẹ, ba khay theo tháng, chín thẻ dòng giữ nguyên kích thước và dấu hình học, một thẻ đơn mới có sọc chéo riêng. Kho lưu có vỏ hộp riêng và khe hở nhìn được ở 360×640. Vạch đi cùng **Kho chính**; không dùng đồng hồ, phần trăm, số byte hay vạch kho thứ hai. Mọi tháng và đơn chỉ để minh hoạ.
- Vùng an toàn x≈90–990, y≈250–1500. Khi có Cáo, đặt màn hình/bảng chính khoảng x=330–970, y=315–925, phụ đề y≈940–1070, Cáo ở vùng dưới trái y≈1090–1460. Cảnh chỉ minh hoạ đặt phụ đề y≈1290–1490. Ở cảnh trọng tâm, hộp bao màn hình, bảng hoặc cặp kho cao khoảng 580–680 px. Vạch và thẻ đơn cận cảnh là chi tiết nằm trong hộp bao này. Không có ngoại lệ dự kiến cho ngưỡng 560 px.
- **R4.** Chuyển động đến từ thẻ bị trả về, bảng mở/ngăn lại, khung chọn chuyển tuyến, bản sao đi qua hai kho, khoá gắn vào mép bảng, nguồn được bỏ và đơn ghi thành công. Canh khoảng cách giữa hai đổi hình thấy được ở 360×640 dưới 1,5 s. Nền dịch nhẹ và đổi dáng Cáo chỉ đi kèm. Nếu bản dựng phát sinh đoạn tĩnh trên 2 s, ghi lý do trong storyboard và kiểm lại với kịch bản.
- **R7.** Ba chip biểu tượng không chữ ở x≈735–975, y≈250–310. Chip sự cố (thẻ đơn + dấu lỗi) đánh dấu lúc mở, chip chia khay từ 5,17 s, chip lưu kho từ 26,49 s. Viền rỗng cho chặng chưa đến, viền sáng cho chặng hiện tại, dấu ✓ nhỏ cho chặng đã qua. Bìa lấy khung khoảng 1,55 s, giữ vạch đỏ, thẻ đơn bị chặn và Cáo. So ở 180×320 để bảo đảm nhận ra lỗi lưu, giữ tối đa hai nhãn cốt lõi của hook.

| Vai trò | Màu | Tín hiệu dùng cùng màu |
|---|---|---|
| Nền và mặt thẻ | `#122438` / `#23415C` | Nền tối, mặt thẻ sáng hơn, viền phân biệt các kho |
| Chữ và đường trung tính | `#F3F7FB` / `#9CB1C5` | Chữ sáng, viền mảnh; khay ngoài kỳ giảm tương phản nhưng còn nguyên nét và thẻ |
| Cảnh báo / ghi thất bại | `#FF6B6B` | Vạch đầy có vân xiên, vật bị chặn đi lùi kèm dấu × |
| Đang xét / đang kiểm tra / có điều kiện | `#FFCB6B` | Viền nét đứt quanh ngày hoặc bản sao, ổ khoá khi tách khay |
| Nhấn đối tượng được chọn | `#68CCF5` | Viền liền đậm và đường dẫn truy vấn đi vào đúng khay |
| Thành công đã xác nhận | `#72D8A0` | Dấu ✓, thẻ dừng trong kho đích sau khi lưu hoặc tra thành công |

**Chữ giải thích và phụ đề (Y1).** Dùng Segoe UI có dấu, từ khoá Semibold ≥ 72 px, nhãn UI ≥ 56 px. Mã kỹ thuật dùng Consolas ≥ 56 px. Tối đa ba nhóm đồng thời ngoài phụ đề. Lấy đúng chữ từ cột **Chữ trên màn hình** trong script và tắt toàn bộ chữ mặc định của nền/đạo cụ. Phụ đề đốt cứng và xuất `captions.srt`, nguyên văn lời đọc, Segoe UI Semibold khoảng 56 px, trắng viền tối 4 px, tối đa hai dòng, ngắt theo cụm nghĩa. Khi có Cáo, phụ đề nằm hoàn toàn phía trên đầu Cáo. Thử ở 360×640 và giữ đủ dấu tiếng Việt.

### Không nhãn thừa trên hình

Giám đốc yêu cầu 19/11/2026: bỏ nhãn «AI tạo» và «Ví dụ dựng» khỏi khung hình và bìa; tuyệt đối không có chữ hay hình thừa. Khai báo AI nằm ở `publish.json` (`ai_generated_content: true`, mô tả cả ba nền tảng kết thúc bằng câu «Video có dùng hình ảnh và giọng đọc do AI tạo.») và công tắc khai báo AI khi đăng. Tình huống dựng ghi “(ví dụ dựng)” ở caption.

## Âm thanh

- Giọng Cáo dùng Minh Đức, giọng Bắc, theo cấu hình đã chốt trong `docs/voice.md`. `atempo` 1,03 cho nhịp dẫn ngắn, 1,00 cho câu dẫn đối chiếu số dòng, 0,97 cho kỹ thuật. Không nhạc nền. Chỉ dùng hai hiệu ứng tự tạo ngắn ghi trong script (lỗi và lưu thành công), thấp hơn giọng.
- Producer chạy Y8 trên cột **Lời đọc/phụ đề** trước khi tổng hợp từng câu. Tính cả phần ngừng có sẵn để mỗi mốc Y7 chỉ tính một lần. Đo giọng và lặng sau TTS, trả timeline để Kịch bản và Đạo diễn hình ảnh duyệt lại. Phát âm và nhịp nghe thật chờ giám đốc.
- Bản cuối có luồng tiếng, âm lượng khoảng −14 LUFS, đỉnh ≤ −1,5 dBTP. Đuôi im 0,70 s tính từ hết câu hỏi cuối.

## Bản đồ Cáo (Y2–Y3)

| Cảnh / mốc dự kiến | Có Cáo | Dáng, hành vi và vị trí |
|---|---|---|
| S01 · 0,00–5,17 s | Có từ 0,00 đến 4,37 s | `surprised`, rộng 210 px, x≈90, đáy y≈1460. Đứng cạnh màn hình, phản ứng và nhún nhẹ khi đơn bật khỏi đường ghi. Rời khi máy quay đi theo đường lỗi vào bảng. |
| S02 · 5,17–17,77 s | Không | Dành khung cho dải dòng, cột ngày tạo và các khay cùng bảng. |
| S03 · 17,77–22,48 s | Có | `point_up`, rộng 210 px, x≈90, đáy y≈1460. Hướng tay về cặp dải thẻ trước/sau và vạch đỏ trở lại phía trên. |
| S04 · 22,48–26,49 s | Không | Chừa khung cho tuyến lọc và ba khay. |
| S05 · 26,49–32,74 s | Không | Hiện đồng thời hai kho trong lúc chép và tra kiểm. |
| S06 · 32,74–37,82 s | Không | Chừa chi tiết khoá, chỗ tách khay và trạng thái kho lưu. |
| S07 · 37,82–41,96 s | Có | `thumbs_up`, rộng 220 px, x≈90, đáy y≈1460. Hướng về thẻ đơn mới được nhận rồi giữ dáng lúc trả thẻ cũ và chào kết bằng câu hỏi. |

Cáo có mặt khoảng **13,22 s / 41,96 s (32%)**. Giữ tỉ lệ nguồn, đo hộp bao từng dáng trên khung thật, giữ cách lần đổi dáng ≥ 2 giây, không nhép miệng.

## Nguyên liệu cần

| Nguyên liệu | Nguồn đã có |
|---|---|
| Ba dáng `surprised`, `point_up`, `thumbs_up` | `brand/cao/poses/`, trong bộ Cáo văn phòng được phép, tạo lớp bằng công cụ xưởng |
| Nền `office`, `incident`, `database` | `tools/backgrounds/make_background.py`; xuất các lớp PNG xa/giữa/gần như README. Ghi lại seed và màu đã dùng. |
| Giao diện tạo đơn, vạch kho, thẻ dòng, khay, vỏ kho, tuyến truy vấn, biểu tượng/chip | Đồ hoạ tự dựng từ hình khối bằng Pillow và FFmpeg; Segoe UI và Consolas của Windows |
| Giọng kể, hai tiếng báo ngắn | Giọng Minh Đức theo cấu hình VieNeu-TTS của xưởng và hiệu ứng tổng hợp cục bộ |

**Cần giám đốc cung cấp.** Không có nguyên liệu ngoài bộ hiện có. Cần giám đốc nghe duyệt phát âm và nhịp TTS ở bước sản xuất.

## Ngân sách thời lượng

Mốc dự kiến dùng tốc độ cơ sở giả định **4,25 âm tiết/s** nhân hệ số hậu kỳ. Mốc này chờ đo bằng TTS giọng Minh Đức. Đếm sau khi ước lượng cách đọc TTS của các thuật ngữ. Cộng từng lượng lời chia tốc độ, cộng nghỉ theo kịch bản và đuôi cuối một lần. Tổng dùng số chưa làm tròn.

| Tập / đoạn | Nhãn | Âm tiết ước lượng | Tốc độ mới (âm tiết/s) | Đọc (s) | Nghỉ Y7 (s) | Đuôi (s) | Tổng (s) |
|---|---|---:|---:|---:|---:|---:|---:|
| Lời 1–3 · Tạo đơn | `[dẫn]` (1,03) | 13 | 4,3775 | 2,97 | 2,20 | 0,00 | 5,17 |
| Lời 4–7 · Chia theo tháng | `[kỹ thuật]` (0,97) | 34 | 4,1225 | 8,25 | 2,75 | 0,00 | 11,00 |
| Lời 8 · Đếm lại | `[dẫn]` (1,00) | 3 | 4,2500 | 0,71 | 0,90 | 0,00 | 1,61 |
| Lời 9 · Chốt cách chia | `[kỹ thuật]` (0,97) | 7 | 4,1225 | 1,70 | 1,30 | 0,00 | 3,00 |
| Lời 10 · Trở về vạch kho | `[dẫn]` (1,03) | 4 | 4,3775 | 0,91 | 0,80 | 0,00 | 1,71 |
| Lời 11 · Lọc tháng | `[kỹ thuật]` (0,97) | 13 | 4,1225 | 3,15 | 0,85 | 0,00 | 4,00 |
| Lời 12–16 · Lưu kho và bỏ bản cũ | `[kỹ thuật]` (0,97) | 36 | 4,1225 | 8,73 | 2,60 | 0,00 | 11,33 |
| Lời 17–18 · Lưu đơn, tra lại, kêu gọi | `[dẫn]` (1,03) | 12 | 4,3775 | 2,74 | 0,70 | 0,70 | 4,14 |
| **IT-T5-E01 · Tổng** | Theo từng đoạn | 122 | Theo từng đoạn | 29,16 | 12,10 | 0,70 | 41,96 |

## Tiêu chí nghiệm thu

- Clip dọc **1080×1920, 9:16, 15–45 s** sau đo TTS, mục tiêu 38–42 s. MP4 H.264 yuv420p + AAC, 30 fps, faststart, ≤ 250 MB, có audio, có phụ đề đốt và `captions.srt`.
- Hook nghe được và nhìn thấy vạch đỏ cùng lỗi ghi trong **0–2 s**. Trước **5 s**, người xem nghe đơn chưa lưu được và thấy vạch đúng kho nối với đường ghi. Đáp án hoàn chỉnh quanh **22 s** và trước **25 s**. Vạch giữ nguyên khi chia, lọc, sao chép, tra kiểm và tách. Sau khi bản cũ thực sự được bỏ khỏi kho chính, vạch mới hạ, đơn mới mới lưu thành công. Kho lưu trả lại đúng một đơn cũ.
- Thử ở **360×640** để thấy tuyến lọc tránh khay ngoài kỳ và trình tự chép → kiểm → bỏ. Khay bị bỏ qua vẫn còn nguyên, sự cố và lưu thành công nhận biết được bằng hình. So chữ với script, đo nhóm chữ/kích cỡ/vùng an toàn, kiểm vùng Cáo và đối chiếu các mốc đổi hình. Bìa `thumbnail.jpg` lấy từ hook và kiểm ở **180×320**.
- Xem bảng Y1–Y8 và các trục Kỹ thuật, Tuân thủ, Trải nghiệm theo `docs/chat-luong-xem.md`. Đo đuôi im ≤ 0,70 s, ghi số đo audio, lưu kết quả kiểm lời và clip nghe riêng cho mỗi thuật ngữ. Trạng thái nghe **CHƯA KIỂM — giám đốc nghe** cho tới khi được xác nhận.
- `publish.json` có tiêu đề, mô tả và 3–5 hashtag cho mỗi nền tảng TikTok, Facebook Reels, YouTube Shorts. `ai_generated_content` là `true`, `ai_disclosure` dùng câu đã chốt, nằm cuối cả ba mô tả. Dùng nội dung trong script, chạy kiểm kỹ thuật video và bộ đăng của xưởng ở bước sản xuất.

## Rủi ro & dự phòng

| Rủi ro | Cách xử lý |
|---|---|
| Nhầm chia khay với nén, xoá hoặc giải phóng dung lượng | Giữ nguyên kích cỡ, số lượng và dấu thẻ, cho khay ngoài kỳ vẫn thấy được, gắn chỉ báo vào đúng kho. |
| Tách khay bị hiểu là xoá vật lý hoặc lời hứa chung cho mọi hệ | Tách đường nối bảng ở một nhịp, bỏ phần lưu ở kho chính ở nhịp kế tiếp, rồi mới đổi vạch. Dùng riêng PostgreSQL cho lưu ý khoá bảng. Phần nguồn của kịch bản ghi tuỳ chọn `CONCURRENTLY` và giới hạn. |
| Một lần tra bị hiểu là bước kiểm duy nhất | Cho đường tra thử trả đúng một thẻ và cho cả lô phản hồi khớp trước dấu ✓. Nếu bản sao chưa khớp, giữ nguyên bản gốc và vạch. |
| TTS vượt trần hoặc đọc thuật ngữ chưa tự nhiên | Đo trước khi khoá hình. Nếu quá 45 s, ưu tiên bỏ lời đếm lại ở Lời 8 nhưng giữ hình đối chiếu. Nếu vẫn dài, rút câu về lọc tháng ở Lời 11, giữ hook, câu trả lời, khả năng bỏ qua khay ngoài kỳ, khoá bảng và đủ ba bước lưu. Đo lại ở cùng hệ số. |
| Renderer thiếu chuyển động hoặc nền theo ngữ cảnh | Đạo diễn hình ảnh đối chiếu R9 trước duyệt storyboard. `ExplainerScene.jsx` hiện dùng nền tối cố định, nên dự kiến Pillow+FFmpeg cho các lớp `office → incident → database` và chuyển động thẻ/vạch. Nếu storyboard xác nhận hạn chế, ghi renderer `pillow-ffmpeg` cùng lý do. |
