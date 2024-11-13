@echo off
echo === YsatecX Git部署脚本 ===

:: 检查Git
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

:: 创建.gitignore
echo 创建.gitignore...
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

:: 前端构建
cd client

:: 安装依赖
echo 安装依赖...
call npm install

:: 构建
echo 构建项目...
call npm run build

cd ..

:: Git操作
if not exist .git (
    echo 初始化Git仓库...
    git init
)

:: 添加所有文件
echo 添加文件到Git...
git add .

:: 提交更改
set /p commit_msg="输入提交信息 (默认: Update project): " || set commit_msg=Update project
git commit -m "%commit_msg%"

:: 添加远程仓库（如果需要）
git remote -v | findstr "origin" > nul
if %errorlevel% neq 0 (
    set /p repo_url="输入GitHub仓库URL: "
    git remote add origin %repo_url%
)

:: 推送到GitHub
echo 推送到GitHub...
git push -u origin main

echo === 部署完成! ===
echo 请访问GitHub仓库检查部署结果
pause 