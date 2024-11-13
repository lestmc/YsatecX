@echo off
echo === YsatecX 完整部署脚本 ===

:: 检查必要工具
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 请先安装Git!
    pause
    exit /b 1
)

:: 清理旧文件
echo 清理旧文件...
if exist client\.next rd /s /q client\.next
if exist client\out rd /s /q client\out
if exist client\node_modules rd /s /q client\node_modules
if exist server\node_modules rd /s /q server\node_modules

:: 创建必要的目录
echo 创建目录结构...
mkdir client\hooks 2>nul
mkdir client\styles 2>nul
mkdir server\uploads\images 2>nul
mkdir server\uploads\files 2>nul
mkdir server\uploads\avatars 2>nul

:: 创建 .gitignore
echo 创建 .gitignore...
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

:: 创建 netlify.toml
echo 创建 netlify.toml...
(
echo [build]
echo   base = "client"
echo   command = "npm run build"
echo   publish = "out"
echo.
echo [build.environment]
echo   NEXT_PUBLIC_API_URL = "你的后端API地址"
) > netlify.toml

:: 前端配置
cd client

:: 安装依赖
echo 安装前端依赖...
call npm install

:: 创建或更新 .env.local
echo 创建环境变量文件...
(
echo NEXT_PUBLIC_API_URL=http://localhost:3002
) > .env.local

:: 构建前端
echo 构建前端...
call npm run build

:: 后端配置
cd ..\server

:: 安装依赖
echo 安装后端依赖...
call npm install

:: 创建 .env
echo 创建后端环境变量...
(
echo PORT=3002
echo JWT_SECRET=your-secret-key
echo NODE_ENV=development
) > .env

cd ..

:: Git 初始化和提交
echo 初始化Git仓库...
git init
git add .
git commit -m "Initial commit"

:: 部署选项
echo.
echo 选择部署方式:
echo 1. GitHub Pages
echo 2. Netlify
echo 3. 本地开发
set /p deploy_option="请选择 (1-3): "

if "%deploy_option%"=="1" (
    call deploy-github.bat
) else if "%deploy_option%"=="2" (
    call deploy-netlify.bat
) else if "%deploy_option%"=="3" (
    echo 启动本地开发服务器...
    start cmd /k "cd server && npm run dev"
    start cmd /k "cd client && npm run dev"
)

echo === 部署完成! ===
pause 