"""Cấp sân khấu và các ô trong vùng trống giữa header và phụ đề."""

import json
import math
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from .core import CONTENT, lerp
from .header import HEADER_SLOTS


@lru_cache(maxsize=1)
def scene_settings():
    return json.loads(Path(__file__).with_name("scene-kinds.json").read_text(encoding="utf-8"))


_PREFERENCES = {
    "ui_simulation": ("center_stage", "focus_corner"),
    "data_flow": ("diagonal_flow", "left_right_split", "radial"),
    "before_after": ("left_right_split", "center_stage"),
    "problem_cause_consequence": ("stacked_chain", "diagonal_flow"),
    "detail_focus": ("focus_corner", "center_stage"),
    "step_by_step": ("stacked_chain", "focus_corner"),
    "character_explanation": ("left_right_split", "radial"),
    "animated_diagram": ("radial", "diagonal_flow", "stacked_chain"),
}


def suggest_layout(history, kind):
    """Ưu tiên bố cục của mẫu và tránh lặp với cảnh ngay trước."""
    last = history[-1] if history else None
    if isinstance(last, Layout):
        last = last.archetype
    return next(name for name in _PREFERENCES[kind] if name != last)


def available_area(header_slot=None):
    x, y, r, b = CONTENT
    slot = header_slot or "top"
    _, top, _, bottom = HEADER_SLOTS[slot]
    gap = scene_settings()["header_gap"]
    if slot == "above_captions":
        return x, y, r, min(b, top - gap)
    return x, max(y, bottom + gap), r, b


@dataclass(frozen=True)
class Layout:
    archetype: str
    occupancy: tuple

    def slots(self, count):
        """Trả các ô theo thứ tự kể chuyện, chừa đường nối giữa các ô."""
        if count < 1:
            raise ValueError("Bố cục cần ít nhất một ô")
        if count == 1:
            return (self.occupancy,)
        vertical = self.archetype in {"stacked_chain", "focus_corner"}
        columns = 1 if vertical else min(2, count)
        rows = math.ceil(count / columns)
        x, y, r, b = self.occupancy
        gap = scene_settings()["gutter"]
        if count == 3 and self.archetype in {"diagonal_flow", "radial"}:
            arrangement = scene_settings()["three_node_slots"][self.archetype]
            return tuple(tuple(round(lerp((x, y)[i % 2], (r, b)[i % 2], f))
                               for i, f in enumerate(slot)) for slot in arrangement)
        w, h = (r - x + gap) / columns, (b - y + gap) / rows
        # Hai ô chéo vẫn chạm gần hai đầu sân khấu.
        stagger = h * .16 if columns > 1 and rows == 1 and self.archetype == "diagonal_flow" else 0
        boxes = []
        for i in range(count):
            row, column = divmod(i, columns)
            if self.archetype == "radial" and row % 2:
                column = columns - 1 - column
            u, v = x + w * column, y + h * row
            boxes.append(tuple(map(round, (u, v + stagger * column, u + w - gap,
                                           v + h - gap - stagger * (columns - 1 - column)))))
        return tuple(boxes)


def resolve_layout(archetype, header_slot=None):
    """Căn sân khấu trong vùng dùng được của ô header."""
    layouts = scene_settings()["layouts"]
    if archetype not in layouts:
        raise ValueError(f"Bố cục không hợp lệ: {archetype}")
    x, y, r, b = available_area(header_slot)
    return Layout(archetype, tuple(round(lerp((x, y)[i % 2], (r, b)[i % 2], fraction))
                                   for i, fraction in enumerate(layouts[archetype])))

