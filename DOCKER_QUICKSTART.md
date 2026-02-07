# WYLM Docker 部署 - 快速参考

## 🚀 快速启动

### 方式 1: 使用交互式菜单（推荐新手）
```bash
./start.sh
```

### 方式 2: 使用 Makefile（推荐开发者）
```bash
make help          # 查看所有命令
make dev           # 启动开发环境
make up            # 启动生产环境
make logs          # 查看日志
```

### 方式 3: 使用部署脚本
```bash
./dev.sh           # 开发环境
./deploy.sh        # 生产环境（简单）
./deploy-prod.sh   # 生产环境（完整）
```

## 📋 常用命令速查

### 开发环境
```bash
# 启动
docker-compose -f docker-compose.dev.yml up -d

# 停止
docker-compose -f docker-compose.dev.yml down

# 查看日志
docker-compose -f docker-compose.dev.yml logs -f
```

### 生产环境
```bash
# 启动
docker-compose up -d

# 停止
docker-compose down

# 重启
docker-compose restart

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f app
```

### 数据库操作
```bash
# 备份
./scripts/backup.sh

# 恢复
./scripts/restore.sh backups/backup_20260207_120000.sql.gz

# 进入数据库
docker-compose exec postgres psql -U wylm -d wylm

# Prisma Studio
docker-compose exec app npx prisma studio
```

### 容器管理
```bash
# 进入应用容器
docker-compose exec app sh

# 查看资源使用
docker stats wylm-app wylm-postgres

# 重新构建
docker-compose build --no-cache app
```

## 🔧 故障排查

### 应用无法启动
```bash
# 查看详细日志
docker-compose logs app

# 检查容器状态
docker-compose ps

# 重启容器
docker-compose restart app
```

### 数据库连接失败
```bash
# 检查数据库状态
docker-compose exec postgres pg_isready -U wylm

# 查看数据库日志
docker-compose logs postgres

# 重启数据库
docker-compose restart postgres
```

### 端口被占用
```bash
# 修改 docker-compose.yml 中的端口
ports:
  - "3001:3000"  # 改用 3001 端口
```

### 清理并重新开始
```bash
# 停止并删除容器
docker-compose down

# 删除所有数据（警告：会丢失数据！）
docker-compose down -v

# 重新启动
docker-compose up -d
```

## 📊 监控和维护

### 健康检查
```bash
# 手动检查
curl http://localhost:3000/api/health

# 自动监控
./scripts/monitor.sh
```

### 定期备份
```bash
# 添加到 crontab
crontab -e

# 添加以下行（每天凌晨 2 点备份）
0 2 * * * cd /path/to/wylm && ./scripts/backup.sh
```

### 日志管理
```bash
# 查看实时日志
docker-compose logs -f

# 查看最近 100 行
docker-compose logs --tail=100 app

# 清理日志
docker-compose down
docker system prune -f
```

## 🔐 安全检查清单

- [ ] 修改 JWT_SECRET
- [ ] 修改 NEXTAUTH_SECRET
- [ ] 修改数据库密码
- [ ] 修改默认管理员密码
- [ ] 配置 HTTPS
- [ ] 限制数据库端口访问
- [ ] 设置防火墙规则
- [ ] 配置定期备份
- [ ] 启用日志监控

## 📞 获取帮助

- 查看完整文档: `docs/DOCKER_DEPLOYMENT.md`
- 查看 Makefile 命令: `make help`
- 运行交互式菜单: `./start.sh`

## 🔗 相关文件

- `Dockerfile` - 应用镜像构建
- `docker-compose.yml` - 基础生产环境
- `docker-compose.dev.yml` - 开发环境
- `docker-compose.prod.yml` - 完整生产环境
- `.env.docker` - 环境变量模板
- `Makefile` - 快捷命令
- `scripts/` - 实用脚本
