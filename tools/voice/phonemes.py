#!/usr/bin/env python3
"""Xem chuỗi âm vị mà VieNeu-TTS nhận thật, để chắc từ tiếng Anh KHÔNG bị đọc theo âm tiếng Việt.

Vì sao có công cụ này (giám đốc nghe T5 ngày 19/11/2026): VieNeu v3 Turbo tự đọc từ tiếng Anh bằng âm vị
tiếng Anh nếu để NGUYÊN CHỮ GỐC ("Partition" -> pɑːɹtˈɪʃən). Phiên âm kiểu Việt ("pa-ti-sần") ép mô hình
đọc bằng âm tiếng Việt (pˈaː2 t̪ˈi sˈə2n), nghe sai. Agent không nghe được âm thanh, nên kiểm bằng chính chuỗi
âm vị: từ tiếng Anh không được chứa dấu hiệu âm tiếng Việt (số thanh điệu 1–7, ɜ không kèm ː, t̪, ɗ, ɲ, ɣ),
và phải GIỮ NGUYÊN khi nằm giữa câu tiếng Việt (bộ G2P đổi cách đọc theo ngữ cảnh: "UI", "AI", "HTTPS", "IDE"
đứng riêng và đứng trong câu có thể ra hai kết quả khác nhau).

Cách dùng (cần `pip install vieneu`; mọi lệnh dùng đúng bước chia câu + G2P của engine):
    python tools/voice/phonemes.py --text "Partition chia các dòng theo một cột."
    python tools/voice/phonemes.py --lines <apply.json> [--extra <từ điển riêng.json>]
    python tools/voice/phonemes.py --check-dictionary [--extra <từ điển riêng.json>]
Tuỳ chọn: --dictionary <tệp.json> (mặc định tools/voice/pronunciation.json), --json.
  --lines  : tệp JSON do `node tools/voice/pronounce.mjs apply --column "Lời đọc" --json` tạo (mảng {row,label,text,tts}).
  --check-dictionary : kiểm từng mục từ điển (đứng riêng và trong 3 câu khung tiếng Việt).
Mục từ điển có "lang": "vi" được bỏ qua. Mã thoát: 0 đạt · 1 có từ đọc theo âm Việt hoặc đổi theo ngữ cảnh · 2 lỗi tham số/thiếu VieNeu.
Chỉ kiểm âm vị, KHÔNG thay việc nghe: phát âm thật vẫn "CHƯA KIỂM — giám đốc nghe".
"""
import argparse
import json
import re
import sys
from pathlib import Path

DEFAULT_DICTIONARY = Path(__file__).resolve().with_name("pronunciation.json")
# Dấu hiệu âm tiếng Việt trong chuỗi âm vị của sea-g2p: số chỉ thanh điệu, ɜ không kèm ː (thanh sắc),
# t̪ (t Việt), ɗ (đ), ɲ (nh), ɣ (g/gh). Âm tiếng Anh như ɜː (server) hoặc ŋ không bị tính.
VI_MARKS = re.compile(r"[1-7]|ɜ(?!ː)|t̪|ɗ|ɲ|ɣ")
FRAMES = ["Mỗi {} là duy nhất.", "Bạn gọi {} để lấy dữ liệu.", "Truy vấn dùng {} rất nhanh, đúng không?"]
TRAILING = re.compile(r"[\s.,!?…;:]+$")
LAYOUT = re.compile(r"[ˈˌ\s]")  # dấu nhấn và khoảng trắng đổi theo cách ghép chữ, không đổi âm


def fail(message):
    sys.stderr.write(message + "\n")
    sys.exit(2)


def load_engine():
    try:
        from vieneu_utils.phonemize_text import normalize_to_chunks_v3_with_gaps, phonemize_text_with_emotions
    except ImportError as error:
        fail(f"Cần cài VieNeu-TTS (pip install vieneu) để xem âm vị. {error}")

    def phonemes(text):
        chunks, _gaps = normalize_to_chunks_v3_with_gaps(text, max_chars=256)
        return " ".join(phonemize_text_with_emotions(chunk) for chunk in chunks)

    return phonemes


def key(name):
    return re.sub(r"[ \t]+", " ", name.strip()).lower()


def load_entries(dictionary, extra):
    entries = {}
    for source, path in (("chung", dictionary), ("riêng", extra)):
        if path is None:
            continue
        try:
            data = json.loads(Path(path).read_text(encoding="utf-8-sig"))
        except (OSError, ValueError) as error:
            fail(f"Không đọc được từ điển {path}: {error}")
        for entry in data.get("entries", []):
            if entry.get("lang") == "vi" or not entry.get("tts"):
                continue
            item = {"term": entry["term"], "tts": entry["tts"], "source": source}
            for name in [entry["term"], *entry.get("aliases", [])]:
                entries[key(name)] = item  # mục riêng thay mục chung trùng khoá
    unique = {id(item): item for item in entries.values()}  # một mục nhiều bí danh chỉ kiểm một lần
    return list(unique.values())


def core(ph):
    return TRAILING.sub("", ph)


def check_term(phonemes, tts, sentence_texts):
    """Trả về (ipa, vấn đề, chi tiết). sentence_texts: các câu chứa tts để kiểm đổi cách đọc theo ngữ cảnh."""
    ipa = core(phonemes(tts))
    if VI_MARKS.search(ipa):
        return ipa, "vietnamese_reading", f"Đứng riêng đã ra âm tiếng Việt: {ipa}"
    want = LAYOUT.sub("", ipa)
    for sentence in sentence_texts:
        got = phonemes(sentence)
        if want not in LAYOUT.sub("", got):
            return ipa, "context_changes_reading", f"Trong «{sentence}» âm vị ra: {got}"
    return ipa, None, ""


def run_text(phonemes, texts):
    rows = [{"text": text, "phonemes": phonemes(text)} for text in texts]
    return {"ok": True, "texts": rows}, rows


def run_dictionary(phonemes, entries):
    out = []
    for entry in entries:
        frames = [frame.format(entry["tts"]) for frame in FRAMES]
        ipa, issue, detail = check_term(phonemes, entry["tts"], frames)
        out.append({**entry, "ipa": ipa, "ok": issue is None, "issue": issue, "detail": detail})
    return {"ok": all(item["ok"] for item in out), "entries": out}


def run_lines(phonemes, lines, entries):
    out = []
    for line in lines:
        text = line.get("tts", line.get("text", ""))
        found = []
        for entry in entries:
            pattern = r"(?<![\w])" + re.escape(entry["tts"]).replace(r"\ ", r"\s+") + r"(?![\w])"
            if re.search(pattern, text, re.IGNORECASE):
                ipa, issue, detail = check_term(phonemes, entry["tts"], [text])
                found.append({"term": entry["term"], "tts": entry["tts"], "ipa": ipa,
                              "ok": issue is None, "issue": issue, "detail": detail})
        out.append({"row": line.get("row"), "label": line.get("label", ""), "tts": text,
                    "phonemes": phonemes(text), "terms": found, "ok": all(item["ok"] for item in found)})
    return {"ok": all(item["ok"] for item in out), "lines": out}


def render(result):
    if "texts" in result:
        return "\n".join(f"{row['text']}\n  {row['phonemes']}" for row in result["texts"])
    lines = []
    if "entries" in result:
        for item in result["entries"]:
            mark = "OK " if item["ok"] else "LỖI"
            lines.append(f"{mark} {item['term']} [{item['source']}] «{item['tts']}» → {item['ipa']}"
                         + ("" if item["ok"] else f"\n      {item['issue']}: {item['detail']}"))
    else:
        for row in result["lines"]:
            lines.append(f"Dòng {row['row']} {row['label']}: {row['tts']}\n  {row['phonemes']}")
            for item in row["terms"]:
                mark = "OK " if item["ok"] else "LỖI"
                lines.append(f"  {mark} {item['term']} «{item['tts']}» → {item['ipa']}"
                             + ("" if item["ok"] else f"\n      {item['issue']}: {item['detail']}"))
    lines.append("ĐẠT: không có từ tiếng Anh nào đọc theo âm tiếng Việt hoặc đổi theo ngữ cảnh. "
                 "Phát âm thật vẫn CHƯA KIỂM — giám đốc nghe." if result["ok"]
                 else "KHÔNG ĐẠT: sửa tts của mục lỗi (chính tả tiếng Anh, không phiên âm tiếng Việt) rồi chạy lại.")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Xem âm vị VieNeu-TTS nhận và kiểm từ tiếng Anh.")
    parser.add_argument("--text", action="append", default=[], help="câu cần xem âm vị (lặp được)")
    parser.add_argument("--lines", help="tệp JSON do pronounce.mjs apply --json tạo")
    parser.add_argument("--check-dictionary", action="store_true", help="kiểm từng mục từ điển")
    parser.add_argument("--dictionary", default=str(DEFAULT_DICTIONARY), help="từ điển chung")
    parser.add_argument("--extra", help="từ điển riêng của video")
    parser.add_argument("--json", action="store_true", help="xuất JSON")
    args = parser.parse_args()
    modes = [bool(args.text), bool(args.lines), args.check_dictionary]
    if sum(modes) != 1:
        fail("Chọn đúng một chế độ: --text, --lines hoặc --check-dictionary.")

    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8")
    phonemes = load_engine()
    if args.text:
        result, _ = run_text(phonemes, args.text)
    elif args.check_dictionary:
        result = run_dictionary(phonemes, load_entries(args.dictionary, args.extra))
    else:
        try:
            lines = json.loads(Path(args.lines).read_text(encoding="utf-8-sig"))
        except (OSError, ValueError) as error:
            fail(f"Không đọc được {args.lines}: {error}")
        if not isinstance(lines, list):
            fail("--lines cần mảng JSON do pronounce.mjs apply --json tạo.")
        result = run_lines(phonemes, lines, load_entries(args.dictionary, args.extra))
    print(json.dumps(result, ensure_ascii=False, indent=2) if args.json else render(result))
    sys.exit(0 if result["ok"] else 1)


if __name__ == "__main__":
    main()
