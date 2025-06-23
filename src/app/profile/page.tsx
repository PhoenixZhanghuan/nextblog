'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../components/Header'

interface User {
  id: string
  username: string
  email: string
  createdAt: string
}

interface Post {
  id: string
  title: string
  content: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    fetchUserPosts()
  }, [])

  const fetchUserPosts = async () => {
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
      } else {
        setError('获取文章失败')
      }
    } catch {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId))
      } else {
        alert('删除失败')
      }
    } catch {
      alert('网络错误')
    }
  }

  const publishedPosts = posts.filter(post => post.published)
  const draftPosts = posts.filter(post => !post.published)
  const displayPosts = activeTab === 'published' ? publishedPosts : draftPosts

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">加载中...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                加入时间：{new Date(user.createdAt).toLocaleDateString('zh-CN')}
              </p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
              <div className="text-sm text-gray-600">总文章数</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{publishedPosts.length}</div>
              <div className="text-sm text-gray-600">已发布</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{draftPosts.length}</div>
              <div className="text-sm text-gray-600">草稿</div>
            </div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">快捷操作</h2>
          <div className="flex space-x-4">
            <Link
              href="/posts/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              写新文章
            </Link>
            <Link
              href="/my-posts"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              管理文章
            </Link>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('published')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'published'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                已发布 ({publishedPosts.length})
              </button>
              <button
                onClick={() => setActiveTab('drafts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'drafts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                草稿 ({draftPosts.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {error && (
              <div className="text-red-600 mb-4">{error}</div>
            )}

            {displayPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {activeTab === 'published' ? '还没有发布的文章' : '还没有草稿'}
              </div>
            ) : (
              <div className="space-y-4">
                {displayPosts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          <Link href={`/posts/${post.id}`} className="hover:text-blue-600">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {post.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>创建：{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                          <span>更新：{new Date(post.updatedAt).toLocaleDateString('zh-CN')}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            post.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.published ? '已发布' : '草稿'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Link
                          href={`/posts/${post.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          编辑
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}