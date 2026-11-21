## Vòng 1 — Phản biện 3 concept của Claude

**IT-T18-E01** · Dành cho người từng đặt báo thức đúng giờ nhưng ngủ lỡ. Thông điệp đề xuất cho tập này là giờ báo thức và âm báo được cài riêng, nên hãy kiểm tra âm của chính báo thức vừa đặt.

Điểm theo thứ tự **hook & giữ chân / khớp brief / khả thi sản xuất / an toàn / độc đáo**, thang 1–10.

- **A. Báo thức nằm trong ngăn kéo — 8 / 5 / 6 / 6 / 8.** Cảnh Cáo bật dậy vì trễ họp có hệ quả rõ, nhưng đoạn giữa gộp Doze, hạn chế chạy nền và quyền đặt báo thức chính xác. `setAlarmClock()` vẫn hoạt động trong Doze. Nếu giữ A, mở ngay với app báo thức bên thứ ba trên Android và chỉ kể trường hợp app dùng `SCHEDULE_EXACT_ALARM` bị thu hồi quyền, khiến các báo thức chính xác đã đặt bị hủy. Nêu nguyên nhân trước giây 15, đến giây 45–50 chỉ chỗ kiểm quyền và đặt lại báo thức để thử. [Android Developers](https://developer.android.com/develop/background-work/services/alarms)
- **B. Chuông to, báo thức câm — 8 / 9 / 9 / 9 / 7.** Hook hiện dễ làm người xem tưởng tăng âm lượng là thao tác cần sửa. Cho Cáo thấy báo thức hiện đúng giờ nhưng chỉ rung trong 2 giây đầu, rồi lộ cuộc họp đã bắt đầu trước giây 5. Giữ một cơ chế là âm báo của mục đó đang đặt «Không có», bỏ ba nút gạt. Đến giây 8–12 cho thấy mục Âm báo, giây 45–50 quay lại cảnh Cáo chọn âm và thử một báo thức mới. Apple xác nhận Đồng hồ trên iPhone có thể chỉ rung khi âm báo đặt «Không có». [Apple Support](https://support.apple.com/en-ie/118444)
- **C. Đã tắt chuông từ tối — 6 / 6 / 7 / 7 / 6.** Dòng «Đã tắt thông báo» chưa cho thấy báo thức bị chặn. Nếu giữ C, giới hạn ở Android có tùy chọn cho phép báo thức trong Không làm phiền. Mở bằng Cáo lỡ giờ khi lịch chế độ đang bật, rồi cho thấy cài đặt chặn báo thức trước giây 15. Đến giây 45–50, bật ngoại lệ và thử ngay khi chế độ còn chạy. Tên mục tùy máy. Apple xác nhận Tập trung vẫn cho báo thức của Đồng hồ phát âm. [Google Android Help](https://support.google.com/android/answer/9079661) · [Apple Support](https://support.apple.com/en-ca/guide/iphone/iph2909d3a74/ios)

Dùng dáng Cáo tĩnh có sẵn, cắt dáng ở mở, giữa và kết. Các mốc giờ dựng được giới thiệu là ví dụ trong lời hoặc mô tả. Khai báo AI trong `publish.json` và lời hoặc mô tả.

**Chọn B của Claude làm trục** vì cảnh báo thức hiện đúng giờ mà chỉ rung dẫn thẳng đến một cài đặt người xem có thể tự kiểm ngay.