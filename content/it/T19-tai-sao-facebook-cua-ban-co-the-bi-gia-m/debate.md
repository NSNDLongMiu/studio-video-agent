# Tranh luận Ý tưởng — Chủ đề #19 (IT · Đội 4, team 5) · IT-T19-E01

Chủ đề: **Tại sao Facebook của bạn có thể bị giả mạo mà không cần hack tài khoản?**
Số vòng: 2 · Ba giọng: Claude (`ideator-a`), Codex (`codex-ideate.mjs`), Gemini (`gemini-run.mjs ideate`, mô hình mặc định của ghế là Claude Opus 4.6 Thinking) · Claude (`ideator-b`) chốt.

## Vòng 1 — Đề xuất độc lập

### Giọng Codex (nguyên văn)

**Trọng tâm:** Vì sao tài khoản giả có thể khiến người quen tin dù tài khoản thật vẫn do bạn kiểm soát? Với dân văn phòng Việt Nam, dấu hiệu đáng nhớ là tên và ảnh quen có thể xuất hiện trên một tài khoản khác. Hãy gọi xác minh trước khi chuyển tiền.

Cả ba concept dùng khung 9:16, 1080×1920, 55–60 giây. Opening ba pha gồm Cáo gặp sự cố trong 0–2s, chi tiết bất thường ở 2–3s, hệ quả trước 5s. Gắn nhãn “Ví dụ dựng” và nhãn AI. Dùng Cáo dáng tĩnh ở mở, giữa, kết, chiếm khoảng 10–18% chiều ngang khi cùng minh họa. Đổi dáng bằng cắt cảnh. TTS tiếng Việt, hiệu ứng tự tổng hợp, không nhạc nền. Các khẳng định về Facebook cần đối chiếu tài liệu chính thức trước khi thu âm. Phần xử lý trình bày ở mức nguyên tắc.

#### 1. Hai khung chat, một gương mặt

- **Hook ≤2s:** Cáo nhìn điện thoại. Bạn nhắn “Sao mày vừa vay tao 5 triệu?” Nhãn “Ví dụ dựng” hiện ngay.
- **Nhịp:** 0–3s, Cáo mở đoạn chat của mình, chẳng có lời vay. 3–15s, bạn sắp chuyển tiền ở giây 4. **Giây 9 trả lời** bằng hai khung chat cạnh nhau: tài khoản khác có thể dùng tên và ảnh công khai để trông quen. Phần sau cho thấy danh sách bạn bè công khai có thể làm lộ ai quen Cáo.
- **Kết và giữ chân:** Bạn gọi Cáo trước khi chuyển. Người xem sớm thấy tiền có thể đi nhầm và nhận ra lỗi tin ảnh đại diện. Dùng `UiSimulationScene` và `CharacterScene`. **Rủi ro:** Hai khung dễ nhập nhằng trên màn hình nhỏ. Gắn nhãn “Tài khoản Cáo” và “Tài khoản giả” khi bật mí.

#### 2. Biết tên đồng nghiệp

- **Hook ≤2s:** Cáo thấy ảnh chụp tin nhắn bạn gửi: “Nó biết cả tên đồng nghiệp mình.”
- **Nhịp:** 0–3s, Cáo khựng lại khi thấy lời nhờ chuyển tiền. Trước 5s, bạn định chuyển vì người nhắn có vẻ biết nhóm. **Giây 11 trả lời:** tên, ảnh và danh sách bạn bè công khai có thể tạo cảm giác người nhắn thuộc vòng quen biết.
- **Kết và giữ chân:** Cuộc gọi làm rõ vì sao “biết người quen” vẫn cần xác minh. Dùng `UiSimulationScene` và `ExplainerScene` với sơ đồ quan hệ hư cấu. **Rủi ro:** Dễ ngụ ý danh sách luôn công khai. Hiện điều kiện “nếu để công khai” ngay trên sơ đồ.

#### 3. Một cuộc gọi, hai câu trả lời

- **Hook ≤2s:** Cáo bắt máy. Bạn hỏi “Tiền chuyển vào đâu?”
- **Nhịp:** 0–3s, Cáo ngơ ngác. Trước 5s, bạn nói đang chuẩn bị chuyển vì thấy đúng tên và ảnh. **Giây 8 trả lời:** thông tin công khai có thể khiến một hồ sơ khác trông giống Cáo, kể cả với người quen.
- **Kết và giữ chân:** Người xem thấy ngay cuộc gọi chặn cú chuyển nhầm, rồi hiểu vì sao bạn suýt tin. Dùng `CharacterScene` và `ExplainerScene`. **Rủi ro:** Mở đầu dễ giống cuộc gọi công việc. Hiện lời vay cạnh Cáo ngay khung đầu.

**Cả ba bản kết:** Gọi số đã biết trước khi chuyển tiền. Thấy tài khoản giả thì báo bạn bè, báo cáo tài khoản đó và rà lại thông tin mình để công khai. Mời chọn nhẹ “Gặp tin vay tiền bất ngờ, bạn gọi ai trước?”

> Ghi chú người điều phối: Codex đề xuất nhãn “Ví dụ dựng” trên hình — trái quy định giám đốc chốt 19/11/2026 (không đốt nhãn lên hình; ghi ở caption/`publish.json`). Sẽ nêu ở phản biện.

### Giọng Claude — `ideator-a` (nguyên văn)

Nguồn tham khảo ban đầu, cần Kịch bản và Gemini mở lại bài gốc:
- Mạo danh người quen trên Zalo/Facebook (CafeF): https://cafef.vn/mao-danh-nguoi-quen-tren-zalo-facebook-de-giang-bay-chuyen-tien-188261108210218908.chn
- Bộ Công an khuyến cáo gọi điện xác minh chủ tài khoản (CafeF): https://cafef.vn/tat-ca-nguoi-dung-facebook-chu-y-thong-bao-moi-cua-cong-an-188261107063327109.chn
- Lao Động, giả mạo bạn thân: https://news.laodong.vn/xa-hoi/canh-giac-bay-lua-tu-facebook-gia-mao-ban-than-1666520.ldo

Lưu ý: tôi chưa tìm được thông cáo gốc của A05 cho đúng kịch bản này. Chỉ có báo chí và tài liệu ngân hàng. Không nêu số vụ hay số tiền nếu chưa mở bài gốc kiểm lại.

**1. "Bản sao ghép từ ba mảnh"** (cơ chế)
- **Hook (0-2s):** Tin nhắn hiện trên màn hình điện thoại: "Sao mày vừa vay tao 5 triệu?". Cáo ngơ ngác nói: "Tôi chưa nhắn gì cả." Đây là ví dụ dựng.
- **Nhịp:**
  - 0-3s: Hook như trên. Trước giây 5 nêu hệ quả: tài khoản của Cáo vẫn nguyên, nhưng một "Cáo thứ hai" đang nhắn cho bạn bè.
  - 3-15s: Hiện hồ sơ của Cáo. Ba mảnh công khai (ảnh đại diện, tên, danh sách bạn) bay sang một khung trống và ghép thành hồ sơ trông giống hệt. Chỉ nói ở mức nguyên tắc, không dạy cách làm.
  - Giữa: Vì sao bản giả đáng tin (bạn bè nhìn ảnh và tên rồi tin), mẫu tin thường gặp (khẩn, nhờ chuyển tiền), sai lầm hay gặp (trả lời ngay hoặc gọi video rồi tin).
  - Kết, khoảng giây 55-65: Cáo trả lời câu hỏi mở. Bản giả không cần mật khẩu, chỉ cần thông tin công khai. Việc làm ngay: thu hẹp thông tin công khai, báo bạn bè, báo cáo tài khoản giả, gọi số đã lưu trước khi chuyển tiền.
- **Giữ chân:** Hệ quả chạm trực tiếp người xem (bạn bè và gia đình bị nhắn). Câu hỏi "ai đang nhắn?" được giải dần.
- **Cách làm:** `UiSimulationScene` cho khung chat và hồ sơ, `DataVizScene` cho ba mảnh ghép, `CharacterScene` cho Cáo ở đầu và cuối, TTS tiếng Việt, không nhạc nền. Ảnh đại diện là hình hoạt hoạ của Cáo, không dùng người thật.
- **Chiều sâu R15:** tình huống (bị hỏi vay tiền), cơ chế (bản sao dựng từ dữ liệu công khai), ví dụ (hồ sơ Cáo giả), sai lầm (tin vì ảnh và tên giống), bài học (xác minh bằng kênh khác).
- **Rủi ro:** Dễ trượt thành hướng dẫn thao tác. Cần giữ ở mức khái quát.

**2. "Hai cuộc gọi" — thử thách xác minh** (tình huống và lựa chọn)
- **Hook:** Màn hình chia đôi. Bên trái, tin nhắn "vay 5 triệu gấp" (ví dụ dựng). Bên phải, Cáo đang cầm điện thoại, ngón tay dừng trên nút chuyển tiền.
- **Nhịp:**
  - 0-3s: Hook. Câu hỏi mở: "Chuyển hay không chuyển?"
  - 3-15s: Cáo thử gọi lại bằng hai cách. Cách 1 là gọi qua chính cuộc chat đó. Cách 2 là gọi theo số đã lưu trong danh bạ. Cách 1 lộ ra là bản giả. Cách 2 đến máy người thật.
  - Giữa: Giải thích ngắn vì sao có bản giả (ghép từ thông tin công khai), sai lầm (chỉ nhìn ảnh và tên).
  - Kết, khoảng giây 50-60: Quy tắc "đổi kênh trước khi đổi tiền", kèm việc làm ngay như concept 1.
- **Giữ chân:** Người xem được tham gia chọn, cơ chế đến sau hệ quả.
- **Cách làm:** `QASequenceScene` cho hai nhánh, `UiSimulationScene` cho chat, `CharacterScene` cho Cáo, nền từ `make_background.py`.
- **Chiều sâu R15:** đủ cả năm mục, nhưng cơ chế bị nén nên mỏng hơn concept 1.
- **Rủi ro:** Cơ chế (vì sao không cần hack) bị lấn bởi mẹo xác minh, dễ lệch câu hỏi gốc của giám đốc. Thông tin "gọi qua chat giả thì lộ" phải dựng như ví dụ, không khẳng định chung.

**3. "Cáo tự kiểm hồ sơ mình"** (nhìn như kẻ gian)
- **Hook:** Cáo mở hồ sơ của chính mình và hỏi: "Nếu tôi là người lạ, tôi biết được những gì?" Hiện ba thẻ: ảnh, tên, bạn bè.
- **Nhịp:**
  - 0-3s: Hook. Hệ quả gần: "Bấy nhiêu là đủ để thành tôi."
  - 3-15s: Cáo kiểm từng thẻ và chỉ ra cái nào đang công khai (ví dụ dựng).
  - Giữa: Ví dụ về mẫu tin mạo danh, sai lầm khi để mọi thứ công khai, hướng thu hẹp ở mức nguyên tắc.
  - Kết, khoảng giây 55-65: Trả lời câu hỏi mở, kèm việc làm ngay.
- **Giữ chân:** Người xem tự hình dung hồ sơ của mình.
- **Cách làm:** `PromptReviewScene` làm bảng kiểm, `UiSimulationScene`, `ExplainerScene`.
- **Chiều sâu R15:** đủ cả năm mục.
- **Rủi ro:** Hook ít gắn với sự cố cụ thể hơn brief. Tên mục cài đặt chưa kiểm bằng tài liệu Meta, nên chỉ nói "thu hẹp quyền xem" ở mức nguyên tắc.

**Nghiêng về:** concept 1. Nó bám brief nhất (hook của giám đốc và một cơ chế chính), còn hai concept kia là biến thể nhịp. Có thể lai: mở bằng hook của concept 1, thêm cảnh "gọi theo số đã lưu" của concept 2 làm đoạn kết.

### Giọng Gemini (nguyên văn)

#### Concept 1: "Bản sao 5 phút"

**Hook (≤ 2 s):** Màn hình điện thoại mô phỏng: tin nhắn từ "Cáo Minh" — *"Cho tao mượn 5 triệu gấp!"*. Camera kéo lùi lộ ra… hai tài khoản cùng tên, cùng ảnh. *(Ví dụ dựng, không phải vụ việc thật.)*

**Nhịp:**
- **0–3 s:** Opening ba pha — (1) tin nhắn vay tiền bật lên, (2) người nhận kiểm tra profile → phát hiện 2 tài khoản trùng khít, (3) chữ kinetic: *"Bị giả mạo — mà không ai hack bạn."*
- **3–15 s:** Cáo xuất hiện. Sơ đồ `ExplainerScene` dựng từng bước: thông tin công khai trên mạng xã hội (ảnh, tên, danh sách bạn bè) → kẻ gian chỉ cần **sao chép** → tạo tài khoản mới y hệt. Nhấn mạnh cơ chế chính: *không cần mật khẩu, không cần phishing — chỉ cần thông tin bạn tự để công khai là đủ.* Số liệu: năm 2024, lừa đảo trực tuyến tại Việt Nam gây thiệt hại ước ~18.900 tỷ đồng, giả mạo mạng xã hội là một trong những hình thức phổ biến nhất (nguồn: Cục An toàn thông tin / NCA qua antoanthongtin.vn, hungyen.gov.vn).
- **15–55 s:** Ví dụ cụ thể (dựng): Cáo B nhận tin nhắn clone, suýt chuyển tiền → so sánh trước/sau (`ComparisonScene`?) giữa tài khoản thật (tạo lâu, nhiều bạn chung, nhiều bài đăng) vs. clone (tạo cùng ngày, 0 bạn chung). Sai lầm thường gặp: *"Thấy đúng ảnh, đúng tên là tin"* → cơ chế tâm lý quen thuộc + khẩn cấp giả. Bài học — 4 việc làm ngay: (1) ẩn danh sách bạn bè, (2) báo bạn bè khi thấy bản giả, (3) báo cáo tài khoản giả (Meta cho phép báo cáo mạo danh ngay cả khi không có tài khoản — nguồn: Meta Help Center), (4) **gọi điện thoại thường xác minh trước khi chuyển tiền**.
- **Kết (~55 s):** Cáo quay lại, chữ kinetic câu chốt: *"Tài khoản giả không cần hack — chỉ cần bạn để quá nhiều thứ công khai."* CTA nhẹ: *"Bạn đã ẩn danh sách bạn bè chưa? Gõ 'rồi' hoặc 'chưa'."*

**Vì sao giữ chân:** Stakes cao — mất tiền trực tiếp của bạn bè/gia đình; mở bằng tình huống quen thuộc (tin nhắn vay tiền) tạo nhận diện ngay. Cơ chế "không cần hack" phá vỡ giả định phổ biến → tò mò.

**Cách làm với công cụ hiện có:** `UiSimulationScene` (mô phỏng giao diện tin nhắn & profile chung chung, không logo thật), `ExplainerScene` (sơ đồ bước), `CharacterScene` (Cáo), `DataVizScene` (số liệu thiệt hại), nền AI-gen. Giọng TTS Việt, SFX tự tổng hợp.

**Rủi ro thừa nhận:** Cảnh mô phỏng giao diện phải đủ chung (không logo thật) nhưng vẫn phải nhận ra là "app nhắn tin" → cần thiết kế cẩn thận. Số 18.900 tỷ là tổng lừa đảo trực tuyến, không riêng giả mạo MXH — phải nói rõ khi dùng.

#### Concept 2: "Bạn đang công khai gì?"

**Hook (≤ 2 s):** Cáo đứng cạnh hồ sơ mạng xã hội mô phỏng. Các mục "Ảnh đại diện: 🔓 Công khai — Bạn bè: 🔓 Công khai — Ảnh bìa: 🔓 Công khai" lần lượt bật đỏ. Chữ kinetic: *"Đủ rồi — để làm một bản sao của bạn."*

**Nhịp:**
- **0–3 s:** Ba pha — (1) profile với ổ khoá mở, (2) ổ khoá lần lượt tô đỏ, (3) dòng chữ hook.
- **3–15 s:** `ExplainerScene` — sơ đồ 3 bước: Thông tin công khai → Sao chép → Tài khoản giả. Cơ chế chính: **vì sao chỉ cần thông tin công khai?** Ảnh đại diện ai cũng xem được; tên hiển thị tự do đặt; danh sách bạn bè mặc định công khai → kẻ gian biết gửi tin nhắn cho ai và xưng hô thế nào. Bộ Công an & Công an các tỉnh liên tục cảnh báo thủ đoạn này (nguồn: baochinhphu.vn, gialai.gov.vn).
- **15–50 s:** Ví dụ dựng: "Cáo Linh" để bạn bè công khai → kẻ gian clone tài khoản → nhắn tin nhờ chuyển tiền viện phí gấp → bạn Cáo Linh suýt chuyển vì thấy đúng ảnh, đúng tên, lại khẩn cấp. Dùng `UiSimulationScene` cho tin nhắn. Sai lầm: không gọi điện xác minh vì "thấy ảnh đúng rồi". Sơ đồ so sánh dấu hiệu nhận biết clone: tài khoản mới tạo, ít bạn chung, ít bài đăng, số tài khoản nhận tiền khác tên.
- **50–60 s:** 4 việc làm ngay (giống Concept 1). Câu chốt: *"Không ai hack bạn — nhưng thông tin bạn tự để công khai đã đủ để lừa người thân bạn."* CTA: *"Tag người bạn muốn nhắc — trước khi kẻ gian nhắc hộ."*

**Vì sao giữ chân:** Góc nhìn từ chính người bị giả mạo ("bạn vô tình cung cấp nguyên liệu") thay vì từ nạn nhân chuyển tiền → khác biệt, tạo cảm giác trách nhiệm cá nhân.

**Cách làm:** `ExplainerScene`, `UiSimulationScene`, `CharacterScene`, nền AI-gen (hình khoá/profile trừu tượng). Không cần `DataVizScene` nếu muốn tập trung hành vi.

**Rủi ro thừa nhận:** Góc "bạn tự gây ra" nếu không khéo có thể bị hiểu là đổ lỗi nạn nhân → lời thoại cần cân bằng: lỗi là ở kẻ gian, nhưng bạn *có thể* giảm rủi ro.

#### Concept 3: "Cuộc gọi 10 giây"

**Hook (≤ 2 s):** Màn hình điện thoại mô phỏng: đồng hồ đếm ngược "00:10". Chữ: *"10 giây gọi điện — có thể cứu bạn 5 triệu."* *(Ví dụ dựng, số tiền minh hoạ.)*

**Nhịp:**
- **0–3 s:** Ba pha — (1) đồng hồ 10 giây, (2) biểu tượng cuộc gọi vs. biểu tượng tin nhắn, (3) hook.
- **3–15 s:** Mở ra tình huống: Cáo nhận tin nhắn vay tiền từ "bạn" — ảnh đúng, tên đúng. Thay vì chuyển tiền, Cáo bấm **gọi điện thoại thường** (không qua app). Người bạn thật nghe máy: *"Tao có vay gì đâu?"* → phát hiện tài khoản giả.
- **15–45 s:** `ExplainerScene` — Vì sao chiêu này hiệu quả? Sơ đồ: kẻ gian chỉ cần thông tin công khai (ảnh, tên, danh sách bạn bè) → tạo tài khoản mới → nhắn tin với kịch bản khẩn cấp. Tâm lý nạn nhân: quen mặt + gấp gáp = mất cảnh giác. Thêm biến thể mới: kẻ gian có thể dùng AI deepfake gọi video vài giây rồi cúp (nguồn: tuoitre.vn, congly.vn) → nên gọi **điện thoại thường**, không gọi qua app.
- **45–60 s:** 4 việc làm ngay. Câu chốt quay lại opening: *"10 giây gọi điện — rẻ hơn nhiều so với chuyển nhầm."* CTA: *"Lần sau ai nhắn vay tiền, bạn sẽ gọi hay chuyển?"*

**Vì sao giữ chân:** Hook đảo ngược kỳ vọng ("10 giây" thường gắn với mất mát, ở đây là cứu tiền). Cấu trúc "giải pháp trước → giải thích cơ chế sau" tạo ích lợi sớm (người xem biết ngay nên làm gì), rồi mới giải thích vì sao.

**Cách làm:** `UiSimulationScene` (giao diện cuộc gọi chung chung), `ExplainerScene` (sơ đồ cơ chế), `CharacterScene`, `DataVizScene` nếu dùng số liệu. Nền AI-gen.

**Rủi ro thừa nhận:** Cấu trúc "giải pháp trước" có thể khiến phần giải thích cơ chế (phần giữa) bị giảm sức hút nếu người xem cảm thấy "biết rồi". Cần dựng sơ đồ cơ chế đủ bất ngờ (ví dụ: deepfake video call 2–3 giây) để giữ chân tiếp.

**Nguồn đã kiểm (Gemini tự nêu):**
- Thiệt hại ~18.900 tỷ đồng năm 2024 do lừa đảo trực tuyến (tổng, không riêng giả mạo MXH): Cục An toàn thông tin qua hungyen.gov.vn, antoanthongtin.vn.
- Tỷ lệ nạn nhân giảm từ ~0,45% (2024) xuống ~0,18% (2025): NCA qua antoanthongtin.vn.
- Thủ đoạn clone không cần hack: Bộ Công an, Công an Gia Lai qua baochinhphu.vn, gialai.gov.vn, danviet.vn.
- Biến thể deepfake video call vài giây: tuoitre.vn, congly.vn.
- Báo cáo tài khoản mạo danh trên Meta: Meta Help Center (facebook.com/help/contact/295309487309484).

> Ghi chú người điều phối: Gemini không ghi URL đầy đủ cho các bài báo (chỉ tên miền), nên các số liệu này chưa được Claude mở kiểm; khẳng định "danh sách bạn bè mặc định công khai" và tên thao tác "ẩn danh sách bạn bè" chưa kiểm bằng tài liệu chính thức của Meta (brief cấm khẳng định khi chưa kiểm).

**Tóm tắt Vòng 1 — đề xuất:** Cả ba giọng hội tụ về cùng một trục: tin nhắn vay tiền dựng làm hook, cơ chế "ghép từ thông tin công khai", kết bằng gọi số đã biết. Khác biệt nằm ở góc kể: Claude/Codex mở từ người bị giả mạo nhận tin hỏi lại; Gemini thêm góc "bạn đang công khai gì" và "giải pháp trước" (cuộc gọi 10 giây).

## Vòng 1 — Phản biện chéo

### Codex phản biện Claude (nguyên văn)

**Trọng tâm** là vì sao người dùng Facebook vẫn có thể bị mạo danh dù họ chưa mất quyền truy cập tài khoản. Khán giả cần phân biệt tài khoản thật với hồ sơ giả và biết cách xác minh khi nhận tin vay tiền. Điểm dưới đây theo thứ tự **hook & giữ chân / khớp brief / khả thi / an toàn / độc đáo**, mỗi mục trên 10.

**1. Bản sao ghép từ ba mảnh — 9 / 9 / 9 / 7 / 8.** Tin nhắn “Sao mày vừa vay tao 5 triệu?” cho thấy ngay tiền của bạn bè đang gặp rủi ro. Điểm yếu là cảnh ba mảnh bay sang khung trống dễ trông như thao tác dựng tài khoản. Dùng `DataVizScene` đặt hai hồ sơ minh họa đã hoàn chỉnh cạnh nhau, đánh dấu ảnh và tên giống nhau, rồi giải thích rằng thông tin bạn bè nếu công khai có thể giúp kẻ gian biết nên nhắn cho ai. Trước giây 5, cho thấy Cáo vẫn vào được tài khoản của mình trong khi bạn đã nhận tin từ hồ sơ khác. Đến giây 10–12, trả lời thẳng rằng tin vay tiền đến từ một tài khoản riêng. Bỏ chữ “giống hệt” vì hai hồ sơ chỉ cần đủ giống để người quen tin nhầm.

**2. Hai cuộc gọi — 8 / 6 / 8 / 7 / 7.** Ngón tay dừng trước khi chuyển tiền tạo sức ép rõ, nhưng cuộc gọi trong chat “lộ bản giả” dễ khiến người xem tưởng đó là cách xác minh đáng tin. Giữ cảnh bấm gọi số đã lưu, bỏ cảnh gọi trong chat. Nếu dựng concept này riêng, dùng `UiSimulationScene` cho thấy hai hồ sơ trước giây 15 để câu hỏi vì sao có bản giả vẫn được trả lời sớm. Cảnh gọi có giá trị nhất khi làm đoạn kết cho concept 1.

**3. Cáo tự kiểm hồ sơ mình — 5 / 8 / 9 / 8 / 6.** Câu hỏi “người lạ biết được những gì?” mở bằng thao tác kiểm tra, nên đến giây 5 người xem vẫn chưa thấy hậu quả. Mở bằng cảnh bạn của Cáo suýt chuyển tiền, rồi dùng `PromptReviewScene` để Cáo rà lại thông tin công khai. Đổi “Bấy nhiêu là đủ để thành tôi” thành “Nhìn quen, bạn mình có thể tưởng là mình.”

**Chọn concept 1, lấy cảnh gọi số đã lưu từ concept 2.** Khoảng giây 55–65, cho thấy người bạn dừng chuyển tiền sau khi gọi Cáo. Chốt bằng bốn việc cụ thể gồm thu hẹp thông tin công khai, báo bạn bè, báo cáo tài khoản giả và gọi số đã lưu trước khi chuyển tiền. Mời người xem chọn việc họ sẽ làm đầu tiên. Ghi “Ví dụ dựng” và nhãn AI trong caption hoặc `publish.json`.

> Codex không phản biện concept của Gemini ở vòng này (chia việc theo skill để giảm tải Codex).

### Claude (`ideator-a`) phản biện Codex + Gemini và trả lời Codex (nguyên văn)

Thang: hook/giữ chân · khớp brief · khả thi · an toàn · độc đáo.

**Codex**

**C1. Hai khung chat, một gương mặt: 8 / 9 / 8 / 8 / 6.**
- Điểm mạnh: bám đúng hook của giám đốc và trả lời ở giây 9.
- Điểm yếu: "hai khung cạnh nhau" đọc kém trên màn hình dọc, và Codex tự thừa nhận điều đó. Câu "danh sách bạn bè công khai làm lộ ai quen Cáo" cũng chưa nói rõ vì sao chỉ cần thông tin công khai là đủ.
- Cách sửa: xếp hai hồ sơ theo chiều dọc, trên và dưới, trong `UiSimulationScene`. Chỉ dùng chữ "công khai" khi hồ sơ đó đang để công khai (nêu thành điều kiện), không khẳng định đó là mặc định của Facebook.
- Đề xuất nhãn "Ví dụ dựng" ở caption và `publish.json` là đúng luật. Phần nhãn trong chính concept thì phải sửa.

**C2. Biết tên đồng nghiệp: 7 / 7 / 8 / 8 / 8.**
- Điểm mạnh: đây là góc độc đáo nhất, vì nó giải thích tại sao nạn nhân tin ("nó biết cả tên nhóm mình").
- Điểm yếu: hook là "ảnh chụp tin nhắn" nên hệ quả đến chậm, và tiền chưa rõ là của ai. Giữa video dễ lệch sang chuyện lộ dữ liệu nói chung.
- Cách sửa: giữ hook vay tiền của giám đốc ở 0–5s, rồi dùng "biết tên người quen" làm ví dụ thứ hai bên trong cơ chế chính. Đừng làm concept riêng.

**C3. Một cuộc gọi, hai câu trả lời: 6 / 7 / 8 / 8 / 6.**
- Điểm yếu: mở bằng "Tiền chuyển vào đâu?" khiến người xem tưởng đây là chuyện công việc. Hook gần như không có hệ quả, và Codex cũng ghi rủi ro này.
- Cách sửa: hiện dòng "Sao mày vừa vay tao 5 triệu?" ngay khung đầu. Khi đó nó chỉ còn là đoạn kết của C1.

**Gemini**

**G1. Bản sao 5 phút: 7 / 8 / 5 / 5 / 6.**
- Điểm yếu 1: dùng `ComparisonScene`, mà công cụ này không có. Phải thay bằng hai khối `UiSimulationScene` xếp dọc.
- Điểm yếu 2: "tạo cùng ngày, 0 bạn chung" là dấu hiệu nhận biết quá chắc. Kẻ gian có thể kết bạn chung, và người xem sẽ hiểu sai rằng "không có dấu hiệu thì là thật". Chỉ nên nói "có thể có dấu hiệu" và luôn quay về gọi xác minh.
- Điểm yếu 3: "hai tài khoản trùng khít" lặp lỗi "giống hệt" mà Codex đã bắt.
- Điểm yếu 4: nhồi số liệu vào 3–15s, trái chuẩn "một cơ chế chính".
- Tên "Cáo Minh" cần là tên hư cấu, không phải tên thật.

**G2. Bạn đang công khai gì: 6 / 8 / 6 / 4 / 7.**
- Điểm mạnh: góc nhìn "tự kiểm hồ sơ" khá độc đáo.
- Điểm yếu 1: hook là ổ khoá và bảng cài đặt, không có hệ quả trước giây 5 (vi phạm Y5).
- Điểm yếu 2: viết "danh sách bạn bè mặc định công khai" và dựng nhãn "Ảnh đại diện/Bạn bè: Công khai". Đây là khẳng định về Facebook chưa kiểm tài liệu Meta, nên phải bỏ.
- Điểm yếu 3: danh sách dấu hiệu nhận biết bản giả (4 mục) làm loãng cơ chế chính.
- Cách sửa: dùng nhãn "nếu để công khai" và không tô đỏ từng mục cài đặt. Phải mở bằng hệ quả.

**G3. Cuộc gọi 10 giây: 6 / 6 / 6 / 6 / 7.**
- Điểm mạnh: ý "đảo kỳ vọng" của hook có giá trị.
- Điểm yếu 1: đưa lời giải trước cơ chế nên không đáp ứng "vì sao không cần hack" ở phần đầu.
- Điểm yếu 2: nhánh deepfake gọi video là cơ chế thứ hai. Nó làm loãng chủ đề và là khẳng định mới chưa kiểm nguồn.
- Điểm yếu 3: "gọi điện thoại thường, không gọi qua app" kèm lý do "vì deepfake" là khẳng định mạnh. Chỉ giữ "gọi số đã lưu".
- Cách sửa: đổi hook sang tin nhắn vay tiền và đưa cuộc gọi xuống làm đoạn kết.

**Số liệu của Gemini**
- **18.900 tỷ:** không dùng. Đây là tổng lừa đảo trực tuyến, không riêng giả mạo. Nó cũng không phải cơ chế chính, nên tăng rủi ro mà không tăng hiểu biết. Gemini chỉ ghi tên miền, nên chưa có nguồn gốc kiểm được. Nếu Kịch bản muốn dùng thì phải mở bài gốc và nói rõ phạm vi.
- **Tỷ lệ nạn nhân 0,45% xuống 0,18%:** không dùng, vì cùng lý do.
- **Deepfake gọi video:** không dùng làm nhánh riêng. Nhiều nhất là một câu "đừng tin chỉ vì thấy mặt hay nghe giọng", và chỉ khi có nguồn mở được. Tôi chưa mở bài tuoitre hay congly.
- **Trợ giúp báo cáo của Meta (liên kết 295309487309484):** chưa kiểm. Nói "báo cáo tài khoản giả" ở mức nguyên tắc, không nêu tên nút.

**Trả lời Codex phê bình concept của tôi**

- **C1 của tôi, cảnh ba mảnh bay sang khung trống giống thao tác dựng tài khoản: nhận.** Đổi thành hai hồ sơ hoàn chỉnh xếp dọc. Ảnh và tên được đánh dấu "giống nhau" bằng `UiSimulationScene`, không dùng `DataVizScene` cho phần này.
- **Bỏ "giống hệt": nhận.** Đổi thành "đủ giống để người quen tin nhầm".
- **Thêm cảnh Cáo vẫn vào được tài khoản của mình trước giây 5: nhận.** Cảnh này cho thấy bản giả không cần hack, nên đây là điểm cộng.
- **C2 của tôi, bỏ cảnh gọi trong chat: nhận.** Chỉ giữ gọi số đã lưu, đặt ở đoạn kết.
- **C3 của tôi, mở bằng bạn suýt chuyển tiền: nhận một phần.** Hook sẽ mở bằng tin nhắn của giám đốc, rồi cắt sang bảng kiểm. Tôi chưa chắc chuyện này đẩy hệ quả lên đủ sớm.
- **Nhãn "Ví dụ dựng": đồng ý với Codex** là chỉ ghi ở caption và `publish.json`.

**Đề xuất cho vòng sau (bản lai)**
Nền là C1 của tôi, cộng cơ chế "hai hồ sơ xếp dọc" của Codex và đoạn kết "gọi số đã lưu" của cả hai. Thêm một câu "biết tên đồng nghiệp" từ C2 của Codex làm lý do người xem tin. Bỏ toàn bộ số liệu thiệt hại và deepfake. Giữ điều kiện "nếu để công khai".

### Gemini phản biện Claude + Codex (nguyên văn)

*(Kiểm chứng: cơ chế clone profile dựa trên thông tin công khai — ảnh đại diện, tên, danh sách bạn bè — đã được xác nhận bởi nhiều nguồn an ninh mạng: Malwarebytes, NordVPN, Bitdefender, AARP. Danh sách bạn bè mặc định có thể là Public và bạn chung vẫn hiện kể cả khi đặt "Only me". Các concept đều đúng về mặt sự kiện.)*

#### A. Chấm 3 concept của Claude

**1. "Bản sao ghép từ ba mảnh" — 8/10**

| Tiêu chí | Điểm | Nhận xét |
|---|---|---|
| Hook & giữ chân | 8 | Tin nhắn vay tiền + Cáo ngơ ngác → stakes rõ, hệ quả tiền bạc ngay giây đầu. "Cáo thứ hai" trước giây 5 tạo tò mò tốt. |
| Khớp brief | 9 | Bám rất sát: đúng hook gợi ý trong brief, đúng cơ chế 3 mảnh, đúng 4 việc làm ngay ở kết. |
| Khả thi sản xuất | 8 | UiSimulation + DataViz + Character đều có. Hiệu ứng "ba mảnh bay sang khung trống" dựng được bằng Remotion. |
| An toàn | 7 | Rủi ro "dễ trượt thành hướng dẫn" Claude tự nhận là đúng — cần kiểm soát mức chi tiết ở đoạn giữa. |
| Độc đáo | 6 | Cấu trúc "giải thích cơ chế tuyến tính" khá chuẩn mực, không có twist hoặc góc nhìn bất ngờ. |

**Điểm yếu cụ thể:** Đoạn giữa (15–55s) kể cơ chế + mẫu tin + sai lầm rồi quay lại kết — quá dài cho một mạch đơn tuyến, dễ mất người xem sau giây 20 vì không có điểm neo cảm xúc thứ hai. Khán giả đã "biết đáp án" (ba mảnh) từ giây 15, phần còn lại thiếu lý do ở lại.

**Cách sửa:** Chèn một "escalation beat" khoảng giây 25–30 — ví dụ cho thấy bản giả *không chỉ vay tiền mà có thể giả danh Cáo trong nhóm làm việc/nhóm lớp* (mở rộng hệ quả), tạo đỉnh thứ hai giữ chân.

**2. "Hai cuộc gọi" — 6/10**

| Tiêu chí | Điểm | Nhận xét |
|---|---|---|
| Hook & giữ chân | 7 | "Chuyển hay không?" là câu hỏi quyết định tốt, tạo tương tác tâm lý. |
| Khớp brief | 5 | Cơ chế clone bị đẩy ra giữa-cuối ("vì sao có bản giả"), brief yêu cầu cơ chế là trọng tâm, không phải phụ lục. |
| Khả thi sản xuất | 7 | Hai khung gọi dựng được, nhưng cần thiết kế cẩn thận trên 9:16. |
| An toàn | 8 | Hướng phòng thủ, ít rủi ro thành hướng dẫn. |
| Độc đáo | 7 | Góc "hai cuộc gọi" đối lập khá hay. |

**Điểm yếu cụ thể:** Claude tự nhận — cơ chế bị nén. Nhưng vấn đề sâu hơn: concept lấy **hành động phòng thủ (gọi xác minh)** làm trọng tâm thay vì **cơ chế giả mạo** — vi phạm brief ("giải thích kẻ gian sao chép…"). Video trở thành "mẹo xác minh" thay vì giải thích *tại sao* tài khoản bị giả mạo mà không cần hack.

**Cách sửa:** Đảo cấu trúc — dùng hook "chuyển hay không" nhưng ngay sau đó (giây 5–8) vào cơ chế clone đầy đủ, rồi mới đến "hai cuộc gọi" như minh hoạ cho giải pháp ở kết.

**3. "Cáo tự kiểm hồ sơ mình" — 7/10**

| Tiêu chí | Điểm | Nhận xét |
|---|---|---|
| Hook & giữ chân | 5 | Claude tự nhận: hook ít gắn sự cố cụ thể. Không có stakes (chưa ai mất tiền, chưa có nguy hiểm). "Nếu tôi là người lạ" là câu hỏi trí tuệ, không phải cảm xúc. |
| Khớp brief | 7 | Vẫn nói về 3 mảnh công khai, nhưng thiếu tình huống vay tiền mà brief gợi ý. |
| Khả thi sản xuất | 9 | Dựng đơn giản nhất trong 3 concept: Cáo + hồ sơ + thẻ thông tin. |
| An toàn | 9 | Góc tự kiểm, hoàn toàn phòng thủ. |
| Độc đáo | 7 | Góc "tự audit" tươi mới hơn so với cách kể nạn nhân thông thường. |

**Điểm yếu cụ thể:** Mở đầu thiếu "conflict" — kỷ luật yêu cầu opening ba pha `visual_hook → conflict → topic_reveal`, nhưng Cáo ngồi tự xem hồ sơ mình không có xung đột. Người xem chưa có lý do quan tâm vì chưa thấy hậu quả.

**Cách sửa:** Mở bằng 2 giây sự cố (tin nhắn vay tiền bất ngờ) rồi *ngay lập tức* Cáo quay về kiểm hồ sơ — giữ góc "tự audit" nhưng có stakes từ đầu.

#### B. Chấm 3 concept của Codex

**1. "Hai khung chat, một gương mặt" — 7/10**

| Tiêu chí | Điểm | Nhận xét |
|---|---|---|
| Hook & giữ chân | 8 | Hook gần giống Claude #1, có thêm "bạn sắp chuyển tiền" tạo urgency ở giây 4 — tốt. |
| Khớp brief | 8 | Đúng cơ chế, đúng hook brief gợi ý. |
| Khả thi sản xuất | 5 | **Hai khung chat cạnh nhau trên 9:16 (1080×1920)** là vấn đề lớn. Mỗi khung chỉ còn ~500px ngang — chữ chat sẽ bé, không đọc được ở độ phân giải điện thoại. Codex nhận ra nhưng chỉ đề xuất nhãn, chưa giải quyết gốc. |
| An toàn | 7 | Ổn, nhưng hai khung chat chi tiết dễ vô tình tạo "mẫu tin nhắn lừa đảo". |
| Độc đáo | 6 | Cấu trúc rất gần Claude #1, chưa tạo góc nhìn riêng. |

**Điểm yếu cụ thể:** Vấn đề layout là chí mạng. Trên TikTok, hai khung chat ngang 540px mỗi bên sẽ có chữ ~24px — dưới ngưỡng đọc được (brief/kỷ luật yêu cầu nhãn ≥ 56px, chữ khoá ≥ 72px). Concept phụ thuộc vào việc so sánh song song nhưng công cụ không có `ComparisonScene`.

**Cách sửa:** Đổi sang "lật khung" tuần tự (hiện khung chat thật → wipe/slide → hiện khung chat giả) thay vì cạnh nhau. Hoặc dùng zoom vào chi tiết giống/khác tuần tự, vừa vặn 9:16.

**2. "Biết tên đồng nghiệp" — 7.5/10**

| Tiêu chí | Điểm | Nhận xét |
|---|---|---|
| Hook & giữ chân | 7 | "Nó biết cả tên đồng nghiệp mình" — tạo cảm giác rùng mình tốt. Nhưng hook bắt đầu bằng ảnh chụp màn hình *của bạn* gửi — Cáo ở thế bị động, không trực tiếp đối mặt nguy hiểm. |
| Khớp brief | 8 | Tốt — khai thác khía cạnh "danh sách bạn bè công khai → biết vòng quan hệ" mà brief đề cập. |
| Khả thi sản xuất | 7 | Sơ đồ quan hệ hư cấu bằng Explainer dựng được. Nhưng "ảnh chụp tin nhắn" (screenshot trong screenshot) trên 9:16 sẽ rất khó đọc. |
| An toàn | 6 | Codex tự nhận — dễ ngụ ý danh sách bạn bè *luôn* công khai. Thực tế: Facebook cho phép ẩn, nhưng bạn chung (mutual friends) vẫn hiển thị kể cả khi đặt "Only me" ([nguồn: stuhawkins.com, AARP](https://www.aarp.org)). Nếu không nêu rõ điều kiện "nếu để công khai" → gây hoảng sợ sai. |
| Độc đáo | 8 | Góc "biết đồng nghiệp" hay hơn hẳn — đánh vào nỗi sợ "kẻ lạ biết vòng tròn thân" cụ thể hơn "vay tiền chung chung". |

**Điểm yếu cụ thể:** Hook gián tiếp — Cáo nhìn *ảnh chụp* tin nhắn *của bạn*. Hai lớp trung gian (bạn kể lại → Cáo xem) giảm cường độ. Brief gợi ý Cáo *trực tiếp* nhận tin nhắn.

**Cách sửa:** Đổi hook: Cáo nhận tin từ "đồng nghiệp" (thực ra là tài khoản giả) nhắn "Anh ơi, tôi biết anh quen chị Lan phòng kế toán, chuyển giúp tôi…" → Cáo giật mình vì sao nó biết — trực tiếp hơn, và tự nhiên dẫn sang cơ chế.

**3. "Một cuộc gọi, hai câu trả lời" — 5.5/10**

| Tiêu chí | Điểm | Nhận xét |
|---|---|---|
| Hook & giữ chân | 5 | "Cáo bắt máy, bạn hỏi tiền chuyển vào đâu" — Codex tự nhận giống cuộc gọi công việc. Thiếu twist rõ, khán giả chưa thấy tại sao phải xem tiếp. |
| Khớp brief | 6 | Cơ chế clone có nhưng bắt đầu từ giây 8, hook 0–5s chưa rõ vấn đề giả mạo. |
| Khả thi sản xuất | 6 | "Cuộc gọi" khó minh hoạ bằng hình tĩnh 9:16. Character + Explainer dựng được nhưng cảnh gọi điện thiếu chiều sâu thị giác (chỉ có Cáo + điện thoại). |
| An toàn | 8 | An toàn, hướng phòng thủ. |
| Độc đáo | 5 | Rất gần Claude #2 "Hai cuộc gọi" — cùng ý tưởng gọi xác minh, chỉ khác góc kể. |

**Điểm yếu cụ thể:** Trùng ý với Claude #2 và yếu hơn — Claude có cấu trúc "hai cuộc gọi đối lập" rõ ràng hơn, Codex chỉ có "một cuộc gọi" rồi giải thích. Concept này không mang lại góc nhìn mới nào so với tổng thể 6 concept.

**Cách sửa:** Nếu giữ, cần hook mạnh hơn hẳn — ví dụ: Cáo bắt máy nghe bạn nói "Cám ơn, tao đã chuyển rồi" (hậu quả đã xảy ra, không thể đảo ngược) → stakes cao hơn nhiều.

#### Tổng hợp xếp hạng

| Hạng | Concept | Tổng /50 | Ghi chú |
|---|---|---|---|
| 1 | Claude #1 "Ba mảnh" | **38** | Hoàn chỉnh nhất, bám brief chặt; cần thêm beat giữa |
| 2 | Codex #2 "Biết tên đồng nghiệp" | **36.5** | Góc độc đáo nhất; cần sửa hook trực tiếp hơn |
| 3 | Claude #3 "Tự kiểm hồ sơ" | **37** | Góc hay nhưng hook yếu; ghép sự cố vào đầu là đủ |
| 4 | Codex #1 "Hai khung chat" | **34** | Layout 9:16 chưa giải quyết được |
| 5 | Claude #2 "Hai cuộc gọi" | **33** | Cơ chế bị phụ hoá |
| 6 | Codex #3 "Một cuộc gọi" | **30.5** | Trùng ý, hook yếu |

**Gợi ý lai:** Claude #1 (cấu trúc + hook) + Codex #2 (góc "biết đồng nghiệp" làm escalation beat ở giây 25–30) sẽ cho bản mạnh nhất — hook bằng tin vay tiền, cơ chế 3 mảnh, rồi escalate bằng "nó còn biết cả vòng quan hệ của bạn" trước khi vào giải pháp.

> Ghi chú người điều phối: khẳng định của Gemini "danh sách bạn bè mặc định có thể là Public; bạn chung vẫn hiện kể cả khi đặt 'Only me'" dựa trên nguồn thứ cấp (blog, AARP — không có URL bài cụ thể), chưa phải tài liệu chính thức của Meta → Kịch bản không được khẳng định, chỉ nói "nếu để công khai". Thứ hạng tổng điểm của Gemini có lỗi thứ tự (37 xếp dưới 36,5) nhưng không đổi kết luận.

**Tóm tắt Vòng 1 — phản biện:** Ba giọng cùng xếp Claude #1 đứng đầu và cùng đề xuất một bản lai: hook tin vay tiền của giám đốc → cơ chế "hồ sơ khác, đủ giống" (bằng chứng: tài khoản thật vẫn đăng nhập được) → điểm nhấn thứ hai "nó biết cả người quen của bạn" (từ Codex #2) → kết gọi số đã lưu. Điểm cần sửa chung: không "ba mảnh bay sang khung trống" (giống hướng dẫn), không hai khung cạnh nhau trên 9:16, bỏ số liệu thiệt hại và nhánh deepfake, không khẳng định cài đặt mặc định của Facebook.

## Vòng 2 — Trả lời phê bình + bản cải tiến

### Giọng Claude — `ideator-a` (nguyên văn)

**Trả lời Gemini**
- C1, đoạn giữa đơn tuyến, thiếu đỉnh thứ hai: **nhận.** Tôi chèn một nhịp leo thang vào giây 22–30, dùng ý "nó biết cả người quen của bạn" của Codex C2. Tôi không dùng đề xuất "giả danh Cáo trong nhóm lớp". Đề xuất đó nới hệ quả sang chỗ khác và làm loãng cơ chế chính.
- Điểm "độc đáo 6", cơ chế bị phụ hoá: **phản bác một phần.** Trong C1 của tôi cơ chế là trục chính (3–15s), không phải phụ lục. Phần "phụ hoá" Gemini nêu ở C2 "Hai cuộc gọi", và tôi đã bỏ concept đó. Tôi nhận ý "độc đáo thấp": bản mới có một bằng chứng hình bất ngờ ở giây 5–9.
- C3 thiếu conflict: **nhận.** C3 bị gộp vào bản lai, hook là tin vay tiền.

**Bản cải tiến (lai C1 Claude + hai hồ sơ xếp dọc của Codex + beat leo thang)**

**Tên:** "Tôi vẫn đăng nhập được, vậy ai đang nhắn?"

**Hook (0–2s):** Màn chat dọc hiện dòng "Sao mày vừa vay tao 5 triệu?". Cáo nhìn điện thoại và nói: "Tôi chưa nhắn gì cả." Không có nhãn trên hình. "Ví dụ dựng" nằm ở caption và `publish.json`.

**Nhịp**
- **0–3s:** Opening ba pha. Tin vay tiền, Cáo ngơ ngác, rồi chữ kinetic "Không ai hack Cáo." Hệ quả trước giây 5: bạn của Cáo đang gõ "ok, chuyển liền".
- **3–15s:**
  - Giây 5–9, bằng chứng R11: Cáo mở máy, đăng nhập tài khoản của mình bình thường, lịch sử chat không có tin vay nào. Cắt sang màn của người bạn, nơi tin vay đến từ một hồ sơ khác.
  - **Giây 10–12, trả lời câu hỏi mở:** đó là một hồ sơ riêng, dùng tên và ảnh "đủ giống để người quen tin nhầm". Không cần mật khẩu của Cáo.
- **15–45s:**
  - 15–22s, cơ chế duy nhất. Hai hồ sơ minh hoạ xếp dọc, trên là "hồ sơ của Cáo", dưới là "hồ sơ khác". Đánh dấu ảnh và tên khớp nhau. Nói rõ: "nếu thông tin này để công khai, ai cũng nhìn thấy được".
  - **22–30s, beat leo thang:** hồ sơ khác nhắn "Anh quen chị Lan phòng kế toán đúng không?". Cáo giật mình vì sao nó biết. Danh sách bạn bè, nếu để công khai, giúp người lạ biết nên nhắn cho ai và xưng hô thế nào.
  - 30–45s, sai lầm thường gặp: tin vì ảnh và tên quen, trả lời ngay vì tin khẩn, cho rằng "thấy mặt là thật". Không dạy cách dựng hồ sơ.
- **Kết (45–60s):** Cáo gọi số đã lưu trong danh bạ, người bạn thật bắt máy: "Tao đâu có vay." Người bạn dừng chuyển tiền. Bốn việc cần làm: gọi số đã lưu trước khi chuyển, báo bạn bè, báo cáo hồ sơ giả, rà lại phần mình để công khai. Câu hỏi tương tác: "Gặp tin vay tiền bất ngờ, bạn gọi ai trước?"

**Bằng chứng hình R11:** hai cảnh cắt nối nhau. Một cảnh là màn hình Cáo vẫn đăng nhập được và hộp thư sạch. Cảnh kia là màn người bạn nhận tin từ hồ sơ khác. Hai tình huống đối nhau chứng minh "không cần hack".

**Vì sao giữ chân:** hệ quả chạm vào người quen của người xem. Câu hỏi "ai đang nhắn?" được giải ở giây 10–12 rồi mới đào sâu. Đỉnh thứ hai ở giây 22–30 ("nó biết cả người quen") phá thế đơn tuyến.

**Công cụ:** `UiSimulationScene` cho chat, màn đăng nhập và hai hồ sơ xếp dọc, chuyển cảnh bằng cắt hoặc lật khung. `ExplainerScene` cho sơ đồ quan hệ hư cấu. `CharacterScene` cho Cáo ở đầu và cuối. TTS tiếng Việt, không nhạc, SFX tự tổng hợp. Không dùng `ComparisonScene`. Ảnh đại diện là Cáo hoạt hoạ, tên người hư cấu, không logo thật.

**Cáo xuất hiện ở:** 0–12s (sự cố, đăng nhập, câu trả lời), thoáng ở 22–30s (giật mình), và 45–60s (gọi số đã lưu, kết). Các đoạn còn lại để hình minh hoạ.

**Rủi ro**
- Hai hồ sơ xếp dọc có thể thành hướng dẫn dựng hồ sơ nếu quá chi tiết. Giữ ở mức nguyên tắc.
- Beat "chị Lan" có thể ngụ ý danh sách bạn bè luôn công khai. Mọi cảnh dùng điều kiện "nếu để công khai".
- Nhịp 22–30s phải đủ ngắn để không thành cơ chế thứ hai.
- Không dùng số liệu thiệt hại, deepfake, hay tên mục cài đặt Facebook.

### Giọng Codex (nguyên văn)

#### Vòng 2 — Phản hồi

- **C1 · Hai khung chat.** Nhận góp ý của Claude và Gemini về chữ khó đọc. Lật tuần tự hai hồ sơ, mỗi hồ sơ chiếm trọn vùng minh họa. Ảnh và tên quen khiến người nhận tưởng mình đang nói chuyện với Cáo. Nếu danh sách bạn bè được công khai, tên một người quen chung có thể khiến lời nhắn đáng tin hơn. Bỏ nhãn trên hình, nói “ví dụ dựng” trong lời mở và đặt nhãn AI ở mô tả.
- **C2 · Biết tên đồng nghiệp.** Nhận góp ý của cả hai về hook gián tiếp. Cho bạn Cáo nhận tin vay tiền trực tiếp. Chi tiết người quen chung xuất hiện sau khi đã giải thích vai trò của ảnh và tên, với điều kiện danh sách bạn bè được công khai.
- **C3 · Cuộc gọi.** Nhận góp ý của cả hai về hệ quả yếu và ý trùng. Dùng cuộc gọi ở đoạn kết, nơi nó giúp người bạn quyết định dừng chuyển tiền.
- **Hướng lai.** Giữ cú lật trước giây 5. Việc Cáo vẫn đăng nhập chỉ là chi tiết tình huống. Dấu hiệu trực quan là tin vay đến từ một hồ sơ riêng.

#### Bản cải tiến — Ai vừa nhắn vay tiền?

**Hook (0–2s).** Cáo nghe bạn hỏi “Sao mày vừa vay tao 5 triệu?” Lời dẫn xác định đây là ví dụ dựng. Video dành cho người hay nhắn tin với bạn bè trên Facebook, với thông điệp gọi số đã lưu trước khi chuyển tiền.

**Nhịp**

- **0–3s.** Cáo xuất hiện, câu hỏi vang lên, rồi cắt vào tin vay.
- **3–15s.** Trước giây 5, người bạn sắp chuyển tiền thì Cáo mở được hồ sơ của mình. Lật sang hồ sơ riêng đã gửi tin vay. **Giây 12 trả lời câu hỏi:** ảnh và tên công khai có thể khiến hồ sơ khác trông đủ quen để người nhận tin nhầm.
- **15–45s.** Khoảng giây 27, tin nhắn nhắc tên một người quen chung. Nếu danh sách bạn bè được công khai, cái tên ấy có thể làm câu chuyện nghe đáng tin hơn. Sai lầm là xem chi tiết quen thuộc như bằng chứng xác minh danh tính.
- **45–62s.** Bạn gọi số Cáo đã lưu, xác nhận Cáo không vay và dừng chuyển tiền. Chốt bốn việc gồm thu hẹp thông tin công khai, báo bạn bè, báo cáo tài khoản giả và gọi xác minh trước khi chuyển tiền. Mời nhẹ “Bạn sẽ làm việc nào trước?”

**Bằng chứng hình và giữ chân.** Hai hồ sơ hiện lần lượt, có ảnh và tên tương tự nhưng mã hồ sơ mô phỏng khác nhau. Khán giả thấy ngay nguy cơ chuyển nhầm, nhận lời giải ở giây 12 rồi thấy vì sao lời nhắn vẫn dễ thuyết phục.

**Công cụ.** `UiSimulationScene`, `ExplainerScene`, `CharacterScene`. Dọc 9:16, 1080×1920, TTS, không nhạc. Cáo tĩnh xuất hiện ở mở, giữa và kết, rộng 10–18% khung khi cùng minh họa.

**Rủi ro.** Giao diện trung tính, không logo hay tên nút Meta. Chỉ minh họa dấu hiệu nhận biết, bỏ thao tác dựng hồ sơ.

### Giọng Gemini (nguyên văn)

#### A. Trả lời từng điểm phê bình của Claude

**G1 "Bản sao 5 phút"**

| Điểm phê | Nhận / Phản bác |
|---|---|
| `ComparisonScene` không có → hai khối UiSimulation xếp dọc | **Nhận.** Giải pháp đúng: dùng 2 `UiSimulationScene` tuần tự (lật flip), không xếp so sánh song song. |
| Dấu hiệu "tạo cùng ngày, 0 bạn chung" quá chắc | **Nhận.** Kẻ gian có thể add trước vài bạn chung; nói chắc gây ảo tưởng an toàn sai. Sửa: chỉ nói "có thể có dấu hiệu" và luôn quay về xác minh bằng gọi điện. |
| "Hai tài khoản trùng khít" → đổi "đủ giống để người quen tin nhầm" | **Nhận.** Chính xác hơn vì kẻ gian thường không clone 100%. |
| Nhồi số liệu 18.900 tỷ trái chuẩn một cơ chế | **Nhận.** Số liệu này là tổng thiệt hại lừa đảo chung 2020–2025 (nguồn: Bộ Công an qua VOV), không riêng giả mạo — dùng sẽ misleading. **Bỏ.** |
| Tên "Cáo Minh" phải hư cấu | **Nhận.** Tên nhân vật mình dựng → phải ghi rõ là ví dụ hư cấu. |

**G2 "Bạn đang công khai gì"**

| Điểm phê | Nhận / Phản bác |
|---|---|
| Hook ổ khoá/bảng cài đặt không có hệ quả trước giây 5 | **Nhận.** Mở bằng giao diện cài đặt thiếu stakes — người xem chưa thấy ai bị ảnh hưởng. Cần đặt hệ quả (tin nhắn vay tiền) trước. |
| "Danh sách bạn bè mặc định công khai" chưa kiểm tài liệu Meta | **Nhận một phần.** Nhiều nguồn uy tín (Business Insider, Android Authority) ghi mặc định là Public, nhưng tôi không tìm được trang Help Center chính thức của Facebook xác nhận chính xác giá trị default hiện tại. → Sửa: chỉ nói "nếu bạn đang để công khai" (dùng "nếu", không khẳng định default). |
| Danh sách 4 dấu hiệu làm loãng | **Nhận.** Video chỉ cần MỘT cơ chế chính, dấu hiệu gộp vào phần kết nhẹ nhàng. |

**G3 "Cuộc gọi 10 giây"**

| Điểm phê | Nhận / Phản bác |
|---|---|
| Giải pháp trước cơ chế → không trả "vì sao không cần hack" sớm | **Nhận.** Đảo cấu trúc — phải dẫn cơ chế trước, giải pháp sau. |
| Nhánh deepfake gọi video = cơ chế thứ hai | **Nhận.** Vi phạm nguyên tắc "một cơ chế chính". Bỏ deepfake, chỉ giữ "gọi số đã lưu" là đủ. |
| "Gọi điện thoại thường, không qua app vì deepfake" là khẳng định mạnh | **Nhận.** Sửa: chỉ nói "gọi lại bằng số đã lưu sẵn trong danh bạ" — không cần giải thích tại sao không qua app. |

**Về số liệu chung:** Tôi đã kiểm lại — con số 36% vụ lừa đảo tại VN liên quan giả mạo danh tính (GSMA 2026 qua Tuổi Trẻ) là cụ thể hơn nhưng vẫn không riêng giả mạo Facebook. → **Bỏ toàn bộ số liệu khỏi video**, tập trung minh hoạ cơ chế.

#### B. BẢN CẢI TIẾN (lai, 1 bản duy nhất)

**Tên:** "Tin nhắn 5 triệu"

**Hook (0–3s):**
Màn hình Messenger — tin nhắn từ hồ sơ có ảnh đại diện quen mặt: *"Ê cậu cho tao vay 5 triệu, tao gửi lại chiều nay"* (ví dụ dựng). Cáo (nhân vật hư cấu, dáng tĩnh) đang ngồi cầm điện thoại, nhíu mày. Lời đọc: *"Bạn thân gửi tin vay tiền — nhưng bạn thân đang ngồi cạnh bạn."*
→ **Stakes ngay giây 1:** tiền + niềm tin bị đe doạ. Giây 3 rõ: tin đến từ ai đó KHÁC, không phải bạn thân.

**Nhịp:**

| Đoạn | Giây | Nội dung | Công cụ |
|---|---|---|---|
| **Opening 3 pha** | 0–5s | *Visual hook:* Messenger hiện tin "vay 5 triệu" (UiSim). *Conflict:* Cáo nhìn sang bạn ngồi kế bên — bạn không gửi tin nào (CharacterScene, dáng tĩnh). *Topic reveal:* Lời đọc: "Không ai hack tài khoản bạn. Vậy tin đó từ đâu?" | `UiSimulationScene` + `CharacterScene` |
| **Cơ chế chính** | 5–25s | Lật sang hồ sơ giả: `UiSimulationScene` hiện hồ sơ Facebook giả với ảnh đại diện giống (ảnh AI, không người thật) + tên gần giống. Lời đọc dẫn: kẻ gian chỉ cần thông tin **bạn đang công khai** — ảnh đại diện ai cũng thấy, tên hiển thị, và **nếu** danh sách bạn bè đang để công khai thì kẻ gian biết nhắn ai. Minh hoạ: `ExplainerScene` vẽ sơ đồ 3 mảnh thông tin (ảnh → tên → danh sách bạn) bay vào khung hồ sơ giả, **tuần tự không đồng thời** (không phải "ba mảnh ghép" dạng hướng dẫn — chỉ cho thấy nguyên liệu, không chỉ cách). Nhấn: "Không cần mật khẩu, không cần hack — chỉ cần bạn để công khai." | `UiSimulationScene` → `ExplainerScene` |
| **Leo thang** | 25–35s | Kẻ giả nhắn tin cho người trong danh sách bạn bè, **nhắc tên người quen chung** ("Hôm qua gặp anh X ở quán…") để tăng độ tin. `UiSimulationScene` hiện đoạn chat giả với chi tiết cá nhân (ví dụ dựng). Lời đọc: "Nếu danh sách bạn bè để công khai, kẻ gian biết bạn chơi với ai — và nhắc đúng tên." Cáo xuất hiện lại, dáng tĩnh, giơ tay chặn (ý "dừng lại"). | `UiSimulationScene` + `CharacterScene` |
| **Giải quyết + 4 việc** | 35–50s | Lời đọc: "Cáo gọi lại bằng số đã lưu sẵn — đúng là bạn thân không gửi tin nào." `UiSimulationScene` hiện cuộc gọi (giây ~37 — **đây là giây trả lời câu hỏi mở đầu**). Sau đó `ExplainerScene` liệt kê 4 việc: ① Kiểm tra và thu hẹp thông tin công khai (ảnh, bạn bè) ② Báo bạn bè nếu thấy tài khoản giả ③ Báo cáo tài khoản giả trên Facebook (vào hồ sơ giả → ⋯ → "Báo cáo" → "Giả mạo ai đó"; hoặc dùng biểu mẫu tại `facebook.com/help/contact/295309487209748` nếu không có tài khoản) ④ Luôn gọi lại bằng số đã lưu trước khi chuyển tiền. | `UiSimulationScene` → `ExplainerScene` |
| **Kết** | 50–55s | Cáo dáng tĩnh. Lời đọc nhẹ: "Bạn từng kiểm ai xem được danh sách bạn bè mình chưa? Gõ xuống bình luận." (mời chọn nhẹ, không ép). | `CharacterScene` |

**Giây trả câu hỏi mở:** ~37s (Cáo gọi xác minh → bạn thân không gửi tin → kẻ giả mạo bị lộ).

**Vì sao giữ chân người xem:**
- Giây 1–3: hệ quả tài chính cụ thể (5 triệu) + nghịch lý (bạn thân ngồi cạnh mà "bạn thân" nhắn vay tiền).
- Giây 5: câu hỏi rõ ("Vậy tin đó từ đâu?") — ích lợi sớm: người xem muốn biết để tự bảo vệ.
- Giây 5–25: cơ chế duy nhất được "mở từng lớp" (ảnh → tên → bạn bè) — không phải danh sách, mà là câu chuyện leo thang.
- Giây 25–35: chi tiết gọi tên người quen tăng sốc — "nó còn biết bạn chơi với ai".
- Giây 37: giải quyết — thoả mãn câu hỏi mở, không kéo dài vô ích.

**Bằng chứng hình cho cơ chế:**
- Hồ sơ giả (UiSim) đặt cạnh hồ sơ thật (UiSim thứ hai, lật tuần tự — không so sánh song song vì không có ComparisonScene): ảnh giống, tên gần giống, **không khẳng định "0 bạn chung"** hay ngày tạo — chỉ cho thấy "đủ giống để người quen tin nhầm".
- Sơ đồ 3 nguyên liệu (ExplainerScene): minh hoạ trực quan, tuần tự, không dạng hướng dẫn.
- Đoạn chat leo thang (UiSim): kẻ gian nhắc tên bạn chung.

**Nguồn chính thức Meta đã kiểm:**
- Báo cáo tài khoản giả mạo (không cần tài khoản): `https://www.facebook.com/help/contact/295309487209748`
- Quyền xem danh sách bạn bè: Cài đặt → Đối tượng và khả năng hiển thị → Cách mọi người tìm và liên hệ với bạn → "Ai có thể xem danh sách bạn bè của bạn?" (nguồn: nhiều hướng dẫn uy tín mô tả đường dẫn này; trang Help Center chính thức Facebook không có bài riêng xác nhận giá trị mặc định → video **chỉ nói "nếu bạn đang để công khai"**, không khẳng định default).

**Công cụ:** `UiSimulationScene` (Messenger, hồ sơ, chat, cuộc gọi), `ExplainerScene` (sơ đồ cơ chế, 4 việc), `CharacterScene` (Cáo dáng tĩnh 3 lần: mở/giữa/kết). Nền tổng hợp. TTS. Không nhạc. Ảnh AI không chữ/logo/người thật.

**Rủi ro thừa nhận:**
1. UiSim Messenger/hồ sơ phải đủ giống giao diện thật để người xem nhận ra nhưng không dùng logo/trademark Facebook → cần thiết kế cẩn thận, có thể cần storyboard kỹ.
2. Đoạn leo thang (nhắc tên bạn chung) có thể bị hiểu là "hướng dẫn" nếu quá chi tiết → giữ ở mức "kẻ gian LÀM ĐƯỢC việc này" chứ không dạy CÁCH.
3. Thời lượng ~55s — sát giữa ngưỡng 45–75s, cần kiểm khi dựng thật; nếu dài hơn, rút đoạn leo thang xuống ~8s.
4. Không có số liệu định lượng trong video (đã bỏ theo phê bình) → thiếu "bằng chứng quy mô"; chấp nhận vì brief yêu cầu một cơ chế, không phải thống kê.

> Ghi chú người điều phối (cho người chốt, không phải phán quyết): (1) Gemini nêu đường dẫn thao tác báo cáo/cài đặt của Facebook và một URL biểu mẫu khác số với URL ở vòng 1 (…295309487309484 ở vòng 1, …295309487209748 ở vòng 2), chưa có ai mở kiểm → theo brief, chưa được đưa tên nút/đường dẫn thao tác vào video. (2) Gemini đổi hook thành "bạn thân đang ngồi cạnh" và đặt giây trả lời ở ~37 s (muộn hơn hai giọng kia, ~10–12 s). (3) Codex đề xuất nói "ví dụ dựng" trong lời mở — tốn thời lượng hook; luật chỉ yêu cầu ghi ở caption/`publish.json`.

**Tóm tắt Vòng 2:** Ba bản cải tiến hội tụ gần như trọn: hook tin vay 5 triệu → bằng chứng "tài khoản thật vẫn bình thường, tin đến từ hồ sơ khác" → hai hồ sơ hiện tuần tự, "đủ giống" nhờ ảnh và tên công khai → nhịp leo thang "nhắc tên người quen chung" (có điều kiện "nếu để công khai") → kết gọi số đã lưu + 4 việc. Khác nhau chỉ ở chi tiết (giây trả lời 10–12 s hay 37 s; hook "bạn thân ngồi cạnh"; câu mời cuối). **Dừng tranh luận sau vòng 2 (đồng thuận sớm):** không chạy lượt phản biện bản cải tiến vì ba bên đã thống nhất trục, cơ chế, cấu trúc và các điều cấm; các khác biệt còn lại là chi tiết để người chốt quyết.

## Phán quyết cuối

*(Claude `ideator-b`, 21/11/2026 — dán nguyên văn)*

**Chọn: bản lai, nền là bản cải tiến vòng 2 của Claude ("Tôi vẫn đăng nhập được, vậy ai đang nhắn?").** Có hai phần lấy từ Codex và một phần từ Gemini.

**Lý do và cách cân nhắc:** Ba giọng đã hội tụ về cùng trục: hook vay 5 triệu, tài khoản thật vẫn bình thường, hồ sơ khác "đủ giống", một nhịp leo thang nhắc người quen, kết gọi số đã lưu. Điểm khác nhau nằm ở chi tiết, và tôi quyết như sau.
- **Chọn theo Codex:** giây trả lời đặt ở khoảng 11–12 s, nhờ cú lật trước giây 5. Bản Gemini trả lời ở giây 37 là muộn, vì 37 s đã quá nửa video và người xem chưa biết ai nhắn. Tôi cũng lấy bằng chứng "Cáo vẫn mở được hồ sơ của mình" của Codex làm chi tiết tình huống.
- **Chọn theo Gemini:** lời hook bám vào nghịch lý "bạn thân nhắn vay tiền, mà bạn thân ngồi cạnh bạn". Lý do: cụ thể hơn "Tôi chưa nhắn gì cả" và có hình ngay. Tôi cũng nhận ý sơ đồ nguyên liệu hiện tuần tự, và ý rút đoạn leo thang xuống ≈ 8 s nếu quá giờ.
- **Chọn theo Claude:** khung nhịp, hai hồ sơ xếp dọc hoặc lật tuần tự, và danh sách điều cấm.
- **Bác phần của Gemini:** đường dẫn thao tác, URL biểu mẫu Meta và "báo cáo → Giả mạo ai đó". Cả hai chưa ai mở kiểm, và vòng 1 với vòng 2 còn ghi hai số URL khác nhau.

**Kiểm nguồn của tôi (đã mở bài, 21/11/2026):** Bài CafeF dẫn Công an TP Hà Nội, đăng 08/11/2026, nói đối tượng lập tài khoản giả hoặc chiếm tài khoản của người quen, dùng đúng ảnh và tên. Bài khuyến cáo không xác định danh tính chỉ qua tên và ảnh, mà gọi theo số đã lưu hoặc gặp trực tiếp, và không xác nhận qua chính cuộc chat. Cảnh báo của Bộ Công an trong các bài tìm được chủ yếu nói về tài khoản bị chiếm. Vì vậy phần "hồ sơ khác, không cần hack" chỉ được gán cho Công an Hà Nội qua CafeF, không gán cho Bộ Công an.

**Hook (2 s đầu):** Chat dọc hiện "Sao mày vừa vay tao 5 triệu?", Cáo nhìn điện thoại. Lời hook: "Bạn thân nhắn vay tiền, mà bạn thân đang ngồi cạnh bạn." Không nhãn trên hình. "Ví dụ dựng" và nhãn AI để ở caption và `publish.json`, **không nói trong lời**, vì tốn giây hook.

**Vấn đề, đối tượng, thông điệp:** Dân văn phòng dùng Facebook và Messenger. Thông điệp: ảnh và tên quen không chứng minh đó là người quen, nên gọi số đã lưu trước khi chuyển tiền.

**Ích lợi đầu tiên:** Câu "không ai hack tài khoản bạn" ở giây 4–5. **Câu hỏi mở** ("tin này từ đâu?") được **trả ở giây 11–12**. Cú gọi xác minh ở khoảng giây 45 là kết giải quyết tình huống đã mở, không phải câu trả lời cho câu hỏi.

**Cấu trúc (60 s, mục tiêu 55–62 s, 1 cơ chế):**
- 0–5 s: opening ba pha, hệ quả bạn sắp chuyển tiền.
- 5–12 s: bằng chứng hình và câu trả lời.
- 12–22 s: cơ chế, hai hồ sơ lật tuần tự, "nếu để công khai".
- 22–30 s: beat người quen chung, tối đa 8 s, không phải cơ chế thứ hai.
- 30–42 s: sai lầm.
- 42–60 s: gọi số đã lưu, bốn việc, câu mời.
- Cảnh Cáo ≲ 25%. R15 đủ năm ý (tình huống, cơ chế, ví dụ, sai lầm, bài học). Câu hỏi "số liệu" bỏ vì brief cấm số thiệt hại chưa kiểm.

**Câu mời cuối:** "Gặp tin vay tiền bất ngờ, bạn gọi ai trước?" Bỏ "gõ rồi/chưa" của Gemini.

**Tên nhân vật hư cấu:** Cáo và "Bạn của Cáo" (gọi tên "Mít"), người quen chung là "chị Lan". Không dùng "Cáo Minh".

**Ràng buộc cho Kịch bản:**
- **Phải kiểm nguồn:** (1) CafeF/Công an Hà Nội, đã mở nhưng Kịch bản tự mở lại để trích đúng. (2) Cảnh báo Bộ Công an về xác minh qua điện thoại, mở bài gốc, ghi đúng cơ quan và phạm vi. (3) Meta Help, nếu muốn nói gì về báo cáo thì phải mở và ghi rõ trang, nếu không thì chỉ nói "báo cáo hồ sơ giả".
- **Cấm:** tên nút hoặc đường dẫn cài đặt chưa kiểm, "mặc định công khai" (chỉ "nếu để công khai"), số thiệt hại hoặc tỷ lệ, deepfake và "đừng gọi qua app vì...", nhãn trên hình, "giống hệt" (dùng "đủ giống để người quen tin nhầm"), hướng dẫn dựng hồ sơ, logo Meta, người thật, dấu hiệu nhận biết bản giả kiểu "0 bạn chung".
- **Điều kiện thành công:** nói rõ thông tin công khai làm bản giả trông quen. Không đổ lỗi nạn nhân, lỗi ở kẻ gian.

**Bộ câu Cáo đề xuất (không chào cố định):** mở "Cáo chưa nhắn gì cả." Cơ chế "Bạn thử nghĩ xem, ai cũng xem được ảnh với tên." Sai lầm "Ối, ai cũng từng tin vì ảnh quen." Kết "Chốt nhé: đổi kênh trước khi đổi tiền."

**Bản đồ Cáo sơ bộ:** 0–12 s `surprised` rồi `think`; 22–30 s `stop` thoáng; 45–60 s `thumbs_up`. Các đoạn còn lại là hình minh hoạ.

**Điểm bất đồng còn lại:** Gemini muốn đưa đường dẫn báo cáo Meta vào video. Tôi bác cho đến khi có trang Meta mở kiểm được. Không còn điểm bế tắc.

> Ghi chú người điều phối cho Kịch bản: hook ghép "Sao mày vừa vay tao 5 triệu?" (tin của bạn hỏi lại Cáo) với lời "bạn thân nhắn vay tiền, mà bạn thân đang ngồi cạnh bạn" cần `planner` thống nhất góc nhìn (ai là người nhận tin, ai ngồi cạnh ai) để không rối; tên dáng Cáo (`surprised`, `think`, `stop`, `thumbs_up`) phải đối chiếu danh sách dáng thật trong `docs/mascot.md`.
