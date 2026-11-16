"""Tách các tờ sticker "Cáo văn phòng" (assets/mascot/*.png) thành từng ảnh PNG nền trong suốt.

    python -X utf8 tools/fox/extract.py
      -> brand/cao/_raw/<id>.png        từng sticker (cắt sát, nền trong suốt)
      -> brand/cao/_raw/manifest.json   id, tờ nguồn, hàng/cột, kích thước
      -> brand/cao/_index/*.png         tờ đánh số id để tra cứu bằng mắt

Không sửa gì trong assets/ (nguồn giữ nguyên). Tất định: cùng ảnh nguồn -> cùng kết quả.
Tờ 1, 2, 4: tách theo thành phần liên thông của kênh alpha (>=128, nở 1px) rồi xếp theo hàng/cột.
Tờ 3 (chuỗi chuyển động): lưới cố định 8 hàng x 6 khung, bỏ cột nhãn chữ ở bên trái.
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as ndi

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(ROOT, "assets", "mascot")
OUT = os.path.join(ROOT, "brand", "cao")
RAW = os.path.join(OUT, "_raw")
IDX = os.path.join(OUT, "_index")

SHEETS = [
    # (mã, tên file, chế độ, số lượng mong đợi)
    ("a", "Bộ sticker cáo hoạt hình công sở 3D-1.png", "cc", 16),
    ("b", "Bảng biểu cảm cáo cam 3D-2.png", "cc", 37),
    ("c", "Bảng chuyển động cáo hoạt hình 3D-3.png", "grid", 48),
    ("d", "Bộ sticker cáo MC công sở biểu cảm-4.png", "cc", 15),
]
MIN_AREA = 6000
ROW_SPLIT = 80  # chênh lệch y giữa 2 sticker liên tiếp (đã sắp theo y) để coi là sang hàng mới
# Tờ 3: hàng cao không đều nên dùng ranh giới đo được (đáy mật độ điểm ảnh giữa các hàng / khe giữa các cột)
ROW_EDGES = [0, 155, 306, 442, 565, 685, 787, 907, 1024]
COL_EDGES = [250, 436, 655, 871, 1078, 1286, 1536]
MOTIONS = ["wave", "point", "nod", "bow", "turn", "arms_up", "emphasis", "present"]  # thứ tự hàng trong tờ 3


def font(size):
    for f in ("C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf"):
        if os.path.exists(f):
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def defringe(img):
    """Bỏ quầng bán trong suốt còn sót từ nền cũ: giữ lõi (alpha>=200) + mép mềm 3px, bỏ phần quầng xa hơn.
    Đã so sánh 4 cách trên nền tối/sáng: ảnh gốc lộ quầng xanh/hồng; cách này sạch mà mép vẫn tự nhiên."""
    a = np.array(img)
    al = a[:, :, 3].astype(np.float32)
    core = al >= 200
    if not core.any():
        return img
    dist = ndi.distance_transform_edt(~core)
    fade = np.clip(1 - dist / 3.0, 0, 1)
    al2 = np.where(core, al, np.minimum(al, 255 * fade))
    al2[al2 < 20] = 0
    a[:, :, 3] = al2.astype(np.uint8)
    return Image.fromarray(a, "RGBA")


def trim(img):
    bb = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    return img.crop(bb) if bb else img


def by_components(arr):
    m = arr[:, :, 3] >= 128
    grown = ndi.binary_dilation(m, structure=np.ones((3, 3)), iterations=1)
    lab, _ = ndi.label(grown)
    items = []
    for k, sl in enumerate(ndi.find_objects(lab), start=1):
        if sl is None:
            continue
        area = int(m[sl][lab[sl] == k].sum())
        if area < MIN_AREA:
            continue
        ys, xs = sl
        items.append({"k": k, "box": (xs.start, ys.start, xs.stop, ys.stop), "cy": (ys.start + ys.stop) / 2})
    items.sort(key=lambda i: i["cy"])
    rows, cur = [], []
    for it in items:
        if cur and it["cy"] - cur[-1]["cy"] > ROW_SPLIT:
            rows.append(cur)
            cur = []
        cur.append(it)
    if cur:
        rows.append(cur)
    pieces = []
    for r, row in enumerate(sorted(rows, key=lambda r: np.mean([i["cy"] for i in r])), start=1):
        for c, it in enumerate(sorted(row, key=lambda i: i["box"][0]), start=1):
            x0, y0, x1, y1 = it["box"]
            pad = 4
            x0, y0, x1, y1 = max(0, x0 - pad), max(0, y0 - pad), min(arr.shape[1], x1 + pad), min(arr.shape[0], y1 + pad)
            piece = arr[y0:y1, x0:x1].copy()
            keep = ndi.binary_dilation(lab[y0:y1, x0:x1] == it["k"], iterations=pad)
            piece[~keep, 3] = 0  # bỏ phần của nhân vật bên cạnh
            pieces.append({"row": r, "col": c, "box": [x0, y0, x1, y1], "img": trim(defringe(Image.fromarray(piece, "RGBA")))})
    return pieces


def by_grid(arr):
    pieces = []
    for r in range(len(ROW_EDGES) - 1):
        for c in range(len(COL_EDGES) - 1):
            bx0, bx1 = COL_EDGES[c], COL_EDGES[c + 1]
            by0, by1 = ROW_EDGES[r], ROW_EDGES[r + 1]
            cell = arr[by0:by1, bx0:bx1].copy()
            m = cell[:, :, 3] >= 128
            lab, n = ndi.label(ndi.binary_dilation(m, iterations=2))
            if n == 0:
                continue
            sizes = ndi.sum(m, lab, range(1, n + 1))
            cell[lab != (1 + int(np.argmax(sizes)))] = 0  # chỉ giữ thành phần lớn nhất trong ô
            pieces.append({"row": r + 1, "col": c + 1, "box": [bx0, by0, bx1, by1], "img": trim(defringe(Image.fromarray(cell, "RGBA")))})
    return pieces


def main():
    os.makedirs(RAW, exist_ok=True)
    os.makedirs(IDX, exist_ok=True)
    manifest = []
    ok = True
    for code, fname, mode, expect in SHEETS:
        path = os.path.join(SRC, fname)
        if not os.path.exists(path):
            print("THIẾU", path)
            sys.exit(1)
        im = Image.open(path).convert("RGBA")
        arr = np.array(im)
        pieces = by_components(arr) if mode == "cc" else by_grid(arr)
        sheet = Image.new("RGBA", im.size, (27, 42, 73, 255))
        sheet.alpha_composite(im)
        dr = ImageDraw.Draw(sheet)
        for n, p in enumerate(pieces, start=1):
            sid = f"{code}{n:02d}" if mode == "cc" else f"c-{MOTIONS[p['row'] - 1]}-{p['col']}"
            p["img"].save(os.path.join(RAW, f"{sid}.png"), optimize=True)
            manifest.append({"id": sid, "sheet": fname, "row": p["row"], "col": p["col"], "size": list(p["img"].size)})
            x0, y0 = p["box"][0] + 4, p["box"][1] + 2
            label = sid.replace("c-", "")
            fs = 26 if mode == "cc" else 16
            tw = dr.textlength(label, font=font(fs))
            dr.rounded_rectangle([x0 - 3, y0 - 1, x0 + tw + 5, y0 + fs + 5], radius=6, fill=(255, 255, 255, 235))
            dr.text((x0, y0), label, font=font(fs), fill=(27, 42, 73, 255))
        tag = "OK" if len(pieces) == expect else f"LỆCH (mong {expect})"
        ok &= len(pieces) == expect
        print(f"{code}: {len(pieces):3} sticker  {tag}   <- {fname}")
        sheet.convert("RGB").save(os.path.join(IDX, f"{code}.png"))
    with open(os.path.join(RAW, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    print(f"Tổng {len(manifest)} sticker -> {os.path.relpath(RAW, ROOT)}")
    sys.exit(0 if ok else 2)


if __name__ == "__main__":
    main()
