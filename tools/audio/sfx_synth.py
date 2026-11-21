"""Tổng hợp hiệu ứng gốc và ghi thông số tái tạo."""
import argparse
import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[2]
CONFIG = Path(__file__).with_name("sound-design.json")


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def write_json(path, data):
    Path(path).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def gain(db):
    return 10 ** (db / 20)


def dbfs(value):
    return float(20 * np.log10(value)) if value > 0 else None


def pcm(samples):
    return np.rint(np.clip(samples, -1, 32767 / 32768) * 32768).astype("<i2")


def seed_number(seed):
    return int.from_bytes(hashlib.sha256(seed.encode("utf-8")).digest(), "big")


def edge_fade(samples, rate, attack_s, release_s):
    for edge, seconds in ((samples, attack_s), (samples[::-1], release_s)):
        count = min(len(samples), round(seconds * rate))
        if count:
            edge[:count] *= np.linspace(0, 1, count)


def synthesize(config, output):
    output.mkdir(parents=True, exist_ok=True)
    rate = config["sample_rate"]
    settings = config["sfx_synthesis"]
    entries = []
    for intent, mapping in config["intents"].items():
        family = mapping["effect_family"]
        if family is None:
            continue
        spec = settings["families"][family]
        duration = mapping["default_dur_s"]
        time = np.arange(round(duration * rate)) / rate
        progress = time / duration
        filter_sos = butter(settings["filter_order"], spec["noise_hz"], "bandpass", fs=rate, output="sos")
        for variant, values in enumerate(spec["variants"], 1):
            start, end, shape, noise_mix, envelope_peak = values
            identifier = f"{family}_{variant:02}"
            seed = f'{settings["seed"]}:{identifier}'
            noise = sosfilt(filter_sos, np.random.default_rng(seed_number(seed)).standard_normal(len(time)))
            oscillator = np.sin(2 * np.pi * time * (start + (end - start) * progress / 2))
            envelope = np.interp(progress, [0, envelope_peak, 1], [0, 1, 0]) ** shape
            samples = ((1 - noise_mix) * oscillator + noise_mix * noise) * envelope
            edge_fade(samples, rate, settings["edge_fade_s"], settings["edge_fade_s"])
            samples *= gain(spec["peak_dbfs"]) / np.max(np.abs(samples))
            wav = pcm(samples)
            wavfile.write(output / f"{identifier}.wav", rate, wav)
            measured = wav.astype(float) / 32768
            entries.append(dict(id=identifier, family=family, variant=variant, intent=intent,
                                file=f"library/sfx/{identifier}.wav", dur_s=len(wav) / rate,
                                peak_dbfs=dbfs(np.max(np.abs(measured))), rms_dbfs=dbfs(np.sqrt(np.mean(measured ** 2))),
                                seed=seed, params=dict(variant=values, noise_hz=spec["noise_hz"],
                                                       target_peak_dbfs=spec["peak_dbfs"],
                                                       edge_fade_s=settings["edge_fade_s"],
                                                       filter_order=settings["filter_order"]),
                                license="Original (tools/audio/sfx_synth.py) — CC0"))
    write_json(output / "manifest.json", dict(version=1, config_version=config["version"],
                                              sample_rate=rate, effects=entries))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=ROOT / "library/sfx")
    parser.add_argument("--config", type=Path, default=CONFIG)
    args = parser.parse_args()
    synthesize(read_json(args.config), args.out)
