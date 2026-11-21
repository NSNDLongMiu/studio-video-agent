# Chấm kịch bản IT-T19-E01 · bản 1 (Claude chốt)

## Bảng chấm 6 tiêu chí
| # | Tiêu chí | Kết quả | Lý do / bằng chứng |
|---|---|---|---|
| 1 | Bám phán quyết | Đạt | Giữ concept "Ai nhắn thay bạn?", hook tình huống Mít nhận tin vay (S01). |
| 2 | Giữ chân | Đạt | Tình huống ngay giây 0; mạch S-P-E-S; 9 cảnh ≈ 56,8 s, 1 cơ chế; trạng thái nút chuyển đổi ≥ 3 lần và kết trả đúng chỗ (S09); có trước/sau (S07, S08). |
| 3 | Đủ chi tiết cho Producer | Đạt | Có bảng ngân sách, mốc lời, voice_direction theo line_id, Y8, Bản đồ ngữ nghĩa, Chiều sâu. Đã đồng bộ lại sau khi đổi L06–L09 (số âm tiết S04 23, S05 15: nằm trong ngân sách, đo lại sau TTS). |
| 4 | Chính xác | Đạt | Lời 08 nay có nguồn sơ cấp (Công an TP Thanh Hoá, đã mở); Lời 13 có Meta Help (đã mở); khuyến cáo gọi số đã lưu có CafeF/Công an Hà Nội. "Ai cũng từng tin" đã bỏ. |
| 5 | Làm được & an toàn | Đạt | Chỉ hình dựng/UI giả lập, khai báo AI ở publish.json. |
| 6 | Văn phong | Đạt | Giọng Cáo, xưng "mình", gọi "bạn". |

## Xử lý đề xuất của Codex (7 mục: nhận 7, bác 0; có điều chỉnh nhỏ)
| Đề xuất | Quyết | Lý do |
|---|---|---|
| Lỗi S02/L03 (đăng nhập được ≠ chưa bị xâm nhập) | NHẬN | Giữ dấu tích nghĩa "vẫn truy cập được"; S03 xác định tin vay đến từ hồ sơ khác; lời không đổi vì L03 chỉ nói "vẫn đăng nhập được". |
| Lỗi S05/L08 (gọi rõ danh sách bạn bè, kẻ gian) | NHẬN | Thanh Hoá nêu đúng cơ chế (đã mở). Chị Lan chuyển sang hình. |
| Lỗi S06/L09 ("ai cũng từng tin") | NHẬN | Đổi thành "Ối, bạn thân cũng tin vì ảnh quen", bám ví dụ. |
| Lỗi S09 chữ "GỌI RỒI CHUYỂN" | NHẬN | Đổi `GỌI XÁC MINH` ở script, concept; S07 thêm Cáo phủ nhận và nút tắt. |
| Viết lại L06 | NHẬN | Chủ thể rõ. |
| Viết lại L07 | NHẬN (đổi "mình"→"bạn") | Người kể gọi người xem là "bạn", nhất quán. |
| Viết lại L08 | NHẬN | Như trên. |
| Bằng chứng hình S04 (góc nhìn khách, hai hồ sơ trùng) | NHẬN | Đã sửa S04. |
| Bằng chứng hình S07 (Cáo lắc đầu, nút tắt) | NHẬN | Đã sửa S07. |

## Gemini
Gemini vắng: NO_ACCOUNT. Không có kiểm chứng Gemini ở bản 1. Tự mở: Công an Thanh Hoá (đúng, nêu kết bạn với người trong danh sách bạn bè của tài khoản thật; bài 2022), Meta Help (đúng: có thể báo hồ sơ giả mạo), CafeF/Công an Hà Nội (đã mở trước đó). SAI/CHƯA XÁC MINH còn lại: 0.

## Việc còn phải sửa
1. Không bắt buộc: sau TTS đo lại mốc S04–S05 (lời ngắn hơn ≈ 1–2 âm tiết), có thể rút giữ để không thừa nghỉ.
2. Producer: kiểm phát âm "hack", "Facebook", "chat" (Y8, CHƯA KIỂM).

KẾT LUẬN: DUYỆT
