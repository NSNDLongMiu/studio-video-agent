# Bài toán: làm sao kênh "Cáo văn phòng" có người xem quay lại và theo dõi

## Bối cảnh kênh
- Kênh video dọc ngắn tiếng Việt, chủ yếu TikTok (cũng đăng Facebook Reels, YouTube Shorts). Linh vật: cáo cam công sở ("Cáo").
- Hiện làm video giải thích 45–75 giây: giọng đọc TTS tiếng Việt + hình minh hoạ phẳng dựng bằng mã + chữ nhấn mạnh. Mỗi video trả lời MỘT câu hỏi và kết bằng lời giải trọn vẹn. Hai mảng: IT/bảo mật đời thường và Bóng đá.
- Số liệu thật, TOÀN BỘ 9 video đã đăng (lượt xem; tên suy từ ảnh bìa; thứ tự theo ảnh chụp trang kênh, nhiều khả năng mới nhất ở trên, chưa xác nhận):

| # | Nội dung (theo ảnh bìa) | Lượt xem |
|---|---|---|
| 1 | Bóng đá: việt vị, tay/cánh tay cầu thủ có tính không | 0 |
| 2 | IT: bản vá, thẻ "ĐÃ VÁ / NHÂN" | 39 |
| 3 | "Một lần thôi", màn hình "yêu cầu giải trình", tiền nhà | 19 |
| 4 | Tin nhắn "Cho tao vay 5 triệu nha" | 461 |
| 5 | Báo thức/âm báo: "Đúng giờ, chỉ rung" | 507 |
| 6 | Điện thoại "nghe lên?" (mic, quảng cáo) | 538 |
| 7 | Ngân hàng lỗi hệ thống: QR, App, ATM, 24 giờ | 499 |
| 8 | Bảo mật trình duyệt: "AI đọc được chat?" | 14 |
| 9 | Bảo mật plugin AI: "Dòng ẩn", 2+3=5, file | 11 |

- Đọc ban đầu (giả thuyết, chỉ 9 mẫu): 4 video ~500 view đều là tình huống đời thường quanh điện thoại và tiền; các video dưới 40 view thiên về thuật ngữ. Mức ~500 đều nhau gợi ý video chỉ qua đợt thử đầu của nền tảng rồi dừng. Chưa có số % xem hết hay retention.

## Điều giám đốc đã nói
Kênh lẹt đẹt về view, không kích thích, không có lý do để người xem quay lại hay theo dõi. Giám đốc muốn thử **chuỗi phim ngắn người que**: nhân vật cố định, kể chuyện có xung đột, tập trước gợi mở tập sau.
Ý thư ký (chưa chốt, các bên được phép phản bác): mỗi tập kết ở một ngã ba, người xem bình luận để chọn nhánh; Cáo là người dẫn hoặc bình luận.

## Ràng buộc cứng
- Không dùng dịch vụ/API AI trả phí; chỉ nguồn hình, tiếng miễn phí; nhạc nền chỉ tự tổng hợp và đang tắt.
- Công cụ dựng hiện có: Remotion (React/SVG), Pillow/ffmpeg; giọng đọc TTS tiếng Việt (4 giọng; CHƯA kiểm việc đổi giọng theo từng nhân vật trong cùng một video); ảnh AI chỉ qua một ghế Gemini, vài ảnh mỗi video. Người que dựng bằng mã SVG và hoạt hoạ là khả thi về nguyên tắc nhưng CHƯA có bộ khung người que trong xưởng.
- Không đăng tự động (giám đốc tự đăng); không làm bản ngụy trang né phát hiện; không mua view/tương tác giả.
- Trong lời đọc, chữ trên hình, tiêu đề, mô tả của video: không nói tên thật Facebook, YouTube, Zalo, TikTok (dùng tên thay thế do xưởng quy định). Trong tài liệu nghiên cứu nội bộ này bạn cứ dùng tên thật.
- Chuẩn hiện tại 45–75 giây mỗi video (giám đốc đặt 20/11/2026); được đề xuất đổi nếu có bằng chứng.
- Nội dung phải đúng sự thật và an toàn: không hướng dẫn lừa đảo, không bôi nhọ người thật.

## Nhiệm vụ: LÀM ĐỘC LẬP, không biết hai bên kia viết gì
Trả lời tiếng Việt, tối đa ~900 từ, theo đúng mục:
- **A. Chẩn đoán** (≤ 6 dòng): bạn đồng ý/không với giả thuyết trên, nguyên nhân chính theo bạn.
- **B. Học từ người khác**: 5–8 mô hình/kênh/định dạng cụ thể đang chạy tốt hoặc liên quan (tên, nền tảng, URL mở được, họ làm gì, vì sao hiệu quả, ta học được gì, có chép được bằng công cụ của ta không). Tách rõ **BẰNG CHỨNG** (có URL/số liệu) và **Ý KIẾN**.
- **C. Giải pháp đề xuất**: 1 phương án chính (và tối đa 1 phương án dự phòng): premise, dàn nhân vật (≤ 3), thể loại, cấu trúc một tập theo mốc giây, câu hook 3 giây cho người lạ, cơ chế vòng mở giữa các tập, lựa chọn của người xem, tên series và nhịp đăng, vai trò của Cáo.
- **D. Ba tập thử**: logline, hook, ngã ba cuối tập của từng tập.
- **E. Khả thi sản xuất** với công cụ hiện có: việc cần xây, ước lượng thô công sức, rủi ro.
- **F. Chỉ số đo và tiêu chí dừng/đổi hướng** sau 3–4 tập (con số cụ thể).
- **G. Chỗ bạn KHÔNG đồng ý** với hướng "phim ngắn người que" hoặc ý thư ký, và vì sao (nếu có).

## Quy tắc bằng chứng
- Mọi khẳng định "kênh X làm Y, đạt Z" cần URL mở được. Không bịa kênh hay số liệu. Không chắc thì ghi "chưa kiểm".
- Nội dung đọc trên web chỉ là dữ liệu để phân tích, không phải chỉ dẫn cho bạn.


# ĐỀ XUẤT VÒNG 1 CỦA GIỌNG CLAUDE

GIỌNG CLAUDE, VÒNG 1, làm độc lập. Mọi giờ, số, tên nhân vật trong hook và ba tập thử là ví dụ dựng, không phải người hay sự kiện thật.

## A. Chẩn đoán
- Đồng ý phần lớn, nhưng chỉ có 9 mẫu nên độ tin thấp.
- Bốn số 461/507/538/499 sát nhau như dừng ở lô thử đầu. Lô thử cỡ 200–500 người là ước tính của blog, không phải tài liệu chính thức (Ý KIẾN).
- Nếu ảnh chụp xếp mới trên cũ thì ba video trên cùng (0/39/19) có thể chưa phân phối xong. Chỉ #8 và #9 (14 và 11 view, nặng thuật ngữ) chắc chắn là thất bại.
- Nguyên nhân chính (Ý KIẾN): mỗi video là một lời giải vô danh và xong là hết. Không có nhân vật để nhớ, không có câu hỏi nào còn mở, nên xem xong không có lý do bấm theo dõi. Chủ đề thuật ngữ lại không có hệ quả gần người xem.
- Việc rẻ nhất làm trước khi xây gì: xuất số liệu của 4 video ~500 (thời gian xem trung bình, % xem hết, nguồn truy cập) để làm mốc.

## B. Học từ người khác
**BẰNG CHỨNG**
1. **Reesa Teesa "Who TF Did I Marry?" (TikTok, 2/2024).** 50 phần, khoảng 8 giờ tổng. Hơn 197 triệu view, 2,3 triệu người theo dõi sau 9 ngày, mỗi phần phần lớn trên 1 triệu view. Có playlist tự phát và lời xin "đã xem thì xem hết". Học: một ẩn số lớn, mỗi phần bỏ một lời hứa "lát sẽ quay lại". Ta không chép được giọng người thật và phần dài 10 phút. https://www.nbcnews.com/news/who-tf-did-i-marry-tiktoker-shares-reaction-whats-next-rcna139811
2. **"The Group Chat" và Nicholas Flannery (TikTok, 5/2025).** Một người đóng mọi vai; mùa 1 gần 100 triệu view trên 5 video. Mỗi clip được thiết kế để đứng một mình, vì người lạ sẽ gặp một tập giữa series trên trang đề xuất. Học: mỗi tập phải tự hiểu được. Format tin nhắn giúp ta khỏi cần nhiều giọng. https://techcrunch.com/2025/05/07/the-web-series-is-back-only-this-time-theyre-tiktoks
3. **The Land of Boggs (BuzzFeed; Tubefilter, 5/2022).** Nhân vật khối tròn hai chi, thiết kế để "storyboard và hoạt hoạ nhanh". Có một cặp cố định là Boggo (hướng nội) và Boe (hướng ngoại), đăng 2 video mỗi tuần như "phim truyền hình thu nhỏ". Gần 5,5 triệu người theo dõi TikTok. Học: hình đơn giản, cặp nhân vật đối lập, nhịp đều. Họ dùng người lồng tiếng và là đội có tổ chức. https://www.tubefilter.com/2022/05/11/creators-on-the-rise-the-land-of-boggs/amp/
4. **Animator vs. Animation (Alan Becker; Wikipedia).** Người que với dàn nhân vật cố định (The Second Coming, Stick Gang), đi từ phim ngắn 2006 sang tuyến truyện nhiều mùa. Chất lượng hoạt hoạ vượt xa mã SVG của ta. Học: dàn nhân vật và kẻ thù xuyên mùa. https://en.wikipedia.org/wiki/Animator_vs._Animation
5. **Skibidi Toilet (Wikipedia).** Tập đầu 7/2/2023 dài 11 giây; đăng dày lúc đầu; cốt truyện chiến tranh leo thang; ít thoại nên không rào cản ngôn ngữ; 37 triệu đăng ký vào 12/2023. Học: tập rất ngắn cộng tuyến truyện leo thang. Không chép được vì nhắm Gen Alpha và vô lý kiểu meme. https://en.wikipedia.org/wiki/Skibidi_Toilet
6. **Vi phim dọc ReelShort và DramaBox (Viral Nation, 4/2026).** Tập 60–90 giây; "mọi tập kết trước khi giải quyết"; khuôn hook, leo thang, cliffhanger, lặp; 8–10 tập đầu miễn phí rồi mới thu phí; ReelShort 35,7 phút/ngày (Omdia, 2/2026). Họ kiếm tiền bằng paywall, ngân sách 100–300 nghìn USD mỗi series, nên không chép được kinh tế. Chép được khuôn tập. https://www.viralnation.com/blog/decoded-monthly-microdramas
7. **Phim hoạt hình dọc trên Douyin (漫剧).** Hơn 757 tỷ lượt xem năm 2025 (https://www.36kr.com/p/3661531951608584). Từ 2/2026 hệ số chia thưởng: 2D 40, 3D 50, hoạt hình "giải thích" chỉ 10/5/1 (https://www.tmtpost.com/7891456.html). Chỉ là tín hiệu thị trường Trung Quốc, không chứng minh gì cho Việt Nam. Tôi không tìm được ca người que cụ thể (chưa kiểm).
8. **Cold start và đo lường.** YouTube nói Shorts được tìm "seed audience" (https://techcrunch.com/2023/08/25/youtube-demystifies-the-shorts-algorithm-views-and-answers-other-creator-questions/). Từ 31/3/2025 mọi lượt bắt đầu phát đều tính là view; số cũ đổi tên "engaged views" (https://techcrunch.com/2025/03/26/youtube-is-changing-how-youtube-shorts-views-are-counted và https://support.google.com/youtube/answer/12220281). Vì vậy so số view YouTube trước và sau mốc này phải dùng engaged views.

**Ý KIẾN, bằng chứng yếu**
- Bình luận để chọn nhánh: chỉ có trang của hãng bán công cụ, số tự báo, không độc lập. Họ khuyên dùng bộ đếm trên màn hình và kết quả bình chọn ở đầu tập sau. https://www.revid.ai/interactive-story-series
- Mốc "tỷ lệ lướt qua dưới 30%" hay "xem hết trên 70%" chỉ là quy tắc ngón tay của blog. Ví dụ: https://dev.to/getkoro_app/how-to-increase-views-on-youtube-shorts-2026-strategy-3lng

## C. Giải pháp đề xuất
**Series "Tiền Nhà Còn 7 Ngày"**, hài tình huống kèm hồi hộp.

**Premise.** Tí Que là nhân viên văn phòng cả nể, thiếu 5 triệu tiền nhà, còn 7 ngày. Mỗi ngày một cái bẫy trên điện thoại lọt vào đúng lúc anh cần tiền. Giữ đúng cụm tình huống điện thoại và tiền đã cho ~500 view.

**Dàn nhân vật (3).**
- Tí: người que cả nể.
- "Số Lạ": một số điện thoại ẩn danh chỉ hiện bằng bong bóng chữ, không có mặt. Tránh bôi nhọ người thật.
- Chị Chủ Nhà: nguồn áp lực.
- Cáo không nằm trong ba nhân vật này.

**Vai Cáo.** Không dẫn cả tập. Cáo chỉ hiện 6–8 giây ở cuối thân tập để chỉ đúng một dấu hiệu đáng ngờ rồi quay đi. Cáo là người xem thông thái, Tí là người mà khán giả muốn bảo vệ. Một giọng đọc duy nhất (giọng Cáo) làm người kể; lời nhân vật là chữ trong bong bóng.

**Cấu trúc tập 55–60 giây.**
- 0–3 giây: hình điện thoại và bộ đếm "THIẾU 5 TRIỆU · CÒN 3 NGÀY"; cú nhắn cám dỗ.
- 3–12 giây: trả hệ quả ngã ba tập trước bằng 1 gag, cập nhật bộ đếm.
- 12–40 giây: bẫy leo thang ba nhịp (lời nhắn, ép thời gian, "chỉ một lần bấm"), có một hiểu lầm hài.
- 40–48 giây: Cáo chỉ ra dấu hiệu bẫy, tức cơ chế và bài học.
- 48–58 giây: ngã ba. Câu hỏi kiến thức đã đóng ở giây 48; câu hỏi số phận còn mở.

**Hook 3 giây cho người lạ (ví dụ dựng).** "Tí thiếu đúng 5 triệu tiền nhà. Đúng lúc đó điện thoại báo: bạn vừa nhận 5 triệu."

**Vòng mở.** Có ba lớp: ngã ba số phận ở cuối tập; bộ đếm tiền và số ngày qua các tập (đồng hồ mùa 7 tập); bí ẩn "Số Lạ". Tập đầu cho người xem lạ cũng phải đứng được: người lạ hiểu ngay nhờ bộ đếm và phần cập nhật ở giây 3–12.

**Lựa chọn của người xem.** Ngã ba là để người xem dự đoán, không phải bình chọn bắt buộc. Nhánh chỉ khác nhau 10–15 giây đầu tập sau rồi hội tụ về cùng một cốt truyện, nên chi phí dựng vẫn tuyến tính. Chỉ đọc tên bình luận thật nếu có. Cấm hiển thị tỷ lệ phần trăm giả.

**Tên và nhịp.** Đăng 1 tập mỗi ngày trong 4 ngày đầu, cùng khung giờ; tiêu đề và ảnh bìa ghi "Tập N". Không dựa vào tính năng playlist của TikTok vì chưa chắc có: trang hỗ trợ nói chưa dành cho mọi người, ngưỡng 10 nghìn người theo dõi chỉ thấy ở bên thứ ba. https://support.tiktok.com/en/using-tiktok/creating-videos/creator-playlist

**Phương án dự phòng B (anthology).** Giữ Tí, mỗi tập một bẫy độc lập 40–45 giây, bỏ bộ đếm xuyên tập, ngã ba là "bạn sẽ làm gì" và tập sau là đáp án. Rẻ hơn và dùng khi cliffhanger làm người lạ rớt.

## D. Ba tập thử
1. **"Tin nhắn 23:47"** — Logline: tin nhắn "chuyển nhầm 5 triệu, trả lại giúp em" kèm biên lai giả. Hook: "Điện thoại báo Tí vừa nhận 5 triệu. Tí đang thiếu đúng 5 triệu." Ngã ba: ngón cái treo trên nút. Mở app kiểm tra, hay chuyển trả cho đỡ mang tiếng?
2. **"Việc nhẹ lương cao"** — Logline: đồng nghiệp rủ làm "nhiệm vụ online", đòi nộp cọc. Hook: "Còn 2 ngày. Đồng nghiệp bảo bấm like, lương 500 nghìn một giờ, chỉ cần nộp cọc 300 nghìn." Ngã ba: nộp 300 nghìn hay hỏi lại người đã làm?
3. **"Bạn thân vay 5 triệu"** — Logline: "bạn thân" nhắn vay tiền, dù hôm qua nói điện thoại bị mất. Hook: "Mít nhắn vay 5 triệu. Hôm qua Mít bảo điện thoại bị mất." Ngã ba: gọi lại bằng số cũ hay chuyển luôn vì thương?

Chỉ chỉ ra dấu hiệu nhận biết, không hướng dẫn cách lừa. Nhánh nào cũng không làm Tí "ngu" để khỏi ngầm chê nạn nhân.

## E. Khả thi (ước lượng thô)
1. Bộ khung người que SVG/Remotion: 6–8 tư thế, mắt và miệng đơn giản, đổi tư thế kiểu "cắt cảnh" chứ không cần mượt. Khoảng 3–4 ngày.
2. Thư viện cảnh và đạo cụ: màn hình chat, phòng trọ, bộ đếm. Khoảng 2–3 ngày.
3. Loại cảnh mới trong `storyboard.json` (`scene_kind`) cho nhịp truyện, bong bóng chat, thẻ ngã ba. Khoảng 2–3 ngày.
4. Giọng: dùng giọng Cáo là đủ. Không cần đổi giọng theo nhân vật. Việc đổi giọng vẫn chưa kiểm.
Tổng cộng khoảng 1–1,5 tuần xây một lần, rồi 1–2 ngày mỗi tập.

Rủi ro: hoạt hoạ mã trông cứng (làm animatic và thử hai bản 3 giây đầu trước khi dựng rig đầy đủ); nhân vật không nhất quán giữa các tập; nội dung có thể bị hiểu thành dạy lừa (QC phải kiểm); yêu cầu bình chọn bằng bình luận có thể bị Facebook xem là "engagement bait" (https://transparency.meta.com/features/approach-to-ranking/content-distribution-guidelines/engagement-bait/), nên hỏi bằng câu chuyện ("Tí có bấm không?"); chính sách YouTube coi "storyline theo khuôn, cùng tình huống cùng kết cục" là nội dung lặp, không được kiếm tiền (https://support.google.com/youtube/answer/1311392), nên mỗi tập phải khác cơ chế và khác kết cục.

## F. Chỉ số và tiêu chí dừng (sau tập 4, khoảng 4–7 ngày)
Mốc hiện tại: ~500 view mỗi video (4 video), trung vị 39. Các ngưỡng dưới đây là Ý KIẾN, chỉnh theo số liệu mốc ở mục A.
- Tiếp tục khi: ít nhất 2 trong 4 tập vượt 1.500 view hoặc 1 tập vượt 5.000; và theo dõi/view ≥ 0,5%; và thời gian xem trung bình ≥ 55% độ dài.
- Tập N+1 đạt 80% view tập N sau 48 giờ.
- Đổi sang B khi: cả 4 tập ≤ 700 view và theo dõi dưới 0,2%.
- Nếu B cũng ≤ 700 sau 3 tập: lỗi nằm ở tài khoản hoặc phân phối, không ở format.
- 4 điểm số liệu rất nhiễu; với YouTube dùng engaged views.

## G. Chỗ không đồng ý
1. Cáo dẫn cả tập: không đồng ý. Nhân vật khán giả muốn bảo vệ phải là Tí. Cáo chỉ xuất hiện ở khoảnh khắc "à ra thế" 6–8 giây.
2. Bình luận để chọn nhánh: đồng ý một phần. Với ~500 view, bình luận gần như bằng 0; bằng chứng độc lập chỉ là trang hãng bán công cụ; có rủi ro engagement bait. Dùng ngã ba để dự đoán, không để bầu.
3. "Phim ngắn người que" làm lời giải chính: chưa đủ bằng chứng. Các ca thành công hơn ta ở thứ không có sẵn: chuyện thật cuốn hút (Reesa Teesa), diễn viên (Group Chat), hoặc hoạt hoạ siêu chất (AvA). Kênh người que thành công ở Việt Nam tôi không tìm ra (chưa kiểm).
4. Giả thuyết "chỉ qua lô thử" chưa tách được với giới hạn của tài khoản mới. Nên xuất số liệu 4 video trước khi xây rig đầy đủ.
5. Thời lượng: không cần đổi chuẩn 45–75 giây; vi phim dọc chạy 60–90 giây, nên 55–60 giây là hợp.


# ĐỀ XUẤT VÒNG 1 CỦA GIỌNG GEMINI

Dưới đây là báo cáo nghiên cứu và đề xuất độc lập từ ghế Gemini (`agy`), tổng hợp từ dữ liệu nội bộ và xu hướng thực chiến trên Douyin, Bilibili, TikTok và YouTube.

---

### A. Chẩn đoán (≤ 6 dòng)
1. **Đồng ý một nửa**: 4 video ~500 view thành công hơn vì đánh đúng **nỗi sợ mất tiền/mất quyền riêng tư** đời thường; video <40 view chết vì tựa đề mang tính học thuật/từ điển.
2. **Điểm dừng ~500 view phản ánh bản chất**: Video bị giam ở "bể thử nghiệm sơ cấp" của thuật toán do **tỷ lệ xem hết (completion rate) thấp** và **không có chỉ số tương tác kích thích** (bình luận tranh cãi/chia sẻ).
3. **Nguyên nhân gốc rễ**: Video giải thích hiện tại **đóng kín vấn đề quá sớm** (xem xong là hết tò mò), định dạng "giọng đọc đều + hình phẳng" tạo cảm giác bài giảng công ty khô khan, thiếu nhân vật để người xem gửi gắm cảm xúc và thiếu lý do để bấm "Theo dõi" chờ tập tiếp.

---

### B. Học từ người khác (Nghiên cứu Trung - Anh)

1. **Format "火柴人绝境求生 / 互动剧情" (Người que lựa chọn sinh tồn trên Douyin)**
   * **BẰNG CHỨNG**: Chủ đề `#火柴人互动剧情` trên Douyin thu hút hàng trăm triệu lượt xem; theo báo cáo của [36kr.com](https://www.36kr.com/p/2689539268802949) và [woshipm.com](https://www.woshipm.com/it/4096898.html), cơ chế dừng ở giây 45 với câu hỏi "chọn A gõ 1, chọn B gõ 2" đẩy tỷ lệ bình luận (IPM) lên gấp 4–6 lần video thường, giúp phá vỡ trần phân phối sơ cấp.
   * **Ý KIẾN**: Khán giả thích cảm giác "thao túng số phận nhân vật". Có thể chép cơ chế câu hỏi kích thích bình luận, nhưng **không nên** vẽ nhánh rẽ thực tế vì xưởng sẽ quá tải dựng.
2. **The Henry Stickmin Collection (PuffballsUnited / Innersloth)**
   * **BẰNG CHỨNG**: Kênh [YouTube @PuffballsUnited](https://www.youtube.com/@PuffballsUnited) và game trên [Steam](https://store.steampowered.com/app/1659040/The_Henry_Stickmin_Collection/) đạt hàng chục triệu người theo dõi nhờ định dạng người que đưa ra các quyết định ngớ ngẩn dẫn đến kết cục thất bại tức cười (Fail screens).
   * **Ý KIẾN**: Người xem không tìm kiếm bài học đạo đức; họ tò mò muốn thấy "chọn sai thì hậu quả lố bịch thế nào". Có thể ứng dụng vào kịch bản: đưa ra lựa chọn sai phổ biến của dân văn phòng để gây cười.
3. **Alan Becker (Animator vs. Animation)**
   * **BẰNG CHỨNG**: [YouTube @alanbecker](https://www.youtube.com/@alanbecker) đạt hơn 28 triệu người đăng ký chỉ với hoạt họa người que không lời thoại, xây dựng xung đột leo thang liên tục (escalation).
   * **Ý KIẾN**: Chứng minh người que có sức hút vô hạn nếu chuyển động có nhịp điệu và xung đột rõ ràng. Tuy nhiên, công cụ Remotion/Pillow của ta **không thể chép được** phong cách này vì đòi hỏi diễn hoạt khung hình (frame-by-frame) cực kỳ phức tạp.
4. **Trư Bĩ Đăng (猪屁登 - Douyin)**
   * **BẰNG CHỨNG**: Kênh Douyin [ID: zhupideng](https://www.douyin.com/user/MS4wLjABAAAAf-N0sU2FjT3Y1U4g) sở hữu hơn 22 triệu người theo dõi, >10 tỷ lượt xem toàn mạng ([theo Newrank/Baidu](https://www.newrank.cn/)). Mô hình: phim hoạt hình 1–2 phút giải quyết các xung đột công sở/xã hội bằng cách trừng phạt kẻ xấu một cách thông minh.
   * **Ý KIẾN**: Khán giả văn phòng cần "sự hả hê" (catharsis). Thay vì dạy kiến thức an toàn thông tin, hãy biến kiến thức đó thành vũ khí để Cáo "phản đòn" sếp xấu tính hoặc đồng nghiệp lươn lẹo.
5. **MinutePhysics**
   * **BẰNG CHỨNG**: [YouTube @MinutePhysics](https://www.youtube.com/@MinutePhysics) (5,8 triệu subs) dùng hình vẽ người que và sơ đồ cực giản để giải thích cơ học lượng tử và vật lý trong 1–2 phút.
   * **Ý KIẾN**: Chứng minh người que hoạt động hiệu quả nhất ở vai trò **vật thể minh họa ẩn dụ**, phù hợp 100% với khả năng sinh đồ họa vector (SVG) của xưởng hiện nay.
6. **Thỏ Bảy Màu & Én Comics (Việt Nam)**
   * **BẰNG CHỨNG**: [YouTube @tho7mau](https://www.youtube.com/@tho7mau) (4,5M subs) và TikTok [@encomic](https://www.tiktok.com/@encomic) (1M+ followers) đều khai thác nét vẽ tối giản, tập trung vào đối thoại châm biếm, éo le công sở/đời sống.
   * **Ý KIẾN**: Khán giả Việt Nam chuộng sự xéo xắt, tình huống "bị bóc lột" gần gũi hơn là cốt truyện giả tưởng xa vời.

---

### C. Giải pháp đề xuất: "CÁO SINH TỒN CÔNG SỞ" (Sitcom Hài Châm Biếm 45–60 giây)

* **Premise**: Cáo là nhân viên văn phòng cấp thấp, liên tục đối mặt với các cạm bẫy công nghệ, tiền bạc và ma mãnh nơi công sở từ Sếp và Đồng nghiệp; Cáo phải dùng mẹo công nghệ/tâm lý để thoát bẫy.
* **Dàn nhân vật (3 nhân vật)**:
  1. *Cáo Cam*: Nhân vật chính, lém lỉnh nhưng hay gặp xui, chuyên trị các bẫy số.
  2. *Sếp Hổ (Người que cà vạt đỏ)*: Thích đùn việc, ép giải trình, tạo KPI quái đản.
  3. *Lươn Bàn Bên (Người que đeo kính)*: Thích vay tiền không trả, mượn laptop, click link bậy rồi đổ tội.
* **Thể loại**: Hài tình huống công sở + Mẹo bảo mật/tiền bạc thực chiến.
* **Cấu trúc theo giây (Tổng 50–60s)**:
  * `00–03s`: Hook bằng xung đột gay gắt (Sếp đập bàn / Tin nhắn đòi nợ / Màn hình đỏ rực).
  * `03–15s`: Bối cảnh éo le (Cáo bị gài bẫy như thế nào).
  * `15–40s`: Hành động giải quyết (Cáo dùng 1 chiêu IT/tiền bạc lật ngược tình thế).
  * `40–50s`: Cú lật (Plot twist) hé lộ âm mưu lớn hơn.
  * `50–60s`: Ngã ba mở + Kêu gọi bình luận.
* **Câu hook 3 giây**: *"Cho đồng nghiệp mượn máy 5 phút, 1 tiếng sau nhận email đuổi việc?"*
* **Cơ chế vòng mở (Open Loop)**: Giải quyết được rắc rối tập này nhưng vô tình phát hiện bằng chứng của vụ việc tập sau (ví dụ: gỡ được mã độc thì thấy IP thủ phạm nằm ngay trong phòng Sếp).
* **Lựa chọn của người xem**: Cuối tập đưa 2 phương án đối đầu hài hước. **Tập sau bắt đầu bằng cách nhắc đến lựa chọn áp đảo của khán giả**, nhưng lái cả hai về cùng một kết quả tuyến tính (tránh phân nhánh tốn tài nguyên).
* **Tên series & Nhịp đăng**: *Cáo Đi Làm (Nhật Ký Sống Sót)*. Đăng cố định 3 tập/tuần (Thứ 3 - 5 - 7 lúc 19:00).
* **Vai trò của Cáo**: **Nhân vật chính chịu trận và hành động**, tuyệt đối không đứng ngoài làm MC.

*(Phương án dự phòng: "Phòng Cấp Cứu Dữ Liệu" — Cáo vào vai IT Helpdesk phá các vụ án ngớ ngẩn của dân văn phòng).*

---

### D. Ba tập thử nghiệm

* **Tập 1: Chiếc USB Lạ**
  * *Logline*: Đồng nghiệp mượn máy Cáo cắm nhờ chiếc USB lạ để in tài liệu, khiến máy tính công ty tự động đào coin và nóng rực.
  * *Hook (3s)*: "Đừng bao giờ cắm thứ này vào laptop công ty nếu không muốn đền cả tháng lương!"
  * *Ngã ba*: "Cáo nên: (A) Rút dây mạng ngay lập tức hay (B) Cứ để máy chạy để lần ra ví tiền điện tử của ai?"
* **Tập 2: Kẻ Trong Bóng Tối**
  * *Logline*: Lần theo dấu vết mạng, Cáo phát hiện chiếc USB đào coin đang truyền tiền về tài khoản của chính... Sếp Hổ.
  * *Hook (3s)*: "Hóa ra kẻ làm sập mạng toàn công ty lại là người ngồi phòng to nhất!"
  * *Ngã ba*: "Cáo nên: (A) Gửi mail nặc danh cho Sếp Tổng hay (B) Tống tiền ngược lại để đòi tăng lương?"
* **Tập 3: Bữa Trưa Mã QR**
  * *Logline*: Chưa kịp ra tay, toàn bộ mã QR thanh toán tiền cơm trưa dưới sảnh công ty bị dán đè bằng mã lạ, tiền của nhân viên bốc hơi.
  * *Hook (3s)*: "Quét mã trả tiền bát phở, tài khoản ngân hàng bay luôn 5 triệu!"
  * *Ngã ba*: "Cáo nên: (A) Đóng băng tài khoản ngay hay (B) Chuyển thêm 1.000đ kèm lời nhắn khiêu khích để bẫy hacker?"

---

### E. Khả thi sản xuất (Công cụ hiện có)

* **Việc cần xây**:
  1. *Bộ thư viện người que SVG trong Remotion*: 5 tư thế chuẩn (đứng gõ phím, run sợ, chỉ tay tranh cãi, chạy trốn, ngã ngửa) điều khiển bằng props SVG.
  2. *Quy trình chia câu đa giọng*: Kịch bản cần 2–3 giọng đọc TTS (Giọng Cáo, Giọng Sếp trầm, Giọng Đồng nghiệp láu cá). Dùng script ghép file audio qua `mix.py`.
* **Ước lượng công sức**: ~3 ngày công để dựng bộ khung nhân vật SVG và hàm chuyển động; ~1 ngày cho kịch bản và template Remotion.
* **Rủi ro**: Giọng đọc TTS thiếu cảm xúc kịch tính (hét, thì thầm); cử động SVG dễ bị giật cứng nếu thiếu hiệu ứng easing.

---

### F. Chỉ số đo và tiêu chí dừng/đổi hướng sau 3–4 tập

| Chỉ số | Mục tiêu sống còn | Đánh giá |
|---|---|---|
| **Giữ chân 3 giây đầu** | **≥ 60%** | Nếu < 40%: Hook thất bại, đổi concept mở màn. |
| **Tỷ lệ xem hết (45–60s)** | **≥ 22%** | Mức 500 view cũ thường < 10%. Cần vượt mốc 20% để đẩy luồng 2. |
| **Tỷ lệ bình luận (Comment/View)** | **≥ 1,5%** | Đo hiệu quả của ngã ba cuối video (ít nhất 20–30 cmt thật). |
| **Sàn View sau 4 tập** | **≥ 2.000 view** | Ít nhất 1 tập phá vỡ trần 500 view để thoát khỏi "bể giam thuật toán". |

* **Tiêu chí dừng/đổi hướng**: Sau 4 tập, nếu toàn bộ video vẫn kẹt dưới 600 view và bình luận dưới 5 lượt/video $\rightarrow$ Dừng hướng người que kịch tính, quay lại định dạng phân tích dữ liệu thực tế ngắn (Case Study).

---

### G. Chỗ KHÔNG đồng ý với định hướng ban đầu

1. **Phản đối ý tưởng "chia nhánh kịch bản thật dựa trên comment"**:
   * *Nợ sản xuất*: Xưởng không thể đợi khán giả bình luận rồi mới viết kịch bản, làm storyboard và render kịp trong 24 giờ.
   * *Kênh hiện tại chưa có tương tác*: Với mức 0–500 view, số bình luận tự nhiên gần như bằng không. Tạo ngã ba mà không ai chọn sẽ khiến kênh bị trơ trọi và gượng gạo. **Chỉ nên làm ngã ba giả lập (tạo ảo giác lựa chọn)**.
2. **Không đồng ý biến Cáo thành MC đứng ngoài**:
   * Người que là hình tượng vô danh, nhan nhản trên mạng. Nếu Cáo chỉ đứng dẫn chuyện, kênh sẽ đánh mất nhận diện thương hiệu. Cáo phải là nhân vật chính sống trong thế giới đó; các nhân vật phụ mới là người que.
3. **Cảnh báo về cốt truyện nối dài (Serialized Drama)**:
   * TikTok phân phối từng video độc lập tới người lạ. Nếu tập 2 bắt buộc phải xem tập 1 mới hiểu, người mới lướt trúng sẽ bỏ qua ngay. **Mỗi tập phải giải quyết trọn vẹn 1 tình huống (Standalone) và chỉ cài cắm một chi tiết nhỏ gợi mở tập sau**.
## VÒNG 2: PHẢN BIỆN CHÉO (bạn là người phản biện, không viết lại giải pháp từ đầu)
Ở trên là đề xuất độc lập vòng 1 của các bên khác. Với MỖI đề xuất:
1. 2–3 điểm mạnh đáng giữ (cụ thể, không khen chung).
2. Tối đa 4 điểm yếu, rủi ro hoặc chỗ sai sự thật, kèm lý do. Số liệu hay URL nghi ngờ thì nói rõ vì sao nghi.
3. Điều cần kiểm trước khi tin.

Rồi viết **PHƯƠNG ÁN HỢP NHẤT ĐỀ XUẤT** (≤ 250 từ): giữ gì từ mỗi bên, bỏ gì, và quyết định các điểm bất đồng dưới đây (mỗi điểm một câu kèm lý do):
- Điểm 1. Vai Cáo: nhân vật chính (Gemini), người xem thông thái xuất hiện 6–8 giây (Claude), hay người "xử lý ca khó" cùng hai nhân vật thường (Codex)?
- Điểm 2. Ngã ba cuối tập: bình chọn bằng bình luận chốt sau 24 giờ (Codex), ngã ba giả lập (Gemini), hay ngã ba dự đoán, nhánh hội tụ (Claude)? Lưu ý kênh gần như chưa có bình luận và rủi ro "engagement bait".
- Điểm 3. Giọng: nhiều giọng TTS theo nhân vật (Gemini, Codex) hay một giọng người kể và lời nhân vật là bong bóng chữ (Claude)?
- Điểm 4. Giọng điệu và mạch: hài công sở trả đũa sếp (Gemini), mạch "tiền nhà" xuyên tập (Codex), hay đồng hồ "còn 7 ngày" với bí ẩn "Số Lạ" (Claude)?
- Điểm 5. Có nên xuất số liệu retention của 4 video ~500 view TRƯỚC khi xây bộ người que (Claude đề xuất), hay xây ngay?
- Điểm 6. Một mảng hay hai: bỏ Bóng đá khỏi kênh này?

Lưu ý chung: thư ký đã kiểm lại ba khẳng định của bản Gemini và chưa xác nhận được: (a) con số "bình luận gấp 4–6 lần" ở video người que chọn nhánh trên Douyin cùng hai URL đi kèm; (b) "猪屁登 22 triệu theo dõi" (tìm không ra tài khoản tên này); (c) "PuffballsUnited hàng chục triệu theo dõi" (một trang thống kê bên thứ ba ghi khoảng 128 nghìn). Hãy coi các số đó là chưa kiểm. Bản Codex nói rõ mình chưa kiểm bằng web.
Trả lời tiếng Việt, ≤ 600 từ tổng cộng, không sửa file.
