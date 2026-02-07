'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    nickname: '',
  })

  const handleSendCode = async () => {
    if (!formData.phone) {
      setError('请输入手机号')
      return
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(formData.phone)) {
      setError('手机号格式不正确')
      return
    }

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          type: 'register',
        }),
      })

      const result = await response.json()

      if (result.success) {
        setCodeSent(true)
        setCountdown(60)
        setError('')

        // 开发环境下显示验证码
        if (process.env.NODE_ENV === 'development' && result.data?.code) {
          alert(`验证码: ${result.data.code}`)
        }

        // 倒计时
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setError(result.message || '发送失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 验证表单
    if (!formData.phone || !formData.password || !formData.verificationCode) {
      setError('请填写所有必填字段')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    // 验证密码强度
    if (formData.password.length < 8) {
      setError('密码长度至少为8位')
      return
    }

    if (!/[a-z]/.test(formData.password)) {
      setError('密码必须包含小写字母')
      return
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('密码必须包含大写字母')
      return
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('密码必须包含数字')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
          verificationCode: formData.verificationCode,
          nickname: formData.nickname || undefined,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // 保存token
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('user', JSON.stringify(result.data.user))

        // 跳转到首页
        router.push('/')
      } else {
        setError(result.message || '注册失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">注册 WYLM</CardTitle>
          <p className="text-center text-sm text-gray-600 mt-2">
            创建您的账号，开始探索精彩内容
          </p>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="手机号"
              type="tel"
              placeholder="请输入手机号"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />

            <div className="relative">
              <Input
                label="验证码"
                type="text"
                placeholder="请输入验证码"
                value={formData.verificationCode}
                onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={countdown > 0}
                className="absolute right-3 top-9 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {countdown > 0 ? `${countdown}秒后重试` : codeSent ? '重新发送' : '发送验证码'}
              </button>
            </div>

            <Input
              label="密码"
              type="password"
              placeholder="请输入密码"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              helperText="至少8位，包含大小写字母和数字"
              required
            />

            <Input
              label="确认密码"
              type="password"
              placeholder="请再次输入密码"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            <Input
              label="昵称（可选）"
              type="text"
              placeholder="请输入昵称"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            />

            <div className="text-xs text-gray-600">
              注册即表示您同意我们的
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 mx-1">
                服务条款
              </Link>
              和
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 mx-1">
                隐私政策
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              注册
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            已有账号？
            <Link href="/login" className="text-blue-600 hover:text-blue-700 ml-1">
              立即登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
