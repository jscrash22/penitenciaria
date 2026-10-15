@echo off
cd /d "%~dp0"
start "" cmd /k "python -m http.server 8080"
timeout /t 2 >nul
start "" http://localhost:8080/