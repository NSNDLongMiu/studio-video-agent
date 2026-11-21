# Tranh luận ý tưởng — Chủ đề #25 (Bóng Đá · Đội 1, đội #6)

**Chủ đề:** Khi kẻ vạch việt vị, tay và cánh tay của cầu thủ có được tính không?
**Video:** BONG-DA-T25-E01 (1 tập) · Số vòng tranh luận dự kiến: 2 · Ba giọng: Claude (`ideator-a`), Codex, Gemini; `ideator-b` chốt.

## Gói tín hiệu
Nguồn: `tools/signals/collect.mjs --dept bong-da`, 21/11/2026 (bản lưu `.local/signals/bong-da-2026-11-21-2983ff.md`). Dữ liệu ngoài, chỉ để tham khảo; đo mức quan tâm, không đo độ giữ chân.

- [gợi ý tìm kiếm google] **việt vị tay có tính không** → việt vị có tính tay không · việt vị có tính cánh tay không · luật việt vị có tính tay không · luật việt vị mới có tính tay không · tay có bị tính việt vị không
- [gợi ý tìm kiếm google] **luật việt vị** → luật việt vị mới · luật việt vị 2026 · luật việt vị hiện tại · luật việt vị tính như thế nào · luật việt vị là như nào · tại sao có luật việt vị · luật việt vị sân 7
- [gợi ý tìm kiếm google] **việt vị bán tự động** → việt vị bán tự động là gì · công nghệ bắt việt vị bán tự động (brief cấm khẳng định độ chính xác của công nghệ này)
- [gợi ý tìm kiếm ytb] **luật việt vị** → luật việt vị trong bóng đá · luật việt vị mới nhất · luật việt vị mới nhất của fifa · tại sao có luật việt vị
- [xu hướng hôm nay] đội tuyển bóng đá u-17 quốc gia new zealand (2000+ lượt; U17 Việt Nam đá U17 World Cup) — chỉ là bối cảnh người xem đang theo dõi bóng đá, không liên quan trực tiếp việt vị.
- Tin mới (RSS, Google News 2 ngày): không có tin nào về việt vị/tay/VAR.

Ghi chú điều phối: người tìm hay gõ kèm "mới", "2026"; brief cấm gọi đây là "luật mới 2026" và cấm nêu năm khi chưa đối chiếu văn bản.

## Vòng 1 — Đề xuất độc lập

### Giọng Claude (`ideator-a`) — nguyên văn

**Ghi chú chung:** Cả ba concept dựa trên một cơ chế: vạch việt vị chỉ xét phần thân được phép ghi bàn, gồm đầu, thân và chân. Tay và cánh tay không tính. Mốc cắt là đáy nách, nên vai vẫn tính. Câu "tay không tính" tôi chỉ đối chiếu theo trí nhớ về Luật 11 của IFAB, nên Kịch bản phải mở văn bản luật để xác nhận trước khi chốt. Không nêu năm, không nhắc công nghệ đo, không dùng clip hay ảnh cầu thủ. Mọi giờ, số lần và tên đội trong hook đều là ví dụ dựng.

**Concept 1 — "Cái vạch cắt ở nách"**
- **Hook (0–2 s):** Sơ đồ khối, tiền đạo ở sau vạch kẻ ngang, một cánh tay thò qua vạch. Chữ: "Bàn bị huỷ vì CÁI TAY?" Câu hỏi mở: việt vị hay không?
- **Nhịp:**
  - 0–3 s: ví dụ dựng "phút 87" khán đài cãi nhau. Hệ quả: bàn thắng bị gạt.
  - 3–5 s: nêu câu hỏi, hứa trả lời ở giây ~50.
  - 5–15 s: vạch chạy ngang, khối người tô hai màu, chỉ phần xanh được tính.
  - 15–50 s: ba tình huống cùng một vạch. Tay thò ra thì không tính. Vai thò ra thì tính. Chân thò ra thì tính.
  - 50–60 s: kết trả lời đúng câu hỏi mở đầu.
- **Vì sao giữ chân:** Có hệ quả gần người xem ngay giây 2. Có phép thử đoán "tính hay không" lặp ba lần. Người xem tự đoán rồi so với đáp án.
- **Cách làm:** Remotion, sơ đồ khối, vạch kẻ, tô màu, Cáo chỉ vào mốc nách. Không cần tài nguyên ngoài.
- **Chiều sâu R15:**
  - Tình huống: bàn bị huỷ vì tranh cãi.
  - Cơ chế: mốc đáy nách.
  - Ví dụ: ba tư thế.
  - Sai lầm thường gặp: "cứ thò ra là việt vị".
  - Bài học: nhìn mốc nách, đừng nhìn cả cánh tay.
- **Rủi ro:** Gần như đúng mẫu giám đốc gợi ý nên ít độc đáo. Ba tình huống lặp lại dễ đơn điệu.
- **Tín hiệu:** [gợi ý tìm kiếm google] "việt vị có tính cánh tay không", "việt vị tay có tính không".

**Concept 2 — "Phán quyết trọng tài ngồi nhà"**
- **Hook (0–2 s):** Hai khối người xem tranh cãi, bong bóng chat "Tay ra rồi, việt vị!" đối chọi "Tay không tính!". Một câu: "Ai nói đúng?"
- **Nhịp:**
  - 0–3 s: cãi nhau khi xem chiếu chậm.
  - 3–15 s: ghi nhận cả hai bên nghe có lý, rồi hỏi "tính thứ gì mới là quan trọng?".
  - 15–50 s: mỗi lần một bên "đưa bằng chứng". Cơ chế lộ dần: chỉ phần được phép ghi bàn. Chốt bằng việc kiểm "phần nào của cơ thể có thể dùng để ghi bàn hợp lệ". Quy tắc đáy nách xuất hiện như hệ quả của logic này.
  - Kết: trả lời bên đúng, kèm câu nhắc cho lần cãi sau.
- **Vì sao giữ chân:** Người xem muốn biết mình đúng hay sai. Xung đột giữa hai nhân vật chat tạo nhịp đổi cảnh tự nhiên.
- **Cách làm:** Khung chat vẽ bằng Remotion, hai nhân vật khối đơn sắc, sơ đồ vạch.
- **Chiều sâu R15:**
  - Tình huống: cãi nhau khi xem chiếu chậm.
  - Cơ chế: logic "phần được ghi bàn".
  - Ví dụ: tay thò và vai thò.
  - Sai lầm: nhầm với luật phạm lỗi chạm bóng bằng tay.
  - Bài học: hỏi "phần này có ghi bàn được không?".
- **Rủi ro:** Chữ nhiều, dễ vi phạm Y1. Phải để lời đọc làm chính, chữ chỉ nhấn. Nhắc "chạm bóng bằng tay" có thể làm loãng thông điệp.
- **Tín hiệu:** [gợi ý tìm kiếm ytb] "luật việt vị mới nhất". Hướng nội dung "tại sao có luật việt vị" cũng được dùng để mở logic.

**Concept 3 — "Một pixel của cái vai"**
- **Hook (0–2 s):** Cận cảnh sơ đồ khối. Chỉ một vùng vai nhô qua vạch, chữ: "Vai ra 1 cm: việt vị. Tay ra 1 m: không." Ví dụ dựng, không phải số đo thật.
- **Nhịp:**
  - 0–3 s: nghịch lý "vai 1 cm bị bắt, tay thò xa vẫn hợp lệ".
  - 3–15 s: hệ quả cho tiền đạo là một lần đứng lệch ranh giới.
  - 15–50 s: phóng to đường mốc nách. Thử nghiệm tư thế dang tay, giơ tay, cúi người. Sai lầm điển hình: giơ tay chỉ vị trí nhưng vai đang lọt vạch.
  - Kết: trả lời nghịch lý, nhấn mạnh phần thân phía trên đáy nách.
- **Vì sao giữ chân:** Nghịch lý gây tò mò. Có điểm gần gũi là người xem tự soi tư thế của mình.
- **Cách làm:** Remotion, zoom vào sơ đồ, đường kẻ phụ. Không dùng số đo thật.
- **Chiều sâu R15:**
  - Tình huống: tiền đạo đứng sát vạch.
  - Cơ chế: mốc nách.
  - Ví dụ: ba tư thế.
  - Sai lầm: nghĩ giơ tay thì tay được tính.
  - Bài học: phần thân phía trên đáy nách mới là mốc.
- **Rủi ro:** Nghịch lý "1 cm so với 1 m" là ví dụ dựng nên dễ bị hiểu thành số liệu thật. Phải ghi rõ là minh hoạ. Cần tránh nói thành "vai là ranh giới tuyệt đối", vì Kịch bản phải kiểm chi tiết văn bản luật về phạm vi vai.
- **Tín hiệu:** Không có tín hiệu trực tiếp. Chỉ gần với truy vấn "luật việt vị tính như thế nào". Ai đang tìm điều này thì chưa rõ.

**Nghiêng về:** Concept 1 an toàn nhất. Concept 2 có thêm xung đột nhưng cần kiểm soát chữ. Concept 3 độc đáo nhưng yếu tín hiệu.

### Giọng Codex
**Codex vắng ở lượt đề xuất vòng 1:** `codex-ideate.mjs` trả `BUSY` (đang có việc sản xuất chạy) cả hai lần thử ngày 21/11/2026. Không có concept của Codex ở vòng 1; tranh luận tiếp với các giọng còn lại.

### Giọng Gemini (`gemini-run.mjs ideate`, không báo mô hình dự phòng) — nguyên văn

#### Kiểm chứng nguồn trước khi đề xuất

**Luật 11 (Việt vị) — IFAB Laws of the Game**, nguyên văn tiếng Anh:

> *"The hands and arms of all players, including the goalkeepers, are not considered. For the purposes of determining offside, the upper boundary of the arm is in line with the bottom of the armpit."*

Nguồn: [theifab.com — Laws of the Game](https://www.theifab.com/laws/latest/offside/); xác nhận qua [thefa.com](https://www.thefa.com/football-rules-governance/lawsandrules/laws/football-11-11/law-11---offside).

**Logic cốt lõi:** Vạch việt vị chỉ xét phần cơ thể **được phép ghi bàn hợp lệ** (đầu, thân, chân); tay và cánh tay bị loại trừ. Mốc phân chia: **đáy nách** — từ đáy nách trở lên (vai) = tính, từ đáy nách trở xuống (cánh tay, bàn tay) = không tính. Quy định này **nhất quán với Luật 12 (Handball)**: phần cơ thể nào không được phép chạm bóng (tay/cánh tay) thì cũng không dùng để xét việt vị. Đây **không phải luật mới** — mốc "đáy nách" đã nằm trong Laws of the Game từ trước, không rõ năm khởi đầu chính xác nên không nêu năm.

#### Concept 1: "Cái Tay Oan"

**Hook (≤ 2 s):** Hình khối tiền đạo rướn người, cánh tay thò qua vạch ngang — chữ nhấn: *"Việt vị hay không?"* Cáo đứng bên cạnh, tay chỉ vào vạch (ví dụ dựng).

**Nhịp:**
- **0–3 s:** Mở thẳng vào tình huống: sơ đồ nhìn trên, tiền đạo có tay vượt vạch, hậu vệ áp chót phía sau. Lời: *"Tay tiền đạo thò qua vạch — việt vị?"*
- **3–15 s:** Phóng to hình khối cầu thủ, tô hai màu (xanh = tính, đỏ = không tính) với đường kẻ ngang mốc đáy nách. Giải thích cơ chế: luật chỉ xét phần cơ thể ghi bàn hợp lệ → tay không ghi bàn được → không xét. Nối sang Luật 12 (handball): cùng một logic — phần nào cấm chạm bóng thì cũng cấm tính việt vị.
- **15 s–kết (~55–60 s):** Ví dụ minh hoạ: tiền đạo rướn vai qua vạch (việt vị) vs. chỉ tay qua vạch (không việt vị). Sai lầm phổ biến: *"Nhiều người nghĩ cứ thò bất cứ gì qua vạch là việt vị."* Kết: Cáo quay lại — *"Vậy lần sau cãi nhau, nhớ: hỏi vai hay tay, không hỏi có qua vạch không. Bạn từng bị oan chưa? Gõ bình luận."*

**Vì sao giữ chân:** Stakes cao — mở bằng tình huống cụ thể người xem hay tranh cãi, đáp án đến sớm (giây 5–8) nhưng cơ chế "vì sao" kéo tiếp. Liên kết Luật 11↔12 là chiều sâu bất ngờ, ít video Việt giải thích.

**Cách làm:** Remotion vẽ sơ đồ hình khối từ trên + cắt ngang, tô màu hai vùng, vạch ngang chạy ngang; Cáo dáng tĩnh 3 lần; TTS + SFX còi. Không cần clip thật.

**Rủi ro:** Hơi "giáo khoa" nếu không giữ nhịp hình đổi nhanh; mốc đáy nách trừu tượng — cần hình cắt ngang rõ.

**Tín hiệu:** [gợi ý tìm kiếm] *"việt vị tay có tính không"*, *"luật việt vị có tính tay không"* — đúng câu hỏi hàng nghìn người đang gõ.

#### Concept 2: "Đường kẻ Vô hình"

**Hook (≤ 2 s):** Sơ đồ sân nhìn từ trên, vạch việt vị hiện lên — một phần cơ thể tiền đạo nằm sát vạch, Cáo xuất hiện góc dưới chỉ lên: *"Vạch kẻ ngang đây — nhưng kẻ ở đâu trên người?"* (ví dụ dựng).

**Nhịp:**
- **0–3 s:** Vạch ngang chạy qua, tiền đạo hình khối đứng sát vạch, zoom nhanh vào thân trên. Hệ quả rõ: *"Sai một phân — mất bàn thắng."*
- **3–15 s:** Hình cầu thủ cắt ngang (nhìn trước), vẽ đường ngang đáy nách. Trên = thân (tính), dưới = tay (bỏ). Cơ chế: *"Luật chỉ đếm phần ghi bàn được. Tay không ghi bàn → tay vô hình với vạch việt vị."*
- **15 s–kết:** So sánh hai tình huống song song: (A) vai qua → việt vị, (B) khuỷu tay qua → không việt vị. Sai lầm: *"Cánh tay duỗi thẳng trông rõ ràng vượt vạch, nhưng luật không thèm nhìn."* Kết: *"Lần tới xem chiếu chậm, đừng nhìn tay — nhìn vai. Bạn đã biết chưa? Chọn: Biết rồi / Hôm nay mới biết."*

**Vì sao giữ chân:** Mở bằng "mất bàn thắng" — hệ quả cảm xúc cao. Hình ảnh so sánh song song hai tình huống tạo khoảnh khắc "à-ha". Câu hỏi cuối nhẹ, mời tương tác.

**Cách làm:** Remotion: sân cỏ nhìn trên + hình khối cầu thủ, zoom + tô hai màu, chia đôi màn hình so sánh A/B. Cáo 3 dáng. TTS + SFX tiếng tách.

**Rủi ro:** Chia đôi màn hình ở 9:16 khá chật — cần thiết kế chồng dọc (A trên, B dưới) thay vì ngang.

**Tín hiệu:** [gợi ý tìm kiếm] *"luật việt vị tính như thế nào"*, *"việt vị có tính cánh tay không"* — tò mò cơ chế.

#### Concept 3: "Bản Đồ Cơ Thể Việt Vị"

**Hook (≤ 2 s):** Hình khối cầu thủ toàn thân, bất ngờ bị "tẩy" mất hai cánh tay — chỉ còn thân/đầu/chân. Lời: *"Với luật việt vị, cầu thủ chỉ có… bấy nhiêu."* (ví dụ dựng).

**Nhịp:**
- **0–3 s:** Hiệu ứng "biến mất tay" tạo bất ngờ thị giác. Cáo nghiêng đầu, kiểu "Đúng vậy đó." Hệ quả: *"Mất tay = mất tranh cãi."*
- **3–15 s:** Giải thích nhanh: vẽ lại hình đầy đủ, tô xanh phần tính (đầu, thân, chân), tô đỏ phần không tính (cánh tay từ đáy nách xuống). Vạch ngang đáy nách hiện rõ. Cơ chế: *"Phần nào ghi bàn được thì mới dùng xét việt vị. Tay không ghi bàn → tay không tồn tại trên vạch."*
- **15 s–kết:** Tình huống ví dụ: tiền đạo giơ tay ăn mừng sớm, tay vượt vạch nhưng vai chưa qua → không việt vị. Sai lầm: *"Mấy ông bình luận cứ la 'tay nó qua rồi' — nhưng luật không quan tâm tay."* Liên kết: cùng logic Luật 12 — tay chạm bóng = phạm lỗi, tay qua vạch = bỏ qua, nhất quán. Kết: Cáo giơ tay ra ngoài khung hình — *"Tay này không tính. Bạn nhớ chưa? Comment cho Cáo biết!"*

**Vì sao giữ chân:** Hook thị giác mạnh (tẩy mất tay), gây tò mò ngay; "bản đồ cơ thể" là khung hình đơn giản nhưng trực quan, dễ nhớ. Liên kết 11↔12 thêm chiều sâu.

**Cách làm:** Remotion: hình khối cầu thủ, hiệu ứng fade-out hai tay (opacity 1→0), tô lại hai màu, vạch ngang. Cáo 3 dáng. TTS + SFX. Có thể dùng 1 ảnh AI nền sân cỏ.

**Rủi ro:** Hiệu ứng "tẩy tay" nếu quá nhanh sẽ khó nhận ra trên điện thoại nhỏ — cần giữ ≥ 0,8 s và có chữ nhấn kèm.

**Tín hiệu:** [gợi ý tìm kiếm] *"việt vị tay có tính không"*, *"luật việt vị là như nào"* — đúng thắc mắc gốc + mở rộng sang hiểu tổng thể.

**Tóm tắt vòng 1 — đề xuất (điều phối):** Claude và Gemini mỗi bên 3 concept, cùng xoay quanh một cơ chế (chỉ xét phần ghi bàn được, mốc đáy nách); khác nhau ở hook (bàn bị huỷ / hai người cãi / nghịch lý vai-tay / tẩy mất tay) và ở việc Gemini nối sang Luật 12. Gemini trích nguyên văn Luật 11 kèm URL (Kịch bản vẫn phải tự mở nguồn). Codex vắng (BUSY).

## Vòng 1 — Phản biện chéo

**Codex vắng ở lượt phản biện vòng 1:** thử lần thứ ba trước lượt này vẫn `BUSY` (việc sản xuất đang chạy). Không có phản biện của Codex.

### Giọng Claude (`ideator-a`) phản biện concept của Gemini — nguyên văn

#### 1. Chấm concept của Gemini

**Kiểm chứng.**
- Luật 11 đã mở được tại [theifab.com/laws/latest/offside](https://www.theifab.com/laws/latest/offside/). Câu "hands and arms ... are not considered" và câu "upper boundary of the arm is in line with the bottom of the armpit" đều có đúng nguyên văn. Phần xét vị trí việt vị ghi "head, body or feet".
- Luật 12 chưa mở được bản gốc (URL handball trả 404). Qua tìm kiếm thì tài liệu IFAB ghi mốc đáy nách cũng dùng cho tay chạm bóng, vai không phải cánh tay. Theo tài liệu thay đổi luật 2021/22, mốc này được đưa vào việt vị từ mùa đó ([bản tổng hợp tìm được](https://downloads.theifab.com/downloads/changes-to-the-laws-of-the-game-2021-22-pdf?l=de)). Trạng thái: hai luật cùng mốc, **chưa kiểm bản gốc Luật 12**.
- Gemini viết "mốc đáy nách đã nằm trong luật từ trước". Câu đó đúng với việt vị theo hướng dẫn của giám đốc, nhưng dòng chữ tường minh trong Luật 11 có thể mới hơn. Kịch bản không nên nói năm hay nói "luật cũ".

**(a) Nối sang Luật 12.**
- Vi phạm "chỉ một cơ chế" của brief: có. Nhắc Luật 12 như một câu đối chiếu thì còn chấp nhận. Gemini lại dành nhịp riêng và dùng nó làm "chiều sâu bất ngờ" (Concept 1 và 3), nên vượt phạm vi.
- Về luật: khung "phần nào cấm chạm bóng thì cũng cấm tính việt vị" là **sai logic**. Thủ môn được dùng tay trong vòng cấm mà tay vẫn bị loại khỏi việt vị. Việt vị loại tay của mọi cầu thủ, kể cả thủ môn. Luật 11 cũng không nói lý do là "tay không ghi bàn được". Đó là cách giải thích của giám đốc. Văn bản chỉ nêu đầu, thân, chân. Nếu giữ câu "chỉ phần ghi bàn", Kịch bản phải ghi là cách nhớ, không phải lời luật.
- Cách sửa: tối đa một câu "mốc đáy nách cũng được dùng ở luật chạm bóng bằng tay" (sau khi kiểm bản gốc), không dựng cơ chế thứ hai và không nói "cùng logic".

**(b) Các câu cụ thể.**
- "Hàng nghìn người đang gõ": **bịa số**. Gói tín hiệu chỉ có gợi ý tìm kiếm, không có lượt tìm. Cách sửa: bỏ câu này, chỉ ghi loại tín hiệu.
- "Mất tay = mất tranh cãi": vui nhưng mơ hồ. "Mất" dễ bị hiểu thành bàn bị mất.
- Hook tẩy mất tay: ổn về luật vì tay bị loại, nhưng có hai lỗi.
  - Hook nói cầu thủ chỉ còn "bấy nhiêu" mà không có tình huống hay hệ quả gần người xem, nên lệch Y5.
  - Tẩy cả bàn tay sai với brief, vì vai vẫn tính. Hình tẩy phải dừng đúng ở đáy nách.
- "Tay không tồn tại trên vạch" là nói quá. Hãy nói "luật không xét tay".

**(c) Lời kêu gọi cuối.**
- "Gõ bình luận / Chọn: Biết rồi" là kêu gọi hành động chung chung, không cần thiết và dễ vi phạm chính sách kênh.
- Cách sửa: kết bằng câu trả lời cho câu hỏi mở và một câu nhớ ("hỏi vai hay tay"). Câu này đáng giữ.

**(d) "Từ đáy nách trở lên (vai) = tính".**
- Gần đúng nhưng diễn đạt chưa chuẩn. Luật nói cánh tay kết thúc ở đáy nách, còn vai thuộc thân nên tính.
- Khẳng định vai tính suy ra từ "head, body or feet", nên Kịch bản cần nói "vai thuộc thân, nên tính". Phần "từ đáy nách trở xuống = không tính" thì đúng.
- Nên nhắc rõ "đáy nách" không phải "đường tay áo". Đây là sai lầm thường gặp đáng khai thác.

**Điểm số (hook / khớp / khả thi / an toàn / độc đáo).**
- **Cái Tay Oan: 6 / 6 / 8 / 4 / 5.**
  - Hook giống mẫu của giám đốc nên an toàn mà ít mới.
  - Điểm yếu là Luật 12 sai logic và có hô hào "gõ bình luận".
  - Sửa: bỏ Luật 12 và bỏ lời kêu gọi.
- **Đường kẻ Vô hình: 7 / 8 / 8 / 7 / 7.**
  - Câu hỏi "kẻ ở đâu trên người" đúng trọng tâm. Hai tình huống A/B trên-dưới, vai so với khuỷu, rất rõ. Không dính Luật 12.
  - Điểm yếu là "sai một phân — mất bàn thắng" là hệ quả chung chung, thiếu cảnh người xem. Còn "Biết rồi / Hôm nay mới biết" là lời kêu gọi.
  - Sửa: thêm tình huống cãi nhau trong 2 giây đầu và đổi kết thành lời trả lời.
- **Bản Đồ Cơ Thể Việt Vị: 6 / 6 / 7 / 5 / 8.**
  - Hình tẩy tay là hook thị giác độc nhất của cả bộ.
  - Điểm yếu là Luật 12 và câu "tay không tồn tại".
  - Sửa: dùng hình tẩy như phép màu sau câu hỏi, ở giây 6–9, không làm hook.

#### 2. Tự nhìn lại concept của mình

- Giữ Concept 1 (bàn bị huỷ + phép thử ba tư thế) làm khung chính.
- Mượn từ Gemini hình cắt ngang với đường đáy nách, và hình "tẩy tay" dừng đúng ở nách.
- Bỏ Concept 3 của tôi vì tín hiệu yếu. Bỏ Concept 2 vì dễ nhiều chữ và chạm "chạm bóng bằng tay".

**Bản lai, tên tạm: "Bàn bị huỷ vì cái tay".**
- **Hook (0–2 s):** sơ đồ khối, tiền đạo sau vạch, một cánh tay thò qua. Lời: "Bàn thắng bị gạt vì cái tay này? Ví dụ dựng." Chữ tối đa 3 từ.
- **Nhịp:**
  - 2–5 s: bàn bị gạt, hai người cãi nhau. Câu hỏi mở: "Việt vị thật không?"
  - Giây ~8: tẩy tay để lộ phần luật thật sự xét, kèm đường đáy nách.
  - 8–18 s: tình huống A, tay thò qua và không tính.
  - 18–32 s: tình huống B, vai thò qua và tính.
  - 32–48 s: tình huống C, tay giơ cao nhưng vai chưa qua, nhắc "đáy nách chứ không phải đường tay áo". Đây là sai lầm thường gặp.
  - 48–58 s: **trả lời ở giây ~50**, vạch xét đầu, thân, chân, còn tay và cánh tay từ đáy nách xuống thì không. Lời nhớ: "nhìn vai, đừng nhìn tay".
- **Tín hiệu:** [gợi ý tìm kiếm google] "việt vị có tính cánh tay không", "việt vị tay có tính không".
- **Rủi ro:** nội dung vẫn hơi giáo khoa. Cần đổi hình mỗi 3–4 giây và để chữ chỉ nhấn từ khoá. Kịch bản phải mở bản gốc Luật 11 và 12 trước khi chốt. Không nêu năm.

**Ghi chú điều phối:** lời kêu gọi cuối nhẹ (mời gõ/chọn đáp án) được kỷ luật của vị trí cho phép; nhận xét (c) của Claude là ý kiến về mức cần thiết, không phải vi phạm luật kênh. `ideator-b` tự cân.

### Giọng Gemini phản biện concept của Claude — nguyên văn
*(Lượt này chạy bằng MÔ HÌNH DỰ PHÒNG `gemini-3.8-flash-high`: `gemini-run.mjs` báo claude-opus-4-6-thinking hết hạn mức, hồi khoảng 21:14 ngày 21/11/2026. Giọng độc lập với Claude hơn, lập luận có thể nông hơn.)*

#### 1. Concept 1 — "Cái vạch cắt ở nách"
- **Chấm điểm:**
  - Hook & giữ chân: **7/10** (Tình huống thực tế nhưng hứa hẹn "giây ~50 mới trả lời" là trì hoãn thụ động, dễ rớt view sớm trên tóp tóp).
  - Khớp chủ đề/brief: **9/10** (Bám đúng cơ chế mốc đáy nách và câu hỏi trọng tâm).
  - Khả thi sản xuất: **9/10** (Sơ đồ khối và vạch kẻ dựng bằng Remotion rất nhẹ tải, an toàn).
  - An toàn: **9/10** (Minh bạch ví dụ dựng, không dính logo/cầu thủ thật).
  - Độc đáo: **6/10** (Mô-típ quá quen thuộc, bám sát nguyên văn gợi ý của brief nên thiếu đột phá).
- **Điểm yếu cụ thể:** Nhịp 3–5 giây câu giờ hứa hẹn đáp án vi phạm kỷ luật giữ chân bằng giá trị sớm; 3 tình huống kiểm tra lặp lại cùng một vạch ở thân bài dễ gây nhàm chán từ giây 25.
- **Cách sửa:** Bỏ lời hứa hẹn giây 50; đưa ngay quy tắc vàng trước giây 10: *"Chỉ phần cơ thể được phép ghi bàn mới tính việt vị (theo Luật 11 IFAB)"*. Biến 3 tình huống thành thử thách nhanh 3 giây/tình huống, hiện ngay nhãn "ĐÚNG / SAI" để khán giả tự đối chiếu tức thì.

#### 2. Concept 2 — "Phán quyết trọng tài ngồi nhà"
- **Chấm điểm:**
  - Hook & giữ chân: **6/10** (Bong bóng chat tĩnh ở 2 giây đầu thiếu chuyển động thị giác; khán giả lướt nhanh khó đọc kịp chữ).
  - Khớp chủ đề/brief: **7/10** (Bị loãng khi lôi thêm luật "chạm bóng bằng tay" vào phân tích).
  - Khả thi sản xuất: **6/10** (Dạng hội thoại chat nhiều chữ, nguy cơ phạm quy tắc R3: chữ khoá > 3 từ, vượt quá 3 nhóm chữ trên khung 360×640).
  - An toàn: **8/10** (Dễ gây nhầm lẫn chuyên môn giữa vị trí việt vị (Luật 11) và lỗi chạm tay (Luật 12)).
  - Độc đáo: **7/10** (Góc nhìn khai thác tâm lý tranh cãi của người xem khá chân thực).
- **Điểm yếu cụ thể:** Thiết kế quá nặng về chữ (text-heavy), đi ngược tiêu chí visual-first; đưa luật chạm tay vào giải thích làm rối vấn đề chính là mốc nách.
- **Cách sửa:** Bỏ khung chat; thay bằng 2 mô hình Cáo đối lập biểu cảm (một bên quả quyết, một bên nghi ngờ); gạt bỏ hoàn toàn nhánh "chạm bóng bằng tay", tập trung duy nhất vào nguyên lý: *"Phần cơ thể nào được phép đưa bóng vào lưới hợp lệ?"*.

#### 3. Concept 3 — "Một pixel của cái vai"
- **Chấm điểm:**
  - Hook & giữ chân: **8/10** (Nghịch lý hình ảnh kích thích tò mò cực mạnh ngay giây đầu).
  - Khớp chủ đề/brief: **8/10** (Làm bật rõ sự tương phản giữa cánh tay và khớp vai).
  - Khả thi sản xuất: **8/10** (Zoom cận cảnh chi tiết vai/nách rất hợp với chuyển động camera của Remotion).
  - An toàn: **7/10** (Cách ví von "1 cm / 1 m" dù ghi ví dụ dựng vẫn dễ kích động tranh cãi ngoài lề về độ chính xác của vạch kẻ).
  - Độc đáo: **8/10** (Khai thác góc nhìn hình học/giải phẫu học sắc nét).
- **Điểm yếu cụ thể:** **Ai đang tìm điều này?** Concept ghi nhận không có tín hiệu tìm kiếm trực tiếp; người xem tìm "việt vị tay có tính không" chứ không ai tìm kiếm độ lệch 1 cm của vai. Số đo phóng đại dễ bị bắt bẻ là ngụy tạo số liệu.
- **Cách sửa:** Kéo về đúng nhu cầu bằng tín hiệu tìm kiếm `[gợi ý tìm kiếm google] việt vị có tính cánh tay không`; thay số đo "1 cm / 1 m" bằng thế đối lập hành động: *"Vươn cả sải tay xin bóng: KHÔNG VIỆT VỊ — Chỉ rướn chỏm vai: VIỆT VỊ"*. Kẻ đường gióng ngang đáy nách rõ ràng theo chuẩn văn bản IFAB để minh định.

#### Đánh giá lựa chọn (trong 6 concept)

**Bản lai mạnh nhất: Kết hợp Hook của "Một pixel của cái vai" (Claude) + Thị giác của "Bản Đồ Cơ Thể Việt Vị" (Gemini).**

**Lý do:** Hook nghịch lý tương phản của Claude (sải tay vươn dài hợp lệ nhưng chỏm vai nhô ra là việt vị) giữ chân cực tốt trong 2 giây đầu mà không cần câu giờ. Khi vào thân bài, dùng giải pháp "Bản đồ cơ thể" của Gemini (tô màu xanh phần ghi bàn hợp lệ, màu xám phần cánh tay bị loại trừ từ đáy nách) giúp giải thích cơ chế Luật 11 IFAB trực quan, dễ hiểu trong 60 giây, vừa trúng tín hiệu tìm kiếm vừa tối ưu năng lực dựng hình khối Remotion.

**Tóm tắt vòng 1 — phản biện (điều phối):** Hai bên đều bỏ nhánh Luật 12 và khung chat nhiều chữ; cùng muốn hình "bản đồ cơ thể" tô hai vùng với đường đáy nách. Còn bất đồng ở hook: Claude giữ "bàn bị gạt vì cái tay" (trúng tín hiệu tìm kiếm, đáp án ~giây 50) còn Gemini chọn nghịch lý "sải tay hợp lệ, chỏm vai việt vị" và đòi đưa quy tắc trước giây 10. Claude chỉ ra khung "cấm chạm bóng thì cấm tính việt vị" sai logic (thủ môn) và "tay không ghi bàn" là cách nhớ, không phải lời luật. Codex vắng.

## Vòng 2 — Đáp phê bình và bản cải tiến

**Codex vắng ở vòng 2:** lượt phản biện vòng 2 (`debate/codex-round2-phan-bien.prompt.md`) trả `BUSY` (việc sản xuất đang chạy) ngày 21/11/2026, lần vắng thứ tư trong việc này. Ý tưởng chốt không có giọng Codex.

### Giọng Claude (`ideator-a`) — nguyên văn

#### 1. Đáp phê bình của Gemini về concept của tôi

- **"Hứa đáp án ở giây ~50 là trì hoãn thụ động": NHẬN một nửa.**
  - Tôi nhận lỗi chỗ này: lời hứa suông ở 3–5 s chỉ câu giờ, không đem lại gì cho người xem.
  - Tôi phản bác phần còn lại: nếu đưa toàn bộ đáp án trước giây 10 thì thân bài chỉ còn là giáo khoa.
  - Cách xử lý là chia đôi. Ích lợi sớm (giây 8–10) là một quy tắc dùng được ngay: "tay thì bỏ, vai thì tính". Đáp án đầy đủ (giây ~52) là phán quyết cho tình huống ở hook cộng với mốc đáy nách. Giữa hai mốc người xem luôn có việc để làm: tự đoán rồi đối chiếu.
- **"Quy tắc 'chỉ phần được phép ghi bàn' trước giây 10": NHẬN, kèm sửa chữ.**
  - Không dẫn "theo Luật 11" như thể đó là lời luật. Luật 11 chỉ nêu đầu, thân, chân.
  - "Phần ghi bàn được" chỉ là cách nhớ, nên viết "cách nhớ", không viết "luật ghi".
- **"Ba tình huống lặp, nhàm từ giây 25": NHẬN.**
  - Tôi đổi thành thử thách nhanh, mỗi tình huống khoảng 6–8 s.
  - Mỗi tình huống đổi cách nhìn: nhìn trên xuống, rồi nhìn ngang, rồi nhìn cắt ngang.
  - Nhãn ĐÚNG/SAI là kết quả của lần đoán, không phải thông tin thêm.
- **"Thử thách nhanh ĐÚNG/SAI": NHẬN.** Nhãn chỉ là một chữ, nên không phạm Y1.
- **Hook nghịch lý "sải tay: không việt vị — chỏm vai: việt vị": NHẬN một phần.**
  - Tôi dùng làm câu hỏi chốt ở giây 5, không làm hook. Hook cần nhân vật và hệ quả gần người xem.
  - Hook vẫn phải giữ "bàn bị gạt" vì tín hiệu tìm kiếm là câu hỏi về cái tay.

#### 2. Bản cải tiến cuối: "Bàn bị gạt vì cái tay?"

- **Hook (0–2 s):** sơ đồ khối nhìn từ trên, tiền đạo ở sau vạch, một cánh tay thò qua vạch. Còn lại là phần ở bên kia. Hai khối người xem cãi nhau, bàn thắng bị gạt. Lời: "Bàn bị gạt, vì cái tay này?" Chữ tối đa 3 từ. Ví dụ dựng, ghi rõ là minh hoạ.
- **Nhịp:**
  - 2–5 s: hai bên cãi nhau trước màn hình. Hệ quả gần người xem: cuộc cãi nhau khi xem chiếu chậm. Câu hỏi mở: "Việt vị thật không?"
  - 5–10 s: tẩy hai tay, dừng đúng đáy nách. **Ích lợi sớm ở giây ~8:** "Tay bỏ đi, vai thì giữ lại." Có thêm cách nhớ "chỉ đếm phần ghi bàn được".
  - 10–18 s: cơ chế bằng bản đồ cơ thể, tô xanh đầu/thân/chân và xám hai tay. Đường gióng ngang đáy nách, hình cắt ngang.
  - 18–44 s: ba thử thách, mỗi cái ~8 s, người xem đoán rồi nhãn ĐÚNG/SAI hiện ra.
    - A: tay thò xa → không việt vị.
    - B: chỏm vai nhô → việt vị.
    - C: tay giơ cao, vai chưa qua → không việt vị. Sai lầm: nhìn đường tay áo thay vì đáy nách.
  - 44–52 s: sai lầm thường gặp "cứ thò ra là việt vị", và vai thuộc thân nên tính.
  - **52–60 s: trả lời đầy đủ:** tay và cánh tay (từ đáy nách xuống) không tính; vai tính. Quay về cảnh hook: tay thò ra không làm tiền đạo việt vị.
  - Câu chốt: "Cãi nhau lần sau: hỏi vai hay tay, đừng hỏi có qua vạch không."
- **Một cơ chế:** vạch xét đầu, thân, chân; mốc cắt là đáy nách. Không Luật 12, không nói "cùng logic", không năm hay "luật mới", không nói độ chính xác của công nghệ.
- **Tín hiệu:** [gợi ý tìm kiếm google] "việt vị có tính cánh tay không", "việt vị tay có tính không".
- **Rủi ro:** vẫn hơi giáo khoa, nên cảnh phải đổi mỗi 3–4 s. Kịch bản phải mở bản gốc Luật 11 trước khi chốt. Không clip, ảnh cầu thủ hay logo.

#### 3. Phản biện ngắn hướng lai của Gemini

- **Điểm yếu 1:** hướng lai lấy hook nghịch lý làm hook, nên không có tình huống hay hệ quả gần người xem trước giây 5 (lệch Y5).
  - Sửa: để nghịch lý ở giây 5, sau hook "bàn bị gạt".
- **Điểm yếu 2:** hướng lai bỏ qua rằng "chỉ phần được phép ghi bàn" không phải lời luật.
  - Sửa: đặt nhãn "cách nhớ" cho câu đó.

### Giọng Gemini (`gemini-run.mjs ideate`, không báo mô hình dự phòng) — nguyên văn
*(Gemini nhận bản tóm tắt phê bình của Claude ở vòng 1 và bản lai vòng 1 của Claude; chưa thấy bản cải tiến vòng 2 của Claude ở trên vì hai lượt chạy song song.)*

#### 1. Trả lời Claude phê bình các concept Vòng 1 của Gemini

- **Về điểm (a) — Dẫn Luật 12 và quy tắc ghi bàn:**
  - **Nhận:** Đồng ý bỏ việc đối chiếu Luật 12 thành một cơ chế độc lập để tuyệt đối tuân thủ yêu cầu "chỉ một cơ chế" trong brief. Việc lập luận "cấm chạm thì cấm việt vị" cũng sơ hở vì thủ môn dùng tay trong vòng cấm nhưng tay vẫn không bị tính việt vị.
  - **Làm rõ căn cứ luật:** Việc gắn vạch việt vị với "bộ phận được phép ghi bàn" là cách diễn giải trực quan chuẩn xác theo tinh thần của IFAB. Theo điều 11.1 của [IFAB Law 11 - Offside](https://www.theifab.com/laws/latest/offside/), tay và cánh tay của mọi cầu thủ (kể cả thủ môn) đều bị loại bỏ khi xét việt vị; vạch chỉ xét đầu, thân mình và bàn chân (*"head, body or feet"*). Ranh giới trên của cánh tay được chốt giải phẫu đúng bằng đáy nách (*"the upper boundary of the arm is in line with the bottom of the armpit"*). Ta giữ một cơ chế duy nhất này.

- **Về điểm (b) — Số liệu tìm kiếm và visual tẩy tay:**
  - **Nhận:** Nhận khuyết điểm đã dùng cụm từ "hàng nghìn người đang gõ" khi gói tín hiệu chỉ cung cấp từ khóa gợi ý chứ không có số liệu lượt tìm. Nhận điểm visual tẩy cả cánh tay dễ gây hiểu nhầm tẩy mất cả vai.
  - **Phản bác:** Thủ pháp visual "làm mờ/tách phần dưới đáy nách" là ngôn ngữ hình ảnh đắt giá nhất trên video dọc (tóp tóp, ytb, phở bò) để người xem hiểu ngay luật "bỏ qua" phần nào. Chỉ cần neo hình này vào tình huống tranh cãi cụ thể (bàn thắng bị từ chối) thay vì để đứng hình trừu tượng.

- **Về điểm (c) & (d) — Lời kêu gọi và ranh giới giải phẫu:**
  - **Nhận:** Tiếp thu toàn bộ. Sửa lời kêu gọi thành tương tác trắc nghiệm tình huống gắn với câu nhớ; chuẩn hóa cách gọi giải phẫu: cánh tay kết thúc ở đáy nách, vai thuộc thân mình nên được tính; đưa "đáy nách chứ không phải mép tay áo" vào làm sai lầm kinh điển.

#### 2. Phản biện "bản lai của Claude"

Bản lai của Claude đã bám sát brief, nhưng còn **2 điểm yếu chí mạng về nhịp giữ chân video ngắn**:

1. **Trì hoãn đáp án quá lâu (giây ~50 mới trả lời chốt):**
   - *Điểm yếu:* Video 60 giây mà để người xem thụ động chờ đến giây 50 mới biết nguyên tắc cốt lõi sẽ khiến tỷ lệ rớt (drop-off) ở giây 15–20 tăng vọt.
   - *Cách sửa:* Bật mí nguyên tắc nền tảng (vạch không xét tay, mốc đáy nách) ngay trước giây 10. Sau đó, biến các tình huống (A, B) thành thử thách đối chiếu để người xem vận dụng nguyên tắc và tự thấy "bẫy thị giác", thay vì bắt họ chờ giải mã ở cuối.

2. **Dàn trải 3 tình huống (A, B, C) gây loãng thời lượng:**
   - *Điểm yếu:* Tình huống C (tay giơ cao, vai chưa qua) thực chất trùng lặp bản chất với tình huống A (tay qua vạch, vai ở sau). Dồn cả 3 tình huống vào 40 giây thân bài sẽ khiến mỗi cảnh chỉ lướt qua được 10 giây, không đủ sâu để giải thích sơ đồ khối.
   - *Cách sửa:* Gom lại thành đúng **1 cặp nghịch lý đối lập mạnh nhất**: *Vươn cả cánh tay qua vạch → Không việt vị* đối đầu với *Chỉ rướn chỏm vai 2 cm → Việt vị*. Dành thời lượng còn lại phân tích bẫy mép tay áo.

#### 3. Bản cải tiến cuối cùng: "Vạch Việt Vị: Nhìn Vai Hay Nhìn Tay?"

- **Tín hiệu trích dẫn:** Trích từ [gợi ý tìm kiếm google]: *"việt vị tay có tính không"* và *"việt vị có tính cánh tay không"*.
- **Hook (0–2 s):** Sơ đồ khối 3D phẳng (ví dụ dựng). Tiền đạo vươn hẳn cả cánh tay qua người hậu vệ cuối cùng, chân vẫn ở sau. Lời hook (dưới 2 giây): *"Vươn cả sải tay qua vạch: có việt vị không?"*. Chữ nhấn trên màn hình (3 từ): **TAY QUA VẠCH?**
- **Nhịp video (tổng 58 giây, chuẩn 9:16):**
  - **0–3 s (Opening pha 1 & 2):** Trọng tài phất cờ gạt bàn thắng, hai cầu thủ cãi cọ nảy lửa. Cáo văn phòng ôm đầu hoang mang.
  - **3–10 s (Opening pha 3 & Trao nguyên lý sớm):** Hiện câu hỏi mở: *"Bàn thắng bị từ chối oan hay đúng luật?"*. Ngay giây 7, một vệt cắt ngang đỏ chạy qua nách cầu thủ: phần cánh tay từ đáy nách trở xuống lập tức chuyển xám trong suốt. Lời dẫn: Luật 11 quy định vạch chỉ xét phần cơ thể được phép ghi bàn (đầu, thân, chân). Cánh tay hoàn toàn vô hình với vạch kẻ!
  - **10–30 s (Cặp nghịch lý thị giác):**
    - *Ví dụ 1 (10–20 s):* Tiền đạo vươn cả cánh tay 50 cm qua vạch, nhưng vai ở sau → **KHÔNG VIỆT VỊ** (cánh tay dù dài bao nhiêu cũng không bị tính).
    - *Ví dụ 2 (20–30 s):* Tiền đạo khép tay sát sườn, nhưng chỉ rướn chỏm vai qua vạch 2 cm → **VIỆT VỊ** (vai thuộc thân mình, được phép ghi bàn nên bị tính vạch).
  - **30–45 s (Sai lầm thường gặp — Bẫy mép tay áo):** Phóng to vùng vai-nách. Sai lầm phổ biến khi người xem cãi nhau: nhìn mép tay áo đấu. Chỉ rõ: áo cộc hay áo dài tay là do trang phục; mốc tính của trọng tài và công nghệ bắt buộc là **đáy nách giải phẫu**, không phải đường chỉ may áo.
  - **45–58 s (Chốt câu hỏi mở & Kết):** Trả lời dứt điểm ở **giây 48**: Trong tình huống mở đầu, nếu chỉ có cánh tay thò qua, bàn thắng hoàn toàn hợp lệ!
    - *Câu nhớ đời:* **"Bắt việt vị: nhìn vai, đừng nhìn tay!"**
    - *Kêu gọi tương tác:* Cáo giơ bảng biểu quyết: *"Bạn từng cãi thắng hay thua quả việt vị kiểu này? Thả bình luận bên dưới."*
- **Một cơ chế chính:** Vạch việt vị chỉ áp dụng cho bộ phận cơ thể hợp lệ để ghi bàn (đầu, thân, chân); cánh tay được tính từ ranh giới đáy nách trở xuống và hoàn toàn không bị xét vị trí việt vị (theo IFAB Law 11).
- **Ví dụ cụ thể:** Đối chiếu trực diện giữa tình huống sải cả cánh tay qua vạch (hợp lệ) và rướn chỏm vai 2 cm qua vạch (việt vị).
- **Sai lầm thường gặp:** Căn vạch theo mép ống tay áo thay vì ranh giới giải phẫu đáy nách.
- **Câu chốt:** *"Bắt việt vị: nhìn vai, đừng nhìn tay!"*
- **Rủi ro thừa nhận:** Người xem thực tế khi xem truyền hình phát lại góc chéo vẫn khó tự xác định đáy nách nếu cầu thủ mặc áo rộng hoặc vung tay che khuất thân; video cần nhấn mạnh đây là nguyên lý dựng chuẩn để người xem hiểu bản chất chiếu chậm chứ không thay thế hoàn toàn máy đo đa góc của trọng tài.

**Ghi chú điều phối (kiểm nhanh trước khi chốt, không phải phán quyết):** bản Gemini vẫn còn (1) câu "Luật 11 quy định vạch chỉ xét phần cơ thể được phép ghi bàn" — lời luật chỉ nêu "head, body or feet", "phần ghi bàn được" là cách nhớ; (2) số "50 cm", "2 cm" là ví dụ dựng, phải ghi rõ hoặc bỏ số; (3) "mốc tính của trọng tài và công nghệ" chạm vùng brief cấm (không nói về công nghệ đo); (4) "cầu thủ cãi cọ" + "trọng tài phất cờ" cần là hình khối, không người thật. Codex vắng cả hai vòng.

**Tóm tắt vòng 2 (điều phối):** Hai giọng hội tụ: hook là tình huống tay thò qua vạch + bàn bị gạt, ích lợi sớm trước giây 10 (tẩy/xám cánh tay từ đáy nách), "đáy nách chứ không phải mép tay áo" là sai lầm thường gặp, câu nhớ "nhìn vai, đừng nhìn tay". Còn khác: Claude giữ ba thử thách ĐÚNG/SAI (A tay, B vai, C tay giơ cao) và trả lời đầy đủ ở giây ~52; Gemini gom thành một cặp nghịch lý (tay xa / chỏm vai) và dành 15 s cho bẫy mép tay áo, trả lời ở giây 48, giữ lời mời bình luận. Đồng thuận đủ để chốt sau vòng 2.

## Phán quyết cuối
*(`ideator-b`, 21/11/2026)*

**Chọn: bản lai, lấy khung của Claude (vòng 2) cộng hai thứ của Gemini.** Tên tạm: "Bàn bị gạt vì cái tay?". Codex vắng cả hai vòng nên không có ý kiến của Codex để cân. Đây **không** phải bế tắc. Các điểm Gemini đúng thì lấy theo Gemini.

**Kiểm nguồn (tôi tự mở):** Luật 11 IFAB tại theifab.com/laws/latest/offside có đúng ba câu sau.
- "The hands and arms of all players, including the goalkeepers, are not considered."
- "the upper boundary of the arm is in line with the bottom of the armpit."
- Phần xét vị trí là "head, body or feet".

Câu "chỉ phần được phép ghi bàn" **không có** trong luật, chỉ là cách nhớ. Luật 12 tôi chưa mở được bản gốc nên bỏ hẳn.

**Lý do chọn khung Claude.** Hook "bàn bị gạt, vì cái tay này?" có hệ quả gần người xem trước giây 5 (Y5), và trúng đúng câu người ta gõ ("việt vị có tính cánh tay không"). Hook nghịch lý của Gemini ("vươn sải tay: không việt vị") không có hệ quả cho người xem nên tôi dời thành câu hỏi ở giây 5.

**Lấy của Gemini:**
- Đưa ích lợi sớm lên trước giây 10.
- Biến ba thử thách thành thử thách nhanh có nhãn ĐÚNG/SAI.
- Gom thành hai ví dụ chính (tay xa: không việt vị; vai nhô: việt vị) và dành nhịp dài cho bẫy "đáy nách chứ không phải mép tay áo".

**Bác của Gemini:** cảnh trọng tài hay cầu thủ cãi nhau cụ thể, câu "Luật 11 quy định phần được ghi bàn", nhắc "công nghệ", số "50 cm / 2 cm" không ghi là ví dụ dựng.

**Chấm Thước (1–5):**

| Tiêu chí | Điểm | Ghi chú |
|---|---|---|
| Nhu cầu thật | 3 | Có gợi ý tìm kiếm google về việt vị tay/cánh tay, chưa có tín hiệu độc lập thứ hai |
| Mới | 4 | Chưa thấy trùng cơ chế |
| Kiểm chứng | 5 | Nguyên văn Luật 11 mở được |
| Minh hoạ | 5 | Sơ đồ khối, tô màu, đường đáy nách |
| Hook (WOW + cãi) | 4 | WOW: tay thò xa mà không việt vị, vai nhô vài phân thì việt vị. Cãi: hai phe "tay ra rồi" và "tay không tính" |
| An toàn | 4 | Còn rủi ro nếu lỡ nhắc công nghệ hoặc năm |

**Tổng: 25/30.**

**Hook (2 giây đầu).** Sơ đồ khối nhìn từ trên: tiền đạo ở sau vạch, một cánh tay thò qua vạch, bàn bị gạt. Lời: "Bàn bị gạt, vì cái tay này?" Chữ tối đa 3 từ. Đây là ví dụ dựng.

**Cấu trúc:**
- 1 tập, mục tiêu ≈ 60 s, trong 45–75 s. Ước 12 cảnh trở xuống. Không câu chào, mở bằng opening ba pha (R26).
- **Ích lợi đầu tiên ở giây ~8:** "tay bỏ, vai giữ". Hình tẩy hai tay phải **dừng đúng đáy nách**.
- **Câu hỏi mở "việt vị thật không?" trả ở giây ~50.**
- Cơ chế chính: một, là vạch xét đầu, thân, chân; mốc cắt là đáy nách.
- Ví dụ: hai thử thách (tay xa, chỏm vai).
- Sai lầm thường gặp: đáy nách, không phải mép tay áo.
- **R15:** bỏ phần so sánh với khái niệm khác vì brief chỉ cho một cơ chế.

**Cáo, câu thoại:** Cáo chỉ vào mốc nách. Chốt: "Cãi nhau lần sau: hỏi vai hay tay, đừng hỏi có qua vạch không." Câu nhớ: "Nhìn vai, đừng nhìn tay."

**Kịch bản bắt buộc tuân:**
- Tách rõ lời luật ("đầu, thân, chân; tay và cánh tay không xét; đáy nách") và cách nhớ ("phần ghi bàn được", ghi nhãn "cách nhớ").
- Nói "vai thuộc thân nên tính".
- Không năm, không "luật mới", không công nghệ hay độ chính xác đo.
- Mọi số đo là ví dụ dựng (hoặc bỏ số).
- Chỉ hình khối, không người thật, clip hay logo.
- Không nhắc Luật 12.
- Không bịa lượt tìm.
- Chữ chỉ nhấn từ khoá (Y1).
- Không kêu gọi bình luận chung chung. Chỉ giữ câu chốt trả lời.
- Đổi hình mỗi 3–4 s để tránh giáo khoa.

**Điều kiện thành công:** hình đáy nách đọc rõ trên điện thoại nhỏ (giữ hình tẩy ≥ 0,8 s).

**Điểm bất đồng còn lại:** số thử thách (Claude 3, Gemini 2). Tôi chốt 2 cộng bẫy mép tay áo. Hình tẩy tay giữ làm khoảnh khắc giây ~8, không làm hook.

Đối tượng: người xem bóng đá phổ thông hay cãi khi xem chiếu chậm. Thông điệp: tay không tính, vai tính, mốc là đáy nách.

