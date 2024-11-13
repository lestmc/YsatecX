const fs = require('fs').promises;
const path = require('path');

async function uploadSampleResources() {
  try {
    // 读取资源数据文件
    const resourcesPath = path.join(__dirname, '../data/resources.json');
    let data = { resources: [] };

    try {
      const existingData = await fs.readFile(resourcesPath, 'utf8');
      data = JSON.parse(existingData);
    } catch (error) {
      console.log('Creating new resources file...');
    }

    // 示例资源数据
    const sampleResources = [
      {
        id: 1,
        title: "示例MOD",
        description: "这是一个示例MOD，展示MOD的功能和特性。",
        type: "mod",
        version: "1.19.2",
        imageUrl: "/uploads/images/sample-mod.jpg",
        fileUrl: "/uploads/files/sample-mod.jar",
        userId: 1, // admin用户ID
        downloads: 100,
        likes: 50,
        status: "published",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: "示例整合包",
        description: "这是一个示例整合包，包含多个精选MOD。",
        type: "modpack",
        version: "1.19.2",
        imageUrl: "/uploads/images/sample-modpack.jpg",
        fileUrl: "/uploads/files/sample-modpack.zip",
        userId: 1,
        downloads: 80,
        likes: 40,
        status: "published",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        title: "示例材质包",
        description: "这是一个示例材质包，提供高清的游戏材质。",
        type: "texture",
        version: "1.19.2",
        imageUrl: "/uploads/images/sample-texture.jpg",
        fileUrl: "/uploads/files/sample-texture.zip",
        userId: 1,
        downloads: 120,
        likes: 60,
        status: "published",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        title: "示例地图",
        description: "这是一个示例地图，包含精美的建筑和冒险内容。",
        type: "map",
        version: "1.19.2",
        imageUrl: "/uploads/images/sample-map.jpg",
        fileUrl: "/uploads/files/sample-map.zip",
        userId: 1,
        downloads: 90,
        likes: 45,
        status: "published",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // 创建示例文件
    const createSampleFile = async (filename, content = '') => {
      const filePath = path.join(__dirname, '..', filename);
      await fs.writeFile(filePath, content);
      console.log(`Created ${filename}`);
    };

    // 创建示例图片和文件
    await Promise.all([
      createSampleFile('uploads/images/sample-mod.jpg'),
      createSampleFile('uploads/images/sample-modpack.jpg'),
      createSampleFile('uploads/images/sample-texture.jpg'),
      createSampleFile('uploads/images/sample-map.jpg'),
      createSampleFile('uploads/files/sample-mod.jar'),
      createSampleFile('uploads/files/sample-modpack.zip'),
      createSampleFile('uploads/files/sample-texture.zip'),
      createSampleFile('uploads/files/sample-map.zip')
    ]);

    // 更新资源数据
    data.resources = sampleResources;
    await fs.writeFile(resourcesPath, JSON.stringify(data, null, 2));

    console.log('示例资源上传完成！');
    console.log('已创建以下资源：');
    console.log('- 示例MOD');
    console.log('- 示例整合包');
    console.log('- 示例材质包');
    console.log('- 示例地图');

  } catch (error) {
    console.error('上传示例资源失败:', error);
  }
}

// 运行脚本
uploadSampleResources(); 