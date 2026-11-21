# Storyboard IT-T21-E01 · DRAFT

8 cảnh · 48,81 giây (retime theo giọng VieNeu thực đo, rescue 21/11/2026; trước đó 56,54 s) · 1080×1920 · Pillow + FFmpeg · 0% talking-head.

| Cảnh | Giây | Scene type | Nền | Đổi hình chính |
|---|---:|---|---|---|
| S00 (S01–S02) | 0.00–8.00 | ui_simulation | office | Tin nhắn bật trên điện thoại, thẻ nét đứt trượt vào rồi cú cắt làm ô tên thành tiêu điểm. |
| S03 | 8.00–14.97 | process_animation | database | Hạt tiền đi qua thẻ giữa xuống silhouette dưới trong khi phiếu giao dịch ghim lại ở giữa. |
| S04 | 14.97–21.45 | process_animation | incident | Tờ giấy từ toà nhà chạm thẻ trước khi ổ khoá nét đứt xuất hiện; dấu hỏi đi đến thẻ tên. |
| S05 | 21.45–26.08 | data_visualization | security | Thanh hai đầu mút trượt lên và móc bằng đường cam vào mũi tên cho mượn. |
| S06 | 26.08–30.66 | object_interaction | security | Hai ô trượt từ hai phía vào khung, ký hiệu một tài khoản và một lần vẫn phân biệt. |
| S07 | 30.66–36.55 | comparison_scene | N3 đối chiếu | Bên trái các bong bóng kể ngộ nhận; bên phải tiền lao ra khỏi thẻ trong khi ô tên vẫn ở nguyên. |
| S08 | 36.55–41.87 | ui_simulation | solution · sân khấu lưu bằng chứng | Một giao dịch có dấu hỏi xuất hiện cùng hai tài liệu được ghim rồi mở hai nhánh hỏi. |
| S09 | 41.87–48.81 | object_interaction | office | Vệt tua kéo thẻ ra trước lời từ chối; dấu tay và luồng tiền mới dẫn đến thẻ riêng của người nhờ. |

## Điểm đã sửa sau review vòng 1

- Opening giữ 8,00 s. Tin nhắn bật ở 0,10 s. L01 dự kiến 0,60–3,83 s, nghỉ 0,10 s sau mỗi cụm “Ví dụ:” và “tiền,”. L02 dự kiến 3,93–6,02 s, lấy 0,10 s làm khoảng nối chung theo cách pipeline ghép lời. Cắt nội bộ ở 4,10 s, Cáo đổi dáng ở 4,20 s, lời kết thúc còn 1,98 s hình. Tiếng báo thẻ ở 2,50 s và tiếng báo tiêu đề ở 5,10 s; giữ tiêu đề tới 8,00 s.
- Giữ sau lời S03 2,00 s, S04 1,00 s và S07 1,00 s. Các mốc sau cảnh dài hơn đã dời theo bảng. Đo lại thời lượng và mốc diễn tiến khi có TTS.
- Claude (Gỡ vướng, 21/11/2026) chỉnh S04 theo script.md đã chốt: `CÓ THỂ PHONG TOẢ` giữ đến hết cảnh (6,48 s, trước tắt 5,20 s); `CƠ QUAN` vẫn tắt 3,35 s; text_groups giữ 2. Thẻ giải trình ở S04 KHÔNG có nhãn chữ (giữ quyết định review r1/r2: thẻ giống hệt S00, đã gọi tên ở S00, hình tự đọc).
- Bỏ bốn nhãn theo review (S04 nay chỉ còn nhãn thẻ giải trình theo script). S04 dùng thẻ avatar và dấu hỏi hướng ô tên, S05 dùng dải icon thẻ có vạch giới hạn, S06 dùng chip cảnh báo nét đứt và hình thanh phạt, S08 dùng bong bóng hội thoại có dấu lưu. Các cảnh giữ tối đa ba cụm chữ đồng thời, tính cả header.
- Đếm theo khoảng trắng trên toàn bộ semantic_plan.texts, mỗi mục một lần, không tính header và phụ đề. Kết quả 53 từ / 56,54 s = 56,2 từ/phút, cao hơn ngưỡng thử vì giữ nguyên 13 từ của tin nhắn giả lập và tiêu đề đã duyệt ở hook. Riêng nhãn, từ khoá, số và thông điệp còn lại là 40 từ = 42,4 từ/phút.
- Chủ đề nền theo stage gồm office 29,5%, database 14,3%, incident 13,1%, security 32,4% (S07 dùng bố cục đối chiếu), solution 10,6%. Tối đa ba cảnh liền cùng stage. S08 dùng sân khấu lưu bằng chứng xanh bạc hà thay cho bàn ấm.
- S09 dùng thumbs_up từ 5,16 đến 6,75 s, rời ngay trước khi bong bóng mời trả lời nở. Cáo xuất hiện 10,68 s (18,9%), cao hơn mục tiêu thử 15%.
- Claude (Gỡ vướng lần 4, 21/11/2026, đóng vai Đạo diễn hình ảnh): thêm Cáo `think` 1,0 s ở S08 (0,15–1,15 s), rộng 120 px, x≈16–136, đáy ≤1290, ngoài điện thoại/sơ đồ/phụ đề/header, làm nhịp chuyển ý giữa theo Y2. Cáo tổng ≈ 11,68 s / 48,81 s ≈ 23,9% (≤ 25%). Chỉ đổi `character_action` S08; giọng, thời lượng, sự kiện giữ nguyên.
- Khung 360×640 và âm thanh sẽ được kiểm trên bản dựng.

## Retime theo giọng thực đo (rescue 21/11/2026)

Chỉ đổi mốc, không đổi thiết kế, lời hay trạng thái APPROVED. L02 vào 3,06 s (không phải 3,93), nghỉ nối L01→L02 0,20 s (≥ đệm R23 0,16 s); cắt nội bộ S00 3,25 s, Cáo surprised 3,35 s; ba pha opening và tiêu đề 5,10 s giữ nguyên. Mỗi cảnh S03–S09 co về: cuối lời + giữ-sau-lời đã duyệt; S09 lời dứt 6,34 s, đuôi im 0,60 s, bong bóng mời trả lời nở 6,25 s.

## Đề nghị sửa kịch bản

Giữ “TÊN AI TRÊN GIAO DỊCH?” đúng cột “Chữ trên màn hình” S02. Đề nghị Claude xem xét “TÊN NGƯỜI NÀO TRÊN GIAO DỊCH?” ở vòng duyệt kịch bản để tránh đọc nhầm “AI” là trí tuệ nhân tạo.
