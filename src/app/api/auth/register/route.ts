import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json()
    
    // 检查用户是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: '用户已存在' },
        { status: 400 }
      )
    }
    
    // 密码哈希
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
      { message: '注册成功', userId: user.id },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}