# Danh sách cài đặt cho máy mới (kiểm kê từ máy cũ, 16/11/2026)

> Máy cũ: Windows 11. Danh sách này chỉ gồm thứ **liên quan dự án**. Mọi lệnh cài bên dưới là **tham khảo, chưa chạy thử trên máy mới**; kiểm lại nguồn chính thức trước khi chạy. Việc cài đặt chỉ làm khi giám đốc báo bắt đầu (xem `docs/PLAN-CHUYEN-MAY.md`, bước T0–T1).

## 1. Bắt buộc
| Thành phần | Phiên bản máy cũ | Yêu cầu tối thiểu / lưu ý | Kiểm sau khi cài |
|---|---|---|---|
| **Node.js + npm** | 24.13.0 / 11.7.0 | Node **≥ 22.5** (cần `node:sqlite`) | `node -v` |
| **Git** (+ Git Credential Manager) | 2.53.0 (GCM 2.7.3) | GCM để đẩy/kéo GitHub không nhập mật khẩu | `git --version` |
| **Python** | 3.12.10 | 3.12 | `python --version` |
| Gói Python cho `tools/fox` | `pillow==12.3.0`, `numpy==2.5.3`, `scipy==1.18.1` | — | `python -m pip install pillow==12.3.0 numpy==2.5.3 scipy==1.18.1` |
| **ffmpeg + ffprobe** | bản git `N-127197-gf0c2c00a62-20261004` (thư mục tên `ffmpeg-master-latest-win64-gpl`) | **Phải có** bộ lọc `drawtext` `subtitles` `ass` `loudnorm` `xfade` `zoompan` `tpad` và bộ mã hoá `libx264` `aac` **`qtrle`** (qtrle là bắt buộc để xuất lớp Cáo trong suốt) | `ffmpeg -hide_banner -filters` và `ffmpeg -hide_banner -encoders` |
| **Claude Code CLI** | 2.1.325 (bản `claude.exe` cài kiểu native) | Đăng nhập lại tài khoản trên máy mới | `claude --version`, `claude auth status` |
| **Codex CLI** | 0.169.0 (cài bằng npm toàn cục) | `npm install -g @openai/codex@0.169.0`; đăng nhập ChatGPT Plus | `codex --version`, `codex login status`, `codex doctor` |
| **Thư viện của dự án** | `@modelcontextprotocol/sdk` 1.32.2, `zod` 4.6.7, `@resvg/resvg-js` 2.6.2 | Cài bằng `npm install` trong `studio/` và `tools/mascot/` (**cả hai**, vì `tools/fox` dùng lại bộ vẽ của `tools/mascot`). Phiên bản chốt trong `package-lock.json` | `npm test` ở `studio`, `tools/fox`, `tools/mascot` |
| **Phông Segoe UI** | có sẵn trên Windows | Công thức tiêu đề/phụ đề dùng `C:/Windows/Fonts/segoeuib.ttf`; HĐH khác phải đổi phông | `dir C:\Windows\Fonts\segoeuib.ttf` |

## 2. Nên có
| Thành phần | Phiên bản máy cũ | Dùng để |
|---|---|---|
| **uv** | 0.12.19 | Cài và chạy VieNeu-TTS (giọng đọc), xem `docs/voice.md` |
| **VS Code** + extension `anthropic.claude-code` | 2.1.325 | Dùng Claude Code trong VS Code |
| Extension Python: `ms-python.python` 2026.10.0, `ms-python.vscode-pylance` 2026.4.1, `ms-python.debugpy` 2026.6.0, `ms-python.vscode-python-envs` 1.42.0 | như bên | Sửa/chạy `tools/fox/*.py` |
| `tomoki1207.pdf` 1.2.2, `mechatroner.rainbow-csv` 3.24.1 | như bên | Xem PDF/CSV (tiện, không bắt buộc) |
| **Văn phòng 2D** (clone từ GitHub) | v0.8.1, commit `c69bf2bc98cf96a63d146070e9bbc83b507bf0bf` | Xem agent làm việc, xem `docs/office.md` |
| Cài extension VS Code | — | `code --install-extension anthropic.claude-code` (tương tự cho các mục trên) |

## 3. Máy cũ có nhưng dự án KHÔNG cần (tuỳ bạn có cài lại không)
- npm toàn cục: `bun`, `gulp-cli`, `vercel`, `yarn`.
- VS Code: bộ C#/.NET (`csdevkit`, `csharp`, `dotnet-runtime`), Go, C++ (`cpptools`, `cmake-tools`...), Containers, Remote-SSH, `ms-playwright.playwright`, `formulahendry.agent-skills`.
- Phần mềm: Docker, Go, .NET SDK; trình duyệt Playwright đã tải (không dự án nào dùng).
- Plugin Claude Code `ui-ux-pro-max` 2.15.0 (nguồn GitHub `nextlevelbuilder/ui-ux-pro-max-skill`): dự án này không dùng.
- Cấp người dùng của Claude/Codex phục vụ công việc khác của giám đốc (47 agent trong `~/.claude/agents`, skill `lead-docs`, bộ GSD cho Codex gồm 73 skill + 62 agent + 9 hook): **không thuộc dự án này, không đưa lên repo**.

## 4. Đi theo tài khoản, không cài từng máy
Các kết nối của claude.ai (Google Drive, Gmail, Slack, Notion...) hiện trên máy cũ là do đăng nhập tài khoản Claude, không phải cài đặt cục bộ. Máy mới đăng nhập cùng tài khoản là có lại; cái nào báo "cần xác thực" thì xác thực lại. Dự án này không dùng chúng.

## 5. Lưu ý quan trọng khi cài
1. **GSD (get-shit-done) cho Codex: đừng cài lại nếu không cần.** Trên máy cũ nó từng ghi khối `[[hooks]]` sai định dạng làm **mọi lệnh `codex` lỗi** với bản 0.169; đã phải comment khối đó (bản sao lưu `config.toml.bak-before-codex-0.169`). Nếu vẫn cài, chạy `codex doctor` ngay sau đó.
2. **Chi phí token của việc nền (suy luận, chưa đo):** mỗi lần worker chạy `claude -p` bằng **đăng nhập mặc định**, danh sách agent/skill/plugin cấp người dùng (mục 3) được nạp vào ngữ cảnh. Tài khoản phụ có **thư mục riêng** (`accounts add ...`) không có những thứ đó nên gọn hơn. Với Codex, nên cho việc sản xuất dùng thư mục tài khoản riêng sạch thay vì `~/.codex` có GSD. Đo thật ở bước T5 trước khi kết luận.
3. **Không chép `~/.claude`, `~/.codex`, `studio/accounts`**: chứa token đăng nhập. Máy mới đăng nhập lại.
4. Cài bằng lệnh nào trên máy mới cũng nên kiểm lại bằng cột "Kiểm sau khi cài" rồi chạy `npm test` ở ba thư mục.

## 6. Kiểm tra một lượt sau khi cài (chỉ đọc)
```powershell
node -v; npm -v; git --version; python --version; uv --version; claude --version; codex --version
ffmpeg -hide_banner -filters | findstr /i "drawtext subtitles loudnorm xfade zoompan tpad"
ffmpeg -hide_banner -encoders | findstr /i "libx264 aac qtrle"
python -m pip list --format=freeze | findstr /i "pillow numpy scipy"
```
Rồi: `npm test --prefix studio`, `npm test --prefix tools/fox`, `npm test --prefix tools/mascot` (kỳ vọng 24 test với 2 bị bỏ qua nếu chưa clone Văn phòng 2D, 7 và 7).
