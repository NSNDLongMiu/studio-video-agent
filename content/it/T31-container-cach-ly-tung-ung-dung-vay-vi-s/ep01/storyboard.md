# Storyboard IT-T31-E01 · DRAFT

58,0 giây · 1080×1920 · 30 fps · Pillow + FFmpeg. Mốc trong bảng là giây toàn tập. Mốc trong JSON tính từ đầu cảnh.

| Cảnh | Mốc | Nền và cỡ cảnh | Hình chứng minh | Cáo |
|---|---|---|---|---|
| S01 | 0–6 | office · medium | Web bật tick xanh ở 1,5 s, công tắc nghiêng ở 2,2 s; hộp cạnh bật tam giác vàng, ô NHÂN lộ và công tắc nhả ở 3,1 s. | point_right, rộng 184 px, bbox mép trái x100 đáy y1270. Chỉ hộp bên cạnh khi nó vàng. Hiện 0–3,5 s. |
| S02 | 6–11.5 | office · wide | Web đỏ, hai hộp kia được bọc trong bong bóng khoá rồi bong bóng nứt và lộ cảnh báo. | think rộng 151 px, x810 đáy y1270, hiện 1,0–2,5 s. Hướng mắt về hộp đỏ và bong bóng. |
| S03 | 11.5–20 | security · medium | Ba chân hạ so le rồi cùng chạm một dầm, hai vách mọc từ dầm. NHÂN LINUX giữ đến hết cảnh. | — |
| S04 | 20–25 | security · close_up | Dầm rạn tại chân vách, vách liền đứt quãng và hai hộp cạnh bật viền vàng. | — |
| S05 | 25–30.5 | security · wide | Một dầm liền đối chiếu ba đế rời, bên có đế rời chỉ một hộp bật viền vàng. Header NHÂN RIÊNG. | — |
| S06 | 30.5–37 | incident · medium | Thẻ tin trượt vào và ghim, cờ hiện, riêng chip bên trong web xanh sang đỏ. | — |
| S07 | 37–42 | incident · close_up | Thẻ rời xuất hiện và bật dấu hỏi, vùng nền mờ đi, vách liền và chip đỏ giữ nguyên. CHƯA RÕ chỉ ở header. | — |
| S08 | 42–47.5 | performance · wide | Thanh của mô hình gọn đầy trước, sau đó cân nghiêng và dầm chung lộ vết rạn nhỏ. | — |
| S09 | 47.5–53 | code · medium | Tick nginx, terminal hiện rồi đóng, chip xác nhận bật trước tick nhân, hộp cạnh xanh rồi công tắc gạt. | — |
| S10 | 53–58 | office · wide | Từ công tắc đã chốt mở rộng ra bảng xanh, thẻ lịch bật ra rồi bong bóng góp ý mở cạnh bảng. | thumbs_up rộng 173 px, chính giữa dưới, đáy y1270, hiện 1,5–5,0 s. Cắt vào khi hai tick cùng xanh, hướng người xem về thẻ lịch trên bảng. |

## Dựng và tự kiểm

- Opening là S01 riêng, tiêu đề vào 4,6 s, hiện trọn từ chậm nhất 4,8 s đến 6,0 s. Ảnh bìa lấy khung 3,3 s với Cáo, tick web, tam giác vàng và ô nhân trống; thử ở 180×320. Dải header tách khỏi nội dung và chạy từ S02 tới S10. Ba dấu tiến độ nằm cùng dải để giữ ngân sách chữ.
- Lượt đọc theo mã số 01–10 của schema và bộ lập kế hoạch giọng. Các nhịp a/b giữ theo bảng R24 trong script, gồm S01a nghỉ 0,5 s sau “nhé?”, S03a nghỉ 0,5 s sau “Linux.”, S06b ngắt tại “Tuỳ cấu hình,”, S09 nghỉ 0,3 s giữa hai câu. Producer đối chiếu mốc sau đo TTS và nghe đủ chữ đầu mỗi câu theo audit T9. Hook vào lời ở 0,6 s theo R26; tick web ở 1,5 s theo “xong rồi”, công tắc nghiêng ở 2,2 s, tam giác vàng và nhãn NHÂN bật ở 3,1 s ngay sau “Khoan”. Canh lại các mốc theo TTS, giữ tối thiểu 1,0 s sau lời. S08 giữ sau lời 0,9 s như script, thấp hơn mốc tham khảo Medium 0,1 s. Đuôi im S10 0,7 s.
- R12 theo cảnh. Office S01/S02/S10 16,5 s (28,4%). Security S03/S04/S05 19 s (32,8%). Incident S06/S07 11,5 s (19,8%). Bàn thử vận hành S08 5,5 s (9,5%). Code S09 5,5 s (9,5%). Chuỗi dài nhất ba cảnh. S04 dùng crop vào chân vách; những cảnh còn lại đổi hình bằng đạo cụ, cách xếp vật và điểm cắt. Cảnh cận S04 chủ ý giữ đủ dầm và chân vách trong cụm cao khoảng 680 px.
- Cáo có mặt 8,5 s (14,7%), rút thời gian hiện ở ba cảnh theo ngưỡng R12, giữ các dáng và hành động đã duyệt. Talking-head 0%. Kiểm sau dựng ở 360×640, ưu tiên khung chuyển vách và chip đỏ. Kinetic tối đa một lần mỗi cảnh tại S01, S03, S10. Chữ minh hoạ có 41 từ trong 58 s, kể cả hai từ trong lệnh terminal và không tính ký hiệu, khoảng 42,4 từ/phút. Nhãn mượn từ cột chữ đã duyệt; dấu hỏi và chip xác nhận lấy theo chỉ dẫn hình và review.
- S06 đỏ riêng chip nginx. S07 giữ vách liền, thẻ lỗi nhân độc lập có dấu hỏi. S09 terminal chỉ hiện lệnh xem, rời khung tại 50,4 s rồi chip ĐÃ VÁ hiện; tick NHÂN ở 50,7 s, hộp cạnh xanh ở 51,0 s. Chip xác nhận thuộc tình huống dựng và giữ đến lúc gạt công tắc ở 51,5 s. Các nhãn S09 hiện ít nhất 1,0 s; dòng lệnh là chi tiết của đạo cụ terminal. Bảng trực và khoảng thời gian giữ giúp người xem thấy thứ tự trước khi công tắc đóng.

## voice_direction theo line_id (R24)
| line_id | Ý định | Cảm xúc | Cụm nhấn | Tốc độ | Nghỉ trước/sau | Ngữ điệu | Quan hệ chuyển ý |
|---|---|---|---|---|---|---|---|
| L01a (S01) | thói quen vui, tự tin | nhẹ nhõm, hơi đắc ý | "xong rồi", "đóng ca" | atempo 1,15 | trước 0,6 s / sau 0,5 s | lên nhẹ ở "nhé?" | mở tình huống |
| L01b (S01) | khựng lại, nhận ra | ngạc nhiên nhẹ | "Khoan", "đổi màu" | atempo 1,15, "Khoan" chậm một nhịp | trước 0 / sau 0,6 s | "Khoan." dứt, "màu?" lên | hệ quả sớm, dẫn vào tiêu đề |
| L02a (S02) | nêu niềm tin sai | đồng cảm, không chê | "chỉ mất cái hộp" | atempo 1,15 | trước 0,2 s / sau 0,4 s | đều, lên nhẹ cuối câu | vấn đề |
| L02b (S02) | mở câu hỏi | tò mò | "sai ở đâu" | atempo 1,10, chậm cuối | trước 0,4 s / sau 0,9 s | lên rõ ở "đâu?" | mở câu hỏi cho S03 |
| L03a (S03) | trả lời | chắc, rõ | "Sai ở chỗ này", "cùng một nhân" | atempo 1,09 | trước 0,2 s / sau 0,5 s | xuống ở "Linux." | trả câu hỏi |
| L03b (S03) | nêu cơ chế | chắc | "dựng", "bức tường" | atempo 1,07, chậm | trước 0 / sau 2,4 s giữ | xuống dứt | nguyên nhân → cơ chế |
| L04 (S04) | nêu nguy cơ có điều kiện | nghiêm nhưng bình tĩnh | "có thể", "yếu đi" | atempo 1,09 | trước 0,2 s / sau 2,7 s giữ | xuống ở "đi." | hệ quả của cơ chế |
| L05 (S05) | đối chiếu | điềm tĩnh | "nhân riêng" | atempo 1,09 | trước 0,2 s / sau 2,5 s | ngắt nhẹ sau "Với máy ảo", hạ cuối | so sánh |
| L06a (S06) | dẫn ví dụ thời sự | tin nóng, nhẹ | "vừa có", "nginx" | atempo 1,10 | trước 0,2 s / sau 0,4 s | đều | chuyển sang ví dụ |
| L06b (S06) | nêu hệ quả có điều kiện | thận trọng | "Tuỳ cấu hình", "có thể" | atempo 1,07, chậm ở "Tuỳ cấu hình" | trước 0,4 s / sau 0,6 s | ngắt sau "cấu hình,", hạ cuối | giữ ranh giới, không nói quá |
| L07 (S07) | nêu điều chưa rõ | trung thực, bình tĩnh | "liên quan tới nhân", "chưa công bố đầy đủ" | atempo 1,07, chậm ở "chưa công bố" | trước 0,2 s / sau 1,0 s | hạ đều, dứt ở "đủ." | giữ ranh giới brief |
| L08a (S08) | công bằng cho container | tích cực | "vẫn đáng dùng", "chung nhân" | atempo 1,09 | trước 0,2 s / sau 0,4 s | lên nhẹ ở "dùng:" | đánh đổi: mặt được |
| L08b (S08) | nêu cái giá | trầm hơn, chắc | "cái giá" | atempo 1,07 | trước 0,4 s / sau 0,9 s | hạ dứt | đánh đổi: mặt phải |
| L09a (S09) | đưa việc làm | rõ ràng, quyết đoán | "vá cả nhân", "khi có bản" | atempo 1,10 | trước 0,2 s / sau 0,3 s | đều, nhấn "cả", hạ nhẹ ở "bản." | giải pháp |
| L09b (S09) | trả hook | nhẹ nhõm | "đóng ca" | atempo 1,12 | trước 0,3 s / sau 1,5 s | hạ dứt | kết hook |
| L10a (S10) | đặt câu hỏi tự soi | thân thiện | "lần cuối" | atempo 1,15 | trước 0,2 s / sau 0,4 s | lên ở "nào?" | quay lại người xem |
| L10b (S10) | kêu gọi | ấm, nhẹ | "bình luận" | atempo 1,15 | trước 0,4 s / sau 0,4 s + đuôi 0,7 s | lên nhẹ ở "nhé." | kết |

