'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import ResourceCard from '../../components/ResourceCard';
import useSWR from 'swr';
import useDebounce from '../../hooks/useDebounce';

const filters = {
  type: ['all', 'mod', 'texture', 'map'],
  version: ['1.20', '1.19', '1.18', '1.17', '1.16'],
  sort: ['newest', 'popular', 'downloads']
};

export default function ResourceCenter() {
  const router = useRouter();
  const { locale, query } = router;
  const [activeFilters, setActiveFilters] = useState({
    type: 'all',
    version: [],
    sort: 'newest'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // 将所有的 http://localhost:3001 改为新的端口
  const API_URL = 'http://localhost:3002'; // 或者使用环境变量

  const fetcher = url => fetch(url).then(r => r.json());
  const { data, error } = useSWR(`${API_URL}/api/resources`, fetcher);

  const handleFilterChange = (type, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const translations = {
    title: {
      en: 'Resource Center',
      zh: '资源中心'
    },
    filters: {
      en: {
        type: 'Type',
        version: 'Version',
        sort: 'Sort by'
      },
      zh: {
        type: '类型',
        version: '版本',
        sort: '排序'
      }
    }
  };

  const filteredResources = data?.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResources?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 添加防抖搜索
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  useEffect(() => {
    if(debouncedSearch) {
      // 执行搜索
    }
  }, [debouncedSearch]);

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <h1 className="text-3xl font-bold mb-8">
          {translations.title[locale || 'en']}
        </h1>

        {/* Filters */}
        <div className="bg-dark-secondary p-4 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {translations.filters[locale || 'en'].type}
              </label>
              <select
                value={activeFilters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full bg-dark-primary text-white rounded p-2"
              >
                {filters.type.map(type => (
                  <option key={type} value={type}>
                    {type.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Version Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {translations.filters[locale || 'en'].version}
              </label>
              <div className="flex flex-wrap gap-2">
                {filters.version.map(version => (
                  <button
                    key={version}
                    onClick={() => {
                      const newVersions = activeFilters.version.includes(version)
                        ? activeFilters.version.filter(v => v !== version)
                        : [...activeFilters.version, version];
                      handleFilterChange('version', newVersions);
                    }}
                    className={`px-3 py-1 rounded ${
                      activeFilters.version.includes(version)
                        ? 'bg-purple-600'
                        : 'bg-dark-primary'
                    }`}
                  >
                    {version}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {translations.filters[locale || 'en'].sort}
              </label>
              <select
                value={activeFilters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full bg-dark-primary text-white rounded p-2"
              >
                {filters.sort.map(sort => (
                  <option key={sort} value={sort}>
                    {sort.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="搜索资源..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems?.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </div>
  );
} 