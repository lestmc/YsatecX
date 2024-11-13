@echo off
echo === YsatecX ��������ű� ===

:: ����Ҫ����
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [����] ���Ȱ�װGit!
    pause
    exit /b 1
)

:: ������ļ�
echo ������ļ�...
if exist client\.next rd /s /q client\.next
if exist client\out rd /s /q client\out
if exist client\node_modules rd /s /q client\node_modules
if exist server\node_modules rd /s /q server\node_modules

:: ������Ҫ��Ŀ¼
echo ����Ŀ¼�ṹ...
mkdir client\hooks 2>nul
mkdir client\styles 2>nul
mkdir server\uploads\images 2>nul
mkdir server\uploads\files 2>nul
mkdir server\uploads\avatars 2>nul

:: ���� .gitignore
echo ���� .gitignore...
(
echo # Dependencies
echo node_modules/
echo .next/
echo out/
echo.
echo # Environment
echo .env
echo .env.local
echo .env.development
echo .env.production
echo.
echo # System files
echo .DS_Store
echo Thumbs.db
echo.
echo # Debug
echo npm-debug.log*
echo yarn-debug.log*
echo yarn-error.log*
echo.
echo # IDE
echo .vscode/
echo .idea/
echo.
echo # Upload directory
echo server/uploads/*
echo !server/uploads/.gitkeep
echo.
echo # Database
echo server/database.sqlite
) > .gitignore

:: ���� netlify.toml
echo ���� netlify.toml...
(
echo [build]
echo   base = "client"
echo   command = "npm run build"
echo   publish = "out"
echo.
echo [build.environment]
echo   NEXT_PUBLIC_API_URL = "��ĺ��API��ַ"
) > netlify.toml

:: ǰ������
cd client

:: ��װ����
echo ��װǰ������...
call npm install

:: ��������� .env.local
echo �������������ļ�...
(
echo NEXT_PUBLIC_API_URL=http://localhost:3002
) > .env.local

:: ����ǰ��
echo ����ǰ��...
call npm run build

:: �������
cd ..\server

:: ��װ����
echo ��װ�������...
call npm install

:: ���� .env
echo ������˻�������...
(
echo PORT=3002
echo JWT_SECRET=your-secret-key
echo NODE_ENV=development
) > .env

cd ..

:: Git ��ʼ�����ύ
echo ��ʼ��Git�ֿ�...
git init
git add .
git commit -m "Initial commit"

:: ����ѡ��
echo.
echo ѡ����ʽ:
echo 1. GitHub Pages
echo 2. Netlify
echo 3. ���ؿ���
set /p deploy_option="��ѡ�� (1-3): "

if "%deploy_option%"=="1" (
    call deploy-github.bat
) else if "%deploy_option%"=="2" (
    call deploy-netlify.bat
) else if "%deploy_option%"=="3" (
    echo �������ؿ���������...
    start cmd /k "cd server && npm run dev"
    start cmd /k "cd client && npm run dev"
)

echo === �������! ===
pause 