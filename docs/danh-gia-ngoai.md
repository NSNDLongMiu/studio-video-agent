# Đánh giá ngoài — cách nhờ và cách phân loại (19/11/2026)

Khi giám đốc đưa video cho người hoặc AI khác chấm, nhận xét hữu ích nhưng thường thiếu bối cảnh (không nghe được tiếng, không biết luật xưởng). Thư ký **phân loại từng nhận xét bằng số đo**, không làm theo nguyên văn và không bỏ qua.

## Gói nên gửi cùng video
- Tệp mp4 và `captions.srt`; cột “Lời đọc” của `script.md` (để chấm mạch kể, hook, kết).
- Ràng buộc cố định: 9:16, thời lượng theo định dạng (chuẩn 45–75 s từ 20/11/2026; giải thích sâu 150–190 s và ngắn ≤ 45 s chỉ khi giám đốc yêu cầu); **không nhạc nền** (luật khi đánh giá, đã thay đổi 20/11/2026); giọng AI (Minh Đức); Cáo xuất hiện gián đoạn, tổng ≲ 25% (từ T9); **không nhãn AI trên hình** (khai báo ở mô tả và công tắc nền tảng).
- Người chấm không nghe được âm thanh thì ghi “chưa chấm giọng/phát âm”, không suy từ hình. Chữ nhỏ/lớn chỉ kết luận khi xem trên điện thoại thật.
- Nhờ chấm theo: 5 câu hỏi người xem lạ, R11 (bằng chứng hình), R12 (đa dạng cảnh), R13 (Information Pacing: tốc độ kiến thức, thời gian quan sát sơ đồ) trong `docs/chat-luong-xem.md`. Nhận xét giám đốc về T8 (19/11/2026) đã phân loại ở `docs/audit-T8.md`.

## Cách phân loại
| Loại | Xử lý |
|---|---|
| Đúng và mới | Sửa luật hoặc công cụ, ghi vào `docs/chat-luong-xem.md` |
| Đúng nhưng luật đã có (lỗi ở khâu kiểm) | Sửa cách kiểm, thêm số đo |
| Không áp dụng (thiếu thông tin/ràng buộc) | Ghi lý do, không đổi gì |
| Ý thích/ngưỡng | Nêu cho giám đốc quyết; chỉ đổi ngưỡng thử |

## Ca đầu tiên — T5 (44,6 s), nhận xét ngày 19/11/2026
| Nhận xét ngoài | Kiểm chứng | Loại | Xử lý |
|---|---|---|---|
| Kể chuyện: giống slide, chưa có sự cố diễn ra (ưu tiên cao) | Hook 0–5 s và trả lời ở 21,7 s đúng Y5, nhưng 5–38 s trạng thái sự cố hầu như đứng yên và khẳng định chính dùng biểu tượng (“khoá bảng” chỉ là ổ khoá) | Đúng một phần | R11 |
| Bối cảnh các cảnh giống nhau (cao) | Storyboard: 12/18 cảnh, ≈ 33 s ≈ 75% cùng nền database, hai chuỗi 6 cảnh liền | Đúng | R12; Y4 diễn giải lại |
| Đồ hoạ như dashboard tĩnh (cao) | Đo khối cục bộ: tĩnh thật 31%, đoạn tĩnh dài nhất 1,2 s; nhưng ba cảnh cốt lõi (S02-L07, S04-L11, S05-L12) chỉ đổi đường mảnh | Đúng một phần | R11 + số đo `qc-video --scenes` |
| Chữ nhỏ trên điện thoại (cao) | Phụ đề 56 px ≈ 5,2% bề ngang; chưa đo trên máy thật | Ý thích/ngưỡng | Thử 64 px ở T6, giám đốc xem điện thoại rồi chốt |
| Cáo chưa tương tác với vấn đề (trung bình) | Cáo ≈ 31% thời lượng, 3 dáng tĩnh cố định ở góc dưới trái | Đúng | R6 giữ; thiếu dáng nhìn/chỉ theo hướng → việc của vai Linh vật sau demo |
| Nhịp hình, thiếu toàn/cận và chuyển động có mục đích (trung bình) | Storyboard khai 8 cảnh push_in/pan/tracking/pull_out; mã dựng không áp camera nào; QC không đối chiếu | Đúng, đây là gốc rễ | R12 “khai báo = dựng được”; bộ công cụ camera chờ giám đốc quyết |
| Nên có câu kết đọng lại hoặc câu hỏi sang tập sau | Lời 17–18: “Cất kho, kiểm xong mới xoá. Đơn cũ vẫn tra được. Bạn từng tra đơn cũ ở đâu?” — người chấm chỉ xem hình | Không áp dụng | — |
| “Mức cân bằng nhạc nền” | Luật khi đánh giá: không nhạc nền (đã thay đổi 20/11/2026, xem `docs/asset-sources.md`) | Không áp dụng | — |
| Nên mở bằng hậu quả (hệ thống chậm/khoá) | Mở bằng “Đơn mới chưa lưu được” + vạch kho đỏ | Đã có | — |

Bài học chung: luật đa dạng đã có từ trước (visual-director: tối đa 2 cảnh liên tiếp cùng bố cục/cỡ cảnh) nhưng chỉ kiểm trên **bản thiết kế**; thiết kế khai 4 cỡ cảnh và 8 chuyển động camera còn bản dựng thì phẳng. Từ T6 kiểm cả bản dựng bằng số đo.
