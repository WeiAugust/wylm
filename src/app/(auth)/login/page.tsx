'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function LoginPage() {
  const router = useRouter()
  const [loginType, setLoginType] = useState<'password' | 'code'>('password')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    verificationCode: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          password: loginType === 'password' ? formData.password : undefined,
          verificationCode: loginType === 'code' ? formData.verificationCode : undefined,
          loginType,
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
        setError(result.message || '登录失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleSendCode = async () => {
    if (!formData.phone) {
      setError('请输入手机号')
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
          type: 'login',
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert('验证码已发送')
      } else {
        setError(result.message || '发送失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">登录 WYLM</CardTitle>
          <p className="text-center text-sm text-gray-600 mt-2">
            欢迎回来！请登录您的账号
          </p>
        </CardHeader>

        <CardContent>
          {/* Login Type Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginType === 'password'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setLoginType('password')}
            >
              密码登录
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginType === 'code'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setLoginType('code')}
            >
              验证码登录
            </button>
          </div>

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

            {loginType === 'password' ? (
              <Input
                label="密码"
                type="password"
                placeholder="请输入密码"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            ) : (
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
                  className="absolute right-3 top-9 text-sm text-blue-600 hover:text-blue-700"
                >
                  发送验证码
                </button>
              </div>
            )}

            {loginType === 'password' && (
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                  忘记密码？
                </Link>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              登录
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            还没有账号？
            <Link href="/register" className="text-blue-600 hover:text-blue-700 ml-1">
              立即注册
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
