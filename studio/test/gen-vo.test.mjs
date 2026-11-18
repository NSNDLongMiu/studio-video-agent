import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../renderer-remotion/scripts/gen_vo.py', import.meta.url));
const dictionary = new URL('../../tools/voice/pronunciation.json', import.meta.url);
const ffmpeg = process.env.FFMPEG || 'ffmpeg';
const ffprobe = process.env.FFPROBE || 'ffprobe';
const python = [['python'], ['py', '-3']].find(([exe, ...args]) =>
  spawnSync(exe, [...args, '-c', 'import wave; assert bytes(2)'], { encoding: 'utf8' }).status === 0);
const missing = [
  !python && 'Python (python hoặc py -3)',
  spawnSync(ffmpeg, ['-version']).status !== 0 && 'ffmpeg',
  spawnSync(ffprobe, ['-version']).status !== 0 && 'ffprobe',
].filter(Boolean);

const stub = String.raw`
import json
import os
import struct
import wave

class Vieneu:
    def infer(self, text, *, voice, temperature):
        with open(os.environ["STUDIO_GEN_VO_LOG"], "a", encoding="utf-8") as log:
            log.write(json.dumps(text) + "\n")
        return struct.pack("<hhhh", 1000, 1000, -1000, -1000) * 12000

    def save(self, audio, path):
        with wave.open(path, "wb") as wav:
            wav.setparams((2, 2, 12000, 0, "NONE", "not compressed"))
            wav.writeframes(audio)
`;

function near(actual, expected, tolerance = 0.001) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≠ ${expected} (±${tolerance})`);
}

test('Bỏ hệ số tốc độ cố định cũ', () => {
  assert.ok(!fs.readFileSync(script, 'utf8').includes('1.08'));
});

test('Giọng đọc Remotion theo Y6–Y8', {
  skip: missing.length ? `Thiếu công cụ để chạy kiểm thử: ${missing.join(', ')}.` : false,
}, async (t) => {
  const tempRoot = fs.realpathSync(os.tmpdir());
  const temp = fs.mkdtempSync(path.join(tempRoot, 'studio-gen-vo-'));
  assert.equal(path.dirname(path.resolve(temp)), tempRoot);
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  fs.writeFileSync(path.join(temp, 'vieneu.py'), stub);

  function run(name, spec) {
    const dir = path.join(temp, name);
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'spec.json'), JSON.stringify(spec), 'utf8');
    const log = path.join(dir, 'tts.jsonl');
    const [exe, ...args] = python;
    const result = spawnSync(exe, [...args, script, 'spec.json'], {
      cwd: dir,
      encoding: 'utf8',
      env: { ...process.env, PYTHONPATH: temp, PYTHONIOENCODING: 'utf-8', STUDIO_GEN_VO_LOG: log },
    });
    assert.ifError(result.error);
    return { result, log };
  }

  function success(name, spec) {
    const { result, log } = run(name, spec);
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    const received = fs.readFileSync(log, 'utf8').trimEnd().split(/\r?\n/).map(JSON.parse);
    assert.deepEqual(report.tts_text, received);
    return report;
  }

  await t.test('Áp từ điển, giữ nguyên text_tts và đo thời lượng kể cả nghỉ', () => {
    const { entries } = JSON.parse(fs.readFileSync(dictionary, 'utf8'));
    const { tts } = entries.find(({ term }) => term === 'Database');
    const override = '  Database theo cách đọc riêng  ';
    const report = success('defaults', { lines: [
      { text: 'Dùng Database?' },
      { text: 'Tiếp tục.', text_tts: override },
      { text: 'Chuyển ý', new_topic: true },
      { text: 'Chờ.', pause_after_s: 0.2 },
      { text: 'Kết thúc?', pause_after_s: 1.1 },
    ] });
    assert.notEqual(report.tts_text[0], 'Dùng Database?');
    assert.equal(report.tts_text[0], `Dùng ${tts}?`);
    assert.equal(report.tts_text[1], override);
    assert.deepEqual(report.tempo, [1, 1, 1, 1, 1]);
    report.speech_s.forEach((speech) => near(speech, 2, 0.05));
    const expectedPauses = [0.95, 0.55, 1.10, 0.20, 0];
    assert.equal(report.pause_s.length, expectedPauses.length);
    expectedPauses.forEach((pause, i) => near(report.pause_s[i], pause));
    assert.equal(report.pause_s.at(-1), 0);
    assert.equal(report.per_line_s.length, expectedPauses.length);
    report.per_line_s.forEach((duration, i) => near(duration, report.speech_s[i] + report.pause_s[i]));
    near(report.total_s, report.per_line_s.reduce((sum, duration) => sum + duration, 0));

    const probe = spawnSync(ffprobe, [
      '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', report.full,
    ], { encoding: 'utf8' });
    assert.ifError(probe.error);
    assert.equal(probe.status, 0, probe.stderr);
    near(Number(probe.stdout.trim()), report.total_s);
  });

  await t.test('Áp tốc độ kỹ thuật và dẫn', () => {
    const report = success('speed', { lines: [
      { text: 'Giải thích.', speed_class: 'ky_thuat' },
      { text: 'Mở đầu.', speed_class: 'dan' },
    ] });
    assert.deepEqual(report.tempo, [0.97, 1.03]);
    assert.ok(report.speech_s[0] > 2, String(report.speech_s[0]));
    assert.ok(report.speech_s[1] < 2, String(report.speech_s[1]));
  });

  await t.test('Nạp từ điển riêng và báo lỗi rõ nếu thiếu tệp', () => {
    const extra = path.join(temp, 'tu dien rieng.json');
    fs.writeFileSync(extra, JSON.stringify({
      entries: [{ term: 'Database', kind: 'word', tts: 'kho dữ liệu' }],
    }), 'utf8');
    const lines = [{ text: 'Dùng Database.' }];
    const report = success('extra', { lines, pronunciation_extra: extra });
    assert.deepEqual(report.tts_text, ['Dùng kho dữ liệu.']);

    const { result, log } = run('missing-extra', {
      lines, pronunciation_extra: path.join(temp, 'missing.json'),
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Dòng 1 gặp lỗi áp dụng từ điển phát âm/u);
    assert.match(result.stderr, /Không tìm thấy tệp từ điển riêng/u);
    assert.ok(!fs.existsSync(log));
  });

  await t.test('Ưu tiên tempo tường minh và áp mặc định nghỉ tuỳ chỉnh', () => {
    const report = success('overrides', {
      tempo: 1.1,
      default_pauses: { comma: 0.4, period: 0.6, question: 0.8, new_topic: 1.3 },
      lines: [
        { text: 'Một,' },
        { text: 'Hai…', tempo: 0.9 },
        { text: 'Ba!', speed_class: 'ky_thuat' },
        { text: 'Bốn.', new_topic: true },
        { text: 'Năm:', important: true },
        { text: 'Sáu', important: true, pause_after_s: 0 },
        { text: 'Bảy' },
        { text: 'Tám' },
      ],
    });
    assert.deepEqual(report.tempo, [1.1, 0.9, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1]);
    assert.deepEqual(report.pause_s, [0.4, 0.6, 0.8, 1.3, 0.95, 0, 0.3, 0]);
  });

  await t.test('Báo lỗi khi tempo ngoài khoảng', () => {
    for (const [name, spec] of [
      ['too-slow', { lines: [{ text: 'Thử.', tempo: 0.79 }] }],
      ['too-fast', { lines: [{ text: 'Thử.' }], tempo: 1.31 }],
    ]) {
      const { result, log } = run(name, spec);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Dòng 1 cần tempo là số trong khoảng \[0\.8, 1\.3\]/u);
      assert.ok(!fs.existsSync(log));
    }
  });
});
