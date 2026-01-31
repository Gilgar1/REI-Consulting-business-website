Write-Host "Checking prerequisites..."
python --version
node -v

Write-Host "`nSetting up Backend..."
cd Server
if (!(Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
}
.\venv\Scripts\Activate.ps1
Write-Host "Upgrading pip..."
python -m pip install --upgrade pip
Write-Host "Installing requirements..."
pip install -r requirements.txt
Write-Host "Running migrations..."
python manage.py migrate
cd ..

Write-Host "`nSetting up Frontend..."
cd Client
npm install
cd ..

Write-Host "`nSetup Complete! Run .\run_local.ps1 to start."
