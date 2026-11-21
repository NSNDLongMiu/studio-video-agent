// Gemini (agy) là agent thứ 3 (giám đốc 20/11/2026): quy tắc tài khoản, chặn đường API trả phí (luật 8),
// quyền gọi của Claude, khoá một lượt, và chạy thử toàn bộ gemini-run.mjs với agy giả.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-gemini-'));
const agyHome = path.join(tmp, 'agy-home');
fs.mkdirSync(agyHome, { recursive: true });
Object.assign(process.env, {
  STUDIO_DB: path.join(tmp, 'db.sqlite'), STUDIO_CONTENT: path.join(tmp, 'content'), STUDIO_ACCOUNTS: path.join(tmp, 'accounts'), STUDIO_NO_AUTOSTART: '1',
  STUDIO_AGY_HOME: agyHome, STUB_DIR: tmp,
});
const here = path.dirname(fileURLToPath(import.meta.url));
const stub = path.join(here, 'helpers', 'agy-stub.mjs');
const runScript = path.join(here, '..', 'src', 'gemini-run.mjs');
const S = await import('../src/db.mjs');
const P = await import('../src/pool.mjs');
const A = await import('../src/agy.mjs');
const R = await import('../src/runners.mjs');
const L = await import('../src/limits.mjs');
const G = await import('../src/gemini-run.mjs');

test('đọc email đăng nhập từ log của agy (lấy dòng cuối) và null khi không có', () => {
  assert.equal(A.parseAgyEmail('I1 server_oauth.go:226] OAuth: authenticated successfully as cu@example.com\nI2 ... authenticated successfully as moi@example.com\n'), 'moi@example.com');
  assert.equal(A.parseAgyEmail('không có gì ở đây'), null);
  assert.equal(A.parseAgyEmail(''), null);
});

test('đọc kích thước ảnh PNG và JPEG để QC thấy ngay 1:1 hay 9:16', () => {
  const png = Buffer.alloc(40);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13]).copy(png, 0);
  png.write('IHDR', 12, 'ascii');
  png.writeUInt32BE(1080, 16);
  png.writeUInt32BE(1920, 20);
  assert.deepEqual(A.imageSize(png), { w: 1080, h: 1920 });
  // JPEG: SOI, APP0 (độ dài 16), SOF0 (cao 1024, rộng 768)
  const jpg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]), Buffer.alloc(14), Buffer.from([0xff, 0xc0, 0x00, 0x11, 0x08, 0x04, 0x00, 0x03, 0x00, 0x03]), Buffer.alloc(12)]);
  assert.deepEqual(A.imageSize(jpg), { w: 768, h: 1024 });
  assert.equal(A.imageSize(Buffer.from('không phải ảnh')), null);
});

test('ghế gemini: chỉ gói, đúng 1 ghế, luôn dùng đăng nhập mặc định, hiện email từ log', () => {
  assert.throws(() => P.addAccount({ provider: 'gemini', label: 'main', kind: 'api_key', secret_file: 'x.txt' }), /luật 8/);
  assert.equal(P.listAccounts().some((a) => a.provider === 'gemini'), false, 'từ chối thì không để lại ghế');
  fs.writeFileSync(path.join(agyHome, 'cli.log'), 'I1 server_oauth.go:226] OAuth: authenticated successfully as nguoi.dung@example.com\n');
  const r = P.addAccount({ provider: 'gemini', label: 'main', owner: 'Giám đốc' });
  const a = P.listAccounts().find((x) => x.provider === 'gemini');
  assert.equal(a.home, null, 'không có thư mục đăng nhập riêng');
  assert.equal(a.status, 'ready', 'dùng đăng nhập mặc định nên không bắt đăng nhập lại');
  assert.equal(a.email, 'nguoi.dung@example.com');
  assert.match(a.person, /^Gemini nguoi\.dung@example\.com \[ghế main\]$/);
  assert.match(r.login, /agy/);
  assert.throws(() => P.addAccount({ provider: 'gemini', label: 'hai' }), /chỉ giữ MỘT đăng nhập/);
  assert.equal(P.resolveAccount('gemini/main').id, a.id);
  assert.equal(P.resolveAccount('gemini/nguoi.dung@example.com').id, a.id);
  assert.equal(P.poolOverview().summary.gemini.total, 1);
});

test('môi trường chạy Gemini gỡ mọi đường khoá API/ADC (luật 8) nhưng giữ biến thường', () => {
  const keep = { ...process.env };
  Object.assign(process.env, { GEMINI_API_KEY: 'k1', GOOGLE_API_KEY: 'k2', AGY_ADC_AUTH: '1', GOOGLE_APPLICATION_CREDENTIALS: 'c.json', GOOGLE_GENAI_USE_VERTEXAI: 'true', NANOBANANA_API_KEY: 'k3', GIU_LAI: 'co' });
  try {
    const env = R.accountEnv('gemini', P.listAccounts().find((a) => a.provider === 'gemini'));
    for (const k of A.AGY_DROP_ENV) assert.equal(k in env, false, `${k} phải bị gỡ`);
    assert.equal(env.GIU_LAI, 'co');
  } finally {
    for (const k of ['GEMINI_API_KEY', 'GOOGLE_API_KEY', 'AGY_ADC_AUTH', 'GOOGLE_APPLICATION_CREDENTIALS', 'GOOGLE_GENAI_USE_VERTEXAI', 'NANOBANANA_API_KEY', 'GIU_LAI']) delete process.env[k];
    Object.assign(process.env, keep);
  }
  assert.ok(JSON.parse(A.AGY_SETTINGS).useG1Credits === false, 'ép tắt tiêu credit trả phí cho từng lượt');
  assert.equal(A.AGY_MODEL(), 'claude-opus-4-6-thinking', 'giám đốc chọn Claude Opus 4.6 (Thinking) làm mặc định (20/11/2026)');
  process.env.STUDIO_GEMINI_MODEL = 'gemini-3.8-flash-medium';
  try {
    assert.equal(A.AGY_MODEL(), 'gemini-3.8-flash-medium', 'đổi được bằng STUDIO_GEMINI_MODEL');
  } finally {
    delete process.env.STUDIO_GEMINI_MODEL;
  }
  // dự phòng (giám đốc chốt 21/11/2026): Opus hết hạn mức thì dùng Gemini 3.8 Flash (High)
  assert.equal(A.AGY_FALLBACK_MODEL(), 'gemini-3.8-flash-high');
  assert.deepEqual(A.AGY_MODEL_CHAIN(), ['claude-opus-4-6-thinking', 'gemini-3.8-flash-high']);
  process.env.STUDIO_GEMINI_FALLBACK_MODEL = 'none';
  try {
    assert.deepEqual(A.AGY_MODEL_CHAIN(), ['claude-opus-4-6-thinking'], '"none" tắt dự phòng');
    process.env.STUDIO_GEMINI_FALLBACK_MODEL = 'claude-opus-4-6-thinking';
    assert.deepEqual(A.AGY_MODEL_CHAIN(), ['claude-opus-4-6-thinking'], 'dự phòng trùng mô hình mặc định thì bỏ');
  } finally {
    delete process.env.STUDIO_GEMINI_FALLBACK_MODEL;
  }
});

test('sổ mô hình hết hạn mức: ghi nhớ tới giờ hồi, hết hạn thì tự bỏ, mô hình cuối luôn được thử', () => {
  const OPUS = 'claude-opus-4-6-thinking';
  const FLASH = 'gemini-3.8-flash-high';
  assert.deepEqual(G.readModelLimits(), {});
  const until = new Date(Date.now() + 2 * 3600_000);
  assert.equal(G.noteModelLimit(OPUS, until, 'Third-party quota reached').getTime(), until.getTime());
  assert.ok(G.readModelLimits()[OPUS]);
  assert.deepEqual(G.planModels([OPUS, FLASH], G.readModelLimits()), [FLASH], 'đang hết thì đi thẳng sang dự phòng');
  assert.deepEqual(G.readModelLimits(Date.now() + 3 * 3600_000), {}, 'qua giờ hồi thì không còn tính là hết');
  assert.deepEqual(G.planModels([OPUS, FLASH], {}), [OPUS, FLASH]);
  assert.deepEqual(G.planModels([OPUS], { [OPUS]: {} }), [OPUS], 'chỉ có một mô hình thì vẫn thử nó');
  const far = G.noteModelLimit(FLASH, new Date(Date.now() + 48 * 3600_000));
  assert.ok(far.getTime() <= Date.now() + 6 * 3600_000 + 1000, 'giờ hồi lạ thì cắt ở 6 giờ');
  assert.ok(G.noteModelLimit('mo-hinh-la', null).getTime() > Date.now(), 'không rõ giờ hồi thì ghi tạm 30 phút');
  G.clearModelLimit(OPUS);
  G.clearModelLimit(FLASH);
  G.clearModelLimit('mo-hinh-la');
  assert.deepEqual(G.readModelLimits(), {});
});

test('Claude được gọi gemini-run ở plan/qc/scout bằng đúng một mẫu lệnh cố định, rescue/dept_review thì không', () => {
  const tools = (kind) => {
    const a = R.buildClaudeArgs({ kind, attempts: 0 }, { kind: 'subscription' });
    return a[a.indexOf('--allowedTools') + 1].split(',');
  };
  const pat = 'Bash(node --disable-warning=ExperimentalWarning studio/src/gemini-run.mjs *)';
  for (const k of ['plan', 'qc', 'scout']) assert.ok(tools(k).includes(pat), `${k} phải gọi được Gemini`);
  for (const k of ['rescue', 'dept_review']) assert.equal(tools(k).includes(pat), false, `${k} không được gọi Gemini`);
  assert.equal(tools('plan').some((t) => /agy/.test(t)), false, 'không cấp agy trần');
});

test('nhận diện thông báo hết limit và lỗi đăng nhập của agy', () => {
  assert.equal(L.classifyFailure('Error: RESOURCE_EXHAUSTED — you have reached your weekly quota. Try again in 2 hours.').type, 'limit');
  assert.equal(L.classifyFailure('authentication required').type, 'auth');
  assert.equal(L.classifyFailure('lỗi lạ chưa từng thấy').type, 'other');
});

test('khoá một lượt: bận thì null, nhả thì lấy lại được, chủ khoá đã chết thì thu hồi', () => {
  const f = path.join(tmp, 'x.lock');
  const rel = G.acquireLock(f);
  assert.equal(typeof rel, 'function');
  assert.equal(G.acquireLock(f), null, 'đang giữ nên bận');
  rel();
  const again = G.acquireLock(f);
  assert.equal(typeof again, 'function');
  again();
  fs.writeFileSync(f, JSON.stringify({ pid: 2_000_000_000, at: Date.now() }));
  const reclaimed = G.acquireLock(f);
  assert.equal(typeof reclaimed, 'function', 'pid không tồn tại là khoá chết');
  reclaimed();
});

// ---------- chạy gemini-run.mjs thật với agy giả ----------
const topicDir = path.join(tmp, 'content', 'it', 'T1-thu');
fs.mkdirSync(topicDir, { recursive: true });
const promptFile = path.join(topicDir, 'review', 'gemini-prompt.md');
fs.mkdirSync(path.dirname(promptFile), { recursive: true });
fs.writeFileSync(promptFile, 'Sinh một ảnh nền văn phòng, không chữ.');
const calls = () => (fs.existsSync(path.join(tmp, 'agy-calls.jsonl')) ? fs.readFileSync(path.join(tmp, 'agy-calls.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l)) : []);
const runGemini = (mode, { stubMode = 'ok', dir = topicDir, env = {} } = {}) =>
  spawnSync(process.execPath, ['--disable-warning=ExperimentalWarning', runScript, mode, promptFile, dir], { encoding: 'utf8', env: { ...process.env, STUDIO_AGY_JS: stub, STUB_AGY_MODE: stubMode, ...env } });
const acct = () => P.listAccounts().find((a) => a.provider === 'gemini');

test('images: chép ảnh từ thư mục của agy vào assets/gen, ghi sổ nguồn, không dùng cờ nguy hiểm, gỡ khoá API', () => {
  const r = runGemini('images', { env: { GEMINI_API_KEY: 'khong-duoc-lot-vao', AGY_ADC_AUTH: '1' } });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /ẢNH ĐÃ CHÉP \(1\)/);
  const gen = path.join(topicDir, 'assets', 'gen');
  const files = fs.readdirSync(gen).filter((n) => n.endsWith('.png'));
  assert.equal(files.length, 1);
  assert.match(files[0], /^gen-\d{14}-01-nen_van_phong\.png$/, 'bỏ hậu tố thời gian của agy');
  const rec = JSON.parse(fs.readFileSync(path.join(gen, 'gen-ledger.jsonl'), 'utf8').trim().split('\n').pop());
  assert.equal(rec.w, 1080);
  assert.equal(rec.h, 1920);
  assert.equal(rec.label, 'AI');
  assert.match(rec.sha256, /^[0-9a-f]{64}$/);
  assert.match(rec.tool, /agy image-generator/);
  assert.equal(rec.prompt_file, 'review/gemini-prompt.md');
  assert.equal(fs.existsSync(`${promptFile}.reply.md`), true);
  const c = calls().pop();
  assert.ok(c.args.includes('--sandbox'));
  assert.equal(c.args.includes('--dangerously-skip-permissions'), false, 'không bao giờ tự duyệt mọi quyền');
  assert.equal(JSON.parse(c.args[c.args.indexOf('--settings') + 1]).useG1Credits, false);
  assert.equal(c.args[c.args.indexOf('--model') + 1], 'claude-opus-4-6-thinking', 'mọi lượt chạy chốt mô hình mặc định đã chọn');
  assert.equal(c.env_key, 'unset', 'khoá API không được lọt vào agy');
  assert.equal(c.env_adc, 'unset');
  // agy KHÔNG chạy trong thư mục tập video: thư mục làm việc của nó là thư mục tạm dùng một lần, và bị xoá sau khi xong
  assert.notEqual(path.resolve(c.cwd), path.resolve(topicDir), 'không giao thư mục tập video cho agy (agy ghi tự do trong thư mục làm việc)');
  assert.match(path.resolve(c.cwd), /[\\/]\.local[\\/]gemini-work[\\/]/);
  assert.equal(fs.existsSync(c.cwd), false, 'thư mục tạm đã được dọn');
  assert.deepEqual(c.files, [], 'chế độ images không đưa file dự án vào thư mục tạm');
  assert.equal(acct().status, 'ready');
  assert.ok(acct().runs >= 1);
});

test('look: chép đúng các ảnh vào thư mục tạm để agy xem (giữ đường dẫn tương đối), không chép file khác, rồi dọn', () => {
  const qc = path.join(topicDir, 'assets', '_scratch', 'qc-auto');
  fs.mkdirSync(path.join(qc, 'sub'), { recursive: true });
  fs.writeFileSync(path.join(qc, 'board-01.png'), 'png-gia');
  fs.writeFileSync(path.join(qc, 'sub', 'scene-02.jpg'), 'jpg-gia');
  fs.writeFileSync(path.join(qc, 'report.md'), 'không phải ảnh, không được chép');
  fs.writeFileSync(path.join(qc, 'video.mp4'), 'không phải ảnh');
  const r = runGemini('look', { dir: qc });
  assert.equal(r.status, 0, r.stderr);
  const c = calls().pop();
  assert.deepEqual([...c.files].sort(), ['board-01.png', 'sub/scene-02.jpg']);
  assert.equal(fs.existsSync(c.cwd), false, 'thư mục tạm đã được dọn');
  assert.ok(fs.existsSync(path.join(qc, 'report.md')) && fs.existsSync(path.join(qc, 'board-01.png')), 'file gốc của tập video còn nguyên');
});

test('agy ghi lung tung trong thư mục làm việc thì chỉ rơi vào thư mục tạm: không lọt vào dự án, và được báo lại', () => {
  const before = fs.readdirSync(topicDir).sort();
  const r = runGemini('facts', { env: { STUB_AGY_SCRIBBLE: '1' } });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /agy còn tự tạo 1 file tạm: agy-tu-ghi\.txt/);
  assert.deepEqual(fs.readdirSync(topicDir).sort(), before, 'thư mục chủ đề không có file lạ');
  assert.equal(fs.existsSync(path.join(topicDir, 'agy-tu-ghi.txt')), false);
  assert.ok(S.recentEvents(10).some((e) => /agy tự tạo thêm 1 file tạm, đã bỏ/.test(e.message)));
});

test('thư mục tạm nằm trong vùng agy tin cậy thì TỪ CHỐI chạy (agy ghi tự do ở đó), không gọi agy, không tính lượt', () => {
  const settings = path.join(agyHome, 'settings.json');
  const before = acct().runs;
  const nCalls = calls().length;
  fs.writeFileSync(settings, JSON.stringify({ trustedWorkspaces: [path.resolve(here, '..', '..', '..')] })); // thư mục gốc dự án
  try {
    const r = runGemini('facts');
    assert.equal(r.status, 7, r.stderr);
    assert.match(r.stderr, /AN_TOAN: .*vùng agy tin cậy/);
    assert.equal(calls().length, nCalls, 'không gọi agy');
    assert.equal(acct().runs, before, 'không tính lượt dùng');
  } finally {
    fs.unlinkSync(settings);
  }
  assert.equal(runGemini('facts').status, 0, 'bỏ vùng tin cậy thì chạy lại bình thường');
});

test('trustedWorkspaces/insideAny: đọc cài đặt của agy và so đường dẫn không phân biệt hoa thường', () => {
  assert.deepEqual(A.trustedWorkspaces(), []);
  fs.writeFileSync(path.join(agyHome, 'settings.json'), JSON.stringify({ trustedWorkspaces: ['C:\\Users\\PC', 42] }));
  try {
    assert.deepEqual(A.trustedWorkspaces(), ['C:\\Users\\PC']);
  } finally {
    fs.unlinkSync(path.join(agyHome, 'settings.json'));
  }
  assert.equal(A.insideAny('C:\\Users\\PC\\AppData\\Local\\Temp\\x', ['c:\\users\\pc']), 'c:\\users\\pc');
  assert.equal(A.insideAny('C:\\Users\\PC', ['C:\\Users\\PC']), 'C:\\Users\\PC', 'chính nó cũng tính');
  assert.equal(A.insideAny('D:\\Agent Video Studio\\.local\\x', ['C:\\Users\\PC']), null);
  assert.equal(A.insideAny('C:\\Users\\PCX\\a', ['C:\\Users\\PC']), null, 'không nhầm thư mục tên bắt đầu giống nhau');
});

test('ideate/facts: chỉ ghi lời trả lời cạnh file prompt, không sinh thư mục ảnh mới', () => {
  const before = fs.existsSync(path.join(topicDir, 'assets', 'gen', 'gen-ledger.jsonl')) ? fs.readFileSync(path.join(topicDir, 'assets', 'gen', 'gen-ledger.jsonl'), 'utf8') : '';
  const r = runGemini('facts');
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /Xong \(ok\)/);
  assert.doesNotMatch(r.stdout, /ẢNH ĐÃ CHÉP/);
  assert.equal(fs.readFileSync(path.join(topicDir, 'assets', 'gen', 'gen-ledger.jsonl'), 'utf8'), before, 'sổ ảnh không đổi');
});

test('images: agy báo xong mà không có ảnh => mã 8 và nói rõ', () => {
  const r = runGemini('images', { stubMode: 'noimage' });
  assert.equal(r.status, 8);
  assert.match(r.stderr, /KHONG_RA_ANH/);
});

test('hết limit => mã 5 và đánh dấu tài khoản; lỗi đăng nhập => mã 6; clearLimit đưa về sẵn sàng', () => {
  const lim = runGemini('facts', { stubMode: 'limit' });
  assert.equal(lim.status, 5, lim.stderr);
  assert.match(lim.stderr, /LIMIT:/);
  assert.equal(acct().status, 'limited');
  assert.equal(runGemini('facts').status, 3, 'đang hết limit thì không có tài khoản dùng được');
  P.clearLimit('gemini/main');
  G.clearModelLimit('claude-opus-4-6-thinking'); // lượt trên đã thử cả hai mô hình và ghi nhớ Opus hết hạn mức
  const auth = runGemini('facts', { stubMode: 'auth' });
  assert.equal(auth.status, 6, auth.stderr);
  assert.equal(acct().status, 'auth_error');
  P.clearLimit('gemini/main');
  assert.equal(acct().status, 'ready');
});

test('Opus hết hạn mức => CÙNG lượt chạy lại bằng Gemini 3.8 Flash (High), ghế KHÔNG bị đánh dấu hết limit; lượt sau đi thẳng sang dự phòng; hết hạn thì thử lại Opus', () => {
  const OPUS = 'claude-opus-4-6-thinking';
  const FLASH = 'gemini-3.8-flash-high';
  const modelsOf = (from) => calls().slice(from).map((c) => c.args[c.args.indexOf('--model') + 1]);
  const env = { STUB_AGY_LIMIT_MODELS: OPUS };
  let n = calls().length;
  const r = runGemini('facts', { env });
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(modelsOf(n), [OPUS, FLASH], 'thử Opus, hết hạn mức thì chạy lại ngay bằng Flash');
  assert.match(r.stdout, /MÔ HÌNH DỰ PHÒNG: claude-opus-4-6-thinking đang hết hạn mức/);
  assert.match(r.stdout, /lượt này chạy bằng gemini-3\.8-flash-high/);
  assert.equal(acct().status, 'ready', 'Flash chạy được thì ghế không bị đánh dấu hết limit');
  assert.ok(G.readModelLimits()[OPUS], 'nhớ Opus hết hạn mức');
  assert.ok(S.recentEvents(20).some((e) => /mô hình claude-opus-4-6-thinking hết hạn mức .*chạy bằng gemini-3\.8-flash-high/.test(e.message)));
  // lượt sau: không tốn một lượt thử Opus nữa
  n = calls().length;
  const r2 = runGemini('facts', { env });
  assert.equal(r2.status, 0, r2.stderr);
  assert.deepEqual(modelsOf(n), [FLASH]);
  assert.match(r2.stdout, /MÔ HÌNH DỰ PHÒNG/);
  // chế độ images: vẫn chép ảnh, ghi mô hình THẬT đã dùng vào sổ nguồn, và vẫn có ghi chú dự phòng
  const ri = runGemini('images', { env });
  assert.equal(ri.status, 0, ri.stderr);
  assert.match(ri.stdout, /MÔ HÌNH DỰ PHÒNG/);
  assert.match(ri.stdout, /ẢNH ĐÃ CHÉP \(1\)/);
  const rec = JSON.parse(fs.readFileSync(path.join(topicDir, 'assets', 'gen', 'gen-ledger.jsonl'), 'utf8').trim().split('\n').pop());
  assert.equal(rec.agy_model_flag, FLASH);
  // tới giờ hồi (xoá khỏi sổ): lại thử Opus và chạy bình thường, không còn ghi chú dự phòng
  G.clearModelLimit(OPUS);
  n = calls().length;
  const r3 = runGemini('facts');
  assert.equal(r3.status, 0, r3.stderr);
  assert.deepEqual(modelsOf(n), [OPUS]);
  assert.doesNotMatch(r3.stdout, /MÔ HÌNH DỰ PHÒNG/);
});

test('cả hai mô hình đều hết hạn mức => mã 5, đánh dấu ghế hết limit; tắt dự phòng thì Opus hết là hết', () => {
  const OPUS = 'claude-opus-4-6-thinking';
  const FLASH = 'gemini-3.8-flash-high';
  let n = calls().length;
  const both = runGemini('facts', { env: { STUB_AGY_LIMIT_MODELS: `${OPUS},${FLASH}` } });
  assert.equal(both.status, 5, both.stderr);
  assert.match(both.stderr, /LIMIT: .*đã thử claude-opus-4-6-thinking → gemini-3\.8-flash-high, đều hết hạn mức/);
  assert.equal(calls().slice(n).length, 2);
  assert.equal(acct().status, 'limited');
  P.clearLimit('gemini/main');
  G.clearModelLimit(OPUS);
  n = calls().length;
  const off = runGemini('facts', { env: { STUB_AGY_LIMIT_MODELS: OPUS, STUDIO_GEMINI_FALLBACK_MODEL: 'none' } });
  assert.equal(off.status, 5, off.stderr);
  assert.equal(calls().slice(n).length, 1, 'không có dự phòng thì chỉ thử một mô hình');
  assert.equal(acct().status, 'limited');
  P.clearLimit('gemini/main');
  G.clearModelLimit(OPUS);
  G.clearModelLimit(FLASH);
  assert.equal(acct().status, 'ready');
});

test('đang có lượt khác giữ khoá => BUSY mã 2, và tài khoản tắt => NO_ACCOUNT mã 3', () => {
  const lock = path.join(path.dirname(process.env.STUDIO_DB), 'gemini-run.lock');
  fs.writeFileSync(lock, JSON.stringify({ pid: process.pid, at: Date.now() }));
  try {
    const busy = runGemini('facts', { env: { STUDIO_GEMINI_LOCK_WAIT_MS: '400' } });
    assert.equal(busy.status, 2, busy.stderr);
    assert.match(busy.stderr, /BUSY:/);
  } finally {
    fs.unlinkSync(lock);
  }
  P.setAccountEnabled('gemini/main', false);
  try {
    assert.equal(runGemini('facts').status, 3);
  } finally {
    P.setAccountEnabled('gemini/main', true);
  }
});

test('bận thì XẾP HÀNG chờ rồi chạy tiếp khi lượt kia nhả khoá (hai đội chạy song song không bị mất phần Gemini)', async () => {
  const lock = path.join(path.dirname(process.env.STUDIO_DB), 'gemini-run.lock');
  fs.writeFileSync(lock, JSON.stringify({ pid: process.pid, at: Date.now() }));
  const t0 = Date.now();
  const child = spawn(process.execPath, ['--disable-warning=ExperimentalWarning', runScript, 'facts', promptFile, topicDir], { env: { ...process.env, STUDIO_AGY_JS: stub, STUB_AGY_MODE: 'ok', STUDIO_GEMINI_LOCK_WAIT_MS: '15000' } });
  let err = '';
  child.stderr.on('data', (d) => (err += d));
  await new Promise((r) => setTimeout(r, 1200)); // lượt kia vẫn đang giữ khoá
  assert.equal(child.exitCode, null, 'vẫn đang chờ, chưa bỏ cuộc');
  fs.unlinkSync(lock); // lượt kia xong, nhả khoá
  const code = await new Promise((r) => child.on('close', r));
  assert.equal(code, 0, err);
  assert.ok(Date.now() - t0 >= 1200, 'đã chờ thật');
});

test('từ chối thư mục ngoài content/, mode lạ và lời nhắc quá dài', () => {
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'ngoai-'));
  const r = runGemini('images', { dir: outside });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /TU_CHOI/);
  assert.equal(runGemini('lung-tung').status, 1);
  const big = path.join(topicDir, 'review', 'qua-dai.md');
  fs.writeFileSync(big, 'x'.repeat(30_000));
  const rr = spawnSync(process.execPath, ['--disable-warning=ExperimentalWarning', runScript, 'facts', big, topicDir], { encoding: 'utf8', env: { ...process.env, STUDIO_AGY_JS: stub } });
  assert.equal(rr.status, 1);
  assert.match(rr.stderr, /LOI_PROMPT/);
});
