**Vòng 1 — Đề xuất độc lập**

Dành cho dân văn phòng dùng chatbot. Quyền “đọc và thay đổi dữ liệu trên mọi trang” có thể cho tiện ích đọc cả nội dung chat.

### 1. Bản sao rời khung chat

- **Hook ≤2s:** Cáo vừa dán hồ sơ khách hàng thì một bản sao bật khỏi ô chat. “Ai vừa lấy bản sao?”
- **Nhịp:** 0–3s dán và tách bản sao, trước 5s bản sao tới máy chủ lạ. 3–15s hiện quyền phủ lên các tab, rồi theo dấu gói tin từ chat qua tiện ích ra ngoài. **Giây 29:** Cáo gỡ tiện ích, đường gửi ngắt, bản đã gửi vẫn ở đích.
- **Giữ chân:** Người xem thấy ngay dữ liệu nào đã thoát ra và theo được đường đi.
- **Dựng:** Pillow + ffmpeg, cắt từ văn phòng sang hộp quyền rồi máy chủ. **Rủi ro:** Dễ tưởng chat bị xóa. Giữ nguyên nội dung gốc trong ô chat.

### 2. Một cú bấm, quyền mở khắp tab

- **Hook ≤2s:** Cáo bấm cài trợ lý miễn phí. Khung quyền trùm sang tab chat. “Chat cũng bị đọc?”
- **Nhịp:** 0–3s quyền mở rộng, trước 5s mẩu hồ sơ Cáo vừa dán chạy tới đích lạ. 3–15s trở lại cửa hàng và hộp cấp quyền, làm nổi “mọi trang”, rồi cho thấy tiện ích sao chép từ tab chat. **Giây 28:** Chỉ đúng dòng quyền đã mở lối, rồi gỡ tiện ích để ngắt đường gửi.
- **Giữ chân:** Người xem nhận ra thao tác mình từng làm và biết cần nhìn dòng nào.
- **Dựng:** Pillow + ffmpeg cho cửa hàng giả, hộp quyền và luồng dữ liệu. **Rủi ro:** Dễ hiểu quyền rộng đồng nghĩa với đánh cắp. Tách rõ cảnh cấp quyền và hành vi gửi của tiện ích này.

### 3. Lần ngược từ máy chủ lạ

- **Hook ≤2s:** Cắt từ Cáo đang dán hồ sơ sang bản sao đáp xuống máy chủ lạ. “Nó đi đường nào?”
- **Nhịp:** 0–3s đối chiếu cùng mẩu hồ sơ ở hai nơi, trước 5s thấy bản sao đã tới đích. 3–15s lần ngược qua tiện ích về hộp quyền, rồi phát xuôi luồng chat → tiện ích → máy chủ. **Giây 30:** Gỡ tiện ích, đường gửi đứt ngay tại mắt xích vừa tìm ra.
- **Giữ chân:** Mỗi điểm dừng giải được một chặng.
- **Dựng:** Pillow + ffmpeg, dùng một dấu nhận diện xuyên qua ba bối cảnh. **Rủi ro:** Tua ngược dễ làm rối thứ tự. Giữ nguyên hướng mũi tên khi lần dấu.

**Chung:** 40s, 9 cảnh, 9:16 1080×1920. Phụ đề ≥64 px, Cáo tĩnh ở mở/giữa/kết, giọng Bắc, không nhạc. Khai báo AI và ví dụ dựng ở mô tả, bật công tắc AI. Kết nhắc kiểm nhà phát hành và quyền, gỡ tiện ích bỏ dùng, tránh dán mật khẩu, khóa hoặc dữ liệu khách hàng. “Bạn sẽ kiểm quyền của tiện ích nào trước?”