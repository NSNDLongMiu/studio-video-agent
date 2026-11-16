# IT-T1-E01 — ghi chú gỡ vướng (rescue, 2026-11-17)

## Triệu chứng (job-2-produce.log)
- Codex gọi `powershell.exe -Command 'Get-Content AGENTS.md'` → `rejected: blocked by policy`.
- Mọi lệnh MCP studio (`report_status`, `get_video`, `escalate`) → `MCP tool call requires approval, but approval policy is never`.
- Codex không ghi được file nào → chưa có thành phẩm.

## Nguyên nhân gốc (hạ tầng, KHÔNG phải kế hoạch/kịch bản)
- `studio/src/runners.mjs:214` chạy `codex exec --sandbox workspace-write ...` ở chế độ không tương tác (approval = never).
  - Bản Codex hiện tại bắt duyệt cho lệnh gọi công cụ MCP → không ai duyệt → bị từ chối hết.
  - Trên Windows, sandbox workspace-write chặn cả lệnh shell (PowerShell) → không đọc/ghi file được.
- Sản xuất lại với cấu hình y hệt sẽ lỗi y hệt. Kịch bản `script.md` không cần sửa.

## Cần giám đốc / người vận hành
- Chỉnh cách gọi Codex trong `studio/src/runners.mjs` (agent không được sửa `studio/`), ví dụ:
  - cho phép công cụ MCP `studio` chạy không cần duyệt (cấu hình approval cho MCP server qua `-c`), và
  - cấu hình sandbox Windows cho phép shell + ghi trong thư mục dự án (hoặc chạy chế độ bỏ sandbox nếu giám đốc chấp nhận).
- Kiểm bằng 1 lần `codex exec` thử gọi `get_video` + ghi 1 file trong `ep01/` trước khi sản xuất lại.
- Sau khi sửa: gỡ cờ vướng và xếp lại produce cho IT-T1-E01 (và mọi video Codex khác cũng sẽ dính lỗi này).

## Tiếp tục sản xuất — 2026-11-17
- MCP studio hoạt động; đọc/ghi ep01 hoạt động qua quyền thực thi được cấp.
- Không có thành phẩm cũ để tái dùng. Đã tạo 43 dòng thoại (41 full + kết p1 + intro p2).
- Python thật: C:/Users/PC/AppData/Local/Programs/Python/Python312/python.exe. FFmpeg: C:/Users/PC/AppData/Local/ffmpeg/ffmpeg-master-latest-win64-gpl/bin. PATH phiên ban đầu thiếu hai thư mục này.
- VieNeu v3 Turbo CPU, Minh Đức / Quỳnh Anh; temperature=0.65; mọi WAV hậu kỳ atempo=1.08. WAV raw và WAV tăng tốc nằm trong assets/vo. Không đổi giọng theo ghi chú Nam cũ trong script; áp quyết định mới ở plan mục 3/10.
- Tạo assets/lines.json, timeline_measured.json, vo_full.wav, vo_p1.wav, vo_p2.wav; final/captions*.srt. Thời lượng dự kiến: full 249.10s; p1 125.10s; p2 132.9333s.
- Nguồn: brand/cao/poses (linh vật được cung cấp); phông Windows Segoe UI; nền/thẻ/code giả do assets/prepare.py tạo bằng Pillow đã có sẵn theo plan mục 5; SFX sine tự tạo. Không nhạc nền vì không có nhạc được cung cấp. Không tải stock/ảnh/phông/nhạc.
- Đã mở font_check.png và các thẻ 1, 30, 34 để kiểm dấu và bố cục. Chưa QC video hoàn chỉnh.
- assets/vo/_check.wav ghép các câu chứa AI, IT, code, Alo, Note: cần giám đốc nghe lại phát âm; chưa tuyên bố đã đánh giá chất lượng bằng tai.
- Tiến trình tạo lớp Cáo nhỏ/lớn bằng tools/fox/narrate.mjs đang chạy. Tất cả file tạm của công cụ hướng vào assets/tmp.
- Tiếp tục: hoàn thiện ghép hình/âm thanh; tạo đủ full,p1,p2,_9x16; thumbnail/cover/publish; QC và mở khung thực tế rồi mới chuyển review.

### QC vòng 1 và sửa
- qc-video bản full vòng 1: pass; 249.10s; 1080x1920 H.264 yuv420p, AAC 48000Hz, 30fps, 11.7MB; mean -15.7dB; max -1.4dB.
- Kiểm loudnorm riêng trên file AAC vòng 1: input_i=-14.16 LUFS, input_tp=-1.44 dBTP -> KHÔNG đạt true peak <=-1.5; không dùng vòng 1 làm kết quả cuối.
- Mở ảnh có phụ đề thực tế phát hiện câu CTA chồng lên ai_disclosure. Đã sửa ASS: một dòng cho cảnh Cáo to, đặt trên đầu; câu khai báo AI có dòng riêng ở y600. Đã mở qc_fixed_end.jpg và qc_fixed_hook.jpg sau sửa: không còn chữ chồng nhãn AI.
- Tăng headroom mục tiêu true peak trước mã AAC từ -1.5 xuống -2.0; tiếp tục đo file xuất thực tế, không lấy output loudnorm dự đoán làm số đo file cuối.
- Cân lại trang câu hỏi để tránh trang cuối chỉ còn một dòng. Giữ nguyên chữ, giọng, thứ tự và thời lượng.
- Lỗi thumbnail vòng 1: ffmpeg không nhận `-ss .5`, báo `Invalid duration for option ss: .5`. Sửa thành `-ss 0.5`; không ảnh hưởng các video đã xuất.


## K?t qu? cu?i ? ch? gi?m ??c review
- ?? xu?t ?? full, p1, p2; `_9x16.mp4` gi?ng t?ng byte b?n full theo y?u c?u giao vi?c. Kh?ng t? duy?t ready/published.
- ?? ch?y qc-video tr?n C? B?N file MP4; t?t c? pass, kh?ng fails/warns. ?o true peak/LUFS l?i t? file AAC th?c t? b?ng loudnorm. Ki?m atom MP4: moov n?m tr??c mdat (faststart) ? t?t c? b?n.
- ?? m? ?nh QC full 0.5s / gi?a / g?n cu?i; m? th?m hook, ph? ?? tr?n th? hai c?t, ph? ?? th? cu?i sau s?a, v? contact sheet bao g?m p1/p2 ??u/gi?a/cu?i, c?c c?nh code/ghi ch?. C?c khung ?? xem ?? d?u, kh?ng tr?n khung; nh?n AI kh?ng c?n b? ph? ?? ch?ng. ?nh g?c v? contact sheet ? assets/qc_*.jpg. ??y l? ki?m theo m?u khung, kh?ng tuy?n b? ?? nghe/duy?t to?n b? video b?ng tai.
- ??i chi?u SRT: nguy?n v?n to?n b? l?i script, max 28 k? t?/d?ng, t?i ?a 2 d?ng/cue; thay ??i d?ng th?c t? trong timeline c?ch nhau >=2.2s; C?o c? l?p gh?p su?t video. K?t qu?: assets/qc_content.json.
- qc-publish: pass. C?nh b?o duy nh?t sources tr?ng l? c? ch? ??ch: script kh?ng s? d?ng s? li?u/s? ki?n c?n d?n ngu?n. Nh?n AI true v? c?u khai b?o k?t th?c m? t?/caption c? ba n?n t?ng.
- C?n gi?m ??c nghe l?i assets/vo/_check.wav v? ?m thanh th?nh ph?m khi review ?? ??nh gi? ph?t ?m/t? nhi?n. Kh?ng ??i gi?ng, kh?ng th?m gi?ng th? ba, kh?ng tuy?n b? C?o nh?p mi?ng.
- Gi? teaser theo m?c ??nh E01 ??ng tr??c E02 m?t ng?y. Metadata ?? xu?t TikTok full; Facebook p1/p2; YouTube full d?ng video th??ng theo plan, c?c n?a c? s?n n?u ch?n Shorts. Kh?ng x?c nh?n tr?n n?n t?ng ch?a ???c ki?m ch?ng; kh?ng ??ng t? ??ng.

### S? ?o th?c t? v? k?t qu? qc-video
```json
{
  "full": {
    "file": "D:\\Agent Video Studio\\content\\it\\T1-phong-van-it-trong-thoi-dai-ai\\ep01\\final\\IT-T1-E01_full.mp4",
    "pass": true,
    "info": {
      "duration_s": 249.1,
      "size_mb": 11.7,
      "video": "h264 1080x1920 yuv420p",
      "audio": "aac 48000Hz",
      "fps": 30,
      "mean_volume_db": -15.8,
      "max_volume_db": -1.9
    },
    "fails": [],
    "warns": [],
    "loudness_measured": {
      "input_i": "-14.32",
      "input_tp": "-1.90",
      "input_lra": "6.10",
      "input_thresh": "-24.81",
      "output_i": "-13.98",
      "output_tp": "-1.50",
      "output_lra": "6.00",
      "output_thresh": "-24.46",
      "normalization_type": "dynamic",
      "target_offset": "-0.02"
    },
    "faststart": true
  },
  "p1": {
    "file": "D:\\Agent Video Studio\\content\\it\\T1-phong-van-it-trong-thoi-dai-ai\\ep01\\final\\IT-T1-E01_p1.mp4",
    "pass": true,
    "info": {
      "duration_s": 125.1,
      "size_mb": 5.9,
      "video": "h264 1080x1920 yuv420p",
      "audio": "aac 48000Hz",
      "fps": 30,
      "mean_volume_db": -15.6,
      "max_volume_db": -1.9
    },
    "fails": [],
    "warns": [],
    "loudness_measured": {
      "input_i": "-14.39",
      "input_tp": "-1.92",
      "input_lra": "5.80",
      "input_thresh": "-24.84",
      "output_i": "-14.08",
      "output_tp": "-1.50",
      "output_lra": "5.80",
      "output_thresh": "-24.54",
      "normalization_type": "dynamic",
      "target_offset": "0.08"
    },
    "faststart": true
  },
  "p2": {
    "file": "D:\\Agent Video Studio\\content\\it\\T1-phong-van-it-trong-thoi-dai-ai\\ep01\\final\\IT-T1-E01_p2.mp4",
    "pass": true,
    "info": {
      "duration_s": 132.93,
      "size_mb": 6.3,
      "video": "h264 1080x1920 yuv420p",
      "audio": "aac 48000Hz",
      "fps": 30,
      "mean_volume_db": -15.9,
      "max_volume_db": -1.9
    },
    "fails": [],
    "warns": [],
    "loudness_measured": {
      "input_i": "-14.32",
      "input_tp": "-1.90",
      "input_lra": "5.70",
      "input_thresh": "-24.81",
      "output_i": "-13.90",
      "output_tp": "-1.50",
      "output_lra": "5.70",
      "output_thresh": "-24.39",
      "normalization_type": "dynamic",
      "target_offset": "-0.10"
    },
    "faststart": true
  },
  "9x16": {
    "file": "D:\\Agent Video Studio\\content\\it\\T1-phong-van-it-trong-thoi-dai-ai\\ep01\\final\\IT-T1-E01_9x16.mp4",
    "pass": true,
    "info": {
      "duration_s": 249.1,
      "size_mb": 11.7,
      "video": "h264 1080x1920 yuv420p",
      "audio": "aac 48000Hz",
      "fps": 30,
      "mean_volume_db": -15.8,
      "max_volume_db": -1.9
    },
    "fails": [],
    "warns": [],
    "loudness_measured": {
      "input_i": "-14.32",
      "input_tp": "-1.90",
      "input_lra": "6.10",
      "input_thresh": "-24.81",
      "output_i": "-13.98",
      "output_tp": "-1.50",
      "output_lra": "6.00",
      "output_thresh": "-24.46",
      "normalization_type": "dynamic",
      "target_offset": "-0.02"
    },
    "faststart": true
  }
}
```

### K?t qu? qc-publish
```json
{
  "file": "D:\\Agent Video Studio\\content\\it\\T1-phong-van-it-trong-thoi-dai-ai\\ep01\\final\\publish.json",
  "pass": true,
  "fails": [],
  "warns": [
    "sources trống: mọi sự kiện/số liệu cần có nguồn"
  ]
}
```

### Danh s?ch th?nh ph?m
- final/captions.srt ? 5866 bytes
- final/captions_p1.srt ? 3073 bytes
- final/captions_p2.srt ? 3037 bytes
- final/cover.png ? 400108 bytes
- final/IT-T1-E01_9x16.mp4 ? 12259976 bytes
- final/IT-T1-E01_full.mp4 ? 12259976 bytes
- final/IT-T1-E01_p1.mp4 ? 6210167 bytes
- final/IT-T1-E01_p2.mp4 ? 6641301 bytes
- final/publish.json ? 3907 bytes
- final/thumbnail.jpg ? 120971 bytes

### Ti?p t?c / t?i d?ng
- C?c script n?m trong assets/: produce_voice.py (b? qua WAV ?? c?), prepare.py (t?o nguy?n li?u n?n), publish.py, fix_qc.py (s?a b? c?c/headroom), render.py, check_content.py, qc_final.py. T?i d?ng n?n b?ng prepare.py c?n ch?y publish.py r?i fix_qc.py ?? ?p s?a QC ?? x?c nh?n; kh?ng ch?y ?? nguy?n li?u cu?i n?u kh?ng c?n.
- L?i thumbnail ?? x? l? ri?ng b?ng ffmpeg -ss 0.5; thumbnail.jpg t?n t?i.
- File QC cu?i: assets/qc_final.json, assets/qc_publish.json, assets/qc_content.json. C?c MOV/MP4 trung gian ???c gi? ?? ti?p t?c/ch?nh s?a; ch? final/ l? th?nh ph?m giao review.


## QC (support) 2026-11-17
Phán quyết: **PASS (có cảnh báo nhỏ)** -> chuyển `ready`. Chưa ai nghe giọng bằng tai; giám đốc cần nghe `assets/vo/_check.wav` và bản full trước khi đăng.

### Số đo qc-video (chạy lại)
| File | Thời lượng | Video | Audio | mean/max dB | Kết quả |
|---|---|---|---|---|---|
| full | 249.1s | h264 1080x1920 yuv420p 30fps | aac 48k | -15.8 / -1.9 | chỉ fail "dài > 60s" |
| p1 | 125.1s | như trên | như trên | -15.6 / -1.9 | chỉ fail "dài > 60s" |
| p2 | 132.93s | như trên | như trên | -15.9 / -1.9 | chỉ fail "dài > 60s" |
- **Ngoại lệ độ dài:** brief giám đốc đặt rõ mỗi tập ~4 phút (khác chuẩn 15-45s/60s của qc-video). plan.md mục 7 tiêu chí 2: full trong [3:45, 4:15], p1/p2 trong [1:45, 2:30]; cả 3 bản nằm trong khoảng. Fail "> 60s" là ngoại lệ được brief cho phép, KHÔNG coi là lỗi.
- Loudness đo lại full: -14.3 LUFS, true peak -1.9 dBFS (đạt -14 +-1 và <= -1.5). p1/p2 lấy theo số Codex đo trên file (-14.39 / -14.32 LUFS, TP -1.9), tôi chưa đo lại riêng hai bản này. Giọng vào ngay ~0.4s.
- Dung lượng 11.7 / 5.9 / 6.3 MB (<= 250 MB). `_9x16.mp4` giống từng byte `_full.mp4`. Có captions.srt, captions_p1/p2.srt, cover.png, thumbnail.jpg. SRT khớp script theo `assets/qc_content.json` (Codex tự đo); tôi đối chiếu tay các cue 28-44.

### Khung hình đã xem (ảnh lưu `assets/qc2_*.jpg`)
- full: 0.5, 1.8, 30, 60, 100, 121.5, 123, 125, 126.5, 170, 200, 240, 245, 247.5, 248.8 giây (15 khung; các khung 121.5-128 chỉ đọc 121.5, 123, 126.5).
- p1: 0.5, 62, 121, 124.8 giây. p2: 0.5, 3.5, 66, 132.5 giây. Cộng thumbnail.jpg.
- Kết quả: tiếng Việt đủ dấu; chữ trong y 250-1500, lề >= 90px; huy hiệu "Tình huống minh hoạ" có ở mọi khung; hook (chữ lớn + Cáo wave + giọng) hiện ngay 0.5s ở full/p1/p2; p2 có hook "CÓ NÊN DÁN MẬT KHẨU CHO AI?" rồi thẻ hư cấu; thẻ hai cột có ghi chú miễn trừ (170s); tem "Đáp ổn" (200s); không logo/watermark lạ.
- Dòng phụ đề cuối (lần trước nghi bị cắt): đã ổn. Cuối full gồm 3 cue "Hẹn bạn buổi họp sau nhé! Thả / tim cho Cáo, coi như duyệt báo / cáo nha!" kết thúc ~4:05.8, video dài 4:09.1; 245s hiện "cáo nha!", 247.5 và 248.8 là thẻ cuối sạch. Câu khai báo AI nằm dòng riêng, không chồng phụ đề hay huy hiệu.

### Cảnh báo (không chặn ready, nên sửa nếu làm lại)
1. Thẻ câu hỏi M1 ngắt trang giữa cụm "mật | khẩu" (full ~2:01-2:07: trang 1 "Đang kẹt, trong code có mật", trang 2 "khẩu. Nhờ AI sao cho an toàn?"). Nên chia trang theo cụm nghĩa.
2. Script ghi nhãn `CÂU 3/6` trên thẻ M1 nhưng khung hình không có nhãn này (thanh "Câu n/6" chỉ hiện ở thẻ chat).
3. Thẻ cuối: "hư / cấu." xuống dòng mồ côi; dòng khai báo AI lặp 2 lần (chữ lớn + dòng nhỏ). Phụ đề đốt chia cue giữa câu ("Mà code AI viết | vẫn có thể đúng"; "Thả | tim cho Cáo"); "cáo nha!" đè nhẹ chóp tai Cáo ở 245s.
4. Mục "Kết quả cuối" phía trên bị lỗi mã hoá (dấu "?") do Codex ghi; không sửa.
5. publish.json: `sources` rỗng (đúng ý, kịch bản không dùng số liệu); Facebook không có `title` (spec cho phép rỗng).

### Giám đốc cần làm
- Nghe `assets/vo/_check.wav` (phát âm AI, IT, code, Alo, Note) và xem/nghe bản full một lượt; chưa ai nghe giọng bằng tai.
- Ảnh Cáo: kiểm điều khoản thương mại (docs/mascot.md). Chưa kiểm chứng trần thời lượng nền tảng (plan mục 4.3/6).
