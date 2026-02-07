# WYLM 快速启动指南

## 前置要求

确保已安装：
- Node.js 18+
- PostgreSQL 14+
- npm 或 yarn

## 5分钟快速启动

### 1. 安装依赖

```bash
npm install
```

### 2. 配置数据库

复制环境变量文件：
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接：
```env
DATABASE_URL="postgresql://username:password@localhost:5432/wylm?schema=public"
```

### 3. 初始化数据库

```bash
# 生成Prisma Client
npm run db:generate

# 运行数据库迁移
npm run db:migrate

# 填充初始数据（包含默认管理员账号）
npm run db:seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

### 5. 访问网站

打开浏览器访问：
- 主页: http://localhost:3000
- 登录: http://localhost:3000/login

### 6. 使用默认管理员账号登录

- 手机号: `13800138000`
- 密码: `Admin123456`

## 完成！

现在你可以：
- 浏览门户主页
- 使用管理员账号登录
- 查看 API 文档: `docs/API.md`
- 查看开发指南: `docs/DEVELOPMENT.md`
- 查看 PRD 文档: `docs/PRD.md`

## 下一步

开始开发你的功能模块：
1. 博客系统
2. 摄影画廊
3. 产品展示
4. 后台管理

## 遇到问题？

查看 `docs/DEVELOPMENT.md` 中的常见问题部分。

---

祝开发愉快！🚀
