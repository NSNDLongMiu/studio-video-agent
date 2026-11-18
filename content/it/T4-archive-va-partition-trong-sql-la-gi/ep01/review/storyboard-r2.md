# Review Storyboard — IT-T4-E01 · vòng 2 (N=2, vòng sửa cuối) · Claude (Đạo diễn hình ảnh) · 18/11/2026

Đã đọc toàn bộ `ep01/storyboard.json` (625 dòng, bản Codex ghi 15:44:03) và `storyboard.md`, `review/storyboard-r1.md`, `script.md`, `plan.md`, `studio/schema/storyboard.schema.json`, `docs/chat-luong-xem.md`; xem lại ảnh `clipboard`, `laptop_typing`, `point_left` trong `brand/cao/poses/` để kiểm hình học C06–C09. Không đọc thư mục T3. Phiên review không có shell nên **không chạy được AJV/Node**; không tin dòng "AJV xác nhận" trong `storyboard.md`, tự kiểm bằng đọc từng dòng + soát cấu trúc.

## 0. Tính toàn vẹn của file (Codex bị dừng ở mốc 20 phút)

| Kiểm | Kết quả |
|---|---|
| JSON không cụt | Hợp lệ: file kết thúc đúng `}` đóng `scenes` và đóng gốc; đủ **12** `scene_id` (C01…C12), **12** `duration_s`. |
| Dấu nháy/dấu phẩy | Soát bằng ripgrep: 0 dòng có số dấu `"` lẻ, 0 chuỗi có `\"`, 0 chỗ thiếu dấu phẩy giữa hai khoá/phần tử, 0 dấu phẩy thừa trước `]`/`}`. |
| Tổng thời lượng | 2,2 + 2,8 + 2,6 + 2,4 + 3,0 + 4,7 + 1,6 + 2,3 + 1,8 + 1,85 + 4,7 + 2,95 = **32,90 s**; ranh giới cảnh 2,2/5,0/7,6/10,0/13,0/17,7/19,3/21,6/23,4/25,25/29,95 khớp bảng script. |
| `voice_over` | 13 lượt lời, so từng chữ với `script.md`: khớp (C05 giữ "xoá"; C06 hai lượt; C12 giữ 'chưa'). |
| `text_overlay` | Khớp từng chuỗi cột chữ của script (C01, C04, C07 là danh sách theo thời điểm, không đồng hiện). |
| `animation_timeline.t` | Cục bộ, tăng dần, nằm trong cảnh; đổi sang giây toàn video đều khớp nhãn trong `event` (đã cộng cả 12 cảnh). |
| Schema (đọc tay) | Đủ `video_id`, `status`, `scenes`; mọi cảnh đủ 15 trường bắt buộc; `scene_type`, `camera`, `transition` đúng enum; `props`/`sound_effects` là mảng; có `main_change` + `text_groups` 12/12, `quality_check` đủ 5 trường; có `renderer: "pillow-ffmpeg"` + `renderer_reason`; `talking_head_ratio` 0. Không đoạn tĩnh > 2 s nên không cần `hold_reason`. |
| Mốc đổi dáng | 0; 2,2; 5,0; 10,0; 13,0; 16,0; 18,0; 21,6; 23,8; 27,95; 29,95 → khoảng nhỏ nhất **2,00 s**; chỉ 10 dáng có thật. |
| `status` trước khi duyệt | `DRAFT` (đã xác nhận); sau duyệt được đổi thành `APPROVED` bởi Claude (xem mục 4). |

## 1. Đối chiếu G1–G8 và N1–N3 với JSON thật

| Mục | Kết quả | Bằng chứng trong JSON / nhận xét |
|---|---|---|
| **G1** khay và đường đi của hàng | **Đạt** | Khay kết quả nằm TRONG T6: (800,830,138,94), đáy 924 < 950, T6 = x 552–950/y 746–930. Ba thanh 110×18 trượt (574→814, y 838/864/890) = 240 px, dừng x 814–924 trong khay; không qua nhãn T6 (y 758–824). Lối x 800–938 ở cột phải không có hàng gốc/mã T. Báo cáo C04 104×80 đi (814,834)→(814,740)→(814,340)→(842,266): nằm bên phải mọi mã/hàng (x ≤ 684), bên phải hộp bao mạch (x ≤ 796), kết thúc trong ô chip x 590–950/y 250–326. Khay rút (800→916, w 138→22) trong 116 px. Khay đỏ C06 (766→714, y 830, đáy 924) không chạm hàng T6 (kết thúc x 684). Không có phần tử nào ở y ≥ 950 trước 18 s: mạch dưới y=942 có nét tới y=947, kính C06 tới y=931; không ngoài x 90–990 (guide 984±4 → 988; guide C09 x=94±4 → 90). |
| **G2** C03 lặp C02 | **Đạt** | C02 chỉ cho KẾT QUẢ (T6 xanh/năm ô xám xong ở 3,10 s; ba thanh ra khay 3,1–4,9; không đường/cửa chặn). C03 là CƠ CHẾ (lưới về trung tính; mạch chip→sáu cổng, năm cửa chặn đóng, đầu khoá 156 px; khay đứng yên, không lặp hàng ra khay). `main_change`/`repeats_previous_layout` cập nhật khớp. Mốc 3,10 s và lời 2 dứt ≤ 4,9 s giữ nguyên. |
| **G3** C05 | **Đạt (đã tăng cường nhỏ)** | `character_action` và `props` nhất quán: bó ba thanh chỉ trượt phải 130 px RỒI về, hoàn toàn trong T1 (x 130–528, dưới mã y ≤ 408), không đưa tới giấy Cáo. Có khung bóng cố định (142,414,126,86) giữ chỗ cũ + nét đo trắng 8 px (382+168 px). Khung bóng 4 px/opacity 0,5 quá mờ ở 360×640 (≈ 1,3 px, 50%) nên Claude nâng lên opacity 0,8 + nền trắng 12% (mục 4). |
| **G4** C06 | **Đạt** | (a) Ô tìm đổi thành (278,618,650,96): đỉnh y=618 nằm 2 px dưới đáy nhãn T3/T4 (y ≤ 616), x 278 > thanh hàng T3 (x ≤ 260); mã T "luôn lớp trên panel và kính". (b) Silhouette kế toán (160,1130,160,280): cách phụ đề 40 px, cách lưới 200 px, cách hộp alpha Cáo (≈ 428+) hơn 100 px, không chạm nhãn AI. (c) Camera `medium/static`. |
| **G5** C07–C08 đường bay | **Đạt** | Đã đối chiếu `clipboard.png`: bảng kẹp ở bên PHẢI thân, mép ngoài ≈ x 718. Thẻ 72×64 tách ở (706,1250) → ra (810,1250) → lên (810,784) theo dải x 810–882 (bên phải hộp Cáo ≤ 800, trên nhãn AI y 1430), đi SAU matte phụ đề, chỉ nở 320×280 khi đáy ≤ 850; guide x=94 đã BỎ ở C07–C08 (chỉ còn ở C09, xuất phát từ ngón tay `point_left` thật, chạy x 90–98 nên không đụng phụ đề x ≥ 100). Màu: thẻ/mũi tên/đường tra/kính C07–C09 là #60A5FA; cửa và khối sau cửa trắng/xám trung tính, mặt nạ kín tới frame 701; mốc 19,85 s (cạnh phải thẻ < 650) tính đúng. |
| **G6** C12 | **Đạt** | Lưới (770,380,220,220), thẻ Partition 680×110 (110,250)→(110,370) chồng mép lưới 20 px, điểm chạm (780,430), mực kết thúc x 768; ngăn (700,630,290,220), thẻ Archive 440×180 (160,550)→(280,550), điểm chạm (710,680), mực kết thúc x 680; cửa 100×180 trượt x 880→730 (150 px), cách mép phải thẻ Archive (720) ≥ 10 px; hai biểu tượng cao 220 px; mọi hộp trong x 90–990 và y 250–850; không nhóm chữ thứ ba. Kiểm giao hộp: thẻ Partition/Archive/lưới/ngăn/cửa không chồng ngoài các dải chạm có chủ đích. |
| **G7** C01 hook | **Đạt** | Có đủ toạ độ: bong bóng (530,270,430,240), chữ 90 px mực 554–898 / 294–473; silhouette sếp (600,550,150,180) cách đuôi tin 14 px; "Tình huống dựng" 72 px (130–505 / 280–446), "Đơn hàng" 72 px (130–453 / 510–582) — ba nhóm không chồng; phiến (100,250,880,580); laptop (110,1130,240,270) cách hộp Cáo ≈ 77 px, không chạm nhãn AI. Cỡ 90/72/72 px ≈ 15/12/12 px ở 180×320, có ghi ưu tiên khi QC. |
| **G8** nhãn cỡ cảnh/khai lặp | **Đạt** | C03/C04/C06/C08/C09 = `medium/static`, C09 bỏ `close_up/pan`, C06 bỏ `over_the_shoulder/tracking`; C03–C06, C08–C09 khai `repeats_previous_layout: true`; `storyboard.md` thay giải trình: C02–C06 chung khung MỘT BẢNG do plan, đa dạng do quan hệ đổi, không do camera. C01/C10 vẫn ghi `push_in`/`pull_out` 3–4% đúng thực tế (không dùng làm bằng chứng đa dạng). |
| **N1** `circleopen` | **Đạt** | Mặt nạ chạy BÊN TRONG C10 từ frame 702, "không pixel C10 trước f 702", không xfade chồng đuôi C09; không lộ T1/mã/Kho lưu trước 23,4 s. |
| **N2** phụ đề lời 8 | **Đạt** | Một cue, một dòng ghim: mực x 193–887 / y 949–1007 (đã đo Segoe UI Semibold 56: 694 px), viền tới 1010, matte x 100–980 / y 940–1016; cách lưới (930) 10 px, cách đầu Cáo sau 18 s (1030) 14 px; xuyên frame 540, không tách mảnh. |
| **N3** C11 28,7–29,95 | **Đạt** | Hai cách lưu cạnh nhau suốt 27,55–29,95; giấy chỉ trượt 100 px trong ngăn trái (28,7–29,15) rồi môi khe khép 70 px; không bay ngang qua khối tệp, không glow/zoom. |

Hai quyết định đã chấp nhận ở vòng 1 vẫn giữ đúng: `shrug` 27,95 s (khoảng đến `thumbs_up` 2,00 s) và một cue lời 8 xuyên frame 540.

## 2. Bảng chấm 5 tiêu chí

| # | Tiêu chí | Kết quả | Lý do (cảnh cụ thể) |
|---|---|---|---|
| 1 | SHOW, DON'T TELL | **Đạt** | 12/12 cảnh có minh hoạ thật, tắt tiếng hiểu phần chính (hook sự cố; T6 xanh + năm ô xám; mạch + cửa chặn; sáu nhánh vàng + báo cáo về sếp; bó thẻ ra/vào có bóng giữ chỗ; T1 qua cổng che; thẻ lật + đường tra; hoá đơn rút khỏi T1; hai cách lưu; hai thẻ ghép vật). Chữ không chép lời, ≤ 3 nhóm, khoá 72–90 px, nhãn/mã 56–64 px. Vật chính 580/600/560–600 px; đoạn thẻ nhỏ bay C07 (18,0–18,5 s) là chuyển cảnh ngắn có quãng 466 px. |
| 2 | Đa dạng | **Đạt (có ghi chú)** | `character_acting` 0%. Không ba lần đổi dáng cách nhau < 2,0 s. Mọi khoảng ≥ 1,5 s đã soát đều có vật/quan hệ đổi ≥ ~10% khung. C02–C06 chung khung MỘT BẢNG do plan (khai `true` trung thực); C07–C09 chung khung "nhãn + cụm y 250–850", đa dạng đến từ quan hệ đổi (thẻ lật → thẻ trượt + đường → cửa hé). Nhãn `wide`/`medium` xen kẽ sau 18 s là danh nghĩa, **không tính** là đa dạng (xem ghi chú 8). Điểm yếu nhất còn lại: C11 27,55–29,05 và C12 31,15–32,9 (chuyển động 70–150 px, chậm) — Producer đã có ghi chú tăng nổi bật, QC kiểm lại ở 360×640. |
| 3 | Khớp kịch bản | **Đạt** | Lời/chữ/tổng 32,90 s/đuôi dự kiến 0,35 s khớp; không lặng thiết kế ≥ 0,8 s; hook dùng silhouette sếp/kế toán; Cáo có hành vi gắn vật; bảng nghĩa màu nhất quán (xanh lá/xám/vàng/đỏ/xanh dương/trắng; cam Cáo không là tín hiệu); không lộ đáp trước frame 702; hai thẻ chốt đủ chữ 29,95–32,9 s; bìa 1,70 s trong cửa sổ 1,6–1,9 s; không chip chương có lý do trong plan. |
| 4 | Dựng được | **Đạt** | `pillow-ffmpeg` đúng (đối chiếu thật ở vòng 1; không scene Remotion nào dựng được lưới có trạng thái từng ô, cửa chặn, thẻ lật, hai cách lưu, ghép thẻ-vật). Mọi vật chính có toạ độ/kích thước/đường đi; chỉ 10 dáng có thật, đổi bằng cắt, giữ giới hạn mascot (không nhép miệng, che khiên laptop bằng layer). Một vài chi tiết nhỏ còn để Producer làm theo ghi chú dưới, không ảnh hưởng ý nghĩa minh hoạ. |
| 5 | Đúng schema | **Đạt** | Xem mục 0 (đọc tay; chưa chạy AJV vì không có shell). Trường mới `main_change`/`text_groups`/`quality_check.*`/`renderer`/`renderer_reason` đủ. |

## 3. Lỗi mới do bản sửa gây ra — kết quả soát

Không có lỗi chặn. Đã soát: chồng lớp mã T/ô tìm/khay; va chạm phụ đề (mọi lớp ≤ y 947 trước 18 s; ≥ 10 px quanh matte lời 8); nhãn AI (x 820–990, y 1430–1490: thẻ bay C07 ở y ≤ 1314 nên không chạm); ngoài x 90–990; vật chính; lộ đáp; số liệu (hộp bao mạch 494–796 / 317–947, 382+168, 156 px, 296 px, 240 px, 116 px, 370 px, 150 px đều khớp toạ độ nêu); đổi dáng < 2,0 s (không có). Phát hiện ba điểm nhỏ đã sửa tại chỗ (mục 4) và một số điều Producer cần giữ (mục 5).

## 4. Các sửa nhỏ Claude đã làm tại chỗ trong `storyboard.json` (không đụng lời, mốc, concept, bố cục chính)

1. **C05, `props[2]` khung bóng:** `nét trắng 4 px opacity 0,5` → `nét trắng 4 px opacity 0,8 và nền trắng 12% trong khung`. Lý do: ở 360×640 nét 4 px/50% gần như không thấy, trong khi G3 cần mắt thấy "cùng một vật ra rồi vào đúng chỗ".
2. **C11, `props[2]` vị trí chữ "Ví dụ":** bản Codex ghi "thẻ Ví dụ nối ngăn thật" nhưng ngăn trái (x 130–530) đã chiếm chỗ thẻ cũ ở C09–C10 (x 130–450 / y 500–780), nên Producer không có chỗ đặt. Claude chốt: chip 72 px x 590–950 / y 250–326 cùng dải đầu với "Kho lưu" (x 130–430), không chồng khối tệp (y ≥ 390) hay ngăn trái, thẻ cũ biến mất khi ngăn mở. Vẫn 3 nhóm chữ, không chữ mới.
3. **Lỗi gõ làm mờ nghĩa:** C10 `character_action` "chê n h 21,6 s đúng 2,2 s" → "cách point_left từ 21,6 s đúng 2,2 s"; C01 `visual_concept` "dang d ở" → "dang dở"; C11 `visual_concept` "g án logo" → "gắn logo".
4. **`status`: `DRAFT` → `APPROVED`.** Đã đọc lại các dòng sửa; JSON vẫn hợp lệ (0 dòng lẻ dấu nháy sau sửa, vẫn 12 cảnh).

Còn một số chỗ mất dấu cách do lỗi gõ ("sangnavy", "Backgroundnavy", "trongx", "sangx 94", "thangx"...): chỉ là chính tả, không phải tham số; Producer đọc theo ngữ cảnh.

## 5. Ghi chú cho Producer (đường thẳng Pillow + FFmpeg, không chạy `producer.mjs`/`orchestrator.mjs`)

1. **Màu cửa trung tính C07–C09:** dùng trắng hoặc xám NHẠT (ví dụ #E5E7EB–#CBD5E1), **không dùng #667085** (nghĩa "bỏ qua"). Đổi sang #60A5FA đúng frame 702.
2. **Nhãn T đọc được trên mọi màu ô** (xanh/xám/vàng/trắng): đặt mã T trên chip nền navy đặc.
3. **C03 đầu khoá:** khoá chạy dọc x=780 từ y 746 tới 918 trong T6 và để lại nét xanh "đường chọn" (nằm giữa hàng x ≤ 684 và khay x ≥ 800). Mạch của T6 đi vào cổng từ dưới (y 942 → 918), nên đừng vẽ khoá chạy trên y=942 theo chiều cao 36 px (sẽ chạm y 950). Cửa chặn 32×10 có thể nới tới 40×20 (trong khe 24 px) nếu 360×640 khó thấy. Nét dưới cùng (y 937–947) chỉ cách hộp phụ đề 3 px: nếu matte phụ đề 2–18 s bắt đầu y=950, nới matte xuống 956 hoặc dịch nhánh T5/T6 lên y=938.
4. **C05:** sau khi dựng, mở khung 360×640 kiểm khung bóng + bó thẻ; không nới bó/hàng ra ngoài T1.
5. **C10:** hoá đơn tiêu điểm đặt x ≥ 470 để không giao nhãn "Kho lưu" (x 130–430, y 250–326) và thẻ "Ví dụ" (x 130–450); hoá đơn không đè nhãn.
6. **C11:** chip "Ví dụ" theo mục 4.2. Làm ray đón giấy/môi khe đặc, dày ≥ 16 px, màu #60A5FA để đoạn 27,55–29,05 vẫn có đổi hình thấy ở 360×640; `shrug` 27,95 s giữ ≥ 2,0 s trước `thumbs_up` (≤ `thumbs_up` − 2,0 s, không sớm hơn đầu vế "Nó không phải lệnh SQL chuẩn").
7. **C12:** cửa trượt thật 150 px chậm (31,15–32,9 s) — làm cánh cửa cao, tương phản rõ; hai thẻ đủ chữ từ 29,95 tới hết; thẻ chỉ dẫn 28×50 là chi tiết phụ.
8. **Nhãn camera** `wide`/`medium` sau 18 s là nhãn danh nghĩa (khung giống nhau); đừng tạo zoom giả để hợp nhãn.
9. **`notes.md` phải ghi:** (a) shrug 27,95 s theo storyboard APPROVED thay 26,1 s ở script/plan; (b) 18,000 s cách đầu cue lời 8 thật bao nhiêu giây (dự kiến 0,300) — nếu lời 8 bắt đầu sau 18,0 s hoặc phải dời frame 540 thì trình duyệt lại; (c) kết quả đo lời 2 (≤ 4,9 s hoặc kích hoạt bản dự phòng đã duyệt); (d) `captions.srt` giữ nguyên "xoá" ở lời 5; (e) đo hộp chữ ASS bằng libass thật; (f) không có pixel C10 trước frame 702.
10. **Sau đo TTS** duyệt lại mốc theo giọng (R8): không tăng tốc, không kéo im, đuôi ≤ 0,7 s. Các mốc là dự kiến.

## 6. Kết luận

Cả 8 điểm bắt buộc G1–G8 và 3 điểm nên N1–N3 đã được đưa vào thiết kế với toạ độ kiểm được; không còn lỗi chặn. Ba sửa nhỏ (khung bóng C05, vị trí chữ "Ví dụ" C11, lỗi gõ) đã làm tại chỗ; `status` đã đặt `APPROVED`.

KẾT LUẬN: DUYỆT SAU KHI CLAUDE SỬA NHỎ
