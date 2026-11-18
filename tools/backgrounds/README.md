# Nền theo ngữ cảnh cho Cáo văn phòng

Chạy từ thư mục gốc của xưởng với Python 3 và Pillow.

```powershell
python tools/backgrounds/make_background.py --list-themes
python tools/backgrounds/make_background.py --theme database --out "<thư_mục_video>/assets/backgrounds" --layers
python tools/backgrounds/make_background.py --theme office --out "<thư_mục_video>/assets/backgrounds" --seed 4 --size 1080x1920 --accent "#D9A16F"
```

Mặc định xuất `<theme>_<seed>.png` RGB 1080×1920 với seed 1 và màu nhấn của chủ đề. Giữ nguyên tham số và phiên bản Python/Pillow để tái tạo ảnh. Ưu tiên tỉ lệ 9:16 để giữ bố cục.

## Dùng ba lớp trong dựng

- `_far.png` là lớp xa phủ kín khung, gồm ánh sáng, không gian và sàn.
- `_mid.png` là lớp vật thể theo chủ đề, để trống phần giữa khung trong vùng y≈250–1500 ở 1080×1920.
- `_near.png` là lớp cận cảnh, gồm mép khung, hạt bụi và quầng sáng ở rìa.

Ba lớp đều là PNG RGBA cùng kích thước. Ghép alpha theo thứ tự xa → giữa → gần bằng Pillow cho kết quả khớp từng pixel với PNG RGB. Dùng PNG RGB trực tiếp cho cảnh nền tĩnh.

### Parallax bằng FFmpeg

Đã thử với ba lớp `database_1` ở 1080×1920, 30 fps. Chạy trong thư mục chứa ba PNG. Mỗi lớp được phóng nhẹ để chừa mép dịch chuyển. Lớp xa, giữa và gần dịch theo biên độ lần lượt 3, 8 và 14 px.

```powershell
$parallax = "[0:v]scale=1116:1984,crop=1080:1920:x='18+3*sin(2*t)':y=32,format=rgb24[f];" +
  "[1:v]scale=1116:1984,format=rgba[m];[2:v]scale=1116:1984,format=rgba[n];" +
  "[f][m]overlay=x='-18-8*sin(2*t)':y=-32:eval=frame:format=rgb[fm];" +
  "[fm][n]overlay=x='-18-14*sin(2*t)':y=-32:eval=frame:format=rgb,format=yuv420p[v]"
ffmpeg -loop 1 -framerate 30 -i database_1_far.png `
  -loop 1 -framerate 30 -i database_1_mid.png `
  -loop 1 -framerate 30 -i database_1_near.png `
  -filter_complex $parallax -map "[v]" -t 1 -c:v libx264 -movflags +faststart parallax-preview.mp4
```

Một video dùng một họ phong cách. Khi nội dung đổi chủ đề nền, dùng chuyển cảnh mềm như crossfade hoặc zoom nhẹ để tránh cắt đột ngột. Đặt sơ đồ và phụ đề trên vùng giữa, rồi xem lại khung thật ở 360×640.

Ảnh nền không có chữ. Nền do xưởng tự vẽ bằng Pillow nên không cần thêm dòng vào `library/LICENSES.md`.
