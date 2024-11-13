/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用静态导出
  output: 'export',
  
  // 图片优化配置
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },

  // 环境变量配置
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // 构建优化
  swcMinify: true,
  compress: true,
  
  // 禁用源码映射
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig; 