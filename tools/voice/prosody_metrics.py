"""Đo các chỉ báo giọng đọc. Độ tự nhiên cần người nghe đánh giá."""
import argparse
import itertools
import math
import re
import sys
from pathlib import Path

import numpy as np
from scipy.signal import correlate, resample_poly

from assemble import read, write
from splice import _pcm, _read_wav, check_edges, envelope_db, find_gaps


def distribution(values):
    if not len(values):
        return {"n": 0, "min": None, "median": None, "max": None, "stdev": None}
    return {"n": len(values), "min": float(np.min(values)), "median": float(np.median(values)),
            "max": float(np.max(values)), "stdev": float(np.std(values))}


def rms_db(signal):
    if not len(signal):
        return None
    power = float(np.mean(np.square(signal)))
    return 10 * math.log10(power) if power > 0 else None


def pitch_tail(signal, rate, config):
    start = round(len(signal) * (1 - config["pitch_tail_fraction"]))
    target_rate = config["pitch_sample_rate"]
    divisor = math.gcd(rate, target_rate)
    tail = resample_poly(signal[start:], target_rate // divisor, rate // divisor)
    size = round(config["pitch_window_ms"] * target_rate / 1000)
    step = round(config["pitch_hop_ms"] * target_rate / 1000)
    lag_min = math.ceil(target_rate / config["pitch_max_hz"])
    lag_max = min(size - 1, math.floor(target_rate / config["pitch_min_hz"]))
    pitches = []
    for offset in range(0, len(tail) - size + 1, step):
        frame = tail[offset:offset + size]
        level = rms_db(frame)
        if level is None or level < config["speech_floor_db"]:
            continue
        frame = frame - np.mean(frame)
        correlation = correlate(frame, frame, mode="full", method="fft")[size - 1:]
        if correlation[0] <= 0:
            continue
        # Ưu tiên đỉnh sớm nhất đủ mức để giảm nhầm bội của chu kỳ.
        powers = np.cumsum(np.r_[0., frame ** 2])
        lags = np.arange(lag_min, lag_max + 1)
        denominators = np.sqrt(powers[size - lags] * (powers[size] - powers[lags]))
        scores = np.divide(correlation[lags], denominators, out=np.zeros(len(lags)), where=denominators > 0)
        peaks = np.flatnonzero((scores[1:-1] >= scores[:-2]) & (scores[1:-1] > scores[2:])) + 1
        strong = peaks[scores[peaks] >= config["pitch_min_correlation"]]
        if len(strong):
            pitches.append(target_rate / lags[strong[0]])
    if len(pitches) < config["pitch_min_frames"]:
        return {"f0_frames": len(pitches), "f0_range_semitones": None, "f0_delta_semitones": None, "f0_direction": None}
    semitones = 12 * np.log2(pitches)
    width = max(1, len(pitches) // 3)
    delta = float(np.median(semitones[-width:]) - np.median(semitones[:width]))
    cutoff = config["pitch_flat_semitones"]
    return {"f0_frames": len(pitches), "f0_range_semitones": float(np.ptp(semitones)),
            "f0_delta_semitones": delta, "f0_direction": "rising" if delta > cutoff else "falling" if delta < -cutoff else "flat"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ("track", "timeline", "plan", "out"):
        parser.add_argument("--" + name, required=True, type=Path)
    parser.add_argument("--generation", type=Path, help="Manifest có biên chunk đo được.")
    parser.add_argument("--scenes", type=Path, help="Cửa sổ voice[] có đệm từ assemble.")
    args = parser.parse_args()
    rules = read(Path(__file__).with_name("prosody.json"))
    config = rules["metrics"]
    audio = rules["audio"]
    track, rate = _read_wav(args.track)
    signal = _pcm(track)
    plans = {line["line_id"]: line for line in read(args.plan)["lines"]}
    generation = {line["line_id"]: line for line in read(args.generation)["lines"]} if args.generation else {}
    timeline = read(args.timeline)["lines"]
    reference = rms_db(signal)
    results = []
    windows = []
    active_bounds = []
    for line in timeline:
        line_id = line["line_id"]
        metadata = plans[line_id]
        first = round(line["start"] * rate)
        last = round(line["end"] * rate)
        if not 0 <= first < last <= len(signal):
            raise ValueError(f"Dòng {line_id} nằm ngoài track.")
        part = signal[first:last]
        env = envelope_db(part, rate)
        active = np.flatnonzero(env > config["speech_floor_db"])
        if len(active):
            active_bounds.append(((first + int(active[0])) / rate, (first + int(active[-1]) + 1) / rate))
        speech_s = (len(part) / rate - sum(end - start for start, end in
                    find_gaps(env, rate, config["speech_floor_db"], config["min_gap_s"]))) if len(active) else 0
        count = len(re.findall(r"[^\W_]+", metadata["tts"]))
        level = rms_db(part)
        measure = {"line_id": line_id, "intent": metadata["intent"], "status": "proxy",
                   "syllables_proxy": count, "audible_s": speech_s,
                   "syllables_per_s": count / speech_s if speech_s > 0 else None,
                   "relative_rms_db": level - reference if level is not None and reference is not None else None,
                   **pitch_tail(part, rate, config)}
        chunks = generation.get(line_id, {}).get("chunks", [])
        ratio = line.get("tempo_ratio", 1)
        if ratio == 1 and any(item["role"] == "emphasis" for item in chunks):
            mask = np.zeros(len(part), dtype=bool)
            for chunk in chunks:
                if chunk["role"] == "emphasis":
                    mask[round(chunk["start"] * rate):round(chunk["end"] * rate)] = True
            foreground = rms_db(part[mask])
            background = rms_db(part[~mask & (env > config["speech_floor_db"])])
            measure["emphasis_rms_delta_db"] = foreground - background if foreground is not None and background is not None else None
        else:
            measure["emphasis_rms_delta_db"] = None
        results.append(measure)
        windows.append((max(0, (first - round(audio["lead_ms"] * rate / 1000)) / rate),
                        min(len(signal) / rate, (last + round(audio["tail_ms"] * rate / 1000)) / rate)))
    if args.scenes:
        windows = [(window["start"], window["end"]) for scene in read(args.scenes) for window in scene.get("voice", [])]
    violations = check_edges(track, rate, windows)
    pauses = [max(0, right[0] - left[1]) for left, right in itertools.pairwise(active_bounds)]
    edges = config["pause_histogram_edges_s"]
    counts, _ = np.histogram(pauses, bins=[*edges, np.inf])
    fields = config["comparison_thresholds"]
    by_intent = {}
    for result in results:
        by_intent.setdefault(result["intent"], []).append(result)
    grouped = {intent: {"lines": len(items), **{key: distribution(
        [item[key] for item in items if item[key] is not None]) for key in fields}} for intent, items in by_intent.items()}
    comparisons = []
    for left, right in itertools.combinations(("question", "explanation", "warning"), 2):
        differences = {}
        for key, threshold in fields.items():
            a = grouped.get(left, {}).get(key)
            b = grouped.get(right, {}).get(key)
            if a and b and min(a["n"], b["n"]) >= config["comparison_min_lines"]:
                delta = a["median"] - b["median"]
                differences[key] = {"delta": delta, "above_threshold": abs(delta) >= threshold}
        outcome = "có khác biệt đo được" if any(item["above_threshold"] for item in differences.values()) else (
            "không khác biệt đo được" if differences else "thiếu mẫu đo hợp lệ")
        comparisons.append({"intents": [left, right], "differences": differences, "outcome": outcome})
    write(args.out, {"version": 1, "status": "proxy", "lines": results, "by_intent": grouped,
                     "comparisons": comparisons, "pauses": {**distribution(pauses),
                         "histogram": {"lower_edges_s": edges, "counts": counts.tolist()}},
                     "voice_edges": {"windows": len(windows), "violations": violations},
                     "note": "Độ tự nhiên: CHƯA KIỂM — giám đốc nghe. Tốc độ dùng số token chữ/số làm xấp xỉ âm tiết. Biên R23 là chỉ báo."})


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError) as error:
        sys.exit(f"Lỗi đo giọng đọc. {error}")

