# Review Kịch bản — IT-T4-E01 · vòng 1 (N=1) · Claude (planner) · 18/11/2026

Đã đọc: `brief.md`, `debate.md` (Phán quyết cuối), `concept.md`, `plan.md`, `ep01/script.md`, `docs/chat-luong-xem.md`, `mascot.md`, `asset-sources.md`, `platform-specs.md`, `voice.md`. Không đọc thư mục T3. Đã xem ảnh `point_left.png`, `point_up.png` để kiểm hướng chỉ.

## Bảng chấm 6 tiêu chí

| # | Tiêu chí | Kết quả | Lý do |
|---|---|---|---|
| 1 | Bám phán quyết | **Chưa đạt (một điểm)** | Mạch truyện, hook, ích lợi, chip tháng/khách, T1 sang kho, hai thẻ chốt, CTA đều đúng phán quyết. Hai khác biệt (Cáo → mình, bỏ "nhỉ") có ghi lý do và hợp `mascot.md` — chấp nhận. Điểm chưa đạt: chủ đề là "Archive và Partition là gì?" nhưng lời không bao giờ gọi tên "partition"; "archive" xuất hiện lần đầu ở ~26,4 s mà không nối với cảnh vừa xem. Tên thuật ngữ chỉ có trên thẻ chốt từ 29,4 s. Xem góp ý 1. |
| 2 | Giữ chân | **Đạt** | Đủ 5 mục bắt buộc, mốc nhất quán ba file (hỏi ~17 s, trả ~25 s). Ghi chú: biên của cửa sổ 0–4,9 s rất mỏng và khoảng hỏi→trả thưa lời (góp ý 7, 2). |
| 3 | Đủ chi tiết cho Producer | **Chưa đạt** | Cột, dáng Cáo, bảng màu, kích thước, bố cục, ngân sách chữ đều đủ và chi tiết tốt. Còn: nhịp theo TTS chưa có ước lượng nên có đoạn quá tải và đoạn thưa (góp ý 2); Cáo ẩn 18–23 s trái với lời "Mình để thẻ chỉ dẫn" (góp ý 3); hướng `point_left` ngược phía vật cần chỉ (góp ý 4). |
| 4 | Chính xác | **Chưa đạt (thủ tục + bổ sung nguồn)** | Các phát biểu kỹ thuật đúng. Còn một dấu `[CẦN KIỂM NGUỒN]` mở; tôi đã kiểm, kết quả ở mục dưới, Codex cần cập nhật bảng nguồn (góp ý 5). |
| 5 | Làm được & an toàn | **Đạt** | Chỉ dùng Pillow/FFmpeg tự tạo, 46 dáng Cáo có sẵn, Segoe UI, VieNeu cục bộ, hiệu ứng tự tạo ≤ 0,2 s. Không logo, không stock, không nhạc. Có câu khai báo AI cuối mô tả cả ba nền tảng; `ai_generated_content=true`. |
| 6 | Văn phong, tiếng Việt | **Chưa đạt (nhẹ)** | Giọng đúng `mascot.md` (mình/bạn, câu ngắn, không câu chào). Lỗi: thiếu khoảng trắng trước số/đơn vị khắp `plan.md`, `script.md`; mã hóa đơn viết "HĐ 4721" trên hình nhưng "HĐ4721" ở nơi khác; "MySQL8.4" trong mô tả YouTube công khai (góp ý 6). |

## Kiểm bắt buộc theo yêu cầu điều phối

| Mục | Kết quả | Ghi chú |
|---|---|---|
| Hook là ví dụ dựng, không giả sự kiện | Đạt | Nhãn "Tình huống dựng", sếp/kế toán là silhouette, "HĐ 4721 · ví dụ". Không khẳng định cơ chế quét toàn bảng. |
| Ích lợi đầu tiên trước giây 5 | Đạt (biên mỏng) | Hình hiện từ ~3,1 s. Lời "Chia bảng theo tháng, máy có thể bỏ qua phần không cần" phải dứt ≤ 4,9 s. Xem góp ý 7. |
| Hỏi → trả, mốc nhất quán | Đạt | concept, plan, script cùng ~17 s → ~25 s. Gợi ý lùi mốc trả ở góp ý 2. |
| Câu chốt hiển thị + CTA nhẹ | Đạt | Hai thẻ đúng nguyên văn, ≥ 72 px, ≤ 3 từ mỗi dòng. CTA có lối thoát "chưa", không chép chốt. |
| ≤ 3 nhóm chữ; chữ khoá ≤ 3 từ ≥ 72 px; nhãn/mã ≥ 56 px | Đạt | Đã đếm từng cảnh, nhiều nhất 3 nhóm; ngân sách nhóm ghi rõ trong plan. |
| Chữ không chép lời | Đạt | Nhãn chỉ gọi tên vật (Đơn hàng, Kho lưu, T1, HĐ 4721, Ví dụ); không có câu dài. |
| Hình đổi thật, mọi khoảng ≥ 1,5 s | Đạt | Mốc con ≤ 1,3 s, vật di chuyển/đường nối đổi đích. Cảnh 10–13 s đổi hình có thật nhưng ý "không nén" khá trừu tượng; chấp nhận, lời đi kèm. |
| Vật chính ≥ ~560 px | Đạt | Phiến 580, lưới 600, cụm kho 600, hóa đơn 560. Hóa đơn 560 px phải giữ trong y250–850, không chạm phụ đề y860–1000. |
| Cáo có vai kể | **Chưa đạt một phần** | Hành vi gắn vật tốt ở 0–18 s và 23–34 s; xem góp ý 3, 4. |
| Bảng nghĩa màu nhất quán | Đạt | Xanh lá/xám/vàng/đỏ/xanh dương/trắng dùng nhất quán, có hình phụ không dựa riêng vào màu. |
| Bìa 180×320 là khung hook | Đạt | Cáo bất ngờ + phiến + "Vào họp rồi!", không lưới. Ghi chú nhỏ ở góp ý 11. |
| Nhịp theo TTS, đuôi im ≤ 0,7 s | **Chưa đạt** | Góp ý 2. |
| Chính xác kỹ thuật | Đạt | Không DETACH/DROP, không hứa tăng tốc, pruning gắn điều kiện lọc phù hợp khoá chia, archive "tuỳ hệ". |
| Nhãn AI 3 nền tảng, đủ metadata | Đạt | Cả ba mô tả kết bằng "Video có dùng hình ảnh và giọng đọc do AI tạo."; 4/4/5 hashtag; tiêu đề YouTube < 100 ký tự. |
| Tên dáng Cáo có thật | Đạt | `surprised`, `point_up`, `point_left`, `read_paper`, `laptop_typing`, `think`, `shrug`, `thumbs_up` đều có trong `mascot.md`. |
| Đổi dáng cách nhau ≥ 2 s | Đạt | Khoảng cách nhỏ nhất đúng 2,0 s (`shrug` → `thumbs_up`). |
| Tổng 15–45 s | Đạt | 34 s dự kiến, trần 40 s. |

## Kết quả kiểm `[CẦN KIỂM NGUỒN]`: "archive không phải một lệnh SQL chuẩn, mỗi hệ mỗi cách."

- **"Mỗi hệ mỗi cách": ĐÃ CÓ NGUỒN.**
  - MySQL 8.4 có storage engine tên `ARCHIVE`: nén zlib, hỗ trợ INSERT/REPLACE/SELECT, không DELETE/UPDATE, không hỗ trợ partitioning (đã đọc trang chính thức).
  - Oracle có hai tính năng riêng: `CREATE FLASHBACK ARCHIVE` và `ROW ARCHIVAL` (In-Database Archiving). Đối chiếu qua tóm tắt tìm kiếm tới docs.oracle.com, chưa đọc toàn văn.
  - Tài liệu PostgreSQL không có lệnh archive; chỉ nêu việc "Seldom-used data can be migrated to cheaper and slower storage media" như một lợi ích của partitioning (đã đọc trang chính thức).
- **"Không phải một lệnh SQL chuẩn": CHƯA đối chiếu được văn bản ISO/IEC 9075 (trả phí).** Tìm kiếm không thấy nguồn nào phát biểu thẳng điều này. Phát biểu phủ định ở mức thực hành là đúng: không có hệ chính nào dùng chung một lệnh archive, và tôi không biết có câu lệnh ARCHIVE nào trong chuẩn SQL.
- **Kết luận:** giữ nguyên câu lời (khớp phán quyết và brief), chấp nhận phát hành. Codex đóng dấu `[CẦN KIỂM NGUỒN]` bằng cách ghi đúng mức đã kiểm như trên: "mỗi hệ mỗi cách — có nguồn; chuẩn ISO — chưa đối chiếu văn bản chuẩn, kết luận dựa trên tài liệu các hệ chính". Không viết "đã xác minh chuẩn ISO".

Kiểm thêm, đã đối chiếu trang chính thức:
- PostgreSQL: "splitting what is logically one large table into smaller physical pieces"; pruning "driven only by the constraints defined implicitly by the partition keys, not by the presence of indexes"; "WHERE clauses that are compatible with the partition bound constraints can be used to prune unneeded partitions". Câu "Lọc đúng cột đã chia thì mới bỏ qua được" đúng ở nghĩa điều kiện cần.
- MySQL 8.4: "data satisfying a given WHERE clause can be stored only on one or more partitions, which automatically excludes any remaining partitions from the search".
- **Không trang nào nói "partition không nén/không xoá".** Đây là diễn giải từ định nghĩa; `script.md` đã gắn nhãn "Diễn giải cơ chế" là đúng, nhưng `debate.md` ghi "đã kiểm" là quá mức. Giữ như diễn giải, xem góp ý 10.

## Danh sách góp ý (đánh số; BẮT BUỘC = 1–6, NÊN = 7–12)

**1. [BẮT BUỘC] Gọi tên hai thuật ngữ trong lời — `ep01/script.md` bảng lời, cảnh 10–13 s và 26,4–29,4 s; bảng phát âm; `concept.md` bộ thoại.**
Hiện "partition" không có trong lời và không có trên hình trước 29,4 s; "archive" chỉ xuất hiện như chủ ngữ bất ngờ ở lời 12. Sửa tối thiểu, giữ nguyên các câu đã chốt khác:
- Lời 5: "Partition không xoá, không nén dữ liệu cũ." (hoặc "Partition chỉ chia bảng, không xoá, không nén dữ liệu cũ.").
- Lời 12 tách hai ý: "Cất như vậy gọi là archive. Nó không phải lệnh SQL chuẩn, mỗi hệ mỗi cách."
- Thêm dòng bảng phát âm cho "Partition" (gợi ý "pa-ti-sần", ghi CHƯA KIỂM). Giữ "viết thường archive".
- Cập nhật cùng lúc `concept.md` (bộ thoại 13 câu) và mô tả "Lời và phát âm". Giữ nguyên hai thẻ chốt.

**2. [BẮT BUỘC] Nhịp theo TTS: thêm ước lượng và chia lại mốc — `script.md` bảng cảnh + mục "Lời và phát âm"; `plan.md` dòng "Lời và thời gian" và mục Âm thanh; `concept.md` bảng mốc.**
Đếm âm tiết 13 lời hiện tại ≈ 124. Ở khoảng 4,6 âm tiết/giây (sau atempo 1,08) cộng nghỉ 0,25 s/câu, tổng lời ≈ 30 s (≈ 31,5 s sau góp ý 1). Phân bố hiện tại lệch:
- 13–18 s chứa lời 6, 7, 8 ≈ 5,3 s lời trong cửa sổ 5,0 s: quá tải.
- 18–25 s chứa lời 9, 10 ≈ 3,5 s lời trong 7 s: thưa; khoảng hỏi→trả 8 s chỉ có hai câu ngắn, trái ý plan "không giữ im để trì hoãn đáp án".
- 29,4–34 s: lời CTA 13 âm tiết ≈ 2,8 s nhưng script ghi "lời dứt dự kiến 33,7 s" mà không ghi lời bắt đầu lúc nào; nếu bắt đầu 29,4 s thì đuôi im ≈ 1,8 s, vượt 0,7 s.
Việc cần làm:
- Thêm vào `script.md` một bảng ước lượng: số âm tiết, giây ước tính và giả định tốc độ của từng lời; ghi rõ là ước lượng, không phải đo.
- Chia lại mốc theo ước lượng, ví dụ gợi ý: hỏi ≈ 17,5 s; trả ≈ 23 s; lời 12 mới (≈ 4,3 s) từ ≈ 24,8 s; CTA từ ≈ 29,4 s; tổng ≈ 32–33 s. Codex có thể chọn số khác nhưng không để khoảng lặng ≥ 0,8 s không có mục đích hoặc đuôi > 0,7 s.
- Nếu giữ "trả ở 25 s" thì phải đổ thêm lời có nội dung vào 18–25 s, không kéo dài hình.
- Mọi mốc đổi phải khớp ba file. Ghi lại "mốc sẽ được duyệt lại sau đo TTS thật".

**3. [BẮT BUỘC] Cáo ẩn 18–23 s trái với lời — `plan.md` bảng "Cáo và bố cục theo đoạn" dòng 18–23 s; `script.md` cảnh 18–21,8 và 21,8–25.**
Lời 9 là "Mình để thẻ chỉ dẫn cho phần đã chuyển." (Cáo nói) trong khi Cáo vắng, và `debate.md` mô tả "Cáo đặt thẻ chỉ dẫn". Lý do ẩn ("dành toàn vùng cho đường chuyển") không đúng với chính bố cục plan: sau 18 s vật chính y250–850, phụ đề y860–1000, Cáo y1030–1480 vẫn nằm vừa (đang dùng ở 23–34 s). Sửa: giữ Cáo hiện suốt 18–23 s; đổi dáng lúc 18,0 s (cách `think` 16,0 s đúng 2,0 s) sang `clipboard` hoặc `present_hand`, gắn với việc đặt/lật thẻ chỉ dẫn; sang `point_*` lúc ≥ 20 s hoặc 23 s theo góp ý 4. Cập nhật tỷ lệ Cáo hiện (sẽ ≈ 34/34).

**4. [BẮT BUỘC] Hướng pose chỉ phải khớp phía của vật — `plan.md` bảng Cáo dòng 2,0–10 s và 23–29,4 s; `script.md` cảnh 5–7,6; 7,6–10; 21,8–25.**
`point_left` là Cáo chỉ sang trái màn hình. Plan đặt Cáo ở x≈570 (đáy giữa), còn chip "tháng" ở x590–950 (phải trên) và T6 ở cột phải; đường nối đi sang phải/xuống phải. Cáo `point_left` từ 5 s sẽ chỉ ngược phía. Sửa: dùng `point_right` ở 5,0–7,6 s (chip → T6). Cho từng dòng chỉ ghi "đích ở bên trái/phải Cáo" để Producer không phải đoán; với 23,0 s `point_left` phải ghi thẻ chỉ dẫn nằm bên trái Cáo, nếu không đổi dáng. Cách nhau ≥ 2 s vẫn giữ.

**5. [BẮT BUỘC] Đóng `[CẦN KIỂM NGUỒN]` và vá bảng nguồn — `script.md` mục "Nguồn và giới hạn kiểm chứng", cảnh 26,4–29,4 s (marker trong ô hình ảnh).**
- Ghi kết quả kiểm như mục "Kết quả kiểm" phía trên; thêm nguồn MySQL ARCHIVE engine, Oracle `CREATE FLASHBACK ARCHIVE` (https://docs.oracle.com/database/122/SQLRF/CREATE-FLASHBACK-ARCHIVE.htm) và In-Database Archiving (https://docs.oracle.com/en/database/oracle/oracle-database/18/vldbg/control-validity-visibility-data.html). Ghi trung thực: Oracle mới xem tóm tắt, ISO chưa đọc.
- Hàng "5–10 s chip tháng/khách": thêm câu PostgreSQL "pruning is driven only by the constraints defined implicitly by the partition keys" làm bằng chứng trực tiếp cho lời 3.
- Hàng "10–13 s": ghi thẳng "không có câu nào trong tài liệu nói partition không nén/không xoá; đây là diễn giải".
- Bỏ câu "Đối chiếu tài liệu chính thức bằng trình duyệt ngày 18/11/2026" nếu không thật sự chụp/đọc bằng trình duyệt; thay bằng mô tả đúng cách đã đối chiếu.
- Bỏ marker `[CẦN KIỂM NGUỒN]` khỏi ô hình ảnh sau khi đóng.

**6. [BẮT BUỘC] Lỗi chính tả/định dạng — `plan.md`, `script.md`, `concept.md`.**
- Thiếu khoảng trắng trước số/đơn vị khắp nơi: "cao480 px", "chữ72 px", "ở13–18 s", "khoảng19–25 s", "từ5 s", "y1000–1480", "cao 380px" v.v. Rà toàn bộ, thêm khoảng trắng giữa chữ và số, giữa số và đơn vị.
- Mã hóa đơn thống nhất "HĐ 4721" ở mọi nơi (đang lẫn "HĐ4721" ở plan tiêu chí nghiệm thu, mô tả Facebook, bảng nguồn).
- Mô tả YouTube công khai: "MySQL8.4" → "MySQL 8.4" (cũng ở bảng nguồn). Mô tả Facebook "HĐ4721" → "HĐ 4721".
- Bỏ các nhắc "theo prompt lượt này"/"NGỮ CẢNH" trong `concept.md` và `script.md` (là nội dung nội bộ quy trình, Producer không biết); thay bằng "theo `docs/mascot.md` (xưng mình hoặc Cáo)".

**7. [NÊN] Dự phòng cho cửa sổ 0–4,9 s — `script.md` mục "Lời và phát âm".**
Hook 9 âm tiết + ích lợi 12 âm tiết = 21 âm tiết, cộng nghỉ, cần ≥ ~4,4 âm tiết/giây mới dứt ≤ 4,9 s. Giọng chậm hơn 4,2 âm tiết/giây sẽ vượt. Plan nói "trả Kịch bản" nếu vượt; vòng trả này tốn lượt sửa. Ghi sẵn bản rút gọn được duyệt trước (ví dụ "Chia theo tháng, máy bỏ qua được phần không cần.", 11 âm tiết) để Producer dùng khi cần, kèm điều kiện kích hoạt.

**8. [NÊN] Cho kế toán một lý do trong lời — `script.md` cảnh 13–16,6, lời 7.**
Kế toán chỉ là silhouette không chữ nên người xem tắt tiếng không biết ai đang cần hóa đơn; ngân sách nhóm chữ ở cảnh này đã đầy nên chữ không thêm được. Đề xuất lời 7: "Kế toán cần hóa đơn cũ, mình tìm ở bảng đang dùng." (cần xem xét lại mốc theo góp ý 2 vì thêm ~0,65 s).

**9. [NÊN] Giảm chuyển động đồng thời ở 29,4–34 s — `script.md` cảnh cuối.**
Vừa có hai thẻ trượt, vừa hóa đơn về khe ngăn, vừa cửa khép, vừa phụ đề CTA, vừa Cáo: vi phạm tinh thần "mỗi nhịp một tiêu điểm". Gợi ý: thẻ trượt vào 29,4–31,0 s, sau đó chỉ giữ cửa khép nhẹ; chuyển cảnh hóa đơn về khe sang 26,4–29,4 s hoặc bỏ.

**10. [NÊN] Chính xác hơn câu "không xoá, không nén" — lời 5.**
Đề xuất "không tự xoá, không tự nén dữ liệu cũ": partition tự nó không xoá hay nén, nhưng nhiều hệ cho phép drop/nén theo từng partition; thiếu "tự" có thể bị hiểu là cấm. Câu chốt hiển thị không đổi.

**11. [NÊN] Bìa — `plan.md` mục Thumbnail.**
Khung "khoảng 1,0 s" nằm giữa chuyển động phiến bung (0,6–1,4 s). Chọn khung ổn định (~1,6–1,9 s, trước khi viền MỘT BẢNG xuất hiện lúc 2,0 s) hoặc dựng bìa riêng từ các lớp hook. Nhãn "Tình huống dựng" 56 px sẽ không đọc được ở 180×320, ghi rõ là chấp nhận hay dùng cỡ ≥ 72 px trên bìa.

**12. [NÊN] Phân biệt "partition" của bảng với `PARTITION BY` của hàm cửa sổ — mô tả YouTube/Facebook.**
Chủ đề "Partition trong SQL" dễ gây nhầm với mệnh đề `PARTITION BY` trong window function. Thêm vào mô tả một cụm ngắn, ví dụ "partition ở đây là chia bảng (table partitioning)". Không đưa vào lời.

## Giữ nguyên (đã tốt, đừng đổi khi sửa)
- Mạch truyện sếp → chia khối → chip tháng/khách → khối cũ nguyên vẹn → hóa đơn tìm trống → kho lưu; ví dụ dựng ghi rõ; khung "MỘT BẢNG" 2–18 s; lưới 2×3 600 px.
- Không DETACH/DROP, không "ARCHIVE" viết hoa, không số hiệu năng, không dung lượng ổ đĩa.
- Bảng nghĩa màu, ngân sách ba nhóm chữ, bố cục phụ đề, khoảng cách ≥ 10 px, cỡ chữ.
- Hai thẻ chốt, CTA, metadata ba nền tảng (sau khi sửa lỗi gõ).
- Quyết định renderer `pillow-ffmpeg` và `renderer_reason`.

KẾT LUẬN: CẦN SỬA
