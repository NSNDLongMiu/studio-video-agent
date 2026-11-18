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
