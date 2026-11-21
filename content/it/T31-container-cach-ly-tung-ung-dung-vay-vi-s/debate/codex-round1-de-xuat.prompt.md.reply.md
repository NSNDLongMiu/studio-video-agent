## Vòng 1 — Đề xuất độc lập

**Trọng tâm:** Vì sao lỗi ở nhân Linux có thể ảnh hưởng cả máy chủ dù ứng dụng chạy trong container? **Đối tượng:** dev, SA, DevOps, sysadmin. **Thông điệp:** Container nhẹ và nhanh nhờ dùng chung nhân Linux. Chính nhân đó dựng ranh giới cách ly, nên lỗi ở nhân có thể làm suy yếu ranh giới của nhiều ứng dụng cùng lúc.

**Quy cách chung:** Khoảng 60 giây, 9:16, 1080×1920, có nhãn AI. Opening ba pha: Cáo gặp sự cố → thấy hệ quả trước giây 5 → nêu câu hỏi. Cáo PNG tĩnh ở mở, giữa và kết, chiếm 10–18% chiều rộng khi cùng minh họa. TTS Việt miễn phí, hiệu ứng tự tổng hợp nhẹ dưới lời.

### 1. Vết nứt dưới ba hộp

- **Hook ≤2s:** Cáo chỉ hộp web đỏ. “Web lỗi, chỉ hộp này chịu?”
- **Nhịp:** 0–3s hộp web đỏ, nền chung nứt. 3–15s vết nứt lan tới hộp API và tác vụ nền trong ví dụ dựng. Sau đó đối chiếu container chung nhân với máy ảo có nhân riêng. **Giây 48 trả lời:** “Nhân dựng vách. Lỗi ở nhân có thể làm vách mất tác dụng.” Chốt vá cả nginx lẫn nhân máy chủ.
- **Giữ chân:** Thấy ngay vì sao giả định “chỉ mất một hộp” đáng kiểm tra. **Tín hiệu:** Google gợi ý “container là gì trong lập trình”.
- **Dựng:** Pillow+FFmpeg, card và `comparison`. **Rủi ro:** Vết nứt dễ gợi sập dây chuyền tất yếu. Dùng đèn cảnh báo ở hai hộp còn lại.

### 2. Tách ứng dụng, chung nơi xử lý

- **Hook ≤2s:** Cáo nhìn hai luồng chụm lại. “Hai hộp, sao chung đường?”
- **Nhịp:** 0–3s web và worker gửi yêu cầu. 3–15s cả hai tới cùng nút “nhân Linux”; nút chuyển cảnh báo trước giây 5. Minh họa namespace giới hạn thứ mỗi tiến trình thấy, rồi đối chiếu hai máy ảo. **Giây 46 trả lời:** “Tách thứ ứng dụng nhìn thấy vẫn là việc của cùng một nhân.” Chốt bằng việc vá cả hai lớp.
- **Giữ chân:** Luồng chạy chỉ ngay chỗ hai ứng dụng phụ thuộc chung, sửa nhầm lẫn giữa cách ly tiến trình và có nhân riêng. **Tín hiệu:** ytb gợi ý “docker container escape”.
- **Dựng:** `FlowDiagram`, `request_stream`, `status_indicator`. **Rủi ro:** Dễ nhầm với đường mạng. Gắn nhãn “yêu cầu tới nhân” ngay từ đầu.

### 3. Vá web, còn lớp nào?

- **Hook ≤2s:** Cáo cạnh bảng trực. “Vá nginx, đóng ca được chưa?”
- **Nhịp:** 0–3s nginx chuyển xanh. 3–15s ô kiểm tra nhân vẫn trống, các dịch vụ chung máy hiện trước giây 5. Dẫn nginx2root để đặt câu hỏi về hai lớp; chưa đủ dữ kiện để khẳng định bước lên root. Đối chiếu với máy ảo. **Giây 47 trả lời:** “Kiểm tra và vá cả nginx lẫn nhân máy chủ.” Kết mời chọn mục còn thiếu.
- **Giữ chân:** Một quyết định bàn giao cụ thể, sửa thói quen coi vá ứng dụng là đã xử lý cả máy. **Tín hiệu:** Tin mới, bài Cloudflare ngày 20/11/2026 về nginx2root.
- **Dựng:** `UiSimulationScene`, `timeline_steps`. **Rủi ro:** Bảng trực dễ bị hiểu là sự cố thật. Gắn “ví dụ dựng” trên bảng.