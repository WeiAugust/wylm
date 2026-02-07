#!/bin/bash

# 快速启动脚本
# 根据不同场景快速启动服务

set -e

# 颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

show_menu() {
    echo -e "${BLUE}🚀 WYLM 快速启动菜单${NC}"
    echo "===================="
    echo ""
    echo "1. 开发环境（仅数据库）"
    echo "2. 生产环境（基础）"
    echo "3. 生产环境（完整：含 Nginx + Redis）"
    echo "4. 停止所有服务"
    echo "5. 查看服务状态"
    echo "6. 查看日志"
    echo "7. 数据库备份"
    echo "8. 退出"
    echo ""
}

start_dev() {
    echo -e "${GREEN}启动开发环境...${NC}"
    docker-compose -f docker-compose.dev.yml up -d
    echo ""
    echo "✅ 开发环境已启动"
    echo "数据库: localhost:5432"
    echo "Prisma Studio: http://localhost:5555"
    echo ""
    echo "运行以下命令启动开发服务器:"
    echo "  npm run dev"
}

start_prod_basic() {
    echo -e "${GREEN}启动生产环境（基础）...${NC}"
    docker-compose up -d
    echo ""
    echo "✅ 生产环境已启动"
    echo "应用: http://localhost:3000"
}

start_prod_full() {
    echo -e "${GREEN}启动生产环境（完整）...${NC}"
    docker-compose -f docker-compose.prod.yml --profile with-nginx --profile with-redis up -d
    echo ""
    echo "✅ 生产环境已启动"
    echo "应用: http://localhost"
    echo "Nginx: http://localhost:80"
}

stop_all() {
    echo -e "${YELLOW}停止所有服务...${NC}"
    docker-compose down 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    echo "✅ 所有服务已停止"
}

show_status() {
    echo -e "${BLUE}服务状态:${NC}"
    echo ""
    echo "开发环境:"
    docker-compose -f docker-compose.dev.yml ps 2>/dev/null || echo "未运行"
    echo ""
    echo "生产环境:"
    docker-compose ps 2>/dev/null || echo "未运行"
}

show_logs() {
    echo "选择要查看的日志:"
    echo "1. 应用日志"
    echo "2. 数据库日志"
    echo "3. 所有日志"
    read -p "请选择 (1-3): " choice

    case $choice in
        1) docker-compose logs -f app ;;
        2) docker-compose logs -f postgres ;;
        3) docker-compose logs -f ;;
        *) echo "无效选择" ;;
    esac
}

backup_db() {
    echo -e "${GREEN}执行数据库备份...${NC}"
    ./scripts/backup.sh
}

# 主循环
while true; do
    show_menu
    read -p "请选择操作 (1-8): " choice
    echo ""

    case $choice in
        1) start_dev ;;
        2) start_prod_basic ;;
        3) start_prod_full ;;
        4) stop_all ;;
        5) show_status ;;
        6) show_logs ;;
        7) backup_db ;;
        8) echo "再见！"; exit 0 ;;
        *) echo -e "${YELLOW}无效选择，请重试${NC}" ;;
    esac

    echo ""
    read -p "按 Enter 继续..."
    clear
done
