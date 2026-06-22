@echo off
echo Starting Brookfield Properties Platform...
echo.
echo Opening Backend Server...
start cmd /k "cd backend && npm run dev"

timeout /t 2 /nobreak > nul

echo Opening Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
pause
