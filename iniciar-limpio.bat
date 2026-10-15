@echo off
chcp 1252 >nul
cd /d "%~dp0"
start "Servidor" cmd /c "python -m http.server 8080"
timeout /t 2 >nul
start "" "http://localhost:8080/"
exit