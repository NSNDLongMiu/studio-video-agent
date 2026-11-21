# IT-T31-E01 — Vá web xong, còn lớp nào?

Thời lượng dự kiến ≈ 58,0 s · 9:16 · 10 cảnh · bản 1 (VIẾT, N=1). Câu hỏi: vá nginx xong thì đóng ca được chưa, khi mọi container chung một nhân? Một sự cố (hộp bên cạnh đổi màu), một cơ chế (nhân chung dựng tường), một ví dụ (nginx2root, mức "bộ lỗi nginx mới công bố"). Ranh giới brief: không nói root ngay, không số máy, không tình trạng bản vá, không cách khai thác, không CVE/CVSS/SCTP.

Mạch: **Storytelling** S01–S02 · **Problem** S02 · **Explanation** S03–S05 · ví dụ S06–S07 · đánh đổi S08 · **Solution** S09–S10. Câu hỏi mở giây 9,6 ("Câu này sai ở đâu?") → trả giây ~15,7 ("chạy trên cùng một nhân Linux") và ~17,6 ("Nhân dựng bức tường giữa chúng") → trả đầy đủ giây ~51,5 ("Rồi hãy đóng ca"). Hệ quả sớm: giây 2,6 hộp bên cạnh đổi vàng. Ích lợi đầu tiên: giây ≤ 5 "vá ứng dụng chưa chắc là xong".

Nhịp đọc dự kiến: `[dẫn]` atempo ≈ 1,15 (≈ 4,6 âm tiết/s); `[kỹ thuật]` ≈ 1,09 (≈ 4,3 âm tiết/s); giám đốc nghe để chỉnh.

## Bảng cảnh
| Thời gian | Đoạn truyện | Nhãn tốc độ | Độ phức tạp · khái niệm mới · giữ sau lời | Hình ảnh/đồ hoạ | Chữ trên màn hình | Lời đọc/phụ đề | Cáo | Âm thanh/khoảng nghỉ |
|---|---|---|---|---|---|---|---|---|
| 0,0–6,0 | S01 Opening ba pha. Storytelling | dẫn | Medium · 1 (ô "nhân" chưa vá) · giữ 1,4 s với tiêu đề<br>Cảnh opening, được dưới 3 s vì có ba pha | Nền bảng trực. **Pha 1 (0,0–2,0) visual hook:** hộp web đang vàng chuyển **xanh** ở 0,6 s khi lời "xong"; ô trạng thái bên phải hộp web hiện dấu tick. **Pha 2 (2,0–4,6) conflict:** hộp bên cạnh ("thanh toán", ví dụ dựng) đổi **xanh → vàng** ở 2,6 s (≤ 0,5 s sau "Khoan"), chuông nhỏ; ô "NHÂN" nằm bên dưới cả hai hộp vẫn **trống** (viền nét đứt xám) và nhấp 2 nhịp. **Pha 3 (4,6–6,0) topic reveal:** tiêu đề hiện (kinetic nhẹ), các ô giữ nguyên làm nền.<br>Bằng chứng hình: hộp web xanh nhưng hộp bên cạnh đổi vàng và ô nhân trống = vá một hộp chưa xong việc.<br>Trạng thái sự cố: hộp cạnh xanh→vàng (lần 1) | `ĐÃ VÁ` gắn hộp web (từ 0,6 s), lý do: nhãn trạng thái<br>`NHÂN` gắn ô trống (từ 2,6 s), lý do: thuật ngữ được gọi tên (R22)<br>**Tiêu đề opening (4,6–6,0 s):** `Lớp nào chưa vá?` (lý do: opening) | **Lời 1 · 0,0–4,0 s:**<br>Vá nginx xong rồi, đóng ca nhé?<br>Khoan. Hộp bên cạnh sao đổi màu? | Có · `point_right` · 0,0–5,0 s, trái dưới ≈ 16–18% | Mở bằng im lặng 0 s, SFX tick khi hộp web xanh. Nghỉ 0,5 s sau "nhé?" (hình đổi: hộp cạnh vàng). Nghỉ 0,6 s sau "màu?" rồi tiêu đề hiện kèm whoosh ngắn |
| 6,0–11,5 | S02 Problem: niềm tin sai | dẫn | Low · 0 · giữ 1,2 s | Nền bảng trực. Ba hộp (web, thanh toán, báo cáo) trên **một tấm nền chung chưa gắn nhãn** (đặt nền xám xanh, nhạt). Hộp web chuyển **đỏ** ở 6,3 s khi lời "bị chiếm". Bong bóng suy nghĩ của Cáo: hai hộp còn lại **xanh** và viền khoá (8,0 s) = niềm tin "chỉ mất hộp đó". Tới "sai ở đâu?" (9,2 s): hộp thanh toán **nhấp vàng** hai nhịp, bong bóng nứt.<br>Bằng chứng hình: hộp web đỏ, hai hộp kia xanh trong bong bóng rồi bong bóng nứt = niềm tin bị thử.<br>Trạng thái sự cố: web xanh→đỏ (lần 2) | `WEB` gắn hộp web (từ 6,3 s), `THANH TOÁN` gắn hộp giữa (từ 6,3 s), `BÁO CÁO` gắn hộp phải (từ 6,3 s), lý do: nhãn đối tượng (ví dụ dựng)<br>Header `IT · CONTAINER` / `NIỀM TIN SAI` (trái) | **Lời 2 · 6,2–10,3 s:**<br>Nhiều bạn nghĩ: bị chiếm thì chỉ mất cái hộp đó thôi.<br>Câu này sai ở đâu? | Có · `think` · 6,0–8,5 s, phải dưới ≈ 14% | Nghỉ 0,4 s sau "thôi." (bong bóng hiện). Nghỉ 0,9 s sau câu hỏi: hộp nhấp vàng, chuyển cảnh nhanh sang sơ đồ |
| 11,5–20,0 | S03 Explanation: nhân chung dựng tường | kỹ thuật | **High** · 1 (nhân chung) · giữ 2,4 s hoàn chỉnh | Nền sơ đồ. Dựng **từng bước theo lời**: (1) 11,7 s tấm nền xanh dương trồi lên dưới ba hộp, nhãn hiện; (2) 13,4 s "chạy trên cùng": từ mỗi hộp một mũi tên đi xuống tấm nền (cùng một tấm nền); (3) 15,7 s trả lời hiện kinetic; (4) 16,2 s "Nhân dựng": từ tấm nền mọc **tường nét liền** xanh dương lên giữa các hộp, nhãn tường; (5) 17,6–20,0 s giữ trạng thái hoàn chỉnh, hộp thở nhẹ, tường sáng dần.<br>Bằng chứng hình: mũi tên của cả ba hộp cùng đi xuống một tấm nền; tường mọc từ chính tấm nền.<br>Cảnh trọng tâm cho kinetic. | `NHÂN LINUX` gắn tấm nền (từ 11,7 s)<br>Kinetic `MỘT NHÂN CHUNG` (15,7–16,6 s, ≥ 72 px, trọng tâm kinetic)<br>`TƯỜNG` gắn tường (từ 16,6 s)<br>Header `NHÂN CHUNG` (phải) | **Lời 3 · 11,7–17,6 s:**<br>Sai ở chỗ này: các container chạy trên cùng một nhân Linux.<br>Nhân dựng bức tường giữa chúng. | Không | Whoosh vào cảnh. Tick mỗi lần mũi tên xuống nền (13,4 s). Nghỉ 0,5 s sau "Linux." (kinetic hiện). Giữ 2,4 s sau lời với tường sáng, không im chết |
| 20,0–25,0 | S04 Hệ quả: lỗi nhân làm tường yếu | kỹ thuật | Medium · 0 · giữ 2,7 s | Nền sơ đồ, giữ bố cục S03. 20,4 s **vết nứt mảnh** xuất hiện trên tấm nền (crack), nhỏ, không lan thành sập. 21,6 s tường chuyển **nét liền → nét đứt** (từ vết nứt đi lên). 22,0 s **hai hộp bên cạnh viền vàng**; hộp web vẫn đỏ. 22,3–25,0 s giữ: viền vàng nhấp chậm.<br>Bằng chứng hình: tường liền → đứt nét ngay sau khi nền có vết nứt; hộp bên cạnh viền vàng (bị ảnh hưởng).<br>Trạng thái sự cố: hộp cạnh vàng + nền nứt (lần 3) | `TƯỜNG` giữ ở tường (đã có)<br>Header `LỖI NHÂN` (trái) | **Lời 4 · 20,2–22,3 s:**<br>Lỗi nhân có thể làm tường yếu đi. | Không | SFX crack mảnh ở 20,4 s. Nghỉ 0,2 s trước lời. Giữ 2,7 s sau lời với hình đổi (viền vàng, tường đứt) |
| 25,0–30,5 | S05 Đối chiếu máy ảo | kỹ thuật | Medium · 1 (máy ảo nhân riêng, chỉ đối chiếu) · giữ 2,5 s | Nền sơ đồ, chia **hai cột**. Cột trái `CONTAINER`: ba hộp một nền, nền nứt, hộp viền vàng (giữ từ S04). Cột phải `MÁY ẢO` dựng theo lời: 25,6 s ba nền **riêng** dưới ba hộp; 26,6 s mỗi hộp một **tường đôi dày**; 27,4 s **một nhân khách** (một nền bên phải) **nứt**, chỉ hộp ngay trên nền đó viền vàng, hai hộp còn lại xanh (chỉ minh hoạ nhân khách đó, không hàm ý máy ảo luôn khoanh được mọi lỗi).<br>Bằng chứng hình: cùng một vết nứt, bên trái làm cả ba viền vàng, bên phải chỉ một hộp. Giữ 2,5 s để so sánh. | `CONTAINER`, `MÁY ẢO` gắn đầu hai cột (lý do: nhãn đối chiếu)<br>Header `MÁY ẢO` (giữa) | **Lời 5 · 25,2–28,0 s:**<br>Với máy ảo, mỗi hộp có một nhân riêng. | Không | Whoosh chuyển cột. Tick nhẹ khi mỗi nền riêng hiện. Nghỉ 0,2 s trước lời; giữ 2,5 s so sánh |
| 30,5–37,0 | S06 Ví dụ: nginx2root | kỹ thuật | Medium · 1 (ví dụ nginx2root) · giữ 0,6 s | Nền bảng trực (biến thể thẻ tin). 30,7 s **thẻ tin** trượt vào cạnh hộp web (xanh, đang chạy). 31,0 s thẻ chứa tên bộ lỗi (chỉ chữ, không logo, không số CVE). 33,9–35,4 s mũi tên từ thẻ vào hộp web; 35,4 s **chỉ chip `nginx` bên trong hộp web** chuyển **xanh → đỏ** khi lời "bị chiếm" (vỏ hộp và hai hộp kia giữ nguyên, không gợi chiếm cả container); dấu cờ xám cạnh hộp = điều kiện "tuỳ cấu hình" (ký hiệu, không chữ dài), hiện từ 33,9 s, trước lời "Tuỳ cấu hình".<br>Bằng chứng hình: thẻ tin → mũi tên → chip nginx đỏ trong hộp web; dấu cờ xám = điều kiện, tránh nói quá.<br>Không tả cơ chế khai thác. | `nginx2root` gắn thẻ tin (từ 31,0 s), lý do: tên ví dụ thời sự<br>`WEB` gắn hộp web<br>Header `VÍ DỤ` (phải) | **Lời 6 · 30,7–36,4 s:**<br>Ví dụ: vừa có bộ lỗi nginx mới công bố.<br>Tuỳ cấu hình, nginx có thể bị chiếm. | Không | Whoosh nhẹ khi thẻ trượt. Nghỉ 0,4 s sau "công bố." Tick khi hộp đổi đỏ. Giữ 0,6 s sau lời |
| 37,0–42,0 | S07 Chưa rõ: bước tiếp theo | kỹ thuật | Medium · 0 · giữ 1,0 s | Nền sơ đồ. Chỉ chip `nginx` còn đỏ, tường **giữ nguyên nét liền**. **Không có mũi tên nối từ hộp web** xuống nền. 37,8 s một **thẻ "lỗi nhân" riêng** (viền xám xanh nét đứt) hiện cạnh tấm nền; 38,6 s tấm nền chuyển **mờ xám**; 39,6 s **dấu "?"** lớn trên thẻ đó. Không vẽ đường liền, không vẽ gì đi qua tường.<br>Bằng chứng hình: thẻ lỗi nhân đứng riêng, nét đứt, mang "?" = bước này là một lỗi khác, chi tiết chưa công bố đầy đủ (không khẳng định diễn tiến tự động).<br>Trạng thái sự cố: nền "?" (lần 4) | `NHÂN` gắn tấm nền (đã có)<br>`CHƯA RÕ` gắn dấu "?" (từ 39,6 s)<br>Header `CHƯA RÕ` (trái) | **Lời 7 · 37,2–40,7 s:**<br>Còn bước tiếp theo liên quan tới nhân. Chi tiết chưa công bố đầy đủ. | Không | Nghỉ 0,3 s giữa hai câu. Giữ 1,0 s sau lời, "?" nhấp chậm. SFX tick trầm khi nền mờ |
| 42,0–47,5 | S08 Đánh đổi | kỹ thuật | Medium · 0 · giữ 0,9 s | Nền sơ đồ, hai nửa **trước/sau**. Nửa trái ba hộp một nền: hộp **nhỏ gọn**, thanh khởi động ngắn đầy nhanh (42,6 s). Nửa phải ba nền riêng: hộp lớn hơn, thanh khởi động dài đầy chậm (43,4 s). 45,4 s ("cái giá") nền chung của nửa trái đổi sang nền xanh dương có **một vết nứt nhỏ** cạnh cái cân nghiêng nhẹ. Không số liệu, không tỉ lệ cụ thể.<br>Bằng chứng hình: thanh khởi động trái ngắn hơn phải; cái cân nghiêng khi nói về giá. | `NHẸ · NHANH` gắn nửa trái (từ 42,6 s)<br>`GIÁ: NHÂN CHUNG` gắn cái cân (từ 45,4 s)<br>Header `ĐÁNH ĐỔI` (giữa) | **Lời 8 · 42,2–46,6 s:**<br>Container vẫn đáng dùng: nhẹ, nhanh vì chung nhân.<br>Đó cũng là cái giá. | Không | Tick nhẹ khi thanh đầy. Nghỉ 0,4 s sau "chung nhân." Giữ 0,9 s sau "cái giá" |
| 47,5–53,0 | S09 Solution: việc làm | kỹ thuật | Medium · 0 · giữ 1,5 s | Nền bảng trực (trả hook). 48,6 s ô `NGINX` **tick xanh**; 49,4 s khung terminal nhỏ (nhãn `NHÂN MÁY CHỦ`) hiện dòng lệnh xem bản nhân đang chạy (một dòng, không kết quả, không số phiên bản), **ô `NHÂN` vẫn trống**; 50,0 s bảng trực hiện dấu xác nhận **"đã áp dụng bản vá"** (chip `ĐÃ VÁ` cạnh ô nhân, ký hiệu hai bước đều xong); chỉ sau đó 50,3 s ô `NHÂN` (trước đây trống) **tick xanh**; 50,7 s hộp bên cạnh **vàng → xanh**; 51,5 s gạt **công tắc ca** (đóng ca). Lệnh chỉ để xem, không thành bằng chứng đã vá.<br>Bằng chứng hình: xác nhận đã vá → hai ô tick xanh + hộp cạnh về xanh rồi mới đóng ca = hook được trả.<br>Trạng thái sự cố: về xanh toàn bộ (lần 5) | `NGINX` gắn ô (từ 48,6 s)<br>`NHÂN` gắn ô (tick từ 50,3 s)<br>Dòng lệnh terminal (gắn khung terminal): `$ uname -r` và nhãn `NHÂN MÁY CHỦ`, lý do: R12, cảnh xem nhân; tránh hiểu container có nhân riêng<br>Header `VIỆC LÀM` (trái); chip `VIỆC LÀM` tick | **Lời 9 · 47,7–51,5 s:**<br>Vá nginx, rồi vá cả nhân máy chủ khi có bản.<br>Xong hết hãy đóng ca. | Không | Tick xanh từng ô (48,6 s và 50,3 s). Nghỉ 0,3 s sau "máy chủ." Chuông xanh dịu khi hộp về xanh. Công tắc kêu click. Giữ 1,5 s |
| 53,0–58,0 | S10 Kết và kêu gọi | dẫn | Low · 0 · giữ 0,6 s + đuôi 0,7 s | Nền bảng trực, mọi ô xanh. Cáo đứng cạnh bảng. Khi hỏi, ô `NHÂN` nhấp nhẹ một lần; khi kêu gọi, hiện chữ chốt kinetic.<br>Bằng chứng hình: bảng trực toàn xanh = kết trả hook. | Kinetic chốt `NGINX + NHÂN` (55,8–57,8 s, ≥ 72 px, gắn bảng trực)<br>Header `KẾT` (phải) | **Lời 10 · 53,2–56,9 s:**<br>Nhân máy chủ của bạn, vá lần cuối khi nào?<br>Gõ xuống bình luận nhé. | Có · `thumbs_up` · 53,5–58,0 s, giữa dưới ≈ 16% | Nghỉ 0,4 s sau câu hỏi. Kết bằng tiếng chuông cuối rất nhỏ; đuôi im ≤ 0,7 s |

## Ngân sách thời lượng
| Cảnh | Nhãn | Âm tiết | Tốc độ mới | Giây đọc | Nghỉ Y7 + giữ | Đuôi | Tổng |
|---|---|---|---|---|---|---|---|
| S01 | dẫn | 16 | 4,6 | 3,5 | 2,5 | 0 | 6,0 |
| S02 | dẫn | 17 | 4,6 | 3,7 | 1,8 | 0 | 5,5 |
| S03 | kỹ thuật | 23 | 4,3 | 5,4 | 3,1 | 0 | 8,5 |
| S04 | kỹ thuật | 8 | 4,3 | 1,9 | 3,1 | 0 | 5,0 |
| S05 | kỹ thuật | 9 | 4,3 | 2,1 | 3,4 | 0 | 5,5 |
| S06 | kỹ thuật | 22 | 4,3 | 5,1 | 1,4 | 0 | 6,5 |
| S07 | kỹ thuật | 15 | 4,3 | 3,5 | 1,5 | 0 | 5,0 |
| S08 | kỹ thuật | 17 | 4,3 | 4,0 | 1,5 | 0 | 5,5 |
| S09 | kỹ thuật | 14 | 4,3 | 3,3 | 2,2 | 0 | 5,5 |
| S10 | dẫn | 15 | 4,6 | 3,3 | 1,0 | 0,7 | 5,0 |
| Tổng | | 156 | | 35,7 | 21,6 | 0,7 | 58,0 |
Hệ số: ≈ 4,3 âm tiết/s (`[dẫn]` 4,6); "nginx" tính 3 âm tiết, "container" 4, "Linux" 3, "web" 2. 10 cảnh, trung bình 5,8 s/cảnh. Duyệt lại mốc sau TTS, không tăng tốc để bù.

## voice_direction theo line_id (R24)
| line_id | Ý định | Cảm xúc | Cụm nhấn | Tốc độ | Nghỉ trước/sau | Ngữ điệu | Quan hệ chuyển ý |
|---|---|---|---|---|---|---|---|
| L01a (S01) | thói quen vui, tự tin | nhẹ nhõm, hơi đắc ý | "xong rồi", "đóng ca" | atempo 1,15 | trước 0 / sau 0,5 s | lên nhẹ ở "nhé?" | mở tình huống |
| L01b (S01) | khựng lại, nhận ra | ngạc nhiên nhẹ | "Khoan", "đổi màu" | atempo 1,15, "Khoan" chậm một nhịp | trước 0 / sau 0,6 s | "Khoan." dứt, "màu?" lên | hệ quả sớm, dẫn vào tiêu đề |
| L02a (S02) | nêu niềm tin sai | đồng cảm, không chê | "chỉ mất cái hộp" | atempo 1,15 | trước 0,2 s / sau 0,4 s | đều, lên nhẹ cuối câu | vấn đề |
| L02b (S02) | mở câu hỏi | tò mò | "sai ở đâu" | atempo 1,10, chậm cuối | trước 0,4 s / sau 0,9 s | lên rõ ở "đâu?" | mở câu hỏi cho S03 |
| L03a (S03) | trả lời | chắc, rõ | "Sai ở chỗ này", "cùng một nhân" | atempo 1,09 | trước 0,2 s / sau 0,5 s | xuống ở "Linux." | trả câu hỏi |
| L03b (S03) | nêu cơ chế | chắc | "dựng", "bức tường" | atempo 1,07, chậm | trước 0 / sau 2,4 s giữ | xuống dứt | nguyên nhân → cơ chế |
| L04 (S04) | nêu nguy cơ có điều kiện | nghiêm nhưng bình tĩnh | "có thể", "yếu đi" | atempo 1,09 | trước 0,2 s / sau 2,7 s giữ | xuống ở "đi." | hệ quả của cơ chế |
| L05 (S05) | đối chiếu | điềm tĩnh | "nhân riêng" | atempo 1,09 | trước 0,2 s / sau 2,5 s | ngắt nhẹ sau "Với máy ảo", hạ cuối | so sánh |
| L06a (S06) | dẫn ví dụ thời sự | tin nóng, nhẹ | "vừa có", "nginx" | atempo 1,10 | trước 0,2 s / sau 0,4 s | đều | chuyển sang ví dụ |
| L06b (S06) | nêu hệ quả có điều kiện | thận trọng | "Tuỳ cấu hình", "có thể" | atempo 1,07, chậm ở "Tuỳ cấu hình" | trước 0,4 s / sau 0,6 s | ngắt sau "cấu hình,", hạ cuối | giữ ranh giới, không nói quá |
| L07 (S07) | nêu điều chưa rõ | trung thực, bình tĩnh | "liên quan tới nhân", "chưa công bố đầy đủ" | atempo 1,07, chậm ở "chưa công bố" | trước 0,2 s / sau 1,0 s | hạ đều, dứt ở "đủ." | giữ ranh giới brief |
| L08a (S08) | công bằng cho container | tích cực | "vẫn đáng dùng", "chung nhân" | atempo 1,09 | trước 0,2 s / sau 0,4 s | lên nhẹ ở "dùng:" | đánh đổi: mặt được |
| L08b (S08) | nêu cái giá | trầm hơn, chắc | "cái giá" | atempo 1,07 | trước 0,4 s / sau 0,9 s | hạ dứt | đánh đổi: mặt phải |
| L09a (S09) | đưa việc làm | rõ ràng, quyết đoán | "vá cả nhân", "khi có bản" | atempo 1,10 | trước 0,2 s / sau 0,3 s | đều, nhấn "cả", hạ nhẹ ở "bản." | giải pháp |
| L09b (S09) | trả hook | nhẹ nhõm | "đóng ca" | atempo 1,12 | trước 0,3 s / sau 1,5 s | hạ dứt | kết hook |
| L10a (S10) | đặt câu hỏi tự soi | thân thiện | "lần cuối" | atempo 1,15 | trước 0,2 s / sau 0,4 s | lên ở "nào?" | quay lại người xem |
| L10b (S10) | kêu gọi | ấm, nhẹ | "bình luận" | atempo 1,15 | trước 0,4 s / sau 0,4 s + đuôi 0,7 s | lên nhẹ ở "nhé." | kết |

## Bảng "Thuật ngữ & cách đọc"
| Thuật ngữ | Loại | Chữ đưa vào TTS | Câu/cảnh | Trạng thái |
|---|---|---|---|---|
| nginx | đọc như từ (en-jin-ex) | engine x | Lời 1, 6, 9 (S01, S06, S09) | CHƯA KIỂM — giám đốc nghe |
| container | đọc như từ | container | Lời 3, 8 (S03, S08) | CHƯA KIỂM — giám đốc nghe |
| Linux | đọc như từ (lin-ux) | Linux | Lời 3 (S03) | CHƯA KIỂM — giám đốc nghe |
| web | đọc như từ | web | Lời 6 (S06) | CHƯA KIỂM — giám đốc nghe |
| nhân (kernel) | từ Việt | nhân | Lời 3–10 | CHƯA KIỂM — giám đốc nghe (tránh đọc nhầm với "nhẫn") |
| máy ảo | từ Việt | máy ảo | Lời 5 | CHƯA KIỂM — giám đốc nghe |
| ca (ca trực) | từ Việt | ca | Lời 1, 9 | CHƯA KIỂM — giám đốc nghe |
Giữ chính tả chuẩn ở phụ đề và chữ trên hình (`nginx`, `container`, `Linux`, `nginx2root`). `nginx2root` chỉ hiện trên thẻ tin, không có trong lời đọc. `uname -r` chỉ hiện trên khung terminal, không có trong lời đọc. Không nói tên nền tảng nào trong lời.

## Bản đồ ngữ nghĩa (D7)
| Cảnh | Ý chính | Khái niệm chính | Thuật ngữ kỹ thuật | Đối tượng/thành phần | Quan hệ | Hành động/cơ chế | Kết quả/hậu quả | Keyword cần chữ |
|---|---|---|---|---|---|---|---|---|
| S01 | Vá một hộp chưa chắc là xong | vá ứng dụng | nginx, nhân | hộp web, hộp bên cạnh, ô nhân, bảng trực | hộp bên cạnh cùng máy | vá, đổi màu | hộp cạnh vàng | `ĐÃ VÁ`, `NHÂN` (cần nhãn), tiêu đề opening |
| S02 | Niềm tin "chỉ mất hộp đó" bị thử | cách ly tưởng tượng | container | ba hộp, tấm nền chung | ba hộp đứng trên cùng nền | bị chiếm | hộp web đỏ, bong bóng nứt | `WEB`, `THANH TOÁN`, `BÁO CÁO` |
| S03 | Container chung nhân, nhân dựng tường | nhân chung | nhân Linux, container | ba hộp, tấm nền, tường, mũi tên | hộp dựa vào nền; tường do nền dựng | gọi xuống nhân, dựng tường | tường là của nhân | `NHÂN LINUX` (cần nhãn), kinetic `MỘT NHÂN CHUNG`, `TƯỜNG` |
| S04 | Lỗi nhân làm tường yếu đi | lỗi ở nền | lỗi nhân | vết nứt, tường, hộp cạnh | nứt nền → tường đứt | nứt, yếu đi | hộp cạnh viền vàng | `TƯỜNG` |
| S05 | Máy ảo: mỗi hộp một nền riêng | nhân riêng | máy ảo | hai cột, nền riêng, tường đôi | một nền nứt chỉ ảnh hưởng một hộp | đối chiếu | ảnh hưởng hẹp hơn | `CONTAINER`, `MÁY ẢO` (cần nhãn) |
| S06 | Ví dụ: bộ lỗi nginx mới công bố | nginx2root | nginx | thẻ tin, hộp web | thẻ tin tác động hộp web | công bố, bị chiếm (có thể) | hộp web đỏ, điều kiện | `nginx2root` (cần nhãn), `WEB` |
| S07 | Bước tiếp theo liên quan nhân, chưa rõ | chưa công bố | nhân | thẻ lỗi nhân nét đứt, ô nhân mờ | một lỗi nhân riêng, không nối tự động từ web | | thẻ "?" | `NHÂN`, `CHƯA RÕ` |
| S08 | Nhẹ và nhanh là giá của nhân chung | đánh đổi | khởi động | hai nửa, thanh khởi động, cái cân | nhẹ ↔ nhân chung | so sánh | cân nghiêng | `NHẸ · NHANH`, `GIÁ: NHÂN CHUNG` |
| S09 | Vá cả nginx lẫn nhân (khi có bản) rồi đóng ca | hai lớp | nginx, nhân, kiểm nhân | ô tick, terminal, chip đã vá, công tắc ca | hai lớp cùng xanh sau xác nhận đã vá | vá, xem nhân, xác nhận, đóng ca | bảng xanh | `NGINX`, `NHÂN`, `NHÂN MÁY CHỦ`, `$ uname -r`, `ĐÃ VÁ` |
| S10 | Kết: tự soi lần vá nhân cuối | vá nhân | nhân | bảng xanh, Cáo | | hỏi, kêu gọi | | kinetic `NGINX + NHÂN` |
Cảnh trọng tâm kinetic: S03 (`MỘT NHÂN CHUNG`) và S10 (chốt).

## Bảng "Chiều sâu" (R15) — tham chiếu
Xem bảng đầy đủ ở `plan.md`: vấn đề (S01–S02) · vì sao quan trọng (S04, S06) · cơ chế (S03) · ví dụ (S03, S05, S06–S07) · sai lầm (S02, S07) · giải pháp (S08–S10).

## Bằng chứng hình (R11) tóm tắt
| Khẳng định | Sự kiện hình chứng minh | Cảnh |
|---|---|---|
| Vá một hộp chưa xong việc | hộp web xanh, hộp bên cạnh đổi vàng, ô nhân trống | S01 |
| Niềm tin "chỉ mất hộp đó" cần thử | bong bóng hai hộp xanh nứt khi hỏi "sai ở đâu?" | S02 |
| Container dùng chung một nhân | mũi tên của cả ba hộp cùng đi xuống một tấm nền | S03 |
| Nhân dựng tường | tường mọc từ chính tấm nền | S03 |
| Lỗi nhân làm tường yếu đi | vết nứt trên nền → tường liền thành đứt nét; hộp cạnh viền vàng | S04 |
| Máy ảo khác container | cùng vết nứt: bên container ảnh hưởng ba hộp, bên máy ảo chỉ một hộp | S05 |
| nginx2root có thể làm nginx bị chiếm | thẻ tin → mũi tên → chip nginx đỏ, dấu điều kiện | S06 |
| Bước tiếp theo chưa công bố đầy đủ | thẻ lỗi nhân nét đứt có "?", tường nguyên, không mũi tên nối | S07 |
| Đánh đổi nhẹ/nhanh ↔ nhân chung (trước/sau) | thanh khởi động ngắn/dài; cái cân nghiêng | S08 |
| Việc làm đã xong | xác nhận đã vá rồi mới tick hai ô, hộp cạnh về xanh, gạt công tắc ca | S09 |
Trạng thái sự cố ở hook đổi ≥ 3 lần: xanh→vàng (S01), xanh→đỏ (S02), nứt+viền vàng (S04), "?" (S07), về xanh (S09), trả đúng chỗ.
Có cảnh trước/sau (S05, S08).

## Kiểm tra Y1/R3 trên cột "Chữ trên màn hình"
Không câu nào chép lời; tối đa 3 nhóm đồng thời ngoài phụ đề và header; kinetic ≥ 72 px, nhãn ≥ 56 px. Không nhãn «AI tạo», «Ví dụ dựng», không logo, không CVE/CVSS/tên SCTP.

## Tiêu đề, mô tả, hashtag
**Tóp tóp**
- Tiêu đề: Vá nginx xong rồi, đóng ca được chưa?
- Mô tả: Container chạy chung một nhân Linux. Nhân dựng bức tường giữa các container, nên lỗi ở nhân có thể làm tường yếu đi. Ví dụ thời sự: bộ lỗi nginx mới công bố. Nhẹ và nhanh là lý do dùng container, cũng là cái giá. Việc làm: vá nginx, rồi vá cả nhân của máy chủ khi có bản. Tình huống bảng trực là ví dụ dựng. Video có dùng hình ảnh và giọng đọc do AI tạo.
- Hashtag: #container #linux #nginx #devops #baomat #toptop

**Phở bò (Reels)**
- Tiêu đề: Container có cách ly hoàn toàn không?
- Mô tả: Vá ứng dụng xong chưa chắc là xong. Các container trên một máy dùng chung một nhân Linux, và bức tường giữa chúng do chính nhân dựng. Nhẹ và nhanh vì dùng chung, đó cũng là cái giá. Cần vá nginx, rồi vá cả nhân của máy chủ khi có bản. Tình huống bảng trực là ví dụ dựng. Video có dùng hình ảnh và giọng đọc do AI tạo.
- Hashtag: #container #linux #nginx #devops #baomat #phobo

**Ytb (Shorts)**
- Tiêu đề: Vá nginx xong, còn lớp nào chưa vá?
- Mô tả: Container nhẹ và nhanh vì dùng chung nhân Linux. Nhân dựng tường giữa các container, nên lỗi nhân có thể làm tường yếu đi. Ví dụ: bộ lỗi nginx mới công bố (chi tiết bước nhân chưa công bố đầy đủ). Việc làm: vá nginx, rồi vá cả nhân khi có bản. Tình huống bảng trực là ví dụ dựng. Video có dùng hình ảnh và giọng đọc do AI tạo.
- Hashtag: #container #linux #nginx #devops #baomat #ytb

## Nguồn
1. Cloudflare blog, "nginx2root" (đọc qua bản tóm tắt máy WebFetch, 21/11/2026): https://blog.cloudflare.com/nginx2root/ — công bố 18/11/2026 (UTC); mã chạy với quyền của worker nginx; bước lên root cần một lỗi nhân riêng, chi tiết bị giữ lại. Dùng cho S06–S07 ở mức "bộ lỗi nginx mới công bố", "có thể khiến hộp web bị chiếm, tuỳ cấu hình", "liên quan tới nhân, chi tiết chưa công bố đầy đủ".
2. Invicti, "nginx2root" (WebFetch, 21/11/2026): https://www.invicti.com/blog/web-security/nginx2root-critical-nginx-rce-vulnerabilities-explained — xác nhận ngày 18/11/2026, quyền worker, leo root cần lỗi nhân riêng, chuỗi chưa được tái hiện độc lập.
3. Docker docs, Docker security (đã mở, Claude chốt 21/11/2026): https://docs.docker.com/engine/security/ — cô lập bằng namespace; có thể cách ly chưa đầy đủ "khi kết hợp với lỗ hổng nhân".
4. Docker docs, "What is a container" (đã mở): https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/ — "every container on a machine shares that machine's kernel"; máy ảo khởi động hệ điều hành riêng gồm nhân riêng. Thay nguồn Red Hat (trang Red Hat trả 403 khi mở, Gemini dẫn trang overview khác trang script ghi).
5. Cloudflare nguyên văn (đã mở, Claude chốt): công bố 18/11/2026; mã chạy với quyền nginx worker; leo root cần lỗi nhân riêng, Xint chưa công bố chi tiết; Cloudflare dừng ở mức lỗi. Ghi chú nội bộ (KHÔNG đưa vào video): điều kiện cấu hình gồm HTTP/2, HTTP/3, proxy_pass, resolver, mail proxy; bài nêu chưa có bản vá nhân tính đến 18/11 và có CVE/SCTP, đều ngoài ranh giới brief nên không vào lời/hình. Vì thế lời S09 ghi "khi có bản".

## Điểm chờ kiểm / cần giám đốc nghe
- Nguồn Cloudflare và Docker đã mở lại ở bước chốt (21/11/2026); không còn [CẦN KIỂM NGUỒN]. Lời không còn "tường dày hơn" cho máy ảo.
- Giám đốc nghe: cách đọc "nginx" (engine x), "nhân", độ tự nhiên của nhịp.
