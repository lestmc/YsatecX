import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';

export default function ResourceCard({ resource }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDownload = async () => {
    setIsLoading(true);
    try {
      // 下载逻辑
    } catch (error) {
      toast.error('下载失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-48">
          <Image
            src={resource.imageUrl}
            alt={resource.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">下载次数: {resource.downloads}</span>
            <Link 
              href={`/resources/${resource.id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              查看详情
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 