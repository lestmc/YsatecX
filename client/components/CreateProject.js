import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function CreateProject() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    type: 'mod',
    description: '',
    version: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('请先登录');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
          createdAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        toast.success('项目创建成功！');
        setFormData({
          title: '',
          type: 'mod',
          description: '',
          version: ''
        });
      } else {
        throw new Error('创建失败');
      }
    } catch (error) {
      toast.error('创建失败，请重试');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">创建新项目</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            项目名称
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            项目类型
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="mod">MOD</option>
            <option value="modpack">整合包</option>
            <option value="texture">材质包</option>
            <option value="map">地图</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            项目描述
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            游戏版本
          </label>
          <input
            type="text"
            value={formData.version}
            onChange={(e) => setFormData({...formData, version: e.target.value})}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="例如: 1.19.2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md
                   hover:bg-purple-700 transition-colors duration-300"
        >
          创建项目
        </button>
      </div>
    </form>
  );
} 