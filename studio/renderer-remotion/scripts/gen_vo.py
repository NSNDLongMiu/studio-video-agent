# Y6–Y8 dùng từ điển chung, chỉnh tốc độ từng dòng và ghép khoảng nghỉ đã đo.
# Không đưa audio vào mô hình. Phát âm CHƯA KIỂM — giám đốc nghe.
import json
import os
import subprocess
import sys
from contextlib import redirect_stdout
from pathlib import Path

FFMPEG = os.environ.get("FFMPEG") or "ffmpeg"
FFPROBE = os.environ.get("FFPROBE") or "ffprobe"
PRONOUNCE = Path(__file__).resolve().parents[3] / "tools" / "voice" / "pronounce.mjs"
SPEED_CLASSES = {"dan": 1.03, "ky_thuat": 0.97}
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
        tempo = 1.00
    if type(tempo) not in (int, float) or not 0.8 <= tempo <= 1.3:
        raise ValueError(f"Dòng {number} cần tempo là số trong khoảng [0.8, 1.3].")
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


def main():
    if len(sys.argv) != 2:
        raise ValueError("Cách dùng — python gen_vo.py <spec.json>")
    spec_path = Path(os.path.abspath(sys.argv[1]))
    spec = json.loads(spec_path.read_text(encoding="utf-8"))
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
            audio = tts.infer(text_tts, voice=line.get("voice", "Minh Đức"), temperature=0.65)
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
