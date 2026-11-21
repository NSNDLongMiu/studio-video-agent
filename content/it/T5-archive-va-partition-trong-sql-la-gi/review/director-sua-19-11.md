# Yêu cầu sửa của giám đốc sau khi xem IT-T5-E01 (19/11/2026)

Bản xem: `ep01/final/IT-T5-E01_9x16.mp4` (44,1 s, đã `ready` lúc QC lần 3). Giám đốc nhận xét “ổn” và yêu cầu **hai chỗ sửa**:

1. Bỏ hai nhãn chữ «AI tạo» và «Ví dụ dựng» trên hình; tuyệt đối không có chữ/hình thừa.
2. Các từ tiếng Anh đang bị đọc như tiếng Việt; đọc lại các từ này.

## Nguyên nhân (đã kiểm bằng số, không bằng tai)

- **Nhãn:** do `plan.md` có mục “Chữ bắt buộc tuân thủ”, sinh ra từ ngoại lệ trong Y1 (`docs/chat-luong-xem.md`). Producer vẽ hai nhãn ở `assets/_scratch/graphics.py`. Khai báo AI không phụ thuộc nhãn trên hình: `tools/qc-publish.mjs` chỉ kiểm `publish.json` (`ai_generated_content`, `ai_disclosure` ở cuối mô tả cả 3 nền tảng).
- **Phát âm:** từ điển Y8 do xưởng soạn (18/11) ghi cách đọc bằng phiên âm kiểu Việt (`pa-ti-sần`, `ác-kaiv`, `kwi-ri`, `pốt-grét kiu eo`). Bộ chuyển chữ→âm vị của VieNeu (sea-g2p) tự đọc đúng âm Anh khi để nguyên chữ gốc, nhưng chữ Việt hoá bị chuyển thành âm Việt:

  | Chữ đưa TTS | Âm vị VieNeu nhận | Nghe như |
  |---|---|---|
  | `pa-ti-sần` (bản cũ) | `pˈaː2 t̪ˈi sˈə2n` | tiếng Việt |
  | `Partition` (mới) | `pɑːɹtˈɪʃən` | tiếng Anh |
  | `ác-kaiv` (cũ) → `Archive` (mới) | `ˈaːɜc kˈaɪ vˈiː` → `ˈɑːɹkaɪv` | Việt → Anh |
  | `kwi-ri` (cũ) → `Query` (mới) | `kwˈaɪ ɹˈi` → `kwˈiəɹi` | Việt → Anh |
  | `pốt-grét kiu eo` (cũ) → `Postgress queue ell` (mới) | `pˈoɜt̪ ðˈe7 ɹˈɛɜt̪ kˈiw ˈɛw` → `pˈoʊst ɡɹˈɛs kjˈuː ˈɛl` | Việt → “post-gres-Q-L” |

  Phát hiện này đúng với cả 57 mục của từ điển chung; đã sửa chung (xem dưới) thay vì chỉ vá T5.

## Việc Claude (thư ký) đã làm

- Từ điển `tools/voice/pronunciation.json`: 58 mục giữ chữ tiếng Anh gốc, chỉ đổi sang chữ đánh vần tiếng Anh ở các mục bị đọc sai theo ngữ cảnh (UI, UX, IDE, AI, URL, HTTPS, INSERT, UPDATE, DELETE). Thêm công cụ `tools/voice/phonemes.py` để agent kiểm âm vị khi không nghe được; thêm test (`studio/test/phonemes.test.mjs`).
- Luật: Y1 không còn ngoại lệ nhãn; Y8 ghi nguyên tắc “giữ chữ Anh, cấm phiên âm Việt” (docs, AGENTS.md, skill Producer/Kịch bản/Đạo diễn, agent QC, schema, `LOI-NHAN-MAY-MOI.md`).
- T5: sửa `script.md`, `plan.md`, `concept.md`, `storyboard.md` và `storyboard.json` (chỉ gỡ mô tả hai nhãn; **không đổi cảnh, mốc hay hình**, vẫn `APPROVED`); từ điển riêng `assets/voice/pronunciation.local.json` (PostgreSQL → `Postgress queue ell`); thêm mục “Yêu cầu sửa của giám đốc” đầu `ep01/notes.md` cho Producer. Dry-run: `pronounce.mjs check` mã 0, `phonemes.py --lines` mã 0 cho cả 5 lần xuất hiện (Lời 4, 7, 11, 12, 15).

## Chưa kiểm (chờ giám đốc nghe)

Agent không nghe được âm thanh. Âm vị đúng là điều kiện cần, không chứng minh giọng đọc tự nhiên: phát âm các từ Anh trong giọng Minh Đức, tốc độ và nhịp nghỉ vẫn **CHƯA KIỂM — giám đốc nghe**.
