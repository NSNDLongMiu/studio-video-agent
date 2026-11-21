Đã đủ dữ liệu. Dưới đây là **Vòng 1 — đề xuất độc lập** của Gemini.

---

## Vòng 1 — 3 Concept (Gemini)

### Concept G1: "Điện thoại nghe thấy bạn nhìn nó"
**Trục cơ chế chính:** Âm lượng báo thức bị điều khiển ngầm — thanh trượt sai & Attention Aware (iPhone Face ID tự hạ âm khi bạn nhìn màn hình; Apple Support — Settings > Accessibility > Face ID & Attention).

**Hook (≤ 2 s):** *(Ví dụ dựng)* Mô phỏng màn hình điện thoại hiện "⏰ 06:00" → Cáo nằm giường mở mắt nhìn → âm lượng chuông thu nhỏ dần, biểu tượng loa tụt xuống 0. Chữ: "Nó biết bạn đang nhìn."

**Nhịp:**
- 0–3 s: Opening 3 pha — hook hình (Cáo ngủ, đồng hồ nhảy 06:00→08:00), conflict ("kiểm tra hai lần rồi mà!"), topic reveal ("Lỗi không ở đồng hồ — lỗi ở thanh âm lượng").
- 3–15 s: Mô phỏng UI điện thoại: thanh trượt Ringtone & Alerts tách khỏi thanh Media (iOS) / thanh Alarm tách khỏi thanh Ring (Android). Dựng song song 2 cột so sánh: "bạn vặn nhỏ" vs "báo thức thật sự nghe". Giải thích: nút vật lý tuỳ cài đặt "Change with Buttons" có thể kéo cả âm lượng chuông lẫn báo thức xuống (Apple Support — Settings > Sounds & Haptics).
- 15–45 s: Tiết lộ Attention Aware — camera Face ID hạ âm khi phát hiện mắt nhìn → sơ đồ bước: mắt → TrueDepth → hạ volume. Cáo giữa, chỉ sơ đồ. Chuyển sang cách kiểm: mở Settings, tắt Attention Aware, khoá thanh âm lượng. Nhắc nhanh: Android cũng có thanh riêng, tuỳ máy.
- Kết (~45–55 s): Quay lại mô phỏng 06:00 — lần này chuông kêu to, Cáo bật dậy. Câu chốt: "Báo thức không hỏng — nó chỉ bị vặn nhỏ mà bạn không biết." Kêu gọi nhẹ: "Bạn từng bị kiểu nào? Gõ bình luận."

**Vì sao giữ chân:** Stakes cao và gần — ai cũng sợ ngủ quên. Cơ chế "điện thoại nghe thấy mắt bạn" gây ngạc nhiên, giải thích được bằng hình. Ích lợi sớm (giây 5–8 đã biết thanh trượt sai).

**Cách làm:** Mô phỏng UI điện thoại vẽ bằng code (Remotion component), so sánh 2 cột, sơ đồ bước mũi tên, nền phòng ngủ AI-gen (không logo/người), Cáo dáng tĩnh 3 lần, SFX chuông → tắt dần.

**Rủi ro:** Attention Aware chỉ có trên iPhone Face ID — cần nói rõ "tuỳ máy"; phần Android mỏng hơn. Nếu khán giả chủ yếu dùng Android, cơ chế chính kém phổ quát.

---

### Concept G2: "Điện thoại nghĩ bạn không cần app đó nữa"
**Trục cơ chế chính:** Tối ưu pin giết ứng dụng báo thức bên thứ ba — Doze mode + App Standby Buckets (Android) & Sleep Focus xung đột lịch (iOS).

**Hook (≤ 2 s):** *(Ví dụ dựng)* Mô phỏng màn hình: icon app báo thức (generic, không logo hãng) đang chạy → một "cái kéo" cắt đứt dây nối tới đồng hồ. Chữ: "Điện thoại tự tay tắt báo thức của bạn."

**Nhịp:**
- 0–3 s: Opening — Cáo cầm điện thoại, kiểm tra "✓ 06:00 BẬT", gật đầu ngủ. Conflict: đồng hồ 08:00, biểu tượng app xám. Topic reveal: "Hệ thống nghĩ app đó không quan trọng."
- 3–15 s: Sơ đồ luồng: Doze mode (màn tắt + không di chuyển + sạc rút) → hệ thống đóng băng job nền → app báo thức bên thứ ba không được đánh thức. Ghi chú: app Đồng hồ **hệ thống** (cài sẵn) được ưu tiên, không bị Doze chặn (developer.android.com — Optimize for Doze). Phân biệt rõ: app hệ thống vs app tải về.
- 15–45 s: App Standby Buckets — sơ đồ 5 xô (Active → Restricted), app lâu không mở bị đẩy xuống "Restricted" chỉ còn ≤ 1 alarm/ngày (developer.android.com). Từ Android 13+, app mới bị từ chối quyền SCHEDULE_EXACT_ALARM mặc định. Nhắc: một số hãng (Xiaomi, Samsung, Huawei…) còn thêm lớp quản lý riêng, cắt mạnh hơn Android gốc (dontkillmyapp.com — nguồn thứ cấp). iOS: Sleep Focus có thể xung đột lịch báo thức tuỳ cách cài (Apple Support — Focus > Sleep).
- Kết (~50–60 s): Cách kiểm: (1) dùng app Đồng hồ cài sẵn, (2) nếu dùng app khác → tắt tối ưu pin cho app đó (Settings > Apps > Battery > Unrestricted), (3) kiểm quyền "Alarms & Reminders". Câu chốt: "Điện thoại không ghét bạn — nó chỉ yêu pin hơn báo thức." Kêu gọi: "Đang dùng app báo thức nào? Comment cho mọi người biết."

**Vì sao giữ chân:** Cơ chế phổ quát nhất (đa số Android, hãng Trung Quốc rất phổ biến ở VN). Stakes rõ: mất việc/trễ học vì cái app bị giết ngầm. Có ích lợi sớm — biết phân biệt app hệ thống vs app tải về.

**Cách làm:** Sơ đồ luồng + process animation (Remotion), mô phỏng UI danh sách app + thanh pin, bảng 5 xô Standby Buckets, nền không gian kỹ thuật, Cáo 3 lần, SFX "cắt kéo" tổng hợp.

**Rủi ro:** Nội dung hơi kỹ thuật, cần đơn giản hoá sơ đồ. Nếu khán giả chủ yếu dùng app Đồng hồ mặc định thì nguyên nhân này ít gặp hơn tưởng. Cần nhắc "tuỳ máy" cho phần hãng.

---

### Concept G3: "Chế độ Im lặng KHÔNG tắt báo thức — vậy cái gì tắt?"
**Trục cơ chế chính:** Hiểu lầm phổ biến về Silent/DND → dẫn tới nguyên nhân thật: âm báo thức đặt thành "None" + Bluetooth hút âm đi nơi khác.

**Hook (≤ 2 s):** *(Ví dụ dựng)* Mô phỏng công tắc Silent (gạt cam trên iPhone / icon chuông gạch trên Android) → chữ lớn: "Cái này KHÔNG tắt báo thức." → dấu hỏi lớn: "Vậy cái gì tắt?"

**Nhịp:**
- 0–3 s: Opening — đập vỡ hiểu lầm ngay: Cáo gạt nút Silent, báo thức VẪN kêu (Apple Support xác nhận; Android — alarm stream độc lập, support.google.com). Conflict: "Nhưng sáng nay nó không kêu thật." Topic: "Thủ phạm giấu mặt khác."
- 3–15 s: Thủ phạm 1 — âm báo thức đặt thành "None" (iOS: Clock > Edit > Sound = None → chỉ rung, không kêu; Apple Support). Mô phỏng UI: danh sách báo thức, tap vào, trường Sound = "None" nhấp nháy đỏ. Cáo chỉ tay. Giải thích: có thể do chọn nhạc chuông từ Apple Music/bài hát đã xoá → hệ thống mặc định về None.
- 15–40 s: Thủ phạm 2 — Bluetooth âm thầm. Đêm quên tắt tai nghe/loa → âm thanh báo thức phát qua thiết bị khác (tai nghe trong hộp vẫn kết nối, loa phòng khách). Sơ đồ: điện thoại → sóng Bluetooth → tai nghe xa giường. Cáo đứng giữa, mũi tên đi sang phải ra ngoài khung. Áp dụng cả iOS & Android (Apple Support ghi rõ audio routing).
- 40–55 s: Checklist 3 việc kiểm ngay: ① Mở báo thức, kiểm Sound ≠ None ② Tắt Bluetooth trước khi ngủ hoặc kiểm thiết bị kết nối ③ Vặn thanh "Ringtone & Alerts" / "Alarm" lên, tắt "Change with Buttons" nếu hay vặn nhỏ.
- Kết: Câu chốt: "Im lặng không có tội — kẻ phạm là cái bạn không nghĩ tới." Kêu gọi: "Bạn từng bị Bluetooth 'ăn' chuông chưa? Chọn 🔇 hay 🎧 trong bình luận."

**Vì sao giữ chân:** Mở bằng cách đập vỡ hiểu lầm rất phổ biến (nhiều người nghĩ Silent = tắt báo thức) → tạo khoảng trống kiến thức ngay giây 2. Hai thủ phạm đều cực gần đời sống, dễ hình dung. Ích lợi sớm: biết ngay Silent không phải thủ phạm.

**Cách làm:** Mô phỏng UI điện thoại (Remotion component), so sánh trước/sau (Sound = None vs Sound = chọn), sơ đồ Bluetooth mũi tên, nền phòng ngủ AI-gen, Cáo 3 lần, SFX chuông kêu/tắt.

**Rủi ro:** Hai nguyên nhân (None + Bluetooth) có thể khiến video mất tập trung "một cơ chế chính" nếu không gộp tốt — cần framing thành một ô "âm thanh đi sai chỗ" (None = không phát, BT = phát sai chỗ). Phần Bluetooth ít tài liệu chính thức chuyên biệt (Apple Support nhắc gọn ở mục troubleshooting, không phải bài riêng).

---

### Tóm tắt so sánh nhanh

| | G1: Âm lượng & Attention Aware | G2: Pin giết app | G3: Silent ≠ tắt + Bluetooth |
|---|---|---|---|
| Độ bất ngờ | Cao (Face ID hạ âm) | Trung bình–cao | Cao (đập hiểu lầm) |
| Phổ quát | iPhone Face ID (hẹp) | Android phổ biến VN | Cả hai hệ |
| Dễ dựng hình | Cao (UI + sơ đồ đơn giản) | Trung bình (sơ đồ kỹ thuật) | Cao |
| Một cơ chế chính | ✓ (âm lượng bị kiểm soát ngầm) | ✓ (tối ưu pin) | Cần gộp khéo |