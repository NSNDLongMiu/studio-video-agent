# Đăng bài tự động (T5) — thiết kế, chưa viết mã, chưa bật gì

> **Trạng thái (21/11/2026):** giám đốc yêu cầu "phòng IT được tự động đẩy lên TikTok, làm liên kết". Theo quyết định 18/11/2026 (`docs/viec-cho-agent.md` T5), bước đầu là tài liệu này; **chưa có mã, chưa có khoá, không đăng gì**. `CLAUDE.md` luật 9 giữ nguyên cho tới khi giám đốc duyệt thiết kế và bật từng bước. Mọi thông tin TikTok dưới đây đọc từ trang chính thức của TikTok for Developers ngày 21/11/2026; điều nào không đọc được ghi **CHƯA XÁC MINH**, không đoán.

> **Quyết định của giám đốc (21/11/2026):** chọn **đường A — gói đăng một chạm, chỉ cho TikTok** (không làm công cụ trình duyệt ngụy trang, không API). **ĐÃ LÀM**: `studio/src/publish-pack.mjs`, lệnh `node studio/src/cli.mjs pack <video-id>`, khung "Sẵn sàng đăng" trên dashboard (nút "Gói đăng TikTok" có Sao chép, "Mở thư mục video", "Đã đăng ✔"). Hệ thống không đăng gì; giám đốc dán và bấm đăng, rồi báo "Đã đăng" để video sang `published`. Gói tự kiểm luật 10 (tên nền tảng), độ dài 2200, thiếu file, câu khai báo AI. Cần khởi động lại dashboard để có khung mới.

## 1. Kết luận ngắn về TikTok
**Đăng công khai hoàn toàn tự động lên TikTok bằng API chính thức hiện không làm được cho trường hợp của xưởng** (xưởng đăng cho tài khoản của chính mình). Ba lý do, đều có nguyên văn trong tài liệu TikTok:
1. App **chưa audit** chỉ đăng được ở chế độ riêng tư (`SELF_ONLY`) và tài khoản đích phải đang để riêng tư (lỗi `unaudited_client_can_only_post_to_private_accounts`): không dùng được cho kênh công khai.
2. Muốn công khai phải **audit**, mà hướng dẫn Intended Use ghi rõ **không chấp nhận** "A utility tool to help upload contents to the account(s) you or your team manages" (đọc hai lần độc lập: T3 18/11 và 21/11/2026). Xưởng đúng loại này nên khả năng bị từ chối cao (tiêu chí audit chi tiết **CHƯA XÁC MINH**, trang đơn audit chưa đọc được).
3. Hướng dẫn chia sẻ nội dung của TikTok đòi giao diện cho người dùng tự chọn quyền riêng tư và khai báo thương mại cho từng bài; một đường ống không có người xem giao diện không khớp tinh thần đó.

Đường còn lại là **Upload vào hộp thư (inbox)**: video lên bản nháp trong app TikTok, **người bấm thông báo, chỉnh và đăng** ("must click on inbox notifications to continue the editing flow in TikTok and complete the post"). Tức bán tự động. Đường inbox **không có trường caption/tiêu đề** và **không có `is_aigc`** (theo trang tài liệu upload), nên mô tả và công tắc "nội dung do AI tạo" vẫn do giám đốc làm trong app.

## 2. Bằng chứng (TikTok Content Posting API)
| Mục | Direct Post (`video.publish`) | Upload/Inbox (`video.upload`) |
|---|---|---|
| Endpoint | `POST /v2/post/publish/video/init/` | `POST /v2/post/publish/inbox/video/init/` |
| Ai bấm đăng | Hệ thống đăng thẳng | Người, trong app TikTok |
| App chưa audit | Chỉ `SELF_ONLY`, tối đa 5 người dùng/24 giờ, tài khoản phải riêng tư | Trang không nêu giới hạn kiểu này; vẫn phải được duyệt scope `video.upload` (cách duyệt **CHƯA XÁC MINH**) |
| Trần | khoảng 15 bài/ngày/tài khoản (cả app đã audit) | tối đa 5 lượt chờ đăng/24 giờ (`spam_risk_too_many_pending_share`) |
| Caption / tiêu đề | có, tối đa 2200 ký tự UTF-16 | không có trường |
| Khai báo AI | `is_aigc` | không có |
| Tải lên | `FILE_UPLOAD` (PUT theo mảnh 5–64 MB, tuần tự, `upload_url` sống 1 giờ) hoặc `PULL_FROM_URL` (tên miền phải xác minh, https, không chuyển hướng) | như bên trái |
| Video | MP4/WebM/MOV, H.264 khuyên dùng, 23–60 fps, mỗi chiều 360–4096 px, tối đa 10 phút (init), 4 GB | như bên trái (video xưởng 9:16, 1080×1920, ≤ 75 s đều nằm trong giới hạn) |
| Hỏi trạng thái | `status/fetch`: `PROCESSING_UPLOAD`, `PROCESSING_DOWNLOAD`, `SEND_TO_USER_INBOX`, `PUBLISH_COMPLETE`, `FAILED` (+ `fail_reason`), tối đa 30 lần/phút; init tối đa 6 lần/phút/token | như bên trái |
| Webhook | `post.publish.*` cần địa chỉ HTTPS công khai; xưởng chạy cục bộ nên **dùng polling**, không dùng webhook | như bên trái |

Nguồn: `developers.tiktok.com/doc/` các trang `content-posting-api-get-started`, `…-get-started-upload-content`, `content-sharing-guidelines`, `content-posting-api-reference-direct-post`, `…-reference-upload-video`, `…-media-transfer-guide`, `…-reference-get-video-status`.

## 3. Phương án cho TikTok (đề xuất khuyến nghị: A rồi B)
| | A. Gói đăng một chạm (không API) | B. Upload inbox (API, bán tự động) | C. Direct Post |
|---|---|---|---|
| Làm gì | Khi video sang `ready`, hệ thống dựng sẵn khối "tiêu đề / mô tả / hashtag / thẻ / file / bìa" từng nền tảng (đúng thứ thư ký đang dán tay), dashboard có nút **Sao chép** từng khối; giám đốc chỉ việc dán và bấm đăng | Hệ thống tự đẩy file mp4 vào hộp thư TikTok của giám đốc; giám đốc mở thông báo, dán mô tả, bật nhãn AI, đăng | Tự đăng công khai |
| Tự động bao nhiêu | Mọi bước chuẩn bị; **người đăng** | Chuyển file; **người** viết mô tả, bật nhãn AI, đăng | Hoàn toàn |
| Rủi ro | Không có (không dịch vụ ngoài, không khoá) | Cần app TikTok được duyệt scope `video.upload`; có thể bị xét "Intended Use"; **CHƯA KIỂM thật** | **Không khả thi** (mục 1) |
| Lợi ích thực | Bỏ bước soạn mô tả/hashtag từng nền tảng cho cả ba nền tảng, không chỉ TikTok | Chỉ bỏ bước chép file sang điện thoại; mô tả và nhãn AI vẫn tay | — |
| Cần giám đốc làm | Không | Đăng ký app, cấp quyền (mục 5) | — |
| Công | nhỏ (cùng module dùng cho `publish.json`) | vừa (OAuth cục bộ, tải mảnh, polling, kiểm thử bằng máy chủ giả) | — |

**Khuyến nghị:** làm **A** trước (giá trị ngay cho cả ba nền tảng, rủi ro bằng 0, giám đốc vẫn là người đăng đúng luật 9). Làm **B** sau khi giám đốc đăng ký xong app TikTok và chịu rủi ro duyệt; vì giá trị của B thấp (chỉ chuyển file), chưa chắc đáng công.

**Nếu giám đốc muốn tự động thật:** YouTube Shorts (API đăng video; T3 ghi từ 2/11/2026 dự án chưa xác minh không còn bị khoá riêng tư, **cần kiểm lại khi làm**) và Facebook Reels qua Page (API cho Page) là hai đường chính thức khả thi hơn TikTok. Hai đường này cần giám đốc tạo dự án/ứng dụng và cấp quyền như mục 5.

## 3b. Phương án D — trình duyệt tự động (giám đốc đề xuất 21/11/2026)
Ý: công cụ điều khiển trình duyệt, vào trang tải lên của TikTok bằng phiên đăng nhập của giám đốc, tự tải video, điền mô tả, bật nhãn AI rồi đăng. Đi vòng qua API nên không dính giới hạn của app chưa audit, và làm được cả mô tả lẫn công tắc AI (đường inbox không làm được).

**Điều khoản TikTok (đọc 21/11/2026):** Điều khoản dịch vụ ("Last updated: 1 December 2025"), mục 5, danh sách "You may not": *"use automated scripts to collect information from or otherwise interact with the Services"* và *"bypass any measures we may use to prevent or restrict access to the Services"*. Nguyên tắc cộng đồng (hiệu lực 24/9/2026): *"We strictly prohibit automation tools, scripts, or other tricks designed to bypass our systems."* Hậu quả ghi trong cùng trang: *"Ban your account"*, *"Ban additional or new accounts you create"*, *"Restrict your account, which could include limiting your ability to post new content"*, và *"We reserve the right to disable your user account at any time"*. Việc hiểu "interact with the Services" gồm cả đăng nhập và đăng video là **suy luận của thư ký**, trang không nói rõ; phần đã đọc không có ngoại lệ nào cho tập lệnh của chính chủ tài khoản. Phần cuối điều khoản (khoảng 11.700 ký tự) chưa đọc nguyên văn.

**Rủi ro:** (1) bị hạn chế hoặc khoá **chính tài khoản kênh**, khó rút lại, và lập tài khoản mới để lách còn bị cấm; (2) TikTok phát hiện trình duyệt tự động (xác minh thiết bị, captcha, bắt đăng nhập lại) nên công cụ có thể hỏng bất cứ lúc nào; (3) giao diện trang tải lên đổi thường xuyên làm bộ chọn nút sai; (4) lần đầu phải có người ngồi máy để đăng nhập, xác minh hai bước, giải captcha; (5) giao diện chỉ thấy được sau khi đăng nhập nên các bộ chọn nút **CHƯA KIỂM thật**, chỉ chỉnh được trong lần chạy có giám đốc.

**Hai mức:** **D1 — người bấm "Đăng":** công cụ mở trang tải lên bằng trình duyệt của giám đốc (đã đăng nhập), tự tải video, điền mô tả/hashtag, bật nhãn AI rồi **dừng**, giám đốc xem và bấm Đăng. Vẫn là tập lệnh tương tác với TikTok nên vẫn thuộc điều khoản trên, nhưng không đăng khi vắng người, ít giống spam hơn. **D2 — không người:** tự đăng hoàn toàn; rủi ro cao nhất.

**Cách giảm rủi ro nếu làm:** thử trên **tài khoản TikTok phụ** trước; chạy chậm, vài video/ngày; phiên đăng nhập nằm ở `studio/accounts/tiktok/<mã-phòng>/browser-profile/` (đã `.gitignore`), **không lưu mật khẩu**, giám đốc tự đăng nhập một lần; điều khiển Chrome/Edge có sẵn bằng `playwright-core` (không tải trình duyệt; thêm một phụ thuộc npm, hiện studio chỉ có hai); kiểm thử bằng trang giả cục bộ; mỗi bước chụp ảnh vào `assets/_scratch/` để chẩn đoán; mặc định tắt, chỉ chạy khi giám đốc bật.

**Ranh giới đã nói với giám đốc (21/11/2026):** giám đốc yêu cầu công cụ "làm giả tôi", không để lại dấu vết là script. **Thư mục này không dựng phần ngụy trang đó** (giả vân tay trình duyệt, giả hành vi người, plugin né phát hiện bot, lách xác minh): đó là cố ý vượt hệ thống chống tự động của TikTok, đúng thứ nguyên tắc cộng đồng nêu là "designed to bypass our systems", và đẩy mức rủi ro lên cao nhất. Nếu làm D1 thì làm **minh bạch**: trình duyệt thật của giám đốc, đăng nhập thật, giám đốc bấm Đăng.

**Khuyến nghị:** nếu cần tự động, làm **D1 trên tài khoản phụ** trước; không làm D2 trên kênh chính. Nếu giám đốc chấp nhận rủi ro khoá kênh thì đó là quyết định của giám đốc, thư mục này ghi lại để có bằng chứng đã được báo.

## 4. Thiết kế nếu giám đốc duyệt (phác thảo, chưa mã)
- **Công tắc theo phòng:** `departments.auto_publish` = `off` (mặc định) | `pack` (A) | `inbox` (B) | (tuỳ nền tảng sau). Chỉ giám đốc bật, mỗi nền tảng một lần đồng ý riêng, ghi nhật ký "GIÁM ĐỐC BẬT". Phòng khác (Bóng Đá…) mặc định `off`.
- **Việc nền `publish`:** worker xếp sau khi video sang `ready` (không bao giờ sau `review`). Chạy cục bộ, không dùng AI, không tốn hạn mức Claude/Codex.
- **Không đăng trùng:** sổ ghi vào `final/publish.json` (`posted.<nền tảng>` = `publish_id`, thời điểm, trạng thái); có sổ rồi thì không gửi lại; gặp lỗi mạng giữa chừng thì hỏi `status/fetch` bằng `publish_id` trước khi thử lại.
- **Trạng thái video:** giữ `ready`. Chuyển `published` chỉ khi giám đốc xác nhận đã đăng (bấm trên dashboard hoặc nói), không tự đổi dù API báo `SEND_TO_USER_INBOX`.
- **Xử lý lỗi:** tôn trọng giới hạn tốc độ (6 init/phút, 30 status/phút, 5 lượt chờ/24 giờ); lỗi `file_format_check_failed`, `duration_check_failed`… dừng và báo ở "Cần giám đốc chú ý" kèm `fail_reason`; token hết hạn thì dùng refresh token, hỏng nữa thì báo giám đốc đăng nhập lại (giống ghế Claude/Codex).
- **Nhãn AI:** luôn có câu `ai_disclosure` cuối mô tả (đã có trong `publish.json`); Direct Post sẽ gửi `is_aigc: true`; inbox thì nhắc giám đốc bật công tắc trong app.
- **Luật 10 (tên nền tảng):** mô tả đưa ra chỉ dùng cách gọi thay thế; khoá nền tảng trong `publish.json` và URL nguồn giữ nguyên (người xem không thấy). Không chép URL có chữ nền tảng thật vào mô tả.
- **Bảo mật khoá:** client key/secret và token nằm ở `studio/accounts/tiktok/<mã-phòng>/` (đã kiểm: thư mục `studio/accounts/` nằm trong `.gitignore`), không bao giờ vào repo công khai; `tools/scan-public.mjs` quét trước mỗi commit.
- **Chi phí:** mục tiêu bằng 0, không dịch vụ trả phí (luật 8). Các trang đã đọc **không nêu giá** của Content Posting API nên **CHƯA XÁC MINH** miễn phí; sẽ kiểm trước khi dựng.
- **Kiểm thử:** bằng máy chủ TikTok giả cục bộ (không gọi TikTok thật); chạy thật chỉ sau khi giám đốc cấp ứng dụng, và lần đầu ở chế độ không công khai.

## 5. Việc chỉ giám đốc làm được (tôi không thể thay)
Chỉ cần cho đường B (và cho YouTube/Facebook nếu chọn):
1. Tạo tài khoản nhà phát triển và ứng dụng ở TikTok for Developers, thêm sản phẩm Content Posting API và Login Kit, xin scope `video.upload`, đặt địa chỉ chuyển hướng (redirect URI) cho máy chủ cục bộ.
2. Tự đặt client key/secret vào tệp cục bộ ở `studio/accounts/tiktok/it/` (tôi chỉ nói tên tệp, không nhận khoá qua chat).
3. Tự đăng nhập TikTok và cấp quyền khi tôi chạy lệnh đăng nhập (mở trình duyệt, giống `accounts login`).

## 6. Điều CHƯA XÁC MINH
- Tiêu chí duyệt scope `video.upload` và audit (trang đơn audit chưa đọc).
- Upload/inbox có bị xét "Intended Use" như Direct Post không.
- Địa chỉ chuyển hướng `http://localhost` có được chấp nhận không; thời hạn access/refresh token (trang Login Kit đọc được chỉ là tổng quan).
- Giá của Content Posting API.
- Trang Direct Post ghi "Last updated October 27, 2026", các trang khác "August 4, 2026": không chắc là cập nhật riêng hay lỗi trang.

## 7. Giám đốc cần quyết
1. **Đường TikTok:** A trước (khuyến nghị), B luôn, hay cả hai?
2. **Tự động thật ở nền tảng khác:** có làm YouTube Shorts và/hoặc Facebook Page cho phòng IT không (cần mục 5 tương ứng)?
3. **Mức tự động khi bật:** sau `ready` tự gửi hay vẫn có nút "Duyệt đăng" cho từng video?
4. **Phạm vi:** chỉ phòng IT; Bóng Đá giữ thủ công cho tới khi giám đốc nói.
