---
name: scout-topics
description: Vị trí core "Tìm chủ đề" của 1 đội - chỉ chạy khi phòng BẬT tự tìm chủ đề. Tìm chủ đề trong chủ đề chung của phòng, kèm lý do + nguồn, rồi ĐỀ XUẤT (propose_topic) để giám đốc duyệt. Worker nền gọi "/scout-topics <team_id>".
argument-hint: "<team_id>"
disable-model-invocation: true
---

Đối số: `$ARGUMENTS` = `<team_id>`.

> Chạy nền, không có người trả lời: không hỏi lại. **Chỉ đề xuất** — chủ đề chỉ được làm sau khi giám đốc duyệt; không gọi `assign_topic`, không xếp việc kế hoạch.

1. `report_status(team_id, role="scout", status="working", task="Tìm chủ đề")`.
2. `studio_overview` (lọc đúng phòng của đội) → đọc **"Chủ đề chung"** (mô tả phòng) và dòng **"Tự tìm chủ đề"**. Nếu đang **TẮT** → `report_status(..., "idle")` và dừng, báo "phòng đang tắt tự tìm chủ đề".
3. `list_topics(dept)` (mọi trạng thái: open, assigned, proposed, rejected) → **không đề xuất trùng hoặc gần trùng**, và tránh những hướng giám đốc đã từ chối.
4. Số chủ đề cần tìm = số suất trống hôm nay của đội trừ chủ đề đang chờ đội (dashboard/`studio_overview`); tối đa 3 mỗi lần. `propose_topic` sẽ báo khi đã đủ.
5. Tìm bằng WebSearch/WebFetch: chủ đề **nằm trọn trong chủ đề chung của phòng**, đang được quan tâm (tin mới, câu hỏi phổ biến, mùa vụ), hợp kênh **Cáo văn phòng** (`docs/mascot.md`), và **làm được** bằng công cụ trong `docs/asset-sources.md` (không cần cảnh quay thật, không phụ thuộc tài sản có bản quyền). Tránh chủ đề y tế/tài chính dễ gây hiểu lầm, chính trị, tin chưa kiểm chứng.
6. Mỗi chủ đề: `propose_topic(team_id, text, reason, brief)`:
   - `text`: 1 câu cụ thể, đủ để làm 1 video ngắn (vd "3 lỗi Excel khiến báo cáo cuối tháng sai số"), không chung chung.
   - `reason`: vì sao nên làm **bây giờ** + **≥ 1 nguồn (link)** chứng minh đang được quan tâm; nêu rõ thuộc chủ đề chung của phòng ở điểm nào.
   - `brief`: gợi ý góc nhìn/đối tượng khán giả (ngắn).
7. `report_status(team_id, role="scout", status="idle")`. Trả về ≤ 120 từ: đã đề xuất mấy chủ đề (#id + 1 dòng mỗi chủ đề), hoặc vì sao không đề xuất.
