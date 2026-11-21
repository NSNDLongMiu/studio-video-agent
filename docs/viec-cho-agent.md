# Việc giao cho Agent (AI tự đọc và nhận)

> Giám đốc giao ngày 18/11/2026: việc nào là của AI thì ghi ở đây để agent đọc và làm. Việc của người (giám đốc) nằm ở `docs/CHECKLIST.md`.
> **Agent đọc trước khi nhận việc:** `CLAUDE.md`, `AGENTS.md`, `LOI-NHAN-MAY-MOI.md`. Dự án nằm ở `D:\Agent Video Studio` (không còn `E:\Tiktoker`).

## Quy tắc chung
1. **Chỉ miễn phí.** Không API, không dịch vụ AI trả phí, không việc gì gây phát sinh phí (giám đốc chốt 18/11/2026, `CLAUDE.md` luật 8). Dùng tài khoản gói đã cấp qua cơ chế worker; hết limit thì chờ, không tự đổi tài khoản ngoài cơ chế.
2. **Gắn nhãn AI** cho mọi nội dung do AI tạo; ghi nguồn + giấy phép cho mọi tài nguyên lấy từ ngoài.
3. **Báo trung thực:** nói rõ cái gì đã kiểm chứng, cái gì chưa. Việc chưa làm được thì ghi "chưa làm được" và lý do.
4. Việc đụng `studio/`, `.claude/`, `CLAUDE.md`, `AGENTS.md` chỉ làm trong **phiên tương tác với giám đốc**; agent chạy nền (worker) không sửa những chỗ đó.
5. Xong việc nào thì cập nhật cột "Trạng thái" bên dưới và tick dòng tương ứng trong `docs/CHECKLIST.md`; ghi 1 dòng kết quả (ngày, ai làm, bằng chứng).

## Bảng việc
| Mã | Việc | Ai làm | Điều kiện bắt đầu | Trạng thái |
|---|---|---|---|---|
| T1 | Hoạ sĩ linh vật: cập nhật Cáo (độ phân giải, trang phục theo cụm chủ đề) | Claude (phiếu trang phục, QC) + Gemini (tạo ảnh; Codex nếu Gemini không giữ nhất quán) | Giám đốc xác nhận thiết kế vai (đụng cơ cấu trong `CLAUDE.md`) | **Hoãn:** giám đốc duyệt demo xong sẽ hỏi lại (18/11/2026) |
| T2 | Nhép miệng cho Cáo | Agent nào nhận (Claude hoặc Codex) | Đã đủ: giọng đã chốt (`docs/voice.md`) | Chờ agent nhận |
| T3 | Rà `docs/platform-specs.md` với chính sách hiện hành | Claude (có tìm web) | Không | **Xong 18/11/2026** (còn 3 câu hỏi cho giám đốc) |
| T4 | Nguồn ảnh/clip miễn phí + sổ giấy phép | Claude | Không | **Xong 18/11/2026** (còn 3 câu hỏi cho giám đốc) |
| T5 | Tự động làm và đăng bài | Claude thiết kế, Codex làm | **Giám đốc đã duyệt file demo** | Khoá |
| T6 | Hồ sơ QC `standard` (45–75 s) trong `qc-measure` | Claude làm thay Codex (Codex hết hạn mức tới 23/11/2026 14:37; giám đốc yêu cầu giảm tải Codex) | — | **Xong 20/11/2026** (38/38 test của 2 file, cả bộ xanh, T9/T5 đo giống hệt mã cũ) |

## T6 — Hồ sơ QC `standard` (45–75 s)
**Giám đốc chốt 20/11/2026:** độ dài mặc định đổi sang **45–75 s, mục tiêu ≈ 60 s, mỗi video một câu hỏi** (D1 trong `docs/chat-luong-xem.md`). **Xong 20/11/2026:** lần giao Codex chết vì hết hạn mức sau 4 giây, nên theo yêu cầu giảm tải cho Codex của giám đốc, Claude tự làm đúng spec bên dưới (mục “Yêu cầu mã”). Hồ sơ chỉ còn để tra cứu lý do và cách nghiệm thu.
- **Vì sao phải đổi mã (đã xử lý):** `tools/scene-metrics.mjs` chỉ có `short` (15–45 s) và `explainer` (150–190 s, tự chọn khi > 75 s). Video 45–75 s sẽ tự chọn `short`, bị báo lỗi “dài > 45 s” (QC coi là lỗi dựng → tự sản xuất lại tới 9 lần, tốn hạn mức) và **mất toàn bộ kiểm tra D8** (opening, header, `text_audit`, information pace, `voice_edges`), vì các kiểm tra đó trong `tools/qc-measure.mjs` chỉ bật khi `profile === 'explainer'`.
- **Cách tạm đã dùng trước khi có mã (không còn cần):** `node tools/qc-measure.mjs <epNN> --profile explainer --min 45 --max 75` chạy đủ kiểm tra D8, 0 lỗi, chỉ sinh một cảnh báo sai M-30 “ngắn hơn khoảng chấp nhận … Ngưỡng thử 150 s”.
- **Yêu cầu mã (đã thực hiện đúng như vậy):** (1) thêm hồ sơ `standard` vào `PROFILES`: `min_duration_s 45, warn_duration_s 70, max_duration_s 75, max_scenes = floor(d/5), mean_scene_s 5, theme_pct 40, max_theme_run 4, shot_run 3, min_themes 3, min_themes_from_s 30`; `short` và `explainer` giữ nguyên. (2) `selectProfile`: `explicit` thắng; còn lại `> 75 s` hoặc `max > 75` → `explainer`; `> 45 s` hoặc `max > 45` → `standard`; ngược lại `short`. (3) **Mọi chỗ `profile === 'explainer'` bật kiểm tra D8/Visual-first/Information trong `qc-measure.mjs` phải áp dụng cho cả `standard`** (hàm `usesExtendedChecks(profile) = profile !== 'short'`; grep `explainer` từng chỗ). (4) Kiểm tra thời lượng làm theo hồ sơ đang chọn: dưới min WARN mềm, trên 70 s WARN “gần trần”, trên 75 s ERROR; giữ mã luật cũ của explainer, thêm mã `standard_*`; cảnh báo Shorts “> 180 s” áp dụng cho mọi hồ sơ. (5) `--profile` nhận `short|standard|explainer`; tăng `THRESHOLD_VERSION` lên `M-2026-11-20`. (6) Test: `selectProfile` (30/45 → short; 45,1/60/75 → standard; 75,1/160 → explainer; `explicit` ghi đè), `PROFILES.standard`, video 60 s không bị báo “> 45”, 76 s ép standard có ERROR, 71 s có WARN gần trần, `standard` bật kiểm tra mở rộng như explainer.
- **Phạm vi file:** `tools/scene-metrics.mjs`, `tools/qc-measure.mjs`, `studio/src/runners.mjs` (chỉ dòng chú thích số 14), `studio/test/scene-metrics.test.mjs`, `studio/test/qc-measure.test.mjs`. **Không đụng** `tools/config`, `tools/audio`, `tools/voice`, `tools/motion`, `studio/schema` (cửa sổ khác đang thiết kế lại opening).
- **Nghiệm thu:** hai file test riêng xanh; `npm test --prefix studio` chạy NGOÀI sandbox xanh (lỗi `EPERM` ở `worker`/`account-owner`/`office` trong sandbox Codex là giả); `qc-measure` trên T9 (≈ 179 s) vẫn hồ sơ `explainer`, phát hiện không đổi. **Kết quả đo (20/11/2026):** 38/38 test của `scene-metrics` + `qc-measure` (3 test mới); thử phá cố ý (cho `standard` không bật kiểm tra mở rộng) làm 2 test mới đỏ, đúng chỗ; báo cáo T9 (82 phát hiện, `explainer`) và T5 (32 phát hiện, `short`) bằng mã mới giống hệt mã cũ. Các câu “tạm thời” trong `support.md`, D1, `AGENTS.md`, `LOI-NHAN-MAY-MOI.md` đã đổi thành mô tả hồ sơ `standard` tự chọn.

## T1 — Hoạ sĩ linh vật
**Giám đốc yêu cầu (18/11/2026):** phải có agent lo việc cập nhật Cáo; ví dụ chủ đề sa mạc thì Cáo phải thay đồ. **Tạm thời dùng chung 1 bộ đồ công sở cho mọi video**, về sau đổi theo cụm chủ đề. Chưa cần trang phục mới cho video demo đầu.
- **Nhận diện giữ nguyên:** cáo cam lông mềm 3D hoạt hình, mặt, kính tròn gọng đen, đuôi to chóp trắng (`docs/mascot.md`). **Được đổi:** quần áo, mũ, phụ kiện, đạo cụ theo chủ đề. Khi bộ đồ đầu tiên được duyệt, sửa mục "Nhận diện" trong `docs/mascot.md` cho khớp.
- **Thiết kế đề xuất (chờ giám đốc xác nhận):**
  1. Vai `mascot-stylist` (Claude): đọc cụm chủ đề, viết "phiếu trang phục" (đồ gì, màu gì, đạo cụ, lý do), kiểm nhất quán nhân vật sau khi tạo. Không tự ghi ảnh dựng.
  2. Tạo ảnh bằng **Gemini** qua `gemini-run.mjs images` (từ 20/11/2026 việc tạo ảnh chuyển từ imagegen của Codex sang Gemini để giảm tải Codex; chưa thử truyền ảnh tham chiếu cho `image-generator` của `agy` nên chưa biết có giữ được nhất quán nhân vật không — nếu không giữ được thì quay lại imagegen của Codex cho riêng mục này, giám đốc quyết) trong gói đã cấp, lấy `assets/mascot/` và `brand/cao/production-pack/` làm tham chiếu. Kết quả vào `brand/cao/wardrobe/<cụm-chủ-đề>/`, chuẩn hoá bằng `tools/fox/`.
  3. Kích hoạt: Visual Director thấy cụm chủ đề chưa có bộ đồ thì ghi vào danh sách "asset còn thiếu" (đúng `docs/asset-pipeline-design.md`, không tự thay bằng slide chữ). Chưa có bộ đồ thì dùng bộ công sở mặc định.
  4. Giữ phạm vi nhỏ cho đỡ tốn hạn mức: mỗi bộ đồ chỉ làm cho các chuyển động hay dùng nhất của production-pack (khoảng 12 mã), không làm cả 46 dáng.
- **Nghiệm thu:** 1 bộ mẫu (đề xuất: sa mạc) xem bằng mắt trên nền sáng và tối, đồng nhất với Cáo gốc; có trong catalog với nguồn `generated_ai`; có nhãn AI; không phát sinh phí.
- **Chưa biết, cần thử:** imagegen giữ nhất quán nhân vật giữa các chuyển động tới mức nào; có nâng độ phân giải mà không tốn thêm phí được không.

## T2 — Nhép miệng cho Cáo
Làm theo `docs/prompts/lipsync-cao.md` (đã sửa đường dẫn sang `D:\Agent Video Studio`). Điều kiện đã đủ vì giọng đã chốt (Hải Đăng, Trúc Ly, Quốc Tuấn, Ngọc Huyền — chốt lại 19/11/2026). Lưu ý:
- Không có cờ thì hành vi cũ giữ nguyên; test `tools/fox` phải giữ đạt.
- Mô hình AI nào dùng phải đọc giấy phép (nhiều mô hình cấm thương mại) và chạy được **không cần mạng và không trả phí**.
- Kết luận "cần giám đốc cung cấp thêm bộ đầu/miệng cùng góc nhìn" là kết quả hợp lệ nếu có bằng chứng (mục 4D của prompt).

## T3 — Rà `docs/platform-specs.md`
Đối chiếu với chính sách hiện hành của TikTok, Facebook Reels, YouTube Shorts, **dẫn link nguồn chính thức và ngày kiểm**. Tối thiểu: thông số video (tỉ lệ, thời lượng tối đa), quy định gắn nhãn nội dung AI của từng nền tảng, chính sách nội dung lặp/hàng loạt/ít giá trị, giới hạn tiêu đề/hashtag. Chỗ nào không xác minh được từ nguồn chính thức thì ghi rõ "chưa xác minh". Không đăng gì.
**Kết quả (xong 18/11/2026):** `docs/platform-specs.md` đã viết lại kèm nguồn, ngày kiểm và mục "chưa xác minh". Điểm chính: 60 giây chỉ là mức riêng của xưởng; vùng an toàn 20–25% chưa có nguồn chính thức; `#Shorts` không bắt buộc; nhãn AI chỉ bắt buộc với nội dung trông như thật nhưng xưởng vẫn luôn gắn; YouTube có thể không cho kiếm tiền kênh chỉ đọc lại tin hoặc làm theo khuôn AI; TikTok đăng tự động nhiều rủi ro. Giám đốc còn 3 câu: vùng an toàn, tiêu chí "góc nhìn riêng" cho review Kịch bản, đường đăng TikTok (xem `docs/CHECKLIST.md` mục 4).

## T4 — Nguồn ảnh/clip miễn phí
- **Nguyên tắc đã chốt:** chỉ nguồn miễn phí; được dùng ảnh/clip AI ở mọi nơi (luôn nhãn AI). Mỗi file lấy về ghi nguồn + giấy phép vào `library/LICENSES.md`.
- **Việc làm:** kiểm điều khoản hiện hành của các nguồn ứng viên (Pexels, Pixabay, Wikimedia Commons chỉ lấy CC0/public domain), chốt danh sách được phép, cập nhật `docs/asset-sources.md`. Nếu chọn đường API thì cần giám đốc đăng ký khóa miễn phí; chưa kiểm lại điều khoản hiện hành.
- **Nhạc:** nhạc mặc định tắt theo `layers.music.enabled` trong `tools/audio/sound-design.json`. Chỉ dùng nhạc tự tổng hợp bằng `tools/audio/music_synth.py` sau khi giám đốc nghe và bật. Luôn ducking dưới giọng, không để nhạc che lời. Cấm nhạc bên ngoài.
- **Kết quả (xong 18/11/2026):** danh sách được dùng / có điều kiện / cấm, quy tắc logo hãng khác và hình AI nằm ở `docs/asset-sources.md`; sổ giấy phép mẫu ở `library/LICENSES.md`; QC thêm bước 3a đối chiếu sổ. Giám đốc còn 3 câu: CC BY, Unsplash, logo hãng khác.

## T5 — Tự động làm và đăng bài
**Giám đốc quyết (18/11/2026):** khi file demo được giám đốc duyệt thì triển khai tự động làm và đăng bài. Đến lúc đó `CLAUDE.md` luật 9 vẫn hiệu lực (không đăng tự động).
- **Cập nhật 21/11/2026:** giám đốc yêu cầu mở khoá cho phòng IT, TikTok. Đã viết **`docs/auto-publish-design.md`** (chưa mã, chưa bật). Kết luận: đăng công khai hoàn toàn tự động lên TikTok bằng API chính thức không khả thi cho trường hợp của xưởng; khuyến nghị làm gói đăng một chạm trước, rồi cân nhắc Upload-inbox. **Giám đốc chọn (21/11/2026) gói đăng một chạm chỉ cho TikTok — đã làm** (`cli pack`, khung "Sẵn sàng đăng"); công cụ trình duyệt ngụy trang bị từ chối; YouTube/Facebook tự đăng qua API chưa làm (giám đốc chưa chọn).
- Khi mở khoá, việc đầu tiên là **viết tài liệu thiết kế** (như `docs/asset-pipeline-design.md`), chưa viết mã: đăng thế nào cho từng nền tảng (API chính thức hay thủ công, điều khoản về tự động hoá), gắn nhãn AI tự động theo `publish.json`, xử lý lỗi và đăng trùng, bảo mật khoá, chi phí bằng 0.
- Giám đốc quyết khi duyệt thiết kế: mức tự động (còn bước duyệt từng video hay không) và lúc bật. Đăng bài là việc hướng ra ngoài, khó rút lại, nên mỗi bước bật cần giám đốc đồng ý riêng.
- **Phát hiện từ T3 (xem `docs/platform-specs.md` mục API):** YouTube dễ tự động hoá nhất (từ 2/11/2026 không còn khoá riêng tư cho dự án chưa xác minh); Facebook dùng được cho Page; TikTok đăng bởi app chưa audit bị giới hạn riêng tư và hướng dẫn "Intended Use" không chấp nhận công cụ đăng cho tài khoản của chính mình/đội mình, nên TikTok nên đi đường "Upload vào hộp thư" (người bấm đăng) hoặc đăng tay.
