@echo off
echo Stopping Java processes...
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak

echo Stopping Gradle daemon...
call gradlew --stop
timeout /t 2 /nobreak

echo Cleaning build directory...
rmdir /s /q build 2>nul
timeout /t 2 /nobreak

echo Starting application...
call gradlew bootRun --no-daemon 