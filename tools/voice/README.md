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

   Thêm thuật ngữ thiếu vào `entries` trong tệp riêng, **giữ `tts` là chữ tiếng Anh gốc** (`init-extra` đã điền sẵn; không phiên âm kiểu Việt vì VieNeu tự đọc âm Anh từ chữ gốc) và giữ `verified:false`. Chọn `letters` để đọc từng chữ cái, `word` để đọc như một từ, hoặc `mixed` để kết hợp. Với ứng viên giả, thêm vào `ignore` của tệp riêng hoặc truyền `--ignore "a,b,c"` cho lần chạy đó. Chạy lại `check` sau khi chỉnh.

   Mục riêng thay toàn bộ mục chung khi trùng thuật ngữ hoặc bí danh. Chép vào mục riêng các bí danh chung vẫn cần dùng. `check`, `terms` và `list` ghi nguồn ở trường `source`.

3. Dùng `apply` để lấy từng dòng lời đọc, kể cả các dòng tách bằng `<br>` trong cùng một ô. Mỗi phần tử JSON có `row`, `label`, `text`, `tts`. Dùng `tts` để sinh audio từng câu theo tốc độ và khoảng nghỉ trong kịch bản. Giữ chính tả chuẩn trên hình và trong phụ đề.

   ```powershell
   node tools/voice/pronounce.mjs apply --file "$video/script.md" --column "Lời đọc" --extra $extra --json
   ```

   Lưu kết quả `apply --json` ra tệp rồi **kiểm âm vị** mà VieNeu thật sự nhận (`phonemes.py`, cần `pip install vieneu`). Từ tiếng Anh không được mang âm tiếng Việt và không được đổi cách đọc khi đứng trong câu (bộ G2P đọc chữ viết liền như UI, IDE, AI, HTTPS theo ngữ cảnh). Mã `0` đạt, mã `1` có mục lỗi, mã `2` thiếu VieNeu hoặc sai tham số.

   ```powershell
   node tools/voice/pronounce.mjs apply --file "$video/script.md" --column "Lời đọc" --extra $extra --json > "$video/assets/voice/apply.json"
   python tools/voice/phonemes.py --lines "$video/assets/voice/apply.json" --extra $extra
   python tools/voice/phonemes.py --check-dictionary --extra $extra
   python tools/voice/phonemes.py --text "Partition chia các dòng theo một cột."
   ```

   `vietnamese_reading`: `tts` đang bị đọc bằng âm Việt (thường do phiên âm kiểu Việt như “pa-ti-sần”), đổi về chữ tiếng Anh gốc. `context_changes_reading`: chữ đứng riêng và đứng trong câu ra hai cách đọc, dùng chữ đánh vần tiếng Anh (“you eye”, “eye dee ee”, “eigh eye”, “HTTP ess”, “you are ell”, “Postgress queue ell”). Công cụ chỉ kiểm âm vị, không thay việc nghe; mục `lang: "vi"` trong từ điển được bỏ qua.

4. Dùng `terms` để lấy mỗi thuật ngữ một lần. Sinh clip từ `tts` với giọng dùng trong video và lưu tại `assets/voice/term-check/<slug>.wav` cho giám đốc nghe. Giữ tệp âm thanh ngoài ngữ cảnh mô hình.

   ```powershell
   node tools/voice/pronounce.mjs terms --file "$video/script.md" --column "Lời đọc" --extra $extra
   ```

   Sau khi giám đốc nghe và xác nhận, giám đốc hoặc người có quyền sửa `tools/` có thể chuyển mục lên `tools/voice/pronunciation.json` và đặt `verified:true`. Trước xác nhận, giữ `verified:false`.

`--column` tìm theo một phần tên cột, bỏ qua kiểu chữ hoa/thường và định dạng Markdown. `--dict <tệp.json>` chọn từ điển chung khác.

## Lập kế hoạch giọng theo ngữ nghĩa

Các lệnh sau chạy từ gốc repo. Ví dụ dùng $ep là thư mục tập và $voice là thư mục đầu ra đã tạo. Spec JSON cần mảng lines và có thể ghi voice cho từng dòng. Dùng line_id dạng hai chữ số để ghép spec với kế hoạch khi số dòng trong kịch bản có thể nhảy.

~~~powershell
node tools/voice/pronounce.mjs check --file "$ep/script.md" --column "Lời đọc"
node tools/voice/prosody.mjs plan --script "$ep/script.md" --storyboard "$ep/storyboard.json" --out "$voice/prosody-plan.json"
node tools/voice/prosody.mjs explain --plan "$voice/prosody-plan.json" --line 05
python -X utf8 studio/renderer-remotion/scripts/gen_vo.py "$voice/spec.json" --plan "$voice/prosody-plan.json" --out "$voice"
node tools/voice/prosody.mjs timeline --plan "$voice/prosody-plan.json" --durations "$voice/generation.json" --mode free --out "$voice/voice-timeline.json"
python -X utf8 tools/voice/assemble.py --clips "$voice/generation.json" --timeline "$voice/voice-timeline.json" --out "$voice/voice-track.wav" --cues-out "$voice/cues.json" --scenes-out "$voice/voice-scenes.json"
python -X utf8 tools/voice/prosody_metrics.py --track "$voice/voice-track.wav" --timeline "$voice/voice-timeline.json" --plan "$voice/prosody-plan.json" --generation "$voice/generation.json" --scenes "$voice/voice-scenes.json" --out "$voice/metrics.json"
~~~

Nếu có từ điển phát âm riêng, thêm --extra khi chạy pronounce check. Khi lập kế hoạch từ Markdown, công cụ tự lấy assets/voice/pronunciation.local.json nếu có và gọi pronounce apply qua CLI. Có thể truyền spec JSON vào --script. Các trường tts hoặc text_tts có sẵn trong spec được dùng trực tiếp.

Mỗi cảnh có thể khai voice_direction theo line_id. Tệp assets/voice/prosody.local.json chứa mảng ghi đè cùng cấu trúc hoặc đối tượng có khóa voice_direction. Có thể chọn tệp khác bằng --local. Trường riêng thay trường chung tương ứng, kể cả khoảng nghỉ 0. Chuyển ý, ý định ở hai phía và độ nặng thông tin đều góp vào lý do nghỉ. Hai dòng cùng chia sẻ một khoảng lặng vật lý bằng giá trị lớn hơn của hai yêu cầu kề nhau. Khi ghép WAV, phần lặng đã có trong đệm được tính vào khoảng đó. Đệm R23 đặt giới hạn thấp nhất cho khoảng lặng vật lý.

Dùng --mode fit --scenes scenes.json để giữ cửa sổ cảnh. Có thể khai hold_after_voice_s cho từng cảnh. Khi thiếu chỗ, timeline thử co nghỉ trong giới hạn, sau đó tính tempo_ratio trong trần cấu hình. Nếu thiếu chỗ sau cả hai bước, overflow ghi error và assemble dừng. FFmpeg atempo có thể cho thời lượng thực lệch đôi chút so với tỷ lệ dự kiến. Assemble từ chối clip vượt dung sai, ghi đè cửa sổ hoặc vượt biên cảnh. Truyền --scenes scenes.json cùng --scenes-out nếu cần giữ trường gốc và cập nhật voice[]. Cues ghi mốc có tiếng, voice[] ghi cửa sổ có đệm. Có thể đưa thư mục có generation.json vào --clips. Thư mục WAV rời dùng tên như 02.wav và cue sẽ có chữ trống.

Để dựng lại dòng 02, cập nhật kế hoạch rồi chạy lại gen_vo với --only 02. Dòng đổi khóa sẽ tổng hợp lại, các dòng khác cần có clip khớp trong line-cache. generation.json ghi hit/miss, tempo, temperature, biên có tiếng và biên chunk. Cache tái dùng theo nội dung, giọng, temperature, tempo, chunk, cấu hình xử lý WAV và phiên bản engine. Spec cũ gọi gen_vo bằng đối số spec duy nhất tiếp tục đi qua chế độ cũ.

| Chỉ đạo | Cách thực hiện |
|---|---|
| Tốc độ | FFmpeg atempo sau tổng hợp, trong khoảng cấu hình 0,8–1,2 |
| Khoảng nghỉ | Chèn phần lặng còn thiếu giữa các clip, giữ đệm R23 |
| Nhấn | Xấp xỉ bằng tách cụm, nghỉ ngắn và tempo cục bộ nếu đủ ngữ cảnh |
| Ngữ điệu | Chỉ ghi nhận mục tiêu. Engine tự tạo đường ngữ điệu từ văn bản và dấu câu |
| Cảm xúc | Chỉ ghi nhận mục tiêu. Luật ý định chọn temperature, tempo và nghỉ. Thẻ cảm xúc chưa kiểm và mặc định bỏ qua |
| SSML, điều khiển cao độ | Không hỗ trợ |

Metrics dùng số token chữ/số làm xấp xỉ âm tiết, tự tương quan để ước lượng f0 và check_edges cho biên R23. Cần generation.json để đo RMS của chunk nhấn. Chunk đã chạy thêm atempo khi fit thiếu mốc chính xác sau biến đổi nên để trống phép đo này. Độ tự nhiên, phát âm và cảm xúc **CHƯA KIỂM — giám đốc nghe**.
