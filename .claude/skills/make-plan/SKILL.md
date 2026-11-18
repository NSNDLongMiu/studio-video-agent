---
name: make-plan
description: Chạy quy trình kế hoạch cho 1 chủ đề đã giao theo BỘ CORE (giám đốc duyệt 18/11/2026) - Ý tưởng (Claude + Codex cùng đề xuất & phản biện, Claude chốt) → Kịch bản (Codex viết, Claude review & duyệt cuối) → Đạo diễn hình ảnh (Codex làm storyboard, Claude review & duyệt cuối). Cú pháp "/make-plan <topic-id> [số-tập] [vòng]". Worker nền cũng gọi lệnh này.
argument-hint: "<topic-id> [số-tập=1] [vòng=2]"
disable-model-invocation: true
---

Đối số: `$ARGUMENTS` = `<topic_id> [số tập, mặc định 1] [số vòng tranh luận ý tưởng, mặc định 2, tối đa 4]`.

Bạn là **người điều phối** (không phải vị trí core nào): chuyển lời giữa các bên, ghi file, báo trạng thái thay cho Codex (Codex không có MCP). Vị trí core và ai làm gì:

| Vị trí (role) | Làm | Review / chốt |
|---|---|---|
| Ý tưởng (`idea`) | Claude (`ideator-a`, Agent tool) + Codex (`codex-ideate.mjs codex`) — mỗi bên đề xuất & phản biện bên kia | `ideator-b` (Claude) chốt cuối |
| Kịch bản (`script`) | Codex (`codex-write.mjs script`) | `planner` (Claude) review, duyệt cuối |
| Đạo diễn hình ảnh (`visual`) | Codex (`codex-write.mjs storyboard`) | `visual-director` (Claude) review, duyệt cuối |

> **Chạy nền (không có người trả lời):** không hỏi giám đốc. Gặp chỗ lẽ ra phải hỏi → chọn phương án an toàn nhất và ghi giả định vào `plan.md`, hoặc dừng và nêu cần gì.
> **Chạy lại sau khi bị ngắt:** làm Bước 0 để TIẾP TỤC từ chỗ dở, không làm lại phần đã xong.
> **Codex vắng (bận sản xuất / hết limit / chưa đăng nhập):** ở Ý tưởng được tiếp tục thiếu Codex (ghi rõ vào `debate.md`). Ở **Kịch bản / Đạo diễn hình ảnh thì KHÔNG được tự viết thay Codex**: thử lại đúng 1 lần, vẫn vắng thì báo trạng thái `blocked` cho vị trí đó và **kết thúc bằng dòng cuối cùng** `CODEX_WAIT: <lý do ngắn>` — worker sẽ tự chạy lại việc này (tiếp từ chỗ dở) khi Codex rảnh.

Chuẩn gốc: `docs/chat-luong-xem.md` (R1–R10, Y1–Y8 bắt buộc). Trong 7 bước, việc plan làm bốn bước đầu: phân tích chủ đề, viết kịch bản, phân cảnh, thiết kế hình. Ưu tiên mạch kể Y5; kiểm bản đồ Cáo Y2–Y3, chữ Y1, nền Y4 và đầu vào cho Producer theo Y6–Y8.
Plan/script có bảng ngân sách 15–45 giây, nhãn đoạn, thuật ngữ và dự kiến nhịp nghỉ. Bước 5–6 do Producer xử lý lời thoại rồi dựng; bước 7 do QC kiểm 3 trục và rà đủ Y1–Y8.
Trước APPROVED, `visual-director` kiểm component thật (kể cả nền theo `environment`) và lựa chọn `renderer`/`renderer_reason`; storyboard mới phải điền các trường trải nghiệm theo mẫu. QC ba trục: lỗi thiết kế giữ review + escalate cho giám đốc, **đường tự động trả về Đạo diễn hình ảnh chưa được xây** (worker chấp nhận video ở review có cờ vướng; schema đã có các trường mới ở dạng tuỳ chọn).

## Gọi Codex (dùng chung cho mọi bước)
1. Ghép prompt = TOÀN VĂN file mẫu (`.claude/skills/make-plan/ideator-c.md` | `codex-script.md` | `codex-storyboard.md`) + mục `## NGỮ CẢNH` điền sẵn: `team_id`, chủ đề, danh sách `video_id` + thư mục `epNN`, **đường dẫn tuyệt đối** của thư mục gốc dự án và các file cần đọc (brief, debate, concept/plan/script, schema, docs, **`docs/chat-luong-xem.md`**; storyboard thêm **`studio/renderer-remotion/src/scenes/`**), và (bản sửa) đường dẫn file review mới nhất. Riêng Ý tưởng: Codex không đọc file được → dán thẳng nội dung brief + lập luận các lượt trước vào prompt; mẫu đã có tóm tắt R1–R2 và Y5 tự đủ ý.
2. `Write` prompt ra: Ý tưởng `<topic>/debate/codex-round<N>-<de-xuat|phan-bien>.prompt.md` · Kịch bản `<topic>/review/codex-script-r<N>.prompt.md` · Storyboard `<topic>/<epNN>/review/codex-storyboard-r<N>.prompt.md`.
3. `Bash` (timeout ≥ 10 phút; viết file ≥ 20 phút):
   - Ý tưởng: `node --disable-warning=ExperimentalWarning studio/src/codex-ideate.mjs codex <file-prompt>`
   - Kịch bản: `node --disable-warning=ExperimentalWarning studio/src/codex-write.mjs script <file-prompt> <topic_folder>`
   - Storyboard: `node --disable-warning=ExperimentalWarning studio/src/codex-write.mjs storyboard <file-prompt> <topic_folder>`
4. Đọc câu trả lời (stdout hoặc `<file-prompt>.reply.md`). Mã thoát khác 0 + `BUSY`/`NO_ACCOUNT`/`LIMIT`/`AUTH_ERROR`/`FAILED` ở stderr → xử lý theo khung "Codex vắng" ở trên.
5. Trước/sau mỗi lượt: `report_status(team_id, role=<idea|script|visual>, status="working", task="Codex: <đang làm gì>")`.

## Bước 0 — Kiểm tra tiến độ có sẵn (idempotent)
`list_topics` lấy chủ đề; nếu đã `assigned`, đọc thư mục chủ đề (`list_videos`/`get_video`):
- Mọi video có `epNN/storyboard.json` ở `APPROVED` → **đã xong**: chắc video ở `planning`, báo kết quả, kết thúc.
- Kịch bản đã DUYỆT (có `review/script-r*.md` kết luận `DUYỆT…`) → **Bước 4** cho video chưa có storyboard `APPROVED` (đọc `epNN/review/` để biết đang ở vòng nào).
- Có `concept.md`/`plan.md`/`script.md` nhưng chưa có kết luận DUYỆT → **Bước 3**, tiếp đúng vòng review kế tiếp.
- `debate.md` đã có "## Phán quyết cuối" → **Bước 3** (Codex viết bản đầu nếu chưa có file).
- Có `debate.md` chưa có phán quyết → tiếp tục vòng kế tiếp ở **Bước 2**.
- Chưa có gì → **Bước 1**. Không giao đội lần 2.

## Bước 1 — Giao đội
1. `assign_topic(topic_id, episodes)` (bỏ qua nếu đã giao). Bị từ chối vì hết suất/chưa có đội → dừng, báo đúng lý do, gọi `dept-head` (mã phòng + "rà năng lực và đề xuất nếu cần"). Không lách bằng đội/ngày khác.
2. Ghi lại `team_id`, `team`, `topic_folder`, `videos[]`. Đọc `<topic_folder>/brief.md`.
3. `set_video_stage(<mỗi video>, "ideation")` (nếu chưa qua).

## Bước 2 — Ý tưởng (Claude + Codex, Claude chốt)
Ghi nguyên văn mọi lượt vào `<topic_folder>/debate.md` (tiêu đề từng vòng). Hai giọng không nói chuyện trực tiếp — bạn chuyển lời.
- **Vòng 1 — đề xuất độc lập:** gọi `ideator-a` (Agent tool; truyền team_id, topic, brief, topic_folder, vòng) và Codex (prompt "đề xuất") — **không** cho bên nào thấy ý bên kia trước khi tự đề xuất. Mỗi bên 3 concept.
- **Vòng 1 — phản biện chéo:** `ideator-a` phản biện 3 concept của Codex; Codex phản biện 3 concept của Claude.
- **Vòng 2..N:** mỗi bên đáp phê bình nhắm vào mình + bản cải tiến, rồi phản biện bản cải tiến của bên kia. Đồng thuận sớm thì được dừng sớm (ghi lý do).
- **Chốt:** gọi `ideator-b` với đường dẫn `debate.md` → dán mục "## Phán quyết cuối" vào cuối `debate.md` (có "BẾ TẮC" nếu thật sự ngang nhau).
Sau mỗi vòng tóm tắt 2-4 dòng. `report_status(team_id, role="idea", status="idle")` khi chốt xong.

## Bước 3 — Kịch bản (Codex viết → Claude review → duyệt cuối)
Vòng N = 1, 2, 3 (tối đa **2 lần sửa**):
1. Codex viết (kèm bảng ngân sách, chữ tuân thủ, bản đồ Cáo và bảng thuật ngữ; N=1: bản đầu theo phán quyết; N≥2: sửa theo `review/script-r<N-1>.md`) — `codex-write.mjs script`.
2. Gọi `planner` (Agent tool): team_id, topic_folder, videos, **N**, đường dẫn review trước → nó ghi `review/script-r<N>.md`.
3. Đọc dòng `KẾT LUẬN:`
   - `DUYỆT` / `DUYỆT SAU KHI CLAUDE SỬA NHỎ` → sang Bước 4.
   - `CẦN SỬA` (N ≤ 2) → vòng N+1.
   - `TỪ CHỐI` → dừng chủ đề này, `report_status(role="script", status="blocked", task="Kịch bản bị từ chối sau 2 lần sửa")`, ghi lý do để báo giám đốc.
`set_video_stage` chưa đổi ở bước này.

## Bước 4 — Đạo diễn hình ảnh (Codex làm → Claude review → duyệt cuối), từng video
Vòng N = 1, 2, 3 (tối đa 2 lần sửa):
1. Codex làm/sửa `epNN/storyboard.json` (status `DRAFT`) + `storyboard.md` — `codex-write.mjs storyboard`.
2. Gọi `visual-director` (Agent tool): team_id, video_id, đường dẫn các file, **N**, review trước → nó ghi `epNN/review/storyboard-r<N>.md` và (nếu duyệt) đặt `APPROVED`.
3. Theo kết luận:
   - `DUYỆT…` (storyboard đã `APPROVED`) → `set_video_stage(video, "planning")`, sang video tiếp.
   - `CẦN SỬA` → vòng N+1.
   - `TRẢ VỀ KỊCH BẢN` (`NEEDS_REDESIGN`) → quay lại **Bước 3** với đúng `needs_redesign_reason` làm góp ý (Codex sửa script, `planner` duyệt lại), rồi làm lại Bước 4 từ N=1. Tối đa **2 lần trả về**/video.
   - `TỪ CHỐI` / quá giới hạn → để video thiếu storyboard, `report_status(role="visual", status="blocked", ...)`, ghi vướng để báo giám đốc. **Không** tự hạ chuẩn cho qua.

## Bước 5 — Dọn trạng thái & báo cáo
- `report_status(team_id, role=idea|script|visual, status="idle")` cho vị trí còn "working" (giữ `blocked` nếu đang vướng thật).
- Báo (ngắn): concept được chọn + lý do (có chọn theo Codex không), số vòng sửa kịch bản/storyboard và điểm góp ý chính, các tập/thời lượng, tóm tắt storyboard, mục **"Cần giám đốc cung cấp"** trong `plan.md` (nếu có), video còn vướng (nếu có), đường dẫn `plan.md`.
- Kết thúc bằng: "Kế hoạch xong. Nếu việc plan này xếp kèm tự sản xuất (mặc định) thì worker tự xếp sản xuất cho Codex; nếu không thì bấm **Duyệt & sản xuất** trên dashboard hoặc `/produce <video-id…>`." **Không tự chạy produce trong việc plan** (sản xuất do worker xếp cho Codex).
