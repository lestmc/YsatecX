const express = require('express');
const router = express.Router();

// 获取用户统计信息
router.get('/stats', async (req, res) => {
  const userId = req.user.userId;

  try {
    const stats = {
      mods: 0,
      modpacks: 0,
      textures: 0,
      maps: 0,
      totalDownloads: 0
    };

    // 获取MOD统计
    const modsStats = await new Promise((resolve, reject) => {
      req.db.get(
        'SELECT COUNT(*) as count, SUM(downloads) as downloads FROM mods WHERE userId = ?',
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    stats.mods = modsStats.count || 0;
    stats.totalDownloads += modsStats.downloads || 0;

    // 获取整合包统计
    const modpacksStats = await new Promise((resolve, reject) => {
      req.db.get(
        'SELECT COUNT(*) as count, SUM(downloads) as downloads FROM modpacks WHERE userId = ?',
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    stats.modpacks = modpacksStats.count || 0;
    stats.totalDownloads += modpacksStats.downloads || 0;

    // 获取材质包统计
    const texturesStats = await new Promise((resolve, reject) => {
      req.db.get(
        'SELECT COUNT(*) as count, SUM(downloads) as downloads FROM resources WHERE userId = ? AND type = "texture"',
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    stats.textures = texturesStats.count || 0;
    stats.totalDownloads += texturesStats.downloads || 0;

    // 获取地图统计
    const mapsStats = await new Promise((resolve, reject) => {
      req.db.get(
        'SELECT COUNT(*) as count, SUM(downloads) as downloads FROM resources WHERE userId = ? AND type = "map"',
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    stats.maps = mapsStats.count || 0;
    stats.totalDownloads += mapsStats.downloads || 0;

    res.json(stats);
  } catch (error) {
    console.error('获取统计信息失败:', error);
    res.status(500).json({ error: '获取统计信息失败' });
  }
});

module.exports = router; 