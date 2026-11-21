"""Sân khấu motion C5 dựng từ nhãn, đạo cụ và mốc của storyboard."""

from functools import partial
import math
from pathlib import Path

from PIL import Image

from ..config.rules import load_rules
from . import components as art, flow, props
from .backdrops import backdrop, suggest_backdrop
from .core import Canvas, PALETTE, SIZE, WIDTH, blend, ease_in_out, lerp, progress
from .layouts import available_area, resolve_layout, scene_settings, suggest_layout
from .renderlog import active_recorder
from .sequence import camera

_POSES = Path(__file__).resolve().parents[2] / "brand" / "cao" / "poses"
_inset, _center = props.inset, props.center


class _FrameRecorder:
    """Chuyển tiếp RenderLog và giữ bbox của chính khung ảnh trả về."""

    def __init__(self, recorder, region):
        self.recorder, self.region = recorder, region
        self.events = []

    def add(self, event):
        if not self.events:
            event = {**event, "region": self.region}
        self.events.append(event)
        if self.recorder is not None:
            self.recorder.add(event)

    def cue(self, *args, **kwargs):
        if self.recorder is not None:
            self.recorder.cue(*args, **kwargs)

    def camera(self, *args, **kwargs):
        if self.recorder is not None:
            self.recorder.camera(*args, **kwargs)


def _stage(i, count, duration):
    return i * duration * scene_settings()["stage_fraction"] / max(1, count - 1)


def _box(canvas, box, key, name, tone, parent=None, cue=None, fill=None):
    props._panel(canvas, box, tone, fill)
    props._record(canvas, name, box, key, parent, cue)


def _prop(canvas, box, object_name, key, *, state=None, strength=1, parent=None, cue=None, scope=()):
    common = dict(state=state, strength=strength, parent=parent, id=key, cue=cue)
    if object_name in {"browser", "window", "chat", "terminal", "ide", "dialog", "globe"}:
        return props.browser_window(canvas, box, scope=scope, **common)
    if object_name in {"extension", "puzzle", "plugin"}:
        return props.extension_icon(canvas, box, **common)
    if object_name in {"server", "rack", "database"}:
        return props.server_rack(canvas, box, **common)
    if object_name == "packet":
        return props.packet(canvas, box, **common)
    if object_name in {"bubble", "message"}:
        return props.chat_bubble(canvas, box, **common)
    return props.document_card(canvas, box, symbol=object_name if object_name in art.ICONS else None, **common)


def _object(params, row, key, default="document"):
    return params.get("props", {}).get(key, row.get("object") or default)


def _tile(canvas, box, params, row, key, *, strength=1, cue="ui_appear", default="document", subtitle=""):
    state = row.get("state")
    tone = props._tone(canvas, state, strength)
    face = blend(canvas.palette.ink, canvas.palette.panel, strength)
    _box(canvas, box, key, "object_tile", tone, cue=cue, fill=face)
    width, height = box[2] - box[0], box[3] - box[1]
    # Ưu tiên cột nhãn trong ô ngang thấp, chừa đủ chiều cao cho nhãn xuống dòng.
    if width > height * 1.45:
        art_box, label_box = _inset(box, (.04, .10, .44, .90)), _inset(box, (.48, .06, .97, .94))
    else:
        art_box, label_box = _inset(box, (.09, .07, .91, .67)), _inset(box, (.05, .70, .95, .97))
    if subtitle and width <= height * 1.45:
        art_box = _inset(box, (.09, .07, .91, .54))
        label_box = _inset(box, (.05, .57, .95, .97))
    _prop(canvas, art_box, _object(params, row, key, default), f"{key}-art", state=state,
          strength=strength, parent=key, scope=row.get("scope", ()))
    title = row["label"] + ("\n" + subtitle if subtitle else "")
    props.label(canvas, label_box, title, target=key, target_bbox=box,
                background=face)


def _active(t, timing):
    return max((i for i, at in enumerate(timing) if t >= at), default=0)


def _ui(canvas, params, t, duration, layout):
    p, box = canvas.palette, layout.occupancy
    states = sorted(params.get("states") or (), key=lambda row: row["t"])
    if params["app"] == "dialog" and not states:
        states = [
            {"t": 0, "state": "request"},
            {"t": _stage(1, 3, duration), "state": "granted", "label": "Phạm vi đọc"},
            {"t": _stage(2, 3, duration), "state": "consequence", "label": "Dữ liệu lộ"},
        ]
    row = next((row for row in reversed(states) if row["t"] <= t), {})
    state = row.get("state", "")
    danger = state in {"consequence", "error", "denied"}
    request = params["app"] == "dialog" and state in {"", "request", "prompt"}
    title = {"dialog": "Trình duyệt", "browser": "Trình duyệt", "terminal": "Dòng lệnh", "ide": "IDE"}[params["app"]]
    chat_rows = row.get("data") or params.get("chat_rows", 3)
    scope = tuple(range(chat_rows if isinstance(chat_rows, int) else len(chat_rows))) if state != "" and not request else ()
    browser = box if request or not row.get("label") else _inset(box, (0, 0, 1, .86))
    props.browser_window(canvas, browser, title, "bad" if danger else ("ok" if scope else None),
                         chat_rows, id="ui", cue="ui_appear", scope=scope, compact=request)
    panel = _inset(box, (.55, .34, .96, .75))
    if request:
        props.permission_dialog(canvas, panel, row.get("label") or "Cấp quyền?",
                                id="permission", parent="ui", cue="interaction", state="warn")
    elif row.get("label"):
        props.badge(canvas, _inset(box, (.21, .88, .79, 1)), row["label"], id=f"ui-{state}",
                    state="bad" if danger else "ok", cue="alert" if danger else "highlight")
    path = sorted(params.get("cursor_path", ()), key=lambda point: point["t"])
    if request or path:
        # Dành hành lang riêng cho con trỏ; điểm cuối chạm nút khi hộp thoại còn hiện.
        lane = _inset(box, (.58, .756, .89, .78)) if request else _inset(browser, (.70, .17, .89, .19))
        if path:
            a = next((point for point in reversed(path) if point["t"] <= t), path[0])
            b = next((point for point in path if point["t"] > t), path[-1])
            amount = progress(t, a["t"], b["t"]) if b["t"] > a["t"] else 0
            x = lerp(a["x"], b["x"], amount)
            y = lerp(a["y"], b["y"], amount)
            if all(0 <= point[axis] <= 1 for point in path for axis in ("x", "y")):
                x, y = lerp(lane[0], lane[2], x), lerp(lane[1], lane[3], y)
            else:
                x, y = min(lane[2], max(lane[0], x)), min(lane[3], max(lane[1], y))
        else:
            x, y = lerp(lane[0], lane[2], progress(t, 0, duration)), lane[1]
        size = min(lane[3] - lane[1], 40) * 2
        click = states[1]["t"] if len(states) > 1 else duration
        cursor_parent = "ui"
        if request:
            reach = ease_in_out(progress(t, max(0, click - duration * scene_settings()["edge_fraction"]), click))
            button = _inset(panel, (.63, .81, .74, .87))
            x, y = lerp(x, button[0], reach), lerp(y, button[1], reach)
            if y < panel[3]:
                cursor_parent = "permission"
        # Vòng nhấp nằm ngay dưới nút, trong hành lang dành riêng cho con trỏ.
        flash = progress(t, click, click + duration * scene_settings()["edge_fraction"])
        if t >= click and flash < 1:
            radius = min(size / 2, (box[3] - box[1]) * .015)
            if radius > 0:
                canvas.draw.ellipse((x-radius, y-radius, x+radius, y+radius),
                                    outline=blend(p.amber, p.ink, flash), width=3)
        pointer = [(x + size * dx, y + size * dy) for dx, dy in
                   ((0, 0), (.18, .93), (.38, .65), (.62, .84), (.74, .70), (.5, .48), (.8, .39))]
        canvas.draw.polygon(pointer, fill=p.amber if t >= click and flash < 1 else p.text, outline=p.ink, width=2)
        props._record(canvas, "cursor", (x, y, x + size * .8, y + size * .93), "cursor", cursor_parent, None)
    return canvas.image


def _edge_points(source, target):
    a = flow.Node("source", source)
    b = flow.Node("target", target)
    return a.port(_center(target)), b.port(_center(source))


def _link(canvas, a, b, t, duration, *, at=0, kind="normal", via=(), packets=False):
    if kind != "blocked":
        return flow.connection(canvas, a, b, kind=kind, t=t, appear_at=at,
                               duration=duration * scene_settings()["edge_fraction"],
                               via=via, packets=packets, width=5)
    # Một điểm chặn trong hành lang, cách đều hai nút. Gói dừng trước dấu chặn.
    barrier = tuple((x + y) / 2 for x, y in zip(a, b))
    return flow.connection(canvas, a, barrier, kind="normal", t=t, appear_at=at,
                           duration=duration * scene_settings()["edge_fraction"], color=canvas.palette.amber,
                           packets=False, width=5)


def _packet(canvas, points, boxes, key, state, age):
    if len(points) < 2:
        return
    fraction = (max(0, age) % scene_settings()["packet_period_s"]) / scene_settings()["packet_period_s"]
    segments = [math.dist(a, b) for a, b in zip(points, points[1:])]
    distance = sum(segments) * fraction
    for a, b, length in zip(points, points[1:], segments):
        if length and distance <= length:
            x, y = (lerp(u, v, distance / length) for u, v in zip(a, b))
            radius = min(scene_settings()["gutter"] * .58, max(1, length / 3))
            box = (x - radius, y - radius * .69, x + radius, y + radius * .69)
            if all(box[2] <= l or box[0] >= r or box[3] <= top or box[1] >= bottom
                   for l, top, r, bottom in boxes):
                props.packet(canvas, box, state=state, id=key, cue="data_move")
            return
        distance -= length


def _flow(canvas, params, t, duration, layout, *, streaming=False):
    rows = params["nodes"]
    boxes = layout.slots(len(rows))
    lookup = dict(zip((row["id"] for row in rows), boxes))
    links = params.get("edges", ())
    payloads = {}
    for i, row in enumerate(links):
        source, target = lookup[row["from"]], lookup[row["to"]]
        a, b = _edge_points(source, target)
        at = row.get("t", 0)
        before_stop = t < row.get("stop_t", math.inf)
        resumed = t >= row.get("resume_t", math.inf)
        declared = row.get("kind", "normal")
        kind = "normal" if resumed or (before_stop and "stop_t" in row) else declared
        if not before_stop and not resumed:
            kind = "blocked"
        points = _link(canvas, a, b, t, duration, at=at, kind=kind, packets=not streaming)
        if kind == "blocked" and t >= at + duration * scene_settings()["edge_fraction"] and points:
            x, y = points[-1]
            if all(not (l - 10 < x < r + 10 and top - 10 < y < bottom + 10)
                   for l, top, r, bottom in boxes):
                art.icon(canvas, "lock", (x, y), 20, color=canvas.palette.amber, id=f"blocked-{i}")
        if row.get("payload") and t >= at:
            payloads.setdefault(row["from"], []).append(row["payload"])
        if streaming and kind != "blocked":
            _packet(canvas, points, boxes, f"packet-{i}", kind, t - (row.get("resume_t", at) if resumed else at))
    for i, (row, box) in enumerate(zip(rows, boxes)):
        when = row.get("t", _stage(i, len(rows), duration))
        # Các đầu mút đã có mặt, trạng thái sáng dần theo mốc.
        strength = lerp(scene_settings()["inactive_strength"], 1, progress(t, 0, when or duration))
        default = "browser" if streaming and i == 0 else ("server" if streaming else "document")
        captions = payloads.get(row["id"], ())
        _tile(canvas, box, params, row, row["id"], strength=strength, default=default,
              subtitle=" · ".join(captions))
    return canvas.image


def _before_after(canvas, params, t, duration, layout):
    boxes = layout.slots(2)
    shift = params.get("switch_t", _stage(1, 3, duration))
    amount = ease_in_out(progress(t, shift, duration)) if shift < duration else float(t >= shift)
    blend_in = ease_in_out(progress(t, 0, min(shift, duration))) if shift > 0 else 1
    dim = scene_settings()["inactive_strength"]
    for box, key, strength in zip(boxes, ("before", "after"), (lerp(lerp(.82, .70, blend_in), dim, amount), lerp(lerp(.67, .82, blend_in), 1, amount))):
        row = params[key]
        if key == "after" and "scope" not in row:
            row = {**row, "scope": (1,) if t >= shift else ()}
        _tile(canvas, box, params, row, key, strength=strength,
              cue="highlight" if key == "after" else "ui_appear", default="browser")
    return canvas.image


def _chain(canvas, params, t, duration, layout):
    keys = ("problem", "cause", "consequence")
    boxes = layout.slots(len(keys))
    dim = scene_settings()["inactive_strength"]
    for i, (key, box, state) in enumerate(zip(keys, boxes, ("warn", "bad", "bad"))):
        row = params[key]
        when = row.get("t", _stage(i, len(keys), duration))
        if i:
            _link(canvas, *_edge_points(boxes[i - 1], box), t, duration, at=when, kind="leaking")
        strength = lerp(dim, 1, progress(t, when, when + duration * scene_settings()["edge_fraction"]))
        _tile(canvas, box, params, {**row, "state": state}, key, strength=strength,
              cue="alert" if i == 2 else "ui_appear", default=("browser", "extension", "server")[i])
    return canvas.image


def _steps(canvas, params, t, duration, layout):
    steps = params["steps"]
    if len(steps) < 2:
        raise ValueError("Mẫu từng bước cần ít nhất hai bước")
    timing = [row.get("t", _stage(i, len(steps), duration)) for i, row in enumerate(steps)]
    current = _active(t, timing)
    box = layout.occupancy
    art_box, rail = _inset(box, (0, 0, .62, 1)), _inset(box, (.67, 0, 1, 1))
    keys = [f"step-{i}" for i in range(len(steps))]
    dim = scene_settings()["inactive_strength"]
    for i, (row, key) in enumerate(zip(steps, keys)):
        slot = _inset(rail, (0, i / len(steps), 1, (i + .87) / len(steps)))
        if i:
            _link(canvas, *_edge_points(previous, slot), t, duration, at=timing[i - 1])
        previous = slot
        strength = lerp(1, dim, progress(t, timing[min(i + 1, len(steps) - 1)], duration)) if i < current else (
            1 if i == current else dim)
        props.badge(canvas, slot, row["label"], id=key, state="ok" if i <= current else None,
                    strength=strength, cue="highlight" if i == current else None)
    row = steps[current]
    plate = _inset(art_box, (0, 0, 1, 1))
    _box(canvas, plate, "step-illustration", "step_stage", canvas.palette.blue)
    picture = _inset(plate, (.06, .08, .94, .71))
    object_name = _object(params, row, keys[current], "browser")
    if object_name in {"bubble", "chat", "message"}:
        object_name = "browser"
        scope = (min(current - 1, 2),) if current else ()
    else:
        scope = ()
    _prop(canvas, picture, object_name, f"{keys[current]}-art", state="ok", cue="highlight",
          parent="step-illustration", scope=scope)
    # Giữ ngữ cảnh của thao tác dưới đạo cụ chính bằng ô gửi có thanh tiến độ.
    lower = _inset(plate, (.06, .78, .94, .93))
    props._panel(canvas, lower, canvas.palette.edge, canvas.palette.ink)
    meter = _inset(lower, (.10, .49, .90, .59))
    canvas.draw.line((*meter[:2], lerp(meter[0], meter[2], progress(t, 0, duration)), meter[1]),
                     fill=canvas.palette.green, width=5)
    return canvas.image


def _focus(canvas, params, t, duration, layout):
    box = layout.occupancy
    p = canvas.palette
    full = _inset(box, (0, 0, 1, .53))
    inset = _inset(box, (.17, .58, 1, 1))
    amount = ease_in_out(progress(t, 0, duration))
    obj = _object(params, params, "focus-target", "browser")
    _prop(canvas, full, obj, "focus-context", strength=lerp(1, .49, amount))
    mark = _inset(full, (.13, .42, .86, .61)) if obj in {"browser", "chat", "window", "globe"} else _inset(full, (.21, .28, .71, .70))
    canvas.draw.ellipse(mark, outline=p.amber, width=round(lerp(3, 7, amount)))
    canvas.draw.line((_center(mark), (_center(mark)[0], inset[1])), fill=p.amber, width=3)
    _box(canvas, inset, "focus-target", "focus_inset", p.amber)
    inset_art = _inset(inset, (.06, .06, .94, .64))
    # Camera chạy trên lớp hình đưa vào kính lúp. Chữ vẽ sau và giữ cỡ nguyên.
    layer = Canvas(p.ink, palette=p, recorder=_FrameRecorder(None, box))
    target = _inset((0, 0, *SIZE), (.24, .39, .76, .53))
    _prop(layer, target, _object(params, {}, "magnified", "bubble" if obj in {"browser", "chat", "window", "globe"} else obj), "magnified", state="warn")
    zoom = lerp(1, params.get("zoom", scene_settings()["focus_zoom"]), amount)
    image = camera(layer.image, zoom, reason=f"Lấy nét chi tiết {params['target']}", target_bbox=target,
                   keep_in_safe_area=params.get("keep_in_safe_area", True), recorder=canvas.recorder)
    # Lấy viền kính lúp vừa vùng minh hoạ. Lớp nguồn vẫn đầy đủ để đo crop chuẩn C7.
    image = image.crop(_inset((0, 0, *SIZE), (.105, .33, .895, .58))).resize(
        (inset_art[2] - inset_art[0], inset_art[3] - inset_art[1]), Image.Resampling.LANCZOS)
    canvas.composite(image, inset_art[:2])
    props._record(canvas, "magnified_detail", inset_art, "focus-detail", "focus-target", "highlight")
    props.label(canvas, _inset(inset, (.05, .67, .95, .98)), params["target"],
                target="focus-target", target_bbox=inset, background=p.panel)
    return canvas.image


def _character(canvas, params, t, duration, layout):
    pose = params["pose"]
    path = _POSES / f"{pose}.png"
    if path.parent != _POSES or not path.is_file():
        raise ValueError(f"Không tìm thấy dáng Cáo: {pose}")
    box = layout.occupancy
    leftward = "left" in params.get("gesture", "")
    moment = progress(t, 0, duration)
    target = _inset(box, (0, 0, .70, 1) if leftward else (.30, 0, 1, 1))
    track = _inset(box, (.74, .38, 1, .91) if leftward else (0, .38, .26, .91))
    width = min(track[2] - track[0], WIDTH * scene_settings()["fox_max_width_fraction"])
    x = round(_center(track)[0] - width / 2)
    fox = art.sticker(canvas, path, (x, track[1], x + round(width), track[3]), id="fox")
    if fox:
        _link(canvas, *_edge_points(fox, target), t, duration, at=_stage(1, 3, duration))
    row = {"label": params.get("label") or "Chi tiết", "state": "ok"}
    _tile(canvas, target, params, row, "character-target", strength=lerp(.55, 1, moment),
          default=params.get("object") or "browser")
    return canvas.image


_RENDERERS = {
    "ui_simulation": _ui,
    "data_flow": partial(_flow, streaming=True),
    "before_after": _before_after,
    "problem_cause_consequence": _chain,
    "detail_focus": _focus,
    "step_by_step": _steps,
    "character_explanation": _character,
    "animated_diagram": _flow,
}


def render_scene_kind(kind, kind_params, t, duration, *, palette=PALETTE, layout=None,
                      header_slot=None, recorder=None):
    """Dựng một khung. Driver mở/đóng RenderLog nếu muốn lưu nhật ký cả video."""
    if kind not in load_rules()["scene_kinds"] or not 0 <= t <= duration or duration <= 0:
        raise ValueError("Loại cảnh hoặc mốc dựng mẫu không hợp lệ")
    if layout is None or isinstance(layout, str):
        layout = resolve_layout(layout or suggest_layout((), kind), header_slot)
    elif header_slot is not None:
        layout = resolve_layout(layout.archetype, header_slot)
    recorder = active_recorder() if recorder is None else recorder
    if recorder is not None:
        recorder.layout(layout.archetype, layout.occupancy)
    stage = kind_params.get("stage") or {}
    theme = stage if isinstance(stage, str) else stage.get("backdrop")
    if not theme:
        theme = suggest_backdrop(kind, stage.get("intent") if isinstance(stage, dict) else None)
    if kind == "problem_cause_consequence" and not stage:
        theme = "warning"
    region = available_area(header_slot)
    snapshot = _FrameRecorder(recorder, region)
    canvas = Canvas(backdrop(theme, SIZE, t), palette=palette, recorder=snapshot)
    picture = _RENDERERS[kind](canvas, kind_params, t, duration, layout)
    picture.info.update(scene_events=snapshot.events, scene_region=region)
    return picture


ui_simulation = partial(render_scene_kind, "ui_simulation")
data_flow = partial(render_scene_kind, "data_flow")
before_after = partial(render_scene_kind, "before_after")
problem_cause_consequence = partial(render_scene_kind, "problem_cause_consequence")
detail_focus = partial(render_scene_kind, "detail_focus")
step_by_step = partial(render_scene_kind, "step_by_step")
character_explanation = partial(render_scene_kind, "character_explanation")
animated_diagram = partial(render_scene_kind, "animated_diagram")

