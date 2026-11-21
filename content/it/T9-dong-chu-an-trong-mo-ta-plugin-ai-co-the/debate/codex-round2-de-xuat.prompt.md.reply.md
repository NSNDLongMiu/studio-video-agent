## Phản biện vòng 2

- **Cả ba concept — nhận.** Dùng chung hình chia đôi khiến chúng giống nhau. Giữ điều tra ngược làm mạch kể, dành cảnh chia đôi để chỉ đúng chỗ dòng chữ bị che. Bổ sung lúc AI nạp mô tả và lần mô tả đổi sau duyệt.
- **Concept 1 — nhận.** Phát lại hai lớp: quét mô tả để phát hiện dòng ẩn, rồi minh họa quyền tối thiểu giới hạn thiệt hại nếu dòng đó lọt qua.
- **Concept 2 — nhận.** Ba thẻ nhật ký lớn kể hậu quả. Bản mô tả đầy đủ mới cho thấy chỉ dẫn nằm ở đâu.
- **Concept 3 — nhận.** Quyền tối thiểu chỉ xuất hiện ở lớp phòng thủ cuối. Câu kết quay lại dòng ẩn.
- **Nhịp và thứ tự — nhận.** Chọn 27 cảnh, dành hai cảnh 16 giây cho đối chiếu mô tả và thay đổi sau duyệt. Duyệt/quét → ghim phiên bản và so lại mỗi phiên → giới hạn quyền.

## Bản lai — Một phép cộng, một file ra ngoài

**0–3s · Opening.** Tiêu đề “Dòng ẩn trong mô tả plugin AI”, header `SECURITY / PLUGIN AI`. Trong hai giây đầu, thấy người dùng nhìn kết quả cộng cạnh biểu tượng file đang rời vùng nội bộ. Gắn nhãn “Ví dụ dựng” và nhãn AI.

**3–17s · Hook (~8%).** “Tổng đúng. File đã gửi.” Trước giây 5, file hiện ở ô “Bên ngoài”. **Câu hỏi mở:** Dòng nào khiến AI gửi file? Chỉ vị trí ở giây 60, chốt ở giây 171.

**17–44s · Bối cảnh (~15%).** Người dùng plugin chỉ nhờ cộng hai số. Ba thẻ nhật ký cho thấy ba lần đổi trạng thái: file nội bộ → được mở → đã gửi → bên ngoài nhận.

**44–89s · Cơ chế (~25%).** Cảnh chia đôi 16 giây đối chiếu thẻ bị cắt với mô tả đầy đủ. Một vạch đánh dấu đoạn nằm dưới mép hiển thị, ô chú thích nêu Unicode vô hình. Sơ đồ sáng ở bước “AI nạp mô tả” khi bộ đếm lượt gọi plugin vẫn bằng 0.

**89–143s · Phân tích và ví dụ (~30%).** Tách yêu cầu cộng khỏi chỉ dẫn ẩn và lần theo hai nhánh bằng hình. Cảnh 16 giây chồng bản đã duyệt lên bản hiện tại, tô phần đổi. Sai lầm: tin dấu duyệt cũ.

**143–169s · Giải pháp (~14%).** Phát lại với quét báo khác biệt và bản ghim để đối chiếu mỗi phiên. Minh họa riêng lớp quyền tối thiểu: đường đọc và gửi bị khóa.

**169–180s · Kết (~6%).** Khoanh dòng ẩn ngay trong mô tả. Mời người xem gõ mục họ sẽ kiểm tra trước.

**Dựng và rủi ro.** 9:16, 1080×1920. Cáo tĩnh ở mở/giữa/kết, rộng 10–18% khung, tổng ≤25%, đổi dáng bằng cắt. Giọng và hiệu ứng nhẹ. Giữ sơ đồ hoàn chỉnh 2–3 giây. Dùng khối che thay câu lệnh và nói rõ AI *có thể* làm theo.