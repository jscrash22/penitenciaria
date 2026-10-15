Dim shell, fso, ps
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
ps = fso.GetParentFolderName(WScript.ScriptFullName)
shell.Run "powershell -ExecutionPolicy Bypass -WindowStyle Hidden -Command ""cd '" & ps & "'; python -m http.server 8080 > $null 2>&1; Start-Sleep -s 1.5; Start-Process 'http://localhost:8080/'""", 0, False
Set shell = Nothing
Set fso = Nothing