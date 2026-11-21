"""Nhãn vùng trên và mở cảnh ngắn, dùng cùng bộ máy chữ với nội dung chính."""

import math
from bisect import bisect_right
from dataclasses import dataclass
from functools import lru_cache

from ..config.rules import load_rules
from .components import _record_component, icon
from .core import CAPTION_BAND, CONTENT, HEADER_ZONE, SAFE, SIZE, clamp, ease_in_out, ease_out_cubic, progress, rgba
from .sequence import camera
from .text import draw_text, fit_text


@dataclass(frozen=True)
class OpeningStyle:
    """Phong cách mở cảnh. Sfx_hint là ghi chú tùy chọn cho người dựng tiếng."""

    symbol: str | None = None
    accent: str | None = None
    zoom: float = 1.07
    sfx_hint: str | None = None


def visibility(t, show_at=0, hide_at=None, fade=.22):
    """Trả độ hiện 0–1. Bắt đầu mờ đi khi tới hide_at."""
    if fade < 0 or (hide_at is not None and hide_at < show_at):
        raise ValueError("Mốc ẩn/hiện của nhãn không hợp lệ")
    show = ease_in_out(progress(t, show_at, show_at + fade))
    hide = 0 if hide_at is None else ease_in_out(progress(t, hide_at, hide_at + fade))
    return show * (1 - hide)


def header_label(canvas, text, t_visible=1, *, color=None):
    """Vẽ pill trong HEADER_ZONE, nhận độ hiện từ visibility và trả bbox hoặc None."""
    alpha = clamp(t_visible)
    if not text.strip() or alpha <= 0:
        return None
    x, y, r, b = HEADER_ZONE
    fitted = fit_text(text, (x, y, r - 50, b - 30), 48, 24, weight="bold")
    width, height = fitted.bbox[2] + 48, fitted.bbox[3] + 24
    layer = canvas.layer((width, height))
    p = canvas.palette
    layer.draw.rounded_rectangle((0, 0, width - 1, height - 1), height / 2,
                                 fill=(*rgba(p.panel)[:3], round(230 * alpha)),
                                 outline=(*rgba(color or p.edge)[:3], round(220 * alpha)), width=2)
    draw_text(layer, fitted.text, (24, 12), fitted.px, "bold",
              color=(*rgba(p.text)[:3], round(255 * alpha)), role="header_title", effect="fade")
    top = y + round((b - y - height) * (.2 + .3 * alpha))
    canvas.composite(layer, (x, top))
    bbox = x, top, x + width, top + height
    if round(255 * alpha):
        canvas.record("header", slot="top", bbox=bbox, topic="", title=text)
    return bbox


def chapter_label(canvas, text, t_visible=1):
    """Dùng nhãn viền lam khi vào một chương mới."""
    return header_label(canvas, text, t_visible, color=canvas.palette.blue)


def validate_opening_duration(duration):
    rules = load_rules()["opening"]
    if not rules["min_s"] <= duration <= rules["max_s"]:
        raise ValueError(f"Opening phải dài từ {rules['min_s']} đến {rules['max_s']} giây")


def opening_frame(canvas, title, t, duration=2.5, style=None):
    """Dựng opening với tiêu đề chữ thật, vào mượt và camera đẩy nhẹ."""
    validate_opening_duration(duration)
    style = OpeningStyle() if style is None else OpeningStyle(**style) if isinstance(style, dict) else style
    p = canvas.palette
    accent = style.accent or p.blue
    full = ease_in_out(progress(t, 0, duration))
    canvas.draw.rounded_rectangle((142, 405, 938, 1165), 50, fill=p.panel, outline=p.edge, width=4)
    if style.symbol:
        if canvas.recorder is None:
            icon(canvas, style.symbol, (540, 595), 205, t=t, color=accent)
        else:
            layer = canvas.layer()
            icon(layer, style.symbol, (540, 595), 205, t=t, color=accent, role="decor")
            # Đưa bbox icon qua cùng phép đẩy camera khi ghi nhật ký.
            canvas.composite(layer.image)
    if full and style.zoom > 1:
        canvas.image.paste(camera(canvas.image, 1 + (style.zoom - 1) * full, t=t, size=canvas.image.size,
                                        reason="Đẩy vào biểu tượng mở cảnh", recorder=canvas.recorder))
    if canvas.recorder is not None and style.symbol:
        w, h = canvas.image.size
        z = min(load_rules()["camera"]["max_zoom"], max(1, 1 + (style.zoom - 1) * full))
        canvas._record_layer(layer, ((1 - z) * w / 2, (1 - z) * h / 2), (z, z))

    phase = ease_out_cubic(progress(t, 0, min(.55, duration / 2)))
    if phase <= 0 or not title.strip():
        return canvas.image
    left, _, right, _ = CONTENT
    width, height = 700, 250
    fitted = fit_text(title, (0, 0, width, height), 106, 72, weight="bold")
    layer = canvas.layer((width, height + 34))
    center_y = height // 2
    draw_text(layer, fitted.text, (width // 2, center_y), fitted.px, "bold", "mm",
              (*rgba(p.text)[:3], round(phase * 255)), role="opening_title", effect="fade")
    line_y = center_y + (fitted.bbox[3] + 1) // 2 + 21
    half = max(1, round(66 * phase))
    layer.draw.rounded_rectangle((width // 2 - half, line_y, width // 2 + half, line_y + 7),
                                 4, fill=(*rgba(accent)[:3], round(phase * 255)))
    center = 865 if style.symbol else 765
    canvas.composite(layer, ((left + right - width) // 2, center - center_y + round(45 * (1 - phase))))
    canvas.record("opening", title=title, topic="")
    return canvas.image


@dataclass(frozen=True)
class HeaderSpec:
    topic: str
    title: str
    accent: str | None = None


# Ô D8 bắt đầu ở mép trên vùng SAFE. Ô dưới chừa 24 px tới CAPTION_BAND.
HEADER_SLOTS = {
    "top": (SAFE[0], SAFE[1], SAFE[2], SAFE[1] + 200),
    "top_left": (SAFE[0], SAFE[1], SAFE[0] + 620, SAFE[1] + 200),
    "top_right": (SAFE[2] - 620, SAFE[1], SAFE[2], SAFE[1] + 200),
    "above_captions": (SAFE[0], CAPTION_BAND[1] - 224, SAFE[2], CAPTION_BAND[1] - 24),
}


def _fit_lines(value, width, height, largest, smallest, lines):
    if not value.strip():
        raise ValueError("Nhãn chủ đề và tiêu đề phải có chữ")
    while largest >= smallest:
        fitted = fit_text(value, (0, 0, width, height), largest, 1, weight="bold")
        if fitted.px < smallest:
            break
        if len(fitted.text.splitlines()) <= lines:
            return fitted
        largest = fitted.px - 1
    raise ValueError(f"Chữ không vừa {lines} dòng ở cỡ tối thiểu {smallest} px")


@lru_cache(maxsize=128)
def _header_layout(spec, slot, scale=1):
    x, y, r, b = HEADER_SLOTS[slot]
    if not math.isfinite(scale) or scale <= 0:
        raise ValueError("Tỷ lệ header phải hữu hạn và dương")
    area = math.floor(.09 * math.prod(SIZE))
    width = min(r - x, 972)
    height = min(b - y, 200, area // width)
    inset_x, inset_y, spacing = 22, 12, 8
    inner_width = width - 2 * inset_x
    topic = _fit_lines(spec.topic.upper(), inner_width, height - 2 * inset_y - spacing,
                       max(40, min(64, round(42 * scale))), 40, 1)
    title = _fit_lines(spec.title, inner_width, height - 2 * inset_y - spacing - topic.bbox[3],
                       max(52, min(94, round(58 * scale))), 52, 2)
    width = max(topic.bbox[2], title.bbox[2]) + 2 * inset_x
    height = topic.bbox[3] + title.bbox[3] + 2 * inset_y + spacing
    left = {"top_left": x, "top_right": r - width}.get(slot, (x + r - width) // 2)
    top = b - height if slot == "above_captions" else y
    return (left, top, left + width, top + height), topic, title, (inset_x, inset_y, spacing)


def header_card(canvas, spec, slot, t_visible=1, *, scale=1):
    """Vẽ thẻ chủ đề/tiêu đề. Trả bbox thật hoặc None khi độ hiện bằng 0."""
    if slot not in HEADER_SLOTS:
        raise ValueError(f"Ô header không hợp lệ: {slot!r}")
    bbox, topic, title, (inset_x, inset_y, spacing) = _header_layout(spec, slot, scale)
    alpha = clamp(t_visible)
    if round(255 * alpha) == 0:
        return None
    x, y, r, b = bbox
    layer = canvas.layer((r - x, b - y))
    p = canvas.palette
    accent = spec.accent or p.blue
    layer.draw.rounded_rectangle((0, 0, r - x - 1, b - y - 1), 20,
                                 fill=(*rgba(p.ink)[:3], round(235 * alpha)),
                                 outline=(*rgba(p.edge)[:3], round(225 * alpha)), width=2)
    for row, top, role, color in ((topic, inset_y, "header_topic", accent),
                                  (title, inset_y + topic.bbox[3] + spacing, "header_title", p.text)):
        draw_text(layer, row.text, (inset_x, top), row.px, "bold",
                  color=(*rgba(color)[:3], round(255 * alpha)), role=role)
    canvas.composite(layer, (x, y))
    canvas.record("header", slot=slot, bbox=bbox, topic=spec.topic, title=spec.title)
    return bbox


@dataclass(frozen=True)
class SlotChoice:
    slot: str
    bbox: tuple
    moved: bool
    overlap: bool = False

    def __iter__(self):
        return iter((self.slot, self.bbox, self.moved))


def _occupied(box, avoid_boxes, gap):
    x, y, r, b = box
    return sum(max(0, min(r, c + gap) - max(x, a - gap)) * max(0, min(b, d + gap) - max(y, e - gap))
               for a, e, c, d in avoid_boxes)


def choose_slot(preferred, avoid_boxes, gap=24, order=tuple(HEADER_SLOTS), *, spec=None):
    """Chọn ô ưu tiên còn đủ khe. Kết quả gỡ được thành slot, bbox, moved và có thuộc tính overlap."""
    preferred = preferred or "top"
    slots = tuple(dict.fromkeys((preferred, *order)))
    if gap < 0 or any(slot not in HEADER_SLOTS for slot in slots):
        raise ValueError("Khe header hoặc tên ô không hợp lệ")
    obstacles = (*avoid_boxes, CAPTION_BAND)
    fallback = None
    for slot in slots:
        try:
            box = HEADER_SLOTS[slot] if spec is None else _header_layout(spec, slot)[0]
        except ValueError:
            continue
        area = _occupied(box, obstacles, gap)
        if area == 0:
            return SlotChoice(slot, box, slot != preferred)
        if fallback is None or area < fallback[0]:
            fallback = area, SlotChoice(slot, box, slot != preferred, overlap=True)
    if fallback is None:
        raise ValueError("Không có ô nào đủ chỗ cho tiêu đề và nhãn chủ đề")
    return fallback[1]


class HeaderTrack:
    """Đặt header theo khoảng cảnh nửa mở, dùng giờ toàn video."""

    def __init__(self, spec, plan):
        self.spec = spec
        self.plan = tuple(plan)
        self._starts = tuple(start for _, start, _, _ in self.plan)
        self._placements = {}
        if any(not 0 <= start < end < math.inf or (slot is not None and slot not in HEADER_SLOTS)
               for _, start, end, slot in self.plan):
            raise ValueError("Mốc cảnh hoặc ô header không hợp lệ")
        if any(a[2] > b[1] for a, b in zip(self.plan, self.plan[1:])):
            raise ValueError("Các khoảng header phải theo thứ tự và không chồng nhau")

    def set_avoid(self, scene_id, avoid_boxes):
        """Chốt vị trí bằng hợp các bbox của cảnh. Có thể gọi trước khi dựng các khung rời."""
        if scene_id not in self._placements:
            preferred = next(slot for id, _, _, slot in self.plan if id == scene_id)
            self._placements[scene_id] = choose_slot(preferred, avoid_boxes, spec=self.spec)
        return self._placements[scene_id]

    def draw(self, canvas, t, avoid_boxes_of_scene):
        """Vẽ ô đã chọn. Trong 0,4 s đầu cảnh mới, hòa hai ô nếu cả hai còn trống."""
        i = bisect_right(self._starts, t) - 1
        if i < 0 or t >= self.plan[i][2]:
            return None
        scene, start, _, _ = self.plan[i]
        obstacles = tuple(avoid_boxes_of_scene)
        choice = self.set_avoid(scene, obstacles)
        opacity = 1
        if i and abs(self.plan[i - 1][2] - start) < 1e-6 and t < start + .4:
            previous_id, _, _, preferred = self.plan[i - 1]
            previous = self._placements.get(previous_id) or choose_slot(preferred, (), spec=self.spec)
            if previous.slot != choice.slot:
                opacity = ease_in_out(progress(t, start, start + .4))
                if not _occupied(previous.bbox, (*obstacles, CAPTION_BAND), 24):
                    header_card(canvas, self.spec, previous.slot, 1 - opacity)
                else:
                    # Nếu cú cắt lấp ô cũ, chỉ fade ô mới từ độ hiện đọc được.
                    opacity = .7 + .3 * opacity
        header_card(canvas, self.spec, choice.slot, opacity)
        return choice

    def coverage(self, video_duration, opening_end):
        """Tỷ lệ thời lượng sau opening được lịch header phủ."""
        if not 0 <= opening_end <= video_duration:
            raise ValueError("Mốc opening phải nằm trong video")
        covered = sum(max(0, min(end, video_duration) - max(start, opening_end))
                      for _, start, end, _ in self.plan)
        return covered / (video_duration - opening_end) if video_duration > opening_end else 0


def opening_plate(canvas, title, topic, t, duration=2.4, style=None, *, sfx_hint=None):
    """Cảnh mở riêng, tiêu đề ≤ 8 từ. sfx_hint dành cho người dựng tiếng."""
    validate_opening_duration(duration)
    if not 1 <= len(title.split()) <= 8:
        raise ValueError("Tiêu đề opening có 1–8 từ")
    style = OpeningStyle() if style is None else OpeningStyle(**style) if isinstance(style, dict) else style
    title_fit = _fit_lines(title, 808, 270, 114, load_rules()["opening"]["title_px_min"], 2)
    topic_fit = _fit_lines(topic.upper(), 808, 96, 46, 40, 1)
    accent = style.accent or canvas.palette.blue
    p = canvas.palette
    full = ease_in_out(progress(t, 0, duration))
    phase = ease_out_cubic(progress(t, 0, min(.55, duration / 2)))
    zoom = min((SAFE[2] - SAFE[0]) / 828, max(1, 1 + (style.zoom - 1) * full))
    cx, cy = 540, 872
    box = (round(cx - 414 * zoom), round(cy - 313 * zoom),
           round(cx + 414 * zoom), round(cy + 313 * zoom))
    canvas.draw.rounded_rectangle(box, 48, fill=p.panel, outline=p.edge, width=4)
    _record_component(canvas, "panel", box, role="decor")
    if style.symbol:
        icon(canvas, style.symbol, (cx, cy - 176 * zoom), 134 * zoom, color=accent, role="decor")
    opacity = round(phase * 255)
    if opacity:
        top = round(cy - 70 + 42 * (1 - phase))
        layer = canvas.layer((820, 380))
        draw_text(layer, topic_fit.text, (410, 0), topic_fit.px, "bold", "mt",
                  (*rgba(accent)[:3], opacity), role="opening_topic", effect="fade")
        y = topic_fit.bbox[3] + 25
        draw_text(layer, title_fit.text, (410, y), title_fit.px, "bold", "mt",
                  (*rgba(p.text)[:3], opacity), role="opening_title", effect="fade")
        y += title_fit.bbox[3] + 21
        half = round(71 * phase)
        layer.draw.rounded_rectangle((410 - half, y, 410 + half, y + 6), 3,
                                     fill=(*rgba(accent)[:3], opacity))
        canvas.composite(layer, (cx - 410, top))
    canvas.record("opening", title=title, topic=topic)
    return canvas.image
