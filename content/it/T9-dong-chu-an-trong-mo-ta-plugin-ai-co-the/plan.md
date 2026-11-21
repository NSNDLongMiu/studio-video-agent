# Kế hoạch bộ video · IT-T9 · Tool poisoning trong mô tả plugin AI

Tập giải thích sâu bám một sự cố với cùng plugin cộng và cùng file góc khuyết. Hai cơ chế của cùng chủ đề là **phần mô tả đã đến trợ lý lúc nạp** và **phần mô tả đổi sau duyệt**. Tờ giấy gập là đối chiếu trong 4,85 s. Giữ 27 cảnh nội dung và hai cảnh so bản dài 16 s theo Phán quyết cuối, thêm S00 opening riêng theo D8. S19 thử một cập nhật hợp lệ của cùng plugin để minh hoạ vì sao gặp bản đổi thì cần duyệt lại.

| Mã video | Tên tập | Thời lượng mục tiêu | Thông điệp chính |
|---|---|---|---|
| IT-T9-E01 | Một phép cộng, một file ra ngoài | Mục tiêu vòng 2 là 175–185 s gồm opening, dự kiến **179,68 s** ở **4,68 âm tiết/s có tiếng**. D1 cho phép 150–190 s. Bản đăng chung phải ≤ 180 s để đủ điều kiện Shorts, ngân sách dự kiến còn 0,32 s. | Phép tính đúng chưa chứng minh plugin sạch. Duyệt phần mô tả AI đọc, đối chiếu bản sắp nạp, rồi cấp quyền tối thiểu. |

## Mạch kể theo tỉ lệ (D1)

| Phần | Tỉ lệ tham chiếu | Phân bổ bản này | Triển khai |
|---|---:|---:|---|
| Opening | 1–3 s | 1,3% | S00 là thumbnail động có tiêu đề và nhãn chủ đề. |
| Hook | ≈ 8% | 9,1% | S01–S04 cho thấy phép cộng, hệ quả, chỗ mở log, câu hỏi và lời hứa ba bước kiểm. |
| Bối cảnh và vấn đề | ≈ 15% | 9,4% | S05–S08 lần log mở–gửi–nhận, lật tờ giấy gập. |
| Nguyên nhân và cơ chế | ≈ 25% | 27,7% | S09–S13 chia đôi hai bản nhìn, chỉ hàng ẩn, giữ bộ đếm ở 0 khi mô tả đã tới trợ lý, theo file tới khay ngoài qua cổng quyền. |
| Phân tích sâu và ví dụ | ≈ 30% | 29,6% | S14–S19 phân biệt điều log xác nhận với việc tìm nguyên nhân, chồng bản đã duyệt và bản mới, đối chiếu thêm bản cập nhật hợp lệ. |
| Giải pháp | ≈ 14% | 17,3% | S20–S25 đi qua ba bước kiểm, sau đó phát lại cùng mô tả khi quyền gửi bị chặn. |
| Tổng kết và kết | ≈ 6% | 5,5% | S26–S27 trở lại đúng màn hình hook, chỉ dòng ẩn, chốt tác dụng của quyền rồi hỏi người xem. |

## Chiều sâu (R15)

| Câu cần trả lời | Cảnh/lời và hình mang câu trả lời |
|---|---|
| Vấn đề thực tế là gì? | S01–S03, L01–L08. Ô nhập và số 5 cạnh nhật ký có file rời vùng nội bộ. Cáo hỏi nguồn của hành động gửi. |
| Vì sao quan trọng? | S02 và S05–S07, L03–L04 và L11–L16. File thuộc phòng người dùng. Khay nhận bên ngoài có đúng file ấy, kết quả tính vẫn đúng. S14 L36–L39 tách vai trò của số 5, nhật ký và bản mô tả đã nạp. |
| Cơ chế nào dẫn tới đó? | S09–S13, L19–L35. S11 L27 chỉ hàng nằm dưới mép ở 55,24 s. Mô tả đã tới trợ lý khi bộ đếm riêng của plugin cộng còn 0. Trợ lý có thể làm theo. S13 theo file góc khuyết qua cổng quyền đã mở tới khay ngoài. |
| Ví dụ nào giúp hình dung? | S08 L17–L18 mở tờ giấy gập trong 4,85 s. S15–S16 L40–L47 chồng bản đang nạp lên bản đã duyệt để lộ hàng đổi. S19 L54–L56 thử cập nhật hợp lệ làm đổi cách diễn đạt nhưng phép tính giữ nguyên, rồi đặt bản mới vào khay chờ duyệt. |
| Hậu quả hoặc sai lầm thường gặp? | S11 L25–L29 cho thấy chỉ đọc phần xem trước sẽ bỏ qua hàng dưới. S17–S19 L48–L56 cho thấy dấu kiểm cũ thuộc bản lưu và có thể bị hiểu nhầm là áp dụng cho bản mới. S25 L68–L69 đối chứng hệ quả mất file khi cổng gửi mở ở lượt gốc. |
| Giải pháp và bài học? | S20–S27 L57–L73. Duyệt và quét phần đầy đủ → ghim bản đã duyệt và so mô tả sắp nạp mỗi phiên → chỉ cấp quyền cần thiết. Lượt đối chứng chặn gửi vẫn có dòng ẩn. S26 L70 khoanh lại chính dòng đó ở 169,94 s. |

## Hình ảnh

Đồ hoạ phẳng công sở, hình khối góc bo và lớp xa/giữa/gần. Lớp xa dùng gradient, lớp giữa chứa vật hoặc mặt làm việc, lớp gần chứa chi tiết cần quan sát. Ánh sáng mờ, cạnh đối tượng sắc, một tiêu điểm chuyển động mỗi nhịp. Cữ lề x=90–990 px, vùng an toàn y≈250–1500 px. Khối đồ hoạ chính y≈355–1310 px. Ở S11/S12/S16/S21/S25, cụm vật/chuyển động chính cao ≥560 px trong vùng an toàn. Mỗi tấm mô tả ở hai cảnh 16 s cao ≥630 px. Opening, cảnh hai vùng hoặc đối chứng có thể có vật lẻ nhỏ hơn để giữ quan hệ trong cùng khung, nhưng file góc khuyết, viền và hai điểm dừng phải đọc được khi thu xuống 360×640.

| Nền | Cảnh · thời lượng | Bối cảnh, ánh sáng và cỡ cảnh |
|---|---|---|
| A · `office` | S00–S03, S26–S27 · 24,40 s | Bàn công sở, xa là khung cửa, giữa là nhân viên hình khối và máy tính, gần là file/log. Ánh lam dịu qua vai. Opening toàn vào vai, hook toàn → cận → trung, kết trở lại trung rồi toàn. |
| I · `security`, bàn kiểm nhanh | S04 · 4,30 s | Toàn nhìn xéo bàn có ba khe và công tắc ở lớp giữa. Dải sáng hẹp lần lượt làm rõ thứ tự ba khe. |
| B · `incident` | S05–S07, S14 · 20,33 s | Bảng nhật ký lớn. Xa là vùng tối, giữa là đường biên, gần là ba thẻ log. Cận → trung → toàn → trung. Chỉ rọi thẻ đang đổi. |
| C · `office`, mặt bàn | S08 · 4,85 s | Ánh xiên thấy nếp gập, cận nhìn thẳng xuống. Mở giấy để chuyển sang hai khung. |
| D · `code`, giao diện mô phỏng | S09–S11 · 30,00 s | Trung giao diện → cận terminal giả → toàn chia đôi. Xa là gradient than, giữa là hai khung, gần là thước ngang và hàng khoanh. |
| E · `incident`, tuyến từ ứng dụng ra biên | S12–S13 · 19,80 s | Trung terminal mô phỏng dạng cửa sổ trên bảng sự cố → toàn sơ đồ rẽ nhánh. Lớp giữa là nút trợ lý, gần là tấm mô tả và bộ đếm. Đường biên nối tiếp bảng sự cố ở S14. |
| F · `security`, bàn lưu | S15–S18 · 35,10 s | Nền xanh than, ngăn duyệt phía xa, hai tấm ở giữa, tay silhouette và mép bóc ở gần. Cận → trung → trung → cận. |
| J · `code`, bàn đối chiếu | S19, S23 · 15,80 s | Cận rồi trung mặt terminal trơn. Hai khe đặt tấm theo đúng hàng. Ánh viền chỉ vào chỗ khác và khay chờ duyệt. |
| G · `office`, bàn kiểm | S20–S22 · 15,35 s | Ánh bàn làm việc sáng hơn nền F. Ba khe kể thứ tự. Toàn → cận → trung với con trỏ, vạch quét và khay kiểm. |
| H · `security`, ranh giới quyền | S24–S25 · 9,75 s | Toàn các cổng quyền → cận hai lượt trước/sau xếp dọc. Sáng tại chốt và khoảng trống của khay, dùng cùng hình công ty ở S01. |

| Chủ đề nền | Tổng thời lượng | Chuỗi liền dài nhất |
|---|---:|---:|
| `office` · A/C/G | 44,60 s (24,8%) | 4 cảnh, S00–S03 |
| `incident` · B/E | 40,13 s (22,3%) | 3 cảnh, S05–S07 và S12–S14 |
| `code` · D/J | 45,80 s (25,5%) | 3 cảnh, S09–S11 |
| `security` · I/F/H | 49,15 s (27,4%) | 4 cảnh, S15–S18 |

Tính theo chủ đề của nền đã khai trong `environment`, gộp tất cả biến thể. Dấu nhận diện và nghĩa màu nối các nền qua cú cắt. Hai cảnh terminal S10 và S12 dùng hình khối và các nhãn đã chốt. Cảnh cao điểm quay bằng chuyển động của tấm, file, đường biên và cổng. Camera dịch để lộ quan hệ hoặc đổi cỡ cảnh. Khung có nhịp ≥1,50 s dùng chuyển động có đích hoặc lộ thêm quan hệ. Giữ sơ đồ 2–3 s với vệt nhấn đi qua các vật đã lộ để người xem theo kịp.

| Nghĩa | Màu | Dấu hiệu hình học |
|---|---|---|
| Nền sâu và nền bàn | `#111A2B`, `#23384F` | Gradient dịu, viền mảnh lam xám ở lớp xa. |
| Vật thông thường, ngăn hoặc trạng thái chưa kích hoạt | `#8497AD` | Nét liền trung tính. Dấu duyệt cũ nằm trên phiếu riêng cạnh tấm lưu. |
| Đúng, hợp lệ hoặc bước kiểm hoàn tất | `#59D2A0` | Dấu kiểm đơn hoặc nét liền quanh kết quả. Dùng cho trạng thái quan sát được. |
| Hành động lệch, hàng có vấn đề hoặc đường rò | `#FF6868` | Viền đứt quanh khối che hoặc mũi tên vượt viền. Khối che dùng `#542C3C` để chừa tương phản. |
| Đang rà soát hoặc quyền bị chặn | `#FFC36B` | Khung đang xét có góc mở. Chặn quyền dùng thanh ngang đặc. |
| Nhấn hướng nhìn hoặc quan hệ đang giải thích | `#62C7F5` | Vệt sáng chạy một lần dọc thước, đường nối hoặc mép tấm. |
| Chữ trên nền tối | `#F2F6FA` | Nền phụ đề `#111A2B` mờ, đủ tương phản. |

- Segoe UI Semibold cho nhãn/header, Segoe UI Regular hoặc Semibold 56 px cho phụ đề, Bahnschrift Semibold cho số. Keyword ≤3 từ, ≥72 px. Nhãn UI ≥56 px. Tiêu đề opening 86 px, nhãn chủ đề opening 42 px. `2 + 3` và `5` ở hook 114–132 px để kiểm bìa. Tối đa 3 nhóm chữ ngoài phụ đề, kể cả header. Hai dòng của một header tính một nhóm. Số đầu vào và kết quả ở S01 thuộc cùng nhóm phép tính. «Lượt gọi plugin» và «0» ở S12 thuộc cùng nhóm đồng hồ.
- Cột “Chữ trên màn hình” của script là danh sách chữ chính xác, có đối tượng và mốc hiện/ẩn. Text engine vẽ tất cả. Các nhịp kinetic bám Bản đồ ngữ nghĩa. Giữa các lần nhấn, cho vật, đường nối và trạng thái kể chuyện.
- Phụ đề nguyên văn, lớp accessibility độc lập. Y≈1340–1500 px, cỡ 52–60 px, tối đa 2 dòng × 28 ký tự. Ngắt theo cụm nghĩa, chừa ngang ≥90 px. Hết câu thì rời khung theo tiếng, so riêng bản `picture.mp4` và bản có phụ đề.
- Bìa từ cuối S01 khoảng 4,62 s, khi số 5 và file chạm khay cùng nằm trong khung. Kiểm ở 180×320 với phép tính, đường biên và vết góc khuyết đọc được. Dùng chữ đã có ở hook.

## Opening, header và chip chương (R14, R7)

| Cảnh · mốc | Chữ nguyên văn và lý do | Ô và bố cục |
|---|---|---|
| S00 · 0,00–2,40 s | `Dòng ẩn trong mô tả plugin AI` + `SECURITY / PLUGIN AI`, opening | Chữ vào lúc 0,12 s cùng một tiếng báo ngắn. Tiêu đề 86 px ngắt sau “trong”, nhãn chủ đề 42 px cạnh tiêu đề. Gắn vào vùng đầu cửa sổ máy tính. Máy quay tiến từ toàn vào vai. Chưa có lời. |
| S01–S04 · 2,40–18,75 s | `SECURITY / PLUGIN AI` + `Dòng ẩn`, header | `top_left` S01–S03, `top_right` S04, chừa chỗ cho phép tính, đường biên và bàn ba khe. |
| S05–S08 · 18,75–35,58 s | `SECURITY / PLUGIN AI` + `Lần theo log`, header | `top_left` S05–S07, `top_right` S08, tránh thẻ log và mép tờ giấy. |
| S09–S11 · 35,58–65,58 s | `SECURITY / PLUGIN AI` + `Hai khung xem`, header | `top_left` S09–S10, `above_captions` S11 để hai tấm cao có đủ chỗ. |
| S12–S13 · 65,58–85,38 s | `SECURITY / PLUGIN AI` + `Lúc nạp công cụ`, header | `top_right`, chừa tuyến thẻ → trợ lý và tuyến qua cổng. |
| S14 · 85,38–93,73 s | `SECURITY / PLUGIN AI` + `Lần theo log`, header | `top_left`, cách ô tính và bảng nhật ký. |
| S15–S19 · 93,73–138,63 s | `SECURITY / PLUGIN AI` + `Bản đổi sau duyệt`, header | `top_left` S15/S17/S18, `above_captions` S16, `top_right` S19. Né mép hai tấm và phiếu duyệt. |
| S20–S25 · 138,63–169,73 s | `SECURITY / PLUGIN AI` + `Ba bước kiểm`, header | `top_left` S20–S22/S24–S25, `top_right` S23. Tách dải chip khỏi header và hai tấm đối chiếu. |
| S26–S27 · 169,73–179,68 s | `SECURITY / PLUGIN AI` + `Trở lại phép cộng`, header | `top_right`, chừa vùng vòng khoanh, khay rỗng và hai vật của câu hỏi cuối. Câu chốt vào 172,58 s, câu hỏi kêu gọi ở S27 vào 175,73 s. |

Header có ở mọi cảnh từ S01 đến S27. Dùng text engine và `HeaderTrack`. Dòng chủ đề ≥40 px, dòng chương ≥52 px. Giữ trong vùng an toàn, diện tích ≤9% khung, rộng ≤90%, cao ≤200 px, cách vật/Cáo/phụ đề ≥24 px. Với ô `above_captions`, chừa dải trên phụ đề và nâng cụm vật khi cần. Đối chiếu ô với hộp bao thực tế rồi dịch sang ô còn trống tại ranh giới cảnh nếu cần, giữ chữ đọc được trong lúc chuyển ô. Cột “Chữ trên màn hình” ghi mốc từng cảnh.

Ba chip biểu tượng xuất hiện ở S20 L58 cạnh mép phải trên, theo thứ tự kính lúp → ghim → cổng. Đổi phía khi header lên `top_right` ở S23 để hai cụm có khoảng cách. Tick lần lượt ở S22, S23, S24. S27 thu ba biểu tượng đã tick thành một thẻ cạnh Cáo. Chip dùng biểu tượng, mỗi dấu tick đi cùng thao tác kiểm đã thể hiện.

**Nhãn và kinetic (D7/R22).** Đạo diễn hình ảnh lấy từng mục “Cần nhãn” cùng đối tượng từ Bản đồ ngữ nghĩa, rồi lấy cửa sổ hiện/ẩn từ cột chữ của script. Các nhịp nhấn là S01 số 5 (2,62 s), S06 Đã gửi (24,09 s), S09 Bản AI đọc (37,81 s), S11 Dòng ẩn (55,24 s), S13 Quyền thực thi (79,22 s), S16 Bản đang nạp (103,94 s), S18 Rug pull (124,60 s), S21 Bản đầy đủ (144,56 s), S23 Ghim phiên bản (154,71 s) và S26 Dòng ẩn (169,94 s). Khoảng cách 10,15–24,72 s, mỗi cảnh tối đa một lần và có ít nhất một cảnh xen giữa. S12 dành cho tấm mô tả và đồng hồ 0 chuyển trạng thái giữa hai nhịp kinetic S11/S13.

## Bản đồ Cáo (Y2–Y3)

Dùng dáng PNG đã có và cắt khi đổi dáng. Chừa tối thiểu 2 s giữa các lần đổi dáng, không nhép miệng. Vị trí tính theo mép trái và đáy asset đã cắt mép trong suốt. Gắn Cáo với vật đang đổi, kiểm chừa khoảng trống cạnh tấm dài ở S09. Tổng **23,46 s / 179,68 s ≈ 13,1%**, ngưỡng vòng 2 ≲15%. Các dáng rộng 146–160 px (13,5–14,8% chiều ngang).

| Nhóm | Cảnh · mốc có Cáo | Có/không | Dáng, hành vi, cỡ/vị trí |
|---|---|---|---|
| Opening và ích lợi | S00, S02, S04–S08 | Không | Bàn và máy tính, khay, log và tờ giấy chiếm tiêu điểm. |
| Mở | S01 · 2,40–4,65 s, S03 · 10,49–14,45 s | Có | `think`, hướng vào ô tính rồi nhìn đầu vệt đỏ khuất sau cửa sổ. x=110, đáy y=1290, rộng 146 px. Đầu S03 tới 10,49 s chưa hiện Cáo. |
| Chuyển vào cơ chế | S09 · 35,58–38,30 s | Có | `surprised`, nhìn tấm dài đang hé, đứng ngoài mép phải của tấm. x=800, đáy y=1280, rộng 152 px. Phần còn lại S09 dành khung cho hai tấm. |
| Giữa | S10–S16 | Không | Terminal, bộ đếm và hai cảnh so bản đứng chính. |
| Giữa | S17 · 115,93–118,51 s | Có | `bow`, cúi cạnh phiếu duyệt gắn với bản lưu. x=105, đáy y=1290, rộng 154 px. Qua 118,51 s giữ bàn và tay silhouette. |
| Giữa | S18–S19 | Không | Đặt bản đã duyệt và bản cập nhật vào bàn đối chiếu. |
| Chuyển vào giải pháp | S20 · 138,63–140,63 s | Có | `idea`, hướng về khe đầu trên bàn kiểm. x=110, đáy y=1285, rộng 154 px. Từ 140,63 s, tấm mô tả chiếm tiêu điểm. |
| Giải pháp | S21–S25 | Không | Bàn kiểm, ghim, chốt và hai lượt đối chứng đứng chính. |
| Kết | S26–S27 · 169,73–179,68 s | Có | `thumbs_up`, đứng cạnh hàng khoanh rồi cạnh thẻ ba bước, giữ cùng dáng qua cú cắt. x=105, đáy y=1290, rộng 160 px. |

## Âm thanh và nhịp

Giọng Hải Đăng, Bắc, tổng hợp cục bộ bằng VieNeu. Tính ngân sách theo 4,68 âm tiết/s có tiếng, lấy từ số đo T9 bản đầu. QC dùng `qc-measure` cùng phép đo với mốc T8 4,19 và mục tiêu T9 4,6–4,8 âm tiết/s có tiếng. Khoảng `atempo` tham khảo của giọng T8 là 1,13–1,18 cho `[dẫn]` và 1,07–1,12 cho `[kỹ thuật]`. Với Hải Đăng, lấy mẫu khoảng 0,90–0,95 theo `docs/voice.md` rồi chỉnh theo số đo và bản nghe. Trần 1,20. Thông số bảo toàn biên câu theo R23 do Sản xuất xử lý.

Không nhạc nền. Hiệu ứng tự tạo nhỏ ở S00 âm báo, S01/S07 chạm khay, S20 tấm vào cữ, S25 chạm chốt và S27 thu thẻ. Các khoảng nghỉ nằm theo bảng cảnh, gồm phần đã có trong TTS để mỗi nhịp chỉ tính một lần. Sau khi đo TTS, bám giọng thật để dời mốc hình và cảnh, giữ nhịp quan sát có chuyển động ở S11, S12, S16. Giọng khoảng −14 LUFS, đỉnh ≤−1,5 dBTP. Độ tự nhiên, nhấn từ, phát âm thật và nhịp câu **CHƯA KIỂM — giám đốc nghe**.

## Ngân sách thời lượng

Bảng dùng cùng số liệu theo cảnh với `ep01/script.md`. Tốc độ 4,68 âm tiết/s có tiếng cho cả hai nhãn. Ước lượng cộng một âm tiết đệm mỗi lần dùng thuật ngữ tiếng Anh. Y7 gồm ngắt trong lời, nghỉ giữa lời và giữ sau lời, mỗi mốc tính một lần. S00 gồm 2,40 s hình động riêng. Từng cảnh có lời lấy max(giây đọc + Y7, mức tối thiểu 3/5/8 s theo độ phức tạp + giữ sau lời). S01 là ngoại lệ hook. S27 giữ hình 0,52 s rồi thêm đuôi 0,15 s, tổng 0,67 s sau lời cuối. Cộng tổng từ số chưa làm tròn và đo lại sau TTS.

| Tập/đoạn | Nhãn | Âm tiết ước tính | Tốc độ mới (âm tiết/s) | Giây đọc | Nghỉ Y7 (s) | Đuôi (s) | Tổng (s) |
|---|---|---:|---:|---:|---:|---:|---:|
| IT-T9-E01 · S00 | Opening · chưa có lời | 0 | — | 0,00 | 0,00 | 0,00 | 2,40 |
| S01 | [dẫn] | 6 | 4,68 | 1,28 | 0,97 | 0,00 | 2,25 |
| S02 | [dẫn] | 13 | 4,68 | 2,78 | 1,52 | 0,00 | 4,30 |
| S03 | [dẫn] | 16 | 4,68 | 3,42 | 2,08 | 0,00 | 5,50 |
| S04 | [dẫn] | 15 | 4,68 | 3,21 | 1,09 | 0,00 | 4,30 |
| S05 | [kỹ thuật] | 14 | 4,68 | 2,99 | 0,96 | 0,00 | 3,95 |
| S06 | [kỹ thuật] | 15 | 4,68 | 3,21 | 0,77 | 0,00 | 3,98 |
| S07 | [kỹ thuật] | 14 | 4,68 | 2,99 | 1,06 | 0,00 | 4,05 |
| S08 | [dẫn] | 16 | 4,68 | 3,42 | 1,43 | 0,00 | 4,85 |
| S09 | [dẫn] | 18 | 4,68 | 3,85 | 2,15 | 0,00 | 6,00 |
| S10 | [kỹ thuật] | 28 | 4,68 | 5,98 | 2,02 | 0,00 | 8,00 |
| S11 | [kỹ thuật] | 44 | 4,68 | 9,40 | 6,60 | 0,00 | 16,00 |
| S12 | [kỹ thuật] | 39 | 4,68 | 8,33 | 3,07 | 0,00 | 11,40 |
| S13 | [kỹ thuật] | 32 | 4,68 | 6,84 | 1,56 | 0,00 | 8,40 |
| S14 | [kỹ thuật] | 30 | 4,68 | 6,41 | 1,94 | 0,00 | 8,35 |
| S15 | [kỹ thuật] | 21 | 4,68 | 4,49 | 1,71 | 0,00 | 6,20 |
| S16 | [kỹ thuật] | 46 | 4,68 | 9,83 | 6,17 | 0,00 | 16,00 |
| S17 | [dẫn] | 22 | 4,68 | 4,70 | 1,55 | 0,00 | 6,25 |
| S18 | [kỹ thuật] | 24 | 4,68 | 5,13 | 1,52 | 0,00 | 6,65 |
| S19 | [kỹ thuật] | 36 | 4,68 | 7,69 | 2,11 | 0,00 | 9,80 |
| S20 | [dẫn] | 14 | 4,68 | 2,99 | 1,21 | 0,00 | 4,20 |
| S21 | [kỹ thuật] | 19 | 4,68 | 4,06 | 1,94 | 0,00 | 6,00 |
| S22 | [kỹ thuật] | 17 | 4,68 | 3,63 | 1,52 | 0,00 | 5,15 |
| S23 | [kỹ thuật] | 17 | 4,68 | 3,63 | 2,37 | 0,00 | 6,00 |
| S24 | [kỹ thuật] | 17 | 4,68 | 3,63 | 2,37 | 0,00 | 6,00 |
| S25 | [dẫn] | 11 | 4,68 | 2,35 | 1,40 | 0,00 | 3,75 |
| S26 | [dẫn] | 19 | 4,68 | 4,06 | 1,94 | 0,00 | 6,00 |
| S27 | [dẫn] | 12 | 4,68 | 2,56 | 1,24 | 0,15 | 3,95 |
| **Tổng IT-T9-E01** | — | **575** | 4,68 | **122,86** | **54,27** | **0,15** | **179,68** |

## Nguyên liệu cần

| Nguyên liệu | Nguồn được phép và cách dùng |
|---|---|
| Cáo | `brand/cao/poses/`, các dáng `think`, `surprised`, `bow`, `idea`, `thumbs_up` theo `docs/mascot.md`. Ghép PNG tĩnh có alpha. |
| Bàn, silhouette, thẻ file, khay, ngăn lưu, mô tả, đường biên, cổng, icon ba bước | Nền màu, gradient và đồ hoạ hình học tự dựng thuộc năng lực trong `docs/asset-sources.md`. Dùng nền theo ngữ cảnh `tools/backgrounds/` và thành phần có sẵn trong `tools/motion/`. Gắn mô tả giả bằng dải và khối che trơn. |
| Cửa sổ, terminal, chữ, số, sơ đồ, chuyển cảnh, phụ đề | Text engine, component khung/flow/comparison/counter/header/caption trong `docs/motion-components.md`, phông Windows và FFmpeg từ `docs/asset-sources.md`. |
| Giọng và hiệu ứng | VieNeu chạy cục bộ theo `docs/voice.md`, âm chạm ngắn tự tạo bằng công cụ dựng âm thanh hiện có. |
| Bìa | Khung cuối S01 của bản hình chưa đốt phụ đề. |

### Cần giám đốc cung cấp

Chưa có nguyên liệu thiếu cho phương án hình khối và giọng hiện tại. Cần giám đốc nghe bản TTS và các clip thuật ngữ để chốt phát âm, nhịp và độ tự nhiên trước render cuối.

## Tiêu chí nghiệm thu

- **Đầu ra.** Bản chung 9:16, 1080×1920, MP4 H.264 yuv420p + AAC, 30 fps mục tiêu trong dải 24–60, faststart, ≤250 MB. D1 150–190 s, mục tiêu vòng 2 là 175–185 s gồm opening, dự kiến 179,68 s. Bản đăng Shorts ≤180 s. Kiểm ngân sách sau TTS và đo lại bản ghép bằng ffprobe.
- **Thành phẩm.** `IT-T9-E01_9x16.mp4`, `thumbnail.jpg`, `captions.srt`, `publish.json` trong `final/`. Metadata có tiêu đề, mô tả, 3–5 hashtag mỗi nền tảng. `ai_generated_content: true`, `ai_disclosure` đúng câu cuối mô tả của cả ba. Ghi “(ví dụ dựng)” trong mô tả và bật công tắc AI nền tảng khi đăng. Kiểm với `qc-video` và `qc-publish`.
- **Opening, hook và trả lời.** S00 riêng 2,40 s, chưa có lời. Trong 2 s đầu thấy tình huống gõ phép cộng và khay bên kia đường biên. Lời hook vào ngay ở 2,40 s, số 5 hiện 2,62 s. File chạm khay khoảng 4,60 s và log mở 4,87 s, cả hai trước giây 5. Kiểm nhịp mở–gửi–nhận ở S05–S07, cùng hàng khoanh ở 55,24 s (S11) và 169,94 s (S26), số 0 cạnh plugin cộng khi mô tả đã vào trợ lý ở S12, file qua cổng mở ở S13, hai bản có hàng lệch ở S16, bản cập nhật hợp lệ chờ duyệt ở S19 và khay rỗng khi chặn gửi ở S25.
- **Nhịp và đồng bộ.** 28 cảnh kể cả opening, trung bình ≈6,42 s/cảnh. Chỉ S00/S01 dưới 3 s. Ba cảnh High là S11 (16,00 s), S12 (11,40 s), S16 (16,00 s), mỗi cảnh khai 1 khái niệm mới và giữ sơ đồ sau lời lần lượt 2,60/2,40/2,50 s. Rà số khái niệm thật sự mới với lời và hình, tối đa 2 trong 10 s. Hiện vật theo lời trong 0–0,50 s, đuôi im ≤0,70 s. Dùng cột Mốc voice khai `assets/scenes.json` và cập nhật theo TTS. Với khoảng ≥1,50 s, kiểm thay đổi hình có ý nghĩa. Ghi mốc và lý do nếu tĩnh hơn 2 s.
- **Header và nhãn.** Header hai dòng có đủ ở S01–S27, đạt cỡ và khoảng cách trong bảng, có 0 lần che vật, nhãn, Cáo hoặc phụ đề. Nhãn gắn đối tượng ở lần gọi tên, tối đa 3 nhóm ngoài phụ đề và ≤8 từ minh hoạ cùng lúc. So chữ từ 4 từ trở lên với lời, độ giống <0,6. ≥80% cảnh có chữ minh hoạ, ≥80% nhãn hiện đúng mốc (±0,50 s), 20–45 từ minh hoạ/phút, kinetic mỗi 25 s, cách nhau ≥6 s, tối đa một lần/cảnh và có cảnh xen giữa. Kiểm S16 ở 360×640, nhất là 103,94–110,28 s khi «Bản lưu» và «Bản đang nạp» cùng hiện. Hai nhãn bám mép tấm, chừa dấu duyệt và đường căn.
- **Nền, phụ đề và Cáo.** Mỗi chủ đề nền ≤40% thời lượng và ≤4 cảnh liền. Đo vùng an toàn y≈250–1500 px, phụ đề 52–60 px trên dải riêng y≈1340–1500 px và ≤2 dòng × 28 ký tự. Thử bìa ở 180×320. Đo Cáo rộng 146–160 px, xuất hiện ở mở, giữa, kết, dự kiến 23,46 s (13,1%), ngưỡng vòng 2 ≲15%. Ở S09 kiểm Cáo chừa mép tấm dài.
- **Bằng chứng QC.** Lưu bản `assets/_scratch/picture.mp4` để kiểm hình ở 360×640, tắt tiếng và chưa đốt phụ đề. Người xem cần nhận ra chuyển file, hai phiên bản và cổng chặn. Dùng `assets/render-log.json` cho `qc-measure` hồ sơ explainer, kiểm `opening`, `header`, `text_audit.render`, đồng bộ, giữ hình và `voice_edges` (R23 do Sản xuất xử lý). So với `docs/baseline/T8-qc-auto.json`. Viết kết quả kèm mốc và số đo. Mục cần xem/nghe thực tế ghi **CHƯA KIỂM** tới khi kiểm thủ công. R là ngưỡng thử, đánh giá lại sau 3 video.

## Rủi ro và dự phòng

| Rủi ro | Dự phòng |
|---|---|
| TTS thực tế đẩy bản chung qua 180 s | Đo theo câu và rà khoảng lặng bị tính hai lần. Nếu vẫn dài, rút câu nối L10 ở S04 sau khi đo, giữ lời hứa L09, rồi cập nhật mốc chữ, kinetic, voice và ngân sách. Giữ hook, câu đã chốt, thứ tự ba bước và nhịp giữ sơ đồ 2–3 s. Giới hạn tốc độ theo Y6. |
| Người xem hiểu bộ đếm 0 là mọi hoạt động hệ thống bằng 0 | Gắn đồng hồ vào đúng plugin cộng ở lát cắt khi nạp, giữ nút gọi chưa bấm. Tách hoàn toàn đồng hồ khỏi log mở–gửi–nhận. |
| Dấu duyệt cũ gây hiểu nhầm là cả công cụ đã an toàn | Đặt dấu kiểm trên phiếu của tấm lưu. Nhấc tấm hiện tại lên trong S16 để thấy dấu ở lại. Dùng cùng dấu cộng nhưng hai mép tấm khác nhau. |
| Hình phức tạp hoặc đọc không ra ở điện thoại | Ưu tiên phóng cụm khay–file–viền hoặc hai lớp mô tả theo chiều dọc, tăng tương phản bằng hình học. Giữ thứ tự vật hiện theo lời. Cho Đạo diễn hình ảnh chọn thành phần tương đương trong `tools/motion/` khi cần sau khi so R9. |
| Rò chữ giả thành câu có thể đọc | Dùng khối che đặc và các thanh hình học, không có lớp chỉ dẫn bên dưới. Terminal trơn, không tên hãng hay vụ việc thật. |
| Người xem tưởng quét hoặc quyền tối thiểu tự sửa mô tả | Ở S21–S23, cảnh báo dừng bản tại chỗ để duyệt. Ở S25–S26, giữ cùng hàng che ở hai lượt, chỉ đổi trạng thái của quyền gửi để thấy giới hạn tác động. |

Thời lượng Shorts đối chiếu trực tiếp theo giới hạn của YouTube. [YouTube Help — Understand three-minute YouTube Shorts](https://support.google.com/youtube/answer/15424877).
