@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
echo Iniciando servidor local...
python -m http.server 8080 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  python3 -m http.server 8080 >nul 2>&1
)
if %ERRORLEVEL% NEQ 0 (
  echo Intentando con npx...
  start "" npx http-server -p 8080 -c-1
) else (
  start "" python -m http.server 8080
)
timeout /t 2 >nul
start "" http://localhost:8080/
echo Listo. La aplicacion se abrira en tu navegador.
pause >nul