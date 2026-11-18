# Kế hoạch bộ video — IT · chủ đề 4

Bản sửa, vòng 2 · 18/11/2026 · team_id: 4 · Chờ Claude review. Nguồn ràng buộc: `brief.md`, phần **Phán quyết cuối** của `debate.md`, các tài liệu dự án được chỉ định. Chỉ lập kế hoạch/kịch bản trong lượt này.

## Tập và cách dựng

| Mã video | Thư mục | Tên tập | Mục tiêu | Thông điệp chính |
|---|---|---|---|---|
| IT-T4-E01 | ep01 | Báo cáo đang đợi, hóa đơn phải còn | 32,9 s (khoảng 32–34 s); trần 40,0 s | Partition chia một bảng; archive cất dữ liệu cũ, cần đường tra lại. Chia không tự nén/xóa; lợi ích pruning phụ thuộc điều kiện lọc. |

`renderer: "pillow-ffmpeg"`

`renderer_reason: "Theo phán quyết cuối: cần phiến biến thành lưới 2 × 3, nối điều kiện với các khối, thay trạng thái từng khối, chuyển chính T1 sang kho và kéo hóa đơn ra. ExplainerScene chỉ biểu đạt chuỗi bước nối mũi tên, không biểu đạt đúng các quan hệ/chuyển động này. Dùng đồ họa tự tạo bằng Pillow và ghép/hoạt ảnh FFmpeg; không thay bằng thẻ chữ tĩnh."`

Đây là chỉ định thiết kế theo tranh luận đã chốt, không phải báo cáo đã chạy renderer. Đạo diễn hình ảnh chuyển thành storyboard, Claude duyệt trước sản xuất. Không cần cảnh quay, stock, ảnh hãng, logo hay ảnh AI mới.

## Hình ảnh, màu và chữ

Phong cách mô phỏng công sở bằng phiến dữ liệu, thẻ và ngăn lưu có hình khối đơn giản. Nền navy `#101828`, mặt thẻ `#FFFFFF`, chữ sáng `#F8FAFC` trên nền tối, chữ tối `#101828` trên mặt sáng. Màu cam của mascot là nhận diện, không dùng làm tín hiệu dữ liệu đúng/sai.

| Màu trạng thái | Hex | Nghĩa xuyên video | Hình phụ để không chỉ dựa vào màu |
|---|---|---|---|
| Xanh lá | #22C55E | Khối đang được đọc/chọn trong ví dụ | Đường nối đi vào khối và hàng dữ liệu đi ra |
| Xám | #667085 | Khối được bỏ qua ở bước lọc tháng | Không có đường đọc; hàng bên trong vẫn nguyên |
| Vàng | #FACC15 | Chưa loại được khối từ điều kiện khách | Đường nối phân nhánh tới cả sáu khối; không vẽ quét mọi dòng |
| Đỏ | #EF4444 | Kết quả trống tại nơi đang tìm | Khay rỗng và biểu tượng kính lúp, không làm dữ liệu tan biến |
| Xanh dương | #60A5FA | Giữ lại/chuyển nơi lưu/kho lưu | Ngăn lưu có T1 nguyên vẹn và thẻ chỉ dẫn |
| Trắng | #FFFFFF | Trung tính; giữ nguyên, chưa xét | Viền/hàng dữ liệu trung tính |

- Canvas 1080 × 1920, 30 fps; vùng quan trọng **x = 90–990, y = 250–1500**. Không đặt thông tin cần đọc vào đáy hoặc dải nút bên phải.
- Font **Segoe UI**, chữ khóa Semibold **80 px**, tối thiểu 72 px; nhãn/mã **56–64 px**. Đủ dấu. Một chip tối đa ba từ.
- Khung “MỘT BẢNG” từ **2,0 đến hết 18,0 s**, không mất nhãn khi đổi truy vấn/tìm hóa đơn. Khung **x = 100–980, y = 250–930**; lưới 2 cột × 3 hàng **x = 130–950, y = 330–930, cao 600 px**. T1/T2 hàng trên, T3/T4 hàng giữa, T5/T6 hàng dưới. Khoảng hở 24 px, khối 398 × 184 px. Không gọi sáu khối là sáu bảng.
- Nhãn khung x = 130–550, y = 250–326; một chip điều kiện hoặc tin sếp x = 590–950, y = 250–326; riêng dải đầu khung dùng chữ 72 px. Ô tìm mã hóa đơn ở 13–18 s thay chip, nổi trên lưới x = 250–900, y = 440–640, không che nhãn khung; các khối phía sau vẫn thấy. Khi dựng kiểm hộp bao chữ thật, không dùng tọa độ đường cơ sở làm hộp chữ.
- **Ngân sách ba nhóm chữ:** (1) nhãn khung; (2) sơ đồ lưới, các mã T gắn vào từng ô trong cùng một cụm; (3) một chip điều kiện HOẶC tin sếp HOẶC ô tìm. Không hiển thị cả hai chip cùng lúc. Không tính phụ đề/nhãn AI. Không gộp các dòng rời ở nhiều góc vào một nhóm để lách giới hạn.
- Hook có ba nhóm: “Vào họp rồi!”, “Tình huống dựng”, nhãn “Đơn hàng” gắn trên phiến. Không thêm tiêu đề đầu video.
- Sau 18 s, ba nhóm tối đa: nhãn nơi đang minh họa, thẻ chỉ dẫn, mã hóa đơn. Khi chuyển cảnh, xóa nhóm cũ trước khi thêm nhóm mới; không chồng chữ trong dissolve.
- Chốt là hai thẻ định nghĩa: “Partition: chia bảng” một dòng; “Archive: cất dữ liệu cũ” chia dòng **“Archive: cất” / “dữ liệu cũ”**. Mỗi dòng ≤ 3 từ, dùng ≥ 72 px; cả hai thẻ là hai nhóm. Không đọc lại chốt bằng lời. Nhãn “Archive” chỉ viết hoa đầu câu theo nguyên văn, không viết toàn chữ hoa.
- Nhãn **“AI tạo”** 56 px, x = 820–990, y = 1430–1490 suốt video. Không đụng Cáo/phụ đề.

## Cáo và bố cục theo đoạn

Chiều cao dưới đây là **hộp hình nhân vật nhìn thấy**; kiểm PNG alpha thực, không chỉ kích thước canvas trong suốt. Cáo đứng đáy y = 1480 ở hook/cảnh kho, đáy y = 1500 ở cảnh lưới, cách đáy tương ứng 440/420 px; phụ đề nằm phía trên đầu. Tâm ngang dự kiến x ≈ 570, căn hộp alpha để mép phải ≤ 800 và không chạm nhãn AI x 820–990. Dáng tĩnh đổi bằng cắt, cách nhau ≥ 2 s, không nhép miệng. Bố trí này là quyết định riêng tập, không phải luật mascot chung.

| Đoạn | Kích thước/vị trí | Hành vi gắn với vật |
|---|---|---|
| 0–2,0 s | Cao 480 px, y = 1000–1480 | `surprised` quay về laptop/phiến đang chờ; không vẫy chào. Laptop là đạo cụ cạnh Cáo, không che bảng. |
| 2,0–10 s | **Thu nhỏ cao 380 px**, y = 1120–1500 | Giữ `surprised` đến 2,2 s rồi `point_up` chỉ T6 phía trên bên phải Cáo; từ 5,0 s `point_right` chỉ chip tháng → T6, đích ở bên phải Cáo. Giữ dáng qua cảnh khách, chỉ nhánh ở bên phải Cáo rồi nhìn các nhánh còn lại và báo cáo về sếp. |
| 10–13 s | Cao 380 px, cùng vị trí | `read_paper` từ 10,0 s đối chiếu các thẻ trong T1 được kéo ra rồi trả lại; khối T1 giữ nguyên. Không thêm bảng phụ có chữ. |
| 13–18 s | Cao 380 px, cùng vị trí | `laptop_typing` từ 13,0 s khi nhập mã; từ 16,0 s `think` nhìn khay tìm trống. |
| 18–21,6 s | Cao 450 px, y = 1030–1480 | `clipboard` từ đúng 18,0 s, cách `think` đúng 2,0 s. Cáo đặt/lật thẻ chỉ dẫn: thẻ đồ họa tách từ phía kẹp giấy đi lên vùng chính; không đòi hoạt ảnh bàn tay mới. Cáo hiện suốt 18–23 s. |
| 21,6–25,25 s | Cao 450 px, cùng vị trí | `point_left` từ 21,6 s chỉ thẻ/đầu đường tra đặt bên trái Cáo (x = 130–450); đích ở bên trái Cáo. `read_paper` từ 23,8 s đón hóa đơn tìm thấy. |
| 25,25–29,95 s | Cao 450 px, cùng vị trí | Giữ `read_paper`; `shrug` từ 26,1 s nhìn hai cách lưu minh họa. Đưa hóa đơn về ngăn trước cảnh chốt. |
| 29,95–32,9 s | Cao 450 px, cùng vị trí | `thumbs_up` từ 29,95 s cạnh hai vật đã ghép đúng; giữ dáng, không thêm nhún/bounce khi đọc chốt. |

Cáo hiện dự kiến **32,9/32,9 s (100%)**. Các lần bắt đầu dáng: **0; 2,2; 5,0; 10,0; 13,0; 16,0; 18,0; 21,6; 23,8; 26,1; 29,95 s**; khoảng nhỏ nhất **2,0 s**. Không có cảnh ẩn Cáo. Không cần chuyển động tay mới/đi bộ/nhép miệng. Producer căn hướng pose thật; đưa đích tới đúng phía tay, không lật chữ trong PNG.

Vật chính: hook phiến đơn hàng **y = 250–830 cao 580 px**; đoạn 2–18 s lưới **y = 330–930 cao 600 px**; 18–23,4 s cụm đường chuyển/cửa kho **y = 250–850 cao 600 px**; 23,4–29,95 s cửa kho cùng hóa đơn và 29,95–32,9 s hai thẻ kết/hóa đơn cùng nằm **y = 250–850 cao 600 px**. Riêng hóa đơn khi ở trong ô T1 nhỏ hơn ngưỡng vì là chi tiết của lưới; khi thành tiêu điểm nó được đưa ra cao **560 px**, không bắt người xem đọc mã thu nhỏ. Thu nhỏ Cáo ở 2–18 s để dành chỗ cho lưới và phụ đề; các cảnh khác trở lại 450/480 px theo bảng.

## Nhịp hình, định hướng và bìa

Mỗi hàng cảnh trong script có `main_change`, mốc con tối đa cách nhau 1,5 s. Trong cảnh dài, vật chuyển trên quãng lớn, quan hệ đường nối đổi hoặc hàng dữ liệu ra/vào; chip/pose/zoom nhỏ không được tính. Không thiết kế hold tĩnh > 2 s. Đường chuyển T1 có vệt nối hình học, không hiệu ứng tan dữ liệu. Không để khối đang chuyển che mã các khối khác.

Video > 30 s nên đã cân nhắc 2–4 chip chương. **Không thêm chip chương riêng**: 2–18 s đã dùng ngân sách ba nhóm cho nhãn một bảng/lưới/điều kiện. Định hướng bằng hai pha vật thể liên tục: chia lưới → chuyển và tra đúng T1; cuối video hai thẻ gom ý. Không thêm chip chương rồi thu chữ còn quá nhỏ. Cặp “tháng”/“khách” là chip điều kiện, không tính là chương.

Thumbnail dùng khung hook **1,7 s** (cửa sổ ổn định 1,6–1,9 s, trước viền một bảng lúc 2,0 s): Cáo bất ngờ, laptop, phiến đơn hàng và tin **“Vào họp rồi!”**. Giữ “Tình huống dựng” và “AI tạo”. Riêng bìa, nhãn “Tình huống dựng” dùng 72 px, chia hai dòng “Tình huống” / “dựng”; nhãn AI vẫn 56 px. Không có lưới, không thêm khẩu hiệu/bảng so sánh. Tin sếp 90 px nếu cần, bố trí trong 2 dòng; mở ở **180 × 320** để kiểm thấy tình huống và đọc được tin chính.

## Âm thanh, giọng và phụ đề

- **Không nhạc nền**. Minh Đức, giọng nam Bắc, VieNeu-TTS v3 Turbo cục bộ theo `docs/voice.md`; `temperature=0.65`, hậu kỳ chuẩn **atempo=1.08 một lần**. Không tăng thêm để bù thời lượng. Sếp/kế toán không có thoại, không cần giọng thứ hai.
- Hiệu ứng tự tạo tối giản: 0 s tiếng báo tin ngắn, 15,7 s click tìm, 23,4 s tiếng chạm giấy. Mỗi hiệu ứng ≤ 0,2 s, nhỏ hơn giọng ≥ 12 dB tại chỗ trùng; có thể bỏ nếu che âm tiết. Không âm thanh stock.
- Mục tiêu mix khoảng −14 LUFS, true peak ≤ −1,5 dBTP. Tiếng rõ hơn hiệu ứng, không khoảng nhạc lấp chỗ trống.
- Phụ đề là bản chép lời duy nhất: Segoe UI Semibold **56 px**, trắng viền tối 3 px, line-height 64 px, tối đa hai dòng, x = 100–980. **0–2,0 s: y = 840–980; 2,0–18 s: y = 950–1090; 18–32,9 s: y = 860–1000.** Phụ đề ở trên đầu Cáo và dưới vật chính, cách mỗi lớp ít nhất 10 px. Cáo không chạm nhãn AI ở góc phải. Không dùng MarginV mặc định của một bố cục mascot khác.
- Phụ đề cắt theo cụm nghĩa 4–8 từ, không hiển thị cả câu dài trong một lần. Tách câu đầu và câu ích lợi thành các cue nối tiếp, giữ nguyên chữ. Viết “archive”, “SQL” trong phụ đề; bản TTS thay cách đọc theo script.
- Mốc 32,9 s là dự kiến, **chưa tạo/đo/nghe TTS**. Bảng ước lượng từng lời nằm ở `ep01/script.md`: 129 âm tiết dự kiến, tốc độ hiệu dụng 4,6 âm tiết/s (lời 2 giả định 4,8), gồm khoảng nghỉ nội câu. Đây là giả định, không phải số đo giọng.
- Lời 6 từ 13,0 s; lời 7 từ 14,8 s; hỏi 17,7–19,15 s; chỉ dẫn 19,3–21,45 s; đường tra 21,6–23,25 s; trả lúc 23,4 s; gọi tên archive và giới hạn 25,25–29,8 s. **CTA bắt đầu 29,95 s, dứt dự kiến 32,55 s; đuôi im 0,35 s**, tối đa 0,7 s. Không thiết kế khoảng lặng ≥ 0,8 s.
- **Mốc sẽ được duyệt lại sau đo TTS thật** bởi Kịch bản/Đạo diễn hình ảnh. Producer đo từng lời, giữ nhịp tự nhiên và dời mốc hình theo lời; tổng chuẩn 15–45 s, trần riêng tập 40 s. Không tăng atempo thêm, không giữ mốc cũ gây dư im. Nếu phát sinh lặng ≥ 0,8 s có mục đích và hình đang đổi đáng xem, ghi giây/lý do vào `notes.md` rồi duyệt lại; không có ngoại lệ dự kiến ở bản viết.
- Lời ích lợi bản đầy đủ phải dứt ≤ 4,9 s. Nếu đo TTS chuẩn vượt 4,9 s, kích hoạt bản dự phòng Claude đã duyệt ở review vòng 2: **“Chia theo tháng, máy bỏ qua được phần không cần.”** (10 âm tiết). Giữ hình và lời 3 về điều kiện; đồng bộ phụ đề. Nếu bản dự phòng vẫn vượt, trả Kịch bản/Claude xử lý, không tăng tốc. Không dùng đồng thời hai bản.

## Nguyên liệu cần

Chỉ các loại có trong `docs/asset-sources.md`:

| Nguyên liệu | Nguồn được phép / yêu cầu |
|---|---|
| Cáo `surprised`, `point_up`, `point_right`, `point_left`, `clipboard`, `read_paper`, `laptop_typing`, `think`, `shrug`, `thumbs_up` | `D:/Agent Video Studio/brand/cao/poses/`, bộ dáng có sẵn; ghép lớp bằng công cụ cáo của dự án; không vẽ lại mascot |
| Phiến/lưới T1–T6, laptop, tin sếp, silhouette sếp/kế toán, hóa đơn, ngăn lưu, thẻ chỉ dẫn, kính lúp | Đồ họa hình khối tự tạo bằng Pillow/FFmpeg từ Node/Python đã có; không dùng ảnh chụp app hay logo |
| Phông chữ | Segoe UI từ Windows; Arial là dự phòng đủ dấu cùng ngưỡng cỡ |
| Giọng | VieNeu-TTS v3 Turbo cục bộ, Minh Đức theo tài liệu giọng; không dịch vụ trả phí |
| Hiệu ứng | Tự tạo bằng FFmpeg, chỉ ba âm ngắn đã chỉ định; có thể bỏ |
| Tài liệu kỹ thuật | Nguồn PostgreSQL/MySQL cuối script; dùng để kiểm nội dung, không lấy screenshot làm tài sản |

Không dùng file `library/` nào trong thiết kế này. Không yêu cầu tải stock, tạo ảnh mới, hoặc ghi vào thư mục chung. Producer ghi dấu vết tài sản trong `ep01/notes.md`; với mascot AI đã có, tham chiếu nguồn bộ gốc thay vì ghi nhận là ảnh mới tự tạo.

## Cần giám đốc cung cấp

**Không thiếu tài sản bắt buộc theo thiết kế.** Nếu máy sản xuất thiếu mô hình/giọng Minh Đức hoặc file pose, Producer ghi đúng file thiếu và báo điều phối; không tự mua dịch vụ hay đổi mascot/giọng. Mức kiểm nguồn SQL đã được Claude chấp nhận trong `review/script-r1.md`: không yêu cầu giám đốc mua chuẩn ISO; ghi rõ giới hạn đối chiếu ở cuối script.

## Tiêu chí nghiệm thu

| Trục | Điều đo/kiểm và bằng chứng cần có |
|---|---|
| Kỹ thuật | MP4 9:16 1080 × 1920, H.264 yuv420p + AAC 48 kHz ≥ 128 kbps, 30 fps cố định, faststart, ≤ 250 MB; thời lượng mục tiêu 32,9 s (khoảng 32–34 s), bắt buộc 15–40 s; lưu ffprobe/QC thật |
| Âm thanh | Không nhạc, audio có giọng; khoảng −14 LUFS, true peak ≤ −1,5 dBTP; kiểm âm phát âm thật, chưa nghe ghi CHƯA KIỂM |
| Lời và thời gian | Hook bắt đầu 0 s, sự cố thấy trước 2 s; câu ích lợi dứt < 5 s; hỏi ≈ 17,7 s, T1/hóa đơn ở kho trả ≈ 23,4 s; CTA từ 29,95 s; đuôi im ≤ 0,7 s; mốc điều chỉnh theo TTS được duyệt |
| Chữ và đồ họa | Đủ dấu, không chồng; ≤ 3 nhóm ngoài phụ đề/AI; từ khóa ≥ 72 px, mã ≥ 56 px; lưới 600 px; khung MỘT BẢNG liên tục 2–18 s; xem thật 360 × 640 |
| Trải nghiệm | Có thay đổi vật/quan hệ trong mọi khoảng ≥ 1,5 s; không tính đổi pose/chip đơn độc; Cáo có tương tác, không che vật; giữ đúng mã HĐ 4721; không tan mất dữ liệu |
| Kết và bìa | Hai câu chốt đúng nguyên văn, CTA tự nhiên đúng lời; thumbnail từ hook đọc ở 180 × 320, không lưới nhiều nhãn |
| Tuân thủ | Nhãn AI suốt video; ví dụ dựng rõ; nguồn chính thức gắn từng phát biểu; điểm chưa chắc vẫn đánh dấu, Claude xử lý trước duyệt; không hứa tăng tốc/giải phóng ổ |
| Gói bàn giao khi sản xuất | `ep01/final/IT-T4-E01_9x16.mp4`, `thumbnail.jpg`, `captions.srt`, `publish.json` có metadata cho TikTok/Facebook Reels/YouTube Shorts, 3–5 hashtag mỗi nơi, `ai_generated_content=true`, `ai_disclosure` là câu cuối mô tả cả ba; chạy qc-video và qc-publish |

Không tuyên bố đã đạt các kiểm tra bản dựng khi mới có kịch bản. R1–R8 là ngưỡng thử, rà lại sau ba video; chưa có dữ liệu giữ chân.

## Rủi ro và dự phòng

- **Câu pruning quá tuyệt đối:** định nghĩa “bỏ qua” ở đây là bỏ partition theo điều kiện tháng phù hợp; mô hình khách độc lập với tháng. Vàng không phải kết luận quét mọi dòng; index/kế hoạch có thể khác. Claude kiểm câu giữ nguyên phán quyết trong phạm vi ví dụ.
- **Chuyển T1 bị hiểu là một lệnh tự động:** không vẽ mã SQL; thẻ “Chuyển nơi lưu” và “Ví dụ” ở cảnh chuyển, giữ mã hóa đơn; đây là một cách archive minh họa, không bắt buộc kho vật lý riêng.
- **Nhầm archive với engine MySQL:** không viết toàn chữ hoa trên hình; không thêm tính năng nén của engine vào lời. Không nêu engine trong metadata vì không cần cho thông điệp.
- **Lộ đáp sớm:** 13–23,4 s chỉ thấy đường chuyển khuất/cửa chưa mở; nhãn Kho lưu và mã bên trong xuất hiện đúng 23,4 s. Hình vẫn chuyển và có lời chỉ dẫn, không kéo dài màn trống.
- **Đọc không kịp:** tách cue, xóa nhóm chữ cũ trước khi thêm; giữ lưới lớn, thu nhỏ Cáo theo bố cục cuối. Không thu chữ dưới ngưỡng.
- **TTS không khớp:** duyệt lại sau đo, không thêm tốc độ. Câu chuẩn SQL đã đóng điểm kiểm nguồn theo review, với giới hạn ghi rõ: mỗi hệ mỗi cách có nguồn; chưa đối chiếu ISO/IEC 9075, kết luận dựa trên tài liệu các hệ chính.
