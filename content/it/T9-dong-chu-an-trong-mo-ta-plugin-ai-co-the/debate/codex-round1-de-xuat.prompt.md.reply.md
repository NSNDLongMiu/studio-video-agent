## Vòng 1 — Đề xuất độc lập

**Trọng tâm** · Dân văn phòng và lập trình viên mới dùng MCP cần hiểu vì sao một plugin trả kết quả đúng vẫn có thể làm lộ dữ liệu. Nếu AI hiểu nhầm chỉ dẫn trong *tool description* là việc cần làm, quyền đọc và gửi đã cấp có thể biến nhầm lẫn đó thành sự cố.

**Dàn dựng chung** · 9:16, 1080×1920, 180 giây. Tiêu đề động 1 giây trên cảnh nhân vật đang thao tác, rồi vào hook ngay. Header `SECURITY / PLUGIN AI`. Khoảng 36 cảnh, mỗi cảnh một ý, tối đa hai khái niệm mới mỗi 10 giây. Sơ đồ hiện theo lời, giữ đủ 2–3 giây. VieNeu đổi nhịp theo thao tác, không nhạc, hiệu ứng tự tạo tối giản. Cáo tĩnh, không nhép, cắt đổi dáng ở mở/giữa/kết, rộng 10–18%, xuất hiện tối đa khoảng 25% thời lượng. Nói rõ “ví dụ dựng” trong lời dẫn, khai báo AI ở mô tả đăng.

### 1. Một phép cộng, hai màn hình

**Hook (1–2s)** · “Tổng đúng. File đã gửi.”  
**Nhịp** · 0–3s, nhân viên bấm cộng → tổng hiện → file được đánh dấu gửi. Trước 5s, thấy file nội bộ đã ra ngoài. 3–15s, màn hình tách đôi, đối chiếu thẻ plugin với mô tả AI nhận. Giữa tập, dựng lần lượt mô tả bị hiểu thành chỉ dẫn → quyền cho phép → file di chuyển. Kết, giây 170 phát lại với quyền tối thiểu, tổng vẫn hiện và file đứng yên. Mời chọn quyền cần giữ.  
**Giữ chân / làm / rủi ro** · Hai góc nhìn giải thích ngay vì sao nhìn kết quả là chưa đủ. Dùng UiSimulationScene và PromptReviewScene. Màn hình dọc dễ chật, chỉ tô sáng một chi tiết mỗi nhịp.

### 2. Lần ngược dấu gửi

**Hook (1–2s)** · “Ai vừa gửi file?”  
**Nhịp** · 0–3s, nhân viên thấy nhật ký đổi trạng thái đọc → gửi → ra ngoài. 3–15s, lần theo thời điểm gửi về lượt gọi plugin cộng. Giữa tập, ráp mô tả AI nhận, cách AI diễn giải và quyền đã cấp. Giây 169 trả lời câu mở, chỉ ra chỗ cần duyệt kỹ và quét mô tả trước khi dùng. Mời chọn dấu vết đáng xem đầu tiên.  
**Giữ chân / làm / rủi ro** · Có manh mối ngay. Dùng UiSimulationScene và DataVizScene. Nhật ký dễ dày chữ, chỉ giữ ba sự kiện.

### 3. Cùng phép cộng, đổi quyền

**Hook (1–2s)** · “Phép cộng cần đọc file?”  
**Nhịp** · 0–3s, nhân viên bấm cộng → tổng hiện → file rời khung. 3–15s, khoanh hai quyền thừa. Giữa tập, dựng cơ chế rồi phát lại cùng mô tả, bỏ quyền đọc/gửi. Giây 171, tổng vẫn đúng, file đứng yên. Mời chọn quyền cần bỏ.  
**Giữ chân / làm / rủi ro** · Kết quả đối chiếu hữu hình. Dùng ExplainerScene và UiSimulationScene. Tránh hiểu quyền tối thiểu thay được bước duyệt và quét mô tả.