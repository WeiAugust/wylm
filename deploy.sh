#!/bin/bash

# WYLM Docker 部署脚本
# 用于快速部署生产环境

set -e

echo "🚀 WYLM Docker 部署脚本"
echo "======================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker 未安装，请先安装 Docker${NC}"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose 未安装，请先安装 Docker Compose${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker 和 Docker Compose 已安装${NC}"
echo ""

# 检查环境变量文件
if [ ! -f .env.docker.local ]; then
    echo -e "${YELLOW}⚠️  未找到 .env.docker.local 文件${NC}"
    echo "正在从 .env.docker 创建..."
    cp .env.docker .env.docker.local
    echo -e "${GREEN}✅ 已创建 .env.docker.local${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  重要提示：${NC}"
    echo "请编辑 .env.docker.local 文件，修改以下配置："
    echo "  - JWT_SECRET"
    echo "  - NEXTAUTH_SECRET"
    echo "  - 数据库密码（如果需要）"
    echo ""
    read -p "是否现在编辑配置文件？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ${EDITOR:-nano} .env.docker.local
    else
        echo -e "${YELLOW}请稍后手动编辑 .env.docker.local 文件${NC}"
        exit 0
    fi
fi

echo ""
echo "📦 开始构建 Docker 镜像..."
docker-compose build --no-cache

echo ""
echo "🚀 启动服务..."
docker-compose up -d

echo ""
echo "⏳ 等待服务启动..."
sleep 5

# 检查服务状态
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ 服务启动成功！${NC}"
    echo ""
    echo "📊 服务状态："
    docker-compose ps
    echo ""
    echo "🌐 访问地址："
    echo "  - 应用: http://localhost:3000"
    echo "  - 默认管理员账号: 13800138000"
    echo "  - 默认密码: Admin123456"
    echo ""
    echo "📝 查看日志："
    echo "  docker-compose logs -f app"
    echo ""
    echo "🛑 停止服务："
    echo "  docker-compose down"
else
    echo -e "${RED}❌ 服务启动失败${NC}"
    echo "查看日志："
    docker-compose logs
    exit 1
fi
