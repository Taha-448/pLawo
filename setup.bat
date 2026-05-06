@echo off
echo ==========================================
echo   pLawo - MERN Stack Setup (Windows)
echo ==========================================
echo.

echo [1/3] Installing Backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Backend installation failed.
    pause
    exit /b %ERRORLEVEL%
)
cd ..

echo.
echo [2/3] Installing Frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Frontend installation failed.
    pause
    exit /b %ERRORLEVEL%
)
cd ..

echo.
echo [3/3] Finalizing...
echo.
echo ==========================================
echo   INSTALLATION COMPLETE!
echo ==========================================
echo.
echo NEXT STEPS:
echo 1. Update the .env files in both /backend and /frontend.
echo 2. Run 'npm run dev' in both folders to start the project.
echo 3. Run 'node scripts/createAdmin.js' in /backend to create your admin.
echo.
pause
