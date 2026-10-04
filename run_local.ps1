$frontendJob = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd Client; npm run dev" -PassThru

Write-Host "Started Frontend (PID: $($frontendJob.Id)) in a new window."
Write-Host "Backend is fully powered by Supabase."
Write-Host "Press any key to close this launcher..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
