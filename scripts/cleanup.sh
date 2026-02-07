#!/bin/bash

# 清理脚本
# 清理 Docker 资源和临时文件

set -e

# 颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

show_menu() {
    clear
    echo -e "${BLUE}🧹 WYLM 清理工具${NC}"
    echo "===================="
    echo ""
    echo "1. 清理容器和网络（保留数据）"
    echo "2. 清理所有（包括数据卷）"
    echo "3. 清理 Docker 系统（未使用的镜像、容器等）"
    echo "4. 清理日志文件"
    echo "5. 清理备份文件（保留最近 7 天）"
    echo "6. 清理 node_modules"
    echo "7. 清理 .next 构建文件"
    echo "8. 完全清理（所有选项）"
    echo "9. 返回"
    echo ""
}

clean_containers() {
    echo -e "${YELLOW}清理容器和网络...${NC}"
    docker-compose down 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    echo -e "${GREEN}✅ 容器和网络已清理${NC}"
}

clean_all() {
    echo -e "${RED}⚠️  警告：这将删除所有数据！${NC}"
    read -p "确认删除所有数据？(yes/no): " confirm

    if [ "$confirm" = "yes" ]; then
        echo -e "${YELLOW}清理所有...${NC}"
        docker-compose down -v 2>/dev/null || true
        docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
        docker-compose -f docker-compose.prod.yml down -v 2>/dev/null || true
        echo -e "${GREEN}✅ 所有数据已清理${NC}"
    else
        echo "已取消"
    fi
}

clean_docker_system() {
    echo -e "${YELLOW}清理 Docker 系统...${NC}"
    docker system prune -f
    echo -e "${GREEN}✅ Docker 系统已清理${NC}"
}

clean_logs() {
    echo -e "${YELLOW}清理日志文件...${NC}"
    if [ -d "logs" ]; then
        rm -rf logs/*
        echo -e "${GREEN}✅ 日志文件已清理${NC}"
    else
        echo "无日志文件"
    fi
}

clean_backups() {
    echo -e "${YELLOW}清理旧备份（保留最近 7 天）...${NC}"
    if [ -d "backups" ]; then
        find backups -name "*.sql.gz" -mtime +7 -delete
        local count=$(find backups -name "*.sql.gz" | wc -l)
        echo -e "${GREEN}✅ 旧备份已清理，剩余 $count 个备份${NC}"
    else
        echo "无备份文件"
    fi
}

clean_node_modules() {
    echo -e "${YELLOW}清理 node_modules...${NC}"
    if [ -d "node_modules" ]; then
        rm -rf node_modules
        echo -e "${GREEN}✅ node_modules 已清理${NC}"
        echo "运行 npm install 重新安装依赖"
    else
        echo "node_modules 不存在"
    fi
}

clean_next() {
    echo -e "${YELLOW}清理 .next 构建文件...${NC}"
    if [ -d ".next" ]; then
        rm -rf .next
        echo -e "${GREEN}✅ .next 已清理${NC}"
    else
        echo ".next 不存在"
    fi
}

clean_complete() {
    echo -e "${RED}⚠️  警告：这将执行完全清理！${NC}"
    read -p "确认执行完全清理？(yes/no): " confirm

    if [ "$confirm" = "yes" ]; then
        clean_containers
        clean_docker_system
        clean_logs
        clean_backups
        clean_next
        echo ""
        echo -e "${GREEN}✅ 完全清理完成${NC}"
    else
        echo "已取消"
    fi
}

while true; do
    show_menu
    read -p "请选择 (1-9): " choice
    echo ""

    case $choice in
        1) clean_containers ;;
        2) clean_all ;;
        3) clean_docker_system ;;
        4) clean_logs ;;
        5) clean_backups ;;
        6) clean_node_modules ;;
        7) clean_next ;;
        8) clean_complete ;;
        9) exit 0 ;;
        *)
            echo -e "${RED}无效选择${NC}"
            sleep 1
            ;;
    esac

    echo ""
    read -p "按 Enter 继续..."
done
