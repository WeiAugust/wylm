# Docker 部署指南

本文档介绍如何使用 Docker 部署 WYLM 项目。

## 📋 前置要求

- Docker 20.10+
- Docker Compose 2.0+

## 🚀 快速开始

### 1. 生产环境部署（推荐）

#### 步骤 1: 克隆项目

```bash
git clone <your-repo-url>
cd wylm
```

#### 步骤 2: 配置环境变量

```bash
# 复制环境变量模板
cp .env.docker .env.docker.local

# 编辑环境变量（重要：修改密钥！）
nano .env.docker.local
```

**必须修改的配置项：**
- `JWT_SECRET` - JWT 签名密钥（生产环境必须修改）
- `NEXTAUTH_SECRET` - NextAuth 密钥（生产环境必须修改）
- `DATABASE_URL` 中的密码（如果需要）

#### 步骤 3: 启动服务

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f app
```

#### 步骤 4: 访问应用

- 应用地址: http://localhost:3000
- 默认管理员账号:
  - 手机号: `13800138000`
  - 密码: `Admin123456`

### 2. 开发环境部署

如果只需要数据库容器，本地运行 Next.js：

```bash
# 启动开发环境数据库
docker-compose -f docker-compose.dev.yml up -d

# 更新本地环境变量
# 修改 .env 文件中的 DATABASE_URL:
# DATABASE_URL="postgresql://wylm:wylm_dev_password@localhost:5432/wylm_dev?schema=public"

# 运行数据库迁移
npm run db:generate
npm run db:migrate
npm run db:seed

# 启动开发服务器
npm run dev
```

开发环境还包含 Prisma Studio（可选）：
- 访问地址: http://localhost:5555

## 📦 Docker 服务说明

### 生产环境 (docker-compose.yml)

包含两个服务：

1. **postgres** - PostgreSQL 14 数据库
   - 端口: 5432
   - 用户: wylm
   - 数据库: wylm
   - 数据持久化: postgres_data volume

2. **app** - Next.js 应用
   - 端口: 3000
   - 自动运行数据库迁移
   - 自动初始化数据

### 开发环境 (docker-compose.dev.yml)

包含两个服务：

1. **postgres** - PostgreSQL 14 数据库（开发用）
   - 端口: 5432
   - 用户: wylm
   - 数据库: wylm_dev

2. **prisma-studio** - 数据库可视化工具
   - 端口: 5555

## 🔧 常用命令

### 服务管理

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app
docker-compose logs -f postgres
```

### 数据库操作

```bash
# 进入应用容器
docker-compose exec app sh

# 在容器内运行 Prisma 命令
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
docker-compose exec app npx prisma studio

# 直接连接数据库
docker-compose exec postgres psql -U wylm -d wylm
```

### 重建应用

```bash
# 重新构建镜像
docker-compose build --no-cache app

# 重新构建并启动
docker-compose up -d --build app
```

### 清理数据

```bash
# 停止并删除容器、网络
docker-compose down

# 停止并删除容器、网络、数据卷（警告：会删除所有数据！）
docker-compose down -v
```

## 🔐 安全建议

### 生产环境部署

1. **修改默认密码**
   ```bash
   # 修改 docker-compose.yml 中的数据库密码
   POSTGRES_PASSWORD: your-strong-password

   # 同步修改 DATABASE_URL
   DATABASE_URL: postgresql://wylm:your-strong-password@postgres:5432/wylm?schema=public
   ```

2. **修改 JWT 密钥**
   ```bash
   # 生成随机密钥
   openssl rand -base64 32

   # 更新 docker-compose.yml 中的 JWT_SECRET 和 NEXTAUTH_SECRET
   ```

3. **修改默认管理员密码**
   - 首次登录后立即修改管理员密码
   - 或修改 `prisma/seed.ts` 中的默认密码

4. **使用 HTTPS**
   - 配置反向代理（Nginx/Caddy）
   - 申请 SSL 证书（Let's Encrypt）

5. **限制端口暴露**
   ```yaml
   # 不要暴露数据库端口到公网
   postgres:
     ports:
       - "127.0.0.1:5432:5432"  # 只监听本地
   ```

## 🌐 反向代理配置

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Caddy 配置示例

```
your-domain.com {
    reverse_proxy localhost:3000
}
```

## 📊 监控和日志

### 查看实时日志

```bash
# 所有服务
docker-compose logs -f

# 仅应用
docker-compose logs -f app

# 仅数据库
docker-compose logs -f postgres

# 最近 100 行
docker-compose logs --tail=100 app
```

### 容器资源使用

```bash
# 查看资源使用情况
docker stats wylm-app wylm-postgres
```

## 🔄 更新部署

### 更新应用代码

```bash
# 1. 拉取最新代码
git pull

# 2. 重新构建镜像
docker-compose build --no-cache app

# 3. 重启应用
docker-compose up -d app

# 4. 查看日志确认启动成功
docker-compose logs -f app
```

### 数据库迁移

```bash
# 应用会自动运行迁移，也可以手动执行
docker-compose exec app npx prisma migrate deploy
```

## 🐛 故障排查

### 应用无法启动

```bash
# 查看详细日志
docker-compose logs app

# 检查数据库连接
docker-compose exec app npx prisma db push --skip-generate
```

### 数据库连接失败

```bash
# 检查数据库是否运行
docker-compose ps postgres

# 检查数据库日志
docker-compose logs postgres

# 测试数据库连接
docker-compose exec postgres psql -U wylm -d wylm -c "SELECT 1;"
```

### 端口被占用

```bash
# 修改 docker-compose.yml 中的端口映射
ports:
  - "3001:3000"  # 使用 3001 端口
```

### 重置所有数据

```bash
# 警告：这会删除有数据！
docker-compose down -v
docker-compose up -d
```

## 📝 备份和恢复

### 备份数据库

```bash
# 创建备份
docker-compose exec postgres pg_dump -U wylm wylm > backup_$(date +%Y%m%d_%H%M%S).sql

# 或使用 Docker 卷备份
docker run --rm -v wylm_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data
```

### 恢复数据库

```bash
# 从 SQL 文件恢复
docker-compose exec -T postgres psql -U wylm -d wylm < backup.sql

# 从卷备份恢复
docker run --rm -v wylm_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /
```

## 🎯 性能优化

### 数据库优化

```yaml
# docker-compose.yml 中添加
postgres:
  command:
    - "postgres"
    - "-c"
    - "max_connections=200"
    - "-c"
    - "shared_buffers=256MB"
    - "-c"
    - "effective_cache_size=1GB"
```

### 应用优化

```yaml
# docker-compose.yml 中添加资源限制
app:
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 2G
      reservations:
        cpus: '1'
        memory: 1G
```

## 📞 获取帮助

如遇到问题：
1. 查看日志: `docker-compose logs -f`
2. 检查容器状态: `docker-compose ps`
3. 查看本文档的故障排查部分
4. 提交 Issue 到项目仓库

## 🔗 相关链接

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Prisma 部署文档](https://www.prisma.io/docs/guides/deployment)
