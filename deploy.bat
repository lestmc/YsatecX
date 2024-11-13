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

:: ������Ҫ��Ŀ¼���ļ�
echo ������Ҫ���ļ���Ŀ¼...
mkdir client\hooks 2>nul
mkdir client\styles 2>nul

:: ���� .gitignore
echo ���� .gitignore �ļ�...
(
echo node_modules/
echo .next/
echo out/
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
echo   base = "client"
echo   command = "npm run build"
echo   publish = "out"
echo.
echo [build.environment]
echo   NEXT_PUBLIC_API_URL = "��ĺ��API��ַ"
) > netlify.toml

:: ǰ�˹���
cd client

:: ɾ���ظ��� profile ҳ��
if exist pages\profile.js del pages\profile.js

:: ��װ����
echo ��װ����...
call npm install

:: ������Ŀ
echo ������Ŀ...
call npm run build

:: ��װ Netlify CLI
call npm install netlify-cli --save-dev

:: ��¼ Netlify
echo ���ȵ�¼ Netlify...
call npx netlify login

:: ������վ��
echo �����µ� Netlify վ��...
call npx netlify sites:create --name ysatecx

:: ���� Netlify
echo ���� Netlify...
call npx netlify deploy --prod --dir=out

:: �ύ�� Git
cd ..
git add .
git commit -m "Initial commit"

:: ���Զ�ֿ̲�
set /p repo_url="���� GitHub �ֿ� URL: "
git remote add origin %repo_url%
git push -u origin main

echo === �������! ===
pause 