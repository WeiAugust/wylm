import MainLayout from '@/components/layout/MainLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function GalleryPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">摄影画廊</h1>
          <p className="text-xl text-gray-600">
            记录生活中的美好瞬间
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <Button variant="primary" size="sm">全部</Button>
          <Button variant="outline" size="sm">风光</Button>
          <Button variant="outline" size="sm">人像</Button>
          <Button variant="outline" size="sm">街拍</Button>
          <Button variant="outline" size="sm">静物</Button>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {/* Sample Photo Cards */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <Card key={i} hover className="break-inside-avoid">
              <div
                className="aspect-[3/4] bg-gray-200 rounded-t-lg"
                style={{ aspectRatio: i % 3 === 0 ? '4/3' : i % 2 === 0 ? '1/1' : '3/4' }}
              ></div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">作品标题 {i}</h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>📍 杭州</span>
                  <div className="flex gap-3">
                    <span>👁️ 200</span>
                    <span>❤️ 20</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            加载更多
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
