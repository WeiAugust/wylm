import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function ProductsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">产品展示</h1>
          <p className="text-xl text-gray-600">
            探索我们的优质产品和服务
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Sample Product Card */}
          {[1, 2, 3].map((i) => (
            <Card key={i} hover>
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg"></div>
              <CardHeader>
                <CardTitle>产品名称 {i}</CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  这是产品的简短描述，介绍产品的核心功能和特点
                </p>
              </CardHeader>
              <CardContent>
                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">核心功能</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>✓ 功能特性 1</li>
                    <li>✓ 功能特性 2</li>
                    <li>✓ 功能特性 3</li>
                  </ul>
                </div>

                {/* Pricing */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-600">¥99</span>
                    <span className="text-sm text-gray-500">/月</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-2">
                  <Link href={`/products/${i}`} className="flex-1">
                    <Button variant="primary" size="md" fullWidth>
                      了解详情
                    </Button>
                  </Link>
                  <Button variant="outline" size="md">
                    试用
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            找不到合适的产品？
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            联系我们，为您定制专属解决方案
          </p>
          <Button variant="secondary" size="lg">
            联系我们
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
