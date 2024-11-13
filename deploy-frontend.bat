@echo off
echo === YsatecX 前端部署脚本 ===

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
) > client\.gitignore

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
) > client\netlify.toml

:: 构建前端
cd client
call npm install
call npm run build

:: 部署到 Netlify
call npx netlify-cli deploy --prod --dir=out

cd ..
echo === 前端部署完成! ===
pause 