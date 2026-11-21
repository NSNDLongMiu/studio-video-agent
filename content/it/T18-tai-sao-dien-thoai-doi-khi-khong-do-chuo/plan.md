# Plan bộ video · T18 "Im lặng không tắt báo thức. Vậy ai tắt?"

Bản 1 · 21/11/2026 · 1 tập · chuẩn 45–75 s (dự kiến ≈ 62,8 s, đo lại sau TTS). Một câu hỏi, một sự cố, **một** cơ chế chính (âm báo là cài đặt riêng của báo thức), một ví dụ (lỡ chọn "Không có" khi cuộn danh sách âm). Khái niệm thứ hai (app tải về trên Android: Doze, quyền báo thức chính xác) chỉ một câu, đề nghị tách E02.

## Bảng các tập
| Mã video | Tên tập | Thời lượng mục tiêu | Thông điệp chính |
|---|---|---|---|
| IT-T18-E01 | Đúng giờ, chỉ rung | 55–65 s (dự kiến ≈ 62,8 s, trần 75 s) | Nút Im lặng của iPhone không tắt báo thức; thủ phạm thường là âm báo để "Không có" trong chính báo thức; kiểm 10 giây và thử báo thức một phút nữa. |

Nếu đo sau TTS vượt 72 s: (1) gộp S10–S11; (2) bỏ S09 (app tải về) xuống caption; (3) giảm giữ sau lời S07–S08 về mức tối thiểu; không tăng tốc để bù (Y6).

## Phong cách hình ảnh
- **Khung 9:16, 1080×1920**, vùng an toàn y∈[250, 1500]; phụ đề dải dưới y≈1340–1500 (lớp riêng, 52–60 px, ≤ 2 dòng, ≤ 28 ký tự/dòng).
- **Giao diện giả lập trung tính:** màn hình báo thức, danh sách âm, thanh trượt, công tắc đều tự vẽ, **không logo, không tên hãng, không chụp màn hình thật**. Hai cột iPhone/Android chỉ khác bố cục (công tắc cạnh bên và nút bấm vs thanh trượt), không dùng biểu tượng hãng.
- **Bộ nền theo ngữ cảnh (cùng phong cách phẳng 3D nhẹ, cùng bảng màu), không nền nào > 40%:**
  | Nền | Cảnh | ≈ % |
  |---|---|---|
  | Phòng ngủ (tối → sáng ban mai) | S01–S02, S12 | 21% |
  | Màn hình điện thoại giả lập (xám sáng) | S03, S05, S10, S11 | 30% |
  | Sơ đồ nền xanh đậm có lưới | S04, S06 | 17% |
  | So sánh hai cột (tím đậm) | S07–S09 | 32% |
- **Bảng màu:** nền tối `#14192B`, nền giao diện `#F4F6FA`, chữ `#FFFFFF`, Cáo cam `#F28C28`.
- **Bảng nghĩa màu (dùng nhất quán):**
  | Màu | Hex | Nghĩa |
  |---|---|---|
  | Đỏ | `#E74C3C` | lỗi/âm báo "Không có"/loa bị gạch (hook, trạng thái sai) |
  | Xanh lá | `#2ECC71` | đúng/đã kiểm được/chuông kêu (kết) |
  | Vàng | `#F5B731` | tuỳ máy, đang xét, ngoại lệ Android |
  | Cyan | `#38BDF8` | âm lượng, thanh trượt, đường âm |
  | Cam | `#F28C28` | Cáo, nhấn tiêu điểm |
- **Font:** Be Vietnam Pro hoặc Segoe UI Bold. Chữ khoá ≤ 3 từ, ≥ 72 px; nhãn ≥ 56 px; tối đa 3 nhóm chữ cùng lúc ngoài phụ đề và header.
- **Vật chính (R5):** màn hình báo thức/danh sách âm/thanh trượt cao ≥ ~560 px trong vùng an toàn ở S03–S11; ở S01–S02 điện thoại trên đầu giường cao ≥ ~560 px (cận); lệch thì Producer ghi lý do ở `scenes.json`.
- **Thumbnail (R7):** khung hook: điện thoại đầu giường sáng, biểu tượng loa gạch đỏ + vạch rung, Cáo ngủ cạnh. Đọc được ở 180×320, không bê lưới nhiều nhãn.
- **Chip chương (R7):** 4 chấm không chữ trong ô header, tick dần: Sự cố · Cơ chế · Tuỳ máy · Kiểm (tránh chữ thừa Y1).

## Opening và Header (R14, D8)
- **Tiêu đề opening:** `ĐÚNG GIỜ, CHỈ RUNG` (S01–S03, animation vào một lần, kinetic; opening 8,0 s, có lời hook; lý do: opening R14/R26).
- **Header:** `BÁO THỨC / ÂM BÁO` từ S01 đến hết S12, xuyên suốt, mép trên (x≥100, y≈265), đổi ô trái/phải theo cảnh để không đè điện thoại/Cáo/phụ đề (lý do: header D8/R21).
- Opening ba pha (R26): giây 0–3,2 hình rung không tiếng, Cáo bật dậy, lịch họp đã bắt đầu; giây 3,2–5,6 gạt nút Im lặng, báo thức vẫn "đi đường riêng"; giây 5,6–8,0 mở báo thức, thấy mục Âm báo "Không có" (trả câu hỏi ≈ 7,6 s).

## Âm thanh (R25, `docs/asset-sources.md`)
- Giọng VieNeu (Bắc), `[dẫn]` `atempo` ≈ 1,13–1,18, `[kỹ thuật]` ≈ 1,07–1,12 (trần 1,20). Không nhạc nền (`layers.music.enabled` mặc định tắt).
- Hiệu ứng tự tổng hợp, dưới giọng: tiếng rung điện thoại nhẹ (S01–S02), "tick" khi công tắc gạt/hàng danh sách chọn, chuông báo thức tổng hợp ngắn (S11, S12) — chuông chỉ vang sau khi hình đổi sang trạng thái đúng. Ducking dưới giọng.
- Cuesheet/stem theo `cuesheet.py`/`mix.py`; Producer nghe kiểm.

## Phụ đề
Lớp accessibility riêng, dải dưới; không phải visual chính (D7). Ngắt theo ý, không chép lên cột "Chữ trên màn hình".

## Bản đồ Cáo (Y2–Y3)
Tổng thời gian có Cáo ≈ 13,4 s / 62,8 s ≈ 21% (≲ 25%).
| Cảnh | Mốc (s) | Dáng | Cỡ/vị trí | Hành vi |
|---|---|---|---|---|
| S01 mở | 0,00–2,00 | `sleep` | lớn (≤ 1,5× nguồn), cạnh đầu giường, đáy y≈1290 | ngủ cạnh điện thoại đang rung |
| S01–S02 mở | 2,00–5,60 | `surprised` | lớn như trên | bật dậy, nhìn điện thoại; ngón tay gạt công tắc Im lặng |
| S05 giữa | 14,10–16,50 | `shrug` | rộng ≈ 160 px, x≈105, đáy y≈1270 | nhún vai ("lỡ tay") cạnh danh sách âm |
| S11 giữa | 50,00–52,40 | `idea` | ≈ 170 px, đáy y≈1290 | chỉ vào đồng hồ ("đừng đoán, thử đi") |
| S12 kết | 59,80–62,80 | `thumbs_up` | ≈ 180 px, x≈105, đáy y≈1290 | hướng về người xem khi mời gõ bình luận |
S03–S04, S06–S10 không có Cáo (dành diện tích cho giao diện và thanh trượt). Đổi dáng cách nhau ≥ 2 s; Cáo không nhép miệng.

## Bảng "Chiều sâu" (R15)
| Câu hỏi | Cảnh/lời trả lời | Ghi chú |
|---|---|---|
| Vấn đề thực tế | S01–S03, lời 01–04 | báo thức đúng giờ mà chỉ rung, trễ họp (ví dụ dựng) |
| Vì sao quan trọng | S01–S02 | lỡ họp; hiểu lầm "nút Im lặng tắt báo thức" khiến người ta sửa nhầm chỗ |
| Nguyên nhân/cơ chế | S04, lời 05–06 | âm báo là cài đặt riêng của từng báo thức; "Không có" → chỉ rung |
| Ví dụ giúp hình dung | S05, lời 07 | lỡ tay chọn "Không có" khi cuộn danh sách âm (ví dụ dựng) |
| Hậu quả/sai lầm thường gặp | S06–S08, lời 08–12 | đổ lỗi nút Im lặng; vặn âm lượng video tưởng đã đủ; chưa biết Android có thể chặn qua Không làm phiền |
| Giải pháp/bài học | S10–S12, lời 14–18 | kiểm Âm báo, kéo âm lượng, thử báo thức một phút nữa, đừng đoán |

## Ngân sách thời lượng (≈ 4,3 âm tiết/s; thuật ngữ Anh +1; đuôi ≤ 0,7 s)
| Đoạn | Nhãn | Âm tiết | Tốc độ (âm tiết/s) | Giây đọc | Nghỉ Y7 + giữ (s) | Đuôi (s) | Tổng (s) |
|---|---|---|---|---|---|---|---|
| Opening/hook (S01–S03) | dẫn/kỹ thuật | 25 | 4,3 | 5,82 | 2,18 | 0 | 8,0 |
| Cơ chế + ví dụ (S04–S05) | kỹ thuật/dẫn | 28 | 4,3 | 6,51 | 4,49 | 0 | 11,0 |
| Sai lầm + âm lượng (S06–S07) | dẫn/kỹ thuật | 34 | 4,3 | 7,91 | 4,59 | 0 | 12,5 |
| Android (S08–S09) | kỹ thuật | 35 | 4,3 | 8,14 | 3,86 | 0 | 12,0 |
| Kiểm + thử (S10–S11) | dẫn | 28 | 4,3 | 6,51 | 4,99 | 0 | 11,5 |
| Kết (S12) | dẫn | 27 | 4,3 | 6,28 | 0,92 | 0,6 | 7,8 |
| **Tổng** | | **177** | | **41,2** | **21,0** | **0,6** | **≈ 62,8** |
Tốc độ 4,3 đã gồm uplift Y6. 12 cảnh ≤ 62,8 ÷ 5 = 12,6; trung bình 5,2 s/cảnh; cảnh dưới 3 s chỉ ở opening (S02, S03). Chi tiết từng cảnh trong `script.md`. Phần Android (S08–S09) = 12 s ≈ 19% (< 20% theo phán quyết); nếu vượt sau TTS thì bỏ S09 trước (xem dự phòng).

## Nguyên liệu cần (chỉ nguồn trong `docs/asset-sources.md`)
- Giọng VieNeu (Bắc), Cáo từ `brand/cao/poses` (`sleep`, `surprised`, `shrug`, `idea`, `thumbs_up`), đồ hoạ tự vẽ bằng Remotion/Pillow (điện thoại, danh sách âm, thanh trượt, công tắc, sơ đồ hai nhánh), hiệu ứng và chuông tự tổng hợp.
- Nền ảnh (không bắt buộc): phòng ngủ có thể vẽ phẳng; nếu cần ảnh do Gemini sinh theo brief của Claude sau khi storyboard `APPROVED`, không chữ/logo/người (tối đa 4 cảnh).
- **Cần giám đốc cung cấp:** không có. (Giám đốc nghe kiểm cách đọc iPhone, Android, iOS twenty seven, "Âm báo"; xem E02 có muốn làm không.)

## Tiêu chí nghiệm thu
- 1080×1920, 9:16, 45–75 s (dự kiến ≈ 63 s); có phụ đề; không nhạc nền; header `BÁO THỨC / ÂM BÁO` từ S01 đến S12; opening 5–8 s có lời hook, hook rõ trong 2 s đầu, hệ quả ("Họp bắt đầu rồi") trước giây 4 và ích lợi đầu trước giây 5.
- Mọi khẳng định kỹ thuật chính có "Bằng chứng hình"; trạng thái âm của báo thức (loa gạch đỏ → mục đỏ → nhánh rung → thanh nhỏ → loa xanh) đổi ≥ 3 lần rồi kết trả đúng chỗ.
- Không nhãn «AI tạo», không «Ví dụ dựng», không logo/tên hãng trên hình; khai báo AI và "(ví dụ dựng)" chỉ ở caption/`publish.json`.
- Mọi khẳng định có nguồn cuối `script.md`; thuật ngữ đọc đúng; `publish.json` đủ 3 nền tảng.

## Rủi ro & dự phòng
| Rủi ro | Dự phòng |
|---|---|
| Hiểu thành "Im lặng không bao giờ tắt báo thức" trên mọi máy | hình công tắc là iPhone; lời S08 nói rõ Android "tuỳ máy", Không làm phiền có thể làm im báo thức (Clock Help) |
| Tên mục "Âm báo/Không có/Nhạc chuông và Cảnh báo/Báo thức và lời nhắc" khác theo ngôn ngữ/phiên bản/hãng | nói "tuỳ máy" ở lời và nhãn vàng; [CẦN KIỂM NGUỒN: tên Việt hoá từng mục] |
| iOS 27 chưa phải máy nào cũng có | lời "iOS twenty seven cho tách riêng" kèm "mặc định dùng chung"; không nói "iOS mới nhất" |
| App báo thức tải về thường được cấp quyền sẵn (alarm clock app) | S09 chỉ "xem thêm mục", giới hạn thể hiện bằng viền vàng + chấm "?" cạnh công tắc, không thêm nhãn chữ (chốt Rescue 21/11, ngân sách chữ R22); không nói app bị lỗi |
| "Chỉ rung" chỉ đúng khi rung đang bật | hình S04 vẽ sóng rung; Android: Clock cảnh báo khi âm silent + rung tắt (không đưa vào lời, chỉ nguồn) |
| Vượt 72 s sau TTS | gộp S10–S11 / bỏ S09 / giảm giữ S07–S08 |
| Thuật ngữ iPhone/Android/iOS/app/video đọc sai | bảng Thuật ngữ & cách đọc; giám đốc nghe |

## Giả định (không hỏi lại, ghi để giám đốc chỉnh)
1. iPhone nói trước; công tắc Im lặng chỉ có trên iPhone nên cơ chế chính ghi cho iPhone, Android là nhánh phụ có nguồn Google.
2. Tình huống họp trễ là ví dụ dựng, nhân vật Cáo; không giờ giấc cụ thể trong lời.
3. Không nhạc nền, giọng VieNeu Bắc, chuông báo thức là SFX tự tổng hợp.
4. Không đề cập Doze, Standby bucket, `SCHEDULE_EXACT_ALARM`, Attention Aware, Bluetooth riêng, loa phòng khách, "bài hát xoá → None" (đề nghị E02 cho phần app tải về).
