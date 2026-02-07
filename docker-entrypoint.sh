#!/bin/sh
set -e

echo "🚀 Starting WYLM application..."

# 等待数据库就绪
echo "⏳ Waiting for database to be ready..."
until nc -z postgres 5432 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# 加载环境变量
set -a
. /app/.env
set +a

# 检查是否需要初始化数据库
echo "🔄 Checking database initialization..."
TABLE_COUNT=$(PGPASSWORD="$POSTGRES_PASSWORD" psql -h postgres -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null || echo "0")

if [ "$TABLE_COUNT" -eq 0 ] || [ "$TABLE_COUNT" -lt 10 ]; then
  echo "📦 First run detected - initializing database..."

  # 推送 schema 创建表
  echo "🔄 Creating database tables..."
  npx prisma db push --accept-data-loss

  # 填充初始数据
  echo "🌱 Seeding database..."
  if npx tsx prisma/seed.ts; then
    echo "✅ Database seeded successfully!"
  else
    echo "⚠️  Database seeding failed or already seeded"
  fi
else
  echo "ℹ️  Database already initialized ($TABLE_COUNT tables found)"
fi

echo "🎉 Application is ready to start!"

# 执行传入的命令
exec "$@"

echo "🎉 Application is ready to start!"

# 执行传入的命令
exec "$@"
