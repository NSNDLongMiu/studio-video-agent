# Vị trí "Đạo diễn hình ảnh" — Gemini sinh ảnh (mẫu prompt, KHÔNG phải subagent Claude)

> Mỗi lượt sinh **đúng một ảnh cho đúng một cảnh**. Người điều phối (hoặc `visual-director` qua người điều phối) điền `## BRIEF` rồi ghi file
> `<topic>/<epNN>/review/gemini-images-<scene_id>-r<N>.prompt.md` (đặt tên theo mã cảnh để biết ảnh nào của cảnh nào), gọi
> `node --disable-warning=ExperimentalWarning studio/src/gemini-run.mjs images <file-prompt> <topic_folder>/<epNN>` (luôn dùng gạch xuôi `/`).
> Ảnh được chép vào `<epNN>/assets/gen/` kèm sổ `gen-ledger.jsonl` (công cụ, ngày, lời nhắc, kích thước). **Claude xem từng ảnh** trước khi dùng; Gemini không tự duyệt.
> Mỗi video tối đa **4 cảnh** cần ảnh sinh và tối đa **2 lượt thử** mỗi cảnh. Mô hình ra ảnh dọc khoảng 768×1376: Sản xuất phóng không quá 1,5× lên 1080×1920, nên chỉ dùng cho nền/đạo cụ phong cách phẳng, không cho chi tiết nhỏ.

Hãy sinh **đúng MỘT ảnh** bằng tác tử con `image-generator` của bạn. Không viết mã, không vẽ SVG hoặc ASCII thay ảnh, không sinh thêm ảnh khác, không sửa file nào.

## BRIEF (Claude điền, bỏ mục không áp dụng)
- Mã cảnh và vai trò của ảnh: `<scene_id>` · nền | đạo cụ
- Cảnh đang nói gì (1 câu, lấy từ script): …
- Nội dung chính trong ảnh: …
- Bố cục: …, vùng chừa trống để đặt chữ/sơ đồ/Cáo sau: …
- Phong cách: minh hoạ vector phẳng, bảng màu ấm (cam, kem, xanh lam nhạt) hợp kênh "Cáo văn phòng"; khớp các ảnh trước của cùng video: …
- Ánh sáng/thời điểm/chất liệu (nếu cần): …

## BẮT BUỘC (vi phạm là ảnh bị loại)
- Tỉ lệ **dọc 9:16**; không vuông, không ngang.
- **KHÔNG chữ, số, ký hiệu**, kể cả rất nhỏ trên màn hình, sổ, áo, bảng hiệu, ghế, tranh. Cần chỗ để chữ thì để trống phẳng.
- **KHÔNG logo hay thương hiệu** của bất kỳ hãng nào (không táo cắn dở, không cửa sổ bốn ô, không logo trình duyệt…).
- **KHÔNG người thật, KHÔNG mặt người nhận diện được**; vai phụ nếu cần chỉ là bóng/hình khối.
- **KHÔNG nhân vật cáo**: Cáo văn phòng được ghép sau từ bộ dáng có sẵn.
- Không nội dung bạo lực, nhạy cảm, hay cảnh tin giả/giả sự kiện thật.

## BÁO LẠI (ngắn, tiếng Việt)
Đường dẫn file ảnh · kích thước thật (rộng×cao) · 1 câu mô tả ảnh · nói rõ nếu có chữ/logo/người lọt vào dù đã cấm (không giấu).
