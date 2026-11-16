"""Xuất bộ sticker "Cáo văn phòng" chính thức từ brand/cao/_raw theo tên trong tools/fox/names.json.

    python -X utf8 tools/fox/extract.py   # (1) tách từ assets/mascot
    python -X utf8 tools/fox/build.py     # (2) đặt tên + xuất

    brand/cao/poses/<tên>.png      dáng người cả người (có hiệu ứng nếu có)
    brand/cao/faces/<tên>.png      đầu biểu cảm
    brand/cao/mouths/<tên>.png     hình miệng cận cảnh (chưa ghép được vào đầu — xem docs/mascot.md)
    brand/cao/motion/<hành-động>_<n>.png   chuỗi 6 khung (độ phân giải thấp)
    brand/cao/catalog.png          tờ tra cứu có tên
    brand/cao/manifest.json        tên -> nguồn, kích thước
"""
import json
import os
import shutil
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "brand", "cao")
RAW = os.path.join(OUT, "_raw")
NAMES = os.path.join(os.path.dirname(__file__), "names.json")
PRIORITY = {"d": 0, "a": 1, "b": 2}  # bản ưu tiên khi trùng tên


def font(size):
    for f in ("C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf"):
        if os.path.exists(f):
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def main():
    names = json.load(open(NAMES, encoding="utf-8"))
    manifest = {"poses": {}, "faces": {}, "mouths": {}, "motion": {}}
    for sub in manifest:
        shutil.rmtree(os.path.join(OUT, sub), ignore_errors=True)
        os.makedirs(os.path.join(OUT, sub), exist_ok=True)
    used_raw = set()
    for group in ("poses", "faces", "mouths"):
        seen = {}
        for sid in sorted(names[group], key=lambda i: (PRIORITY.get(i[0], 9), i)):
            base = names[group][sid]
            src = os.path.join(RAW, f"{sid}.png")
            if not os.path.exists(src):
                print("THIẾU", src)
                sys.exit(1)
            seen[base] = seen.get(base, 0) + 1
            name = base if seen[base] == 1 else f"{base}_{seen[base]}"
            dst = os.path.join(OUT, group, f"{name}.png")
            shutil.copyfile(src, dst)
            with Image.open(dst) as im:
                manifest[group][name] = {"from": sid, "size": list(im.size)}
            used_raw.add(sid)
    # chuỗi chuyển động: giữ nguyên tên hành động từ extract
    for fn in sorted(os.listdir(RAW)):
        if fn.startswith("c-") and fn.endswith(".png"):
            act, n = fn[2:-4].rsplit("-", 1)
            dst = os.path.join(OUT, "motion", f"{act}_{n}.png")
            shutil.copyfile(os.path.join(RAW, fn), dst)
            with Image.open(dst) as im:
                manifest["motion"][f"{act}_{n}"] = {"from": fn[:-4], "size": list(im.size)}
    unused = sorted(f[:-4] for f in os.listdir(RAW) if f.endswith(".png") and f[0] in "abd" and f[:-4] not in used_raw)
    if unused:
        print("Chưa đặt tên (vẫn nằm ở _raw):", ", ".join(unused))
    with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)

    # tờ tra cứu có tên
    def tiles(group, th, cols, label_h=34):
        items = sorted(manifest[group].items())
        cells = []
        for name, meta in items:
            im = Image.open(os.path.join(OUT, group, f"{name}.png")).convert("RGBA")
            s = th / im.height
            im = im.resize((max(1, round(im.width * s)), th), Image.LANCZOS)
            cells.append((name, im))
        probe = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
        cw = max(max(c[1].width for c in cells) + 24, max(int(probe.textlength(c[0], font=font(17))) for c in cells) + 20)
        rows = (len(cells) + cols - 1) // cols
        sheet = Image.new("RGBA", (cw * cols, (th + label_h) * rows), (27, 42, 73, 255))
        d = ImageDraw.Draw(sheet)
        for i, (name, im) in enumerate(cells):
            x, y = (i % cols) * cw, (i // cols) * (th + label_h)
            sheet.alpha_composite(im, (x + (cw - im.width) // 2, y))
            d.text((x + cw // 2, y + th + 4), name, font=font(17), fill=(255, 240, 200, 255), anchor="ma")
        return sheet

    parts = [("TƯ THẾ CẢ NGƯỜI (poses/)", tiles("poses", 250, 9)), ("BIỂU CẢM (faces/)", tiles("faces", 120, 10)), ("HÌNH MIỆNG (mouths/)", tiles("mouths", 70, 6))]
    W = max(p[1].width for p in parts)
    H = sum(p[1].height + 56 for p in parts) + 20
    cat = Image.new("RGBA", (W, H), (27, 42, 73, 255))
    d = ImageDraw.Draw(cat)
    y = 10
    for title, im in parts:
        d.text((16, y + 8), title, font=font(26), fill=(255, 182, 46, 255))
        cat.alpha_composite(im, (0, y + 48))
        y += im.height + 56
    cat.convert("RGB").save(os.path.join(OUT, "catalog.png"))
    n = {k: len(v) for k, v in manifest.items()}
    print("Đã xuất:", n, "-> brand/cao/ (catalog.png để tra cứu)")


if __name__ == "__main__":
    main()
