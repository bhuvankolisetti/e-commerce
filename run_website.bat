@echo off
title Amazon Clone Local Server
cls
echo ==============================================================
echo   🚀 Starting Amazon Clone E-Commerce Server
echo   🌐 Opening http://localhost:5000 in your browser...
echo   👨‍💻 Author: Bhuvan Kolisetti
echo ==============================================================
echo.
timeout /t 2 /nobreak >nul
start "" http://localhost:5000
python app.py
pause

