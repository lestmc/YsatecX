@echo off
echo === 修复构建问题 ===

cd client

:: 清理
echo 清理旧文件...
rd /s /q node_modules
del package-lock.json
del .next /s /q

:: 重新安装依赖
echo 重新安装依赖...
call npm install

:: 重新构建
echo 重新构建...
call npm run build

cd ..

echo === 修复完成 ===
pause 