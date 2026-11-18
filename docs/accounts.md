# Tài khoản Claude / Codex, tự chuyển khi hết limit, tự chờ rồi chạy tiếp

## Cách hoạt động
Việc nền (ý tưởng→kế hoạch, sản xuất, QC, gỡ vướng) không chạy trong phiên Claude của bạn mà qua **hàng đợi** + **worker**:

1. Worker lấy việc → chọn tài khoản còn dùng được (ưu tiên số nhỏ, "dính" tài khoản vừa chạy tốt cho tới khi nó hết limit).
2. Tài khoản **hết limit** → đánh dấu "hết limit đến HH:mm" → **tự chuyển** sang tài khoản kế tiếp, việc làm tiếp từ chỗ dở (Claude/Codex được dặn đọc file đã có và tiếp tục, không làm lại).
3. **Mọi** tài khoản đều hết → việc chuyển "CHỜ", worker ngủ tới giờ hồi sớm nhất rồi **tự chạy tiếp**. Không có tài khoản nào dùng được (chưa thêm/đã tắt/lỗi đăng nhập) → việc chờ, **thêm/bật/đăng nhập lại là tự chạy**, không cần bấm gì.
4. Lỗi đăng nhập → tài khoản đó bị loại ra cho tới khi bạn đăng nhập lại; việc sang tài khoản khác.
5. Codex kẹt → Claude tự gỡ (tối đa 4 lần/video) rồi sản xuất lại (dưới 10 lần/video); vượt ngưỡng thì dừng và báo bạn.

Tất cả nằm trong SQLite → tắt máy/đóng worker rồi mở lại vẫn tiếp tục đúng chỗ. Xem bất kỳ lúc nào: dashboard (khung **Tài khoản**, **Hàng đợi việc nền**, **Cần chú ý**) hoặc `node studio/src/cli.mjs status`.

## Thiết lập
```powershell
# bật dashboard + worker (giữ cửa sổ này mở, hoặc dùng scripts/install-worker-task.ps1 để tự bật khi đăng nhập Windows)
npm run start --prefix studio

# tài khoản đang đăng nhập sẵn trên máy -> claude/main (và codex/main nếu đã codex login)
node studio/src/cli.mjs accounts init --owner "Tên bạn"

# thêm tài khoản của thành viên: tạo thư mục đăng nhập riêng rồi đăng nhập bằng trình duyệt
node studio/src/cli.mjs accounts add codex nam --owner "Nam"
node studio/src/cli.mjs accounts login codex/nam
node studio/src/cli.mjs accounts add claude lan --owner "Lan"
node studio/src/cli.mjs accounts login claude/lan

node studio/src/cli.mjs accounts check --probe   # gọi thử thật 1 câu cực ngắn cho từng tài khoản
node studio/src/cli.mjs accounts                 # danh sách + trạng thái
```
Mỗi tài khoản có thư mục riêng `studio/accounts/<claude|codex>/<nhãn>/` (Claude: `CLAUDE_CONFIG_DIR`; Codex: `CODEX_HOME`, token ở `auth.json` — **coi như mật khẩu**, đã nằm trong `.gitignore`). Khoá/token không bao giờ vào cơ sở dữ liệu.

Xếp việc nền: `/new-topic …`, `/produce …` trong Claude, hoặc `node studio/src/cli.mjs enqueue plan <topic-id>` (kế hoạch xong tự sản xuất theo cài đặt `auto_produce`, mặc định bật; thêm `--no-auto-produce` nếu chỉ muốn lập kế hoạch), `enqueue produce <video-id>`. Dashboard có nút **Duyệt & sản xuất** cho kế hoạch dừng lại chờ duyệt (chỉ khi tắt `auto_produce`).

## Tài khoản API trả phí — KHÔNG DÙNG (giám đốc quyết 18/11/2026)
**Quyết định:** không dùng API và dịch vụ AI trả phí; chỉ dùng các tài khoản gói đã cấp, tuyệt đối không tự ý gây phát sinh phí dịch vụ. Hết limit → worker chuyển sang tài khoản đã cấu hình; hết sạch → dừng và chờ giờ hồi (đúng như mục "Cách hoạt động" ở trên). `paid_fallback` giữ **off**, không thêm tài khoản `api_key`. Phần dưới chỉ là mô tả kỹ thuật của tính năng (đang bị khoá theo quyết định này).

Thêm tài khoản kiểu `api_key` (Claude: `--secret-file <file chứa key>`; Codex: `codex login --with-api-key` vào thư mục tài khoản). Chỉ được dùng khi **mọi** tài khoản gói đều hết limit **và** bạn bật "dùng API trả phí" trên dashboard (hoặc `settings paid_fallback on`). Đặt thêm `--max-runs-per-day N` để chặn tiền chạy mất kiểm soát; Claude API còn bị chặn bởi `--max-budget-usd` (mặc định 5 USD/lượt, đổi bằng `STUDIO_API_BUDGET_USD`).

## Điều khoản — đọc trước khi thêm nhiều tài khoản
Hệ thống kỹ thuật cho phép xoay vòng nhiều tài khoản, nhưng **điều khoản của nhà cung cấp là phần bạn chịu trách nhiệm**:
- **OpenAI**: điều khoản kinh doanh cấm vượt/né "Usage Limits"; hợp đồng dịch vụ quy định mỗi tài khoản chỉ dành cho **một người dùng**. OpenAI có quyền khoá tài khoản vi phạm.
- **Anthropic**: có nhân viên nói sở hữu nhiều tài khoản Max không vi phạm, nhưng có người dùng báo bị khoá do hệ thống phát hiện lạm dụng tự động; điều khoản cấm dùng token đăng nhập gói trong sản phẩm/công cụ khác (ở đây chỉ chạy chính CLI `claude` chính thức).
- Cách dùng **ít rủi ro** nhất: **mỗi tài khoản là ghế của một người thật trong team** (đúng trường "chủ tài khoản"), và dùng các cơ chế **chờ hồi limit** + **API trả phí** (đúng quy định, trả tiền để có thêm năng lực) thay vì một người nuôi nhiều tài khoản gói để né giới hạn.
- **Hiện trạng (18/11/2026):** 5 ghế: `claude/main`, `claude/b`, `claude/c` (**cùng một email = cùng một tài khoản Claude**, chung một hạn mức nên chuyển giữa 3 ghế này không thêm năng lực), `claude/dev-longvu` (tài khoản Claude thứ hai, cấp riêng cho phòng `it`) và `codex/main` (cấp cho phòng `it`). Phòng đã có tài khoản riêng thì chỉ dùng tài khoản đó, hết limit thì chờ (không mượn ghế dùng chung). Giám đốc xác nhận đã đọc mục này; API trả phí không dùng (xem mục dưới).
- Nguồn: [Anthropic – các báo cáo về điều khoản & nhiều tài khoản](https://metricnexus.ai/blog/anthropic-banning-multiple-claude-accounts), [OpenAI Business Terms – điều khoản dùng giới hạn](https://openai.com/policies/may-2025-business-terms/), [OpenAI Services Agreement](https://openai.com/policies/services-agreement/). Điều khoản thay đổi — hãy đọc bản hiện hành.

## Codex dùng cho cả tranh luận ý tưởng (18/11/2026)
Theo bộ core (luật #6 trong `CLAUDE.md`), Codex làm cả Ý tưởng (giọng Codex), Kịch bản và Đạo diễn hình ảnh trong việc `plan`, không chỉ sản xuất (`produce`). Hiện chỉ có **1 tài khoản Codex** (`codex/main`) trong kho — nếu 1 video đang sản xuất đúng lúc 1 đội khác đang tranh luận ý tưởng, cả hai cùng cần tài khoản đó. `codex-ideate.mjs` tự bỏ qua lượt góp ý (báo `BUSY`), còn `codex-write.mjs` (Kịch bản/storyboard) thì cho việc `plan` tạm dừng chờ Codex (`CODEX_WAIT`) nếu phát hiện có việc `produce` đang chạy, thay vì chạy 2 tiến trình `codex exec` cùng lúc chung thư mục đăng nhập (chưa kiểm chứng việc đó có an toàn không). Vì Codex giờ gánh nhiều việc hơn, cân nhắc thêm 1 tài khoản Codex thứ 2 để giảm tranh chấp.

## Giới hạn đã biết
- **Định dạng thông báo hết limit không được công bố chính thức.** Bộ đọc (`studio/src/limits.mjs`) dựa trên mẫu người dùng báo: `resets 3pm (múi giờ)`, `try again at Jul 7th, 2026 12:35 AM`, `try again in 3 hours…`. Không đọc được giờ hồi thì lùi dần 30 phút → 1 giờ → 2 giờ → 4 giờ → tối đa 6 giờ rồi thử lại. Nguyên văn thông báo được lưu ở khung Tài khoản.
- Codex/Claude đôi khi báo "hết limit" sai khi còn hạn mức (lỗi phía nhà cung cấp, thường khỏi sau khi đăng nhập lại). Có nút **"Đã hồi limit"** để thử lại ngay.
- Mỗi lần gọi `claude -p` có chi phí khởi động cố định (vài cent theo ước tính của CLI, tính vào hạn mức gói).
- Đăng nhập Claude/Codex hết hạn theo thời gian: tài khoản sẽ hiện "LỖI ĐĂNG NHẬP" và việc tự sang tài khoản khác; đăng nhập lại bằng `accounts login <tk>`.
- Worker chạy trên **máy này**: máy tắt/ngủ thì việc dừng và tiếp tục khi máy bật lại.

## Cấp tài khoản theo phòng (chốt 18/11/2026)
- `node studio/src/cli.mjs accounts assign <provider/nhãn> <mã-phòng>` (hoặc nút "Cấp cho phòng" trên dashboard); `none` = trả về dùng chung.
- Phòng đã được cấp tài khoản của 1 provider → việc của phòng **chỉ** chạy bằng tài khoản đó (tắt/hết limit/chưa đăng nhập thì việc chờ, không lấn sang tài khoản khác). Phòng chưa được cấp → dùng tài khoản dùng chung. Tài khoản đã cấp không bị phòng khác mượn. Lượt góp ý Codex trong bước plan (`codex-ideate.mjs`) cũng theo phòng của việc (worker truyền `STUDIO_DEPT`).
- Chỉ tài khoản đã cấp cho phòng mới được theo dõi trên Văn phòng 2D (`docs/office.md`).
- **Email đăng nhập là tên chính** để phân biệt ghế (dashboard, CLI, Văn phòng 2D, sự kiện): đọc tự động từ file đăng nhập (`.claude.json` của ghế, hoặc `~/.claude.json` với ghế mặc định; Codex: `auth.json` của ghế hoặc `~/.codex`). Đăng nhập lại bằng tài khoản khác là email tự đổi theo. Lệnh nhận cả email: `accounts assign <email> it`.
- Hiện tại: phòng `it` ← Codex <email> (ghế main), Claude ghế dev-longvu (chủ khai riêng; kiểm 18/11/2026: đã đăng nhập). Dùng chung: Claude <email> ở cả 3 ghế main, b, c (**cùng một email**, nên thực chất chung một hạn mức).
