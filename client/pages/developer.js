import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

export default function DeveloperCenter() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadType, setUploadType] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    version: '',
    mcVersion: '',
    type: 'mod',
    file: null,
    image: null
  });

  const tabs = [
    { id: 'overview', name: '概览' },
    { id: 'resources', name: '我的资源' },
    { id: 'upload', name: '上传资源' },
    { id: 'analytics', name: '数据分析' },
  ];

  const resourceTypes = [
    { id: 'mod', name: 'MOD', icon: '🧩', description: '上传一个Minecraft模组' },
    { id: 'modpack', name: '整合包', icon: '📦', description: '上传一个Minecraft整合包' },
    { id: 'texture', name: '材质包', icon: '🎨', description: '上传一个材质包' },
    { id: 'map', name: '地图', icon: '🗺️', description: '上传一个地图' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... 处理上传逻辑
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-primary">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
            开发者中心
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-light-text dark:text-dark-text">
              {user?.username}
            </span>
            {/* 可以添加开发者徽章等 */}
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="border-b border-light-border dark:border-dark-secondary">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm
                          ${activeTab === tab.id
                            ? 'border-light-primary dark:border-purple-600 text-light-primary dark:text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                          }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* 内容区域 */}
        <div className="py-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 统计卡片 */}
              <div className="bg-white dark:bg-dark-secondary rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  总下载量
                </h3>
                <p className="mt-2 text-3xl font-semibold text-light-text dark:text-dark-text">
                  1,234
                </p>
              </div>
              {/* 添加更多统计卡片 */}
            </div>
          )}

          {activeTab === 'upload' && (
            <div>
              {!uploadType ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {resourceTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setUploadType(type.id)}
                      className="bg-white dark:bg-dark-secondary rounded-lg p-6 text-left
                               hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="text-4xl mb-4">{type.icon}</div>
                      <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                        {type.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {type.description}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                  {/* 表单内容 */}
                  <button
                    type="button"
                    onClick={() => setUploadType(null)}
                    className="text-light-primary dark:text-purple-600 mb-4"
                  >
                    ← 返回选择
                  </button>
                  
                  {/* 添加表单字段 */}
                </form>
              )}
            </div>
          )}

          {activeTab === 'resources' && (
            <div>
              {/* 资源列表 */}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              {/* 数据分析图表 */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 