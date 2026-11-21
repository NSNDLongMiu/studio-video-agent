"""Trộn bốn lớp và đo lại thành phẩm PCM."""
import argparse
import importlib.util
import json
import re
import subprocess
import sys
from pathlib import Path

sys.dont_write_bytecode = True
import numpy as np
from scipy.io import wavfile

from cuesheet import load_inputs, occupied_voice
from music_synth import segment_gains, synthesize
from sfx_synth import CONFIG, ROOT, dbfs, edge_fade, gain, pcm, read_json, write_json


def ffmpeg(*args, data=None):
    result = subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-nostats", *args],
                            input=data, capture_output=True)
    if result.returncode:
        raise ValueError("FFmpeg thất bại: " + result.stderr.decode("utf-8", errors="replace"))
    return result.stdout, result.stderr.decode("utf-8", errors="replace")


def float_audio(path, rate):
    output, _ = ffmpeg("-i", str(path), "-vn", "-ac", "1", "-ar", str(rate), "-f", "f32le", "-")
    return np.frombuffer(output, "<f4").astype(float)


def measure(path, final=False):
    filters = "ebur128=peak=true"
    if final:
        filters += ":metadata=1,ametadata=mode=print:key=lavfi.r128.true_peak,astats"
    _, log = ffmpeg("-i", str(path), "-af", filters, "-f", "null", "-")
    summary = log.rsplit("Summary:", 1)[-1]

    def field(pattern, source=summary):
        value = float(re.search(pattern, source)[1])
        return value if np.isfinite(value) else None

    result = dict(lufs=field(r"\bI:\s*([-\d.]+) LUFS"),
                  lra=field(r"LRA:\s*([-\d.]+) LU"),
                  true_peak_dbtp=field(r"Peak:\s*([-\d.inf]+) dBFS"))
    if final:
        peaks = re.findall(r"lavfi\.r128\.true_peak=([\d.eE+-]+)", log)
        if peaks:
            result["true_peak_dbtp"] = dbfs(max(map(float, peaks)))
        qc_peak = loudnorm_input("-i", str(path))[1]
        result["qc_true_peak_dbtp"] = qc_peak if np.isfinite(qc_peak) else None
        result["peak_dbfs"] = field(r"Peak level dB:\s*([-\d.inf]+)", log)
    return result


def window_lufs(samples, rate):
    if not np.any(samples):
        return None
    _, log = ffmpeg("-f", "f32le", "-ar", str(rate), "-ac", "1", "-i", "-",
                    "-af", "ebur128", "-f", "null", "-", data=samples.astype("<f4").tobytes())
    summary = log.rsplit("Summary:", 1)[-1]
    value = float(re.search(r"\bI:\s*([-\d.]+) LUFS", summary)[1])
    # EBU báo mức sàn khi không có khối nào qua cổng tuyệt đối.
    threshold = float(re.search(r"Threshold:\s*([-\d.]+) LUFS", summary)[1])
    return value if value > threshold else None


def loudnorm_input(*input_args, data=None):
    _, log = ffmpeg(*input_args, "-af", "loudnorm=print_format=json", "-f", "null", "-", data=data)
    stats = json.loads(re.findall(r'{\s*"input_i".*?}', log, re.S)[-1])
    return tuple(float(stats[key]) for key in ("input_i", "input_tp"))


def normalize_voice(source, rate, settings, warnings):
    limiter = settings["limiter"]
    target = settings["target_lufs"]
    ceiling = limiter["ceiling_dbfs"]
    # Làm tròn xuống theo lưới PCM để đỉnh ghi ra nằm trong trần.
    sample_ceiling = dbfs(np.floor(gain(ceiling) * 32768) / 32768)
    input_args = ("-f", "f32le", "-ar", str(rate), "-ac", "1", "-i", "-")

    def measure_input(signal):
        return loudnorm_input(*input_args, data=signal.astype("<f4").tobytes())

    lufs, true_peak = measure_input(source)
    peak = dbfs(np.max(np.abs(source)))
    processed = source
    reduction = np.zeros(0)
    if np.isfinite(lufs):
        makeup = target - lufs
        if max(peak + makeup - sample_ceiling, true_peak + makeup - settings["normalize_true_peak_dbtp"]) > 0:
            width = max(1, round(rate * limiter["attack_ms"] / 1000))
            starts = np.arange(0, len(source), width)
            peaks = np.maximum.reduceat(np.abs(source), starts)
            # Dự phòng phần đỉnh liên mẫu trước khi đo lại sau giới hạn.
            threshold = min(sample_ceiling, settings["normalize_true_peak_dbtp"] - (true_peak - peak)) - makeup
            required = np.minimum(limiter["max_gain_reduction_db"],
                                  20 * np.log10(np.maximum(1, peaks / gain(threshold))))
            # Bao hai đầu mỗi khối bằng đỉnh của khối kế cận để vào gain sớm.
            anchors = np.maximum(np.r_[0, required], np.r_[required, 0])
            release_step = limiter["max_gain_reduction_db"] * width / (rate * limiter["release_ms"] / 1000)
            offsets = np.arange(len(anchors)) * release_step
            anchors = np.maximum.accumulate(anchors + offsets) - offsets
            # Chặn sai số số học ngoài giới hạn giảm gain.
            reduction = np.interp(np.arange(len(source)), np.arange(len(anchors)) * width,
                                  np.clip(anchors, 0, limiter["max_gain_reduction_db"]))
            processed = source * gain(-reduction)
            lufs, true_peak = measure_input(processed)
        boost = min(target - lufs, sample_ceiling - dbfs(np.max(np.abs(processed))),
                    settings["normalize_true_peak_dbtp"] - true_peak)
        processed = processed * gain(boost)
    else:
        warnings.append("Không đủ tín hiệu để đo LUFS stem giọng")
        if peak is not None and peak > sample_ceiling:
            processed = source * gain(sample_ceiling - peak)

    def crest(signal):
        return dbfs(np.max(np.abs(signal)) / rms(signal)) if np.any(signal) else None

    return processed, dict(max_gain_reduction_db=float(np.max(reduction, initial=0)),
                           limited_samples=int(np.count_nonzero((source != 0) & (reduction > 0))) if reduction.size else 0,
                           crest_before_db=crest(source),
                           crest_after_db=crest(pcm(processed).astype(float) / 32768))


def verify_edges(samples, rate, windows, settings, warnings):
    if not windows:
        warnings.append("Thiếu cửa sổ câu để kiểm biên R23")
        return
    path = ROOT / "tools/voice/splice.py"
    spec = importlib.util.spec_from_file_location("voice_splice", path)
    module = importlib.util.module_from_spec(spec)
    try:
        spec.loader.exec_module(module)
        check_edges = module.check_edges
    except (ImportError, FileNotFoundError, AttributeError):
        edge_size = max(1, round(rate * settings["edge_ms"] / 1000))
        floor = gain(settings["edge_floor_db"])
        violations = sum(rms(edge) > floor for start, end in windows
                         for clip in [samples[round(start * rate):round(end * rate)]]
                         for edge in (clip[:edge_size], clip[-edge_size:]))
        warnings.append(f"Kiểm biên đơn giản vì thiếu splice.check_edges: {violations} biên vượt ngưỡng")
        return
    violations = check_edges(samples, rate, windows, floor_db=settings["edge_floor_db"],
                             edge_ms=settings["edge_ms"], max_jump_db=settings["max_edge_jump_db"],
                             jump_win_ms=settings["edge_jump_window_ms"])
    for entry in violations:
        warnings.append(f'R23: câu {entry["i"] + 1}, biên {entry["edge"]}, '
                        f'{entry["level_db"]:.2f} dBFS, bước nhảy {entry["jump_db"]:.2f} dB')


def rms(samples):
    return np.sqrt(np.mean(samples ** 2)) if len(samples) else 0


def block_rms(samples, width):
    count = len(samples)
    starts = np.arange(0, count, width)
    lengths = np.minimum(width, count - starts)
    return np.sqrt(np.add.reduceat(samples ** 2, starts) / lengths)


def duck_envelope(active, step, settings):
    lookahead = round(settings["duck_lookahead_s"] / step)
    attack = settings["duck_attack_s"]
    release = settings["duck_release_s"]
    # Giữ trạng thái khi tiếng bắt đầu và hạ nhạc trước ranh giới có tiếng.
    future = active.copy()
    for offset in range(1, min(lookahead + 1, len(active))):
        future[:-offset] |= active[offset:]
    current = 0.0
    envelope = np.empty(len(active))
    for index, playing in enumerate(future):
        target = settings["duck_depth_db"] if playing else 0
        period = attack if playing else release
        current = target + (current - target) * np.exp(-step / period) if period else target
        envelope[index] = current
    return envelope


def music_track(config, sheet, settings, cache, rate, count, width, active, levels, mask, voice_lufs, warnings):
    seed = sheet["video_id"]
    mood = settings["mood"]
    samples = np.zeros(count)
    if not settings["enabled"]:
        return samples
    from sfx_synth import seed_number
    key = seed_number(json.dumps([config["version"], config["music_synthesis"], config["music_moods"][mood],
                                  seed, mood, rate, count, settings["fade_out_s"]], sort_keys=True))
    cache.mkdir(parents=True, exist_ok=True)
    path = cache / f"{key:064x}.wav"
    if not path.is_file():
        music, metadata = synthesize(config, seed, mood, count / rate)
        wavfile.write(path, rate, pcm(music))
        write_json(path.with_suffix(".json"), metadata)
    _, wav = wavfile.read(path)
    samples = wav.astype(float) / 32768
    synth = config["music_synthesis"]
    reference_db = settings["base_gain_db"]
    segments = [dict(segment, gain_db=segment["gain_db"] - reference_db)
                for segment in sheet["music"]["segments"]]
    curve = segment_gains(count, rate, segments, 0, synth["segment_ramp_s"])
    for span in sheet["silences"]:
        left, right = (max(0, round(span[key] * rate)) for key in ("start", "end"))
        curve[left:right] = np.minimum(curve[left:right], gain(synth["silence_gain_db"] - reference_db))
    samples *= curve
    duck = duck_envelope(active, width / rate, settings)
    samples *= gain(np.interp(np.arange(count), np.arange(len(duck)) * width, duck))
    # Đo nền với đường cong cảnh và phần chuyển tiếp ducking thực tế.
    raw_lufs = window_lufs(samples[~mask], rate)
    if raw_lufs is None:
        raw_lufs = window_lufs(samples, rate)
        warnings.append("Không đủ nhạc ngoài cửa sổ lời để hiệu chỉnh trực tiếp")
    if raw_lufs is None:
        return np.zeros(count)
    if voice_lufs is None:
        voice_lufs = config["layers"]["voice"]["target_lufs"]
        warnings.append("Không đo được LUFS giọng trong cửa sổ lời. Dùng mục tiêu stem giọng")
    samples *= gain(voice_lufs + settings["bed_rel_voice_db"] - raw_lufs)
    limit = levels * gain(-settings["min_voice_margin_db"])
    current = block_rms(samples, width)
    attenuation = np.minimum(1, np.divide(limit, current, out=np.ones_like(limit), where=active & (current > 0)))
    samples *= np.repeat(attenuation, width)[:count]
    inside_lufs = window_lufs(samples[mask], rate)
    if inside_lufs is not None:
        correction = min(0, voice_lufs - settings["min_voice_margin_db"] - inside_lufs)
        samples[mask] *= gain(correction)
    return samples


def mix_effects(sheet, config, rate, count, width, active, levels, warnings):
    stems = {layer: np.zeros(count) for layer in ("sfx", "impact")}
    sfx = config["layers"]["sfx"]
    floor = gain(config["analysis"]["voice_floor_db"])
    for cue in sheet["cues"]:
        start = round(cue["t"] * rate)
        path = ROOT / cue["file"]
        if not path.is_file():
            warnings.append(f'Thiếu WAV cho cue {cue["id"]}: {cue["file"]}')
            continue
        if not 0 <= start < count:
            continue
        sample_rate, raw = wavfile.read(path)
        if sample_rate != rate or raw.dtype != np.int16 or raw.ndim != 1:
            raise ValueError(f"WAV thư viện phải là PCM mono s16 ở {rate} Hz: {path}")
        length = min(len(raw), round(cue["dur_s"] * rate), count - start)
        if length <= 0:
            continue
        end = start + length
        samples = raw[:length].astype(float) * (gain(cue["gain_db"]) / 32768)
        if length < len(raw):
            edge_fade(samples, rate, 0, config["sfx_synthesis"]["edge_fade_s"])
        relative = cue["mix"]["voice_rel_db"]
        rel_cap = sfx["under_voice_max_rel_db"] if relative is None else min(relative, sfx["under_voice_max_rel_db"])
        for block in range(start // width, (end - 1) // width + 1):
            if active[block] or relative is not None:
                clip = samples[max(0, block * width - start):min(length, (block + 1) * width - start)]
                peak = np.max(np.abs(clip))
                if peak:
                    clip *= min(1, max(floor, levels[block]) * gain(rel_cap) / peak)
        for span in sheet["silences"]:
            left = max(start, round(span["start"] * rate))
            right = min(end, round(span["end"] * rate))
            if left < right:
                samples[left - start:right - start] = 0
        stems[cue["layer"]][start:end] += samples
    return stems


def limited(samples, threshold_db, knee_db):
    ceiling = gain(threshold_db)
    knee = gain(threshold_db - knee_db)
    magnitude = np.abs(samples)
    excess = magnitude > knee
    width = ceiling - knee
    magnitude[excess] = knee + width * np.tanh((magnitude[excess] - knee) / width)
    return np.copysign(magnitude, samples)


def final_mix(samples, rate, path, settings, warnings):
    boost = 0
    ceiling = settings["true_peak_dbtp"]
    margin = settings["true_peak_margin_db"]
    target_peak = ceiling - margin
    max_peak = ceiling - margin / 2
    trim = 0
    for _ in range(settings["gain_passes"]):
        signal = limited(samples * gain(boost), target_peak - settings["peak_guard_db"], settings["soft_knee_db"])
        wav = pcm(signal * gain(trim))
        wavfile.write(path, rate, wav)
        result = measure(path, final=True)
        peak = result["true_peak_dbtp"]
        qc_peak = result["qc_true_peak_dbtp"]
        measured_peak = max((value for value in (peak, qc_peak) if value is not None), default=None)
        if measured_peak is not None and measured_peak > max_peak:
            trim += target_peak - measured_peak
            continue
        correction = settings["target_lufs"] - result["lufs"]
        if trim or result["lufs"] <= -70 or abs(correction) <= settings["loudness_tolerance_lu"]:
            break
        boost += correction
    if measured_peak is not None and measured_peak > max_peak:
        raise ValueError("True peak sau hiệu chỉnh vẫn vượt ngưỡng dự phòng")
    if abs(result["lufs"] - settings["target_lufs"]) > settings["loudness_tolerance_lu"]:
        warnings.append("LUFS bản trộn lệch mục tiêu sau khi giữ giới hạn true peak")
    if result["lra"] > settings["lra_max"]:
        warnings.append("LRA bản trộn vượt mục tiêu")
    return dict(integrated_lufs=result["lufs"], lra=result["lra"], true_peak_dbtp=result["true_peak_dbtp"],
                qc_true_peak_dbtp=qc_peak, true_peak_ceiling_dbtp=ceiling,
                true_peak_headroom_db=ceiling - measured_peak if measured_peak is not None else None,
                clipped_samples=int(np.count_nonzero((wav == -32768) | (wav == 32767))))


def mix(ep, voice_path, sheet, config, output, cache, duration=None, music=None):
    warnings = list(sheet["warnings"])
    rate = config["sample_rate"]
    if sheet["sample_rate"] != rate:
        raise ValueError("Tần số mẫu cue sheet và cấu hình phải khớp")
    if sheet["config_version"] != config["version"]:
        warnings.append("Phiên bản cấu hình mixer khác cue sheet")
    settings = config["layers"]
    music_settings = settings["music"] | sheet["layers"]["music"]
    # M?c ??ch l? lu?t mixer, k? c? khi cue sheet c? c? ch?p c?u h?nh l?p nh?c.
    calibration = settings["music"] if "bed_rel_voice_db" in settings["music"] else read_json(CONFIG)["layers"]["music"]
    music_settings["bed_rel_voice_db"] = calibration["bed_rel_voice_db"]
    if music is not None:
        music_settings["enabled"] = music == "on"
    source = float_audio(voice_path, rate)
    if not len(source):
        raise ValueError("Tệp giọng rỗng")
    if duration is None:
        duration = sheet["duration_s"] or len(source) / rate
    count = round(duration * rate)
    if count <= 0:
        raise ValueError("Thời lượng trộn phải dương")
    if count < len(source):
        if np.any(np.abs(source[count:]) > gain(settings["voice"]["edge_floor_db"])):
            raise ValueError("Thời lượng video sẽ cắt phần có tiếng của giọng")
        warnings.append("Cắt phần đệm cuối stem giọng để khớp thời lượng video")
        source = source[:count]
    voice_settings = read_json(CONFIG)["layers"]["voice"] | settings["voice"]
    voice, limiter_report = normalize_voice(source, rate, voice_settings, warnings)
    limiter_report["limited_percent"] = 100 * limiter_report["limited_samples"] / count
    voice = np.pad(voice, (0, count - len(voice)))
    _, scenes, _, lines = load_inputs(ep, [])
    windows = occupied_voice(scenes, []) or occupied_voice([], lines)
    valid = [(start, end) for start, end in windows if 0 <= start < end <= count / rate]
    if len(valid) != len(windows):
        warnings.append("Bỏ qua cửa sổ câu ngoài thời lượng bản trộn")
    verify_edges(pcm(voice), rate, valid, settings["voice"], warnings)

    analysis = config["analysis"]
    width = max(1, round(rate * analysis["window_s"]))
    levels = block_rms(voice, width)
    active = levels >= gain(analysis["voice_floor_db"])
    mask = np.repeat(active, width)[:count]
    voice_lufs = window_lufs(pcm(voice[mask]).astype(float) / 32768, rate)
    stems = mix_effects(sheet, config, rate, count, width, active, levels, warnings)
    stems["voice"] = voice
    stems["music"] = music_track(config, sheet, music_settings, cache, rate, count, width, active, levels,
                                 mask, voice_lufs, warnings)

    stems_dir = output / "stems"
    stems_dir.mkdir(parents=True, exist_ok=True)
    measurements = {}
    for name, signal in stems.items():
        path = stems_dir / f"{name}.wav"
        wavfile.write(path, rate, pcm(signal))
        measurements[name] = dict(lufs=measure(path)["lufs"] if np.any(signal) else None,
                                  peak_dbfs=dbfs(np.max(np.abs(pcm(signal).astype(float) / 32768))))
    stem_lufs = measurements["voice"]["lufs"]
    if stem_lufs is not None and abs(stem_lufs - voice_settings["target_lufs"]) > voice_settings["target_tolerance_lu"]:
        warnings.append(f"Stem giọng {stem_lufs:.1f} LUFS lệch mục tiêu "
                        f'{voice_settings["target_lufs"]} LUFS sau khi áp giới hạn đỉnh')
    combined = sum(stems.values())
    report = final_mix(combined, rate, output / "mix.wav", read_json(CONFIG)["final"] | config["final"], warnings)
    music_pcm = pcm(stems["music"]).astype(float) / 32768
    bed_lufs = window_lufs(music_pcm[~mask], rate)
    in_voice_lufs = window_lufs(music_pcm[mask], rate)
    bed_relative = round(bed_lufs - voice_lufs, 1) if bed_lufs is not None and voice_lufs is not None else None
    in_voice_relative = (round(in_voice_lufs - voice_lufs, 1)
                         if in_voice_lufs is not None and voice_lufs is not None else None)
    inside = dbfs(rms(stems["music"][mask]))
    outside = dbfs(rms(stems["music"][~mask]))
    margin = music_settings["min_voice_margin_db"]
    rms_margin = dbfs(rms(voice[mask])) - inside if inside is not None else None
    if (rms_margin is not None and rms_margin < margin) or (in_voice_relative is not None and in_voice_relative > -margin):
        warnings.append("Mức nhạc trong cửa sổ lời vượt ngưỡng tương đối")
    report.update(voice=dict(window_lufs=voice_lufs, limiter=limiter_report),
                  music=dict(bed_target_rel_voice_db=music_settings["bed_rel_voice_db"],
                             bed_measured_rel_voice_db=bed_relative, in_voice_rel_voice_db=in_voice_relative),
                  stems=measurements, ducking=dict(music_in_voice_db=inside, music_outside_voice_db=outside,
                                                   delta_db=inside - outside if inside is not None and outside is not None else None),
                  cue_count=len(sheet["cues"]), dropped_count=len(sheet["dropped"]), warnings=warnings)
    write_json(output / "mix-report.json", report)
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ep", type=Path, required=True)
    parser.add_argument("--voice", type=Path, required=True)
    parser.add_argument("--cue-sheet", type=Path)
    parser.add_argument("--music", choices=["on", "off"])
    parser.add_argument("--out-dir", type=Path)
    parser.add_argument("--duration", type=float)
    parser.add_argument("--config", type=Path, default=CONFIG)
    args = parser.parse_args()
    output = args.out_dir or args.ep / "assets/audio"
    if output.resolve().is_relative_to((args.ep / "final").resolve()):
        parser.error("Thư mục trộn phải nằm ngoài final của tập")
    cache = output / "audio-cache" if args.out_dir else args.ep / "assets/_scratch/audio-cache"
    sheet = read_json(args.cue_sheet or args.ep / "assets/sound-cues.json")
    try:
        mix(args.ep, args.voice, sheet, read_json(args.config), output, cache, args.duration, args.music)
    except ValueError as error:
        parser.exit(2, f"Lỗi trộn: {error}\n")


if __name__ == "__main__":
    main()
