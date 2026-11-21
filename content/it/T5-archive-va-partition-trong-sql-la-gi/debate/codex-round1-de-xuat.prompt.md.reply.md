### Vòng 1 — Đề xuất độc lập

**Đối tượng** là người mới học SQL hoặc làm báo cáo. **Thông điệp** là partition chia dữ liệu trong cùng một bảng theo quy tắc. Archive là cách quản lý dữ liệu ít dùng để vẫn có thể tra lại.

**1. Báo cáo còn quay**

- **Hook ≤2s:** “Vẫn đang tải à?” Cáo nhìn vòng tải trên báo cáo tháng.
- **Nhịp:** **0–3s** báo cáo chưa ra. **3–15s** trước giây 5, thấy truy vấn đang đọc cả những tháng ngoài kỳ cần báo cáo. Các khối dữ liệu tách theo tháng, vẫn nằm trong cùng bảng. **16–42s** minh họa truy vấn theo tháng có thể bỏ qua phân vùng không liên quan, rồi chuyển dữ liệu hết kỳ sử dụng sang kho lưu. **Giây 38** quay lại đúng tháng cần báo cáo. Mời chọn thao tác vừa giúp khoanh dữ liệu.
- **Giữ chân:** Thấy ngay truy vấn đang đọc thừa ở đâu.
- **Cách làm:** Nền office → database, Remotion tô sáng các khối dữ liệu được đọc.
- **Rủi ro:** Dễ ngầm hứa tăng tốc. Chỉ minh họa phần có thể bỏ qua, không hiện đồng hồ so tốc độ.

**2. Đơn cũ đâu rồi?**

- **Hook ≤2s:** “Đơn cũ đâu rồi?” Cáo mở bảng đơn và thấy ô trống.
- **Nhịp:** **0–3s** Cáo tìm một đơn cũ. **3–15s** trước giây 5, rõ là cần đối chiếu đơn nhưng bảng đang dùng không còn giữ nó. Hình mở hai đường tra cứu. **16–43s** theo một đơn hiện hành vào phân vùng tháng trong bảng chính, rồi theo đơn cũ đến bảng lưu riêng. **Giây 39** tìm lại đúng đơn trong bảng lưu. Mời chọn nơi tra.
- **Giữ chân:** Người xem có một đơn cụ thể để tìm và thấy đường tra ngay từ đầu.
- **Cách làm:** Nền office → database, Remotion dùng cùng một biểu tượng để theo dấu đơn.
- **Rủi ro:** Dễ hiểu rằng archive luôn phải dùng bảng riêng. Nêu đây là cách làm trong ví dụ.

**3. Chia xong, vẫn đầy?**

- **Hook ≤2s:** “Chia xong, vẫn đầy?” Cáo nhìn báo dung lượng sau khi bảng được chia.
- **Nhịp:** **0–3s** các khối đơn hàng đã chia nhóm. **3–15s** trước giây 5, thấy kho sắp hết chỗ mà đơn cũ vẫn phải giữ. Các khối chỉ đổi nhóm, không biến mất. **16–42s** minh họa chuyển đơn đủ điều kiện sang kho lưu khác và kiểm tra tra lại. **Giây 38** bảng chính bớt dữ liệu, đơn cũ vẫn tra được. Mời chọn thao tác vừa diễn ra.
- **Giữ chân:** Hình trả lời sớm vì sao chia bảng không giải quyết dung lượng.
- **Cách làm:** Nền incident → database, Remotion vẽ khối và vạch dung lượng.
- **Rủi ro:** Vạch dễ bị hiểu là tổng dung lượng. Chỉ gắn vạch với kho chính.

**Dựng chung:** 9:16, 1080×1920. Cáo tĩnh, cắt dáng ở mở, một nhịp giữa và kết, rộng khoảng 20% khi cùng minh họa. TTS Bắc chậm hơn khoảng 5–10%, giảm thêm ở đoạn kỹ thuật, chuẩn hóa phát âm và giữ nhịp nghỉ Y7. Không nhạc, hiệu ứng nhẹ. Giữ nhãn AI và nhãn “ví dụ dựng”. Chữ kỹ thuật chỉ lấy từ cột “Chữ trên màn hình”. Khi duyệt, đối chiếu tài liệu chính thức của hệ quản trị được chọn.