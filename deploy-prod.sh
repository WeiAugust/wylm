#!/bin/bash

# WYLM 生产环境部署脚本
# 用于生产环境的完整部署

set -e

echo "🚀 WYLM 生产环境部署脚本"
echo "========================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 检查是否为 root 用户
if [ "$EUID" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  警告：不建议使用 root 用户运行此脚本${NC}"
    read -p "是否继续？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker 未安装${NC}"
    echo "请访问 https://docs.docker.com/get-docker/ 安装 Docker"
    exit 1
fi

# 检查 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose 未安装${NC}"
    echo "请访问 https://docs.docker.com/compose/install/ 安装 Docker Compose"
    exit 1
fi

echo -e "${GREEN}✅ Docker 环境检查通过${NC}"
echo ""

# 检查环境变量文件
if [ ! -f .env.prod ]; then
    echo -e "${YELLOW}⚠️  未找到 .env.prod 文件${NC}"

    if [ -f .env.prod.example ]; then
        echo "正在从 .env.prod.example 创建..."
        cp .env.prod.example .env.prod
        echo -e "${GREEN}✅ 已创建 .env.prod${NC}"
    else
        echo -e "${RED}❌ 未找到 .env.prod.example 文件${NC}"
        exit 1
    fi

    echo ""
    echo -e "${RED}⚠️  重要：必须修改以下配置！${NC}"
    echo "  1. POSTGRES_PASSWORD - 数据库密码"
    echo "  2. JWT_SECRET - JWT 签名密钥（至少32字符）"
    echo "  3. NEXTAUTH_SECRET - NextAuth 密钥（至少32字符）"
    echo "  4. NEXTAUTH_URL - 网站域名"
    echo "  5. SITE_URL - 网站域名"
    echo ""

    read -p "是否现在编辑配置文件？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ${EDITOR:-nano} .env.prod
    else
        echo -e "${YELLOW}请手动编辑 .env.prod 文件后重新运行此脚本${NC}"
        exit 0
    fi
fi

# 加载环境变量
source .env.prod

# 验证必需的环境变量
echo "🔍 验证配置..."
REQUIRED_VARS=("JWT_SECRET" "NEXTAUTH_SECRET" "POSTGRES_PASSWORD")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${RED}❌ 缺少必需的环境变量：${NC}"
    printf '%s\n' "${MISSING_VARS[@]}"
    exit 1
fi

# 检查密钥长度
if [ ${#JWT_SECRET} -lt 32 ]; then
    echo -e "${RED}❌ JWT_SECRET 长度不足（至少32字符）${NC}"
    exit 1
fi

if [ ${#NEXTAUTH_SECRET} -lt 32 ]; then
    echo -e "${RED}❌ NEXTAUTH_SECRET 长度不足（至少32字符）${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 配置验证通过${NC}"
echo ""

# 询问部署选项
echo "📋 部署选项："
echo "  1. 基础部署（应用 + 数据库）"
echo "  2. 完整部署（应用 + 数据库 + Nginx + Redis）"
echo ""
read -p "请选择部署选项 (1/2): " -n 1 -r
echo

COMPOSE_PROFILES=""
if [[ $REPLY == "2" ]]; then
    COMPOSE_PROFILES="--profile with-nginx --profile with-redis"
    echo -e "${BLUE}将部署完整环境${NC}"
else
    echo -e "${BLUE}将部署基础环境${NC}"
fi

echo ""

# 停止现有服务
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo -e "${YELLOW}⚠️  检测到运行中的服务${NC}"
    read -p "是否停止现有服务？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🛑 停止现有服务..."
        docker-compose -f docker-compose.prod.yml down
    fi
fi

# 备份数据库（如果存在）
if docker volume ls | grep -q "wylm_postgres_data"; then
    echo ""
    read -p "是否备份现有数据库？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "💾 备份数据库..."
        mkdir -p backups
        BACKUP_FILE="backups/backup_$(date +%Y%m%d_%H%M%S).sql"
        docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U wylm wylm > "$BACKUP_FILE" 2>/dev/null || true
        if [ -f "$BACKUP_FILE" ]; then
            echo -e "${GREEN}✅ 备份完成: $BACKUP_FILE${NC}"
        fi
    fi
fi

echo ""
echo "📦 构建 Docker 镜像..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo ""
echo "🚀 启动服务..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d $COMPOSE_PROFILES

echo ""
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo ""
echo "🔍 检查服务状态..."
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo -e "${GREEN}✅ 服务启动成功！${NC}"
    echo ""
    echo "📊 服务状态："
    docker-compose -f docker-compose.prod.yml ps
    echo ""
    echo "🌐 访问信息："
    echo "  - 应用地址: ${SITE_URL:-http://localhost:3000}"
    echo "  - 默认管理员: 13800138000 / Admin123456"
    echo ""
    echo "📝 常用命令："
    echo "  - 查看日志: docker-compose -f docker-compose.prod.yml logs -f app"
    echo "  - 停止服务: docker-compose -f docker-compose.prod.yml down"
    echo "  - 重启服务: docker-compose -f docker-compose.prod.yml restart"
    echo ""
    echo -e "${YELLOW}⚠️  重要提示：${NC}"
    echo "  1. 请立即修改默认管理员密码"
    echo "  2. 配置 HTTPS（推荐使用 Nginx + Let's Encrypt）"
    echo "  3. 定期备份数据库"
    echo "  4. 监控服务运行状态"
else
    echo -e "${RED}❌ 服务启动失败${NC}"
    echo ""
    echo "查看错误日志："
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi
