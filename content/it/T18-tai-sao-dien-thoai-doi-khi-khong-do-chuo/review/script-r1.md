# Chấm kịch bản IT-T18-E01, bản 1 (Claude chốt)

Gemini vắng: LIMIT (không có kiểm chứng Gemini ở bản 1; Claude tự mở nguồn Apple 118444, Apple iOS 27, Google Clock, Android Developers, tin phát hành iOS 27).

## Xử lý đề xuất của Codex
| Đề xuất | Quyết định | Lý do |
|---|---|---|
| L06 thêm điều kiện bật rung (Apple: StandBy tắt rung báo thức, đã kiểm) | NHẬN, đổi lời | Lời mới: "Chọn Không có thì không có tiếng, chỉ rung nếu bật rung." Hình rung bật cùng S01. |
| L12 viết lại "nếu bạn chặn báo thức" | NHẬN ý, BÁC chữ | Chữ của Codex dễ hiểu ngược (ai chặn?). Dùng: "Tuỳ máy, Không làm phiền có thể làm im báo thức nếu chưa cho phép." |
| L13 "Nếu app cần quyền, bạn xem Báo thức và lời nhắc" | NHẬN | Đúng nguồn 5: app báo thức/lịch đúng nghĩa được cấp sẵn; hình có dấu "cần quyền". |
| Bỏ "thường" ở mô tả TikTok | NHẬN | Không có nguồn cho tần suất; đã sửa. |
| S07 gắn cả hẹn giờ vào thanh tách (Apple iOS 27: Alarms and Timers) | NHẬN | Thêm biểu tượng hẹn giờ ở hình; lời giữ ngắn. |
| Bằng chứng hình: một báo thức chạm giờ hai lượt | BÁC (một phần) | Tốn cảnh, vượt ngân sách; thay bằng rung bật nhất quán ở S01/S04/S11. |
| Bằng chứng hình S08: bật lại quyền cho phép báo thức, loa xanh | NHẬN | Thêm cuối S08. |

## Kiểm chứng (thay Gemini)
(a) Còn rung khi Không có: có, trừ StandBy (Apple 118444) → đã thêm điều kiện. (b) iOS 27 phát hành công khai 14/09/2026 → Lời 10 đúng, không nói "mới nhất". (c) Tên mục tiếng Việt: chưa kiểm được máy thật, ghi cho giám đốc. (d) Lời 12 chỉ có nguồn là app Đồng hồ Google → làm mềm bằng "tuỳ máy" + "nếu chưa cho phép", ghi trong script mục xử lý.

## Chấm
1. Bám phán quyết: Đạt (hook "Đúng giờ, mà chỉ rung?", đúng concept).
2. Giữ chân: Đạt (tình huống S01, hệ quả giây 3, trả câu hỏi giây 7,6, kết trả S01; 12 cảnh, ≈ 63,5 s).
3. Đủ chi tiết cho Producer: Đạt (bảng cảnh, voice_direction, Y8, bản đồ ngữ nghĩa, ngân sách).
4. Chính xác: Đạt (nguồn chính thức đã mở; hai điểm tên Việt hoá và Android còn ghi cho giám đốc).
5. Làm được & an toàn: Đạt (giao diện giả lập, không logo; có câu khai báo AI).
6. Văn phong: Đạt.

Việc còn lại (không bắt buộc): Producer tính lại mốc sau TTS vì S04–S12 dịch ≤ 0,5 s; giám đốc kiểm tên mục tiếng Việt.

KẾT LUẬN: DUYỆT
