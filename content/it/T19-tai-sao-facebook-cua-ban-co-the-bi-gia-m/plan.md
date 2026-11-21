# Plan bộ video · T19 "Tại sao Facebook của bạn có thể bị giả mạo mà không cần hack tài khoản?"

Bản 1 · 21/11/2026 · 1 tập · chuẩn 45–75 s (dự kiến ≈ 56,8 s, đo lại sau TTS). Một câu hỏi, một sự cố, **một** cơ chế chính, một ví dụ dựng (Cáo, Mít, chị Lan). Video cảnh báo: chỉ giải thích cơ chế ở mức người xem cần hiểu để phòng.

## Bảng các tập
| Mã video | Tên tập | Thời lượng mục tiêu | Thông điệp chính |
|---|---|---|---|
| IT-T19-E01 | Ai nhắn thay bạn? | 55–62 s (dự kiến ≈ 56,8 s, trần 75 s) | Tài khoản thật vẫn nguyên, nhưng một hồ sơ khác dùng ảnh và tên (nếu để công khai) có thể đủ giống để người quen tin nhầm. Ảnh và tên quen không chứng minh được người quen: gọi lại bằng số đã lưu, không hỏi ngay trong cuộc chat đó, trước khi chuyển tiền. |

Nếu sau TTS vượt 72 s: (1) bỏ phần "đừng hỏi ngay trong cuộc chat đó" ở lời 12 (nhưng đây là khuyến cáo của nguồn, ưu tiên giữ); (2) rút beat S05 xuống ≈ 5 s; (3) giảm "giữ sau lời" ở S04, S07, S08 về mức tối thiểu. Không tăng tốc để bù (Y6).

## Phong cách hình ảnh
- **Khung 9:16, 1080×1920**, vùng an toàn y∈[250, 1500]; phụ đề dải dưới y≈1340–1500 (lớp riêng, 52–60 px, ≤ 2 dòng, ≤ 28 ký tự/dòng, không phải visual chính).
- **Giao diện giả lập trung tính:** điện thoại, khung chat, thẻ hồ sơ, danh bạ, màn gọi là đồ hoạ tự vẽ, **không logo Meta/Facebook/Messenger, không tên nút hay tên mục cài đặt thật**. **Giám đốc quyết 21/11/2026: video không dùng tên "Facebook"; gọi là "phở bò" (lời 04, phụ đề, mọi chữ, bài đăng TikTok/YouTube), và đó là tên gọi thay thế, không phải món ăn: không hình bát phở/đồ ăn (xem `brief.md`).** Hình vẫn không logo, không tên mục thật.
- **Nhân vật:** Cáo từ `brand/cao/poses`. **Mít** (bạn của Cáo) và **chị Lan** là silhouette/hình khối phẳng (R6, vai phụ), không người thật. **Ảnh đại diện trong các thẻ hồ sơ là đầu Cáo hoạt hoạ** (cùng một hình ở hai hồ sơ), tên hiển thị tự đặt hư cấu ("Cáo"). Hai hồ sơ phân biệt bằng viền/nhãn, không bằng "dấu hiệu nhận biết".
- **Bộ nền theo ngữ cảnh (cùng phong cách phẳng 3D nhẹ, cùng bảng màu), không nền nào > 40%:**
  | Nền | Cảnh | ≈ % |
  |---|---|---|
  | Bàn quán cà phê (ấm) | S01–S02, S07 (phần đầu), S09 | ≈ 30% |
  | Màn hình điện thoại / khung chat giả lập | S03, S06 | ≈ 23% |
  | Nền dữ liệu (tối, hạt sáng), sơ đồ hồ sơ và bạn bè | S04–S05 | ≈ 25% |
  | Màn gọi / danh bạ giả lập, rồi nền sáng nhẹ cho việc làm | S07 (phần sau), S08 | ≈ 20% |
- **Bảng màu:** nền tối `#0F1B2D`, nền ấm quán cà phê `#3A2A1F`, chữ `#FFFFFF`, Cáo cam `#F28C28`.
- **Bảng nghĩa màu (dùng nhất quán):**
  | Màu | Hex | Nghĩa |
  |---|---|---|
  | Đỏ | `#E74C3C` | rủi ro đang xảy ra: tin vay, nút chuyển bị nhắm tới, hồ sơ khác khi bị gán "giả" (chỉ ở các nhịp hook và beat S05) |
  | Vàng | `#F5B731` | "nếu"/có điều kiện/đang chờ: chip `NẾU CÔNG KHAI`, nút chuyển bị dừng, tick "cảm giác quen" |
  | Cyan | `#38BDF8` | thông tin công khai (ảnh, tên, bạn bè) |
  | Xanh lá | `#2ECC71` | thật/đã xác minh: tài khoản thật của Cáo, cuộc gọi tới số đã lưu, nút chuyển đã dừng an toàn |
  | Cam | `#F28C28` | Cáo, nhấn tiêu điểm |
- **Font:** Be Vietnam Pro hoặc Segoe UI Bold. Chữ khoá ≤ 3 từ, ≥ 72 px; nhãn ≥ 56 px; tối đa 3 nhóm chữ cùng lúc ngoài phụ đề và header.
- **Vật chính (R5):** ở S01–S02 điện thoại của Mít cao ≥ ~560 px; S03–S06 cụm hai thẻ hồ sơ xếp dọc (tổng cao ≥ 560 px, mỗi thẻ ≈ 420–520 px); S07 khung gọi ≥ 560 px; S08 cụm ba biểu tượng đứng thành một hàng, cao ≥ 560 px khi cùng thẻ hồ sơ. Lệch thì Producer ghi lý do ở `scenes.json`.
- **Đối tượng nối xuyên tập (R11, trạng thái hook):** *vòng nút chuyển* (biểu tượng đồng xu "chuyển" có vòng sáng, không chữ). Đổi trạng thái ≥ 3 lần rồi trả đúng chỗ: S01 đỏ (ngón cái lơ lửng) → S02 vàng (ngón dừng) → S05 đỏ (Mít gõ trả lời "ok", ngón lại gần) → S06 vàng (tick "quen" nhưng chưa chuyển) → S07 đỏ lại ở lời 11 (bạn thân không ngồi cạnh) rồi xanh lá từ lời 12 (ngón rời nút, chuyển sang gọi) → S09 xanh lá xám mờ (không đồng nào đi). Hiện ở góc trên phải (≈ 150 px) trong S01–S02, S05–S07, S09.
- **Thumbnail (R7):** khung hook: bàn cà phê, Mít cầm điện thoại có tin vay, ngón cái trên nút chuyển, Cáo giật mình. Đọc được ở 180×320; không bê lưới nhiều nhãn.
- **Chip chương (R7):** không dùng chip chữ (tránh chữ thừa Y1). Dùng 4 chấm tiến độ không chữ trong ô header, tick dần: Tình huống · Cơ chế · Sai lầm · Việc làm.

## Opening và Header (R14, D8)
- **Tiêu đề opening:** `AI NHẮN THAY BẠN?` (hiện 5,0–8,0 s ở S02, animation vào một lần, ≥ 84 px, đặt trên vùng trống phía trên bàn y≈390–620; lý do: topic reveal của opening theo R14/R26). Opening 8,0 s (trần), có lời hook (lời 01–03).
- **Header:** `BẢO MẬT / GIẢ MẠO` từ S03 đến hết S09 (**mọi cảnh sau opening**), chữ ≥ 52 px, ≤ 9% diện tích, đổi ô theo cảnh để không đè hồ sơ/Cáo/phụ đề (ô: S03 `top`, S04 `top_right`, S05 `top_left`, S06 `top`, S07 `top_right`, S08 `top_left`, S09 `top_right`). Lý do: header theo D8/R21, giám đốc yêu cầu.

## Âm thanh (R25, `docs/asset-sources.md`)
- Giọng VieNeu Bắc, mặc định Hải Đăng. Tốc độ theo Y6 (đo sau TTS, `[dẫn]` ≈ +13–18%, `[kỹ thuật]` ≈ +7–12% so với T8; giọng Hải Đăng vốn nhanh nên đo rồi chỉnh về ≈ 4,6–4,8 âm tiết/s có tiếng; trần 1,20). **Không nhạc nền** (`layers.music.enabled` mặc định tắt).
- Hiệu ứng nhẹ tự tổng hợp từ `library/sfx/`: tiếng báo tin nhắn (S01 ≈ 0,15 s), tick nhẹ khi ngón cái dừng (S02), "ting" khi hai thẻ hồ sơ khớp (S04), tiếng chuông cuộc gọi (S07), tick xác nhận khi cuộc gọi nối (S07), tiếng đồng xu mờ/tắt (S09). Ducking dưới giọng. Cuesheet và stem theo `cuesheet.py`/`mix.py`.

## Phụ đề
Lớp accessibility riêng, dải dưới; không phải visual chính (D7). Ngắt theo ý, không chép lên cột "Chữ trên màn hình".

## Bản đồ Cáo (Y2–Y3)
Tổng thời gian có Cáo ≈ 11,4 s / 56,8 s ≈ 20% (≲ 25%).
| Cảnh | Mốc (s) | Dáng | Cỡ/vị trí | Hành vi |
|---|---|---|---|---|
| S01 mở | 0,00–3,70 | `surprised` | lớn (≤ 1,5× nguồn), bên trái bàn, đáy y≈1290 | nhìn vào điện thoại của Mít khi tin hiện, quay sang Mít khi Mít hỏi |
| S02 mở | 3,90–5,90 | `think` | lớn như S01 | lắc đầu, nhìn thẻ "tài khoản thật" vừa trượt vào; rời khung khi thẻ chiếm giữa |
| S05 giữa | 25,60–27,53 | `stop` | rộng 10–18% khung (≈ 160 px), x≈105, đáy y≈1270 | giơ tay chặn cạnh bong bóng nhắc tên chị Lan |
| S09 kết | 53,00–56,75 | `thumbs_up` | ≈ 180 px, x≈105, đáy y≈1290 | hướng về người xem khi mời bình luận; Mít (silhouette) cầm điện thoại cạnh bàn |
Các cảnh S03–S04, S06–S08 không có Cáo (dành diện tích cho minh hoạ; câu "Ối, ai cũng từng tin" ở S06 chỉ có giọng). Đổi dáng cách nhau ≥ 2 s; Cáo không nhép miệng.

## Bảng "Chiều sâu" (R15)
| Câu hỏi | Cảnh/lời trả lời | Ghi chú |
|---|---|---|
| Vấn đề thực tế | S01–S02, lời 01–03 | bạn thân ngồi cạnh nhận tin Cáo vay năm triệu; ngón cái trên nút chuyển |
| Vì sao quan trọng | S01, S05–S06 | tiền của bạn thân/người quen có thể đi nhầm; tin vay còn nhắc tên chị Lan nên nghe đáng tin |
| Nguyên nhân/cơ chế | S03–S04, lời 04–07 | một hồ sơ khác, ảnh và tên (nếu để công khai) ai cũng xem được, không cần mật khẩu |
| Ví dụ giúp hình dung | S01–S06 | Cáo, Mít, chị Lan (ví dụ dựng; "ví dụ dựng" ghi ở caption) |
| Hậu quả/sai lầm thường gặp | S05–S06, lời 08–10 | tin vì ảnh quen, tên quen; chi tiết quen không phải bằng chứng danh tính |
| Giải pháp/bài học | S07–S09, lời 11–15 | gọi lại số đã lưu, không hỏi trong cuộc chat đó; báo bạn bè; báo cáo hồ sơ giả; xem lại phần mình để công khai; "đổi kênh trước khi đổi tiền" |

## Ngân sách thời lượng (≈ 4,3 âm tiết/s; thuật ngữ Anh +1; đuôi ≤ 0,7 s)
| Đoạn | Nhãn | Âm tiết | Tốc độ (âm tiết/s) | Giây đọc | Nghỉ Y7 + giữ (s) | Đuôi (s) | Tổng (s) |
|---|---|---|---|---|---|---|---|
| Opening/hook (S01–S02) | dẫn | 26 | 4,3 | 6,05 | 1,95 | 0 | 8,0 |
| Câu hỏi và trả lời (S03) | dẫn/kỹ thuật | 22 | 4,3 | 5,12 | 2,13 | 0 | 7,25 |
| Cơ chế (S04) | kỹ thuật | 24 | 4,3 | 5,58 | 2,92 | 0 | 8,5 |
| Nhịp người quen chung (S05) | kỹ thuật | 17 | 4,3 | 3,95 | 1,85 | 0 | 5,8 |
| Sai lầm (S06) | dẫn | 18 | 4,3 | 4,19 | 2,01 | 0 | 6,2 |
| Gọi số đã lưu (S07) | dẫn | 22 | 4,3 | 5,12 | 2,68 | 0 | 7,8 |
| Việc làm (S08) | dẫn | 19 | 4,3 | 4,42 | 2,58 | 0 | 7,0 |
| Kết (S09) | dẫn | 18 | 4,3 | 4,19 | 1,45 | 0,56 | 6,2 |
| **Tổng** | | **166** | | **38,62** | **17,57** | **0,56** | **≈ 56,8** |
Chi tiết từng cảnh ở bảng ngân sách trong `script.md`. Số cảnh 9 ≤ 56,8 ÷ 5 ≈ 11; trung bình 6,3 s/cảnh; cảnh dưới 3 s: không có. Tốc độ 4,3 đã gồm uplift Y6.

## Nguyên liệu cần (chỉ nguồn trong `docs/asset-sources.md`)
- Giọng VieNeu (Bắc), Cáo từ `brand/cao/poses` (`surprised`, `think`, `stop`, `thumbs_up`), đồ hoạ tự vẽ bằng Remotion/Pillow (điện thoại, chat, thẻ hồ sơ, danh bạ, màn gọi, biểu tượng chuông/cờ/khoá, silhouette Mít và chị Lan), hiệu ứng tự tổng hợp `library/sfx/`.
- Nền ảnh (nếu cần): quán cà phê do Gemini sinh theo brief của Claude sau khi storyboard `APPROVED`, không chữ/logo/người (tối đa 4 cảnh/video). Mặc định không cần ảnh AI: bàn cà phê và các nền khác vẽ phẳng/`make_background.py` được.
- **Cần giám đốc cung cấp:** không có.

## Tiêu chí nghiệm thu
- 1080×1920, 9:16, 45–75 s (dự kiến ≈ 57 s); có phụ đề; không nhạc nền; header `BẢO MẬT / GIẢ MẠO` từ S03 đến S09; opening ≈ 8 s có lời hook.
- Hook: tình huống rõ trong 2 s đầu (Mít cầm điện thoại có tin vay, ngồi cạnh Cáo); hệ quả (ngón cái trên nút chuyển) trước giây 5; ích lợi "không ai hack mình" trước giây 8; trả lời "hồ sơ khác" ở giây ≈ 11–14.
- Mỗi khẳng định chính có "Bằng chứng hình"; *vòng nút chuyển* đổi trạng thái ≥ 3 lần rồi kết trả đúng chỗ.
- Không nhãn «AI tạo», không «Ví dụ dựng», không logo hay tên hãng trên hình; khai báo AI và "(ví dụ dựng)" chỉ ở caption/`publish.json`.
- Mọi sự kiện có nguồn cuối `script.md`; thuật ngữ đọc đúng (bảng Thuật ngữ & cách đọc); `publish.json` đủ 3 nền tảng.
- Không có: số thiệt hại/tỷ lệ, deepfake, tên nút/đường dẫn cài đặt, "mặc định công khai", "giống hệt", cảnh ghép hồ sơ từng mảnh, dấu hiệu nhận biết bản giả.

## Rủi ro & dự phòng
| Rủi ro | Dự phòng |
|---|---|
| Hai thẻ hồ sơ bị hiểu thành hướng dẫn dựng bản giả | Hồ sơ khác hiện sẵn như một thẻ hoàn chỉnh, chỉ so ảnh/tên khớp; không cảnh sao chép, không công cụ; lời chỉ nói "không cần mật khẩu", "ai cũng xem được" |
| Bị hiểu "mọi hồ sơ Facebook đều công khai" | Mọi chỗ nhắc ảnh, tên, bạn bè đều có điều kiện "nếu để công khai" (chip vàng `NẾU CÔNG KHAI`); không nói "mặc định" |
| Bị hiểu "chỉ giả mạo bằng hồ sơ khác, không bao giờ chiếm tài khoản" | Tiêu đề và ví dụ nói đúng một trường hợp (hồ sơ khác); nguồn Công an Hà Nội nói cả hai (lập tài khoản giả **hoặc** chiếm quyền); caption ghi "ví dụ này là trường hợp hồ sơ giả, còn có trường hợp chiếm tài khoản" |
| Bị hiểu như đổ lỗi nạn nhân | Lời 06–07 nhấn "ai cũng xem được" là chuyện của dữ liệu công khai; lỗi không nằm ở Cáo; không dùng "do bạn" |
| Nhịp S05 thành cơ chế thứ hai | ≤ 6 s, chỉ một bong bóng "chị Lan" + một chip điều kiện, không sơ đồ mới ngoài vòng bạn bè |
| Thuật ngữ hack/phở bò/chat đọc sai | bảng Thuật ngữ & cách đọc; giám đốc nghe (CHƯA KIỂM) |
| "phở bò" bị hiểu hay vẽ thành món ăn thật | Là tên gọi thay thế do giám đốc quyết; storyboard và ảnh Gemini không có bát phở, đũa, hơi nóng, quán phở; không đổi bối cảnh, không chơi chữ đồ ăn; QC mở khung hình kiểm |
| Vượt 72 s sau TTS | xem mục trên |
| Hình giống giao diện thật quá mức | đồ hoạ tự vẽ, khác bố cục và màu thương hiệu, không logo, không tên mục |

## Mục cần giám đốc kiểm
1. **Beat S05** (lời 08 nay: "Nếu danh sách bạn bè công khai, kẻ gian có thể nhắn người quen mình"): đã có nguồn sơ cấp là Công an TP Thanh Hoá (11/10/2022, xem nguồn 2b của `script.md`); không còn cần giám đốc kiểm. Chị Lan chỉ là ví dụ dựng trên hình. Chữ chốt S09 đổi thành `GỌI XÁC MINH`.
2. **Báo cáo hồ sơ giả:** chưa mở được trang Meta Help; lời 13 chỉ nói "báo cáo hồ sơ đó" ở mức nguyên tắc, hình dùng biểu tượng cờ chung, không tên nút. URL biểu mẫu Gemini nêu ở vòng 1 và vòng 2 khác số nhau (…295309487309484 và …295309487209748), chưa ai mở kiểm, không dùng.
3. **Xưng "Facebook" trong lời 04:** ĐÃ QUYẾT 21/11/2026, giám đốc yêu cầu đổi thành "phở bò" (tên gọi thay thế, không phải món ăn). Xem `brief.md`.
4. Ví dụ dựng: "Cáo", "Mít", "chị Lan", "năm triệu". Không có vụ thật nào được nhắc.
5. Cách đọc "hack", "chat", "phở bò" (CHƯA KIỂM — giám đốc nghe).
6. Cảnh báo "Bộ Công an về gọi điện xác minh" mà phán quyết nhắc: bài CafeF đã mở (07/11/2026) thực chất dẫn Công an phường Hoài Nhơn Tây và nói về **chiếm tài khoản** qua liên kết lạ; chỉ dùng cho khuyến cáo "gọi số đã biết trước khi chuyển tiền", không gán là Bộ Công an.

## Giả định (không hỏi lại, ghi để giám đốc chỉnh)
1. Cáo kể ngôi thứ nhất vì là người bị mạo danh, người xem đặt mình vào chỗ đó; "bạn" chỉ người xem.
2. Mít là silhouette; tên "Mít" chỉ để người kịch bản/Producer phân biệt, **không hiện chữ "Mít" trên hình** (Y1) và không đọc trong lời (chỉ gọi "bạn thân").
3. Không nhạc nền, giọng VieNeu Bắc (Hải Đăng).
4. Không nhắc deepfake/cuộc gọi video và số liệu thiệt hại (theo phán quyết).
