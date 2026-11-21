"""Tạo lớp phụ đề ASS cố định ở dải dưới và chuẩn bị lệnh FFmpeg/libass."""

import math
import re
import unicodedata
from dataclasses import dataclass
from pathlib import Path

from .core import CAPTION_BAND, HEIGHT, PALETTE, WIDTH, rgba
from .text import _wrap, measure

_STYLE_FIELDS = ("Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,"
                 "Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,"
                 "Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding")
_EVENT_FIELDS = "Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text"
_MAX_CHARS = 28


@dataclass(frozen=True)
class Cue:
    """Một đoạn phụ đề thuần văn bản với đầu và cuối tính theo giây."""

    start: float
    end: float
    text: str


@dataclass(frozen=True)
class CaptionStyle:
    """Chữ đậm neo dưới, viền 4 px hoặc nền tối bán trong suốt."""

    font_name: str = "Segoe UI"
    font_size: int = 56
    margin_v: int = 425
    margin_lr: int = 100
    border_style: int = 1
    text_color: str = PALETTE.text
    dark: tuple = (9, 25, 40, 202)


def _timestamp(cs):
    minutes, rest = divmod(cs, 6000)
    hours, minutes = divmod(minutes, 60)
    seconds, fraction = divmod(rest, 100)
    return f"{hours}:{minutes:02d}:{seconds:02d}.{fraction:02d}"


def _parse_clock(value, digits, separator):
    match = re.fullmatch(r"(\d+):([0-5]\d):([0-5]\d)" + separator + rf"(\d{{{digits}}})", value)
    if match is None:
        raise ValueError(f"Mốc phụ đề không hợp lệ: {value!r}")
    hours, minutes, seconds, fraction = map(int, match.groups())
    return (hours * 3600 + minutes * 60 + seconds) * 10 ** digits + fraction


def _read_srt(path):
    source = Path(path).read_text(encoding="utf-8-sig").strip()
    if not source:
        return []
    cues = []
    for block in re.split(r"(?:\n[^\S\n]*){2,}", source):
        lines = block.splitlines()
        if lines[0].strip().isdigit():
            lines.pop(0)
        match = re.fullmatch(r"\s*(\S+)\s+-->\s+(\S+)(?:\s+.*)?", lines[0] if lines else "")
        if match is None or len(lines) < 2:
            raise ValueError(f"Cue SRT không hợp lệ: {block!r}")
        start, end = (_parse_clock(value, 3, "[,.]") / 1000 for value in match.groups())
        value = re.sub(r"</?(?:[biu]|font(?:\s+[^>]*)?)>", "", "\n".join(lines[1:]), flags=re.I)
        cues.append(Cue(start, end, value))
    return cues


def _ass_color(color):
    r, g, b, a = rgba(color)
    return f"&H{255 - a:02X}{b:02X}{g:02X}{r:02X}"


def _check_layout(px, left, right, down, border=4):
    # Libass dùng chiều cao dòng của phông. Chừa khoảng cho dấu, viền và cả hai dòng.
    if any(type(value) is not int for value in (px, left, right, down)):
        raise ValueError("Cỡ chữ và lề ASS phải là số nguyên px")
    foot = HEIGHT - down
    span = math.ceil(2.55 * px)
    if not (52 <= px <= 60 and CAPTION_BAND[0] + border <= left < WIDTH - right
            and right >= WIDTH - CAPTION_BAND[2] + border
            and CAPTION_BAND[1] + span <= foot <= CAPTION_BAND[3] - border):
        raise ValueError("Cỡ, lề hoặc chiều cao hai dòng ASS vượt dải phụ đề")
    return WIDTH - left - right - 2 * border


def _fits(line, px, width):
    return len(line) <= _MAX_CHARS and measure(line, px, "bold")[2] <= width * .94


def _balance(page, fits):
    if len(page) != 2:
        return page
    words = " ".join(page).split()
    candidates = [(" ".join(words[:i]), " ".join(words[i:])) for i in range(1, len(words))]

    def score(pair):
        left, right = pair
        pause = 6 if left.endswith((",", ".", ":", "?", "!", "…")) else 0
        return max(0, abs(len(left) - len(right)) - pause)

    return min((pair for pair in candidates if all(map(fits, pair))), key=score, default=page)


def _escape(text):
    # Ký tự vô hình sau dấu \ ngăn chuỗi gõ thật như \N thành lệnh xuống dòng.
    return text.replace("\\", "\\\u200b").replace("{", r"\{").replace("}", r"\}")


def build_ass(cues, style=None):
    """Trả văn bản ASS từ Cue, bộ (start,end,text), dict hoặc đường dẫn SRT.

    Cue dài được chia đều theo thời lượng thành các trang tối đa hai dòng.
    Khoảng cue được sắp theo giờ và phải rời nhau ở độ chính xác 1/100 giây.
    """
    style = CaptionStyle() if style is None else CaptionStyle(**style) if isinstance(style, dict) else style
    if style.border_style not in (1, 3) or not re.fullmatch(r"[^,\x00-\x1f]+", style.font_name):
        raise ValueError("Tên phông hoặc kiểu viền ASS không hợp lệ")
    width = _check_layout(style.font_size, style.margin_lr, style.margin_lr, style.margin_v)
    px = style.font_size
    if isinstance(cues, (str, Path)):
        cues = _read_srt(cues)
    rows = [row if isinstance(row, Cue) else Cue(**row) if isinstance(row, dict) else Cue(*row) for row in cues]
    events = []
    end_previous = 0
    for row in sorted(rows, key=lambda cue: cue.start):
        if not math.isfinite(row.start) or not math.isfinite(row.end) or row.start < 0:
            raise ValueError("Mốc phụ đề phải hữu hạn và không âm")
        start, end = round(row.start * 100), round(row.end * 100)
        if start < end_previous or end <= start:
            raise ValueError("Cue trùng thời gian hoặc ngắn hơn độ chính xác ASS")
        text = unicodedata.normalize("NFC", " ".join(row.text.split()))
        if not text or any(ord(char) < 32 for char in text):
            raise ValueError("Cue cần văn bản hiển thị hợp lệ")
        def fits(line):
            return _fits(line, px, width)

        lines = _wrap(text, fits)
        if lines is None:
            raise ValueError("Ký tự quá rộng với dải phụ đề")
        pages = [lines[i:i + 2] for i in range(0, len(lines), 2)]
        if end - start < len(pages):
            raise ValueError("Cue quá ngắn để chia thành các trang phụ đề")
        balance = all(map(fits, text.split()))
        for i, page in enumerate(pages):
            a = _timestamp(start + (end - start) * i // len(pages))
            b = _timestamp(start + (end - start) * (i + 1) // len(pages))
            if balance:
                page = _balance(page, fits)
            value = r"\N".join(map(_escape, page))
            events.append(f"Dialogue: 0,{a},{b},Default,,0,0,0,,{value}")
        end_previous = end

    primary, dark = _ass_color(style.text_color), _ass_color(style.dark)
    row = (f"Style: Default,{style.font_name},{px},{primary},{primary},{dark},{dark},"
           f"-1,0,0,0,100,100,0,0,{style.border_style},4,0,2,"
           f"{style.margin_lr},{style.margin_lr},{style.margin_v},1")
    script = ["[Script Info]", "ScriptType: v4.00+", f"PlayResX: {WIDTH}", f"PlayResY: {HEIGHT}",
              "WrapStyle: 2", "ScaledBorderAndShadow: yes", "", "[V4+ Styles]",
              f"Format: {_STYLE_FIELDS}", row, "", "[Events]", f"Format: {_EVENT_FIELDS}", *events]
    return "\n".join(script) + "\n"


def validate_ass(ass):
    """Kiểm tệp Path hoặc nội dung ASS theo định dạng thư viện. Trả True hoặc nêu lỗi."""
    source = ass.read_text(encoding="utf-8-sig") if isinstance(ass, Path) else ass
    info = set()
    style = None
    end_previous = 0
    section = ""
    for raw in source.splitlines():
        line = raw.strip()
        if not line or line.startswith(";"):
            continue
        if line in ("[Script Info]", "[V4+ Styles]", "[Events]"):
            section = line
        elif section == "[Script Info]":
            info.add(line)
        elif line == f"Format: {_STYLE_FIELDS}" and section == "[V4+ Styles]":
            info.add(line)
        elif line == f"Format: {_EVENT_FIELDS}" and section == "[Events]":
            info.add(line)
        elif line.startswith("Style: ") and section == "[V4+ Styles]" and style is None:
            fields = line[7:].split(",")
            if (len(fields) != 23 or fields[0] != "Default" or not fields[1]
                    or fields[7:15] != ["-1", "0", "0", "0", "100", "100", "0", "0"]
                    or fields[15] not in ("1", "3") or fields[16:19] != ["4", "0", "2"]):
                raise ValueError("Style ASS phải neo dưới, đậm, viền 4 px và không đổi tỷ lệ")
            px = int(fields[2])
            style = px, _check_layout(px, *map(int, fields[19:22]))
        elif line.startswith("Dialogue: ") and section == "[Events]" and style is not None:
            fields = line[10:].split(",", 9)
            if len(fields) != 10 or fields[0] != "0" or fields[3:9] != ["Default", "", "0", "0", "0", ""]:
                raise ValueError("Cue ASS phải dùng style mặc định và chỉ chứa văn bản")
            start, end = (_parse_clock(value, 2, r"\.") for value in fields[1:3])
            if start < end_previous or end <= start:
                raise ValueError("Cue ASS trùng thời gian hoặc có mốc không hợp lệ")
            end_previous = end
            if re.search(r"(?<!\\)[{}]|\\(?!N|[{}\u200b])", fields[9]):
                raise ValueError("Văn bản ASS chứa lệnh định dạng ngoài style mặc định")
            lines = fields[9].split(r"\N")
            plain = [value.replace(r"\{", "{").replace(r"\}", "}").replace("\\\u200b", "\\") for value in lines]
            if len(plain) > 2 or any(not value.strip() or not _fits(value, *style) for value in plain):
                raise ValueError("Cue ASS vượt hai dòng, 28 ký tự hoặc chiều rộng cho phép")
        else:
            raise ValueError(f"Dòng ASS ngoài định dạng hỗ trợ: {line!r}")
    expected = {"ScriptType: v4.00+", f"PlayResX: {WIDTH}", f"PlayResY: {HEIGHT}", "WrapStyle: 2",
                "ScaledBorderAndShadow: yes", f"Format: {_STYLE_FIELDS}", f"Format: {_EVENT_FIELDS}"}
    if style is None or info != expected:
        raise ValueError("Thiếu style, độ phân giải hoặc Format của ASS")
    return True


def burn(video_in, ass, video_out):
    """Trả argv FFmpeg để gọi subprocess. Phụ đề là lớp ghép sau hình và giữ luồng tiếng nếu có."""
    source = Path(ass).resolve()
    validate_ass(source)

    def escape(value, special):
        return "".join("\\" + char if char in special else char for char in value)

    filename = escape(escape(source.as_posix(), "\\':"), "\\'[],;")
    return ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(video_in),
            "-filter_threads", "2", "-vf", f"ass=filename={filename}", "-map", "0:v:0",
            "-map", "0:a:0?", "-c:v", "libx264", "-threads", "4", "-preset", "veryfast",
            "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-movflags", "+faststart", str(video_out)]
