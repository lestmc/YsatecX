#!/bin/bash

# 创建必要的目录
mkdir -p uploads/images
mkdir -p uploads/files
mkdir -p uploads/avatars

# 安装依赖
npm install
npm install express-rate-limit response-time --save

# 启动服务器
npm run dev 