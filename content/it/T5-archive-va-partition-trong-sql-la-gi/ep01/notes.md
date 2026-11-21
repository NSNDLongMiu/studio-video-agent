# IT-T5-E01 · Chia rồi, vẫn đầy?

## Bản sửa theo yêu cầu ngày 19/11/2026

Dựng lại phim và bìa từ storyboard APPROVED bằng Pillow + FFmpeg, chỉ giữ chữ kỹ thuật của kịch bản và phụ đề. Thu lại Lời 4, 7, 11, 12, 15 và bốn mẫu thuật ngữ bằng VieNeu-TTS Minh Đức. Các câu còn lại dùng chính các take của bản trước. Giữ tài sản hình, bố cục, chip biểu tượng và thứ tự chuyển động đã duyệt.

## Thành phẩm

- [IT-T5-E01_9x16.mp4](final/IT-T5-E01_9x16.mp4)
- [thumbnail.jpg](final/thumbnail.jpg)
- [captions.srt](final/captions.srt)
- [publish.json](final/publish.json)

## Thời lượng và nhịp

Các câu có dấu phẩy dùng hai cụm đọc với một khoảng nghỉ được chèn theo kịch bản. Tách phần lặng ở mép take mới trước khi ghép nghỉ, giữ đủ 18 lời và các hệ số `atempo` 0,97 / 1,00 / 1,03.

Bản xuất **44,63 giây**, dài hơn bản trước 44,10 giây **0,53 giây** và ngoài mục tiêu 38–42 giây, trong giới hạn nghiệm thu 15–45 giây. Ngân sách ước lượng 41,96 giây. Tổng lời đo sau xử lý mép clip khoảng 31,86 giây. Đã đề nghị Kịch bản và Đạo diễn hình ảnh duyệt lại timeline qua nhật ký Studio (R8). Lời 4, 7, 11, 12, 15 làm đổi độ dài các nhịp tương ứng. Mốc hình bên trong mỗi nhịp được căn theo phần lời và phần nghỉ mới. Chữ báo trạng thái ở cảnh S07-L17 tắt tại 41,587 giây, tương ứng mốc storyboard 1,14 giây của cảnh.

| Cảnh | Mở cảnh (s) | Hết lời (s) | Hết cảnh (s) | atempo | Nghỉ dấu phẩy / sau câu (s) |
|---|---:|---:|---:|---:|---:|
| S01-L01 | 0,000 | 1,193 | 1,993 | 1,03 | 0,20 / 0,80 |
| S01-L02 | 1,993 | 3,137 | 3,537 | 1,03 | 0,00 / 0,40 |
| S01-L03 | 3,537 | 4,534 | 5,334 | 1,03 | 0,00 / 0,80 |
| S02-L04 | 5,334 | 7,886 | 8,436 | 0,97 | 0,00 / 0,55 |
| S02-L05 | 8,436 | 10,669 | 11,219 | 0,97 | 0,25 / 0,55 |
| S02-L06 | 11,219 | 13,021 | 13,721 | 0,97 | 0,00 / 0,70 |
| S02-L07 | 13,721 | 16,484 | 16,984 | 0,97 | 0,20 / 0,50 |
| S02-L08 | 16,984 | 17,748 | 18,648 | 1,00 | 0,00 / 0,90 |
| S03-L09 | 18,648 | 20,891 | 21,941 | 0,97 | 0,25 / 1,05 |
| S03-L10 | 21,941 | 22,908 | 23,708 | 1,03 | 0,00 / 0,80 |
| S04-L11 | 23,708 | 27,252 | 28,102 | 0,97 | 0,00 / 0,85 |
| S05-L12 | 28,102 | 31,206 | 31,606 | 0,97 | 0,20 / 0,40 |
| S05-L13 | 31,606 | 32,794 | 33,194 | 0,97 | 0,00 / 0,40 |
| S05-L14 | 33,194 | 34,205 | 34,605 | 0,97 | 0,00 / 0,40 |
| S06-L15 | 34,605 | 37,693 | 38,093 | 0,97 | 0,00 / 0,40 |
| S06-L16 | 38,093 | 39,890 | 40,490 | 0,97 | 0,20 / 0,60 |
| S07-L17 | 40,490 | 41,587 | 42,287 | 1,03 | 0,00 / 0,70 |
| S07-L18 | 42,287 | 43,957 | 44,633 | 1,03 | 0,00 / 0,68 |

Hai tiếng báo tự tổng hợp dài 0,12 giây ở 1,46 và 41,10 giây. Đuôi đo trên AAC bằng `silencedetect=noise=-40dB:d=0.18` là **0,691 giây**. Dấu nhận dạng mở ra và thẻ cũ vào hết hốc ở đoạn cuối. [Số đo toàn bộ khoảng lặng](assets/_scratch/qc/silence.log), [timeline theo giọng thật](assets/_scratch/timeline.json).

**CHƯA KIỂM — giám đốc nghe để duyệt độ tự nhiên, tốc độ cảm nhận, nhịp và phát âm.**

## Nguyên liệu

- Ba PNG `surprised`, `point_up`, `thumbs_up` lấy từ `brand/cao/poses/`. Pillow ghép trực tiếp sticker đúng hộp bao chỉ định trong storyboard. Dáng mở nhún nguyên lớp theo nhịp lỗi, hai dáng còn lại giữ tĩnh.
- Nền ba lớp từ `tools/backgrounds/make_background.py`. Office seed 5, màu nhấn `#5CAAD8`, thêm silhouette người xử lý đơn. Incident seed 5, màu mặc định của công cụ. Database seed 5 cho bảng và bộ lọc, seed 17 cho quy trình lưu, cùng màu nhấn mặc định. Chuyển mềm phần nền, giữ cùng quy ước màu và đạo cụ.
- Thẻ đơn, vỏ kho, ray, khay, khớp, ổ khoá, chip và chữ vẽ cục bộ bằng Pillow với Segoe UI Semibold. ASS ở PlayRes 1080×1920 dùng để đốt phụ đề với hai cao độ.
- VieNeu-TTS Minh Đức cục bộ, các bản đọc riêng trong `assets/voice/`. Đường tiếng gồm thoại và hai tiếng báo tổng hợp cục bộ. Sau `loudnorm=I=-14:TP=-1.5:LRA=11`, giảm 0,35 dB để luồng AAC giữ đỉnh dưới −1,5 dBTP.

## Kỹ thuật

`node tools/qc-video.mjs final/IT-T5-E01_9x16.mp4 --min 15 --max 45`

```json
{
  "pass": true,
  "info": {
    "duration_s": 44.63,
    "size_mb": 6.5,
    "video": "h264 1080x1920 yuv420p",
    "audio": "aac 48000Hz",
    "fps": 30,
    "mean_volume_db": -14.9,
    "max_volume_db": -1.8,
    "lufs_i": -14.85,
    "lra": 1.9,
    "true_peak_dbtp": -1.83
  },
  "fails": [],
  "warns": []
}
```

`ffprobe` đo 44.633333 giây, 6805419 byte, 1339 khung hình, SAR 1:1. Kiểm cấu trúc MP4 thấy `moov` trước `mdat`. SRT có 19 cue từ đủ 18 lời, ngắt theo cụm, tối đa hai dòng. Đã đối chiếu nguyên văn với kết quả `pronounce apply`.

## Tuân thủ

Tiêu đề, mô tả và hashtag theo script cho cả ba nền tảng. `ai_generated_content` là `true` và câu khai báo AI ở cuối mỗi mô tả. `node tools/qc-publish.mjs final/publish.json` trả `{"pass": true, "fails": [], "warns": []}`.

Đã đối chiếu giải thích phân vùng, bỏ qua phân vùng, thứ tự lưu và lưu ý khoá khi tách với tài liệu PostgreSQL 18. [Phân vùng bảng](https://www.postgresql.org/docs/18/ddl-partitioning.html), [ALTER TABLE](https://www.postgresql.org/docs/18/sql-altertable.html#SQL-ALTERTABLE-DESC), [Theo dõi dung lượng đĩa](https://www.postgresql.org/docs/18/diskusage.html#DISK-FULL-FAILURE), [Sao lưu và khôi phục](https://www.postgresql.org/docs/18/backup-dump.html).

## Trải nghiệm xem

| Nhóm | Kết quả Producer | Bằng chứng |
|---|---|---|
| Y1 | Đạt kiểm hình | Chữ kỹ thuật theo script. Tối đa 3 nhóm chữ kỹ thuật tại các cảnh ghép khay, hiện hai kho và báo trạng thái. Cỡ 72/56 px, phụ đề gốc 56 px và chuyển dải theo Cáo. Đã mở các khung 360×640 để so dấu và vùng an toàn. |
| Y2 | Đạt kiểm hình | Cáo ở 0,00–4,53, 18,65–23,71, và 40,49–44,63 giây, khoảng 13,74 giây (30,8%). |
| Y3 | Đạt kiểm hình | Hộp bao ba dáng 210×352, 210×308 và 220×343 px, tương ứng khoảng 19,4–20,4% chiều rộng khung. Phụ đề ở trên Cáo. |
| Y4 | Đạt kiểm hình | Office → incident → database → office. Database đổi seed khi vào kho lưu. Kiểm các lớp và ánh sáng trên khung thật. |
| Y5 | Đạt kiểm hình và mốc | Thẻ sọc bị bật lúc 1,46 giây, chỉ báo gắn với đường ghi trước giây 5. Lời xác nhận vạch còn đỏ kết thúc 22,91 giây. Bản sao sang kho riêng và đủ ba cặp dấu mới có ✓. Khay gốc rời nguồn khoảng 40,01 giây, vạch bắt đầu hạ sau đó khoảng 40,17 giây. Thẻ sọc lưu thành công và thẻ tam giác đã kiểm ra đúng ô tra ở cuối. |
| Y6 | Đã đo, chờ nghe | Hệ số theo nhãn tốc độ và mốc từng câu ở bảng trên. Giám đốc nghe độ tự nhiên và tốc độ cảm nhận. |
| Y7 | Đã đo, chờ nghe | Mốc nghỉ dài đi với chuyển động, các số đo ở `silence.log`. Khoảng nghỉ sau hook có tiếng báo ở giữa. Đuôi 0,691 giây. |
| Y8 | Đã chuẩn hoá, chờ nghe | `pronounce check` trả 0 mục lạ. `phonemes.py --lines` mã 0, đạt ở cả năm lượt thuật ngữ trong câu. Bốn mẫu thuật ngữ bên dưới. |

- R3 và R4 trước ghép đã mở chuỗi khung 360×640. Sau ghép đối chiếu lại điều kiện ghi thất bại/thành công, dấu phân nhóm, đường lọc dừng ở khay tròn, bản sao giữ nguyên dấu và nguồn còn đầy tới khi bỏ. Đo thay đổi vùng minh hoạ ở 10 khung/giây cho 0 khoảng ứng viên tĩnh từ 1,4 giây với ngưỡng ghi trong `motion-warning.json`.
- R5: hộp màn hình/kho chính cao 610 px. Mặt bảng khoảng 607–669 px, riêng nhịp chuyển dòng dùng 723 px để chừa hành lang dưới các thẻ.
- R7: bìa lấy từ khung lỗi khoảng 1,63 giây theo mốc đã căn lại. Đã mở thật ở 180×320. Đọc được hai nhãn kỹ thuật hook và thấy vạch đỏ, thẻ sọc, dấu lỗi và Cáo.
- Khung tại 41,567 giây còn chữ báo trạng thái dưới kho. Ở khung kế tiếp, chữ đã tắt và phụ đề vẫn đọc được.
- Năm câu hỏi người xem lạ. Trong 3 giây thấy đơn không lưu dù có ba ngăn. Trước giây 5 thấy ray nối chỉ báo kho. Khi tắt lời, theo được các bước ghép, lọc, chép, tra kiểm và bỏ nhờ thẻ có dấu hình cùng trạng thái vạch. Ở 360×640, chữ và minh hoạ được kiểm theo các khung dưới đây. Đoạn cuối ghi lại đơn mới, trả một đơn cũ và giữ câu hỏi trong phụ đề cùng đuôi dưới 0,70 giây.

[Mở đầu và vào bảng](assets/_scratch/qc/revision-board-0.jpg), [phân vùng và lọc](assets/_scratch/qc/revision-board-1.jpg), [lưu và kiểm](assets/_scratch/qc/revision-board-2.jpg), [kết](assets/_scratch/qc/revision-board-3.jpg), [bìa 180×320](assets/_scratch/qc/thumbnail-180.jpg).

### Mẫu nghe thuật ngữ

| Thuật ngữ | Chữ đưa TTS | Âm vị VieNeu | Từ điển | Clip | Duyệt nghe |
|---|---|---|---|---|---|
| Partition | Partition | pɑːɹtˈɪʃən | chung | [Nghe mẫu](assets/voice/term-check/partition.wav) | CHƯA KIỂM |
| Query | Query | kwˈiəɹi | chung | [Nghe mẫu](assets/voice/term-check/query.wav) | CHƯA KIỂM |
| Archive | Archive | ˈɑːɹkaɪv | chung | [Nghe mẫu](assets/voice/term-check/archive.wav) | CHƯA KIỂM |
| PostgreSQL | Postgress queue ell | pˈoʊst ɡɹˈɛs kjˈuː ˈɛl | riêng | [Nghe mẫu](assets/voice/term-check/postgresql.wav) | CHƯA KIỂM |

[Kết quả kiểm từ điển](assets/_scratch/qc/pronounce-check.json), [văn bản đưa vào TTS](assets/voice/apply.json), [kiểm âm vị theo câu](assets/_scratch/qc/phonemes.txt).

## QC — lượt 4 (Claude, 19/11/2026) — PASS (phần đã kiểm), còn CHƯA KIỂM chờ giám đốc nghe

Đối chiếu lỗi các lượt trước (nhãn «AI tạo»/«Ví dụ dựng» trên hình, phát âm thuật ngữ, đuôi, phụ đề lệch): nhãn trên hình đã gỡ, khai báo AI nằm ở `publish.json` (`ai_generated_content: true` + câu khai báo trong cả ba mô tả) theo quyết định 19/11/2026; không còn lỗi cũ trên bản dựng hiện tại.

**Số đo `qc-video` (chạy lại):** pass, 44,63 s, 1080×1920, h264 yuv420p, AAC 48 kHz, 30 fps, 6,5 MB, mean −14,9 dB, max −1,8 dB, −14,85 LUFS, LRA 1,9, true peak −1,83 dBTP; không fail/warn. `silencedetect`: đuôi im 0,691 s (≤ 0,7); nghỉ sau câu 0,43–1,08 s, nghỉ giữa câu 0,22–0,36 s khớp bảng producer. Xem 22 khung ở 360×640 (mỗi 2 s, 3 bảng ghép) + 3 khung cắt full-res (12 s, 38,5 s, 41 s) + bìa 180×320 = 26 hình.

**KỸ THUẬT — ĐẠT.** 9:16, 15–45 s, không nhạc nền, chuẩn H.264/AAC; `final/` đủ 4 file, không file thừa. SRT 19 cue.
**TUÂN THỦ — ĐẠT.** `publish.json` đủ TikTok/Facebook/YouTube (tiêu đề, mô tả, hashtag), có khai báo AI, mô tả nêu "ví dụ dựng/giả lập"; không nhãn AI đốt trên hình (đúng chuẩn 19/11). Nội dung đúng: partition chia dòng theo khoá và không nén/xoá (Lời 9); Archive là quy trình, không phải lệnh (Lời 12, chip «Tuỳ hệ quản trị» 27,9–29,8 s); khoá khi tách nêu đúng PostgreSQL; tình huống mở không giả sự kiện thật. Hình chỉ có đồ hoạ Pillow, nền `make_background.py`, ba dáng Cáo của `brand/cao/`; `library/LICENSES.md` không có dòng thật nhưng video không dùng hình/clip ngoài hay hình AI cần ghi (đúng ghi chú đầu sổ).
**TRẢI NGHIỆM — ĐẠT phần kiểm được bằng mắt/số đo; Y6–Y8 phần nghe CHƯA KIỂM.**

| Nhóm | Kết quả | Bằng chứng |
|---|---|---|
| Y1 | Đạt | Chữ trên hình chỉ «Tạo đơn», «Kho chính/Kho lưu», «Ngày tạo», «Tháng 1–3», «Partition», «Khoá bảng», «Tuỳ hệ quản trị», «đã chuyển sang kho lưu» (đều có trong cột Chữ trên màn hình); không nhãn AI/Ví dụ dựng; chip chương là biểu tượng. |
| Y2 | Đạt | Cáo ở 0–5,3, 18,6–23,7, 40,5–44,6 s (~31%), ẩn ở giải thích sâu (5,3–18,6; 23,7–40,5). |
| Y3 | Đạt | Cáo ~19–20% bề rộng; minh hoạ chiếm phần lớn khung giải thích. Lưu ý nhẹ: khung hook/kết, nửa dưới khá trống. |
| Y4 | Đạt | office → incident (đỏ) → database/kho → office; nền đổi theo ngữ cảnh, có chiều sâu. |
| Y5 | Đạt | Mở bằng đơn không lưu được (~1,4 s), vạch đỏ nối kho trước giây 5, Lời 10 trả đúng vạch ở 21,7 s, kết quay về đơn mới lưu được + câu hỏi cuối. |
| Y6 | CHƯA KIỂM | Hệ số atempo 0,97/1,00/1,03 theo bảng; cần nghe tốc độ cảm nhận. |
| Y7 | Số đo đạt, nghe CHƯA KIỂM | Nghỉ ở khoảng khớp dải Y7 (xem số đo trên), kèm chuyển động hình; đuôi 0,691 s. |
| Y8 | Văn bản đạt, nghe CHƯA KIỂM | Theo ghi nhận producer: `pronounce check` 0 mục lạ, `phonemes.py --lines` mã 0; chưa chạy lại ở lượt này; cần nghe 4 clip mẫu. |

**5 câu hỏi người xem lạ:** (1) Đạt, 0–1,2 s: «Chia rồi, vẫn đầy?» + đơn bị chặn, vạch đỏ. (2) Đạt, 1,4–4,4 s: ×, chỉ báo «Kho chính». (3) Đạt, mỗi cảnh một ý; tắt tiếng vẫn theo được ghép khay → lọc → chép → khoá → bỏ nhờ hình/chip. (4) Đạt, hình đổi nhìn ra ở 360×640, không có khoảng tĩnh ≥ 1,5 s; phụ đề là chữ đọc lại lời nhưng là phụ đề chuẩn, chữ trên hình là chữ kỹ thuật. (5) Đạt, kết trả vấn đề + câu hỏi gọi bình luận; đuôi 0,691 s; bìa 180×320 đọc được «Tạo đơn/Kho chính», vạch đỏ, Cáo.

**Ghi nhận nhỏ (không chặn PASS):** (a) 44,63 s vượt mục tiêu 38–42 s của kịch bản nhưng trong trần 45 s (đã ghi ở trên). (b) 40,5–41,6 s chip «đã chuyển sang kho lưu» sát phụ đề (~10 px, không chồng); kịch bản ghi tắt 39,16 s, bản dựng tắt 41,59 s theo mốc storyboard mới. (c) Nửa dưới khung hook/kết trống.
**Chờ giám đốc nghe:** tốc độ cảm nhận, nhịp nghỉ, phát âm Partition/Query/Archive/PostgreSQL (clip ở `assets/voice/term-check/`).
