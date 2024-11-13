const nodemailer = require('nodemailer');
require('dotenv').config();

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  service: 'QQ', // 使用QQ邮箱服务
  auth: {
    user: process.env.EMAIL_USER, // 你的QQ邮箱
    pass: process.env.EMAIL_PASS  // 你的邮箱授权码
  }
});

// 生成验证码
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 发送验证码邮件
const sendVerificationEmail = async (to, code) => {
  const mailOptions = {
    from: `"YsatecX" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'YsatecX - 邮箱验证码',
    html: `
      <div style="padding: 20px; background-color: #f5f5f5;">
        <h2 style="color: #333;">YsatecX 邮箱验证</h2>
        <p>您的验证码是：</p>
        <div style="
          background-color: #fff;
          padding: 10px 20px;
          margin: 20px 0;
          border-radius: 5px;
          font-size: 24px;
          font-weight: bold;
          color: #6366f1;
          text-align: center;
          letter-spacing: 5px;
        ">${code}</div>
        <p>验证码有效期为5分钟。</p>
        <p style="color: #666; margin-top: 20px;">如果这不是您的操作，请忽略此邮件。</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #888; font-size: 12px;">此邮件由系统自动发送，请勿回复。</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('发送邮件失败:', error);
    return false;
  }
};

module.exports = {
  generateVerificationCode,
  sendVerificationEmail
}; 