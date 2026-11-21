## NGỮ CẢNH

- **Vòng N = 1** (bản đầu, chưa có review trước). Gemini làm thay Codex (giám đốc duyệt); Claude review và là người duy nhất duyệt. Chỉ ghi `status: "DRAFT"`.
- team_id: 6 (Bóng Đá · Đội 1). Chủ đề #29: "Bóng đá tổng lực: khi hậu vệ dâng lên tấn công thì ai lấp vào chỗ trống phía sau?"
- video_id: `BONG-DA-T29-E01` → thư mục `ep01`. 1 tập, chuẩn 45–75 s, kịch bản đã DUYỆT ≈ 57,7 s, 10 cảnh (S01–S10; opening = S01–S02, 7,6 s, có lời hook), 9:16 1080×1920.
- Nguồn sự thật cho lời thoại và thời lượng là `script.md` đã duyệt (Lời 10: "Lấp ô: gần ô, đừng gần bóng."). Không đổi chữ lời đọc, không đổi tổng thời lượng, giữ đúng `scene_id` và `line_id` của kịch bản.
- Đọc thêm: `concept.md`, `plan.md` (bảng nghĩa màu, bản đồ Cáo, nền N1–N4, Bản đồ ngữ nghĩa), `review/script-r1.md`, schema storyboard, `docs/chat-luong-xem.md`, `docs/mascot.md`, `docs/motion-components.md` và các component thật của renderer.
- Lưu ý riêng của video này:
  - Hình chính là **sa bàn bóng đá nhìn từ trên**: lưới ô, chấm tròn hai đội, mũi tên, ô đổi màu đỏ → xanh, ba sợi tam giác (chỉ S03, S07). Kiểm xem component Remotion có sẵn có vẽ được không; không thì chọn `renderer: "pillow-ffmpeg"` kèm `renderer_reason` cụ thể.
  - Mỗi lúc **chỉ một ô sáng mạnh**. Chữ `TRONG PHA NÀY` bắt buộc có ở S03.
  - Nền N1 đang chiếm ≈ 57% thời lượng theo plan (vượt ngưỡng 40% của R12): hãy tách bối cảnh/khung bố cục (N1–N4 trong plan, đổi cỡ cảnh, đổi góc) để đạt R12, không đổi lời.
  - Mọi chữ trên hình chép đúng cột "Chữ trên màn hình" của script; không thêm chữ khác, không chép lời thoại vào `texts`/`text_overlay`.
  - Mỗi cảnh sau opening khai `header_slot`; điền đủ `main_change`, `text_groups`, `complexity`, `main_idea`, `concepts`, `hold_after_voice_s`, `semantic_plan`, `scene_kind`/`kind_params`, `sound_cues` (kèm `reason`; `silence` cần `duration_s`), `voice_direction` theo `line_id`, `opening` (`style`, `style_params`, `phases`, `voice_line`), cấp storyboard `renderer` + `renderer_reason`, `header`, `captions`.
  - Cấm: ảnh cầu thủ, áo đấu, logo, tên đội, tên người; không đồng hồ đếm; không đốt nhãn «AI tạo»/«Ví dụ dựng» lên hình; không khẳng định ai "phát minh" lối chơi hay đội nào "đang đá tổng lực".
  - Tuân thủ luật tên nền tảng (không viết tên thật bốn nền tảng ở bất kỳ chữ nào người xem thấy).
