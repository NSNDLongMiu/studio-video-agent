# Review kịch bản IT-T9-E01 · vòng 1 (Claude duyệt)

Giả định chấm: theo chuẩn hiện hành (video giải thích sâu 150–190 s, D1–D7, Y1–Y8, R1–R19). Brief cũ "≤ 12 cảnh / một khái niệm" không áp dụng; 27 cảnh và hai cảnh 16 s là quyết định của Phán quyết cuối nên không bắt bỏ.

## Bảng chấm

| # | Tiêu chí | Kết quả | Lý do ngắn |
|---|---|---|---|
| 1 | Bám phán quyết | Đạt | Tiêu đề opening, hook "Tổng đúng. File đã gửi.", dòng ẩn ~60 s, chốt ~170 s, bộ đếm 0, 27 cảnh, Cáo ≈20,3% đều đúng. Không còn nhãn "Ví dụ dựng" trên hình. |
| 2 | Giữ chân / chiều sâu | Đạt có điều kiện | Mạch Storytelling → Problem → Explanation → Solution rõ. Hook có hệ quả trong 3 s. R11, R13, R14, R15 có. Ba chỗ lặp ý (điểm 2) và câu trả lời đầu chỉ đến ở 60 s. |
| 3 | Đủ chi tiết cho Producer | Chưa đạt (nhẹ) | Số học ngân sách khớp (534 âm tiết, 123,91 s đọc, 55,44 s nghỉ, 179,50 s; các mốc cảnh cộng đúng). Nhưng biên so với trần 180 s chỉ 0,50 s (điểm 1) và từ vựng plugin/công cụ chưa nối (điểm 3). |
| 4 | Chính xác | Đạt có điều kiện | Đã kiểm: OWASP MCP03 (có "Hidden or zero-width characters" ở Detection Indicators), OWASP Cheat Sheet (Rug Pull, mục 1 Least Privilege, mục 2 Tool Description & Schema Integrity), Trail of Bits (TOFU pinning, mô tả đổi thì chặn đến khi duyệt) đều khớp. PDF CSA không đọc được qua công cụ nên các số mục §3.2, §8.2–8.3 chưa xác nhận được (điểm 4). |
| 5 | Làm được & an toàn | Đạt | Chỉ hình học, text engine, VieNeu, nguồn trong asset-sources. Khối che đặc, không lộ chữ chỉ dẫn, không tên hãng. Có câu khai báo AI và "(ví dụ dựng)" trong mô tả. |
| 6 | Văn phong | Đạt | Giọng Cáo ngắn, thân thiện; không lộ chữ thừa trên hình; chữ trên màn hình là nhãn/số, không chép lời. |

## Góp ý đánh số

**Bắt buộc sửa**

1. **Biên thời lượng quá mỏng** (`plan.md` mục Ngân sách + `script.md` bảng ngân sách, S27). Tổng 179,50 s so với trần Shorts 180 s, còn 0,50 s. TTS thật lệch 1–2% là vượt, và Y6 lại yêu cầu đọc nhanh hơn nên thời lượng cuối khó dự đoán. Rút tổng xuống khoảng 170–174 s (còn ≥ 6 s dư) bằng cách giữ nguyên 27 cảnh nhưng cắt ngắn các cảnh lặp ở điểm 2. Cập nhật mốc tuyệt đối, cột Mốc voice, ngân sách ở cả `plan.md` và `script.md`, bảng nhịp trong tiêu chí nghiệm thu ("trung bình ≈ 6,65 s/cảnh", "179,50 s") và mô tả Nhịp đồng bộ.

2. **Ba chỗ nhắc lại cùng một ý, kéo câu trả lời đầu tới tận 60 s** (Information Pacing, tiêu chí 2).
   - S05–S07 (17–35 s, 18 s): ba cảnh kể lại mở → gửi → nhận, trong khi hook S01–S03 đã cho thấy file tới khay ngoài. Gộp S05–S06 thành một nhịp ngắn hoặc cắt S05/S06 xuống 4,5 s và S07 xuống 4,5 s (giảm khoảng 4–5 s). Giữ ba thẻ log vì đó là bằng chứng R11, chỉ bớt nghỉ và câu lặp ("File của phòng bạn có góc khuyết này").
   - S14 (86,5–93 s): "Phép cộng vẫn đúng / file đã ra ngoài" lặp lại S01 và S06 L14. Rút còn 5 s hoặc nhập ý vào cuối S13 như một mốc nhìn lại, giữ cặp ô số 5 và khay.
   - S19 (130–136 s) nhắc lại S16–S18. Rút còn 5 s, giữ hai câu "chỉ nhìn phần hiện / chỉ duyệt một lần".
   Mục tiêu là đưa mốc "dòng ẩn" từ 60 s xuống khoảng 52–55 s mà vẫn trả đủ ở S11 và S26; ghi lại mốc mới ở phần mở của `script.md` và mục Chiều sâu của `plan.md`.

3. **Từ vựng plugin / công cụ chưa nối với người xem** (L10, L22, L31 và tiêu đề opening). Opening và hook nói "plugin AI", nhưng lời đọc từ S04 đến S11 chỉ nói "công cụ", chữ "plugin" lần đầu vang lên ở L31 (74,9 s). Người xem dân văn phòng có thể không biết hai từ là một. Sửa L22: "Mỗi công cụ, hay plugin, có phần mô tả công dụng." (cập nhật âm tiết, cửa sổ voice, bảng thuật ngữ `plugin` thêm S10 L22). Từ đó dùng thống nhất một từ.

4. **Nguồn CSA chưa kiểm chứng được** (`script.md` mục Đối chiếu, dòng S15–S19 và S24–S26; đoạn cuối). Cả hai nguồn gốc của CSA đều là báo cáo có hỗ trợ AI, chưa duyệt chính thức, và số mục §3.2, §8.2–8.3 không xác nhận được. Hoặc (a) bỏ CSA khỏi hai dòng đó và dựa vào OWASP Cheat Sheet (đã kiểm: Rug Pull, mục 1 và mục 2) cùng Trail of Bits, hoặc (b) giữ lại nhưng ghi rõ `[CHƯA KIỂM — PDF không trích được văn bản]` cạnh từng số mục. Khẳng định "chặn gửi khiến file dừng" ở S24–S26 là phép dựng tập, không cần nguồn ngoài, chỉ cần nguồn cho nguyên tắc quyền tối thiểu (OWASP mục 1 là đủ).

**Nên sửa (không chặn duyệt nếu đã làm 1–4)**

5. **Câu "Đây là ví dụ dựng." (L05, S02).** Hợp lệ vì nằm trong lời chứ không phải nhãn hình, nhưng tốn 1,1 s của đoạn hook dày nhất. Có thể chuyển hẳn sang phần mô tả đăng nếu cần thêm nhịp; không bắt buộc.

6. **Nhịp nghỉ dài ở các cảnh High** (S12 nghỉ giữa lời 1,40 s; S11 tổng nghỉ 5,62 s, S16 5,15 s). Chấp nhận được nhờ chuyển động có đích, nhưng toàn tập nghỉ 55,44 s (31%). Khi TTS thật đọc 4,6–4,8 âm tiết/s (Y6) phần nghỉ sẽ lớn thêm khoảng 8–10 s. Khi sửa điểm 1–2, đừng để mọi khoảng đó dư ra thành tĩnh; Producer cần đo độ tĩnh theo `qc-measure` như tiêu chí nghiệm thu đã nêu.

7. **Hai nhãn chữ trùng nghĩa ở S16** («Bản lưu», «Đang nạp») cùng 4 phần tử hình trong 16 s: giữ, nhưng nhắc Đạo diễn hình ảnh kiểm 360×640 vì cảnh này là điểm dễ tải quá nhất tập.

## Phần đã kiểm tốt (để Codex giữ)
- Mốc voice cộng đúng từng cảnh (lời cuối + giữ sau lời = hết cảnh) ở cả 27 cảnh.
- Cáo: 36,50 s / 179,50 s ≈ 20,3%, đủ mở, giữa, kết, cách nhau ≥ 2 s, ẩn ở các cảnh kỹ thuật sâu.
- Bản đồ ngữ nghĩa đủ 67 lời, keyword cần chữ ít và gắn vật; không biến cảnh thành slide chữ.
- Bằng chứng hình R11: có sự kiện chứng minh, có cặp trước/sau (S15–S16, S25), trạng thái sự cố đổi ≥ 3 lần và trả đúng ở S26.
- Bảng thuật ngữ & cách đọc, xử lý chữ "ai" so với "AI", nhãn [dẫn]/[kỹ thuật] đầy đủ.

KẾT LUẬN: CẦN SỬA
