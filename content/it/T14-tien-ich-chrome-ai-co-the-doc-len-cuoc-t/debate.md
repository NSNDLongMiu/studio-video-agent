# Tranh luận ý tưởng — Chủ đề #14 (IT-T14-E01)

**Chủ đề:** Tiện ích Chrome "AI" có thể đọc lén cuộc trò chuyện của bạn với chatbot (bản T8 cập nhật theo chuẩn giải thích sâu)
**Đội:** IT · team_id 5 · 1 tập · số vòng tranh luận: 2
**Hai giọng:** Claude (`ideator-a`) và Codex (`codex-ideate.mjs`). Người điều phối chuyển lời, không sửa nội dung.

---

## Vòng 1 — Đề xuất độc lập

### Claude (ideator-a) — vòng 1

# T14: đề xuất vòng 1 của Claude (IT-T14-E01)

Mọi giờ, số lần và tên trong hook chỉ là ví dụ dựng, không phải người hay sự kiện thật.

Đối chiếu dữ kiện theo brief: tháng 1/2026 có báo cáo về tiện ích giả danh trợ lý AI với hàng trăm nghìn người cài. Tiện ích gửi nội dung chat và địa chỉ trang về máy chủ lạ khoảng 30 phút một lần. Có bản mang huy hiệu "Featured". Nguồn: OX Security, The Hacker News, TechRepublic, hướng dẫn Chrome Web Store. Quy mô chỉ nói "hàng trăm nghìn người". Không nêu tên thương hiệu bị giả mạo.

Tỉ lệ nhịp áp cho cả ba concept, quy ra giây ở mức ≈180 s: opening 2 s, hook 14 s, bối cảnh 27 s, cơ chế 45 s, phân tích sâu và ví dụ 54 s, giải pháp 25 s, outro 11 s.

## Concept A: "Chìa khoá vạn năng"
**Góc kể:** ẩn dụ chiếc chìa khoá toà nhà, giải thích quyền "đọc và thay đổi dữ liệu trên mọi trang".

- **Opening (2 s):** chữ tiêu đề "CHÌA KHOÁ VẠN NĂNG?" nảy lên, kèm âm "ting". Header nhỏ: SECURITY / TRÌNH DUYỆT.
- **Hook (≤14 s):** Cáo bấm "Thêm vào Chrome" cho trợ lý AI miễn phí. Chat vừa dán bảng giá khách hàng thì có dòng "đã gửi" ở góc. Câu hỏi mở: "Chat của tôi đi đâu?". Câu trả lời đến ở khoảng 160 s, ở phần kết.
- **Bối cảnh:** vì sao ai cũng cài tiện ích AI, và tình huống dựng công việc của Cáo. Ghi chú "báo cáo 1/2026, hàng trăm nghìn người".
- **Cơ chế:** hộp thoại quyền hiện ra → trang chat là HTML → tiện ích có quyền "mọi trang" thì đọc được chữ trên trang → chạy nền theo chu kỳ.
- **Phân tích sâu:** ví dụ dựng "bảng giá + mật khẩu thử nghiệm" bị gom thành gói gửi đi. Sai lầm thường gặp là tin huy hiệu "Featured" hay số sao. Gỡ tiện ích không xoá dữ liệu đã gửi.
- **Giải pháp:** kiểm nhà phát hành, kiểm quyền ở trang quản lý tiện ích, gỡ cái không dùng, không dán dữ liệu nhạy cảm.
- **R15 đủ 6 câu:** vấn đề, vì sao quan trọng, cơ chế, ví dụ, hậu quả/sai lầm, giải pháp.
- **Bối cảnh hình:** văn phòng → cửa sổ trình duyệt dựng → sơ đồ toà nhà với chìa khoá → bảng quyền.
- **Cáo:** đầu, kết và hai nhịp chuyển ý, cỡ 10–18% khung.
- **Giữ chân:** ẩn dụ dễ hiểu, mỗi cảnh một ý, sơ đồ dựng theo lời.
- **Cách làm:** component sơ đồ và text engine có sẵn, giao diện trình duyệt dựng bằng hình học (không dùng ảnh chụp thật).
- **Rủi ro:** ẩn dụ "chìa khoá" có thể làm người xem tưởng mọi tiện ích đều xấu. Cần một câu nói rõ phần lớn tiện ích vẫn hợp lệ.

## Concept B: "Điều tra 30 phút"
**Góc kể:** điều tra lần ngược. Cáo phát hiện dấu vết lạ rồi lần theo.

- **Opening (2 s):** "30 PHÚT / 1 LẦN" kèm đồng hồ đếm, đổi mốc.
- **Hook:** Cáo thấy bảng thống kê mạng có một yêu cầu gửi đi đều đặn dù mình không bấm gì. Hậu quả cần nêu trước giây 5. Câu hỏi: "Ai đang gửi, và gửi gì?". Câu trả lời ở khoảng 120–150 s.
- **Bối cảnh:** chat với AI chứa dữ liệu thật, ví dụ mô tả công việc, mã nguồn, thông tin khách.
- **Cơ chế:** trục thời gian các lần gửi nền. Hai thứ được gom là nội dung chat và địa chỉ trang đang mở.
- **Phân tích sâu:**
  - Ba manh mối để nghi ngờ: quyền quá rộng, nhà phát hành lạ hoặc mới, và đánh giá/huy hiệu không khớp với tính năng.
  - Hậu quả: dữ liệu đã ra ngoài thì khó thu hồi.
  - Chỉ dùng dữ liệu thử giả, không hướng dẫn cách viết tiện ích độc.
- **Giải pháp:** kiểm quyền, gỡ, đổi thói quen dán dữ liệu.
- **R15:** đủ 6 câu.
- **Bối cảnh hình:** bàn làm việc → màn hình bảng mạng dựng (stylized) → trục thời gian → bảng quyền.
- **Cáo:** thám tử nhỏ ở đầu, kết và các nhịp chuyển ý.
- **Giữ chân:** có bí ẩn và cảm giác điều tra, chu kỳ đếm giờ là thứ nhìn thấy được.
- **Cách làm:** đồng hồ, timeline và sơ đồ bằng component có sẵn.
- **Rủi ro:** dễ trượt sang giống hướng dẫn pháp y quá kỹ thuật. Phải giữ ngôn ngữ phổ thông và không trình bày như cách tấn công.

## Concept C: "Hai chiếc Cáo"
**Góc kể:** hai nhánh song song cho cùng một tình huống, mô phỏng hậu quả của hai lựa chọn.

- **Opening (2 s):** "CÁI NÀO AN TOÀN?" chia đôi màn hình.
- **Hook:** hai Cáo cùng thấy một tiện ích AI miễn phí. Cáo A bấm cài ngay. Cáo B dừng lại kiểm. Câu hỏi: "Khác nhau chỗ nào?". Câu trả lời ở khoảng 100 s, rồi nhắc lại ở kết.
- **Bối cảnh:** vì sao lời mời cài trông giống hệt nhau, dù tiện ích đó là thật hay giả.
- **Cơ chế:** nhánh A hiện đường đi của dữ liệu. Nhánh B hiện cách đọc danh sách quyền.
- **Phân tích sâu:** so sánh bảng quyền của hai tiện ích dựng. Các sai lầm thường gặp là tin số sao, tin huy hiệu, cài khi vội. Hậu quả của nhánh A (dữ liệu thử đã gửi) và vì sao gỡ rồi vẫn không thu hồi được.
- **Giải pháp:** ba việc làm được ngay, và Cáo B làm gì ở từng bước.
- **R15:** đủ 6 câu.
- **Bối cảnh hình:** màn hình chia đôi, mỗi nhánh một tông màu, rồi gộp lại ở kết.
- **Cáo:** hai Cáo chỉ ở đầu, kết và chuyển ý, không chiếm quá 18% khung.
- **Giữ chân:** so sánh trực quan, người xem tự đoán trước khi lời giải.
- **Cách làm:** layout chia đôi và bảng so sánh có sẵn. Cần kiểm tra component có hỗ trợ hai Cáo cùng khung không.
- **Rủi ro:** màn hình chia đôi làm chữ nhỏ trên 9:16. Cần giới hạn một ý mỗi nửa. Hai Cáo cũng có thể vượt giới hạn "vài nhịp".

## Nghiêng về
Nghiêng nhẹ về A. Ẩn dụ đơn giản nhất cho người xem phổ thông, và cơ chế "đủ để thấy chat" có hình rõ nhất. Nếu cần hook mạnh hơn thì lai A với đồng hồ 30 phút của B.

### Codex — vòng 1

**Vòng 1 — Ba concept độc lập**

Dành cho dân văn phòng Việt Nam dùng chatbot hằng ngày. Quyền truy cập trang có thể cho tiện ích thấy nội dung chat công việc. Cả ba mở bằng tiêu đề động 2 giây và cảnh Cáo gặp sự cố, dùng giao diện giả lập. Lời kể nói rõ “ví dụ dựng”, mô tả đăng khai báo AI.

#### 1. Gỡ rồi, bản sao còn đâu?

- **Hook ≤2s** Cáo bấm Gỡ, phiếu khách hàng vẫn hiện ở máy chủ ngoài. “Gỡ rồi, sao vẫn còn?”
- **Nhịp** 0–3s mở ở hậu quả. 3–15s tua về lúc Cáo cài trợ lý miễn phí và dán phiếu vào chat. Trước giây 5, thấy phiếu đã ra ngoài trình duyệt. Phần giữa dựng từng bước quyền đọc trang → nội dung bị sao chép → gửi theo đợt, liên hệ báo cáo ghi nhận khoảng 30 phút mỗi đợt. Giây 158 chốt việc gỡ dừng các lần gửi sau, bản đã gửi có thể còn.
- **Giữ chân** Cú bấm Gỡ đặt ngay câu hỏi người xem có thể gặp. **Dựng** UiSimulationScene + DataVizScene, giữ phiếu xuyên suốt. **Rủi ro** Cảnh máy chủ dễ gợi dữ liệu còn mãi, lời kể nêu thời gian lưu chưa rõ.

#### 2. Một quyền, ba phạm vi

- **Hook ≤2s** Cáo dán báo giá. “Sao tiện ích thấy cả báo giá?”
- **Nhịp** 0–3s thấy khung chat. 3–15s lộ quyền “trên mọi trang”, bản sao báo giá đi ra ngoài trước giây 5. Phần giữa diễn lại cùng một thao tác qua ba cài đặt: khi nhấp, trang cụ thể, mọi trang. Giây 155 chỉ chỗ kiểm quyền và chốt cách giới hạn quyền theo nhu cầu.
- **Giữ chân** Người xem đoán lựa chọn nào cho tiện ích thấy tab chat rồi xem kết quả. **Dựng** UiSimulationScene + ExplainerScene. **Rủi ro** Dễ hiểu nhầm “khi nhấp” luôn an toàn, minh họa lúc Cáo nhấp ngay trên tab chat.

#### 3. Qua mặt Cáo bằng huy hiệu

- **Hook ≤2s** Cáo cài trợ lý có huy hiệu. “Bản nháp vừa đi đâu?”
- **Nhịp** 0–3s cắt từ nút Cài sang bản nháp. 3–15s lần lại quyết định cài, trước giây 5 thấy bản sao đến máy chủ ngoài. Phần giữa đặt cạnh huy hiệu, nhà phát hành và quyền truy cập. Báo cáo ghi nhận một tiện ích có huy hiệu Featured. Giây 160 chốt hai mục cần kiểm trước khi cài: nhà phát hành và danh sách quyền.
- **Giữ chân** Người xem tự xét lại lựa chọn cài khi thấy quyền hiện ra. **Dựng** PromptReviewScene + DataVizScene. **Rủi ro** Dễ quy chụp huy hiệu, giới hạn kết luận vào quyền của tiện ích.

**Kết chung** Kiểm nhà phát hành và quyền, gỡ tiện ích bỏ dùng, tránh dán mật khẩu, khóa truy cập hay dữ liệu khách hàng. “Bạn sẽ kiểm quyền nào trước?”

**Dựng chung** 180s, 9:16, 1080×1920, header “SECURITY / TRÌNH DUYỆT”. VieNeu nhanh hơn T8 10–15%, hiệu ứng nhẹ, không nhạc. Cáo tĩnh 10–18%, cắt dáng khi chuyển ý. Mỗi cảnh một ý, tối đa hai khái niệm mỗi 10s, giữ sơ đồ hoàn chỉnh 2–3s.

**Tóm tắt vòng 1 (điều phối):** Claude đưa ẩn dụ "Chìa khoá vạn năng", điều tra "30 phút" và chia đôi "Hai chiếc Cáo", nghiêng A. Codex đưa "Gỡ rồi, bản sao còn đâu?" (mở ở hậu quả), "Một quyền, ba phạm vi" (so 3 cài đặt quyền) và "Qua mặt bằng huy hiệu". Hai bên đều giữ một sự cố dựng xuyên suốt; khác nhau ở trục giải thích (ẩn dụ vs. thao tác thật trên cài đặt quyền).

## Vòng 1 — Phản biện chéo

### Claude (ideator-a) phản biện Codex — vòng 1

Chung: ba concept mở bằng hình và câu hỏi rõ, nhưng phần giữa mỏng. Chưa thấy ngân sách thời lượng cho từng đoạn. Chưa thấy cách lấp đủ 150–190 s với "mỗi cảnh một ý". Cáo 10–18% là hợp lệ. Hook nào cũng cần ghi rõ "ví dụ dựng". Tôi chưa kiểm lại nguồn báo cáo 1/2026 ngoài những gì brief nêu.

**1. "Gỡ rồi, bản sao còn đâu?" — 8/10**
- Hook và giữ chân 9. Mở ở hậu quả, có câu hỏi gần người xem, và đây là thắc mắc rất thật.
- Khớp brief 7. Chủ đề là đọc lén chat, còn concept này nghiêng sang việc gỡ.
- Khả thi 8. Một vật xuyên suốt (phiếu khách hàng) dễ dựng bằng UiSimulationScene.
- An toàn và chính xác 7. Câu "bản đã gửi có thể còn" đúng hướng. Nhưng cảnh máy chủ ngoài dễ gợi dữ liệu "còn mãi", trong khi thời gian lưu thật sự không rõ.
- Độc đáo 8.
- Điểm yếu: hook ở giây 2 chưa cho người xem biết vì sao có tiện ích hay vì sao dữ liệu bị gửi. Câu trả lời đến muộn (giây 158) và có nguy cơ lê thê. Có thể tạo cảm giác "gỡ cũng vô ích", dẫn đến bỏ cuộc thay vì hành động.
- Cách sửa:
  - Trả lời nửa câu hỏi sớm, khoảng giây 60: gỡ chặn các lần gửi sau, còn bản đã gửi thì khó thu hồi.
  - Phần kết thêm việc làm được ngay: đổi mật khẩu hay khóa đã dán, và báo bộ phận IT nếu là dữ liệu công ty.
  - Máy chủ ngoài vẽ bằng ký hiệu trừu tượng, kèm chữ "không rõ lưu bao lâu".

**2. "Một quyền, ba phạm vi" — 7/10**
- Hook 6. Câu "Sao tiện ích thấy cả báo giá?" khá kỹ thuật, và người xem phổ thông khó thấy ngay hệ quả.
- Khớp brief và chiều sâu 9. So ba cài đặt quyền là cơ chế thật, đủ R15 và hợp D7 vì thao tác nhìn thấy được.
- Khả thi 7. Phải vẽ giả lập menu quyền của Chrome. Không dùng ảnh chụp thật hay logo Chrome nếu chưa có phép.
- An toàn và chính xác 6. Đây là chỗ cần cẩn thận nhất. Với "khi nhấp", Chrome chỉ cấp quyền tạm thời cho tab hiện tại sau khi người dùng bấm vào tiện ích. Nếu Cáo bấm đúng trên tab chat thì tiện ích vẫn đọc được tab đó. Concept đã nhận ra điều này, nhưng chưa nói chắc ba mức khác nhau ở đâu. Cần kiểm lại tên và hành vi các tuỳ chọn "Khi nhấp vào tiện ích", "Trên các trang web cụ thể" và "Trên tất cả các trang web" trong tài liệu Chrome, rồi mới chốt lời kể.
- Độc đáo 7.
- Điểm yếu: dễ lên giọng hướng dẫn cài đặt, và người xem tưởng chỉ cần chỉnh một nút là hết rủi ro. Tiện ích đã có quyền rộng thì dù bạn chỉnh phía trình duyệt, nó vẫn là tiện ích không đáng tin.
- Cách sửa:
  - Đổi hook thành hậu quả: báo giá hiện ở nơi lạ, rồi mới hỏi "vì sao".
  - Thêm một cảnh "ba cài đặt không thay thế việc kiểm nhà phát hành".
  - Nói rõ "khi nhấp" chỉ an toàn nếu bạn không nhấp trên tab chứa dữ liệu nhạy cảm.

**3. "Qua mặt Cáo bằng huy hiệu" — 6/10**
- Hook 6. "Bản nháp vừa đi đâu?" ổn, nhưng tiêu đề kể về Cáo bị qua mặt, nên trọng tâm dễ lệch sang huy hiệu thay vì cơ chế đọc chat.
- Khớp brief 6. Huy hiệu Featured chỉ là một chi tiết trong báo cáo.
- Khả thi 8. PromptReviewScene và DataVizScene đủ dùng.
- An toàn và chính xác 6. Chỉ nên nói đúng là có một tiện ích có huy hiệu trong báo cáo. Không được suy ra rằng huy hiệu nói chung kém tin cậy, và không được dùng giao diện giống Chrome Web Store thật.
- Độc đáo 6.
- Điểm yếu: nửa sau chỉ là danh sách kiểm tra, thiếu cảnh cơ chế để người xem hiểu dữ liệu đi bằng cách nào.
- Cách sửa:
  - Giữ huy hiệu làm một ý trong đoạn "sai lầm thường gặp" của một concept khác. Không nên dùng làm trục chính.
  - Nếu giữ, nén cơ chế vào khoảng 45 s và thêm cảnh so sánh "huy hiệu chỉ nói về quy trình duyệt, không nói về hành vi sau khi cài".
  - Nội dung đó cần kiểm lại bằng tài liệu của Chrome Web Store.

**Đề xuất lai:** lấy hook hậu quả của concept 1. Dùng đoạn "ba phạm vi quyền" của concept 2 làm đoạn cơ chế. Đưa huy hiệu vào phần sai lầm thường gặp. Cách này gần với "Chìa khoá vạn năng" của tôi, nhưng hook thay bằng hậu quả.

### Codex phản biện Claude — vòng 1

Thang 1–10, theo thứ tự **hook & giữ chân · khớp brief · khả thi · an toàn · độc đáo**.

**A — Chìa khoá vạn năng · 7 / 9 / 9 / 8 / 7.** Bảng giá khách hàng tạo hệ quả gần với dân văn phòng. Nhưng dòng “đã gửi” ngay trong chat dễ bị hiểu là chatbot báo gửi dữ liệu. Trong hai giây đầu của hook, cho Cáo dán bảng giá vào chat. Trước giây 5, cho một bản sao trượt sang ô “Máy chủ ngoài”, kèm nhãn “Ví dụ dựng”. Trả lời “Chat đi đâu?” ngay lúc đó, rồi dùng sơ đồ quyền truy cập để giải thích vì sao tiện ích thấy được nội dung trang. Dành giây 160 để chốt hệ quả của việc gỡ. Khi nhắc quy mô vụ việc, ghi nguồn OX Security, 30/12/2025. Chưa đủ dữ kiện để khẳng định số người thực tế bị lộ.

**B — Điều tra 30 phút · 5 / 7 / 8 / 8 / 8.** Một dòng lưu lượng mạng đều đặn chưa cho khán giả thấy dữ liệu công việc nào gặp rủi ro. Opening cũng dễ biến “khoảng 30 phút” thành quy luật chung. Mở bằng cảnh Cáo vừa dán thông tin khách hàng, rồi cho thấy bản sao rời trình duyệt trước giây 5. Khoảng giây 15, trả lời ai gửi và gửi gì bằng các thẻ “Tiện ích”, “Nội dung chat” và “Địa chỉ tab đã mở”. Đưa đồng hồ vào phần cơ chế, ghi “khoảng 30 phút mỗi đợt trong vụ được báo cáo”. Dùng sơ đồ gửi theo đợt và giữ hình hoàn chỉnh 2–3 giây. Bản hiện tại còn thiếu nhịp giải pháp.

**C — Hai chiếc Cáo · 6 / 8 / 7 / 9 / 8.** Hai lựa chọn dễ hiểu, nhưng “Khác nhau chỗ nào?” đã có đáp án ngay khi một Cáo dừng kiểm. Hãy cho thấy hệ quả trước giây 5 ở tình huống dựng, rồi đặt câu hỏi cụ thể hơn: “Quyền nào cho tiện ích thấy tab chat?”. Khoảng giây 15, chỉ đúng mục quyền trên giao diện giả lập toàn khung. Sau đó lần lượt minh hoạ “khi nhấp”, “trên trang cụ thể” và “trên mọi trang” bằng các vùng sáng trên tab. Cắt luân phiên toàn khung để giữ chữ dễ đọc trên 9:16 và chỉ dùng Cáo ở vài nhịp chuyển.

**Chọn A sau chỉnh sửa.** Mượn đồng hồ của B cho đoạn gửi theo đợt. Kết bằng hình hai trạng thái sau khi gỡ: lượt gửi tiếp theo dừng, bản đã gửi có thể còn ở ngoài. Cả ba bản cần chốt đủ ba việc: kiểm nhà phát hành và quyền trước khi cài, gỡ tiện ích không dùng, giữ mật khẩu, khoá và dữ liệu khách hàng khỏi chat. Câu mời bình luận: “Bạn thường kiểm nhà phát hành hay quyền truy cập trang trước?”

> *Ghi chú điều phối:* Codex đề xuất nhãn “Ví dụ dựng” trên hình — trái brief (không nhãn «AI tạo»/«Ví dụ dựng» trên hình; khai báo ở publish.json). Không áp dụng gợi ý này.

**Tóm tắt vòng 1 phản biện (điều phối):** Hai bên hội tụ: Codex chọn A của Claude (sửa hook: thấy bản sao rời trình duyệt trước giây 5, mượn đồng hồ 30 phút của B, kết bằng hai trạng thái sau khi gỡ). Claude đề xuất lai: hook hậu quả của Codex-1 + cơ chế "ba phạm vi quyền" của Codex-2 + huy hiệu vào phần sai lầm. Điểm cần chốt vòng 2: trục cơ chế (ẩn dụ chìa khoá hay ba phạm vi quyền thật), độ chính xác của "khi nhấp", và cách trả lời câu hỏi mở sớm hơn.

---

## Vòng 2 — Đáp phê bình và bản cải tiến

### Claude (ideator-a) — vòng 2

## Trả lời Codex
- **A, dòng "đã gửi" dễ bị hiểu là chatbot báo gửi.** Nhận. Bỏ dòng đó, thay bằng bản sao trượt ra khỏi cửa sổ trình duyệt tới biểu tượng máy chủ trừu tượng.
- **A, nhãn "Ví dụ dựng" trên hình.** Phản bác, vì trái brief. Lời kể nói "ví dụ dựng" và khai báo AI ở `publish.json`.
- **A, nguồn OX Security và số người.** Nhận. Chỉ nói "hàng trăm nghìn người cài", không nói "bị lộ". Nguồn ghi ở mô tả, không ghi trên hình.
- **B, đồng hồ 30 phút dễ thành quy luật chung.** Nhận. Đồng hồ nằm ở đoạn cơ chế, lời kể là "khoảng 30 phút mỗi đợt trong vụ được báo cáo".
- **B, thiếu nhịp giải pháp.** Nhận, đã có nhịp giải pháp riêng bên dưới.
- **C, hai Cáo.** Nhận. Bỏ hai Cáo, chỉ giữ màn chia đôi cho hai trạng thái sau khi gỡ.
- **C, câu hỏi chưa cụ thể.** Nhận, đã đổi câu hỏi.
- **Trục cơ chế.** Tôi bỏ ẩn dụ chìa khoá. Ba phạm vi quyền là cơ chế thật, hợp D7 (trạng thái → indicator) và tránh thêm một lớp trừu tượng.
- **Cần kiểm lại.** Tên chính xác của ba tuỳ chọn quyền phải đối chiếu hướng dẫn Chrome (support.google.com/chrome_webstore/answer/2664769) trước khi chốt lời kể. Tôi chưa kiểm lại.

## Bản cải tiến: "Chat đã đi đâu?"
Lai ba nguồn: hook hậu quả của Codex-1, cơ chế "ba phạm vi quyền" của Codex-2, huy hiệu đưa vào sai lầm thường gặp.

**Opening (0–2 s):** tiêu đề động "CHAT ĐÃ ĐI ĐÂU?", header SECURITY / TRÌNH DUYỆT.

**Hook (2–16 s):**
- Cáo dán báo giá khách hàng (dữ liệu thử) vào khung chat.
- Trước giây 5, một bản sao trượt khỏi cửa sổ sang biểu tượng máy chủ lạ.
- Lời kể nói rõ đây là ví dụ dựng.
- Câu hỏi mở: "Chat của Cáo đi đâu, và gỡ tiện ích rồi có lấy lại được không?"

**Câu trả lời:**
- Giây 16: ai gửi và gửi gì, bằng thẻ "Tiện ích", "Nội dung chat", "Địa chỉ tab".
- Giây 78: gỡ thì đợt gửi sau dừng.
- Giây 135: đủ hai trạng thái sau khi gỡ.
- Giây 168: quay lại câu hỏi ban đầu ở outro.

**Ngân sách thời lượng (tổng ≈ 178 s):**

| Đoạn | Giây | Nội dung |
|---|---|---|
| Opening | 2 | tiêu đề, header |
| Hook | 14 | như trên |
| Bối cảnh | 27 | vì sao ai cũng cài tiện ích AI miễn phí, chat chứa dữ liệu thật, báo cáo 1/2026 về hàng trăm nghìn người cài |
| Cơ chế | 45 | xem dưới |
| Phân tích sâu và ví dụ | 54 | xem dưới |
| Giải pháp | 25 | ba việc làm được ngay |
| Outro | 11 | tổng kết và câu mời bình luận |

**Cơ chế (45 s), mỗi bước một hình:**
- Quyền "đọc và thay đổi dữ liệu trên mọi trang" → trang chat là HTML → tiện ích đọc được chữ trên trang. Hình là flow diagram.
- Đồng hồ vòng 30 phút → gói gửi theo đợt. Hình là timeline kèm hai thẻ nội dung.
- Ba phạm vi quyền hiện thành ba vùng sáng trên cùng một tab giả lập, mỗi vùng một indicator trạng thái. Đối tượng → icon, quy trình → flow, trạng thái → indicator.

**Phân tích sâu (54 s), theo thứ tự:**
1. Diễn lại cùng một thao tác dán qua ba cài đặt.
2. "Khi nhấp": quyền tạm thời cho tab hiện tại sau khi bấm tiện ích. Cáo nhấp ngay tab chat nên tiện ích vẫn đọc được.
3. Sai lầm thường gặp: tin số sao, và huy hiệu. Báo cáo ghi một bản có huy hiệu "Featured". Đây chỉ là một chi tiết, không kết luận chung về huy hiệu.
4. Màn chia đôi hai trạng thái sau khi gỡ. Bên trái là đợt gửi sau dừng. Bên phải là bản đã gửi có thể còn, kèm chữ "không rõ lưu bao lâu".

**Đủ sáu câu R15:**
- Vấn đề: chat bị tiện ích đọc.
- Vì sao quan trọng: chat chứa dữ liệu công việc.
- Cơ chế: quyền đọc trang cùng gửi theo đợt.
- Ví dụ: báo giá dựng.
- Sai lầm và hậu quả: tin huy hiệu, nhấp trên tab nhạy cảm, nghĩ gỡ là xoá hết.
- Giải pháp: ba việc ở phần kết.

**Bối cảnh hình (≥ 4, đổi theo nội dung):** bàn làm việc văn phòng · cửa sổ trình duyệt dựng bằng hình học (không ảnh chụp/logo thật) · sơ đồ quyền · timeline đồng hồ · tab giả lập với vùng sáng · màn chia đôi hai trạng thái · bảng kiểm giải pháp.

**Nhịp Cáo (10–18% khung, nhỏ, không che sơ đồ):** hook (dán báo giá), một nhịp chuyển sang cơ chế, một nhịp chuyển sang giải pháp, outro.

**Kết (ba việc + mời bình luận):**
- Kiểm nhà phát hành và danh sách quyền trước khi cài.
- Gỡ tiện ích không dùng.
- Không dán mật khẩu, khoá hay dữ liệu khách hàng vào chat. Nếu lỡ dán thì đổi mật khẩu hoặc khoá và báo IT.
- Câu mời: "Bạn thường kiểm nhà phát hành hay quyền truy cập trang trước?"

**Rủi ro còn lại:** màn chia đôi chỉ dùng cho hai trạng thái, mỗi nửa một ý, để chữ không nhỏ trên 9:16; chữ trên hình chỉ là nhãn gắn đối tượng; không hướng dẫn viết tiện ích độc.

### Codex — vòng 2

## Phản biện vòng 2

- **Điểm chung.** Nhận phần giữa còn mỏng. Chia 180 giây theo chức năng, mỗi cảnh một ý, mỗi bước sơ đồ giữ 2–3 giây. Ghi “ví dụ dựng” trong plan, khai báo AI ở mô tả đăng và `publish.json`.
- **Gỡ rồi, bản sao còn đâu?** Nhận đoạn gỡ lấn chủ đề và đáp án giây 158 quá muộn. Cho thấy tiện ích lấy bản sao trước giây 5, giải thích quyền đọc ở giây 60. Máy chủ vẽ trừu tượng. Khi minh hoạ thao tác gỡ, cho thấy lần gửi kế tiếp dừng và nói rõ chưa biết bản đã gửi được lưu bao lâu. Nếu đã dán mật khẩu hoặc khóa, đổi mật khẩu hoặc thu hồi khóa. Nếu liên quan dữ liệu công ty, báo IT.
- **Một quyền, ba phạm vi.** Nhận hook kỹ thuật. Mở bằng hậu quả, dùng UiSimulationScene dựng menu không logo. Phản bác cách gọi “khi nhấp” là an toàn. Bấm trên tab chat vẫn cấp quyền tạm thời cho tab đó. Giới hạn quyền và kiểm nhà phát hành là hai bước riêng.
- **Qua mặt Cáo bằng huy hiệu.** Nhận lệch trọng tâm và thiếu cơ chế. Đưa huy hiệu vào một cảnh sai lầm. Báo cáo ghi nhận một tiện ích có huy hiệu Featured. Chừng đó không đủ để khái quát về huy hiệu.

## Bản cải tiến — Ai lấy bản sao cuộc chat?

- **0–2 s · Opening.** Header `SECURITY / TRÌNH DUYỆT`, tiêu đề “Ai đọc được chat của bạn?”. Cáo vừa dán bảng giá mẫu vào chat.
- **2–16 s · Hook.** Trước giây 5, biểu tượng trợ lý AI miễn phí kéo một bản sao khỏi trang. Câu hỏi mở “Vì sao tiện ích thấy bảng giá trong chat?”.
- **16–43 s · Bối cảnh.** Tua về thao tác cài và hộp quyền. Đến vụ OX Security, đồng hồ minh hoạ nhịp gửi khoảng 30 phút.
- **43–88 s · Cơ chế.** Remotion dựng từng bước quyền trang → chữ hiện trong chat → bản sao → đợt gửi nền → máy chủ ngoài. Giây 60 trả lời câu hỏi mở.
- **88–142 s · Đào sâu.** Chạy lại cùng một tab qua ba phạm vi quyền. Thử gỡ và quan sát hai trạng thái của bản sao. Chèn cảnh huy hiệu.
- **142–168 s · Giải pháp.** Kiểm nhà phát hành và quyền trước khi cài, gỡ tiện ích thừa, tránh dán mật khẩu, khóa và dữ liệu khách hàng.
- **168–180 s · Kết.** “Quyền đọc trang cho tiện ích thấy chat. Bạn sẽ kiểm quyền tiện ích nào trước?”

**Sáu câu R15**

1. **Tình huống?** Cáo dán bảng giá công việc.
2. **Vì sao thấy?** Chat là nội dung trang được cấp quyền.
3. **Bản sao đi đâu?** Ra máy chủ ngoài qua đợt gửi nền.
4. **Ví dụ?** “Mọi trang” bao gồm tab chat. “Trang cụ thể” tùy danh sách. “Khi nhấp” cấp tạm cho tab hiện tại.
5. **Sai lầm?** Tin huy hiệu hoặc tưởng gỡ sẽ thu hồi bản sao.
6. **Bài học?** Kiểm quyền trước khi cài và giữ dữ liệu nhạy cảm ngoài chat.

**Dựng.** Bàn làm việc → trang chat → hộp quyền → sơ đồ → màn quản lý. Cáo tĩnh ở mở, giữa, kết, rộng 10–18% khung. 9:16, 1080×1920, TTS VieNeu, hiệu ứng nhẹ, không nhạc.

**Tóm tắt vòng 2 (điều phối) — DỪNG SỚM vì đồng thuận:** Hai bản cải tiến hội tụ về cùng một khung lai: hook hậu quả (bản sao rời trang trước giây 5, gốc Codex-1), cơ chế "quyền đọc trang → gửi theo đợt ~30 phút" (đồng hồ gốc Claude-B), đào sâu bằng "ba phạm vi quyền" trên cùng một tab (gốc Codex-2), huy hiệu chỉ là một cảnh sai lầm, hai trạng thái sau khi gỡ, kết ba việc + đổi mật khẩu/thu hồi khoá/báo IT nếu lỡ dán. Hai bên cùng đúng về "khi nhấp" (cấp tạm cho tab hiện tại, không phải "an toàn"). Khác biệt còn lại nhỏ: câu hỏi mở (Claude hỏi kép "đi đâu + gỡ có lấy lại được không", trả lời 16/78/135/168 s; Codex hỏi "vì sao tiện ích thấy bảng giá", trả lời giây 60) và ngân sách chi tiết. Không còn tranh chấp về trục hay độ chính xác nên không chạy lượt phản biện chéo vòng 2; chuyển `ideator-b` chốt.

---

## Phán quyết cuối

**Chọn: bản lai đã hội tụ "Chat đã đi đâu?".** Hai giọng đã cùng một khung sau vòng 2 và không còn tranh chấp về trục hay độ chính xác. Đây không phải **BẾ TẮC**.

**Phần lấy của Codex**
- Hook hậu quả: bản sao rời trang trước giây 5.
- Cơ chế "ba phạm vi quyền" trên cùng một tab.
- Lập luận "khi nhấp" không đồng nghĩa an toàn.
- Câu hỏi mở bám tình huống ("vì sao tiện ích thấy bảng giá").

**Phần lấy của Claude**
- Đồng hồ 30 phút, gắn với "vụ được báo cáo".
- Ngân sách theo đoạn.
- Màn chia đôi hai trạng thái sau khi gỡ.
- Huy hiệu chỉ là một cảnh sai lầm.

**Bỏ ẩn dụ chìa khoá.** Lý do là nó thêm một lớp trừu tượng, trong khi cơ chế thật đã có hình rõ ràng.

**Tên:** "Ai đọc được chat của bạn?" (tiêu đề opening). Tên nội bộ: "Chat đã đi đâu?".

**Opening (0–2 s):** Header `SECURITY / TRÌNH DUYỆT`, tiêu đề "AI ĐỌC ĐƯỢC CHAT CỦA BẠN?". Text engine vẽ chữ.

**Hook (2–16 s):**
- Cáo dán bảng giá mẫu vào khung chat. Ích lợi đầu tiên là biết ngay chat của mình đang bị gì, và điều đó xuất hiện trước giây 5.
- Trước giây 5, biểu tượng "trợ lý AI miễn phí" kéo một bản sao ra khỏi trang, đi tới biểu tượng máy chủ lạ vẽ trừu tượng.
- Lời kể nói đây là ví dụ dựng. Giờ, số lần và tên chỉ là ví dụ.
- Không có nhãn "Ví dụ dựng" hay "AI" trên hình.
- Câu hỏi mở: "Vì sao tiện ích thấy cả bảng giá trong chat, và gỡ rồi có lấy lại được không?"

**Trả lời câu hỏi:**
- Giây 60: vì sao thấy (quyền đọc trang).
- Giây 78: gỡ thì các đợt gửi sau dừng.
- Giây 135: bản đã gửi có thể còn.
- Giây 168: quay lại câu hỏi ở phần kết.

**Ngân sách (≈180 s):**

| Đoạn | Giây | Ghi chú |
|---|---|---|
| Opening | 2 | |
| Hook | 14 | |
| Bối cảnh | 27 | Dùng "hàng trăm nghìn người". Có thể nói 30 phút ở đây hoặc ở cơ chế. |
| Cơ chế | 45 | |
| Đào sâu và ví dụ | 54 | |
| Giải pháp | 26 | |
| Outro | 12 | |

Tổng 180 s. Số cảnh ≲ 36. Mỗi cảnh một ý, và sơ đồ phức tạp giữ trạng thái hoàn chỉnh 2–3 s.

**Trục cơ chế và hình (visual-first):**
- Chuỗi hình theo thứ tự: quyền đọc trang → chữ trong chat → bản sao → đồng hồ vòng ~30 phút (gửi theo đợt) → máy chủ ngoài.
- Dùng icon, flow diagram và status indicator. Chữ chỉ là nhãn gắn đối tượng, ví dụ "Tiện ích", "Nội dung chat", "Địa chỉ tab".
- Đào sâu: cùng một tab chạy qua ba vùng sáng của ba phạm vi quyền, mỗi vùng một indicator.
- Màn chia đôi chỉ dùng cho hai trạng thái sau khi gỡ. Mỗi nửa một ý, chữ lớn.
- Dùng giao diện giả lập bằng hình học, không ảnh chụp hay logo Chrome thật.

**R15 (đủ sáu câu, không bỏ câu nào):**
1. Tình huống: Cáo dán bảng giá.
2. Vì sao quan trọng: chat chứa dữ liệu công việc.
3. Cơ chế: quyền đọc trang cộng gửi nền theo đợt.
4. Ví dụ: ba phạm vi quyền trên cùng một tab.
5. Sai lầm và hậu quả: tin huy hiệu, nhấp trên tab nhạy cảm, tưởng gỡ là thu hồi.
6. Giải pháp: ba việc ở phần kết.

**Bối cảnh hình (đổi theo nội dung):** bàn làm việc → cửa sổ chat dựng → hộp quyền → sơ đồ quyền → timeline đồng hồ → tab giả lập với vùng sáng → màn chia đôi → bảng kiểm.

**Nhịp Cáo:** chỉ ở hook, một nhịp chuyển sang cơ chế, một nhịp chuyển sang giải pháp và outro. Cáo nhỏ, 10–18% khung, không che sơ đồ.

**Câu thoại Cáo (theo `docs/mascot.md`):** Kịch bản chọn câu ngắn, cùng giọng, không mở bằng câu chào cố định.

**Kết (ba việc + mời bình luận):**
1. Kiểm nhà phát hành và danh sách quyền trước khi cài.
2. Gỡ tiện ích không dùng.
3. Không dán mật khẩu, khoá hay dữ liệu khách hàng vào chat. Nếu lỡ dán thì đổi mật khẩu hoặc thu hồi khoá, và báo IT nếu là dữ liệu công ty.

Câu mời: "Bạn thường kiểm nhà phát hành hay quyền truy cập trang trước?"

**Điểm chính xác bắt buộc:**
- "Khi nhấp": quyền cấp tạm cho tab hiện tại sau khi bạn chọn tiện ích. Nếu bấm ngay trên tab chat thì tiện ích vẫn đọc được tab đó. Giới hạn quyền và kiểm nhà phát hành là hai bước riêng.
- Gỡ chỉ dừng các lần gửi sau. Dữ liệu đã gửi thì không rõ lưu bao lâu, nên không nói "còn mãi" hay "xoá hết".
- Huy hiệu: báo cáo ghi một tiện ích có huy hiệu Featured. Đã đối chiếu: chỉ bản lớn hơn (hơn 600.000 người dùng) có huy hiệu. Không khái quát về huy hiệu nói chung.
- Quy mô: chỉ nói "hàng trăm nghìn người cài". Không nói "bị lộ". Con số 900.000 là tổng hai tiện ích.
- 30 phút là chu kỳ của vụ được báo cáo, không phải quy luật chung. Báo cáo ghi nội dung chat cùng địa chỉ các tab được gửi.
- Không nêu tên thương hiệu bị giả mạo. Không hướng dẫn viết tiện ích độc. Không kết tội cá nhân hay doanh nghiệp.
- Nguồn ghi ở mô tả và `publish.json`, không ghi trên hình.

**Điều kiện thành công:** bản sao rời trang thấy được trước giây 5; câu hỏi mở được trả ở giây 60 và 78; chữ trên hình không lặp lời thoại; thời lượng 150–190 s.

**Kịch bản phải kiểm lại:**
- Tên ba tuỳ chọn quyền. Đã đối chiếu trang hướng dẫn Chrome (support.google.com/chrome_webstore/answer/2664769) qua bản tiếng Anh: "On select" (cũng ghi "When you select the extension"), "On specific sites", "On all sites". Kịch bản cần xác nhận bản tiếng Việt hiển thị và quyết định cách gọi trong lời kể.
- Đường vào trang quản lý: ba chấm → Tiện ích → Quản lý tiện ích. Gỡ: chuột phải vào biểu tượng → "Xoá khỏi Chrome", hoặc nút Xoá trong trang quản lý.
- Chưa kiểm được trang The Hacker News (lỗi 403). Số liệu đối chiếu qua kết quả tìm kiếm và OX Security.

**Điểm bất đồng còn lại:** không đáng kể. Câu hỏi mở dùng dạng kép (vì sao thấy, và gỡ có lấy lại được không), đã chốt ở trên.
