@echo off
chcp 65001 >nul
set "DEST=%LOCALAPPDATA%\OtchetGofrolinii"
mkdir "%DEST%" 2>nul
copy /y "%~dp0index.html" "%DEST%\" >nul
copy /y "%~dp0icon.ico" "%DEST%\" >nul
echo Загрузка Vue для работы без интернета...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try{Invoke-WebRequest -UseBasicParsing -Uri 'https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js' -OutFile (Join-Path $env:LOCALAPPDATA 'OtchetGofrolinii\vue.global.prod.js')}catch{}"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$d=Join-Path $env:LOCALAPPDATA 'OtchetGofrolinii'; $b=@('C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe','C:\Program Files\Microsoft\Edge\Application\msedge.exe','C:\Program Files\Google\Chrome\Application\chrome.exe','C:\Program Files (x86)\Google\Chrome\Application\chrome.exe') | Where-Object { Test-Path $_ } | Select-Object -First 1; if(-not $b){ exit 1 }; $u=([System.Uri](Join-Path $d 'index.html')).AbsoluteUri; $s=(New-Object -ComObject WScript.Shell).CreateShortcut((Join-Path ([Environment]::GetFolderPath('Desktop')) 'Otchet gofrolinii.lnk')); $s.TargetPath=$b; $s.Arguments='--app='+$u+' --window-size=1320,900'; $s.IconLocation=(Join-Path $d 'icon.ico'); $s.Save()"
if errorlevel 1 (
  echo Не найден Microsoft Edge или Google Chrome. Установите один из них и запустите файл снова.
  pause
  exit /b 1
)
echo Готово. На рабочем столе появился ярлык "Otchet gofrolinii".
echo Чтобы обновить приложение, запустите Install.bat из новой папки ещё раз: данные сохранятся.
pause
