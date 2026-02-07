#!/bin/bash

# 环境检查脚本
# 检查系统是否满足 Docker 部署要求

set -e

# 颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 WYLM 环境检查${NC}"
echo "===================="
echo ""

PASSED=0
FAILED=0
WARNINGS=0

# 检查函数
check_command() {
    local cmd=$1
    local name=$2
    local required=$3

    if command -v $cmd &> /dev/null; then
        local version=$($cmd --version 2>&1 | head -1)
        echo -e "${GREEN}✓${NC} $name: $version"
        ((PASSED++))
        return 0
    else
        if [ "$required" = "true" ]; then
            echo -e "${RED}✗${NC} $name: 未安装（必需）"
            ((FAILED++))
        else
            echo -e "${YELLOW}⚠${NC} $name: 未安装（可选）"
            ((WARNINGS++))
        fi
        return 1
    fi
}

check_port() {
    local port=$1
    local name=$2

    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠${NC} 端口 $port ($name): 已被占用"
        ((WARNINGS++))
        return 1
    else
        echo -e "${GREEN}✓${NC} 端口 $port ($name): 可用"
        ((PASSED++))
        return 0
    fi
}

check_disk_space() {
    local required_gb=$1
    local available=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')

    if [ "$available" -ge "$required_gb" ]; then
        echo -e "${GREEN}✓${NC} 磁盘空间: ${available}GB 可用"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} 磁盘空间: ${available}GB 可用（建议至少 ${required_gb}GB）"
        ((FAILED++))
        return 1
    fi
}

check_memory() {
    local required_gb=$1
    local total=$(free -g | awk 'NR==2 {print $2}')

    if [ "$total" -ge "$required_gb" ]; then
        echo -e "${GREEN}✓${NC} 内存: ${total}GB"
        ((PASSED++))
        return 0
    else
        echo -e "${YELLOW}⚠${NC} 内存: ${total}GB（建议至少 ${required_gb}GB）"
        ((WARNINGS++))
        return 1
    fi
}

echo "📦 检查必需软件..."
check_command "docker" "Docker" "true"
check_command "docker-compose" "Docker Compose" "true"
check_command "node" "Node.js" "true"
check_command "npm" "npm" "true"

echo ""
echo "🔧 检查可选工具..."
check_command "git" "Git" "false"
check_command "curl" "curl" "false"
check_command "make" "Make" "false"

echo ""
echo "🌐 检查端口..."
check_port 3000 "应用"
check_port 5432 "PostgreSQL"
check_port 80 "HTTP"
check_port 443 "HTTPS"
check_port 5555 "Prisma Studio"

echo ""
echo "💾 检查系统资源..."
check_disk_space 10
if command -v free &> /dev/null; then
    check_memory 2
else
    echo -e "${YELLOW}⚠${NC} 无法检查内存（非 Linux 系统）"
    ((WARNINGS++))
fi

echo ""
echo "📁 检查项目文件..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json 存在"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} package.json 不存在"
    ((FAILED++))
fi

if [ -f "prisma/schema.prisma" ]; then
    echo -e "${GREEN}✓${NC} Prisma schema 存在"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Prisma schema 不存在"
    ((FAILED++))
fi

if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC} .env.example 存在"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} .env.example 不存在"
    ((WARNINGS++))
fi

echo ""
echo "===================="
echo -e "${BLUE}检查结果:${NC}"
echo -e "${GREEN}通过: $PASSED${NC}"
echo -e "${YELLOW}警告: $WARNINGS${NC}"
echo -e "${RED}失败: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ 环境检查通过！可以开始部署${NC}"
    echo ""
    echo "下一步:"
    echo "  1. 运行 ./start.sh 选择启动模式"
    echo "  2. 或运行 make help 查看所有命令"
    exit 0
else
    echo -e "${RED}❌ 环境检查失败，请先安装必需的软件${NC}"
    echo ""
    echo "安装指南:"
    echo "  Docker: https://docs.docker.com/get-docker/"
    echo "  Docker Compose: https://docs.docker.com/compose/install/"
    echo "  Node.js: https://nodejs.org/"
    exit 1
fi
