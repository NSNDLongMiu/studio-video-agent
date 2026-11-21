"""Xếp giọng PCM theo mốc bắt đầu phần có tiếng trong voice-timeline.json."""
import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np

from splice import _read_wav, _write_wav, prepare_clip


def read(path):
    return json.loads(Path(path).read_text(encoding="utf-8-sig"))


def write(path, data):
    Path(path).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ("clips", "timeline", "out", "cues-out"):
        parser.add_argument("--" + name, required=True, type=Path)
    parser.add_argument("--scenes", type=Path)
    parser.add_argument("--scenes-out", type=Path)
    parser.add_argument("--lead", type=float, help="Đệm đầu, tính bằng giây.")
    parser.add_argument("--tail", type=float, help="Đệm đuôi, tính bằng giây.")
    args = parser.parse_args()
    config = read(Path(__file__).with_name("prosody.json"))["audio"]
    lead = config["lead_ms"] if args.lead is None else args.lead * 1000
    tail = config["tail_ms"] if args.tail is None else args.tail * 1000
    if lead < config["min_lead_ms"] or tail < config["min_tail_ms"]:
        raise ValueError("Phần đệm đầu/đuôi thấp hơn giới hạn R23.")
    rate = config["sample_rate"]
    timeline = read(args.timeline)
    if any(item["action"] == "error" for item in timeline.get("overflow", [])):
        raise ValueError("Timeline có cảnh thiếu chỗ. Cần xử lý overflow trước khi ghép.")
    source = args.clips / "generation.json" if args.clips.is_dir() else args.clips
    manifest = read(source) if source.is_file() else None
    if manifest is None and not args.clips.is_dir():
        raise ValueError("Không tìm thấy manifest clip.")
    records = {str(line["line_id"]).zfill(2): line for line in (manifest or {}).get("lines", [])}
    scenes_path = args.scenes or args.scenes_out
    scenes = read(scenes_path) if scenes_path and scenes_path.exists() else None
    by_scene = {scene["id"]: scene for scene in scenes or []}
    for scene in by_scene.values():
        scene["voice"] = []
    track = np.zeros(round(timeline["total_s"] * rate), dtype=np.int16)
    cues = []
    previous = 0
    with tempfile.TemporaryDirectory() as temp:
        adjusted = Path(temp) / "tempo.wav"
        for line in timeline["lines"]:
            number = line["line_id"]
            scene = line["scene_id"]
            if manifest is not None:
                if number not in records:
                    raise ValueError(f"Manifest thiếu dòng {number}.")
                record = records[number]
                file = source.parent / record["file"]
            else:
                record = {}
                file = args.clips / f"{number}.wav"
            ratio = line.get("tempo_ratio", 1)
            ratio_limit = line.get("tempo_ratio_max", ratio)
            onset = round(line["start"] * rate)
            expected = round(line["end"] * rate)
            for _ in range(config["assembly_tempo_attempts"]):
                input_file = file
                if ratio != 1:
                    subprocess.run([os.environ.get("FFMPEG") or "ffmpeg", "-y", "-v", "error",
                                    "-i", str(file), "-af", f"atempo={ratio}", str(adjusted)], check=True)
                    input_file = adjusted
                pcm, actual_rate = _read_wav(input_file)
                if actual_rate != rate:
                    raise ValueError(f"Dòng {number} cần WAV {rate} Hz.")
                pcm, edges = prepare_clip(pcm, rate, lead, tail, config["fade_ms"], config["floor_db"])
                head = round(edges["lead_ms"] * rate / 1000)
                foot = round(edges["tail_ms"] * rate / 1000)
                start = onset - head
                end = start + len(pcm)
                spoken_end = end - foot
                if spoken_end <= expected or ratio == ratio_limit or expected <= onset:
                    break
                # Hiệu chỉnh sai số atempo bằng thời lượng đo lại, giữ nguyên ngưỡng tempo.
                ratio = min(ratio_limit, ratio * (spoken_end - onset + 1) / (expected - onset))
            if abs(spoken_end - expected) > round(config["assembly_tolerance_s"] * rate):
                raise ValueError(f"Dòng {number} lệch thời lượng {(spoken_end - expected) / rate:+.3f} s.")
            if start < previous or end > len(track):
                raise ValueError(f"Cửa sổ có đệm của dòng {number} chồng lấn hoặc vượt timeline.")
            if scenes is not None and scene in by_scene:
                window = by_scene[scene]
                if start < round(window["start"] * rate) or end > round(window["end"] * rate):
                    raise ValueError(f"Dòng {number} vượt cửa sổ cảnh {scene}.")
                deadline = round((window["end"] - window.get("hold_after_voice_s", 0)) * rate)
                if spoken_end > deadline:
                    raise ValueError(f"Dòng {number} lấn thời gian giữ hình cảnh {scene}.")
            track[start:end] = pcm
            previous = end
            bounds = {"start": start / rate, "end": end / rate}
            by_scene.setdefault(scene, {"id": scene, "start": start / rate, "end": end / rate, "voice": []})
            by_scene[scene]["voice"].append(bounds)
            cues.append({"line": int(number), "scene": scene, "text": record.get("text", ""),
                         "start": onset / rate, "end": spoken_end / rate})
    _write_wav(args.out, track, rate)
    write(args.cues_out, cues)
    if args.scenes_out:
        if scenes is None:
            for item in by_scene.values():
                item["end"] = item["voice"][-1]["end"]
        write(args.scenes_out, list(by_scene.values()))


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        sys.exit(f"Lỗi ghép giọng. {error}")

