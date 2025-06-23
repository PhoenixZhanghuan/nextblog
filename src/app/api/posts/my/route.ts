import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    
    const posts = await prisma.post.findMany({
      where: { authorId: decoded.userId },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}