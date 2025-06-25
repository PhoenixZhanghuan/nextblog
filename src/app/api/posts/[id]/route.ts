import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 获取单个博客
export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    })
    
    if (!post) {
      return NextResponse.json(
        { error: '博客不存在' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(post)
  } catch {
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

// 更新博客
export async function PUT(
  request: NextRequest,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const { title, content, published } = await request.json()
    
    // 检查博客是否存在且属于当前用户
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id }
    })
    
    if (!existingPost) {
      return NextResponse.json(
        { error: '博客不存在' },
        { status: 404 }
      )
    }
    
    if (existingPost.authorId !== decoded.userId) {
      return NextResponse.json(
        { error: '无权限编辑此博客' },
        { status: 403 }
      )
    }
    
    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        content,
        published
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
    
    return NextResponse.json(updatedPost)
  } catch {
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

// 删除博客
export async function DELETE(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    
    // 检查博客是否存在且属于当前用户
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id }
    })
    
    if (!existingPost) {
      return NextResponse.json(
        { error: '博客不存在' },
        { status: 404 }
      )
    }
    
    if (existingPost.authorId !== decoded.userId) {
      return NextResponse.json(
        { error: '无权限删除此博客' },
        { status: 403 }
      )
    }
    
    await prisma.post.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ message: '博客删除成功' })
  } catch {
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}