# Báo cáo nâng cấp pipeline — giọng, âm thanh, opening, mẫu cảnh, QC (20/11/2026)

Nguồn lệnh: giám đốc, sau khi xem `IT-T14-E01_9x16.mp4`. Mục tiêu: sửa gốc pipeline để mọi video sau được hưởng, không chỉ sửa tay T14. Quyết định kèm theo: nhạc mở lại nhưng **tự tổng hợp, mặc định tắt**; opening **1–8 s (mục tiêu 5–8 s)**, có thể có lời hook; làm thẳng trên `main`.
Tình trạng: **chưa commit**. Chưa ai NGHE hay XEM bản dựng ở tốc độ thật — mọi mục cảm nhận ghi "CHƯA KIỂM".

## A. Nguyên nhân gốc

| Triệu chứng | Nguyên nhân gốc | Ở đâu |
|---|---|---|
| Nghỉ đều như công thức | `gen_vo.py` chỉ nhìn ký tự cuối câu (`,` `.` `?`) để chọn nghỉ cố định; không có ý định/ngữ nghĩa trong dữ liệu. Ở T14 còn tệ hơn: nghỉ do **bố cục cảnh** quyết định (giọng bị xếp vào mốc vẽ tay) | `studio/renderer-remotion/scripts/gen_vo.py`, `_scratch/assemble_d8.py` |
| Không nhấn, không khác biệt hỏi/giải thích/cảnh báo | Không có `intent`/`emphasis`/`pace`; engine VieNeu Turbo **không hỗ trợ SSML, cao độ, cảm xúc** (chỉ giọng, temperature, tempo, tách đoạn, chèn nghỉ) | engine; schema |
| Không dựng lại được một dòng | Không có cache theo dòng, không có `--only` | `gen_vo.py` |
| Thiếu âm thanh bổ trợ | Không có mixer, thư viện SFX, bảng cue; SFX của T14 là sóng sin viết tạm ở −52 dBFS để lọt ngưỡng im của QC | `_scratch/finish_d8.py` |
| Opening chỉ 1–3 s | Giới hạn cứng ở schema, `header.py`, `scene-metrics.mjs`, `qc-measure.mjs` và luật R14/R20/D3/D8 | nhiều nơi |
| Cảm giác "slide infographic" | Header bắt buộc mọi cảnh (R21) + chỉ 6 giá trị `scene_type`; 24/28 camera tĩnh; mọi "đồ dùng" giàu hình nằm trong mã vẽ riêng của tập, không dùng lại được | `draw_episode.py` |
| QC không bắt được | Ngưỡng gõ cứng, không đo theo stem, không kiểm đè/an toàn/đồng bộ SFX, không có danh sách "cần người duyệt" dạng máy đọc | `qc-video.mjs`, `qc-measure.mjs` |

## B. Đã thay đổi (chưa commit)

- **Luật & schema**: `tools/config/pipeline-rules.json` (+ `rules.mjs`/`rules.py`) là nguồn duy nhất cho giới hạn opening, camera, vùng an toàn; `studio/schema/storyboard.schema.json` mở rộng (`voice_direction`, `sound_cues`, `scene_kind`, `kind_params`, opening `style/phases/voice_line`); storyboard cũ vẫn hợp lệ.
- **Voice Director** `tools/voice/`: `prosody.mjs` (lập kế hoạch theo ý định hook/explanation/warning/question/reveal/conclusion; nghỉ theo ngữ nghĩa, không random; timeline `free`/`fit`), `assemble.py` (ghép, đệm đầu/đuôi R23, kiểm chồng lấn), `prosody_metrics.py`, `gen_vo.py --plan --only` (cache theo dòng). Nói thật về engine: ngữ điệu/cảm xúc chỉ ghi dạng "advisory".
- **Sound Design** `tools/audio/` + `library/sfx/`: 27 SFX tự tổng hợp (CC0), `cuesheet.py` → bảng cue `sound-cues.json/.md` (thời điểm, lớp, lý do, dB, nguồn), `mix.py` bốn lớp có stem riêng, ducking, limiter giọng, nhạc tự tổng hợp mặc định tắt (đặt −20 LU so với giọng theo đo đạc).
- **Opening & hình** `tools/motion/`: `opening.py` (5 kiểu × 3 pha), `scene_kinds.py` (8 mẫu), `props.py`/`backdrops.py`/`layouts.py`/`overlaps.py`, camera có `reason` và vùng an toàn, nhật ký dựng có `cue`/`phase`/`camera`/`layout`.
- **QC** `tools/qc-measure.mjs`, `scene-metrics.mjs`, `qc-thresholds.json`: ba nhóm Audio/Visual/Narrative; mục cảm nhận là **CHƯA KIỂM** và nằm trong `needs_manual_review`; `final_pass_allowed` luôn `false`.
- **Tài liệu & vai trò**: R24–R28 ở `docs/chat-luong-xem.md`; đã đổi mọi chỗ "không nhạc nền"/"opening 1–3 s"; mô tả vai trò ở `CLAUDE.md`, `AGENTS.md`, `db.mjs`, skill/agent.
- **Test**: 250/250 đạt trên máy rảnh (lúc nhiều việc song song có 8–10 ca Python quá 90 s do tải).

## C. Trước / sau (đo trên chính các file video)

| Chỉ số | T14 gốc | v2-A (cả video, chạy lại) | v2-B (35 s, giọng quyết định thời lượng) |
|---|---:|---:|---:|
| Thời lượng | 180,63 s | 180,63 s | 35,03 s (lời 15–28) |
| Opening | 1,0 s, im, tiêu đề tĩnh | 6,35 s, 3 pha (2,03/2,53/1,78), có lời hook, nền phòng làm việc | 5,93 s, 3 pha, tiêu đề hiện 1,8 s |
| Nghỉ giữa dòng, trung vị / độ lệch chuẩn / lớn nhất | 1,02 / 0,64 / 2,97 s | **1,27 / 0,68 / 3,25 s** | **0,52 / 0,47 / 1,49 s** |
| Nghỉ theo ý định (trung vị) | giải thích 0,97; câu hỏi 1,42; cảnh báo 0,55 | giải thích 1,22; câu hỏi 1,49; cảnh báo 0,71 | giải thích 0,43; câu hỏi 1,43; cảnh báo 1,49; kết luận 0,85 |
| Stem giọng riêng | không | −16,4 LUFS | −16,4 LUFS |
| Bản trộn LUFS / true peak / clip | −15,8 / −1,6 dBTP / – | −14,2 (AAC −15,4) / −2,0 dBTP / 0 | −14,2 / −1,8 dBTP / 0 |
| SFX | 7, sóng sin tạm | 10, có lý do, ≤ 5 trong 60 s, cùng hiệu ứng cách ≥ 18 s, 1 impact | 3,4/phút, cue khớp hình ≤ 0,001 ms (2/3 bắt được trên stem) |
| Nhạc | không | tuỳ chọn: −20,0 LU ngoài lời, −28,2 LU trong lời | tuỳ chọn |
| Loại cảnh | 6 `scene_type`, 24/28 camera tĩnh | giữ nguyên thân bài | 6 loại cảnh, 6 bố cục, không lặp liền kề |
| QC `qc-measure` | (không đo được phần mới) | 0 lỗi, 153 cảnh báo | 0 lỗi, 13 cảnh báo, 26 mục chờ người duyệt |

**Đọc thẳng các số:** retrofit v2-A **không cải thiện** nghỉ (còn dài hơn một chút) vì T14 vẽ tay theo mốc giọng cũ; QC báo 54/60 khoảng nghỉ lệch kế hoạch. Chỉ cách làm v2-B (giọng quyết định thời lượng cảnh) cho nghỉ biến thiên theo ngữ nghĩa. Khuyến nghị: tập mới dựng theo cách v2-B, không retrofit.

## D. Video kiểm chứng (`content/it/T14-*/ep01/assets/_scratch/`)
- `v2/out/IT-T14-E01-v2-nomusic_9x16.mp4`, `…-v2-music_9x16.mp4` (đầy đủ, 5.419 khung, 1080×1920)
- `v2b/out/IT-T14-E01-v2b_9x16.mp4`, `…-v2b-music_9x16.mp4` (bản thử hình ảnh)
- Kèm: `sound-cues.md` (bảng cue), `README.md`, báo cáo QC (`qc-*/report/report.md`). Bản cũ ở `final/` giữ nguyên.

## E. QC — kết luận
- **Kỹ thuật: ĐẠT** cả bốn file (1080×1920, 30 fps, âm–hình lệch 0 ms, 0 mẫu clip, TP ≤ −1,5 dBTP, stem giọng −16 ± 1 LUFS). `qc-measure`: **0 lỗi**.
- **Không tự động ĐẠT (cần người):** độ tự nhiên/cảm xúc giọng, độ êm tai của nhạc/SFX/limiter, sức hút opening, logic mạch kể, nhịp xem. `final_pass_allowed=false`.
- **Chưa đạt tiêu chí tự đo:** (1) v2-A: 54 khoảng nghỉ lệch kế hoạch, 11 bbox chạm mép (cảnh cũ), 8 cue SFX cũ chưa gắn sự kiện hình; (2) v2-B: 4 cảnh báo ít chuyển động, 4 nhãn lệch cửa sổ lời (mức câu), và 54 cặp bbox giao nhau trong opening (biểu tượng tách nhánh/lớp tiêu đề) mà bộ dò đè vẫn báo.

## F. Còn lại / giới hạn
1. **Nhấn từ khoá**: 0/59 thực hiện được trên T14 — engine chỉ tách được đoạn ≥ 20 ký tự mà câu T14 ngắn. Chưa có giải pháp ngoài đổi engine/giọng.
2. **Limiter giọng** giảm tới ~5 dB đỉnh (crest 21,9 → 17,2 dB): có thể méo/bơm mà số đo không thấy → giám đốc nghe.
3. **Mẫu cảnh mới còn thưa hơn T14 vẽ tay** ở nền và đạo cụ phụ; thân bài v2-B dùng nền gradient trơn (mất lớp phòng làm việc); hai vế `before_after` còn gần giống nhau.
4. **Đồng bộ nhãn–lời chỉ ở mức câu** (không có mốc từng từ; cấm dùng ASR); camera/animation hook còn nhẹ (cảnh báo `low_motion`).
5. **T14 dài 180,63 s**, vượt trần 180 s của YouTube Shorts (có từ bản gốc; QC ghi `shorts_duration`).
6. Ngưỡng QC mới là "ngưỡng thử", cần hiệu chuẩn lại sau 3 video; chưa kiểm trên video của phòng khác.
7. Ghế Codex `b` đã dùng hết hạn mức ~18:57 (hồi 19:17); ghế `main` hết tới 23/11 14:37. Chưa chạy trên tài khoản nào khác (luật 8).

## Việc cần giám đốc
Nghe/xem bốn MP4 ở mục D; quyết bật nhạc hay không (`layers.music.enabled`); **khởi động lại** `npm run start --prefix studio` (có sửa `studio/src`); quyết có commit (đã `scan-public` sạch).
