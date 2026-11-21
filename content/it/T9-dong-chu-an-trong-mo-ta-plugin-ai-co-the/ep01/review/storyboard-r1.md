# Review storyboard IT-T9-E01 · vòng 1 (GIÁM ĐỐC trả T9 bản đầu, 19/11/2026 chiều)

Storyboard v1 (27 cảnh, APPROVED theo luật cũ) lưu ở `review/_truoc-d8/storyboard-v1.json`; nay `DRAFT`. Căn cứ: `brief.md` (bổ sung 19/11/2026 chiều), `docs/audit-T9.md`, `docs/chat-luong-xem.md` D8, `docs/motion-components.md`. **Sau khi kịch bản được sửa xong** (cảnh S00 opening, mốc mới, bảng nhãn), làm lại storyboard theo kịch bản mới — sửa bản v1, giữ phần đúng.

## Việc phải làm
1. **Cảnh opening riêng** (`opening` với `scene_id` S00, `voice: false`, `duration_s` 1–3): thumbnail động — tiêu đề video lớn (≥ 84 px, ≤ 8 từ, ≤ 2 dòng) + `topic`, animation/camera, âm báo ngắn; **không** gộp vào cảnh hook; `animation` mô tả rõ.
2. **Header xuyên suốt (R21):** `header` = `{text, title, slots}`, **bỏ `hidden_scenes`**; mỗi cảnh sau opening khai `header_slot` ∈ `top|top_left|top_right|above_captions` chọn theo bố cục để không đè sơ đồ/nhãn/Cáo/phụ đề; header ≥ 52 px, ≤ 9% khung. Ghi trong `quality_check`/`hold_reason` cảnh nào phải đổi ô và vì sao.
3. **Keyword thật sự có chữ (R22):** viết lại `semantic_plan.texts` cho **mọi** thuật ngữ/đối tượng được gọi tên (plugin, mô tả công cụ, dòng ẩn, tool poisoning, rug pull, quyền tối thiểu, ghim phiên bản, bản lưu/bản đang nạp…): `attach_to` thành phần mang nhãn, `appear_s` ≤ 0,5 s sau lời nhắc, `disappear_s` hợp lý; ≥ 80% cảnh có chữ minh hoạ, 20–45 từ/phút, ≤ 8 từ cùng lúc; thành phần được gọi tên có icon/hình nhận diện được (dùng `tools/motion/components.icon`: puzzle, document, lock, shield, key, extension…), không khối trừu tượng không tên (QC-03/QC-08 của bản đầu).
4. **Kinetic có chủ ý:** `effect: kinetic` ở keyword chính của cảnh trọng tâm (hook, cảnh High, câu trả lời, chốt): ≥ 1 lần/25 s, ≤ 1/cảnh, không hai cảnh liền, cách nhau ≥ 6 s. Ví dụ chuẩn của giám đốc: “DATABASE OVERLOAD”/“HIGH LATENCY” gắn đúng thành phần — tìm tương đương cho “dòng ẩn”, “tool poisoning”, “rug pull”…
5. **R12:** bảng chủ đề nền từng cảnh, ≤ 4 cảnh liền cùng chủ đề, mỗi chủ đề ≤ 40% (bản đầu `security` 11 cảnh liền; `code` 5 cảnh liền). Cáo ≲ 15% thời lượng, nhỏ, đầu/cuối/chuyển ý.
6. Giữ nguyên: Information Pacing (low/medium/high, giữ sau lời), semantic_plan đối tượng→hình, camera đa dạng, phụ đề lớp riêng 56 px dải dưới, không nhãn «AI tạo»/«Ví dụ dựng».
7. Tự kiểm D8 với số cụ thể (visual-director sẽ đối chiếu `visual-director.md` mục 5b) và ghi bảng tóm tắt (số cảnh có chữ, từ/phút, số kinetic và mốc, chủ đề nền theo cảnh, header_slot theo cảnh).

KẾT LUẬN: CẦN SỬA
