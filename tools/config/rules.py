"""Đọc cấu hình luật chung của pipeline."""

import json
from functools import cache
from math import isfinite
from pathlib import Path


_CONFIG_PATH = Path(__file__).resolve().with_name("pipeline-rules.json")


def _is_text(value):
    return isinstance(value, str) and bool(value.strip())


def _is_boolean(value):
    return isinstance(value, bool)


def _is_number(value):
    return type(value) is int or (type(value) is float and isfinite(value))


def _is_number_list(length):
    return lambda value: (
        isinstance(value, list) and len(value) == length and all(map(_is_number, value))
    )


def _is_text_list(value):
    return isinstance(value, list) and bool(value) and all(map(_is_text, value))


_REQUIRED_FIELDS = {
    "version": _is_text,
    "frame": {"width": _is_number, "height": _is_number, "fps": _is_number, "safe_bbox": _is_number_list(4)},
    "opening": {
        "min_s": _is_number, "max_s": _is_number, "target_s": _is_number_list(2), "title_px_min": _is_number,
        "voice_allowed": _is_boolean, "voice_start_min_s": _is_number, "voice_start_max_s": _is_number,
        "phases": _is_text_list, "styles": _is_text_list,
    },
    "camera": {"max_zoom": _is_number, "keep_in_frame": _is_boolean},
    "scene_kinds": _is_text_list,
}


def _validate(value, expected, path):
    valid = expected(value) if callable(expected) else isinstance(value, dict)
    if not valid:
        raise ValueError(f"Cấu hình pipeline-rules.json thiếu khóa hoặc sai kiểu dữ liệu tại {path}.")
    if isinstance(expected, dict):
        for key, field in expected.items():
            _validate(value.get(key), field, f"{path}.{key}")


@cache
def load_rules():
    """Đọc và kiểm cấu hình một lần cho mỗi tiến trình."""
    try:
        rules = json.loads(_CONFIG_PATH.read_text(encoding="utf-8"))
    except (OSError, ValueError) as error:
        raise ValueError(f"Không đọc được cấu hình tại {_CONFIG_PATH}.") from error

    _validate(rules, _REQUIRED_FIELDS, "$")
    return rules
