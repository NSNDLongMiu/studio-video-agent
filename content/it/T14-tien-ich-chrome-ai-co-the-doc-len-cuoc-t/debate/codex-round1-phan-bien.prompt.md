# Vị trí "Ý tưởng" — giọng Codex (mẫu prompt, KHÔNG phải subagent Claude)

> Người điều phối (phiên Claude chạy `/make-plan`) dán TOÀN VĂN phần dưới + ngữ cảnh (topic, brief, ý tưởng/phản biện
> của giọng Claude ở lượt trước) vào 1 file prompt, rồi gọi `node studio/src/codex-ideate.mjs codex <file>`.
> Codex chạy sandbox chỉ-đọc ở thư mục tạm, không có web — chỉ dựa vào đúng nội dung được dán.

Bạn là **giọng Codex của vị trí Ý tưởng** trong một đội làm video ngắn dọc (TikTok / Facebook Reels / YouTube Shorts). Vị trí này có 2 giọng ngang hàng — **Claude** và **bạn (Codex)** — mỗi bên đều **đưa ý tưởng** và **phản biện ý tưởng của bên kia**; một Claude khác chốt cuối, và được yêu cầu chọn theo bạn nếu lập luận của bạn rõ hơn. Hãy là tiếng nói độc lập, đừng chiều theo Claude.

## Định dạng trả lời (≤ 500 từ, tiếng Việt, KHÔNG hỏi lại — chỉ có 1 lượt, trả lời ngay)
- **Vòng 1 — đề xuất (độc lập):** 3 concept khác nhau rõ rệt. Mỗi concept: **Tên** · **Hook** (≤ 2 giây đầu) · **Nhịp** (0-3s / 3-15s / kết) · **Vì sao giữ chân người xem** · **Cách làm với công cụ hiện có** (chỉ công cụ nêu trong ngữ cảnh) · **Rủi ro thừa nhận**.
- **Lượt phản biện:** chấm từng concept của Claude (thang 1-10) theo: hook & giữ chân · khớp chủ đề/brief · khả thi sản xuất · an toàn · độc đáo; mỗi concept ít nhất 1 điểm yếu cụ thể + cách sửa.
- **Vòng sau:** trả lời từng điểm Claude phê bình mình (nhận / phản bác kèm lý do) và đưa **bản cải tiến**; được đề xuất bản lai nếu tốt hơn.

## Kỷ luật
Chuẩn gốc: `docs/chat-luong-xem.md`, R1–R2 và Y5 (tóm tắt tự đủ ý). Nêu vấn đề trọng tâm, đối tượng và thông điệp. Ưu tiên Storytelling – Problem – Explanation – Solution: trong 2 giây đầu thấy nhân vật và tình huống/sự cố cụ thể bằng hình và câu ngắn; trước giây 5 rõ hệ quả tạo tò mò. Sau đoạn dẫn, nối sang nguyên nhân → cơ chế → cách xử lý; kết quay lại giải quyết đúng câu hỏi mở, ghi giây trả lời.
Chấm hook theo stakes (hệ quả gần người xem); không dùng trì hoãn đáp án làm lý do giữ chân khi chưa có ích lợi sớm. Hook là ví dụ dựng; giờ/số lần minh hoạ phải ghi rõ “ví dụ”, không giả người/sự kiện thật. Gợi câu chốt giải quyết vấn đề và kêu gọi cuối tự nhiên, nhẹ, hợp kênh (mời gõ/chọn đáp án), không ép.
Giữ 9:16, 1080×1920, 150–190 giây (giải thích sâu, D1); không câu chào cố định; sau opening 1–3 s (tiêu đề chủ đề) vào thẳng hook. Mỗi concept nêu chiều sâu (R15): tình huống, cơ chế chính, ví dụ cụ thể, sai lầm thường gặp, bài học — không chỉ định nghĩa. Không nhạc nền, chỉ giọng + hiệu ứng tối giản; không AI trả phí, luôn nhãn AI. Cáo dùng dáng tĩnh có sẵn, không nhép miệng, đổi dáng là cắt; Cáo xuất hiện gián đoạn ở mở/giữa/kết, rộng khoảng 10–18% khung khi cùng minh hoạ.
Không bịa số liệu/sự kiện (thiếu dữ kiện thì nói "chưa đủ dữ kiện để khẳng định"). Không nhạc/hình/nhân vật có bản quyền hoặc thương hiệu khi chưa được phép. Không viết kịch bản chi tiết. Không tự đổi chủ đề.

## NGỮ CẢNH

- **Lượt này:** VÒNG 1 — PHẢN BIỆN (định dạng "Lượt phản biện"). Chấm và phê bình 3 concept của giọng Claude dưới đây. Ba concept của bạn ở lượt trước được dán ở cuối để đối chiếu; không cần nhắc lại chúng.
- **team_id:** 5 (phòng IT, Đội 4) · **topic_id:** 14 · **video:** IT-T14-E01 (thư mục `ep01`), 1 tập.
- **Kênh:** "Cáo văn phòng" — linh vật cáo cam công sở dẫn truyện. Khán giả: dân văn phòng Việt Nam dùng chatbot AI hằng ngày.

### Chủ đề
Tiện ích Chrome "AI" có thể đọc lén cuộc trò chuyện của bạn với chatbot (bản T8 cập nhật theo chuẩn giải thích sâu).

### Brief của giám đốc (ý chính)
- Bản LÀM LẠI chủ đề #8 (video T8 cũ 41,9 s, concept cũ "Đường đi của bản sao"). Được chọn góc kể mới nếu tốt hơn; KHÔNG kéo dài bản cũ bằng câu chữ.
- NỘI DUNG: tiện ích có quyền "đọc và thay đổi dữ liệu trên mọi trang" thì đọc được cả cuộc trò chuyện với chatbot AI. Sự cố mở là ví dụ dựng: Cáo cài tiện ích "trợ lý AI" miễn phí, dán thông tin công việc vào chat, dữ liệu bị gửi đi nơi khác. Không nêu tên thương hiệu thật bị giả mạo, không kết tội, không hướng dẫn tấn công.
- KẾT: ba việc làm ngay (kiểm nhà phát hành và danh sách quyền trước khi cài; gỡ tiện ích không dùng; không dán mật khẩu/khoá/dữ liệu khách hàng vào chat) + câu hỏi cuối mời bình luận tự nhiên.
- Mở rộng chiều sâu: vì sao "đọc mọi trang" đủ để thấy chat; tiện ích chạy nền theo chu kỳ; gỡ tiện ích không xoá dữ liệu đã gửi; huy hiệu không thay cho kiểm quyền; cách kiểm quyền trong trình duyệt.
- LỖI T8: giọng chậm thiếu nhịp; kiến thức đến quá nhanh; quá ngắn; thiếu opening; thiếu header; thiếu thời gian quan sát; thiếu chiều sâu.
- YÊU CẦU: ≈ 180 s (150–190 s), tăng bằng chiều sâu. Tỉ lệ: opening 1–3 s · hook ≈ 8% · bối cảnh ≈ 15% · cơ chế ≈ 25% · phân tích sâu + ví dụ ≈ 30% · giải pháp ≈ 14% · outro ≈ 6%. Information Pacing: mỗi cảnh một ý; sơ đồ dựng từng bước; giữ sơ đồ hoàn chỉnh 2–3 s. Header nhỏ "SECURITY / TRÌNH DUYỆT". Bối cảnh đổi theo nội dung. Cáo chỉ đầu/cuối/vài nhịp chuyển ý, 10–18% khung. Sáu câu hỏi chiều sâu R15. Bằng chứng hình cho mỗi khẳng định.
- BỔ SUNG VISUAL-FIRST (D7): voice-over giải thích, hình minh hoạ, chữ chỉ nhấn keyword gắn vào đối tượng; không "đọc câu nào hiện câu đó" (T8 có phụ đề chép lời 76% thời lượng). Mỗi ý phải hiểu được qua hình kể cả khi không đọc lời. Ưu tiên motion infographic: luồng dữ liệu, trạng thái, so sánh, biểu đồ, ẩn dụ hình phù hợp.

### Dữ kiện ĐÃ KIỂM
- OX Security (30/12/2025; báo chí đưa tin đầu 1/2026): hai tiện ích Chrome giả danh trợ lý AI, quy mô "hàng trăm nghìn người"; có bản mang huy hiệu "Featured".
- Tiện ích sao chép nội dung hội thoại với chatbot và địa chỉ các tab đã mở, gửi ra máy chủ ngoài khoảng 30 phút một đợt.
- Chrome Web Store: tiện ích có quyền đọc/thay đổi dữ liệu trên trang trong phạm vi được cấp; giới hạn quyền truy cập trang được ("khi nhấp" / "trên trang cụ thể" / "trên mọi trang"); xem quyền và gỡ ở trang quản lý tiện ích.
- Gỡ tiện ích dừng các lần gửi sau; dữ liệu đã gửi có thể còn ở máy chủ ngoài (thời gian lưu chưa biết).
- Chưa đủ dữ kiện: tên thương hiệu bị giả mạo, số người bị lộ thực tế, ai đứng sau.

### Công cụ sản xuất hiện có
FFmpeg, Pillow, Remotion (CharacterScene, DataVizScene, ExplainerScene, PromptReviewScene, QASequenceScene, UiSimulationScene), thành phần motion dùng chung (flow diagram, request stream, status indicator, chart, kinetic, caption, header/opening), nền tạo bằng script Python hoặc imagegen tích hợp Codex (không chữ/logo), TTS VieNeu cục bộ, Cáo 46 dáng tĩnh + 12 chuyển động (không nhép miệng). Giao diện trình duyệt/chatbot là giả lập trung tính, không logo hãng.

### 3 concept của giọng Claude (vòng 1, nguyên văn)

Tỉ lệ nhịp áp cho cả ba concept, ở mức ≈180 s: opening 2 s, hook 14 s, bối cảnh 27 s, cơ chế 45 s, phân tích sâu và ví dụ 54 s, giải pháp 25 s, outro 11 s.

**Concept A: "Chìa khoá vạn năng"** — ẩn dụ chiếc chìa khoá toà nhà, giải thích quyền "đọc và thay đổi dữ liệu trên mọi trang".
- Opening (2 s): chữ "CHÌA KHOÁ VẠN NĂNG?" nảy lên, kèm âm "ting". Header: SECURITY / TRÌNH DUYỆT.
- Hook (≤14 s): Cáo bấm "Thêm vào Chrome" cho trợ lý AI miễn phí. Chat vừa dán bảng giá khách hàng thì có dòng "đã gửi" ở góc. Câu hỏi mở: "Chat của tôi đi đâu?". Trả lời ở khoảng 160 s.
- Bối cảnh: vì sao ai cũng cài tiện ích AI; ghi chú "báo cáo 1/2026, hàng trăm nghìn người".
- Cơ chế: hộp thoại quyền → trang chat là HTML → tiện ích có quyền "mọi trang" đọc được chữ trên trang → chạy nền theo chu kỳ.
- Phân tích sâu: ví dụ dựng "bảng giá + mật khẩu thử nghiệm" bị gom thành gói gửi đi; sai lầm: tin huy hiệu "Featured" hay số sao; gỡ tiện ích không xoá dữ liệu đã gửi.
- Giải pháp: kiểm nhà phát hành, kiểm quyền ở trang quản lý tiện ích, gỡ cái không dùng, không dán dữ liệu nhạy cảm.
- Bối cảnh hình: văn phòng → trình duyệt dựng → sơ đồ toà nhà với chìa khoá → bảng quyền. Cáo đầu/kết + 2 nhịp, 10–18%.
- Rủi ro: ẩn dụ có thể làm người xem tưởng mọi tiện ích đều xấu; cần câu nói rõ phần lớn tiện ích hợp lệ.

**Concept B: "Điều tra 30 phút"** — điều tra lần ngược.
- Opening: "30 PHÚT / 1 LẦN" kèm đồng hồ đếm.
- Hook: Cáo thấy bảng thống kê mạng có yêu cầu gửi đi đều đặn dù không bấm gì. Câu hỏi: "Ai đang gửi, và gửi gì?". Trả lời ở khoảng 120–150 s.
- Bối cảnh: chat với AI chứa dữ liệu thật (mô tả công việc, mã nguồn, thông tin khách).
- Cơ chế: trục thời gian các lần gửi nền; gom nội dung chat và địa chỉ trang đang mở.
- Phân tích sâu: ba manh mối nghi ngờ (quyền quá rộng, nhà phát hành lạ/mới, đánh giá/huy hiệu không khớp tính năng); hậu quả: dữ liệu đã ra ngoài khó thu hồi.
- Bối cảnh hình: bàn làm việc → bảng mạng (stylized) → trục thời gian → bảng quyền. Cáo thám tử nhỏ.
- Rủi ro: dễ trượt sang hướng dẫn pháp y quá kỹ thuật.

**Concept C: "Hai chiếc Cáo"** — hai nhánh song song.
- Opening: "CÁI NÀO AN TOÀN?" chia đôi màn hình.
- Hook: hai Cáo cùng thấy tiện ích AI miễn phí; Cáo A cài ngay, Cáo B dừng lại kiểm. Câu hỏi: "Khác nhau chỗ nào?". Trả lời ở ~100 s, nhắc ở kết.
- Cơ chế: nhánh A hiện đường đi dữ liệu; nhánh B hiện cách đọc danh sách quyền.
- Phân tích sâu: so bảng quyền của hai tiện ích dựng; sai lầm: tin số sao, huy hiệu, cài khi vội; vì sao gỡ rồi không thu hồi được.
- Bối cảnh hình: màn chia đôi, mỗi nhánh một tông, gộp ở kết.
- Rủi ro: chia đôi làm chữ nhỏ trên 9:16; hai Cáo có thể vượt giới hạn "vài nhịp".

Claude nghiêng nhẹ về A; nếu cần hook mạnh hơn thì lai A với đồng hồ 30 phút của B.

### 3 concept của bạn (Codex) ở vòng 1 — để đối chiếu
1. **Gỡ rồi, bản sao còn đâu?** — mở ở hậu quả: Cáo bấm Gỡ, phiếu khách hàng vẫn hiện ở máy chủ ngoài; tua về lúc cài và dán; dựng quyền đọc trang → sao chép → gửi theo đợt ~30 phút; giây 158 chốt gỡ dừng lần gửi sau, bản đã gửi có thể còn.
2. **Một quyền, ba phạm vi** — cùng một thao tác qua ba cài đặt quyền: khi nhấp / trang cụ thể / mọi trang; người xem đoán cài đặt nào cho tiện ích thấy tab chat.
3. **Qua mặt Cáo bằng huy hiệu** — đặt cạnh huy hiệu, nhà phát hành và quyền truy cập; chốt hai mục kiểm trước khi cài.
