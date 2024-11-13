import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function PopularResources() {
  const [resources, setResources] = useState({
    mostDownloaded: [],
    topRated: [],
    newest: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resources/popular`);
      if (!response.ok) {
        throw new Error('获取资源失败');
      }
      const data = await response.json();
      setResources({
        mostDownloaded: data.mostDownloaded || [],
        topRated: data.topRated || [],
        newest: data.newest || []
      });
    } catch (error) {
      console.error('获取热门资源失败:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const ResourceCard = ({ resource }) => (
    <Link href={`/resources/${resource.id}`}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg
                   hover:shadow-xl transition-all duration-300
                   transform hover:scale-102 hover:-translate-y-1">
      <div className="relative h-32">
        <Image
          src={resource.imageUrl || '/images/placeholder.jpg'}
          alt={resource.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 truncate">
          {resource.title}
        </h3>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>下载: {resource.downloads || 0}</span>
          <span>评分: {resource.rating || 0}/5</span>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(j => (
                <div key={j} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        加载失败: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 下载最多 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下载最多
        </h2>
        <div className="space-y-3">
          {resources.mostDownloaded?.length > 0 ? (
            resources.mostDownloaded.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              暂无数据
            </div>
          )}
        </div>
      </div>

      {/* 评分最高 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          评分最高
        </h2>
        <div className="space-y-3">
          {resources.topRated?.length > 0 ? (
            resources.topRated.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              暂无数据
            </div>
          )}
        </div>
      </div>

      {/* 最新上传 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          最新上传
        </h2>
        <div className="space-y-3">
          {resources.newest?.length > 0 ? (
            resources.newest.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              暂无数据
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 