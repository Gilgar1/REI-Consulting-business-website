Write-Host "Checking prerequisites..."
node -v
npm -v

Write-Host "`nSetting up Frontend..."
cd Client
npm install
cd ..

Write-Host "`nSetup Complete! Backend is managed fully via Supabase."
Write-Host "Run .\run_local.ps1 to start the React frontend."
