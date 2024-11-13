const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// 读取资源数据
const getResourcesData = async () => {
  const filePath = path.join(__dirname, '../data/resources.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // 如果文件不存在，返回空数据结构
    return { resources: [] };
  }
};

// 保存资源数据
const saveResourcesData = async (data) => {
  const filePath = path.join(__dirname, '../data/resources.json');
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// 获取资源列表
router.get('/', async (req, res) => {
  try {
    const { type, version, sort = 'newest' } = req.query;
    const data = await getResourcesData();
    
    let filteredResources = data.resources;

    // 应用过滤
    if (type && type !== 'all') {
      filteredResources = filteredResources.filter(r => r.type === type);
    }

    if (version && version !== 'all') {
      filteredResources = filteredResources.filter(r => r.version === version);
    }

    // 应用排序
    filteredResources.sort((a, b) => {
      if (sort === 'downloads') return b.downloads - a.downloads;
      if (sort === 'popular') return b.likes - a.likes;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json(filteredResources);
  } catch (error) {
    console.error('获取资源列表失败:', error);
    res.status(500).json({ error: '获取资源列表失败' });
  }
});

// 获取热门资源
router.get('/popular', async (req, res) => {
  try {
    const data = await getResourcesData();
    const resources = data.resources;

    // 获取下载量最多的资源
    const mostDownloaded = [...resources]
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 3);

    // 获取评分最高的资源
    const topRated = [...resources]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3);

    // 获取最新上传的资源
    const newest = [...resources]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    res.json({
      mostDownloaded,
      topRated,
      newest
    });
  } catch (error) {
    console.error('获取热门资源失败:', error);
    res.status(500).json({ error: '获取热门资源失败' });
  }
});

// 获取资源详情
router.get('/:id', async (req, res) => {
  try {
    const data = await getResourcesData();
    const resource = data.resources.find(r => r.id === parseInt(req.params.id));

    if (!resource) {
      return res.status(404).json({ error: '资源不存在' });
    }

    res.json(resource);
  } catch (error) {
    console.error('获取资源详情失败:', error);
    res.status(500).json({ error: '获取资源详情失败' });
  }
});

// 添加新资源
router.post('/', async (req, res) => {
  try {
    const data = await getResourcesData();
    const newResource = {
      id: data.resources.length + 1,
      ...req.body,
      downloads: 0,
      likes: 0,
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.resources.push(newResource);
    await saveResourcesData(data);

    res.json(newResource);
  } catch (error) {
    console.error('添加资源失败:', error);
    res.status(500).json({ error: '添加资源失败' });
  }
});

// 更新资源
router.put('/:id', async (req, res) => {
  try {
    const data = await getResourcesData();
    const index = data.resources.findIndex(r => r.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: '资源不存在' });
    }

    data.resources[index] = {
      ...data.resources[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await saveResourcesData(data);
    res.json(data.resources[index]);
  } catch (error) {
    console.error('更新资源失败:', error);
    res.status(500).json({ error: '更新资源失败' });
  }
});

// 删除资源
router.delete('/:id', async (req, res) => {
  try {
    const data = await getResourcesData();
    const index = data.resources.findIndex(r => r.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: '资源不存在' });
    }

    data.resources.splice(index, 1);
    await saveResourcesData(data);

    res.json({ message: '资源已删除' });
  } catch (error) {
    console.error('删除资源失败:', error);
    res.status(500).json({ error: '删除资源失败' });
  }
});

module.exports = router; 