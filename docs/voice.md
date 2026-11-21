# Giọng đọc tiếng Việt cho Cáo văn phòng — đề xuất giọng miền Bắc và miền Nam

> Cập nhật 16/11/2026, **sửa lại 17/11/2026**: yêu cầu ban đầu là một giọng Bắc + một giọng Nam, nhưng giám đốc đã đổi quyết định — **dùng toàn giọng miền Bắc, không cần giọng Nam nữa**. **Cập nhật 19/11/2026: giám đốc nghe mẫu và chọn bộ 4 giọng Bắc mới (mục "Giọng chính thức"), thay Minh Đức và Quỳnh Anh.** Nội dung **luôn gắn nhãn AI**; văn phong trẻ trung, câu chữ văn phòng (xem `docs/mascot.md`).
> **Trung thực về mức kiểm chứng:** tôi (Claude) không nghe được âm thanh nên **chưa đánh giá được chất lượng giọng nào**. Dưới đây chỉ là những gì đọc được từ trang chính thức/kho mã nguồn; chất lượng do giám đốc nghe và quyết. Tôi cũng chưa tạo được mẫu giọng: việc cài gói VieNeu-TTS vào môi trường thử bị chặn bởi quyền của phiên này, nên mẫu sẽ tạo trên máy triển khai của giám đốc (lệnh ở cuối).

## Đã chốt (16/11/2026): chạy bằng CPU, không cần GPU
Máy triển khai dùng GPU AMD (không phải NVIDIA) nên bỏ đường CUDA của VieNeu. **Chốt dùng đường CPU/ONNX Runtime mặc định** (`uv sync`, không thêm `--extra cuda`) — lý do không lo lag:
- Đây là bước **dựng âm thanh chạy nền/hàng đợi** khi Codex sản xuất video, không phải thao tác chờ trực tiếp trên màn hình — có chậm vài chục giây cũng không ai "thấy" lag khi đang dùng máy.
- Số đo của tác giả: RTF 0,55–0,62 (fp32) — tức **nhanh hơn thời gian thực**, dựng 1 phút audio chỉ mất ~35 giây, đo trên CPU yếu hơn máy này (Core i5 đời 12, 6 luồng) so với CPU máy triển khai (i5-13400F, 10 lõi/16 luồng).
- Với nhịp 1 đội × 2 video/ngày như kế hoạch ban đầu, CPU chỉ bận vài chục giây mỗi lần tạo giọng — không đáng lo máy chậm khi làm việc khác cùng lúc.
- **Chưa đo thật trên máy này** — số liệu thật sẽ có khi chạy T6; nếu sau này mở nhiều đội chạy cùng lúc và thấy máy nặng, lúc đó mới cần xét lại (vd giảm `--extra` khác, giới hạn số luồng).

## Đề xuất chính: VieNeu-TTS v3 Turbo (chạy trên máy mình)
| | |
|---|---|
| Giọng có sẵn | **25 giọng** chia 3 miền (cập nhật 19/11/2026 theo bản VieNeu 3.8.4 cài trên máy, đọc từ `vieneu/assets/voices_v3_turbo.json`, có ghi giới tính, vùng và phong cách; danh sách cũ ghi từ README thiếu nhiều giọng Bắc). **Bắc – nam:** Adam bựa, Thiện Minh, Hải Đăng, Thiền Tâm Đức, Minh Đức, Phạm Tuyên, Xuân Vĩnh, Thanh Bình, Quốc Tuấn. **Bắc – nữ:** Trúc Ly, Mai Anh, Ngọc Huyền, Ngọc Linh, Đoan Trang, Quỳnh Anh. **Nam – nam:** Adam, Thái Sơn, Minh Triết, Đức Trí. **Nam – nữ:** Thùy Dung, Thục Đoan, Mỹ Duyên, Kim Thanh. **Trung:** Quang Sơn (nam), Ngọc Trân (nữ). Cột "featured" 1–10 trong tệp đó là các giọng tác giả chọn nổi bật (Adam bựa, Trúc Ly, Thiện Minh, Mai Anh, Hải Đăng, Thùy Dung, Thiền Tâm Đức, Ngọc Huyền, Quang Sơn, Ngọc Trân) |
| Nhân bản giọng | Có, từ đoạn mẫu 3–8 giây. **Chỉ dùng giọng của người đã đồng ý bằng văn bản** (README không nêu quy định đồng ý; đây là nguyên tắc của mình) |
| Giá | Miễn phí, chạy cục bộ |
| Giấy phép (đã kiểm) | **Apache-2.0** ở kho mã nguồn và ở cả 3 trọng số mô hình trên Hugging Face (v3 Turbo, v2, v1); hai thành phần phụ (neucodec, MOSS-Audio-Tokenizer-Nano) cũng Apache-2.0. Bản v4 là bản đóng, bán qua API/ứng dụng |
| Độ phổ biến | Kho 3,4 nghìn sao; mô hình v3 Turbo hơn 2,1 triệu lượt tải, cập nhật 23/9/2026 |
| Máy chạy | Windows được hỗ trợ. **Máy triển khai của giám đốc dùng GPU AMD Radeon RX 6600, không phải NVIDIA → đường GPU/CUDA của VieNeu không chạy được trên máy này (chỉ hỗ trợ NVIDIA qua CUDA; DirectML/ROCm cho AMD trên Windows không được dự án hỗ trợ chính thức, đã kiểm — xem ghi chú dưới). **Không cần GPU**: đường mặc định `uv sync` (không có đuôi `--extra cuda`) chạy bằng **ONNX Runtime trên CPU**, không cần `torch`/CUDA, và tác giả đã đo trên Core i5 đời 12, 6 luồng, ONNX Runtime 1.24: **v3 Turbo fp32 RTF 0,55–0,62** (nhanh hơn thời gian thực — 1 phút audio dựng trong ~33–37 giây), **int8 RTF 0,35–0,37** (nhanh hơn nữa nhưng cần CPU hỗ trợ VNNI, không có thể làm âm thanh méo — cần nghe kiểm trước khi dùng). CPU của máy triển khai (Intel Core i5-13400F, 10 lõi/16 luồng, có AVX-VNNI) **mới hơn và nhiều lõi hơn** máy tác giả đo, nên tốc độ thực tế nhiều khả năng tốt hơn con số trên — **chưa đo trên máy thật**. Đủ 25 giọng + nhân bản giọng vẫn dùng được trên đường CPU này, không bị cắt giảm |
| Rủi ro | Chưa ai trong team nghe; một số tính năng (Lồng tiếng, Tiktok Reel) chỉ có trong ứng dụng chính thức, không có ở bản mã nguồn mở; dự án trẻ, thay đổi nhanh |
| Nghe thử | Trang chủ https://vieneu.io · Colab https://colab.research.google.com/drive/1b9PO-lcGZX9pEkEwQmu8MfhSnjxKrALW · Mô hình https://huggingface.co/pnnbao-ump/VieNeu-TTS-v3-Turbo · Mã nguồn https://github.com/pnnbao97/VieNeu-TTS |

**Gợi ý rút gọn để nghe trước** (chỉ là danh sách mời nghe, không phải kết luận): Bắc — Phạm Tuyên, Quỳnh Anh, Ngọc Linh, Minh Đức; Nam — Thái Sơn, Minh Triết, Mỹ Duyên, Thục Đoan. Phạm Tuyên là giọng README dùng làm ví dụ chính.

## Phương án thay thế / đối chiếu (trả phí hoặc dịch vụ)
| Dịch vụ | Bắc / Nam | Chi phí và điều khoản — **đã kiểm gì** | Nghe thử |
|---|---|---|---|
| **ElevenLabs** | Thư viện giọng Việt (số lượng nơi ghi 122, nơi ghi 287–305, thay đổi theo thời gian). Nhãn vùng miền **do trang thứ ba gán**, vd Hoàng Đặng (Bắc, nam), Trieu Duong (Nam, nam trẻ) | Trang giá chính thức: **Free 10.000 credit/tháng và KHÔNG liệt kê giấy phép thương mại**; **Starter $6/tháng (30.000 credit) có "Commercial License"**. Tôi suy ra Starter khoảng 30 phút/tháng (từ ~10 phút của gói Free, chưa xác nhận). Quy định riêng của từng giọng trong Voice Library chưa kiểm | https://elevenlabs.io/voice-library · https://elevenlabs.io/text-to-speech/vietnamese |
| **Vbee** | Có giọng 3 miền; **nguồn không thống nhất** (một nơi ghi 18 giọng vùng miền, nơi khác ghi 200+ giọng Việt) | Có API và dùng thử. Giá chỉ thấy trên trang App Store (bên thứ ba, có thể cũ): Tiêu chuẩn $6,49/tháng, VIP $15,49/tháng. **Điều khoản dùng thương mại: chưa xác minh** → xem policy.vbee.vn hoặc hỏi hãng | https://vbee.vn/en |
| **Viettel AI** | Hai nguồn không khớp: bài của Viettel nêu Bắc nữ *Quỳnh Anh*, Trung nữ *Mai Ngọc*, Nam nữ *Diễm My*; ứng dụng App Store ghi Bắc 2 nữ + 1 nam, Nam 1 nam + 1 nữ | Đăng ký tài khoản để dùng miễn phí. **Giá và điều khoản thương mại: chưa xác minh** | https://viettelai.vn/en/chuyen-giong-noi |
| Azure Speech | `vi-VN-HoaiMyNeural` (nữ), `vi-VN-NamMinhNeural` (nam). **Không có tài liệu nào ghi giọng vùng miền** nên chưa đáp ứng chắc chắn yêu cầu Bắc/Nam | Tính phí theo ký tự (chưa kiểm bảng giá) | https://speech.microsoft.com/portal/voicegallery |
| Google Chirp 3 HD | Có hỗ trợ `vi-VN`; **không ghi vùng miền** | Chưa kiểm | https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd |
| FPT.AI | Một bài báo ghi gói cá nhân trên Console đã ngừng từ 29/8/2026, chuyển sang FPT AI Marketplace (**chỉ một nguồn, chưa kiểm**) | — | https://fpt.ai/vi/tts |
| Windows có sẵn | Chỉ có giọng tiếng Anh (David, Zira), đã kiểm trên máy này — **không dùng được** | — | — |

## Khuyến nghị
1. **Nghe thử VieNeu trước** (miễn phí, giấy phép sạch, chạy được trên PC mạnh của giám đốc): chọn trong các giọng Bắc ở trên, đọc cùng bộ câu mẫu.
2. **Đối chiếu một dịch vụ trả phí** (ElevenLabs Starter hoặc Vbee) **chỉ khi** VieNeu chưa đủ tự nhiên/ổn định, và **sau khi xác minh điều khoản thương mại** (Vbee/Viettel chưa xác minh được).
3. Giọng đã chọn ghi vào mục "Giọng chính thức" dưới đây để Producer dùng thống nhất. **Luôn gắn nhãn AI** (xem `docs/platform-specs.md`).

### Giọng chính thức — **toàn bộ dùng giọng Bắc** (giám đốc chốt 19/11/2026 sau khi nghe mẫu; thay bộ Minh Đức + Quỳnh Anh chốt 17/11/2026)
Thông số chung cho cả 4 giọng dưới: `temperature=0.65` (mặc định v3 Turbo là 0,4, thiết lập của bộ mẫu cũ; giọng sản xuất theo temperature trong kế hoạch R24). Script `tools/voice/vieneu_samples.py` hiện chưa có cờ `--temperature`. Nhịp hậu kỳ theo Y6 bên dưới.

| Vai | Giọng | Mô tả trong VieNeu | Mẫu nghe |
|---|---|---|---|
| **Nam chính** (Cáo dẫn truyện, giọng mặc định) | **Hải Đăng** | Nam · Bắc · Phong cách tự nhiên | `voice-samples/Hải_Đăng__1..6.wav` |
| **Nữ chính** | **Trúc Ly** | Nữ · Bắc · Phong cách tự nhiên | `voice-samples/Trúc_Ly__1..6.wav` |
| **Nam phụ** | **Quốc Tuấn** | Nam · Bắc · Phong cách tự nhiên | `voice-samples/Quốc_Tuấn__1..6.wav` |
| **Nữ phụ** (vd "Chị Phỏng vấn") | **Ngọc Huyền** | Nữ · Bắc · Giọng đọc tự nhiên | `voice-samples/Ngọc_Huyền__1..6.wav` |

- Quy ước dùng: giọng mặc định khi dòng lời không ghi giọng là **Hải Đăng** (`studio/renderer-remotion/scripts/gen_vo.py`); muốn dùng giọng khác thì kịch bản ghi rõ giọng từng dòng/vai để Producer đặt `voice` cho dòng đó. Giám đốc **chưa quy định** khi nào dùng Trúc Ly (nữ chính) thay cho Hải Đăng làm người dẫn — khi có thì ghi vào đây.
- **Minh Đức và Quỳnh Anh không còn là giọng chính thức** cho video mới; các video đã làm (T3–T8) giữ nguyên, không làm lại.
- Mẫu nghe nằm trong `voice-samples/` (thư mục này không đưa lên repo, tạo lại bằng `tools/voice/vieneu_samples.py`); danh sách đủ 25 giọng ở bảng "Đề xuất chính" phía trên.

## Xử lý lời thoại trước khi dựng (Y6–Y8)

**Y6 — Tốc độ (sửa 19/11/2026).** Giám đốc nhận xét T8 đọc nhả chữ chậm nhưng kiến thức đến quá nhanh nên yêu cầu **tăng tốc độ đọc 10–15% so với T8** (T8 đo 3,84 âm tiết/s giọng, nghỉ 24% thời lượng, `atempo` 0,97–1,03; mức giảm 18/11 bị thay). **Tiêu chí là tốc độ ĐO được (`qc-measure` 4,6–4,8 âm tiết/s có tiếng), không phải con số `atempo`:** `atempo` chỉ là phương tiện và phụ thuộc giọng. Với giọng T8, `[dẫn]` ≈ 1,13–1,18, `[kỹ thuật]` ≈ 1,07–1,12; **giọng Hải Đăng (T9) vốn đọc nhanh hơn: ở `atempo` 1,13/1,07 đã đo 5,37 âm tiết/s (+28%), phải hạ về ≈ 0,90–0,95 mới ra 4,6–4,8** (đo 19/11/2026). Luôn đo rồi chỉnh; trần 1,20, sàn 0,85 (thấp hơn dễ kéo chữ/vang — CHƯA KIỂM). **Sinh mỗi câu một lần suy diễn** (hoặc gộp 2–4 câu cùng ý chỉ khi cắt lại bằng `tools/voice/splice.py`, giữa khoảng lặng — R23; T9 bản đầu cắt tại −40 dB + fade nên bị mất chữ đầu/cuối câu), nghỉ có chủ đích ở ranh giới ý. Thử `temperature` và `silence_p` chỉ đổi ±5%, không phải đòn bẩy chính. VieNeu không có SSML hay điều khiển cao độ: nhấn thuật ngữ bằng cấu trúc câu và nghỉ ngắn 0,15–0,3 s trước thuật ngữ chính. Độ tự nhiên, méo giọng: CHƯA KIỂM — giám đốc nghe. **Đọc nhanh hơn không có nghĩa là kiến thức đến nhanh hơn** (R13). Giữ hình đủ lâu để hiểu, tránh chuyển cảnh liên tục.

**Y7 — Khoảng nghỉ.** Sinh audio từng câu sau khi chuẩn hoá, áp tốc độ đoạn rồi chèn nghỉ theo ngữ cảnh. Tính cả khoảng nghỉ TTS đã tạo để tránh cộng trùng; phối hợp nhịp nghỉ với hiệu ứng hình, chuyển cảnh hoặc âm thanh.

| Vị trí | Giây tham khảo của giám đốc |
|---|---|
| Sau dấu phẩy | 0,2–0,4 |
| Sau dấu chấm | 0,4–0,7 |
| Sau câu hỏi hoặc ý quan trọng | 0,7–1,2 |
| Khi chuyển sang nội dung mới | 0,8–1,5 |

Nhịp nghỉ dài đi với hình đang đổi đáng xem hoặc chuyển cảnh có chủ đích. Đo lại sau TTS và gửi mốc cho Kịch bản/Đạo diễn hình ảnh duyệt lại. Đuôi im mặc định ≤ 0,7 s; ngoại lệ ghi giây và lý do trong `notes.md`. Tổng 45–75 giây (chuẩn, D1), quá trần thì rút phạm vi, không tăng tốc để bù.

**Y8 — Từ điển `tools/voice/pronunciation.json`.** Kịch bản liệt kê thuật ngữ và phân loại đọc từng chữ cái (vd API) hoặc đọc như một từ (vd Database, Deadlock, Transaction, Query, Index, Backend, Frontend); cấu hình từng cách đọc trong từ điển. **Từ tiếng Anh phải ra âm tiếng Anh (giám đốc nghe T5 ngày 19/11/2026: “Partition”, “Archive”, “query”, “PostgreSQL” bị đọc như tiếng Việt):** giữ NGUYÊN chữ gốc hoặc dùng chính tả tiếng Anh (“Postgress queue ell”, “you eye”); **cấm phiên âm kiểu Việt** (“pa-ti-sần”, “ác-kaiv”) vì ép VieNeu đọc bằng âm Việt. Agent không nghe được nên kiểm bằng âm vị: `python tools/voice/phonemes.py --lines <apply.json> [--extra …]` (và `--check-dictionary`) phải mã 0 — từ tiếng Anh không mang âm Việt và không đổi cách đọc trong câu. Công cụ (chi tiết ở `tools/voice/README.md`):

```text
node tools/voice/pronounce.mjs <apply|check|terms|list|init-extra> [--file <tệp>] [--column "Lời đọc"] [--text "<chuỗi>"] [--extra <tệp.json>] [--ignore a,b] [--json]
```

Có **hai tầng từ điển**: từ điển chung `tools/voice/pronunciation.json` (chỉ giám đốc hoặc người có quyền sửa `tools/` cập nhật) và **từ điển riêng của từng video** `<thư mục video>/assets/voice/pronunciation.local.json` (Producer được ghi vì nằm trong thư mục video; truyền bằng `--extra`, mục riêng ghi đè mục chung khi trùng và có cảnh báo).

1. `check --file <script.md> --column "Lời đọc" --extra <tệp riêng>` trước khi sinh audio (chỉ quét cột lời đọc của bảng cảnh). Thuật ngữ lạ (`unknown`, mã thoát 1) được bổ sung vào **tệp riêng của video** (tạo khung bằng `init-extra`), `verified:false` và ghi “CHƯA KIỂM — giám đốc nghe”; giữ `tts` là chữ tiếng Anh gốc (không phiên âm Việt); chạy lại `check` tới khi mã thoát 0 rồi mới tổng hợp giọng. Khi giám đốc đã nghe và chốt, mục được chuyển từ tệp riêng lên từ điển chung và đặt `verified:true`.
2. `apply --file <script.md> --column "Lời đọc" --json --extra <tệp riêng>` tạo văn bản đưa TTS (từng câu). Chữ trên hình và phụ đề giữ chính tả chuẩn. Lưu ra tệp rồi chạy `python tools/voice/phonemes.py --lines <apply.json> --extra <tệp riêng>`: phải mã 0. Sinh từng câu theo Y6–Y7 (đường Remotion: `studio/renderer-remotion/scripts/gen_vo.py`, dùng chính từ điển này).
3. Dùng `terms` để rà danh sách, sinh một clip mẫu mỗi thuật ngữ ở `assets/voice/term-check/<slug>.wav`. Trong `notes.md` ghi bảng “nghe kiểm” gồm thuật ngữ, cách đọc, đường dẫn clip và trạng thái.
4. Rà lại toàn bộ văn bản đã đưa TTS, nhất là đoạn nhiều thuật ngữ, và đo thời lượng/khoảng nghỉ. Agent kiểm bằng văn bản và số đo. Không đưa audio vào mô hình, không cài công cụ nhận dạng giọng. Phát âm thật là **CHƯA KIỂM — giám đốc nghe** đến khi giám đốc xác nhận. Chỉ sau xác nhận đó mới cập nhật `verified:true`.

## Cách nghe thử có tiêu chí (giám đốc)
Dùng đúng bộ câu trong `tools/voice/sample_text.txt` (đủ giọng vui, câu dài, thuật ngữ văn phòng, số và viết tắt), cho mỗi giọng nghe và chấm 1–5:
1. Tự nhiên, không "đọc máy". 2. Đúng dấu/thanh điệu, đúng giọng miền. 3. Nhịp trẻ trung, đủ nhanh cho video ngắn. 4. Đọc đúng số, viết tắt, từ mượn (KPI, deadline, TikTok). 5. Ổn định ở câu dài, không lỗi lặp/nuốt chữ.

## Chạy trên máy triển khai (PC của giám đốc — GPU AMD, chạy bằng CPU)
Máy triển khai có GPU AMD (Radeon RX 6600), **không phải NVIDIA**, nên bỏ hẳn nhánh `--extra cuda`: dùng đúng đường CPU/ONNX Runtime mặc định — vừa là đường **được dự án hỗ trợ chính thức**, vừa đủ nhanh theo số đo của tác giả (xem bảng trên), không cần dò DirectML/ROCm cho AMD (chưa ai dùng, không có hướng dẫn chính thức). Lệnh dưới đây **lấy từ README của VieNeu-TTS, tôi chưa chạy được** (còn chờ giám đốc báo bắt đầu T6):
```powershell
git clone https://github.com/pnnbao97/VieNeu-TTS.git
cd VieNeu-TTS
uv sync                     # KHÔNG dùng --extra cuda trên máy này (không có card NVIDIA) — bản tối thiểu, chạy CPU qua ONNX Runtime
uv run vieneu-web           # mở http://127.0.0.1:7860 để nghe thử từng giọng
```
Nếu muốn thử nhanh hơn ~40% (đổi lại rủi ro âm thanh méo nếu CPU không hỗ trợ VNNI tốt — cần tự nghe kiểm): chạy với `Vieneu(precision="int8")` theo API Python thay vì giao diện web; không rõ cờ tương đương trên `vieneu-web`, cần tự dò hoặc hỏi tác giả.
Hoặc sinh hàng loạt mẫu để so sánh: `python tools/voice/vieneu_samples.py --voices "Phạm Tuyên,Quỳnh Anh,Thái Sơn,Minh Triết" --out voice-samples` (script do tôi viết theo ví dụ trong README, **chưa chạy thử**).
Lưu ý: dùng tính năng nhân bản giọng thì chỉ với giọng của người đã đồng ý rõ ràng; nội dung đăng ra vẫn gắn nhãn AI.

**Đã cân nhắc và loại:** GGUF Q4/Q8 (nhanh hơn CPU thường) — hoá ra chỉ có ở bản **v2 cũ, đã bị đánh dấu Deprecated** trên trang chính thức, không áp dụng cho v3 Turbo đang đề xuất, nên không dùng. DirectML (hỗ trợ AMD trên Windows) — gói `torch-directml` còn tồn tại nhưng Microsoft ghi chỉ chạy tới PyTorch 2.3.1 (có vẻ lâu không cập nhật) và VieNeu-TTS không có sẵn lựa chọn thiết bị "dml", phải tự sửa mã nguồn — rủi ro cao, không đáng vì đường CPU mặc định đã đủ nhanh. ROCm trên Windows cho RX 6600 — tài liệu AMD ghi "chỉ runtime, không có HIP SDK", tức không dùng để chạy mô hình AI được, và không liên quan vì VieNeu không hỗ trợ ROCm.

**R23 — Toàn vẹn giọng (D8, 19/11/2026).** Không cắt vào âm trên −60 dBFS; không dùng điểm `silence_end`/−40 dB làm điểm cắt; không fade-in/out vào phần có tiếng (fade chỉ trong phần lặng đệm); giữ ≥ 40 ms lặng trước và ≥ 120 ms sau mỗi câu. Công cụ: `python tools/voice/splice.py split|check`; `qc-measure` đo `voice_edges`. Nghe thật vẫn CHƯA KIỂM — giám đốc nghe.

## Voice Director (R24)

Khai `voice_direction` theo `line_id` trong storyboard và dự kiến nhịp trong kịch bản. Ghi ý định, cảm xúc, cụm nhấn, tốc độ, nghỉ trước/sau, ngữ điệu và quan hệ chuyển ý theo R24. Dùng `prosody.mjs plan`, `gen_vo.py --plan`, `prosody.mjs timeline`, `assemble.py` và `prosody_metrics.py` theo `tools/voice/README.md`. Các luật nghỉ xác định theo ngữ nghĩa nằm trong `tools/voice/prosody.json`. VieNeu-TTS v3 Turbo không hỗ trợ SSML, điều khiển cao độ hay cảm xúc. Công cụ điều khiển giọng, temperature, tempo qua `atempo`, tách đoạn và chèn nghỉ. Cảm xúc và ngữ điệu là chỉ dẫn (`advisory`). Giữ đệm R23. Độ tự nhiên và phát âm **CHƯA KIỂM — giám đốc nghe**.
