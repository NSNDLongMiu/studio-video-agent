import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { loadRules } from '../../tools/config/rules.mjs';

test('luật pipeline: Node đọc và giữ cấu hình trong tiến trình', () => {
  const rules = loadRules();
  assert.equal(rules.version, 'R-2026-11-20');
  assert.strictEqual(loadRules(), rules);
});

test('luật pipeline: Python đọc cùng dữ liệu khi chạy ngoài repo', (t) => {
  const modulePath = fileURLToPath(new URL('../../tools/config/rules.py', import.meta.url));
  const script = [
    'import json, runpy, sys',
    'load_rules = runpy.run_path(sys.argv[1])["load_rules"]',
    'rules = load_rules()',
    'assert load_rules() is rules',
    'print(json.dumps(rules, ensure_ascii=False))',
  ].join('\n');
  const result = spawnSync('python', ['-B', '-X', 'utf8', '-c', script, modulePath], {
    cwd: tmpdir(),
    encoding: 'utf8',
  });
  if (result.error?.code === 'ENOENT') return t.skip('Không có Python');
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr || String(result.signal));
  assert.deepEqual(JSON.parse(result.stdout), loadRules());
});

test('luật pipeline: biên opening và các enum khớp schema', () => {
  const rules = loadRules();
  const schema = JSON.parse(readFileSync(new URL('../schema/storyboard.schema.json', import.meta.url), 'utf8'));
  const opening = schema.properties.opening.properties;
  const scene = schema.properties.scenes.items.properties;
  assert.equal(rules.opening.min_s, opening.duration_s.minimum);
  assert.equal(rules.opening.max_s, opening.duration_s.maximum);
  assert.deepEqual(rules.opening.styles, opening.style.enum);
  assert.deepEqual(rules.opening.phases, opening.phases.items.properties.phase.enum);
  assert.deepEqual(rules.scene_kinds, scene.scene_kind.enum);
});
