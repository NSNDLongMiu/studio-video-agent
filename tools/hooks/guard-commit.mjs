// Cách dùng: node tools/hooks/guard-commit.mjs (đọc JSON PreToolUse từ stdin). Mã thoát 0 = cho qua, 2 = chặn.
// Dán cấu hình này vào .claude/settings.json:
// {"hooks":{"PreToolUse":[{"matcher":"Bash|PowerShell","hooks":[{"type":"command","command":"node \"$CLAUDE_PROJECT_DIR/tools/hooks/guard-commit.mjs\""}]}]}}
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SHELL_TOOLS = new Set(['Bash', 'PowerShell']);
const OPTIONS_WITH_VALUE = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace', '--config-env']);
const DISPLAY_OPTIONS = new Set(['-h', '--help', '-v', '--version', '--exec-path', '--html-path', '--man-path', '--info-path']);
const SCAN_TIMEOUT_MS = 60_000;
const SCAN_OUTPUT_LIMIT = 4000;
const SCAN_FINDINGS = 'CHẶN git commit/push: tools/scan-public.mjs báo có điều cần xem (luật 5 trong CLAUDE.md). Xử lý rồi chạy lại.';

function gitSubcommand(command, offset) {
  // Tách đối số liền sau git, giữ nguyên khoảng trắng bên trong dấu nháy.
  const word = /[ \t]+((?:'[^']*'|"(?:[^"\\]|\\[\s\S])*"|\\[^\r\n]|[^\s;&|()<>'"`\\])+)/y;
  word.lastIndex = offset;
  for (let match = word.exec(command); match; match = word.exec(command)) {
    const arg = match[1].replace(/'([^']*)'|"((?:[^"\\]|\\[\s\S])*)"|\\(.)/g,
      (_, singleQuoted, doubleQuoted, escaped) => singleQuoted ?? doubleQuoted?.replace(/\\(["\\$`])/g, '$1') ?? escaped);
    if (DISPLAY_OPTIONS.has(arg)) return null;
    if (!arg.startsWith('-')) return arg;
    if (OPTIONS_WITH_VALUE.has(arg) && !word.exec(command)) break;
  }
  return null;
}

export function isGuardedGitCommand(command) {
  if (typeof command !== 'string') return false;
  const joined = command.replace(/\\\r?\n/g, '');
  // Nhận git hoặc git.exe ở cuối đường dẫn, kể cả đường dẫn có dấu nháy và khoảng trắng.
  // Chấp nhận khớp dư khi văn bản chứa mẫu lệnh, ví dụ echo "git commit".
  const executable = /(?:^|[\s;&|()<>'"`])(?:(?:[^\s;&|()<>'"`]*[\\/])?git(?:\.exe)?|'(?:[^'\r\n]*[\\/])?git(?:\.exe)?'|"(?:[^"\r\n]*[\\/])?git(?:\.exe)?")(?=[ \t])/gi;
  for (const git of joined.matchAll(executable)) {
    const subcommand = gitSubcommand(joined, git.index + git[0].length);
    if (subcommand === 'commit' || subcommand === 'push') return true;
  }
  return false;
}

export function evaluate({ tool_name, command }, runScan) {
  if (!SHELL_TOOLS.has(tool_name) || !isGuardedGitCommand(command)) return { block: false, message: '' };

  let result;
  try {
    result = runScan();
  } catch (error) {
    result = { status: null, output: '', error: error?.message ?? String(error) };
  }

  const { status, output, error } = result;
  if (!error && status === 0) return { block: false, message: '' };
  const details = output ? `\n${output.slice(0, SCAN_OUTPUT_LIMIT)}` : '';
  if (!error && status === 1) return { block: true, message: SCAN_FINDINGS + details };

  const reason = error || (status === null ? 'tiến trình quét kết thúc mà không trả mã thoát' : `bộ quét trả mã thoát ${status}`);
  return { block: true, message: `CHẶN git commit/push: không quét được bằng tools/scan-public.mjs (${reason}).${details}` };
}

const hookPath = fileURLToPath(import.meta.url);

function runPublicScan() {
  const root = path.resolve(path.dirname(hookPath), '..', '..');
  // Quét toàn bộ vì git add trong cùng chuỗi lệnh chưa chạy khi hook được gọi.
  const result = spawnSync(process.execPath, [path.join(root, 'tools', 'scan-public.mjs')], {
    cwd: root,
    encoding: 'utf8',
    timeout: SCAN_TIMEOUT_MS,
  });
  const error = result.error?.code === 'ETIMEDOUT' ? 'quét quá thời gian 60 giây' : result.error?.message;
  return {
    status: result.status,
    output: (result.stdout ?? '') + (result.stderr ?? ''),
    error: error ?? (result.signal ? `tiến trình quét bị dừng bởi tín hiệu ${result.signal}` : undefined),
  };
}

function main() {
  let input;
  try {
    input = JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch {
    process.stderr.write('Cảnh báo guard-commit: stdin không đọc được, rỗng hoặc không chứa JSON hợp lệ.\n');
    return;
  }

  const { block, message } = evaluate({ tool_name: input?.tool_name, command: input?.tool_input?.command }, runPublicScan);
  if (block) {
    process.stderr.write(message.endsWith('\n') ? message : `${message}\n`);
    process.exitCode = 2;
  }
}

if (process.argv[1] && hookPath === path.resolve(process.argv[1])) main();
