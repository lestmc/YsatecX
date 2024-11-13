@echo off
echo === 部署到 Netlify ===

cd client

:: 安装 Netlify CLI
call npm install netlify-cli --save-dev

:: 登录 Netlify
call npx netlify login

:: 创建新站点 (使用随机名称)
echo 创建新的 Netlify 站点...
set /p custom_name="输入站点名称 (留空将使用随机名称): "

if "%custom_name%"=="" (
    :: 使用时间戳生成唯一名称
    set timestamp=%date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%
    set site_name=ysatecx-%timestamp%
) else (
    set site_name=%custom_name%
)

call npx netlify sites:create --name %site_name%

:: 部署
call npx netlify deploy --prod --dir=out

cd .. 