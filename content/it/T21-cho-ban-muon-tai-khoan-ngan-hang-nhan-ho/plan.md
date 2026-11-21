# Plan — T21 · Cho bạn mượn tài khoản ngân hàng "nhận hộ tiền"

Phòng IT · Đội 3 (team_id 4). Bản 1, 21/11/2026. Một tập, chuẩn 45–75 s (D1). Một câu hỏi + một sự cố + **một** cơ chế (dòng tiền đi qua tài khoản đứng tên mình thì tên mình nằm trên giao dịch) + một ví dụ dựng. Không có hai khái niệm ngang nhau cần giám đốc quyết: khung phạt chỉ là hệ quả, "một lần" so với "một tài khoản" chỉ là đối chiếu trong cùng mạch.

## Bảng các tập
| Mã video | Tên tập | Thời lượng mục tiêu | Thông điệp chính |
|---|---|---|---|
| IT-T21-E01 | Một lần nhận hộ, tên ai trên giao dịch? | ≈ 56,2 s (ngân sách; đo lại sau TTS, chuẩn 45–75 s) | Tiền nhận hộ có thể là tiền lừa đảo; người đứng tên có thể phải giải trình, tài khoản có thể bị phong toả; cho mượn tài khoản có khung phạt hành chính 100–150 triệu (cá nhân, 1 đến dưới 10 tài khoản). Không cho ai mượn tài khoản. |

## Phong cách hình ảnh
Đồ hoạ phẳng 9:16 (1080×1920), bộ nền theo ngữ cảnh, cùng một phong cách: góc bo tròn, bóng nhẹ, đường dòng tiền là một đường liền có hạt sáng chạy. Vùng an toàn chữ y∈[~250, ~1500]; phụ đề dải dưới y≈1340–1500 (lớp riêng); Cáo đáy ≲ y 1290.

**Bộ nền (không dồn quá ~40% thời lượng vào một nền):**
| Nền | Dùng ở | Mô tả | Nguồn |
|---|---|---|---|
| N1 Bàn làm việc ấm | S01–S02, S09 | bàn gỗ nhẹ, màn hình điện thoại lớn ở giữa, lịch nhắc "tiền nhà" ở rìa; **không chữ/logo/người** | ảnh nền do Gemini sinh theo brief (≤ 4 cảnh), hoặc nền màu/gradient + đạo cụ vẽ bằng đồ hoạ |
| N2 Dữ liệu tối | S03–S06 | navy tối có hạt sáng chậm, lưới mờ | nền màu/gradient |
| N3 Hai nửa đúng/sai | S07 | nửa trái ấm (nghĩ), nửa phải navy (thực tế) | nền màu/gradient |
| N4 Sáng nhẹ giải pháp | S08 | nền sáng nhạt, thẻ trắng | nền màu/gradient |

Tỉ lệ thời lượng: N1 ≈ 8,0 + 8,2 = 16,2 s ≈ 29%; N2 = S03–S06 ≈ 26,3 s ≈ 47% **vượt ~40%** nên tách bằng đổi bố cục theo cảnh (S03 sơ đồ ba nút, S04 thẻ văn bản, S05–S06 thẻ khung phạt) và đổi ô header; ghi rủi ro ở dưới.

**Màu và bảng nghĩa màu (dùng nhất quán):**
| Màu | Hex | Nghĩa |
|---|---|---|
| Xanh lá | `#2FBF71` | bình thường / đúng / an toàn (vòng trạng thái tài khoản ở S08–S09) |
| Vàng | `#F4B400` | đang xét / nghi liên quan / "có thể" (nhãn NGHI LIÊN QUAN) |
| Đỏ (**nét đứt** = chỉ là có thể, chưa phải sự thật) | `#E5484D` | rủi ro / sai (thẻ giải trình, cảnh phong toả giả định) |
| Cyan | `#22C7E8` | dòng tiền đã xác định (đường tiền, hạt sáng) |
| Cam Cáo | `#F28C28` | nhấn, Cáo, chữ khoá |
| Navy nền / navy chữ | `#101B2E` / `#1B2A49` | nền tối / chữ trên thẻ sáng |
| Trắng | `#FFFFFF` | chữ chính |
Quy tắc: **không bao giờ dùng đỏ liền cho "phong toả"**: luôn đỏ nét đứt kèm nhãn "CÓ THỂ" (phán quyết cấm khẳng định). Không số âm, không "-150 triệu", không đỏ nháy trên số dư.

**Font và cỡ chữ:** Segoe UI Bold (Bahnschrift cho số). Chữ khoá ≤ 3 từ, ≥ 72 px; nhãn/mã ≥ 56 px; header ≥ 52 px (đủ lớn, đổi ô); tối đa 3 nhóm chữ đồng thời ngoài phụ đề. Phụ đề 52–60 px, ≤ 2 dòng, ≤ 28 ký tự/dòng, dải dưới, lớp riêng, không tính là visual.

**Chip chương (R7):** video ≈ 55 s; **không dùng chip chữ** (Y1), thay bằng ba chấm tiến độ không chữ ở mép trên (tô dần ở S03, S05, S08), hoặc bỏ nếu chật header.

## Opening và Header (R14, D8)
- **Tiêu đề opening:** `TÊN AI TRÊN GIAO DỊCH?` (gây tò mò, nêu chủ đề), hiện 5,00–8,00 s (S02), animation vào một lần (topic reveal); opening trọn S01–S02 = 8,0 s (trần 1–8 s).
- **Header xuyên suốt từ S03 đến S09:** `BẢO MẬT / MƯỢN TÀI KHOẢN`, đổi ô theo cảnh (trên trái → trên giữa → trên phải …) để không đè sơ đồ/Cáo/phụ đề. Opening không có header.
- Chữ do text engine vẽ; nguyên văn ở cột "Chữ trên màn hình" của script, kèm lý do "opening"/"header".

## Bản đồ Cáo (Y2–Y3)
| Cảnh | Cáo | Mốc | Hành vi · cỡ · vị trí |
|---|---|---|---|
| S01 | có · `think` | 0,00–3,70 s | cầm điện thoại nhìn tin nhắn, lớn (≤ 1,5× nguồn), x≈100, đáy y≈1290; cạnh là lịch tiền nhà |
| S02 | có · `surprised` | 3,90–5,95 s | giật mình nhìn thẻ "yêu cầu giải trình" mang tên Cáo; rời khung lúc 6,0 s nhường chỗ cho tiêu đề và thẻ |
| S03–S07 | không | — | nhường hình cho sơ đồ, thẻ, so sánh |
| S08 (đầu) | có · `think` | 0,15–1,15 s trong cảnh (sau rescue 4: nhịp chuyển ý giữa theo Y2) | nhìn điện thoại lúc khoanh giao dịch lạ, 120 px, x≈16–136, đáy ≤ y 1290, rời trước khi ghim bay vào; không che sơ đồ/phụ đề |
| S09 | có · `stop` rồi `thumbs_up` | 47,65–50,74 s (`stop`), 52,66–56,17 s (`thumbs_up`) | `stop` khi nói từ chối, ≈ 160 px, x≈105, đáy y≈1290; `thumbs_up` hướng về người xem lúc mời bình luận, ≈ 180 px |
Tổng thời gian có Cáo ≈ 3,7 + 2,05 + 2,65 + 3,5 = 11,9 s ≈ **21%** (< 25%). Đổi dáng cách nhau ≥ 2 s. Cáo không nhép miệng; trong cảnh có minh hoạ, Cáo nhỏ và chỉ nhìn/chỉ vào vật.

## Âm thanh (R25, `docs/asset-sources.md`, `tools/audio/sound-design.json`)
Giọng đọc TTS theo `docs/voice.md`; tốc độ `[dẫn]` cao hơn T8 ≈ 13–18%, `[kỹ thuật]` ≈ 7–12% (trần `atempo` 1,20), **đo lại sau TTS rồi chỉnh**; nghỉ theo ý, không đều. **Không nhạc** (mặc định tắt). SFX tự tổng hợp nhỏ hơn giọng: tiếng báo tin mềm (0,10 s S01, tin nhắn), "ting" nhẹ khi thẻ giải trình hiện (S01 2,4 s), "tick" khi nhãn hiện, "bụp" khi mũi tên tiền bị gắn nhãn nghi liên quan, "tụp" khi vòng trạng thái đổi. Không âm thanh chói. Khoảng nghỉ dài đi cùng đổi hình/chuyển cảnh có chủ đích (ghi ở script).

## Quy tắc phụ đề
Phụ đề là lớp accessibility riêng (52–60 px, ≤ 2 dòng, ≤ 28 ký tự/dòng, dải dưới), chép đúng lời đọc, chính tả chuẩn có dấu; không tính là visual. Số trong lời viết bằng chữ ("một trăm đến một trăm năm mươi triệu"); chữ số chỉ ở chữ trên hình (`100–150 TRIỆU`).

## Bản đồ Y/R chính (tóm tắt, chi tiết ở script)
- **Y5/R1–R2:** tình huống ở 0–2 s, hệ quả bằng hình ở 2,4 s, câu hỏi mở bắt đầu 3,85 s, trả nguyên nhân 8,2 s.
- **Một cảnh một ý (R13):** 9 cảnh, trung bình ≈ 6,2 s, không cảnh nào dưới 3,7 s; opening 8,0 s.
- **Trạng thái sự cố (R11) đổi ≥ 3 lần rồi kết trả đúng chỗ:** vòng trạng thái trên thẻ tài khoản của Cáo: xanh (S01) → vàng "nghi liên quan" (S03) → đỏ nét đứt "có thể" (S04) → xanh (S09); thẻ giải trình hiện S01, rõ nét S04, biến mất S09.
- **Trước/sau, đúng/sai:** S07 (nghĩ "chuyển đi là xong" ↔ tên vẫn trên giao dịch), S09 (cùng khung S01: trước tin nhắn đang chờ, sau từ chối).
- **R15 chiều sâu, D7 bản đồ ngữ nghĩa, R22 kinetic:** ở script (kinetic ở S03 `NGHI LIÊN QUAN`, S05 `100–150 TRIỆU`).

## Nguyên liệu cần
- Giọng TTS (docs/voice.md); Cáo PNG (`think`, `surprised`, `stop`, `thumbs_up`); đồ hoạ vẽ bằng renderer: điện thoại, khung chat, thẻ giao dịch, silhouette người (không mặt), mũi tên tiền, vòng trạng thái.
- Ảnh nền N1 (tối đa 4 ảnh nền/đạo cụ qua Gemini, brief ở script mục "Gợi ý brief ảnh"); thiếu thì dùng nền màu/gradient.
- Không dùng logo ngân hàng/ứng dụng thật, không người thật, không clip ngoài, không nhạc ngoài.

## Cần giám đốc cung cấp
Không có. **Việc giám đốc nên làm trước khi đăng:** (1) nghe thử cách đọc "giải trình", "phong toả" (CHƯA KIỂM); (2) tự đối chiếu văn bản gốc Nghị định 340/2025/NĐ-CP (bản gốc trên cổng chính phủ là PDF quét, agent chỉ đối chiếu qua báo và trang chép lại); (3) đã đối chiếu nội dung Điều 11 NĐ 52/2024 qua bản đăng của Viện KSND tối cao (điều kiện văn bản của cơ quan có thẩm quyền) nhưng chưa soi số điểm; (4) Điều 8 NĐ 52/2024 (cấm cho mượn) và số khoản Điều 30 NĐ 340/2025 chưa tự soi văn bản gốc.

## Giả định đã chọn (chạy nền, không hỏi lại)
1. Đối tượng phạt là **cá nhân** (mức 100–150 triệu); tổ chức bị phạt gấp đôi theo nguồn tư vấn pháp lý, không nêu trong video.
2. "Nhận hộ tiền một lần" được hiểu là một trường hợp **cho mượn tài khoản** (theo chủ đề giám đốc giao); lời đọc chỉ nói "cho mượn tài khoản", không nói "nhận hộ là bị phạt".
3. Khung phạt đặt ở ≈ 23,6 s (không phải 20 s như phán quyết) vì S03 là cảnh High cần ≥ 8 s dựng từng bước; câu trả lời nguyên nhân vẫn đến sớm (8,2 s). Nếu giám đốc muốn khung phạt sớm hơn, rút giữ S03 xuống 1,5 s và S04 xuống 6 s (mất ≈ 2,5 s).
4. Cách xử lý khi lỡ nhận tiền: chỉ nói ở mức "lưu tin nhắn, sao kê, hỏi ngân hàng hoặc cơ quan chức năng", không nêu thủ tục, không khuyên tự chuyển trả.
5. Kết (bản chốt 21/11/2026): lời 12 là "Mình không cho ai mượn tài khoản. Có khung phạt." thay cho "Luật cấm" (chưa tự mở được Điều 8 NĐ 52/2024 để khẳng định "bị cấm"; khung phạt đã có nguồn). Ở S09 vòng trạng thái về xanh bằng cú tua ngược về lúc chưa nhận lời, không ngụ ý từ chối gỡ được phong toả.
6. Đã bác đề xuất đổi thứ tự cảnh (S03 → S05 → S06 → S04) của Codex để khung phạt về ≈ 20,5 s: sẽ phá mạch phong toả → giải trình → phạt và mốc vòng trạng thái; khung phạt vẫn ở ≈ 26 s (trong ngưỡng 45–75 s).

## Ngân sách thời lượng (tập IT-T21-E01)
Hệ số: ≈ 4,3 âm tiết/s giọng; không có thuật ngữ Anh (không +1); mỗi cảnh = max(lời + nghỉ, tối thiểu 3/5/8 s theo độ phức tạp + giữ sau lời). Chi tiết từng cảnh ở `ep01/script.md`.
| Đoạn | Nhãn | Âm tiết | Tốc độ | Giây đọc | Nghỉ Y7 + giữ | Đuôi | Tổng |
|---|---|---|---|---|---|---|---|
| S01–S02 opening | dẫn | 21 | 4,3 | 4,88 | 3,12 | 0 | 8,0 |
| S03–S06 giải thích | kỹ thuật | 81 | 4,3 | 18,84 | 7,46 | 0 | 26,3 |
| S07 sai lầm | dẫn | 24 | 4,3 | 5,58 | 1,62 | 0 | 7,2 |
| S08–S09 giải pháp + kết | dẫn | 46 | 4,3 | 10,70 | 3,37 | 0,6 | 14,67 |
| **Tổng** | | **172** | | **40,00** | **15,60** | **0,6** | **≈ 56,2** |
(Hàng S03–S06 = 8,0 + 7,4 + 5,9 + 5,0 = 26,3 s.) Trong 45–75 s và gần mục tiêu 55–65 s. Quá 72 s sau TTS thì rút giữ S03/S04/S07, không tăng tốc để bù.

## Tiêu chí nghiệm thu (đo được)
- Thời lượng 45–75 s (mục tiêu ≈ 56 s), 1080×1920, 9:16, có phụ đề.
- Hook: tình huống thấy trong 2 s đầu; thẻ giải trình trước 3 s; câu hỏi mở bắt đầu trước 4 s.
- Opening ≤ 8,0 s, có tiêu đề `TÊN AI TRÊN GIAO DỊCH?`; header `BẢO MẬT / MƯỢN TÀI KHOẢN` từ S03 đến hết, không đè.
- Không có tên thật của bốn nền tảng, không tên ngân hàng/ứng dụng, không logo, không nhãn "Ví dụ dựng"/"AI" trên hình; không "-150 triệu", không "phong toả toàn bộ", không "đồng phạm", không "Điều 291", không "rửa tiền" ở lời, phụ đề, chữ hình, caption.
- Mức phạt chỉ đứng cạnh hành vi "cho mượn" (lời 07, chữ `100–150 TRIỆU` gắn thẻ KHUNG PHẠT cạnh nhãn CHO MƯỢN), không đứng cạnh "nhận tiền".
- Bốn nhãn đã chốt xuất hiện trên hình đúng chính tả; `publish.json` cho ba nền tảng, mô tả có câu khai báo AI và ghi "ví dụ dựng".
- Trạng thái sự cố đổi ≥ 3 lần và trả đúng chỗ ở kết; Cáo ≲ 25%.

## Rủi ro và dự phòng
| Rủi ro | Dự phòng |
|---|---|
| Người xem hiểu "nhận hộ tiền là chắc chắn bị phạt/phong toả" | mọi hệ quả ở dạng "có thể", viền đỏ nét đứt; mức phạt chỉ gắn "cho mượn" |
| Sơ đồ dòng tiền đọc như kết luận điều tra | nhãn vàng `NGHI LIÊN QUAN` gắn mũi tên; người bị hại là silhouette, không kể vụ thật |
| Thẻ "yêu cầu giải trình" trông như văn bản chính thức | viền nét đứt, không mã/ dấu/ tên cơ quan; chỉ là minh hoạ |
| Mức phạt sai/lẫn khung (một số báo nêu 200–250 triệu cho nhóm khác) | chỉ nêu khung 1 đến dưới 10 tài khoản, cá nhân, 100–150 triệu; không nêu khung cao hơn |
| N2 chiếm > 40% thời lượng | đổi bố cục mỗi cảnh, đổi ô header; nếu QC thấy đơn điệu thì S06 chuyển sang nền N3 |
| Cảnh High S03 quá dày chi tiết ở 360×640 | chỉ ba nút (người bị hại → tài khoản Cáo → người nhờ), một mũi tên, một thẻ giao dịch; giữ hoàn chỉnh 2,1 s |
| Văn bản gốc NĐ 340/2025 là PDF quét, chưa mở trực tiếp | nêu ở "Cần giám đốc", làm mềm bằng "khung phạt" (không nói số điều trong lời) |
| Lời nhờ "nhận hộ" làm người xem tin có "tiền công" hợp lệ | không có tiền công trong lời; chỉ nói tiền "có thể" là tiền lừa đảo |

## Nguồn (tóm tắt, chi tiết cuối script.md)
CafeF 01/11/2026 (mức phạt NĐ 340/2025), CafeF 30/10/2026 (phong toả theo văn bản cơ quan có thẩm quyền, NĐ 52/2024), Bộ Công an 28/08/2026 (người đứng tên làm việc với cơ quan chức năng để giải trình). **Lưu ý:** URL NĐ 52/2024 mà Gemini dẫn trong debate (`chinhphu.vn … docid=210214`) khi mở ra là Nghị định 49/2024/NĐ-CP về thông tin cơ sở, **không phải** NĐ 52/2024; không dùng URL đó làm nguồn.
