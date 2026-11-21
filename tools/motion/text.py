"""Đo, ngắt và vẽ chữ Unicode qua một bộ máy Pillow dùng chung."""

import math
import unicodedata
import warnings
from functools import lru_cache
from typing import NamedTuple

from .core import CONTENT, font, rgba


class FittedText(NamedTuple):
    """Chữ đã xuống dòng, cỡ px và hộp mực tương đối với góc trên trái."""

    text: str
    px: int
    bbox: tuple


def _clusters(text):
    clusters = []
    for char in text:
        if clusters and unicodedata.category(char).startswith("M"):
            clusters[-1] += char
        else:
            clusters.append(char)
    return clusters


def _outline(outline, default):
    return outline if isinstance(outline, tuple) else (outline or 0, default)


@lru_cache(maxsize=1024)
def _layout(text, px, weight, stroke, horizontal):
    face = font(px, weight)
    ascent, descent = face.getmetrics()
    advance = ascent + descent + round(px * .05)
    rows = []
    boxes = []
    segments = unicodedata.normalize("NFC", text).split("\n")
    for i, segment in enumerate(segments):
        if not segment.strip():
            continue
        x0, y0, x1, y1 = face.getbbox(segment, anchor="ls", stroke_width=stroke)
        x = {"l": -x0, "m": -((x0 + x1) // 2), "r": -x1}[horizontal]
        y = i * advance
        rows.append((x, y, segment))
        boxes.append((x + x0, y + y0, x + x1, y + y1))
    if not rows:
        return (), (0, 0, 0, 0)
    x0, y0, x1, y1 = zip(*boxes)
    return tuple(rows), (min(x0), min(y0), max(x1), max(y1))


def _position(text, px, weight, stroke, anchor):
    if len(anchor) != 2 or anchor[0] not in "lmr" or anchor[1] not in "atmsbd":
        raise ValueError("Anchor gồm l/m/r và a/t/m/s/b/d, ví dụ lt hoặc mm")
    rows, (x0, y0, x1, y1) = _layout(text, px, weight, stroke, anchor[0])
    if not rows:
        return rows, (0, 0, 0, 0), 0
    ascent, descent = font(px, weight).getmetrics()
    dy = {"a": ascent, "t": -y0, "m": -((y0 + y1) // 2), "s": 0,
          "b": -y1, "d": -descent}[anchor[1]]
    return rows, (x0, y0 + dy, x1, y1 + dy), dy


def measure(text, px=56, weight="regular", anchor="lt", outline=0):
    """Trả bbox mực tương đối với điểm neo, tính cả nét viền và dấu tiếng Việt."""
    stroke, _ = _outline(outline, None)
    return _position(text, px, weight, stroke, anchor)[1]


def draw_text(canvas, text, xy, px=56, weight="regular", anchor="lt", color=None, outline=0, *,
              role="label", attach_to=None, target_bbox=None, effect="none"):
    """Vẽ chữ và trả bbox mực trên khung. Outline là số px hoặc (số px, màu)."""
    x, y = map(round, xy)
    stroke, stroke_fill = _outline(outline, canvas.palette.ink)
    rows, box, dy = _position(text, px, weight, stroke, anchor)
    face = font(px, weight)
    fill = canvas.palette.text if color is None else color
    for dx, baseline, segment in rows:
        canvas.draw.text((x + dx, y + baseline + dy), segment, font=face, anchor="ls",
                         fill=fill,
                         stroke_width=stroke, stroke_fill=stroke_fill)
    bbox = x + box[0], y + box[1], x + box[2], y + box[3]
    if canvas.recorder is not None and rows and (rgba(fill)[3] or (stroke and rgba(stroke_fill)[3])):
        fields = {} if target_bbox is None else {"target_bbox": tuple(target_bbox)}
        canvas.record("text", text=" ".join(unicodedata.normalize("NFC", text).split()), bbox=bbox, px=px,
                      role=role, attach_to=attach_to, effect=effect, **fields)
    return bbox


def _wrap(text, fits, *, split_long=True):
    lines = []
    for paragraph in text.split("\n"):
        line = ""
        for word in paragraph.split():
            candidate = f"{line} {word}" if line else word
            if fits(candidate):
                line = candidate
                continue
            if line:
                lines.append(line)
            line = ""
            if fits(word):
                line = word
                continue
            if not split_long:
                return None
            for cluster in _clusters(word):
                if not fits(cluster):
                    return None
                if line and not fits(line + cluster):
                    lines.append(line)
                    line = ""
                line += cluster
        lines.append(line)
    return lines


@lru_cache(maxsize=384)
def _fit(text, width, height, max_px, weight, stroke):
    def at(px, split_long):
        def fits(line):
            x0, _, x1, _ = font(px, weight).getbbox(line, stroke_width=stroke)
            return x1 - x0 <= width

        lines = _wrap(text, fits, split_long=split_long)
        if lines is None:
            return None
        wrapped = "\n".join(lines)
        bbox = measure(wrapped, px, weight, outline=stroke)
        if bbox[2] <= width and bbox[3] <= height:
            return FittedText(wrapped, px, bbox)
        return None

    for split_long in (False, True):
        best = None
        lo, hi = 1, max_px
        while lo <= hi:
            px = (lo + hi) // 2
            fitted = at(px, split_long)
            if fitted is None:
                hi = px - 1
            else:
                best = fitted
                lo = px + 1
        if best is not None:
            return best
    return None


def _warn_size(fitted, min_px):
    if fitted.px < min_px:
        warnings.warn(f"Chữ phải thu xuống {fitted.px} px, dưới mức {min_px} px", stacklevel=3)


def fit_text(text, box, max_px=72, min_px=56, *, weight="regular", outline=0):
    """Thu cỡ và ngắt theo từ trong bbox (x0,y0,x1,y1). Báo lỗi nếu 1 px vẫn không vừa."""
    x0, y0, x1, y1 = box
    width, height = math.floor(x1) - math.ceil(x0), math.floor(y1) - math.ceil(y0)
    if min(width, height, min_px) <= 0 or max_px < min_px:
        raise ValueError("Hộp chữ phải dương và max_px phải từ min_px trở lên")
    stroke, _ = _outline(outline, None)
    fitted = _fit(unicodedata.normalize("NFC", text), width, height, max_px, weight, stroke)
    if fitted is None:
        raise ValueError("Không thể đặt toàn bộ chữ trong hộp, kể cả ở cỡ 1 px")
    _warn_size(fitted, min_px)
    return fitted


def _free_rectangles(region, obstacles):
    l, u, r, b = region
    if l >= r or u >= b:
        return
    xs = sorted({l, r, *(x for item in obstacles for x in (item[0], item[2]) if l < x < r)})
    for i, a in enumerate(xs[:-1]):
        for c in xs[i + 1:]:
            occupied = sorted((max(u, y0), min(b, y1)) for x0, y0, x1, y1 in obstacles
                              if x0 < c and a < x1 and y0 < b and u < y1)
            top = u
            for start, end in occupied:
                if top < start:
                    yield a, top, c, start
                top = max(top, end)
            if top < b:
                yield a, top, c, b


def attach_label(canvas, target_bbox, text, side="auto", gap=24, avoid=(), *,
                 bounds=CONTENT, min_px=56, max_px=60, color=None, role="label", attach_to=None,
                 effect="none"):
    """Đặt nhãn cách viền khung ≥ 24 px và tránh các bbox. Trả None nếu hết chỗ."""
    sides = ("right", "left", "above", "below", "inside")
    if side != "auto" and side not in sides:
        raise ValueError("Side phải là auto, right, left, above, below hoặc inside")
    if gap < 0 or min_px < 1 or max_px < min_px:
        raise ValueError("Gap phải không âm và cỡ chữ phải hợp lệ")
    if not text.strip():
        return None
    w, h = canvas.image.size
    left, top, right, bottom = (math.ceil(max(24, bounds[0])), math.ceil(max(24, bounds[1])),
                               math.floor(min(w - 24, bounds[2])), math.floor(min(h - 24, bounds[3])))
    x0, y0, x1, y1 = target_bbox
    regions = {
        "right": (max(left, math.ceil(x1 + gap)), top, right, bottom),
        "left": (left, top, min(right, math.floor(x0 - gap)), bottom),
        "above": (left, top, right, min(bottom, math.floor(y0 - gap))),
        "below": (left, max(top, math.ceil(y1 + gap)), right, bottom),
        "inside": (max(left, math.ceil(x0 + gap)), max(top, math.ceil(y0 + gap)),
                   min(right, math.floor(x1 - gap)), min(bottom, math.floor(y1 - gap))),
    }
    obstacles = tuple((math.floor(a), math.floor(b), math.ceil(c), math.ceil(d))
                      for a, b, c, d in avoid if a < c and b < d)
    text = unicodedata.normalize("NFC", text)
    weight = "bold"
    best = None
    for direction in sides if side == "auto" else (side,):
        for a, d, c, e in _free_rectangles(regions[direction], obstacles):
            fitted = _fit(text, c - a, e - d, max_px, weight, 0)
            if fitted is None:
                continue
            tw, th = fitted.bbox[2:]
            center_x, center_y = (x0 + x1 - tw) / 2, (y0 + y1 - th) / 2
            x = {"left": c - tw, "right": a}.get(direction, min(c - tw, max(a, round(center_x))))
            y = {"above": e - th, "below": d}.get(direction, min(e - th, max(d, round(center_y))))
            score = (-fitted.px, abs(x - center_x) + abs(y - center_y), fitted.text.count("\n"))
            if best is None or score < best[0]:
                best = score, fitted, (x, y)
        if best is not None and best[1].px == max_px:
            break
    if best is None:
        return None
    _, fitted, xy = best
    _warn_size(fitted, min_px)
    return draw_text(canvas, fitted.text, xy, fitted.px, weight, color=color, role=role,
                     attach_to=attach_to, target_bbox=target_bbox, effect=effect)
