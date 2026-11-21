**Vòng 1 — Ba concept độc lập**

Dành cho dân văn phòng Việt Nam dùng chatbot hằng ngày. Quyền truy cập trang có thể cho tiện ích thấy nội dung chat công việc. Cả ba mở bằng tiêu đề động 2 giây và cảnh Cáo gặp sự cố, dùng giao diện giả lập. Lời kể nói rõ “ví dụ dựng”, mô tả đăng khai báo AI.

### 1. Gỡ rồi, bản sao còn đâu?

- **Hook ≤2s** Cáo bấm Gỡ, phiếu khách hàng vẫn hiện ở máy chủ ngoài. “Gỡ rồi, sao vẫn còn?”
- **Nhịp** 0–3s mở ở hậu quả. 3–15s tua về lúc Cáo cài trợ lý miễn phí và dán phiếu vào chat. Trước giây 5, thấy phiếu đã ra ngoài trình duyệt. Phần giữa dựng từng bước quyền đọc trang → nội dung bị sao chép → gửi theo đợt, liên hệ báo cáo ghi nhận khoảng 30 phút mỗi đợt. Giây 158 chốt việc gỡ dừng các lần gửi sau, bản đã gửi có thể còn.
- **Giữ chân** Cú bấm Gỡ đặt ngay câu hỏi người xem có thể gặp. **Dựng** UiSimulationScene + DataVizScene, giữ phiếu xuyên suốt. **Rủi ro** Cảnh máy chủ dễ gợi dữ liệu còn mãi, lời kể nêu thời gian lưu chưa rõ.

### 2. Một quyền, ba phạm vi

- **Hook ≤2s** Cáo dán báo giá. “Sao tiện ích thấy cả báo giá?”
- **Nhịp** 0–3s thấy khung chat. 3–15s lộ quyền “trên mọi trang”, bản sao báo giá đi ra ngoài trước giây 5. Phần giữa diễn lại cùng một thao tác qua ba cài đặt: khi nhấp, trang cụ thể, mọi trang. Giây 155 chỉ chỗ kiểm quyền và chốt cách giới hạn quyền theo nhu cầu.
- **Giữ chân** Người xem đoán lựa chọn nào cho tiện ích thấy tab chat rồi xem kết quả. **Dựng** UiSimulationScene + ExplainerScene. **Rủi ro** Dễ hiểu nhầm “khi nhấp” luôn an toàn, minh họa lúc Cáo nhấp ngay trên tab chat.

### 3. Qua mặt Cáo bằng huy hiệu

- **Hook ≤2s** Cáo cài trợ lý có huy hiệu. “Bản nháp vừa đi đâu?”
- **Nhịp** 0–3s cắt từ nút Cài sang bản nháp. 3–15s lần lại quyết định cài, trước giây 5 thấy bản sao đến máy chủ ngoài. Phần giữa đặt cạnh huy hiệu, nhà phát hành và quyền truy cập. Báo cáo ghi nhận một tiện ích có huy hiệu Featured. Giây 160 chốt hai mục cần kiểm trước khi cài: nhà phát hành và danh sách quyền.
- **Giữ chân** Người xem tự xét lại lựa chọn cài khi thấy quyền hiện ra. **Dựng** PromptReviewScene + DataVizScene. **Rủi ro** Dễ quy chụp huy hiệu, giới hạn kết luận vào quyền của tiện ích.

**Kết chung** Kiểm nhà phát hành và quyền, gỡ tiện ích bỏ dùng, tránh dán mật khẩu, khóa truy cập hay dữ liệu khách hàng. “Bạn sẽ kiểm quyền nào trước?”

**Dựng chung** 180s, 9:16, 1080×1920, header “SECURITY / TRÌNH DUYỆT”. VieNeu nhanh hơn T8 10–15%, hiệu ứng nhẹ, không nhạc. Cáo tĩnh 10–18%, cắt dáng khi chuyển ý. Mỗi cảnh một ý, tối đa hai khái niệm mỗi 10s, giữ sơ đồ hoàn chỉnh 2–3s.