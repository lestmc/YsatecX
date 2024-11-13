const validateRegistration = (req, res, next) => {
  const { username, email, password, code } = req.body;

  const errors = [];

  // 验证用户名
  if (!username) {
    errors.push('用户名不能为空');
  } else if (username.length < 3 || username.length > 20) {
    errors.push('用户名长度必须在3-20个字符之间');
  } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('用户名只能包含字母、数字、下划线和横线');
  }

  // 验证邮箱
  if (!email) {
    errors.push('邮箱不能为空');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('邮箱格式不正确');
  }

  // 验证密码
  if (!password) {
    errors.push('密码不能为空');
  } else if (password.length < 6) {
    errors.push('密码长度不能少于6个字符');
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.push('密码必须包含大小写字母和数字');
  }

  // 验证验证码
  if (!code) {
    errors.push('验证码不能为空');
  } else if (!/^\d{6}$/.test(code)) {
    errors.push('验证码必须是6位数字');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = validateRegistration; 