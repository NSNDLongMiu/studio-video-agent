# Review kịch bản vòng 1 — IT-T5-E01 «Chia rồi, vẫn đầy?»

Người review: Claude (planner). Đã đọc: brief.md, debate.md (Phán quyết cuối), concept.md, plan.md, ep01/script.md, docs/chat-luong-xem.md, mascot.md, voice.md, asset-sources.md, platform-specs.md. Không đọc T3/T4.

## Kiểm chứng kỹ thuật (đối chiếu tài liệu chính thức)

| Ý trong kịch bản | Kết quả | Nguồn |
|---|---|---|
| Partition không nén, không xoá | ĐÚNG. Trang PostgreSQL 5.12 không nói partition tiết kiệm hay nén dung lượng. MySQL cũng không nói partition nén hay tự xoá dữ liệu | PG 5.12; MySQL 8.4 Partitioning Overview |
| Pruning chỉ «có thể bỏ qua» | ĐÚNG. MySQL mô tả «excludes any remaining partitions», tức là có điều kiện `WHERE` trên khoá chia. Kịch bản giữ «có thể», không hứa «nhanh hơn» | PG 5.12.4; MySQL |
| Archive không phải lệnh SQL chuẩn chung | ĐÚNG. Cả hai tài liệu không có lệnh «archive». Cách làm là DETACH/DROP, sao lưu bằng COPY/pg_dump | PG 5.12.2.2 |
| Thứ tự sao chép → kiểm → xoá | ĐÚNG. PG nói có thể tách rồi sao lưu bằng COPY/pg_dump trước khi DROP | PG 5.12.2.2 |
| Khoá khi tách | ĐÚNG. DETACH thường cần `ACCESS EXCLUSIVE` trên bảng cha. `CONCURRENTLY` chỉ cần `SHARE UPDATE EXCLUSIVE` trên bảng cha, vẫn `ACCESS EXCLUSIVE` trên phân vùng ở pha cuối. Không chạy trong khối giao dịch và không dùng khi có phân vùng mặc định | PG ALTER TABLE |
| Tách xong khay thành bảng độc lập, chưa giải phóng chỗ | ĐÚNG. «continues to exist as a standalone table». Vạch chỉ hạ sau DROP là chính xác | PG ALTER TABLE |
| Vạch dung lượng chỉ ở kho chính và chỉ hạ sau khi bỏ bản | ĐẠT trong script (S05–S07 và quy tắc minh hoạ) | — |

Không có số liệu thật nào cần kiểm thêm. Mọi số, tháng, đơn đều gắn nhãn «Ví dụ dựng». Lời nói chỉ nêu PostgreSQL một lần (Lời 16), phần còn lại ở mức khái niệm chung. Hợp lệ với việc chưa kiểm sâu MySQL.

## Tự đếm lại ngân sách
- Đếm lại 19 lời: 4+5+4+5+8+7+7+5+5+7+4+11+7+5+4+9+6+5+7 = **115 âm tiết**, khớp bản Codex. Cộng nghỉ = 11,75 s và đọc = 27,41 s, tổng 39,86 s, khớp số học.
- Phần chưa thực tế: mốc cơ sở 4,25 âm tiết/s là giả định chưa đo với Minh Đức. Voice.md không có số đo. Dư 5,1 s so với trần 45 s là đủ đệm, nhưng sau các sửa đổi bên dưới tổng sẽ tăng khoảng 2,5–3 s (còn ≈ 42,5–43 s), vượt mục tiêu 38–42 s. Phải lập lại bảng (xem điểm 7).
- Y7: Lời 17 («Cất kho, kiểm xong mới xoá.») chỉ nghỉ 0,60 s, Lời 11→12 chuyển nội dung chỉ 0,40 s, Lời 18 0,40 s. Các nhịp này thấp hơn dải Y7 (xem điểm 6).
- Y6: nhãn `[kỹ thuật]` 0,97 và `[dẫn]` 1,03/1,00 đúng hướng dẫn.

## Bảng chấm

| # | Tiêu chí | Kết quả | Lý do |
|---|---|---|---|
| 1 | Bám phán quyết | ĐẠT | Đúng hook «Chia rồi, vẫn đầy?», câu hỏi mở, đáp án ~22 s (trước 25 s), có pruning, sao chép → kiểm → xoá, khoá, vạch chỉ hạ sau khi bỏ bản. Không câu chào cố định. «Nơi lưu trữ khác» thay vì «bảng lưu riêng» đúng bất đồng đã chốt |
| 2 | Giữ chân (Y5) | ĐẠT, kèm sửa nhỏ | Mạch Storytelling–Problem–Explanation–Solution rõ. Hình nghịch lý trong 2 giây đầu, hệ quả «đơn chưa lưu được» ở 1,91–3,06 s, tò mò trước giây 5 (vạch gắn đường ghi). Kết trả đúng vấn đề đã mở, kêu gọi «Bạn từng tra đơn cũ ở đâu?» tự nhiên. Điểm yếu: hai khái niệm chủ đề chưa được nối rõ với hình (điểm 1, 2) |
| 3 | Đủ chi tiết cho Producer | CHƯA ĐẠT | Cấu trúc cột/lời tốt, đủ nhãn `[dẫn]`/`[kỹ thuật]`, bảng thuật ngữ, ngân sách, bản đồ Cáo 31%, nền office→incident→database, bảng nghĩa màu, chip R7. Chưa đạt vì S06 dồn chữ (điểm 4) và nhịp nghỉ Y7 ở ba chỗ (điểm 6) |
| 4 | Chính xác | CHƯA ĐẠT (nhẹ) | Kỹ thuật đúng. Nhưng thông điệp «Archive không phải lệnh SQL chuẩn» chỉ nằm ở nhãn 1,85 s chứ chưa ở lời (điểm 3), và «Tra thử» chưa khớp với bước kiểm đủ lô (điểm 5) |
| 5 | Làm được & an toàn | ĐẠT | Chỉ dùng Pillow/FFmpeg, nền make_background, Segoe UI/Consolas, hiệu ứng tự tạo, dáng `surprised`/`point_up`/`thumbs_up` đều có trong `brand/cao/poses/`. Không nhạc. Mô tả cả ba nền tảng kết bằng câu khai báo AI, 4 hashtag mỗi nền tảng |
| 6 | Văn phong | ĐẠT, kèm sửa nhỏ | Cáo xưng «mình», gọi «bạn», câu ngắn ≤ 12 từ. Có hai chỗ gây khó hiểu cho người mới (điểm 1, 2) |

## Góp ý đánh số

**Phải sửa (làm vòng 2):**

1. **Trùng nghĩa chữ «khoá» (ep01/script.md, Lời 5, Lời 6, Lời 16, cột chữ S06).** «khoá» vừa là khoá chia (Lời 5, 6: «chia các dòng theo khoá», «khoá là ngày tạo đơn») vừa là khoá bảng (Lời 16: «cần khoá để tách khay»; nhãn «Giảm khoá bảng cha»). Người mới học SQL dễ nhầm trong 25 giây. Sửa: Lời 5 → «Partition chia các dòng theo một cột.»; Lời 6 → «Ở đây, cột đó là ngày tạo đơn.»; Lời 16 → «PostgreSQL cần khoá bảng để tách khay.» Cập nhật lại nhãn «Ngày tạo» (vẫn ổn), «Khoá chia» trong phần mô tả hình ảnh S02 và chữ «Khoá» trong cột chữ S06. Chép lại cho nhất quán ở concept.md/plan.md nếu có.
2. **Chưa nối từ «partition» với hình «khay» (Lời 5–8).** Từ Partition chỉ xuất hiện một lần ở Lời 5, sau đó chỉ nói «khay». Người xem mới không biết «khay» chính là partition, trong khi đề tài là Archive và Partition. Sửa: Lời 8 → «Mỗi khay là một partition, chung một bảng.» (11 âm tiết). Phải thêm «partition» vào mô tả hình ở S02 (nhịp 14,28–16,15: một lần đối chiếu từ). Bảng thuật ngữ vẫn chỉ cần tính theo số lần đọc thật.
3. **Archive «không phải lệnh SQL chuẩn» chưa vào lời (Lời 13, S05).** Hiện chỉ có nhãn «Tuỳ hệ quản trị» 1,85 s. Phán quyết cuối và brief coi đây là điểm bắt buộc. Sửa: Lời 13 → «Archive không phải lệnh, mà là quy trình lưu trữ.» (11 âm tiết). Giữ nhãn «Tuỳ hệ quản trị» làm bằng chứng hình.
4. **S06 (31,38–33,97 s) quá nhiều chữ và chữ vượt lời.** Ba nhóm cùng lúc trong khoảng 2,6 s: «CONCURRENTLY», «Giảm khoá bảng cha», «Có giới hạn», trong khi lời chỉ nói «cần khoá để tách khay». «Có giới hạn» không nói giới hạn gì nên vô nghĩa với người xem. Trái ý Y1 («chỉ khi thật cần»). Sửa: chỉ giữ một nhãn «Khoá bảng» (hoặc «Khoá tạm») ở nhịp đầu. Nếu muốn nhắc tuỳ chọn giảm khoá thì thêm vào lời một ý ngắn và để đúng hai nhóm chữ («CONCURRENTLY» + «Giảm khoá bảng cha»), bỏ «Có giới hạn». Hạn chế còn lại để ở bảng nguồn.
5. **Lời 15 «Tra thử bản sao.» (S05).** Hình dùng dấu ✓ chỉ sau khi đối chiếu đủ lô, còn lời nói «tra thử» (nghe như kiểm một dòng) nên lệch với Lời 17 «kiểm xong mới xoá». Sửa: «Kiểm đủ bản sao.» (cùng 4 âm tiết).
6. **Y7 — ba chỗ nghỉ thấp hơn dải.** (a) Lời 17 (ý quan trọng, kết quy trình) nghỉ tổng 0,60 s → nâng lên 0,8 s, hình giữ nhịp nhả khoá và vạch hạ. (b) Lời 11 → Lời 12 là chuyển nội dung nhưng nghỉ 0,40 s → nâng lên 0,8 s. (c) Lời 18 «Đơn cũ vẫn tra được.» (ý chốt) nghỉ 0,40 s → 0,7 s. Ghi ngoại lệ nếu giữ thấp hơn.
7. **Lập lại bảng ngân sách (plan.md và script.md).** Sau điểm 1–6, tổng dự kiến ≈ 42,5–43 s. Giữ trần 45 s và không tăng tốc giọng. Hãy: (a) ghi mục tiêu thực tế (ví dụ ≤ 43 s) hoặc (b) rút để về ≤ 42 s bằng cách bỏ Lời 4 («Mỗi đơn là một dòng.») hoặc thu gọn Lời 9 («Mình đếm lại, đủ hết.»), theo dự phòng đã viết trong plan. Ghi rõ rằng mốc 4,25 âm tiết/s là giả định chờ đo TTS. Đồng bộ lại các mốc giây và đuôi 0,70 s ở dòng cuối.

**Nên sửa (không bắt buộc, kèm điểm trên):**

8. TikTok (script.md, Nội dung đăng): «Partition giúp truy vấn bỏ qua khay ngoài kỳ» → «Partition có thể giúp truy vấn bỏ qua phần ngoài kỳ» để tránh lời hứa chắc chắn. Thêm «(ví dụ dựng)» vì đơn/kho là dựng. Facebook và YouTube đã có chữ tương đương.
9. Lời 12: «Query» đọc bằng thuật ngữ chưa được giải thích. Cân nhắc «Truy vấn (query) lọc theo tháng…» ở lần đầu (theo mascot.md: luôn giải thích từ chuyên ngành) nếu còn dư giây.
10. Lời 1 «Chia rồi, vẫn đầy?» chưa có chủ ngữ. Đã chốt theo debate nên giữ, nhưng nhớ Lời 2–3 (đơn chưa lưu, nhìn vạch kho) là chỗ nối nghĩa, không cắt hai câu này khi rút phạm vi.
11. concept.md dòng cuối: câu «Kho lưu trong ví dụ ở trên vùng lưu trữ riêng» khó hiểu, nên đổi thành «Kho lưu trong ví dụ là một nơi lưu trữ khác, tách khỏi kho chính».
12. Cáo mặt ở Lời 10–11 cùng dáng `point_up` suốt 4,3 s đúng quy tắc ≥ 2 s. Giữ. Đáp lời bản đồ Cáo: 12,52 s / 39,86 s = 31%. Số này sẽ đổi nhẹ sau điểm 7, nên cập nhật.

## Ghi chú còn lại
- Phát âm PostgreSQL «pốt-grét kiu eo» và các mục khác để CHƯA KIỂM — giám đốc nghe, đúng quy trình.
- Không cần thêm nguồn ngoài; nên thêm nguồn MySQL cho câu «partition pruning» nếu muốn khẳng định chung, nhưng lời hiện chỉ ở mức khái niệm nên không bắt buộc.

KẾT LUẬN: CẦN SỬA
