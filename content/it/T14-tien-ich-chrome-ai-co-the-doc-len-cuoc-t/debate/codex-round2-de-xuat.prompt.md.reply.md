## Phản biện vòng 2

- **Điểm chung.** Nhận phần giữa còn mỏng. Chia 180 giây theo chức năng, mỗi cảnh một ý, mỗi bước sơ đồ giữ 2–3 giây. Ghi “ví dụ dựng” trong plan, khai báo AI ở mô tả đăng và `publish.json`.
- **Gỡ rồi, bản sao còn đâu?** Nhận đoạn gỡ lấn chủ đề và đáp án giây 158 quá muộn. Cho thấy tiện ích lấy bản sao trước giây 5, giải thích quyền đọc ở giây 60. Máy chủ vẽ trừu tượng. Khi minh hoạ thao tác gỡ, cho thấy lần gửi kế tiếp dừng và nói rõ chưa biết bản đã gửi được lưu bao lâu. Nếu đã dán mật khẩu hoặc khóa, đổi mật khẩu hoặc thu hồi khóa. Nếu liên quan dữ liệu công ty, báo IT.
- **Một quyền, ba phạm vi.** Nhận hook kỹ thuật. Mở bằng hậu quả, dùng UiSimulationScene dựng menu không logo. Phản bác cách gọi “khi nhấp” là an toàn. Bấm trên tab chat vẫn cấp quyền tạm thời cho tab đó. Giới hạn quyền và kiểm nhà phát hành là hai bước riêng.
- **Qua mặt Cáo bằng huy hiệu.** Nhận lệch trọng tâm và thiếu cơ chế. Đưa huy hiệu vào một cảnh sai lầm. Báo cáo ghi nhận một tiện ích có huy hiệu Featured. Chừng đó không đủ để khái quát về huy hiệu.

## Bản cải tiến — Ai lấy bản sao cuộc chat?

- **0–2 s · Opening.** Header `SECURITY / TRÌNH DUYỆT`, tiêu đề “Ai đọc được chat của bạn?”. Cáo vừa dán bảng giá mẫu vào chat.
- **2–16 s · Hook.** Trước giây 5, biểu tượng trợ lý AI miễn phí kéo một bản sao khỏi trang. Câu hỏi mở “Vì sao tiện ích thấy bảng giá trong chat?”.
- **16–43 s · Bối cảnh.** Tua về thao tác cài và hộp quyền. Đến vụ OX Security, đồng hồ minh hoạ nhịp gửi khoảng 30 phút.
- **43–88 s · Cơ chế.** Remotion dựng từng bước quyền trang → chữ hiện trong chat → bản sao → đợt gửi nền → máy chủ ngoài. Giây 60 trả lời câu hỏi mở.
- **88–142 s · Đào sâu.** Chạy lại cùng một tab qua ba phạm vi quyền. Thử gỡ và quan sát hai trạng thái của bản sao. Chèn cảnh huy hiệu.
- **142–168 s · Giải pháp.** Kiểm nhà phát hành và quyền trước khi cài, gỡ tiện ích thừa, tránh dán mật khẩu, khóa và dữ liệu khách hàng.
- **168–180 s · Kết.** “Quyền đọc trang cho tiện ích thấy chat. Bạn sẽ kiểm quyền tiện ích nào trước?”

**Sáu câu R15**

1. **Tình huống?** Cáo dán bảng giá công việc.
2. **Vì sao thấy?** Chat là nội dung trang được cấp quyền.
3. **Bản sao đi đâu?** Ra máy chủ ngoài qua đợt gửi nền.
4. **Ví dụ?** “Mọi trang” bao gồm tab chat. “Trang cụ thể” tùy danh sách. “Khi nhấp” cấp tạm cho tab hiện tại.
5. **Sai lầm?** Tin huy hiệu hoặc tưởng gỡ sẽ thu hồi bản sao.
6. **Bài học?** Kiểm quyền trước khi cài và giữ dữ liệu nhạy cảm ngoài chat.

**Dựng.** Bàn làm việc → trang chat → hộp quyền → sơ đồ → màn quản lý. Cáo tĩnh ở mở, giữa, kết, rộng 10–18% khung. 9:16, 1080×1920, TTS VieNeu, hiệu ứng nhẹ, không nhạc.