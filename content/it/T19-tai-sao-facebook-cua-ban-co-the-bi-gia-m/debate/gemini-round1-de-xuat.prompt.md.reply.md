Đã có đủ dữ liệu. Dưới đây là **Vòng 1 — đề xuất độc lập** của Gemini.

---

## VÒNG 1 — ĐỀ XUẤT ĐỘC LẬP (Gemini) · IT-T19-E01

### Concept 1: "Bản sao 5 phút"

**Hook (≤ 2 s):** Màn hình điện thoại mô phỏng: tin nhắn từ "Cáo Minh" — *"Cho tao mượn 5 triệu gấp!"*. Camera kéo lùi lộ ra… hai tài khoản cùng tên, cùng ảnh. *(Ví dụ dựng, không phải vụ việc thật.)*

**Nhịp:**
- **0–3 s:** Opening ba pha — (1) tin nhắn vay tiền bật lên, (2) người nhận kiểm tra profile → phát hiện 2 tài khoản trùng khít, (3) chữ kinetic: *"Bị giả mạo — mà không ai hack bạn."*
- **3–15 s:** Cáo xuất hiện. Sơ đồ `ExplainerScene` dựng từng bước: thông tin công khai trên mạng xã hội (ảnh, tên, danh sách bạn bè) → kẻ gian chỉ cần **sao chép** → tạo tài khoản mới y hệt. Nhấn mạnh cơ chế chính: *không cần mật khẩu, không cần phishing — chỉ cần thông tin bạn tự để công khai là đủ.* Số liệu: năm 2024, lừa đảo trực tuyến tại Việt Nam gây thiệt hại ước ~18.900 tỷ đồng, giả mạo mạng xã hội là một trong những hình thức phổ biến nhất (nguồn: Cục An toàn thông tin / NCA qua antoanthongtin.vn, hungyen.gov.vn).
- **15–55 s:** Ví dụ cụ thể (dựng): Cáo B nhận tin nhắn clone, suýt chuyển tiền → so sánh trước/sau (`ComparisonScene`?) giữa tài khoản thật (tạo lâu, nhiều bạn chung, nhiều bài đăng) vs. clone (tạo cùng ngày, 0 bạn chung). Sai lầm thường gặp: *"Thấy đúng ảnh, đúng tên là tin"* → cơ chế tâm lý quen thuộc + khẩn cấp giả. Bài học — 4 việc làm ngay: (1) ẩn danh sách bạn bè, (2) báo bạn bè khi thấy bản giả, (3) báo cáo tài khoản giả (Meta cho phép báo cáo mạo danh ngay cả khi không có tài khoản — nguồn: Meta Help Center), (4) **gọi điện thoại thường xác minh trước khi chuyển tiền**.
- **Kết (~55 s):** Cáo quay lại, chữ kinetic câu chốt: *"Tài khoản giả không cần hack — chỉ cần bạn để quá nhiều thứ công khai."* CTA nhẹ: *"Bạn đã ẩn danh sách bạn bè chưa? Gõ 'rồi' hoặc 'chưa'."*

**Vì sao giữ chân:** Stakes cao — mất tiền trực tiếp của bạn bè/gia đình; mở bằng tình huống quen thuộc (tin nhắn vay tiền) tạo nhận diện ngay. Cơ chế "không cần hack" phá vỡ giả định phổ biến → tò mò.

**Cách làm với công cụ hiện có:** `UiSimulationScene` (mô phỏng giao diện tin nhắn & profile chung chung, không logo thật), `ExplainerScene` (sơ đồ bước), `CharacterScene` (Cáo), `DataVizScene` (số liệu thiệt hại), nền AI-gen. Giọng TTS Việt, SFX tự tổng hợp.

**Rủi ro thừa nhận:** Cảnh mô phỏng giao diện phải đủ chung (không logo thật) nhưng vẫn phải nhận ra là "app nhắn tin" → cần thiết kế cẩn thận. Số 18.900 tỷ là tổng lừa đảo trực tuyến, không riêng giả mạo MXH — phải nói rõ khi dùng.

---

### Concept 2: "Bạn đang công khai gì?"

**Hook (≤ 2 s):** Cáo đứng cạnh hồ sơ mạng xã hội mô phỏng. Các mục "Ảnh đại diện: 🔓 Công khai — Bạn bè: 🔓 Công khai — Ảnh bìa: 🔓 Công khai" lần lượt bật đỏ. Chữ kinetic: *"Đủ rồi — để làm một bản sao của bạn."*

**Nhịp:**
- **0–3 s:** Ba pha — (1) profile với ổ khoá mở, (2) ổ khoá lần lượt tô đỏ, (3) dòng chữ hook.
- **3–15 s:** `ExplainerScene` — sơ đồ 3 bước: Thông tin công khai → Sao chép → Tài khoản giả. Cơ chế chính: **vì sao chỉ cần thông tin công khai?** Ảnh đại diện ai cũng xem được; tên hiển thị tự do đặt; danh sách bạn bè mặc định công khai → kẻ gian biết gửi tin nhắn cho ai và xưng hô thế nào. Bộ Công an & Công an các tỉnh liên tục cảnh báo thủ đoạn này (nguồn: baochinhphu.vn, gialai.gov.vn).
- **15–50 s:** Ví dụ dựng: "Cáo Linh" để bạn bè công khai → kẻ gian clone tài khoản → nhắn tin nhờ chuyển tiền viện phí gấp → bạn Cáo Linh suýt chuyển vì thấy đúng ảnh, đúng tên, lại khẩn cấp. Dùng `UiSimulationScene` cho tin nhắn. Sai lầm: không gọi điện xác minh vì "thấy ảnh đúng rồi". Sơ đồ so sánh dấu hiệu nhận biết clone: tài khoản mới tạo, ít bạn chung, ít bài đăng, số tài khoản nhận tiền khác tên.
- **50–60 s:** 4 việc làm ngay (giống Concept 1). Câu chốt: *"Không ai hack bạn — nhưng thông tin bạn tự để công khai đã đủ để lừa người thân bạn."* CTA: *"Tag người bạn muốn nhắc — trước khi kẻ gian nhắc hộ."*

**Vì sao giữ chân:** Góc nhìn từ chính người bị giả mạo ("bạn vô tình cung cấp nguyên liệu") thay vì từ nạn nhân chuyển tiền → khác biệt, tạo cảm giác trách nhiệm cá nhân.

**Cách làm:** `ExplainerScene`, `UiSimulationScene`, `CharacterScene`, nền AI-gen (hình khoá/profile trừu tượng). Không cần `DataVizScene` nếu muốn tập trung hành vi.

**Rủi ro thừa nhận:** Góc "bạn tự gây ra" nếu không khéo có thể bị hiểu là đổ lỗi nạn nhân → lời thoại cần cân bằng: lỗi là ở kẻ gian, nhưng bạn *có thể* giảm rủi ro.

---

### Concept 3: "Cuộc gọi 10 giây"

**Hook (≤ 2 s):** Màn hình điện thoại mô phỏng: đồng hồ đếm ngược "00:10". Chữ: *"10 giây gọi điện — có thể cứu bạn 5 triệu."* *(Ví dụ dựng, số tiền minh hoạ.)*

**Nhịp:**
- **0–3 s:** Ba pha — (1) đồng hồ 10 giây, (2) biểu tượng cuộc gọi vs. biểu tượng tin nhắn, (3) hook.
- **3–15 s:** Mở ra tình huống: Cáo nhận tin nhắn vay tiền từ "bạn" — ảnh đúng, tên đúng. Thay vì chuyển tiền, Cáo bấm **gọi điện thoại thường** (không qua app). Người bạn thật nghe máy: *"Tao có vay gì đâu?"* → phát hiện tài khoản giả.
- **15–45 s:** `ExplainerScene` — Vì sao chiêu này hiệu quả? Sơ đồ: kẻ gian chỉ cần thông tin công khai (ảnh, tên, danh sách bạn bè) → tạo tài khoản mới → nhắn tin với kịch bản khẩn cấp. Tâm lý nạn nhân: quen mặt + gấp gáp = mất cảnh giác. Thêm biến thể mới: kẻ gian có thể dùng AI deepfake gọi video vài giây rồi cúp (nguồn: tuoitre.vn, congly.vn) → nên gọi **điện thoại thường**, không gọi qua app.
- **45–60 s:** 4 việc làm ngay. Câu chốt quay lại opening: *"10 giây gọi điện — rẻ hơn nhiều so với chuyển nhầm."* CTA: *"Lần sau ai nhắn vay tiền, bạn sẽ gọi hay chuyển?"*

**Vì sao giữ chân:** Hook đảo ngược kỳ vọng ("10 giây" thường gắn với mất mát, ở đây là cứu tiền). Cấu trúc "giải pháp trước → giải thích cơ chế sau" tạo ích lợi sớm (người xem biết ngay nên làm gì), rồi mới giải thích vì sao.

**Cách làm:** `UiSimulationScene` (giao diện cuộc gọi chung chung), `ExplainerScene` (sơ đồ cơ chế), `CharacterScene`, `DataVizScene` nếu dùng số liệu. Nền AI-gen.

**Rủi ro thừa nhận:** Cấu trúc "giải pháp trước" có thể khiến phần giải thích cơ chế (phần giữa) bị giảm sức hút nếu người xem cảm thấy "biết rồi". Cần dựng sơ đồ cơ chế đủ bất ngờ (ví dụ: deepfake video call 2–3 giây) để giữ chân tiếp.

---

**Nguồn đã kiểm:**
- Thiệt hại ~18.900 tỷ đồng năm 2024 do lừa đảo trực tuyến (tổng, không riêng giả mạo MXH): Cục An toàn thông tin qua hungyen.gov.vn, antoanthongtin.vn.
- Tỷ lệ nạn nhân giảm từ ~0,45% (2024) xuống ~0,18% (2025): NCA qua antoanthongtin.vn.
- Thủ đoạn clone không cần hack: Bộ Công an, Công an Gia Lai qua baochinhphu.vn, gialai.gov.vn, danviet.vn.
- Biến thể deepfake video call vài giây: tuoitre.vn, congly.vn.
- Báo cáo tài khoản mạo danh trên Meta: Meta Help Center (facebook.com/help/contact/295309487309484).