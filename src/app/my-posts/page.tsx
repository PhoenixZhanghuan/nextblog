'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../components/Header'

interface Post {
  id: string
  title: string
  content: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchMyPosts()
  }, [router])

  const fetchMyPosts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/posts/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('获取我的博客失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        setPosts(posts.filter(post => post.id !== id))
      }
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">我的文章</h1>
          <Link
            href="/posts/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            写新文章
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">加载中...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">您还没有发布任何文章</p>
            <Link
              href="/posts/new"
              className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
            >
              立即开始写作 →
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {posts.map((post) => (
                <li key={post.id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex-1">
                      <Link href={`/posts/${post.id}`}>
                        <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
                          {post.title}
                        </h3>
                      </Link>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          post.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.published ? '已发布' : '草稿'}
                        </span>
                        <span>创建于 {new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                        {post.updatedAt !== post.createdAt && (
                          <span>更新于 {new Date(post.updatedAt).toLocaleDateString('zh-CN')}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/posts/${post.id}/edit`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  )
}