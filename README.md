# Xưởng video ngắn (TikTok · Facebook · YouTube Shorts)

Bạn là **giám đốc**. Claude lo ý tưởng + kế hoạch, **Codex (ChatGPT Plus) lo làm chi tiết và dựng**, Claude ra hỗ trợ khi Codex kẹt. Mọi thứ nằm trong một cơ cấu bạn kiểm soát được.

## Cơ cấu
```
Giám đốc (bạn)
 └─ Phòng ban (Thể thao, IT, …) — trưởng phòng là 1 agent Claude, CHỈ ĐỀ XUẤT
     └─ Đội = 1 bộ video / 1 nhóm ý tưởng (~2 video/ngày)
         Ý tưởng A (Claude) ⇄ Ý tưởng B (Claude) → Planner (Claude) → Producer (CODEX)
         + Hỗ trợ & QC (Claude, trực khi Codex kẹt hoặc khi duyệt thành phẩm)
```
**Chỉ bạn** mở/đóng phòng, đặt chỉ tiêu, và duyệt nhân sự. Ví dụ: bạn đặt Thể thao lên 4 video/ngày → trưởng phòng rà soát → đề xuất "thêm 1 đội" → **bạn bấm Duyệt** → dashboard hiện Thể thao có 2 đội / 4 video; IT 1 đội / 1 video.

## Bắt đầu (checklist đầy đủ: `docs/CHECKLIST.md`, cũng hiện trên dashboard)
0. **Bật hệ thống:** `npm run start --prefix studio` = dashboard + **worker nền** (tự chạy việc, tự chuyển tài khoản khi hết limit, tự chờ hồi limit rồi chạy tiếp). Xem `docs/accounts.md`.
1. **Đăng nhập Codex** (1 lần, cần bạn tự làm): `codex login` → chọn *Sign in with ChatGPT* (gói Plus).
2. **Dashboard**: http://localhost:4747 (xem thử dữ liệu mẫu: `npm run demo --prefix studio` trên DB trống).
   **Nhiều tài khoản:** `node studio/src/cli.mjs accounts init`, `accounts add codex <nhãn> --owner "Tên"`, `accounts login codex/<nhãn>` (mỗi thành viên 1 tài khoản của chính họ).
3. Mở Claude Code ở thư mục này. Lần đầu nó hỏi cho phép MCP `studio` — đồng ý.
4. **Mở phòng ban** bằng nút trên dashboard (hoặc nói với Claude: "mở phòng Thể thao, chỉ tiêu 2 video/ngày, 1 đội").
5. **Giao chủ đề**: `/new-topic sport | 3 sai lầm khi chạy bộ | giọng vui, 30 giây | số-tập=2`
   → đội nhận việc → 2 agent Claude tranh luận → Planner viết kế hoạch (`content/sport/T1-…/plan.md`).
6. Bạn đọc kế hoạch → `/produce SPORT-T1-E01 SPORT-T1-E02` → Codex dựng, Claude QC.

## Lệnh (trong Claude Code)
| Lệnh | Việc |
|---|---|
| `/studio-status [phòng]` | Ai đang làm gì, mỗi phòng/đội bao nhiêu người & video |
| `/new-topic …` | Giao chủ đề + xếp việc ý tưởng → kế hoạch chạy nền |
| `/make-plan <topic-id> [tập] [vòng]` | Chạy lại/chạy riêng bước ý tưởng → kế hoạch |
| `/produce <video-id…>` | Xếp việc cho Codex làm (nền); xong tự QC |
| `/qc <video-id>` | Claude QC thành phẩm (worker tự gọi sau khi Codex xong) |
| `/rescue <video-id>` | Claude gỡ vướng khi Codex kẹt (worker tự gọi khi Codex kẹt) |
| `/dept-review <phòng>` | Trưởng phòng rà năng lực & đề xuất nhân sự |

Terminal: `node studio/src/cli.mjs status | accounts … | jobs [cancel|retry|log <id>] | enqueue … | approve <id> | reject <id>`.

## Kiểm soát
- **Dashboard** (tự làm mới 3 giây): từng phòng → đội → từng người (Claude/Codex) đang làm gì, bao lâu chưa cập nhật (⚠ nếu im lặng > 30 phút), video theo giai đoạn, nhật ký, và khung **"Cần giám đốc chú ý"** (đề xuất chờ duyệt có nút Duyệt/Từ chối, video vướng, thiếu năng lực).
- **Phân quyền thật sự:** MCP `studio` có 2 vai. Codex và các subagent chạy vai `agent` — *không tồn tại* công cụ duyệt/mở-đóng phòng/đặt chỉ tiêu với họ. Phiên Claude của bạn có các công cụ đó, và Claude Code hỏi xác nhận trước khi chạy chúng. Dashboard chỉ nghe ở `127.0.0.1`, chặn Host/Origin lạ.
- **Tự động & kiểm tra bất kỳ lúc nào:** dashboard có khung **Tài khoản** (còn dùng được / hết limit đến HH:mm / lỗi đăng nhập), **Hàng đợi việc nền** (đang chạy / chờ hồi limit tự chạy lại lúc nào / cần người), và **worker** còn sống không. `status` trong terminal cho cùng thông tin.
- **Văn phòng 2D** (`npm run office --prefix studio` hoặc nút 🏢 trên dashboard): thấy các agent Claude/Codex như đang ngồi trong văn phòng, không tốn token. Nhóm theo dự án chứ không theo phòng ban (phần đó xem ở dashboard). Hiện mọi dự án trên máy — xem mục Riêng tư trong `docs/office.md`.
- **Hạn mức:** đội không nhận quá `capacity_per_day` video/ngày; muốn thêm phải qua đề xuất → bạn duyệt.
- Đóng phòng bị từ chối nếu còn video đang làm (trừ khi bạn chọn "huỷ và đóng").

## Cấu trúc
```
CLAUDE.md / AGENTS.md          luật cho Claude / cho Codex
.claude/agents  .claude/skills agent & lệnh của Claude
.agents/skills/video-producer  skill của Codex (công thức ffmpeg đã kiểm chứng)
.codex/config.toml             MCP của Codex (vai agent) — nạp khi bạn "tin cậy" dự án
.mcp.json                      MCP của Claude (vai director)
studio/                        lõi: SQLite + MCP + dashboard + CLI (+ test: npm test --prefix studio)
tools/qc-video.mjs             QC tự động (9:16, codec, âm lượng, thời lượng)
tools/fox/                      tách sticker Cáo từ assets/mascot, đặt tên, dựng lớp dẫn truyện trong suốt
tools/mascot/                  (đã ngừng dùng) bộ vẽ linh vật Chíp cũ
tools/whatsmyagentdoing/       Văn phòng 2D (bản ghim v0.8.1, chạy bằng `npm run office`; xem docs/office.md)
brand/cao/                      sticker Cáo văn phòng: poses/ faces/ mouths/ motion/ + catalog.png (xem docs/mascot.md)
assets/mascot/                 ảnh nguồn của giám đốc (KHÔNG sửa)
content/<phòng>/T<id>-<slug>/  sản phẩm của từng bộ video
library/                       nhạc/ảnh/clip BẠN cung cấp (nguồn duy nhất ngoài đồ hoạ tự tạo)
docs/                          checklist, tài khoản & limit, chuẩn nền tảng, nguồn nguyên liệu
```

## Việc bạn cần quyết (đang để trống có chủ ý)
Xem `docs/asset-sources.md`: giọng đọc (TTS), kho ảnh/clip, nhạc nền, ảnh AI, đăng bài tự động. Chưa có thì xưởng làm video chữ động/infographic + nhạc/phụ đề từ `library/`.
