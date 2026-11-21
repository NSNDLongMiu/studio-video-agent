# Plan — T29 · Bóng đá tổng lực: khi hậu vệ dâng lên tấn công thì ai lấp vào chỗ trống phía sau?

Phòng Bóng Đá · Đội 1 (team_id 6). Bản 1, 21/11/2026. Một tập, chuẩn 45–75 s (D1). Một câu hỏi + một sự cố (ô sau lưng hậu vệ hở) + **một** cơ chế (ai gần ô nhất thì lấp; vị trí là nhiệm vụ) + một pha dựng (cánh phải, "trong pha này"). Không có hai khái niệm ngang nhau cần giám đốc quyết: "để sẵn người phía sau bóng" chỉ là một câu bổ trợ ở S08, "gần ô khác gần bóng" là sai lầm trong cùng cơ chế.

## Bảng các tập
| Mã video | Tên tập | Thời lượng mục tiêu | Thông điệp chính |
|---|---|---|---|
| BONG-DA-T29-E01 | Ai lấp ô hậu vệ? | ≈ 57,7 s (ngân sách; đo lại sau TTS, chuẩn 45–75 s) | Hậu vệ dâng cao thì ô sau lưng do người gần ô nhất lấp (không phải người gần bóng nhất); vị trí là nhiệm vụ; đội thường để sẵn người phía sau bóng; nhìn ô, đừng nhìn tên vị trí. |

## Phong cách hình ảnh
Đồ hoạ phẳng 9:16 (1080×1920), sa bàn nhìn từ trên: chấm tròn (không mặt, không số áo, không đội thật), ô lưới bo tròn, mũi tên. Vùng an toàn chữ y∈[~250, ~1500]; header y≈250–320; sa bàn **y≈420–1320** (cao 900 px, vật chính ≥ 560 px, R5); phụ đề dải dưới y≈1340–1500 (lớp riêng); Cáo đáy ≲ y 1290.

**Lưới sa bàn (gợi ý bố cục cho storyboard, tọa độ gần đúng):** lưới 6 cột × 6 hàng, ô 150 px, gốc (90, 420). Tâm cột x = 165 / 315 / 465 / 615 / 765 / 915; tâm hàng y = 495 / 645 / 795 / 945 / 1095 / 1245. Hàng trên là phía khung thành đối phương (vòng cấm mờ ở cột 2–5, hàng 1–2). Chấm đội ta: hậu vệ cánh (HV), tiền vệ cánh (TVC), tiền vệ giữa (TVG), hai trung vệ (TV1, TV2); chấm đối phương: DP (tím xám). Ô hở thứ nhất: cột 6 hàng 4 (915, 945); ô hở thứ hai: ô TVC rời đi, cột 5 hàng 3 (765, 795). Toàn bộ là **hình khối ví dụ dựng**, không số áo, không đội/giải thật, không ảnh người.

**Bộ nền (không dồn quá ~40% thời lượng vào một nền; R12):** mọi nền là màu/gradient, đồ hoạ vẽ bằng renderer (không cần ảnh Gemini).
| Nền | Dùng ở | Mô tả |
|---|---|---|
| N1 Sân nhìn từ trên (toàn lưới) | S01, S02, S03, S05, S06, S09 | mặt sân xanh đậm phẳng, vạch sân mờ, vòng cấm ở trên, lưới ô mờ chỉ hiện khi cần |
| N2 Sa bàn tối, cận ô (zoom 1,3× vào cột 4–6, hàng 2–5) | S04, S07 | navy tối, ô lưới nổi, các chấm liên quan; S04 hiện tên vị trí mờ đi, S07 hai đường chạy |
| N3 Sân nhìn từ trên, thế "đang tấn công" (trước lúc mất bóng) | S08 | cùng sân N1 nhưng ở thế bóng đang trong tay đội ta, dải sau bóng được tô mờ |
| N4 Sa bàn thu nhỏ trên nền gradient ấm tối | S10 | sa bàn còn ≈ 620 px (y≈650–1270), chừa dải trên cho chữ chốt |
Tỉ lệ: N1 = 3,3 + 4,3 + 5,0 + 8,0 + 6,4 + 6,0 = 33,0 s ≈ 57% (**vượt ngưỡng 40% nên tách bằng đổi bố cục và cỡ cảnh**: S01 toàn sân + hook, S02 toàn sân thêm mũi tên, S03 trung cảnh bám TVC và ô, S05 trung cảnh hai ô nối tiếp, S06 toàn sân với hai mũi tên cam, S09 toàn sân quay lại bố cục S01; không quá 4 cảnh liền cùng nền: S04 đổi sang N2 chen giữa). N2 = 6,0 + 6,0 = 12,0 s ≈ 21%; N3 = 6,9 s ≈ 12%; N4 = 5,8 s ≈ 10%. Ghi chú R12: một "nền" ở đây là một sân nhìn từ trên với khung bố cục khác nhau; nếu QC thấy đơn điệu, S06 chuyển sang N2.

**Màu và bảng nghĩa màu (dùng nhất quán):**
| Màu | Hex | Nghĩa |
|---|---|---|
| Đỏ | `#E5484D` | **ô hở / nguy hiểm** (chớp khi chưa có người lấp) |
| Xanh lá | `#2ECC71` | **ô đã có người lấp** (an toàn); chỉ dùng cho nghĩa này |
| Vàng | `#F4B400` | đang xét / dấu hỏi / "không ai chắc ai lấp" |
| Cam Cáo | `#F28C28` | nhấn: **đường chạy đúng** của người gần ô nhất, vòng khoanh người được chọn, Cáo |
| Xám xanh mờ | `#8E9BAA` | **đường chạy sai/chậm** (nét đứt, vòng ra sau), nhãn tên vị trí khi mờ đi |
| Trắng-cyan | `#7DF9FF` | **ba sợi nối quanh ô hở** (tam giác, căng rồi chùng); chỉ ở S03 và S07 |
| Tím xám | `#7C6FA8` | đối phương (chấm và mũi tên lao vào ô) |
| Xanh dương | `#3B82F6` | đội ta (chấm, trạng thái trung tính) |
| Navy nền / trắng chữ | `#101B2E` / `#FFFFFF` | nền tối / chữ chính |

**Font và cỡ chữ:** Segoe UI Bold. Chữ khoá ≤ 3 từ, ≥ 72 px; nhãn ≥ 56 px; header ≥ 52 px (đủ lớn, đổi ô); tối đa 3 nhóm chữ đồng thời ngoài phụ đề. Phụ đề 52–60 px, ≤ 2 dòng, ≤ 28 ký tự/dòng, dải dưới, lớp riêng, không tính là visual.

**Chip chương (R7):** video ≈ 58 s, một mạch nên **không dùng chip chữ** (Y1).

## Opening và Header (R14, D8)
- **Tiêu đề opening:** `AI LẤP Ô TRỐNG?` (hiện 5,24–7,60 s, trong S02, animation vào một lần, topic reveal, kinetic có chủ ý, vùng y≈260–380 phía trên sa bàn). Opening = S01 + S02 = **7,60 s** (trong trần 1–8 s), ba pha: `visual_hook` (S01: HV lên sát vòng cấm, ô sau lưng chớp đỏ) → `conflict` (S02 đầu: bóng mất, mũi tên tím lao vào ô trống) → `topic_reveal` (tiêu đề). Kiểu `incident`, có lời hook (lời vào ≥ 0,6 s).
- **Header xuyên suốt S03–S10:** `BÓNG ĐÁ / TỔNG LỰC`, y≈250–320, đổi ô theo cảnh (S03 trái, S04 giữa, S05 phải, S06 trái, S07 giữa, S08 phải, S09 trái, S10 giữa); opening không có header. Sa bàn bắt đầu y=420 nên không đè.
- Chữ do text engine vẽ; nguyên văn ở cột "Chữ trên màn hình" của script, kèm lý do.

## Bản đồ Cáo (Y2–Y3)
| Cảnh | Cáo | Mốc | Hành vi · cỡ · vị trí |
|---|---|---|---|
| S01 | không | — | hệ quả nằm trên sa bàn (ô đỏ chớp); dành toàn khung cho sân |
| S02 | có · `surprised` | 3,45–6,45 s | nhìn ô đỏ, giật mình rồi đứng nhìn; ≈ 16% khung (≈ 170 px rộng), x≈90, đáy y≈1290, góc dưới trái sa bàn nơi không có chấm (cột 1, hàng 5–6) |
| S03–S06 | không | — | nhường hình cho sa bàn, chuỗi bù ô và sai lầm |
| S07 | có · `idea` | 36,55–38,75 s | nhịp chuyển ý "Lấp ô: gần ô, đừng gần bóng."; ≈ 16%, x≈90, đáy y≈1290; không che chấm A |
| S08–S09 | không | — | nhường hình cho thế đang tấn công và chiếu lại pha |
| S10 | có · `thumbs_up` | 54,64–57,04 s | nhịp kết; ≈ 17% khung, x≈90, đáy y≈1290, hướng về người xem; chữ chốt ở y≈390–600 không bị che |
Tổng thời gian có Cáo ≈ 3,00 + 2,20 + 2,40 = 7,60 s ≈ **13,2%** (≲ 15% theo D8, < 25% theo Y2). Đổi dáng cách nhau ≥ 2 s. Cáo không nhép miệng; chỉ nhìn/chỉ vào vật.

## Âm thanh (R25, `docs/asset-sources.md`, `tools/audio/sound-design.json`)
Giọng TTS theo `docs/voice.md`; `[dẫn]` cao hơn T8 ≈ 13–18%, `[kỹ thuật]` ≈ 7–12% (trần `atempo` 1,20), **đo lại sau TTS rồi chỉnh**, nghỉ theo ý không đều. **Không nhạc** (mặc định tắt). SFX tự tổng hợp nhỏ hơn giọng: "vút" mềm khi mũi tên tím lao vào ô, "tick" khi nhãn hiện hoặc khi ô chuyển xanh, "tụp" khi tên vị trí mờ đi, "ting" khi đường chạy cam chạm ô, "pop" nhỏ khi tiêu đề/chữ chốt hiện. Không còi báo động (đã bỏ theo phản biện), không tiếng khán đài, không tiếng còi trọng tài. Khoảng nghỉ dài đi cùng đổi hình/chuyển cảnh (ghi ở script).

## Quy tắc phụ đề
Phụ đề là lớp accessibility riêng, chép đúng lời đọc, chính tả chuẩn có dấu; không tính là visual. Không số trong lời (viết số bằng chữ nếu có); chữ trên hình không chép lời.

## Bản đồ Y/R chính (tóm tắt, chi tiết ở script)
- **Y5/R1–R2:** tình huống ở 0 s, hệ quả (mũi tên tím lao vào ô) trước 5,0 s (3,95–4,9 s), câu hỏi mở 0,6 s và 5,24 s, ích lợi sớm 8,65 s.
- **R13:** 10 cảnh, trung bình 5,8 s, không cảnh nào dưới 3,3 s (S01 là hook); opening 7,6 s; một cảnh High (S05, 8,0 s, giữ 2,03 s).
- **Trạng thái sự cố (R11) đổi ≥ 3 lần rồi kết trả đúng chỗ:** *ô sau lưng hậu vệ (cột 6 hàng 4)*: **đỏ chớp** (0,00 s) → mũi tên tím lao vào (3,95 s) → **xanh** khi TVC lùi vào (11,10 s) → [ô thứ hai cột 5 hàng 3 **đỏ** (20,11 s) → **xanh** (23,64 s)] → ô thứ nhất **đỏ lại** khi hai người cùng lao ra (29,24 s, sai lầm) → **xanh** (36,0 s, đường chạy đúng) → quay lại khung hook: mũi tên tím vào ô nhưng ô **xanh**, mũi tên bị chặn (49,27–50,43 s). Kết trả đúng chỗ.
- **Trước/sau, đúng/sai:** S06 (hai người cùng lao ra, ô đỏ) ↔ S03 (một người lùi, ô xanh); S07 (đường vòng nét đứt xám xanh ↔ đường thẳng cam); S08 (trước khi mất bóng đã có người sau bóng, ô xanh ngay từ đầu) ↔ S01 (ô đỏ); S09 (cùng bố cục S01: trước ô đỏ, sau ô xanh).
- **R15 chiều sâu, D7 bản đồ ngữ nghĩa, R22 kinetic:** ở script (kinetic ở S02 tiêu đề, S04 `NHIỆM VỤ`, S07 `GẦN Ô`, S10 `NHÌN Ô TRƯỚC`).

## Nguyên liệu cần
- Giọng TTS (`docs/voice.md`); Cáo PNG (`surprised`, `idea`, `thumbs_up`); đồ hoạ vẽ bằng renderer: sân nhìn từ trên, vòng cấm mờ, lưới ô, chấm đội ta, chấm đối phương, bóng, mũi tên, đường chạy (liền/nét đứt), ba sợi cyan, chip chữ.
- Không cần ảnh Gemini (nền màu/gradient và vẽ). Nếu Đạo diễn hình ảnh vẫn muốn ảnh nền sân: brief ở cuối `script.md`.
- Không clip, không ảnh cầu thủ/áo đấu/logo, không nhạc ngoài.

## Cần giám đốc cung cấp
Không có. **Việc giám đốc nên làm trước khi đăng:** (1) nghe thử cách đọc "bóng đá tổng lực", "tiền vệ cánh", "đá phủi" (CHƯA KIỂM); (2) cân nhắc câu "Bóng đá tổng lực nhìn vị trí như nhiệm vụ" ở S04: là cách diễn đạt rút gọn từ định nghĩa chung (cầu thủ thế chỗ nhau để giữ cấu trúc đội), không phải trích nguyên văn một nguồn; nếu muốn chặt hơn có thể đổi thành "Ý của bóng đá tổng lực: ai rời chỗ thì đồng đội thế vào" (cùng số âm tiết).

## Giả định đã chọn (chạy nền, không hỏi lại)
1. **Một pha cánh phải** làm ví dụ xuyên suốt, ghi "trong pha này"; người lấp ô ở S03 là tiền vệ cánh, không nói "tiền vệ luôn là người lùi". Câu nguyên tắc ở S04 và S07 là "ai gần ô nhất thì làm".
2. **Mũi tên đối phương chỉ một mũi tên ngắn** (không đồng hồ, không ép sát), để video không thành "cách chống phản công".
3. **"Để sẵn người phía sau bóng" ở mức "thường"** (S08), chỉ nói đúng hướng của nguồn JSSM; không dùng thuật ngữ tiếng Anh "rest defence" trong lời hay trên hình, không nói "bản chất".
4. **Không nói bóng đá tổng lực do ai/thời nào**; không nói đội nào đang đá. Tín hiệu "hà lan" trong gói tín hiệu không dùng.
5. **Số trong lời:** không có số liệu; "một ô", "hai người" là đếm trong ví dụ dựng.
6. **Tên vị trí:** dùng "hậu vệ", "tiền vệ cánh", "tiền vệ giữa" (tiếng Việt thường); không viết tắt HV/TVC trên hình (HV/TVC/TVG/TV1/TV2/DP chỉ là mã nội bộ của plan).

## Ngân sách thời lượng (tập BONG-DA-T29-E01)
Hệ số: ≈ 4,3 âm tiết/s giọng; không có thuật ngữ tiếng Anh (không +1); mỗi cảnh = max(lời + nghỉ, tối thiểu 3/5/8 s theo độ phức tạp + giữ sau lời). Chi tiết từng cảnh ở `ep01/script.md`.
| Đoạn | Nhãn | Âm tiết | Tốc độ | Giây đọc | Nghỉ Y7 + giữ | Đuôi | Tổng |
|---|---|---|---|---|---|---|---|
| S01–S02 opening | dẫn | 17 | 4,3 | 3,95 | 3,65 | 0 | 7,60 |
| S03–S07 giải thích + sai lầm | kỹ thuật | 87 | 4,3 | 20,23 | 11,17 | 0 | 31,40 |
| S08 bổ trợ (để sẵn người sau bóng) | kỹ thuật | 22 | 4,3 | 5,12 | 1,78 | 0 | 6,90 |
| S09–S10 kết | dẫn | 31 | 4,3 | 7,21 | 3,99 | 0,60 | 11,80 |
| **Tổng** | | **157** | | **36,51** | **20,59** | **0,60** | **≈ 57,7** |
Trong 45–75 s và gần mục tiêu 55–65 s. Quá 72 s sau TTS thì rút giữ S04/S05/S08 về mức tối thiểu, không tăng tốc để bù.

## Tiêu chí nghiệm thu (đo được)
- Thời lượng 45–75 s (mục tiêu ≈ 58 s), 1080×1920, 9:16, có phụ đề.
- Hook: tình huống thấy từ 0 s (ô đỏ chớp); mũi tên tím lao vào ô trước 5,0 s; câu hỏi "Ai giữ nhà?" ở 2,0 s.
- Opening ≤ 8,0 s với tiêu đề `AI LẤP Ô TRỐNG?`; header `BÓNG ĐÁ / TỔNG LỰC` từ S03 đến hết, không đè.
- Mỗi lúc chỉ **một** ô sáng mạnh (S05: ô thứ nhất đã xanh dịu khi ô thứ hai chớp đỏ); sa bàn nhìn ra được ở 360×640.
- Có chữ `TRONG PHA NÀY` (S03) và lời "Trong pha này" (lời 03).
- Không có tên thật của bốn nền tảng, không logo, không ảnh/tên cầu thủ, đội, giải thật, không nhãn "Ví dụ dựng"/"AI" trên hình; không nói ai phát minh; không nói đội nào đang đá tổng lực.
- `publish.json` cho ba nền tảng, mô tả có câu khai báo AI và ghi "ví dụ dựng".
- Trạng thái ô đổi ≥ 3 lần và trả đúng chỗ ở S09; Cáo ≲ 25%.

## Rủi ro và dự phòng
| Rủi ro | Dự phòng |
|---|---|
| Hiểu "tiền vệ luôn là người lùi" hoặc "luật chung" | lời 03 và chip `TRONG PHA NÀY`; lời 04/10 nói nguyên tắc "ai gần ô nhất thì làm" |
| Hiểu "ai cũng chạy tự do" | lời 04 "nhìn vị trí như nhiệm vụ", không nói "không có vị trí" |
| Lệch sang pressing/phản công | chỉ một mũi tên tím ngắn, không đồng hồ, không đuổi bóng; thông điệp chốt là "ai gần ô thì lấp" |
| Trên khung dọc hai ô cùng sáng gây rối | một ô sáng mạnh mỗi lúc; ô đã lấp chuyển xanh dịu; S05 chia hai nhịp nối tiếp |
| Ba sợi tam giác thành rối | chỉ ở S03 và S07, mỗi lần đúng ba sợi, nét mảnh, căng rồi chùng |
| Câu "đội thường để sẵn người phía sau bóng" bị hiểu tuyệt đối | dùng "thường", không "luôn", không gắn đội/thời kỳ; nguồn JSSM ghi chưa có định nghĩa chung |
| Nền N1 chiếm ≈ 57% | tách bằng cỡ cảnh và bố cục; S04 chen N2; nếu QC thấy đơn điệu, S06 chuyển N2 |
| Nhầm "gần bóng" và "gần ô" | S07 đặt hai đường chạy cạnh nhau, nhãn `GẦN BÓNG` và `GẦN Ô` gắn đúng chấm |

## Nguồn (tóm tắt, chi tiết cuối script.md)
1. Wikipedia, "Total Football" (đã mở 21/11/2026): "any outfield player can take over the role of any other player in a team"; "A player who moves out of his position is replaced by another from his team", giữ "the team's intended organizational structure". Cơ sở cho lời 04 (vị trí là nhiệm vụ) và ý "thế chỗ".
2. Journal of Sports Science and Medicine, "rest defence" (jssm.org/jssm-22-707, đã mở 21/11/2026): rest defence là "the positioning of the deepest defenders during ball possession"; "there is no scientific and generally accepted definition of rest defense in soccer." Cơ sở cho lời 11 ("đội thường để sẵn vài người phía sau bóng khi đang tấn công").
3. Squawka và Coaches' Voice (ideator-b đã mở theo `debate.md`; Kịch bản chưa mở lại được Squawka do 403). Chỉ là nguồn phụ.
