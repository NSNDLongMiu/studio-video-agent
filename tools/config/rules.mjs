import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const configPath = fileURLToPath(new URL('./pipeline-rules.json', import.meta.url));
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isText = (value) => typeof value === 'string' && value.trim().length > 0;
const isBoolean = (value) => typeof value === 'boolean';
const isNumber = Number.isFinite;
const isNumberList = (length) => (value) => Array.isArray(value) && value.length === length && value.every(isNumber);
const isTextList = (value) => Array.isArray(value) && value.length > 0 && value.every(isText);

const requiredFields = {
  version: isText,
  frame: { width: isNumber, height: isNumber, fps: isNumber, safe_bbox: isNumberList(4) },
  opening: {
    min_s: isNumber, max_s: isNumber, target_s: isNumberList(2), title_px_min: isNumber,
    voice_allowed: isBoolean, voice_start_min_s: isNumber, voice_start_max_s: isNumber,
    phases: isTextList, styles: isTextList,
  },
  camera: { max_zoom: isNumber, keep_in_frame: isBoolean },
  scene_kinds: isTextList,
};

function validate(value, expected, path) {
  if (!(typeof expected === 'function' ? expected(value) : isObject(value))) {
    throw new Error(`Cấu hình pipeline-rules.json thiếu khóa hoặc sai kiểu dữ liệu tại ${path}.`);
  }
  if (typeof expected !== 'function') {
    for (const [key, field] of Object.entries(expected)) {
      validate(value[key], field, `${path}.${key}`);
    }
  }
}

let cachedRules;

export function loadRules() {
  if (cachedRules) return cachedRules;

  let rules;
  try {
    rules = JSON.parse(readFileSync(configPath, 'utf8'));
  } catch (cause) {
    throw new Error(`Không đọc được cấu hình tại ${configPath}.`, { cause });
  }
  validate(rules, requiredFields, '$');
  cachedRules = rules;
  return cachedRules;
}
