@echo off
title Pakistan Telegram Proxy Server
color 0A
cls
echo ======================================================================
echo    Starting Pakistan Telegram Proxy Server on your PC...
echo ======================================================================
echo.
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3 from https://www.python.org/
    pause
    exit /b 1
)

python proxy_server.py
if errorlevel 1 (
    echo.
    echo Server stopped with error.
    pause
)
