// Kiểm công cụ xem âm vị: từ tiếng Anh phải ra âm tiếng Anh (không bị đọc theo âm Việt) và không đổi theo ngữ cảnh.
// Cần Python có VieNeu-TTS (vieneu_utils); thiếu thì bỏ qua, các kiểm tĩnh nằm ở pronounce.test.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const tool = fileURLToPath(new URL('../../tools/voice/phonemes.py', import.meta.url));
const dictionary = JSON.parse(fs.readFileSync(new URL('../../tools/voice/pronunciation.json', import.meta.url), 'utf8'));
const python = [['python'], ['py', '-3']].find(([exe, ...args]) =>
  spawnSync(exe, [...args, '-c', 'import vieneu_utils.phonemize_text'], { encoding: 'utf8' }).status === 0);
const skip = python ? false : 'Thiếu Python có VieNeu-TTS (pip install vieneu) nên bỏ qua kiểm âm vị.';
const run = (...args) => {
  const [exe, ...pre] = python;
  return spawnSync(exe, [...pre, tool, ...args], { encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
};

function fixture(t, name, text) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'phonemes-'));
  const file = path.join(dir, name);
  fs.writeFileSync(file, text, 'utf8');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return file;
}

test('--text in âm vị và từ tiếng Anh giữ nguyên chữ không mang dấu hiệu âm Việt', { skip }, () => {
  const r = run('--text', 'Partition chia các dòng theo một cột.', '--json');
  assert.equal(r.status, 0, r.stderr);
  const { phonemes } = JSON.parse(r.stdout).texts[0];
  const english = phonemes.split(' ')[0];
  assert.ok(english.includes('ʃ'), 'Partition phải ra âm tiếng Anh: ' + english);
  assert.ok(!/[1-7]/.test(english), 'Từ tiếng Anh không được có số thanh điệu: ' + english);
  assert.ok(/[1-7]/.test(phonemes), 'Phần tiếng Việt vẫn có thanh điệu: ' + phonemes);
});

test('từ điển mặc định: mọi mục đọc âm Anh và giữ nguyên trong câu tiếng Việt', { skip }, () => {
  const r = run('--check-dictionary', '--json');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const { ok, entries } = JSON.parse(r.stdout);
  assert.equal(ok, true);
  assert.equal(entries.length, dictionary.entries.filter((entry) => entry.lang !== 'vi').length, 'mục `lang: "vi"` (tên nền tảng, luật chung 21/11/2026) đọc tiếng Việt nên không kiểm âm Anh');
  assert.deepEqual(entries.filter((entry) => !entry.ok), []);
});

test('phiên âm kiểu Việt trong từ điển riêng bị báo vietnamese_reading, mã 1', { skip }, (t) => {
  const extra = fixture(t, 'riêng.json', JSON.stringify({ entries: [
    { term: 'Partition', kind: 'word', tts: 'pa-ti-sần' },
  ] }));
  const r = run('--check-dictionary', '--extra', extra, '--json');
  assert.equal(r.status, 1, r.stderr);
  const bad = JSON.parse(r.stdout).entries.filter((entry) => !entry.ok);
  assert.deepEqual(bad.map(({ term, source, issue }) => [term, source, issue]), [['Partition', 'riêng', 'vietnamese_reading']]);
});

test('chữ cái viết liền bị bộ G2P đọc theo ngữ cảnh thì báo context_changes_reading', { skip }, (t) => {
  const extra = fixture(t, 'riêng.json', JSON.stringify({ entries: [
    { term: 'UI', kind: 'letters', tts: 'UI' },
    { term: 'IDE', kind: 'letters', tts: 'IDE' },
  ] }));
  const r = run('--check-dictionary', '--extra', extra, '--json');
  assert.equal(r.status, 1, r.stderr);
  const bad = JSON.parse(r.stdout).entries.filter((entry) => !entry.ok);
  assert.deepEqual(bad.map(({ term, issue }) => [term, issue]), [['UI', 'context_changes_reading'], ['IDE', 'context_changes_reading']]);
});

test('--lines kiểm từng dòng lời đọc với từ điển chung và riêng', { skip }, (t) => {
  const good = fixture(t, 'dòng.json', JSON.stringify([
    { row: 4, label: 'Lời 4', text: 'Partition chia các dòng theo một cột.', tts: 'Partition chia các dòng theo một cột.' },
    { row: 11, label: 'Lời 11', text: 'Truy vấn (query) lọc theo tháng.', tts: 'Truy vấn (Query) lọc theo tháng.' },
  ]));
  const ok = run('--lines', good, '--json');
  assert.equal(ok.status, 0, ok.stdout + ok.stderr);
  const { lines } = JSON.parse(ok.stdout);
  assert.deepEqual(lines.map(({ row, terms }) => [row, terms.map(({ term }) => term)]), [[4, ['Partition']], [11, ['Query']]]);
  assert.ok(lines.every(({ phonemes }) => phonemes.length > 0));

  const bad = fixture(t, 'dòng-lỗi.json', JSON.stringify([
    { row: 4, label: 'Lời 4', text: 'Partition chia các dòng theo một cột.', tts: 'Pa-ti-sần chia các dòng theo một cột.' },
  ]));
  const extra = fixture(t, 'riêng.json', JSON.stringify({ entries: [{ term: 'Partition', kind: 'word', tts: 'pa-ti-sần' }] }));
  const flagged = run('--lines', bad, '--extra', extra, '--json');
  assert.equal(flagged.status, 1, flagged.stderr);
  const [row] = JSON.parse(flagged.stdout).lines;
  assert.equal(row.ok, false);
  assert.deepEqual(row.terms.map(({ term, issue }) => [term, issue]), [['Partition', 'vietnamese_reading']]);
});

test('mã 2 khi không chọn hoặc chọn nhiều hơn một chế độ', { skip }, () => {
  assert.equal(run().status, 2);
  assert.equal(run('--text', 'a', '--check-dictionary').status, 2);
});
