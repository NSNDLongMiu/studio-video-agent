# Lời nhắn cho máy mới

> Viết ngày 16/11/2026 trên máy cũ, khi giám đốc chuyển sang PC mạnh. Dành cho **giám đốc** và cho **phiên Claude/Codex mở trên máy mới**.
> Bộ nhớ riêng của Claude **không đi theo repo**: những điều quan trọng đã được chép vào đây. Nếu có chỗ nào mâu thuẫn với tài liệu khác, hỏi giám đốc.

## Lấy dự án
`git clone https://github.com/NSNDLongMiu/studio-video-agent.git` (nhánh `main`). Đã đẩy ngày 16/11/2026, commit `30fe8bb`, 221 tệp; đã kiểm: clone mới chạy đủ test (xem mục "Không nằm trong repo" cho phần phải cài lại).
**Repo này CÔNG KHAI** (giám đốc đã xác nhận). Vì vậy: **không bao giờ commit token, khoá, email đăng nhập thật của tài khoản, `studio/accounts`, `auth.json`, ảnh chụp có thông tin riêng**; trước mỗi lần đẩy hãy quét nội dung sẽ commit. Commit đầu dùng tác giả `NSNDLongMiu` + địa chỉ `noreply` của GitHub để không lộ email cá nhân; máy mới nên làm tương tự (đặt `git config user.email` thành địa chỉ noreply của tài khoản GitHub) nếu không muốn email lộ ra repo công khai.
Muốn cập nhật từ máy cũ: `git pull`. Máy cũ không tự đồng bộ: mọi thay đổi muốn mang theo phải được commit và đẩy.

## Đọc theo thứ tự
1. File này. 2. `CLAUDE.md` (luật cứng của dự án). 3. **`docs/PLAN-CHUYEN-MAY.md`** (12 quyết định + trình tự cài T0–T8) và **`docs/CAI-DAT-MAY-MOI.md`** (danh sách công cụ/extension cần cài, phiên bản máy cũ, lệnh kiểm). 4. `docs/PLAN.md` (các giai đoạn), `docs/CHECKLIST.md` (việc cụ thể) và `docs/viec-cho-agent.md` (việc giao cho agent).
Chuẩn chất lượng xem hiện hành (20/11/2026): `docs/chat-luong-xem.md`, R1–R28 và **Y1–Y8 bắt buộc của giám đốc**, quy trình 7 bước và QC 8 nhóm. Giữ 9:16, 1080×1920, 45–75 giây (chuẩn từ 20/11/2026, xem D1).

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
- Giọng đọc: **dùng toàn giọng Bắc (17/11/2026); bộ giọng chốt lại 19/11/2026:** Hải Đăng nam chính, Trúc Ly nữ chính, Quốc Tuấn nam phụ, Ngọc Huyền nữ phụ (thay Minh Đức, Quỳnh Anh; `temperature=0.65`, nhịp hậu kỳ cập nhật theo Y6) — đã bỏ yêu cầu giọng Nam ban đầu. Chi tiết ở `docs/voice.md`.
- Giám đốc muốn nhận **prompt viết sẵn** để tự giao việc cho agent khác (đã có prompt nhép miệng).
- Máy mới là PC rất mạnh: không cần lo hiệu năng, nhưng cấu hình cụ thể (GPU) chưa biết, hãy hỏi.
- **Quyết định ngày 18/11/2026:**
  - **Mở đầu video:** không có câu chào cố định; hook theo chủ đề, vào thẳng vấn đề, kích thích người xem (`docs/mascot.md`).
  - **Không dùng API/AI trả phí**, tuyệt đối không gây phát sinh phí; chỉ dùng tài khoản gói đã cấp. Hết limit → chuyển tài khoản đã cấu hình; hết sạch → dừng, chờ reset.
  - **Nguồn ảnh/clip: chỉ miễn phí.** Được dùng ảnh/clip AI ở mọi nơi (luôn nhãn AI). Ảnh Cáo do imagegen trong Codex tạo.
  - **Nhạc nền (đổi ngày 20/11/2026):** nhạc mặc định tắt theo `layers.music.enabled` trong `tools/audio/sound-design.json`. Chỉ dùng nhạc tự tổng hợp bằng `tools/audio/music_synth.py` sau khi giám đốc nghe và bật. Luôn ducking dưới giọng, không để nhạc che lời. Cấm nhạc bên ngoài.
  - **Đăng bài tự động:** làm sau khi giám đốc duyệt file demo; trước đó giám đốc tự đăng.
  - **Cáo:** tạm dùng chung 1 bộ đồ; sau đổi theo cụm chủ đề do agent hoạ sĩ linh vật lo (T1).
  - **Người tham gia:** chỉ giám đốc, tự theo dõi dashboard. Tài khoản: 3 ghế Claude main/b/c cùng một email (một tài khoản, chung hạn mức); phòng IT dùng riêng `claude/dev-longvu` + `codex/main`. Chỉ tiêu video/ngày đặt ngay lúc tạo phòng.
  - **Quy trình (18/11/2026):** tranh luận ý tưởng tối đa 4 vòng (mặc định 2). **Không cần giám đốc duyệt kế hoạch:** kế hoạch xong tự sản xuất (cài đặt `auto_produce`, mặc định bật). Tự thử lại: gỡ vướng tối đa 4 lần/video, sản xuất dưới 10 lần/video (tối đa 9). Chuẩn đầu ra 9:16, 1080×1920, thời lượng theo định dạng của plan (chuẩn 45–75 s từ 20/11/2026; giải thích sâu 150–190 s từ 19/11/2026 và ngắn 15–45 s chỉ khi giám đốc yêu cầu). Số video/ngày theo cấu hình phòng/đội, không có mặc định riêng.
  - **Repo công khai:** không ghi email đăng nhập thật vào file của repo (đã che 18/11/2026); chỉ gọi tài khoản bằng email khi nói chuyện.
  - **Suất video/ngày chỉ giới hạn việc tự động (18/11/2026):** `capacity_per_day` chặn việc đội tự tìm chủ đề và cảnh báo thiếu năng lực; **chủ đề giám đốc yêu cầu hoặc duyệt không bị chặn**, vượt suất thì ghi "VƯỢT SUẤT" (luật 4 trong CLAUDE.md).
  - **Không nhãn thừa trên hình (19/11/2026, sau khi giám đốc xem T5):** bỏ nhãn «AI tạo» và «Ví dụ dựng» khỏi khung hình; tuyệt đối không chữ/hình thừa (Y1 không còn ngoại lệ). Khai báo AI nằm ở `publish.json` (`ai_generated_content` + `ai_disclosure` cuối mô tả cả 3 nền tảng) và công tắc khai báo AI của nền tảng khi giám đốc đăng — nhớ bật khi đăng.
  - **Từ tiếng Anh đọc đúng âm Anh (19/11/2026):** từ điển `tools/voice/pronunciation.json` giữ chữ tiếng Anh gốc (không phiên âm Việt) vì VieNeu tự đọc âm Anh; kiểm bằng `python tools/voice/phonemes.py` (phải mã 0). Phát âm thật vẫn CHƯA KIỂM — giám đốc nghe.
  - **Đánh giá ngoài T5 và chuẩn bị T6 (19/11/2026):** nhận xét ngoài được phân loại bằng số đo ở `docs/danh-gia-ngoai.md`. Sinh ra R11 (bằng chứng hình cho từng khẳng định), R12 (đa dạng cảnh; khai báo camera = dựng được), phạm vi một khái niệm + một sự cố mỗi video (≤ 12 cảnh), hiệu chỉnh ngân sách thời lượng (4,0 âm tiết/s, thuật ngữ Anh +1 âm tiết, mục tiêu ≤ 42 s) và phụ đề thử 64 px (sau đó thay bằng quy tắc lớp phụ đề riêng 52–60 px, xem mục Visual-first). Các số này là **ngưỡng thử**, đánh giá lại sau T6. **Giám đốc chốt cho T6 (19/11/2026):** (1) camera — làm T6 trước với kỹ thuật hiện có, QC đo rồi mới quyết có giao Codex xây hệ thống camera; (2) Y4 — nhất quán phong cách thiết kế, đa dạng bối cảnh; (3) phụ đề 64 px chỉ là mức thử, áp theo loại chữ, nghiệm thu trên điện thoại sau T6; (4) QC phải tự đo độc lập bằng công cụ và ghi báo cáo có mốc giây + bằng chứng cho từng lỗi (`tools/qc-measure.mjs`, `docs/chat-luong-xem.md` mục “Báo cáo QC”), để so T6 với T5.
  - **Nâng cấp pipeline cho video giải thích sâu — “T9” (19/11/2026):** audit T8 ở `docs/audit-T8.md`; chuẩn mới ở `docs/chat-luong-xem.md` mục “Chuẩn video giải thích sâu” (D1 thời lượng ≈ 180 s, đã đổi sang 45–75 s ngày 20/11/2026, D2 R13 Information Pacing + Speech Pace +10–15%, D3 R14 opening + header, D4 R15 chiều sâu, D5 R16 đồng bộ, D6 Audio/Visual/Narrative QC). Cáo nhỏ hơn và ít hơn (10–18% khung, ≲ 25% thời lượng). `qc-measure` có hồ sơ `explainer` (tự bật khi video > 75 s) và từ 20/11/2026 thêm hồ sơ `standard` 45–75 s (mặc định). Lưu ý nền tảng: YouTube Shorts ≤ 180 s nên trần thực tế 180 s dù chấp nhận 190 s. Hạ tầng: giới hạn thời gian việc nền nâng cho video dài (cần khởi động lại worker). Mọi số là **ngưỡng thử**, đánh giá lại sau T9.
  - **Visual-first Storytelling (19/11/2026, bổ sung T9):** pipeline bỏ kiểu “đọc câu nào hiện câu đó”. Phụ đề đốt cứng chép lời từng chiếm 76–80% thời lượng T8/T5 (`docs/audit-T8.md` mục 4). Từ nay: phân tích ngữ nghĩa → trích keyword (6 loại) → ánh xạ keyword thành hình (bảng D7) → `semantic_plan` từng cảnh; chữ chỉ nhấn mạnh, gắn vào đối tượng, kinetic chọn lọc; **phụ đề là lớp accessibility riêng (52–60 px, dải dưới)**, thay mức thử 64 px; QC đo chữ lặp lời/lượng chữ (`text_audit`). Thành phần dùng chung: `tools/motion/` và `docs/motion-components.md`. Mọi số là **ngưỡng thử**, đánh giá lại sau T9.
  - **Giám đốc trả T9 bản đầu (19/11/2026 chiều) → luật D8 (R20–R23):** giọng mất chữ đầu câu; chưa có phần giới thiệu; header không xuyên suốt; đóng góp Visual-first không thấy trên hình (19/27 cảnh không có chữ, thuật ngữ không hiện nhãn). Đối chiếu bằng chứng ở `docs/audit-T9.md`; luật ở `docs/chat-luong-xem.md` D8; storyboard T9 và T14 đã đưa về `DRAFT` (`review/director-d8.md` mỗi tập). Công cụ đang làm bởi Codex (hết hạn mức tới ~19:12 ngày 19/11): `tools/motion/` nhật ký dựng + header + opening, `tools/voice/splice.py`, `qc-measure` kiểm D8 — đặc tả ở scratchpad phiên (`codex-task-K-…`, `codex-task-L-…`); nếu thiếu thì giao lại theo mục D8.
  - **Đổi độ dài chuẩn sang 45–75 s (giám đốc chốt 20/11/2026):** sau đánh giá ngoài về T14/T9 (video 3 phút khó giữ người xem; **chưa có số giữ chân thật**), giám đốc cho mặc định **45–75 s, mục tiêu ≈ 60 s, mỗi video một câu hỏi** (D1 trong `docs/chat-luong-xem.md`); 150–190 s và 15–45 s chỉ khi giám đốc yêu cầu rõ. **Mã đã làm (20/11/2026, T6):** hồ sơ QC `standard` 45–75 s trong `qc-measure`, nối đủ kiểm tra D8; `short` và `explainer` không đổi. Codex hết hạn mức nên Claude tự làm một lần theo yêu cầu giảm tải cho Codex của giám đốc (`docs/viec-cho-agent.md`). Chưa quyết: vị trí kêu gọi cuối, phụ đề karaoke, tên series trên hình và giữ Cáo xuyên suốt. Xem mục thay đổi bên dưới về opening và nhạc.
  - **Thêm agent Gemini, Claude làm trưởng nhóm, ba agent chia việc cân bằng (giám đốc chốt 20/11/2026):** Gemini chạy bằng **`agy` (Antigravity CLI)** đăng nhập gói Google AI Pro, **không phải** Gemini CLI cũ (đã ngừng nhận gói cá nhân từ 18/06/2026). Gemini làm giọng Ý tưởng thứ ba, kiểm chứng sự thật cho Kịch bản, **sinh ảnh nền/đạo cụ** (Codex không tự sinh ảnh nền nữa), xem trước khung hình QC, tìm chủ đề; Claude brief, xem, chốt. **Đã làm và thử thật (20/11/2026):** `studio/src/agy.mjs`, `studio/src/gemini-run.mjs` (5 chế độ), provider `gemini` trong kho tài khoản (1 ghế dùng chung), mẫu prompt `gemini-*.md`, sửa `make-plan`/`planner`/`visual-director`/`support`/`scout`, Sản xuất đọc `assets/gen/approved.json`; test `studio/test/gemini.test.mjs`. **CHƯA KIỂM trên chủ đề thật:** cả luồng ba agent chưa chạy qua một video; Producer chưa dùng ảnh Gemini thật; thông báo hết limit của `agy` chưa gặp; điều khoản Antigravity không nói quyền dùng thương mại ảnh AI. **Máy mới:** cài lại `agy` bằng trình cài chính thức của Google (đọc script trước khi chạy, cần phép giám đốc), tự đăng nhập bằng trình duyệt, đặt "Use AI Credits" là `off`, rồi `accounts add gemini main`. Chi tiết: `docs/accounts.md` mục Gemini. **Mô hình mặc định của ghế agy = Claude Opus 4.6 (Thinking)** (giám đốc chọn 20/11/2026, trong hạn mức gói Google AI Pro; đổi bằng `STUDIO_GEMINI_MODEL`); **hết hạn mức thì cùng lượt tự chạy lại bằng Gemini 3.8 Flash (High)** (giám đốc chốt 21/11/2026; `STUDIO_GEMINI_FALLBACK_MODEL`, `none` để tắt); thử thật: tìm web, sinh ảnh, xem ảnh đều chạy với mô hình này. **Cảnh báo an toàn (đo trên đĩa):** `agy --sandbox` KHÔNG chặn ghi file (ghi tự do trong thư mục làm việc, và cả bên ngoài nếu nó dưới `trustedWorkspaces` của agy), nên `gemini-run.mjs` chạy agy trong thư mục tạm `.local/gemini-work/` và từ chối chạy nếu nó nằm trong vùng tin cậy; đừng thêm thư mục dự án vào `trustedWorkspaces`. Bảng cân bằng tải đã có: `node studio/src/cli.mjs load [--days N] [--backfill]` và panel trên dashboard (số liệu 7 ngày ngày 20/11: Claude 61% · Codex 39% · Gemini ≈ 0%, tức chưa cân bằng; xem `docs/accounts.md`).
  - **Quy tắc sửa hệ thống (18/11/2026):** 5 dòng trong CLAUDE.md, mục "Quy tắc sửa hệ thống". Trước khi commit/push chạy `node tools/scan-public.mjs`.
  - **Worker tự bật cùng Windows:** làm sau demo.
  - **Codex hết limit:** giám đốc sẽ cấp thêm tài khoản Codex cho phòng (đã chốt 18/11/2026); không cần quy tắc cho Claude viết kịch bản thay. Thêm tài khoản chỉ giúp tự chuyển khi hết limit; muốn chạy song song nhiều việc Codex thì nâng cài đặt `concurrency_codex`.
  - **Vai Tài nguyên & Linh vật (gộp T1+T4):** hoãn — làm demo trước; giám đốc duyệt demo xong sẽ hỏi lại (18/11/2026).
  - **Giọng đọc:** giữ 4 giọng đã chốt 19/11/2026 (nam chính Hải Đăng, nữ chính Trúc Ly, nam phụ Quốc Tuấn, nữ phụ Ngọc Huyền); **không cài** công cụ nhận dạng tiếng nói để kiểm giọng; cần thêm giọng thì đề xuất để giám đốc duyệt. Giọng đọc do giám đốc nghe kiểm.

## Còn chờ giám đốc quyết
Phần lớn đã chốt (xem danh sách trên và `docs/CHECKLIST.md`). Còn lại: (1) giao chủ đề demo trên dashboard (phòng IT đã mở, chỉ tiêu 1/ngày) rồi nhờ Claude xếp việc kế hoạch; (2) vai Tài nguyên & Linh vật (T1+T4): giám đốc sẽ hỏi lại sau khi duyệt demo; (3) 6 câu mở sau T3/T4 (xem `docs/CHECKLIST.md` mục 4). Cơ cấu vai trò giám đốc báo đã xong; **đổi 20/11/2026:** Kịch bản do Claude viết và chốt (Codex cùng viết phần lời kỹ thuật), Đạo diễn hình ảnh vẫn Codex làm, Claude duyệt. Việc giao cho agent: `docs/viec-cho-agent.md`.

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
- **Giám đốc:** đăng nhập Codex/Claude (và `agy` cho Gemini, qua trình duyệt), mở phòng + giao chủ đề, duyệt kế hoạch/demo, quyết các mục còn chờ.
- **Claude (khi được báo):** cài thư viện **của dự án**, chạy test, bật xưởng, chạy thử video đầu–cuối, đo và báo số liệu thật.
- **Agent khác:** nhép miệng cho Cáo theo `docs/prompts/lipsync-cao.md` và các việc trong `docs/viec-cho-agent.md`.

## Thay đổi 20/11/2026 — giọng / âm thanh / opening / mẫu cảnh / QC

Đặt `$ep` là thư mục tập và `$voice` là `$ep/assets/voice`. Chuẩn bị spec giọng theo `tools/voice/README.md`; tạo timeline cảnh trước khi lập cue sheet theo `tools/audio/README.md`.

```powershell
node tools/voice/prosody.mjs plan --script "$ep/script.md" --storyboard "$ep/storyboard.json" --out "$voice/prosody-plan.json"
python -X utf8 studio/renderer-remotion/scripts/gen_vo.py "$voice/spec.json" --plan "$voice/prosody-plan.json" --out "$voice"
node tools/voice/prosody.mjs timeline --plan "$voice/prosody-plan.json" --durations "$voice/generation.json" --mode free --out "$voice/voice-timeline.json"
python -X utf8 tools/voice/assemble.py --clips "$voice/generation.json" --timeline "$voice/voice-timeline.json" --out "$voice/voice-track.wav" --cues-out "$voice/cues.json" --scenes-out "$voice/voice-scenes.json"
python -X utf8 tools/voice/prosody_metrics.py --track "$voice/voice-track.wav" --timeline "$voice/voice-timeline.json" --plan "$voice/prosody-plan.json" --generation "$voice/generation.json" --scenes "$voice/voice-scenes.json" --out "$voice/metrics.json"
python -X utf8 tools/audio/cuesheet.py build --ep $ep
python -X utf8 tools/audio/mix.py --ep $ep --voice "$voice/voice-track.wav"
node tools/qc-measure.mjs $ep
```

Dùng `--only <line_id>` với `gen_vo.py` để dựng lại một dòng có cache hợp lệ cho các dòng khác. Dùng `--mode fit --scenes <scenes.json>` khi cần giữ cửa sổ cảnh. Opening và mẫu cảnh dùng `choose_style`, `opening_sequence` và các API trong `tools/motion/README.md`. Các luật nằm ở R24–R28 trong `docs/chat-luong-xem.md`.

**Đang chờ giám đốc:** nghe giọng, nhạc và SFX, xem opening và duyệt mạch kể. Có thể tạo bản mẫu nhạc ngoài thư mục thành phẩm bằng `python -X utf8 tools/audio/music_synth.py --seed demo --mood tech_explainer --duration 12 --out "$musicWav"` với `$musicWav` là đường dẫn WAV mẫu. Nếu muốn bật nhạc sau khi nghe, dùng `--music on` với mixer. Khởi động lại xưởng bằng `npm run start --prefix studio` để nạp phần sửa trong `studio/`.
