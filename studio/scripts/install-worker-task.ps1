# Đăng ký tác vụ Windows tự bật dashboard + worker khi bạn đăng nhập máy.
# KHÔNG tự chạy — bạn chạy thủ công khi muốn:   powershell -ExecutionPolicy Bypass -File studio\scripts\install-worker-task.ps1
# Gỡ:                                           schtasks /Delete /TN "XuongVideo-Worker" /F
$root = (Resolve-Path "$PSScriptRoot\..\..").Path
$node = (Get-Command node).Source
$cli  = Join-Path $root "studio\src\cli.mjs"
# /TR cần 1 chuỗi duy nhất; nếu đường dẫn node.exe hoặc cli.mjs có khoảng trắng (ví dụ "Program Files" hoặc tên dự án
# có dấu cách), quote thường bị schtasks hiểu cắt ngang ở dấu " đầu tiên. Phải escape quote trong path bằng \" để
# toàn bộ chuỗi được coi là 1 giá trị /TR.
$action = "\`"$node\`" --disable-warning=ExperimentalWarning \`"$cli\`" start"
schtasks /Create /TN "XuongVideo-Worker" /SC ONLOGON /TR $action /RL LIMITED /F
if ($LASTEXITCODE -eq 0) {
  Write-Host "Đã đăng ký. Kiểm tra:  schtasks /Query /TN XuongVideo-Worker   |  Chạy ngay:  schtasks /Run /TN XuongVideo-Worker"
} else {
  Write-Host "LỖI: schtasks thoát với mã $LASTEXITCODE — chưa đăng ký được (thường do thiếu quyền Administrator). Mở PowerShell bằng 'Run as Administrator' rồi chạy lại."
}
