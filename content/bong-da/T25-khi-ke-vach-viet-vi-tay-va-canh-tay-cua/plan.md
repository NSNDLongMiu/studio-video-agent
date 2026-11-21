# Plan — T25 · Khi kẻ vạch việt vị, tay và cánh tay có được tính không?

Phòng Bóng Đá · Đội 1 (team_id 6). Bản 1, 21/11/2026. Một tập, chuẩn 45–75 s (D1). Một câu hỏi + một sự cố + **một** cơ chế (vạch xét đầu, thân, chân; mốc cắt đáy nách) + hai ví dụ dựng. Không có hai khái niệm ngang nhau cần giám đốc quyết.

## Bảng các tập
| Mã video | Tên tập | Thời lượng mục tiêu | Thông điệp chính |
|---|---|---|---|
| BONG-DA-T25-E01 | Bàn bị gạt vì cái tay? | ≈ 57,0 s (ngân sách; đo lại sau TTS, chuẩn 45–75 s) | Tay và cánh tay không được xét khi kẻ vạch việt vị; vai thuộc thân nên tính; mốc là đáy nách, không phải mép tay áo. |

## Phong cách hình ảnh
Đồ hoạ phẳng 9:16 (1080×1920), hình khối người (không mặt, không số áo, không đội thật), góc bo tròn, bóng nhẹ. Vùng an toàn chữ y∈[~250, ~1500]; phụ đề dải dưới y≈1340–1500 (lớp riêng); Cáo đáy ≲ y 1290. Vật chính (tiền đạo + tay + vạch ở sân; hình người cắt ngang ở bản đồ cơ thể) cao ≥ ~560 px.

**Hai góc nhìn (đổi để khỏi đơn điệu, R12):** *nhìn từ trên* (sân, vạch việt vị chạy ngang, dùng ở hook và hai thử thách) và *nhìn thẳng trước mặt* (bản đồ cơ thể, đường ngang đáy nách).

**Bộ nền (không dồn quá ~40% thời lượng vào một nền):**
| Nền | Dùng ở | Mô tả | Nguồn |
|---|---|---|---|
| N1 Sân nhìn từ trên | S01, S06, S07, S09 | mặt sân xanh đậm phẳng, vạch sân mờ, vạch việt vị trắng-cyan chạy ngang, gôn nhỏ ở đỉnh khung; **không chữ/logo/người thật** | nền màu + đồ hoạ vẽ bằng renderer (không cần ảnh Gemini) |
| N2 Bản đồ cơ thể tối | S03, S04, S05 | navy tối, lưới mờ, hình người khối ở giữa | nền màu/gradient |
| N3 Phòng xem | S02, S10 | gradient ấm tối, hai silhouette khán giả trước một màn hình (không nội dung thật) | nền màu/gradient |
| N4 Sáng nhẹ | S08 | nền sáng ngà, hai hình người mặc áo cộc/áo dài | nền màu/gradient |

Tỉ lệ: N1 ≈ 3,0 + 6,6 + 7,4 + 5,8 = 22,8 s ≈ 40%; N2 = 5,0 + 8,0 + 3,8 = 16,8 s ≈ 29%; N3 = 4,8 + 6,4 = 11,2 s ≈ 20%; N4 = 6,2 s ≈ 11%. N1 nằm đúng ngưỡng, tách bằng đổi bố cục (S01 toàn sân, S06 cận một cánh tay, S07 cận vai, S09 quay lại bố cục S01).

**Màu và bảng nghĩa màu (dùng nhất quán):**
| Màu | Hex | Nghĩa |
|---|---|---|
| Xanh lá | `#2ECC71` | phần cơ thể **ĐƯỢC TÍNH** (đầu, thân, chân, vai); chỉ dùng cho nghĩa này |
| Xám xanh mờ | `#8E9BAA` | phần **KHÔNG TÍNH** (tay, cánh tay), hoặc "không phải mốc" (mép tay áo) |
| Trắng-cyan liền | `#7DF9FF` | **vạch việt vị** (luôn nét liền, một vạch duy nhất mỗi cảnh) |
| Đỏ | `#E5484D` | cờ và kết quả **VIỆT VỊ** (bị bắt) |
| Xanh dương nhạt | `#5BA8FF` | kết quả **KHÔNG VIỆT VỊ** (không dùng xanh lá để tránh nhầm với "được tính") |
| Vàng | `#F4B400` | **đang xét / câu hỏi / đang đoán** |
| Cam Cáo | `#F28C28` | nhấn: mốc đáy nách, vòng khoanh đầu bàn tay, Cáo |
| Tiền đạo / hậu vệ | `#3B82F6` / `#7C6FA8` | màu đội (chỉ để phân biệt hai bên, không mang nghĩa trạng thái) |
| Navy nền / trắng chữ | `#101B2E` / `#FFFFFF` | nền tối / chữ chính |

**Font và cỡ chữ:** Segoe UI Bold. Chữ khoá ≤ 3 từ, ≥ 72 px; nhãn ≥ 56 px; header ≥ 52 px (đủ lớn, đổi ô); tối đa 3 nhóm chữ đồng thời ngoài phụ đề và header. Phụ đề 52–60 px, ≤ 2 dòng, ≤ 28 ký tự/dòng, dải dưới, lớp riêng, không tính là visual.

**Chip chương (R7):** video ≈ 57 s, một mạch nên **không dùng chip chữ** (Y1); có thể dùng ba chấm tiến độ không chữ ở mép trên (tô dần ở S03, S06, S09) nếu header còn chỗ.

## Opening và Header (R14, D8)
- **Tiêu đề opening:** `TAY QUA VẠCH?` (hiện 5,00–7,80 s, trong S02, animation vào một lần, topic reveal). Opening = S01 + S02 = **7,80 s** (trong trần 1–8 s), ba pha: `visual_hook` (S01, tay thò qua vạch, cờ đỏ giơ lên) → `conflict` (S02 đầu, hai phe cãi nhau, cờ chuyển vàng) → `topic_reveal` (tiêu đề). Kiểu `incident`, có lời hook.
- **Header xuyên suốt S03–S10:** `BÓNG ĐÁ / VIỆT VỊ`, đổi ô theo cảnh (trên trái → trên giữa → trên phải …) để không đè sơ đồ/Cáo/phụ đề; opening không có header.
- Chữ do text engine vẽ; nguyên văn ở cột "Chữ trên màn hình" của script, kèm lý do.

## Bản đồ Cáo (Y2–Y3)
| Cảnh | Cáo | Mốc | Hành vi · cỡ · vị trí |
|---|---|---|---|
| S01 | không | — | hệ quả nằm trên hình (cờ đỏ, bàn bị gạt); dành toàn khung cho sân |
| S02 | có · `think` | 3,15–6,15 s | đứng cạnh hai khán giả, nhìn màn hình đang cãi; ≈ 16% khung (≈ 170 px), x≈90, đáy y≈1290 |
| S03–S04 | không | — | nhường hình cho bản đồ cơ thể |
| S05–S09 | không | — | nhường hình cho cách nhớ, hai thử thách, sai lầm, trả lời (S05 bỏ Cáo theo review storyboard r1, mục 2: giữ Cáo ≲ 15% theo D8) |
| S10 | có · `idea` rồi `thumbs_up` | 50,75–53,00 s (`idea`), 55,00–57,00 s (`thumbs_up`) | nhịp kết; ≈ 17–18% khung, đứng cạnh hình người; vắng 53,0–55,0 s để chữ chốt không bị che |
Tổng thời gian có Cáo ≈ 3,00 (S02) + 2,25 + 2,00 (S10) = 7,25 s ≈ **12,7%** (≲ 15% theo D8, < 25% theo Y2; đồng bộ 21/11/2026 theo `ep01/review/storyboard-r1.md`). Đổi dáng cách nhau ≥ 2 s. Cáo không nhép miệng; chỉ nhìn/chỉ vào vật.

## Âm thanh (R25, `docs/asset-sources.md`, `tools/audio/sound-design.json`)
Giọng TTS theo `docs/voice.md` (Hải Đăng); `[dẫn]` cao hơn T8 ≈ 13–18%, `[kỹ thuật]` ≈ 7–12% (trần `atempo` 1,20), **đo lại sau TTS rồi chỉnh**, nghỉ theo ý không đều. **Không nhạc** (mặc định tắt). SFX tự tổng hợp nhỏ hơn giọng: "vút" mềm khi cờ giơ lên, "tick" khi nhãn hiện, "tụp" khi phần cơ thể đổi sang xám, một nhịp "ting" khi vạch cam đáy nách quét qua, "pop" nhỏ khi chip kết quả hiện. Không còi trọng tài thật, không tiếng khán đài. Khoảng nghỉ dài đi cùng đổi hình/chuyển cảnh (ghi ở script).

## Quy tắc phụ đề
Phụ đề là lớp accessibility riêng, chép đúng lời đọc, chính tả chuẩn có dấu; không tính là visual. Không số trong lời (không có số đo); chữ trên hình không chép lời.

## Bản đồ Y/R chính (tóm tắt, chi tiết ở script)
- **Y5/R1–R2:** tình huống ở 0 s, hệ quả (cờ đỏ, bàn bị gạt) ở 1,2 s, câu hỏi mở bắt đầu 3,15 s, ích lợi sớm 7,95 s.
- **R13:** 10 cảnh, trung bình 5,7 s, không cảnh nào dưới 3,0 s (S01 là hook, S05 3,8 s); opening 7,8 s.
- **Trạng thái sự cố (R11) đổi ≥ 3 lần rồi kết trả đúng chỗ:** *cờ và thẻ lý do ở bàn thắng*: bóng vào lưới (0,00 s) → cờ **đỏ** giơ lên (1,20 s) → cờ **vàng** "đang cãi" (3,00 s) → ... (hai thử thách dùng chip riêng) → quay lại khung hook, cờ **hạ**, thẻ lý do "tay" chuyển **xám**, chip **xanh dương** `KHÔNG VIỆT VỊ` (49,07 s).
- **Trước/sau, đúng/sai:** S06 ↔ S07 (tay xa → không; chỏm vai → có), S08 (mép tay áo hai kiểu áo, mốc đáy nách cùng độ cao), S09 (cùng khung S01, trước cờ đỏ, sau cờ hạ).
- **R15 chiều sâu, D7 bản đồ ngữ nghĩa, R22 kinetic:** ở script (kinetic ở S04 `ĐÁY NÁCH`, S07 `VIỆT VỊ`).

## Nguyên liệu cần
- Giọng TTS (docs/voice.md); Cáo PNG (`think`, `point_right`, `idea`, `thumbs_up`); đồ hoạ vẽ bằng renderer: sân nhìn từ trên, hình người khối (nhìn từ trên và nhìn thẳng), vạch việt vị, cờ, thẻ lý do, chip kết quả, silhouette khán giả.
- Không cần ảnh Gemini (nền màu/gradient và vẽ); nếu Đạo diễn hình ảnh muốn một ảnh nền sân, brief ở script mục "Gợi ý brief ảnh".
- Không clip, không ảnh cầu thủ/trọng tài thật, không logo giải đấu/đội, không nhạc ngoài.

## Cần giám đốc cung cấp
Không có. **Việc giám đốc nên làm trước khi đăng:** (1) nghe thử cách đọc "nách", "chỏm vai", "đáy nách" (CHƯA KIỂM); (2) nếu muốn khẳng định thêm, đối chiếu bản PDF Luật 11 hiện hành (trang web IFAB đã mở, chưa tải PDF); (3) cân nhắc điều ghi ở "Giả định 2".

## Giả định đã chọn (chạy nền, không hỏi lại)
1. **Hai thử thách + một bẫy**, không ba (theo phán quyết). Thử thách C của vòng 2 ("tay giơ cao") gộp vào lời 04 ("dù duỗi tới đâu") và vào bẫy mép tay áo.
2. **"Việt vị" trong lời nói đời thường.** Luật 11 coi "ở vị trí việt vị" là chưa phải lỗi; chỉ bị phạt khi tham gia vào pha bóng. Video dùng "việt vị" theo cách người xem hay nói (hook nói về cú bị gạt), và đáp án chỉ khẳng định phần **riêng cái tay không làm tiền đạo ở vị trí việt vị**; không nói bàn thắng chắc chắn hợp lệ. Hai ví dụ dựng giả định tiền đạo gần khung thành hơn bóng và hậu vệ áp chót, nên chỉ vị trí so với vạch quyết định. Nếu giám đốc muốn thêm một câu về "chưa phải lỗi nếu chưa tham gia", sẽ phải thêm khái niệm thứ hai (đề nghị tách tập).
3. **Vạch việt vị** vẽ ngang qua hậu vệ áp chót (một vạch); video không giải thích cách xác định vạch, không nói bộ phận cơ thể của hậu vệ.
4. **Không số đo** (không "2 cm", "50 cm"): chỏm vai nhô chỉ là một phần nhỏ trên hình.
5. Câu "chỉ đếm phần ghi bàn được" ở S05 nói rõ là **cách nhớ**, không phải lời luật.

## Ngân sách thời lượng (tập BONG-DA-T25-E01)
Hệ số: ≈ 4,3 âm tiết/s giọng; không có thuật ngữ tiếng Anh (không +1); mỗi cảnh = max(lời + nghỉ, tối thiểu 3/5/8 s theo độ phức tạp + giữ sau lời). Chi tiết từng cảnh ở `ep01/script.md`.
| Đoạn | Nhãn | Âm tiết | Tốc độ | Giây đọc | Nghỉ Y7 + giữ | Đuôi | Tổng |
|---|---|---|---|---|---|---|---|
| S01–S02 opening | dẫn | 18 | 4,3 | 4,19 | 3,61 | 0 | 7,80 |
| S03–S05 giải thích | kỹ thuật | 40 | 4,3 | 9,30 | 7,50 | 0 | 16,80 |
| S06–S08 ví dụ + sai lầm | kỹ thuật | 54 | 4,3 | 12,56 | 7,64 | 0 | 20,20 |
| S09–S10 kết | dẫn | 35 | 4,3 | 8,14 | 3,46 | 0,60 | 12,20 |
| **Tổng** | | **147** | | **34,19** | **22,21** | **0,60** | **≈ 57,0** |
Trong 45–75 s và gần mục tiêu 55–65 s. Quá 72 s sau TTS thì rút giữ S04/S07/S08, không tăng tốc để bù.

## Tiêu chí nghiệm thu (đo được)
- Thời lượng 45–75 s (mục tiêu ≈ 57 s), 1080×1920, 9:16, có phụ đề.
- Hook: tình huống thấy từ 0 s; cờ đỏ giơ lên ≤ 1,5 s; câu hỏi mở bắt đầu trước 3,5 s.
- Opening ≤ 8,0 s với tiêu đề `TAY QUA VẠCH?`; header `BÓNG ĐÁ / VIỆT VỊ` từ S03 đến hết, không đè.
- Hình tẩy tay ở S03 giữ ≥ 0,8 s ở trạng thái "dừng đúng đáy nách"; đường đáy nách nhìn ra được ở 360×640.
- Không có tên thật của bốn nền tảng, không logo, không người/đội/giải thật, không nhãn "Ví dụ dựng"/"AI" trên hình; không năm, không "luật mới", không nhắc công nghệ/độ chính xác máy đo, không Luật 12, không số đo thật ở lời, phụ đề, chữ hình, caption.
- `publish.json` cho ba nền tảng, mô tả có câu khai báo AI và ghi "ví dụ dựng".
- Trạng thái cờ/thẻ lý do đổi ≥ 3 lần và trả đúng chỗ ở S09; Cáo ≲ 25%.

## Rủi ro và dự phòng
| Rủi ro | Dự phòng |
|---|---|
| Người xem hiểu "mọi tay đều không tính nên cứ giơ tay thoải mái" hoặc "bàn thắng chắc chắn hợp lệ" | lời 12 chỉ nói "không việt vị" cho tình huống đầu, thân, chân còn sau; không nói bàn hợp lệ (xem Giả định 2) |
| Đáy nách khó thấy ở 360×640 | hình người cắt ngang cao ≥ 560 px, đường cam dày, nhãn `ĐÁY NÁCH` ≥ 56 px; giữ ≥ 2 s ở S04 |
| Hình tẩy tay quá nhanh | giữ ≥ 0,8 s; fade đi từ bàn tay lên và dừng đúng đáy nách |
| Giáo khoa | đổi hình/góc nhìn mỗi 3–7 s; S06–S07 là phép thử "đoán rồi hiện kết quả" |
| Cờ/trọng tài bị hiểu là nhân vật thật | chỉ silhouette khối, không mặt, không logo |
| "Phần ghi bàn được" bị hiểu là lời luật | lời đọc nói "Cách nhớ:" và chip `CÁCH NHỚ` |
| N1 đúng ngưỡng 40% | đổi bố cục từng cảnh; nếu QC thấy đơn điệu, S09 chuyển sang N3 |
| Màu xanh lá nhầm với "không việt vị" | kết quả "không việt vị" dùng xanh dương nhạt |

## Nguồn (tóm tắt, chi tiết cuối script.md)
IFAB, Laws of the Game, Luật 11 (Offside) trên trang `theifab.com`, đã tự mở 21/11/2026: câu "hands and arms ... are not considered", "upper boundary of the arm is in line with the bottom of the armpit", "head, body or feet".
