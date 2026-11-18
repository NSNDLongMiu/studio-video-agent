# Lời nhắn cho máy mới

> Viết ngày 16/11/2026 trên máy cũ, khi giám đốc chuyển sang PC mạnh. Dành cho **giám đốc** và cho **phiên Claude/Codex mở trên máy mới**.
> Bộ nhớ riêng của Claude **không đi theo repo**: những điều quan trọng đã được chép vào đây. Nếu có chỗ nào mâu thuẫn với tài liệu khác, hỏi giám đốc.

## Lấy dự án
`git clone https://github.com/NSNDLongMiu/studio-video-agent.git` (nhánh `main`). Đã đẩy ngày 16/11/2026, commit `30fe8bb`, 221 tệp; đã kiểm: clone mới chạy đủ test (xem mục "Không nằm trong repo" cho phần phải cài lại).
**Repo này CÔNG KHAI** (giám đốc đã xác nhận). Vì vậy: **không bao giờ commit token, khoá, email đăng nhập thật của tài khoản, `studio/accounts`, `auth.json`, ảnh chụp có thông tin riêng**; trước mỗi lần đẩy hãy quét nội dung sẽ commit. Commit đầu dùng tác giả `NSNDLongMiu` + địa chỉ `noreply` của GitHub để không lộ email cá nhân; máy mới nên làm tương tự (đặt `git config user.email` thành địa chỉ noreply của tài khoản GitHub) nếu không muốn email lộ ra repo công khai.
Muốn cập nhật từ máy cũ: `git pull`. Máy cũ không tự đồng bộ: mọi thay đổi muốn mang theo phải được commit và đẩy.

## Đọc theo thứ tự
1. File này. 2. `CLAUDE.md` (luật cứng của dự án). 3. **`docs/PLAN-CHUYEN-MAY.md`** (12 quyết định + trình tự cài T0–T8) và **`docs/CAI-DAT-MAY-MOI.md`** (danh sách công cụ/extension cần cài, phiên bản máy cũ, lệnh kiểm). 4. `docs/PLAN.md` (các giai đoạn), `docs/CHECKLIST.md` (việc cụ thể) và `docs/viec-cho-agent.md` (việc giao cho agent).
Chuẩn chất lượng xem hiện hành (18/11/2026): `docs/chat-luong-xem.md`, R1–R10 và **Y1–Y8 bắt buộc của giám đốc**, quy trình 7 bước và QC 8 nhóm. Giữ 9:16, 1080×1920, 15–45 giây.

## Tình trạng trong một đoạn
Xưởng video ngắn "Cáo văn phòng" đã dựng xong khung và qua test trên máy cũ: `studio` 24 test, `tools/fox` 7 test, `tools/mascot` 7 test đều đạt. **Chưa kiểm chứng:** Codex thật chưa từng chạy lần nào (chưa đăng nhập); chưa có phòng ban hay cơ sở dữ liệu thật; chưa có mẫu giọng đọc nào được tạo hay nghe; chưa chạy trọn một lượt ý tưởng → kế hoạch với hai vòng tranh luận bằng chủ đề thật; chưa thử tài khoản phụ thật. Phần nào đã thử bằng cách nào được ghi trong từng tài liệu.

## Luật cho phiên Claude trên máy mới
1. **Chưa cài gì cho tới khi giám đốc nói bắt đầu** (câu lệnh kích hoạt ở mục 6 của `docs/PLAN-CHUYEN-MAY.md`). Được phép đọc và kiểm tra chỉ-đọc.
2. Việc cài gói từ nguồn ngoài (PyPI, VieNeu-TTS...) **đã bị bộ phân loại quyền chặn một lần ở máy cũ**. Không vòng qua. Để giám đốc tự chạy lệnh, hoặc chỉ làm khi giám đốc cấp quyền rõ ràng.
3. **Không chép token đăng nhập** (`studio/accounts`, `auth.json`, `~/.codex`, `~/.claude`) từ máy cũ. Đăng nhập lại; mỗi tài khoản là ghế của một người thật.
4. Giám đốc là người quyết: mở/đóng phòng, chỉ tiêu, duyệt nhân sự. Không tự duyệt.
5. Nói thật về kết quả; phân biệt rõ điều đã kiểm chứng với điều chưa.

## Giám đốc đã chốt (bản sao từ bộ nhớ của Claude)
- Giám đốc nói tiếng Việt; trả lời tiếng Việt.
- **Kênh "Cáo văn phòng"**; linh vật là **cáo cam công sở** (ảnh nguồn `assets/mascot/`, không sửa). Chíp (bản vẽ SVG cũ) đã ngừng dùng.
- **Văn phong:** trẻ trung, câu chữ văn phòng (quy tắc ở `docs/mascot.md`).
- **Luôn gắn nhãn AI** cho mọi video; `tools/qc-publish.mjs` kiểm `publish.json`.
- **Văn phòng 2D:** dùng whatsmyagentdoing, **chỉ chế độ 2D**, ghim v0.8.1 (`docs/office.md`).
- Giọng đọc: **đã chốt 17/11/2026, dùng toàn giọng Bắc** (Minh Đức nam chính, Quỳnh Anh nữ phụ; `temperature=0.65`, nhịp hậu kỳ cập nhật theo Y6) — đã bỏ yêu cầu giọng Nam ban đầu. Chi tiết ở `docs/voice.md`.
- Giám đốc muốn nhận **prompt viết sẵn** để tự giao việc cho agent khác (đã có prompt nhép miệng).
- Máy mới là PC rất mạnh: không cần lo hiệu năng, nhưng cấu hình cụ thể (GPU) chưa biết, hãy hỏi.
- **Quyết định ngày 18/11/2026:**
  - **Mở đầu video:** không có câu chào cố định; hook theo chủ đề, vào thẳng vấn đề, kích thích người xem (`docs/mascot.md`).
  - **Không dùng API/AI trả phí**, tuyệt đối không gây phát sinh phí; chỉ dùng tài khoản gói đã cấp. Hết limit → chuyển tài khoản đã cấu hình; hết sạch → dừng, chờ reset.
  - **Nguồn ảnh/clip: chỉ miễn phí.** Được dùng ảnh/clip AI ở mọi nơi (luôn nhãn AI). Ảnh Cáo do imagegen trong Codex tạo.
  - **Nhạc nền: không dùng** (giám đốc chốt 18/11/2026); video chỉ có giọng đọc.
  - **Đăng bài tự động:** làm sau khi giám đốc duyệt file demo; trước đó giám đốc tự đăng.
  - **Cáo:** tạm dùng chung 1 bộ đồ; sau đổi theo cụm chủ đề do agent hoạ sĩ linh vật lo (T1).
  - **Người tham gia:** chỉ giám đốc, tự theo dõi dashboard. Tài khoản: 3 ghế Claude main/b/c cùng một email (một tài khoản, chung hạn mức); phòng IT dùng riêng `claude/dev-longvu` + `codex/main`. Chỉ tiêu video/ngày đặt ngay lúc tạo phòng.
  - **Quy trình (18/11/2026):** tranh luận ý tưởng tối đa 4 vòng (mặc định 2). **Không cần giám đốc duyệt kế hoạch:** kế hoạch xong tự sản xuất (cài đặt `auto_produce`, mặc định bật). Tự thử lại: gỡ vướng tối đa 4 lần/video, sản xuất dưới 10 lần/video (tối đa 9). Chuẩn đầu ra 9:16, 1080×1920, 15–45 giây. Số video/ngày theo cấu hình phòng/đội, không có mặc định riêng.
  - **Repo công khai:** không ghi email đăng nhập thật vào file của repo (đã che 18/11/2026); chỉ gọi tài khoản bằng email khi nói chuyện.
  - **Quy tắc sửa hệ thống (18/11/2026):** 5 dòng trong CLAUDE.md, mục "Quy tắc sửa hệ thống". Trước khi commit/push chạy `node tools/scan-public.mjs`.
  - **Worker tự bật cùng Windows:** làm sau demo.
  - **Codex hết limit:** giám đốc sẽ cấp thêm tài khoản Codex cho phòng (đã chốt 18/11/2026); không cần quy tắc cho Claude viết kịch bản thay. Thêm tài khoản chỉ giúp tự chuyển khi hết limit; muốn chạy song song nhiều việc Codex thì nâng cài đặt `concurrency_codex`.
  - **Vai Tài nguyên & Linh vật (gộp T1+T4):** hoãn — làm demo trước; giám đốc duyệt demo xong sẽ hỏi lại (18/11/2026).
  - **Giọng đọc:** giữ 2 giọng đã chốt (nam Minh Đức, nữ Quỳnh Anh); **không cài** công cụ nhận dạng tiếng nói để kiểm giọng; cần thêm giọng thì đề xuất để giám đốc duyệt. Giọng đọc do giám đốc nghe kiểm.

## Còn chờ giám đốc quyết
Phần lớn đã chốt (xem danh sách trên và `docs/CHECKLIST.md`). Còn lại: (1) giao chủ đề demo trên dashboard (phòng IT đã mở, chỉ tiêu 1/ngày) rồi nhờ Claude xếp việc kế hoạch; (2) vai Tài nguyên & Linh vật (T1+T4): giám đốc sẽ hỏi lại sau khi duyệt demo; (3) 6 câu mở sau T3/T4 (xem `docs/CHECKLIST.md` mục 4). Cơ cấu vai trò (Kịch bản/Đạo diễn hình ảnh do Codex viết, Claude duyệt) giám đốc báo đã xong. Việc giao cho agent: `docs/viec-cho-agent.md`.

## Không nằm trong repo (phải tạo lại trên máy mới)
| Thứ | Cách có lại |
|---|---|
| `node_modules` (studio, tools/mascot) | `npm install` trong từng thư mục. **`tools/fox` dùng lại bộ vẽ của `tools/mascot`, nên phải cài cả hai** |
| Thư viện Python của `tools/fox` | `python -m pip install pillow numpy scipy` |
| `tools/whatsmyagentdoing` (Văn phòng 2D) | `git clone --depth 1 --branch v0.8.1 https://github.com/Charonyuu/whatsmyagentdoing tools/whatsmyagentdoing`; commit phải là `c69bf2bc98cf96a63d146070e9bbc83b507bf0bf` |
| `brand/cao/_raw`, `brand/cao/_index` | `python -X utf8 tools/fox/extract.py` (rồi `build.py` nếu đổi tên dáng). Các thư mục `poses/ faces/ mouths/ motion/` **đã có sẵn** trong repo |
| `studio/data` (cơ sở dữ liệu), `studio/accounts` | tự tạo khi chạy; tài khoản thì đăng nhập lại |

## Việc đầu tiên khi mở dự án trên máy mới
1. Sửa **một** đường dẫn cứng nếu dự án không nằm ở `E:\Tiktoker`: `.codex/config.toml` (đường dẫn tới `studio/src/mcp.mjs`). Đã quét: không còn chỗ nào khác.
2. Chạy T0 (chỉ đọc) để kiểm máy: Node ≥ 22.5 (khuyên 24), ffmpeg có `libx264`, `libass`, `drawtext`, `loudnorm`, Python 3.12, `nvidia-smi`.
3. Chờ giám đốc báo bắt đầu rồi làm theo T1–T8.

## Bẫy kỹ thuật đã gặp (đừng giẫm lại)
- **Phụ đề ffmpeg:** với file `.srt`, libass dùng hệ toạ độ 384×288 (1 đơn vị ≈ 6,67 px ở video cao 1920). Đặt sai đơn vị thì phụ đề **biến mất mà ffmpeg không báo lỗi**. Có Cáo trong khung thì đặt phụ đề **phía trên đầu Cáo** và chọn `MarginV` phù hợp với vị trí thực tế. Luôn **mở khung hình thật** để kiểm.
- **Biến môi trường:** `ANTHROPIC_API_KEY` trong môi trường sẽ đè đăng nhập gói ở `claude -p`; bộ chạy việc nền đã làm sạch môi trường từng tài khoản, đừng bỏ.
- **Tạo tệp qua shell:** heredoc trong Git Bash làm mất dấu `\`; Python in tiếng Việt cần `python -X utf8` (cờ `-I` bỏ qua `PYTHONIOENCODING`). Với tệp có `\`, dùng công cụ ghi tệp hoặc `path.join`.
- **Cáo không nhép miệng và ảnh chỉ cao khoảng 330 px**; xem `docs/mascot.md` mục "Giới hạn đã biết" trước khi hứa điều gì với giám đốc.
- **Văn phòng 2D hiện mọi dự án trên máy**; `--private` vẫn lộ tên dự án (`docs/office.md`). Khi quay màn hình làm nội dung, dùng `--demo`.
- **Codex trên Windows:** `codex doctor` từng cảnh báo Defender; nếu bị chặn thì thêm ngoại lệ cho `codex.exe`.
- Cổng mặc định: dashboard 4747, Văn phòng 2D 4545 (đổi bằng `STUDIO_PORT`, `STUDIO_OFFICE_PORT`).
- **Remotion: hình trễ dần so với tiếng (Demo02, 18/11/2026).** Dùng độ dài tiếng và khoảng nghỉ đã đo ở từng nhịp theo Y7/R8, duyệt lại mốc sau TTS. Cộng đệm cố định vào từng dòng trong khi audio được ghép sát đã làm hình trễ thêm ~13 s.
- **Giảm Cáo (2 lần góp ý 17–18/11/2026):** chỉ đạo của giám đốc đã thành luật Y2/Y3 trong `docs/chat-luong-xem.md`. Cáo xuất hiện gián đoạn ở mở/giữa/kết; cảnh kỹ thuật sâu dành cho minh hoạ. Khi cùng minh hoạ, Cáo rộng khoảng 15–25% khung, tránh che chi tiết và có hành vi gắn với vật đang đổi theo R6.

## Ai làm gì
- **Giám đốc:** đăng nhập Codex/Claude, mở phòng + giao chủ đề, duyệt kế hoạch/demo, quyết các mục còn chờ.
- **Claude (khi được báo):** cài thư viện **của dự án**, chạy test, bật xưởng, chạy thử video đầu–cuối, đo và báo số liệu thật.
- **Agent khác:** nhép miệng cho Cáo theo `docs/prompts/lipsync-cao.md` và các việc trong `docs/viec-cho-agent.md`.
