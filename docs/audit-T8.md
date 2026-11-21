# Audit IT-T8-E01 và cách pipeline dẫn tới các lỗi giám đốc nêu (19/11/2026)

Đối tượng: `content/it/T8-tien-ich-chrome-ai-co-the-doc-len-cuoc-t/ep01/final/IT-T8-E01_9x16.mp4` (T8 là mã chủ đề #8, giám đốc hay gọi “T8”; “T9” là chủ đề #9). **ffprobe đo 41,9 s, không phải 47 s** — bản ghi nhận 47 s có thể đến từ nguồn khác; mọi số dưới đây lấy từ tệp này. Phương pháp: `assets/voice/{apply,timeline,measurements}.json`, `assets/scenes.json`, `qc-measure` và QC lượt 1–2 (`notes.md`). Âm thanh không nghe được: mọi nhận xét về độ tự nhiên là **CHƯA KIỂM**, chỉ số tốc độ/nghỉ là số đo.

## 1. Bảy vấn đề giám đốc nêu → bằng chứng → quy tắc gây ra

| # | Vấn đề | Bằng chứng đo được | Quy tắc/thói quen pipeline gây ra |
|---|---|---|---|
| 1 | Giọng nhả chữ chậm, thiếu nhịp | 122 âm tiết trong 31,8 s giọng = **3,84 âm tiết/s** theo thời lượng đọc từng câu (`qc-measure` chỉ tính phần có tiếng: 29,15 s → **4,19 âm tiết/s**, tỉ lệ lặng 30,4%); mỗi câu một clip, 17 clip, nghỉ sau câu 0,41–0,95 s (TB 0,59 s, tổng 10,1 s = **24%** thời lượng); `atempo` 0,97–1,03 | Y6 (xuống ~0,97–1,03), hiệu chỉnh ngân sách “4,0 âm tiết/s” do thư ký đặt sau T5, Y7 nghỉ sau từng câu → nhịp đều như đếm |
| 2 | Tốc độ đọc chậm nhưng kiến thức đến quá nhanh | 10 cảnh/41,9 s, **mỗi cảnh một cơ chế mới** (đường sao chép, hộp quyền, hai luồng dữ liệu, đợt 30 phút, màn quản lý, bản cũ ở máy chủ, ba thẻ giữ lại); cảnh sơ đồ phức tạp 04–06 dài 3,9 / **3,0** / 5,5 s | Không có khái niệm “độ phức tạp thông tin”; R4/R8 chỉ hỏi “có đổi hình” và dải nghỉ Y7 theo dấu câu, không theo độ khó của hình |
| 3 | Quá ngắn để giải thích đủ | Trần 45 s dùng 93%; kế hoạch đặt mục tiêu ≤ 42 s | Trần 15–45 s (18/11), phạm vi “một khái niệm + một sự cố, ≤ 12 cảnh” (T6) |
| 4 | Thiếu mở đầu thu hút | Cảnh 01 vào hook ở 0,00 s, không có opening | R1/Y5 đòi hook trong 2 giây đầu; không có luật opening |
| 5 | Không header nhận diện chủ đề | Không có chữ chủ đề ở bất kỳ khung nào | Y1 chỉ cho chữ trong cột “Chữ trên màn hình” và phụ đề |
| 6 | Thiếu thời gian quan sát | Giữ sau lời trước cú cắt: **0,49–0,95 s** mọi cảnh; cảnh sơ đồ hai luồng (05) 0,73 s, cảnh đợt 30 phút (06) 0,72 s; cảnh 01 lời chạy **qua** cú cắt (−0,71 s) | Mốc cảnh bám lời (R8: “đo TTS rồi duyệt lại mốc”) nên cảnh khép ngay sau lời |
| 7 | Thiếu chiều sâu và ví dụ | 17 câu/122 từ; chỉ có định nghĩa → cơ chế → ba lời khuyên; không mục “ví dụ”, “sai lầm thường gặp” | Ngân sách 45 s buộc cắt; Kịch bản chưa có khung câu hỏi chiều sâu |

Ghi chú quan trọng: thử trực tiếp VieNeu trên một câu mới cho 4,25–4,6 âm tiết/s có tiếng khi bỏ mọi khoảng lặng (`atempo` 1,0; so với 4,19 của T8 sau `atempo` 0,97–1,03 và nghỉ sau câu) (thử `temperature` 0,4–0,65 và `silence_p` 0–0,15 chỉ đổi ±5%, nghỉ trong câu chỉ ≈ 6% thời lượng clip). Nghĩa là **nhịp “chậm” đến chủ yếu từ nghỉ đều sau mọi câu và hệ số hậu kỳ ≈ 1,0**, không phải từ khoảng ngắt trong câu. Cách sửa phải nhắm hai chỗ đó, không chỉ nhân `atempo`.

## 2. Giữ nguyên (đã thống nhất, đang hoạt động tốt)
9:16 1080×1920; không nhạc nền; không AI trả phí; khai báo AI ở `publish.json` và công tắc nền tảng, **không nhãn AI/“ví dụ dựng” trên hình**; từ tiếng Anh giữ chữ gốc để đọc âm Anh (`phonemes.py`); Y4 nhất quán phong cách, đa dạng bối cảnh; R11 bằng chứng hình; R12 khai camera = dựng được; QC đo độc lập bằng `qc-measure`, báo cáo có mốc + bằng chứng; Cáo gián đoạn, đổi dáng bằng cắt; chính xác và nguồn là điều kiện cần.

## 3. Thay đổi pipeline đề xuất và đã thực hiện (chi tiết: `docs/chat-luong-xem.md`, mục “Chuẩn video giải thích sâu”)
1. **Thời lượng:** định dạng giải thích sâu mục tiêu ≈ 180 s, chấp nhận 150–190 s; giữ định dạng ngắn 15–45 s chỉ khi giám đốc yêu cầu. Lưu ý nền tảng: YouTube Shorts tối đa 3 phút, nên trên 180 s không còn là Shorts (QC cảnh báo; trên 190 s là lỗi).
2. **Hai nhịp tách bạch (R13):** Speech Pace (+10–15% so với T8, đo bằng công cụ) và Information Pace (mỗi cảnh một ý chính; khai độ phức tạp Low/Medium/High; thời lượng tối thiểu và giữ-sau-lời theo mức; sơ đồ dựng từng bước, giữ trạng thái hoàn chỉnh 2–3 s; không cắt ngay khi lời vừa dứt).
3. **Opening + header (R14):** opening 1–3 s bằng chữ do engine của pipeline; header nhỏ trong vùng an toàn, ẩn được.
4. **Chiều sâu kịch bản (R15):** khung sáu câu hỏi; tình huống → vấn đề → nguyên nhân → minh hoạ → giải pháp → bài học; có ví dụ cụ thể.
5. **Đồng bộ lời–hình (R16):** thành phần sơ đồ xuất hiện cùng hoặc ngay sau lời nhắc, không trước.
6. **QC:** thêm Audio QC, Visual QC, Information QC; `qc-measure` đo tốc độ đọc, giữ-sau-lời, khai báo độ phức tạp, opening, header, đồng bộ khai báo so với đo thật; mọi chỉ số công cụ không xác nhận được ghi “CHƯA KIỂM — kiểm thủ công”.
7. **Hạ tầng:** nới thời gian chạy tối đa của việc nền cho video dài (plan, sản xuất, ghi file của Codex) — cần khởi động lại worker.
8. **Cáo nhỏ và ít hơn;** thay phạm vi “≤ 12 cảnh” bằng ngưỡng theo thời lượng.

## 4. Audit chữ trên hình: pipeline chuyển lời thoại thành chữ ở đâu (bổ sung 19/11/2026, yêu cầu Visual-first)
**Số đo T8 / T5:** phụ đề đốt cứng hiện **76% / 80%** thời lượng; 122 / 113 từ chữ chép nguyên văn lời; chữ nhãn trong hình chỉ 29 từ (T8, 5/10 cảnh có chữ); phụ đề Segoe UI Bold **70 px** (T5: 56 px), viền 5 px, đặt ở hai style `Upper` (y≈258 từ trên) hoặc `Lower` (MarginV 436), tức giữa khung và là phần chữ lớn nhất. Cảnh 01 và 02 của T8 chỉ có hình + phụ đề.
**Các điểm trong pipeline đang biến lời thoại thành chữ:**
1. **Producer → phụ đề đốt cứng** (`captions.srt` → ASS → `subtitles` filter): chép 100% lời, đặt như một phần của bố cục. Đây là nguồn chữ chính.
2. **Luật “phụ đề là kênh duy nhất chép lời” + “phụ đề thử ≥ 64 px”** (`docs/chat-luong-xem.md` Y1/R3, `codex-script.md`, `codex-storyboard.md`, `AGENTS.md`): hợp thức hoá việc chữ chép lời, còn đẩy cỡ lên cho nổi.
3. **Không có bước phân tích ngữ nghĩa:** template Kịch bản chỉ có cột “Chữ trên màn hình” do người viết tự điền (≤ 3 nhóm); template Đạo diễn hình ảnh có `text_overlay` và `voice_over` (bản sao lời) nhưng không có kế hoạch keyword → hình. `voice_over` trong storyboard là chuỗi nguyên văn nên các renderer có thể đưa thẳng lên màn hình.
4. **Các component có sẵn thiên về chữ:** Remotion `ExplainerScene`/`UiSimulationScene` dựng từ danh sách bước có `text`; mã Pillow mỗi tập tự viết lại (`assets/_scratch/*.py`, bị `.gitignore`), không có thư viện dùng chung cho request/flow/status/chart/kinetic.
5. **QC** chỉ kiểm “chữ ≤ 3 nhóm, ≥ 56/72 px, không chép lời ngoài phụ đề” — chữ phụ đề được miễn nên không ai chặn.
**Thay đổi:** D7 (docs/chat-luong-xem.md): phụ đề thành lớp accessibility riêng (52–60 px, dải dưới), chữ minh hoạ chỉ là keyword/nhãn gắn vào đối tượng; thêm bước Semantic Analysis → Keyword Extraction → Concept & Relationship Mapping (Kịch bản) và `semantic_plan` (Đạo diễn hình ảnh); thư viện `tools/motion/` và danh mục `docs/motion-components.md`; QC đo chữ lặp lời, lượng chữ, kinetic, cỡ/dải phụ đề (`text_audit`).

## 5. Rủi ro đã biết khi làm video 3 phút
- Dựng bằng Pillow+FFmpeg tốn thời gian gần tuyến tính theo độ dài: T8 (41,9 s) mất khoảng 50 phút Codex; T9 có thể mất 3–4 giờ và nhiều lần thử lại. Đã nâng giới hạn thời gian; có thể vẫn cần `/rescue`.
- Chưa có bằng chứng thực tế người xem giữ chân khi video dài; số liệu ngưỡng là **ngưỡng thử**, đánh giá lại sau T9.
- Phát âm, độ tự nhiên, độ méo khi tăng tốc: **CHƯA KIỂM**, chờ giám đốc nghe.
