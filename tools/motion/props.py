"""Đạo cụ Pillow với viền lam/hồng, panel bo góc và chi tiết lấy cảm hứng từ T14."""

import math

from . import components as art
from .core import blend, clamp, lerp, rgba
from .layouts import scene_settings
from .text import _fit, draw_text


def inset(box, fractions):
    return tuple(round(lerp(box[i % 2], box[2 + i % 2], value))
                 for i, value in enumerate(fractions))


def center(box):
    return ((box[0] + box[2]) / 2, (box[1] + box[3]) / 2)


def _tone(canvas, state, strength):
    p = canvas.palette
    base = {"ok": p.green, "warn": p.amber, "bad": p.red, "blocked": p.amber,
            "leaking": p.red}.get(state, p.blue)
    return blend(p.edge, base, strength)


def _contrast(a, b):
    def luminance(color):
        channels = [v / 255 for v in rgba(color)[:3]]
        linear = [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in channels]
        return sum(a * b for a, b in zip(linear, (.2126, .7152, .0722)))
    low, high = sorted((luminance(a), luminance(b)))
    return (high + .05) / (low + .05)


def label(canvas, box, text, *, target, target_bbox, background=None, color=None):
    """Ngắt dòng ở cỡ tối thiểu. Báo lỗi nếu nhãn dài hơn vùng được cấp."""
    if not text or not text.strip():
        return None
    settings = scene_settings()
    px = settings["min_label_px"]
    x, y, r, b = box
    fitted = _fit(text, r - x, b - y, px, "bold", 0)
    if fitted is None or fitted.px < px:
        raise ValueError(f"Nhãn không vừa ở {px} px: {text!r}. Hãy mở rộng ô hoặc rút gọn nhãn.")
    background = background or canvas.palette.ink
    foreground = color or canvas.palette.text
    if _contrast(foreground, background) < settings["min_contrast"]:
        foreground = max(("#FFFFFF", "#000000"), key=lambda tone: _contrast(tone, background))
    if _contrast(foreground, background) < settings["min_contrast"]:
        raise ValueError("Bảng màu không đạt tương phản chữ đã cấu hình")
    return draw_text(canvas, fitted.text, center(box), px, "bold", "mm", color=foreground,
                     attach_to=target, target_bbox=target_bbox)


def _panel(canvas, box, color, fill=None):
    x, y, r, b = box
    canvas.draw.rounded_rectangle(box, min(30, (r - x) * .11, (b - y) * .20),
                                  fill=fill or canvas.palette.panel, outline=color, width=3)


def _record(canvas, name, box, id, parent, cue):
    canvas.record("component", name=name, role="content", bbox=box, id=id, parent=parent)
    if cue is not None and canvas.recorder is not None:
        canvas.recorder.cue(None, cue, "medium", target=id)
    return box


def _lines(canvas, box, color, count=2):
    for index in range(count):
        y = (index + .5) / count
        line = inset(box, (0, y - .07, 1 - .22 * (index % 3), y + .07))
        canvas.draw.rounded_rectangle(line, 3, fill=color)


def chat_bubble(canvas, box, *, state=None, strength=1, id="bubble", parent=None, cue=None, right=False, text=None):
    color = _tone(canvas, state, strength)
    body = inset(box, (0, 0, 1, .86))
    _panel(canvas, body, color, canvas.palette.card)
    tail = (.68, .84, .84) if right else (.16, .32, .16)
    canvas.draw.polygon([(lerp(box[0], box[2], x), y) for x, y in
                         zip(tail, (body[3] - 2, body[3] - 2, box[3]))], fill=color)
    if text:
        label(canvas, inset(body, (.055, .015, .945, .985)), text, target=id, target_bbox=box,
              background=canvas.palette.card)
    else:
        _lines(canvas, inset(body, (.10, .22, .88, .78)), color)
    return _record(canvas, "chat_bubble", box, id, parent, cue)


def browser_window(canvas, box, title=None, state=None, chat_rows=3, *, strength=1, id="browser",
                   parent=None, cue=None, scope=(), compact=False):
    color = _tone(canvas, state, strength)
    p = canvas.palette
    _panel(canvas, box, color)
    bar = inset(box, (.025, .035, .975, .18))
    _panel(canvas, bar, p.edge, p.ink)
    radius = max(2, min(7, (bar[2] - bar[0]) / 45, (bar[3] - bar[1]) / 5))
    for i, tone in enumerate((p.red, p.amber, p.green)):
        x, y = center(inset(bar, (.07 + i * .06, 0, .07 + i * .06, 1)))
        canvas.draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=tone)
    _panel(canvas, inset(bar, (.26, .24, .93, .76)), p.edge, p.card)
    if title:
        label(canvas, inset(box, (.055, .19, .945, .36)), title, target=id, target_bbox=box,
              background=p.panel)
    chat = inset(box, (.07, .38 if title else .23, .52 if compact else .93, .77))
    rows = range(chat_rows) if isinstance(chat_rows, int) else chat_rows
    for i, row in enumerate(rows):
        top, bottom = i / len(rows), (i + .9) / len(rows)
        bounds = inset(chat, (.19 if i % 2 else 0, top, 1 if i % 2 else .83, bottom))
        flagged = i in scope
        chat_bubble(canvas, bounds, state=state if flagged else None, strength=1 if flagged else strength,
                    right=bool(i % 2), id=f"{id}-chat-{i}", parent=id,
                    text=row if isinstance(row, str) else None)
    entry = inset(box, (.07, .82, .93, .94))
    _panel(canvas, entry, color, p.ink)
    _lines(canvas, inset(entry, (.07, .28, .68, .69)), p.edge, 1)
    send = inset(entry, (.81, .2, .94, .8))
    x, y, r, b = send
    canvas.draw.polygon(((x, y), (r, (y + b) / 2), (x, b)), fill=color)
    return _record(canvas, "browser_window", box, id, parent, cue)


def _glyph(canvas, symbol, xy, size, color, parent):
    size = max(1, round(size))
    image = art._icon_image(symbol, size, rgba(color))
    origin = tuple(round(p - size / 2) for p in xy)
    canvas.composite(image, origin)
    if ink := image.getbbox():
        box = tuple(value + origin[i % 2] for i, value in enumerate(ink))
        _record(canvas, "icon", box, f"{parent}-glyph", parent, None)


def extension_icon(canvas, box, *, state=None, strength=1, id="extension", parent=None, cue=None):
    color = _tone(canvas, state, strength)
    _panel(canvas, box, color, canvas.palette.card)
    cx, cy = center(box)
    size = min(box[2] - box[0], box[3] - box[1]) * .81
    _glyph(canvas, "puzzle", (cx, cy), size, color, id)
    ring = [(cx + size * (.23 + math.cos(i * math.pi / 5) * (.17 if i % 2 == 0 else .075)),
             cy + size * (-.24 + math.sin(i * math.pi / 5) * (.17 if i % 2 == 0 else .075)))
            for i in range(10)]
    canvas.draw.polygon(ring, fill=canvas.palette.text)
    return _record(canvas, "extension_icon", box, id, parent, cue)


def server_rack(canvas, box, *, state=None, strength=1, id="server", parent=None, cue=None):
    color = _tone(canvas, state, strength)
    _panel(canvas, box, color)
    for i in range(4):
        row = inset(box, (.10, .10 + i * .21, .90, .25 + i * .21))
        _panel(canvas, row, color, canvas.palette.ink)
        _lines(canvas, inset(row, (.12, .26, .64, .74)), canvas.palette.edge, 2)
        canvas.draw.ellipse(inset(row, (.76, .28, .86, .72)), fill=color)
    return _record(canvas, "server_rack", box, id, parent, cue)


def document_card(canvas, box, *, state=None, strength=1, id="document", parent=None, cue=None,
                  symbol=None):
    color = _tone(canvas, state, strength)
    _panel(canvas, box, color, canvas.palette.card)
    x, y, r, b = inset(box, (.12, .08, .88, .92))
    fold = min(r - x, b - y) * .24
    canvas.draw.polygon(((x, y), (r - fold, y), (r, y + fold), (r, b), (x, b)),
                        outline=color, fill=canvas.palette.ink, width=3)
    canvas.draw.line((r - fold, y, r - fold, y + fold, r, y + fold), fill=color, width=3)
    inner = (x, y, r, b)
    if symbol in art.ICONS and symbol != "document":
        glyph = inset(inner, (.25, .11, .75, .63))
        _glyph(canvas, symbol, center(glyph), min(glyph[2] - glyph[0], glyph[3] - glyph[1]), color, id)
    _lines(canvas, inset(inner, (.15, .65 if symbol else .23, .86, .90)), color, 2 if symbol else 4)
    return _record(canvas, "document_card", box, id, parent, cue)


def permission_dialog(canvas, box, title, *, state=None, strength=1, id="permission", parent=None,
                      cue=None):
    color = _tone(canvas, state, strength)
    _panel(canvas, box, color, canvas.palette.ink)
    _lines(canvas, inset(box, (.14, .57, .85, .72)), color, 2)
    for a, b in ((.12, .44), (.54, .88)):
        _panel(canvas, inset(box, (a, .77, b, .92)), color, canvas.palette.card)
    label(canvas, inset(box, (.045, .045, .955, .56)), title, target=id, target_bbox=box)
    return _record(canvas, "permission_dialog", box, id, parent, cue)


def packet(canvas, box, *, state=None, strength=1, id="packet", parent=None, cue=None):
    color = _tone(canvas, state, strength)
    _panel(canvas, box, color, canvas.palette.ink)
    x, y, r, b = inset(box, (.13, .24, .87, .73))
    canvas.draw.line((x, y, (x + r) / 2, b, r, y), fill=color, width=3)
    return _record(canvas, "packet", box, id, parent, cue)


def badge(canvas, box, text, *, state=None, strength=1, id="badge", parent=None, cue=None):
    color = _tone(canvas, state, strength)
    _panel(canvas, box, color, canvas.palette.ink)
    label(canvas, inset(box, (.045, .035, .955, .965)), text, target=id, target_bbox=box)
    return _record(canvas, "badge", box, id, parent, cue)

