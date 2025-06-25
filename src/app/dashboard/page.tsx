'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'

interface User {
  id: string
  email: string
  username: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }
    
    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            欢迎回来，{user.username}！
          </h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">我的博客</h3>
              <p className="text-blue-700 mb-4">管理你的所有文章</p>
              <button 
                onClick={() => router.push('/posts')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                查看文章
              </button>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">写新文章</h3>
              <p className="text-green-700 mb-4">分享你的想法和见解</p>
              <button 
                onClick={() => router.push('/posts/new')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                开始写作
              </button>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">个人资料</h3>
              <p className="text-purple-700 mb-4">更新你的个人信息</p>
              <button 
                onClick={() => router.push('/profile')}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                编辑资料
              </button>
            </div>
          </div>
          
          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">账户信息</h3>
            <p className="text-gray-600">邮箱: {user.email}</p>
            <p className="text-gray-600">用户名: {user.username}</p>
          </div>
        </div>
      </main>
    </div>
  )
}