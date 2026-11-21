"""Panel, khay, con trỏ và biểu tượng, phát triển từ Art của T8 và gauge của T5."""

import math
from functools import lru_cache

from PIL import Image, ImageDraw

from .core import blend, clamp, progress, rgba
from .text import draw_text, fit_text

ICONS = (
    "user", "server", "database", "lock", "key", "chat", "cloud", "warning",
    "check", "cross", "gear", "puzzle", "document", "clock", "globe", "shield", "extension",
)


def _center(bounds):
    x, y, r, b = bounds
    return (x + r) / 2, (y + b) / 2


def _title(canvas, value, box, px=56, color=None, *, attach_to=None, target_bbox=None):
    if value and box[2] - box[0] >= 1 and box[3] - box[1] >= 1:
        layout = fit_text(value, box, px, min(56, px), weight="bold")
        return draw_text(canvas, layout.text, _center(box), layout.px, "bold", "mm", color,
                         attach_to=attach_to, target_bbox=target_bbox)
    return None


def _panel(canvas, bbox, fill, accent, radius, name, id):
    x, y, r, b = bbox
    p = canvas.palette
    canvas.draw.rounded_rectangle((x + 3, y + 9, r + 3, b + 9), radius, fill=p.ink)
    canvas.draw.rounded_rectangle(bbox, radius, fill=fill or p.panel, outline=accent or p.edge, width=3)
    _record_component(canvas, name, (x, y, r + 4, b + 10), id=id)


def _record_component(canvas, name, bbox, *, id=None, role="content"):
    fields = {} if id is None else {"id": id}
    canvas.record("component", name=name, role=role, bbox=bbox, **fields)


def panel(canvas, bbox, *, title=None, t=0, fill=None, accent=None, radius=32, id=None):
    """Vẽ mặt panel có chân đế và viền, trả bbox. Thành phần tĩnh tại mọi t."""
    x, y, r, b = bbox
    _panel(canvas, bbox, fill, accent, radius, "panel", id)
    _title(canvas, title, (x + 16, y + 8, r - 16, min(y + 91, b - 8)),
           attach_to=id, target_bbox=bbox)
    return bbox


def window(canvas, bbox, *, title=None, t=0, toolbar=91, accent=None, id=None):
    """Vẽ cửa sổ và thanh điều khiển, trả bbox vùng chứa nội dung."""
    x, y, r, b = bbox
    p = canvas.palette
    _panel(canvas, bbox, None, accent, 32, "window", id)
    rail = min(y + toolbar, b - 6)
    canvas.draw.rounded_rectangle((x + 5, y + 5, r - 5, rail), 26, fill=p.card)
    cy = (y + 5 + rail) / 2
    for i in range(3):
        cx = x + 24 + i * 18
        if cx + 5 < r - 5:
            canvas.draw.ellipse((cx - 5, cy - 5, cx + 5, cy + 5), fill=p.muted)
    _title(canvas, title, (x + 85, y + 8, r - 12, rail - 5), attach_to=id, target_bbox=bbox)
    return x + 12, rail + 6, r - 12, b - 12


def card(canvas, bbox, *, title=None, symbol=None, t=0, accent=None, id=None):
    """Vẽ thẻ đựng một biểu tượng hoặc nhãn. Truyền cả hai để ghép theo chiều dọc."""
    _card(canvas, bbox, title, symbol, t, accent, "card", id)
    return bbox


def _card(canvas, bbox, title, symbol, t, accent, name, id):
    x, y, r, b = bbox
    _panel(canvas, bbox, canvas.palette.card, accent, 25, name, id)
    if symbol:
        cx, cy = _center(bbox)
        if title:
            cy = y + (b - y) * .36
        side = max(1, round(min((r - x) * .65, (b - y) * (.48 if title else .75))))
        icon(canvas, symbol, (cx, cy), side, t=t, color=accent)
    if title:
        top = y + (b - y) * .62 if symbol else y + 8
        _title(canvas, title, (x + 12, top, r - 12, b - 8), attach_to=id, target_bbox=bbox)


@lru_cache(maxsize=96)
def _icon_image(name, size, color):
    # Dựng hình học trong hệ tọa độ 100×100 rồi giảm mẫu để làm mịn cạnh.
    scale = max(2, math.ceil(size / 55))
    image = Image.new("RGBA", (100 * scale, 100 * scale))
    d = ImageDraw.Draw(image)

    def box(bounds):
        return tuple(round(value * scale) for value in bounds)

    def pts(points):
        return [box(point) for point in points]

    def line(points, width=6):
        d.line(pts(points), fill=color, width=width * scale, joint="curve")

    def oval(bounds, solid=False, width=5):
        d.ellipse(box(bounds), fill=color if solid else None, outline=color, width=width * scale)

    def rect(bounds, radius=8, solid=False):
        d.rounded_rectangle(box(bounds), radius * scale, fill=color if solid else None,
                            outline=color, width=5 * scale)

    def arc(bounds, start, end, width=5):
        d.arc(box(bounds), start, end, fill=color, width=width * scale)

    match name:
        case "user":
            oval((33, 13, 67, 47), True)
            rect((19, 55, 81, 87), 16, True)
        case "server":
            for y in (16, 40, 64):
                rect((12, y, 88, y + 20), 6)
                oval((21, y + 7, 27, y + 13), True)
                line(((61, y + 10), (77, y + 10)), 3)
        case "database":
            oval((13, 12, 87, 39))
            line(((15, 25), (15, 75)), 5)
            line(((85, 25), (85, 75)), 5)
            for y in (37, 50, 62):
                arc((13, y, 87, y + 27), 0, 180)
        case "lock":
            arc((28, 12, 72, 62), 180, 360, 6)
            line(((31, 37), (31, 48)), 6)
            line(((69, 37), (69, 48)), 6)
            rect((19, 43, 81, 88), 9)
            oval((45, 55, 55, 65), True)
            line(((50, 63), (50, 75)), 5)
        case "key":
            oval((13, 14, 54, 55), width=7)
            line(((45, 46), (82, 83), (89, 76)), 8)
            line(((69, 70), (79, 60)), 7)
        case "chat":
            rect((11, 16, 89, 70), 15)
            line(((26, 68), (26, 83), (46, 68)), 5)
            for x in (31, 50, 69):
                oval((x - 4, 38, x + 4, 46), True)
        case "cloud":
            arc((10, 45, 55, 82), 90, 260, 6)
            arc((26, 18, 77, 74), 190, 345, 6)
            arc((56, 43, 90, 82), 260, 90, 6)
            line(((32, 79), (73, 79)), 6)
        case "warning":
            line(((50, 12), (91, 84), (9, 84), (50, 12)), 6)
            line(((50, 37), (50, 59)), 7)
            oval((46, 66, 54, 74), True)
        case "check":
            line(((15, 52), (39, 75), (85, 25)), 10)
        case "cross":
            line(((22, 22), (78, 78)), 9)
            line(((22, 78), (78, 22)), 9)
        case "gear":
            oval((23, 23, 77, 77), width=10)
            oval((43, 43, 57, 57), True)
            for i in range(8):
                u, v = math.cos(i * math.tau / 8), math.sin(i * math.tau / 8)
                line(((50 + u * 25, 50 + v * 25), (50 + u * 39, 50 + v * 39)), 11)
        case "puzzle" | "extension":
            rect((13, 35, 70, 88), 10, True)
            oval((31, 18, 56, 47), True)
            oval((59, 49, 86, 74), True)
            if name == "extension":
                line(((75, 16), (87, 16), (87, 28)), 5)
        case "document":
            line(((23, 12), (61, 12), (79, 30), (79, 88), (23, 88), (23, 12)), 5)
            line(((60, 13), (60, 31), (77, 31)), 5)
            for y in (46, 59, 72):
                line(((34, y), (67, y)), 4)
        case "clock":
            oval((11, 11, 89, 89), width=6)
            line(((50, 24), (50, 50), (66, 61)), 6)
        case "globe":
            oval((11, 11, 89, 89))
            oval((34, 11, 66, 89), width=4)
            line(((13, 50), (87, 50)), 4)
            line(((18, 32), (82, 32)), 3)
            line(((18, 68), (82, 68)), 3)
        case "shield":
            line(((50, 12), (81, 25), (77, 61), (65, 78), (50, 89), (35, 78),
                  (23, 61), (19, 25), (50, 12)), 6)
            line(((34, 51), (45, 62), (66, 40)), 6)
        case _:
            raise ValueError(f"Không có biểu tượng {name!r}")
    return image.resize((size, size), Image.Resampling.LANCZOS)


def icon(canvas, name, xy, size=96, *, t=0, color=None, id=None, role="content"):
    """Vẽ biểu tượng tại tâm xy, tra tên trong ICONS và trả bbox đã ghép."""
    size = round(size)
    if size < 1:
        raise ValueError("Kích thước biểu tượng phải dương")
    image = _icon_image(name, size, rgba(color or canvas.palette.text))
    x, y = (round(p - size / 2) for p in xy)
    canvas.composite(image, (x, y))
    if canvas.recorder is not None and (ink := image.getbbox()) is not None:
        _record_component(canvas, "icon", (x + ink[0], y + ink[1], x + ink[2], y + ink[3]), id=id, role=role)
    return x, y, x + size, y + size


def _state_color(canvas, state):
    return {"ok": canvas.palette.green, "warn": canvas.palette.amber, "bad": canvas.palette.red}[state]


def status_indicator(canvas, bbox, kind="led", level=1, state="ok", *, t=0, id=None):
    """Vẽ LED, thanh mức hoặc đồng hồ cung theo mức 0–1. Đỏ có xung nhẹ ở LED."""
    color = _state_color(canvas, state)
    p = canvas.palette
    x, y, r, b = bbox
    cx, cy = _center(bbox)
    level = clamp(level)
    if kind == "led":
        radius = min(r - x, b - y) / 2
        ink = (cx - radius, cy - radius, cx + radius + 1, cy + radius + 1)
        canvas.draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=p.ink, outline=p.edge, width=2)
        pulse = .88 + .12 * math.sin(t * math.tau * 1.6) if state == "bad" else 1
        radius *= .66
        canvas.draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=blend(p.edge, color, level * pulse))
    elif kind == "bar":
        ink = (x, y, r + 1, b + 1)
        canvas.draw.rounded_rectangle(bbox, (b - y) / 2, fill=p.ink, outline=p.edge, width=2)
        thickness = b - y - 8
        width = (r - x - 8) * level
        if thickness > 0 and width >= 1:
            canvas.draw.rounded_rectangle((x + 4, y + 4, x + 4 + width, b - 4),
                                          min(thickness, width) / 2, fill=color)
    elif kind == "gauge":
        radius = min((r - x) / 2, b - y - 4)
        if radius < 2:
            return bbox
        width = min(12, max(1, round(radius / 8)))
        arc_box = (cx - radius, y, cx + radius, y + 2 * radius)
        canvas.draw.arc(arc_box, 180, 360, fill=p.edge, width=width)
        if level:
            canvas.draw.arc(arc_box, 180, 180 + 180 * level, fill=color, width=width)
        ink = (cx - radius, y, cx + radius + 1, y + radius + 1)
    else:
        raise ValueError("Kind phải là led, bar hoặc gauge")
    _record_component(canvas, "status", ink, id=id)
    return bbox


def badge(canvas, bbox, text, *, state=None, t=0, px=56, id=None):
    """Vẽ một nhãn trạng thái nổi trên nền thẻ."""
    x, y, r, b = bbox
    color = _state_color(canvas, state) if state else canvas.palette.blue
    canvas.draw.rounded_rectangle(bbox, (b - y) / 2, fill=canvas.palette.card, outline=color, width=2)
    _title(canvas, text, (x + 14, y + 4, r - 14, b - 4), px, color, attach_to=id, target_bbox=bbox)
    _record_component(canvas, "badge", (x, y, r + 1, b + 1), id=id)
    return bbox


def cursor(canvas, xy, t=0, *, click_at=None, size=60, id=None):
    """Vẽ con trỏ T8 và vòng lan ra trong 0,45 s sau thời điểm nhấp."""
    x, y = xy
    p = canvas.palette
    ink = (x, y, x + .8 * size + 1, y + .93 * size + 1)
    if click_at is not None and click_at <= t < click_at + .45:
        amount = progress(t, click_at, click_at + .45)
        radius = (12 + 26 * amount) * size / 60
        overlay = canvas.layer((2 * math.ceil(radius) + 1,) * 2)
        edge = overlay.image.width - 1
        overlay.draw.ellipse((0, 0, edge, edge), outline=(*rgba(p.amber)[:3], round(255 * (1 - amount))), width=5)
        ox, oy = round(x - edge / 2), round(y - edge / 2)
        canvas.composite(overlay, (ox, oy))
        if round(255 * (1 - amount)):
            ink = (min(ink[0], ox), min(ink[1], oy), max(ink[2], ox + edge + 1), max(ink[3], oy + edge + 1))
    points = [(x + size * dx, y + size * dy) for dx, dy in
              ((0, 0), (.18, .93), (.38, .65), (.62, .84), (.74, .70), (.50, .48), (.80, .39))]
    canvas.draw.polygon(points, fill=p.text, outline=p.ink, width=max(1, round(size / 18)))
    _record_component(canvas, "cursor", ink, id=id)
    return x, y, x + .8 * size, y + .93 * size


def slot(canvas, bbox, *, t=0, active=False, id=None):
    """Vẽ một hộc lõm, viền lam khi được chọn."""
    p = canvas.palette
    canvas.draw.rounded_rectangle(bbox, 14, fill=p.ink, outline=p.blue if active else p.edge, width=3)
    x, y, r, b = bbox
    _record_component(canvas, "slot", (x, y, r + 1, b + 1), id=id)
    return bbox


def tray(canvas, bbox, slots=1, *, t=0, selected=None, id=None):
    """Vẽ khay T8 với số hộc tùy chọn, trả các bbox hộc từ trái sang phải."""
    x, y, r, b = bbox
    if slots < 1 or x >= r or y >= b:
        raise ValueError("Khay cần ít nhất một hộc và kích thước dương")
    _panel(canvas, bbox, canvas.palette.card, None, 29, "tray", id)
    gap = min(15, (r - x) / (3 * slots + 1), (b - y) / 4)
    width = (r - x - gap * (slots + 1)) / slots
    return tuple(slot(canvas, (x + gap + i * (width + gap), y + gap,
                               x + (i + 1) * (width + gap), b - 2 * gap), t=t, active=i == selected)
                 for i in range(slots))


def sticker(canvas, image_or_path, bbox, role="mascot", *, id=None):
    """Đặt ảnh RGBA vừa bbox, giữ tỷ lệ. Trả bbox thực của phần có hình."""
    x, y, r, b = map(round, bbox)
    if x >= r or y >= b:
        raise ValueError("Hộp ảnh rời phải có kích thước dương")
    if isinstance(image_or_path, Image.Image):
        image = image_or_path.convert("RGBA")
    else:
        with Image.open(image_or_path) as source:
            image = source.convert("RGBA")
    ratio = min((r - x) / image.width, (b - y) / image.height)
    size = tuple(max(1, round(d * ratio)) for d in image.size)
    image = image.resize(size, Image.Resampling.LANCZOS)
    x += (r - x - image.width) // 2
    y += (b - y - image.height) // 2
    canvas.composite(image, (x, y))
    if (ink := image.getbbox()) is not None:
        box = (x + ink[0], y + ink[1], x + ink[2], y + ink[3])
        _record_component(canvas, "sticker", box, id=id, role=role)
        return box
    return None
