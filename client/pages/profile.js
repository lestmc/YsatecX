import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    mods: 0,
    modpacks: 0,
    textures: 0,
    maps: 0,
    totalDownloads: 0
  });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    // 获取用户上传统计
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setStats(data);
    })
    .catch(err => console.error('获取统计信息失败:', err));

    // 设置表单初始数据
    setFormData(prev => ({
      ...prev,
      username: user.username,
      email: user.email
    }));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (response.ok) {
        setIsEditing(false);
        alert('个人资料更新成功！');
      } else {
        alert('更新失败，请重试');
      }
    } catch (error) {
      console.error('更新错误:', error);
      alert('更新出错，请稍后重试');
    }
  };

  if (!user) {
    return <div>加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto mt-20 p-6">
        <div className="bg-[#2d2d2d] rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">个人资料</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 左侧：用户信息 */}
            <div>
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt="avatar"
                          width={80}
                          height={80}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-2xl">{user.username[0].toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{user.username}</h2>
                      <p className="text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    编辑资料
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">头像</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({...formData, avatar: e.target.files[0]})}
                      className="mt-1 block w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">用户名</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">邮箱</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">当前密码</label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">新密码</label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">确认新密码</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      保存更改
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      取消
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* 右侧：上传统计 */}
            <div className="bg-[#363636] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">上传统计</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2d2d2d] p-4 rounded-lg">
                  <h3 className="text-gray-400">MOD</h3>
                  <p className="text-2xl font-bold">{stats.mods}</p>
                </div>
                <div className="bg-[#2d2d2d] p-4 rounded-lg">
                  <h3 className="text-gray-400">整合包</h3>
                  <p className="text-2xl font-bold">{stats.modpacks}</p>
                </div>
                <div className="bg-[#2d2d2d] p-4 rounded-lg">
                  <h3 className="text-gray-400">材质包</h3>
                  <p className="text-2xl font-bold">{stats.textures}</p>
                </div>
                <div className="bg-[#2d2d2d] p-4 rounded-lg">
                  <h3 className="text-gray-400">地图</h3>
                  <p className="text-2xl font-bold">{stats.maps}</p>
                </div>
                <div className="bg-[#2d2d2d] p-4 rounded-lg col-span-2">
                  <h3 className="text-gray-400">总下载量</h3>
                  <p className="text-2xl font-bold">{stats.totalDownloads}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 