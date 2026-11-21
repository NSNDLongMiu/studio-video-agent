// node tools/voice/pronounce.mjs <apply|check|terms|list|init-extra> [tùy chọn]
// So khớp không phân biệt hoa/thường, ưu tiên cụm dài và xét cả chữ có dấu, dấu kết hợp, số và _ ở ranh giới từ.
// check thoát mã 1 khi còn ứng viên ngoài từ điển để Producer rà lại trước khi sinh audio.
import fs from 'node:fs';
import { parseArgs } from 'node:util';

const USAGE = [
  'Cách dùng: node tools/voice/pronounce.mjs <lệnh> [--dict <tệp.json>] [--json]',
  '  apply --text "<câu>" hoặc apply --file <tệp UTF-8>  In bản đưa vào TTS.',
  '  check --file <kịch bản hoặc văn bản UTF-8>         Báo thuật ngữ và ứng viên còn thiếu.',
  '  terms --file <kịch bản hoặc văn bản UTF-8>         Liệt kê thuật ngữ để tạo clip nghe kiểm.',
  '  list                                              In toàn bộ từ điển.',
  '  --extra <tệp.json>                                Nạp từ điển riêng cho apply, check, terms hoặc list.',
  '  init-extra --out <tệp.json> [--term "<thuật ngữ>" ...] [--force]  Tạo khung từ điển riêng.',
  '  --column "Lời đọc"                                 Chỉ lấy cột Markdown trong tệp cho apply, check hoặc terms.',
  '  --ignore "a,b,c"                                  Bỏ qua ứng viên của lần chạy check này.',
].join('\n');
const DEFAULT_DICT = new URL('./pronunciation.json', import.meta.url);
const WORD = '[\\p{L}\\p{M}\\p{N}_]';
const KINDS = new Set(['letters', 'word', 'mixed']);
const key = (name) => name.trim().replace(/[ \t]+/g, ' ').toUpperCase().toLowerCase();
const escapeRegex = (name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const read = (file) => fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
const json = (value) => console.log(JSON.stringify(value, null, 2));
const nonempty = (value) => typeof value === 'string' && value.trim() !== '';

function loadDictionary(file, source) {
  const { entries, ignore = [] } = JSON.parse(read(file)) ?? {};
  if (!Array.isArray(entries) || !Array.isArray(ignore) || !ignore.every(nonempty)) {
    throw new Error('Từ điển cần mảng entries và ignore phải là mảng chuỗi nếu có.');
  }
  const names = new Map();
  const items = entries.map((entry) => {
    const { term, aliases = [], kind, tts, verified = false } = entry ?? {};
    if (!nonempty(term) || !nonempty(tts) || !KINDS.has(kind) ||
        typeof verified !== 'boolean' || !Array.isArray(aliases) || !aliases.every(nonempty)) {
      throw new Error('Mục từ điển không hợp lệ: ' + (term ?? '(thiếu term)'));
    }
    const item = { term, kind, tts, verified, source };
    for (const name of [term, ...aliases]) {
      const normalized = key(name);
      if (names.has(normalized) && names.get(normalized) !== item) {
        throw new Error('Trùng thuật ngữ hoặc alias: ' + name);
      }
      names.set(normalized, item);
    }
    return item;
  });
  return { entries: items, names, ignore: new Set(ignore.map(key)) };
}

function mergeExtra(common, file) {
  let local;
  try {
    local = loadDictionary(file, 'riêng');
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error('Không tìm thấy tệp từ điển riêng: ' + file);
    const reason = error instanceof SyntaxError ? 'JSON rỗng hoặc sai cú pháp.' : error.message;
    throw new Error('Không nạp được từ điển riêng ' + file + ': ' + reason);
  }

  const overridden = new Set();
  for (const name of local.names.keys()) {
    const item = common.names.get(name);
    if (item) overridden.add(item);
  }
  for (const { term } of overridden) console.error('Cảnh báo: từ điển riêng ghi đè ' + term);

  const remainingNames = [...common.names].filter(([, item]) => !overridden.has(item));
  return {
    entries: [...common.entries.filter((item) => !overridden.has(item)), ...local.entries],
    names: new Map([...remainingNames, ...local.names]),
    ignore: new Set([...common.ignore, ...local.ignore]),
  };
}

function makeDictionary(file, extra) {
  const common = loadDictionary(file, 'chung');
  const dictionary = extra === undefined ? common : mergeExtra(common, extra);
  const { names } = dictionary;
  const alternatives = [...names.keys()]
    .sort((a, b) => b.length - a.length)
    .map((name) => escapeRegex(name).replaceAll(' ', '[ \\t]+'));
  const pattern = alternatives.length
    ? new RegExp('(?<!' + WORD + ')(?:' + alternatives.join('|') + ')(?!' + WORD + ')', 'giu')
    : /(?!)/gu;
  return { ...dictionary, pattern };
}

function apply(text, { names, pattern }) {
  return text.replace(pattern, (original, offset) => {
    const item = names.get(key(original));
    if (!item) return original;
    // Viết hoa âm đầu nếu bản gốc viết hoa ở đầu dòng hoặc sau dấu kết câu.
    // Giữa câu giữ nguyên kiểu chữ đã cấu hình trong tts, kể cả khi bản gốc viết in hoa.
    const lineStart = offset === 0 ? 0 : text.lastIndexOf('\n', offset - 1) + 1;
    const prefix = text.slice(lineStart, offset);
    if (/^\p{Lu}/u.test(original) && /(?:^|[.!?…\r])[\t "'“‘(\[{«]*$/u.test(prefix)) {
      return item.tts.replace(/^\p{L}/u, (letter) => letter.toUpperCase());
    }
    return item.tts;
  });
}

const tableDivider = /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)*\|?\s*$/;
const pathColumn = /^(?:đường dẫn(?: tệp)?|tệp\s*\/\s*đường dẫn|(?:file )?paths?)$/iu;
const url = /(?:[a-z][a-z\d+.-]*:\/\/|www\.)[^\s<>"'\x60)\]}|]+/giu;
const filePath = /(?<![\p{L}\p{M}\p{N}_])(?:(?:[a-z]:[\\/]|\.{1,2}[\\/])[\w./\\-]+|(?:[\w-]+[\\/])*[\w.-]+\.(?:md|txt|json|srt|wav|mp3|mp4|mjs|js|py|yml|yaml|csv|png|jpg|ass|html))(?![\p{L}\p{M}\p{N}_])/giu;

function markdownLines(text, { skipPathTables = false } = {}) {
  const lines = text.split(/\r\n?|\n/);
  let start = 0;
  if (/^---[ \t]*$/.test(lines[0])) {
    const end = lines.findIndex((line, index) => index > 0 && /^(?:---|\.\.\.)[ \t]*$/.test(line));
    if (end !== -1) start = end + 1;
  }
  const visible = [];
  let fence = '';
  for (let index = start; index < lines.length; index++) {
    const line = lines[index];
    const marker = /^\s*(\x60{3,}|~{3,})(.*)$/.exec(line);
    if (fence) {
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length &&
          !marker[2].trim()) fence = '';
      if (!skipPathTables) visible.push('');
    } else if (marker) {
      fence = marker[1];
      if (!skipPathTables) visible.push('');
    } else if (skipPathTables && line.includes('|') && tableDivider.test(lines[index + 1] ?? '') &&
        line.split('|').some((cell) => pathColumn.test(cell.replace(/[*_\x60]/g, '').trim()))) {
      index++; // Bỏ dòng phân cách và các hàng ngay dưới tiêu đề bảng đường dẫn.
      while (lines[index + 1]?.includes('|')) index++;
    } else {
      visible.push(line);
    }
  }
  return visible;
}

function scannableText(text) {
  return markdownLines(text, { skipPathTables: true }).map((line) => line
    .replace(/\]\([^\r\n)]*\)/g, ']\n')
    .replace(url, '\n')
    .replace(filePath, '\n')
    .replace(/(^|[^\p{L}\p{M}\p{N}_])(_{1,3})(?=\S)(.+?)\2(?![\p{L}\p{M}\p{N}_])/gu, '$1$3'))
    .join('\n');
}

const inlineMarkdown = new RegExp([
  /(?<!`)(?<ticks>`+)(?!`)(?<code>.+?)(?<!`)\k<ticks>(?!`)/.source,
  /\[(?<link>[^\]]+)\]\((?:\\.|[^()\\]|\([^()]*\))*\)/.source,
  /(?<!\*)(?<stars>\*{1,3})(?!\*)(?=\S)(?<starred>.+?)(?<=\S)\k<stars>(?!\*)/.source,
  /(?<![\p{L}\p{M}\p{N}_])(?<underscores>_{1,3})(?!_)(?=\S)(?<underlined>.+?)(?<=\S)\k<underscores>(?![\p{L}\p{M}\p{N}_])/.source,
].join('|'), 'gu');

function plainMarkdown(text) {
  return text.replace(inlineMarkdown, (...match) => {
    const { code, link, starred, underlined } = match.at(-1);
    return code ?? plainMarkdown(link ?? starred ?? underlined);
  });
}

function tableRow(line) {
  const cells = [''];
  for (const [part] of line.trim().matchAll(/\\.|[^|\\]+|[|\\]/g)) {
    if (part === '|') cells.push('');
    else cells[cells.length - 1] += part === '\\|' ? '|' : part;
  }
  const hasPipe = cells.length > 1;
  if (hasPipe && cells[0] === '') cells.shift();
  if (hasPipe && cells.at(-1) === '') cells.pop();
  return { cells: cells.map((cell) => cell.trim()), hasPipe };
}

function extractColumn(input, column) {
  const lines = markdownLines(input);
  const name = key(column);
  const records = [];
  let matched = false;
  let row = 0;
  for (let index = 0; index + 1 < lines.length; index++) {
    const header = tableRow(lines[index]);
    const divider = tableRow(lines[index + 1]);
    if ((!header.hasPipe && !divider.hasPipe) || header.cells.length !== divider.cells.length ||
        !divider.cells.length || !divider.cells.every((cell) => /^:?-+:?$/.test(cell))) continue;

    const columnIndex = header.cells.findIndex((cell) => key(plainMarkdown(cell)).includes(name));
    if (columnIndex === -1) continue;
    matched = true;
    index++;
    while (lines[index + 1]?.trim()) {
      const { cells, hasPipe } = tableRow(lines[index + 1]);
      if (!hasPipe && (header.cells.length > 1 || /^\s*(?:[#>]|(?:[-+*]|\d+[.)])\s)/.test(cells[0]))) break;
      index++;
      row++;
      for (const part of (cells[columnIndex] ?? '').split(/<br\s*\/?>/i)) {
        const prefix = /^\s*\*\*(.+?):\*\*/.exec(part);
        const text = plainMarkdown(part.slice(prefix?.[0].length ?? 0)).trim();
        if (text) records.push({ row, label: prefix ? plainMarkdown(prefix[1]).trim() : '', text });
      }
    }
  }
  if (!matched) throw new Error('Không tìm thấy cột Markdown: ' + column);
  return records;
}

function unknownReason(token, ignore) {
  if (!/^[a-z\d]+$/i.test(token) || !/[a-z]/i.test(token)) return '';
  if (/\d/.test(token)) return 'token Latin có chữ số';
  if (/^[A-Z]{2,}$/.test(token)) return 'token Latin in hoa';
  if (/[a-z][A-Z]|[A-Z]{2}/.test(token)) return 'chữ hoa liền nhau hoặc CamelCase';
  // Một chữ hoa ở đầu từ có thể chỉ do vị trí đầu câu.
  if (token.length >= 3 && !ignore.has(key(token))) return 'từ Latin không dấu ngoài danh sách bỏ qua';
  return '';
}

function scan(visible, { names, pattern, ignore }, ignoredTokens) {
  const found = new Map();
  const unknown = new Map();
  const words = new RegExp(WORD + '+', 'gu');
  function scanUnknown(gap) {
    for (const token of gap.match(words) ?? []) {
      const normalized = key(token);
      if (ignoredTokens.has(normalized)) continue;
      const reason = unknownReason(token, ignore);
      if (!reason) continue;
      const existing = unknown.get(normalized);
      if (existing) existing.count++;
      else unknown.set(normalized, { token, count: 1, reason });
    }
  }

  let end = 0;
  for (const match of visible.matchAll(pattern)) {
    const item = names.get(key(match[0]));
    if (!item) continue;
    scanUnknown(visible.slice(end, match.index));
    const existing = found.get(item.term);
    if (existing) existing.count++;
    else found.set(item.term, { ...item, count: 1 });
    end = match.index + match[0].length;
  }
  scanUnknown(visible.slice(end));
  return { found: [...found.values()], unknown: [...unknown.values()] };
}

function termSlugs(entries) {
  const slugs = new Map();
  const used = new Set();
  for (const { term } of entries) {
    let base = term.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replaceAll('đ', 'd')
      .replace(/[^a-z0-9]+/g, '-').slice(0, 80).replace(/^-+|-+$/g, '') || 'term';
    if (/^(?:con|prn|aux|nul|com[0-9]|lpt[0-9])$/.test(base)) base = 'term-' + base;
    let slug = base;
    for (let suffix = 2; used.has(slug); suffix++) slug = base + '-' + suffix;
    used.add(slug);
    slugs.set(term, slug);
  }
  return slugs;
}

function initExtra(args) {
  const { values, tokens } = parseArgs({
    args,
    options: { out: { type: 'string' }, term: { type: 'string', multiple: true }, force: { type: 'boolean' } },
    tokens: true,
  });
  const { out, term: terms = [], force } = values;
  const singleOptions = tokens.map(({ name }) => name).filter((name) => name !== 'term');
  if (!nonempty(out) || !terms.every(nonempty) || new Set(singleOptions).size !== singleOptions.length) {
    throw new Error('Tham số không phù hợp với lệnh init-extra.');
  }
  if (new Set(terms.map(key)).size !== terms.length) throw new Error('Trùng thuật ngữ trong --term.');

  const dictionary = {
    _readme: 'Từ điển riêng của video. Giữ tts là chữ tiếng Anh gốc (không phiên âm kiểu Việt); chỉ sửa tts khi python tools/voice/phonemes.py báo lỗi (dùng chữ đánh vần tiếng Anh) và chỉ đặt verified thành true sau khi giám đốc nghe và xác nhận.',
    ignore: [],
    entries: terms.map((term) => ({
      term,
      aliases: [],
      kind: 'word',
      tts: term,
      alternates: [],
      verified: false,
      note: 'gợi ý chưa nghe kiểm — giám đốc nghe và chỉnh',
    })),
  };
  try {
    fs.writeFileSync(out, JSON.stringify(dictionary, null, 2) + '\n', { encoding: 'utf8', flag: force ? 'w' : 'wx' });
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error('Tệp từ điển riêng đã tồn tại. Dùng --force để ghi đè: ' + out);
    throw error;
  }
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'init-extra') return initExtra(args);
  if (!['apply', 'check', 'terms', 'list'].includes(command)) throw new Error('Lệnh không hợp lệ.');
  const { values, tokens } = parseArgs({
    args,
    options: {
      file: { type: 'string' }, text: { type: 'string' }, dict: { type: 'string' }, json: { type: 'boolean' },
      column: { type: 'string' }, ignore: { type: 'string' }, extra: { type: 'string' },
    },
    tokens: true,
  });
  if (new Set(tokens.map(({ name }) => name)).size !== tokens.length) {
    throw new Error('Mỗi tuỳ chọn chỉ được dùng một lần.');
  }
  const { file, text, dict, column, ignore, extra, json: asJson } = values;
  const hasFile = file !== undefined;
  const hasText = text !== undefined;
  if ((hasFile && !nonempty(file)) || (dict !== undefined && !nonempty(dict)) ||
      (extra !== undefined && !nonempty(extra)) ||
      (column !== undefined && (!hasFile || hasText || !nonempty(column))) ||
      (ignore !== undefined && command !== 'check') ||
      (command === 'apply' && hasFile === hasText) ||
      (['check', 'terms'].includes(command) && (!hasFile || hasText)) ||
      (command === 'list' && (hasFile || hasText))) {
    throw new Error('Tham số không phù hợp với lệnh.');
  }

  const dictionary = makeDictionary(dict ?? DEFAULT_DICT, extra);
  if (command === 'list') {
    if (asJson) json(dictionary.entries);
    else console.table(dictionary.entries);
    return;
  }

  const input = hasFile ? read(file) : text;
  const records = column === undefined ? null : extractColumn(input, column);
  if (command === 'apply') {
    const result = records ? records.map((record) => ({ ...record, tts: apply(record.text, dictionary) }))
      : apply(input, dictionary);
    if (asJson) json(result);
    else if (records) process.stdout.write(result.map(({ tts }) => tts + '\n').join(''));
    else process.stdout.write(result);
    return;
  }

  const visible = records ? records.map(({ text }) => text).join('\n') : scannableText(input);
  const ignoredTokens = new Set(ignore?.split(',').map(key));
  const result = scan(visible, dictionary, ignoredTokens);
  if (command === 'terms') {
    const slugs = termSlugs(dictionary.entries);
    json(result.found.map(({ term, kind, tts, verified, source }) => ({ term, slug: slugs.get(term), kind, tts, verified, source })));
    return;
  }

  json(result);
  const unverified = result.found.filter(({ verified }) => !verified).map(({ term }) => term);
  if (unverified.length) console.error('Cảnh báo: chưa nghe kiểm — ' + unverified.join(', '));
  process.exitCode = result.unknown.length ? 1 : 0;
}

try {
  main();
} catch (error) {
  console.error('Lỗi: ' + error.message);
  console.error(USAGE);
  process.exitCode = 2;
}
