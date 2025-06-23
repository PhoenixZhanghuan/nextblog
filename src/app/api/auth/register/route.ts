import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json()
    
    // 基本验证
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: '所有字段都是必填的' },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码至少需要6个字符' },
        { status: 400 }
      )
    }
    
    // 检查用户是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? '邮箱已被使用' : '用户名已被使用' },
        { status: 400 }
      )
    }
    
    // 密码哈希 (使用12轮加密，安全性更高)
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword
      }
    })
    
    return NextResponse.json(
      { 
        message: '注册成功', 
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}