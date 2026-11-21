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

## Cổng nào là gì
**Mỗi phòng ban 1 bản**, tên cố định `VP-<mã phòng>`; bản đó chỉ đọc các tài khoản đã cấp cho phòng (`accounts assign`, hoặc nút "Cấp cho phòng" trên dashboard). Tài khoản dùng chung (chưa cấp cho phòng nào) **không được theo dõi**. Mỗi bản chỉ đọc được 1 thư mục Claude + 1 thư mục Codex, nên phòng có 2 tài khoản Claude (hoặc 2 Codex) thì có thêm `VP-<phòng>-2`. Bản thiếu Claude hoặc thiếu Codex được trỏ vào thư mục rỗng (`studio/data/office-empty/`) để không lộ phiên của tài khoản ngoài phòng.

| Tên | Phòng | Tài khoản nó đọc | Cổng hiện tại (18/11/2026) |
|---|---|---|---|
| `VP-it` | IT | Claude ghế dev-longvu (**chưa đăng nhập**) + Codex <email> (ghế main) | 4545 |

**Nhận biết đang xem phòng nào:** cổng công khai (4545…) là lớp chuyển tiếp mỏng của xưởng (`studio/src/office-proxy.mjs`). Nó chèn tên phòng vào tiêu đề tab ("Phòng IT · What's my agent doing") và thêm một dải cam trên cùng trang ("🏢 Phòng IT · VP-it — Claude … + Codex …"). Bản gốc whatsmyagentdoing chạy ở cổng nội bộ = cổng công khai + 100 (4645…). Mã của công cụ đã ghim vẫn không bị sửa. Lớp chuyển tiếp chỉ nhận yêu cầu gửi tới localhost, giống công cụ gốc, và tự tắt khi bản gốc tắt.

**Gemini chưa được theo dõi (20/11/2026):** `agy` (Gemini) không ghi nhật ký hội thoại theo định dạng mà bộ đọc của Văn phòng 2D hiểu (Claude/Codex) và chỉ có 1 ghế dùng chung, nên các lượt Gemini **không hiện thành nhân vật**; trên dashboard vị trí vẫn ghi "Gemini …" và nhật ký sự kiện có dòng mỗi lượt `gemini-run`. Xem Gemini đang làm gì: log `studio/data/logs/gemini-run-*.log` (mỗi lượt kèm `.meta.json`). Đọc nhật ký của `agy` để hiện lên Văn phòng là việc chưa làm.
**Chỉ hiện bộ core (18/11/2026):** mỗi nhân vật mang tên vị trí core + ai làm — "Ý tưởng · Claude", "Ý tưởng · Codex", "Ý tưởng · Claude chốt", "Kịch bản · Codex cùng viết", "Kịch bản · Claude viết & chốt", "Đạo diễn hình ảnh · Codex làm", "Đạo diễn hình ảnh · Claude duyệt", "Sản xuất · Codex", "QC · Claude", "Gỡ vướng · Claude", "Tìm chủ đề · Claude" (+ "Trưởng phòng"). Phiên điều phối `/make-plan`, agent phụ (tra cứu…) và lượt gọi thử tài khoản bị ẩn (công tắc "agent con" trên trang bật xem được). Nhận vai dựa vào: loại agent con (`*.meta.json` của Claude), lệnh đầu của phiên `claude -p`, và dòng đánh dấu `[[STUDIO-ROLE:…]]` xưởng chèn đầu prompt Codex (`studio/src/office-roles.mjs`). Phiên không thuộc xưởng giữ nguyên.

**Chỗ ngồi cố định của đội (giám đốc yêu cầu 18/11/2026, thay cho "sàn chỉ có người đang làm"):** bản **chính** của phòng (`VP-<phòng>`, không phải `-2`…; phòng đã đóng thì không có) luôn có đủ các vị trí core của đội: Ý tưởng, Kịch bản, Đạo diễn hình ảnh, Sản xuất, QC, Gỡ vướng, thêm Tìm chủ đề khi phòng bật tự tìm chủ đề (giống 6 dòng của đội trên dashboard). Vị trí **chưa có phiên nào** thì hiện 1 nhân vật **"<vị trí> · rảnh"** (trạng thái idle: đi lại, ngủ gật ở sàn, không ngồi bàn); có phiên thật (đang làm hoặc vừa xong) thì nhân vật thật thay vào, xong thì dọn vào ngăn "Đã gọi" và nhân vật rảnh quay lại. **Nếu phòng chưa được cấp tài khoản mà vị trí đó dùng** (Claude cho QC, Gỡ vướng, Tìm chủ đề; Codex cho Đạo diễn hình ảnh, Sản xuất; Ý tưởng và Kịch bản cần 1 trong 2) thì Văn phòng không thấy được việc của vị trí → nhân vật ghi **"<vị trí> · chưa theo dõi"** (không giả vờ rảnh); cấp tài khoản cho phòng rồi bật lại `npm run office` là hết. Nhân vật rảnh là phiên "ảo" do lớp chuyển tiếp thêm vào (`--seats`, `studio/src/office-roles.mjs`); không ghi file, không sửa công cụ đã ghim. Vị trí của đội theo dashboard; phòng nhiều đội vẫn chỉ 1 nhân vật mỗi vị trí (Văn phòng không biết đội). Bản phụ `-2…` chỉ hiện phiên có thật. Bản có chỗ ngồi cố định **ẩn phiên ngoài xưởng** (giám đốc tự dùng tài khoản của phòng, việc giao Codex để sửa hệ thống…) khỏi sàn như agent con, để sàn chỉ còn đúng các nhân vật của đội; công tắc "agent con" trên trang vẫn bật xem được, và chúng không vào ngăn "Đã gọi". Bản không có chỗ ngồi (bản phụ `-2`) giữ nguyên phiên ngoài xưởng.

**Vòng đời agent (giám đốc yêu cầu 18/11/2026):** mỗi vị trí core chỉ có **1 nhân vật** trên sàn. Agent con / phiên Codex / phiên phụ nào được gọi ra thì xuất hiện khi đang làm; **làm xong khoảng 45 giây (`STUDIO_OFFICE_GRACE_MS`, để kịp thấy "✓ xong") thì tự dọn khỏi sàn**, vào ngăn **"🗂 Đã gọi (N)"** (nút góc trái dưới của trang) để xem lại: tên vị trí, ai làm, model, giờ bắt đầu → xong, việc được giao, kết quả (bấm từng dòng để mở). Vị trí đã có phiên đang làm thì phiên cũ cùng vị trí vào ngăn ngay. Phiên con của Codex (vd tự duyệt lệnh), agent phụ (Explore…), điều phối `/make-plan` cũng vào ngăn khi xong. **Không dọn** phiên chính của giám đốc/thư ký (không thuộc xưởng; trạng thái của chúng đổi liên tục mỗi lượt). Ngăn được tính lại từ nhật ký Claude/Codex (đường `/studio/history` của lớp chuyển tiếp), nên không cần lưu riêng và còn nguyên sau khi bật lại; chỉ gồm các phiên còn nằm trong cửa sổ thời gian công cụ gốc theo dõi.

Bảng đúng lúc này: `npm run office --prefix studio -- status`. Mỗi lần bật, lệnh `office` tự tắt các bản không còn đúng kế hoạch (vd tài khoản vừa bị trả về dùng chung). Dashboard hiện danh bạ cạnh nút 🏢, và trong mỗi phòng có chip `🏢 VP-it :4545`. Sổ tên ↔ cổng của lần bật gần nhất: `studio/data/logs/office-instances.json` (tự ghi, đừng sửa tay).

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
- **Bản thân công cụ không biết phòng ban/đội** (xưởng tách phòng bằng cách cấp tài khoản riêng cho từng phòng). Trong 1 bản, phiên được nhóm theo thư mục dự án. Muốn biết "Thể thao – Đội 2 – Producer đang làm gì" thì xem **dashboard xưởng** (http://localhost:4747).
- **Mỗi bản chỉ đọc 1 thư mục Claude và 1 thư mục Codex** (theo `CLAUDE_CONFIG_DIR`, `CODEX_HOME`) — vì vậy xưởng mở mỗi phòng 1 bản, đặt đúng 2 thư mục của tài khoản đã cấp cho phòng (xem mục "Cổng nào là gì").
- Nút "3D" vẫn có trên trang nhưng mình không dùng; URL luôn ghim 2D.

## Cài lại / cập nhật
Cài lại (nếu thiếu thư mục): `git clone --depth 1 --branch v0.8.1 https://github.com/Charonyuu/whatsmyagentdoing tools/whatsmyagentdoing`, rồi kiểm `git -C tools/whatsmyagentdoing rev-parse HEAD` ra đúng commit ở trên.
**Cập nhật là việc thủ công, có xem xét:** đọc ghi chú phát hành/diff của bản mới, rồi `git -C tools/whatsmyagentdoing fetch --depth 1 origin tag vX.Y.Z` + `git checkout vX.Y.Z`, cập nhật `PINNED` trong `studio/src/office.mjs` và file này, chạy `npm test --prefix studio`. **Đừng** dùng `--update` hay nút "Update" trên trang (kéo thẳng mã mới nhất chưa xem).
Dự án còn trẻ (tạo 23/10/2026, 11 bản phát hành trong 3 tuần, khoảng 7 người đóng góp) nên có thể đổi nhanh; vì vậy mới ghim phiên bản.
