Add-Type -AssemblyName System.Windows.Forms

$raw = [System.Environment]::GetCommandLineArgs()
$cmdLine = [System.Environment]::CommandLine

if ($cmdLine -match 'launcher\.ps1\s+"launch://run/(.+)"') {
    $encoded = $Matches[1]
} elseif ($cmdLine -match 'launcher\.ps1\s+launch://run/(.+)') {
    $encoded = $Matches[1]
} else {
    [System.Windows.Forms.MessageBox]::Show('无法解析启动参数', 'AI中台启动器', 'OK', 'Error')
    exit 1
}

$exePath = [System.Uri]::UnescapeDataString($encoded)

if (-not (Test-Path $exePath)) {
    [System.Windows.Forms.MessageBox]::Show("程序不存在:`n$exePath", 'AI中台启动器', 'OK', 'Error')
    exit 1
}

try {
    Start-Process -FilePath $exePath -WorkingDirectory (Split-Path $exePath -Parent)
} catch {
    [System.Windows.Forms.MessageBox]::Show("启动失败: $_", 'AI中台启动器', 'OK', 'Error')
}
