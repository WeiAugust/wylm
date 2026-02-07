#!/bin/bash

# 日志查看脚本
# 提供友好的日志查看界面

set -e

# 颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

show_menu() {
    clear
    echo -e "${BLUE}📋 WYLM 日志查看器${NC}"
    echo "===================="
    echo ""
    echo "1. 应用日志（实时）"
    echo "2. 数据库日志（实时）"
    echo "3. 所有日志（实时）"
    echo "4. 应用日志（最近 100 行）"
    echo "5. 数据库日志（最近 100 行）"
    echo "6. 错误日志（grep ERROR）"
    echo "7. 访问日志（Nginx）"
    echo "8. 返回"
    echo ""
}

while true; do
    show_menu
    read -p "请选择 (1-8): " choice
    echo ""

    case $choice in
        1)
            echo -e "${GREEN}查看应用实时日志（Ctrl+C 退出）${NC}"
            docker-compose logs -f app
            ;;
        2)
            echo -e "${GREEN}查看数据库实时日志（Ctrl+C 退出）${NC}"
            docker-compose logs -f postgres
            ;;
        3)
            echo -e "${GREEN}查看所有实时日志（Ctrl+C 退出）${NC}"
            docker-compose logs -f
            ;;
        4)
            echo -e "${GREEN}应用日志（最近 100 行）${NC}"
            docker-compose logs --tail=100 app
            read -p "按 Enter 继续..."
            ;;
        5)
            echo -e "${GREEN}数据库日志（最近 100 行）${NC}"
            docker-compose logs --tail=100 postgres
            read -p "按 Enter 继续..."
            ;;
        6)
            echo -e "${RED}错误日志${NC}"
            docker-compose logs | grep -i error | tail -50
            read -p "按 Enter 继续..."
            ;;
        7)
            if docker-compose ps | grep -q "nginx"; then
                echo -e "${GREEN}Nginx 访问日志${NC}"
                docker-compose exec nginx tail -50 /var/log/nginx/wylm_access.log
            else
                echo -e "${YELLOW}Nginx 未运行${NC}"
            fi
            read -p "按 Enter 继续..."
            ;;
        8)
            exit 0
            ;;
        *)
            echo -e "${RED}无效选择${NC}"
            sleep 1
            ;;
    esac
done
