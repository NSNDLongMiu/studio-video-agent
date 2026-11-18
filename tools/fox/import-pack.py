"""Archive and index a director-supplied PNG pack without altering its artwork.

Usage: python -X utf8 tools/fox/import-pack.py <source-directory>
Creates brand/cao/animation-pack, never replaces the existing production poses.
"""
import argparse
import csv
import hashlib
import json
import shutil
from collections import Counter
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
DEST = ROOT / "brand" / "cao" / "animation-pack"
GROUPS = {
    "01": ("Xoay ghế, ngồi quay lưng, đứng dậy", ["ghe", "ngoi", "quay-lung", "dung-day"],
           "Còn nền tối và đường chia ô; các ô không bảo đảm cùng tỷ lệ/vị trí."),
    "02": ("Xoay người, ngồi xuống, xoay ghế", ["xoay-nguoi", "ngoi-xuong", "ghe"],
           "Ô 96×128 px; có ô chứa các phần của hai hình khác nhau, chân/hình hàng bên cạnh."),
    "03": ("Dẫn chuyện, đi bộ, biểu cảm, làm việc", ["dan-chuyen", "di-bo", "bieu-cam", "lam-viec"],
           "Ô chỉ khoảng 76×114 px; nhiều ô cắt qua nhân vật. frame_039.png rỗng."),
    "04": ("Chỉ trỏ, giới thiệu", ["chi-tro", "gioi-thieu", "vay-chao"],
           "Lưới cắt không khớp sheet có cột nhãn; frame_001 chỉ có nhãn chữ, không có Cáo."),
    "05": ("Biểu cảm, tư thế", ["bieu-cam", "tu-the"],
           "Các ô chạm biên; có tay/đầu bị cắt và phần hình của hàng bên cạnh."),
    "06": ("Cử chỉ làm việc", ["cu-chi", "lam-viec"],
           "Có ô chứa các nhân vật bị chia đôi. Sprite sheet nguồn bị hỏng/truncated."),
    "07": ("Khẩu hình, biểu cảm", ["khau-hinh", "bieu-cam", "khuon-mat"],
           "Các ô 128×256 px cắt qua mặt/thân; không phải bộ viseme có thể ghép miệng trực tiếp."),
}
WARNING = ("Bộ ảnh tham khảo cần kiểm tra/cắt lại, chưa duyệt cho sản xuất. "
           "Thứ tự frame là thứ tự file nguồn, không phải timeline chuyển động. "
           "Không suy luận FPS, vòng lặp hay nhép miệng từ tên thư mục.")


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def font(size):
    for name in ("segoeui.ttf", "arial.ttf"):
        path = Path("C:/Windows/Fonts") / name
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default(size=size)


def image_info(path):
    # verify catches malformed PNG streams; load catches truncated pixel data.
    with Image.open(path) as im:
        im.verify()
    with Image.open(path) as im:
        im.load()
        mode = im.mode
        rgba = im.convert("RGBA")
        alpha = rgba.getchannel("A")
        hist = alpha.histogram()
        bbox = alpha.getbbox()
        return {
            "width": im.width, "height": im.height, "mode": mode,
            "has_alpha": "A" in im.getbands() or "transparency" in im.info,
            "alpha_bbox": list(bbox) if bbox else None,
            "alpha_extrema": list(alpha.getextrema()),
            "transparent_fraction": round(hist[0] / (im.width * im.height), 6),
        }


def thumb(source, target):
    with Image.open(source) as im:
        image = im.convert("RGBA")
        image.thumbnail((192, 192))
        image.save(target)


def contact_sheets(group, entries, out):
    result = []
    # Native cells on a checkerboard; do not hide clipped boundaries by cropping.
    for page, start in enumerate(range(0, len(entries), 48), 1):
        chunk = entries[start:start + 48]
        cols, cell_w, cell_h = 6, 210, 236
        rows = (len(chunk) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * cell_w, rows * cell_h + 86), "#182236")
        draw = ImageDraw.Draw(sheet)
        draw.text((16, 10), f"{group['id']} · {group['label']} · {page}", font=font(23), fill="white")
        draw.text((16, 45), "THAM KHẢO / CHƯA DUYỆT SẢN XUẤT · giữ nguyên ô nguồn", font=font(17), fill="#ffcc80")
        for i, entry in enumerate(chunk):
            x, y = (i % cols) * cell_w + 8, (i // cols) * cell_h + 86
            for yy in range(0, 192, 16):
                for xx in range(0, 192, 16):
                    color = "#d5d9df" if ((xx + yy) // 16) % 2 else "#f4f5f6"
                    draw.rectangle((x + xx, y + yy, x + xx + 15, y + yy + 15), fill=color)
            if entry.get("preview"):
                with Image.open(out / entry["preview"]) as im:
                    sheet.paste(im, (x + (192 - im.width) // 2, y + (192 - im.height) // 2), im)
            else:
                draw.text((x + 12, y + 75), "FILE LỖI", font=font(23), fill="#ad1725")
            draw.text((x, y + 197), entry["id"], font=font(16), fill="white")
            size = f"{entry.get('width', 0)}×{entry.get('height', 0)} px" if entry.get("width") else "0 byte / lỗi đọc"
            draw.text((x, y + 217), size, font=font(14), fill="#b5c7de")
        name = f"catalog/{group['id']}-{page:02}.jpg"
        sheet.save(out / name, quality=90)
        result.append(name)
    return result


def write_catalog(manifest, out):
    data = json.dumps(manifest, ensure_ascii=False).replace("<", "\\u003c")
    document = '''<!doctype html><html lang="vi"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Thư viện Cáo Mít · 458 ô ảnh</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#101828;color:#edf2fa;font:16px 'Segoe UI',sans-serif}
header{padding:30px max(24px,5vw);background:#18253c;border-bottom:1px solid #3d4c63}
h1{margin:0 0 12px;font-size:30px}p{max-width:1100px;line-height:1.6;margin:10px 0}
.warn{color:#ffcb87}.muted{color:#b4c3d9}a{color:#9dcdff}main{padding:24px 5vw}
.controls{display:flex;flex-wrap:wrap;gap:12px;margin:18px 0}input,select,button{font:inherit;border:1px solid #667891;border-radius:6px;padding:10px;background:#20314b;color:white}
input{flex:1;min-width:230px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(205px,1fr));gap:14px}
article{background:#1c2940;border:1px solid #40516d;border-radius:8px;overflow:hidden;cursor:pointer}
.pic{height:210px;display:grid;place-items:center;background-color:#eef1f4;background-image:linear-gradient(45deg,#cdd2d8 25%,transparent 25%),linear-gradient(-45deg,#cdd2d8 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#cdd2d8 75%),linear-gradient(-45deg,transparent 75%,#cdd2d8 75%);background-size:24px 24px;background-position:0 0,0 12px,12px -12px,-12px 0}
.pic img{max-width:192px;max-height:192px}article section{padding:12px;font-size:14px}article b{display:block}article small{display:block;color:#ffcb87;margin-top:7px}
dialog{background:#18253c;color:white;border:1px solid #7486a0;max-width:min(840px,95vw);max-height:92vh;border-radius:12px}dialog::backdrop{background:#000a}
#detailImage{width:100%;height:340px;display:flex;justify-content:center;align-items:center;background:#eee}#detailImage img{max-width:100%;max-height:100%;object-fit:contain}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#101828;padding:12px}#close{float:right}label{display:flex;align-items:center;gap:8px}code{color:#c6dfff}
</style>
<header><h1>Cáo Mít · thư viện tra cứu nguyên liệu</h1>
<p id="stats"></p><p class="warn">Chưa duyệt cho sản xuất: ô cắt lệch, nền thừa, độ phân giải nhỏ; cần kiểm tra từng ảnh. Đây chưa phải bộ hoạt hình liền mạch. Nhóm đặt theo thư mục nguồn, không xác nhận hành động của từng ô.</p>
<p><a href="README.md">Hướng dẫn sử dụng</a> · <a href="manifest.json">Manifest JSON</a> · <a href="inventory.csv">Danh sách CSV</a> · <a href="qc-report.json">Kết quả kiểm tra file</a></p></header>
<main><div class="controls"><input id="q" aria-label="Tìm ảnh" placeholder="Tìm theo mã, nhóm, hành động…"><select id="group" aria-label="Nhóm"><option value="">Tất cả 7 nhóm</option></select><select id="state" aria-label="Trạng thái"><option value="">Mọi trạng thái</option><option value="REVIEW_REQUIRED">Ảnh đọc được, cần kiểm tra</option><option value="BROKEN">File lỗi</option></select></div><p id="count" class="muted"></p><div id="grid" class="grid"></div></main>
<dialog id="detail"><button id="close">Đóng</button><h2 id="title"></h2><div id="detailImage"></div><p><label>Nền xem thử <select id="bg"><option value="#eeeeee">Sáng</option><option value="#182236">Tối</option><option value="#f47932">Cam</option></select></label></p><p id="info"></p><p id="warning" class="warn"></p><p><a id="original" target="_blank" rel="noopener">Mở ảnh gốc trong thư viện</a></p><p id="alternative"></p><pre id="command"></pre><p class="muted">Lệnh tạo lớp ảnh tĩnh, không tự nối frame/nhép miệng. --ack-review chỉ xác nhận người dùng đã xem giới hạn của ảnh; không duyệt storyboard.</p></dialog>
<script>const data=__DATA__;
const $=id=>document.getElementById(id);const entries=[...data.frames,...data.rejected_assets.filter(e=>e.kind==='frame')].sort((a,b)=>a.id.localeCompare(b.id));
$('stats').textContent=`${data.summary.frame_files} ô frame · ${data.summary.readable_frames} ảnh đọc được · ${data.summary.broken_frames} frame lỗi · 7 sprite sheet nguồn (${data.summary.broken_source_sheets} sheet lỗi). Không có bộ chuyển động nào được xác minh.`;
data.groups.forEach(g=>{const o=document.createElement('option');o.value=g.id;o.textContent=`${g.id} · ${g.label} (${g.frame_count})`;$('group').append(o)});
function show(e){$('title').textContent=e.id;$('detailImage').replaceChildren();if(e.status!=='BROKEN'){const im=new Image();im.src=e.path;im.alt=e.id;$('detailImage').append(im)}else $('detailImage').textContent=e.error;
$('info').textContent=`${e.group_label} · ${e.width||0}×${e.height||0} px · ${e.status}`;$('warning').textContent=[e.group_warning,...(e.quality_flags||[])].join(' · ');$('original').href=e.path;$('alternative').replaceChildren();if(e.production_alternative){const a=document.createElement('a');a.href=e.production_alternative.path;a.target='_blank';a.rel='noopener';a.textContent=`Dùng pose đã tách sẵn: ${e.production_alternative.pose_id} (cùng artwork nguồn, không phải frame bổ sung)`;$('alternative').append(a)}$('command').textContent=e.status==='BROKEN'?'File lỗi, không thể dựng.':e.production_alternative?`# Pose tương ứng đã có trong pipeline hiện tại:\nnode tools/fox/narrate.mjs --srt <captions.srt> --pose ${e.production_alternative.pose_id} --out <thu_muc_video>/assets/cao.mov\n\n# Chỉ xuất ô nguyên trạng để kiểm tra:\nnode tools/fox/pack-still.mjs --id ${e.id} --ack-review --duration 3 --out <thu_muc_video>/assets/${e.id}.mov`:`node tools/fox/pack-still.mjs --id ${e.id} --ack-review --duration 3 --out <thu_muc_video>/assets/${e.id}.mov`;$('detail').showModal()}
function draw(){const q=$('q').value.toLocaleLowerCase('vi');const list=entries.filter(e=>(!$('group').value||e.group_id===$('group').value)&&(!$('state').value||e.status===$('state').value)&&[e.id,e.group_label,...(e.tags||[])].join(' ').toLocaleLowerCase('vi').includes(q));$('count').textContent=`Đang hiện ${list.length} / ${entries.length} ô. Bấm ảnh để xem nguyên bản và mã sử dụng.`;$('grid').replaceChildren();list.forEach(e=>{const card=document.createElement('article');card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label',e.id);const pic=document.createElement('div');pic.className='pic';if(e.preview){const im=new Image();im.src=e.preview;im.alt=e.id;im.loading='lazy';pic.append(im)}else pic.textContent='FILE LỖI';const section=document.createElement('section');const title=document.createElement('b');title.textContent=e.id;const size=document.createElement('div');size.textContent=`${e.width||0}×${e.height||0} px · nhóm ${e.group_id}`;const status=document.createElement('small');status.textContent=e.status==='BROKEN'?'FILE LỖI':'CẦN KIỂM TRA ẢNH';section.append(title,size,status);card.append(pic,section);card.onclick=()=>show(e);card.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();show(e)}};$('grid').append(card)})}
['q','group','state'].forEach(id=>$(id).addEventListener('input',draw));$('close').onclick=()=>$('detail').close();$('bg').onchange=()=>$('detailImage').style.background=$('bg').value;draw();</script></html>'''
    (out / "index.html").write_text(document.replace("__DATA__", data), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    args = parser.parse_args()
    source = args.source.resolve(strict=True)
    if not source.is_dir() or source == DEST or DEST in source.parents or source in DEST.parents:
        parser.error("Nguồn phải là thư mục độc lập với thư viện đích")
    source_files = sorted(p for p in source.rglob("*") if p.is_file())
    if not source_files:
        parser.error("Thư mục nguồn không có file")
    folders = sorted(p for p in source.iterdir() if p.is_dir())
    if {p.name[:2] for p in folders} != set(GROUPS) or len(folders) != len(GROUPS):
        parser.error("Importer dành cho bộ Cáo Mít gồm đúng 7 nhóm 01…07; chưa ghi dữ liệu")
    # Preflight every destination: reruns are safe and never overwrite differing originals.
    for src in source_files:
        target = DEST / "originals" / src.relative_to(source)
        if target.exists() and sha256(src) != sha256(target):
            parser.error(f"Bản gốc đích khác nguồn, giữ nguyên cả hai: {target}")
    for name in ("originals", "previews", "catalog"):
        (DEST / name).mkdir(parents=True, exist_ok=True)
    manifest = {
        "schema_version": 1, "pack_id": "cao_mit_png_pack", "name": "Cáo Mít — PNG từ giám đốc",
        "source_directory": str(source), "import_tool": "tools/fox/import-pack.py",
        "source": "director_supplied", "approval_status": "REVIEW_REQUIRED", "warning": WARNING,
        "animation": {"verified_sequences": 0, "fps": None, "loopable": None, "lip_sync_supported": False},
        "path_base": "manifest_directory", "groups": [], "frames": [], "source_sheets": [],
        "rejected_assets": [], "original_files": [],
    }
    for src in source_files:
        relative = src.relative_to(source)
        target = DEST / "originals" / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        if not target.exists():
            shutil.copy2(src, target)
        digest = sha256(src)
        if digest != sha256(target):
            raise RuntimeError(f"Copy checksum mismatch: {relative}")
        manifest["original_files"].append({"source_path": relative.as_posix(), "path": target.relative_to(DEST).as_posix(), "bytes": target.stat().st_size, "sha256": digest})
    for folder in folders:
        gid = folder.name[:2]
        if gid not in GROUPS:
            raise ValueError(f"Nhóm chưa được phân loại: {folder.name}")
        label, tags, warning = GROUPS[gid]
        entries = []
        group = {"id": gid, "directory": folder.name, "label": label, "tags": tags, "warning": warning}
        for src in sorted(folder.glob("*.png")):
            is_frame = src.stem.startswith("frame_")
            number = src.stem.removeprefix("frame_") if is_frame else "sheet"
            entry = {"id": f"cao_mit_{gid}_{number}", "kind": "frame" if is_frame else "source_sheet",
                     "group_id": gid, "group_label": label, "group_warning": warning, "tags": tags,
                     "path": (Path("originals") / folder.name / src.name).as_posix(),
                     "source_path": src.relative_to(source).as_posix(), "bytes": src.stat().st_size,
                     "sha256": sha256(src), "quality_flags": [], "status": "REVIEW_REQUIRED"}
            try:
                entry.update(image_info(DEST / entry["path"]))
                if is_frame:
                    entry["quality_flags"].extend(["crop_alignment_unverified", "background_residue_possible", "continuity_unverified"])
                    if entry["height"] < 1000:
                        entry["quality_flags"].append("below_1000px_reference_height")
                    bbox = entry["alpha_bbox"]
                    if not bbox:
                        entry["quality_flags"].append("empty_alpha")
                    elif bbox[0] == 0 or bbox[1] == 0 or bbox[2] == entry["width"] or bbox[3] == entry["height"]:
                        entry["quality_flags"].append("foreground_touches_cell_boundary")
                    if gid == "04" and number == "001":
                        entry["quality_flags"].append("label_only_not_character_confirmed")
                    elif gid == "04" and (int(number) - 1) % 6 == 0:
                        entry["quality_flags"].append("source_label_column_not_character")
                    entry["preview"] = f"previews/{entry['id']}.png"
                    thumb(DEST / entry["path"], DEST / entry["preview"])
                    manifest["frames"].append(entry)
                else:
                    entry["quality_flags"].append("reference_sheet_not_overlay")
                    manifest["source_sheets"].append(entry)
            except (OSError, ValueError, SyntaxError) as exc:
                entry.update(status="BROKEN", error=f"{type(exc).__name__}: {exc}")
                entry["quality_flags"].append("decode_failed")
                manifest["rejected_assets"].append(entry)
            if is_frame:
                entries.append(entry)
        group.update(frame_count=len(entries), readable_frames=sum(e["status"] != "BROKEN" for e in entries),
                     broken_frames=sum(e["status"] == "BROKEN" for e in entries))
        group["contact_sheets"] = contact_sheets(group, entries, DEST)
        manifest["groups"].append(group)
    # Establish artwork lineage with pixel fingerprints, not filenames or appearance.
    source_art = {}
    for existing in sorted((ROOT / "assets" / "mascot").glob("*.png")):
        with Image.open(existing) as im:
            rgb = im.convert("RGB")
            key = (rgb.size, hashlib.sha256(rgb.tobytes()).hexdigest())
            source_art[key] = existing
    manifest["existing_artwork_matches"] = []
    for sheet in manifest["source_sheets"]:
        with Image.open(DEST / sheet["path"]) as im:
            rgb = im.convert("RGB")
            key = (rgb.size, hashlib.sha256(rgb.tobytes()).hexdigest())
        if key in source_art:
            manifest["existing_artwork_matches"].append({
                "group_id": sheet["group_id"], "pack_sheet": sheet["path"],
                "existing_source": source_art[key].relative_to(ROOT).as_posix(),
                "rgb_sha256": key[1], "rgb_pixels_identical": True,
                "alpha_identity_claimed": False,
            })
    aliases = []
    if any(m["group_id"] == "05" and Path(m["existing_source"]).name == "Bộ sticker cáo MC công sở biểu cảm-4.png" for m in manifest["existing_artwork_matches"]):
        production = json.loads((ROOT / "brand" / "cao" / "manifest.json").read_text(encoding="utf-8"))
        by_source = {value["from"]: pose for pose, value in production["poses"].items()}
        for entry in manifest["frames"]:
            if entry["group_id"] != "05":
                continue
            ref = "d" + entry["id"].rsplit("_", 1)[1][-2:]
            pose = by_source.get(ref)
            if pose and (ROOT / "brand" / "cao" / "poses" / f"{pose}.png").exists():
                entry["production_alternative"] = {
                    "pose_id": pose, "path": f"../poses/{pose}.png", "source_ref": ref,
                    "basis": "same_source_sheet_rgb_and_existing_extraction_index",
                    "note": "Existing separated pose from same artwork, not a new animation frame.",
                }
                entry["tags"] = [*entry["tags"], pose]
                entry["semantic_hint"] = pose
                aliases.append({"asset_id": entry["id"], **entry["production_alternative"]})
    (DEST / "production-alternatives.json").write_text(json.dumps({"note": "Existing production poses corresponding to source artwork; aliases do not approve draft cells.", "alternatives": aliases}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    hashes = Counter(e["sha256"] for e in manifest["frames"])
    manifest["summary"] = {
        "original_files": len(source_files), "copied_bytes": sum(e["bytes"] for e in manifest["original_files"]),
        "frame_files": sum(g["frame_count"] for g in manifest["groups"]), "readable_frames": len(manifest["frames"]),
        "broken_frames": sum(e["kind"] == "frame" for e in manifest["rejected_assets"]),
        "source_sheets": len(manifest["source_sheets"]) + sum(e["kind"] == "source_sheet" for e in manifest["rejected_assets"]),
        "broken_source_sheets": sum(e["kind"] == "source_sheet" for e in manifest["rejected_assets"]),
        "byte_identical_frame_duplicates": sum(n - 1 for n in hashes.values() if n > 1),
        "approved_frames": 0, "verified_animation_sequences": 0,
        "existing_artwork_sheet_matches": len(manifest["existing_artwork_matches"]),
        "existing_pose_alternatives": len(aliases),
    }
    (DEST / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    qc = {"status": "HOLD_FOR_VISUAL_REVIEW", "summary": manifest["summary"],
          "byte_preservation_pass": True, "decode_pass": not manifest["rejected_assets"],
          "production_ready": False, "rejected_assets": manifest["rejected_assets"],
          "groups": manifest["groups"], "warning": WARNING}
    (DEST / "qc-report.json").write_text(json.dumps(qc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with (DEST / "inventory.csv").open("w", newline="", encoding="utf-8-sig") as file:
        writer = csv.writer(file)
        writer.writerow(["id", "group", "kind", "status", "width", "height", "path", "quality_flags", "sha256", "error", "existing_production_pose"])
        for entry in sorted(manifest["frames"] + manifest["source_sheets"] + manifest["rejected_assets"], key=lambda e: e["id"]):
            writer.writerow([entry["id"], entry["group_label"], entry["kind"], entry["status"], entry.get("width", ""), entry.get("height", ""), entry["path"], ";".join(entry["quality_flags"]), entry["sha256"], entry.get("error", ""), entry.get("production_alternative", {}).get("pose_id", "")])
    write_catalog(manifest, DEST)
    print(json.dumps({"out": str(DEST), **manifest["summary"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
