@echo off
REM Windows Setup Test Script for Tiklay
REM This script tests if all required components are properly installed

echo ========================================
echo Tiklay Windows Setup Test
echo ========================================
echo.

REM Initialize test counter
set TESTS_PASSED=0
set TESTS_TOTAL=7

REM Test 1: Node.js
echo [TEST 1/7] Testing Node.js installation...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%a in ('node --version') do echo [PASS] Node.js is installed: %%a
    set /a TESTS_PASSED+=1
) else (
    echo [FAIL] Node.js is not installed or not in PATH
    echo        Download from: https://nodejs.org/
)
echo.

REM Test 2: npm
echo [TEST 2/7] Testing npm installation...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%a in ('npm --version') do echo [PASS] npm is installed: %%a
    set /a TESTS_PASSED+=1
) else (
    echo [FAIL] npm is not installed or not in PATH
)
echo.

REM Test 3: Git
echo [TEST 3/7] Testing Git installation...
git --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%a in ('git --version') do echo [PASS] Git is installed: %%a
    set /a TESTS_PASSED+=1
) else (
    echo [FAIL] Git is not installed or not in PATH
    echo        Download from: https://git-scm.com/
)
echo.

REM Test 4: Rust
echo [TEST 4/7] Testing Rust installation...
rustc --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%a in ('rustc --version') do echo [PASS] Rust is installed: %%a
    set /a TESTS_PASSED+=1
) else (
    echo [FAIL] Rust is not installed or not in PATH
    echo        Download from: https://rustup.rs/
)
echo.

REM Test 5: Cargo
echo [TEST 5/7] Testing Cargo installation...
cargo --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%a in ('cargo --version') do echo [PASS] Cargo is installed: %%a
    set /a TESTS_PASSED+=1
) else (
    echo [FAIL] Cargo is not installed or not in PATH
    echo        Should be installed with Rust
)
echo.

REM Test 6: Tauri CLI
echo [TEST 6/7] Testing Tauri CLI...
npx tauri --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%a in ('npx tauri --version') do echo [PASS] Tauri CLI is available: %%a
    set /a TESTS_PASSED+=1
) else (
    echo [FAIL] Tauri CLI is not available
    echo        Will be installed with: npm install
)
echo.

REM Test 7: Project Dependencies
echo [TEST 7/7] Testing project dependencies...
if exist "node_modules" (
    echo [PASS] node_modules directory exists
    set /a TESTS_PASSED+=1
) else (
    echo [FAIL] node_modules directory not found
    echo        Run: npm install
)
echo.

REM Summary
echo ========================================
echo TEST SUMMARY
echo ========================================
echo Tests passed: %TESTS_PASSED%/%TESTS_TOTAL%
echo.

if %TESTS_PASSED% equ %TESTS_TOTAL% (
    echo [SUCCESS] All tests passed! Your system is ready for development.
    echo.
    echo Next steps:
    echo 1. Run: npm install (if not already done)
    echo 2. Run: npm run tauri:dev (for development)
    echo 3. Run: npm run tauri:build (for production build)
) else (
    echo [WARNING] Some tests failed. Please install the missing components.
    echo.
    echo Missing components detected. Please install:
    if %TESTS_PASSED% lss 1 echo - Node.js
    if %TESTS_PASSED% lss 2 echo - npm
    if %TESTS_PASSED% lss 3 echo - Git
    if %TESTS_PASSED% lss 4 echo - Rust
    if %TESTS_PASSED% lss 5 echo - Cargo
    if %TESTS_PASSED% lss 6 echo - Tauri CLI
    if %TESTS_PASSED% lss 7 echo - Project dependencies
)

echo.
echo For detailed setup instructions, see:
echo - README.md
echo - docs/WINDOWS_DEVELOPMENT.md
echo.
pause