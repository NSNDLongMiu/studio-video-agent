# Review Kịch bản — vòng 2 (N = 2) — IT-T3-E01 "Archive và Partition trong SQL là gì?"

- Người review: Claude (`planner`, vị trí Kịch bản). Người viết: Codex.
- Đã đọc lại toàn văn: `concept.md`, `plan.md`, `ep01/script.md`; đối chiếu `review/script-r1.md`, `debate.md` (mục "Phán quyết cuối"), `docs/mascot.md`, `docs/platform-specs.md`. Không dựa vào báo cáo của Codex; mỗi điểm G1–G9 được kiểm trực tiếp trong file.
- Kiểm bằng grep (18/11/2026) trên `concept.md`, `plan.md`, `ep01/script.md`: không còn `point_left`, không còn "T2, T4, T7", không có "luôn nhanh hơn", "sẽ nhanh hơn", "vẫn tra cứu dễ", chữ "dọn" trong lời/hình. Các chữ "nhanh hơn" còn lại chỉ nằm ở bảng rủi ro của `plan.md` (mô tả rủi ro, không phải chữ hiển thị).
- Kiểm nguồn mới: bài Brent Ozar ở [N3] mở được (WebFetch), tiêu đề, tác giả, ngày 07/05/2026 đúng; nội dung (chuyển dữ liệu cũ sang nơi lưu riêng, khó khi vẫn muốn truy vấn bằng ứng dụng cũ trong SQL Server; partitioning không giải quyết việc giảm chi phí; phải lọc theo cột phân vùng) khớp cách Codex tóm tắt và Codex đã giới hạn đúng phạm vi (không khái quát sang mọi hệ quản trị).

## Bảng chấm lại 6 tiêu chí

| # | Tiêu chí | Vòng 1 | Vòng 2 | Lý do ngắn |
|---|---|---|---|---|
| 1 | Bám phán quyết | Đạt | **Đạt** | Hook nguyên văn, SQL hiện giây 0, hai nhãn "Chia ra" / "Chuyển dữ liệu cũ", dự phòng 2,2 giây giữ nguyên. Tám nhịp 0/3/9/14/18/24/28/32/39. 17 câu thoại ở `concept.md` khớp từng câu với cột lời trong `script.md`. Không quiz, giọng nữ, ẩn dụ tủ, chip index, cú pháp SQL giả. |
| 2 | Giữ chân | Đạt | **Đạt** | Hook là câu hỏi mở, trả lời ở giây 32–39. 3+6+5+4+6+4+4+7 = 39 giây (15–45). Mốc dự phòng cảnh 2 (9 → tối đa 10) vẫn giữ tổng 39 giây. Không có CTA riêng: chấp nhận được (xem G7). |
| 3 | Đủ chi tiết cho Producer | Đạt có điều kiện | **Đạt** | Bảng cảnh đủ 6 cột, chữ/lời đúng từng chữ, bảy tên dáng đều có file thật trong `brand/cao/poses/` (đã Glob lại: `think`, `present_hand`, `point_up`, `shrug`, `point_right`, `clipboard`, `thumbs_up`), vùng chữ phân chia rõ, nghiệm thu đo được. |
| 4 | Chính xác | Chưa đạt | **Đạt** | Lỗi duy nhất ở vòng 1 (cảnh 4 vẽ 5 ô sáng/7 ô mờ) đã sửa thành mười hai ô sáng. Mọi điều kiện pruning, DETACH PARTITION, "quá nhiều phân vùng", archive không phải lệnh SQL chuẩn đều đúng như đã đối chiếu ở vòng 1. Không còn `[CẦN KIỂM NGUỒN]`. |
| 5 | Làm được & an toàn | Đạt | **Đạt** | Chỉ đồ hoạ tự tạo, ảnh Cáo có sẵn, Segoe UI, VieNeu Minh Đức; không nhạc, không logo hãng. Cả ba mô tả kết thúc đúng câu "Video có dùng hình ảnh và giọng đọc do AI tạo."; `ai_generated_content=true`. Hashtag 4/4/5; tiêu đề YouTube khoảng 56 ký tự. |
| 6 | Văn phong | Đạt | **Đạt** | Xưng "mình"/"bạn", câu ≤ 12 từ (dài nhất 10 từ), "sếp", "chốt" vừa đủ; "phân vùng", "lưu trữ" được giải nghĩa ở lần đầu. |

## Kiểm từng điểm góp ý vòng 1

| Điểm | Mức | Kết quả | Bằng chứng trong file |
|---|---|---|---|
| G1 cảnh 4 sai điều kiện pruning | Bắt buộc | **Đạt** | `script.md` cảnh 14–18 s: "Cả mười hai ô sáng cùng lúc, không ô nào mờ"; danh sách "T2, T4, T7, T9, T11" và câu "không kết luận…" đã bỏ; lời và hai chip "Có thể vẫn đọc" + "nhiều phần" giữ nguyên, không in "tất cả/mọi/luôn". `plan.md` gạch đầu dòng "Lọc cột khác làm cả mười hai ô sáng đồng thời, không ô nào bị làm mờ" và tiêu chí nghiệm thu 6 đã thêm điều kiện. Cảnh 5 có "Trả độ sáng các ô về bình thường" nối mạch. |
| G2 `point_left` ở cảnh 3 | Bắt buộc | **Đạt** | `script.md` cảnh 9–14 s: `point_up`; `plan.md` dãy dáng `think` → `present_hand` → `point_up` → `shrug` → `point_right` → `point_right` → `clipboard` → `thumbs_up`, bảng Nguyên liệu `point_up.png`. Sáu lần đổi dáng đúng (3/9/14/18/28/32), khoảng cách ngắn nhất 4 giây. |
| G3 dự phòng cảnh 2 | Nên | **Đạt** | Đoạn "Dự phòng được phép cho cảnh 2" trong `script.md` và dòng riêng trong bảng rủi ro `plan.md`: > 5,8 giây thì dời mốc 9 → tối đa 10, cảnh 3 còn tối thiểu 4 giây, dời cả mốc đổi dáng, giữ 6 lần đổi và tổng 39 giây, không đạt thì trả người review. Hai file nhất quán; tiêu chí nghiệm thu 1 cũng ghi. |
| G4 thứ tự thử phát âm | Nên | **Đạt** | Bảng "Chỉ dẫn đọc": Partition "pa-ti-sần" → "pờ-ti-sần" → chữ Latin; Archive "ác-kaiv" → "a-kaiv" → chữ Latin; phụ đề vẫn dùng chữ chuẩn. |
| G5 phân vùng chữ / số chip cảnh 6 | Nên | **Đạt** | Cả hai file ghi: từ cảnh 2, dải y=250–480 (SQL y=250–300, chip y=320–480); dải y=520–960 chỉ gồm sơ đồ, tên bảng, nhãn khung, bộ đếm. Cảnh 6: hàng nhãn y=520–568, bộ đếm y=570–618, tối đa ba chip (hai bộ đếm + một chip khái niệm), "Vẫn giữ lại" rồi "Tuỳ hệ thống" nối tiếp, không chồng. Còn một điểm hình học nhỏ về chiều cao hàng, tôi đã sửa (xem G10). |
| G6 nguồn Brent Ozar | Ghi chú | **Đạt** | Đã thêm vào [N3] với phạm vi đúng, đã kiểm. |
| G7 CTA cuối | Ghi chú | **Chấp nhận** | `mascot.md` ghi lời chốt/kêu gọi "tự do theo chủ đề, ngắn, không bắt buộc công thức". Kết hiện là câu trả lời cho hook ("Mình chốt: hai việc khác nhau. Bạn có thể dùng chung."), đủ tự nhiên; không bắt buộc thêm. |
| G8 reset sơ đồ cảnh 8 | Ghi chú | **Chấp nhận** | Script đã nêu rõ đây là "đặt lại ví dụ để diễn giải khả năng kết hợp, không chuyển thêm ba ô khỏi kết quả trước"; việc làm hiệu ứng "chạy lại" thuộc Đạo diễn hình ảnh. |
| G9 chi tiết nhỏ `plan.md` | Ghi chú | **Đạt** | Đã ghi "khoảng cách ngắn nhất giữa hai lần đổi dáng là 4 giây (14→18, 28→32); `think` giữ 3 giây đầu" ở cả `plan.md` và `script.md`; cảnh 3 ghi "Tháng 11" là giá trị lọc trên cột chia theo tháng, không vẽ biểu thức. |

## Điểm mới phát sinh ở vòng 2

**G10 (nhỏ, Claude đã tự sửa).** Hàng nhãn khung y=520–568 và hàng bộ đếm y=570–618 chỉ cao 48 px mỗi hàng nhưng chữ nhãn là 48 px có dấu tiếng Việt ("Chính", "Lưu trữ", "Đơn hàng"), cần khoảng 64 px mỗi hàng; hai hàng sát nhau 2 px dễ chồng/cắt dấu. Đây không phải lỗi nội dung và kịch bản vẫn dựng được, nên không bắt Codex sửa. Đã sửa: thêm một câu vào `ep01/script.md` (bullet đầu mục "Quy ước hình và chữ") và `plan.md` (bullet vùng chữ trong "Phong cách hình ảnh"): toạ độ hai hàng là gợi ý; Đạo diễn hình ảnh được dịch bảng chính và hộp lưu trữ xuống tối đa 40 px (đáy không quá y=960), giữ nguyên cỡ chữ, vùng an toàn và khoảng cách tới phụ đề ít nhất 40 px. Không đổi mốc, lời, chữ, số chip hay bất kỳ cảnh nào.

**Đã sửa thêm (chỉ dòng trạng thái):** đầu `ep01/script.md`, `plan.md`, `concept.md` đang ghi "chờ Claude review"; đổi thành "Claude đã duyệt (xem review/script-r2.md)" để Producer và Đạo diễn không hiểu nhầm là bản chưa duyệt.

## Ghi chú không bắt buộc cho các khâu sau

1. **Đạo diễn hình ảnh:** (a) chip khái niệm cảnh 2 (3 chip, chữ 60 px hoặc 48 px) trong dải y=320–480 cao 160 px có thể phải xếp hai hàng; không thu chữ, nếu chật thì dùng nhãn 48 px. (b) Cảnh 1: SQL cộng hook hai dòng 64 px trong y=250–480 cũng khá sát, giãn dòng ~1,15. (c) Cảnh 7 chưa nói rõ hai bộ đếm còn hiện hay không; "sơ đồ kết quả giữ nguyên" nên giữ đủ sơ đồ và bộ đếm, chip khái niệm vẫn ở dải y=320–480. (d) Cảnh 5 có chip "Lưu trữ" và nhãn hộp "Lưu trữ" cùng lúc; nên phân biệt vị trí để không tưởng nhầm là một.
2. **Producer:** dự phòng cảnh 2 cho cảnh 3 chỉ còn tối thiểu 4 giây trong khi ước lượng đọc là 3,5–4,2 giây (16 âm tiết, 3 câu); sát ở tốc độ chậm. Phải đo giọng thật; nếu cả hai cảnh không vừa thì trả về review, không tự cắt lời. Claude không nghe được âm thanh nên người nghe thử quyết cách đọc Partition/Archive/SQL.
3. Thời lượng mục 4 của vòng 1 (ước lượng âm tiết) giữ nguyên hiệu lực; chưa đo bằng TTS thật.

KẾT LUẬN: DUYỆT SAU KHI CLAUDE SỬA NHỎ
