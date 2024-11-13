@echo off
echo === YsatecX ����ű� ===

:: ��� Git �Ƿ�װ
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [����] δ��װ Git! ���Ȱ�װ Git.
    pause
    exit /b 1
)

:: ��ʼ�� Git �ֿ�
if not exist .git (
    echo ��ʼ�� Git �ֿ�...
    git init
)

:: ���� .gitignore
echo ���� .gitignore �ļ�...
(
echo node_modules/
echo .next/
echo .env
echo .env.local
echo .DS_Store
echo *.log
echo .vscode/
echo server/uploads/*
echo !server/uploads/.gitkeep
echo server/database.sqlite
) > .gitignore

:: ���� netlify.toml
echo ���� netlify.toml �����ļ�...
(
echo [build]
echo   command = "npm run build"
echo   publish = "client/.next"
echo   functions = "netlify/functions"
echo.
echo [[redirects]]
echo   from = "/api/*"
echo   to = "/.netlify/functions/:splat"
echo   status = 200
) > netlify.toml

:: �����ļ��� Git
echo �����ļ��� Git...
git add .

:: �ύ����
echo �����ύ...
set /p commit_msg="�����ύ��Ϣ (Ĭ��: Initial commit): " || set commit_msg=Initial commit
git commit -m "%commit_msg%"

:: ����Զ�ֿ̲�
set /p repo_url="���� GitHub �ֿ� URL: "
git remote add origin %repo_url%

:: ���͵� GitHub
echo ���͵� GitHub...
git push -u origin master

:: ����Ƿ�װ�� Netlify CLI
where netlify >nul 2>nul
if %errorlevel% neq 0 (
    echo ��װ Netlify CLI...
    npm install -g netlify-cli
)

:: ���� Netlify
echo ���� Netlify...
cd client
netlify deploy --prod

echo === �������! ===
pause 