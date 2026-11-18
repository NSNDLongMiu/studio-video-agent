# Storyboard IT-T4-E01 — vòng 2, bản sửa thứ nhất

**DRAFT — chờ Claude review; chỉ Claude đặt APPROVED.** Giữ **12 cảnh, 13 lượt lời, 32,90 s**, renderer **pillow-ffmpeg**, talking-head **0/32,90 s = 0%**, Cáo hiện suốt. `scene_id`, `scene_type`, `voice_over`, `text_overlay`, `duration_s`, SFX, kiểu chuyển cảnh và `renderer_reason` giữ nguyên vòng 1. Không sửa `concept.md`, `plan.md`, `script.md`; không đọc/dùng thư mục T3.

Nguồn sửa: `review/storyboard-r1.md`, nhất là mục 3–5. JSON chứa tọa độ và đường đi đầy đủ; mọi `animation_timeline.t` là giây **cục bộ**, còn bảng dưới và mốc ghi trong event là giây toàn video. Các boolean là tự chấm thiết kế, chưa phải QC video.

| Cảnh / mốc (s) | Dài | Scene type | Vật / quan hệ đổi | Cáo / đích | Máy / nối cảnh sau | Nhóm chữ |
|---|---:|---|---|---|---|---:|
| C01-0.0-2.2 | 2,20 | environment_scene | Tin lên 160 px; avatar sếp hiện; laptop mở/phiến bung; bìa 1,70; đổi khung 2,00. | surprised; cao 480→380 tại 2,00 | wide / push_in; match_cut | 3 |
| C02-2.2-5.0 | 2,80 | process_animation | **Kết quả:** lưới tách, T6 xanh/năm ô xám xong 3,10; ba thanh kết quả đi 240 px sang khay nội bộ T6; không đường/cửa chặn. | point_up 2,20; T6 trên phải | medium / static; match_cut | 3 |
| C03-5.0-7.6 | 2,60 | process_animation | **Cơ chế:** lưới về trung tính; mạch tháng nối T6, năm cửa đóng, đầu khóa đi 156 px; khay đã đầy đứng yên. | point_right 5,00; chip/nhánh phải | medium / static; cut | 3 |
| C04-7.6-10.0 | 2,40 | comparison_scene | Một nhánh thành sáu nhánh vàng; báo cáo đi trong lối trống bên phải các ô; khay rút vào thành T6. | giữ point_right | medium / static; cut | 3 |
| C05-10.0-13.0 | 3,00 | object_interaction | Bó ba hàng T1 đi phải 130 px rồi về đúng khung bóng cố định; nét đo trắng 8 px chạy hai cạnh. | read_paper 10,00; đối chiếu bó trong T1 | medium / static; match_cut | 2 |
| C06-13.0-17.7 | 4,70 | ui_simulation | T1 qua cổng che; UI tìm dưới mã T4; kế toán đối diện Cáo; kính đi 296 px tới khay đỏ rỗng rồi về T1. | laptop_typing 13,00 → think 16,00 | medium / static; match_cut | 3 |
| C07-17.7-19.3 | 1,60 | object_interaction | Kính về T1; cắt bố cục frame 540; thẻ ra bên phải clipboard, lên sau matte rồi nở/lật trên đầu Cáo. | think → clipboard 18,00 | wide / static; match_cut | 3 |
| C08-19.3-21.6 | 2,30 | process_animation | Thẻ đi trái 370 px ở trên đầu Cáo; đường xanh gắn mũi tên; kính theo đường tới cửa trung tính. | giữ clipboard; thẻ bên trái | medium / static; wiperight | 2 |
| C09-21.6-23.4 | 1,80 | process_animation | Kính đi nốt đường; cửa trắng/xám hé 100 px; mặt nạ kín đến frame 701. | point_left 21,60; thẻ trái | medium / static; circleopen nội bộ C10 | 2 |
| C10-23.4-25.25 | 1,85 | object_interaction | Frame 702 mới lộ kho/T1/HĐ 4721 và màu kho; một hóa đơn rút ra, thành tiêu điểm cao 560 px. | point_left → read_paper 23,80 | wide / pull_out; match_cut | 3 |
| C11-25.25-29.95 | 4,70 | comparison_scene | Hai cách lưu tách cạnh nhau; giấy thu vào cụm trái, trả 100 px về khe; môi khe khép cục bộ, không tranh tiêu điểm so sánh. | read_paper → shrug 27,95 đã được chấp nhận | medium / static; cut | 3 |
| C12-29.95-32.9 | 2,95 | object_interaction | Hai thẻ đủ chữ từ đầu; thẻ 1 xuống 120 px chạm lưới, thẻ 2 phải 120 px chạm ngăn; cửa chạy 75+75 px. | thumbs_up 29,95; không nhún | wide / static; cut | 2 |

## Đối chiếu góp ý vòng 1

Tất cả **G1–G8 và N1–N3 đã đưa vào thiết kế**; không còn điểm nào phải bỏ vì giới hạn công cụ. Kiểm chuyển động/giọng của bản dựng vẫn chờ sản xuất sau duyệt.

| Điểm | Sửa cụ thể |
|---|---|
| **G1 — khay, hàng, báo cáo** | Giữ lưới x130–950/y330–930 cao 600 px theo plan. Mỗi ô dành phần riêng cho mã/hàng; lối x800–938 ở cột phải không có hàng gốc. Khay C02–C04 **(800,830,138,94)** trong T6; thanh kết quả **(574,y,110,18)→(814,y,110,18)**, y=838/864/890, đi 240 px. C03 giữ khay đầy. Báo cáo C04 **104×80** đi từ (814,834) lên (814,340), rồi thu **72×48** đến (842,266); mã/hàng T2/T4/T6 đều ở bên trái lối đi. Khay rút **(800,830,138,94)→(916,830,22,94)**, clip tại x938. Khay đỏ C06 **(766,830,172,94)→(714,830,224,94)**, không chạm hàng T6 kết thúc x684. Tất cả đáy ≤924, trong x90–990, không vào phụ đề y≥950. |
| **G2 — kết quả / cơ chế** | C02 bỏ toàn bộ đường từ tháng và cửa chặn; giữ xanh/xám hoàn tất **3,10 s**, lời 2 dự kiến dứt 4,86 và phải đo **≤4,9 s**. C03 cắt lưới về trung tính, vẽ mạch trong khe, năm cửa đóng, đầu khóa khớp T6; **không xuất hàng lần hai**. Khay đầy chỉ là kết quả giữ từ cảnh trước. |
| **G3 — T1 nguyên vẹn** | Bó ba hàng chỉ đi phải rồi về **trong T1**, không đưa tới giấy Cáo. Vị trí gốc x150–260/y422–492; đích x280–390. Khung bóng cố định **(142,414,126,86)** và nét đo **trắng 8 px** làm rõ cùng một vật trở về cùng chỗ; không che T2/mã T. |
| **G4 — C06** | Ô tìm chuyển thành **(278,618,650,96)**, dưới mã hàng giữa đáy616; mã T luôn trên panel/kính. Silhouette kế toán **(160,1130,160,280)** ở trái, đối diện Cáo; không chồng lưới, phụ đề hoặc AI. Camera sửa **medium/static**. |
| **G5 — đường bay và màu** | Bỏ guide x94 ở C07–C08. Thẻ nhỏ **72×64**: **(706,1250)→(810,1250)→(810,784)**; đi ra mép phải clipboard, lên ngoài thân Cáo, qua sau matte. Chỉ khi đáy≤850 mới nở tới **(500,500,320,280)**; C08 trượt trái tới **(130,500)**. Đoạn mồi cũ thu/xóa rồi tạo đường tra mới. Thẻ/mũi tên/đường C07–C09 **#60A5FA**; cửa/khối sau cửa **trắng/xám** tới frame701, đổi màu kho từ702. Cửa chỉ hiện sau19,85 khi thẻ không còn đè vùng cửa. Guide x94 chỉ trở lại ở C09 từ tay `point_left` thật. |
| **G6 — ghép vật C12** | Lưới **(770,380,220,220)**; thẻ Partition **680×110** từ (110,250) xuống (110,370), chạm lưới ở **(780,430)** bằng dải chồng mép20 px. Ngăn **(700,630,290,220)**; thẻ Archive **440×180** từ (160,550) sang (280,550), chạm ngăn tại **(710,680)**. Cửa **100×180** đi **x880→805→730**, y650–830, tổng150 px, cách mép phải thẻ Archive720 ít nhất10 px. Cụm vẫn x110–990/y250–850. Hai thẻ đủ nguyên văn từ29,95 tới32,9; hai nhóm chữ. |
| **G7 — hook** | Phiến **(100,250,880,580)** là nền chứa các vùng tách: nhãn/hàng trái x120–510; tin/avatar phải x530–960. Bong bóng **(530,270,430,240)**, chữ90 px “Vào họp” / “rồi!”; avatar **(600,550,150,180)**. “Tình huống dựng”72 px hai dòng ở x120–510/y270–454, “Đơn hàng”72 px ở x120–510/y490–594. Laptop **(110,1130,240,270)** nằm bên trái Cáo, không chạm AI. Tin đi lên trong vùng phải; avatar chỉ hiện khi tin dừng để tránh chồng. Giữ bìa **1,70 s**, ưu tiên tin sếp và nhãn tình huống ở180×320. |
| **G8 — máy / lặp khung** | C03/C04/C06/C09 đều **medium/static**; bỏ nhãn cận/qua vai/tracking/pan không có thật. C03–C06 khai `repeats_previous_layout: true`, gồm C04; C08–C09 cũng khai lặp đúng khung. C02–C06 chung khung MỘT BẢNG theo plan; đa dạng do quan hệ đổi, không do camera. |
| **N1 — đáp không lộ sớm** | Giữ enum `circleopen` ở C09 nhưng mặt nạ chỉ chạy **bên trong C10 từ frame702**, không xfade chồng đuôi C09. Frame702 đã thấy T1/mã trong lỗ bán kính160 px, mở hết tới23,60; nhãn Kho lưu hiện cùng frame702. Không pixel C10 trước702, không đổi tổng thời lượng. |
| **N2 — một cue ghim** | Giữ **một** cue lời8 xuyên frame540. Segoe UI Semibold56 đo bbox thô **(0,17,694,75)**; gốc(193,932) cho mực **x193–887/y949–1007**, viền3 tới **y1010**. Matte **x100–980/y940–1016**, dưới lưới đáy930 và trên đầu Cáo y1030. Ghim suốt cue, không nhảy/tách chữ tại18 s. |
| **N3 — trả giấy gọn** | Hai cách lưu vẫn cạnh nhau suốt27,55–29,95. Giấy thu về chi tiết260×260 trong ngăn trái từ nhịp mở ngăn; **28,7–29,15** chỉ trượt100 px về khe trái, **29,15–29,95** chỉ môi khe khép70 px. Không bay ngang qua khối tệp, không phóng/nhấp sáng; cụm so sánh còn là trọng tâm. |

## Các phần giữ nguyên và quyết định Claude đã chấp nhận

**Khung và hình:** MỘT BẢNG đúng **[2,0;18,0 s)**, ba bố cục theo plan, vật chính cao580/600/560 px tùy đoạn, tối đa ba nhóm chữ, không chip chương. **C02–C06 dùng chung khung MỘT BẢNG theo plan**; sự đa dạng đến từ **kết quả → cơ chế → sáu nhánh vàng → bó thẻ ra/vào → tìm hụt**, không do camera. Đây là ngoại lệ giữ khung đã được review chấp nhận; khai lặp trung thực, không đổi nhãn máy để né kiểm.

**Cáo:** căn hộp alpha tâm x≈570, mép phải≤800. Trước2 s cao480/y1000–1480; 2–18 s cao380/y1120–1500; sau18 s cao450/y1030–1480. Chỉ mười pose gốc; đổi bằng cắt, không nhép miệng/rig/tay/mắt mới. Che khiên laptop bằng layer mặt nắp, không sửa PNG gốc. Pose là ảnh nhỏ có thể mềm khi phóng. C12 không nhún. Guide chỉ phải đi x984; guide trái C09 đi x94, riêng clipboard C07–C08 dùng đường bay thực phía phải như G5.

Mốc pose giữ **0; 2,2; 5,0; 10,0; 13,0; 16,0; 18,0; 21,6; 23,8; 27,95; 29,95 s**, cách nhau ít nhất2,00 s. **`shrug` 27,95 s đã được Claude CHẤP NHẬN tại review3(i)**. Sau đo TTS, `thumbs_up` bám đầu lời13; `shrug` phải **≤ `thumbs_up`−2,0 s**, không sớm hơn đầu vế “Nó không phải lệnh SQL chuẩn”. Nếu phải chọn, **giữ ≥2,0 s thắng bám cue**. Không xin duyệt lại quyết định đã chấp nhận, không sửa script/plan còn ghi26,1. Producer ghi `notes.md`: “shrug27,95 s theo storyboard APPROVED, thay26,1 s ở script/plan”. Kịch bản cập nhật nguồn ở lần chạm file tiếp theo nếu có.

**Cue18 s đã được Claude CHẤP NHẬN tại review3(ii):** bố cục cắt cứng tại **frame540**, âm thanh/câu hỏi liên tục; **không tách lời8 thành hai cue**. N2 ghim vị trí suốt cue nên không cần nhảy phụ đề. Producer ghi `notes.md` mốc18,000 s cách đầu cue thật bao nhiêu giây, dự kiến **0,300 s**. Nếu TTS khiến lời8 bắt đầu sau18 s hoặc cần dời frame540, phải trình Claude/Kịch bản duyệt lại. Không tự kéo khung MỘT BẢNG qua18 s.

**Màu và chữ:** navy #101828, trắng #FFFFFF; xanh lá #22C55E=chọn/đọc, xám #667085=bỏ qua nhưng hàng còn, vàng #FACC15=chưa loại tháng/sáu nhánh, đỏ #EF4444=khay tìm trống tại nơi đang tìm, xanh dương #60A5FA=giữ/chuyển/kho; cam Cáo chỉ nhận diện. Cửa/khối trung tính trước23,4 như G5. Chữ khóa72–80 px, tin90 px, mã56–64 px, đúng đủ dấu. `text_overlay` giữ nguyên cột script; danh sách C01/C04/C07 chứa chữ ở các thời điểm khác nhau, không đồng hiện hết. Không logo/cú pháp SQL/tên lệnh tách/xóa.

**Phụ đề/AI/âm thanh:** ASS PlayRes1080×1920 và `captions.srt` chữ nguyên bản, kể cả **xoá** ở lời5. Phụ đề56 px, tối đa hai dòng, x100–980; vùng chuẩn y840–980 / y950–1090 / y860–1000 trước2 / 2–18 / sau18 s; riêng cue8 ghim một dòng theo N2. **AI tạo**56 px x820–990/y1430–1490 suốt video. Không nhạc, không AI trả phí; giữ ba SFX tự tạo nhỏ hơn giọng≥12 dB tại0/15,7/23,4 s. Giọng Minh Đức cục bộ, atempo1,08 đúng một lần, không tăng thêm.

**Mốc và giọng:** 32,9 s = **987 frame** ở30 fps. Mốc25,25/27,95/29,95 nằm nửa frame: half-up trên mốc tuyệt đối, sai số≤1/60 s; không làm tròn từng duration rồi cộng. Frame60/540/702 giữ cứng cho2,0/18,0/23,4. Đo TTS xong phải duyệt lại đồng bộ hình/giọng; không tự kéo im hay tăng tốc. T6 xanh xong3,10; lời2 dứt≤4,9 s, chỉ dùng bản dự phòng đã Claude duyệt nếu phép đo kích hoạt. Hai thẻ chốt luôn đủ chữ **29,95–32,9**; đuôi dự kiến0,35 s, mặc định≤0,7 s, cửa vẫn chuyển trong đuôi. Không thiết kế lặng≥0,8 s hoặc tĩnh>2 s nên không thêm `hold_reason`.

## Renderer và kiểm tra thiết kế

Giữ nguyên `renderer: "pillow-ffmpeg"` và toàn văn `renderer_reason`. Đã đối chiếu sáu file JSX thật: CharacterScene chỉ môi trường/pose/roleLabels/noteCard; ExplainerScene là chuỗi khối280×120 ởy860 và một điểm chạy; UiSimulationScene chỉ code/banner; PromptReviewScene chỉ thẻ/tag/connector tay cố định; QASequenceScene là beat hook/dialogue/code/note; DataVizScene là biểu đồ thanh. Không component nào biểu đạt đúng lưới trạng thái/cửa chặn/khay/đường che/thẻ lật/hai cơ cấu lưu và ghép thẻ-vật. Enum hợp lệ không đủ để chọn Remotion.

Sau **Claude APPROVED**, Producer đi thẳng Pillow+FFmpeg, không chạy producer.mjs/orchestrator.mjs, không viết JSX/sửa engine/lách preflight hoặc hạ thành thẻ chữ tĩnh. `overlay` chuyển vị trí dùng `eval=frame`; `zoompan.d` khớp số frame đoạn. Camera chỉ crop/pan ảnh phẳng; chuyển cảnh không cộng/trừ overlap. Vướng ngoài thiết kế mới fallback/escalate.

Đã thực hiện trong lượt sửa:

- AJV xác nhận JSON đúng `studio/schema/storyboard.schema.json`; đủ trường mới cấp storyboard/cảnh/quality_check, ≤3 nhóm chữ.
- So tự động với giá trị vòng1: giữ12 ID/type/lời/chữ/thời lượng/SFX/transition và renderer_reason; 13 lời khớp nguyên văn script; tổng32,90 s; timeline cục bộ tăng dần và nằm trong cảnh. SHA-256 của concept/plan/script không đổi.
- Đo chữ thật Segoe UI Semibold: Partition một dòng72 px rộng638 px, Archive hai dòng rộng380/322 px; câu hỏi56 px rộng694 px. Đo hộp mực, không nhầm điểm đặt font với bbox.
- Kiểm tọa độ khay/hàng/báo cáo không đè mã T/hàng gốc, khay không xuống phụ đề, cửa kết không đè thẻ. Đã mở bản kiểm bố cục **hook180×320**, khay360×640 và chuỗi bốn trạng thái ghép thẻ/cửa ở360×640. Đây là bản kiểm hình học tự vẽ, **không phải frame video hoặc thumbnail thành phẩm**; chưa đánh giá chuyển động/giọng thật.

Producer còn phải đo/nghe TTS, đo hộp chữ ASS bằng libass thật, so khung trước/sau và xem chuyển động360×640, mở bìa180×320, đo khoảng lặng/đuôi theo giọng. Không coi kiểm schema/hình học là video QC.

## Đề nghị sửa kịch bản

Không có câu nào cần viết lại: cả12 cảnh có minh họa vật/quan hệ cụ thể. Không đổi lời, chữ hay tổng thời lượng. Giữ hai quyết định đã được Claude chấp nhận về `shrug` và cue18 s; sau đo TTS mới trình duyệt lại nhịp nếu phép đo buộc thay đổi.
