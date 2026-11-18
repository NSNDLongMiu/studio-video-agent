# Kế hoạch chuyển sang PC mạnh (tối nay) — CHỈ LÀ KẾ HOẠCH, CHƯA CÀI GÌ

> Giám đốc yêu cầu (16/11/2026): mọi việc **cài đặt dừng lại**, chỉ lên kế hoạch; tối về PC sẽ báo để cài. Tài liệu này gom đủ **quyết định cần chốt** và **trình tự cài** để tối nay làm một mạch.
> Claude **không cài gì** cho tới khi giám đốc báo bắt đầu (xem mục 6). Cột "Đã thử?" nói thật bước nào đã chạy thử trên máy hiện tại, bước nào chưa từng chạy ở đâu cả.

## 1. Quyết định cần chốt trước khi chuyển
| # | Cần quyết | Đề xuất mặc định | Hệ quả nếu đổi | Trạng thái |
|---|---|---|---|---|
| 1 | Cấu hình PC mới: HĐH, **GPU (tên, VRAM)**, RAM, đã có Node/Python/ffmpeg chưa | **Đã kiểm (T0 chạy rồi):** Windows 11 Pro · CPU Intel i5-13400F (10 lõi/16 luồng) · GPU **AMD Radeon RX 6600** (không phải NVIDIA) · RAM ~32 GB · Node 24.12 ✓ · Git ✓ · **Python, ffmpeg, uv: chưa cài** | GPU AMD → không dùng được đường CUDA của VieNeu; giọng đọc chạy CPU/ONNX, xem `docs/voice.md` | **Đã chốt (16/11/2026): giọng đọc chạy CPU, không cần GPU** — lý do: đây là bước dựng âm thanh chạy nền/hàng đợi (không phải tương tác thời gian thực), số đo của tác giả cho RTF < 1 (nhanh hơn thời gian thực) trên CPU yếu hơn máy này; với nhịp 2 video/ngày/đội, CPU chỉ bận vài chục giây mỗi lần, không đáng lo "lag" máy. Số đo thật trên máy này sẽ có khi chạy T6 |
| 2 | Cách mang dự án sang | **Đã chốt: dùng GitHub.** Đã đẩy ngày 16/11/2026 (commit `30fe8bb`), 221 tệp, đã kiểm bằng clone mới. Máy mới chỉ cần: `git clone https://github.com/NSNDLongMiu/studio-video-agent.git`. **Repo đang CÔNG KHAI** (giám đốc đã xác nhận). Tuyệt đối không commit token/khoá/`studio/accounts` (đã nằm trong `.gitignore`) | Muốn riêng tư thì đổi chế độ repo trên GitHub; không ảnh hưởng chức năng | Đã chốt |
| 3 | Đường dẫn dự án trên PC mới | Giữ `E:\Tiktoker` nếu có ổ E. Không thì chọn đường dẫn không dấu, không khoảng trắng | Phải sửa đúng 1 dòng: `.codex\config.toml` (đường dẫn tuyệt đối tới `studio/src/mcp.mjs`). Đã quét: không còn đường dẫn cứng nào khác | Chờ giám đốc |
| 4 | Tài khoản đăng nhập đầu tiên: chủ tài khoản Claude/Codex là ai; dùng đăng nhập mặc định hay thư mục riêng; có bật API trả phí dự phòng không | Mỗi tài khoản là ghế của 1 người thật; mặc định dùng `accounts init`; API trả phí **tắt** | Thêm tài khoản của người khác sau, không cần làm tối nay. Chi tiết điều khoản: `docs/accounts.md` | **Đã chốt 18/11/2026:** KHÔNG dùng API/AI trả phí; chủ tài khoản đã khai báo (xem `docs/CHECKLIST.md` mục 2) |
| 5 | Giọng đọc: nghe thử 4 giọng Bắc + 4 giọng Nam của VieNeu; có đối chiếu ElevenLabs/Vbee không | Nghe VieNeu trước (miễn phí, Apache-2.0). Chỉ xét dịch vụ trả phí nếu chưa đủ tự nhiên | Dịch vụ trả phí cần xác minh điều khoản thương mại (Vbee/Viettel chưa xác minh) | **Đã chốt 17/11/2026:** toàn giọng Bắc (`docs/voice.md`) |
| 6 | Bộ câu chào của Cáo: A Họp nhanh / B Đi làm / C Báo cáo sếp / D Check-in | **Bộ A** (ngắn, hook mạnh) | Đổi bộ chỉ là đổi câu chữ, không đụng kỹ thuật | **Đã chốt 18/11/2026:** bỏ bộ câu chào cố định; mở đầu bằng hook theo chủ đề (`docs/mascot.md`) |
| 7 | Phòng ban đầu tiên: tên, mã, chỉ tiêu video/ngày, số đội ban đầu; **chủ đề chạy thử** đầu tiên | 1 phòng, chỉ tiêu 2/ngày, 1 đội, 1 chủ đề đơn giản | Chỉ tiêu cao hơn năng lực đội thì trưởng phòng sẽ đề xuất thêm đội | Chỉ tiêu: giám đốc đặt ngay lúc tạo phòng. **Phòng IT đã mở** (chỉ tiêu 1/ngày, xác nhận 18/11/2026); chủ đề demo: giám đốc giao trên dashboard |
| 8 | Quyền cho agent: (a) cho Claude ghi `.claude\settings.json` (cho phép trước các công cụ đọc/báo cáo; công cụ duyệt vẫn bắt hỏi)? (b) cho Claude **tự chạy** lệnh cài gói từ nguồn ngoài (VieNeu, thư viện Python) hay bạn tự chạy? | (a) Có. (b) Bạn tự chạy các lệnh cài, Claude chạy các bước còn lại | Việc cài gói từ nguồn ngoài đã bị chặn một lần ở phiên này; Claude **không vòng qua** | (a) **đã ghi** 18/11/2026 sau khi giám đốc xác nhận; (b) chưa quyết |
| 9 | Văn phòng 2D: bật ngay không, và dùng `--private` khi chia sẻ màn hình | Bật; dùng `--private` (vẫn lộ tên dự án, xem `docs/office.md`) | — | Đã bật (giám đốc xác nhận 18/11/2026) |
| 10 | Worker tự bật cùng Windows (`studio\scripts\install-worker-task.ps1`) | **Không** tối nay (làm sau khi chạy thử ổn) | Bật thì việc nền chạy cả khi bạn chưa mở dashboard | Giám đốc đồng ý làm **sau demo** (18/11/2026) |
| 11 | Nhép miệng: giao agent nào, khi nào | Giao sau khi chọn giọng, **trên PC mạnh** để thử cả mô hình dùng GPU. Dùng `docs/prompts/lipsync-cao.md` | Làm trước khi có giọng thì chỉ thử được bằng giọng tạm | Giám đốc giao cho AI 18/11/2026 — `docs/viec-cho-agent.md` T2 |
| 12 | Nhãn AI | **Đã chốt:** luôn gắn (`qc-publish` kiểm tự động) | — | Đã chốt |

## 2. Mang gì, không mang gì
> Đã có repo GitHub nên phần "mang" dưới đây chính là nội dung repo. Phần "không mang" vẫn đúng: **không bao giờ** đưa token lên repo (repo công khai).
- **Mang:** toàn bộ thư mục dự án theo mục 2 của bảng trên, kể cả `assets\mascot\` (4 ảnh Cáo gốc, **không sửa**), `brand\cao\poses|faces|mouths|motion` (đã tách sẵn), `library\` (ảnh/nhạc của bạn nếu có).
- **KHÔNG mang:** `studio\accounts\` và mọi `auth.json`, `~\.codex`, `~\.claude` — chứa **token đăng nhập, coi như mật khẩu**. PC mới **đăng nhập lại từ đầu** (đúng nguyên tắc 1 ghế = 1 người).
- **Không cần mang:** `studio\data\` (đang trống, tự tạo), thư viện `node_modules` (cài lại), `tools\whatsmyagentdoing` (clone lại đúng phiên bản ghim), `_raw/_index` (sinh lại được bằng `tools/fox/extract.py`).

## 3. Trình tự cài (làm tối nay, khi giám đốc báo)
| Bước | Việc (lệnh) | Kiểm bằng | Đã thử? |
|---|---|---|---|
| **T0** Kiểm PC mới (chỉ đọc; danh sách đầy đủ thứ cần cài ở `docs/CAI-DAT-MAY-MOI.md`) | `node -v` (cần ≥ 22.5, khuyên 24) · `git --version` · `python --version` (3.12) · `ffmpeg -version` · `ffmpeg -hide_banner -filters` phải có `drawtext`, `subtitles`, `loudnorm`, `xfade` · `ffmpeg -hide_banner -encoders` phải có `libx264`, `aac` · `nvidia-smi` (nếu có card NVIDIA, ghi tên + VRAM) · `uv --version` | Dán kết quả cho Claude | Máy này đạt (Node 24, ffmpeg đủ); PC mới **chưa** |
| **T1** Đưa dự án sang, cài thư viện | `git clone https://github.com/NSNDLongMiu/studio-video-agent.git` vào thư mục dự án (ví dụ `E:\Tiktoker`) · sửa `.codex\config.toml` nếu đổi đường dẫn · `cd studio && npm install` · `cd tools\mascot && npm install` (**bắt buộc**: `tools/fox` dùng lại bộ vẽ ảnh của thư mục này) · `python -m pip install pillow numpy scipy` | `npm test` trong `studio` (24 test), `tools\fox` (7), `tools\mascot` (7) đều đạt (bài test Văn phòng 2D tự bỏ qua nếu chưa clone) | Đạt trên máy này; PC mới chưa |
| **T2** Đăng nhập (**bạn làm**) | `codex login` (ChatGPT Plus) · mở `codex` một lần trong thư mục dự án, chọn **Trust** · `claude auth login` nếu PC chưa đăng nhập · `node studio/src/cli.mjs accounts init --owner "Tên"` · `node studio/src/cli.mjs accounts check --probe` | Cả Claude và Codex báo "gọi thử thật: OK" | **Codex chưa từng chạy thật ở đâu**; Claude thật đã chạy |
| **T3** Bật xưởng | `npm run start --prefix studio` → http://localhost:4747 · mở phòng đầu tiên · đặt chỉ tiêu | Dashboard hiện 1 phòng, 1 đội, 2 tài khoản "sẵn sàng", worker "chạy" | Dựng bằng dữ liệu thử; chưa có phòng thật |
| **T4** Văn phòng 2D | `git clone --depth 1 --branch v0.8.1 https://github.com/Charonyuu/whatsmyagentdoing tools/whatsmyagentdoing` · `git -C tools/whatsmyagentdoing rev-parse HEAD` phải ra `c69bf2bc98cf96a63d146070e9bbc83b507bf0bf` · `npm run office --prefix studio` | Mở được văn phòng, thấy phiên Claude/Codex | Đạt trên máy này |
| **T5** Chạy thử 1 video đầu–cuối (Giai đoạn 2 của `PLAN.md`) | `/new-topic <phòng> \| <chủ đề> \| <yêu cầu>` → đọc `concept.md`, `debate.md`, `plan.md` → bấm **Duyệt & sản xuất** → Codex dựng → Claude QC. **Chưa có giọng đọc thì dùng `--srt`** | `node tools/qc-video.mjs` + `node tools/qc-publish.mjs` đều pass; **xem khung hình thật**; ghi lại thời gian, hạn mức tốn, lỗi gặp | **Chưa từng chạy** (đây là lần đầu có Codex thật). Dự kiến phát sinh lỗi prompt/skill của Producer, chừa thời gian sửa |
| **T6** Giọng đọc | Bạn tự chạy: `git clone https://github.com/pnnbao97/VieNeu-TTS.git` · `cd VieNeu-TTS` · `uv sync` (**không** dùng `--extra cuda` — máy này là GPU AMD, không phải NVIDIA, nhánh CUDA không chạy được; đường CPU/ONNX mặc định đã đủ nhanh, xem `docs/voice.md`) · `uv run vieneu-web` → nghe thử · hoặc `python tools/voice/vieneu_samples.py --voices "Phạm Tuyên,Quỳnh Anh,Thái Sơn,Minh Triết" --out voice-samples` | Chọn 1 Bắc + 1 Nam, điền vào mục "Giọng chính thức" của `docs/voice.md`; ghi RTF thật đo được (số tham khảo của tác giả: fp32 ~0,55–0,62, int8 ~0,35–0,37 — đều nhanh hơn thời gian thực) | **Chưa chạy** (cài bị chặn); script mẫu chưa chạy thử |
| **T7** Nhép miệng (agent khác) | Mở phiên agent mới ở thư mục dự án, dán prompt trong `docs/prompts/lipsync-cao.md` | Theo mục "Tiêu chí nghiệm thu" trong prompt (đo độ lệch ms, xem khung hình, QC pass) | Chưa giao |
| **T8** (tuỳ chọn) | `powershell -ExecutionPolicy Bypass -File studio\scripts\install-worker-task.ps1` để worker tự bật khi đăng nhập Windows | `schtasks /Query /TN XuongVideo-Worker` | Chưa chạy |

## 4. Ai làm gì tối nay
- **Giám đốc:** đăng nhập T2, nghe và chọn giọng T6, chọn bộ câu chào, giao prompt T7, quyết các mục ở bảng 1.
- **Claude (khi giám đốc báo "bắt đầu Tx"):** chạy các lệnh kiểm tra/cài thư viện **của dự án** (npm, test), dựng/sửa tài liệu, chạy T3–T5, xem khung hình và báo số đo thật. Các lệnh cài gói từ nguồn ngoài (T6) **không tự chạy** nếu chưa được cấp quyền rõ ràng.
- **Agent khác:** nhép miệng (T7), theo prompt đã viết.

## 5. Rủi ro khi chuyển máy
| Rủi ro | Cách phòng |
|---|---|
| Node < 22.5 làm `node:sqlite` lỗi | T0 kiểm trước; cài Node 24 |
| ffmpeg thiếu `libass` → phụ đề biến mất mà không báo lỗi (bẫy đã gặp) | T0 kiểm bộ lọc; luôn xem khung hình thật |
| Phông Segoe UI chỉ có trên Windows | PC mới Windows thì không sao; nếu khác HĐH phải đổi phông trong công thức ffmpeg |
| Windows Defender chặn Codex (đã có cảnh báo ở `codex doctor`) | Thêm ngoại lệ cho `codex.exe` nếu bị chặn |
| Token đăng nhập bị chép nhầm sang máy mới | Không chép thư mục tài khoản; đăng nhập lại |
| Cổng 4747 (dashboard) / 4545 (văn phòng) bị chiếm | Đặt `STUDIO_PORT` / `STUDIO_OFFICE_PORT` |
| Lần đầu Codex thật chạy có thể lỗi | T5 chừa thời gian; mọi lỗi nằm ở `epNN/logs/` và nút "Chạy lại" trên dashboard |
| Mô hình giọng tải từ Hugging Face lần đầu (cần mạng, dung lượng chưa xác nhận) | Chuẩn bị mạng ổn định; VieNeu Turbo chưa rõ dung lượng, bản Nano nhỏ hơn (README ghi 282 MB) |
| Chất lượng giọng chưa ai nghe | Nghe thử có tiêu chí (`docs/voice.md`) trước khi chọn |

## 6. Cách báo tôi tối nay
Gõ một trong các câu sau (tôi chỉ làm đúng bước được nêu, rồi dừng và báo kết quả):
- "**Bắt đầu T0**" kèm kết quả lệnh kiểm (tôi đối chiếu và nêu thiếu gì).
- "**T1**" (tôi cài thư viện dự án, sửa đường dẫn, chạy test).
- "**T2 xong**" (tôi chạy `accounts check --probe` và báo).
- "**T3**", "**T4**", "**T5 với chủ đề: …**".
- "**Cho phép cài gói cho T6**" nếu muốn tôi chạy lệnh cài giọng đọc thay bạn (mặc định bạn tự chạy).

## 7. Ý tưởng để cân nhắc (chưa phải quyết định)
1. **Hai phiên bản giọng Bắc và Nam cho cùng nội dung:** đăng 2 kênh hoặc thử A/B để xem vùng miền nào giữ chân người xem tốt hơn (cần đo thật mới biết).
2. **(Hết hiệu lực — giám đốc bỏ câu chào cố định 18/11/2026)** Series cố định theo bộ chào A: "Họp nhanh 30 giây" — mỗi video một mẹo, cấu trúc cố định (mở → 1 ý → chốt), dễ sản xuất hàng loạt và dễ nhận diện.
3. **Nội dung "hậu trường":** quay màn hình **Văn phòng 2D** bằng chế độ `--demo` (đội giả, không lộ dự án thật) để làm video "Cáo văn phòng và xưởng AI". Không dùng chế độ thật khi quay vì lộ tên dự án khác.
4. **Cáo đổi trang phục theo cụm chủ đề** (ví dụ sa mạc; tạm dùng chung 1 bộ, agent hoạ sĩ linh vật lo về sau — `docs/viec-cho-agent.md` T1): có thể cần thêm ảnh tham chiếu từ giám đốc, mỗi bộ cần cùng kiểu ánh sáng và độ phân giải cao hơn (≥ 1000px cao).
5. **Mẫu ảnh bìa cố định:** một dáng Cáo + chữ lớn, dựng bằng cùng công cụ để mọi video đồng nhất.
6. **(Không cần — giám đốc chốt không dùng nhạc nền 18/11/2026)** Thư viện nhạc có giấy phép: chốt nguồn và ghi `library/music/LICENSES.md` trước khi dựng hàng loạt, tránh bị gỡ video vì bản quyền.

## 8. Tiêu chí "chuyển máy xong"
- Ba bộ test đạt trên PC mới; `accounts check --probe` OK cho cả Claude và Codex.
- Dashboard + worker chạy; Văn phòng 2D thấy các phiên.
- Có **1 video đầu–cuối** qua `qc-video` và `qc-publish`, đã xem khung hình thật.
- Đã chọn giọng (toàn giọng Bắc) và ghi vào `docs/voice.md`; đã chốt hướng mở đầu (hook theo chủ đề, không câu chào cố định).
- Đã giao prompt nhép miệng cho agent khác.
