# WYLM 项目开发指南

## 快速开始

### 1. 环境准备

确保已安装以下软件：
- Node.js 18+
- PostgreSQL 14+
- npm 或 yarn

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 到 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接：

```env
DATABASE_URL="postgresql://username:password@localhost:5432/wylm?schema=public"
```

### 4. 初始化数据库

```bash
# 生成Prisma Client
npm run db:generate

# 运行数据库迁移
npm run db:migrate

# 填充初始数据
npm run db:seed
```

初始化完成后，会创建默认管理员账号：
- 手机号：13800138000
- 密码：Admin123456

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构说明

```
wylm/
├── docs/                       # 项目文档
│   ├── PRD.md                 # 产品需求文档
│   ├── DEVELOPMENT.md         # 开发指南（本文件）
│   └── API.md                 # API文档
│
├── prisma/                    # Prisma配置
│   ├── schema.prisma          # 数据库Schema
│   └── seed.ts                # 数据库初始化脚本
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (public)/          # 公开页面（无需登录）
│   │   │   ├── page.tsx       # 门户主页
│   │   │   ├── blog/          # 博客模块
│   │   │   ├── gallery/       # 摄影画廊模块
│   │   │   └── products/      # 产品模块
│   │   │
│   │   ├── (auth)/            # 认证页面
│   │   │   ├── login/         # 登录页
│   │   │   └── register/      # 注册页
│   │   │
│   │   ├── (admin)/           # 后台管理（需要管理员权限）
│   │   │   └── admin/
│   │   │       ├── dashboard/ # 仪表盘
│   │   │       ├── users/     # 用户管理
│   │   │       ├── posts/     # 博客管理
│   │   │       ├── photos/    # 摄影作品管理
│   │   │       ├── products/  # 产品管理
│   │   │       └── settings/  # 系统设置
│   │   │
│   │   └── api/               # API路由
│   │       ├── auth/          # 认证相关API
│   │       ├── blog/          # 博客相关API
│   │       ├── gallery/       # 画廊相关API
│   │       ├── products/      # 产品相关API
│   │       └── admin/         # 管理相关API
│   │
│   ├── components/            # React组件
│   │   ├── ui/               # 基础UI组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   ├── layout/           # 布局组件
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   └── features/         # 功能组件
│   │       ├── blog/
│   │       ├── gallery/
│   │       └── products/
│   │
│   ├── lib/                  # 工具库
│   │   ├── prisma/          # Prisma客户端
│   │   │   └── client.ts
│   │   ├── auth/            # 认证相关
│   │   │   └── jwt.ts
│   │   └── utils/           # 工具函数
│   │       ├── validation.ts
│   │       ├── password.ts
│   │       ├── response.ts
│   │       └── cn.ts
│   │
│   └── types/               # TypeScript类型定义
│       └── index.ts
│
├── .env.example             # 环境变量示例
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 开发规范

### 代码风格

- 使用TypeScript
- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 组件使用函数式组件 + Hooks
- 使用Tailwind CSS进行样式开发

### 命名规范

- 组件文件：PascalCase（如 `Button.tsx`）
- 工具函数文件：camelCase（如 `validation.ts`）
- 常量：UPPER_SNAKE_CASE（如 `API_BASE_URL`）
- 变量和函数：camelCase（如 `getUserInfo`）
- 类型和接口：PascalCase（如 `User`, `ApiResponse`）

### Git提交规范

使用约定式提交（Conventional Commits）：

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具链相关
```

示例：
```bash
git commit -m "feat: 添加用户注册功能"
git commit -m "fix: 修复登录验证码验证失败的问题"
```

## 数据库操作

### 常用命令

```bash
# 生成Prisma Client
npm run db:generate

# 创建新的迁移
npm run db:migrate

# 重置数据库（删除所有数据并重新迁移）
npm run db:reset

# 填充初始数据
npm run db:seed

# 打开Prisma Studio（数据库可视化工具）
npm run db:studio
```

### 修改数据库Schema

1. 编辑 `prisma/schema.prisma` 文件
2. 运行 `npm run db:migrate` 创建迁移
3. 运行 `npm run db:generate` 生成新的Prisma Client

## API开发

### API响应格式

所有API统一使用以下响应格式：

```typescript
// 成功响应
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}

// 错误响应
{
  "success": false,
  "message": "错误信息",
  "error": "详细错误",
  "code": 400
}
```

### 使用ApiResponseHelper

```typescript
import { ApiResponseHelper } from '@/lib/utils/response'

// 成功响应
return ApiResponseHelper.success(data, '操作成功')

// 错误响应
return ApiResponseHelper.error('错误信息', 400)

// 快捷方法
return ApiResponseHelper.unauthorized() // 401
return ApiResponseHelper.forbidden()    // 403
return ApiResponseHelper.notFound()     // 404
return ApiResponseHelper.serverError()  // 500
```

### 认证和权限

使用JWT进行认证：

```typescript
import { JwtHelper } from '@/lib/auth/jwt'

// 生成Token
const token = JwtHelper.sign({
  userId: user.id,
  phone: user.phone,
  roles: ['普通用户']
})

// 验证Token
const payload = JwtHelper.verify(token)
if (!payload) {
  return ApiResponseHelper.unauthorized()
}
```

## 前端开发

### 使用UI组件

```tsx
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

function MyComponent() {
  return (
    <Card>
      <Input
        label="用户名"
        placeholder="请输入用户名"
        error="用户名不能为空"
      />
      <Button variant="primary" size="lg">
        提交
      </Button>
    </Card>
  )
}
```

### 调用API

```tsx
async function login(phone: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone,
      password,
      loginType: 'password'
    })
  })

  const result = await response.json()

  if (result.success) {
    // 登录成功
    const { user, token } = result.data
    // 保存token到localStorage
    localStorage.setItem('token', token)
  } else {
    // 登录失败
    console.error(result.message)
  }
}
```

## 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch
```

## 部署

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

### Docker部署

```bash
# 构建镜像
docker build -t wylm .

# 运行容器
docker run -p 3000:3000 wylm
```

## 常见问题

### 1. 数据库连接失败

检查 `.env` 文件中的 `DATABASE_URL` 是否正确配置。

### 2. Prisma Client未生成

运行 `npm run db:generate` 生成Prisma Client。

### 3. 端口被占用

修改启动命令：
```bash
PORT=3001 npm run dev
```

### 4. 依赖安装失败

尝试清除缓存：
```bash
rm -rf node_modules package-lock.json
npm install
```

## 相关资源

- [Next.js文档](https://nextjs.org/docs)
- [Prisma文档](https://www.prisma.io/docs)
- [Tailwind CSS文档](https://tailwindcss.com/docs)
- [TypeScript文档](https://www.typescriptlang.org/docs)

## 联系方式

如有问题，请联系：
- 项目负责人：[待填写]
- 技术支持：[待填写]
