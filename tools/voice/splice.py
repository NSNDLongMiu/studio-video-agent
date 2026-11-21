"""Tách câu giữa khoảng lặng và kiểm toàn vẹn biên tiếng trong tệp WAV."""

import argparse
import json
import math
import sys
import wave
from pathlib import Path

import numpy as np


def _samples(ms, rate):
    return max(1, round(ms * rate / 1000))


def _pcm(x):
    x = np.asarray(x)
    if x.ndim != 1 or x.dtype.kind not in "if" or not np.all(np.isfinite(x)):
        raise ValueError("Cần tiếng PCM mono hữu hạn")
    return x.astype(np.float64) / (32768 if x.dtype.kind == "i" else 1)


def _db(power):
    return 10 * np.log10(np.maximum(power, 1e-12))


def envelope_db(x, rate, win_ms=2):
    """Đo RMS dBFS, một giá trị tại mỗi mẫu, bằng cửa sổ giữa tâm."""
    if rate <= 0 or win_ms <= 0:
        raise ValueError("Tần số lấy mẫu và cửa sổ RMS phải dương")
    signal = _pcm(x)
    width = _samples(win_ms, rate)
    # Tách khối để tổng tích lũy không làm mất độ chính xác ở vùng rất nhỏ.
    padded = np.pad(signal * signal, (width // 2, (width - 1) // 2))
    result = np.empty(len(signal), dtype=np.float64)
    for start in range(0, len(signal), 65536):
        end = min(len(signal), start + 65536)
        power = np.cumsum(np.r_[0., padded[start:end + width - 1]])
        result[start:end] = _db((power[width:] - power[:-width]) / width)
    return result


def find_gaps(env, rate, floor_db=-60, min_gap_s=0.12):
    """Trả các khoảng lặng (đầu gồm, cuối loại trừ) tính bằng giây."""
    if rate <= 0 or min_gap_s < 0:
        raise ValueError("Tần số lấy mẫu hoặc thời lượng khoảng lặng không hợp lệ")
    boundaries = np.flatnonzero(np.diff(np.r_[False, np.asarray(env) <= floor_db, False]))
    return [(a / rate, b / rate) for a, b in boundaries.reshape(-1, 2)
            if b - a >= min_gap_s * rate]


def _audible_dropped(env, rate, spans, floor_db):
    uncovered = env > floor_db
    for start, end in spans:
        uncovered[round(start * rate):round(end * rate)] = False
    return 1000 * np.count_nonzero(uncovered) / rate


def audible_dropped_ms(source, rate, clips_spans, floor_db=-60):
    """Đếm thời lượng tiếng trên ngưỡng bị bỏ, với các khoảng nguồn tính bằng giây."""
    env = envelope_db(source, rate)
    spans = tuple(clips_spans)
    if any(not 0 <= a <= b <= len(env) / rate for a, b in spans):
        raise ValueError("Khoảng giữ lại phải nằm trong nguồn")
    return _audible_dropped(env, rate, spans, floor_db)


def prepare_clip(clip, rate, lead_ms=60, tail_ms=140, fade_ms=10, floor_db=-60):
    """Giữ nguyên vùng có tiếng, bỏ lặng dư hoặc đệm 0 và chỉ fade trong lặng."""
    result, report, _ = _prepare_clip(clip, rate, lead_ms, tail_ms, fade_ms, floor_db)
    return result, report


def _prepare_clip(clip, rate, lead_ms, tail_ms, fade_ms, floor_db):
    if not 0 <= fade_ms <= min(lead_ms, tail_ms):
        raise ValueError("Fade phải nằm trong phần lặng trước và sau câu")
    clip = np.asarray(clip)
    active = np.flatnonzero(envelope_db(clip, rate) > floor_db)
    if not len(active):
        raise ValueError("Không có tiếng trên ngưỡng trong clip")
    lead = math.ceil(lead_ms * rate / 1000)
    tail = math.ceil(tail_ms * rate / 1000)
    start = int(active[0]) - lead
    end = int(active[-1]) + 1 + tail
    result = np.pad(clip[max(0, start):end], (max(0, -start), max(0, end - len(clip))))
    fade = min(round(fade_ms * rate / 1000), lead, tail)
    if fade:
        envelope = envelope_db(result, rate)
        if np.any(envelope[:fade] > floor_db) or np.any(envelope[-fade:] > floor_db):
            raise ValueError("Fade sẽ chạm phần có tiếng")
        ramp = np.linspace(0, 1, fade)
        result[:fade] = result[:fade] * ramp
        result[-fade:] = result[-fade:] * ramp[::-1]
    # Phần đệm được đo lại sau khi cắt/fade. Nếu RMS thay đổi, vẫn báo mốc thật.
    active = np.flatnonzero(envelope_db(result, rate) > floor_db)
    return result, {"lead_ms": 1000 * int(active[0]) / rate,
                    "tail_ms": 1000 * (len(result) - int(active[-1]) - 1) / rate}, (start, end)


def split_sentences(x, rate, expected, *, floor_db=-60):
    """Chọn giữa các khoảng lặng theo tỷ lệ độ dài rồi chuẩn bị từng câu."""
    weights = tuple(float(value) for value in expected)
    if not weights or any(not math.isfinite(n) or n <= 0 for n in weights) or not math.isfinite(sum(weights)):
        raise ValueError("Cần độ dài ước lượng dương cho từng câu")
    x = np.asarray(x)
    env = envelope_db(x, rate)
    active = np.flatnonzero(env > floor_db)
    if not len(active):
        raise ValueError("Không có tiếng để tách câu")
    start, end = active[0] / rate, (active[-1] + 1) / rate
    gaps = [(a, b) for a, b in find_gaps(env, rate, floor_db) if start < a < b < end]
    count = len(weights) - 1
    if len(gaps) < count:
        raise ValueError(f"Cần {count} khoảng lặng giữa các câu, tìm thấy {len(gaps)}")
    estimated_total = end - start - sum(sorted((b - a for a, b in gaps), reverse=True)[:count])
    points = [(start, start), *gaps, (end, end)]

    # Tìm đường có tổng sai số log-tỷ lệ nhỏ nhất qua các khoảng lặng theo thứ tự.
    states = {0: (0., (), ())}
    for i, weight in enumerate(weights):
        target = estimated_total * weight / sum(weights)
        next_states = {}
        final = i == count
        choices = [len(points) - 1] if final else range(i + 1, len(points) - count + i)
        for j in choices:
            gap_start, gap_end = points[j]
            for k, (total, cuts, scores) in states.items():
                duration = gap_start - points[k][1]
                if j <= k or duration <= 0:
                    continue
                score = math.log(duration / target) ** 2
                if not final:
                    score += .75 * max(0, .24 - (gap_end - gap_start))
                if j not in next_states or total + score < next_states[j][0]:
                    next_states[j] = total + score, (*cuts, j), (*scores, score)
        states = next_states
    if not states:
        raise ValueError("Không tìm được tổ hợp ranh giới câu trong khoảng lặng")

    _, cuts, scores = states[len(points) - 1]
    edges = [0]
    for j in cuts[:-1]:
        a, b = points[j]
        cut = round((a + b) * rate / 2)
        if env[cut] > floor_db:
            raise ValueError("Điểm cắt nằm ngoài khoảng lặng")
        edges.append(cut)
    edges.append(len(x))
    clips, report, spans = [], [], []
    for a, b, score in zip(edges[:-1], edges[1:], scores, strict=True):
        clip, padding, (start, end) = _prepare_clip(x[a:b], rate, 60, 140, 10, floor_db)
        spans.append((max(a, a + start) / rate, min(b, a + end) / rate))
        clips.append(clip)
        report.append({**padding, "score": score})
    if _audible_dropped(env, rate, spans, floor_db):
        raise ValueError("Điểm cắt hoặc thao tác bỏ lặng làm mất tiếng trên ngưỡng")
    return clips, report


def check_edges(track, rate, windows, *, floor_db=-55, edge_ms=10, max_jump_db=30, jump_win_ms=2):
    """Đo RMS biên và chênh RMS giữa các khung kề nhau ở đầu/cuối câu."""
    if rate <= 0 or edge_ms <= 0 or jump_win_ms <= 0 or max_jump_db < 0:
        raise ValueError("Tham số đo biên không hợp lệ")
    x = np.asarray(track)
    edge_size = _samples(edge_ms, rate)
    jump_size = _samples(jump_win_ms, rate)
    zone_size = _samples(40, rate)
    violations = []
    for i, (start, end) in enumerate(windows):
        if not 0 <= start < end <= len(x) / rate or round(start * rate) >= round(end * rate):
            raise ValueError(f"Cửa sổ câu {i + 1} nằm ngoài tệp hoặc rỗng")
        signal = _pcm(x[round(start * rate):round(end * rate)])
        for edge, part in (("head", signal), ("tail", signal[::-1])):
            level_db = float(_db(np.mean(part[:edge_size] ** 2)))
            # Có thể chuyển mức ngay giữa một khung. Đo các cặp kề nhau ở mọi vị trí mẫu.
            part = part[:zone_size]
            power = np.cumsum(np.r_[0., part * part])
            levels = np.maximum(-96, _db((power[jump_size:] - power[:-jump_size]) / jump_size))
            jump_db = float(np.max(np.abs(levels[jump_size:] - levels[:-jump_size]), initial=0))
            if level_db > floor_db or jump_db > max_jump_db:
                violations.append({"i": i, "start": start, "end": end, "edge": edge,
                                   "level_db": level_db, "jump_db": jump_db})
    return violations


def _read_wav(path):
    with wave.open(str(path), "rb") as stream:
        if stream.getnchannels() != 1 or stream.getsampwidth() != 2:
            raise ValueError("Cần WAV PCM 16-bit mono. Dùng FFmpeg với -ac 1 -c:a pcm_s16le để đổi")
        return np.frombuffer(stream.readframes(stream.getnframes()), dtype="<i2"), stream.getframerate()


def _write_wav(path, x, rate):
    with wave.open(str(path), "wb") as stream:
        stream.setparams((1, 2, rate, 0, "NONE", "not compressed"))
        stream.writeframes(x.astype("<i2", copy=False).tobytes())


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    actions = parser.add_subparsers(dest="action", required=True)
    split = actions.add_parser("split", help="Tách câu ở giữa khoảng lặng")
    split.add_argument("--in", dest="source", type=Path, required=True)
    split.add_argument("--expected", required=True, help="Độ dài tương đối, cách nhau bằng dấu phẩy")
    split.add_argument("--out-dir", type=Path, required=True)
    check = actions.add_parser("check", help="Đo đầu và đuôi các cửa sổ câu")
    check.add_argument("--wav", type=Path, required=True)
    check.add_argument("--windows", type=Path, required=True)
    for action in (split, check):
        action.add_argument("--json", action="store_true", help="In kết quả JSON")
    args = parser.parse_args(argv)
    try:
        if args.action == "split":
            x, rate = _read_wav(args.source)
            clips, report = split_sentences(x, rate, args.expected.split(","))
            args.out_dir.mkdir(parents=True, exist_ok=True)
            for i, (clip, row) in enumerate(zip(clips, report, strict=True), 1):
                path = args.out_dir / f"sentence-{i:02d}.wav"
                _write_wav(path, clip, rate)
                row["path"] = str(path)
            result = report
            message = f"Đã tách {len(clips)} câu và giữ phần đệm ở hai đầu mỗi câu."
            code = 0
        else:
            x, rate = _read_wav(args.wav)
            rows = json.loads(args.windows.read_text(encoding="utf-8-sig"))
            windows = [(row["start"], row["end"]) if isinstance(row, dict) else row for row in rows]
            result = check_edges(x, rate, windows)
            message = f"Đã đo {len(windows)} câu. Số biên vi phạm: {len(result)}."
            code = int(bool(result))
    except (ValueError, TypeError, KeyError, OSError, EOFError, wave.Error) as error:
        print(f"Lỗi: {error}", file=sys.stderr)
        return 2
    print(json.dumps(result, ensure_ascii=False) if args.json else message)
    if not args.json and args.action == "check":
        for row in result:
            edge = "Đầu" if row["edge"] == "head" else "Đuôi"
            print(f"{edge} câu {row['i'] + 1} ({row['start']:.3f}–{row['end']:.3f} s): "
                  f"{row['level_db']:.1f} dBFS, bước nhảy {row['jump_db']:.1f} dB")
    return code


if __name__ == "__main__":
    sys.exit(main())
