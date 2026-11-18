# IT-T4-E01 — Báo cáo đang đợi, hóa đơn phải còn

Bản sửa · vòng 2 · 18/11/2026 · team_id: 4 · Chờ Claude review, chưa duyệt sản xuất. **Chưa tạo TTS, chưa dựng, chưa kiểm âm thanh.** Mục tiêu **32,9 s** (khoảng 32–34 s), trần riêng tập **40,0 s**; chuẩn 15–45 s, 1080 × 1920, 9:16, 30 fps. Renderer **pillow-ffmpeg**, giữ nguyên lý do trong `../plan.md`.

## Quy ước Producer phải giữ

- Bảng cảnh là nguồn chữ/lời chính xác; tổng **12 cảnh / 13 lượt lời**. Cột chữ liệt kê toàn bộ chữ đồ họa; thêm nhãn **“AI tạo”** cố định. Chỉ phụ đề chép lời. Nhãn HOOK/ÍCH LỢI/CÂU HỎI trong bảng là ghi chú, không đọc/không lên hình.
- Mọi nhân vật, tin nhắn, sáu tháng và **HĐ 4721** đều là ví dụ dựng. Hook có **“Tình huống dựng”**; ô tìm có **“HĐ 4721 · ví dụ”**. Không giả người/sự kiện/hóa đơn thật.
- **“MỘT BẢNG” hiện đúng 2,0–18,0 s**, kể cả khi câu hỏi bắt đầu lúc 17,7 s. Lưới 2 × 3 cao 600 px, T1–T6 gắn đúng ô; đó là tháng ví dụ, không phải sáu bảng. HĐ 4721 thuộc T1, giữ mã khi tìm lại. **Trả ở 23,4 s**: trước đó không lộ nhãn Kho lưu hoặc mã hóa đơn trong kho.
- Bố cục theo plan: hook phiến y = 250–830, cao 580 px; phụ đề y = 840–980; Cáo cao 480 px tại y = 1000–1480. Từ 2,0–18,0 s: khung y = 250–930, lưới y = 330–930 cao 600 px; phụ đề y = 950–1090; Cáo cao 380 px, y = 1120–1500. Từ 18,0 s: vật chính y = 250–850 cao 600 px; phụ đề y = 860–1000; Cáo cao 450 px tại y = 1030–1480, **hiện suốt**. Khoảng cách lớp ≥ 10 px, Cáo cách đáy ≥ 420 px. Chuyển bố cục lúc 2,0 s và 18,0 s; đổi dáng đầu tiên lúc 2,2 s.
- Chữ trong x = 90–990; từ khóa ≥ 72 px, nhãn/mã ≥ 56 px; tối đa **3 nhóm chữ**, không tính phụ đề/AI. Một chip “tháng” rồi thay bằng “khách”; mã T gắn vào lưới là một nhóm sơ đồ. Chip/ô tìm/tin sếp dùng chung nhóm thứ ba; xóa nhóm cũ trước khi thêm mới.
- Mỗi `main_change` dưới đây phải thấy ở 360 × 640: vật đi quãng lớn, đường nối đổi đích hoặc hàng dữ liệu ra/vào. Đổi chip/pose/zoom nhỏ không thay thế yêu cầu này. Không thiết kế tĩnh > 2 s; không thiết kế lặng ≥ 0,8 s. Mốc sẽ được duyệt lại sau đo TTS thật.

## Bảng từng cảnh — tổng 32,9 s

| Thời gian | Hình ảnh/đồ họa | Chữ trên màn hình — đúng từng chữ | Lời đọc/phụ đề — đúng từng chữ | Cáo (tên dáng) | Âm thanh |
|---|---|---|---|---|---|
| **00,0–02,2 s · HOOK** | Sếp silhouette trong tin nhắn, Cáo cạnh laptop; phiến đơn hàng lớn, tiến trình chậm, không số %/tia quét toàn bảng. `main_change`: 0–0,6 s tin trượt vào; 0,6–1,4 s laptop mở/phiến bung; 1,4–1,6 s phiến mở rộng; giữ khung ổn định 1,6–1,9 s để lấy bìa; 1,9–2,2 s phiến nới để chia. Từ 2,0 s chuyển bố cục, hiện viền một bảng sau khi xóa nhãn hook. **3 nhóm**, không chồng nhãn lúc chuyển. | “Vào họp rồi!”<br>“Tình huống dựng”<br>“Đơn hàng”<br>Từ 2,0 s thay bằng “MỘT BẢNG”. | **Lời 1 · 0–2,10 s:** Sếp đợi báo cáo, bảng đơn hàng vẫn chạy! | `surprised`, cao 480 px đến 2,0 s, thu về 380 px theo bố cục; giữ dáng đến 2,2 s, nhìn laptop/phiến. Không câu chào/nhép miệng. | Minh Đức; báo tin tự tạo ≤ 0,15 s lúc 0 s, nhỏ hơn giọng ≥ 12 dB. Không nhạc. |
| **02,2–05,0 s · ÍCH LỢI ĐẦU TIÊN TRƯỚC GIÂY 5** | `main_change`: 2,2–3,1 s phiến tách 6 khối trong cùng khung; 3,1–4,1 s đường điều kiện vào T6, năm khối xám; 4,1–5,0 s hàng từ T6 ra khay không chữ. T6 xanh lá; khối cũ nguyên vẹn. **3 nhóm**. | “MỘT BẢNG”<br>“T1”, “T2”, “T3”, “T4”, “T5”, “T6” gắn lưới<br>“tháng” | **Lời 2 · 2,2–4,86 s:** Chia bảng theo tháng, máy có thể bỏ qua phần không cần. | `point_up` từ 2,2 s, cao 380 px; chỉ T6, **đích ở phía trên bên phải Cáo**. | Giọng. Phải dứt ≤ 4,9 s; bản rút gọn và điều kiện kích hoạt ở mục Lời và phát âm. |
| **05,0–07,6 s · Điều kiện** | `main_change`: 5–6,2 s đường từ chip tháng kéo xuống T6; 6,2–7,6 s khay nhận hàng từ T6, các nhánh tới năm khối xám khép bằng cửa chặn hình học. Không đổi kích thước/dữ liệu cũ. **3 nhóm**. | “MỘT BẢNG”<br>“T1”, “T2”, “T3”, “T4”, “T5”, “T6”<br>“tháng” | **Lời 3 · 5,0–7,35 s:** Lọc đúng cột đã chia thì mới bỏ qua được. | `point_right` từ 5,0 s; chip tại x = 590–950 và T6 cột phải, **đích ở bên phải Cáo**. | Giọng; “bỏ qua” là pruning trong ví dụ, không hứa tăng tốc. |
| **07,6–10,0 s · Đối lập khách** | `main_change`: 7,6–8,7 s đường phân nhánh tới sáu khối vàng; 8,7–9,4 s báo cáo không chữ từ khay tháng trước đó trượt về tin sếp; 9,4–10 s tin nhận đóng/khay rút. Vàng là chưa loại được tháng chỉ từ điều kiện khách, không vẽ quét mọi dòng. **Tối đa 3 nhóm**. | “MỘT BẢNG”<br>“T1”, “T2”, “T3”, “T4”, “T5”, “T6”<br>7,6–9,3 s: “khách”<br>9,3–10,0 s thay chip bằng “Nhận rồi!” | **Lời 4 · 7,6–9,50 s:** Chỉ lọc khách, chưa loại được tháng nào. | Giữ `point_right`; **đích nhánh ở bên phải Cáo**, nhìn theo nhánh sang cả sáu ô rồi báo cáo về sếp. Không đổi dáng lúc 7,6 s. | Giọng; không tiếng báo nhận. “Nhận rồi!” là tình tiết dựng, không benchmark. |
| **10,0–13,0 s · Gọi tên Partition, khối cũ nguyên vẹn** | Xóa tin/chip, viền lưới trắng. `main_change`: 10–11,3 s bó thẻ không chữ trong T1 trượt ra khoảng 130 px, lộ đủ hàng; 11,3–12,5 s trả bó thẻ nguyên vẹn; 12,5–13 s đường đo chạy dọc hai cạnh T1. Khối không nhỏ đi; thẻ trượt dưới nhãn T1/T2, không che mã khác. **2 nhóm**. | “MỘT BẢNG”<br>“T1”, “T2”, “T3”, “T4”, “T5”, “T6” | **Lời 5 · 10,0–12,80 s:** Partition không tự xoá, không tự nén dữ liệu cũ. | `read_paper` từ 10,0 s, đối chiếu bó thẻ ra/vào. | Giọng; không âm xóa/nén. Partition phát âm CHƯA KIỂM. |
| **13,0–17,7 s · Kế toán cần hóa đơn, tìm trống** | Kế toán silhouette cạnh ô tìm, không thêm chữ/thoại. `main_change`: 13–14,1 s chính T1 mang hàng nguyên vẹn trượt vào hành lang che ngoài khung, ô T1 mờ; 14,1–15,2 s ô tìm mở, nhập mã liền; 15,2–16,4 s kính lúp qua khay đang dùng, khay rỗng viền đỏ; 16,4–17,7 s khay mở rộng, kính lúp về ô T1. Đích chuyển chưa thấy, không tên lệnh. **3 nhóm**. | “MỘT BẢNG”<br>“T1”, “T2”, “T3”, “T4”, “T5”, “T6”; T1 mờ tại ô đã chuyển<br>Ô tìm: “HĐ 4721 · ví dụ” | **Lời 6 · 13,0–14,65 s:** Tháng đầu ít dùng, mình cất đi.<br>**Lời 7 · 14,8–17,60 s:** Kế toán cần hóa đơn cũ, mình tìm ở bảng đang dùng. | `laptop_typing` từ 13,0 s; `think` từ đúng 16,0 s nhìn khay trống, giữ tới 18,0 s. | Giọng; click tự tạo ≤ 0,1 s lúc 15,7 s. Không nhạc. |
| **17,7–19,3 s · CÂU HỎI MỞ 17,7 s → TRẢ 23,4 s** | `main_change`: 17,7–18 s kính lúp quay về ô T1 mờ; khung “MỘT BẢNG” giữ tới đúng 18,0 s. Sau đó xóa khung/lưới/ô tìm trước khi thêm nhãn chuyển nơi lưu; 18–19,3 s thẻ chỉ dẫn tách từ phía kẹp giấy Cáo đi lên, lật mặt có mũi tên lớn, kéo đầu vệt đường chuyển ra khỏi hành lang. **Trước 18 s: 3 nhóm; sau: 2 nhóm**. Không lộ kho/mã trong kho. | Đến 18,0 s: “MỘT BẢNG”; các mã “T1”, “T2”, “T3”, “T4”, “T5”, “T6”; “HĐ 4721 · ví dụ”.<br>Sau 18,0 s thay toàn bộ bằng “Chuyển nơi lưu” và thẻ “Ví dụ”. | **Lời 8 · 17,7–19,15 s:** Hóa đơn tháng đầu đi đâu? | `think` đến 18,0 s; **`clipboard` từ 18,0 s**, cao 450 px, hiện liên tục; kẹp giấy gắn với thẻ đang được đặt/lật. Đúng 2,0 s từ lần đổi trước. | Giọng hỏi; không âm gây cảm giác mất dữ liệu. Đổi bố cục tại ranh giới cue gần 18 s, không cắt âm/chữ của câu hỏi. |
| **19,3–21,6 s · Đặt thẻ cho phần đã chuyển** | `main_change`: 19,3–20,4 s thẻ đi tới bên trái Cáo (x = 130–450), đầu đường gắn vào mũi tên; 20,4–21,6 s kính lúp theo đường từ thẻ tới cửa khuất. Thẻ là chỉ dẫn ví dụ do mình thiết kế, không tính năng tự sinh. Chưa mở cửa/hiện Kho lưu. **2 nhóm**. | “Chuyển nơi lưu”<br>“Ví dụ” | **Lời 9 · 19,3–21,45 s:** Mình để thẻ chỉ dẫn cho phần đã chuyển. | Giữ `clipboard`, Cáo nhìn theo thẻ mình vừa đặt/lật và đường được gắn vào thẻ; không ẩn. | Giọng; không hiệu ứng. Không giữ lặng chờ đáp. |
| **21,6–23,4 s · Lần đường tra** | `main_change`: 21,6–22,5 s kính lúp theo đường trên thẻ đến cửa; 22,5–23,4 s cửa trượt hé, chỉ thấy cạnh khối. Không lộ mã hóa đơn/nhãn kho trước 23,4 s. **2 nhóm**. | “Chuyển nơi lưu”<br>“Ví dụ” | **Lời 10 · 21,6–23,25 s:** Cất rồi, phải có đường tra lại. | `point_left` từ 21,6 s; **thẻ/đầu đường tra ở bên trái Cáo**, x = 130–450. Cáo vẫn hiện suốt 18–23 s. | Giọng; hình tra đang tiến tới đích, không kéo dài để trì hoãn. |
| **23,4–25,25 s · TRẢ CÂU HỎI ĐÚNG 23,4 s** | Đúng 23,4 s xóa nhãn chuyển, lộ T1 trong kho và **HĐ 4721**, thẻ chỉ dẫn nối tới T1. `main_change`: 23,4–24,2 s hóa đơn rút khỏi T1; 24,2–25,25 s hóa đơn tiến về Cáo, cao 560 px tại y = 250–810, trong vùng vật chính y = 250–850. Mã không đổi; kho/T1/hóa đơn xanh dương. **3 nhóm**: nhãn kho; cụm T1/hóa đơn; thẻ. | “Kho lưu”<br>“T1”, “HĐ 4721” gắn vào vật<br>“Ví dụ” | **Lời 11 · 23,4–25,10 s:** Ở kho lưu! Hóa đơn vẫn còn. | `point_left` đến 23,8 s, **đích ở bên trái Cáo**; `read_paper` từ 23,8 s để đón hóa đơn, cách lần trước 2,2 s. | Giọng nhấn tìm thấy; chạm giấy tự tạo ≤ 0,15 s tại 23,4 s. |
| **25,25–29,95 s · Gọi tên archive, giới hạn theo hệ** | `main_change` tuần tự, một tiêu điểm mỗi nhịp: 25,25–26,4 s ngăn mở rộng lộ dạng thẻ; 26,4–27,55 s hình khối tệp không chữ xuất hiện cạnh ngăn như cách lưu khác; 27,55–28,7 s hai hình trở về cùng cụm kho; 28,7–29,95 s **hóa đơn duy nhất về đúng khe ngăn** trước cảnh chốt, thẻ chỉ dẫn ở ngoài. Không chép đôi hóa đơn, không logo/cú pháp SQL. **3 nhóm** như cảnh trước. | “Kho lưu”<br>“T1”, “HĐ 4721” gắn trong cụm vật<br>“Ví dụ” | **Lời 12 · 25,25–29,80 s:** Cất như vậy gọi là archive. Nó không phải lệnh SQL chuẩn, mỗi hệ mỗi cách. | Giữ `read_paper` đến 26,1 s; `shrug` từ 26,1 s nhìn hai cách lưu, không nhún vai liên tục. | Giọng; đọc archive/SQL theo bảng phát âm, phụ đề giữ chữ chuẩn. Mức kiểm nguồn ở cuối file. |
| **29,95–32,9 s · CÂU CHỐT HIỂN THỊ + KÊU GỌI TỰ NHIÊN** | Xóa nhãn kho/mã/ví dụ rồi hiện hai thẻ kết đọc đủ chữ ngay từ đầu cảnh. `main_change` **tuần tự**: 29,95–30,55 s thẻ đầu trượt khoảng 120 px về biểu tượng lưới, giữ toàn thẻ trong vùng x = 90–990; 30,55–31,15 s thẻ hai trượt khoảng 120 px về ngăn lưu, giữ toàn thẻ trong vùng x = 90–990; 31,15–32,2 s chỉ cửa ngăn khép qua nửa hành trình; 32,2–32,9 s cửa khép hết, thẻ chỉ dẫn nằm ngoài. Không chuyển hóa đơn nữa, không hoạt ảnh chữ/pose/nhún Cáo. Hai thẻ giữ đủ chữ xuyên cảnh; **2 nhóm**, không thêm CTA đồ họa. Lời dứt 32,55 s, đuôi im dự kiến 0,35 s. | **“Partition: chia bảng”**<br>**“Archive: cất dữ liệu cũ”** — chia dòng “Archive: cất” / “dữ liệu cũ”, không đổi chữ. | **Lời 13 · CTA bắt đầu 29,95 s, dứt dự kiến 32,55 s:** Bảng bạn chia theo cột nào? Chưa chia thì gõ 'chưa'. | `thumbs_up` từ 29,95 s, cao 450 px, cạnh hai vật ghép đúng; giữ tới hết. Cách dáng trước 3,85 s. | CTA nhẹ, không đọc lại hai thẻ. Không nhạc/âm kết dài. Đuôi im ≤ 0,7 s. |

## Lời và phát âm

Xưng **mình**, gọi **bạn** theo `docs/mascot.md` (xưng mình hoặc Cáo). Bản lời ở bảng cảnh là bản thu chính; giữ cách xưng và câu hỏi bỏ “nhỉ” đã được review chấp nhận. Lời 5 gọi tên **Partition**, thêm “tự” để tránh hiểu rằng hệ quản trị không có tính năng xóa/nén riêng. Lời 7 nêu lý do kế toán cần hóa đơn. Lời 12 gọi tên **archive** gắn với hành động vừa xem, tách hai ý. Trong lời/phụ đề viết thường `archive`; hai thẻ chốt giữ nguyên viết hoa đầu nhãn.

| Chữ chuẩn trong phụ đề | Cách đưa vào bản TTS | Lưu ý nghe lại |
|---|---|---|
| Partition | “pa-ti-sần” | **CHƯA KIỂM**; giả định 3 âm tiết để ước lượng. Nghe thử và duyệt, không đổi phụ đề sang phiên âm. |
| archive | “a-kai-v” | **CHƯA KIỂM**; giả định 2 âm tiết, v là âm cuối. Không tách v thành âm tiết mới; nếu giọng làm khác phải đo lại. |
| SQL | “ét kiu eo” | **CHƯA KIỂM**; 3 âm tiết; không để giọng đọc thành một từ lạ. |
| T1–T6, HĐ 4721 | Không đọc trong bản lời này | Nhãn vật, lời dùng “tháng đầu”, “hóa đơn”. |

Minh Đức, giọng Bắc, VieNeu-TTS v3 Turbo cục bộ; temperature 0,65; hậu kỳ chuẩn **atempo 1,08 một lần**, không tăng thêm. Giọng/phát âm/thời lượng **CHƯA KIỂM**.

### Bảng ước lượng TTS — không phải đo

Đếm âm tiết tiếng Việt theo tiếng cách trắng; Partition = 3, archive = 2, SQL = 3 theo giả định phát âm trên. Tốc độ là **tốc độ hiệu dụng giả định sau atempo chuẩn**, không phải lệnh tăng tốc riêng cho từng câu. Mặc định 4,6 âm tiết/s; riêng lời ích lợi giả định 4,8 âm tiết/s nên có phương án rút gọn. Giây ước tính = âm tiết / tốc độ + nghỉ nội câu, làm tròn 0,01 s. Khoảng trống giữa các lượt lời tính riêng, không cộng lại nghỉ nội câu lần nữa.

| Lời | Âm tiết ước tính | Tốc độ giả định (âm tiết/s) | Nghỉ nội câu (s) | Giây ước tính | Bắt đầu–kết thúc dự kiến (s) |
|---|---|---|---|---|---|
| 1 | 9 | 4,6 | 0,14 | 2,10 | 0–2,10 |
| 2 | 12 | 4,8 | 0,16 | 2,66 | 2,2–4,86 |
| 3 | 10 | 4,6 | 0,18 | 2,35 | 5,0–7,35 |
| 4 | 8 | 4,6 | 0,16 | 1,90 | 7,6–9,50 |
| 5 | 12 | 4,6 | 0,19 | 2,80 | 10,0–12,80 |
| 6 | 7 | 4,6 | 0,13 | 1,65 | 13,0–14,65 |
| 7 | 12 | 4,6 | 0,19 | 2,80 | 14,8–17,60 |
| 8 | 6 | 4,6 | 0,15 | 1,45 | 17,7–19,15 |
| 9 | 9 | 4,6 | 0,19 | 2,15 | 19,3–21,45 |
| 10 | 7 | 4,6 | 0,13 | 1,65 | 21,6–23,25 |
| 11 | 7 | 4,6 | 0,18 | 1,70 | 23,4–25,10 |
| 12 | 19 | 4,6 | 0,42 | 4,55 | 25,25–29,80 |
| 13 | 11 | 4,6 | 0,21 | 2,60 | 29,95–32,55 |

Tổng **129 âm tiết**, khoảng **30,36 s lời đã gồm nghỉ nội câu**, khoảng **2,19 s nghỉ giữa các lượt** (dài nhất 0,50 s), cộng **0,35 s đuôi = 32,90 s**. Khoảng 13–18 s không còn chứa cả câu hỏi: lời 7 kéo tới 17,6 s; hỏi 17,7–19,15 s; lời 9 và 10 lấp khoảng trước đáp bằng hướng dẫn đặt thẻ/đường tra, không thêm lời đệm. Không giữ im để trì hoãn đáp án.

**Dự phòng lời 2 (Claude đã duyệt trước ở review vòng 2, `../review/script-r2.md`):** “Chia theo tháng, máy bỏ qua được phần không cần.” (10 âm tiết). Kích hoạt nếu ở cấu hình giọng chuẩn, bản đầy đủ bắt đầu 2,2 s mà đo được kết thúc sau 4,9 s. Ước lượng bản ngắn ở 4,6 âm tiết/s + nghỉ 0,16 s = 2,33 s, kết thúc khoảng 4,53 s. Nếu tính đồng đều 4,6 âm tiết/s cho cả bản đầy đủ thì lời 2 kết thúc khoảng 4,97 s (giả định 4,8 ở bảng trên là thiên lạc quan), nên cần đo kỹ và sẵn sàng dùng bản ngắn. Giữ hình chọn T6 và lời 3 để nêu điều kiện; bản thu/phụ đề chỉ dùng một phiên bản. Nếu vẫn không xong ≤ 4,9 s, trả Kịch bản/Claude duyệt lại, không tăng tốc thêm.

**Mốc sẽ được duyệt lại sau đo TTS thật** bởi Kịch bản/Đạo diễn hình ảnh: Producer đo từng lời và khoảng lặng, đồng bộ hình/pose/cue theo giọng; giữ khung một bảng 2–18 s, ích lợi < 5 s và các lần đổi pose ≥ 2 s. Không giữ cứng mốc 32,9 s gây im, không cắt chữ đã chốt để ép thời lượng. Chuẩn tổng 15–45 s, trần riêng tập 40 s. Lặng ≥ 0,8 s chỉ giữ khi có mục đích với hình đang đổi đáng xem và ghi giây/lý do ở `notes.md` để duyệt; đuôi im ≤ 0,7 s. Bản viết này không đề nghị ngoại lệ R8.

## Metadata để Producer tạo publish.json

Chung: `ai_generated_content: true`; `ai_disclosure: "Video có dùng hình ảnh và giọng đọc do AI tạo."` Hashtag là trường riêng; không nối hashtag sau câu khai báo trong mô tả. Bật công cụ khai báo AI khi đăng theo quy trình xưởng. Lượt này chưa tạo publish.json hoặc đăng bài.

### TikTok

- **Tiêu đề/nhãn nội bộ:** Sếp đợi báo cáo, hóa đơn cũ ở đâu?
- **Mô tả:** Sếp đợi báo cáo, kế toán lại cần hóa đơn cũ. Cùng Cáo phân biệt partition và archive qua một tình huống dựng: chia bảng theo tháng có thể giúp bỏ qua phần không cần khi điều kiện lọc phù hợp; cất dữ liệu vẫn cần đường tra lại. Bảng bạn chia theo cột nào? Chưa chia thì gõ 'chưa'. Video có dùng hình ảnh và giọng đọc do AI tạo.
- **Hashtag:** #CaoVanPhong #SQL #Partition #Archive

### Facebook Reels

- **Tiêu đề:** Báo cáo đang đợi, hóa đơn phải còn
- **Mô tả:** Partition ở đây là chia bảng (table partitioning); archive là việc cất dữ liệu cũ hoặc ít dùng. Kho lưu trong video là một cách minh họa, không phải lệnh SQL hay hướng dẫn thao tác cho mọi hệ. Các nhân vật và mã HĐ 4721 đều là ví dụ dựng. Bạn đang chia bảng theo cột nào? Video có dùng hình ảnh và giọng đọc do AI tạo.
- **Hashtag:** #CaoVanPhong #SQL #CoSoDuLieu #Archive

### YouTube Shorts

- **Tiêu đề:** Archive và Partition trong SQL là gì? | Cáo văn phòng
- **Mô tả:** Sếp đợi báo cáo, còn hóa đơn cũ phải tìm lại được. Ví dụ dựng với sáu khối tháng giúp phân biệt partition và archive; partition ở đây là chia bảng (table partitioning). Chia bảng không tự xóa hay nén dữ liệu; khả năng bỏ qua phần không cần phụ thuộc điều kiện lọc. Kho lưu và thẻ chỉ dẫn là cách minh họa, không phải tính năng tự có. Nguồn: PostgreSQL — Table Partitioning (https://www.postgresql.org/docs/current/ddl-partitioning.html); MySQL 8.4 — Partitioning Overview (https://dev.mysql.com/doc/refman/8.4/en/partitioning-overview.html). Bảng bạn chia theo cột nào? Chưa chia thì gõ 'chưa'. Video có dùng hình ảnh và giọng đọc do AI tạo.
- **Hashtag:** #CaoVanPhong #SQL #Partition #Archive #Shorts

## Nguồn và giới hạn kiểm chứng

Bản sửa cập nhật theo kết quả Claude ghi trong `review/script-r1.md`; đồng thời đọc văn bản trang chính thức PostgreSQL và MySQL bằng công cụ web (mở trang/tìm đoạn), không chụp hay đối chiếu bằng trình duyệt đồ họa. Hai trang Oracle dưới đây đã được **Claude mở và đọc trực tiếp ở review vòng 2 (18/11/2026)**, chỉ để kiểm tên và phạm vi tính năng, không đọc cả tài liệu. Không đối chiếu văn bản ISO/IEC 9075 (trả phí). Nguồn dùng kiểm nội dung, không lấy ảnh/đoạn văn dài làm tài sản.

| Cảnh/phát biểu | Nguồn chính thức và phạm vi hỗ trợ |
|---|---|
| 2,2–5 s: một bảng chia phần, có thể bỏ phần không cần | [PostgreSQL — Table Partitioning, §§ 5.12.1, 5.12.4](https://www.postgresql.org/docs/current/ddl-partitioning.html): bảng logic chia phần vật lý; pruning loại phần không thể khớp điều kiện. Không hứa hiệu năng. |
| 5–10 s: lời 3, chip tháng/khách | [PostgreSQL — Partition Pruning, § 5.12.4](https://www.postgresql.org/docs/current/ddl-partitioning.html#DDL-PARTITION-PRUNING): “pruning is driven only by the constraints defined implicitly by the partition keys”. [MySQL 8.4 — Partitioning Overview](https://dev.mysql.com/doc/refman/8.4/en/partitioning-overview.html), [Partition Pruning](https://dev.mysql.com/doc/refman/8.4/en/partitioning-pruning.html). **Suy luận minh họa có điều kiện:** mã khách không suy ra tháng, không kèm lọc tháng nên chưa loại tháng. Lời 3 là điều kiện cần trong ví dụ; không khẳng định quét mọi dòng/bỏ index. |
| 10–13 s: lời 5 “không tự xoá, không tự nén” | [PostgreSQL — Table Partitioning, §§ 5.12.1–5.12.2](https://www.postgresql.org/docs/current/ddl-partitioning.html). **Không có câu nào trong các trang đã kiểm nói partition không nén/không xoá; đây là diễn giải từ định nghĩa**, không phải trích dẫn. Thao tác chia tự nó không đồng nghĩa xóa/nén; hệ có thể có tính năng riêng. |
| 13–25,25 s: chuyển dữ liệu ít dùng, tra lại đúng hóa đơn | [PostgreSQL — Table Partitioning, § 5.12.1](https://www.postgresql.org/docs/current/ddl-partitioning.html) nêu chuyển dữ liệu ít dùng sang phương tiện lưu khác. Kho/thẻ/tìm lại là **quy trình đề xuất trong ví dụ dựng**, không tính năng tự sinh; archive không bắt buộc chuyển ổ vật lý khác. |
| 25,25–29,95 s: lời 12, “mỗi hệ mỗi cách” | **Có nguồn theo review.** [MySQL 8.4 — The ARCHIVE Storage Engine](https://dev.mysql.com/doc/refman/8.4/en/archive-storage-engine.html) đã đọc trang chính thức: engine riêng, nén zlib, hỗ trợ INSERT/REPLACE/SELECT, không DELETE/UPDATE, không hỗ trợ partitioning. Oracle có [CREATE FLASHBACK ARCHIVE](https://docs.oracle.com/database/122/SQLRF/CREATE-FLASHBACK-ARCHIVE.htm) và [In-Database Archiving / ROW ARCHIVAL](https://docs.oracle.com/en/database/oracle/oracle-database/18/vldbg/control-validity-visibility-data.html): **Claude đã mở và đọc trang chính thức ở review vòng 2**: FLASHBACK ARCHIVE là câu lệnh riêng của Oracle (theo dõi và lưu thay đổi giao dịch); ROW ARCHIVAL đánh dấu hàng không hoạt động bằng cột ẩn `ORA_ARCHIVE_STATE`. Không đưa tên engine/tính năng Oracle vào hình/lời/metadata. |
| 25,25–29,95 s: “không phải lệnh SQL chuẩn” | **Đã đóng điểm kiểm nguồn theo quyết định chấp nhận của Claude trong review, với giới hạn:** chưa đối chiếu văn bản ISO/IEC 9075 (trả phí); kết luận thực hành dựa trên tài liệu các hệ chính, không phải xác minh chuẩn ISO. Giữ lời theo phán quyết; không coi việc manual không nhắc lệnh là bằng chứng đầy đủ cho toàn bộ chuẩn. |

Không còn dấu kiểm nguồn mở theo review. Giới hạn còn lại được ghi rõ: **ISO chưa đối chiếu trực tiếp**; PostgreSQL, MySQL và Oracle đã được Claude đối chiếu trang chính thức (vòng 1–2). TTS/phát âm/thời lượng vẫn CHƯA KIỂM. Sếp/kế toán, tin nhắn, sáu tháng, HĐ 4721 và đường tra đều là ví dụ tự dựng; không có số đo hiệu năng/sự kiện thật. Hai thẻ kết tóm tắt khái niệm, không hướng dẫn một cú pháp dùng chung.
