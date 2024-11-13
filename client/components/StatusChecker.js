import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function StatusChecker() {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        setIsConnected(true);
        toast.success(`服务器正常运行中 (延迟: ${data.responseTime}ms)`);
      } else {
        throw new Error('服务器连接失败');
      }
    } catch (error) {
      toast.error('无法连接到服务器');
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={checkStatus}
      disabled={isChecking}
      className={`fixed bottom-20 right-6 p-3 rounded-full shadow-lg
                 transition-all duration-300 ease-in-out z-50
                 ${isChecking ? 'animate-pulse' : ''}
                 ${isConnected 
                   ? 'bg-green-500 hover:bg-green-600' 
                   : 'bg-red-500 hover:bg-red-600'}`}
    >
      <div className="flex items-center space-x-2 text-white px-3">
        <div className={`w-3 h-3 rounded-full
                      ${isConnected ? 'bg-green-200' : 'bg-red-200'}`} />
        <span className="text-sm">
          {isChecking ? '检查中...' : (isConnected ? '服务器在线' : '服务器离线')}
        </span>
      </div>
    </button>
  );
} 