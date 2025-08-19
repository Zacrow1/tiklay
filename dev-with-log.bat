@echo off
echo Starting development server with logging...
echo Logs will be saved to dev.log
echo.

:: Create log file if it doesn't exist
if not exist dev.log (
    echo Development Log - %date% %time% > dev.log
    echo =================================== >> dev.log
    echo. >> dev.log
)

:: Start nodemon and redirect both stdout and stderr to log file
:: Also display output in console
nodemon --exec "npx tsx server.ts" --watch server.ts --watch src --ext ts,tsx,js,jsx 2>&1 | tee dev.log

:: If tee is not available, use this alternative:
:: nodemon --exec "npx tsx server.ts" --watch server.ts --watch src --ext ts,tsx,js,jsx > dev.log 2>&1 & type dev.log

echo.
echo Development server stopped.