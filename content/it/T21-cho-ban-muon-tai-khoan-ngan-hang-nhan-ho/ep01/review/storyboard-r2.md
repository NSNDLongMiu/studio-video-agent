# Review storyboard IT-T21-E01 · vòng 2 · Claude

Tự đối chiếu trên `storyboard.json` (8 cảnh: S00 8 + S03 8,11 + S04 7,43 + S05 5,9 + S06 5 + S07 7,43 + S08 6 + S09 8,67 = 56,54 s, trong 45–75 s), `script.md`, `qc-thresholds.json`. Không dùng lời Codex để kết luận.

## Kiểm điểm r1

| # r1 | Kết quả | Bằng chứng |
|---|---|---|
| 1 Lời opening vào 0,60 s | Đã sửa | L01 `pause_before_s` 0,6, `pause_after_s` 0,1; L02 before 0,1, after 0,9; L02 vào ≈ 3,93 s, cắt 4,10 s, tiêu đề 5,10 s, opening đúng 8 s; sound_cues khớp mốc. |
| 2 Khoảng giữ R13 | Đã sửa | S03 hold 2,0 (High); S04 1,0; S07 1,0; `duration_s` và `hold_s` đồng bộ. |
| 3 Giảm chữ | Đã sửa một phần | Bỏ `YÊU CẦU GIẢI TRÌNH` S04, `DƯỚI 10 TÀI KHOẢN`, `CÓ THỂ BỊ PHẠT`, `TIN NHẮN`; thay bằng hình (chuỗi chín ô, chip không chữ). Xem mục mật độ chữ. |
| 4 Stage S08 | Đã sửa | `solution`; office = S00 + S09 = 16,67 s = 29,5%; security (S05–S07) 32,4%, tối đa 3 cảnh liền; database 14,3%, incident 13,1%. |
| 5 Cáo S09 | Đã sửa | thumbs_up 5,16–6,75 s; Cáo tổng ≈ 10,8 s ≈ 19% (≤ 25%, mục tiêu 15% chưa chạm, chấp nhận). |
| 6 storyboard.md | Đã đồng bộ | Có ghi chú đếm chữ và đề nghị tiêu đề. |

Không phát sinh lỗi mới: header_slot các cảnh sau opening đổi ô, không liền cảnh trùng ô; không 3 cảnh liền cùng cỡ/bố cục; đuôi im S09 0,6 s (≤ 0,7); chữ đồng thời đỉnh 8 từ tại 5,1 s (tiêu đề 5 + nhãn 3, đúng ngưỡng); không tên bốn nền tảng thật, không hình đồ ăn/dép (grep sạch); hệ quả luôn "có thể", mức phạt chỉ nối với "cho mượn".

## Bảng chấm

| # | Tiêu chí | Kết quả | Ghi chú |
|---|---|---|---|
| 1 | Show, don't tell / visual-first | Đạt | Mọi cảnh có hình thật và semantic_plan; hơn 70% keyword có hình. |
| 2 | Đa dạng, nhịp | Đạt | 8 cảnh, trung bình 7 s; kinetic ≤ 1/cảnh; R12 đủ ≥ 3 bối cảnh; không cảnh theme `code` vì chủ đề không phải phần mềm. |
| 3 | Khớp kịch bản | Đạt | Mạch Y5 đủ; mốc lời đúng; opening có lời hook vào 0,6 s. |
| 4 | Dựng được | Đạt | pillow-ffmpeg có lý do; crop ≤ 1,16×; pose Cáo có thật. |
| 5 | Schema | Đạt | Đủ trường bắt buộc. |
| 5b | D8 | Đạt có ghi rủi ro | (a)(b)(d) đạt; (c) xem dưới. |

## Mật độ chữ minh hoạ (tự đếm)

Đếm khoảng trắng trên toàn bộ `semantic_plan.texts` (không header, không phụ đề): S00 17 (TIỀN NHÀ 2, tin nhắn 7, YÊU CẦU GIẢI TRÌNH 3, tiêu đề 5) + S03 9 + S04 6 + S05 5 + S06 5 + S07 3 + S08 4 + S09 3 = **52 từ / 56,54 s ≈ 55 từ/phút** (Codex đếm 53 và 56,2; lệch do cách tính "100–150"). Vượt trần 45 khoảng 10 từ/phút.

Quyết định: **chấp nhận (b), không đòi vòng 3.** Lý do cụ thể:
- Phần vượt là chữ kịch bản đã duyệt đòi hỏi: tiêu đề opening 5 từ (R14/R26) và tin nhắn giả lập 7 từ (sự cố của hook, nội dung của đạo cụ, không phải nhãn). Bỏ hai mục này còn 40 từ = 42,4/phút, trong khoảng 20–45.
- Mọi nhãn còn lại gắn đối tượng, được gọi tên trong lời; bốn nhãn thừa ở r1 đã bỏ. Bỏ thêm sẽ đụng các thuật ngữ cơ chế (NGHI LIÊN QUAN, CÓ THỂ PHONG TOẢ) hoặc nhãn gọi tên đối tượng, làm hình kém tự đọc.
- Ngưỡng là "ngưỡng thử" (qc-measure phát cảnh báo WARN, không chặn). Tin nhắn mờ đi tại 2,5 s nên đỉnh đồng thời vẫn ≤ 8 từ.
Rủi ro cho QC: đo trên chữ vẽ thật, nếu tính cả tin nhắn và tiêu đề sẽ báo ≈ 55 từ/phút (WARN); QC ghi rõ nguyên nhân, không coi là lỗi dựng. Nếu muốn giảm thêm mà không đụng kịch bản: thu tin nhắn xuống chữ nhỏ mờ (UI), không thêm chữ mới.

## Lưu ý cho Sản xuất và QC

1. **Kinetic gần nhau:** tiêu đề S00 (hiệu ứng `kinetic`, 5,10 s) và `NGHI LIÊN QUAN` S03 (9,6 s tuyệt đối) cách 4,5 s < `kinetic_min_gap_s` 6 s, hai cảnh liền nhau; Sản xuất nên dựng tiêu đề chỉ là một lần trượt vào, không thêm hiệu ứng nhấn, QC kỳ vọng WARN nhẹ nếu vẫn bị đếm.
2. Lời opening phải đo lại sau TTS: L01 vào ≥ 0,6 s, L02 ≈ 3,93 s; nếu lệch, dịch cắt nội bộ 4,10 s theo lời, không tăng tốc.
3. Ảnh nền N1 (S00 + S09) là việc ẢNH-BRIEF; không có ảnh thì dùng `make_background.py office` như đã khai.
4. Giữ đuôi im S09 0,6 s, đỏ luôn nét đứt, vòng xanh trở về bằng tua ngược.

## Đề nghị sửa nhỏ ở kịch bản (không chặn, không tự sửa script.md)

Tiêu đề `TÊN AI TRÊN GIAO DỊCH?` dễ bị đọc là "AI" trí tuệ nhân tạo trên kênh IT. Đề nghị chữ thay thế, vẫn 5 từ nên không đổi mật độ chữ: **`GIAO DỊCH ĐỨNG TÊN AI?`** (hoặc `TÊN NGƯỜI NÀO TRÊN GIAO DỊCH?`, 6 từ). Người điều phối quyết khi rảnh; nếu đổi thì chỉ thay chuỗi ở `opening.title`, `semantic_plan.texts` S00 và `script.md`/`storyboard.md`. Giữ nguyên cũng chấp nhận được vì "ai" ở đây là đại từ nghi vấn và ngữ cảnh "giao dịch" đủ rõ.

KẾT LUẬN: DUYỆT
