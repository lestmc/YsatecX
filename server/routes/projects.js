const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// 读取项目数据
const getProjectsData = async () => {
  const filePath = path.join(__dirname, '../data/projects.json');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { projects: [] };
  }
};

// 保存项目数据
const saveProjectsData = async (data) => {
  const filePath = path.join(__dirname, '../data/projects.json');
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// 创建项目
router.post('/create', async (req, res) => {
  try {
    const projectData = req.body;
    const data = await getProjectsData();
    
    const newProject = {
      id: data.projects.length + 1,
      ...projectData,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.projects.push(newProject);
    await saveProjectsData(data);

    res.json(newProject);
  } catch (error) {
    console.error('创建项目失败:', error);
    res.status(500).json({ error: '创建项目失败' });
  }
});

// 获取用户的项目列表
router.get('/user/:userId', async (req, res) => {
  try {
    const data = await getProjectsData();
    const userProjects = data.projects.filter(
      project => project.userId === parseInt(req.params.userId)
    );
    res.json(userProjects);
  } catch (error) {
    console.error('获取项目列表失败:', error);
    res.status(500).json({ error: '获取项目列表失败' });
  }
});

module.exports = router; 