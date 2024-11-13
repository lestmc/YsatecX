const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    if (file.fieldname === 'image') {
      uploadPath = path.join(__dirname, '..', 'uploads', 'images');
    } else if (file.fieldname === 'file') {
      uploadPath = path.join(__dirname, '..', 'uploads', 'files');
    }
    
    // 确保目录存在
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // 保留原始文件扩展名
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + ext);
  }
});

// 添加文件过滤器
const fileFilter = (req, file, cb) => {
  console.log('Processing file:', file.originalname); // 调试日志

  if (file.fieldname === 'image') {
    // 允许的图片类型
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('只允许上传图片文件!'), false);
    }
  } else if (file.fieldname === 'file') {
    // 允许的资源文件类型
    const allowedTypes = ['.jar', '.zip', '.mcpack', '.mcworld'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedTypes.includes(ext)) {
      return cb(new Error('不支持的文件类型!'), false);
    }
  }
  cb(null, true);
};

// 配置 multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB 限制
    fieldSize: 100 * 1024 * 1024 // 表单字段大小限制也设为 100MB
  }
});

// 获取创作者统计数据
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.userId;
    const stats = await new Promise((resolve, reject) => {
      req.db.get(
        `SELECT 
          COUNT(*) as totalResources,
          SUM(downloads) as totalDownloads,
          SUM(likes) as totalLikes
         FROM resources 
         WHERE userId = ?`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    // 获取每日下载统计
    const dailyStats = await new Promise((resolve, reject) => {
      req.db.all(
        `SELECT 
          DATE(downloadDate) as date,
          COUNT(*) as count
         FROM downloads
         WHERE resourceUserId = ?
         GROUP BY DATE(downloadDate)
         ORDER BY date DESC
         LIMIT 30`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json({
      ...stats,
      dailyDownloads: dailyStats
    });
  } catch (error) {
    res.status(500).json({ error: '获取统计数据失败' });
  }
});

// 获取创作者的资源列表
router.get('/resources', async (req, res) => {
  try {
    const userId = req.user.userId;
    const resources = await new Promise((resolve, reject) => {
      req.db.all(
        `SELECT * FROM resources WHERE userId = ? ORDER BY createdAt DESC`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: '获取资源列表失败' });
  }
});

// 上传新资源
router.post('/upload', 
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  async (req, res) => {
    console.log('Upload request received'); // 调试日志
    console.log('Files:', req.files); // 调试日志
    console.log('Body:', req.body); // 调试日志

    try {
      // 验证文件是否存在
      if (!req.files || !req.files.file || !req.files.image) {
        return res.status(400).json({ error: '请上传所有必需的文件' });
      }

      // 验证表单数据
      const { title, description, type, version, mcVersion } = req.body;
      if (!title || !description || !type || !version || !mcVersion) {
        return res.status(400).json({ error: '请填写所有必需的字段' });
      }

      const userId = req.user.userId;
      
      // 生成文件URL
      const fileUrl = `/uploads/files/${req.files.file[0].filename}`;
      const imageUrl = `/uploads/images/${req.files.image[0].filename}`;

      // 插入数据库
      const result = await new Promise((resolve, reject) => {
        req.db.run(
          `INSERT INTO resources (
            title, description, type, version, mcVersion,
            imageUrl, fileUrl, userId, downloads, likes, status, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 'published', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [title, description, type, version, mcVersion, imageUrl, fileUrl, userId],
          function(err) {
            if (err) {
              console.error('Database error:', err); // 调试日志
              reject(err);
            } else {
              resolve(this.lastID);
            }
          }
        );
      });

      console.log('Resource created with ID:', result); // 调试日志

      res.json({
        message: '上传成功',
        resourceId: result
      });
    } catch (error) {
      console.error('Upload error:', error); // 调试日志
      // 删除已上传的文件
      if (req.files) {
        Object.values(req.files).forEach(files => {
          files.forEach(file => {
            fs.unlink(file.path, (err) => {
              if (err) console.error('Error deleting file:', err);
            });
          });
        });
      }
      res.status(500).json({ error: '上传失败: ' + error.message });
    }
  }
);

// 更新资源
router.put('/resources/:id', 
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user.userId;
      const { title, description, version, mcVersion } = req.body;

      // 验证资源所有权
      const resource = await new Promise((resolve, reject) => {
        req.db.get(
          'SELECT * FROM resources WHERE id = ? AND userId = ?',
          [resourceId, userId],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (!resource) {
        return res.status(403).json({ error: '无权限修改此资源' });
      }

      // 处理文件更新
      let fileUrl = resource.fileUrl;
      let imageUrl = resource.imageUrl;

      if (req.files.file) {
        // 删除旧文件
        const oldFilePath = path.join(__dirname, '..', resource.fileUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
        fileUrl = `/uploads/files/${req.files.file[0].filename}`;
      }

      if (req.files.image) {
        // 删除旧图片
        const oldImagePath = path.join(__dirname, '..', resource.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
        imageUrl = `/uploads/images/${req.files.image[0].filename}`;
      }

      // 更新数据库
      await new Promise((resolve, reject) => {
        req.db.run(
          `UPDATE resources 
           SET title = ?, description = ?, version = ?, mcVersion = ?,
               fileUrl = ?, imageUrl = ?, updatedAt = CURRENT_TIMESTAMP
           WHERE id = ? AND userId = ?`,
          [title, description, version, mcVersion, fileUrl, imageUrl, resourceId, userId],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      res.json({ message: '更新成功' });
    } catch (error) {
      res.status(500).json({ error: '更新失败' });
    }
  }
);

// 下架资源
router.post('/resources/:id/unpublish', async (req, res) => {
  try {
    const resourceId = req.params.id;
    const userId = req.user.userId;

    const result = await new Promise((resolve, reject) => {
      req.db.run(
        'UPDATE resources SET status = "unpublished" WHERE id = ? AND userId = ?',
        [resourceId, userId],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });

    if (result === 0) {
      return res.status(403).json({ error: '无权限下架此资源' });
    }

    res.json({ message: '下架成功' });
  } catch (error) {
    res.status(500).json({ error: '下架失败' });
  }
});

// 删除资源
router.delete('/resources/:id', async (req, res) => {
  try {
    const resourceId = req.params.id;
    const userId = req.user.userId;

    // 获取资源信息
    const resource = await new Promise((resolve, reject) => {
      req.db.get(
        'SELECT * FROM resources WHERE id = ? AND userId = ?',
        [resourceId, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!resource) {
      return res.status(403).json({ error: '无权限删除此资源' });
    }

    // 删除文件
    if (resource.fileUrl) {
      const filePath = path.join(__dirname, '..', resource.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // 删除图片
    if (resource.imageUrl) {
      const imagePath = path.join(__dirname, '..', resource.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // 删除数据库记录
    await new Promise((resolve, reject) => {
      req.db.run(
        'DELETE FROM resources WHERE id = ? AND userId = ?',
        [resourceId, userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ error: '删除失败' });
  }
});

module.exports = router; 