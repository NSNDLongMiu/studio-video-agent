# Review kịch bản vòng 2 — IT-T5-E01 «Chia rồi, vẫn đầy?»

Người review: Claude (planner). Đã đọc: script-r1.md, concept.md, plan.md, ep01/script.md, docs/chat-luong-xem.md (Y6–Y7, mục ngân sách). Không đọc T3/T4.

## Kiểm từng điểm góp ý vòng 1

| # | Điểm r1 | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Trùng nghĩa «khoá» | ĐÃ SỬA | Lời 4 «chia các dòng theo một cột», Lời 5 «cột đó là ngày tạo đơn», Lời 15 «khoá bảng». Nhãn S02 «Ngày tạo», S06 «Khoá bảng». Chỉ còn «khoá» trong mô tả YouTube (chữ đọc, không ảnh hưởng lời) |
| 2 | Nối «partition» với «khay» | ĐÃ SỬA | Lời 7 «Mỗi khay là một partition, chung một bảng.», viền xanh lam + nhãn «Partition» ở 14,05 s |
| 3 | Archive không phải lệnh | ĐÃ SỬA | Lời 12 «Archive không phải lệnh, mà là quy trình lưu trữ.» + nhãn «Tuỳ hệ quản trị» |
| 4 | S06 quá nhiều chữ | ĐÃ SỬA | Chỉ một nhãn «Khoá bảng»; chi tiết CONCURRENTLY đưa vào mục nguồn |
| 5 | «Tra thử» → kiểm đủ | ĐÃ SỬA | Lời 14 «Kiểm đủ bản sao.» |
| 6 | Y7 ba chỗ nghỉ thấp | ĐÃ SỬA | Lời 16 nghỉ 0,80; Lời 11→12 nghỉ 0,85; Lời 17 nghỉ 0,70. Các nghỉ 0,40 còn lại (Lời 2, 13, 14, 15) nằm ở đầu dải sau dấu chấm 0,4–0,7, có hình đi kèm; chấp nhận |
| 7 | Lập lại ngân sách | ĐÃ SỬA | Plan và script cùng 41,96 s, mốc 4,25 âm tiết/s ghi là giả định chờ đo TTS, đuôi 0,70 s |
| 8–11 | Điểm nên sửa | ĐÃ SỬA | TikTok «có thể giúp… (ví dụ dựng)»; Lời 11 «Truy vấn (query)»; concept câu kho lưu đã rõ nghĩa; tỉ lệ Cáo cập nhật |

## Tự đếm lại ngân sách

- Âm tiết 18 lời (Partition 3, query 2, Archive 2, PostgreSQL 4): 4+5+4+9+8+7+10+3+7+4+13+11+5+4+10+6+5+7 = **122**, khớp.
- Giây đọc (theo hệ số từng nhãn): 0,91+1,14+0,91+2,18+1,94+1,70+2,43+0,71+1,70+0,91+3,15+2,67+1,21+0,97+2,43+1,46+1,14+1,60 = **29,16 s**, khớp.
- Nghỉ: 1,00+0,40+0,80+0,55+0,80+0,70+0,70+0,90+1,30+0,80+0,85+0,60+0,40+0,40+0,40+0,80+0,70+0 = **12,10 s**, khớp.
- Tổng = 29,16 + 12,10 + 0,70 = **41,96 s** ≤ 45 s, đệm 3,04 s. Bảng plan (8 dòng gộp) cộng lại cũng 41,96. Mốc giây các cảnh nhất quán với bảng.
- Cáo: 4,37 + 4,71 + 4,14 = 13,22 s, 31,5% (đúng bản đồ plan, trong dải 15–25% chỉ áp dụng khi cùng minh hoạ; hành vi R6 có mô tả).

## Bảng chấm

| # | Tiêu chí | Kết quả | Lý do |
|---|---|---|---|
| 1 | Bám phán quyết | ĐẠT | Hook «Chia rồi, vẫn đầy?», đáp án ở 21,68 s (trước 25 s), pruning «có thể», sao chép → kiểm → xoá, khoá, vạch hạ sau khi bỏ bản. Không chào cố định |
| 2 | Giữ chân (Y5) | ĐẠT | Hình + câu ngắn trong 2 s, hệ quả trước 5 s, mạch Storytelling–Problem–Explanation–Solution, kết trả vấn đề + câu hỏi tự nhiên, nhãn «Ví dụ dựng» |
| 3 | Đủ chi tiết cho Producer | ĐẠT | Đúng cột, nhãn `[dẫn]`/`[kỹ thuật]`, Y7 đi cùng hình/âm, bảng thuật ngữ Y8, chữ bắt buộc, bản đồ Cáo, nền, nghĩa màu, chip R7, ngân sách ≤ 45 s |
| 4 | Chính xác | ĐẠT | Đối chiếu tài liệu PostgreSQL/MySQL ở r1, không đổi nội dung kỹ thuật; lời chỉ nêu PostgreSQL cho khoá. Không còn mục chưa kiểm nguồn |
| 5 | Làm được & an toàn | ĐẠT | Chỉ nguồn trong asset-sources, không nhạc, có câu khai báo AI cả ba nền tảng |
| 6 | Văn phong | ĐẠT | «Mình»/«bạn», câu ngắn, thuật ngữ được giải thích bằng hình |

## Ghi chú không bắt buộc

1. Mốc 4,25 âm tiết/s vẫn là giả định; Producer đo TTS và gửi lại timeline. Nếu vượt 45 s, dùng dự phòng đã ghi (bỏ Lời 8, rồi rút Lời 11).
2. Mô tả YouTube còn «theo khoá»; có thể đổi thành «theo một cột (khoá chia)» cho nhất quán. Không bắt buộc.
3. Phát âm Partition/query/Archive/PostgreSQL vẫn CHƯA KIỂM, chờ giám đốc nghe.

KẾT LUẬN: DUYỆT
