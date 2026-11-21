# Tranh luận ý tưởng — Chủ đề #17: Điện thoại có đang nghe lén bạn để hiển thị quảng cáo?

Đội: IT · Đội 4 (team_id 5) · Video: IT-T17-E01 · Số vòng: 2 · Ngày 20/11/2026

**Gemini vắng (Ý tưởng):** BUSY — agy đang chạy lượt khác ở cả lần gọi đầu và lần thử lại. Tranh luận tiếp với hai giọng Claude và Codex.

---

## Vòng 1 — Đề xuất độc lập

### Giọng Claude (ideator-a)

Tôi đã kiểm hai dữ kiện then chốt. Các cơ chế nhắm mục tiêu còn lại (cùng mạng Wi-Fi, đối sánh danh sách khách hàng, pixel) tôi chưa mở nguồn, nên ghi "CẦN KIỂM" để vị trí Kịch bản và Gemini xác minh.

**Nguồn đã kiểm**
- [Northeastern, 2018](https://news.northeastern.edu/2018/07/06/is-your-smartphone-spying-on-you/): thử 17.260 ứng dụng Android trên 10 máy, không thấy bằng chứng ứng dụng bí mật bật micro gửi âm thanh. Nhóm nghiên cứu không khẳng định "không bao giờ". Công cụ không đăng nhập được vào ứng dụng, nên có thể sót phần xử lý ngay trên máy. Họ thấy vài ứng dụng ghi lại màn hình. Nghiên cứu chỉ chạy trên Android.
- [404 Media, 2024](https://404media.co/heres-the-pitch-deck-for-active-listening-ad-targeting/): bản thuyết trình của một công ty quảng cáo (Cox Media Group) quảng bá "Active Listening", tức nhắm quảng cáo theo lời nói gần micro. Đây là lời quảng bá của bên bán dịch vụ, chưa phải bằng chứng kỹ thuật. Google đã loại công ty này khỏi chương trình đối tác. Công ty phủ nhận làm điều bất thường. Các bên còn lại chỉ nêu tầm quan trọng của sự đồng ý của người dùng.

Cách nói an toàn là "chưa có bằng chứng kỹ thuật được kiểm chứng; có người quảng bá khả năng này", không khẳng định "có" hay "không" tuyệt đối. Không gắn hãng lớn vào cáo buộc. Chỉ nhắc tên công ty quảng cáo bằng chữ, có nguồn.

**Concept 1 · "Đôi giày không cần tai"**
- **Hook (0-2s):** Cáo cầm điện thoại, cảnh dựng: "Nói về đôi giày. Vài giờ sau, quảng cáo đôi giày hiện ra. Ai nghe lén?" Đây là ví dụ dựng, ghi rõ.
- **Nhịp:**
  - 0-3s: hệ quả "đúng đôi giày đó" và câu hỏi mở.
  - 3-15s: câu hỏi trả lời trước 15s: "Nhiều khả năng không cần micro".
  - 15-50s: dựng sơ đồ ba dòng dữ liệu về một hồ sơ quảng cáo. Gồm lịch sử bạn xem và tìm; vị trí cùng mạng Wi-Fi hay IP chung với người quen vừa tìm giày; danh sách khách hàng cửa hàng đối sánh với tài khoản (cả ba CẦN KIỂM).
  - 50-70s: kết quay lại đôi giày: bạn quên mình đã xem, hoặc người bên cạnh đã tìm.
- **Giữ chân:** mở bằng điều ai cũng từng gặp, kéo tới lời giải đố. Sơ đồ dựng từng bước, mỗi bước một ý.
- **Công cụ:** UiSimulationScene (giao diện giả trung tính) → DataVizScene (sơ đồ). Có thêm ExplainerScene và CharacterScene. Nền văn phòng, quán cà phê và nền dữ liệu.
- **Chiều sâu:** tình huống đôi giày; cơ chế là hồ sơ quảng cáo ghép từ nhiều nguồn; ví dụ hai người cùng Wi-Fi quán cà phê; sai lầm là nhớ lần ăn khớp mà quên lần không; bài học: kiểm quyền micro.
- **Rủi ro:** thành bài "không nghe lén" tuyệt đối. Sửa: câu "chưa có bằng chứng", không phải "chắc chắn không".

**Concept 2 · "Ba thứ: bằng chứng, lời quảng cáo, tin đồn"**
- **Hook:** "Ba câu về chuyện bị nghe lén. Chỉ một câu có bằng chứng." Hình ba thẻ úp.
- **Nhịp:**
  - 0-3s: câu hỏi mở "thẻ nào đúng".
  - 3-15s: thẻ 1, Northeastern thử 17.260 ứng dụng Android không thấy bằng chứng bật micro.
  - 15-45s: thẻ 2, một công ty quảng cáo quảng bá "Active Listening", đây là lời bán hàng, bị loại khỏi chương trình đối tác của Google, công ty phủ nhận. Thẻ 3, tin đồn kiểu "tôi nói là có".
  - 45-65s: kết: nhắm trúng không cần nghe, dựa vào dữ liệu hành vi.
- **Giữ chân:** trò chơi lật thẻ giữ tò mò, giải đáp từng bước.
- **Công cụ:** QASequenceScene hoặc DataVizScene làm thẻ; nền đổi mỗi thẻ.
- **Chiều sâu:** thiếu "cơ chế chính" nên phải đưa nhanh phần nhắm mục tiêu ở kết.
- **Rủi ro:** lệch khỏi một cơ chế chính và dễ quá dày thông tin (45-75s). Sửa: thẻ 3 chỉ nhắc ngắn.

**Concept 3 · "Thử tự kiểm: bạn cho ai quyền nghe?"**
- **Hook:** "Mở Cài đặt. Ai đang giữ quyền micro của bạn?" Hình danh sách quyền giả lập.
- **Nhịp:**
  - 0-3s: hệ quả "ứng dụng đèn pin xin quyền micro".
  - 3-15s: trả lời ngắn "nghe lén bí mật chưa được chứng minh, nhưng nhắm theo hành vi thì chắc chắn có".
  - 15-55s: ba bước tự kiểm: quyền micro, quyền vị trí, tuỳ chọn quảng cáo cá nhân hoá.
  - Kết: quay lại câu hỏi.
- **Giữ chân:** ích lợi sớm, người xem làm theo được ngay.
- **Công cụ:** UiSimulationScene giả lập cài đặt trung tính, không chụp màn hình hãng.
- **Chiều sâu:** chênh với yêu cầu "một cơ chế chính" vì thiên về hướng dẫn. Tên menu mỗi hệ điều hành khác nhau, CẦN KIỂM.
- **Rủi ro:** dễ lỗi thời, và vị trí bấm trong cài đặt khác nhau theo máy. Sửa: chỉ nói chung ("quyền micro, quyền vị trí").

**Đề xuất:** Concept 1 là chính (khớp brief, một cơ chế). Nếu cần, lấy ý "thẻ bằng chứng" của Concept 2 nhắc ngắn ở 40-50s.

### Giọng Codex

**Trọng tâm** là vì sao dân văn phòng có thể gặp quảng cáo đúng món vừa nhắc. Thông điệp chung là quảng cáo trùng cuộc trò chuyện chưa đủ để kết luận ứng dụng đã dùng mic.

Cả ba dựng khoảng 60 giây, 9:16, 1080×1920, với nhãn nhỏ **BẢO MẬT / QUẢNG CÁO**. Dùng giao diện giả lập, nền tự tạo và Cáo dáng tĩnh ở mở, giữa, kết, rộng 10–18% khung khi đứng cùng minh họa. Dùng VieNeu giọng Bắc và hiệu ứng nhẹ, tắt nhạc nền, khai báo AI trong mô tả đăng.

#### 1. Đôi giày chưa từng tìm
- **Hook ≤2s.** Cáo ở bàn ăn, tin nhắn “Đôi giày chạy bộ ấy…” bật lên ngay cạnh quảng cáo giày. Góc hình ghi “Ví dụ dựng”.
- **Nhịp.** 0–3s nhắc giày → quảng cáo hiện. Trước 5s, Cáo thấy quảng cáo dù chưa gõ tên đôi giày. 3–15s tua về lần xem clip chạy bộ. Đến giây 48, khép sơ đồ xem nội dung → suy ra sở thích → có thể được chọn xem quảng cáo. Chốt “Chưa tìm món đó vẫn có thể để lại tín hiệu liên quan.” Mời chọn “Lượt xem hay lượt tìm?”
- **Giữ chân.** Cú tua cho người xem một manh mối sớm và sửa nhầm lẫn rằng chỉ lượt tìm kiếm mới có giá trị.
- **Cách làm và rủi ro.** UiSimulationScene + DataVizScene qua bàn ăn, màn hình clip và bảng sơ đồ. Đối chiếu tài liệu nền tảng về tín hiệu tương tác. Lượt xem trong ví dụ chỉ minh họa một khả năng.

#### 2. Quảng cáo đi theo món đã xem
- **Hook ≤2s.** Cáo đóng trang một đôi giày. Thẻ quảng cáo cùng đôi bật lên ở khung kế bên, có nhãn “Ví dụ dựng”.
- **Nhịp.** 0–3s xem → đóng → gặp lại. Trước 5s, đôi giày xuất hiện ở một trang khác. 3–15s nối lần xem sản phẩm với sự kiện được gửi qua công cụ đo lường của cửa hàng. Giây 50, giải thích sự kiện đó có thể giúp chọn quảng cáo nhắc lại. Mời chọn dấu vết đầu tiên.
- **Giữ chân.** Người xem lần theo cùng một món và thấy vì sao chưa mua vẫn có thể gặp lại quảng cáo.
- **Cách làm và rủi ro.** UiSimulationScene + ExplainerScene cho cửa hàng, sơ đồ sự kiện và bảng tin. Đối chiếu tài liệu chính thức về tiếp thị lại. Chỉ áp dụng cho ví dụ đã mở trang sản phẩm có tích hợp phù hợp.

#### 3. Vì sao người chưa tìm cũng thấy?
- **Hook ≤2s.** Cáo nghe bạn nhắc giày. Bảng tin của Cáo bật quảng cáo giày, có nhãn “Ví dụ dựng”.
- **Nhịp.** 0–3s lời nhắc → quảng cáo → Cáo khựng lại. Trước 5s, hiện “Chưa từng tìm đôi này”. 3–15s chuyển sang lựa chọn của bên bán: tiếp cận nhóm quan tâm chạy bộ. Giây 50, giải đáp vì sao một người trong nhóm có thể thấy quảng cáo dù chưa tìm sản phẩm. Mời chọn “Chọn từng người hay chọn nhóm?”
- **Giữ chân.** Góc nhìn bên bán trả lời sớm câu “Vì sao lại là mình?” và sửa nhầm lẫn rằng quảng cáo khớp món thì bên bán phải biết cuộc trò chuyện.
- **Cách làm và rủi ro.** CharacterScene + DataVizScene qua bàn làm việc, bảng chọn nhóm và bảng tin. Đối chiếu tài liệu chính thức về nhắm mục tiêu theo sở thích. Cảnh chọn nhóm là minh họa, chưa đủ dữ kiện để xác định lý do của một lượt hiển thị thật.

> Ghi chú người điều phối: Codex đặt nhãn "Ví dụ dựng" lên hình — trái luật xưởng (từ 19/11/2026 không đốt nhãn lên hình; ghi ở caption/publish.json). Sẽ nêu ở phản biện.

**Tóm tắt vòng 1:** Claude nghiêng "Đôi giày không cần tai" (hồ sơ quảng cáo ghép từ nhiều nguồn: lịch sử xem/tìm, người cùng mạng, danh sách khách hàng) + kiểm chứng Northeastern 2018 và vụ "Active Listening" 2024. Codex đưa ba góc hẹp hơn, mỗi góc một dòng dữ liệu: lượt xem nội dung → suy ra sở thích; tiếp thị lại qua công cụ đo lường của cửa hàng; bên bán chọn nhóm sở thích. Gemini vắng.

---

## Vòng 1 — Phản biện chéo

### Claude (ideator-a) phản biện Codex

**Kiểm cơ chế (web)**
- Tiếp thị lại qua pixel: ĐÚNG ở mức chung. Pixel ghi hành vi trên trang, nhà quảng cáo dựng tệp khán giả để chạy lại quảng cáo trên Facebook/Instagram. Nguồn thứ cấp (blog bán hàng), chưa mở trang chính thức của Meta: https://www.shopify.com/blog/facebook-retargeting · https://optinmonster.com/how-does-retargeting-pixel-work/
- Đối sánh danh sách khách hàng: ĐÚNG. Email/SĐT được băm rồi so với băm của người dùng nền tảng. Tỉ lệ khớp thường dưới 100%, con số 50-80% chỉ là của một nhà cung cấp, đừng đưa lên hình. Tài liệu Meta: https://developers.facebook.com/docs/marketing-api/audiences/guides/custom-audiences
- Cùng Wi-Fi/IP chung với người quen: CHƯA XÁC MINH. Chỉ thấy IP dùng để suy ra vị trí cấp thành phố (https://www.macrumors.com/2018/12/18/facebook-ad-tracking-ip-address). Không thấy nguồn nói nền tảng ghép người cùng mạng để nhắm quảng cáo. Tôi rút ý này khỏi concept của mình, chỉ giữ "vị trí ước lượng từ IP".
- Hoạt động từ doanh nghiệp khác (tên cũ "Activity information from ad partners"): có thật và có công tắc tắt. Meta đã đổi tên tháng 6/2026: https://about.fb.com/news/2026/06/better-personalization-and-changes-to-controls-for-your-activity-from-other-businesses/
- "Nhắm theo sở thích suy từ lượt xem" (concept 1 và 3 của Codex): chưa mở được tài liệu chính thức. Kịch bản/Gemini cần kiểm trước khi viết. Concept 3 chỉ nói "nhóm quan tâm chạy bộ", khẳng định này yếu hơn.

**Lỗi chung của Codex**
1. Nhãn "Ví dụ dựng" đốt lên hình: trái luật. Sửa: đưa vào caption/`publish.json`, hình chỉ dựng tình huống trung tính.
2. Nhãn "BẢO MẬT / QUẢNG CÁO" ở mọi concept: dễ vi phạm Y1 (chữ thừa).
3. Cả ba đều né câu hỏi gốc "có nghe lén không". Không concept nào nêu bằng chứng (Northeastern 2018, vụ "Active Listening" 2024) nên người xem nghi ngờ vẫn chưa được trả lời.
4. Không ghi giây trả lời cụ thể cho câu hỏi mở (chỉ "giây 48/50"), muộn so với Y5.

> Ghi chú người điều phối về điểm 2: header nhãn chủ đề **là bắt buộc** theo D8/R21 (có ở mọi cảnh sau opening; ngoại lệ do giám đốc yêu cầu với Y1). Điểm 2 của Claude không đúng luật; Codex giữ header là đúng.

**Concept 1 "Đôi giày chưa từng tìm" — 7/10**
- Hook & giữ chân 7: hệ quả gần người xem. Cú tua về clip chạy bộ là manh mối hay.
- Khớp brief 8. Khả thi 8. An toàn 7. Độc đáo 7.
- Điểm yếu: đáp án "lượt xem" đến giây 48, quá muộn, và chưa nói mic có hay không. Sửa: nói ngay ở 3-15s "chưa có bằng chứng kỹ thuật được kiểm chứng về nghe lén bằng mic, nhưng còn cách khác", rồi mới tua lại. Tên mục "Lượt xem hay lượt tìm" nên thành câu hỏi người xem tự trả lời được.

**Concept 2 "Quảng cáo đi theo món đã xem" — 7.5/10**
- Hook & giữ chân 7. Khớp 6, vì đây là bài tiếp thị lại, không chạm "tin là bị nghe lén". Khả thi 8. An toàn 9 (cơ chế đã xác minh). Độc đáo 7.
- Điểm yếu: hook là "xem rồi gặp lại", mà chuyện này không ai thấy lạ, mất cú hích từ brief (nói mà chưa tìm). Sửa: ghép hook của brief (nhắc giày bằng lời, chưa từng mở), rồi để lộ "bạn bè của bạn đã mở trang" hoặc "bạn đã lướt clip giày" làm nút thắt. Mô tả "sự kiện gửi qua công cụ đo lường" quá kỹ thuật cho 45-75s, chỉ giữ "cửa hàng gắn bộ đếm trên trang".

**Concept 3 "Vì sao người chưa tìm cũng thấy?" — 6.5/10**
- Hook & giữ chân 7. Khớp 7. Khả thi 7. An toàn 5. Độc đáo 7.
- Điểm yếu: hook cho Cáo "nghe bạn nhắc giày" rồi bật quảng cáo, hình ảnh ngầm gợi ý có nghe lén dù lời phủ nhận. Cơ chế "bên bán chọn nhóm sở thích" chưa có nguồn xác nhận. Sửa: bỏ cảnh Cáo "nghe", mở bằng người nói chuyện rồi điện thoại nằm yên trên bàn. Chỉ giữ khi Gemini hoặc Kịch bản kiểm được tài liệu nhắm theo sở thích của nền tảng.

**Đề xuất lai (vòng 2)**
Khung của tôi (concept 1: hook đôi giày, trả lời "nhiều khả năng không cần mic, chưa có bằng chứng ngược lại" trước 15s) cộng hai manh mối kiểm được của Codex: lượt xem nội dung, cửa hàng gắn bộ đếm (tiếp thị lại). Một cơ chế chính là "hồ sơ ghép từ hành vi", tên "Đôi giày chưa từng tìm" của Codex ổn hơn tên cũ của tôi. Bằng chứng Northeastern và Active Listening gói vào một nhịp 40-50s.

**Tự nhận lỗi bên mình:** ý "cùng Wi-Fi/IP chung" chưa có nguồn nên bỏ. Phần "danh sách khách hàng" giữ lại vì đã kiểm.

### Codex phản biện Claude

Điểm theo thứ tự **hook & giữ chân · khớp brief · khả thi · an toàn · độc đáo**, thang 1–10.

**1. Đôi giày không cần tai — 8 · 9 · 9 · 7 · 8.** Mạnh nhất vì người xem nhận ra ngay tình huống khiến họ nghi bị nghe lén. Hook hiện quá dài cho hai giây. Cho Cáo nhìn điện thoại hiện quảng cáo giày và nói “Ủa, mới nhắc đôi này!” Trước giây 5, chốt tình huống bằng “Mình còn chưa tìm nó.” Chi tiết hai người cùng Wi‑Fi/IP dễ bị hiểu thành lời giải đã xác minh. Bỏ nhánh đó và danh sách khách hàng. Dùng một chuỗi minh họa **từng xem nội dung chạy bộ → hệ thống suy ra sở thích → quảng cáo giày có thể xuất hiện**, giữ nguyên chi tiết nhân vật chưa tìm đôi giày ấy. Bỏ câu kết đoán người bên cạnh đã tìm.

**2. Ba thứ — 6 · 7 · 9 · 8 · 7.** Ba thẻ úp biến hook thành bài đố trước khi người xem thấy tình huống liên quan đến mình. “Chỉ một câu có bằng chứng” cũng làm mờ sự khác biệt giữa kết quả thử nghiệm có giới hạn và tài liệu ghi nhận lời chào bán. Lấy một nhịp đối chiếu ngắn cho concept 1. Trong thử nghiệm Android được nêu, nhóm nghiên cứu không phát hiện ứng dụng bí mật gửi âm thanh. Tài liệu chào bán ghi nhận lời quảng bá, chưa xác minh cơ chế.

**3. Thử tự kiểm — 7 · 5 · 8 · 7 · 5.** Câu “Ai đang giữ quyền micro?” dễ khiến người xem đánh đồng quyền truy cập với bằng chứng ứng dụng đã thu âm. Ba mục cài đặt cũng chiếm thời lượng cần cho cơ chế quảng cáo. Giữ kiểm quyền micro như một lựa chọn cuối và nói rõ quyền truy cập chỉ cho biết ứng dụng được phép làm gì.

**Chốt concept 1, khoảng 60 giây.** Dành cho người từng thấy quảng cáo trùng khớp đáng ngờ. Mở ba pha với Cáo, quảng cáo giày và chi tiết chưa tìm đôi đó trong 0–5s. **Giây 8 trả lời** “Quảng cáo có thể hiện đúng món bạn vừa nhắc mà chẳng cần bật micro.” Dùng UiSimulationScene và DataVizScene minh họa chuỗi hành vi, rồi giải thích vì sao ta nhớ lần trùng hơn những lần chẳng có gì xảy ra. Chốt “Một lần trùng chưa đủ để biết quảng cáo đến từ đâu.” Mời nhẹ “Bạn từng gặp cú trùng nào như vậy?”

Dựng 9:16, 1080×1920, VieNeu giọng Bắc, không nhạc nền. Cáo tĩnh xuất hiện ngắt quãng ở mở, giữa và kết, rộng 10–18% khung khi đứng cạnh minh họa. Chuyển nhãn “Ví dụ dựng” và khai báo AI từ hình sang caption hoặc `publish.json`.

**Tóm tắt phản biện vòng 1:** Hai giọng hội tụ về khung "Đôi giày chưa từng tìm" (hook brief → trả lời sớm "không cần micro" → một chuỗi hành vi → kết quay lại đôi giày). Còn bất đồng: (a) Codex muốn một chuỗi duy nhất "xem nội dung → suy ra sở thích → quảng cáo", bỏ danh sách khách hàng; Claude muốn "hồ sơ ghép" gồm lượt xem + bộ đếm của cửa hàng (+ danh sách khách hàng). (b) Claude muốn một nhịp bằng chứng Northeastern/Active Listening; Codex chấp nhận một nhịp đối chiếu ngắn. Cả hai bỏ ý "cùng Wi-Fi/IP" (chưa xác minh). Codex thêm ý thiên kiến "nhớ lần trùng, quên lần không" để giải thích vì sao nhiều người tin.

---

## Vòng 2 — Đáp phê bình + bản cải tiến

### Giọng Claude (ideator-a)

**Kiểm thêm:** Meta tự nói sở thích quảng cáo dựa trên Trang bạn thích hoặc tương tác, quảng cáo bạn bấm, ứng dụng và trang web bạn dùng, cùng dữ liệu từ nhà quảng cáo và đối tác. Trang này là bản lưu 2020: [About Facebook Ads](https://webarchive.library.unt.edu/web/20200615214729/https://www.facebook.com/help/769828729705201). Bài 2014 cũng nói sở thích chủ yếu suy từ hoạt động trên Facebook: [about.fb.com 2014](https://about.fb.com/news/2014/06/making-ads-better-and-giving-people-more-control-over-the-ads-they-see/amp/). Vậy câu "nhắm theo sở thích suy từ hoạt động" có nguồn chính thức. Cả hai nguồn đều cũ, nên lời đọc chỉ nói "nền tảng ghi nhận hoạt động và suy ra sở thích", không nói riêng "lượt xem clip". Kịch bản cần kiểm lại bằng tài liệu mới.

**Đáp từng điểm của Codex**
1. **Hook dài quá 2 giây:** nhận. Hook rút còn một câu của Cáo.
2. **Bỏ Wi-Fi/IP và câu "người bên cạnh đã tìm":** nhận. Tôi đã tự rút ý này ở vòng 1 vì chưa có nguồn.
3. **Bỏ danh sách khách hàng, giữ một chuỗi duy nhất:** nhận một nửa. Tôi bỏ danh sách khách hàng khỏi thân bài, vì mục đích là một cơ chế dễ nhớ trong 60 giây. Tôi giữ bộ đếm của cửa hàng làm bước 2 của cùng chuỗi, không phải nhánh thứ hai. Lý do là Codex cũng cần nó cho concept 2, và nó có nguồn. Danh sách khách hàng chuyển thành một dòng dự phòng trong ghi chú Kịch bản.
4. **Trả lời ở giây 8:** nhận. Câu hỏi mở nằm ở 0-5s, đáp án sớm ở giây 8. Đáp án chỉ nói "không cần micro cũng có thể trùng", không nói "chắc chắn không".
5. **Thiên kiến nhớ lần trùng:** nhận. Đây là điểm cộng, thêm vào phần sai lầm thường gặp.
6. **Bỏ nhãn BẢO MẬT / QUẢNG CÁO:** tôi rút điểm phê bình này theo D8/R21. Header nhãn chủ đề là bắt buộc.

**Bản cải tiến: "Đôi giày chưa từng tìm"**
- **Hook (0-2s):** Cáo nhìn điện thoại hiện quảng cáo giày và nói "Ủa, mới nhắc đôi này!" Đây là ví dụ dựng, ghi ở caption và `publish.json`, không đốt lên hình.
- **Câu hỏi mở → giây trả lời:** 2-5s Cáo nói "Mình còn chưa tìm nó" và hỏi "Điện thoại nghe lén à?" Câu đáp ở giây 8: "Có thể trùng mà không cần bật micro."
- **MỘT cơ chế chính, tên là "hồ sơ quảng cáo ghép từ hành vi".** Các bước sơ đồ:
  1. Bạn xem clip chạy bộ, thích Trang thể thao, lướt trang giày.
  2. Bộ đếm trên trang cửa hàng ghi lại lượt mở trang.
  3. Nền tảng suy ra "quan tâm chạy bộ".
  4. Nhà bán chọn nhóm này để hiện quảng cáo.
  5. Quảng cáo giày hiện đúng lúc bạn vừa nhắc đến đôi giày.
- **Nhịp bằng chứng (khoảng 40-50s, 8-10 giây):** nói đúng mức: "Năm 2018, nhóm Northeastern thử 17.260 ứng dụng Android và không thấy ứng dụng nào bí mật gửi âm thanh. Họ không khẳng định không bao giờ, và công cụ có thể sót phần xử lý ngay trên máy. Năm 2024, một công ty quảng cáo quảng bá 'nghe chủ động'. Đó là lời chào bán, chưa phải bằng chứng kỹ thuật." Không gắn hãng lớn vào cáo buộc.
- **Ví dụ cụ thể:** Cáo hôm trước xem clip một người chạy bộ, sau đó mở trang cửa hàng thể thao rồi quên. Tất cả là tình huống dựng.
- **Sai lầm thường gặp:** nhớ lần trùng, quên hàng chục lần quảng cáo không khớp. Người xem cũng dễ nhầm "trùng" với "bằng chứng".
- **Kết (55-65s):** Cáo quay lại đôi giày. Một việc làm được: mở "Tuỳ chọn quảng cáo" của nền tảng và xem mục sở thích mình bị gán. Tên menu mỗi nền tảng khác nhau nên chỉ nói chung. Câu mời bình luận: "Bạn từng gặp cú trùng nào như vậy?" Thêm một câu chốt: "Một lần trùng chưa đủ để biết quảng cáo đến từ đâu."
- **Bản đồ Cáo sơ bộ:** có Cáo ở 0-8s (hook và câu hỏi), một lần ở giữa (bước 3), và ở kết. Mỗi lần rộng 10-18% khung khi đứng cùng minh hoạ.
- **Bối cảnh (≥ 3):** bàn ăn, quán cà phê, màn hình điện thoại giả lập trung tính, nền dữ liệu cho sơ đồ, bàn văn phòng ở kết.
- **Công cụ:** CharacterScene cho hook, UiSimulationScene cho tin nhắn và bảng tin, DataVizScene cho chuỗi 5 bước, ExplainerScene cho nhịp bằng chứng.
- **Ngân sách ≈ 60 giây:**

| Đoạn | Giây |
|---|---|
| Mở và hook | 0-8 |
| Chuỗi 5 bước | 8-38 |
| Bằng chứng | 38-48 |
| Sai lầm thiên kiến | 48-54 |
| Kết, việc làm và mời bình luận | 54-62 |

- **Rủi ro còn lại:** (1) bước 3 và 4 vẫn dựa trên tài liệu cũ, Kịch bản phải kiểm lại; (2) bộ đếm của cửa hàng mới có nguồn thứ cấp, cần mở trang chính thức của Meta; (3) thân bài dễ dày thông tin, nên mỗi bước chỉ một ý.

### Giọng Codex

**Phản hồi Claude**
- **“Ví dụ dựng”** — Nhận. Ghi trong caption và `publish.json`. Header **BẢO MẬT / QUẢNG CÁO** vẫn hiện ngay đầu theo D8.
- **Cả ba concept né câu hỏi về mic** — Nhận. Trả lời ở giây 8, rồi dùng nghiên cứu Northeastern và tài liệu chào bán “Active Listening” để cho thấy mỗi nguồn đủ sức chứng minh điều gì.
- **Concept 1 trả lời quá muộn** — Nhận. Giữ cú trùng đôi giày, đưa kết luận về mic lên trước phần giải thích cơ chế.
- **Concept 2 lệch brief, hook quen và lời giải thích kỹ thuật** — Nhận. Dùng cảnh vừa nhắc đôi giày đã gặp quảng cáo làm hook. Giữ “bộ đếm trên trang cửa hàng” làm ví dụ giữa video.
- **Concept 3 gợi ý nghe lén và dùng chi tiết chưa kiểm** — Nhận. Bỏ cảnh Cáo nghe câu nói rồi làm quảng cáo bật lên, bỏ nhánh suy sở thích từ lượt xem nội dung. Tôi chọn tiếp thị lại qua pixel làm cơ chế duy nhất. Đối sánh danh sách khách hàng đã được kiểm, nhưng thêm vào sẽ khiến người xem phải theo hai chuỗi dữ liệu.

**Bản cải tiến — Đôi giày chưa từng tìm**

**Đối tượng và thông điệp.** Người từng thấy quảng cáo trùng với chuyện vừa nói. Một lần trùng chưa đủ để biết quảng cáo đến từ đâu.

- **0–5s · Mở ba pha.** Một người chỉ cho bạn xem đôi giày, rồi lướt điện thoại và gặp quảng cáo đúng mẫu. Lời mở trong 2 giây đầu: “Vừa nhắc đôi này, quảng cáo đã hiện.” Trước giây 5, chốt hệ quả bằng câu hỏi “Mình chưa tìm đôi này. Điện thoại nghe lén à?”
- **Giây 8 · Trả lời.** “Chưa đủ bằng chứng để nói mic đã nghe lén bạn. Quảng cáo vẫn có thể nhắm tới bạn mà không cần mic.”
- **15–38s · Một cơ chế.** Minh họa một tình huống riêng: bấm vào link cửa hàng để xem giày, dù chưa từng gõ tìm. Bộ đếm trên trang ghi lượt xem sản phẩm, cửa hàng dùng dữ liệu đó để chạy lại quảng cáo cho nhóm đã xem. Sai lầm thường gặp là đánh đồng chưa tìm kiếm với chưa để lại dấu vết.
- **39–50s · Bằng chứng.** Northeastern không thấy bằng chứng ứng dụng bí mật gửi âm thanh trong thử nghiệm Android năm 2018, vốn không đăng nhập vào ứng dụng. Tài liệu “Active Listening” năm 2024 là lời chào bán, chưa xác nhận kỹ thuật.
- **51–60s · Về lại đôi giày.** Hiện lại quảng cáo mở đầu. “Ta dễ nhớ lần trùng, quên lần không trùng. Riêng đôi giày này, chưa đủ dữ kiện để biết quảng cáo đến từ đâu.” Cuối: “Bạn từng gặp cú trùng nào như vậy?”

**Dựng.** Remotion, giao diện trung tính, 9:16 1080×1920. VieNeu giọng Bắc, không nhạc nền. Cáo tĩnh ở mở, giữa và kết, đổi dáng bằng cắt, rộng 10–18% khi cùng minh họa. Bật nhãn AI khi đăng.

**Tóm tắt vòng 2 — dừng sớm vì đồng thuận:** hai giọng cùng chốt tên "Đôi giày chưa từng tìm", cùng hook đôi giày (ví dụ dựng, ghi ở caption), cùng trả lời ở giây 8 ("chưa đủ bằng chứng mic nghe lén; quảng cáo vẫn nhắm được mà không cần mic"), cùng nhịp bằng chứng Northeastern 2018 + "Active Listening" 2024 ở ≈ 39–50 s, cùng ý thiên kiến "nhớ lần trùng", cùng câu mời "Bạn từng gặp cú trùng nào như vậy?". Khác biệt còn lại hẹp: cơ chế chính là **tiếp thị lại qua bộ đếm cửa hàng** (Codex, một chuỗi gọn, nguồn kiểm được) hay **hồ sơ ghép từ hành vi 5 bước** (Claude, có bước "nền tảng suy ra sở thích" dựa nguồn chính thức cũ 2014/2020). Không cần lượt phản biện bản cải tiến riêng: điểm khác biệt đã được hai bên tự lập luận ở trên; giao `ideator-b` phân xử.

---

## Phán quyết cuối

*(ideator-b, Claude chốt cuối; Gemini vắng)*

**Concept chọn:** "Đôi giày chưa từng tìm", bản lai. Cơ chế chính theo Claude: **hồ sơ quảng cáo suy từ hoạt động**. Ví dụ minh hoạ duy nhất theo Codex: **bộ đếm trên trang cửa hàng**. Theo Codex ở ba điểm: một chuỗi gọn, bỏ danh sách khách hàng, bỏ Wi-Fi/IP. Theo Claude ở tên cơ chế.

**Lý do (đã kiểm hook "chưa từng tìm"):**
- Bộ đếm cửa hàng một mình chỉ giải thích được người đã mở trang sản phẩm. Hook lại nói "chưa tìm", nên cơ chế đó dễ thành "hoá ra bạn có mở". Khi đó hook chỉ đúng một nửa.
- Hồ sơ sở thích bao được cả người chưa gõ tìm. Meta nêu công khai rằng quảng cáo dựa trên hoạt động của người dùng và dữ liệu từ nhà quảng cáo/đối tác. Meta cũng công bố mục "Activity from other businesses" ([tin Meta 6/2026](https://about.fb.com/news/2026/06/better-personalization-and-changes-to-controls-for-your-activity-from-other-businesses/)).
- Vì vậy chọn "hồ sơ" làm cơ chế, còn bộ đếm là bước minh hoạ cụ thể. Đó vẫn là MỘT cơ chế, không phải hai chuỗi.
- Giới hạn: không concept nào chứng minh được lý do của một lượt quảng cáo thật. Lời đọc phải nói "có thể", không nói "chính là".
- Đây không phải BẾ TẮC.

**Hook 0–2 s:** Cáo nhìn điện thoại hiện quảng cáo giày: "Vừa nhắc đôi này, quảng cáo đã hiện!" Trước giây 5: "Mình còn chưa tìm nó. Điện thoại nghe lén à?"

**Câu hỏi mở → giây 8:** "Chưa có bằng chứng mic nghe lén bạn. Nhưng quảng cáo vẫn có thể trúng mà không cần mic."

**Cơ chế (8–38 s, mỗi bước một ý):**
1. Bạn xem clip chạy bộ, lướt trang thể thao.
2. Một trang cửa hàng có bộ đếm, ghi lại lượt mở trang. Đây là ví dụ dựng.
3. Nền tảng gộp các dấu vết thành hồ sơ "quan tâm chạy bộ".
4. Nhà bán chọn nhóm này để hiện quảng cáo.
5. Quảng cáo giày hiện ra.

Nói rõ bạn không cần gõ tìm đôi giày đó. Những dấu vết liên quan cũng đủ.

**Nhịp bằng chứng (38–48 s):**
- Năm 2018, nhóm Northeastern thử 17.260 ứng dụng Android và không thấy ứng dụng nào bí mật gửi âm thanh. Họ không khẳng định "không bao giờ", và công cụ có thể sót phần xử lý ngay trên máy.
- Năm 2024, một công ty quảng cáo quảng bá "nghe chủ động". Đó là lời chào bán, chưa phải bằng chứng kỹ thuật.
- Không gắn hãng lớn vào cáo buộc.

**Sai lầm thường gặp (48–54 s):** nhớ lần trùng, quên hàng chục lần không trùng. Và nhầm "trùng" với "bằng chứng".

**Kết (54–62 s):** quay lại đôi giày. Việc làm được: mở phần tuỳ chọn quảng cáo của nền tảng và xem mình bị gán sở thích gì. Tên menu mỗi nơi khác nhau nên chỉ nói chung. Câu chốt: "Một lần trùng chưa đủ để biết quảng cáo đến từ đâu." Câu mời: "Bạn từng gặp cú trùng nào như vậy?"

**Ích lợi đầu tiên:** giây 8, người xem biết mic chưa phải lời giải duy nhất. Giây 54 có việc làm được.

**Bộ câu thoại Cáo:**
- Ủa, mới nhắc đôi này!
- Mình còn chưa tìm nó. Điện thoại nghe lén à? (`think`)
- Khoan! Trùng chưa chắc là bằng chứng. (`surprised`)
- Ối, ai cũng hay nhớ lần trùng thôi. (`bow`)
- Lưu lại kẻo quên nha! (`thumbs_up`)

**Bản đồ Cáo:** mở 0–8 s, một nhịp giữa ở bước 3, kết. Rộng 10–18% khung.

**Kịch bản PHẢI kiểm lại bằng nguồn chính thức:**
1. Trang Meta hiện hành về cách suy ra sở thích và về Pixel/Conversions API. Hiện chỉ có nguồn 2014/2020 và nguồn thứ cấp.
2. Bài Northeastern 2018 (số 17.260, giới hạn của công cụ) và bản thuyết trình 404 Media 2024 (phản ứng của Google và công ty).
3. Câu "quảng cáo có thể nhắm theo nhóm sở thích" ở bước 4.

Lưu ý: Gemini vắng ở Ý tưởng nên chưa có bảng ĐÚNG/SAI; Kịch bản sẽ gọi Gemini kiểm chứng, planner vẫn tự mở nguồn.

**Điều cấm:**
- Không đốt nhãn "ví dụ dựng" hay nhãn AI lên hình. Ghi ở caption và `publish.json`.
- Header BẢO MẬT / QUẢNG CÁO bắt buộc theo D8.
- Không dùng cảnh Cáo "nghe" rồi quảng cáo bật lên.
- Không dùng Wi-Fi/IP, danh sách khách hàng, hay con số tỉ lệ khớp.
- Không khẳng định "chắc chắn không" hoặc "chắc chắn có".

**Bất đồng còn lại:** không đáng kể. Codex muốn thân bài ngắn hơn. Giữ năm bước nhưng mỗi bước một ý, và cho phép gộp bước 4–5 khi Kịch bản vượt thời lượng.
