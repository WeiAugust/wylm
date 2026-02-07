import { NextRequest } from 'next/server'
import { ApiResponseHelper } from '@/lib/utils/response'
import { prisma } from '@/lib/prisma/client'

/**
 * GET /api/blog/tags
 * 获取标签列表
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('keyword')

    const where: any = {}

    if (keyword) {
      where.name = {
        contains: keyword,
        mode: 'insensitive',
      }
    }

    const tags = await prisma.tag.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            posts: true,
            photos: true,
          },
        },
      },
    })

    return ApiResponseHelper.success(tags)
  } catch (error) {
    console.error('Get tags error:', error)
    return ApiResponseHelper.serverError('获取标签列表失败')
  }
}

/**
 * POST /api/blog/tags
 * 创建标签（需要权限）
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: 验证用户权限
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return ApiResponseHelper.unauthorized('请先登录')
    }

    const body = await request.json()
    const { name, slug, color } = body

    // 验证必填字段
    if (!name || !slug) {
      return ApiResponseHelper.error('缺少必填字段')
    }

    // 检查slug是否已存在
    const existingTag = await prisma.tag.findUnique({
      where: { slug },
    })

    if (existingTag) {
      return ApiResponseHelper.error('该slug已被使用')
    }

    // 创建标签
    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        color,
      },
    })

    return ApiResponseHelper.success(tag, '标签创建成功')
  } catch (error) {
    console.error('Create tag error:', error)
    return ApiResponseHelper.serverError('创建标签失败')
  }
}
