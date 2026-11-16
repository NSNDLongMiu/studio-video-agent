# Văn phòng 2D — xem các agent như đang ngồi làm việc

Dùng [whatsmyagentdoing](https://github.com/Charonyuu/whatsmyagentdoing) (giấy phép MIT), **chế độ 2D**, bản **v0.8.1** (commit `c69bf2bc98cf96a63d146070e9bbc83b507bf0bf`) được ghim vào `tools/whatsmyagentdoing/`. Mỗi agent (Claude, Codex…) là một nhân vật trong văn phòng isometric: đang nghĩ, đang chạy công cụ, đang viết, chờ bạn, hay đã xong. Bên phải có danh sách trạng thái.

## Dùng
```powershell
npm run office --prefix studio              # bật (mở trình duyệt, 2D)
npm run office --prefix studio -- --private # ẩn nội dung chat (tên dự án vẫn hiện, xem Riêng tư)
npm run office --prefix studio -- stop      # tắt
npm run office --prefix studio -- status
```
Hoặc bấm nút **🏢 Văn phòng 2D** trên dashboard (http://localhost:4747). Địa chỉ: http://localhost:4545/?view=office&quality=mid (`quality=mid` = 2D).
Tuỳ chọn: `--hours N` (chỉ hiện phiên hoạt động trong N giờ gần nhất, mặc định 24) · `--default-only` (không chạy bản cho tài khoản phụ) · `--no-open`.

## Token và tài nguyên
- **Không tốn token.** Đã đọc mã nguồn: không có đoạn nào gọi dịch vụ AI; chỉ đọc file log mà Claude/Codex đã ghi sẵn. Mình chạy thẳng `node bin/cli.js` chứ **không** qua skill `/myoffice` (skill sẽ tốn vài trăm token mỗi lần gọi trong một phiên Claude).
- Không cài hook, không sửa cấu hình Claude/Codex (hook `--install-hook` là tuỳ chọn, mình không bật).
- Chạy là một tiến trình Node quét log mỗi giây cộng một tab trình duyệt. Chưa đo CPU/RAM thực tế.
- Không gọi mạng: mình đặt `WMAD_NO_UPDATE_CHECK=1` (mặc định nó hỏi GitHub về bản mới khoảng 30 phút một lần).

## Riêng tư (đọc trước khi chia sẻ màn hình)
- Nó hiện **mọi dự án trên máy này**, không chỉ xưởng video: tên thư mục dự án của bạn (vd các dự án công việc khác) sẽ hiện trên màn hình.
- `--private` ẩn nội dung hỏi/đáp và tiêu đề phiên, **nhưng tên dự án vẫn hiện**. Đã kiểm trên ảnh chụp thật.
- Chỉ lắng nghe `127.0.0.1`, từ chối `Host` lạ (đã thử: trả 403). Chỉ đọc file, không ghi.

## Nó thấy gì, không thấy gì
- Thấy cả phiên chạy ngầm (`claude -p`): đã thử, các phiên kiểm tra của mình hiện lên (vd dự án `cltest`).
- **Không biết phòng ban/đội.** Nó nhóm theo thư mục dự án, nên video của xưởng hiện chung dưới tên dự án `Tiktoker`. Muốn biết "Thể thao – Đội 2 – Producer đang làm gì" thì xem **dashboard xưởng** (http://localhost:4747).
- **Mỗi bản chỉ đọc 1 thư mục Claude và 1 thư mục Codex** (theo `CLAUDE_CONFIG_DIR`, `CODEX_HOME`). Tài khoản phụ của xưởng nằm ở thư mục riêng (`studio/accounts/...`; Codex không có đăng nhập mặc định), nên lệnh `office` tự mở **thêm bản bổ sung** cho các tài khoản đó (cổng 4546, 4547…; ghép Claude với Codex theo thứ tự). Đã kiểm: biến môi trường đổi đúng thư mục nó đọc, và các bản lên được. **Chưa kiểm** với phiên Codex thật hay tài khoản phụ thật (chưa đăng nhập).
- Nút "3D" vẫn có trên trang nhưng mình không dùng; URL luôn ghim 2D.

## Cài lại / cập nhật
Cài lại (nếu thiếu thư mục): `git clone --depth 1 --branch v0.8.1 https://github.com/Charonyuu/whatsmyagentdoing tools/whatsmyagentdoing`, rồi kiểm `git -C tools/whatsmyagentdoing rev-parse HEAD` ra đúng commit ở trên.
**Cập nhật là việc thủ công, có xem xét:** đọc ghi chú phát hành/diff của bản mới, rồi `git -C tools/whatsmyagentdoing fetch --depth 1 origin tag vX.Y.Z` + `git checkout vX.Y.Z`, cập nhật `PINNED` trong `studio/src/office.mjs` và file này, chạy `npm test --prefix studio`. **Đừng** dùng `--update` hay nút "Update" trên trang (kéo thẳng mã mới nhất chưa xem).
Dự án còn trẻ (tạo 23/10/2026, 11 bản phát hành trong 3 tuần, khoảng 7 người đóng góp) nên có thể đổi nhanh; vì vậy mới ghim phiên bản.
