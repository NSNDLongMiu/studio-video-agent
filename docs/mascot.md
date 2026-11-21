# Kênh "Cáo văn phòng" — linh vật dẫn truyện

> **Bản dùng cho sản xuất — đã tạo lại bằng imagegen (17/11/2026):** [mục lục 12 chuyển động](../brand/cao/production-pack/index.html) · [hướng dẫn dựng và ghép](../brand/cao/production-pack/README.md). Có 96 file PNG chuẩn hoá (88 hình độc lập), MOV alpha và MP4 xem thử, đã kiểm trên nền sáng/tối. Mã gồm `wave`, `chair_spin`, `stand_up`, `sit_down`, `walk`, `idle_blink`, `point_present`, `bow`, `nod`, `turn`, `arms_up`, `desk_typing`. Dựng bằng `node tools/fox/animate.mjs --id <mã> --duration <giây> --out <video>/assets/cao.mov`; PNG 512×512, chiều cao nhân vật gốc 373–473px, 4–8 fps nguồn. **Mã animation mới không phải tên pose Remotion.** Dùng lớp MOV ở bước ghép cảnh; xem hướng dẫn về đạo cụ, lặp/giữ cuối và giới hạn renderer. Pack cũ bên dưới là kho nguồn đối soát.

> **Bổ sung bộ Cáo Mít từ giám đốc (17/11/2026):** đã nhập và lập [mục lục ảnh có bộ lọc](../brand/cao/animation-pack/index.html), [hướng dẫn sử dụng](../brand/cao/animation-pack/README.md) và [manifest](../brand/cao/animation-pack/manifest.json). Thực tế có **458 file frame, 457 đọc được**, chia 7 nhóm; nhiều ô cắt lệch/còn nền, chưa phải animation liền mạch. Bộ mới ở trạng thái **cần kiểm tra hình ảnh**, tra cứu/xuất lớp ảnh tĩnh bằng `node tools/fox/pack-still.mjs`; chưa ánh xạ mã mới vào Remotion hay `narrate.mjs`. Đã đối chiếu pixel với artwork cũ và gắn **15 tên pose thay thế** của nhóm 05 vào mục lục để đội sản xuất dùng bản đã tách sẵn. Xem hướng dẫn và lỗi thật trước khi chọn. Bộ 46 pose bên dưới tiếp tục dùng theo cơ chế hiện tại.

> **Đã chốt (giám đốc):** tên kênh **Cáo văn phòng**, linh vật là **cáo cam công sở** (ảnh nguồn do giám đốc cung cấp ở `assets/mascot/`). Linh vật **Chíp** (bản vẽ SVG trước đó) **đã ngừng dùng**; mã và ảnh của Chíp vẫn còn ở `tools/mascot/` và `brand/mascot/` và có thể xoá.

## Nhận diện (lấy từ ảnh nguồn, không đổi giữa các video)
- Cáo cam lông mềm kiểu 3D hoạt hình, đuôi to có chóp trắng.
- Kính tròn gọng đen, áo sơ mi trắng, cà vạt xanh navy, thẻ nhân viên, đồng hồ, quần tây đen, giày da đen.
- Đạo cụ có trong bộ ảnh: laptop (logo khiên cam), bảng biểu đồ, micro MC, kẹp tài liệu, bàn làm việc, tai nghe.
- **Văn phong (đã chốt):** trẻ trung, câu chữ văn phòng. Quy tắc ở mục "Văn phong của Cáo" bên dưới. **Mở đầu — đã chốt 18/11/2026 (thay quyết định 17/11):** không có câu chào cố định; mỗi video vào thẳng vấn đề bằng hook theo chủ đề, kích thích người xem (mục "Mở đầu: vào thẳng vấn đề" bên dưới).
- **Trang phục (18/11/2026):** tạm dùng chung bộ đồ công sở cho mọi video; sau này đổi theo cụm chủ đề (ví dụ sa mạc → đồ sa mạc) do agent hoạ sĩ linh vật lo (`docs/viec-cho-agent.md` T1). Khi đó phần quần áo ở danh sách trên không còn bất biến; mặt, lông, kính, đuôi vẫn giữ.

## Văn phong của Cáo (đã chốt: trẻ trung, câu chữ văn phòng)
**Quy tắc cho planner/producer** (đề xuất cách áp dụng, giám đốc chỉnh nếu thấy chưa hợp):
1. **Xưng hô:** Cáo xưng "Cáo" hoặc "mình"; gọi người xem là "bạn" hoặc "đồng nghiệp ơi". Không dùng "em/anh/chị" để khỏi vướng tuổi.
2. **Câu ngắn:** tối đa khoảng 12 từ, một ý mỗi câu, hook trong 2 giây đầu (cũng dễ cho giọng đọc và phụ đề).
3. **Chữ văn phòng vừa đủ:** mỗi câu 1–2 từ như họp, note lại, task, deadline, báo cáo, sếp, KPI, tăng ca, tan ca, chốt, feedback, check mail, slide. Đừng nhồi; luôn giải thích từ chuyên ngành.
4. **Trẻ trung nhưng sạch:** lóng nhẹ như "xịn", "ngon", "ổn áp", "chill", "căng". Không chửi, không cà khịa hay chê người xem, không mỉa mai nghề nghiệp/đối tượng nào. Hài tự giễu kiểu dân văn phòng ("deadline dí") là được.
5. **Viết cho giọng đọc AI:** số quan trọng viết bằng chữ ở lời đọc; từ viết tắt/từ mượn ghi cách đọc trong `script.md` (vd KPI → "ca-pi-ai", deadline → "đét-lai") rồi **nghe thử lại** (xem `docs/voice.md`).
6. **Trung thực:** thông tin/số liệu phải có nguồn; hài hước không được bóp méo sự thật.

### Mở đầu: vào thẳng vấn đề (đã chốt 18/11/2026)
**Không có câu chào cố định.** Không mở bằng "Chào các bạn", "Cáo đây". Câu đầu tiên **kích thích người xem và nói thẳng vào chủ đề** của video đó; hook do planner nghĩ riêng cho từng video, bám chủ đề. Ví dụ giám đốc nêu:
- Chủ đề "xem máy mình dùng CPU gì" → mở bằng: *"Bạn có tò mò game A đang lấy tài nguyên máy bạn ra sao không?"* rồi vào bài luôn.
- Chủ đề tin công nghệ → mở bằng: *"Có một AI mới khiến cộng đồng GitHub chao đảo…"* rồi vào bài.

| Kiểu hook | Hợp khi |
|---|---|
| Câu hỏi gây tò mò, kéo người xem vào cuộc | giải thích, "máy bạn đang làm gì" |
| Tin nóng / sự kiện đang gây chú ý | tin công nghệ, xu hướng |
| Con số hoặc sự thật bất ngờ | chủ đề có số liệu |
| "Ai cũng tưởng… nhưng…" | sửa hiểu lầm |

**Đề xuất cách áp dụng** (giám đốc chỉnh nếu chưa hợp): (1) hook trong 2 giây đầu, câu ngắn; (2) hook phải được **trả lời thật trong video** và đúng sự thật — kích thích nhưng không giật tít sai (luật "Trung thực" ở trên và chính sách nền tảng); (3) thương hiệu thể hiện bằng hình Cáo và nhãn kênh, không cần đọc thành câu chào; (4) lời chuyển ý, chốt, kêu gọi cũng tự do theo chủ đề, ngắn, không bắt buộc công thức; (5) ghi hook đã dùng của từng video vào `concept.md` để sau này xem kiểu nào giữ chân tốt.

### Bộ câu chào cũ — chỉ để tham khảo lời chuyển ý / chốt / kêu gọi, KHÔNG dùng làm câu mở đầu
| Bộ | Mở đầu | Chuyển ý | Chốt | Kêu gọi |
|---|---|---|---|---|
| **A. Họp nhanh** *(đề xuất: ngắn, hook mạnh, hợp video 15–45 giây)* | "Alo alo! Cáo văn phòng đây, họp nhanh 30 giây thôi nhé!" | "Mục tiếp theo, bạn note lại ngay!" | "Chốt đơn! Hẹn bạn buổi họp sau nhé!" | "Thả tim cho Cáo, coi như duyệt báo cáo nha!" |
| **B. Đi làm** | "Chào đồng nghiệp! Cáo đây, vào ca thôi nào!" | "Task tiếp theo, nhanh gọn nè!" | "Xong việc, tan ca! Mai Cáo lại ở đây nhé." | "Theo dõi Cáo để không lỡ buổi họp nào nha!" |
| **C. Báo cáo sếp** | "Báo cáo sếp! Cáo văn phòng có tin ngon đây!" | "Slide tiếp theo, bạn xem nhé!" | "Báo cáo xong, xin phép tan ca ạ!" | "Bấm theo dõi để Cáo được tăng lương nha!" |
| **D. Check-in** | "Check-in nào! Cáo văn phòng online rồi đây!" | "Next slide, đi tiếp thôi!" | "Check-out! Hẹn bạn ca sau nhé!" | "Bấm theo dõi để chấm công cho Cáo nha!" |

**Câu theo tình huống** (dùng chung cho mọi video; cột phải là dáng gợi ý):
| Tình huống | Câu mẫu | Dáng |
|---|---|---|
| Mẹo hay | "Mẹo nhỏ cho dân văn phòng nè!" | `idea` |
| Bất ngờ | "Khoan! Số liệu này sếp mà thấy là mê luôn." | `surprised` |
| Đặt câu hỏi | "Bạn đoán xem?" | `think` |
| Có biểu đồ/số | "Nhìn biểu đồ này nè, tăng thấy rõ luôn!" | `board_chart` |
| Kết quả tốt | "Ngon! Hoàn thành chỉ tiêu rồi!" | `cheer` |
| Sai lầm | "Ối, ai cũng từng gặp. Cáo xin lỗi trước nhé!" | `bow` |
| Nhắc lưu video | "Lưu lại kẻo quên nha!" | `thumbs_up` |
**Đã chốt (18/11/2026):** mở đầu theo hook chủ đề (xem trên), không còn bộ câu chào mặc định; ghi hook đã dùng của từng video vào `concept.md` để dễ theo dõi.

## Bộ tài sản (`brand/cao/`, tạo bằng `tools/fox/`)
Xem toàn bộ có tên: **`brand/cao/catalog.png`**.

| Thư mục | Nội dung | Ghi chú |
|---|---|---|
| `poses/` | **46 dáng cả người**, nền trong suốt | `present_open` `present_hand` `point_left` `point_right` `point_up` `point_down` `wave` `welcome` `arms_crossed` `think` `idea` `thumbs_up` `shrug` `surprised` `stop` `bow` `cheer` `cheer_jump` `cheer_seated` `love` `sleep` `mic` `read_paper` `clipboard` `board_chart` `laptop_hold` `laptop_typing` `desk_typing` `desk_headset` `desk_video`. Cùng một dáng có thêm bản `_2`, `_3` (từ tờ khác) |
| `faces/` | 10 đầu biểu cảm | `face_happy` `face_laugh` `face_content` `face_neutral` `face_surprised` `face_gasp` `face_worried` `face_angry` `face_sad` `face_cry` |
| `mouths/` | 12 hình miệng cận cảnh | **Chưa dùng được** để khớp miệng (xem Giới hạn) |
| `motion/` | 8 chuỗi × 6 khung (vẫy, chỉ, gật, cúi, quay, giơ tay, nhấn mạnh, giới thiệu) | **Độ phân giải thấp (~120px cao)**, chỉ để tham khảo |
| `_raw/`, `_index/` | ảnh tách thô + tờ đánh số | tra cứu nguồn gốc |

Quy trình tạo (chạy lại khi giám đốc đổi/bổ sung ảnh trong `assets/mascot/`; **không sửa file trong `assets/`**):
```
python -X utf8 tools/fox/extract.py   # tách 116 sticker, bỏ quầng bán trong suốt (defringe)
python -X utf8 tools/fox/build.py     # đặt tên theo tools/fox/names.json, xuất brand/cao + catalog.png
```
Đổi tên dáng: sửa `tools/fox/names.json` rồi chạy lại `build.py`.

## Cho Cáo dẫn truyện trong video
```
# Có file giọng đọc + mốc dáng theo kịch bản
node tools/fox/narrate.mjs --audio vo.wav --timeline timeline.json --out <video>/assets/cao.mov

# Chưa có giọng đọc: dùng phụ đề (cáo vẫn nhún theo nhịp câu)
node tools/fox/narrate.mjs --srt <video>/final/captions.srt --intro --out <video>/assets/cao.mov

# Ghép lên nền để xem thử nhanh (1 dáng cố định)
node tools/fox/narrate.mjs --audio vo.wav --pose think --bg 0x1b2a49 --out thu.mp4
```
`timeline.json`: `[{"t":0,"pose":"wave"},{"t":3.2,"pose":"think"},{"t":7,"pose":"thumbs_up"}]` (`t` tính bằng giây). Không có timeline thì tự vòng các dáng mỗi ~3,2 giây khi đang nói; `--intro` vẫy tay 1,6 giây đầu.
Tuỳ chọn: `--poses a,b,c` (vòng dáng riêng), `--height <px>`, `--bottom <px>`, `--pos center|left|right`, `--fps 30`, `--duration <giây>` (khi chỉ có `--srt`). Chọn cỡ và vị trí theo cảnh bên dưới.
Kết quả là **lớp `.mov` trong suốt** cùng thời lượng với giọng/phụ đề. Cáo tự: đổi dáng theo mốc, **nảy nhẹ** khi đổi dáng, **nhún theo độ lớn tiếng**, thở nhẹ. Dựng 10 giây clip mất khoảng 20 giây.

**Ghép:** xem cách tạo lớp trong `.agents/skills/video-producer/references/ffmpeg-recipes.md` §8. Chỉ ghép Cáo ở các mốc đã chọn theo Y2, đặt trong vùng an toàn và giữ phụ đề ở dải dưới y≈1340–1500 (lớp riêng) và đặt Cáo phía trên dải đó, đáy Cáo ≲ y 1290, khe ≥ 50 px; không dời phụ đề lên trên đầu Cáo. Kiểm khung thật để tránh che chữ hoặc minh hoạ.

## Giới hạn đã biết (đã đo, không phải ước đoán)
1. **Không nhép miệng:** các sticker chỉ có hình miệng cận cảnh tách rời, không ghép lên đầu từng dáng được. Cáo chỉ nhún theo tiếng. Muốn nhép miệng thật cần thêm bộ đầu/miệng cùng góc nhìn hoặc rig riêng.
2. **Độ phân giải thấp:** sticker cao khoảng 330px (trung vị), khi dựng ở 720–760px bị phóng khoảng 2,2 lần nên hơi mềm. **Nên xin bản gốc cao hơn (≥ 1000px cao)** nếu có; thay file trong `assets/mascot/` rồi chạy lại 2 lệnh trên.
3. Mỗi dáng là ảnh tĩnh: chuyển dáng là "cắt" (có hiệu ứng nảy che bớt), không phải chuyển động mượt. Chưa dùng được `motion/` vì khung nhỏ và tư thế giữa các khung không khớp nhau.
4. **Nguồn ảnh:** giám đốc xác nhận thiết kế Cáo được tạo bằng Codex và cho phép sửa/tạo thêm. Các atlas chuyển động mới được tạo bằng imagegen tích hợp, có prompt và nguồn tham chiếu tại `brand/cao/production-pack/generated/`. Tiếp tục gắn nhãn AI cho video.

## Quy tắc dùng trong video
1. **Kích thước và vị trí (Y3):** khi cùng minh hoạ, Cáo rộng khoảng 10–18% khung (108–194 px ở 1080 px; giảm từ T9, trước đó 15–25%). *Quy đổi để đặt `--height` cho `narrate.mjs`: sticker có rộng/cao ≈ 0,62–0,83 (vd `think` 205×331, `point_right` 279×338) nên chiều cao ≈ 200–430 px tuỳ dáng; hãy đo theo từng dáng trên ảnh thật.* Đổi cỡ/vị trí theo cảnh, chừa trọn chi tiết chính. Khi Cáo làm chủ cảnh mở/kết, có thể lớn hơn nhưng chỉ phóng đến khoảng 1,5 lần kích thước nguồn (sticker cũ cao khoảng 330 px).
2. **Xuất hiện (Y2):** có Cáo ở ba nhóm mở/giữa/kết, gián đoạn. Mở dẫn tình huống trong 2 giây đầu, giữa chỉ ở nhịp cần giải thích/nhấn/chuyển ý, kết tổng kết và chào kết; dành cảnh kỹ thuật sâu cho minh hoạ. Từ T9 giữa chỉ ở vài nhịp chuyển ý (không bắt buộc) và tổng thời gian có Cáo khoảng 25% trở xuống là ngưỡng thử (trước đó 40%), giám đốc có thể chỉnh. Khi xuất hiện, Cáo phản ứng với vật đang đổi theo R6; đổi dáng cách nhau ≥ 2 giây.
3. **Dáng khớp nội dung** (cột **Cáo** trong `script.md`): bất ngờ → `surprised`; câu hỏi → `think`; mẹo hay → `idea`; số liệu/biểu đồ → `board_chart`; kết quả tốt → `cheer`/`thumbs_up`; sai lầm → `bow` (xin lỗi) hoặc `stop`; mở đầu → `wave`/`welcome`; kết → `thumbs_up`/`love`.
4. **Giọng đọc và nhãn AI:** giám đốc đã chốt **luôn gắn nhãn AI** cho mọi video (hình Cáo và giọng đọc đều do AI). Giọng tiếng Việt: cần 1 giọng Bắc + 1 giọng Nam, đề xuất ở `docs/voice.md`. Chưa có giọng thì dùng chế độ `--srt` và phụ đề.
5. **Trung thực:** Cáo chỉ nói điều có trong kịch bản đã kiểm chứng nguồn.
