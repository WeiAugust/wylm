import { NextRequest } from 'next/server'
import { ApiResponseHelper } from '@/lib/utils/response'
import { prisma } from '@/lib/prisma/client'

/**
 * POST /api/likes
 * 点赞/取消点赞
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return ApiResponseHelper.unauthorized('请先登录')
    }

    const body = await request.json()
    const { targetType, targetId } = body

    // 验证必填字段
    if (!targetType || !targetId) {
      return ApiResponseHelper.error('缺少必填字段')
    }

    // TODO: 从token中获取用户ID
    const userId = 'temp-user-id'

    // 检查是否已点赞
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType,
          targetId,
        },
      },
    })

    if (existingLike) {
      // 取消点赞
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })

      // 更新点赞数
      if (targetType === 'POST') {
        await prisma.post.update({
          where: { id: targetId },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        })
      } else if (targetType === 'PHOTO') {
        await prisma.photo.update({
          where: { id: targetId },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        })
      }

      return ApiResponseHelper.success({ liked: false }, '取消点赞成功')
    } else {
      // 点赞
      await prisma.like.create({
        data: {
          userId,
          targetType,
          targetId,
        },
      })

      // 更新点赞数
      if (targetType === 'POST') {
        await prisma.post.update({
          where: { id: targetId },
          data: {
            likeCount: {
              increment: 1,
            },
          },
        })
      } else if (targetType === 'PHOTO') {
        await prisma.photo.update({
          where: { id: targetId },
          data: {
            likeCount: {
              increment: 1,
            },
          },
        })
      }

      return ApiResponseHelper.success({ liked: true }, '点赞成功')
    }
  } catch (error) {
    console.error('Like error:', error)
    return ApiResponseHelper.serverError('操作失败')
  }
}

/**
 * GET /api/likes/check
 * 检查是否已点赞
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return ApiResponseHelper.success({ liked: false })
    }

    const { searchParams } = new URL(request.url)
    const targetType = searchParams.get('targetType')
    const targetId = searchParams.get('targetId')

    if (!targetType || !targetId) {
      return ApiResponseHelper.error('缺少必填参数')
    }

    // TODO: 从token中获取用户ID
    const userId = 'temp-user-id'

    const like = await prisma.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: targetType as any,
          targetId,
        },
      },
    })

    return ApiResponseHelper.success({ liked: !!like })
  } catch (error) {
    console.error('Check like error:', error)
    return ApiResponseHelper.serverError('检查失败')
  }
}
