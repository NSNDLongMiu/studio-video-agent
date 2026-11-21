# Y6–Y8 dùng từ điển chung, chỉnh tốc độ từng dòng và ghép khoảng nghỉ đã đo.
# Không đưa audio vào mô hình. Phát âm CHƯA KIỂM — giám đốc nghe.
import argparse
import json
import os
import subprocess
import sys
from contextlib import redirect_stdout
from pathlib import Path

FFMPEG = os.environ.get("FFMPEG") or "ffmpeg"
FFPROBE = os.environ.get("FFPROBE") or "ffprobe"
PRONOUNCE = Path(__file__).resolve().parents[3] / "tools" / "voice" / "pronounce.mjs"
# Y6 mới (giám đốc 19/11/2026): tăng tốc độ đọc 10–15% so với T8 (T8: 0,97–1,03). Trần 1,20: cao hơn dễ méo giọng.
SPEED_CLASSES = {"dan": 1.15, "ky_thuat": 1.09}
DEFAULT_TEMPO = 1.12
TEMPO_MIN, TEMPO_MAX = 0.8, 1.2
DEFAULT_PAUSES = {"comma": 0.30, "period": 0.55, "question": 0.95, "new_topic": 1.10}
PAUSE_BY_MARK = {
    ".": "period", "…": "period", "?": "question", "!": "question",
    ",": "comma", ";": "comma", ":": "comma",
}


def get_tempo(line, spec, number):
    if "tempo" in line or "tempo" in spec:
        tempo = line.get("tempo", spec.get("tempo"))
    elif "speed_class" in line:
        tempo = SPEED_CLASSES.get(line["speed_class"])
        if tempo is None:
            raise ValueError(f"Dòng {number} cần speed_class là dan hoặc ky_thuat.")
    else:
        tempo = DEFAULT_TEMPO
    if type(tempo) not in (int, float) or not TEMPO_MIN <= tempo <= TEMPO_MAX:
        raise ValueError(f"Dòng {number} cần tempo là số trong khoảng [{TEMPO_MIN}, {TEMPO_MAX}].")
    return tempo


def get_pause(line, defaults, number):
    if "pause_after_s" in line:
        pause = line["pause_after_s"]
    else:
        mark = line.get("text", "").rstrip()[-1:]
        kind = "new_topic" if line.get("new_topic") else PAUSE_BY_MARK.get(mark)
        pause = defaults.get(kind, 0.30)
    if type(pause) not in (int, float) or not 0 <= pause < float("inf"):
        raise ValueError(f"Dòng {number} cần khoảng nghỉ là số hữu hạn từ 0 trở lên.")
    if "pause_after_s" not in line and line.get("important"):
        return max(pause, 0.95)
    return pause


def pronunciation(line, spec, number):
    if "text_tts" in line:
        return line["text_tts"]
    text = line["text"]
    command = ["node", str(PRONOUNCE), "apply"]
    # Dạng có dấu bằng giữ nguyên văn bản mở đầu bằng dấu gạch ngang.
    command.extend([f"--text={text}"] if text.startswith("-") else ["--text", text])
    if "pronunciation_extra" in spec:
        command.extend(["--extra", spec["pronunciation_extra"]])
    try:
        return subprocess.run(command, check=True, capture_output=True, encoding="utf-8").stdout
    except subprocess.CalledProcessError as error:
        detail = error.stderr.strip() or f"CLI thoát mã {error.returncode}."
        raise ValueError(f"Dòng {number} gặp lỗi áp dụng từ điển phát âm. {detail}") from error
    except OSError as error:
        raise ValueError(f"Dòng {number} không chạy được CLI phát âm. {error}") from error


def ffmpeg(*args):
    subprocess.run([FFMPEG, "-y", "-v", "error", *args], check=True)


def probe_clip(path):
    result = subprocess.run(
        [FFPROBE, "-v", "error", "-select_streams", "a:0",
         "-show_entries", "stream=sample_rate,channels,channel_layout:format=duration",
         "-of", "json", path],
        check=True, capture_output=True, encoding="utf-8",
    )
    return json.loads(result.stdout)



def semantic_generation(args, spec_path, spec, plan):
    import hashlib
    import importlib.metadata
    import tempfile

    voice_tools = PRONOUNCE.parent
    sys.path.insert(0, str(voice_tools))
    import numpy as np
    from splice import _read_wav, _write_wav, prepare_clip

    config = json.loads((voice_tools / "prosody.json").read_text(encoding="utf-8"))
    audio_config = config["audio"]
    rate = audio_config["sample_rate"]
    directory = Path(args.out).resolve() if args.out else spec_path.parent
    cache = directory / "line-cache"
    cache.mkdir(parents=True, exist_ok=True)
    try:
        engine_version = importlib.metadata.version("vieneu")
    except importlib.metadata.PackageNotFoundError:
        engine_version = "không có metadata gói"
    engine = {"name": config["engine"]["name"], "version": engine_version}
    if plan:
        lines = plan["lines"]
    else:
        planner = subprocess.run(
            ["node", str(voice_tools / "prosody.mjs"), "plan", "--script", str(spec_path)],
            check=True, capture_output=True, encoding="utf-8",
        )
        lines = json.loads(planner.stdout)["lines"]
    if not lines:
        raise ValueError("Kế hoạch cần có ít nhất một dòng.")
    spec_lines = {
        str(item.get("line_id", item.get("id", index))).zfill(2): item
        for index, item in enumerate(spec["lines"], 1)
    }
    ids = {str(line["line_id"]).zfill(2) for line in lines}
    if len(ids) != len(lines):
        raise ValueError("Kế hoạch có mã dòng trùng.")
    selected = {number.strip().zfill(2) for number in args.only.split(",")} if args.only else ids
    if not selected <= ids:
        raise ValueError("--only có mã dòng ngoài kế hoạch.")

    def read_json(path):
        return json.loads(path.read_text(encoding="utf-8"))

    def write_json(path, value):
        path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    def tempo_value(value):
        if type(value) not in (int, float) or not -float("inf") < value < float("inf"):
            raise ValueError("Tempo cần là số hữu hạn.")
        return max(config["tempo"]["min"], min(config["tempo"]["max"], value))

    def prepare(signal, *, chunk=False):
        prefix = "chunk_" if chunk else ""
        return prepare_clip(signal, rate, audio_config[prefix + "lead_ms"],
                            audio_config[prefix + "tail_ms"], audio_config["fade_ms"], audio_config["floor_db"])

    def silence(seconds):
        if type(seconds) not in (int, float) or not 0 <= seconds < float("inf"):
            raise ValueError("Khoảng nghỉ cần là số hữu hạn từ 0 trở lên.")
        return np.zeros(round(seconds * rate), dtype=np.int16)

    requests = []
    for line in lines:
        line_id = str(line["line_id"]).zfill(2)
        original = spec_lines.get(line_id, {})
        actual = line if plan else {**line, **original}
        text = actual.get("tts", actual.get("text_tts", actual["text"]))
        voice = original.get("voice", actual.get("voice", audio_config["voice"]))
        temperature = actual.get("temperature", config["intents"][actual["intent"]]["temperature"])
        if type(temperature) not in (int, float) or not 0 <= temperature < float("inf"):
            raise ValueError(f"Dòng {line_id} cần temperature hữu hạn từ 0 trở lên.")
        tempo = tempo_value(actual["tempo"])
        chunks = actual.get("chunks") or [{"text": text, "role": "normal", "pause_before_s": 0, "tempo": tempo}]
        if not plan and "tempo" in original and "chunks" not in original and len(chunks) == 1:
            chunks = [{**chunks[0], "tempo": tempo}]
        chunks = [{**chunk, "tempo": tempo_value(chunk.get("tempo", tempo))} for chunk in chunks]
        key_input = {"text": text, "voice": voice, "temperature": temperature, "tempo": tempo,
                     "chunks": chunks, "engine": engine, "audio_config": audio_config}
        key = hashlib.sha256(json.dumps(key_input, ensure_ascii=False, sort_keys=True).encode("utf-8")).hexdigest()
        entry = cache / key
        hit = (entry / "clip.wav").is_file() and (entry / "metadata.json").is_file()
        if not hit and line_id not in selected:
            raise ValueError(f"Dòng {line_id} thiếu cache. Thêm dòng vào --only hoặc chạy toàn bộ.")
        requests.append((actual, line_id, key_input, entry, hit))

    tts = None
    reports = []
    track = []
    previous = None
    for line, line_id, request, entry, hit in requests:
        clip_path = entry / "clip.wav"
        metadata_path = entry / "metadata.json"
        if not hit:
            with redirect_stdout(sys.stderr):
                if tts is None:
                    from vieneu import Vieneu
                    tts = Vieneu()
            with tempfile.TemporaryDirectory(dir=cache) as temp:
                work = Path(temp)
                parts = []
                spans = []
                cursor = 0
                tail = 0
                chunks = request["chunks"]
                for index, chunk in enumerate(chunks):
                    raw = work / "raw.wav"
                    adjusted = work / "adjusted.wav"
                    with redirect_stdout(sys.stderr):
                        signal = tts.infer(chunk["text"], voice=request["voice"], temperature=request["temperature"])
                        tts.save(signal, str(raw))
                    ffmpeg("-i", raw, "-af", f"atempo={chunk['tempo']}", "-ar", str(rate),
                           "-ac", "1", "-c:a", "pcm_s16le", adjusted)
                    raw_pcm, _ = _read_wav(adjusted)
                    pcm, edges = prepare(raw_pcm, chunk=len(chunks) > 1)
                    lead = edges["lead_ms"] / 1000
                    if index:
                        missing = max(0, chunk.get("pause_before_s", 0) - lead - tail)
                        gap = silence(missing)
                        parts.append(gap)
                        cursor += len(gap)
                    start = cursor / rate + lead
                    cursor += len(pcm)
                    tail = edges["tail_ms"] / 1000
                    spans.append({"role": chunk.get("role", "normal"), "start": start, "end": cursor / rate - tail})
                    parts.append(pcm)
                original = np.concatenate(parts)
                pcm, edges = prepare(original)
                lead = edges["lead_ms"] / 1000
                tail = edges["tail_ms"] / 1000
                origin = spans[0]["start"]
                times = [{**span, "start": span["start"] - origin, "end": span["end"] - origin} for span in spans]
                metadata = {"duration_s": len(pcm) / rate, "speech_s": len(pcm) / rate - lead - tail,
                            "lead_s": lead, "tail_s": tail, "chunks": times}
                _write_wav(work / "clip.wav", pcm, rate)
                write_json(work / "metadata.json", metadata)
                entry.mkdir(exist_ok=True)
                os.replace(work / "clip.wav", clip_path)
                os.replace(work / "metadata.json", metadata_path)
        pcm, _ = _read_wav(clip_path)
        metadata = read_json(metadata_path)
        before = line.get("pause_before_s", 0)
        if previous:
            before = max(before, previous["pause_after_s"]) - previous["tail_s"]
        inserted = silence(max(0, before - metadata["lead_s"]))
        track.extend((inserted, pcm))
        measured_chunks = [{**span, "tempo": chunk["tempo"]}
                           for span, chunk in zip(metadata["chunks"], request["chunks"], strict=True)]
        report = {**metadata, "chunks": measured_chunks, "line_id": line_id, "scene_id": line.get("scene_id"),
                  "file": str(clip_path), "text": line["text"], "cache": "hit" if hit else "miss",
                  "temperature": request["temperature"], "tempo": request["tempo"],
                  "tts": request["text"], "inserted_before_s": len(inserted) / rate,
                  "pause_after_s": line.get("pause_after_s", 0), "intonation_status": "advisory",
                  "emotion_status": "advisory"}
        reports.append(report)
        previous = report
    track.append(silence(max(0, previous["pause_after_s"] - previous["tail_s"])))
    full = directory / "vo_full.wav"
    waveform = np.concatenate(track)
    _write_wav(full, waveform, rate)
    result = {"version": 1, "engine": engine, "full": str(full), "sample_rate": rate,
              "total_s": len(waveform) / rate, "lines": reports,
              "cache": {status: sum(line["cache"] == status for line in reports) for status in ("hit", "miss")}}
    write_json(directory / "generation.json", result)
    print(json.dumps(result))


def main():
    parser = argparse.ArgumentParser(description="Tạo giọng đọc từ spec hoặc kế hoạch ngữ nghĩa.")
    parser.add_argument("spec")
    parser.add_argument("--plan")
    parser.add_argument("--only")
    parser.add_argument("--out", help="Thư mục đầu ra của chế độ ngữ nghĩa.")
    args = parser.parse_args()
    spec_path = Path(args.spec).resolve()
    spec = json.loads(spec_path.read_text(encoding="utf-8-sig"))
    plan = json.loads(Path(args.plan).read_text(encoding="utf-8-sig")) if args.plan else None
    semantic_keys = {"intent", "emotion", "emphasis", "pace", "temperature", "chunks",
                     "pause_before_s", "intonation", "transition"}
    if plan is not None or args.only or args.out or any(semantic_keys & line.keys() for line in spec["lines"]):
        return semantic_generation(args, spec_path, spec, plan)
    lines = spec["lines"]
    if not lines:
        raise ValueError("Spec cần có ít nhất một dòng lời đọc.")
    defaults = DEFAULT_PAUSES | spec.get("default_pauses", {})
    tempos = [get_tempo(line, spec, i) for i, line in enumerate(lines, 1)]
    requested_pauses = [get_pause(line, defaults, i) for i, line in enumerate(lines[:-1], 1)] + [0]
    texts = [pronunciation(line, spec, i) for i, line in enumerate(lines, 1)]

    with redirect_stdout(sys.stderr):
        from vieneu import Vieneu
        tts = Vieneu()

    out_dir = spec_path.parent
    clip_paths = []
    speech_s = []
    pause_s = []
    output_format = []
    for i, (line, text_tts, tempo, pause) in enumerate(zip(lines, texts, tempos, requested_pauses)):
        raw = out_dir / f"vo_{i}_raw.wav"
        clip = out_dir / f"vo_{i}.wav"
        with redirect_stdout(sys.stderr):
            audio = tts.infer(text_tts, voice=line.get("voice", "Hải Đăng"), temperature=0.65)
            tts.save(audio, str(raw))
        ffmpeg("-i", raw, "-af", f"atempo={tempo}", *output_format, clip)
        clip_paths.append(clip)
        info = probe_clip(clip)
        speech_s.append(float(info["format"]["duration"]))
        stream = info["streams"][0]
        rate = stream["sample_rate"]
        channels = str(stream["channels"])
        layout = stream.get("channel_layout", f"{channels}c")
        if i == 0:
            # Các đoạn trong concat dùng cùng cấu hình WAV, kể cả khi đổi giọng.
            output_format = ["-ar", rate, "-ac", channels, "-channel_layout", layout]

        samples = round(pause * int(rate))
        pause_s.append(samples / int(rate))
        if samples:
            silence = out_dir / f"vo_{i}_pause.wav"
            ffmpeg("-f", "lavfi", "-i", f"anullsrc=r={rate}:cl={layout}",
                   "-af", f"atrim=end_sample={samples}", silence)
            clip_paths.append(silence)

    listfile = out_dir / "vo_concat.ffconcat"
    entries = "".join(f"file '{clip.name}'\n" for clip in clip_paths)
    listfile.write_text("ffconcat version 1.0\n" + entries, encoding="utf-8")
    full = out_dir / "vo_full.wav"
    ffmpeg("-f", "concat", "-safe", "0", "-i", listfile, full)

    per_line_s = [speech + pause for speech, pause in zip(speech_s, pause_s)]
    print(json.dumps({
        "full": str(full), "per_line_s": per_line_s, "total_s": sum(per_line_s),
        "speech_s": speech_s, "pause_s": pause_s, "tempo": tempos, "tts_text": texts,
    }))


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        sys.exit(f"Lỗi tạo giọng đọc. {error}")
