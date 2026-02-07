import { NextRequest } from 'next/server'
import { ApiResponseHelper } from '@/lib/utils/response'
import { prisma } from '@/lib/prisma/client'

/**
 * GET /api/comments
 * 获取评论列表
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const targetType = searchParams.get('targetType') as 'POST' | 'PHOTO' | 'PRODUCT'
    const targetId = searchParams.get('targetId')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const skip = (page - 1) * pageSize

    if (!targetType || !targetId) {
      return ApiResponseHelper.error('缺少必填参数')
    }

    const where: any = {
      targetType,
      targetId,
      parentId: null, // 只获取顶级评论
      status: 'APPROVED',
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
              avatar: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  nickname: true,
                  avatar: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      }),
      prisma.comment.count({ where }),
    ])

    return ApiResponseHelper.success({
      data: comments,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error('Get comments error:', error)
    return ApiResponseHelper.serverError('获取评论列表失败')
  }
}

/**
 * POST /api/comments
 * 发布评论（需要登录）
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return ApiResponseHelper.unauthorized('请先登录')
    }

    const body = await request.json()
    const { content, targetType, targetId, parentId } = body

    // 验证必填字段
    if (!content || !targetType || !targetId) {
      return ApiResponseHelper.error('缺少必填字段')
    }

    // TODO: 从token中获取用户ID
    const authorId = 'temp-user-id'

    // 创建评论
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId,
        targetType,
        targetId,
        parentId,
        status: 'APPROVED', // 可以改为PENDING需要审核
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    })

    // 更新目标的评论数
    if (targetType === 'POST') {
      await prisma.post.update({
        where: { id: targetId },
        data: {
          commentCount: {
            increment: 1,
          },
        },
      })
    }

    return ApiResponseHelper.success(comment, '评论发布成功')
  } catch (error) {
    console.error('Create comment error:', error)
    return ApiResponseHelper.serverError('发布评论失败')
  }
}
