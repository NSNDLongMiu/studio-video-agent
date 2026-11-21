# Review storyboard vòng 1 · IT-T14-E01 (Claude, Đạo diễn hình ảnh)

Đối chiếu `storyboard.json` (DRAFT, 27 cảnh, 179,65 s) với `script.md` (đã DUYỆT ở `review/script-r2.md`), `docs/chat-luong-xem.md`, schema, component trong `tools/motion/` (renderer pillow-ffmpeg) và `docs/mascot.md`.

## Bảng chấm

| # | Tiêu chí | Kết quả | Ghi chú |
|---|---|---|---|
| 1 | Show, don't tell + visual-first (D7) | Đạt | 27/27 cảnh `has_real_illustration`, đều có `semantic_plan` (keywords → form/object/motion, relations, hold_s). Chữ chỉ nhấn (≤ 2 nhóm/cảnh), kinetic chỉ ở opening S01. Chữ kỹ thuật (≈ 30 phút, Featured, Mọi trang, Trang đã chọn, Cấp tạm, Gửi mới/Bản cũ, Hội thoại/Địa chỉ tab) đều lấy từ cột chữ của script. Không nhãn «AI tạo»/«ví dụ». |
| 2 | Đa dạng + nhịp (R4, R11–R14) | Đạt, trừ 1 điểm R12 | Không 3 cảnh liền cùng cỡ; không quá 2 cảnh liền cùng `scene_type`. TB 6,65 s/cảnh; cảnh High (S11, S12, S21) 10,2 s có diễn tiến bên trong, giữ trạng thái đủ 2,4–2,7 s sau lời. `opening` 2 s và `header` (ẩn ở S02, S10, S11, S12, S14, S21) hợp lệ, không chồng Cáo. 4 nền (office, security, code, incident), có theme `code`. Cáo 13,6 % (≤ 25 %), không che sơ đồ. **Lỗi:** S15–S19 là 5 cảnh liền cùng nền `code #15283A` (36 s), vượt giới hạn R12 "một bối cảnh ≤ 4 cảnh liền". |
| 3 | Khớp kịch bản (Y5, Y7) | Đạt | Mạch tình huống (S01–S05) → bối cảnh/đối chiếu (S06–S09) → cơ chế (S10–S21) → xử lý (S22–S27), khớp script. Mốc `hold_after_voice_s` ≥ 0,6–2,7 s; đuôi im 0,60 s ≤ 0,7 s. Hình gắn đúng cụm lời (L-id + offset). Phạm vi "vụ đó" / "tiện ích xấu" được giữ trong hình (S11 tách quyền đọc và sao chép; S21 hai trạng thái độc lập). |
| 4 | Dựng được | Đạt | `renderer: pillow-ffmpeg` có `renderer_reason` cụ thể (tab chat, menu→hàng bị gỡ, ba trạng thái quyền mà Remotion không có). Component có thật: `window`, `card`, `cursor`, `tray`, `connection`/`FlowDiagram`, `header_label`, `kinetic_text`, `captions`, `sequence.camera`. Các phần vẽ tay (bảng ba ô, bản lề khe, vùng quyền theo biên tab) được khai rõ. Camera/crop ≤ 1,15× có mục đích (S01, S03, S05, S17). 6 dáng Cáo (`desk_typing`, `surprised`, `point_right`, `think`, `present_hand`, `thumbs_up`) đều có thật trong `docs/mascot.md`; mọi cảnh Cáo ≤ 180 px, đổi dáng bằng cắt, không nhép miệng. |
| 5 | Đúng schema | Đạt | Đủ `renderer`, `renderer_reason`, `opening`, `header`, `captions` (layer/position/font/max_lines đúng enum), `complexity`, `main_idea`, `concepts`, `hold_after_voice_s`, `main_change`, `text_groups`, `quality_check` (không có cờ xấu). Không cảnh tĩnh > 2 s nên không cần `hold_reason`. |

## Quyết định về vị trí phụ đề (Codex hỏi)

Schema chỉ cho `position: "bottom"`. Dải phụ đề y≈1340–1500 nằm DƯỚI chân Cáo (đáy y 1260–1290) nên không che Cáo, không che vùng hình y≈250–1320. Ý của `docs/mascot.md` ("không che Cáo/hình") được đáp ứng. **Chốt: giữ dải phụ đề dưới, không đưa lên trên đầu Cáo** (làm vậy sẽ đè vào sơ đồ). Producer kiểm khung thật ở cảnh Cáo.

## Góp ý cần sửa (1 mục)

1. **S15–S19 (R12, Y4):** 5 cảnh liền cùng `code #15283A`. Đổi nền một cảnh giữa chuỗi sang môi trường khác có nghĩa màu phù hợp để chuỗi ≤ 4 cảnh liền. Đề xuất S18 (On select, ui_simulation, cận cảnh, nói về quyền tạm/chờ thao tác) dùng `security #151D34` thay `code #15283A`, ghi lại lớp xa/giữa/gần, ánh sáng và bố cục theo nền mới; giữ nguyên hình, timeline, mọi mốc và chữ. Cập nhật câu liên quan trong `visual_style_note` nếu có nêu nền S15–S19.

Phần còn lại giữ nguyên, không đổi lời/chữ/tổng thời lượng.

KẾT LUẬN: CẦN SỬA
