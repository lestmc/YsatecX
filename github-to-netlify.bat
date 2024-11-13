@echo off
echo === ��GitHub����Netlify ===

:: ���Git״̬
echo ���Git״̬...
git status
if %errorlevel% neq 0 (
    echo [����] ����Git�ֿ��Gitδ��װ!
    pause
    exit /b 1
)

:: ȷ�����и��Ķ����ύ
set /p continue="ȷ�����и������ύ���Ƿ����? (Y/N): "
if /i not "%continue%"=="Y" exit /b

:: ���� netlify.toml
echo ���� netlify.toml �����ļ�...
(
echo [build]
echo   base = "client"
echo   command = "npm run build"
echo   publish = "out"
echo.
echo [build.environment]
echo   NEXT_PUBLIC_API_URL = "��ĺ��API��ַ"
) > netlify.toml

:: ����ͻ���Ŀ¼
cd client

:: ����ɵİ�װ
echo ����ɵİ�װ...
rd /s /q node_modules\.bin 2>nul
rd /s /q node_modules\netlify-cli 2>nul

:: ȫ�ְ�װ Netlify CLI
echo ȫ�ְ�װ Netlify CLI...
call npm install -g netlify-cli

:: �ȴ�����ȷ����װ���
timeout /t 5

:: ��� Netlify CLI �Ƿ�װ�ɹ�
netlify --version
if %errorlevel% neq 0 (
    echo [����] Netlify CLI ��װʧ��!
    cd ..
    pause
    exit /b 1
)

:: ��¼ Netlify��ʹ���������
echo ����������е�¼ Netlify...
netlify login

:: ���ӵ� Netlify
echo ������Ŀ�� Netlify...
netlify link

:: ����
echo ���� Netlify...
netlify deploy --prod --dir=out

cd ..

:: �ύ netlify.toml
git add netlify.toml
git commit -m "Add Netlify configuration"
git push

echo === �������! ===
echo 1. ���� Netlify �Ǳ���鲿��״̬
echo 2. ÿ�����͵� GitHub ���Զ���������
echo 3. ������ Netlify �Ǳ�������Զ�������
pause 