## 1. Lỗi kỹ thuật và rủi ro chính xác

1. **S04/L04.** “Nhân có lỗi thì…” quy mọi lỗi nhân thành lỗi cách ly. Thêm “có thể” để giữ đúng phạm vi.
2. **S05/L05.** “Tường dày hơn” và hình chỉ một hộp vàng dễ gợi máy ảo luôn khoanh được lỗi. Nêu mỗi máy ảo có nhân riêng. Trong hình, giới hạn vết nứt vào nhân khách đang minh họa. [Docker](https://docs.docker.com/learn/content/what-is-a-container/)
3. **S06/L06b.** “Hộp web bị chiếm” và tô đỏ cả hộp dễ gợi quyền kiểm soát toàn bộ container. Thu hẹp lời và vùng đỏ về nginx trong hộp web. Giữ điều kiện cấu hình. [Cloudflare](https://blog.cloudflare.com/nginx2root/)
4. **S07/L07.** Mũi tên từ web xuống nhân dễ được đọc thành diễn tiến tự động. Đặt dấu hỏi trên một lỗi nhân riêng, giữ lời thận trọng đã chốt. [CẦN KIỂM NGUỒN] nếu bổ sung nhận định về việc chuỗi đã được tái hiện độc lập hay chưa. [Cloudflare](https://blog.cloudflare.com/nginx2root/)
5. **S09/L09a–b.** Ô nhân tick ngay sau `uname -r` biến thao tác xem bản phát hành nhân đang chạy thành bằng chứng đã vá. Chỉ tick sau khi bảng trực xác nhận đã áp dụng và kiểm tra cả hai bản vá. [GNU Coreutils](https://www.gnu.org/software/coreutils/manual/html_node/uname-invocation.html)

## 2. Bản viết lại lời đọc cho các đoạn `[kỹ thuật]`

- **L04 · 20,2–22,3 s · 8/9 âm tiết.** **“Lỗi nhân có thể làm tường yếu đi.”** Nêu hệ quả có điều kiện.
- **L05 · 25,2–28,0 s · 9/12 âm tiết.** **“Với máy ảo, mỗi hộp có một nhân riêng.”** Nêu điểm khác trong sơ đồ bằng một câu.
- **L06b · trong 30,7–36,4 s · 10 âm tiết, cả L06 ≤ 23.** **“Tuỳ cấu hình, nginx có thể bị chiếm.”** Gọi đúng thành phần chịu tác động. Y8 giữ `nginx` trong lời và phụ đề, đưa `engine x` vào TTS theo bảng, chờ giám đốc nghe.

Chuyển các dòng `voice_direction` sau vào storyboard theo `line_id`. Mốc nghỉ tính một lần tại mỗi ranh giới câu.

| line_id | Ý định | Cảm xúc | Cụm nhấn | Tốc độ | Nghỉ trước/sau | Ngữ điệu | Quan hệ chuyển ý |
|---|---|---|---|---|---|---|---|
| L04 | Nêu nguy cơ | Bình tĩnh | “có thể”, “yếu đi” | 1,09 | 0,2 / giữ ≥ 2,7 s | Hạ cuối | Cơ chế → hệ quả |
| L05 | Đối chiếu | Điềm tĩnh | “nhân riêng” | 1,09 | 0,2 / giữ ≥ 2,5 s | Ngắt nhẹ sau “máy ảo”, hạ cuối | Hệ quả → đối chiếu |
| L06b | Nêu điều kiện | Thận trọng | “tuỳ cấu hình” | 1,07 | 0,4 / giữ ≥ 0,6 s | Hạ cuối | Tin công bố → tác động |

## 3. Bằng chứng hình (R11) còn thiếu

- **S07:** Giữ đỏ riêng nginx, giữ tường nguyên. Hiện dấu hỏi trên một thẻ lỗi nhân riêng cạnh nền, bỏ mũi tên nối từ hộp web.
- **S09:** Sau khung terminal, cho bảng trực xác nhận hai bước vá và kiểm tra trong ca dựng. Lúc đó hai ô mới tick và công tắc mới gạt.
