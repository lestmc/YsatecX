import '../styles/globals.scss';
import '../styles/creator.scss';
import '../styles/transitions.scss';
import { AuthProvider } from '../contexts/AuthContext';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import StatusChecker from '../components/StatusChecker';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 动态导入组件
const ThemeToggle = dynamic(() => import('../components/ThemeToggle'), {
  ssr: false
});

const Changelog = dynamic(() => import('../components/Changelog'), {
  ssr: false
});

// 动态导入 motion 组件
const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => {
    const { motion } = mod;
    return motion.div;
  }),
  { ssr: false }
);

// 页面切换动画配置
const pageVariants = {
  initial: {
    opacity: 0,
    x: -200
  },
  animate: {
    opacity: 1,
    x: 0
  },
  exit: {
    opacity: 0,
    x: 200
  }
};

function MyApp({ Component, pageProps, router }) {
  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
      </Head>
      <div className="min-h-screen bg-light-background dark:bg-dark-primary 
                    text-light-text dark:text-dark-text
                    transition-colors duration-300">
        <div className="page-transition">
          <Component {...pageProps} key={router.route} />
        </div>
        <StatusChecker />
        <ThemeToggle />
        <Changelog />
        <ToastContainer />
      </div>
    </AuthProvider>
  );
}

export default MyApp; 