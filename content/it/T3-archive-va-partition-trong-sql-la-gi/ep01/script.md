# IT-T3-E01 — Archive và Partition: chia hay chuyển?

**Bản sửa vòng 2 — Claude đã duyệt (xem `../review/script-r2.md`)**, theo `../review/script-r1.md`. team_id 4 · IT · Đội 3 · tập 01 · **39 giây**, tám cảnh. Concept: **“Cùng dữ liệu, hai việc khác nhau”**. Không dựng video hoặc viết code ở lượt này.

> **Đường dựng (Claude gỡ vướng, 18/11/2026):** dùng Pillow + FFmpeg, không dùng Remotion `producer.mjs`; chi tiết trong `../plan.md` (mục "ĐƯỜNG DỰNG ĐÃ CHỐT") và `notes.md` ("Hướng dẫn từ Claude"). Lời, chữ và mốc của file này không đổi.

## Chỉ dẫn đọc và phụ đề

Một giọng duy nhất: **Minh Đức, nam miền Bắc**, theo `D:/Agent Video Studio/docs/voice.md` (temperature 0.65, tốc độ hậu kỳ 1.08). Nghe thử là bước bắt buộc khi sản xuất; bản viết chưa đo thời lượng TTS.

| Chữ chuẩn trên hình/phụ đề | Cách đọc dự kiến cho TTS | Ghi chú nghe kiểm |
|---|---|---|
| SQL | “ét kiu eo” | Đọc từng chữ cái, nhất quán; không đọc thành một từ |
| Partition | Thử theo thứ tự: “pa-ti-sần” → “pờ-ti-sần” → viết nguyên chữ Latin “Partition” | Bắt buộc nghe thử riêng và trong câu; người nghe thử chọn bản rõ, đúng phát âm |
| Archive | Thử theo thứ tự: “ác-kaiv” → “a-kaiv” → viết nguyên chữ Latin “Archive” | Bắt buộc nghe thử riêng và trong câu; kiểm âm cuối, không đọc “a-chi-vê” |

Cách đọc là hướng dẫn âm, không thay chính tả trong phụ đề. Nếu pipeline cần văn bản phiên âm cho giọng, giữ một bản phụ đề riêng theo chữ chuẩn bên dưới. “SQL” trong hook chỉ hiện trên hình; được đọc trong câu “Không phải lệnh SQL chuẩn.” Số trong lời đọc viết bằng chữ.

Lời và chữ hook tại giây 0: **“Bảng lớn: chia ra hay chuyển bớt?”** Mục tiêu lời kết thúc trước giây 2. Nếu lời sau xử lý dài hơn 2,2 giây, thay duy nhất lời/phụ đề hook bằng **“Bảng lớn: chia hay chuyển?”**; chữ lớn trên hình giữ đủ câu. Trường hợp 2–2,2 giây: tạo lại nhịp đọc để đạt hai giây. Không tự thêm lời mở đầu.

## Quy ước hình và chữ chính xác

- Theo bố cục `../plan.md`: tiêu đề/hook y=250–480 ở cảnh 1. Từ cảnh 2, dải y=250–480 (chỉ còn “SQL” cố định tại y=250–300) dùng cho chip khái niệm tại y=320–480; dải y=520–960 chỉ gồm sơ đồ, tên bảng, nhãn khung (kể cả “Minh hoạ”) và bộ đếm. Phụ đề y=1000–1140, Cáo góc trái dưới y=1190–1490, cao tối đa 300 px. Mọi chữ quan trọng cách lề ít nhất 90 px, không thấp hơn y=1500. Hai hàng nhãn khung (y=520–568) và bộ đếm (y=570–618) là toạ độ gợi ý: chữ 48 px có dấu cần khoảng 64 px mỗi hàng, nên Đạo diễn hình ảnh được dịch bảng chính và hộp lưu trữ xuống tối đa 40 px (đáy không quá y=960) để hai hàng đủ cao; giữ nguyên cỡ chữ, vùng an toàn và khoảng cách tới phụ đề ít nhất 40 px.
- **Chữ cố định tất cả cảnh:** “SQL” ở dải tiêu đề; “Minh hoạ” phía trên sơ đồ; “Có dùng AI” ở x=730–980, y=1460–1500. Chữ cố định này cộng với cột chữ trong bảng là toàn bộ chữ được phép xuất hiện; không đọc thêm.
- `+` trong cột chữ nghĩa là **nhãn độc lập**, không in ký hiệu cộng hay dấu ngoặc kép. `→` trong mô tả là hướng chuyển, không phải chữ. `<br>` trong ô chữ chỉ ngắt dòng. Nhãn dài từ phán quyết được ghép từ các chip ≤4 từ, theo thứ tự đọc trái sang phải rồi trên xuống dưới. Hook và phụ đề giữ câu đầy đủ.
- Mã ô: **“T1”, “T2”, “T3”, “T4”, “T5”, “T6”, “T7”, “T8”, “T9”, “T10”, “T11”, “T12”**. T là tháng; chỉ là ví dụ mười hai tháng trong cùng một năm, không số liệu thật. Mỗi ô là một phần dữ liệu, không phải một dòng. Không hiện năm hoặc số bản ghi tự bịa.
- Cảnh 2–4 giữ tên bảng **“Đơn hàng”**, khung bao **“Một bảng logic”**, toàn bộ mã ô. Cảnh 5–7 giữ “Đơn hàng” trên khung chính, mã T4–T12 trong khung; mã T1–T3 nằm trong hộp “Lưu trữ”. Nhãn khác chỉ sống trong cảnh được chỉ định. Không dùng cú pháp SQL trên sơ đồ.
- Cáo dùng ảnh tĩnh có tên trong thư viện `D:/Agent Video Studio/brand/cao/poses/`. `present_hand` là dáng trình bày có thật, chọn thay gợi ý chuyển động `point_present`. Không nhép miệng; không bật phần vẫy chào tự động.

## Bảng cảnh

| Thời gian | Hình ảnh/đồ hoạ | Chữ trên màn hình (đúng từng chữ) | Lời đọc/phụ đề (đúng từng chữ) | Cáo (tên dáng) | Âm thanh |
|---|---|---|---|---|---|
| **00:00–00:03** · 3 giây | Frame đầu đã có hook, SQL và Cáo. Bảng lớn gồm lưới mười hai ô T1–T12; hai mũi tên rẽ ra chỉ hai thao tác, chưa chuyển ô nào. Không đếm ngược. [N1] | Hook hai dòng: “Bảng lớn: chia ra<br>hay chuyển bớt?”; tên bảng “Đơn hàng”; hai nhãn “Chia ra” + “Chuyển dữ liệu cũ”; mã T1–T12. | Bảng lớn: chia ra hay chuyển bớt? | `think`, giữ 0–3; góc trái dưới, cao ≤300 px. | Minh Đức vào ngay giây 0; nghỉ sau hook. Không nhạc, không SFX. |
| **00:03–00:09** · 6 giây | Bỏ nhánh hook; các đường chia lưới rõ lên, cùng một khung ngoài luôn bao đủ mười hai phần. Không ô nào rời khung. Tên bảng giữ nguyên. Cụm nghĩa hiện theo lời trước nhãn một bảng logic. [N1] | 3–5,8 giây: “Partition” + “Phân vùng” + “Chia nhiều phần”. 5,8–9 giây: “Một bảng logic” + “Vẫn đủ” + “12/12 phần”. Giữ “Đơn hàng” và mã ô. | Chia ra gọi là Partition, tức phân vùng.<br>Là chia bảng thành nhiều phần.<br>Vẫn chung một tên bảng, dữ liệu vẫn đủ. | `present_hand`, đổi tại giây 3; giữ đến 9. | Minh Đức; nghỉ ngắn giữa ba câu. Không nhạc, không SFX. |
| **00:09–00:14** · 5 giây | Ví dụ bảng chia theo cột tháng: chip “Chia theo tháng” hiện trước yêu cầu “Tháng 11”. “Tháng 11” là giá trị lọc trên cột chia theo tháng, không phải hàm trên cột ngày; không vẽ biểu thức SQL. Chỉ T11 sáng xanh và viền dày; mười một ô khác mờ nhưng còn đủ. Khung logic và tên bảng không đổi. Đó là phạm vi đọc minh hoạ, không so sánh thời gian. [N1, N2] | “Chia theo tháng” + “Tháng 11”; sau đó thay chip yêu cầu bằng “Lọc đúng cột chia”; giữ “Một bảng logic”. | Sếp cần tháng mười một?<br>Lọc đúng cột chia.<br>Máy có thể bỏ qua phần khác. | `point_up`, đổi tại giây 9; giữ đến 14. | Minh Đức; nhấn nhẹ “đúng” và “có thể”. Không nhạc, không SFX. |
| **00:14–00:18** · 4 giây | Giữ bảng chia theo tháng, thay yêu cầu thành lọc trạng thái. Cả mười hai ô sáng cùng lúc, không ô nào mờ. Không cho ô chạy hoặc hiện đồng hồ. [N1, N2] | “Lọc theo trạng thái”; bên dưới là hai chip “Có thể vẫn đọc” + “nhiều phần”. Giữ “Một bảng logic”. | Lọc cột khác, có thể vẫn đọc nhiều phần. | `shrug`, đổi tại giây 14; giữ đến 18. | Minh Đức; nghỉ đủ để nhìn nhiều ô. Không nhạc, không SFX. |
| **00:18–00:24** · 6 giây | Trả độ sáng các ô về bình thường. Mở hộp lưu trữ bên phải, **ngoài khung chính**. T1–T3 màu vàng trượt sang hộp, giữ mã; T4–T12 ở lại. Đây là minh hoạ nơi lưu logic, không phải biểu tượng máy chủ ngoài CSDL. Archive có thể thực hiện độc lập; việc dùng lại sơ đồ giúp so sánh. [N3] | 18–20,5 giây: “Archive” + “Lưu trữ” + “Chuyển để giữ”. 20,5–24 giây: “Cũ, ít dùng”; sau chuyển giữ “Đơn hàng”, “Lưu trữ” và các mã ô đúng vị trí. | Chuyển bớt gọi là Archive, tức lưu trữ.<br>Dữ liệu cũ, ít dùng sang nơi riêng. | `point_right`, đổi tại giây 18; giữ đến 28. | Minh Đức; nhịp chuyển ô theo câu thứ hai. Không nhạc, không SFX. |
| **00:24–00:28** · 4 giây | Giữ kết quả: chín phần trong bảng chính, ba phần tại nơi lưu trữ; đường viền hộp và mã ô rõ. Hai bộ đếm cạnh nhau tại y=570–618, phía trên các ô, dưới hàng tên bảng/nhãn khung y=520–568; chúng đếm phần minh hoạ, không đo dung lượng. Chip khái niệm ở y=320–480. Nơi lưu có thể là bảng riêng cùng CSDL hoặc hệ thống khác. [N1, N3] | Giữ hai bộ đếm cạnh nhau: “Chính 9” · “Lưu trữ 3”. 24–26 giây: “Vẫn giữ lại”; 26–28 giây: thay bằng “Tuỳ hệ thống”, canh chuyển theo lời thật. Tối đa ba chip hiện cùng lúc: hai bộ đếm và một chip khái niệm; không tính tên bảng, nhãn khung, mã ô và chữ cố định. | Vẫn giữ lại.<br>Nơi lưu tuỳ hệ thống. | Giữ `point_right`; **không đổi dáng tại giây 24**. | Minh Đức; giữ khoảng nghỉ để đọc bộ đếm. Không nhạc, không SFX. |
| **00:28–00:32** · 4 giây | Sơ đồ kết quả giữ nguyên. Chip giải thích xuất hiện phía trên sơ đồ, trong dải y=320–480, không giả thành cửa sổ terminal hay câu lệnh bị lỗi. Không gạch một câu SQL tự tạo. [N3, N4] | 28–30 giây: “Archive” + “Cách quản lý” + “dữ liệu”. 30–32 giây: “Không phải” + “lệnh SQL chuẩn”. Giữ nhãn nơi lưu “Lưu trữ”; bỏ nhãn nơi lưu tuỳ hệ thống của cảnh trước. | Archive là cách quản lý.<br>Không phải lệnh SQL chuẩn. | `clipboard`, đổi tại giây 28; giữ đến 32. | Minh Đức, phát âm SQL theo bảng cách đọc. Không nhạc, không SFX. |
| **00:32–00:39** · 7 giây | Đặt lại ví dụ để diễn giải **khả năng kết hợp**, không chuyển thêm ba ô khỏi kết quả trước: 32–33 giây đưa sơ đồ về mười hai ô ban đầu, hộp lưu trữ rỗng; 33–35 giây nhấn các đường chia theo tháng; 35–37 giây T1–T3 lại trượt ra nơi lưu; 37–39 giây giữ chính chín/lưu ba để trả lời hook. Tên “Đơn hàng” giữ nguyên. [N1, N3] | 32–33 giây: “Hai việc khác nhau”. 33–35 giây: “Dùng chung được” + “Chia theo tháng”. 35–39 giây: “Lưu trữ tháng cũ” + “Vẫn giữ lại”; kết quả có “Chính 9” · “Lưu trữ 3”, tên “Đơn hàng” và hộp “Lưu trữ”. | Mình chốt: hai việc khác nhau.<br>Bạn có thể dùng chung.<br>Chia theo tháng, lưu trữ tháng cũ. | `thumbs_up`, đổi tại giây 32; giữ đến hết 39. | Minh Đức; dứt câu trước hết cảnh, giữ hình kết khoảng 0,5 giây nếu giọng vừa. Không nhạc, không SFX. |

**Kiểm tổng mặc định:** 3 + 6 + 5 + 4 + 6 + 4 + 4 + 7 = **39 giây**. Sáu lần đổi dáng tại 3/9/14/18/28/32; khoảng cách ngắn nhất giữa hai lần đổi dáng là **4 giây (14→18, 28→32)**; `think` giữ **3 giây đầu**. Cáo hiện 39 giây, tức 100% thời lượng theo kế hoạch. Không có cảnh ẩn; giữ cỡ nhỏ ở mọi cảnh.

**Dự phòng được phép cho cảnh 2:** nếu lời cảnh 2 dài hơn **5,8 giây** sau xử lý, được dời mốc **9 giây sang tối đa 10 giây** bằng cách lấy từ cảnh 3. Cảnh 3 kết thúc vẫn tại giây 14, còn tối thiểu **4 giây** và phải vừa lời thật. Dời cả mốc đổi dáng `present_hand` → `point_up` tại giây 9 tương ứng; canh chip và phụ đề theo mốc mới. Giữ các mốc khác, toàn bộ lời, **sáu lần đổi dáng** và tổng **39 giây**. Ghi mốc thực dùng vào ghi chú sản xuất; nếu hai cảnh vẫn không vừa lời, trả người review, không tự cắt lời hay tăng tốc thêm.

Các khoảng con cho chữ là mốc dự kiến: Producer canh theo lời thật trong chính cảnh đó, không đổi mốc tám cảnh ngoài dự phòng cảnh 2 nêu trên và không hiện hai nhóm chip chồng nhau. Phụ đề ngắt theo câu/nhóm nghĩa, không hiện cả ô lời đọc cùng lúc. Không đọc nhãn “Minh hoạ”, mã ô hoặc bộ đếm nếu bảng lời không có.

## Nội dung đăng — chuyển nguyên văn vào publish.json khi sản xuất

`ai_generated_content`: **true**. `ai_disclosure`: **“Video có dùng hình ảnh và giọng đọc do AI tạo.”** Các tiêu đề TikTok/Facebook là tên nội bộ/trường metadata; caption/mô tả mới là nội dung hiển thị theo luồng đăng. Hashtag lưu riêng; nếu ghép vào mô tả, đặt **trước** câu khai báo để câu này luôn ở cuối.

### TikTok

**Tiêu đề:** Archive và Partition: chia hay chuyển?

**Mô tả:**

Partition chia bảng thành nhiều phần trong một bảng logic. Lọc đúng cột chia, hệ thống có thể bỏ qua phần không cần. Archive chuyển dữ liệu cũ, ít dùng khỏi bảng chính và vẫn giữ lại; nơi lưu tuỳ hệ thống. Archive có thể dùng độc lập hoặc kết hợp Partition. Mười hai ô trong video chỉ là ví dụ theo tháng. Video có dùng hình ảnh và giọng đọc do AI tạo.

**Hashtag:** #CaoVanPhong #SQL #Partition #Archive

### Facebook Reels

**Tiêu đề:** Archive và Partition trong SQL là gì?

**Mô tả:**

Chia phần và lưu trữ là hai việc khác nhau. Partition vẫn giữ một bảng logic; việc bỏ qua phân vùng phụ thuộc điều kiện lọc phù hợp. Archive chuyển dữ liệu cũ, ít dùng khỏi bảng chính và vẫn giữ lại ở nơi lưu tuỳ hệ thống. Không cần Partition trước mới Archive được. Sơ đồ mười hai ô là minh hoạ, không phải phép đo tốc độ. Video có dùng hình ảnh và giọng đọc do AI tạo.

**Hashtag:** #CaoVanPhong #SQL #CoSoDuLieu #Archive

### YouTube Shorts

**Tiêu đề:** Archive và Partition trong SQL: chia ra hay chuyển bớt?

**Mô tả:**

Partition là phân vùng: chia bảng thành nhiều phần nhưng vẫn là một bảng logic. Khi điều kiện lọc phù hợp với cột chia, hệ thống có thể bỏ qua phần không cần. Archive là cách lưu trữ dữ liệu cũ, ít dùng: chuyển khỏi bảng chính và vẫn giữ lại. Nơi lưu tuỳ hệ thống; có thể dùng Archive độc lập hoặc kết hợp Partition. Mười hai ô là ví dụ, không phải số liệu hiệu năng.

Nguồn: PostgreSQL — https://www.postgresql.org/docs/current/ddl-partitioning.html ; MySQL 8.0 — https://dev.mysql.com/doc/refman/8.0/en/partitioning-pruning.html . Video có dùng hình ảnh và giọng đọc do AI tạo.

**Hashtag:** #CaoVanPhong #SQL #Partition #Archive #Shorts

### Bình luận ghim đề xuất — chỉ ngoài video

Một số chi tiết thêm: PostgreSQL lưu ý lợi ích phân vùng thường đáng cân nhắc với bảng rất lớn; thiết kế quá nhiều phân vùng có thể làm tăng thời gian lập kế hoạch và dùng bộ nhớ. Không có ngưỡng kích thước chung cho mọi hệ thống. Nguồn: https://www.postgresql.org/docs/current/ddl-partitioning.html (Overview; Best Practices). MySQL còn có storage engine tên ARCHIVE; đây là tên một bộ máy lưu trữ riêng, khác với khái niệm archive đang giải thích. Nguồn: https://dev.mysql.com/doc/refman/8.0/en/archive-storage-engine.html .

## Nguồn

Đối chiếu tài liệu chính thức trong lượt viết ngày **18/11/2026**. Diễn đạt bằng lời của kênh; không lấy hình hay trích sơ đồ của hãng.

- **[N1] [PostgreSQL — Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)**, các mục Overview, Declarative Partitioning, Partition Maintenance, Partition Pruning, Best Practices. Cảnh 2: một bảng logic chia thành phần vật lý; cảnh 3–4: loại phần không cần khi điều kiện lọc tương thích ranh giới phân vùng; cảnh 6/8: có thể tách phần thành bảng độc lập, vẫn giữ dữ liệu. Chi tiết bảng lớn/số phân vùng chỉ dùng ở bình luận ghim. Câu “vẫn chung một tên bảng” giải thích góc nhìn truy vấn bảng cha trong ví dụ, không phủ nhận các bảng con có tên riêng.
- **[N2] [MySQL 8.0 — Partition Pruning](https://dev.mysql.com/doc/refman/8.0/en/partitioning-pruning.html)**. Cảnh 3–4: ví dụ điều kiện so sánh trên cột chia giúp xác định phần liên quan. Video là minh hoạ khái niệm, không giả rằng mọi cách viết điều kiện hay mọi hệ quản trị đều pruning được.
- **[N3] [IBM — Archive](https://www.ibm.com/docs/en/iodg/11.3.0?topic=reference-archive)** và [Archiving data with Optim Designer](https://www.ibm.com/docs/en/iodg/11.3.0?topic=data-archiving-optim-designer). Cảnh 5–6: quy trình chọn dữ liệu, giữ ở file lưu trữ, có thể bỏ bản trong bảng nguồn sau khi lưu. Đây là một triển khai cụ thể; kết hợp ví dụ PostgreSQL tách phần thành bảng độc lập [N1] để minh hoạ rằng nơi lưu và cách thực hiện tuỳ hệ thống. Không suy rộng thành lời hứa tra cứu dễ hay nhanh. Nguồn bổ trợ cho cảnh 7: [Brent Ozar — “We want to archive, but we still want to query the data.”](https://www.brentozar.com/archive/2026/05/we-want-to-archive-but-we-still-want-to-query-the-data/) (07/05/2026; đã mở đối chiếu ngày 18/11/2026). Bài phân tích phương án chuyển dữ liệu cũ sang nơi lưu riêng và khó khăn khi muốn giữ cách truy vấn cũ trong SQL Server; hỗ trợ cách hiểu archive là lựa chọn quản lý dữ liệu, không bảo đảm tra cứu lại dễ. Không khái quát các giới hạn riêng của SQL Server sang mọi hệ quản trị.
- **[N4] [PostgreSQL — SQL Commands](https://www.postgresql.org/docs/current/sql-commands.html)** và [MySQL 8.0 — The ARCHIVE Storage Engine](https://dev.mysql.com/doc/refman/8.0/en/archive-storage-engine.html). Cảnh 7 dùng phân biệt đã chốt trong phán quyết: archive là cách quản lý dữ liệu, không phải một lệnh SQL chuẩn chung. Các nguồn cho ví dụ giao diện/lệnh và cách đặt tên theo sản phẩm; không khẳng định không sản phẩm nào có thao tác mang tên Archive. Chi tiết storage engine chỉ nằm trong bình luận ghim.
- **Số minh hoạ:** mười hai ô tháng; chuyển T1–T3, còn chín phần trong bảng chính và ba phần lưu trữ. Do kịch bản tự đặt để minh hoạ, không phải thống kê, số dòng, số byte hay kết quả benchmark.
- **Quy chuẩn nội bộ:** `../debate.md` (“Phán quyết cuối”), `../brief.md`; `D:/Agent Video Studio/docs/asset-sources.md`, `platform-specs.md`, `mascot.md`, `voice.md`.

**Không còn mục nội dung cần kiểm nguồn.** Phát âm và thời lượng giọng chưa được nghe/đo ở lượt viết; Producer phải thực hiện trước khi chốt video.
