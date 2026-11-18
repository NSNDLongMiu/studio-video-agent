# Kế hoạch đưa Xưởng video vào chạy thật

> Cập nhật: 16/11/2026 · Người duyệt: giám đốc · Checklist việc cụ thể: `docs/CHECKLIST.md` · Kế hoạch chuyển PC mới: `docs/PLAN-CHUYEN-MAY.md`
> Ghi chú trung thực: kế hoạch này được viết **sau** khi phần lớn hệ thống đã dựng. Một số quyết định (tên linh vật, 2 vòng tranh luận mặc định, ngưỡng thử lại, worker nền) do Claude tự chọn khi dựng — nằm ở mục 5 để giám đốc xác nhận hoặc đổi.

## 1. Mục tiêu
Một xưởng làm video ngắn dọc (TikTok · Facebook Reels · YouTube Shorts) mà giám đốc kiểm soát được:
- Giám đốc đưa **chủ đề**; đội làm theo **bộ core** (18/11/2026): Ý tưởng (Claude + Codex, Claude chốt) → Kịch bản và Đạo diễn hình ảnh (Codex làm, Claude review & duyệt cuối); **Codex (ChatGPT Plus)** làm chi tiết và dựng; Claude hỗ trợ khi Codex kẹt.
- Tổ chức: phòng ban → đội (1 đội = 1 bộ video / 1 nhóm ý tưởng). **Chỉ giám đốc** mở/đóng phòng, đặt chỉ tiêu, duyệt tăng/giảm đội.
- Xem được bất kỳ lúc nào: đội nào, bao nhiêu người, đang làm gì.
- Nhiều tài khoản Claude/Codex: hết limit thì tự chuyển, hết sạch thì tự chờ hồi rồi chạy tiếp.
- Kênh **Cáo văn phòng**: mọi video có linh vật cáo công sở dẫn truyện.

## 2. Hiện trạng (16/11/2026)
| Phần | Trạng thái | Bằng chứng | Chưa kiểm chứng |
|---|---|---|---|
| Phòng/đội/người, đề xuất–duyệt, dashboard | Đã dựng | 5 test, thử Host/Origin lạ | Chưa có dữ liệu thật (DB thật chưa tạo) |
| Tài khoản + hàng đợi + worker (tự chuyển, tự chờ limit) | Đã dựng | 15 test với Claude/Codex giả; `claude -p` thật nạp skill, MCP, subagent | Codex thật; hết limit thật; đăng nhập tài khoản thứ 2 |
| Ý tưởng → kế hoạch theo bộ core (Ý tưởng · Kịch bản · Đạo diễn hình ảnh; Codex làm, Claude duyệt) | Đã viết agent/skill, `codex-write.mjs`, chờ-Codex trong worker | Test tự động (giả lập); `codex-ideate.mjs` thử tay 1 lượt thành công | **Chưa chạy thật** `codex-write.mjs` và trọn 1 lượt bộ core với chủ đề thật |
| Sản xuất bằng Codex + QC | Đã viết `AGENTS.md`, skill, `qc-video` | Công thức ffmpeg thử thật; QC phân biệt đạt/rớt | **Codex thật chưa từng chạy** (chưa đăng nhập) |
| Linh vật Cáo văn phòng (ảnh của giám đốc) | Đã dựng bộ sticker + công cụ dẫn truyện | 7 test; tách đủ 116 sticker; 1 video thử đủ tiêu đề + phụ đề + Cáo + giọng, QC đạt | Không nhép miệng; sticker ~330px hơi mềm; nguồn ảnh/giấy phép chưa rõ |
| Văn phòng 2D (whatsmyagentdoing v0.8.1 ghim) | Đã cài, nối vào dashboard và CLI | 4 test (gồm khởi động thật, từ chối Host lạ); ảnh chụp thấy phiên Claude thật; code đã đọc: không gọi AI | Phiên Codex thật, tài khoản phụ thật, đo CPU/RAM |

## 3. Các giai đoạn

### Giai đoạn 1 — Mở khoá (việc của giám đốc)
Không làm xong thì các giai đoạn sau không chạy được.
- [ ] `codex login` (ChatGPT Plus)
- [ ] Mở Claude Code ở `e:\Tiktoker`, đồng ý MCP `studio`
- [ ] Chạy `codex` một lần trong thư mục dự án, chọn Trust
- [ ] `npm run start --prefix studio` rồi mở http://localhost:4747
- [ ] `npm run office --prefix studio` để mở Văn phòng 2D (xem các agent làm việc; đọc mục Riêng tư trong `docs/office.md`)
- [ ] `node studio/src/cli.mjs accounts init` và kiểm tra `claude/main` đúng tài khoản mong muốn (đăng nhập mặc định của máy vừa đổi tài khoản)
- [ ] Mở phòng ban đầu tiên
- [x] Quyết định có cho ghi `.claude/settings.json` không (cho phép trước công cụ đọc/báo cáo; công cụ duyệt vẫn bắt hỏi) — đã ghi 18/11/2026 sau khi giám đốc xác nhận

**Xong khi:** dashboard hiện 1 phòng, 1 đội, 2 tài khoản (claude/main + codex/…) ở trạng thái "sẵn sàng", và `accounts check --probe` báo gọi thử thật được.

### Giai đoạn 2 — Chạy thử 1 video đầu–cuối
- Giám đốc giao 1 chủ đề: `/new-topic <phòng> | <chủ đề> | <yêu cầu>`.
- Bộ core: Ý tưởng (Claude + Codex, Claude chốt) → Kịch bản (Codex viết `concept.md`, `plan.md`, `script.md`; Claude duyệt) → Đạo diễn hình ảnh (Codex làm `storyboard.json`; Claude duyệt).
- Kế hoạch xong tự sản xuất (không cần giám đốc duyệt kế hoạch, quyết 18/11/2026); giám đốc duyệt thành phẩm.
- Codex dựng → Claude QC → thành phẩm ở `final/`.
- Ghi lại: tổng thời gian, hạn mức tốn của từng tài khoản, lỗi gặp phải, nguyên văn thông báo hết limit (nếu gặp).

**Xong khi:** có 1 file `.mp4` 1080×1920 qua `qc-video`, đã xem khung hình thật, `publish.json` đủ 3 nền tảng, và giám đốc đồng ý chất lượng đủ để đăng thử.

### Giai đoạn 3 — Sửa theo kết quả thử
- Chỉnh bộ đọc giờ hồi limit (`studio/src/limits.mjs`) theo thông báo thật.
- Chỉnh prompt Planner/Producer, bố cục Cáo, ngưỡng thử lại theo thực tế.
- Sửa mọi chỗ Codex kẹt lặp lại.

**Xong khi:** chạy lại 1 video khác mà không cần can thiệp tay ngoài bước duyệt.

### Giai đoạn 4 — Mở rộng (làm từng việc, không làm dồn)
1. Đăng ký tài khoản của từng thành viên (mỗi tài khoản là ghế của 1 người thật).
2. Chọn giọng đọc tiếng Việt (Windows hiện chỉ có giọng tiếng Anh).
3. Chọn nguồn ảnh/clip có giấy phép (không dùng nhạc nền — giám đốc chốt 18/11/2026).
4. Thêm phòng/đội theo chỉ tiêu (qua quy trình đề xuất → duyệt).
5. Trang phục/phụ kiện Cáo theo cụm chủ đề (tạm dùng chung 1 bộ; agent hoạ sĩ linh vật lo về sau — `docs/viec-cho-agent.md` T1).
6. Đăng bài tự động — làm sau khi giám đốc duyệt file demo (quyết 18/11/2026); hiện giám đốc tự đăng.

**Xong khi:** từng việc có bằng chứng chạy thật như ở giai đoạn 2, không gộp nhiều việc chưa kiểm vào một lần.

## 4. Rủi ro đã biết
| Rủi ro | Ảnh hưởng | Cách xử lý |
|---|---|---|
| Điều khoản nhà cung cấp: OpenAI cấm né Usage Limits và quy định 1 tài khoản = 1 người; Anthropic có báo cáo khoá khi nuôi nhiều tài khoản | Tài khoản bị khoá | Mỗi tài khoản là ghế của 1 thành viên thật; dự phòng duy nhất là chờ hồi limit (giám đốc chốt 18/11/2026: không dùng API trả phí); lưu ý 3 ghế Claude main/b/c cùng một email (một tài khoản, chung hạn mức). Chi tiết `docs/accounts.md` |
| Định dạng thông báo hết limit không được hãng công bố | Đọc sai giờ hồi | Không đọc được thì lùi 30 phút → 6 giờ rồi thử lại; lưu nguyên văn để chỉnh sau giai đoạn 2 |
| Codex chưa từng chạy thật | Prompt/skill Producer có thể sai | Giai đoạn 2 là bài kiểm đầu tiên; không đăng video nào trước đó |
| Worker chạy trên máy này | Máy tắt/ngủ thì việc dừng | Việc tự tiếp tục khi máy bật; tuỳ chọn tác vụ tự bật khi đăng nhập Windows |
| Không có giọng đọc tiếng Việt | Cáo chỉ nhún theo nhịp phụ đề | Dùng chế độ `--srt` trước; chọn TTS ở giai đoạn 4 |
| Nội dung AI trông/nghe như thật | Phải gắn nhãn khi đăng | Trường `ai_generated_content` trong `publish.json`; giám đốc gắn khi đăng |
| Khối hook GSD trong `~/.codex/config.toml` đã bị comment | Trình cài GSD có thể ghi lại và làm lỗi Codex | Bản sao lưu `config.toml.bak-before-codex-0.169`; kiểm tra nếu `codex` báo lỗi cấu hình |

## 5. Quyết định cần giám đốc xác nhận
| # | Quyết định | Claude đã chọn tạm | Trạng thái |
|---|---|---|---|
| 1 | Chủ đề và phòng dùng chạy thử giai đoạn 2 | Phòng IT đã mở (18/11/2026) | **Chờ giám đốc giao chủ đề demo trên dashboard** |
| 2 | Tên kênh và linh vật | **Đã chốt:** kênh "Cáo văn phòng", linh vật cáo cam công sở (ảnh `assets/mascot/`). Chíp ngừng dùng | Đã chốt |
| 3 | Số vòng tranh luận ý tưởng | **Đã chốt 18/11/2026:** tối đa 4 vòng (mặc định 2, chọn lúc giao việc) | Đã chốt |
| 4 | Giám đốc duyệt kế hoạch trước khi Codex làm | **Đã chốt 18/11/2026: KHÔNG cần.** Kế hoạch xong thì tự sản xuất (cài đặt `auto_produce`, mặc định bật); giám đốc duyệt thành phẩm | Đã chốt |
| 5 | Giới hạn tự thử lại | **Đã chốt 18/11/2026:** gỡ vướng tối đa 4 lần/video, sản xuất dưới 10 lần/video (tối đa 9) | Đã chốt |
| 6 | Cho dùng API trả phí khi mọi tài khoản gói hết limit | Tắt | **Đã chốt 18/11/2026: KHÔNG dùng** API/AI trả phí; hết limit → chuyển tài khoản, hết sạch → chờ hồi |
| 7 | Số video/ngày | **Bỏ khỏi danh sách (18/11/2026):** theo cấu hình phòng/đội (chỉ tiêu đặt lúc tạo phòng), không có mặc định riêng cần chốt | Bỏ |
| 8 | Chuẩn đầu ra | 9:16, 1080×1920, 15–45 giây | **Đã chốt 18/11/2026** |
| 9 | Công cụ xem "văn phòng" | **Đã chốt:** whatsmyagentdoing, chỉ 2D | Đã chốt |
| 10 | Nhãn AI | **Đã chốt:** luôn gắn nhãn AI cho mọi video | Đã chốt |
| 11 | Văn phong của Cáo | **Đã chốt:** trẻ trung, câu chữ văn phòng. Câu chào: **đã chốt 18/11/2026 — không có câu chào cố định**, mở đầu bằng hook theo chủ đề (`docs/mascot.md`) | Đã chốt |
| 12 | Giọng đọc tiếng Việt | **Đã chốt 17/11/2026:** toàn giọng Bắc (Minh Đức nam, Quỳnh Anh nữ), VieNeu-TTS (`docs/voice.md`) | Đã chốt |
| 13 | Nhép miệng cho Cáo | Giao agent khác theo `docs/prompts/lipsync-cao.md` | Giám đốc đã giao cho AI (18/11/2026); chờ agent nhận — `docs/viec-cho-agent.md` T2 |

## 6. Cách theo dõi tiến độ
- Dashboard http://localhost:4747: mục "Cần giám đốc chú ý", Tài khoản, Hàng đợi việc, Checklist.
- Terminal: `node studio/src/cli.mjs status`.
- Mỗi giai đoạn chỉ coi là xong khi đạt mục "Xong khi" ở trên và có bằng chứng (file, số đo, ảnh khung hình), không phải chỉ vì lệnh chạy không báo lỗi.
