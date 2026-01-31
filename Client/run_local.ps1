$backendJob = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd Server; .\venv\Scripts\Activate.ps1; python manage.py runserver 8000" -PassThru
$frontendJob = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd Client; npm run dev" -PassThru

Write-Host "Started Backend (PID: $($backendJob.Id)) and Frontend (PID: $($frontendJob.Id)) in new windows."
Write-Host "Press any key to close this launcher..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
