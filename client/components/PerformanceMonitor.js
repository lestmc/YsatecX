import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // 监控页面加载性能
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // 记录关键性能指标
          console.log(`${entry.name}: ${entry.startTime}ms`);
        });
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    }

    // 监控资源加载
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource');
      const slowResources = resources.filter(r => r.duration > 1000);
      if (slowResources.length > 0) {
        console.warn('Slow resources:', slowResources);
      }
    });
  }, []);

  return null;
} 