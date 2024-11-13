@echo off
echo === YsatecX Git����ű� ===

:: ���Git
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

:: ����.gitignore
echo ����.gitignore...
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

:: ǰ�˹���
cd client

:: ��װ����
echo ��װ����...
call npm install

:: ����
echo ������Ŀ...
call npm run build

cd ..

:: Git����
if not exist .git (
    echo ��ʼ��Git�ֿ�...
    git init
)

:: ��������ļ�
echo ����ļ���Git...
git add .

:: �ύ����
set /p commit_msg="�����ύ��Ϣ (Ĭ��: Update project): " || set commit_msg=Update project
git commit -m "%commit_msg%"

:: ���Զ�ֿ̲⣨�����Ҫ��
git remote -v | findstr "origin" > nul
if %errorlevel% neq 0 (
    set /p repo_url="����GitHub�ֿ�URL: "
    git remote add origin %repo_url%
)

:: ���͵�GitHub
echo ���͵�GitHub...
git push -u origin main

echo === �������! ===
echo �����GitHub�ֿ��鲿����
pause 