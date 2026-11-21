"""Ví dụ 9 giây cho opening riêng, header đổi ô và nhật ký dựng."""

import argparse
from pathlib import Path
import sys

from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))

from tools.motion import Canvas, FPS, RenderLog, SIZE, components, flow, header, kinetic, sequence, text


SPEC = header.HeaderSpec("Cơ sở dữ liệu", "Khi truy vấn dồn dập")
OPENING = 2.4
PLAN = (("S02", OPENING, 4.6, "top_left"), ("S03", 4.6, 6.8, "above_captions"),
        ("S04", 6.8, 9, "top_right"))
NODES = ((111, 555, 442, 837), (631, 555, 962, 837))
FOX_BOX = (101, 665, 303, 972)
METER = (427, 693, 902, 783)
TRAY = (465, 575, 904, 901)


def background():
    canvas = Canvas("#0C192A")
    for x in range(26, 1080, 68):
        canvas.draw.line((x, 0, x, 1920), fill="#112237")
    for y in range(39, 1920, 68):
        canvas.draw.line((0, y, 1080, y), fill="#112237")
    return canvas.image


def make_demo():
    bg = background()
    with Image.open(ROOT / "brand/cao/poses/point_right.png") as source:
        fox = source.convert("RGBA")
        fox = fox.crop(fox.getbbox())
    track = header.HeaderTrack(SPEC, PLAN)
    obstacles = {"S02": ((107, 536, 974, 887),), "S03": (FOX_BOX, (405, 526, 925, 830)),
                 "S04": ((449, 551, 924, 924),)}
    choices = {id_: track.set_avoid(id_, boxes) for id_, boxes in obstacles.items()}
    if any(choice.overlap for choice in choices.values()):
        raise ValueError("Cần dời nội dung để chừa chỗ cho header")

    diagram = flow.FlowDiagram([flow.Node("app", NODES[0], "Ứng dụng", "user"),
                                flow.Node("database", NODES[1], "Kho dữ liệu", "database", .18)],
                               [flow.Edge("app", "database", appear_at=.35)])

    def opening(t):
        return header.opening_plate(Canvas(bg), SPEC.title, SPEC.topic, t, OPENING,
                                    header.OpeningStyle(symbol="database"))

    def queries(canvas, t):
        diagram.render(canvas, t)
        flow.request_stream((441, 736), (634, 736), 10, t, canvas=canvas, appear_at=.4, ramp=.9)

    def overload(canvas, t):
        components.sticker(canvas, fox, FOX_BOX, id="cao")
        level = min(1, .52 + t * .48)
        components.status_indicator(canvas, METER, "bar", level, "bad", id="tai")
        kinetic.kinetic_text(canvas, "QUÁ TẢI", (664, 587), t, appear=.24,
                             role="keyword", attach_to="tai", target_bbox=METER)

    def queue(canvas, t):
        components.tray(canvas, TRAY, 3, selected=min(2, int(t * 2)), id="hang-doi")
        for i in range(min(3, 1 + int(t * 2))):
            components.icon(canvas, "document", (545 + 137 * i, 724), 77)
        text.attach_label(canvas, TRAY, "HÀNG ĐỢI", "below", min_px=72, max_px=72,
                          role="keyword", attach_to="hang-doi")

    def scene_for(id_, start, end, draw, role):
        def frame(t):
            canvas = Canvas(bg)
            draw(canvas, t)
            track.draw(canvas, start + t, obstacles[id_])
            return canvas.image
        return sequence.Scene(end - start, frame, id=id_, role=role, header=SPEC.title,
                              header_slot=choices[id_].slot)

    scenes = [sequence.Scene(OPENING, opening, id="S01", role="opening")]
    scenes.extend(scene_for(id_, a, b, draw, role) for (id_, a, b, _), draw, role in
                  zip(PLAN, (queries, overload, queue), ("hook", "body", "outro"), strict=True))
    return sequence.concat(scenes)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True)
    out = parser.parse_args().out
    video = make_demo()
    log = RenderLog(FPS, SIZE)
    sequence.render_scene(video, out / "demo_header_opening.mp4", recorder=log)
    sequence.write_render_log(log, out / "render-log.json")
    for i, t in enumerate((1.15, 3.9, 6, 8.2), 1):
        video.render(t).save(out / f"frame_{i:02d}.png")


if __name__ == "__main__":
    main()
