import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const { title, content, published = false } = await request.json()
    
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId: decoded.userId
      },
      include: {
        author: {
          select: {
            username: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json(post, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            username: true
          }
        }
      },
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