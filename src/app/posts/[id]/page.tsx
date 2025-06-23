'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../../components/Header'

interface Post {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    username: string
  }
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{id: string; username: string} | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
    
    if (params.id) {
      fetchPost(params.id as string)
    }
  }, [params.id])

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        router.push('/posts')
      }
    } catch (error) {
      console.error('获取博客详情失败:', error)
      router.push('/posts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('确定要删除这篇文章吗？')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        router.push('/posts')
      }
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">加载中...</div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-12">
          <p className="text-gray-600">文章不存在</p>
        </div>
      </div>
    )
  }

  const isAuthor = currentUser && currentUser.id === post.author.id

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <Link href="/posts" className="text-blue-600 hover:text-blue-800">
              ← 返回博客列表
            </Link>
          </div>
          
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>作者：{post.author.username}</span>
                <span>发布时间：{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                {post.updatedAt !== post.createdAt && (
                  <span>更新时间：{new Date(post.updatedAt).toLocaleDateString('zh-CN')}</span>
                )}
              </div>
              
              {isAuthor && (
                <div className="flex space-x-2">
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                  >
                    编辑
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
                  >
                    删除
                  </button>
                </div>
              )}
            </div>
          </header>
          
          <article className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {post.content}
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}