#!/bin/bash

# 数据库恢复脚本
# 用于从备份文件恢复数据库

set -e

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🔄 WYLM 数据库恢复脚本"
echo "======================"
echo ""

# 检查参数
if [ -z "$1" ]; then
    echo -e "${YELLOW}用法: $0 <backup_file>${NC}"
    echo ""
    echo "可用的备份文件："
    ls -lh backups/wylm_backup_*.sql.gz 2>/dev/null || echo "无备份文件"
    exit 1
fi

BACKUP_FILE="$1"

# 检查备份文件是否存在
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ 备份文件不存在: $BACKUP_FILE${NC}"
    exit 1
fi

echo -e "${BLUE}备份文件: $BACKUP_FILE${NC}"
echo ""

# 警告提示
echo -e "${RED}⚠️  警告：恢复数据库将覆盖现有数据！${NC}"
read -p "确认恢复？(yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "已取消"
    exit 0
fi

# 检查 Docker 容器是否运行
if ! docker-compose ps | grep -q "postgres.*Up"; then
    echo -e "${RED}❌ PostgreSQL 容器未运行${NC}"
    exit 1
fi

echo ""
echo "📦 准备恢复数据库..."

# 解压备份文件（如果是压缩的）
TEMP_FILE="$BACKUP_FILE"
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "解压备份文件..."
    TEMP_FILE="${BACKUP_FILE%.gz}"
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
fi

# 停止应用容器
echo "🛑 停止应用容器..."
docker-compose stop app

# 恢复数据库
echo "🔄 恢复数据库..."
if docker-compose exec -T postgres psql -U wylm -d wylm < "$TEMP_FILE"; then
    echo -e "${GREEN}✅ 恢复成功${NC}"
else
    echo -e "${RED}❌ 恢复失败${NC}"

    # 清理临时文件
    if [[ "$BACKUP_FILE" == *.gz ]]; then
        rm -f "$TEMP_FILE"
    fi

    exit 1
fi

# 清理临时文件
if [[ "$BACKUP_FILE" == *.gz ]]; then
    rm -f "$TEMP_FILE"
fi

# 启动应用容器
echo "🚀 启动应用容器..."
docker-compose start app

echo ""
echo -e "${GREEN}✅ 数据库恢复完成${NC}"
