import { NextRequest } from 'next/server'
import { ApiResponseHelper } from '@/lib/utils/response'
import { prisma } from '@/lib/prisma/client'

/**
 * GET /api/products
 * 获取产品列表
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'PUBLISHED'

    const products = await prisma.product.findMany({
      where: {
        status: status as any,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        plans: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    })

    return ApiResponseHelper.success(products)
  } catch (error) {
    console.error('Get products error:', error)
    return ApiResponseHelper.serverError('获取产品列表失败')
  }
}

/**
 * POST /api/products
 * 创建产品（需要权限）
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
      name,
      slug,
      description,
      features,
      coverImage,
      demoVideo,
      demoImages,
      useCases,
      techStack,
    } = body

    // 验证必填字段
    if (!name || !slug || !description || !features) {
      return ApiResponseHelper.error('缺少必填字段')
    }

    // 检查slug是否已存在
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return ApiResponseHelper.error('该slug已被使用')
    }

    // 创建产品
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        features,
        coverImage,
        demoVideo,
        demoImages: demoImages || [],
        useCases,
        techStack,
        status: 'PUBLISHED',
      },
    })

    return ApiResponseHelper.success(product, '产品创建成功')
  } catch (error) {
    console.error('Create product error:', error)
    return ApiResponseHelper.serverError('创建产品失败')
  }
}
