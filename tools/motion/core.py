"""Vùng bố cục, màu và phép nội suy dựa trên Art của T8 và graphics của T5."""

import math
import os
import subprocess
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from tempfile import TemporaryDirectory

from PIL import Image, ImageColor, ImageDraw, ImageFont

from .renderlog import active_recorder

ROOT = Path(__file__).resolve().parents[2]
WIDTH, HEIGHT, FPS = 1080, 1920, 30
SIZE = (WIDTH, HEIGHT)
SAFE = (90, 250, 990, 1500)
CONTENT = (90, 250, 990, 1320)
CAPTION_BAND = (90, 1340, 990, 1500)
HEADER_ZONE = (90, 150, 990, 230)


@dataclass(frozen=True)
class Palette:
    """Màu mặc định của xưởng, có thể thay từng trường bằng dataclasses.replace."""

    background: str = "#122438"
    panel: str = "#142D44"
    card: str = "#23415C"
    ink: str = "#091928"
    edge: str = "#426581"
    text: str = "#F3F7FB"
    muted: str = "#9CB1C5"
    red: str = "#FF6B6B"
    amber: str = "#FFCB6B"
    blue: str = "#68CCF5"
    green: str = "#72D8A0"


PALETTE = Palette()


def clamp(x):
    """Giới hạn giá trị trong đoạn 0–1."""
    return max(0.0, min(1.0, x))


def progress(t, a, b):
    """Tiến độ tuyến tính 0–1 giữa hai mốc giây. Hai mốc trùng nhau tạo bước nhảy."""
    if b < a:
        raise ValueError("Mốc kết thúc phải từ mốc bắt đầu trở đi")
    return float(t >= a) if a == b else clamp((t - a) / (b - a))


def ease_in_out(x):
    """Tăng và giảm tốc mượt, như tween của T5."""
    x = clamp(x)
    return x * x * (3 - 2 * x)


def ease_out_back(x):
    """Vượt nhẹ điểm cuối trước khi trở về vị trí đích."""
    x = clamp(x) - 1
    return 1 + x * x * (2.70158 * x + 1.70158)


def ease_out_cubic(x):
    """Vào nhanh rồi giảm tốc về đích."""
    return 1 - (1 - clamp(x)) ** 3


def spring(x, damping=7, oscillations=1.5):
    """Dao động tắt dần, chốt tại đích khi hết khoảng chuyển động."""
    x = clamp(x)
    if x == 1:
        return 1.0
    return 1 - math.exp(-damping * x) * math.cos(math.tau * oscillations * x)


def lerp(a, b, p):
    """Nội suy một giá trị số, cho phép vượt đích khi easing cần."""
    return a + (b - a) * p


def rgba(color):
    """Đổi tên màu, mã hex hoặc bộ RGB/RGBA về RGBA."""
    channels = ImageColor.getcolor(color, "RGBA") if isinstance(color, str) else tuple(color)
    return (*channels, 255) if len(channels) == 3 else channels


def blend(a, b, p):
    """Trộn hai màu và cả alpha theo tỉ lệ 0–1, trả bộ RGBA."""
    return tuple(round(lerp(x, y, clamp(p))) for x, y in zip(rgba(a), rgba(b)))


@lru_cache(maxsize=192)
def font(px, weight="regular"):
    """Tải Segoe UI. Dự phòng bằng Arial, DejaVu Sans, Liberation Sans hoặc Noto Sans."""
    variants = {
        "regular": ("segoeui.ttf", "arial.ttf", "DejaVuSans.ttf", "LiberationSans-Regular.ttf", "NotoSans-Regular.ttf"),
        "semibold": ("seguisb.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf", "LiberationSans-Bold.ttf", "NotoSans-Bold.ttf"),
        "bold": ("segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf", "LiberationSans-Bold.ttf", "NotoSans-Bold.ttf"),
    }
    if weight not in variants or px < 1:
        raise ValueError("Cỡ chữ phải dương, weight là regular, semibold hoặc bold")
    fonts = Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts"
    for name in variants[weight]:
        for candidate in (fonts / name, name):
            try:
                return ImageFont.truetype(str(candidate), px)
            except OSError:
                continue
    raise RuntimeError("Cần một phông Unicode hỗ trợ tiếng Việt như Segoe UI hoặc DejaVu Sans")


@lru_cache(maxsize=8)
def _background(paths, size):
    frame = Image.new("RGBA", size)
    for path in paths:
        with Image.open(path) as image:
            layer = image.convert("RGBA")
        if layer.size != size:
            layer = layer.resize(size, Image.Resampling.LANCZOS)
        frame.alpha_composite(layer)
    return frame


def load_background(*paths, size=SIZE):
    """Ghép ảnh nền có sẵn theo thứ tự xa, giữa, gần. Trả bản sao từ bộ nhớ đệm."""
    return _background(tuple(Path(path).resolve() for path in paths), tuple(size)).copy()


class Canvas:
    """Khung RGBA có palette, nhận nền màu hoặc ảnh Pillow đã chuẩn bị."""

    def __init__(self, background=None, *, palette=PALETTE, size=SIZE, recorder=None):
        self.palette = palette
        self.recorder = active_recorder() if recorder is None else recorder
        self._events = None
        if isinstance(background, Image.Image):
            self.image = background.convert("RGBA")
        else:
            self.image = Image.new("RGBA", size, palette.background if background is None else background)
        self.draw = ImageDraw.Draw(self.image)

    def layer(self, size=None):
        """Tạo Canvas trong suốt cùng palette, có thể giới hạn kích thước lớp."""
        layer = Canvas((0, 0, 0, 0), palette=self.palette, size=size or self.image.size, recorder=self.recorder)
        layer._events = []
        return layer

    def record(self, kind, **fields):
        """Ghi sự kiện theo tọa độ Canvas. Sự kiện của lớp chờ đến lúc ghép vào khung."""
        if self.recorder is None:
            return
        if (bbox := fields.get("bbox")) is not None:
            clipped = (max(0, bbox[0]), max(0, bbox[1]), min(self.image.width, bbox[2]),
                       min(self.image.height, bbox[3]))
            if clipped[0] >= clipped[2] or clipped[1] >= clipped[3]:
                return
            fields["bbox"] = clipped
        event = {"kind": kind, **fields}
        if self._events is None:
            self.recorder.add(event)
        else:
            self._events.append(event)

    def _record_layer(self, layer, xy, scale=(1, 1)):
        for event in layer._events or ():
            fields = dict(event)
            for key in ("bbox", "target_bbox"):
                if fields.get(key) is not None:
                    fields[key] = tuple(value * scale[i % 2] + xy[i % 2]
                                        for i, value in enumerate(fields[key]))
            if "px" in fields and scale[1] != 1:
                fields["px"] = fields["px"] * scale[1]
            self.record(fields.pop("kind"), **fields)

    def composite(self, layer, xy=(0, 0)):
        """Ghép một Canvas hoặc ảnh RGBA theo alpha tại tọa độ xy."""
        image = layer.image if isinstance(layer, Canvas) else layer
        xy = tuple(map(round, xy))
        self.image.alpha_composite(image, xy)
        if self.recorder is not None and isinstance(layer, Canvas):
            self._record_layer(layer, xy)
        return self

    def save(self, path):
        """Lưu khung hiện tại thành PNG."""
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        self.image.save(path, format="PNG")
        return path


def encode_frames(frames, out_mp4, fps=FPS, *, size=SIZE):
    """Đẩy ảnh RGBA thô qua pipe theo cách dựng T8. Chỉ thay MP4 khi mã hóa thành công."""
    if not math.isfinite(fps) or fps <= 0 or any(side <= 0 or side % 2 for side in size):
        raise ValueError("FPS phải dương và kích thước H.264 yuv420p phải là số chẵn dương")
    out = Path(out_mp4)
    out.parent.mkdir(parents=True, exist_ok=True)
    with TemporaryDirectory(prefix="motion-", dir=out.parent) as folder:
        encoded = Path(folder) / "video.mp4"
        command = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-f", "rawvideo",
                   "-pixel_format", "rgba", "-video_size", f"{size[0]}x{size[1]}",
                   "-framerate", str(fps), "-i", "pipe:0", "-an", "-c:v", "libx264",
                   "-threads", "4", "-preset", "veryfast", "-crf", "18", "-pix_fmt",
                   "yuv420p", "-movflags", "+faststart", str(encoded)]
        with (Path(folder) / "ffmpeg.log").open("w+b") as log:
            with subprocess.Popen(command, stdin=subprocess.PIPE, stderr=log) as process:
                try:
                    with process.stdin as pipe:
                        for frame in frames:
                            if frame.mode != "RGBA" or frame.size != size:
                                raise ValueError(f"Mỗi khung phải là ảnh RGBA {size[0]}×{size[1]}")
                            pipe.write(frame.tobytes())
                except BrokenPipeError:
                    pass
                except BaseException:
                    process.kill()
                    raise
                code = process.wait()
            if code or not encoded.is_file() or not encoded.stat().st_size:
                log.seek(0)
                raise RuntimeError(f"FFmpeg thoát mã {code}: {log.read().decode('utf-8', 'replace')}")
        encoded.replace(out)
    return out
