### 1. Dữ liệu web: Phong toả một phần hay toàn bộ?
Theo **Khoản 1 Điều 11 Nghị định 52/2024/NĐ-CP** (về thanh toán không dùng tiền mặt, nguồn: [chinhphu.vn](https://chinhphu.vn/default.aspx?pageid=27160&docid=210214)), tài khoản thanh toán bị **"phong tỏa một phần hoặc toàn bộ số dư"** khi có quyết định hoặc yêu cầu bằng văn bản của cơ quan có thẩm quyền. 
Pháp luật không mặc định phong toả toàn bộ. Do đó, **Claude phản đối Codex 2 là hoàn toàn chính xác**: khẳng định "khoá sạch/toàn bộ tài khoản" là sai luật; chỉ được nêu "có thể bị phong toả một phần hoặc toàn bộ tài khoản".

---

### 2. Trả lời phản biện của Claude
- **Gemini 1 (Nhận):** Nhận lỗi badge "-150 triệu" dễ gây hiểu lầm bị trừ tiền ngay và lỗi ấn định số 150 triệu. Tiếp thu: dùng khung phạt hành chính "100–150 triệu" theo NĐ 340/2025/NĐ-CP; dùng cụm "có thể là tiền lừa đảo".
- **Gemini 2 (Nhận & Bảo lưu góc tiếp cận):** Nhận lỗi dùng từ vượt brief ("rửa tiền", "giữ sạch tiền"). Tuy nhiên, xin bảo lưu xung đột đời sống (không chuyển được tiền sinh hoạt/tiền nhà) vì tạo stakes rất mạnh với người trẻ; sửa bằng cách gắn ngay tin nhắn nhờ mượn ở giây 1–2.
- **Gemini 3 (Nhận):** Nhận lỗi thuật ngữ "trát mời" (sửa: "yêu cầu giải trình") và lý do từ chối bịa đặt. Tiếp thu: giữ góc tâm lý cả nể nhưng hướng dẫn từ chối thẳng thắn dựa trên luật.

---

### 3. Bản cải tiến: "Nhận hộ một lần, kẹt cả tiền nhà" (Bản lai Gemini 2 + Codex 2 + Codex 3)
- **Tên:** Nhận hộ một lần, kẹt cả tiền nhà.
- **Hook (≤ 2s):** Cáo nhận tin nhắn bạn thân: *"Cho tao mượn tài khoản nhận hộ 5 triệu một lát nhé!"* — Cáo cả nể bấm "OK".
- **Nhịp:**
  - **0–3s:** Tin nhắn mượn tài khoản; Cáo nhận lời.
  - **3–15s:** Cáo chuyển tiền nhà thì app báo lỗi giao dịch: tài khoản bị phong toả số dư theo yêu cầu xác minh dòng tiền; kèm thông báo yêu cầu giải trình.
  - **15–45s:** 5 triệu nhận hộ có thể là tiền lừa đảo. Khi cơ quan chức năng điều tra, tài khoản đứng tên Cáo có thể bị phong toả một phần hoặc toàn bộ. Bóc ngộ nhận: tưởng "chỉ một lần là thoát", nhưng Khoản 5a Điều 30 NĐ 340/2025/NĐ-CP quy định cho mượn từ 1 đến dưới 10 tài khoản bị phạt 100–150 triệu đồng.
  - **45–60s:** Trả lời câu hỏi mở (giây 48): Cáo phải đến cơ quan chức năng giải trình trung thực. Cách từ chối bạn bè chuẩn luật: *"Tài khoản chính chủ gắn định danh, luật cấm cho mượn, phạt từ 100 triệu đấy!"*
- **Cơ chế chính:** Tiền lừa đảo chuyển qua tài khoản đứng tên mình dẫn đến bị phong toả tài khoản và phạt hành chính 100–150 triệu đồng theo NĐ 340/2025/NĐ-CP.
- **Sai lầm thường gặp:** Tưởng "chỉ nhận hộ một lần" thì vô can; tưởng tiền vào rồi chuyển đi ngay là không liên quan.
- **Câu chốt:** "Tài khoản là định danh cá nhân — nể bạn vài phút, giải trình mệt mỏi, phạt tiền trăm triệu."
- **Tín hiệu:** Cụm từ tìm kiếm xu hướng: *"cho mượn tài khoản ngân hàng bị phạt bao nhiêu"* và cảnh báo của Cục An ninh mạng (30/10/2026) về tài khoản trung gian nhận tiền lừa đảo.
- **Rủi ro còn lại:** Cần bố cục màn hình gọn trong 15s đầu để người xem kịp nắm cả 2 sự việc (tin nhắn mượn và lỗi chuyển tiền nhà) mà không bị rối.