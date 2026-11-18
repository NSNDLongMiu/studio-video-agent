"""Build a self-contained offline catalog for the reviewed production fox pack.

Run from the repository root:
    python -X utf8 tools/fox/catalog-production.py

Only reads the manifest/assets and writes brand/cao/production-pack/index.html.
"""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PACK = ROOT / "brand" / "cao" / "production-pack"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pack", type=Path, default=PACK)
    args = parser.parse_args()
    pack = args.pack.resolve(strict=True)
    manifest = json.loads((pack / "manifest.json").read_text(encoding="utf-8-sig"))
    entries = []
    for animation in manifest["animations"]:
        aid = animation["id"]
        clip = f"clips/{aid}.mov"
        first = animation["frames"][0]
        if not (pack / first).is_file():
            raise FileNotFoundError(first)
        prompt_id = "stand_up" if animation.get("source_reverse") else aid
        entries.append({
            "id": aid,
            "label": animation.get("label", aid),
            "frames": len(animation["frames"]),
            "fps": animation["fps"],
            "duration": round(len(animation["frames"]) / animation["fps"], 3),
            "loop": animation["loop"],
            "status": animation.get("quality_status", "REVIEW_REQUIRED"),
            "ready": animation.get("quality_status") == "PASS" and (pack / clip).is_file(),
            "native_height": animation.get("native_resolution", {}).get("subject_height_range", []),
            "canvas": animation["canvas"],
            "notes": animation.get("notes", ""),
            "reversed": animation.get("source_reverse", False),
            "poster": first,
            "clip": clip,
            "preview": f"previews/{aid}.mp4",
            "light_preview": f"previews/{aid}-light.mp4",
            "preview_exists": (pack / f"previews/{aid}.mp4").is_file(),
            "frame_dir": f"frames/{aid}/",
            "contact": f"qc/{aid}-review.png",
            "prompt": f"generated/{prompt_id}-prompt.json",
            "tags": animation.get("tags", []),
        })
    payload = {
        "name": manifest.get("name", "Cáo văn phòng"),
        "total_files": sum(item["frames"] for item in entries),
        "unique_frames": len({value for item in manifest["animations"] for value in item.get("frame_sha256", [])}),
        "animations": entries,
        "showcase": "showcase.mp4" if (pack / "showcase.mp4").is_file() else None,
    }
    data = json.dumps(payload, ensure_ascii=False).replace("<", "\\u003c")
    document = r'''<!doctype html>
<html lang="vi">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cáo văn phòng · Tài nguyên sản xuất</title>
<style>
:root{color-scheme:dark;--bg:#0f1724;--card:#182437;--line:#34445b;--text:#f1f5fa;--muted:#a9bbd3;--accent:#ffb45d;--green:#9ad6b5}
*{box-sizing:border-box}body{margin:0;color:var(--text);background:var(--bg);font:16px/1.55 'Segoe UI',Arial,sans-serif}
a{color:#b9d9ff;text-underline-offset:3px}button,input,select{font:inherit}button,a.button{cursor:pointer;border-radius:7px;padding:10px 15px;border:1px solid #586981;background:#27374e;color:var(--text);text-decoration:none;display:inline-flex;justify-content:center;align-items:center;gap:6px}
button:hover,a.button:hover{background:#344862}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
button.primary,a.primary{background:var(--accent);border-color:var(--accent);color:#2c1b0c;font-weight:700}button.primary:hover,a.primary:hover{background:#ffd19c}
.wrap{width:min(1440px,92vw);margin:auto}.eyebrow{font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:var(--accent);font-weight:700}
header{padding:40px 0 30px;background:linear-gradient(120deg,#203046,#142033);border-bottom:1px solid var(--line)}h1{font-size:clamp(29px,4vw,46px);line-height:1.12;letter-spacing:-1px;margin:8px 0 16px}header p{max-width:910px;margin:10px 0;color:#c7d4e5}.top-links{display:flex;flex-wrap:wrap;gap:18px;margin:22px 0 0;font-size:14px}
.stats{display:flex;flex-wrap:wrap;gap:9px;margin:24px 0 0}.stat{border:1px solid #506077;background:#15223888;padding:8px 13px;border-radius:6px;font-size:14px}.stat strong{color:white}.stat.good{border-color:#498568;color:#bbebcd}
main{padding:28px 0 48px}.controls{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px}.controls input,.controls select{color:var(--text);border:1px solid #53657e;background:#17263b;border-radius:7px;padding:11px 13px}.controls input{flex:1;min-width:220px}.controls select{min-width:180px}#result{color:var(--muted);font-size:14px;margin:0 0 20px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}.card{border:1px solid var(--line);border-radius:12px;overflow:hidden;background:var(--card);display:flex;flex-direction:column}
.stage{height:245px;background-color:#26364c;background-image:linear-gradient(45deg,#2e4058 25%,transparent 25%),linear-gradient(-45deg,#2e4058 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#2e4058 75%),linear-gradient(-45deg,transparent 75%,#2e4058 75%);background-size:32px 32px;background-position:0 0,0 16px,16px -16px,-16px 0;display:grid;place-items:center;position:relative}
.stage img{height:235px;width:235px;object-fit:contain}.stage button{position:absolute;right:10px;bottom:10px;font-size:13px;background:#0e192bdd;padding:7px 10px}.body{padding:18px;display:flex;flex-direction:column;flex:1}.body h2{font-size:21px;line-height:1.3;margin:0 0 5px}.code-id{font:13px Consolas,monospace;color:var(--accent)}.facts{font-size:13px;color:var(--muted);margin:12px 0 0}.note{font-size:14px;margin:10px 0 14px;color:#d1dcea}.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}.actions .button,.actions button{font-size:13px;padding:8px 11px}.badge{font-size:12px;letter-spacing:.2px;padding:3px 7px;display:inline-block;border-radius:4px;margin:9px 0 0;background:#264a3a;color:#b8edcf}.badge.wait{background:#57442b;color:#ffdc9e}.small-links{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;margin-top:13px}
.info{border-top:1px solid var(--line);padding-top:22px;margin-top:30px;color:var(--muted);font-size:14px;max-width:1000px}.info p{margin:8px 0}.empty{grid-column:1/-1;padding:45px;text-align:center;color:var(--muted);border:1px dashed var(--line);border-radius:10px}
dialog{background:#172338;color:var(--text);border:1px solid #667b98;border-radius:14px;width:min(1000px,96vw);max-height:94vh;padding:22px}dialog::backdrop{background:#050a13ce}.dialog-top{display:flex;justify-content:space-between;align-items:flex-start;gap:14px}.dialog-top h2{margin:0 0 4px;font-size:25px}.dialog-grid{display:grid;grid-template-columns:minmax(240px,390px) 1fr;gap:24px;margin-top:20px}.player{background:#101c30;border:1px solid var(--line);border-radius:8px;overflow:hidden;aspect-ratio:1/1}.player video{height:100%;width:100%;object-fit:cover;object-position:center 78%;display:block}.dialog-content p{margin:0 0 12px}.toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:14px;margin:12px 0}.toolbar select{background:#24354e;color:white;border:1px solid #617491;border-radius:5px;padding:7px}.command{background:#0a1423;border:1px solid #364860;border-radius:7px;padding:13px;font:13px/1.6 Consolas,monospace;white-space:pre-wrap;overflow-wrap:anywhere}.status-line{font-size:13px;color:var(--green)}.copy-result{font-size:13px;color:var(--green);margin-left:8px}.close{padding:7px 12px}footer{padding:20px 0;border-top:1px solid var(--line);font-size:13px;color:var(--muted)}
@media(max-width:680px){header{padding-top:28px}.wrap{width:92vw}.grid{grid-template-columns:repeat(auto-fill,minmax(245px,1fr));gap:15px}.dialog-grid{grid-template-columns:1fr}.player{max-width:350px;margin:auto;width:100%}.controls select{flex:1;min-width:140px}}
</style></head>
<body>
<header><div class="wrap"><div class="eyebrow">Thư viện dùng chung · Cáo văn phòng</div><h1>Chọn chuyển động.<br>Lấy lớp Cáo để dựng.</h1><p>Frame đã tách riêng, nền trong suốt và điểm đặt chân đã căn đồng nhất. Xem thử trên nền sáng/tối trước khi lấy MOV alpha hoặc dựng lại đúng thời lượng của cảnh.</p><div class="stats" id="stats"></div><nav class="top-links" id="topLinks"><a href="README.md">Hướng dẫn sản xuất</a><a href="qc/release-report.json">Kết quả bàn giao</a><a href="manifest.json">Manifest</a><a href="../animation-pack/index.html">Tra bộ nguồn ban đầu</a></nav></div></header>
<main class="wrap"><div class="controls"><input id="search" type="search" placeholder="Tìm vẫy chào, ghế, đi bộ, gõ máy…" aria-label="Tìm chuyển động"><select id="mode" aria-label="Cách phát"><option value="">Mọi cách phát</option><option value="loop">Có thể lặp</option><option value="once">Phát một lần</option></select><select id="ready" aria-label="Tình trạng"><option value="">Mọi tình trạng</option><option value="ready">Có MOV sẵn dùng</option><option value="pending">Chờ hoàn tất</option></select></div><p id="result" aria-live="polite"></p><div id="grid" class="grid"></div><aside class="info"><p><strong>Độ phân giải và nhịp chuyển động:</strong> canvas PNG 512×512; chiều cao nhân vật thực nằm trong thông tin từng bộ. Dùng gần kích thước gốc để giữ nét. Nguồn là các keyframe 4–8 fps; file video 30 fps giữ lại nhịp này bằng lặp frame, không tạo thêm tư thế trung gian.</p><p>Clip không có âm thanh và không khớp miệng theo giọng đọc. Các bộ có ghế/bàn/laptop đã chứa sẵn đạo cụ. <code>sit_down</code> dùng lại 8 frame <code>stand_up</code> theo thứ tự đảo chiều; số frame khác nhau được tính riêng.</p><p>Chọn hành động đúng storyboard. Đi bộ được dựng tại chỗ; nếu cần Cáo đi qua cảnh, di chuyển toàn bộ lớp video trong bước ghép. Đổi thời lượng bằng công cụ để chuỗi lặp hoặc giữ đúng pose cuối.</p></aside></main>
<dialog id="detail" aria-labelledby="detailTitle"><div class="dialog-top"><div><h2 id="detailTitle"></h2><div class="code-id" id="detailId"></div></div><button class="close" id="close" aria-label="Đóng xem thử">Đóng</button></div><div class="dialog-grid"><div><div class="player"><video id="video" controls muted playsinline preload="metadata"></video></div><div class="toolbar"><label for="background">Nền xem thử</label><select id="background"><option value="dark">Tối</option><option value="light">Sáng</option></select></div><a id="fullPreview" target="_blank" rel="noopener">Mở MP4 toàn khung 1080×1920</a></div><div class="dialog-content"><p id="detailFacts"></p><p id="detailNote"></p><p id="detailStatus" class="status-line"></p><div class="actions" id="detailLinks"></div><p style="margin-top:18px">Dựng lại lớp trong suốt theo thời lượng cảnh:</p><pre class="command" id="command"></pre><button id="copy">Sao chép lệnh</button><span id="copyResult" class="copy-result" aria-live="polite"></span><div class="small-links"><a id="frameLink" target="_blank">Các frame PNG</a><a id="qcLink" target="_blank">Ảnh kiểm tra sáng/tối</a><a id="promptLink" target="_blank">Prompt tạo hình</a></div></div></div></dialog>
<footer><div class="wrap">Tài nguyên hình ảnh được tạo bằng imagegen trong Codex từ thiết kế Cáo của giám đốc. Luôn gắn nhãn nội dung AI khi xuất bản theo quy định của xưởng.</div></footer>
<script>
const data=__DATA__;
const $=id=>document.getElementById(id);
let selected=null;
const readyCount=data.animations.filter(a=>a.ready).length;
if(data.showcase){const a=document.createElement('a');a.href=data.showcase;a.target='_blank';a.rel='noopener';a.textContent='Xem toàn bộ chuyển động';$('topLinks').prepend(a)}
for(const [value,label,good] of [[data.animations.length,'chuyển động'],[data.total_files,'file PNG'],[data.unique_frames,'frame khác nhau'],[readyCount,'MOV sẵn dùng',true]]){const s=document.createElement('div');s.className='stat'+(good?' good':'');const b=document.createElement('strong');b.textContent=value;s.append(b,document.createTextNode(' '+label));$('stats').append(s)}
const heightText=a=>a.native_height.length===2?(a.native_height[0]===a.native_height[1]?`${a.native_height[0]} px`:`${a.native_height[0]}–${a.native_height[1]} px`):'xem manifest';
const facts=a=>`${a.frames} frame · nguồn ${a.fps} fps · ${a.duration.toLocaleString('vi-VN',{maximumFractionDigits:2})} giây/chuỗi · ${a.loop?'Lặp được':'Phát một lần, giữ cuối'}`;
function link(label,href,primary=false,download=false){const a=document.createElement('a');a.textContent=label;a.href=href;a.className='button'+(primary?' primary':'');if(download)a.download='';else{a.target='_blank';a.rel='noopener'}return a}
function normalize(s){return s.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d')}
function render(){const q=normalize($('search').value.trim()),mode=$('mode').value,state=$('ready').value;const list=data.animations.filter(a=>(!q||normalize([a.id,a.label,a.notes,...a.tags].join(' ')).includes(q))&&(!mode||a.loop===(mode==='loop'))&&(!state||a.ready===(state==='ready')));$('result').textContent=`${list.length} / ${data.animations.length} chuyển động · Bấm “Xem chuyển động” để mở clip thật.`;$('grid').replaceChildren();if(!list.length){const e=document.createElement('div');e.className='empty';e.textContent='Không có chuyển động khớp bộ lọc. Thử từ khóa hoặc cách phát khác.';$('grid').append(e)}for(const a of list){const card=document.createElement('article');card.className='card';const stage=document.createElement('div');stage.className='stage';const image=new Image();image.src=a.poster;image.alt=a.label;image.loading='lazy';stage.append(image);const watch=document.createElement('button');watch.textContent='▶ Xem chuyển động';watch.onclick=()=>openDetail(a);stage.append(watch);const body=document.createElement('div');body.className='body';const title=document.createElement('h2');title.textContent=a.label;const id=document.createElement('div');id.className='code-id';id.textContent=a.id;const badge=document.createElement('span');badge.className='badge'+(a.ready?'':' wait');badge.textContent=a.ready?'Đã kiểm tra · có MOV':a.status==='FAILED'?'Cần sửa':a.status==='PASS'?'Đã kiểm tra · đang xuất MOV':'Đang kiểm tra';const meta=document.createElement('p');meta.className='facts';meta.textContent=facts(a);const native=document.createElement('p');native.className='facts';native.textContent=`Nhân vật cao ${heightText(a)} · canvas ${a.canvas.join('×')}`;const note=document.createElement('p');note.className='note';note.textContent=a.notes;const actions=document.createElement('div');actions.className='actions';if(a.ready)actions.append(link('Tải MOV trong suốt',a.clip,true,true));const detail=document.createElement('button');detail.textContent='Lệnh dựng';detail.onclick=()=>openDetail(a);actions.append(detail);const more=document.createElement('div');more.className='small-links';const frames=document.createElement('a');frames.href=a.frame_dir;frames.target='_blank';frames.textContent='Frame PNG';const qc=document.createElement('a');qc.href=a.contact;qc.target='_blank';qc.textContent='Kiểm tra ảnh';more.append(frames,qc);body.append(title,id,badge,meta,native,note,actions,more);card.append(stage,body);$('grid').append(card)}}
function setVideo(){if(!selected)return;const light=$('background').value==='light';const src=light?selected.light_preview:selected.preview;$('video').src=src;$('video').loop=selected.loop;$('fullPreview').href=src;const play=$('video').play();if(play)play.catch(()=>{})}
function openDetail(a){selected=a;$('detailTitle').textContent=a.label;$('detailId').textContent=a.id;$('detailFacts').textContent=facts(a)+`\nNhân vật cao ${heightText(a)}; PNG ${a.canvas.join('×')}.`;$('detailNote').textContent=a.notes;$('detailStatus').textContent=a.ready?'MOV alpha đã sẵn sàng sử dụng.':a.status==='FAILED'?'Bộ này cần sửa trước khi dùng.':'Chưa có MOV bàn giao; xem trạng thái trong manifest.';$('detailLinks').replaceChildren();if(a.ready)$('detailLinks').append(link('Tải MOV trong suốt',a.clip,true,true));$('detailLinks').append(link('MP4 nền sáng',a.light_preview));$('frameLink').href=a.frame_dir;$('qcLink').href=a.contact;$('promptLink').href=a.prompt;$('command').textContent=`node tools/fox/animate.mjs --id ${a.id} --duration 3 --out <thu_muc_video>/assets/cao-${a.id}.mov`;$('copyResult').textContent='';$('detail').showModal();setVideo()}
$('copy').onclick=async()=>{const text=$('command').textContent;try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);else{const el=document.createElement('textarea');el.value=text;el.style.position='fixed';el.style.opacity=0;document.body.append(el);el.select();const ok=document.execCommand('copy');el.remove();if(!ok)throw new Error('copy unsupported')}$('copyResult').textContent='Đã sao chép'}catch{$('copyResult').textContent='Chọn và sao chép lệnh trong ô phía trên.'}};
$('close').onclick=()=>$('detail').close();$('detail').addEventListener('close',()=>{$('video').pause();$('video').removeAttribute('src');$('video').load();selected=null});$('background').onchange=setVideo;for(const id of ['search','mode','ready'])$(id).addEventListener('input',render);render();
</script></body></html>'''
    output = pack / "index.html"
    output.write_text(document.replace("__DATA__", data), encoding="utf-8")
    print(json.dumps({"out": str(output), "animations": len(entries), "ready_mov": sum(item["ready"] for item in entries), "frame_files": payload["total_files"], "unique_frames": payload["unique_frames"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
