@echo off
echo === YsatecX ֱ���ϴ����� ===

cd client

:: ����ɹ���
echo ������ļ�...
if exist .next rd /s /q .next
if exist out rd /s /q out

:: ��װ����
echo ��װ����...
call npm install @emotion/is-prop-valid
call npm install

:: ����
echo ������Ŀ...
call npm run build

:: ���� _redirects �ļ�
echo ���� Netlify ����...
(
echo /* /index.html 200
) > out\_redirects

:: ��ʾ�û�
echo.
echo === �������! ===
echo �밴�����²������:
echo 1. ���� https://app.netlify.com/drop
echo 2. �� client/out �ļ�����ק����ҳ��
echo 3. �ȴ��ϴ����
echo.
echo ��������� out �ļ���...
pause > nul

:: �� out �ļ���
start explorer out

cd .. 