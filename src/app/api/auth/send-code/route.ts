import { NextRequest } from 'next/server'
import { ApiResponseHelper } from '@/lib/utils/response'

/**
 * POST /api/auth/send-code
 * 发送短信验证码
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, type } = body

    // 验证必填字段
    if (!phone || !type) {
      return ApiResponseHelper.error('缺少必填字段')
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      return ApiResponseHelper.error('手机号格式不正确')
    }

    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // TODO: 实现短信发送逻辑
    // 1. 调用阿里云短信服务发送验证码
    // 2. 将验证码存储到Redis，设置5分钟过期时间
    // 3. 实现发送频率限制（同一手机号1分钟内只能发送一次）

    console.log(`发送验证码到 ${phone}: ${code}`)

    // 开发环境下直接返回验证码（生产环境应该删除）
    if (process.env.NODE_ENV === 'development') {
      return ApiResponseHelper.success(
        { code }, // 生产环境不应该返回验证码
        '验证码发送成功'
      )
    }

    return ApiResponseHelper.success(null, '验证码发送成功')
  } catch (error) {
    console.error('Send code error:', error)
    return ApiResponseHelper.serverError('验证码发送失败，请稍后重试')
  }
}
