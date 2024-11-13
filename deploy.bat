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

:: 创建必要的目录和文件
echo 创建必要的文件和目录...
mkdir client\hooks 2>nul
mkdir client\styles 2>nul

:: 创建 .gitignore
echo 创建 .gitignore 文件...
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

:: 创建 netlify.toml
echo 创建 netlify.toml 配置文件...
(
echo [build]
echo   base = "client"
echo   command = "npm run build"
echo   publish = "out"
echo.
echo [build.environment]
echo   NEXT_PUBLIC_API_URL = "你的后端API地址"
) > netlify.toml

:: 前端构建
cd client

:: 删除重复的 profile 页面
if exist pages\profile.js del pages\profile.js

:: 安装依赖
echo 安装依赖...
call npm install

:: 构建项目
echo 构建项目...
call npm run build

:: 安装 Netlify CLI
call npm install netlify-cli --save-dev

:: 登录 Netlify
echo 请先登录 Netlify...
call npx netlify login

:: 创建新站点
echo 创建新的 Netlify 站点...
call npx netlify sites:create --name ysatecx

:: 部署到 Netlify
echo 部署到 Netlify...
call npx netlify deploy --prod --dir=out

:: 提交到 Git
cd ..
git add .
git commit -m "Initial commit"

:: 添加远程仓库
set /p repo_url="输入 GitHub 仓库 URL: "
git remote add origin %repo_url%
git push -u origin main

echo === 部署完成! ===
pause 