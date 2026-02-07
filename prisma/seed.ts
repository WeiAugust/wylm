import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('开始初始化数据库...')

  // 1. 创建角色
  console.log('创建角色...')
  const superAdminRole = await prisma.role.upsert({
    where: { name: '超级管理员' },
    update: {},
    create: {
      name: '超级管理员',
      description: '拥有所有权限的超级管理员',
    },
  })

  const editorRole = await prisma.role.upsert({
    where: { name: '内容编辑者' },
    update: {},
    create: {
      name: '内容编辑者',
      description: '可以管理博客、摄影作品和产品信息',
    },
  })

  const userRole = await prisma.role.upsert({
    where: { name: '普通用户' },
    update: {},
    create: {
      name: '普通用户',
      description: '可以浏览内容、评论、点赞、赞赏',
    },
  })

  const guestRole = await prisma.role.upsert({
    where: { name: '游客' },
    update: {},
    create: {
      name: '游客',
      description: '只能浏览公开内容',
    },
  })

  console.log('角色创建完成')

  // 2. 创建权限
  console.log('创建权限...')
  const permissions = [
    // 系统管理
    { name: '系统配置', code: 'system:config', module: 'system', description: '管理系统配置' },
    { name: '用户管理', code: 'user:manage', module: 'user', description: '管理用户' },
    { name: '角色管理', code: 'role:manage', module: 'user', description: '管理角色' },
    { name: '权限管理', code: 'permission:manage', module: 'user', description: '管理权限' },

    // 博客管理
    { name: '博客查看', code: 'post:view', module: 'blog', description: '查看博客' },
    { name: '博客创建', code: 'post:create', module: 'blog', description: '创建博客' },
    { name: '博客编辑', code: 'post:edit', module: 'blog', description: '编辑博客' },
    { name: '博客删除', code: 'post:delete', module: 'blog', description: '删除博客' },
    { name: '分类管理', code: 'category:manage', module: 'blog', description: '管理分类' },
    { name: '标签管理', code: 'tag:manage', module: 'blog', description: '管理标签' },

    // 摄影作品管理
    { name: '作品查看', code: 'photo:view', module: 'gallery', description: '查看作品' },
    { name: '作品上传', code: 'photo:upload', module: 'gallery', description: '上传作品' },
    { name: '作品编辑', code: 'photo:edit', module: 'gallery', description: '编辑作品' },
    { name: '作品删除', code: 'photo:delete', module: 'gallery', description: '删除作品' },
    { name: '相册管理', code: 'album:manage', module: 'gallery', description: '管理相册' },

    // 产品管理
    { name: '产品查看', code: 'product:view', module: 'product', description: '查看产品' },
    { name: '产品创建', code: 'product:create', module: 'product', description: '创建产品' },
    { name: '产品编辑', code: 'product:edit', module: 'product', description: '编辑产品' },
    { name: '产品删除', code: 'product:delete', module: 'product', description: '删除产品' },

    // 评论管理
    { name: '评论查看', code: 'comment:view', module: 'comment', description: '查看评论' },
    { name: '评论发布', code: 'comment:create', module: 'comment', description: '发布评论' },
    { name: '评论审核', code: 'comment:audit', module: 'comment', description: '审核评论' },
    { name: '评论删除', code: 'comment:delete', module: 'comment', description: '删除评论' },

    // 互动功能
    { name: '点赞', code: 'like:create', module: 'interaction', description: '点赞' },
    { name: '收藏', code: 'favorite:create', module: 'interaction', description: '收藏' },
    { name: '赞赏', code: 'donation:create', module: 'interaction', description: '赞赏' },

    // 订单管理
    { name: '订单查看', code: 'order:view', module: 'order', description: '查看订单' },
    { name: '订单管理', code: 'order:manage', module: 'order', description: '管理订单' },
  ]

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    })
  }

  console.log('权限创建完成')

  // 3. 分配权限给角色
  console.log('分配权限给角色...')

  // 超级管理员拥有所有权限
  const allPermissions = await prisma.permission.findMany()
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    })
  }

  // 内容编辑者权限
  const editorPermissionCodes = [
    'post:view', 'post:create', 'post:edit', 'post:delete',
    'category:manage', 'tag:manage',
    'photo:view', 'photo:upload', 'photo:edit', 'photo:delete',
    'album:manage',
    'product:view', 'product:create', 'product:edit', 'product:delete',
    'comment:view', 'comment:audit', 'comment:delete',
  ]

  for (const code of editorPermissionCodes) {
    const permission = await prisma.permission.findUnique({ where: { code } })
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: editorRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: editorRole.id,
          permissionId: permission.id,
        },
      })
    }
  }

  // 普通用户权限
  const userPermissionCodes = [
    'post:view', 'photo:view', 'product:view',
    'comment:view', 'comment:create',
    'like:create', 'favorite:create', 'donation:create',
  ]

  for (const code of userPermissionCodes) {
    const permission = await prisma.permission.findUnique({ where: { code } })
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: userRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      })
    }
  }

  // 游客权限
  const guestPermissionCodes = ['post:view', 'photo:view', 'product:view']

  for (const code of guestPermissionCodes) {
    const permission = await prisma.permission.findUnique({ where: { code } })
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: guestRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: guestRole.id,
          permissionId: permission.id,
        },
      })
    }
  }

  console.log('权限分配完成')

  // 4. 创建默认管理员账号
  console.log('创建默认管理员账号...')
  const hashedPassword = await bcrypt.hash('Admin123456', 10)

  const adminUser = await prisma.user.upsert({
    where: { phone: '13800138000' },
    update: {},
    create: {
      phone: '13800138000',
      password: hashedPassword,
      nickname: '超级管理员',
      bio: '网站管理员',
      status: 'ACTIVE',
    },
  })

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: superAdminRole.id,
    },
  })

  console.log('默认管理员账号创建完成')
  console.log('账号: 13800138000')
  console.log('密码: Admin123456')

  // 5. 创建默认分类
  console.log('创建默认分类...')
  const postCategories = [
    { name: '技术', slug: 'tech', description: '技术相关文章', icon: '💻', color: '#3B82F6', type: 'POST' },
    { name: '生活', slug: 'life', description: '生活随笔', icon: '🌈', color: '#10B981', type: 'POST' },
    { name: '摄影', slug: 'photography', description: '摄影相关', icon: '📷', color: '#F59E0B', type: 'POST' },
    { name: '旅行', slug: 'travel', description: '旅行游记', icon: '✈️', color: '#8B5CF6', type: 'POST' },
  ]

  for (const cat of postCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        type: cat.type as 'POST' | 'PHOTO',
      },
    })
  }

  const photoCategories = [
    { name: '风光', slug: 'landscape', description: '风光摄影', icon: '🏔️', color: '#06B6D4', type: 'PHOTO' },
    { name: '人像', slug: 'portrait', description: '人像摄影', icon: '👤', color: '#EC4899', type: 'PHOTO' },
    { name: '街拍', slug: 'street', description: '街头摄影', icon: '🏙️', color: '#6366F1', type: 'PHOTO' },
    { name: '静物', slug: 'still-life', description: '静物摄影', icon: '🎨', color: '#F97316', type: 'PHOTO' },
  ]

  for (const cat of photoCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        type: cat.type as 'POST' | 'PHOTO',
      },
    })
  }

  console.log('默认分类创建完成')

  // 6. 创建默认标签
  console.log('创建默认标签...')
  const tags = [
    { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E' },
    { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
    { name: 'React', slug: 'react', color: '#61DAFB' },
    { name: 'Next.js', slug: 'nextjs', color: '#000000' },
    { name: 'Node.js', slug: 'nodejs', color: '#339933' },
    { name: 'PostgreSQL', slug: 'postgresql', color: '#4169E1' },
    { name: '前端开发', slug: 'frontend', color: '#FF6B6B' },
    { name: '后端开发', slug: 'backend', color: '#4ECDC4' },
    { name: '全栈开发', slug: 'fullstack', color: '#95E1D3' },
    { name: '教程', slug: 'tutorial', color: '#FFA07A' },
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    })
  }

  console.log('默认标签创建完成')

  // 7. 创建网站配置
  console.log('创建网站配置...')
  const siteConfigs = [
    { key: 'site_name', value: 'WYLM', type: 'string', group: 'basic', label: '网站名称' },
    { key: 'site_url', value: 'http://localhost:3000', type: 'string', group: 'basic', label: '网站地址' },
    { key: 'site_description', value: '个人网站', type: 'string', group: 'basic', label: '网站描述' },
    { key: 'site_keywords', value: '博客,摄影,产品', type: 'string', group: 'basic', label: '网站关键词' },
    { key: 'enable_comments', value: 'true', type: 'boolean', group: 'features', label: '启用评论' },
    { key: 'enable_donations', value: 'true', type: 'boolean', group: 'features', label: '启用赞赏' },
    { key: 'enable_registration', value: 'true', type: 'boolean', group: 'features', label: '启用注册' },
  ]

  for (const config of siteConfigs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    })
  }

  console.log('网站配置创建完成')

  console.log('数据库初始化完成！')
}

main()
  .catch((e) => {
    console.error('初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
