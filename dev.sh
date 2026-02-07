#!/bin/bash

# WYLM 开发环境启动脚本
# 仅启动数据库容器，应用在本地运行

set -e

echo "🔧 WYLM 开发环境启动脚本"
echo "========================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 启动开发数据库
echo "🐘 启动 PostgreSQL 数据库..."
docker-compose -f docker-compose.dev.yml up -d postgres

echo ""
echo "⏳ 等待数据库启动..."
sleep 3

# 检查数据库是否就绪
until docker-compose -f docker-compose.dev.yml exec -T postgres pg_isready -U wylm 2>/dev/null; do
  echo "等待数据库就绪..."
  sleep 2
done

echo -e "${GREEN}✅ 数据库已就绪${NC}"
echo ""

# 提示更新环境变量
echo -e "${YELLOW}📝 请确保 .env 文件中的数据库连接配置正确：${NC}"
echo "DATABASE_URL=\"postgresql://wylm:wylm_dev_password@localhost:5432/wylm_dev?schema=public\""
echo ""

# 询问是否运行数据库迁移
read -p "是否运行数据库迁移和初始化？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔄 生成 Prisma Client..."
    npm run db:generate

    echo ""
    echo "🔄 运行数据库迁移..."
    npm run db:migrate

    echo ""
    echo "🌱 初始化数据..."
    npm run db:seed

    echo -e "${GREEN}✅ 数据库初始化完成${NC}"
fi

echo ""
echo "🎉 开发环境准备就绪！"
echo ""
echo "📊 服务信息："
echo "  - 数据库: localhost:5432"
echo "  - 用户名: wylm"
echo "  - 密码: wylm_dev_password"
echo "  - 数据库名: wylm_dev"
echo ""
echo "🚀 启动开发服务器："
echo "  npm run dev"
echo ""
echo "🔍 启动 Prisma Studio（可选）："
echo "  docker-compose -f docker-compose.dev.yml up -d prisma-studio"
echo "  访问: http://localhost:5555"
echo ""
echo "🛑 停止开发环境："
echo "  docker-compose -f docker-compose.dev.yml down"
