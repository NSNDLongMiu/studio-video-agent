## 1. KIỂM CHỨNG

| Câu (mốc) | Khẳng định | Kết quả | Nguồn (URL) | Sửa đề nghị |
|---|---|---|---|---|
| S03 (11,5–20 s) | Container chạy chung một nhân Linux; nhân tạo ranh giới cách ly. | `ĐÚNG` | https://docs.docker.com/engine/security/ | Giữ nguyên. |
| S05 (25–30,5 s) | Máy ảo mỗi máy một nhân riêng, cách ly ("tường") dày hơn. | `ĐÚNG` | https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.0_release_notes/sect-red_hat_enterprise_linux-7.0_release_notes-overview-virtualization | Giữ nguyên. *(Đúng ở mức so sánh chung: máy ảo cách ly tầng phần cứng qua hypervisor nên bề mặt tấn công hẹp hơn).* |
| S06 (30,5–37 s) | Lỗi nginx mới (nginx2root) có thể làm tiến trình web bị chiếm tuỳ cấu hình. | `ĐÚNG` | https://blog.cloudflare.com/nginx2root/ | Giữ nguyên. *(Ghi chú kỹ thuật: Điều kiện là server bật HTTP/2 hoặc HTTP/3/QUIC trong chỉ thị `listen`).* |
| S07 (37–42 s) | Bước leo quyền tiếp theo cần lỗi nhân và chưa công bố chi tiết. | `ĐÚNG` | https://www.invicti.com/blog/web-security/nginx2root-critical-nginx-rce-vulnerabilities-explained | Giữ nguyên *(tuân thủ đúng ranh giới brief: không khẳng định root ngay).* |
| S09 (47,5–53 s) | Cần vá cả nginx lẫn nhân; `$ uname -r` xem phiên bản nhân. | `ĐÚNG` | https://man7.org/linux/man-pages/man1/uname.1.html | Giữ nguyên. *(Ghi chú kỹ thuật: `uname -r` in ra bản phát hành nhân đang chạy; chạy trong container vẫn trả về nhân của máy chủ).* |

---

## 2. DỄ HIỂU SAI

1. **S04 ("bức tường cũng yếu đi"):** Người xem dễ lầm tưởng container có bức tường độc lập bị nứt. Thực chất ranh giới chỉ là cơ chế phân chia của chính nhân Linux.  
   *Cách nói lại:* "Nhân gặp lỗi thì ranh giới ngăn cách cũng hở." *(10 chữ)*
2. **S06 ("hộp web bị chiếm"):** Dễ hiểu nhầm chiếm được web là kiểm soát luôn cả máy chủ. Kẻ tấn công mới chỉ chiếm tiến trình worker của nginx bên trong container.  
   *Cách nói lại:* "Kẻ xấu mới chỉ chiếm được ứng dụng web bên trong." *(11 chữ)*
3. **S09 (khung terminal `$ uname -r`):** Dễ ngỡ lệnh này kiểm tra nhân riêng của container. Container không có nhân riêng.  
   *Cách nói lại:* "Nên kiểm tra và vá cả nhân của máy chủ." *(10 chữ)*

---

## 3. MỞ ĐẦU

- **Phương án 1:** "Vá xong ứng dụng, sao máy chủ vẫn có thể sập?" *(11 chữ)*  
  *Lý do:* Đánh thẳng vào thói quen chủ quan chỉ kiểm tra ứng dụng mà quên máy chủ.
- **Phương án 2:** "Một hộp bị chiếm, cả máy chủ có toang theo?" *(10 chữ)*  
  *Lý do:* Nêu bật mối nguy lan truyền rủi ro từ kiến trúc dùng chung nhân.
- **Phương án 3:** "Nghĩ container hoàn toàn cô lập, bạn đã nhầm to!" *(10 chữ)*  
  *Lý do:* Phản biện trực tiếp hiểu lầm phổ biến về khả năng cách ly của container.