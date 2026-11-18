# IT-T3-E01 — Storyboard vòng 1

**DRAFT — chờ Claude review và duyệt cuối.** Nguồn lời và thời lượng: `script.md` đã duyệt script-r2. Tám cảnh, 39 giây, 1080×1920, 30 fps, 1170 frame. Không sửa kịch bản. Chi tiết lớp, toạ độ, lịch chữ và động tác nằm trong `storyboard.json`; mốc `t` trong JSON tính từ đầu từng cảnh.

| Cảnh | Mốc / số frame | Hình chính và thay đổi thực sự | Cáo nhỏ | Máy / nối sang cảnh sau |
|---|---|---|---|---|
| 1 | 0–3 s / 90 | `process_animation`: frame đầu đủ hook + SQL + bảng T1–T12; hai nhánh chia/chuyển hướng ra phải, chưa ô nào rời bảng. | `think` | wide, static / match_cut giữ bảng |
| 2 | 3–9 s / 180 | `process_animation`: bỏ nhánh, các đường chia dày lên trong một khung vẫn đủ 12 thẻ; nghĩa Partition trước, khung Một bảng logic và Vẫn đủ + 12/12 phần sau. | `present_hand` | medium, static / cut sang điều kiện lọc |
| 3 | 9–14 s / 150 | `data_visualization`: Chia theo tháng trước Tháng 11; chỉ T11 sáng/viền dày, 11 ô mờ còn mã; zoom nhẹ bảng để nhấn phạm vi chọn. | `point_up` | medium, push_in / cut mở rộng phạm vi |
| 4 | 14–18 s / 120 | `data_visualization`: thay yêu cầu thành trạng thái, cả 12 ô sáng đồng thời ngay đầu cảnh, không ô mờ, không quét nhanh/chậm. | `shrug` | wide, static / wiperight mở riêng lớp hộp mới |
| 5 | 18–24 s / 180 | `process_animation`: trả độ sáng bình thường; hộp lưu trữ ngoài khung mở ra; cùng các thẻ T1–T3 lần lượt trượt 0,8 s/thẻ sang hộp, T4–T12 đứng yên. | `point_right` | medium, push_in tối đa 1,02× / match_cut giữ kết quả |
| 6 | 24–28 s / 120 | `data_visualization`: pull-out, cả hai khung và thẻ hạ 40 px; hai bộ đếm hiện đồng thời, viền hai nơi sáng cùng nhịp để chứng minh dữ liệu còn đủ, một chip khái niệm nối tiếp. | Giữ `point_right`, không đổi tại 24 | wide, pull_out / cut sang quan hệ quản lý |
| 7 | 28–32 s / 120 | `process_animation`: kết quả 9/3 và bộ đếm giữ nguyên, thêm nét hướng quản lý trong khe hai khung; chip nghĩa rồi phủ định lệnh chuẩn, không terminal giả. | `clipboard` | medium, static / cut có dấu replay ở cảnh 8 |
| 8 | 32–39 s / 210 | `process_animation`: biểu tượng replay → CUT cả sơ đồ về đủ 12/hộp rỗng, không thẻ bay ngược → nhấn chia tháng → T1–T3 trượt sang lưu → giữ 9/3 trả lời hook. | `thumbs_up` | wide, static / cut kết thúc ở 39 s |

Hình minh hoạ là chính sơ đồ dữ liệu có trạng thái, viền và thẻ chuyển vị trí. **Talking-head: 0/39 s = 0%; `character_acting`: 0 s.** Cáo hiện **39/39 s = 100%**, cao tối đa 300 px, không vượt ảnh nguồn, toàn thân và đuôi nằm x=90–360, y=1190–1490. Bảy ảnh nguồn đã kiểm tồn tại; sáu lần cắt đổi dáng tại 3/9/14/18/28/32. Không đổi tại 24, không vẫy tự động, không nhép miệng. Camera tác động lớp sơ đồ phẳng; HUD, nhãn và Cáo ghép sau, chữ không bị thu/phóng. Chuỗi cỡ cảnh wide/medium/medium/wide/medium/wide/medium/wide, tối đa hai cảnh liên tiếp cùng cỡ.

Mỗi cảnh có thay đổi hình so với cảnh trước: nhánh lựa chọn → lưới chia → một ô sáng → cả bảng sáng → ba thẻ chuyển nơi → hai nhóm được đếm và sơ đồ hạ xuống → nét quan hệ quản lý → diễn lại chuỗi kết hợp. Giữ một sơ đồ xuyên suốt có chủ đích; không có cảnh thứ ba liên tiếp trùng bố cục, không chỉ đổi chữ. Tự chấm cả tám cảnh: có minh hoạ thật, không lặp nguyên bố cục trước, tắt tiếng hiểu được ý chính khi đọc các nhãn đã duyệt. Đây là đánh giá thiết kế, chưa phải QC khung render.

G8 đã cụ thể hoá trong bản đầu: từ 32,0 s hiện biểu tượng vòng cung mũi tên không chữ; 32,2 s cắt toàn trạng thái sang 12 ô/hộp rỗng, biểu tượng giữ đến 33 s. Không vẽ đường thẻ đi ngược, không crossfade hai bản dữ liệu, không thêm nhãn “chạy lại” ngoài danh sách chữ cho phép. 33–35 s nhấn chia tháng; 35–36,8 s chuyển đúng T1–T3; 37–39 s giữ kết quả chính chín/lưu ba, không thực hiện thêm một lần chuyển trên trạng thái cũ.

G10 đã cụ thể hoá: hàng nhãn y=520–584 và hàng bộ đếm y=588–652 đều cao 64 px; ở cảnh 6 cả bảng và hộp dịch xuống đúng **40 px**, từ y=620–920 thành y=660–960. Giữ cỡ nhãn 48 px, không cắt dấu; hàng đếm nằm trên các thẻ, sơ đồ cách vùng phụ đề y=1000–1140 ít nhất 40 px. Cảnh 7–8 giữ hình học này. Hai bộ đếm là hai nhãn “Chính 9” và “Lưu trữ 3” cạnh nhau qua dấu “·”. Cảnh 6 chỉ có hai bộ đếm + một chip khái niệm, “Vẫn giữ lại” rồi “Tuỳ hệ thống”, không chồng.

Các lưu ý còn lại của review script-r2 đã áp dụng: cảnh 2 có hai hàng chip, giữ font; hook có SQL riêng và hai dòng 64 px; cảnh 7 giữ cả hai bộ đếm; cảnh 5 phân biệt “Lưu trữ” trong dải chip y=320–480 với nhãn hộp trong hàng header. Từ cảnh 2–4, tên Đơn hàng, Một bảng logic và Minh hoạ ở các khoảng x riêng trong hàng header. Mọi nhãn độc lập tối đa bốn từ, chỉ dùng chữ được kịch bản cho phép. Mỗi thẻ là một phần dữ liệu minh hoạ, không phải bản ghi; không dùng số ô để suy ra hiệu năng.

Producer dựng các thẻ/khung bằng Pillow hoặc SVG, chuyển thẻ bằng lớp alpha `overlay` có `eval=frame`; pose là cut ảnh nguồn, camera là crop/zoom phẳng. Với `zoompan` dùng một ảnh đầu vào/cảnh và `d` đúng số frame trong bảng; không dùng vòng ảnh rồi nhân thêm `d`. Chuyển lớp nằm trong chính thời lượng cảnh, không overlap toàn hai clip làm hụt 39 giây. `wiperight` chỉ mở hộp, `match_cut` giữ vị trí đối tượng, `cut` đổi điều kiện hoặc báo chạy lại. Không sửa engine hay tự thay sơ đồ bằng component thẻ chữ nếu renderer mặc định chưa thể hiện đủ; đường dựng thay thế khả thi là các lớp sơ đồ tự vẽ và ffmpeg theo các toạ độ trong JSON. Các công thức camera động trong recipes cần xem khung thử khi sản xuất.

Phụ đề dùng chữ chuẩn nguyên lời, 52 px, tối đa hai dòng trong vùng riêng; ASS PlayRes 1080×1920 giúp đặt đúng pixel, không chép vị trí phụ đề của mẫu Cáo lớn. “SQL”, “Minh hoạ”, “Có dùng AI” hiện suốt; nhãn AI x=730–980,y=1460–1500, không nội dung quan trọng dưới y=1500. Chỉ giọng Minh Đức và khoảng nghỉ, không nhạc, không SFX. Lời, mốc dự phòng TTS và phát âm vẫn do script-r2 quyết định; bản storyboard dùng mốc mặc định vì chưa có giọng được nghe/đo, không tự rút hook hoặc dời mốc 9.

## Đề nghị sửa kịch bản

Không có. Cả 8/8 cảnh có minh hoạ cụ thể; không cần thay lời để đáp ứng yêu cầu hình ảnh. Chỉ Claude có quyền chuyển `status` sang `APPROVED` sau review.
