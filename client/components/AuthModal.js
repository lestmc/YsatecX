import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    verificationCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handleSendCode = async (email) => {
    if (!email) {
      toast.error('请输入邮箱地址');
      return;
    }

    setIsSendingCode(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("服务器返回格式错误");
      }

      const data = await response.json();
      if (response.ok) {
        toast.success('验证码已发送到您的邮箱');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Send code error:', error);
      toast.error(error.message || '发送验证码失败，请稍后重试');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("服务器返回格式错误");
      }

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast.success(isLogin ? '登录成功' : '注册成功');
        onClose();
        window.location.reload();
      } else {
        throw new Error(data.error || '操作失败');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || '服务器连接失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black bg-opacity-50"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -50 }}
            className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-xl 
                      mt-[100px] mx-auto relative"
          >
            {/* 标题栏 */}
            <div className="relative h-16 bg-gradient-to-r from-purple-600 to-blue-500">
              <div className="absolute inset-0 bg-black opacity-20"></div>
              <div className="relative flex items-center justify-between h-full px-6">
                <h2 className="text-2xl font-bold text-white">
                  {isLogin ? '欢迎回来' : '创建账号'}
                </h2>
                <button 
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 表单区域 */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    用户名
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 
                             border border-gray-300 dark:border-gray-600
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent
                             text-gray-900 dark:text-white"
                    required
                  />
                </div>

                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        邮箱
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 
                                 border border-gray-300 dark:border-gray-600
                                 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        验证码
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={formData.verificationCode}
                          onChange={(e) => setFormData({...formData, verificationCode: e.target.value})}
                          className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 
                                   border border-gray-300 dark:border-gray-600
                                   focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                   text-gray-900 dark:text-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => handleSendCode(formData.email)}
                          disabled={isSendingCode}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg
                                   hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
                                   transition-colors duration-200"
                        >
                          {isSendingCode ? '发送中...' : '获取验证码'}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    密码
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 
                             border border-gray-300 dark:border-gray-600
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent
                             text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500
                           text-white rounded-lg font-medium
                           hover:from-purple-700 hover:to-blue-600
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200"
                >
                  {isLoading ? '处理中...' : (isLogin ? '登录' : '注册')}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-gray-600 dark:text-gray-400
                             hover:text-purple-600 dark:hover:text-purple-400
                             transition-colors duration-200"
                  >
                    {isLogin ? '没有账号？立即注册' : '已有账号？立即登录'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 