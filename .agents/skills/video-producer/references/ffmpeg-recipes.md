# Công thức ffmpeg (Windows) — đã kiểm chứng trên máy này

Máy có ffmpeg bản git 2026 với: libx264, aac, drawtext, subtitles/ass (libass, font provider DirectWrite), loudnorm, xfade, zoompan, tpad.

## 1. Thông số xuất chuẩn
```
-c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r 30 \
-c:a aac -b:a 160k -ar 48000 -movflags +faststart
```

## 2. Chữ tiêu đề có dấu tiếng Việt (drawtext)  ✅ đã kiểm
```
drawtext=fontfile='C\:/Windows/Fonts/segoeuib.ttf':text='Khởi động đúng cách':fontcolor=white:fontsize=84:x=(w-text_w)/2:y=420
```
- Phông có sẵn: `segoeui.ttf`, `segoeuib.ttf` (đậm), `arial.ttf`, `arialbd.ttf`, `tahoma.ttf`, `bahnschrift.ttf` trong `C:/Windows/Fonts/`.
- Chữ dài hoặc có `' : %` → dùng `textfile='tieude.txt'` (UTF-8) thay cho `text=`. Tự xuống dòng bằng nhiều drawtext hoặc file nhiều dòng.
- Hiện theo thời gian: thêm `:enable='between(t,0,3)'`.
- Nền mờ sau chữ: `box=1:boxcolor=black@0.45:boxborderw=24`.

## 3. Phụ đề cứng từ SRT (subtitles/libass)  ✅ đã kiểm — CÓ BẪY ĐƠN VỊ
Với file `.srt`, libass dùng hệ toạ độ **384×288** (không phải kích thước video), `original_size` **không** thay đổi điều này. Với video 1080×1920, **1 đơn vị = 6,67 px**.
```
subtitles=captions.srt:force_style='FontName=Segoe UI,Bold=1,FontSize=9,Outline=1,Shadow=0,Alignment=2,MarginV=63,MarginL=14,MarginR=14'
```
| thông số | giá trị | ≈ pixel (1920 cao) |
|---|---|---|
| FontSize | 9 | ~60 px |
| Outline | 1 | ~7 px viền |
| MarginV | 63 | chữ cách đáy ~420 px |
| MarginL/R | 14 | ~93 px |

Sai thường gặp: đặt `FontSize=60`/`MarginV=400` → chữ khổng lồ hoặc văng ngoài khung và **ffmpeg không báo lỗi**. Chạy lệnh trong thư mục chứa `.srt` (đường dẫn tương đối). Muốn kiểm soát pixel tuyệt đối: viết trực tiếp file `.ass` (PlayResX=1080, PlayResY=1920) rồi dùng `ass=captions.ass`.

## 4. Chuẩn hoá âm lượng  ✅ đã kiểm
`-af loudnorm=I=-14:TP=-1.5:LRA=11`
(Hiện KHÔNG dùng nhạc nền — giám đốc chốt 18/11/2026; công thức giữ để tham khảo.) Trộn nhạc nền + lời: `[0:a]volume=1[v];[1:a]volume=0.2[m];[v][m]amix=inputs=2:duration=first:dropout_transition=0,loudnorm=I=-14:TP=-1.5:LRA=11` (⚠ chưa kiểm — thử rồi xem `qc-video`).

## 5. Nền màu / thẻ chữ không cần nguyên liệu  ✅ đã kiểm
```
-f lavfi -i "color=c=0x1b2a49:s=1080x1920:r=30:d=10"
-f lavfi -i "anullsrc=r=48000:cl=stereo"     # im lặng, nếu cần luồng audio giả (chỉ khi plan cho phép video không tiếng)
```

## 6. Thumbnail
`ffmpeg -ss 1 -i final/x_9x16.mp4 -frames:v 1 -q:v 2 final/thumbnail.jpg`

## 7. Trích khung hình để QC bằng mắt
`ffmpeg -ss 0.5 -i x.mp4 -frames:v 1 -q:v 3 qc_05.jpg` (lặp ở giữa và gần cuối, rồi mở ảnh xem)

## 8. Video có Cáo văn phòng dẫn truyện (tiêu đề + phụ đề + linh vật + giọng đọc)  ✅ đã kiểm cả khung hình
Bước 1 — tạo **lớp Cáo trong suốt** cùng thời lượng với giọng đọc (hoặc `--srt captions.srt --intro` nếu chưa có giọng); `timeline.json` ghi mốc đổi dáng theo cột **Cáo** của `script.md`:
```
node tools/fox/narrate.mjs --audio vo.wav --timeline timeline.json --out assets/cao.mov --height 760
```
Bước 2 — ghép (chạy trong thư mục chứa `captions.srt`, `title.txt` UTF-8):
```
ffmpeg -y -f lavfi -i "color=c=0x1b2a49:s=1080x1920:r=30:d=<thời lượng>" -i assets/cao.mov -i vo.wav \
 -filter_complex "[0:v]drawtext=fontfile='C\:/Windows/Fonts/segoeuib.ttf':textfile=title.txt:fontcolor=white:fontsize=96:x=(w-text_w)/2:y=300,subtitles=captions.srt:force_style='FontName=Segoe UI,Bold=1,FontSize=9,Outline=1,Shadow=0,Alignment=2,MarginV=190,MarginL=14,MarginR=14'[bg];[1:v]format=rgba[m];[bg][m]overlay=x=(W-w)/2:y=H-h-420:format=auto,format=yuv420p[v]" \
 -map "[v]" -map 2:a -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r 30 -c:a aac -b:a 160k -ar 48000 -movflags +faststart -shortest final/<id>_9x16.mp4
```
**Bố cục đã đo (khung 1080×1920, Cáo cao 760px):**
| Vùng | y (từ trên xuống) | Ghi chú |
|---|---|---|
| Tiêu đề | ~300–420 | `drawtext` fontsize 96 |
| Phụ đề | ~680–760 | `MarginV=190` (đơn vị 384×288 ≈ 1270px tính từ đáy) — **nằm trên đầu Cáo** |
| Cáo | ~800–1500 | chân chạm y=1500 (`overlay y=H-h-420`) |
| Vùng giao diện nền tảng | 1500–1920 | không đặt gì quan trọng |
⚠ Đừng dùng `MarginV=63` (phụ đề sát đáy) khi có Cáo: phụ đề sẽ đè lên chân Cáo. Muốn nội dung chính (đồ hoạ/số liệu) chiếm khoảng giữa thì thu Cáo nhỏ lại (`--height 520`) hoặc `--pos left|right`.

> **Bố cục "Cáo cao 760 px" ở trên là mẫu CŨ, trước yêu cầu Y2/Y3 của giám đốc (18/11/2026).** Luật hiện hành (`docs/chat-luong-xem.md`, `docs/mascot.md`): Cáo **chỉ xuất hiện ở cảnh mở / giữa (vài thời điểm quan trọng) / kết**, không xuất hiện liên tục; khi cùng minh hoạ Cáo rộng khoảng **15–25% khung (162–270 px ở 1080 px)**. Quy đổi: sticker có rộng/cao ≈ 0,62–0,83 (ví dụ `think` 205×331, `point_right` 279×338), nên `--height` ≈ **200–430 px tuỳ dáng** (đo bằng ảnh thật rồi chọn cho rộng nằm trong 162–270 px; ảnh nguồn cao ≈ 330 px nên chỉ phóng tối đa ~1,5 lần). Chỉ bật lớp Cáo ở các mốc có Cáo bằng `overlay=...:enable='between(t,A,B)'` (hoặc cắt lớp `.mov` theo mốc); ngoài các mốc đó không ghép Cáo. `MarginV` của phụ đề tính lại theo vị trí/cỡ Cáo thực tế (khi Cáo nhỏ hơn, phụ đề có thể thấp hơn mẫu trên; vẫn phải nằm trong vùng an toàn và **trên đầu Cáo** khi Cáo hiện). Luôn mở khung thật để kiểm.

## 9. Tham khảo, CHƯA kiểm — tự thử và xác minh bằng khung hình
- Ảnh tĩnh thành cảnh chuyển động (Ken Burns): `zoompan=z='min(zoom+0.0008,1.2)':d=150:s=1080x1920:fps=30` (d = số khung hình).
- Chuyển cảnh mờ: `xfade=transition=fade:duration=0.4:offset=<giây>` (cần cả hai đoạn cùng kích thước/fps/pix_fmt).
- Ghép đoạn: dùng `concat` demuxer với danh sách file; các đoạn phải cùng codec/thông số.
