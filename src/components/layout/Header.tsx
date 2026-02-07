import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-blue-600">WYLM</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            首页
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            博客
          </Link>
          <Link
            href="/gallery"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            摄影
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            产品
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              登录
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">
              注册
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
