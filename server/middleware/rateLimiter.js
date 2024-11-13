const rateLimit = require('express-rate-limit');

// 创建验证码请求限制器
const verificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 5, // 每个IP最多5次请求
  message: {
    error: '发送验证码过于频繁，请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 创建注册请求限制器
const registrationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24小时
  max: 3, // 每个IP最多3次注册
  message: {
    error: '注册次数超限，请24小时后再试'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  verificationLimiter,
  registrationLimiter
}; 