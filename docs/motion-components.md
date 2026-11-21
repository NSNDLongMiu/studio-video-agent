# Danh mục thành phần dựng (motion components) — dùng chung, tái sử dụng (19/11/2026)

Mục đích: Visual-first (`docs/chat-luong-xem.md` D7) cần hình có chuyển động truyền đạt kiến thức, nên **tái dùng thành phần có sẵn** thay vì mỗi tập vẽ lại. Danh mục này nói thành phần nào có ở đâu, ánh xạ keyword → thành phần, và giới hạn thật.

## 1. Thư viện dùng chung `tools/motion/` (Pillow + FFmpeg, Python 3) — **ưu tiên dùng**
Producer (Codex) import trong mã dựng của tập; **không** sửa `tools/` (ngoài phạm vi ghi): thấy thiếu thành phần chung thì ghi đề nghị vào `notes.md`.

```python
import sys; sys.path.insert(0, "<gốc dự án>")   # gốc dự án = thư mục chứa tools/
from tools.motion import core, text, components, flow, charts, kinetic, captions, header, sequence
```
Mọi thành phần nhận **thời gian `t` (giây, tính từ đầu cảnh)** và vẽ hình tại `t` (thuần hàm, dựng lại được); vẽ lên `core.Canvas`.

| Module | Có gì | Dùng cho |
|---|---|---|
| `core` | `Canvas`, `Palette` (bảng màu và nghĩa màu của T5/T8), `progress/lerp/blend`, easing (`ease_in_out`, `ease_out_back`, `ease_out_cubic`, `spring`), `font`, `load_background`, `encode_frames`; hằng vùng an toàn/nội dung/phụ đề/header | nền tảng mọi cảnh |
| `text` | **text engine duy nhất**: `draw_text`, `measure`, `fit_text` (không tràn hộp), `attach_label` (nhãn cạnh/trong thành phần, không chồng, lề ≥ 24 px) | chữ minh hoạ (keyword/nhãn/số), mọi chữ trên hình |
| `components` | `panel`, `window`, `card`, `icon` (bộ icon vector theo tên), `status_indicator` (LED/thanh/đồng hồ: ok/warn/bad), `badge`, `cursor` + nhấp, `slot`, `tray` | đối tượng, trạng thái |
| `flow` | `FlowDiagram`/`Node`/`Edge` (hiện tuần tự theo mốc, gói dữ liệu chạy dọc cạnh, trạng thái normal/blocked/leaking), `connection`, `request_stream` (nhiều request bay tới đích, số tăng dần), `timeline_steps`, `comparison` | quy trình, quan hệ, so sánh, tải/quá tải |
| `charts` | `bar_chart`, `line_chart`, `counter` (số đếm tăng/giảm) | số liệu, response time |
| `kinetic` | `kinetic_text` (pop/slide/type/highlight, có `budget`), `highlight_box` | nhấn keyword **chọn lọc** (≤ 1 mỗi cảnh) |
| `captions` | `build_ass` (lớp phụ đề riêng 52–60 px, dải dưới), `validate_ass`, `burn` | phụ đề accessibility |
| `header` | `header_label`, `chapter_label`, `opening_frame` (opening theo luật pipeline) | header, nhãn chương, opening |
| `sequence` | `Scene`, `render_scene`, `concat`, `camera` (crop/zoom ≲ 1,3×, pan), **`write_scenes_json`** (ghi `assets/scenes.json` đúng định dạng R13/R14/R16 cho `qc-measure`) | ghép cảnh, camera, metadata |

**Từ D8 (19/11/2026 chiều) — đã có (API đầy đủ ở `tools/motion/README.md`, mục "Nhật ký dựng, opening và header từ T9"):** `header.opening_plate` (opening riêng theo luật pipeline), `header.HeaderSpec` + `header_card` + `choose_slot` + `HeaderTrack` (header xuyên suốt, đổi ô ở ranh giới cảnh, né bbox thật, khe ≥ 24 px), `components.sticker` (Cáo/ảnh rời có ghi bbox), `renderlog.RenderLog` + `sequence.write_render_log` (nhật ký `assets/render-log.json`: chữ/thành phần/header/opening thật sự vẽ — `qc-measure` đo trên đó; `render_scene(..., recorder=log, start=<mốc cảnh trên video cuối>)`), `tools/voice/splice.py` (`split`/`check`: tách câu giữ phần âm nhỏ, đo `voice_edges`). Dùng `HeaderTrack/opening_plate` thay `header_label/opening_frame` cũ cho video giải thích sâu.
Ví dụ chạy được: `python tools/motion/examples/demo_overload.py --out <thư mục>` (nhiều request → database quá tải → response time tăng → nhấn “DATABASE OVERLOAD”, phụ đề lớp riêng). Chi tiết API: `tools/motion/README.md`.

## 2. Ánh xạ keyword → thành phần (D7)
| `form` trong `semantic_plan` | Thành phần gợi ý |
|---|---|
| `icon` / đối tượng | `components.icon`, `card`, `window`, `panel`; asset có sẵn (`brand/cao/poses`, nền `tools/backgrounds`) |
| `illustration` | vẽ riêng bằng Pillow cùng `Palette`; dùng `text.attach_label` cho nhãn |
| `animation` (hành động) | `flow.request_stream`, `flow.connection` (gói dữ liệu), `components.cursor`, chuyển động trong `animation_timeline` |
| `flow` (quy trình) | `flow.FlowDiagram`, `flow.timeline_steps` |
| `connection` (quan hệ) | `flow.connection`, `Edge` (normal/blocked/leaking) |
| `comparison` | `flow.comparison` (trước/sau, đúng/sai) |
| `chart` (số liệu) | `charts.bar_chart`, `line_chart`, `counter` |
| `status` (trạng thái) | `components.status_indicator`, `badge` |
| `metaphor` (trừu tượng) | vẽ riêng gắn `Palette`; ghi lý do ẩn dụ trong `visual_concept` |
| chữ (`texts`) | `text.attach_label` (nhãn), `kinetic.kinetic_text` (nhấn, tối đa 1/cảnh) |

## 3. Thành phần cũ theo từng tập (chỉ để tham khảo mã; nằm trong `assets/_scratch/`, bị `.gitignore`)
- `content/it/T8-…/ep01/assets/_scratch/visuals.py` (681 dòng): `Art`, `window`, `chat`, `dossier`, `server`, `tray`, `routes`, `permission`, `cursor`, `storefront`… — tiền thân của `components`/`flow`.
- `content/it/T5-…/ep01/assets/_scratch/{graphics,table_scenes,archive_scenes}.py`: `panel`, `rail`/`partial` (đường vẽ dần), `gauge`, `chip_row`, `tick`, `card`, `calendar`, `tween` — tiền thân của `flow`/`charts`.
Không import trực tiếp (gắn với từng tập); chỉ đọc để lấy ý rồi dùng bản chung ở mục 1.

## 4. Remotion (`studio/renderer-remotion/src/`) — dùng khi storyboard chọn `renderer: "remotion"`
`scenes/ExplainerScene` (sơ đồ khối–mũi tên, bước tuần tự), `DataVizScene` (thanh số liệu), `UiSimulationScene` (IDE/terminal), `QASequenceScene`, `CharacterScene`, `PromptReviewScene`; `environments/` (`DeveloperWorkspace`, `OfficeEnvironment`); `lib/` (`animations`, `CameraController`, `shotPresets`). **Giới hạn đã biết (R9):** nền tối cố định, hạn chế biểu đạt Y4 và các cảnh Visual-first nhiều hình; hầu hết video giải thích sâu đi đường Pillow+FFmpeg với `tools/motion/`.

## 5. Nền, Cáo, phụ đề
- Nền theo ngữ cảnh: `python tools/backgrounds/make_background.py --theme <database|code|security|incident|office> …` (`tools/backgrounds/README.md`).
- Cáo: `brand/cao/poses/*.png` + `tools/fox/narrate.mjs`/`docs/mascot.md`; nhỏ (10–18% khung), ít (≲ 25% thời lượng), không che sơ đồ.
- Phụ đề: lớp riêng bằng `captions.build_ass` (52–60 px, ≤ 2 dòng, ≤ 28 ký tự/dòng, dải dưới y≈1340–1500), đốt SAU khi dựng `assets/_scratch/picture.mp4` (bản không phụ đề, giữ cho QC).

## 6. Giới hạn nói thật
- Thư viện `tools/motion/` **mới tạo 19/11/2026, chưa dùng cho video thật**; icon/thành phần có thể chưa đủ cho mọi chủ đề — bổ sung bằng vẽ riêng trong tập và ghi đề nghị vào `notes.md` để đưa vào thư viện.
- Đã kiểm (19/11/2026): demo `demo_overload.py` dựng ra 1080×1920, 30 fps, 6,0 s; `studio/test/motion.test.mjs` đạt 10/10; xem khung giữa/cuối thấy request dày lên, thanh tải đỏ, “HIGH LATENCY” + số ms tăng, phụ đề ở dải dưới. **Chưa kiểm:** phông dự phòng ngoài Windows (Segoe UI), cảnh dài nhiều đối tượng, chuyển động camera thật, và mắt người trên điện thoại.
- Đã kiểm D8 (19/11/2026 tối): `demo_header_opening.py` dựng 9 s, opening riêng 2,4 s rồi header hiện đủ 198/198 khung, đổi qua 3 ô (`top_left`, `above_captions`, `top_right`), `motion.test.mjs` + `splice.test.mjs` đạt 17/17; `splice.py check` trên giọng T9 bản đầu báo 67/67 câu vi phạm biên (124 biên), trên bản ghép lại từ 18 WAV gốc báo 0 vi phạm (3/18 tệp gốc thiếu lặng đầu 60 ms, công cụ bù đệm). **Chưa kiểm:** tai người nghe (có hết "mất chữ đầu" hay không), cảnh thật nhiều đối tượng với `HeaderTrack`, hiệu năng dựng 180 s.
- Chất lượng thẩm mỹ chỉ kiểm được bằng mắt khi QC xem khung; chưa có số liệu người xem.

## 7. Opening ba pha, mẫu cảnh động và tín hiệu cho âm thanh

`opening_sequence` dựng opening 5–8 s theo năm kiểu. Pha mở vào thẳng hành động. Pha xung đột
có một cụm keyword động. Pha cuối hiện tiêu đề và nhãn chủ đề. Dùng `next_frame` hoặc `concat`
có hòa hình để chuyển cảnh. `params.phases` nhận mốc C4 đã duyệt. Driver lập lịch lời và ghép âm thanh.

`scene_kinds` có mẫu giao diện cấp quyền, luồng dữ liệu, trước/sau, vấn đề–nguyên nhân–hệ quả,
lấy nét chi tiết, từng bước, Cáo giải thích và sơ đồ động. Dùng `layouts` để biến đổi vùng chiếm khung
và chừa ô header. Nhãn bám vào đối tượng qua `attach_to`. Camera nhận lý do và bbox chủ thể,
rồi kẹp zoom và crop để giữ chi tiết trong vùng an toàn.

Log dựng giữ định dạng cũ và bổ sung `layout` trên sự kiện đầu, `cue` ở khung vật thể xuất hiện,
`phase` cho ba pha opening và `camera` cho crop thực sự thay đổi. Mixer có thể đặt hiệu ứng trùng mốc
hình bằng cue. Xem cách gọi và đơn vị tọa độ tại `tools/motion/README.md`.

## Mẫu C5 có sân khấu và đạo cụ

- **Cấp quyền** dựng cửa sổ chat, hộp thoại neo vào cửa sổ, con trỏ và các hàng dữ liệu chuyển màu theo trạng thái.
- **Luồng dữ liệu và sơ đồ** gắn nhãn vào cửa sổ nguồn, tiện ích hoặc máy chủ. Các cạnh dùng mốc của cảnh để đổi trạng thái, cho gói tin đi hoặc dừng.
- **Trước/sau**, **chuỗi nguyên nhân** và **từng bước** giữ ngữ cảnh trong khung khi đổi trọng tâm. So sánh hiện hai vế xuyên suốt. Từng bước tô hàng chat có liên quan trong hình minh họa.
- **Chi tiết** giữ cảnh toàn cạnh ô phóng đại. **Cáo giải thích** đặt sticker có sẵn bên cạnh vật minh họa và chừa vùng phụ đề.

Dùng `kind_params.stage` để đặt nền theo ngữ cảnh hoặc `kind_params.props`
để chọn đạo cụ theo ID. Ngưỡng về cỡ chữ, độ phủ, lệch tâm, vùng trống và giao
bbox nằm ở `tools/motion/scene-kinds.json`. Dùng `measure_frame` để đo khung
và `find_overlaps` để đọc nhật ký hình. Nhật ký có thể khai `parent` khi một
đạo cụ nằm trong đạo cụ khác. Nhãn vẽ bằng text engine và giữ `attach_to` trong
nhật ký. Xem API, tùy chọn và lệnh tạo bảng ảnh trong `tools/motion/README.md`.