# Review storyboard IT-T31-E01 — vòng 2 (Claude, Đạo diễn hình ảnh)

## Kiểm 5 điểm của r1
| # | Điểm | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | S01 vào lời sớm | Đã sửa | `pause_before_s` 0,6; tick 1,5, công tắc 2,2, hộp vàng + NHÂN 3,1, tiêu đề 4,6–6,0 (1,4 s ≥ 1,2); phases/sound_cues/texts khớp; hold 1,4 |
| 2 | Nhân đôi nhãn chương | Đã sửa | S07 bỏ `CHƯA RÕ` (text_groups 2); S05 header đổi `NHÂN RIÊNG` |
| 3 | Mật độ chữ | Đã sửa | ≈ 41 từ / 58 s ≈ 42/phút (≤ 45); bỏ `$ uname -r` khỏi texts; S03 `NHÂN LINUX` một nhãn bền 3,6→8,5 |
| 4 | S09 chữ quá ngắn | Đã sửa | NGINX 1,1 s, NHÂN MÁY CHỦ 1,0 s, ĐÃ VÁ 1,1 s; chip 2,9, tick nhân 3,2, hộp 3,5, công tắc 4,0 |
| 5 | S03 khoảng tĩnh | Đã sửa | chân đỡ hạ ở 1,9 / 2,5 / 3,1; mọi khoảng ≤ 1,25 s có đổi |

## Rà lại 5 tiêu chí
1. Show: 10/10 cảnh có minh hoạ thật + semantic_plan; không logo/CVE/CVSS/SCTP/số máy/tình trạng bản vá; S06–S07 không vẽ đường xuyên tường. Đạt.
2. Đa dạng/nền: cỡ cảnh xen kẽ, nền office/security/incident/performance/code (S09), security S03–S05 = 19 s (33%), Cáo ≈ 14,7%, 58 s, 10 cảnh, High S03 8,5 s hold 2,4. Đạt.
3. Khớp script: lời 10/10 cảnh nguyên văn, đuôi im 0,7 s S10. Đạt.
4. Dựng được: `pillow-ffmpeg` + lý do, crop S04 ≤ 1,09×. Đạt.
5. Schema + D8 (opening 6 s ba pha, header, kinetic S03/S10 không liền nhau). Đạt.

## Sửa nhỏ do Claude (ghi rõ)
- S08 (Medium): `hold_after_voice_s` 0,9 → 1,0, `semantic_plan.hold_s` 0,9 → 1,0, `pause_after_s` 0,9 → 1,0 để đạt R13 (Medium ≥ 1,0 s). Tổng cảnh vẫn 5,5 s; Sản xuất đo lại sau TTS, không tăng tốc để bù.

## Ghi cho Sản xuất
- Header S05 dùng `NHÂN RIÊNG` (storyboard), script.md bảng cũ ghi `MÁY ẢO`: theo storyboard.
- Mốc S03–S09 căn theo TTS đo thật; thẻ `nginx2root` cách nhãn `WEB` 36 px; `match_cut` không khớp vật được thì `cut`.

KẾT LUẬN: DUYỆT
