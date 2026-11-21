# IT-T18-E01 · Storyboard DRAFT

**62,80 giây · 1080×1920 · 30 fps · Pillow + FFmpeg.** Bản 2 chờ Claude duyệt.

| Cảnh | Giây toàn tập | Nền | Scene type | Hình và bằng chứng khi tắt tiếng |
|---|---:|---|---|---|
| S00 (S01–S03) | 0.00–8.00 | Phòng ngủ → giao diện sáng | `object_interaction` | Máy rung cạnh Cáo ngủ → ô họp đã có tiến độ → nút gạt mà luồng đi vòng → luồng dừng ở hàng đỏ trước loa gạch. |
| S04 | 8.00–14.00 | Sơ đồ lưới xanh | `process_animation` | Thẻ thứ hai xuất hiện với hàng âm độc lập; một đường tách thành đầu loa phát sóng và đầu máy chỉ rung khi công tắc bật. |
| S05 | 14.00–19.00 | Giao diện sáng | `ui_simulation` | Các hàng trượt qua đầu ngón rồi dừng ở hàng đỏ; dấu chọn theo hàng sang màn sửa. |
| S06 | 19.00–24.00 | Sơ đồ lưới xanh | `comparison_scene` | Nút video lên đỉnh và loa phát nhiều cung; nút báo thức vẫn sát đáy, chỉ có một cung ngắn. |
| S07 | 24.00–32.50 | So sánh tím | `comparison_scene` | Kéo một thanh ngang làm hai biểu tượng hạ cùng lúc. Sau khi tách thành hai tầng, kéo thanh báo thức còn thanh chuông đứng yên. Giữ kết quả 2,50 s. |
| S08 | 32.50–39.50 | So sánh tím | `comparison_scene` | Thanh báo thức kéo riêng; lớp trăng che chuông và cắt cung âm; gạt cho phép thì lớp phủ rút, cung xanh trở lại. |
| S09 | 39.50–44.50 | So sánh tím | `ui_simulation` | Ô app tải về trượt vào danh sách; hàng của nó bung công tắc riêng ở trạng thái tắt và tín hiệu vàng. |
| S10 | 44.50–50.50 | Giao diện sáng | `ui_simulation` | Hàng nốt gạch đỏ đổi thành nốt có dấu chọn xanh; chốt âm lượng lên cao thì loa hiện xanh. |
| S11 | 50.50–55.00 | Giao diện sáng | `object_interaction` | Kim tua tới cữ đặt trước; máy sáng và rung, loa xanh bung cung lớn đồng thời mới có chuông. |
| S12 | 55.00–62.80 | Phòng ngủ | `environment_scene` | Cùng điện thoại và ô họp như mở, nhưng có cung loa xanh, thanh họp chưa chạy; cuối cùng bong bóng rỗng mở cạnh Cáo. |

## Chỉ đạo dựng

- Opening S00 giữ ba nhịp của kịch bản ở 0–3,20, 3,20–5,60 và 5,60–8,00 s. Cáo và điện thoại rung thấy từ khung đầu; Cáo rời ở cú cắt hông máy 3,20 s. Lịch đã chạy từ 2,05 s. Đường âm đi vòng nút ở 4,00 s rồi vấp hàng đỏ ở 6,90 s.
- Ghép chữ bằng text engine. Header 52 px chỉ hiện BÁO THỨC / ÂM BÁO, đổi ô theo từng cảnh. Tiêu đề chỉ vẽ ở opening để giữ đúng cột chữ đã duyệt. Phụ đề ASS 56 px ở y≈1340–1500, tối đa hai dòng, 28 ký tự mỗi dòng. S08 rút nhãn ANDROID ở 2,80 s tính từ đầu S08 để nhường chỗ cho hai nhãn điều kiện. S00 giữ nhãn ở công tắc; S04 dùng lại nốt gạch đỏ ứng với KHÔNG CÓ đã đọc ở S00. S07 dùng nhãn rút gọn CHUÔNG và giữ iOS 27: TÁCH ĐƯỢC. S09 giữ tên mục quyền, dùng công tắc và viền vàng cho điều kiện từng app.
- **Chốt Rescue 21/11 (chữ trên hình, nguồn duy nhất = bảng này + `storyboard.json` APPROVED, script/plan đã đồng bộ):** S07 chỉ `CHUÔNG` + `iOS 27: TÁCH ĐƯỢC`; S09 chỉ `BÁO THỨC VÀ LỜI NHẮC` (điều kiện tuỳ máy/app bằng viền vàng + công tắc tắt + chấm "?", không nhãn chữ); S02 chỉ `IM LẶNG ≠ TẮT` (không `IPHONE`).
- Tái dùng pose PNG, công cụ flow và crop 2D. Tắt nhạc. Chuông thử chỉ phát sau khung loa xanh. Tình huống họp và nhãn AI khai trong phần đăng. Thumbnail đề xuất từ pha S01 khoảng 1,60 s, kiểm ở 180×320.
- S06 là sơ đồ toàn khung với hai thanh dọc trên lưới navy; S07 là hai thanh ngang xếp tầng trên nền tím; S08 là cận máy đứng với lớp phủ trăng chiếm nửa phải, pan từ 3,60 s tính từ đầu cảnh. Kiểm ba bố cục ở 360×640.
- R12 theo thời lượng thiết kế. Phòng ngủ S00 pha S01–S02 và S12 chiếm 13,4 s (21,3%); lưới navy S04 và S06 chiếm 11,0 s (17,5%); nền tím S07–S09 chiếm 20,5 s (32,6%); giao diện xám sáng S00 pha S03, S05, S10–S11 chiếm 17,9 s (28,5%). Chuỗi dài nhất là ba cảnh tím. Cáo xuất hiện 8,6 s (13,7%) ở S00, S05 và S12, riêng pose shrug ở S05 rộng 165 px. Đứng nói 0%.
- Chữ minh họa có ở 10/10 cảnh, 42 từ bỏ tiêu đề và header (40,1 từ/phút), 46 từ nếu tính tiêu đề (43,9 từ/phút). Kinetic ở khoảng 0,10 / 15,10 / 27,90 s. Cần xem bản dựng ở 360×640 và nghe TTS để xác nhận nhịp.

## Claude rescue sửa (21/11/2026) — đã chốt, thay cho mục "Điểm Claude cần chốt" bên dưới

- **Cáo S11:** giữ. Thêm pose `idea` ≈170 px, x≈100, đáy y=1290, ngoài mặt đồng hồ, hiện cục bộ 0,40–2,80 s (≈ 50,9–53,3 s toàn tập, căn theo mốc lời 16 sau TTS). Tổng Cáo 11,0 s / 62,8 s = 17,5% (Y2–Y3 đạt); S05 shrug 14 s và S12 thumbs_up cách ≥ 2 s.
- **S02 surprised:** chấp nhận bản storyboard: sleep 0–2 s, surprised 2,0–3,2 s rồi Cáo rời ở cú cắt hông máy 3,20 s (plan kéo tới 5,6 s nhưng cảnh đó cần diện tích cho nút gạt).
- **Ranh giới S07/S11:** bảng cảnh storyboard (S07 24,0–32,5; S11 50,5–55,0) là chuẩn dựng; mốc lời trong script/plan chỉ là ước lượng, Producer đo lại theo TTS và neo hình vào lời, giữ tổng 62,8 s (≤ 72 s).
- **Hook:** voice mở đầu theo `voice_start_min_s` = 0,6 s (`tools/config/pipeline-rules.json`): L01 `pause_before_s` 0,6, `pause_after_s` 0,2. Tiêu đề chữ vẫn bật hình ở 0,10 s (chữ, không phải lời). Hệ quả (ô họp chạy) hiện ở 2,05 s, trước giây 5.
- Bảng ngân sách S04 6,20 / S08 7,35 bỏ; theo bảng cảnh 6,00 / 7,00.

## Điểm Claude cần chốt (ĐÃ CHỐT ở mục trên)

- Lấy bảng cảnh và các mốc lời làm chuẩn 62,80 s. Bảng ngân sách có dòng S04 6,20 s và S08 7,35 s, trong khi bảng cảnh cho 6,00 s và 7,00 s. Bản review ghi khoảng 63,5 s. Giữ nguyên lời 01–18.
- Giữ hook vào 0,10 s theo script; cấu hình R26 yêu cầu sớm nhất 0,60 s. Đo TTS rồi chốt mốc L01 cùng Claude để vẫn thấy hệ quả trước giây 5. Mốc giữ cuối opening 0,44 s theo khung lời đã duyệt. Chuyển 1,00 s từ S11 sang S07, đưa S07 lên 8,50 s và giữ kết quả 2,50 s sau lời. S06 có 2,29 s từ hết lời tới cắt, gồm khoảng nghỉ rồi giữ kết quả; S11 còn 1,79 s sau lời, gồm lúc kim chạm đích, chuông và giữ.
- L13 dùng cụm nhấn đúng lời hiện hành, “xem”; hai cụm “App tải về” và “xem thêm” trong bảng chỉ đạo giọng thuộc lời cũ. S12 giữ nguyên cụm chốt dài bốn từ theo script.
