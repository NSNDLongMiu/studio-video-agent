# Motion graphics cho video dọc

Thư viện Pillow + FFmpeg để Producer dựng từ storyboard theo mốc giây. Hình mô tả sự thay đổi trước, chữ dành cho tên thành phần, từ khóa và phụ đề. Các hàm vẽ nhận Canvas do người gọi tạo và không giữ trạng thái diễn hoạt. Cùng dữ liệu và thời điểm cho cùng khung hình, kể cả khi dựng lại một khung giữa cảnh.

Chạy từ gốc repo với Python 3.10+, Pillow và FFmpeg có libx264/libass. Công cụ kiểm thử video còn dùng FFprobe. Phông hình ưu tiên Segoe UI, sau đó thử Arial, DejaVu Sans, Liberation Sans và Noto Sans có sẵn. ASS dùng Segoe UI Bold và cơ chế chọn phông của libass. Khi chạy trên máy dùng phông dự phòng, mở khung đã ghép để kiểm dấu và vị trí.

## Dựng một luồng dữ liệu

```python
from tools.motion import Canvas
from tools.motion.flow import Edge, FlowDiagram, Node
from tools.motion.sequence import Scene, render_scene, write_scenes_json

graph = FlowDiagram(
    [
        Node("client", (120, 550, 360, 820), "Ứng dụng", "user", appear_at=0.2),
        Node("store", (705, 550, 960, 820), "Kho dữ liệu", "database", appear_at=0.8),
    ],
    [Edge("client", "store", appear_at=1.3)],
)

def frame(t):
    canvas = Canvas()
    graph.render(canvas, t)
    return canvas.image

scene = Scene(4.0, frame, id="S01", complexity="medium", concepts=1,
              voice=((0.3, 2.8),))
render_scene(scene, "assets/_scratch/flow.mp4")
write_scenes_json([scene], "assets/scenes.json")
```

Dùng mốc theo giây từ đầu cảnh cho hình và các khoảng `voice`. `write_scenes_json` quy các khoảng này về đầu video và ghi `id`, `start`, `end`, `complexity`, `concepts`, `role`, `header`, `voice`. Khi ghép với hòa hình, truyền cùng `transitions` cho `concat` và `write_scenes_json`. Mỗi số dương là thời gian chồng lấn giữa hai cảnh, ranh giới trong JSON nằm giữa khoảng này.

## Vùng, nền và màu

| Vùng | Tọa độ ở 1080×1920 |
| --- | --- |
| `SAFE` | `(90, 250, 990, 1500)` |
| `CONTENT` | `(90, 250, 990, 1320)` |
| `CAPTION_BAND` | `(90, 1340, 990, 1500)` |
| `HEADER_ZONE` | `(90, 150, 990, 230)` |

Đặt nhãn sơ đồ từ 56 px và từ khóa từ 72 px. `fit_text` báo cảnh báo nếu phải xuống dưới `min_px`. Thông tin quan trọng có hình hoặc chuyển động đi kèm màu. Mặc định nền `#122438`, mặt thẻ `#23415C` và chữ `#F3F7FB`. Đỏ `#FF6B6B` biểu thị lỗi/cảnh báo, hổ phách `#FFCB6B` đang xét/khoá, lam `#68CCF5` đã chọn, xanh lá `#72D8A0` đã kiểm/ghi. Có thể truyền `Canvas(palette=dataclasses.replace(PALETTE, ...))` để thay màu.

Dùng `load_background(far, mid, near)` với ba tệp của `tools/backgrounds/make_background.py --layers`. Các ảnh được ghép theo thứ tự xa, giữa, gần và lưu đệm. Nếu cảnh có parallax, ghép riêng từng lớp tại tọa độ do Producer tính theo `t`. Với cảnh có Cáo, dựng lớp từ dáng có sẵn bằng `tools/fox/narrate.mjs`. Khi Cáo cùng minh họa, giữ khoảng 10–18% chiều rộng khung và đặt Cáo phía trên dải phụ đề (đáy Cáo ≲ y 1290, khe ≥ 50 px tới dải y≈1340–1500). Đặt vùng đồ họa cần né vào `avoid` nếu gắn nhãn gần Cáo.

## API công khai

Các bbox dùng dạng `(x0, y0, x1, y1)`. Hàm vẽ cập nhật Canvas được truyền vào và trả bbox hoặc thông tin đã vẽ để Producer kiểm.

| Mô-đun | API và tham số chính |
| --- | --- |
| `core`, `__init__` | `WIDTH`, `HEIGHT`, `SIZE`, `FPS`, các vùng ở trên, `Palette`, `PALETTE`. `Canvas(background=None, palette=PALETTE)`, `layer(size=None)`, `composite(layer, xy)`, `save(path)`. |
| `core` | `ease_in_out(x)`, `ease_out_back(x)`, `ease_out_cubic(x)`, `spring(x, damping, oscillations)`, `clamp(x)`, `progress(t, a, b)`, `lerp(a, b, p)`, `blend(a, b, p)`, `rgba(color)`, `font(px, weight)`, `load_background(*paths, size)` và `encode_frames(frames, out_mp4, fps, size)`. |
| `text` | `draw_text(canvas, text, xy, px, weight, anchor, color, outline)`, `measure(text, px, weight, anchor, outline)`, `fit_text(text, box, max_px, min_px, weight, outline)`, `attach_label(canvas, target_bbox, text, side, gap, avoid, bounds)`. |
| `components` | `panel(canvas, bbox, title, t)`, `window(canvas, bbox, title, t, toolbar)`, `card(canvas, bbox, title, symbol, t)`, `icon(canvas, name, xy, size, t, color)`, `ICONS`. `status_indicator(canvas, bbox, kind, level, state, t)` nhận `led/bar/gauge` và `ok/warn/bad`. `badge(canvas, bbox, text, state, t)`, `cursor(canvas, xy, t, click_at)`, `tray(canvas, bbox, slots, t, selected)`, `slot(canvas, bbox, t, active)`. |
| `flow` | `Node(id, bbox, label, symbol, appear_at, accent)`, `Edge(src, dst, appear_at, kind, via, duration, packets)`, `FlowDiagram(nodes, edges).render(canvas, t)`, `connection(canvas, a, b, kind, t, appear_at, duration, via, packets)` với `normal/blocked/leaking`. `request_stream(src, dst, rate, t, canvas, ramp, travel, lanes)`, `timeline_steps(canvas, steps, t, bbox)`, `comparison(left, right, divider_t, t, bbox, canvas)`. |
| `charts` | `bar_chart(canvas, values, t, bbox, labels, appear, duration, stagger, domain)`, `line_chart(canvas, values, t, bbox, labels, appear, duration, domain)`, `counter(canvas, start, end, xy, t, appear, duration, px, formatter)`. |
| `kinetic` | `kinetic_text(canvas, text, xy, t, appear, disappear, style, px, color, budget=1, index=0)` và `highlight_box(canvas, bbox, t, appear, disappear)`. |
| `captions` | `Cue(start, end, text)`, `CaptionStyle(...)`, `build_ass(cues_or_srt, style)`, `validate_ass(text_or_path)`, `burn(video_in, ass, video_out)`. |
| `header` | `visibility(t, show_at, hide_at, fade)`, `header_label(canvas, text, t_visible)`, `chapter_label(canvas, text, t_visible)`, `OpeningStyle(symbol, accent, zoom, sfx_hint)`, `opening_frame(canvas, title, t, duration, style)`. |
| `sequence` | `Scene(duration, renderer, id, complexity, concepts, role, header, voice).render(t)`, `render_scene(scene, out_mp4, fps)`, `concat(scenes, transitions)`, `write_scenes_json(scenes, path, transitions)`, `camera(img, zoom, pan, t, size)`. |

`fit_text` trả `FittedText(text, px, bbox)`. Vẽ từ góc trên trái hộp với cùng `weight` và `outline` đã dùng khi đo. Nếu toàn bộ chữ vẫn không vừa ở 1 px, hàm báo lỗi để Producer đổi bố cục. `attach_label` ưu tiên phải, trái, trên, dưới rồi trong, tránh bbox đã khai báo và lùi ít nhất 24 px khỏi mép khung. Hàm trả `None` khi hết chỗ. Kết quả của `request_stream` là vị trí các gói đang bay, với `rate` tính bằng gói/giây sau khi tăng tốc.

Kinetic có bốn kiểu `pop`, `slide`, `type`, `highlight`. Đánh `index` từ 0 cho từng hiệu ứng trong một cảnh. Hiệu ứng có `index >= budget` sẽ không hiện, nên thứ tự gọi hàm hay thứ tự dựng khung không ảnh hưởng. `sfx_hint` của opening là ghi chú để Producer chọn hiệu ứng tiếng. `camera` nhận số hoặc hàm theo `t`, chặn zoom theo luật pipeline và lấy mẫu trực tiếp từ nguồn. Dùng nguồn lớn hơn 1080×1920 nếu phóng đáng kể.

## Nhật ký dựng, opening và header từ T9

Video giải thích sâu dùng `opening_plate`, `header_card` và `HeaderTrack`. Các hàm `opening_frame`, `header_label` và `chapter_label` vẫn dùng được cho bản dựng cũ.

```python
from tools.motion import Canvas, FPS, RenderLog, SIZE, header, sequence

spec = header.HeaderSpec("Cơ sở dữ liệu", "Khi truy vấn dồn dập")
track = header.HeaderTrack(spec, [("S02", 2.4, 6.0, "top_left")])
obstacles = [(115, 485, 970, 1040)]  # Hợp vùng của sơ đồ, nhãn và Cáo trong S02.
choice = track.set_avoid("S02", obstacles)
if choice.overlap:
    raise ValueError("Cần đổi bố cục để giữ khe tới header")

def opening(t):
    return header.opening_plate(Canvas(), spec.title, spec.topic, t, duration=2.4,
                                style=header.OpeningStyle(symbol="database"))

def hook(t):
    canvas = Canvas()
    graph.render(canvas, t)
    track.draw(canvas, 2.4 + t, obstacles)
    return canvas.image

scenes = [sequence.Scene(2.4, opening, id="S01", role="opening"),
          sequence.Scene(3.6, hook, id="S02", role="hook", header=spec.title,
                         header_slot=choice.slot)]
log = RenderLog(FPS, SIZE)
sequence.render_scene(sequence.concat(scenes), "assets/_scratch/picture.mp4", recorder=log)
sequence.write_render_log(log, "assets/render-log.json")
sequence.write_scenes_json(scenes, "assets/scenes.json")
```

| Mô-đun | API D8 |
| --- | --- |
| `renderlog`, `core` | `RenderLog(fps, size)`, `begin_frame(scene_id, t_global)`, `add(event_dict)`, `end_frame()`, `write(path)`, `Canvas(..., recorder=log)`, `canvas.record(kind, **fields)` cho nét Pillow tự vẽ. |
| `text`, `kinetic` | `draw_text`, `attach_label`, `kinetic_text` nhận `role="label"` và `attach_to=None`. `draw_text` và `kinetic_text` có `target_bbox`, `attach_label` lấy từ đối tượng truyền vào. |
| `components` | `sticker(canvas, image_or_path, bbox, role="mascot", id=None)` vẽ ảnh RGBA và ghi bbox phần có hình. Truyền `id=` cho thành phần để nhãn có thể tham chiếu. |
| `header` | `HeaderSpec(topic, title, accent=None)`, `HEADER_SLOTS`, `header_card(canvas, spec, slot, t_visible=1, scale=1)`, `choose_slot(preferred, avoid_boxes, gap=24, order=..., spec=None)`, `HeaderTrack(spec, plan).draw(canvas, t, avoid_boxes_of_scene)`, `coverage(video_duration, opening_end)`, `opening_plate(canvas, title, topic, t, duration=2.4, style=None, sfx_hint=None)`. |
| `sequence` | `Scene(..., header_slot=None, texts=None)`, `render_scene(scene, out_mp4, fps, recorder=log, start=0)`, `write_render_log(log, path)`, `write_scenes_json(scenes, path)`. |

Nhật ký phiên bản 1 ghi `events` theo tọa độ khung và giây toàn video. Những khung liền có cùng nội dung và bbox ổn định được gộp lại. `render_scene` tự bọc từng lần dựng khung. Khi chạy từng cảnh ra MP4 riêng, truyền `start` là mốc cảnh trên video cuối. Khi tự dựng vòng lặp, gọi `begin_frame` và `end_frame` cho từng khung. Vẽ lên `canvas.layer()` để vị trí nhật ký được tính lại lúc ghép lớp. `Scene` có `header_slot` ghi `header` dạng `{ "text": ..., "slot": ... }`. Cảnh cũ truyền chuỗi `header` mà chưa có ô vẫn giữ định dạng chuỗi.

`choose_slot` cho phép giải nén thành `slot, bbox, moved`. Dùng `choice.overlap` để phát hiện cả bốn ô đều thiếu khe. Khi có `spec`, hàm kiểm tra bbox của thẻ chứa chữ thật. Các ô trên bắt đầu ở y=250 để nằm trong `SAFE`. Ô dưới kết thúc ở y=1316 để giữ 24 px tới phụ đề. Truyền hợp các bbox suốt cảnh để `HeaderTrack` chốt ô ở ranh giới cảnh. Hai ô hòa trong 0,4 giây khi cả hai trống. Nếu nội dung cảnh mới đã chiếm ô cũ, ô mới fade từ 70% để giữ chữ hiện và tránh che nội dung. `coverage` báo độ phủ theo lịch. Đọc nhật ký để kiểm độ phủ của bản thực sự dựng.

Giọng đọc dùng `python tools/voice/splice.py split --in scene.wav --expected 5,6,4 --out-dir DIR --json` cho WAV PCM mono 16-bit nhiều câu. Ghép bằng các cửa sổ có cả phần đệm rồi dùng `python tools/voice/splice.py check --wav track.wav --windows windows.json --json`. `windows.json` chứa các cặp giây `[start, end]` hoặc đối tượng có `start`, `end`. Mã thoát 0 là sạch, 1 là có vi phạm biên, 2 là lỗi dùng. Đo biên giúp phát hiện lỗi cắt. Giám đốc vẫn nghe kiểm phát âm và nhịp.

## Ghép phụ đề riêng

Tạo ASS bằng danh sách cue hoặc đường dẫn SRT với `build_ass` rồi lưu UTF‑8. Văn bản được chia theo từ, mỗi trang tối đa hai dòng và mỗi dòng tối đa 28 ký tự. Cue dài chia thành các trang nối nhau trong khoảng giờ gốc. Các cue chồng thời gian bị báo lỗi để giữ giới hạn hai dòng đồng thời. Phụ đề mặc định Segoe UI Bold 56 px, đặt neo dưới với viền tối 4 px. Dùng `subprocess.run(burn(video_in, ass_path, video_out), check=True)` để ghép sau khi dựng hình. `validate_ass` kiểm định dạng và các ràng buộc của lớp này. `render_scene` xuất video im tiếng. `burn` giữ luồng tiếng đầu vào nếu đã có. Libass đốt phụ đề sau công đoạn Pillow. Nếu vẽ chữ phụ đề qua Canvas, truyền `role="caption"` để ghi vào nhật ký dựng.

## Chạy demo và kiểm thử

```powershell
python tools/motion/examples/demo_overload.py --out "tools/motion/.local/demo"
python tools/motion/examples/demo_header_opening.py --out "tools/motion/.local/demo-d8"
node --test studio/test/motion.test.mjs studio/test/splice.test.mjs
```

Demo xuất `demo_overload.mp4` dài 6 giây và `frame_01.png` đến `frame_03.png` từ bản đã ghép phụ đề. Xem các khung ở 360×640 để kiểm chữ, mật độ request, mức tải và đồng hồ phản hồi. Lệnh in thời gian dựng toàn bộ và thời gian vẽ từng khung Pillow đã làm nóng bộ nhớ đệm nền.

Demo D8 xuất `demo_header_opening.mp4` dài 9 giây, `render-log.json` và bốn khung PNG. Sau opening 2,4 giây, ba cảnh lần lượt minh họa truy vấn, tải cao và hàng đợi. Header đổi ô qua hai cú cắt.

Hình học của thành phần phát triển từ `graphics.py`, `table_scenes.py`, `archive_scenes.py` của T5 và `visuals.py` của T8. Demo gọi bộ tạo nền theo chủ đề có sẵn trong repo.

## Opening ba pha và mẫu cảnh động

`choose_style(hints)` trả `(style, reason)`. Truyền `opening` từ storyboard để lấy kiểu đã duyệt.
Các gợi ý gồm `topic`, `intent` của lời hook, `has_incident`, `has_metrics` và `hypothetical`.

`opening_sequence(style, title, topic, duration, params, palette=PALETTE)` trả `Scene(role="opening")`,
dùng được với `render_scene` và `concat`. Luật pipeline cho phép 1–8 s, mục tiêu 5–8 s.
`openings.json` có công thức cho `question`, `hypothetical`, `warning`, `incident` và `surprise`.
Pha đầu vào thẳng hành động. Pha xung đột thêm một cụm chữ động gắn với chủ thể. Pha cuối hiện tiêu đề và chủ đề.

- Đưa `opening.style_params` vào `params`. Có thể thêm `scene_id`, `keyword` ngắn, `phases` C4 để
  chốt mốc và cue, cùng `voice` là các cặp mốc giây cục bộ của clip lời. `visual` C4 là ghi chú cho Producer.
- Truyền ảnh đầu cảnh sau hoặc hàm không đối số trả ảnh đó vào `next_frame` để hòa hình ở đuôi.
  Dùng `concat` có overlap nếu cần ghi nhật ký cả hai cảnh trong đoạn hòa.
- `opening_plate` và `opening_frame` vẫn dùng được với tham số cũ.

Gọi `render_scene_kind(kind, kind_params, t, duration, palette=..., layout=..., header_slot=..., recorder=...)`
trong driver. Các hàm mang tên từng `scene_kind` có cùng tham số kể từ `kind_params`.
Hộp thoại quyền dùng các trạng thái `request`, `scope`, `consequence`. Có thể thêm mảng `data` gồm tên
nhóm dữ liệu. Con trỏ nhận tọa độ tương đối trong thân cửa sổ hoặc pixel toàn khung.
Trường `object` khớp tên trong `components.ICONS` thì dùng icon đó, các tên khác dùng icon tài liệu.
Mẫu Cáo dùng `pose` trong `brand/cao/poses`. Có thể thêm `label` và `object` cho vật đang được chỉ.

`suggest_layout(history, kind)` trả tên bố cục và tránh bố cục vừa dùng. Truyền tên hoặc kết quả
`resolve_layout(name, header_slot)` vào `layout`. Driver dùng `header_slot` thực tế rồi ghép header và phụ đề riêng.

### Nhật ký sự kiện hình

- Gọi `RenderLog.cue(t, intent, weight, scene=None, target=...)` sau khi đối tượng có ID được vẽ lần đầu.
  Dùng giây toàn video hoặc `None` cho khung hiện tại. Dùng ID khác nếu cần cue ở lần xuất hiện tiếp theo.
- `layout` chứa archetype và occupancy trên sự kiện đầu của cảnh. Nhãn dùng `attach_to` và `target_bbox`.
  `phase` có mốc start/end theo khung thật và nhận cue theo pha.
- `camera(..., reason=..., target_bbox=..., keep_in_safe_area=True)` nhận bbox đích theo pixel nguồn.
  `safe_bbox` theo pixel đầu ra có thể thu hẹp vùng cho phép. Camera giảm zoom khi cần và báo lỗi nếu
  đối tượng đã ngoài vùng ở zoom 1. Nhật ký ghi crop, zoom đầu/cuối và lý do của mỗi đoạn chuyển động.
  Hàm giữ cách gọi cũ với ảnh Pillow và không recorder để xem thử ảnh trực tiếp.

### Đạo cụ và kiểm tra khung của mẫu C5

`render_scene_kind(...)` dựng sân khấu theo `kind_params`. Có thể đặt
`stage={"backdrop": "office", "intent": "warning"}` hoặc truyền trực tiếp tên nền
`office`, `server`, `warning`, `neutral`. `props` ánh xạ ID đối tượng
(ví dụ `before`, `after`, `step-0`, `focus-target`, `magnified`) sang loại
đạo cụ như `browser`, `bubble`, `extension`, `server`, `document` hoặc `packet`.
`before_after.switch_t` đặt mốc đổi trọng tâm và hai vế luôn có mặt.
`before.scope` và `after.scope` chọn chỉ số hàng chat cần tô màu.
Cạnh luồng có thể khai `t`, `stop_t`, `resume_t` theo giây từ đầu cảnh.

`props.py` có trình duyệt, bong bóng chat, miếng ghép tiện ích, rack máy chủ,
tài liệu, hộp thoại quyền, gói tin và badge. Mỗi đạo cụ nhận bbox, `state`,
`strength` (0–1), `id`, `parent` và `cue` tuỳ chọn. Nhãn dài có thể xuống
dòng. Nếu vùng vẫn thiếu ở cỡ tối thiểu, renderer báo lỗi để driver mở rộng
ô hoặc chọn nhãn ngắn hơn.

`measure_frame(frame)` đọc bbox của đúng khung từ ảnh do mẫu trả về.
`measure_frame(log, t=...)` nhận RenderLog hoặc dữ liệu C7. Độ phủ, lệch tâm
và ô trống hình chữ nhật lớn nhất tính theo vùng thực sự dùng được sau khi chừa
header và phụ đề. `find_overlaps(log_or_events, ignore=...)` cũng đọc đường dẫn
JSON. Nó so tỷ lệ giao trên diện tích vật nhỏ hơn trong thời gian cùng hiện.
`ignore` nhận cặp ID hoặc chuỗi nhãn. Quan hệ cha–con và nhãn chứa trong đối
tượng đích là các lớp chồng có chủ đích. Log đã gộp dùng bbox đại diện của mỗi
sự kiện, nên dùng hình học từng khung khi cần tìm lần va chạm ngắn. Cấu hình và
lý do ngưỡng nằm trong `scene-kinds.json`.

Tạo bảng ảnh 8 mẫu × 3 mốc ở thư mục tạm bằng PowerShell.

```powershell
$env:T3_EVIDENCE = Join-Path $env:TEMP 'T3b-visual'
python -B -X utf8 -m unittest tools.motion.tests.visual_checks.VisualChecks.test_scene_kinds
```