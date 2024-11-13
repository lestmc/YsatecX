@echo off
echo === YsatecX Railway部署脚本 ===

:: 检查必要工具
where railway >nul 2>nul
if %errorlevel% neq 0 (
    echo 安装 Railway CLI...
    npm install -g @railway/cli
)

:: 配置文件
echo 创建 railway.json...
(
echo {
echo   "schema": "https://railway.app/railway.schema.json",
echo   "build": {
echo     "builder": "DOCKERFILE",
echo     "dockerfilePath": "Dockerfile"
echo   },
echo   "deploy": {
echo     "restartPolicyType": "ON_FAILURE",
echo     "restartPolicyMaxRetries": 10
echo   }
echo }
) > server\railway.json

:: 创建 Dockerfile
echo 创建 Dockerfile...
(
echo FROM node:16-alpine
echo.
echo WORKDIR /app
echo.
echo # 安装依赖
echo COPY package*.json ./
echo RUN npm install --production
echo.
echo # 复制源代码
echo COPY . .
echo.
echo # 创建上传目录
echo RUN mkdir -p uploads/images uploads/files uploads/avatars
echo.
echo # 设置环境变量
echo ENV NODE_ENV=production
echo.
echo # 暴露端口
echo EXPOSE 3002
echo.
echo # 启动命令
echo CMD ["npm", "start"]
) > server\Dockerfile

:: 初始化部署
cd server

:: 登录 Railway
railway login

:: 创建新项目
railway init

:: 设置环境变量
railway variables set JWT_SECRET=你的密钥
railway variables set EMAIL_USER=你的邮箱
railway variables set EMAIL_PASS=你的邮箱密码
railway variables set PORT=3002
railway variables set NODE_ENV=production

:: 部署
railway up

:: 获取部署URL
for /f "tokens=* USEBACKQ" %%F in (`railway domain`) do set DEPLOY_URL=%%F
echo 部署URL: %DEPLOY_URL%

:: 更新前端配置
cd ..\client
(
echo NEXT_PUBLIC_API_URL=%DEPLOY_URL%
) > .env.production

echo === 后端部署完成! ===
echo 请记录此API地址用于前端部署: %DEPLOY_URL%
pause 