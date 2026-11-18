# Cáo văn phòng — bộ chuyển động dùng cho sản xuất

Mở **[mục lục có clip xem thử](index.html)** để chọn động tác, lấy MOV trong suốt và lệnh dựng, hoặc xem **[video tổng hợp 24 giây](showcase.mp4)**. Đây là bản được tạo lại từ nhận diện Cáo do giám đốc cung cấp, dành cho những chuyển động mà pack cũ bị cắt sai hoặc thiếu frame phù hợp.

**12 chuyển động đã kiểm tra trên nền sáng/tối, 96 file PNG chuẩn hoá, 88 frame độc lập.** Tám file của `sit_down` dùng lại chuỗi `stand_up` theo thứ tự ngược; không tính là tám hình mới. Tất cả canvas PNG 512×512, cùng điểm neo chân `[256,480]`. Không có ô nhãn chữ, phần Cáo hàng bên cạnh hay đường kẻ sheet trong bản sản xuất này.

| Mã | Động tác | Nguồn frame/s | Cách phát | Đạo cụ và lưu ý |
|---|---|---:|---|---|
| `wave` | Vẫy chào | 8 | Lặp | Đứng tại chỗ, không đạo cụ |
| `chair_spin` | Xoay ghế một vòng | 6 | Lặp | Đã có ghế và Cáo ngồi; không thêm ghế chồng lên |
| `stand_up` | Đứng dậy từ ghế | 6 | Một lần, giữ cuối | Ghế vẫn nằm trong lớp ảnh |
| `sit_down` | Ngồi xuống ghế | 6 | Một lần, giữ cuối | Đảo thứ tự `stand_up`, ghế vẫn trong ảnh |
| `walk` | Đi bộ tại chỗ | 8 | Lặp | Muốn đi ngang cảnh cần thêm chuyển vị toàn lớp |
| `idle_blink` | Đứng dẫn chuyện, chớp mắt | 4 | Lặp | Không khớp miệng theo âm thanh |
| `point_present` | Giơ tay chỉ dẫn | 6 | Một lần, giữ cuối | Chỉ về bên phải màn hình, không có bảng sẵn |
| `bow` | Cúi chào rồi đứng lại | 6 | Một lần, giữ cuối | Không đạo cụ |
| `nod` | Gật đầu | 6 | Lặp | Gật nhẹ ở cổ, thân đứng yên |
| `turn` | Quay người một vòng | 6 | Lặp | Đứng xoay tại chỗ, không có ghế |
| `arms_up` | Giơ hai tay ăn mừng | 6 | Một lần, giữ cuối | Không nhảy; giữ tay giơ ở cuối |
| `desk_typing` | Ngồi bàn gõ máy | 8 | Lặp | Đã có bàn, ghế, laptop; chuyển động bàn tay nhỏ |

## Dùng ngay

- `clips/<mã>.mov`: lớp video **1080×1920, 30 fps, qtrle/argb**, có alpha, dài 2 giây, đặt chân tại y=1500 (cách đáy 420 px). Không có âm thanh. Ghép tại x=0, y=0 lên cảnh dọc cùng kích thước.
- `previews/<mã>.mp4` và `<mã>-light.mp4`: xem thử nền tối/sáng, H.264 yuv420p, faststart. Đây là preview có nền, không phải lớp trong suốt.
- `frames/<mã>/0001.png…0008.png`: từng frame RGBA, giữ thứ tự.
- `manifest.json`: mã chuyển động, frame, checksum, FPS nguồn, điểm neo, chế độ lặp và kết quả QC.
- `qc/export-measurements.json`: số đo ffprobe của các lớp video xuất thật.
- `qc/release-report.json`: báo cáo bàn giao và đối soát cuối.
- `generated/*-prompt.json`: prompt đầy đủ, chế độ **built-in imagegen**, nguồn và thông tin AI của từng atlas. Không chạy CLI/API riêng.

Lấy lớp theo thời lượng cảnh từ thư mục gốc xưởng:

```powershell
node tools/fox/animate.mjs --list
node tools/fox/animate.mjs --id wave --duration 6 --out <thu_muc_video>/assets/cao-wave.mov
node tools/fox/animate.mjs --id stand_up --duration 4 --out <thu_muc_video>/assets/cao-stand-up.mov
node tools/fox/animate.mjs --id chair_spin --duration 4 --bg 1b2a49 --out <thu_muc_video>/assets/cao-chair-preview.mp4
```

Thay `<thu_muc_video>` bằng thư mục video được giao. Chuyển động có `loop:true` tự lặp đủ thời lượng; động tác một lần giữ frame cuối. `--repeat once` kết thúc ngay sau chuỗi gốc; `--repeat hold` phát một lần rồi giữ cuối. Dùng `--overwrite` khi chủ động dựng lại cùng file.

Ví dụ ghép lớp dọc, giữ âm thanh của cảnh nền:

```powershell
ffmpeg -i <canh_nen.mp4> -i <cao-wave.mov> -filter_complex "[0:v][1:v]overlay=0:0:format=auto:eof_action=pass,format=yuv420p[v]" -map "[v]" -map "0:a?" -c:v libx264 -crf 18 -c:a copy -movflags +faststart <canh_da_ghep.mp4>
```

Lớp Cáo nên được dựng bằng `--duration` đúng độ dài cảnh. Không lặp động tác đứng/ngồi bằng `-stream_loop`; dùng chế độ giữ pose cuối. Bố trí phụ đề phía trên đầu Cáo, giữ khoảng trống giao diện nền tảng dưới y=1500 theo storyboard.

## Phạm vi chất lượng đã kiểm tra

- Đã xem các frame giải mã từ MP4 thật trên hai nền và kiểm thứ tự cả tám pose của từng chuyển động. Gõ máy được xem thêm vùng bàn tay phóng lớn.
- Không cắt mất pixel nhân vật alpha ≥32; giữ nguyên RGBA của vùng ảnh được xuất. Một số pixel alpha rất thấp ở mép ô được thống kê trong QC khi căn chân; nguồn atlas vẫn giữ nguyên.
- Nhân vật thực cao **373–473 px** tùy tư thế. Canvas video 1080×1920 không làm nguồn thành ảnh HD. Mặc định không phóng quá kích thước PNG; nếu cần lớn hơn có thể dùng `--height 760 --allow-upscale` và phải xem lại độ mềm của hình.
- Đây là chuyển động theo tám keyframe, nguồn 4–8 fps. Video xuất 30 fps lặp khung để giữ tốc độ; không giả định có 30 hình chuyển động độc lập mỗi giây và không tự nội suy.
- `PASS` là kết quả QC tài nguyên ở kích thước gốc, không thay thế duyệt storyboard hay QC video cuối. Bộ này không cung cấp đồng bộ khẩu hình theo giọng đọc.

## Planner / Visual Director / Producer

Ghi mã chuyển động và chế độ lặp/giữ cuối trong mô tả cảnh, chọn đúng động tác và đạo cụ. Đối với cảnh cần cận cảnh lớn hoặc chuyển động điện ảnh mượt, phải kiểm tra ở kích thước dự kiến; không mặc định các keyframe này đáp ứng mọi góc máy.

`tools/fox/animate.mjs` là đường dựng đã hoạt động cho bộ mới, hoặc dùng trực tiếp MOV đã xuất. **Mã animation không phải tên pose trong whitelist Remotion.** Không thay `fox_pose` bằng `chair_spin`, `walk`… trong storyboard rồi mong renderer tự tải. Mã `studio/` và schema chưa được thay đổi trong công việc này. Đưa lớp alpha vào bước ghép của cảnh bằng FFmpeg; nếu pipeline được giao bắt buộc chỉ dùng Remotion và chưa có adapter video, báo rõ giới hạn để người phụ trách renderer tích hợp, không âm thầm đổi thành pose tĩnh.

Đối chiếu với pack nguồn:

- Nhóm 01–02: dùng các chuỗi `chair_spin`, `stand_up`, `sit_down`, `turn` mới.
- Nhóm 03: có `idle_blink`, `wave`, `walk`, `point_present`, `arms_up`, `desk_typing`; các tư thế/đạo cụ khác vẫn chọn đúng pose hiện có theo [catalog cũ](../catalog.png).
- Nhóm 04: có `wave`, `point_present`, `nod`, `bow`, `turn`, `arms_up`. Động tác nhấn mạnh/trình bày cụ thể cần được chọn theo ý cảnh, không coi mọi động tác là tương đương.
- Nhóm 05–06: dùng các pose đã tách đúng từ cùng artwork trong `brand/cao/poses/`; đối chiếu 15 mã ở [bảng thay thế](../animation-pack/production-alternatives.json).
- Nhóm 07: đầu biểu cảm và miệng tham khảo vẫn thuộc thư viện riêng; chưa có bộ rig/khẩu hình đồng bộ âm thanh. Không dùng ảnh cắt lệch trong pack nguồn làm khuôn miệng.

Pack 458 ô cũ vẫn giữ nguyên trong [kho nguồn](../animation-pack/index.html) để đối soát, không biến các ô lỗi thành frame đã đạt bằng cách đổi nhãn.

## Nguồn và dựng lại

Giám đốc xác nhận thiết kế Cáo được tạo bằng Codex và cho phép sửa/tạo thêm. Các atlas mới tạo bằng công cụ imagegen tích hợp, lấy mẫu Cáo gốc làm tham chiếu nhận diện. Mọi video sử dụng tiếp tục đặt `ai_generated_content:true` và công bố nội dung AI theo quy định của xưởng.

```powershell
& 'C:/Users/PC/AppData/Local/Programs/Python/Python312/python.exe' -X utf8 tools/fox/build-production.py
node tools/fox/review-animations.mjs
& 'C:/Users/PC/AppData/Local/Programs/Python/Python312/python.exe' -X utf8 tools/fox/catalog-production.py
```

Builder chỉ cắt/pad PNG bằng FFmpeg, đọc alpha để căn chân, không sửa màu/nền hoặc vẽ lại bằng Python. Thay đổi frame/checksum/FPS sẽ đưa chuỗi về cần kiểm tra; không tự cấp PASS. Công cụ cần Python Pillow + numpy, Node, FFmpeg đầy đủ có qtrle/libx264; có thể chỉ định đường dẫn ffmpeg/ffprobe theo `--help` của renderer.
