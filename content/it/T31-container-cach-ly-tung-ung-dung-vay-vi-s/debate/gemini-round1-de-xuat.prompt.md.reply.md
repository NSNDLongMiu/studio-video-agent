Đủ dữ liệu. Dưới đây là **Vòng 1 — Đề xuất độc lập** của Gemini.

---

# VÒNG 1 — 3 CONCEPT ĐỘC LẬP (Gemini)

**Video IT-T31-E01 · Chủ đề #31:** Container dùng chung nhân Linux — nginx2root minh hoạ hệ quả

---

## Concept 1 — "Sàn nhà nứt"

**Tên:** Sàn nhà nứt — Container an toàn, nhưng nền thì không  
**Hook (≤ 2 s):** Hình: 4 hộp kính đặt trên một tấm sàn bê-tông duy nhất; Cáo đứng cạnh chỉ vào. Chữ: *"Mỗi hộp cách ly hoàn toàn — đúng không?"* → Sàn rạn nứt, vết nứt chạy xuyên lên tất cả các hộp cùng lúc. *(Ví dụ dựng, không phải sự kiện thật.)*  
**Nhịp:**
- **0–3 s (opening ba pha):** visual_hook = sàn nứt; conflict = "web server bị chiếm nhưng chỉ mất cái hộp đó thôi — câu này sai ở đâu?"; topic_reveal = header "Container vs Nhân".
- **3–15 s:** So sánh hai cột (comparison): bên trái = máy ảo — mỗi hộp có nền riêng (nhân riêng trên hypervisor); bên phải = container — tất cả hộp trên MỘT nền (một nhân Linux). Nhấn kinetic: "CÙNG MỘT NHÂN". FlowDiagram: tiến trình container → gọi syscall → nhân duy nhất; lỗi nhân = lỗi bức tường.
- **15–45 s:** Ví dụ thời sự nginx2root (11/2026, blog Cloudflare 20/11/2026 — [nguồn](https://blog.cloudflare.com/nginx2root/)): lỗi bộ nhớ HTTP/2 trong web server cho phép chạy mã bên trong container → lỗi này *một mình* chưa ra ngoài được → nhưng ghép thêm lỗi ở hệ thống con SCTP của nhân → leo quyền root trên máy chủ, xuyên qua mọi container ([nguồn: CrowdStrike](https://crowdstrike.com), [Sysdig](https://sysdig.com)). Dựng: status_indicator chuyển ok→warn→bad; FlowDiagram gói dữ liệu "leaking" từ container ra nhân.
- **45–55 s (kết):** Đánh đổi: container nhẹ-nhanh VÌ dùng chung nhân, và đó cũng là giá. Việc làm: vá *cả* web server *lẫn* nhân máy chủ. Cáo gật đầu, chữ: "Nhân chung — tiện lợi chung, rủi ro chung." Câu chốt giải quyết vấn đề mở đầu: sàn nứt thì mọi hộp đều lung lay. Kêu gọi nhẹ: *"Bạn vá nhân lần cuối khi nào? Gõ xuống bình luận."*

**Vì sao giữ chân:** Stakes cao — dev/DevOps ai cũng nghĩ container = an toàn → câu hỏi "sai ở đâu?" tạo khoảng cách nhận thức ngay giây 1; hình sàn nứt là ẩn dụ trực quan dễ hiểu kể cả ngoài nghề; ví dụ nginx2root cách 3 ngày tạo tính thời sự.  
**Tín hiệu trích:** [google gợi ý] "container là gì trong lập trình", "container escape vulnerability" — người dùng đang tìm hiểu cơ bản + muốn hiểu rủi ro.  
**Cách làm:** `comparison` hai cột (VM vs container); `FlowDiagram` gói dữ liệu leaking; `status_indicator`; `kinetic_text` "CÙNG MỘT NHÂN"; nền `--theme security`; Cáo tĩnh 3 lần (mở/giữa/kết); opening ba pha. Không logo, không giao diện sản phẩm.  
**Rủi ro thừa nhận:** Ẩn dụ "sàn nhà" có thể quá đơn giản hoá — dev kinh nghiệm thấy thiếu chiều sâu kỹ thuật. Cần lời thoại bù bằng thuật ngữ namespace/cgroup ở đoạn giữa.

---

## Concept 2 — "Bức tường do chính kẻ gác xây"

**Tên:** Bức tường do kẻ gác dựng — Nhân là cả tường lẫn nền  
**Hook (≤ 2 s):** Hình: sơ đồ bước (process_animation) — một "người gác" (biểu tượng khiên, không phải người thật) đang xây bức tường ngăn giữa hai phòng; mũi tên chỉ: "Người gác = Nhân Linux". Cáo đứng bên ngoài, chữ: *"Lỗi ở người gác thì tường có còn không?"* *(Ví dụ dựng.)*  
**Nhịp:**
- **0–3 s (opening ba pha):** visual_hook = khiên + tường; conflict = "bức tường của container do chính nhân dựng — lỗi nhân = tường sụp"; topic_reveal = header "Nhân Linux — kẻ gác cổng".
- **3–15 s:** `timeline_steps`: Bước 1 "Container khởi động" → Bước 2 "Nhân tạo namespace (phòng riêng)" → Bước 3 "Nhân tạo cgroup (giới hạn tài nguyên)" → Bước 4 "Mọi container gọi chung nhân". Kinetic nhấn: "MỘT nhân". So sánh nhanh: VM có hypervisor + nhân riêng → tường do phần cứng ảo hoá (Intel VT-x), không phụ thuộc 1 nhân.
- **15–42 s:** Dẫn nginx2root: web server dính lỗi HTTP/2 (CVE-2026-123007, CVSS 9.2 — [nguồn: The Hacker News](https://thehackernews.com)) → mã độc chạy trong container, quyền thấp → ghép lỗi ở hệ thống con SCTP *của nhân* (nhân dùng chung!) → leo thành root máy chủ. Dựng: `FlowDiagram` hai bước (container→nhân), gói dữ liệu trạng thái `blocked` → `leaking`; `status_indicator` bad. **Không tả cách khai thác chi tiết**, chỉ nêu cơ chế "lỗi nhân = phá tường."
- **42–55 s (kết):** Đánh đổi: container nhẹ vì bỏ nhân riêng, nhưng mất một lớp bảo vệ phần cứng. Việc làm: vá web server + vá nhân. Câu chốt: "Nhân là kẻ gác — kẻ gác ngã thì mọi phòng đều mở." Kêu gọi: *"Bình luận: team bạn vá nhân theo lịch hay chờ sự cố?"*

**Vì sao giữ chân:** Ẩn dụ "kẻ gác = nhân" cho thấy nhân vừa là bảo vệ vừa là điểm yếu — tạo nhận thức kép ngay từ đầu, không chỉ "container không an toàn" mà hiểu *tại sao*. Dev SA thấy cơ chế namespace/cgroup nên dễ liên hệ.  
**Tín hiệu trích:** [google gợi ý] "container escape vulnerability", "docker container escape" — người tìm đúng mô hình tấn công; [ytb gợi ý] "docker container là gì" — người mới cần giải thích.  
**Cách làm:** `timeline_steps` (4 bước nhân tạo cách ly); `FlowDiagram` blocked→leaking; `comparison` VM vs container (nhỏ, trong đoạn giữa); `status_indicator`; nền `--theme security`; Cáo tĩnh 3 lần; header xuyên suốt.  
**Rủi ro thừa nhận:** "Kẻ gác" có thể bị hiểu nhầm là một tiến trình riêng (daemon), trong khi nhân là lõi hệ điều hành. Lời thoại cần nói rõ nhân = phần lõi mà mọi tiến trình đều phải đi qua, không phải "chương trình gác".

---

## Concept 3 — "Chung cư một móng"

**Tên:** Chung cư một móng — Container escape qua lỗi nhân  
**Hook (≤ 2 s):** Hình: sơ đồ cắt dọc toà chung cư — nhiều tầng (mỗi tầng = 1 container), nhưng **chỉ 1 móng** (nhân); bên cạnh là biệt thự đơn lẻ (VM — mỗi căn có móng riêng). Cáo chỉ vào móng, chữ: *"Móng nứt — sập tầng nào?"* *(Ví dụ dựng.)*  
**Nhịp:**
- **0–3 s (opening ba pha):** visual_hook = chung cư sơ đồ hoá, mobile nứt; conflict = "tất cả, vì chung cư chỉ có MỘT móng"; topic_reveal = header "Container: chung nhân, chung rủi ro".
- **3–12 s:** Giải thích nhanh bằng `process_animation`: (1) Container = tiến trình chạy trên máy chủ, (2) Nhân dùng namespace + cgroup để tạo "phòng riêng" cho từng tiến trình, (3) Khác VM: VM chạy nhân riêng trên hypervisor → "mỗi biệt thự mỗi móng". Kinetic nhấn: "DÙNG CHUNG".
- **12–40 s:** Ví dụ thực tế nginx2root (công bố 18/11/2026): lỗi bộ nhớ HTTP/2 trong web server (CVSS 9.2) → xâm nhập container → ghép lỗi SCTP ở nhân (nhân chung!) → "nứt móng" → ảnh hưởng tất cả container trên máy chủ. Dựng: sơ đồ chung cư, vết nứt từ móng lan lên từng tầng (FlowDiagram leaking, từ dưới lên). Cloudflare tự vá trước khi công bố, nhưng máy chủ chạy trực tiếp vẫn phải tự vá ([blog Cloudflare 20/11/2026](https://blog.cloudflare.com/nginx2root/)). **Lưu ý brief:** bước lên root cần ghép thêm lỗi nhân chưa công bố đầy đủ chi tiết — không khẳng định "root ngay lập tức".
- **40–55 s (kết):** Đánh đổi rõ ràng: container nhanh-nhẹ **vì** bỏ nhân riêng (một mobile thay vì biệt thự) — đó là lý do tồn tại, và cũng là giá. Việc làm: vá web server **và** nhân máy chủ — thiếu 1 trong 2 vẫn nguy. Câu chốt: "Chung cư tiện nhưng chung móng — giữ móng chắc là việc của bạn." Kêu gọi: *"Lần tới deploy container, bạn kiểm nhân chưa? Gõ bên dưới."*

**Vì sao giữ chân:** Ẩn dụ chung cư/biệt thự rất quen với người Việt — ngay cả người ngoài nghề cũng hiểu "móng nứt → sập cả toà". Câu hỏi "sập tầng nào?" tạo tò mò hệ quả cụ thể. Ví dụ cách 3 ngày tạo urgency.  
**Tín hiệu trích:** [google gợi ý] "container là gì docker", "container là gì trong lập trình" — đúng nhóm mới tìm hiểu; [tin mới] blog Cloudflare 20/11/2026 — tính thời sự.  
**Cách làm:** `process_animation` (sơ đồ cắt dọc chung cư, vẽ bằng Pillow — hình chữ nhật xếp tầng + 1 khối móng); `FlowDiagram` leaking từ dưới lên; `comparison` VM biệt thự vs container chung cư (nhỏ, 1 khung); `kinetic_text` "DÙNG CHUNG"; nền `--theme security`; ảnh AI tĩnh cho cảnh sơ đồ chung cư/biệt thự (≤ 2 cảnh, không chữ/logo/người). Cáo tĩnh 3 lần.  
**Rủi ro thừa nhận:** Ẩn dụ chung cư có thể khiến người xem nghĩ "container = kém" và bỏ container. Lời thoại cần nhấn đánh đổi (nhanh-nhẹ) chứ không chỉ nêu rủi ro; tránh tạo FUD.

---

### Tổng hợp nhanh

| # | Tên | Ẩn dụ trung tâm | Điểm mạnh | Điểm yếu |
|---|---|---|---|---|
| 1 | Sàn nhà nứt | Sàn chung = nhân chung | Trực quan nhất, hook mạnh | Có thể quá đơn giản cho dev kinh nghiệm |
| 2 | Bức tường do kẻ gác | Nhân vừa xây tường vừa là điểm yếu | Giải thích cơ chế sâu nhất (namespace/cgroup) | "Kẻ gác" dễ hiểu nhầm thành daemon |
| 3 | Chung cư một móng | Chung cư/biệt thự = container/VM | Quen với người Việt, dễ viral | Dễ tạo FUD "container = kém" |