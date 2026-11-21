"""Thành phần Pillow và FFmpeg để dựng cảnh motion graphics 9:16."""

from .backdrops import backdrop, suggest_backdrop
from .overlaps import find_overlaps, measure_frame
from .core import CAPTION_BAND, CONTENT, FPS, HEADER_ZONE, HEIGHT, PALETTE, SAFE, SIZE, WIDTH, Canvas, Palette
from .opening import choose_style, opening_sequence
from .layouts import Layout, resolve_layout, suggest_layout
from .scene_kinds import render_scene_kind
from .renderlog import RenderLog

__all__ = [
    "CAPTION_BAND", "CONTENT", "FPS", "HEADER_ZONE", "HEIGHT", "PALETTE",
    "SAFE", "SIZE", "WIDTH", "Canvas", "Palette", "RenderLog",
    "backdrop", "suggest_backdrop", "find_overlaps", "measure_frame",
    "Layout", "resolve_layout", "suggest_layout", "choose_style", "opening_sequence", "render_scene_kind",
]
