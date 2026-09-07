@echo off
title Push AIRA Newsletter to GitHub
echo ===================================================
echo   Pushing AIRA Newsletter to GitHub (deep-5/newsletter)
echo ===================================================
echo.
cd /d "d:\newzletr"
"C:\Users\Deep\.gemini\antigravity\tools\git\cmd\git.exe" push -u origin main
echo.
echo ===================================================
echo   Done! Press any key to close this window.
echo ===================================================
pause
