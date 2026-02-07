import { NextRequest } from 'next/server'
import { ApiResponseHelper } from '@/lib/utils/response'
import { prisma } from '@/lib/prisma/client'

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * GET /api/blog/posts/:id
 * 获取文章详情
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            bio: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
              },
            },
          },
        },
      },
    })

    if (!post) {
      return ApiResponseHelper.notFound('文章不存在')
    }

    // 增加浏览量
    await prisma.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    // 格式化响应数据
    const formattedPost = {
      ...post,
      tags: post.tags.map((pt) => pt.tag),
    }

    return ApiResponseHelper.success(formattedPost)
  } catch (error) {
    console.error('Get post error:', error)
    return ApiResponseHelper.serverError('获取文章详情失败')
  }
}

/**
 * PUT /api/blog/posts/:id
 * 更新文章（需要权限）
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: 验证用户权限
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return ApiResponseHelper.unauthorized('请先登录')
    }

    const { id } = params
    const body = await request.json()

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return ApiResponseHelper.notFound('文章不存在')
    }

    // 更新文章
    const post = await prisma.post.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        coverImage: body.coverImage,
        categoryId: body.categoryId,
        status: body.status,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        category: true,
      },
    })

    // 更新标签关联
    if (body.tagIds) {
      // 删除旧的标签关联
      await prisma.postTag.deleteMany({
        where: { postId: id },
      })

      // 创建新的标签关联
      if (body.tagIds.length > 0) {
        await prisma.postTag.createMany({
          data: body.tagIds.map((tagId: string) => ({
            postId: id,
            tagId,
          })),
        })
      }
    }

    return ApiResponseHelper.success(post, '文章更新成功')
  } catch (error) {
    console.error('Update post error:', error)
    return ApiResponseHelper.serverError('更新文章失败')
  }
}

/**
 * DELETE /api/blog/posts/:id
 * 删除文章（需要权限）
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: 验证用户权限
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return ApiResponseHelper.unauthorized('请先登录')
    }

    const { id } = params

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return ApiResponseHelper.notFound('文章不存在')
    }

    // 删除文章（级联删除相关数据）
    await prisma.post.delete({
      where: { id },
    })

    return ApiResponseHelper.success(null, '文章删除成功')
  } catch (error) {
    console.error('Delete post error:', error)
    return ApiResponseHelper.serverError('删除文章失败')
  }
}
