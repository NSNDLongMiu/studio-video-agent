"""Sinh nhạc nền ambient từ hợp âm và tham số xác định."""
import argparse
import sys
from pathlib import Path

sys.dont_write_bytecode = True
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

from sfx_synth import CONFIG, edge_fade, gain, pcm, read_json, seed_number, write_json


def segment_gains(count, rate, segments, base_db, ramp_s):
    levels = np.full(count, base_db, dtype=float)
    ramp = round(ramp_s * rate)
    for segment in segments:
        start = max(0, min(count, round(segment["start"] * rate)))
        end = min(count, round(segment["end"] * rate))
        if end <= start:
            continue
        previous = levels[start - 1] if start else segment["gain_db"]
        length = min(end - start, ramp)
        levels[start:end] = segment["gain_db"]
        levels[start:start + length] = np.linspace(previous, segment["gain_db"], length, endpoint=False)
    return gain(levels)


def synthesize(config, seed, mood, duration, segments=()):
    rate = config["sample_rate"]
    settings = config["music_synthesis"]
    spec = config["music_moods"][mood]
    count = round(duration * rate)
    if count <= 0:
        raise ValueError("Thời lượng nhạc phải dương")
    seed_id = seed_number(seed)
    progression_index = seed_id % len(spec["progressions"])
    progression = spec["progressions"][progression_index]
    beat = 60 / spec["tempo_bpm"]
    chord_samples = round(rate * beat * spec["beats_per_chord"])
    crossfade = min(chord_samples, round(rate * spec["pad_crossfade_s"]))
    samples = np.zeros(count)

    def frequency(note):
        midi = spec["tonic_midi"] + note
        return settings["a4_hz"] * 2 ** ((midi - settings["a4_midi"]) / 12)

    for index, start in enumerate(range(0, count, chord_samples)):
        chord = progression[index % len(progression)]
        time = np.arange(min(chord_samples + crossfade, count - start)) / rate
        pad = np.zeros(len(time))
        for note in chord:
            hz = frequency(note)
            pad += np.sin(2 * np.pi * hz * time)
            pad += spec["pad_harmonic"] * np.sin(2 * np.pi * (2 * hz + spec["pad_detune_hz"]) * time)
        pad /= len(chord)
        pad += spec["bass_gain"] * np.sin(np.pi * frequency(chord[0]) * time)
        if index:
            length = min(crossfade, len(pad))
            pad[:length] *= np.linspace(0, 1, length, endpoint=False)
        tail = len(pad) - chord_samples
        if tail > 0:
            pad[chord_samples:] *= 1 - np.arange(tail) / crossfade
        samples[start:start + len(pad)] += pad

    interval = round(rate * beat * spec["texture_every_beats"])
    for index, start in enumerate(range(0, count, interval)):
        length = min(count - start, round(rate * spec["texture_duration_s"]))
        time = np.arange(length) / rate
        scale = spec["scale"]
        note = scale[(seed_id + index) % len(scale)] if spec["texture"] == "arpeggio" else -12
        texture = np.sin(2 * np.pi * frequency(note) * time)
        texture *= np.sin(np.pi * np.arange(length) / length) ** 2
        samples[start:start + length] += spec["texture_gain"] * texture

    for kind, cutoff in (("bandstop", settings["voice_notch_hz"]), ("lowpass", settings["lowpass_hz"])):
        samples = sosfilt(butter(settings["filter_order"], cutoff, kind, fs=rate, output="sos"), samples)
    rms = np.sqrt(np.mean(samples ** 2))
    peak = np.max(np.abs(samples))
    if peak:
        samples *= min(gain(settings["target_rms_dbfs"]) / rms, gain(settings["peak_dbfs"]) / peak)
    edge_fade(samples, rate, settings["fade_in_s"], config["layers"]["music"]["fade_out_s"])
    if segments:
        samples *= segment_gains(count, rate, segments, config["layers"]["music"]["base_gain_db"],
                                 settings["segment_ramp_s"])
    return samples, dict(version=1, config_version=config["version"], seed=seed, mood=mood,
                         duration_s=count / rate, sample_rate=rate, progression_index=progression_index,
                         progression=progression, params=spec, synthesis=settings, segments=list(segments))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--seed", required=True)
    parser.add_argument("--mood", required=True)
    parser.add_argument("--duration", type=float, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--cue-sheet", type=Path)
    parser.add_argument("--config", type=Path, default=CONFIG)
    args = parser.parse_args()
    segments = read_json(args.cue_sheet)["music"]["segments"] if args.cue_sheet else ()
    samples, metadata = synthesize(read_json(args.config), args.seed, args.mood, args.duration, segments)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    wavfile.write(args.out, metadata["sample_rate"], pcm(samples))
    write_json(args.out.with_suffix(".json"), metadata)
