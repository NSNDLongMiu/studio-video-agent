"""Biểu đồ và số đếm có tiến độ theo giây, dùng chung bộ máy chữ."""

import math

from .components import _record_component
from .core import CONTENT, ease_out_cubic, lerp, progress
from .flow import _route
from .text import draw_text, fit_text


def _limits(values, domain):
    if not values or any(not math.isfinite(value) for value in values):
        raise ValueError("Biểu đồ cần ít nhất một giá trị hữu hạn")
    low, high = domain or (min(0, min(values)), max(0, max(values)))
    if low == high == 0 and domain is None:
        return 0, 1
    if not math.isfinite(low) or not math.isfinite(high) or low >= high or min(values) < low or max(values) > high:
        raise ValueError("Miền giá trị phải tăng và chứa mọi điểm dữ liệu")
    return low, high


def _axes(canvas, bbox, values, labels, domain):
    x, y, r, b = bbox
    low, high = _limits(values, domain)
    bottom = b - (92 if labels is not None else 4)
    if x + 8 >= r or y + 8 >= bottom or (labels is not None and len(labels) != len(values)):
        raise ValueError("Hộp biểu đồ quá nhỏ hoặc số nhãn không khớp số giá trị")

    def at(value):
        return lerp(bottom - 4, y + 4, (value - low) / (high - low))

    for fraction in (0, .25, .5, .75, 1):
        yy = at(lerp(low, high, fraction))
        canvas.draw.line((x, yy, r, yy), fill=canvas.palette.edge, width=2)
    zero = at(max(low, min(high, 0)))
    canvas.draw.line((x, zero, r, zero), fill=canvas.palette.muted, width=3)
    return at, zero, bottom


def _labels(canvas, labels, x, y, r, b, id, bbox):
    if labels is None:
        return
    each = (r - x) / len(labels)
    for i, label in enumerate(labels):
        left = x + i * each
        box = (left + 2, y + 7, left + each - 2, b)
        fitted = fit_text(str(label), box, 56, 56, weight="semibold")
        draw_text(canvas, fitted.text, (left + each / 2, y + 7), fitted.px, "semibold", "mt",
                  attach_to=id, target_bbox=bbox)


def bar_chart(canvas, values, t, *, bbox=CONTENT, labels=None, appear=0, duration=.7,
              stagger=.12, domain=None, color=None, id=None):
    """Vẽ cột lần lượt mọc từ đường cơ sở. Trả bbox của các cột đã hiện."""
    values = tuple(values)
    if t < appear:
        return ()
    x, _, r, b = bbox
    at, zero, bottom = _axes(canvas, bbox, values, labels, domain)
    each = (r - x) / len(values)
    tone = color or canvas.palette.blue
    bars = []
    for i, value in enumerate(values):
        start = appear + stagger * i
        amount = ease_out_cubic(progress(t, start, start + duration))
        tip = lerp(zero, at(value), amount)
        if abs(tip - zero) >= 1:
            box = (x + (i + .18) * each, min(zero, tip), x + (i + .82) * each, max(zero, tip))
            canvas.draw.rounded_rectangle(box, min(14, abs(zero - tip) / 2, each * .12), fill=tone)
            bars.append(box)
    _labels(canvas, labels, x, bottom, r, b, id, bbox)
    _record_component(canvas, "chart", (x, bbox[1], r + 1, b if labels is not None else bottom), id=id)
    return tuple(bars)


def line_chart(canvas, values, t, *, bbox=CONTENT, labels=None, appear=0, duration=1,
               domain=None, color=None, id=None):
    """Dựng đường biểu diễn theo thứ tự thời gian của dãy giá trị, trả đường đã hiện."""
    values = tuple(values)
    if t < appear:
        return ()
    x, _, r, b = bbox
    at, _, bottom = _axes(canvas, bbox, values, labels, domain)
    points = tuple((x + (r - x) * (i + .5) / len(values), at(value)) for i, value in enumerate(values))
    amount = progress(t, appear, appear + duration)
    position = amount * (len(points) - 1)
    index = int(position)
    visible = list(points[:index + 1])
    if index < len(points) - 1:
        route = _route(points[index:index + 2])
        visible.append(route.trace(position - index)[0][-1])
    tone = color or canvas.palette.blue
    if len(visible) > 1:
        canvas.draw.line(visible, fill=tone, width=7, joint="curve")
    for px, py in points[:index + 1]:
        canvas.draw.ellipse((px - 7, py - 7, px + 7, py + 7), fill=tone)
    _labels(canvas, labels, x, bottom, r, b, id, bbox)
    _record_component(canvas, "chart", (x, bbox[1] - 3, r + 1, b if labels is not None else bottom + 4), id=id)
    return tuple(visible)


def counter(canvas, start, end, xy, t, *, appear=0, duration=1, px=76, color=None,
            formatter="{:.0f}", anchor="mm", attach_to=None, target_bbox=None):
    """Đếm tăng hoặc giảm. Formatter là mẫu format hoặc hàm nhận số, trả giá trị tại t."""
    value = lerp(start, end, ease_out_cubic(progress(t, appear, appear + duration)))
    if t >= appear:
        text = formatter(value) if callable(formatter) else formatter.format(value)
        draw_text(canvas, text, xy, px, "bold", anchor, color, role="number",
                  attach_to=attach_to, target_bbox=target_bbox)
    return value
