@echo off
echo === YsatecX GitHub Pages部署脚本 ===

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
echo # 依赖
echo node_modules/
echo .next/
echo out/
echo 
echo # 环境文件
echo .env
echo .env.local
echo .env.development
echo .env.production
echo 
echo # 系统文件
echo .DS_Store
echo Thumbs.db
echo 
echo # 日志
echo *.log
echo npm-debug.log*
echo 
echo # 上传文件
echo server/uploads/*
echo !server/uploads/.gitkeep
echo 
echo # IDE
echo .vscode/
echo .idea/
) > .gitignore

:: 前端配置
cd client

:: 创建或更新package.json的homepage
echo 更新package.json配置...
set /p github_username=请输入你的GitHub用户名: 
powershell -Command "(Get-Content package.json) -replace '\"homepage\":.+,', '\"homepage\": \"https://%github_username%.github.io/YsatecX\",' | Set-Content package.json"

:: 安装依赖
echo 安装依赖...
call npm install

:: 构建
echo 构建项目...
call npm run build

:: 准备部署
echo 准备GitHub Pages部署...
cd out
echo YsatecX > .nojekyll
cd ..

:: 创建并切换到gh-pages分支
git checkout --orphan gh-pages
git --work-tree=out add --all
git --work-tree=out commit -m "Deploy to GitHub Pages"

:: 推送到GitHub
echo 推送到GitHub Pages...
set /p repo_url=请输入GitHub仓库URL (例如 https://github.com/username/YsatecX.git): 
git remote add origin %repo_url%
git push -f origin gh-pages

:: 返回主分支
git checkout -b main
git branch -D gh-pages

echo === 部署完成! ===
echo 请访问 https://%github_username%.github.io/YsatecX 查看部署结果
echo 注意：可能需要几分钟才能生效
pause 