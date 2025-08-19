@echo off
echo Starting production server with logging...
echo Logs will be saved to server.log
echo.

:: Create log file if it doesn't exist
if not exist server.log (
    echo Production Log - %date% %time% > server.log
    echo ================================== >> server.log
    echo. >> server.log
)

:: Start production server and redirect both stdout and stderr to log file
set NODE_ENV=production
tsx server.ts > server.log 2>&1

echo.
echo Production server stopped.