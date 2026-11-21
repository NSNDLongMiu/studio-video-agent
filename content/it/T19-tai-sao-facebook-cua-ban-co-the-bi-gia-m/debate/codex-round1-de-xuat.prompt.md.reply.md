## Vòng 1 — đề xuất độc lập

**Trọng tâm:** Vì sao tài khoản giả có thể khiến người quen tin dù tài khoản thật vẫn do bạn kiểm soát? Với dân văn phòng Việt Nam, dấu hiệu đáng nhớ là tên và ảnh quen có thể xuất hiện trên một tài khoản khác. Hãy gọi xác minh trước khi chuyển tiền.

Cả ba concept dùng khung 9:16, 1080×1920, 55–60 giây. Opening ba pha gồm Cáo gặp sự cố trong 0–2s, chi tiết bất thường ở 2–3s, hệ quả trước 5s. Gắn nhãn “Ví dụ dựng” và nhãn AI. Dùng Cáo dáng tĩnh ở mở, giữa, kết, chiếm khoảng 10–18% chiều ngang khi cùng minh họa. Đổi dáng bằng cắt cảnh. TTS tiếng Việt, hiệu ứng tự tổng hợp, không nhạc nền. Các khẳng định về Facebook cần đối chiếu tài liệu chính thức trước khi thu âm. Phần xử lý trình bày ở mức nguyên tắc.

### 1. Hai khung chat, một gương mặt

- **Hook ≤2s:** Cáo nhìn điện thoại. Bạn nhắn “Sao mày vừa vay tao 5 triệu?” Nhãn “Ví dụ dựng” hiện ngay.
- **Nhịp:** 0–3s, Cáo mở đoạn chat của mình, chẳng có lời vay. 3–15s, bạn sắp chuyển tiền ở giây 4. **Giây 9 trả lời** bằng hai khung chat cạnh nhau: tài khoản khác có thể dùng tên và ảnh công khai để trông quen. Phần sau cho thấy danh sách bạn bè công khai có thể làm lộ ai quen Cáo.
- **Kết và giữ chân:** Bạn gọi Cáo trước khi chuyển. Người xem sớm thấy tiền có thể đi nhầm và nhận ra lỗi tin ảnh đại diện. Dùng `UiSimulationScene` và `CharacterScene`. **Rủi ro:** Hai khung dễ nhập nhằng trên màn hình nhỏ. Gắn nhãn “Tài khoản Cáo” và “Tài khoản giả” khi bật mí.

### 2. Biết tên đồng nghiệp

- **Hook ≤2s:** Cáo thấy ảnh chụp tin nhắn bạn gửi: “Nó biết cả tên đồng nghiệp mình.”
- **Nhịp:** 0–3s, Cáo khựng lại khi thấy lời nhờ chuyển tiền. Trước 5s, bạn định chuyển vì người nhắn có vẻ biết nhóm. **Giây 11 trả lời:** tên, ảnh và danh sách bạn bè công khai có thể tạo cảm giác người nhắn thuộc vòng quen biết.
- **Kết và giữ chân:** Cuộc gọi làm rõ vì sao “biết người quen” vẫn cần xác minh. Dùng `UiSimulationScene` và `ExplainerScene` với sơ đồ quan hệ hư cấu. **Rủi ro:** Dễ ngụ ý danh sách luôn công khai. Hiện điều kiện “nếu để công khai” ngay trên sơ đồ.

### 3. Một cuộc gọi, hai câu trả lời

- **Hook ≤2s:** Cáo bắt máy. Bạn hỏi “Tiền chuyển vào đâu?”
- **Nhịp:** 0–3s, Cáo ngơ ngác. Trước 5s, bạn nói đang chuẩn bị chuyển vì thấy đúng tên và ảnh. **Giây 8 trả lời:** thông tin công khai có thể khiến một hồ sơ khác trông giống Cáo, kể cả với người quen.
- **Kết và giữ chân:** Người xem thấy ngay cuộc gọi chặn cú chuyển nhầm, rồi hiểu vì sao bạn suýt tin. Dùng `CharacterScene` và `ExplainerScene`. **Rủi ro:** Mở đầu dễ giống cuộc gọi công việc. Hiện lời vay cạnh Cáo ngay khung đầu.

**Cả ba bản kết:** Gọi số đã biết trước khi chuyển tiền. Thấy tài khoản giả thì báo bạn bè, báo cáo tài khoản đó và rà lại thông tin mình để công khai. Mời chọn nhẹ “Gặp tin vay tiền bất ngờ, bạn gọi ai trước?”