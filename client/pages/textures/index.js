import { useState } from 'react';
import Navbar from '../../components/Navbar';
import ResourceGrid from '../../components/ResourceGrid';

export default function TextureCenter() {
  const [filter, setFilter] = useState({
    version: 'all',
    sort: 'newest'
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            材质包中心
          </h1>
          <div className="flex space-x-4">
            <select
              value={filter.version}
              onChange={(e) => setFilter(prev => ({ ...prev, version: e.target.value }))}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                       rounded-lg px-4 py-2 text-gray-700 dark:text-gray-200"
            >
              <option value="all">所有版本</option>
              <option value="1.20">1.20</option>
              <option value="1.19">1.19</option>
              <option value="1.18">1.18</option>
              <option value="1.17">1.17</option>
            </select>
            <select
              value={filter.sort}
              onChange={(e) => setFilter(prev => ({ ...prev, sort: e.target.value }))}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                       rounded-lg px-4 py-2 text-gray-700 dark:text-gray-200"
            >
              <option value="newest">最新上传</option>
              <option value="downloads">下载最多</option>
              <option value="popular">最受欢迎</option>
            </select>
          </div>
        </div>

        {/* 资源展示 */}
        <ResourceGrid type="texture" />
      </div>
    </div>
  );
} 