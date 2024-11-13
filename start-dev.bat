@echo off
echo Starting development servers...

:: 设置环境变量
set NODE_OPTIONS=--max-old-space-size=8192
set UV_THREADPOOL_SIZE=8

:: 启动前端服务
start cmd /k "cd client && npm run dev"

:: 启动后端服务
start cmd /k "cd server && npm run dev"

echo Frontend running on http://localhost:3000
echo Backend running on http://localhost:3002 