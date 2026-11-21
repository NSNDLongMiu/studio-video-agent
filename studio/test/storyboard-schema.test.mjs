import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

// Cùng Ajv và cấu hình với renderer-remotion/src/producer.mjs, không phụ thuộc content/.
const require = createRequire(new URL('../renderer-remotion/package.json', import.meta.url));
const Ajv = require('ajv');
const schema = JSON.parse(fs.readFileSync(new URL('../schema/storyboard.schema.json', import.meta.url), 'utf8'));
const validate = new Ajv({ allErrors: true, strict: false }).compile(schema);
const legacy = () => ({
  video_id: 'TEST-T1-E01', status: 'APPROVED', scenes: [{
    scene_id: '1', narrative_purpose: 'Thấy kết quả phân loại', visual_concept: 'Thẻ chuyển vào hai khay',
    scene_type: 'process_animation', environment: 'Bàn làm việc', character_action: 'không xuất hiện',
    props: ['thẻ', 'hai khay'], camera: { shot: 'wide', movement: 'static' },
    animation_timeline: [{ t: 0, event: 'Thẻ trượt vào khay' }], voice_over: 'Tách dữ liệu theo nhóm.',
    text_overlay: '', sound_effects: [], transition: 'cut', duration_s: 3,
    quality_check: { has_real_illustration: true, repeats_previous_layout: false, silent_comprehensible: true },
  }],
});

test('schema: storyboard cũ không có các trường chất lượng xem vẫn hợp lệ', () => {
  assert.equal(validate(legacy()), true, JSON.stringify(validate.errors));
});

test('schema: đủ trường mới và cả hai renderer đều hợp lệ', () => {
  const board = legacy();
  board.renderer_reason = 'Component thể hiện được chuyển thẻ giữa hai khay.';
  Object.assign(board.scenes[0], { main_change: 'Thẻ chuyển từ chồng vào hai khay, thấy rõ ở 360×640.', text_groups: 0, hold_reason: 'Giữ kết quả cho người xem đối chiếu.' });
  Object.assign(board.scenes[0].quality_check, { text_repeats_voiceover: false, change_visible_at_360: true });
  for (const renderer of ['remotion', 'pillow-ffmpeg']) {
    board.renderer = renderer;
    assert.equal(validate(board), true, JSON.stringify(validate.errors));
  }
});

test('schema: text_groups phải là số nguyên không âm', () => {
  for (const text_groups of ['2', -1, 1.5]) {
    const board = legacy();
    board.scenes[0].text_groups = text_groups;
    assert.equal(validate(board), false);
    assert.ok(validate.errors.some((e) => e.instancePath === '/scenes/0/text_groups'));
  }
});

test('schema: từ chối renderer ngoài enum và quality_check sai kiểu', () => {
  const board = legacy();
  board.renderer = 'unknown';
  assert.equal(validate(board), false);
  assert.ok(validate.errors.some((e) => e.instancePath === '/renderer'));
  delete board.renderer;
  for (const field of ['text_repeats_voiceover', 'change_visible_at_360']) {
    board.scenes[0].quality_check[field] = 'true';
    assert.equal(validate(board), false);
    assert.ok(validate.errors.some((e) => e.instancePath === `/scenes/0/quality_check/${field}`));
    delete board.scenes[0].quality_check[field];
  }
});

test('schema: trường Information Pacing, opening và header (T9) hợp lệ và được kiểm', () => {
  const board = legacy();
  Object.assign(board.scenes[0], { main_idea: 'Hai giao dịch chờ nhau', complexity: 'high', concepts: 1, hold_after_voice_s: 2.5 });
  board.opening = { title: 'Vì sao hệ thống đứng im?', duration_s: 2.5, animation: 'Tiêu đề trượt vào, camera đẩy nhẹ' };
  board.header = { text: 'DATABASE / DEADLOCK', hidden_scenes: ['1'] };
  assert.equal(validate(board), true, JSON.stringify(validate.errors));

  for (const [path, mutate] of [
    ['/scenes/0/complexity', (b) => { b.scenes[0].complexity = 'extreme'; }],
    ['/scenes/0/concepts', (b) => { b.scenes[0].concepts = -1; }],
    ['/scenes/0/hold_after_voice_s', (b) => { b.scenes[0].hold_after_voice_s = '2'; }],
    ['/opening/duration_s', (b) => { b.opening.duration_s = 9; }], // luật 20/11/2026: opening 1–8 s
    ['/header', (b) => { b.header = { hidden_scenes: ['1'] }; }],
  ]) {
    const bad = structuredClone(board);
    mutate(bad);
    assert.equal(validate(bad), false, path);
  }
});

test('schema: semantic_plan và captions (Visual-first, T9) hợp lệ và được kiểm', () => {
  const board = legacy();
  board.captions = { layer: 'accessibility', burn_in: true, position: 'bottom', font_px: 56, max_lines: 2 };
  board.scenes[0].semantic_plan = {
    keywords: [
      { term: 'quá tải', type: 'result', form: 'status', object: 'Database chuyển đỏ, thanh tải đầy', motion: 'Thanh tải tăng theo số request' },
      { term: 'request', type: 'entity', form: 'animation', object: 'Nhiều chấm request bay tới database' },
    ],
    relations: [{ from: 'request', to: 'database', type: 'gửi tới' }],
    texts: [{ text: 'DATABASE OVERLOAD', kind: 'keyword', attach_to: 'khối Database', appear_s: 2.4, disappear_s: 5, effect: 'kinetic' }],
    hold_s: 2.5,
  };
  assert.equal(validate(board), true, JSON.stringify(validate.errors));

  for (const [path, mutate] of [
    ['keyword.form', (b) => { b.scenes[0].semantic_plan.keywords[0].form = 'slide'; }],
    ['keyword.type', (b) => { b.scenes[0].semantic_plan.keywords[0].type = 'sentence'; }],
    ['text.kind', (b) => { b.scenes[0].semantic_plan.texts[0].kind = 'paragraph'; }],
    ['text.thiếu text', (b) => { delete b.scenes[0].semantic_plan.texts[0].text; }],
    ['relation.thiếu to', (b) => { delete b.scenes[0].semantic_plan.relations[0].to; }],
    ['captions.font_px', (b) => { b.captions.font_px = 70; }],
    ['captions.position', (b) => { b.captions.position = 'top'; }],
    ['captions.max_lines', (b) => { b.captions.max_lines = 3; }],
  ]) {
    const bad = structuredClone(board);
    mutate(bad);
    assert.equal(validate(bad), false, path);
  }
});

test('schema: opening riêng, header xuyên suốt theo ô và scene.header_slot (D8) hợp lệ và được kiểm', () => {
  const board = legacy();
  board.opening = { title: 'Dòng ẩn trong mô tả plugin AI', duration_s: 2.4, scene_id: 'S00', topic: 'SECURITY / PLUGIN AI', voice: false };
  board.header = { text: 'SECURITY / PLUGIN AI', title: 'Dòng ẩn trong plugin AI', slots: ['top', 'top_left', 'above_captions'] };
  board.scenes[0].header_slot = 'top_left';
  assert.equal(validate(board), true, JSON.stringify(validate.errors));
  for (const [path, mutate] of [
    ['opening.duration_s quá dài', (b) => { b.opening.duration_s = 8.5; }], // luật 20/11/2026: tối đa 8 s
    ['opening.voice không phải boolean', (b) => { b.opening.voice = 'không'; }],
    ['header.slots sai ô', (b) => { b.header.slots = ['giữa']; }],
    ['scene.header_slot sai ô', (b) => { b.scenes[0].header_slot = 'bottom'; }],
  ]) {
    const bad = structuredClone(board);
    mutate(bad);
    assert.equal(validate(bad), false, path);
  }
});


test('schema: storyboard dùng đủ các trường T0', async (t) => {
  const board = legacy();
  board.opening = {
    title: 'Dữ liệu đi đâu?', duration_s: 8, style: 'question', style_params: {},
    voice: true, voice_line: '01',
    phases: [
      { phase: 'visual_hook', start_s: 0, end_s: 2, visual: 'Thẻ rơi', sfx_intent: 'impact_hook', voice_line: '01' },
      { phase: 'conflict', start_s: 2, end_s: 5 },
      { phase: 'topic_reveal', start_s: 5, end_s: 8 },
    ],
  };
  const scene = board.scenes[0];
  Object.assign(scene, {
    voice_direction: [
      {
        line_id: '02', intent: 'explanation', emotion: 'neutral', emphasis: ['dữ liệu'],
        pace: 'measured', pause_before_s: 0, pause_after_s: 0.35, intonation: 'falling',
        transition: { from_prev: 'cause_effect', to_next: 'continuous' },
      },
      { line_id: '03' },
    ],
    sound_cues: [
      { t: 0.2, intent: 'data_move', target: 'thẻ', intensity: 'low', reason: 'Thẻ vào khay' },
      { t: 1, intent: 'silence', intensity: 'low', duration_s: 0.5, reason: 'Giữ nhịp đối chiếu' },
    ],
    scene_kind: 'before_after',
    kind_params: {
      before: { label: 'Chưa tách', state: 'warn', object: 'chồng thẻ' },
      after: { label: 'Đã tách', state: 'ok', object: 'hai khay' },
    },
  });
  scene.quality_check.repeats_previous_kind = false;

  for (const duration of [1, 4, 5, 8]) {
    const sample = structuredClone(board);
    sample.opening.duration_s = duration;
    if (duration < 8) delete sample.opening.phases;
    assert.equal(validate(sample), true, JSON.stringify(validate.errors));
  }

  const cases = [
    ['/opening/duration_s', (b) => { b.opening.duration_s = 0.5; }],
    ['/opening/duration_s', (b) => { b.opening.duration_s = 8.5; }],
    ['/opening/style', (b) => { b.opening.style = 'khác'; }],
    ['/opening/style_params', (b) => { b.opening.style_params = []; }],
    ['/opening/voice_line', (b) => { b.opening.voice_line = 1; }],
    ['/opening/phases/0/phase', (b) => { b.opening.phases[0].phase = 'khác'; }],
    ['/opening/phases/0/start_s', (b) => { b.opening.phases[0].start_s = -1; }],
    ['/opening/phases/0/end_s', (b) => { b.opening.phases[0].end_s = 0; }],
    ['/opening/phases/0/visual', (b) => { b.opening.phases[0].visual = {}; }],
    ['/opening/phases/0/sfx_intent', (b) => { b.opening.phases[0].sfx_intent = 'silence'; }],
    ['/opening/phases/0/voice_line', (b) => { b.opening.phases[0].voice_line = 1; }],
    ['/scenes/0/voice_direction/0/line_id', (_, s) => { s.voice_direction[0].line_id = '2'; }],
    ['/scenes/0/voice_direction/0/emphasis', (_, s) => { s.voice_direction[0].emphasis = ['Tách', 'dữ liệu', 'nhóm']; }],
    ['/scenes/0/sound_cues/0', (_, s) => { delete s.sound_cues[0].reason; }, 'reason'],
    ['/scenes/0/sound_cues/1', (_, s) => { delete s.sound_cues[1].duration_s; }, 'duration_s'],
    ['/scenes/0/scene_kind', (_, s) => { s.scene_kind = 'khác'; }],
    ['/scenes/0/kind_params', (_, s) => { s.kind_params = []; }],
    ['/scenes/0/kind_params', (_, s) => { delete s.kind_params.after; }, 'after'],
    ['/scenes/0/quality_check/repeats_previous_kind', (_, s) => { s.quality_check.repeats_previous_kind = 'false'; }],
  ];
  for (const [path, mutate, missing] of cases) {
    await t.test(missing ? `${path} thiếu ${missing}` : path, () => {
      const invalid = structuredClone(board);
      mutate(invalid, invalid.scenes[0]);
      assert.equal(validate(invalid), false);
      assert.ok(validate.errors.some((error) =>
        error.instancePath === path && (!missing || error.params.missingProperty === missing)
      ), JSON.stringify(validate.errors));
    });
  }
});

test('schema: tham số bắt buộc theo loại cảnh', () => {
  const board = legacy();
  const scene = board.scenes[0];
  const part = { label: 'Thẻ dồn', object: 'chồng thẻ' };
  Object.assign(scene, {
    scene_kind: 'problem_cause_consequence',
    kind_params: { problem: part, cause: part, consequence: part },
  });
  assert.equal(validate(board), true, JSON.stringify(validate.errors));
  delete scene.kind_params.consequence;
  assert.equal(validate(board), false);
  assert.ok(validate.errors.some((error) => error.params.missingProperty === 'consequence'));

  Object.assign(scene, {
    scene_kind: 'step_by_step',
    kind_params: { steps: [{ ...part, t: 0 }, part] },
  });
  assert.equal(validate(board), true, JSON.stringify(validate.errors));
  scene.kind_params.steps.pop();
  assert.equal(validate(board), false);
  assert.ok(validate.errors.some((error) =>
    error.instancePath === '/scenes/0/kind_params/steps' && error.keyword === 'minItems'
  ));

  delete scene.kind_params;
  assert.equal(validate(board), false);
  assert.ok(validate.errors.some((error) => error.params.missingProperty === 'kind_params'));
  scene.scene_kind = 'data_flow';
  assert.equal(validate(board), true, JSON.stringify(validate.errors));
});

test('schema: storyboard T14 hiện có vẫn hợp lệ', async (t) => {
  const { fileURLToPath } = await import('node:url');
  const root = new URL('../../content/it/', import.meta.url);
  const paths = fs.globSync('T14-*/ep01/storyboard.json', { cwd: fileURLToPath(root) });
  if (paths.length === 0) return t.skip('Thiếu storyboard T14');
  for (const path of paths) {
    const board = JSON.parse(fs.readFileSync(new URL(path.replaceAll('\\', '/'), root), 'utf8'));
    assert.equal(validate(board), true, `${path}: ${JSON.stringify(validate.errors)}`);
  }
});
