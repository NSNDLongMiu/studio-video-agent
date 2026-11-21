Đã cập nhật hoàn chỉnh hai file [storyboard.json](file:///D:/Agent%20Video%20Studio/.local/gemini-work/1795268800937-19260/storyboard.json) (`status: "DRAFT"`) và [storyboard.md](file:///D:/Agent%20Video%20Studio/.local/gemini-work/1795268800937-19260/storyboard.md):

- **Số cảnh:** 10 cảnh (S01–S10, tổng 57,7 s; opening S01–S02 dài 7,6 s).
- **Các scene_type:** `process_animation` (7 cảnh: S01–S06, S08), `comparison_scene` (2 cảnh: S07, S09), `character_acting` (1 cảnh: S10).
- **Tỉ lệ có Cáo:** 3/10 cảnh (30%), thời lượng 7,6 s ≈ 13,2% (đạt chuẩn ≲ 15% theo D8, talking-head = 0).
- **Điểm đã sửa:**
  1. **R12 nền:** Chuyển S03 sang N2, S06 sang N3; N1 còn 37,44% (≤ 40%), N2 29,46%, N3 23,05%, N4 10,05%; tối đa 2 cảnh liền kề.
  2. **Chữ trong kind_params:** Chuẩn hoá khớp 100% cột chữ script/`texts`, xoá chữ thừa và mã cảnh.
  3. **Camera:** Ghi rõ mục đích và cách dựng bằng `zoompan`/`crop` (≤ 1,3×) ở S02, S05, S08.
  4. **S06:** Đổi sang `process_animation` khớp `problem_cause_consequence`.
- **Chỗ chưa chắc:** Mốc nghỉ và đệm micro-pause cần đo lại bằng `qc-measure` sau khi Producer chạy TTS thật.