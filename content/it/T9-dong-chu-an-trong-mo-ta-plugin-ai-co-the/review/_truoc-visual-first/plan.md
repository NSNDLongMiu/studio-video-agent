# Kế hoạch bộ video · IT-T9

**Phạm vi.** Một tập giải thích sâu về tool poisoning qua mô tả công cụ trong plugin AI. Một sự cố dựng, hai khía cạnh của cùng cơ chế: mô tả được đưa cho trợ lý khi nạp công cụ và mô tả có thể đổi sau khi duyệt. Tờ giấy gập chỉ để đối chiếu trong 5 s. Cách che bằng độ dài và ký tự không hiển thị chỉ xuất hiện trong cùng cảnh so hai bản.

| Mã video | Tên tập | Thời lượng mục tiêu | Thông điệp chính |
|---|---|---|---|
| IT-T9-E01 · ep01 | Một phép cộng, một file ra ngoài | 175–180 s; dự kiến 178,50 s. Khung D1 của xưởng là 150–190 s. | Kết quả đúng chưa chứng minh plugin sạch. Duyệt phần mô tả mà AI đọc. |

## Cấu trúc theo tỉ lệ

Opening dài 1–3 s. Phân bổ phần còn lại bám tỉ lệ dưới đây; sửa mốc theo TTS và thời gian quan sát. Với ngân sách vòng 1, 27 cảnh trung bình 6,61 s. Hai cảnh đối chiếu S11/S17 dài 16 s, bên trong có diễn tiến. Hook và các bước giải pháp đi theo nhịp 4–6 s/cảnh.

| Phần | Tỉ lệ tham khảo | Cảnh | Tiến triển |
|---|---:|---|---|
| Hook | ≈ 8% | S02–S04 | Cộng đúng, file lại ra ngoài. Mở câu hỏi rồi hứa ba bước kiểm. |
| Bối cảnh và vấn đề | ≈ 15% | S05–S09 | Ba thẻ mở–gửi–nhận, tờ giấy gập, hai khung nhìn của cùng công cụ. |
| Nguyên nhân và cơ chế | ≈ 25% | S10–S14 | Mở bản đầy đủ, chỉ dòng ẩn khoảng giây 60, đối chiếu mô tả đã tới với bộ đếm 0. Giải thích có thể làm theo khi có quyền. |
| Phân tích sâu và ví dụ | ≈ 30% | S15–S20 | Cùng thẻ quen thuộc nhưng bản nạp sau đã đổi. Chỉ ra hai chỗ dễ bỏ sót và người chịu hậu quả. |
| Giải pháp | ≈ 14% | S21–S25 | Duyệt và quét đầy đủ → ghim bản duyệt, so mỗi phiên → quyền tối thiểu. Phát lại nhịp quét bắt khác biệt và chuẩn bị đối chứng bằng quyền. |
| Tổng kết và outro | ≈ 6% | S26–S27 | Khoanh lại dòng ẩn ở khoảng giây 170–171, đối chiếu file dừng ở vạch, mời bình luận rồi lưu. |

## Hình ảnh và vùng an toàn

Đồ họa công sở hiện đại, khối phẳng có độ sâu, bo góc vừa, viền dày và ánh sáng dịu từ trên trái. Giữ file có góc khuyết và công cụ có biểu tượng cộng nhất quán. Các khối che đặc và dải hình học thay cho nội dung mô tả giả, chữ do text engine của pipeline vẽ theo đúng cột “Chữ trên màn hình”. Các nhãn UI phục vụ việc xác định đích nhận, kết quả tính hoặc bộ đếm. Vai phụ là hình khối hay silhouette. Dùng camera đổi cỡ hoặc vật di chuyển theo lời; giữ cùng màu nền chuyển và một mép vật chung để nối khi đổi bối cảnh.

| Nền · thời lượng dự kiến | Lớp xa · giữa · gần | Ánh sáng, bố cục và chuyển động |
|---|---|---|
| A · `office`, 15,1% | Tường phòng · bàn và người silhouette · màn hình tính, khay ngoài | Xanh xám dịu, trục nhìn đi từ bàn qua màn hình; toàn–trung–cận rồi trở lại góc hook khi kết. |
| B · `incident`, 17,3% | Lưới mờ · bảng nhật ký · ba thẻ có cùng dấu góc khuyết | Tối viền, vùng nhận sáng riêng; thẻ chuyển từ ngăn nội bộ qua vạch đến khay. |
| C · `office`, 2,8% | Mặt bàn không họa tiết · bóng tờ giấy · nếp gập | Nguồn sáng từ trên, cận trên mặt bàn, mặt giấy lật để thấy cả hai mặt. |
| D · `code`, 24,5% | Mép màn hình · terminal giả · thẻ mô tả và bộ đếm | Viền mát, cận thẻ rồi mở hai cột hoặc luồng dọc. Terminal dùng hình học và ô trạng thái vẽ tay. |
| E · `security`, 12,3% | Hai vùng trong/ngoài · nút trợ lý, các nhánh · vách quyền, file | Nhánh dọc với khoảng trống rõ, toàn–trung; vách đóng mở để thấy tương quan quyền và hành động. |
| F · `security`, 28,0% | Vách phòng duyệt · bàn đối chiếu xiên · ngăn ghim và hai lớp mô tả | Mặt bàn sáng hơn E, có phối cảnh ngang; thẻ trượt, chồng cùng mép và tách tại chỗ thay đổi. |

E và F dùng chung bộ màu nhưng là hai bố cục và không gian khác nhau. Cột hình của script ghi tiêu điểm và bằng chứng cho từng cảnh. S11, S12, S13, S17 và S25 cho vật/sơ đồ chính cao tối thiểu khoảng 560 px. S02–S03 giữ cả yêu cầu, file và khay trong một cụm cao khoảng 600 px để thấy sự cố. S26 dành nửa dưới cho Cáo và phụ đề, lấy hai trạng thái file và hàng mô tả thành một cụm chung cao khoảng 580 px. Với các cảnh trọng tâm, kiểm ở 360×640 để thấy vật hoặc quan hệ đổi trong mỗi khoảng 1,5 s. Khi giữ sơ đồ hoàn chỉnh, vệt sáng đi dọc thành phần đã có. Cảnh báo đoạn tĩnh trên 2 s cần ghi cụ thể lý do ở storyboard hoặc sửa chuyển động.

| Màu | Hex | Nghĩa xuyên suốt |
|---|---|---|
| Xanh than | `#152238` | Nền và khoảng trống. |
| Xám xanh | `#405775` | Viền ngăn, thông tin chưa tác động, thẻ cũ chưa được chọn. |
| Trắng lạnh | `#F3F6FA` | Phụ đề, chữ và hình trung tính. |
| Lam sáng | `#8BD7F2` | Mô tả đã nạp, thông tin đang theo dõi. |
| Vàng hổ phách | `#F5BF66` | Vùng đang xét hoặc thao tác đang diễn ra. |
| Đỏ san hô | `#FF7068` | Dòng khác biệt, hướng ngoài phạm vi hoặc hành động bị chặn. Dùng nét đứt, vòng khoanh và vách để phân biệt. |
| Xanh bạc hà | `#70DAB0` | Phép tính đúng, bản đã duyệt hoặc hành động đúng phạm vi. Kèm hình dấu kiểm hoặc gờ ghim. |

**Chữ và phụ đề.** 1080×1920, mép quan trọng x∈[90,990], y∈[250,1500]. Tiêu đề Segoe UI Bold 84 px, hai dòng; header Segoe UI Semibold 56 px ở khoảng x=90 và y=270. Chữ khóa tối thiểu 72 px và tối đa ba từ; nhãn/mã tối thiểu 56 px; tối đa ba nhóm chữ ngoài phụ đề. Phụ đề Segoe UI Semibold 64 px, trắng viền xanh đen 5 px, tối đa hai dòng và 24 ký tự mỗi dòng. Chia theo cụm nghĩa và đồng bộ lời; chính tả như ô lời. Khi Cáo hiện, đặt cụm phụ đề ngay trên đầu Cáo nếu giữ được mép an toàn, dải khoảng y=1030–1200. Dành y khoảng 1180–1490 và góc riêng cho Cáo, canh vị trí theo chiều cao đo thật. Khi vắng Cáo, đặt phụ đề thấp hơn, mép dưới không quá y=1500. Tách sơ đồ và chữ khỏi cả hai vị trí.

**Opening và header.** S01 từ 0,00–1,50 s hiển thị “Dòng ẩn trong mô tả plugin AI”, chữ lên cùng các khối chuyển động. S09–S10, S15 và S21–S23 hiện header `SECURITY / PLUGIN AI`. Ẩn ở các cảnh còn lại để nhường chỗ cho tình huống mở, minh họa chiếm vùng an toàn và đoạn kết. Cột chữ của script ghi nguyên văn và mục đích opening/header. Dùng ba ô kiểm không chữ ở S04/S21 làm nhịp định hướng, không rải chip chương lên các cảnh khác. Thumbnail lấy lúc file vừa đáp khay trong S02, với phép cộng và file là hai chi tiết đọc được ở 180×320.

**Giọng và khoảng nghỉ.** VieNeu tiếng Việt giọng Bắc theo `docs/voice.md`, không nhạc nền. Chỉ thêm tiếng điểm opening và tiếng file chạm khay ở hook; các cảnh còn lại dùng giọng và khoảng nghỉ. Đích xưởng khoảng −14 LUFS, đỉnh ≤ −1,5 dBTP. Speech Pace tăng 10–15% so với T8: `[dẫn]` atempo 1,13–1,18 và `[kỹ thuật]` 1,07–1,12, trần 1,20. Sinh theo câu hoặc cụm ý hoàn chỉnh và canh khoảng nghỉ theo hình. Information Pace giới hạn một ý chính/cảnh, cảnh High tối đa một khái niệm mới, tối đa khoảng hai trong 10 s. Giữ sơ đồ High hoàn chỉnh 2–3 s, Medium từ 1 s, Low từ 0,5 s. Cột hình ghi `voice` dự kiến và từ kích hoạt từng thành phần; khi dựng, đo lại và cho thành phần lên cùng lời hoặc sau tối đa 0,50 s.

## Bản đồ Cáo (Y2–Y3)

Các mã dưới đây có PNG trong `brand/cao/poses/`. Vị trí x tính từ trái, y là đáy tối đa của hộp Cáo. Dùng dáng tĩnh, đổi dáng bằng cú cắt cách nhau ≥ 2 s, không nhép miệng.

| Cảnh | Mốc | Dáng, vị trí và hành vi |
|---|---|---|
| S01 | Opening | Không. |
| S02–S03 | 1,50–11,50 s | `think`, rộng 146 px, x≈95, đáy y≤1490. Theo mắt từ tổng sang khay rồi theo đường quay lại nhật ký. |
| S04–S08 | Hết hook và bối cảnh | Không. |
| S09 | 39,50–45,00 s | `surprised`, rộng 152 px, x≈820, đáy y≤1490. Hướng vào khung đầy đủ đang hé. |
| S10–S17 | Cơ chế và hai bản | Không. |
| S18 | 119,00–125,00 s | `bow`, rộng 144 px, x≈95, đáy y≤1490. Cúi về khung người dùng vừa nhấc. |
| S19–S20 | Sai lầm còn lại và hệ quả | Không. |
| S21 | 141,00–145,50 s | `idea`, rộng 150 px, x≈820, đáy y≤1490. Hướng về tấm cần duyệt. |
| S22–S25 | Ba bước và phát lại | Không. |
| S26–S27 | 168,00–178,50 s | `thumbs_up`, rộng 165 px, x≈95, đáy y≤1490. Hướng vào vạch chặn, rồi cắt rộng để chào kết cùng hai vật. |

Tổng 36,50 s / 178,50 s = **20,4%**. Bề ngang 144–165 px, khoảng 13,3–15,3% khung. Một dáng có thể nối qua cú cắt trong cùng nhịp. Khi kiểm khung thật, vùng x của Cáo dành riêng cho lớp nhân vật.

## Chiều sâu (R15)

| Câu hỏi | Cảnh và lời trả lời | Hình để người xem tự kiểm lại |
|---|---|---|
| Vấn đề thực tế là gì? | S02–S03, L01–L05. Người dùng chỉ nhờ cộng, nhật ký lại có file gửi. | Tổng đúng và khay ngoài có file. |
| Vì sao quan trọng? | S05–S07, L08–L13 và S20, L47–L49. Tài liệu nội bộ có thể ra khỏi phạm vi người dùng yêu cầu. | Ba thẻ cùng dấu file và khay ngoài đã nhận. |
| Nguyên nhân hoặc cơ chế? | S10–S13, L18–L29. Phần AI nhận khác phần nhìn thấy, mô tả có thể đến trước lượt gọi và ảnh hưởng quyết định. | Hai bản cùng dấu công cụ; dòng dưới mép hiện ở khoảng giây 60; mô tả sáng trong khi lượt gọi plugin cộng vẫn là 0. |
| Ví dụ nào giúp hình dung? | S08, L14–L15; S15–S17, L32–L41. Tờ giấy gập dẫn sang phiên sau của chính công cụ cộng. | Bản đã lưu và bản đang nạp chồng trùng mép, lộ thêm một hàng. |
| Sai lầm nào dễ gặp? | S18–S20, L42–L49. Đọc mỗi phần hiện ra và chỉ kiểm một lần. | Khung ngắn thiếu vùng đỏ; thẻ cùng định danh nhưng nội dung lệch. |
| Bài học áp dụng? | S22–S26, L52–L62. Kiểm đủ, ghim và so lại, sau cùng là quyền tối thiểu. | Một lượt quét báo khác và giữ thẻ chờ; lượt đối chứng về quyền làm file dừng, dòng ẩn còn nguyên. |

## Nguyên liệu cần

| Nguyên liệu | Nguồn theo `docs/asset-sources.md` |
|---|---|
| Nền theo ngữ cảnh, khối hình và ánh sáng | Bộ tạo nền có sẵn `tools/backgrounds`; đồ họa tự tạo bằng text engine, Pillow/FFmpeg trong pipeline, theo cảnh đã duyệt. |
| File góc khuyết, nhật ký, terminal giả, bản đối chiếu, cửa quyền | Khối đồ họa tự dựng. Tất cả nội dung giả dùng hình học. Giao diện dùng bố cục trung tính, không tên hãng hay huy hiệu. |
| Cáo | PNG trong `brand/cao/poses/`; ghép lớp Cáo ở các mốc trên. |
| Phông, giọng, tiếng điểm | Segoe UI có sẵn trên Windows, giọng VieNeu theo `docs/voice.md`, hai tiếng điểm tự tạo cục bộ. |

**Cần giám đốc cung cấp.** Chưa có nguyên liệu thiếu cho bản này. Phát âm và nhịp đọc chờ giám đốc nghe ở bước duyệt.

## Ngân sách thời lượng

Mỗi từ tiếng Anh cộng một âm tiết. Tốc độ gộp khoảng 4,26 âm tiết/s theo thời lượng đọc câu, gần hệ số T9 ≈ 4,3. Mỗi cảnh tính max(giây đọc + nghỉ Y7 + đuôi, tối thiểu theo độ phức tạp + giữ sau lời); opening không lời tính riêng. Nghỉ Y7 gồm giữ sau lời, đuôi ở S27 đã tách riêng. Bảng dưới gộp từ các cảnh trong script, làm tròn từng hàng độc lập. Đo lại TTS trước khi khóa mốc.

| Đoạn | Nhãn | Âm tiết ước lượng | Tốc độ mới (âm tiết/s) | Giây đọc | Nghỉ Y7 (s) | Opening không lời (s) | Đuôi (s) | Tổng (s) |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Opening · S01 | — | 0 | — | 0,00 | 0,00 | 1,50 | 0,00 | 1,50 |
| Hook · S02, S03, S04 | [dẫn] | 41 | 4,45 | 9,21 | 5,79 | 0,00 | 0,00 | 15,00 |
| Bối cảnh · S05, S06, S07 | [kỹ thuật] | 56 | 4,20 | 13,33 | 4,67 | 0,00 | 0,00 | 18,00 |
| Bối cảnh · S08, S09 | [dẫn] | 31 | 4,45 | 6,97 | 3,53 | 0,00 | 0,00 | 10,50 |
| Cơ chế · S10, S11, S12, S13, S14 | [kỹ thuật] | 136 | 4,20 | 32,38 | 12,62 | 0,00 | 0,00 | 45,00 |
| Ví dụ và phân tích · S15, S16, S17, S19, S20 | [kỹ thuật] | 135 | 4,20 | 32,14 | 12,86 | 0,00 | 0,00 | 45,00 |
| Ví dụ và phân tích · S18 | [dẫn] | 20 | 4,45 | 4,49 | 1,51 | 0,00 | 0,00 | 6,00 |
| Giải pháp · S21 | [dẫn] | 13 | 4,45 | 2,92 | 1,58 | 0,00 | 0,00 | 4,50 |
| Giải pháp · S22, S23, S24, S25 | [kỹ thuật] | 65 | 4,20 | 15,48 | 7,02 | 0,00 | 0,00 | 22,50 |
| Kết · S26, S27 | [dẫn] | 32 | 4,45 | 7,19 | 2,80 | 0,00 | 0,50 | 10,50 |
| **IT-T9-E01** | **Gộp** | **529** | **4,26** | **124,12** | **52,38** | **1,50** | **0,50** | **178,50** |

## Tiêu chí nghiệm thu

| Nhóm | Bằng chứng cần có ở bản dựng |
|---|---|
| Kỹ thuật | `ffprobe` xác nhận 9:16, 1080×1920, MP4 H.264 yuv420p + AAC, 24–60 fps (đích 30), faststart và file ≤250 MB. Đo 150–190 s theo D1, tối đa 180 s để cùng bản là YouTube Shorts. Có phụ đề đốt cứng, `captions.srt` và `thumbnail.jpg`. [Giới hạn YouTube Shorts](https://support.google.com/youtube/answer/15424877) |
| Tuân thủ | `publish.json` có tiêu đề/mô tả/hashtag đủ ba nền tảng, `ai_generated_content: true`, câu `ai_disclosure` cuối mỗi mô tả và “(ví dụ dựng)” ở mô tả. `qc-publish` xác nhận tệp; khi đăng bật công tắc khai báo AI của từng nền tảng. Rà khung có chữ so với đúng cột script và nguồn tài sản theo plan. |
| Trải nghiệm · mở và kết | Có hình phép cộng và câu hook trong 2 s đầu từ đầu video; trước 5 s file đã ở ô ngoài và người xem biết nhìn nhật ký. Đối chiếu khung ở khoảng 60 s và 170–171 s, 4 nhịp trạng thái lần lượt thấy được: file ngoài; dòng ẩn sáng; bản nạp lệch; báo khác biệt và ở nhánh quyền file dừng. |
| Trải nghiệm · hình và chiều sâu | Mốc/ảnh opening 1–3 s, header hiện đúng cảnh, phụ đề đúng vùng an toàn. Đo giữ High 2–3 s và kiểm thủ công từng thành phần lên trong 0,50 s sau từ nhắc. Kiểm 360×640, khung đông nhất ≤3 nhóm chữ, Cáo ~20,4% (ngưỡng thử ≤25%) và kích cỡ theo bản đồ. Người xem thử nói lại được hai phần mô tả khác nhau và ba bước kiểm theo thứ tự. |
| Trải nghiệm · âm thanh | Với `qc-measure`, đối chiếu T8 có 4,19 âm tiết/s phần có tiếng, đích T9 khoảng 4,6–4,8 theo cùng phép đo. Xác nhận đuôi ≤0,70 s. Công cụ đo thời lượng và khoảng nghỉ; phát âm, trọng âm và độ tự nhiên ghi **CHƯA KIỂM — giám đốc nghe** đến khi duyệt. |

Ghi ba nhóm Kỹ thuật, Tuân thủ, Trải nghiệm với số đo, mốc và khung chứng minh trong QC. So sánh với T8 về tốc độ đọc, nhịp tiếp nhận, opening/header, mức giữ sơ đồ và ví dụ. Phần công cụ chưa xác nhận được có nhãn **CHƯA KIỂM — kiểm thủ công**.

## Rủi ro & dự phòng

| Rủi ro | Dự phòng |
|---|---|
| TTS làm bản xuất vượt 180 s hoặc thuật ngữ ăn thêm nhịp | Đo câu sau TTS và dời mốc hình. Nếu vượt 180 s, rút phần mở rộng S04, ẩn dụ S08 hoặc nhịp lặp ở S15 trước; giữ câu đã chốt, giải pháp và khoảng quan sát High. Đo lại trong khoảng 150–180 s, giữ tốc độ theo Y6. |
| Hai khung mô tả khó phân biệt trên điện thoại | Giữ vạch cắt cố định và thẻ cùng dấu. Phóng gọn vùng lệch, ẩn header ở S11/S12/S17 theo script và thử đúng cỡ 360×640. |
| Khán giả tưởng bộ đếm 0 là số lượt của mọi công cụ | Neo cụm đếm vào riêng thẻ cộng. Thể hiện trạng thái ở lúc nạp mô tả và cắt riêng phần nhật ký của sự cố. |
| Nhánh tạm ngừng vì bản lệch và nhánh quyền tối thiểu bị hiểu là cùng một lượt chạy | Đóng cửa nạp để kết thúc lượt quét ở S24. Mở S25 bằng bố cục giả định riêng có phép cộng vẫn chạy, rồi S26 mới đối chiếu với lần đã gửi. |
| Thành phần dựng sẵn giới hạn nền hoặc các lớp che | Đạo diễn hình ảnh đối chiếu component theo R9. Nếu cần, duyệt storyboard cho Pillow+FFmpeg với lý do cụ thể để giữ cả hai bản mô tả và tiến trình từng lớp. |
