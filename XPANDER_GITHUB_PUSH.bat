@echo off
title Xpander.ai GitHub Feltoltes
echo =======================================================
echo   Xpander.ai -^> GitHub (https://github.com/viktornoss/xpander)
echo =======================================================
echo.
cd /d "C:\Users\viktornoss\.gemini\antigravity\scratch\nexus-ai-agency"
echo Fajlok feltoltese folyamatban...
echo (Ha felugrik a Git Credential ablak, kattints a 'Sign in with your browser' gombra!)
echo.
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo =======================================================
    echo   SIKERESEN FELTOLTVE A GITHUB-RA!
    echo   Link: https://github.com/viktornoss/xpander
    echo =======================================================
) else (
    echo Hiba tortent vagy a bejelentkezes megszakadt.
)
echo.
pause

