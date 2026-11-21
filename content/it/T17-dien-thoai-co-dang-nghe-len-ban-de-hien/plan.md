# Plan bộ video · T17 "Điện thoại có đang nghe lén bạn để hiện quảng cáo?"

Bản 1 · 20/11/2026 · 1 tập · chuẩn 45–75 s (dự kiến ≈ 67–68 s, đo lại sau TTS). Một câu hỏi, một sự cố, **một** cơ chế chính, một ví dụ (đôi giày).

## Bảng các tập
| Mã video | Tên tập | Thời lượng mục tiêu | Thông điệp chính |
|---|---|---|---|
| IT-T17-E01 | Đôi giày chưa từng tìm | 55–65 s (dự kiến ≈ 67,6 s, trần 75 s) | Chưa có bằng chứng micro nghe lén; quảng cáo vẫn có thể trúng nhờ hồ sơ suy ra từ dấu vết; một lần trùng chưa đủ để kết luận. |

Nếu đo sau TTS vượt 72 s: (1) rút lời 13 hoặc gộp S04–S05; (2) giảm "giữ sau lời" ở S08–S09 về mức tối thiểu; không tăng tốc để bù (Y6).

## Phong cách hình ảnh
- **Khung 9:16, 1080×1920**, vùng an toàn y∈[250, 1500]; phụ đề dải dưới y≈1340–1500 (lớp riêng, 52–60 px, ≤ 2 dòng, ≤ 28 ký tự/dòng).
- **Giao diện giả lập trung tính:** điện thoại, bảng tin, trang cửa hàng, bảng chọn của nhà bán, màn hình cài đặt đều là đồ hoạ tự vẽ, **không logo, không tên hãng** (hook của giám đốc nhắc Facebook; hình không gắn hãng nào, xem Giả định).
- **Bộ nền theo ngữ cảnh (cùng phong cách phẳng 3D nhẹ, cùng bảng màu), không nền nào > 40%:**
  | Nền | Cảnh | ≈ % |
  |---|---|---|
  | Bàn ăn (ấm) | S01–S02, S11 | 26% |
  | Màn hình điện thoại / trang cửa hàng giả lập | S03–S05, S10 | 25% |
  | Nền dữ liệu (tối, hạt sáng) | S06–S07 | 19% |
  | Bàn nghiên cứu / lưới ứng dụng | S08 | 15% |
  | Phòng họp, tấm slide chào bán | S09 | 13% |
- **Bảng màu:** nền tối `#0F1B2D`, nền ấm bàn ăn `#3A2A1F`, chữ `#FFFFFF`, Cáo cam `#F28C28`.
- **Bảng nghĩa màu (dùng nhất quán):**
  | Màu | Hex | Nghĩa |
  |---|---|---|
  | Cyan | `#38BDF8` | dấu vết/dữ liệu hành vi (chấm, ngăn "dấu vết", hồ sơ) |
  | Vàng | `#F5B731` | đang xét/chưa kiểm chứng/"có thể" (micro, viền nét đứt của quảng cáo, lời chào bán) |
  | Xanh lá | `#2ECC71` | đã kiểm được (khung nghiên cứu) |
  | Đỏ | `#E74C3C` | cảnh báo/nghi ngờ (chỉ ở vòng nghi của hook S02) |
  | Cam | `#F28C28` | Cáo, nhấn tiêu điểm |
- **Font:** Be Vietnam Pro hoặc Segoe UI Bold. Chữ khoá ≤ 3 từ, ≥ 72 px; nhãn ≥ 56 px; tối đa 3 nhóm chữ cùng lúc ngoài phụ đề và header.
- **Vật chính (R5):** ở S01–S07 và S10–S11 điện thoại hoặc thẻ chính cao ≥ ~560 px trong vùng an toàn; S08 lưới ứng dụng cao ≥ 560 px; S09 tấm slide cao ≥ 560 px. Nếu lệch, producer ghi lý do ở `scenes.json`.
- **Thumbnail (R7):** khung hook: bàn ăn, điện thoại hiện thẻ quảng cáo giày, biểu tượng micro vàng có dấu hỏi. Đọc được ở 180×320; không bê lưới nhiều nhãn.
- **Chip chương (R7):** không dùng chip chữ (tránh chữ thừa Y1). Dùng 4 chấm tiến độ không chữ trong ô header, tick dần: Tình huống · Cơ chế · Bằng chứng · Việc làm.

## Opening và Header (R14, D8)
- **Tiêu đề opening:** `ĐÔI GIÀY CHƯA TỪNG TÌM` (S01–S02, animation vào một lần; opening 6,9 s, có lời hook; lý do: opening theo R14/R26).
- **Header:** `BẢO MẬT / QUẢNG CÁO` từ S01 đến hết S11, xuyên suốt, gắn mép trên của nền (x≥100, y≈265), đổi ô theo cảnh để không đè sơ đồ/Cáo/phụ đề (lý do: header theo D8/R21, giám đốc yêu cầu).

## Âm thanh (R25, `docs/asset-sources.md`)
- Giọng VieNeu (Bắc), `[dẫn]` `atempo` ≈ 1,13–1,18, `[kỹ thuật]` ≈ 1,07–1,12 (trần 1,20). Không nhạc nền (`layers.music.enabled` mặc định tắt).
- Hiệu ứng nhẹ tự tổng hợp: tiếng thông báo mềm khi quảng cáo hiện (S01, S07), tiếng "tick" khi chấm dấu vết rơi vào ngăn (S04–S06), tiếng đóng dấu nhẹ (S09). Ducking dưới giọng.
- Cuesheet và stem theo `cuesheet.py`/`mix.py`; Producer nghe kiểm.

## Phụ đề
Lớp accessibility riêng, dải dưới; không phải visual chính (D7). Ngắt theo ý, không chép lên cột "Chữ trên màn hình".

## Bản đồ Cáo (Y2–Y3)
Tổng thời gian có Cáo ≈ 14,2 s / 67,6 s ≈ 21% (≲ 25%).
| Cảnh | Mốc (s) | Dáng | Cỡ/vị trí | Hành vi |
|---|---|---|---|---|
| S01 mở | 0,00–2,90 | `surprised` | lớn (≤ 1,5× nguồn), bên trái bàn, đáy y≈1290 | nhìn điện thoại khi quảng cáo hiện |
| S02 mở | 2,90–6,90 | `think` | lớn như S01 | nhìn thanh tìm trống rồi biểu tượng micro |
| S06 giữa | 25,20–27,70 | `point_right` | rộng 10–18% khung (≈ 160 px) | chỉ vào thẻ hồ sơ |
| S11 kết | 59,30–61,70 | `bow` | ≈ 170 px | cúi nhẹ khi nói "ai cũng hay nhớ lần trùng" |
| S11 kết | 65,20–67,60 | `thumbs_up` | ≈ 180 px | hướng về người xem khi mời bình luận |
Các cảnh S03–S05, S07–S10 không có Cáo (dành diện tích cho minh hoạ). Đổi dáng cách nhau ≥ 2 s; Cáo không nhép miệng.

## Bảng "Chiều sâu" (R15)
| Câu hỏi | Cảnh/lời trả lời | Ghi chú |
|---|---|---|
| Vấn đề thực tế | S01–S02, lời 01–03 | quảng cáo đúng món vừa nhắc, nghi bị nghe lén |
| Vì sao quan trọng | S02, S11 | cảm giác bị theo dõi; dễ nhầm trùng hợp với bằng chứng |
| Nguyên nhân/cơ chế | S03–S07, lời 05–11 | dấu vết → hồ sơ → nhóm → quảng cáo |
| Ví dụ giúp hình dung | S04–S07 | chạy bộ, trang cửa hàng thể thao, đôi giày (ví dụ dựng) |
| Hậu quả/sai lầm thường gặp | S08–S09, S11 | kết quả có giới hạn; lời chào bán không phải bằng chứng; chỉ nhớ lần trùng |
| Giải pháp/bài học | S10–S11 | xem sở thích bị gán; một lần trùng chưa đủ để kết luận |

## Ngân sách thời lượng (≈ 4,3 âm tiết/s; thuật ngữ Anh +1; đuôi ≤ 0,7 s)
| Đoạn | Nhãn | Âm tiết | Tốc độ (âm tiết/s) | Giây đọc | Nghỉ Y7 + giữ (s) | Đuôi (s) | Tổng (s) |
|---|---|---|---|---|---|---|---|
| Opening/hook (S01–S02) | dẫn | 17 | 4,3 | 3,95 | 2,95 | 0 | 6,9 |
| Trả lời sớm (S03) | kỹ thuật | 23 | 4,3 | 5,35 | 1,65 | 0 | 7,0 |
| Chuỗi dấu vết → hồ sơ → quảng cáo (S04–S07) | dẫn/kỹ thuật | 61 | 4,3 | 14,19 | 7,61 | 0 | 21,8 |
| Bằng chứng (S08–S09) | kỹ thuật | 66 | 4,3 | 15,35 | 3,15* | 0 | 18,5 |
| Việc làm (S10) | dẫn | 13 | 4,3 | 3,02 | 2,08 | 0 | 5,1 |
| Kết (S11) | dẫn | 28 | 4,3 | 6,51 | 1,19 | 0,6 | 8,3 |
| **Tổng** | | **208** | | **48,4** | | | **≈ 67,6** |
\* gồm giữ sau lời 1,0 s mỗi cảnh để thấy hộp "bằng chứng" trống/đầy. Chi tiết từng cảnh ở bảng ngân sách trong `script.md`. Tốc độ 4,3 đã gồm uplift Y6. Số cảnh 11 ≤ 67,6 ÷ 5 = 13; trung bình 6,1 s/cảnh.

## Nguyên liệu cần (chỉ nguồn trong `docs/asset-sources.md`)
- Giọng VieNeu (Bắc), Cáo từ `brand/cao/poses` (`surprised`, `think`, `point_right`, `bow`, `thumbs_up`), đồ hoạ tự vẽ bằng Remotion/Pillow (điện thoại, thẻ, chấm, lưới ứng dụng, tấm slide), hiệu ứng tự tổng hợp.
- Nền ảnh (nếu cần): do Gemini sinh theo brief của Claude sau khi storyboard `APPROVED`, không chữ/logo/người (tối đa 4 cảnh). Mặc định không cần ảnh AI: bàn ăn và phòng họp có thể vẽ phẳng.
- **Cần giám đốc cung cấp:** không có.

## Tiêu chí nghiệm thu
- 1080×1920, 9:16, 45–75 s (dự kiến ≈ 67 s); có phụ đề; không nhạc nền; header `BẢO MẬT / QUẢNG CÁO` từ S01 đến S11; opening 5–8 s có lời hook.
- Hook: tình huống rõ trong 2 s đầu; hệ quả ("chưa tìm", "nghe lén à?") trước giây 7; trả lời mic ở giây ≈ 7.
- Mỗi khẳng định chính có "Bằng chứng hình"; trạng thái nguồn quảng cáo (mũi tên nguồn) đổi ≥ 3 lần rồi kết trả đúng chỗ.
- Không nhãn «AI tạo», không «Ví dụ dựng», không logo hay tên hãng trên hình; khai báo AI và "(ví dụ dựng)" chỉ ở caption/`publish.json`.
- Mọi số liệu/sự kiện có nguồn cuối `script.md`; thuật ngữ đọc đúng (bảng Thuật ngữ & cách đọc); `publish.json` đủ 3 nền tảng.

## Rủi ro & dự phòng
| Rủi ro | Dự phòng |
|---|---|
| Bị hiểu thành "chắc chắn không bị nghe lén" | Lời luôn nói "chưa có bằng chứng", "chỉ thử trên Android, hồi đó" (lời 04, 13); caption ghi giới hạn nghiên cứu |
| Bị hiểu thành "hãng X nghe lén" | không tên hãng trên hình; công ty chào bán không gọi tên trong lời/hình (chỉ trong nguồn/caption theo 404 Media) |
| Vượt 72 s sau TTS | rút lời 13/ gộp S04–S05/ giảm giữ S08–S09 |
| Nhầm bộ đếm cửa hàng với "bạn có mở trang giày đó" | Ví dụ ghi rõ ghé trang cửa hàng thể thao (không phải trang đôi giày); lời 10 "chưa gõ tìm" |
| Thuật ngữ micro/clip/Android đọc sai | bảng Thuật ngữ & cách đọc; giám đốc nghe |
| Tên menu "tùy chọn quảng cáo" khác theo nền tảng | chỉ nói chung; hình giả lập trung tính [CẦN KIỂM NGUỒN: tên mục hiện hành] |

## Giả định (không hỏi lại, ghi để giám đốc chỉnh)
1. Hook của giám đốc nhắc "Facebook": không đọc/gắn tên hãng, dùng "bảng tin"/"nền tảng" chung để tránh gắn cáo buộc vào hãng (theo lưu ý trong `brief.md`).
2. Chủ đề kiểu "ví dụ dựng": nhân vật "bạn" của Cáo là silhouette; nội dung đôi giày hoàn toàn hư cấu.
3. Không nhạc nền, giọng VieNeu Bắc.
4. Tên "Northeastern" chỉ hiện ở nhãn nguồn trên hình (không đọc trong lời để tiết kiệm thời lượng); công ty chào bán không gọi tên.
5. Không đề cập chi tiết "một số ứng dụng ghi màn hình" của cùng nghiên cứu (đã kiểm: có thật) vì ngoài một cơ chế chính; có thể là tập tiếp theo.
6. Số "17.000+" trên hình thay cho 17.260 để khớp trang Northeastern (nêu "hơn 17.000"); 17.260 có ở slide của tác giả trên FTC (xem nguồn).
