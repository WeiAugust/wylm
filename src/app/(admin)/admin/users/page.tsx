import AdminLayout from '@/components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
            <p className="text-gray-600 mt-2">管理所有注册用户</p>
          </div>
          <Button variant="primary" size="lg">
            + 添加用户
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-gray-600">总用户数</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">1,234</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-gray-600">活跃用户</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">856</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-gray-600">新增用户（本月）</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">123</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-gray-600">禁用用户</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">12</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="搜索用户..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>全部角色</option>
                <option>超级管理员</option>
                <option>内容编辑者</option>
                <option>普通用户</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>全部状态</option>
                <option>活跃</option>
                <option>未激活</option>
                <option>已禁用</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>用户列表</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">用户</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">手机号</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">角色</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">状态</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">注册时间</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">U{i}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">用户 {i}</div>
                            <div className="text-sm text-gray-500">user{i}@example.com</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">138****{1000 + i}</td>
                      <td className="py-3 px-4">
                        <Badge variant="primary" size="sm">普通用户</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="success" size="sm">活跃</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">2026-02-{String(i).padStart(2, '0')}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">编辑</Button>
                          <Button variant="ghost" size="sm">禁用</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                显示 1-5 条，共 1,234 条
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">上一页</Button>
                <Button variant="primary" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">下一页</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
