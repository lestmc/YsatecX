'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Image from 'next/image';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const { user, logout } = useAuth();
  const [initialMode, setInitialMode] = useState('login');

  // 处理滚动
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 向下滚动超过100px时隐藏
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out
                ${!isVisible ? '-translate-y-full' : 'translate-y-0'}
                bg-[#0f172a] dark:bg-[#0f172a] border-b border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 
                     bg-clip-text text-transparent hover:from-purple-400 hover:to-pink-400
                     transition-all duration-300"
          >
            YsatecX
          </Link>

          {/* 主导航 */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/mods" 
              className="text-gray-300 hover:text-white hover:bg-gray-800 
                       px-3 py-2 rounded-md text-sm transition-colors duration-200"
            >
              MOD中心
            </Link>
            <Link 
              href="/modpacks"
              className="text-gray-300 hover:text-white hover:bg-gray-800 
                       px-3 py-2 rounded-md text-sm transition-colors duration-200"
            >
              整合包中心
            </Link>
            <Link 
              href="/textures"
              className="text-gray-300 hover:text-white hover:bg-gray-800 
                       px-3 py-2 rounded-md text-sm transition-colors duration-200"
            >
              材质包
            </Link>
            <Link 
              href="/maps"
              className="text-gray-300 hover:text-white hover:bg-gray-800 
                       px-3 py-2 rounded-md text-sm transition-colors duration-200"
            >
              地图
            </Link>
          </div>

          {/* 用户区域 */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/creator"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg 
                           hover:bg-purple-700 transition-colors duration-200"
                >
                  创作者中心
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white
                             focus:outline-none transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt="avatar"
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-white">{user.username[0].toUpperCase()}</span>
                      )}
                    </div>
                    <span>{user.username}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1a1f2e] rounded-lg shadow-lg py-1
                                  ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white
                                 transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        个人资料
                      </Link>
                      <Link
                        href="/creator"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white
                                 transition-colors duration-200"
                        onClick={() => setShowUserMenu(false)}
                      >
                        创作者中心
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 
                                 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                      >
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-gray-300 hover:text-white hover:bg-gray-800 
                           px-3 py-2 rounded-md text-sm transition-colors duration-200"
                >
                  登录
                </button>
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setInitialMode('register');
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg 
                           hover:bg-purple-700 transition-colors duration-200"
                >
                  注册
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setInitialMode('login');
        }}
        initialMode={initialMode}
      />
    </nav>
  );
} 