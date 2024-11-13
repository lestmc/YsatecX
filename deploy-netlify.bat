@echo off
echo === 部署到 Netlify ===

cd client

:: 安装 Netlify CLI
call npm install netlify-cli --save-dev

:: 登录 Netlify
call npx netlify login

:: 创建新站点
call npx netlify sites:create --name ysatecx

:: 部署
call npx netlify deploy --prod --dir=out

cd .. 