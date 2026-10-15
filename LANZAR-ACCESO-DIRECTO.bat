@echo off
powershell -ExecutionPolicy Bypass -WindowStyle Hidden -NoProfile -Command ^
  "$p='%~dp0'; Start-Process -WindowStyle Hidden -FilePath python -ArgumentList '-m','http.server','8080' -WorkingDirectory $p; Start-Sleep -s 1.5; Start-Process 'http://localhost:8080/'"
exit