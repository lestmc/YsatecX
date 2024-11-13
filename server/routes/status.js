const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const os = require('os');

router.get('/', async (req, res) => {
  try {
    // 系统状态检查
    const systemStatus = {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      cpus: os.cpus().length,
      totalMemory: Math.round(os.totalmem() / (1024 * 1024 * 1024)) + 'GB',
      freeMemory: Math.round(os.freemem() / (1024 * 1024 * 1024)) + 'GB',
      uptime: Math.round(process.uptime())
    };

    // 数据库检查
    const dbCheck = await new Promise((resolve) => {
      req.db.get('SELECT 1', (err) => {
        resolve(!err);
      });
    });

    // 目录检查
    const uploadDirs = ['uploads/files', 'uploads/images', 'uploads/avatars'];
    const dirChecks = uploadDirs.map(dir => {
      const fullPath = path.join(__dirname, '..', dir);
      try {
        return fs.existsSync(fullPath) && fs.accessSync(fullPath, fs.constants.W_OK);
      } catch {
        return false;
      }
    });

    // 内存使用检查
    const memoryUsage = process.memoryUsage();
    const formatMemory = (bytes) => `${Math.round(bytes / 1024 / 1024)}MB`;

    const status = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      system: systemStatus,
      checks: {
        database: dbCheck,
        uploadDirs: dirChecks.every(check => check),
        memory: {
          heapUsed: formatMemory(memoryUsage.heapUsed),
          heapTotal: formatMemory(memoryUsage.heapTotal),
          rss: formatMemory(memoryUsage.rss)
        },
        uptime: `${Math.floor(systemStatus.uptime / 3600)}小时${Math.floor((systemStatus.uptime % 3600) / 60)}分钟`
      }
    };

    res.json(status);
  } catch (error) {
    console.error('Status check failed:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 