"""Đo hình học từ nhật ký, gồm cả các sự kiện đầu vào C7 cũ."""

from collections.abc import Mapping
import json
from pathlib import Path

from .core import CONTENT
from .layouts import scene_settings
from .renderlog import RenderLog
from .text import _free_rectangles


_DRAWABLE = {"text", "component", "header", "opening"}


def _events(source):
    if isinstance(source, RenderLog):
        # RenderLog chưa có API đọc bộ đệm. Chỉ đọc khung/runs, không chốt nhật ký.
        if source._frame is not None:
            return list(source._frame)
        return source.events + [run.event() for runs in source._runs.values() for run in runs]
    if isinstance(source, (str, Path)):
        source = json.loads(Path(source).read_text(encoding="utf-8"))
    return list(source["events"] if isinstance(source, Mapping) else source)


def _area(box):
    return max(0, box[2] - box[0]) * max(0, box[3] - box[1])


def _intersection(a, b):
    return (max(a[0], b[0]), max(a[1], b[1]), min(a[2], b[2]), min(a[3], b[3]))


def _name(event):
    return event.get("id") or event.get("text") or event.get("name") or event["kind"]


def _concurrent(a, b):
    return (a.get("start", float("-inf")) < b.get("end", float("inf")) and
            b.get("start", float("-inf")) < a.get("end", float("inf")))


def _intentional(a, b, parents):
    ref = b.get("id")
    if not ref or a.get("scene") != b.get("scene"):
        return False
    parent = a.get("parent") or a.get("attach_to")
    # Nhãn kề bên chỉ được miễn khi đối tượng đích thực sự chứa chữ, hoặc đủ khe khai báo.
    if parent == ref and a["kind"] == "text":
        gap = a.get("gap")
        if gap is not None:
            x, y, r, bot = a["bbox"]
            u, v, w, z = b["bbox"]
            return max(u - r, x - w, v - bot, y - z) >= gap
        return _intersection(a["bbox"], b["bbox"]) == tuple(a["bbox"])
    seen = set()
    while parent and parent not in seen:
        if parent == ref:
            return True
        seen.add(parent)
        parent = parents.get((a.get("scene"), parent))
    return False


def find_overlaps(events, ignore=()):
    """Trả cặp bbox giao quá ngưỡng trên diện tích vật nhỏ hơn trong cùng thời điểm.

    ignore nhận các cặp ID/tên nhãn. Quan hệ parent là lồng/che có chủ đích.
    """
    rows = [event for event in _events(events)
            if event.get("kind") in _DRAWABLE and event.get("bbox") and _area(event["bbox"])]
    parents = {(event.get("scene"), event["id"]): event["parent"] for event in rows
               if event.get("id") and event.get("parent")}
    ignored = {frozenset(pair) for pair in ignore}
    limit = scene_settings()["max_overlap_fraction"]
    # Dừng ở sự kiện đầu tiên xuất hiện sau khi vật hiện tại biến mất.
    rows.sort(key=lambda event: event.get("start", float("-inf")))
    hits = []
    for i, a in enumerate(rows):
        for j in range(i + 1, len(rows)):
            b = rows[j]
            if b.get("start", float("-inf")) >= a.get("end", float("inf")):
                break
            if not _concurrent(a, b) or frozenset((_name(a), _name(b))) in ignored:
                continue
            fraction = _area(_intersection(a["bbox"], b["bbox"])) / min(_area(a["bbox"]), _area(b["bbox"]))
            if fraction <= limit or _intentional(a, b, parents) or _intentional(b, a, parents):
                continue
            hits.append({"a": a, "b": b, "fraction": fraction})
    return hits


def measure_frame(source, *, t=None, region=None):
    """Đo bbox nội dung và ô trống lớn nhất. Tỉ lệ tính theo vùng dùng được.

    Dùng ảnh do render_scene_kind trả về, danh sách event một khung hoặc một RenderLog.
    Nếu nhật ký có nhiều khung, mặc định lấy khung mới nhất.
    """
    if hasattr(source, "info") and "scene_events" in source.info:
        region = region or source.info["scene_region"]
        source = source.info["scene_events"]
    rows = _events(source)
    if t is None:
        t = source._last if isinstance(source, RenderLog) and source._frame is None else max(
            (event.get("start", 0) for event in rows), default=0)
    live = [event for event in rows if event.get("start", t) <= t < event.get("end", float("inf"))]
    content = [event for event in live if event.get("bbox") and event["kind"] in {"text", "component"}
               and not event.get("role", "").startswith("header")]
    region = tuple(region or next((event["region"] for event in content if "region" in event), CONTENT))
    x, y, r, b = region
    boxes = [_intersection(event["bbox"], region) for event in content]
    boxes = [box for box in boxes if _area(box)]
    occupancy = (min(box[0] for box in boxes), min(box[1] for box in boxes),
                 max(box[2] for box in boxes), max(box[3] for box in boxes)) if boxes else None
    empty = max(map(_area, _free_rectangles(region, boxes)), default=0)
    labels = [event["px"] for event in content if event["kind"] == "text" and "px" in event]
    hits = find_overlaps(live)
    return {
        "occupancy": occupancy,
        "center_offset": abs((occupancy[1] + occupancy[3] - y - b) / 2) / (b - y) if occupancy else 1,
        "width_fraction": (occupancy[2] - occupancy[0]) / (r - x) if occupancy else 0,
        "height_fraction": (occupancy[3] - occupancy[1]) / (b - y) if occupancy else 0,
        "largest_empty": empty / _area(region),
        "min_label_px": min(labels, default=None),
        "has_overlaps": bool(hits),
        "overlaps": hits,
    }

