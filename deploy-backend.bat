@echo off
echo === YsatecX 后端部署脚本 ===

:: 检查 Railway CLI 是否安装
where railway >nul 2>nul
if %errorlevel% neq 0 (
    echo 安装 Railway CLI...
    npm install -g @railway/cli
)

:: 创建 .gitignore
echo 创建 .gitignore 文件...
(
echo node_modules/
echo .env
echo uploads/*
echo !uploads/.gitkeep
echo database.sqlite
) > server\.gitignore

:: 创建 Procfile
echo 创建 Procfile...
echo web: npm start > server\Procfile

:: 初始化后端部署
cd server

:: 登录 Railway
railway login

:: 创建新项目
railway init

:: 设置环境变量
railway vars set JWT_SECRET=你的密钥
railway vars set NODE_ENV=production
railway vars set PORT=3002

:: 部署
railway up

cd ..
echo === 后端部署完成! ===
pause 