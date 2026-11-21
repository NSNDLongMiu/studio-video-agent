Đã đủ dữ liệu. Dưới đây là **3 concept độc lập** cho IT-T16-E01.

---

## VÒNG 1 — ĐỀ XUẤT ĐỘC LẬP (Giọng Gemini)

**Chủ đề:** "Nếu hệ thống ngân hàng ngừng hoạt động trong 24 giờ, chuyện gì sẽ xảy ra?"
**Đối tượng:** Dân văn phòng VN, dùng app ngân hàng/QR hàng ngày.
**Thông điệp chung:** Tiền vẫn ở đó nhưng mọi cánh cửa đều khoá — hiểu cơ chế phía sau để bớt hoảng.

---

### Concept 1 — "32 triệu giao dịch / ngày biến mất"

**Hook (0–2 s):** Cáo đang quét QR mua cà phê → màn hình đỏ "Giao dịch thất bại". Counter trên màn hình đếm ngược từ 32 000 000 → 0 (ví dụ minh hoạ). Lời: *"Mỗi ngày Việt Nam xử lý hơn 32 triệu giao dịch điện tử qua NAPAS. Nếu tất cả dừng lại?"* (Nguồn: NAPAS báo cáo 2025, napas.com.vn — tăng ~24% so 2024.)

**Nhịp:**
- **0–3 s:** Opening ba pha — visual_hook: QR lỗi; conflict: counter rơi; topic_reveal: "Hệ thống ngân hàng sập 24 giờ".
- **3–15 s:** Sơ đồ FlowDiagram: Điện thoại → App ngân hàng → NAPAS (nút trung tâm) → Core Banking → Database. Gói dữ liệu chạy dọc bình thường, rồi NAPAS chuyển status `blocked` → toàn bộ dừng. Giải thích: mọi chuyển khoản, QR, rút ATM đều qua hệ thống trung chuyển, khi nó chết = mọi "cánh cửa" khoá.
- **15–55 s:** Cơ chế chính: **Single Point of Failure ở tầng core database.** Comparison trước/sau: (trước) 1 server chính ↔ bản sao đồng bộ, heartbeat xanh; (sau) heartbeat đứt, server chính đỏ, bản sao chưa kịp lên. Timeline 3 bước: Giờ 1 — ATM/QR/app tê liệt; Giờ 6 — doanh nghiệp không trả lương; Giờ 24 — chuỗi cung ứng đứt (ví dụ minh hoạ). Sai lầm: nghĩ "tiền mất" → thực tế sổ cái vẫn lưu, chỉ giao dịch bị đóng băng. Bài học: hệ thống dự phòng (failover) tồn tại nhưng cần thời gian chuyển — không có gì "tức thì" tuyệt đối.
- **55–65 s:** Cáo tái xuất, tóm: *"Tiền bạn vẫn ở đó, chỉ là mọi con đường dẫn tới nó đều khoá."* CTA nhẹ: *"Bạn nghĩ mình sẽ cầm cự được bao lâu không tiền mặt? Gõ số giờ xuống bình luận."*

**Vì sao giữ chân:** Stakes cao và gần — ai cũng quét QR mỗi ngày, con số 32 triệu giao dịch/ngày tạo quy mô sốc ngay giây đầu; sơ đồ "đường đi của tiền" trả lời tò mò kỹ thuật liên tục, không trì hoãn đáp án.

**Cách làm:** `counter` (đếm ngược), `FlowDiagram` (5 nút, trạng thái normal→blocked), `status_indicator`, `comparison` trước/sau, `timeline_steps`, `make_background --theme database`, Cáo PNG mở/giữa/kết, `header` xuyên suốt, `kinetic_text` nhấn "32 triệu". Không logo ngân hàng, không nhạc.

**Rủi ro thừa nhận:** Con số 32 triệu là trung bình cả năm 2025 theo NAPAS — ngày cao điểm có thể khác; cần ghi "trung bình" trong script. Kịch bản 24 h liên tục sập toàn bộ chưa từng xảy ra ở VN — phải nêu rõ "giả định".

---

### Concept 2 — "Hai bộ não — Khi máy chủ ngân hàng 'tâm thần phân liệt'"

**Hook (0–2 s):** Hai cửa sổ `window` cạnh nhau: Server A ghi số dư 10 triệu, Server B ghi 0 đ — cùng một tài khoản. Lời: *"Cùng tài khoản, hai số dư khác nhau. Lỗi nào khiến ngân hàng 'quên' bạn có bao nhiêu tiền?"* (ví dụ minh hoạ, không phải sự kiện thật.)

**Nhịp:**
- **0–3 s:** Opening: visual_hook — hai panel số dư mâu thuẫn; conflict — dấu "≠" đỏ nhấp nháy; topic_reveal — "Split-Brain — Lỗi đáng sợ nhất của database ngân hàng".
- **3–15 s:** FlowDiagram: Server Chính ↔ heartbeat ↔ Server Dự phòng. Heartbeat xanh → đứt → Server Dự phòng tự "lên ngôi". Giải thích split-brain: hai server đều nghĩ mình là "sếp", ghi dữ liệu trái ngược.
- **15–50 s:** Cơ chế chính: **Split-brain và cách ngân hàng phòng tránh.** Ví dụ cụ thể (minh hoạ): ATM trừ tiền trên Server A, app chuyển khoản trên Server B — sau khi nối lại, sổ cái xung đột. Giải pháp: quorum 3 node (bỏ phiếu đa số), fencing (STONITH — tắt cưỡng bức node lỗi). Sơ đồ 3 node, 2/3 vote = leader mới, node cũ bị cắt điện. Sai lầm: "dùng 2 server là an toàn" → thực ra 2 node không giải quyết split-brain, cần số lẻ.
- **50–62 s:** Cáo kết: *"Nghe phức tạp, nhưng mỗi lần bạn chuyển khoản thành công, phía sau là cuộc bầu cử giữa các máy chủ diễn ra trong vài mili-giây."* CTA: *"Bạn từng bị app ngân hàng lỗi chưa? Chọn: Rồi / Chưa bao giờ."*

**Vì sao giữ chân:** Hook tạo xung đột nhận thức mạnh (cùng tài khoản hai số dư) — người xem cần biết vì sao; cơ chế split-brain ít ai biết, có yếu tố "plot twist" kỹ thuật (server phản bội nhau). Mỗi bước sơ đồ trả lời ngay, không trì hoãn.

**Cách làm:** `comparison` hai panel, `FlowDiagram` (3 node, trạng thái normal/blocked), `status_indicator` (heartbeat ok→bad), `window` giả app ngân hàng (không logo), `timeline_steps` (3 bước: đứt → split → fencing), `kinetic_text` nhấn "Split-Brain", `make_background --theme database`, Cáo PNG, `header` xuyên suốt. Camera `zoom` vào node lỗi (≲1,3×).

**Rủi ro thừa nhận:** Khái niệm split-brain hơi chuyên sâu — cần ẩn dụ đời thường (hai sếp cùng ký lệnh trái ngược) để không mất khán giả phổ thông. Phải nhấn rõ ví dụ 10 triệu/0 đ là minh hoạ, không phải sự cố thật.

---

### Concept 3 — "803 giờ sập — Chuyện thật ở nước ngoài, bài học cho ví bạn"

**Hook (0–2 s):** `bar_chart` — cột "803 giờ" cao vượt khung, bên cạnh đồng hồ 24:00:00. Lời: *"Các ngân hàng lớn ở Anh đã sập tổng cộng 803 giờ chỉ trong 2 năm. Nếu chuyện đó xảy ra ở Việt Nam?"* (Nguồn: UK Parliament Treasury Committee 2025, computerweekly.com.)

**Nhịp:**
- **0–3 s:** Opening: visual_hook — bar 803 h; conflict — "803 giờ = 33 ngày"; topic_reveal — "Và bạn không có tiền mặt".
- **3–15 s:** `request_stream` mô phỏng: dòng giao dịch chảy vào core banking → đột ngột dừng, request chất đống đỏ. Giải thích: 56% giao dịch online ở Barclays từng thất bại trong một đợt sập trùng ngày lương (ví dụ thực tế nước ngoài, nguồn: computerweekly.com). Áp vào VN: hơn 32 triệu giao dịch/ngày trên NAPAS — tưởng tượng hơn nửa số đó lỗi.
- **15–50 s:** Cơ chế chính: **Vì sao hệ thống cũ hay sập — "Banking Jenga".** FlowDiagram: lớp app hiện đại chồng lên lớp mainframe cũ → khi lớp dưới lung lay, cả tháp đổ. Nguyên nhân phổ biến nhất: không phải hacker — mà là **bản cập nhật phần mềm bị lỗi** (ví dụ: CrowdStrike 7/2024 làm 8,5 triệu thiết bị crash, nguồn: xurrent.com). Sai lầm: "sập = bị hack" → thực tế đa số do lỗi nội bộ, cập nhật routine. Failover: hệ thống dự phòng chuyển quyền trong vài giây — nhưng 24 h nghĩa là failover cũng thất bại (kịch bản giả định cực đoan).
- **50–65 s:** Cáo kết: *"Tiền bạn an toàn trong sổ cái, nhưng 'chìa khoá' mở két là phần mềm — và phần mềm thì… có bug."* CTA: *"Bạn còn giữ tiền mặt dự phòng không? Gõ có / không."* (Không khuyên rút tiền, chỉ hỏi thói quen.)

**Vì sao giữ chân:** Mở bằng con số thật gây sốc (803 giờ) + stakes gần (trùng ngày lương); người xem tự hỏi "VN thì sao?". Ẩn dụ Jenga trực quan, dễ nhớ. Giải đáp liên tục (không trì hoãn): nguyên nhân → cơ chế → bài học.

**Cách làm:** `bar_chart` (803 h vs 24 h), `request_stream` (dòng giao dịch bình thường → blocked), `FlowDiagram` (3 lớp: app / middleware / mainframe, trạng thái normal→leaking), `comparison` trước/sau bản cập nhật, `counter`, `kinetic_text` nhấn "803 giờ", `make_background --theme incident`, Cáo PNG, `header` xuyên suốt. Không logo/tên ngân hàng VN.

**Rủi ro thừa nhận:** 803 giờ là tổng nhiều ngân hàng Anh, không phải 1 đợt sập liên tục — cần ghi rõ "tổng cộng 158 sự cố trong 2 năm" để không gây hiểu lầm. So sánh sang VN là ngoại suy giả định — phải nói rõ "nếu xảy ra tương tự". CTA hỏi tiền mặt có thể bị hiểu nhầm là khuyên rút tiền — cần giọng nhẹ, trung lập, chỉ hỏi thói quen.

---

**So sánh nhanh 3 concept:**

| | C1: "32 triệu biến mất" | C2: "Hai bộ não" | C3: "803 giờ sập" |
|---|---|---|---|
| Cơ chế chính | SPOF ở tầng core/NAPAS | Split-brain database | Legacy stack "Jenga" + lỗi cập nhật |
| Góc kể | Đường đi giao dịch bị chặn | Xung đột dữ liệu giữa 2 server | Thống kê thật + ngoại suy VN |
| Độ gần khán giả | Rất cao (QR hàng ngày) | Trung bình (kỹ thuật sâu) | Cao (ngày lương) |
| Rủi ro lớn nhất | Giả định chưa xảy ra | Quá chuyên sâu | Ngoại suy xuyên quốc gia |