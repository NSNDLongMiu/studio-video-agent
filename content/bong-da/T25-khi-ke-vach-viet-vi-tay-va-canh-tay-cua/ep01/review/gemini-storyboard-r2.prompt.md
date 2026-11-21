## NGỮ CẢNH

Gemini làm thay Codex (giám đốc duyệt 21/11/2026, Codex bận sản xuất). Claude review và là người duy nhất duyệt; bạn chỉ viết bản nháp, `status` luôn `DRAFT`.

- team_id: 6 (Bóng Đá · Đội 1)
- Chủ đề: "Khi kẻ vạch việt vị, tay và cánh tay của cầu thủ có được tính không?" (T25)
- video_id: BONG-DA-T25-E01, thư mục `ep01`
- Vòng: 2 (bản SỬA). Bản `storyboard.json` vòng 1 (DRAFT) đã có sẵn trong thư mục làm việc; **giữ nguyên mọi thứ đạt**, chỉ sửa đúng các điểm dưới đây. Review đầy đủ ở `review/storyboard-r1.md`.

Luật chủ đề giữ nguyên: không người/đội/giải thật, không logo, không năm, không nói về công nghệ đo hay độ chính xác của nó, không số đo; không viết tên thật bốn nền tảng mạng xã hội. Không đổi chữ lời đọc của `script.md`.

### Các điểm phải sửa (theo review r1)
1. **S00, `voice_direction` L01/L02 (bắt buộc):** lời mở vào ≥ 0,6 s (`opening.voice_start_min_s` = 0,6 trong `pipeline-rules.json`). L01 `pause_before_s` = 0,6 (thay 0,2), `pause_after_s` = 0,15 (thay 0,55); L02 giữ `pause_before_s` 0,15 để L02 vẫn bắt đầu ≈ 3,15 s. Mọi mốc `animation_timeline` của S00 (1,2 / 3,15 / 4,28 / 5,0) và tổng opening 7,8 s KHÔNG đổi. Ghi ở `opening.phases[0]` hoặc mô tả animation rằng lời vào ở 0,6 s.
2. **Cáo ≲ 15% thời lượng (bắt buộc, D8(d)):** bỏ Cáo ở S05: `character_action` = "" và xoá phần Cáo khỏi `environment` (bố cục lại cho cân bằng, vật chính vẫn ≥ 560 px). Chỉ còn Cáo ở S00 và S10 (~7,25 s ≈ 12,7%). Cập nhật mọi trường liên quan tới Cáo của S05 (pose, vị trí, cỡ…) cho nhất quán.
3. **S09 đổi `scene_kind` (bắt buộc)** để tránh ba cảnh liền `before_after` (S07–S09): dùng `problem_cause_consequence` với `kind_params`: `problem` = {label "", object "bóng trong lưới"}, `cause` = {label "", object "thẻ tay chuyển xám, đầu thân chân xanh sau vạch"}, `consequence` = {label "KHÔNG VIỆT VỊ", object "cờ hạ, chip xanh dương"}. Giữ nguyên `scene_type`, timeline, chữ. Đặt lại `repeats_previous_kind` của S08 và S09 đúng với giá trị mới (S09 = false).
4. **S04 thêm `hold_reason`:** "Giữ sơ đồ hoàn chỉnh 2,67 s (High): đáy nách, vai xanh, tay xám duỗi xa để so sánh trước khi sang cách nhớ; đốm sáng chạy dọc đường cam giữ mắt."
5. **S07 (khuyến nghị, nên làm):** khung hai ô dọc vào sớm 0,15 s (≈ 6,45 s) và nhãn `KHÔNG VIỆT VỊ` ở ô trên hiện 6,45–7,4 s (≥ 0,95 s); `hold_after_voice_s` 1,0 giữ nguyên.

Không cần đổi: `renderer` (pillow-ffmpeg), opening 7,8 s ba pha, header, chữ kinetic, mốc S03–S10, tổng 57,0 s.

Cập nhật `storyboard.md` cho khớp và thêm mục ngắn "Thay đổi vòng 2" liệt kê 5 điểm trên.
