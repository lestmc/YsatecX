@echo off
echo === YsatecX免费部署脚本 ===

:: 检查Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 请先安装Git!
    pause
    exit /b 1
)

:: 初始化Git仓库
if not exist .git (
    git init
)

:: 创建.gitignore
echo 创建.gitignore...
(
echo node_modules/
echo .next/
echo out/
echo .env
echo .env.local
echo *.log
echo server/uploads/*
echo !server/uploads/.gitkeep
) > .gitignore

:: 前端配置
cd client

:: 修改package.json的homepage
echo 更新package.json...
powershell -Command "(Get-Content package.json) -replace '\"homepage\":.+,', '\"homepage\": \"https://你的用户名.github.io/YsatecX\",' | Set-Content package.json"

:: 构建前端
call npm install
call npm run build

:: 创建gh-pages分支
git checkout --orphan gh-pages
git rm -rf .
move out\* .
echo YsatecX > .nojekyll
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force

:: 返回主分支
git checkout main

cd ..

:: 后端配置
cd server

:: 创建Render配置
echo 创建render.yaml...
(
echo services:
echo   - type: web
echo     name: ysatecx-api
echo     env: node
echo     buildCommand: npm install
echo     startCommand: npm start
echo     envVars:
echo       - key: NODE_ENV
echo         value: production
echo       - key: MONGODB_URI
echo         value: 你的MongoDB连接串
) > render.yaml

:: 修改数据库配置
echo 更新数据库配置...
(
echo const mongoose = require^('mongoose'^);
echo.
echo const connectDB = async ^(^) ^=^> {
echo   try {
echo     await mongoose.connect^(process.env.MONGODB_URI^);
echo     console.log^('MongoDB connected'^);
echo   } catch ^(err^) {
echo     console.error^('MongoDB connection error:'^, err^);
echo     process.exit^(1^);
echo   }
echo };
echo.
echo module.exports = connectDB;
) > config\database.js

:: 提交所有更改
git add .
git commit -m "准备免费部署"

:: 推送到GitHub
set /p repo_url="输入GitHub仓库URL: "
git remote add origin %repo_url%
git push -u origin main

echo === 部署说明 ===
echo 1. 前端已部署到GitHub Pages
echo 2. 后端请访问 render.com 并连接此GitHub仓库
echo 3. 在Render中设置环境变量
echo 4. 在MongoDB Atlas创建免费数据库并更新连接串
pause 