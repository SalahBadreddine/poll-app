@echo off
echo Starting Poll App...
echo.
echo Make sure you have:
echo 1. Configured your .env file with DATABASE_URL and JWT_SECRET
echo 2. Initialized the database schema in Neon
echo.
echo Starting backend server in new window...
start "Backend Server" cmd /k "npm run dev:server"
timeout /t 3 /nobreak >nul
echo Starting frontend...
npm run dev

