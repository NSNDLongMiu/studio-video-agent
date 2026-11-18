"""Mechanically export reviewed-layout RGBA animation atlases with FFmpeg.

No generation, background removal, color edits, rescaling or invented poses.
Pillow/numpy are used only to read alpha metrics and create QC contact sheets.
The source-config.json lives beside generated/, frames/ and manifest.json.
"""
import argparse
import hashlib
import json
import re
import shutil
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

WORKSPACE = Path(__file__).resolve().parents[2]
DEFAULT_CONFIG = WORKSPACE / "brand/cao/production-pack/source-config.json"
LOCAL_FFMPEG = Path("C:/Users/PC/AppData/Local/ffmpeg/ffmpeg-master-latest-win64-gpl/bin/ffmpeg.exe")
CANVAS = (512, 512)
GROUND_Y = 480
ALPHA_THRESHOLD = 32


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def relative_file(root, relative, must_exist=True):
    if not isinstance(relative, str) or Path(relative).is_absolute():
        raise ValueError("Paths must be relative to source-config.json")
    target = (root / relative).resolve(strict=must_exist)
    if not target.is_relative_to(root):
        raise ValueError(f"Path leaves production pack: {relative}")
    return target


def alpha_metrics(path):
    with Image.open(path) as im:
        im.load()
        if im.mode != "RGBA":
            raise ValueError(f"PNG must be RGBA: {path}")
        alpha = np.asarray(im.getchannel("A"))
        ys, xs = np.nonzero(alpha >= ALPHA_THRESHOLD)
        if not len(xs):
            raise ValueError(f"No visible alpha >= {ALPHA_THRESHOLD}: {path}")
        return {
            "size": list(im.size),
            "alpha_extrema": [int(alpha.min()), int(alpha.max())],
            "alpha_nonzero_bbox": list(im.getchannel("A").getbbox()),
            "alpha32_bbox": [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1],
            "transparent_pixels": int((alpha == 0).sum()),
            "soft_alpha_pixels_below32": int(((alpha > 0) & (alpha < ALPHA_THRESHOLD)).sum()),
            "visible_alpha32_pixels": int((alpha >= ALPHA_THRESHOLD).sum()),
        }, alpha


def atlas_plan(source, columns, rows, reverse=False):
    with Image.open(source) as image:
        image.load()
        if image.mode != "RGBA":
            raise ValueError(f"Atlas requires actual RGBA, not a painted checkerboard: {source}")
        width, height = image.size
        if width % columns or height % rows:
            raise ValueError(f"Atlas dimensions {width}x{height} are not divisible by grid {columns}x{rows}")
        cw, ch = width // columns, height // rows
        if cw > CANVAS[0]:
            raise ValueError("Cell wider than 512px; rescaling is deliberately unsupported")
        alpha = np.asarray(image.getchannel("A"))
        plans = []
        for index in range(columns * rows):
            x, y = (index % columns) * cw, (index // columns) * ch
            cell = alpha[y:y + ch, x:x + cw]
            ys, xs = np.nonzero(cell >= ALPHA_THRESHOLD)
            if not len(xs):
                raise ValueError(f"Atlas cell {index + 1} is empty at alpha >=32")
            bbox = [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]
            dx = (CANVAS[0] - cw) // 2
            dy = GROUND_Y - bbox[3]
            # Account explicitly for any soft background remnants clipped by translation.
            source_y, source_x = np.indices(cell.shape)
            clipped = ((source_x + dx < 0) | (source_x + dx >= CANVAS[0]) |
                       (source_y + dy < 0) | (source_y + dy >= CANVAS[1]))
            clipped_visible = int((clipped & (cell >= ALPHA_THRESHOLD)).sum())
            if clipped_visible:
                raise ValueError(f"Cell {index + 1}: {clipped_visible} visible pixels would clip; manual review needed")
            touches = bbox[0] == 0 or bbox[1] == 0 or bbox[2] == cw or bbox[3] == ch
            plans.append({
                "atlas_cell_index": index + 1,
                "source_rect": [x, y, cw, ch],
                "source_alpha32_bbox": bbox,
                "translation": [dx, dy],
                "clipped_alpha_nonzero_pixels": int((clipped & (cell > 0)).sum()),
                "clipped_alpha32_pixels": clipped_visible,
                "source_visible_touches_cell_boundary": touches,
                "native_subject_size": [bbox[2] - bbox[0], bbox[3] - bbox[1]],
            })
        if reverse:
            plans.reverse()
        return [width, height], [cw, ch], plans


def export_frame(ffmpeg, source, plan, destination):
    sx, sy, cw, ch = plan["source_rect"]
    dx, dy = plan["translation"]
    pad_y = max(0, dy)
    crop_y = max(0, -dy)
    pad_height = max(CANVAS[1] + crop_y, ch + pad_y)
    # pad/crop only: FFmpeg retains source scale and the shared horizontal axis.
    vf = (f"crop={cw}:{ch}:{sx}:{sy},format=rgba,"
          f"pad={CANVAS[0]}:{pad_height}:{dx}:{pad_y}:color=black@0,"
          f"crop={CANVAS[0]}:{CANVAS[1]}:0:{crop_y},format=rgba")
    pending = destination.with_name(destination.stem + ".pending.png")
    result = subprocess.run([
        str(ffmpeg), "-hide_banner", "-loglevel", "error", "-y", "-threads", "1",
        "-filter_threads", "1", "-i", str(source), "-vf", vf,
        "-frames:v", "1", "-pix_fmt", "rgba", str(pending),
    ], capture_output=True, text=True, encoding="utf-8")
    if result.returncode:
        pending.unlink(missing_ok=True)
        raise RuntimeError(f"FFmpeg frame extraction failed:\n{result.stderr}")
    pending.replace(destination)


def continuity(frames):
    masks, rgb = [], []
    for frame in frames:
        with Image.open(frame) as im:
            data = np.asarray(im)
            masks.append(data[:, :, 3] >= ALPHA_THRESHOLD)
            rgb.append(data[:, :, :3].astype(np.int16))
    def pair(a, b):
        intersection = masks[a] & masks[b]
        union = masks[a] | masks[b]
        return {
            "from": a + 1, "to": b + 1,
            "alpha32_iou": round(float(intersection.sum() / max(1, union.sum())), 6),
            "rgb_mae_visible_overlap": round(float(np.abs(rgb[a] - rgb[b])[intersection].mean()), 6) if intersection.any() else None,
        }
    return {
        "adjacent_pairs": [pair(i, i + 1) for i in range(len(frames) - 1)],
        "last_to_first": pair(len(frames) - 1, 0),
        "interpretation": "Screening metrics only. Articulated movement changes silhouette; these numbers do not approve continuity or loops.",
    }


def verify_retained_pixels(atlas, destination, plan):
    """Read-only numeric verification of lossless crop/pad pixels and transparent padding."""
    sx, sy, cw, ch = plan["source_rect"]
    dx, dy = plan["translation"]
    x0, x1 = max(0, -dx), min(cw, CANVAS[0] - dx)
    y0, y1 = max(0, -dy), min(ch, CANVAS[1] - dy)
    with Image.open(destination) as image:
        output = np.asarray(image)
    expected = atlas[sy + y0:sy + y1, sx + x0:sx + x1]
    actual = output[y0 + dy:y1 + dy, x0 + dx:x1 + dx]
    differences = int((actual != expected).any(axis=2).sum())
    if differences:
        raise RuntimeError(f"FFmpeg altered {differences} retained RGBA pixels: {destination}")
    outside = np.ones(output.shape[:2], dtype=bool)
    outside[y0 + dy:y1 + dy, x0 + dx:x1 + dx] = False
    if np.any(output[:, :, 3][outside]):
        raise RuntimeError(f"Padding is not fully transparent: {destination}")
    return {"retained_rgba_pixel_mismatches": differences, "padding_alpha_zero": True}


def font(size):
    for name in ("segoeui.ttf", "arial.ttf"):
        candidate = Path("C:/Windows/Fonts") / name
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default(size=size)


def qc_contacts(root, animation, files):
    result = []
    for background, color in (("light", "#eef1f6"), ("dark", "#14223a")):
        columns, width, height = 4, 276, 300
        rows = (len(files) + columns - 1) // columns
        sheet = Image.new("RGB", (columns * width, rows * height + 78), color)
        draw = ImageDraw.Draw(sheet)
        foreground = "#14223a" if background == "light" else "#eef1f6"
        draw.text((16, 8), f"{animation['id']} · {animation['label']} · {background}", font=font(24), fill=foreground)
        draw.text((16, 42), "QC VIEW ONLY · REVIEW REQUIRED · 512×512 normalized frames", font=font(17), fill=foreground)
        for i, path in enumerate(files):
            x, y = (i % columns) * width + 10, (i // columns) * height + 78
            # This resize/composite is QC visualization, never exported as production art.
            with Image.open(path) as image:
                thumb = image.convert("RGBA")
                thumb.thumbnail((256, 256), Image.Resampling.LANCZOS)
                sheet.paste(thumb, (x, y), thumb)
            draw.line((x, y + 240, x + 256, y + 240), fill="#d36525", width=1)
            draw.text((x, y + 261), f"{i + 1:04} · source cell {animation['frame_metrics'][i]['atlas_cell_index']}", font=font(16), fill=foreground)
        relative = f"qc/{animation['id']}-{background}.jpg"
        sheet.save(root / relative, quality=94)
        result.append(relative)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--only", help="Comma-separated animation IDs to rebuild; retain other manifest entries")
    parser.add_argument("--ffmpeg", type=Path)
    args = parser.parse_args()
    config = args.config.resolve(strict=True)
    root = config.parent.resolve(strict=True)
    entries = json.loads(config.read_text(encoding="utf-8-sig"))
    if isinstance(entries, dict):
        entries = entries.get("animations")
    if not isinstance(entries, list) or not entries:
        parser.error("Config must contain a nonempty animations[] list")
    ids = [entry.get("id") for entry in entries]
    if any(not isinstance(sid, str) or not re.fullmatch(r"[a-z][a-z0-9_]{0,63}", sid) for sid in ids) or len(ids) != len(set(ids)):
        parser.error("Animation IDs must be unique lowercase alphanumeric/underscore identifiers")
    selected = set(args.only.split(",")) if args.only else set(ids)
    if not selected.issubset(ids):
        parser.error(f"Unknown config IDs: {sorted(selected - set(ids))}")
    ffmpeg = args.ffmpeg or (LOCAL_FFMPEG if LOCAL_FFMPEG.exists() else shutil.which("ffmpeg"))
    if not ffmpeg:
        parser.error("FFmpeg not found; specify --ffmpeg")
    manifest_file = root / "manifest.json"
    prior = json.loads(manifest_file.read_text(encoding="utf-8")) if manifest_file.exists() else {}
    previous = {a["id"]: a for a in prior.get("animations", [])}
    animations = {key: value for key, value in previous.items() if args.only or key in ids}
    results = []
    # Preflight all selected sources before changing frame files.
    for entry in entries:
        if entry["id"] not in selected:
            continue
        source = relative_file(root, entry["source"])
        cols, rows = entry.get("cols", 4), entry.get("rows", 2)
        if not isinstance(cols, int) or not isinstance(rows, int) or not 1 <= cols <= 16 or not 1 <= rows <= 16:
            parser.error("cols and rows must be integers 1…16")
        fps = entry.get("fps", 8)
        if not isinstance(fps, (int, float)) or isinstance(fps, bool) or not 0 < fps <= 60:
            parser.error("fps must be numeric in 0…60")
        if not isinstance(entry.get("loop"), bool) or not isinstance(entry.get("reverse", False), bool):
            parser.error("loop and reverse must be booleans")
        atlas_size, cell_size, plans = atlas_plan(source, cols, rows, entry.get("reverse", False))
        results.append((entry, source, digest(source), atlas_size, cell_size, plans))
    (root / "qc").mkdir(exist_ok=True)
    for entry, source, source_hash, atlas_size, cell_size, plans in results:
        sid = entry["id"]
        directory = relative_file(root, f"frames/{sid}", must_exist=False)
        directory.mkdir(parents=True, exist_ok=True)
        with Image.open(source) as image:
            atlas = np.asarray(image)
        files, metrics = [], []
        for i, plan in enumerate(plans, 1):
            destination = directory / f"{i:04}.png"
            export_frame(ffmpeg, source, plan, destination)
            actual, _ = alpha_metrics(destination)
            if actual["size"] != list(CANVAS) or actual["alpha32_bbox"][3] != GROUND_Y:
                raise RuntimeError(f"Export geometry mismatch: {destination}")
            metrics.append({"frame": i, **plan, "export": actual,
                            "pixel_verification": verify_retained_pixels(atlas, destination, plan)})
            files.append(destination)
        if digest(source) != source_hash:
            raise RuntimeError(f"Source atlas changed during export: {source}")
        hashes = [digest(file) for file in files]
        animation = {
            "id": sid, "label": entry.get("label", sid),
            "frames": [file.relative_to(root).as_posix() for file in files],
            "frame_sha256": hashes, "fps": entry.get("fps", 8), "loop": entry["loop"],
            "canvas": list(CANVAS), "anchor": [CANVAS[0] // 2, GROUND_Y],
            "quality_status": "REVIEW_REQUIRED",
            "source": entry["source"], "source_sha256": source_hash,
            "source_reverse": entry.get("reverse", False),
            "generation": "imagegen built-in; exact FFmpeg crop/pad export; no intermediate frames invented",
            "native_resolution": {
                "atlas": atlas_size, "cell": cell_size, "rescaled": False,
                "subject_height_range": [min(m["native_subject_size"][1] for m in metrics), max(m["native_subject_size"][1] for m in metrics)],
                "subject_width_range": [min(m["native_subject_size"][0] for m in metrics), max(m["native_subject_size"][0] for m in metrics)],
            },
            "frame_metrics": metrics,
            "qc": {
                "main_subject_alpha_threshold": ALPHA_THRESHOLD,
                "clipped_alpha32_pixels": sum(m["clipped_alpha32_pixels"] for m in metrics),
                "clipped_soft_alpha_pixels": sum(m["clipped_alpha_nonzero_pixels"] for m in metrics),
                "visible_source_boundary_frames": [m["frame"] for m in metrics if m["source_visible_touches_cell_boundary"]],
                "continuity": continuity(files),
                "automatic_approval": False,
                "exact_retained_rgba_pixels_verified": True,
                "required_review": ["Identity and limb anatomy", "Complete silhouette and alpha on light/dark backgrounds", "Frame order and articulation", "Loop seam or one-shot start/end", "Actual exported clip at intended display scale"],
            },
        }
        for key in ("notes", "limitations", "tags", "prompt"):
            if key in entry:
                animation[key] = entry[key]
        old = previous.get(sid, {})
        if (old.get("frame_sha256") == hashes and old.get("source_sha256") == source_hash and
                old.get("fps") == animation["fps"] and old.get("loop") == animation["loop"]):
            if old.get("quality_status") in ("PASS", "FAILED"):
                animation["quality_status"] = old["quality_status"]
            for key in ("review", "reviewed_by", "review_notes"):
                if key in old:
                    animation[key] = old[key]
        animation["qc"]["contact_sheets"] = qc_contacts(root, animation, files)
        animations[sid] = animation
    ordered = [animations[entry["id"]] for entry in entries if entry["id"] in animations]
    ordered += [a for sid, a in animations.items() if sid not in ids]
    manifest = {**prior,
        "schema_version": 1, "pack_id": "cao_production_pack", "name": "Cáo văn phòng — production animation pack",
        "path_base": "manifest_directory", "built_by": "tools/fox/build-production.py",
        "source_config": config.name,
        "normalization": {"canvas": list(CANVAS), "anchor": [256, 480], "alpha_ground_threshold": ALPHA_THRESHOLD, "rescaling": False, "horizontal_alignment": "cell_center_fixed", "soft_alpha_clipping": "Counted and reported, never clipped alpha>=32"},
        "animations": ordered,
        "summary": {"animations": len(ordered), "frames": sum(len(a["frames"]) for a in ordered),
                    "unique_frame_sha256": len({h for a in ordered for h in a["frame_sha256"]}),
                    "reversed_sequence_frame_files": sum(len(a["frames"]) for a in ordered if a.get("source_reverse")),
                    "pass": sum(a["quality_status"] == "PASS" for a in ordered), "failed": sum(a["quality_status"] == "FAILED" for a in ordered), "review_required": sum(a["quality_status"] == "REVIEW_REQUIRED" for a in ordered)},
    }
    pending_manifest = root / "manifest.pending.json"
    pending_manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    pending_manifest.replace(manifest_file)
    (root / "qc/build-report.json").write_text(json.dumps({"summary": manifest["summary"], "source_atlases_unchanged": True, "rebuilt": sorted(selected), "ffmpeg": str(ffmpeg), "screening_only": True, "animations": [{"id": a["id"], "quality_status": a["quality_status"], "native_resolution": a["native_resolution"], "qc": a["qc"]} for a in ordered]}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"manifest": str(manifest_file), **manifest["summary"], "rebuilt": sorted(selected)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
