/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/YsatecX' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/YsatecX/' : '',
};

module.exports = nextConfig; 