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
- **Bản N = 1.** File cần ghi: `review/script-codex-r1.md` (trong thư mục chủ đề).
- team_id: 4 (IT · Đội 3) · video IT-T21-E01 · thư mục tập: `ep01`.
- Chủ đề #21: Cho bạn mượn tài khoản ngân hàng "nhận hộ tiền": có thể bị phạt 100–150 triệu và bị phong toả tài khoản. Đây là chủ đề pháp lý/an toàn tài chính: "lời kỹ thuật" = các lời nhãn `[kỹ thuật]` (Lời 03–08, cảnh S03–S06) nói về dòng tiền, phong toả, giải trình, khung phạt.
- Thư mục gốc dự án: `D:/Agent Video Studio`
- Thư mục chủ đề (thư mục làm việc): `D:/Agent Video Studio/content/it/T21-cho-ban-muon-tai-khoan-ngan-hang-nhan-ho`
- File cần đọc (đường dẫn tuyệt đối):
  - `D:/Agent Video Studio/content/it/T21-cho-ban-muon-tai-khoan-ngan-hang-nhan-ho/brief.md`
  - `D:/Agent Video Studio/content/it/T21-cho-ban-muon-tai-khoan-ngan-hang-nhan-ho/debate.md` (mục "## Phán quyết cuối")
  - `D:/Agent Video Studio/content/it/T21-cho-ban-muon-tai-khoan-ngan-hang-nhan-ho/concept.md`
  - `D:/Agent Video Studio/content/it/T21-cho-ban-muon-tai-khoan-ngan-hang-nhan-ho/plan.md`
  - `D:/Agent Video Studio/content/it/T21-cho-ban-muon-tai-khoan-ngan-hang-nhan-ho/ep01/script.md`
  - `D:/Agent Video Studio/docs/chat-luong-xem.md`
  - `D:/Agent Video Studio/.claude/skills/make-plan/codex-script.md` (mục A)
  - `D:/Agent Video Studio/docs/audit-T8.md` (mục 4)
- Ràng buộc chính xác của chủ đề (từ brief và phán quyết): mọi hệ quả chỉ ở dạng "có thể"; mức phạt chỉ đứng cạnh hành vi "cho mượn" (1 đến dưới 10 tài khoản thanh toán, cá nhân, 100–150 triệu, NĐ 340/2025/NĐ-CP); không nói phong toả "toàn bộ"; không "đồng phạm/vô can", án tù, "Điều 291", "rửa tiền", tên ngân hàng; không khuyên "tự chuyển trả". Bạn không có web: khẳng định nào bạn nghi thì ghi `[CẦN KIỂM NGUỒN]`, đừng tự khẳng định sửa số liệu.
- Điểm Claude muốn bạn soi kỹ: (a) Lời 12 "Luật cấm" có quá tay so với nguồn (chỉ có mức phạt hành chính)? (b) Lời 08 "Cho mượn một tài khoản đã vào khung này, không cần nhiều lần" có dễ hiểu sai không? (c) Lời 10 "không đổi tên người nhận" có chính xác với hình không? (d) khung phạt đang ở 23,6 s trong khi phán quyết muốn ≈ 20 s: có cách rút lời S03–S04 mà không mất ý?
