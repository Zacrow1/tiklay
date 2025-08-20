# Windows Setup Script for Tiklay Tauri Application
# This script helps set up the development environment on Windows

Write-Host "Setting up Tiklay Tauri Application for Windows..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Yellow
} catch {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Yellow
} catch {
    Write-Host "npm is not installed. Please install npm with Node.js" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
npm install

# Check if Rust is installed
try {
    $rustVersion = rustc --version
    Write-Host "Rust version: $rustVersion" -ForegroundColor Yellow
} catch {
    Write-Host "Rust is not installed. Installing Rust..." -ForegroundColor Yellow
    # Download and run Rust installer
    Invoke-WebRequest -Uri "https://win.rustup.rs/" -OutFile "rustup-init.exe"
    .\rustup-init.exe -y
    Remove-Item rustup-init.exe
    Write-Host "Rust installed successfully!" -ForegroundColor Green
}

# Add Rust to PATH for current session
$env:PATH += ";$env:USERPROFILE\.cargo\bin"

# Check if Tauri CLI is properly installed
try {
    $tauriVersion = tauri --version
    Write-Host "Tauri CLI version: $tauriVersion" -ForegroundColor Yellow
} catch {
    Write-Host "Tauri CLI not found in PATH. This is normal on Windows." -ForegroundColor Yellow
}

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npm run db:generate

# Build the Next.js application
Write-Host "Building Next.js application..." -ForegroundColor Yellow
npm run build

Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To run the development server:" -ForegroundColor Cyan
Write-Host "  npm run tauri:dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "To build the application:" -ForegroundColor Cyan
Write-Host "  npm run tauri:build" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: If you encounter PATH issues with Tauri CLI, try using:" -ForegroundColor Yellow
Write-Host "  npx tauri dev" -ForegroundColor Yellow
Write-Host "  npx tauri build" -ForegroundColor Yellow