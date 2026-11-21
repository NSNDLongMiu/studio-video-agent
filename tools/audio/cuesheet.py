"""Lập bảng cue từ storyboard và timeline, ưu tiên sự kiện có chủ đích."""
import argparse
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

sys.dont_write_bytecode = True
from sfx_synth import CONFIG, ROOT, read_json, write_json


def overlaps(start, end, spans):
    return any(start < right and end > left for left, right in spans)


def load_inputs(ep, warnings):
    def optional(path, default):
        try:
            return read_json(ep / path)
        except FileNotFoundError:
            warnings.append(f"Thiếu {path}, bỏ qua nguồn này")
            return default

    storyboard = optional("storyboard.json", {})
    scenes = optional("assets/scenes.json", [])
    events = optional("assets/render-log.json", {}).get("events", [])
    voice = optional("assets/voice/voice-timeline.json", {}).get("lines", [])
    if not voice:
        voice = optional("assets/_scratch/cues-d8.json", [])
    return storyboard, scenes, events, voice


def storyboard_timeline(storyboard):
    current = 0
    scenes = []
    opening = storyboard.get("opening") or {}
    if opening.get("duration_s") and not any(
        scene["scene_id"] == opening.get("scene_id") for scene in storyboard.get("scenes", [])
    ):
        current = opening["duration_s"]
        scenes.append(dict(id=opening.get("scene_id", "opening"), start=0, end=current,
                           role="opening", header=opening.get("topic")))
    for scene in storyboard.get("scenes", []):
        end = round(current + scene.get("duration_s", 0), 9)
        role = "opening" if scene["scene_id"] == opening.get("scene_id") else scene.get("role")
        scenes.append(dict(id=scene["scene_id"], start=current, end=end, role=role, header=scene.get("topic")))
        current = end
    return scenes


def candidate_cues(storyboard, scenes, events, voice, config, warnings):
    derive = config["derive"]
    scene_map = {scene["id"]: scene for scene in scenes}
    design = {scene["scene_id"]: scene for scene in storyboard.get("scenes", [])}
    explicit = {sid for sid, scene in design.items() if "sound_cues" in scene}

    def cue(sid, t, intent, intensity, reason, kind, ref, duration=None):
        return dict(scene_id=sid, t=t, intent=intent, intensity=intensity, reason=reason,
                    source=dict(kind=kind, ref=ref), duration_s=duration)

    for sid, scene in design.items():
        if sid not in scene_map:
            if scene.get("sound_cues"):
                warnings.append(f"{sid}: thiếu mốc cảnh cho sound_cues")
            continue
        start = scene_map[sid]["start"]
        for index, item in enumerate(scene.get("sound_cues", []), 1):
            yield cue(sid, start + item["t"], item["intent"], item["intensity"], item["reason"],
                      "storyboard.sound_cues", f"{sid}#{index}", item.get("duration_s"))

    render_scenes = set()
    weights = derive["weights"]
    accepted = weights[weights.index(derive["minimum_render_weight"]):]
    for index, event in enumerate(events, 1):
        sid = event.get("scene")
        hint = event.get("cue") or {}
        if sid not in explicit and hint.get("weight") in accepted and hint.get("intent") in config["intents"]:
            render_scenes.add(sid)
            target = event.get("text") or event.get("attach_to") or event.get("role") or event["kind"]
            yield cue(sid, event["start"], hint["intent"], hint["weight"], f"Hình xuất hiện: {target}",
                      "render_log", f"events#{index}", hint.get("duration_s"))

    for index, scene in enumerate(scenes):
        sid, start = scene["id"], scene["start"]
        if sid in explicit or sid in render_scenes:
            continue
        old = design.get(sid, {})
        transition = scene.get("transition") or old.get("transition")
        previous_header = scenes[index - 1].get("header") if index else None
        header_changed = bool(previous_header and scene.get("header") and previous_header != scene["header"])
        if index and (header_changed or transition and transition not in derive["ignored_transitions"]):
            reason = "Đổi chủ đề" if header_changed else f"Chuyển cảnh: {transition}"
            yield cue(sid, start, "transition", derive["cut_intensity"], reason, "scene_cut", sid)
        for number, description in enumerate(old.get("sound_effects", []), 1):
            for intent, keywords in derive["legacy_intents"].items():
                if any(keyword.casefold() in description.casefold() for keyword in keywords):
                    match = re.match(r"^(\d+(?:[,.]\d+)?)\s*s\b", description)
                    offset = float(match[1].replace(",", ".")) if match else 0
                    yield cue(sid, start + offset, intent, derive["legacy_intensity"],
                              f"Gợi ý âm thanh cũ: {description}", "scene_cut", f"{sid}.sound_effects#{number}")
                    break

    directions = {str(line["line_id"]): line for scene in design.values()
                  for line in scene.get("voice_direction", [])}
    for index, line in enumerate(voice, 1):
        sid = line.get("scene_id", line.get("scene"))
        line_id = str(line.get("line_id", line.get("line", ""))).zfill(2)
        intent = line.get("intent") or directions.get(line_id, {}).get("intent")
        if sid not in explicit and sid not in render_scenes and intent in derive["intent_by_voice"]:
            yield cue(sid, line["start"], derive["intent_by_voice"][intent], derive["voice_intensity"],
                      f"Nhịp lời: {intent}", "voice_event", f"voice#{index}")
        if intent == "silence" or line.get("intentional_silence"):
            yield cue(sid, line["start"], "silence", None, line.get("reason") or "Khoảng lặng có chủ đích",
                      "voice_event", f"voice#{index}", line["end"] - line["start"])


def occupied_voice(scenes, lines):
    windows = [(item["start"], item["end"]) for scene in scenes for item in scene.get("voice", [])]
    windows.extend((line["start"], line["end"]) for line in lines
                   if line.get("intent") != "silence" and not line.get("intentional_silence"))
    return sorted(set(windows))


def snap_time(t, length, voice, silence, limit, window):
    edges = {edge for start, end in voice + silence for edge in (start - length, end)}
    return next((edge for edge in sorted(edges, key=lambda edge: (abs(edge - t), edge))
                 if abs(edge - t) <= window and 0 <= edge <= limit - length
                 and not overlaps(edge, edge + length, voice + silence)), t)


def select_cues(candidates, config, duration, voice, warnings):
    layer = config["layers"]
    intents = config["intents"]
    derive = config["derive"]
    sfx = layer["sfx"]
    silences, queue, dropped, chosen = [], [], [], []
    for item in candidates:
        t, intent = item["t"], item["intent"]
        spec = intents.get(intent)
        why = None
        if not spec:
            why = "Intent không có trong cấu hình"
        elif not 0 <= t < duration or not str(item["reason"] or "").strip():
            why = "Mốc ngoài video hoặc thiếu lý do"
        else:
            length = item["duration_s"] if item["duration_s"] is not None else spec["default_dur_s"]
            if length is None or length <= 0:
                why = "Thiếu thời lượng dương"
            elif intent == "silence":
                silences.append(dict(start=t, end=min(duration, t + length), reason=item["reason"]))
            else:
                queue.append((item, spec, min(length, spec["default_dur_s"])))
        if why:
            dropped.append(dict(t=t, intent=intent, why=why))
    silence = [(item["start"], item["end"]) for item in silences]
    window = derive["density_window_s"]
    total_cap = int(duration * sfx["max_per_min"] / window)
    density_cap = sfx["max_per_min"]
    counts = Counter()
    for item, spec, length in sorted(queue, key=lambda entry: (-entry[1]["priority"], entry[0]["t"])):
        original = t = item["t"]
        kind, family = spec["layer"], spec["effect_family"]
        length = min(length, duration - t)
        why = None
        if overlaps(t, t + length, silence):
            why = "chồng khoảng lặng có chủ đích"
        elif overlaps(t, t + length, voice) and derive["snap"]:
            t = snap_time(t, length, voice, silence, duration, derive["snap_window_s"])
        if why is None:
            same_layer = sorted([other["t"] for other in chosen if other["layer"] == kind] + [t])
            if kind == "impact" and counts[kind] >= layer["impact"]["max_per_video"]:
                why = "vượt số impact tối đa"
            elif kind == "sfx" and (counts[kind] >= total_cap
                                   or any(right - left < window for left, right in
                                          zip(same_layer, same_layer[density_cap:]))):
                why = "vượt mật độ max_per_min"
            elif any(other["effect"] == family and abs(t - other["t"]) < sfx["min_gap_same_effect_s"]
                     for other in chosen):
                why = "lặp hiệu ứng trong min_gap"
            elif any(abs(t - other["t"]) < sfx["min_gap_any_s"] for other in chosen):
                why = "ưu tiên thấp hoặc cue quá gần nhau"
        if why:
            dropped.append(dict(t=original, intent=item["intent"], why=why))
            continue
        relative = sfx["under_voice_max_rel_db"] if overlaps(t, t + length, voice) else None
        chosen.append(dict(t=t, scene_id=item["scene_id"], layer=kind, intent=item["intent"], effect=family,
                           dur_s=length, gain_db=spec["gain_db_by_intensity"][item["intensity"]],
                           priority=spec["priority"], reason=item["reason"], source=item["source"],
                           mix=dict(voice_rel_db=relative, snapped=t != original)))
        counts[kind] += 1

    variants = defaultdict(list)
    for effect in read_json(ROOT / "library/sfx/manifest.json")["effects"]:
        variants[effect["family"]].append(effect)
    counts.clear()
    cues = []
    for item in sorted(chosen, key=lambda item: item["t"]):
        family = item["effect"]
        if not variants[family]:
            warnings.append(f"Thiếu hiệu ứng thư viện: {family}")
            dropped.append(dict(t=item["t"], intent=item["intent"], why="thiếu hiệu ứng thư viện"))
            continue
        options = variants[family]
        variant = options[counts[family] % len(options)]
        counts[family] += 1
        cues.append(dict(id=f"c{len(cues) + 1:03}", **item, variant=variant["variant"], file=variant["file"]))
    return cues, sorted(silences, key=lambda span: span["start"]), sorted(dropped, key=lambda item: item["t"])


def music_segments(config, scenes, storyboard, voice, silences, duration):
    synth = config["music_synthesis"]
    settings = config["layers"]["music"]
    risks = set(synth["risk_intents"])
    risk_scenes = {line.get("scene_id", line.get("scene")) for line in voice if line.get("intent") in risks}
    for scene in storyboard.get("scenes", []):
        if any(item.get("intent") in risks for key in ("voice_direction", "sound_cues") for item in scene.get(key, [])):
            risk_scenes.add(scene["scene_id"])
    edges = sorted({0, duration, *(edge for item in scenes + silences
                                    for edge in (item["start"], item["end"]) if 0 <= edge <= duration)})
    segments = []
    for start, end in zip(edges, edges[1:]):
        scene = next((scene for scene in scenes if scene["start"] <= start < scene["end"]), {})
        role = scene.get("role") or "body"
        level = synth["level_by_role"].get(role, synth["level_by_role"]["body"])
        if overlaps(start, end, [(span["start"], span["end"]) for span in silences]):
            level, db, reason = "low", synth["silence_gain_db"], "Khoảng lặng có chủ đích"
        else:
            risk = scene.get("id") in risk_scenes and role not in synth["role_releases"]
            if risk:
                level = "high"
            db = settings["base_gain_db"] + synth["level_gain_offsets_db"][level]
            if risk:
                db += settings["tension_boost_db"]
            reason = "Cảnh rủi ro" if risk else "Giải toả cuối video" if role in synth["role_releases"] else role
        if segments and (segments[-1]["level"], segments[-1]["gain_db"], segments[-1]["reason"]) == (level, db, reason):
            segments[-1]["end"] = end
        else:
            segments.append(dict(start=start, end=end, level=level, gain_db=db, reason=reason))
    return segments


def build(ep, config, music=None):
    warnings = []
    storyboard, scenes, events, voice = load_inputs(ep, warnings)
    if not scenes and storyboard.get("scenes"):
        scenes = storyboard_timeline(storyboard)
        warnings.append("Dùng thời lượng ước tính trong storyboard vì thiếu timeline dựng")
    scenes = sorted(scenes, key=lambda scene: scene["start"])
    duration = max([0] + [scene["end"] for scene in scenes] + [line["end"] for line in voice]
                   + [event["end"] for event in events if "end" in event])
    cues, silences, dropped = select_cues(candidate_cues(storyboard, scenes, events, voice, config, warnings),
                                         config, duration, occupied_voice(scenes, voice), warnings)
    layers = {key: dict(value) for key, value in config["layers"].items()}
    if music is not None:
        layers["music"]["enabled"] = music == "on"
    video_id = storyboard.get("video_id", ep.name)
    layers["music"]["track"] = f'{layers["music"]["mood"]}:{video_id}' if layers["music"]["enabled"] else None
    return dict(version=1, video_id=video_id, sample_rate=config["sample_rate"], duration_s=duration,
                config_version=config["version"], layers=layers,
                music=dict(segments=music_segments(config, scenes, storyboard, voice, silences, duration)),
                cues=cues, silences=silences, dropped=dropped, warnings=warnings)


def markdown(sheet, config):
    def cell(value):
        return re.sub(r"[\r\n]+", " ", str(value)).replace("|", r"\|")

    rows = ["# Bảng cue âm thanh", "", "| Mốc | Cảnh | Lớp | Hiệu ứng | Lý do | dB |",
            "|---|---|---|---|---|---:|"]
    for cue in sheet["cues"]:
        minutes, seconds = divmod(round(cue["t"] * 100), 6000)
        stamp = f"{minutes:02}:{seconds / 100:05.2f}"
        values = [stamp, cue["scene_id"], cue["layer"], f'{cue["effect"]}_{cue["variant"]:02}',
                  cue["reason"], cue["gain_db"]]
        rows.append("| " + " | ".join(map(cell, values)) + " |")
    counts = Counter(cue["layer"] for cue in sheet["cues"])
    per_min = counts["sfx"] * config["derive"]["density_window_s"] / sheet["duration_s"] if sheet["duration_s"] else 0
    rows += ["", f'{counts["sfx"]} SFX ({per_min:.2f}/phút), {counts["impact"]} impact, '
             f'{len(sheet["dropped"])} cue bị bỏ, {len(sheet["silences"])} khoảng lặng.']
    return "\n".join(rows) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["build"])
    parser.add_argument("--ep", type=Path, required=True)
    parser.add_argument("--out", type=Path)
    parser.add_argument("--md", type=Path)
    parser.add_argument("--config", type=Path, default=CONFIG)
    parser.add_argument("--music", choices=["on", "off"])
    args = parser.parse_args()
    config = read_json(args.config)
    sheet = build(args.ep, config, args.music)
    output = args.out or args.ep / "assets/sound-cues.json"
    md = args.md or output.with_suffix(".md")
    for path in (output, md):
        path.parent.mkdir(parents=True, exist_ok=True)
    write_json(output, sheet)
    md.write_text(markdown(sheet, config), encoding="utf-8")


if __name__ == "__main__":
    main()
