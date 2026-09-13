@echo off
title Nihongo Master - Japanese Learning Web App
cd /d "%~dp0"
echo Dang khoi dong Nihongo Master...
echo Mo trinh duyet tai http://localhost:5173
start http://localhost:5173
npm run dev
pause
