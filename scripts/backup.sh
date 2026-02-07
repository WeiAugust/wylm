#!/bin/bash

# 数据库备份脚本
# 用于定期备份 PostgreSQL 数据库

set -e

# 配置
BACKUP_DIR="./backups"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/wylm_backup_$TIMESTAMP.sql"

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "💾 WYLM 数据库备份脚本"
echo "======================"
echo ""

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 检查 Docker 容器是否运行
if ! docker-compose ps | grep -q "postgres.*Up"; then
    echo -e "${RED}❌ PostgreSQL 容器未运行${NC}"
    exit 1
fi

echo "📦 开始备份数据库..."
echo "备份文件: $BACKUP_FILE"

# 执行备份
if docker-compose exec -T postgres pg_dump -U wylm wylm > "$BACKUP_FILE"; then
    # 压缩备份文件
    gzip "$BACKUP_FILE"
    BACKUP_FILE="$BACKUP_FILE.gz"

    # 获取文件大小
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

    echo -e "${GREEN}✅ 备份成功${NC}"
    echo "文件: $BACKUP_FILE"
    echo "大小: $SIZE"
else
    echo -e "${RED}❌ 备份失败${NC}"
    exit 1
fi

# 清理旧备份
echo ""
echo "🧹 清理旧备份（保留 $RETENTION_DAYS 天）..."
find "$BACKUP_DIR" -name "wylm_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
REMAINING=$(find "$BACKUP_DIR" -name "wylm_backup_*.sql.gz" | wc -l)
echo -e "${GREEN}✅ 清理完成，剩余 $REMAINING 个备份文件${NC}"

# 列出所有备份
echo ""
echo "📋 现有备份文件："
ls -lh "$BACKUP_DIR"/wylm_backup_*.sql.gz 2>/dev/null || echo "无备份文件"

echo ""
echo -e "${GREEN}✅ 备份任务完成${NC}"
