@echo off
REM Windows Build Script for Tiklay Tauri Application
REM This script handles the complete build process for Windows

echo ========================================
echo Tiklay Windows Build Process
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%a in ('node --version') do echo [INFO] Node.js version: %%a
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%a in ('npm --version') do echo [INFO] npm version: %%a
)

REM Check if Rust is installed
rustc --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Rust is not installed.
    echo Please install Rust from https://rustup.rs/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%a in ('rustc --version') do echo [INFO] Rust version: %%a
)

REM Add Rust to PATH for current session
set PATH=%PATH%;%USERPROFILE%\.cargo\bin

REM Clean previous builds
echo.
echo [STEP 1] Cleaning previous builds...
if exist "out" rmdir /s /q out
if exist "src-tauri\target" rmdir /s /q src-tauri\target
echo [INFO] Previous builds cleaned successfully.

REM Install dependencies
echo.
echo [STEP 2] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b 1
)
echo [INFO] Dependencies installed successfully.

REM Generate Prisma client
echo.
echo [STEP 3] Generating Prisma client...
npm run db:generate
if %errorlevel% neq 0 (
    echo [ERROR] Failed to generate Prisma client.
    pause
    exit /b 1
)
echo [INFO] Prisma client generated successfully.

REM Build Next.js application
echo.
echo [STEP 4] Building Next.js application...
npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build Next.js application.
    pause
    exit /b 1
)
echo [INFO] Next.js application built successfully.

REM Build Tauri application
echo.
echo [STEP 5] Building Tauri application...
echo [INFO] This may take several minutes...

REM Try npm run tauri:build first
npm run tauri:build
if %errorlevel% neq 0 (
    echo [WARNING] npm run tauri:build failed, trying npx tauri build...
    npx tauri build
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to build Tauri application.
        echo.
        echo [TROUBLESHOOTING]
        echo 1. Make sure Visual Studio Build Tools is installed
        echo 2. Check if Rust is properly installed
        echo 3. Verify all dependencies are installed
        echo 4. Try running as Administrator
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo BUILD COMPLETED SUCCESSFULLY!
echo ========================================
echo.

REM Check if build artifacts exist
if exist "src-tauri\target\release\bundle" (
    echo [INFO] Build artifacts location:
    echo src-tauri\target\release\bundle\
    echo.
    dir /b /s "src-tauri\target\release\bundle\*.msi"
    dir /b /s "src-tauri\target\release\bundle\*.exe"
) else (
    echo [WARNING] Build artifacts not found in expected location.
    echo Checking alternative locations...
    if exist "src-tauri\target\release\tiklay.exe" (
        echo [INFO] Found executable at: src-tauri\target\release\tiklay.exe
    ) else (
        echo [ERROR] No build artifacts found.
        echo Please check the build process for errors.
    )
)

echo.
echo [NEXT STEPS]
echo 1. Test the built application
echo 2. Distribute the installer from the bundle folder
echo 3. Consider code signing for production releases
echo.
echo Build process completed at: %date% %time%
echo.
pause