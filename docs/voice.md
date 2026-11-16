# Giọng đọc tiếng Việt cho Cáo văn phòng — đề xuất giọng miền Bắc và miền Nam

> Cập nhật 16/11/2026, **sửa lại 17/11/2026**: yêu cầu ban đầu là một giọng Bắc + một giọng Nam, nhưng giám đốc đã đổi quyết định — **dùng toàn giọng miền Bắc, không cần giọng Nam nữa**. Nội dung **luôn gắn nhãn AI**; văn phong trẻ trung, câu chữ văn phòng (xem `docs/mascot.md`).
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
| Giọng có sẵn | **25 giọng** chia 3 miền. **Bắc:** Minh Đức, Phạm Tuyên, Xuân Vĩnh, Thanh Bình, Ngọc Linh, Đoan Trang, Quỳnh Anh, Quốc Tuấn. **Nam:** Adam, Thái Sơn, Thục Đoan, Minh Triết, Mỹ Duyên, Đức Trí, Kim Thanh, Thùy Dung. **Trung:** Quang Sơn, Ngọc Trân. README **không ghi giới tính từng giọng** (chỉ "đa dạng"), nghe để biết |
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

### Giọng chính thức — **toàn bộ dùng giọng Bắc** (đã bỏ yêu cầu giọng Nam, quyết định 17/11/2026)
Thông số chung cho cả 2 giọng dưới: `temperature=0.65` (mặc định v3 Turbo là 0,4 — tăng lên cho "có cảm xúc" hơn theo yêu cầu giám đốc; **đổi lại dễ phát âm sai/lạ hơn chút, cần nghe lại khi đổi câu mới**) + hậu kỳ `ffmpeg -filter:a atempo=1.08` (**+8% tốc độ**, giữ nguyên cao độ — v3 Turbo không có tham số tốc độ riêng). Script `tools/voice/vieneu_samples.py` hiện **chưa có cờ `--temperature`** — khi nối vào pipeline sản xuất thật, nhớ áp đúng 2 tham số trên.
- **Giọng nam chính (kênh, Cáo dẫn truyện): Minh Đức** (Nam · Bắc · Phong cách tin tức) — đã chốt, nghe mẫu ở `voice-ab/1_bieucam_nhanh.wav`.
- **Giọng nữ (nhân vật nữ phụ, vd "Chị Phỏng vấn"): Quỳnh Anh** (Nữ · Bắc) — đã chốt, nghe mẫu ở `voice-final/QuynhAnh_*_bieucam_nhanh.wav`.

## Cách nghe thử có tiêu chí
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
