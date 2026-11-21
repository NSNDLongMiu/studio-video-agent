"""Kiểm opening, mẫu cảnh, crop và nhật ký ở khung thật."""
import hashlib
import json
import math
import os
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from PIL import Image, ImageChops, ImageDraw, ImageStat

from tools.config.rules import load_rules
from tools.motion import Canvas, RenderLog, choose_style, opening_sequence, render_scene_kind
from tools.motion.layouts import resolve_layout, scene_settings, suggest_layout
from tools.motion.overlaps import find_overlaps, measure_frame
from tools.motion.props import _contrast
from tools.motion.backdrops import backdrop, suggest_backdrop
from tools.motion.core import PALETTE, font
from tools.motion.opening import visual_config
from tools.motion.sequence import camera


STYLES = load_rules()["opening"]["styles"]
NODES = [{"id": "a", "label": "Khung chat", "object": "browser"},
         {"id": "b", "label": "Tiện ích", "object": "extension"},
         {"id": "c", "label": "Máy chủ", "object": "server"}]
LINKS = [{"from": "a", "to": "b", "kind": "normal", "stop_t": 1.2, "resume_t": 2}, {"from": "b", "to": "c", "kind": "leaking"},
         {"from": "a", "to": "c", "kind": "blocked"}]
SAMPLES = {
    "ui_simulation": {"app": "dialog", "states": [
        {"t": 0, "state": "request", "label": "Cấp quyền?"},
        {"t": 1, "state": "scope", "label": "Phạm vi", "data": ["Thẻ đang mở", "Dữ liệu trang"]},
        {"t": 2, "state": "consequence", "label": "Lộ dữ liệu"}],
        "cursor_path": [{"t": 0, "x": .2, "y": .3}, {"t": 2.5, "x": .7, "y": .93}]},
    "before_after": {"before": {"label": "Ngoài quyền", "state": "ok", "object": "browser"},
                     "after": {"label": "Có quyền", "state": "warn", "object": "browser"}},
    "data_flow": {"nodes": NODES, "edges": LINKS},
    "animated_diagram": {"nodes": NODES, "edges": LINKS},
    "detail_focus": {"target": "Quyền đọc", "zoom": 9, "keep_in_safe_area": True},
    "problem_cause_consequence": dict(zip(("problem", "cause", "consequence"), NODES)),
    "step_by_step": {"steps": [{"label": "Khung chat", "object": "browser"},
                              {"label": "Câu gửi", "object": "bubble", "t": 1.2},
                              {"label": "Câu trả lời", "object": "chat", "t": 2.1}]},
    "character_explanation": {"pose": "point_right", "gesture": "point_right",
                              "label": "Phạm vi", "object": "browser"},
}


def _export(frame, label):
    if out := os.environ.get("T3_EVIDENCE"):
        path = Path(out)
        path.mkdir(parents=True, exist_ok=True)
        frame.resize((360, 640), Image.Resampling.LANCZOS).save(path / f"{label}.png")


def _draw(log, scene, t, fn):
    log.begin_frame(scene, t)
    try:
        return fn(t)
    finally:
        log.end_frame()


def _events(log):
    with TemporaryDirectory() as tmp:
        path = Path(tmp) / "log.json"
        log.write(path)
        return json.loads(path.read_text(encoding="utf-8"))["events"]


def _contained(box, bounds, tolerance=1e-5):
    return all(bounds[i] - tolerance <= box[i] <= box[i + 2] <= bounds[i + 2] + tolerance
               for i in range(2))


class VisualChecks(unittest.TestCase):
    def check_opening(self, style):
        config = visual_config()
        # Dựng và đo từng khung ở tốc độ 30 fps.
        for duration in (5, 6.5, 8):
            scene = opening_sequence(style, "Tiện ích đọc gì?", "Bảo mật", duration)
            fps = 30
            frame_count = round(scene.duration * fps)
            self.assertEqual(frame_count, {5: 150, 6.5: 195, 8: 240}[duration])
            log = RenderLog(fps, (1080, 1920))
            probe = config["motion_probe"]
            static_frames = 0
            max_static_frames = 0
            previous = None
            for index in range(frame_count):
                t = index / fps
                frame = _draw(log, scene.id, t, scene.render)
                self.assertEqual(frame.size, log.size)
                small = frame.convert("RGB").resize(tuple(probe["size"]))
                if previous is None:
                    self.assertGreater(max(ImageStat.Stat(small).var), 100)
                else:
                    delta = max(ImageStat.Stat(ImageChops.difference(small, previous)).mean)
                    static_frames = static_frames + 1 if delta < probe["min_mean_delta"] else 0
                    max_static_frames = max(max_static_frames, static_frames)
                previous = small
                if duration == 6.5:
                    a, b, _ = config["phase_ratios"]
                    marks = (0, math.ceil(a * frame_count), math.ceil((a + b / 2) * frame_count),
                             math.ceil((a + b) * frame_count), frame_count - 1)
                    if index in marks:
                        _export(frame, f"{style}-{marks.index(index)}-{index:03}")
            self.assertLessEqual(max_static_frames / fps, config["max_static_s"],
                                 f"{style} {duration} s: {max_static_frames} khung ít đổi")
            rows = _events(log)
            phases = [e for e in rows if e["kind"] == "phase"]
            self.assertEqual([e["phase"] for e in phases], load_rules()["opening"]["phases"])
            self.assertEqual([e["cue"]["intent"] for e in phases],
                             [phase[-1] for phase in config["styles"][style]["phases"]])
            self.assertTrue(any(e["kind"] == "camera" for e in rows))
            titles = [e for e in rows if e.get("role") == "opening_title"]
            self.assertTrue(titles)
            self.assertTrue(all(e["px"] >= load_rules()["opening"]["title_px_min"]
                                and _contained(e["bbox"], load_rules()["frame"]["safe_bbox"]) for e in titles))
            self.assertEqual({e["attach_to"] for e in rows if e.get("effect") == "kinetic"}, {"opening-subject"})
            print(f"{style} {duration} s: {frame_count} khung, ít đổi tối đa {max_static_frames / fps:.3f} s")

    def test_selection_and_match(self):
        hints = {"intent": "warning", "opening": {"style": "surprise"}}
        self.assertEqual(choose_style(hints)[0], "surprise")
        self.assertEqual(choose_style(hints), choose_style(hints))
        for hints, expected in (({"intent": "warning"}, "warning"), ({"has_incident": True}, "incident"),
                                ({"topic": "Nếu tiện ích"}, "hypothetical"),
                                ({"has_metrics": True}, "surprise"), ({"intent": "question"}, "question")):
            self.assertEqual(choose_style(hints)[0], expected)
        following = Image.new("RGBA", (1080, 1920), "red")
        scene = opening_sequence("question", "Tiện ích", "Bảo mật", 6, {"next_frame": following})
        self.assertEqual(scene.render(6).tobytes(), following.tobytes())

    def test_scene_kinds(self):
        default_dialog = {"app": "dialog"}
        for moment, expected in ((0, "permission"), (1.5, "ui-granted"), (3, "ui-consequence")):
            events = render_scene_kind("ui_simulation", default_dialog, moment, 3).info["scene_events"]
            self.assertIn(expected, {event.get("id") for event in events})
        safe = load_rules()["frame"]["safe_bbox"]
        settings = scene_settings()
        evidence, stats = {}, []
        for kind, params in SAMPLES.items():
            with self.subTest(kind=kind):
                log = RenderLog(2, (1080, 1920))
                frames, hashes = [], []
                for i in range(7):
                    moment = i / 2
                    frame = _draw(log, kind, moment, lambda t: render_scene_kind(
                        kind, params, t, 3, header_slot="above_captions", recorder=log))
                    if i not in (0, 3, 6):
                        continue
                    self.assertEqual(frame.size, log.size)
                    repeated = render_scene_kind(kind, params, moment, 3, header_slot="above_captions")
                    digest = hashlib.sha256(frame.tobytes()).digest()
                    self.assertEqual(digest, hashlib.sha256(repeated.tobytes()).digest())
                    hashes.append(digest)
                    metrics = measure_frame(frame)
                    stats.append(metrics)
                    self.assertGreaterEqual(metrics["width_fraction"], settings["min_width_fraction"], metrics)
                    self.assertGreaterEqual(metrics["height_fraction"], settings["min_height_fraction"], metrics)
                    self.assertLessEqual(metrics["center_offset"], settings["max_center_offset"], metrics)
                    self.assertLessEqual(metrics["largest_empty"], settings["max_empty_fraction"], metrics)
                    self.assertGreaterEqual(metrics["min_label_px"], settings["min_label_px"])
                    self.assertFalse(metrics["has_overlaps"], metrics["overlaps"])
                    events = frame.info["scene_events"]
                    self.assertTrue(all(_contained(event["bbox"], safe) for event in events if "bbox" in event))
                    self.assertTrue(any(event.get("name") in {"browser_window", "chat_bubble", "extension_icon",
                                    "server_rack", "document_card", "magnified_detail"} for event in events))
                    if kind == "before_after":
                        ids = {event.get("id") for event in events}
                        self.assertTrue({"before", "after", "before-art", "after-art"} <= ids)
                    if kind == "ui_simulation":
                        self.assertTrue(any(event.get("name") == ("permission_dialog" if i == 0 else "badge")
                                            for event in events))
                    frames.append(frame.resize((288, 512), Image.Resampling.LANCZOS))
                self.assertEqual(len(set(hashes)), 3)
                rows = _events(log)
                evidence[kind] = frames
                self.assertIn("layout", rows[0])
                labels = [event for event in rows if event["kind"] == "text"]
                ids = {event.get("id") for event in rows if event["kind"] == "component"}
                self.assertTrue(labels and all(event.get("attach_to") in ids for event in labels), labels)
                self.assertTrue(any(event.get("cue") for event in rows))
                self.assertFalse(find_overlaps(rows))
                if kind == "detail_focus":
                    moves = [event for event in rows if event["kind"] == "camera"]
                    self.assertTrue(moves)
                    self.assertTrue(all(move["zoom_to"] <= load_rules()["camera"]["max_zoom"] for move in moves))
                    self.assertTrue(all(_contained(move["crop_to"], (0, 0, *log.size)) for move in moves))
        if stats:
            print(json.dumps({
                "frames": len(stats),
                "min_width_fraction": round(min(m["width_fraction"] for m in stats), 4),
                "min_height_fraction": round(min(m["height_fraction"] for m in stats), 4),
                "max_center_offset": round(max(m["center_offset"] for m in stats), 4),
                "max_empty_fraction": round(max(m["largest_empty"] for m in stats), 4),
                "min_label_px": min(m["min_label_px"] for m in stats),
                "overlaps": sum(len(m["overlaps"]) for m in stats),
            }))
        if out := os.environ.get("T3_EVIDENCE"):
            out = Path(out)
            out.mkdir(parents=True, exist_ok=True)
            sheet = Image.new("RGB", (864, 538 * len(evidence)), "#080F1A")
            draw = ImageDraw.Draw(sheet)
            for row, (kind, frames) in enumerate(evidence.items()):
                for col, frame in enumerate(frames):
                    y = row * 538
                    draw.text((col * 288 + 8, y + 3), f"{kind} · {(0, 1.5, 3)[col]} s", font=font(16), fill="white")
                    sheet.paste(frame, (col * 288, y + 26))
            sheet.save(out / "T3b-contact-sheet.png")
            for i in range(0, len(evidence), 2):
                sheet.crop((0, i * 538, 864, min(i + 2, len(evidence)) * 538)).save(out / f"T3b-rows-{i+1}-{i+2}.png")

    def test_rich_scene_overlaps(self):
        events = [
            {"kind": "component", "id": "extension", "bbox": [0, 0, 100, 100], "start": 0, "end": 2},
            {"kind": "component", "id": "doc", "bbox": [100, 0, 200, 100], "start": 0, "end": 2},
            {"kind": "component", "id": "star", "parent": "extension", "bbox": [15, 15, 25, 25],
             "start": 0, "end": 2},
            {"kind": "text", "text": "Bản sao", "attach_to": "doc", "gap": 24, "bbox": [70, 10, 150, 50],
             "start": 1, "end": 2},
            {"kind": "text", "text": "Xuất hiện sau", "bbox": [70, 10, 150, 50], "start": 2, "end": 3},
        ]
        overlaps = find_overlaps({"version": 1, "events": events})
        self.assertEqual({(hit["a"]["id"], hit["b"]["text"]) for hit in overlaps},
                         {("doc", "Bản sao"), ("extension", "Bản sao")})
        self.assertFalse(find_overlaps(events, ignore=[("doc", "Bản sao"), ("extension", "Bản sao")]))
        self.assertEqual(suggest_backdrop("body", "warning"), "warning")
        image = backdrop("warning", (1080, 1920))
        sample = image.resize((36, 64))
        colors = (sample.getpixel((x, y)) for y in range(sample.height) for x in range(sample.width))
        minimum = min(_contrast(PALETTE.text, color) for color in colors)
        self.assertGreaterEqual(minimum, scene_settings()["min_contrast"])
        self.assertEqual(image.tobytes(), backdrop("warning", image.size, t=3).tobytes())
        print(f"Tương phản chữ/nền cảnh báo thấp nhất: {minimum:.2f}:1")
    def test_camera_log_and_layout(self):
        names = visual_config()["scene"]["layouts"]
        self.assertEqual(len({resolve_layout(name).occupancy for name in names}), len(names))
        self.assertNotEqual(suggest_layout(["radial"], "animated_diagram"), "radial")
        safe = load_rules()["frame"]["safe_bbox"]
        img = Canvas().image
        log = RenderLog(4, img.size)
        for i in range(5):
            _draw(log, "zoom", i / 4, lambda t: camera(
                img, 1 + 8 * t, (9, -9), target_bbox=safe,
                keep_in_safe_area=True, reason="Chi tiết ở mép", recorder=log))
        self.assertEqual(_events(log), [])  # Mọi crop khả thi đều là khung gốc.
        for i in range(5, 10):
            _draw(log, "zoom", i / 4, lambda t: camera(
                img, 1 + 8 * (t - 1.25), (9, -9), target_bbox=(150, 360, 920, 1470),
                keep_in_safe_area=True, reason="Chi tiết ở mép", recorder=log))
        [event] = _events(log)
        self.assertLess(event["zoom_to"], load_rules()["camera"]["max_zoom"])
        for crop in (event["crop_from"], event["crop_to"]):
            self.assertTrue(_contained(crop, (0, 0, *img.size)))
        self.assertIn("giảm zoom", event["reason"])

    def test_cue_first_visible_frame_and_legacy_fields(self):
        log = RenderLog(2, (1080, 1920))
        for i in range(3):
            log.begin_frame("S01", i / 2)
            log.layout("center_stage", (140, 390, 940, 1200))
            log.add({"kind": "component", "id": "a", "name": "panel", "bbox": (140, 400, 900, 1100)})
            if i:
                self.assertTrue(log.cue(i / 2, "ui_appear", "medium", target="a"))
                log.add({"kind": "component", "id": "b", "name": "panel", "bbox": (140, 420, 900, 900)})
                log.cue(i / 2, "ui_appear", "medium", target="b")
            log.end_frame()
        a, b = _events(log)
        self.assertIn("layout", a)
        self.assertNotIn("cue", a)
        self.assertEqual(b["start"], .5)
        self.assertEqual(b["cue"], {"intent": "ui_appear", "weight": "medium"})


def _opening_test(style):
    def run(self):
        self.check_opening(style)
    return run


for _style in STYLES:
    setattr(VisualChecks, "test_opening_" + _style, _opening_test(_style))
