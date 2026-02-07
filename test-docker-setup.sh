#!/bin/bash

# 测试脚本 - 验证 Docker 部署配置
# 用于检查所有文件是否正确创建

set -e

# 颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Docker 部署配置测试${NC}"
echo "=========================="
echo ""

PASSED=0
FAILED=0

# 测试函数
test_file() {
    local file=$1
    local desc=$2

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $desc"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $desc (文件不存在: $file)"
        ((FAILED++))
    fi
}

test_executable() {
    local file=$1
    local desc=$2

    if [ -x "$file" ]; then
        echo -e "${GREEN}✓${NC} $desc"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $desc (文件不可执行: $file)"
        ((FAILED++))
    fi
}

echo "📦 测试 Docker 配置文件..."
test_file "Dockerfile" "Dockerfile"
test_file "docker-compose.yml" "基础生产配置"
test_file "docker-compose.dev.yml" "开发环境配置"
test_file "docker-compose.prod.yml" "完整生产配置"
test_file ".dockerignore" "Docker 忽略文件"
test_executable "docker-entrypoint.sh" "容器启动脚本"

echo ""
echo "🚀 测试部署脚本..."
test_executable "deploy.sh" "简单部署脚本"
test_executable "deploy-prod.sh" "完整部署脚本"
test_executable "dev.sh" "开发环境脚本"
test_executable "start.sh" "交互式启动脚本"

echo ""
echo "🛠️  测试管理脚本..."
test_executable "scripts/backup.sh" "备份脚本"
test_executable "scripts/restore.sh" "恢复脚本"
test_executable "scripts/monitor.sh" "监控脚本"
test_executable "scripts/logs.sh" "日志查看器"
test_executable "scripts/benchmark.sh" "性能测试"
test_executable "scripts/db-manager.sh" "数据库管理"
test_file "scripts/crontab.example" "定时任务示例"

echo ""
echo "🌐 测试 Nginx 配置..."
test_file "nginx/nginx.conf" "Nginx 主配置"
test_file "nginx/conf.d/wylm.conf" "站点配置"

echo ""
echo "📚 测试文档..."
test_file "DOCKER_README.md" "快速指南"
test_file "DOCKER_QUICKSTART.md" "快速参考"
test_file "DOCKER_STRUCTURE.md" "项目结构"
test_file "DOCKER_SETUP_COMPLETE.md" "部署总结"
test_file "docs/DOCKER_DEPLOYMENT.md" "完整文档"

echo ""
echo "🔧 测试工具和配置..."
test_file "Makefile" "Makefile"
test_file ".env.docker" "环境变量模板"
test_file ".env.prod.example" "生产配置示例"
test_file "src/app/api/health/route.ts" "健康检查 API"

echo ""
echo "=========================="
echo -e "${BLUE}测试结果:${NC}"
echo -e "${GREEN}通过: $PASSED${NC}"
echo -e "${RED}失败: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ 所有测试通过！${NC}"
    echo ""
    echo "🎉 Docker 部署配置已完整创建"
    echo ""
    echo "下一步:"
    echo "  1. 运行 ./start.sh 选择启动模式"
    echo "  2. 或运行 make help 查看所有命令"
    echo "  3. 查看 DOCKER_README.md 了解详细信息"
    exit 0
else
    echo -e "${RED}❌ 有 $FAILED 个测试失败${NC}"
    exit 1
fi
