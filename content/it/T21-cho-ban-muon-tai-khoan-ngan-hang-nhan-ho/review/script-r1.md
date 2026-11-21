# Kịch bản IT-T21-E01 · chốt bản 1 (Claude, 21/11/2026)

## Xử lý đề xuất của Codex

| Đề xuất | Kết quả | Lý do |
|---|---|---|
| S04/L05 nêu điều kiện văn bản | NHẬN | Điều 11 NĐ 52/2024 (bản vksndtc.gov.vn) nêu "quyết định hoặc yêu cầu bằng văn bản của cơ quan có thẩm quyền". Lời 05 đổi thành "Theo văn bản của cơ quan có thẩm quyền, tài khoản có thể bị phong toả." |
| S05–S06/L07–L08 thiếu phạm vi, dễ hiểu "nhận hộ một lượt là bị phạt" | NHẬN một phần | Thêm nhãn `DƯỚI 10 TÀI KHOẢN` ở S05. L08 đổi thành "Cho mượn một tài khoản, dù chỉ một lần, cũng có thể bị phạt." (giữ "có thể"). Không dùng "thanh toán" vì thêm âm tiết mà không thêm hiểu. |
| S07/L10 "tên người nhận" mơ hồ | NHẬN | L10 đổi thành "Tiền chuyển đi rồi, lượt tiền vào vẫn mang tên mình." Thẻ giao dịch là lượt tiền vào, như S03. |
| S09/L12 "Luật cấm" quá rộng | NHẬN | Không mở được Điều 8 NĐ 52/2024. Đổi thành "Có khung phạt." (đã có nguồn). |
| S09 thẻ biến mất và vòng về xanh ngay sau lời từ chối ngụ ý gỡ phong toả | NHẬN | Dùng cú tua ngược về khung S01 (47,50–47,65 s), vòng xanh do "chưa nhận lời". |
| L03 viết lại | NHẬN | "Tiền nhận hộ có thể liên quan đến lừa đảo." Khớp nhãn NGHI LIÊN QUAN. |
| L04 viết lại | NHẬN một phần | Giữ "sang người nhờ" để nhãn NGƯỜI NHỜ có lời đỡ: "Tiền đi tiếp sang người nhờ, lượt tiền vào vẫn mang tên mình." (13 âm tiết, không đổi nhịp). |
| L05 viết lại | NHẬN có đổi thứ tự | Đặt điều kiện văn bản trước, hệ quả sau; hình bám theo. |
| L08 viết lại | NHẬN có sửa | Xem trên. |
| Đổi thứ tự cảnh S03 → S05 → S06 → S04 | BÁC | Phá mạch phong toả → giải trình → phạt và mốc vòng trạng thái. Khung phạt ở ≈ 26 s vẫn trong chuẩn 45–75 s. Đã ghi vào plan.md. |
| S03 giữ sơ đồ ≥ 2 s | BÁC nhẹ | Giữ 1,89 s (đã ghi chấp nhận). Nếu sau TTS dư thì cộng vào đây. |
| Bằng chứng hình S04: ngân hàng nhận văn bản, khoanh số dư | BÁC | Giữ hình "cơ quan → tờ văn bản → khoá nét đứt trên thẻ". Thêm biểu tượng ngân hàng làm thêm một nút và tăng chữ. Dấu hỏi tới ô tên Cáo trên thẻ giải trình đã có. |

## Xử lý kiểm chứng của Gemini (chạy bằng mô hình dự phòng)

| Dòng | Kết quả | Lý do |
|---|---|---|
| Lời 03, 04 ĐÚNG | NHẬN có điều kiện | Nguồn Gemini chỉ là tên miền gốc, không kiểm được. Đã tự đối chiếu bằng nguồn 2 trong script (Cục An ninh mạng, CafeF). Lời 04 chỉ dựa cơ chế, không nêu điều luật. |
| Lời 05 ĐÚNG, nhưng dễ hiểu sai "báo là khoá" | NHẬN | Sửa như trên. Không nhận câu của Gemini "báo án" vì tự thêm chi tiết chưa có nguồn. |
| Lời 06 ĐÚNG (Điều 85 BLTTHS) | NHẬN mức mềm | Không ghi điều luật. Nguồn là Bộ Công an 28/08/2026, chỉ nói tổng quát, giữ "có thể". |
| Lời 07 ĐÚNG, dễ hiểu sai chỉ "nhận hộ" | NHẬN | Mũi tên cam nối thanh phạt đã tách "cho mượn" với dòng tiền. Thêm nhãn phạm vi. Không thêm "người khác" vào lời. |
| Lời 08 dễ hiểu sai "nhiều lần" | NHẬN | Đã bỏ cụm "không cần nhiều lần". |
| Lời 12 ĐÚNG, "khoản 5 Điều 8 NĐ 52/2024" | CHƯA KIỂM ĐƯỢC, BÁC | Tìm kiếm cho thấy Điều 8 cấm cho mượn tài khoản (tóm tắt trên trang pbgdpl.cantho.gov.vn), một nguồn khác dẫn khoản 5 và 8 cho việc xử lý chủ tài khoản; không mở được văn bản gốc để xác nhận số khoản. Bỏ "Luật cấm". |
| Mô tả đăng (100–150 triệu, từ 1 đến dưới 10 tài khoản, từ 09/02/2026) | NHẬN | lsvn.vn và CafeF cùng mức; lsvn.vn nói rõ mức này cho cá nhân, tổ chức gấp đôi. |
| Ba câu mở của Gemini | BÁC | Vi phạm ràng buộc phán quyết ("khoá sạch tiền", "công an mời giải trình", "phạt trăm triệu" gắn một lần nhận). Giữ opening hiện tại. |

Không có dòng SAI. Dòng CHƯA XÁC MINH còn lại: Điều 8 NĐ 52/2024, số khoản/điểm của Điều 30 NĐ 340/2025 (ghi vào plan.md, mục việc giám đốc nên làm).

## Nguồn tự mở trong lượt này
- Điều 11 NĐ 52/2024: https://vksndtc.gov.vn/tin-tuc/nghi-dinh-quy-dinh-ve-thanh-toan-khong-dung-tien-m-t12195.html (mở được, điều kiện văn bản).
- Điều 30 NĐ 340/2025 (cá nhân, 100–150 triệu, tổ chức gấp đôi, chưa đến mức hình sự): https://lsvn.vn/phat-toi-da-den-200-trieu-dong-khi-cho-muon-tai-khoan-ngan-hang-a168035.html (mở được, là bài tóm tắt, không có nguyên văn khoản).
- Điều 8 NĐ 52/2024: chưa mở được (bản pbgdpl.cantho.gov.vn trả 404).

## Chấm 6 tiêu chí

| # | Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Bám phán quyết | Đạt | Tình huống bạn thân nhờ nhận hộ ở S01, hệ quả hiện trước 2,4 s; mức phạt chỉ đứng cạnh "cho mượn" (L07); mọi hệ quả ở dạng "có thể". |
| 2 | Giữ chân | Đạt | Opening 8,0 s (S01–S02), câu hỏi treo 1,0 s, trả lời ở ≈ 8,2 s; vòng trạng thái xanh → vàng → đỏ nét đứt → xanh, kết trả đúng chỗ; chuẩn 45–75 s, 9 cảnh ≈ 6,2 s/cảnh; chiều sâu đủ 6 câu hỏi. |
| 3 | Đủ chi tiết cho Producer | Đạt | Mốc lời, ngân sách, `voice_direction` theo line_id, bản đồ ngữ nghĩa đã cập nhật cho L05, L08, L10, L12; mọi nhãn đều có lời đỡ (CÓ THỂ BỊ PHẠT, 1 LẦN mới). |
| 4 | Chính xác | Đạt, kèm điều kiện | Các số liệu then chốt đã đối chiếu 2 nguồn; Điều 8 và số khoản Điều 30 ghi rõ là chưa soi văn bản gốc, lời đã làm mềm. |
| 5 | Làm được và an toàn | Đạt | Không tên ngân hàng/logo, không nhãn thừa, tên nền tảng không xuất hiện, khai báo AI ở mô tả. |
| 6 | Văn phong | Đạt | Tiếng Việt chuẩn, xưng "mình", gọi "bạn"; không doạ. |

Ghi chú nhỏ không chặn: cú tua ngược S09 cần Đạo diễn hình ảnh làm đơn giản (vệt sáng chạy ngược, không chữ); thời lượng S03 giữ 1,89 s, canh lại sau TTS.

## Việc còn phải sửa
Không có.

KẾT LUẬN: DUYỆT
