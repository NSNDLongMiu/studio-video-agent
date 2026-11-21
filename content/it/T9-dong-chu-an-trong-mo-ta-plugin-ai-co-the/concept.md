# Concept · IT-T9-E01 · Một phép cộng, một file ra ngoài

Theo Phán quyết cuối trong `debate.md`. Nhân viên nhờ trợ lý cộng hai số. Kết quả trên màn hình là 5. Kế bên, nhật ký cho thấy file của phòng đã tới khay ngoài. Cáo lần ngược từ log về mô tả của plugin cộng, rồi đặt bản đang nạp lên bản đã duyệt để thấy đúng hàng đã thay đổi. Khi phát lại với quyền gửi bị chặn, file dừng ở biên còn hàng ấy vẫn nằm trên tấm mô tả.

Phép cộng và file khiến hai kết quả cùng lúc dễ phân biệt bằng hình. Kết quả đúng xác nhận việc tính. Ba bản ghi mở, gửi, nhận xác nhận chuyện xảy ra với file. Mạch điều tra giúp người xem nhớ chỗ cần kiểm trước khi tin một plugin.

**Khán giả.** Dân văn phòng và lập trình viên mới dùng plugin AI. **Giọng điệu.** Cáo xưng “mình”, gọi “bạn”, dùng câu ngắn theo mỗi thao tác. Hải Đăng kể tự nhiên, có nhịp hỏi và nhịp quan sát. **Lời hứa của series.** Mỗi tập đi từ việc quen ở văn phòng tới cơ chế kỹ thuật rồi chỉ ra một thao tác người xem tự kiểm được.

| Nhịp đã chốt | Triển khai |
|---|---|
| Opening · S00, 0,00–2,40 s | “Dòng ẩn trong mô tả plugin AI” và “SECURITY / PLUGIN AI” hiện từ 0,12 s. Máy quay tiến từ bàn công sở tới cửa sổ tính cạnh đường biên. Opening chưa có lời. |
| Hook · S01, 2,40–4,65 s | “Tổng đúng. File đã gửi.” Ô `2 + 3` mở khi lời vào, số `5` bật ở 2,62 s, thẻ file vượt đường biên và chạm khay ngoài khoảng 4,60 s. |
| Ích lợi đầu tiên · S02, trước 5 s | “Mở nhật ký.” Log mở cạnh kết quả khoảng 4,87 s. Người xem có chỗ kiểm một hành động ngoài việc mình giao. L05 xác nhận đây là ví dụ dựng. |
| Câu hỏi mở · S03, 8,95–11,99 s | “Máy chỉ được nhờ cộng. Vậy ai ra lệnh gửi file?” |
| Lời hứa cụ thể · S04, 14,45 s | “Mình có ba bước kiểm, dễ nhớ.” Ba khe kiểm mở theo lượt. |
| Trả phần đầu · S11, 55,24 s | Hàng che đỏ hiện dưới đường gióng của mép xem trước, trên bản đầy đủ bên cạnh. Ở S12, tấm mô tả tới trợ lý khi bộ đếm lượt gọi riêng của plugin cộng còn 0. |
| Trả đủ · S26, 169,94 s | Về đúng cửa sổ hook, khoanh lại hàng ấy và nối tới thẻ gửi. Đối chứng cho thấy file dừng ở vạch khi quyền gửi bị chặn. Chốt lúc 172,58 s bằng câu “Quyền chỉ giảm thiệt hại, không sửa mô tả.” |
| Kêu gọi cuối · S27, từ 175,73 s | “Bạn kiểm mô tả hay quyền trước?” rồi “Lưu lại kẻo quên nha!” Hai đối tượng xuất hiện theo câu hỏi, ba biểu tượng giữ đúng thứ tự kiểm. |

Thông điệp chính là kết quả đúng chưa chứng minh plugin sạch. AI có thể làm theo chỉ dẫn trong mô tả, nhất là khi có quyền phù hợp. Thứ tự kiểm là duyệt và quét mô tả đầy đủ → ghim bản đã duyệt và so mô tả sắp nạp mỗi phiên → cấp quyền tối thiểu.

## Bộ câu thoại Cáo

| Nhịp | Dáng | Thoại nguyên văn đã chốt |
|---|---|---|
| Hook | `think` | “Tổng đúng. File đã gửi.” và “Máy chỉ được nhờ cộng. Vậy ai ra lệnh gửi file?” |
| Sang cơ chế | `surprised` | “Khoan! Phần bạn thấy chưa phải phần AI đọc.” |
| Nhận ra sai lầm | `bow` | “Ối, ai cũng từng gặp. Cáo xin lỗi trước nhé!” |
| Sang giải pháp | `idea` | “Mẹo nhỏ cho dân văn phòng nè!” |
| Chốt và kêu gọi | `thumbs_up` | “Quyền chỉ giảm thiệt hại, không sửa mô tả.” “Bạn kiểm mô tả hay quyền trước?” “Lưu lại kẻo quên nha!” |
