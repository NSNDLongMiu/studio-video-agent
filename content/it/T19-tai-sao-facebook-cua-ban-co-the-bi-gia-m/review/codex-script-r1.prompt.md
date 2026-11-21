## B. Prompt dành cho Codex — CÙNG VIẾT kịch bản (dán toàn văn mục B này + "NGỮ CẢNH" vào file prompt)

Bạn là **đồng tác giả của vị trí Kịch bản** trong đội video ngắn dọc của kênh **Cáo văn phòng**. Claude đã lên plan và viết bản đầu (`concept.md`, `plan.md`, `epNN/script.md`); Claude sẽ **chốt**. Việc của bạn là viết phần đóng góp của mình ra **MỘT file riêng**, không sửa file của Claude. Giữ ngắn: bạn không viết lại cả kịch bản.

**Đọc** (đường dẫn tuyệt đối có trong NGỮ CẢNH): `brief.md`, `debate.md` (mục "Phán quyết cuối" là ràng buộc), `concept.md`, `plan.md`, `epNN/script.md`, `docs/chat-luong-xem.md`, và **mục A** của file `.claude/skills/make-plan/codex-script.md` (chuẩn viết). Bản N ≥ 2: đọc thêm `review/script-r<N-1>.md` và chỉ xử lý các điểm Claude nêu.

**Ghi** `review/script-codex-r<N>.md` (thư mục làm việc là thư mục chủ đề), đúng ba mục:
1. **Lỗi kỹ thuật và rủi ro chính xác** — mỗi lỗi: cảnh/mã lời, vì sao sai, cách sửa. Không có thì ghi "không thấy lỗi". Số liệu/sự kiện chưa chắc ghi `[CẦN KIỂM NGUỒN]`.
2. **Bản viết lại lời đọc cho các đoạn `[kỹ thuật]`** — chỉ những đoạn bạn thấy chính xác hơn, ngắn hơn hoặc dễ hiểu hơn bản của Claude. Mỗi đoạn: mã lời/mốc, **lời đọc mới nguyên văn** (trong cùng ngân sách âm tiết, theo bảng thuật ngữ và Y8, câu ngắn một ý, xưng "mình", gọi "bạn"), lý do một dòng. **Không** viết lại đoạn `[dẫn]`, hook, kết (của Claude).
3. **Bằng chứng hình (R11) còn thiếu** — khẳng định kỹ thuật chính nào chưa có sự kiện hình chứng minh; đề xuất một sự kiện/cảnh.

Tổng ≤ 600 từ. **Không** sửa `concept.md`, `plan.md`, `script.md`, `debate.md` hay file review khác. Không viết code, không dựng video, không dịch vụ AI trả phí. Chỉ ghi trong thư mục chủ đề.

**Trả lời cuối (stdout, ≤ 80 từ):** số đoạn đề xuất viết lại, số lỗi kỹ thuật, điểm quan trọng nhất.

Khai `voice_direction` theo `line_id` trong storyboard và dự kiến nhịp trong kịch bản. Ghi ý định, cảm xúc, cụm nhấn, tốc độ, nghỉ trước/sau, ngữ điệu và quan hệ chuyển ý theo R24.

## NGỮ CẢNH
- N = **1** · team_id 5 · chủ đề #19 "Tại sao Facebook của bạn có thể bị giả mạo mà không cần hack tài khoản?" · video **IT-T19-E01**, thư mục `ep01`.
- Thư mục gốc dự án: `D:\Agent Video Studio`
- Thư mục chủ đề (thư mục làm việc, chỉ ghi ở đây): `D:\Agent Video Studio\content\it\T19-tai-sao-facebook-cua-ban-co-the-bi-gia-m`
- File cần đọc:
  - `D:\Agent Video Studio\content\it\T19-tai-sao-facebook-cua-ban-co-the-bi-gia-m\brief.md`
  - `D:\Agent Video Studio\content\it\T19-tai-sao-facebook-cua-ban-co-the-bi-gia-m\debate.md` (mục "## Phán quyết cuối")
  - `D:\Agent Video Studio\content\it\T19-tai-sao-facebook-cua-ban-co-the-bi-gia-m\concept.md`
  - `D:\Agent Video Studio\content\it\T19-tai-sao-facebook-cua-ban-co-the-bi-gia-m\plan.md`
  - `D:\Agent Video Studio\content\it\T19-tai-sao-facebook-cua-ban-co-the-bi-gia-m\ep01\script.md`
  - `D:\Agent Video Studio\docs\chat-luong-xem.md`
  - `D:\Agent Video Studio\.claude\skills\make-plan\codex-script.md` (mục A)
  - `D:\Agent Video Studio\docs\audit-T8.md` (mục 4)
- Ghi ra: `D:\Agent Video Studio\content\it\T19-tai-sao-facebook-cua-ban-co-the-bi-gia-m\review\script-codex-r1.md`
- Lưu ý chủ đề: video cảnh báo; không hướng dẫn dựng tài khoản giả; không khẳng định tên nút/đường dẫn cài đặt/"mặc định công khai" của Facebook; các đoạn `[kỹ thuật]` là Lời 05–08 (S03–S05).
