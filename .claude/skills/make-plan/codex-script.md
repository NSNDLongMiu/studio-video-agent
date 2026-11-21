# Vị trí "Kịch bản" — Claude lên plan và viết, Codex cùng viết, Claude chốt

> **Đổi 20/11/2026 (giám đốc, để giảm tải Codex):** Claude (`planner`) viết `concept.md`, `plan.md` và bản đầu `epNN/script.md` theo **mục A**; Codex cùng viết theo **mục B** (đề xuất bản viết lại lời đọc `[kỹ thuật]` và chỉ lỗi ở file riêng `review/script-codex-r<N>.md`, không sửa `script.md`); Claude chốt.
> Người điều phối (`/make-plan`) chỉ dán **mục B** + phần "NGỮ CẢNH" điền sẵn vào file prompt của Codex, rồi gọi
> `node --disable-warning=ExperimentalWarning studio/src/codex-write.mjs script <file-prompt> <thư-mục-chủ-đề>`.
> Codex chỉ GHI được trong thư mục chủ đề; được ĐỌC file trong dự án theo đường dẫn tuyệt đối ghi ở NGỮ CẢNH.

## A. Chuẩn viết kịch bản (planner viết theo mục này; Codex đọc để góp ý đúng chuẩn)

Bạn là **người viết của vị trí Kịch bản** trong một đội làm video ngắn dọc (TikTok / Facebook Reels / YouTube Shorts) của kênh **Cáo văn phòng**. Claude viết và chốt; Codex cùng viết phần lời kỹ thuật (mục B). Người đọc kịch bản tiếp theo là **Producer (Codex)** — không có bối cảnh ngoài những gì bạn viết ra; mơ hồ = dựng sai.

## Đọc trước (đường dẫn tuyệt đối có trong NGỮ CẢNH)
`brief.md`, `debate.md` (mục **"Phán quyết cuối"** là ràng buộc bắt buộc — concept, hook, bộ câu thoại Cáo đã chốt), `docs/asset-sources.md`, `docs/platform-specs.md`, `docs/mascot.md` (văn phong, danh sách tên dáng Cáo, giới hạn), `docs/chat-luong-xem.md` (chuẩn gốc R1–R8; tóm tắt tự đủ ý bên dưới). Nếu là **bản sửa**: đọc file review mới nhất (đường dẫn trong NGỮ CẢNH) và **sửa đúng từng điểm**, giữ nguyên phần không bị góp ý.

## Viết vào thư mục chủ đề (thư mục làm việc hiện tại)
1. **`concept.md`** — concept đã chốt + lý do (theo phán quyết); đối tượng khán giả; giọng điệu; "lời hứa" của series; **hook đã chọn**, **ích lợi đầu tiên (trước giây 5)**, **câu hỏi mở → trả ở giây N**, **cách đoạn kết giải quyết vấn đề mở đầu + kêu gọi tự nhiên**; bộ câu thoại Cáo dùng cho video.
2. **`plan.md`** (cấp bộ video):
   - Phong cách hình ảnh (bộ nền theo ngữ cảnh với cùng phong cách, màu hex + **bảng nghĩa màu** đúng/sai/đang xét/nhấn… dùng nhất quán, font, cỡ chữ, vùng an toàn y∈[~250, ~1500]), âm thanh (theo R25 và `docs/asset-sources.md`), quy tắc phụ đề.
   - Bảng các tập: mã video · tên tập · thời lượng mục tiêu (45–75 giây (chuẩn, D1)) · thông điệp chính.
   - **Nguyên liệu cần** — chỉ nguồn trong `docs/asset-sources.md`; thiếu thì ghi ở mục **"Cần giám đốc cung cấp"**, không tự bịa.
   - **Tiêu chí nghiệm thu** đo được (thời lượng, 1080x1920, có phụ đề, hook trong 2 giây, `publish.json` cho 3 nền tảng…); **Rủi ro & dự phòng**.
   - **Bản đồ Cáo (Y2–Y3):** ghi cảnh có/không có Cáo, mốc, hành vi và cỡ/vị trí. Cáo xuất hiện gián đoạn ở cả ba nhóm mở (dẫn), giữa (chỉ vài nhịp chuyển ý, không bắt buộc ở mọi đoạn), kết (tổng kết/chào); tổng thời gian có Cáo ≲ 25% (ngưỡng thử), Cáo nhỏ để dành diện tích cho nội dung kỹ thuật; cảnh giải thích sâu ưu tiên minh hoạ. Khi cùng minh hoạ rộng khoảng 10–18% khung (108–194 px ở 1080); tránh che chi tiết. Cảnh mở/kết do Cáo làm chính có thể lớn hơn nhưng tối đa khoảng 1,5 lần kích thước nguồn.
   - **Opening và Header (R14):** ghi tiêu đề opening (ngắn, rõ, gây tò mò; theo R26, animation) và nhãn header (vd `DATABASE / DEADLOCK`) (header có ở **mọi cảnh sau opening**, không còn cảnh ẩn — D8/R21; opening có thể có lời hook — R20/R26); chữ do text engine vẽ, ghi nguyên văn ở cột “Chữ trên màn hình” kèm lý do “opening”/“header”.
   - **Bảng “Chiều sâu” (R15):** cảnh/lời nào trả lời từng câu: vấn đề thực tế · vì sao quan trọng · nguyên nhân/cơ chế · ví dụ giúp hình dung · hậu quả/sai lầm thường gặp · giải pháp/bài học (nêu lý do nếu bỏ câu nào). Cấu trúc thời lượng theo **tỉ lệ**, không hardcode giây (docs D1).
   - **Không nhãn thừa trên hình (giám đốc chốt 19/11/2026; ngoại lệ do giám đốc yêu cầu: tiêu đề opening và header):** plan không có mục “Chữ bắt buộc tuân thủ”; không «AI tạo», không «Ví dụ dựng», không chữ/hình thừa. Khai báo AI và “ví dụ dựng” chỉ nằm ở `publish.json`/caption (xem dưới).
3. **`epNN/script.md`** cho từng tập (thư mục `epNN` đã có sẵn) — bảng `thời gian | đoạn truyện | nhãn tốc độ | độ phức tạp · khái niệm mới · giữ sau lời (vd `High · 1 · giữ 2,5 s`) | hình ảnh/đồ hoạ | chữ trên màn hình | lời đọc/phụ đề | Cáo (có/không, tên dáng nếu có) | âm thanh/khoảng nghỉ`. Đánh dấu **Storytelling – Problem – Explanation – Solution** theo cảnh, `[dẫn]`/`[kỹ thuật]` theo lời, hook và hệ quả sớm, giây trả câu hỏi, câu chốt và kêu gọi cuối. Ghi lời đọc/phụ đề nguyên văn, đúng chính tả.
   - **Bảng “Thuật ngữ & cách đọc”:** thuật ngữ nguyên văn | loại (đọc từng chữ cái hay đọc như từ) | chữ đưa vào TTS (giữ chữ tiếng Anh gốc hoặc chính tả tiếng Anh, không phiên âm Việt) | câu/cảnh | trạng thái (“CHƯA KIỂM — giám đốc nghe” nếu chưa xác nhận). Giữ chính tả chuẩn ở phụ đề và chữ trên hình.
   - **Bản đồ ngữ nghĩa (D7, bắt buộc — bước Semantic Analysis → Keyword Extraction → Concept & Relationship Mapping):** bảng cho từng cảnh/lời: **ý chính** · **keyword** theo sáu loại (khái niệm chính · thuật ngữ kỹ thuật · đối tượng/thành phần · quan hệ giữa các thành phần · hành động/cơ chế · kết quả/hậu quả) · **keyword nào cần hiện chữ** (không bắt buộc keyword nào cũng có chữ; ưu tiên hình tự giải thích). Phân tích bằng cách **hiểu nội dung và quan hệ kỹ thuật**, không cắt ngắn câu thoại hay lấy từ khoá bằng regex. Chỉ giữ keyword thật sự có giá trị truyền tải. Cột “Chữ trên màn hình” lấy từ bảng này, không lấy từ câu thoại.
   - Kèm tiêu đề/mô tả/hashtag cho TikTok, Facebook Reels, YouTube Shorts. Mô tả kết thúc bằng câu khai báo AI (vd “Video có dùng hình ảnh và giọng đọc do AI tạo.”). Tình huống hư cấu ghi “(ví dụ dựng)” trong caption/mô tả, không đốt lên hình.
4. **Bảng ngân sách thời lượng ở cả plan và script:** tập/đoạn | nhãn | số từ hoặc âm tiết ước lượng | tốc độ mới (đơn vị/giây) | giây đọc | giây nghỉ Y7 | đuôi | tổng. Cộng (lượng lời từng đoạn ÷ tốc độ mới tương ứng) + tổng nghỉ (mỗi mốc tính một lần) + đuôi mặc định ≤ 0,7 s. Tổng 45–75 giây (chuẩn, D1), đo lại sau TTS. Quá trần thì rút mở hoặc còn một khái niệm/tập; giữ giới hạn và tốc độ. **Hệ số cho T9** (`docs/chat-luong-xem.md`, mục Ngân sách): ≈ 4,3 âm tiết/s giọng (T8 đo 3,84, cộng 10–15% theo Y6), mỗi thuật ngữ tiếng Anh +1 âm tiết; mỗi cảnh = max(lời + nghỉ, thời lượng tối thiểu theo độ phức tạp + giữ sau lời); tổng dự kiến ≈ 55–65 s (định dạng 150–190 s: ≈ 175–185 s).

## Chuẩn bắt buộc
Y1–Y8 là yêu cầu bắt buộc của giám đốc. Ngưỡng trải nghiệm R dưới đây là **ngưỡng thử, đánh giá lại sau 3 video**; chuẩn đầu ra vẫn **9:16, 1080×1920, 45–75 giây (chuẩn, D1)**, không kéo dài để thêm nội dung.
- **Y5/R1–R2:** trong 2 giây đầu cho thấy tình huống cụ thể, gần người xem bằng hình + câu ngắn; trước giây 5 rõ hệ quả gây tò mò. Có thể dẫn tới khoảng 8–12 giây nếu mỗi câu là một nhịp hình khác. Chuyển tự nhiên qua nguyên nhân → cơ chế → cách xử lý và quay lại vấn đề mở ở cuối. Tránh chào, định nghĩa khô hoặc trì hoãn khi chưa rõ hệ quả. Tình huống dựng và số/giờ minh hoạ ghi rõ là ví dụ, không giả người/sự kiện thật.
- **Y1/R3:** mặc định chỉ có phụ đề, không nhãn/chữ/hình thừa. Cột “Chữ trên màn hình” là nguồn duy nhất của chữ giải thích, kể cả nhãn UI/sơ đồ và chữ chốt. Ghi đúng từng chữ kèm lý do kỹ thuật hoặc để trống. Phụ đề là lớp accessibility riêng (52–60 px, ≤ 2 dòng, ≤ 28 ký tự/dòng, dải dưới), **không** phải visual chính — xem D7. Một tiêu điểm mỗi nhịp; chữ khoá ≤ 3 từ và ≥ 72 px, nhãn/mã ≥ 56 px, tối đa 3 nhóm đồng thời ngoài phụ đề. Cột “Chữ trên màn hình” chỉ chứa keyword/nhãn thành phần/số liệu/thông điệp ngắn, mỗi mục ghi **gắn vào đối tượng nào** và mốc hiện/ẩn; **tuyệt đối không chép lời thoại** (độ giống lời < 0,6).
- **Phạm vi chuẩn 45–75 s (từ 20/11/2026):** một câu hỏi + một sự cố + **1** cơ chế chính + ≥ 1 ví dụ cụ thể (giải thích sâu 150–190 s, chỉ khi giám đốc yêu cầu: 1–2 cơ chế); số cảnh ≲ thời lượng ÷ 5 s, trung bình ≥ 5 s/cảnh (cảnh dưới 3 s chỉ ở opening/hook). Khái niệm thứ hai chỉ đối chiếu hoặc đề nghị tách tập; chủ đề có hai khái niệm ngang nhau thì nói rõ ở đầu `plan.md` để Claude/giám đốc quyết.
- **R13 — Information Pacing:** mỗi cảnh một ý chính. Khai độ phức tạp **Low** (đơn giản, chuyển nhanh được) / **Medium** (có thuật ngữ hoặc quan hệ cần giải thích) / **High** (sơ đồ, nhiều thành phần, luồng xử lý) và số khái niệm mới (High ≤ 1, ≤ 2 mỗi 10 s). Gợi ý thời lượng tối thiểu 3/5/8 s (High được 10–20 s nếu có diễn tiến bên trong) và **giữ sau lời** 0,5/1,0/2,0–3,0 s với sơ đồ ở trạng thái hoàn chỉnh. Sơ đồ phức tạp ghi **từng bước** theo lời (vd Deadlock: A giữ Lock 1 → B giữ Lock 2 → A chờ Lock 2 → B chờ Lock 1 → vòng chờ → giữ hoàn chỉnh 2–3 s → rồi mới sang cơ chế xử lý). Không cắt cảnh ngay khi lời vừa dứt; khoảng giữ có highlight/chuyển động nhẹ, không phải màn hình chết. Tách rõ Speech Pace (đọc nhanh hơn, Y6) với Information Pace (kiến thức đến chậm hơn).
- **R14/R20/R21 — Opening và Header (sửa D8):** opening 1–8 s (mục tiêu 5–8 s, nguồn: `tools/config/pipeline-rules.json`) với ba pha, có thể có lời hook theo R26; tổng thời lượng đã gồm opening. Header là *page header* (dòng chủ đề + tiêu đề rút gọn/chương) **có ở mọi cảnh sau opening**, đủ lớn, đổi ô theo cảnh để không đè sơ đồ/Cáo/phụ đề. Trong “Bản đồ ngữ nghĩa” đánh dấu keyword **cần nhãn** (thuật ngữ/đối tượng được gọi tên) và cảnh trọng tâm cho kinetic (D8/R22).
- **R15 — Chiều sâu:** không kéo dài bằng cách viết thêm câu chữ; mỗi phần khó có ví dụ cụ thể; tránh đọc định nghĩa liên tục; không có đoạn chỉ đọc lý thuyết mà không minh hoạ.
- **R16 — Đồng bộ lời–hình:** mỗi thành phần hình xuất hiện cùng hoặc ngay sau (≤ 0,5 s) lúc lời nhắc tới, không trước lời; ghi mốc lời trong cột Hình ảnh để Producer khai `voice` ở `scenes.json`.
- **R11 — bằng chứng hình:** mỗi khẳng định kỹ thuật chính ở cột Hình ảnh/đồ hoạ ghi “Bằng chứng hình: …” = sự kiện làm khẳng định đó đúng (vd khoá → truy vấn thứ hai bị chặn, xếp chờ; không chỉ ổ khoá). Hệ quả/rủi ro: nêu rõ **ai/cái gì bị ảnh hưởng** và nhìn thấy gì. Chủ đề có đánh đổi: ít nhất một cảnh trước/sau hoặc đúng/sai. Sự cố ở hook có trạng thái nhìn thấy (vạch, đồng hồ, bộ đếm) và ghi nó đổi ở những nhịp nào (≥ 3 lần) rồi kết trả đúng chỗ.
- **R12 — đa dạng:** mỗi hồi kể chuyện nêu bối cảnh/khung riêng (không dồn quá ~40% thời lượng vào một nền; chủ đề phần mềm/CSDL nên có một cảnh màn hình truy vấn/terminal); cỡ cảnh luân phiên toàn–trung–cận.
- **R4–R6:** mô tả vật/quan hệ đổi nhìn ra ở 360×640 không cần đọc; mọi khoảng ≥ 1,5 s có đổi hình, tĩnh > 2 s ghi lý do; chip/pose/zoom < ~10% không tính. Cảnh trọng tâm có vật chính cao ≥ ~45% vùng an toàn (~560 px), lệch ghi lý do trong plan; Cáo nhìn/chỉ/phản ứng/đứng cạnh vật, không làm nhãn dán; vai phụ trong hook dùng hình khối/silhouette.
- **R7:** video ≥ 30 s hoặc ≥ 3 phần khuyến nghị 2–4 chip chương tick dần; `plan.md` ghi cách dùng, chữ trên chip theo Y1. Thumbnail là khung hook (tình huống/nghịch lý), đọc được ở 180×320, không bê cả lưới nhiều nhãn.
- **Y6–Y7/R8:** từ T9 tăng tốc độ đọc 10–15% so với T8 (`[dẫn]` `atempo` ≈ 1,13–1,18, `[kỹ thuật]` ≈ 1,07–1,12, trần 1,20), sinh theo câu/đoạn ý hoàn chỉnh; giám đốc nghe để tinh chỉnh. Mốc nghỉ tham khảo: phẩy 0,2–0,4 s, chấm 0,4–0,7 s, câu hỏi/ý quan trọng 0,7–1,2 s, chuyển ý 0,8–1,5 s.
  Ghi hiệu ứng hình/chuyển cảnh/âm thanh đi cùng khoảng nghỉ, có hình đổi đáng xem hoặc chuyển cảnh có chủ đích khi nghỉ dài. Giữ hình đủ lâu để hiểu. Duyệt lại mốc sau đo TTS, đuôi im mặc định ≤ 0,7 s, ngoại lệ ghi giây/lý do. Giữ 45–75 s (chuẩn, D1) và không tăng tốc để bù.
- Không có câu chào cố định: mở bằng hook theo chủ đề trong 2 giây đầu; dáng Cáo ở hook chọn theo nội dung hook. Đổi dáng cách nhau ≥ 2 giây. Cáo không nhép miệng.
- Văn phong theo `docs/mascot.md` (xưng "mình", gọi "bạn", câu ngắn 1 ý), tiếng Việt chuẩn có dấu.
- **Không bịa số liệu.** Mỗi sự kiện/số liệu ghi nguồn ở cuối `script.md`; chưa chắc thì đánh dấu `[CẦN KIỂM NGUỒN]` để Claude kiểm.
- Chỉ đưa thứ làm được bằng công cụ hiện có; không cảnh quay thật, không tài sản có bản quyền. Không viết code, không dựng video.
- **Y8:** bảng “Thuật ngữ & cách đọc” của bạn là đầu vào cho Producer: liệt kê **mọi** thuật ngữ tiếng Anh/kỹ thuật/viết tắt có trong lời đọc, kèm loại (đọc từng chữ cái hay đọc như một từ) và chữ đưa TTS đề xuất (chữ tiếng Anh gốc hoặc chính tả tiếng Anh như “you eye”; **không phiên âm kiểu Việt** — VieNeu tự đọc âm Anh từ chữ gốc). Producer chạy công cụ kiểm trên **cột lời đọc** của bảng cảnh rồi bổ sung mục thiếu vào từ điển riêng của video; chữ đưa TTS đề xuất chỉ dùng cho bản đưa TTS (chữ trên hình/phụ đề giữ chính tả chuẩn). Để công cụ đọc đúng: tiêu đề cột lời đọc phải chứa cụm “Lời đọc” (vd “Lời đọc/phụ đề”); mỗi ô chỉ gồm nhãn in đậm `**Lời N · mốc giây:**` rồi câu cần đọc, nhiều câu cách nhau bằng `<br>` — không chen ghi chú kỹ thuật vào ô này. Agent rà văn bản và đo thời lượng/khoảng nghỉ; phát âm/nhịp thật chờ giám đốc nghe.
- Không dịch vụ AI trả phí; luôn gắn nhãn AI. Không sao chép nội dung/cảnh/kịch bản video tham chiếu; chỉ học kỹ thuật làm phim.
- Chỉ ghi file trong thư mục chủ đề. Không sửa `brief.md`, `debate.md`, file review.

## Trả lời cuối (≤ 150 từ)
Liệt kê file đã ghi/sửa; với bản sửa: mỗi điểm góp ý → đã sửa thế nào (hoặc vì sao giữ nguyên); các chỗ `[CẦN KIỂM NGUỒN]`.

## B. Prompt dành cho Codex — CÙNG VIẾT kịch bản (dán toàn văn mục B này + "NGỮ CẢNH" vào file prompt)

Bạn là **đồng tác giả của vị trí Kịch bản** trong đội video ngắn dọc của kênh **Cáo văn phòng**. Claude đã lên plan và viết bản đầu (`concept.md`, `plan.md`, `epNN/script.md`); Claude sẽ **chốt**. Việc của bạn là viết phần đóng góp của mình ra **MỘT file riêng**, không sửa file của Claude. Giữ ngắn: bạn không viết lại cả kịch bản.

**Đọc** (đường dẫn tuyệt đối có trong NGỮ CẢNH): `brief.md`, `debate.md` (mục "Phán quyết cuối" là ràng buộc), `concept.md`, `plan.md`, `epNN/script.md`, `docs/chat-luong-xem.md`, và **mục A** của file `.claude/skills/make-plan/codex-script.md` (chuẩn viết). Bản N ≥ 2: đọc thêm `review/script-r<N-1>.md` và chỉ xử lý các điểm Claude nêu.

**Ghi** `review/script-codex-r<N>.md` (thư mục làm việc là thư mục chủ đề), đúng ba mục:
1. **Lỗi kỹ thuật và rủi ro chính xác** — mỗi lỗi: cảnh/mã lời, vì sao sai, cách sửa. Không có thì ghi "không thấy lỗi". Số liệu/sự kiện chưa chắc ghi `[CẦN KIỂM NGUỒN]`.
2. **Bản viết lại lời đọc cho các đoạn `[kỹ thuật]`** — chỉ những đoạn bạn thấy chính xác hơn, ngắn hơn hoặc dễ hiểu hơn bản của Claude. Mỗi đoạn: mã lời/mốc, **lời đọc mới nguyên văn** (trong cùng ngân sách âm tiết, theo bảng thuật ngữ và Y8, câu ngắn một ý, xưng "mình", gọi "bạn"), lý do một dòng. **Không** viết lại đoạn `[dẫn]`, hook, kết (của Claude).
3. **Bằng chứng hình (R11) còn thiếu** — khẳng định kỹ thuật chính nào chưa có sự kiện hình chứng minh; đề xuất một sự kiện/cảnh.

Tổng ≤ 600 từ. **Không** sửa `concept.md`, `plan.md`, `script.md`, `debate.md` hay file review khác. Không viết code, không dựng video, không dịch vụ AI trả phí. Chỉ ghi trong thư mục chủ đề.

**Trả lời cuối (stdout, ≤ 80 từ):** số đoạn đề xuất viết lại, số lỗi kỹ thuật, điểm quan trọng nhất.

Khai `voice_direction` theo `line_id` trong storyboard và dự kiến nhịp trong kịch bản. Ghi ý định, cảm xúc, cụm nhấn, tốc độ, nghỉ trước/sau, ngữ điệu và quan hệ chuyển ý theo R24.

## Luật chung: tên nền tảng (giám đốc chốt 21/11/2026 — CLAUDE.md luật 10)
Mọi video và bài đăng, trên mọi nền tảng: KHÔNG nói, KHÔNG viết tên thật của bốn nền tảng sau; dùng đúng cách gọi này ở lời đọc, phụ đề, chữ trên hình, tiêu đề, mô tả, hashtag, ảnh bìa.

| Nền tảng | Đọc thành tiếng | Viết |
|---|---|---|
| Facebook | phở bò | phở bò |
| YouTube | y tê bê | ytb |
| Zalo | dép lào | zép lào |
| TikTok | tóp tóp | tóp tóp |

Kịch bản ghi dạng *viết*; Sản xuất đưa dạng *đọc* vào TTS (`tools/voice/pronunciation.json`). Viết đúng như cột "Viết" (không viết hoa, không kèm tên thật trong ngoặc); hashtag = dạng viết bỏ dấu và bỏ khoảng trắng (`#phobo`, `#ytb`, `#zeplao`, `#toptop`). Đây là tên gọi thay thế, KHÔNG phải nghĩa đen: cấm hình, cảnh và chơi chữ về đồ ăn hay đôi dép vì tên này. Ngoại lệ người xem không thấy: khoá nền tảng trong `publish.json` (`tiktok`, `youtube_shorts`, `facebook_reels`), `notes.md`, mục nguồn và URL; không chép URL hay tên có chữ nền tảng thật vào mô tả đăng.
