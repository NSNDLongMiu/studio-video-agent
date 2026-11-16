# Checklist của team — đưa xưởng video vào chạy thật

> Đánh dấu ngay trên dashboard (khung "Checklist của team") hoặc sửa `[ ]` → `[x]` trong file này. Làm dần từ trên xuống.
> Bức tranh chung, các giai đoạn và việc cần giám đốc quyết: `docs/PLAN.md`.
> Kế hoạch chuyển sang PC mới (tối nay): `docs/PLAN-CHUYEN-MAY.md`.

## 1. Bắt buộc trước khi chạy thật
- [ ] Đăng nhập Codex bằng tài khoản ChatGPT Plus: `codex login` → chọn "Sign in with ChatGPT"
- [ ] Mở Claude Code ở `e:\Tiktoker`, đồng ý cho MCP `studio` (đang "Pending approval")
- [ ] Quyết định có ghi `.claude/settings.json` không (cho phép trước công cụ đọc/báo cáo của `studio` để agent không bị hỏi liên tục; công cụ duyệt vẫn bắt hỏi) — nói "ghi settings" nếu đồng ý
- [ ] Trong thư mục dự án chạy `codex` một lần, chọn tin cậy (Trust) để Codex nạp `.codex/config.toml`
- [ ] Chạy `npm run start --prefix studio` (dashboard + worker nền) và mở http://localhost:4747
- [ ] Mở **Văn phòng 2D** để xem các agent như đang ngồi làm: `npm run office --prefix studio` (hoặc nút 🏢 trên dashboard). Đọc mục "Riêng tư" trong `docs/office.md` trước khi chia sẻ màn hình
- [ ] Mở phòng ban đầu tiên bằng nút "+ Mở phòng ban" (hoặc nói với Claude)

## 2. Tài khoản & tự chuyển khi hết limit
- [ ] `node studio/src/cli.mjs accounts init` — đăng ký đăng nhập Claude đang có trên máy thành `claude/main`
- [ ] Thêm tài khoản Codex đầu tiên: `accounts add codex <nhãn> --owner "Tên"` rồi `accounts login codex/<nhãn>`
- [ ] Mỗi thành viên dùng **tài khoản của chính họ** (1 người = 1 ghế): thêm `accounts add claude|codex <nhãn> --owner "Tên"` + `accounts login …`
- [ ] Chạy `accounts check --probe` để chắc từng tài khoản gọi được thật (tốn rất ít hạn mức)
- [ ] Đọc `docs/accounts.md` mục "Điều khoản" và thống nhất cách dùng tài khoản trong team
- [ ] (Tuỳ chọn) Tài khoản API trả phí làm dự phòng cuối + bật "dùng API trả phí" trên dashboard + đặt `--max-runs-per-day`
- [ ] Lần hết limit thật đầu tiên: xem nguyên văn thông báo ở khung Tài khoản và báo lại để chỉnh bộ đọc giờ hồi (`studio/src/limits.mjs`)
- [ ] (Tuỳ chọn) Cho worker tự bật khi đăng nhập Windows: chạy `studio/scripts/install-worker-task.ps1`

## 3. Nguyên liệu sản xuất (xem docs/asset-sources.md)
- [ ] Xem `brand/cao/catalog.png` (46 dáng, đặt tên theo ý nghĩa) và đổi tên dáng nào chưa hợp (`tools/fox/names.json`)
- [x] Văn phong: trẻ trung, câu chữ văn phòng (đã chốt, quy tắc ở `docs/mascot.md`)
- [ ] Chọn **bộ câu chào** của Cáo trong 4 bộ đề xuất (`docs/mascot.md`)
- [ ] Xin **bản ảnh Cáo độ phân giải cao hơn** (sticker hiện cao ~330px, khi dựng bị phóng ~2,2 lần nên mềm) và/hoặc bộ đầu–miệng cùng góc nhìn nếu muốn Cáo nhép miệng
- [x] Luôn gắn nhãn AI cho mọi video (đã chốt)
- [ ] Cho biết ảnh Cáo tạo bằng công cụ nào (để kiểm điều khoản dùng thương mại của công cụ đó)
- [ ] **Nghe thử và chọn 1 giọng Bắc + 1 giọng Nam** (đề xuất, giấy phép và cách nghe thử ở `docs/voice.md`; mẫu sẽ tạo trên PC mới)
- [ ] Giao `docs/prompts/lipsync-cao.md` cho một agent khác để làm nhép miệng cho Cáo (nên sau khi chọn giọng)
- [ ] (Tuỳ chọn) Trang phục/phụ kiện Cáo theo phòng ban (áo thể thao, tai nghe…) — cần thêm ảnh từ giám đốc
- [ ] Chọn nguồn ảnh/clip: kho stock có API, hay tự bỏ vào `library/images`, `library/footage`
- [ ] Đặt nhạc nền có giấy phép rõ ràng vào `library/music/` + ghi `LICENSES.md`
- [ ] Quyết định có dùng ảnh/clip do AI tạo không
- [ ] Quyết định khi nào làm đăng bài tự động (hiện giám đốc tự đăng)

## 4. Chạy thử đầu–cuối
- [ ] Giao 1 chủ đề thử: `/new-topic <phòng> | <chủ đề> | <yêu cầu thêm>`
- [ ] Đọc `concept.md`, `debate.md`, `plan.md` mà 2 agent Claude tạo ra; chỉnh brief/phong cách nếu chưa ưng
- [ ] Bấm "Duyệt & sản xuất" → xem Codex dựng 1 video thật và QC của Claude
- [ ] Đăng thử 1 video lên cả 3 nền tảng, ghi lại chỗ cần sửa của `publish.json`
- [ ] Rà lại `docs/platform-specs.md` với chính sách hiện hành của từng nền tảng

## 5. Vận hành hằng ngày
- [ ] Đặt chỉ tiêu video/ngày cho từng phòng
- [ ] Thử đổi chỉ tiêu → `/dept-review <phòng>` → duyệt đề xuất thêm đội
- [ ] Phân công người theo dõi dashboard mỗi ngày (khung "Cần giám đốc chú ý")
