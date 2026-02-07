#!/bin/bash

# 性能测试脚本
# 测试应用性能和响应时间

set -e

# 颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

BASE_URL="${1:-http://localhost:3000}"
REQUESTS="${2:-100}"

echo -e "${BLUE}🚀 WYLM 性能测试${NC}"
echo "===================="
echo ""
echo "目标: $BASE_URL"
echo "请求数: $REQUESTS"
echo ""

# 检查是否安装了 ab (Apache Bench)
if ! command -v ab &> /dev/null; then
    echo -e "${YELLOW}⚠️  未安装 Apache Bench (ab)${NC}"
    echo "安装方法:"
    echo "  Ubuntu/Debian: sudo apt-get install apache2-utils"
    echo "  macOS: brew install httpd"
    exit 1
fi

# 测试首页
echo -e "${GREEN}测试首页...${NC}"
ab -n $REQUESTS -c 10 "$BASE_URL/" 2>/dev/null | grep -E "Requests per second|Time per request|Failed requests"

echo ""

# 测试 API
echo -e "${GREEN}测试健康检查 API...${NC}"
ab -n $REQUESTS -c 10 "$BASE_URL/api/health" 2>/dev/null | grep -E "Requests per second|Time per request|Failed requests"

echo ""

# 测试博客列表
echo -e "${GREEN}测试博客列表 API...${NC}"
ab -n $REQUESTS -c 10 "$BASE_URL/api/blog/posts" 2>/dev/null | grep -E "Requests per second|Time per request|Failed requests"

echo ""
echo -e "${GREEN}✅ 性能测试完成${NC}"
