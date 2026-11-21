"""Dựng opening ba giai đoạn bằng đồ họa và chữ của thư viện motion."""

import json
from functools import cache
from pathlib import Path

from PIL import Image

from ..config.rules import load_rules
from .components import card, icon
from .core import Canvas, PALETTE, ease_in_out, lerp, progress
from .flow import connection
from .header import OpeningStyle, opening_plate, validate_opening_duration
from .kinetic import kinetic_text
from .sequence import Scene, camera
from .text import fit_text


@cache
def visual_config():
    return json.loads(Path(__file__).with_name("openings.json").read_text(encoding="utf-8"))


def choose_style(content_hints):
    """Trả cặp (kiểu, lý do). Gợi ý lấy từ opening và intent của lời hook."""
    rules = load_rules()["opening"]
    override = content_hints.get("style") or content_hints.get("opening", {}).get("style")
    if override:
        if override not in rules["styles"]:
            raise ValueError(f"Kiểu opening không hợp lệ: {override}")
        return override, "Kiểu ghi trong storyboard"
    topic = content_hints.get("topic", "").casefold()
    intent = content_hints.get("intent")
    words = visual_config()["selection"]
    for style, condition, why in (
        ("incident", content_hints.get("has_incident"), "Có sự cố"),
        ("warning", intent == "warning", "Lời hook cảnh báo"),
        ("hypothetical", content_hints.get("hypothetical"), "Có giả định"),
        ("surprise", intent == "reveal" or content_hints.get("has_metrics"), "Có phát hiện hoặc số liệu"),
        ("question", intent == "question", "Lời hook đặt câu hỏi"),
    ):
        if condition:
            return style, why
        if match := next((word for word in words.get(style, ()) if word in topic), None):
            return style, f"Từ khóa chủ đề: {match}"
    return "question", "Dùng câu hỏi khi thiếu gợi ý cụ thể"


def _art(canvas, mode, symbol, accent, p):
    """Vẽ quan hệ giữa các vật thể, trả bbox chủ thể để camera và chữ bám vào."""
    left, right, middle = (300, 765), (780, 765), (540, 765)
    target = (205, 530, 875, 980)
    if mode == "scan":
        card(canvas, (310, 535, 770, 945), symbol=symbol, accent=accent, id="opening-subject")
        y = round(lerp(575, 900, p))
        canvas.draw.rectangle((338, y, 742, y + 16), fill=accent)
    elif mode == "fork":
        for y in (630, 900):
            connection(canvas, (400, 765), (750, y), "normal", packets=False, width=8)
            icon(canvas, "document", (780, y), 99, color=accent)
            x = lerp(405, 736, p)
            icon(canvas, "document", (x, lerp(765, y, p)), 62, color=accent)
        icon(canvas, symbol, left, 150, color=accent, id="opening-subject")
    else:
        blocked = mode == "barrier"
        source, dest = (right, left) if mode == "reverse" else (left, right)
        connection(canvas, source, dest, "blocked" if blocked else "normal", packets=False, width=8)
        icon(canvas, "document", dest, 140, color=accent)
        icon(canvas, symbol, source, 142, color=accent, id="opening-subject")
        if blocked:
            dest = middle
        x = lerp(source[0], dest[0], p)
        icon(canvas, "document", (x, 660), 98, color=accent)
    return target


def opening_sequence(style, title, topic, duration, params=None, palette=PALETTE):
    """Trả Scene có timeline cục bộ. next_frame tùy chọn là ảnh đầu cảnh kế."""
    validate_opening_duration(duration)
    config = visual_config()
    rules = load_rules()["opening"]
    if style not in rules["styles"]:
        raise ValueError(f"Kiểu opening không hợp lệ: {style}")
    params = {} if params is None else params
    spec = config["styles"][style]
    keyword = params.get("keyword", spec["keyword"])
    keyword = fit_text(keyword, (0, 0, 640, 130), 80, 72, weight="bold").text
    accent = getattr(palette, spec["accent"])
    hook, conflict, _ = config["phase_ratios"]
    starts = (0, duration * hook, duration * (hook + conflict))
    ends = (*starts[1:], duration)
    overrides = params.get("phases")
    if overrides is not None:
        if [item["phase"] for item in overrides] != rules["phases"]:
            raise ValueError("Opening cần đủ ba pha đúng thứ tự")
        starts = tuple(item["start_s"] for item in overrides)
        ends = tuple(item["end_s"] for item in overrides)
        if starts[0] != 0 or starts[1:] != ends[:-1] or ends[-1] != duration or any(
                start >= end for start, end in zip(starts, ends)):
            raise ValueError("Ba pha opening phải liền nhau và phủ hết thời lượng")
    fps = load_rules()["frame"]["fps"]
    scene_id = params.get("scene_id", "S00")
    next_frame = params.get("next_frame")

    def frame(t):
        i = min(2, sum(t >= boundary for boundary in ends))
        phase = rules["phases"][i]
        amount = progress(t, starts[i], ends[i])
        mode, symbol, zoom, pan, intent = spec["phases"][i]
        if overrides is not None:
            intent = overrides[i].get("sfx_intent", intent)
        canvas = Canvas(palette=palette)
        if i == 2:
            # Giữ chuyển động của bản tiêu đề suốt pha, kể cả opening ngắn kế thừa.
            layer = canvas.layer()
            opening_plate(layer, title, topic, duration, duration,
                          OpeningStyle(symbol=symbol, accent=accent, zoom=1))
            canvas.composite(camera(
                layer, lerp(1, zoom, amount), tuple(pan), size=canvas.image.size,
                target_bbox=(126, 559, 954, 1185), keep_in_safe_area=True,
                reason=f"Đẩy nhẹ vào tiêu đề {style}"))
        else:
            layer = canvas.layer()
            target = _art(layer, mode, symbol, accent, amount)
            # Pha xung đột kéo ra để nhìn quan hệ, pha đầu đẩy vào để giới thiệu chủ thể.
            value = lerp(1, zoom, amount if i == 0 else 1 - amount)
            canvas.composite(camera(
                layer, value, tuple(pan), size=canvas.image.size, target_bbox=target,
                keep_in_safe_area=True, reason=f"Làm rõ quan hệ {style} trong pha {phase}"))
            if i == 1:
                kinetic_text(canvas, keyword, (540, 1110), t, appear=starts[i],
                             style=spec["kinetic"], px=76, color=accent,
                             attach_to="opening-subject", target_bbox=target)
            canvas.record("opening", title=title, topic=topic)
        canvas.record("phase", phase=phase)
        if canvas.recorder is not None:
            canvas.recorder.cue(None, intent, "high" if i == 0 else "medium", target=phase)
        if i == 2 and next_frame is not None:
            fade_start = lerp(ends[i], starts[i], config["match_fraction"])
            final_frame = max(starts[i], (round(duration * fps) - 1) / fps)
            amount = ease_in_out(progress(t, fade_start, max(fade_start, final_frame)))
            if amount > 0:
                following = next_frame() if callable(next_frame) else next_frame
                return Image.blend(canvas.image, following.convert("RGBA"), amount)
        return canvas.image

    return Scene(duration, frame, scene_id, role="opening", voice=tuple(params.get("voice", ())))
