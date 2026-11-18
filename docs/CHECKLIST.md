# Checklist của team — đưa xưởng video vào chạy thật

> Đánh dấu ngay trên dashboard (khung "Checklist của team") hoặc sửa `[ ]` → `[x]` trong file này. Làm dần từ trên xuống.
> Bức tranh chung, các giai đoạn và việc cần giám đốc quyết: `docs/PLAN.md`.
> Kế hoạch chuyển sang PC mới (tối nay): `docs/PLAN-CHUYEN-MAY.md`.
> **Cập nhật 18/11/2026:** giám đốc đã trả lời từng mục; dự án chỉ có giám đốc tham gia. Việc của AI nằm ở mục 6 và `docs/viec-cho-agent.md` (agent đọc file đó để nhận việc).

## 1. Bắt buộc trước khi chạy thật
- [x] Đăng nhập Codex bằng tài khoản ChatGPT Plus: `codex login` → chọn "Sign in with ChatGPT" (xác minh 17/11/2026: `codex/main` kind subscription, đã chạy thật thành công nhiều lần)
- [x] Mở Claude Code trong thư mục dự án, đồng ý cho MCP `studio` (dự án đã chuyển sang `D:\Agent Video Studio`, không còn ở `e:\Tiktoker`; MCP đang hoạt động bình thường)
- [x] Quyết định có ghi `.claude/settings.json` không — **đã ghi 18/11/2026** sau khi giám đốc xác nhận lại (chỉ Claude ghi file này): cho phép trước 9 công cụ đọc/báo cáo của `studio`; 6 công cụ duyệt, mở/đóng phòng, đặt chỉ tiêu vẫn bắt hỏi
- [x] Trong thư mục dự án chạy `codex` một lần, chọn tin cậy (Trust) để Codex nạp `.codex/config.toml` (xác minh: Codex đã chạy `produce` thành công nhiều lần bằng đúng config này)
- [x] Chạy `npm run start --prefix studio` (dashboard + worker nền) và mở http://localhost:4747 (worker đang chạy nền)
- [x] Mở **Văn phòng 2D** để xem các agent như đang ngồi làm: `npm run office --prefix studio` (hoặc nút 🏢 trên dashboard). Đọc mục "Riêng tư" trong `docs/office.md` trước khi chia sẻ màn hình (giám đốc xác nhận đã làm, 18/11/2026)
- [x] Mở phòng ban đầu tiên bằng nút "+ Mở phòng ban" (hoặc nói với Claude) — đã mở phòng "IT" chạy thử đầu-cuối 16–17/11/2026; sau đó đã đóng + xoá sạch theo yêu cầu giám đốc để bắt đầu sạch, mục này tính xong vì đã chứng minh cơ chế chạy được

## 2. Tài khoản & tự chuyển khi hết limit
- [x] `node studio/src/cli.mjs accounts init` — đăng ký đăng nhập Claude đang có trên máy thành `claude/main`
- [x] Thêm tài khoản Codex đầu tiên: `accounts add codex <nhãn> --owner "Tên"` rồi `accounts login codex/<nhãn>`
- [x] Chủ tài khoản đã khai báo (18/11/2026): ghế `claude/main`, `claude/b`, `claude/c` và `codex/main` ghi chủ "Giám đốc" (`claude/b` sửa bằng lệnh mới `accounts owner`); `claude/dev-longvu` có chủ khai riêng. Kiểm 18/11/2026: **3 ghế Claude main/b/c cùng một email, tức cùng một tài khoản Claude** — chung một hạn mức, chuyển giữa 3 ghế không thêm năng lực. Phòng IT chỉ dùng `claude/dev-longvu` + `codex/main` (đã cấp riêng cho phòng). Giám đốc đã đọc mục "Điều khoản" ở `docs/accounts.md` và giữ cấu hình này
- [x] Che email tài khoản trong tài liệu của repo công khai (giám đốc đồng ý 18/11/2026): đã thay bằng `<email>`. Quét repo và lịch sử commit không thấy khoá/token; GitHub chưa có email nào; nhãn ghế (vd `dev-longvu`) vẫn còn vì là mã lệnh
- [x] Quy tắc sửa hệ thống (một cửa sổ sửa mỗi lần, chạy test, sửa mọi chỗ nhắc tới, khởi động lại, quét trước khi commit) — giám đốc duyệt 18/11/2026 ("ok C"); đã ghi 5 dòng vào CLAUDE.md và làm lệnh quét `node tools/scan-public.mjs` (có test). Giám đốc cần nhắc phiên kia đọc lại CLAUDE.md
- [x] Chạy `accounts check --probe` để chắc từng tài khoản gọi được thật (tốn rất ít hạn mức) — đã có lượt gọi thật thành công ghi nhận cho cả 4 tài khoản
- [x] Đọc `docs/accounts.md` mục "Điều khoản" và thống nhất cách dùng tài khoản trong team (giám đốc xác nhận đã đọc, 18/11/2026)
- [x] Tài khoản API trả phí dự phòng — **đã quyết (18/11/2026): KHÔNG dùng** API và AI trả phí, chỉ dùng tài khoản gói đã cấp, tuyệt đối không gây phát sinh phí. Hết limit → tự chuyển sang tài khoản đã cấu hình; hết sạch → dừng, chờ giờ hồi rồi tự chạy tiếp (worker đã làm đúng như vậy; `paid_fallback` đang `off`, kho không có tài khoản `api_key`)
- [x] Lần hết limit thật đầu tiên: xem nguyên văn thông báo ở khung Tài khoản và báo lại để chỉnh bộ đọc giờ hồi (`studio/src/limits.mjs`) — đã có, bộ đọc đã parse đúng giờ hồi thật ("resets 6:50pm (Asia/Bangkok)")
- [ ] (Tuỳ chọn) Cho worker tự bật khi đăng nhập Windows: chạy `studio/scripts/install-worker-task.ps1` — giám đốc đồng ý làm **sau demo** (18/11/2026)

## 3. Nguyên liệu sản xuất (xem docs/asset-sources.md)
- [x] Xem `brand/cao/catalog.png` (46 dáng, đặt tên theo ý nghĩa) và đổi tên dáng nào chưa hợp (`tools/fox/names.json`) — giám đốc giao AI (18/11/2026); Claude đã đối chiếu 46 dáng + 10 mặt + 12 miệng trên ảnh tổng hợp: tên khớp hình, không cần đổi (xem bằng mắt trên ảnh tổng hợp, chưa soi từng dáng phóng to)
- [x] Văn phong: trẻ trung, câu chữ văn phòng (đã chốt, quy tắc ở `docs/mascot.md`)
- [x] Câu chào của Cáo — **đổi hướng 18/11/2026:** không dùng bộ câu chào cố định; mở đầu bằng hook theo chủ đề, vào thẳng vấn đề, kích thích người xem (`docs/mascot.md` mục "Mở đầu: vào thẳng vấn đề"; planner đã cập nhật)
- [ ] Bản ảnh Cáo độ phân giải cao hơn (sticker hiện cao ~330px, khi dựng bị phóng ~2,2 lần nên mềm) — giám đốc xác nhận **cần**, giao agent hoạ sĩ linh vật: `docs/viec-cho-agent.md` T1
- [x] Luôn gắn nhãn AI cho mọi video (đã chốt)
- [x] Ảnh Cáo tạo bằng công cụ nào — giám đốc báo: **imagegen trong Codex** (18/11/2026). Điều khoản OpenAI: các nguồn thứ cấp nói người dùng sở hữu output và được dùng thương mại, nhưng **chưa đọc được bản gốc** (openai.com chặn truy cập tự động) → giám đốc nên đối chiếu tại openai.com/policies. Ảnh AI thuần có thể không được bảo hộ bản quyền (luật Mỹ cần tác giả là người)
- [x] Nghe thử và chọn giọng — **đã chốt 17/11/2026: toàn giọng Bắc** (Minh Đức nam chính, Quỳnh Anh nữ phụ), không cần giọng Nam; chi tiết `docs/voice.md`
- [ ] Giao `docs/prompts/lipsync-cao.md` cho một agent khác để làm nhép miệng cho Cáo — giám đốc đã giao cho AI (18/11/2026); chờ agent nhận: `docs/viec-cho-agent.md` T2
- [ ] (Tuỳ chọn) Trang phục/phụ kiện Cáo — giám đốc: **tạm dùng chung 1 bộ đồ**, sau này đổi theo cụm chủ đề (ví dụ sa mạc → đồ sa mạc), do agent hoạ sĩ linh vật lo: `docs/viec-cho-agent.md` T1
- [x] Chọn nguồn ảnh/clip — **T4 xong 18/11/2026:** danh sách nguồn được dùng / có điều kiện / cấm, quy tắc logo hãng khác và hình AI ở `docs/asset-sources.md`; sổ giấy phép mẫu `library/LICENSES.md`; QC đã thêm bước đối chiếu sổ. Còn 3 câu cho giám đốc (ở mục 4)
- [x] Nhạc nền — **giám đốc quyết (18/11/2026): KHÔNG dùng nhạc nền.** Âm thanh video chỉ có giọng đọc; Producer không trộn nhạc; không cần `library/music/` và `LICENSES.md` cho nhạc
- [x] Quyết định có dùng ảnh/clip do AI tạo không — **có, dùng ở mọi nơi**, luôn gắn nhãn AI; chỉ qua công cụ trong tài khoản đã cấp, không phát sinh phí (18/11/2026)
- [x] Quyết định khi nào làm đăng bài tự động — **sau khi giám đốc duyệt file demo** thì triển khai tự động làm và đăng bài (18/11/2026); trước đó giám đốc tự đăng, luật cứng #9 giữ nguyên

## 4. Chạy thử đầu–cuối
- [x] Giao 1 chủ đề thử: `/new-topic <phòng> | <chủ đề> | <yêu cầu thêm>` — đã làm với chủ đề "Phỏng vấn IT trong thời đại AI" (16/11/2026)
- [x] Đọc `concept.md`, `debate.md`, `plan.md` mà 2 agent Claude tạo ra; chỉnh brief/phong cách nếu chưa ưng
- [x] Bấm "Duyệt & sản xuất" → xem Codex dựng 1 video thật và QC của Claude — tập 1 đã đạt QC lên "ready"; dữ liệu đã xoá sau đó (17/11/2026) để dọn sạch, không phải vì lỗi
- [ ] Làm 1 video demo mới theo hướng hook chủ đề để giám đốc duyệt — **phòng IT đã mở** (chỉ tiêu 1/ngày, 1 đội; xác nhận 18/11/2026). Giám đốc giao chủ đề trên dashboard ("+ Giao chủ đề"), rồi nhắn Claude để xếp việc kế hoạch (dashboard chưa có nút chạy kế hoạch); kế hoạch xong tự sản xuất, không cần giám đốc duyệt kế hoạch. Duyệt demo là điều kiện mở khoá T5 (tự động làm và đăng bài)
- [ ] Đăng thử 1 video lên cả 3 nền tảng, ghi lại chỗ cần sửa của `publish.json` (cần có video demo ở dòng trên)
- [x] Rà lại `docs/platform-specs.md` với chính sách hiện hành của từng nền tảng — **T3 xong 18/11/2026:** đã cập nhật kèm nguồn và ngày kiểm; phần CHƯA XÁC MINH ghi cuối file (Trung tâm trợ giúp TikTok và Meta không đọc được). Còn 3 câu cho giám đốc (dòng dưới)
- [ ] Giám đốc trả lời 6 câu mở sau T3/T4 (đề xuất của Claude trong ngoặc): (1) cho dùng ảnh CC BY phải ghi công? (không); (2) cho Unsplash tải tay? (cho, ưu tiên thấp); (3) logo hãng khác: chỉ chữ, riêng GitHub logo nguyên bản và Microsoft ảnh chụp nguyên khung + credit? (đồng ý); (4) vùng an toàn: giữ chuẩn xưởng rồi chỉnh sau đăng thử? (giữ); (5) thêm tiêu chí "góc nhìn riêng, không chỉ đọc lại tin" vào review Kịch bản? (thêm); (6) TikTok tự đăng qua đường "Upload vào hộp thư" thay vì đăng thẳng? (quyết khi làm T5)

## 5. Vận hành hằng ngày
- [x] Đặt chỉ tiêu video/ngày cho từng phòng — quy ước (18/11/2026): giám đốc đặt ngay lúc tạo phòng (hộp "Mở phòng ban" có ô "Chỉ tiêu video/ngày"); hiện chưa có phòng nào nên chưa có con số
- [ ] Thử đổi chỉ tiêu → `/dept-review <phòng>` → duyệt đề xuất thêm đội (cần có phòng)
- [x] Người theo dõi dashboard mỗi ngày (khung "Cần giám đốc chú ý") — giám đốc tự theo dõi; dự án chỉ có giám đốc tham gia (18/11/2026)

## 6. Việc giao cho Agent (AI đọc `docs/viec-cho-agent.md` rồi nhận)
> T2 (nhép miệng), T3 (rà platform-specs), T4 (nguồn ảnh/clip miễn phí) đã nằm ở mục 3 và 4 ở trên; dưới đây là 2 việc mới.
- [ ] T1 — Hoạ sĩ linh vật: dựng vai agent lo cập nhật Cáo (độ phân giải, trang phục theo cụm chủ đề); hoãn tới sau khi duyệt demo (giám đốc sẽ hỏi lại, 18/11/2026); đụng cơ cấu trong `CLAUDE.md`
- [ ] T5 — Tự động làm và đăng bài: **khoá** cho tới khi giám đốc duyệt file demo; việc đầu tiên là viết tài liệu thiết kế, chưa viết mã
