@echo off
setlocal
cd /d "%~dp0"
start "" python start.py
exit
echo Hecho. Si no se abrio el navegador, ve a http://localhost:8080/