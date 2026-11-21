# Review kịch bản vòng 1 · IT-T14-E01 (Claude)

Đã đối chiếu `debate.md` (Phán quyết cuối), `plan.md`, `ep01/script.md`. Kiểm nguồn bằng WebSearch: OX Security / TechRepublic / The Hacker News xác nhận hai tiện ích, tổng hơn 900.000 lượt tải (một bản ~600.000 có huy hiệu Featured), gửi hội thoại và URL các tab mỗi 30 phút. Số 900.000 là tổng lượt tải, script chỉ nói "hàng trăm nghìn người cài" là đúng.

## Bảng chấm

| # | Tiêu chí | Kết quả | Lý do |
|---|---|---|---|
| 1 | Bám phán quyết | Đạt | Đúng tên, opening, hook hậu quả, trả lời ở 60/78/135/168 s, ba phạm vi quyền, huy hiệu chỉ là một cảnh, màn chia đôi duy nhất ở S21. |
| 2 | Giữ chân | Chưa đạt nhẹ | Mạch Storytelling → Problem → Explanation → Solution rõ; R11, R13, R15, R14 cơ bản đủ. Hai điểm yếu: S03 (hook chết 4 s), Cáo vắng 97 s liền (xem góp ý 1, 6). |
| 3 | Đủ chi tiết cho Producer | Chưa đạt | Ô "Hình ảnh" nhiều câu mơ hồ/tự mâu thuẫn, nhãn L02/L03 sai, mô tả Y6 chưa khớp hệ số tốc độ (góp ý 3, 4). Bản đồ ngữ nghĩa, thuật ngữ, ngân sách (tổng 179,65 s, đuôi 0,60 s, 27 cảnh, TB 6,65 s) đạt. |
| 4 | Chính xác | Đạt kèm sửa nhỏ | Số liệu khớp nguồn. Cần giới hạn rõ "trong vụ đó" ở S08 và S14 (góp ý 2). |
| 5 | Làm được & an toàn | Đạt | Giao diện hình học, không logo/ảnh thật, không tên thương hiệu giả mạo, không nhãn trên hình, có khai báo AI ở ba mô tả. |
| 6 | Văn phong | Đạt | Cáo xưng "mình", câu ngắn, không chào cố định. |

## Góp ý (đánh số)

1. **S03 (5,35–9,70 s), lời 03 + 04.** Hai câu liên tiếp chỉ là chú thích ("Đây là ví dụ mình dựng." + "Bảng giá trong hình là dữ liệu mẫu.") làm 4 s trống giữa hệ quả (4,15 s) và câu hỏi (10,40 s). Gộp thành một câu ≤ 6 âm tiết, ví dụ "Đây là ví dụ mình dựng, dữ liệu mẫu.", hoặc chuyển phần "dữ liệu mẫu" sang caption. Dời câu hỏi S04 lên sớm hơn (mục tiêu ≤ 8 s), phần thời gian dư trả cho S05–S08. Cập nhật lại ngân sách, mốc lời và bảng "Mốc lời".
2. **Phạm vi "vụ được báo cáo".** S14 lời 28 ("Máy chủ nhận cả nội dung chat lẫn địa chỉ các tab.") đọc như quy luật chung; thêm "Trong vụ đó," hoặc "Ở vụ này,". S08 lời 13 thêm "trong vụ đó" (ví dụ "Trong vụ đó, một tiện ích có huy hiệu Featured."). Kiểm tương tự S13 lời 26, câu đó đúng chung nên giữ.
3. **Ô "Hình ảnh/đồ hoạ" và "Âm thanh" cần gọn, đúng tham chiếu.** Ví dụ: S01 ("Toàn từ trên bàn. lời 01, con trỏ dán… khung chat đẩy tới gần") câu cụt; S06 ("Cho lớp nội bộ cài vào bảng trọn khối"); S19 cột âm thanh ghi "dưới L02… Sau L03" trong khi cảnh có lời 38–40 (sửa thành lời 39/lời 40); S20 "Hai vật giữ tuần tự cùng trục, không chia đôi khung" mơ hồ. Viết lại các ô này bằng câu hoàn chỉnh, một dòng cho mỗi tín hiệu theo lời để Producer/Visual đọc được, bỏ từ thừa kiểu "nhịp giữ", "tuần tự".
4. **Y6 / tốc độ.** Ngân sách dùng 4,25–4,40 âm tiết/s, nhưng tiêu chí nghiệm thu ở `plan.md` đòi đo 4,6–4,8 âm tiết/s có tiếng. Thêm một câu vào mục Ngân sách (script và plan) nêu rõ 4,25–4,40 là tốc độ hiệu chỉnh đã gồm `atempo` 1,10–1,15 (hay không), và cách quy đổi sang dải 4,6–4,8 đo bằng `qc-measure`, để Producer không rút ngắn tổng thời lượng ngoài 150–190 s.
5. **S18 và S19 liền kề.** Lời 37 "Mình thử ngay trên tab chat này." rồi S19 lời 38 "Tab này vẫn có bảng giá." lặp ý. Gộp lời 38 vào lời 39 hoặc đổi thành vế có thông tin mới (ví dụ "Bảng giá đang hiện ngay trong tab.").
6. **Cáo (Y2).** Cáo vắng từ 5,35 s đến 43 s và từ 45 s đến 142 s (~97 s liền). Thêm một nhịp Cáo ngắn 2–3 s ở S19 (dáng `think` hoặc `surprised`, 108–194 px, hành vi nhìn tab bị cấp quyền) để trả nhịp sau chuỗi cơ chế; cập nhật Bản đồ Cáo ở `plan.md` và giữ tổng ≤ 18%.

Ghi chú không bắt buộc: S11 lời 22 đang nêu "Tiện ích xấu" ngay sau lời 21 mô tả chung, nên thêm "nếu là" ("Nếu là tiện ích xấu, nó có thể sao chép…") cho khỏi gợi mọi tiện ích đều xấu.

KẾT LUẬN: CẦN SỬA
