// Giao diện dashboard v2 (giám đốc yêu cầu 21/11/2026: dễ và đẹp hơn): thẻ chủ đề, tab, sáng/tối, huy hiệu.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const src = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const definitions = src.slice(0, src.lastIndexOf('\nrefresh(true);'));
const api = () => vm.runInNewContext(`${definitions}\n({ topicCard, linkify, readyHtml, setBadge, showTab })`);
const payload = '<img src=x onerror=alert(1)>';

test('thẻ chủ đề: điểm /30 thành chip theo mức, lý do/nguồn/gợi ý gập lại, link an toàn, thoát HTML, tương thích máy chủ cũ', () => {
  const { topicCard, linkify } = api();
  const card = topicCard({ kind: 'topic_proposal', topic_id: 25, dept: 'bong-da', dept_name: 'Bóng Đá', topic_text: `VAR ${payload}?`, topic_reason: 'Tín hiệu: x\nNguồn https://example.com/a?b=1&c=2 (21/11/2026)\nĐiểm: 27/30 (nhu cầu 5)', topic_brief: 'Hook dựng' });
  assert.match(card, /class="tc"/);
  assert.match(card, /⭐ 27\/30/);
  assert.match(card, /chip ok/);
  assert.match(card, /<details><summary>Xem lý do, nguồn và điểm<\/summary>/);
  assert.match(card, /<a href="https:\/\/example\.com\/a\?b=1&amp;c=2" target="_blank" rel="noopener noreferrer">/);
  assert.match(card, /Gợi ý góc làm:/);
  assert.match(card, /decideTopic\(25,'approve'\)/);
  assert.match(card, /decideTopic\(25,'reject'\)/);
  assert.ok(card.includes('&lt;img src=x onerror=alert(1)&gt;') && !card.includes(payload), 'tiêu đề được thoát HTML');
  assert.match(topicCard({ kind: 'topic_proposal', topic_id: 3, topic_text: 'A', topic_reason: 'Điểm: 20/30' }), /chip warn/);
  assert.match(topicCard({ kind: 'topic_proposal', topic_id: 4, topic_text: 'B', topic_reason: 'Điểm: 12/30' }), /chip bad/);
  assert.doesNotMatch(topicCard({ kind: 'topic_proposal', topic_id: 5, topic_text: 'C', topic_reason: '' }), /⭐|<details>/, 'không điểm, không lý do thì không chip/gập');
  assert.match(topicCard({ kind: 'topic_proposal', topic_id: 6, message: 'Dữ liệu cũ chưa có cấu trúc' }), /Dữ liệu cũ chưa có cấu trúc/, 'máy chủ cũ chưa gửi trường mới vẫn hiện được');
  assert.equal(linkify('javascript:alert(1) <b>'), 'javascript:alert(1) &lt;b&gt;', 'chỉ http(s) mới thành link, còn lại chỉ thoát HTML');
});

test('"Sẵn sàng đăng" gập bớt khi nhiều video, vẫn đủ nút cho từng video', () => {
  const { readyHtml } = api();
  const many = Array.from({ length: 8 }, (_, i) => ({ id: `IT-T${i}-E01`, title: `V${i}` }));
  const out = readyHtml(many);
  assert.match(out, /Xem thêm 3 video cũ hơn/);
  assert.equal([...out.matchAll(/openPack\(/g)].length, 8, 'đủ 8 nút Gói đăng, 3 cái nằm trong phần gập');
  assert.doesNotMatch(readyHtml(many.slice(0, 5)), /Xem thêm/);
});

test('trang có đủ tab, huy hiệu, nút đổi giao diện, trạng thái "không có việc", sáng/tối tự động và tôn trọng giảm chuyển động', () => {
  for (const t of ['today', 'depts', 'system', 'log']) {
    assert.match(html, new RegExp(`data-tab="${t}"`), `thiếu nút tab ${t}`);
    assert.match(html, new RegExp(`data-tabpanel="${t}"`), `thiếu vùng ${t}`);
  }
  for (const id of ['bdToday', 'themeBtn', 'allClear', 'stats', 'attn', 'topicq', 'readyq', 'autoq', 'depts', 'officeDir', 'officeBtn', 'liveDot', 'wkDot']) assert.match(html, new RegExp(`id="${id}"`), `thiếu #${id}`);
  assert.match(html, /:root\[data-theme="dark"\]/);
  assert.match(html, /prefers-color-scheme:dark/);
  assert.match(html, /prefers-reduced-motion:reduce/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /role="tab"/);
});

test('tab và giao diện: lưu lựa chọn bằng localStorage bọc try/catch, khởi tạo chạy sau refresh (ngoài phần kiểm thử cắt), ?theme chỉ áp cho lần xem', () => {
  assert.match(src, /try \{ localStorage\.setItem\('studio\.tab', name\); \}/);
  assert.match(src, /try \{ name = localStorage\.getItem\('studio\.tab'\); \}/);
  assert.match(src, /try \{ t = localStorage\.getItem\('studio\.theme'\) \|\| 'auto'; \}/);
  assert.match(src, /new URLSearchParams\(location\.search\)\.get\('theme'\)/);
  assert.ok(src.lastIndexOf('initTabs(); initTheme();') > src.lastIndexOf('refresh(true);'));
  const { setBadge, showTab } = api();
  assert.equal(typeof setBadge, 'function');
  assert.equal(typeof showTab, 'function');
});

test('giao diện chạy được khi trình duyệt chặn localStorage và khi chưa có DOM tab (hàm chỉ chạm DOM lúc được gọi)', () => {
  const ctx = vm.createContext({ localStorage: { getItem() { throw new Error('chặn'); }, setItem() { throw new Error('chặn'); } }, history: { replaceState() { throw new Error('chặn'); } } });
  const els = [];
  const mk = (tab) => ({ dataset: { tab, tabpanel: tab }, hidden: false, attrs: {}, setAttribute(k, v) { this.attrs[k] = v; } });
  for (const t of ['today', 'depts']) els.push(mk(t));
  ctx.document = { querySelectorAll: () => els, getElementById: () => null };
  vm.runInContext(`${definitions}\nshowTab('depts');`, ctx);
  assert.equal(els[0].hidden, true);
  assert.equal(els[1].hidden, false);
  assert.equal(els[1].attrs['aria-selected'], 'true');
  vm.runInContext("showTab('khong-co');", ctx);
  assert.equal(els[0].hidden, false, 'tên tab lạ thì về "Hôm nay"');
});

test('đề nghị duyệt thay thế: mỗi AI một nút (Claude, Gemini làm thay Claude duyệt); máy chủ cũ chưa gửi options vẫn ra nút Claude', () => {
  const { attnSplit } = vm.runInNewContext(`${definitions}\n({ attnSplit })`);
  const both = attnSplit([{ kind: 'takeover_offer', handler: 'director', job_id: 106, by: 'claude', for: 'codex', options: ['claude', 'gemini'], message: 'Việc #106 kẹt ở Codex' }]).mine[0];
  assert.match(both, /takeover\(106,'claude'\)/);
  assert.match(both, /takeover\(106,'gemini'\)/);
  assert.match(both, /Cho Claude làm thay/);
  assert.match(both, /Cho Gemini làm thay, Claude duyệt/);
  assert.match(both, /job\(106,'cancel'\)/, 'vẫn có nút Huỷ');
  const old = attnSplit([{ kind: 'takeover_offer', handler: 'director', job_id: 5, by: 'claude', message: 'cũ' }]).mine[0];
  assert.match(old, /takeover\(5,'claude'\)/);
  assert.doesNotMatch(old, /gemini/);
});

test('khối cân bằng tải: tiêu đề, ba bên, trạng thái, thoát HTML; không có báo cáo thì rỗng; hai khối 7 ngày và 24h cùng có trong trang', () => {
  const { loadBlockHtml } = vm.runInNewContext(`${definitions}\n({ loadBlockHtml })`);
  const row = { share_pct: 33.3, minutes: 30, jobs: 1, calls: 2, limits: 0 };
  const report = (status) => ({ days: 1, status, caveat: 'c', notes: [payload], providers: { claude: row, codex: row, gemini: row } });
  const out = loadBlockHtml(report('balanced'), 'Cân bằng tải 24h');
  assert.match(out, /Cân bằng tải 24h/);
  for (const name of ['Claude', 'Codex', 'Gemini']) assert.match(out, new RegExp(name));
  assert.match(out, /cân bằng/);
  assert.ok(out.includes('&lt;img src=x onerror=alert(1)&gt;') && !out.includes(payload), 'ghi chú được thoát HTML');
  assert.match(loadBlockHtml(report('skewed'), 'x'), /LỆCH/);
  assert.match(loadBlockHtml(report('no_data'), 'x'), /chưa đủ số liệu/);
  assert.equal(loadBlockHtml(null, 'x'), '');
  assert.match(src, /loadBlockHtml\(pool\.load, 'Cân bằng tải 7 ngày'\)/);
  assert.match(src, /pool\.load_24h \?/, 'máy chủ cũ chưa có load_24h thì chỉ vẽ khối 7 ngày');
  assert.match(src, /loadBlockHtml\(pool\.load_24h, 'Cân bằng tải 24h'\)/);
});
