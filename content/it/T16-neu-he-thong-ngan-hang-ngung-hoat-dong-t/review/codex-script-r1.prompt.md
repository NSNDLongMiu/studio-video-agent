## B. Prompt dành cho Codex — CÙNG VIẾT kịch bản

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
- team_id: 4 (phòng IT)
- Chủ đề #16: "Nếu hệ thống ngân hàng ngừng hoạt động trong 24 giờ, chuyện gì sẽ xảy ra?" — kịch bản giả định, không nêu tên ngân hàng thật, không gây hoảng loạn, không khuyên rút tiền; mọi khẳng định kỹ thuật cần nguồn.
- Video: `IT-T16-E01` → thư mục `ep01`
- **N = 1** (bản đầu). Ghi file: `review/script-codex-r1.md`
- Thư mục gốc dự án: `D:/Agent Video Studio`
- Thư mục chủ đề (thư mục làm việc): `D:/Agent Video Studio/content/it/T16-neu-he-thong-ngan-hang-ngung-hoat-dong-t`
- File cần đọc (đường dẫn tuyệt đối):
  - `D:/Agent Video Studio/content/it/T16-neu-he-thong-ngan-hang-ngung-hoat-dong-t/brief.md`
  - `D:/Agent Video Studio/content/it/T16-neu-he-thong-ngan-hang-ngung-hoat-dong-t/debate.md` (mục "Phán quyết cuối")
  - `D:/Agent Video Studio/content/it/T16-neu-he-thong-ngan-hang-ngung-hoat-dong-t/concept.md`
  - `D:/Agent Video Studio/content/it/T16-neu-he-thong-ngan-hang-ngung-hoat-dong-t/plan.md`
  - `D:/Agent Video Studio/content/it/T16-neu-he-thong-ngan-hang-ngung-hoat-dong-t/ep01/script.md`
  - `D:/Agent Video Studio/docs/chat-luong-xem.md`
  - `D:/Agent Video Studio/.claude/skills/make-plan/codex-script.md` (mục A)
  - `D:/Agent Video Studio/docs/audit-T8.md` (mục 4)
- Đoạn `[kỹ thuật]` trong script: lời 06–09, 11, 13 (S05, S06, S07, S09).
