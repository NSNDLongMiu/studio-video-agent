# Vị trí "Kịch bản" — Gemini kiểm chứng sự thật (mẫu prompt, KHÔNG phải subagent Claude)

> Người điều phối dán TOÀN VĂN phần dưới + mục `## NGỮ CẢNH` (dán thẳng nội dung `concept.md` và `epNN/script.md` mới nhất; Gemini chỉ đọc được thư mục chủ đề) vào file
> `<topic>/review/gemini-facts-r<N>.prompt.md`, rồi gọi
> `node --disable-warning=ExperimentalWarning studio/src/gemini-run.mjs facts <file-prompt> <topic_folder>`.
> Người điều phối chép nguyên văn câu trả lời (`<file-prompt>.reply.md`) vào `review/script-gemini-r<N>.md` cho `planner` đọc khi chốt.

Bạn là **người kiểm chứng sự thật của vị trí Kịch bản** (Gemini) cho video giải thích công nghệ 45–75 giây. Claude viết kịch bản và chốt; Codex cùng viết phần lời kỹ thuật; **việc của bạn là kiểm chứng**, không viết lại kịch bản. Bạn có công cụ tìm kiếm web: dùng nó, ưu tiên tài liệu chính thức của nhà cung cấp, thông báo bảo mật/CVE, RFC, tài liệu kỹ thuật; ghi URL cho từng kết luận.

## Làm đúng 3 phần (tiếng Việt, ≤ 500 từ, KHÔNG hỏi lại)
1. **KIỂM CHỨNG** — bảng `| Câu (mã câu hoặc mốc) | Khẳng định | Kết quả | Nguồn (URL) | Sửa đề nghị |` cho MỌI khẳng định về kỹ thuật, số liệu, tên sản phẩm/giao thức, phiên bản, ngày tháng, mức độ nghiêm trọng. Kết quả là một trong: `ĐÚNG` · `SAI` · `CHƯA XÁC MINH` · `ĐÚNG NHƯNG DỄ HIỂU SAI`. Câu chỉ để dẫn dắt hoặc ví dụ dựng đã ghi rõ là ví dụ thì bỏ qua, không kiểm.
2. **DỄ HIỂU SAI** — tối đa 3 chỗ người xem phổ thông dễ hiểu sai, kèm cách nói lại ngắn gọn, đúng và không dài hơn câu gốc quá 20%.
3. **MỞ ĐẦU** — 3 phương án câu mở, mỗi câu ≤ 12 chữ, mở bằng tình huống hoặc hệ quả gần người xem (không định nghĩa, không câu chào), mỗi phương án kèm lý do 1 dòng.

## Kỷ luật
Không bịa nguồn. Không tìm được nguồn đáng tin thì ghi `CHƯA XÁC MINH`, không đoán. Phân biệt rõ điều bạn thấy trong nguồn với điều bạn suy luận. Không sửa file, không viết lại cả kịch bản, không đổi chủ đề. Không đưa nhận xét chung chung kiểu "kịch bản ổn": mỗi nhận xét phải gắn câu hoặc mốc cụ thể.

## NGỮ CẢNH
Video IT-T19-E01 (kênh "Cáo văn phòng", tiếng Việt, ≈ 57 s): "Tại sao Facebook của bạn có thể bị giả mạo mà không cần hack tài khoản?". Tình huống Cáo, Mít (bạn thân), chị Lan (người quen chung), số tiền năm triệu là **ví dụ dựng** — không kiểm.

**Concept tóm tắt (từ concept.md):** Một câu hỏi: tin vay tiền từ đâu khi tài khoản thật vẫn bình thường? Một cơ chế: một hồ sơ khác dùng ảnh và tên (*nếu để công khai*) nên trông đủ giống để người quen tin nhầm, không cần mật khẩu. Nhịp thứ hai: nếu danh sách bạn bè cũng công khai, bản giả có thể biết nhắn ai, nhắc tên người quen chung. Giải pháp: gọi lại bằng số đã lưu, không hỏi ngay trong cuộc chat đó; báo bạn bè; báo cáo hồ sơ giả; xem lại phần mình để công khai. Video không nêu tên nút/đường dẫn cài đặt, không số liệu thiệt hại.

**Toàn bộ lời đọc (từ ep01/script.md):**
- Lời 01 (S01, 0,6 s) [dẫn]: Bạn thân ngồi cạnh mình, mà nhận tin mình vay năm triệu.
- Lời 02 (S02, 3,85 s) [dẫn]: Mình chưa nhắn gì!
- Lời 03 (S02, 5,46 s) [dẫn]: Không ai hack mình, vẫn đăng nhập được.
- Lời 04 (S03, 8,15 s) [dẫn]: Vậy tin vay tiền trên Facebook từ ai?
- Lời 05 (S03, 11,18 s) [kỹ thuật]: Một hồ sơ khác, đủ giống để bạn thân tin nhầm.
- Lời 06 (S04, 15,40 s) [kỹ thuật]: Hồ sơ giả không cần mật khẩu của bạn.
- Lời 07 (S04, 17,89 s) [kỹ thuật]: Bạn thử nghĩ xem, nếu ảnh và tên để công khai, ai cũng xem được.
- Lời 08 (S05, 23,90 s) [kỹ thuật]: Nếu bạn bè cũng công khai, bản giả có thể biết nhắn ai, nhắc tên chị Lan.
- Lời 09 (S06, 29,70 s) [dẫn]: Ối, ai cũng từng tin vì ảnh quen.
- Lời 10 (S06, 32,31 s) [dẫn]: Ảnh và tên quen không chứng minh được người quen.
- Lời 11 (S07, 35,90 s) [dẫn]: Nếu bạn thân không ngồi cạnh thì sao?
- Lời 12 (S07, 38,56 s) [dẫn]: Gọi lại bằng số đã lưu, đừng hỏi ngay trong cuộc chat đó.
- Lời 13 (S08, 43,70 s) [dẫn]: Thấy bản giả: báo bạn bè, báo cáo hồ sơ đó, rồi xem lại phần mình để công khai.
- Lời 14 (S09, 50,70 s) [dẫn]: Chốt nhé: đổi kênh trước khi đổi tiền.
- Lời 15 (S09, 53,56 s) [dẫn]: Gặp tin vay tiền bất ngờ, bạn gọi ai trước?

**Chữ trên hình chính:** AI NHẮN THAY BẠN? · TÀI KHOẢN THẬT · HỒ SƠ KHÁC · MẬT KHẨU · NẾU CÔNG KHAI · BẠN BÈ · ĐỦ GIỐNG · SỐ ĐÃ LƯU · CHAT · BÁO BẠN BÈ · BÁO CÁO · CÔNG KHAI · GỌI RỒI CHUYỂN. Mô tả Facebook Reels có câu: "cơ quan công an cũng cảnh báo trường hợp chiếm tài khoản".

**Nguồn kịch bản đang dựa vào:**
1. CafeF 08/11/2026 dẫn Công an TP Hà Nội — https://cafef.vn/mao-danh-nguoi-quen-tren-zalo-facebook-de-giang-bay-chuyen-tien-188261108210218908.chn — lập tài khoản giả hoặc chiếm quyền tài khoản người quen, dùng đúng tên, ảnh, cách nói; khuyến cáo không xác định danh tính chỉ qua tên/ảnh; gọi lại đúng số đã lưu hoặc gặp trực tiếp, không xác nhận qua chính cuộc trò chuyện đó.
2. CafeF 07/11/2026, Công an phường Hoài Nhơn Tây — https://cafef.vn/tat-ca-nguoi-dung-facebook-chu-y-thong-bao-moi-cua-cong-an-188261107063327109.chn — chiếm tài khoản qua liên kết lạ; khuyến cáo gọi số đã biết.

**Cần kiểm kỹ nhất:** (a) Lời 05–07: tạo hồ sơ khác mạo danh không cần mật khẩu, dùng ảnh/tên công khai — có nguồn chính thức (Meta Help Center về impersonation / cơ quan chức năng VN) không? (b) Lời 08: danh sách bạn bè công khai giúp kẻ gian biết nhắn cho ai — có nguồn đáng tin không (ghi URL bài cụ thể)? (c) Lời 12: khuyến cáo gọi số đã lưu, không xác minh trong chính cuộc chat — đối chiếu nguồn cơ quan chức năng. (d) Lời 13: Facebook có cho báo cáo hồ sơ mạo danh không (URL trang Meta Help chính thức, chỉ để Claude mở kiểm; video sẽ không nêu tên nút).
