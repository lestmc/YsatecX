@echo off
echo === YsatecX 部署脚本 ===

:: 检查 Git 是否安装
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未安装 Git! 请先安装 Git.
    pause
    exit /b 1
)

:: 初始化 Git 仓库
if not exist .git (
    echo 初始化 Git 仓库...
    git init
)

:: 创建 .gitignore
echo 创建 .gitignore 文件...
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

:: 创建 netlify.toml
echo 创建 netlify.toml 配置文件...
(
echo [build]
echo   base = "client"
echo   command = "npm run build"
echo   publish = ".next"
echo.
echo [[redirects]]
echo   from = "/api/*"
echo   to = "/.netlify/functions/:splat"
echo   status = 200
) > netlify.toml

:: 添加文件到 Git
echo 添加文件到 Git...
git add .

:: 提交更改
echo 创建提交...
set /p commit_msg="输入提交信息 (默认: Initial commit): " || set commit_msg=Initial commit
git commit -m "%commit_msg%"

:: 添加远程仓库
set /p repo_url="输入 GitHub 仓库 URL: "
git remote add origin %repo_url%

:: 推送到 GitHub
echo 推送到 GitHub...
git push -u origin master

:: 安装和配置 Netlify CLI
echo 安装 Netlify CLI...
cd client
call npm install netlify-cli --save-dev
call npx netlify login

:: 创建新的 Netlify 站点
echo 创建 Netlify 站点...
call npx netlify init

:: 部署到 Netlify
echo 部署到 Netlify...
call npx netlify deploy --prod

cd ..
echo === 部署完成! ===
pause 