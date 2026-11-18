# Nhật ký Producer — IT-T3-E01

Ngày 18/11/2026 · IT · Đội 3 · team_id=4.

## Trạng thái

BLOCKED trước render. Chưa có thành phẩm, chưa tạo TTS, chưa chạy QC video/publish. Không chuyển sang review. `final/` hiện rỗng.

Đã đọc AGENTS.md, brief.md, concept.md, plan.md, script.md, storyboard.json, skill video-producer và các tài liệu tham chiếu ffmpeg-recipes.md, publish-schema.md, asset-sources.md, voice.md, mascot.md, platform-specs.md.

## Kiểm đầu vào và nguyên liệu

- Storyboard `APPROVED`; tám cảnh có thời lượng 3/6/5/4/6/4/4/7 giây, tổng 39 giây, mục tiêu 1170 frame ở 30 fps.
- Scene type: process_animation ở cảnh 1/2/5/7/8; data_visualization ở cảnh 3/4/6. Tất cả thuộc tập ưu tiên Remotion của AGENTS.md.
- Cả tám cảnh không có `component_props`.
- Đã mở bằng PIL và kiểm kích thước ảnh nguồn `brand/cao/poses/`: think 205×331, present_hand 249×325, point_up 222×326, shrug 246×313, point_right 279×338, clipboard 222×325, thumbs_up 209×326. Đủ ảnh để fit cao tối đa 300 px, không upscale.
- Font `C:/Windows/Fonts/segoeui.ttf` và `segoeuib.ttf` tồn tại.
- Nguyên liệu hình dự kiến: đồ hoạ tự tạo theo storyboard, bảy pose có sẵn; giọng Minh Đức cục bộ theo docs/voice.md. Không lấy tài nguyên Internet, không nhạc/SFX.

## Hướng 1 — chạy pipeline Remotion chính thức

Lệnh đã chạy từ gốc dự án:

```powershell
node studio/renderer-remotion/src/producer.mjs content/it/T3-archive-va-partition-trong-sql-la-gi/ep01/storyboard.json content/it/T3-archive-va-partition-trong-sql-la-gi/ep01/final
```

Exit code: **1**. Lỗi xảy ra ở preflight, chưa tới render/mux; không phát sinh log render từng cảnh. Không truyền --vo/--srt vì đây là kiểm đầu vào trước khi tạo nguyên liệu âm thanh.

Kết quả JSON nguyên văn:

```json
{
  "technical_pass": false,
  "preflight": {
    "schemaCheck": {
      "valid": true,
      "errors": []
    },
    "sceneIssues": {
      "1": ["canh \"1\" thieu durationInFrames hop le."],
      "2": ["canh \"2\" thieu durationInFrames hop le."],
      "3": ["canh \"3\" thieu durationInFrames hop le."],
      "4": ["canh \"4\" thieu durationInFrames hop le."],
      "5": ["canh \"5\" thieu durationInFrames hop le."],
      "6": ["canh \"6\" thieu durationInFrames hop le."],
      "7": ["canh \"7\" thieu durationInFrames hop le."],
      "8": ["canh \"8\" thieu durationInFrames hop le."]
    },
    "ok": false
  },
  "error": "Khong qua kiem tra truoc khi render (xem preflight)."
}
```

Ngoài ra Node báo cảnh báo MODULE_TYPELESS_PACKAGE_JSON; đây không phải nguyên nhân dừng. Không sửa package.json.

## Hướng 2 — đối chiếu API component và đường dựng khác trong giới hạn được giao

Đã đọc producer.mjs, orchestrator.mjs, ExplainerScene.jsx, DataVizScene.jsx và schema thật. Chỉ kiểm tra đọc, không gọi orchestrator trực tiếp để bỏ qua preflight.

- `producer.mjs:40,65,123`: đọc `scene.component_props`, bắt buộc `durationInFrames > 0`, rồi chỉ chuyển component_props cho Remotion. Không có bộ dịch mô tả environment/props/animation_timeline thành các lớp hình.
- `ExplainerScene.jsx:18`: process_animation chỉ nhận steps/stepInterval/startFrame/pose/pointFrames/shots. Bố cục khối rộng 280 px ở y=860; Cáo cao 520 px ở y=1020. Không có API lưới tháng 4×3, hai khung tách rời, thẻ T1–T3 dịch chuyển giữ mã, replay cut, HUD tách camera, Cáo ≤300 px ở góc như bản duyệt.
- `DataVizScene.jsx:18`: data_visualization chỉ nhận title/bars/startFrame/barInterval/caption/shots, vẽ biểu đồ thanh và số tăng dần, không có Cáo. Cảnh 3/4/6 cần sơ đồ 12 phần, T11 nổi bật/cả 12 sáng đồng thời và kết quả 9/3; đổi sang biểu đồ thanh sẽ sai ý nghĩa hình.
- `orchestrator.mjs`: wiperight ghép xfade toàn cảnh chồng 0,4 giây, trong khi storyboard cảnh 5 chỉ wipe lớp viền hộp bên phải, không chồng thời lượng. Với mốc mặc định, đường ghép này sẽ lệch mục tiêu 39 giây.
- `producer.mjs:170`: phụ đề SRT có style cố định MarginV=100, khác yêu cầu ASS PlayRes 1080×1920, font 52 px và vùng y=1000–1140 của tập này.

Vì vậy chỉ thêm durationInFrames (90/180/150/120/180/120/120/210) chưa đủ dựng đúng. Không tự thêm props vào storyboard, đổi scene_type, viết JSX hay sửa studio/ để vượt kiểm tra. Fallback Pillow+FFmpeg hiện chỉ được tự chọn khi có scene_type ngoài tập hỗ trợ; video này không thuộc điều kiện đó, nên cần quyết định qua escalate.

## Phương án gỡ vướng cụ thể gửi Claude/Visual Director

Ưu tiên xác nhận ngoại lệ dùng Pillow+FFmpeg đúng visual_style_note đã duyệt: vẽ từng lớp lưới/thẻ/nhãn bằng Pillow, dựng chuyển động theo frame hoặc overlay eval=frame, camera chỉ biến đổi sơ đồ, chữ/Cáo giữ cỡ; giữ đủ tám cảnh, 39 giây, 1170 frame; T11 và trạng thái đồng sáng đúng; Archive chuyển chính T1–T3 và replay bằng cut; dùng ASS đúng vị trí. Không mất nội dung minh hoạ, không thay bằng thẻ chữ tĩnh, không cần sửa storyboard hay studio/.

Nếu bắt buộc Remotion: cần người phụ trách renderer bổ sung component sơ đồ phù hợp, hỗ trợ chuyển cảnh nội bộ và bố cục phụ đề riêng; Visual Director cung cấp component_props tương ứng sau đó. Không chỉ thêm thời lượng vào bản hiện tại rồi coi là sửa xong.

## QC

Chưa có MP4 để ffprobe/qc-video; chưa có publish.json để qc-publish. Không có kết luận đạt kỹ thuật, thị giác hoặc âm thanh.

---

## Hướng dẫn từ Claude (gỡ vướng 18/11/2026, rescue IT-T3-E01)

### Chẩn đoán gốc rễ
Lỗi `thiếu durationInFrames` chỉ là triệu chứng. Gốc: `storyboard.json` (đã `APPROVED`) được thiết kế để dựng bằng sơ đồ tự vẽ + FFmpeg (`visual_style_note`: "Pillow/SVG và các lớp ffmpeg"; `storyboard.md` cuối: "đường dựng thay thế khả thi là các lớp sơ đồ tự vẽ và ffmpeg"), còn `scene_type` `process_animation`/`data_visualization` lại rơi vào tập "ưu tiên Remotion" của AGENTS.md. Tôi đã đọc `producer.mjs`, `ExplainerScene.jsx`, `DataVizScene.jsx` và xác nhận đúng như Codex báo: hai component không có lưới T1–T12, thẻ trượt, hộp Lưu trữ, bộ đếm, replay cut; `DataVizScene` chỉ vẽ thanh ngang có số tăng dần (sai nghĩa nếu ép vào cảnh 3/4/6); orchestrator ghép `xfade` toàn cảnh (-0,4 s mỗi lần, lệch 39 s) trái với storyboard.

### Quyết định
**CHO PHÉP đường Pillow + FFmpeg cho riêng IT-T3-E01.** Căn cứ: AGENTS.md "Chọn renderer" điểm 2 và đoạn về `scene_type` ở mục "Bạn nhận gì" (cảnh không dựng được đúng bằng công cụ hiện có thì escalate kèm phương án thay thế cụ thể; ở đây phương án đó chính là điều Codex đã đề xuất và Claude xác nhận): mục đích điều khoản là không hạ chuẩn minh hoạ; ở đây Remotion mới là đường làm mất ý nghĩa (biểu đồ thanh thay cho lưới 12 phần), còn Pillow+FFmpeg dựng đúng 100% visual đã duyệt. Không vi phạm điểm 3 (không viết JSX, không sửa storyboard, không sửa `studio/`, không gọi `producer.mjs`/`orchestrator.mjs` để lách preflight; chỉ không dùng chúng). Không cần sửa `studio/` hay quyết định của giám đốc. Lời nhắc cho giám đốc/thư ký: AGENTS.md điểm 2 chưa ghi trường hợp "component có sẵn nhưng không dựng được visual"; nên bổ sung một câu (Claude rescue không được sửa AGENTS.md).

### Việc Codex làm lại (theo thứ tự). KHÔNG chạy `producer.mjs`, KHÔNG thêm `component_props`, KHÔNG sửa `storyboard.json`/`studio/`.
`report_status(working)` ở mỗi bước lớn. Mọi file trung gian (script Python, khung PNG, wav thô, clip câm) vào `assets/_scratch/`; giọng đã xử lý vào `assets/voice/`; `final/` chỉ 4 thứ.

**B1. Giọng đọc (làm trước, vì phụ đề và chip canh theo giọng thật).**
- VieNeu-TTS **đã cài** ở Python 3.12 (`from vieneu import Vieneu`; kiểm bằng `python -c "import vieneu"`). Không cài thêm gì, không tải gói ngoài; nếu import lỗi thì `escalate` kèm lỗi nguyên văn.
- Giọng **Minh Đức** (nam Bắc), `temperature=0.65` (tên tham số: xem `help(Vieneu.infer)`; `tools/voice/vieneu_samples.py` chưa có cờ này, tự viết script nhỏ trong `assets/_scratch/`), hậu kỳ `atempo=1.08`. Mỗi **câu** một file wav riêng (17 câu: cảnh 1=1, cảnh 2=3, cảnh 3=3, cảnh 4=1, cảnh 5=2, cảnh 6=2, cảnh 7=2, cảnh 8=3; tách theo dấu xuống dòng của `voice_over`). Dùng cách đọc ở bảng "Chỉ dẫn đọc" của `script.md`: SQL → "ét kiu eo"; Partition thử "pa-ti-sần" trước; Archive thử "ác-kaiv" trước; số viết bằng chữ ("tháng mười một"). Văn bản đưa cho TTS là bản phiên âm; chữ trên hình/phụ đề giữ chính tả chuẩn.
- Đo từng câu bằng ffprobe, ghi bảng thời lượng vào notes. Ghép thành `assets/voice/vo_39s.wav` (48 kHz, stereo hoặc mono rồi `-ac 2`) đúng 39,00 s: mỗi cảnh bắt đầu tại mốc **0/3/9/14/18/24/28/32** (cảnh 1 vào ngay giây 0), câu đặt nối tiếp với khoảng nghỉ 0,15–0,3 s, câu đầu của nhóm chip mới nên bắt đầu sát mốc nội bộ (5,8 / 20,5 / 26 / 30 / 33 / 35 / 37 giây) nhất có thể, phần còn lại của cảnh là im lặng. Mốc tám cảnh KHÔNG đổi.
- Không vừa thì chỉ dùng đúng dự phòng trong `script.md`: hook > 2,2 s → thay lời/phụ đề hook bằng "Bảng lớn: chia hay chuyển?" (chữ lớn trên hình giữ đủ câu); lời cảnh 2 > 5,8 s → dời mốc 9 sang tối đa 10 (kéo theo đổi dáng point_up, chip/T11 cảnh 3). Vẫn không vừa → `escalate` về review kịch bản, không cắt lời, không tăng tốc thêm.
- Các agent không nghe được âm thanh: ghi vào notes biến thể phát âm đã dùng, tạo thêm biến thể dự phòng (Partition "pờ-ti-sần"; Archive "a-kaiv"; hoặc viết nguyên Latin) vào `assets/_scratch/`, và ghi rõ **"cách đọc thuật ngữ chưa được người nghe kiểm — chờ giám đốc nghe"**. Không viết "đã nghe kiểm". Không cài công cụ nhận dạng tiếng nói.

**B2. Vẽ khung hình bằng Pillow, một script thuần theo thời gian** (`assets/_scratch/render_ep01.py`): hàm `draw_frame(i)` với `t=i/30` (i=0..1169, đúng 1170 khung), xuất raw RGB qua ống vào `ffmpeg -f rawvideo -pix_fmt rgb24 -s 1080x1920 -r 30 -i - ...` (hoặc PNG sequence trong `_scratch`; không dùng `zoompan`/`xfade`). Mọi số liệu lấy từ `storyboard.json` (nguồn sự thật, chi tiết toạ độ nằm đó); các điểm bắt buộc:
- Nền #101827; khung #94A3B8; chữ #F8FAFC; Partition #38BDF8; Archive #FBBF24; ô mờ #64748B; chữ mã ô trên nền vàng/xanh sáng dùng #101827, trên #64748B/navy dùng #F8FAFC. Font `C:/Windows/Fonts/segoeuib.ttf` (hook Bold 64, thuật ngữ 60 — dùng Bold cho cả chip 60 nếu đọc rõ hơn) và `segoeui.ttf` (nhãn/mã 48, phụ đề 52, "Có dùng AI" 40). Đo bbox chữ bằng PIL (`textbbox`) để căn theo dấu, không để dấu tiếng Việt bị cắt trong hàng nhãn.
- **Lớp sơ đồ** (bảng, khung, hộp, đường chia, thẻ T1–T12 128×80 bo góc 12, mũi tên, replay) vẽ ở 2× rồi thu về để mép mịn; **camera = scale/crop chỉ lớp sơ đồ** (cảnh 2–3: 1.04→1.08 bù x về mép trái 100; cảnh 5, 7: ≤1.02 neo (540,920)/(540,960)). **Chữ (mã ô, nhãn, chip, hook, phụ đề), Cáo, "SQL", "Minh hoạ", "Có dùng AI" vẽ SAU camera ở đúng cỡ gốc, mã ô căn ở tâm ô đã biến đổi, luôn 48 px.** Thẻ T1–T3 là cùng một thẻ trượt (không bản sao tại gốc); cảnh 8 reset bằng CUT toàn lớp sơ đồ, tuyệt đối không tween ngược hay crossfade.
- **Cáo**: cut ảnh tĩnh tại 0/3/9/14/18/28/32 theo thứ tự `think`, `present_hand`, `point_up`, `shrug`, `point_right` (giữ qua 24), `clipboard`, `thumbs_up`; mỗi ảnh fit cao ≤ 300 px trong x=90..360, y=1190..1490 (ảnh nguồn cao 313–338 px nên chỉ thu nhỏ, không phóng), nền trong suốt, LANCZOS. Không nhép miệng, không `narrate.mjs` (bước này không cần lớp .mov).
- **Chuyển cảnh = đổi lớp trong đúng khoảng của cảnh**, không chồng hai clip: cảnh 4→5 `wiperight` chỉ mở lớp viền hộp Lưu trữ (cục bộ 0.1–0.6 s), bảng chính không bị wipe; `match_cut` và `cut` đổi trạng thái tại đúng khung mốc. Tổng 1170 khung, không `xfade`.
- **Phụ đề**: chữ nguyên lời `voice_over`, tối đa 2 dòng ≤ ~32 ký tự/dòng, 52 px, ngắt theo câu/nhóm nghĩa, nền tối mờ x=100..980, y=1000..1140, căn giữa. Được vẽ bằng Pillow trong chính khung (kiểm soát từng pixel, tương đương kết quả mà storyboard mô tả bằng ASS PlayRes 1080×1920; nếu muốn dùng ASS thì chỉ khi đo lại bằng khung thật). Cue = từ đầu câu đến hết câu (+≤0,3 s), không tràn sang cảnh sau. Xuất `final/captions.srt` (UTF-8) cùng số cue/mốc đó.
- Chip/nhóm chữ đổi tại thời điểm câu tương ứng bắt đầu nói (mặc định storyboard: 5.8 / 20.5 / 26 / 30 / 33 / 35 / 37 s); không hiện hai nhóm chip chồng nhau; tối đa ba chip ở cảnh 6–8 (hai bộ đếm + một chip).

**B3. Khung thử bắt buộc trước khi mux** (trích PNG bằng chính script, **mở xem thật**): 0.0, 3.1, 9.5, 11.5, 14.2, 18.3, 21.5, 24.7, 28.5, 31.0, 32.1, 32.5, 35.5, 38.9 giây (theo `review/storyboard-r1.md`). Kiểm riêng: thẻ vàng đọc được mã, hàng nhãn/đếm không cắt dấu, đầu mũi tên cảnh 1 không chạm chữ ("Chuyển / dữ liệu cũ" mép trái ≥775, phải ≤990), thẻ trượt qua khe 690–730 không nhân đôi, 12 ô cảnh 4 đồng sáng, T11 duy nhất sáng ở 11.5, đáy sơ đồ ≤960 và cách phụ đề ≥40 px, không chữ dưới y=1500 ngoài "Có dùng AI" (x=730..980, y=1460..1500), Cáo không chạm phụ đề.

**B4. Mux và xuất.** Từ ống khung: libx264 `-crf 20 -preset medium -pix_fmt yuv420p -r 30`, ghép `vo_39s.wav` với `-af "loudnorm=I=-14:TP=-1.5:LRA=11,apad=whole_dur=39"`, `-ar 48000 -ac 2 -c:a aac -b:a 160k -t 39 -movflags +faststart` → `final/IT-T3-E01_9x16.mp4`. Kiểm bằng `ffprobe -count_frames`: đúng 1170 khung, 39,00 s ±1 khung, 1080×1920, 30 fps cố định. `final/thumbnail.jpg`: lấy khung sơ đồ đẹp (vd 38.9 s hoặc 21.5 s) cộng chữ "Archive và Partition" / "Chia hay chuyển?" trong vùng an toàn (x=90..990, y=250..1500, đủ dấu). Nếu thumbnail dùng khung có hook thì không để chữ chồng chữ.

**B5. `publish.json`.** Chép **nguyên văn** từ `script.md` mục "Nội dung đăng": tiêu đề, mô tả, hashtag của TikTok/Facebook Reels/YouTube Shorts; `ai_generated_content: true`; `ai_disclosure` = "Video có dùng hình ảnh và giọng đọc do AI tạo."; mô tả cả ba nền tảng kết thúc bằng câu đó (hashtag nếu ghép vào mô tả thì đặt TRƯỚC câu khai báo); schema ở `.agents/skills/video-producer/references/publish-schema.md`. Chạy `node tools/qc-publish.mjs content/it/T3-archive-va-partition-trong-sql-la-gi/ep01/final/publish.json` — phải pass.

**B6. QC và dọn.** `node tools/qc-video.mjs content/it/T3-archive-va-partition-trong-sql-la-gi/ep01/final/IT-T3-E01_9x16.mp4 --min 38 --max 40`: dán kết quả thật vào notes (đo loudness −14±1 LUFS, true peak ≤ −1,5 dBTP). Rà tiêu chí 1–9 của `plan.md` từng mục; mục nào chưa đo thì nói chưa đo. `final/` chỉ gồm `IT-T3-E01_9x16.mp4`, `thumbnail.jpg`, `captions.srt`, `publish.json`. Hình do mình vẽ và pose Cáo không cần dòng trong `library/LICENSES.md`; không tải gì từ Internet, không nhạc/SFX.
Xong: ghi vào notes mốc thực dùng (nếu dùng dự phòng hook/cảnh 2), bảng thời lượng giọng, đường dựng đã dùng ("Pillow+FFmpeg theo xác nhận của Claude"); `set_video_stage(IT-T3-E01, "review")`; `report_status(idle)`; dòng cuối `DONE`.

### Khi nào escalate lại (đừng tự xoay xở)
Chỉ khi: (a) `import vieneu` lỗi hoặc TTS không dùng được; (b) lời không vừa cả sau dự phòng hợp lệ trong `script.md`; (c) có cảnh mà Pillow vẫn không thể hiện đúng storyboard (nêu cảnh nào, thiếu gì, đề xuất cụ thể); (d) thiếu nguyên liệu. Không hạ cảnh nào thành thẻ chữ tĩnh.

### Việc của người điều phối
Chạy lại sản xuất: `/produce IT-T3-E01 --force` (hoặc để hàng đợi tự xếp việc produce sau khi cờ vướng được gỡ). Lưu ý: nếu việc produce mới là lần chạy đầu của job mới, prompt có thể không nhắc đọc notes.md; vì thế đã ghi cùng chỉ dẫn vào đầu `plan.md` và `script.md` (hai file Codex được yêu cầu đọc trước).


---

## Sản xuất hoàn tất — 18/11/2026 — IT-T3-E01

Đường dựng: **Pillow+FFmpeg theo xác nhận của Claude**, phần “ĐƯỜNG DỰNG ĐÃ CHỐT” trong plan.md và “Hướng dẫn từ Claude” ở trên. Không chạy lại Remotion; không sửa storyboard, studio, kế hoạch hay kịch bản. Mọi script và trung gian nằm trong assets/_scratch; giọng sử dụng thật nằm trong assets/voice. Không tải hình, clip, nhạc hay mô hình mới từ Internet; VieNeu chạy với HF_HUB_OFFLINE=1 và TRANSFORMERS_OFFLINE=1 trên các mô hình đã có.

### Nguồn nguyên liệu

- Nền, khung, lưới 4×3, thẻ 128×80, mũi tên, biểu tượng replay, chip và chữ: tự tạo bằng Pillow trong `assets/_scratch/render_ep01.py`, bám storyboard APPROVED; hình học sơ đồ vẽ 2× và thu về, chữ vẽ sau camera đúng cỡ. Không cần thêm giấy phép vào thư viện cho đồ hoạ tự tạo này theo hướng dẫn rescue.
- Bảy pose: `brand/cao/poses/think.png`, `present_hand.png`, `point_up.png`, `shrug.png`, `point_right.png`, `clipboard.png`, `thumbs_up.png`. Chỉ thu nhỏ tới cao 300 px, không upscale, giữ nguyên ảnh nguồn. Fit trong x=90..360, y=1190..1490; cách đáy 430 px.
- Font Windows có sẵn: Segoe UI / Segoe UI Bold. Hook 64 px, thuật ngữ 60 px, nhãn/mã 48 px, phụ đề 52 px, nhãn AI 40 px.
- Giọng: VieNeu-TTS v3 Turbo, ONNX CPU fp32, Minh Đức; `temperature=0.65`, từng câu riêng; bỏ im lặng dư ở hai đầu, `atempo=1.08` đúng chỉ dẫn. Không nhạc, không SFX. `assets/voice/vo_39s.wav` dài 39,000 giây, 48 kHz.

### Mốc dựng và giọng thực dùng

- Hook đầu tiên sau hậu kỳ dài 2,093 giây, thuộc khoảng 2–2,2 giây. Tạo lại nhịp ngắt bằng dấu phẩy trong bản TTS, giữ nguyên toàn bộ từ: bản chọn dài **1,8513 giây**, vào ngay giây 0. Không kích hoạt lời hook rút gọn; chữ hook và SRT giữ đúng câu đầy đủ.
- Tổng lời cảnh 2 là **6,2204 giây**, vượt 5,8 giây. Dùng đúng dự phòng đã duyệt: mốc cảnh 2→3 và đổi pose point_up dời từ 9 sang **9,700 giây**. Cảnh 3 còn **4,300 giây**, lời kết thúc tại **13,943 giây**, không cắt từ hay tăng tốc thêm.
- Tám cảnh: **0 / 3 / 9,7 / 14 / 18 / 24 / 28 / 32 / 39**. Tổng **1170 frame**, 30 fps. Sáu lần đổi pose: **3 / 9,7 / 14 / 18 / 28 / 32**; giữ point_right qua giây 24; Cáo hiện 39/39 giây, không nhép miệng.
- Chip khái niệm canh đầu câu thực: “Vẫn đủ” tại 7,272; điều kiện cột chia tại 11,072; “Cũ, ít dùng” tại 20,650; “Tuỳ hệ thống” tại 26; “Không phải” tại 30; “Dùng chung được” tại 33,950; “Lưu trữ tháng cũ” và “Vẫn giữ lại” tại 35,200. Kết giữ cả hai chip như storyboard cảnh 8 yêu cầu; bộ đếm là nhãn của sơ đồ.
- 17 cue SRT, tối đa hai dòng, mỗi dòng ≤32 ký tự, ngắt theo nghĩa; đốt cứng cùng mốc bằng Pillow, không dùng sai hệ đơn vị libass. Cue ngắn “Vẫn giữ lại.” giữ thêm 0,3 giây, tổng khoảng 0,986 giây; không thêm im lặng vào giọng. Mọi cue không tràn qua cảnh sau. Kết lời cuối tại 37,153 giây, giữ hình hơn 1,8 giây đến hết.

| Câu | Bắt đầu (s) | Độ dài sau 1.08 (s) | Hết lời (s) | Văn bản TTS |
|---|---:|---:|---:|---|
| s1_1 | 0.000 | 1.8513 | 1.851 | Bảng lớn, chia ra hay chuyển bớt? |
| s2_1 | 3.000 | 2.5273 | 5.527 | Chia ra gọi là pa-ti-sần, tức phân vùng. |
| s2_2 | 5.677 | 1.4448 | 7.122 | Là chia bảng thành nhiều phần. |
| s2_3 | 7.272 | 2.2484 | 9.520 | Vẫn chung một tên bảng, dữ liệu vẫn đủ. |
| s3_1 | 9.700 | 1.2216 | 10.922 | Sếp cần tháng mười một? |
| s3_2 | 11.072 | 1.0540 | 12.126 | Lọc đúng cột chia. |
| s3_3 | 12.276 | 1.6666 | 13.943 | Máy có thể bỏ qua phần khác. |
| s4_1 | 14.000 | 2.5247 | 16.525 | Lọc cột khác, có thể vẫn đọc nhiều phần. |
| s5_1 | 18.000 | 2.4825 | 20.483 | Chuyển bớt gọi là ác-kaiv, tức lưu trữ. |
| s5_2 | 20.650 | 2.2480 | 22.898 | Dữ liệu cũ, ít dùng sang nơi riêng. |
| s6_1 | 24.000 | 0.6861 | 24.686 | Vẫn giữ lại. |
| s6_2 | 26.000 | 1.1025 | 27.102 | Nơi lưu tuỳ hệ thống. |
| s7_1 | 28.000 | 1.5961 | 29.596 | ác-kaiv là cách quản lý. |
| s7_2 | 30.000 | 1.6543 | 31.654 | Không phải lệnh ét kiu eo chuẩn. |
| s8_1 | 32.000 | 1.7866 | 33.787 | Mình chốt: hai việc khác nhau. |
| s8_2 | 33.950 | 1.0922 | 35.042 | Bạn có thể dùng chung. |
| s8_3 | 35.200 | 1.9532 | 37.153 | Chia theo tháng, lưu trữ tháng cũ. |

**Giới hạn nghe kiểm:** phiên agent này không nghe được âm thanh; **cách đọc thuật ngữ chưa được người nghe kiểm — chờ giám đốc nghe**. Bản chính dùng Partition = “pa-ti-sần”, Archive = “ác-kaiv”, SQL = “ét kiu eo”. Hai biến thể dự phòng “pờ-ti-sần” và “a-kaiv” đã tạo trong `assets/_scratch/voice_raw/partition_alt.wav`, `archive_alt.wav`. Không khẳng định đã nghe toàn bộ hay đã duyệt phát âm. Các số đo thời lượng/âm lượng là kiểm tra thật bằng công cụ, không thay cho đánh giá bằng tai.

### Dựng và QC thị giác

Các khung thử được mở xem thật: 0 / 0,5 / 3,1 / 9,5 / 11,5 / 14,2 / 18,3 / 21,5 / 24,7 / 28,5 / 31 / 32,1 / 32,5 / 35,5 / 38,9 giây; thêm các khung đầu/giữa cảnh theo mốc đã dời. Sau mã hoá, trích 18 khung trong `assets/_scratch/encoded_qc/` và mở ba contact sheet kiểm toàn bộ tám cảnh.

- Hook và SQL hiện từ frame đầu; tiếng Việt đủ dấu, không cắt dấu/nhãn; caption tách khỏi Cáo và sơ đồ; nhãn AI cố định trong vùng quy định. Thumbnail đã mở xem, có đúng “Archive và Partition” / “Chia hay chuyển?”.
- Partition giữ đủ 12 mã trong một khung; T11 duy nhất sáng ở ví dụ lọc đúng cột, 11 ô mờ vẫn có mã; cảnh 4 cả 12 ô cùng sáng từ đầu cảnh.
- Archive chỉ chuyển T1–T3, không để bản sao ở gốc. Thẻ đang trượt nằm phía trước và che lớp dưới, mã thẻ đang trượt đọc rõ; thẻ khác chỉ có thể bị che thoáng qua khi đi ngang. Kết chính 9 / lưu 3, không nén lại thành chín vị trí khác.
- Cảnh 5 chỉ wipe lớp viền hộp bên phải. Cảnh 6 hạ sơ đồ 40 px, đáy không vượt 960. Cảnh 7 mũi tên quản lý trong khe hai khung, không terminal/lệnh giả. Camera chỉ biến đổi hình sơ đồ, giữ chữ và Cáo nguyên cỡ.
- Replay: giữ kết quả cũ 0,2 giây kèm cung replay, CUT về đủ 12 ô và hộp rỗng; không bay ngược/crossfade; sau đó chia và chuyển lại chính T1–T3, không chuyển ô thứ tư. Giữ kết 9/3 và hai nhãn kết đến frame cuối, không fade đen.

### QC thật trên MP4 cuối

Lệnh xuất hình: `python -X utf8 assets/_scratch/render_ep01.py --render` từ script theo đường đầy đủ; libx264 CRF 20, preset medium, yuv420p, 30 fps, GOP 60. Mux video copy với `loudnorm=I=-14:TP=-1.5:LRA=11,apad=whole_dur=39`, AAC stereo 48 kHz, 39 giây, faststart.

Bản AAC yêu cầu 160k ban đầu cho bitrate đo được 122.953 bps, thấp hơn mức 128k trong plan (dù qc-video cơ bản pass). Đã tăng chỉ bitrate đích lên **192k**, đo MP4 cuối được **147.138 bps**, đạt ≥128k; không đổi nội dung/nhịp đọc/hình.

`node tools/qc-video.mjs <final/IT-T3-E01_9x16.mp4> --min 38 --max 40`:

```json
{
  "file": "D:\\Agent Video Studio\\content\\it\\T3-archive-va-partition-trong-sql-la-gi\\ep01\\final\\IT-T3-E01_9x16.mp4",
  "pass": true,
  "info": {
    "duration_s": 39,
    "size_mb": 2.3,
    "video": "h264 1080x1920 yuv420p",
    "audio": "aac 48000Hz",
    "fps": 30,
    "mean_volume_db": -17.4,
    "max_volume_db": -4.4
  },
  "fails": [],
  "warns": []
}
```

Kiểm mở rộng `ffprobe -count_frames`, thứ tự atom MP4 và đo loudnorm trên chính MP4:

```json
{
  "checks": {
    "1170_frames": true,
    "39_seconds": true,
    "1080x1920": true,
    "30fps_cfr": true,
    "h264_yuv420p": true,
    "aac_stereo_48k_128kbps": true,
    "faststart": true,
    "loudness_minus14_plusminus1": true,
    "true_peak_le_minus1_5": true,
    "all_approved_words": true,
    "captions_2lines_32chars": true,
    "captions_fit_scenes": true
  },
  "loudness_lufs": -14.23,
  "true_peak_dbtp": -4.4,
  "audio_bitrate": 147138,
  "frame_count": 1170,
  "mp4_atoms": [
    "ftyp",
    "moov",
    "free",
    "mdat"
  ],
  "pass": true
}
```

True peak **−4,40 dBTP** ≤−1,5; loudness **−14,23 LUFS** trong −14±1; không clip theo phép đo. Video đúng 1080×1920, H.264 yuv420p, 30 fps CFR, 1170 frame, 39,000 giây. Atom `moov` đứng trước `mdat`, xác nhận faststart. Không có kết luận nghe chủ quan.

Metadata chép nguyên văn tiêu đề/mô tả/hashtag từ script cho cả ba nền tảng; 3–5 hashtag/nền tảng, câu disclosure ở cuối, `ai_generated_content=true`. `node tools/qc-publish.mjs <final/publish.json>`:

```json
{
  "file": "D:\\Agent Video Studio\\content\\it\\T3-archive-va-partition-trong-sql-la-gi\\ep01\\final\\publish.json",
  "pass": true,
  "fails": [],
  "warns": []
}
```

### Thành phẩm bàn giao

- `final/captions.srt` — 1,299 byte
- `final/IT-T3-E01_9x16.mp4` — 2,384,006 byte
- `final/publish.json` — 4,294 byte
- `final/thumbnail.jpg` — 245,937 byte

`final/` đã kiểm chỉ đúng bốn file trên; không chứa bản nháp/log/cảnh lẻ. Gửi **review** để giám đốc xem và nghe, không tự duyệt phát hành.

---

## QC — lần 1 (Claude, chế độ QC, 18/11/2026) — PASS kỹ thuật + thị giác; phát âm CHƯA được người nghe kiểm

Số lần sản xuất của video: **2** (job 10 dừng trước render vì lỗi đường dựng, job 12 giao hàng; kèm 1 lần rescue job 11), giới hạn tối đa 9. Đây là **QC lần 1** (job 13). Mọi số dưới đây do QC tự đo lại trên chính `final/IT-T3-E01_9x16.mp4`, không chép từ phần Producer ở trên.

### Số đo độc lập
- `node tools/qc-video.mjs ... --min 38 --max 40` → `pass: true`, `fails: []`, `warns: []`; duration 39 s, 2,3 MB, h264 1080x1920 yuv420p, aac 48000 Hz, fps 30, mean −17,4 dB, max −4,4 dB.
- `ffprobe -count_frames`: video h264 High, 1080x1920, yuv420p, r_frame_rate = avg_frame_rate = 30/1 (CFR), **nb_read_frames = 1170**, duration 39,000000 s; audio AAC-LC stereo 48 kHz, 147.138 bps (≥128 kbps), 39,000 s; file 2.384.006 byte (≤250 MB).
- Loudness MP4 (ffmpeg loudnorm, chỉ đo): **I = −14,2 LUFS**, **true peak = −4,4 dBTP**, LRA 3,2 LU; astats: peak −4,41 dB, flat factor 0 (không clip). Đạt mục tiêu −14±1 LUFS và ≤ −1,5 dBTP.
- Giọng nguồn `assets/voice/vo_39s.wav`: pcm_s24le, mono, 48 kHz, 39,000 s; ebur128 −20,4 LUFS / peak −5,2 dBFS (đo ở dạng mono nên thấp hơn ~3 LU so với bản stereo, không phải lỗi). MP4 giữ đủ 39,000 s, khớp wav.
- Nhịp giọng đo từ âm thanh của MP4 (silencedetect −38 dB, ≥0,12 s): hook im tại 1,835 s (hook ≈1,84 s, <2 s); cảnh 2 vào lại 3,02 s; các đầu câu đo được 5,688 / 7,284 / 9,726 / 11,084 / 12,288 / 18,015 / 20,665 / 24,013 / 26,012 / 28,012 / 30,021 / 32,010 / 33,962 / 35,297 s so với mốc cue SRT 5,677 / 7,272 / 9,700 / 11,072 / 12,276 / 18,000 / 20,650 / 24,000 / 26,000 / 28,000 / 30,000 / 32,000 / 33,950 / 35,200 s: lệch lớn nhất ~0,10 s (≤0,15 s). Lời cuối dứt ~37,12 s, giữ hình ~1,88 s đến hết. Khoảng lặng giữa các câu trong cảnh 0,13–0,47 s.
- `final/` (Glob) đúng 4 file: `IT-T3-E01_9x16.mp4`, `captions.srt`, `publish.json`, `thumbnail.jpg`. Thumbnail 1080x1920 (mjpeg).
- **`qc-publish`: QC KHÔNG chạy được công cụ** (lệnh bị chặn quyền trong phiên nền, không có người duyệt). Thay bằng đối chiếu tay từng điều kiện trong mã `tools/qc-publish.mjs`: ai_generated_content=true; ai_disclosure có nội dung; tiktok.caption, facebook_reels.description, youtube_shorts.description đều chứa nguyên câu khai báo (nằm cuối mô tả); tiêu đề YouTube 55 ký tự (≤100); hashtag đều khớp `^#\S+$`, số lượng 4/4/5 (≤5); `sources` có 8 mục; `qc.pass=true`. Kết quả tay: đạt. Kết quả Producer tự ghi (`assets/_scratch/qc-publish.json`): pass. Người điều phối nên chạy một lần `node tools/qc-publish.mjs content/it/T3-archive-va-partition-trong-sql-la-gi/ep01/final/publish.json` để có kết quả chạy thật. Nội dung publish.json khớp nguyên văn mục "Nội dung đăng" của `script.md` (tiêu đề, mô tả, hashtag cả 3 nền tảng).

### Khung đã trích từ MP4 cuối và MỞ XEM (Read)
0,0 · 3,1 · 5,0 · 6,5 · 7,5 · 9,5 · 9,9 · 10,5 · 11,5 · 13,95 · 14,2 · 16,0 · 17,0 · 18,3 · 19,8 · 21,5 · 22,8 · 23,5 · 24,7 · 26,5 · 28,5 · 31,0 · 32,1 · 32,5 · 33,5 · 34,5 · 35,5 · 36,5 · 37,2 · 38,9 · 38,96 s (31 khung) + khung phóng to 35,5 s + bảng 12 khung liên tiếp 32,1–32,47 s + `final/thumbnail.jpg`. File khung nằm ở `assets/_scratch/qc_claude_*.jpg` (xoá được).

### Đối chiếu tiêu chí `plan.md` 1–9
1. 8 cảnh: mốc thực **0 / 3 / 9,7 / 14 / 18 / 24 / 28 / 32 / 39** (dùng đúng dự phòng cảnh 2 → mốc 9 dời sang 9,7; cảnh 3 còn 4,3 s ≥ 4 s; đã thấy chip/pose đổi giữa 9,5 và 9,9 s). Tổng 39,000 s, 1170 khung: ĐẠT.
2. MP4 1080x1920, H.264 yuv420p, 30 fps CFR, AAC 147 kbps, 2,3 MB, −14,2 LUFS, −4,4 dBTP, không clip: ĐẠT. (faststart: chỉ có số đo của Producer — `moov` trước `mdat`; QC chưa tự kiểm lại mức atom.)
3. Hook đủ câu "Bảng lớn: chia ra / hay chuyển bớt?" và "SQL" hiện ở khung 0,0 s; lời hook vào ngay giây 0 và dứt ~1,84 s; không câu chào: ĐẠT.
4. `captions.srt` (17 cue, khớp 17 câu của `script.md`, UTF-8) và phụ đề đốt cứng: tối đa 2 dòng, nằm trong y=1000–1140, nền tối mờ, không chạm Cáo (Cáo bắt đầu y=1190) và không chạm sơ đồ (đáy sơ đồ ≤960); đủ dấu tiếng Việt ở mọi khung đã xem; không cue nào tràn sang cảnh sau; cue kéo dài thêm sau lời ≤0,3 s: ĐẠT. Phần nghe kiểm phát âm: xem mục dưới.
5. Cáo cao 300 px (y≈1190–1490, x≈100–350), cách đáy 430 px, hiện 39/39 s, sáu lần đổi dáng đúng mốc: `think` 0–3 → `present_hand` 3 → `point_up` 9,7 → `shrug` 14 → `point_right` 18 (giữ qua 24, đã xem ở 24,7 và 26,5) → `clipboard` 28 → `thumbs_up` 32 đến hết; không nhép miệng: ĐẠT.
6. T1–T12 đủ ở cảnh Partition; **chỉ T11** sáng ở 11,5 s và 13,95 s (11 ô còn lại mờ nhưng còn mã đọc được); cảnh 4 (14,2 và 16,0 s) **cả 12 ô sáng**; sau Archive: chính 9 / lưu 3 (24,7 s, 38,9 s), nhãn "Vẫn giữ lại" đọc được; Archive chỉ chuyển T1–T3, thẻ nguồn bỏ trống, không bản sao (21,5 / 22,8 s); không biểu diễn như xoá: ĐẠT.
7. "Có thể bỏ qua" đi cùng "Lọc đúng cột chia", không hứa tăng tốc; Archive nói là "cách quản lý", "Không phải lệnh SQL chuẩn", nơi lưu "Tuỳ hệ thống"; Partition = chia bảng thành nhiều phần, vẫn một tên bảng "Đơn hàng"; mọi nhãn ≤4 từ; không SQL giả/terminal: ĐẠT, nội dung kỹ thuật đúng.
8. Đủ 4 file ở `final/`; `publish.json` đủ TikTok/Facebook Reels/YouTube Shorts, 3–5 hashtag mỗi nền tảng, tiêu đề YouTube ≤100 ký tự, mô tả kết thúc đúng câu khai báo AI: ĐẠT (xem mục qc-publish ở trên).
9. Producer đã ghi số đo thực vào notes (đối chiếu: số của Producer trùng số QC đo lại).
Khác: replay cảnh 8 là **CUT** (bảng 12 khung liên tiếp: 3 khung đầu còn kết quả cũ + biểu tượng replay, khung thứ 4 chuyển ngay sang 12 ô + hộp rỗng, không có khung trung gian/crossfade); hộp Lưu trữ nằm ngoài khung chính; nhãn "Có dùng AI" ở x≈730–930, y≈1460–1495 hiện suốt; không chữ lạ, không logo, không watermark; kết giữ hình 9/3, không fade đen. Thumbnail có "Archive và Partition" / "Chia hay chuyển?" đủ dấu, trong vùng an toàn, không chữ chồng chữ.

### Nguồn
Không hình/clip tải từ Internet, không nhạc/SFX. Sơ đồ tự vẽ (Pillow); 7 dáng Cáo `brand/cao/poses/` (đồ nhận diện của kênh, `library/LICENSES.md` dòng 4 nói không cần ghi); phông Segoe UI Windows (được liệt kê trong `docs/asset-sources.md`); giọng VieNeu-TTS chạy cục bộ theo `docs/voice.md`. Hợp lệ, không thiếu dòng sổ nguồn.

### Lưu ý (KHÔNG chặn PASS)
1. Thẻ vàng trượt (cảnh 5 quanh 22,8 s: T3 che thoáng T8; cảnh 8 quanh 35,5 s: T1 trượt đè lên T3 vàng nên hai thẻ nhập thành một khối ~0,5 s, còn vệt đen nhỏ ở khoảng (447,693) là phần chữ T3 chưa bị che). Đúng thiết kế "thẻ trượt nằm phía trước", không nhân đôi thẻ; nếu muốn mịn hơn ở lần sau: cho T1 đi dưới T2/T3 hoặc đổi đường trượt.
2. Nhãn "Có dùng AI" màu xám nhạt trên nền navy (ước ~3,7:1): đủ vị trí/cỡ nhưng tương phản thấp; nên sáng hơn ở các tập sau.
3. Nét dẫn của "Chính 9" chỉ còn đoạn ngắn ~10 px (y≈650–660) gần như không thấy; nét dẫn "Lưu trữ 3" rõ. Không làm sai nghĩa.
4. Chip "Một bảng logic" và "Vẫn đủ / 12/12 phần" hiện lúc 7,27 s (không phải 5,8 s); "Dùng chung được" lúc 33,95 s: Producer canh theo đầu câu thật như `plan.md` cho phép; ở 33,5 s chip "Hai việc khác nhau" vẫn còn vì lời câu đó dứt 33,79 s.
5. Khung đầu có hook 64 px và phụ đề 52 px cùng một câu: đúng storyboard.
6. Có 33 file `assets/_scratch/qc_claude_*.jpg` do QC trích: chỉ là khung kiểm, xoá được.

### CHƯA KIỂM (nói thật)
QC là agent, **không nghe được âm thanh**. **Cách đọc thuật ngữ (Partition = "pa-ti-sần", Archive = "ác-kaiv", SQL = "ét kiu eo"), độ tự nhiên, nhịp nhấn và độ rõ của giọng chưa được người nghe kiểm — chờ giám đốc nghe.** Hai biến thể dự phòng ("pờ-ti-sần", "a-kaiv") nằm ở `assets/_scratch/voice_raw/partition_alt.wav`, `archive_alt.wav`. Chỉ có các số đo kỹ thuật ở trên (loudness, true peak, thời lượng từng câu, khoảng lặng, wav so với MP4).

### Phán quyết
**PASS** (không có lỗi FAIL; chỉ có "lưu ý" ở trên). Đặt giai đoạn `ready`. Điều kiện còn lại thuộc giám đốc: nghe kiểm phát âm trước khi đăng; nếu phát âm sai thì dùng biến thể dự phòng và chạy `/produce IT-T3-E01 --force`.
