# Tranh luận Ý tưởng — T21 (IT-T21-E01)

Chủ đề #21: Cho bạn mượn tài khoản ngân hàng "nhận hộ tiền": có thể bị phạt 100–150 triệu và bị phong toả tài khoản
Đội: IT · Đội 3 (team_id 4) · 1 tập · 2 vòng tranh luận · ngày 21/11/2026

## Gói tín hiệu
(Dữ liệu ngoài, chỉ để tham khảo; `node tools/signals/collect.mjs --dept it`, bản lưu `.local/signals/it-2026-11-21-e7bd6a.md`)
- [google gợi ý] "cho mượn tài khoản ngân hàng" → *có bị phạt không* · *bị phạt bao nhiêu* · *bị xử lý như thế nào* · *có sao không* · *có nên cho mượn tài khoản ngân hàng không* · *có nên cho mượn số tài khoản ngân hàng không* · *cho mượn tài khoản ngân hàng để giải ngân* · *tội cho mượn tài khoản ngân hàng*
- [google gợi ý] "tài khoản ngân hàng bị phong toả" → *là sao* · *khi nào* · *bị công an phong toả* · *lý do* · *cách mở tài khoản bị phong toả* · *tại sao*
- [google gợi ý] "bán tài khoản ngân hàng bị phạt" → *bị phạt bao nhiêu* · *mua bán tài khoản ngân hàng bị phạt*
- [ytb gợi ý] "tài khoản bị khoá vì nhận tiền lạ" → *tài khoản ngân hàng bị khóa thì phải làm sao* · *tại sao tài khoản ngân hàng bị khoá* · *cách mở lại tài khoản ngân hàng bị khóa*
- Xu hướng tìm kiếm hôm nay: không mục nào khớp phòng.
- Tin (2 ngày): không có tin mới trực tiếp về cho mượn tài khoản; tin bảo mật chung (deepfake, mật khẩu 123456) không liên quan.
- Tín hiệu từ đề xuất chủ đề (đã kiểm nguồn lúc scout): tin 29–30/10/2026 hàng loạt người bị phong toả tài khoản sau một giao dịch nhận tiền (Cục An ninh mạng qua CafeF).

## Dữ kiện đã có nguồn (từ đề xuất chủ đề, cần kiểm lại ở Kịch bản)
- Nghị định 340/2025/NĐ-CP, hiệu lực 09/02/2026, Điều 30 khoản 5a: mua, bán, thuê, cho thuê, mượn, cho mượn tài khoản thanh toán — từ 1 đến dưới 10 tài khoản phạt 100–150 triệu; từ 10 tài khoản phạt 150–200 triệu (CafeF 01/11/2026; văn bản gốc là PDF ảnh quét, đối chiếu qua 3 trang chép lại).
- Phong toả theo văn bản của cơ quan có thẩm quyền; chủ tài khoản thường không biết (Cục An ninh mạng qua CafeF 30/10/2026).
- Người đứng tên tài khoản phải giải trình (Bộ Công an 28/08/2026).
- KHÔNG khẳng định: chủ tài khoản "không biết" chắc chắn đồng phạm hay chắc chắn vô can; mức án tù, "Điều 291", vụ sinh viên cụ thể. KHÔNG dùng mức phạt cũ 40–100 triệu (NĐ 88/2019). Không tên ngân hàng, không kết tội ai.

(Ghi chú điều phối: lần chạy đầu bị ngắt sau khi ghi gói tín hiệu; vòng 1 dưới đây làm ở lần chạy lại cùng ngày 21/11/2026.)

## Vòng 1 — Đề xuất độc lập

### Giọng Claude (`ideator-a`) — nguyên văn

**Concept A — "Một lần thôi mà"**
- Hook (0-2s): Tin nhắn dựng từ bạn thân: "Cho tao mượn tài khoản nhận hộ tiền một lần thôi nha". Chữ lớn: "Tối đó, tài khoản của bạn bị khoá." (ví dụ dựng)
- Nhịp: 0-3s tình huống, tin nhắn và thông báo khoá. Câu hỏi mở: "Vì sao chỉ nhận hộ mà tài khoản bị phong toả?" 3-15s: tiền vào có thể là tiền lừa đảo, người bị hại báo, cơ quan có thẩm quyền ra văn bản phong toả, chủ tài khoản thường không biết. 15-50s: cơ chế qua đường đi của tiền (bị hại → tài khoản bạn → người nhờ), ví dụ dựng một khoản, sai lầm "một lần, bạn thân, có tiền công", phạt 100–150 triệu theo NĐ 340/2025 (cho mượn 1 đến dưới 10 tài khoản), phải giải trình. Kết (50-60s): trả lời ở giây ~12 (tiền có thể là tiền lừa đảo) và chốt: tài khoản đứng tên bạn thì bạn chịu trách nhiệm, thấy lời nhờ này thì từ chối.
- Giữ chân: hệ quả gần (bạn thân, tài khoản của chính mình), đường đi tiền là hình động theo dõi được, có con số cụ thể.
- Cách làm: Remotion, khung chat dựng, sơ đồ mũi tên tiền, cảnh Cáo ít (nhắc nhẹ cuối). Giọng TTS, không nhạc ngoài.
- Rủi ro: dễ giống nhiều video cảnh báo khác; phải tránh nói chắc "vô can/đồng phạm".
- Tín hiệu: [google gợi ý] "cho mượn tài khoản ngân hàng" → *có bị phạt không*, *bị phạt bao nhiêu*; tin 29–30/10/2026 hàng loạt người bị phong toả sau một giao dịch nhận tiền.

**Concept B — "Tài khoản của tôi, tiền của ai?"**
- Hook: Màn hình app ngân hàng dựng: số dư +20.000.000 từ người lạ, chữ "Tiền này của ai?" (số dựng).
- Nhịp: 0-3s tiền lạ vào, hệ quả: tài khoản có thể bị khoá. 3-15s người nhờ nói "tiền của tao, trả lại sau". 15-50s: cơ chế "tiền đi qua tài khoản bạn thì tên bạn nằm trên dấu vết": bên bị hại truy dấu, cơ quan chức năng thấy tên chủ tài khoản, yêu cầu giải trình; mức phạt 100–150 triệu; sai lầm: "tự chuyển trả lại" hoặc rút hết, nên liên hệ ngân hàng/cơ quan chức năng. Kết: quay lại câu hỏi: tiền không của bạn, nhưng dấu vết là của bạn.
- Giữ chân: nhìn từ góc người nhận tiền lạ, tạo tò mò "rồi sao nữa".
- Cách làm: mockup app chung chung (không tên ngân hàng, không logo), Remotion, kinetic số.
- Rủi ro: lời khuyên "tự chuyển trả" cần kiểm lại ở Kịch bản; chỉ nêu "báo ngân hàng/công an", không khẳng định thủ tục cụ thể.
- Tín hiệu: [ytb gợi ý] "tài khoản bị khoá vì nhận tiền lạ" → *tại sao tài khoản ngân hàng bị khoá*.

**Concept C — "Ba câu hỏi trước khi gật đầu"**
- Hook: Bạn thân nhắn nhờ, Cáo cầm điện thoại, chữ "Trả lời 3 câu rồi hẵng gật" (ví dụ dựng).
- Nhịp: 0-3s lời nhờ, nêu hệ quả (phạt 100–150 triệu, khoá tài khoản). 3-15s: vì sao hỏi: tiền có thể là tiền lừa đảo. 15-50s: ba câu: Tiền của ai? Vì sao không dùng tài khoản của họ? Nếu có chuyện, ai giải trình? Mỗi câu một cảnh minh hoạ, nêu sai lầm "tin vì quen". Kết: nếu một câu không trả lời được thì từ chối, trả lời ở giây ~10.
- Giữ chân: khung đếm 1-2-3 tạo nhịp, người xem tự áp dụng được ngay.
- Cách làm: Remotion, thẻ số, Cáo cầm điện thoại ở nhịp mở/kết, phù hợp lưu và chia sẻ.
- Rủi ro: dạng danh sách dễ lan man thành nhiều cơ chế, vi phạm "một cơ chế"; phải giữ cả ba câu xoay quanh dòng tiền.
- Tín hiệu: [google gợi ý] "cho mượn tài khoản ngân hàng" → *có nên cho mượn không*, *có sao không*.

Lưu ý chung: mức phạt theo NĐ 340/2025/NĐ-CP, hiệu lực 09/02/2026, cần Kịch bản kiểm lại nguồn gốc; không nêu mức án tù hay Điều 291, không tên ngân hàng.

### Giọng Codex — nguyên văn

**Trọng tâm** — Bạn thân nhờ nhận hộ tiền. Với dân văn phòng và sinh viên, câu hỏi là “Một lần nhận hộ có sao không?” Thông điệp là từ chối cho mượn tài khoản. Nếu tiền lạ đã vào, liên hệ ngân hàng để được hướng dẫn. Nếu tiền liên quan đến lừa đảo, người đứng tên có thể phải giải trình và tài khoản có thể bị phong toả. Mức phạt 100–150 triệu đồng áp dụng cho hành vi cho mượn từ 1 đến dưới 10 tài khoản thanh toán theo dữ kiện brief.

**Dựng chung** — 9:16, 1080×1920, khoảng 60 giây. Mở ba pha trong 0–3s bằng Cáo → lời nhờ → dấu hiệu bất thường. Cáo PNG tĩnh ở mở, giữa, kết, đổi dáng bằng cắt, rộng 10–18% khi cạnh minh hoạ. TTS miễn phí, hiệu ứng tự tổng hợp nhỏ hơn lời đọc, có nhãn AI.

**1. Tên ai trên giao dịch?**
- **Hook ≤2s** — Cáo cạnh tin nhắn “Cho mượn tài khoản nhận hộ một lần?” Nhãn “Ví dụ dựng”.
- **Nhịp** — 0–3s thẻ tiền vào ghim tên Cáo. 3–15s hiện yêu cầu giải trình trước giây 5, rồi lần theo khoản tiền có thể liên quan đến lừa đảo. Kết giây 54 trả lời “Có. Tài khoản đứng tên bạn có thể bị phong toả.” Nêu cách xử lý, mời gõ câu từ chối.
- **Giữ chân và dựng** — FlowDiagram cho thấy tiền đi tiếp trong khi giao dịch đến vẫn gắn với tên Cáo. Sửa lầm tưởng “chuyển đi là xong”.
- **Rủi ro** — Luồng dễ trông như kết luận điều tra. Gắn nhãn “nghi liên quan”.
- **Tín hiệu** — [google gợi ý] “cho mượn tài khoản ngân hàng có sao không”.

**2. Khoản tiền lạ, tiền nhà đang chờ**
- **Hook ≤2s** — Cáo cạnh tin nhắn “Nhận hộ mình một lần nhé?” Nhãn “Ví dụ dựng”.
- **Nhịp** — 0–3s lịch nhắc tiền nhà hiện cạnh khoản tiền đến. 3–15s lệnh trả tiền nhà bị chặn ở giây 4, rồi tua lại để nối khoản nhận hộ với nguy cơ phong toả. Kết giây 55 trả lời bằng hệ quả và cách xử lý.
- **Giữ chân và dựng** — `timeline_steps` và thẻ trạng thái cho thấy việc nhận hộ có thể ảnh hưởng tiền của chính mình. Sửa lầm tưởng chỉ khoản tiền lạ bị ảnh hưởng.
- **Rủi ro** — Hiện “ví dụ phong toả toàn tài khoản” để tránh khái quát.
- **Tín hiệu** — [google gợi ý] “tài khoản ngân hàng bị phong toả khi nào”.

**3. Một lần có tính không?**
- **Hook ≤2s** — Cáo đọc lời bạn thân “Cho mượn tài khoản nhận hộ đúng một lần?” Nhãn “Ví dụ dựng”.
- **Nhịp** — 0–3s nhấn “một lần”. 3–15s đặt “một lần” cạnh “một tài khoản” trước giây 5, hiện khung phạt rồi minh hoạ dòng tiền. Kết giây 53 trả lời “Một tài khoản đã nằm trong khung” và chốt từ chối.
- **Giữ chân và dựng** — `comparison` bóc nhầm lẫn giữa số lần giao dịch và số tài khoản.
- **Rủi ro** — Gắn mức phạt với hành vi cho mượn.
- **Tín hiệu** — [google gợi ý] “cho mượn tài khoản ngân hàng bị phạt bao nhiêu”.

(Ghi chú điều phối: Codex đề nghị nhãn “Ví dụ dựng” trên hình; luật xưởng 19/11/2026 không đốt nhãn lên hình, khai báo ở `publish.json`. Người chốt cần tính đến.)

### Giọng Gemini — nguyên văn
(MÔ HÌNH DỰ PHÒNG: claude-opus-4-6-thinking hết hạn mức, lượt này chạy bằng gemini-3.8-flash-high; giọng độc lập hơn với Claude nhưng lập luận có thể nông hơn.)

*Kiểm chứng pháp lý:* Nghị định 340/2025/NĐ-CP (hiệu lực từ 09/02/2026, Điều 30 khoản 5a) quy định phạt tiền từ 100.000.000 đồng đến 150.000.000 đồng đối với hành vi mua, bán, thuê, cho thuê, mượn, cho mượn từ 1 đến dưới 10 tài khoản thanh toán (nguồn: [CafeF](https://cafef.vn/tu-9-2-2026-nguoi-co-tai-khoan-ngan-hang-thuc-hien-hanh-vi-nay-co-the-bi-phat-toi-150-trieu-dong-188261101074452133.chn)).

**Concept 1: "Nhận hộ 5 triệu, phạt 150 triệu" (Góc độ Cú sốc con số)**
- **Tín hiệu:** [google gợi ý] "cho mượn tài khoản ngân hàng bị phạt bao nhiêu".
- **Hook (≤ 2s):** Tin nhắn dựng: "Cho tao mượn số tài khoản nhận hộ 5 triệu" → Đèn đỏ chớp, badge đè số dư: `-150.000.000đ` kèm nhãn "Tài khoản bị phong toả".
- **Nhịp:**
  - *0–3s:* Mở ba pha (nhận tin nhắn nhờ vả → tài khoản ting ting 5 triệu → dán nhãn phong toả & số phạt 100–150 triệu).
  - *3–15s:* Đặt vấn đề: Giúp bạn thân một lần, sao mất toi trăm triệu? Dẫn ngay Nghị định 340/2025/NĐ-CP (hiệu lực 09/02/2026).
  - *Kết (trả lời giây 52):* Cơ chế: Tiền nhận hộ thực chất từ nạn nhân lừa đảo; chủ tài khoản phải giải trình, bị cơ quan chức năng phong toả dòng tiền và xử phạt hành chính vì cho mượn tài khoản. Chốt giải pháp: Tuyệt đối không đứng tên nhận tiền hộ bất kỳ ai.
- **Vì sao giữ chân:** Cú sốc chênh lệch cực đoan giữa "giúp 5 triệu" và "gánh phạt 150 triệu", đánh thẳng vào túi tiền người xem.
- **Cách làm với công cụ hiện có:** Panel chat mô phỏng, bộ đếm số phạt nhảy từ 0 → 150.000.000đ, sơ đồ luồng tiền có gói dữ liệu đỏ chuyển trạng thái `blocked`, Cáo dáng hốt hoảng, header xuyên suốt "MƯỢN TÀI KHOẢN: PHẠT 100–150 TRIỆU".
- **Rủi ro thừa nhận:** Người xem dễ hiểu nhầm cứ nhận tiền hộ là tự động bị phạt ngay; cần nhấn rõ điều kiện: chỉ phạt khi cơ quan chức năng xác định hành vi cho mượn tài khoản và dính líu dòng tiền vi phạm.

**Concept 2: "Bẫy dòng tiền đen: Vì sao tài khoản bị khoá sạch?" (Góc độ Truy vết dòng tiền)**
- **Tín hiệu:** [google gợi ý] "tài khoản ngân hàng bị phong toả là sao" & [ytb gợi ý] "tại sao tài khoản ngân hàng bị khoá".
- **Hook (≤ 2s):** Màn hình giao diện generic: Thao tác chuyển tiền thất bại → Pop-up cảnh báo: "Tài khoản bị phong toả theo yêu cầu cơ quan thẩm quyền".
- **Nhịp:**
  - *0–3s:* Cáo định quét mã trả tiền ăn trưa thì app báo lỗi tê liệt toàn bộ giao dịch.
  - *3–15s:* Câu hỏi lớn: Bạn không hề lừa đảo ai, tại sao tài khoản nhận lương bị đóng băng?
  - *Kết (trả lời giây 50):* Cơ chế: Kẻ gian mượn tài khoản để biến bạn thành trạm trung gian rửa tiền. Khi vụ việc bị điều tra, cơ quan chức năng phong toả toàn bộ chuỗi dòng tiền liên quan; bạn vừa bị giữ sạch tiền vừa đối mặt mức phạt 100–150 triệu (NĐ 340/2025/NĐ-CP).
- **Vì sao giữ chân:** Khơi gợi nỗi sợ tê liệt tài chính bất ngờ, giải thích cơ chế "chết chùm" của hệ thống truy vết ngân hàng.
- **Cách làm với công cụ hiện có:** Nền security/incident, sơ đồ timeline 3 bước truy vết (Kẻ lừa đảo → Tài khoản bạn → Rút tiền), badge trạng thái `bad`, hiệu ứng dòng dữ liệu `leaking`.
- **Rủi ro thừa nhận:** Cơ chế truy vết ngân hàng dễ bị khô cứng nếu sơ đồ quá nhiều chữ; cần tinh giản tối đa thành các biểu tượng trực quan.

**Concept 3: "Cả nể 5 phút, trả giá nửa năm lương" (Góc độ Tâm lý văn phòng)**
- **Tín hiệu:** [google gợi ý] "có nên cho mượn số tài khoản ngân hàng không".
- **Hook (≤ 2s):** Lời đề nghị: "Cho mượn tài khoản 5 phút thôi, tao gửi cốc cà phê" → Cảnh báo pop-up: "Cốc cà phê giá 150 triệu!".
- **Nhịp:**
  - *0–3s:* Tình huống công sở điển hình: đồng nghiệp/bạn bè nhờ mượn tài khoản vì "tài khoản tao đang lỗi".
  - *3–15s:* Tình huống: Nể nang gật đầu, hôm sau nhận trát mời giải trình vì tài khoản nhận tiền lừa đảo.
  - *Kết (trả lời giây 54):* Cơ chế: Cho mượn tài khoản là vi phạm pháp luật (NĐ 340/2025/NĐ-CP phạt 100–150 triệu). Gợi ý cách từ chối thanh lịch ("Tài khoản công ty quản lý/đang khóa nhận tiền ngoài"). Kêu gọi nhẹ: "Bạn từng gặp lời nhờ này trên phở bò hay zép lào chưa?"
- **Vì sao giữ chân:** Đánh trúng căn bệnh "ngại từ chối người quen" của dân văn phòng và sinh viên; mang tính ứng dụng thực tế cao.
- **Cách làm với công cụ hiện có:** Bảng so sánh 2 cột "Cả nể vs Hậu quả", kinetic text nhấn từ khoá "TỪ CHỐI", Cáo dáng chào kết, hiệu ứng âm thanh cảnh báo tự tổng hợp.
- **Rủi ro thừa nhận:** Nghiêng về tình huống đời thường; nếu không ghim chặt con số phạt 100–150 triệu thì người xem dễ coi nhẹ là rủi ro xích mích cá nhân.

**Tóm tắt vòng 1 (đề xuất):** Cả ba giọng đều mở bằng lời nhờ của bạn thân và dùng dòng tiền làm cơ chế. Khác nhau ở góc: Claude A/Codex 1 theo "đường đi của tiền và cái tên trên giao dịch"; Claude B/Gemini 2 mở từ phía hậu quả (tiền lạ vào/tài khoản bị khoá); Codex 2 đưa hệ quả vào tiền của chính mình (tiền nhà bị chặn); Codex 3 bóc nhầm lẫn "một lần" với "một tài khoản"; Gemini 1 dựa vào chênh lệch 5 triệu và 150 triệu; Claude C/Gemini 3 thiên về cách từ chối.

## Vòng 1 — Phản biện chéo

### Codex phản biện concept của Claude — nguyên văn

Tôi chọn **“Khoản tiền lạ, tiền nhà đang chờ”** là concept mạnh nhất trong sáu. Lệnh trả tiền nhà bị chặn ở giây 4 biến nguy cơ phong toả thành hệ quả cụ thể với dân văn phòng và sinh viên. Bản dựng nên mở bằng lời nhờ của bạn thân, đánh dấu tình huống là ví dụ trong lời đọc và đến giây 10–12 giải thích rằng khoản nhận hộ có thể là tiền lừa đảo, khiến tài khoản có thể bị phong toả theo văn bản của cơ quan có thẩm quyền. Khi nêu mức 100–150 triệu, gắn rõ với hành vi cho mượn từ 1 đến dưới 10 tài khoản thanh toán. Tín hiệu [google gợi ý] “tài khoản ngân hàng bị phong toả” → “lý do”, “khi nào”.

| Concept Claude | Hook & giữ chân | Khớp brief | Khả thi | An toàn | Độc đáo |
|---|---:|---:|---:|---:|---:|
| A · Một lần thôi mà | 8 | 9 | 9 | 7 | 6 |
| B · Tài khoản của tôi, tiền của ai? | 6 | 5 | 9 | 6 | 7 |
| C · Ba câu hỏi trước khi gật đầu | 7 | 7 | 9 | 5 | 6 |

**A · Một lần thôi mà.** Sát brief nhất trong ba bản Claude. Hook nhồi cả tin nhắn dài lẫn thông báo khoá vào hai giây, còn câu “bạn chịu trách nhiệm” dễ bị hiểu là kết luận có lỗi. Dùng opening ba pha với Cáo và lời nhờ rút gọn ở giây 0–2, rồi hiện trạng thái “phong toả” ở giây 3–4. Trả lời nguyên nhân ở giây 12, chốt “Bạn có thể phải giải trình khoản tiền đi qua tài khoản đứng tên mình. Gặp lời nhờ này thì từ chối.” Tín hiệu [google gợi ý] “cho mượn tài khoản ngân hàng” → “bị phạt bao nhiêu”.

**B · Tài khoản của tôi, tiền của ai?** Mở bằng khoản tiền lạ khiến người xem dễ hiểu video nói về chuyển nhầm. Khi mức phạt xuất hiện sau đó, họ có thể tưởng chỉ cần nhận tiền lạ là bị phạt. Đưa lời nhờ lên giây 0–2, dùng thẻ giao dịch chung gắn tên Cáo, rồi giải thích ở giây 10–12 vì sao dòng tiền có thể dẫn tới phong toả. Bỏ nhánh tự chuyển trả để giữ một câu hỏi. Tín hiệu [ytb gợi ý] “tại sao tài khoản ngân hàng bị khoá” hỗ trợ nhánh phong toả.

**C · Ba câu hỏi trước khi gật đầu.** Câu kết ngầm cho phép gật đầu nếu bạn thân trả lời đủ ba câu. Giữ nhịp ba thẻ nhưng cho chúng lần theo cùng một giao dịch: tiền vào đâu, giao dịch gắn tên ai, ai có thể phải giải trình. Cho thấy hệ quả trước giây 5, giải thích ở giây 10 và chốt từ chối lời nhờ. Tín hiệu [google gợi ý] “cho mượn tài khoản ngân hàng” → “có sao không”.

### Claude (`ideator-a`) phản biện concept của Codex và Gemini — nguyên văn

**Codex 1 "Tên ai trên giao dịch?" — 7/10** (hook 7 · khớp 8 · khả thi 8 · an toàn 7 · độc đáo 6)
- Mạnh: bám đúng một cơ chế (tên đứng trên giao dịch → giải trình), tự gắn nhãn "nghi liên quan".
- Yếu: kết giây 54 "Có. Tài khoản đứng tên bạn có thể bị phong toả" quá muộn và chưa nêu mức phạt gắn với hành vi cho mượn. Nhãn "Ví dụ dựng" đốt lên hình vi phạm luật xưởng. Sửa: trả lời ở khoảng giây 12–15, đưa mức phạt vào đúng câu "cho mượn tài khoản", bỏ nhãn hình (khai ở `publish.json`).

**Codex 2 "Tiền nhà đang chờ" — 6/10** (hook 8 · khớp 6 · khả thi 7 · an toàn 5 · độc đáo 8)
- Mạnh: hệ quả gần người xem nhất (không trả được tiền nhà), khác biệt rõ.
- Yếu: hứa hẹn "phong toả toàn tài khoản" như hệ quả chung là khái quát. Brief chỉ cho nói phong toả theo văn bản cơ quan có thẩm quyền. Mạch "tua lại" làm câu trả lời bị trì hoãn tới giây 55, và mức phạt bị đẩy xuống cuối. Sửa: nói "có thể", nêu ngay ở giây ~10 phong toả theo văn bản; chốt mức phạt trước giây 40.

**Codex 3 "Một lần có tính không?" — 7/10** (hook 6 · khớp 9 · khả thi 8 · an toàn 9 · độc đáo 8)
- Mạnh: bắt đúng ngộ nhận "một lần", gắn phạt với hành vi cho mượn, an toàn nhất trong 9. Trả lời "một tài khoản đã nằm trong khung" chính xác với "từ 1 đến dưới 10".
- Yếu: hook là một câu thoại, hệ quả chưa hiện trước giây 5 và dễ thành bài pháp lý khô. Sửa: mở bằng thông báo khoá/tin nhắn nhờ rồi mới đặt "một lần" cạnh "một tài khoản"; chốt cơ chế dòng tiền để không lệch thành so sánh luật.

**Gemini 1 "Nhận hộ 5 triệu, phạt 150 triệu" — 4/10** (hook 8 · khớp 5 · khả thi 6 · an toàn 2 · độc đáo 5)
- Lỗi nghiêm trọng: badge "-150.000.000đ" đè lên số dư ngụ ý bị trừ tiền ngay. Thực tế là phạt hành chính theo quyết định xử phạt, không tự trừ. Tuyên bố "nhận hộ 5 triệu → phạt 150 triệu" cũng ngầm nói nhận tiền là bị phạt, ngược brief. Mức phạt là 100–150 triệu, không phải cố định 150. Lời kết "tiền từ nạn nhân lừa đảo" là khẳng định chắc.
- Sửa: bỏ số âm, dùng khung "mức phạt 100–150 triệu" gắn hành vi cho mượn; đổi thành "có thể là tiền lừa đảo"; bỏ đếm 0→150 triệu.

**Gemini 2 "Bẫy dòng tiền đen" — 4/10** (hook 6 · khớp 6 · khả thi 6 · an toàn 2 · độc đáo 5)
- Lỗi: "rửa tiền" (tội danh), "giữ sạch tiền", "phong toả toàn bộ chuỗi dòng tiền" và "Kẻ gian biến bạn thành trạm rửa tiền" là kết luận không có nguồn. Câu hỏi mở "bạn không hề lừa đảo ai" ngầm tuyên vô can. Mở bằng quét mã trả tiền ăn trưa thì chưa dính cơ chế "nhận hộ".
- Sửa: bỏ "rửa tiền", "giữ sạch", "không hề lừa đảo"; thay bằng "tiền có thể liên quan đến lừa đảo"; hook phải là lời nhờ.

**Gemini 3 "Cả nể 5 phút" — 4/10** (hook 6 · khớp 6 · khả thi 7 · an toàn 3 · độc đáo 6)
- Lỗi: "trát mời" là thuật ngữ sai và hứa hẹn thủ tục không có nguồn. Lời từ chối "tài khoản công ty quản lý/đang khoá" là lý do bịa, dạy người xem nói dối. "Cốc cà phê giá 150 triệu" đọc như nhận cà phê là bị phạt, và mức cố định 150 triệu là sai. Kêu gọi bình luận có tên nền tảng thật nằm ở dạng viết và đọc đúng luật 10, nhưng đừng bắt người xem kể "đã gặp" như dữ kiện.
- Giữ lại: ý "ngại từ chối" là góc tâm lý có giá trị. Sửa: dùng lời từ chối trung thực, kiểu "Mình không cho ai mượn tài khoản, luật cấm", và đổi "trát mời" thành "yêu cầu giải trình".

**Điểm chung cần xử lý:** Codex 1/2/3 đều đề nghị nhãn "Ví dụ dựng" trên hình, phải bỏ. Bên Codex trả lời đều ở giây 52–55, nên cần dời lên giây ~12–15 theo Y5. Cả ba concept của Gemini đưa "phạt 150 triệu" làm giá cố định, sai so với khoảng 100–150 triệu.

**Mạnh nhất trong 9 concept: Codex 3 "Một lần có tính không?"** với bản sửa như trên. Lý do: hook đánh thẳng vào câu người xem thật sự hỏi ("một lần có sao không", khớp tín hiệu "có bị phạt không"). Bóc đúng ngộ nhận bằng một khung so sánh dễ dựng. Mức phạt luôn gắn với hành vi cho mượn và an toàn nhất. Nó cũng khác biệt rõ với nhóm "đường đi của tiền".

Tôi gợi ý bản lai: dùng Codex 3 làm khung và hook, ghép đường đi của tiền (Claude A hoặc Codex 1) làm cơ chế ở đoạn giữa, giữ hệ quả "tài khoản có thể bị phong toả" ở giây ~12. Nếu phải chọn một concept nguyên bản, Codex 3 vẫn đứng đầu, concept A của tôi đứng thứ hai.

### Gemini phản biện concept của Claude và Codex — nguyên văn
(MÔ HÌNH DỰ PHÒNG: gemini-3.8-flash-high, như lượt đề xuất.)

#### Phản biện 3 concept của Claude

**Concept A — "Một lần thôi mà"**
- **Điểm: 8.2/10** *(Hook: 8 | Khớp brief: 9 | Khả thi: 9 | An toàn: 9 | Độc đáo: 6)*
- **Điểm yếu:** Hook chữ *"Tối đó, tài khoản của bạn bị khoá"* mang tính tự sự văn xuôi, thiếu xung đột thị giác trực diện trong 2 giây đầu; kịch bản tin nhắn nhờ vả + tài khoản bị khoá đã khá phổ biến.
- **Cách sửa:** Thay bằng pop-up đỏ thông báo *"Giao dịch lỗi: Tài khoản đang bị phong toả"* đè thẳng lên màn hình tin nhắn của bạn thân, đẩy câu hỏi mở vào đúng giây thứ 2.

**Concept B — "Tài khoản của tôi, tiền của ai?"**
- **Điểm: 6.4/10** *(Hook: 7 | Khớp brief: 5 | Khả thi: 8 | An toàn: 6 | Độc đáo: 6)*
- **Điểm yếu:** Lệch trọng tâm brief. Tình huống nhận tiền từ người lạ rồi người nhờ mới bảo *"tiền của tao"* biến câu chuyện thành "nhận tiền chuyển nhầm", làm mờ hành vi chủ động *cho bạn mượn tài khoản nhận hộ*. Chi tiết gợi ý *"tự chuyển trả lại"* dễ dẫn người xem vào bẫy rửa tiền khác hoặc sai quy trình.
- **Cách sửa:** Đưa về đúng tình huống cho mượn có chủ đích; cắt bỏ hoàn toàn việc "tự chuyển trả", chỉ giữ hướng dẫn liên hệ ngân hàng để tra soát.

**Concept C — "Ba câu hỏi trước khi gật đầu"**
- **Điểm: 7.4/10** *(Hook: 7 | Khớp brief: 8 | Khả thi: 8 | An toàn: 9 | Độc đáo: 5)*
- **Điểm yếu:** Cấu trúc 3 câu hỏi vi phạm yêu cầu "MỘT cơ chế chính", dễ biến video thành dạng mẹo vặt (listicle) phân tán, làm loãng phần phân tích cơ chế dòng tiền lừa đảo và trách nhiệm pháp lý.
- **Cách sửa:** Gom 3 câu lại thành 1 trục duy nhất: *"Tiền từ đâu vào và ai đứng tên chịu trách nhiệm?"*, dồn toàn bộ thời lượng minh hoạ dòng tiền truy vết.

#### Phản biện 3 concept của Codex

**1. "Tên ai trên giao dịch?"**
- **Điểm: 8.0/10** *(Hook: 7 | Khớp brief: 9 | Khả thi: 9 | An toàn: 8 | Độc đáo: 7)*
- **Điểm yếu:** Hook Cáo đứng cạnh bong bóng tin nhắn quá quen thuộc, thiếu tính đe dọa (stakes) tức thì để giữ tay người lướt ở 2 giây đầu.
- **Cách sửa:** Dùng chia đôi màn hình (split-screen): một bên là tin nhắn *"Nhận hộ 1 lần"*, bên kia là thông báo yêu cầu giải trình in đậm tên Cáo kèm dấu đỏ cảnh báo.

**2. "Khoản tiền lạ, tiền nhà đang chờ"**
- **Điểm: 8.8/10** *(Hook: 9 | Khớp brief: 9 | Khả thi: 8 | An toàn: 9 | Độc đáo: 9)*
- **Điểm yếu:** Đưa yếu tố "tiền nhà" vào rất đời thực nhưng nếu không kiểm soát nhịp sẽ dễ bị cuốn vào câu chuyện sinh hoạt cá nhân, thiếu thời gian cho khung phạt và cơ chế lừa đảo.
- **Cách sửa:** Gói gọn tình huống tiền nhà trong 0–3 giây đầu làm ngòi nổ xung đột (bấm chuyển tiền nhà bị chặn do tài khoản đóng băng), từ giây thứ 4 lập tức kéo sang cơ chế phong toả toàn tài khoản để giữ đúng trục kỹ thuật.

**3. "Một lần có tính không?"**
- **Điểm: 7.6/10** *(Hook: 7 | Khớp brief: 9 | Khả thi: 9 | An toàn: 9 | Độc đáo: 4)*
- **Điểm yếu:** Tập trung bóc tách ngữ nghĩa từ ngữ ("1 lần" vs "1 tài khoản") biến video thành bài giải thích luật khô cứng, thiếu sự rung động về mặt cảm xúc và hình ảnh.
- **Cách sửa:** Trực quan hoá bằng bàn cân đồ hoạ: bên trái là nhãn *"1 lần nể bạn"*, bên phải là mức phạt *"100–150 triệu"* nặng trĩu đè bẹp nhãn bên trái.

#### Concept mạnh nhất trong cả 9 concept

Concept mạnh nhất là **Codex 2 ("Khoản tiền lạ, tiền nhà đang chờ")** (kết hợp số liệu từ **Gemini 1**).

**Lý do:**
1. **Đánh trúng nỗi sợ lớn nhất (Stakes cao):** Đa số người xem lầm tưởng "chỉ bị giữ đúng số tiền nhận hộ". Chi tiết bị phong toả toàn bộ khiến tiền nhà, tiền ăn của chính mình bị kẹt là cú đấm thực tế, tạo mức giữ chân cao hơn hẳn các bài giảng luật hay tin nhắn thông thường.
2. **Khắc phục nhược điểm của các concept khác:** Claude A và Codex 1 quá an toàn; Claude B lệch brief; Claude C loãng cơ chế; Gemini 1 và Codex 3 quá nặng về phạt hành chính.
3. **Bản cải tiến đề xuất:** Lấy hook xung đột tiền nhà của Codex 2 (0–3s) → giải thích cơ chế dòng tiền đen khiến tài khoản bị phong toả (3–35s) → chốt hạ bằng mức phạt 100–150 triệu đồng theo Nghị định 340/2025/NĐ-CP (Điều 30 khoản 5a) kèm thông điệp từ chối dứt khoát.

**Tóm tắt vòng 1 (phản biện):** Codex và Gemini cùng chọn Codex 2 (tiền nhà bị chặn) là mạnh nhất; Claude chọn Codex 3 (một lần và một tài khoản), xếp Claude A thứ hai. Không ai chọn concept của Gemini; Claude chỉ ra lỗi an toàn ở cả ba bản Gemini ("-150 triệu" đè số dư, "rửa tiền", "trát mời", lời từ chối bịa). Điểm tranh chấp chính cho vòng 2: Codex 2 có khẳng định quá tay "phong toả toàn tài khoản" không (chưa có nguồn nói phạm vi phong toả), và câu trả lời phải dời lên giây 10–15.

## Vòng 2 — Đáp phản biện và bản cải tiến

### Giọng Claude (`ideator-a`) — nguyên văn

#### 1. Đáp từng điểm

**Codex về A.** Hook nhồi quá nhiều: **nhận**. Câu "bạn chịu trách nhiệm" dễ đọc thành kết tội: **nhận**, đổi thành "có thể phải giải trình". Dời câu trả lời lên giây ~12: **nhận**.

**Codex về B.** Mở bằng tiền lạ khiến người xem tưởng video nói về chuyển nhầm: **nhận**. Bỏ nhánh "tự chuyển trả": **nhận**, vì Gemini cũng nêu điểm này.

**Codex về C.** Câu kết ngầm cho phép gật đầu nếu trả lời đủ ba câu: **nhận**. C bị bỏ.

**Gemini về A.** Hook A quá tự sự: **nhận một phần**. Pop-up đỏ đè lên tin nhắn là cách dựng tốt, tôi dùng. Phần "A quá an toàn, nên không chọn" tôi **phản bác**: an toàn là tiêu chí của brief, không phải điểm trừ.

**Gemini về B.** Lệch brief và "tự chuyển trả" nguy hiểm: **nhận**.

**Gemini về C.** Listicle vi phạm "một cơ chế": **nhận**.

**Điểm tranh chấp: Codex 2 hay Codex 3.**
- Hook của Codex 2 (tiền nhà bị chặn) mạnh nhất thật. Tôi **nhận** điểm này và lai vào bản cuối.
- Gemini viết "phong toả toàn bộ chuỗi dòng tiền" và "phong toả toàn tài khoản" như điều chắc chắn. Tôi **phản bác**: chưa có nguồn nào nói vậy cho trường hợp cho mượn tài khoản.
- Tôi đã tra nhanh một lượt. Các bài tổng hợp, ví dụ Thanh tra (https://thanhtra.com.vn/kinh-te/tai-chinh-ngan-hang/cac-truong-hop-phong-toa-tai-khoan-thanh-toan-226974.html) và VOV (https://vov.vn/van-hoa/nhung-truong-hop-bi-cam-phong-toa-tai-khoan-khi-thanh-toan-khong-dung-tien-mat-post1184545.vov), nói phong toả tài khoản thanh toán có thể là một phần hoặc toàn bộ số dư.
- Các nguồn đó không nói rõ mức phong toả với tài khoản cho thuê hoặc cho mượn. Chúng mới chỉ là bài tổng hợp, chưa phải văn bản gốc Nghị định 52/2024/NĐ-CP hay Thông tư 17/2024/TT-NHNN.
- **Kết luận: chưa đủ dữ kiện để nói "toàn bộ".** Lời đọc chỉ được nói "có thể bị hạn chế giao dịch, mức hạn chế tuỳ văn bản của cơ quan có thẩm quyền". Kịch bản cần mở văn bản gốc trước khi chốt.

#### 2. Bản cải tiến cuối: "Một lần thôi mà" (khung Codex 3 + hook Codex 2 + dòng tiền của A)

**Hook (0–2s):** Tin nhắn dựng từ bạn thân: "Cho mượn tài khoản nhận hộ tiền một lần thôi". Ngay sau đó, nút "Chuyển tiền nhà" hiện pop-up đỏ chung chung "Giao dịch bị tạm dừng". Không tên ngân hàng và không đốt nhãn "ví dụ" lên hình. Việc khai báo dựng và AI nằm ở `publish.json`.

**Câu hỏi mở (trước giây 5):** "Chỉ nhận hộ một lần, vì sao giao dịch của chính mình lại có thể bị chặn?"

**Nhịp:**
- **0–5s:** lời nhờ, pop-up, câu hỏi mở.
- **5–12s (trả lời):** tiền nhận hộ có thể liên quan đến lừa đảo. Khi bị hại báo, cơ quan có thẩm quyền có thể ra văn bản phong toả. Chủ tài khoản thường không biết trước.
- **12–35s (cơ chế duy nhất, đường đi của tiền):** hình động bị hại → tài khoản đứng tên bạn → người nhờ. Tên bạn nằm trên giao dịch nên bạn có thể phải giải trình. Nhãn "nghi liên quan" giữ cho sơ đồ không đọc như kết luận điều tra.
- **35–48s:** khung `comparison`. Bên trái ghi "một lần", bên phải ghi "một tài khoản". Mức phạt 100–150 triệu gắn với hành vi cho mượn từ 1 đến dưới 10 tài khoản (NĐ 340/2025/NĐ-CP, Điều 30 khoản 5a). Chốt rõ: không có chuyện "một lần thì không tính".
- **48–60s:** câu chốt và kêu gọi nhẹ.

**Ví dụ dựng:** một khoản tiền vào, một người bị hại, tiền đi tiếp. Số liệu để trống hoặc ghi "ví dụ" trong lời đọc, không giả vụ thật.

**Sai lầm thường gặp:** "Một lần thôi", "bạn thân", "có tiền công", "chuyển đi là xong".

**Câu chốt:** "Tài khoản đứng tên bạn thì tên bạn nằm trên giao dịch. Mình không cho ai mượn tài khoản. Bạn từng nhận được lời nhờ này trên phở bò hay zép lào chưa?" Câu hỏi này không mời người xem tự thú.

**Hệ quả gần người xem:** hạn chế giao dịch nói chung, nhưng chỉ ở mức "có thể" và không nêu phạm vi. Ví dụ "tiền nhà không chuyển được" chỉ xuất hiện như minh hoạ ở giây 0–2 và 5–8, không khẳng định là hệ quả chắc chắn. Nếu văn bản gốc xác nhận phong toả toàn bộ thì nâng mức, nếu không thì giữ nguyên.

**Tín hiệu:**
- [google gợi ý] "cho mượn tài khoản ngân hàng" → *có bị phạt không*, *bị phạt bao nhiêu*.
- [google gợi ý] "tài khoản ngân hàng bị phong toả" → *khi nào*, *lý do*.
- Tin 29–30/10/2026 về hàng loạt tài khoản bị phong toả sau một giao dịch nhận tiền.

**Rủi ro còn lại:**
- Chưa xác nhận phạm vi phong toả, nên phải giữ "có thể".
- Pop-up "Giao dịch bị tạm dừng" ở giây 1–2 phải mang tính minh hoạ chung, không gắn nhãn phong toả toàn bộ.
- Mức phạt phải đứng cạnh hành vi "cho mượn", không đứng cạnh hành vi "nhận tiền".
- Người xem có thể hiểu nhầm là "nhận hộ tiền thì chắc chắn bị phạt". Câu chốt phải nói "có thể".

### Giọng Codex — nguyên văn

**Đáp phản biện**

- **Codex 1.** Nhận góp ý của Claude: trả lời ở giây 12, nói rõ khung phạt gắn với hành vi cho mượn tài khoản và đưa chữ “ví dụ” vào lời đọc. Nhận đề xuất chia đôi màn hình của Gemini: tin nhắn nhờ nhận hộ đặt cạnh yêu cầu giải trình mang tên Cáo cho thấy ngay hệ quả với người đứng tên.
- **Codex 2.** Nhận góp ý của Claude về phạm vi phong toả và nhịp tua lại. Giữ tiền nhà ở 0–3 giây như khoản Cáo sắp thanh toán, bỏ cảnh lệnh trả tiền bị chặn. Dữ kiện chỉ cho phép nói tài khoản *có thể bị phong toả theo văn bản của cơ quan có thẩm quyền*. Nhận góp ý của Gemini: từ giây 4 đi thẳng vào dòng tiền, trả lời ở giây 12 và nêu mức phạt ở giây 20.
- **Codex 3.** Nhận góp ý của Claude và Gemini rằng câu thoại đơn lẻ dễ thành bài luật khô. Cho hệ quả xuất hiện bằng hình trước giây 5. Bỏ bàn cân vì dễ khiến người xem hiểu một lần nhận hộ tự động bị phạt. Dùng “một lần” để dẫn vào ngộ nhận, rồi giải thích ngay trong cùng mạch dòng tiền rằng quy định đếm số tài khoản.

**Bản cải tiến cuối — Một lần nhận hộ, tên ai trên giao dịch?**

Giữ tiền nhà từ Codex 2 để người xem thấy tình huống gần mình, rồi đưa ngộ nhận của Codex 3 vào cùng mạch giải thích. Video hướng tới người từng được bạn bè nhờ dùng tài khoản để nhận tiền.

- **Hook ≤ 2 giây.** Cáo đang chuẩn bị trả tiền nhà thì bạn thân nhắn “Cho mượn tài khoản nhận hộ một lần?”. Lời đọc mở bằng “Ví dụ”.
- **Nhịp.** **0–3 giây:** Cáo chuẩn bị trả tiền nhà → tin nhắn hiện → cắt sang yêu cầu giải trình mang tên Cáo. **4–15 giây:** sơ đồ một khoản tiền vào tài khoản Cáo rồi được chuyển tiếp. **Giây 12 trả lời:** tiền nhận hộ có thể là tiền lừa đảo, người đứng tên có thể phải giải trình và tài khoản có thể bị phong toả theo văn bản của cơ quan có thẩm quyền. **Giây 20:** hành vi cho mượn từ 1 đến dưới 10 tài khoản thanh toán có khung phạt 100–150 triệu đồng. **Giây 48–52:** trở lại tin nhắn, Cáo chọn từ chối.
- **Cơ chế và sai lầm.** Tiền đã chuyển tiếp, giao dịch nhận tiền vẫn gắn với tài khoản đứng tên Cáo. “Một lần” là số lần nhận hộ. Khung phạt nêu trên tính theo số tài khoản cho mượn.
- **Câu chốt.** “Bạn cần nhận tiền thì dùng tài khoản của bạn nhé.” Mời nhẹ: “Bạn sẽ nhắn lại thế nào?”
- **Tín hiệu.** [google gợi ý] “cho mượn tài khoản ngân hàng” → “có bị phạt không”, “bị phạt bao nhiêu”.
- **Rủi ro còn lại.** Người xem có thể suy diễn rằng tiền nhà bị giữ. Chỉ hiện khoản sắp trả ở mở đầu và để thông báo giải trình làm hệ quả trực quan.

Dựng 9:16, 1080×1920, bằng chữ, sơ đồ và dáng Cáo tĩnh có sẵn, rộng 10–18% khi cùng minh hoạ. Cắt dáng ở mở, giữa và kết, dùng lời đọc rõ, khai báo AI trong `publish.json`.

### Giọng Gemini (vòng 2) — nguyên văn
(MÔ HÌNH DỰ PHÒNG: gemini-3.8-flash-high.)

#### 1. Dữ liệu web: Phong toả một phần hay toàn bộ?
Theo **Khoản 1 Điều 11 Nghị định 52/2024/NĐ-CP** (về thanh toán không dùng tiền mặt, nguồn: [chinhphu.vn](https://chinhphu.vn/default.aspx?pageid=27160&docid=210214)), tài khoản thanh toán bị **"phong tỏa một phần hoặc toàn bộ số dư"** khi có quyết định hoặc yêu cầu bằng văn bản của cơ quan có thẩm quyền.
Pháp luật không mặc định phong toả toàn bộ. Do đó, **Claude phản đối Codex 2 là hoàn toàn chính xác**: khẳng định "khoá sạch/toàn bộ tài khoản" là sai luật; chỉ được nêu "có thể bị phong toả một phần hoặc toàn bộ tài khoản".

#### 2. Trả lời phản biện của Claude
- **Gemini 1 (Nhận):** Nhận lỗi badge "-150 triệu" dễ gây hiểu lầm bị trừ tiền ngay và lỗi ấn định số 150 triệu. Tiếp thu: dùng khung phạt hành chính "100–150 triệu" theo NĐ 340/2025/NĐ-CP; dùng cụm "có thể là tiền lừa đảo".
- **Gemini 2 (Nhận & Bảo lưu góc tiếp cận):** Nhận lỗi dùng từ vượt brief ("rửa tiền", "giữ sạch tiền"). Tuy nhiên, xin bảo lưu xung đột đời sống (không chuyển được tiền sinh hoạt/tiền nhà) vì tạo stakes rất mạnh với người trẻ; sửa bằng cách gắn ngay tin nhắn nhờ mượn ở giây 1–2.
- **Gemini 3 (Nhận):** Nhận lỗi thuật ngữ "trát mời" (sửa: "yêu cầu giải trình") và lý do từ chối bịa đặt. Tiếp thu: giữ góc tâm lý cả nể nhưng hướng dẫn từ chối thẳng thắn dựa trên luật.

#### 3. Bản cải tiến: "Nhận hộ một lần, kẹt cả tiền nhà" (Bản lai Gemini 2 + Codex 2 + Codex 3)
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

### Tóm tắt vòng 2 và lý do dừng (ghi chú điều phối)
- **Đồng thuận sớm, không chạy thêm lượt phản biện bản cải tiến:** cả ba bản cải tiến đều là cùng một bản lai: mở bằng lời nhờ của bạn thân + khoản tiền nhà của Cáo (Codex 2), cơ chế là đường đi của tiền và cái tên đứng trên giao dịch (Claude A/Codex 1), bóc ngộ nhận "một lần" và "một tài khoản" (Codex 3), khung phạt 100–150 triệu gắn với hành vi cho mượn. Cả ba nhận rằng không được khẳng định phong toả toàn bộ.
- **Khác biệt còn lại để `ideator-b` phân xử:** (1) mức thể hiện hệ quả ở mở đầu (Claude: pop-up chung "Giao dịch bị tạm dừng"; Codex: chỉ hiện khoản sắp trả, hệ quả là "yêu cầu giải trình mang tên Cáo"; Gemini: app báo "tài khoản bị phong toả số dư"); (2) giây trả lời (Claude 5–12, Codex 12, Gemini 48); (3) vị trí khung phạt (Codex giây 20, Claude 35–48); (4) câu chốt/lời từ chối.
- **Dữ kiện mới cần Kịch bản tự mở kiểm:** khoản 1 Điều 11 Nghị định 52/2024/NĐ-CP (Gemini dẫn; Claude thấy hai bài tổng hợp Thanh tra, VOV nói cùng ý). Người điều phối chưa tự mở văn bản gốc.
- **Ghi chú trung thực:** mục tóm tắt này và bản Gemini vòng 2 được chép vào file SAU khi `ideator-b` đọc `debate.md` (lần ghi đầu bị lỗi); `ideator-b` đã đọc bản Gemini vòng 2 từ file trả lời trong `debate/` và tự suy ra các khác biệt, nên phán quyết dưới đây phân xử đủ các điểm trên dù đánh số khác.

## Phán quyết cuối

**Chọn: bản lai "Một lần nhận hộ, tên ai trên giao dịch?". Khung xương lấy từ bản cải tiến vòng 2 của Codex. Từ Claude lấy kỷ luật "có thể" và ý "một lần = số lần nhận, khung phạt = số tài khoản". Từ Gemini chỉ lấy dữ kiện Khoản 1 Điều 11 NĐ 52/2024 (phong toả một phần hoặc toàn bộ số dư). Không BẾ TẮC.**

**Lý do.** Bản Codex là bản duy nhất đạt cả ba điều: hệ quả hiện bằng hình trước giây 5, giải đáp ở giây 12, mức phạt ở giây 20. Nó cũng bỏ cảnh "lệnh trả tiền nhà bị chặn" mà vòng 1 đã bị bắt lỗi khái quát.
- **Bản Claude** giữ ý tốt, nhưng pop-up "Giao dịch bị tạm dừng" ở giây 1–2 vẫn ngầm khẳng định hệ quả. Mức phạt cũng bị đẩy tới giây 35–48. Câu chốt hỏi "bạn từng nhận lời nhờ này chưa" dễ thành mời tự thú.
- **Bản Gemini vòng 2** khẳng định ở giây 3–15 rằng "app báo tài khoản bị phong toả" như sự thật. Nó đẩy câu trả lời tới giây 48 và cho Cáo "bấm OK" lúc đầu. Câu từ chối mẫu "phạt từ 100 triệu đấy" thì dùng được.
- **Ý mạnh nhất từ cả ba giọng** là tiền nhà. Dùng làm bối cảnh mở, không làm hệ quả được khẳng định.

**Thước chấm (1–5):** Nhu cầu 5 (gợi ý google và ytb cùng tin 29–30/10) · Mới 4 (thư mục `content/` chưa có chủ đề trùng, tôi grep chỉ thấy file của T21) · Kiểm chứng 4 (văn bản gốc là PDF quét, còn phụ thuộc báo) · Minh hoạ 5 (một sơ đồ dòng tiền) · Hook 4 · An toàn 4. **Tổng 26/30.**

**Phân xử 4 khác biệt** (bản tóm tắt vòng 2 không có trong file, tôi suy ra từ ba bản cải tiến):
1. **Tiền nhà:** chỉ làm bối cảnh ở giây 0–3 (khoản sắp trả). Không cảnh giao dịch bị chặn, không nói tiền nhà bị giữ.
2. **Phạm vi phong toả:** chỉ nói "có thể bị phong toả theo văn bản của cơ quan có thẩm quyền". Không nói "toàn bộ", không nói "khoá sạch".
3. **Nhãn "Ví dụ dựng" trên hình:** bỏ. Chữ "ví dụ" nằm trong lời đọc, khai báo dựng và AI ở `publish.json`.
4. **Vị trí câu trả lời và mức phạt:** trả lời giây 12, mức phạt giây 20. Câu chốt dùng của Codex ("Bạn sẽ nhắn lại thế nào?"). Bỏ câu hỏi tự thú của Claude, bỏ bàn cân của Gemini.

**Hook.**
- **Giây 0–2:** Cáo cầm điện thoại, cạnh đó là lịch "tiền nhà". Tin nhắn bạn thân hiện lên: "Cho mượn tài khoản nhận hộ tiền một lần thôi?"
- **Giây 2–4:** cắt sang thẻ chung chung "Yêu cầu giải trình — người đứng tên: Cáo" (ví dụ dựng, không tên ngân hàng).
- **Câu hỏi mở trước giây 5:** "Nhận hộ một lần thôi, sao tên mình lại phải giải trình?"
- **Ích lợi đầu:** biết lý do và có sẵn câu từ chối, xuất hiện ở giây ~12.

**Vấn đề, đối tượng, thông điệp.** Dân văn phòng và sinh viên hay bị nhờ nhận hộ tiền. Tiền vào tài khoản đứng tên bạn có thể liên quan đến lừa đảo, nên người đứng tên có thể phải giải trình và tài khoản có thể bị phong toả. Thông điệp: không cho ai mượn tài khoản.

**Cấu trúc (60 s, 1 cơ chế).** Sự cố 0–5 → trả lời 12 → sơ đồ tiền vào, tiền đi tiếp, tên vẫn nằm trên giao dịch (nhãn "nghi liên quan", 12–30) → khung phạt giây 20 → "một lần" so với "một tài khoản" (30–45) → quay lại tin nhắn, từ chối (48–58). R15 (sáu câu hỏi): giữ "vì sao" và "làm gì". Bỏ phần lịch sử luật, vì một cơ chế là đủ.

**Bộ câu Cáo** (xưng "mình", câu ngắn; Kịch bản đối chiếu `docs/mascot.md`):
- "Bạn thân nhờ nhận hộ tiền. Một lần thôi mà?"
- "Tiền đó có thể liên quan lừa đảo."
- "Mình không cho ai mượn tài khoản. Luật cấm."
- "Cần nhận tiền thì dùng tài khoản của bạn nhé."
- "Bạn sẽ nhắn lại thế nào?"

**Ràng buộc cho Kịch bản.**
- **Không được khẳng định:**
  - "nhận hộ là chắc chắn bị phạt";
  - tiền nhà bị giữ;
  - phong toả toàn bộ;
  - chủ tài khoản đồng phạm hoặc vô can;
  - án tù, "Điều 291", rửa tiền, vụ cụ thể, tên ngân hàng;
  - lời từ chối bịa;
  - lời khuyên "tự chuyển trả".
- **Không dùng:** "trát mời", số âm trên số dư, "-150 triệu".
- **Mức phạt chỉ đứng cạnh hành vi "cho mượn"** từ 1 đến dưới 10 tài khoản, không đứng cạnh hành vi "nhận tiền".
- **Phải tự mở nguồn:**
  - **Điều 30 khoản 5a NĐ 340/2025.** Tôi tìm web thấy nhiều báo nêu trần 200–250 triệu cho nhóm khác, nên chỉ nói tầng "1 đến dưới 10 tài khoản, 100–150 triệu" sau khi đối chiếu văn bản gốc. Điều kiện kèm theo là hành vi chưa đủ truy cứu hình sự.
  - **Khoản 1 Điều 11 NĐ 52/2024.**
  - **Cách xử lý khi lỡ nhận tiền.** Hiện chỉ nên nói "liên hệ ngân hàng/cơ quan chức năng", chưa nêu thủ tục.
- **Tên nền tảng:** theo luật 10 nếu nhắc.

**Điều kiện thành công:** hệ quả hiện bằng hình trước giây 5, câu trả lời ở giây 12, và không có lời nào nói chắc điều chưa có nguồn.

**Bất đồng còn lại:** Gemini muốn nhấn cú sốc tiền nhà, Codex và Claude muốn chỉ làm bối cảnh. Tôi chọn phương án chỉ làm bối cảnh.
