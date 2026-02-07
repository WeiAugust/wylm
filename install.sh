#!/bin/bash

# 一键安装脚本
# 自动安装所有依赖并初始化项目

set -e

# 颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 WYLM 一键安装脚本${NC}"
echo "========================="
echo ""

# 检查环境
echo "🔍 检查环境..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker 未安装${NC}"
    echo "请访问 https://docs.docker.com/get-docker/ 安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose 未安装${NC}"
    echo "请访问 https://docs.docker.com/compose/install/ 安装 Docker Compose"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    echo "请访问 https://nodejs.org/ 安装 Node.js"
    exit 1
fi

echo -e "${GREEN}✅ 环境检查通过${NC}"
echo ""

# 安装 npm 依赖
echo "📦 安装 npm 依赖..."
npm install

echo ""

# 配置环境变量
if [ ! -f ".env" ]; then
    echo "⚙️  配置环境变量..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ 已创建 .env 文件${NC}"
        echo -e "${YELLOW}⚠️  请编辑 .env 文件配置数据库连接${NC}"
    else
        echo -e "${YELLOW}⚠️  .env.example 不存在${NC}"
    fi
else
    echo -e "${GREEN}✅ .env 文件已存在${NC}"
fi

echo ""

# 询问是否启动开发环境
read -p "是否启动开发环境？(y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 启动开发环境..."
    ./dev.sh

    echo ""
    echo -e "${GREEN}✅ 安装完成！${NC}"
    echo ""
    echo "下一步："
    echo "  1. 编辑 .env 文件配置数据库连接"
    echo "  2. 运行 npm run dev 启动开发服务器"
    echo "  3. 访问 http://localhost:3000"
else
    echo ""
    echo -e "${GREEN}✅ 安装完成！${NC}"
    echo ""
    echo "下一步："
    echo "  1. 编辑 .env 文件配置数据库连接"
    echo "  2. 运行 ./dev.sh 启动开发环境"
    echo "  3. 运行 npm run dev 启动开发服务器"
    echo "  4. 访问 http://localhost:3000"
fi
