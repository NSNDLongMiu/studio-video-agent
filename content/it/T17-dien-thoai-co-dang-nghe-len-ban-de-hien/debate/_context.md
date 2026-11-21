## NGỮ CẢNH

- **team_id:** 5 (phòng IT, Đội 4) · **topic_id:** 17 · **video:** IT-T17-E01 (thư mục `ep01`), 1 tập.
- **Thư mục gốc dự án:** `D:\Agent Video Studio` · thư mục chủ đề: `D:\Agent Video Studio\content\it\T17-dien-thoai-co-dang-nghe-len-ban-de-hien`
- **Kênh:** "Cáo văn phòng" — linh vật cáo cam công sở dẫn truyện. Khán giả: dân văn phòng Việt Nam dùng điện thoại, Facebook, TikTok hằng ngày.

### Chủ đề
Điện thoại có đang nghe lén bạn để hiển thị quảng cáo?

### Brief của giám đốc (nguyên văn)
[Yêu cầu của giám đốc]
Hook gợi ý: "Bạn vừa nói chuyện với bạn bè về một đôi giày. Chưa từng tìm kiếm nó. Nhưng chỉ vài giờ sau, quảng cáo đôi giày ấy xuất hiện khắp Facebook."
Hướng nội dung: khám phá cách quảng cáo nhắm mục tiêu, dữ liệu hành vi và vì sao nhiều người tin rằng điện thoại đang nghe lén.
Điểm hút: hiện tượng rất nhiều người từng nghi ngờ, nhưng cần phân biệt cảm giác bị nghe lén với bằng chứng thực tế.

[Lưu ý do thư ký ghi thêm theo luật xưởng]
- Phân biệt rõ điều đã được kiểm chứng với điều chỉ là tin đồn hay lời quảng bá của bên bán dịch vụ; không khẳng định "có" hoặc "không" tuyệt đối khi chưa đủ dữ kiện; mọi khẳng định phải có nguồn.
- Không gắn một hãng cụ thể vào cáo buộc nghe lén nếu thiếu nguồn; hook là ví dụ dựng, ghi rõ là ví dụ.
- Theo chuẩn 45–75 giây (mục tiêu ≈ 60 s), một câu hỏi, một cơ chế chính (cách quảng cáo nhắm đúng người mà không cần nghe); các ý còn lại nhắc ngắn.

### Chuẩn xem tóm tắt
- 9:16, 1080×1920, 45–75 s. Opening 1–8 s (mục tiêu 5–8 s) ba pha, có thể chứa lời hook; header nhãn chủ đề nhỏ xuyên suốt (vd "BẢO MẬT / QUẢNG CÁO"). Visual-first: lời giải thích, hình minh hoạ, chữ trên hình chỉ nhấn mạnh thuật ngữ được gọi tên.
- Information pacing: mỗi cảnh một ý; sơ đồ dựng từng bước theo lời, giữ trạng thái hoàn chỉnh 2–3 s. Nền đổi theo ngữ cảnh (≥ 3 bối cảnh). Cáo chỉ ở mở/giữa/kết, nhỏ 10–18% khung.
- Không nhạc nền (mặc định tắt), chỉ giọng + hiệu ứng âm tối giản. Không AI trả phí. Khai báo AI ở mô tả đăng, không đốt nhãn lên hình. Không logo hãng (Facebook/Meta/Google/Apple…) — chỉ nhắc tên bằng chữ khi có nguồn; giao diện điện thoại/mạng xã hội là giao diện giả lập trung tính; không người thật.

### Công cụ sản xuất hiện có
FFmpeg, Pillow, Remotion (component có sẵn: CharacterScene, DataVizScene, ExplainerScene, PromptReviewScene, QASequenceScene, UiSimulationScene), nền tạo bằng `tools/backgrounds/make_background.py` hoặc ảnh nền/đạo cụ do Gemini sinh (không chữ, không logo, không người), giọng TTS tiếng Việt cục bộ (VieNeu, giọng Bắc), Cáo: 46 dáng tĩnh + bộ 12 chuyển động PNG/MOV (không nhép miệng). Không quay thật, không ảnh chụp màn hình hãng.
