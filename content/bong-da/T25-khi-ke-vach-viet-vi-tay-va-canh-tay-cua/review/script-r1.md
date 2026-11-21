# Chốt kịch bản · BONG-DA-T25-E01 · vòng N=1 (21/11/2026)

Codex có cùng viết (`script-codex-r1.md`). Gemini kiểm chứng (mô hình dự phòng gemini-3.8-flash-high, `script-gemini-r1.md`). Tự mở nguồn: IFAB Luật 11 (https://www.theifab.com/laws/latest/offside/), đọc lại 21/11/2026: "It is not an offence to be in an offside position"; vị trí việt vị cần đầu/thân/chân ở phần sân đối phương và gần vạch gôn hơn cả bóng lẫn đối thủ áp chót; "The hands and arms ... are not considered"; "upper boundary of the arm is in line with the bottom of the armpit". Mới đọc đến ký tự 100.000/105.976, phần cuối không liên quan.

## Xử lý đề xuất của Codex

| Đề xuất | Quyết định | Lý do |
|---|---|---|
| Vạch qua đối thủ áp chót chỉ đủ khi bóng còn sau vạch; S09 thiếu thời điểm chuyền | NHẬN (hình) | Đúng Luật 11.1. Thêm biểu tượng bóng ở chân đồng đội, còn sau vạch, vào S06, S07, S09. Không đổi lời hook. |
| S07/L09 bỏ cờ đỏ, dùng chip vị trí | NHẬN | Phép thử chỉ chứng minh vị trí, không phải lỗi. Bỏ cờ và tiếng cờ; chip đổi `VỊ TRÍ VIỆT VỊ`. |
| S08/L10 "hay gặp" chưa có dữ liệu | NHẬN | Bỏ khẳng định mức phổ biến. |
| Viết lại L03 "Chỉ xét đầu, thân, chân. Tay và cánh tay không tính." | NHẬN có chỉnh | Giữ "Vạch" làm chủ ngữ: "Vạch chỉ xét đầu, thân, chân. Tay và cánh tay không tính." (12 âm tiết như cũ). Mốc lời/hình S03 viết lại, tổng cảnh 5,00 s không đổi. |
| Viết lại L09 "Vị trí việt vị. Vai đã qua vạch." | NHẬN một phần | Lấy "Vị trí việt vị", giữ "Chỏm vai cũng tính" (L08 đã nói "chỏm vai", "vai đã qua vạch" mơ hồ hơn). 8 âm tiết, mốc không đổi. |
| Viết lại L10 "Bạn đừng lấy mép tay áo làm mốc." | NHẬN | Thẳng thao tác cần tránh, 8 âm tiết. |
| Bằng chứng hình: khung dừng lúc chuyền, đầu/thân/chân sau vạch, riêng chỏm vai qua | NHẬN | S06 (cả người sau vạch), S09 (đầu, thân, chân xanh sau vạch) đã sửa. |

## Xử lý kiểm chứng của Gemini

| Dòng | Quyết định | Lý do |
|---|---|---|
| L03, L04, L11, mô tả đăng: ĐÚNG | NHẬN | Khớp nguồn tự mở. |
| L05 ĐÚNG NHƯNG DỄ HIỂU SAI | NHẬN, giữ | Đã gắn nhãn "Cách nhớ", plan ghi đây là mẹo, không phải lời luật. |
| L07/L12 thiếu "đầu" | NHẬN | L06: "Tay vươn qua vạch, cả người còn sau." L12: "tay thò qua, đầu, thân, chân còn sau." Gọi lại L03 nên không thừa. Giữ "Không việt vị" ở L07/L12 (không ở vị trí việt vị thì không có lỗi, đúng 11.1). |
| L09 vị trí khác lỗi | NHẬN | "Vị trí việt vị" (xem trên). Không dùng câu của Gemini "Đứng việt vị rồi" vì nghe như đã bị thổi. |
| Ba phương án mở đầu | BÁC | Phương án 1 nhắc VAR (brief cấm công nghệ), phương án 2–3 trùng hook đã chốt theo phán quyết (lời 01 "Ví dụ: bàn bị gạt, vì cái tay này?" khớp tốt hơn, có "ví dụ" lên lời). Không có dòng SAI hay CHƯA XÁC MINH. |

## Chấm 6 tiêu chí

1. Bám phán quyết: Đạt. Giữ concept, hook tình huống, đủ lời luật/cách nhớ/ví dụ đúng-sai; không năm, không công nghệ, không số đo.
2. Giữ chân: Đạt. Hook 3,0 s có hệ quả (S01 cờ đỏ 1,20 s), mở câu hỏi S02, trả sớm S03 (≈ 11 s), kết S09 trả đúng khung hook, cờ đổi đỏ → vàng → hạ. 10 cảnh, trung bình 5,7 s. Opening 7,8 s. S04 có kinetic, S07 chip nảy.
3. Đủ chi tiết cho Producer: Đạt. Bảng cảnh, mốc lời, voice_direction theo dòng, thuật ngữ Y8, bản đồ ngữ nghĩa đã cập nhật. Ghi chú: các mốc S03 và S06 đã chỉnh tay, đều đo lại sau TTS. Ngân sách không đổi (lời đổi giữ số âm tiết; L03 -0 và L06 ±0), tổng ≈ 57,0 s.
4. Chính xác: Đạt. Mọi khẳng định then chốt khớp IFAB 11; chỗ suy ra (vai tính, cách nhớ) đã ghi rõ trong Nguồn. Mục "vị trí vs lỗi" đã nêu ở Giả định 2.
5. Làm được & an toàn: Đạt. Toàn đồ hoạ renderer, không nguồn ngoài, không tên nền tảng thật, có câu khai báo AI trong mô tả.
6. Văn phong: Đạt. Câu ngắn, xưng "mình"/"bạn", tiếng Việt chuẩn.

## Còn lại (không bắt buộc)
1. Giám đốc/Sản xuất nghe và đo lại mốc S03, S06, S07 sau TTS; nếu vượt 72 s rút giữ S04/S07/S08.
2. Visual: cần chỗ vẽ biểu tượng bóng nhỏ ở S06, S07, S09 mà không thành chữ/hình thừa.

KẾT LUẬN: DUYỆT
