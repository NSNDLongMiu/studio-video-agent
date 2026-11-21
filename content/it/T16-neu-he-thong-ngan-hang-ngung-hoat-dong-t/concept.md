# Concept · IT-T16 · "Một cuốn sổ, mọi cánh cửa"

Chủ đề giám đốc giao (#16): Nếu hệ thống ngân hàng ngừng hoạt động trong 24 giờ, chuyện gì sẽ xảy ra?

## Concept đã chốt và lý do
Theo `debate.md`, mục "Phán quyết cuối": bản lai ba giọng cùng chọn.
- **Trục cơ chế (Claude C-1):** QR, app và ATM đều phải hỏi một hệ thống lõi nơi ghi số dư. Lõi không trả lời thì các kênh cùng đứng. Đây là **cơ chế chính duy nhất**.
- **Hook (Codex X-1):** QR ở quầy cơm báo "Chưa xác nhận", suất cơm đang chờ.
- **Sai lầm thường gặp (Codex X-2):** thấy lỗi là bấm gửi lại; nếu lệnh đầu đã được ghi, gửi lại có thể thành hai lệnh.
- **Một câu đời thường thay cho thuật ngữ (phân xử 1):** "Hệ thống thà dừng còn hơn ghi sai." Không đọc tên ACID.
- **Một câu số liệu (phân xử 2):** NAPAS, năm 2025, bình quân hơn 32 triệu giao dịch mỗi ngày.
- **Không khẳng định tuyệt đối "tiền còn nguyên" (phân xử 3):** ba tầng: ý chung "báo lỗi chưa có nghĩa là mất tiền"; cơ chế "sổ ghi số dư"; giới hạn "lệnh nào đã được ghi, chỉ lịch sử và thông báo chính thức mới xác nhận". Câu Cáo "Nó không mất…" của phán quyết đã đổi thành "Báo lỗi chưa có nghĩa là mất tiền." theo ghi chú người điều phối.

Đã loại: split-brain, 803 giờ ở Anh, mốc giờ cụ thể, tên ngân hàng hoặc NAPAS làm "điểm chết", nhãn đốt lên hình, câu gợi rút tiền.

## Khán giả
Dân văn phòng Việt Nam dùng QR và app ngân hàng hằng ngày. Không cần biết thuật ngữ trước.

## Giọng điệu
Cáo văn phòng theo `docs/mascot.md`: xưng "mình", gọi "bạn", câu ngắn một ý, bình tĩnh, không gây hoảng. Đây là **kịch bản giả định**: không tên ngân hàng thật, không giả tin sự kiện thật, không khuyên rút tiền. Giọng đọc nói rõ "mình dựng thử" ở giây 5; chữ "ví dụ dựng" chỉ ở caption.

## Lời hứa của video
Một câu hỏi (có tiền sao chưa trả được), một cơ chế (mọi kênh hỏi một hệ thống lõi), một ví dụ (quầy cơm, bấm gửi lại), một việc làm được (kiểm tra lịch sử và thông báo chính thức trước khi thử lại).

## Hook, ích lợi, câu hỏi mở
- **Hook đã chọn:** "Có tiền trong tài khoản, sao chưa trả được?" (kiểu câu hỏi gây tò mò), kèm hệ quả nhìn thấy: QR hiện "Chưa xác nhận", suất cơm chờ. Hệ quả rõ trước giây 5; ba kênh cùng đứng ở giây 5–9.
- **Ích lợi đầu tiên:** "Báo lỗi chưa có nghĩa là mất tiền." ở giây 9,6–11,4.
- **Câu hỏi mở → trả:** hỏi ở giây 0,6; trả ở giây 12,0 ("Các kênh thường phải hỏi một cuốn sổ trước"), cơ chế đầy đủ ở giây 20,8–28.
- **Kết:** quay lại quầy cơm đã mở. "Kiểm tra trước, thử lại sau." Không hứa kết quả giao dịch. Rồi hỏi bình luận: bấm lại hay kiểm tra lịch sử.

## Mạch Storytelling – Problem – Explanation – Solution
Storytelling (S01–S02) → Problem (S03–S04: câu hỏi và quy mô) → Explanation (S05–S06 cơ chế; S07 sai lầm; S09 giới hạn của dự phòng) → Solution (S08 kiểm tra, S10–S11 trả hook và kêu gọi).

## Bộ câu thoại Cáo (đã đối chiếu `docs/mascot.md`)
- Mở: "Có tiền trong tài khoản, sao chưa trả được?"
- Giữa: "Báo lỗi chưa có nghĩa là mất tiền." / "Các kênh thường phải hỏi một cuốn sổ trước."
- Sai lầm: "Khoan bấm gửi lại!"
- Kết: "Quay lại quầy cơm: kiểm tra trước, thử lại sau."
- Mời bình luận: "Bạn thường làm gì đầu tiên khi giao dịch báo lỗi: bấm lại, hay kiểm tra lịch sử?"

Hook đã dùng (ghi để theo dõi): kiểu "Câu hỏi gây tò mò" gắn tình huống quầy cơm.
