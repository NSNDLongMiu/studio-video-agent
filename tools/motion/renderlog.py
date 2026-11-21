"""Nhật ký các thành phần thực sự được vẽ, dùng giờ toàn video."""

import json
import math
from collections import defaultdict
from contextlib import contextmanager
from contextvars import ContextVar
from pathlib import Path
from statistics import median


_active = ContextVar("motion_renderlog", default=None)
_INTENTS = {"ui_appear", "transition", "alert", "data_move", "highlight", "interaction",
            "impact_hook", "impact_reveal", "impact_risk", "silence"}


def active_recorder():
    return _active.get()


class RenderLog:
    """Ghi theo khung rồi gộp các sự kiện kề nhau có hình học ổn định."""

    def __init__(self, fps, size):
        if not math.isfinite(fps) or fps <= 0 or len(size) != 2 or min(size) <= 0:
            raise ValueError("FPS và kích thước nhật ký phải dương")
        self.fps = fps
        self.size = tuple(size)
        self.events = []
        self._runs = {}
        self._frame = None
        self._last = -math.inf
        self._shown = set()
        self._layouts = {}
        self._first = {}
        self._camera_runs = {}
        self._camera_frame = {}

    def begin_frame(self, scene_id, t_global):
        if self._frame is not None or not math.isfinite(t_global) or t_global < 0 or t_global <= self._last:
            raise ValueError("Mốc khung phải tăng theo giờ toàn video và từng khung phải được kết thúc")
        self._frame = []
        self._time = t_global
        self._scene = scene_id
        self._token = _active.set(self)

    @contextmanager
    def scene(self, scene_id):
        """Gắn sự kiện với cảnh nguồn khi hai cảnh cùng hiện trong một khung."""
        previous = self._scene
        self._scene = scene_id
        try:
            yield
        finally:
            self._scene = previous

    def add(self, event_dict):
        """Thêm sự kiện trong khung đang dựng. Bỏ qua lời gọi ngoài khung."""
        if self._frame is not None:
            self._frame.append({**event_dict, "scene": self._scene})

    def cue(self, t, intent, weight, scene=None, target=None):
        """Gắn cue vào đối tượng có ID đã vẽ trong khung hiện tại. t là giây toàn video hoặc None."""
        if self._frame is None or (t is not None and not math.isclose(t, self._time, abs_tol=1e-6)):
            return False
        scene = self._scene if scene is None else scene
        for event in self._frame:
            if target is not None and (event.get("id") or event.get("phase")) == target and event["scene"] == scene:
                event["cue"] = {"intent": intent, "weight": weight}
                return True
        return False

    def layout(self, archetype, occupancy):
        """Khai bố cục một lần cho cảnh đang dựng. Gắn vào sự kiện đầu khi xuất."""
        if self._frame is not None:
            self._layouts.setdefault(self._scene, {"archetype": archetype, "occupancy": list(occupancy)})

    def camera(self, zoom, crop, reason, adjustment=None):
        """Nhận một mẫu camera để gộp thành đoạn chuyển động thực."""
        if self._frame is not None:
            self._camera_frame[self._scene, reason] = zoom, crop, adjustment

    def end_frame(self):
        if self._frame is None:
            raise ValueError("Chưa bắt đầu khung để ghi nhật ký")
        try:
            self._merge_frame()
            self._merge_cameras()
        finally:
            self._frame = None
            _active.reset(self._token)

    def _merge_frame(self):
        current = defaultdict(list)
        for event in self._frame:
            cue = event.pop("cue", None)
            geometry = {k: tuple(event[k]) for k in ("bbox", "target_bbox") if event.get(k) is not None}
            fields = {k: v for k, v in event.items() if k not in (*geometry, "px", "layout")}
            key = tuple(geometry), json.dumps(fields, sort_keys=True, ensure_ascii=False)
            candidates = self._runs.get(key, [])
            match = next((i for i, run in enumerate(candidates)
                          if abs(run.end - self._time) < 1e-6 and run.matches(geometry)), None)
            run = candidates.pop(match) if match is not None else _Run(event, geometry, self._time)
            scene = event["scene"]
            self._first.setdefault(scene, run)
            identity = (scene, event["kind"], event.get("id") or event.get("phase") or key)
            if cue is not None:
                if cue.get("intent") not in _INTENTS or cue.get("weight") not in {"low", "medium", "high"}:
                    raise ValueError("Cue cần intent và weight hợp lệ")
                if identity not in self._shown:
                    run.fields["cue"] = cue
            self._shown.add(identity)
            run.append(event, geometry, self._time + 1 / self.fps)
            current[key].append(run)
        self.events.extend(run.event() for runs in self._runs.values() for run in runs)
        self._runs = current
        self._last = self._time

    def _merge_cameras(self):
        current = {}
        end = self._time + 1 / self.fps
        for (scene, reason), (zoom, crop, adjustment) in self._camera_frame.items():
            key = scene, reason
            run = self._camera_runs.pop(key, None)
            if run is None or not math.isclose(run["sample_end"], self._time, abs_tol=1e-6):
                self._finish_camera(run)
                run = {"kind": "camera", "scene": scene, "start": self._time, "end": self._time,
                       "zoom_from": zoom, "zoom_to": zoom, "crop_from": crop, "crop_to": crop,
                       "reason": reason, "adjustment": None}
            if (zoom, crop) != (run["zoom_to"], run["crop_to"]):
                run.update(zoom_to=zoom, crop_to=crop, end=end)
            if adjustment:
                run["adjustment"] = adjustment
            run["sample_end"] = end
            current[key] = run
        for run in self._camera_runs.values():
            self._finish_camera(run)
        self._camera_runs = current
        self._camera_frame.clear()

    @staticmethod
    def _camera_event(run):
        if run is None or run["end"] == run["start"]:
            return None
        event = {k: v for k, v in run.items() if k not in {"sample_end", "adjustment"}}
        if run["adjustment"]:
            event["reason"] += f" ({run['adjustment']})"
        for key in ("start", "end", "zoom_from", "zoom_to"):
            event[key] = round(event[key], 6)
        for key in ("crop_from", "crop_to"):
            event[key] = [round(value, 6) for value in event[key]]
        return event

    def _finish_camera(self, run):
        if (event := self._camera_event(run)) is not None:
            self.events.append(event)

    def write(self, path):
        if self._frame is not None:
            raise ValueError("Kết thúc khung trước khi ghi nhật ký")
        events = self.events + [run.event() for runs in self._runs.values() for run in runs]
        events.extend(filter(None, map(self._camera_event, self._camera_runs.values())))
        # Khung đầu có thể gồm nhiều nét. Đưa nét được ghi đầu lên trước khi các mốc bằng nhau.
        first = {scene: run.event() for scene, run in self._first.items() if scene in self._layouts}
        for scene, event in first.items():
            events.remove(event)
            event["layout"] = self._layouts[scene]
            events.insert(0, event)
        events.sort(key=lambda event: event["start"])
        data = {"version": 1, "fps": self.fps, "size": list(self.size), "events": events}
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False) + "\n", encoding="utf-8")
        return data


class _Run:
    def __init__(self, event, geometry, start):
        self.fields = event
        self.geometry = geometry
        self.start = start
        self.end = start
        self.boxes = {key: [] for key in geometry}
        self.sizes = []

    def matches(self, geometry):
        return all(abs(a - b) <= 2 for key, box in geometry.items()
                   for a, b in zip(box, self.geometry[key]))

    def append(self, event, geometry, end):
        for key, box in geometry.items():
            self.boxes[key].append(box)
        if "px" in event:
            self.sizes.append(event["px"])
        self.end = end

    def event(self):
        row = {**self.fields, "start": round(self.start, 6), "end": round(self.end, 6)}
        for key, boxes in self.boxes.items():
            row[key] = [median(axis) for axis in zip(*boxes)]
        if self.sizes:
            row["px"] = median(self.sizes)
        return row
