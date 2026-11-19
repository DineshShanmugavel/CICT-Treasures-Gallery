@echo off
rem CICT Tamil Treasures Gallery: serve this folder to the office network on port 8080.
rem Double-click to start. Uses Node.js if installed, otherwise Python.
title CICT Tamil Treasures Gallery - local server
cd /d "%~dp0"
set PORT=8080
if not "%~1"=="" set PORT=%~1

where node >nul 2>nul
if %errorlevel%==0 (
  node serve-museum.mjs %PORT%
  goto :end
)

where python >nul 2>nul
if %errorlevel%==0 (
  echo Node.js not found - using Python. Recordings and films may not allow seeking.
  echo Open http://localhost:%PORT%/ here, or http://THIS-PC-ADDRESS:%PORT%/ on other computers.
  python -m http.server %PORT% --bind 0.0.0.0
  goto :end
)

where py >nul 2>nul
if %errorlevel%==0 (
  echo Node.js not found - using Python. Recordings and films may not allow seeking.
  py -m http.server %PORT% --bind 0.0.0.0
  goto :end
)

echo.
echo  Neither Node.js nor Python is installed on this PC.
echo  Install Node.js (LTS) from https://nodejs.org/ and double-click this file again.
echo.

:end
pause
