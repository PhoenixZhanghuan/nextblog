'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Header from './components/Header'

interface User {
  id: string
  username: string
  email: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {user ? (
          // 登录用户看到的内容
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              欢迎回来，<span className="text-blue-600">{user.username}</span>！
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              准备好分享你的想法了吗？从控制台开始管理你的博客。
            </p>
            
            <div className="flex justify-center space-x-4">
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                进入控制台
              </Link>
              <Link
                href="/posts/new"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                写新文章
              </Link>
              <Link
                href="/posts"
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                浏览博客
              </Link>
            </div>
          </div>
        ) : (
          // 未登录用户看到的内容
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              欢迎来到 <span className="text-blue-600">NextBlog</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              一个现代化的博客平台，基于 Next.js 15 和 Prisma 构建。
              在这里分享你的想法，发现有趣的内容。
            </p>
            
            <div className="flex justify-center space-x-4">
              <Link
                href="/posts"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                浏览博客
              </Link>
              <Link
                href="/register"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                开始写作
              </Link>
            </div>
          </div>
        )}
        
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">轻松写作</h3>
            <p className="text-gray-600">简洁的编辑器，让你专注于内容创作</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">社区互动</h3>
            <p className="text-gray-600">与其他作者交流，分享你的见解</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">快速响应</h3>
            <p className="text-gray-600">基于 Next.js 的现代架构，极速加载</p>
          </div>
        </div>
      </main>
    </div>
  )
}