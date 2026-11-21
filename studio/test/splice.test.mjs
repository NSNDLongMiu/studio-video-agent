import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const env = { ...process.env, PYTHONIOENCODING: 'utf-8' };
const python = [['python'], ['py', '-3'], ['python3']].find(([exe, ...args]) =>
  spawnSync(exe, [...args, '-B', '-c', 'import numpy'], { env }).status === 0);
const ffmpeg = spawnSync('ffmpeg', ['-version']).status === 0;

test('Giữ phần âm nhỏ khi tách câu, đo và bắt được biên cố tình cắt tại −40 dB', {
  skip: !(python && ffmpeg) && 'Cần Python có NumPy và FFmpeg.',
}, async (t) => {
  const folder = path.join(root, 'tools', 'motion');
  const out = fs.mkdtempSync(path.join(folder, '.splice-test-'));
  t.after(() => {
    assert.equal(path.dirname(fs.realpathSync(out)), fs.realpathSync(folder));
    fs.rmSync(out, { recursive: true, force: true });
  });
  const [exe, ...prefix] = python;
  const script = path.join(root, 'tools', 'voice', 'splice.py');
  function run(args, status = 0) {
    const result = spawnSync(exe, [...prefix, '-B', ...args], { cwd: root, env, encoding: 'utf8' });
    assert.ifError(result.error);
    assert.equal(result.status, status, result.stderr || result.stdout);
    return result.stdout.trim();
  }

  await t.test('Ba cụm có sườn lên 20 ms và khoảng lặng 0,3 giây', () => {
    run(['-c', String.raw`
import json
import sys
import wave
from pathlib import Path

import numpy as np

from tools.voice import splice

out = Path(sys.argv[1])
rate = 48000
rng = np.random.default_rng(71)

def silence(seconds):
    return np.zeros(round(rate * seconds), dtype=np.int16)

def phrase(seconds):
    t = np.arange(round(rate * seconds)) / rate
    bands = np.arange(810, 1010, 6)[:, None]
    phases = rng.uniform(0, np.pi * 2, (len(bands), 1))
    carrier = np.sin(2 * np.pi * bands * t + phases).sum(axis=0)
    carrier = carrier / np.max(np.abs(carrier))
    attack = np.clip(np.minimum(t, t[-1] - t) / .02, 0, 1)
    amplitude = 10 ** ((-90 + 78 * attack) / 20)
    return np.round(32767 * carrier * amplitude).astype(np.int16)

phrases = [phrase(length) for length in (.54, .65, .43)]
audio = np.concatenate((silence(.10), phrases[0], silence(.30), phrases[1],
                        silence(.30), phrases[2], silence(.19)))
env = splice.envelope_db(audio, rate)
gaps = splice.find_gaps(env, rate)
assert len(gaps) == 3 and all(.30 <= b - a <= .34 for a, b in gaps[:2]), gaps
clips, report = splice.split_sentences(audio, rate, [5, 6, 4])
assert len(clips) == 3
assert all(row['lead_ms'] >= 60 and row['tail_ms'] >= 140 and row['score'] >= 0 for row in report), report
starts = [.10, .94, 1.89]
spans = [(s, s + len(p) / rate) for s, p in zip(starts, phrases)]
assert splice.audible_dropped_ms(audio, rate, spans) == 0
for source, clip in zip(phrases, clips):
    idx = np.flatnonzero(source)
    result = np.flatnonzero(clip)
    np.testing.assert_array_equal(source[idx[0]:idx[-1] + 1], clip[result[0]:result[-1] + 1])
good = np.concatenate([clips[0], silence(.12), clips[1], silence(.12), clips[2]])
windows, cursor = [], 0
for clip in clips:
    windows.append((cursor / rate, (cursor + len(clip)) / rate))
    cursor += len(clip) + round(rate * .12)
assert splice.check_edges(good, rate, windows) == []
threshold = np.flatnonzero(splice.envelope_db(phrases[0], rate) > -40)
lo, hi = int(threshold[0]), int(threshold[-1]) + 1
bad = phrases[0][lo:hi].copy()
fade = round(.008 * rate)
bad[:fade] = bad[:fade] * np.linspace(0, 1, fade)
bad[-fade:] = bad[-fade:] * np.linspace(1, 0, fade)
bad_windows = [(0, len(bad) / rate)]
assert {row['edge'] for row in splice.check_edges(bad, rate, bad_windows)} == {'head', 'tail'}
assert splice.audible_dropped_ms(phrases[0], rate, [(lo / rate, hi / rate)]) > 0
try:
    splice.split_sentences(phrases[0], rate, [1, 1])
except ValueError:
    pass
else:
    raise AssertionError('Phải từ chối nếu không có lặng giữa hai câu')
for name, x in [('source', audio), ('good', good), ('bad', bad)]:
    with wave.open(str(out / (name + '.wav')), 'wb') as f:
        f.setparams((1, 2, rate, 0, 'NONE', 'not compressed'))
        f.writeframes(x.astype('<i2').tobytes())
for name, w in [('good', windows), ('bad', bad_windows)]:
    (out / (name + '.json')).write_text(json.dumps([dict(start=a, end=b) for a, b in w]), encoding='utf8')
`, out]);
  });

  await t.test('CLI split ghi WAV, check trả mã 0/1/2', () => {
    const clips = JSON.parse(run([script, 'split', '--in', path.join(out, 'source.wav'), '--expected', '5,6,4',
      '--out-dir', path.join(out, 'sentences'), '--json']));
    assert.equal(clips.length, 3);
    assert.ok(clips.every(({ path: file }) => fs.statSync(file).size > 44));
    const measure = (name, status) => JSON.parse(run([script, 'check', '--wav', path.join(out, `${name}.wav`),
      '--windows', path.join(out, `${name}.json`), '--json'], status));
    assert.deepEqual(measure('good', 0), []);
    assert.deepEqual(measure('bad', 1).map(({ edge }) => edge), ['head', 'tail']);
    run([script, 'check', '--wav', path.join(out, 'good.wav'), '--windows', path.join(out, 'absent.json')], 2);
  });
});
