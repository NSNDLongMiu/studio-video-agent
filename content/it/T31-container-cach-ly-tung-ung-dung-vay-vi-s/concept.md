# Concept — IT-T31-E01 · "Vá web xong, còn lớp nào?"

## Concept đã chốt (theo "Phán quyết cuối" của `debate.md`)
Bản lai theo **Codex 3 "Vá web, còn lớp nào?"**, ghép **cảnh sự cố sớm** (Claude A: hộp bên cạnh đổi màu trước giây 5) và cách nói **"nhân dựng tường"** (Gemini 2). Hook ở việc người trực làm hằng ngày: vá nginx rồi đóng ca. Không dùng CVE, CVSS, tên SCTP, số máy, tình trạng bản vá nhân trong lời và hình (phán quyết + brief).

**Lý do chọn (rút từ phán quyết):** hook nằm ở thói quen thật của dev/SA/DevOps/sysadmin; giữ đúng ranh giới brief ("chưa đủ dữ kiện để khẳng định lên root"); kết bằng việc làm cụ thể; một cơ chế duy nhất.

## Đối tượng
Dev, SA, DevOps, sysadmin (độ sâu trung bình). Người ngoài nghề vẫn theo được nhờ hình: hộp, tấm nền, bức tường.

## Giọng điệu
Cáo văn phòng: xưng "mình", gọi "bạn", câu ngắn một ý, chữ văn phòng vừa đủ ("đóng ca"). Cân bằng, không FUD: container vẫn có ích, đánh đổi là cái giá của sự nhẹ và nhanh. Không chê người xem.

## Lời hứa của video
Sau ~15 giây bạn biết câu "bị chiếm thì chỉ mất cái hộp" sai ở đâu; sau ~58 giây bạn biết cần vá những lớp nào và vì sao.

## Cơ chế duy nhất
Mọi container trên một máy chạy **chung một nhân Linux**; "bức tường" giữa chúng do chính nhân đó dựng, nên lỗi ở nhân là lỗi của bức tường. Máy ảo (có nhân riêng) chỉ để **đối chiếu** 5,5 s, không giảng sâu. Bỏ namespace/cgroup (vượt một cơ chế).

## Hook đã chọn (ghi để theo dõi kiểu nào giữ chân)
Kiểu "tình huống + hệ quả": Cáo cạnh bảng trực, hộp web chuyển xanh "ĐÃ VÁ", hộp bên cạnh đổi vàng, ô "NHÂN" trống. Lời hook: "Vá nginx xong rồi, đóng ca nhé? Khoan. Hộp bên cạnh sao đổi màu?"

## Ích lợi đầu tiên (trước giây 5)
Giây 2,6–4,6: thấy hộp bên cạnh đổi màu dù mới vá một hộp = "vá ứng dụng chưa chắc là xong". Tiêu đề opening (giây 4,6–6,0): "Lớp nào chưa vá?".

## Câu hỏi mở → trả
- Mở: giây ~9,6 "Câu này sai ở đâu?" (sau niềm tin sai "bị chiếm thì chỉ mất cái hộp đó thôi").
- Trả (ý chính): giây ~12–16: "các container chạy trên cùng một nhân Linux. Nhân dựng bức tường giữa chúng."
- Trả đầy đủ + việc làm: giây ~48–51: "Vá nginx, rồi vá cả nhân máy chủ khi có bản. Xong hết hãy đóng ca."

## Mạch Storytelling – Problem – Explanation – Solution
Storytelling (S01–S02, 0–11,5 s): đóng ca sau khi vá, hộp bên cạnh đổi màu. Problem (S02): niềm tin sai. Explanation (S03–S05, 11,5–30,5 s): nhân chung, lỗi nhân có thể làm tường yếu đi, đối chiếu máy ảo. Ví dụ thời sự (S06–S07, 30,5–42 s): bộ lỗi nginx mới công bố. Đánh đổi (S08). Solution (S09–S10, 47,5–58 s): vá nginx rồi vá nhân khi có bản, rồi đóng ca; kêu gọi.

## Kết giải quyết vấn đề mở đầu + kêu gọi tự nhiên
Bảng trực quay lại: ô NGINX và ô NHÂN cùng tick xanh, hộp bên cạnh về xanh, rồi mới gạt công tắc "đóng ca" (trả hook). Cáo hỏi: "Nhân máy chủ của bạn, vá lần cuối khi nào? Gõ xuống bình luận nhé." Chữ chốt: "NGINX + NHÂN".

## Bộ câu thoại Cáo dùng cho video (ví dụ theo phán quyết, đã chỉnh cho ngân sách thời lượng)
- "Vá nginx xong rồi, đóng ca nhé?"
- "Khoan. Hộp bên cạnh sao đổi màu?"
- "Nhiều bạn nghĩ: bị chiếm thì chỉ mất cái hộp đó thôi. Câu này sai ở đâu?"
- "Nhân dựng bức tường giữa chúng." / "Lỗi nhân có thể làm tường yếu đi."
- "Vá nginx, rồi vá cả nhân máy chủ khi có bản. Xong hết hãy đóng ca."
- "Nhân máy chủ của bạn, vá lần cuối khi nào?"

## Ranh giới nội dung (brief, bắt buộc)
1. KHÔNG khẳng định nginx2root cho quyền root ngay: bước lên root cần thêm một lỗi nhân chưa công bố chi tiết, chưa được bên thứ ba tái hiện. Lời chỉ nói "bước tiếp theo liên quan tới nhân, chi tiết chưa công bố đầy đủ".
2. KHÔNG nêu số máy chủ bị ảnh hưởng; KHÔNG nêu tình trạng bản vá nhân.
3. KHÔNG tả cách khai thác; KHÔNG nêu CVE, CVSS, tên SCTP, tên giao thức/tính năng bị lỗi.
4. Hình ảnh: không logo nginx/Docker/Linux (chỉ chữ), không giao diện thật, không người thật.
