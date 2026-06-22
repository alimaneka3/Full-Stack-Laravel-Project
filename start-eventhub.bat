@echo off
echo ========================================
echo   Starting EventHub Application
echo ========================================
echo.
echo Starting Laravel Backend...
start cmd /k "cd C:\xampp\htdocs\eventhub && php artisan serve"
echo.
echo Starting React Frontend...
start cmd /k "cd C:\Users\alima\Desktop\Project && npm run dev"
echo.
echo ========================================
echo   Both servers are starting!
echo   Frontend: http://localhost:8080
echo   Backend:  http://localhost:8000
echo ========================================
echo.
echo Press any key to close this window...
pause > nul