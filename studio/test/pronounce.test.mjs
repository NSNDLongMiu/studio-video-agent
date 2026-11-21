// Kiểm CLI chuẩn hoá văn bản đọc và tính toàn vẹn của từ điển mặc định.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const tool = fileURLToPath(new URL('../../tools/voice/pronounce.mjs', import.meta.url));
const dictionaryUrl = new URL('../../tools/voice/pronunciation.json', import.meta.url);
const dictionary = JSON.parse(fs.readFileSync(dictionaryUrl, 'utf8'));
const run = (...args) => spawnSync(process.execPath, [tool, ...args], { encoding: 'utf8', cwd: os.tmpdir() });

function fixture(t, name, text) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pronounce-'));
  const file = path.join(dir, name);
  if (text !== undefined) fs.writeFileSync(file, text, 'utf8');
  t.after(() => {
    if (fs.existsSync(file)) fs.unlinkSync(file);
    fs.rmdirSync(dir);
  });
  return file;
}

// Từ điển thử cơ chế `apply` (viết hoa đầu câu, cụm dài, bí danh): giá trị cố ý KHÁC chữ gốc nên kiểm được việc thay chữ.
// Không phải dữ liệu thật: từ điển thật giữ chữ tiếng Anh để VieNeu tự đọc âm Anh (xem test cuối tệp).
const mechanics = { entries: [
  { term: 'Database', kind: 'word', tts: 'đây-ta-bết' },
  { term: 'API', kind: 'letters', tts: 'ây pi ai' },
  { term: 'SQL', kind: 'letters', tts: 'ét kiu eo' },
  { term: 'SQL Server', kind: 'mixed', tts: 'ét kiu eo sơ-vờ' },
  { term: 'Primary key', kind: 'word', tts: 'prai-mơ-ri ki' },
  { term: 'Foreign key', kind: 'word', tts: 'pho-rần ki' },
  { term: 'Backend', aliases: ['back end'], kind: 'word', tts: 'béc-en' },
  { term: 'Frontend', aliases: ['front end'], kind: 'word', tts: 'phờ-rân-en' },
  { term: 'Query', kind: 'word', tts: 'kwi-ri' },
  { term: 'Index', kind: 'word', tts: 'in-đếch' },
  { term: 'CPU', kind: 'letters', tts: 'xi pi diu' },
] };
const mechanicsDict = (t) => fixture(t, 'cơ chế.json', JSON.stringify(mechanics));

const script = [
  '# Ghi chú FPS', '',
  '```md', '| Kỹ thuật | Lời đọc |', '| --- | --- |', '| LAYOUT | __ZEBRA8__ |', '```', '',
  '| Hình ảnh | **Lời đọc/phụ đề** | Âm thanh |', '| --- | :---: | --- |',
  '| CAMERA | **Lời 1 · 0–2 s:** Bảng dùng **[SQL](https://example.org/HiddenLink)**, `API`!<br>**CTA:** *Thử* _lại_ với `Query`?<br/>Ổn rồi. | LAPTOP |',
  '| ZOOM | | VOICE |',
  '| FRAME | Bảng `Index` \\| `API`. ZEBRA9, Yeti. | TRACK |', '',
  'Kỹ thuật | `Lời đọc`', '--- | ---:', 'KEYFRAME | Bảng dùng `CPU`.', '',
  '| Kỹ thuật | Ghi chú |', '| --- | --- |', '| SILENT | STATIC |',
].join('\r\n');

test('apply thay từ, chữ cái và cụm dài trước, có phân biệt cách viết hoa đầu câu', (t) => {
  const r = run('apply', '--dict', mechanicsDict(t), '--text', 'Database dùng API. “SQL SERVER” có Primary key và FOREIGN KEY! Backend, front end.');
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout, 'Đây-ta-bết dùng ây pi ai. “Ét kiu eo sơ-vờ” có prai-mơ-ri ki và pho-rần ki! Béc-en, phờ-rân-en.');
});

test('apply giữ nguyên dấu câu, chữ tiếng Việt liền kề và từ dài hơn', (t) => {
  const input = 'Bảng Database chạy Query và Index qua API. Ai dùng indexing, reindex, ỨngIndex, Indexơ, a\u0301Index, Index\u0301, my_Index; [Query]?!';
  const r = run('apply', '--dict', mechanicsDict(t), '--text', input);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout, 'Bảng đây-ta-bết chạy kwi-ri và in-đếch qua ây pi ai. Ai dùng indexing, reindex, ỨngIndex, Indexơ, a\u0301Index, Index\u0301, my_Index; [kwi-ri]?!');
});

test('apply đọc tệp UTF-8 và giữ xuống dòng, list xuất JSON khi có --json', (t) => {
  const file = fixture(t, 'lời đọc.txt', '\uFEFFIndex!\r\n  API, Query.\r\n');
  const r = run('apply', '--dict', mechanicsDict(t), '--file', file, '--json');
  assert.equal(r.status, 0, r.stderr);
  assert.equal(JSON.parse(r.stdout), 'In-đếch!\r\n  Ây pi ai, kwi-ri.\r\n');
  const list = run('list', '--json');
  assert.equal(list.status, 0, list.stderr);
  assert.deepEqual(JSON.parse(list.stdout), dictionary.entries.map(({ term, kind, tts, verified }) => ({
    term, kind, tts, verified, source: 'chung',
  })));
});

test('check báo thuật ngữ thiếu và bỏ qua front-matter, code, URL, bảng đường dẫn', (t) => {
  const file = fixture(t, 'kịch bản.md', [
    '\uFEFF---', 'title: MetadataZZ Database', '---',
    'API, OAuth2, oauth2, HTTP3, kubernetes; __Query__. Bảng này có video.',
    '```js', 'HIDDEN HTTP', '```', '~~~text', 'OTHER API', '~~~',
    'https://example.org/Docker/CPU?q=HiddenCode và [trang](../SecretLink/ID).',
    '| Tên | Đường dẫn |', '| --- | --- |', '| HiddenPath | tools/voice/URL.md |', '',
    '| File path |', '| --- |', '| HideThis |', '',
    '| Thuật ngữ | Ghi chú |', '| --- | --- |', '| API | SQL Server |',
  ].join('\r\n'));
  const r = run('check', '--file', file);
  assert.equal(r.status, 1, r.stderr);
  const { found, unknown } = JSON.parse(r.stdout);
  assert.deepEqual(found.map(({ term, count }) => [term, count]), [['API', 2], ['Query', 1], ['SQL Server', 1]]);
  assert.deepEqual(unknown.map(({ token, count }) => [token, count]), [['OAuth2', 2], ['HTTP3', 1], ['kubernetes', 1]]);
  assert.ok(unknown.every(({ reason }) => reason));
  assert.match(r.stderr, /chưa nghe kiểm.*API/);
});

test('check chỉ có thuật ngữ đã định nghĩa thì mã 0 dù vẫn cảnh báo chưa nghe kiểm', (t) => {
  const file = fixture(t, 'lời.txt', 'Bảng dùng CPU và api.');
  const r = run('check', '--file', file, '--json');
  assert.equal(r.status, 0, r.stderr);
  const { found, unknown } = JSON.parse(r.stdout);
  assert.deepEqual(unknown, []);
  assert.deepEqual(found[0], { term: 'CPU', kind: 'letters', tts: 'CPU', verified: false, source: 'chung', count: 1 });
  assert.match(r.stderr, /chưa nghe kiểm.*CPU/);
});

test('terms trả mỗi thuật ngữ một lần với slug ASCII', (t) => {
  const file = fixture(t, 'lời.md', 'Primary key, primary KEY, SQL Server, server, API API. OAuth2.');
  const r = run('terms', '--file', file);
  assert.equal(r.status, 0, r.stderr);
  const rows = JSON.parse(r.stdout);
  assert.deepEqual(rows.map(({ term, slug }) => [term, slug]), [
    ['Primary key', 'primary-key'], ['SQL Server', 'sql-server'], ['Server', 'server'], ['API', 'api'],
  ]);
  assert.ok(rows.every(({ slug, tts, verified }) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && tts && verified === false));
});

test('check --column chỉ quét lời đọc và --ignore bỏ ứng viên theo từng token', (t) => {
  const file = fixture(t, 'kịch bản.md', script);
  const args = ['check', '--file', file, '--column', 'lỜI ĐỌC'];
  const result = run(...args);
  assert.equal(result.status, 1, result.stderr);
  const { found, unknown } = JSON.parse(result.stdout);
  assert.deepEqual(found.map(({ term, count }) => [term, count]), [
    ['SQL', 1], ['API', 2], ['Query', 1], ['Index', 1], ['CPU', 1],
  ]);
  assert.deepEqual(unknown.map(({ token }) => token), ['ZEBRA9', 'Yeti']);

  const ignored = run(...args, '--ignore', ' zebra9 , YETI, SQL ');
  assert.equal(ignored.status, 0, ignored.stderr);
  assert.deepEqual(JSON.parse(ignored.stdout), { found, unknown: [] });
});

test('check --column trả mã 0 khi lời đọc không có ứng viên', (t) => {
  const file = fixture(t, 'kịch bản.md', script.replace(' ZEBRA9, Yeti.', ''));
  const result = run('check', '--file', file, '--column', 'Lời đọc');
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout).unknown, []);
});

test('apply --column tách dòng, lấy nhãn và giữ dấu câu qua nhiều bảng', (t) => {
  const file = fixture(t, 'kịch bản.md', script);
  const args = ['apply', '--dict', mechanicsDict(t), '--file', file, '--column', 'Lời đọc'];
  const result = run(...args, '--json');
  assert.equal(result.status, 0, result.stderr);
  const records = [
    { row: 1, label: 'Lời 1 · 0–2 s', text: 'Bảng dùng SQL, API!', tts: 'Bảng dùng ét kiu eo, ây pi ai!' },
    { row: 1, label: 'CTA', text: 'Thử lại với Query?', tts: 'Thử lại với kwi-ri?' },
    { row: 1, label: '', text: 'Ổn rồi.', tts: 'Ổn rồi.' },
    { row: 3, label: '', text: 'Bảng Index | API. ZEBRA9, Yeti.', tts: 'Bảng in-đếch | ây pi ai. ZEBRA9, Yeti.' },
    { row: 4, label: '', text: 'Bảng dùng CPU.', tts: 'Bảng dùng xi pi diu.' },
  ];
  assert.deepEqual(JSON.parse(result.stdout), records);
  const plain = run(...args);
  assert.equal(plain.status, 0, plain.stderr);
  assert.equal(plain.stdout, records.map(({ tts }) => tts + '\n').join(''));
});

test('terms --column chỉ liệt kê thuật ngữ trong lời đọc', (t) => {
  const file = fixture(t, 'kịch bản.md', script.replace('LAPTOP', 'Lock'));
  const result = run('terms', '--file', file, '--column', 'Lời đọc');
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout).map(({ term, slug }) => [term, slug]), [
    ['SQL', 'sql'], ['API', 'api'], ['Query', 'query'], ['Index', 'index'], ['CPU', 'cpu'],
  ]);
});

test('--column trả mã 2 khi không tìm thấy cột hoặc dùng chung với --text', (t) => {
  const file = fixture(t, 'kịch bản.md', script);
  for (const command of ['check', 'terms', 'apply']) {
    const result = run(command, '--file', file, '--column', 'Không tồn tại');
    assert.equal(result.status, 2, result.stderr);
    assert.match(result.stderr, /Không tìm thấy cột Markdown: Không tồn tại/u);
    const fromText = run(command, '--text', 'API', '--column', 'Lời đọc');
    assert.equal(fromText.status, 2, fromText.stderr);
  }
  assert.equal(run('apply', '--text', 'API', '--ignore', 'CTA').status, 2);
  assert.equal(run('terms', '--file', file, '--ignore', 'CTA').status, 2);
});

test('--dict ghi đè mặc định, slug tránh tên Windows dành riêng và trùng sau khi rút gọn', (t) => {
  const dict = fixture(t, 'từ điển.json', JSON.stringify({ entries: [
    { term: 'CON', kind: 'letters', tts: 'xi ô en' },
    { term: 'A+B', aliases: ['A plus B'], kind: 'mixed', tts: 'ây pờ-lớt bi' },
    { term: 'A B', kind: 'letters', tts: 'ây bi' },
  ] }));
  const file = fixture(t, 'lời.txt', 'CON, A+B, A plus B, A B.');
  const r = run('terms', '--dict', dict, '--file', file);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(JSON.parse(r.stdout).map(({ slug }) => slug), ['term-con', 'a-b', 'a-b-2']);
  const applied = run('apply', '--dict', dict, '--text', 'API, a plus b.');
  assert.equal(applied.status, 0, applied.stderr);
  assert.equal(applied.stdout, 'API, ây pờ-lớt bi.');
});

test('mã 2 và hướng dẫn tiếng Việt khi thiếu lệnh hoặc sai tham số', () => {
  for (const args of [[], ['invalid'], ['apply'], ['apply', '--text'], ['list', '--bad'],
    ['check', '--text', 'API'], ['apply', '--file', 'a.txt', '--text', 'API'],
    ['apply', '--text', 'API', '--text', 'CPU']]) {
    const r = run(...args);
    assert.equal(r.status, 2, args.join(' '));
    assert.match(r.stderr, /Cách dùng:/);
  }
});

test('--extra thêm cách đọc và nguồn cho apply, check, terms và list', (t) => {
  const local = JSON.stringify({ ignore: ['moc'], entries: [{ term: 'Yeti', kind: 'word', tts: 'dê-ti' }] });
  const extra = fixture(t, 'từ điển riêng.json', local);
  const file = fixture(t, 'lời đọc.txt', 'Bảng có Yeti, API, video và moc.');
  const base = run('check', '--file', file);
  assert.equal(base.status, 1, base.stderr);
  assert.deepEqual(JSON.parse(base.stdout).unknown.map(({ token }) => token), ['Yeti', 'moc']);

  const applied = run('apply', '--file', file, '--extra', extra);
  assert.equal(applied.status, 0, applied.stderr);
  assert.equal(applied.stdout, 'Bảng có dê-ti, API, video và moc.');

  const checked = run('check', '--file', file, '--extra', extra);
  assert.equal(checked.status, 0, checked.stderr);
  const { found, unknown } = JSON.parse(checked.stdout);
  assert.deepEqual(unknown, []);
  assert.deepEqual(found.map(({ term, source, verified }) => [term, source, verified]), [
    ['Yeti', 'riêng', false], ['API', 'chung', false],
  ]);
  assert.match(checked.stderr, /chưa nghe kiểm.*Yeti/u);

  const terms = run('terms', '--file', file, '--extra', extra);
  assert.equal(terms.status, 0, terms.stderr);
  assert.deepEqual(JSON.parse(terms.stdout)[0], {
    term: 'Yeti', slug: 'yeti', kind: 'word', tts: 'dê-ti', verified: false, source: 'riêng',
  });

  const list = run('list', '--extra', extra, '--json');
  assert.equal(list.status, 0, list.stderr);
  const rows = JSON.parse(list.stdout);
  assert.equal(rows.find(({ term }) => term === 'API').source, 'chung');
  assert.deepEqual(rows.find(({ term }) => term === 'Yeti'), {
    term: 'Yeti', kind: 'word', tts: 'dê-ti', verified: false, source: 'riêng',
  });
  const table = run('list', '--extra', extra);
  assert.equal(table.status, 0, table.stderr);
  assert.match(table.stdout, /source/u);
  assert.match(table.stdout, /Yeti[^\r\n]*riêng/u);
  assert.equal(fs.readFileSync(extra, 'utf8'), local);
});

test('--extra thay toàn bộ mục chung trùng term hoặc alias và cảnh báo trên stderr', (t) => {
  const dict = fixture(t, 'chung.json', JSON.stringify({ entries: [
    { term: 'API', aliases: ['API call'], kind: 'letters', tts: 'ây pi ai' },
    { term: 'Backend', aliases: ['back end'], kind: 'word', tts: 'béc-en' },
  ] }));
  const extra = fixture(t, 'riêng.json', JSON.stringify({ entries: [
    { term: 'api', aliases: ['api call'], kind: 'letters', tts: 'a pi i' },
    { term: 'OfficeBackend', aliases: ['BACK END'], kind: 'word', tts: 'hậu trường' },
  ] }));
  const args = ['--dict', dict, '--extra', extra];
  const result = run('apply', '--text', 'API, api call, back end, Backend.', ...args);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, 'A pi i, a pi i, hậu trường, Backend.');
  assert.deepEqual(result.stderr.trim().split(/\r?\n/), [
    'Cảnh báo: từ điển riêng ghi đè API', 'Cảnh báo: từ điển riêng ghi đè Backend',
  ]);

  const list = run('list', '--json', ...args);
  assert.equal(list.status, 0, list.stderr);
  assert.deepEqual(JSON.parse(list.stdout).map(({ term, source }) => [term, source]), [
    ['api', 'riêng'], ['OfficeBackend', 'riêng'],
  ]);
});

test('--extra trả mã 2 cho tệp thiếu, rỗng, sai JSON hoặc thiếu entries', (t) => {
  const options = [
    [fixture(t, 'thiếu.json'), /Không tìm thấy tệp từ điển riêng/u],
    [fixture(t, 'rỗng.json', ''), /JSON rỗng hoặc sai cú pháp/u],
    [fixture(t, 'sai.json', '{'), /JSON rỗng hoặc sai cú pháp/u],
    [fixture(t, 'thiếu entries.json', '{"ignore":[]}'), /Từ điển cần mảng entries/u],
  ];
  for (const [file, message] of options) {
    const result = run('list', '--json', '--extra', file);
    assert.equal(result.status, 2, result.stderr);
    assert.match(result.stderr, message);
    assert.equal(result.stdout, '');
  }
});

test('trùng term hoặc alias giữa hai mục trong cùng tệp vẫn là lỗi', (t) => {
  const file = fixture(t, 'trùng.json', JSON.stringify({ entries: [
    { term: 'Yeti', kind: 'word', tts: 'dê-ti' },
    { term: 'Other', aliases: ['YETI'], kind: 'word', tts: 'ơ-thờ' },
  ] }));
  for (const option of ['--dict', '--extra']) {
    const result = run('list', option, file);
    assert.equal(result.status, 2, result.stderr);
    assert.match(result.stderr, /Trùng thuật ngữ hoặc alias: YETI/u);
  }
});

test('init-extra tạo khung, giữ tệp sẵn có và chỉ ghi đè khi có --force', (t) => {
  const extra = fixture(t, 'từ điển riêng.json');
  const args = ['init-extra', '--out', extra];
  const initialized = run(...args);
  assert.equal(initialized.status, 0, initialized.stderr);
  const empty = fs.readFileSync(extra, 'utf8');
  const { _readme, ignore, entries } = JSON.parse(empty);
  assert.ok(typeof _readme === 'string' && _readme.trim());
  assert.deepEqual(ignore, []);
  assert.deepEqual(entries, []);
  const emptyList = run('list', '--extra', extra, '--json');
  assert.equal(emptyList.status, 0, emptyList.stderr);
  assert.deepEqual(JSON.parse(emptyList.stdout).map(({ term }) => term), dictionary.entries.map(({ term }) => term));

  const refused = run(...args, '--term', 'Pruning');
  assert.equal(refused.status, 2, refused.stderr);
  assert.match(refused.stderr, /đã tồn tại.*--force/u);
  assert.equal(fs.readFileSync(extra, 'utf8'), empty);

  const replaced = run(...args, '--force', '--term', 'Pruning', '--term', 'Metadata');
  assert.equal(replaced.status, 0, replaced.stderr);
  const generated = fs.readFileSync(extra, 'utf8');
  assert.deepEqual(JSON.parse(generated).entries, ['Pruning', 'Metadata'].map((term) => ({
    term, aliases: [], kind: 'word', tts: term, alternates: [], verified: false,
    note: 'gợi ý chưa nghe kiểm — giám đốc nghe và chỉnh',
  })));

  const file = fixture(t, 'lời.txt', 'Bảng có Pruning và Metadata.');
  const checked = run('check', '--file', file, '--extra', extra);
  assert.equal(checked.status, 0, checked.stderr);
  const { found, unknown } = JSON.parse(checked.stdout);
  assert.deepEqual(unknown, []);
  assert.deepEqual(found.map(({ term, verified, source }) => [term, verified, source]), [
    ['Pruning', false, 'riêng'], ['Metadata', false, 'riêng'],
  ]);
  assert.equal(fs.readFileSync(extra, 'utf8'), generated);
});

test('init-extra từ chối --term rỗng hoặc trùng trước khi tạo tệp', (t) => {
  const extra = fixture(t, 'khung.json');
  for (const terms of [['--term', '   '], ['--term', 'Pruning', '--term', 'pruning']]) {
    const result = run('init-extra', '--out', extra, ...terms);
    assert.equal(result.status, 2, result.stderr);
    assert.equal(fs.existsSync(extra), false);
  }
});

test('từ điển mặc định đủ trường, không trùng, giữ chữ tiếng Anh và giữ mọi mục chưa nghe kiểm', () => {
  const required = [
    'Database', 'Deadlock', 'Transaction', 'Query', 'Index', 'API', 'Backend', 'Frontend', 'SQL', 'Partition', 'Archive',
    'Server', 'Cache', 'Lock', 'Table', 'Row', 'Column', 'Primary key', 'Foreign key', 'JOIN', 'SELECT', 'INSERT',
    'UPDATE', 'DELETE', 'CPU', 'RAM', 'ID', 'UI', 'UX', 'HTTP', 'HTTPS', 'URL', 'JSON', 'IDE', 'Terminal', 'Log',
    'Dashboard', 'Token', 'Thread', 'Rollback', 'Commit', 'AI',
  ];
  const names = new Set();
  const byTerm = new Map();
  const nonempty = (value) => typeof value === 'string' && value.trim() !== '';
  assert.ok(Array.isArray(dictionary.ignore) && dictionary.ignore.every(nonempty));
  for (const entry of dictionary.entries) {
    const { term, aliases, kind, tts, alternates, verified, note } = entry;
    assert.ok(nonempty(term) && nonempty(tts), term);
    assert.ok(Array.isArray(aliases) && aliases.every((alias) => /^[a-z\d]+(?: [a-z\d]+)*$/i.test(alias)), term);
    assert.ok(Array.isArray(alternates) && alternates.every(nonempty), term);
    assert.ok(['letters', 'word', 'mixed'].includes(kind), term);
    assert.equal(typeof verified, 'boolean', term);
    assert.equal(verified, false, term);
    // Mục `lang: "vi"` là tên nền tảng theo luật chung 21/11/2026 (CLAUDE.md luật 10): đọc bằng tiếng Việt, không phải thuật ngữ tiếng Anh.
    if (entry.lang === 'vi') {
      assert.match(note, /Luật chung 21\/11\/2026.*CHƯA KIỂM — giám đốc nghe/u, term);
      byTerm.set(term, entry);
      continue;
    }
    assert.match(note, /Giữ chữ tiếng Anh.*CHƯA KIỂM — giám đốc nghe và chỉnh/u);
    // Giám đốc nghe T5 (19/11/2026): phiên âm kiểu Việt ("pa-ti-sần") bị đọc như tiếng Việt. Dữ liệu thật chỉ được
    // dùng chính tả tiếng Anh (chữ gốc hoặc chữ đánh vần tiếng Anh như "you eye"): ASCII, không gạch nối. Kiểm âm vị
    // thật bằng `python tools/voice/phonemes.py --check-dictionary` (xem phonemes.test.mjs).
    for (const reading of [tts, ...alternates]) {
      assert.match(reading, /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/u, `${term}: tts phải là chính tả tiếng Anh, không phiên âm Việt: ${reading}`);
    }
    for (const name of [term, ...aliases]) {
      const key = name.trim().replace(/\s+/g, ' ').toLowerCase();
      assert.ok(!names.has(key), 'Trùng thuật ngữ hoặc alias: ' + name);
      names.add(key);
    }
    byTerm.set(term, entry);
  }
  for (const term of required) assert.ok(byTerm.has(term), 'Thiếu ' + term);
  for (const term of ['Partition', 'Archive', 'Query', 'SQL']) assert.equal(byTerm.get(term).tts, term);
  assert.equal(byTerm.get('AI').tts, 'eigh eye');
  assert.notEqual(byTerm.get('Log').tts, byTerm.get('Lock').tts);
  // luật tên nền tảng (21/11/2026): dạng viết → dạng đọc
  const spoken = { 'phở bò': 'phở bò', ytb: 'y tê bê', 'zép lào': 'dép lào', 'tóp tóp': 'tóp tóp' };
  for (const [written, say] of Object.entries(spoken)) {
    assert.equal(byTerm.get(written)?.tts, say, written);
    assert.equal(byTerm.get(written).lang, 'vi', written);
  }
});
