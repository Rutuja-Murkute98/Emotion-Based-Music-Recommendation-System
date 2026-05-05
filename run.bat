@echo off
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo ================================================
echo   Emotion Based Music Recommendation System
echo ================================================
echo.

if exist ".venv\Scripts\activate.bat" (
    echo [INFO] Activating virtual environment...
    call .venv\Scripts\activate.bat
) else (
    echo [WARN] No .venv found. Using system Python.
    echo [HINT] Create one with: python -m venv .venv
    echo [HINT] Then install:   .venv\Scripts\pip install -r requirements.txt
    echo.
)

echo [INFO] Starting Flask app...
echo [INFO] Open http://127.0.0.1:8000 in your browser
echo.
python app.py

pause
