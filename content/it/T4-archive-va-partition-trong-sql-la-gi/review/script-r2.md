# Review Kịch bản — IT-T4-E01 · vòng 2 (N=2) · Claude (planner) · 18/11/2026

Đã đọc: `brief.md`, `debate.md` (Phán quyết cuối), `concept.md`, `plan.md`, `ep01/script.md` (bản sửa), `review/script-r1.md`, `docs/chat-luong-xem.md`, `mascot.md`, `voice.md`, `platform-specs.md`. Không đọc thư mục T3. Đã xem lại ảnh `point_left.png`, `point_right.png`, `clipboard.png` để kiểm hướng chỉ/đạo cụ; đã tự cộng lại toàn bộ bảng ước lượng TTS và mở lại trang chính thức PostgreSQL, MySQL, Oracle.

## 1. Đối chiếu 12 góp ý vòng 1 với file thật

| # | Góp ý | Kết quả | Bằng chứng trong file |
|---|---|---|---|
| 1 | Gọi tên partition/archive trong lời | **Đã sửa đúng** | Lời 5 "Partition không tự xoá, không tự nén dữ liệu cũ."; lời 12 tách "Cất như vậy gọi là archive. Nó không phải lệnh SQL chuẩn, mỗi hệ mỗi cách."; bảng phát âm có dòng Partition ("pa-ti-sần", CHƯA KIỂM); `concept.md` bộ thoại 13 câu khớp từng chữ với bảng lời của `script.md` (đã so từng câu 1–13); hai thẻ chốt giữ nguyên. |
| 2 | Nhịp theo TTS, chia lại mốc | **Đã sửa đúng (có 1 lỗi cộng, đã sửa)** | Có bảng ước lượng 13 lời; tôi đếm lại âm tiết từng lời và giây từng dòng đều khớp (30,36 s lời + 2,19 s nghỉ giữa lượt + 0,35 s đuôi = 32,90 s). Hỏi 17,7 → trả 23,4; lời 12 từ 25,25; CTA từ 29,95 dứt 32,55; khoảng nghỉ lớn nhất 0,50 s; đuôi 0,35 s. Ba file cùng mốc. "Mốc sẽ được duyệt lại sau đo TTS thật" có ở cả ba. **Lỗi:** tổng "139 âm tiết" sai, đúng là 129 — xem mục 3. |
| 3 | Cáo ẩn 18–23 s | **Đã sửa đúng** | `plan.md` dòng 18–21,6: `clipboard` từ đúng 18,0 s (sau `think` 16,0 s đúng 2,0 s), "Cáo hiện suốt 18–23 s"; `script.md` cảnh 17,7–19,3 và 19,3–21,6 giữ `clipboard`, Cáo gắn với việc đặt/lật thẻ. Tỉ lệ Cáo hiện 32,9/32,9 s. |
| 4 | Hướng pose khớp phía của vật | **Đã sửa đúng** | 5,0–10 s dùng `point_right` (chip tháng x 590–950 và T6 đều nằm bên phải tâm Cáo x ≈ 570); mỗi dòng ghi "đích ở bên phải/trái Cáo"; 21,6–23,8 s `point_left` với thẻ ở x 130–450 bên trái Cáo. Ảnh `point_right.png`, `point_left.png` xác nhận chỉ đúng phía. Khoảng cách nhỏ nhất giữa các lần đổi dáng 2,0 s (đã tính lại 11 mốc: 2,2 · 2,8 · 5,0 · 3,0 · 3,0 · 2,0 · 3,6 · 2,2 · 2,3 · 3,85). |
| 5 | Đóng `[CẦN KIỂM NGUỒN]`, vá bảng nguồn | **Đã sửa đúng** | Không còn marker (grep sạch); thêm MySQL ARCHIVE, Oracle FLASHBACK ARCHIVE/ROW ARCHIVAL; câu PostgreSQL "pruning is driven only by the constraints defined implicitly by the partition keys" gắn vào hàng 5–10 s; hàng 10–13 s ghi rõ "không có câu nào … đây là diễn giải"; mô tả đúng cách đối chiếu (công cụ web, không phải trình duyệt đồ họa); ghi trung thực ISO chưa đối chiếu. |
| 6 | Lỗi chính tả/định dạng | **Đã sửa đúng** | Grep chữ–số dính nhau trên cả ba file: chỉ còn các token hợp lệ (T1–T6, ep01, v3, R8, mã màu hex, H.264, yuv420p). "HĐ 4721" thống nhất mọi nơi, "MySQL 8.4" có khoảng trắng; hết "theo prompt lượt này"/"NGỮ CẢNH". |
| 7 | Dự phòng cửa sổ 0–4,9 s | **Đã sửa đúng (có sai số đếm, đã sửa)** | Có bản rút gọn "Chia theo tháng, máy bỏ qua được phần không cần.", điều kiện kích hoạt, ghi "không tăng tốc". Số âm tiết ghi 11 nhưng đúng là 10 (lỗi đếm xuất phát từ chính ví dụ của tôi ở vòng 1) — đã sửa. |
| 8 | Lý do cho kế toán | **Đã sửa đúng** | Lời 7 "Kế toán cần hóa đơn cũ, mình tìm ở bảng đang dùng." (12 từ), đã đưa vào bảng ước lượng và mốc (14,8–17,6 s). |
| 9 | Giảm chuyển động đồng thời ở cuối | **Đã sửa đúng** | Hóa đơn về khe ngăn chuyển sang 28,7–29,95 s; cảnh cuối tuần tự: thẻ 1 (29,95–30,55) → thẻ 2 (30,55–31,15) → cửa khép nửa (31,15–32,2) → khép hết (32,2–32,9); không chuyển hóa đơn, không nhún Cáo. |
| 10 | "Không tự xoá, không tự nén" | **Đã sửa đúng** | Lời 5, `concept.md`, bảng nguồn đều dùng "tự". Đối chiếu lại tài liệu PostgreSQL: dữ liệu chỉ bị bỏ khi chạy tường minh DROP/DETACH; tài liệu không nói partition nén hay xoá tự động — câu "tự" đúng và vẫn được gắn nhãn diễn giải. |
| 11 | Bìa | **Đã sửa đúng** | Khung 1,7 s trong cửa sổ ổn định 1,6–1,9 s (trước viền một bảng 2,0 s), khớp mốc `main_change` cảnh hook; nhãn "Tình huống dựng" 72 px chia hai dòng; tin sếp 90 px; không lưới. |
| 12 | Phân biệt `PARTITION BY` | **Đã sửa đúng** | Mô tả Facebook và YouTube đều có "partition ở đây là chia bảng (table partitioning)". |

## 2. Bảng chấm 6 tiêu chí

| # | Tiêu chí | Kết quả | Lý do |
|---|---|---|---|
| 1 | Bám phán quyết | **Đạt** | Mạch, hook, ích lợi, chip tháng/khách, T1 sang kho, hai thẻ chốt, CTA đúng phán quyết; hai thuật ngữ nay được gọi tên trong lời (lời 5, lời 12). Hai khác biệt đã chấp nhận ở vòng 1 (xưng "mình", bỏ "nhỉ") vẫn hợp `mascot.md`. |
| 2 | Giữ chân | **Đạt** | Hook 0–2,1 s (nhân vật + sự cố, ví dụ dựng); ích lợi 2,2–4,86 s; hỏi 17,7 → trả 23,4 nhất quán ba file; hai thẻ chốt + CTA có lối thoát "chưa"; tổng 32,9 s. Lưu ý biên mỏng ở ích lợi (mục 4, ghi chú a). |
| 3 | Đủ chi tiết cho Producer | **Đạt** | Đủ cột; dáng Cáo đều có thật (10 dáng, đã xác nhận file) và gắn hướng chỉ/vật; Cáo hiện suốt; bảng nghĩa màu, ngân sách ≤ 3 nhóm (đã đếm lại từng cảnh), chữ khoá 72–80 px, nhãn/mã ≥ 56 px, vật chính 580/600/600/560 px; không nhạc; không khoảng lặng ≥ 0,8 s, đuôi 0,35 s; đổi dáng cách ≥ 2 s. |
| 4 | Chính xác | **Đạt** | Đã mở lại: PostgreSQL (định nghĩa chia bảng, pruning chỉ theo khoá chia không theo index, "Seldom-used data can be migrated…", không có câu nào về nén/xoá tự động), MySQL ARCHIVE (zlib, chỉ INSERT/REPLACE/SELECT, không DELETE/UPDATE, không hỗ trợ partitioning), Oracle `CREATE FLASHBACK ARCHIVE` và `ROW ARCHIVAL` (đều là tính năng riêng của Oracle). Giới hạn còn lại được ghi trung thực: ISO/IEC 9075 chưa đối chiếu (trả phí), kết luận dựa trên tài liệu các hệ chính; chấp nhận như vòng 1. |
| 5 | Làm được & an toàn | **Đạt** | Pillow/FFmpeg tự tạo, Cáo từ `brand/cao/poses/`, Segoe UI, VieNeu cục bộ, hiệu ứng tự tạo ≤ 0,2 s; không logo/stock/nhạc; ba mô tả đều kết bằng câu khai báo AI, `ai_generated_content=true`, hashtag 4/4/5. |
| 6 | Văn phong, tiếng Việt | **Đạt** | Giọng "mình/bạn", câu ngắn, không câu chào; dính chữ–số đã hết; mã HĐ 4721 thống nhất. Còn lỗi số học nhỏ trong bảng ước lượng (mục 3). |

## 3. Lỗi còn lại và các sửa nhỏ Claude đã thực hiện (ở N=2 theo yêu cầu điều phối: chỉ vì lỗi thật sự nhỏ, sửa tại chỗ)

Cả hai sai sót đều là số đếm/ghi chú, không đụng tới cảnh, lời hay concept.

1. **Tổng âm tiết sai.** Bảng 13 lời cộng lại = 9+12+10+8+12+7+12+6+9+7+7+19+11 = **129**, không phải 139. Giây ước tính đã tính theo từng dòng nên các mốc không đổi (đã kiểm: Σ giây 30,36). Đã sửa "139" → "129" ở `ep01/script.md` (đoạn sau bảng ước lượng) và `plan.md` (mục Âm thanh, dòng "Mốc 32,9 s…").
2. **Bản dự phòng lời 2 ghi 11 âm tiết, đúng là 10** (Chia·theo·tháng·máy·bỏ·qua·được·phần·không·cần). Lỗi đếm bắt nguồn từ ví dụ của chính tôi ở góp ý 7 vòng 1. Đã sửa thành "10 âm tiết" ở `concept.md` (đoạn "Dự phòng duy nhất cho lời 2"), `plan.md` (mục Âm thanh) và `ep01/script.md`; ước lượng bản ngắn tính lại: 10/4,6 + 0,16 = 2,33 s, kết thúc ≈ 4,53 s (trước ghi 2,55 s/4,75 s).
3. **Ghi chú trung thực về giả định tốc độ của lời 2** (thêm vào `ep01/script.md`, mục Dự phòng): bảng giả định 4,8 âm tiết/s cho lời ích lợi và 4,6 cho các lời còn lại; nếu đồng đều 4,6 thì bản đầy đủ kết thúc ≈ 4,97 s, sát giới hạn. Vì vậy Producer cần đo kỹ và **được phép dùng bản dự phòng — Claude đã duyệt trước bản này** (ghi vào cả ba file thay cho "đang trình Claude duyệt").
4. **Cập nhật mức kiểm nguồn Oracle.** Vòng 1 tôi chỉ xem tóm tắt tìm kiếm; ở vòng này đã mở và đọc trang chính thức `CREATE-FLASHBACK-ARCHIVE.htm` và mục In-Database Archiving (`ROW ARCHIVAL`, cột `ORA_ARCHIVE_STATE`). Đã sửa ba chỗ trong `ep01/script.md` (đoạn mở mục nguồn, hàng 25,25–29,95 s "mỗi hệ mỗi cách", đoạn kết) từ "chỉ xem tóm tắt" thành "đã đọc trang chính thức". ISO vẫn ghi "chưa đối chiếu".

## 4. Ghi chú không bắt buộc sửa (chuyển cho Đạo diễn hình ảnh/Producer)

a. **Biên ích lợi mỏng.** Với tốc độ đồng đều lời ích lợi kết thúc ≈ 4,97 s (< 5 s nhưng gần như không dư). Đừng để hình T6 sáng muộn hơn ~3,1 s; nếu đo TTS > 4,9 s thì dùng bản rút gọn (đã duyệt).
b. **Thẻ chốt hiển thị chỉ ~2,95 s** (29,95–32,9 s) cùng lúc có phụ đề CTA — 9 từ chữ chốt + câu CTA. Đủ nhưng sát; sau khi đo TTS, nếu lời 13 ngắn hơn ước lượng thì cho thẻ ở lại hết thời lượng (đuôi im vẫn ≤ 0,7 s), không cắt thẻ cho kịp.
c. **Đồng bộ hình "mỗi hệ mỗi cách" với lời.** Theo ước lượng, câu "mỗi hệ mỗi cách" nói khoảng 28,4–29,8 s, còn hình "cách lưu khác" xuất hiện 26,4–27,55 s rồi "hai hình trở về cùng cụm kho" 27,55–28,7 s. Khi lập storyboard nên đặt hình "hai cách lưu cạnh nhau" trùng cụm lời "mỗi hệ mỗi cách" (và `shrug` rơi vào đoạn này) thay vì gộp lại đúng lúc câu đó vang lên. Sửa theo mốc TTS đo thật.
d. **Cáo chỉ ngang trong khi vật nằm cao hơn đầu Cáo** (y 250–850 so với Cáo y ≥ 1030). Chấp nhận vì hướng trái/phải đúng và bố cục 9:16 buộc Cáo ở đáy; storyboard nên dùng đường dẫn/mũi tên trong hình để nối mắt từ tay Cáo lên vật.
e. **Ranh giới 18,0 s nằm giữa cue lời 8** (17,7–19,15 s). Nếu TTS làm lời 8 bắt đầu lệch, dời ranh giới bố cục theo cue đầu tiên gần 18 s, giữ khung "MỘT BẢNG" tới hết cue câu hỏi hoặc thêm mốc tương đương ghi `notes.md`.
f. Chính tả "xoá/xóa" đang lẫn giữa lời ("xoá") và mô tả ("xóa"); cả hai đúng, chỉ cần phụ đề `captions.srt` giữ chữ giống lời 5.

## 5. Giữ nguyên
Mạch truyện và ví dụ dựng; khung "MỘT BẢNG" 2–18 s; lưới 2×3 600 px; không DETACH/DROP, không "ARCHIVE" viết hoa, không số hiệu năng; bảng nghĩa màu, ngân sách ba nhóm chữ; hai thẻ chốt, CTA, metadata ba nền tảng; renderer `pillow-ffmpeg` và `renderer_reason`.

KẾT LUẬN: DUYỆT SAU KHI CLAUDE SỬA NHỎ
