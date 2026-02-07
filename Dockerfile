# 多阶段构建 Dockerfile
FROM node:latest AS base

# 安装依赖阶段
FROM base AS deps
RUN apt-get update && apt-get install -y --no-install-recommends netcat-openbsd postgresql-client && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json* ./
RUN npm ci

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY .env.docker .env
COPY prisma ./prisma

# 生成 Prisma Client
RUN npx prisma generate

# 复制剩余源文件
COPY . .

# 构建 Next.js 应用
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 生产运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 安装 tsx 用于运行 seed 脚本
RUN npm install -g tsx

# 复制必要文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env* ./
COPY --from=builder /app/prisma.config.ts ./
COPY --from=deps /bin/nc /bin/nc

# 复制 node_modules 并设置权限
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制启动脚本
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
