// Quét trước khi commit/push (repo CÔNG KHAI): node tools/scan-public.mjs [--staged] [--root <thư-mục>]
// Tìm email thật, khoá/token và tệp nhạy cảm trong mọi tệp git sẽ nhận (đã theo dõi + tệp mới chưa bị .gitignore bỏ qua).
// --staged: chỉ quét các tệp đã `git add`. Thoát mã 0 = sạch, 1 = có điều cần xem, 2 = lỗi chạy.
// Không in giá trị bí mật: chỉ in vài ký tự đầu + độ dài. Email mẫu trong test: thêm vào ALLOW_EMAIL.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : null;
};
const ROOT = path.resolve(opt('--root') || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));

function git(...a) {
  const r = spawnSync('git', ['-C', ROOT, ...a], { maxBuffer: 512 * 1024 * 1024 });
  if (r.error || r.status !== 0) {
    console.error(`Lỗi chạy git ${a.join(' ')}: ${r.error?.message || r.stderr?.toString('utf8').trim()}`);
    process.exit(2);
  }
  return r.stdout.toString('utf8');
}
const list = (...a) => git(...a).split('\0').filter(Boolean);

const SKIP_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.bmp', '.ico', '.mov', '.mp4', '.webm', '.wav', '.mp3', '.ogg', '.woff', '.woff2', '.ttf', '.otf', '.zip', '.gz', '.pdf', '.db', '.sqlite']);
const SKIP_NAMES = new Set(['package-lock.json']);
const ALLOW_EMAIL = [/^a@b\.vn$/i, /^anh@x\.vn$/i, /@example\.(com|org|net)$/i, /@users\.noreply\.github\.com$/i, /^noreply@anthropic\.com$/i];

const SECRETS = [
  ['khoá kiểu sk-', /\bsk-[A-Za-z0-9_-]{20,}/g],
  ['token GitHub', /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}/g],
  ['khoá Google', /\bAIza[0-9A-Za-z_-]{30,}/g],
  ['token Slack', /\bxox[abprs]-[A-Za-z0-9-]{10,}/g],
  ['khoá AWS', /\bAKIA[0-9A-Z]{16}\b/g],
  ['khoá riêng PEM', /-----BEGIN [A-Z ]*PRIVATE KEY-----/g],
  ['JWT', /\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{10,}/g],
  ['Bearer', /\b[Bb]earer\s+[A-Za-z0-9._-]{20,}/g],
  ['gán bí mật dài', /\b(?:api[_-]?key|secret|password|passwd|access[_-]?token|refresh[_-]?token|auth[_-]?token|client[_-]?secret)\b["']?\s*[:=]\s*["']?[A-Za-z0-9/+_.=-]{20,}/gi],
];
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}\b/g;
const SENSITIVE_NAME = /(^|\/)(auth\.json|\.credentials\.json|\.claude\.json|\.env(\..*)?|id_rsa.*|.*\.pem|.*\.key|.*\.sqlite.*|.*\.db(-wal|-shm)?)$/i;
const SENSITIVE_DIR = /^(studio\/accounts|studio\/data)\//;

const mask = (s) => `${s.slice(0, 6)}…(${s.length} ký tự)`;
const maskEmail = (s) => {
  const [u, d] = s.split('@');
  return `${u.slice(0, 2)}***@${d}`;
};

function readText(rel) {
  const p = path.join(ROOT, rel);
  try {
    if (SKIP_EXT.has(path.extname(rel).toLowerCase()) || SKIP_NAMES.has(path.basename(rel))) return null;
    if (fs.statSync(p).size > 3_000_000) return null;
    const b = fs.readFileSync(p);
    if (b.subarray(0, 8000).includes(0)) return null;
    return b.toString('utf8');
  } catch {
    return null; // tệp đã bị xoá khỏi cây làm việc
  }
}

const files = flag('--staged')
  ? list('diff', '--cached', '--name-only', '-z', '--diff-filter=ACMR')
  : [...new Set([...list('ls-files', '-z'), ...list('ls-files', '-o', '--exclude-standard', '-z')])];

const issues = [];
let scanned = 0;
let skipped = 0;
for (const rel of files) {
  const norm = rel.replace(/\\/g, '/');
  if (SENSITIVE_NAME.test(norm) || SENSITIVE_DIR.test(norm)) issues.push({ file: norm, line: 0, kind: 'tệp nhạy cảm sẽ vào git', sample: '' });
  const text = readText(rel);
  if (text == null) {
    skipped++;
    continue;
  }
  scanned++;
  text.split('\n').forEach((line, i) => {
    for (const [kind, rx] of SECRETS) for (const m of line.matchAll(rx)) issues.push({ file: norm, line: i + 1, kind, sample: mask(m[0]) });
    for (const m of line.matchAll(EMAIL)) if (!ALLOW_EMAIL.some((a) => a.test(m[0]))) issues.push({ file: norm, line: i + 1, kind: 'email', sample: maskEmail(m[0]) });
  });
}

for (const i of issues.slice(0, 50)) console.log(`⚠ ${i.file}${i.line ? `:${i.line}` : ''} — ${i.kind}${i.sample ? `: ${i.sample}` : ''}`);
if (issues.length > 50) console.log(`… và ${issues.length - 50} mục nữa`);
console.log(`Đã quét ${scanned} tệp văn bản (bỏ ${skipped} tệp ảnh/video/nhị phân/quá lớn) trong ${files.length} tệp git sẽ nhận.`);
console.log(issues.length ? `CÓ ${issues.length} điều cần xem — xử lý trước khi commit/push.` : 'SẠCH: không thấy email, khoá hay tệp nhạy cảm.');
process.exit(issues.length ? 1 : 0);
