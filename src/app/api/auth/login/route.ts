import { NextRequest } from 'next/server'
import { ApiResponseHelper } from '@/lib/utils/response'
import { prisma } from '@/lib/prisma/client'
import { PasswordHelper } from '@/lib/utils/password'
import { JwtHelper } from '@/lib/auth/jwt'
import { validatePhone } from '@/lib/utils/validation'

/**
 * POST /api/auth/login
 * 用户登录（支持密码登录和验证码登录）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, password, verificationCode, loginType } = body

    // 验证必填字段
    if (!phone || !loginType) {
      return ApiResponseHelper.error('缺少必填字段')
    }

    // 验证手机号格式
    if (!validatePhone(phone)) {
      return ApiResponseHelper.error('手机号格式不正确')
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { phone },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    })

    if (!user) {
      return ApiResponseHelper.error('用户不存在')
    }

    // 检查用户状态
    if (user.status === 'BANNED') {
      return ApiResponseHelper.error('账号已被禁用')
    }

    if (user.status === 'INACTIVE') {
      return ApiResponseHelper.error('账号未激活')
    }

    // 密码登录
    if (loginType === 'password') {
      if (!password) {
        return ApiResponseHelper.error('请输入密码')
      }

      const isPasswordValid = await PasswordHelper.verify(password, user.password)
      if (!isPasswordValid) {
        return ApiResponseHelper.error('密码错误')
      }
    }
    // 验证码登录
    else if (loginType === 'code') {
      if (!verificationCode) {
        return ApiResponseHelper.error('请输入验证码')
      }

      // TODO: 验证短信验证码是否正确
      // 这里需要从Redis或数据库中验证验证码
    } else {
      return ApiResponseHelper.error('不支持的登录方式')
    }

    // 生成JWT Token
    const roles = user.roles.map((ur) => ur.role.name)
    const token = JwtHelper.sign({
      userId: user.id,
      phone: user.phone,
      roles,
    })

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user

    return ApiResponseHelper.success(
      {
        user: {
          ...userWithoutPassword,
          roles: roles,
        },
        token,
      },
      '登录成功'
    )
  } catch (error) {
    console.error('Login error:', error)
    return ApiResponseHelper.serverError('登录失败，请稍后重试')
  }
}
