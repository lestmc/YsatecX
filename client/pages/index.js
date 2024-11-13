import Head from 'next/head';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Head>
        <title>YsatecX - 我的世界资源网站</title>
        <meta name="description" content="最好的我的世界资源下载网站" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        {/* 欢迎区域 */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            探索精彩的我的世界资源
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-10"
          >
            发现独特的MOD、精美的材质包和令人惊叹的地图
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center space-x-6"
          >
            <Link
              href="/mods"
              className="bg-purple-600 text-white px-8 py-4 rounded-lg
                       hover:bg-purple-700 transition-all duration-300
                       transform hover:scale-105 hover:shadow-lg"
            >
              浏览MOD
            </Link>
            <Link
              href="/creator"
              className="bg-gray-800 text-white px-8 py-4 rounded-lg
                       hover:bg-gray-900 transition-all duration-300
                       transform hover:scale-105 hover:shadow-lg"
            >
              开始创作
            </Link>
          </motion.div>
        </div>

        {/* 特性展示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center"
          >
            <div className="bg-purple-100 dark:bg-purple-900 w-20 h-20 mx-auto rounded-full 
                          flex items-center justify-center mb-6
                          transform hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              快速上手
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              简单几步即可创建和分享你的作品
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-center"
          >
            <div className="bg-purple-100 dark:bg-purple-900 w-20 h-20 mx-auto rounded-full 
                          flex items-center justify-center mb-6
                          transform hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              安全可靠
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              所有资源经过严格审核和安全检查
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="text-center"
          >
            <div className="bg-purple-100 dark:bg-purple-900 w-20 h-20 mx-auto rounded-full 
                          flex items-center justify-center mb-6
                          transform hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              活跃社区
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              与其他创作者交流分享经验
            </p>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}