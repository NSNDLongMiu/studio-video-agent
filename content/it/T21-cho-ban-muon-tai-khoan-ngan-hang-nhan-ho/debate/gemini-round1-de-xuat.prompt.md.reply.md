**VÒNG 1 — ĐỀ XUẤT ĐỘC LẬP (GEMINI)**

*Kiểm chứng pháp lý:* Nghị định 340/2025/NĐ-CP (hiệu lực từ 09/02/2026, Điều 30 khoản 5a) quy định phạt tiền từ 100.000.000 đồng đến 150.000.000 đồng đối với hành vi mua, bán, thuê, cho thuê, mượn, cho mượn từ 1 đến dưới 10 tài khoản thanh toán (nguồn: [CafeF](https://cafef.vn/tu-9-2-2026-nguoi-co-tai-khoan-ngan-hang-thuc-hien-hanh-vi-nay-co-the-bi-phat-toi-150-trieu-dong-188261101074452133.chn)).

---

### Concept 1: "Nhận hộ 5 triệu, phạt 150 triệu" (Góc độ Cú sốc con số)
- **Tín hiệu:** [google gợi ý] "cho mượn tài khoản ngân hàng bị phạt bao nhiêu".
- **Hook (≤ 2s):** Tin nhắn dựng: "Cho tao mượn số tài khoản nhận hộ 5 triệu" → Đèn đỏ chớp, badge đè số dư: `-150.000.000đ` kèm nhãn "Tài khoản bị phong toả".
- **Nhịp:**
  - *0–3s:* Mở ba pha (nhận tin nhắn nhờ vả → tài khoản ting ting 5 triệu → dán nhãn phong toả & số phạt 100–150 triệu).
  - *3–15s:* Đặt vấn đề: Giúp bạn thân một lần, sao mất toi trăm triệu? Dẫn ngay Nghị định 340/2025/NĐ-CP (hiệu lực 09/02/2026).
  - *Kết (trả lời giây 52):* Cơ chế: Tiền nhận hộ thực chất từ nạn nhân lừa đảo; chủ tài khoản phải giải trình, bị cơ quan chức năng phong toả dòng tiền và xử phạt hành chính vì cho mượn tài khoản. Chốt giải pháp: Tuyệt đối không đứng tên nhận tiền hộ bất kỳ ai.
- **Vì sao giữ chân:** Cú sốc chênh lệch cực đoan giữa "giúp 5 triệu" và "gánh phạt 150 triệu", đánh thẳng vào túi tiền người xem.
- **Cách làm với công cụ hiện có:** Panel chat mô phỏng, bộ đếm số phạt nhảy từ 0 → 150.000.000đ, sơ đồ luồng tiền có gói dữ liệu đỏ chuyển trạng thái `blocked`, Cáo dáng hốt hoảng, header xuyên suốt "MƯỢN TÀI KHOẢN: PHẠT 100–150 TRIỆU".
- **Rủi ro thừa nhận:** Người xem dễ hiểu nhầm cứ nhận tiền hộ là tự động bị phạt ngay; cần nhấn rõ điều kiện: chỉ phạt khi cơ quan chức năng xác định hành vi cho mượn tài khoản và dính líu dòng tiền vi phạm.

---

### Concept 2: "Bẫy dòng tiền đen: Vì sao tài khoản bị khoá sạch?" (Góc độ Truy vết dòng tiền)
- **Tín hiệu:** [google gợi ý] "tài khoản ngân hàng bị phong toả là sao" & [ytb gợi ý] "tại sao tài khoản ngân hàng bị khoá".
- **Hook (≤ 2s):** Màn hình giao diện generic: Thao tác chuyển tiền thất bại → Pop-up cảnh báo: "Tài khoản bị phong toả theo yêu cầu cơ quan thẩm quyền".
- **Nhịp:**
  - *0–3s:* Cáo định quét mã trả tiền ăn trưa thì app báo lỗi tê liệt toàn bộ giao dịch.
  - *3–15s:* Câu hỏi lớn: Bạn không hề lừa đảo ai, tại sao tài khoản nhận lương bị đóng băng?
  - *Kết (trả lời giây 50):* Cơ chế: Kẻ gian mượn tài khoản để biến bạn thành trạm trung gian rửa tiền. Khi vụ việc bị điều tra, cơ quan chức năng phong toả toàn bộ chuỗi dòng tiền liên quan; bạn vừa bị giữ sạch tiền vừa đối mặt mức phạt 100–150 triệu (NĐ 340/2025/NĐ-CP).
- **Vì sao giữ chân:** Khơi gợi nỗi sợ tê liệt tài chính bất ngờ, giải thích cơ chế "chết chùm" của hệ thống truy vết ngân hàng.
- **Cách làm với công cụ hiện có:** Nền security/incident, sơ đồ timeline 3 bước truy vết (Kẻ lừa đảo → Tài khoản bạn → Rút tiền), badge trạng thái `bad`, hiệu ứng dòng dữ liệu `leaking`.
- **Rủi ro thừa nhận:** Cơ chế truy vết ngân hàng dễ bị khô cứng nếu sơ đồ quá nhiều chữ; cần tinh giản tối đa thành các biểu tượng trực quan.

---

### Concept 3: "Cả nể 5 phút, trả giá nửa năm lương" (Góc độ Tâm lý văn phòng)
- **Tín hiệu:** [google gợi ý] "có nên cho mượn số tài khoản ngân hàng không".
- **Hook (≤ 2s):** Lời đề nghị: "Cho mượn tài khoản 5 phút thôi, tao gửi cốc cà phê" → Cảnh báo pop-up: "Cốc cà phê giá 150 triệu!".
- **Nhịp:**
  - *0–3s:* Tình huống công sở điển hình: đồng nghiệp/bạn bè nhờ mượn tài khoản vì "tài khoản tao đang lỗi".
  - *3–15s:* Tình huống: Nể nang gật đầu, hôm sau nhận trát mời giải trình vì tài khoản nhận tiền lừa đảo.
  - *Kết (trả lời giây 54):* Cơ chế: Cho mượn tài khoản là vi phạm pháp luật (NĐ 340/2025/NĐ-CP phạt 100–150 triệu). Gợi ý cách từ chối thanh lịch ("Tài khoản công ty quản lý/đang khóa nhận tiền ngoài"). Kêu gọi nhẹ: "Bạn từng gặp lời nhờ này trên phở bò hay zép lào chưa?"
- **Vì sao giữ chân:** Đánh trúng căn bệnh "ngại từ chối người quen" của dân văn phòng và sinh viên; mang tính ứng dụng thực tế cao.
- **Cách làm với công cụ hiện có:** Bảng so sánh 2 cột "Cả nể vs Hậu quả", kinetic text nhấn từ khoá "TỪ CHỐI", Cáo dáng chào kết, hiệu ứng âm thanh cảnh báo tự tổng hợp.
- **Rủi ro thừa nhận:** Nghiêng về tình huống đời thường; nếu không ghim chặt con số phạt 100–150 triệu thì người xem dễ coi nhẹ là rủi ro xích mích cá nhân.