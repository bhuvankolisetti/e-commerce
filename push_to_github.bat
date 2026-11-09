@echo off
title Push Amazon Clone to GitHub
cls
echo ==========================================================
echo   Amazon Clone E-Commerce - One-Click GitHub Sync
echo   Target: https://github.com/bhuvankolisetti/e-commerce
echo ==========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0push_to_github.ps1"
pause

