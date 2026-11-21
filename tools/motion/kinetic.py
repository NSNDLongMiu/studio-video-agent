"""Nhấn từ khóa bằng chuyển động có giới hạn, dựng tại thời điểm bất kỳ."""

import math

from .components import _record_component
from .core import ease_in_out, ease_out_back, ease_out_cubic, progress, rgba
from .text import _clusters, draw_text, measure


def highlight_box(canvas, bbox, t=None, *, appear=0, disappear=None, color=None, width=4):
    """Vẽ viền nhấn hiện dần và, nếu có disappear, mờ đi sau mốc đó."""
    alpha = 1 if t is None else _visibility(t, appear, disappear)
    if alpha <= 0:
        return None
    x0, y0, x1, y1 = (math.floor(bbox[0]), math.floor(bbox[1]), math.ceil(bbox[2]), math.ceil(bbox[3]))
    layer = canvas.layer((x1 - x0, y1 - y0))
    rgb = rgba(color or canvas.palette.blue)[:3]
    layer.draw.rounded_rectangle((0, 0, layer.image.width - 1, layer.image.height - 1), 19,
                                 fill=(*rgb, round(35 * alpha)), outline=(*rgb, round(235 * alpha)), width=width)
    canvas.composite(layer, (x0, y0))
    if round(235 * alpha) or round(35 * alpha):
        _record_component(canvas, "panel", (x0, y0, x1, y1), role="decor")
    return x0, y0, x1, y1


def _visibility(t, appear, disappear):
    show = ease_out_cubic(progress(t, appear, appear + .22))
    hide = 0 if disappear is None else ease_in_out(progress(t, disappear, disappear + .2))
    return show * (1 - hide)


def kinetic_text(canvas, text, xy, t, appear=0, disappear=None, style="pop", px=76, color=None,
                 *, budget=1, index=0, role="label", attach_to=None, target_bbox=None):
    """Vẽ một từ khóa tại tâm xy. Cấp index khác nhau từ 0 cho các hiệu ứng trong cảnh."""
    if style not in ("pop", "slide", "type", "highlight"):
        raise ValueError("Kiểu chữ động phải là pop, slide, type hoặc highlight")
    if budget < 0 or index < 0 or (disappear is not None and disappear < appear):
        raise ValueError("Budget, index và mốc giây của hiệu ứng không hợp lệ")
    if index >= budget or not text.strip():
        return None
    alpha = _visibility(t, appear, disappear)
    if alpha <= 0:
        return None
    phase = progress(t, appear, appear + .42)
    x, y = map(round, xy)
    anchor = "mm"
    if style == "pop":
        px = max(1, round(px * (.82 + .18 * ease_out_back(phase))))
    elif style == "slide":
        y += round(36 * (1 - ease_out_cubic(phase)))
    elif style == "type":
        x += measure(text, px, "bold", "mm")[0]
        clusters = _clusters(text)
        text = "".join(clusters[:math.ceil(phase * len(clusters))])
        anchor = "lm"
    x0, y0, x1, y1 = measure(text, px, "bold", anchor)
    if x0 == x1 or y0 == y1:
        return None
    if style == "highlight":
        highlight_box(canvas, (x + x0 - 18, y + y0 - 12, x + x1 + 18, y + y1 + 12),
                      t, appear=appear, disappear=disappear, color=color)
    layer = canvas.layer((x1 - x0, y1 - y0))
    red, green, blue, opacity = rgba(color or canvas.palette.text)
    # Hộp đích thuộc Canvas cha, vì vậy chỉ nhật ký chữ đi qua phép dời của lớp.
    draw_text(layer, text, (-x0, -y0), px, "bold", anchor, (red, green, blue, round(alpha * opacity)),
              role=role, attach_to=attach_to, effect="kinetic",
              target_bbox=None if target_bbox is None else tuple(
                  value - (x + x0, y + y0)[i % 2] for i, value in enumerate(target_bbox)))
    canvas.composite(layer, (x + x0, y + y0))
    return x + x0, y + y0, x + x1, y + y1
