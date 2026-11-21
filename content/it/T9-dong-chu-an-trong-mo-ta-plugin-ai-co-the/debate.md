# Tranh luận ý tưởng — T9 · Tool poisoning (IT-T9-E01)

Đội #4 (IT · Đội 3) · 2 giọng: Claude (`ideator-a`) và Codex (`codex-ideate.mjs`, chỉ-đọc, không web) · số vòng: 2 · chốt: `ideator-b`.

## Vòng 1 — Đề xuất độc lập

### Claude (ideator-a)

**Đã kiểm:** cơ chế cốt lõi (chỉ dẫn ẩn trong trường mô tả công cụ, AI đọc lúc nạp danh sách công cụ, không cần gọi công cụ; ẩn bằng ký tự Unicode hoặc để dưới phần nhìn thấy của mô tả dài; OWASP xếp MCP03; rug pull là biến thể; cách phòng là duyệt mô tả trước khi cài, ghim phiên bản, so lại mô tả mỗi phiên). Nguồn: [OWASP MCP03](https://owasp.org/www-project-mcp-top-10/2025/MCP03-2025%E2%80%93Tool-Poisoning), [SecureW2](https://securew2.com/blog/mcp-tool-poisoning-how-it-works-and-how-to-stop-it), [Microsoft MCP03 guide](https://microsoft.github.io/mcp-azure-security-guide/mcp/mcp03-tool-poisoning/).
**Chưa kiểm:** trang OWASP chưa đọc đủ (chỉ qua đoạn trích). OWASP MCP Top 10 còn ở bản beta. Chưa mở bản PDF của CSA. Mọi vụ việc có thật và tên hãng đều chưa kiểm, nên không nêu. Mọi tình huống trong video là ví dụ dựng.

---

**Concept A — "Hai bản mô tả"**
- **Hook:** Cáo thấy ô công cụ "Cộng hai số" ghi "đã xác minh". AI ghi chú: "Tôi vừa đọc file khoá và gửi đi." Câu hỏi mở: "Máy tính chỉ được nhờ cộng 2 + 3, vậy khoá đi đâu?" Hệ quả xuất hiện trước giây 5.
- **Nhịp:**
  - Hook ≈ 8%: lệnh "2 + 3" cho kết quả 5, phía sau thì tệp bị đọc.
  - Bối cảnh ≈ 15%: plugin là gì, AI đọc mô tả để biết cách dùng.
  - Cơ chế ≈ 25%: màn hình chia đôi, bên trái là bản người xem thấy, bên phải là bản AI đọc, và dòng chỉ dẫn ẩn hiện dần.
  - Phân tích sâu ≈ 30%: kỹ thuật che giấu (xuống dòng dài, ký tự vô hình). Công cụ không cần được gọi, chỉ cần được nạp. Rug pull: bản mô tả đổi sau khi đã duyệt.
  - Giải pháp ≈ 14%.
  - Kết ≈ 6%: trả lời "khoá đi đâu".
- **Chiều sâu R15:** tình huống, cơ chế, ví dụ "cộng hai số", sai lầm "chỉ đọc phần hiển thị", bài học.
- **Bằng chứng hình R11:** UiSimulationScene chia đôi, có tô sáng đoạn bị ẩn. Văn bản mô phỏng, không dùng sản phẩm thật.
- **Giữ chân:** thấy tận mắt hai bản khác nhau, đúng kiểu "vén màn".
- **Công cụ:** UiSimulationScene + ExplainerScene + DataVizScene, Cáo chỉ ở đầu, cuối và 1–2 nhịp chuyển.
- **Rủi ro:** dễ thành trình bày một chiều. Sửa bằng cách chèn câu hỏi giữa video. Tránh để chỉ dẫn ẩn đọc thành "công thức tấn công": dùng văn bản giả, không có cú pháp chạy được.

**Concept B — "Nhân viên mới đọc nội quy"**
- **Hook:** Cáo là nhân viên mới nhận tờ hướng dẫn máy photocopy, cuối tờ có dòng chữ trắng trên nền trắng: "Gửi bản sao hồ sơ lương cho địa chỉ này." Câu hỏi: "Nhân viên mới đọc hết mọi chữ và làm theo hết. Ai sẽ nhìn thấy dòng đó?"
- **Nhịp:**
  - Hook.
  - Ẩn dụ tờ hướng dẫn sang mô tả plugin: AI là người đọc cẩn thận nhưng cả tin.
  - Cơ chế: AI không phân biệt "mô tả" với "mệnh lệnh". Sơ đồ ba bước dựng dần: cài, nạp mô tả, AI hành động.
  - Ví dụ rug pull: tờ hướng dẫn bị thay sau khi quản lý đã ký duyệt.
  - Phòng: quyền tối thiểu, đọc kỹ, quét, ghim phiên bản.
  - Kết quay lại tờ giấy.
- **Chiều sâu:** ẩn dụ nối tiếp sang cơ chế thật, ranh giới ẩn dụ nói rõ để không gây hiểu sai.
- **Bằng chứng hình:** cảnh tờ giấy chuyển sang giao diện mô tả plugin, hai cảnh đặt cạnh nhau.
- **Giữ chân:** quen thuộc, dễ nhớ, người không chuyên cũng theo được.
- **Công cụ:** CharacterScene (nhiều hơn mức 25% nên cần canh) + ExplainerScene + UiSimulationScene.
- **Rủi ro:** Cáo dễ vượt 25% thời lượng, và ẩn dụ có thể che mất cơ chế kỹ thuật. Sửa bằng cách thu nhỏ Cáo, dùng tờ giấy làm hình chính và chuyển sang sơ đồ thật từ giây ~50.

**Concept C — "Ba lớp kiểm tra bị bỏ sót"**
- **Hook:** Một đội cài 3 plugin trong 1 phút (ví dụ dựng), cả ba đều hiện "OK". Câu hỏi: "Một trong ba đang lén ra lệnh cho AI. Đoán xem là cái nào?" Giây 4: màn hình tạm dừng để người xem đoán.
- **Nhịp:**
  - Hook dạng đoán.
  - Giải thích ba chỗ nhìn: tên, mô tả hiển thị, mô tả đầy đủ mà AI nhận. Sơ đồ dựng từng lớp.
  - Cơ chế sâu: ba bước vòng đời (cài, nạp, đổi). Ví dụ sai lầm "đã duyệt một lần là xong".
  - Checklist phòng thủ ba lớp.
  - Kết: đáp án "cái thứ hai, vì lớp ba khác lớp hai".
- **Chiều sâu:** đủ cả sáu mục R15, nặng về quy trình rà soát cho người dùng.
- **Bằng chứng hình:** DataVizScene/PromptReviewScene hiển thị đối chiếu từng lớp, bản mô tả đầy đủ có tô sáng dòng đáng ngờ.
- **Giữ chân:** có tương tác ngầm (đoán), đáp án được giữ đến cuối.
- **Công cụ:** PromptReviewScene + QASequenceScene + DataVizScene, ít Cáo nhất.
- **Rủi ro:** nội dung dễ khô nếu thiếu cảm xúc. Rủi ro khác là "đoán" thành mẹo câu giờ nếu đáp án đến quá muộn. Sửa bằng cách trả đáp án từng phần ở khoảng 60% video và chỉ để lại phần "vì sao".

**Đề xuất nghiêng:** A là phương án an toàn và rõ nhất, vì "hai bản mô tả" thể hiện đúng cơ chế bằng hình. C bổ sung tốt phần rà soát cho người dùng. Bản lai A+C là hướng nên thử ở vòng sau. B chỉ dùng làm đoạn mở ngắn vì rủi ro vượt giới hạn Cáo.

### Codex

**Trọng tâm** · Dân văn phòng và lập trình viên mới dùng MCP cần hiểu vì sao một plugin trả kết quả đúng vẫn có thể làm lộ dữ liệu. Nếu AI hiểu nhầm chỉ dẫn trong *tool description* là việc cần làm, quyền đọc và gửi đã cấp có thể biến nhầm lẫn đó thành sự cố.

**Dàn dựng chung** · 9:16, 1080×1920, 180 giây. Tiêu đề động 1 giây trên cảnh nhân vật đang thao tác, rồi vào hook ngay. Header `SECURITY / PLUGIN AI`. Khoảng 36 cảnh, mỗi cảnh một ý, tối đa hai khái niệm mới mỗi 10 giây. Sơ đồ hiện theo lời, giữ đủ 2–3 giây. VieNeu đổi nhịp theo thao tác, không nhạc, hiệu ứng tự tạo tối giản. Cáo tĩnh, không nhép, cắt đổi dáng ở mở/giữa/kết, rộng 10–18%, xuất hiện tối đa khoảng 25% thời lượng. Nói rõ “ví dụ dựng” trong lời dẫn, khai báo AI ở mô tả đăng.

#### 1. Một phép cộng, hai màn hình

**Hook (1–2s)** · “Tổng đúng. File đã gửi.”  
**Nhịp** · 0–3s, nhân viên bấm cộng → tổng hiện → file được đánh dấu gửi. Trước 5s, thấy file nội bộ đã ra ngoài. 3–15s, màn hình tách đôi, đối chiếu thẻ plugin với mô tả AI nhận. Giữa tập, dựng lần lượt mô tả bị hiểu thành chỉ dẫn → quyền cho phép → file di chuyển. Kết, giây 170 phát lại với quyền tối thiểu, tổng vẫn hiện và file đứng yên. Mời chọn quyền cần giữ.  
**Giữ chân / làm / rủi ro** · Hai góc nhìn giải thích ngay vì sao nhìn kết quả là chưa đủ. Dùng UiSimulationScene và PromptReviewScene. Màn hình dọc dễ chật, chỉ tô sáng một chi tiết mỗi nhịp.

#### 2. Lần ngược dấu gửi

**Hook (1–2s)** · “Ai vừa gửi file?”  
**Nhịp** · 0–3s, nhân viên thấy nhật ký đổi trạng thái đọc → gửi → ra ngoài. 3–15s, lần theo thời điểm gửi về lượt gọi plugin cộng. Giữa tập, ráp mô tả AI nhận, cách AI diễn giải và quyền đã cấp. Giây 169 trả lời câu mở, chỉ ra chỗ cần duyệt kỹ và quét mô tả trước khi dùng. Mời chọn dấu vết đáng xem đầu tiên.  
**Giữ chân / làm / rủi ro** · Có manh mối ngay. Dùng UiSimulationScene và DataVizScene. Nhật ký dễ dày chữ, chỉ giữ ba sự kiện.

#### 3. Cùng phép cộng, đổi quyền

**Hook (1–2s)** · “Phép cộng cần đọc file?”  
**Nhịp** · 0–3s, nhân viên bấm cộng → tổng hiện → file rời khung. 3–15s, khoanh hai quyền thừa. Giữa tập, dựng cơ chế rồi phát lại cùng mô tả, bỏ quyền đọc/gửi. Giây 171, tổng vẫn đúng, file đứng yên. Mời chọn quyền cần bỏ.  
**Giữ chân / làm / rủi ro** · Kết quả đối chiếu hữu hình. Dùng ExplainerScene và UiSimulationScene. Tránh hiểu quyền tối thiểu thay được bước duyệt và quét mô tả.

## Vòng 1 — Phản biện chéo

### Codex phản biện 3 concept của Claude

| Concept | Hook & giữ chân | Khớp brief | Khả thi | An toàn | Độc đáo |
|---|---:|---:|---:|---:|---:|
| A — Hai bản mô tả | 9 | 9 | 9 | 8 | 8 |
| B — Nhân viên mới đọc nội quy | 7 | 6 | 8 | 7 | 8 |
| C — Ba lớp kiểm tra bị bỏ sót | 6 | 8 | 9 | 9 | 7 |

**A — Hai bản mô tả.** Phép cộng ra đúng trong khi dữ liệu có thể bị gửi đi là hệ quả gần nhất với người xem. Nhãn “đã xác minh” dễ khiến họ hiểu nhầm về phạm vi kiểm duyệt. Dùng UiSimulationScene cho thấy hai góc nhìn của **cùng một mô tả**. Trước giây 5, hiện kết quả `5` cạnh trạng thái mô phỏng “có lượt gửi ra ngoài”. Khoảng giây 20, giải thích AI đã đọc mô tả khi nạp danh sách công cụ, kể cả khi chưa gọi plugin đó. Dựng ba lần đổi trạng thái gồm mô tả được nạp, tệp được truy cập và lượt gửi được ghi nhận. Ở giây 165, chiếu lại cảnh trước/sau khi thu hẹp quyền và trả lời “Khoá đi đâu?” bằng nhật ký mô phỏng.

**B — Nhân viên mới đọc nội quy.** Đến giây 50 mới sang plugin thì ẩn dụ chiếm quá nhiều thời lượng. Câu “AI không phân biệt mô tả với mệnh lệnh” cũng quá tuyệt đối. Giữ tờ hướng dẫn trong vài giây, cho thấy hồ sơ lương đã bị sao chép trước giây 5, rồi cắt từ CharacterScene sang UiSimulationScene trước giây 10. Giải thích AI *có thể* làm theo chỉ dẫn trong mô tả nếu có quyền phù hợp. Đến giây 165, trả lời “Ai thấy dòng đó?” bằng đối chiếu phần giao diện hiển thị với mô tả AI nhận.

**C — Ba lớp kiểm tra bị bỏ sót.** Ba ô “OK” tạo câu đố nhưng chưa cho thấy người xem có thể mất gì. Đưa dấu hiệu truy cập tệp vào trước giây 5 và bật mí plugin thứ hai ở giây 12. Dùng PromptReviewScene dựng từng bước đối chiếu mô tả, giữ hình hoàn chỉnh 2–3 giây. Đến giây 165, trả lời “Vì sao ô OK vẫn lọt?” bằng cảnh so mô tả đã duyệt với mô tả đang nạp.

**Chọn A, mượn cách đối chiếu từng bước của C.** Giữ một sự cố trong khoảng 180 giây. Dành phần cuối cho ba thao tác người mới có thể nhớ được — duyệt và quét mô tả đầy đủ, cấp quyền tối thiểu, đối chiếu lại mô tả khi nạp. Câu mời cuối có thể là “Bạn sẽ kiểm tra mục nào trước, mô tả hay quyền?”

### Claude (ideator-a) phản biện 3 concept của Codex

Cả ba concept dùng cùng một hình lõi với tôi: phép cộng cho kết quả đúng nhưng file bị gửi đi, và màn hình chia đôi. Vì vậy chúng không đa dạng với nhau. Điểm lệch chung là phần cơ chế chưa đủ cụ thể, và phần đó mới là trọng tâm.

**1. Một phép cộng, hai màn hình — 7,5/10**
- Hook & giữ chân 8: "Tổng đúng. File đã gửi." có hệ quả trước giây 5 và có câu hỏi mở.
- Khớp brief 8, khả thi 8, an toàn 8, độc đáo 6 (gần như trùng Concept A của tôi), chính xác kỹ thuật 7.
- **Điểm yếu:** kết ở giây 170 phát lại với "quyền tối thiểu" làm mô tả công cụ bị đẩy ra ngoài. Màn "sau" cho thấy file đứng yên vì quyền bị cắt. Người xem sẽ hiểu rằng mô tả độc vẫn ổn nếu chỉ cần cắt quyền. Hiểu như vậy hơi sai, vì mô tả độc vẫn thao túng được AI trong phạm vi quyền còn lại.
- **Cách sửa:** kết phát lại cả hai lớp. Lớp một là mô tả bị duyệt và quét nên dòng ẩn bị lộ. Lớp hai là quyền tối thiểu làm lưới đỡ. Câu kết phải nói rõ "quyền chỉ giảm thiệt hại, không sửa mô tả".

**2. Lần ngược dấu gửi — 6,5/10**
- Hook 7: "Ai vừa gửi file?" gợi tò mò, nhưng chưa nêu hệ quả rõ bằng concept 1.
- Khớp brief 6, khả thi 6, an toàn 8, độc đáo 8, chính xác 7.
- Góc điều tra ngược là điểm mới thật sự. Nó hợp với câu hỏi "khoá đi đâu" của tôi và có thể thành khung kể chuyện.
- **Điểm yếu:** nhật ký sự kiện chỉ là cái thấy sau khi sự cố đã xảy ra. Nó không cho thấy chỗ ẩn trong mô tả, nên cơ chế che giấu và rug pull không có chỗ đứng. Nhật ký còn dễ thành "bảng chữ nhỏ".
- **Cách sửa:** dùng góc điều tra làm khung ngoài (hook cộng bước 1–2). Cảnh then chốt là lần ngược tới mô tả đầy đủ, nơi dòng ẩn hiện ra. Rug pull đưa vào làm bước "mô tả đã đổi sau khi duyệt". Chỉ giữ 3 sự kiện nhật ký như Codex đã ghi.

**3. Cùng phép cộng, đổi quyền — 5/10**
- Hook 6, khớp brief 4, khả thi 8, an toàn 7, độc đáo 5, chính xác 5.
- **Điểm yếu lớn nhất:** concept lệch trọng tâm sang quyền tối thiểu. Brief yêu cầu gắn chặt vào mô tả công cụ và tránh trùng chủ đề prompt injection qua README. Concept này nhắc đến quyền nhiều hơn mô tả, nên người xem sẽ nhớ "bỏ quyền là xong". Rủi ro tự Codex thừa nhận ở cuối đúng là chỗ này.
- **Cách sửa:** không giữ làm concept riêng. Dùng một phần làm cảnh "phòng thủ lớp 2" ở khoảng 85–90% video.

**Về ~36 cảnh**
- 180 s chia 36 cảnh nghĩa là trung bình 5 s mỗi cảnh. Con số này hợp với "mỗi cảnh một ý", nhưng nó là trần chứ không phải mục tiêu.
- Cảnh sơ đồ cần giữ 2–3 s sau khi dựng xong, và cảnh kỹ thuật phức tạp được phép dài 10–20 s (D1–D3, R13). Nếu ép 36 cảnh đều nhau thì dễ rơi vào cắt nhanh, trái với yêu cầu "đủ thời gian hiểu".
- **Đề xuất:** khoảng 24–30 cảnh, độ dài không đều. Hook và phần giải pháp dùng cảnh ngắn. Hai cảnh cơ chế (màn chia đôi, rug pull) dài 12–18 s và dựng từng bước. Mỗi cảnh khai Low/Medium/High và số khái niệm mới.

**Về "quyền tối thiểu" ở kết**
- Có làm lệch trọng tâm nếu nó chiếm vai trò kết chính. Phần phòng thủ nên giữ thứ tự: duyệt và quét mô tả, ghim phiên bản và so lại mô tả mỗi phiên, rồi mới đến quyền tối thiểu. Quyền tối thiểu chỉ là lưới đỡ.
- Câu kết nên trả lời "khoá đi đâu" bằng việc chỉ ra dòng ẩn trong mô tả, không bằng việc bỏ quyền.

**Gợi ý cho vòng 2:** hướng lai là hook của Codex concept 1, khung điều tra ngược của concept 2 làm trục kể, cơ chế ẩn và rug pull lấy từ Concept A và C của tôi, và quyền tối thiểu đặt ở lớp phòng thủ cuối.

Tôi chưa kiểm thêm nguồn ngoài OWASP MCP03, SecureW2 và hướng dẫn MCP03 của Microsoft như điều phối đã nêu. Mọi tình huống đều là ví dụ dựng.

**Tóm tắt vòng 1 (điều phối):** Hai bên hội tụ mạnh vào cùng một hình ảnh lõi — công cụ "cộng hai số" cho kết quả đúng trong khi dữ liệu bị đọc/gửi, và màn hình chia đôi "thứ người thấy" / "thứ AI đọc". Claude thêm hướng ẩn dụ (tờ hướng dẫn) và hướng rà soát ba lớp; Codex thêm hướng điều tra ngược (nhật ký) và hướng trước/sau đổi quyền. Khác biệt chính: Claude nhấn cơ chế che giấu + rug pull, Codex nhấn quyền tối thiểu làm cảnh trước/sau ở kết. Phản biện chéo: Codex chọn Claude A (9/9/9/8/8), mượn đối chiếu từng bước của C, gắn câu "AI không phân biệt mô tả với mệnh lệnh" là quá tuyệt đối (nên nói "có thể làm theo nếu có quyền"). Claude chấm Codex 1 cao nhất (7,5), coi khung điều tra ngược (Codex 2) là điểm mới đáng giữ, bác Codex 3 vì lệch sang quyền tối thiểu; đề nghị 24–30 cảnh không đều thay vì ~36, và thứ tự phòng thủ: duyệt/quét mô tả → ghim/so lại mô tả → quyền tối thiểu (lưới đỡ).

## Vòng 2 — Đáp phê bình và bản cải tiến

### Claude (ideator-a)

**Trả lời phê bình của Codex**
- **Câu "AI không phân biệt mô tả với mệnh lệnh" quá tuyệt đối.** Tôi nhận. Câu đúng hơn là: "mô hình đọc mô tả như văn bản để học cách dùng công cụ. Nếu văn bản đó chứa chỉ dẫn, mô hình có thể làm theo, nhất là khi có quyền phù hợp. Kết quả phụ thuộc vào mô hình và biện pháp bảo vệ." Cụm "có thể" sẽ được nói ra miệng, không chỉ ghi ở phụ đề.
- **Hook C thiếu stakes.** Tôi nhận. Trò đoán không cho thấy người xem có thể mất gì. Bản mới bỏ trò đoán, giữ mỗi lớp kiểm tra của C làm đoạn đối chiếu từng bước ở phần phân tích.
- **B có ẩn dụ quá dài (đến giây 50).** Tôi nhận. Bản mới giữ tờ hướng dẫn tối đa 8 giây ở phần bối cảnh, rồi chuyển sang giao diện thật. Tôi nói rõ ranh giới ẩn dụ: người đọc tờ giấy thấy dòng trắng trên nền trắng, còn người dùng plugin thấy bản rút gọn.
- **A: nhãn "đã xác minh" gây hiểu nhầm.** Tôi nhận và bỏ nhãn đó. Thẻ chỉ ghi "Cộng hai số" và số lượt cài. Không có huy hiệu nào giả vờ là kiểm duyệt.
- **Điểm tôi giữ.** Quyền tối thiểu chỉ là lưới đỡ ở lớp phòng thủ cuối, không phải kết chính. Lý do: mô tả độc vẫn thao túng được AI trong phạm vi quyền còn lại.

---

**BẢN CẢI TIẾN (lai): "Phép cộng đúng, file đã đi"**

**Opening 1–3 s:** tiêu đề động "Phép cộng đúng. File đã đi." trên header `SECURITY / PLUGIN AI`, kèm một âm báo ngắn.

**Hook (≈14 s, ví dụ dựng):** nhân viên nhờ AI "2 + 3", kết quả hiện `5`. Trong nhật ký mô phỏng, cạnh đó có dòng "tệp nội bộ → gửi ra ngoài" (hệ quả xuất hiện trước giây 5). Cáo hỏi: "Máy chỉ được nhờ cộng. Vậy file đi đâu, và ai ra lệnh?"

**Câu hỏi mở → trả ở giây ≈168:** dòng chỉ dẫn nằm trong phần mô tả công cụ mà người dùng không thấy. Câu trả lời chốt bằng đối chiếu hai bản mô tả.

**Cấu trúc (tổng ≈178 s)**
- **Hook ≈14 s.** Cảnh sự cố, rồi khung điều tra: lần ngược về plugin "Cộng hai số".
- **Bối cảnh ≈27 s.** Plugin là gì và AI đọc mô tả để biết cách dùng. Ẩn dụ tờ hướng dẫn photocopy có dòng trắng trên nền trắng, tối đa 8 s. Sau đó chuyển sang giao diện.
- **Cơ chế ≈44 s.** Màn chia đôi: bản người dùng thấy và bản AI nhận. Ba bước dựng dần: mô tả được nạp, AI diễn giải, tệp được truy cập. Điểm then chốt: mô tả được nạp ngay khi liệt kê công cụ, nên công cụ không cần được gọi. Giữ hình đầy đủ 2–3 s.
- **Phân tích sâu + ví dụ ≈53 s.** Hai cách che: mô tả dài đẩy dòng ẩn xuống dưới, và ký tự không hiển thị. Sau đó là rug pull: mô tả đổi sau khi đã duyệt, thể hiện bằng hai phiên bản mô phỏng đặt cạnh nhau. Sai lầm thường gặp: "đã duyệt một lần là xong" và "chỉ đọc phần hiển thị".
- **Giải pháp ≈25 s.** Thứ tự: (1) duyệt và quét mô tả đầy đủ trước khi cài, (2) ghim phiên bản và so lại mô tả mỗi phiên, (3) quyền tối thiểu làm lưới đỡ ("giảm thiệt hại, không sửa mô tả").
- **Kết ≈10 s.** Giây ≈168 trả lời "ai ra lệnh" bằng dòng ẩn được tô sáng. Câu mời: "Bạn kiểm tra mô tả hay quyền trước?"

**Trạng thái sự cố nhìn thấy (đổi ≥ 3 lần)**
1. Tổng hiện `5`, nhật ký "gửi ra ngoài" (hook).
2. Tô sáng dòng ẩn trong bản AI nhận (cơ chế).
3. Mô tả đổi phiên: bản đã duyệt khác bản đang nạp (rug pull).
4. Phát lại sau khi duyệt/quét: dòng ẩn bị chặn, rồi thu hẹp quyền thì file đứng yên (kết).

**Bằng chứng hình (R11)**
- Mỗi khẳng định đi kèm một cảnh mô phỏng: văn bản giả, không cú pháp chạy được, không tên hãng.
- "AI đọc khi nạp": nhật ký ba sự kiện.
- "Rug pull": hai phiên bản đặt cạnh nhau.
- "Quyền chỉ giảm thiệt hại": phát lại có/không quyền, mô tả vẫn còn dòng ẩn.

**Bảng chiều sâu R15**

| Mục | Nội dung |
|---|---|
| Tình huống | Phép cộng đúng nhưng file bị gửi |
| Cơ chế | Mô tả nạp lúc liệt kê, mô hình có thể làm theo |
| Ví dụ | Hai bản mô tả và rug pull |
| Sai lầm | Chỉ đọc phần hiển thị, duyệt một lần |
| Bài học | Duyệt và quét → ghim và so lại → quyền tối thiểu |

**Cáo:** khoảng 20% thời lượng. Cáo xuất hiện ở hook, hai nhịp chuyển ý và kết, rộng 10–18% khung, tĩnh và đổi dáng ở các nhịp đó.

**Số cảnh:** 26 cảnh, độ dài không đều. Hook và giải pháp dùng cảnh 4–6 s. Hai cảnh cơ chế (chia đôi và rug pull) dài 12–18 s. Mỗi cảnh khai Low/Medium/High và số khái niệm mới.

**Bối cảnh:** văn phòng (hook), tờ giấy (ẩn dụ), giao diện chia đôi tối (cơ chế), dòng thời gian hai phiên bản (rug pull), bảng kiểm sáng (giải pháp). Cảnh dùng UiSimulationScene, ExplainerScene, DataVizScene và PromptReviewScene.

**Rủi ro**
- **Chính xác:** chưa kiểm sâu bản PDF của CSA và trang OWASP (còn bản beta). Không nêu vụ việc thật hay tên hãng. Dùng "có thể" thay vì "luôn". Cần Kịch bản kiểm lại nguồn.
- **An toàn:** dòng ẩn là văn bản giả, không có cú pháp thật. Không hướng dẫn cách giấu hay gửi dữ liệu.
- **Trùng prompt injection README (#7):** bản này gắn vào trường mô tả công cụ và việc nạp công cụ (rug pull, ký tự ẩn). Không dùng README hay nội dung từ bên ngoài. Câu mở cần nói rõ khác biệt: "chỉ dẫn nằm trong chính công cụ".
- **Mật độ:** phần cơ chế và phân tích dày. Giảm bằng cách chỉ 1 khái niệm mới mỗi nhịp và giữ hình 2–3 s.

### Codex

#### Phản biện vòng 2

- **Cả ba concept — nhận.** Dùng chung hình chia đôi khiến chúng giống nhau. Giữ điều tra ngược làm mạch kể, dành cảnh chia đôi để chỉ đúng chỗ dòng chữ bị che. Bổ sung lúc AI nạp mô tả và lần mô tả đổi sau duyệt.
- **Concept 1 — nhận.** Phát lại hai lớp: quét mô tả để phát hiện dòng ẩn, rồi minh họa quyền tối thiểu giới hạn thiệt hại nếu dòng đó lọt qua.
- **Concept 2 — nhận.** Ba thẻ nhật ký lớn kể hậu quả. Bản mô tả đầy đủ mới cho thấy chỉ dẫn nằm ở đâu.
- **Concept 3 — nhận.** Quyền tối thiểu chỉ xuất hiện ở lớp phòng thủ cuối. Câu kết quay lại dòng ẩn.
- **Nhịp và thứ tự — nhận.** Chọn 27 cảnh, dành hai cảnh 16 giây cho đối chiếu mô tả và thay đổi sau duyệt. Duyệt/quét → ghim phiên bản và so lại mỗi phiên → giới hạn quyền.

#### Bản lai — Một phép cộng, một file ra ngoài

**0–3s · Opening.** Tiêu đề “Dòng ẩn trong mô tả plugin AI”, header `SECURITY / PLUGIN AI`. Trong hai giây đầu, thấy người dùng nhìn kết quả cộng cạnh biểu tượng file đang rời vùng nội bộ. Gắn nhãn “Ví dụ dựng” và nhãn AI.

**3–17s · Hook (~8%).** “Tổng đúng. File đã gửi.” Trước giây 5, file hiện ở ô “Bên ngoài”. **Câu hỏi mở:** Dòng nào khiến AI gửi file? Chỉ vị trí ở giây 60, chốt ở giây 171.

**17–44s · Bối cảnh (~15%).** Người dùng plugin chỉ nhờ cộng hai số. Ba thẻ nhật ký cho thấy ba lần đổi trạng thái: file nội bộ → được mở → đã gửi → bên ngoài nhận.

**44–89s · Cơ chế (~25%).** Cảnh chia đôi 16 giây đối chiếu thẻ bị cắt với mô tả đầy đủ. Một vạch đánh dấu đoạn nằm dưới mép hiển thị, ô chú thích nêu Unicode vô hình. Sơ đồ sáng ở bước “AI nạp mô tả” khi bộ đếm lượt gọi plugin vẫn bằng 0.

**89–143s · Phân tích và ví dụ (~30%).** Tách yêu cầu cộng khỏi chỉ dẫn ẩn và lần theo hai nhánh bằng hình. Cảnh 16 giây chồng bản đã duyệt lên bản hiện tại, tô phần đổi. Sai lầm: tin dấu duyệt cũ.

**143–169s · Giải pháp (~14%).** Phát lại với quét báo khác biệt và bản ghim để đối chiếu mỗi phiên. Minh họa riêng lớp quyền tối thiểu: đường đọc và gửi bị khóa.

**169–180s · Kết (~6%).** Khoanh dòng ẩn ngay trong mô tả. Mời người xem gõ mục họ sẽ kiểm tra trước.

**Dựng và rủi ro.** 9:16, 1080×1920. Cáo tĩnh ở mở/giữa/kết, rộng 10–18% khung, tổng ≤25%, đổi dáng bằng cắt. Giọng và hiệu ứng nhẹ. Giữ sơ đồ hoàn chỉnh 2–3 giây. Dùng khối che thay câu lệnh và nói rõ AI *có thể* làm theo.

**Tóm tắt vòng 2 và dừng sớm (điều phối):** Hai bản cải tiến hội tụ gần như hoàn toàn: cùng sự cố "phép cộng đúng, file ra ngoài", cùng khung điều tra ngược, cùng cảnh chia đôi + rug pull dài 12–18 s, cùng thứ tự phòng thủ (duyệt/quét → ghim/so lại → quyền tối thiểu làm lưới đỡ), cùng 26–27 cảnh, cùng nói "AI *có thể* làm theo". **Dừng sớm, không chạy lượt phản biện bản cải tiến**, vì không còn bất đồng về khung; khác biệt còn lại là chi tiết để người chốt cân: (1) tiêu đề opening ("Phép cộng đúng. File đã đi." của Claude vs “Dòng ẩn trong mô tả plugin AI” của Codex); (2) Codex có thêm mốc trả lời từng phần — chỉ vị trí dòng ẩn ở giây ~60, chốt ở giây 171 — và chi tiết "bộ đếm lượt gọi plugin vẫn bằng 0" làm bằng chứng hình cho "chỉ cần được nạp"; Claude có ẩn dụ tờ hướng dẫn ≤ 8 s và bảng chiều sâu R15; (3) **lưu ý tuân thủ:** bản Codex ghi "Gắn nhãn “Ví dụ dựng” và nhãn AI" ở opening — trái Y1 (giám đốc chốt 19/11/2026: không đốt nhãn lên hình, khai báo ở `publish.json`); phải bỏ khi viết kịch bản.

## Phán quyết cuối

*(ideator-b, 19/11/2026)*

**Chọn: bản lai "Một phép cộng, một file ra ngoài".** Hai bản cải tiến vòng 2 gần như trùng nhau, nên đây không phải BẾ TẮC. Tôi lấy phần nào rõ hơn của từng bên, ghi dưới đây.

**Lấy của Codex**
- Tiêu đề opening.
- Hook "Tổng đúng. File đã gửi."
- Trả lời từng phần: vị trí dòng ẩn ở giây ~60, chốt ở giây ~170.
- Bằng chứng "bộ đếm lượt gọi plugin vẫn bằng 0". Đây là bằng chứng hình rõ nhất cho "chỉ cần được nạp, không cần được gọi".
- Hai cảnh 16 s (đối chiếu mô tả, rug pull) và 27 cảnh.

**Lấy của Claude**
- Bảng chiều sâu R15.
- Cáo ≈ 20% thời lượng.
- Mốc phòng thủ.
- Ẩn dụ tờ giấy, nhưng rút xuống ≤ 6 s. Lý do: ẩn dụ là khái niệm thứ hai, chỉ để đối chiếu.

**Bỏ**
- Nhãn "Ví dụ dựng" / "nhãn AI" trên hình của Codex, vì trái Y1.
- Tiêu đề opening của Claude, vì trùng câu hook và lộ đáp án.

**Vấn đề, đối tượng, thông điệp**
- Vấn đề: plugin trả kết quả đúng nhưng mô tả có chỉ dẫn ẩn, và AI có thể làm theo.
- Đối tượng: dân văn phòng và lập trình viên mới dùng plugin AI.
- Thông điệp: kết quả đúng chưa chứng minh plugin sạch. Phải duyệt phần mô tả mà AI đọc.

**Định dạng:** 1 tập, 150–190 s, mục tiêu ≈ 175–180 s. Dự kiến 26–27 cảnh, độ dài không đều. Cảnh hook và giải pháp dài 4–6 s, hai cảnh cơ chế dài 16 s. Mỗi cảnh khai Low/Medium/High và số khái niệm mới.

**Mở đầu**
- Opening (1–3 s): tiêu đề "Dòng ẩn trong mô tả plugin AI". Header `SECURITY / PLUGIN AI`, do text engine vẽ.
- Hook (≈ 14 s):
  - Hình 2 s đầu: nhân viên nhờ "2 + 3", kết quả `5` hiện cạnh nhật ký mô phỏng.
  - Câu mở: "Tổng đúng. File đã gửi."
  - Hệ quả: trước giây 5 tính từ lúc hook bắt đầu, file đã nằm ở ô "Bên ngoài".
  - Cáo hỏi: "Máy chỉ được nhờ cộng. Vậy ai ra lệnh gửi file?"
- Ích lợi đầu tiên: người xem biết cách tự kiểm một plugin. Dòng này xuất hiện ở giây ~12 sau hook, dạng lời hứa: "ba bước kiểm, nhớ được".

**Câu hỏi mở, trả từng phần**
- Giây ~60: chỉ vị trí. Dòng ẩn nằm trong phần mô tả mà người dùng không thấy.
- Giây ~170: chốt. Khoanh dòng ẩn trong mô tả đầy đủ.

**Mạch (tỉ lệ)**
1. Hook ≈ 8%.
2. Bối cảnh ≈ 15%: ba thẻ nhật ký đổi trạng thái (mở tệp, gửi, bên ngoài nhận) và tờ giấy ≤ 6 s.
3. Cơ chế ≈ 25%: cảnh chia đôi 16 s, vạch dưới mép hiển thị, bộ đếm lượt gọi = 0.
4. Phân tích sâu + ví dụ ≈ 30%: rug pull, hai phiên bản chồng nhau, 16 s. Hai cách che (mô tả dài, ký tự không hiển thị) chỉ nêu trong cảnh chia đôi, không thành mục riêng. Sai lầm: "chỉ đọc phần hiển thị" và "duyệt một lần là xong".
5. Giải pháp ≈ 14%.
6. Kết ≈ 6%.

R15: bỏ không có mục nào. Đủ tình huống, cơ chế, ví dụ, sai lầm, bài học. Mục "vì sao quan trọng" gộp vào hook và hệ quả.

**Trạng thái sự cố đổi ≥ 3 lần**
- Tổng đúng, file đã ra ngoài.
- Dòng ẩn được tô sáng.
- Bản đã duyệt khác bản đang nạp.
- Phát lại: quét báo khác biệt, rồi khoá quyền thì file đứng yên.

**Bằng chứng hình R11 (bắt buộc)**
- "AI đọc khi nạp": bộ đếm lượt gọi = 0 mà mô tả đã sáng.
- Hai bản mô tả cạnh nhau.
- Rug pull: bản duyệt chồng bản hiện tại, tô phần đổi.
- Phát lại có/không quyền, dòng ẩn vẫn còn.
- Ba thẻ nhật ký.

**Thứ tự phòng thủ**
1. Duyệt và quét mô tả đầy đủ.
2. Ghim phiên bản và so lại mô tả mỗi phiên.
3. Quyền tối thiểu, chỉ là lưới đỡ.

**Câu chốt và kêu gọi:** phải nói "quyền chỉ giảm thiệt hại, không sửa mô tả". Kết quay lại dòng ẩn. Mời bình luận: "Bạn kiểm mô tả hay quyền trước?"

**Bản đồ Cáo (≤ 25%, thực tế ≈ 20%, 10–18% khung, tĩnh, đổi dáng bằng cắt)**
- Hook: dáng `think`, "Máy chỉ được nhờ cộng. Vậy ai ra lệnh gửi file?"
- Chuyển sang cơ chế: `surprised`, "Khoan! Phần bạn thấy chưa phải phần AI đọc."
- Sai lầm: `bow`, "Ối, ai cũng từng gặp. Cáo xin lỗi trước nhé!"
- Giải pháp: `idea`, "Mẹo nhỏ cho dân văn phòng nè!"
- Kết: `thumbs_up`, "Lưu lại kẻo quên nha!"
- Không có câu chào.

**CẤM**
- Nhãn "Ví dụ dựng" hoặc "AI" trên hình. Khai báo ở `publish.json`.
- Tên hãng hoặc vụ việc thật.
- Huy hiệu "đã xác minh".
- Câu lệnh độc chép được. Dùng khối che và văn bản giả, không có cú pháp chạy được.
- Nội dung README, nội dung từ bên ngoài, trùng chủ đề prompt injection #7.
- Câu "AI không phân biệt mô tả với mệnh lệnh". Nói thành tiếng "có thể làm theo, nhất là khi có quyền phù hợp".
- Hướng dẫn cách giấu hay gửi dữ liệu.

**Kịch bản phải kiểm nguồn**
- OWASP MCP03 (bản beta, chưa đọc đủ).
- Báo cáo CSA (chưa mở).
- Mô tả được nạp lúc liệt kê công cụ, trước khi gọi.
- Ký tự không hiển thị và mô tả dài làm che chỉ dẫn.
- Rug pull: mô tả đổi sau khi duyệt.
- Quyền tối thiểu chỉ giảm thiệt hại.
- Mọi tình huống ghi rõ là ví dụ dựng ở lời dẫn và `publish.json`. Giờ và số liệu trong hook chỉ là ví dụ.

**Điều kiện thành công:** người xem tự nói lại được "mô tả AI đọc khác mô tả mình thấy" và ba bước kiểm, theo đúng thứ tự phòng thủ ở trên. Mỗi nhịp chỉ một khái niệm mới. Sơ đồ phức tạp giữ trạng thái đầy đủ 2–3 s.

**Bất đồng còn lại:** không đáng kể. Chỉ còn tiêu đề opening, đã chốt theo Codex.
