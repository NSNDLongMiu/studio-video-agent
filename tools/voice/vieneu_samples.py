"""Sinh mẫu giọng VieNeu-TTS để nghe thử và so sánh (CHẠY TRÊN MÁY TRIỂN KHAI, cần `pip install vieneu`).

    python tools/voice/vieneu_samples.py --voices "Phạm Tuyên,Quỳnh Anh,Thái Sơn,Minh Triết" --out voice-samples
    python tools/voice/vieneu_samples.py --list            # in danh sách giọng có sẵn

!! CHƯA CHẠY THỬ: viết theo ví dụ trong README của VieNeu-TTS (Vieneu(), list_preset_voices(), infer(), save()).
   Nếu tên hàm/tham số khác ở phiên bản bạn cài, sửa theo README đi kèm bản đó.
Mỗi giọng -> <out>/<giọng>__<số câu>.wav; cuối cùng in thời gian dựng / thời lượng tiếng (RTF) để biết máy đủ nhanh không.
Nhớ: mọi video dùng giọng AI đều phải GẮN NHÃN AI khi đăng (docs/platform-specs.md).
"""
import argparse
import os
import time
import wave


def duration_s(path):
    with wave.open(path, "rb") as w:
        return w.getnframes() / float(w.getframerate())


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    ap = argparse.ArgumentParser()
    ap.add_argument("--voices", default="", help="tên giọng, ngăn bằng dấu phẩy (đúng chính tả có dấu như list_preset_voices())")
    ap.add_argument("--text", default=os.path.join(here, "sample_text.txt"), help="mỗi dòng là một câu mẫu")
    ap.add_argument("--out", default="voice-samples")
    ap.add_argument("--list", action="store_true")
    a = ap.parse_args()

    from vieneu import Vieneu  # import muộn để --help chạy được khi chưa cài

    tts = Vieneu()  # có GPU thì dùng GPU, không thì ONNX/CPU (theo README)
    if a.list:
        for v in tts.list_preset_voices():
            print(v)
        return
    voices = [v.strip() for v in a.voices.split(",") if v.strip()]
    if not voices:
        raise SystemExit("Cần --voices (hoặc --list để xem danh sách)")
    lines = [l.strip() for l in open(a.text, encoding="utf-8") if l.strip()]
    os.makedirs(a.out, exist_ok=True)
    for voice in voices:
        t0, audio_s = time.time(), 0.0
        for i, line in enumerate(lines, start=1):
            audio = tts.infer(line, voice=voice)
            path = os.path.join(a.out, f"{voice.replace(' ', '_')}__{i}.wav")
            tts.save(audio, path)
            audio_s += duration_s(path)
        took = time.time() - t0
        print(f"{voice}: {len(lines)} câu, {audio_s:.1f}s tiếng, dựng {took:.1f}s, RTF={took / max(audio_s, 1e-6):.2f}")


if __name__ == "__main__":
    main()
