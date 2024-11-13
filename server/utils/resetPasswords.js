const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

async function resetPasswords() {
  try {
    const filePath = path.join(__dirname, '../config/accounts.json');
    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
    
    // 重置所有用户密码为 'admin123456'
    const hashedPassword = await bcrypt.hash('admin123456', 10);
    
    data.users = data.users.map(user => ({
      ...user,
      password: hashedPassword
    }));

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log('Passwords reset successfully');
  } catch (error) {
    console.error('Failed to reset passwords:', error);
  }
}

// 如果直接运行此文件则执行重置
if (require.main === module) {
  resetPasswords();
}

module.exports = resetPasswords; 