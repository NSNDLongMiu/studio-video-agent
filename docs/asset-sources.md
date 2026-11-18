# Nguồn nguyên liệu được phép dùng (cập nhật khi cấu hình thêm)

Đây là **bản vẽ năng lực thật** của xưởng. Ideator/Planner chỉ được đề xuất những gì làm được với danh sách này; Producer chỉ được dùng những nguồn này.

## Đang có
| Loại | Có gì |
|---|---|
| Dựng hình | `ffmpeg`/`ffprobe` (libx264, drawtext, libass, xfade, zoompan, loudnorm) |
| Đồ hoạ | Nền màu/gradient, thẻ chữ, hoạt ảnh chữ (kinetic text) tạo bằng ffmpeg; phông Windows (Segoe UI, Arial, Tahoma, Bahnschrift) |
| **Cáo chuyển động — bản sản xuất mới** | `brand/cao/production-pack/`: 12 chuyển động, 96 PNG chuẩn hoá (88 hình độc lập), MOV alpha và MP4 xem thử. Dùng `tools/fox/animate.mjs` hoặc lớp MOV, xem README trong bộ. Đã QC ở kích thước gốc 373–473px, nguồn 4–8 fps; không khớp miệng và không tự tải mã animation vào whitelist Remotion |
| **Linh vật dẫn truyện: Cáo văn phòng** | 46 dáng cả người (nền trong suốt) + công cụ dựng lớp dẫn truyện (đổi dáng, nhún theo tiếng/phụ đề) — xem `docs/mascot.md`. Không nhép miệng; sticker cao ~330px nên hơi mềm khi phóng. Dùng được ngay, không cần TTS |
| **Bộ Cáo Mít PNG do giám đốc cung cấp** | `brand/cao/animation-pack/`: 458 file frame thuộc 7 nhóm, 457 đọc được; đã có catalog, manifest, CSV và công cụ xuất một ảnh tĩnh `tools/fox/pack-still.mjs`. **Cần kiểm tra/cắt lại, chưa sẵn sàng dựng chuyển động**: có ô cụt hình, nhãn chữ, nền dư và file lỗi. Không đưa mã pack vào Remotion trực tiếp; xem `brand/cao/animation-pack/README.md` |
| Nguyên liệu của giám đốc | Thư mục `library/images`, `library/footage`, `library/music` — **chỉ dùng file giám đốc đã đặt vào đây** |
| Script/tự động hoá | Node 24, Python 3.12 |

## CHƯA cấu hình / đã quyết nguyên tắc (cập nhật 18/11/2026)
- **Giọng đọc (TTS):** đã chốt giọng (toàn giọng Bắc, xem `docs/voice.md`). **Không dùng nhạc nền** (giám đốc chốt 18/11/2026), nên âm thanh video chỉ có giọng đọc.
- **Kho ảnh/clip stock — đã chốt 18/11/2026: CHỈ dùng nguồn miễn phí** (không dịch vụ trả phí; không tải ngẫu nhiên từ Internet). Mỗi file lấy về phải ghi nguồn + giấy phép vào `library/LICENSES.md`. Danh sách nguồn được dùng, điều kiện, quy tắc logo và hình AI: mục "Nguồn ảnh/clip miễn phí được phép" bên dưới (T4 xong 18/11/2026). Hiện chưa có API stock nào được bật.
- **Nhạc nền — đã chốt 18/11/2026: KHÔNG dùng nhạc nền.** Âm thanh video chỉ gồm giọng đọc (và hiệu ứng tối giản tự tạo nếu `script.md` cần); Producer không trộn nhạc. Ghi chú nếu sau này đổi ý: nhạc thư viện của mỗi nền tảng chỉ được cấp phép dùng trên chính nền tảng đó (theo nguồn thứ cấp), nên 1 file đăng cả 3 nền tảng cần nhạc CC0/giấy phép rộng, kiểm từng bài.
- **Tạo ảnh/clip bằng AI — đã chốt 18/11/2026: được dùng ở mọi nơi trong video** (nền, đạo cụ, minh hoạ…), **luôn gắn nhãn AI**. Chỉ dùng công cụ nằm trong tài khoản gói đã cấp (hiện: imagegen tích hợp trong Codex — chính là công cụ đã tạo ảnh Cáo, giám đốc xác nhận 18/11/2026) hoặc chạy cục bộ miễn phí; **không dùng dịch vụ/API trả phí** (`CLAUDE.md` luật 8). Cài ComfyUI hay mô hình cục bộ vẫn cần giám đốc duyệt riêng (`docs/asset-pipeline-design.md`). Chưa có dịch vụ tạo video AI hay API tạo asset tự động của xưởng. **Bản quyền ảnh Cáo:** các nguồn thứ cấp cho biết điều khoản OpenAI giao quyền sở hữu output cho người dùng và cho dùng thương mại, nhưng **chưa đọc được bản gốc điều khoản hiện hành** (openai.com chặn truy cập tự động, lỗi 403) → giám đốc nên đối chiếu tại openai.com/policies. Ảnh AI thuần tuý có thể không được bảo hộ bản quyền (luật Mỹ cần tác giả là người), tức người khác có thể bắt chước Cáo mà khó ngăn.
- **Đăng bài tự động:** chưa có; giám đốc tự đăng. **Đã quyết 18/11/2026:** sau khi giám đốc duyệt file demo thì triển khai tự động làm và đăng bài (`docs/viec-cho-agent.md` T5); trước đó luật cứng #9 giữ nguyên.

## Nguồn ảnh/clip miễn phí được phép (T4 — kiểm 18/11/2026)
> **Độ tin cậy:** agent T4 đọc trang điều khoản bằng công cụ có tóm tắt (không phải bản chụp toàn văn). Claude đã tự đối chiếu lại **Pexels License, Pixabay License Summary và trang logo GitHub**; các mục còn lại theo báo cáo agent, chưa đối chiếu lần hai. Đây **không phải tư vấn pháp lý**; điều khoản đổi theo thời gian, việc quan trọng thì mở link xác nhận. "CHƯA XÁC MINH" nghĩa là không đọc được nguồn chính thức.

### Được dùng
| Nguồn | Điều kiện chính | Điều khoản |
|---|---|---|
| **Pexels** (ảnh, video) | Tải về dùng miễn phí, không bắt buộc ghi công. Không bán nguyên bản chưa chỉnh sửa; không dùng làm nhãn hiệu/tên thương mại; không ngụ ý người hay hãng trong hình bảo trợ; người nhận diện được không được đặt trong ngữ cảnh xấu hay xúc phạm. Chỉ tải tay (điều khoản dịch vụ cấm robot/scraping, theo agent). | https://www.pexels.com/license/ |
| **Pixabay** (ảnh, video; không dùng nhạc) | Dùng miễn phí, không cần ghi công. Không bán/phân phối nguyên bản độc lập. Hình có logo/thương hiệu nhận diện được thì **không dùng thương mại** gắn với hàng hoá/dịch vụ; không dùng người nhận diện được theo cách trái đạo lý hoặc bất hợp pháp. Phải tải về (không hotlink lâu dài), không tải hàng loạt có hệ thống (theo agent). | https://pixabay.com/service/license-summary/ |
| **Wikimedia Commons — chỉ CC0 / phạm vi công cộng** | Dùng thương mại, không bắt buộc ghi công. Tự kiểm trang của từng file; quyền nhãn hiệu/logo và quyền hình ảnh người vẫn ràng buộc. | https://commons.wikimedia.org/wiki/Commons:Licensing |
| **NASA** | Nội dung NASA nhìn chung không thuộc bản quyền ở Mỹ; ghi nguồn NASA; **không dùng logo NASA**; không ngụ ý NASA bảo trợ; loại ảnh bên thứ ba có ghi chủ bản quyền và ảnh người nhận diện. | https://www.nasa.gov/nasa-brand-center/images-and-media/ |

### Dùng có điều kiện
- **Openverse:** chỉ làm công cụ tìm; lọc `cc0`/`pdm`; mở trang gốc kiểm lại giấy phép, người nhận diện, logo. Bộ lọc "thương mại" của họ vẫn từng trả CC BY-SA nên không đủ an toàn.
- **Unsplash:** ưu tiên thấp. Chỉ tải tay, tránh ảnh có người/logo; không dùng API (API bắt ghi công và báo mỗi lượt tải).

### Cấm
- CC BY-SA, và CC BY cho tới khi giám đốc chốt cách ghi công; mọi nguồn NC (phi thương mại) hay ND (không chỉnh sửa).
- Robot/scraping trên Pexels, Pixabay, Unsplash; hotlink lâu dài; đăng hay bán nguyên bản không chỉnh sửa.
- Logo NASA. Logo/thương hiệu hãng khác khi chưa được phép (mục dưới).

### Logo và ảnh chụp màn hình của hãng khác (chủ đề IT)
Mặc định: **chỉ nhắc tên hãng bằng chữ.** Ngoại lệ theo điều khoản từng hãng:
| Hãng | Điều đã thấy | Cách xử lý |
|---|---|---|
| GitHub | Cho dùng logo trong bài blog/tin về GitHub; không sửa màu hay tỉ lệ; không ngụ ý GitHub bảo trợ; trang không nói về ảnh chụp màn hình (đã tự đối chiếu). | Logo nguyên bản, chỉ trong nội dung về GitHub, không đặt nổi hơn tên kênh. |
| Microsoft | Ảnh chụp màn hình dùng được nếu để nguyên khung, không cắt một phần, không chứa nội dung bên thứ ba hay người nhận diện, kèm credit "Used with permission from Microsoft." (theo tóm tắt công cụ). Logo cần giấy phép. | Chỉ ảnh chụp nguyên khung + credit; không dùng logo. |
| Google | Cho nhắc tên bằng chữ không cần xin phép; không dùng logo theo kiểu ngụ ý liên kết; quy tắc ảnh chụp Search nằm sau đăng nhập. | Chỉ chữ. |
| OpenAI | CHƯA XÁC MINH (trang brand trả 403); theo tóm lược thứ cấp: xin phép trước khi dùng logo. | Chỉ chữ. |
| Anthropic | Chỉ được dùng nhãn hiệu trong tài liệu họ duyệt trước; không sửa logo; không có đoạn về tin tức hay ảnh chụp. | Chỉ chữ. |
Không bao giờ đưa logo hãng hoặc người thật vào prompt tạo ảnh AI.

### Hình do AI tạo
- Ghi sổ: công cụ, model, ngày, prompt. Không giả là ảnh thật hay tranh người vẽ. Luôn gắn nhãn AI (luật cứng).
- Điều khoản OpenAI: **chưa đọc được bản gốc 2026** (trang trả 403). Bản sao thứ cấp (12/2024) ghi người dùng sở hữu đầu ra, OpenAI chuyển giao quyền "nếu có", đầu ra có thể không độc nhất, cấm giả đầu ra là do con người tạo.
- US Copyright Office (báo cáo 29/01/2025): chỉ đưa prompt không đủ để được bảo hộ; phần do con người sáng tạo (kịch bản, sắp xếp, dựng) mới có thể được bảo hộ. Suy ra, hình AI thuần có thể khó ngăn người khác dùng lại (suy luận của agent, không phải tư vấn pháp lý).
- Ảnh từ công cụ OpenAI có thể mang C2PA/SynthID; chỉnh sửa hay đổi định dạng có thể làm mất siêu dữ liệu (theo agent). Vẫn tự gắn nhãn AI.

### Rủi ro khiếu nại bản quyền (Content ID)
- YouTube: Short dài hơn 1 phút mà có khiếu nại bản quyền đang hiệu lực sẽ bị chặn trên YouTube, không bị cảnh cáo bản quyền (support.google.com/youtube/answer/6013276, theo agent).
- Hình/clip Pexels và Pixabay: không thấy thông tin chính thức về Content ID, CHƯA XÁC MINH. Lưu bằng chứng giấy phép để tranh chấp khi cần.

### Sổ giấy phép
`library/LICENSES.md` (đã tạo mẫu). Mỗi hình/clip lấy ngoài hoặc do AI tạo và có mặt trong video đều phải có dòng; QC đối chiếu (bước 3a trong `.claude/agents/support.md`).

### Chưa xác minh được
OpenAI (terms 2026, brand, chính sách chia sẻ: trả 403); quy tắc ảnh chụp màn hình của GitHub, OpenAI, Anthropic; Google Search (sau đăng nhập); Content ID cho Pexels/Pixabay; điều kiện "link về nguồn" của API Pexels/Pixabay khi chỉ tải tay; điều khoản API của NASA; điều khoản mới của Openverse; API Guidelines của Unsplash.

### Câu hỏi còn chờ giám đốc
1. Có cho dùng ảnh **CC BY** (phải ghi công tác giả) không? Đề xuất: không, cho tới khi có quy trình ghi công.
2. Cho **Unsplash** (tải tay, ưu tiên thấp) không? Đề xuất: cho.
3. **Logo hãng khác:** đồng ý quy tắc "chỉ chữ; riêng GitHub (logo nguyên bản) và Microsoft (ảnh chụp nguyên khung + credit)" không?

## Hệ quả cho ý tưởng lúc này
Phong cách khả thi: **Cáo văn phòng (linh vật cáo công sở) dẫn truyện** trên nền đồ hoạ/chữ động/infographic dọc, danh sách mẹo, so sánh, đếm ngược, hỏi–đáp, giọng đọc + phụ đề (không nhạc nền); hoặc dùng ảnh/clip do giám đốc cung cấp. Chưa làm được: người thật, cảnh quay thực tế, lồng tiếng tự nhiên (đến khi có TTS), nhân vật nhép miệng.
