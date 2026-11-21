# Luật dùng chung của pipeline

`pipeline-rules.json` cung cấp kích thước khung, vùng an toàn, giới hạn opening và camera, cùng danh sách loại cảnh cho các công cụ lập kế hoạch, dựng và QC.

- Node dùng `loadRules()` từ `tools/config/rules.mjs`.
- Python dùng `from tools.config.rules import load_rules` khi gốc repo nằm trong đường dẫn import.

Hai hàm đọc cùng một tệp theo vị trí module. Mỗi tiến trình giữ kết quả sau lần đọc hợp lệ đầu tiên. Dùng kết quả như dữ liệu chỉ đọc và khởi động tiến trình mới để nạp luật đã sửa.

Khi thêm khóa dùng chung, thêm vào JSON, cập nhật `version` và bổ sung kiểm tra ở cả hai hàm nếu khóa đó bắt buộc. Nếu đổi biên opening hoặc danh sách kiểu opening, giai đoạn hay loại cảnh, cập nhật enum hoặc giới hạn tương ứng trong schema rồi chạy `node --test studio/test/pipeline-rules.test.mjs`.

`opening.target_s` là mục tiêu lập kế hoạch. `opening.min_s` và `opening.max_s` là giới hạn schema. Công cụ dựng và QC áp dụng các mốc giọng và chuyển động khi chúng đọc cấu hình.
