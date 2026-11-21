# Review storyboard IT-T31-E01 — vòng 1 (Claude, Đạo diễn hình ảnh)

Đối chiếu: storyboard.json (DRAFT) với script.md (DUYỆT bản 1), schema, `tools/config/pipeline-rules.json`, `docs/chat-luong-xem.md` (R/Y/D8), mascot.md.

## Bảng chấm
| # | Tiêu chí | Kết quả | Ghi chú |
|---|---|---|---|
| 1 | SHOW, DON'T TELL / minh hoạ thật | Đạt | 10/10 cảnh có minh hoạ thật, có `semantic_plan` đủ; 10/10 cảnh có `texts` gắn đối tượng; không logo/CVE/SCTP/số máy; S06–S07 không vẽ đường xuyên tường (còn chặt hơn script: bỏ cả mũi tên thẻ→hộp). |
| 2 | Đa dạng, nền theo cảnh (Y4, R12, R13) | Đạt (có lưu ý) | Cỡ cảnh xen kẽ medium/wide/close; nền office/security/incident/performance/code, security S03–S05 = 19 s (33%, 3 cảnh liền), có cảnh `code` (S09). Cảnh High S03 = 8,5 s, hold 2,4 s. Cáo ≈ 14,7%. |
| 3 | Khớp kịch bản | Đạt | Lời 10/10 cảnh khớp nguyên văn script; tổng 58 s; `voice_direction` emphasis đều là cụm nguyên văn; đuôi im 0,7 s ở S10. |
| 4 | Dựng được / renderer | Đạt | `pillow-ffmpeg` + lý do rõ (dầm/vách/rạn không có trong component Remotion); crop S04 1,00→1,09 ≤ 1,3×. |
| 5 | Schema | Đạt | Enum, trường bắt buộc, `sound_cues` (silence có `duration_s`), opening ba pha hợp lệ. |
| D8 | Opening / header / chữ / kinetic | Chưa đạt (mục 1, 3) | Xem dưới. |

## Việc cần sửa (đánh số)
1. **S01/opening — vào lời sớm quá luật.** `opening.voice_start_min_s` = 0,6 s nhưng S01 `pause_before_s: 0` (và tick "xong" ở 0,6 s gắn với tiếng đầu). Đặt `pause_before_s ≥ 0.6`, dời các mốc theo lời: tick/xanh web theo "xong rồi" (≈ 1,4–1,6 s), công tắc nghiêng ≈ 2,2 s, hộp cạnh vàng ngay sau "Khoan" (≈ 3,0–3,2 s), `NHÂN` theo đó; tiêu đề giữ ≥ 4,6 s và còn đủ ≥ 1,2 s hiện trọn (nếu cần thì nới opening tới 6,5 s, trừ ở S02 hoặc nới S01 sang trong tổng 58 s, ghi lại). Cập nhật `phases`, `sound_cues`, `semantic_plan.texts` (ĐÃ VÁ, NHÂN) theo mốc mới; `hold_after_voice_s` ≥ 1,0.
2. **Nhân đôi nhãn chương với nhãn đối tượng** (visual_style_note đã tự cấm "không nhân đôi nhãn chương"): S07 nhãn `CHƯA RÕ` trùng header `CHƯA RÕ` → bỏ nhãn `CHƯA RÕ`, giữ dấu `?` (text_groups 3→2); S05 header `MÁY ẢO` trùng nhãn cột `MÁY ẢO` → đổi header chương S05 thành `NHÂN RIÊNG` (sửa ở visual_concept).
3. **Mật độ chữ minh hoạ ≈ 49 từ/phút** (48 từ / 58 s kể cả tiêu đề; trần 45). Giảm ≥ 4–5 từ mà không mất nhãn gọi tên: bỏ `$ uname -r` khỏi `texts` nếu giữ dòng lệnh như hình terminal (không tính chữ), hoặc rút `NHÂN MÁY CHỦ` còn `NHÂN`… (chọn một); gộp S03 `NHÂN LINUX` hiện hai lần thành một nhãn bền từ 3,6 s tới hết (kinetic `MỘT NHÂN CHUNG` đặt cạnh, không đè), bỏ lượt lặp.
4. **S09 chữ hiện quá ngắn:** `NHÂN MÁY CHỦ` và `$ uname -r` chỉ 0,6 s; `ĐÃ VÁ` 0,7 s. Mỗi nhãn ≥ 1,0 s: kéo terminal đóng muộn tới ≈ 2,9 s, dời chip `ĐÃ VÁ` ≈ 2,9, tick nhân ≈ 3,2, hộp cạnh xanh ≈ 3,5, công tắc 4,0 giữ nguyên (điều chỉnh theo TTS).
5. **S03 khoảng 1,9→3,6 s (1,7 s) không có đổi vật** trong timeline: thêm mốc cho từng chân đỡ hạ (ví dụ 2,5 và 3,1), hoặc ghi ba chân hạ so le để R4 (≥ 1 đổi/1,5 s) đạt.

## Không chặn (ghi cho Sản xuất)
- Mốc S03–S09 dựng theo TTS đo thật; hình không đi trước/chậm lời > ~0,3 s.
- S06: bảo đảm thẻ `nginx2root` không đè nhãn `WEB` (cách 36 px như khai).
- Chuyển cảnh `match_cut` S01→S02, S02→S03, S09→S10 phải khớp vật (công tắc, hộp) như khai; nếu không dựng được thì `cut`.

KẾT LUẬN: CẦN SỬA
