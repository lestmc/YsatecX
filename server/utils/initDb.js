const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// 数据库文件路径
const dbPath = path.join(__dirname, '../database.sqlite');

// 将db.run包装成Promise
const runAsync = (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

async function initializeDatabase() {
  let db = null;
  
  try {
    // 创建新的数据库连接
    db = new sqlite3.Database(dbPath);

    // 删除现有表（如果存在）
    await runAsync(db, `DROP TABLE IF EXISTS comments`);
    await runAsync(db, `DROP TABLE IF EXISTS resources`);
    await runAsync(db, `DROP TABLE IF EXISTS users`);

    // 创建用户表
    await runAsync(db, `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT,
      role TEXT DEFAULT 'user',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 创建资源表
    await runAsync(db, `CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      version TEXT NOT NULL,
      imageUrl TEXT,
      fileUrl TEXT NOT NULL,
      userId INTEGER,
      downloads INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      status TEXT DEFAULT 'published',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )`);

    // 创建评论表
    await runAsync(db, `CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      userId INTEGER,
      resourceId INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (resourceId) REFERENCES resources(id)
    )`);

    // 创建管理员账号
    const adminPassword = await bcrypt.hash('admin123456', 10);
    await runAsync(db,
      'INSERT OR IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@ysatecx.com', adminPassword, 'admin']
    );

    // 创建测试用户账号
    const testPassword = await bcrypt.hash('test123456', 10);
    await runAsync(db,
      'INSERT OR IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['test', 'test@ysatecx.com', testPassword, 'user']
    );

    console.log('数据库初始化完成');
    console.log('管理员账号：');
    console.log('用户名：admin');
    console.log('密码：admin123456');
    console.log('测试账号：');
    console.log('用户名：test');
    console.log('密码：test123456');

  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  } finally {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('关闭数据库时出错:', err);
        } else {
          console.log('数据库连接已关闭');
        }
      });
    }
  }
}

// 运行初始化
initializeDatabase().catch(console.error);