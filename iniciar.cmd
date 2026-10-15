@echo off
cd /d %~dp0
start "" "%LOCALAPPDATA%\Programs\Python\Python314\python.exe" -m http.server 8080
start "" "%LOCALAPPDATA%\Programs\Python\Python313\python.exe" -m http.server 8080
python -m http.server 8080
exit
echo intentado
timeout /t 1 >nul
start "" http://localhost:8080/