# Makefile for WYLM Docker Deployment
# 简化 Docker 命令操作

.PHONY: help build up down restart logs ps clean dev dev-down prod-build prod-up prod-down backup restore

# 默认目标
.DEFAULT_GOAL := help

# 颜色定义
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

help: ## 显示帮助信息
	@echo "$(BLUE)WYLM Docker 部署命令$(NC)"
	@echo "======================="
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# 开发环境命令
dev: ## 启动开发环境（仅数据库）
	@echo "$(BLUE)启动开发环境...$(NC)"
	docker-compose -f docker-compose.dev.yml up -d
	@echo "$(GREEN)✅ 开发环境已启动$(NC)"
	@echo "数据库: localhost:5432"
	@echo "Prisma Studio: http://localhost:5555"

dev-down: ## 停止开发环境
	@echo "$(BLUE)停止开发环境...$(NC)"
	docker-compose -f docker-compose.dev.yml down
	@echo "$(GREEN)✅ 开发环境已停止$(NC)"

dev-logs: ## 查看开发环境日志
	docker-compose -f docker-compose.dev.yml logs -f

# 生产环境命令
build: ## 构建生产镜像
	@echo "$(BLUE)构建生产镜像...$(NC)"
	docker-compose build --no-cache
	@echo "$(GREEN)✅ 镜像构建完成$(NC)"

up: ## 启动生产环境
	@echo "$(BLUE)启动生产环境...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✅ 生产环境已启动$(NC)"
	@echo "应用: http://localhost:3000"

down: ## 停止生产环境
	@echo "$(BLUE)停止生产环境...$(NC)"
	docker-compose down
	@echo "$(GREEN)✅ 生产环境已停止$(NC)"

restart: ## 重启生产环境
	@echo "$(BLUE)重启生产环境...$(NC)"
	docker-compose restart
	@echo "$(GREEN)✅ 生产环境已重启$(NC)"

logs: ## 查看生产环境日志
	docker-compose logs -f app

logs-db: ## 查看数据库日志
	docker-compose logs -f postgres

ps: ## 查看容器状态
	docker-compose ps

# 数据库操作
db-migrate: ## 运行数据库迁移
	@echo "$(BLUE)运行数据库迁移...$(NC)"
	docker-compose exec app npx prisma migrate deploy
	@echo "$(GREEN)✅ 迁移完成$(NC)"

db-seed: ## 初始化数据库数据
	@echo "$(BLUE)初始化数据库...$(NC)"
	docker-compose exec app npx prisma db seed
	@echo "$(GREEN)✅ 数据初始化完成$(NC)"

db-studio: ## 打开 Prisma Studio
	@echo "$(BLUE)启动 Prisma Studio...$(NC)"
	docker-compose exec app npx prisma studio

db-shell: ## 进入数据库 Shell
	docker-compose exec postgres psql -U wylm -d wylm

# 备份和恢复
backup: ## 备份数据库
	@echo "$(BLUE)备份数据库...$(NC)"
	@mkdir -p backups
	docker-compose exec postgres pg_dump -U wylm wylm > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✅ 备份完成: backups/backup_$$(date +%Y%m%d_%H%M%S).sql$(NC)"

restore: ## 恢复数据库（需要指定文件: make restore FILE=backup.sql）
	@if [ -z "$(FILE)" ]; then \
		echo "$(YELLOW)请指定备份文件: make restore FILE=backup.sql$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)恢复数据库...$(NC)"
	docker-compose exec -T postgres psql -U wylm -d wylm < $(FILE)
	@echo "$(GREEN)✅ 恢复完成$(NC)"

# 清理命令
clean: ## 清理容器和网络（保留数据）
	@echo "$(YELLOW)⚠️  清理容器和网络...$(NC)"
	docker-compose down
	@echo "$(GREEN)✅ 清理完成$(NC)"

clean-all: ## 清理所有（包括数据卷）
	@echo "$(YELLOW)⚠️  警告：这将删除所有数据！$(NC)"
	@read -p "确认删除所有数据？(yes/no): " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		docker-compose down -v; \
		echo "$(GREEN)✅ 清理完成$(NC)"; \
	else \
		echo "$(BLUE)已取消$(NC)"; \
	fi

# 快捷命令
shell: ## 进入应用容器 Shell
	docker-compose exec app sh

install: ## 安装依赖（在容器内）
	docker-compose exec app npm install

# 部署命令
deploy: build up ## 完整部署（构建+启动）
	@echo "$(GREEN)✅ 部署完成$(NC)"
	@echo "应用: http://localhost:3000"
	@echo "默认账号: 13800138000 / Admin123456"

update: ## 更新应用（拉取代码+重新构建+重启）
	@echo "$(BLUE)更新应用...$(NC)"
	git pull
	docker-compose build --no-cache app
	docker-compose up -d app
	@echo "$(GREEN)✅ 更新完成$(NC)"

# 监控命令
stats: ## 查看容器资源使用
	docker stats wylm-app wylm-postgres

health: ## 检查服务健康状态
	@echo "$(BLUE)检查服务状态...$(NC)"
	@docker-compose ps
	@echo ""
	@echo "$(BLUE)检查应用健康...$(NC)"
	@curl -f http://localhost:3000 > /dev/null 2>&1 && echo "$(GREEN)✅ 应用正常$(NC)" || echo "$(YELLOW)⚠️  应用异常$(NC)"
	@echo ""
	@echo "$(BLUE)检查数据库健康...$(NC)"
	@docker-compose exec postgres pg_isready -U wylm > /dev/null 2>&1 && echo "$(GREEN)✅ 数据库正常$(NC)" || echo "$(YELLOW)⚠️  数据库异常$(NC)"
