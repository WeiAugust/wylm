#!/bin/bash

# 数据库管理脚本
# 提供数据库常用操作的快捷方式

set -e

# 颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

show_menu() {
    clear
    echo -e "${BLUE}🗄️  WYLM 数据库管理${NC}"
    echo "===================="
    echo ""
    echo "1. 进入数据库 Shell"
    echo "2. 查看数据库大小"
    echo "3. 查看表列表"
    echo "4. 查看表数据统计"
    echo "5. 运行 Prisma Studio"
    echo "6. 运行数据库迁移"
    echo "7. 重置数据库（危险！）"
    echo "8. 备份数据库"
    echo "9. 恢复数据库"
    echo "10. 返回"
    echo ""
}

db_shell() {
    echo -e "${GREEN}进入数据库 Shell...${NC}"
    docker-compose exec postgres psql -U wylm -d wylm
}

db_size() {
    echo -e "${GREEN}数据库大小:${NC}"
    docker-compose exec postgres psql -U wylm -d wylm -c "
        SELECT
            pg_size_pretty(pg_database_size('wylm')) as database_size;
    "
    read -p "按 Enter 继续..."
}

list_tables() {
    echo -e "${GREEN}表列表:${NC}"
    docker-compose exec postgres psql -U wylm -d wylm -c "
        SELECT
            schemaname,
            tablename,
            pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
        FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
    "
    read -p "按 Enter 继续..."
}

table_stats() {
    echo -e "${GREEN}表数据统计:${NC}"
    docker-compose exec postgres psql -U wylm -d wylm -c "
        SELECT
            'users' as table_name, COUNT(*) as count FROM users
        UNION ALL
        SELECT 'posts', COUNT(*) FROM posts
        UNION ALL
        SELECT 'photos', COUNT(*) FROM photos
        UNION ALL
        SELECT 'products', COUNT(*) FROM products
        UNION ALL
        SELECT 'comments', COUNT(*) FROM comments
        UNION ALL
        SELECT 'orders', COUNT(*) FROM orders;
    "
    read -p "按 Enter 继续..."
}

prisma_studio() {
    echo -e "${GREEN}启动 Prisma Studio...${NC}"
    echo "访问: http://localhost:5555"
    docker-compose exec app npx prisma studio
}

run_migration() {
    echo -e "${GREEN}运行数据库迁移...${NC}"
    docker-compose exec app npx prisma migrate deploy
    echo -e "${GREEN}✅ 迁移完成${NC}"
    read -p "按 Enter 继续..."
}

reset_db() {
    echo -e "${RED}⚠️  警告：这将删除所有数据！${NC}"
    read -p "确认重置数据库？(yes/no): " confirm

    if [ "$confirm" = "yes" ]; then
        echo -e "${YELLOW}重置数据库...${NC}"
        docker-compose exec app npx prisma migrate reset --force
        echo -e "${GREEN}✅ 数据库已重置${NC}"
    else
        echo "已取消"
    fi
    read -p "按 Enter 继续..."
}

backup_db() {
    ./scripts/backup.sh
    read -p "按 Enter 继续..."
}

restore_db() {
    echo -e "${GREEN}可用的备份文件:${NC}"
    ls -lh backups/wylm_backup_*.sql.gz 2>/dev/null || echo "无备份文件"
    echo ""
    read -p "输入备份文件路径: " backup_file

    if [ -n "$backup_file" ]; then
        ./scripts/restore.sh "$backup_file"
    fi
    read -p "按 Enter 继续..."
}

while true; do
    show_menu
    read -p "请选择 (1-10): " choice
    echo ""

    case $choice in
        1) db_shell ;;
        2) db_size ;;
        3) list_tables ;;
        4) table_stats ;;
        5) prisma_studio ;;
        6) run_migration ;;
        7) reset_db ;;
        8) backup_db ;;
        9) restore_db ;;
        10) exit 0 ;;
        *)
            echo -e "${RED}无效选择${NC}"
            sleep 1
            ;;
    esac
done
