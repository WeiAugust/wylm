import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function BlogPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">博客</h1>
          <p className="text-xl text-gray-600">
            分享技术文章、生活随笔和个人见解
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <Button variant="primary" size="sm">全部</Button>
          <Button variant="outline" size="sm">技术</Button>
          <Button variant="outline" size="sm">生活</Button>
          <Button variant="outline" size="sm">摄影</Button>
          <Button variant="outline" size="sm">旅行</Button>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Sample Blog Post Card */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} hover>
              <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">技术</span>
                  <span className="text-xs text-gray-500">2026-02-07</span>
                </div>
                <CardTitle>博客文章标题 {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  这是文章的摘要内容，简要介绍文章的主要内容和核心观点...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>👁️ 100</span>
                    <span>❤️ 10</span>
                    <span>💬 5</span>
                  </div>
                  <Link href={`/blog/${i}`}>
                    <Button variant="ghost" size="sm">
                      阅读更多 →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm">上一页</Button>
          <Button variant="primary" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">下一页</Button>
        </div>
      </div>
    </MainLayout>
  )
}
