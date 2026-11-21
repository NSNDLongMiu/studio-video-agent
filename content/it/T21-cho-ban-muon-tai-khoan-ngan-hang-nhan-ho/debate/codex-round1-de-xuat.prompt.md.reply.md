## Vòng 1 — Đề xuất độc lập

**Trọng tâm** — Bạn thân nhờ nhận hộ tiền. Với dân văn phòng và sinh viên, câu hỏi là “Một lần nhận hộ có sao không?” Thông điệp là từ chối cho mượn tài khoản. Nếu tiền lạ đã vào, liên hệ ngân hàng để được hướng dẫn. Nếu tiền liên quan đến lừa đảo, người đứng tên có thể phải giải trình và tài khoản có thể bị phong toả. Mức phạt 100–150 triệu đồng áp dụng cho hành vi cho mượn từ 1 đến dưới 10 tài khoản thanh toán theo dữ kiện brief.

**Dựng chung** — 9:16, 1080×1920, khoảng 60 giây. Mở ba pha trong 0–3s bằng Cáo → lời nhờ → dấu hiệu bất thường. Cáo PNG tĩnh ở mở, giữa, kết, đổi dáng bằng cắt, rộng 10–18% khi cạnh minh hoạ. TTS miễn phí, hiệu ứng tự tổng hợp nhỏ hơn lời đọc, có nhãn AI.

### 1. Tên ai trên giao dịch?

- **Hook ≤2s** — Cáo cạnh tin nhắn “Cho mượn tài khoản nhận hộ một lần?” Nhãn “Ví dụ dựng”.
- **Nhịp** — 0–3s thẻ tiền vào ghim tên Cáo. 3–15s hiện yêu cầu giải trình trước giây 5, rồi lần theo khoản tiền có thể liên quan đến lừa đảo. Kết giây 54 trả lời “Có. Tài khoản đứng tên bạn có thể bị phong toả.” Nêu cách xử lý, mời gõ câu từ chối.
- **Giữ chân và dựng** — FlowDiagram cho thấy tiền đi tiếp trong khi giao dịch đến vẫn gắn với tên Cáo. Sửa lầm tưởng “chuyển đi là xong”.
- **Rủi ro** — Luồng dễ trông như kết luận điều tra. Gắn nhãn “nghi liên quan”.
- **Tín hiệu** — [google gợi ý] “cho mượn tài khoản ngân hàng có sao không”.

### 2. Khoản tiền lạ, tiền nhà đang chờ

- **Hook ≤2s** — Cáo cạnh tin nhắn “Nhận hộ mình một lần nhé?” Nhãn “Ví dụ dựng”.
- **Nhịp** — 0–3s lịch nhắc tiền nhà hiện cạnh khoản tiền đến. 3–15s lệnh trả tiền nhà bị chặn ở giây 4, rồi tua lại để nối khoản nhận hộ với nguy cơ phong toả. Kết giây 55 trả lời bằng hệ quả và cách xử lý.
- **Giữ chân và dựng** — `timeline_steps` và thẻ trạng thái cho thấy việc nhận hộ có thể ảnh hưởng tiền của chính mình. Sửa lầm tưởng chỉ khoản tiền lạ bị ảnh hưởng.
- **Rủi ro** — Hiện “ví dụ phong toả toàn tài khoản” để tránh khái quát.
- **Tín hiệu** — [google gợi ý] “tài khoản ngân hàng bị phong toả khi nào”.

### 3. Một lần có tính không?

- **Hook ≤2s** — Cáo đọc lời bạn thân “Cho mượn tài khoản nhận hộ đúng một lần?” Nhãn “Ví dụ dựng”.
- **Nhịp** — 0–3s nhấn “một lần”. 3–15s đặt “một lần” cạnh “một tài khoản” trước giây 5, hiện khung phạt rồi minh hoạ dòng tiền. Kết giây 53 trả lời “Một tài khoản đã nằm trong khung” và chốt từ chối.
- **Giữ chân và dựng** — `comparison` bóc nhầm lẫn giữa số lần giao dịch và số tài khoản.
- **Rủi ro** — Gắn mức phạt với hành vi cho mượn.
- **Tín hiệu** — [google gợi ý] “cho mượn tài khoản ngân hàng bị phạt bao nhiêu”.