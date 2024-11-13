const express = require('express');
const router = express.Router();
const { generateVerificationCode, sendVerificationEmail } = require('../utils/emailService');

// 存储验证码
const verificationCodes = new Map();

// 发送验证码
router.post('/send-code', async (req, res) => {
  try {
    const { email } = req.body;

    // 验证邮箱格式
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: '无效的邮箱地址' });
    }

    // 生成验证码
    const code = generateVerificationCode();

    // 发送邮件
    const sent = await sendVerificationEmail(email, code);
    if (!sent) {
      throw new Error('发送邮件失败');
    }

    // 存储验证码
    verificationCodes.set(email, {
      code,
      timestamp: Date.now(),
      attempts: 0
    });

    // 5分钟后删除验证码
    setTimeout(() => {
      verificationCodes.delete(email);
    }, 5 * 60 * 1000);

    res.json({ message: '验证码已发送' });

  } catch (error) {
    console.error('发送验证码失败:', error);
    res.status(500).json({ error: '发送验证码失败，请稍后重试' });
  }
});

// 验证验证码
const verifyCode = (email, code) => {
  const verification = verificationCodes.get(email);
  if (!verification) {
    return { valid: false, error: '验证码不存在' };
  }

  if (verification.code !== code) {
    verification.attempts += 1;
    if (verification.attempts >= 3) {
      verificationCodes.delete(email);
      return { valid: false, error: '验证码错误次数过多，请重新获取' };
    }
    return { valid: false, error: '验证码错误' };
  }

  if (Date.now() - verification.timestamp > 5 * 60 * 1000) {
    verificationCodes.delete(email);
    return { valid: false, error: '验证码已过期' };
  }

  return { valid: true };
};

// 确保路由返回 JSON
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 确保所有响应都设置正确的 Content-Type
router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

module.exports = router; 