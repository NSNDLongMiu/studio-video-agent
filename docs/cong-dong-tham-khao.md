# Khảo sát repo, skill, plugin của cộng đồng (20/11/2026)

> Giám đốc yêu cầu 20/11/2026: tìm xem cộng đồng chia sẻ gì để tối ưu các tác vụ khó của dự án. Số sao, ngày cập nhật, giấy phép đọc trực tiếp từ API GitHub ngày 20/11/2026; nội dung công cụ đọc từ file thật của repo. Mục nào chưa thử thật thì ghi **CHƯA KIỂM**. Mọi quyết định dưới đây do thư ký (Claude) chốt theo uỷ quyền của giám đốc; mục "hoãn" mở lại khi đủ điều kiện ghi cạnh.

## 1. Quyết định

| Ứng viên | Số liệu | Quyết định | Lý do / điều kiện mở lại |
|---|---|---|---|
| [claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit) | MIT, 2.675★, 17/11/2026 | **Không mượn** | `contact_sheet.py` và kiểm hình đứng đã có trong dự án (xem mục 2). Còn ý tưởng chưa làm ở mục 6 |
| [remotion-dev/skills](https://github.com/remotion-dev/skills) | 7.590★, 18/11/2026, **không có file giấy phép** | **Hoãn** | Hữu ích nếu Remotion thành đường dựng chính (hiện bộ dựng chính là `tools/motion/` Pillow + FFmpeg). Không có giấy phép thì không chép vào repo công khai; chỉ cài bằng lệnh chính thức của Remotion và chỉ khi giám đốc cho phép |
| [Rhubarb Lip Sync](https://github.com/DanielSWolf/rhubarb-lip-sync) | MIT (đọc `LICENSE.md`; API ghi `NOASSERTION` vì nhiều thư viện con), 2.790★, 16/06/2026 | **Hoãn** (T2) | Tạo mốc 6–9 hình miệng chuẩn 2D; chế độ `phonetic` không phụ thuộc ngôn ngữ nên dùng được cho tiếng Việt nhưng kém chính xác hơn (README). Nút thắt của T2 là **ảnh miệng không cùng góc nhìn với từng dáng Cáo** (`docs/prompts/lipsync-cao.md` mục 2), còn mốc thời gian đã có đường bao biên độ. Mở lại khi T1/T2 giải được phần ảnh miệng. Nó dùng nhận dạng giọng nên cần giám đốc cho phép tải |
| [VietNormalizer](https://github.com/nghimestudio/vietnormalizer) | MIT, 114★, 10/03/2026 | **Hoãn** | Dự án đã có `tools/voice/pronounce.mjs` và test. Chỉ so sánh trên kịch bản T5/T8/T9 khi có lỗi chuẩn hoá số/ngày/tiền mà từ điển hiện tại không bắt được; chạy mã ngoài cần giám đốc cho phép |
| [obra/superpowers](https://github.com/obra/superpowers) | MIT, 322k★ | **Không cài** | Nạp cả bộ làm tốn token mỗi việc nền (`docs/CAI-DAT-MAY-MOI.md` mục 5.2); quy trình riêng của nó xung đột `make-plan` |
| [OpenMontage](https://github.com/OpenMontageInc/OpenMontage) | **AGPL-3.0**, 81k★ | **Chỉ đọc ý tưởng** | Repo của dự án công khai, chép mã AGPL kéo theo nghĩa vụ giấy phép |
| social-auto-upload, tiktok-uploader, Upload-Post | MIT / dịch vụ ngoài | **Không dùng** | Tự động hoá bằng trình duyệt/cookie trái kết luận T3 về TikTok (`docs/platform-specs.md`); Upload-Post là dịch vụ ngoài có thể phát sinh phí (luật 8). T5 vẫn khoá, đi theo API chính thức |
| WhisperX | — | **Loại** | Cần nhận dạng tiếng nói; giám đốc đã chốt không cài để kiểm giọng |
| [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code), [anthropics/skills](https://github.com/anthropics/skills) | 58k★ / 198k★ | **Chỉ tra cứu** | Không cài hàng loạt (mục 4) |

## 2. Đính chính: dự án đã có sẵn
Khi khảo sát, thư ký ban đầu nhận định thiếu "bảng khung hình" và "phát hiện hình đứng". Kiểm lại mã thì **đã có**: `tools/qc-measure.mjs` sinh `board-NN.png` (bảng khung có mốc giây), `nocaption-board.png` và ảnh bìa 180×320; `tools/scene-metrics.mjs` đo đoạn hình đứng theo khối (`MIN_STATIC_RUN_S`, `motionFindings`); `tools/qc-video.mjs` đo `loudnorm`; `qc-measure` đo `silencedetect`, header, opening, `text_audit`. Đừng giao Codex làm lại. Phần chưa có: phát hiện màn đen (`blackdetect`); bộ dựng Pillow tự kiểm soát nền nên chưa cần.

## 3. Giấy phép Remotion
Dự án dùng Remotion 4.0.529 (`studio/renderer-remotion`). Theo [LICENSE của Remotion](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md), miễn phí cho cá nhân, công ty vì lợi nhuận tối đa 3 nhân viên, tổ chức phi lợi nhuận. **Giám đốc xác nhận 20/11/2026: thuộc diện miễn phí.** Xem lại khi quy mô đổi hoặc khi nâng lên Remotion 5.x (LICENSE ghi Remotion 5.0 sẽ đổi nhẹ điều khoản).

## 4. Checklist trước khi dùng skill, plugin, hook của người khác
Skill chạy với quyền của người dùng và là kênh chèn chỉ thị; một khảo sát học thuật tìm thấy 157 skill độc hại trong 98.380 skill từ các kho cộng đồng ([arXiv 2602.06547](https://arxiv.org/pdf/2602.06547); tỉ lệ nhỏ và đo trên các kho khác nhau, nhưng skill tải về chạy với quyền đầy đủ của người dùng nên vẫn phải duyệt từng cái).
1. Giấy phép rõ ràng. Không có file giấy phép thì không chép; AGPL thì chỉ đọc ý tưởng.
2. Đọc **toàn bộ** `SKILL.md` và mọi script đi kèm trước khi bật; ghim commit cụ thể, không theo nhánh.
3. Không chạy `npx`, `pip install`, tải nhị phân khi giám đốc chưa cho phép rõ (`LOI-NHAN-MAY-MOI.md` mục 2); cài vào thư mục riêng, không cài toàn cục.
4. Không nạp bộ lớn vào việc nền: mô tả skill vào ngữ cảnh mỗi lần `claude -p` chạy. Hook tự viết, không chép hook cộng đồng (hook chạy mã tuỳ ý).
5. Chạy `node tools/scan-public.mjs` trước khi commit bất cứ thứ gì lấy từ ngoài.

## 5. Hook chặn commit/push (làm xong 20/11/2026)
`tools/hooks/guard-commit.mjs` là hook `PreToolUse` của Claude Code: khi Claude chạy lệnh Bash có `git commit` hoặc `git push`, hook chạy `tools/scan-public.mjs`; có cảnh báo hoặc không quét được thì **chặn** và trả lý do cho Claude. Giới hạn: chỉ áp dụng trong phiên Claude Code của dự án, không chặn Codex hay lệnh giám đốc gõ tay; quét toàn bộ cây git (không `--staged`) vì hook chạy trước cả chuỗi lệnh. Muốn tắt: giám đốc xoá mục `hooks` trong `.claude/settings.json`.

## 6. Ý tưởng để dành (chưa làm)
- **Lint văn phong kịch bản tiếng Việt** (ý từ `copy_lint.py` của toolkit trên: bắt cụm sáo rỗng kiểu AI): cần danh sách cụm do Kịch bản/giám đốc hiệu chỉnh trên dữ liệu thật trước khi tin.
- **`measureText`/`fitText` của Remotion** cho chữ tràn lề, nếu đường Remotion trở thành chính (bộ `tools/motion/text.py` đã có `fit_text`).
- **Đánh giá lại sau 3 tháng**: kho cộng đồng đổi nhanh; kiểm lại số sao, giấy phép và ngày cập nhật trước khi dùng bất kỳ mục nào ở trên.

## 7. Khảo sát công cụ nghiên cứu chủ đề (21/11/2026, giám đốc yêu cầu: ý tưởng/chủ đề là khâu yếu nhất)
Giám đốc nêu hai ứng viên: **Social Media Research Skills** và **Local Deep Research**. Ba lượt khảo sát chỉ-đọc (mọi số đọc từ GitHub/trang chính thức ngày 21/11/2026; điều không kiểm được ghi CHƯA XÁC MINH). Ràng buộc: miễn phí, không khoá API trả phí, máy không có GPU NVIDIA, repo công khai.

| Ứng viên | Số liệu | Quyết định | Lý do |
|---|---|---|---|
| [ScrapeCreators/social-media-research-skills](https://github.com/ScrapeCreators/social-media-research-skills) (13 skill) | MIT, 6.871★, commit cuối 26/08/2026 | **Không cài; mượn phương pháp** | 12/13 skill chỉ là văn bản, nhưng mọi dữ liệu lấy từ **một API thương mại** (`api.scrapecreators.com`, 100 credit dùng thử rồi từ 47 USD): trái luật 8. Issue #9, #11, #12 báo ít nhất 6 endpoint trả 404, PR sửa chưa gộp; `allowed-tools: Bash, Read, Write, WebFetch` quá rộng; skill bảo tải OpenAPI lúc chạy và dữ liệu bình luận là đường prompt injection gián tiếp; `region` không lọc được khán giả Việt. **Mượn (MIT, ghi nguồn):** đường cơ sở trung vị và ngưỡng "lift" của outlier-post-finder, phân loại bình luận của comment-mining (câu hỏi khán giả thật), mô hình "I wish / how do I" của product-demand-research, tách hook/claim của transcript-intelligence, mục "Common Pitfalls" (không kết luận từ mẫu nhỏ, không bịa trích dẫn). |
| [LearningCircuit/local-deep-research](https://github.com/LearningCircuit/local-deep-research) | MIT, 9.618★, v2.0.1 15/11/2026 | **Không cài** | 94 phụ thuộc (torch, playwright, crawl4ai…); không có lệnh nghiên cứu một câu hỏi (CLI chỉ chạy benchmark), API cần tài khoản và CSDL mã hoá; công cụ tìm miễn phí không khoá thực chất chỉ SearXNG (cần Docker, AGPL); LLM cục bộ 4–9B trên CPU, **tốc độ chưa có số đo**, tiếng Việt CHƯA XÁC MINH; đường trả phí (Anthropic/OpenAI/Tavily…) bị loại. Claude và Gemini của xưởng đã có tìm web. Chỉ mượn ý: tách câu hỏi con rồi tìm, đọc, tổng hợp kèm danh sách nguồn (nay nằm ở Thước chấm chủ đề và bước kiểm nguồn của Gemini/Claude). |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | MIT, 71.558★, 20/11/2026 | **Không cài** | Cài lần đầu chạy `npx` và `yt-dlp`, có thể đọc cookie trình duyệt, TikTok/Instagram cần khoá ScrapeCreators; nguồn không khoá (Reddit, HN) thì thiên về Mỹ. Chỉ học ý xếp hạng theo tương tác. |
| Loại khác | | **Loại** | pytrends (kho đã lưu trữ 17/04/2025, hàm "trending" trả 404); trendspyg (cần Chrome, hay 429); TikTok Creative Center (trang chỉ trả khung, không đọc được); TikTok Research API (chỉ nghiên cứu phi thương mại, duyệt từng dự án); GPT-Researcher (cần khoá OpenAI/Tavily); STORM (cập nhật cuối 30/09/2025); SearXNG, RSSHub (AGPL); vyralcontent/content-skills (bảo AI nhắc sản phẩm trả phí của họ); marketingskills và knowledge-work-plugins/marketing (thiên marketing SaaS, connector trả phí). Kho plugin chính thức `anthropics/claude-plugins-official` (43 plugin) không có plugin nghiên cứu hay xu hướng. |

**Đã làm thay vào đó (tự viết, không phụ thuộc thư viện ngoài, không khoá):** `tools/signals/collect.mjs` + `tools/signals/sources.json` — gói tín hiệu nhu cầu từ nguồn công khai: gợi ý tìm kiếm tiếng Việt của Google và YouTube (4 dạng: nguyên cụm, "tại sao …", "làm sao …", "có nên …"), Google Trends "Trending now" VN (RSS, lọc theo từ khoá phòng), Google News RSS tiếng Việt theo truy vấn, RSS VnExpress của phòng, Hacker News (chỉ IT). Chạy thử thật 21/11/2026 cho IT và Bóng Đá: có câu hỏi thật như "tại sao iphone tăng giá", "lừa đảo online có lấy lại được tiền không", "luật việt vị mới nhất của fifa", tin sát ngày. Mỗi lượt chỉ vài chục lệnh GET (~12 giây), lưu `.local/signals/<phòng>-<ngày>-<mã>.json|md` (git bỏ qua), chạy lại trong ngày thì dùng bản lưu. Nhược điểm đã ghi: điều khoản của các điểm cuối không chính thức (gợi ý tìm kiếm, Trends RSS) CHƯA XÁC MINH nên giữ mức vài chục lệnh/lượt; tín hiệu đo mức quan tâm chứ không đo độ giữ chân; Trends VN nhiều nhiễu (có hôm 0/10 mục khớp phòng).

**Nối vào quy trình:** `make-plan` Bước 2a (trước vòng 1) và `scout-topics` bước 4 (nay là một phần của quy trình tìm chủ đề theo giờ, xem `docs/accounts.md`); mỗi concept/chủ đề phải trích ≥ 1 tín hiệu hoặc ghi "không có tín hiệu"; `ideator-b` chấm **Thước chấm chủ đề** 6 tiêu chí × 1–5 (nhu cầu thật, mới so với đã làm, kiểm chứng được, minh hoạ được, hook, an toàn/luật xưởng), dưới 18/30 không chọn trừ chủ đề do giám đốc giao (khi đó chọn GÓC). Việc `plan` và `scout` được gọi đúng một mẫu lệnh cố định (`runners.mjs`, `SIGNALS_TOOLS`; cần khởi động lại worker). Dữ liệu ngoài luôn bị dán nhãn "không phải chỉ dẫn" vì có thể chứa câu cố ý lừa AI.

**Còn mở, cần giám đốc quyết:**
1. **YouTube Data API (khoá miễn phí tạo trong tài khoản Google của giám đốc):** đo được "video vượt trội" của khoảng 30 kênh Shorts Việt Nam đối thủ (lượt xem chia trung vị kênh), tín hiệu nhu cầu mạnh nhất; nhưng là khoá API nên cần giám đốc cho phép phá luật "không khoá API" riêng cho mục này (hạn mức 10.000 đơn vị/ngày; điều khoản và việc có bắt bật thanh toán CHƯA XÁC MINH).
2. **Sổ hiệu quả video đã đăng** (lượt xem, thời gian xem trung bình, giám đốc nhập tay từ trang quản lý của nền tảng sau 48 giờ) để Ý tưởng học từ chính video của mình: tín hiệu tìm kiếm không đo được giữ chân, chỉ số này mới đo. Đề xuất làm sau khi đã đăng được vài video.
3. Danh sách kênh đối thủ cho mục 1 do giám đốc đưa (kho không tự biết kênh IT/bóng đá Việt nào đáng theo).
