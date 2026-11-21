# IT-T8-E01 · Đường đi của bản sao

**DRAFT · Vòng 1 · 10 cảnh · 41,90 s · Pillow + FFmpeg**

| Cảnh | Mốc | Bối cảnh và khung | `scene_type` | Điều người xem thấy |
|---|---|---|---|---|
| 01 | 0,00–4,00 s | A · office · trung | `object_interaction` | Cáo thấy hồ sơ nhân đôi. Hai góc cam tách rõ ở 1,80 s, bản gốc nằm trong chat. |
| 02 | 4,00–8,03 s | E · incident · cận | `cinematic_close_up` | Khe máy chủ nhận bản sao tại 4,00 s. Ô hồi chiếu cho thấy bản gốc vẫn trong chat. |
| 03 | 8,03–12,14 s | B · security · toàn | `ui_simulation` | Hai thẻ hiện lần lượt. Con trỏ chọn đúng thẻ có Featured và mở hộp quyền. |
| 04 | 12,14–16,29 s | B · security · cận | `ui_simulation` | Tấm quyền phủ tab chat. Lúc 13,00 s, bản sao tách tại biểu tượng tiện ích. |
| 05 | 16,29–19,41 s | C · code · toàn | `comparison_scene` | Xung trơn đi thẳng tới chatbot. Chỉ bản sao góc cam rẽ qua tiện ích và vào khay. |
| 06 | 19,41–24,98 s | C · code · trung | `process_animation` | Vòng đếm hết một chu kỳ. Nội dung chat và thanh địa chỉ cùng rời khay. |
| 07 | 24,98–28,72 s | D · security · toàn | `ui_simulation` | Mở hai mục kiểm rồi bấm Gỡ. Hàng có biểu tượng tiện ích biến mất khỏi danh sách. |
| 08 | 28,72–32,66 s | E · incident · cận nghiêng, tiến máy | `cinematic_close_up` | Lượt tiếp dừng tại đường đứt. Khay hé và cú tiến máy làm rõ bản cũ vẫn ở đích. |
| 09 | 32,66–35,93 s | A · office · toàn | `object_interaction` | Ba thẻ đổi hướng tại mép chat và nằm trong khay ngoài có viền xanh. |
| 10 | 35,93–41,90 s | A · office · trung | `object_interaction` | Cáo chốt bên bàn. Hai mục kiểm mở trước nút cài, hồ sơ vẫn ở ngoài chat. |

## Điểm cần đối chiếu khi duyệt

- **Mạch hình.** Bản sao tách ở 1,15 s, máy chủ nhận ở 4,00 s và điểm rẽ tại tiện ích hiện ở 13,00 s. Luồng xanh ở 05 giữ mờ và chỉ mang xung trơn. Hồ sơ góc cam đi theo nhánh đỏ. Nhịp kết đưa người xem về đúng mặt bàn, với hồ sơ ở ngoài chat.
- **Bối cảnh.** A và E trở lại lần hai với trạng thái đã đổi. B và C mỗi nền xuất hiện một lần, qua hai cỡ khung trong cùng lượt. D là trang quản lý riêng. A chiếm nhiều nhất, 13,24 s theo các mốc giây và 397 khung sau làm tròn biên sang khung, xấp xỉ 32%.
- **Cáo và chữ.** Ba pose ở 01, 04 và 10 chiếm khoảng 33,7% thời lượng. Thời lượng chỉ đứng nói là 0%. Cảnh 03 bỏ “Miễn phí” theo góp ý review kịch bản. Nút được chọn thuộc thẻ có “Featured”. Cảnh 04 giữ đúng dòng quyền trong một nhóm UI hai dòng. Cảnh 09 dùng hình chìa gắn với ổ khóa số để gợi nghĩa của lời “khóa”.
- **Dựng và đo.** Pillow ghép năm nền và đạo cụ. Cảnh 04 phóng riêng thẻ quyền. Camera cảnh 08 tiến 1,00× đến 1,12× vào bản cũ trong khay, rồi FFmpeg ghép phụ đề sau crop. Lấy bìa ở 1,80 s và rà ở 180×320. Các mốc lời và nghỉ cần đối chiếu với TTS thật trước khi dựng chính thức.
