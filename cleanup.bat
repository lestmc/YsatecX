@echo off
echo 正在清理项目...

:: 删除不需要的样式文件
del /f /q client\styles\creator.scss
del /f /q client\styles\globals.scss
del /f /q client\styles\theme.scss

:: 删除测试文件和临时文件
del /f /s /q *.test.js
del /f /s /q *.spec.js
del /f /s /q .DS_Store
del /f /s /q Thumbs.db

:: 删除构建缓存
rd /s /q client\.next
rd /s /q client\node_modules\.cache
rd /s /q server\node_modules\.cache

:: 删除日志文件
del /f /s /q *.log

:: 删除上传的测试文件
del /f /s /q server\uploads\test\*

echo 清理完成!
pause 