@echo off
title Telegram Proxy + Cloudflare Tunnel
color 0B
cls
echo ======================================================================
echo    Starting Python Proxy Server & Cloudflare Quick Tunnel...
echo ======================================================================
echo.

:: Start Python Proxy Server in a separate window
start "Python Telegram Proxy (Port 5000)" cmd /k "python proxy_server.py"

echo Waiting for proxy server to initialize...
timeout /t 2 /nobreak >nul

:: Start Cloudflare Tunnel
echo Starting Cloudflare Tunnel on http://localhost:5000 ...
echo Look below for your public https://*.trycloudflare.com URL
echo ======================================================================
cloudflared tunnel --url http://localhost:5000
pause
