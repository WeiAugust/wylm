import { NextRequest } from 'next/server'
import { ApiResponseHelper } from '@/lib/utils/response'
import { prisma } from '@/lib/prisma/client'

/**
 * GET /api/gallery/photos
 * 获取摄影作品列表
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // 分页参数
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const skip = (page - 1) * pageSize

    // 筛选参数
    const categoryId = searchParams.get('categoryId')
    const tagId = searchParams.get('tagId')
    const albumId = searchParams.get('albumId')
    const status = searchParams.get('status') || 'PUBLISHED'

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

    if (albumId) {
      where.albums = {
        some: {
          albumId: albumId,
        },
      }
    }

    // 查询作品列表
    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
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
      prisma.photo.count({ where }),
    ])

    // 格式化响应数据
    const formattedPhotos = photos.map((photo) => ({
      ...photo,
      tags: photo.tags.map((pt) => pt.tag),
      exif: {
        camera: photo.camera,
        lens: photo.lens,
        aperture: photo.aperture,
        shutter: photo.shutter,
        iso: photo.iso,
        focalLength: photo.focalLength,
      },
    }))

    return ApiResponseHelper.success({
      data: formattedPhotos,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error('Get photos error:', error)
    return ApiResponseHelper.serverError('获取作品列表失败')
  }
}

/**
 * POST /api/gallery/photos
 * 上传摄影作品（需要权限）
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
      description,
      imageUrl,
      thumbnailUrl,
      width,
      height,
      categoryId,
      tagIds,
      location,
      takenAt,
      exif,
      allowDownload,
    } = body

    // 验证必填字段
    if (!title || !imageUrl) {
      return ApiResponseHelper.error('缺少必填字段')
    }

    // TODO: 从token中获取用户ID
    const authorId = 'temp-user-id'

    // 创建作品
    const photo = await prisma.photo.create({
      data: {
        title,
        description,
        imageUrl,
        thumbnailUrl,
        width,
        height,
        authorId,
        categoryId,
        location,
        takenAt: takenAt ? new Date(takenAt) : null,
        camera: exif?.camera,
        lens: exif?.lens,
        aperture: exif?.aperture,
        shutter: exif?.shutter,
        iso: exif?.iso,
        focalLength: exif?.focalLength,
        allowDownload: allowDownload || false,
        status: 'PUBLISHED',
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
      await prisma.photoTag.createMany({
        data: tagIds.map((tagId: string) => ({
          photoId: photo.id,
          tagId,
        })),
      })
    }

    return ApiResponseHelper.success(photo, '作品上传成功')
  } catch (error) {
    console.error('Create photo error:', error)
    return ApiResponseHelper.serverError('上传作品失败')
  }
}
