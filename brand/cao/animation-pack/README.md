# Thư viện Cáo Mít — tra cứu nguyên liệu

> **Bản sản xuất đã tạo lại:** chọn chuyển động và MOV trong suốt tại [production-pack/index.html](../production-pack/index.html); xem [hướng dẫn sử dụng mới](../production-pack/README.md). Bộ trong thư mục này tiếp tục giữ nguyên nguồn và lỗi để đối soát.

Mở **[index.html](index.html)** để xem ảnh, tìm mã và lọc theo nhóm. Mục lục hoạt động trực tiếp trên máy, không cần mạng. Bấm một ô để xem ảnh nguyên bản trên nền sáng/tối, giới hạn chất lượng và lệnh xuất lớp ảnh tĩnh.

Đây là bộ nguồn do giám đốc cung cấp, đã nhập nguyên trạng và phân loại; **chưa phải bộ hoạt hình sẵn sàng sản xuất**. Có 458 file frame, chỉ 457 file giải mã được, cùng 7 sprite sheet (1 sheet hỏng). Tổng 467 file nguồn, gồm thêm 2 README. Tất cả bản sao đã đối chiếu SHA-256 với nguồn, tổng 32.138.253 byte. Hai README của tác giả vẫn được giữ trong `originals/` và cũng nêu giới hạn của bộ ảnh.

| Nhóm | Phân loại theo bộ nguồn | Số ô frame | Kích thước ô |
|---|---|---:|---|
| 01 | Xoay ghế, ngồi quay lưng, đứng dậy | 24 | 256×256 |
| 02 | Xoay người, ngồi xuống, xoay ghế | 128 | 96×128 |
| 03 | Dẫn chuyện, đi bộ, biểu cảm, làm việc | 180, hỏng 1 | 76–77×113–114 |
| 04 | Chỉ trỏ, giới thiệu | 48 | 256×128 |
| 05 | Biểu cảm, tư thế | 15 | 307–308×341–342 |
| 06 | Cử chỉ làm việc | 15 | 307–308×341–342 |
| 07 | Khẩu hình, biểu cảm; sheet có cả thân/đầu/miệng | 48 | 128×256 |

Tên nhóm phản ánh ý định của thư mục nguồn, không xác nhận nội dung từng ô. Thứ tự file không phải timeline chuyển động. Chưa có FPS, vòng lặp hay bộ nhép miệng nào được xác minh.

## File dành cho đội sản xuất

- `index.html`: mục lục 458 ô, tìm theo mã/từ khóa, xem lỗi và ảnh gốc.
- `catalog/*.jpg`: 12 bảng ảnh có mã, gồm cả vị trí file frame lỗi; giữ nguyên biên ô để nhìn thấy lỗi cắt.
- `manifest.json`: 457 ảnh đọc được trong `frames[]`, 6 sheet đọc được trong `source_sheets[]`, 2 file lỗi trong `rejected_assets[]`; đường dẫn tính từ thư mục chứa manifest.
- `inventory.csv`: danh sách 465 PNG, mở được bằng Excel, có trạng thái/kích thước/cờ chất lượng/checksum.
- `qc-report.json`: số đo và lỗi kiểm tra thực tế. `production_ready:false`.
- `verification.json`: đối soát toàn bộ checksum, 457 preview, 12 bảng ảnh, 465 dòng PNG trong CSV, 15 pose thay thế và kết quả 10 kiểm thử công cụ.
- `production-alternatives.json`: 15 mã nhóm 05 tương ứng với pose đã tách sẵn trong thư viện hiện tại; mục lục có link ảnh và lệnh `narrate.mjs` để dùng các pose đó.
- `originals/`: toàn bộ nguồn giữ nguyên byte, kể cả file lỗi; không sửa hoặc ghi đè.
- `previews/`: ảnh nhỏ để tra cứu, không phải nguyên liệu đầu ra chất lượng cao.

Mã ví dụ: `cao_mit_05_005` = nhóm 05, file `frame_005.png`. Các mã này thuộc thư viện mới, **chưa phải tên pose của Remotion hay `narrate.mjs`**. Không đưa mã mới trực tiếp vào storyboard đang dùng renderer cũ.

## Dáng tương ứng dùng được trong pipeline hiện tại

Đối chiếu RGB từng pixel xác nhận source sheet nhóm 04, 05, 07 là artwork đã có trong `assets/mascot/`; checksum RGB được lưu tại `manifest.json → existing_artwork_matches`. Alpha của các bản này khác nhau. Không tính các ô cắt lại là chuyển động mới. Nhóm 05 khớp sheet nguồn `d01…d15` của bộ pose hiện tại, nên có thể dùng **tên pose hiện có** sau đây khi kịch bản/storyboard yêu cầu đúng hành động:

| Frame nhóm 05 | Pose hiện có | Frame nhóm 05 | Pose hiện có | Frame nhóm 05 | Pose hiện có |
|---|---|---|---|---|---|
| 001 | `present_open` | 006 | `mic` | 011 | `desk_video` |
| 002 | `point_up` | 007 | `read_paper` | 012 | `cheer_jump` |
| 003 | `board_chart` | 008 | `think` | 013 | `bow` |
| 004 | `thumbs_up` | 009 | `idea` | 014 | `sleep` |
| 005 | `clipboard` | 010 | `arms_crossed` | 015 | `love` |

Đây là đường dẫn tới pose đã tách sẵn từ cùng artwork, không sửa/chấp thuận các ô lỗi trong pack. Ví dụ: `node tools/fox/narrate.mjs --srt <captions.srt> --pose clipboard --out <thu_muc_video>/assets/cao.mov`.

Agent kiểm tra còn ghép RGB của 15 ô nhóm 06 **trong bộ nhớ** và xác nhận trùng toàn bộ artwork `Bộ sticker cáo hoạt hình công sở 3D-1.png` (RGB SHA-256 `0d47fd98ec5ec70c414e5d12ff215eed869ac6a80be30c8c60d4602d68ff0674`). Sheet nguồn có 16 pose theo hàng 5/6/5, pack lại cắt 5×3: không ánh xạ 1 ô = 1 pose. Các pose đã tách đúng từ artwork này nằm trong `brand/cao/poses/`: `present_open_2`, `point_left`, `point_right`, `point_up_2`, `point_down`, `arms_crossed_2`, `wave`, `clipboard_2`, `laptop_hold`, `think_2`, `idea_2`, `desk_typing`, `desk_headset`, `cheer_seated`, `shrug`, `board_chart_2`. Xem [catalog hiện tại](../catalog.png) để chọn đúng dáng và đạo cụ.

## Tra cứu và xuất lớp ảnh tĩnh

Chạy từ thư mục gốc xưởng:

```powershell
node tools/fox/pack-still.mjs --list --group 05
node tools/fox/pack-still.mjs --id cao_mit_05_005
node tools/fox/pack-still.mjs --id cao_mit_05_005 --ack-review --duration 3 --out <thu_muc_video>/assets/cao-still.mov
node tools/fox/pack-still.mjs --id cao_mit_05_005 --ack-review --duration 3 --bg 1b2a49 --out <thu_muc_video>/assets/cao-preview.mp4
```

Thay `<thu_muc_video>` bằng thư mục video được giao. Xem ảnh gốc và cảnh báo trước khi chọn. `--ack-review` xác nhận đã đọc giới hạn của ảnh; không thay thế việc duyệt storyboard hoặc QC. Công cụ chỉ xuất **một ảnh tĩnh** thành lớp MOV qtrle có alpha, hoặc MP4 nền màu để kiểm tra. Canvas mặc định 1080×1920, 30 fps, cách đáy 420 px, cắt phần viền hoàn toàn trong suốt theo alpha bbox. Không tự làm sạch nền, sửa hình bị cụt, nối frame, thêm chuyển động hay ghép khẩu hình.

Mặc định giữ kích thước vùng có nội dung không vượt độ phân giải gốc. `--height 760` vẫn bị giới hạn theo chiều cao gốc; chỉ phóng khi thêm `--allow-upscale`, ảnh sẽ mềm. Đội sản xuất phải xem khung hình thật và làm đúng storyboard. Tool trả số đo `ffprobe` cùng `production_approved:false` và `animation_verified:false`.

Tool tự tìm ffmpeg/ffprobe đã cài hoặc bản kèm Remotion; có thể truyền `--ffmpeg <ffmpeg.exe>` và `--ffprobe <ffprobe.exe>`. Bản đầy đủ đã kiểm tra ở `C:/Users/PC/AppData/Local/ffmpeg/ffmpeg-master-latest-win64-gpl/bin/`. Bản FFmpeg kèm Remotion thiếu encoder `qtrle`, không dùng để xuất MOV alpha; nếu gặp lỗi thiếu encoder hãy chỉ định bản đầy đủ. Không ghi output vào thư viện nguồn. Xem [bản xuất thử và số đo](../animation-pack-examples/) để kiểm tra cách xuất, **không dùng đó làm bằng chứng ảnh đã đạt chất lượng**.

## Vướng chất lượng đã xác nhận

1. Nhóm 03 `frame_039.png` = 0 byte, không đọc được; không xuất hiện trong danh sách ảnh có thể dựng.
2. Nhóm 06 `sprite_sheet_goc.png` bị truncated, không giải mã đầy đủ; không tự cứu bằng cách cho phép đọc ảnh thiếu dữ liệu.
3. Có alpha nhưng vẫn còn nền màu. Nhóm 01 `frame_001` còn mảng tối và đường kẻ.
4. Lưới cắt lệch: nhóm 02 `frame_008` chứa hai nửa Cáo; nhóm 03 `frame_001` cụt bên phải; nhóm 04 `frame_001` chỉ có nhãn “Vẫy chào (6 khung)”; nhóm 05 `frame_001` cụt tay và lẫn tai hàng dưới; nhóm 06 `frame_008` có hai Cáo bị chia đôi; nhóm 07 `frame_001` cắt qua mặt/thân.
5. Tất cả ô thấp hơn mức tham chiếu 1000 px. Chưa xác minh tính liên tục giữa các frame, cùng góc nhìn hay điểm neo. Cờ `foreground_touches_cell_boundary` chỉ là sàng lọc máy; không có cờ này vẫn có thể bị cắt sai.

Muốn dựng chuyển động thật cần cắt lại theo từng nhân vật từ sheet còn tốt, tách nền và căn chỉnh đúng, kiểm tra từng chuỗi; file sheet lỗi cần bản nguồn đầy đủ. Không thể có thêm khung chuyển động thật chỉ bằng đổi tên hoặc phát tuần tự các ô này.

## Nhập lại có kiểm tra

```powershell
& 'C:/Users/PC/AppData/Local/Programs/Python/Python312/python.exe' -X utf8 tools/fox/import-pack.py 'C:/Users/PC/Downloads/Cao_Mit_Animation_Pack_Final_PNG/Cao_Mit_Animation_Pack_Final_PNG'
```

Importer cần Pillow. Chạy lại trên cùng nguồn sẽ kiểm checksum và tạo lại chỉ mục/preview. Nếu bản gốc đích khác nguồn, dừng thay vì ghi đè. Không thay bộ `brand/cao/poses`, không sửa `assets/mascot`, storyboard, cấu hình hay mã `studio/`.
