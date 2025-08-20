@echo off
REM Windows Setup Script for Tiklay Tauri Application
REM This script helps set up the development environment on Windows

echo Setting up Tiklay Tauri Application for Windows...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%a in ('node --version') do echo Node.js version: %%a
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo npm is not installed. Please install npm with Node.js
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%a in ('npm --version') do echo npm version: %%a
)

REM Install dependencies
echo Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

REM Check if Rust is installed
rustc --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Rust is not installed. Installing Rust...
    echo Downloading Rust installer...
    powershell -Command "Invoke-WebRequest -Uri 'https://win.rustup.rs/' -OutFile 'rustup-init.exe'"
    echo Running Rust installer...
    rustup-init.exe -y
    del rustup-init.exe
    echo Rust installed successfully!
) else (
    for /f "tokens=*" %%a in ('rustc --version') do echo Rust version: %%a
)

REM Add Rust to PATH for current session
set PATH=%PATH%;%USERPROFILE%\.cargo\bin

REM Check if Tauri CLI is available
npx tauri --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Tauri CLI not found. This is normal on first run.
) else (
    for /f "tokens=*" %%a in ('npx tauri --version') do echo Tauri CLI version: %%a
)

REM Generate Prisma client
echo Generating Prisma client...
npm run db:generate
if %errorlevel% neq 0 (
    echo Failed to generate Prisma client
    pause
    exit /b 1
)

REM Build the Next.js application
echo Building Next.js application...
npm run build
if %errorlevel% neq 0 (
    echo Failed to build Next.js application
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo.
echo To run the development server:
echo   npm run tauri:dev
echo   OR
echo   npx tauri dev
echo.
echo To build the application:
echo   npm run tauri:build
echo   OR
echo   npx tauri build
echo.
echo Note: On Windows, you might need to use npx tauri instead of npm run tauri
echo if you encounter PATH issues.
echo.
pause