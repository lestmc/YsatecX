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
echo.
echo [build.environment]
echo   NEXT_PUBLIC_API_URL = "你的后端API地址"
) > netlify.toml

:: 进入客户端目录
cd client

:: 清理旧的安装
echo 清理旧的安装...
rd /s /q node_modules\.bin 2>nul
rd /s /q node_modules\netlify-cli 2>nul

:: 全局安装 Netlify CLI
echo 全局安装 Netlify CLI...
call npm install -g netlify-cli

:: 等待几秒确保安装完成
timeout /t 5

:: 检查 Netlify CLI 是否安装成功
netlify --version
if %errorlevel% neq 0 (
    echo [错误] Netlify CLI 安装失败!
    cd ..
    pause
    exit /b 1
)

:: 登录 Netlify（使用浏览器）
echo 请在浏览器中登录 Netlify...
netlify login

:: 链接到 Netlify
echo 链接项目到 Netlify...
netlify link

:: 部署
echo 部署到 Netlify...
netlify deploy --prod --dir=out

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