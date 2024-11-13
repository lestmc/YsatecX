import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import dynamic from 'next/dynamic';

// 动态导入图表组件以避免 SSR 问题
const LineChart = dynamic(
  () => import('react-chartjs-2').then(mod => mod.Line),
  { ssr: false }
);

// 导入 Chart.js 相关组件
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    downloads: [],
    likes: [],
    comments: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/creator/stats/daily`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  const chartData = {
    labels: stats.downloads.map(d => d.date),
    datasets: [
      {
        label: '下载量',
        data: stats.downloads.map(d => d.count),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#333' : '#ddd'
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
        }
      },
      x: {
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#333' : '#ddd'
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-primary">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-8">
          数据概览
        </h1>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-dark-secondary rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              今日下载
            </h3>
            <p className="mt-2 text-3xl font-semibold text-light-text dark:text-dark-text">
              {stats.downloads[stats.downloads.length - 1]?.count || 0}
            </p>
          </div>
          {/* 添加更多统计卡片 */}
        </div>

        {/* 图表 */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
            下载趋势
          </h2>
          <div className="h-80">
            {typeof window !== 'undefined' && <LineChart data={chartData} options={chartOptions} />}
          </div>
        </div>

        {/* 热门资源 */}
        <div className="mt-8 bg-white dark:bg-dark-secondary rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
            热门资源
          </h2>
          {/* 添加热门资源列表 */}
        </div>
      </div>
    </div>
  );
} 