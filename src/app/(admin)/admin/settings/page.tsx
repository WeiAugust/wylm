import AdminLayout from '@/components/layout/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">系统设置</h1>
          <p className="text-gray-600 mt-2">配置网站的基本信息和功能</p>
        </div>

        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle>基本设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="网站名称"
              placeholder="请输入网站名称"
              defaultValue="WYLM"
            />
            <Input
              label="网站地址"
              placeholder="https://example.com"
              defaultValue="http://localhost:3000"
            />
            <Textarea
              label="网站描述"
              placeholder="请输入网站描述"
              defaultValue="一个集门户展示、博客创作、摄影作品展示、产品推广于一体的综合性个人网站平台"
            />
            <Input
              label="网站关键词"
              placeholder="请输入关键词，用逗号分隔"
              defaultValue="博客,摄影,产品"
            />
          </CardContent>
        </Card>

        {/* Feature Settings */}
        <Card>
          <CardHeader>
            <CardTitle>功能开关</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-900">用户注册</div>
                <div className="text-sm text-gray-500">允许新用户注册账号</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-900">评论功能</div>
                <div className="text-sm text-gray-500">允许用户发表评论</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-900">赞赏功能</div>
                <div className="text-sm text-gray-500">允许用户赞赏内容</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900">第三方登录</div>
                <div className="text-sm text-gray-500">允许使用第三方账号登录</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="SEO标题"
              placeholder="请输入SEO标题"
              helperText="建议长度：50-60个字符"
            />
            <Textarea
              label="SEO描述"
              placeholder="请输入SEO描述"
              helperText="建议长度：150-160个字符"
            />
            <Textarea
              label="统计代码"
              placeholder="请输入Google Analytics或百度统计代码"
              helperText="将在网站所有页面的<head>标签中插入"
            />
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle>邮件设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="SMTP服务器"
              placeholder="smtp.example.com"
            />
            <Input
              label="SMTP端口"
              type="number"
              placeholder="587"
            />
            <Input
              label="发件邮箱"
              type="email"
              placeholder="noreply@example.com"
            />
            <Input
              label="邮箱密码"
              type="password"
              placeholder="请输入邮箱密码"
            />
          </CardContent>
        </Card>

        {/* SMS Settings */}
        <Card>
          <CardHeader>
            <CardTitle>短信设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="短信服务商"
              options={[
                { value: 'aliyun', label: '阿里云短信' },
                { value: 'tencent', label: '腾讯云短信' },
                { value: 'huawei', label: '华为云短信' },
              ]}
            />
            <Input
              label="Access Key ID"
              placeholder="请输入Access Key ID"
            />
            <Input
              label="Access Key Secret"
              type="password"
              placeholder="请输入Access Key Secret"
            />
            <Input
              label="短信签名"
              placeholder="请输入短信签名"
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" size="lg">
            重置
          </Button>
          <Button variant="primary" size="lg">
            保存设置
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
