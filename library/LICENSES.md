# Sổ nguồn và giấy phép của hình/clip

> Quy tắc: `docs/asset-sources.md`, mục "Nguồn ảnh/clip miễn phí được phép". Mỗi hình/clip **lấy từ ngoài hoặc do AI tạo** và có mặt trong video phải có 1 dòng ở bảng dưới, **ghi trước khi dựng**. QC đối chiếu: thiếu dòng hoặc dùng nguồn cấm thì video rớt.
> Nhạc nền tổng hợp gốc được phép từ 20/11/2026 và mặc định tắt. Đồ hoạ tự tạo bằng phần mềm và 46 dáng Cáo (`brand/cao/`) không cần ghi ở đây.
> **Không ghi email, khoá hay thông tin cá nhân vào sổ này** (repo công khai).

| file | nguồn | URL trang gốc + ID | tác giả | giấy phép (tên + URL) | ngày lấy | cách lấy (tay/API) | người nhận diện? | logo/nhãn hiệu? | đã chỉnh sửa gì | cần ghi công? (chuỗi credit) | do AI tạo? (công cụ, model, ngày, prompt) | dùng ở video | người duyệt + ngày |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| *(dòng ví dụ — xoá khi có dòng thật)* `library/images/vi-du.jpg` | Pexels | https://www.pexels.com/photo/…/ | tên tác giả | Pexels License — https://www.pexels.com/license/ | 2026-11-18 | tay | không | không | cắt 9:16, chỉnh màu | không | không | IT-T1-E01 | tên + ngày |

| `library/sfx/*.wav` | Gốc — sinh bằng `tools/audio/sfx_synth.py` trong repo này, seed từng tệp trong manifest (gốc `cao-van-phong-sfx-v1`); dành cho phạm vi công cộng CC0; không mẫu bên thứ ba | — | Cáo văn phòng | CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/ | 2026-11-20 | mã cục bộ | không | không | — | không | không | theo cue sheet | — |
| Nhạc nền sinh theo yêu cầu | Gốc — sinh bằng `tools/audio/music_synth.py` trong repo này, seed là mã video hoặc `--seed` trong JSON cạnh WAV; dành cho phạm vi công cộng CC0; không mẫu bên thứ ba | — | Cáo văn phòng | CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/ | 2026-11-20 | mã cục bộ | không | không | — | không | không | theo cue sheet | — |
