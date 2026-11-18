# Review Kịch bản — vòng 1 (N = 1) — IT-T3-E01 "Archive và Partition trong SQL là gì?"

- Người review: Claude (`planner`, vị trí Kịch bản). Người viết: Codex.
- Đã đọc: `brief.md`, `debate.md` (mục "Phán quyết cuối" và "Bắt buộc cho Kịch bản và Đạo diễn hình ảnh"), `concept.md`, `plan.md`, `ep01/script.md`, `docs/mascot.md`, `docs/asset-sources.md`, `docs/platform-specs.md`, `docs/voice.md`; đã mở xem ảnh `think/present_hand/point_left/point_right/point_up/clipboard` trong `brand/cao/poses/`.
- Đã kiểm nguồn (WebFetch, 18/11/2026): PostgreSQL "Table Partitioning", MySQL 8.0 "Partition Pruning", hai trang IBM Optim ở [N3] (đều mở được, nội dung khớp điều Codex nêu). Chi tiết ở mục "Kiểm chính xác".

## Bảng chấm 6 tiêu chí

| # | Tiêu chí | Kết quả | Lý do ngắn |
|---|---|---|---|
| 1 | Bám phán quyết | **Đạt** | Hook nguyên văn "Bảng lớn: chia ra hay chuyển bớt?", SQL hiện giây 0, hai nhãn "Chia ra" / "Chuyển dữ liệu cũ", có dự phòng 2,2 giây. Tám nhịp đúng mốc 0/3/9/14/18/24/28/32/39. Bộ thoại khớp 9 câu của phán quyết (chỉ tách câu, thêm "Là chia bảng thành nhiều phần", "Nơi lưu tuỳ hệ thống", đổi "Note lại…" thành "Mình chốt…": đều được phép vì phán quyết ghi "Script được chỉnh chữ"). Không có quiz, giọng nữ, ẩn dụ tủ, chip index, cú pháp SQL giả; không có chữ "dọn", "luôn nhanh hơn", "vẫn tra cứu dễ" trong lời/hình (đã grep). |
| 2 | Giữ chân | **Đạt** | Hook là câu hỏi mở, được trả lời ở giây 32–39 ("hai việc khác nhau, dùng chung"). 39 giây nằm trong 15–45; 3+6+5+4+6+4+4+7 = 39 khớp. Cuối chốt đúng câu hỏi hook; không có lời kêu gọi riêng (xem ghi chú G7, không bắt buộc). |
| 3 | Đủ chi tiết cho Producer | **Đạt có điều kiện** | Bảng cảnh đủ 6 cột; chữ/lời viết đúng từng chữ; tên dáng đều có file thật; vị trí/cỡ Cáo, phụ đề, loudness, nghiệm thu đo được. Cần sửa G2 (hướng chỉ tay của Cáo) và làm rõ G5 (chỗ đặt nhãn). |
| 4 | Chính xác | **Chưa đạt** (1 lỗi, sửa nhỏ) | Cảnh 4 vẽ "T2, T4, T7, T9, T11 sáng, 7 ô còn lại mờ" khi lọc cột KHÁC cột chia: trái với điều kiện pruning (xem G1). Mọi chỗ khác đã đối chiếu nguồn: đúng. |
| 5 | Làm được & an toàn | **Đạt** | Chỉ đồ hoạ tự tạo (ffmpeg/Node/Python) + 7 dáng Cáo có sẵn + Segoe UI + VieNeu Minh Đức; không nhạc, không logo hãng, không ảnh ngoài. Mô tả cả ba nền tảng kết thúc đúng câu "Video có dùng hình ảnh và giọng đọc do AI tạo."; YouTube: nguồn đặt trước câu AI. |
| 6 | Văn phong | **Đạt** | Xưng "mình"/"bạn", câu ngắn, "sếp", "chốt" vừa đủ, không lóng thừa; tiếng Việt chuẩn; thuật ngữ được giải nghĩa ở lần đầu ("Partition, tức phân vùng. Là chia bảng thành nhiều phần."; "Archive, tức lưu trữ. Dữ liệu cũ, ít dùng sang nơi riêng."). |

## Kiểm tra theo yêu cầu điều phối

**(1) Hook và lời đọc so với phán quyết.** Khớp (xem hàng 1 ở trên). Lời hook 7 tiếng, ước 1,6–1,8 giây: vừa mục tiêu 2 giây.

**(2) Đúng kỹ thuật.**
- Pruning chỉ khi lọc đúng cột chia: lời cảnh 3 đúng ("Lọc đúng cột chia. Máy có thể bỏ qua phần khác."). PostgreSQL: loại phần khi điều kiện `WHERE` chứng minh được phần đó không chứa dòng khớp, dựa trên khoá phân vùng, "không phải do index". MySQL: áp dụng khi điều kiện rút được về `cột_chia = hằng`/`IN`/khoảng. **Hình cảnh 4 sai** (G1).
- "Có thể bỏ qua", không "luôn/sẽ nhanh hơn": đạt. Mô tả/bình luận ghim có kèm "bảng rất lớn", "quá nhiều phân vùng làm lập kế hoạch chậm" đúng văn bản PostgreSQL ("These benefits will normally be worthwhile only when a table would otherwise be very large"; "Too many partitions can mean longer query planning times…").
- Archive là cách quản lý, không phải lệnh SQL chuẩn, nơi lưu tuỳ hệ thống, "Vẫn giữ lại": đạt. Hai trang IBM Optim ở [N3] mở được; nội dung đúng là "chọn hàng, lưu vào file lưu trữ, có thể xoá khỏi bảng nguồn", và là một triển khai cụ thể (script cũng ghi như vậy, không suy rộng). `DETACH PARTITION` ở [N1] có thật.
- Không chữ "dọn", không cú pháp SQL giả: đạt.
- Giải nghĩa "phân vùng" và "lưu trữ" lần đầu: đạt.

**(3) Độ dài câu, số, cách đọc.** Mọi câu ≤ 12 từ (dài nhất 9 từ). Số trong lời viết bằng chữ ("mười một"); số trên hình (12/12, 9, 3, T11) chỉ là nhãn, không đọc. Cách đọc SQL/Partition/Archive có ghi, nhưng xem G4.

**(4) Thời lượng.** Tổng 39 giây, khớp. Ước lượng thời gian đọc (đếm âm tiết, giả định 4,5–5,5 âm tiết/giây sau `atempo 1.08`, nghỉ ~0,3 giây giữa các câu; chỉ là ước lượng, chưa đo TTS):

| Cảnh | Khung | Âm tiết | Ước tính đọc | Vừa khung? |
|---|---|---:|---|---|
| 1 hook | 3 s | 7 | 1,3–1,6 s | Vừa; < 2 s |
| 2 Partition | 6 s | 25 | 4,6–6,2 s (3 câu, 2 chỗ nghỉ) | **Sát nhất, có thể vượt ở tốc độ chậm** (G3) |
| 3 lọc đúng cột | 5 s | 16 | 3,2–4,2 s | Thoải mái |
| 4 lọc cột khác | 4 s | 9 | 1,6–2,0 s | Thoải mái |
| 5 Archive | 6 s | 18 | 3,3–4,3 s | Thoải mái |
| 6 còn lại | 4 s | 8 | 1,5–2,1 s | Thoải mái |
| 7 cách quản lý | 4 s | 14 | 2,5–3,4 s | Vừa |
| 8 kết | 7 s | 19 | 3,5–4,8 s | Thoải mái, còn dư để giữ hình kết |

**(5) Cáo.** Bảy tên dáng `think`, `present_hand`, `point_left`, `shrug`, `point_right`, `clipboard`, `thumbs_up` đều có file trong `brand/cao/poses/`; `present_hand` thay cho `point_present` (là mã animation, không phải tên dáng) là quyết định đúng. Sáu lần đổi dáng (giây 3, 9, 14, 18, 28, 32), khoảng cách giữa các lần đổi 4–10 giây (≥ 2 s), ≤ 7 lần; Cáo 300 px ≤ 330 px ảnh gốc (không phóng), hiện 100% thời lượng (≥ 60%). Lỗi: `point_left` ở cảnh 3 (G2).

**(6) Vùng an toàn, âm thanh.** Chữ trong x=90–990, y=250–1500; bảng x=100–690 và hộp lưu trữ x=730–980; phụ đề y=1000–1140 (cách đáy 780 ≥ 420); Cáo y=1190–1490 (cách đáy 430); nhãn "Có dùng AI" y=1460–1500 (trong vùng). Mọi nhãn ≤ 4 từ (đã đếm từng nhãn). Không nhạc nền, một giọng Minh Đức, loudness/true peak đúng `platform-specs.md`.

**(7) Metadata.** TikTok 4 hashtag, Facebook 4, YouTube 5 (có `#Shorts`); tiêu đề YouTube khoảng 56 ký tự (≤ 100); cả ba mô tả kết thúc đúng câu khai báo AI; `ai_generated_content=true`. Đạt.

**(8) Cần giám đốc cung cấp.** Không có mục này và đúng: nguyên liệu đã kiểm có đủ.

**(9) Producer đọc có dựng được không.** Dựng được, ngoại trừ các chỗ mơ hồ đã ghi ở G1, G2, G5.

## Danh sách góp ý (đánh số)

### Bắt buộc sửa

**G1. Cảnh 4 vẽ sai điều kiện pruning (`ep01/script.md` bảng cảnh dòng 14–18 s, cột "Hình ảnh/đồ hoạ"; `plan.md` mục "Phong cách hình ảnh" gạch đầu dòng "Tô sáng T11…"; `plan.md` tiêu chí nghiệm thu số 6).**
- Hiện tại: "Nhiều ô sáng cùng lúc, chẳng hạn T2, T4, T7, T9, T11; không kết luận lúc nào cũng đọc mọi ô."
- Vì sao sai: khi lọc theo cột KHÔNG phải cột chia, trình tối ưu không có căn cứ để loại phần nào (cả PostgreSQL lẫn MySQL chỉ loại phần khi điều kiện ràng buộc cột chia). Hình 5 ô sáng / 7 ô mờ cho người xem thấy "lọc cột khác vẫn bỏ qua được 7 phần", làm hỏng đúng bài học của cảnh 3 và vi phạm yêu cầu bắt buộc "Pruning chỉ khi lọc đúng cột chia".
- Sửa: cảnh 4 cho **cả mười hai ô sáng cùng lúc, không ô nào mờ**; xoá danh sách "T2, T4, T7, T9, T11" và xoá câu "không kết luận lúc nào cũng đọc mọi ô". Giữ nguyên lời "Lọc cột khác, có thể vẫn đọc nhiều phần." và hai chip "Có thể vẫn đọc" + "nhiều phần" (chữ "có thể" vẫn cần vì hệ thống khác nhau; vẫn không in chữ "tất cả/mọi/luôn"). Sửa đồng bộ: `plan.md` gạch đầu dòng "Lọc cột khác làm nhiều ô sáng đồng thời" → "Lọc cột khác làm cả mười hai ô sáng đồng thời"; tiêu chí nghiệm thu 6 thêm "ở cảnh lọc cột khác, không ô nào bị làm mờ". (Phán quyết ghi "nhiều ô sáng": 12/12 không trái phán quyết.)

**G2. Cảnh 3 (`script.md` dòng 9–14 s, cột Cáo; `plan.md` mục "Cáo và chuyển cảnh" và bảng "Nguyên liệu").**
- Hiện tại: `point_left`. Cáo đứng góc **trái** dưới (x=90–360), ảnh `point_left.png` chỉ về **bên trái màn hình** (đã xem ảnh) tức chỉ ra ngoài khung, trong đúng cảnh quan trọng nhất (T11 sáng nằm phía trên bên phải Cáo). `mascot.md` yêu cầu "Dáng khớp nội dung".
- Sửa: đổi sang `point_up` (có thật: `brand/cao/poses/point_up.png`, ngón tay giơ lên, thân hơi xoay sang phải; hợp với "chú ý chỗ này"). Cập nhật mọi chỗ nhắc: dãy dáng ở `plan.md` ("`think` → `present_hand` → `point_up` → …"), dòng "Bảy dáng Cáo" ở bảng Nguyên liệu (`point_left.png` → `point_up.png`), ô Cáo cảnh 3 trong `script.md`. Giữ nguyên mốc đổi dáng, số lần đổi (6) và các dáng còn lại (`present_hand`, `point_right` đã hướng về phía sơ đồ; hai dáng này tốt).

### Nên sửa (không chặn duyệt nếu Codex có lý do chính đáng)

**G3. Cảnh 2 sát khung giờ nhất (`script.md` dòng 3–9 s; `plan.md` mục "Rủi ro & dự phòng").** 25 âm tiết trong 6 giây gồm 3 câu; ở tốc độ đọc chậm có thể vượt ~0,2 giây. `plan.md` đã cấm tự đổi mốc, nên hãy ghi sẵn phương án được phép để Producer không kẹt: "Nếu lời cảnh 2 dài hơn 5,8 giây sau xử lý, cho dời mốc 9 giây sang tối đa 10 giây bằng cách lấy từ cảnh 3 (cảnh 3 chỉ cần khoảng 3,2–4,2 giây); cảnh 3 còn tối thiểu 4 giây; dời cả mốc đổi dáng 9 giây tương ứng; tổng vẫn 39 giây." Không cần đổi lời.

**G4. Bảng cách đọc (`script.md` mục "Chỉ dẫn đọc và phụ đề").** Giữ nguyên bắt buộc nghe thử. Hai gợi ý phiên âm có rủi ro với TTS tiếng Việt: "a-kai-v" kết bằng một phụ âm lẻ "v" rất dễ bị nuốt; "pờ-ti-shần" dùng "sh" không phải âm tiếng Việt. Gợi ý ghi thêm phương án thử theo thứ tự: Archive → "ác-kaiv" rồi "a-kaiv"; Partition → "pa-ti-sần" rồi "pờ-ti-sần"; cuối cùng thử viết nguyên chữ Latin. Phụ đề vẫn dùng chữ chuẩn. (Claude không nghe được âm thanh, nên người nghe thử quyết.)

**G5. Chỗ đặt nhãn còn mơ hồ cho Producer (`plan.md` mục "Phong cách hình ảnh", gạch đầu dòng vùng chữ; `script.md` cảnh 6).** Dải sơ đồ y=520–960 cao 440 px, mà bảng đã chiếm y=620–920, nên phía trên chỉ còn ~100 px cho "Minh hoạ", tên bảng, nhãn khung và chip khái niệm; phía dưới chỉ còn ~40 px nhưng cảnh 6 đặt bộ đếm "dưới sơ đồ". Cảnh 6 còn dồn 5–6 chip trong 4 giây ("Chính 9 · Lưu trữ 3", "Vẫn giữ lại", "Cùng CSDL", "Hoặc nơi khác", "Tuỳ hệ thống"). Sửa: ghi rõ "từ cảnh 2, dải y=250–480 (chỉ còn 'SQL') dùng cho chip khái niệm (Partition/Phân vùng/Archive/Lưu trữ…); dải y=520–960 chỉ gồm sơ đồ, tên bảng, nhãn khung và bộ đếm", và ở cảnh 6 tối đa ba chip hiện cùng lúc (ví dụ bỏ hai chip "Cùng CSDL" + "Hoặc nơi khác", giữ "Tuỳ hệ thống" vì đã có trong lời; hoặc cho hiện nối tiếp theo đúng giây của lời).

### Ghi chú (không bắt buộc)

**G6. Nguồn của cảnh 7 / [N3].** Hai trang IBM Optim đúng nhưng là một sản phẩm thương mại cụ thể. Phán quyết còn nêu hai bài coi archive là chính sách quản lý dữ liệu khác partition; có thể thêm bài của Brent Ozar (https://www.brentozar.com/archive/2026/05/we-want-to-archive-but-we-still-want-to-query-the-data/, tìm thấy bằng WebSearch ngày 18/11/2026) vào [N3] như nguồn bổ trợ cho "archive là cách quản lý, truy vấn lại có thể phức tạp". Không bắt buộc.

**G7. Lời kêu gọi cuối.** Kết hiện là câu trả lời cho hook, không có CTA. `mascot.md` cho phép "không bắt buộc công thức", nên vẫn đạt. Nếu muốn, cảnh 8 còn dư ~2 giây có thể thêm "Lưu lại kẻo quên nha!" (5 âm tiết) cùng `thumbs_up`; nếu thêm thì sửa luôn bảng cảnh, phụ đề và dòng "giữ hình kết".

**G8. Cảnh 8 đặt lại sơ đồ.** Giây 32–33 đưa sơ đồ về mười hai ô, hộp lưu trữ rỗng: có thể khiến người xem tưởng dữ liệu "quay về". Đạo diễn hình ảnh nên làm hiệu ứng "chạy lại ví dụ" rõ (chuyển cảnh nhanh, nhãn "Minh hoạ" giữ nguyên) khi lên storyboard; không cần sửa script.

**G9. Chi tiết nhỏ ở `plan.md`.** Câu "khoảng ngắn nhất 3 giây" (mục Cáo và chuyển cảnh) nên ghi "khoảng cách ngắn nhất giữa hai lần đổi dáng là 4 giây (14→18, 28→32); `think` giữ 3 giây đầu". Cũng có thể ghi thêm ở cảnh 3 rằng "Tháng 11" là giá trị lọc trên cột chia theo tháng (không phải hàm trên cột ngày), để Đạo diễn không vẽ biểu thức.

## Kiểm chính xác (nguồn đã đối chiếu)

- PostgreSQL, `ddl-partitioning.html`: pruning "prove that the partition need not be scanned because it could not contain any rows meeting the query's WHERE clause", chỉ dựa trên ràng buộc ngầm của khoá phân vùng, không phải index; `DETACH PARTITION` để tách phần thành bảng độc lập; lợi ích "normally worthwhile only when a table would otherwise be very large"; "Too many partitions can mean longer query planning times and higher memory consumption". Khớp với [N1] và bình luận ghim.
- MySQL 8.0, `partitioning-pruning.html`: pruning khi điều kiện rút về `cột_chia = hằng`, `IN`, so sánh/khoảng ngắn trên cột chia; truy vấn chỉ lọc cột khác không có căn cứ để loại phần nào (suy ra từ quy tắc; trang không nói thẳng). Khớp [N2] và xác nhận G1.
- IBM Optim (`reference-archive`, `data-archiving-optim-designer`): archive = chọn hàng, lưu vào file lưu trữ, xoá khỏi bảng nguồn tuỳ chọn. Khớp [N3] (một triển khai cụ thể).
- Không còn `[CẦN KIỂM NGUỒN]` trong file. Phát âm và thời lượng giọng thật chưa đo: Producer phải nghe/đo (Claude không nghe được âm thanh).

## Điều Codex cần làm ở lượt sửa (tóm tắt)

Bắt buộc: G1, G2. Nên: G3, G4, G5. Còn lại tuỳ chọn. Sau khi sửa không cần viết lại concept; cập nhật đồng bộ `script.md` và `plan.md` ở các chỗ đã chỉ.

KẾT LUẬN: CẦN SỬA
