# Review kịch bản IT-T9-E01 · vòng 2 (Claude duyệt)

Chấm theo chuẩn giải thích sâu hiện hành (D1–D7, Y1–Y8, R1–R19), như vòng 1.

## Đối chiếu 4 điểm bắt buộc của vòng 1

1. Biên thời lượng: Đạt. Tổng 172,00 s (dư 8 s so với trần 180 s). Tôi cộng lại 27 cảnh: các mốc cảnh khớp cột Tổng, bảng ngân sách 514 âm tiết, 119,17 s đọc, 52,68 s nghỉ, đuôi 0,15 s.
2. Lặp ý: Đạt. S05–S07 còn 4,25/4,25/4,5 s, S14 và S19 còn 5 s. Dòng ẩn chỉ ở 55 s (S11), trả lời ở 162,5 s (S26). Chấp nhận.
3. Plugin/công cụ: Đạt. L22 "Mỗi công cụ, hay plugin, có phần mô tả công dụng", bảng thuật ngữ đã thêm S10 L22. Các lời sau dùng thống nhất.
4. Nguồn CSA: Đạt. Đã bỏ, còn OWASP (MCP03, Cheat Sheet mục 1, mục 2, Rug Pull), Trail of Bits, đặc tả MCP, Unicode FAQ. Hết [CẦN KIỂM NGUỒN]. Các liên kết này đã được tôi kiểm ở vòng 1.

## Bảng chấm

| # | Tiêu chí | Kết quả | Lý do |
|---|---|---|---|
| 1 | Bám phán quyết | Đạt | Opening, hook "Tổng đúng. File đã gửi.", 27 cảnh, bộ đếm 0, giữ L05 theo phán quyết. |
| 2 | Giữ chân / chiều sâu | Đạt | Mạch Storytelling → Problem → Explanation → Solution rõ, câu hỏi mở ở S03, trả lời S26. R11 (trước/sau S15–S16, S25), R13, R14, R15 có. Y6 nhịp đọc 4,24–4,48 âm tiết/s. |
| 3 | Đủ chi tiết cho Producer | Đạt | Mốc voice cộng đúng, bản đồ ngữ nghĩa đủ 67 lời, thuật ngữ và cách đọc có, nhãn [dẫn]/[kỹ thuật], Cáo 36,5 s/172 s ≈ 21% (nằm trong 15–25%), không chép lời vào cột chữ. |
| 4 | Chính xác | Đạt | Nguồn đã kiểm, không còn mục chưa xác nhận. |
| 5 | Làm được & an toàn | Đạt | Chỉ hình học, text engine, VieNeu; có khai báo AI và "(ví dụ dựng)" ở mô tả. |
| 6 | Văn phong | Đạt | Giọng Cáo ngắn, thân thiện, tiếng Việt chuẩn. |

## Ghi chú nhỏ (không bắt buộc sửa)

1. Nghỉ chiếm 52,68 s (khoảng 31%). Khi TTS thật chậm hơn dự kiến thì có thể thêm 5–8 s, vẫn còn biên ~8 s. Producer đo lại sau TTS và dùng `qc-measure` để kiểm độ tĩnh ở S11, S12, S16.
2. S16 có hai nhãn chữ và bốn phần tử hình trong 16 s. Đạo diễn hình ảnh nên kiểm ở 360×640.
3. L05 "Đây là ví dụ dựng." giữ theo phán quyết; có thể chuyển hẳn sang mô tả nếu thiếu nhịp.

KẾT LUẬN: DUYỆT
