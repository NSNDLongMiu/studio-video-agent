"""Nền vẽ độc lập theo ngữ cảnh, dùng đường nét tối để giữ tiêu điểm."""

from functools import lru_cache

from PIL import Image, ImageDraw

from .core import blend


_THEMES = {
    "office": ("#101A2D", "#253B51", "#17273B"),
    "server": ("#0E1929", "#213C53", "#15283A"),
    "warning": ("#22182B", "#472B42", "#2E2035"),
    "neutral": ("#101D30", "#233750", "#17273D"),
}


def suggest_backdrop(scene_role=None, intent=None):
    """Chọn một nền theo ý định trước, rồi theo vai trò cảnh."""
    for hint in (intent, scene_role):
        if hint in {"warning", "incident", "alert", "risk", "impact_risk", "consequence"}:
            return "warning"
        if hint in {"data_flow", "infrastructure", "server"}:
            return "server"
        if hint in {"hook", "ui_simulation", "character_explanation", "office"}:
            return "office"
    return "neutral"


@lru_cache(maxsize=16)
def _plate(name, size):
    base, light, shape = _THEMES[name]
    w, h = size
    vignette = Image.radial_gradient("L").resize(size, Image.Resampling.BILINEAR)
    image = Image.composite(Image.new("RGBA", size, base), Image.new("RGBA", size, light), vignette)
    draw = ImageDraw.Draw(image)
    def box(x, y, r, b):
        return (x * w, y * h, r * w, b * h)

    edge = blend(base, light, .68)
    if name == "server":
        for x in (.04, .34, .65):
            draw.rounded_rectangle(box(x, .13, x + .27, .76), w * .018, fill=shape, outline=edge)
            for y in (.22, .32, .42, .52, .62):
                draw.rounded_rectangle(box(x + .02, y, x + .25, y + .04), w * .006, outline=edge)
                for slot in (.037, .063):
                    draw.ellipse(box(x + slot, y + .017, x + slot + .007, y + .021), fill=edge)
                draw.line(box(x + .12, y + .019, x + .23, y + .019), fill=edge)
    else:
        for x in (.07, .39, .71):
            draw.rounded_rectangle(box(x, .14, x + .22, .55), w * .012, fill=shape, outline=edge)
            draw.line(box(x + .11, .15, x + .11, .55), fill=edge, width=max(1, w // 330))
        for y in (.26, .36, .46):
            for x in (.07, .39, .71):
                draw.line(box(x, y, x + .22, y), fill=edge, width=max(1, w // 570))
        draw.line(box(0, .64, 1, .64), fill=edge, width=max(1, w // 150))
        draw.polygon([(0, h * .8), (w * .24, h * .69), (w * .77, h * .69), (w, h * .8)],
                     fill=shape, outline=edge)
    return image


def backdrop(name, size, t=None):
    """Trả bản sao nền tĩnh theo tên và kích thước. t dành cho driver dùng cùng timeline."""
    return _plate(name, tuple(size)).copy()

