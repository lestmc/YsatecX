import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function Upload() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'mod', // 默认类型
    file: null,
    image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('type', formData.type);
    data.append('file', formData.file);
    data.append('image', formData.image);

    try {
      const response = await fetch('http://localhost:3001/api/resources/upload', {
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('资源上传成功！');
        window.location.href = '/';
      } else {
        alert('上传失败，请重试');
      }
    } catch (error) {
      console.error('上传错误:', error);
      alert('上传出错，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">上传资源</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              资源标题
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              资源描述
            </label>
            <textarea
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              资源类型
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 
                         bg-white dark:bg-[#2d2d2d] 
                         text-gray-900 dark:text-white
                         focus:border-purple-500 focus:ring-purple-500
                         dark:border-gray-600"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="mod" className="dark:bg-[#2d2d2d] dark:text-white">模组</option>
              <option value="texture" className="dark:bg-[#2d2d2d] dark:text-white">材质包</option>
              <option value="map" className="dark:bg-[#2d2d2d] dark:text-white">地图</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              资源文件
            </label>
            <input
              type="file"
              required
              className="mt-1 block w-full"
              onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              预览图片
            </label>
            <input
              type="file"
              required
              accept="image/*"
              className="mt-1 block w-full"
              onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            上传资源
          </button>
        </form>
      </div>
    </div>
  );
} 