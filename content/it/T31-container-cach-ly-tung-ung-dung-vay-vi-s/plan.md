# Plan — Chủ đề #31 (IT · đội #5) · bộ 1 tập

Chủ đề: Container cách ly từng ứng dụng, vậy vì sao một lỗi ở nhân Linux vẫn có thể ảnh hưởng cả máy chủ? (ví dụ thời sự nginx2root 11/2026). Concept: xem `concept.md`. Phạm vi: **một** câu hỏi, **một** sự cố, **một** cơ chế (nhân chung dựng tường), một ví dụ (nginx2root, nói mức "bộ lỗi nginx mới công bố"). Máy ảo chỉ đối chiếu. Không có hai khái niệm ngang nhau cần tách tập.

## Bảng các tập
| Mã video | Tên tập | Thời lượng mục tiêu | Thông điệp chính |
|---|---|---|---|
| IT-T31-E01 | Vá web xong, còn lớp nào? | ≈ 58 s (chuẩn 45–75 s, D1) | Container chung một nhân; nhân dựng tường nên lỗi nhân có thể làm tường yếu đi. Nhẹ và nhanh là lý do, cũng là giá. Vá nginx, rồi vá cả nhân máy chủ khi có bản. |

## Phong cách hình ảnh
- **Bộ nền theo ngữ cảnh** (cùng phong cách phẳng, bo góc, theme `security`):
  - Nền "bảng trực" `#0F1B2D` (S01, S02, S06, S09, S10): bảng ca trực với các ô trạng thái, hộp (container) là khối bo góc.
  - Nền "sơ đồ" `#16263F` (S03, S04, S05, S07, S08): hộp, tấm nền (nhân), bức tường, mũi tên.
  - Cảnh S09 có thêm một khung terminal nhỏ (R12) nền `#0A0F18`, chữ mono; chỉ một dòng lệnh, không hiện kết quả/số phiên bản.
  - Không dồn quá 40% thời lượng vào một nền (bảng trực ≈ 42% nhưng có hai biến thể bố cục; chấp nhận, ghi ở rủi ro).
- **Bảng nghĩa màu (dùng nhất quán):**
  | Màu | Hex | Nghĩa |
  |---|---|---|
  | Xanh lá | `#2BB673` | đúng / đã vá / an toàn |
  | Đỏ | `#E5484D` | sai / bị chiếm |
  | Vàng | `#F5B301` | đang xét / bị ảnh hưởng / cảnh báo |
  | Xanh dương | `#3FA7FF` | tấm nền = nhân Linux; tường do nhân dựng (nét liền) |
  | Xám xanh mờ | `#6B7A90` | chưa rõ / chưa công bố |
  | Cam | `#FF8A3D` | nhấn chữ khoá, Cáo |
  | Trắng ngà | `#F4F6FA` | chữ |
- **Vật chính (R5):** ba hộp trên một tấm nền, cao ≥ 560 px (≥ ~45% vùng an toàn) ở S03–S05, S08; hộp là vật thể đổi màu theo bảng nghĩa màu. Hộp web và hộp "thanh toán" là ví dụ dựng, không logo.
- **Font:** Segoe UI Bold cho chữ khoá/nhãn; Bahnschrift cho tiêu đề opening và header; Consolas cho khung terminal. Chữ khoá ≥ 72 px (≤ 3 từ), nhãn ≥ 56 px, header ≥ 52 px; phụ đề 52–60 px (lớp accessibility riêng).
- **Vùng an toàn:** nội dung y ∈ [250, 1500]; phụ đề dải y ≈ 1340–1500; đáy Cáo ≲ y 1290, khe ≥ 50 px với phụ đề.
- **Hình AI:** không cần ảnh AI; mọi cảnh dựng bằng component/Pillow (tấm nền, hộp, tường, mũi tên, terminal). Nếu Visual muốn ảnh nền chung, chỉ dùng nền trơn/gradient.
- **Không nhãn thừa:** không «AI tạo», không «Ví dụ dựng», không logo hãng, không số máy, không CVE/CVSS/tên SCTP.

## Opening và Header (R14/D8)
- **Tiêu đề opening** (do text engine vẽ, pha 3, giây 4,6–6,0, lý do "opening"): `Lớp nào chưa vá?`
- **Header** xuyên suốt từ S02 đến S10, đổi ô trái/giữa/phải theo cảnh để không đè sơ đồ/Cáo/phụ đề (vùng y ≈ 260–330). Dòng chủ đề cố định `IT · CONTAINER`; dòng chương đổi theo cảnh: S02 `NIỀM TIN SAI`, S03 `NHÂN CHUNG`, S04 `LỖI NHÂN`, S05 `MÁY ẢO`, S06 `VÍ DỤ`, S07 `CHƯA RÕ`, S08 `ĐÁNH ĐỔI`, S09 `VIỆC LÀM`, S10 `KẾT`.
- **Chip chương (R7)** nằm trong dải header, 3 chip tick dần: `SAI LẦM` (tick ở S02), `NHÂN CHUNG` (tick khi S03 bắt đầu, giữ qua S08), `VIỆC LÀM` (tick ở S09). Chữ chip theo Y1 (nhãn ngắn).
- **Thumbnail (R7)** = khung giây ≈ 3,0: bảng trực, hộp web xanh "ĐÃ VÁ", hộp bên cạnh vàng, ô "NHÂN" trống, Cáo chỉ. Đọc được ở 180×320; không kèm lưới nhiều nhãn.

## Bảng "Chiều sâu" (R15)
| Câu hỏi | Cảnh / lời trả lời | Ghi chú |
|---|---|---|
| Vấn đề thực tế | S01–S02: vá nginx xong định đóng ca, hộp bên cạnh đổi màu; niềm tin "chỉ mất cái hộp đó" | Tình huống dựng |
| Vì sao quan trọng | S04, S06: lỗi nhân có thể làm tường yếu đi; ví dụ nginx2root có thể làm nginx bị chiếm (chip đỏ, không phải cả hộp) | Hệ quả thấy ở hộp bên cạnh |
| Nguyên nhân/cơ chế | S03: các container chung một nhân, nhân dựng tường | Một cơ chế |
| Ví dụ giúp hình dung | S03 (ba hộp trên một nền) + S05 (đối chiếu máy ảo) + S06–S07 (nginx2root) | ≥ 1 ví dụ cụ thể |
| Hậu quả/sai lầm thường gặp | S02: coi container như máy ảo; S07: chỉ vá nginx, quên lớp nhân | |
| Giải pháp/bài học | S08 đánh đổi nhẹ/nhanh ↔ nhân chung; S09 vá nginx rồi vá nhân khi có bản (tick nhân chỉ sau xác nhận đã vá); S10 kêu gọi | |
Bỏ có chủ ý: lịch sử namespace/cgroup (vượt một cơ chế).

## Bản đồ Cáo (Y2–Y3)
| Cảnh | Cáo | Dáng | Mốc | Cỡ/vị trí | Hành vi (R6) |
|---|---|---|---|---|---|
| S01 opening | Có | `point_right` | 0,0–5,0 s | ≈ 16–18% rộng khung, trái dưới, đáy ≲ y 1290 | chỉ vào hộp bên cạnh khi nó đổi vàng (giây 2,6) |
| S02 | Có (ngắn) | `think` | 6,0–8,5 s | ≈ 14%, phải dưới | nhìn ba hộp, phản ứng với hộp web đỏ |
| S03–S09 | Không | | | | cảnh kỹ thuật dành cho minh hoạ |
| S10 kết | Có | `thumbs_up` | 53,5–58,0 s | ≈ 16%, giữa dưới | đứng cạnh bảng trực đã xanh |
Tổng thời gian có Cáo ≈ 12 s / 58 s ≈ 21% (≲ 25%). Cáo rời khung ở giây 5,0 (trước tiêu đề opening trọn vẹn) và vào lại ở giây 6,0 với dáng khác; mỗi lần đổi dáng cách nhau ≥ 2 s. Cáo không nhép miệng.

## Âm thanh (R25, `docs/asset-sources.md`)
Giọng TTS miễn phí (xem `docs/voice.md`). Nhạc nền **tắt** (`layers.music.enabled` mặc định). SFX tự tổng hợp trong `library/sfx/`: tick nhẹ (đổi trạng thái), whoosh ngắn (chuyển cảnh), "crack" mảnh khi vết nứt xuất hiện (S04), chuông cảnh báo rất nhỏ khi hộp đổi vàng/đỏ. Ducking dưới giọng. Không nhạc bên ngoài.

## Quy tắc phụ đề
Phụ đề đốt cứng = lớp accessibility riêng: 52–60 px, ≤ 2 dòng, ≤ 28 ký tự/dòng, dải y ≈ 1340–1500; nội dung = cột "Lời đọc/phụ đề". Chữ minh hoạ (cột "Chữ trên màn hình") là keyword/nhãn gắn vào đối tượng, không chép lời.

## Ngân sách thời lượng (hệ số T9: ≈ 4,3 âm tiết/s giọng; `[dẫn]` 4,6; `[kỹ thuật]` 4,3; thuật ngữ Anh +1 âm tiết; đuôi ≤ 0,7 s)
| Cảnh | Nhãn | Âm tiết | Tốc độ (âm tiết/s) | Giây đọc | Nghỉ Y7 + giữ | Đuôi | Tổng cảnh |
|---|---|---|---|---|---|---|---|
| S01 opening | dẫn | 16 | 4,6 | 3,5 | 2,5 | 0 | 6,0 |
| S02 | dẫn | 17 | 4,6 | 3,7 | 1,8 | 0 | 5,5 |
| S03 | kỹ thuật | 23 | 4,3 | 5,4 | 3,1 | 0 | 8,5 |
| S04 | kỹ thuật | 9 | 4,3 | 2,1 | 2,9 | 0 | 5,0 |
| S05 | kỹ thuật | 12 | 4,3 | 2,8 | 2,7 | 0 | 5,5 |
| S06 | kỹ thuật | 23 | 4,3 | 5,3 | 1,2 | 0 | 6,5 |
| S07 | kỹ thuật | 15 | 4,3 | 3,5 | 1,5 | 0 | 5,0 |
| S08 | kỹ thuật | 17 | 4,3 | 4,0 | 1,5 | 0 | 5,5 |
| S09 | kỹ thuật | 15 | 4,3 | 3,5 | 2,0 | 0 | 5,5 |
| S10 | dẫn | 15 | 4,6 | 3,3 | 1,0 | 0,7 | 5,0 |
| **Tổng** | | **162** | | **37,1** | **20,2** | **0,7** | **58,0** |
10 cảnh ≤ 58 ÷ 5 = 11,6; trung bình 5,8 s/cảnh. Duyệt lại mốc sau đo TTS; không tăng tốc để bù.

## Nguyên liệu cần
Chỉ nguồn trong `docs/asset-sources.md`: Cáo từ `brand/cao/poses/` (`point_right`, `think`, `thumbs_up`) hoặc production-pack; component chuyển động tự dựng (hộp, tấm nền, tường, mũi tên, thẻ tin, terminal, chip); SFX `library/sfx/`; TTS miễn phí. Không cần ảnh AI hay stock. **Cần giám đốc cung cấp:** không có.

## Tiêu chí nghiệm thu (đo được)
1. 1080×1920, 9:16, thời lượng 45–75 s (mục tiêu ≈ 58 s).
2. Hook trong 2 s đầu: hộp web chuyển xanh + câu "Vá nginx xong rồi, đóng ca nhé?"; hộp bên cạnh đổi vàng trước giây 5; tiêu đề opening hiện giây 4,6–6,0; opening 5–8 s.
3. Header có ở mọi cảnh sau opening, ≥ 52 px, không đè sơ đồ/Cáo/phụ đề.
4. Mỗi cảnh một ý; High ≤ 1 khái niệm mới; giữ sau lời đủ (S03 ≥ 2,4 s).
5. Có phụ đề (lớp riêng); `publish.json` đủ ba nền tảng, kèm khai báo AI và "ví dụ dựng" ở caption.
6. Chữ trên hình không chép lời; không nhãn «AI tạo/Ví dụ dựng»; không logo; không CVE/CVSS/SCTP/số máy/tình trạng bản vá.
7. Trạng thái sự cố đổi ≥ 3 lần rồi trả đúng chỗ (xem script, bảng R11).
8. Từ tên nền tảng: không có tên thật của bốn nền tảng trong lời, phụ đề, chữ hình, tiêu đề, mô tả, hashtag.

## Rủi ro & dự phòng
| Rủi ro | Dự phòng |
|---|---|
| Bị hiểu là "container vô dụng" (FUD) | S08 nói rõ "vẫn đáng dùng"; không dùng từ "sập"; vết nứt chỉ làm tường nét đứt và hộp viền vàng |
| Nói quá về nginx2root (root ngay, quy mô) | Lời S07 cố định: "liên quan tới nhân, chi tiết chưa công bố đầy đủ"; mũi tên đứt nét, ô nhân mờ có dấu "?"; không số máy, không bản vá |
| Nền "bảng trực" chiếm ≈ 42% | Hai biến thể bố cục (bảng ca trực / thẻ tin) và đan xen với nền sơ đồ; nếu QC chê, đổi S06 sang nền sơ đồ |
| Sơ đồ S03 quá dày | Dựng từng bước theo lời; Visual có thể bỏ nhãn "TƯỜNG" nếu đủ rõ bằng nét liền |
| Máy ảo bị hiểu là luôn khoanh được lỗi | Lời chỉ nói "mỗi hộp có một nhân riêng"; hình chỉ minh hoạ một nhân khách nứt |
| TTS đọc "nginx" sai | Dùng chữ đưa TTS "engine x" (xem bảng thuật ngữ); giám đốc nghe |
| Nguồn Cloudflare đọc qua bản tóm tắt máy | Gemini kiểm chứng ở bước chốt; các câu bám nguồn đã giữ ở mức "có thể", "chưa công bố đầy đủ" |
