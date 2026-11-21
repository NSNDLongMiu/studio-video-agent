import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildTimeline, gapAfter, planLines, rules, scriptInput } from '../../tools/voice/prosody.mjs';

const line = (text, line_id, scene_id = 'S01') => ({ text, line_id, scene_id, intent: 'explanation' });

test('Nghỉ theo mật độ thông tin và ghi nguồn ghi đè', () => {
  const short = 'Đây là câu ngắn.';
  const long = 'Câu dài có thêm mười thành phần và 23 mục để người xem có thời gian tiếp nhận.';
  const samples = [short, short, long, short, short, short].map((text, i) => line(text, String(i + 1)));
  const plan = planLines(samples);
  assert.deepEqual(planLines(samples), plan);
  assert.equal(plan.lines[0].pause_after_s, plan.lines[3].pause_after_s);
  assert.ok(plan.lines[2].pause_after_s > plan.lines[0].pause_after_s);
  const scene = { scene_id: 'S01', voice_direction: [{ line_id: '01', emotion: 'resolute', pause_after_s: 0 }] };
  const override = planLines(samples, { scenes: [scene] }, [{ line_id: '01', emotion: 'curious' }]).lines[0];
  assert.equal(override.emotion, 'curious');
  assert.equal(override.pause_after_s, 0);
  assert.equal(override.source.pause, 'override');
});

test('Tách mệnh đề đủ dài để xấp xỉ nhấn từ khóa', () => {
  const input = line('Mình chuẩn bị một bảng dữ liệu dài, quyền đọc trang quyết định phần nội dung mà tiện ích nhìn thấy, sau đó mình xem kết quả.', '01');
  const result = planLines([{ ...input, emphasis: ['quyền đọc trang'] }]).lines[0];
  assert.equal(result.emphasis[0].realized, true);
  const chunk = result.chunks.find(chunk => chunk.role === 'emphasis');
  assert.ok(chunk.tempo < result.tempo);
  assert.ok(chunk.pause_before_s > 0);
  assert.equal(result.chunks.map(chunk => chunk.text).join(' '), input.text);
});

test('Timeline tự do và fit giữ cửa sổ, co nghỉ, đề xuất tempo hoặc báo lỗi', () => {
  const plan = planLines([line('Trang web đang mở.', '01'), line('Trang hiện chữ.', '02')]);
  const durations = { '01': 1, '02': 1 };
  const free = buildTimeline(plan, durations);
  assert.ok(Math.abs(free.lines[1].start - free.lines[0].end - gapAfter(...plan.lines)) < rules.fit.epsilon_s);
  const fit = end => buildTimeline(plan, durations, [{ id: 'S01', start: 1, end, hold_after_voice_s: 0.3 }], 'fit');
  assert.equal(fit(5).overflow.length, 0);
  assert.ok(fit(5).lines[0].start >= 1);
  assert.ok(fit(5).lines[1].end <= 4.7);
  assert.equal(fit(3.82).overflow[0].action, 'shrink_pause');
  const accelerated = fit(3.72);
  assert.equal(accelerated.overflow[0].action, 'tempo_up');
  assert.ok(accelerated.lines.at(-1).end <= 3.42);
  assert.equal(fit(3).overflow[0].action, 'error');
  assert.equal(fit(3).lines.length, 0);
  const legacy = buildTimeline(plan, { '01': { speech_s: 1, tempo: 0.97 }, '02': { speech_s: 1, tempo: 0.97 } },
    [{ id: 'S01', start: 1, end: 3.6, hold_after_voice_s: 0.3 }], 'fit');
  assert.equal(legacy.overflow[0].action, 'tempo_up');
});

const it = new URL('../../content/it/', import.meta.url);
const t14 = fs.existsSync(it) && fs.readdirSync(it).find(name => name.startsWith('T14-'));
const script = t14 && new URL(t14 + '/ep01/script.md', it);
const storyboard = t14 && new URL(t14 + '/ep01/storyboard.json', it);
test('Kế hoạch T14 xác định và khác nhau giữa các cặp giải thích liên tục', {
  skip: !(script && fs.existsSync(script) && fs.existsSync(storyboard)),
}, () => {
  const input = scriptInput(fileURLToPath(script));
  const story = JSON.parse(fs.readFileSync(storyboard, 'utf8'));
  const plan = planLines(input, story);
  assert.equal(JSON.stringify(plan), JSON.stringify(planLines(input, story)));
  assert.ok(plan.summary.pause_s.stdev > 0);
  const gaps = plan.lines.slice(1).flatMap((next, index) => {
    const current = plan.lines[index];
    if (current.intent === 'explanation' && next.intent === 'explanation' &&
        next.transition.from_prev === 'continuous' && next.scene_id === current.scene_id) {
      return [{ gap: gapAfter(current, next), words: current.text.split(/\s+/).length }];
    }
    return [];
  });
  assert.ok(gaps.some(a => gaps.some(b => a.words !== b.words && a.gap !== b.gap)));
  for (const item of plan.lines) {
    assert.ok(item.pause_reason && item.emotion && item.intonation && item.transition.to_next);
    assert.ok(story.scenes.some(scene => scene.scene_id === item.scene_id));
    for (const side of ['before', 'after']) {
      const [min, max] = item.pause_limits[side];
      assert.ok(item['pause_' + side + '_s'] >= min && item['pause_' + side + '_s'] <= max);
    }
  }
});

