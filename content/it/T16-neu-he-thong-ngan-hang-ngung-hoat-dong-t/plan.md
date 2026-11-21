# Kế hoạch sản xuất · IT-T16

**Một tập chuẩn 45–75 s, một câu hỏi, một cơ chế.** Có tiền mà QR báo "Chưa xác nhận": mọi kênh phải hỏi một hệ thống lõi ghi số dư, lõi không trả lời thì cả ba kênh đứng. Dự phòng chỉ nhắc ngắn ở S09; mốc giờ chỉ là định tính; không tách thêm tập.

## Các tập

| Mã video | Tên tập | Thời lượng mục tiêu | Thông điệp chính |
|---|---|---|---|
| IT-T16-E01 | Ngân hàng ngừng 24 giờ: có tiền sao chưa trả được? | Khoảng 59 s, dự trù 59,40 s (chuẩn 45–75 s, mục tiêu ≈ 55–65 s) | Báo lỗi chưa có nghĩa là mất tiền. QR, app, ATM đều hỏi một hệ thống lõi; lõi im thì các kênh đứng. Đừng bấm gửi lại vội, kiểm lịch sử và thông báo chính thức trước. |

## Phong cách hình ảnh (Y4, R4–R7, R12, D7)

Motion graphics giáo dục dọc, hình khối bo góc, cạnh sáng mềm, đổ bóng nhẹ hướng dưới phải. Một đồ vật nhận diện xuyên suốt: **cuốn sổ ghi số dư** (sổ mở, dòng kẻ, một dòng của "bạn"), xuất hiện ở S03, trong khối lõi ở S05–S07, S08 và S09. Ba kênh là ba **cánh cửa/cổng** cùng họ hình, xếp dọc: QR, App, ATM. Điện thoại, quầy cơm, khay cơm vẽ bằng hình học; bỏ logo, tên ngân hàng, tên NAPAS ở vật hình, ảnh chụp, dữ liệu thật. Mọi khối "lõi" trong tập là **một hệ thống lõi giả định, vô danh**.

| Màu | Nghĩa nhất quán | Tín hiệu hình đi cùng |
|---|---|---|
| `#60A5FA` | Yêu cầu/dữ liệu đang đi, thành phần trung tính | Gói hỏi chạy, viền sổ |
| `#34D399` | Đã xác nhận, đúng, hành động an toàn | Dấu kiểm, kênh chạy, lõi trả lời |
| `#FB7185` | Lỗi, kênh đứng, nguy cơ trùng lệnh | Cổng đỏ, viền răng cưa, dòng "Lệnh 2" |
| `#FBBF24` | Đang chờ, chưa xác nhận, đang xét | "Chưa xác nhận", vòng quay, nét đứt |
| `#94A3B8` | Mất kết nối, ngoài phạm vi, không dùng được | Khối xám, đường đứt |
| `#F1F5F9` | Chữ và vạch nội dung | Chữ sáng, viền tối |

| Bối cảnh · phạm vi | Xa / giữa / gần | Chuyển động và góc nhìn | Tỷ lệ ngân sách |
|---|---|---|---:|
| Quầy cơm/bàn `office` · S01–S03, S10–S11 | Tường xanh than `#111D30` / quầy và khay cơm / điện thoại, QR, sổ | Toàn quầy → cận điện thoại → trung sổ → trở lại đúng góc quầy ở S10 | 38,7% |
| Hệ thống lõi `database` · S04–S06 | Nền lam đậm `#101C2A` / các khối lõi vô danh / gói hỏi, sổ | Toàn dòng yêu cầu → zoom vào một khối → sơ đồ dọc → so sánh hai nửa | 35,0% |
| Sự cố `incident` · S07, S09 | Nền tím than `#1E1931` / điện thoại và sổ; hai khối lõi / nút Gửi, đường chung | Trung hai vật cạnh nhau, cận nút Gửi; trung hai khối | 17,7% |
| Xác nhận `security` · S08 | Nền `#151D34` / màn hình lịch sử / dòng khớp, thông báo | Trung màn hình → cận dòng khớp | 8,6% |

Không nền nào vượt 40%. Cỡ cảnh luân phiên toàn–trung–cận.

**Khung và chữ.** 1080×1920, vùng an toàn x≈90–990, y≈250–1500. Vật chính thường y≈410–1230. Cụm vật/quan hệ chính cao ≥ 560 px ở S02, S04, S05, S06, S07 (kể cả so sánh S06 đo theo toàn cụm). S08 và S09 nhỏ hơn được phép: ghi lý do, cụm chính vẫn ≥ 500 px. Segoe UI Semibold 56–60 px cho nhãn (header 56 px), Segoe UI Bold ≥ 72 px cho khoá/số (96 px cho tiêu đề opening). Opening xuống dòng theo cụm nghĩa. Text engine đo trước, lề trong hộp ≥ 24 px. Mỗi nhịp một tiêu điểm, tối đa 3 nhóm chữ ngoài phụ đề. Cột "Chữ trên màn hình" của `script.md` là danh sách chữ duy nhất của lớp đồ họa. Chuyển động chữ chọn lọc, tối đa một lần mỗi cảnh (kinetic ở S05 "Hệ thống lõi").

**Phụ đề.** Nguyên văn cột lời, cập nhật mốc sau TTS. Segoe UI Semibold 56 px, trắng `#F1F5F9`, viền tối 4 px. Tối đa 2 dòng, ≤ 28 ký tự/dòng, dải y≈1340–1500, không chồng Cáo/đạo cụ. Dựng `assets/_scratch/picture.mp4` trước (không phụ đề, giữ cho QC), rồi đốt ASS.

**Âm thanh (R25, `docs/asset-sources.md`).** Chỉ giọng Hải Đăng (VieNeu-TTS Bắc, cục bộ) và hiệu ứng ngắn tự tạo ở cột âm thanh của script. Không nhạc nền (`layers.music.enabled` tắt). Giọng [dẫn] thử `atempo` 1,15, [kỹ thuật] 1,10, trần 1,20 (Y6). Sinh theo câu hoàn chỉnh; nghỉ tính cả khoảng lặng TTS đã sinh. Mục tiêu hỗn hợp khoảng −14 LUFS, đỉnh ≤ −1,5 dBTP. Phát âm và nhịp chờ giám đốc nghe.

### Opening và header (R14, R20, R21, R26)
- **Opening S01 0,00–5,00 s** (mục tiêu 5–8 s), kiểu `question`/`hypothetical`, ba pha: `visual_hook` (quét QR, 0,00–1,60 s), `conflict` (điện thoại đổi "Chưa xác nhận", suất cơm chờ, 1,60–3,40 s), `topic_reveal` (tiêu đề **"NGÂN HÀNG NGỪNG 24 GIỜ?"**, 3,40–4,95 s, ≥ 96 px, bật một lần). Có lời hook (lời 01 bắt đầu 0,60 s, trong khoảng 0,6–3,0 s).
- **Header "BANKING / HỆ THỐNG LÕI"** có ở **mọi cảnh sau opening** (S02–S11), x≥100, y≈265, 56 px; đổi ô khi che sơ đồ/Cáo (S05–S06 chuyển ô trên-phải; S11 ô trên-trái). Không đọc header.
- **Bìa/thumbnail (R7):** khung S02 khoảng 8,3 s: ba cổng đỏ xếp dọc và vòng đồng hồ. Đọc được ở 180×320, không bê lưới nhãn.
- **Chip chương (R7):** ba dấu tiến độ không chữ nằm trong nhóm header: sự cố (S02–S04), cơ chế (S05–S07), xử lý (S08–S11). Không tính là chữ thêm.

### Bản đồ Cáo (Y2–Y3)

| Cảnh · thời điểm dự kiến | Dáng và hành vi | Cỡ và vị trí |
|---|---|---|
| S01 · 0,00–3,00 s | `think`, nhìn điện thoại đang quét QR | Rộng 180 px, x=103, mép đáy y=1270 |
| S03 · 9,50–12,50 s | `present_hand`, tay hướng về cuốn sổ | Rộng 160 px, x=106, mép đáy y=1260 |
| S07 · 35,50–38,00 s | `stop`, nhìn nút Gửi | Rộng 160 px, x=105, mép đáy y=1270 |
| S11 · 55,80–59,40 s | `thumbs_up`, hướng về hai thẻ rồi người xem | Rộng 175 px, x=105, mép đáy y=1290 |
| Còn lại | Không Cáo | Bố cục dành cho hình |

Tổng thời gian có Cáo ≈ 12,1 s / 59,40 s ≈ 20,4% (≤ 25%). Đổi dáng cách ≥ 2 s. Cáo không nhép miệng; mỗi dáng nhìn/chỉ/phản ứng với vật đang đổi, không làm nhãn dán (R6). Rộng 108–194 px khi cùng minh hoạ, giữ trống sổ, nút Gửi và dải phụ đề.

## Chiều sâu (R15)

| Câu hỏi | Cảnh / phần lời trả lời | Bằng chứng nhìn thấy |
|---|---|---|
| Vấn đề thực tế là gì? | S01–S02. Có tiền mà QR báo chưa xác nhận; ba kênh cùng đứng. | QR đổi sang "Chưa xác nhận", rồi ba cổng đỏ lần lượt, người chờ trước cổng QR. |
| Vì sao quan trọng? | S04. Quy mô hằng ngày rất lớn: NAPAS bình quân hơn 32 triệu giao dịch/ngày năm 2025. | Dòng yêu cầu dày lên cùng số đếm. |
| Nguyên nhân/cơ chế? | S03, S05–S06. Mọi kênh hỏi hệ thống lõi ghi số dư; lõi im thì kênh đứng; hệ thống thà dừng còn hơn ghi sai. | Gói hỏi đi vào, gói đáp quay ra, kênh chỉ chạy khi nhận đáp; lõi xám thì cả ba kênh đỏ; hai nửa "Ghi sai" và "Dừng". |
| Ví dụ giúp hình dung? | S01, S07, S10. Quầy cơm và nút Gửi. | Cùng một điện thoại, khay cơm, nút Gửi từ hook đến kết. |
| Hậu quả/sai lầm thường gặp? | S07, S09. Bấm gửi lại có thể thành hai lệnh; dự phòng chung điểm lỗi thì vẫn đứng. | Sổ từ một dòng thành hai dòng sau khi nhấp lại; hai khối cùng xám khi đường chung đứt. |
| Giải pháp/bài học? | S08, S10–S11. Kiểm lịch sử và thông báo chính thức trước khi thử lại. | Dòng lịch sử khớp dòng sổ; con trỏ chọn lịch sử thay vì Gửi ở quầy cơm. |

**Tỉ lệ dựng.** Opening 8,4%; hook (S02) 7,6%; vấn đề và câu hỏi (S03–S04) 18,8%; cơ chế (S05–S06) 25,0%; sai lầm (S07) 9,3%; giải pháp và giới hạn (S08–S09) 17,0%; kết và kêu gọi (S10–S11) 14,0%. Co giãn theo TTS và R13. Mốc: hệ quả trước 5 s, trả câu hỏi ở 12,0 s, cơ chế 20,8–28,1 s, quay về quầy cơm ở 51,1 s.

## Ngân sách thời lượng

Hệ số: [dẫn] 4,40 âm tiết/s, [kỹ thuật] 4,25 âm tiết/s (đã gồm `atempo` 1,15/1,10 theo Y6, từ ≈ 4,3 của T9); mỗi thuật ngữ tiếng Anh/viết tắt cộng 1 âm tiết dự trù (QR, app, ATM ở lời 06, tính trong 21 âm tiết). Giây đọc = âm tiết ÷ tốc độ. Nghỉ gồm khoảng vào lời, giữa các câu và giữ sau lời (R13); mỗi mốc tính một lần; đuôi chỉ ở cảnh cuối, ≤ 0,7 s. Mỗi cảnh = max(lời + nghỉ, tối thiểu theo độ phức tạp + giữ sau lời).

| Tập / đoạn | Nhãn | Âm tiết | Tốc độ | Đọc (s) | Nghỉ Y7 gồm giữ R13 (s) | Đuôi (s) | Tổng (s) |
|---|---|---:|---:|---:|---:|---:|---:|
| Opening (S01) | [dẫn] | 9 | 4,40 | 2,05 | 2,95 | 0,00 | 5,00 |
| Hook (S02) | [dẫn] | 11 | 4,40 | 2,50 | 2,00 | 0,00 | 4,50 |
| Câu hỏi và quy mô (S03–S04) | [dẫn] | 38 | 4,40 | 8,64 | 2,51 | 0,00 | 11,15 |
| Cơ chế (S05–S06) | [kỹ thuật] | 45 | 4,25 | 10,58 | 4,27 | 0,00 | 14,85 |
| Sai lầm (S07) | [dẫn] + [kỹ thuật] | 17 | 4,40 / 4,25 | 3,97 | 1,53 | 0,00 | 5,50 |
| Kiểm tra và giới hạn (S08–S09) | [dẫn] + [kỹ thuật] | 31 | 4,40 / 4,25 | 7,15 | 2,95 | 0,00 | 10,10 |
| Kết và mời bình luận (S10–S11) | [dẫn] | 28 | 4,40 | 6,36 | 1,34 | 0,60 | 8,30 |
| **IT-T16-E01 · tổng** | | 179 | | 41,25 | 17,55 | 0,60 | 59,40 |

Số cảnh 11 (≲ 59,4 ÷ 5 ≈ 11,9), trung bình 5,4 s/cảnh, cảnh ngắn nhất 3,5 s (S10, Low). Đo lại sau TTS; nếu vượt 65 s thì rút lời 13 (dự phòng) trước, giữ tốc độ.

## Nguyên liệu cần

| Nguyên liệu | Nguồn được phép và cách chuẩn bị |
|---|---|
| Nền | `tools/backgrounds/make_background.py --theme office|database|incident|security`, theo bảng màu trên. |
| Cáo | `brand/cao/poses/`: `think`, `present_hand`, `stop`, `thumbs_up`; lớp trong suốt theo mốc. |
| Điện thoại, QR, khay cơm, ba cổng, cuốn sổ, khối lõi, gói hỏi, đồng hồ 24 giờ, màn hình lịch sử | Tự vẽ bằng Pillow và `tools/motion/` (`components`, `flow.FlowDiagram`/`request_stream`/`comparison`, `charts.counter`, `kinetic`, `header`). QR là hình học tự vẽ, không mã thật, không logo. |
| Giọng và tiếng nhấp/chạm | VieNeu cục bộ theo `docs/voice.md`; hiệu ứng tự tổng hợp ngắn; ffmpeg chuẩn hoá. |

Ảnh nền/đạo cụ do Gemini sinh (nếu storyboard yêu cầu) chỉ qua `approved.json` theo quy trình; kịch bản này không bắt buộc ảnh sinh.

### Cần giám đốc cung cấp
Không thiếu nguyên liệu bắt buộc. Mục **cần giám đốc kiểm/nghe** (không chặn dựng):
1. Nghe phát âm "NAPAS", "hai không hai lăm" (năm), QR/ATM từng chữ cái (`docs/voice.md`).
2. Số NAPAS là **bình quân cả năm 2025 trên hệ thống NAPAS (liên ngân hàng)**, không phải số của một ngân hàng; video chỉ dùng như thước đo quy mô, không nói mọi giao dịch đổ về một lõi (S04 vẽ nhiều khối lõi vô danh).
3. "Hệ thống lõi, nơi ghi số dư" là mô tả chung; kiến trúc từng ngân hàng khác nhau (xem mục nguồn trong script; "thường", không "mọi", vì mạng thẻ có stand-in). Cần giám đốc kiểm nếu muốn nói chắc hơn: quy định dự phòng/khôi phục thảm hoạ của Ngân hàng Nhà nước (chưa đối chiếu; lời 13 đã làm mềm). Thời lượng sau chốt ≈ 60,1 s.
4. Caption nêu "kịch bản giả định" và không đưa tên ngân hàng; giám đốc xác nhận cách nói bằng giọng đọc ở giây 5.

## Tiêu chí nghiệm thu
- MP4 9:16, 1080×1920, 30 fps, H.264 yuv420p + AAC, `faststart`, ≤ 250 MB; thời lượng 45–75 s, mục tiêu ≈ 59 s. Có `captions.srt`, `thumbnail.jpg`, `publish.json` đủ tiêu đề/mô tả/hashtag ba nền tảng, nguồn và khai báo AI (`ai_generated_content: true`). `qc-publish` pass.
- Hook: lời 01 bắt đầu ≤ 0,8 s; hệ quả (QR "Chưa xác nhận", suất cơm chờ) thấy trước 3,5 s; ba cổng đỏ trước 8 s; câu trả lời "Các kênh thường phải hỏi một cuốn sổ trước" bắt đầu ≤ 13 s.
- Opening 5,0 s ba pha, tiêu đề ≥ 84 px; header có ở S02–S11 và đổi ô không đè; không nhãn «AI», «Ví dụ dựng» hay chữ thừa.
- 11 cảnh, trung bình ≈ 5,4 s; High ≤ 1 khái niệm mới (S05 giữ sơ đồ hoàn chỉnh ≥ 2 s); tối đa 2 khái niệm mới trong 10 s; mỗi khoảng 1,5 s có chuyển động nội dung nhận ra ở 360×640; khung tĩnh > 2 s ghi lý do. `voice` theo cảnh khớp TTS; thành phần hiện cùng hoặc ≤ 0,5 s sau lời nhắc.
- Kiểm trạng thái sự cố đổi ≥ 3 lần: QR chờ (S01), ba cổng đỏ (S02), lõi xanh → xám (S05–S06), sổ 1 → 2 dòng (S07), dòng lịch sử khớp (S08); và S10 trả đúng khung quầy cơm của S01.
- Tắt tiếng, che phụ đề vẫn nhận ra: ba cổng đứng khi lõi im, "Ghi sai" so với "Dừng", sổ có hai dòng sau bấm lại, lịch sử khớp sổ.
- Đo tốc độ đọc theo `qc-measure` (tăng 10–15% so với T8, ≈ 4,6–4,8 âm tiết/s có tiếng), đuôi ≤ 0,7 s; rà `pronounce` và `phonemes.py`; giám đốc nghe phát âm và nhịp.
- Tổng thời gian Cáo ≲ 25%; chữ trên hình khớp bảng "Chữ trên màn hình" (độ giống lời < 0,6).

## Rủi ro & dự phòng

| Rủi ro | Cách xử lý |
|---|---|
| Người xem hiểu là sự cố có thật hoặc đoán ngân hàng/NAPAS | Giọng nói "mình dựng thử" ở giây 5; khối lõi vô danh, không logo; caption ghi "(ví dụ dựng)". Không dùng tên tổ chức ở vật hình. |
| Số 32 triệu bị hiểu là số của một lõi hoặc "mất" khi sập | Lời nói "bình quân" và NAPAS; không có đếm ngược về 0; S04 nhiều khối lõi vô danh. Không dùng số 70 triệu (khác cách đếm). |
| Bị hiểu "tiền chắc chắn còn nguyên" hoặc khuyên bấm/không bấm tuyệt đối | Lời dùng "chưa có nghĩa là", "có thể", "chỉ lịch sử và thông báo chính thức mới xác nhận". Không câu "tiền vẫn còn nguyên". |
| Gây hoảng hoặc gợi rút tiền | Không mốc giờ cụ thể, không đếm ngược, CTA chỉ hỏi thói quen đầu tiên; không nhắc tiền mặt. |
| Sơ đồ S05–S06 quá dày ở 360×640 | Ba kênh + một lõi + một sổ, ≤ 3 nhóm chữ; ẩn header đổi ô nếu che; giữ trạng thái hoàn chỉnh 2 s. |
| Vượt trần thời lượng sau TTS | Rút lời 13 (dự phòng) hoặc hạ nghỉ ở S01; giữ `atempo` trong dải Y6; không tăng tốc để bù. |
| Component không diễn được so sánh/dòng sổ | Dùng Pillow + FFmpeg theo R9; giữ nguyên bằng chứng hình; ghi đề nghị vào `notes.md`. |
