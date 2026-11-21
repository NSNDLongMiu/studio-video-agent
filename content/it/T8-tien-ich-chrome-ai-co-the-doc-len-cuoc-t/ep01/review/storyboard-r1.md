# Review storyboard IT-T8-E01 · vòng 1 (Claude, Đạo diễn hình ảnh)

Bản duyệt: 10 cảnh, 41,90 s (TB 4,19 s/cảnh), renderer `pillow-ffmpeg`, talking-head 0%.

| # | Tiêu chí | Kết quả | Ghi chú |
|---|---|---|---|
| 1 | Show, don't tell | Đạt | Mọi cảnh có minh hoạ thật, `main_change` là sự kiện (bản sao tách, khe hứng, quét quyền, rẽ nhánh, hàng biến mất, đường gãy, ba thẻ bị chặn). Không nhãn «AI tạo»/«Ví dụ dựng» trên hình (chỉ ở mô tả đăng). Chữ UI khớp cột "Chữ trên màn hình" của script; 03 bỏ "Miễn phí" đúng góp ý script-r1 (hợp lệ, giảm còn 2 nhóm). |
| 2 | Đa dạng | Đạt | Cỡ cảnh: medium, close, wide, close, wide, medium, wide, close, wide, medium: không 3 liền giống nhau. Bối cảnh A/E/B/B/C/C/D/E/A/A: 5 bối cảnh, lớn nhất A 13,24 s (31,6%, dưới 40%), tối đa 2 cảnh liền. Có cảnh theme `code` (05–06). `environment` đủ xa/giữa/gần, ánh sáng. R4: mọi khoảng giữa hai mốc đổi ≤ 1,4 s; không cảnh tĩnh > 2 s. R11: 04 chứng minh thủ phạm là tiện ích (quét phủ tab chat, bản sao sinh đúng tại biểu tượng tiện ích lúc 13,00 s) và 05 đối chiếu hai tuyến; 02 nạn nhân là hồ sơ vừa dán. |
| 3 | Khớp kịch bản | Đạt | Mạch tình huống → hệ quả (4,00 s) → giải thích (13,00 s) → xử lý đúng Y5. Bản đồ Cáo khớp phán quyết và plan: `surprised` (01, mở), `point_right` (04, giữa), `thumbs_up` (10, kết), 14,12 s = 33,7%, ba pose cách nhau ≥ 2 s, 216 px (20%) ở 01/04, 302 px (~1,45×) ở 10. "Talking-head 0%" là đúng: Cáo có mặt đủ ba nhóm nhưng luôn có hành động và vật chính. Đuôi im 0,50 s ≤ 0,7. Nghỉ Y7 gắn với sự kiện hình. |
| 4 | Dựng được | Đạt có điều kiện | `renderer_reason` nêu rõ vì sao component Remotion không đáp ứng (nền tối cố định, thiếu composition). Camera chỉ khai ở 08 (push_in 1,00×→1,12×, ≤ 1,3×, có mục đích nhấn bản cũ, có cách dựng zoompan trên khung 2160×3840, phụ đề ghép sau crop). Ba pose có thật (surprised, point_right, thumbs_up), không dáng ngoài kho. |
| 5 | Đúng schema | Đạt | Đủ trường bắt buộc; `main_change`, `text_groups`, `quality_check.text_repeats_voiceover` = false, `change_visible_at_360` = true, `renderer` + `renderer_reason` đều có. `hold_reason` không cần (không cảnh tĩnh > 2 s). Enum hợp lệ. |

## Điều kiện bắt buộc cho Producer (không sửa lời, không sửa cấu trúc cảnh)
1. **Đo chữ trước khi dựng (04, 06).** Dòng "Đọc và thay đổi dữ liệu" ở Segoe UI Semibold 56 px trong thẻ rộng 640 (còn 586 px sau lề) rất sát hoặc tràn; "Nội dung chat" / "Địa chỉ trang" 56 px trong thẻ 400 (còn ~364 px) cũng sát. Dùng `ImageFont.getlength` đo thật; nếu tràn thì tăng bề rộng/chiều cao thẻ trong vùng an toàn x90–990 hoặc ngắt dòng (ví dụ 3 dòng ở 04), không giảm dưới 56 px. Ghi kết quả đo vào `notes.md`.
2. **Ô hồi chiếu 02** (x95–320, hiện 0,8 s) ở 360×640 chỉ còn ~75 px: phải đọc ra "bong bóng chat + hồ sơ góc cam". Tăng rộng ≥ 300 px nếu cần hoặc, nếu vẫn không rõ, bỏ ô vì 01 đã cho thấy bản gốc đứng yên. Không thêm chữ.
3. **Khay gom ở 05–06 phải cùng hình/tông với khay máy chủ ở 02 và 08** (cùng khe, gờ, tông xanh xám E) để người xem hiểu "đi ra máy chủ ngoài" và 08 "bản cũ còn bên ngoài" tiếp nối đúng.
4. **R5 cảnh 01:** hồ sơ chỉ 270×315 px; giữ cụm chat + hai thẻ đủ ~560 px chiều cao hiệu dụng khi lấy bìa 1,80 s, rà ở 180×320 (góc cam và mặt Cáo phải rõ). Nếu lệch, ghi lý do vào `notes.md`.
5. **Sau đo TTS** điều chỉnh mốc 4,00 s (cắt 01→02, câu hỏi bắt đầu ~3,08 s) và 13,00 s giữ đúng thị giác; không tăng tốc giọng để bù; tổng ≤ 45 s.
6. Khi dựng, cảnh nào sau đo thấy không đạt R4 ở 360×640 thì ghi `notes.md`; không khai thêm camera ngoài 08.

KẾT LUẬN: DUYỆT
