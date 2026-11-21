# Review kịch bản IT-T8-E01 · vòng 1 (Claude duyệt)

Đã đọc: concept/plan/ep01/script.md, debate.md (Phán quyết cuối), chuẩn Y1–Y8, R1–R12.

## Bảng chấm

| # | Tiêu chí | Kết quả | Lý do |
|---|---|---|---|
| 1 | Bám phán quyết | Đạt | Đúng concept "Đường đi của bản sao", hook "Hồ sơ khách vừa dán, bản sao đã ra ngoài." + "Chat lọt ra bằng cách nào?", đủ 5 nền A/E/B/C/D, mỗi nền ≤ 2 lần, không nêu Microsoft. |
| 2 | Giữ chân | Đạt | Lời 01 ở 0,00 s đi cùng hình hồ sơ nhân đôi; hệ quả (máy chủ nhận) ở 4,00 s; trả câu hỏi bằng hình ở 13,00 s. Mạch Storytelling, Problem, Explanation, Solution rõ. 10 cảnh, trung bình 4,19 s/cảnh. R11: mỗi cảnh có "Bằng chứng hình" là sự kiện; trạng thái hồ sơ đổi nhiều lần (ở chat, bản sao rời đi, máy chủ nhận, nhánh đỏ, bản cũ còn ở khay, giữ ngoài chat); có đối chiếu đúng/sai ở cảnh 05 và trước/sau ở cảnh 02 và 08. |
| 3 | Đủ chi tiết cho Producer | Đạt | Cột/lời đủ; chữ UI có lý do; plan không có mục "Chữ bắt buộc tuân thủ"; không nhãn «AI tạo»/«Ví dụ dựng» trên hình ("ví dụ dựng" chỉ ở caption); bản đồ Cáo mở/giữa/kết (14,12 s, 33,7%, 216 px = 20%, kết 302 px ≈ 1,45× nguồn); bộ nền, nghĩa màu, bìa hook có. Bảng thuật ngữ Y8 và nhãn [dẫn]/[kỹ thuật], nhịp nghỉ Y7 có. |
| 4 | Chính xác | Đạt | WebSearch 19/11/2026: OX Security, Hacker News, SecurityWeek, TechRepublic khớp: 2 tiện ích, hơn 900 nghìn người dùng, gửi nội dung chat và URL các tab về máy chủ khoảng 30 phút/lần, một bản (hơn 600 nghìn) có huy hiệu Featured, cả hai đã bị gỡ khỏi cửa hàng. Cách nói hedge ở cảnh 08 ("có thể còn bên ngoài") đúng mức. |
| 5 | Làm được và an toàn | Đạt | Chỉ Pillow/FFmpeg/pose Cáo/nền xưởng/VieNeu-TTS; không nhạc nền; có câu khai báo AI cuối mỗi mô tả và `ai_generated_content: true`. |
| 6 | Văn phong | Đạt | Câu ngắn, tiếng Việt chuẩn, giọng Cáo nhẹ, CTA tự nhiên. |

## Kiểm lại ngân sách (đếm độc lập)

Đếm âm tiết từng lời: L01 10, L02 5+2 (chat tính 2) = 7 (cộng 17); L03 7; L04 7 + L05 5 = 12; L06 13 (có "chat" = 2); L07 9; L08 11 + L09 5 = 16; L10 6 + L11 5 = 11; L12 4 + L13 7 = 11; L14 10; L15 5 + L16 8 + L17 5 = 18. Tổng **124**, khớp. Đọc 30,83 s; cộng từng khoảng nghỉ theo cảnh cho 10,57 s (khớp với bảng); đuôi 0,50 s. Tổng **41,90 s**, khớp. Chuỗi mốc lời dựng lại (3,08 / 5,53 / 8,03 / 10,12 / 12,14 / 16,29 / 19,41 / 23,04 / 24,98 ...) khớp với biên cảnh. Con số đúng nhưng chỉ cách trần 42 s khoảng 0,1 s, trong khi trần cứng 45 s còn 3,1 s dư. Chấp nhận, vì kịch bản đã ghi dự phòng rút lời 02/06 và đo lại sau TTS.

## Góp ý (không bắt buộc sửa ở vòng này)

1. **script.md, cảnh 02, lời 03 "Có vụ hàng trăm nghìn người cài."**: nguồn nói "lượt cài / người dùng" cộng dồn hai tiện ích, còn phần Đối chiếu đã tự dặn tránh suy ra số người duy nhất. Nên đổi "người cài" thành "lượt cài" (cùng 2 âm tiết, không đổi ngân sách).
2. **Cảnh 03, chữ UI**: "Miễn phí" là chi tiết dựng, không có trong báo cáo; cùng "Trợ lý AI" và "Featured" thành 3 nhóm chữ cạnh phụ đề, dễ dày. Đề nghị bỏ "Miễn phí", giữ "Trợ lý AI" và "Featured".
3. **Cảnh 03, lời 05 "Một bản có huy hiệu."**: câu chưa nói ý nghĩa; người xem có thể hiểu huy hiệu là dấu hiệu lạ hoặc ngược lại là dấu an toàn. Đạo diễn hình ảnh nên cho thấy đúng thẻ có huy hiệu vẫn là thẻ bị chọn, và/hoặc khi sửa ở vòng sau nếu còn ngân sách thì thêm vài chữ ("vẫn đội lốt") hoặc dựa vào lời 15. Chỉ làm nếu không đẩy tổng quá 42 s.
4. **Cảnh 09, lời 14 "khóa"**: đứng một mình dễ hiểu nhầm (khóa cửa/khóa học). Nếu Codex còn chỗ ngân sách, đổi "khóa" thành "khóa truy cập" (+2 âm tiết, khoảng 0,5 s) hoặc để hình thẻ chìa gánh nghĩa như hiện nay. Producer nghe clip TTS rồi quyết.
5. **Y2**: Cáo ẩn liên tục khoảng 19,6 s (cảnh 05 đến 09). Vẫn đạt vì là cảnh giải thích sâu, nhưng nếu bản dựng thấy trống, cho Cáo xuất hiện nhỏ (15–20%) ở cảnh 07 hoặc 09, theo hành vi R6, bằng cách đổi bản đồ Cáo mà không sửa lời.
6. **Cảnh 04, chữ UI "Đọc và thay đổi dữ liệu trên mọi trang"** (7 từ): giữ vì là nguyên văn quyền và khớp lời 06, nhưng Producer phải ép ≤ 2 dòng, cỡ ≥ 56 px, không đè lên đầu Cáo và đầu tay chỉ.
7. **Rủi ro mốc**: tổng chỉ cách ngưỡng 0,1 s; nếu TTS của Minh Đức chậm hơn 1% thì chạm mục tiêu 42 s. Khi đo lại, ưu tiên rút lời 09 hoặc rút nghỉ cảnh 06 trước khi đụng các câu của Cáo.

## Ghi chú

Không có lỗi nặng. Các góp ý nhỏ có thể xử lý ở Đạo diễn hình ảnh hoặc ở TTS; không cần vòng sửa kịch bản.

KẾT LUẬN: DUYỆT
