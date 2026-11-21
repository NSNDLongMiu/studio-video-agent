# Review kịch bản IT-T9-E01 · vòng 2 (sau D8)

Đã tự kiểm lại các số Codex báo, không dùng số tự báo.

## Số đo kiểm lại
- Cộng dồn bảng cảnh: S00 2,40 s, 27 cảnh nội dung, tổng 179,68 s. Mốc mỗi cảnh khớp bảng ngân sách (đã cộng tay từng dòng).
- Hook: lời đầu 2,40 s, file chạm khay 4,60 s, log 4,87 s. Đạt Y5.
- Kinetic: 2,62 / 24,09 / 37,81 / 55,24 / 79,22 / 103,94 / 124,60 / 144,56 / 154,71 / 169,94 s. Khoảng cách lớn nhất 24,72 s (≤25 s), không có hai cảnh liền nhau. Đạt.
- Header: có đủ S01–S27, ô đổi theo cảnh, khớp bảng ô trong `plan.md`. Đạt.
- Nền theo mã A..J: dài nhất 4 cảnh liền (S00–S03 office, S15–S18 security). Tỷ trọng security 27,4%, code 25,5%, office 25,3%, incident 22,3%. Đạt.
- Cáo: S01, S03, S09, S17, S20, S26, S27 cộng 23,46 s = 13,1%. Đạt (≲15%).
- Nhãn đồng thời: tối đa 3 nhóm chữ ngoài phụ đề (đỉnh ở S12, 72,43–76,98 s), trong giới hạn `plan.md`.
- Tốc độ: lấy mẫu L25 và L43 (≈4,7 âm tiết/s) khớp hệ số 4,68.
- Nguồn: OWASP MCP03 Tool Poisoning xác nhận có thật, rug pull và tool pinning khớp mô tả của tập.

## Chấm tiêu chí
| # | Tiêu chí | Kết quả | Lý do |
|---|---|---|---|
| 1 | Bám phán quyết | Đạt | Giữ concept, ví dụ 2 + 3 = 5 và file góc khuyết. Thêm S00 và S19 đúng hướng góp ý vòng 1. |
| 2 | Giữ chân, mạch, D8 | Đạt | S00 là opening riêng 2,40 s, chưa có lời. Hook có hệ quả trước giây 5. Trả phần đầu ở 55,24 s, trả trọn ở 169,94 s. Bảng Chiều sâu R15 đủ sáu câu có ví dụ. Mỗi cảnh có Bằng chứng hình, khai độ phức tạp và giữ sau lời. Có đối chiếu hợp lệ và độc hại ở S19. Trạng thái sự cố đổi nhiều lần rồi trả đúng chỗ ở S26. |
| 3 | Đủ chi tiết cho Producer | Đạt | Có bản đồ ngữ nghĩa kèm cột "Cần nhãn", nhãn có mốc tuyệt đối, bảng cách đọc và ngân sách. Không cắt câu thành slide. Plan ghi nền, bìa, header. |
| 4 | Chính xác | Đạt | Nguồn khớp. Không còn `[CẦN KIỂM NGUỒN]` bỏ ngỏ. |
| 5 | Làm được, an toàn | Đạt | Chỉ dùng hình học, silhouette, text engine. Mô tả có khai báo AI. Không nhãn đốt lên hình. |
| 6 | Văn phong | Đạt | Giọng Cáo ngắn, tiếng Việt chuẩn. |

## Ghi chú nhỏ (không bắt buộc sửa)
1. Tổng 179,68 s sát trần Shorts 180 s (dư 0,32 s). Sau TTS đo lại, nếu vượt thì rút nghỉ Y7 ở S11/S16 (mỗi cảnh nghỉ 6+ s) trước, không tăng tốc giọng.
2. S13 nhãn «Quyền thực thi» còn lời đọc là "quyền phù hợp". Producer có thể đổi nhãn thành «Quyền phù hợp» hoặc giữ nếu storyboard có lý do.
3. Link OWASP MCP03 ở mục nguồn nên dùng đường dẫn chuẩn `https://owasp.org/www-project-mcp-top-10/2025/MCP03-2025–Tool-Poisoning`.
4. Khoảng nghỉ tổng 54,27 s (30%) khá nhiều. Storyboard phải bảo đảm mỗi nghỉ dài đều có chuyển động, đã ghi trong cột âm thanh.

KẾT LUẬN: DUYỆT
