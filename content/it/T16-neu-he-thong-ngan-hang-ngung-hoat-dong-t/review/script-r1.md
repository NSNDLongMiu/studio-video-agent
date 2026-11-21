# Review kịch bản IT-T16-E01 · vòng 1 (Claude chốt)

Codex vắng, không có đóng góp Codex ở bản 1 (2 lượt mã 8 KHONG_RA_FILE). Gemini vắng: LIMIT/NO_ACCOUNT, không có kiểm chứng Gemini ở bản 1; Claude tự mở nguồn.

## Chấm 6 tiêu chí
| # | Tiêu chí | Kết quả | Lý do / bằng chứng |
|---|---|---|---|
| 1 | Bám phán quyết | Đạt | Một cơ chế (kênh hỏi lõi), hook quầy cơm "Chưa xác nhận", không chào cố định, đúng chủ đề giả định. |
| 2 | Giữ chân | Đạt | Tình huống mở ngay S01, hệ quả trước giây 5 (QR chờ, ba cổng đỏ ở 6,5–7,3 s), câu hỏi trả ở ~12 s, S10 trả đúng khung S01, kết hỏi mở. 11 cảnh/≈60 s (≥5 s/cảnh), trạng thái hook đổi 5 lần, có cặp Ghi sai/Dừng. |
| 3 | Đủ chi tiết Producer | Đạt | Đủ bảng cảnh, bản đồ ngữ nghĩa, R24, nhãn [dẫn]/[kỹ thuật], thuật ngữ, ngân sách (≈60,1 s sau chỉnh, trong 45–75 s). Lưu ý nhỏ: mốc giây gốc chưa dịch +0,7 s từ S05, đã ghi chú ở mục Mốc lời. |
| 4 | Chính xác | Đạt (sau sửa) | Xem bảng nguồn bên dưới. |
| 5 | Làm được & an toàn | Đạt | Không tên ngân hàng/sự kiện thật, không khuyên rút tiền, có câu khai báo AI. |
| 6 | Văn phong | Đạt | Giọng Cáo gần gũi, tiếng Việt chuẩn. |

## Xử lý đề xuất Codex
Codex vắng, không có đóng góp Codex: 0 đề xuất nhận / 0 bác.

## Xử lý kiểm chứng Gemini
Gemini vắng: LIMIT/NO_ACCOUNT: 0 dòng nhận / 0 bác. Còn SAI: 0; CHƯA XÁC MINH còn lại: quy định dự phòng của NHNN (đã ghi vào plan.md).

## Kiểm nguồn tự mở (20/11/2026)
| Câu | Kết quả | Hành động |
|---|---|---|
| L05 NAPAS | ĐÚNG: trang NAPAS gốc ghi "Trung bình hệ thống xử lý bình quân hơn 32 triệu giao dịch/ngày"; không nêu số riêng QR/ATM. Là quy mô cả mạng liên ngân hàng, dễ hiểu nhầm là một ngân hàng. | Sửa lời 05: "mạng liên ngân hàng NAPAS bình quân hơn..."; nhãn hình "NAPAS 2025 · liên ngân hàng". |
| L04/L06 mọi kênh hỏi lõi | KHÔNG tuyệt đối: mạng thẻ có stand-in (mạng/bộ xử lý duyệt thay ngân hàng phát hành khi không đáp), thiết bị có chế độ ngoại tuyến (Marqeta, Shift4). | Làm mềm: "Các kênh thường phải hỏi...", "QR, app hay ATM thường hỏi...". |
| L09 atomicity | ĐÚNG: IBM "either all operations ... occur or none occurs". | Bỏ nhãn CẦN KIỂM NGUỒN. |
| L11 retry | ĐÚNG: Worldpay "A timeout is an unknown, not a failure"; "Retrying payment calls risks creating duplicate transactions". | Giữ "có thể". |
| L13 dự phòng | CHỈ ĐÚNG MỘT PHẦN: Red Hat chỉ nói lưu trữ đồng bộ thành điểm lỗi đơn nếu thiếu khả năng chịu lỗi. | Làm mềm lời: "nếu chung một điểm lỗi thì cả hai vẫn có thể đứng"; ghi plan: chưa đối chiếu quy định NHNN. |

## Việc còn phải sửa
Không bắt buộc. Producer canh lại mốc theo TTS (+0,7 s từ S05).

KẾT LUẬN: DUYỆT
