const bcrypt = require('bcryptjs');

async function generateHashedPassword() {
  try {
    // 固定盐值以确保生成一致的哈希
    const salt = '$2a$10$6tP/gUQrwgVHxkwgGJHv6.';
    const password = 'admin123456';
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('\n=== Password Hash Generation ===');
    console.log('Password:', password);
    console.log('Salt:', salt);
    console.log('Generated Hash:', hashedPassword);
    console.log('===========================\n');
    return hashedPassword;
  } catch (error) {
    console.error('Error generating password:', error);
  }
}

// 直接运行生成密码
generateHashedPassword(); 