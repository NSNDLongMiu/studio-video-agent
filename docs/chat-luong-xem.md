# Tiêu chí chất lượng xem — 18/11/2026

Đây là chuẩn gốc cho Ý tưởng → Kịch bản → Đạo diễn hình ảnh → Producer → QC. Các mẫu prompt chỉ chép phần cần dùng và trỏ về đây.
**Y1–Y8 là yêu cầu bắt buộc của giám đốc và được ưu tiên khi khác với R1–R10.** Các ngưỡng thử còn lại được ghi rõ và đánh giá lại sau 3 video. Các con số tham khảo trong Y6–Y7 hướng dẫn cách áp dụng yêu cầu, có thể tinh chỉnh theo ngữ cảnh và kết quả giám đốc nghe.

## Yêu cầu của giám đốc 18/11/2026 (Y1–Y8) — bắt buộc

- **Y1 — Chữ trên hình.** Mặc định chỉ có phụ đề. Cột “Chữ trên màn hình” của `script.md` là nguồn duy nhất cho chữ giải thích, kể cả chữ trong hình AI, UI/sơ đồ và chữ chốt. Ghi nguyên văn và lý do kỹ thuật cho mỗi mục. Ưu tiên hình ảnh, hoạt cảnh, sơ đồ và hiệu ứng trực quan. Ngoại lệ là nhãn “AI tạo”/“Có dùng AI” và “ví dụ dựng”/“ví dụ” khi phù hợp, liệt kê trong mục “Chữ bắt buộc tuân thủ” của `plan.md`, nhỏ và nhất quán. Phụ đề là kênh duy nhất chép lời.
- **Y2 — Tần suất Cáo.** Bắt buộc có Cáo ở ba nhóm phân cảnh: mở để dẫn vào vấn đề, giữa ở một số nhịp quan trọng để giải thích/nhấn mạnh/chuyển ý, kết để tổng kết và chào kết. Ẩn Cáo trong cảnh giải thích chuyên sâu để ưu tiên minh hoạ, animation hoặc mô phỏng kỹ thuật. Cáo xuất hiện gián đoạn. Tổng thời gian trên hình khoảng 40% trở xuống là **ngưỡng thử**, giám đốc có thể chỉnh.
- **Y3 — Kích thước Cáo.** Khi đứng cùng minh hoạ, Cáo chiếm khoảng **15–25% chiều rộng khung** (162–270 px ở 1080 px). Chọn vị trí và cỡ theo cảnh, chừa trọn chi tiết quan trọng. Khi Cáo là nhân vật chính ở cảnh mở/kết có thể lớn hơn, tối đa khoảng 1,5 lần kích thước nguồn (sticker cũ cao khoảng 330 px). Giữ đổi dáng cách nhau ≥ 2 giây.
- **Y4 — Bối cảnh theo nội dung.** Dùng bộ nền theo ngữ cảnh, thống nhất phong cách/ý nghĩa màu giữa các cảnh và tránh đổi đột ngột. Mỗi `environment` ghi lớp xa/giữa/gần, ánh sáng, bố cục và chuyển động phù hợp. Chủ đề nền gồm `database` (máy chủ/trung tâm dữ liệu/bảng dữ liệu hoặc mô phỏng truy vấn), `code` (IDE/terminal/luồng xử lý), `security` (xác thực/mạng/mã hoá), `incident` (dashboard cảnh báo/log lỗi/hệ thống gián đoạn) và `office` (văn phòng ở tình huống mở). Công cụ nền (xem `tools/backgrounds/README.md`): `python tools/backgrounds/make_background.py --theme <database|code|security|incident|office> --out <thư mục> [--seed N] [--size 1080x1920] [--layers]`.
- **Y5 — Kể chuyện, ưu tiên cao nhất.** Storytelling – Problem – Explanation – Solution. Mở bằng tình huống/sự cố cụ thể người xem có thể gặp, cho thấy vấn đề trong 2 giây đầu và nêu hệ quả tạo tò mò trước giây 5. Sau đoạn dẫn, chuyển tự nhiên sang nguyên nhân → cơ chế kỹ thuật → cách xử lý. Kết quay lại giải quyết hoặc kết luận đúng vấn đề đã mở. Tránh chào hoặc mở bằng định nghĩa.
- **Y6 — Tốc độ.** Giảm nhẹ còn khoảng 0,9–0,95 lần tốc độ hiện tại, đoạn kỹ thuật phức tạp chậm hơn đoạn dẫn. Từ mức cũ `atempo` 1,08: 1,08 × 0,9 ≈ 0,97 và 1,08 × 0,95 ≈ 1,03. Mặc định mới ≈ 1,00, `[kỹ thuật]` ≈ 0,97, `[dẫn]` ≈ 1,03. Giám đốc nghe để tinh chỉnh. Giữ hình đủ lâu để hiểu, tránh chuyển cảnh liên tục.
- **Y7 — Khoảng nghỉ.** Mốc tham khảo theo ngữ cảnh: sau dấu phẩy 0,2–0,4 s, sau dấu chấm 0,4–0,7 s, sau câu hỏi/ý quan trọng 0,7–1,2 s, chuyển nội dung 0,8–1,5 s. Phối hợp khoảng nghỉ với hiệu ứng hình/chuyển cảnh/âm thanh. Ở nhịp nghỉ dài, hình cần có thay đổi đáng xem hoặc chuyển cảnh có chủ đích.
- **Y8 — Phát âm.** Trước TTS, dùng từ điển `tools/voice/pronunciation.json` và công cụ `node tools/voice/pronounce.mjs <apply|check|terms|list|init-extra> [--file <tệp>] [--column "Lời đọc"] [--text "<chuỗi>"] [--extra <tệp.json>] [--ignore a,b]` (xem `tools/voice/README.md`). Phân loại từ đọc từng chữ cái (vd API) và từ đọc như một từ (vd Database, Deadlock, Transaction, Query, Index, Backend, Frontend), cấu hình cách đọc từng mục. Dùng `check --column "Lời đọc"` trên `script.md`; thuật ngữ lạ được Producer bổ sung vào **từ điển riêng của video** (`<video>/assets/voice/pronunciation.local.json`, `verified:false`, nằm trong phạm vi ghi của Producer) trước TTS, rồi `apply` chỉ cho bản đưa TTS. Mục đã được giám đốc nghe và chốt mới chuyển lên từ điển chung `tools/voice/pronunciation.json`. Chữ trên hình và phụ đề giữ chính tả chuẩn. Sau TTS, đối chiếu toàn bộ văn bản đầu vào, đo thời lượng/khoảng nghỉ và tạo một clip mỗi thuật ngữ ở `assets/voice/term-check/<slug>.wav`, kèm bảng “nghe kiểm” trong `notes.md`. Phát âm thực tế **CHƯA KIỂM — giám đốc nghe**, ưu tiên đoạn nhiều thuật ngữ. Chỉ cập nhật `verified:true` khi giám đốc đã nghe và xác nhận.

**Ví dụ mở đầu Database của giám đốc (tình huống dựng):**

> Một ngày, hệ thống của bạn đột nhiên không thể truy cập. Máy chủ vẫn hoạt động. Kết nối mạng bình thường. CPU và RAM không có dấu hiệu bất thường. Nhưng kỳ lạ thay, mọi truy vấn đến bảng giao dịch đều không nhận được phản hồi. Điều gì đang thực sự xảy ra bên trong Database?

Đoạn mẫu khoảng 55 từ, ước tính 15–20 giây ở tốc độ thường có nghỉ. Dùng cấu trúc của ví dụ và rút lời cho vừa tập. Phần dẫn có thể tới khoảng 8–12 giây nếu mỗi câu đi với một nhịp hình khác, và vẫn phải cho thấy tình huống/hệ quả sớm theo R1.

## Quy trình 7 bước

| Bước | Vị trí | Việc và đầu ra |
|---|---|---|
| 1. Phân tích chủ đề | Ý tưởng | Xác định vấn đề trọng tâm, người xem và thông điệp. Chốt tình huống và hệ quả theo Y5. |
| 2. Xây dựng kịch bản | Kịch bản | Viết tình huống mở → dẫn vấn đề → nguyên nhân/cơ chế → xử lý và kết luận; lập ngân sách thời lượng. |
| 3. Phân chia phân cảnh | Kịch bản + Đạo diễn hình ảnh | Lập và đối chiếu bản đồ cảnh có Cáo ở mở/giữa/kết và cảnh chỉ minh hoạ. |
| 4. Thiết kế hình ảnh | Đạo diễn hình ảnh | Chọn nền, bố cục, animation và chuyển động camera từng cảnh; kiểm renderer theo R9. |
| 5. Xử lý lời thoại | Sản xuất, với đầu vào của Kịch bản | Kịch bản liệt kê thuật ngữ và gắn nhãn tốc độ. Producer chuẩn hoá trước TTS, sinh từng câu, chỉnh tốc độ/khoảng nghỉ, đo và chuẩn bị clip nghe kiểm theo Y6–Y8. |
| 6. Dựng | Sản xuất | Đồng bộ hình, chuyển động, âm thanh và lời dẫn theo mốc đã duyệt lại. |
| 7. Kiểm tra chất lượng | QC | Rà toàn bộ Y1–Y8 trên bản dựng trước khi xuất bản và ghi bằng chứng từng nhóm. |

Mục tiêu là video kể chuyện công nghệ với tình huống thực tế, nhịp dựng hợp lý, hình sinh động và lời dẫn tự nhiên.

## Ngân sách thời lượng

**`plan.md` (từng tập) và `script.md` (từng đoạn) phải có bảng ngân sách.** Ghi số từ hoặc âm tiết ước lượng và dùng cùng đơn vị với tốc độ mới (từ hoặc âm tiết/giây). Ước tính tổng = ∑(số từ hoặc âm tiết mỗi đoạn ÷ tốc độ mới của đoạn) + tổng giây nghỉ Y7 + đuôi im mặc định ≤ 0,7 s. Các khoảng nghỉ trùng ranh giới chỉ tính một lần.

| Tập/đoạn | Nhãn tốc độ | Từ hoặc âm tiết | Tốc độ mới (đơn vị/giây) | Giây đọc ước tính | Nghỉ Y7 (s) | Đuôi im (s) | Tổng (s) |
|---|---|---|---|---|---|---|---|
| Mỗi tập hoặc đoạn | `[dẫn]` / `[kỹ thuật]` | Ước lượng | Theo Y6 | Độ dài lời ÷ tốc độ | Cộng các nhịp nghỉ | Tính một lần ở cuối | Cộng đọc + nghỉ + đuôi |

Y5 cần thời gian dẫn tình huống, Y6 đọc chậm hơn khoảng 8% ở mức mặc định, Y7 thêm nghỉ. **Tổng vẫn 15–45 giây.** Sau TTS, Producer đo lại lời và các khoảng nghỉ thực tế, rồi Kịch bản/Đạo diễn hình ảnh duyệt lại các mốc dự kiến. Nếu quá 45 giây, cắt phạm vi còn một khái niệm/tập hoặc rút đoạn mở, rồi đo lại. Giữ giới hạn 45 giây và tốc độ lời đã chọn.

## Luật và cách kiểm

| Luật | Nội dung | Ngưỡng thử (đánh giá lại sau 3 video) | Cách đo/kiểm | Khâu chịu trách nhiệm |
|---|---|---|---|---|
| R1 — Hook tình huống/hệ quả | Y5: trong 2 giây đầu thấy tình huống/vấn đề bằng hình và câu mở ngắn. Nêu nhân vật, mâu thuẫn/hệ quả cụ thể và câu hỏi mở; kết trả lời câu hỏi. Hook là ví dụ dựng, không giả người/sự kiện thật; ghi rõ số/giờ minh hoạ là ví dụ. | Trước giây 5 cho thấy vì sao đáng quan tâm. Đoạn dẫn có thể tới khoảng 8–12 giây nếu mỗi câu đi với một nhịp hình khác. | Xem riêng phần mở, chấm hệ quả gần người xem; trì hoãn đáp án chỉ có giá trị khi người xem đã biết điều gì đang bị đe doạ. | Ý tưởng; ideator-b chốt |
| R2 — Kịch bản có lời hứa và kết | `concept.md` và bảng cảnh ghi hook, lý do tò mò, “câu hỏi mở → trả ở giây N”, câu chốt giải quyết vấn đề và kêu gọi cuối tự nhiên, nhẹ, hợp kênh. Chữ chốt chỉ hiện khi thoả Y1. | Lý do tò mò trước giây 5. | Kiểm đủ từng mục và mốc, kể cả kêu gọi cuối. Tổng 15–45 giây. | Codex Kịch bản; planner review |
| R3 — Chữ giúp hiểu | Y1 mặc định chỉ có phụ đề và nhãn tuân thủ đã liệt kê trong plan. Chữ giải thích lấy đúng cột “Chữ trên màn hình” và có lý do kỹ thuật. Mỗi nhịp một tiêu điểm, phụ đề là kênh duy nhất chép lời. | Giới hạn khi cần chữ: chữ khoá ≤ 3 từ và ≥ 72 px, nhãn/mã ≥ 56 px, tối đa 3 nhóm đồng thời ngoài phụ đề và nhãn tuân thủ. | So toàn bộ chữ với script/plan, đếm nhóm ở khung đông nhất, kiểm đủ dấu và vùng an toàn. | Kịch bản + Đạo diễn hình ảnh; Producer/QC kiểm |
| R4 — Đổi hình thật | Vật thể/quan hệ đổi nhìn ra được ở 360×640 mà không đọc chữ; đổi chip, đổi dáng Cáo, zoom < ~10% không tính. Mỗi cảnh khai `main_change`. | Trong mọi khoảng ≥ 1,5 s có ≥ 1 đổi hình nhìn thấy; đoạn tĩnh > 2 s phải có `hold_reason`. | So khung trước/sau, xem đoạn chuyển động; camera đổi 2–8% không đủ chứng minh đa dạng. Freeze/scene-score chỉ là đèn cảnh báo, không là ngưỡng cứng. | Đạo diễn hình ảnh; Producer/QC kiểm |
| R5 — Vật chính đủ lớn | Sơ đồ/vật chính ở cảnh trọng tâm dùng đủ vùng an toàn; lệch ngưỡng phải có lý do trong `plan.md`. | Cao ≥ ~45% vùng an toàn, tức ≥ ~560 px trong y∈[~250, ~1500]. | Đo hộp bao vật chính trên khung; kiểm lại khi thu nhỏ. | Kịch bản ghi plan; Đạo diễn hình ảnh thiết kế |
| R6 — Cáo có vai kể | Áp dụng ở các cảnh có Cáo theo Y2. Cáo nhìn/chỉ/phản ứng với vật đang đổi hoặc tương tác với vai phụ. Dùng hình khối/silhouette cho vai phụ ở hook. | Tổng thời gian có Cáo khoảng 40% trở xuống là ngưỡng thử. Cỡ 15–25% chiều rộng khi có minh hoạ là yêu cầu Y3. | Đối chiếu bản đồ mở/giữa/kết, mốc vào/ra, hành vi, kích thước và vùng che trên bản dựng. | Kịch bản + Đạo diễn hình ảnh; Producer làm |
| R7 — Định hướng và bìa | `plan.md` có bảng nghĩa màu (đúng/sai/đang xét/nhấn…) dùng nhất quán. Thumbnail là khung hook tình huống/nghịch lý, không mang cả lưới nhiều nhãn. | Video ≥ 30 s hoặc ≥ 3 phần: khuyến nghị 2–4 chip chương tick dần, chữ trên chip theo Y1; bìa đọc được ở 180×320. | So màu xuyên video; xem chỉ báo nếu có; mở bìa thu nhỏ thật. | Kịch bản + Đạo diễn hình ảnh; Producer làm bìa; QC kiểm |
| R8 — Nhịp theo giọng thật | Đo TTS rồi duyệt lại mốc theo giọng. Áp Y6–Y7, giữ hình đủ lâu để hiểu và tránh dồn chuyển cảnh. Nghỉ 0,7–1,5 s ở câu hỏi/ý quan trọng hoặc chuyển nội dung theo dải Y7, kết hợp hiệu ứng hình/chuyển cảnh/âm thanh và có hình đổi đáng xem hoặc chuyển cảnh có chủ đích. | Dùng dải tham khảo Y7, đuôi im mặc định ≤ 0,7 s. | Đo tiếng/lặng, đối chiếu timeline, ghi giây và lý do ngoại lệ trong `notes.md`. Không tăng tốc để bù, tổng vẫn 15–45 s. | Producer đo; Kịch bản/Đạo diễn hình ảnh duyệt lại; QC kiểm |
| R9 — Renderer theo khả năng thật | Trước `APPROVED`, đối chiếu từng visual với component thật ở `studio/renderer-remotion/src/scenes/*`; enum hợp lệ chưa đủ. Khi component chỉ có nền tối cố định (vd `#10131f`, `#161a26`) và không thể hiện được nền theo Y4, hoặc không biểu đạt đúng phần visual khác → ghi `renderer: "pillow-ffmpeg"` + `renderer_reason` ngay khi thiết kế. | Không có. | Producer thấy chỉ định trên storyboard `APPROVED` thì dùng thẳng Pillow+FFmpeg, không chạy `producer.mjs`/`orchestrator.mjs`, không escalate chỉ vì lựa chọn đó. Giữ fallback/escalate cho vướng ngoài dự kiến; cấm lách preflight/hạ thành thẻ chữ tĩnh. | Codex storyboard đề xuất; visual-director kiểm/duyệt; Producer làm |
| R10 — QC ba trục | Ghi riêng KỸ THUẬT, TUÂN THỦ, TRẢI NGHIỆM và bằng chứng cho 5 câu hỏi người xem lạ và từng nhóm Y1–Y8. Chính xác và kiểm nguồn vẫn là điều kiện cần. | Dùng ngưỡng thử ở trên, không suy từ số đo máy thành hấp dẫn. | Xem bản dựng thật, so storyboard và phân loại lỗi theo mục định tuyến; phần không nghe được (phát âm/giọng) ghi “CHƯA KIỂM”. | support chế độ QC |

## Trường storyboard mới

Schema để tuỳ chọn nhằm giữ storyboard cũ hợp lệ, nhưng **storyboard mới bắt buộc điền**: mỗi cảnh `main_change` (chuỗi), `text_groups` (số nguyên ≥ 0, cực đại đồng thời, không tính phụ đề/nhãn tuân thủ); `hold_reason` (chuỗi) chỉ khi có đoạn tĩnh > 2 s.
Trong `quality_check` mỗi cảnh: `text_repeats_voiceover` (bool, mong muốn `false`), `change_visible_at_360` (bool, mong muốn `true`). Cấp storyboard: `renderer` (`"remotion"` hoặc `"pillow-ffmpeg"`) và `renderer_reason` (chuỗi, lý do theo khả năng thật).
Các trường này đã có trong `studio/schema/storyboard.schema.json` (tuỳ chọn). Worker (`studio/src/worker.mjs`) chấp nhận việc QC kết thúc khi video ở `review` và đang có cờ vướng `QC-THIẾT-KẾ`; `tools/qc-video.mjs` đo thêm LUFS, LRA và true peak. Mã `studio/` chỉ có hiệu lực sau khi khởi động lại worker.

## 5 câu hỏi người xem lạ

Các câu hỏi dùng các mốc của R1–R8 và Y1–Y8. QC ghi Đạt/Chưa đạt/CHƯA KIỂM kèm giây/cảnh và bằng chứng:

1. Trong 3 giây đầu, nói được bài về gì và vì sao mình nên quan tâm không?
2. Trước giây 5 đã rõ hệ quả hoặc lý do muốn biết câu trả lời chưa?
3. Mỗi cảnh một ý; tắt tiếng có hiểu phần chính không?
4. Hình có đổi nhìn ra được ở 360×640; chữ có đang chép lời đọc không?
5. Kết giải quyết tình huống mở và có kêu gọi tự nhiên không? Đuôi im ≤ 0,7 s theo mặc định, bìa đọc được ở 180×320 và lấy từ khung hook không?

## Bảng QC 8 nhóm

Trong trục **TRẢI NGHIỆM**, ghi riêng Đạt/Chưa đạt/CHƯA KIỂM cho từng nhóm, kèm bằng chứng và giây/cảnh. Với Y6–Y8, ghi kết quả đo/đối chiếu và đánh dấu phần nghe cần giám đốc kiểm.

| Nhóm | Câu hỏi kiểm | Bằng chứng cần có |
|---|---|---|
| Y1 | Có chữ tự sinh, chữ dư hoặc chữ chép lời ngoài phụ đề không? | Khung có chữ đối chiếu từng mục và lý do kỹ thuật trong script; nhãn tuân thủ khớp plan. |
| Y2 | Cáo xuất hiện gián đoạn đúng ba nhóm, cảnh giải thích sâu dành cho minh hoạ? | Bản đồ cảnh và mốc vào/ra, tổng giây và tỷ lệ thời lượng; khoảng 40% trở xuống chỉ là ngưỡng thử. |
| Y3 | Cáo đứng cùng minh hoạ có rộng khoảng 15–25% và chừa trọn nội dung chính? | Hộp bao trên khung 1080 px, cảnh rộng nhất; ở mở/kết có Cáo làm chính, đối chiếu độ phóng với nguồn. |
| Y4 | Nền có đổi theo nội dung, giữ phong cách và có chiều sâu, ánh sáng, bố cục, chuyển động phù hợp? | Khung thật của các bối cảnh, `environment` theo cảnh và lý do chọn renderer. |
| Y5 | Mở có tình huống và hệ quả, chuyển tự nhiên qua nguyên nhân/cơ chế tới cách xử lý, rồi giải quyết câu hỏi mở? | Mốc 0–2 s, trước 5 s, các nhịp dẫn/giải thích và đoạn kết đối chiếu script. |
| Y6 | Đoạn kỹ thuật chậm hơn đoạn dẫn, hình đủ thời gian quan sát, chuyển cảnh có nhịp? | Nhãn đoạn, hệ số hậu kỳ và giây đọc/giữ hình đo được; độ tự nhiên và tốc độ cảm nhận chờ giám đốc nghe. |
| Y7 | Nhịp nghỉ có chủ đích theo ngữ cảnh và phối hợp với hình/chuyển cảnh/âm thanh? | Mốc nghỉ đo được và bằng chứng đi cùng trên timeline/khung; nhịp nghe tự nhiên chờ giám đốc nghe. |
| Y8 | Thuật ngữ đã được chuẩn hoá trước TTS và rà lại toàn bộ sau khi sinh giọng? | Kết quả `check`, văn bản `apply`, bảng thuật ngữ, bảng nghe kiểm và clip từng mục; phát âm thật chờ giám đốc nghe. |

## Định tuyến QC và bài học

- **Lỗi sửa được khi dựng lại** (hình đứng yên so với storyboard, đuôi im, chữ tràn/chồng, bìa sai, thẻ chuyển che mã thẻ khác…): FAIL → `notes.md` mục “QC — cần sửa”, danh sách lỗi cụ thể → `production` để sản xuất lại như hiện hành.
- **Lỗi thiết kế** (storyboard đã `APPROVED` nhưng hook thiếu tình huống/ích lợi, chữ chép lời, vật chính nhỏ…): không `ready`, không đẩy vòng sản xuất lại vô ích. Ghi `notes.md` mục “QC — lỗi thiết kế”: giây/cảnh/bằng chứng/đề nghị cho Kịch bản hay Đạo diễn hình ảnh; `escalate(video_id, reason="QC-THIẾT-KẾ: …")`, **để video ở `review`** để giám đốc thấy ở “Cần giám đốc chú ý”. Nếu đồng thời có lỗi dựng, liệt kê cả hai nhưng giữ nhánh lỗi thiết kế chờ quyết định.
- QC không tự sửa thiết kế. **Đường tự động trả về Đạo diễn hình ảnh chưa được xây**; hiện giám đốc quyết chấp nhận → `ready`, hoặc ra lệnh làm lại.
- QC ghi “Bài học cho luật” trong `notes.md` (0–3 dòng, chỉ khi có điều lặp lại/điều mới học được); không tự sửa `docs/`. Sau 3 video, rà lại ngưỡng thử; chưa có analytics thì không kết luận hiệu quả giữ chân.

## Điều giữ nguyên

- Chuẩn mặc định **9:16, 1080×1920, 15–45 giây**, vùng an toàn y∈[~250, ~1500], tiếng Việt đủ dấu.
- Không nhạc nền: chỉ giọng đọc + hiệu ứng tối giản. Không dịch vụ AI trả phí. Luôn gắn nhãn AI và disclosure trong mô tả cả ba nền tảng.
- Cáo dùng dáng có sẵn, không nhép miệng, đổi dáng là “cắt”, giữ giới hạn trong `docs/mascot.md`. Tần suất và kích thước theo Y2–Y3.
- Không bịa số liệu; giữ tiêu chí “Chính xác”, “Làm được & an toàn” và kiểm nguồn. Tình huống mở là **ví dụ dựng**, không giả làm sự kiện/người thật; giờ/số lần minh hoạ phải ghi rõ là ví dụ.
- Mở bằng tình huống trong chủ đề đã giao, không dùng câu chào cố định. Không sao chép nội dung/cảnh/kịch bản hay khung hình video tham chiếu vào repo; chỉ học kỹ thuật làm phim.
- Codex viết/làm, Claude review/duyệt; chỉ Claude đặt storyboard `APPROVED`, không viết thay Codex; tối đa 2 vòng sửa. Giữ cơ cấu core.
- Nói thật: chưa kiểm thì không nói đạt; phát âm/giọng không nghe được là **CHƯA KIỂM**. Không cài công cụ nhận dạng giọng. Không agent nào được đưa file âm thanh vào mô hình để "nghe thử" (Codex trả `400 Audio input is not available`): chỉ đo bằng số (`ffprobe`/`silencedetect`/`loudnorm`/`qc-video`), giám đốc nghe kiểm trước khi xuất bản.

## Nguồn gốc

Hai phân tích độc lập và đối chiếu hai video ngày 18/11/2026: thành phẩm đúng thiết kế, đạt tuân thủ nhưng trải nghiệm còn yếu. Các luật bổ sung kiểm thiết kế và trải nghiệm; chưa có số giữ chân thực tế để khẳng định hiệu quả. Y1–Y8 và quy trình 7 bước bổ sung theo chỉ đạo của giám đốc ngày 18/11/2026.

## Câu hỏi cho giám đốc

Đoạn dẫn có tình huống, lời chậm hơn và nhịp nghỉ dài hơn lấy thêm thời gian trong trần 45 giây. Khi một chủ đề cần thêm thời gian kể chuyện, giám đốc chọn phương án nào?

- **A — Giữ 45 giây.** Cắt phạm vi còn một khái niệm mỗi video hoặc rút đoạn mở. Áp dụng phương án này trong khi chờ quyết định.
- **B — Cho phép tập đến 60 giây với chủ đề cần kể chuyện.** Đây là mức riêng đề xuất cho xưởng. Cả ba nền tảng hỗ trợ video 3 phút khi đăng trực tiếp. [YouTube Shorts](https://support.google.com/youtube/answer/15424877), [TikTok](https://developers.tiktok.com/docs/en/content-posting-api-media-transfer-guide#video-restrictions), [Facebook Reels](https://about.fb.com/news/2025/06/making-it-easier-create-videos-facebook/).
