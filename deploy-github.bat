@echo off
echo === 部署到 GitHub Pages ===

cd client

:: 构建
call npm run build

:: 准备部署
cd out
echo YsatecX > .nojekyll

:: 创建并切换到gh-pages分支
git checkout --orphan gh-pages
git --work-tree=out add --all
git --work-tree=out commit -m "Deploy to GitHub Pages"

:: 推送到GitHub
set /p repo_url=请输入GitHub仓库URL: 
git remote add origin %repo_url%
git push -f origin gh-pages

cd ..