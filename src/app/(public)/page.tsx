import MainLayout from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              欢迎来到 WYLM
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              一个集门户展示、博客创作、摄影作品展示、产品推广于一体的综合性个人网站平台
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/blog">
                <Button variant="primary" size="lg">
                  浏览博客
                </Button>
              </Link>
              <Link href="/gallery">
                <Button variant="outline" size="lg">
                  查看作品
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            核心功能
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Blog Card */}
            <Card hover>
              <CardHeader>
                <div className="text-4xl mb-4">📝</div>
                <CardTitle>个人博客</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  分享技术文章、生活随笔，支持Markdown编辑、分类标签、评论互动
                </p>
                <Link href="/blog">
                  <Button variant="ghost" size="sm" className="mt-4">
                    了解更多 →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Gallery Card */}
            <Card hover>
              <CardHeader>
                <div className="text-4xl mb-4">📷</div>
                <CardTitle>摄影画廊</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  展示摄影作品，支持EXIF信息、相册管理、高清预览
                </p>
                <Link href="/gallery">
                  <Button variant="ghost" size="sm" className="mt-4">
                    了解更多 →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Products Card */}
            <Card hover>
              <CardHeader>
                <div className="text-4xl mb-4">🚀</div>
                <CardTitle>产品展示</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  推广个人产品，支持演示视频、使用案例、订阅购买
                </p>
                <Link href="/products">
                  <Button variant="ghost" size="sm" className="mt-4">
                    了解更多 →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Community Card */}
            <Card hover>
              <CardHeader>
                <div className="text-4xl mb-4">💬</div>
                <CardTitle>互动社区</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  评论、点赞、收藏、赞赏，与访客建立深度互动
                </p>
                <Link href="/register">
                  <Button variant="ghost" size="sm" className="mt-4">
                    立即加入 →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">博客文章</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
              <div className="text-gray-600">摄影作品</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10+</div>
              <div className="text-gray-600">优质产品</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">注册用户</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            准备好开始了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            立即注册，探索更多精彩内容
          </p>
          <Link href="/register">
            <Button variant="secondary" size="lg">
              免费注册
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  )
}
