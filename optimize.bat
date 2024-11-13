@echo off
echo 正在优化项目...

:: 清理并重新安装依赖
cd client
rmdir /s /q node_modules
del package-lock.json
npm install --production

:: 构建优化版本
npm run build

:: 优化服务端
cd ..\server
rmdir /s /q node_modules
del package-lock.json
npm install --production

:: 压缩上传的图片
echo 正在压缩图片...
npm install -g imagemin-cli
imagemin server/uploads/images/* --out-dir=server/uploads/images

:: 设置性能相关的环境变量
echo 设置环境变量...
setx NODE_ENV "production"
setx NODE_OPTIONS "--max-old-space-size=4096"

echo 优化完成!
pause 