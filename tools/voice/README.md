# Chuẩn hoá cách đọc trước khi sinh giọng

1. Tạo từ điển riêng tại `<thư mục video>/assets/voice/pronunciation.local.json` để Producer có thể cập nhật trong phạm vi thư mục video. Từ gốc dự án, đặt `$video` là đường dẫn thư mục video rồi khởi tạo tệp một lần.

   ```powershell
   $extra = Join-Path $video 'assets/voice/pronunciation.local.json'
   New-Item -ItemType Directory -Force -Path (Split-Path $extra) | Out-Null
   node tools/voice/pronounce.mjs init-extra --out $extra
   ```

   Có thể lặp `--term "<thuật ngữ>"` khi khởi tạo để tạo các mục khung. Tệp đã tồn tại chỉ bị ghi đè khi truyền `--force`.

2. Quét cột lời đọc. Kết quả JSON có `found` và `unknown`. Mã `1` báo còn ứng viên cần rà, mã `2` báo lỗi tệp hoặc tham số. Chỉ sinh audio khi `check` trả mã `0`.

   ```powershell
   node tools/voice/pronounce.mjs check --file "$video/script.md" --column "Lời đọc" --extra $extra
   ```

   Thêm thuật ngữ thiếu vào `entries` trong tệp riêng, điền `tts` bằng cách đọc đề xuất và giữ `verified:false`. Chọn `letters` để đọc từng chữ cái, `word` để đọc như một từ, hoặc `mixed` để kết hợp. Với ứng viên giả, thêm vào `ignore` của tệp riêng hoặc truyền `--ignore "a,b,c"` cho lần chạy đó. Chạy lại `check` sau khi chỉnh.

   Mục riêng thay toàn bộ mục chung khi trùng thuật ngữ hoặc bí danh. Chép vào mục riêng các bí danh chung vẫn cần dùng. `check`, `terms` và `list` ghi nguồn ở trường `source`.

3. Dùng `apply` để lấy từng dòng lời đọc, kể cả các dòng tách bằng `<br>` trong cùng một ô. Mỗi phần tử JSON có `row`, `label`, `text`, `tts`. Dùng `tts` để sinh audio từng câu theo tốc độ và khoảng nghỉ trong kịch bản. Giữ chính tả chuẩn trên hình và trong phụ đề.

   ```powershell
   node tools/voice/pronounce.mjs apply --file "$video/script.md" --column "Lời đọc" --extra $extra --json
   ```

4. Dùng `terms` để lấy mỗi thuật ngữ một lần. Sinh clip từ `tts` với giọng dùng trong video và lưu tại `assets/voice/term-check/<slug>.wav` cho giám đốc nghe. Giữ tệp âm thanh ngoài ngữ cảnh mô hình.

   ```powershell
   node tools/voice/pronounce.mjs terms --file "$video/script.md" --column "Lời đọc" --extra $extra
   ```

   Sau khi giám đốc nghe và xác nhận, giám đốc hoặc người có quyền sửa `tools/` có thể chuyển mục lên `tools/voice/pronunciation.json` và đặt `verified:true`. Trước xác nhận, giữ `verified:false`.

`--column` tìm theo một phần tên cột, bỏ qua kiểu chữ hoa/thường và định dạng Markdown. `--dict <tệp.json>` chọn từ điển chung khác.
