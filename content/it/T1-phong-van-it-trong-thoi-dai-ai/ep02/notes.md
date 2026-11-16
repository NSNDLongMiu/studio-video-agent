# Ghi chú IT-T1-E02

## Hướng dẫn từ Claude (RESCUE, 2026-11-17)

Kết luận: lỗi hạ tầng/cấu hình Codex, KHÔNG phải do plan hay script. Không sửa nội dung kế hoạch. Cờ vướng được giữ nguyên.

Bằng chứng (logs/job-3-produce.log, phần đầu):
- `sandbox: read-only`, `approval: never` dù `studio/src/runners.mjs` (runCodexProduce) truyền `--sandbox workspace-write`. Nghĩa là có cấu hình ở tầng cao hơn (config người dùng trong CODEX_HOME của tài khoản "main", hoặc policy quản trị/requirements của Codex v0.169.0) đang ép read-only và ghi đè cờ dòng lệnh.
- `warning: Untrusted project-local configuration is disabled` nên `.codex/config.toml` (MCP studio) không được nạp. `-c mcp_servers...` do worker truyền chắc cũng bị chặn vì approval=never nên MCP cần duyệt thì bị từ chối.
- Hệ quả: shell bị chặn, MCP studio (report_status/escalate) bị từ chối, không ghi được vào ep02/assets và ep02/final. Lần rescue trước (job-5) log rỗng, không làm được gì thêm.
- ep02/assets và ep02/final đang trống; chỉ có script.md.

Việc cần giám đốc/người vận hành làm (Claude không được sửa studio/, .codex/, và không nên né policy):
1. Mở file `config.toml` trong thư mục CODEX_HOME của tài khoản Codex "main" (xem docs/accounts.md) và xóa/sửa `sandbox_mode = "read-only"` và `approval_policy` thành `sandbox_mode = "workspace-write"`. Kiểm tra thêm `requirements.toml` / managed config của Codex (nếu có) đang khóa sandbox.
2. Chạy một lần `codex exec --trust` trong D:\Agent Video Studio (hoặc tin cậy dự án) để nạp `.codex/config.toml` và cho phép MCP studio. Với approval=never, cần đặt tool approval của MCP studio thành tự động (ví dụ `default_tools_approval_mode = "approve"` cho `[mcp_servers.studio]`) nếu phiên bản Codex hỗ trợ.
3. Kiểm tra bằng `codex exec --cd "D:\Agent Video Studio" --sandbox workspace-write` ghi thử 1 file vào ep02/final rồi xóa, và gọi thử report_status.
4. Xong thì chạy lại `/produce IT-T1-E02 --force`.

Plan/script không cần đổi.

## Producer tiếp tục 2026-11-17
- MCP studio hoạt động. Ghi trong ep02 qua sandbox escalation đã được chấp thuận; không sửa cấu hình hoặc studio/.
- assets/ và final/ ban đầu trống. Đã tạo assets/lines.json từ đủ 40 dòng full và P1-E/P2-I; text_sub giữ nguyên kịch bản.
- Đã tạo đủ 42 giọng trong assets/vo/: VieNeu v3 Turbo CPU, Minh Đức cho Cáo, Quỳnh Anh cho người phỏng vấn, temperature=0.65, hậu kỳ atempo=1.08. Chỉ đọc assets mẫu có sẵn và mô hình TTS đã cài; không tải stock/nhạc/phông ngoài.
- Python: C:/Users/PC/AppData/Local/Programs/Python/Python312/python.exe; ffmpeg/ffprobe: C:/Users/PC/AppData/Local/ffmpeg/ffmpeg-master-latest-win64-gpl/bin/; Node: C:/Program Files/nodejs/node.exe. PATH của phiên thiếu Python/ffmpeg nên dùng đường dẫn tuyệt đối và PATH chỉ trong tiến trình con.
- assets/tts.py và assets/produce.py là pipeline tiếp tục được: giữ lại giọng/cảnh đã hoàn tất. Nhật ký: assets/tts.log, assets/produce.log.
- Timeline theo giọng thật, chia theo chương: full 251.80 giây; p1 125.87 giây; p2 135.83 giây (ước tính trước ghép, chưa phải ffprobe final). Nằm trong khoảng plan cho phép.
- Đồ hoạ tự tạo bằng Pillow đã cài sẵn; font Segoe UI Windows; Cáo chỉ lấy brand/cao/poses và tạo lớp bằng tools/fox/narrate.mjs. Không nhạc nền vì library/music không có nhạc được cấp phép. SFX sine tự tạo.
- Đã xem khung thật assets/qc-first.png ở 0.5s: hook, phụ đề đủ dấu, Cáo wave, chân trên y=1500. Chưa kết luận toàn video đạt; đang dựng các cảnh.
- Lưu ý: các dòng mô tả vùng miền cũ trong script nói Nam; tuân quyết định cập nhật tại plan §3 và docs/voice.md: cả hai giọng Bắc.

## Kết thúc sản xuất — QC thực tế (2026-11-17)
Đã xuất đủ full, p1, p2 và bản tên chuẩn 9x16 (giống hệt full theo SHA-256). Không chuyển ready/published; giao review.

### Số đo ffprobe và loudnorm trên file AAC cuối
| Bản | Giây | MiB | LUFS-I | dBTP |
|---|---:|---:|---:|---:|
| full | 251.896000 | 11.791 | -14.26 | -1.70 |
| p1 | 125.970667 | 6.219 | -14.25 | -1.72 |
| p2 | 135.894667 | 6.298 | -14.27 | -1.70 |

- Tất cả: 1080×1920, 30 fps, H.264 yuv420p, AAC 48 kHz; kiểm atom moov đứng trước mdat (faststart); dung lượng dưới 250 MB.
- loudnorm hai lượt, đặt trần -1.8 dBTP trước mã hoá để giữ đỉnh AAC cuối ≤ -1.5 dBTP.
- Phụ đề cả ba bản so sánh sau khi nối dòng: trùng nguyên văn toàn bộ lời script, gồm intro riêng p2 và kết riêng p1. Mỗi cue ≤ 2 dòng, mỗi dòng ≤ 28 ký tự. Mốc chia cue ước lượng theo thời lượng đoạn giọng; chưa có căn chỉnh từng từ bằng nhận dạng giọng nói.
- Đã mở và xem ảnh khung thật đầu/giữa/cuối cả 3 bản (assets/qc-sheet_full.jpg, qc-sheet_p1.jpg, qc-sheet_p2.jpg), thêm khung mỗi chương; chữ đủ dấu, không bị cắt, phụ đề phía trên Cáo. Đã sửa hook bị nhãn chương chạm, thẻ chốt và nhãn AI rồi xuất lại.
- Đã mở ảnh font-check.png với câu “Đáp ổn: ưu, ơ, ằ, ẵ, ỵ”. Huy hiệu hư cấu có trên mọi thẻ; thẻ mở/cuối có nhãn hư cấu; thẻ cuối đủ câu ai_disclosure. Thẻ hai cột chương 3 có ghi chú miễn trừ nguyên văn.
- Timeline 30 mốc dáng, đổi dáng ngắn nhất 2.2s; Cáo hiện toàn bộ các cảnh, dùng đúng sticker brand/cao. Cáo chỉ nhún theo tiếng, không nhép miệng.
- SFX click/ting hai nốt/bụp/vút tự tổng hợp, độ lớn đặt thấp hơn giọng; không dùng nhạc ngoài. Nguồn cụ thể trong publish.json assets_used.
- publish.json: ai_generated_content=true; caption/description của cả ba nền tảng kết thúc đúng ai_disclosure. Cảnh báo sources trống là dự kiến: script chỉ có nguyên tắc định tính, không có số liệu/sự kiện đòi nguồn.

### Phần người duyệt cần nghe
Chưa đánh giá bằng tai chất lượng/phát âm của TTS hoặc độ khớp từng từ. Giám đốc nghe assets/vo/_check.wav (AI, IT, code, Note, Alo) và xem toàn bộ bản dựng khi review. Giọng đúng hai preset được chốt, temperature=0.65, atempo=1.08; không tự thay giọng.

### Kết quả công cụ nguyên văn

qc-video full:
```json
{
  "file": "D:\\Agent Video Studio\\content\\it\\T1-phong-van-it-trong-thoi-dai-ai\\ep02\\final\\IT-T1-E02_full.mp4",
  "pass": true,
  "info": {
    "duration_s": 251.9,
    "size_mb": 11.8,
    "video": "h264 1080x1920 yuv420p",
    "audio": "aac 48000Hz",
    "fps": 30,
    "mean_volume_db": -15.5,
    "max_volume_db": -1.7
  },
  "fails": [],
  "warns": []
}

```

qc-video p1:
```json
{
  "file": "D:\\Agent Video Studio\\content\\it\\T1-phong-van-it-trong-thoi-dai-ai\\ep02\\final\\IT-T1-E02_p1.mp4",
  "pass": true,
  "info": {
    "duration_s": 125.97,
    "size_mb": 6.2,
    "video": "h264 1080x1920 yuv420p",
    "audio": "aac 48000Hz",
    "fps": 30,
    "mean_volume_db": -15,
    "max_volume_db": -1.7
  },
  "fails": [],
  "warns": []
}

```

qc-video p2:
```json
{
  "file": "D:\\Agent Video Studio\\content\\it\\T1-phong-van-it-trong-thoi-dai-ai\\ep02\\final\\IT-T1-E02_p2.mp4",
  "pass": true,
  "info": {
    "duration_s": 135.89,
    "size_mb": 6.3,
    "video": "h264 1080x1920 yuv420p",
    "audio": "aac 48000Hz",
    "fps": 30,
    "mean_volume_db": -15.9,
    "max_volume_db": -1.7
  },
  "fails": [],
  "warns": []
}

```

qc-video 9x16:
```json
{
  "file": "D:\\Agent Video Studio\\content\\it\\T1-phong-van-it-trong-thoi-dai-ai\\ep02\\final\\IT-T1-E02_9x16.mp4",
  "pass": true,
  "info": {
    "duration_s": 251.9,
    "size_mb": 11.8,
    "video": "h264 1080x1920 yuv420p",
    "audio": "aac 48000Hz",
    "fps": 30,
    "mean_volume_db": -15.5,
    "max_volume_db": -1.7
  },
  "fails": [],
  "warns": []
}

```

qc-publish:
```json
{
  "file": "D:\\Agent Video Studio\\content\\it\\T1-phong-van-it-trong-thoi-dai-ai\\ep02\\final\\publish.json",
  "pass": true,
  "fails": [],
  "warns": [
    "sources trống: mọi sự kiện/số liệu cần có nguồn"
  ]
}

```

### Danh sách thành phẩm
- final/captions.srt — 6368 bytes
- final/captions_p1.srt — 3519 bytes
- final/captions_p2.srt — 3196 bytes
- final/cover.png — 391350 bytes
- final/IT-T1-E02_9x16.mp4 — 12364111 bytes
- final/IT-T1-E02_full.mp4 — 12364111 bytes
- final/IT-T1-E02_p1.mp4 — 6520662 bytes
- final/IT-T1-E02_p2.mp4 — 6604259 bytes
- final/publish.json — 5432 bytes
- final/thumbnail.jpg — 158154 bytes

Pipeline có thể tiếp tục: assets/tts.py, assets/produce.py, assets/qc.py; nhật ký cuối: assets/produce-final.log, assets/qc.log; số đo: assets/qc-results.json và loudness_*.log.

## QC 2026-11-17 (Claude support) — cần sửa
Giới hạn: phiên QC này không chạy được Bash (bị từ chối tự động), nên KHÔNG tự chạy qc-video/ffmpeg và KHÔNG tự trích khung. Số đo kỹ thuật lấy từ kết quả producer ghi ở trên (chưa tự kiểm chứng). Khung đã xem là khung do producer trích: qc-sheet_full.jpg (11 khung), qc-first.png, qc-p2-hook.png, qc-ending-cards.png, qc-two-columns.png.

Kết quả: FAIL (1 lỗi hiển thị).
1. Thẻ kết "BA ĐIỀU CÁO RÚT RA" (assets/qc-ending-cards.png, cũng thấy ở dải cuối qc-sheet_full.jpg): mục 2 "Mật khẩu: không bao giờ dán. Dữ liệu: hỏi quy định công ty." tràn 2 dòng trong ô cao một dòng, dòng 2 "hỏi quy định công ty." bị cắt nửa dưới chữ, ba ô sát/chồng nhau. Vi phạm plan §9 "chữ trong khung quá dài, tràn" và tiêu chí 7 (chữ không bị cắt). Sửa: tăng chiều cao ô theo số dòng thật (ô 2 cao gấp đôi) và giãn khoảng cách giữa ba ô, hoặc ngắt dòng/xếp lại để ô không đè nhau; chữ vẫn y nguyên script, trong y 250–1500, lề ≥ 90 px. Xuất lại full và p1/p2 nếu thẻ này có mặt trong cả ba (kiểm p1/p2), cập nhật captions nếu đổi mốc.
2. Sau khi sửa, trích lại khung thẻ kết ở cả full/p1/p2 và xem lại; chạy lại tools/qc-video.mjs.

### ĐÍNH CHÍNH (phiên /qc điều phối, 2026-11-17): phán quyết FAIL ở trên DỰA TRÊN KHUNG CŨ
- `assets/qc-ending-cards.png` được tạo TRƯỚC lần dựng lại scene_38..40 và final/*.mp4 (thứ tự mtime), tức là trước khi producer "sửa thẻ chốt rồi xuất lại".
- Thẻ thật đang dùng trong bản dựng cuối `assets/scene_38/card1.png` (1080×1920): mục 2 xuống 2 dòng đầy đủ "2. Mật khẩu: không bao giờ dán. Dữ liệu: / hỏi quy định công ty.", KHÔNG bị cắt chữ. `qc-sheet_full.jpg` (tạo sau final) cũng cho thấy thẻ kết hiển thị đủ 3 mục.
- Còn lại chỉ là góp ý thẩm mỹ, không phải lỗi rớt: các ô cách nhau ~4px, tiêu đề "BA ĐIỀU CÁO RÚT RA" sát ô 1, chữ mục 1 và 3 nằm lệch lên trên trong ô.
- Lỗi rớt duy nhất được nêu không còn trong bản dựng hiện tại → rút lại FAIL. Nhưng QC vẫn CHƯA tự chạy được qc-video/ffmpeg (Bash bị từ chối trong phiên nền) và chưa tự trích khung từ mp4 → không đủ căn cứ để tự cho `ready`. Đặt lại `review`, cần người duyệt: giám đốc xem final/IT-T1-E02_full.mp4 (hoặc p1/p2) và nghe giọng, hoặc cho worker quyền chạy ffmpeg/node rồi chạy lại /qc.

Phần còn lại đã thấy ổn trên khung producer: hook 0.5s đủ dấu, Cáo wave, huy hiệu hư cấu, thẻ mở có nhãn AI, hook p2, thẻ hai cột có ghi chú miễn trừ, publish.json đủ 3 nền tảng, mô tả kết thúc bằng câu khai báo AI. Cảnh báo sources trống chấp nhận được (không có số liệu).
