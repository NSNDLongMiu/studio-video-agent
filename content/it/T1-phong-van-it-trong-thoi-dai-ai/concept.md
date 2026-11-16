# Concept — T1 "Cáo đi phỏng vấn: vị trí IT thời AI"

- Đội: IT · Đội 1 (team_id 1) · Video: IT-T1-E01, IT-T1-E02
- Định dạng: 2 tập × ~4 phút (mục tiêu 4:00–4:10 mỗi tập). **Ngoại lệ có chủ đích** theo brief của giám đốc (chuẩn xưởng là 15–45s).
- Nguồn quyết định: `brief.md` + `debate.md` (A đề xuất, B phản biện, 2 vòng). Phán quyết cuối của B (10 điều kiện + bảng sửa độ chính xác) đã được áp dụng toàn bộ.

## 1. Concept được chốt
**"Cáo đi phỏng vấn: vị trí IT thời AI."** Cáo ngồi ghế ứng viên một buổi phỏng vấn thử vị trí IT. Người phỏng vấn hỏi 6 câu về nghề IT giữa làn sóng AI. Mỗi câu Cáo **đáp dở trước, tự sửa thành đáp ổn**, rồi cuối tập 2 Cáo **đảo vai, hỏi ngược** công ty. Xương sống nội dung: **ranh giới "việc nên giao cho AI" và "việc người phải giữ"**.

Hai nghĩa của chữ "phỏng vấn" cùng có mặt: (1) buổi xin việc (khung kịch tính), (2) cuộc trò chuyện thực tế về nghề (phần ruột).

### Vì sao chọn
- Brief đòi định dạng phỏng vấn/trò chuyện, góc nhìn thực tế, không giật tít. Khung "đáp dở rồi đáp ổn" cho một khoảnh khắc thị giác rõ ở mỗi chương, chống 4 phút ảnh tĩnh.
- Làm được 100% bằng công cụ hiện có: ffmpeg, 46 dáng Cáo, thẻ chữ/khung chat, TTS 2 giọng (VieNeu, chờ giám đốc chốt giọng).
- Đảo vai ở tập 2 cho phép nói thẳng "AI không phải để sợ, cũng không phải để thờ" mà không cần giật tít.

## 2. Điểm bất đồng giữa A và B, cách xử lý
| Điểm | A | B | Quyết định của planner |
|---|---|---|---|
| Số nhân vật | 3 rồi rút còn 2 | 2 | **2 nhân vật, 2 giọng** (cả hai đã đồng ý ở vòng 2). Không có vai Tech Lead. |
| Câu mở cuối tập 1 ("Tập sau") | Giữ một câu mở nhẹ | Nghiêng về bỏ; chấp nhận nếu theo điều kiện 8 | **Mặc định giữ**, nhưng đặt ở **thẻ cuối** (sau câu chốt "AI viết nhanh, người đọc lại và chịu trách nhiệm"), không chiếm phần kết luận. Tập 2 **trả lời trực tiếp ngay chương 0–2** (điều kiện 8). Nếu giám đốc đăng 2 tập cùng lúc hoặc gộp 1 video: **bỏ** dòng teaser (đã đánh dấu `[TEASER]` trong `ep01/script.md`). |
| Độ dài 4 phút | Giữ | Tối đa chấp nhận được; nếu giữ chân kém thì rút 3 phút | **Giữ ~4 phút**, nhưng dựng theo chương để có thể cắt 2 nửa ~2 phút hoặc rút 3 phút sau này (xem `plan.md`). |
| "Level/điểm số" | Bỏ làm lý do giữ chân | Đồng ý nếu chỉ trang trí nhẹ | **Chỉ dùng thanh chương nhỏ** ("Câu 1/6") làm trang trí, không tính điểm. |
| Ba điểm B yêu cầu sửa độ chính xác | Nhận | — | Đã áp dụng đúng chữ (T1-C2, T1-C3, T1-C4, T2-C3, T2-C1/C2, T2-C4). |

## 3. Khán giả
Người mới vào nghề IT, sinh viên/học viên IT, người chuyển nghề sang IT, và dân văn phòng tò mò "AI có đụng vào nghề này không". Người xem lướt mạng, đa số tắt tiếng -> phụ đề đốt cứng bắt buộc.

## 4. Nhân vật và giọng (đúng 2 nhân vật, 2 giọng — cả 2 đều giọng Bắc, đã bỏ yêu cầu giọng Nam ngày 17/11/2026)
| Nhãn trên màn hình | Là ai | Giọng | Khung/biểu tượng |
|---|---|---|---|
| **Chị Phỏng vấn** | Nhân vật hư cấu, không có hình người. Chỉ hiện dưới dạng khung chat xanh + biểu tượng bút ghi | **Đã chốt: Quỳnh Anh** (Nữ · Bắc), `temperature=0.65`, tăng tốc 8% (`atempo=1.08`). Xem `docs/voice.md` | Khung xanh `#2F6FDE`, biểu tượng bút |
| **Cáo (ứng viên)** | Cáo văn phòng trong vai ứng viên, trả lời câu hỏi | **Đã chốt: Minh Đức** (Nam · Bắc — giọng chính thức của kênh), cùng thông số `temperature=0.65` + tăng tốc 8% | Khung cam `#F28C28` |
| **Cáo (dẫn)** | Cáo nói thẳng với người xem (hook, chú thích, chốt). Cùng giọng Cáo (ứng viên) | **Minh Đức** (như trên) | Không khung; phụ đề trắng, chữ thường |

Quy ước xưng hô (theo `docs/mascot.md`, không dùng "em/anh/chị" khi nói):
- Cáo xưng **"mình"** hoặc **"Cáo"**, gọi người xem là **"bạn"**. Chị Phỏng vấn cũng gọi Cáo là "bạn", tự xưng "mình".
- "Chị Phỏng vấn" chỉ là **nhãn vai trên màn hình** (theo debate). **Cáo không bao giờ nói "chị"**; nhắc tới người phỏng vấn thì nói "bên phỏng vấn". Nếu giám đốc thấy nhãn này vướng, đổi thành "Người phỏng vấn" (sửa một chỗ trong template).
- Cáo không nhép miệng: lời thoại luôn kèm phụ đề + thẻ tên người nói, Cáo chỉ đổi dáng và nhún theo tiếng. **Đừng viết hay dựng cảnh cần nhìn miệng nói.**

## 5. Giọng điệu
- Thân thiện, trẻ trung, chữ văn phòng vừa đủ ("note lại", "chốt đơn", "họp"). Câu ngắn ≤ ~12 từ, một ý một câu.
- **Không chê nghề, không mỉa người học, không dùng giọng "sợ AI thay thế"**, không tít giật. Hài tự giễu nhẹ.
- Câu cửa miệng: **Bộ A "Họp nhanh"** theo `docs/mascot.md`, chỉnh cho video dài: mở "Alo alo! Cáo văn phòng đây!", chốt "Chốt đơn!", kêu gọi "Thả tim cho Cáo, coi như duyệt báo cáo nha!". Câu "họp nhanh 30 giây" bị bỏ vì không hợp 4 phút. **Đã chốt (17/11/2026):** giám đốc cho phép đổi/trộn bộ câu chào theo từng video (Bộ B là điểm neo mặc định cho video mới, không bắt buộc) — dùng Bộ A ở video này là lựa chọn có chủ đích, không còn là bản tạm.

## 6. Lời hứa của series
> "Bốn phút để bạn biết: dùng AI thế nào cho ổn, việc nào người vẫn phải giữ, và hỏi gì khi đi phỏng vấn. Không dọa, không thổi phồng."

## 7. Quy tắc sự thật và nhãn hư cấu/AI (bắt buộc, QC sẽ kiểm)
1. **Không số liệu, không tên công ty.** Toàn bộ nội dung là nguyên tắc định tính. Cấm "x% công ty yêu cầu...". Nếu sau này muốn thêm số liệu: phải có nguồn + năm hiển thị trên màn hình và ghi ở cuối `script.md`.
2. **Hai cột phân loại** ở mọi thẻ chốt:
   - **"Khá chắc chắn"**: chỉ chứa điều đúng ở hầu hết nơi. Không chắc thì chuyển sang "Tuỳ công ty".
   - **"Tuỳ công ty"**.
   - Kèm ghi chú nhỏ cố định: *"Nhận định chung, không phải tư vấn pháp lý hay chính sách công ty bạn."* — **có mặt ở cả hai tập**.
3. **Cấm dùng từ "pháp lý" hay "bắt buộc phải" cho điều tuỳ công ty** (trừ chính câu ghi chú miễn trừ ở mục 2, là chỗ duy nhất được phép nhắc chữ "pháp lý").
4. **Nhãn hư cấu 3 lớp:** (a) huy hiệu cố định ở góc suốt video: "Tình huống minh hoạ · không phải tuyển dụng thật"; (b) thẻ mở 2 giây: "Nhân vật và công ty trong video là hư cấu."; (c) thẻ cuối nhắc lại.
5. **Nhãn AI luôn bật:** thẻ cuối có câu `ai_disclosure`; mô tả luôn kết thúc bằng câu khai báo AI; giám đốc bật tuỳ chọn khai báo AI của nền tảng khi đăng.
6. **Mã minh hoạ** trên màn hình là đoạn giả (pseudo-code) tự viết, ghi nhãn "Code minh hoạ"; không dùng đoạn mã thật của dự án/công ty nào.
7. Câu trả lời của "Chị Phỏng vấn" về công ty hư cấu (tập 2, đảo vai) có chú thích "câu trả lời của nhân vật, chỉ để minh hoạ"; không trình bày như thực tế ngành.
8. Lời khuyên "hỏi ngược công ty" kèm lưu ý: tuỳ không khí buổi phỏng vấn, hỏi lịch sự, đúng lúc.
9. Danh sách việc AI làm tốt có dòng: *"AI đang thay đổi nhanh, danh sách này có thể đổi theo thời gian."*

## 8. Ràng buộc thời lượng và nơi đăng — **CHƯA KIỂM CHỨNG CHÍNH THỨC**
> Chỉ là giả định lấy từ nguồn thứ cấp ở vòng tranh luận (Headliner, Socialync, Sprout Social) và hiểu biết của B. **Giám đốc cần kiểm lại trên trang trợ giúp chính thức của từng nền tảng trước khi đăng.**

| Nền tảng | Giả định trần thời lượng (chưa kiểm chứng) | Hệ quả |
|---|---|---|
| YouTube Shorts | ~3 phút | Bản 4 phút **không** thành Short -> đăng bản dài như video thường, hoặc 2 nửa ~2 phút làm Shorts |
| Facebook Reels | nguồn nói lệch: 90 giây / 3 phút / không giới hạn tuỳ cách đăng | Bản 4 phút có thể không thành Reel; nửa ~2 phút cũng có thể vượt nếu trần là 90 giây -> phương án dự phòng: rút từng nửa còn <= 90s (xem `plan.md` mục 4.3) |
| TikTok | thường ~10 phút (giám đốc cần kiểm) | Đăng được bản 4 phút nguyên vẹn |

Vì vậy **mỗi tập được dựng ra 3 bản**: **bản dài (~4:00)**, **nửa 1 (~2:00)**, **nửa 2 (~2:00)**. Điểm cắt là giữa chương 2 và chương 3. Xem `plan.md`.

## 9. Tám–mười mẫu cảnh dùng lại (module)
Không làm 30–45 cảnh riêng mỗi tập; gom thành 10 mẫu, Codex dựng sẵn mỗi mẫu một lần rồi điền chữ/hình. Chi tiết kỹ thuật ở `plan.md` mục 5.

| Mã | Tên | Dùng để | Khoảnh khắc thị giác |
|---|---|---|---|
| **M0** | Thẻ nhãn | Thẻ mở "hư cấu" 2s và thẻ cuối (nhãn + AI) | Thẻ chữ động, huy hiệu bật |
| **M1** | Thẻ câu hỏi | Mở chương: "Câu N/6" + câu hỏi lớn (kinetic text) | Chữ rơi vào + âm "tách" |
| **M2** | Khung chat | Hội thoại Chị (xanh, trái) và Cáo (cam, phải) | Bong bóng chat xuất hiện từng câu |
| **M3** | Đáp dở -> đáp ổn | Tem đỏ "Đáp dở" rồi tem xanh "Đáp ổn" lên khung chat | Tích đỏ rồi tích xanh |
| **M4** | Code giả | Đoạn pseudo-code có dòng bị tô, chú thích | Tô sáng dòng + ghi chú nổi |
| **M5** | Che bí mật | Ô nhập có mật khẩu bị vạch đen che, biểu tượng khoá | Vạch đen quét qua chữ |
| **M6** | Thẻ hai cột | "Khá chắc chắn / Tuỳ công ty" hoặc "Giao cho AI / Người giữ" | Hai cột hiện từng dòng |
| **M7** | Danh sách/ghi chú | 1–4 gạch đầu dòng hiện từng dòng (ghi chú nhanh, tóm tắt, ba điều rút ra) | Gạch đầu dòng bật lần lượt |
| **M8** | Đảo vai | Cáo đứng dậy; khung hỏi đổi bên (cam hỏi, xanh đáp) | Khung đổi bên trái-phải |
| **M9** | Thẻ chốt | Câu chốt tập, "Chốt đơn!", kêu gọi, teaser | Chữ lớn đóng khung |

## 10. Nhãn tập
- **IT-T1-E01:** "Code AI viết sai. Lỗi của ai?" — dùng AI an toàn, đọc code AI, bảo mật nhập môn, trách nhiệm.
- **IT-T1-E02:** "Khi AI làm được nhiều việc, công ty cần mình làm gì?" — việc AI làm tốt, việc người giữ, kỹ năng đáng giữ, hỏi ngược công ty.
