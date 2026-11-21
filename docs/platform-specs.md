# Chuẩn đầu ra & lưu ý nền tảng

> **Đã đối chiếu với trang chính thức ngày 18/11/2026 (việc T3).** Agent đọc trang chính thức; Claude tự đối chiếu lại lần hai các điểm quan trọng nhất (đánh dấu ✔✔). Chỗ ghi **CHƯA XÁC MINH** là trang không đọc được: Trung tâm trợ giúp của TikTok và Meta chỉ trả khung JavaScript. Quy định nền tảng đổi thường xuyên: kiểm lại trước khi đăng hàng loạt hoặc làm đăng tự động (T5).

## Chuẩn kỹ thuật chung (1 file dùng cho cả 3 nền tảng) — chuẩn của xưởng
- **Tỉ lệ 9:16, 1080×1920**, MP4, H.264 (yuv420p) + AAC, 24–60 fps (khuyến nghị 30), `faststart`.
- **Thời lượng mặc định theo định dạng của plan:** chuẩn **45–75 s** (mục tiêu ≈ 60 s, giám đốc chốt 20/11/2026); video giải thích sâu 150–190 s (mục tiêu ≈ 180 s) và định dạng ngắn 15–45 s chỉ khi giám đốc yêu cầu. **YouTube Shorts tối đa 3 phút (180 s): trên 180 s video không còn là Shorts** (QC cảnh báo; trên 190 s là lỗi với hồ sơ giải thích sâu). TikTok và Facebook Reels trong ứng dụng cho dài hơn (nguồn thứ cấp, chưa đối chiếu trang chính thức); Facebook hẹn giờ qua API giới hạn 3–90 s (xưởng chưa đăng tự động). Opening 1–8 s (mục tiêu 5–8 s, nguồn: `tools/config/pipeline-rules.json`) có thể có lời hook theo R20/R26.
- Âm lượng ~ −14 LUFS, đỉnh ≤ −1,5 dBTP. Luôn có luồng audio.
- Dung lượng ≤ 250 MB (xưởng tự giới hạn; QC sẽ báo).
- Có `captions.srt` (đa số người xem tắt tiếng) và bản phụ đề đốt cứng nếu plan yêu cầu.

### Giới hạn chính thức của từng nền tảng (T3)
| | TikTok | Facebook Reels | YouTube Shorts |
|---|---|---|---|
| Độ dài tối đa | 3 phút (một số tài khoản 5–10 phút) | Trong app: không giới hạn độ dài/định dạng. Qua API: 3–90 giây | 3 phút, vuông hoặc dọc ✔✔ |
| Định dạng | MP4/WebM/MOV (MP4 khuyến nghị), 23–60 fps, mỗi cạnh 360–4096 px, ≤ 4 GB | API: MP4, 9:16, 1080×1920 (tối thiểu 540×960), 24–60 fps; H.264/H.265, 4:2:0, closed GOP 2–5 giây, fps cố định, progressive; âm thanh AAC-LC stereo ≥ 128 kbps, 48 kHz | Tối đa 1080p; API nhận tệp tới 256 GB |
| Nguồn | developers.tiktok.com/doc/content-posting-api-media-transfer-guide | developers.facebook.com/docs/video-api/guides/reels-publishing; about.fb.com/news/2025/06/making-it-easier-create-videos-facebook/ | support.google.com/youtube/answer/15424877; …/answer/10059070 |
- Chuẩn xưởng (45–75 s mặc định; định dạng giải thích sâu ≤ 180 s để còn là Shorts; 1080×1920, H.264 + AAC) nằm trong giới hạn đăng trực tiếp trên cả ba nền tảng. Hẹn giờ Reels qua API (≤ 90 s) chứa được cả chuẩn 45–75 s; chỉ định dạng giải thích sâu mới cần xét lại khi làm đăng tự động.
- Khi làm đăng tự động qua Meta API cần xuất thêm: closed GOP 2–5 giây, fps cố định, âm thanh 48 kHz ≥ 128 kbps (chuẩn xưởng hiện chưa ghi các mục này).
- TikTok Creator Rewards (bản Mỹ) yêu cầu video từ 1 phút; chưa kiểm có áp dụng ở Việt Nam không.

## Vùng an toàn (tránh bị giao diện nền tảng che)
Quy tắc xưởng (**chưa có nguồn chính thức**): giao diện chiếm **khoảng 20–25% phía dưới** và một dải bên phải.
- Chữ/phụ đề quan trọng nằm trong y ∈ [~250, ~1500] px, cách lề trái/phải ≥ 90 px.
- Phụ đề đặt cách đáy ≥ 420 px (công thức `MarginV=63` trong `ffmpeg-recipes.md`).
- T3 **không tìm được số chính thức cho video hữu cơ** của cả 3 nền tảng (TikTok và YouTube chỉ có mẫu cho quảng cáo, không nêu %). Số công bố duy nhất là của Meta cho quảng cáo Instagram Reels: chừa ~14% phía trên, ~35% phía dưới, ~6% mỗi bên (35% ≈ 672 px, bảo thủ hơn mức 420 px của xưởng). Hiện giữ chuẩn xưởng và **đăng thử rồi chỉnh theo thực tế**; giám đốc quyết nếu muốn nâng ngay.

## Khác biệt đáng nhớ khi đăng (giám đốc tự đăng ở giai đoạn này)
| | TikTok | Facebook Reels | YouTube Shorts |
|---|---|---|---|
| Tiêu đề | không có (dùng caption) | không có (dùng mô tả); API có thêm trường `title` | **có**, ≤ 100 ký tự ✔✔ |
| Mô tả/caption | qua API ≤ 2200 ký tự UTF-16; trong app: CHƯA XÁC MINH | không nêu giới hạn | ≤ 5000 ký tự (qua API tính 5000 **byte**, tiếng Việt có dấu tốn nhiều byte hơn) |
| Hashtag | chưa có số chính thức | khuyến nghị ≤ 5 (Meta: "no more than five hashtags perform best"), không phải giới hạn cứng | quá 60 hashtag thì YouTube bỏ qua hết; chỉ hiện 3 hashtag cạnh tiêu đề. **`#Shorts` không bắt buộc** (Shorts nhận diện theo tỉ lệ và độ dài); thêm vào cũng vô hại |
| Ảnh bìa | chọn khi đăng | chọn khi đăng | chọn khi đăng (T3 chưa kiểm yêu cầu riêng) |
- Xưởng giữ 3–5 hashtag cho mỗi nền tảng (`qc-publish` cảnh báo khi > 5). Đó là chuẩn xưởng, không phải quy định nền tảng.

## Gắn nhãn AI
**Quyết định của xưởng: luôn gắn** (giám đốc chốt) và vẫn đúng: YouTube nói khai báo nội dung AI "won't limit a video's audience or impact its eligibility to earn money" ✔✔. Đặt `ai_disclosure` ở cuối mô tả của cả 3 nền tảng **và** bật công cụ khai báo của nền tảng khi có.

Quy định chính thức (chỉ **bắt buộc** với nội dung trông như thật):
| | Điều nền tảng nói | Chưa rõ |
|---|---|---|
| YouTube ✔✔ | Nút "AI use" (mục Attributes lúc upload). Bắt buộc với nội dung giống thật: người thật như nói/làm điều chưa từng làm, sửa cảnh/địa điểm thật, tạo cảnh giống thật chưa từng xảy ra, nhạc là trọng tâm. **Không cần** với nội dung phi thực tế (ví dụ hoạt hình kỳ ảo). Giọng đọc AI không nằm trong danh sách bắt buộc. Không khai báo thường xuyên: có thể bị gắn nhãn tay hoặc phạt, kể cả gỡ nội dung hay đình chỉ YPP. API: `status.containsSyntheticMedia` (theo T3, chưa đối chiếu lần hai). Nguồn: support.google.com/youtube/answer/14328491 | — |
| TikTok | Phải gắn nhãn nội dung AI hoặc chỉnh sửa nhiều "shows realistic-looking scenes or people"; không gắn có thể bị gỡ, hạn chế hoặc gắn nhãn. Tự gắn nhãn qua C2PA. API Direct Post: `is_aigc`. Nguồn: tiktok.com/safety/en/policies-and-engagement/integrity-authenticity | Tên nút trong app (chỉ có tóm tắt tìm kiếm thứ cấp: More options → "AI-generated content"); giọng tổng hợp và hoạt hình có bắt buộc không |
| Facebook/Meta | Nhãn "AI info". Bắt buộc dùng công cụ khai báo với video "photorealistic" hoặc âm thanh "realistic-sounding" tạo/sửa bằng kỹ thuật số, có thể bị phạt. API Reels: `is_ai_generated`. Nguồn: about.fb.com/news/2026/02/meta-prepares-for-2026-us-midterms/ | Tên nút trong luồng Reels; giọng TTS và hoạt hình |
- Hệ quả: video của xưởng (hoạt hình + giọng TTS) có thể **không** thuộc diện bắt buộc ở YouTube; TikTok và Meta chưa rõ. **Giữ luật "luôn gắn"** là phương án an toàn; cách gắn của xưởng (19/11/2026): không đốt nhãn lên hình, gắn bằng `ai_disclosure` ở cuối mô tả cả 3 nền tảng và bật công tắc khai báo AI của nền tảng khi đăng. Khi làm T5 cần thêm các cờ API trên vào `publish.json` và `qc-publish`.

## Nội dung nên tránh (rủi ro bị gỡ/giới hạn/mất kiếm tiền)
Nhạc/hình/clip có bản quyền chưa được cấp phép; tuyên bố y tế/tài chính gây hiểu lầm; thông tin chưa kiểm chứng trình bày như sự thật; nội dung bạo lực/nhạy cảm; spam hashtag.

### Nội dung lặp / làm hàng loạt / không nguyên bản (T3)
- **YouTube** ✔✔ ("inauthentic content", đổi tên từ "repetitious content" ngày 15/7/2025; support.google.com/youtube/answer/1311392). Chỉ nói về **điều kiện kiếm tiền (YPP)**, không nói giảm phân phối. Không đủ điều kiện: nội dung "mass-produced, generic, repetitive"; "AI-generated content made with generic or unoriginal templates giving the impression of mass production"; và "content that exclusively features readings of other materials you did not originally create" (ví dụ văn bản từ website hay news feed). Được phép nếu mỗi video khác biệt và thể hiện "creative vision" cùng giá trị cho người xem. **Kênh tin là nhóm dễ rơi vào.**
- **Meta** (14/7/2025; creators.facebook.com/blog/combating-unoriginal-content): tái đăng nội dung người khác không có "meaningful enhancements" thì mất kiếm tiền một thời gian và giảm phân phối toàn bộ nội dung; chỉ ghép clip hay thêm watermark không đủ. Trang không nhắc AI, TTS hay template.
- **TikTok** (24/9/2026): nội dung không nguyên bản hoặc dùng lại mà không có gì mới không đủ điều kiện vào For You. Không có mục riêng về AI làm hàng loạt.
- **Quy tắc rút ra cho xưởng (đề xuất, chờ giám đốc xác nhận):** mỗi video phải có **góc nhìn hoặc phân tích riêng**, không chỉ đọc lại tin; kịch bản và hình mỗi video khác nhau rõ rệt (không dùng một khuôn chỉ đổi chữ); diễn đạt nguồn tin bằng lời của mình và ghi nguồn.
- **Bản quyền:** YouTube cần quyền, ngoại lệ hoặc giấy phép; quy tắc "reused" áp dụng cả khi có phép; không phương án nào "guarantee avoiding copyright issues". TikTok: chỉ đăng nội dung mình làm hoặc có quyền. Facebook: có kiểm tra bản quyền lúc tải lên; chính sách nhạc/IP của Meta CHƯA XÁC MINH. Rủi ro khiếu nại Content ID: xem `docs/asset-sources.md`.

## Đăng tự động qua API chính thức (chuẩn bị cho T5 — chưa làm)
| | Điều đã thấy | Mức tin |
|---|---|---|
| TikTok Content Posting API | Cần app được duyệt (scope `video.publish`) và người dùng cấp quyền. **Nội dung đăng bởi app chưa audit bị giới hạn ở chế độ riêng tư**; muốn công khai phải qua audit ✔✔. Hướng dẫn "Intended Use" nêu **không chấp nhận** "a utility tool to help upload contents to the account(s) you or your team manages" ✔✔, tức công cụ tự đăng cho tài khoản của chính mình hoặc đội mình có thể không qua audit. Hạn mức khoảng 15 bài/ngày/tài khoản ✔✔. Nhãn AI: `is_aigc`. Phương án "Upload" (vào hộp thư, người dùng tự duyệt và bấm đăng) cần scope `video.upload`. | ✔✔ cho các điểm đánh dấu; kết quả audit thực tế CHƯA XÁC MINH |
| YouTube Data API `videos.insert` | Scope `youtube.upload`. **Từ 2/11/2026 video upload từ dự án API chưa xác minh không còn bị khoá riêng tư** ✔✔ (đảo ngược chính sách 28/7/2020). Quota mặc định 100 lượt `videos.insert`/ngày và OAuth ở trạng thái "Testing" thì refresh token hết hạn sau 7 ngày (theo T3, chưa đối chiếu lần hai). Nhãn AI: `status.containsSyntheticMedia`. | Dễ nhất trong ba |
| Meta Graph API (Reels) | `POST /{page_id}/video_reels`, chỉ đăng lên Page; quyền `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`; hạn mức 30 bài đăng qua API/24 giờ; hẹn giờ 10 phút–29 ngày; nhãn AI `is_ai_generated`. Nếu chỉ người có vai trò trong app dùng thì có thể chỉ cần Standard Access; Advanced Access cần App Review và Business Verification (theo T3, chưa đối chiếu lần hai). | Phần ẩn riêng tư với app chưa duyệt: CHƯA XÁC MINH |
- Hệ quả cho T5: YouTube dễ tự động hoá nhất; Facebook dùng được cho Page; **TikTok nhiều rủi ro** (khoá riêng tư tới khi audit, và loại công cụ đăng cho chính tài khoản mình). Nên cân nhắc đường "Upload vào hộp thư" (người bấm đăng) cho TikTok.

## Chưa xác minh được (T3, 18/11/2026)
- Trung tâm trợ giúp TikTok và Meta chỉ trả khung JavaScript: không biết nguyên văn tên nút nhãn AI trong app, giọng TTS và hoạt hình có bắt buộc gắn nhãn không, giới hạn caption trong app, vùng an toàn cho video hữu cơ, chính sách nhạc/IP và kiếm tiền của Meta.
- YouTube "AI use" có áp dụng cho giọng TTS không: trang không liệt kê.
- Creator Rewards (TikTok) và YPP (YouTube) có áp dụng ở Việt Nam không: chưa kiểm.
- Tiêu chí audit TikTok; App Review của Meta; ẩn riêng tư với app Meta chưa duyệt; Upload-inbox của TikTok có bị khoá riêng tư không; dung lượng tối đa của Reels API; xác minh OAuth cho scope nhạy cảm của Google.
