import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Navbar from '../../components/Navbar';

export default function ResourceDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [resource, setResource] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (id) {
      // 获取资源详情
      fetch(`http://localhost:3001/api/resources/${id}`)
        .then(res => res.json())
        .then(data => setResource(data))
        .catch(err => console.error('获取资源详情失败:', err));

      // 获取评论列表
      fetch(`http://localhost:3001/api/resources/${id}/comments`)
        .then(res => res.json())
        .then(data => setComments(data))
        .catch(err => console.error('获取评论失败:', err));
    }
  }, [id]);

  const handleDownload = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/resources/${id}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        window.location.href = resource.downloadUrl;
      } else {
        alert('请先登录');
      }
    } catch (error) {
      console.error('下载错误:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/resources/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newComment })
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([...comments, comment]);
        setNewComment('');
      } else {
        alert('请先登录');
      }
    } catch (error) {
      console.error('评论错误:', error);
    }
  };

  if (!resource) {
    return <div>加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="relative h-96">
            <Image
              src={resource.imageUrl}
              alt={resource.title}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{resource.title}</h1>
            <p className="text-gray-600 mb-4">{resource.description}</p>
            
            <div className="flex items-center justify-between mb-8">
              <div className="text-sm text-gray-500">
                下载次数: {resource.downloads}
              </div>
              <button
                onClick={handleDownload}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                下载资源
              </button>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">评论</h2>
              
              <form onSubmit={handleComment} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2"
                  placeholder="写下你的评论..."
                  rows="3"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  发表评论
                </button>
              </form>

              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold">{comment.username}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 