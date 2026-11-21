# Thiết kế âm thanh bốn lớp

```text
Giọng đã ráp → limiter look-ahead, gain LUFS tuyến tính, kiểm biên câu → stems/voice.wav
Nhạc gốc → cường độ theo cảnh, duck theo giọng → stems/music.wav
Cue SFX → đặt theo mẫu, giới hạn theo giọng → stems/sfx.wav
Cue impact → đặt theo mẫu, giới hạn theo giọng → stems/impact.wav
Cộng bốn stem → giới hạn peak mềm, đo lại → mix.wav + mix-report.json
```

Khai `sound_cues` trong từng cảnh storyboard. `t` tính từ đầu cảnh. Mảng rỗng giữ cảnh đó không có cue suy luận từ hình hoặc lời.

```json
{"sound_cues":[
  {"t":0.55,"intent":"ui_appear","target":"hộp quyền","intensity":"medium","duration_s":0.18,"reason":"Hộp quyền hiện ra"},
  {"t":1.60,"intent":"silence","intensity":"low","duration_s":0.80,"reason":"Giữ khoảng lặng sau hệ quả"}
]}
```

| Intent | Họ hiệu ứng | Lớp |
|---|---|---|
| ui_appear | ui_pop | sfx |
| transition | whoosh | sfx |
| alert | warning_tone | sfx |
| data_move | digital_sweep | sfx |
| highlight | accent | sfx |
| interaction | click | sfx |
| impact_hook | impact_hook | impact |
| impact_reveal | impact_reveal | impact |
| impact_risk | impact_risk | impact |
| silence | Khoảng lặng cần thời lượng | — |

Từ gốc repo, đặt `$ep` và `$voice` thành đường dẫn tập và WAV giọng đã ráp.

```powershell
python -X utf8 tools/audio/cuesheet.py build --ep $ep
python -X utf8 tools/audio/mix.py --ep $ep --voice $voice
python -X utf8 tools/audio/mix.py --ep $ep --voice $voice --music on
```

Cue sheet JSON và Markdown nằm trong `assets/`. Bảng JSON ghi nguồn, lý do, mốc giây, biến thể, khoảng lặng và cue bị loại. Có thể chuyển đầu ra sang thư mục tạm với `--out`, `--md`, `--cue-sheet` và `--out-dir`. Mixer lưu bốn WAV mono s16 48 kHz cùng số mẫu với bản trộn. Dùng stem giọng để QC biên câu và khoảng nghỉ. Producer tự mux MP4.

Storyboard khai cue được ưu tiên theo cảnh. Khi thiếu khai báo, pipeline lấy cue có đủ trọng số trong render log, sau đó dùng chuyển cảnh, gợi ý cũ nhận diện theo từ khoá hoặc sự kiện giọng. Khi thiếu timeline dựng, thời lượng storyboard chỉ cho mốc ước tính. Nguồn thiếu được ghi trong `warnings`. Giới hạn mật độ áp dụng theo cửa sổ trượt và theo tổng thời lượng, làm tròn xuống cho video ngắn. Cue cùng họ có khoảng cách tối thiểu và xoay vòng biến thể. Cue lọt vào lời có thể dời ngắn tới chỗ lặng. Mixer còn giới hạn theo RMS giọng thực đo trong từng khối. Khoảng lặng chủ đích chặn cue và hạ nhạc, vẫn giữ giọng.

Nhạc tắt mặc định. Hai mood cấu hình là `tech_explainer` và `security_tension`. Khi bật, seed mặc định là `video_id`. Cache lưu nhạc trước khi áp cường độ cảnh và ducking. Mixer đo LUFS tích hợp EBU R128 của stem giọng trong các khối có tiếng và của nhạc nền ngoài các khối đó, rồi đặt gain theo `layers.music.bed_rel_voice_db` (mặc định −20 LU so với giọng). Đường cong cường độ cảnh, phần tăng cho cảnh căng thẳng, fade và khoảng lặng giữ chênh lệch tương đối. `base_gain_db` là mốc để đọc `music.segments[].gain_db` trong cue sheet và trong lệnh tổng hợp nhạc độc lập. Mức nhạc của mixer do `bed_rel_voice_db` quyết định.

`mix-report.json` ghi `voice.window_lufs`, mức nhạc đích `music.bed_target_rel_voice_db` và chênh lệch LU thực đo trên PCM, ngoài lời (`bed_measured_rel_voice_db`) và trong lời (`in_voice_rel_voice_db`). Phép đo ngoài lời bao gồm phần chuyển tiếp của ducking. Kết quả thiếu tín hiệu đủ để đo trả về `null`. Khi thiếu giọng đo được, mixer dùng mục tiêu LUFS của stem giọng và ghi cảnh báo.

Báo cáo ducking lấy RMS trong và ngoài cửa sổ có tiếng, bao gồm ảnh hưởng của cường độ cảnh và fade. Chênh lệch này có thể khác độ sâu duck đặt trong cấu hình. Stem quá nhỏ để qua cổng EBU có thể trả về −70 LUFS. Mixer dùng bộ giới hạn look-ahead với bao gain liên tục và giữ nguyên chỉ số mẫu. `layers.voice.limiter` cấu hình trần sample peak, thời gian attack/release và mức giảm gain tối đa. Sau limiter, mixer đo loudness và đặt gain tuyến tính trong giới hạn sample peak và true peak của giọng. Nếu stem PCM lệch `target_tolerance_lu`, mixer ghi cảnh báo. Khi hụt mục tiêu, mixer giữ mức gain cao nhất được phép. `voice.limiter` ghi mức giảm gain lớn nhất, số mẫu có tín hiệu bị giảm, tỷ lệ trên thời lượng stem và crest factor (peak/RMS) trước và sau.

`audio-2026-11-20.2` thêm các ngưỡng limiter giọng và tách mục tiêu peak khỏi trần QC. `final.true_peak_dbtp` là trần công bố, còn mục tiêu mixer thấp hơn `final.true_peak_margin_db` (mặc định 0,3 dB). Mixer đo lại WAV PCM bằng metadata peak EBU R128 ở độ phân giải gốc và bằng `loudnorm` theo QC hiện hành. `true_peak_dbtp` và `qc_true_peak_dbtp` ghi từng phép đo. `true_peak_headroom_db` lấy trần trừ giá trị cao hơn trong hai phép đo. Khi headroom dưới nửa margin, mixer giảm gain rồi đo lại trong giới hạn `gain_passes`. Độ trong và méo cảm nhận sau limiter **CHƯA KIỂM — giám đốc nghe**.

```powershell
python -X utf8 tools/audio/sfx_synth.py --out $sfxDir
python -X utf8 tools/audio/music_synth.py --seed demo --mood tech_explainer --duration 12 --out $musicWav
```

Dùng `--cue-sheet` với lệnh sinh nhạc để áp đường cường độ. Tệp JSON cạnh WAV ghi seed và tham số. SFX và nhạc tổng hợp bằng mã trong repo, dành cho phạm vi công cộng CC0, không dùng mẫu bên thứ ba. Kết quả xác định trong cùng môi trường NumPy/SciPy. Âm thanh có chất âm tổng hợp. Độ tự nhiên, độ hợp cảm xúc và nghe có hay không đều **CHƯA KIỂM — giám đốc nghe**.
