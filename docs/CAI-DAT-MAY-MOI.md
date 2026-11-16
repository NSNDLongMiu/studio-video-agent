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

---

## Phụ lục: kiểm kê nguyên văn máy cũ (16/11/2026)
Chụp trực tiếp từ máy cũ bằng các lệnh chỉ đọc. Dùng để đối chiếu, không bắt buộc cài hết.

### VS Code (22 extension, `mã@phiên-bản`)
```text
anthropic.claude-code@2.1.325
formulahendry.agent-skills@0.0.4
golang.go@0.58.0
mechatroner.rainbow-csv@3.24.1
ms-azuretools.vscode-containers@2.5.3
ms-dotnettools.csdevkit@3.40.215
ms-dotnettools.csharp@2.160.4
ms-dotnettools.vscode-dotnet-runtime@3.2.0
ms-playwright.playwright@1.1.19
ms-python.debugpy@2026.6.0
ms-python.python@2026.10.0
ms-python.vscode-pylance@2026.4.1
ms-python.vscode-python-envs@1.42.0
ms-vscode-remote.remote-ssh@0.128.0
ms-vscode-remote.remote-ssh-edit@0.87.0
ms-vscode.cmake-tools@1.25.10
ms-vscode.cpp-devtools@0.7.2
ms-vscode.cpptools@1.35.6
ms-vscode.cpptools-extension-pack@1.5.1
ms-vscode.cpptools-themes@2.0.0
ms-vscode.remote-explorer@0.5.0
tomoki1207.pdf@1.2.2
```
Cài một cái: `code --install-extension <mã>`. Cài hàng loạt: lưu danh sách mã (bỏ phần `@phiên-bản`) vào file rồi `Get-Content file.txt | ForEach-Object { code --install-extension $_ }`.

### npm toàn cục (6)
```text
@openai/codex@0.169.0
bun@1.3.14
gulp-cli@3.1.0
npm@11.7.0
vercel@63.1.0
yarn@1.22.22
```
Dự án chỉ cần `@openai/codex` (và `npm`).

### Python (33 gói, `pip list --format=freeze`)
```text
bcrypt==5.0.0
cairocffi==1.7.1
CairoSVG==2.9.1
cffi==2.1.1
charset-normalizer==3.5.2
cryptography==50.0.2
cssselect2==0.10.1
defusedxml==0.7.1
et_xmlfile==2.0.0
invoke==3.0.3
lxml==6.1.3
numpy==2.5.3
openpyxl==3.1.5
oracledb==26.1.0
pandas==3.1.1
paramiko==5.1.0
pillow==12.3.0
pip==25.0.1
pycparser==3.11
pymupdf==1.28.2
PyNaCl==1.6.2
python-dateutil==4.0.0
python-docx==1.2.0
PyYAML==6.0.3
reportlab==5.1.0
resvg_py==0.5.0
scipy==1.18.1
setuptools==84.0.0
svglib==2.3.2
tinycss2==1.5.1
typing_extensions==4.16.0
tzdata==2026.6
webencodings==0.6.1
```
Dự án chỉ cần `pillow`, `numpy`, `scipy`. Các gói còn lại (pandas, openpyxl, python-docx, pymupdf, reportlab, CairoSVG, svglib, oracledb, paramiko...) phục vụ việc khác trên máy cũ; không cần cho dự án này.

### Claude Code
- Plugin cấp người dùng: `ui-ux-pro-max@ui-ux-pro-max-skill` 2.15.0 (đang bật). Dự án không dùng.
- Marketplace: `anthropic-plugin-directory` (có sẵn trong Claude Code), `ui-ux-pro-max-skill` (GitHub `nextlevelbuilder/ui-ux-pro-max-skill`).
- Kết nối claude.ai (đi theo tài khoản, không cài cục bộ): **đã kết nối** Claude Data, Claude Docs, Meetings, Google Slides, Google Sheets, Google Docs, Google Calendar, Gmail, Google Drive; **cần xác thực** Slack, Notion, monday.com, Linear, Intercom, HubSpot, Figma, Canva, Box, Atlassian, Asana.
- MCP của dự án: `studio` (khai trong `.mcp.json`). Lần đầu mở Claude Code trong thư mục dự án sẽ báo "chờ duyệt": chạy `claude` rồi đồng ý.
- Cấp người dùng khác (agent, skill riêng cho công việc khác, bộ GSD): xem phần 3. Danh sách tên **không** nằm trong repo công khai.

### Codex
- Không có plugin hay MCP cấp người dùng. MCP `studio` khai trong `.codex/config.toml` của dự án (cần Trust thư mục dự án để Codex nạp).

### Khác
- Phần mềm tìm thấy: Docker, Go, .NET SDK (dự án không dùng). Trình duyệt Playwright đã tải: chromium-1248, chromium_headless_shell-1248.
- `winget` không có trong PATH của Git Bash trên máy cũ (chưa rõ trong PowerShell); đừng giả định có.
- ffmpeg cài thủ công (giải nén vào `%LOCALAPPDATA%\ffmpeg\ffmpeg-master-latest-win64-gpl\bin` và thêm vào PATH).
