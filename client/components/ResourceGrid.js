import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function ResourceGrid({ type = 'all' }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, [type]);

  const fetchResources = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resources${type !== 'all' ? `?type=${type}` : ''}`);
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('获取资源失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  if (resources.length === 0) {
    return <div className="text-center py-8">暂无资源</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <div key={resource.id} 
             className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg
                      hover:shadow-xl transition-shadow duration-300
                      transform hover:scale-102 hover:-translate-y-1">
          <div className="relative h-48">
            <Image
              src={resource.imageUrl}
              alt={resource.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {resource.title}
              </h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                resource.type === 'mod' ? 'bg-blue-100 text-blue-800' :
                resource.type === 'modpack' ? 'bg-green-100 text-green-800' :
                resource.type === 'texture' ? 'bg-purple-100 text-purple-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {resource.type.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {resource.description}
            </p>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span>版本: {resource.version}</span>
                <span className="mx-2">•</span>
                <span>下载: {resource.downloads}</span>
              </div>
              <Link
                href={`/resources/${resource.id}`}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg
                         hover:bg-purple-700 transition-colors"
              >
                查看详情
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 