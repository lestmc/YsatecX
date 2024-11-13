import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function UploadForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'mod',
    version: '',
    image: null,
    file: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Starting upload...');

    if (!user) {
      toast.error('请先登录');
      return;
    }

    if (!formData.image || !formData.file) {
      toast.error('请选择要上传的文件');
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      console.log('Preparing form data...');
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          data.append(key, formData[key]);
          console.log(`Appending ${key}:`, formData[key]);
        }
      });

      const token = localStorage.getItem('token');
      console.log('Token:', token);

      console.log('Sending request...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/resource`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      console.log('Response status:', response.status);

      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok) {
        toast.success('上传成功');
        setFormData({
          title: '',
          description: '',
          type: 'mod',
          version: '',
          image: null,
          file: null
        });
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = '');
      } else {
        throw new Error(result.error || '上传失败');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || '上传失败，请重试');
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      console.log(`Selected ${type} file:`, file);
      setFormData(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          标题
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                   focus:border-purple-500 focus:ring-purple-500
                   dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          描述
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                   focus:border-purple-500 focus:ring-purple-500
                   dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows="4"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          类型
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                   focus:border-purple-500 focus:ring-purple-500
                   dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="mod">MOD</option>
          <option value="modpack">整合包</option>
          <option value="texture">材质包</option>
          <option value="map">地图</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          版本
        </label>
        <input
          type="text"
          required
          value={formData.version}
          onChange={(e) => setFormData({...formData, version: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                   focus:border-purple-500 focus:ring-purple-500
                   dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="例如: 1.19.2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          预览图片
        </label>
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => handleFileChange(e, 'image')}
          className="mt-1 block w-full text-gray-700 dark:text-gray-300
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-purple-50 file:text-purple-700
                   hover:file:bg-purple-100
                   dark:file:bg-purple-900 dark:file:text-purple-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          资源文件
        </label>
        <input
          type="file"
          accept=".zip,.jar"
          required
          onChange={(e) => handleFileChange(e, 'file')}
          className="mt-1 block w-full text-gray-700 dark:text-gray-300
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-purple-50 file:text-purple-700
                   hover:file:bg-purple-100
                   dark:file:bg-purple-900 dark:file:text-purple-200"
        />
      </div>

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <button
        type="submit"
        disabled={isUploading}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md
                 hover:bg-purple-700 focus:outline-none focus:ring-2
                 focus:ring-purple-500 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors duration-300"
      >
        {isUploading ? '上传中...' : '上传资源'}
      </button>
    </form>
  );
} 