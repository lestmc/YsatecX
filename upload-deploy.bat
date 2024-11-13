@echo off
echo === YsatecX 直接上传部署 ===

cd client

:: 清理旧构建
echo 清理旧文件...
if exist .next rd /s /q .next
if exist out rd /s /q out

:: 安装依赖
echo 安装依赖...
call npm install @emotion/is-prop-valid
call npm install

:: 构建
echo 构建项目...
call npm run build

:: 创建 _redirects 文件
echo 创建 Netlify 配置...
(
echo /* /index.html 200
) > out\_redirects

:: 提示用户
echo.
echo === 构建完成! ===
echo 请按照以下步骤操作:
echo 1. 访问 https://app.netlify.com/drop
echo 2. 将 client/out 文件夹拖拽到网页中
echo 3. 等待上传完成
echo.
echo 按任意键打开 out 文件夹...
pause > nul

:: 打开 out 文件夹
start explorer out

cd .. 