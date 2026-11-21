# Review kịch bản IT-T31-E01 — bản 1 (CHỐT, Claude)
Codex: có cùng viết (`script-codex-r1.md`). Gemini: đã kiểm chứng (`script-gemini-r1.md`).
Nguồn Claude tự mở 21/11/2026: Cloudflare nginx2root (nguyên văn tóm tắt: công bố 18/11, quyền nginx worker, leo root cần lỗi nhân riêng chưa công bố chi tiết); Docker security (cách ly "có thể chưa đầy đủ khi kết hợp lỗ hổng nhân"); Docker "What is a container" ("every container ... shares that machine's kernel", máy ảo có nhân riêng). Trang Red Hat trả 403 nên đã thay bằng nguồn Docker.

## Bảng chấm
| # | Tiêu chí | Kết quả | Lý do / bằng chứng |
|---|---|---|---|
| 1 | Bám phán quyết | Đạt | Đúng concept "vá web xong còn lớp nào"; hook là tình huống đóng ca, không câu chào cố định; ranh giới brief giữ (không root ngay, số máy, CVE/SCTP, cách khai thác) |
| 2 | Giữ chân | Đạt | S01 hộp cạnh đổi vàng giây 2,6 (hệ quả trước giây 5); câu hỏi mở S02 "Câu này sai ở đâu?" → trả S03 → trả đủ S09; 10 cảnh/58 s (≈5,8 s/cảnh); trạng thái sự cố đổi ≥ 3 lần; trước/sau S05, S08; kinetic S03, S10 |
| 3 | Đủ chi tiết cho Producer | Đạt | Đủ bảng cảnh, ngân sách (156 âm tiết, 58,0 s, tổng khớp), voice_direction theo line_id, thuật ngữ & cách đọc, bản đồ ngữ nghĩa, bằng chứng hình; "NHÂN MÁY CHỦ" thêm nhãn cho terminal |
| 4 | Chính xác | Đạt | Mọi khẳng định then chốt khớp nguồn đã mở; "có thể", "tuỳ cấu hình", "khi có bản" giữ ranh giới; không còn [CẦN KIỂM NGUỒN] |
| 5 | Làm được & an toàn | Đạt | Chỉ đồ hoạ vẽ, không logo/CVE; có câu khai báo AI trong mô tả; không tên nền tảng thật |
| 6 | Văn phong | Đạt | Cáo công sở, câu ngắn, tiếng Việt chuẩn |

## Xử lý đề xuất của Codex
| Đề xuất | Xử lý | Lý do |
|---|---|---|
| L04 thêm "có thể" ("Lỗi nhân có thể làm tường yếu đi.") | NHẬN | không phải lỗi nhân nào cũng làm hỏng cách ly; Docker dùng "may" |
| L05 "Với máy ảo, mỗi hộp có một nhân riêng." + hình chỉ một nhân khách nứt | NHẬN | bỏ "tường dày hơn" (suy luận, dễ hiểu tuyệt đối); Docker xác nhận nhân riêng |
| L06b "Tuỳ cấu hình, nginx có thể bị chiếm." + đỏ chỉ chip nginx | NHẬN | Cloudflare: quyền nginx worker, không phải cả container |
| S07: bỏ mũi tên từ web, thẻ lỗi nhân riêng có "?" | NHẬN | tránh gợi diễn tiến tự động; nguồn nói cần lỗi nhân riêng |
| S09: chỉ tick NHÂN sau xác nhận đã vá, `uname -r` chỉ để xem | NHẬN | `uname -r` chỉ báo bản nhân đang chạy; thêm chip `ĐÃ VÁ` rồi mới tick (50,3 s) |
| Bảng voice_direction L04, L05, L06b | NHẬN | gộp vào bảng R24 |

## Xử lý kiểm chứng của Gemini
| Dòng | Xử lý | Lý do |
|---|---|---|
| S03 đúng (Docker security) | NHẬN | tự mở, khớp |
| S05 đúng (Red Hat overview) | NHẬN có đổi nguồn | URL Red Hat khác trang ghi và mở không được; thay bằng Docker "What is a container" |
| S06 đúng; điều kiện HTTP/2 | NHẬN đúng; điều kiện chỉ vào ghi chú nguồn | Cloudflare nêu nhiều điều kiện; không đưa vào video (ranh giới brief) |
| S07 đúng | NHẬN | khớp Cloudflare/Invicti |
| S09 đúng; uname -r ra nhân máy chủ | NHẬN | thêm nhãn `NHÂN MÁY CHỦ` |
| Dễ hiểu sai 1 (S04, "ranh giới hở") | NHẬN một phần | thêm "có thể"; BÁC đổi "tường" thành "ranh giới" để giữ một ẩn dụ nhất quán với hình |
| Dễ hiểu sai 2 (S06) | NHẬN | dùng cách nói "nginx có thể bị chiếm" |
| Dễ hiểu sai 3 (S09) | NHẬN | nhãn terminal + lời nói "nhân máy chủ" |
| 3 phương án mở đầu | BÁC cả ba | giữ hook tình huống Y5; P1 khẳng định "máy chủ sập" quá, P2 "toang" nói quá, P3 giật tít "nhầm to" |
SAI còn lại: 0. CHƯA XÁC MINH còn lại: 0.

## Phát hiện thêm của Claude
Cloudflare nói chưa có bản vá nhân tính đến 18/11. Lời "Nên vá cả nhân" có thể mâu thuẫn, nhưng brief cấm nói tình trạng bản vá. Đã sửa lời S09 thành "Vá nginx, rồi vá cả nhân máy chủ khi có bản. Xong hết hãy đóng ca." (14 âm tiết). Đồng bộ concept, plan, mô tả đăng.

## Việc còn phải sửa
Không có việc bắt buộc. Ghi chú: giám đốc nghe cách đọc "nginx" (engine x), nhịp, và cụm "khi có bản"; Đạo diễn hình ảnh dựng chip nginx đỏ riêng, thẻ lỗi nhân S07, chip `ĐÃ VÁ` S09 đúng script.

KẾT LUẬN: DUYỆT
