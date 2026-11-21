Bản nháp do Gemini (mô hình gemini-3.8-flash-high) viết thay Codex (giám đốc duyệt, 2026-11-21). Chỉ Claude (visual-director) review và đặt APPROVED.

# Storyboard BONG-DA-T29-E01 · Ai lấp ô hậu vệ? (DRAFT vòng 3)

- **Video ID:** `BONG-DA-T29-E01` | **Chủ đề:** #29 Bóng đá tổng lực: khi hậu vệ dâng lên tấn công thì ai lấp vào chỗ trống phía sau?
- **Trạng thái:** `DRAFT` (bản sửa vòng 3) | **Renderer:** `pillow-ffmpeg`
- **Tổng thời lượng:** 57,7 s (10 cảnh S01–S10; opening S01–S02 = 7,6 s)
- **Tỉ lệ có Cáo:** 3/10 cảnh (S02 3,0 s + S07 2,2 s + S10 2,4 s = 7,6 s ≈ 13,2% ≤ 15%); **Talking-head ratio:** 0%

## Bảng tóm tắt cảnh

| Cảnh | Thời lượng | Nền | Cỡ cảnh & Camera | Scene Type | Chữ trên màn hình | Lời đọc tóm tắt | Cáo |
|---|---|---|---|---|---|---|---|
| S01 | 3,3 s | N1 (sân cỏ xanh #183827) | Wide · static | process_animation | `HẬU VỆ`<br>`Ô TRỐNG` | Hậu vệ lên tận đây. Ai giữ nhà? | Không |
| S02 | 4,3 s | N1 (sân cỏ xanh #183827) | Wide · push_in (1,15×, neo x_anchor≈600, dịch x≤70) | process_animation | `AI LẤP Ô TRỐNG?` (kinetic)<br>`Ô TRỐNG` | Bóng mất. Ô này đang hở. Ai lấp? | Có (`surprised`, x≈165) |
| S03 | 5,0 s | N2 (navy lam #0E1E36) | Medium · static | process_animation | `TRONG PHA NÀY`<br>`TIỀN VỆ` | Trong pha này, tiền vệ cánh gần ô nhất, nên lùi xuống lấp. | Không |
| S04 | 6,0 s | N2 (navy lam #0E1E36) | Close-up · static | process_animation | `NHIỆM VỤ` (kinetic)<br>`HẬU VỆ`, `TIỀN VỆ` (mờ) | Bóng đá tổng lực nhìn vị trí như nhiệm vụ. Ai gần ô nhất thì làm. | Không |
| S05 | 8,0 s | N1 (sân cỏ xanh #183827) | Medium · pan_right (1,15×, dịch x=80) | process_animation | `Ô THỨ HAI` | Nhưng tiền vệ vừa lùi, để lại một ô mới hở. Đồng đội ở giữa trượt sang bù, ô này hết hở. | Không |
| S06 | 6,4 s | N3 (xanh rêu tối #152A1E) | Wide · static | process_animation | `CÙNG LAO RA`<br>`KHÔNG AI LẤP` | Sai lầm: cả hai cùng lao ra theo bóng, ô lại hở. Hoặc ai cũng tưởng người kia lấp. | Không |
| S07 | 6,0 s | N2 (navy lam #0E1E36) | Close-up · static | comparison_scene | `GẦN Ô` (kinetic)<br>`GẦN BÓNG` | Người gần bóng phải vòng, người gần ô lùi thẳng. Lấp ô: gần ô, đừng gần bóng. | Có (`idea`, x≈90) |
| S08 | 6,9 s | N3 (xanh rêu tối #152A1E) | Wide · pull_out (1,2× → 1,0×) | process_animation | `SAU BÓNG` | Đội thường để sẵn vài người phía sau bóng khi đang tấn công. Nên ô thường được lấp trước khi bóng mất. | Không |
| S09 | 6,0 s | N1 (sân cỏ xanh #183827) | Wide · static | comparison_scene | `ĐÃ LẤP` | Quay lại pha ban đầu. Đối phương chạy vào, nhưng ô đã đầy. | Không |
| S10 | 5,8 s | N4 (gradient ấm #2A1810) | Medium · static | character_acting | `NHÌN Ô TRƯỚC` (kinetic)<br>`HẬU VỆ`, `TIỀN VỆ` (gạch) | Lần sau, nhìn ô, đừng nhìn tên vị trí. Đá phủi thì hô: tôi lấp! | Có (`thumbs_up`, x≈90) |

## Điểm đã sửa ở vòng 3

1. **Nền N3 thống nhất (S06, S08, `visual_style_note`):** Viết một định nghĩa N3 duy nhất dùng y hệt ở cả 3 vị trí: `Nền N3: Sa bàn toàn cảnh phân tích cấu trúc trên nền xanh rêu tối (#152A1E), vạch chia 3 dải hành lang chiến thuật mờ, tương phản cao tách biệt hoàn toàn với N2 navy lam (#0E1E36) và N1 xanh cỏ (#183827), nhìn rõ cấu trúc đội hình ở 360×640`. Đồng thời cập nhật N2 thành navy lam tối `#0E1E36` để phân biệt sắc thái triệt để.
2. **S05 `pan_right`:** Nâng zoom lên 1,15× (khung crop 939×1670 px, biên dịch tối đa 141 px) và giảm độ dịch ngang xuống 80 px (≤ 90 px), an toàn tuyệt đối trong biên crop; cập nhật đồng bộ `visual_concept`, `environment`, `props` và `animation_timeline`.
3. **S02 `push_in`:** Xác định rõ điểm neo zoom ở giữa-phải (x_anchor≈600, y_anchor≈945, x dịch tối đa ≤ 70 px); dời Cáo vào trong x≈165–335 để cách mép crop trái ≥ 95 px (hoàn toàn không bị cắt); nêu rõ tiêu đề `AI LẤP Ô TRỐNG?` ở y≈260–380 nằm an toàn trong khung nhìn sau zoom và phụ đề được vẽ/burn-in SAU bước zoompan nên cố định ở dải dưới y≈1340–1500, không bị phóng theo camera.
