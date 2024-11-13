import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import OptimizedImage from '../../components/OptimizedImage';
import Link from 'next/link';

export default function CreatorResources() {
  const router = useRouter();
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchResources();
  }, [user]);

  const fetchResources = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/creator/resources`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      const data = await response.json();
      setResources(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('获取资源列表失败');
      setResources([]);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这个资源吗？')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/creator/resources/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          toast.success('删除成功');
          fetchResources();
        }
      } catch (error) {
        toast.error('删除失败');
      }
    }
  };

  const handlePublishStatus = async (id, action) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/creator/resources/${id}/${action}`, 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (response.ok) {
        toast.success(action === 'publish' ? '发布成功' : '下架成功');
        fetchResources();
      }
    } catch (error) {
      toast.error(action === 'publish' ? '发布失败' : '下架失败');
    }
  };

  const handleBatchAction = async (action) => {
    if (selectedItems.length === 0) {
      toast.warning('请先选择���源');
      return;
    }

    if (window.confirm(`确定要${action === 'delete' ? '删除' : action === 'publish' ? '发布' : '下架'}选中的资源吗？`)) {
      try {
        const promises = selectedItems.map(id => {
          if (action === 'delete') {
            return handleDelete(id);
          } else {
            return handlePublishStatus(id, action);
          }
        });

        await Promise.all(promises);
        setSelectedItems([]);
        fetchResources();
      } catch (error) {
        toast.error('批量操作失败');
      }
    }
  };

  const filteredResources = filter === 'all' 
    ? resources 
    : resources.filter(r => r.type === filter) || [];

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-primary">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
            我的作品
          </h1>
          <div className="flex space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white dark:bg-dark-secondary text-light-text dark:text-dark-text
                       border border-gray-300 dark:border-gray-600 rounded-md"
            >
              <option value="all">全部</option>
              <option value="mod">MOD</option>
              <option value="modpack">整合包</option>
              <option value="texture">材质包</option>
              <option value="map">地图</option>
            </select>

            <Link
              href="/creator/upload"
              className="bg-blue-500 dark:bg-purple-600 text-white px-4 py-2 rounded-md
                       hover:bg-blue-600 dark:hover:bg-purple-700 transition-colors"
            >
              上传新作品
            </Link>
          </div>
        </div>

        {/* 批量操作工具栏 */}
        {selectedItems.length > 0 && (
          <div className="bg-white dark:bg-dark-secondary rounded-lg p-4 mb-6 flex items-center justify-between">
            <span className="text-light-text dark:text-dark-text">
              已选择 {selectedItems.length} 个资源
            </span>
            <div className="flex space-x-4">
              <button
                onClick={() => handleBatchAction('publish')}
                className="text-green-500 hover:text-green-600"
              >
                批量发布
              </button>
              <button
                onClick={() => handleBatchAction('unpublish')}
                className="text-yellow-500 hover:text-yellow-600"
              >
                批量下架
              </button>
              <button
                onClick={() => handleBatchAction('delete')}
                className="text-red-500 hover:text-red-600"
              >
                批量删除
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(filteredResources) && filteredResources.map(resource => (
              <div key={resource.id} 
                   className="bg-white dark:bg-dark-secondary rounded-lg overflow-hidden shadow-lg
                            hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(resource.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, resource.id]);
                      } else {
                        setSelectedItems(selectedItems.filter(id => id !== resource.id));
                      }
                    }}
                    className="absolute top-4 left-4 z-10"
                  />
                  <div className="h-48 relative">
                    <OptimizedImage
                      src={resource.imageUrl}
                      alt={resource.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">
                      {resource.title}
                    </h3>
                    <span className={`text-sm px-2 py-1 rounded ${
                      resource.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {resource.status === 'published' ? '已发布' : '已下架'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      下载: {resource.downloads}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="space-x-2">
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        删除
                      </button>
                      <button
                        onClick={() => router.push(`/creator/resources/${resource.id}/edit`)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        编辑
                      </button>
                    </div>
                    <button
                      onClick={() => handlePublishStatus(
                        resource.id, 
                        resource.status === 'published' ? 'unpublish' : 'publish'
                      )}
                      className={`px-3 py-1 rounded ${
                        resource.status === 'published'
                          ? 'bg-yellow-500 hover:bg-yellow-600'
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white`}
                    >
                      {resource.status === 'published' ? '下架' : '发布'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(!loading && (!filteredResources || filteredResources.length === 0)) && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            还没有上传任何资源
          </div>
        )}
      </div>
    </div>
  );
} 