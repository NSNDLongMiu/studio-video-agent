# Tài khoản Claude / Codex, tự chuyển khi hết limit, tự chờ rồi chạy tiếp

## Cách hoạt động
Việc nền (ý tưởng→kế hoạch, sản xuất, QC, gỡ vướng) không chạy trong phiên Claude của bạn mà qua **hàng đợi** + **worker**:

1. Worker lấy việc → chọn tài khoản còn dùng được (ưu tiên số nhỏ, "dính" tài khoản vừa chạy tốt cho tới khi nó hết limit).
2. Tài khoản **hết limit** → đánh dấu "hết limit đến HH:mm" → **tự chuyển** sang tài khoản kế tiếp, việc làm tiếp từ chỗ dở (Claude/Codex được dặn đọc file đã có và tiếp tục, không làm lại).
3. **Mọi** tài khoản đều hết → việc chuyển "CHỜ", worker ngủ tới giờ hồi sớm nhất rồi **tự chạy tiếp**. Không có tài khoản nào dùng được (chưa thêm/đã tắt/lỗi đăng nhập) → việc chờ, **thêm/bật/đăng nhập lại là tự chạy**, không cần bấm gì.
4. Lỗi đăng nhập → tài khoản đó bị loại ra cho tới khi bạn đăng nhập lại; việc sang tài khoản khác.
5. Codex kẹt → Claude tự gỡ (tối đa 2 lần/video) rồi sản xuất lại (tối đa 4 lần/video); vượt ngưỡng thì dừng và báo bạn.

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

Xếp việc nền: `/new-topic …`, `/produce …` trong Claude, hoặc `node studio/src/cli.mjs enqueue plan <topic-id> --auto-produce`, `enqueue produce <video-id>`. Dashboard có nút **Duyệt & sản xuất** cho kế hoạch đã xong.

## Tài khoản API trả phí (dự phòng cuối, mặc định TẮT)
Thêm tài khoản kiểu `api_key` (Claude: `--secret-file <file chứa key>`; Codex: `codex login --with-api-key` vào thư mục tài khoản). Chỉ được dùng khi **mọi** tài khoản gói đều hết limit **và** bạn bật "dùng API trả phí" trên dashboard (hoặc `settings paid_fallback on`). Đặt thêm `--max-runs-per-day N` để chặn tiền chạy mất kiểm soát; Claude API còn bị chặn bởi `--max-budget-usd` (mặc định 5 USD/lượt, đổi bằng `STUDIO_API_BUDGET_USD`).

## Điều khoản — đọc trước khi thêm nhiều tài khoản
Hệ thống kỹ thuật cho phép xoay vòng nhiều tài khoản, nhưng **điều khoản của nhà cung cấp là phần bạn chịu trách nhiệm**:
- **OpenAI**: điều khoản kinh doanh cấm vượt/né "Usage Limits"; hợp đồng dịch vụ quy định mỗi tài khoản chỉ dành cho **một người dùng**. OpenAI có quyền khoá tài khoản vi phạm.
- **Anthropic**: có nhân viên nói sở hữu nhiều tài khoản Max không vi phạm, nhưng có người dùng báo bị khoá do hệ thống phát hiện lạm dụng tự động; điều khoản cấm dùng token đăng nhập gói trong sản phẩm/công cụ khác (ở đây chỉ chạy chính CLI `claude` chính thức).
- Cách dùng **ít rủi ro** nhất: **mỗi tài khoản là ghế của một người thật trong team** (đúng trường "chủ tài khoản"), và dùng các cơ chế **chờ hồi limit** + **API trả phí** (đúng quy định, trả tiền để có thêm năng lực) thay vì một người nuôi nhiều tài khoản gói để né giới hạn.
- Nguồn: [Anthropic – các báo cáo về điều khoản & nhiều tài khoản](https://metricnexus.ai/blog/anthropic-banning-multiple-claude-accounts), [OpenAI Business Terms – điều khoản dùng giới hạn](https://openai.com/policies/may-2025-business-terms/), [OpenAI Services Agreement](https://openai.com/policies/services-agreement/). Điều khoản thay đổi — hãy đọc bản hiện hành.

## Giới hạn đã biết
- **Định dạng thông báo hết limit không được công bố chính thức.** Bộ đọc (`studio/src/limits.mjs`) dựa trên mẫu người dùng báo: `resets 3pm (múi giờ)`, `try again at Jul 7th, 2026 12:35 AM`, `try again in 3 hours…`. Không đọc được giờ hồi thì lùi dần 30 phút → 1 giờ → 2 giờ → 4 giờ → tối đa 6 giờ rồi thử lại. Nguyên văn thông báo được lưu ở khung Tài khoản.
- Codex/Claude đôi khi báo "hết limit" sai khi còn hạn mức (lỗi phía nhà cung cấp, thường khỏi sau khi đăng nhập lại). Có nút **"Đã hồi limit"** để thử lại ngay.
- Mỗi lần gọi `claude -p` có chi phí khởi động cố định (vài cent theo ước tính của CLI, tính vào hạn mức gói).
- Đăng nhập Claude/Codex hết hạn theo thời gian: tài khoản sẽ hiện "LỖI ĐĂNG NHẬP" và việc tự sang tài khoản khác; đăng nhập lại bằng `accounts login <tk>`.
- Worker chạy trên **máy này**: máy tắt/ngủ thì việc dừng và tiếp tục khi máy bật lại.
