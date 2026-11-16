# Đăng ký tác vụ Windows tự bật dashboard + worker khi bạn đăng nhập máy.
# KHÔNG tự chạy — bạn chạy thủ công khi muốn:   powershell -ExecutionPolicy Bypass -File studio\scripts\install-worker-task.ps1
# Gỡ:                                           schtasks /Delete /TN "XuongVideo-Worker" /F
$root = (Resolve-Path "$PSScriptRoot\..\..").Path
$node = (Get-Command node).Source
$cli  = Join-Path $root "studio\src\cli.mjs"
$action = "`"$node`" --disable-warning=ExperimentalWarning `"$cli`" start"
schtasks /Create /TN "XuongVideo-Worker" /SC ONLOGON /TR $action /RL LIMITED /F
Write-Host "Đã đăng ký. Kiểm tra:  schtasks /Query /TN XuongVideo-Worker   |  Chạy ngay:  schtasks /Run /TN XuongVideo-Worker"
