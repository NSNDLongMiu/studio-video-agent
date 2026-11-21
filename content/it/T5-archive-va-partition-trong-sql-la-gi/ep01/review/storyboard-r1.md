# Review storyboard IT-T5-E01 — vòng 1 (Claude, Đạo diễn hình ảnh)

## Bảng chấm

| # | Tiêu chí | Kết quả | Ghi chú |
|---|---|---|---|
| 1 | Show, don't tell | Đạt | 18/18 cảnh `has_real_illustration`, mỗi cảnh một tiêu điểm. Chữ trên hình khớp từng cột «Chữ trên màn hình» của script (L1–L3, L5–L7, L10–L12, L13–L17); L4, L8, L9, L18 không có chữ như script. Cỡ 72/56 px đúng, tối đa 3 nhóm (L6, L12, L16). Vật chính hộp bao 610–670 px, đạt R5. |
| 2 | Đa dạng, R4, Y4 | Đạt (có góp ý nhỏ) | Không có 3 cảnh liên tiếp cùng bố cục và cỡ cảnh. Khoảng cách giữa hai đổi hình lớn nhất khoảng 1,3 s (L11, L15), không có đoạn tĩnh > 2 s nên không cần `hold_reason`. Cáo không đứng nói. `environment` có đủ xa/giữa/gần, ánh sáng, chuyển động; office → incident → database → office đúng plan. |
| 3 | Khớp kịch bản | Đạt | Tổng `duration_s` = 41,96 s; ranh giới 18 cảnh trùng bảng script. Các mốc nội bộ đã đối chiếu và khớp (5,70/6,55/7,35, 10,90/11,65/12,35, 14,05, 21,68, 27,85, 31,01, 33,15, 37,22/37,30/37,50, 38,45, 40,00/41,00, đuôi 0,70 s ở L18). Vạch chỉ gắn kho chính, giữ đỏ ở L1–L15, hạ ở khoảng 37,50 s, sau khi khay gốc rời biên kho chính ở 37,30 s. Cáo có ở mở/giữa/kết (0–4,37 / 17,77–22,48 / 37,82–41,96 = 13,22 s, 32%); dáng `surprised`, `point_up`, `thumbs_up` đều có thật trong `brand/cao/poses/`; không nhép miệng, không xoay, rộng 210–220 px (khoảng 19–20%); phụ đề nằm trên đầu Cáo. Chip R7 viền sáng ở 0 / 5,17 / 26,49 s. |
| 4 | Dựng được | Đạt | `renderer: "pillow-ffmpeg"` kèm `renderer_reason`. Đã đối chiếu `studio/renderer-remotion/src/scenes/*` và `orchestrator.mjs`: `ExplainerScene` nền cố định `#161a26`, chỉ dãy ô/mũi tên; `UiSimulationScene` chỉ IDE/banner; `object_interaction` chưa có composition trong `SCENE_TO_COMPOSITION`. Không biểu đạt được thẻ bật khỏi khe, vạch gắn kho, hai vỏ kho độc lập hay chuyển nền theo ngữ cảnh, nên chọn Pillow+FFmpeg là đúng, không hạ thành thẻ chữ. Producer đi thẳng đường này, không chạy `producer.mjs`/`orchestrator.mjs`. |
| 5 | Đúng schema | Đạt | `scene_type`, `camera.shot`, `camera.movement`, `transition` đều đúng enum. Mọi cảnh có `main_change`, `text_groups`, `quality_check.text_repeats_voiceover` (false) và `change_visible_at_360` (true). Cấp storyboard có `renderer` và `renderer_reason`. Không thêm trường lạ. |

Kiểm riêng theo yêu cầu: lời khớp script.md; khay giữ nguyên 132×58 px khi chia (L4–L9); dung lượng chỉ có một vạch gắn kho chính, hạ sau khi bỏ bản (L16); dáng Cáo có thật. Đạt.

## Góp ý không chặn (Producer xử lý khi dựng, không cần vòng sửa)

1. **Dấu thẻ ở 360×640 (L8, L14, L18).** Thẻ 132×58 px còn khoảng 44×19 px và dấu 27 px còn khoảng 9 px. Khi dựng, kiểm ở 360×640. Nếu tam giác/vuông/tròn khó phân biệt thì tăng dấu (hoặc tăng viền ghép) mà không đổi cỡ thẻ, vì đổi cỡ thẻ trái với ý "không nén".
2. **L8 vị trí dải đối chiếu.** Script ghi "bên cạnh ba khay", storyboard xếp bên dưới (hai mảng trên/dưới). Chấp nhận nếu hộp bao ≥ 560 px và chín cặp vẫn đọc được; đừng thu nhỏ khay để nhường chỗ.
3. **L17 mốc tắt nhãn.** Sự kiện `t: 1.14` ghi tắt dải trạng thái đúng 39,16 s; theo mốc cảnh thì 39,16 s ứng với `t` 1,34. Producer lấy mốc tuyệt đối 39,16 s.
4. **Y4, nền database kéo dài** từ L4 đến L16 (khoảng 65% thời lượng) với đoạn mô tả `environment` giống nhau. Đúng plan (3 nền) nên không chặn, nhưng khi dựng nên đổi seed/độ sáng nhẹ giữa phần chia bảng (L4–L11) và phần kho lưu/khoá (L12–L16) để thấy ngữ cảnh đổi, giữ nguyên hướng sáng.
5. **R3.** «đã chuyển sang kho lưu» (5 từ) và «Tuỳ hệ quản trị» (4 từ) vượt 3 từ nhưng là nhãn 56 px lấy đúng từ cột script nên chấp nhận; giữ ≥ 56 px và không thêm nhóm thứ tư.
6. Sau đo TTS, duyệt lại mốc theo quy trình; không tăng tốc hay dồn nghỉ để bù. Phát âm Partition/query/Archive/PostgreSQL vẫn «CHƯA KIỂM — giám đốc nghe».

KẾT LUẬN: DUYỆT
