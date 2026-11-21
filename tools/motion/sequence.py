"""Ghép cảnh, chuyển cảnh, camera và bảng mốc thời gian cho công cụ QC của xưởng."""

import json
import math
from bisect import bisect_right
from contextlib import nullcontext
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

from PIL import Image

from ..config.rules import load_rules
from .core import Canvas, FPS, SIZE, clamp, ease_in_out, encode_frames, lerp
from .renderlog import active_recorder


@dataclass(frozen=True)
class Scene:
    """Cảnh có hàm dựng theo giây cục bộ. Voice chứa các cặp (start,end) cục bộ."""

    duration: float
    renderer: Callable[[float], Image.Image]
    id: str = ""
    complexity: str = "low"
    concepts: int = 0
    role: str = "body"
    header: str | dict | None = None
    voice: tuple = ()
    header_slot: str | None = None
    texts: tuple | None = None

    def __post_init__(self):
        if not math.isfinite(self.duration) or self.duration <= 0:
            raise ValueError("Thời lượng cảnh phải hữu hạn và dương")
        if self.complexity not in ("low", "medium", "high") or self.role not in ("opening", "hook", "body", "outro"):
            raise ValueError("Complexity hoặc role của cảnh không hợp lệ")
        if type(self.concepts) is not int or self.concepts < 0:
            raise ValueError("Concepts phải là số nguyên không âm")
        if not isinstance(self.id, str) or (self.header is not None and not isinstance(self.header, (str, dict))):
            raise ValueError("ID phải là văn bản. Header nhận văn bản hoặc đối tượng có text và slot")
        if isinstance(self.header, dict) and not isinstance(self.header.get("text"), str):
            raise ValueError("Header phải có trường text là văn bản")
        if any(not 0 <= a < b <= self.duration for a, b in self.voice):
            raise ValueError("Khoảng voice phải có độ dài dương và nằm trong thời lượng cảnh")

    def render(self, t):
        """Trả khung RGBA tại t giây. Các mốc ngoài cảnh dùng khung ở đầu hoặc cuối."""
        return self.renderer(max(0, min(t, self.duration)))


def render_scene(scene, out_mp4, fps=FPS, *, recorder=None, start=0):
    """Dựng MP4 im tiếng. Nếu có nhật ký, cộng start vào mốc từng khung."""
    if not math.isfinite(fps) or fps <= 0:
        raise ValueError("FPS phải hữu hạn và dương")
    if recorder is not None and recorder.fps != fps:
        raise ValueError("FPS render và FPS nhật ký phải trùng nhau")
    count = max(1, round(scene.duration * fps))

    def frames():
        for i in range(count):
            local = i / fps
            if recorder is None:
                yield scene.render(local)
                continue
            recorder.begin_frame(scene.id or "S01", start + local)
            try:
                frame = scene.render(local)
            finally:
                recorder.end_frame()
            yield frame

    return encode_frames(frames(), out_mp4, fps, size=recorder.size if recorder is not None else SIZE)


def _timeline(scenes, transitions):
    if not scenes:
        raise ValueError("Cần ít nhất một cảnh")
    overlaps = (0,) * (len(scenes) - 1) if transitions is None else tuple(
        0 if transition == "cut" else transition for transition in transitions)
    if len(overlaps) != len(scenes) - 1 or any(not isinstance(n, (int, float)) or not math.isfinite(n) or n < 0 for n in overlaps):
        raise ValueError("Truyền một giá trị cut hoặc số giây hòa hình không âm cho mỗi cặp cảnh")
    starts = [0.0]
    for scene, incoming, outgoing in zip(scenes, (0, *overlaps), (*overlaps, 0)):
        if incoming + outgoing >= scene.duration:
            raise ValueError("Hai đoạn hòa hình không được chiếm hết thời lượng một cảnh")
        starts.append(starts[-1] + scene.duration - outgoing)
    return tuple(starts[:-1]), overlaps, starts[-1]


def concat(scenes, transitions=None):
    """Trả Scene ghép, cắt thẳng mặc định. Mỗi số dương trong transitions là giây hòa hình."""
    scenes = tuple(scenes)
    starts, overlaps, duration = _timeline(scenes, transitions)

    def frame(t):
        index = bisect_right(starts, t) - 1
        local = t - starts[index]
        recorder = active_recorder()

        def render_at(i):
            scene = scenes[i]
            id_ = scene.id or f"S{i + 1:02d}"
            with recorder.scene(id_) if recorder is not None else nullcontext():
                return scene.render(t - starts[i])

        if index and local < overlaps[index - 1]:
            amount = ease_in_out(local / overlaps[index - 1])
            if amount == 0 and recorder is not None:
                return render_at(index - 1)
            current = render_at(index)
            return Image.blend(render_at(index - 1), current, amount)
        return render_at(index)

    return Scene(duration, frame)


def write_scenes_json(scenes, path, transitions=None):
    """Ghi metadata R13/R14/R16, quy voice về giờ toàn video. Ranh giới đi qua giữa hòa hình."""
    scenes = tuple(scenes)
    starts, overlaps, duration = _timeline(scenes, transitions)
    boundaries = (0, *(next_at + overlap / 2 for next_at, overlap in zip(starts[1:], overlaps)), duration)
    rows = []
    ids = set()
    for i, scene in enumerate(scenes):
        id_ = scene.id or f"S{i + 1:02d}"
        start, end = map(lambda value: round(value, 6), boundaries[i:i + 2])
        voice = [{"start": round(starts[i] + a, 6), "end": round(starts[i] + b, 6)} for a, b in scene.voice]
        if id_ in ids or start >= end or any(row["start"] >= row["end"] for row in voice):
            raise ValueError("ID cảnh trùng hoặc mốc quá ngắn để ghi chính xác theo giây")
        ids.add(id_)
        header = scene.header
        if isinstance(header, dict):
            header = {"text": header["text"], "slot": scene.header_slot or header.get("slot")}
        elif header is not None and scene.header_slot is not None:
            header = {"text": header, "slot": scene.header_slot}
        row = {"id": id_, "start": start, "end": end, "complexity": scene.complexity,
               "concepts": scene.concepts, "role": scene.role, "header": header, "voice": voice}
        if scene.texts is not None:
            row["texts"] = scene.texts
        rows.append(row)
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(rows, ensure_ascii=False, indent=2, allow_nan=False) + "\n", encoding="utf-8")
    return rows


def write_render_log(log, path):
    """Ghi nhật ký khung đã dựng cho QC."""
    return log.write(path)


def camera(img, zoom=1, pan=(0, 0), t=0, *, size=SIZE, reason=None,
           target_bbox=None, keep_in_safe_area=False, recorder=None, safe_bbox=None):
    """Cắt nguồn theo camera. Bbox đích tính trên ảnh nguồn, crop ghi theo pixel nguồn."""
    recorder = active_recorder() if recorder is None else recorder
    layer = img if isinstance(img, Canvas) else None
    if layer is not None:
        img = layer.image
        recorder = layer.recorder if recorder is None else recorder
    moving = callable(zoom) or callable(pan)
    if (moving or zoom != 1 or pan != (0, 0)) and not reason and (
            recorder is not None or layer is not None or keep_in_safe_area):
        raise ValueError("Camera chuyển động cần lý do")
    rules = load_rules()
    requested = zoom(t) if callable(zoom) else zoom
    px, py = pan(t) if callable(pan) else pan
    if not all(map(math.isfinite, (requested, px, py))):
        raise ValueError("Zoom và pan phải hữu hạn")
    z = min(rules["camera"]["max_zoom"], max(1, requested))
    adjustment = "kẹp zoom theo cấu hình" if z != requested else None
    width, height = img.size
    aspect = size[0] / size[1]
    base = min(width, height * aspect)
    safe = tuple(value * size[i % 2] / rules["frame"][("width", "height")[i % 2]]
                 for i, value in enumerate(rules["frame"]["safe_bbox"]))

    if safe_bbox is not None:
        safe = tuple((max if i < 2 else min)(value, safe_bbox[i])
                     for i, value in enumerate(safe))

    def crop_at(value):
        w = base / value
        h = w / aspect
        offsets = []
        for i, (limit, span, axis) in enumerate(zip(img.size, (w, h), (px, py))):
            low, high = 0, max(0, limit - span)
            desired = lerp(low, high, clamp((axis + 1) / 2))
            if keep_in_safe_area:
                low = max(low, target_bbox[i + 2] - safe[i + 2] * span / size[i])
                high = min(high, target_bbox[i] - safe[i] * span / size[i])
                if low > high + 1e-9:
                    return None
            offsets.append(max(low, min(high, desired)))
        x, y = offsets
        return x, y, min(width, x + w), min(height, y + h)

    if keep_in_safe_area and (target_bbox is None or len(target_bbox) != 4
            or not 0 <= target_bbox[0] < target_bbox[2] <= width
            or not 0 <= target_bbox[1] < target_bbox[3] <= height):
        raise ValueError("Camera an toàn cần bbox đích hợp lệ trong ảnh nguồn")
    crop = crop_at(z)
    if crop is None:
        low, high = 1, z
        crop = crop_at(low)
        if crop is None:
            raise ValueError("Đối tượng không vừa vùng an toàn ở zoom 1")
        for _ in range(24):
            middle = (low + high) / 2
            candidate = crop_at(middle)
            if candidate is None:
                high = middle
            else:
                low, crop = middle, candidate
        z = low
        adjustment = "giảm zoom để giữ đối tượng trong vùng an toàn"
    result = img.resize(size, Image.Resampling.LANCZOS, box=crop)
    if recorder is not None:
        if reason:
            recorder.camera(z, crop, reason, adjustment)
        if layer is not None:
            sx, sy = (size[i] / (crop[i + 2] - crop[i]) for i in range(2))
            output = Canvas(result, palette=layer.palette, recorder=recorder)
            output._record_layer(layer, (-crop[0] * sx, -crop[1] * sy), (sx, sy))
    return result
