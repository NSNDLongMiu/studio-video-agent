import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { evaluate, isGuardedGitCommand } from '../../tools/hooks/guard-commit.mjs';

const hookPath = fileURLToPath(new URL('../../tools/hooks/guard-commit.mjs', import.meta.url));
const guardedInput = { tool_name: 'Bash', command: 'git add . && git commit -m "x"' };

test('guard-commit: nhận diện commit và push trong lệnh Bash và PowerShell', () => {
  const commands = [
    'git commit -m "x"',
    'git commit --amend',
    'git commit -am "x"',
    'git push',
    'git push origin main',
    'git push --force-with-lease origin main',
    'git add . && git commit -m "x"',
    'cd x; git push',
    'git -C "D:/a b" commit -m x',
    'git -c user.name=a commit -m x',
    'git --no-pager push',
    'echo ok | git commit -F -',
    'git -c \'user.name=Tên mẫu\' --no-pager -C "D:/a b" push',
    'git --git-dir="D:/a b/.git" --work-tree "D:/a b" commit',
    'git status\n(git push)',
    'git status || git \\\n  push',
    'echo "git commit"',
    'git.exe commit -m x',
    '& git push',
    'git add .; git commit -m x',
    String.raw`& "C:\Program Files\Git\cmd\git.exe" push`,
    '"C:/Program Files/Git/bin/git.exe" -C "D:/a b" commit',
    '/usr/bin/git commit -m x',
    'GIT.EXE push',
    String.raw`.\git.exe push`,
  ];
  for (const command of commands) assert.equal(isGuardedGitCommand(command), true, command);
});

test('guard-commit: bỏ qua lệnh khác và tên lệnh chỉ trùng tiền tố', () => {
  const commands = [
    'git status',
    'git log --grep commit',
    'git diff --stat',
    'git commit-tree abc',
    'git commit-graph write',
    'git push-all',
    'npm run commit',
    'echo "đã xong"',
    'git -C commit status',
    'git -c "user.name=push" log',
    'git --git-dir push status',
    'git --version push',
    'legit commit',
    'git push"-all"',
    'legit.exe commit',
    'mygit commit',
    'git.exe status',
    'git.exe log --grep push',
    'git.exec push',
    String.raw`& "C:\Program Files\Git\cmd\legit.exe" push`,
    '',
  ];
  for (const command of commands) assert.equal(isGuardedGitCommand(command), false, command);
});

test('guard-commit: scan sạch thì cho qua và giữ im lặng', () => {
  assert.deepEqual(evaluate(guardedInput, () => ({ status: 0, output: 'SẠCH\n' })), { block: false, message: '' });
});

test('guard-commit: scan có phát hiện thì chặn và giữ nguyên đầu ra', () => {
  const output = '⚠ tệp-mẫu.txt:1 — email\r\nCó 1 điều cần xem.\n';
  const result = evaluate(guardedInput, () => ({ status: 1, output }));
  assert.equal(result.block, true);
  assert.equal(result.message, 'CHẶN git commit/push: tools/scan-public.mjs báo có điều cần xem (luật 5 trong CLAUDE.md). Xử lý rồi chạy lại.\n' + output);
});

test('guard-commit: chặn khi scan lỗi, quá hạn hoặc thiếu mã thoát', () => {
  const errors = [
    [{ status: 2, output: 'Lỗi git giả lập' }, 'Lỗi git giả lập'],
    [{ status: null, output: '', error: 'quét quá thời gian 60 giây' }, 'quét quá thời gian 60 giây'],
    [{ status: null, output: '' }, 'không trả mã thoát'],
    [{ status: 0, output: '', error: 'lỗi khởi chạy' }, 'lỗi khởi chạy'],
  ];
  for (const [scan, reason] of errors) {
    const result = evaluate(guardedInput, () => scan);
    assert.equal(result.block, true);
    assert.match(result.message, /không quét được/);
    assert.ok(result.message.includes(reason), result.message);
  }

  const result = evaluate(guardedInput, () => { throw new Error('lỗi bộ quét'); });
  assert.equal(result.block, true);
  assert.match(result.message, /không quét được.*lỗi bộ quét/);
});

test('guard-commit: chỉ gọi scan cho commit hoặc push từ Bash và PowerShell', () => {
  let calls = 0;
  const runScan = () => {
    calls++;
    return { status: 1, output: 'Có điều cần xem' };
  };
  const otherInputs = [
    { tool_name: 'Read', command: 'git push' },
    { tool_name: 'Edit', command: 'git push' },
    { tool_name: 'Write', command: 'git push' },
    { tool_name: 'Bash', command: 'git status' },
    { tool_name: 'PowerShell', command: 'git.exe status' },
  ];
  for (const input of otherInputs) {
    assert.deepEqual(evaluate(input, runScan), { block: false, message: '' });
  }
  assert.equal(calls, 0);

  for (const input of [guardedInput, { tool_name: 'PowerShell', command: 'git push' }]) {
    calls = 0;
    assert.equal(evaluate(input, runScan).block, true);
    assert.equal(calls, 1);
  }
});

test('guard-commit: chỉ giữ 4000 ký tự đầu của đầu ra scan', () => {
  const output = 'ấ'.repeat(4000) + 'phần bị cắt';
  const { message } = evaluate(guardedInput, () => ({ status: 1, output }));
  assert.equal(message.slice(message.indexOf('\n') + 1), output.slice(0, 4000));
});

test('guard-commit CLI: git status thoát 0 và không in gì', () => {
  const result = spawnSync(process.execPath, [hookPath], {
    input: JSON.stringify({ tool_name: 'Bash', tool_input: { command: 'git status' } }),
    encoding: 'utf8',
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, '');
});

test('guard-commit CLI: JSON hỏng thoát 0 và cảnh báo một dòng', () => {
  const result = spawnSync(process.execPath, [hookPath], { input: 'không phải json', encoding: 'utf8' });
  assert.ifError(result.error);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /^Cảnh báo[^\r\n]*\n$/);
});
