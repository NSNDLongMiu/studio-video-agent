"""Kiểm hình và metadata từ Python con của studio/test/motion.test.mjs."""

import json
import os
import subprocess
import unicodedata
import unittest
import warnings
from dataclasses import replace
from pathlib import Path

from PIL import Image, ImageChops

from tools.motion import captions, charts, components, core, flow, header, kinetic, sequence, text
from tools.motion.core import CAPTION_BAND, CONTENT, HEADER_ZONE, SAFE, SIZE, Canvas


def diff(first, second):
    """Đo vùng pixel thay đổi giữa hai khung, bỏ kênh alpha."""
    return ImageChops.difference(first.convert("RGB"), second.convert("RGB")).getbbox()


def inside(box, bounds):
    """Kiểm bbox dương và nằm trọn bên trong bounds."""
    return bounds[0] <= box[0] < box[2] <= bounds[2] and bounds[1] <= box[1] < box[3] <= bounds[3]


def intersects(a, b):
    """Kiểm hai bbox có chung diện tích."""
    return a[0] < b[2] and b[0] < a[2] and a[1] < b[3] and b[1] < a[3]


class MotionChecks(unittest.TestCase):
    """Đo cả hình vẽ và tọa độ mà thư viện trả về."""

    def setUp(self):
        self.out = Path(os.environ["MOTION_TEST_OUT"])

    def test_modules(self):
        self.assertEqual((SIZE, core.FPS), ((1080, 1920), 30))
        self.assertEqual((SAFE, CONTENT), ((90, 250, 990, 1500), (90, 250, 990, 1320)))
        self.assertEqual((core.ease_in_out(0), core.ease_in_out(1)), (0, 1))
        self.assertEqual((core.progress(-1, 0, 1), core.progress(1, 1, 1)), (0, 1))
        palette = replace(core.PALETTE, background="#123456", blue="#001122")
        c = Canvas(palette=palette)
        self.assertEqual((c.image.mode, c.image.getpixel((0, 0))), ("RGBA", (18, 52, 86, 255)))
        layer = c.layer((4, 4))
        layer.draw.rectangle((0, 0, 3, 3), fill=(0, 0, 0, 128))
        c.composite(layer, (4, 4))
        self.assertEqual(c.image.getpixel((5, 5)), (9, 26, 43, 255))
        for i, name in enumerate(components.ICONS):
            box = components.icon(c, name, (60 + i * 56, 300), 55)
            self.assertIsNotNone(diff(c.image.crop(box), Canvas(palette=palette, size=(55, 55)).image), name)
        self.assertEqual(len(components.ICONS), 17)
        self.assertEqual(len(components.tray(c, (120, 400, 600, 525), 3, selected=1)), 3)
        self.assertGreater(components.window(c, (120, 600, 600, 900), title="Dữ liệu")[1], 600)

    def test_text(self):
        sample = unicodedata.normalize("NFD", "Giữ dấu tiếng Việt: cơ sở dữ liệu và độ trễ phản hồi. " * 3)
        box = (130, 300, 314, 418)
        c = Canvas()
        with warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter("always")
            fitted = text.fit_text(sample, box, 72, 56, weight="bold", outline=2)
        self.assertLess(fitted.px, 56)
        self.assertTrue(caught)
        self.assertIn("ữ", fitted.text)
        self.assertIn("\n", fitted.text)
        self.assertEqual(text.measure(fitted.text, fitted.px, "bold", outline=2), fitted.bbox)
        paint = text.draw_text(c, fitted.text, box[:2], fitted.px, "bold", outline=2)
        self.assertTrue(inside(paint, box))
        self.assertTrue(inside(diff(Canvas().image, c.image), box))
        word = "khôngcóđiểmxuốngdòng" * 2
        fitted = text.fit_text(word, (0, 0, 88, 150), 28, 1)
        self.assertEqual(fitted.text.replace("\n", ""), word)
        with self.assertRaises(ValueError):
            text.fit_text(sample, (0, 0, 1, 1), 72, 56)

    def test_label(self):
        c = Canvas()
        target = (10, 390, 177, 580)
        obstacles = [(205, 250, 695, 585), (700, 510, 905, 658)]
        region = (0, 0, *SIZE)
        label = text.attach_label(c, target, "Độ trễ", side="right", avoid=obstacles, bounds=region)
        self.assertTrue(inside(label, (24, 24, 1056, 1896)))
        self.assertTrue(inside(diff(Canvas().image, c.image), label))
        self.assertGreaterEqual(label[0], target[2] + 24)
        self.assertFalse(any(intersects(label, item) for item in obstacles))
        self.assertIsNone(text.attach_label(c, target, "Độ trễ", bounds=region, avoid=[region]))
        inner = text.attach_label(c, (100, 700, 470, 915), "Đã kiểm", side="inside")
        self.assertTrue(inside(inner, (124, 724, 446, 891)))

    def test_ass(self):
        srt = self.out / "lời đọc.srt"
        srt.write_text("1\n00:00:00,000 --> 00:00:02,500\nCơ sở dữ liệu bắt đầu quá tải.\n\n"
                       "2\n00:00:02,500 --> 00:00:06,000\n"
                       + "Đoạn có nhiều cụm để chia trang và tránh vượt quá hai dòng. " * 2
                       + r"Nội dung \N và {ký hiệu}.", encoding="utf-8-sig")
        ass = captions.build_ass(srt)
        self.assertTrue(captions.validate_ass(ass))
        self.assertIn("PlayResX: 1080\nPlayResY: 1920", ass)
        style = next(line[7:].split(",") for line in ass.splitlines() if line.startswith("Style:"))
        self.assertEqual(style[1], "Segoe UI")
        self.assertTrue(52 <= int(style[2]) <= 60)
        self.assertEqual((style[7], style[18]), ("-1", "2"))
        self.assertTrue(CAPTION_BAND[1] < 1920 - int(style[21]) < CAPTION_BAND[3])
        rows = [line.split(",", 9) for line in ass.splitlines() if line.startswith("Dialogue:")]
        self.assertGreater(len(rows), 2)
        self.assertEqual(rows[0][-1], r"Cơ sở dữ liệu\Nbắt đầu quá tải.")
        for row in rows:
            lines = row[-1].replace(r"\{", "{").replace(r"\}", "}").split(r"\N")
            self.assertTrue(1 <= len(lines) <= 2)
            self.assertTrue(all(len(value.replace("\u200b", "")) <= 28 for value in lines))
        self.assertEqual(rows[-1][2], "0:00:06.00")
        with self.assertRaises(ValueError):
            captions.validate_ass(ass.replace("0,2,100,100,425", "0,5,100,100,425"))
        with self.assertRaises(ValueError):
            captions.validate_ass(ass.replace(rows[0][-1], r"{\pos(540,100)}nội dung"))
        with self.assertRaises(ValueError):
            captions.build_ass([(0, 2, "Một"), (1, 3, "Hai")])
        with self.assertRaises(ValueError):
            captions.build_ass([(0, 2, "Một")], {"font_size": 60, "margin_v": 700})

    def test_flow(self):
        a = flow.Node("a", (125, 360, 345, 595), "Nguồn", "user", appear_at=.5)
        b = flow.Node("b", (720, 360, 946, 595), "Đích", "database", appear_at=1)
        edge = flow.Edge("a", "b", appear_at=1.5, via=((520, 540),))
        graph = flow.FlowDiagram([a, b], [edge])

        def render(t):
            c = Canvas()
            return c.image, graph.render(c, t)

        blank = Canvas().image
        self.assertIsNone(diff(render(.49)[0], blank))
        self.assertEqual(render(.7)[1], ((a,), ()))
        self.assertLess(diff(render(.7)[0], blank)[2], 360)
        self.assertEqual(render(1.3)[1], ((a, b), ()))
        self.assertGreater(diff(render(1.3)[0], blank)[2], 920)
        region = (350, 420, 710, 565)
        self.assertIsNone(diff(render(1.49)[0].crop(region), blank.crop(region)))
        self.assertEqual(render(2.1)[1], ((a, b), (edge,)))
        self.assertIsNotNone(diff(render(2.1)[0].crop(region), blank.crop(region)))
        self.assertIsNotNone(diff(render(2.1)[0].crop(region), render(2.35)[0].crop(region)))
        self.assertEqual(render(1.3)[0].tobytes(), render(1.3)[0].tobytes())
        for kind in ("normal", "blocked", "leaking"):
            path = flow.connection(Canvas(), (100, 710), (920, 710), kind, t=1.7, via=((460, 760),))
            self.assertEqual(path[-1] == (920, 710), kind != "blocked", kind)
        points = [flow.request_stream((100, 790), (940, 790), 20, t) for t in (0, .85, 2.2, 3.9)]
        self.assertTrue(all(len(a) < len(b) for a, b in zip(points, points[1:])))
        self.assertTrue(all(100 <= x <= 940 and abs(y - 790) <= 18 for x, y in points[-1]))
        self.assertEqual(points[-1], flow.request_stream((100, 790), (940, 790), 20, 3.9))

    def test_kinetic_and_opening(self):
        blank = Canvas().image
        for style in ("pop", "slide", "type", "highlight"):
            c = Canvas()
            self.assertIsNone(kinetic.kinetic_text(c, "Kiểm tra", (540, 550), .1, appear=.2, style=style))
            self.assertIsNone(kinetic.kinetic_text(c, "Kiểm tra", (540, 550), .4, style=style, budget=0))
            self.assertIsNone(kinetic.kinetic_text(c, "Kiểm tra", (540, 550), .4, style=style, index=1))
            self.assertIsNone(diff(c.image, blank))
            self.assertIsNotNone(kinetic.kinetic_text(c, "Kiểm tra", (540, 550), .4, style=style))
            self.assertIsNotNone(diff(c.image, blank))
            self.assertIsNone(kinetic.kinetic_text(c, "Kiểm tra", (540, 550), 1.6, disappear=1, style=style))
            self.assertIsNotNone(kinetic.kinetic_text(c, "Kiểm tra", (540, 550), .4, style=style, index=1, budget=2))
        self.assertTrue(inside(header.header_label(Canvas(), "Cơ sở dữ liệu", header.visibility(.15)), HEADER_ZONE))
        self.assertIsNone(header.header_label(Canvas(), "Chương 2", header.visibility(3, hide_at=2)))
        opening = header.OpeningStyle(symbol="database", sfx_hint="Âm báo nhẹ")
        for at in (.15, .6, 1.6, 2.49):
            letters = diff(header.opening_frame(Canvas(), "Cơ sở dữ liệu", at, style=opening),
                           header.opening_frame(Canvas(), "", at, style=opening))
            self.assertTrue(inside(letters, SAFE))
        self.assertIsNotNone(diff(header.opening_frame(Canvas(), "", .4), header.opening_frame(Canvas(), "", 2.3)))

    def test_sequence_and_charts(self):
        c = Canvas()
        early = charts.bar_chart(c, [-3, 5, 7], .1, labels=["Một", "Hai", "Ba"])
        late = charts.bar_chart(c, [-3, 5, 7], 1, labels=["Một", "Hai", "Ba"])
        self.assertEqual((len(early), len(late)), (1, 3))
        self.assertGreater(late[0][3], early[0][3])
        self.assertLess(len(charts.line_chart(c, [0, -3, 7, -2], .15)),
                        len(charts.line_chart(c, [0, -3, 7, -2], 1)))
        self.assertLess(charts.counter(c, 100, 0, (540, 490), .6), charts.counter(c, 100, 0, (540, 490), .4))
        small = Canvas(size=(100, 180))
        small.draw.rectangle((40, 40, 60, 60), fill="white")
        self.assertIsNotNone(diff(sequence.camera(small.image, 1.2, lambda t: (t, 0), 0, size=(100, 180)),
                                  sequence.camera(small.image, 1.2, lambda t: (t, 0), 1, size=(100, 180))))
        a = sequence.Scene(2.5, lambda t: Canvas("red").image, id="OP", role="opening", concepts=1,
                           voice=((.2, 1.2),))
        b = sequence.Scene(4.0, lambda t: Canvas("blue").image, id="BD", complexity="high", header="Cơ sở dữ liệu",
                           voice=((.5, 2.2),))
        joined = sequence.concat([a, b], [.5])
        self.assertEqual(joined.duration, 6)
        colors = tuple(joined.render(t).getpixel((0, 0)) for t in (1, 2.25, 4))
        self.assertEqual(colors, ((255, 0, 0, 255), (127, 0, 127, 255), (0, 0, 255, 255)))
        path = self.out / "assets" / "scenes.json"
        result = sequence.write_scenes_json([a, b], path, [.5])
        self.assertEqual(result, json.loads(path.read_text(encoding="utf-8")))
        self.assertEqual(result, [
            {"id": "OP", "start": 0, "end": 2.25, "complexity": "low", "concepts": 1, "role": "opening",
             "header": None, "voice": [{"start": .2, "end": 1.2}]},
            {"id": "BD", "start": 2.25, "end": 6.0, "complexity": "high", "concepts": 0, "role": "body",
             "header": "Cơ sở dữ liệu", "voice": [{"start": 2.5, "end": 4.2}]},
        ])

    def test_caption_pixels(self):
        source = self.out / "ảnh nền.mp4"
        sequence.render_scene(sequence.Scene(.1, lambda t: Canvas("#000000").image), source)
        for px, border in ((56, 1), (60, 3)):
            ass = self.out / "phụ đề, [QC] ' test.ass"
            ass.write_text(captions.build_ass([(0, .1, "Độ trễ tăng khi quá nhiều yêu cầu đến cùng lúc.")],
                                             {"font_size": px, "border_style": border}), encoding="utf-8")
            video = self.out / "captioned.mp4"
            subprocess.run(captions.burn(source, ass, video), check=True)
            png = self.out / "captions.png"
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(video), "-frames:v", "1",
                            "-threads", "1", str(png)], check=True)
            with Image.open(png) as frame:
                gray = frame.convert("L")
                self.assertTrue(inside(gray.point(lambda p: 255 if p >= 13 else 0).getbbox(), CAPTION_BAND),
                                (px, border))
                visible_rows = [gray.crop((90, y, 990, y + 1)).getextrema()[1] > 87 for y in range(1340, 1500)]
                regions = sum(b and not a for a, b in zip([False] + visible_rows, visible_rows))
                self.assertGreaterEqual(regions, 2, (px, border))

    def test_demo_pixels(self):
        frames = []
        for path in sorted((self.out / "demo").glob("frame_*.png")):
            with Image.open(path) as source:
                frames.append(source.convert("RGB"))
        self.assertEqual([frame.size for frame in frames], [SIZE] * 3)
        for a, b in zip(frames, frames[1:]):
            self.assertIsNotNone(diff(a.crop(CONTENT), b.crop(CONTENT)))
            self.assertIsNotNone(diff(a.crop(CAPTION_BAND), b.crop(CAPTION_BAND)))
