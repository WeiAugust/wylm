import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <Link href="/admin/dashboard">
            <h1 className="text-2xl font-bold text-blue-600">WYLM Admin</h1>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          <Link href="/admin/dashboard">
            <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="mr-3">📊</span>
              <span>仪表盘</span>
            </div>
          </Link>

          <Link href="/admin/users">
            <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="mr-3">👥</span>
              <span>用户管理</span>
            </div>
          </Link>

          <Link href="/admin/posts">
            <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="mr-3">📝</span>
              <span>博客管理</span>
            </div>
          </Link>

          <Link href="/admin/photos">
            <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="mr-3">📷</span>
              <span>摄影作品</span>
            </div>
          </Link>

          <Link href="/admin/products">
            <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="mr-3">🚀</span>
              <span>产品管理</span>
            </div>
          </Link>

          <Link href="/admin/comments">
            <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="mr-3">💬</span>
              <span>评论管理</span>
            </div>
          </Link>

          <Link href="/admin/settings">
            <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="mr-3">⚙️</span>
              <span>系统设置</span>
            </div>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <Link href="/">
            <Button variant="outline" size="sm" fullWidth>
              返回前台
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">管理后台</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">管理员</span>
              <Button variant="ghost" size="sm">
                退出登录
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
