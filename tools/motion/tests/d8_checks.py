"""Kiểm nhật ký dựng, opening và header của chuẩn D8."""

import json
import os
import unittest
from pathlib import Path

from PIL import Image

from tools.config.rules import load_rules
from tools.motion import CAPTION_BAND, SAFE, SIZE, Canvas, RenderLog, components, header, kinetic, sequence, text


def inside(box, bounds=SAFE):
    return box[0] >= bounds[0] and box[1] >= bounds[1] and box[2] <= bounds[2] and box[3] <= bounds[3]


class D8Checks(unittest.TestCase):
    def setUp(self):
        self.out = Path(os.environ["MOTION_TEST_OUT"])
        self.spec = header.HeaderSpec("Cơ sở dữ liệu", "Khi truy vấn dồn dập")

    def test_render_log(self):
        def paint(i, recorder=None):
            canvas = Canvas(recorder=recorder)
            layer = canvas.layer((360, 130))
            components.badge(layer, (0, 0, 350, 120), "Đang chờ", id="hang")
            canvas.composite(layer, (120 + i, 500))
            discarded = canvas.layer()
            text.draw_text(discarded, "Không ghép", (10, 20))
            target = (129, 761, 375, 971)
            sticker = Image.new("RGBA", (20, 20), "#123456")
            components.sticker(canvas, sticker, target, id="cao")
            text.attach_label(canvas, target, "Cáo", "right", attach_to="cao")
            kinetic.kinetic_text(canvas, "TẢI", (618, 708), .8, role="keyword",
                                 attach_to="hang", target_bbox=(120, 500, 470, 620))
            text.draw_text(canvas, "Trong suốt", (550, 740), color=(90, 90, 90, 0))
            return canvas.image

        expected = paint(0)
        log = RenderLog(30, SIZE)
        for i in range(4):
            log.begin_frame("S05", 12 + i / 30)
            image = paint(i, log)
            log.end_frame()
            if i == 0:
                self.assertEqual(expected.tobytes(), image.tobytes())
        log.begin_frame("S05", 12 + 5 / 30)
        paint(3)
        log.end_frame()
        path = self.out / "render-log.json"
        self.assertEqual(sequence.write_render_log(log, path), json.loads(path.read_text(encoding="utf8")))
        events = json.loads(path.read_text(encoding="utf8"))["events"]
        badges = [e for e in events if e.get("name") == "badge"]
        self.assertEqual([e["bbox"] for e in badges], [[121, 500, 472, 621], [123, 500, 474, 621], [123, 500, 474, 621]])
        self.assertEqual([(e["start"], e["end"]) for e in badges], [(12, 12.1), (12.1, 12.133333), (12.166667, 12.2)])
        keyword = next(e for e in events if e.get("role") == "keyword")
        self.assertEqual((keyword["text"], keyword["effect"], keyword["attach_to"], keyword["target_bbox"]),
                         ("TẢI", "kinetic", "hang", [120, 500, 470, 620]))
        fox = next(e for e in events if e.get("role") == "mascot")
        label = next(e for e in events if e.get("text") == "Cáo")
        self.assertEqual(fox["id"], label["attach_to"])
        self.assertFalse(any(e.get("text") in {"Không ghép", "Trong suốt"} for e in events))

    def test_header_track(self):
        log = RenderLog(30, SIZE)
        log.begin_frame("S01", 0)
        box = header.header_card(Canvas(), self.spec, "top")
        log.end_frame()
        self.assertTrue(inside(box))
        self.assertLessEqual((box[2] - box[0]) * (box[3] - box[1]), .09 * SIZE[0] * SIZE[1])
        self.assertLessEqual(box[3] - box[1], 200)
        self.assertLessEqual(box[2] - box[0], 972)
        events = log.write(self.out / "header.json")["events"]
        by_role = {e.get("role"): e for e in events}
        self.assertGreaterEqual(by_role["header_title"]["px"], 52)
        self.assertGreaterEqual(by_role["header_topic"]["px"], 40)
        with self.assertRaises(ValueError):
            header.header_card(Canvas(), header.HeaderSpec("Chủ đề", "Tiêu đề quá dài " * 30), "top")
        slot, after, moved = header.choose_slot("top", [(90, 250, 990, 480)], spec=self.spec)
        self.assertEqual(slot, "above_captions")
        self.assertTrue(moved)
        self.assertGreaterEqual(CAPTION_BAND[1] - after[3], 24)
        self.assertTrue(header.choose_slot("top", [SAFE], spec=self.spec).overlap)

        plan = [("S02", 2.4, 4, "top_left"), ("S03", 4, 6, "above_captions")]
        track = header.HeaderTrack(self.spec, plan)
        self.assertGreaterEqual(track.coverage(6, 2.4), .95)
        log = RenderLog(30, SIZE)
        for i in range(17):
            at = 4 + (i - 2) / 30
            log.begin_frame("S02" if i < 2 else "S03", at)
            track.draw(Canvas(), at, [])
            log.end_frame()
        headers = [e for e in log.write(self.out / "track.json")["events"] if e["kind"] == "header"]
        for i in range(17):
            at = 4 + (i - 1.5) / 30
            self.assertTrue(any(e["start"] <= at < e["end"] for e in headers))
        self.assertEqual({e["slot"] for e in headers if e["start"] <= 4.2 < e["end"]},
                         {"top_left", "above_captions"})

    def test_opening_plate(self):
        log = RenderLog(30, SIZE)
        images = []
        for i in range(72):
            log.begin_frame("S01", i / 30)
            canvas = Canvas()
            header.opening_plate(canvas, self.spec.title, self.spec.topic, i / 30,
                                 style=header.OpeningStyle(symbol="database"), sfx_hint="Âm báo")
            if i in (0, 71):
                images.append(canvas.image.tobytes())
            log.end_frame()
        self.assertNotEqual(*images)
        events = log.write(self.out / "opening.json")["events"]
        self.assertEqual([(e["start"], e["end"]) for e in events if e["kind"] == "opening"], [(0, 2.4)])
        for e in [e for e in events if e.get("role") == "opening_title"]:
            self.assertTrue(inside(e["bbox"]))
            self.assertGreaterEqual(e["px"], 84)
        self.assertTrue(any(e.get("role") == "opening_title" for e in events))
        with self.assertRaises(ValueError):
            header.opening_plate(Canvas(), "một hai ba bốn năm sáu bảy tám chín", self.spec.topic, .5)
        limits = load_rules()["opening"]
        for duration in (limits["min_s"], limits["max_s"]):
            self.assertEqual(header.opening_plate(Canvas(), self.spec.title, self.spec.topic, .5,
                                                  duration=duration).size, SIZE)
        for duration in (limits["min_s"] - .1, limits["max_s"] + .1):
            with self.assertRaises(ValueError):
                header.opening_plate(Canvas(), self.spec.title, self.spec.topic, .5, duration=duration)
        scenes = [sequence.Scene(2.4, lambda t: None, "S01", role="opening"),
                  sequence.Scene(3, lambda t: None, "S02", role="hook", header=self.spec.title, header_slot="top")]
        rows = sequence.write_scenes_json(scenes, self.out / "scenes-d8.json")
        self.assertEqual(rows[0]["role"], "opening")
        self.assertIsNone(rows[0]["header"])
        self.assertEqual(rows[1]["header"], {"text": self.spec.title, "slot": "top"})
