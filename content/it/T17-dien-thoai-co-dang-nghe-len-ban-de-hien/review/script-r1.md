# Review kịch bản IT-T17-E01 · bản 1 (Claude chốt, 20/11/2026)

## Xử lý đóng góp ngoài
- **Codex vắng, không có đóng góp Codex ở bản 1.** `codex-write.mjs script` gọi 2 lần (lần đầu + thử lại); cả hai lần Codex báo môi trường chặn đọc tệp nguồn và không ghi được `review/script-codex-r1.md` (exit 0 nhưng không có file).
- **Gemini vắng: không có kiểm chứng Gemini ở bản 1.** Lần đầu LIMIT (hồi sau ~4 giờ), thử lại NO_ACCOUNT. Claude tự kiểm bằng nguồn mở trực tiếp (dưới).

## Tự kiểm nguồn (mở trực tiếp 20/11/2026)
| Khẳng định | Nguồn mở | Kết quả | Xử lý |
|---|---|---|---|
| Lời 12: 2018, hơn 17.000 ứng dụng Android, không cái nào lén bật micro | Northeastern 06/07/2018 | ĐÚNG ("not a single app activated the microphone", "more than 17,000" Android) | Giữ; Lời 12 đã giới hạn "thử" |
| Lời 13 cũ "Họ không dám nói không bao giờ" | cùng bài | KHÔNG CÓ trong bài (bài chỉ nói chỉ thử Android, ~9.000 app có thể chụp màn hình, không có cách đóng lỗ hổng) | **SỬA**: Lời 13 = "Nhưng chỉ thử trên Android, hồi đó."; sửa bảng cảnh S08, voice_direction L13, Bản đồ ngữ nghĩa, plan (rủi ro) |
| Lời 14–15: 2024, bản chào bán "nghe chủ động" chỉ là lời quảng bá | 404 Media 26/08/2024 | ĐÚNG: Cox Media Group chào bán "Active Listening"; Google gỡ công ty khỏi Partners Program sau khi được hỏi; bài không có phản hồi công ty, không có bằng chứng kỹ thuật | Giữ; không gọi tên công ty; ghi vào nguồn |
| Lời 09–11, 16: dữ liệu hoạt động/đối tác được dùng chọn quảng cáo; xem qua tùy chọn quảng cáo | Meta Help "Why am I seeing this ad" | ĐÚNG: hoạt động trên nền tảng, thông tin nhà quảng cáo/đối tác chia sẻ, hoạt động ngoài nền tảng; không nhắc micro; trang nêu Ad preferences để quản lý | Giữ, lời đã có "có thể"; "hồ sơ quan tâm chạy bộ" là minh hoạ; tên mục theo nền tảng ghi giám đốc kiểm |
| Pixel (Lời 07 "bộ đếm") | Meta Business Help (tóm lược) | ĐÚNG ở mức nói chung (bộ đếm trên website ghi hành vi) | Giữ, ghi chú còn trong nguồn 6 |

## Chấm 6 tiêu chí
| # | Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Bám phán quyết | Đạt | Concept/hook đôi giày, không câu chào cố định, một câu hỏi, một cơ chế (dấu vết → hồ sơ → nhóm) |
| 2 | Giữ chân | Đạt | Tình huống ở 0–1,5 s, hệ quả "chưa tìm"/"nghe lén à?" trước 6 s, trả lời ở 7,05 s; 11 cảnh/67,6 s (6,1 s/cảnh); trạng thái mũi tên nguồn đổi 5 lần, kết trả về S01; có đúng/sai, trước/sau (S03, S08, S11); kết Y1 "TRÙNG ≠ BẰNG CHỨNG" |
| 3 | Đủ chi tiết Producer | Đạt | Đủ bảng cảnh, mốc lời, ngân sách, voice_direction, thuật ngữ (Y8), bản đồ ngữ nghĩa, bản đồ Cáo 21%, header đổi ô, bộ nền không > 40%. Ngân sách sau sửa Lời 13: +~2 âm tiết, hấp thụ bởi nghỉ/giữ của S08 (tổng vẫn ≈ 67,6 s) |
| 4 | Chính xác | Đạt (sau sửa) | Lỗi duy nhất là Lời 13 không có nguồn, đã thay; còn 2 mục [CẦN KIỂM NGUỒN] nhỏ chuyển cho giám đốc |
| 5 | Làm được & an toàn | Đạt | Đồ hoạ tự vẽ, không logo/tên hãng, không gọi tên công ty chào bán; có câu khai báo AI ở cả 3 mô tả |
| 6 | Văn phong | Đạt | Xưng "mình", gọi "bạn", giọng trấn an, không khẳng định tuyệt đối |

## Việc còn lại (không bắt buộc, cho giám đốc/Producer)
1. Giám đốc nghe kiểm cách đọc micro/clip/Android và nhịp S08 sau TTS (nếu > 72 s: rút Lời 13 hoặc gộp S04–S05 như plan).
2. Tên mục "Tùy chọn quảng cáo" khác theo nền tảng/quốc gia: lời nói chung, hình trung tính (đã ghi ở plan/script).
3. "Hồ sơ quan tâm chạy bộ" là minh hoạ cơ chế, không phải tên tài liệu hiện hành (đã làm mềm bằng "có thể").

KẾT LUẬN: DUYỆT SAU KHI CLAUDE SỬA NHỎ
(Đã tự sửa: Lời 13 và các chỗ nhắc liên quan trong `ep01/script.md` và `plan.md`; cập nhật mục Nguồn. Không viết lại cảnh/concept.)
