"""Dựng sáu giây minh họa tải dồn lên cơ sở dữ liệu và độ trễ tăng theo."""

import argparse
import json
import random
import subprocess
import sys
from functools import lru_cache
from pathlib import Path
from tempfile import TemporaryDirectory
from time import perf_counter

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))

from tools.backgrounds.make_background import THEMES, render_layers
from tools.motion.captions import build_ass, burn
from tools.motion.charts import counter
from tools.motion.components import card, icon, panel, status_indicator
from tools.motion.core import FPS, PALETTE, SIZE, Canvas, blend, ease_in_out, progress
from tools.motion.flow import connection, request_stream
from tools.motion.header import header_label, visibility
from tools.motion.kinetic import kinetic_text
from tools.motion.sequence import Scene, render_scene
from tools.motion.text import attach_label

DURATION = 6


@lru_cache(maxsize=1)
def _backdrop():
    far, mid, near = render_layers("database", THEMES["database"][1], random.Random(7))
    background = Image.alpha_composite(Image.alpha_composite(far, mid), near)
    return Image.blend(background, Image.new("RGBA", SIZE, PALETTE.background), .24)


def overload_frame(t):
    """Hiện luồng request, mức sử dụng và độ trễ. Phụ đề được ghép sau."""
    c = Canvas(_backdrop())
    p = c.palette
    header_label(c, "Cơ sở dữ liệu", visibility(t, .08, 3.02))

    load = .16 + .84 * ease_in_out(progress(t, .48, 4.72))
    state = "bad" if load >= .79 else "warn" if load >= .50 else "ok"
    tone = {"bad": p.red, "warn": p.amber, "ok": p.green}[state]
    source = (278, 650)
    destination = (643, 650)
    for y in (615, 650, 685):
        c.draw.line((source[0], y, destination[0], y), fill=p.edge, width=3)
    connection(c, source, destination, t=t, duration=.35, packets=False, color=p.muted, width=5)
    request_stream(source, destination, 21, t, canvas=c, ramp=4.8, travel=1.10, spread=37, radius=10)
    card(c, (100, 564, 280, 736), symbol="user", t=t)
    panel(c, (646, 453, 952, 920), t=t, fill=p.card, accent=tone)
    icon(c, "database", (799, 642), 245, t=t, color=blend(p.text, tone, .64))
    status_indicator(c, (678, 837, 920, 874), "bar", load, state, t=t)
    if state == "bad":
        icon(c, "warning", (905, 491), 55, t=t, color=p.red)

    # Nối trực quan máy chủ với đồng hồ phản hồi, sau khi luồng đã chạy.
    if t >= 1.15:
        connection(c, (799, 924), (799, 1013), t=t, appear_at=1.15, duration=.52,
                   packets=False, color=p.edge, width=5)
        panel(c, (119, 1014, 952, 1252), t=t)
        clock = (150, 1074, 268, 1192)
        icon(c, "clock", (209, 1133), 118, t=t, color=p.red if state == "bad" else p.muted)
        counter(c, 45, 930, (914, 1133), t, appear=1.15, duration=4.70, px=79,
                color=tone, formatter="{:.0f} ms", anchor="rm")
        if state == "bad":
            attach_label(c, clock, "HIGH LATENCY", side="right", gap=19, bounds=(138, 1028, 717, 1238),
                         avoid=((655, 1057, 922, 1211),), color=p.red)

    kinetic_text(c, "DATABASE OVERLOAD", (540, 345), t, appear=3.42, style="pop", px=76, color=p.text)
    return c.image


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True, help="Thư mục chứa MP4 và ba khung PNG")
    args = parser.parse_args()
    out = args.out.resolve()
    out.mkdir(parents=True, exist_ok=True)
    started = perf_counter()
    _backdrop()
    times = []

    def timed_frame(t):
        start = perf_counter()
        frame = overload_frame(t)
        times.append(perf_counter() - start)
        return frame

    video = out / "demo_overload.mp4"
    with TemporaryDirectory(prefix="demo-", dir=out) as folder:
        scratch = Path(folder)
        clean = render_scene(Scene(DURATION, timed_frame, id="OVERLOAD", complexity="medium", concepts=1),
                             scratch / "clean.mp4")
        captions = scratch / "captions.ass"
        captions.write_text(build_ass([
            (0, 2.15, "Nhiều yêu cầu cùng đến."),
            (2.15, 4.28, "Cơ sở dữ liệu bắt đầu quá tải."),
            (4.28, 6, "Thời gian phản hồi tăng."),
        ]), encoding="utf-8")
        subtitled = scratch / video.name
        subprocess.run(burn(clean, captions, subtitled), check=True)
        subtitled.replace(video)

    indices = [round(seconds * FPS) for seconds in (1, 3.65, 5.5)]
    frames = "+".join(f"eq(n\\,{index})" for index in indices)
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(video),
                    "-vf", f"select={frames}", "-fps_mode", "passthrough", "-threads", "2",
                    "-frames:v", "3", str(out / "frame_%02d.png")], check=True)
    print(json.dumps({"seconds": round(perf_counter() - started, 2), "frames": len(times),
                      "frame_mean_ms": round(1000 * sum(times) / len(times), 2),
                      "frame_max_ms": round(1000 * max(times), 2)}))


if __name__ == "__main__":
    main()
