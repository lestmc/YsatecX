const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// 配置文件存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    
    // 根据文件类型选择存储目录
    switch (file.fieldname) {
      case 'image':
        uploadPath += 'images/';
        break;
      case 'file':
        uploadPath += 'files/';
        break;
      case 'avatar':
        uploadPath += 'avatars/';
        break;
      default:
        uploadPath += 'files/';
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 允许的文件类型
  const allowedTypes = {
    'image': ['image/jpeg', 'image/png', 'image/gif'],
    'file': ['application/zip', 'application/x-zip-compressed'],
    'avatar': ['image/jpeg', 'image/png']
  };

  if (allowedTypes[file.fieldname]?.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB 限制
  }
});

// 上传资源
router.post('/resource', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files || !req.files.image || !req.files.file) {
      return res.status(400).json({ error: '请上传所有必需的文件' });
    }

    const { title, description, type, version } = req.body;
    const imageFile = req.files.image[0];
    const resourceFile = req.files.file[0];

    // 保存资源信息到数据库
    const resourceData = {
      title,
      description,
      type,
      version,
      imageUrl: `/uploads/images/${imageFile.filename}`,
      fileUrl: `/uploads/files/${resourceFile.filename}`,
      userId: req.user.userId,
      createdAt: new Date().toISOString()
    };

    // 读取现有资源数据
    const resourcesPath = path.join(__dirname, '../data/resources.json');
    let resources = [];
    try {
      const data = await fs.readFile(resourcesPath, 'utf8');
      resources = JSON.parse(data);
    } catch (error) {
      // 如果文件不存在，使用空数组
    }

    // 添加新资源
    resources.push({
      id: resources.length + 1,
      ...resourceData
    });

    // 保存更新后的数据
    await fs.writeFile(resourcesPath, JSON.stringify(resources, null, 2));

    res.json({
      message: '资源上传成功',
      resource: resourceData
    });
  } catch (error) {
    console.error('上传失败:', error);
    res.status(500).json({ error: '上传失败' });
  }
});

// 上传头像
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传头像文件' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // 更新用户头像
    const usersPath = path.join(__dirname, '../config/accounts.json');
    const data = JSON.parse(await fs.readFile(usersPath, 'utf8'));
    
    const userIndex = data.users.findIndex(u => u.id === req.user.userId);
    if (userIndex !== -1) {
      // 删除旧头像
      if (data.users[userIndex].avatar) {
        const oldAvatarPath = path.join(__dirname, '..', data.users[userIndex].avatar);
        try {
          await fs.unlink(oldAvatarPath);
        } catch (error) {
          console.error('删除旧头像失败:', error);
        }
      }

      data.users[userIndex].avatar = avatarUrl;
      await fs.writeFile(usersPath, JSON.stringify(data, null, 2));
    }

    res.json({
      message: '头像上传成功',
      avatarUrl
    });
  } catch (error) {
    console.error('上传头像失败:', error);
    res.status(500).json({ error: '上传头像失败' });
  }
});

module.exports = router; 