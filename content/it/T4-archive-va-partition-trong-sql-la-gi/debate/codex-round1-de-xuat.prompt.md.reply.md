**Vòng 1 — đề xuất**

**1. Báo cáo tháng này, lục cả lịch sử**

- **Hook:** “Sếp cần tháng này. Cáo lục mọi năm!” Nhãn “Ví dụ dựng”.
- **Nhịp:** **0–3s:** Cáo cầm laptop trước bảng đơn hàng; thẻ “THÁNG NÀY” bật sáng. Ích lợi ở **3s**: partition có thể giúp bỏ qua phần không liên quan. **3–15s:** bảng tách thành các khối theo tháng, vẫn chung khung “MỘT BẢNG LOGIC”; chỉ khối phù hợp sáng. Câu hỏi: “Dữ liệu cũ đã được archive chưa?” → trả ở **17s**: chưa; archive là chuyển dữ liệu cũ/ít dùng sang nơi lưu khác. **Kết, 25s:** “Partition chia phần · Archive chuyển nơi lưu”. Mời chọn: “Báo cáo của bạn cần cách nào?”
- **Vì sao giữ chân:** sự cố báo cáo gần công việc; hiểu lợi ích trước khi giải nhầm lẫn.
- **Cách làm:** ExplainerScene + Pillow; cắt Cáo từ gõ máy sang chỉ khối đang sáng.
- **Rủi ro:** dễ hứa tăng tốc; ghi “có thể”, không dùng đồng hồ hay số hiệu năng.

**2. Archive rồi, hóa đơn nằm đâu?**

- **Hook:** “Kế toán hỏi hóa đơn cũ. Cáo tìm hụt!” Nhãn “Ví dụ dựng”.
- **Nhịp:** **0–3s:** ô tìm kiếm trống cạnh yêu cầu đối soát. Ích lợi ở **4s**: archive cần đường tra cứu dữ liệu đã chuyển. **3–15s:** Cáo cầm kẹp tài liệu; thẻ hóa đơn đi từ kho đang dùng sang kho lưu khác, nối bằng mũi tên tra cứu. Câu hỏi: “Chia ngăn ngay trong bảng có phải archive?” → trả ở **18s**: đó là partition; các phần vẫn thuộc một bảng logic. **Kết, 27s:** “Archive: đổi nơi lưu, nhớ đường tìm”. Mời gõ “đã từng tìm hụt”.
- **Vì sao giữ chân:** người xem thấy ngay hệ quả của việc lưu mà thiếu cách tìm.
- **Cách làm:** UiSimulationScene + hộp, thẻ bằng code; Cáo chỉ đúng kho vừa nhận hóa đơn.
- **Rủi ro:** tránh ngụ ý mất dữ liệu; hiện “Đã chuyển kho”. Archive không có lệnh SQL chuẩn chung.

**3. Một bảng, hai việc cuối kỳ**

- **Hook:** “Cáo chia bảng. Sếp tưởng đã dọn kho!” Nhãn “Ví dụ dựng”.
- **Nhịp:** **0–3s:** bảng chia tháng nhưng các thẻ cũ còn nguyên. Ích lợi ở **3s**: partition không nén, không xóa. **3–15s:** Cáo chỉ phần cũ; một nhóm thẻ chuyển sang kho khác. Câu hỏi: “Hai cách dùng chung được không?” → trả ở **19s**: được; partition hỗ trợ bảo trì từng phần, archive quản lý dữ liệu ít dùng. **Kết, 28s:** “Chia để quản lý · Chuyển để lưu”. Mời chọn “chia / chuyển / cả hai”.
- **Vì sao giữ chân:** hai biến đổi lớn, dễ so sánh.
- **Cách làm:** Remotion ExplainerScene; cắt dáng Cáo theo vật đổi.
- **Rủi ro:** sơ đồ khái niệm, không giả thao tác SQL chung.

Chung: 9:16, 1080×1920; nhãn AI; không nhạc/nhép miệng. Bìa lấy hook, vật lớn; chữ hình bổ sung phụ đề. Kiểm nguồn chính thức trước dựng; nhịp theo TTS, đuôi im ≤0,7s.