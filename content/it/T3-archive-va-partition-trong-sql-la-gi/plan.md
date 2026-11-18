# Kế hoạch bộ video — Archive và Partition trong SQL

**Bản sửa vòng 2 — Claude đã duyệt (xem `review/script-r2.md`)**, theo `review/script-r1.md`. team_id **4**, IT · Đội 3. Nguồn concept: `concept.md` và “Phán quyết cuối” trong `debate.md`. Đây là chỉ dẫn kịch bản cho Producer và Đạo diễn hình ảnh; chưa phải storyboard đã duyệt hay thành phẩm đã QC.

## ĐƯỜNG DỰNG ĐÃ CHỐT CHO IT-T3-E01 (Claude gỡ vướng, 18/11/2026) — ĐỌC TRƯỚC KHI DỰNG

**Dựng bằng Pillow + FFmpeg (skill `$video-producer`), KHÔNG chạy `studio/renderer-remotion/src/producer.mjs`.** Lý do: Remotion preflight đòi `component_props.durationInFrames`, và quan trọng hơn là `ExplainerScene`/`DataVizScene` chỉ vẽ khối-nối-mũi-tên và biểu đồ thanh, không dựng được lưới T1–T12, thẻ trượt giữ mã, hộp Lưu trữ, bộ đếm 9/3, replay cut mà storyboard `APPROVED` yêu cầu; sửa renderer là việc ngoài phạm vi Producer. Đây là ngoại lệ theo AGENTS.md "Chọn renderer" điểm 2 (component hiện có không dựng được đúng visual đã duyệt, còn đường Pillow+FFmpeg giữ nguyên ý nghĩa minh hoạ) và đã được Visual Director (Claude) xác nhận; `storyboard.md` và `visual_style_note` đã chỉ định sẵn đường này. Không sửa `storyboard.json`/`studio/`, không thêm `component_props`. **Các bước, thông số và điểm kiểm: xem `ep01/notes.md`, mục "Hướng dẫn từ Claude".**

## Các tập

| Mã video | Tên tập | Thời lượng mục tiêu | Thông điệp chính |
|---|---|---|---|
| IT-T3-E01 | Archive và Partition: chia hay chuyển? | 39 giây | Partition chia phần trong một bảng logic; Archive chuyển dữ liệu cũ, ít dùng và vẫn giữ lại. Hai việc dùng chung được. |

## Phong cách hình ảnh

- Khung **1080×1920**, 9:16, **30 fps**. Đồ hoạ phẳng tự tạo: khung bảng, mười hai ô theo tháng, mũi tên, hộp lưu trữ. Một sơ đồ liên tục thay trạng thái theo tám nhịp; không chỉ thay thẻ chữ.
- Nền navy **#101827**; khung **#94A3B8**; chữ **#F8FAFC**; Partition **#38BDF8**; Archive **#FBBF24**; ô mờ **#64748B**. Dùng cả nhãn và đường viền để phân biệt trạng thái, không chỉ dựa vào màu.
- Font Windows **Segoe UI**; tiêu đề/hook **Segoe UI Bold 64 px**, thuật ngữ **60 px**, nhãn **48 px**, phụ đề **52 px**. Không thu chữ để nhồi nội dung; nhãn dài tách theo quy tắc dưới.
- Mọi chữ quan trọng trong **x=90–990, y=250–1500**. Tiêu đề/hook: **y=250–480** ở cảnh 1. Từ cảnh 2, dải **y=250–480** (chỉ còn “SQL” cố định) dùng cho chip khái niệm: “SQL” tại y=250–300, chip tại y=320–480. Dải **y=520–960** chỉ gồm sơ đồ, tên bảng, nhãn khung (kể cả “Minh hoạ”) và bộ đếm; không đặt chip khái niệm trong dải này. Phụ đề: **x=100–980, y=1000–1140**, tối đa hai dòng, có nền tối mờ. Cáo nằm dưới phụ đề; **y>1500** để trống. Hàng nhãn khung (y=520–568) và hàng bộ đếm (y=570–618) là toạ độ gợi ý: chữ 48 px có dấu cần khoảng 64 px mỗi hàng, nên Đạo diễn hình ảnh được dịch bảng chính và hộp lưu trữ xuống tối đa 40 px (đáy không quá y=960); giữ nguyên cỡ chữ, vùng an toàn và khoảng cách tới phụ đề ít nhất 40 px.
- Bảng chính: **x=100–690, y=620–920**; lưới bốn cột, ba hàng. Hộp lưu trữ: **x=730–980, y=620–920**, ngoài khung chính, không phải một phân vùng còn gắn trong bảng chính. Khung ngoài mang nhãn “Một bảng logic” ở đoạn Partition. Tên bảng “Đơn hàng” giữ nguyên khi chỉ chia phần.
- Mỗi nhãn độc lập tối đa **bốn từ**. Các chuỗi dài đã chốt được tách thành chip cạnh nhau hoặc hiện nối tiếp, giữ thứ tự đọc: “Vẫn đủ” + “12/12 phần”; “Có thể vẫn đọc” + “nhiều phần”; “Cách quản lý” + “dữ liệu”; “Không phải” + “lệnh SQL chuẩn”. Hai bộ đếm “Chính 9” và “Lưu trữ 3” đặt cạnh nhau với dấu “·”, giữ nội dung “Chính 9 · Lưu trữ 3”. Hook nguyên văn và phụ đề là câu, không phải nhãn sơ đồ.
- Ô **T1–T12** tương ứng mười hai tháng giả định trong cùng một năm. Mỗi ô là một **phần dữ liệu**, không phải một dòng. Gắn nhãn “Minh hoạ” xuyên suốt; mười hai, chín, ba chỉ là số phần trong ví dụ. Không suy ra dung lượng hoặc hiệu năng từ số ô.
- Tô sáng T11 khi lọc đúng cột chia; mờ ô khác nhưng không xoá chúng. Lọc cột khác làm cả mười hai ô sáng đồng thời, không ô nào bị làm mờ; không chạy nhanh/chậm để gợi tốc độ. Archive cho T1–T3 trượt ra ngoài khung; các ô giữ nguyên mã. Không có thao tác biến mất dữ liệu.

## Cáo và chuyển cảnh

Phán quyết riêng tập này thay bố cục dưới-giữa mặc định: **Cáo nhỏ ở góc trái dưới**, hộp giới hạn **x=90–360, y=1190–1490**, nhân vật cao tối đa **300 px** và không vượt chiều cao ảnh nguồn. Cách đáy tối thiểu **430 px**. Giữ toàn thân và đuôi trong hộp, phụ đề phía trên đầu. Không có cảnh ẩn Cáo; thu nhỏ ở cả tám cảnh, hiện đủ **39/39 giây**.

Chọn toàn bộ **ảnh tĩnh đã có**: `think` → `present_hand` → `point_up` → `shrug` → `point_right` → `point_right` → `clipboard` → `thumbs_up`. `present_hand` là tên dáng thật trong `docs/mascot.md`, dùng cho động tác trình bày được gợi ý bằng `point_present`; không truyền mã animation thành tên pose renderer. Tổng **sáu lần đổi dáng**, mặc định tại giây **3, 9, 14, 18, 28, 32**; khoảng cách ngắn nhất giữa hai lần đổi dáng là **4 giây (14→18, 28→32)**; `think` giữ **3 giây đầu**. Chỉ mốc 9 được dời theo dự phòng cảnh 2 bên dưới, vẫn sáu lần đổi. Không vẫy chào tự động, không nhép miệng. Nếu Đạo diễn chọn chuyển động thay ảnh tĩnh, chỉ dùng nguồn có sẵn 4–8 fps và giữ các mốc đổi dáng, kích thước, thời gian hiện.

Chuyển cảnh là đổi trạng thái sơ đồ ở đúng mốc; chuyển động ô 0,5–1 giây trong thời gian cảnh, không cộng thêm thời lượng. Nhịp cuối là diễn lại cùng ví dụ kết hợp, không chuyển thêm ba phần lần thứ hai.

## Âm thanh và phụ đề

- Chỉ **Minh Đức, nam miền Bắc**, theo `D:/Agent Video Studio/docs/voice.md`: VieNeu-TTS cục bộ, `temperature=0.65`, hậu kỳ tốc độ **1.08**, nghe kiểm sau xử lý. Các thông số này là chỉ dẫn sản xuất, không phải số đo của bản hiện tại.
- **Không nhạc nền.** Bản này không cần hiệu ứng âm thanh; mọi cảnh chỉ có lời đọc, khoảng nghỉ tự nhiên. Âm lượng mục tiêu **−14 LUFS**, true peak **≤ −1,5 dBTP**; AAC stereo, 48 kHz, tối thiểu 128 kbps.
- Lời trong bảng cảnh là nguồn sự thật cho lời và phụ đề. Ngắt từng câu/nhóm nghĩa, tối đa hai dòng, khoảng **32 ký tự/dòng**, không cắt giữa thuật ngữ hoặc “mười một”. Đồng bộ theo giọng thật, sai lệch mục tiêu **≤ 0,15 giây**. Dùng chữ chuẩn “SQL”, “Partition”, “Archive” trong phụ đề; cách đọc nằm riêng trong kịch bản.
- Xuất cả **phụ đề đốt cứng** và `captions.srt` UTF-8. Khoảng nghỉ sau câu có thể giữ phụ đề tối đa 0,3 giây; không để phụ đề cảnh trước tràn sang cảnh sau. Không phụ đề tự thêm lời giải thích ngoài bảng.
- Nhãn **“Có dùng AI”** tại **x=730–980, y=1460–1500**, font 40 px, hiện suốt. Mô tả cả ba nền tảng kết thúc bằng câu khai báo AI; `ai_generated_content=true` và `ai_disclosure` chứa đúng câu đó trong `publish.json`.

## Nguyên liệu cần

Chỉ dùng nguồn được cho phép trong `D:/Agent Video Studio/docs/asset-sources.md`.

| Nguyên liệu | Nguồn cụ thể | Cách dùng |
|---|---|---|
| Nền, khung, mũi tên, ô tháng, nhãn | Đồ hoạ tự tạo bằng Node/Python và ffmpeg có sẵn | Không dùng hình/clip ngoài; không dữ liệu khách hàng; không logo hãng |
| Bảy dáng Cáo | `D:/Agent Video Studio/brand/cao/poses/`: `think.png`, `present_hand.png`, `point_up.png`, `shrug.png`, `point_right.png`, `clipboard.png`, `thumbs_up.png` | Dùng đúng ảnh nguồn, không tự vẽ hoặc sửa nhận diện |
| Phông thường/đậm | `C:/Windows/Fonts/segoeui.ttf`, `C:/Windows/Fonts/segoeuib.ttf` | Đã có trên máy; kiểm đủ dấu khi dựng |
| Lời đọc | Minh Đức theo `D:/Agent Video Studio/docs/voice.md` | Tạo từ lời đã duyệt; giữ cách đọc thuật ngữ nhất quán |
| Thumbnail | Trích sơ đồ tự tạo, Cáo có sẵn | Chữ “Archive và Partition” / “Chia hay chuyển?”; giữ vùng an toàn |

Đã kiểm tra có các file ảnh và font nêu trên. Không thiếu nguyên liệu nên không phát sinh mục yêu cầu giám đốc cung cấp. Các đường dẫn web trong kịch bản là nguồn kiến thức, không phải nguồn tải hình.

## Tiêu chí nghiệm thu cho Producer

1. Đủ **tám cảnh**, mốc mặc định **0/3/9/14/18/24/28/32/39 giây**; chỉ được dời mốc 9 sang tối đa 10 theo dự phòng cảnh 2 bên dưới, cảnh 3 còn tối thiểu 4 giây. Tổng **39,00 giây**, sai số xuất tối đa một frame ở 30 fps. Chưa có số đo giọng thật ở giai đoạn viết; phải nghe và đo trước khi chốt dựng.
2. MP4 **1080×1920**, H.264 yuv420p, 30 fps cố định, faststart; audio AAC theo thông số trên; dung lượng **≤250 MB**. Mục tiêu loudness **−14±1 LUFS**, true peak **≤−1,5 dBTP**, không clip.
3. Hook đầy đủ và “SQL” hiện từ frame đầu; lời hook vào ngay giây 0, mục tiêu hoàn tất trong hai giây; chỉ dùng dự phòng đúng điều kiện ở `concept.md`. Không câu chào.
4. Có `captions.srt` và phụ đề đốt cứng đủ lời, đúng dấu; nghe kiểm cách đọc thuật ngữ và các câu điều kiện. Không chữ quan trọng ngoài vùng an toàn, không chồng Cáo/sơ đồ/phụ đề.
5. Cáo cao tối đa 300 px, có mặt ≥60% thời lượng (kế hoạch 100%), cách đáy ≥420 px, sáu lần đổi dáng đúng mốc, không nhép miệng. Tên dáng tồn tại trong thư viện.
6. T1–T12 còn đủ sau chia phần; chỉ T11 nổi bật ở ví dụ lọc đúng cột chia; ở cảnh lọc cột khác, cả mười hai ô sáng cùng lúc, không ô nào bị làm mờ. Sau archive: chính chín phần, lưu trữ ba phần; nhãn “Vẫn giữ lại” đọc được. Không biểu diễn việc bỏ qua là xoá dữ liệu.
7. Câu “có thể bỏ qua” đi cùng điều kiện lọc đúng cột chia; không hứa tăng tốc. Archive được giải thích là cách quản lý, nơi lưu tuỳ hệ thống. Mọi nhãn sơ đồ ≤4 từ; không thêm nội dung đã bỏ trong phán quyết vào hình hay lời.
8. Trong `ep01/final/` đủ `<video_id>_9x16.mp4`, `thumbnail.jpg`, `captions.srt`, `publish.json`. Metadata đủ **TikTok, Facebook Reels, YouTube Shorts**, mỗi nền tảng 3–5 hashtag, tiêu đề YouTube ≤100 ký tự, mọi mô tả kết thúc đúng khai báo AI. Không tạo file publish ở lượt viết này.
9. Producer chạy kiểm video/publish của xưởng, ghi số đo thực vào ghi chú sản xuất; xem khung thật tại đầu và giữa mỗi cảnh, nghe toàn bộ trước khi gửi review. Không coi kế hoạch này là bằng chứng đã đạt QC.

## Rủi ro & dự phòng

| Rủi ro | Cách xử lý trong phạm vi đã chốt |
|---|---|
| Hook hoặc lời vượt ô thời gian | Đo sau xử lý giọng; tạo lại nhịp câu, bỏ khoảng nghỉ dư; hook dùng đúng câu dự phòng nếu >2,2 giây. Nếu vẫn không vừa, trả người review kịch bản, không tự cắt điều kiện hay tăng tốc thêm |
| Riêng lời cảnh 2 dài hơn 5,8 giây sau xử lý | Được dời mốc 9 giây sang tối đa 10 giây bằng cách lấy từ cảnh 3; cảnh 3 còn tối thiểu 4 giây và phải vừa lời thật. Dời cả mốc đổi dáng `present_hand` → `point_up` tại giây 9 tương ứng; giữ các mốc khác, sáu lần đổi dáng, toàn bộ lời và tổng 39 giây. Canh chip/phụ đề theo mốc mới, ghi mốc thực dùng vào ghi chú sản xuất. Nếu vẫn không vừa, trả người review |
| Sơ đồ chật hoặc nhãn dài | Hiện chip nối tiếp theo bảng cảnh, giữ font; Cáo nhỏ 300 px; không lấn vùng phụ đề |
| Ô sáng gợi ý nhanh hơn chắc chắn | Nhãn “Minh hoạ”; chỉ đổi độ sáng đồng thời; không đồng hồ, không tỷ lệ tốc độ |
| Archive bị hiểu là xoá hoặc luôn ra ngoài CSDL | Ô giữ mã khi chuyển; “Vẫn giữ lại”; hai bộ đếm chín/ba; nhãn nơi lưu tuỳ hệ thống; đây là hộp logic, không phải máy chủ vật lý |
| Người xem tưởng archive bắt buộc phải partition trước | Ghi rõ trong mô tả: Archive có thể dùng độc lập; ví dụ cuối chỉ cho thấy khả năng kết hợp |
| Thuật ngữ TTS sai hoặc nuốt dấu | Nghe kiểm SQL/Partition/Archive riêng và trong câu; dùng bảng cách đọc, giữ chính tả chuẩn trên hình |
| Cáo mềm khi phóng | Chỉ dùng ảnh tĩnh tối đa 300 px, không upscale; không dùng pack frame chưa QC |
| Hiểu ví dụ thành dữ liệu đo thật | “Minh hoạ” xuyên suốt; giải thích T là tháng trong cùng một năm, bộ đếm tính phần dữ liệu, không phải số dòng hay dung lượng |
