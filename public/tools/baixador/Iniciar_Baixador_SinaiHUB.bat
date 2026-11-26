@echo off
title SinaiHUB - Motor Universal de Downloads
color 06
echo ========================================================
echo    SinaiHUB - Motor Universal de Downloads (Python)
echo ========================================================
echo.
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python nao encontrado no PATH! Instale Python 3.10+ primeiro.
    pause
    exit /b 1
)

python -m yt_dlp --version >nul 2>&1
if errorlevel 1 (
    echo [INFO] Instalando yt-dlp automaticamente...
    pip install -U yt-dlp
)

echo [OK] Iniciando servidor local na porta 8787...
echo [OK] Voce ja pode voltar ao SinaiHUB no navegador e colar seus links!
echo.
python "%~dp0sinaihub_downloader.py"
pause
