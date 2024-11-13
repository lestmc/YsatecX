@echo off
echo 正在停止所有 Node.js 进程...
taskkill /F /IM node.exe /T

echo 等待进程完全关闭...
timeout /t 2 /nobreak

echo 删除数据库文件...
del /F database.sqlite 2>nul

echo 删除上传的文件...
rd /S /Q uploads\images 2>nul
rd /S /Q uploads\files 2>nul
rd /S /Q uploads\avatars 2>nul

echo 创建上传目录...
mkdir uploads\images 2>nul
mkdir uploads\files 2>nul
mkdir uploads\avatars 2>nul

echo 初始化新数据库...
node utils/initDb.js

echo 完成！
echo 管理员账号：admin
echo 密码：admin123456
echo 测试账号：test
echo 密码：test123456

pause 