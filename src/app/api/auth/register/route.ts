import { NextRequest } from 'next/server'
import { ApiResponseHelper } from '@/lib/utils/response'
import { prisma } from '@/lib/prisma/client'
import { PasswordHelper } from '@/lib/utils/password'
import { JwtHelper } from '@/lib/auth/jwt'
import { validatePhone, validateVerificationCode } from '@/lib/utils/validation'

/**
 * POST /api/auth/register
 * 用户注册
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, password, verificationCode, nickname } = body

    // 验证必填字段
    if (!phone || !password || !verificationCode) {
      return ApiResponseHelper.error('缺少必填字段')
    }

    // 验证手机号格式
    if (!validatePhone(phone)) {
      return ApiResponseHelper.error('手机号格式不正确')
    }

    // 验证验证码格式
    if (!validateVerificationCode(verificationCode)) {
      return ApiResponseHelper.error('验证码格式不正确')
    }

    // 验证密码强度
    const passwordValidation = PasswordHelper.validateStrength(password)
    if (!passwordValidation.valid) {
      return ApiResponseHelper.error(passwordValidation.message || '密码强度不足')
    }

    // TODO: 验证短信验证码是否正确
    // 这里需要从Redis或数据库中验证验证码

    // 检查手机号是否已注册
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    })

    if (existingUser) {
      return ApiResponseHelper.error('该手机号已注册')
    }

    // 加密密码
    const hashedPassword = await PasswordHelper.hash(password)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        nickname: nickname || `用户${phone.slice(-4)}`,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        phone: true,
        nickname: true,
        avatar: true,
        bio: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // 分配默认角色（普通用户）
    const defaultRole = await prisma.role.findUnique({
      where: { name: '普通用户' },
    })

    if (defaultRole) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: defaultRole.id,
        },
      })
    }

    // 生成JWT Token
    const token = JwtHelper.sign({
      userId: user.id,
      phone: user.phone,
    })

    return ApiResponseHelper.success(
      {
        user,
        token,
      },
      '注册成功'
    )
  } catch (error) {
    console.error('Register error:', error)
    return ApiResponseHelper.serverError('注册失败，请稍后重试')
  }
}
