# Audit T9 bản đầu (IT-T9-E01) — 19/11/2026 chiều

Giám đốc xem T9 và trả lại với bốn điểm: (1) giọng đọc mất chữ đầu ở các câu; (2) chưa có phần giới thiệu; (3) thông tin chính của video không xuất hiện xuyên suốt (cần page header đủ lớn, không chiếm nhiều chỗ, không đè thông tin quan trọng, đổi vị trí theo thời gian); (4) các đóng góp Visual-first không thấy trên hình. QC bản đầu (QC-THIẾT-KẾ, lượt 1) chỉ bắt nền lặp và header thấp, **bỏ sót cả bốn điểm trên**. Tài liệu này ghi đối chiếu từng yêu cầu với bằng chứng đo được, để sửa ở cấp luật chứ không chỉ sửa riêng T9. Mọi số đo lấy từ `qc-measure`, từ `storyboard.json`/`script.md` của tập và từ tệp tiếng; mục nào chưa nghe/chưa xem ghi CHƯA KIỂM.

## 1. Đối chiếu yêu cầu

| Yêu cầu của giám đốc | T9 bản đầu | Bằng chứng | Kết luận |
|---|---|---|---|
| **Opening 1–3 s riêng, sau đó mới hook** (yêu cầu T9 mục 5; nghiệm thu “có thumbnail động mở đầu”) | Không có cảnh opening riêng. Lời hook “Tổng đúng.” vào ở 0,000 s; tiêu đề chỉ là chữ kinetic đè lên cảnh hook S01 từ 0,10 s đến 2,0 s. | `storyboard.json` → `opening.animation`: “Hook từ t=0 … Không có plate riêng trước S01”; `voice-aligned` Lời 01 ở 0,00 s. QC lượt 1 đã coi S01 là opening. | **Không đạt.** Luật D3 chưa nói rõ “cảnh riêng, chưa có lời”. |
| **Header nhận diện chủ đề** (mục 6) → nay: xuyên suốt, đủ lớn, đổi vị trí | Header chỉ ở 3 cảnh (S09, S10, S20) = 10,7% thời lượng; storyboard ẩn ở 24/27 cảnh; chữ ≈ 62 px dạng pill nhỏ. | `qc-measure` “Thời lượng có header 10,675%”; `storyboard.header.hidden_scenes` 24 cảnh. QC chấp nhận vì luật D3 cho “ẩn được”. | **Không đạt** theo yêu cầu mới. |
| **Visual-first: keyword → hình + nhãn gắn đối tượng + kinetic chọn lọc** (bổ sung) | 19/27 cảnh không có một chữ minh hoạ nào. 17 mục chữ trong cả video, phần lớn là số (“2 + 3”, “5”, “0”). Các thuật ngữ có trong `semantic_plan` (plugin, mô tả công cụ, dòng ẩn, tool poisoning, rug pull, quyền tối thiểu, ghim phiên bản…) **không hiện thành nhãn**. Chỉ 1 chỗ kinetic (tiêu đề S01). Nhiều thành phần là khối trừu tượng không tên (QC-08, QC-03). | `storyboard.json` → `semantic_plan.texts` theo cảnh; `qc-measure` 14,1 từ/phút, 27,7% thời lượng có chữ, `kinetic_per_min` 0,37 (đúng 1 lần). Ví dụ DATABASE OVERLOAD/HIGH LATENCY của giám đốc không có tương đương. | **Không đạt** tinh thần yêu cầu, dù 0 chữ lặp lời. Luật D7 nói “không bắt buộc cảnh nào cũng có chữ” và “tối đa 1 kinetic/cảnh” nên không có sàn tối thiểu. |
| **Giọng tự nhiên, không nuốt chữ** (Audio QC mục 10) | Bản đầu **cắt từng câu ra khỏi tệp nhiều câu** bằng điểm `silence_end` (−40 dB) rồi fade-in 8 ms vào chỗ cắt. | Tại điểm bắt đầu 67 câu: 37 câu tăng từ im lặng lên mức lớn trong ≤ 5 ms (bắt đầu đột ngột); 63/65 câu bị cắt đuôi 65–200 ms âm dưới −40 dB (nhiều khi là phụ âm cuối). Tệp gốc VieNeu có đoạn tăng dần 15–35 ms. QC cũ ghi “không nuốt chữ: CHƯA KIỂM” và không có phép đo. | **Lỗi thật** (giám đốc nghe thấy); nguyên nhân khả dĩ nhất: cắt tại ngưỡng −40 dB + fade. Chưa xác nhận bằng tai. |
| Thời lượng ≈ 180 s (150–190 s) | 162,07 s. | `ffprobe`. Gỡ vướng chọn giảm `atempo` thay vì thêm nội dung. | Trong dải, thấp hơn mục tiêu ≈ 18 s. |
| Tốc độ đọc +10–15% so với T8 | 4,68 âm tiết/s (+11,8%). | `qc-measure` `audio.speech_pace_syll_s`. | Đạt (đo). Độ tự nhiên CHƯA KIỂM. |
| Information Pacing (giữ sau lời, cảnh tối thiểu) | Đạt các ngưỡng trừ S01 (2 s, là opening cũ). | `qc-measure` mục Information Pacing. | Đạt (đo). |
| Cáo: đầu, cuối, vài đoạn chuyển ý; nhỏ | 21,2% thời lượng (36,5 s), có mặt ở nhiều cảnh. | `storyboard.md` mục “Vùng chữ và Cáo”. | Trong ngưỡng 25% nhưng nhiều hơn “đầu/cuối/chuyển ý”; nên giảm khi làm lại. |
| Nền thay đổi theo chủ đề, không lặp | `security` 11 cảnh liền (45,5%), `code` 5 cảnh liền. | `qc-measure` M-33/M-34/M-35. | Không đạt (QC bản đầu đã bắt). |
| Không chữ lặp lời; phụ đề lớp riêng | 0 chữ lặp; phụ đề 56 px, dải dưới, 72% thời lượng. | `text_audit`. | Đạt. |

## 2. Nguyên nhân ở cấp pipeline

1. **Luật cho phép lỗi:** D3 cho header “ẩn được”; opening không bị buộc là cảnh riêng chưa có lời; D7 “không bắt buộc cảnh nào cũng có chữ” và “tối đa 1 kinetic/cảnh” không có sàn nên storyboard có thể không hiện nhãn nào mà vẫn “đạt”.
2. **QC đo kế hoạch, không đo thứ đã vẽ:** `text_audit` lấy chữ từ `storyboard.json`; không có nhật ký những gì renderer thật sự vẽ nên không biết nhãn có hiện, đè hay gắn đúng đối tượng.
3. **Không có phép đo âm ở ranh giới câu:** “nuốt chữ” luôn là CHƯA KIỂM; cách cắt câu của Producer (mã tạm trong `assets/_scratch/align_voice.py`) không có kiểm tra bảo toàn âm.
4. **Producer dùng mã tạm riêng cho giọng/ghép** thay vì thư viện chung → lỗi lặp lại mỗi tập.

## 3. Sửa (xem `docs/chat-luong-xem.md` D8, R20–R23)

- Opening riêng (R20); header xuyên suốt, đủ lớn, đổi ô, không đè (R21); keyword thật sự có chữ + kinetic có chủ ý, đo trên chữ vẽ thật (R22); toàn vẹn giọng đọc, cắt chỉ giữa khoảng lặng, có phép đo (R23).
- Công cụ: `tools/motion/` có nhật ký dựng `assets/render-log.json` và bộ đặt header theo vùng trống; `tools/voice/splice.py`; `qc-measure` thêm `voice_edges`, `opening`, `header` (theo nhật ký), `text_audit.render`.
- Làm lại T9 theo quy trình: storyboard sửa (opening riêng, ô header từng cảnh, nhãn/keyword thật, kinetic ≥ 1/25 s, nền đa dạng) → Đạo diễn hình ảnh duyệt → Sản xuất dựng lại + sinh lại giọng → QC (có số đo cho cả bốn điểm trên).

## 4. Điều vẫn CHƯA KIỂM
Phát âm, độ tự nhiên, nhịp nghỉ, tốc độ cảm nhận, có còn “mất chữ đầu” hay không sau khi sửa (chỉ giám đốc nghe được); đọc được cỡ header/phụ đề trên điện thoại; thẩm mỹ.
