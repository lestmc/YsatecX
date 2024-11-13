@echo off
echo Starting YsatecX Server...

:: 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed!
    pause
    exit /b 1
)

:: 检查必要的目录
if not exist "uploads" mkdir "uploads"
if not exist "uploads\files" mkdir "uploads\files"
if not exist "uploads\images" mkdir "uploads\images"
if not exist "uploads\avatars" mkdir "uploads\avatars"

:: 检查数据库文件
if not exist "database.sqlite" (
    echo Initializing database...
    node utils/initDb.js
)

:: 设置环境变量
set NODE_ENV=development
set PORT=3002
set NODE_OPTIONS=--max-old-space-size=100

:: 启动服务器
echo Starting server on port %PORT%...
nodemon --watch "*.js" index.js

if %errorlevel% neq 0 (
    echo Error: Server failed to start!
    pause
    exit /b 1
)