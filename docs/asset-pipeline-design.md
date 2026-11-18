# Asset Pipeline — thiết kế (chưa cài đặt, chưa tải model, chưa phát sinh chi phí)

> Theo đúng mục 9 của chỉ đạo Giai đoạn 2: chỉ thiết kế Asset Catalog, metadata, và giao diện kết nối Asset Provider song song với tích hợp Producer. Chưa cài ComfyUI/model local.

## 1. Asset Catalog (schema dữ liệu)
Mở rộng `studio/renderer-remotion/src/assetManager.js` (đã có 46 pose Cáo) thành 1 catalog tổng cho MỌI loại asset, không chỉ pose nhân vật:

```json
{
  "asset_id": "cao_desk_typing",
  "kind": "character_pose | background | prop | ui_element | illustration | texture | logo",
  "source": "sticker_png | css_component | generated_ai | external_license",
  "path_or_component": "brand/cao/poses/desk_typing.png",
  "tags_topic": ["van-phong", "lam-viec"],
  "tags_action": ["ngoi", "go-phim"],
  "tags_context": ["desk", "indoor"],
  "resolution": "462x1080",
  "license": "noi_bo_studio | free_opensource | can_kiem_tra",
  "reusable": true,
  "status": "AVAILABLE | REUSABLE | GENERATABLE | MISSING | UNSUPPORTED"
}
```
Lưu tại `studio/schema/asset-catalog.schema.json` (chưa tạo file, đây là thiết kế cấu trúc).

## 2. Asset Provider interface (giao diện, chưa có implementation AI)
```js
// studio/renderer-remotion/src/assetProvider.js (du kien)
export async function resolveAsset(request) {
  // request: {kind, description, constraints: {character_consistency: true, max_cost: 0}}
  // tra ve: {status: 'AVAILABLE'|'REUSABLE'|'GENERATABLE'|'MISSING'|'UNSUPPORTED', asset_id?, path?, reason}
}
```
- **Provider hiện có (duy nhất, đã hoạt động):** `LocalCatalogProvider` — tra `assetManager.js` + thư mục `brand/cao/`. Luôn free.
- **Provider dự kiến (chưa cài):** `ComfyUIProvider` — chỉ kích hoạt khi giám đốc duyệt riêng, kiểm GPU/VRAM trước (đã kiểm: AMD RX 6600, không phải NVIDIA → cần DirectML, chậm hơn, cần đo thực tế trước khi dùng thật).
- Visual Director gọi `resolveAsset()` khi lập storyboard; nếu trả `MISSING`/`UNSUPPORTED` → ghi vào `needs_redesign_reason` hoặc liệt kê trong báo cáo "asset còn thiếu", **không tự thay bằng slide chữ**.

## 3. Asset Post-processing & QC (tái dùng Pillow, không cần công cụ mới)
Giữ nguyên Pillow cho resize/crop/alpha/color-correction khi cần chuẩn hoá asset mới (hiện chưa có asset "mới" nào cần, vì 100% asset hiện dùng là 46 pose có sẵn + CSS component).

## 4. Trạng thái: CHỈ THIẾT KẾ
- Chưa tạo `asset-catalog.schema.json`.
- Chưa viết `assetProvider.js` thật (mới có interface dự kiến ở trên).
- Chưa cài ComfyUI, chưa tải model, chưa phát sinh chi phí — đúng yêu cầu.
- Ưu tiên tiếp theo đã nêu rõ: hoàn thiện Producer trước khi mở rộng sang Asset Pipeline thật.
