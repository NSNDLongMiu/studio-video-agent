# Lời nhắn cho máy mới

> Viết ngày 16/11/2026 trên máy cũ, khi giám đốc chuyển sang PC mạnh. Dành cho **giám đốc** và cho **phiên Claude/Codex mở trên máy mới**.
> Bộ nhớ riêng của Claude **không đi theo repo**: những điều quan trọng đã được chép vào đây. Nếu có chỗ nào mâu thuẫn với tài liệu khác, hỏi giám đốc.

## Lấy dự án
`git clone https://github.com/NSNDLongMiu/studio-video-agent.git` (nhánh `main`). Đã đẩy ngày 16/11/2026, commit `30fe8bb`, 221 tệp; đã kiểm: clone mới chạy đủ test (xem mục "Không nằm trong repo" cho phần phải cài lại).
**Repo này CÔNG KHAI** (giám đốc đã xác nhận). Vì vậy: **không bao giờ commit token, khoá, `studio/accounts`, `auth.json`, ảnh chụp có thông tin riêng**; trước mỗi lần đẩy hãy quét nội dung sẽ commit. Commit đầu dùng tác giả `NSNDLongMiu` + địa chỉ `noreply` của GitHub để không lộ email cá nhân; máy mới nên làm tương tự (đặt `git config user.email` thành địa chỉ noreply của tài khoản GitHub) nếu không muốn email lộ ra repo công khai.
Muốn cập nhật từ máy cũ: `git pull`. Máy cũ không tự đồng bộ: mọi thay đổi muốn mang theo phải được commit và đẩy.

## Đọc theo thứ tự
1. File này. 2. `CLAUDE.md` (luật cứng của dự án). 3. **`docs/PLAN-CHUYEN-MAY.md`** (12 quyết định + trình tự cài T0–T8) và **`docs/CAI-DAT-MAY-MOI.md`** (danh sách công cụ/extension cần cài, phiên bản máy cũ, lệnh kiểm). 4. `docs/PLAN.md` (các giai đoạn) và `docs/CHECKLIST.md` (việc cụ thể).

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
- Cần giọng đọc tiếng Việt **một Bắc + một Nam**. Đề xuất ở `docs/voice.md`.
- Giám đốc muốn nhận **prompt viết sẵn** để tự giao việc cho agent khác (đã có prompt nhép miệng).
- Máy mới là PC rất mạnh: không cần lo hiệu năng, nhưng cấu hình cụ thể (GPU) chưa biết, hãy hỏi.

## Còn chờ giám đốc quyết
Bộ câu chào (A/B/C/D, đề xuất A) · nghe và chọn giọng Bắc + Nam · cấu hình PC mới · phòng ban đầu tiên và chủ đề chạy thử · cho phép ghi `.claude/settings.json` hay không · giao prompt nhép miệng khi nào · nguồn tạo ảnh Cáo (để kiểm điều khoản thương mại) · ảnh Cáo độ phân giải cao hơn. Chi tiết ở bảng quyết định của `docs/PLAN-CHUYEN-MAY.md`.

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
- **Phụ đề ffmpeg:** với file `.srt`, libass dùng hệ toạ độ 384×288 (1 đơn vị ≈ 6,67 px ở video cao 1920). Đặt sai đơn vị thì phụ đề **biến mất mà ffmpeg không báo lỗi**. Có Cáo trong khung thì phụ đề phải nằm **phía trên đầu Cáo** (`MarginV=190`). Luôn **mở khung hình thật** để kiểm.
- **Biến môi trường:** `ANTHROPIC_API_KEY` trong môi trường sẽ đè đăng nhập gói ở `claude -p`; bộ chạy việc nền đã làm sạch môi trường từng tài khoản, đừng bỏ.
- **Tạo tệp qua shell:** heredoc trong Git Bash làm mất dấu `\`; Python in tiếng Việt cần `python -X utf8` (cờ `-I` bỏ qua `PYTHONIOENCODING`). Với tệp có `\`, dùng công cụ ghi tệp hoặc `path.join`.
- **Cáo không nhép miệng và ảnh chỉ cao khoảng 330 px**; xem `docs/mascot.md` mục "Giới hạn đã biết" trước khi hứa điều gì với giám đốc.
- **Văn phòng 2D hiện mọi dự án trên máy**; `--private` vẫn lộ tên dự án (`docs/office.md`). Khi quay màn hình làm nội dung, dùng `--demo`.
- **Codex trên Windows:** `codex doctor` từng cảnh báo Defender; nếu bị chặn thì thêm ngoại lệ cho `codex.exe`.
- Cổng mặc định: dashboard 4747, Văn phòng 2D 4545 (đổi bằng `STUDIO_PORT`, `STUDIO_OFFICE_PORT`).

## Ai làm gì
- **Giám đốc:** đăng nhập Codex/Claude, nghe và chọn giọng, chọn câu chào, giao prompt nhép miệng, quyết các mục ở trên.
- **Claude (khi được báo):** cài thư viện **của dự án**, chạy test, bật xưởng, chạy thử video đầu–cuối, đo và báo số liệu thật.
- **Agent khác:** nhép miệng cho Cáo theo `docs/prompts/lipsync-cao.md`.
