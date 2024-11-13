import { useState, useEffect } from 'react';

const changelogData = [
  {
    version: "1.0.0",
    date: "2024-03-20",
    changes: [
      "🎉 网站正式上线",
      "✨ 支持MOD、整合包、材质包上传下载",
      "🔐 用户系统完成",
      "🌙 深色模式支持"
    ]
  },
  {
    version: "1.0.1",
    date: "2024-03-21",
    changes: [
      "🔧 修复了登录问题",
      "📱 优化移动端显示",
      "🚀 提升加载速度",
      "💬 添加评论功能"
    ]
  },
  // 可以继续添加更多更新记录
];

export default function Changelog() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewUpdate, setHasNewUpdate] = useState(true);

  useEffect(() => {
    // 检查本地存储的最后查看版本
    const lastViewedVersion = localStorage.getItem('lastViewedVersion');
    const latestVersion = changelogData[0].version;
    
    if (lastViewedVersion !== latestVersion) {
      setHasNewUpdate(true);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setHasNewUpdate(false);
    // 保存最新版本到本地存储
    localStorage.setItem('lastViewedVersion', changelogData[0].version);
  };

  return (
    <>
      {/* 更新日志按钮 */}
      <button
        onClick={handleOpen}
        className="fixed bottom-36 right-6 p-3 rounded-full shadow-lg
                 bg-purple-600 hover:bg-purple-700
                 transition-all duration-300 ease-in-out z-50
                 group"
      >
        <div className="flex items-center space-x-2 text-white px-3">
          <span className="text-sm">更新日志</span>
          {hasNewUpdate && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 
                         rounded-full animate-pulse"></span>
          )}
        </div>
      </button>

      {/* 更新日志模态框 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 
                      flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full
                        max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 
                          border-b dark:border-gray-700
                          flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white">更新日志</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 
                         dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {changelogData.map((log, index) => (
                <div key={log.version} 
                     className={`pb-6 ${
                       index !== changelogData.length - 1 ? 'border-b dark:border-gray-700' : ''
                     }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold dark:text-white">
                      v{log.version}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {log.date}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {log.changes.map((change, i) => (
                      <li key={i} 
                          className="text-gray-600 dark:text-gray-300
                                   flex items-start">
                        <span className="mr-2">{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 