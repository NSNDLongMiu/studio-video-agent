Tôi đã tìm đủ nguồn. Giờ tôi trả lời đúng định dạng Vòng 2.

---

## Vòng 2 — Trả lời phê bình + Bản cải tiến

### A. Trả lời từng điểm phê bình của Claude

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

---

### B. BẢN CẢI TIẾN (lai, 1 bản duy nhất)

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