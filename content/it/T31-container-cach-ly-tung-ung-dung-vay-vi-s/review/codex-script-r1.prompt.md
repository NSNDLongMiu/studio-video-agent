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

## Luật chung: tên nền tảng (giám đốc chốt 21/11/2026 — CLAUDE.md luật 10)
Mọi video và bài đăng, trên mọi nền tảng: KHÔNG nói, KHÔNG viết tên thật của bốn nền tảng sau; dùng đúng cách gọi này ở lời đọc, phụ đề, chữ trên hình, tiêu đề, mô tả, hashtag, ảnh bìa.

| Nền tảng | Đọc thành tiếng | Viết |
|---|---|---|
| Facebook | phở bò | phở bò |
| YouTube | y tê bê | ytb |
| Zalo | dép lào | zép lào |
| TikTok | tóp tóp | tóp tóp |

Kịch bản ghi dạng *viết*; Sản xuất đưa dạng *đọc* vào TTS (`tools/voice/pronunciation.json`). Viết đúng như cột "Viết" (không viết hoa, không kèm tên thật trong ngoặc); hashtag = dạng viết bỏ dấu và bỏ khoảng trắng (`#phobo`, `#ytb`, `#zeplao`, `#toptop`). Đây là tên gọi thay thế, KHÔNG phải nghĩa đen: cấm hình, cảnh và chơi chữ về đồ ăn hay đôi dép vì tên này. Ngoại lệ người xem không thấy: khoá nền tảng trong `publish.json` (`tiktok`, `youtube_shorts`, `facebook_reels`), `notes.md`, mục nguồn và URL; không chép URL hay tên có chữ nền tảng thật vào mô tả đăng.

## NGỮ CẢNH
- team_id: 5 · chủ đề #31 (phòng IT) · video IT-T31-E01, thư mục `ep01` · vòng N = 1 (bản đầu, không có review trước).
- Thư mục gốc dự án: `D:\Agent Video Studio`
- Thư mục chủ đề (thư mục làm việc, chỗ ghi file): `D:\Agent Video Studio\content\it\T31-container-cach-ly-tung-ung-dung-vay-vi-s`
- File cần ghi: `D:\Agent Video Studio\content\it\T31-container-cach-ly-tung-ung-dung-vay-vi-s\review\script-codex-r1.md`
- Đọc:
  - `D:\Agent Video Studio\content\it\T31-container-cach-ly-tung-ung-dung-vay-vi-s\brief.md`
  - `D:\Agent Video Studio\content\it\T31-container-cach-ly-tung-ung-dung-vay-vi-s\debate.md` (mục "## Phán quyết cuối")
  - `D:\Agent Video Studio\content\it\T31-container-cach-ly-tung-ung-dung-vay-vi-s\concept.md`
  - `D:\Agent Video Studio\content\it\T31-container-cach-ly-tung-ung-dung-vay-vi-s\plan.md`
  - `D:\Agent Video Studio\content\it\T31-container-cach-ly-tung-ung-dung-vay-vi-s\ep01\script.md`
  - `D:\Agent Video Studio\docs\chat-luong-xem.md`
  - `D:\Agent Video Studio\.claude\skills\make-plan\codex-script.md` (mục A)
  - `D:\Agent Video Studio\docs\audit-T8.md` (mục 4)
- Ranh giới brief bắt buộc: không khẳng định nginx2root cho root ngay (bước lên root cần thêm một lỗi nhân chưa công bố chi tiết, chưa được bên thứ ba tái hiện); không nêu số máy chủ bị ảnh hưởng, tình trạng bản vá nhân; không tả cách khai thác; không nêu CVE, CVSS, tên SCTP. Đề xuất của bạn không được vượt ranh giới này.
