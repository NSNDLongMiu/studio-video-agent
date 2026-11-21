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

