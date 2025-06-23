import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 401 }
      )
    }
    
    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      )
    }
    
    // 生成 JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
    
    return NextResponse.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    })
  } catch {
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}