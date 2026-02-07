#!/bin/bash

# 监控脚本
# 检查服务健康状态并发送告警

set -e

# 配置
HEALTH_URL="http://localhost:3000/api/health"
LOG_FILE="./logs/monitor.log"
ALERT_EMAIL=""  # 设置告警邮箱

# 颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 创建日志目录
mkdir -p ./logs

# 记录日志
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 发送告警
send_alert() {
    local message="$1"
    log "⚠️  ALERT: $message"

    # 如果配置了邮箱，发送邮件告警
    if [ -n "$ALERT_EMAIL" ]; then
        echo "$message" | mail -s "WYLM Alert" "$ALERT_EMAIL" 2>/dev/null || true
    fi
}

# 检查应用健康
check_app_health() {
    if curl -f -s "$HEALTH_URL" > /dev/null 2>&1; then
        log "✅ 应用健康检查通过"
        return 0
    else
        send_alert "应用健康检查失败"
        return 1
    fi
}

# 检查容器状态
check_containers() {
    local failed=0

    # 检查应用容器
    if ! docker-compose ps | grep -q "app.*Up"; then
        send_alert "应用容器未运行"
        failed=1
    fi

    # 检查数据库容器
    if ! docker-compose ps | grep -q "postgres.*Up"; then
        send_alert "数据库容器未运行"
        failed=1
    fi

    if [ $failed -eq 0 ]; then
        log "✅ 容器状态检查通过"
    fi

    return $failed
}

# 检查磁盘空间
check_disk_space() {
    local usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

    if [ "$usage" -gt 90 ]; then
        send_alert "磁盘空间不足: ${usage}%"
        return 1
    elif [ "$usage" -gt 80 ]; then
        log "⚠️  磁盘空间警告: ${usage}%"
    else
        log "✅ 磁盘空间充足: ${usage}%"
    fi

    return 0
}

# 检查内存使用
check_memory() {
    local usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')

    if [ "$usage" -gt 90 ]; then
        send_alert "内存使用过高: ${usage}%"
        return 1
    elif [ "$usage" -gt 80 ]; then
        log "⚠️  内存使用警告: ${usage}%"
    else
        log "✅ 内存使用正常: ${usage}%"
    fi

    return 0
}

# 主函数
main() {
    log "========== 开始监控检查 =========="

    local failed=0

    # 执行各项检查
    check_containers || failed=1
    check_app_health || failed=1
    check_disk_space || failed=1
    check_memory || failed=1

    if [ $failed -eq 0 ]; then
        log "========== 所有检查通过 =========="
    else
        log "========== 检查发现问题 =========="
    fi

    echo ""
}

# 运行监控
main
