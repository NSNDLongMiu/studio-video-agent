"""Sơ đồ xuất hiện theo thời gian, mở rộng cách vẽ rail/partial của T5 và routes của T8."""

import math
from dataclasses import dataclass
from functools import lru_cache

from PIL import Image, ImageOps

from .components import _card, _record_component, icon
from .core import CONTENT, Canvas, clamp, ease_in_out, lerp, progress
from .text import draw_text, fit_text


@dataclass(frozen=True)
class _Route:
    points: tuple
    lengths: tuple
    length: float

    def trace(self, fraction):
        """Trả phần đường đã đi và hướng cuối, tính theo chiều dài thật của đường."""
        remains = clamp(fraction) * self.length
        points = [self.points[0]]
        direction = (1, 0)
        for a, b, length in zip(self.points, self.points[1:], self.lengths):
            direction = ((b[0] - a[0]) / length, (b[1] - a[1]) / length)
            p = min(1, remains / length)
            points.append(tuple(lerp(x, y, p) for x, y in zip(a, b)))
            if remains <= length:
                break
            remains -= length
        return points, direction


@lru_cache(maxsize=192)
def _route(points):
    distinct = [points[0]]
    for point in points[1:]:
        if point != distinct[-1]:
            distinct.append(point)
    lengths = tuple(math.dist(a, b) for a, b in zip(distinct, distinct[1:]))
    return _Route(tuple(distinct), lengths, sum(lengths))


def _dot(canvas, point, radius, color):
    x, y = point
    canvas.draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=color)


def connection(canvas, a, b, kind="normal", *, t=None, appear_at=0, duration=.45,
               via=(), packets=True, packet_period=.6, color=None, width=8):
    """Vẽ đường từ a đến b qua via. Bỏ t để hiện đường hoàn chỉnh không có gói."""
    p = canvas.palette
    tone = {"normal": p.blue, "blocked": p.amber, "leaking": p.red}[kind]
    if width < 1 or duration < 0 or packet_period <= 0:
        raise ValueError("Chiều rộng và chu kỳ phải dương, thời lượng không âm")
    if t is not None and t < appear_at:
        return ()
    route = _route(tuple(tuple(point) for point in (a, *via, b)))
    reveal = 1 if t is None else ease_in_out(progress(t, appear_at, appear_at + duration))
    stop = .73 if kind == "blocked" else 1
    if reveal == 0 or route.length == 0:
        return ()
    points, (dx, dy) = route.trace(reveal * stop)
    canvas.draw.line(points, fill=p.ink, width=width + 6, joint="curve")
    canvas.draw.line(points, fill=color or tone, width=width, joint="curve")
    x, y = points[-1]
    arrow = min(width * 2.6, route.length * stop * reveal * .55)
    if kind == "blocked" and reveal == 1:
        icon(canvas, "lock", (x, y), max(32, width * 5), color=tone)
    else:
        canvas.draw.polygon([(x, y), (x - arrow * dx - arrow * .55 * dy, y - arrow * dy + arrow * .55 * dx),
                             (x - arrow * dx + arrow * .55 * dy, y - arrow * dy - arrow * .55 * dx)], fill=color or tone)
    if packets and t is not None:
        elapsed = t - appear_at
        travel = packet_period * 3
        for index in range(4):
            age = (elapsed % packet_period + index * packet_period) / travel
            if age * travel > elapsed or age >= reveal:
                continue
            trail, (ux, uy) = route.trace(age * stop)
            at = trail[-1]
            _dot(canvas, at, width * .8, p.text)
            if kind == "leaking" and age >= .46:
                offset = width * (age - .46) * 12
                _dot(canvas, (at[0] - uy * offset, at[1] + ux * offset), width * .58, p.red)
    return tuple(points)


@dataclass(frozen=True)
class Node:
    """Một nút định danh, bbox (x0,y0,x1,y1) và mốc hiện tính từ đầu cảnh."""

    id: str
    bbox: tuple
    label: str = ""
    symbol: str | None = None
    appear_at: float = 0
    accent: str | None = None

    def port(self, toward):
        """Tìm giao của tia từ tâm tới hướng nối với viền nút."""
        x, y, r, b = self.bbox
        cx, cy = (x + r) / 2, (y + b) / 2
        dx, dy = toward[0] - cx, toward[1] - cy
        ratio = max(abs(dx) / ((r - x) / 2), abs(dy) / ((b - y) / 2))
        return (cx + dx / ratio, cy + dy / ratio) if ratio else (cx, cy)


@dataclass(frozen=True)
class Edge:
    """Một cạnh qua các điểm trung gian, có trạng thái và mốc hiện riêng."""

    src: str
    dst: str
    appear_at: float = 0
    kind: str = "normal"
    via: tuple = ()
    duration: float = .45
    packets: bool = True


class FlowDiagram:
    """Ghép nút và cạnh. Một cạnh đợi cả hai nút đầu cuối xuất hiện."""

    def __init__(self, nodes, edges=()):
        self.nodes = tuple(nodes)
        self.edges = tuple(edges)
        lookup = {node.id: node for node in self.nodes}
        if len(lookup) != len(self.nodes) or any(n.bbox[0] >= n.bbox[2] or n.bbox[1] >= n.bbox[3] for n in self.nodes):
            raise ValueError("ID nút phải duy nhất và bbox phải có diện tích dương")
        if any(e.src not in lookup or e.dst not in lookup for e in self.edges):
            raise ValueError("Cạnh phải nối hai ID có trong sơ đồ")
        self._links = tuple((edge, lookup[edge.src], lookup[edge.dst]) for edge in self.edges)

    def render(self, canvas, t):
        """Vẽ sơ đồ tại t, trả (danh sách nút hiện, danh sách cạnh đã bắt đầu)."""
        nodes = tuple(node for node in self.nodes if t >= node.appear_at)
        edges = []
        for edge, src, dst in self._links:
            when = max(edge.appear_at, src.appear_at, dst.appear_at)
            if t < when:
                continue
            x, y, r, b = src.bbox
            u, v, s, k = dst.bbox
            a = src.port(edge.via[0] if edge.via else ((u + s) / 2, (v + k) / 2))
            z = dst.port(edge.via[-1] if edge.via else ((x + r) / 2, (y + b) / 2))
            line = connection(canvas, a, z, edge.kind, t=t, appear_at=when, via=edge.via,
                              duration=edge.duration, packets=edge.packets)
            if line:
                edges.append(edge)
        for node in nodes:
            _card(canvas, node.bbox, node.label, node.symbol, t, node.accent, "flow_node", node.id)
        return nodes, tuple(edges)


def request_stream(src, dst, rate, t, *, canvas=None, appear_at=0, ramp=4, travel=1.15,
                   lanes=3, spread=18, color=None, radius=8):
    """Tính vị trí request bay từ src tới dst, tăng tới rate request/giây trong ramp giây.

    Truyền canvas để vẽ luôn. Số gói đang bay về dài hạn xấp xỉ rate × travel.
    """
    if not all(map(math.isfinite, (rate, ramp, travel, t, appear_at))) or rate < 0 or ramp < 0 or travel <= 0 or lanes < 1:
        raise ValueError("Rate/ramp phải không âm, travel và số làn phải dương")
    elapsed = t - appear_at
    if elapsed < 0 or not rate:
        return ()
    dx, dy = dst[0] - src[0], dst[1] - src[1]
    length = math.hypot(dx, dy)
    if not length:
        return ()

    def emitted(when):
        if when <= 0:
            return 0
        return rate * (when * when / (2 * ramp) if when < ramp else when - ramp / 2)

    points = []
    for index in range(math.floor(emitted(elapsed - travel)) + 1, math.floor(emitted(elapsed)) + 1):
        birth = math.sqrt(2 * ramp * index / rate) if index < rate * ramp / 2 else index / rate + ramp / 2
        p = clamp((elapsed - birth) / travel)
        offset = ((index % lanes) - (lanes - 1) / 2) * spread * math.sin(math.pi * p)
        at = src[0] + p * dx - dy / length * offset, src[1] + p * dy + dx / length * offset
        points.append(at)
        if canvas is not None:
            _dot(canvas, at, radius, color or canvas.palette.blue)
    return tuple(points)


def timeline_steps(canvas, steps, t, *, bbox=CONTENT, interval=.65, objects=None):
    """Vẽ các mốc dọc nối nhau. Mỗi bước là nhãn hoặc cặp (nhãn, giây xuất hiện)."""
    steps = tuple(steps)
    x, y, r, b = bbox
    row = (b - y) / max(1, len(steps))
    cx = x + 24
    p = canvas.palette
    if objects is not None and len(objects) != len(steps):
        raise ValueError("Mỗi bước cần một biểu tượng")
    shown = []
    for i, step in enumerate(steps):
        label, at = (step, i * interval) if isinstance(step, str) else step
        if t < at:
            continue
        cy = y + (i + .5) * row
        if shown:
            connection(canvas, (cx, shown[-1]), (cx, cy), t=t, appear_at=at, packets=False, width=5)
        _dot(canvas, (cx, cy), 13, p.blue)
        dot = (cx - 13, cy - 13, cx + 14, cy + 14)
        _record_component(canvas, "flow_node", dot)
        key = None if objects is None else f"step-{i}"
        target = None if objects is None else icon(
            canvas, objects[i], (x + 94, cy), min(76, row * .72), id=key, color=p.blue)
        left = x + (61 if objects is None else 145)
        box = (left, cy - row * .43, r, cy + row * .43)
        fitted = fit_text(label, box, 60, 56, weight="bold")
        draw_text(canvas, fitted.text, (left, cy), fitted.px, "bold", "lm",
                  attach_to=key, target_bbox=target)
        shown.append(cy)
    return len(shown)


def comparison(left, right, divider_t=.5, *, t=0, bbox=CONTENT, canvas=None):
    """Ghép hai ảnh cạnh nhau. divider_t là tỉ lệ hoặc hàm t → tỉ lệ vị trí vách."""
    canvas = Canvas() if canvas is None else canvas
    x, y, r, b = map(round, bbox)
    divider = round(lerp(x, r, clamp(divider_t(t) if callable(divider_t) else divider_t)))
    for source, l, u in ((left, x, divider - 8), (right, divider + 8, r)):
        if u <= l:
            continue
        image = source.image if isinstance(source, Canvas) else source
        thumbnail = ImageOps.contain(image.convert("RGBA"), (u - l, b - y), Image.Resampling.LANCZOS)
        xy = l + (u - l - thumbnail.width) // 2, y + (b - y - thumbnail.height) // 2
        canvas.composite(thumbnail, xy)
        if canvas.recorder is not None and isinstance(source, Canvas):
            canvas._record_layer(source, xy, (thumbnail.width / image.width, thumbnail.height / image.height))
    if x < divider < r:
        canvas.draw.line((divider, y, divider, b), fill=canvas.palette.edge, width=4)
    return canvas.image
