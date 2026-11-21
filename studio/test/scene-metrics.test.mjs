import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeFrames, analyzeScenes, analyzeVoiceEdges, auditRenderedHeader, auditRenderedText, auditVisualText,
  checkOpening, conceptWindows, countSyllables, D8_LIMITS, groupLayouts, LAYOUT_SAME_DIFF,
  longestCommonSubsequence, measureTextOverlap, motionFindings, motionWarnings, PACING, parseCaptionStyles, PROFILES,
  sceneStats, sceneVoiceTiming, selectProfile, speechIntervals, textWords, usesExtendedChecks, validateRenderLog, validateSceneFields,
} from '../../tools/scene-metrics.mjs';

const frame = { w: 108, h: 192, fps: 10 };
const frameSize = frame.w * frame.h;

test('scene-metrics: chuẩn hoá NFC và so dãy con chung theo thứ tự từ tiếng Việt', () => {
  const tokens = textWords(' DỮ LIỆU, chuyển qua ĐÂU? ≈ 30 '.normalize('NFD'));
  assert.deepEqual(tokens, ['dữ', 'liệu', 'chuyển', 'qua', 'đâu', '30']);
  assert.equal(longestCommonSubsequence(tokens, textWords('Dữ liệu đi qua điểm khác.')), 3);
  assert.equal(longestCommonSubsequence(textWords('qua cổng'), textWords('cổng qua')), 1);
  assert.equal(longestCommonSubsequence(textWords('một một hai'), textWords('một hai')), 2);
  assert.equal(longestCommonSubsequence(textWords('dư lieu'), textWords('dữ liệu')), 0);
});

test('scene-metrics: so từng dòng lời, quét chữ đồng thời và tính tỉ lệ theo thời lượng', () => {
  const audit = auditVisualText([
    {
      scene_id: 'A', props: ['Máy đo'], text_overlay: 'Không đếm khi có semantic_plan.texts',
      semantic_plan: {
        keywords: [{ form: 'animation' }, { form: 'text_only' }],
        texts: [
          { text: 'Dữ liệu đi qua cổng', appear_s: 0, disappear_s: 3, effect: 'kinetic' },
          { text: 'Nhóm ba từ', appear_s: 1, disappear_s: 2, effect: 'pop + kinetic' },
          { text: 'Nhãn cuối', appear_s: 3, disappear_s: 4 },
        ],
      },
    },
    { scene_id: 'B', text_overlay: ['Cổng vẫn mở rồi;Tín hiệu|Đích\nMở'], props: [], animation_timeline: [{ t: 0, event: 'Mở' }] },
    { scene_id: 'C', semantic_plan: { keywords: [] } },
    { scene_id: 'D', semantic_plan: { keywords: [{ form: 'text_only' }], texts: [] }, text_overlay: 'Bỏ chữ cũ' },
  ], [
    { id: 'A', start: 0, end: 4 }, { id: 'B', start: 3, end: 6 },
    { id: 'C', start: 6, end: 10 }, { id: 'D', start: 10, end: 11 },
  ], [
    { text: 'Cổng vẫn', label: 'Dòng 1' }, { text: 'mở rồi', label: 'Dòng 2' },
    { text: 'Dữ liệu qua thiết bị', label: 'Dòng 3' }, { text: 'liệu qua cổng' },
  ], 15);
  assert.equal(audit.verbatim_texts, 1);
  assert.equal(audit.max_similarity, 3 / 5);
  assert.equal(audit.scenes[0].matches[0].voice.label, 'Dòng 3');
  assert.deepEqual(audit.scenes[0].peaks, {
    words: { count: 8, start: 1, end: 2 }, groups: { count: 2, start: 1, end: 2 },
  });
  assert.equal(audit.scenes[1].max_similarity, 0.5);
  assert.equal(audit.scenes[1].peaks.groups.count, 4);
  assert.equal(audit.scenes[3].text_words, 0);
  assert.equal(audit.text_words_total, 18);
  assert.equal(audit.text_coverage_pct, 40);
  assert.equal(audit.text_words_per_min, 72);
  assert.equal(audit.kinetic_per_min, 8);
  assert.equal(audit.keyword_visual_pct, 100 / 3);
  assert.deepEqual(audit.weak_visual_scenes, ['B', 'C', 'D']);
});

test('scene-metrics: đọc riêng các style ASS có Dialogue và quy đổi về khung 1920', () => {
  const ass = [
    '[Script Info]', 'PlayResY: 960', '[V4+ Styles]', 'Format: Name, Alignment, MarginV, Fontsize',
    'Style: Unused,5,0,99', 'Style: Thấp,2,210,28', 'Style: Giữa,5,0,35',
    '[Events]', 'Format: Start, End, Style, MarginV, Text',
    'Comment: 0:00:00.00,0:00:01.00,Unused,0000,Bỏ qua',
    'Dialogue: 0:00:00.00,0:00:02.00,Thấp,0000,Có dấu phẩy, ở đây',
    'Dialogue: 0:00:02.00,0:00:03.00,Giữa,0000,Đo giữa',
    'Dialogue: 0:00:03.00,0:00:04.00,Thấp,0000,{\\an2\\pos(270,533)}Đo vị trí',
  ].join('\n');
  const result = parseCaptionStyles(ass);
  assert.equal(result.play_res_y, 960);
  assert.deepEqual(result.styles.map(({ name, px, band_ok }) => [name, px, band_ok]),
    [['Thấp', 56, false], ['Giữa', 70, false]]);
  const [lower, middle] = result.styles;
  assert.deepEqual(lower.first, { start: 0, end: 2, alignment: 2, margin_v: 210, y_center: 1472, band_ok: true });
  assert.deepEqual(lower.outside, { start: 3, end: 4, alignment: 2, margin_v: 210, y_center: 1038, band_ok: false });
  assert.equal(middle.outside.y_center, 960);
  assert.deepEqual(parseCaptionStyles('[V4+ Styles]\nFormat: Name, Fontsize\nStyle: Caption,80'),
    { play_res_y: 1920, styles: [] });
});

test('scene-metrics: chọn hồ sơ theo thời lượng, trần hoặc chỉ định tường minh', () => {
  assert.equal(selectProfile(undefined, undefined), 'short');
  assert.equal(selectProfile(30, undefined), 'short');
  assert.equal(selectProfile(45, 45), 'short');
  // Chuẩn 45–75 s (D1, 20/11/2026): trên 45 s đến 75 s là `standard`, trên 75 s mới là `explainer`.
  assert.equal(selectProfile(45.001, undefined), 'standard');
  assert.equal(selectProfile(60, undefined), 'standard');
  assert.equal(selectProfile(75, 75), 'standard');
  assert.equal(selectProfile(30, 60), 'standard');
  assert.equal(selectProfile(75.001, 45), 'explainer');
  assert.equal(selectProfile(41.9, 190), 'explainer');
  assert.equal(selectProfile(180, 190, 'short'), 'short');
  assert.equal(selectProfile(12, undefined, 'explainer'), 'explainer');
  assert.equal(selectProfile(12, undefined, 'standard'), 'standard');
  assert.deepEqual([PROFILES.short.min_duration_s, PROFILES.short.max_duration_s], [15, 45]);
  assert.deepEqual([PROFILES.standard.min_duration_s, PROFILES.standard.warn_duration_s, PROFILES.standard.max_duration_s], [45, 70, 75]);
  assert.deepEqual([PROFILES.explainer.min_duration_s, PROFILES.explainer.warn_duration_s, PROFILES.explainer.max_duration_s], [150, 180, 190]);
  assert.equal(PROFILES.standard.max_scenes(60), 12);
  assert.equal(PROFILES.standard.max_scenes(75), 15);
  assert.deepEqual(['short', 'standard', 'explainer'].map(usesExtendedChecks), [false, true, true]);
  assert.equal(PROFILES.explainer.max_scenes(189.99), 37);
  assert.equal(PROFILES.explainer.max_scenes(190), 38);
  assert.deepEqual(Object.values(PACING.complexity).map(({ min_scene_s, min_hold_s }) => [min_scene_s, min_hold_s]),
    [[3, 0.5], [5, 1], [8, 2]]);
});

test('scene-metrics: chỉ đọc các trường tùy chọn hợp lệ, kể cả header ẩn và voice rỗng', () => {
  assert.deepEqual(validateSceneFields({ id: 'S1', concepts: 0, header: '  ', voice: [] }),
    { fields: { concepts: 0, header: '', voice: [] }, invalid: [] });
  assert.deepEqual(validateSceneFields({ role: 'opening', header: null, voice: [{ start: 0, end: 1, other: 'bỏ qua' }] }),
    { fields: { role: 'opening', header: null, voice: [{ start: 0, end: 1 }] }, invalid: [] });
  assert.deepEqual(validateSceneFields({ complexity: 'toString', concepts: 1.5, role: 0, header: false, voice: [{ start: 2, end: 2 }] }),
    { fields: {}, invalid: ['complexity', 'concepts', 'role', 'header', 'voice'] });
  assert.deepEqual(validateSceneFields({ header: { text: '  Chủ đề  ', slot: 'top_right' } }),
    { fields: { header: { text: 'Chủ đề', slot: 'top_right' } }, invalid: [] });
  assert.deepEqual(validateSceneFields({ header: { text: 'Chủ đề', slot: 'middle' } }),
    { fields: {}, invalid: ['header'] });
});

const renderLog = (events) => validateRenderLog({ version: 1, fps: 30, size: [1080, 1920], events });

test('scene-metrics D8: đo đầu/cuối trên cửa sổ mẫu chính xác và đếm mỗi câu một lần', () => {
  const { rate } = D8_LIMITS.voice_edges;
  const samples = new Float32Array(rate * 2);
  // Tăng 20 dB trong 20 ms, giảm 20 dB trong 50 ms, rồi thêm một câu bị cắt.
  for (let i = 0; i < samples.length; i++) {
    const t = i / rate;
    const gain = t >= 1.1 && t < 1.4 ? 0.02 : 0.2 * Math.min(1, 10 ** ((t - 0.24) * 50), 10 ** ((0.5 - t) * 20));
    samples[i] = gain * Math.sin(t * 2 * Math.PI * 500);
  }
  const stats = analyzeVoiceEdges(samples, [
    { start: 0.1, end: 0.8 }, { start: 1.1, end: 1.4 },
    { start: 1.5, end: 1.51 }, { start: 1.5, end: 1.9 }, { start: 1.8, end: 2.1 },
  ]);
  assert.equal(stats.measured_count, 2);
  assert.equal(stats.unmeasured.length, 3);
  assert.deepEqual(stats.violations.map(({ i, edge }) => [i, edge]), [[1, 'head'], [1, 'tail']]);
  assert.equal(stats.flagged_count, 1);
  assert.equal(stats.violation_pct, 50);
  assert.ok(stats.violations.every(({ reasons }) => reasons.includes('level')));
});

test('scene-metrics D8: opening cần là cảnh đầu riêng, chưa có tiếng và tiêu đề đủ cỡ', () => {
  const opening = { id: 'M', start: 0, end: 2, role: 'opening' };
  const hook = { id: 'H', start: 2, end: 5, role: 'hook' };
  const title = { kind: 'text', role: 'opening_title', scene: 'M', start: 0.2, end: 2,
    text: 'Chủ đề', px: 84, bbox: [90, 250, 990, 400] };
  assert.equal(checkOpening([opening, hook], 5, 1.7, renderLog([title])).ok, null);
  assert.equal(checkOpening([opening, hook], 5, 1.698, renderLog([title])).voice_ok, false);
  assert.equal(checkOpening([opening, hook], 5, 2).ok, null);
  assert.equal(checkOpening([{ ...opening, role: 'hook' }, hook], 5, 2, renderLog([title])).layout_ok, false);
  assert.equal(checkOpening([opening, { ...hook, start: 1.8 }], 5, 2, renderLog([title])).layout_ok, false);
  assert.equal(checkOpening([opening, hook], 5, 2, renderLog([{ ...title, bbox: [90, 249, 990, 400] }])).title_ok, false);
  assert.throws(() => renderLog([{ ...title, bbox: [9, 20, 1, 2] }]), /events\[0\]/);
});

test('scene-metrics D8: hợp nhất thời gian header, đo khe đúng lúc và phát hiện đổi ô tức thời', () => {
  const first = { kind: 'header', scene: 'A', slot: 'top', start: 2, end: 5, bbox: [100, 150, 600, 310] };
  const second = { ...first, scene: 'B', slot: 'top_right', start: 5, end: 7 };
  const part = { kind: 'component', name: 'panel', id: 'P', scene: 'A', start: 3, end: 4 };
  const log = renderLog([
    { ...first, end: 3.2 }, { ...first, start: 3.2, bbox: [101, 150, 601, 310] }, second,
    { ...part, start: 0, end: 2, bbox: first.bbox },
    { ...part, bbox: [100, 334, 600, 400] }, { ...part, bbox: [100, 333, 600, 400] },
  ]);
  const result = auditRenderedHeader(log, [{ start: 2 }, { start: 5 }], 2, 7);
  assert.equal(result.coverage_pct, 100);
  assert.deepEqual(result.transitions.map(({ transition_s, ok }) => [transition_s, ok]), [[0, false]]);
  assert.deepEqual(result.overlaps.map(({ start, end, gap_px }) => [start, end, gap_px]), [[3, 4, 23]]);
});

test('scene-metrics D8: bỏ chữ opening/header, giữ mốc xuất hiện và gộp kinetic nhiều bbox', () => {
  const label = { kind: 'text', role: 'label', scene: 'A', text: '  MÁY   CHỦ ', px: 58,
    effect: 'kinetic', start: 0.1, end: 0.5, bbox: [100, 200, 200, 230], target_bbox: [100, 300, 200, 400] };
  const log = renderLog([
    label, { ...label, start: 0.5, end: 1, bbox: [100, 210, 200, 240] },
    { ...label, start: 1, end: 1.5, effect: 'none' },
    { ...label, scene: 'B', text: 'Khác', start: 3.2, end: 3.8, target_bbox: null },
    { ...label, scene: 'B', role: 'caption', text: 'Âm thanh câu này', start: 3, end: 6 },
  ]);
  const declarations = [{ scene_id: 'A', semantic_plan: { texts: [
    { text: 'Máy chủ', appear_s: 0.6 }, { text: 'Đoạn thiếu', appear_s: 0.9 },
  ], keywords: [{ term: 'Bộ nhớ', type: 'entity', form: 'icon' }] } }, { scene_id: 'B' }];
  const timings = [{ id: 'A', start: 0, end: 3 }, { id: 'B', start: 3, end: 6 }, { id: 'C', start: 6, end: 9 }];
  const audit = auditRenderedText(log, declarations, timings, [], 9);
  assert.equal(audit.scenes_with_text_pct, 200 / 3);
  assert.equal(audit.planned_texts_found_pct, 50);
  assert.equal(audit.kinetic_count, 2);
  assert.equal(audit.kinetic_consecutive_scenes.length, 1);
  assert.equal(audit.max_simultaneous_words, 2);
  assert.equal(audit.unattached_labels.length, 1);
  assert.equal(audit.labels_without_target.length, 1);
  assert.deepEqual(audit.keywords_without_text.map(({ text }) => text), ['Bộ nhớ']);
  const repeated = auditRenderedText(renderLog([label, { ...label, bbox: [400, 200, 500, 230] }]),
    declarations, timings, [], 9);
  assert.equal(repeated.max_simultaneous_words, 4);
  assert.equal(repeated.kinetic_count, 2);
});

test('scene-metrics: đo từng bbox ghi thật, gộp các đoạn kinetic và phân biệt giao với chạm mép', () => {
  const label = (text, start, end, bbox, extra) => ({
    kind: 'text', role: 'label', scene: 'S16', px: 56, text, start, end, bbox, ...extra,
  });
  const audit = measureTextOverlap({ events: [
    label('Bản lưu', 100, 110, [0, 0, 100, 60]),
    label('Bản đang nạp', 105, 105.1, [80, 0, 200, 60], { effect: 'kinetic' }),
    label('Bản đang nạp', 105.1, 105.2, [70, 0, 200, 60], { effect: 'kinetic' }),
    label('Bản đang nạp', 105.2, 109, [60, 0, 200, 60], { effect: 'kinetic' }),
    label('Chạm mép', 100, 101, [100, 0, 200, 60]),
    label('Đủ khe', 101, 102, [124, 0, 200, 60]),
    label('Chớp nhanh', 102, 102.19, [10, 0, 100, 60], { effect: 'pop' }),
    label('Biên 0,2 s', 103, 103.2, [120, 0, 200, 60], { effect: 'pop' }),
    label('Khác cảnh', 100, 110, [0, 0, 100, 60], { scene: 'S17' }),
    ...['caption', 'header_title', 'opening_title'].map((role) => label(role, 100, 110, [0, 0, 100, 60], { role })),
  ] }, 120);
  assert.equal(audit.text_overlap_pairs, 1);
  assert.equal(audit.text_min_gap_px, 0);
  assert.deepEqual(audit.overlaps, [{ scene: 'S16', start: 105, end: 109, texts: ['Bản lưu', 'Bản đang nạp'],
    boxes: [[0, 0, 100, 60], [60, 0, 200, 60]], gap_px: 0, intersection_pct: 40 }]);
  assert.deepEqual(audit.close_pairs.map(({ texts, gap_px }) => [texts[1], gap_px]), [['Chạm mép', 0], ['Biên 0,2 s', 20]]);
  const identical = measureTextOverlap({ events: [
    label('Cùng chữ', 0, 1, [0, 0, 100, 60]), label('Cùng chữ', 0, 1, [50, 0, 150, 60]),
  ] }, 1);
  assert.equal(identical.text_overlap_pairs, 1);
});

test('scene-metrics: keyword khớp nhãn rút gọn, từ chung hoặc cùng đối tượng trong mốc cảnh', () => {
  const label = (text, extra) => ({ kind: 'text', role: 'label', scene: 'A', px: 56, text,
    start: 2, end: 3, bbox: [0, 0, 100, 60], ...extra });
  const keyword = (term, type = 'term', form = 'illustration', object) => ({ term, type, form, ...(object && { object }) });
  const audit = auditRenderedText({ events: [
    label('Nhật ký!'.normalize('NFD')),
    label('Lịch, kiểm'),
    label('Nhãn một', { attach_to: 'Ngăn trái' }),
    label('Nhãn hai', { target_bbox: [100, 60, 200, 160] }),
    { kind: 'component', scene: 'A', id: 'tray', name: 'Ngăn phải', bbox: [101, 60, 200, 160], start: 2, end: 3 },
    label('Tiêu đề!', { role: 'opening_title' }),
    label('Bộ nhớ', { start: 4, end: 5 }),
    label('Bộ nhớ', { role: 'header_title' }),
  ] }, [
    { scene_id: 'A', semantic_plan: { keywords: [
      keyword('nhật ký hoạt động'), keyword('khung lịch sử kiểm tra'),
      keyword('Mã riêng', 'term', 'icon', 'ngăn trái'), keyword('Giá trị', 'concept', 'icon', 'ngăn phải'),
      keyword('Tiêu đề'), keyword('Trượt sang phải', 'action', 'animation'), keyword('Bộ nhớ'),
    ] } },
    { scene_id: 'B', semantic_plan: { keywords: [keyword('Nhật ký', 'term', 'text_only')] } },
  ], [{ id: 'A', start: 1, end: 4 }, { id: 'B', start: 4, end: 5 }], [], 5);
  assert.deepEqual(audit.keywords_without_text.map(({ text, visual }) => [text, visual]), [
    ['Trượt sang phải', true], ['Bộ nhớ', false], ['Nhật ký', false],
  ]);
});

test('scene-metrics: suy khoảng tiếng và tính giữ hình âm khi lời chạy qua cú cắt', () => {
  const intervals = speechIntervals([{ start: 0.8, end: 1.75 }, { start: 4.5, end: 5 }], 5);
  assert.deepEqual(intervals, [{ start: 0, end: 0.8 }, { start: 1.75, end: 4.5 }]);
  assert.deepEqual(sceneVoiceTiming({ start: 0, end: 1.5 }, intervals),
    { last_voice_end: 0.8, hold_after_voice_s: 0.7, cut_during_speech: false });
  assert.deepEqual(sceneVoiceTiming({ start: 1.5, end: 4.25 }, intervals),
    { last_voice_end: 4.5, hold_after_voice_s: -0.25, cut_during_speech: true });
  assert.deepEqual(sceneVoiceTiming({ start: 4.25, end: 5 }, intervals),
    { last_voice_end: null, hold_after_voice_s: null, cut_during_speech: false });
  assert.equal(sceneVoiceTiming({ start: 0, end: 4.45 }, intervals).cut_during_speech, true);
  assert.equal(sceneVoiceTiming({ start: 0, end: 4.5 }, intervals).cut_during_speech, false);
  assert.deepEqual(speechIntervals([{ start: 0, end: 5 }], 5), []);
});

test('scene-metrics: cửa sổ 10 giây xét biên cảnh và phân bổ khái niệm theo phần giao', () => {
  const scenes = [{ id: 'A', start: 5, end: 11, concepts: 2 }, { id: 'B', start: 11, end: 19, concepts: 2 }];
  assert.deepEqual(conceptWindows(scenes, 25), [{ start: 5, end: 15, concepts: 3, scene_ids: ['A', 'B'] }]);
  assert.deepEqual(conceptWindows([{ id: 'C', start: 0, end: 15, concepts: 3 }], 15), []);
  assert.deepEqual(conceptWindows([{ id: 'D', start: 0, end: 5, concepts: 3 }], 5),
    [{ start: 0, end: 5, concepts: 3, scene_ids: ['D'] }]);
  assert.deepEqual(conceptWindows([scenes[0], { id: 'E', start: 20, end: 25 }], 25), []);
});

test('scene-metrics: đếm cụm chữ/số Unicode, tách từ ghép và dấu câu', () => {
  assert.equal(countSyllables([
    { text: 'Tiếng Việt, cơ-sở dữ liệu 1080×1920; SQL_2!', tts: 'bỏ qua' },
    { tts: 'giải thích 3,14 %'.normalize('NFD') },
    { text: '… ☑ ©' },
  ]), 14);
  assert.equal(countSyllables([{ text: '', tts: 'chỉ dùng tts khi thiếu text' }]), 0);
  assert.throws(() => countSyllables([{ text: 2 }]), /text\/tts/);
});

test('scene-metrics: dùng ngưỡng tĩnh 3 s trong cảnh high và 2 s ở phần còn lại', () => {
  const motion = { static_runs: [{ start_s: 0, length_s: 2.6 }, { start_s: 4, length_s: 5.5 }] };
  assert.deepEqual(motionFindings(motion, [], [
    { id: 'S1', start: 0, end: 3, complexity: 'high' },
    { id: 'S2', start: 4, end: 7.25, complexity: 'high' },
  ]).map(({ start, end, scene_ids }) => [start, end, scene_ids]), [[4, 7.25, ['S2']], [7.25, 9.5, undefined]]);
});

test('scene-metrics: khung đứng yên, tính độ dài theo số bước giữa hai khung', () => {
  const { motion } = analyzeFrames(Buffer.alloc(21 * frameSize, 50), frame);
  assert.deepEqual(motion, { static_pct: 100, longest_static_s: 2, static_runs: [{ start_s: 0, length_s: 2 }] });
  assert.deepEqual(motionWarnings(motion), []);
});

test('scene-metrics: đo đủ các đoạn tĩnh và chỉ cảnh báo đoạn dài hơn 2 s', () => {
  const buffer = Buffer.alloc(33 * frameSize, 50);
  buffer.fill(100, 11 * frameSize);
  const { motion } = analyzeFrames(buffer, frame);
  assert.deepEqual(motion, {
    static_pct: 96.875,
    longest_static_s: 2.1,
    static_runs: [{ start_s: 0, length_s: 1 }, { start_s: 1.1, length_s: 2.1 }],
  });
  assert.deepEqual(motionWarnings(motion), ['Đoạn tĩnh 1,1–3,2 s dài 2,1 s (R4: cần hold_reason trong storyboard)']);
});

test('scene-metrics: một khối 12×12 đổi sáng đủ để phát hiện chuyển động cục bộ', () => {
  const buffer = Buffer.alloc(5 * frameSize);
  for (const index of [1, 3]) {
    for (let row = frame.h - 12; row < frame.h; row++) {
      const end = index * frameSize + (row + 1) * frame.w;
      buffer.fill(120, end - 12, end);
    }
  }
  const { steps, motion } = analyzeFrames(buffer, frame);
  assert.deepEqual(steps, Array.from({ length: 4 }, () => ({ local: 120, active: 1 })));
  assert.deepEqual(motion, { static_pct: 0, longest_static_s: 0, static_runs: [] });
});

test('scene-metrics: giữ đúng các biên loại trừ của ngưỡng tĩnh và khối hoạt động', () => {
  const buffer = Buffer.concat([0, 1, 3, 6, 10].map((level) => Buffer.alloc(frameSize, level)));
  const { steps, motion } = analyzeFrames(buffer, frame);
  assert.deepEqual(steps, [
    { local: 1, active: 0 }, { local: 2, active: 0 }, { local: 3, active: 0 }, { local: 4, active: 144 },
  ]);
  assert.deepEqual(motion, { static_pct: 25, longest_static_s: 0.1, static_runs: [] });
});

test('scene-metrics: bỏ bước chuyển cảnh và đo bố cục giữa các khung giữa cảnh', () => {
  const buffer = Buffer.concat([0, 8, 8].map((level) => Buffer.alloc(15 * frameSize, level)));
  const timeline = [
    { id: 'S01', start: 0, end: 1.5 },
    { id: 'S02', start: 1.5, end: 3 },
    { id: 'S03', start: 3, end: 4.5 },
  ];
  const { steps, motion } = analyzeFrames(buffer, frame);
  const scenes = analyzeScenes(buffer, steps, timeline, frame);
  assert.deepEqual(scenes, timeline.map((scene, index) => ({
    ...scene, local_median: 0, active_median: 0, static_pct: 100, longest_static_s: 1.4,
    layout_diff_next: [8, 0, null][index],
  })));
  const warns = motionWarnings(motion, scenes);
  assert.equal(warns.filter((msg) => /ít chuyển động/.test(msg)).length, 3);
  assert.ok(!warns.some((msg) => /bố cục giống nhau/.test(msg)));
});

test('scene-metrics: gộp bố cục giống nhau thành một cảnh báo cho mỗi chuỗi', () => {
  const buffer = Buffer.concat([0, 1, 2, 3, 20, 20, 20].map((level) => Buffer.alloc(10 * frameSize, level)));
  const timeline = Array.from({ length: 7 }, (_, i) => ({ id: `S0${i + 1}`, start: i, end: i + 1 }));
  const { steps, motion } = analyzeFrames(buffer, frame);
  const scenes = analyzeScenes(buffer, steps, timeline, frame);
  assert.deepEqual(scenes.map(({ layout_diff_next }) => layout_diff_next), [1, 1, 1, 17, 0, 0, null]);
  assert.deepEqual(motionWarnings(motion, scenes).filter((msg) => /bố cục giống nhau/.test(msg)), [
    '4 cảnh liền S01, S02, S03, S04 có bố cục giống nhau (độ khác 1 / 1 / 1)',
    'Ba cảnh liền S05, S06, S07 có bố cục giống nhau (độ khác 0 / 0)',
  ]);
});

test('scene-metrics: thống kê thời lượng cảnh và tính tần suất theo số lần cắt', () => {
  assert.deepEqual(sceneStats([
    { start: 0, end: 1.5 }, { start: 2.2, end: 4.2 }, { start: 5, end: 8.5 },
  ]), { count: 3, mean_s: 7 / 3, min_s: 1.5, max_s: 3.5, under_2s: 1, cuts_per_10s: 20 / 7 });
  assert.deepEqual(sceneStats([]), {
    count: 0, mean_s: null, min_s: null, max_s: null, under_2s: 0, cuts_per_10s: null,
  });
  assert.equal(sceneStats([{ start: 3, end: 6 }]).cuts_per_10s, 0);
});

test('scene-metrics: chọn nhóm đại diện đầu tiên dưới ngưỡng và tách chuỗi bị ngắt', () => {
  const levels = [10, 10 + LAYOUT_SAME_DIFF, 15, 16, 11, 20, 21];
  const buffer = Buffer.concat(levels.map((level) => Buffer.alloc(10 * frameSize, level)));
  const scenes = levels.map((_, i) => ({ id: `S${i + 1}`, start: i, end: i + 1 }));
  // S3 gần S2 hơn nhưng vào nhóm S1 vì đây là nhóm đầu tiên thỏa ngưỡng.
  // S4 và S6 cùng nhóm nhưng bị ngắt bởi S5.
  assert.deepEqual(groupLayouts(buffer, [...scenes, { id: 'Ngoài video', start: 8, end: 9 }], frame), {
    distinct: 2, groups: [
      { rep: 'S1', scenes: ['S1', 'S3', 'S5'] },
      { rep: 'S2', scenes: ['S2', 'S4', 'S6', 'S7'] },
    ],
    longest_run: 2,
  });
  assert.deepEqual(groupLayouts(Buffer.alloc(0), scenes, frame), { distinct: 0, groups: [], longest_run: 0 });
});
