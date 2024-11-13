@echo off
echo === 从GitHub部署到Netlify ===

:: 检查Git状态
echo 检查Git状态...
git status
if %errorlevel% neq 0 (
    echo [错误] 不是Git仓库或Git未安装!
    pause
    exit /b 1
)

:: 确保所有更改都已提交
set /p continue="确保所有更改已提交。是否继续? (Y/N): "
if /i not "%continue%"=="Y" exit /b

:: 创建 netlify.toml
echo 创建 netlify.toml 配置文件...
(
echo [build]
echo   base = "client"
echo   command = "npm run build"
echo   publish = "out"
echo   ignore = "git diff --quiet HEAD^ HEAD ./client/"
echo.
echo [build.environment]
echo   NEXT_PUBLIC_API_URL = "你的后端API地址"
echo.
echo [[plugins]]
echo   package = "@netlify/plugin-nextjs"
) > netlify.toml

:: 安装 Netlify CLI
cd client
echo 安装 Netlify CLI...
call npm install netlify-cli --save-dev

:: 登录 Netlify
echo 登录 Netlify...
call npx netlify login

:: 初始化 Netlify 配置
echo 初始化 Netlify 配置...
call npx netlify init

:: 设置自动部署
echo 设置自动部署...
call npx netlify build --context production
call npx netlify deploy --prod

cd ..

:: 提交 netlify.toml
git add netlify.toml
git commit -m "Add Netlify configuration"
git push

echo === 部署完成! ===
echo 1. 访问 Netlify 仪表板检查部署状态
echo 2. 每次推送到 GitHub 将自动触发部署
echo 3. 可以在 Netlify 仪表板设置自定义域名
pause 