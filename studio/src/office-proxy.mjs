// Lớp chuyển tiếp mỏng đứng trước 1 bản whatsmyagentdoing để trang hiện rõ ĐANG THEO DÕI PHÒNG NÀO
// (tiêu đề tab "Phòng IT · …" + dải tiêu đề trên trang). Không sửa mã công cụ đã ghim (tools/whatsmyagentdoing):
// chỉ chèn thêm 1 đoạn <style>/<script> vào HTML trả về; mọi đường dẫn khác (API, SSE /events, ảnh…) chuyển nguyên.
// Chạy: node office-proxy.mjs --port 4545 --target 4645 --title "Phòng IT" --name VP-it --accounts "claude …; codex …"
import http from 'node:http';
import { createLookup, transformSnapshot, historyOf, decodeSeats } from './office-roles.mjs';

const arg = (k, d = '') => {
  const i = process.argv.indexOf(`--${k}`);
  return i > 0 ? process.argv[i + 1] : d;
};
const PORT = Number(arg('port'));
const TARGET = Number(arg('target'));
const TITLE = arg('title', 'Văn phòng');
const NAME = arg('name', '');
const ACCOUNTS = arg('accounts', '');
// Bộ core: nhận vai từng phiên (đọc log của đúng 2 thư mục tài khoản mà bản gốc đang đọc) -> đặt tên/ẩn agent phụ.
const lookup = createLookup({ claudeDir: arg('claude-dir', ''), codexDir: arg('codex-dir', '') });
// Chỗ ngồi cố định của đội (các vị trí core): vị trí rảnh vẫn hiện 1 nhân vật "rảnh". Rỗng = như trước (chỉ hiện phiên có thật).
const SEATS = decodeSeats(arg('seats', ''));
const core = (json) => {
  try {
    return JSON.stringify(transformSnapshot(JSON.parse(json), lookup, undefined, undefined, SEATS));
  } catch {
    return json; // không đọc được thì chuyển nguyên, không làm hỏng trang
  }
};

// Ngăn "Đã gọi": agent đã làm xong được dọn khỏi sàn, vẫn xem lại được ở đây (/studio/history).
function serveHistory(res) {
  const out = (h) => res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }).end(JSON.stringify({ now: Date.now(), history: h }));
  const r = http.get({ host: '127.0.0.1', port: TARGET, path: '/api/sessions', timeout: 4000 }, (ur) => {
    const chunks = [];
    ur.on('data', (c) => chunks.push(c));
    ur.on('end', () => {
      try {
        out(historyOf(JSON.parse(Buffer.concat(chunks).toString('utf8')), lookup));
      } catch {
        out([]);
      }
    });
  });
  r.on('error', () => out([]));
  r.on('timeout', () => r.destroy());
}

const LOOPBACK = ['localhost', '127.0.0.1', '[::1]'];
const json = (x) => JSON.stringify(x).replace(/</g, '\\u003c');

function inject(html) {
  const banner = `🏢 ${TITLE}${NAME ? ` · ${NAME}` : ''}${ACCOUNTS ? ` — ${ACCOUNTS}` : ''}`;
  const snippet = `
<style>#studio-dept{position:fixed;top:6px;left:50%;transform:translateX(-50%);z-index:2147483647;pointer-events:none;
  background:#e8590c;color:#fff;font:600 13px/1.3 system-ui,sans-serif;padding:5px 14px;border-radius:999px;
  box-shadow:0 2px 10px rgba(0,0,0,.35);max-width:calc(100vw - 32px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}</style>
<script>(function(){
  var prefix=${json(TITLE + ' · ')}, text=${json(banner)};
  function fixTitle(){ if(document.title.indexOf(prefix)!==0) document.title=prefix+document.title; }
  function addBanner(){ if(document.getElementById('studio-dept')) return; var d=document.createElement('div'); d.id='studio-dept'; d.textContent=text; d.title=text; document.body.appendChild(d); }
  document.addEventListener('DOMContentLoaded',function(){ addBanner(); fixTitle();
    var t=document.querySelector('title'); if(t) new MutationObserver(fixTitle).observe(t,{childList:true,characterData:true,subtree:true}); });
  setInterval(fixTitle,2000);

  // Ngăn "Đã gọi": các agent đã xong việc (đã dọn khỏi sàn) để giám đốc xem lại ai từng được gọi.
  var open=false, items=[], btn, panel, list;
  function hm(ms){ return ms? new Date(ms).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'}) : '?'; }
  function dur(a,b){ if(!a||!b||b<a) return ''; var m=Math.round((b-a)/60000); return m<1? '<1 phút' : m+' phút'; }
  function day(ms){ return ms? new Date(ms).toLocaleDateString('vi-VN') : ''; }
  function el(tag,cls,text){ var e=document.createElement(tag); if(cls) e.className=cls; if(text!=null) e.textContent=text; return e; }
  function render(){
    if(!btn) return;
    btn.textContent='🗂 Đã gọi ('+items.length+')';
    if(!open||!panel) return;
    list.textContent='';
    if(!items.length){ list.appendChild(el('div','sh-empty','Chưa có agent nào làm xong. Agent nào xong việc sẽ được dọn khỏi sàn và nằm ở đây.')); return; }
    var lastDay='';
    items.forEach(function(it){
      var d=day(it.endedAt); if(d!==lastDay){ lastDay=d; list.appendChild(el('div','sh-day',d)); }
      var box=el('details','sh-item'), sum=el('summary','');
      sum.appendChild(el('span','sh-dot '+(it.status==='error'?'err':'ok'), it.status==='error'?'!':'✓'));
      sum.appendChild(el('b','',it.label));
      sum.appendChild(el('span','sh-meta',' · '+(it.agent==='codex'?'Codex':'Claude')+(it.model?' '+it.model:'')));
      var t=dur(it.startedAt,it.endedAt);
      sum.appendChild(el('span','sh-time',hm(it.startedAt)+' → '+hm(it.endedAt)+(t?' ('+t+')':'')));
      box.appendChild(sum);
      if(it.task) box.appendChild(el('div','sh-line','Được giao: '+it.task));
      if(it.result) box.appendChild(el('div','sh-line','Kết quả: '+it.result));
      if(!it.task&&!it.result) box.appendChild(el('div','sh-line','(không có nội dung ghi lại)'));
      list.appendChild(box);
    });
  }
  function load(){ fetch('/studio/history',{cache:'no-store'}).then(function(r){return r.json();}).then(function(j){ items=j.history||[]; render(); }).catch(function(){}); }
  function build(){
    if(btn) return;
    var st=document.createElement('style');
    st.textContent='#studio-hist-btn{position:fixed;left:14px;bottom:14px;z-index:2147483000;background:#2b2d33;color:#fff;border:1px solid #555;border-radius:999px;padding:7px 14px;font:600 13px system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35)}'
     +'#studio-hist-btn:hover{background:#3a3d45}'
     +'#studio-hist{position:fixed;left:14px;bottom:54px;z-index:2147483000;width:min(420px,calc(100vw - 28px));max-height:70vh;overflow:auto;background:#1f2127;color:#e6e6e6;border:1px solid #555;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.5);font:13px/1.4 system-ui,sans-serif;display:none}'
     +'#studio-hist .sh-head{position:sticky;top:0;background:#1f2127;padding:10px 12px;border-bottom:1px solid #444;font-weight:700}'
     +'#studio-hist .sh-head small{display:block;font-weight:400;color:#aaa;margin-top:2px}'
     +'#studio-hist .sh-day{padding:6px 12px;color:#aaa;font-size:12px;background:#262930}'
     +'#studio-hist .sh-item{padding:7px 12px;border-bottom:1px solid #333}'
     +'#studio-hist .sh-item summary{cursor:pointer;list-style:none}'
     +'#studio-hist .sh-item summary::-webkit-details-marker{display:none}'
     +'#studio-hist .sh-dot{display:inline-block;width:16px;color:#4cc38a;font-weight:700}#studio-hist .sh-dot.err{color:#ff6b6b}'
     +'#studio-hist .sh-meta{color:#9aa}#studio-hist .sh-time{float:right;color:#9aa;font-size:12px}'
     +'#studio-hist .sh-line{margin:4px 0 0 16px;color:#cfcfcf;word-break:break-word}'
     +'#studio-hist .sh-empty{padding:16px 12px;color:#aaa}';
    document.head.appendChild(st);
    btn=el('button','','🗂 Đã gọi (0)'); btn.id='studio-hist-btn'; btn.type='button'; btn.title='Các agent đã làm xong (đã dọn khỏi sàn)';
    panel=el('div',''); panel.id='studio-hist';
    var head=el('div','sh-head','Agent đã gọi và đã làm xong'); head.appendChild(el('small','','Xong việc thì tự dọn khỏi sàn, nằm lại ở đây để xem lại'));
    list=el('div',''); panel.appendChild(head); panel.appendChild(list);
    btn.onclick=function(){ open=!open; panel.style.display=open?'block':'none'; if(open) load(); render(); };
    document.body.appendChild(panel); document.body.appendChild(btn);
    load();
  }
  document.addEventListener('DOMContentLoaded',build);
  setInterval(load,5000);
})();</script>`;
  html = html.replace(/<title>([^<]*)<\/title>/, (_, t) => `<title>${(TITLE + ' · ').replace(/[<>&]/g, '')}${t}</title>`);
  return html.includes('</head>') ? html.replace('</head>', `${snippet}\n</head>`) : snippet + html;
}

const server = http.createServer((req, res) => {
  // Giữ đúng hàng rào của công cụ gốc: chỉ nhận yêu cầu gửi tới loopback (chống DNS-rebinding).
  const host = String(req.headers.host || '').replace(/:\d+$/, '');
  if (!LOOPBACK.includes(host)) return res.writeHead(403).end();
  if (String(req.url).split('?')[0] === '/studio/history') return serveHistory(res);
  const headers = { ...req.headers, host: `localhost:${TARGET}` };
  delete headers['accept-encoding']; // nhận HTML không nén để chèn được
  const up = http.request({ host: '127.0.0.1', port: TARGET, method: req.method, path: req.url, headers }, (ur) => {
    const type = String(ur.headers['content-type'] || '');
    if (type.startsWith('text/html')) {
      const chunks = [];
      ur.on('data', (c) => chunks.push(c));
      ur.on('end', () => {
        const body = Buffer.from(inject(Buffer.concat(chunks).toString('utf8')), 'utf8');
        const h = { ...ur.headers, 'content-length': body.length };
        delete h['transfer-encoding'];
        res.writeHead(ur.statusCode, h).end(body);
      });
      return;
    }
    const pathOnly = String(req.url).split('?')[0];
    if (pathOnly === '/events' && type.startsWith('text/event-stream')) {
      // Luồng SSE: mỗi sự kiện "data: {...}\n\n" -> nhận vai rồi gửi tiếp; dòng ": ping" chuyển nguyên.
      res.writeHead(ur.statusCode, ur.headers);
      let buf = '';
      let lastRaw = '';
      let lastOut = '';
      const sig = (t) => t.replace(/^\{"now":\d+,/, '{');
      ur.setEncoding('utf8');
      ur.on('data', (c) => {
        buf += c;
        let i;
        while ((i = buf.indexOf('\n\n')) >= 0) {
          const ev = buf.slice(0, i);
          buf = buf.slice(i + 2);
          if (ev.startsWith('data: ')) {
            lastRaw = ev.slice(6);
            lastOut = core(lastRaw);
            res.write(`data: ${lastOut}\n\n`);
          } else res.write(`${ev}\n\n`);
        }
      });
      // Bản gốc chỉ đẩy khi log đổi; agent hết thời gian chờ sau khi xong thì phải tự rời sàn -> tính lại theo đồng hồ.
      const tick = setInterval(() => {
        if (!lastRaw) return;
        const out = core(lastRaw);
        if (sig(out) !== sig(lastOut)) res.write(`data: ${(lastOut = out)}\n\n`);
      }, 5000);
      ur.on('end', () => (clearInterval(tick), res.end(buf)));
      res.on('close', () => clearInterval(tick));
      return;
    }
    if (pathOnly === '/api/sessions' && type.startsWith('application/json')) {
      const chunks = [];
      ur.on('data', (c) => chunks.push(c));
      ur.on('end', () => {
        const body = Buffer.from(core(Buffer.concat(chunks).toString('utf8')), 'utf8');
        const h = { ...ur.headers, 'content-length': body.length };
        delete h['transfer-encoding'];
        res.writeHead(ur.statusCode, h).end(body);
      });
      return;
    }
    res.writeHead(ur.statusCode, ur.headers);
    ur.pipe(res);
    // Công cụ gốc tắt theo lệnh /api/shutdown -> lớp chuyển tiếp tắt theo.
    if (req.url === '/api/shutdown' && ur.statusCode === 200) ur.on('end', () => setTimeout(() => process.exit(0), 200));
  });
  up.on('error', () => {
    // Bản gốc đã tắt: vẫn trả lời ping (để lệnh office nhận ra và dọn) và vẫn nhận lệnh tắt, không thành cổng mồ côi.
    if (req.url === '/api/ping') return res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ app: 'whatsmyagentdoing', proxy: true, target: 'down' }));
    if (req.url === '/api/shutdown' && req.headers['x-whatsmyagentdoing'] === 'stop') {
      res.writeHead(200, { 'content-type': 'application/json' }).end('{"ok":true}');
      return setTimeout(() => process.exit(0), 100);
    }
    if (!res.headersSent) res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Văn phòng 2D của phòng này đang tắt. Bật lại: npm run office --prefix studio');
  });
  res.on('close', () => up.destroy()); // trình duyệt đóng (vd luồng SSE /events) -> đóng luôn phía bản gốc
  req.pipe(up);
});

server.on('error', (e) => {
  console.error(`office-proxy: không mở được cổng ${PORT}: ${e.message}`);
  process.exit(1);
});
server.listen(PORT, '127.0.0.1', () => console.log(`office-proxy ${NAME} → http://localhost:${PORT} (đích ${TARGET})`));

// Bản gốc chết hẳn (3 lần ping hỏng liên tiếp) -> tự tắt, không để cổng mồ côi.
let fails = 0;
setInterval(() => {
  const r = http.get({ host: '127.0.0.1', port: TARGET, path: '/api/ping', timeout: 1500 }, (x) => {
    x.resume();
    fails = 0;
  });
  r.on('error', () => ++fails >= 3 && process.exit(0));
  r.on('timeout', () => r.destroy());
}, 10_000).unref?.();
