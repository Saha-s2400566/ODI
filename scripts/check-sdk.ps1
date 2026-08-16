$paths = @(
  "$env:LOCALAPPDATA\Android\Sdk",
  'C:\Android\Sdk',
  'C:\Program Files\Android\Android Studio\Sdk',
  'C:\Program Files (x86)\Android\android-sdk'
)

foreach ($p in $paths) {
  if (Test-Path $p) {
    Write-Output "FOUND:$p"
    $adb = Join-Path $p 'platform-tools\adb.exe'
    if (Test-Path $adb) { Write-Output "ADBFOUND:$adb" }
    $emu = Join-Path $p 'emulator\emulator.exe'
    if (Test-Path $emu) { Write-Output "EMULATORFOUND:$emu" }
  } else {
    Write-Output "MISSING:$p"
  }
}
