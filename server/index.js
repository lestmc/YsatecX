const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('./utils/emailService');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();
const net = require('net');
const authRoutes = require('./routes/auth');
const rateLimit = require('express-rate-limit');
const responseTime = require('response-time');
const userRoutes = require('./routes/users');
const creatorRoutes = require('./routes/creator');
const statusRoutes = require('./routes/status');
const uploadRoutes = require('./routes/upload');
const resourceRoutes = require('./routes/resources');
const projectRoutes = require('./routes/projects');

const app = express();

// 增加请求体大小限制
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// 配置 CORS
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 添加预检请求处理
app.options('*', cors());

// 数据库连接
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

// 中间件
app.use(express.json());

// 添加数据库中间件
app.use((req, res, next) => {
  req.db = db;
  next();
});

// 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '未登录' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '令牌无效' });
    }
    req.user = user;
    next();
  });
};

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/creator', authenticateToken, creatorRoutes);
app.use('/api/status', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, statusRoutes);
app.use('/api/upload', authenticateToken, uploadRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/projects', authenticateToken, projectRoutes);

// 添加 OPTIONS 请求处理
app.options('/api/status', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'YsatecX API Server' });
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    responseTime: res.responseTime
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : '服务器错误',
    timestamp: new Date().toISOString()
  });
});

// 添加全局错误捕获
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// 添加响应时间中间件
app.use(responseTime((req, res, time) => {
  res.responseTime = time;
}));

// 启动服务器
async function startServer() {
  try {
    // 检查数据库连接
    await new Promise((resolve, reject) => {
      db.get('SELECT 1', (err) => {
        if (err) reject(new Error('数据库连接失败'));
        else resolve();
      });
    });

    // 检查上传目录
    const uploadDirs = ['uploads/files', 'uploads/images', 'uploads/avatars'];
    for (const dir of uploadDirs) {
      const fullPath = path.join(__dirname, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }

    // 在 startServer 函数中添加
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // 启动服务器
    const port = process.env.PORT || 3002;
    app.listen(port, '0.0.0.0', () => {
      console.log(`
========================================
  YsatecX Server
  - Status: Running
  - Port: ${port}
  - Mode: ${process.env.NODE_ENV || 'development'}
  - Database: Connected
  - Upload directories: Ready
  - Memory limit: 100MB
========================================
      `);
    });

    // 定期状态报告
    setInterval(() => {
      const status = {
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        }
      };
      console.log('[STATUS]', status);
    }, 60000);

  } catch (error) {
    console.error('[STARTUP] Failed:', error);
    process.exit(1);
  }
}

// 启动服务器
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = app;