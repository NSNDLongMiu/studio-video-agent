# Chủ đề #31 — IT

**Chủ đề:** Container cách ly từng ứng dụng, vậy vì sao một lỗi ở nhân Linux vẫn có thể kéo sập cả máy chủ? (nhân vụ nginx2root 11/2026)

**Ghi chú của giám đốc:** Đối tượng: dev, SA, DevOps, sysadmin (độ sâu trung bình; người ngoài nghề vẫn theo được nhờ hình). MỘT cơ chế: máy ảo có nhân riêng, container thì KHÔNG; mọi container trên một máy dùng chung một nhân Linux, "bức tường" giữa chúng do chính nhân đó dựng, nên lỗi ở nhân là lỗi của bức tường. Hook gợi ý (ví dụ dựng): "Web server chạy trong container rồi, có bị chiếm thì cũng chỉ mất cái hộp đó thôi." Câu này sai ở đâu? Hình: nhiều hộp đặt trên một tấm nền chung, vết nứt ở tấm nền chạy xuyên các hộp; đối chiếu với máy ảo (mỗi hộp một nền). Dẫn nginx2root làm ví dụ thời sự, kết bằng đánh đổi: container nhẹ và nhanh vì dùng chung nhân, và đó cũng là giá phải trả; việc làm: vá cả nginx lẫn nhân của máy chủ. 2 điều KHÔNG nên khẳng định: (1) "nginx2root cho kẻ tấn công quyền root ngay": bước lên root cần thêm một lỗi nhân chưa công bố chi tiết, chưa được bên thứ ba tái hiện; (2) số máy chủ bị ảnh hưởng (Shodan 56,7 triệu và Censys 8,8 triệu là hai cách đếm khác nhau) và tình trạng bản vá nhân (nguồn mâu thuẫn). Không tả cách khai thác.

**Đội phụ trách:** IT · Đội 4 (đội #5)
