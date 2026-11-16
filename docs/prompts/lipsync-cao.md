# PROMPT giao cho agent khác: thêm "nhép miệng" cho linh vật Cáo văn phòng

> Cách dùng: mở một phiên agent mới (Claude Code, Codex…) **với thư mục làm việc là `E:\Tiktoker`**, dán toàn bộ phần trong khung bên dưới làm tin nhắn đầu tiên.
> Máy triển khai là PC mạnh của giám đốc (cấu hình chưa rõ, agent phải tự kiểm tra, xem mục 8). Máy phát triển hiện tại chỉ có CPU Intel i7-13700H, RAM 31,5 GB, không có card rời.

````text
Bạn là kỹ sư đồ hoạ/video. Nhiệm vụ: thêm tính năng NHÉP MIỆNG (lip-sync) cho linh vật "Cáo văn phòng" của kênh video ngắn, để miệng cáo mở/đóng khớp với giọng đọc tiếng Việt. Làm trong thư mục E:\Tiktoker. Trả lời và viết tài liệu bằng tiếng Việt có dấu.

## 1. Bối cảnh (đọc trước khi làm)
- Kênh "Cáo văn phòng": video dọc 9:16 (1080x1920) cho TikTok/Facebook Reels/YouTube Shorts. Linh vật là cáo cam 3D hoạt hình mặc đồ công sở (kính tròn, sơ mi trắng, cà vạt). TOÀN BỘ nội dung gắn nhãn AI.
- Ảnh nguồn do giám đốc cung cấp: assets/mascot/*.png (4 tờ sticker, 1536x1024). KHÔNG sửa/xoá/di chuyển thư mục này.
- Từ đó đã tách ra bộ sticker nền trong suốt: brand/cao/poses/ (46 dáng cả người, PNG RGBA, cao khoảng 330px), brand/cao/faces/ (10 đầu biểu cảm), brand/cao/mouths/ (12 hình miệng cận cảnh), brand/cao/motion/ (48 khung nhỏ ~120px), brand/cao/catalog.png (tờ tra cứu có tên). Công cụ tách: tools/fox/extract.py, tools/fox/build.py, tools/fox/names.json.
- Công cụ dựng lớp dẫn truyện hiện có: tools/fox/narrate.mjs (Node 24, ESM). Nó nhận --audio hoặc --srt, tạo lớp .mov trong suốt (qtrle/argb), đổi dáng theo --timeline, nhún theo độ lớn tiếng. Các hàm xuất ra: planFrames, transformFor, frameSVG, narrate, listPoses, assertPoses; dùng lại analyzeAudio/parseSrt/envelopeFromCues từ tools/mascot/narrate.mjs. Có test: cd tools/fox && npm test (7 test đang đạt, phải giữ đạt).
- Tài liệu cần đọc: docs/mascot.md (giới hạn đã đo), docs/voice.md (giọng đọc VN), .agents/skills/video-producer/references/ffmpeg-recipes.md mục 8 (cách ghép lớp Cáo vào video), docs/platform-specs.md, CLAUDE.md và AGENTS.md (luật dự án).
- Bộ chỉ số miệng tham khảo (kiểu Chíp cũ, đã ngừng dùng nhưng có thuật toán hay): tools/mascot/narrate.mjs hàm planFrames (map độ lớn tiếng -> 5 mức miệng, giữ tối thiểu 2 khung, chống nhấp nháy).

## 2. Vì sao chưa nhép miệng được (đã đo, không phải ước đoán)
1. Sticker là ảnh tĩnh của từng dáng; mỗi dáng chỉ có MỘT hình miệng.
2. brand/cao/mouths/ là 12 ảnh cận cảnh mõm/miệng rời, KHÔNG cùng góc nhìn/tỉ lệ/ánh sáng với từng dáng nên không dán thẳng lên đầu được.
3. brand/cao/faces/ là đầu biểu cảm ở một góc cố định, khác với đầu của từng dáng cả người.
4. Độ phân giải thấp (khoảng 330px cao cho cả người, đầu chỉ khoảng 100–130px).
5. Nhiều dáng nghiêng 3/4 hoặc đầu cúi, miệng khuất một phần.

## 3. Mục tiêu và yêu cầu bắt buộc
- Thêm cờ: node tools/fox/narrate.mjs --audio vo.wav --timeline tl.json --lipsync <chế-độ> --out cao.mov. Không có cờ thì kết quả giống hệt hiện tại (không đổi hành vi cũ).
- Đầu ra vẫn là lớp .mov trong suốt cùng thời lượng với audio, cùng kích thước khung, ghép được bằng công thức ffmpeg mục 8 (không đổi công thức ghép).
- Miệng khớp tiếng: tương quan giữa độ mở miệng và đường bao âm thanh phải lệch không quá +-2 khung (khoảng 66 ms ở 30 fps); lúc im lặng miệng khép; không nhấp nháy 1 khung.
- Chạy được với giọng tiếng Việt (có dấu, thanh điệu); không phụ thuộc giọng cụ thể nào.
- Tất định: cùng đầu vào + cùng seed -> cùng kết quả. Nếu dùng mô hình AI có ngẫu nhiên thì cố định seed và ghi lại.
- Chỉ áp dụng cho các dáng "nhìn rõ miệng" (liệt kê trong một tệp cấu hình, ví dụ tools/fox/lipsync-poses.json). Dáng nào không hỗ trợ thì tự rơi về cách cũ (nhún theo tiếng) và in cảnh báo, KHÔNG làm hỏng cả video.
- Không có kết nối mạng lúc chạy dựng video (chỉ cho phép lúc cài đặt/tải mô hình một lần).
- Không để ảnh có quầng/viền lạ: ảnh đầu ra phải sạch kênh alpha như sticker gốc (đã xử lý defringe trong tools/fox/extract.py).

## 4. Các hướng làm (bạn tự đánh giá rồi chọn; thử NHANH trên 5 dáng trước khi làm cho cả bộ)
A. Phủ miệng thủ tục (rẻ nhất, thử đầu tiên): xoá/che miệng gốc ở vùng mõm bằng vá màu/vá lông, rồi vẽ 5 hình miệng (khép, hé, vừa, to, chữ O) bằng SVG hoặc dùng/biến đổi ảnh trong brand/cao/mouths/, đặt theo một neo (x, y, góc, tỉ lệ) cho từng dáng ghi trong tools/fox/lipsync-anchors.json. Cần cách tạo neo tự động (phát hiện mũi/mắt) hoặc bán thủ công, và kiểm tra bằng ảnh.
B. Sinh biến thể miệng bằng mô hình ảnh (chất lượng cao hơn): với mỗi dáng được chọn, tạo N ảnh có cùng dáng nhưng miệng khác nhau bằng chỉnh sửa ảnh cục bộ (inpainting/image-edit trên vùng miệng, giữ nguyên phần còn lại), rồi lúc dựng chỉ hoán đổi ảnh theo viseme. Phải kiểm tra tính nhất quán giữa các biến thể (không đổi màu, không lệch kính, không đổi tai).
C. Mô hình "talking head" lái bằng âm thanh (Wav2Lip, MuseTalk, LivePortrait, SadTalker hoặc tương đương): thử trên vùng đầu rồi ghép vào thân. Cảnh báo: nhân vật hoạt hình/thú thường làm các mô hình này hỏng; nhiều mô hình/phụ thuộc có giấy phép PHI THƯƠNG MẠI. Phải thử thật và đọc giấy phép từng thành phần.
D. Nếu A–C không đạt: đề xuất cụ thể cho giám đốc cần cung cấp gì thêm (ví dụ: bộ đầu cáo cùng góc nhìn với 5–8 hình miệng, ảnh độ phân giải cao hơn, hoặc rig riêng) kèm thông số kỹ thuật cần có. Đây là kết quả hợp lệ nếu có bằng chứng.
Nguồn viseme: bắt đầu từ đường bao biên độ (đã có); nếu cần chính xác hơn, thử căn chỉnh âm vị tiếng Việt (ví dụ mô hình phoneme CTC hoặc Whisper có mốc từ) rồi ánh xạ sang 5–8 hình miệng. Nói rõ vì sao chọn.

## 5. Dữ liệu thử có sẵn / cần tạo
- Câu mẫu: tools/voice/sample_text.txt. Giọng thử: tự tạo bằng TTS tiếng Việt có giấy phép cho phép (xem docs/voice.md; VieNeu-TTS Apache-2.0 là ứng viên) hoặc dùng file wav do giám đốc cung cấp. Giọng Windows có sẵn chỉ có tiếng Anh, chỉ dùng để thử kỹ thuật, không dùng để đánh giá phát âm Việt.
- 5 dáng thử gợi ý (đầu rõ, nhìn thẳng): present_open, wave, think, thumbs_up, welcome. Mở brand/cao/catalog.png để chọn thêm.

## 6. Tiêu chí nghiệm thu (có bằng chứng, không chỉ "chạy không lỗi")
1. cd tools/fox && npm test: toàn bộ đạt, kể cả test mới bạn thêm (hàm thuần: ánh xạ biên độ->viseme, giữ tối thiểu 2 khung, dáng không hỗ trợ thì rơi về cách cũ, tất định).
2. Đo độ lệch đồng bộ bằng số: xuất đường bao âm thanh và đường bao độ mở miệng của clip thử, báo độ lệch cực đại/trung bình (ms).
3. Trích >= 8 khung hình (ffmpeg -ss ... -frames:v 1) tại các thời điểm miệng đóng/hé/mở to, ghép thành tờ ảnh và MỞ XEM: không có hai miệng chồng nhau, không viền lạ, không giật vị trí giữa các khung của cùng dáng quá 2 px.
4. Ghép thử vào video 1080x1920 theo ffmpeg-recipes mục 8 và chạy node tools/qc-video.mjs <file> --min 5 -> pass.
5. Báo thời gian dựng/giây video và dung lượng bộ nhớ cao nhất; ghi cấu hình máy (CPU/GPU/RAM) đã đo.
6. Bảng giấy phép: từng mô hình/thư viện đã dùng, phiên bản, giấy phép, có cho dùng thương mại không, nguồn xác minh. Thành phần nào không rõ -> đánh dấu "chưa xác minh" và KHÔNG đưa vào đường chạy mặc định.

## 7. Giao nộp
- Mã trong tools/fox/ (đừng sửa tools/mascot/, assets/, studio/, .claude/, CLAUDE.md, AGENTS.md; nếu cần đổi tài liệu của dự án thì chỉ sửa docs/mascot.md mục "Giới hạn đã biết" và thêm docs/lipsync.md).
- docs/lipsync.md: cách làm đã chọn, vì sao, cách chạy, kết quả đo, giới hạn còn lại, cách mở rộng sang dáng mới.
- Phụ thuộc Python/Node mới: đặt trong môi trường riêng (ví dụ tools/fox/.venv, đã được bỏ qua bởi git), ghi phiên bản chính xác vào tools/fox/requirements-lipsync.txt; KHÔNG cài toàn cục. Thêm vào .gitignore nếu cần.
- Báo cáo cuối (ngắn): đã làm gì, bằng chứng (lệnh + kết quả + ảnh khung hình), cái gì CHƯA kiểm chứng, rủi ro, việc cần giám đốc quyết. Không tuyên bố "xong" khi chưa có bằng chứng ở mục 6.

## 8. Môi trường và luật làm việc
- Windows 11; Node 24; Python 3.12; ffmpeg/ffprobe có sẵn (libx264, libass, drawtext...). Python in tiếng Việt: dùng "python -X utf8". Trong bash/PowerShell cẩn thận ký tự "\" khi tạo tệp (đã gặp lỗi mất dấu "\" khi tạo tệp qua shell: dùng công cụ ghi tệp hoặc path.join).
- Máy triển khai mạnh nhưng chưa rõ cấu hình: chạy "nvidia-smi" (nếu có) và ghi lại GPU/VRAM trước khi chọn mô hình; thiết kế để chạy được cả khi không có GPU (chậm hơn) hoặc báo rõ yêu cầu tối thiểu.
- Trước khi sửa tệp đã có, đọc nó. Không xoá/ghi đè tệp của người khác khi chưa xem. Không commit/push. Không tự cấp quyền, không sửa cấu hình Claude/Codex.
- Mọi nội dung đầu ra dùng AI nên cần được gắn nhãn AI khi đăng (đã chốt): không thêm cơ chế che giấu.
- Có điểm mơ hồ mà giám đốc phải quyết (ví dụ chất lượng chấp nhận được): chọn phương án an toàn, ghi giả định vào docs/lipsync.md, hỏi ở báo cáo cuối thay vì dừng giữa chừng.
````
