@echo off
echo 正在删除所有资源...

:: 删除资源数据文件
del /F /Q data\resources.json 2>nul
echo 已删除资源数据文件

:: 删除上传的文件
echo 正在删除上传的文件...
del /F /S /Q uploads\images\* 2>nul
del /F /S /Q uploads\files\* 2>nul
echo 已删除上传的文件

:: 重新创建空的资源数据文件
echo 创建新的资源数据文件...
echo { "resources": [] } > data\resources.json
echo 已创建空的资源数据文件

echo.
echo 资源删除完成！
echo 你可以运行 upload-samples.bat 重新添加示例资源

pause 