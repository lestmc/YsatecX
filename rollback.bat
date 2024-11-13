@echo off
echo === 回滚部署 ===

:: 回滚 Git 提交
git reset --hard HEAD~1
git push -f origin master

:: 回滚 Netlify 部署
cd client
netlify deploy --prod --restore

echo === 回滚完成 ===
pause 