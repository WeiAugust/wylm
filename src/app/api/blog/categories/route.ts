import { NextRequest } from 'next/server'
import { ApiResponseHelper } from '@/lib/utils/response'
import { prisma } from '@/lib/prisma/client'

/**
 * GET /api/blog/categories
 * 获取分类列表
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'POST'

    const categories = await prisma.category.findMany({
      where: {
        type: type as any,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        _count: {
          select: {
            posts: type === 'POST',
            photos: type === 'PHOTO',
          },
        },
      },
    })

    return ApiResponseHelper.success(categories)
  } catch (error) {
    console.error('Get categories error:', error)
    return ApiResponseHelper.serverError('获取分类列表失败')
  }
}

/**
 * POST /api/blog/categories
 * 创建分类（需要权限）
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: 验证用户权限
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return ApiResponseHelper.unauthorized('请先登录')
    }

    const body = await request.json()
    const { name, slug, description, icon, color, type } = body

    // 验证必填字段
    if (!name || !slug || !type) {
      return ApiResponseHelper.error('缺少必填字段')
    }

    // 检查slug是否已存在
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    })

    if (existingCategory) {
      return ApiResponseHelper.error('该slug已被使用')
    }

    // 创建分类
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
        color,
        type,
      },
    })

    return ApiResponseHelper.success(category, '分类创建成功')
  } catch (error) {
    console.error('Create category error:', error)
    return ApiResponseHelper.serverError('创建分类失败')
  }
}
