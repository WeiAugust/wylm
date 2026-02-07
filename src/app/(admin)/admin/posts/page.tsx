import AdminLayout from '@/components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export default function AdminPostsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">博客管理</h1>
            <p className="text-gray-600 mt-2">管理所有博客文章</p>
          </div>
          <Button variant="primary" size="lg">
            + 新建文章
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="搜索文章..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>全部状态</option>
                <option>已发布</option>
                <option>草稿</option>
                <option>已归档</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>全部分类</option>
                <option>技术</option>
                <option>生活</option>
                <option>摄影</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>文章列表</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">标题</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">分类</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">状态</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">浏览量</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">发布时间</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">文章标题 {i}</div>
                        <div className="text-sm text-gray-500">article-slug-{i}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="primary" size="sm">技术</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="success" size="sm">已发布</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">1,234</td>
                      <td className="py-3 px-4 text-gray-600">2026-02-07</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">编辑</Button>
                          <Button variant="ghost" size="sm">删除</Button>
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
                显示 1-5 条，共 50 条
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
