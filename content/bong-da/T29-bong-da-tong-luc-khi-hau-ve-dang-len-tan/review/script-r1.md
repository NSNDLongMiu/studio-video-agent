# Chốt kịch bản bản 1 — BONG-DA-T29-E01 (21/11/2026)

Codex vắng: không có đóng góp Codex ở bản 1 (`BUSY`, thử lại một lần vẫn BUSY). Chấm bản của Claude như bình thường.

## Chấm 6 tiêu chí

| # | Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Bám phán quyết | Đạt | Một cơ chế "ai gần ô nhất thì làm", hook "Hậu vệ lên tận đây. Ai giữ nhà?" (S01), câu Cáo "Gần ô, đừng gần bóng" giữ ý (thêm "Lấp ô:"). Không chào cố định. |
| 2 | Giữ chân | Đạt | Tình huống từ 0,60 s, hệ quả (mũi tên tím) 3,95 s, tiêu đề 5,24 s; trả lời sớm ở S03 (≈ 11 s); ô đổi đỏ/xanh ≥ 3 lần rồi S09 trả đúng khung S01; kết "Đá phủi thì hô: tôi lấp!". 10 cảnh, 57,7 s, opening 7,6 s, mỗi cảnh một ý, có đúng/sai (S06–S07), trước/sau (S08–S09), kinetic cách ≥ 6 s. |
| 3 | Đủ chi tiết Producer | Đạt | Bảng cảnh đủ cột, mốc lời, ngân sách (159 âm tiết, tổng ≈ 57,7 s), voice_direction L01–L16, bảng thuật ngữ (không có thuật ngữ Anh), Bản đồ ngữ nghĩa, bảng Chiều sâu, Cáo 4 cảnh (S02, S07, S10; ≈ 16–17%, góc dưới trái, theo R6). Chữ trên hình là nhãn, không chép lời. |
| 4 | Chính xác | Đạt (có ghi chú) | Tự mở 21/11: Wikipedia Total Football (thế chỗ, giữ vai trò đội hình); JSSM rest defense ("several players behind the ball", "no generally accepted definition", trung bình 3,70 hậu vệ); tìm kiếm tài liệu huấn luyện (FIFA Training Centre, FA Bootroom: áp sát/bọc lót/cân bằng). Không số liệu trong lời. |
| 5 | Làm được & an toàn | Đạt | Chỉ đồ hoạ vẽ bằng renderer, không ảnh người/áo/logo; mô tả có câu khai báo AI và "ví dụ dựng"; không tên thật bốn nền tảng; không nói ai phát minh. |
| 6 | Văn phong | Đạt | Tiếng Việt chuẩn, gọi "bạn", giọng dân đá phủi vui; cách đọc chờ giám đốc nghe. |

## Xử lý đề xuất Codex
Codex vắng, không có đóng góp Codex ở bản 1 (0 nhận / 0 bác).

## Xử lý kiểm chứng Gemini (mô hình dự phòng; URL do Gemini nêu, tôi tự mở nguồn riêng)

| Dòng | Kết quả Gemini | Xử lý | Lý do |
|---|---|---|---|
| Lời 04 | ĐÚNG NHƯNG DỄ HIỂU SAI; đề nghị "ai rời vị trí, đồng đội gần nhất trám vào" kèm tên huấn luyện viên | BÁC đề nghị, NHẬN mức ĐÚNG | Wikipedia (tự mở): "replaced by another", "roles consistently filled" ủng hộ "vị trí như nhiệm vụ". Giữ lời: cơ chế "ai gần ô nhất" là cốt phán quyết và hình S03–S05 đã cho thấy chỉ người phía sau lùi vào ô. Tên người cấm theo brief. Rủi ro "tiền đạo chạy về" được hạn chế bằng "Trong pha này" (L03) và sa bàn chỉ có người tuyến sau. Đã xoá `[CẦN KIỂM NGUỒN]` của L04. |
| Lời 06 | ĐÚNG | NHẬN | Không đổi. URL spielverlagerung tôi chưa mở; không dựa vào nó, lời chỉ là ví dụ dựng "trong pha này". |
| Lời 07–08 | ĐÚNG | NHẬN | Không đổi; là lỗi tình huống phổ biến, nêu dạng ví dụ dựng. |
| Lời 09–10 | ĐÚNG NHƯNG DỄ HIỂU SAI; đề nghị "Một người áp sát, người sau bịt ô." | NHẬN một phần | Cảnh báo hợp lý: tài liệu phòng ngự dạy một người áp sát, người sau bọc lót, nên "đừng gần bóng" trần trụi dễ bị hiểu là không ai áp sát. Sửa: "Gần ô, đừng gần bóng." → "Lấp ô: gần ô, đừng gần bóng." (phạm vi chọn người lấp ô). Bác câu thay thế vì mất câu nhớ của phán quyết và gắn hai nhãn `GẦN Ô`/`GẦN BÓNG`. Mô tả đăng thêm "khi cần lấp ô". |
| Lời 11 | ĐÚNG | NHẬN | JSSM tự mở: "several players behind the ball". Giữ "vài". Bác chi tiết "3+2, 2+3" của Gemini (bài không dùng ký hiệu đó). |
| Lời 12 | ĐÚNG; đề nghị "Hàng thủ lót sẵn ngay khi đang giữ bóng." | BÁC đề nghị | Mất chữ "ô" (nhãn chủ chốt) và "thường" (thận trọng theo JSSM). Giữ lời. |
| Ba phương án MỞ ĐẦU | gợi ý | BÁC | Hook hiện tại theo brief của giám đốc và phán quyết, đã đặt tình huống + hệ quả trước giây 5; phương án mới không nhanh hơn. |

SAI còn lại: 0. CHƯA XÁC MINH: 0 (chỉ L06 chưa tự mở nguồn riêng, không then chốt).

## Lời đã đổi
- Lời 10: "Gần ô, đừng gần bóng." → "Lấp ô: gần ô, đừng gần bóng." (+2 âm tiết ≈ +0,47 s, giữ S07 giảm 1,29 → 0,82 s; S07 vẫn 6,00 s, tổng ≈ 57,7 s). Đã đồng bộ script.md (bảng cảnh, mốc lời, ngân sách, voice_direction, mô tả đăng), concept.md, plan.md.

## Việc còn phải sửa
Không. Ghi chú không bắt buộc: Producer đo lại mốc sau TTS (nếu giữ S07 0,82 s quá chặt thì lấy bù ở S05 giữ 2,03 s); cách đọc "bóng đá tổng lực", "tiền vệ cánh", "đá phủi" chờ giám đốc nghe.

KẾT LUẬN: DUYỆT
