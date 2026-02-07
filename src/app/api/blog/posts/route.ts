import { NextRequest } from 'next/server'
import { ApiResponseHelper } from '@/lib/utils/response'
import { prisma } from '@/lib/prisma/client'

/**
 * GET /api/blog/posts
 * 获取博客文章列表
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // 分页参数
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const skip = (page - 1) * pageSize

    // 筛选参数
    const categoryId = searchParams.get('categoryId')
    const tagId = searchParams.get('tagId')
    const status = searchParams.get('status') || 'PUBLISHED'
    const keyword = searchParams.get('keyword')

    // 排序参数
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // 构建查询条件
    const where: any = {
      status: status as any,
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (tagId) {
      where.tags = {
        some: {
          tagId: tagId,
        },
      }
    }

    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { content: { contains: keyword, mode: 'insensitive' } },
        { excerpt: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    // 查询文章列表
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
              avatar: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
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
      }),
      prisma.post.count({ where }),
    ])

    // 格式化响应数据
    const formattedPosts = posts.map((post) => ({
      ...post,
      tags: post.tags.map((pt) => pt.tag),
    }))

    return ApiResponseHelper.success({
      data: formattedPosts,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error('Get posts error:', error)
    return ApiResponseHelper.serverError('获取文章列表失败')
  }
}

/**
 * POST /api/blog/posts
 * 创建博客文章（需要权限）
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: 验证用户权限
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return ApiResponseHelper.unauthorized('请先登录')
    }

    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      categoryId,
      tagIds,
      status,
      publishedAt,
    } = body

    // 验证必填字段
    if (!title || !slug || !content) {
      return ApiResponseHelper.error('缺少必填字段')
    }

    // 检查slug是否已存在
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return ApiResponseHelper.error('该slug已被使用')
    }

    // TODO: 从token中获取用户ID
    const authorId = 'temp-user-id'

    // 创建文章
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        authorId,
        categoryId,
        status: status || 'DRAFT',
        publishedAt: publishedAt ? new Date(publishedAt) : null,
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

    // 关联标签
    if (tagIds && tagIds.length > 0) {
      await prisma.postTag.createMany({
        data: tagIds.map((tagId: string) => ({
          postId: post.id,
          tagId,
        })),
      })
    }

    return ApiResponseHelper.success(post, '文章创建成功')
  } catch (error) {
    console.error('Create post error:', error)
    return ApiResponseHelper.serverError('创建文章失败')
  }
}
