# Schema `final/publish.json`

```json
{
  "video_id": "SPORT-T3-E01",
  "language": "vi",
  "duration_s": 32.4,
  "cover": "thumbnail.jpg",
  "ai_generated_content": true,
  "ai_disclosure": "Video có dùng hình ảnh và giọng đọc do AI tạo.",
  "platforms": {
    "tiktok": {
      "caption": "Nội dung hiển thị, có hook ở câu đầu, ≤ 2000 ký tự (an toàn)",
      "hashtags": ["#chayboi", "#suckhoe"]
    },
    "facebook_reels": {
      "description": "Mô tả ngắn, 1–3 câu + CTA",
      "hashtags": ["#chayboi"]
    },
    "youtube_shorts": {
      "title": "≤ 100 ký tự, có từ khoá chính",
      "description": "Mô tả + #Shorts",
      "tags": ["chạy bộ", "mẹo"]
    }
  },
  "sources": ["tên nguồn + URL cho mọi số liệu/sự kiện (từ script.md)"],
  "assets_used": [{ "file": "assets/bg.png", "origin": "tạo bằng ffmpeg | library/... | do giám đốc cung cấp" }],
  "qc": { "tool": "tools/qc-video.mjs", "pass": true }
}
```
- `ai_generated_content`: **luôn `true`** (giám đốc đã chốt: kênh Cáo văn phòng dùng hình ảnh và giọng đọc do AI tạo). `ai_disclosure` là câu khai báo bắt buộc: chép vào **cuối mô tả của cả 3 nền tảng**. Khi đăng, giám đốc còn bật tuỳ chọn khai báo nội dung AI/tổng hợp của từng nền tảng. Producer không được để `false` hay bỏ câu khai báo.
- 3–5 hashtag/nền tảng, bắt đầu bằng `#`, không dấu cách. Không nhồi hashtag.
- Mọi sự kiện/số liệu phải có trong `sources`.
