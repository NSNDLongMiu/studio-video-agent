## Vòng 1 — PHẢN BIỆN concept của Claude và Codex

*(Kiểm chứng: cơ chế clone profile dựa trên thông tin công khai — ảnh đại diện, tên, danh sách bạn bè — đã được xác nhận bởi nhiều nguồn an ninh mạng: Malwarebytes, NordVPN, Bitdefender, AARP. Danh sách bạn bè mặc định có thể là Public và bạn chung vẫn hiện kể cả khi đặt "Only me". Các concept đều đúng về mặt sự kiện.)*

---

### A. Chấm 3 concept của Claude

#### 1. "Bản sao ghép từ ba mảnh" — 8/10

| Tiêu chí | Điểm | Nhận xét |
|---|---|---|
| Hook & giữ chân | 8 | Tin nhắn vay tiền + Cáo ngơ ngác → stakes rõ, hệ quả tiền bạc ngay giây đầu. "Cáo thứ hai" trước giây 5 tạo tò mò tốt. |
| Khớp brief | 9 | Bám rất sát: đúng hook gợi ý trong brief, đúng cơ chế 3 mảnh, đúng 4 việc làm ngay ở kết. |
| Khả thi sản xuất | 8 | UiSimulation + DataViz + Character đều có. Hiệu ứng "ba mảnh bay sang khung trống" dựng được bằng Remotion. |
| An toàn | 7 | Rủi ro "dễ trượt thành hướng dẫn" Claude tự nhận là đúng — cần kiểm soát mức chi tiết ở đoạn giữa. |
| Độc đáo | 6 | Cấu trúc "giải thích cơ chế tuyến tính" khá chuẩn mực, không có twist hoặc góc nhìn bất ngờ. |

**Điểm yếu cụ thể:** Đoạn giữa (15–55s) kể cơ chế + mẫu tin + sai lầm rồi quay lại kết — quá dài cho một mạch đơn tuyến, dễ mất người xem sau giây 20 vì không có điểm neo cảm xúc thứ hai. Khán giả đã "biết đáp án" (ba mảnh) từ giây 15, phần còn lại thiếu lý do ở lại.

**Cách sửa:** Chèn một "escalation beat" khoảng giây 25–30 — ví dụ cho thấy bản giả *không chỉ vay tiền mà có thể giả danh Cáo trong nhóm làm việc/nhóm lớp* (mở rộng hệ quả), tạo đỉnh thứ hai giữ chân.

---

#### 2. "Hai cuộc gọi" — 6/10

| Tiêu chí | Điểm | Nhận xét |
|---|---|---|
| Hook & giữ chân | 7 | "Chuyển hay không?" là câu hỏi quyết định tốt, tạo tương tác tâm lý. |
| Khớp brief | 5 | Cơ chế clone bị đẩy ra giữa-cuối ("vì sao có bản giả"), brief yêu cầu cơ chế là trọng tâm, không phải phụ lục. |
| Khả thi sản xuất | 7 | Hai khung gọi dựng được, nhưng cần thiết kế cẩn thận trên 9:16. |
| An toàn | 8 | Hướng phòng thủ, ít rủi ro thành hướng dẫn. |
| Độc đáo | 7 | Góc "hai cuộc gọi" đối lập khá hay. |

**Điểm yếu cụ thể:** Claude tự nhận — cơ chế bị nén. Nhưng vấn đề sâu hơn: concept lấy **hành động phòng thủ (gọi xác minh)** làm trọng tâm thay vì **cơ chế giả mạo** — vi phạm brief ("giải thích kẻ gian sao chép…"). Video trở thành "mẹo xác minh" thay vì giải thích *tại sao* tài khoản bị giả mạo mà không cần hack.

**Cách sửa:** Đảo cấu trúc — dùng hook "chuyển hay không" nhưng ngay sau đó (giây 5–8) vào cơ chế clone đầy đủ, rồi mới đến "hai cuộc gọi" như minh hoạ cho giải pháp ở kết.

---

#### 3. "Cáo tự kiểm hồ sơ mình" — 7/10

| Tiêu chí | Điểm | Nhận xét |
|---|---|---|
| Hook & giữ chân | 5 | Claude tự nhận: hook ít gắn sự cố cụ thể. Không có stakes (chưa ai mất tiền, chưa có nguy hiểm). "Nếu tôi là người lạ" là câu hỏi trí tuệ, không phải cảm xúc. |
| Khớp brief | 7 | Vẫn nói về 3 mảnh công khai, nhưng thiếu tình huống vay tiền mà brief gợi ý. |
| Khả thi sản xuất | 9 | Dựng đơn giản nhất trong 3 concept: Cáo + hồ sơ + thẻ thông tin. |
| An toàn | 9 | Góc tự kiểm, hoàn toàn phòng thủ. |
| Độc đáo | 7 | Góc "tự audit" tươi mới hơn so với cách kể nạn nhân thông thường. |

**Điểm yếu cụ thể:** Mở đầu thiếu "conflict" — kỷ luật yêu cầu opening ba pha `visual_hook → conflict → topic_reveal`, nhưng Cáo ngồi tự xem hồ sơ mình không có xung đột. Người xem chưa có lý do quan tâm vì chưa thấy hậu quả.

**Cách sửa:** Mở bằng 2 giây sự cố (tin nhắn vay tiền bất ngờ) rồi *ngay lập tức* Cáo quay về kiểm hồ sơ — giữ góc "tự audit" nhưng có stakes từ đầu.

---

### B. Chấm 3 concept của Codex

#### 1. "Hai khung chat, một gương mặt" — 7/10

| Tiêu chí | Điểm | Nhận xét |
|---|---|---|
| Hook & giữ chân | 8 | Hook gần giống Claude #1, có thêm "bạn sắp chuyển tiền" tạo urgency ở giây 4 — tốt. |
| Khớp brief | 8 | Đúng cơ chế, đúng hook brief gợi ý. |
| Khả thi sản xuất | 5 | **Hai khung chat cạnh nhau trên 9:16 (1080×1920)** là vấn đề lớn. Mỗi khung chỉ còn ~500px ngang — chữ chat sẽ bé, không đọc được ở độ phân giải điện thoại. Codex nhận ra nhưng chỉ đề xuất nhãn, chưa giải quyết gốc. |
| An toàn | 7 | Ổn, nhưng hai khung chat chi tiết dễ vô tình tạo "mẫu tin nhắn lừa đảo". |
| Độc đáo | 6 | Cấu trúc rất gần Claude #1, chưa tạo góc nhìn riêng. |

**Điểm yếu cụ thể:** Vấn đề layout là chí mạng. Trên TikTok, hai khung chat ngang 540px mỗi bên sẽ có chữ ~24px — dưới ngưỡng đọc được (brief/kỷ luật yêu cầu nhãn ≥ 56px, chữ khoá ≥ 72px). Concept phụ thuộc vào việc so sánh song song nhưng công cụ không có `ComparisonScene`.

**Cách sửa:** Đổi sang "lật khung" tuần tự (hiện khung chat thật → wipe/slide → hiện khung chat giả) thay vì cạnh nhau. Hoặc dùng zoom vào chi tiết giống/khác tuần tự, vừa vặn 9:16.

---

#### 2. "Biết tên đồng nghiệp" — 7.5/10

| Tiêu chí | Điểm | Nhận xét |
|---|---|---|
| Hook & giữ chân | 7 | "Nó biết cả tên đồng nghiệp mình" — tạo cảm giác rùng mình tốt. Nhưng hook bắt đầu bằng ảnh chụp màn hình *của bạn* gửi — Cáo ở thế bị động, không trực tiếp đối mặt nguy hiểm. |
| Khớp brief | 8 | Tốt — khai thác khía cạnh "danh sách bạn bè công khai → biết vòng quan hệ" mà brief đề cập. |
| Khả thi sản xuất | 7 | Sơ đồ quan hệ hư cấu bằng Explainer dựng được. Nhưng "ảnh chụp tin nhắn" (screenshot trong screenshot) trên 9:16 sẽ rất khó đọc. |
| An toàn | 6 | Codex tự nhận — dễ ngụ ý danh sách bạn bè *luôn* công khai. Thực tế: Facebook cho phép ẩn, nhưng bạn chung (mutual friends) vẫn hiển thị kể cả khi đặt "Only me" ([nguồn: stuhawkins.com, AARP](https://www.aarp.org)). Nếu không nêu rõ điều kiện "nếu để công khai" → gây hoảng sợ sai. |
| Độc đáo | 8 | Góc "biết đồng nghiệp" hay hơn hẳn — đánh vào nỗi sợ "kẻ lạ biết vòng tròn thân" cụ thể hơn "vay tiền chung chung". |

**Điểm yếu cụ thể:** Hook gián tiếp — Cáo nhìn *ảnh chụp* tin nhắn *của bạn*. Hai lớp trung gian (bạn kể lại → Cáo xem) giảm cường độ. Brief gợi ý Cáo *trực tiếp* nhận tin nhắn.

**Cách sửa:** Đổi hook: Cáo nhận tin từ "đồng nghiệp" (thực ra là tài khoản giả) nhắn "Anh ơi, tôi biết anh quen chị Lan phòng kế toán, chuyển giúp tôi…" → Cáo giật mình vì sao nó biết — trực tiếp hơn, và tự nhiên dẫn sang cơ chế.

---

#### 3. "Một cuộc gọi, hai câu trả lời" — 5.5/10

| Tiêu chí | Điểm | Nhận xét |
|---|---|---|
| Hook & giữ chân | 5 | "Cáo bắt máy, bạn hỏi tiền chuyển vào đâu" — Codex tự nhận giống cuộc gọi công việc. Thiếu twist rõ, khán giả chưa thấy tại sao phải xem tiếp. |
| Khớp brief | 6 | Cơ chế clone có nhưng bắt đầu từ giây 8, hook 0–5s chưa rõ vấn đề giả mạo. |
| Khả thi sản xuất | 6 | "Cuộc gọi" khó minh hoạ bằng hình tĩnh 9:16. Character + Explainer dựng được nhưng cảnh gọi điện thiếu chiều sâu thị giác (chỉ có Cáo + điện thoại). |
| An toàn | 8 | An toàn, hướng phòng thủ. |
| Độc đáo | 5 | Rất gần Claude #2 "Hai cuộc gọi" — cùng ý tưởng gọi xác minh, chỉ khác góc kể. |

**Điểm yếu cụ thể:** Trùng ý với Claude #2 và yếu hơn — Claude có cấu trúc "hai cuộc gọi đối lập" rõ ràng hơn, Codex chỉ có "một cuộc gọi" rồi giải thích. Concept này không mang lại góc nhìn mới nào so với tổng thể 6 concept.

**Cách sửa:** Nếu giữ, cần hook mạnh hơn hẳn — ví dụ: Cáo bắt máy nghe bạn nói "Cám ơn, tao đã chuyển rồi" (hậu quả đã xảy ra, không thể đảo ngược) → stakes cao hơn nhiều.

---

### Tổng hợp xếp hạng

| Hạng | Concept | Tổng /50 | Ghi chú |
|---|---|---|---|
| 1 | Claude #1 "Ba mảnh" | **38** | Hoàn chỉnh nhất, bám brief chặt; cần thêm beat giữa |
| 2 | Codex #2 "Biết tên đồng nghiệp" | **36.5** | Góc độc đáo nhất; cần sửa hook trực tiếp hơn |
| 3 | Claude #3 "Tự kiểm hồ sơ" | **37** | Góc hay nhưng hook yếu; ghép sự cố vào đầu là đủ |
| 4 | Codex #1 "Hai khung chat" | **34** | Layout 9:16 chưa giải quyết được |
| 5 | Claude #2 "Hai cuộc gọi" | **33** | Cơ chế bị phụ hoá |
| 6 | Codex #3 "Một cuộc gọi" | **30.5** | Trùng ý, hook yếu |

**Gợi ý lai:** Claude #1 (cấu trúc + hook) + Codex #2 (góc "biết đồng nghiệp" làm escalation beat ở giây 25–30) sẽ cho bản mạnh nhất — hook bằng tin vay tiền, cơ chế 3 mảnh, rồi escalate bằng "nó còn biết cả vòng quan hệ của bạn" trước khi vào giải pháp.