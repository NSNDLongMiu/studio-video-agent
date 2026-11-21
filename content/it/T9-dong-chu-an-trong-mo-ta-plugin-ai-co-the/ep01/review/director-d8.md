# Giám đốc trả T9 bản đầu — storyboard về DRAFT để sửa theo D8 (19/11/2026 chiều)

Storyboard v1 (27 cảnh, đã APPROVED trước đây) **không còn hiệu lực** vì không đạt D8 (R20–R23): không có cảnh opening riêng; header ẩn ở 24/27 cảnh; 19/27 cảnh không có chữ minh hoạ và các thuật ngữ trong `semantic_plan` không hiện thành nhãn; chỉ 1 chỗ kinetic; nền `security` 11 cảnh liền; giọng cắt cụt đầu/đuôi câu (phần Producer). Căn cứ: `docs/audit-T9.md`, `docs/chat-luong-xem.md` D8, brief.md (phần bổ sung 19/11/2026 chiều).

Phải sửa (giữ mạch, hook, ví dụ 2 + 3 = 5 đã duyệt; sửa, không viết lại):
1. Thêm **cảnh opening riêng** (`role: opening`, 1–3 s, chưa có lời), hook vào sau opening; cập nhật mốc toàn bộ, tổng ≈ 175–185 s (bổ sung phần giải thích có minh hoạ, không kéo bằng chậm giọng).
2. **Header xuyên suốt:** bỏ `hidden_scenes`; mỗi cảnh khai `header_slot` (`top|top_left|top_right|above_captions`) sao cho không đè sơ đồ/nhãn/Cáo/phụ đề; header ≥ 52 px, ≤ 9% khung.
3. **Keyword thật sự có chữ:** `semantic_plan.texts` cho mọi thuật ngữ/đối tượng được gọi tên (gắn `attach_to`, mốc xuất hiện ≤ 0,5 s sau lời), ≥ 80% cảnh có chữ minh hoạ, 20–45 từ/phút, kinetic ≥ 1/25 s ở cảnh trọng tâm (≤ 1/cảnh, không hai cảnh liền); thành phần được gọi tên có icon/nhãn nhận diện được (không khối trừu tượng không tên).
4. **Nền đa dạng:** ≤ 4 cảnh liền cùng chủ đề nền, mỗi chủ đề ≤ 40%; Cáo ≲ 15%.
5. Vẫn đúng: Information Pacing, hook có tình huống, speech pace 4,6–4,8 âm tiết/s, không nhãn «AI tạo»/«Ví dụ dựng».
