Start-Process -WindowStyle Hidden -FilePath "python" -ArgumentList "-m","http.server","8080" -WorkingDirectory $PSScriptRoot
Start-Sleep -Seconds 1.5
Start-Process "http://localhost:8080/"
Exit 0